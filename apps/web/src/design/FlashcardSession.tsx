import {useCallback,useEffect,useRef,useState} from "react";
import {asFlashcard,DEFAULT_FLASHCARD_LIMITS,FLASHCARD_GRADES,type FlashcardGrade,type FlashcardLimits,type FlashcardView} from "../study/flashcards";
import {kanaReviewPrompts,kanaReviewTraceId,type KanaReviewScript,type KanaReviewSkill} from "../study/kanaReview";
import {getDevelopmentAccountId,getKanaFlashcardDeck,recordKanaFlashcardGrade,
  setKanaFlashcardSuspended,undoKanaFlashcardGrade,type FlashcardReviewReceipt} from "../study/runtime";
import "./flashcardSession.css";

const CHOICES:readonly {id:FlashcardGrade;label:string;key:string}[]=[
  {id:"again",label:"Again",key:"1"},{id:"hard",label:"Hard",key:"2"},
  {id:"good",label:"Good",key:"3"},{id:"easy",label:"Easy",key:"4"}
];
const CARD_PROMPTS=new Map(kanaReviewPrompts.map(prompt=>[kanaReviewTraceId(prompt),prompt]));
export function FlashcardSession({script,skill,onClose}:{
  script:KanaReviewScript;skill:KanaReviewSkill;onClose:()=>void;
}){
  const owner=useRef(getDevelopmentAccountId());
  const [limits,setLimits]=useState<FlashcardLimits>(DEFAULT_FLASHCARD_LIMITS);
  const [cards,setCards]=useState<FlashcardView[]|null>(null);
  const [suspended,setSuspended]=useState<string[]>([]);
  const [position,setPosition]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showManaged,setShowManaged]=useState(false);
  const [last,setLast]=useState<{receipt:FlashcardReviewReceipt;position:number}|null>(null);
  const started=useRef(0);
  const lock=useRef(false);

  const load=useCallback(async(next:FlashcardLimits)=>{
    if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
    const result=await getKanaFlashcardDeck(script,skill,next);
    if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
    setCards(result.cards);setSuspended(result.suspended);setPosition(0);setRevealed(false);
    setLast(null);setError("");started.current=performance.now();
  },[script,skill]);

  useEffect(()=>{
    let live=true;
    void getKanaFlashcardDeck(script,skill,limits).then(result=>{
      if(!live)return;
      if(owner.current!==getDevelopmentAccountId()){setError("Review account changed. Close this session.");return;}
      setCards(result.cards);setSuspended(result.suspended);started.current=performance.now();
    }).catch(()=>{if(live)setError("Cards could not be loaded.");});
    return()=>{live=false;};
  },[script,skill]);

  const current=cards?.[position];
  const reveal=useCallback(()=>{if(current&&!busy){setRevealed(true);}},[current,busy]);
  const rate=useCallback(async(grade:FlashcardGrade)=>{
    if(!current||!revealed||lock.current)return;
    lock.current=true;setBusy(true);setError("");
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      const receipt=await recordKanaFlashcardGrade(current,grade,performance.now()-started.current);
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      setLast({receipt,position});setPosition(n=>n+1);setRevealed(false);started.current=performance.now();
    }catch(e){setError(e instanceof Error?e.message:"Review could not be saved.");}
    finally{lock.current=false;setBusy(false);}
  },[current,position,revealed]);

  const suspend=useCallback(async()=>{
    if(!current||lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await setKanaFlashcardSuspended(current.id,true);
      setSuspended(value=>[...new Set([...value,current.id])]);
      setLast(null);setPosition(n=>n+1);setRevealed(false);started.current=performance.now();setError("");
    }catch(e){setError(e instanceof Error?e.message:"Suspend failed.");}
    finally{lock.current=false;setBusy(false);}
  },[current]);

  const restore=useCallback(async(id:string)=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await setKanaFlashcardSuspended(id,false);
      setSuspended(value=>value.filter(item=>item!==id));setError("");
    }catch(e){setError(e instanceof Error?e.message:"Restore failed.");}
    finally{lock.current=false;setBusy(false);}
  },[]);

  const undo=useCallback(async()=>{
    if(!last||lock.current)return;
    lock.current=true;setBusy(true);
    try{
      if(owner.current!==getDevelopmentAccountId())throw Error("Review account changed");
      await undoKanaFlashcardGrade(last.receipt);
      setPosition(last.position);setRevealed(true);setLast(null);setError("");
      started.current=performance.now();
    }catch(e){setError(e instanceof Error?e.message:"Undo unavailable after sync or another review.");}
    finally{lock.current=false;setBusy(false);}
  },[last]);

  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(event.ctrlKey||event.altKey||event.metaKey||event.isComposing||
        event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||
        event.target instanceof HTMLSelectElement)return;
      if(event.key==="Escape"){event.preventDefault();onClose();return;}
      if(event.key===" "||event.key==="Enter"){
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
        <div><h2>{title}</h2><span>{cards?Math.min(position+1,cards.length):0} / {cards?.length??0}</span></div>
        <div className="flashcards-header__actions">
          <button type="button" onClick={()=>setShowManaged(value=>!value)} aria-expanded={showManaged}>Suspended ({suspended.length})</button>
          <button type="button" onClick={onClose} aria-label="Close flashcards">Close</button>
        </div>
      </header>
      {showManaged?<section className="flashcards-manage" aria-label="Manage suspended cards">
        {suspended.length===0?<p>No suspended cards.</p>:
          <ul>{suspended.map(id=>{
            const prompt=CARD_PROMPTS.get(id);
            const card=prompt?asFlashcard(prompt):null;
            return <li key={id}><span lang={card?.prompt.promptLanguage==="ja"?"ja":undefined}>{card?.front??id} · {card?.back??""}</span>
              <button disabled={busy} type="button" onClick={()=>void restore(id)}>Restore</button></li>;
          })}</ul>}
      </section>:null}
      {error?<p className="flashcards-error" role="alert">{error}</p>:null}
      {cards===null?<p role="status">Loading flashcards…</p>:
        current?<div className="flashcards-study">
          <div className="flashcards-meta"><span>{current.state==="new"?"New":current.state==="learning"?"Learning":current.state==="relearning"?"Relearning":"Review"}</span><span>{current.direction}</span></div>
          <button type="button" className="flashcards-card" aria-label={revealed?"Flashcard answer revealed":"Reveal flashcard answer"}
            aria-expanded={revealed} disabled={busy} onClick={reveal}>
            <span lang={current.prompt.promptLanguage==="ja"?"ja":undefined} className="flashcards-front">{current.front}</span>
            {revealed?<span className="flashcards-back">{current.back}</span>:<span className="flashcards-hint">Show answer · Space</span>}
          </button>
          {revealed?<div className="flashcards-grades" role="group" aria-label="Rate recall">
            {CHOICES.map(choice=><button key={choice.id} type="button" disabled={busy}
              onClick={()=>void rate(choice.id)}><strong>{choice.label}</strong><span>{choice.key}</span></button>)}
          </div>:<button className="flashcards-show" type="button" disabled={busy} onClick={reveal}>Show answer</button>}
          <div className="flashcards-tools">
            <button type="button" disabled={busy} onClick={()=>void suspend()}>Suspend card</button>
            <button type="button" disabled={!last||busy} onClick={()=>void undo()}>Undo last review · U</button>
          </div>
        </div>:<div className="flashcards-finished" role="status">
          <h3>Session complete</h3>
          <div className="flashcards-settings">
            <label>New cards <input aria-label="New cards per session" type="number" min="0" max="30" value={limits.newCards}
              onChange={e=>setLimits(v=>({...v,newCards:Number(e.target.value)}))}/></label>
            <label>Reviews <input aria-label="Reviews per session" type="number" min="0" max="100" value={limits.reviews}
              onChange={e=>setLimits(v=>({...v,reviews:Number(e.target.value)}))}/></label>
          </div>
          <button type="button" disabled={busy} onClick={()=>{setCards(null);void load(limits).catch(()=>setError("Cards could not be loaded."));}}>Check for more cards</button>
          <button type="button" onClick={onClose}>Return to Japanese</button>
          {last?<button type="button" disabled={busy} onClick={()=>void undo()}>Undo last review</button>:null}
        </div>}
    </section>
  </div>;
}
