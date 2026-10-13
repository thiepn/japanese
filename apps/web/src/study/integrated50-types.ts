/** P50: first-party integrated written and spoken Japanese; no publisher excerpts or audio blobs. */
export type P50Level="A1"|"A2";
export type P50Genre="travel"|"service"|"social"|"study"|"community"|"work"|"shopping";
export type P50Reason="detail"|"correction"|"inference";
export interface P50Line{speaker:string;japanese:string;german:string;}
export interface P50Evidence{modality:"reading"|"listening";excerpt:string;purpose:string;}
export interface P50Question{
 id:string;reason:P50Reason;question:string;model:string;alternative:string;
 misconception:string;feedback:string;evidence:readonly P50Evidence[];
}
export interface P50Task{
 instruction:string;model:string;alternative:string;misconception:string;feedback:string;
}
export interface P50Mission {
 id:string;title:string;level:P50Level;genre:P50Genre;units:readonly string[];
 situation:string;goal:string;readLabel:string;readGenre:string;
 reading:readonly string[];readingGerman:string;spokenContext:string;
 listening:readonly P50Line[];questions:readonly P50Question[];
 vocabulary:readonly {form:string;reading:string;meaning:string;source:string}[];
 writing:P50Task;transfer:P50Task;pedagogy:string;
}
export type P50RawLine=readonly [speaker:string,japanese:string,german:string];
export type P50RawEvidence=readonly [modality:"reading"|"listening",excerpt:string,purpose:string];
export type P50RawQuestion=readonly [
 reason:P50Reason,question:string,model:string,alternative:string,
 misconception:string,feedback:string,evidence:readonly P50RawEvidence[]
];
export type P50RawWord=readonly [form:string,reading:string,meaning:string,source:string];
export type P50RawTask=readonly [
 instruction:string,model:string,alternative:string,misconception:string,feedback:string
];
export interface P50RawMission{
 id:string;title:string;level:P50Level;genre:P50Genre;units:readonly string[];
 situation:string;goal:string;readLabel:string;readGenre:string;
 reading:readonly string[];readingGerman:string;spokenContext:string;
 listening:readonly P50RawLine[];questions:readonly P50RawQuestion[];
 vocabulary:readonly P50RawWord[];writing:P50RawTask;transfer:P50RawTask;pedagogy:string;
}
const task=([instruction,model,alternative,misconception,feedback]:P50RawTask):P50Task=>({
 instruction,model,alternative,misconception,feedback
});
export function authoredP50Mission(raw:P50RawMission):P50Mission{
 return {...raw,
  listening:raw.listening.map(([speaker,japanese,german])=>({speaker,japanese,german})),
  questions:raw.questions.map(([reason,question,model,alternative,misconception,feedback,evidence],i)=>({
   id:raw.id+"-q"+(i+1),reason,question,model,alternative,misconception,feedback,
   evidence:evidence.map(([modality,excerpt,purpose])=>({modality,excerpt,purpose}))
  })),
  vocabulary:raw.vocabulary.map(([form,reading,meaning,source])=>({form,reading,meaning,source})),
  writing:task(raw.writing),transfer:task(raw.transfer)
 };
}
