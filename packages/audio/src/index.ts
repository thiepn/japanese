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
    for(let index=0;index<repeats;index++){
      if(generation!==this.generation)return;
      await this.playOnce(asset,rate,generation,options.startMs,options.endMs);
      if(index+1<repeats&&generation===this.generation)await delay(gap);
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
    if(this.current){this.current.pause();this.current.removeAttribute("src");this.current.load();}
    this.current=null;
    this.resolveCurrent?.();
    this.resolveCurrent=null;
    if(this.currentObjectUrl){URL.revokeObjectURL(this.currentObjectUrl);this.currentObjectUrl=null;}
  }

  private async playOnce(asset:AudioAssetRecord,rate:number,generation:number,startMs?:number,endMs?:number):Promise<void>{
    const source=await this.resolveSource(asset);
    if(generation!==this.generation){if(source.objectUrl)URL.revokeObjectURL(source.objectUrl);return;}
    const audio=new Audio(source.url);
    this.current=audio;
    this.currentObjectUrl=source.objectUrl??null;
    audio.preload="auto";
    audio.playbackRate=rate;
    const startSeconds=Math.max(0,startMs??0)/1000;
    const endSeconds=endMs===undefined?null:Math.max(startMs??0,endMs)/1000;
    await new Promise<void>((resolve,reject)=>{
      this.resolveCurrent=resolve;
      let started=false;
      const cleanup=()=>{audio.onloadedmetadata=null;audio.ontimeupdate=null;audio.onended=null;audio.onerror=null;this.resolveCurrent=null;};
      const finish=()=>{audio.pause();cleanup();resolve();};
      const start=()=>{
        if(started)return;started=true;
        if(startSeconds>0&&Number.isFinite(audio.duration))audio.currentTime=Math.min(startSeconds,Math.max(0,audio.duration-.01));
        audio.play().catch((error)=>{cleanup();reject(error);});
      };
      audio.onloadedmetadata=start;
      audio.ontimeupdate=()=>{if(endSeconds!==null&&audio.currentTime>=endSeconds)finish();};
      audio.onended=()=>{cleanup();resolve();};
      audio.onerror=()=>{cleanup();reject(new Error("AUDIO_PLAYBACK_FAILED"));};
      if(audio.readyState>=1)start();else audio.load();
    }).finally(()=>{
      if(this.current===audio)this.current=null;
      if(source.objectUrl){URL.revokeObjectURL(source.objectUrl);if(this.currentObjectUrl===source.objectUrl)this.currentObjectUrl=null;}
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
    }catch{/* direct URL fallback */}
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
