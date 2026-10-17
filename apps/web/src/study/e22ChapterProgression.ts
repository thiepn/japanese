import type {E01Progress,E02Overview,E03Overview,E04Overview,E19Overview} from "./runtime";

/** E22: display-only chapter continuity over original owner-scoped projections.
 * Chapter titles/order are THIEPN navigation editorial groupings, never an
 * external textbook chapter identifier or a second mastery engine.
 */
export const E22_A1_GROUPS=[
 {title:"First Words",jp:"はじまり",ids:["first-conversation","greetings","personal","origin"]},
 {title:"People & Time",jp:"人と時間",ids:["family","routine","time"]},
 {title:"Daily Life",jp:"毎日の暮らし",ids:["preferences","food","shopping"]},
 {title:"Out & About",jp:"外へ",ids:["transport","past"]},
 {title:"Keep Talking",jp:"会話を続ける",ids:["help","exchange"]}
] as const;
export type E22Cohort="e01"|"e02"|"e03"|"e04";
export type E22Level="A1"|"A2";
export interface E22Selection{level:E22Level;chapter:number;}
/** Owner-bound, ephemeral navigation only; never persisted or a mastery record. */
export function resolveE22OwnerSelection(owner:string,saved:{owner:string;value:E22Selection}|null):E22Selection|null{
 return owner&&saved?.owner===owner?saved.value:null;
}
export type E22Status="not_started"|"learning"|"waiting"|"ready"|"reviewed"|"preview";
export interface E22Node{
 key:string;cohort:E22Cohort;sceneId:string;title:string;
 status:E22Status;linked:boolean;guidedCorrect:number;guidedRequired:number;guidedAnswered:number;guidedFinished:boolean;
 sourceReady:boolean;writingStatus:"study-source"|"first-draft"|"revise"|"review"|null;
 reviewReady:boolean;reviewed:boolean;
}
export interface E22Chapter{
 key:string;level:E22Level;id:number;title:string;jp:string;
 nodes:E22Node[];linkedCount:number;guidedComplete:number;
 reviewReady:number;reviewed:number;previewCount:number;
 nextGuidedKey:string|null;nextReviewKey:string|null;nextWritingKey:string|null;
 nextPreviewKey:string|null;
}
export interface E22Path{a1:E22Chapter[];a2:E22Chapter[];}
export function e22InitialLocation(primary:{origin:string;targetId?:string}):{level:E22Level;chapter:number}{
 if(primary.origin==="e02"&&primary.targetId){
  const index=E22_A1_GROUPS.findIndex(c=>c.ids.some(id=>id===primary.targetId));
  return {level:"A1",chapter:index<0?0:index};
 }
 if(primary.origin==="e03")return {level:"A2",chapter:0};
 if(primary.origin==="e04")return {level:"A2",chapter:1};
 return {level:"A1",chapter:0};
}
function chapter(level:E22Level,id:number,title:string,jp:string,nodes:E22Node[]):E22Chapter{
 const linked=nodes.filter(x=>x.linked);
 const completed=linked.filter(x=>x.guidedFinished);
 return {key:level+":"+id,level,id,title,jp,nodes,linkedCount:linked.length,
  guidedComplete:completed.length,reviewReady:linked.filter(x=>x.reviewReady).length,
  reviewed:linked.filter(x=>x.reviewed).length,previewCount:nodes.length-linked.length,
  nextGuidedKey:linked.find(x=>x.status==="learning")?.key??
    linked.find(x=>x.status==="not_started")?.key??null,
  nextReviewKey:linked.find(x=>x.reviewReady)?.key??null,
  nextWritingKey:completed.find(x=>x.sourceReady&&
    (x.writingStatus==="first-draft"||x.writingStatus==="revise"))?.key??null,
  nextPreviewKey:nodes.find(x=>!x.linked)?.key??null};
}
export function buildE22Chapters(input:{e01:E01Progress;e02:E02Overview;e03:E03Overview;e04:E04Overview;e19:E19Overview}):E22Path{
 const {e01,e02,e03,e04,e19}=input;
 const writing=new Map(e19.cases.map(x=>[x.key,x]));
 const withWriting=(cohort:E22Cohort,id:string)=>{
  const info=writing.get(cohort+":"+id);
  return {sourceReady:info?.sourceReady??false,writingStatus:info?.status??null};
 };
 const a1:E22Node[]=[
  ...(e01.unitId?[{
   key:"e01:first-conversation",cohort:"e01" as const,sceneId:"first-conversation",
   title:"First conversations",status:e01.status as E22Status,linked:true,
   guidedCorrect:e01.correct,guidedAnswered:e01.answered,guidedRequired:7,
   guidedFinished:["waiting","ready","reviewed"].includes(e01.status),
   sourceReady:false,writingStatus:null,reviewReady:e01.status==="ready",reviewed:e01.status==="reviewed"
  }]:[]),
  ...e02.scenes.map(s=>({
   key:"e02:"+s.id,cohort:"e02" as const,sceneId:s.id,title:s.title,status:s.state,
   linked:true,guidedCorrect:s.completedControlled,guidedRequired:s.requiredControlled,
   guidedAnswered:s.attempts,guidedFinished:s.requiredControlled>0&&s.completedControlled>=s.requiredControlled&&
    ["waiting","ready","reviewed"].includes(s.state),
   ...withWriting("e02",s.id),reviewReady:s.state==="ready",reviewed:s.state==="reviewed"
  })),
  ...e02.unmappedScenes.map(s=>({
   key:"e02:"+s.id,cohort:"e02" as const,sceneId:s.id,title:s.title,status:"preview" as const,
   linked:false,guidedCorrect:0,guidedRequired:0,guidedAnswered:0,guidedFinished:false,sourceReady:false,writingStatus:null,
   reviewReady:false,reviewed:false
  }))
 ];
 const assignedIds=new Set<string>(E22_A1_GROUPS.flatMap(g=>[...g.ids]));
 const groups:E22Chapter[]=E22_A1_GROUPS.map((g,id)=>chapter("A1",id,g.title,g.jp,a1.filter(n=>g.ids.some(x=>x===n.sceneId))));
 const remaining=a1.filter(n=>!assignedIds.has(n.sceneId));
 if(remaining.length)groups.push(chapter("A1",groups.length,"Other original conversations","ほかの会話",remaining));
 const a2a:E22Node[]=[
  ...e03.scenes.map(s=>({key:"e03:"+s.id,cohort:"e03" as const,sceneId:s.id,title:s.title,status:s.state,linked:true,
   guidedCorrect:s.correct,guidedRequired:s.required,guidedAnswered:s.answered,
   guidedFinished:s.required>0&&s.correct>=s.required&&["waiting","ready","reviewed"].includes(s.state),
   ...withWriting("e03",s.id),reviewReady:s.state==="ready",reviewed:s.state==="reviewed"})),
  ...e03.unmappedScenes.map(s=>({key:"e03:"+s.id,cohort:"e03" as const,sceneId:s.id,title:s.title,status:"preview" as const,
   linked:false,guidedCorrect:0,guidedRequired:0,guidedAnswered:0,guidedFinished:false,sourceReady:false,writingStatus:null,reviewReady:false,reviewed:false}))
 ];
 const a2b:E22Node[]=[
  ...e04.scenes.map(s=>({key:"e04:"+s.id,cohort:"e04" as const,sceneId:s.id,title:s.title,status:s.status,linked:true,
   guidedCorrect:s.guidedCorrect,guidedRequired:s.guidedTotal,guidedAnswered:s.controlledAttempts,
   guidedFinished:s.guidedTotal>0&&s.guidedCorrect>=s.guidedTotal&&["waiting","ready","reviewed"].includes(s.status),
   ...withWriting("e04",s.id),reviewReady:s.status==="ready",reviewed:s.status==="reviewed"})),
  ...e04.unmapped.map(s=>({key:"e04:"+s.id,cohort:"e04" as const,sceneId:s.id,title:s.title,status:"preview" as const,
   linked:false,guidedCorrect:0,guidedRequired:0,guidedAnswered:0,guidedFinished:false,sourceReady:false,writingStatus:null,reviewReady:false,reviewed:false}))
 ];
 return {a1:groups,a2:[
  chapter("A2",0,"Connected conversations","つながる会話",a2a),
  chapter("A2",1,"Everyday problem solving","暮らしの課題",a2b)
 ]};
}
export function getE22NextChapter(path:E22Path,level:E22Level,id:number):{level:E22Level;id:number}|null{
 const list=level==="A1"?path.a1:path.a2;
 if(id+1<list.length)return {level,id:id+1};
 if(level==="A1"&&path.a2.length)return {level:"A2",id:0};
 return null;
}
