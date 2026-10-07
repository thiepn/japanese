import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";
import { getC1PrecisionProgress,type C1PrecisionProgress } from "./c1Precision";
import { getC1AdvancedInteractionProgress,type C1AdvancedInteractionProgress } from "./c1AdvancedInteraction";
import {
  getC1ProsodyEvaluationProgress,type C1ProsodyEvaluationProgress,type C2ExternalHumanReview,
  type C2ReviewDimension
} from "./c1ProsodyEvaluation";

const DAY_MS=24*60*60*1000;

export type C2ReadinessStatus=
  |"not_enough_evidence"
  |"consolidating"
  |"external_calibration_needed"
  |"reviewer_divergence"
  |"advanced_pathway_qualified";

export type C2DimensionStatus="unobserved"|"insufficient"|"weak"|"stable"|"strong";
export type C2CalibrationStatus="unavailable"|"single_reviewer_label"|"aligned"|"mixed"|"divergent";

export interface C2ReadinessRequirement{
  id:string;
  label:string;
  met:boolean;
  current:string;
  target:string;
  explanation:string;
}

export interface C2DimensionReadiness{
  dimension:C2ReviewDimension;
  label:string;
  internalEvidenceCount:number;
  internalSupport:"low"|"developing"|"substantial";
  broadObservations:number;
  allObservations:number;
  meanScore:number|null;
  latestScore:number|null;
  earliestScore:number|null;
  trend:number|null;
  spread:number|null;
  status:C2DimensionStatus;
  persistentWeakness:boolean;
}

export interface C2ReviewerCalibrationDimension{
  dimension:C2ReviewDimension;
  label:string;
  earlier:number|null;
  later:number|null;
  delta:number|null;
}

export interface C2ReviewerCalibration{
  status:C2CalibrationStatus;
  earlierReviewId?:string;
  laterReviewId?:string;
  earlierReviewer?:string;
  laterReviewer?:string;
  distinctReviewerLabels:number;
  reviewSpanDays:number;
  meanAbsoluteDelta:number|null;
  maxAbsoluteDelta:number|null;
  dimensions:C2ReviewerCalibrationDimension[];
  divergentDimensions:C2ReviewDimension[];
  identityVerified:false;
}

export interface C2ReadinessSummary{
  schema:"thiepn-japanese-c2-readiness";
  schemaVersion:1;
  generatedAt:string;
  status:C2ReadinessStatus;
  statusLabel:string;
  qualified:boolean;
  evidenceSpanDays:number;
  advancedActiveDays:number;
  requirements:C2ReadinessRequirement[];
  requirementsMet:number;
  dimensions:C2DimensionReadiness[];
  stableDimensions:number;
  strongDimensions:number;
  unresolvedWeakDimensions:C2ReviewDimension[];
  externalAverage:number|null;
  broadExternalReviews:number;
  distinctReviewerLabels:number;
  calibration:C2ReviewerCalibration;
  nextActions:string[];
  evidenceBoundary:{
    accreditedCefrCertification:false;
    productQualificationOnly:true;
    reviewerIdentityVerified:false;
    internalEvidenceIsSemanticScore:false;
    reviewerScoresChangeMastery:false;
    localAudioIncludedInExport:false;
  };
}

export interface C2ReadinessInputs{
  portfolio:C1PortfolioSummary;
  precision:C1PrecisionProgress;
  interaction:C1AdvancedInteractionProgress;
  p19:C1ProsodyEvaluationProgress;
}

export interface C2ReadinessReport{
  schema:"thiepn-japanese-advanced-pathway-readiness-report";
  schemaVersion:1;
  generatedAt:string;
  qualification:"internal advanced-pathway qualification";
  summary:C2ReadinessSummary;
}

const DIMENSIONS:Array<{id:C2ReviewDimension;label:string}>=[
  {id:"lexicalPrecision",label:"Lexical precision"},
  {id:"grammaticalControl",label:"Grammatical control"},
  {id:"discourseOrganization",label:"Discourse organization"},
  {id:"interactionRepair",label:"Interaction repair"},
  {id:"registerFlexibility",label:"Register flexibility"},
  {id:"prosodicControl",label:"Prosodic control"},
  {id:"listeningUnderPressure",label:"Listening under pressure"}
];

