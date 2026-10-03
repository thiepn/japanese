import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents } from "@thiepn/local-db";
import type { StudyLesson,StudyPrompt,StudyStep } from "@thiepn/study-player";
import { coreContent } from "../coreContent";

const ACCOUNT_ID="00000000-0000-4000-8000-000000000001";

export type RealWorldDimension="unseen_response"|"paraphrase"|"repair"|"timed_followup";

export interface RealWorldStageDefinition {
  id:string;
  title:string;
  mode:"writing"|"speaking";
  dimension:RealWorldDimension;
  prompt:string;
  situation:string;
  requiredTerms:string[];
  minimumCharacters:number;
  timeLimitSeconds:number;
}

export interface RealWorldChainDefinition {
  id:string;
  title:string;
  domain:string;
  description:string;
  stages:RealWorldStageDefinition[];
}

export interface RealWorldStageProgress extends RealWorldStageDefinition {
  attempts:number;
  correctAttempts:number;
  withinTimeAttempts:number;
  complete:boolean;
  firstAttemptAt?:string;
  lastAttemptAt?:string;
}

export interface RealWorldChainProgress {
  chain:RealWorldChainDefinition;
  stages:RealWorldStageProgress[];
  attemptedStages:number;
  correctStages:number;
  withinTimeStages:number;
  completed:boolean;
  nextStage:RealWorldStageProgress|null;
}

export interface RealWorldPerformanceSummary {
  chains:RealWorldChainProgress[];
  totalPrompts:number;
  attemptedPrompts:number;
  unseenPrompts:number;
  correctFirstAttempts:number;
  withinTimeFirstAttempts:number;
}

