import {useEffect,useMemo,useState} from "react";
import type {CourseUnitProgress} from "../study/runtime";
import {buildJapaneseLevelCatalog,COURSE_LEVELS,courseLocation,parseCourseLocation,type CourseLevel} from "../study/cefrCourseCatalog";
import {deepTeachingAnchors} from "../study/cur03A1DeepCourse";
import {ENTRY_SELF_REPORT,recommendCourseEntry,type EntrySelfReport} from "../study/cur04Placement";
import "./courseCatalog.css";

export function CourseCatalog({course,status,onStartUnit,onStartAssessment}:{
  course:readonly CourseUnitProgress[];
  status:string;
  onStartUnit:(id:string,intent?:"resume"|"restart")=>void;
  onStartAssessment:(id:string)=>void;
}){
  const catalog=useMemo(()=>buildJapaneseLevelCatalog(course),[course]);
  const [selfReport,setSelfReport]=useState<EntrySelfReport|null>(null);
  const advice=useMemo(()=>selfReport?recommendCourseEntry(selfReport,course):null,[selfReport,course]);
  const [location,setLocation]=useState(()=>parseCourseLocation(window.location.hash)??{level:"A1" as CourseLevel,unitId:null});
  useEffect(()=>{
    const sync=()=>setLocation(parseCourseLocation(window.location.hash)??{level:"A1",unitId:null});
    window.addEventListener("popstate",sync);
    window.addEventListener("hashchange",sync);
    return ()=>{window.removeEventListener("popstate",sync);window.removeEventListener("hashchange",sync);};
  },[]);
  const select=(level:CourseLevel,unitId?:string)=>{
    const hash=courseLocation(level,unitId);
    if(window.location.hash!==hash)window.history.pushState(window.history.state,"",window.location.pathname+window.location.search+hash);
    setLocation({level,unitId:unitId??null});
  };
  const current=catalog.find(item=>item.level===location.level)??catalog[0]!;
  const selected=current.lessons.find(item=>item.id===location.unitId)??null;
  const resume=current.lessons.find(item=>item.progress?.status==="learning")??current.lessons.find(item=>item.progress?.status!=="mastered")??current.lessons[0]??null;
  const busy=status==="loading";
  return <section className="cur01-catalog" aria-label="Six-level course catalog">
    <header className="cur01-heading">
      <div><h1>Course</h1></div>
      <span lang="ja">日本語</span>
    </header>
    <details className="cur04-placement">
      <summary>Find a starting lesson (optional)</summary>
      <fieldset>
        <legend>Which best describes what you currently use Japanese for?</legend>
        <div className="cur04-choices">
          {ENTRY_SELF_REPORT.map(item=><label key={item.id}>
            <input type="radio" name="cur04-start-level" value={item.id} checked={selfReport===item.id}
              onChange={()=>setSelfReport(item.id)}/>
            <span>{item.label}</span>
          </label>)}
        </div>
      </fieldset>
      {advice?<div className="cur04-advice" role="status">
        <strong>{advice.suggested} · {advice.title}</strong>
        <p>{advice.message} All levels and lessons remain selectable.</p>
        <button type="button" onClick={()=>select(advice.suggested,advice.unitId)}>Show suggested lesson</button>
        <button type="button" disabled={busy} onClick={()=>{select(advice.suggested,advice.unitId);onStartUnit(advice.unitId,"resume");}}>Open suggested lesson</button>
      </div>:null}
    </details>
    <div className="cur01-levels" role="tablist" aria-label="Course levels">
      {COURSE_LEVELS.map(level=>{
        const record=catalog.find(item=>item.level===level)!;
        return <button type="button" role="tab" id={"cur01-tab-"+level}
          aria-controls="cur01-lessons" aria-selected={level===current.level} key={level}
          onClick={()=>select(level)} className={level===current.level?"cur01-selected":""}>
          <strong>{level}</strong><span>{record.lessons.length?record.lessons.length+" units":"Planned"}</span>
        </button>;
      })}
    </div>
    <div className="cur01-detail" id="cur01-lessons" role="tabpanel" aria-labelledby={"cur01-tab-"+current.level}>
      <div className="cur01-section-heading">
        <div><h2>{current.level} lessons</h2><p>{current.lessons.length?current.lessons.length+" existing course units":"No lessons published yet"}</p></div>
        {resume?<button type="button" className="cur01-continue" disabled={busy}
          onClick={()=>{select(current.level,resume.id);onStartUnit(resume.legacyUnitId,"resume");}}>
          {resume.progress?.status==="learning"?"Resume":"Open"} {String(resume.number).padStart(2,"0")}
        </button>:null}
      </div>
      {location.unitId&&!selected?<p role="status">This lesson is not available in {current.level}. Choose an available lesson.</p>:null}
      {current.availability==="planned"?<p role="status" className="cur01-empty">{current.level} curriculum is planned. There are no published course units at this level.</p>:
        <ol className="cur01-lessons">
          {current.lessons.map(lesson=>{
            const progress=lesson.progress;
            const active=selected?.id===lesson.id;
            const action=progress?.status==="learning"?"Resume":"Open";
            return <li className={active?"cur01-active":""} data-cur03-deep={deepTeachingAnchors(lesson.legacyUnitId).length>0?"true":undefined} key={lesson.id}>
              <span className="cur01-number">{String(lesson.number).padStart(2,"0")}</span>
              <div className="cur01-lesson-main"><h3>{lesson.title}</h3><p>{lesson.canDo}</p>
                {progress?.evidenceCount?<span>{progress.evidenceCount} recorded responses</span>:null}
              </div>
              <div className="cur04-lesson-actions">
                <button type="button" disabled={busy} aria-label={action+" lesson "+lesson.number+": "+lesson.title}
                  onClick={()=>{select(current.level,lesson.id);onStartUnit(lesson.legacyUnitId,"resume");}}>{action}</button>
                <button type="button" disabled={busy} aria-label={"Restart lesson "+lesson.number+": "+lesson.title+" from the first section without clearing recorded answers"}
                  onClick={()=>{select(current.level,lesson.id);onStartUnit(lesson.legacyUnitId,"restart");}}>Restart</button>
              </div>
            </li>;
          })}
        </ol>
      }
      {selected&&selected.progress?.assessment.status==="ready"?
        <button className="cur01-assessment" type="button" disabled={busy}
          onClick={()=>onStartAssessment(selected.legacyUnitId)}>Open selected lesson check</button>:null}
    </div>
  </section>;
}
