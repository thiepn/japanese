/** Authored original Japanese A2 case continuations. Not a new grader, store
 * or FSRS prompt source. Unseen *page-local* case twists are not "FSRS returns".
 */
export interface R4Line {role:string;ja:string;de:string}
export interface R4Evidence {quote:string;meaning:string}
export interface R4Transfer{
 scenario:string;task:string;models:readonly [string,string];trap:string;why:string
}
export interface R4Case {
 id:string;p60Id:string;title:string;purpose:string;register:"polite"|"casual";
 reading:readonly [R4Line,R4Line];spoken:readonly [R4Line,R4Line];
 evidence:readonly [R4Evidence,R4Evidence];
 task:string;models:readonly [string,string];trap:string;
 misconception:string;selfCheck:readonly [string,string,string];
 newMessage:R4Line;followupTask:string;followupModels:readonly [string,string];
 followupTrap:string;followupRepair:string;
 transfer:R4Transfer;
}
/** Retain first-party provenance; no publisher lesson or audio imported. */
export const r4CaseForLesson=(cases:readonly R4Case[],id:string)=>
 cases.find(c=>c.p60Id===id);
