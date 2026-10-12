export type BranchChoice={correct:boolean;next?:number|null};
export type BranchTurn={choices:readonly BranchChoice[]};
export function validateRoleplayGraph(turns:readonly BranchTurn[]):string[]{
 const errors:string[]=[];
 if(!turns.length)return ["scenario has no turns"];
 const visited=new Set<number>(),pending=[0];
 while(pending.length){
  const index=pending.pop()!;
  if(visited.has(index))continue;
  if(index<0||index>=turns.length){errors.push("unreachable destination "+index);continue;}
  visited.add(index);
  const turn=turns[index]!;
  if(!turn.choices.some(c=>c.correct))errors.push("no valid answer at "+index);
  for(const choice of turn.choices){
   if(!choice.correct)continue;
   const next=choice.next===undefined?index+1:choice.next;
   if(next!==null){
    if(!Number.isInteger(next)||next<0||next>=turns.length)errors.push("invalid destination "+next+" from "+index);
    else pending.push(next);
   }
  }
 }
 if(![...visited].some(i=>turns[i]!.choices.some(c=>c.correct&&(c.next===null||(c.next===undefined&&i===turns.length-1)))))errors.push("no reachable ending");
 return errors;
}