export async function getC2ReadinessSummary(now=new Date()):Promise<C2ReadinessSummary>{
  const [portfolio,precision,interaction,p19]=await Promise.all([
    getC1PortfolioSummary(),getC1PrecisionProgress(),getC1AdvancedInteractionProgress(),getC1ProsodyEvaluationProgress()
  ]);
  return buildC2ReadinessSummary({portfolio,precision,interaction,p19},now);
}

export function buildC2ReadinessSummary(input:C2ReadinessInputs,now=new Date()):C2ReadinessSummary{
  const {portfolio,precision,interaction,p19}=input;
  const allDates=collectAdvancedDates(input);
  const evidenceSpanDays=spanDays(allDates);
  const advancedActiveDays=Math.max(portfolio.activeDays,new Set(allDates.map(dayKey)).size);

  const broadReviews=p19.externalReviews.filter((review)=>review.broadCoverage).sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt));
  const reviewerLabels=new Set(broadReviews.map((review)=>normalizeReviewer(review.reviewerLabel)).filter(Boolean));
  const reviewSpanDays=spanDays(broadReviews.map((review)=>review.reviewedAt));
  const calibration=buildReviewerCalibration(broadReviews);
  const dimensions=buildDimensionReadiness(input,broadReviews,p19.externalReviews);
  const externalScores=dimensions.map((item)=>item.meanScore).filter((score):score is number=>score!==null);
  const externalAverage=externalScores.length?round2(externalScores.reduce((sum,score)=>sum+score,0)/externalScores.length):null;
  const unresolvedWeakDimensions=dimensions.filter((item)=>item.persistentWeakness||item.status==="weak").map((item)=>item.dimension);
  const stableDimensions=dimensions.filter((item)=>item.status==="stable"||item.status==="strong").length;
  const strongDimensions=dimensions.filter((item)=>item.status==="strong").length;

  const robustSessionDates=interaction.sessions.filter((session)=>session.robustPressureCoverage).map((session)=>session.firstAt);
  const humanDates=interaction.humanInteractions.map((item)=>item.occurredAt);
  const p19Dates=[...p19.prosodyCaptures.map((item)=>item.occurredAt),...p19.overlapAttempts.map((item)=>item.occurredAt)];
  const qualifyingDimensionCoverage=dimensions.filter((item)=>item.broadObservations>=2).length;
  const allDimensionsStable=dimensions.every((item)=>item.status==="stable"||item.status==="strong");

  const requirements:C2ReadinessRequirement[]=[
    {
      id:"longitudinal_window",label:"Longitudinal evidence window",
      met:evidenceSpanDays>=28&&advancedActiveDays>=8,
      current:evidenceSpanDays+" days · "+advancedActiveDays+" active days",
      target:"≥28 days · ≥8 active days",
      explanation:"Advanced evidence must survive time rather than being assembled in one intensive burst."
    },
    {
      id:"long_form_reliability",label:"Reliable long-form production",
      met:portfolio.reliability.reliableArtifacts>=2&&portfolio.reliability.activeDays>=4,
      current:portfolio.reliability.reliableArtifacts+" reliable artifacts · "+portfolio.reliability.activeDays+" production days",
      target:"≥2 reliable artifacts · ≥4 production days",
      explanation:"At least two advanced writing/synthesis artifacts must succeed across delayed sessions."
    },
    {
      id:"precision_breadth",label:"Precision breadth across days",
      met:precision.precisionArtifacts.length>=8&&precision.precisionModes>=6&&precision.activeDays>=3,
      current:precision.precisionArtifacts.length+" rewrites · "+precision.precisionModes+"/8 modes · "+precision.activeDays+" days",
      target:"≥8 rewrites · ≥6 modes · ≥3 days",
      explanation:"C1→C2 precision must cover multiple transformation types and more than one session."
    },
    {
      id:"specialist_durability",label:"Sustained specialist discourse",
      met:precision.sustainedSpecialistTracks>=1&&precision.specialistTurns.length>=10,
      current:precision.sustainedSpecialistTracks+" sustained tracks · "+precision.specialistTurns.length+" turns",
      target:"≥1 sustained track · ≥10 turns",
      explanation:"At least one specialist track must survive delayed repetition across all discourse functions."
    },
    {
      id:"interaction_pressure",label:"Repeated interaction pressure",
      met:interaction.robustSessions>=2&&interaction.pressureTypes>=10&&new Set(robustSessionDates.map(dayKey)).size>=2,
      current:interaction.robustSessions+" robust sessions · "+interaction.pressureTypes+"/12 pressure types",
      target:"≥2 robust sessions on ≥2 days · ≥10 pressure types",
      explanation:"One strong simulator session is not enough to establish durable repair and floor-control behavior."
    },
    {
      id:"human_exchange",label:"Actual human interaction",
      met:interaction.humanInteractions.length>=2&&interaction.humanInteractionMinutes>=45&&new Set(humanDates.map(dayKey)).size>=2,
      current:interaction.humanInteractions.length+" logs · "+interaction.humanInteractionMinutes+" minutes · "+new Set(humanDates.map(dayKey)).size+" days",
      target:"≥2 interactions · ≥45 minutes · ≥2 days",
      explanation:"Simulated pressure must be complemented by repeated real human exchange."
    },
    {
      id:"audio_listening",label:"Audio + listening-under-pressure breadth",
      met:p19.prosodyCaptures.length>=4&&p19.prosodyTargets>=3&&p19.overlapAttempts.length>=4&&p19.overlapTasks>=3&&new Set(p19Dates.map(dayKey)).size>=2,
      current:p19.prosodyCaptures.length+" captures / "+p19.prosodyTargets+"/4 targets · "+p19.overlapAttempts.length+" overlap attempts / "+p19.overlapTasks+"/4 tasks",
      target:"≥4 captures / ≥3 targets · ≥4 overlap attempts / ≥3 tasks · ≥2 days",
      explanation:"Advanced speaking/listening evidence needs both real microphone timing evidence and difficult listening reconstruction."
    },
    {
      id:"external_calibration",label:"Repeated broad external review",
      met:broadReviews.length>=2&&reviewerLabels.size>=2&&reviewSpanDays>=7,
      current:broadReviews.length+" broad reviews · "+reviewerLabels.size+" reviewer labels · "+reviewSpanDays+" day span",
      target:"≥2 broad reviews · ≥2 distinct labels · ≥7 days apart",
      explanation:"The product requires repeated broad human review. Different labels are useful calibration evidence but do not verify reviewer independence."
    },
    {
      id:"dimension_coverage",label:"Repeated observation of all seven dimensions",
      met:qualifyingDimensionCoverage===DIMENSIONS.length,
      current:qualifyingDimensionCoverage+"/7 dimensions observed in ≥2 broad reviews",
      target:"7/7 dimensions observed in ≥2 broad reviews",
      explanation:"Final internal qualification cannot infer an unobserved advanced dimension from adjacent skills."
    },
    {
      id:"external_performance",label:"Stable advanced external performance",
      met:allDimensionsStable&&externalAverage!==null&&externalAverage>=3.5,
      current:stableDimensions+"/7 stable dimensions · "+(externalAverage===null?"n/a":externalAverage.toFixed(2))+"/5 aggregate",
      target:"7/7 stable · aggregate ≥3.50/5",
      explanation:"Every dimension needs repeated broad-review scores at or above the advanced-control floor; the aggregate must also clear the product threshold."
    },
    {
      id:"calibration_resolution",label:"No unresolved reviewer divergence",
      met:calibration.status!=="divergent"&&broadReviews.length>=2,
      current:calibrationLabel(calibration),
      target:"No ≥3-point dimension disagreement in the latest label-distinct broad-review pair",
      explanation:"Large reviewer disagreement blocks the internal qualification until more evidence or another review resolves the calibration problem."
    }
  ];

  const requirementsMet=requirements.filter((item)=>item.met).length;
  const internalCoreMet=requirements.slice(0,7).every((item)=>item.met);
  let status:C2ReadinessStatus;
  if(allDates.length===0&&p19.externalReviews.length===0)status="not_enough_evidence";
  else if(calibration.status==="divergent")status="reviewer_divergence";
  else if(requirements.every((item)=>item.met))status="advanced_pathway_qualified";
  else if(internalCoreMet&&!requirements[7]!.met)status="external_calibration_needed";
  else status="consolidating";

  const nextActions=buildNextActions(requirements,dimensions,calibration);

  return {
    schema:"thiepn-japanese-c2-readiness",schemaVersion:1,generatedAt:now.toISOString(),
    status,statusLabel:statusLabel(status),qualified:status==="advanced_pathway_qualified",
    evidenceSpanDays,advancedActiveDays,requirements,requirementsMet,dimensions,stableDimensions,strongDimensions,
    unresolvedWeakDimensions,externalAverage,broadExternalReviews:broadReviews.length,distinctReviewerLabels:reviewerLabels.size,
    calibration,nextActions,
    evidenceBoundary:{
      accreditedCefrCertification:false,productQualificationOnly:true,reviewerIdentityVerified:false,
      internalEvidenceIsSemanticScore:false,reviewerScoresChangeMastery:false,localAudioIncludedInExport:false
    }
  };
}

