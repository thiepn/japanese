import type {P60HistoricalReviewSource} from "./consolidation60";

/** P40–P59 existing first-party material only; one view of canonical evidence.
 * No planner, progress ledger, generated grade, synthetic due date, or new store.
 */
export type R3Skill="source"|"conversation"|"writing"|"review";
export interface R3Continuation {
 skill:R3Skill;title:string;aim:string;promptId?:string;unitId?:string;
 phase?:number;status?:"due"|"needs-repair"|"unseen"|"previously-practiced";
 explanation:string;
}
const categories:Readonly<Record<Exclude<R3Skill,"review">,{
 title:string;aim:string;phases:readonly number[]
}>>={
 source:{title:"1 · Quellen verstehen",
  aim:"Verbinde japanische Aussagen, Sprecher und nachweisbare Bedingungen.",
  phases:[46,47,49,54,55,58,59]},
 conversation:{title:"2 · Angemessen reagieren",
  aim:"Reagiere auf einen Gesprächspartner und korrigiere neue Informationen.",
  phases:[40,41,42,43,44,45,56]},
 writing:{title:"3 · Praktische Mitteilung",
  aim:"Bereite eine eigene Nachricht vor; die Originalübung liefert begrenztes Quellenfeedback.",
  phases:[48,50,51,52,53,57]}
};
const score:Readonly<Record<P60HistoricalReviewSource["status"],number>>={
 due:0,"needs-repair":1,unseen:2,"previously-practiced":3
};
/** Preserve actual original prompt and valid course-unit IDs; never fabricate a link. */
export function r3Continuation(
 historical:readonly P60HistoricalReviewSource[],unitId:string
):R3Continuation[]{
 const valid=historical.filter(p=>p.unitIds.includes(unitId));
 const sorted=valid.slice().sort((a,b)=>score[a.status]-score[b.status]||
  a.phase-b.phase||a.id.localeCompare(b.id));
 const result:(R3Continuation)[]=[];
 for(const skill of ["source","conversation","writing"] as const){
  const meta=categories[skill];
  const item=sorted.find(p=>meta.phases.includes(p.phase));
  result.push({skill,title:meta.title,aim:meta.aim,
   promptId:item?.id,unitId:item?.unitIds.includes(unitId)?unitId:undefined,
   phase:item?.phase,status:item?.status,
   explanation:item?.status==="due"?
    "Diese Originalkarte ist nach der tatsächlich vorhandenen FSRS-Spur fällig.":
    item?.status==="needs-repair"?
    "Zuletzt falsch beantwortet; das bedeutet ausdrücklich nicht automatisch FSRS-fällig.":
    item?.status==="unseen"?
    "Für diese originale Frage ist noch kein unabhängig bewerteter Versuch vorhanden.":
    item?"Bereits bearbeitet. Eine weitere Wiederholung wird nur von FSRS terminiert.":
    "In dieser Einheit ist für diesen Bereich keine eigenständige historische Originalfrage zugeordnet."});
 }
 // The only recommended review is an actually due, existing owner-scoped trace.
 const due=sorted.find(p=>p.status==="due");
 result.push({skill:"review",title:"4 · Echte Wiederholung",
  aim:"Wiederhole nur Originalkarten mit tatsächlich erreichten FSRS-Terminen.",
  promptId:due?.id,unitId:due?unitId:undefined,phase:due?.phase,status:due?.status,
  explanation:due?
   "FSRS-fällige Originalkarte vorhanden; öffne den nativen due-only Reviewweg der Originaleinheit.":
   "Keine fällige historische Karte in dieser Einheit. Es wird keine künstliche Fälligkeit erzeugt."});
 return result;
}
/** One explicit focus at a time, with no inferred mastery or hidden credential. */
export function r3RecommendedAction(
 suggestions:readonly R3Continuation[]
):R3Continuation|undefined{
 return suggestions.find(s=>s.skill==="review"&&s.promptId) ??
  suggestions.find(s=>s.status==="needs-repair"&&s.promptId) ??
  suggestions.find(s=>s.status==="unseen"&&s.promptId) ??
  suggestions.find(s=>Boolean(s.promptId));
}
