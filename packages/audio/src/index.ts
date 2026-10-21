import type { AudioAssetRecord } from "@thiepn/content-schema";

const AUDIO_CACHE="japanese-audio-v1";

export interface AudioPlaybackOptions {
  rate?: number;
  repeats?: number;
  gapMs?: number;
  startMs?: number;
  endMs?: number;
}

export interface AudioCacheSummary {
  cached: number;
  total: number;
}

export interface AudioProvider {
  play(asset:AudioAssetRecord,options?:AudioPlaybackOptions):Promise<void>;
  prefetch(assets:readonly AudioAssetRecord[]):Promise<AudioCacheSummary>;
  stop():void;
}

export class BrowserAudioProvider implements AudioProvider {
  private current:HTMLAudioElement|null=null;
  private currentObjectUrl:string|null=null;
  private resolveCurrent:(()=>void)|null=null;
  private generation=0;

  async play(asset:AudioAssetRecord,options:AudioPlaybackOptions={}):Promise<void>{
    this.stop();
    const generation=this.generation;
    const repeats=Math.max(1,Math.min(3,options.repeats??1));
    const rate=Math.max(0.65,Math.min(1.25,options.rate??1));
    const gap=Math.max(0,Math.min(2500,options.gapMs??650));
    // Start the media element before the first await. Waiting for CacheStorage
    // or loadedmetadata can lose transient touch activation on Android browsers.
    const audio=new Audio(asset.url);
    audio.preload="auto";
    audio.playbackRate=rate;
    this.current=audio;
    let cachedObjectUrl:string|null=null;
    try{
      for(let index=0;index<repeats;index++){
        if(generation!==this.generation)return;
        try{
          await this.playOnce(audio,generation,options.startMs,options.endMs);
        }catch(error){
          if(generation!==this.generation)return;
          // A cached source can rescue a missing/offline URL, but not a
          // browser permission denial. Never mark failed audio as completed.
          if(cachedObjectUrl||((error as {name?:string})?.name==="NotAllowedError"))throw error;
          const source=await this.resolveSource(asset);
          if(generation!==this.generation){
            if(source.objectUrl)URL.revokeObjectURL(source.objectUrl);
            return;
          }
          if(!source.objectUrl)throw error;
          cachedObjectUrl=source.objectUrl;
          this.currentObjectUrl=cachedObjectUrl;
          audio.src=cachedObjectUrl;
          audio.load();
          await this.playOnce(audio,generation,options.startMs,options.endMs);
        }
        if(index+1<repeats&&generation===this.generation)await delay(gap);
      }
    }finally{
      if(this.current===audio){
        this.current=null;
        this.resolveCurrent=null;
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      if(cachedObjectUrl){
        URL.revokeObjectURL(cachedObjectUrl);
        if(this.currentObjectUrl===cachedObjectUrl)this.currentObjectUrl=null;
      }
    }
  }

  async prefetch(assets:readonly AudioAssetRecord[]):Promise<AudioCacheSummary>{
    if(typeof caches==="undefined"||typeof fetch==="undefined")return {cached:0,total:assets.length};
    const cache=await caches.open(AUDIO_CACHE);
    let cached=0;
    for(const asset of assets){
      try{
        const existing=await cache.match(asset.url);
        if(existing){cached++;continue;}
        const response=await fetch(asset.url,{mode:"cors",cache:"force-cache"});
        if(response.ok){await cache.put(asset.url,response.clone());cached++;}
      }catch{/* playback can still fall back to the network */}
    }
    return {cached,total:assets.length};
  }

  stop():void{
    this.generation++;
    // Settle the pending pass before changing the media source. Otherwise a
    // browser abort/error event can turn navigation into a failed playback.
    const cancel=this.resolveCurrent;
    this.resolveCurrent=null;
    cancel?.();
    if(this.current){
      this.current.pause();
      this.current.removeAttribute("src");
      this.current.load();
    }
    this.current=null;
    if(this.currentObjectUrl){
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl=null;
    }
  }

  private playOnce(audio:HTMLAudioElement,generation:number,startMs?:number,endMs?:number):Promise<void>{
    if(generation!==this.generation)return Promise.resolve();
    const startSeconds=Math.max(0,startMs??0)/1000;
    const endSeconds=endMs===undefined?null:Math.max(startMs??0,endMs)/1000;
    return new Promise<void>((resolve,reject)=>{
      let settled=false;
      const cleanup=()=>{
        audio.onloadedmetadata=null;
        audio.ontimeupdate=null;
        audio.onended=null;
        audio.onerror=null;
        if(this.resolveCurrent===cancel)this.resolveCurrent=null;
      };
      const finish=()=>{
        if(settled)return;
        settled=true;
        audio.pause();
        cleanup();
        resolve();
      };
      const fail=(error:unknown)=>{
        if(settled)return;
        settled=true;
        audio.pause();
        cleanup();
        reject(error);
      };
      const cancel=()=>{
        if(settled)return;
        settled=true;
        cleanup();
        resolve();
      };
      const seek=()=>{
        try{
          const length=Number.isFinite(audio.duration)?Math.max(0,audio.duration-.01):startSeconds;
          audio.currentTime=Math.min(startSeconds,length);
        }catch{/* Retry when metadata arrives. */}
      };
      this.resolveCurrent=cancel;
      audio.onloadedmetadata=seek;
      audio.ontimeupdate=()=>{if(endSeconds!==null&&audio.currentTime>=endSeconds)finish();};
      audio.onended=finish;
      audio.onerror=()=>fail(new Error("AUDIO_PLAYBACK_FAILED"));
      // Set the target before playback when possible; do not delay play() for
      // metadata, as that can invalidate the initiating user gesture.
      seek();
      try{
        void audio.play().catch(fail);
      }catch(error){fail(error);}
    });
  }

  private async resolveSource(asset:AudioAssetRecord):Promise<{url:string;objectUrl?:string}>{
    if(typeof caches==="undefined")return {url:asset.url};
    try{
      const cache=await caches.open(AUDIO_CACHE);
      const cached=await cache.match(asset.url);
      if(cached){
        const blob=await cached.blob();
        const objectUrl=URL.createObjectURL(blob);
        return {url:objectUrl,objectUrl};
      }
    }catch{/* direct URL already failed */}
    return {url:asset.url};
  }
}

let defaultProvider:BrowserAudioProvider|null=null;
export function getDefaultAudioProvider():BrowserAudioProvider {
  defaultProvider??=new BrowserAudioProvider();
  return defaultProvider;
}

export async function isAudioCached(asset:AudioAssetRecord):Promise<boolean>{
  if(typeof caches==="undefined")return false;
  try{return Boolean(await (await caches.open(AUDIO_CACHE)).match(asset.url));}catch{return false;}
}

function delay(ms:number):Promise<void>{return new Promise((resolve)=>setTimeout(resolve,ms));}