const CHAINS:RealWorldChainDefinition[]=[
  {
    id:"appointment-change",
    title:"Appointment change under constraints",
    domain:"appointments",
    description:"Reschedule, paraphrase the constraint, repair a misunderstanding and confirm the new arrangement.",
    stages:[
      stage("appointment-unseen","Initial request","speaking","unseen_response","You need to move an appointment because your work schedule changed. Explain the problem, propose two alternatives and ask which is possible.","A clinic or service appointment must be changed without sounding abrupt.",["都合","変更","可能"],32,75),
      stage("appointment-paraphrase","Paraphrase the restriction","writing","paraphrase","The staff member says: 『今週は木曜日の午後しか空いていません。』 Restate this restriction in your own Japanese and explain whether it works for you.","Show that you understood the condition without copying the original wording.",["今週","午後","都合"],65,150),
      stage("appointment-repair","Repair the misunderstanding","speaking","repair","The staff member thinks you want to cancel completely. Correct the misunderstanding and make clear that you only want to change the date.","Repair the misunderstanding before repeating the request.",["キャンセル","変更","わけではない"],34,80),
      stage("appointment-followup","Confirm the arrangement","writing","timed_followup","The new appointment is Thursday at 15:30. Write a concise confirmation that includes the date/time, thanks the staff member and says what you will do if another problem occurs.","Close the interaction with an actionable confirmation.",["木曜日","15時30分","連絡"],70,150)
    ]
  },
  {
    id:"workplace-incident",
    title:"Workplace incident and response",
    domain:"workplace",
    description:"Report an incident, paraphrase instructions, repair responsibility confusion and confirm follow-up.",
    stages:[
      stage("incident-unseen","Report what happened","speaking","unseen_response","A system problem delayed your team's work. Briefly explain what happened, what was affected and what has already been checked.","Give a factual incident report without guessing at an unverified cause.",["問題","影響","確認"],34,75),
      stage("incident-paraphrase","Paraphrase the manager's instruction","writing","paraphrase","Your manager says: 『原因を決めつけず、まず影響範囲と再現条件を整理してください。』 Restate the instruction in your own words and list the two immediate priorities.","Demonstrate accurate understanding of the instruction.",["原因","影響","優先"],70,165),
      stage("incident-repair","Repair responsibility confusion","speaking","repair","A colleague thinks you are blaming their team. Clarify that you are describing the current evidence, not assigning blame, and suggest how to investigate together.","Repair the interpersonal misunderstanding while preserving the technical point.",["責任","わけではない","一緒に"],38,85),
      stage("incident-followup","Close with next actions","writing","timed_followup","Write the follow-up message after the incident meeting. State who will check what, the next review time and what condition would trigger escalation.","Turn the discussion into a concrete operational follow-up.",["担当","確認","場合"],78,165)
    ]
  },
  {
    id:"service-problem",
    title:"Service problem and resolution",
    domain:"customer service",
    description:"Explain a service failure, distinguish evidence from assumption, repair a disputed detail and document the resolution.",
    stages:[
      stage("service-unseen","Explain the problem","speaking","unseen_response","A paid service did not work as expected. Explain what you expected, what actually happened and what outcome you are requesting.","Give enough detail for support staff to act.",["サービス","問題","対応"],34,75),
      stage("service-paraphrase","Restate the support explanation","writing","paraphrase","Support says: 『記録上は処理が完了していますが、反映まで時間がかかる場合があります。』 Paraphrase this explanation and identify what is still uncertain.","Separate the recorded fact from the unresolved issue.",["記録","完了","可能性"],72,165),
      stage("service-repair","Repair a disputed detail","speaking","repair","The support agent says the problem happened because you used the wrong procedure, but that is not what occurred. Correct the detail politely and point to the evidence you have.","Correct the record without escalating the tone.",["手順","実際","記録"],36,80),
      stage("service-followup","Document the resolution","writing","timed_followup","The issue is fixed. Write a final message that confirms the resolution, records one remaining question and states when you will contact support again if needed.","Create a useful written record rather than only saying thank you.",["解決","確認","必要"],75,155)
    ]
  },
  {
    id:"travel-change",
    title:"Travel disruption and replanning",
    domain:"travel",
    description:"Respond to a disruption, compare alternatives, repair a route misunderstanding and confirm the revised plan.",
    stages:[
      stage("travel-unseen","Respond to a cancellation","speaking","unseen_response","Your train is cancelled and you must arrive today. Explain your priority and ask for realistic alternatives.","State the constraint and request actionable options.",["運休","今日","代わり"],32,70),
      stage("travel-paraphrase","Compare the alternatives","writing","paraphrase","You are offered a faster route with two transfers and a slower direct route. Explain both options in your own words and which trade-off matters most.","Compare options rather than simply choosing one.",["乗り換え","直接","一方で"],72,160),
      stage("travel-repair","Repair the route misunderstanding","speaking","repair","The staff member thinks you can arrive after 22:00, but you must arrive before 21:00. Correct the misunderstanding and ask whether another route meets the condition.","Repair the constraint clearly and politely.",["21時","条件","間に合う"],34,75),
      stage("travel-followup","Confirm the revised plan","writing","timed_followup","Write a concise note for the person waiting for you. Give the revised route, expected arrival time and what you will do if the next connection is missed.","Communicate a usable plan under uncertainty.",["到着","予定","場合"],72,150)
    ]
  },
  {
    id:"community-coordination",
    title:"Community coordination under pressure",
    domain:"community",
    description:"Coordinate roles, paraphrase constraints, repair conflicting assumptions and publish a final plan.",
    stages:[
      stage("community-unseen","Coordinate the first response","speaking","unseen_response","A local event must be reorganized because severe weather is expected. Explain the immediate priorities and ask volunteers to confirm roles.","Coordinate action without overstating what is known.",["天気","優先","役割"],36,80),
      stage("community-paraphrase","Restate the venue constraint","writing","paraphrase","The venue says: 『安全上の理由から、屋外設備は使用できません。屋内は予定どおり利用できます。』 Paraphrase the restriction and its practical consequence.","Preserve the distinction between unavailable outdoor equipment and available indoor space.",["安全","屋外","屋内"],76,165),
      stage("community-repair","Repair conflicting assumptions","speaking","repair","One volunteer thinks the entire event is cancelled. Another thinks nothing needs to change. Clarify the actual situation and propose a compromise plan.","Resolve two opposing misunderstandings.",["中止","わけではない","変更"],38,85),
      stage("community-followup","Publish the final coordination note","writing","timed_followup","Write the final coordination message with the updated location plan, role assignments, participant communication and one contingency if conditions worsen.","Produce an operational summary that others can follow.",["担当","参加者","場合"],82,175)
    ]
  }
];

export const realWorldChains=CHAINS.map(validateChain);

export async function getRealWorldPerformanceSummary():Promise<RealWorldPerformanceSummary>{
  return buildRealWorldPerformanceSummary(realWorldChains,await listStudyEvents(ACCOUNT_ID));
}

