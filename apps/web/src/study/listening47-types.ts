/** Original Japanese listening scripts: no recordings or publisher audio. */
export type P47Level="A1"|"A2";
export type P47Genre="dialogue"|"announcement"|"voicemail"|"instructions"|"interview"|"story"|"service"|"message";
export type P47QuestionKind="detail"|"inference"|"intent";
export interface P47Line{speaker:string;japanese:string;german:string;}
export interface P47Question{
 id:string;kind:P47QuestionKind;question:string;answer:string;alternative:string;
 misconception:string;feedback:string;evidence:string;
}
export interface P47Task{
 instruction:string;model:string;alternative:string;misconception:string;feedback:string;
}
export interface P47Scene {
 id:string;title:string;genre:P47Genre;level:P47Level;units:readonly string[];
 situation:string;listeningGoal:string;prediction:string;
 lines:readonly P47Line[];questions:readonly P47Question[];
 vocabulary:readonly {word:string;reading:string;meaning:string;context:string}[];
 notes:string;response:P47Task;transfer:P47Task;
}
/** Compact but explicitly authored source; conversion creates no learner data. */
export type P47RawLine=readonly [speaker:string,japanese:string,german:string];
export type P47RawQuestion=readonly [
 kind:P47QuestionKind,question:string,answer:string,alternative:string,
 misconception:string,feedback:string,evidence:string
];
export type P47RawWord=readonly [word:string,reading:string,meaning:string,context:string];
export type P47RawTask=readonly [instruction:string,model:string,alternative:string,
 misconception:string,feedback:string];
export interface P47RawScene {
 id:string;title:string;genre:P47Genre;level:P47Level;units:readonly string[];
 situation:string;listeningGoal:string;prediction:string;lines:readonly P47RawLine[];
 questions:readonly P47RawQuestion[];vocabulary:readonly P47RawWord[];
 notes:string;response:P47RawTask;transfer:P47RawTask;
}
export function authoredP47Scene(raw:P47RawScene):P47Scene{
 return {...raw,lines:raw.lines.map(([speaker,japanese,german])=>({speaker,japanese,german})),
  questions:raw.questions.map(([kind,question,answer,alternative,misconception,feedback,evidence],i)=>({
   id:raw.id+"-q"+(i+1),kind,question,answer,alternative,misconception,feedback,evidence
  })),
  vocabulary:raw.vocabulary.map(([word,reading,meaning,context])=>({word,reading,meaning,context})),
  response:toTask(raw.response),transfer:toTask(raw.transfer)};
}
function toTask([instruction,model,alternative,misconception,feedback]:P47RawTask):P47Task{
 return {instruction,model,alternative,misconception,feedback};
}
