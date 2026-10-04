import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  buildQualificationReport,
  getStaticProductMetrics,
  normalizeRegressionEvidence,
  readJson as readP9Json,
  summarizeNativeInventory
} from "./p9-release-certify.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DEFAULT_EXTERNAL="release/p11-external-validation.json";
const DEFAULT_PROVIDERS="release/p11-provider-benchmarks.json";
const DEFAULT_INVENTORY="release/p9-native-inventory.json";

export const P11_THRESHOLDS={
  externalReviewers:1,
  externallyReviewedArtifacts:6
};

export function readJson(filePath){
  return JSON.parse(fs.readFileSync(filePath,"utf8"));
}

export function summarizeExternalValidation(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P11_EXTERNAL_VALIDATION_INVALID");
  if(manifest.schema!=="thiepn-japanese-p11-external-validation")throw new Error("P11_EXTERNAL_VALIDATION_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P11_EXTERNAL_VALIDATION_VERSION_UNSUPPORTED");
  if(!Array.isArray(manifest.reviews))throw new Error("P11_EXTERNAL_VALIDATION_REVIEWS_REQUIRED");

  const ids=new Set();
  let reviewedArtifacts=0;
  const reviewerLabels=new Set();
  const modalities=new Set();
  const blockingIssues=[];

  for(const [index,review] of manifest.reviews.entries()){
    const where="review "+(index+1);
    requireString(review?.id,where+" id");
    if(ids.has(review.id))throw new Error("P11_EXTERNAL_VALIDATION_DUPLICATE_REVIEW:"+review.id);
    ids.add(review.id);
    requireString(review?.reviewerLabel,where+" reviewerLabel");
    if(!["teacher","tutor","language-professional"].includes(review?.reviewerRole))throw new Error("P11_EXTERNAL_VALIDATION_REVIEWER_ROLE_INVALID:"+review.id);
    if(review.externalToProject!==true)throw new Error("P11_EXTERNAL_VALIDATION_EXTERNAL_REVIEWER_REQUIRED:"+review.id);
    requireIsoDate(review?.reviewedAt,"P11_EXTERNAL_VALIDATION_DATE_INVALID:"+review.id);
    requireString(review?.packetId,where+" packetId");
    if(typeof review?.packetSha256!=="string"||!/^[a-f0-9]{64}$/i.test(review.packetSha256))throw new Error("P11_EXTERNAL_VALIDATION_PACKET_DIGEST_INVALID:"+review.id);
    if(!Number.isInteger(review?.artifactCount)||review.artifactCount<1)throw new Error("P11_EXTERNAL_VALIDATION_ARTIFACT_COUNT_INVALID:"+review.id);
    if(!Array.isArray(review?.modalities)||review.modalities.length===0)throw new Error("P11_EXTERNAL_VALIDATION_MODALITIES_REQUIRED:"+review.id);
    for(const modality of review.modalities){
      if(!["writing","spoken_interaction","spoken_production"].includes(modality))throw new Error("P11_EXTERNAL_VALIDATION_MODALITY_INVALID:"+review.id+":"+modality);
      modalities.add(modality);
    }
    if(!["approve","approve-with-notes","block"].includes(review?.verdict))throw new Error("P11_EXTERNAL_VALIDATION_VERDICT_INVALID:"+review.id);
    if(!Array.isArray(review?.blockingIssues))throw new Error("P11_EXTERNAL_VALIDATION_BLOCKERS_REQUIRED:"+review.id);
    for(const issue of review.blockingIssues){
      requireString(issue,where+" blocking issue");
      blockingIssues.push({reviewId:review.id,issue});
    }
    if(review.verdict==="block")blockingIssues.push({reviewId:review.id,issue:"Reviewer verdict is block."});
    reviewerLabels.add(review.reviewerLabel.trim());
    reviewedArtifacts+=review.artifactCount;
  }

  const hasWriting=modalities.has("writing");
  const hasSpeaking=modalities.has("spoken_interaction")||modalities.has("spoken_production");
  const qualified=
    reviewerLabels.size>=P11_THRESHOLDS.externalReviewers &&
    reviewedArtifacts>=P11_THRESHOLDS.externallyReviewedArtifacts &&
    hasWriting &&
    hasSpeaking &&
    blockingIssues.length===0 &&
    manifest.reviews.every((review)=>review.verdict==="approve"||review.verdict==="approve-with-notes");

  return {
    reviewers:reviewerLabels.size,
    reviewedArtifacts,
    modalities:[...modalities].sort(),
    hasWriting,
    hasSpeaking,
    blockingIssues,
    qualified
  };
}

