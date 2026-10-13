import {useState} from "react";
import type {P43Scene,P43RouteKey} from "../study/dialogue43";
import {p43Feedback} from "../study/dialogue43";

/** Guided, ephemeral classroom presentation of author-defined branches.
 * No StudyEvent, score, FSRS card or semantic grading is produced here. */
export function P43BranchConversation({scenes,disabled,preferredId,onIndependent,onWriting}:{
 scenes:readonly P43Scene[];disabled:boolean;preferredId?:string;
 onIndependent:(id:string,route?:P43RouteKey)=>void;
 onWriting:(id:string,route:P43RouteKey)=>void;
}){
 const [sceneId,setSceneId]=useState("");
 const [phase,setPhase]=useState<"opening"|P43RouteKey|"result">("opening");
 const [selected,setSelected]=useState("");
 const [chosenRoute,setChosenRoute]=useState<P43RouteKey|null>(null);
 const [result,setResult]=useState<{text:string;success:boolean;note:string}|null>(null);
 const [history,setHistory]=useState<Array<{id:string;partner:string;response:string;effect:string}>>([]);
 const scene=scenes.find(c=>c.id===sceneId)??scenes.find(c=>c.id===preferredId)??scenes[0];
 if(!scene)return null;
 const route=phase!=="opening"&&phase!=="result"?scene.routes[phase]:null;
 const startingChoices=[
  {key:"direct" as const,value:scene.opening.direct},
  {key:"alternate" as const,value:scene.opening.alternate},
  {key:"mistake" as const,value:scene.opening.mistake}
 ];
 const selectedOpening=startingChoices.find(x=>x.key===selected);
 const onReset=(id?:string)=>{
  if(id)setSceneId(id);setPhase("opening");setSelected("");
  setHistory([]);setResult(null);setChosenRoute(null);
 };
 const onAdvance=()=>{
  if(!selected)return;
  if(phase==="opening"){
   const chosen=startingChoices.find(x=>x.key===selected);
   if(!chosen)return;
   setHistory([{id:"opening",partner:scene.opening.partner,
     response:chosen.value.form,effect:chosen.value.consequence}]);
   const next:P43RouteKey=chosen.key==="mistake"?"repair":chosen.key;
   setChosenRoute(next);setPhase(next);setSelected("");setResult(null);
   return;
  }
  if(!route||!chosenRoute)return;
  const judgement=p43Feedback(selected,[route.model,route.alternative],route.misstep,route.why);
  setHistory(prev=>[...prev,{id:phase,partner:route.partner,response:selected,
    effect:judgement.kind==="misconception"?route.why:route.outcome}]);
  setResult({text:judgement.kind==="misconception"?
    "Die Verständigung ist noch nicht gelungen. Überarbeite die missverständliche Antwort.":
    route.outcome,success:judgement.kind!=="misconception",note:judgement.message});
  setPhase("result");setSelected("");
 };
 const activeFeedback=route&&selected?
  p43Feedback(selected,[route.model,route.alternative],route.misstep,route.why):null;
 return <section className="p27-journey__p43" aria-label="Verzweigende japanische Gespräche">
  <h4>Eine Entscheidung verändert die nächste Antwort</h4>
  <p>In diesen <strong>geführten, unbewerteten</strong> Dialogen führen zwei sinnvolle
    Entscheidungen zu verschiedenen Aussagen des Gegenübers. Ein Missverständnis
    braucht eine neue, passende Antwort. Eine freie japanische Antwort wird dadurch
    nicht automatisch bewertet.</p>
  <div className="p27-journey__p43-picker" role="group" aria-label="Verzweigendes Gespräch auswählen">
   {scenes.map(item=><button key={item.id} type="button" aria-pressed={scene.id===item.id}
     onClick={()=>onReset(item.id)}>{item.title}{preferredId===item.id?" · Letzter Fehler":""}</button>)}
  </div>
  <p><strong>{scene.level} · {scene.register==="polite"?"Höfliche Situation":"Vertrautes Gespräch"}</strong></p>
  <p>{scene.setting}</p><p><strong>Gesprächsziel:</strong> {scene.goal}</p>
  {history.length>0?<ol className="p27-journey__p43-history">
   {history.map(h=><li key={h.id}>
    <p lang="ja">{h.partner}</p><p><strong>Antwort:</strong> <span lang="ja">{h.response}</span></p>
    <small>{h.effect}</small>
   </li>)}
  </ol>:null}
  {phase!=="result"?<article className="p27-journey__p43-node">
    {phase==="opening"?<>
      <strong>Erste Entscheidung</strong>
      <p><strong>Gesprächspartner:</strong> <span lang="ja">{scene.opening.partner}</span></p>
      <p>{scene.opening.intention}</p>
      <div className="p27-journey__p43-choices" role="group" aria-label="Entscheidung">
       {startingChoices.map(({key,value})=><button key={key} type="button"
         aria-pressed={selected===key} onClick={()=>setSelected(key)}>
         <span lang="ja">{value.form}</span></button>)}
      </div>
      {selectedOpening?<div className="p27-journey__p43-consequence" role="status">
        <p><strong>Folge:</strong> {selectedOpening.value.consequence}</p>
        {selected==="mistake"?<p>{scene.opening.misconception}</p>:null}
      </div>:null}
    </>:route?<>
      <strong>{phase==="repair"?"Missverständnis klären":
        phase==="alternate"?"Alternativer Gesprächsverlauf":"Direkter Gesprächsverlauf"}</strong>
      <p><strong>Neue Partneräußerung:</strong> <span lang="ja">{route.partner}</span></p>
      <p><strong>Deine Aufgabe:</strong> {route.intention}</p>
      <div className="p27-journey__p43-choices" role="group" aria-label="Fortsetzung wählen">
       {[route.misstep,route.model,route.alternative].map(form=><button key={form}
         type="button" aria-pressed={selected===form} onClick={()=>setSelected(form)}>
         <span lang="ja">{form}</span></button>)}
      </div>
      {activeFeedback?<div className="p27-journey__p43-consequence" role="status">
       <p>{activeFeedback.message}</p>
       {activeFeedback.kind==="authored"?<p><strong>Mögliche Folge:</strong> {route.outcome}</p>:null}
      </div>:null}
    </>:null}
    <div className="p27-journey__actions">
      <button type="button" disabled={!selected} onClick={onAdvance}>
       {phase==="opening"?"Folgeantwort des Gegenübers anzeigen":"Verlauf abschließen"}
      </button>
      <button type="button" disabled={disabled} onClick={()=>
        phase==="opening"?onIndependent(scene.id):onIndependent(scene.id,phase as P43RouteKey)}>
        Diese Entscheidung im StudyPlayer selbstständig bearbeiten
      </button>
      {route?<button type="button" onClick={()=>onWriting(scene.id,phase as P43RouteKey)}>
        Diese Antwort schriftlich überarbeiten
      </button>:null}
    </div>
   </article>:<div className="p27-journey__p43-result" role="status">
    <strong>{result?.success?"Ausgang dieses Gesprächszweigs":"Missverständnis bleibt bestehen"}</strong>
    <p>{result?.text}</p><p>{result?.note}</p>
    <div className="p27-journey__actions">
      <button type="button" onClick={()=>onReset()}>Anderen Ausgang ausprobieren</button>
      {chosenRoute?<button type="button" disabled={disabled}
        onClick={()=>onIndependent(scene.id,chosenRoute)}>
        Diese Fortsetzung unabhängig schreiben
      </button>:null}
      <button type="button" onClick={()=>onWriting(scene.id,chosenRoute??"repair")}>
        Antwort im Schreibschritt überarbeiten
      </button>
    </div>
  </div>}
  <small>Nur ausgewählte Beispielzweige werden lokal im Ansichtsstatus gehalten.
    Es werden hier keine benoteten Versuche oder Rohantworten gespeichert;
    unabhängige FSRS-Abrufe finden ausschließlich im vorhandenen StudyPlayer statt.</small>
 </section>;
}
