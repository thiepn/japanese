import type { StudyEvent } from "@thiepn/domain";
import { listPrivateVocabulary,listStudyEvents,savePrivateVocabulary,saveStudyEvent } from "@thiepn/local-db";
import { coreContent } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "./runtime";

const DELAY_MS=20*60*60*1000;

export type C1ExternalGenre=
  |"whitepaper"
  |"statistics"
  |"research_release"
  |"academic_article"
  |"policy_research"
  |"legislative_brief"
  |"legislation"
  |"speech_press"
  |"policy_site"
  |"demographic_report";

export type C1SourceRole="primary_data"|"primary_law"|"institutional_position"|"research"|"analysis";
export type C1SourceEvaluationConfidence="low"|"medium"|"high";

export interface C1SourcePortal {
  id:string;
  title:string;
  publisher:string;
  url:string;
  allowedHosts:string[];
  genre:C1ExternalGenre;
  sourceRole:C1SourceRole;
  domains:string[];
  task:string;
  citationHint:string;
}

export interface C1RegisteredSource {
  id:string;
  portalId:string;
  title:string;
  url:string;
  publisher:string;
  genre:C1ExternalGenre;
  sourceRole:C1SourceRole;
  domain:string;
  registeredAt:string;
}

export interface C1SourceEvaluation {
  sourceId:string;
  evaluatedAt:string;
  claim:string;
  evidence:string;
  limitation:string;
  rhetoricOrPurpose:string;
  confidence:C1SourceEvaluationConfidence;
}

export interface C1SpecialistTerm {
  id:string;
  sourceId:string;
  canonicalForm:string;
  reading?:string;
  meaning:string;
  context:string;
  domain:string;
  savedAt:string;
}

export interface C1WritingProject {
  id:string;
  title:string;
  domain:string;
  brief:string;
  deliverable:string;
  minimumSources:number;
  minimumGenres:number;
  minimumPublishers:number;
  draftMinimumCharacters:number;
  revisionMinimumCharacters:number;
  requiredDefenseTurns:number;
  targetMoves:string[];
  recommendedPortalIds:string[];
}

export type C1WritingProjectStage="source_map"|"draft"|"defense"|"waiting_revision"|"revision"|"reflection"|"complete";

export interface C1ProjectSourceMap {
  projectId:string;
  occurredAt:string;
  thesis:string;
  sourceIds:string[];
  citationKeys:Record<string,string>;
}

export interface C1ProjectArtifact {
  occurredAt:string;
  text:string;
  citationKeys:string[];
}

export interface C1ProjectDefense {
  occurredAt:string;
  pressureId:string;
  pressureType:C1PressureType;
  response:string;
  inputMode:"text"|"speech";
  sourceId?:string;
}

export interface C1WritingProjectProgress {
  project:C1WritingProject;
  sourceMap?:C1ProjectSourceMap;
  draft?:C1ProjectArtifact;
  defenses:C1ProjectDefense[];
  revision?:C1ProjectArtifact;
  reflection?:{occurredAt:string;text:string};
  delayHours:number;
  revisionUnlockAt?:string;
  nextStage:C1WritingProjectStage;
  complete:boolean;
}

export type C1PressureType=
  |"causal_overclaim"
  |"source_credibility"
  |"conflicting_evidence"
  |"counterexample"
  |"definition_shift"
  |"stakeholder_objection"
  |"legal_constraint"
  |"implementation_constraint"
  |"numerical_inconsistency"
  |"uncertainty"
  |"audience_shift"
  |"register_shift"
  |"ethical_tradeoff"
  |"time_pressure"
  |"scope_narrowing"
  |"direct_rebuttal";

export interface C1PressureChallenge {
  id:string;
  type:C1PressureType;
  title:string;
  prompt:string;
  goals:string[];
  sourceAware:boolean;
}

export interface C1EnvironmentProgress {
  activeDays:number;
  registeredSources:number;
  evaluatedSources:number;
  sourceGenres:number;
  sourcePublishers:number;
  specialistTerms:number;
  writingProjectsStarted:number;
  writingProjectsCompleted:number;
  defenseTurns:number;
  uniquePressureTypes:number;
  sourceEvaluations:C1SourceEvaluation[];
  sources:C1RegisteredSource[];
  specialistTermItems:C1SpecialistTerm[];
  projects:C1WritingProjectProgress[];
}