export function summarizeProviderBenchmarks(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P11_PROVIDER_BENCHMARKS_INVALID");
  if(manifest.schema!=="thiepn-japanese-p11-provider-benchmarks")throw new Error("P11_PROVIDER_BENCHMARKS_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P11_PROVIDER_BENCHMARKS_VERSION_UNSUPPORTED");
  if(!["undecided","offline-only","connected"].includes(manifest.releaseProfile))throw new Error("P11_PROVIDER_RELEASE_PROFILE_INVALID");
  if(!Array.isArray(manifest.configuredProviders))throw new Error("P11_PROVIDER_CONFIG_REQUIRED");
  if(!Array.isArray(manifest.runs))throw new Error("P11_PROVIDER_RUNS_REQUIRED");

  const providers=new Map();
  for(const provider of manifest.configuredProviders){
    requireString(provider?.id,"provider id");
    if(!["coach","morphology"].includes(provider?.type))throw new Error("P11_PROVIDER_TYPE_INVALID:"+provider?.id);
    if(providers.has(provider.id))throw new Error("P11_PROVIDER_DUPLICATE:"+provider.id);
    providers.set(provider.id,{id:provider.id,type:provider.type});
  }

  const latest=new Map();
  const runIds=new Set();
  for(const run of manifest.runs){
    requireString(run?.id,"benchmark run id");
    if(runIds.has(run.id))throw new Error("P11_PROVIDER_RUN_DUPLICATE:"+run.id);
    runIds.add(run.id);
    requireString(run?.providerId,"benchmark providerId");
    if(!providers.has(run.providerId))throw new Error("P11_PROVIDER_RUN_UNKNOWN_PROVIDER:"+run.providerId);
    requireIsoDate(run?.runAt,"P11_PROVIDER_RUN_DATE_INVALID:"+run.id);
    if(!Number.isInteger(run?.cases)||run.cases<1)throw new Error("P11_PROVIDER_RUN_CASES_INVALID:"+run.id);
    if(!Number.isInteger(run?.passedCases)||run.passedCases<0||run.passedCases>run.cases)throw new Error("P11_PROVIDER_RUN_PASSED_CASES_INVALID:"+run.id);
    if(!Number.isFinite(run?.p95Ms)||run.p95Ms<0)throw new Error("P11_PROVIDER_RUN_P95_INVALID:"+run.id);
    if(run.fallbackVerified!==true)throw new Error("P11_PROVIDER_FALLBACK_NOT_VERIFIED:"+run.id);
    if(!["pass","fail"].includes(run?.outcome))throw new Error("P11_PROVIDER_RUN_OUTCOME_INVALID:"+run.id);
    const previous=latest.get(run.providerId);
    if(!previous||Date.parse(run.runAt)>Date.parse(previous.runAt))latest.set(run.providerId,run);
  }

  if(manifest.releaseProfile==="offline-only"&&providers.size>0)throw new Error("P11_PROVIDER_OFFLINE_PROFILE_HAS_CONFIGURED_PROVIDER");
  if(manifest.releaseProfile==="connected"&&providers.size===0)throw new Error("P11_PROVIDER_CONNECTED_PROFILE_REQUIRES_PROVIDER");

  const providerResults=[...providers.values()].map((provider)=>{
    const run=latest.get(provider.id)??null;
    const passed=Boolean(run&&run.outcome==="pass"&&run.passedCases===run.cases&&run.fallbackVerified===true);
    return {
      providerId:provider.id,
      type:provider.type,
      latestRunId:run?.id??null,
      latestRunAt:run?.runAt??null,
      passed
    };
  });
  const qualified=
    manifest.releaseProfile==="offline-only" ||
    (manifest.releaseProfile==="connected"&&providerResults.length>0&&providerResults.every((item)=>item.passed));

  return {
    releaseProfile:manifest.releaseProfile,
    configuredProviders:providers.size,
    benchmarkRuns:manifest.runs.length,
    providerResults,
    qualified
  };
}

export function buildP11QualificationReport({p9Report,external,providers,generatedAt=new Date().toISOString(),commit=process.env.GITHUB_SHA??null}){
  const checks=[
    check("p9-release-gate","P9 B2 release qualification","qualified",p9Report.releaseQualified?"qualified":"blocked",p9Report.releaseQualified,"release"),
    check("external-reviewers","Independent external reviewer coverage",">="+P11_THRESHOLDS.externalReviewers,String(external.reviewers),external.reviewers>=P11_THRESHOLDS.externalReviewers,"external_validation"),
    check("external-artifacts","Representative productive artifacts reviewed",">="+P11_THRESHOLDS.externallyReviewedArtifacts,String(external.reviewedArtifacts),external.reviewedArtifacts>=P11_THRESHOLDS.externallyReviewedArtifacts,"external_validation"),
    check("external-writing","External writing evidence represented","required",external.hasWriting?"present":"missing",external.hasWriting,"external_validation"),
    check("external-speaking","External speaking evidence represented","required",external.hasSpeaking?"present":"missing",external.hasSpeaking,"external_validation"),
    check("external-blockers","External review has no blocking issues","0",String(external.blockingIssues.length),external.blockingIssues.length===0&&external.qualified,"external_validation"),
    check("provider-release-profile","Provider release profile decided","offline-only or connected",providers.releaseProfile,providers.releaseProfile!=="undecided","provider"),
    check("provider-benchmarks","Configured provider benchmark evidence","pass or explicit offline-only",providerActual(providers),providers.qualified,"provider"),
    check("rc-regression","Release-candidate regression suite","all P9 regression checks pass",p9RegressionActual(p9Report),Object.values(p9Report.regressionEvidence??{}).every(Boolean),"hardening")
  ];
  const passed=checks.filter((item)=>item.passed).length;
  const releaseCandidateQualified=checks.every((item)=>item.passed);
  return {
    schema:"thiepn-japanese-p11-release-candidate-qualification",
    schemaVersion:1,
    generatedAt,
    commit,
    releaseCandidateQualified,
    c1RoadmapGateOpen:releaseCandidateQualified,
    decision:releaseCandidateQualified?"OPEN_C1_ROADMAP":"HOLD_B2_RELEASE_CANDIDATE",
    passed,
    total:checks.length,
    checks,
    p9:{
      releaseQualified:p9Report.releaseQualified,
      passed:p9Report.passed,
      total:p9Report.total
    },
    externalValidation:external,
    providerBenchmarks:providers
  };
}

