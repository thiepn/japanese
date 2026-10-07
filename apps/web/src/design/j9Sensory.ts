export type J9FeedbackKind="navigate"|"success"|"correction"|"enable";

const KEY="japanese:j-sensory";
let context:AudioContext|null=null;

export function readJ9SensoryEnabled():boolean{
  try{return window.localStorage.getItem(KEY)==="on";}catch{return false;}
}

export function setJ9SensoryEnabled(enabled:boolean):void{
  try{window.localStorage.setItem(KEY,enabled?"on":"off");}catch{/* optional storage */}
}

export function j9SensoryFeedback(kind:J9FeedbackKind,force=false):void{
  if(!force&&!readJ9SensoryEnabled())return;

  try{
    if("vibrate" in navigator){
      const pulse=kind==="success"?[10,18,16]:kind==="correction"?[14]:kind==="enable"?[8,24,8]:[7];
      navigator.vibrate(pulse);
    }
  }catch{/* optional platform feedback */}

  void playTone(kind).catch(()=>undefined);
}

async function playTone(kind:J9FeedbackKind):Promise<void>{
  const w=window as typeof window&{webkitAudioContext?:typeof AudioContext};
  const Ctor=window.AudioContext??w.webkitAudioContext;
  if(!Ctor)return;

  context??=new Ctor();
  if(context.state==="suspended")await context.resume();

  const now=context.currentTime;
  const oscillator=context.createOscillator();
  const gain=context.createGain();

  const frequency=kind==="success"?560:kind==="correction"?240:kind==="enable"?430:360;
  const duration=kind==="success"?.07:.045;
  oscillator.type="sine";
  oscillator.frequency.setValueAtTime(frequency,now);

  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(.018,now+.008);
  gain.gain.exponentialRampToValueAtTime(.0001,now+duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now+duration+.01);

  if(kind==="success"){
    const second=context.createOscillator();
    const secondGain=context.createGain();
    second.type="sine";
    second.frequency.setValueAtTime(700,now+.045);
    secondGain.gain.setValueAtTime(.0001,now+.04);
    secondGain.gain.exponentialRampToValueAtTime(.012,now+.052);
    secondGain.gain.exponentialRampToValueAtTime(.0001,now+.105);
    second.connect(secondGain);
    secondGain.connect(context.destination);
    second.start(now+.04);
    second.stop(now+.115);
  }
}
