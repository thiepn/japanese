import {useEffect,useMemo,useRef,useState} from "react";
import type {E06CaseProgress} from "../study/e06IndependentCourse";
import {
  availableE16Dialogues,buildE16OriginalConversation,e16SourceComparison,
  E16_REHEARSAL_MODES,normalizeE16Scratch,type E16RehearsalMode,
} from "../study/e16DialogueRehearsal";
import {createE16AudioPlayback} from "../study/e16DeviceSpeech";
import {
  E17_NOTE_MAX_CHARACTERS,deleteE17ListeningNote,
  getE17OriginalListeningQuestion,listE17ListeningNotes,saveE17ListeningNote,
  type E17OriginalListeningNote,
} from "../study/e17OriginalListeningNotebook";
import "../study/e16DialogueRehearsal.css";

interface Props {
  cases:readonly E06CaseProgress[];
  busy:boolean;
  workspaceId:string;
  workspaceCurrent:()=>boolean;
  onHandoff:(caseId:string)=>void;
}

/**
 * Optional five-turn original E11 source-only listening/shadowing.
 * Scratch responses never leave component state or become StudyEvents. The
 * separately launched E14 StudyPlayer owns actual submitted original work.
 */
export function E16ConversationStudio({cases,busy,workspaceId,workspaceCurrent,onHandoff}:Props){
  const eligible=useMemo(()=>availableE16Dialogues(cases),[cases]);
  const ids=eligible.map(c=>c.id).join("|");
  const [selected,setSelected]=useState<string|null>(null);
  const [mode,setMode]=useState<E16RehearsalMode>("listen-first");
  const [turnIndex,setTurnIndex]=useState(0);
  const [sourceRevealed,setSourceRevealed]=useState(false);
  const [scratch,setScratch]=useState("");
  const [played,setPlayed]=useState(false);
  const [voiceStatus,setVoiceStatus]=useState<"idle"|"playing"|"unavailable">("idle");
  const [noticeOpen,setNoticeOpen]=useState(false);
  const [privateNotes,setPrivateNotes]=useState<E17OriginalListeningNote[]>([]);
  const [noteBusy,setNoteBusy]=useState(false);
  const [noteStatus,setNoteStatus]=useState<string|null>(null);
  const [noteDeleteConfirm,setNoteDeleteConfirm]=useState(false);
  const [privateNotesLoading,setPrivateNotesLoading]=useState(false);
  const [heardAnswer,setHeardAnswer]=useState("");
  const [answerRevealed,setAnswerRevealed]=useState(false);
  const saveInProgress=useRef(false);
  const playback=useRef(createE16AudioPlayback());
  const voiceAttempt=useRef(0);
  const chosen=eligible.find(c=>c.id===selected)??eligible[0]??null;
  const caseId=chosen?.id??null;
  const original=caseId?buildE16OriginalConversation(caseId,cases):null;
  const turn=original?.turns[turnIndex]??null;
  const compare=turn?e16SourceComparison(turn,scratch):null;
  const savedForTurn=privateNotes.find(note=>note.turnIndex===turnIndex)??null;
  const originalQuestion=caseId?getE17OriginalListeningQuestion(caseId,cases):null;
  const canEdit=!busy&&!noteBusy&&!privateNotesLoading;

  useEffect(()=>{
    const possible=ids.split("|").filter(Boolean);
    setSelected(old=>old&&possible.includes(old)?old:possible[0]??null);
  },[ids]);
  useEffect(()=>{
    // The device voice is stopped on a new original case and on owner
    // remount; an earlier asynchronous utterance cannot reveal next case.
    const voice=playback.current;
    voiceAttempt.current++;
    voice.stop();
    setTurnIndex(0);
    setSourceRevealed(false);
    setScratch("");
    setPlayed(false);
    setVoiceStatus("idle");
    setNoticeOpen(false);
    setHeardAnswer("");
    setAnswerRevealed(false);
    setNoteDeleteConfirm(false);
    setNoteStatus(null);
    return ()=>voice.stop();
  },[caseId]);
  useEffect(()=>()=>playback.current.stop(),[]);
  useEffect(()=>{
    let active=true;
    setPrivateNotes([]);
    setPrivateNotesLoading(Boolean(caseId));
    if(!caseId)return;
    void listE17ListeningNotes(workspaceId,caseId,cases,workspaceCurrent)
      .then(rows=>{
        if(active&&workspaceCurrent())setPrivateNotes(rows);
      })
      .catch(()=>{
        if(active&&workspaceCurrent())setNoteStatus(
          "Saved private notes could not be loaded from this device. Existing study evidence was not changed.");
      })
      .finally(()=>{
        if(active&&workspaceCurrent())setPrivateNotesLoading(false);
      });
    return ()=>{active=false;};
  },[caseId,workspaceId]);

  function stopVoice(){
    voiceAttempt.current++;
    playback.current.stop();
    setVoiceStatus("idle");
  }
  function move(to:number){
    if(!original||noteBusy||to<0||to>=original.turns.length)return;
    stopVoice();
    setTurnIndex(to);
    setSourceRevealed(false);
    setScratch("");
    setPlayed(false);
  }
  async function speak(all:boolean){
    if(!original||busy)return;
    stopVoice();
    const attempt=++voiceAttempt.current;
    setVoiceStatus("playing");
    const starting=all?0:turnIndex;
    const cues=all?original.turns:[original.turns[turnIndex]!];
    try{
      await playback.current.play(cues,mode==="shadow-and-reply"?0.78:1,offset=>{
        if(attempt!==voiceAttempt.current)return;
        setTurnIndex(starting+offset);
        setSourceRevealed(false);
        setScratch("");
        setPlayed(true);
      });
      if(attempt===voiceAttempt.current)setVoiceStatus("idle");
    }catch{
      if(attempt===voiceAttempt.current)setVoiceStatus("unavailable");
    }
  }

  async function saveSourceNote(){
    if(!caseId||!canEdit||saveInProgress.current||!scratch.trim())return;
    saveInProgress.current=true;setNoteBusy(true);setNoteStatus(null);
    const caseBefore=caseId,indexBefore=turnIndex,textBefore=scratch;
    try{
      const note=await saveE17ListeningNote(workspaceId,caseBefore,indexBefore,textBefore,cases,workspaceCurrent);
      if(workspaceCurrent()){
        setPrivateNotes(previous=>[...previous.filter(n=>n.turnIndex!==indexBefore),note]
          .sort((a,b)=>a.turnIndex-b.turnIndex));
        setNoteStatus("Private listening note saved locally. It is included in the existing owner-locked workspace backup, not uploaded.");
      }
    }catch{
      if(workspaceCurrent())setNoteStatus("The private listening note could not be saved. Copy your draft before leaving; no grade or StudyEvent was created.");
    }finally{
      saveInProgress.current=false;
      if(workspaceCurrent())setNoteBusy(false);
    }
  }
  async function deleteSourceNote(){
    if(!caseId||!savedForTurn||!canEdit||saveInProgress.current)return;
    saveInProgress.current=true;setNoteBusy(true);setNoteStatus(null);
    const indexBefore=turnIndex;
    try{
      await deleteE17ListeningNote(workspaceId,caseId,indexBefore,cases,workspaceCurrent);
      if(workspaceCurrent()){
        setPrivateNotes(previous=>previous.filter(note=>note.turnIndex!==indexBefore));
        setNoteStatus("Your private note for this original speaker was deleted. Existing scored or optional StudyEvents were not changed.");
        setNoteDeleteConfirm(false);
      }
    }catch{
      if(workspaceCurrent())setNoteStatus("The private note could not be deleted. Retry when this device's storage is available.");
    }finally{
      saveInProgress.current=false;
      if(workspaceCurrent())setNoteBusy(false);
    }
  }

  const advance=()=>move(turnIndex+1);
  return <section className="e16-studio" aria-labelledby="e16-studio-title">
    <header className="e16-studio__header">
      <p className="j4-kicker">E16 · ORIGINAL DIALOGUE LISTENING LAB</p>
      <h2 id="e16-studio-title">Follow the whole conversation, one speaker at a time</h2>
      <p>The source's complete exchange, not a simulated chatbot. Hear a Japanese turn without a transcript, try to respond or shadow it, then reveal the exact wording, meaning and intention. Continue into E14 to save your actual practice.</p>
    </header>
    {!chosen||!original
      ?<p role="status">Unlock one original E11 situation through its linked listening and reading prerequisites first. The app does not substitute an invented dialogue.</p>
      :<>
        <div className="e16-studio__selectors">
          <label htmlFor="e16-source-case">Original situation
            <select id="e16-source-case" value={chosen.id} disabled={busy||noteBusy}
              onChange={e=>setSelected(e.currentTarget.value)}>
              {eligible.map(c=><option key={c.id} value={c.id}>{c.title} · {c.level}</option>)}
            </select>
          </label>
          <label htmlFor="e16-source-mode">Rehearsal approach
            <select id="e16-source-mode" value={mode} disabled={busy||noteBusy}
              onChange={e=>{stopVoice();setMode(e.currentTarget.value as E16RehearsalMode);}}>
              {E16_REHEARSAL_MODES.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        </div>
        <p className="e16-studio__setting">{original.setting} <strong>Goal:</strong> {original.goal}</p>
        <div className="e16-studio__exchange" aria-label="Original five-turn Japanese conversation">
          <div className="e16-studio__progress">
            <strong>Original turn {turnIndex+1} of {original.turns.length}</strong>
            <span>{E16_REHEARSAL_MODES.find(option=>option.id===mode)?.description}</span>
          </div>
          <div className="e16-studio__speaker" aria-live="polite">
            <span>Speaker</span>
            <strong lang="ja">{turn?.speaker}</strong>
          </div>
          <div className="e16-studio__voice-actions">
            <button type="button" disabled={busy||voiceStatus==="playing"} onClick={()=>void speak(false)}>
              Hear this Japanese turn
            </button>
            <button type="button" disabled={busy||voiceStatus==="playing"} onClick={()=>void speak(true)}>
              Play entire original dialogue
            </button>
            <button type="button" disabled={voiceStatus!=="playing"} onClick={stopVoice}>
              Stop audio
            </button>
          </div>
          {voiceStatus==="playing"?<p role="status" className="e16-studio__feedback">Playing device-generated Japanese voice. Audio is not recorded.</p>:null}
          {voiceStatus==="unavailable"?<p role="alert" className="e16-studio__feedback">Japanese device speech is unavailable. You can reveal and read the original dialogue instead. No listening result was recorded.</p>:null}
          {!played?<p className="e16-studio__feedback">Listen first if your device has Japanese speech synthesis. Text reveal is always available for offline and accessibility needs.</p>:null}
          {!sourceRevealed?<>
            <div className="e16-studio__hidden-source" aria-label="Japanese source concealed">Japanese transcript hidden until you reveal this turn.</div>
            {mode==="shadow-and-reply"?<label htmlFor="e16-shadow-scratch">Try the next Japanese line or write what you heard (temporary until explicitly saved, unscored)
              <textarea id="e16-shadow-scratch" lang="ja" rows={3} maxLength={1200}
                value={scratch} onChange={e=>setScratch(normalizeE16Scratch(e.currentTarget.value))}
                placeholder="自分のことばで…" />
              </label>:null}
            <button className="e16-studio__reveal" type="button" onClick={()=>setSourceRevealed(true)}>
              Reveal original Japanese and communicative intention
            </button>
          </>:<div className="e16-studio__revealed">
            <p className="e16-studio__japanese" lang="ja">{compare?.originalLine}</p>
            <p><strong>Meaning:</strong> {compare?.translation}</p>
            <p><strong>Intention:</strong> {compare?.intent}</p>
            {turn?.replyDecision?<p className="e16-studio__source-decision"><strong>Source-owned response question:</strong> {turn.replyDecision.question} This turn contains the original source reply. E14 has the native choice-based check.</p>:null}
            {scratch.trim()?<details>
              <summary>Compare with my unsent response</summary>
              <pre lang="ja">{scratch}</pre>
              <p>{compare?.comparisonNote}</p>
            </details>:null}
            <button type="button" onClick={()=>setSourceRevealed(false)}>Hide transcript and rehearse again</button>
          </div>}
          <section className="e17-notebook" aria-label="Private original listening notebook">
            <header>
              <h3>E17 · My private listening notebook</h3>
              <p>After hearing this source turn, save your own remembered Japanese or a contextual observation. This is a private note in the original local document store, not a transcript grader. Unsent text is still temporary.</p>
            </header>
            {privateNotesLoading?<p role="status">Reading your private source notes from this device…</p>:null}
            {mode==="shadow-and-reply"&&scratch.trim()?<button type="button"
              disabled={!canEdit||scratch.length>E17_NOTE_MAX_CHARACTERS}
              onClick={()=>void saveSourceNote()}>
              {savedForTurn?"Update my private listening note":"Save my private listening note"}
            </button>:null}
            {savedForTurn?<div className="e17-notebook__saved">
              <p><strong>Saved on this device</strong> · speaker {turnIndex+1}, original content version {savedForTurn.contentVersion}. Recorded {new Date(savedForTurn.savedAt).toLocaleString()}.</p>
              <details><summary>Read my last saved listening note</summary>
                <pre lang="ja">{savedForTurn.text}</pre>
              </details>
              <div className="e17-notebook__saved-actions">
                <button type="button" disabled={!canEdit} onClick={()=>{
                  setMode("shadow-and-reply");setScratch(savedForTurn.text);
                  setSourceRevealed(false);setNoteStatus(null);
                }}>Rehearse again from my saved note</button>
                {!noteDeleteConfirm?<button type="button" disabled={!canEdit}
                  onClick={()=>setNoteDeleteConfirm(true)}>Delete this saved note</button>
                  :<div className="e17-notebook__confirm" role="group" aria-label="Confirm deleting private listening note">
                    <p>Delete this saved note permanently? This does not delete original study answers.</p>
                    <button type="button" disabled={!canEdit} onClick={()=>void deleteSourceNote()}>Confirm deleting my note</button>
                    <button type="button" disabled={!canEdit} onClick={()=>setNoteDeleteConfirm(false)}>Keep the note</button>
                  </div>}
              </div>
            </div>:<p className="e17-notebook__empty">No saved note for this original speaker. You can continue practising without saving anything.</p>}
            {noteStatus?<p role="status" aria-live="polite">{noteStatus}</p>:null}
          </section>
          {turnIndex===original.turns.length-1&&sourceRevealed&&originalQuestion?<section className="e17-notebook__comprehension" aria-label="Source-backed listening self-check">
            <h3>Listening self-check · original E11 question</h3>
            <p lang="ja">{originalQuestion.question}</p>
            <label htmlFor="e17-listening-answer">What did you understand? Write an answer before seeing the source explanation.
              <input id="e17-listening-answer" type="text" lang="ja" maxLength={240}
                value={heardAnswer} onChange={e=>{setHeardAnswer(e.currentTarget.value);setAnswerRevealed(false);}}/>
            </label>
            <button type="button" onClick={()=>setAnswerRevealed(v=>!v)}>
              {answerRevealed?"Hide original listening answer":"Reveal original listening answer and misconceptions"}
            </button>
            {answerRevealed?<div className="e17-notebook__answer">
              <p><strong>Original answer:</strong> <span lang="ja">{originalQuestion.answer}</span></p>
              <p>The source identifies these misleading alternatives:</p>
              <ul>{originalQuestion.misconceptionExplanations.map(x=><li key={x}>{x}</li>)}</ul>
              <p>Compare your wording yourself. This does not calculate correctness, mark comprehension, or create an event. Continue into E14 for the original native answer check.</p>
            </div>:null}
          </section>:null}
          <div className="e16-studio__navigation">
            <button type="button" disabled={turnIndex===0||busy||noteBusy} onClick={()=>move(turnIndex-1)}>Previous speaker</button>
            <button type="button" disabled={turnIndex===original.turns.length-1||busy||noteBusy} onClick={advance}>Next speaker</button>
            <button type="button" disabled={busy||noteBusy} onClick={()=>move(0)}>Restart exchange</button>
          </div>
        </div>
        <details className="e16-studio__notice" open={noticeOpen}
          onToggle={event=>setNoticeOpen(event.currentTarget.open)}>
          <summary>Original accompanying notice and communication caution</summary>
          <strong>{original.originalNotice.title}</strong>
          <p lang="ja">{original.originalNotice.japanese}</p>
          <p>{original.originalNotice.english}</p>
          <p><strong>Context to avoid:</strong> {original.caution}</p>
          <p><strong>Practical action:</strong> {original.pragmaticDecision}</p>
        </details>
        <div className="e16-studio__handoff">
          <p>Ready to choose the original responses and write for <strong>{original.writingAudience}</strong>? Continue into the existing native E14 StudyPlayer, which records your answers privately.</p>
          <button type="button" disabled={busy||noteBusy} onClick={()=>{stopVoice();onHandoff(chosen.id);}}>
            Continue to saved listening, replies and writing
          </button>
        </div>
        <p className="e16-studio__privacy">Unsent rehearsal text is temporary and disappears on navigation or account change. Notes are saved only on your explicit request in the existing owner-private local document store; the normal Japanese workspace backup includes them. No recording, speech recognition, score, mastery or new StudyEvent is created here. Device synthesized audio is not an original native-speaker recording or a guarantee of offline voice availability.</p>
      </>}
  </section>;
}
