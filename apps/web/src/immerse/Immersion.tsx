import { useEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { AuthenticLibrary } from "./AuthenticLibrary";
import { buildExtensiveTracks } from "./extensive";
import { ShadowingLab } from "./ShadowingLab";
import { getAdaptiveImmersionRecommendation,type AdaptiveImmersionRecommendation } from "./adaptive";
import type { ReadingQuestion } from "@thiepn/content-schema";
import {
  buildReaderText,getImmersionProgress,gradeReadingQuestion,recordListeningExposure,recordListeningSegmentReplay,recordMinedWord,
  recordReaderLookup,recordReadingExposure,recordTextCheck,
  type ImmersionProgress,type ReaderTextView,type ReaderToken
} from "./reader";

type CheckMode="reading"|"listening";
interface SelectedToken { token:ReaderToken; sentenceId:string; }

export function Immersion(){
  const [progress,setProgress]=useState<ImmersionProgress|null>(null);
  const [recommendation,setRecommendation]=useState<AdaptiveImmersionRecommendation|null>(null);
  const [activeId,setActiveId]=useState<string|null>(null);
  const [furigana,setFurigana]=useState(true);
  const [translations,setTranslations]=useState<Set<string>>(new Set());
  const [selected,setSelected]=useState<SelectedToken|null>(null);
  const [listeningPlayed,setListeningPlayed]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [speakingSegment,setSpeakingSegment]=useState<string|null>(null);
  const [checkMode,setCheckMode]=useState<CheckMode|null>(null);
  const [questionIndex,setQuestionIndex]=useState(0);
  const [feedback,setFeedback]=useState<{correct:boolean;answer:string;explanation:string}|null>(null);
  const [checkStartedAt,setCheckStartedAt]=useState(0);
  const view=useMemo(()=>activeId?buildReaderText(activeId):null,[activeId]);
  const extensiveTracks=useMemo(()=>progress?buildExtensiveTracks(progress):[],[progress]);
  const audioProvider=useRef(getDefaultAudioProvider());

  async function refresh(){
    try{
      const [nextProgress,nextRecommendation]=await Promise.all([getImmersionProgress(),getAdaptiveImmersionRecommendation()]);
      setProgress(nextProgress);setRecommendation(nextRecommendation);
    }catch{setProgress(null);setRecommendation(null);}
  }
  useEffect(()=>{void refresh();return()=>{audioProvider.current.stop();if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();};},[]);

  async function openText(id:string){
    setActiveId(id);setTranslations(new Set());setSelected(null);setListeningPlayed(false);setCheckMode(null);setQuestionIndex(0);setFeedback(null);
    await recordReadingExposure(id);void refresh();
  }
  function closeText(){if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();setSpeaking(false);setActiveId(null);setCheckMode(null);setSelected(null);}
  function toggleTranslation(id:string){setTranslations((current)=>{const next=new Set(current);next.has(id)?next.delete(id):next.add(id);return next;});}

  async function chooseToken(token:ReaderToken,sentenceId:string){
    if(!token.lexemeId)return;
    setSelected({token,sentenceId});
    await recordReaderLookup(view!.text.id,sentenceId,token.lexemeId);
    void refresh();
  }
  async function mineSelected(){
    if(!selected?.token.lexemeId||!view)return;
    await recordMinedWord(view.text.id,selected.sentenceId,selected.token.lexemeId);
    setSelected(null);void refresh();
  }

  async function speak(rate:number){
    if(!view)return;
    if(view.audio){
      setSpeaking(true);
      try{await audioProvider.current.play(view.audio,{rate});setListeningPlayed(true);await recordListeningExposure(view.text.id,rate,"recorded");void refresh();}finally{setSpeaking(false);}
      return;
    }
    if(typeof speechSynthesis==="undefined")return;
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(view.joinedJapanese);
    utterance.lang="ja-JP";utterance.rate=rate;
    const japanese=speechSynthesis.getVoices().find((voice)=>voice.lang.toLowerCase().startsWith("ja"));
    if(japanese)utterance.voice=japanese;
    setSpeaking(true);
    utterance.onend=()=>{setSpeaking(false);setListeningPlayed(true);void recordListeningExposure(view.text.id,rate,"speech_synthesis").then(refresh);};
    utterance.onerror=()=>setSpeaking(false);
    speechSynthesis.speak(utterance);
  }

  async function speakSegment(sentenceId:string,rate=.92,repeats=1){
    if(!view)return;
    const item=view.sentences.find((entry)=>entry.sentence.id===sentenceId);if(!item)return;
    const segment=view.text.listeningSegments?.find((entry)=>entry.sentenceId===sentenceId);
    setSpeakingSegment(sentenceId);
    try{
      if(view.audio&&segment?.startMs!==undefined&&segment.endMs!==undefined){
        await audioProvider.current.play(view.audio,{rate,repeats,startMs:segment.startMs,endMs:segment.endMs});
        await recordListeningSegmentReplay(view.text.id,sentenceId,rate,repeats,"recorded");
        return;
      }
      if(typeof speechSynthesis==="undefined")return;
      for(let index=0;index<Math.max(1,Math.min(3,repeats));index++){
        await new Promise<void>((resolve)=>{
          const utterance=new SpeechSynthesisUtterance(item.sentence.text);utterance.lang="ja-JP";utterance.rate=rate;
          const japanese=speechSynthesis.getVoices().find((voice)=>voice.lang.toLowerCase().startsWith("ja"));if(japanese)utterance.voice=japanese;
          utterance.onend=()=>resolve();utterance.onerror=()=>resolve();speechSynthesis.speak(utterance);
        });
      }
      await recordListeningSegmentReplay(view.text.id,sentenceId,rate,repeats,"speech_synthesis");
    }finally{setSpeakingSegment(null);void refresh();}
  }

  function startCheck(mode:CheckMode){
    setCheckMode(mode);setQuestionIndex(0);setFeedback(null);setCheckStartedAt(performance.now());
  }
  async function answerQuestion(question:ReadingQuestion,response:string){
    if(!view||feedback)return;
    const graded=gradeReadingQuestion(question,response);
    const correct=graded.result==="correct";
    await recordTextCheck(view.text.id,checkMode!,question.id,graded.result,response,Math.max(0,Math.round(performance.now()-checkStartedAt)));
    setFeedback({correct,answer:question.answer,explanation:question.explanation});void refresh();
  }
  function nextQuestion(){
    if(!view)return;
    if(questionIndex+1>=view.text.comprehensionQuestions.length){setCheckMode(null);setQuestionIndex(0);setFeedback(null);return;}
    setQuestionIndex((value)=>value+1);setFeedback(null);setCheckStartedAt(performance.now());
  }

  if(view)return <ReaderView view={view} furigana={furigana} setFurigana={setFurigana} translations={translations} toggleTranslation={toggleTranslation}
    selected={selected} chooseToken={chooseToken} mineSelected={mineSelected} closeLookup={()=>setSelected(null)} closeText={closeText}
    listeningPlayed={listeningPlayed} speaking={speaking} speak={speak} checkMode={checkMode} startCheck={startCheck}
    questionIndex={questionIndex} feedback={feedback} answerQuestion={answerQuestion} nextQuestion={nextQuestion} speakingSegment={speakingSegment} speakSegment={speakSegment}/>;

  return <section className="dashboard immerse-page">
    <p className="eyebrow">IMMERSE</p><h1>A1 → B2 immersion</h1>
    <p className="lead">Move from graded A1/A2 support into B1/B2 connected Japanese and learner-owned material. Recommendations use current lexical readiness and reading/listening evidence; they guide rather than lock content.</p>
    {progress?<div className="stat-row four"><MiniStat value={progress.texts.length} label="Graded texts"/><MiniStat value={progress.minedWords} label="Mined words"/><MiniStat value={progress.readingChecks} label="Reading checks"/><MiniStat value={progress.listeningChecks} label="Listening checks"/></div>:null}
    {recommendation?<section className="adaptive-immersion">
      <div className="section-heading"><div><span className="course-kicker">ADAPTIVE NEXT STEP</span><h2>Focus on {recommendation.focus}</h2></div></div>
      <div className="adaptive-grid">
        {recommendation.canonical?<article><span>Graded · {recommendation.canonical.level}</span><h3>{recommendation.canonical.title}</h3><p>{recommendation.canonical.reason}</p><small>{Math.round(recommendation.canonical.readiness*100)}% lexical readiness · {Math.round(recommendation.canonical.mastery*100)}% {recommendation.focus} mastery</small><button className="unit-action" type="button" onClick={()=>void openText(recommendation.canonical!.id)}>Open recommended text</button></article>:null}
        {recommendation.privateDocument?<article><span>Private authentic input</span><h3>{recommendation.privateDocument.title}</h3><p>{recommendation.privateDocument.reason}</p><small>{Math.round(recommendation.privateDocument.knownRatio*100)}% known lexical tokens · {recommendation.privateDocument.difficulty}</small><span className="adaptive-hint">Find it in Your Japanese below.</span></article>:null}
      </div>
    </section>:null}
    {extensiveTracks.length?<section className="extensive-tracks">
      <div className="section-heading"><div><span className="course-kicker">EXTENSIVE B2</span><h2>Read + listen across a topic track</h2></div><span className="course-count">readiness-guided · no locks</span></div>
      <p className="course-note">Tracks combine several connected B2 texts so endurance grows beyond one passage. The next item is ranked from your lexical readiness and prior reading/listening evidence; every text remains open.</p>
      <div className="extensive-grid">{extensiveTracks.map((track)=><article className="extensive-card" key={track.id}>
        <span>{track.total} texts · ~{track.minutes} min</span><h3>{track.title}</h3><p>{track.description}</p>
        <div className="readiness"><div><span>Average readiness</span><strong>{Math.round(track.readiness*100)}%</strong></div><div className="meter"><span style={{width:Math.round(track.readiness*100)+"%"}}/></div><small>{track.completed} / {track.total} with both reading + listening evidence</small></div>
        {track.nextText?<button className="unit-action" type="button" onClick={()=>void openText(track.nextText!.id)}>Next: {track.nextText.title}</button>:null}
      </article>)}</div>
    </section>:null}
    <div className="immersion-list">
      {(progress?.texts??[]).map((text)=><article className="immersion-card" key={text.id}>
        <div className="immersion-card-main"><div className="immersion-meta"><span>{text.level}</span><span>{text.kind}</span><span>~{text.estimatedMinutes} min</span></div>
          <h2>{text.title}</h2><p>{text.description}</p>
          <div className="readiness"><div><span>Known-word readiness</span><strong>{Math.round(text.readiness*100)}%</strong></div><div className="meter"><span style={{width:Math.round(text.readiness*100)+"%"}}/></div>
            <small>{text.knownWords} / {text.totalWords} linked words currently familiar</small></div>
        </div>
        <div className="immersion-actions"><div><small>Reading</small><strong>{Math.round(text.readingMastery*100)}%</strong></div><div><small>Listening</small><strong>{Math.round(text.listeningMastery*100)}%</strong></div>
          <button className="unit-action" type="button" onClick={()=>void openText(text.id)}>Open text</button></div>
      </article>)}
    </div>
    <p className="course-note">Readiness is derived from lexeme meaning evidence. It is guidance, not a content lock. Curated connected audio uses the device’s Japanese speech-synthesis voice unless a source-provenanced recording is attached.</p>
    <ShadowingLab/>
    <AuthenticLibrary/>
  </section>;
}

function ReaderView({view,furigana,setFurigana,translations,toggleTranslation,selected,chooseToken,mineSelected,closeLookup,closeText,listeningPlayed,speaking,speak,checkMode,startCheck,questionIndex,feedback,answerQuestion,nextQuestion,speakingSegment,speakSegment}:{
  view:ReaderTextView;furigana:boolean;setFurigana:(value:boolean)=>void;translations:Set<string>;toggleTranslation:(id:string)=>void;
  selected:SelectedToken|null;chooseToken:(token:ReaderToken,sentenceId:string)=>Promise<void>;mineSelected:()=>Promise<void>;closeLookup:()=>void;closeText:()=>void;
  listeningPlayed:boolean;speaking:boolean;speak:(rate:number)=>Promise<void>;checkMode:CheckMode|null;startCheck:(mode:CheckMode)=>void;
  questionIndex:number;feedback:{correct:boolean;answer:string;explanation:string}|null;answerQuestion:(question:ReadingQuestion,response:string)=>Promise<void>;nextQuestion:()=>void;
  speakingSegment:string|null;speakSegment:(sentenceId:string,rate?:number,repeats?:number)=>Promise<void>;
}){
  const [listeningFirst,setListeningFirst]=useState(false);
  const question=checkMode?view.text.comprehensionQuestions[questionIndex]:null;
  return <section className="reader-page">
    <header className="reader-head"><button className="quiet-button reader-back" type="button" onClick={closeText}>← Immerse</button><div><span>{view.text.level}</span><h1>{view.text.title}</h1></div></header>
    {checkMode&&question?<section className="reader-check"><p className="eyebrow">{checkMode==="reading"?"READING CHECK":"LISTENING CHECK"} · {questionIndex+1}/{view.text.comprehensionQuestions.length}</p>
      <h2>{question.prompt}</h2><div className="reader-check-choices">{question.choices.map((choice)=><button type="button" disabled={Boolean(feedback)} key={choice} onClick={()=>void answerQuestion(question,choice)}>{choice}</button>)}</div>
      {feedback?<div className={"reader-check-feedback "+(feedback.correct?"correct":"incorrect")}><strong>{feedback.correct?"Correct":"Answer: "+feedback.answer}</strong><p>{feedback.explanation}</p><button className="primary" type="button" onClick={nextQuestion}>{questionIndex+1>=view.text.comprehensionQuestions.length?"Return to text":"Next"}</button></div>:null}
    </section>:<>
      <div className="reader-toolbar">
        <label><input type="checkbox" checked={furigana} onChange={(event)=>setFurigana(event.target.checked)}/> Reading hints</label>
        <div className="reader-audio"><button className={listeningFirst?"active":""} type="button" onClick={()=>setListeningFirst((value)=>!value)}>{listeningFirst?"Listening-first on":"Listening-first"}</button><button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.95)}>{speaking?"Playing…":view.audio?"Play native recording":"Listen to full text"}</button><button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.78)}>Slower</button></div>
      </div>
      <p className="reader-intro">{view.text.description}</p>
      {listeningFirst&&!listeningPlayed?<div className="listening-first-gate"><span>LISTENING FIRST</span><h2>Understand the passage before reading it</h2><p>Play the full passage at normal or slower speed. The text stays hidden until one complete playback finishes, so listening creates its own retrieval pressure.</p></div>:null}
      {view.audio?<p className="source-note">Recording: {view.audio.credit}{view.audio.licenseName?" · "+view.audio.licenseName:""}</p>:null}
      <div className={"reader-sentences "+(listeningFirst&&!listeningPlayed?"listening-first-hidden":"")}>
        {view.sentences.map(({sentence,tokens,grammar})=><article className="reader-sentence" key={sentence.id}>
          <div className="reader-japanese" lang="ja">{tokens.map((token,index)=>token.lexemeId?<button className="reader-token" type="button" key={sentence.id+":"+index} onClick={()=>void chooseToken(token,sentence.id)}>
            {furigana&&token.reading&&token.reading!==token.surface?<ruby>{token.surface}<rt>{token.reading}</rt></ruby>:token.surface}
          </button>:<span key={sentence.id+":"+index}>{token.surface}</span>)}</div>
          <div className="reader-support"><button className="quiet-button" type="button" onClick={()=>toggleTranslation(sentence.id)}>{translations.has(sentence.id)?"Hide translation":"Show translation"}</button>
            <button className="quiet-button" type="button" disabled={speakingSegment===sentence.id} onClick={()=>void speakSegment(sentence.id,.92,1)}>{speakingSegment===sentence.id?"Playing…":"Replay sentence"}</button>
            <button className="quiet-button" type="button" disabled={speakingSegment===sentence.id} onClick={()=>void speakSegment(sentence.id,.82,2)}>Slow ×2</button>
            {grammar.length?<details><summary>{grammar.length} grammar links</summary>{grammar.map((item)=><div className="reader-grammar" key={item.id}><strong>{item.label}</strong><span>{item.summary}</span></div>)}</details>:null}</div>
          {translations.has(sentence.id)?<p className="reader-translation">{sentence.translation}</p>:null}
        </article>)}
      </div>
      {selected?<aside className="reader-lookup"><button className="reader-lookup-close" type="button" aria-label="Close word lookup" onClick={closeLookup}>×</button><span lang="ja">{selected.token.surface}</span>{selected.token.reading?<small lang="ja">{selected.token.reading}</small>:null}<strong>{selected.token.meaning}</strong><button className="unit-action" type="button" onClick={()=>void mineSelected()}>Mine for review</button></aside>:null}
      <div className="reader-finish"><button className="primary" type="button" onClick={()=>startCheck("reading")}>Reading check</button><button className="unit-action" disabled={!listeningPlayed} type="button" onClick={()=>startCheck("listening")}>{listeningPlayed?"Listening check":"Listen first"}</button></div>
      <p className="course-note">Tap a linked word for reading and meaning. Listening-first hides the transcript until one full playback. Sentence replay loops use source-timed native segments when available and otherwise stay explicitly labeled device synthesis.</p>
    </>}
  </section>;
}

function MiniStat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
