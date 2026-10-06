export type ScenarioLevel="B2"|"C1";
export type ScenarioInteractionStyle="guided"|"spontaneous";

export interface ScenarioChainStage {
  id:string;
  title:string;
  scenario:string;
  goals:string[];
  pressure?:string;
}

export interface ScenarioChain {
  id:string;
  title:string;
  domain:string;
  description:string;
  level:ScenarioLevel;
  interactionStyle:ScenarioInteractionStyle;
  hiddenFutureStages?:boolean;
  stages:ScenarioChainStage[];
}

export const scenarioChains:ScenarioChain[]=[
  {
    id:"workplace-change",
    title:"Negotiate a workplace change",
    domain:"workplace",
    description:"Plan a change, clarify constraints, repair disagreement, then confirm a follow-up.",
    level:"B2",interactionStyle:"guided",
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
    level:"B2",interactionStyle:"guided",
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
    level:"B2",interactionStyle:"guided",
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
    level:"B2",interactionStyle:"guided",
    stages:[
      {id:"plan",title:"Present evidence",scenario:"Present a small research finding and explain what the data suggests.",goals:["state a result","use cautious inference","mention the method or data"]},
      {id:"clarify",title:"Clarify limits",scenario:"A listener asks whether the result applies to everyone. Explain the scope and limits.",goals:["state the scope","identify a limitation","avoid overgeneralization"]},
      {id:"repair",title:"Repair",scenario:"Someone says your conclusion contradicts another study. Explain how both findings might coexist.",goals:["acknowledge the counterevidence","compare conditions","repair the apparent contradiction"]},
      {id:"follow-up",title:"Qualified conclusion",scenario:"Close the discussion with a qualified conclusion and one next research step.",goals:["give a qualified conclusion","state remaining uncertainty","propose a next step"]}
    ]
  },
  {
    id:"c1-policy-briefing",
    title:"Defend a policy recommendation under challenge",
    domain:"policy + institutions",
    description:"Hold a qualified position while the interlocutor introduces conflicting evidence, implementation constraints and accountability pressure.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Initial position",scenario:"You are briefing a senior colleague on a policy recommendation. Give the recommendation, the strongest evidence supporting it and one explicit limitation.",goals:["state a qualified recommendation","separate evidence from inference","state one caveat"]},
      {id:"probe",title:"Evidence probe",scenario:"The colleague says a second dataset points in the opposite direction and asks why your recommendation should still stand.",goals:["acknowledge counterevidence","compare evidential weight","avoid false certainty"],pressure:"conflicting evidence"},
      {id:"pressure",title:"Implementation pressure",scenario:"The colleague now says there is only enough budget to implement half of your proposal this year. Decide what to preserve and what to defer.",goals:["prioritize under constraint","justify trade-off","address feasibility"],pressure:"resource constraint"},
      {id:"repair",title:"Accountability challenge",scenario:"The colleague says your plan makes responsibility unclear if the outcome is poor. Reframe the plan so accountability and review conditions are explicit.",goals:["clarify responsibility","set review criteria","repair ambiguity"],pressure:"accountability challenge"},
      {id:"synthesis",title:"Final synthesis",scenario:"End the briefing with a concise position that integrates evidence, uncertainty, feasibility and accountability without simply repeating earlier sentences.",goals:["synthesize the full exchange","calibrate certainty","state next action"],pressure:"compressed final answer"}
    ]
  },
  {
    id:"c1-research-defense",
    title:"Defend a causal interpretation without overclaiming",
    domain:"research + evidence",
    description:"Respond to methodological objections, alternative explanations and a demand for a stronger conclusion.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Interpretation",scenario:"Present a research finding that shows a strong association and explain what you think it may imply.",goals:["state observation","mark inference","avoid claiming causality as fact"]},
      {id:"probe",title:"Method challenge",scenario:"A researcher interrupts: the sample may be biased and one important variable was not measured. Respond without abandoning the entire finding.",goals:["address methodological limit","preserve supported claim","state uncertainty"],pressure:"methodological objection"},
      {id:"pressure",title:"Competing explanation",scenario:"Another researcher proposes a plausible alternative cause that fits the same data. Compare it with your interpretation.",goals:["compare explanations","state what evidence would discriminate","avoid rhetorical dismissal"],pressure:"alternative causal model"},
      {id:"repair",title:"Demand for certainty",scenario:"The chair asks you to give a simple yes-or-no causal conclusion for a press release. Explain why that framing is too strong and offer a usable alternative.",goals:["resist forced certainty","reframe for public communication","remain useful"],pressure:"forced binary conclusion"},
      {id:"synthesis",title:"Research conclusion",scenario:"Give a final research conclusion that clearly separates what is observed, what is inferred and what must be tested next.",goals:["separate evidence and inference","state caveat","propose discriminating evidence"],pressure:"formal synthesis"}
    ]
  },
  {
    id:"c1-institutional-negotiation",
    title:"Negotiate autonomy, standards and unequal burdens",
    domain:"institutional negotiation",
    description:"Negotiate a solution when common standards, local autonomy and unequal implementation capacity conflict.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Opening proposal",scenario:"You are negotiating a new institutional standard with several regional representatives. Propose what should be common everywhere and what should remain locally adaptable.",goals:["distinguish common standard from local adaptation","state rationale","invite response"]},
      {id:"probe",title:"Autonomy objection",scenario:"A representative argues that the common standard undermines local autonomy and ignores regional expertise.",goals:["acknowledge legitimate concern","defend shared minimum","offer adaptation mechanism"],pressure:"autonomy objection"},
      {id:"pressure",title:"Capacity imbalance",scenario:"A smaller region says it cannot meet the proposed timetable because staffing and funding are weaker.",goals:["address unequal capacity","revise implementation","avoid one-size-fits-all response"],pressure:"unequal implementation capacity"},
      {id:"repair",title:"Trust breakdown",scenario:"Another participant says the revisions look like arbitrary exceptions and threatens to leave the agreement.",goals:["repair trust","make exception criteria transparent","rebuild common ground"],pressure:"trust breakdown"},
      {id:"synthesis",title:"Agreement text",scenario:"State the final compromise in a form that makes the shared rule, permitted flexibility, accountability and review process explicit.",goals:["synthesize agreement","define exception conditions","assign review responsibility"],pressure:"formal agreement"}
    ]
  },
  {
    id:"c1-public-interview",
    title:"Handle a difficult public interview",
    domain:"media + public communication",
    description:"Answer compressed, adversarial questions while preserving nuance and avoiding evasive language.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Opening answer",scenario:"A journalist asks you to explain a controversial institutional decision in under a minute. Give the central rationale and one limitation.",goals:["state rationale","acknowledge limitation","use accessible formal language"]},
      {id:"probe",title:"Loaded question",scenario:"The journalist says, 'So you admit the policy has failed?' Respond to the loaded framing without sounding evasive.",goals:["reject false framing precisely","acknowledge valid concern","answer the underlying question"],pressure:"loaded framing"},
      {id:"pressure",title:"Contradictory quote",scenario:"The journalist reads an earlier statement that appears inconsistent with what you just said. Explain whether the position changed or the contexts differ.",goals:["address apparent inconsistency","distinguish context","preserve accountability"],pressure:"apparent contradiction"},
      {id:"repair",title:"Personal attribution",scenario:"The journalist claims your explanation is only an attempt to protect your organization. Move the discussion back to evidence and responsibility without attacking the interviewer.",goals:["avoid motive dispute","return to evidence","maintain register"],pressure:"motive attribution"},
      {id:"synthesis",title:"Closing answer",scenario:"Give a final answer that states what is known, what remains uncertain and what concrete action will happen next.",goals:["calibrate certainty","state accountability","give next action"],pressure:"public closing statement"}
    ]
  },
  {
    id:"c1-cross-domain-transfer",
    title:"Transfer an argument across domains",
    domain:"cross-domain reasoning",
    description:"Test whether a principle survives when the interlocutor moves it into a different institutional context.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"State the principle",scenario:"Choose a general principle for making decisions under uncertainty and explain why it is useful.",goals:["state principle","define scope","give one example"]},
      {id:"probe",title:"Domain transfer",scenario:"The interlocutor applies your principle to a very different domain and says it should work exactly the same way there.",goals:["test transfer","identify contextual difference","preserve useful core"],pressure:"cross-domain transfer"},
      {id:"pressure",title:"Counterexample",scenario:"You are given a counterexample where your principle appears to produce a bad outcome. Decide whether the principle needs an exception, a narrower scope or rejection.",goals:["engage counterexample","revise claim if needed","make criteria explicit"],pressure:"counterexample"},
      {id:"repair",title:"Overgeneralization repair",scenario:"The interlocutor summarizes your revised position too broadly. Correct the summary and state the boundary condition precisely.",goals:["repair overgeneralization","state boundary condition","avoid unnecessary complexity"],pressure:"misrepresentation"},
      {id:"synthesis",title:"Portable version",scenario:"Give the strongest version of the principle that can responsibly transfer across domains, including one explicit condition where it should not be used.",goals:["synthesize revised principle","state transfer condition","state failure condition"],pressure:"final abstraction"}
    ]