export function reportMarkdown(report){
  const blockers=report.checks.filter((item)=>!item.passed);
  return [
    "# P11 B2 Release Candidate Qualification",
    "",
    "Generated: "+report.generatedAt,
    "Commit: "+(report.commit??"local"),
    "Result: "+(report.releaseCandidateQualified?"QUALIFIED":"BLOCKED"),
    "Decision: "+report.decision,
    "Checks: "+report.passed+" / "+report.total,
    "",
    "This is a product/system release decision. It is not a learner CEFR certification.",
    "",
    "## Checks",
    "",
    "| Category | Check | Required | Actual | Result |",
    "| --- | --- | --- | --- | --- |",
    ...report.checks.map((item)=>"| "+item.category+" | "+item.label+" | "+item.required+" | "+item.actual+" | "+(item.passed?"PASS":"BLOCKED")+" |"),
    "",
    "## Blockers",
    "",
    ...(blockers.length?blockers.map((item)=>"- "+item.label+": requires "+item.required+", actual "+item.actual):["- None. The product/system C1 roadmap gate may open."]),
    "",
    "External reviewer judgments remain descriptive product evidence and do not modify learner mastery or constitute accredited CEFR certification."
  ].join("\n");
}

function check(id,label,required,actual,passed,category){return {id,label,required,actual,passed:Boolean(passed),category};}
function providerActual(providers){
  if(providers.releaseProfile==="offline-only")return "offline-only release profile";
  if(providers.releaseProfile==="undecided")return "undecided";
  const passed=providers.providerResults.filter((item)=>item.passed).length;
  return passed+"/"+providers.providerResults.length+" providers passing";
}
function p9RegressionActual(report){
  const evidence=report.regressionEvidence??{};
  const total=Object.keys(evidence).length;
  const passed=Object.values(evidence).filter(Boolean).length;
  return passed+"/"+total+" passing";
}
function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P11_FIELD_REQUIRED:"+label);}
function requireIsoDate(value,errorCode){if(typeof value!=="string"||!Number.isFinite(Date.parse(value)))throw new Error(errorCode);}
function parseArgs(args){
  const out={inventory:DEFAULT_INVENTORY,external:DEFAULT_EXTERNAL,providers:DEFAULT_PROVIDERS,regression:null,outDir:"artifacts",strict:false};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--strict"){out.strict=true;continue;}
    if(arg==="--inventory"){out.inventory=args[++i];continue;}
    if(arg==="--external"){out.external=args[++i];continue;}
    if(arg==="--providers"){out.providers=args[++i];continue;}
    if(arg==="--regression"){out.regression=args[++i];continue;}
    if(arg==="--out-dir"){out.outDir=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  const staticMetrics=getStaticProductMetrics(ROOT);
  const native=summarizeNativeInventory(readP9Json(path.resolve(ROOT,options.inventory)));
  const regression=normalizeRegressionEvidence(options.regression?readJson(path.resolve(ROOT,options.regression)):{});
  const p9Report=buildQualificationReport({staticMetrics,native,regression});
  const external=summarizeExternalValidation(readJson(path.resolve(ROOT,options.external)));
  const providers=summarizeProviderBenchmarks(readJson(path.resolve(ROOT,options.providers)));
  const report=buildP11QualificationReport({p9Report,external,providers});

  const outDir=path.resolve(ROOT,options.outDir);
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,"p11-release-candidate-qualification.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(outDir,"p11-release-candidate-qualification.md"),reportMarkdown(report)+"\n");
  fs.writeFileSync(path.join(outDir,"p9-release-qualification.json"),JSON.stringify(p9Report,null,2)+"\n");

  process.stdout.write((report.releaseCandidateQualified?"P11 RELEASE CANDIDATE QUALIFIED":"P11 RELEASE CANDIDATE BLOCKED")+" — "+report.passed+"/"+report.total+" checks passed\n");
  process.stdout.write("C1 ROADMAP DECISION — "+report.decision+"\n");
  for(const blocker of report.checks.filter((item)=>!item.passed))process.stdout.write("BLOCKED "+blocker.id+": "+blocker.actual+" (required "+blocker.required+")\n");
  if(options.strict&&!report.releaseCandidateQualified)process.exitCode=1;
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
