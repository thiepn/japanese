import type {E07Action,E07Journey} from "../study/e07LearningRoute";
type Props={route:E07Journey;onActivate:(action:E07Action)=>void;busy:boolean;variant:"today"|"learn"|"immerse"|"progress"};
const title:Record<Props["variant"],string>={
 today:"Your next useful Japanese step",
 learn:"Continue one coherent learning path",
 immerse:"Listen, read, then respond",
 progress:"Use evidence to choose your next step"
};
/**
 * One source-owned, accessible route control reused by the existing surfaces.
 * The surrounding original course catalogues remain available by disclosure.
 */
export function E07JourneyPanel({route,onActivate,busy,variant}:Props){
 const primary=route.primary;
 return <section className={"e07-journey e07-journey--"+variant} aria-labelledby={"e07-journey-"+variant}>
   <header className="e07-journey__header">
     <div><p className="e07-journey__eyebrow">E07 · CONTINUE FROM YOUR ACTUAL EVIDENCE</p>
       <h2 id={"e07-journey-"+variant}>{title[variant]}</h2>
       <p>{primary.description}</p></div>
     <span className="e07-journey__basis">{primary.kind.replaceAll("-"," ")} · {primary.origin.toUpperCase()}</span>
   </header>
   <div className="e07-journey__primary">
     <div><strong>{primary.label}</strong><small>{primary.basis}</small></div>
     <button type="button" disabled={busy} onClick={()=>onActivate(primary)}>Open this step <span aria-hidden="true">→</span></button>
   </div>
   <div className="e07-journey__summary" aria-label="Source-based learning status">
     <span>{route.delayedReady} delayed checks ready</span>
     <span>{route.correctionsPending} corrections pending</span>
     <span>{route.sourceA1} original A1 units</span>
     <span>{route.sourceA2} provisionally linked A2 units</span>
   </div>
   {route.alternatives.length>0?<details className="e07-journey__other">
     <summary>Choose a different source-backed activity ({route.alternatives.length})</summary>
     <ul>{route.alternatives.map(item=><li key={item.key}>
       <div><strong>{item.label}</strong><small>{item.basis}</small></div>
       <button type="button" disabled={busy} onClick={()=>onActivate(item)}>Open</button>
     </li>)}</ul>
   </details>:null}
   <p className="e07-journey__note">{route.explanation} {route.unlinkedOriginal>0?
    route.unlinkedOriginal+" original A2/cumulative situations currently remain ungraded because canonical linkage has not been established.":""}</p>
 </section>;
}
