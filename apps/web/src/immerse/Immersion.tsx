import { useEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { AuthenticLibrary } from "./AuthenticLibrary";
import { ShadowingLab } from "./ShadowingLab";
import { getAdaptiveImmersionRecommendation,type AdaptiveImmersionRecommendation } from "./adaptive";
import type { ReadingQuestion } from "@thiepn/content-schema";
import {
  buildReaderText,getImmersionProgress,gradeReadingQuestion,recordListeningExposure,recordMinedWord,
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
  const [checkMode,setCheckMode]=useState<CheckMode|null>(null);
  const [questionIndex,setQuestionIndex]=useState(0);
  const [feedback,setFeedback]=useState<{correct:boolean;answer:string;explanation:string}|null>(null);
  const [checkStartedAt,setCheckStartedAt]=useState(0);
  const view=useMemo(()=>activeId?buildReaderText(activeId):null,[activeId]);
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
    questionIndex={questionIndex} feedback={feedback} answerQuestion={answerQuestion} nextQuestion={nextQuestion}/>;

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

function ReaderView({view,furigana,setFurigana,translations,toggleTranslation,selected,chooseToken,mineSelected,closeLookup,closeText,listeningPlayed,speaking,speak,checkMode,startCheck,questionIndex,feedback,answerQuestion,nextQuestion}:{
  view:ReaderTextView;furigana:boolean;setFurigana:(value:boolean)=>void;translations:Set<string>;toggleTranslation:(id:string)=>void;
  selected:SelectedToken|null;chooseToken:(token:ReaderToken,sentenceId:string)=>Promise<void>;mineSelected:()=>Promise<void>;closeLookup:()=>void;closeText:()=>void;
  listeningPlayed:boolean;speaking:boolean;speak:(rate:number)=>Promise<void>;checkMode:CheckMode|null;startCheck:(mode:CheckMode)=>void;
  questionIndex:number;feedback:{correct:boolean;answer:string;explanation:string}|null;answerQuestion:(question:ReadingQuestion,response:string)=>Promise<void>;nextQuestion:()=>void;
}){
  const question=checkMode?view.text.comprehensionQuestions[questionIndex]:null;
  return <section className="reader-page">
    <header className="reader-head"><button className="quiet-button reader-back" type="button" onClick={closeText}>← Immerse</button><div><span>{view.text.level}</span><h1>{view.text.title}</h1></div></header>
    {checkMode&&question?<section className="reader-check"><p className="eyebrow">{checkMode==="reading"?"READING CHECK":"LISTENING CHECK"} · {questionIndex+1}/{view.text.comprehensionQuestions.length}</p>
      <h2>{question.prompt}</h2><div className="reader-check-choices">{question.choices.map((choice)=><button type="button" disabled={Boolean(feedback)} key={choice} onClick={()=>void answerQuestion(question,choice)}>{choice}</button>)}</div>
      {feedback?<div className={"reader-check-feedback "+(feedback.correct?"correct":"incorrect")}><strong>{feedback.correct?"Correct":"Answer: "+feedback.answer}</strong><p>{feedback.explanation}</p><button className="primary" type="button" onClick={nextQuestion}>{questionIndex+1>=view.text.comprehensionQuestions.length?"Return to text":"Next"}</button></div>:null}
    </section>:<>
      <div className="reader-toolbar">
        <label><input type="checkbox" checked={furigana} onChange={(event)=>setFurigana(event.target.checked)}/> Reading hints</label>
        <div className="reader-audio"><button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.95)}>{speaking?"Playing…":view.audio?"Play native recording":"Listen to full text"}</button><button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.78)}>Slower</button></div>
      </div>
      <p className="reader-intro">{view.text.description}</p>
      {view.audio?<p className="source-note">Recording: {view.audio.credit}{view.audio.licenseName?" · "+view.audio.licenseName:""}</p>:null}
      <div className="reader-sentences">
        {view.sentences.map(({sentence,tokens,grammar})=><article className="reader-sentence" key={sentence.id}>
          <div className="reader-japanese" lang="ja">{tokens.map((token,index)=>token.lexemeId?<button className="reader-token" type="button" key={sentence.id+":"+index} onClick={()=>void chooseToken(token,sentence.id)}>
            {furigana&&token.reading&&token.reading!==token.surface?<ruby>{token.surface}<rt>{token.reading}</rt></ruby>:token.surface}
          </button>:<span key={sentence.id+":"+index}>{token.surface}</span>)}</div>
          <div className="reader-support"><button className="quiet-button" type="button" onClick={()=>toggleTranslation(sentence.id)}>{translations.has(sentence.id)?"Hide translation":"Show translation"}</button>
            {grammar.length?<details><summary>{grammar.length} grammar links</summary>{grammar.map((item)=><div className="reader-grammar" key={item.id}><strong>{item.label}</strong><span>{item.summary}</span></div>)}</details>:null}</div>
          {translations.has(sentence.id)?<p className="reader-translation">{sentence.translation}</p>:null}
        </article>)}
      </div>
      {selected?<aside className="reader-lookup"><button className="reader-lookup-close" type="button" aria-label="Close word lookup" onClick={closeLookup}>×</button><span lang="ja">{selected.token.surface}</span>{selected.token.reading?<small lang="ja">{selected.token.reading}</small>:null}<strong>{selected.token.meaning}</strong><button className="unit-action" type="button" onClick={()=>void mineSelected()}>Mine for review</button></aside>:null}
      <div className="reader-finish"><button className="primary" type="button" onClick={()=>startCheck("reading")}>Reading check</button><button className="unit-action" disabled={!listeningPlayed} type="button" onClick={()=>startCheck("listening")}>{listeningPlayed?"Listening check":"Listen first"}</button></div>
      <p className="course-note">Tap a linked word for a reading and meaning. Grammar support stays attached to the canonical sentence. The reader resolves canonical and generated forms. Imported-text analysis adds B1/B2 deinflection and browser segmentation, but still does not claim perfect Japanese NLP.</p>
    </>}
  </section>;
}

function MiniStat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