export function buildRealWorldPerformanceSummary(chains:readonly RealWorldChainDefinition[],events:readonly StudyEvent[]):RealWorldPerformanceSummary{
  const progress=chains.map((chain)=>buildChainProgress(chain,events));
  const firstAttempts=firstAttemptEvents(events);
  return {
    chains:progress,
    totalPrompts:chains.reduce((sum,chain)=>sum+chain.stages.length,0),
    attemptedPrompts:progress.reduce((sum,chain)=>sum+chain.attemptedStages,0),
    unseenPrompts:progress.reduce((sum,chain)=>sum+chain.stages.filter((stage)=>stage.attempts===0).length,0),
    correctFirstAttempts:firstAttempts.filter((event)=>event.result==="correct").length,
    withinTimeFirstAttempts:firstAttempts.filter((event)=>event.metadata?.withinTimeLimit===true).length
  };
}

export async function buildNextRealWorldChainSession(chainId:string):Promise<StudyStep[]>{
  const chain=realWorldChain(chainId);
  const events=await listStudyEvents(ACCOUNT_ID);
  const progress=buildChainProgress(chain,events);
  const stage=progress.nextStage??progress.stages.sort((a,b)=>a.correctAttempts-b.correctAttempts||a.attempts-b.attempts)[0]!;
  const unseen=stage.attempts===0;
  return [
    {
      kind:"lesson",
      id:"p9-real-world-intro-"+stage.id,
      title:chain.title+" · "+stage.title,
      body:unseen
        ?"This is an unseen real-world performance prompt. Respond without opening a model answer or reference text. The time target is recorded but does not block submission."
        :"This is a repeat performance prompt. Use it to repair a weak or slow prior attempt; the repeat is kept distinct from first-attempt evidence.",
      contextId:"p9-real-world-"+chain.id,
      facts:[
        {label:"Domain",value:chain.domain},
        {label:"Dimension",value:stage.dimension.replace("_"," ")},
        {label:"Mode",value:stage.mode},
        {label:"Time target",value:stage.timeLimitSeconds+" seconds"}
      ],
      sourceLabel:"THIEPN Japanese P9 real-world performance"
    } satisfies StudyLesson,
    makeStagePrompt(chain,stage,unseen)
  ];
}

export async function buildP9QualificationSession(limit=10):Promise<StudyStep[]>{
  const events=await listStudyEvents(ACCOUNT_ID);
  const progress=buildRealWorldPerformanceSummary(realWorldChains,events);
  const candidates=progress.chains.flatMap((chain)=>chain.stages.map((stage)=>({chain:chain.chain,stage})))
    .sort((a,b)=>Number(a.stage.attempts>0)-Number(b.stage.attempts>0)||a.stage.attempts-b.stage.attempts||a.chain.id.localeCompare(b.chain.id)||a.stage.id.localeCompare(b.stage.id))
    .slice(0,Math.max(1,limit));
  const intro:StudyLesson={
    kind:"lesson",id:"p9-qualification-intro",title:"P9 real-world performance set",
    body:"This set samples unseen or least-practiced B2 functional prompts across appointments, workplace incidents, service problems, travel changes and community coordination. Structural target coverage and response time are recorded separately; neither is an accredited CEFR score.",
    contextId:"p9-performance-qualification",
    facts:[
      {label:"Prompts",value:String(candidates.length)},
      {label:"Evidence",value:"first attempt · repair · paraphrase · timed follow-up"},
      {label:"Scheduling",value:"qualification-only; excluded from FSRS"}
    ],
    sourceLabel:"THIEPN Japanese P9 performance qualification"
  };
  return [intro,...candidates.map(({chain,stage})=>makeStagePrompt(chain,stage,stage.attempts===0))];
}

export function realWorldChain(id:string):RealWorldChainDefinition{
  const chain=realWorldChains.find((item)=>item.id===id);
  if(!chain)throw new Error("UNKNOWN_REAL_WORLD_CHAIN:"+id);
  return chain;
}

function buildChainProgress(chain:RealWorldChainDefinition,events:readonly StudyEvent[]):RealWorldChainProgress{
  const stages=chain.stages.map((stage)=>{
    const relevant=performanceEvents(events,stage.id).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const correct=relevant.filter((event)=>event.result==="correct");
    const within=relevant.filter((event)=>event.metadata?.withinTimeLimit===true);
    return {
      ...stage,attempts:relevant.length,correctAttempts:correct.length,withinTimeAttempts:within.length,complete:relevant.length>0,
      ...(relevant[0]?{firstAttemptAt:relevant[0].occurredAt}:{}),
      ...(relevant.at(-1)?{lastAttemptAt:relevant.at(-1)!.occurredAt}:{})
    };
  });
  return {
    chain,stages,
    attemptedStages:stages.filter((stage)=>stage.attempts>0).length,
    correctStages:stages.filter((stage)=>stage.correctAttempts>0).length,
    withinTimeStages:stages.filter((stage)=>stage.withinTimeAttempts>0).length,
    completed:stages.every((stage)=>stage.attempts>0),
    nextStage:stages.find((stage)=>stage.attempts===0)??null
  };
}

