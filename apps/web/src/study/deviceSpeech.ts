/**
 * Shared, cancellable browser Japanese speech. This is device-synthesized
 * audio, not an attributed native recording or a pronunciation assessment.
 */
export type DeviceSpeechResult="completed"|"cancelled";
export interface DeviceSpeechOptions {
  rate?:number;
  language?:string;
  gapMs?:number;
  onTurn?:(index:number)=>void;
}
export interface DeviceSpeechPlayback {
  readonly playing:boolean;
  play(texts:readonly string[],options?:DeviceSpeechOptions):Promise<DeviceSpeechResult>;
  stop():void;
}

let currentSpeaker:DeviceSpeechPlayback|null=null;

export function createDeviceSpeechPlayback():DeviceSpeechPlayback{
  let generation=0;
  let active=false;
  let cancelPending:(()=>void)|null=null;

  const stop=()=>{
    generation++;
    cancelPending?.();
  };
  const controller:DeviceSpeechPlayback={
    get playing(){return active;},
    stop,
    play(texts,options={}){
      stop();
      if(!texts.length)return Promise.resolve("completed");
      if(texts.some(text=>!text.trim()))return Promise.reject(Error("DEVICE_SPEECH_EMPTY_CUE"));
      if(typeof speechSynthesis==="undefined"||typeof SpeechSynthesisUtterance==="undefined")
        return Promise.reject(Error("DEVICE_SPEECH_UNAVAILABLE"));
      // Every app surface owns its own controller, but a browser can only
      // speak one queue. Settle the old owner's promise before cancelling it.
      currentSpeaker?.stop();
      const ticket=generation;
      const synthesis=speechSynthesis;
      const rate=Math.min(1.25,Math.max(.65,options.rate??1));
      const language=options.language??"ja-JP";
      const gapMs=Math.min(2500,Math.max(0,options.gapMs??0));
      return new Promise<DeviceSpeechResult>((resolve,reject)=>{
        let settled=false;
        let index=0;
        let gapTimer:ReturnType<typeof setTimeout>|null=null;
        let utterance:SpeechSynthesisUtterance|null=null;
        const cleanup=()=>{
          if(gapTimer!==null){clearTimeout(gapTimer);gapTimer=null;}
          if(utterance){utterance.onend=null;utterance.onerror=null;utterance=null;}
          if(cancelPending===cancel)cancelPending=null;
          if(currentSpeaker===controller)currentSpeaker=null;
          active=false;
        };
        const cancel=()=>{
          if(settled)return;
          settled=true;
          cleanup();
          try{synthesis.cancel();}catch{/* Cancellation already settled the caller. */}
          resolve("cancelled");
        };
        const fail=()=>{
          if(settled)return;
          settled=true;
          cleanup();
          try{synthesis.cancel();}catch{/* Best effort only. */}
          reject(Error("DEVICE_SPEECH_FAILED"));
        };
        const next=()=>{
          if(settled)return;
          if(ticket!==generation){cancel();return;}
          if(index>=texts.length){
            settled=true;
            cleanup();
            resolve("completed");
            return;
          }
          try{
            const speaking=new SpeechSynthesisUtterance(texts[index]!);
            utterance=speaking;
            speaking.lang=language;
            speaking.rate=rate;
            const preferred=synthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith(language.slice(0,2).toLowerCase()));
            if(preferred)speaking.voice=preferred;
            options.onTurn?.(index);
            speaking.onend=()=>{
              if(settled||ticket!==generation)return;
              speaking.onend=null;speaking.onerror=null;
              index++;
              if(index>=texts.length){next();return;}
              if(gapMs>0)gapTimer=setTimeout(()=>{gapTimer=null;next();},gapMs);
              else next();
            };
            speaking.onerror=fail;
            // Call speak synchronously in the initiating tap, without
            // voice-load promises, timers or other awaited operations.
            synthesis.speak(speaking);
            if(synthesis.paused)synthesis.resume();
          }catch{fail();}
        };
        cancelPending=cancel;
        currentSpeaker=controller;
        active=true;
        next();
      });
    }
  };
  return controller;
}
