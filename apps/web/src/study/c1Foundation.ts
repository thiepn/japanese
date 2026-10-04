import type { StudyLesson,StudyPrompt,StudyStep } from "@thiepn/study-player";
import { coreContent,sentenceRecord } from "../coreContent";

export type C1DiscourseMoveId=
  |"evidence-inference"
  |"qualification"
  |"causality"
  |"synthesis"
  |"counterargument"
  |"register"
  |"implication"
  |"accountability";

export interface C1DiscourseMove {
  id:C1DiscourseMoveId;
  label:string;
  description:string;
}

export const c1DiscourseMoves:C1DiscourseMove[]=[
  {id:"evidence-inference",label:"Evidence ≠ inference",description:"Separate what the source directly supports from the interpretation built on top of it."},
  {id:"qualification",label:"Calibrated certainty",description:"State caveats, limits and provisional conclusions without becoming vague."},
  {id:"causality",label:"Causal restraint",description:"Distinguish correlation, plausible mechanism and evidence sufficient for a causal claim."},
  {id:"synthesis",label:"Multi-source synthesis",description:"Combine competing evidence into one structured position rather than listing points independently."},
  {id:"counterargument",label:"Precise counterargument",description:"Acknowledge the strongest opposing point, narrow the disagreement and answer the actual claim."},
  {id:"register",label:"Register control",description:"Match rhetorical force, formality and directness to audience and purpose."},
  {id:"implication",label:"Implication tracking",description:"Explain what follows from evidence while keeping assumptions visible."},
  {id:"accountability",label:"Decision accountability",description:"Connect recommendations to constraints, implementation responsibility and review criteria."}
];

interface PromptDefinition {
  id:string;
  move:C1DiscourseMoveId;
  sentenceId:string;
  instruction:string;
  prompt:string;
  answer:string;
  distractors:string[];
  explanation:string;
}

