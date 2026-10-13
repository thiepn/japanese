/** First-party, original P55 connected listening scripts: no recorded audio. */
export type P55Genre="dialogue"|"announcement"|"voice-message"|"service"|"meeting"|"interview"|"instructions"|"conversation";
export type P55QuestionKind="evidence"|"speaker"|"chronology"|"cause"|"inference"|"intention";
export type P55RawLine=readonly [role:string,japanese:string,german:string];
export type P55RawQuestion=readonly [kind:P55QuestionKind,question:string,model:string,alternative:string,misconception:string,why:string,evidence:string];
export type P55RawResponse=readonly [situation:string,model:string,alternative:string,misconception:string,why:string];
export interface P55RawScene{
 id:string;title:string;genre:P55Genre;unit:string;setting:string;listeningGoal:string;prediction:string;
 turns:readonly P55RawLine[];words:readonly string[];contrast:string;
 questions:readonly P55RawQuestion[];response:P55RawResponse;delayed:P55RawResponse;
}
export interface P55Turn{role:string;japanese:string;german:string;}
export interface P55Question{
 id:string;kind:P55QuestionKind;question:string;model:string;alternative:string;
 misconception:string;why:string;evidence:string;
}
export interface P55Response{
 situation:string;model:string;alternative:string;misconception:string;why:string;
}
export interface P55Scene{
 id:string;title:string;genre:P55Genre;level:"A2";units:readonly string[];
 setting:string;listeningGoal:string;prediction:string;
 turns:readonly P55Turn[];words:readonly string[];contrast:string;
 questions:readonly P55Question[];response:P55Response;delayed:P55Response;
}
export function authoredP55(s:P55RawScene):P55Scene{
 const transform=([situation,model,alternative,misconception,why]:P55RawResponse):P55Response=>
  ({situation,model,alternative,misconception,why});
 return {id:s.id,title:s.title,genre:s.genre,level:"A2",units:[s.unit],
  setting:s.setting,listeningGoal:s.listeningGoal,prediction:s.prediction,
  turns:s.turns.map(([role,japanese,german])=>({role,japanese,german})),
  words:[...s.words],contrast:s.contrast,
  questions:s.questions.map(([kind,question,model,alternative,misconception,why,evidence],i)=>
   ({id:s.id+"-q"+(i+1),kind,question,model,alternative,misconception,why,evidence})),
  response:transform(s.response),delayed:transform(s.delayed)};
}
