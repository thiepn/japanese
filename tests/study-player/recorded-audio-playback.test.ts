import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import type {AudioAssetRecord} from "@thiepn/content-schema";
import {BrowserAudioProvider} from "../../packages/audio/src/index";

const asset={id:"clip",url:"https://example.org/clip.ogg",kind:"word",language:"ja",text:"こんにちは",format:"ogg",credit:"test",sourceIds:["test"],nativeSpeaker:true} as AudioAssetRecord;

class FakeAudio {
  static instances:FakeAudio[]=[];
  static failNetwork=false;
  static denyPermission=false;
  static hold=false;
  src:string;
  preload="";
  playbackRate=1;
  currentTime=0;
  duration=4;
  readyState=1;
  onloadedmetadata:(()=>void)|null=null;
  ontimeupdate:(()=>void)|null=null;
  onended:(()=>void)|null=null;
  onerror:(()=>void)|null=null;
  plays=0;
  pauses=0;
  constructor(source:string){
    this.src=source;
    FakeAudio.instances.push(this);
  }
  play():Promise<void>{
    this.plays++;
    if(FakeAudio.denyPermission)return Promise.reject(Object.assign(new Error("blocked"),{name:"NotAllowedError"}));
    if(FakeAudio.failNetwork&&this.src===asset.url)return Promise.reject(new Error("network unavailable"));
    if(!FakeAudio.hold)queueMicrotask(()=>this.onended?.());
    return Promise.resolve();
  }
  pause(){this.pauses++;}
  load(){}
  removeAttribute(name:string){if(name==="src")this.src="";}
}

describe("recorded audio mobile playback",()=>{
  beforeEach(()=>{
    FakeAudio.instances=[];
    FakeAudio.failNetwork=false;
    FakeAudio.denyPermission=false;
    FakeAudio.hold=false;
    vi.stubGlobal("Audio",FakeAudio);
    vi.stubGlobal("caches",{open:vi.fn().mockRejectedValue(new Error("cache unavailable"))});
  });
  afterEach(()=>vi.unstubAllGlobals());

  it("starts play synchronously during the tap, without waiting for CacheStorage or metadata",async()=>{
    const provider=new BrowserAudioProvider();
    const completion=provider.play(asset);
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0]!.plays).toBe(1);
    expect(FakeAudio.instances[0]!.src).toBe(asset.url);
    expect(caches.open).not.toHaveBeenCalled();
    await completion;
    expect(FakeAudio.instances[0]!.pauses).toBeGreaterThan(0);
  });

  it("uses the same activated audio element for slow and repeated playback",async()=>{
    const provider=new BrowserAudioProvider();
    await provider.play(asset,{rate:.82,repeats:3,gapMs:0});
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0]!.plays).toBe(3);
    expect(FakeAudio.instances[0]!.playbackRate).toBe(.82);
  });

  it("stops an in-flight recording without replaying it or leaving a pending promise",async()=>{
    FakeAudio.hold=true;
    const provider=new BrowserAudioProvider();
    const completion=provider.play(asset,{repeats:3,gapMs:0});
    expect(FakeAudio.instances[0]!.plays).toBe(1);
    provider.stop();
    await completion;
    expect(FakeAudio.instances[0]!.plays).toBe(1);
    expect(FakeAudio.instances[0]!.src).toBe("");
  });

  it("uses verified cached bytes if the direct recording URL is unreachable",async()=>{
    FakeAudio.failNetwork=true;
    const revoke=vi.fn();
    vi.stubGlobal("URL",{createObjectURL:vi.fn(()=>"blob:cached-recording"),revokeObjectURL:revoke});
    const match=vi.fn(async()=>new Response(new Blob(["valid cached recording"])));
    const open=vi.fn(async()=>({match}));
    vi.stubGlobal("caches",{open});
    const provider=new BrowserAudioProvider();
    await provider.play(asset);
    expect(open).toHaveBeenCalledWith("japanese-audio-v1");
    expect(FakeAudio.instances[0]!.plays).toBe(2);
    expect(match).toHaveBeenCalledWith(asset.url);
    expect(revoke).toHaveBeenCalledWith("blob:cached-recording");
  });

  it("does not confuse autoplay denial with missing network audio or completed listening",async()=>{
    FakeAudio.denyPermission=true;
    const provider=new BrowserAudioProvider();
    await expect(provider.play(asset)).rejects.toMatchObject({name:"NotAllowedError"});
    expect(caches.open).not.toHaveBeenCalled();
  });

  it("does not mark a failed uncached recording as successfully played",async()=>{
    FakeAudio.failNetwork=true;
    const provider=new BrowserAudioProvider();
    await expect(provider.play(asset)).rejects.toThrow("network unavailable");
    expect(FakeAudio.instances[0]!.plays).toBe(1);
  });
});
