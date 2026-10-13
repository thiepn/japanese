/** P49 original, practical A1–A2 document material, not real-world institutional guidance. */
export type P49Level="A1"|"A2";
export type P49Genre="menu"|"notice"|"timetable"|"form"|"ticket"|"invitation"|"message"|"advertisement"|"instructions"|"public-info";
export type P49QuestionKind="locate"|"condition"|"inference";
export interface P49Word {form:string;reading:string;meaning:string;context:string;}
export interface P49Question {
 id:string;kind:P49QuestionKind;question:string;model:string;alternative:string;
 trap:string;explanation:string;evidence:string;
}
export interface P49Task {instruction:string;model:string;alternative:string;trap:string;explanation:string;}
export interface P49Document {
 id:string;genre:P49Genre;level:P49Level;units:readonly string[];
 title:string;purpose:string;audience:string;issuer:string;
 blocks:readonly string[];terms:readonly P49Word[];questions:readonly P49Question[];
 contextNote:string;writing:P49Task;returnCue:P49Task;
}
export type P49RawWord=readonly [form:string,reading:string,meaning:string,context:string];
export type P49RawQuestion=readonly [
 kind:P49QuestionKind,question:string,model:string,alternative:string,
 trap:string,explanation:string,evidence:string
];
export type P49RawTask=readonly [
 instruction:string,model:string,alternative:string,trap:string,explanation:string
];
export interface P49RawDocument {
 id:string;genre:P49Genre;level:P49Level;units:readonly string[];
 title:string;purpose:string;audience:string;issuer:string;
 blocks:readonly string[];terms:readonly P49RawWord[];
 questions:readonly P49RawQuestion[];contextNote:string;
 writing:P49RawTask;returnCue:P49RawTask;
}
const task=([instruction,model,alternative,trap,explanation]:P49RawTask):P49Task=>
 ({instruction,model,alternative,trap,explanation});
export function authoredP49Document(raw:P49RawDocument):P49Document {
 return {...raw,terms:raw.terms.map(([form,reading,meaning,context])=>({
  form,reading,meaning,context
 })),questions:raw.questions.map(([kind,question,model,alternative,trap,explanation,evidence],i)=>({
  id:raw.id+"-q"+(i+1),kind,question,model,alternative,trap,explanation,evidence
 })),writing:task(raw.writing),returnCue:task(raw.returnCue)};
}
