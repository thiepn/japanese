/** P60 original culminating A2 content, not a parallel record/grading system. */
export type P60LineRaw=readonly [speaker:string,japanese:string,german:string];
export type P60TaskRaw=readonly [situation:string,model:string,alternative:string,trap:string,why:string];
export type P60QuestionRaw=readonly [kind:"chronology"|"evidence"|"intention"|"condition"|"status"|"speaker",
 question:string,model:string,alternative:string,trap:string,why:string,documentEvidence:string,spokenEvidence:string];
export type P60ReplyRaw=readonly [speaker:string,japanese:string,german:string,goal:string,model:string,alternative:string,trap:string,why:string];
export type P60RevisionRaw=readonly [flawed:string,model:string,alternative:string,why:string];
export type P60RawUnit=readonly [
 id:string,title:string,unitId:string,domain:string,goal:string,
 text:readonly [P60LineRaw,P60LineRaw,P60LineRaw],
 messages:readonly [P60LineRaw,P60LineRaw],
 spoken:readonly [P60LineRaw,P60LineRaw,P60LineRaw],
 questions:readonly [P60QuestionRaw,P60QuestionRaw],
 strategy:P60TaskRaw,writing:P60TaskRaw,reply:P60ReplyRaw,revision:P60RevisionRaw,
 unseen:P60TaskRaw,grammar:string,vocabulary:readonly string[]
];
export interface P60Line{speaker:string;japanese:string;german:string}
export interface P60Task{situation:string;model:string;alternative:string;trap:string;why:string}
export interface P60Question extends P60Task{id:string;kind:P60QuestionRaw[0];documentEvidence:string;spokenEvidence:string}
export interface P60Reply extends P60Task{speaker:string;japanese:string;german:string;goal:string}
export interface P60Revision{flawed:string;model:string;alternative:string;why:string}
export interface P60Unit{
 id:string;title:string;units:readonly string[];level:"A2";domain:string;goal:string;
 text:readonly [P60Line,P60Line,P60Line];
 messages:readonly [P60Line,P60Line];spoken:readonly [P60Line,P60Line,P60Line];
 questions:readonly [P60Question,P60Question];strategy:P60Task;writing:P60Task;
 reply:P60Reply;revision:P60Revision;unseen:P60Task;
 grammar:string;vocabulary:readonly string[];
}
export function authoredP60(x:P60RawUnit):P60Unit{
 const [id,title,unitId,domain,goal,reading,msg,dialogue,qs,choice,write,follow,correction,transfer,grammar,vocabulary]=x;
 const line=([speaker,japanese,german]:P60LineRaw):P60Line=>({speaker,japanese,german});
 const task=([situation,model,alternative,trap,why]:P60TaskRaw):P60Task=>({situation,model,alternative,trap,why});
 const question=([kind,situation,model,alternative,trap,why,documentEvidence,spokenEvidence]:P60QuestionRaw,i:number):P60Question=>
  ({id:id+"-q"+(i+1),kind,situation,model,alternative,trap,why,documentEvidence,spokenEvidence});
 const [speaker,japanese,german,goalFollow,model,alternative,trap,why]=follow;
 const [flawed,correct,other,explanation]=correction;
 return {id,title,units:[unitId],level:"A2",domain,goal,
  text:reading.map(line) as unknown as P60Unit["text"],
  messages:msg.map(line) as unknown as P60Unit["messages"],
  spoken:dialogue.map(line) as unknown as P60Unit["spoken"],
  questions:qs.map(question) as unknown as P60Unit["questions"],
  strategy:task(choice),writing:task(write),
  reply:{speaker,japanese,german,goal:goalFollow,model,alternative,trap,why},
  revision:{flawed,model:correct,alternative:other,why},
  unseen:task(transfer),grammar,vocabulary:[...vocabulary]};
}