export async function getC2ReadinessReport(now=new Date()):Promise<C2ReadinessReport>{
  return {
    schema:"thiepn-japanese-advanced-pathway-readiness-report",schemaVersion:1,generatedAt:now.toISOString(),
    qualification:"internal advanced-pathway qualification",summary:await getC2ReadinessSummary(now)
  };
}

export function serializeC2ReadinessMarkdown(report:C2ReadinessReport):string{
  const s=report.summary;
  return [
    "# Japanese Advanced-Pathway Readiness Report","",
    "- Generated: "+report.generatedAt,
    "- Status: "+s.statusLabel,
    "- Internal product qualification: "+(s.qualified?"QUALIFIED":"NOT YET QUALIFIED"),
    "- Accredited CEFR C2 certification: NO",
    "- Evidence span: "+s.evidenceSpanDays+" days",
    "- Advanced active days: "+s.advancedActiveDays,
    "- Requirements met: "+s.requirementsMet+"/"+s.requirements.length,
    "- Broad external reviews: "+s.broadExternalReviews,
    "- Distinct reviewer labels: "+s.distinctReviewerLabels+" (identity not verified)",
    "- External aggregate: "+(s.externalAverage===null?"n/a":s.externalAverage.toFixed(2)+"/5"),
    "",
    "## Qualification requirements","",
    ...s.requirements.map((item)=>"- "+(item.met?"[x] ":"[ ] ")+item.label+" — "+item.current+"; target: "+item.target),
    "",
    "## Seven-dimension readiness matrix","",
    ...s.dimensions.map((item)=>"- "+item.label+" — "+item.status+" · broad observations "+item.broadObservations+" · mean "+(item.meanScore===null?"n/a":item.meanScore.toFixed(2))+" · latest "+(item.latestScore===null?"n/a":item.latestScore.toFixed(1))+" · internal support "+item.internalSupport),
    "",
    "## Reviewer calibration","",
    "- Status: "+s.calibration.status.replaceAll("_"," "),
    "- Reviewer-label span: "+s.calibration.reviewSpanDays+" days",
    "- Mean absolute score delta: "+(s.calibration.meanAbsoluteDelta===null?"n/a":s.calibration.meanAbsoluteDelta.toFixed(2)),
    "- Reviewer identity verified: NO",
    "",
    "## Next actions","",
    ...(s.nextActions.length?s.nextActions.map((item)=>"- "+item):["- No unmet internal qualification requirements."]),
    "",
    "## Evidence boundary","",
    "- This is an internal product qualification, not accredited CEFR certification.",
    "- Different reviewer labels do not establish independently verified reviewer identities.",
    "- Internal structural evidence is not converted into semantic language scores.",
    "- Reviewer scores do not automatically change FSRS or durable mastery.",
    "- Raw local audio is not included in this report."
  ].join("\n");
}

