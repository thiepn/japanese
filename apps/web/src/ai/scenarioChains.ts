export interface ScenarioChainStage {
  id:string;
  title:string;
  scenario:string;
  goals:string[];
}

export interface ScenarioChain {
  id:string;
  title:string;
  domain:string;
  description:string;
  stages:ScenarioChainStage[];
}

export const scenarioChains:ScenarioChain[]=[
  {
    id:"workplace-change",
    title:"Negotiate a workplace change",
    domain:"workplace",
    description:"Plan a change, clarify constraints, repair disagreement, then confirm a follow-up.",
    stages:[
      {id:"plan",title:"Plan",scenario:"Your team needs to change a work process before a deadline. Propose a direction and explain the main reason.",goals:["state a proposal","give one reason","use a workplace collocation"]},
      {id:"clarify",title:"Clarify",scenario:"The other person says the proposal may increase workload. Ask for clarification and identify the most important constraint.",goals:["ask a clarification question","identify a constraint","acknowledge the concern"]},
      {id:"repair",title:"Repair",scenario:"A misunderstanding appears: the other person thinks quality will be reduced. Repair the misunderstanding and offer a compromise.",goals:["repair misunderstanding","state a contrast","offer a compromise"]},
      {id:"follow-up",title:"Follow up",scenario:"You have provisional agreement. Confirm responsibilities, deadline and the next follow-up action.",goals:["summarize agreement","assign responsibility","confirm next action"]}
    ]
  },
  {
    id:"media-claim",
    title:"Evaluate a disputed online claim",
    domain:"media",
    description:"Verify a claim, challenge weak evidence, repair overstatement and give a cautious conclusion.",
    stages:[
      {id:"plan",title:"Initial assessment",scenario:"A colleague shows you a dramatic online claim. Explain what you would verify first.",goals:["name verification steps","mention the information source","avoid a final conclusion"]},
      {id:"clarify",title:"Clarify evidence",scenario:"The colleague says one survey proves the claim. Ask what you need to know about the survey before accepting that conclusion.",goals:["ask about sample or method","distinguish data from conclusion","use evidence language"]},
      {id:"repair",title:"Repair overstatement",scenario:"The colleague interprets your caution as saying the claim is false. Correct that misunderstanding.",goals:["repair the misunderstanding","qualify your position","state what remains uncertain"]},
      {id:"follow-up",title:"Cautious conclusion",scenario:"You now have two sources with partly conflicting results. Give a cautious provisional conclusion and say what should be checked next.",goals:["synthesize two sources","state a limit","propose a next check"]}
    ]
  },
  {
    id:"community-plan",
    title:"Build a community support plan",
    domain:"public policy",
    description:"Identify needs, clarify stakeholders, respond to a budget objection and agree on implementation.",
    stages:[
      {id:"plan",title:"Plan",scenario:"A local community needs a support measure for changing population needs. Propose a target group and goal.",goals:["define the target group","state the goal","give a reason"]},
      {id:"clarify",title:"Clarify",scenario:"Another participant asks who should be responsible and how residents will be involved. Clarify roles.",goals:["clarify responsibility","mention cooperation","describe one procedure"]},
      {id:"repair",title:"Repair",scenario:"A participant says your proposal ignores the budget. Acknowledge the concern and revise the plan.",goals:["acknowledge the objection","include budget constraints","revise one part"]},
      {id:"follow-up",title:"Follow up",scenario:"The group accepts a pilot version. Summarize the conditions, implementation step and how results will be evaluated.",goals:["summarize conditions","state implementation","explain evaluation"]}
    ]
  },
  {
    id:"research-discussion",
    title:"Defend a research conclusion",
    domain:"academic-lite",
    description:"Present evidence, answer a challenge, repair an overclaim and end with a qualified conclusion.",
    stages:[
      {id:"plan",title:"Present evidence",scenario:"Present a small research finding and explain what the data suggests.",goals:["state a result","use cautious inference","mention the method or data"]},
      {id:"clarify",title:"Clarify limits",scenario:"A listener asks whether the result applies to everyone. Explain the scope and limits.",goals:["state the scope","identify a limitation","avoid overgeneralization"]},
      {id:"repair",title:"Repair",scenario:"Someone says your conclusion contradicts another study. Explain how both findings might coexist.",goals:["acknowledge the counterevidence","compare conditions","repair the apparent contradiction"]},
      {id:"follow-up",title:"Qualified conclusion",scenario:"Close the discussion with a qualified conclusion and one next research step.",goals:["give a qualified conclusion","state remaining uncertainty","propose a next step"]}
    ]
  }
];

export function scenarioChain(id:string):ScenarioChain{
  const chain=scenarioChains.find((item)=>item.id===id);
  if(!chain)throw new Error("UNKNOWN_SCENARIO_CHAIN:"+id);
  return chain;
}
