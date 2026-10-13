import {useState} from "react";
import type {P44Case,P44PracticeStep} from "../study/pragmatics44";
import {p44AuthoredFeedback} from "../study/pragmatics44";

/** Unscored teaching view inside Learn. No persistence, grade or FSRS authority. */
export function P44PragmaticsStudy({cases,preferredId,disabled,onPractice,onWriting}:{
 cases:readonly P44Case[];preferredId?:string;disabled:boolean;
 onPractice:(caseId:string,step?:P44PracticeStep)=>void;
 onWriting:(caseId:string,step:"production"|"reply")=>void;
}){
 const [caseId,setCaseId]=useState("");
 const [phase,setPhase]=useState<"first"|"followup"|"complete">("first");
 const [choice,setChoice]=useState("");
 const [firstAnswer,setFirstAnswer]=useState("");
 const active=cases.find(c=>c.id===caseId)??cases.find(c=>c.id===preferredId)??cases[0];
 if(!active)return null;
 const isFirst=phase==="first";
 const options=isFirst?[active.misleading,active.model,active.alternative]:
  [active.followupMisstep,active.followupModel,active.followupAlternative];
 const feedback=choice?p44AuthoredFeedback(choice,
   isFirst?[active.model,active.alternative]:[active.followupModel,active.followupAlternative],
   isFirst?active.misleading:active.followupMisstep,
   isFirst?active.misconception:active.followupWhy):null;
 const reset=(id?:string)=>{
  if(id)setCaseId(id);setPhase("first");setChoice("");setFirstAnswer("");
 };
 const advance=()=>{
  if(feedback?.kind!=="matched")return;
  if(isFirst){setFirstAnswer(choice);setChoice("");setPhase("followup");}
  else {setChoice("");setPhase("complete");}
 };
 return <section className="p27-journey__p44" aria-label="Japanische soziale Gesprächsabsichten">
  <h4>Wie klingt die Antwort in dieser Beziehung?</h4>
  <p>Unterschiede zwischen Bitte, Einladung, Absage, Rücksicht und Korrektur
    hängen von Beziehung und Kontext ab. Diese Auswahlbeispiele sind
    <strong> unbewerteter Unterricht</strong>, keine Analyse freier Sprache.</p>
  <div className="p27-journey__p44-picker" role="group" aria-label="Gesprächskontrast wählen">
   {cases.map(item=><button key={item.id} type="button" aria-pressed={item.id===active.id}
     onClick={()=>reset(item.id)}>
     {item.title}{item.id===preferredId?" · Zuletzt schwer":""}
   </button>)}
  </div>
  <p><strong>{active.level} · {active.focus}</strong> ·
    {active.register==="polite"?" höflicher Kontakt":" vertrauter Kontakt"}</p>
  <p><strong>Beziehung:</strong> {active.relationship}</p>
  <p><strong>Ausgangslage:</strong> {active.context}</p>
  {phase==="complete"?<div className="p27-journey__p44-result" role="status">
    <strong>Beide Originalbeispiele zu dieser Gesprächsabsicht betrachtet</strong>
    <p>Die Partnerreaktion folgte auf: <span lang="ja">{firstAnswer}</span></p>
    <p>{active.nuance}</p>
    <p>Ein freier unabhängiger Abruf wird im vorhandenen StudyPlayer bewertet.
      Nur dort entstehen StudyEvents und FSRS-Termine.</p>
    <div className="p27-journey__actions">
     <button type="button" onClick={()=>reset()}>Andere Formulierung vergleichen</button>
     <button type="button" disabled={disabled} onClick={()=>onPractice(active.id)}>
      Alle drei Aufgaben unabhängig üben
     </button>
     <button type="button" disabled={disabled} onClick={()=>onPractice(active.id,"return")}>
      Neue Situation ohne Vorlage abrufen
     </button>
    </div>
  </div>:<div className="p27-journey__p44-exchange">
    <strong>{isFirst?"Passende erste Reaktion":"Auf neue Partneraussage reagieren"}</strong>
    {isFirst?<><p><strong>Gegenüber:</strong> <span lang="ja">{active.partner}</span></p>
      <p>{active.intention}</p></>:<>
      <p><strong>Deine vorige Antwort:</strong> <span lang="ja">{firstAnswer}</span></p>
      <p><strong>Partner antwortet:</strong> <span lang="ja">{active.partnerFollowup}</span></p>
      <p>{active.followupTask}</p>
    </>}
    <div className="p27-journey__p44-options" role="group" aria-label="Japanische Formulierung wählen">
     {options.map(option=><button key={option} type="button" lang="ja"
       aria-pressed={choice===option} onClick={()=>setChoice(option)}>{option}</button>)}
    </div>
    {feedback?<div className="p27-journey__p44-feedback" role="status">
      <strong>{feedback.kind==="matched"?"Im angegebenen Kontext passend":
        feedback.kind==="misconception"?"Kontextproblem erkannt":"Noch nicht beurteilt"}</strong>
      <p>{feedback.message}</p>
      {isFirst?<p>{active.nuance}</p>:null}
      <small>Auch andere gültige japanische Sätze sind möglich; diese Auswahl bewertet nur
        die drei ausdrücklich verfassten Beispiele.</small>
    </div>:null}
    <div className="p27-journey__actions">
      <button type="button" disabled={feedback?.kind!=="matched"} onClick={advance}>
       {isFirst?"Antwort des Gegenübers aufnehmen":"Gesprächsbeispiel abschließen"}
      </button>
      <button type="button" disabled={disabled}
        onClick={()=>onPractice(active.id,isFirst?"production":"reply")}>
        Diese Antwort selbst im StudyPlayer formulieren
      </button>
      <button type="button" onClick={()=>onWriting(active.id,isFirst?"production":"reply")}>
        Diese Gesprächsabsicht schriftlich überarbeiten
      </button>
    </div>
   </div>}
  <small>Die Auswahl und das bisherige Beispiel leben nur in dieser React-Ansicht.
    Kein Rohtext, simuliertes Sprachverständnis, Lernfortschritt oder synthetischer
    Wiederholungstermin entsteht durch diesen geführten Vergleich.</small>
 </section>;
}
