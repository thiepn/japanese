/** P52 first-party original sentence-transformation syllabus. Stable IDs; no parallel assessment. */
export type P52Domain="register"|"intention"|"chronology"|"aspect"|"condition"|"evidence"|"potential"|"contrast"|"perspective"|"voice";
export type P52Mode="preserve"|"change";
/** Each follow-up uses an independently written situation, source sentence and target utterance. */
export interface P52FollowUp {
 scene:string;input:string;goal:string;model:string;alternative:string;why:string;
}
export interface P52Transformation{
 id:string;title:string;domain:P52Domain;units:readonly string[];mode:P52Mode;
 role:string;scene:string;input:string;goal:string;model:string;
 alternatives:readonly [string,string];nuance:string;misconception:string;wrong:string;repair:string;
 production:P52FollowUp;return:P52FollowUp;
}
export type P52RawFollowUp=readonly [scene:string,input:string,goal:string,model:string,alternative:string,why:string];
export type P52RawTransformation=readonly [
 id:string,title:string,domain:P52Domain,units:readonly string[],mode:P52Mode,
 role:string,scene:string,input:string,goal:string,model:string,
 alternativeOne:string,alternativeTwo:string,nuance:string,misconception:string,
 wrong:string,repair:string,production:P52RawFollowUp,delayed:P52RawFollowUp
];
export function authoredP52([id,title,domain,units,mode,role,scene,input,goal,model,a,b,nuance,misconception,wrong,repair,p,r]:P52RawTransformation):P52Transformation {
 const follow=([scene,input,goal,model,alternative,why]:P52RawFollowUp):P52FollowUp=>({scene,input,goal,model,alternative,why});
 return {id,title,domain,units,mode,role,scene,input,goal,model,alternatives:[a,b],nuance,misconception,wrong,repair,production:follow(p),return:follow(r)};
}