export const c1SourcePortals:C1SourcePortal[]=[
  {
    id:"env-whitepaper",
    title:"環境白書・循環型社会白書・生物多様性白書",
    publisher:"環境省",
    url:"https://www.env.go.jp/policy/hakusyo/",
    allowedHosts:["env.go.jp"],
    genre:"whitepaper",sourceRole:"institutional_position",
    domains:["environment","policy","economy"],
    task:"Choose one chapter with claims, data and policy implications. Register the exact chapter/page you actually read.",
    citationHint:"Record the year, chapter/section and exact URL. Separate ministry description of policy from independent evidence."
  },
  {
    id:"mext-whitepaper",
    title:"文部科学白書 / 科学技術・イノベーション白書",
    publisher:"文部科学省",
    url:"https://www.mext.go.jp/b_menu/hakusho/hakusho.htm",
    allowedHosts:["mext.go.jp"],
    genre:"whitepaper",sourceRole:"institutional_position",
    domains:["education","science","culture"],
    task:"Choose a section that makes a policy diagnosis or reports a trend. Track which statements are data, goals and interpretation.",
    citationHint:"Record white-paper year and section. Treat policy objectives as institutional positions rather than neutral findings."
  },
  {
    id:"meti-whitepaper",
    title:"白書・報告書",
    publisher:"経済産業省",
    url:"https://www.meti.go.jp/report/whitepaper/",
    allowedHosts:["meti.go.jp"],
    genre:"whitepaper",sourceRole:"institutional_position",
    domains:["economy","industry","trade","energy"],
    task:"Use a current white-paper section with charts or cited evidence and identify how the ministry moves from description to policy implication.",
    citationHint:"Keep the white-paper title/year and section. When a chart matters, note its stated source separately."
  },
  {
    id:"estat",
    title:"政府統計の総合窓口 e-Stat",
    publisher:"政府統計",
    url:"https://www.e-stat.go.jp/",
    allowedHosts:["e-stat.go.jp"],
    genre:"statistics",sourceRole:"primary_data",
    domains:["society","economy","population","labour"],
    task:"Find one statistical table relevant to a claim in another source. Record measure, unit, population, period and any denominator.",
    citationHint:"Cite the specific statistic/table and survey, not only the e-Stat home page. Do not turn correlation into causation."
  },
  {
    id:"riken-press",
    title:"研究成果（プレスリリース）",
    publisher:"理化学研究所",
    url:"https://www.riken.jp/press/",
    allowedHosts:["riken.jp"],
    genre:"research_release",sourceRole:"research",
    domains:["science","health","technology"],
    task:"Choose a recent Japanese research release and distinguish the reported result from implications, future applications and uncertainty.",
    citationHint:"Record release date and linked paper when available. A press release summarizes research; it is not the paper itself."
  },
  {
    id:"jstage",
    title:"J-STAGE",
    publisher:"科学技術振興機構",
    url:"https://www.jstage.jst.go.jp/browse/-char/ja",
    allowedHosts:["jstage.jst.go.jp"],
    genre:"academic_article",sourceRole:"research",
    domains:["science","society","language","economics","education"],
    task:"Select one Japanese-language article or review. Read at least the abstract plus the sections needed to identify method, result and limitation.",
    citationHint:"Record article title, authors, journal, year and URL/DOI. Distinguish the authors' findings from your inference."
  },
  {
    id:"rieti",
    title:"ディスカッション・ペーパー（日本語）",
    publisher:"経済産業研究所 RIETI",
    url:"https://www.rieti.go.jp/jp/publications/act_dp.html",
    allowedHosts:["rieti.go.jp"],
    genre:"policy_research",sourceRole:"research",
    domains:["economy","policy","labour","trade"],
    task:"Choose one Japanese discussion paper or non-technical summary and identify research question, design, result and policy caveat.",
    citationHint:"Record paper number/year and authors. Keep empirical results separate from the policy recommendation."
  },
  {
    id:"ndl-issue",
    title:"調査と情報―ISSUE BRIEF―",
    publisher:"国立国会図書館 調査及び立法考査局",
    url:"https://www.ndl.go.jp/diet/publication/issue",
    allowedHosts:["ndl.go.jp"],
    genre:"legislative_brief",sourceRole:"analysis",
    domains:["law","policy","society","economy"],
    task:"Choose an issue brief and map the competing positions, institutional background and unresolved points.",
    citationHint:"Record issue number/date and author. The brief is analytical secondary material, not the underlying law or dataset."
  },
  {
    id:"egov-law",
    title:"e-Gov 法令検索",
    publisher:"デジタル庁 / e-Gov",
    url:"https://laws.e-gov.go.jp/",
    allowedHosts:["laws.e-gov.go.jp"],
    genre:"legislation",sourceRole:"primary_law",
    domains:["law","technology","administration"],
    task:"Open the exact statute/article relevant to a policy claim and explain what the text actually requires, permits or defines.",
    citationHint:"Record law name and article number. Do not infer court interpretation or enforcement practice from statutory wording alone."
  },
  {
    id:"boj",
    title:"講演・記者会見・談話",
    publisher:"日本銀行",
    url:"https://www.boj.or.jp/about/press/",
    allowedHosts:["boj.or.jp"],
    genre:"speech_press",sourceRole:"institutional_position",
    domains:["economy","finance","policy"],
    task:"Choose one Japanese speech or press-conference summary and track stance, evidence, uncertainty and audience-sensitive phrasing.",
    citationHint:"Record speaker, date and event. Treat it as an institutional communication source, not independent economic evidence."
  },
  {
    id:"digital-policy",
    title:"政策",
    publisher:"デジタル庁",
    url:"https://www.digital.go.jp/policies",
    allowedHosts:["digital.go.jp"],
    genre:"policy_site",sourceRole:"institutional_position",
    domains:["technology","administration","society"],
    task:"Choose one policy or evaluation page and separate objective, implementation mechanism, evaluation evidence and unresolved risk.",
    citationHint:"Record exact policy/evaluation page and update date where shown. Policy descriptions are first-party sources."
  },
  {
    id:"ipss-population",
    title:"人口問題研究資料",
    publisher:"国立社会保障・人口問題研究所",
    url:"https://www.ipss.go.jp/publication/j/shiryou/jinkokenshiryou.html",
    allowedHosts:["ipss.go.jp"],
    genre:"demographic_report",sourceRole:"research",
    domains:["population","society","welfare"],
    task:"Use one population projection or statistical report and record assumptions, reference year and projection horizon before making an argument.",
    citationHint:"Projection is conditional on assumptions. Cite edition/year and distinguish observed statistics from projected values."
  }
];

