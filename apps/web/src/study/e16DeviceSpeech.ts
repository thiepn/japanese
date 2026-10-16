/**
 * E16 uses the browser's Japanese speech synthesis, not a recorded/native
 * voice asset. This controller has cancellation and owner/session generation
 * fencing so a late utterance cannot move the next speaker after navigation.
 * No microphone, recorder, network API or audio persistence is accessed.
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
  let generation=0;
  let active=false;
  let pendingResolve:((result:E16AudioResult)=>void)|null=null;

  function stop(){
    generation++;
    if(!active)return;
    active=false;
    // Resolve the in-flight utterance BEFORE cancelling the browser. Clearing
    // pendingResolve first would strand the awaiting play() Promise forever.
    const finish=pendingResolve;
    finish?.("cancelled");
    if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();
  }

  function speakOne(text:string,rate:number,ticket:number):Promise<E16AudioResult>{
    if(ticket!==generation)return Promise.resolve("cancelled");
    if(typeof speechSynthesis==="undefined"||typeof SpeechSynthesisUtterance==="undefined")
      return Promise.reject(Error("E16_DEVICE_JAPANESE_VOICE_UNAVAILABLE"));
    return new Promise((resolve,reject)=>{
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.lang="ja-JP";
      utterance.rate=Math.max(MIN_RATE,Math.min(MAX_RATE,rate));
      try {
        const japanese=speechSynthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith("ja"));
        if(japanese)utterance.voice=japanese;
        const finish=(result:E16AudioResult)=>{
          if(pendingResolve!==finish)return;
          pendingResolve=null;
          active=false;
          utterance.onend=null;
          utterance.onerror=null;
          resolve(result);
        };
        utterance.onend=()=>finish(ticket===generation?"completed":"cancelled");
        utterance.onerror=()=>{
          if(pendingResolve!==finish)return;
          pendingResolve=null;
          active=false;
          reject(Error("E16_DEVICE_JAPANESE_VOICE_FAILED"));
        };
        pendingResolve=finish;
        active=true;
        speechSynthesis.speak(utterance);
      }catch{
        pendingResolve=null;active=false;
        reject(Error("E16_DEVICE_JAPANESE_VOICE_FAILED"));
      }
    });
  }

  return {
    get playing(){return active;},
    stop,
    async play(cues,rate,onTurn){
      stop();
      if(!cues.length)return "completed";
      const ticket=generation;
      for(let i=0;i<cues.length;i++){
        if(ticket!==generation)return "cancelled";
        const cue=cues[i];
        if(!cue||!cue.japanese.trim())throw Error("E16_EMPTY_ORIGINAL_VOICE_CUE");
        onTurn(i);
        const result=await speakOne(cue.japanese,rate,ticket);
        if(result==="cancelled"||ticket!==generation)return "cancelled";
      }
      return "completed";
    },
  };
}
