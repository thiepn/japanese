/** P48 source-authored cross-document reading/listening synthesis; never a storage authority. */
export type P48Level="A1"|"A2";
export type P48Medium="message"|"notice"|"schedule"|"email"|"spoken"|"voicemail"|"reading"|"announcement";
export type P48QuestionKind="reconcile"|"inference"|"evidence";
export interface P48Source{
 id:string;label:string;medium:P48Medium;sequence:number;
 japanese:string;german:string;context:string;
}
export interface P48Question{
 id:string;kind:P48QuestionKind;question:string;
 model:string;alternative:string;misconception:string;feedback:string;
 evidence:readonly {sourceId:string;excerpt:string;role:string}[];
}
export interface P48Task{
 instruction:string;model:string;alternative:string;misconception:string;feedback:string;
}
export interface P48Case{
 id:string;title:string;level:P48Level;units:readonly string[];domain:string;
 goal:string;setup:string;sourceNotes:string;
 sources:readonly P48Source[];questions:readonly P48Question[];
 writing:P48Task;returnCue:P48Task;
}
export type P48RawSource=readonly [
 label:string,medium:P48Medium,sequence:number,japanese:string,german:string,context:string
];
export type P48RawEvidence=readonly [sourceIndex:number,excerpt:string,role:string];
export type P48RawQuestion=readonly [
 kind:P48QuestionKind,question:string,model:string,alternative:string,
 misconception:string,feedback:string,evidence:readonly P48RawEvidence[]
];
export type P48RawTask=readonly [
 instruction:string,model:string,alternative:string,misconception:string,feedback:string
];
export interface P48RawCase{
 id:string;title:string;level:P48Level;units:readonly string[];
 domain:string;goal:string;setup:string;sourceNotes:string;
 sources:readonly P48RawSource[];questions:readonly P48RawQuestion[];
 writing:P48RawTask;returnCue:P48RawTask;
}
const task=([instruction,model,alternative,misconception,feedback]:P48RawTask):P48Task=>
 ({instruction,model,alternative,misconception,feedback});
export function authoredP48Case(raw:P48RawCase):P48Case{
 const sources=raw.sources.map(([label,medium,sequence,japanese,german,context],i)=>({
   id:raw.id+"-source-"+(i+1),label,medium,sequence,japanese,german,context
 }));
 return {...raw,sources,questions:raw.questions.map(
   ([kind,question,model,alternative,misconception,feedback,evidence],i)=>({
     id:raw.id+"-q"+(i+1),kind,question,model,alternative,misconception,feedback,
     evidence:evidence.map(([sourceIndex,excerpt,role])=>({
       sourceId:sources[sourceIndex]!.id,excerpt,role
     }))
   })
 ),writing:task(raw.writing),returnCue:task(raw.returnCue)};
}
