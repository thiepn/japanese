import type {P41Arc,P41Turn} from "./dialogue41";
type Line=readonly [string,string,string,string,string,string,string];
type Transfer=readonly [string,string,string,string,string];
/** Original authored content adapter; the canonical StudyPlayer owns practice. */
export function makeP41Arc(input:{
 id:string;level:"A1"|"A2";units:readonly string[];title:string;setting:string;
 pivotTurn:number;outcome:string;turns:readonly Line[];returnCue:Transfer;
}):P41Arc{
 const turns:P41Turn[]=input.turns.map(([partner,intention,model,alternative,misstep,why,focus],i)=>({
  id:input.id+"-t"+(i+1),number:i+1,partner,intention,model,alternative,misstep,why,focus,
  shift:(i+1===input.pivotTurn?"Wendepunkt — ":"Gesprächsziel — ")+intention
 }));
 return {...input,turns,returnCue:{
  intention:input.returnCue[0],model:input.returnCue[1],alternative:input.returnCue[2],
  misstep:input.returnCue[3],why:input.returnCue[4]
 }};
}
