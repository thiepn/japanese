/** P56 first-party original flexible A2 conversation content. No private learner state. */
export type P56RouteKey="direct"|"alternate"|"repair";
export type P56Register="casual"|"polite"|"service";
export type P56RawRoute=readonly [
 opening:string,openingGerman:string,partner:string,partnerGerman:string,
 nextGoal:string,reply:string,replyAlternative:string,explanation:string
];
export type P56RawMisunderstanding=readonly [
 misleading:string,meaning:string,partner:string,partnerGerman:string,
 repairGoal:string,repair:string,repairAlternative:string,misconception:string
];
export type P56RawTransfer=readonly [
 situation:string,model:string,alternative:string,misleading:string,explanation:string
];
export type P56RawScene=readonly [
 id:string,title:string,unit:string,register:P56Register,relation:string,
 setting:string,partner:string,partnerGerman:string,goal:string,
 direct:P56RawRoute,alternate:P56RawRoute,mistake:P56RawMisunderstanding,
 production:P56RawTransfer,returnCue:P56RawTransfer,nuance:string,words:readonly string[]
];
export interface P56Route{
 opening:string;openingGerman:string;partner:string;partnerGerman:string;
 nextGoal:string;reply:string;replyAlternative:string;explanation:string;
}
export interface P56Mistake{
 misleading:string;meaning:string;partner:string;partnerGerman:string;
 repairGoal:string;repair:string;repairAlternative:string;misconception:string;
}
export interface P56Transfer{
 situation:string;model:string;alternative:string;misleading:string;explanation:string;
}
export interface P56Scene{
 id:string;title:string;units:readonly string[];level:"A2";register:P56Register;
 relation:string;setting:string;partner:string;partnerGerman:string;goal:string;
 routes:Record<"direct"|"alternate",P56Route>;mistake:P56Mistake;
 production:P56Transfer;returnCue:P56Transfer;nuance:string;words:readonly string[];
}
export function authoredP56(raw:P56RawScene):P56Scene{
 const [id,title,unit,register,relation,setting,partner,partnerGerman,goal,direct,alternate,
  mistake,production,returnCue,nuance,words]=raw;
 const route=([opening,openingGerman,partner,partnerGerman,nextGoal,reply,replyAlternative,explanation]:P56RawRoute):P56Route=>
  ({opening,openingGerman,partner,partnerGerman,nextGoal,reply,replyAlternative,explanation});
 const mis=([misleading,meaning,partner,partnerGerman,repairGoal,repair,repairAlternative,misconception]:P56RawMisunderstanding):P56Mistake=>
  ({misleading,meaning,partner,partnerGerman,repairGoal,repair,repairAlternative,misconception});
 const transfer=([situation,model,alternative,misleading,explanation]:P56RawTransfer):P56Transfer=>
  ({situation,model,alternative,misleading,explanation});
 return {id,title,level:"A2",units:[unit],register,relation,setting,partner,partnerGerman,goal,
  routes:{direct:route(direct),alternate:route(alternate)},mistake:mis(mistake),
  production:transfer(production),returnCue:transfer(returnCue),nuance,words:[...words]};
}
