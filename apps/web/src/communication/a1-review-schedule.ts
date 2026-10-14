export type RecallAttempt={id:string;at:string;correct:boolean};
export type RecallState={streak:number;attempts:number;incorrect:number;last:string;dueAt:string};
export function recallSchedule(attempts:readonly RecallAttempt[],_now=Date.now()):Record<string,RecallState>{
 const sorted=[...attempts].filter(a=>Number.isFinite(Date.parse(a.at))).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const result:Record<string,RecallState>={};
 for(const attempt of sorted){
  const old=result[attempt.id];const streak=attempt.correct?(old?.streak??0)+1:0;
  const intervals=[0,1,3,7,14,30,60];
  const days=attempt.correct?intervals[Math.min(streak,intervals.length-1)]??60:0;
  result[attempt.id]={streak,attempts:(old?.attempts??0)+1,incorrect:(old?.incorrect??0)+(attempt.correct?0:1),last:attempt.at,dueAt:new Date(Date.parse(attempt.at)+days*86400000).toISOString()};
 }
 return result;
}
export function isRecallDue(state:RecallState|undefined,now=Date.now()):boolean{
 return !state||Date.parse(state.dueAt)<=now;
}
export function countStudiedDue(states:Record<string,RecallState>,now=Date.now()):number{
 return Object.values(states).filter(s=>isRecallDue(s,now)).length;
}