export const c1WritingProjects:C1WritingProject[]=[
  {
    id:"p15-evidence-review",
    title:"Evidence review: what can actually be concluded?",
    domain:"research + evidence",
    brief:"Choose a contested or uncertain question. Build a source map that includes primary data or law where relevant, research/analysis, and an institutional source. Write a review that separates observation, interpretation, causal inference and unresolved uncertainty.",
    deliverable:"1,000–1,500 Japanese characters with explicit source references and a delayed revision.",
    minimumSources:3,minimumGenres:3,minimumPublishers:2,draftMinimumCharacters:850,revisionMinimumCharacters:1000,requiredDefenseTurns:2,
    targetMoves:["根拠と解釈を分ける","因果を断定しすぎない","資料間の不一致を扱う","結論の射程を限定する"],
    recommendedPortalIds:["estat","jstage","rieti","ndl-issue"]
  },
  {
    id:"p15-policy-memo",
    title:"Policy memo: recommendation under real constraints",
    domain:"governance + policy",
    brief:"Build a recommendation from at least four evaluated sources. Include institutional position, evidence, implementation constraints and where applicable the legal text itself. The memo must state who should act, what should change and what would trigger reconsideration.",
    deliverable:"1,100–1,700 Japanese characters, two live defenses and a next-day revision.",
    minimumSources:4,minimumGenres:3,minimumPublishers:3,draftMinimumCharacters:950,revisionMinimumCharacters:1100,requiredDefenseTurns:2,
    targetMoves:["提言を具体化する","制度上の制約を示す","反対論を先取りする","見直し条件を明示する"],
    recommendedPortalIds:["env-whitepaper","meti-whitepaper","ndl-issue","egov-law","estat"]
  },
  {
    id:"p15-science-explainer",
    title:"Science explainer: result, mechanism and uncertainty",
    domain:"science + public communication",
    brief:"Start from a Japanese research release, locate an academic source when possible, and use a third source for context. Explain the result for an educated non-specialist without exaggerating novelty, causality or application readiness.",
    deliverable:"900–1,400 Japanese characters plus an oral defense aimed at a skeptical reader.",
    minimumSources:3,minimumGenres:2,minimumPublishers:2,draftMinimumCharacters:750,revisionMinimumCharacters:900,requiredDefenseTurns:2,
    targetMoves:["研究結果と応用可能性を分ける","方法上の限界を説明する","専門語を言い換える","不確実性を残す"],
    recommendedPortalIds:["riken-press","jstage","mext-whitepaper"]
  },
  {
    id:"p15-institutional-analysis",
    title:"Institutional analysis: compare what different actors say",
    domain:"institutions + public argument",
    brief:"Compare first-party institutional communication with independent analysis and data. Identify where disagreement is factual, definitional, normative or caused by different time horizons.",
    deliverable:"1,000–1,500 Japanese characters with at least three source genres and explicit treatment of source purpose.",
    minimumSources:3,minimumGenres:3,minimumPublishers:3,draftMinimumCharacters:850,revisionMinimumCharacters:1000,requiredDefenseTurns:2,
    targetMoves:["発信目的を考慮する","事実認識と価値判断を分ける","論点を狭める","複数の時間軸を扱う"],
    recommendedPortalIds:["boj","digital-policy","ndl-issue","rieti","estat"]
  },
  {
    id:"p15-cross-domain-dossier",
    title:"Cross-domain dossier: transfer a framework without forcing it",
    domain:"cross-domain transfer",
    brief:"Choose one analytical framework and test it across two genuinely different domains. Use at least four evaluated sources from four genres. Explain where the framework transfers, where it fails and which assumptions caused the failure.",
    deliverable:"1,200–1,800 Japanese characters, two unpredictable defenses and delayed reconstruction.",
    minimumSources:4,minimumGenres:4,minimumPublishers:3,draftMinimumCharacters:1050,revisionMinimumCharacters:1200,requiredDefenseTurns:2,
    targetMoves:["共通枠組みを明示する","領域差を無視しない","前提の破綻を説明する","一般化の限界を示す"],
    recommendedPortalIds:["env-whitepaper","jstage","egov-law","boj","ipss-population","mext-whitepaper"]
  }
];

