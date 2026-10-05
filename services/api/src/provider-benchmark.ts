import type { CoachRequest,CoachResponse } from "@thiepn/coach";
import { createCoachHandler,type JsonCoachModel } from "./ai-coach";

export interface CoachBenchmarkCase {
  id:string;
  request:CoachRequest;
  expectedSignals:string[];
  forbiddenSignals:string[];
}

export interface CoachBenchmarkCaseResult {
  id:string;
  schemaSafe:boolean;
  groundingScore:number;
  semanticSignalsFound:number;
  semanticSignalsTotal:number;
  forbiddenSignalsFound:string[];
  passed:boolean;
}

export interface CoachProviderBenchmarkResult {
  provider:string;
  model?:string;
  cases:CoachBenchmarkCaseResult[];
  passRate:number;
  averageGroundingScore:number;
  semanticRecall:number;
  safe:boolean;
}

export const coachBenchmarkCases:CoachBenchmarkCase[]=[
  {
    id:"particle-destination",
    request:request("bench-particle","writing_revision","私は昨日、駅を行きました。友達に会うためです。","Correct the destination particle without changing the intended meaning.",["駅に","駅へ","particle"]),
    expectedSignals:["駅に","駅へ"],forbiddenSignals:["cefr pass","b2 certified","pronunciation score"]
  },
  {
    id:"overclaim-evidence",
    request:request("bench-evidence","writing_revision","この調査では十人が賛成しました。だから、日本人は全員この政策に賛成しています。","Identify the unsupported generalization and ask for a more cautious conclusion.",["全員","調査","結論"]),
    expectedSignals:["全員","十人"],forbiddenSignals:["cefr pass","mastered b2","合格しました"]
  },
  {
    id:"register-request",
    request:request("bench-register","conversation","ちょっと待って。これやって。","Respond as a workplace coach and help make the request appropriately polite.",["お願いします","いただけ","丁寧"]),
    expectedSignals:["お願い","いただ"],forbiddenSignals:["pronunciation","acoustic"]
  },
  {
    id:"coherence-contrast",
    request:request("bench-coherence","writing_revision","この制度は便利です。費用が高いです。利用者が増えています。問題もあります。","Improve the logical connection between benefit and drawback without replacing the learner's whole response.",["一方で","ものの","contrast"]),
    expectedSignals:["一方で","ものの"],forbiddenSignals:["cefr pass","b2 certified","合格"]
  },
  {
    id:"c1-causal-restraint",
    request:request("bench-c1-causality","conversation","相関が強いので、この施策が成果の原因だと断定できます。","Challenge the causal overclaim while continuing a C1 research discussion.",["相関","因果","留保"],"C1","spontaneous"),
    expectedSignals:["相関","因果"],forbiddenSignals:["c1 certified","cefr pass","合格しました"]
  },
  {
    id:"c1-counterargument",
    request:request("bench-c1-counter","conversation","反対意見は現場を分かっていないので、考慮する必要はありません。","Continue as a demanding C1 interlocutor and require a more precise response to the counterargument.",["反対","根拠","譲歩"],"C1","spontaneous"),
    expectedSignals:["反対","根拠"],forbiddenSignals:["c1 certified","mastered c1","pronunciation score"]
  }
];

export async function runCoachProviderBenchmark(model:JsonCoachModel,cases:readonly CoachBenchmarkCase[]=coachBenchmarkCases):Promise<CoachProviderBenchmarkResult>{
  const handle=createCoachHandler(model);
  const results:CoachBenchmarkCaseResult[]=[];
  for(const item of cases){
    try{
      const response=await handle(item.request);
      results.push(scoreCase(item,response));
    }catch{
      results.push({id:item.id,schemaSafe:false,groundingScore:0,semanticSignalsFound:0,semanticSignalsTotal:item.expectedSignals.length,forbiddenSignalsFound:[],passed:false});
    }
  }
  const passRate=results.length?results.filter((item)=>item.passed).length/results.length:0;
  const averageGroundingScore=mean(results.map((item)=>item.groundingScore));
  const signalTotal=results.reduce((sum,item)=>sum+item.semanticSignalsTotal,0);
  const signalFound=results.reduce((sum,item)=>sum+item.semanticSignalsFound,0);
  return {
    provider:model.provider,...(model.model?{model:model.model}:{}),cases:results,passRate,averageGroundingScore,
    semanticRecall:signalTotal?signalFound/signalTotal:0,
    safe:results.every((item)=>item.schemaSafe&&item.forbiddenSignalsFound.length===0)
  };
}

function scoreCase(test:CoachBenchmarkCase,response:CoachResponse):CoachBenchmarkCaseResult{
  const searchable=normalize(JSON.stringify(response));
  const found=test.expectedSignals.filter((signal)=>searchable.includes(normalize(signal))).length;
  const forbidden=test.forbiddenSignals.filter((signal)=>searchable.includes(normalize(signal)));
  const grounding=response.quality?.score??0;
  const semanticRatio=test.expectedSignals.length?found/test.expectedSignals.length:1;
  const passed=forbidden.length===0&&grounding>=.5&&semanticRatio>=.5;
  return {
    id:test.id,schemaSafe:true,groundingScore:grounding,semanticSignalsFound:found,
    semanticSignalsTotal:test.expectedSignals.length,forbiddenSignalsFound:forbidden,passed
  };
}

function request(sessionId:string,mode:"conversation"|"writing_revision",learnerText:string,scenario:string,goals:string[],targetLevel:CoachRequest["targetLevel"]="B2",interactionStyle:CoachRequest["interactionStyle"]="guided"):CoachRequest{
  return {sessionId,mode,targetLevel,learnerText,history:[],scenario,goals,register:mode==="conversation"?"polite":"formal",interactionStyle};
}
function normalize(value:string):string{return value.normalize("NFKC").toLowerCase().replace(/\s+/g,"");}
function mean(values:number[]):number{return values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;}
