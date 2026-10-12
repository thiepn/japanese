import {useEffect,useRef,useState} from "react";
import {saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId} from "../study/runtime";
import {normalizeP26} from "../study/pedagogy26";
import {compareP37Drafts} from "../study/revision37";

export function P37ResponseRevision({owner,unitId,scenarioId,role,taskId,original,model,onReviewed}:{
 owner:string;unitId:string;scenarioId:string;role:"guest"|"host";taskId:string;
 original:string;model:string;onReviewed:()=>void;
}){
 const [draft,setDraft]=useState(original);
 const [saved,setSaved]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const ownerRef=useRef(owner);ownerRef.current=owner;
 useEffect(()=>{setDraft(original);setSaved(false);setError("");},[original,taskId,owner]);
 const comparison=compareP37Drafts(original,draft);
 async function save(){
   if(!comparison.changed||saved||busy||ownerRef.current!==getDevelopmentAccountId())return;
   const account=ownerRef.current;
   setBusy(true);setError("");
   try{
     const event:StudyEvent={
       id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
       occurredAt:new Date().toISOString(),activity:"writing",
       primaryTarget:{kind:"production_task",id:"p37:revision:"+scenarioId},
       skillDimension:"production",promptFamily:"p37-after-model-revision",
       responseMode:"typed",result:"skipped",attempts:1,
       contextId:"p33:role:"+scenarioId,sourceId:"thiepn-original",contentVersion:"p37-1",
       metadata:{p37:true,kind:"post-model-revision",unitId,scenarioId,role,taskId,
         assisted:true,schedulerExcluded:true,rawTextStored:false,
         beforeLength:comparison.beforeLength,afterLength:comparison.afterLength}
     };
     await saveStudyEvent(event);
     if(ownerRef.current!==account)return;
     setSaved(true);onReviewed();
   }catch{if(ownerRef.current===account)setError("Überarbeitung konnte nicht gespeichert werden.");}
   finally{if(ownerRef.current===account)setBusy(false);}
 }
 return <details className="p33-role__revision-workspace">
   <summary>Eigene Antwort nach dem Beispiel überarbeiten · unbewertet</summary>
   <p><strong>Deine erste Antwort:</strong> <span lang="ja">{original}</span></p>
   <p><strong>Ein mögliches Muster:</strong> <span lang="ja">{model}</span></p>
   <label htmlFor={"p37-rewrite-"+taskId}>Deine neue Formulierung</label>
   <textarea id={"p37-rewrite-"+taskId} lang="ja" rows={2} value={draft}
     disabled={busy||saved} onChange={e=>setDraft(e.target.value)}
     aria-keyshortcuts="Control+Enter Meta+Enter"
     onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
       e.preventDefault();void save();
     }}}/>
   {comparison.changed?<div>
     <p><strong>Veränderung:</strong> <span lang="ja">{original}</span> → <span lang="ja">{draft}</span></p>
     {comparison.addedMarkers.length?<p>Neue sichtbare Muster: {comparison.addedMarkers.join(" · ")}</p>:null}
     {comparison.removedMarkers.length?<p>Nicht mehr sichtbare Muster: {comparison.removedMarkers.join(" · ")}</p>:null}
     <ul>{comparison.suggestedChecks.map((note,i)=><li key={i}>{note}</li>)}</ul>
   </div>:<p>Ändere die Antwort, um die erste und die neue Fassung zu vergleichen.</p>}
   <button type="button" disabled={busy||saved||!comparison.changed||!draft.trim()}
     onClick={()=>void save()}>Überarbeitung unbewertet festhalten</button>
   {saved?<p role="status">Überarbeitung protokolliert – ausschließlich Metadaten, keine japanischen Texte oder FSRS-Bewertung.</p>:null}
   {error?<p role="alert">{error}</p>:null}
 </details>;
}