export const c1PressureChallenges:C1PressureChallenge[]=[
  {id:"p15-pressure-causal",type:"causal_overclaim",title:"Causal overclaim",sourceAware:true,prompt:"A reviewer says your evidence shows association or sequence, not causation. Defend only the causal claim you can justify and explicitly weaken the rest.",goals:["因果と相関を区別する","主張の強さを調整する","追加証拠を示す"]},
  {id:"p15-pressure-credibility",type:"source_credibility",title:"Source credibility challenge",sourceAware:true,prompt:"A reviewer questions whether one of your sources is sufficiently independent or authoritative for the claim you use it to support. Reassess the source's role without discarding useful information automatically.",goals:["情報源の立場を示す","一次・二次情報を区別する","代替根拠を提案する"]},
  {id:"p15-pressure-conflict",type:"conflicting_evidence",title:"Conflicting evidence",sourceAware:true,prompt:"New evidence points in a different direction from one of your main sources. Explain whether the conflict is real, methodological, temporal or definitional and revise your conclusion.",goals:["不一致を分類する","結論を更新する","未解決点を残す"]},
  {id:"p15-pressure-counterexample",type:"counterexample",title:"Counterexample",sourceAware:false,prompt:"A concrete counterexample appears to violate your general claim. Decide whether it falsifies the claim, narrows its scope or exposes a hidden assumption.",goals:["反例を正面から扱う","射程を限定する","前提を明示する"]},
  {id:"p15-pressure-definition",type:"definition_shift",title:"Definition shift",sourceAware:true,prompt:"Two sources use the same key term with different operational meanings. Explain the difference and show how it changes the comparison.",goals:["定義を比較する","測定方法を確認する","見かけの矛盾を避ける"]},
  {id:"p15-pressure-stakeholder",type:"stakeholder_objection",title:"Stakeholder objection",sourceAware:false,prompt:"A stakeholder who bears most of the cost rejects your recommendation. Respond without merely repeating the aggregate benefit.",goals:["負担の偏りを認める","補償・段階導入を検討する","提言を具体化する"]},
  {id:"p15-pressure-legal",type:"legal_constraint",title:"Legal constraint",sourceAware:true,prompt:"A legal or procedural constraint makes your preferred implementation impossible as written. Reframe the recommendation so it remains useful within the constraint.",goals:["法的事実を推測しない","制約と目的を分ける","実行可能な代替案を示す"]},
  {id:"p15-pressure-implementation",type:"implementation_constraint",title:"Implementation constraint",sourceAware:false,prompt:"Budget, staffing or institutional capacity is cut by half. State which part of your proposal survives and what must be deferred or redesigned.",goals:["優先順位を示す","実現可能性を再評価する","副作用を認める"]},
  {id:"p15-pressure-number",type:"numerical_inconsistency",title:"Numerical inconsistency",sourceAware:true,prompt:"Two numerical claims seem inconsistent. Before choosing one, explain what units, denominators, populations, dates or definitions you would verify.",goals:["分母を確認する","期間・母集団を確認する","数字だけで結論を出さない"]},
  {id:"p15-pressure-uncertainty",type:"uncertainty",title:"Uncertainty pressure",sourceAware:false,prompt:"You must advise a decision maker before the evidence is complete. Give a useful recommendation while preserving the most important uncertainty.",goals:["暫定結論を示す","不確実性を優先順位化する","見直し条件を示す"]},
  {id:"p15-pressure-audience",type:"audience_shift",title:"Audience shift",sourceAware:false,prompt:"Your audience changes from specialists to informed members of the public. Restate the core argument without losing the important caveat.",goals:["専門語を調整する","論理を単純化しすぎない","留保を維持する"]},
  {id:"p15-pressure-register",type:"register_shift",title:"Register shift",sourceAware:false,prompt:"Deliver the same position in formal institutional Japanese rather than conversational explanation. Preserve substance while changing register and rhetorical organization.",goals:["文体を調整する","責任主体を明確にする","断定度を保つ"]},
  {id:"p15-pressure-ethics",type:"ethical_tradeoff",title:"Ethical trade-off",sourceAware:false,prompt:"A policy that improves the average outcome creates a serious burden for a smaller group. Explain how that changes your recommendation.",goals:["平均値だけを見ない","分配上の問題を示す","価値判断を事実と分ける"]},
  {id:"p15-pressure-time",type:"time_pressure",title:"One-minute answer",sourceAware:false,prompt:"You have one minute. State your conclusion, strongest evidence, largest limitation and next action without giving background first.",goals:["結論を先に述べる","根拠を一つ選ぶ","最大の留保を残す"]},
  {id:"p15-pressure-scope",type:"scope_narrowing",title:"Scope narrowing",sourceAware:true,prompt:"Your claim is too broad for the population, period or setting covered by the evidence. Narrow it precisely and state what remains unknown outside that scope.",goals:["対象範囲を限定する","外的妥当性を区別する","未知の範囲を示す"]},
  {id:"p15-pressure-rebuttal",type:"direct_rebuttal",title:"Direct rebuttal",sourceAware:false,prompt:"A well-informed opponent gives the strongest version of the opposing argument. Concede what is valid, identify the decisive disagreement and answer only that point.",goals:["譲歩する","論点を一つに絞る","相手を弱く描かない"]}
];

export function portalById(id:string):C1SourcePortal{
  const portal=c1SourcePortals.find((item)=>item.id===id);
  if(!portal)throw new Error("UNKNOWN_P15_SOURCE_PORTAL:"+id);
  return portal;
}

export function projectById(id:string):C1WritingProject{
  const project=c1WritingProjects.find((item)=>item.id===id);
  if(!project)throw new Error("UNKNOWN_P15_WRITING_PROJECT:"+id);
  return project;
}

export function pressureById(id:string):C1PressureChallenge{
  const pressure=c1PressureChallenges.find((item)=>item.id===id);
  if(!pressure)throw new Error("UNKNOWN_P15_PRESSURE:"+id);
  return pressure;
}

export function isPortalUrl(portal:C1SourcePortal,value:string):boolean{
  try{
    const url=new URL(value);
    if(url.protocol!=="https:")return false;
    const host=url.hostname.toLowerCase();
    return portal.allowedHosts.some((allowed)=>host===allowed||host.endsWith("."+allowed));
  }catch{return false;}
}

export async function registerC1ExternalSource(input:{portalId:string;title:string;url:string;domain?:string}):Promise<C1RegisteredSource>{
  const portal=portalById(input.portalId);
  const title=input.title.trim();
  const url=input.url.trim();
  if(title.length<6)throw new Error("P15_SOURCE_TITLE_TOO_SHORT");
  if(!isPortalUrl(portal,url))throw new Error("P15_SOURCE_URL_NOT_FROM_SELECTED_PORTAL");
  const domain=input.domain?.trim()||portal.domains[0]!;
  const source:C1RegisteredSource={
    id:"p15-source-"+crypto.randomUUID(),
    portalId:portal.id,title,url,publisher:portal.publisher,genre:portal.genre,sourceRole:portal.sourceRole,domain,
    registeredAt:new Date().toISOString()
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",primaryTarget:{kind:"document",id:source.id},promptFamily:"p15-c1-source-register",responseMode:"external-source",
    result:"skipped",contextId:"p15-c1-source-desk",sourceId:source.id,
    metadata:{p15C1Environment:true,p15SourceRegistration:true,sourceRecord:source,externalReferenceOnly:true,semanticGrading:false}
  }));
  return source;
}

