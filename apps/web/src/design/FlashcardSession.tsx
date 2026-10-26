import {useCallback,useEffect,useRef,useState} from "react";
import {
  asFlashcard,advanceFlashcardQueue,DEFAULT_FLASHCARD_LIMITS,FLASHCARD_GRADES,
  nextAvailableFlashcard,nextFlashcardWaitMs,normalizedFlashcardLimits,openFlashcardQueue,
  withoutFlashcard,type FlashcardGrade,type FlashcardLimits,type PendingFlashcard
} from "../study/flashcards";
import {kanaReviewPrompts,kanaReviewTraceId,type KanaReviewScript,type KanaReviewSkill} from "../study/kanaReview";
import {
  getDevelopmentAccountId,getKanaFlashcardDeck,getKanaFlashcardLimits,recordKanaFlashcardGrade,
  saveKanaFlashcardLimits,setKanaFlashcardSuspended,undoKanaFlashcardGrade,
  type FlashcardReviewReceipt
} from "../study/runtime";
import "./flashcardSession.css";

const CHOICES:readonly {id:FlashcardGrade;label:string;key:string}[]=[
  {id:"again",label:"Again",key:"1"},{id:"hard",label:"Hard",key:"2"},
  {id:"good",label:"Good",key:"3"},{id:"easy",label:"Easy",key:"4"}
];
const CARD_PROMPTS=new Map(kanaReviewPrompts.map(prompt=>[kanaReviewTraceId(prompt),prompt]));
type LastReview={receipt:FlashcardReviewReceipt;before:PendingFlashcard[];reviewed:number};

