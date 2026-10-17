import { E11_TRANSFER } from "./e11PracticalTransfer";

/**
 * Fourteen new, original role-response decisions grounded in the exact
 * E11 seven-case dialogue turns. These are optional pragmatic rehearsals:
 * choosing a supplied line is not evidence of independent Japanese speaking
 * or new canonical Can-do mastery.
 *
 * Turn indices are anchored to E11's existing original dialog source; no
 * third-party Marugoto/recorded voice transcript is imported or relabelled.
 */
export type E11ResponseCue = Readonly<{
  question: string;
  correctTurn: number;
  contrastTurns: readonly [number, number];
}>;
export type E11ResponseMission = Readonly<{
  caseId: string;
  decisions: readonly [E11ResponseCue, E11ResponseCue];
}>;

export const E11_RESPONSE_MISSIONS: readonly E11ResponseMission[] = [
  {
    caseId: "introduce-and-find-help",
    decisions: [
      {question:"Before directing a guest to reception, which question distinguishes two events with the same name?",
       correctTurn:1,contrastTurns:[0,3]},
      {question:"The guest now confirms the 18:00 session. Which reply gives its actual entrance rather than the morning desk?",
       correctTurn:3,contrastTurns:[1,4]},
    ],
  },
  {
    caseId: "origin-family-and-plans",
    decisions: [
      {question:"A friend mistakenly assumes a temporary stay is a change of residence. Which response corrects both locations?",
       correctTurn:1,contrastTurns:[0,2]},
      {question:"The Sunday meeting must be unambiguous. Which reply confirms an exact time and station entrance?",
       correctTurn:4,contrastTurns:[2,3]},
    ],
  },
  {
    caseId: "cafe-and-shopping",
    decisions: [
      {question:"The customer wants three notebooks, not the earlier two. Which response actually changes the order?",
       correctTurn:1,contrastTurns:[0,2]},
      {question:"The register still shows the old total. Which Japanese line politely requests verification of the mismatch?",
       correctTurn:3,contrastTurns:[2,4]},
    ],
  },
  {
    caseId: "meeting-replan",
    decisions: [
      {question:"A substitute club room has been suggested but not booked. Which line correctly states its provisional status?",
       correctTurn:2,contrastTurns:[1,4]},
      {question:"How can a club member request a verified group update instead of treating the suggestion as confirmed?",
       correctTurn:3,contrastTurns:[0,4]},
    ],
  },
  {
    caseId: "order-and-allergy",
    decisions: [
      {question:"The ingredient list has been checked, but shared equipment has not. Which new question requests the missing fact?",
       correctTurn:2,contrastTurns:[0,1]},
      {question:"Equipment information is still unverified. Which action avoids assuming the food is safe?",
       correctTurn:4,contrastTurns:[1,3]},
    ],
  },
  {
    caseId: "service-delay",
    decisions: [
      {question:"The hotel already corrected the bill, but the nonsmoking-room request is unresolved. Which line raises that separate issue?",
       correctTurn:2,contrastTurns:[0,1]},
      {question:"The room type remains unconfirmed. Which reply requests a concrete follow-up after confirmation?",
       correctTurn:4,contrastTurns:[1,3]},
    ],
  },
  {
    caseId: "transport-volunteer",
    decisions: [
      {question:"Reception has a volunteer only until 15:30. Which response asks about the uncovered 15:30–16:00 period?",
       correctTurn:1,contrastTurns:[0,3]},
      {question:"The next volunteer is not confirmed. Which response keeps the handover responsible rather than assuming coverage?",
       correctTurn:4,contrastTurns:[2,3]},
    ],
  },
] as const;

export const E11_RESPONSE_BY_CASE = new Map(E11_RESPONSE_MISSIONS.map(mission=>[mission.caseId,mission]));

export function assertE11ResponseMissionSources(): void {
  const original = new Map(E11_TRANSFER.map(caseRecord=>[caseRecord.caseId,caseRecord]));
  if(E11_RESPONSE_MISSIONS.length!==original.size ||
     E11_RESPONSE_BY_CASE.size!==original.size)
    throw new Error("E11_RESPONSE_SOURCE_COVERAGE_INVALID");
  for(const mission of E11_RESPONSE_MISSIONS){
    const caseRecord=original.get(mission.caseId);
    if(!caseRecord||mission.decisions.length!==2)
      throw new Error("E11_RESPONSE_SOURCE_CASE_MISSING:"+mission.caseId);
    for(const item of mission.decisions){
      const indices=[item.correctTurn,...item.contrastTurns];
      if(!item.question.trim()||new Set(indices).size!==3||
         indices.some(index=>!Number.isInteger(index)||index<0||index>=caseRecord.turns.length)||
         new Set(indices.map(index=>caseRecord.turns[index]!.ja)).size!==3)
        throw new Error("E11_RESPONSE_SOURCE_TURN_INVALID:"+mission.caseId);
    }
  }
}
