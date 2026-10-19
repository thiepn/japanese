import {createDeviceSpeechPlayback} from "./deviceSpeech";

/**
 * The E16 rehearsal keeps original speaker/turn identity and ungraded voice
 * evidence. It shares the same cancellable browser speech queue as the reader.
 */
export type E16AudioResult="completed"|"cancelled";
export interface E16AudioCue{japanese:string}
export interface E16AudioPlayback {
  play(cues:readonly E16AudioCue[],rate:number,onTurn:(index:number)=>void):Promise<E16AudioResult>;
  stop():void;
  readonly playing:boolean;
}
const MIN_RATE=0.75;
const MAX_RATE=1.05;

export function createE16AudioPlayback():E16AudioPlayback{
  const device=createDeviceSpeechPlayback();
  return {
    get playing(){return device.playing;},
    stop(){device.stop();},
    async play(cues,rate,onTurn){
      if(!cues.length){device.stop();return "completed";}
      if(cues.some(cue=>!cue||!cue.japanese.trim()))throw Error("E16_EMPTY_ORIGINAL_VOICE_CUE");
      try{
        return await device.play(cues.map(cue=>cue.japanese),{
          rate:Math.min(MAX_RATE,Math.max(MIN_RATE,rate)),
          language:"ja-JP",
          onTurn
        });
      }catch(error){
        if(error instanceof Error&&error.message==="DEVICE_SPEECH_UNAVAILABLE")
          throw Error("E16_DEVICE_JAPANESE_VOICE_UNAVAILABLE");
        throw Error("E16_DEVICE_JAPANESE_VOICE_FAILED");
      }
    }
  };
}