function formatWait(ms:number):string{
  const seconds=Math.ceil(ms/1000);
  if(seconds<60)return seconds+"s";
  const minutes=Math.floor(seconds/60);
  return minutes+"m "+String(seconds%60).padStart(2,"0")+"s";
}
export function FlashcardSession({script,skill,onClose}:{
  script:KanaReviewScript;skill:KanaReviewSkill;onClose:()=>void;
}){
  const owner=useRef(getDevelopmentAccountId());
  const request=useRef(0);
  const lock=useRef(false);
  const started=useRef(0);
  const cardButton=useRef<HTMLButtonElement>(null);
  const [limits,setLimits]=useState<FlashcardLimits>(DEFAULT_FLASHCARD_LIMITS);
  const [queue,setQueue]=useState<PendingFlashcard[]|null>(null);
  const [suspended,setSuspended]=useState<string[]>([]);
  const [reviewed,setReviewed]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [managed,setManaged]=useState(false);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [last,setLast]=useState<LastReview|null>(null);
  const [nowMs,setNowMs]=useState(()=>Date.now());

  const load=useCallback(async(next:FlashcardLimits)=>{
    const generation=++request.current;
    if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
    const deck=await getKanaFlashcardDeck(script,skill,next);
    if(generation!==request.current)return;
    if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
    setQueue(openFlashcardQueue(deck.cards));
    setSuspended(deck.suspended);
    setReviewed(0);setRevealed(false);setLast(null);setError("");
    setNowMs(Date.now());started.current=performance.now();
  },[script,skill]);

  useEffect(()=>{
    let live=true;
    const generation=++request.current;
    void (async()=>{
      const saved=await getKanaFlashcardLimits(script,skill);
      const cap=saved??DEFAULT_FLASHCARD_LIMITS;
      const deck=await getKanaFlashcardDeck(script,skill,cap);
      if(!live||request.current!==generation)return;
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      setLimits(cap);setQueue(openFlashcardQueue(deck.cards));
      setSuspended(deck.suspended);setNowMs(Date.now());
      started.current=performance.now();
    })().catch(e=>{if(live)setError(e instanceof Error?e.message:"Cards could not be loaded.");});
    return()=>{live=false;++request.current;};
  },[script,skill]);

  useEffect(()=>{
    if(!queue?.length)return;
    if(nextAvailableFlashcard(queue,nowMs)>=0)return;
    const timer=window.setInterval(()=>setNowMs(Date.now()),1000);
    return()=>window.clearInterval(timer);
  },[queue,nowMs]);

  const activeIndex=queue?nextAvailableFlashcard(queue,nowMs):-1;
  const current=activeIndex>=0?queue![activeIndex]!.card:null;
  const wait=queue&&queue.length>0&&activeIndex===-1?nextFlashcardWaitMs(queue,nowMs):null;
  useEffect(()=>{
    if(current&&!revealed&&!settingsOpen&&!managed)cardButton.current?.focus({preventScroll:true});
  },[current?.id,revealed,settingsOpen,managed]);
  const reveal=useCallback(()=>{if(current&&!busy)setRevealed(true);},[current,busy]);

  const rate=useCallback(async(grade:FlashcardGrade)=>{
    if(!current||!revealed||activeIndex<0||lock.current)return;
    lock.current=true;setBusy(true);setError("");
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      const receipt=await recordKanaFlashcardGrade(current,grade,performance.now()-started.current);
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      const before=queue!;
      const next=advanceFlashcardQueue(before,activeIndex,receipt.updated);
      setLast({receipt,before,reviewed});
      setQueue(next);setReviewed(n=>n+1);setRevealed(false);
      setNowMs(Date.now());started.current=performance.now();
    }catch(e){setError(e instanceof Error?e.message:"Review could not be saved.");}
    finally{lock.current=false;setBusy(false);}
  },[current,revealed,queue,activeIndex,reviewed]);

  const suspend=useCallback(async()=>{
    if(!current||lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await setKanaFlashcardSuspended(current.id,true);
      setQueue(value=>value?withoutFlashcard(value,current.id):value);
      setSuspended(value=>[...new Set([...value,current.id])]);
      setLast(null);setRevealed(false);setError("");
      setNowMs(Date.now());started.current=performance.now();
    }catch(e){setError(e instanceof Error?e.message:"Suspend failed.");}
    finally{lock.current=false;setBusy(false);}
  },[current]);

  const restore=useCallback(async(id:string)=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await setKanaFlashcardSuspended(id,false);
      setSuspended(value=>value.filter(item=>item!==id));setLast(null);setError("");
    }catch(e){setError(e instanceof Error?e.message:"Restore failed.");}
    finally{lock.current=false;setBusy(false);}
  },[]);

  const undo=useCallback(async()=>{
    if(!last||lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await undoKanaFlashcardGrade(last.receipt);
      setQueue(last.before);setReviewed(last.reviewed);
      setRevealed(true);setLast(null);setError("");
      setNowMs(Date.now());started.current=performance.now();
    }catch(e){setError(e instanceof Error?e.message:"Undo unavailable after sync or another review.");}
    finally{lock.current=false;setBusy(false);}
  },[last]);

  const applyLimits=useCallback(async()=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);
    try{
      const cap=normalizedFlashcardLimits(limits);
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await saveKanaFlashcardLimits(script,skill,cap);
      await load(cap);
      setLimits(cap);setSettingsOpen(false);
    }catch(e){setError(e instanceof Error?e.message:"Deck settings could not be saved.");}
    finally{lock.current=false;setBusy(false);}
  },[limits,script,skill,load]);

  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(event.ctrlKey||event.altKey||event.metaKey||event.isComposing||
        event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||
        event.target instanceof HTMLSelectElement)return;
      if(event.key==="Escape"){event.preventDefault();onClose();return;}
      if(event.key===" "||event.key==="Enter"){
        if(event.target instanceof HTMLButtonElement)return;
        if(!revealed&&current){event.preventDefault();reveal();}
        return;
      }
      if(revealed&&/^[1-4]$/.test(event.key)){
        event.preventDefault();void rate(FLASHCARD_GRADES[Number(event.key)-1]!);
      }
      if(event.key.toLowerCase()==="u"&&last){event.preventDefault();void undo();}
    };
    document.addEventListener("keydown",onKey);
    return()=>document.removeEventListener("keydown",onKey);
  },[onClose,revealed,current,last,rate,reveal,undo]);

  const title=script==="mixed"?"Hiragana & Katakana":script==="hiragana"?"Hiragana":"Katakana";
  return <div className="flashcards-overlay">
    <section className="flashcards-panel" role="dialog" aria-modal="true" aria-label="Kana flashcards">
      <header className="flashcards-header">
        <div><h2>{title}</h2><span>{reviewed} reviewed · {queue?.length??0} pending</span></div>
        <div className="flashcards-header__actions">
          <button type="button" onClick={()=>setSettingsOpen(open=>!open)} aria-expanded={settingsOpen}>Deck settings</button>
          <button type="button" onClick={()=>setManaged(open=>!open)} aria-expanded={managed}>Suspended ({suspended.length})</button>
          <button type="button" onClick={onClose} aria-label="Close flashcards">Close</button>
        </div>
      </header>
      {settingsOpen?<section className="flashcards-manage" aria-label="Deck settings">
        <div className="flashcards-settings">
          <label>New cards <input aria-label="New cards per session" type="number" min="0" max="30" value={limits.newCards}
            onChange={e=>setLimits(v=>({...v,newCards:Number(e.target.value)}))}/></label>
          <label>Reviews <input aria-label="Reviews per session" type="number" min="0" max="100" value={limits.reviews}
            onChange={e=>setLimits(v=>({...v,reviews:Number(e.target.value)}))}/></label>
        </div>
        <button type="button" disabled={busy} onClick={()=>void applyLimits()}>Save limits and restart deck</button>
      </section>:null}
      {managed?<section className="flashcards-manage" aria-label="Manage suspended cards">
        {suspended.length===0?<p>No suspended cards.</p>:
          <ul>{suspended.map(id=>{
            const prompt=CARD_PROMPTS.get(id);
            const card=prompt?asFlashcard(prompt):null;
            return <li key={id}><span lang={card?.prompt.promptLanguage==="ja"?"ja":undefined}>{card?.front??id} · {card?.back??""}</span>
              <button disabled={busy} type="button" onClick={()=>void restore(id)}>Restore</button></li>;
          })}</ul>}
      </section>:null}
      {error?<p className="flashcards-error" role="alert">{error}</p>:null}
      {queue===null?<p role="status">Loading flashcards…</p>:
        current?<div className="flashcards-study">
          <div className="flashcards-meta">
            <span>{current.state==="new"?"New":current.state==="learning"?"Learning":current.state==="relearning"?"Relearning":"Review"}</span>
            <span>{current.direction}</span>
          </div>
          <button ref={cardButton} type="button" className="flashcards-card" aria-label={revealed?"Flashcard answer revealed":"Reveal flashcard answer"}
            aria-expanded={revealed} disabled={busy} onClick={reveal}>
            <span lang={current.prompt.promptLanguage==="ja"?"ja":undefined} className="flashcards-front">{current.front}</span>
            {revealed?<span lang={current.prompt.skill==="form_selection"?"ja":undefined} className="flashcards-back">{current.back}</span>:<span className="flashcards-hint">Show answer · Space</span>}
          </button>
          {revealed?<div className="flashcards-grades" role="group" aria-label="Rate recall">
            {CHOICES.map(choice=><button key={choice.id} type="button" disabled={busy}
              onClick={()=>void rate(choice.id)}><strong>{choice.label}</strong><span>{choice.key}</span></button>)}
          </div>:<button className="flashcards-show" type="button" disabled={busy} onClick={reveal}>Show answer</button>}
          <div className="flashcards-tools">
            <button type="button" disabled={busy} onClick={()=>void suspend()}>Suspend card</button>
            <button type="button" disabled={!last||busy} onClick={()=>void undo()}>Undo last review · U</button>
          </div>
        </div>:
        queue.length>0?<div className="flashcards-finished" role="status">
          <h3>Learning cards waiting</h3>
          <p>Next card due in {formatWait(wait??0)}</p>
          <button type="button" disabled={busy} onClick={()=>setNowMs(Date.now())}>Check due cards</button>
          {last?<button type="button" disabled={busy} onClick={()=>void undo()}>Undo last review</button>:null}
          <button type="button" onClick={onClose}>Finish for now</button>
        </div>:<div className="flashcards-finished" role="status">
          <h3>Session complete</h3>
          <button type="button" disabled={busy} onClick={()=>{setQueue(null);void load(limits).catch(e=>setError(e instanceof Error?e.message:"Cards could not be loaded."));}}>Check for more cards</button>
          {last?<button type="button" disabled={busy} onClick={()=>void undo()}>Undo last review</button>:null}
          <button type="button" onClick={onClose}>Return to Japanese</button>
        </div>}
    </section>
  </div>;
}
