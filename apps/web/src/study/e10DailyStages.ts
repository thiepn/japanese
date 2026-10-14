/**
 * E10: lesson boundaries, NOT a scheduler, grader, store or new Can-do.
 * Sections slice the existing E06–E09 StudyStep list by its original lesson
 * identities. No original prompt ID changes or synthetic completion events.
 */
export const E10_DAILY_STAGES=[
 {id:"listen-read",label:"Listen and understand",purpose:"Listen without the transcript, then resolve meaning using the separate original notice.",start:"set-up",end:"interact",keys:["listen","read"],kind:"controlled"},
 {id:"respond",label:"Respond without choices",purpose:"Use the original conversation to negotiate, then retrieve an expression independently.",start:"interact",end:"e08-change",keys:["negotiate","recall"],kind:"controlled"},
 {id:"second-context",label:"A changed conversation",purpose:"Apply Japanese to different people, a new listening conversation and an independently written notice.",start:"e08-change",end:"e09-setup",keys:["e08-context-listen","e08-context-read"],kind:"controlled"},
 {id:"third-context",label:"Compare a third situation",purpose:"Notice lexical, grammatical and pragmatic contrasts across a fresh conversation and separate reading.",start:"e09-setup",end:"production",keys:["e09-dialogue-listen","e09-notice-read"],kind:"controlled"},
 {id:"first-draft",label:"Write your first answer",purpose:"Write independently for the original practical audience. Structural checks are not a language grade.",start:"production",end:"e08-revision-coach",keys:["write"],kind:"unscored"},
 {id:"revise",label:"Revise your own Japanese",purpose:"Compare your first text against specific audience, meaning and politeness questions. Submit a distinct second draft.",start:"e08-revision-coach",end:"e08-oral-transfer",keys:["e08-second-draft"],kind:"unscored"},
 {id:"speak",label:"Optional role-play",purpose:"Practise original and changed-role speech without relying on a transcript or acoustic score.",start:"e08-oral-transfer",end:"e09-independent",keys:["speak","e08-roleplay"],kind:"optional"},
 {id:"different-audience",label:"Write for someone new",purpose:"Solve the final different-audience problem in your own Japanese and self-review what remains unclear.",start:"e09-independent",end:null,keys:["e09-original-response"],kind:"unscored"}
] as const;
export type E10StageId=(typeof E10_DAILY_STAGES)[number]["id"];
export type E10StageKind=(typeof E10_DAILY_STAGES)[number]["kind"];
export type E10StageStatus="locked"|"ready"|"started"|"complete";
export interface E10StageProgress{
 id:E10StageId;title:string;purpose:string;kind:E10StageKind;
 status:E10StageStatus;answered:number;required:number;
}
export function e10StageById(id:string){
 return E10_DAILY_STAGES.find(s=>s.id===id);
}


/** Delayed transfer preserves each existing E06/E08/E09 prompt ID. */
export const E10_DELAYED_GROUPS=[
 {id:"original-change",label:"First changed situation",purpose:"New people, new listening and reading, plus bounded Japanese recall.",keys:["delayed-listen","delayed-read","delayed-recall"]},
 {id:"second-change",label:"Second changed situation",purpose:"Read and listen to the independently authored E08 transfer scenario.",keys:["e08-delayed-listen","e08-delayed-read"]},
 {id:"third-change",label:"Third changed situation",purpose:"Distinguish another everyday problem and its written constraints.",keys:["e09-delayed-listen","e09-delayed-read"]}
] as const;
export type E10DelayedId=(typeof E10_DELAYED_GROUPS)[number]["id"];
export interface E10DelayedProgress{
 id:E10DelayedId;title:string;purpose:string;
 status:E10StageStatus;correct:number;required:number;
}