,
  {
    id:"c1-live-committee-repair",
    title:"Survive a hostile committee interruption",
    domain:"public hearing + institutional accountability",
    description:"Hold the floor through interruption, forced clarification, hostile paraphrase and a final compressed answer without losing the argument's caveats.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Opening statement",scenario:"You have ninety seconds before a committee to defend a contested recommendation. State the recommendation, strongest reason and the most important limitation.",goals:["state a bounded position","prioritize one reason","name the decisive caveat"]},
      {id:"interrupt",title:"Chair interruption",scenario:"The chair interrupts before you finish: 『結局、賛成なのか反対なのか、どちらですか。』 Recover the floor politely, answer the immediate demand and restore the missing qualification.",goals:["recover the floor","answer directly","restore qualification"],pressure:"interruption + forced binary"},
      {id:"clarify",title:"Reference challenge",scenario:"A member says your use of 『それ』『この対応』 and responsibility language is too vague for the record. Clarify the actor, action and condition without starting over.",goals:["repair reference ambiguity","name responsibility","preserve continuity"],pressure:"clarification demand"},
      {id:"reframe",title:"Hostile paraphrase",scenario:"Another member summarizes your position as 『失敗を認めず、判断を先送りしたいだけですね』. Correct the paraphrase without attacking the speaker and state the real point in one coherent response.",goals:["reject misrepresentation","acknowledge legitimate concern","restate position"],pressure:"hostile paraphrase"},
      {id:"close",title:"Thirty-second close",scenario:"The chair gives you thirty seconds. State what is known, what remains uncertain, what action you recommend and when the position should be reviewed.",goals:["compress accurately","state action","state review condition"],pressure:"time pressure"}
    ]
  },
  {
    id:"c1-specialist-roundtable",
    title:"Handle a specialist roundtable with shifting audiences",
    domain:"expert discussion + public explanation",
    description:"Move between specialist precision and accessible explanation while answering evidence conflict, terminology challenge and rapid audience shifts.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Expert position",scenario:"At a specialist roundtable, state a technically precise position and the evidence distinction that matters most.",goals:["use precise specialist language","state evidential boundary","avoid unnecessary background"]},
      {id:"terminology",title:"Terminology challenge",scenario:"A specialist says one key term is being used too broadly and asks you to distinguish it from a nearby concept.",goals:["define the term operationally","contrast a near-synonym","repair imprecision"],pressure:"lexical precision"},
      {id:"public",title:"Audience switch",scenario:"A non-specialist observer joins and asks you to explain the same point without jargon. Keep the important caveat and do not simplify it into a false binary.",goals:["shift register","preserve caveat","replace jargon with explanation"],pressure:"audience shift"},
      {id:"evidence",title:"Fresh counterevidence",scenario:"A participant introduces evidence that weakens one part of your claim. Recalibrate the position explicitly rather than defending the original wording at all costs.",goals:["absorb counterevidence","narrow claim","state what still holds"],pressure:"evidence conflict"},
      {id:"synthesis",title:"Roundtable synthesis",scenario:"Summarize the strongest common ground, the unresolved technical disagreement and the next discriminating question for both expert and non-expert listeners.",goals:["synthesize across audiences","name unresolved point","give next question"],pressure:"dual-audience synthesis"}
    ]
  },
  {
    id:"c1-cross-domain-live-transfer",
    title:"Transfer expertise under live challenge",
    domain:"cross-domain specialist transfer",
    description:"Defend a principle from one specialist domain while the interlocutor moves it into an unfamiliar domain, introduces a counterexample and demands a portable version.",
    level:"C1",interactionStyle:"spontaneous",hiddenFutureStages:true,
    stages:[
      {id:"position",title:"Source-domain principle",scenario:"State one principle from a domain you know well, explain why it works there and name the condition that makes it reliable.",goals:["state principle","name mechanism","state source-domain condition"]},
      {id:"transfer",title:"Unexpected transfer",scenario:"The interlocutor applies your principle to a very different field and says the same rule should hold unchanged. Decide immediately what transfers and what does not.",goals:["separate portable core from context","name missing assumption","avoid false analogy"],pressure:"domain transfer"},
      {id:"counterexample",title:"Counterexample",scenario:"A concrete case in the target domain violates your first transferred version. Revise the principle rather than dismissing the example.",goals:["engage counterexample","revise boundary","preserve useful core"],pressure:"counterexample"},
      {id:"repair",title:"Overgeneralized summary",scenario:"The interlocutor repeats your revised position too broadly. Correct the summary concisely and specify the condition that prevents overgeneralization.",goals:["repair summary","state boundary condition","keep language concise"],pressure:"overgeneralization"},
      {id:"synthesis",title:"Portable formulation",scenario:"Give the strongest version of the principle that can travel across domains, plus one explicit case where it should not be used without further evidence.",goals:["formulate portable principle","state failure condition","calibrate certainty"],pressure:"portable synthesis"}
    ]
  }  }
];

export function scenarioChain(id:string):ScenarioChain{
  const chain=scenarioChains.find((item)=>item.id===id);
  if(!chain)throw new Error("UNKNOWN_SCENARIO_CHAIN:"+id);
  return chain;
}

export function scenarioChainsForLevel(level:ScenarioLevel):ScenarioChain[]{
  return scenarioChains.filter((item)=>item.level===level);
}
