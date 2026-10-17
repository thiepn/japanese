import {useEffect,useRef,useState} from "react";
import {E20_STAGES,getE20SourceOnlyScenes,compareE20WrittenDrafts,
 type E20Question,type E20Scene,type E20Stage,type E20Cohort} from "../study/e20SourceOnlyA2";
import "./e20SourceOnlyA2.css";

type Props={onOriginalPreview:(cohort:E20Cohort,id:string)=>void;busy:boolean};
type AudioState="idle"|"playing"|"unavailable"|"error";
const scenes=getE20SourceOnlyScenes();
const stages=E20_STAGES.map(s=>s.id);

function SourceQuestion({question,choice,onChoose,revealed,onReveal}:{
 question:E20Question;choice:string|null;onChoose:(choice:string)=>void;
 revealed:boolean;onReveal:()=>void;
}){
 return <section className="e20-question" aria-label={question.kind+" source comparison"}>
  <h4>{question.kind==="gist"?"Main idea":question.kind==="detail"?"Specific detail":"Appropriate original reply"}</h4>
  <p lang={question.kind==="detail"?"ja":"en"}>{question.prompt}</p>
  <div className="e20-question__choices" role="group" aria-label="Original response alternatives">
   {question.choices.map(option=><button key={option} type="button" aria-pressed={choice===option}
    onClick={()=>onChoose(option)}>{option}</button>)}
  </div>
  <button type="button" className="e20-question__reveal" aria-expanded={revealed} onClick={onReveal}>
   {revealed?"Hide original reference":"Reveal original reference answer"}
  </button>
  {revealed?<div className="e20-question__feedback" role="status">
   <strong>Original authored reference: <span lang="ja">{question.reference}</span></strong>
   <p>{question.sourceExplanation}</p>
   <p>{choice===null?"Reference revealed without making a selection. No attempt was recorded.":
    choice===question.reference?"Your selected text matches the original reference. This is self-comparison, not a proficiency grade.":
    "Your selected text differs from the original reference. Compare the options and source explanation; no correctness grade was stored."}</p>
  </div>:null}
 </section>;
}

/** E20 is an ephemeral, deliberately ungraded source-workshop, NOT StudyPlayer.
 * It presents existing original material in a connected listening → reading →
 * reply → independent message → changed-context follow-up flow, without saving learner responses/events. */
