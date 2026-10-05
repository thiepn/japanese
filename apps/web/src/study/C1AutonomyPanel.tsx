import { useEffect,useState } from "react";
import {
  getC1AutonomyMissionProgress,recordC1MissionReflection,
  type C1AutonomyMissionProgress,type C1AutonomyStageProgress
} from "./c1Autonomy";

export function C1AutonomyPanel({
  onOpenText,onOpenNativeSet,onStartSynthesis,onStartProduction,onOpenCoach
}:{
  onOpenText:(textId:string)=>void;
  onOpenNativeSet:(setId:string)=>void;
  onStartSynthesis:(packId:string)=>void;
  onStartProduction:(taskId:string)=>void;
  onOpenCoach:(chainId:string)=>void;
}){
  const [missions,setMissions]=useState<C1AutonomyMissionProgress[]>([]);
  const [reflections,setReflections]=useState<Record<string,string>>({});
  const [message,setMessage]=useState("");

  async function refresh(){
    setMissions(await getC1AutonomyMissionProgress());
  }
  useEffect(()=>{void refresh().catch(()=>setMissions([]));},[]);

  async function saveReflection(missionId:string){
    setMessage("");
    try{
      await recordC1MissionReflection({missionId,reflection:reflections[missionId]??""});
      setReflections((current)=>({...current,[missionId]:""}));
      setMessage("Mission reflection saved as ungraded C1 autonomy evidence.");
      await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save reflection.");}
  }

  return <section className="autonomy-missions p14-autonomy">
    <div className="section-heading">
      <div><span className="course-kicker">P14 C1 LONG-FORM AUTONOMY</span><h2>Carry one argument across sources, pressure and time</h2></div>
      <span className="course-count">{missions.filter((entry)=>entry.completedStages===entry.totalStages).length} / {missions.length} missions complete</span>
    </div>
    <p className="course-note">Each mission crosses canonical C1 reading, audited native listening, multi-source synthesis, hidden-future interaction, production and a 20+ hour delayed transfer. Progress is derived from normal StudyEvents rather than a new mastery database.</p>

    <div className="mission-grid">{missions.map((entry)=>{
      const next=entry.nextStage;
      return <article className="mission-card" key={entry.mission.id}>
        <div className="mission-card-head"><span>{entry.mission.domain} · ~{entry.mission.estimatedMinutes} min</span><strong>{entry.completedStages}/{entry.totalStages}</strong></div>
        <h3>{entry.mission.title}</h3>
        <p>{entry.mission.description}</p>
        <div className="mission-stage-list">{entry.stages.map((stage)=><span className={stage.complete?"done":next?.id===stage.id?"active":""} key={stage.id}>{stage.complete?"✓":"○"} {stage.title}{stage.detail?" · "+stage.detail:""}</span>)}</div>
        <small>{entry.activeDays} active day{entry.activeDays===1?"":"s"} · delayed transfer requires 20+ hours and a second successful day</small>
        {next?.kind==="reflection"?<div className="p14-reflection">
          <p>{next.instruction}</p>
          <textarea rows={4} value={reflections[entry.mission.id]??""} onChange={(event)=>setReflections((current)=>({...current,[entry.mission.id]:event.target.value}))} placeholder="日本語で、考え方がどう変わったかを振り返る…"/>
          <button className="unit-action" type="button" disabled={(reflections[entry.mission.id]??"").trim().length<80} onClick={()=>void saveReflection(entry.mission.id)}>Save mission reflection</button>
        </div>:next?<StageAction stage={next} onOpenText={onOpenText} onOpenNativeSet={onOpenNativeSet} onStartSynthesis={onStartSynthesis} onStartProduction={onStartProduction} onOpenCoach={onOpenCoach}/>:<span className="mission-complete">All mission evidence collected</span>}
      </article>;
    })}</div>

    {message?<p role="status" className="import-message">{message}</p>:null}
    <p className="course-note">A completed P14 mission means the configured internal evidence chain was completed. It is not a CEFR C1 certificate and does not replace external human evaluation.</p>
  </section>;
}

function StageAction({
  stage,onOpenText,onOpenNativeSet,onStartSynthesis,onStartProduction,onOpenCoach
}:{
  stage:C1AutonomyStageProgress;
  onOpenText:(textId:string)=>void;
  onOpenNativeSet:(setId:string)=>void;
  onStartSynthesis:(packId:string)=>void;
  onStartProduction:(taskId:string)=>void;
  onOpenCoach:(chainId:string)=>void;
}){
  const label="Next: "+stage.title;
  if(stage.kind==="reading"&&stage.textId)return <button className="unit-action" type="button" onClick={()=>onOpenText(stage.textId!)}>{label}</button>;
  if(stage.kind==="native_synthesis"&&stage.nativeSetId)return <button className="unit-action" type="button" onClick={()=>onOpenNativeSet(stage.nativeSetId!)}>{label}</button>;
  if(stage.kind==="multi_source_synthesis"&&stage.synthesisPackId)return <button className="unit-action" type="button" onClick={()=>onStartSynthesis(stage.synthesisPackId!)}>{label}</button>;
  if(stage.kind==="spontaneous_interaction"&&stage.scenarioChainId)return <button className="unit-action" type="button" onClick={()=>onOpenCoach(stage.scenarioChainId!)}>{label}</button>;
  if((stage.kind==="production"||stage.kind==="delayed_transfer")&&stage.taskId)return <button className="unit-action" type="button" onClick={()=>onStartProduction(stage.taskId!)}>{label}</button>;
  return <span className="course-note">{stage.instruction}</span>;
}
