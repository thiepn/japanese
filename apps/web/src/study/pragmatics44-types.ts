/** First-party Japanese pragmatic contrasts. No user state, new scheduler or semantic grader. */
export type P44Focus="politeness"|"request"|"invitation"|"refusal"|"apology"|"repair"|"hesitation"|"disagreement"|"empathy"|"response";
export interface P44Case{
 id:string;focus:P44Focus;level:"A1"|"A2";unitIds:readonly string[];
 title:string;relationship:string;setting:string;register:"polite"|"casual";
 context:string;partner:string;intention:string;
 model:string;alternative:string;misleading:string;misconception:string;
 nuance:string;partnerFollowup:string;followupTask:string;
 followupModel:string;followupAlternative:string;followupMisstep:string;
 followupWhy:string;returnTask:string;returnModel:string;returnAlternative:string;
 returnMisstep:string;returnWhy:string;
}
export type P44Raw=readonly [
 id:string,focus:P44Focus,level:"A1"|"A2",unitIds:readonly string[],
 title:string,relationship:string,setting:string,register:"polite"|"casual",
 context:string,partner:string,intention:string,
 model:string,alternative:string,misleading:string,misconception:string,
 nuance:string,partnerFollowup:string,followupTask:string,
 followupModel:string,followupAlternative:string,followupMisstep:string,
 followupWhy:string,returnTask:string,returnModel:string,returnAlternative:string,
 returnMisstep:string,returnWhy:string
];
