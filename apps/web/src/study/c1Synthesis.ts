import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents } from "@thiepn/local-db";
import type { StudyLesson,StudyPrompt,StudyStep } from "@thiepn/study-player";
import { coreContent,readingText } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID } from "./runtime";

export type C1SynthesisMode="writing"|"speaking";

export interface C1SynthesisPack {
  id:string;
  title:string;
  domain:string;
  description:string;
  mode:C1SynthesisMode;
  sourceTextIds:string[];
  question:string;
  requiredMoves:string[];
  requiredTerms:string[];
  minimumCharacters:number;
  modelOutline:string;
}

export interface C1SynthesisPackProgress {
  pack:C1SynthesisPack;
  attempts:number;
  structurallyComplete:number;
  lastAttemptAt?:string;
}

const C1_SYNTHESIS_PACKS:C1SynthesisPack[]=[
  {
    id:"p13-synthesis-evidence-causality",
    title:"Evidence, causality and justified conclusions",
    domain:"research + policy",
    description:"Reconcile policy evidence with causal uncertainty and decide what can responsibly be concluded.",
    mode:"writing",
    sourceTextIds:["p12-text-policy-evidence","p12-text-causality","p12-text-transparency"],
    question:"Using all three sources, write a qualified conclusion about when evidence is strong enough to justify institutional action. Separate observation, interpretation, causal uncertainty and accountability.",
    requiredMoves:["separate evidence from inference","state at least one caveat","connect the conclusion to accountability"],
    requiredTerms:["留保","因果","説明責任"],
    minimumCharacters:210,
    modelOutline:"Evidence → alternative interpretation → causal limit → decision threshold → accountability condition."
  },
  {
    id:"p13-synthesis-automation-accountability",
    title:"Automation, judgment and accountability",
    domain:"technology + institutions",
    description:"Combine automation risk, institutional transparency and implementation responsibility.",
    mode:"speaking",
    sourceTextIds:["p12-text-ai-judgment","p12-text-transparency"],
    question:"Brief a decision maker on how automation should be governed. Compare the two texts, identify a shared concern, and recommend one safeguard without claiming that automation itself is either sufficient or unacceptable.",
    requiredMoves:["compare the two sources","name a concrete safeguard","qualify the recommendation"],
    requiredTerms:["透明性","説明責任","判断"],
    minimumCharacters:105,
    modelOutline:"Shared concern → contrast → safeguard → implementation responsibility → caveat."
  },
  {
    id:"p13-synthesis-local-policy",
    title:"Local autonomy under shared constraints",
    domain:"community + education + resilience",
    description:"Synthesize local adaptation, vulnerable groups and institutional autonomy into a practical policy position.",
    mode:"writing",
    sourceTextIds:["p12-text-urban-resilience","p12-text-education-autonomy","p12-text-climate-transition"],
    question:"Design a policy principle that can work across all three domains. Explain what should remain common, what should adapt locally, and how unequal burdens should be handled.",
    requiredMoves:["identify a shared principle","distinguish common standards from local adaptation","address distributional burden"],
    requiredTerms:["実情","分配","持続可能性"],
    minimumCharacters:220,
    modelOutline:"Shared objective → local constraints → distributional consequence → staged implementation → review criterion."
  },
  {
    id:"p13-synthesis-public-argument",
    title:"Public disagreement without false certainty",
    domain:"media + governance",
    description:"Combine rhetorical restraint with institutional transparency and precise counterargument.",
    mode:"speaking",
    sourceTextIds:["p12-text-editorial-argument","p12-text-transparency","p12-text-policy-evidence"],
    question:"Respond to a polarized public claim. Use the three sources to distinguish rhetoric from evidence, acknowledge one legitimate concern and narrow the actual disagreement.",
    requiredMoves:["separate rhetoric and evidence","make a concession","state the remaining disagreement precisely"],
    requiredTerms:["根拠","譲歩","論点"],
    minimumCharacters:110,
    modelOutline:"Strongest opposing point → evidence check → concession → narrowed disagreement → qualified position."
  },
  {
    id:"p13-synthesis-tradeoff",
    title:"Feasibility, sustainability and unequal costs",
    domain:"implementation + trade-offs",
    description:"Integrate feasibility, long-term consequences and distributional effects instead of optimizing one criterion.",
    mode:"writing",
    sourceTextIds:["p12-text-climate-transition","p12-text-ai-judgment","p12-text-urban-resilience"],
    question:"Write an integrated recommendation that explicitly balances feasibility, sustainability, distributional burden and the need for later review.",
    requiredMoves:["weigh at least three criteria","name a distributional risk","include a review condition"],
    requiredTerms:["実現可能性","持続可能性","負担"],
    minimumCharacters:220,
    modelOutline:"Criteria → trade-off → affected group → feasible staged action → review trigger."
  },
  {
    id:"p13-synthesis-perspective-transfer",
    title:"Transfer one framework across domains",
    domain:"cross-domain reasoning",
    description:"Take one analytical framework from a source and test whether it survives transfer into a different domain.",
    mode:"speaking",
    sourceTextIds:["p12-text-causality","p12-text-education-autonomy","p12-text-editorial-argument"],
    question:"Choose one analytical principle that appears useful across the three sources. Explain how it transfers, where it stops working, and what must change when the domain changes.",
    requiredMoves:["identify a transferable principle","test it in a second domain","state a limit to transfer"],
    requiredTerms:["前提","解釈","限界"],
    minimumCharacters:110,
    modelOutline:"Principle → first-domain meaning → transfer → mismatch → revised principle."
  }
];

