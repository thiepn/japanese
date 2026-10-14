/** First-party original multi-source A2 practical missions, no learner progress store. */
export type P58RawLine=readonly [speaker:string,japanese:string,german:string];
export type P58RawQuestion=readonly [
 kind:"cross-source"|"chronology"|"evidence"|"intention"|"status"|"reason",
 question:string,model:string,alternative:string,misleading:string,why:string,
 evidenceA:string,evidenceB:string
];
export type P58RawTask=readonly [situation:string,model:string,alternative:string,misleading:string,why:string];
export type P58RawChoice=readonly [question:string,valid:string,alternative:string,misleading:string,why:string];
export type P58RawReply=readonly [incoming:string,incomingGerman:string,goal:string,model:string,alternative:string,misleading:string,why:string];
export type P58RawMission=readonly [
 id:string,title:string,unit:string,setting:string,goal:string,
 notice:P58RawLine,message:P58RawLine,spokenA:P58RawLine,spokenB:P58RawLine,
 questions:readonly [P58RawQuestion,P58RawQuestion],
 choice:P58RawChoice,write:P58RawTask,reply:P58RawReply,
 repair:P58RawTask,returnCue:P58RawTask,
 reading54Id:string,listening55Id:string,writing57Id:string,
 words:readonly string[],contrast:string
];
export type P58Line={speaker:string;japanese:string;german:string};
export type P58Question={
 id:string;kind:P58RawQuestion[0];question:string;model:string;alternative:string;
 misleading:string;why:string;evidenceA:string;evidenceB:string
};
export type P58Task={situation:string;model:string;alternative:string;misleading:string;why:string};
export type P58Choice={question:string;valid:string;alternative:string;misleading:string;why:string};
export type P58Reply={incoming:string;incomingGerman:string;goal:string;model:string;alternative:string;misleading:string;why:string};
export type P58Mission={
 id:string;title:string;units:readonly string[];level:"A2";setting:string;goal:string;
 notice:P58Line;message:P58Line;spoken:readonly [P58Line,P58Line];
 questions:readonly [P58Question,P58Question];choice:P58Choice;
 write:P58Task;reply:P58Reply;repair:P58Task;returnCue:P58Task;
 reading54Id:string;listening55Id:string;writing57Id:string;
 words:readonly string[];contrast:string
};
export function authoredP58(x:P58RawMission):P58Mission{
 const [id,title,unit,setting,goal,n,m,a,z,qs,c,w,f,fix,ret,
  reading54Id,listening55Id,writing57Id,words,contrast]=x;
 const line=([speaker,japanese,german]:P58RawLine):P58Line=>({speaker,japanese,german});
 const task=([situation,model,alternative,misleading,why]:P58RawTask):P58Task=>
  ({situation,model,alternative,misleading,why});
 const [question,valid,alternative,misleading,why]=c;
 const [incoming,incomingGerman,replyGoal,model,replyAlternative,replyMisleading,replyWhy]=f;
 const questionObj=(q:P58RawQuestion,i:number):P58Question=>{
  const [kind,question,model,alternative,misleading,why,evidenceA,evidenceB]=q;
  return {id:id+"-q"+(i+1),kind,question,model,alternative,misleading,why,evidenceA,evidenceB};
 };
 return {id,title,units:[unit],level:"A2",setting,goal,
  notice:line(n),message:line(m),spoken:[line(a),line(z)],
  questions:[questionObj(qs[0],0),questionObj(qs[1],1)],
  choice:{question,valid,alternative,misleading,why},write:task(w),
  reply:{incoming,incomingGerman,goal:replyGoal,model,alternative:replyAlternative,
   misleading:replyMisleading,why:replyWhy},repair:task(fix),returnCue:task(ret),
  reading54Id,listening55Id,writing57Id,words:[...words],contrast};
}
