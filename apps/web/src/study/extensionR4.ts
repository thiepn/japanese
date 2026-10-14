import type {R4Case} from "./extensionR4-types";
import {r4CasesA} from "./extensionR4-corpus-a";
import {r4CasesB} from "./extensionR4-corpus-b";
import {r4CasesC} from "./extensionR4-corpus-c";
import {r4CasesD} from "./extensionR4-corpus-d";
export type {R4Case,R4Line,R4Transfer,R4Evidence} from "./extensionR4-types";
/** Sixteen distinct first-party case extensions of existing P60 lesson identities.
 * Not a new course grading engine, assessment or return scheduler.
 */
export const r4Cases:readonly R4Case[]=[
 ...r4CasesA,...r4CasesB,...r4CasesC,...r4CasesD
];
const byLesson=new Map(r4Cases.map(c=>[c.p60Id,c]));
export const r4ForP60=(id:string):R4Case|undefined=>byLesson.get(id);
export const r4RelatedP60Ids=():readonly string[]=>r4Cases.map(c=>c.p60Id);
