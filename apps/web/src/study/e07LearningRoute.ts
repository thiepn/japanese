import type {StudySummary,E01Progress,E02Overview,E03Overview,E04Overview,E05Evidence,E06Overview} from "./runtime";

/**
 * E07 computes a recommended next action from the existing, account-owned
 * progress projections. This is NOT a scheduler, new mastery state or a grade.
 */
export type E07Origin="fsrs"|"e01"|"e02"|"e03"|"e04"|"e05"|"e06";
export type E07ActionKind="scheduled"|"delayed"|"repair"|"resume"|"study"|"source"|"reading";
export interface E07Action {
 key:string;origin:E07Origin;kind:E07ActionKind;targetId?:string;
 label:string;description:string;basis:string;priority:number;
}
export interface E07Journey {
 primary:E07Action;alternatives:E07Action[];
 sourceA1:number;sourceA2:number;unlinkedOriginal:number;
 delayedReady:number;correctionsPending:number;
 explanation:string;
}
const action=(origin:E07Origin,kind:E07ActionKind,label:string,description:string,basis:string,priority:number,targetId?:string):E07Action=>({
 key:[origin,kind,targetId??"none"].join(":"),origin,kind,label,description,basis,priority,targetId
});
export function deriveE07Journey({
 summary,e01,e02,e03,e04,e05,e06
}:{summary:StudySummary;e01:E01Progress;e02:E02Overview;e03:E03Overview;e04:E04Overview;e05:E05Evidence;e06:E06Overview}):E07Journey{
 const options:E07Action[]=[];
 const delayedCount=(e01.status==="ready"?1:0)+e02.readyForDelay+e03.readyForDelay+e04.reviewReady+e06.ready;
 if(summary.due>0)options.push(action("fsrs","scheduled","Review due Japanese","Complete native FSRS recall before adding new material.",summary.due+" existing memory prompts due",120));
 const delayed6=e06.cases.find(c=>c.status==="ready");
 if(delayed6)options.push(action("e06","delayed","Retrieve in a new situation","Cumulative listening, reading and Japanese production after the 20-hour spacing window.",delayed6.title+" · source-linked transfer due",116,delayed6.id));
 const delayed4=e04.scenes.find(s=>s.status==="ready");
 if(delayed4)options.push(action("e04","delayed","Transfer an everyday problem","Respond to changed listening and reading material rather than repeating the original dialogue.",delayed4.title+" · delayed transfer due",112,delayed4.id));
 const delayed3=e03.scenes.find(s=>s.state==="ready");
 if(delayed3)options.push(action("e03","delayed","Apply a situation again","Use unseen contextual listening, reading and recall.",delayed3.title+" · delayed transfer due",110,delayed3.id));
 const delayed2=e02.scenes.find(s=>s.state==="ready");
 if(delayed2)options.push(action("e02","delayed","Return to original A1 communication","Work on a delayed, changed-context beginner exchange.",delayed2.title+" · delayed transfer due",108,delayed2.id));
 if(e01.status==="ready")options.push(action("e01","delayed","Recall your first conversation","Return after the waiting window and retrieve the conversation independently.","E01 delayed check ready",106));
 if(e05.repair.pending>0)options.push(action("e05","repair","Repair a specific misunderstanding","Study a contrasting explanation, then answer a different Japanese question. This never awards mastery.",e05.repair.pending+" targeted original cues to correct",100));
 const active6=e06.cases.find(c=>c.status==="learning");
 if(active6)options.push(action("e06","resume","Continue cumulative communication","Reconnect listening, source reading, negotiation and independent response practice.",active6.title+" · previously started",95,active6.id));
 const active4=e04.scenes.find(s=>s.status==="learning");
 if(active4)options.push(action("e04","resume","Continue problem-solving Japanese","Follow the original dialogue into independent writing and pragmatic interaction.",active4.title+" · previously started",90,active4.id));
 const active3=e03.scenes.find(s=>s.state==="learning");
 if(active3)options.push(action("e03","resume","Continue connected dialogue and reading","Revisit the source explanation before independent production.",active3.title+" · previously started",88,active3.id));
 const active2=e02.scenes.find(s=>s.state==="learning");
 if(active2)options.push(action("e02","resume","Continue an everyday A1 exchange","Finish the contextual practice and independent response drafts.",active2.title+" · previously started",86,active2.id));
 if(e01.status!=="reviewed"&&e01.status!=="ready"&&e01.status!=="waiting"){
  options.push(action("e01","study","Build your first Japanese conversation","Meet, understand, discover, respond and return later.","Canonical A1 first-conversation journey",72));
 }
 const ready6=e06.cases.find(c=>c.status==="unstarted"&&c.prerequisiteReady&&c.canDoId!==null);
 if(ready6)options.push(action("e06","study","Bring communication skills together","Source listening and reading/form evidence have unlocked this original cumulative case.",ready6.title+" · source prerequisites completed",80,ready6.id));
 const next2=e02.scenes.find(s=>s.state==="not_started");
 if(next2)options.push(action("e02","study","Learn an original daily A1 situation","Build context before recall through the native Study Player.",next2.title+" · verified A1 Can-do link",70,next2.id));
 const next3=e03.scenes.find(s=>s.state==="not_started");
 if(next3)options.push(action("e03","study","Explore contextual A2 communication","Longer original dialogue, separate reading and scaffolded independent response.",next3.title+" · provisional A2 subdivision",64,next3.id));
 const next4=e04.scenes.find(s=>s.status==="not_started");
 if(next4)options.push(action("e04","study","Solve an A2 everyday problem","Read conditions, negotiate politely and explain a reasoned decision.",next4.title+" · provisional A2 subdivision",62,next4.id));
 const blocked6=e06.cases.find(c=>c.canDoId!==null&&!c.prerequisiteReady);
 if(blocked6)options.push(action(blocked6.anchorCohort,"source","Practise the original source first","Answer its existing listening and reading/form questions before attempting cumulative work.",blocked6.title+" · prerequisites are not yet met",56,blocked6.anchorSceneId));
 const unlinked2=e02.unmappedScenes[0];
 if(unlinked2)options.push(action("e02","reading","Read an original A1 conversation","Original source material stays accessible while its canonical association is unresolved.",unlinked2.title+" · ungraded A1 reading",38,unlinked2.id));
 const unlinked=e03.unmappedScenes[0];
 if(unlinked)options.push(action("e03","reading","Read an original A2 conversation","No unsupported Can-do, grade or proficiency evidence will be created.",unlinked.title+" · ungraded source reading",36,unlinked.id));
 const unlinked4=e04.unmapped[0];
 if(unlinked4)options.push(action("e04","reading","Read a practical A2 dialogue","Follow the original problem-solving dialogue without generating a scored answer.",unlinked4.title+" · ungraded source reading",35,unlinked4.id));
 const unlinked6=e06.cases.find(c=>c.canDoId===null);
 if(unlinked6)options.push(action("e06","reading","Read a cumulative original scenario","Keep source text accessible even when canonical linkage is unresolved.",unlinked6.title+" · ungraded source reading",34,unlinked6.id));
 options.push(action("fsrs","scheduled","Study today's Japanese","Practise the existing kana, vocabulary and language queues.",summary.due+" due reviews · "+(summary.newKana+summary.newVocabulary)+" new basics",0));
 const seen=new Set<string>();
 const unique=options.sort((a,b)=>b.priority-a.priority).filter(item=>{
  // One action per specific source target, but keep delayed distinct from source study.
  if(seen.has(item.key))return false;
  seen.add(item.key);return true;
 });
 return {
  primary:unique[0]!,
  alternatives:unique.slice(1,5),
  sourceA1:e02.total+(e01.unitId?1:0),
  sourceA2:e03.total+e04.linked,
  unlinkedOriginal:e02.unmappedScenes.length+e03.unmappedScenes.length+e04.unmapped.length+e06.unlinked,
  delayedReady:delayedCount,correctionsPending:e05.repair.pending,
  explanation:"This order is a UI recommendation computed from existing StudyEvents, Can-do associations and FSRS review projections. It does not alter scheduling or grant mastery."
 };
}