export async function evaluateC1ExternalSource(input:{
  sourceId:string;claim:string;evidence:string;limitation:string;rhetoricOrPurpose:string;confidence:C1SourceEvaluationConfidence;
}):Promise<C1SourceEvaluation>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const source=sourceRecordsFromEvents(events).find((item)=>item.id===input.sourceId);
  if(!source)throw new Error("UNKNOWN_P15_SOURCE:"+input.sourceId);
  const claim=input.claim.trim(),evidence=input.evidence.trim(),limitation=input.limitation.trim(),rhetoric=input.rhetoricOrPurpose.trim();
  if(claim.length<45)throw new Error("P15_SOURCE_CLAIM_TOO_SHORT");
  if(evidence.length<45)throw new Error("P15_SOURCE_EVIDENCE_TOO_SHORT");
  if(limitation.length<30)throw new Error("P15_SOURCE_LIMITATION_TOO_SHORT");
  if(rhetoric.length<25)throw new Error("P15_SOURCE_PURPOSE_TOO_SHORT");
  const evaluation:C1SourceEvaluation={
    sourceId:source.id,evaluatedAt:new Date().toISOString(),claim,evidence,limitation,rhetoricOrPurpose:rhetoric,confidence:input.confidence
  };
  await saveStudyEvent(baseEvent({
    activity:"reading",primaryTarget:{kind:"document",id:source.id},promptFamily:"p15-c1-source-evaluation",responseMode:"source-analysis",
    result:"skipped",contextId:source.id,sourceId:source.id,
    metadata:{
      p15C1Environment:true,p15SourceEvaluation:true,sourceId:source.id,sourceUrl:source.url,publisher:source.publisher,
      sourceGenre:source.genre,sourceRole:source.sourceRole,evaluation,semanticGrading:false,modelFeedbackAppliedToMastery:false
    }
  }));
  return evaluation;
}

export async function saveC1SpecialistTerm(input:{
  sourceId:string;canonicalForm:string;reading?:string;meaning:string;context:string;
}):Promise<C1SpecialistTerm>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const source=sourceRecordsFromEvents(events).find((item)=>item.id===input.sourceId);
  if(!source)throw new Error("UNKNOWN_P15_SOURCE:"+input.sourceId);
  const canonicalForm=input.canonicalForm.trim(),meaning=input.meaning.trim(),context=input.context.trim(),reading=input.reading?.trim();
  if(canonicalForm.length<1||meaning.length<2)throw new Error("P15_SPECIALIST_TERM_REQUIRES_FORM_AND_MEANING");
  if(context.length<12)throw new Error("P15_SPECIALIST_TERM_REQUIRES_CONTEXT");
  const candidateId="private-lex-p15-"+stableHash(canonicalForm.normalize("NFKC"));
  const existing=(await listPrivateVocabulary(DEVELOPMENT_ACCOUNT_ID)).find((item)=>item.id===candidateId||item.canonicalForm.normalize("NFKC")===canonicalForm.normalize("NFKC"));
  const id=existing?.id??candidateId;
  const now=new Date().toISOString();
  await savePrivateVocabulary(DEVELOPMENT_ACCOUNT_ID,existing?{
    ...existing,meaning,updatedAt:now,...(reading?{reading}:{}),sourceDocumentIds:[...new Set([...existing.sourceDocumentIds,source.id])]
  }:{
    id,accountId:DEVELOPMENT_ACCOUNT_ID,canonicalForm,...(reading?{reading}:{}),meaning,sourceDocumentIds:[source.id],createdAt:now,updatedAt:now
  });
  const term:C1SpecialistTerm={id,sourceId:source.id,canonicalForm,...(reading?{reading}:{}),meaning,context,domain:source.domain,savedAt:now};
  await saveStudyEvent(baseEvent({
    activity:"mining",primaryTarget:{kind:"lexeme",id},promptFamily:"p15-c1-specialist-term",responseMode:"source-mining",
    result:"skipped",contextId:source.id,sourceId:source.id,
    metadata:{p15C1Environment:true,p15SpecialistTerm:true,term,sourceUrl:source.url,privateVocabulary:true,semanticGrading:false}
  }));
  return term;
}

export async function saveC1ProjectSourceMap(input:{projectId:string;sourceIds:string[];thesis:string}):Promise<C1ProjectSourceMap>{
  const project=projectById(input.projectId);
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const existingProgress=buildC1WritingProjectProgress(events).find((item)=>item.project.id===project.id)!;
  if(existingProgress.draft)throw new Error("P15_PROJECT_SOURCE_MAP_LOCKED_AFTER_DRAFT");
  const sources=sourceRecordsFromEvents(events);
  const latestEvaluations=evaluationRecordsFromEvents(events);
  const evaluationIds=new Set(latestEvaluations.map((item)=>item.sourceId));
  const selected=[...new Set(input.sourceIds)].map((id)=>sources.find((source)=>source.id===id)).filter((item):item is C1RegisteredSource=>Boolean(item));
  if(selected.length<project.minimumSources)throw new Error("P15_PROJECT_NEEDS_MORE_SOURCES");
  if(selected.some((source)=>!evaluationIds.has(source.id)))throw new Error("P15_PROJECT_SOURCES_REQUIRE_EVALUATION");
  if(new Set(selected.map((source)=>source.genre)).size<project.minimumGenres)throw new Error("P15_PROJECT_NEEDS_MORE_SOURCE_GENRES");
  if(new Set(selected.map((source)=>source.publisher)).size<project.minimumPublishers)throw new Error("P15_PROJECT_NEEDS_MORE_PUBLISHERS");
  const thesis=input.thesis.trim();
  if(thesis.length<70)throw new Error("P15_PROJECT_THESIS_TOO_SHORT");
  const citationKeys=Object.fromEntries(selected.map((source,index)=>[source.id,"S"+(index+1)]));
  const map:C1ProjectSourceMap={projectId:project.id,occurredAt:new Date().toISOString(),thesis,sourceIds:selected.map((source)=>source.id),citationKeys};
  await saveStudyEvent(baseEvent({
    activity:"writing",promptFamily:"p15-c1-project-source-map",responseMode:"source-map",result:"skipped",contextId:project.id,
    metadata:{p15C1Environment:true,p15WritingProject:true,projectId:project.id,projectStage:"source_map",sourceMap:map,semanticGrading:false}
  }));
  return map;
}