export function E20SourceOnlyA2({onOriginalPreview,busy}:Props){
 const [key,setKey]=useState(scenes[0]?.key??"");
 const [stage,setStage]=useState<E20Stage>("listen");
 const [choices,setChoices]=useState<Record<string,string>>({});
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [showTranscript,setShowTranscript]=useState(false);
 const [showReadingGloss,setShowReadingGloss]=useState(false);
 const [showFollowUpText,setShowFollowUpText]=useState(false);
 const [followUpWriting,setFollowUpWriting]=useState("");
 const [modelResponse,setModelResponse]=useState("");
 const [showModel,setShowModel]=useState(false);
 const [draftInput,setDraftInput]=useState("");
 const [firstDraft,setFirstDraft]=useState("");
 const [revisionInput,setRevisionInput]=useState("");
 const [compareVisible,setCompareVisible]=useState(false);
 const [checks,setChecks]=useState<number[]>([]);
 const [audioState,setAudioState]=useState<AudioState>("idle");
 const generation=useRef(0);
 const current=scenes.find(s=>s.key===key)??scenes[0]??null;
 function stopAudio(){
  generation.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setAudioState("idle");
 }
 useEffect(()=>{
  const onHide=()=>{if(document.visibilityState==="hidden"){generation.current++;window.speechSynthesis?.cancel();setAudioState("idle");}};
  const onPageHide=()=>{generation.current++;window.speechSynthesis?.cancel();};
  document.addEventListener("visibilitychange",onHide);
  window.addEventListener("pagehide",onPageHide);
  return ()=>{
   generation.current++;
   window.speechSynthesis?.cancel();
   document.removeEventListener("visibilitychange",onHide);
   window.removeEventListener("pagehide",onPageHide);
  };
 },[]);
 function switchScene(next:string){
  if(next===key)return;
  stopAudio();setKey(next);setStage("listen");setChoices({});setRevealed({});
  setShowTranscript(false);setShowReadingGloss(false);setModelResponse("");setShowModel(false);
  setDraftInput("");setFirstDraft("");setRevisionInput("");setCompareVisible(false);setChecks([]);
  setShowFollowUpText(false);setFollowUpWriting("");
 }
 function playText(text:string,rate:number){
  if(!text.trim())return;
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
   typeof SpeechSynthesisUtterance==="undefined"){setAudioState("unavailable");return;}
  generation.current++;
  const id=generation.current;
  try{
   window.speechSynthesis.cancel();
   const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang="ja-JP";utterance.rate=rate;
   const voices=window.speechSynthesis.getVoices();
   const japanese=voices.find(v=>v.lang.toLowerCase().startsWith("ja"));
   if(japanese)utterance.voice=japanese;
   utterance.onend=()=>{if(generation.current===id)setAudioState("idle");};
   utterance.onerror=()=>{if(generation.current===id)setAudioState("error");};
   setAudioState("playing");
   window.speechSynthesis.speak(utterance);
  }catch{if(generation.current===id)setAudioState("error");}
 }
 function playOriginal(rate:number){if(current)playText(current.originalJapaneseDialogue,rate);}
 function changeStage(next:E20Stage){
  if(stage!==next)stopAudio();
  setStage(next);
 }
 function renderQuestion(q:E20Question){
  return <SourceQuestion key={q.id} question={q} choice={choices[q.id]??null}
   onChoose={v=>setChoices(old=>({...old,[q.id]:v}))}
   revealed={Boolean(revealed[q.id])} onReveal={()=>setRevealed(old=>({...old,[q.id]:!old[q.id]}))}/>;
 }
 if(!current)return <section className="e20-source" aria-labelledby="e20-source-title">
   <h2 id="e20-source-title">Source-only A2 communication workshop</h2>
   <p role="status">No original A2 scenes require an ungraded canonical-mapping fallback. Use the regular source-linked A2 course.</p>
 </section>;
 const phaseIndex=stages.indexOf(stage);
 const sceneIndex=scenes.findIndex(s=>s.key===current.key);
 const nextSource=sceneIndex>=0?scenes[sceneIndex+1]??null:null;
 const diff=firstDraft&&revisionInput.trim()?compareE20WrittenDrafts(firstDraft,revisionInput):null;
 return <section className="e20-source" aria-labelledby="e20-source-title">
  <header className="e20-source__head">
   <div><p className="j4-kicker">E20 · ORIGINAL A2 · SOURCE-ONLY</p>
    <h2 id="e20-source-title">Source-only A2 communication workshop</h2>
    <p>Connect original dialogue listening, connected reading, contextual replies and your own writing even when a safe canonical A2 Can-do association is unavailable. This is self-directed, <strong>ungraded source study</strong>, not A2 certification or new FSRS evidence.</p>
   </div>
   <strong>{scenes.length} unlinked original situations · zero scored items</strong>
  </header>
  <div className="e20-source__select">
   <label htmlFor="e20-source-situation">Choose an original A2-oriented situation
    <select id="e20-source-situation" disabled={busy} value={current.key}
      onChange={e=>switchScene(e.currentTarget.value)}>
     <optgroup label="Original E03 A2.1-oriented (provisional)">
      {scenes.filter(s=>s.cohort==="e03").map(s=><option key={s.key} value={s.key}>{s.title}</option>)}
     </optgroup>
     <optgroup label="Original E04 A2.2-oriented (provisional)">
      {scenes.filter(s=>s.cohort==="e04").map(s=><option key={s.key} value={s.key}>{s.title}</option>)}
     </optgroup>
    </select>
   </label>
   <div className="e20-source__context">
    <strong>{current.title} · {current.cohort.toUpperCase()}</strong>
    <p>{current.setting}</p><p><b>Purpose:</b> {current.goal}</p>
   </div>
  </div>
  <nav className="e20-source__stages" aria-label="Five ungraded source learning stages">
   {E20_STAGES.map((s,i)=><button key={s.id} type="button" aria-current={stage===s.id?"step":undefined}
    onClick={()=>changeStage(s.id)}><span>{i+1}</span>{s.title}</button>)}
  </nav>
  <div className="e20-source__stage" aria-live="polite">
   <div className="e20-source__stage-head">
    <div><p className="j4-kicker">STEP {phaseIndex+1} / {stages.length} · SELF-DIRECTED, NOT SCORED</p>
     <h3>{E20_STAGES[phaseIndex]?.title} · {current.title}</h3>
     <p>{E20_STAGES[phaseIndex]?.description}</p>
    </div>
   </div>
   {stage==="listen"?<>
    <div className="e20-source__audio">
     <strong>Original Japanese conversation · device-synthesized listening</strong>
     <p>Listen for who wants what, what is certain, and what is still conditional. This uses the text of the app's original dialogue, spoken by your device. It is not an original speaker recording.</p>
     <div className="e20-source__audio-actions">
      <button type="button" disabled={audioState==="playing"} onClick={()=>playOriginal(.94)}>Play Japanese with device voice</button>
      <button type="button" disabled={audioState==="playing"} onClick={()=>playOriginal(.76)}>Slower</button>
      {audioState==="playing"?<button type="button" onClick={stopAudio}>Stop speech</button>:null}
     </div>
     {audioState==="error"||audioState==="unavailable"?<p role="status">Device Japanese speech is unavailable. Read the original transcript instead; do not claim listening evidence.</p>:null}
     <button type="button" className="e20-source__inline" aria-expanded={showTranscript}
      onClick={()=>setShowTranscript(v=>!v)}>{showTranscript?"Hide":"Reveal"} original Japanese transcript and intentions</button>
     {showTranscript?<ol className="e20-source__dialogue">{current.dialogue.map((turn,i)=>
      <li key={i}><strong lang="ja">{turn.speaker}：{turn.ja}</strong>
       <small>{turn.en}{turn.intention?" · Intention: "+turn.intention:""}</small></li>)}</ol>:null}
    </div>
    <div className="e20-source__questions">{current.listenQuestions.map(renderQuestion)}</div>
   </>:null}
   {stage==="read"?<>
    <article className="e20-source__reading">
     <h4>{current.reading.title}</h4>
     <p lang="ja" className="e20-source__japanese">{current.reading.ja}</p>
     <button type="button" aria-expanded={showReadingGloss}
      onClick={()=>setShowReadingGloss(v=>!v)}>{showReadingGloss?"Hide":"Reveal"} original source explanation</button>
     {showReadingGloss?<p>{current.reading.en}</p>:null}
    </article>
    <div className="e20-source__questions">{current.readQuestions.map(renderQuestion)}</div>
   </>:null}
   {stage==="respond"?<>
    <div className="e20-source__questions">{renderQuestion(current.reply)}</div>
    <div className="e20-source__model">
     <h4>Independent exact-model recall · comparison only</h4>
     <label htmlFor="e20-original-model">{current.model.question}</label>
     <input id="e20-original-model" lang="ja" value={modelResponse} maxLength={300}
      placeholder="日本語で思い出してください…" onChange={e=>setModelResponse(e.currentTarget.value)}/>
     <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(v=>!v)}>
      {showModel?"Hide":"Reveal"} original model and source explanation
     </button>
     {showModel?<div role="status" className="e20-question__feedback">
      <strong>Original reference expression</strong>
      <p lang="ja">{current.model.references.join(" / ")}</p>
      <p>{current.model.sourceExplanation}</p>
      <p>{modelResponse.trim()?"Compare what you typed with the original expression yourself. No response or grade was stored.":
       "You viewed the model without entering a response. No answer was recorded."}</p>
     </div>:null}
    </div>
    <details className="e20-source__notes"><summary>Meaning, vocabulary and common confusion from the original source</summary>
     <p>{current.sourceNotice}</p>
     <ul>{current.sourceNotes.map((v,i)=><li key={i}><strong lang="ja">{v.expression}</strong><span>{v.note}</span></li>)}</ul>
    </details>
   </>:null}
   {stage==="compose"?<>
    <div className="e20-source__writing">
     <p><strong>Original independent writing task:</strong> {current.writingTask}</p>
     <p>Optional spoken challenge (practice aloud yourself; the app does not record or assess audio): {current.speakingTask}</p>
     <label htmlFor="e20-first-draft">First Japanese message · temporary on-screen text
      <textarea id="e20-first-draft" lang="ja" rows={5} maxLength={4000} value={draftInput}
       onChange={e=>{setDraftInput(e.currentTarget.value);setCompareVisible(false);}} placeholder="自分の日本語で書いてください…"/>
     </label>
     <button type="button" disabled={!draftInput.trim()} onClick={()=>{setFirstDraft(draftInput);setRevisionInput(draftInput);setCompareVisible(false);}}>
      Keep first draft in this session
     </button>
     {firstDraft?<div className="e20-source__revision">
      <h4>Source-grounded self-review · rewrite your message</h4>
      <p>Read the original source, then revise for intent, factual accuracy, reader, and polite requests. These are questions, not automatic Japanese-language feedback.</p>
      <div className="e20-source__checks">{current.sourceWritingChecks.map((q,i)=>
       <label key={i}><input type="checkbox" checked={checks.includes(i)}
        onChange={e=>setChecks(old=>e.target.checked?[...old,i]:old.filter(x=>x!==i))}/>
        <span>{q}</span></label>)}</div>
      <label htmlFor="e20-revised-draft">Second Japanese message · revise rather than copy
       <textarea id="e20-revised-draft" lang="ja" rows={5} maxLength={4000} value={revisionInput}
        onChange={e=>{setRevisionInput(e.currentTarget.value);setCompareVisible(false);}}/>
      </label>
      <button type="button" disabled={!diff?.changed} onClick={()=>setCompareVisible(true)}>
       Compare my two session drafts (not a grade)
      </button>
      {firstDraft&&revisionInput.trim()&&!diff?.changed?<p role="status">Your two texts are identical. Change the message deliberately to compare a revision.</p>:null}
      {compareVisible&&diff?.changed?<section aria-label="Temporary written draft comparison" role="status">
       <div className="e20-source__compare"><div><strong>Original message</strong><pre lang="ja">{firstDraft}</pre></div>
        <div><strong>Revised message</strong><pre lang="ja">{revisionInput}</pre></div></div>
       <p>Literal text removed/changed: “{diff.beforeChange||"∅"}” · added/changed: “{diff.afterChange||"∅"}”. Text changes do not establish semantic accuracy, naturalness or A2 proficiency.</p>
      </section>:null}
     </div>:null}
     <p className="e20-source__privacy">This workshop saves <strong>nothing</strong>: your selections and drafts exist only while the current Learn view is open. Copy anything you want to keep before leaving, changing situations, refreshing, or switching accounts. No StudyEvent, FSRS grade, recording, cloud upload or new language credential is created.</p>
    </div>
   </>:null}
   {stage==="follow-up"?<section className="e20-source__follow-up" aria-label="Source-only changed-context follow-up">
    <div className="e20-source__follow-up-header">
     <h4>Original changed-context follow-up · no delayed grade</h4>
     <p>This is the second situation already written for this original scene. The people, conditions or outcome differ from the first scene. The actual follow-up texts and answers come from the same THIEPN original source, not a newly certified A2 Can-do.</p>
    </div>
    <div className="e20-source__audio">
     <strong>New Japanese spoken notice · optional device-synthesized voice</strong>
     <p>Listen for the changed information before revealing its original text. Device speech synthesis is not a native recording, independent listening grade or pronunciation assessment.</p>
     <div className="e20-source__audio-actions">
      <button type="button" disabled={audioState==="playing"} onClick={()=>playText(current.followUp.audio,.94)}>Play follow-up with device voice</button>
      <button type="button" disabled={audioState==="playing"} onClick={()=>playText(current.followUp.audio,.76)}>Slower follow-up</button>
      {audioState==="playing"?<button type="button" onClick={stopAudio}>Stop speech</button>:null}
     </div>
     {audioState==="error"||audioState==="unavailable"?<p role="status">Japanese device voice is unavailable. Reveal the original follow-up instead; no listening evidence is claimed.</p>:null}
     <button type="button" aria-expanded={showFollowUpText}
      onClick={()=>setShowFollowUpText(v=>!v)}>{showFollowUpText?"Hide":"Reveal"} original follow-up spoken text</button>
     {showFollowUpText?<p lang="ja" className="e20-source__japanese e20-source__follow-up-text">{current.followUp.audio}</p>:null}
    </div>
    <div className="e20-source__questions">{renderQuestion(current.followUp.listen)}</div>
    <article className="e20-source__reading">
     <h4>Original changed-context written notice</h4>
     <p lang="ja" className="e20-source__japanese">{current.followUp.reading}</p>
     <p>This text is a different authored source from the first scene. Decide what it actually states before opening the reference.</p>
    </article>
    <div className="e20-source__questions">{renderQuestion(current.followUp.read)}</div>
    <details className="e20-source__notes">
     <summary>Compare the original situation to its follow-up</summary>
     <div className="e20-source__source-contrast">
      <div><strong>First situation · authored conversation</strong><p lang="ja">{current.originalJapaneseDialogue}</p></div>
      <div><strong>New situation · authored follow-up</strong><p lang="ja">{current.followUp.audio}</p></div>
     </div>
     <p>Notice who speaks, what changed, which conditions are explicit, and whether a response from the first situation would still be appropriate. This is a source comparison, not measured transfer.</p>
    </details>
    <div className="e20-source__writing">
     <label htmlFor="e20-follow-up-message">Independent follow-up · temporary Japanese reply
      <textarea id="e20-follow-up-message" lang="ja" maxLength={4000} rows={4}
       placeholder="新しい場面に合わせて日本語で書いてください…"
       value={followUpWriting} onChange={event=>setFollowUpWriting(event.currentTarget.value)}/>
     </label>
     <p>Use the specific facts in the changed-context spoken and written sources. This is separate from your first-situation draft; there is no automatic correctness, naturalness, CEFR or FSRS judgment.</p>
     {followUpWriting.trim()?<p role="status">Text remains temporary in this view; copy it before leaving or moving to another situation. It is not saved as a learning event.</p>:null}
    </div>
    {nextSource?<div className="e20-source__next-scene">
     <strong>Continue original A2 source study</strong>
     <p>Next unlinked original situation: {nextSource.title} · {nextSource.cohort.toUpperCase()}. Continuing resets every temporary choice and draft from the current scene.</p>
     <button type="button" onClick={()=>switchScene(nextSource.key)}>Next original situation · {nextSource.title}</button>
    </div>:<div className="e20-source__next-scene">
     <strong>Last available original unlinked situation</strong>
     <p>You have reached the end of this source-only list. You may revisit any case in the selector; this is not a completed A2 proficiency milestone.</p>
    </div>}
   </section>:null}
  </div>
  <div className="e20-source__footer">
   {phaseIndex>0?<button type="button" onClick={()=>changeStage(stages[phaseIndex-1]!)}>Previous · {E20_STAGES[phaseIndex-1]?.title}</button>:null}
   {phaseIndex<stages.length-1?<button type="button" className="e20-source__next" onClick={()=>changeStage(stages[phaseIndex+1]!)}>
    Continue to {E20_STAGES[phaseIndex+1]?.title}</button>:null}
   <button type="button" disabled={busy} onClick={()=>{stopAudio();onOriginalPreview(current.cohort,current.sceneId);}}>
    Open original reading-only lesson</button>
  </div>
  <p className="e20-source__boundary">Original THIEPN-authored E03/E04 content, not reproduced Marugoto lessons. All situations here are currently without an admissible canonical Can-do association. Original source-linked A2 graded lessons remain separate; no official A2.1/A2.2 or CEFR judgment is made.</p>
 </section>;
}