function buildDimensionReadiness(input:C2ReadinessInputs,broadReviews:readonly C2ExternalHumanReview[],allReviews:readonly C2ExternalHumanReview[]):C2DimensionReadiness[]{
  return DIMENSIONS.map(({id,label})=>{
    const broadScores=reviewScores(broadReviews,id);
    const allScores=reviewScores(allReviews,id);
    const meanScore=broadScores.length?round2(broadScores.reduce((sum,item)=>sum+item.score,0)/broadScores.length):null;
    const latestScore=broadScores.at(-1)?.score??null;
    const earliestScore=broadScores[0]?.score??null;
    const trend=latestScore!==null&&earliestScore!==null&&broadScores.length>=2?round2(latestScore-earliestScore):null;
    const spread=broadScores.length>=2?Math.max(...broadScores.map((item)=>item.score))-Math.min(...broadScores.map((item)=>item.score)):null;
    const persistentWeakness=broadScores.length>=2&&broadScores.slice(-2).every((item)=>item.score<=2);
    let status:C2DimensionStatus;
    if(!broadScores.length)status="unobserved";
    else if(broadScores.length<2)status="insufficient";
    else if((meanScore??0)<3||(latestScore??0)<3)status="weak";
    else if((meanScore??0)>=4&&(latestScore??0)>=4)status="strong";
    else status="stable";
    const internalEvidenceCount=internalEvidenceForDimension(input,id);
    const internalSupport=internalEvidenceCount>=8?"substantial":internalEvidenceCount>=3?"developing":"low";
    return {
      dimension:id,label,internalEvidenceCount,internalSupport,broadObservations:broadScores.length,allObservations:allScores.length,
      meanScore,latestScore,earliestScore,trend,spread,status,persistentWeakness
    };
  });
}

