import {useEffect,useState} from "react";
import {listStudyEvents} from "@thiepn/local-db";
import {projectC1A1Course,type C1A1UnitProgress} from "../study/courseFirstA1";
import "./courseFirstA1.css";

export function CourseFirstA1Path({owner,busy,onStart}:{owner:string;busy:boolean;onStart:(id:string)=>void;}){
 const [status,setStatus]=useState<"loading"|"ready"|"error">("loading");
 const [units,setUnits]=useState<C1A1UnitProgress[]>([]);
 const [nextId,setNextId]=useState<string|null>(null);
 useEffect(()=>{
  let active=true;
  setStatus("loading");setUnits([]);setNextId(null);
  void listStudyEvents(owner).then(events=>{
   if(!active)return;
   const next=projectC1A1Course(events);
   setUnits(next.units);setNextId(next.nextId);setStatus("ready");
  }).catch(()=>{if(active)setStatus("error");});
  return()=>{active=false;};
 },[owner]);
 const next=units.flatMap(unit=>unit.lessons).find(lesson=>lesson.id===nextId);
 const done=units.reduce((count,unit)=>count+unit.completed,0);
 const total=units.reduce((count,unit)=>count+unit.total,0);
 return <section className="cf-a1" aria-labelledby="cf-a1-title">
  <div className="cf-a1__heading">
   <div><span className="cf-a1__level">A1 · Guided course</span>
    <h1 id="cf-a1-title">Learn Japanese</h1></div>
   {status==="ready"?<span className="cf-a1__count">{done} / {total} lessons</span>:null}
  </div>
  {status==="loading"?<p role="status">Loading course progress…</p>:null}
  {status==="error"?<p role="alert">Course progress could not be read. Your saved study records were not changed. Reopen Learn to retry.</p>:null}
  {status==="ready"?<>
   {next?<div className="cf-a1__next">
    <span className="cf-a1__label">Next lesson</span>
    <strong>{next.title}</strong>
    <button type="button" className="cf-a1__continue" disabled={busy} onClick={()=>onStart(next.id)}>
     {busy?"Opening…":next.done?"Resume lesson":"Continue lesson"} <span aria-hidden="true">→</span>
    </button>
    <span className="cf-a1__count">{next.done} of {next.required} controlled checks completed</span>
   </div>:<p role="status">Both available A1 units are complete. Further units are not published yet. You can revisit completed lessons below.</p>}
   <div className="cf-a1__units">
    {units.map((unit,index)=><details key={unit.id} open={index===0&&Boolean(nextId&&unit.lessons.some(l=>l.id===nextId))}>
      <summary><strong>Unit {index+1}: {unit.title}</strong><span>{unit.completed}/{unit.total}</span></summary>
      <ol>{unit.lessons.map(lesson=><li key={lesson.id} className={lesson.id===nextId?"cf-a1__active":""}>
       <button type="button" disabled={!lesson.unlocked||busy} onClick={()=>onStart(lesson.id)}
        aria-current={lesson.id===nextId?"step":undefined}>
        <span>{lesson.title}</span>
        <span className="cf-a1__state">{lesson.completed?"Completed":lesson.unlocked?lesson.done+"/"+lesson.required:"Locked"}</span>
       </button>
      </li>)}</ol>
     </details>)}
   </div>
  </>:null}
 </section>;
}
