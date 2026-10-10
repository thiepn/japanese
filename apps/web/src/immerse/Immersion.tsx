import { useEffect,useLayoutEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { J6ImmersionHome,J6ReaderView } from "../design/J6Immersion";
import { buildExtensiveTracks } from "./extensive";
import { ReaderPlaybackFence } from "./playbackFence";
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
  const [audioError,setAudioError]=useState<string|null>(null);
  const [checkStartedAt,setCheckStartedAt]=useState(0);
  const view=useMemo(()=>activeId?buildReaderText(activeId):null,[activeId]);
  const extensiveTracks=useMemo(()=>progress?buildExtensiveTracks(progress):[],[progress]);
  const audioProvider=useRef(getDefaultAudioProvider());
  const playbackFence=useRef(new ReaderPlaybackFence());
  const cancelSpeechWait=useRef<(()=>void)|null>(null);
  const catalogScrollY=useRef<number|null>(null);
  const readerWasOpen=useRef(false);

  async function refresh(){
    try{
      const [nextProgress,nextRecommendation,nextMissions]=await Promise.all([getImmersionProgress(),getAdaptiveImmersionRecommendation(),getAutonomyMissionProgress()]);
      setProgress(nextProgress);setRecommendation(nextRecommendation);setMissions(nextMissions);
    }catch{setProgress(null);setRecommendation(null);setMissions([]);}
  }
  useEffect(()=>{
    void refresh();
    return()=>{
      playbackFence.current.invalidate();
      cancelSpeechWait.current?.();
      cancelSpeechWait.current=null;
      audioProvider.current.stop();
      if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();
    };
  },[]);
  function stopPlayback(){
    playbackFence.current.invalidate();
    cancelSpeechWait.current?.();
    cancelSpeechWait.current=null;
    audioProvider.current.stop();
    if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();
    setSpeaking(false);setSpeakingSegment(null);
  }
  // Reader mounts in place of a scrolled catalogue; reset before paint.
  useLayoutEffect(()=>{
    if(view){
      readerWasOpen.current=true;
      window.scrollTo({top:0,left:0,behavior:"instant"});
      document.querySelector<HTMLElement>(".j6-reader__identity h1")?.focus({preventScroll:true});
    }else if(readerWasOpen.current){
      readerWasOpen.current=false;
      const previous=catalogScrollY.current;
      catalogScrollY.current=null;
      if(previous!==null)window.scrollTo({top:previous,left:0,behavior:"instant"});
    }
  },[view?.text.id]);


  async function openText(id:string){
    stopPlayback();
    setAudioError(null);
    if(activeId===null)catalogScrollY.current=window.scrollY;
    setActiveId(id);setTranslations(new Set());setSelected(null);setListeningPlayed(false);setCheckMode(null);setQuestionIndex(0);setFeedback(null);
    await recordReadingExposure(id);void refresh();
  }
  function closeText(){stopPlayback();setAudioError(null);setActiveId(null);setCheckMode(null);setSelected(null);}
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
    if(!view||speaking||speakingSegment!==null)return;
    const epoch=playbackFence.current.begin();
    const sourceView=view;
    setAudioError(null);
    setSpeaking(true);
    if(sourceView.audio){
      try{
        await audioProvider.current.play(sourceView.audio,{rate});
        // stop() resolves the provider's pending Promise. It does NOT prove a listen.
        if(!playbackFence.current.accepts(epoch))return;
        setListeningPlayed(true);
        await recordListeningExposure(sourceView.text.id,rate,"recorded");
        if(playbackFence.current.accepts(epoch))void refresh();
      }catch{
        if(playbackFence.current.accepts(epoch))setAudioError("Recording failed. Retry or read without a listening check.");
      }finally{
        if(playbackFence.current.accepts(epoch))setSpeaking(false);
      }
      return;
    }
    if(typeof speechSynthesis==="undefined"){
      if(playbackFence.current.accepts(epoch)){setAudioError("Japanese speech synthesis is unavailable in this browser.");setSpeaking(false);}
      return;
    }
    try{
      speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(sourceView.joinedJapanese);
      utterance.lang="ja-JP";utterance.rate=rate;
      const japanese=speechSynthesis.getVoices().find((voice)=>voice.lang.toLowerCase().startsWith("ja"));
      if(japanese)utterance.voice=japanese;
      utterance.onend=()=>{
        if(!playbackFence.current.accepts(epoch))return;
        setSpeaking(false);setListeningPlayed(true);
        void recordListeningExposure(sourceView.text.id,rate,"speech_synthesis")
          .then(()=>{if(playbackFence.current.accepts(epoch))void refresh();})
          .catch(()=>{if(playbackFence.current.accepts(epoch))setAudioError("Listening progress could not be saved.");});
      };
      utterance.onerror=()=>{
        if(playbackFence.current.accepts(epoch)){setAudioError("Japanese speech synthesis failed. Retry or read instead.");setSpeaking(false);}
      };
      speechSynthesis.speak(utterance);
    }catch{
      if(playbackFence.current.accepts(epoch)){setAudioError("Japanese speech synthesis failed. Retry or read instead.");setSpeaking(false);}
    }
  }

  async function speakSegment(sentenceId:string,rate=.92,repeats=1){
    if(!view||speaking||speakingSegment!==null)return;
    const sourceView=view;
    const item=sourceView.sentences.find((entry)=>entry.sentence.id===sentenceId);if(!item)return;
    const segment=sourceView.text.listeningSegments?.find((entry)=>entry.sentenceId===sentenceId);
    const epoch=playbackFence.current.begin();
    setAudioError(null);
    setSpeakingSegment(sentenceId);
    try{
      if(sourceView.audio&&segment?.startMs!==undefined&&segment.endMs!==undefined){
        await audioProvider.current.play(sourceView.audio,{rate,repeats,startMs:segment.startMs,endMs:segment.endMs});
        if(!playbackFence.current.accepts(epoch))return;
        await recordListeningSegmentReplay(sourceView.text.id,sentenceId,rate,repeats,"recorded");
      }else{
        if(typeof speechSynthesis==="undefined"){
          throw Error("SPEECH_SYNTHESIS_UNAVAILABLE");
        }
        for(let index=0;index<Math.max(1,Math.min(3,repeats));index++){
          if(!playbackFence.current.accepts(epoch))return;
          await new Promise<void>((resolve,reject)=>{
            const utterance=new SpeechSynthesisUtterance(item.sentence.text);utterance.lang="ja-JP";utterance.rate=rate;
            const japanese=speechSynthesis.getVoices().find((voice)=>voice.lang.toLowerCase().startsWith("ja"));if(japanese)utterance.voice=japanese;
            let settled=false;
            const done=(error=false)=>{
              if(settled)return;settled=true;
              cancelSpeechWait.current=null;
              if(error)reject(Error("SPEECH_SYNTHESIS_FAILED"));else resolve();
            };
            cancelSpeechWait.current=()=>done();
            utterance.onend=()=>done();utterance.onerror=()=>done(true);
            try{speechSynthesis.speak(utterance);}catch{done(true);}
          });
        }
        if(!playbackFence.current.accepts(epoch))return;
        await recordListeningSegmentReplay(sourceView.text.id,sentenceId,rate,repeats,"speech_synthesis");
      }
    }catch{
      if(playbackFence.current.accepts(epoch))setAudioError("Sentence playback failed. Retry or continue reading.");
    }finally{
      if(playbackFence.current.accepts(epoch)){setSpeakingSegment(null);void refresh();}
    }
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

  if(view)return <J6ReaderView view={view} furigana={furigana} setFurigana={setFurigana} translations={translations} toggleTranslation={toggleTranslation}
    selected={selected} chooseToken={chooseToken} mineSelected={mineSelected} closeLookup={()=>setSelected(null)} closeText={closeText}
    listeningPlayed={listeningPlayed} speaking={speaking} speak={speak} audioError={audioError} checkMode={checkMode} startCheck={startCheck}
    questionIndex={questionIndex} feedback={feedback} answerQuestion={answerQuestion} nextQuestion={nextQuestion} speakingSegment={speakingSegment} speakSegment={speakSegment}/>;

  return <J6ImmersionHome
    progress={progress}
    recommendation={recommendation}
    missions={missions}
    extensiveTracks={extensiveTracks}
    openText={openText}
    onStartProductionTask={onStartProductionTask}
    onStartC1Synthesis={onStartC1Synthesis}
    onOpenC1Coach={onOpenC1Coach}
    preferredNativeSet={preferredNativeSet}
    onPreferredNativeSet={setPreferredNativeSet}
  />;
}