export function buildReviewerCalibration(reviews:readonly C2ExternalHumanReview[]):C2ReviewerCalibration{
  const ordered=[...reviews].sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt));
  const labels=new Set(ordered.map((item)=>normalizeReviewer(item.reviewerLabel)).filter(Boolean));
  let pair:[C2ExternalHumanReview,C2ExternalHumanReview]|null=null;
  for(let later=ordered.length-1;later>=1&&!pair;later--){
    for(let earlier=later-1;earlier>=0;earlier--){
      if(normalizeReviewer(ordered[earlier]!.reviewerLabel)!==normalizeReviewer(ordered[later]!.reviewerLabel)){
        pair=[ordered[earlier]!,ordered[later]!];break;
      }
    }
  }
  if(!pair&&ordered.length>=2)pair=[ordered.at(-2)!,ordered.at(-1)!];
  const dimensions:C2ReviewerCalibrationDimension[]=DIMENSIONS.map(({id,label})=>{
    const earlier=pair?.[0].scores[id]??null,later=pair?.[1].scores[id]??null;
    return {dimension:id,label,earlier,later,delta:earlier!==null&&later!==null?round2(later-earlier):null};
  });
  const deltas=dimensions.map((item)=>item.delta).filter((value):value is number=>value!==null).map(Math.abs);
  const meanAbsoluteDelta=deltas.length?round2(deltas.reduce((sum,value)=>sum+value,0)/deltas.length):null;
  const maxAbsoluteDelta=deltas.length?Math.max(...deltas):null;
  const divergentDimensions=dimensions.filter((item)=>item.delta!==null&&Math.abs(item.delta)>=3).map((item)=>item.dimension);
  let status:C2CalibrationStatus;
  if(ordered.length<2)status="unavailable";
  else if(labels.size<2)status="single_reviewer_label";
  else if((maxAbsoluteDelta??0)>=3)status="divergent";
  else if((maxAbsoluteDelta??0)<=1&&(meanAbsoluteDelta??0)<=.75)status="aligned";
  else status="mixed";
  return {
    status,
    ...(pair?{earlierReviewId:pair[0].id,laterReviewId:pair[1].id,earlierReviewer:pair[0].reviewerLabel,laterReviewer:pair[1].reviewerLabel}:{}),
    distinctReviewerLabels:labels.size,reviewSpanDays:spanDays(ordered.map((item)=>item.reviewedAt)),
    meanAbsoluteDelta,maxAbsoluteDelta,dimensions,divergentDimensions,identityVerified:false
  };
}

function reviewScores(reviews:readonly C2ExternalHumanReview[],dimension:C2ReviewDimension):Array<{score:number;reviewedAt:string}>{
  return reviews.map((review)=>({score:review.scores[dimension],reviewedAt:review.reviewedAt}))
    .filter((item):item is {score:number;reviewedAt:string}=>typeof item.score==="number")
    .sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt));
}

