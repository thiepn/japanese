import {useState} from "react";
import type {P45Challenge,P45Scaffold} from "../study/independence45";
import {p45Feedback} from "../study/independence45";

/** Local, unscheduled lesson support. The source-owning StudyPlayer grades
 * separate independent typed cues; this component never saves learner text. */
export function P45IndependentConversation({challenges,preferredId,disabled,onPractice,onWriting}:{
 challenges:readonly P45Challenge[];preferredId?:string;disabled:boolean;
 onPractice:(id:string)=>void;
 onWriting:(id:string,turnIndex:number)=>void;
}){
 const [id,setId]=useState("");
 const [support,setSupport]=useState<P45Scaffold>("supported");
 const [index,setIndex]=useState(0);
 const [draft,setDraft]=useState("");
 const [checked,setChecked]=useState(false);
 const [showModel,setShowModel]=useState(false);
 const [showIntent,setShowIntent]=useState(false);
 const [answers,setAnswers]=useState<Array<{turnId:string;partner:string;response:string;result:string}>>([]);
 const challenge=challenges.find(c=>c.id===id)??
   challenges.find(c=>c.id===preferredId)??challenges[0];
 if(!challenge)return null;
 const turn=challenge.turns[index];
 const finished=index>=challenge.turns.length;
 const current=finished?null:turn;
 const feedback=current&&checked?p45Feedback(draft,current):null;
 const supportLevel=support==="unguided"?2:
   support==="reduced"?Math.min(2,index+1):Math.min(2,index);
 const reset=(nextId?:string)=>{
   if(nextId)setId(nextId);
   setIndex(0);setDraft("");setChecked(false);setShowModel(false);
   setShowIntent(false);setAnswers([]);
 };
 const advance=()=>{
   if(!current||!checked)return;
   const result=p45Feedback(draft,current);
   setAnswers(prev=>[...prev,{
     turnId:current.id,partner:current.partner,response:draft,
     result:result.kind==="misconception"?"Verständnisfehler erkannt":
       result.kind==="known"?"Mit Originalbeispiel abgeglichen":"Nicht semantisch bewertet"
   }]);
   setIndex(i=>i+1);setDraft("");setChecked(false);setShowModel(false);setShowIntent(false);
 };
 return <section className="p27-journey__p45" aria-label="Selbstständig japanische Gespräche führen">
   <h4>Gespräch ohne vorgegebene Antworten</h4>
   <p>Vier zusammenhängende Gesprächsschritte mit einer echten Änderung des Plans.
     Beginne mit Unterstützung oder übe direkt ohne Hinweise. Die Hilfen nehmen
     innerhalb der Folge automatisch ab; deine Antworten werden nicht gespeichert.</p>
   <div className="p27-journey__p45-picker" role="group" aria-label="Gesprächssituation auswählen">
     {challenges.map(c=><button type="button" key={c.id}
       aria-pressed={challenge.id===c.id} onClick={()=>reset(c.id)}>
       {c.title}{c.id===preferredId?" · Wiederholungsfokus":""}
     </button>)}
   </div>
   <div className="p27-journey__p45-support" role="group" aria-label="Anzahl der Lernhinweise">
     {(["supported","reduced","unguided"] as const).map(option=><button
       key={option} type="button" aria-pressed={support===option}
       onClick={()=>{setSupport(option);reset()}}>
       {option==="supported"?"Mit abnehmender Hilfe":option==="reduced"?"Wenig Hilfe":"Ohne Hilfe"}
     </button>)}
   </div>
   <p><strong>{challenge.level} · {challenge.title}</strong></p>
   <p>{challenge.setting}</p>
   <p><strong>Gegenüber:</strong> {challenge.relationship}</p>
   {supportLevel===0&&!finished?<p><strong>Gesamtziel:</strong> {challenge.purpose}</p>:null}
   {answers.length?<div className="p27-journey__p45-history">
     <strong>Dein bisheriger Verlauf — ohne automatisches Sprachurteil</strong>
     <ol>{answers.map(item=><li key={item.turnId}>
       <p lang="ja">{item.partner}</p>
       <p><span lang="ja">{item.response}</span></p>
       <small>{item.result}</small>
     </li>)}</ol>
   </div>:null}
   {!finished&&current?<div className="p27-journey__p45-turn">
     <strong>Schritt {index+1} von {challenge.turns.length}</strong>
     <p><strong>Gesprächspartner:</strong> <span lang="ja">{current.partner}</span></p>
     {supportLevel<2?<p className="p27-journey__p45-hint">
       <strong>Deine Absicht:</strong> {current.goal}
       {supportLevel===0?<small>{current.continuity}</small>:null}
     </p>:<p>Antworte selbstständig im Zusammenhang mit deinen bisherigen Aussagen.</p>}
     {supportLevel>0?<button type="button" onClick={()=>setShowIntent(x=>!x)}
       aria-expanded={showIntent}>
       {showIntent?"Absicht ausblenden":"Bei Bedarf Absicht als Hilfe zeigen"}
     </button>:null}
     {showIntent&&supportLevel>0?<div className="p27-journey__p45-hint">
       <p>{current.goal}</p><small>Hilfe angesehen; keine unabhängige Bewertung.</small>
     </div>:null}
     <label htmlFor="p45-response">Deine japanische Antwort</label>
     <textarea id="p45-response" rows={3} lang="ja" value={draft}
       disabled={checked} onChange={e=>setDraft(e.target.value)}
       placeholder="日本語で答えてください。"/>
     {!checked?<div className="p27-journey__actions">
       <button type="button" disabled={!draft.trim()} onClick={()=>setChecked(true)}>
         Antwort mit verfassten Beispielen vergleichen
       </button>
       <button type="button" disabled={disabled}
         onClick={()=>onPractice(challenge.id)}>
         Alle vier Züge unabhängig im StudyPlayer üben
       </button>
     </div>:<div className="p27-journey__p45-comparison" role="status">
       <strong>{feedback?.kind==="known"?"Passt zu einem Originalbeispiel":
         feedback?.kind==="misconception"?"Bekanntes Missverständnis":
         "Freie Formulierung ohne automatische Bewertung"}</strong>
       <p>{feedback?.message}</p>
       {feedback?.kind==="misconception"?<p>{current.continuity}</p>:null}
       {showModel?<div>
         <strong>Originale Musterantworten (erst nach deinem Versuch)</strong>
         <p lang="ja">{current.model}</p><p lang="ja">{current.alternative}</p>
         <p>{current.why}</p>
       </div>:null}
       <div className="p27-journey__actions">
         <button type="button" onClick={()=>setShowModel(x=>!x)}>
           {showModel?"Muster verbergen":"Originalmuster einblenden"}
         </button>
         <button type="button" onClick={()=>{setChecked(false);setShowModel(false)}}>
           Eigene Antwort überarbeiten
         </button>
         <button type="button" onClick={advance}>
           {index+1===challenge.turns.length?"Gespräch abschließen":"Nächste Partnerantwort"}
         </button>
         <button type="button" onClick={()=>onWriting(challenge.id,index)}>
           Im bisherigen Schreibeditor überarbeiten
         </button>
       </div>
     </div>}
   </div>:<div className="p27-journey__p45-finished" role="status">
     <strong>Vier Gesprächszüge durchgeführt — ohne Lernkredit</strong>
     <p><strong>Beabsichtigter Ausgang:</strong> {challenge.outcome}</p>
     <p>Diese freie Übung erkennt nicht jede richtige japanische Formulierung.
       Nur eine getrennte, eigenständig bewertete StudyPlayer-Antwort kann
       autoritative StudyEvents und FSRS-Termine erzeugen.</p>
     <div className="p27-journey__actions">
       <button type="button" onClick={()=>reset()}>Ohne Hilfen erneut versuchen</button>
       <button type="button" disabled={disabled} onClick={()=>onPractice(challenge.id)}>
         Unabhängige vier Züge öffnen
       </button>
     </div>
   </div>}
   <small>Hinweise, Eingaben, Gesprächsverlauf und Musteranzeige existieren nur im
     lokalen React-Komponentenstatus. Kein Rohtext und keine neuen Noten werden gespeichert.</small>
 </section>;
}
