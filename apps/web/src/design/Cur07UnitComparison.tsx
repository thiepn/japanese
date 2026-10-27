import {useState} from "react";
import {buildCur06VocabularyJourney} from "../study/cur06VocabularyJourney";
import {cur07PracticeKey,inspectCur07History,type Cur07Receipt} from "../study/cur07History";
import {readCoursePosition} from "../study/cur03CoursePosition";
import type {VocabularyCourseLink,CourseReviewWord} from "../study/cur05LevelReview";

export type Cur07Launch=(id:string,mode:"explore"|"practice",unitId?:string,intent?:"resume"|"restart",contrastId?:string)=>void;
export type Cur07Recover=(id:string,sessionKey:string,receipt:Cur07Receipt,first?:string,second?:string)=>void;

function RestoreChoices({owner,wordId,first,second,onRecover}:{owner:string;wordId:string;first?:string;second?:string;onRecover:Cur07Recover}){
 let snapshots:ReturnType<typeof inspectCur07History>=[];
 let key="";
 try{
  key=cur07PracticeKey(wordId,first,second);
  snapshots=inspectCur07History(owner,key,buildCur06VocabularyJourney(wordId,"practice",first,second));
 }catch{return <p className="cur07-recovery-note">Historical practice cannot be checked against verified current content.</p>;}
 if(!snapshots.length)return null;
 return <section aria-label="Historical practice recovery" className="cur07-recovery">
   <h5>Earlier practice sections</h5>
   <p>Only an unchanged original source section can be restored. No answers or grades are recovered here.</p>
   {snapshots.map(item=><div className="cur07-recovery-entry" key={item.receipt.sessionHash+item.receipt.sectionId}>
    <span>{item.receipt.sectionId}</span>
    {item.status==="recoverable"
      ?<button type="button" onClick={()=>onRecover(wordId,key,item.receipt,first,second)}>
       Restore unchanged section</button>
      :<small>Original section changed or disappeared; recovery blocked</small>}
   </div>)}
 </section>;
}
export function Cur07UnitComparison({owner,word,onLaunch,onRecover,busy}:{
 owner:string;word:CourseReviewWord;onLaunch:Cur07Launch;onRecover:Cur07Recover;busy:boolean;
}){
 const [expanded,setExpanded]=useState(false);
 const [first,setFirst]=useState(word.units[0]?.id??"");
 const [second,setSecond]=useState(word.units[1]?.id??"");
 const units=word.units;
 const valid=units.length>1&&first!==second&&units.some(unit=>unit.id===first)&&units.some(unit=>unit.id===second);
 const firstUnit=units.find(unit=>unit.id===first);
 const secondUnit=units.find(unit=>unit.id===second);
 let canResume=false;
 if(valid)try{canResume=readCoursePosition(owner,cur07PracticeKey(word.id,first,second),
   buildCur06VocabularyJourney(word.id,"practice",first,second))>0;}catch{canResume=false;}
 const describe=(unit:VocabularyCourseLink)=>unit.level+" · "+unit.title;
 return <div className="cur07-comparison">
  <RestoreChoices owner={owner} wordId={word.id} onRecover={onRecover}/>
  {units.length>1?<div>
   <button type="button" aria-expanded={expanded} aria-label={"Compare original source units for "+word.writing}
    onClick={()=>setExpanded(x=>!x)}>Compare units</button>
   {expanded?<section className="cur07-comparison-options" aria-label={"Compare unit contexts for "+word.writing}>
    <h4>Choose two original unit contexts</h4>
    <p>Compare two authentic Can-do aims and source-linked examples. No word-level CEFR credit or scheduled review.</p>
    <label>First source unit
     <select aria-label="First source unit" value={first} onChange={event=>{
      const next=event.target.value;setFirst(next);
      if(next===second)setSecond(units.find(unit=>unit.id!==next)?.id??"");
     }}>
      {units.map(unit=><option key={unit.id} value={unit.id}>{describe(unit)}</option>)}
     </select>
    </label>
    <label>Contrasting source unit
     <select aria-label="Contrasting source unit" value={second} onChange={event=>setSecond(event.target.value)}>
      {units.filter(unit=>unit.id!==first).map(unit=><option key={unit.id} value={unit.id}>{describe(unit)}</option>)}
     </select>
    </label>
    {valid?<p className="cur07-pair-summary">{firstUnit?.level} · {firstUnit?.title} versus {secondUnit?.level} · {secondUnit?.title}</p>:null}
    <div className="cur07-pair-actions">
     <button disabled={busy||!valid} type="button" onClick={()=>onLaunch(word.id,"practice",first,"resume",second)}>
      {canResume?"Resume comparison":"Practice comparison"}</button>
     <button disabled={busy||!valid} type="button" onClick={()=>onLaunch(word.id,"practice",first,"restart",second)}>Restart comparison</button>
    </div>
    {valid?<RestoreChoices owner={owner} wordId={word.id} first={first} second={second} onRecover={onRecover}/>:null}
   </section>:null}
  </div>:null}
 </div>;
}