function internalEvidenceForDimension(input:C2ReadinessInputs,dimension:C2ReviewDimension):number{
  const {portfolio,precision,interaction,p19}=input;
  switch(dimension){
    case "lexicalPrecision":return precision.precisionArtifacts.length+precision.sourceRefreshes.length;
    case "grammaticalControl":return portfolio.reliability.successfulAttempts+portfolio.reliability.reliableArtifacts*2;
    case "discourseOrganization":return portfolio.reliability.reliableArtifacts*3+precision.completedDiscourseCycles+precision.reviewRepairs.length;
    case "interactionRepair":return interaction.turns.length+interaction.robustSessions*3+interaction.humanInteractions.length;
    case "registerFlexibility":return precision.precisionArtifacts.filter((item)=>item.mode==="register_shift"||item.mode==="audience_translation").length+precision.sustainedSpecialistTracks*3;
    case "prosodicControl":return p19.prosodyCaptures.length+p19.prosodyTargets*2;
    case "listeningUnderPressure":return p19.overlapAttempts.length+p19.overlapTasks*2;
  }
}

function collectAdvancedDates(input:C2ReadinessInputs):string[]{
  const {portfolio,precision,interaction,p19}=input;
  return [
    ...(portfolio.firstEvidenceAt?[portfolio.firstEvidenceAt]:[]),
    ...(portfolio.lastEvidenceAt?[portfolio.lastEvidenceAt]:[]),
    ...precision.precisionArtifacts.map((item)=>item.occurredAt),
    ...precision.specialistTurns.map((item)=>item.occurredAt),
    ...precision.sourceRefreshes.map((item)=>item.occurredAt),
    ...precision.reviewRepairs.map((item)=>item.occurredAt),
    ...interaction.turns.map((item)=>item.occurredAt),
    ...interaction.humanInteractions.map((item)=>item.occurredAt),
    ...interaction.transfers.map((item)=>item.occurredAt),
    ...p19.prosodyCaptures.map((item)=>item.occurredAt),
    ...p19.overlapAttempts.map((item)=>item.occurredAt),
    ...p19.externalReviews.map((item)=>item.reviewedAt)
  ].filter(Boolean);
}

function buildNextActions(requirements:readonly C2ReadinessRequirement[],dimensions:readonly C2DimensionReadiness[],calibration:C2ReviewerCalibration):string[]{
  const actions:string[]=[];
  const firstUnmet=requirements.filter((item)=>!item.met).slice(0,4);
  for(const item of firstUnmet)actions.push(item.label+": "+item.target+".");
  const weak=dimensions.filter((item)=>item.status==="weak"||item.persistentWeakness);
  if(weak.length)actions.push("Prioritize external re-observation and targeted practice for: "+weak.map((item)=>item.label).join(", ")+".");
  const insufficient=dimensions.filter((item)=>item.status==="unobserved"||item.status==="insufficient");
  if(insufficient.length)actions.push("Collect a second broad-review observation for: "+insufficient.map((item)=>item.label).join(", ")+".");
  if(calibration.status==="divergent")actions.push("Resolve reviewer divergence before qualification: obtain another broad review or re-review the disputed evidence with explicit anchors.");
  return [...new Set(actions)].slice(0,6);
}

function statusLabel(status:C2ReadinessStatus):string{
  switch(status){
    case "not_enough_evidence":return "Not enough advanced evidence";
    case "consolidating":return "Consolidating longitudinal evidence";
    case "external_calibration_needed":return "External calibration needed";
    case "reviewer_divergence":return "Reviewer divergence unresolved";
    case "advanced_pathway_qualified":return "Advanced pathway qualified";
  }
}

function calibrationLabel(calibration:C2ReviewerCalibration):string{
  if(calibration.status==="unavailable")return "fewer than two broad reviews";
  if(calibration.status==="single_reviewer_label")return "multiple reviews but only one reviewer label";
  const delta=calibration.meanAbsoluteDelta===null?"n/a":calibration.meanAbsoluteDelta.toFixed(2);
  return calibration.status.replaceAll("_"," ")+" · mean |Δ| "+delta+"/5";
}

function normalizeReviewer(value:string):string{return value.trim().toLowerCase().replace(/\s+/g," ");}

function spanDays(values:readonly string[]):number{
  const times=values.map(Date.parse).filter(Number.isFinite).sort((a,b)=>a-b);
  if(times.length<2)return 0;
  return Math.floor((times.at(-1)!-times[0]!)/DAY_MS);
}

function dayKey(value:string):string{return value.slice(0,10);}
function round2(value:number):number{return Math.round(value*100)/100;}
