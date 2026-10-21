import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {createDeviceSpeechPlayback} from "../../apps/web/src/study/deviceSpeech";

class MockUtterance {
  lang="";rate=1;voice:SpeechSynthesisVoice|null=null;
  onend:(()=>void)|null=null;
  onerror:(()=>void)|null=null;
  constructor(readonly text:string){}
}
let utterances:MockUtterance[];
let speak:ReturnType<typeof vi.fn>;
let cancel:ReturnType<typeof vi.fn>;
let resume:ReturnType<typeof vi.fn>;

beforeEach(()=>{
  utterances=[];
  speak=vi.fn((value:MockUtterance)=>{utterances.push(value);});
  cancel=vi.fn();
  resume=vi.fn();
  vi.stubGlobal("SpeechSynthesisUtterance",MockUtterance);
  vi.stubGlobal("speechSynthesis",{
    speak,cancel,resume,paused:false,
    getVoices:()=>[{lang:"ja-JP",name:"Japanese device voice"}]
  });
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});

describe("Japanese browser speech shared playback",()=>{
  it("starts speaking in the user gesture, without waiting for voice events",async()=>{
    const player=createDeviceSpeechPlayback();
    const finished=player.play(["こんにちは"],{rate:.9});
    expect(speak).toHaveBeenCalledOnce();
    expect(cancel).not.toHaveBeenCalled();
    expect(utterances[0]?.text).toBe("こんにちは");
    expect(utterances[0]?.lang).toBe("ja-JP");
    expect(utterances[0]?.voice).toMatchObject({lang:"ja-JP"});
    expect(player.playing).toBe(true);
    utterances[0]!.onend?.();
    expect(await finished).toBe("completed");
    expect(player.playing).toBe(false);
  });

  it("plays original turns sequentially and preserves the rate and onTurn order",async()=>{
    const player=createDeviceSpeechPlayback();
    const turns:number[]=[];
    const done=player.play(["第一声","第二声"],{rate:.75,onTurn:index=>turns.push(index)});
    expect(turns).toEqual([0]);
    utterances[0]!.onend?.();
    expect(turns).toEqual([0,1]);
    expect(utterances[1]!.rate).toBe(.75);
    utterances[1]!.onend?.();
    expect(await done).toBe("completed");
  });

  it("stops active voice with a settled cancellation and ignores late onend",async()=>{
    const player=createDeviceSpeechPlayback();
    const turns:number[]=[];
    const done=player.play(["第一声","第二声"],{onTurn:index=>turns.push(index)});
    const original=utterances[0]!;
    player.stop();
    expect(await done).toBe("cancelled");
    expect(cancel).toHaveBeenCalledOnce();
    original.onend?.();
    expect(utterances).toHaveLength(1);
    expect(turns).toEqual([0]);
    expect(player.playing).toBe(false);
  });

  it("prevents a late repeat timer from speaking after navigating away",async()=>{
    vi.useFakeTimers();
    const player=createDeviceSpeechPlayback();
    const done=player.play(["第一声","第一声"],{gapMs:450});
    utterances[0]!.onend?.();
    player.stop();
    await vi.runAllTimersAsync();
    expect(await done).toBe("cancelled");
    expect(speak).toHaveBeenCalledOnce();
  });

  it("new lesson speech cancels old reader speech without granting the old completion",async()=>{
    const reader=createDeviceSpeechPlayback();
    const lesson=createDeviceSpeechPlayback();
    const earlier=reader.play(["古い本文"]);
    const old=utterances[0]!;
    const current=lesson.play(["新しい単語"]);
    expect(await earlier).toBe("cancelled");
    expect(cancel).toHaveBeenCalledOnce();
    expect(utterances).toHaveLength(2);
    old.onend?.();
    utterances[1]!.onend?.();
    expect(await current).toBe("completed");
    expect(reader.playing).toBe(false);
  });

  it("rejects device errors without claiming successful listening",async()=>{
    const player=createDeviceSpeechPlayback();
    const done=player.play(["日本語"]);
    utterances[0]!.onerror?.();
    await expect(done).rejects.toThrow("DEVICE_SPEECH_FAILED");
    expect(player.playing).toBe(false);
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("fails visibly if speech synthesis or its utterance constructor is missing",async()=>{
    const player=createDeviceSpeechPlayback();
    vi.stubGlobal("SpeechSynthesisUtterance",undefined);
    await expect(player.play(["日本語"])).rejects.toThrow("DEVICE_SPEECH_UNAVAILABLE");
    expect(speak).not.toHaveBeenCalled();
    expect(player.playing).toBe(false);
  });

  it("resumes a paused browser voice and preserves device voice fallback",async()=>{
    const player=createDeviceSpeechPlayback();
    vi.stubGlobal("speechSynthesis",{
      speak,cancel,resume,paused:true,getVoices:()=>[]
    });
    const done=player.play(["日本語"]);
    expect(resume).toHaveBeenCalledOnce();
    expect(utterances[0]!.voice).toBeNull();
    utterances[0]!.onend?.();
    expect(await done).toBe("completed");
  });

  it("rejects malformed original cues without invoking audio",async()=>{
    const player=createDeviceSpeechPlayback();
    await expect(player.play([""])).rejects.toThrow("DEVICE_SPEECH_EMPTY_CUE");
    expect(speak).not.toHaveBeenCalled();
  });
});