export async function saveC1ProjectDraft(input:{projectId:string;text:string}):Promise<C1ProjectArtifact>{
  const project=projectById(input.projectId);
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const progress=buildC1WritingProjectProgress(events).find((item)=>item.project.id===project.id)!;
  if(!progress.sourceMap)throw new Error("P15_PROJECT_SOURCE_MAP_REQUIRED");
  const text=input.text.trim();
  if(text.length<project.draftMinimumCharacters)throw new Error("P15_PROJECT_DRAFT_TOO_SHORT");
  const citationKeys=validateCitations(text,progress.sourceMap);
  const artifact={occurredAt:new Date().toISOString(),text,citationKeys};
  await saveStudyEvent(baseEvent({
    activity:"writing",promptFamily:"p15-c1-project-draft",responseMode:"textarea",result:"skipped",contextId:project.id,
    metadata:{
      p15C1Environment:true,p15WritingProject:true,projectId:project.id,projectStage:"draft",learnerDraft:text,citationKeys,
      sourceIds:progress.sourceMap.sourceIds,semanticGrading:false,modelFeedbackAppliedToMastery:false
    }
  }));
  return artifact;
}

export async function recordC1ProjectDefense(input:{
  projectId:string;pressureId:string;response:string;inputMode:"text"|"speech";sourceId?:string;
}):Promise<C1ProjectDefense>{
  const project=projectById(input.projectId);
  const pressure=pressureById(input.pressureId);
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const progress=buildC1WritingProjectProgress(events).find((item)=>item.project.id===project.id)!;
  if(!progress.draft)throw new Error("P15_PROJECT_DRAFT_REQUIRED_BEFORE_DEFENSE");
  if(input.sourceId&&!progress.sourceMap?.sourceIds.includes(input.sourceId))throw new Error("P15_DEFENSE_SOURCE_NOT_IN_PROJECT");
  const response=input.response.trim();
  if(response.length<100)throw new Error("P15_DEFENSE_RESPONSE_TOO_SHORT");
  const defense:C1ProjectDefense={
    occurredAt:new Date().toISOString(),pressureId:pressure.id,pressureType:pressure.type,response,inputMode:input.inputMode,
    ...(input.sourceId?{sourceId:input.sourceId}:{})
  };
  await saveStudyEvent(baseEvent({
    activity:"speaking",promptFamily:"p15-c1-live-defense",responseMode:input.inputMode==="speech"?"speech-recognition-transcript":"typed-speaking-proxy",
    result:"skipped",contextId:project.id,
    metadata:{
      p15C1Environment:true,p15WritingProject:true,p15LiveDefense:true,projectId:project.id,projectStage:"defense",
      pressureId:pressure.id,pressureType:pressure.type,pressurePrompt:pressure.prompt,learnerResponse:response,inputMode:input.inputMode,
      ...(input.sourceId?{sourceId:input.sourceId}:{}),semanticGrading:false,acousticScore:false,modelFeedbackAppliedToMastery:false
    }
  }));
  return defense;
}

export async function saveC1ProjectRevision(input:{projectId:string;text:string}):Promise<C1ProjectArtifact>{
  const project=projectById(input.projectId);
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const progress=buildC1WritingProjectProgress(events).find((item)=>item.project.id===project.id)!;
  if(!progress.draft||!progress.sourceMap)throw new Error("P15_PROJECT_DRAFT_REQUIRED");
  if(progress.defenses.length<project.requiredDefenseTurns)throw new Error("P15_PROJECT_DEFENSES_REQUIRED");
  const distinctPressure=new Set(progress.defenses.map((item)=>item.pressureType)).size;
  if(distinctPressure<project.requiredDefenseTurns)throw new Error("P15_PROJECT_DEFENSES_MUST_DIFFER");
  if(progress.delayHours<20)throw new Error("P15_PROJECT_REVISION_DELAY_NOT_MET");
  const text=input.text.trim();
  if(text.length<project.revisionMinimumCharacters)throw new Error("P15_PROJECT_REVISION_TOO_SHORT");
  const citationKeys=validateCitations(text,progress.sourceMap);
  if(text===progress.draft.text)throw new Error("P15_PROJECT_REVISION_MUST_CHANGE");
  const artifact={occurredAt:new Date().toISOString(),text,citationKeys};
  await saveStudyEvent(baseEvent({
    activity:"writing",promptFamily:"p15-c1-project-delayed-revision",responseMode:"textarea",result:"skipped",contextId:project.id,
    metadata:{
      p15C1Environment:true,p15WritingProject:true,projectId:project.id,projectStage:"revision",learnerRevision:text,
      citationKeys,sourceIds:progress.sourceMap.sourceIds,revisionDelayHours:Math.round(progress.delayHours),semanticGrading:false
    }
  }));
  return artifact;
}

