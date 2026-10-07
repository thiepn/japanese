import { useEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { JCartouche,JInkProgress,JPattern,JSeal } from "../design";
import { AuthenticLibrary } from "./AuthenticLibrary";
import { buildExtensiveTracks } from "./extensive";
import { ShadowingLab } from "./ShadowingLab";
import { NativeListeningLab } from "./NativeListeningLab";
import { NativeCurationPanel } from "./NativeCurationPanel";
import { C1AdvancedLab } from "./C1AdvancedLab";
import { C1AutonomyPanel } from "../study/C1AutonomyPanel";
import { C1EnvironmentLab } from "./C1EnvironmentLab";
import { C1ResearchQualityLab } from "./C1ResearchQualityLab";
import { C1PrecisionLab } from "./C1PrecisionLab";
import { C1AdvancedInteractionLab } from "./C1AdvancedInteractionLab";
import { C1ProsodyEvaluationLab } from "./C1ProsodyEvaluationLab";
import { getAdaptiveImmersionRecommendation,type AdaptiveImmersionRecommendation } from "./adaptive";
import { getAutonomyMissionProgress,type AutonomyMissionProgress } from "../study/autonomyMissions";
import type { ReadingQuestion } from "@thiepn/content-schema";
import {
  buildReaderText,getImmersionProgress,gradeReadingQuestion,recordListeningExposure,recordListeningSegmentReplay,recordMinedWord,
  recordReaderLookup,recordReadingExposure,recordTextCheck,
  type ImmersionProgress,type ReaderTextView,type ReaderToken
} from "./reader";

type CheckMode="reading"|"listening";
interface SelectedToken { token:ReaderToken; sentenceId:string; }

export function Immersion({onStartProductionTask,onStartC1Synthesis,onOpenC1Coach}:{onStartProductionTask:(taskId:string)=>void;onStartC1Synthesis:(packId:string)=>void;onOpenC1Coach:(chainId:string)=>void}){
  const [progress,setProgress]=useState<ImmersionProgress|null>(null);
  const [recommendation,setRecommendation]=useState<AdaptiveImmersionRecommendation|null>(null);
  const [missions,setMissions]=useState<AutonomyMissionProgress[]>([]);
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
  const [preferredNativeSet,setPreferredNativeSet]=useState<string|null>(null);
  const [mediaKind,setMediaKind]=useState<"all"|"story"|"dialogue"|"functional">("all");
  const [checkStartedAt,setCheckStartedAt]=useState(0);
  const view=useMemo(()=>activeId?buildReaderText(activeId):null,[activeId]);
  const extensiveTracks=useMemo(()=>progress?buildExtensiveTracks(progress):[],[progress]);
  const audioProvider=useRef(getDefaultAudioProvider());

  async function refresh(){
    try{
      const [nextProgress,nextRecommendation,nextMissions]=await Promise.all([getImmersionProgress(),getAdaptiveImmersionRecommendation(),getAutonomyMissionProgress()]);
      setProgress(nextProgress);setRecommendation(nextRecommendation);setMissions(nextMissions);
    }catch{setProgress(null);setRecommendation(null);setMissions([]);}
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

  const visibleTexts=(progress?.texts??[]).filter((text)=>mediaKind==="all"||text.kind===mediaKind);
  const avgReadiness=progress?.texts.length
    ?progress.texts.reduce((sum,text)=>sum+text.readiness,0)/progress.texts.length
    :0;

  return <section className="dashboard immerse-page j6-immerse">
    <header className="j6-hero">
      <JPattern name="ichimatsu" className="j6-hero__pattern"/>
      <div className="j6-hero__sign" aria-hidden="true">
        <span lang="ja">浸</span>
        <small>IMMERSE</small>
      </div>
      <div className="j6-hero__copy">
        <JCartouche japanese="浸る" subtitle="Immerse"/>
        <p className="j6-kicker">READ · LISTEN · NOTICE · RETURN</p>
        <h1>Enter Japanese,<br/><em>not another lesson.</em></h1>
        <p>Read connected Japanese, listen before looking when you want the pressure, mine what matters, and move gradually from graded texts into native-source work.</p>
      </div>
      <div className="j6-hero__issue" aria-hidden="true">
        <span>日本語</span>
        <strong>READING<br/>ROOM</strong>
        <small>VOL. 01</small>
      </div>
    </header>

    {progress?<section className="j6-ledger" aria-label="Immersion activity">
      <div><span>文章</span><strong>{progress.texts.length}</strong><small>graded texts</small></div>
      <div><span>語</span><strong>{progress.minedWords}</strong><small>mined words</small></div>
      <div><span>読</span><strong>{progress.readingChecks}</strong><small>reading checks</small></div>
      <div><span>聴</span><strong>{progress.listeningChecks}</strong><small>listening checks</small></div>
      <div className="j6-ledger__readiness">
        <span>準備</span><strong>{Math.round(avgReadiness*100)}%</strong><small>average lexical readiness</small>
        <JInkProgress value={avgReadiness} label="Average lexical readiness"/>
      </div>
    </section>:null}

    {recommendation?<section className="j6-feature" aria-labelledby="j6-feature-title">
      <div className="j6-feature__mark" aria-hidden="true"><span>次</span><small>NEXT</small></div>
      <div className="j6-feature__copy">
        <p className="j6-kicker">EDITOR'S PICK · 次に読む</p>
        <h2 id="j6-feature-title">Focus on {recommendation.focus}</h2>
        {recommendation.canonical?<article className="j6-feature__story">
          <div className="j6-feature__meta"><span>{recommendation.canonical.level}</span><span>graded</span><span>{Math.round(recommendation.canonical.readiness*100)}% ready</span></div>
          <h3>{recommendation.canonical.title}</h3>
          <p>{recommendation.canonical.reason}</p>
          <small>{Math.round(recommendation.canonical.mastery*100)}% {recommendation.focus} mastery</small>
          <button className="j6-open-feature" type="button" onClick={()=>void openText(recommendation.canonical!.id)}>
            <span>Open recommended text</span><i aria-hidden="true">→</i>
          </button>
        </article>:null}
      </div>
      {recommendation.privateDocument?<aside className="j6-feature__private">
        <span>私</span>
        <small>YOUR JAPANESE</small>
        <strong>{recommendation.privateDocument.title}</strong>
        <p>{recommendation.privateDocument.reason}</p>
        <em>{Math.round(recommendation.privateDocument.knownRatio*100)}% known · {recommendation.privateDocument.difficulty}</em>
      </aside>:null}
    </section>:null}

    <section className="j6-media" aria-labelledby="j6-media-title">
      <header className="j6-section-head">
        <div>
          <p className="j6-kicker">THE READING SHELF · 読みもの</p>
          <h2 id="j6-media-title">Japanese to live inside</h2>
          <p>Choose by medium rather than by lesson number. Readiness guides you; it never locks a text.</p>
        </div>
        <div className="j6-media-filters" aria-label="Text type">
          {(["all","story","dialogue","functional"] as const).map((kind)=><button
            className={mediaKind===kind?"active":""}
            key={kind}
            onClick={()=>setMediaKind(kind)}
            type="button"
          >{kind==="all"?"All":kind[0]!.toUpperCase()+kind.slice(1)}</button>)}
        </div>
      </header>

      <div className="immersion-list j6-covers">
        {visibleTexts.map((text,index)=><article className={"immersion-card j6-cover j6-cover--"+text.kind} key={text.id}>
          <div className="j6-cover__number" aria-hidden="true">{String(index+1).padStart(2,"0")}</div>
          <div className="j6-cover__art" aria-hidden="true">
            <span>{text.kind==="story"?"物":text.kind==="dialogue"?"話":"用"}</span>
            <i/>
          </div>
          <div className="immersion-card-main j6-cover__copy">
            <div className="immersion-meta j6-cover__meta"><span>{text.level}</span><span>{text.kind}</span><span>~{text.estimatedMinutes} min</span></div>
            <h3>{text.title}</h3>
            <p>{text.description}</p>
            <div className="readiness j6-cover__readiness">
              <div><span>Known-word readiness</span><strong>{Math.round(text.readiness*100)}%</strong></div>
              <JInkProgress value={text.readiness} label={text.title+" lexical readiness"}/>
              <small>{text.knownWords} / {text.totalWords} linked words familiar</small>
            </div>
          </div>
          <footer className="immersion-actions j6-cover__footer">
            <div><small>読 Reading</small><strong>{Math.round(text.readingMastery*100)}%</strong></div>
            <div><small>聴 Listening</small><strong>{Math.round(text.listeningMastery*100)}%</strong></div>
            <button className="unit-action j6-cover__open" type="button" onClick={()=>void openText(text.id)}>Open text</button>
          </footer>
        </article>)}
      </div>
      <p className="j6-note">Curated connected audio uses a verified recording when attached; otherwise the interface explicitly identifies device Japanese speech synthesis.</p>
    </section>

    {extensiveTracks.length?<section className="extensive-tracks j6-series" aria-labelledby="j6-series-title">
      <header className="j6-section-head">
        <div><p className="j6-kicker">SERIES · 連載</p><h2 id="j6-series-title">Read across a theme</h2><p>Connected B2→C1 tracks build endurance across several texts instead of turning one passage into a mastery shortcut.</p></div>
        <JSeal label="Series">連</JSeal>
      </header>
      <div className="extensive-grid j6-series__grid">{extensiveTracks.map((track)=><article className="extensive-card j6-series-card" key={track.id}>
        <span>{track.total} texts · ~{track.minutes} min</span>
        <h3>{track.title}</h3>
        <p>{track.description}</p>
        <div className="j6-series-card__metric"><strong>{Math.round(track.readiness*100)}%</strong><span>average readiness</span></div>
        <JInkProgress value={track.readiness} label={track.title+" average readiness"}/>
        <small>{track.completed} / {track.total} with reading + listening evidence</small>
        {track.nextText?<button className="unit-action" type="button" onClick={()=>void openText(track.nextText!.id)}>Next: {track.nextText.title}</button>:null}
      </article>)}</div>
    </section>:null}

    {missions.length?<section className="autonomy-missions j6-missions" aria-labelledby="j6-missions-title">
      <header className="j6-section-head">
        <div><p className="j6-kicker">MISSIONS · 実践</p><h2 id="j6-missions-title">Long-form B2 task chains</h2><p>Cross reading, listening and production over time. Completion is inferred from normal StudyEvents rather than a separate mission score.</p></div>
        <JSeal label="Missions">実</JSeal>
      </header>
      <div className="mission-grid j6-missions__grid">{missions.map((entry)=>{
        const next=entry.nextStage;
        return <article className="mission-card j6-mission" key={entry.mission.id}>
          <div className="mission-card-head"><span>{entry.mission.domain} · ~{entry.mission.estimatedMinutes} min</span><strong>{entry.completedStages}/{entry.totalStages}</strong></div>
          <h3>{entry.mission.title}</h3>
          <p>{entry.mission.description}</p>
          <div className="mission-stage-list">{entry.stages.map((stage)=><span className={stage.complete?"done":""} key={stage.id}>{stage.complete?"✓":"○"} {stage.title}</span>)}</div>
          <small>{entry.activeDays} active day{entry.activeDays===1?"":"s"} · delayed transfer requires 20+ hours</small>
          {next?<button className="unit-action" type="button" onClick={()=>{
            if(next.textId)void openText(next.textId);
            else if(next.taskId)onStartProductionTask(next.taskId);
          }}>Next: {next.title}</button>:<span className="mission-complete">All mission evidence collected</span>}
        </article>;
      })}</div>
    </section>:null}

    <section className="j6-studios" aria-labelledby="j6-studios-title">
      <header className="j6-section-head">
        <div><p className="j6-kicker">ADVANCED STUDIOS · 研究室</p><h2 id="j6-studios-title">Native-source and advanced work</h2><p>Open the specialist studio you need. These tools stay available without making the reading shelf feel like an operations dashboard.</p></div>
        <JSeal label="Advanced studios">研</JSeal>
      </header>

      <Studio glyph="環" title="Real-source environment" subtitle="Source portals · writing · live defense" id="j6-studio-p15"><C1EnvironmentLab/></Studio>
      <Studio glyph="研" title="Research quality" subtitle="Source records · licensing · expert feedback" id="j6-studio-p16"><C1ResearchQualityLab/></Studio>
      <Studio glyph="精" title="Precision bridge" subtitle="Style · specialist discourse · repair" id="j6-studio-p17"><C1PrecisionLab/></Studio>
      <Studio glyph="話" title="Advanced interaction" subtitle="Live pressure · partner evidence · transfer" id="j6-studio-p18"><C1AdvancedInteractionLab/></Studio>
      <Studio glyph="音" title="Prosody and external review" subtitle="Real audio · overlap · reviewer packets" id="j6-studio-p19"><C1ProsodyEvaluationLab/></Studio>
      <Studio glyph="自" title="C1 autonomy" subtitle="Long-form independent missions" id="j6-studio-p14">
        <C1AutonomyPanel
          onOpenText={(id)=>void openText(id)}
          onOpenNativeSet={(setId)=>{
            setPreferredNativeSet(setId);
            requestAnimationFrame(()=>document.getElementById("p13-c1-source-depth")?.scrollIntoView({behavior:"smooth",block:"start"}));
          }}
          onStartSynthesis={onStartC1Synthesis}
          onStartProduction={onStartProductionTask}
          onOpenCoach={onOpenC1Coach}
        />
      </Studio>
      <Studio glyph="源" title="Native source depth" subtitle="Multi-source synthesis · evidence" id="j6-studio-p13">
        <C1AdvancedLab onOpenText={(id)=>void openText(id)} onStartSynthesis={onStartC1Synthesis} preferredSetId={preferredNativeSet}/>
      </Studio>
      <Studio glyph="聴" title="Native listening" subtitle="Verified recordings and connected listening" id="j6-studio-native-listening"><NativeListeningLab/></Studio>
      <Studio glyph="選" title="Native curation" subtitle="Curated source sets" id="j6-studio-curation"><NativeCurationPanel/></Studio>
      <Studio glyph="影" title="Shadowing" subtitle="Listen · record · compare" id="j6-studio-shadowing"><ShadowingLab/></Studio>
      <Studio glyph="私" title="Your Japanese" subtitle="Private authentic input and imports" id="j6-studio-authentic"><AuthenticLibrary/></Studio>
    </section>
  </section>;
}

function Studio({glyph,title,subtitle,id,children}:{glyph:string;title:string;subtitle:string;id:string;children:React.ReactNode}){
  return <details className="j6-studio" id={id}>
    <summary>
      <span className="j6-studio__glyph" aria-hidden="true">{glyph}</span>
      <span><strong>{title}</strong><small>{subtitle}</small></span>
      <i aria-hidden="true">＋</i>
    </summary>
    <div className="j6-studio__body">{children}</div>
  </details>;
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

  return <section className="reader-page j6-reader">
    <header className="reader-head j6-reader__head">
      <button className="quiet-button reader-back j6-reader__back" type="button" onClick={closeText}>← Immerse</button>
      <div className="j6-reader__identity">
        <span className="j6-reader__level">{view.text.level}</span>
        <span className="j6-reader__kind">{view.text.kind}</span>
        <h1>{view.text.title}</h1>
      </div>
      <div className="j6-reader__edition" aria-hidden="true"><span>読む</span><small>READER</small></div>
    </header>

    {checkMode&&question?<section className="reader-check j6-reader-check">
      <div className="j6-reader-check__mark" aria-hidden="true">{checkMode==="reading"?"読":"聴"}</div>
      <p className="eyebrow">{checkMode==="reading"?"READING CHECK":"LISTENING CHECK"} · {questionIndex+1}/{view.text.comprehensionQuestions.length}</p>
      <h2>{question.prompt}</h2>
      <div className="reader-check-choices">{question.choices.map((choice,index)=><button type="button" disabled={Boolean(feedback)} key={choice} onClick={()=>void answerQuestion(question,choice)}>
        <span aria-hidden="true">{index+1}</span><strong>{choice}</strong>
      </button>)}</div>
      {feedback?<div className={"reader-check-feedback j6-reader-check__feedback "+(feedback.correct?"correct":"incorrect")}>
        <span className="j6-reader-check__seal" aria-hidden="true">{feedback.correct?"正":"直"}</span>
        <strong>{feedback.correct?"Correct":"Answer: "+feedback.answer}</strong>
        <p>{feedback.explanation}</p>
        <button className="primary" type="button" onClick={nextQuestion}>{questionIndex+1>=view.text.comprehensionQuestions.length?"Return to text":"Next"}</button>
      </div>:null}
    </section>:<>
      <div className="j6-reader__layout">
        <aside className="j6-reader__tools">
          <div className="j6-reader__tool-heading"><span lang="ja">読む</span><strong>Reading controls</strong></div>
          <div className="reader-toolbar j6-reader-toolbar">
            <label className="j6-toggle"><input type="checkbox" checked={furigana} onChange={(event)=>setFurigana(event.target.checked)}/><span>Reading hints</span></label>
            <div className="reader-audio j6-reader-audio">
              <button className={listeningFirst?"active":""} type="button" onClick={()=>setListeningFirst((value)=>!value)}>{listeningFirst?"Listening-first on":"Listening-first"}</button>
              <button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.95)}>{speaking?"Playing…":view.audio?"Play native recording":"Listen to full text"}</button>
              <button type="button" disabled={speaking||(!view.audio&&typeof speechSynthesis==="undefined")} onClick={()=>void speak(.78)}>Slower</button>
            </div>
          </div>
          <p className="reader-intro j6-reader__intro">{view.text.description}</p>
          {view.audio?<p className="source-note j6-reader__source">Recording: {view.audio.credit}{view.audio.licenseName?" · "+view.audio.licenseName:""}</p>:<p className="source-note j6-reader__source">Audio: device Japanese speech synthesis when listening is used.</p>}
          <div className="j6-reader__guide">
            <span>01</span><p>Tap linked words for reading and meaning.</p>
            <span>02</span><p>Reveal translation sentence by sentence.</p>
            <span>03</span><p>Use checks only after real reading/listening.</p>
          </div>
        </aside>

        <article className="j6-reader__paper">
          <div className="j6-reader__paper-head" aria-hidden="true"><span>{view.text.level}</span><i/><span>日本語</span></div>
          {listeningFirst&&!listeningPlayed?<div className="listening-first-gate j6-listening-first">
            <span>LISTENING FIRST · 先に聴く</span>
            <h2>Understand the passage before reading it</h2>
            <p>Play the full passage at normal or slower speed. The text stays hidden until one complete playback finishes, so listening creates its own retrieval pressure.</p>
          </div>:null}

          <div className={"reader-sentences j6-reader-sentences "+(listeningFirst&&!listeningPlayed?"listening-first-hidden":"")}>
            {view.sentences.map(({sentence,tokens,grammar},sentenceIndex)=><article className="reader-sentence j6-reader-sentence" key={sentence.id}>
              <span className="j6-reader-sentence__number" aria-hidden="true">{String(sentenceIndex+1).padStart(2,"0")}</span>
              <div className="reader-japanese j6-reader-japanese" lang="ja">{tokens.map((token,index)=>token.lexemeId?<button className="reader-token" type="button" key={sentence.id+":"+index} onClick={()=>void chooseToken(token,sentence.id)}>
                {furigana&&token.reading&&token.reading!==token.surface?<ruby>{token.surface}<rt>{token.reading}</rt></ruby>:token.surface}
              </button>:<span key={sentence.id+":"+index}>{token.surface}</span>)}</div>
              <div className="reader-support j6-reader-support">
                <button className="quiet-button" type="button" onClick={()=>toggleTranslation(sentence.id)}>{translations.has(sentence.id)?"Hide translation":"Show translation"}</button>
                <button className="quiet-button" type="button" disabled={speakingSegment===sentence.id} onClick={()=>void speakSegment(sentence.id,.92,1)}>{speakingSegment===sentence.id?"Playing…":"Replay sentence"}</button>
                <button className="quiet-button" type="button" disabled={speakingSegment===sentence.id} onClick={()=>void speakSegment(sentence.id,.82,2)}>Slow ×2</button>
                {grammar.length?<details><summary>{grammar.length} grammar links</summary>{grammar.map((item)=><div className="reader-grammar" key={item.id}><strong>{item.label}</strong><span>{item.summary}</span></div>)}</details>:null}
              </div>
              {translations.has(sentence.id)?<p className="reader-translation j6-reader-translation">{sentence.translation}</p>:null}
            </article>)}
          </div>

          <footer className="reader-finish j6-reader-finish">
            <div><span lang="ja">読後</span><strong>When you are ready</strong></div>
            <button className="primary" type="button" onClick={()=>startCheck("reading")}>Reading check</button>
            <button className="unit-action" disabled={!listeningPlayed} type="button" onClick={()=>startCheck("listening")}>{listeningPlayed?"Listening check":"Listen first"}</button>
          </footer>
        </article>
      </div>

      {selected?<aside className="reader-lookup j6-reader-lookup">
        <button className="reader-lookup-close" type="button" aria-label="Close word lookup" onClick={closeLookup}>×</button>
        <span lang="ja">{selected.token.surface}</span>
        {selected.token.reading?<small lang="ja">{selected.token.reading}</small>:null}
        <strong>{selected.token.meaning}</strong>
        <button className="unit-action" type="button" onClick={()=>void mineSelected()}>Mine for review</button>
      </aside>:null}
    </>}
  </section>;
}
