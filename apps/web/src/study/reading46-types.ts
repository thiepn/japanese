/** All teaching passages here are original first-party Japanese writing. */
export type P46Genre="message"|"diary"|"notice"|"schedule"|"email"|"story"|"article"|"guide"|"review"|"interview"|"instructions"|"community";
export type P46Difficulty="A1"|"A2";
export type P46QuestionKind="detail"|"inference"|"purpose";
export interface P46Word {
  form:string;reading:string;meaning:string;inContext:string;
}
export interface P46Question {
  id:string;kind:P46QuestionKind;question:string;
  model:string;alternative:string;misconception:string;
  why:string;evidence:string;
}
export interface P46Output {
  situation:string;model:string;alternative:string;misconception:string;why:string;
}
export interface P46Reading {
  id:string;title:string;genre:P46Genre;level:P46Difficulty;
  units:readonly string[];purpose:string;setting:string;
  paragraphs:readonly string[];words:readonly P46Word[];
  contextNote:string;questions:readonly P46Question[];
  writing:P46Output;returnCue:P46Output;
}
/** Authoring-only data adapter: no learning-state or scoring authority. */
export type P46RawWord=readonly [form:string,reading:string,meaning:string,inContext:string];
export type P46RawQuestion=readonly [kind:P46QuestionKind,question:string,model:string,
  alternative:string,misconception:string,why:string,evidence:string];
export type P46RawOutput=readonly [situation:string,model:string,alternative:string,
  misconception:string,why:string];
export interface P46RawReading{
 id:string;title:string;genre:P46Genre;level:P46Difficulty;units:readonly string[];
 purpose:string;setting:string;paragraphs:readonly string[];
 words:readonly P46RawWord[];contextNote:string;
 questions:readonly P46RawQuestion[];writing:P46RawOutput;returnCue:P46RawOutput;
}
export function authoredP46Reading(data:P46RawReading):P46Reading{
 const words:P46Word[]=data.words.map(([form,reading,meaning,inContext])=>
  ({form,reading,meaning,inContext}));
 const questions:P46Question[]=data.questions.map(([kind,question,model,alternative,misconception,why,evidence],i)=>
  ({id:data.id+"-q"+(i+1),kind,question,model,alternative,misconception,why,evidence}));
 const output=([situation,model,alternative,misconception,why]:P46RawOutput):P46Output=>
  ({situation,model,alternative,misconception,why});
 return {...data,words,questions,writing:output(data.writing),returnCue:output(data.returnCue)};
}
