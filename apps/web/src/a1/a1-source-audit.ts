import {coreContent} from "../coreContent";
import {a1CommunicationLessons} from "../../../../packages/a1-communication-seed/src/index";
import {scenarios} from "../communication/a1-roleplay-scenarios";
import {A1_LESSONS,a1ManifestErrors} from "./a1-course-contract";

/** Validate refs against the real application source rather than trusting a spreadsheet. */
export function auditA1SourceLinks():string[]{
 const errors=a1ManifestErrors();
 const units=new Map(coreContent.courseUnits.map(unit=>[unit.id,unit]));
 const communications=new Map(a1CommunicationLessons.map(l=>[l.id,l]));
 const roleplays=new Set(scenarios.map(s=>s.id));
 for(const lesson of A1_LESSONS){
  for(const id of lesson.legacyUnitIds){
   const unit=units.get(id);
   if(!unit)errors.push("Missing source unit: "+id);
   else if(unit.level!=="A1")errors.push("Higher-level source linked to A1: "+id);
  }
  for(const id of lesson.communicationLessonIds)if(!communications.has(id))errors.push("Missing communication lesson: "+id);
  for(const id of lesson.roleplayIds)if(!roleplays.has(id))errors.push("Missing roleplay: "+id);
 }
 const coreA1=coreContent.courseUnits.filter(unit=>unit.level==="A1");
 for(const unit of coreA1)if(!A1_LESSONS.some(l=>l.legacyUnitIds.includes(unit.id)))errors.push("Unmapped A1 source unit: "+unit.id);
 for(const lesson of a1CommunicationLessons)if(!A1_LESSONS.some(l=>l.communicationLessonIds.includes(lesson.id)))errors.push("Unmapped communication lesson: "+lesson.id);
 return errors;
}
export function a1CommunicationExerciseCrosswalk():Record<string,string>{
 const ids:Record<string,string>={};
 for(const lesson of a1CommunicationLessons)for(const exercise of lesson.exercises){
  if(ids[exercise.id]&&ids[exercise.id]!==lesson.id)throw new Error("DUPLICATE_A1_EXERCISE_ID:"+exercise.id);
  ids[exercise.id]=lesson.id;
 }
 return ids;
}
/** Audited curriculum quantities, not learner mastery or content-readiness claims. */
export function a1SourceInventory(){
 const units=coreContent.courseUnits.filter(unit=>unit.level==="A1");
 const vocabularyIds=new Set(units.flatMap(unit=>unit.vocabularyIds));
 const grammarIds=new Set(units.flatMap(unit=>unit.grammarIds));
 const sentenceIds=new Set(units.flatMap(unit=>unit.sentenceIds));
 const lexemes=new Map(coreContent.lexemes.map(l=>[l.id,l]));
 const audio=new Set(coreContent.audioAssets.map(a=>a.id));
 return {
  sourceUnits:units.length,communicationLessons:a1CommunicationLessons.length,
  referencedVocabulary:vocabularyIds.size,referencedGrammar:grammarIds.size,
  referencedSentences:sentenceIds.size,
  vocabularyWithLinkedAudio:[...vocabularyIds].filter(id=>lexemes.get(id)?.audioIds.some(aid=>audio.has(aid))).length,
  a1ReadingTexts:coreContent.readingTexts.filter(text=>text.level==="A1").length,
  proposedLessons:A1_LESSONS.length,
  directlyReferencedLessons:A1_LESSONS.filter(l=>l.legacyUnitIds.length+l.communicationLessonIds.length+l.roleplayIds.length>0).length
 };
}

/** Reverse index of source content used by actual StudyEvents.
 * A word or grammar point may belong to several units; all candidates are
 * returned and the crosswalk must report ambiguity rather than award mastery.
 */
export function a1PrimaryTargetCrosswalk():Record<string,readonly string[]>{
 const index:Record<string,string[]>={};
 for(const unit of coreContent.courseUnits.filter(unit=>unit.level==="A1")){
  const refs=[
   ...unit.grammarIds.map(id=>"grammar:"+id),
   ...unit.sentenceIds.map(id=>"sentence:"+id),
   ...unit.vocabularyIds.map(id=>"lexeme:"+id),
   ...(unit.conjugationLexemeIds??[]).map(id=>"lexeme:"+id)
  ];
  for(const ref of refs){
   const existing=index[ref]??[];
   if(!existing.includes(unit.id))existing.push(unit.id);
   index[ref]=existing;
  }
 }
 return index;
}