export async function saveC1ProjectReflection(input:{projectId:string;text:string}):Promise<void>{
  const project=projectById(input.projectId);
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const progress=buildC1WritingProjectProgress(events).find((item)=>item.project.id===project.id)!;
  if(!progress.revision)throw new Error("P15_PROJECT_REVISION_REQUIRED");
  const text=input.text.trim();
  if(text.length<120)throw new Error("P15_PROJECT_REFLECTION_TOO_SHORT");
  await saveStudyEvent(baseEvent({
    activity:"writing",promptFamily:"p15-c1-project-reflection",responseMode:"textarea",result:"skipped",contextId:project.id,
    metadata:{
      p15C1Environment:true,p15WritingProject:true,projectId:project.id,projectStage:"reflection",learnerReflection:text,
      semanticGrading:false,accreditedCefrVerdict:false
    }
  }));
}

export function drawC1PressureChallenge(excludeIds:readonly string[]=[],randomValue?:number):C1PressureChallenge{
  const available=c1PressureChallenges.filter((item)=>!excludeIds.includes(item.id));
  const pool=available.length?available:c1PressureChallenges;
  const value=randomValue??secureRandom();
  const index=Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,value))*pool.length));
  return pool[index]!;
}

export async function getC1EnvironmentProgress():Promise<C1EnvironmentProgress>{
  return buildC1EnvironmentProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildC1EnvironmentProgress(events:readonly StudyEvent[]):C1EnvironmentProgress{
  const sources=sourceRecordsFromEvents(events);
  const evaluations=evaluationRecordsFromEvents(events);
  const terms=specialistTermRecordsFromEvents(events);
  const projects=buildC1WritingProjectProgress(events);
  const environmentEvents=events.filter((event)=>event.metadata?.p15C1Environment===true);
  const defenses=projects.flatMap((project)=>project.defenses);
  return {
    activeDays:new Set(environmentEvents.map((event)=>event.occurredAt.slice(0,10))).size,
    registeredSources:sources.length,
    evaluatedSources:new Set(evaluations.map((item)=>item.sourceId)).size,
    sourceGenres:new Set(sources.map((item)=>item.genre)).size,
    sourcePublishers:new Set(sources.map((item)=>item.publisher)).size,
    specialistTerms:new Set(terms.map((item)=>item.id)).size,
    writingProjectsStarted:projects.filter((item)=>Boolean(item.sourceMap||item.draft||item.defenses.length||item.revision||item.reflection)).length,
    writingProjectsCompleted:projects.filter((item)=>item.complete).length,
    defenseTurns:defenses.length,
    uniquePressureTypes:new Set(defenses.map((item)=>item.pressureType)).size,
    sourceEvaluations:evaluations,sources,specialistTermItems:terms,projects
  };
}

export function buildC1WritingProjectProgress(events:readonly StudyEvent[],nowMs=Date.now()):C1WritingProjectProgress[]{
  return c1WritingProjects.map((project)=>{
    const relevant=events.filter((event)=>event.metadata?.p15WritingProject===true&&event.metadata?.projectId===project.id)
      .sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt));
    const sourceMapEvent=[...relevant].reverse().find((event)=>event.metadata?.projectStage==="source_map");
    const draftEvent=[...relevant].reverse().find((event)=>event.metadata?.projectStage==="draft");
    const sourceMap=sourceMapEvent?readSourceMap(sourceMapEvent):undefined;
    const draft=draftEvent?readArtifact(draftEvent,"learnerDraft"):undefined;
    const revisionEvent=[...relevant].reverse().find((event)=>event.metadata?.projectStage==="revision"&&(!draft||event.occurredAt>=draft.occurredAt));
    const revision=revisionEvent?readArtifact(revisionEvent,"learnerRevision"):undefined;
    const reflectionEvent=[...relevant].reverse().find((event)=>event.metadata?.projectStage==="reflection"&&(!revision||event.occurredAt>=revision.occurredAt));
    const reflectionText=typeof reflectionEvent?.metadata?.learnerReflection==="string"?reflectionEvent.metadata.learnerReflection:"";
    const reflection=reflectionEvent&&reflectionText?{occurredAt:reflectionEvent.occurredAt,text:reflectionText}:undefined;
    const defenses: C1ProjectDefense[]=relevant.filter((event)=>event.metadata?.projectStage==="defense"&&(!draft||event.occurredAt>=draft.occurredAt)).map((event)=>({
      occurredAt:event.occurredAt,
      pressureId:String(event.metadata?.pressureId??""),
      pressureType:String(event.metadata?.pressureType??"direct_rebuttal") as C1PressureType,
      response:String(event.metadata?.learnerResponse??""),
      inputMode:(event.metadata?.inputMode==="speech"?"speech":"text") as C1ProjectDefense["inputMode"],
      ...(typeof event.metadata?.sourceId==="string"?{sourceId:event.metadata.sourceId}:{})
    })).filter((item)=>item.pressureId&&item.response);
    const delayHours=draft?Math.max(0,(nowMs-Date.parse(draft.occurredAt))/3_600_000):0;
    const defenseReady=defenses.length>=project.requiredDefenseTurns&&new Set(defenses.map((item)=>item.pressureType)).size>=project.requiredDefenseTurns;
    const nextStage:C1WritingProjectStage=!sourceMap?"source_map":!draft?"draft":!defenseReady?"defense":!revision&&delayHours<20?"waiting_revision":!revision?"revision":!reflection?"reflection":"complete";
    return {
      project,...(sourceMap?{sourceMap}:{}),...(draft?{draft}:{}),defenses,...(revision?{revision}:{}),...(reflection?{reflection}:{}),
      delayHours,...(draft?{revisionUnlockAt:new Date(Date.parse(draft.occurredAt)+DELAY_MS).toISOString()}:{}),
      nextStage,complete:nextStage==="complete"
    };
  });
}