const DEFINITIONS:PromptDefinition[]=[
  {
    id:"p12-discourse-evidence-vs-inference",
    move:"evidence-inference",
    sentenceId:"p12-text-causality-s1",
    instruction:"Choose the most defensible interpretation.",
    prompt:"大規模な調査といえども、相関だけで因果関係を確定することはできない。",
    answer:"The study can show association, but causality needs additional evidence.",
    distractors:["A large study automatically proves causality.","Correlation and causality are interchangeable.","The study should be ignored because it has limits."],
    explanation:"C1 control requires preserving what the evidence supports while refusing a stronger causal inference."
  },
  {
    id:"p12-discourse-qualified-conclusion",
    move:"qualification",
    sentenceId:"p12-text-policy-evidence-s6",
    instruction:"Choose the conclusion with the right strength.",
    prompt:"全面的な制度変更には至らないまでも、暫定的な対応策を導入する余地はある。",
    answer:"Full reform is not established, but a provisional measure is still justified.",
    distractors:["The evidence proves full reform is necessary.","Nothing can be done until certainty is complete.","The current system has already been disproven."],
    explanation:"The sentence preserves a useful weaker claim without pretending the stronger claim is established."
  },
  {
    id:"p12-discourse-multiple-causes",
    move:"causality",
    sentenceId:"p12-text-ai-judgment-s3",
    instruction:"Identify the causal structure.",
    prompt:"出力の曖昧性が担当者の過度な信頼と相まって、誤った判断につながる可能性がある。",
    answer:"Two interacting factors are presented as jointly increasing risk.",
    distractors:["Only the system output is presented as causal.","The sentence proves a single deterministic cause.","The sentence says staff trust removes ambiguity."],
    explanation:"〜と相まって presents interacting factors rather than a single isolated cause."
  },
  {
    id:"p12-discourse-synthesis",
    move:"synthesis",
    sentenceId:"p12-text-climate-transition-s6",
    instruction:"Choose the best synthesis move.",
    prompt:"複数の地域事例を踏まえて、対応策を一律ではなく段階的に実施することが望ましい。",
    answer:"Use several cases to justify a staged recommendation rather than a uniform one.",
    distractors:["List the regional cases without reaching a recommendation.","Treat one region as representative of every region.","Ignore implementation conditions once a goal is accepted."],
    explanation:"Synthesis links several sources to a qualified, implementable recommendation."
  },
  {
    id:"p12-discourse-counterargument-grounding",
    move:"counterargument",
    sentenceId:"p12-text-editorial-argument-s5",
    instruction:"Choose the strongest disagreement strategy.",
    prompt:"相手の意図ではなく実際の発言に即して反論すれば、不必要な二極化を避けやすい。",
    answer:"Respond to the opponent's actual claim rather than attributing motives.",
    distractors:["Attack the presumed motive behind the claim.","Increase rhetorical force until the disagreement is clear.","Avoid engaging the opposing view at all."],
    explanation:"Precise rebuttal narrows disagreement to what was actually stated."
  },
  {
    id:"p12-discourse-formal-register",
    move:"register",
    sentenceId:"p12-text-transparency-s5",
    instruction:"Choose the best formal emphasis.",
    prompt:"形式的な公開にもまして、説明の整合性が信頼回復には重要である。",
    answer:"Consistency of explanation is presented as more important than disclosure alone.",
    distractors:["Disclosure and consistency are presented as exactly identical.","The sentence uses casual language to dismiss transparency.","The sentence says disclosure has no relevance at all."],
    explanation:"〜にもまして is a formal ranking device that strengthens one priority without erasing the comparison point."
  },
  {
    id:"p12-discourse-implication",
    move:"implication",
    sentenceId:"p12-text-policy-evidence-s5",
    instruction:"Identify what the observation implies.",
    prompt:"地域間の乖離は、単一の評価基準では実態を捉えきれないことの表れにほかならない。",
    answer:"Regional divergence is interpreted as evidence that one criterion may be insufficient.",
    distractors:["Regional divergence proves all criteria are useless.","The sentence contains no interpretation beyond the observation.","The sentence says every region must use the same criterion."],
    explanation:"The discourse move makes an interpretation explicit; it should still be distinguished from the observed gap itself."
  },
  {
    id:"p12-discourse-accountability",
    move:"accountability",
    sentenceId:"p12-text-transparency-s4",
    instruction:"Choose the accountability scope.",
    prompt:"方針の策定から実施後の検証に至るまで、説明責任を一貫させる必要がある。",
    answer:"Accountability should extend across the whole decision and implementation cycle.",
    distractors:["Accountability is needed only after failure.","Accountability ends once implementation starts.","Only the policy-design stage requires explanation."],
    explanation:"〜に至るまで expands responsibility across an entire process."
  },
  {
    id:"p12-discourse-standard-vs-context",
    move:"evidence-inference",
    sentenceId:"p12-text-urban-resilience-s1",
    instruction:"Choose the contextual reading.",
    prompt:"地域の実情と予算上の制約に即して、災害対応の優先順位を調整する必要がある。",
    answer:"The recommendation should be adapted to concrete local conditions and constraints.",
    distractors:["The same priority order should be imposed everywhere.","Budget constraints should replace evidence entirely.","Local conditions are mentioned only rhetorically."],
    explanation:"〜に即して ties the recommendation closely to actual conditions rather than an abstract universal template."
  },
  {
    id:"p12-discourse-expert-limit",
    move:"qualification",
    sentenceId:"p12-text-policy-evidence-s4",
    instruction:"Choose the epistemically careful reading.",
    prompt:"専門家といえども、限られたデータから断定的な結論を出すべきではない。",
    answer:"Expert status does not remove the need to qualify conclusions when evidence is limited.",
    distractors:["Experts can make categorical claims without evidence.","Limited evidence makes expert analysis worthless.","Expert status is irrelevant to all forms of judgment."],
    explanation:"The concession limits authority without dismissing expertise."
  },
  {
    id:"p12-discourse-rhetoric-evidence",
    move:"register",
    sentenceId:"p12-text-editorial-argument-s6",
    instruction:"Identify the deliberative move.",
    prompt:"熟議を成立させるべく、修辞と根拠を切り分け、どこに留保が必要かを明示する。",
    answer:"Separate persuasive language from evidence and state where caveats are needed.",
    distractors:["Treat rhetorical strength as evidence.","Avoid stating uncertainty so the argument sounds stronger.","Remove all disagreement before discussion starts."],
    explanation:"Advanced discourse control separates evidential support from rhetorical force."
  },
  {
    id:"p12-discourse-feasibility",
    move:"accountability",
    sentenceId:"p12-text-urban-resilience-s6",
    instruction:"Choose the implementation priority.",
    prompt:"効率にもまして、脆弱な住民に支援が届く実現可能性を重視すべきだ。",
    answer:"Practical ability to reach vulnerable residents should outrank efficiency alone.",
    distractors:["Efficiency is the only implementation criterion.","Feasibility is irrelevant if the policy goal is good.","The sentence argues against helping vulnerable residents."],
    explanation:"C1 recommendations should connect values to feasibility rather than stopping at abstract preference."
  }
];

