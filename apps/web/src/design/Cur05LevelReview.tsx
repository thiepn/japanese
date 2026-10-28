import {useEffect,useMemo,useState} from "react";
import type {CourseLevelReviewOverview,CourseReviewLevel} from "../study/cur05LevelReview";
import {normalizeCourseReviewLevels,reviewSelectionCounts,courseReviewBatchPlan} from "../study/cur05LevelReview";
import {COURSE_LEVELS,type CourseLevel} from "../study/cefrCourseCatalog";
import {buildCur06VocabularyJourney,type Cur06Mode} from "../study/cur06VocabularyJourney";
import {readCoursePosition} from "../study/cur03CoursePosition";
import {Cur07UnitComparison,type Cur07Recover} from "./Cur07UnitComparison";
import "./cur05LevelReview.css";

export function Cur05LevelReview({ownerId,overview,activeLevel,busy,onReviewDue,onReviewLevels,onPreview,onOpenUnit,onCur06Journey,onCur07Recover}:{
 ownerId:string;overview:CourseLevelReviewOverview|null;activeLevel:CourseLevel;busy:boolean;
 onReviewDue:()=>void;onReviewLevels:(levels:readonly CourseReviewLevel[])=>void;
 onPreview:(lexemeId:string)=>void;onOpenUnit:(unitId:string,level:CourseLevel)=>void;
 onCur06Journey:(id:string,mode:Cur06Mode,unitId?:string,intent?:"resume"|"restart",contrastId?:string)=>void;
 onCur07Recover:Cur07Recover;
}){
 const [scope,setScope]=useState<"active"|"all"|"multi">("active");
 const [custom,setCustom]=useState<CourseReviewLevel[]>(["A1"]);
 const [showCount,setShowCount]=useState(18);
 useEffect(()=>{setScope("active");setShowCount(18)},[ownerId]);
 const selected=useMemo(()=>normalizeCourseReviewLevels(scope==="active"?[activeLevel]:
  scope==="all"?[...COURSE_LEVELS,"unassigned"]:custom),[scope,activeLevel,custom]);
 const current=overview?.accountId===ownerId?overview:null;
 const counts=current?reviewSelectionCounts(current,selected):null;
 const batch=current?courseReviewBatchPlan(current,selected):null;
 const words=useMemo(()=>current?.words.filter(word=>(!word.levels.length&&selected.includes("unassigned"))
   ||word.levels.some(level=>selected.includes(level))).sort((a,b)=>b.due-a.due||a.id.localeCompare(b.id))??[],
  [current,selected]);
 const toggle=(level:CourseReviewLevel)=>{
  setCustom(old=>{
   const next=old.includes(level)?old.filter(value=>value!==level):[...old,level];
   return next.length?next:old;
  });
 };
 return <section className="cur05-panel" aria-label="Vocabulary and level reviews">
  <header className="cur05-top"><div><h2>Vocabulary & review</h2><p>Original words, source units and scheduled FSRS reviews</p></div>
   <div className="cur05-global">
    <strong>{current?current.globalDue:"—"}</strong>
    <span>due across Japanese</span>
   </div>
  </header>
  <div className="cur05-scopes" role="group" aria-label="Review scope">
   <button type="button" aria-pressed={scope==="active"} onClick={()=>setScope("active")}>This level ({activeLevel})</button>
   <button type="button" aria-pressed={scope==="all"} onClick={()=>setScope("all")}>All levels</button>
   <button type="button" aria-pressed={scope==="multi"} onClick={()=>{setScope("multi");setCustom(old=>old.includes(activeLevel)?old:[...old,activeLevel]);}}>Choose levels</button>
  </div>
  {scope==="multi"?<fieldset className="cur05-level-choices"><legend>Include one or more source-linked levels</legend>
   {[...COURSE_LEVELS,"unassigned" as const].map(level=><label key={level}><input type="checkbox" aria-label={level==="unassigned"?"Unassigned":level} checked={custom.includes(level)}
    onChange={()=>toggle(level)}/><span>{level==="unassigned"?"Unassigned":level}</span>
    <small>{current?.perLevel.find(s=>s.level===level)?.due??0} due</small></label>)}
  </fieldset>:null}
  {current?<div className="cur05-stats" role="status">
   <span><strong>{counts?.due??0}</strong> due in selection</span>
   <span>{counts?.wordCount??0} linked words</span>
   <span>{counts?.scheduled??0} scheduled prompts</span>
   <span>{current.otherDue} other Japanese due prompts</span>
  </div>:<p role="status">Review counts are loading from this learner's local FSRS history.</p>}
  <div className="cur05-actions">
   <button type="button" disabled={busy||!current||(counts?.due??0)===0} onClick={()=>onReviewLevels(selected)}>
    {batch?.remainingDue
      ?"Review next "+batch.queueSize+" of "+batch.selectionDue+" due"
      :"Review selected due ("+(batch?.queueSize??0)+")"}
   </button>
   <button type="button" disabled={busy||!current||current.globalDue===0} onClick={onReviewDue}>
    All Japanese due ({current?.globalDue??0})
   </button>
  </div>
  {batch&&batch.remainingDue>0?<p className="cur05-batch-note" role="status">
    This session contains {batch.queueSize} of {batch.selectionDue} original due prompts; {batch.remainingDue} remain due until you review them.
    {batch.order==="balanced"?" Selected source levels are interleaved without duplicating cross-level words.":""}
  </p>:null}
  <p className="cur05-boundary">Contexts are original source-linked study pages with no FSRS review. Practice offers unscored guided choices, independent recall, and optional writing; only scheduled graded review buttons affect FSRS. The global count also includes kana, grammar, private words and other original reviews. Source-linked vocabulary can appear in several levels: combined totals count each prompt only once. Unassigned words have no verified canonical unit-level mapping. Reading a word does not change its due date.</p>
  {current&&<div className="cur05-vocabulary">
   <div className="cur05-vocab-heading"><h3>Source-linked vocabulary</h3><span>Showing {Math.min(showCount,words.length)} of {words.length}</span></div>
   {words.length?<ol>{words.slice(0,showCount).map(word=><li key={word.id}>
    <div className="cur05-word"><strong lang="ja">{word.writing}</strong><span lang="ja">{word.reading}</span><span>{word.meaning}</span>
      <small>Source: {word.sourceTitles.join(" · ")}</small>
    </div>
    <div className="cur05-word-meta"><span>{word.due} due · {word.scheduled} scheduled</span>
      <span>{word.levels.length?word.levels.join(" / "):"Unassigned"}</span>
      {word.units.length?<div className="cur05-links">{word.units.map(unit=><button key={unit.id} type="button" onClick={()=>onOpenUnit(unit.id,unit.level)} title={"Find "+unit.title}>
        {unit.level} · {unit.title}</button>)}</div>:<small>No canonical course-unit link</small>}
    </div>
    <div className="cur06-word-actions">
      <button className="cur05-preview" type="button" disabled={busy} onClick={()=>onPreview(word.id)}
        aria-label={"Preview "+word.writing+" without recording a review"}>Preview</button>
      <button type="button" disabled={busy} onClick={()=>onCur06Journey(word.id,"explore")}
        aria-label={"Explore original contexts for "+word.writing+" without reviews"}>Contexts</button>
      <button type="button" disabled={busy} onClick={()=>onCur06Journey(word.id,"practice")}
        aria-label={"Practice "+word.writing+" with unscored guided and independent recall"}>{
          (()=>{
            try{return readCoursePosition(ownerId,"cur06-"+word.id,buildCur06VocabularyJourney(word.id,"practice"))>0?"Resume practice":"Practice";}
            catch{return "Practice";}
          })()
        }</button>
      <button type="button" disabled={busy} onClick={()=>onCur06Journey(word.id,"practice",undefined,"restart")}
        aria-label={"Restart unscored vocabulary practice for "+word.writing+" from first section without deleting recorded answers"}>Restart</button>
    </div>
    <div className="cur07-comparison-slot"><Cur07UnitComparison owner={ownerId} word={word} busy={busy} onLaunch={onCur06Journey} onRecover={onCur07Recover}/></div>
   </li>)}</ol>:<p>No source-linked words are assigned to this selection.</p>}
   {showCount<words.length?<button type="button" className="cur05-more" onClick={()=>setShowCount(value=>value+18)}>Show more words</button>:null}
  </div>}
 </section>;
}
