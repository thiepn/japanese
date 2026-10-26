import type {StudyPrompt} from "@thiepn/study-player";

export function presentedKanaChoices(prompt:StudyPrompt,nonce:string):string[]{
  if(prompt.promptType!=="choice")return [];
  const choices=[...prompt.choices];
  if(prompt.primaryTarget.kind!=="kana"||choices.length<2)return choices;
  let seed=2166136261;
  for(const char of prompt.id+"|"+nonce){
    seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;
  }
  for(let i=choices.length-1;i>0;i--){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const j=seed%(i+1);
    [choices[i],choices[j]]=[choices[j]!,choices[i]!];
  }
  return choices;
}
