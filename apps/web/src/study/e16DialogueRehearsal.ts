import type { E06CaseProgress } from "./e06IndependentCourse";
import { eligibleE14Cases } from "./e14ListeningHandoff";
import { E11_BY_CASE } from "./e11PracticalTransfer";
import { E11_RESPONSE_BY_CASE } from "./e11ResponseMissions";

/**
 * E16 is an ephemeral, turn-by-turn listening and shadowing companion for the
 * EXISTING seven E11 original practical dialogues. Every line, intention,
 * correction and contextual reply question must originate in that source.
 * The native E14 StudyPlayer owns submitted optional StudyEvents and graders.
 */
export interface E16OriginalTurn {
  readonly sourceTurnIndex:number;
  readonly speaker:string;
  readonly japanese:string;
  readonly english:string;
  readonly intention:string;
  readonly replyDecision:Readonly<{question:string;sourceAnswer:boolean}>|null;
}
export interface E16OriginalConversation {
  readonly caseId:string;
  readonly caseTitle:string;
  readonly level:"A1"|"A2";
  readonly goal:string;
  readonly setting:string;
  readonly caution:string;
  readonly pragmaticDecision:string;
  readonly writingAudience:string;
  readonly originalNotice:Readonly<{title:string;japanese:string;english:string}>;
  readonly turns:readonly E16OriginalTurn[];
  readonly originalDecisionQuestions:readonly string[];
}
export type E16RehearsalMode="listen-first"|"shadow-and-reply";
export const E16_REHEARSAL_MODES:readonly {id:E16RehearsalMode;label:string;description:string}[]=[
  {id:"listen-first",label:"Listen before reading",description:"Hear each source line before revealing Japanese, meaning and intent."},
  {id:"shadow-and-reply",label:"Shadow and respond",description:"Hear a turn, attempt its Japanese aloud or privately in text, then reveal the original line."},
];

export function availableE16Dialogues(cases:readonly E06CaseProgress[]):E06CaseProgress[]{
  return eligibleE14Cases(cases).filter(c=>E11_BY_CASE.has(c.id)&&E11_RESPONSE_BY_CASE.has(c.id));
}

export function buildE16OriginalConversation(
  caseId:string,
  cases:readonly E06CaseProgress[],
):E16OriginalConversation{
  const caseInfo=availableE16Dialogues(cases).find(c=>c.id===caseId);
  if(!caseInfo||!caseInfo.canonicalUnitId||!caseInfo.canDoId)
    throw Error("E16_SOURCE_PREREQUISITES_REQUIRED:"+caseId);
  const original=E11_BY_CASE.get(caseId);
  const choices=E11_RESPONSE_BY_CASE.get(caseId);
  if(!original||!choices||choices.decisions.length!==2||original.turns.length<3)
    throw Error("E16_ORIGINAL_DIALOGUE_MISSING:"+caseId);

  // A question is anchored to one exact original turn, never generated from
  // another situation or a guessed branch of the dialogue.
  const counts=new Map<number,number>();
  for(const choice of choices.decisions){
    if(!Number.isInteger(choice.correctTurn)||!original.turns[choice.correctTurn])
      throw Error("E16_ORIGINAL_RESPONSE_INDEX_INVALID:"+caseId);
    for(const alternate of choice.contrastTurns){
      if(!Number.isInteger(alternate)||!original.turns[alternate]||alternate===choice.correctTurn)
        throw Error("E16_ORIGINAL_RESPONSE_CONTRAST_INVALID:"+caseId);
    }
    counts.set(choice.correctTurn,(counts.get(choice.correctTurn)??0)+1);
  }
  if([...counts.values()].some(n=>n!==1))throw Error("E16_DUPLICATE_ORIGINAL_RESPONSE_TURN:"+caseId);

  return Object.freeze({
    caseId,caseTitle:caseInfo.title,level:caseInfo.level,goal:original.goal,
    setting:original.setting,caution:original.grammar.mistake,
    pragmaticDecision:original.pragmaticDecision,writingAudience:original.writingAudience,
    originalNotice:Object.freeze({
      title:original.reading.title,japanese:original.reading.ja,english:original.reading.en,
    }),
    originalDecisionQuestions:choices.decisions.map(c=>c.question),
    turns:original.turns.map((turn,i)=>Object.freeze({
      sourceTurnIndex:i,speaker:turn.speaker,japanese:turn.ja,english:turn.en,
      intention:turn.intent,
      replyDecision:choices.decisions.find(c=>c.correctTurn===i)
        ?Object.freeze({question:choices.decisions.find(c=>c.correctTurn===i)!.question,sourceAnswer:true})
        :null,
    })),
  });
}

/** Local-only screen state. Text is deliberately never sent to StudyEvents. */
export function normalizeE16Scratch(text:string):string {
  return text.slice(0,1200);
}

/** No correctness claim: the original words are a comparison aid, not a grade. */
export function e16SourceComparison(original:E16OriginalTurn,scratch:string):Readonly<{
  originalLine:string;translation:string;intent:string;comparisonNote:string;
}>{
  return {
    originalLine:original.japanese,translation:original.english,intent:original.intention,
    comparisonNote:scratch.trim()
      ?"Compare your own wording with the original speaker's intention, time, location and politeness. No speech recognition or semantic score was performed."
      :"Listen once more, then try to say the original speaker's intention in Japanese. Revealing the source is not a completed graded exercise.",
  };
}
