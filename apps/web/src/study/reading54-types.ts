/** P54 first-party connected A2 reading material. No learning or assessment authority. */
export type P54Genre="message"|"email"|"notice"|"diary"|"story"|"schedule"|"article"|"instructions"|"conversation"|"report";
export type P54QuestionKind="evidence"|"chronology"|"cause"|"inference"|"speaker";
export type P54RawQuestion=readonly [
 kind:P54QuestionKind,question:string,model:string,alternative:string,
 misconception:string,explanation:string,evidence:string
];
export type P54RawTransfer=readonly [
 situation:string,model:string,alternative:string,why:string,misconception:string
];
export interface P54RawReading{
 id:string;title:string;genre:P54Genre;unit:string;
 situation:string;purpose:string;paragraphs:readonly (readonly [japanese:string,german:string])[];
 words:readonly string[];grammar:string;contrast:string;
 questions:readonly P54RawQuestion[];
 writing:P54RawTransfer;returnCue:P54RawTransfer;
}
export interface P54Question{
 id:string;kind:P54QuestionKind;question:string;model:string;alternative:string;
 misconception:string;explanation:string;evidence:string;
}
export interface P54Transfer{
 situation:string;model:string;alternative:string;why:string;misconception:string;
}
export interface P54Reading{
 id:string;title:string;genre:P54Genre;units:readonly string[];
 situation:string;purpose:string;
 paragraphs:readonly {japanese:string;german:string}[];
 words:readonly string[];grammar:string;contrast:string;
 questions:readonly P54Question[];writing:P54Transfer;returnCue:P54Transfer;
}
export function authoredP54(r:P54RawReading):P54Reading{
 const unpack=([situation,model,alternative,why,misconception]:P54RawTransfer):P54Transfer=>
  ({situation,model,alternative,why,misconception});
 return {id:r.id,title:r.title,genre:r.genre,units:[r.unit],
  situation:r.situation,purpose:r.purpose,
  paragraphs:r.paragraphs.map(([japanese,german])=>({japanese,german})),
  words:[...r.words],grammar:r.grammar,contrast:r.contrast,
  questions:r.questions.map(([kind,question,model,alternative,misconception,explanation,evidence],index)=>
    ({id:r.id+"-q"+(index+1),kind,question,model,alternative,misconception,explanation,evidence})),
  writing:unpack(r.writing),returnCue:unpack(r.returnCue)};
}