export function citationEntries(map:C1ProjectSourceMap,sources:readonly C1RegisteredSource[]):Array<{key:string;source:C1RegisteredSource}>{
  return map.sourceIds.map((id)=>({key:map.citationKeys[id]!,source:sources.find((source)=>source.id===id)!})).filter((entry)=>Boolean(entry.source));
}

function sourceRecordsFromEvents(events:readonly StudyEvent[]):C1RegisteredSource[]{
  const byId=new Map<string,C1RegisteredSource>();
  for(const event of events.filter((item)=>item.metadata?.p15SourceRegistration===true).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const raw=event.metadata?.sourceRecord;
    if(!raw||typeof raw!=="object")continue;
    const item=raw as Partial<C1RegisteredSource>;
    if(!item.id||!item.portalId||!item.title||!item.url||!item.publisher||!item.genre||!item.sourceRole||!item.domain)continue;
    byId.set(item.id,{
      id:item.id,portalId:item.portalId,title:item.title,url:item.url,publisher:item.publisher,genre:item.genre,
      sourceRole:item.sourceRole,domain:item.domain,registeredAt:item.registeredAt??event.occurredAt
    });
  }
  return [...byId.values()].sort((a,b)=>b.registeredAt.localeCompare(a.registeredAt));
}

function evaluationRecordsFromEvents(events:readonly StudyEvent[]):C1SourceEvaluation[]{
  const bySource=new Map<string,C1SourceEvaluation>();
  for(const event of events.filter((item)=>item.metadata?.p15SourceEvaluation===true).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const raw=event.metadata?.evaluation;
    if(!raw||typeof raw!=="object")continue;
    const item=raw as Partial<C1SourceEvaluation>;
    if(!item.sourceId||!item.claim||!item.evidence||!item.limitation||!item.rhetoricOrPurpose||!item.confidence)continue;
    bySource.set(item.sourceId,{
      sourceId:item.sourceId,evaluatedAt:item.evaluatedAt??event.occurredAt,claim:item.claim,evidence:item.evidence,
      limitation:item.limitation,rhetoricOrPurpose:item.rhetoricOrPurpose,confidence:item.confidence
    });
  }
  return [...bySource.values()].sort((a,b)=>b.evaluatedAt.localeCompare(a.evaluatedAt));
}

function specialistTermRecordsFromEvents(events:readonly StudyEvent[]):C1SpecialistTerm[]{
  const byId=new Map<string,C1SpecialistTerm>();
  for(const event of events.filter((item)=>item.metadata?.p15SpecialistTerm===true).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const raw=event.metadata?.term;
    if(!raw||typeof raw!=="object")continue;
    const item=raw as Partial<C1SpecialistTerm>;
    if(!item.id||!item.sourceId||!item.canonicalForm||!item.meaning||!item.context||!item.domain)continue;
    byId.set(item.id,{
      id:item.id,sourceId:item.sourceId,canonicalForm:item.canonicalForm,...(item.reading?{reading:item.reading}:{}),
      meaning:item.meaning,context:item.context,domain:item.domain,savedAt:item.savedAt??event.occurredAt
    });
  }
  return [...byId.values()].sort((a,b)=>b.savedAt.localeCompare(a.savedAt));
}

function readSourceMap(event:StudyEvent):C1ProjectSourceMap|undefined{
  const raw=event.metadata?.sourceMap;
  if(!raw||typeof raw!=="object")return undefined;
  const value=raw as Partial<C1ProjectSourceMap>;
  if(!value.projectId||!value.thesis||!Array.isArray(value.sourceIds)||!value.citationKeys||typeof value.citationKeys!=="object")return undefined;
  return {
    projectId:value.projectId,occurredAt:value.occurredAt??event.occurredAt,thesis:value.thesis,
    sourceIds:value.sourceIds.filter((id):id is string=>typeof id==="string"),citationKeys:value.citationKeys as Record<string,string>
  };
}

function readArtifact(event:StudyEvent,key:"learnerDraft"|"learnerRevision"):C1ProjectArtifact|undefined{
  const text=event.metadata?.[key];
  if(typeof text!=="string"||!text.trim())return undefined;
  const citationKeys=Array.isArray(event.metadata?.citationKeys)?event.metadata!.citationKeys.filter((item):item is string=>typeof item==="string"):[];
  return {occurredAt:event.occurredAt,text,citationKeys};
}

function validateCitations(text:string,map:C1ProjectSourceMap):string[]{
  const required=Object.values(map.citationKeys);
  const found=[...new Set([...text.matchAll(/\[(S\d+)\]/g)].map((match)=>match[1]!))];
  if(required.some((key)=>!found.includes(key)))throw new Error("P15_PROJECT_MISSING_SOURCE_CITATIONS");
  return found.filter((key)=>required.includes(key));
}

function stableHash(value:string):string{
  let hash=2166136261;
  for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(36);
}

function secureRandom():number{
  if(typeof crypto!=="undefined"&&"getRandomValues" in crypto){
    const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]!/0x1_0000_0000;
  }
  return Math.random();
}

function baseEvent(input:Partial<StudyEvent>&Pick<StudyEvent,"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,occurredAt:new Date().toISOString(),
    contentVersion:coreContent.version,learnerModelVersion:"p15",...input
  };
}