function makeStagePrompt(chain:RealWorldChainDefinition,stage:RealWorldStageProgress|RealWorldStageDefinition,unseen:boolean):StudyPrompt{
  return {
    id:"p9-performance-"+stage.id,
    primaryTarget:{kind:"production_task",id:"p9-performance-"+stage.id},
    skill:stage.mode==="writing"?"writing_quality":"production",
    cueFamily:"p9-real-world-"+stage.dimension,
    promptType:stage.mode==="writing"?"textarea":"speech",
    instruction:(unseen?"Unseen ":"Repeat ")+stage.mode+" performance",
    prompt:stage.prompt,
    promptLanguage:"en",
    placeholder:stage.mode==="writing"?"日本語で対応を書いてください…":"日本語で話してください…",
    acceptedAnswers:["qualification-only"],
    displayAnswer:"No single model answer. Review the structural targets and, when available, advisory semantic feedback.",
    explanation:stage.situation,
    contextId:"p9-real-world-"+chain.id,
    answerNormalization:"japanese",
    sourceId:"thiepn-original",
    contentVersion:coreContent.version,
    requiredTerms:stage.requiredTerms,
    minimumCharacters:stage.minimumCharacters,
    timeLimitSeconds:stage.timeLimitSeconds,
    activity:stage.mode==="writing"?"writing":"speaking",
    languageActivity:stage.mode==="writing"?"writing":"spoken_interaction",
    eventMetadata:{
      p9Performance:true,
      p9PerformanceChainId:chain.id,
      p9PerformancePromptId:stage.id,
      performanceDimension:stage.dimension,
      unseenAtPresentation:unseen,
      schedulerExcluded:true,
      qualificationOnly:true,
      targetChunkIds:[],
      timeTargetSeconds:stage.timeLimitSeconds
    }
  };
}

function performanceEvents(events:readonly StudyEvent[],stageId:string):StudyEvent[]{
  return events.filter((event)=>event.metadata?.p9PerformancePromptId===stageId&&(event.result==="correct"||event.result==="incorrect"));
}

function firstAttemptEvents(events:readonly StudyEvent[]):StudyEvent[]{
  const byPrompt=new Map<string,StudyEvent>();
  for(const event of events.filter((item)=>typeof item.metadata?.p9PerformancePromptId==="string").sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const id=String(event.metadata!.p9PerformancePromptId);
    if(!byPrompt.has(id))byPrompt.set(id,event);
  }
  return [...byPrompt.values()];
}

function stage(id:string,title:string,mode:"writing"|"speaking",dimension:RealWorldDimension,prompt:string,situation:string,requiredTerms:string[],minimumCharacters:number,timeLimitSeconds:number):RealWorldStageDefinition{
  return {id,title,mode,dimension,prompt,situation,requiredTerms,minimumCharacters,timeLimitSeconds};
}

function validateChain(chain:RealWorldChainDefinition):RealWorldChainDefinition{
  if(chain.stages.length!==4)throw new Error("P9_CHAIN_REQUIRES_FOUR_STAGES:"+chain.id);
  const dimensions=new Set(chain.stages.map((stage)=>stage.dimension));
  for(const required of ["unseen_response","paraphrase","repair","timed_followup"] as const){
    if(!dimensions.has(required))throw new Error("P9_CHAIN_MISSING_DIMENSION:"+chain.id+":"+required);
  }
  const ids=new Set<string>();
  for(const stage of chain.stages){
    if(ids.has(stage.id))throw new Error("P9_DUPLICATE_STAGE:"+stage.id);
    ids.add(stage.id);
    if(stage.requiredTerms.length<3)throw new Error("P9_STAGE_REQUIRES_TARGETS:"+stage.id);
    if(stage.timeLimitSeconds<30)throw new Error("P9_STAGE_TIME_TOO_SHORT:"+stage.id);
  }
  return chain;
}