export const c1SynthesisPacks:C1SynthesisPack[]=C1_SYNTHESIS_PACKS.map(validatePack);

export function c1SynthesisPack(id:string):C1SynthesisPack{
  const pack=c1SynthesisPacks.find((item)=>item.id===id);
  if(!pack)throw new Error("UNKNOWN_P13_SYNTHESIS_PACK:"+id);
  return pack;
}

export function buildC1SynthesisSession(packId:string):StudyStep[]{
  const pack=c1SynthesisPack(packId);
  const sources=pack.sourceTextIds.map(readingText);
  const intro:StudyLesson={
    kind:"lesson",
    id:"lesson-"+pack.id,
    title:pack.title,
    body:"This task requires synthesis across several already-linked C1 sources. Re-open the sources if needed, then produce one integrated response. The built-in result only checks transparent length and target-language coverage; it does not claim that the synthesis is semantically correct or CEFR-certified.",
    contextId:pack.id,
    facts:[
      {label:"Mode",value:pack.mode},
      {label:"Sources",value:String(sources.length)},
      {label:"Source set",value:sources.map((source)=>source.title).join(" · ")},
      {label:"Target moves",value:pack.requiredMoves.join(" · ")}
    ],
    sourceLabel:"THIEPN Japanese multi-source synthesis"
  };
  return [intro,makePrompt(pack)];
}

export function c1SynthesisPrompt(pack:C1SynthesisPack):StudyPrompt{
  return makePrompt(pack);
}

export async function getC1SynthesisProgress():Promise<C1SynthesisPackProgress[]>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  return c1SynthesisPacks.map((pack)=>{
    const relevant=events.filter((event)=>event.metadata?.p13MultiSourceSynthesis===true&&event.metadata?.synthesisPackId===pack.id)
      .sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    return {
      pack,
      attempts:relevant.length,
      structurallyComplete:relevant.filter((event)=>event.result==="correct").length,
      ...(relevant.at(-1)?{lastAttemptAt:relevant.at(-1)!.occurredAt}:{})
    };
  });
}

function makePrompt(pack:C1SynthesisPack):StudyPrompt{
  const sourceTitles=pack.sourceTextIds.map((id)=>readingText(id).title);
  return {
    id:"prompt-"+pack.id,
    primaryTarget:{kind:"text",id:pack.sourceTextIds[0]!},
    skill:pack.mode==="writing"?"writing_quality":"production",
    cueFamily:"p13-c1-multi-source-synthesis",
    promptType:pack.mode==="writing"?"textarea":"speech",
    instruction:pack.mode==="writing"?"Write one integrated Japanese synthesis.":"Respond aloud with one integrated Japanese synthesis.",
    prompt:pack.question+"\n\nSources: "+sourceTitles.join(" / "),
    promptLanguage:"en",
    placeholder:pack.mode==="writing"?"複数の資料を統合して書いてください…":"複数の資料を踏まえて話してください…",
    acceptedAnswers:[pack.modelOutline],
    displayAnswer:pack.modelOutline,
    explanation:"Structural check only. A strong response should "+pack.requiredMoves.join(", ")+".",
    contextId:pack.id,
    answerNormalization:"japanese",
    sourceId:"thiepn-original",
    contentVersion:coreContent.version,
    requiredTerms:pack.requiredTerms,
    minimumCharacters:pack.minimumCharacters,
    activity:pack.mode==="writing"?"writing":"speaking",
    languageActivity:pack.mode==="writing"?"writing":"spoken_production",
    eventMetadata:{
      p13MultiSourceSynthesis:true,
      synthesisPackId:pack.id,
      sourceTextIds:pack.sourceTextIds,
      requiredMoves:pack.requiredMoves,
      semanticGrading:false,
      structuralResultOnly:true,
      modelFeedbackAppliedToMastery:false,
      accreditedCefrVerdict:false
    }
  };
}

function validatePack(pack:C1SynthesisPack):C1SynthesisPack{
  if(pack.sourceTextIds.length<2)throw new Error("P13_SYNTHESIS_REQUIRES_MULTIPLE_SOURCES:"+pack.id);
  for(const sourceId of pack.sourceTextIds){
    const source=readingText(sourceId);
    if(source.level!=="C1")throw new Error("P13_SYNTHESIS_SOURCE_NOT_C1:"+pack.id+":"+sourceId);
  }
  if(pack.requiredMoves.length<3||pack.requiredTerms.length<3)throw new Error("P13_SYNTHESIS_TARGETS_TOO_THIN:"+pack.id);
  return pack;
}
