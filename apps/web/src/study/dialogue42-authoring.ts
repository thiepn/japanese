import type {P42Arc,P42Line,P42Return} from "./dialogue42";
import type {P41Turn} from "./dialogue41";

/** Authored-data adapter only; no learner state or second practice engine. */
export function makeP42Arc(input:{
  id:string;baseArcId:string;level:"A1"|"A2";units:readonly string[];
  title:string;setting:string;interlocutor:string;relationship:string;
  register:"polite"|"casual";variation:string;contrast:string;
  pivotTurn:number;outcome:string;turns:readonly P42Line[];returnCue:P42Return;
}):P42Arc{
  const turns:P41Turn[]=input.turns.map(([partner,intention,model,alternative,misstep,why,focus],i)=>({
    id:input.id+"-t"+(i+1),number:i+1,partner,intention,model,alternative,misstep,why,focus,
    shift:(i+1===input.pivotTurn?"Neuer Sachverhalt — ":"Kontextziel — ")+intention
  }));
  const [intention,model,alternative,misstep,why]=input.returnCue;
  return {...input,turns,returnCue:{intention,model,alternative,misstep,why}};
}
