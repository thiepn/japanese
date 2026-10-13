/** P51 first-party, contextual A2 Japanese grammar and pragmatic meaning contrasts. */
export type P51Domain="time"|"aspect"|"condition"|"intention"|"permission"|"comparison"|"evidence"|"social"|"sequence"|"description";
export interface P51Example {japanese:string;english:string;why:string;}
export interface P51Task {situation:string;model:string;alternative:string;misconception:string;feedback:string;}
export interface P51Contrast {
 id:string;title:string;domain:P51Domain;units:readonly string[];
 formA:string;formB:string;meaningA:string;meaningB:string;
 scene:string;audience:string;register:string;choiceRule:string;
 examples:readonly P51Example[];commonError:string;errorRepair:string;
 production:P51Task;transfer:P51Task;teachingLink:string;
}
export type P51RawExample=readonly [japanese:string,english:string,why:string];
export type P51RawTask=readonly [
 situation:string,model:string,alternative:string,misconception:string,feedback:string
];
export type P51RawContrast=readonly [
 id:string,title:string,domain:P51Domain,units:readonly string[],
 formA:string,formB:string,meaningA:string,meaningB:string,
 scene:string,audience:string,register:string,choiceRule:string,
 examples:readonly P51RawExample[],commonError:string,errorRepair:string,
 production:P51RawTask,transfer:P51RawTask,teachingLink:string
];
const task=([situation,model,alternative,misconception,feedback]:P51RawTask):P51Task=>({
 situation,model,alternative,misconception,feedback
});
export function authoredP51Contrast([
 id,title,domain,units,formA,formB,meaningA,meaningB,scene,audience,register,choiceRule,
 examples,commonError,errorRepair,production,transfer,teachingLink
]:P51RawContrast):P51Contrast {
 return {id,title,domain,units,formA,formB,meaningA,meaningB,scene,audience,register,choiceRule,
  examples:examples.map(([japanese,english,why])=>({japanese,english,why})),
  commonError,errorRepair,production:task(production),transfer:task(transfer),teachingLink};
}
