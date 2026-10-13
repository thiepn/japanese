import type {P45Challenge,P45Turn} from "./independence45";
export type P45TurnSource=readonly [
 partner:string,goal:string,model:string,alternative:string,
 misconception:string,why:string,continuity:string
];
export type P45ReturnSource=readonly [
 situation:string,model:string,alternative:string,misconception:string,why:string
];
export function makeP45Challenge(data:{
 id:string;title:string;level:"A1"|"A2";units:readonly string[];parentCase:string;
 relationship:string;setting:string;purpose:string;unexpected:string;outcome:string;
 turns:readonly P45TurnSource[];returnCue:P45ReturnSource;
}):P45Challenge{
 const turns:P45Turn[]=data.turns.map(
  ([partner,goal,model,alternative,misconception,why,continuity],i)=>({
   id:data.id+"-t"+(i+1),partner,goal,model,alternative,misconception,why,continuity
  })
 );
 const [situation,model,alternative,misconception,why]=data.returnCue;
 return {...data,turns,returnCue:{situation,model,alternative,misconception,why}};
}
