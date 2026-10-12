import {useEffect,useState} from "react";
import {listStudyEvents} from "@thiepn/local-db";
import {getDevelopmentAccountId} from "../study/runtime";
import {navigateA1} from "../communication/a1-navigation";
import {subscribeA1Progress} from "../communication/a1-events";
import {A1_CONTRACT_VERSION,A1_MODULES,A1_LESSONS,reconcileA1Evidence,type A1CrosswalkReport} from "./a1-course-contract";
import {a1CommunicationExerciseCrosswalk,a1PrimaryTargetCrosswalk,a1SourceInventory,auditA1SourceLinks} from "./a1-source-audit";
import "./a1-course-path.css";

type Props={onStartUnit:(unitId:string)=>void;disabled:boolean};
const sourceIssues=auditA1SourceLinks();
const inventory=a1SourceInventory();
const exerciseMap=a1CommunicationExerciseCrosswalk();
const targetMap=a1PrimaryTargetCrosswalk();

export function A1CoursePath({onStartUnit,disabled}:Props){
 const owner=getDevelopmentAccountId();
 const [report,setReport]=useState<A1CrosswalkReport|null>(null);
 const [error,setError]=useState("");
 const [revision,setRevision]=useState(0);
 useEffect(()=>subscribeA1Progress(()=>setRevision(n=>n+1)),[]);
 useEffect(()=>{
  let active=true;setReport(null);setError("");
  void listStudyEvents(owner).then(events=>{
   if(active)setReport(reconcileA1Evidence(events,owner,exerciseMap,targetMap));
  }).catch(()=>{if(active)setError("Bisherige Lernbelege konnten nicht geladen werden. Es wurde nichts verändert.");});
  return()=>{active=false;};
 },[owner,revision]);
 return <section className="a1-course-path" id="a1-course-path" aria-labelledby="a1-course-path-title">
  <header>
   <p className="j4-kicker">A1 · ORIGINAL CURRICULUM</p>
   <h2 id="a1-course-path-title">Dein A1-Japanischkurs</h2>
   <p>24 geplante Lektionen in 6 Modulen. Vorhandenes Material ist direkt verlinkt; fehlende Lektionen bleiben ausdrücklich als noch nicht ausgearbeitet gekennzeichnet.</p>
   <p><small>Version {A1_CONTRACT_VERSION} · {inventory.sourceUnits} bestehende A1-Kerneinheiten · {inventory.communicationLessons} Kommunikationslektionen · {inventory.referencedVocabulary} unterschiedliche Wörter im bestehenden A1-Kern</small></p>
  </header>
  {sourceIssues.length>0?<div role="alert"><strong>Zuordnungen müssen geprüft werden.</strong><p>{sourceIssues.slice(0,4).join(" · ")}</p></div>:null}
  {error?<p role="alert">{error}</p>:null}
  {report?<p className="a1-course-path__evidence" role="status">Bestehende Lernbelege: {report.aligned} eindeutig zuordenbar, {report.ambiguous} mehrdeutig, {report.unmapped} ohne Zuordnung. Die Originalereignisse bleiben unverändert; Zuordnung bedeutet <strong>keine bestandene Lektion</strong>.</p>:null}
  <div className="a1-course-path__modules">
  {A1_MODULES.map((module,index)=>{
   const lessons=A1_LESSONS.filter(l=>l.moduleId===module.id);
   const mapped=lessons.filter(l=>l.legacyUnitIds.length+l.communicationLessonIds.length+l.roleplayIds.length>0).length;
   return <details key={module.id} defaultOpen={index===0} className="a1-course-path__module">
    <summary><span>Modul {module.order}: {module.title}</span><small>{mapped}/{lessons.length} mit verlinktem Altmaterial</small></summary>
    <p>{module.description}</p>
    <ol className="a1-course-path__list" start={(module.order-1)*4+1}>
    {lessons.map(lesson=>{
     const hasMaterial=lesson.legacyUnitIds.length+lesson.communicationLessonIds.length+lesson.roleplayIds.length>0;
     const matched=report?.rows.filter(r=>r.status==="aligned"&&r.candidateLessonIds.includes(lesson.id)).length??0;
     return <li key={lesson.id}>
      <article>
       <div className="a1-course-path__heading"><h3>{lesson.title}</h3><span>{hasMaterial?"Vorhandene Teilinhalte":"Noch zu entwickeln"}</span></div>
       <p>{lesson.canDo}</p>
       {matched>0?<p className="a1-course-path__provenance">{matched} historische Lernereignisse zugeordnet, ohne neue Meisterschaft</p>:null}
       {hasMaterial?<div className="a1-course-path__actions">
        {lesson.legacyUnitIds.map(unitId=><button key={unitId} type="button" disabled={disabled||sourceIssues.length>0} onClick={()=>onStartUnit(unitId)}>Kerneinheit {unitId.slice(-2)} üben</button>)}
        {lesson.communicationLessonIds.map(communicationId=><button key={communicationId} type="button" onClick={()=>navigateA1({destination:"lesson",lessonId:communicationId})}>Kommunikation: {communicationId.slice(3).replaceAll("-"," ")}</button>)}
        {lesson.roleplayIds.map(roleplayId=><button key={roleplayId} type="button" onClick={()=>navigateA1({destination:"roleplay",scenarioId:roleplayId})}>Dialog: {roleplayId}</button>)}
       </div>:<p className="a1-course-path__pending">Lerninhalt und Übungen werden in der nächsten Inhaltsphase erstellt.</p>}
      </article>
     </li>;
    })}
    </ol>
   </details>;
  })}
  </div>
 </section>;
}