export const c1DiscoursePrompts:StudyPrompt[]=DEFINITIONS.map((definition,index)=>{
  const sentence=sentenceRecord(definition.sentenceId);
  return {
    id:definition.id,
    primaryTarget:{kind:"sentence",id:definition.sentenceId},
    skill:"comprehension",
    cueFamily:"c1-discourse-"+definition.move,
    promptType:"choice",
    instruction:definition.instruction,
    prompt:definition.prompt,
    promptLanguage:"ja",
    choices:rotate([definition.answer,...definition.distractors],index),
    acceptedAnswers:[definition.answer],
    displayAnswer:definition.answer,
    explanation:definition.explanation,
    contextId:"c1-foundation-"+definition.move,
    sourceId:sentence.sourceIds[0]??"thiepn-original",
    contentVersion:coreContent.version,
    activity:"assessment",
    eventMetadata:{
      p12C1Foundation:true,
      discourseMove:definition.move,
      diagnosticOnly:true,
      accreditedCefrVerdict:false
    }
  };
});

export function c1FoundationPractice(limit=12):StudyStep[]{
  const prompts=c1DiscoursePrompts.slice(0,Math.max(1,Math.min(limit,c1DiscoursePrompts.length)));
  const intro:StudyLesson={
    kind:"lesson",
    id:"p12-c1-foundation-intro",
    title:"C1 foundation · discourse control",
    body:"P12 shifts the target from simply knowing more forms to controlling evidence, qualification, synthesis, counterargument, implication and register across complex discourse. This practice records normal learner evidence but is not an accredited CEFR judgment.",
    contextId:"c1-foundation",
    facts:[
      {label:"Discourse moves",value:String(c1DiscourseMoves.length)},
      {label:"Practice prompts",value:String(prompts.length)},
      {label:"Evidence boundary",value:"internal practice · no CEFR certification"}
    ],
    sourceLabel:"THIEPN Japanese P12 C1 foundation"
  };
  return [intro,...prompts];
}

export function getC1FoundationOverview(){
  return {
    grammar:coreContent.grammar.filter((item)=>item.level==="C1").length,
    sentences:coreContent.sentences.filter((item)=>item.level==="C1").length,
    lexicalChunks:coreContent.lexicalChunks.filter((item)=>item.level==="C1").length,
    courseUnits:coreContent.courseUnits.filter((item)=>item.level==="C1").length,
    readingTexts:coreContent.readingTexts.filter((item)=>item.level==="C1").length,
    productiveTasks:coreContent.productiveTasks.filter((item)=>item.level==="C1").length,
    discourseMoves:c1DiscourseMoves.length,
    discoursePrompts:c1DiscoursePrompts.length
  };
}

function rotate<T>(items:T[],seed:number):T[]{
  if(!items.length)return [];
  const offset=seed%items.length;
  return [...items.slice(offset),...items.slice(0,offset)];
}
