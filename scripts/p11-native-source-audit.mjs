import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { THRESHOLDS,summarizeNativeInventory } from "./p9-release-certify.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DEFAULT_REGISTRY="release/p11-native-sources.json";
const DEFAULT_INVENTORY="release/p9-native-inventory.json";
const MIN_CONNECTED_SECONDS=30;
const REQUIRED_CHECKS=[
  "sourceIdentityVerified",
  "recordingIdentityVerified",
  "licenseVerified",
  "nativeSpeakerVerified",
  "contentMatchVerified",
  "connectedSpeechVerified",
  "registerReviewed",
  "speechRateReviewed"
];

export function readJson(filePath){return JSON.parse(fs.readFileSync(filePath,"utf8"));}

export function validateNativeSourceRegistry(registry){
  if(!registry||typeof registry!=="object")throw new Error("P11_NATIVE_REGISTRY_INVALID");
  if(registry.schema!=="thiepn-japanese-p11-native-source-registry")throw new Error("P11_NATIVE_REGISTRY_SCHEMA_INVALID");
  if(registry.schemaVersion!==1)throw new Error("P11_NATIVE_REGISTRY_VERSION_UNSUPPORTED");
  if(!Number.isFinite(Date.parse(registry.generatedAt)))throw new Error("P11_NATIVE_REGISTRY_DATE_INVALID");
  if(registry.evidenceBoundary?.syntheticAudioCounts!==false)throw new Error("P11_NATIVE_BOUNDARY_SYNTHETIC_INVALID");
  if(registry.evidenceBoundary?.inferredNativeSpeakerCounts!==false)throw new Error("P11_NATIVE_BOUNDARY_NATIVE_INVALID");
  if(registry.evidenceBoundary?.unverifiedLicenseCounts!==false)throw new Error("P11_NATIVE_BOUNDARY_LICENSE_INVALID");
  if(registry.evidenceBoundary?.speechRateLabelIsAcousticMeasurement!==false)throw new Error("P11_NATIVE_BOUNDARY_RATE_INVALID");
  if(registry.evidenceBoundary?.fastMeansRelativeStretchSourceCondition!==true)throw new Error("P11_NATIVE_BOUNDARY_STRETCH_INVALID");
  if(!Array.isArray(registry.sources)||registry.sources.length===0)throw new Error("P11_NATIVE_SOURCES_REQUIRED");

  const ids=new Set(),mediaUrls=new Set(),recordingPages=new Set();
  for(const [index,source] of registry.sources.entries()){
    const where="source "+(index+1);
    requireString(source?.id,where+" id");
    if(ids.has(source.id))throw new Error("P11_NATIVE_DUPLICATE_SOURCE:"+source.id);
    ids.add(source.id);
    requireString(source?.title,where+" title");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(source?.eventDate??""))throw new Error("P11_NATIVE_EVENT_DATE_INVALID:"+source.id);
    requireString(source?.speakerLabel,where+" speakerLabel");
    for(const key of ["sourcePageUrl","mediaPageUrl","mediaUrl","licenseEvidenceUrl","attributionUrl","nativeSpeakerEvidenceUrl","contentEvidenceUrl"]){
      requireHttpUrl(source?.[key],source.id+" "+key);
    }
    if(mediaUrls.has(source.mediaUrl))throw new Error("P11_NATIVE_DUPLICATE_MEDIA_URL:"+source.id);
    mediaUrls.add(source.mediaUrl);
    if(recordingPages.has(source.mediaPageUrl))throw new Error("P11_NATIVE_DUPLICATE_MEDIA_PAGE:"+source.id);
    recordingPages.add(source.mediaPageUrl);
    if(!Number.isFinite(source.durationSeconds)||source.durationSeconds<MIN_CONNECTED_SECONDS)throw new Error("P11_NATIVE_CONNECTED_DURATION_REQUIRED:"+source.id);
    requireString(source.credit,source.id+" credit");
    requireString(source.licenseName,source.id+" licenseName");
    if(!allowedReusableLicense(source.licenseName))throw new Error("P11_NATIVE_LICENSE_NOT_ADMITTED:"+source.id);
    if(!["casual","neutral","polite","formal"].includes(source.register))throw new Error("P11_NATIVE_REGISTER_INVALID:"+source.id);
    if(!["slow","natural","fast"].includes(source.speechRate))throw new Error("P11_NATIVE_SPEECH_RATE_INVALID:"+source.id);

    const rate=source.speechRateEvidence;
    if(!rate||typeof rate!=="object")throw new Error("P11_NATIVE_RATE_EVIDENCE_REQUIRED:"+source.id);
    if(rate.method!=="genre-relative-source-condition")throw new Error("P11_NATIVE_RATE_METHOD_INVALID:"+source.id);
    if(typeof rate.stretchCondition!=="boolean")throw new Error("P11_NATIVE_STRETCH_FLAG_REQUIRED:"+source.id);
    requireHttpUrl(rate.evidenceUrl,source.id+" speechRateEvidence.evidenceUrl");
    requireString(rate.rationale,source.id+" speechRateEvidence.rationale");
    if(source.speechRate==="fast"&&rate.stretchCondition!==true)throw new Error("P11_NATIVE_FAST_REQUIRES_STRETCH_EVIDENCE:"+source.id);
    if(source.speechRate!=="fast"&&rate.stretchCondition===true)throw new Error("P11_NATIVE_NONFAST_STRETCH_CONFLICT:"+source.id);

    const verification=source.verification;
    if(!verification||typeof verification!=="object")throw new Error("P11_NATIVE_VERIFICATION_REQUIRED:"+source.id);
    requireString(verification.reviewedBy,source.id+" verification.reviewedBy");
    if(!Number.isFinite(Date.parse(verification.reviewedAt)))throw new Error("P11_NATIVE_VERIFICATION_DATE_INVALID:"+source.id);
    for(const key of REQUIRED_CHECKS)if(verification[key]!==true)throw new Error("P11_NATIVE_VERIFICATION_INCOMPLETE:"+source.id+":"+key);
  }

  const inventory=buildP9Inventory(registry);
  const summary=summarizeNativeInventory(inventory);
  const thresholdChecks=releaseThresholdChecks(summary);
  return {
    sources:registry.sources.length,
    uniqueSpeakers:new Set(registry.sources.map((source)=>source.speakerLabel)).size,
    registers:[...new Set(registry.sources.map((source)=>source.register))].sort(),
    speechRates:[...new Set(registry.sources.map((source)=>source.speechRate))].sort(),
    thresholdChecks,
    releaseMediaGateSatisfied:thresholdChecks.every((item)=>item.passed)
  };
}

export function buildP9Inventory(registry){
  return {
    schema:"thiepn-japanese-p9-native-inventory",
    schemaVersion:1,
    updatedAt:registry.generatedAt.slice(0,10),
    documents:registry.sources.map((source)=>({
      id:source.id,
      title:source.title,
      sourceUrl:source.sourcePageUrl,
      recordings:[{
        id:source.id+":recording",
        url:source.mediaUrl,
        credit:source.credit,
        licenseName:source.licenseName,
        attributionUrl:source.attributionUrl,
        nativeSpeaker:true,
        speechRate:source.speechRate,
        register:source.register,
        speakerLabel:source.speakerLabel,
        verification:{
          phase:"P11.2",
          reviewedBy:source.verification.reviewedBy,
          reviewedAt:source.verification.reviewedAt,
          mediaPageUrl:source.mediaPageUrl,
          licenseEvidenceUrl:source.licenseEvidenceUrl,
          nativeSpeakerEvidenceUrl:source.nativeSpeakerEvidenceUrl,
          contentEvidenceUrl:source.contentEvidenceUrl,
          durationSeconds:source.durationSeconds,
          rateEvidence:{
            method:source.speechRateEvidence.method,
            stretchCondition:source.speechRateEvidence.stretchCondition,
            evidenceUrl:source.speechRateEvidence.evidenceUrl,
            rationale:source.speechRateEvidence.rationale
          },
          checklist:Object.fromEntries(REQUIRED_CHECKS.map((key)=>[key,true]))
        }
      }]
    }))
  };
}

export function releaseThresholdChecks(summary){
  const rates=new Set(summary.speechRates);
  return [
    check("native-documents",">="+THRESHOLDS.nativeSourceDocuments,summary.sourceDocuments,summary.sourceDocuments>=THRESHOLDS.nativeSourceDocuments),
    check("native-recordings",">="+THRESHOLDS.nativeRecordings,summary.recordings,summary.recordings>=THRESHOLDS.nativeRecordings),
    check("native-speakers",">="+THRESHOLDS.nativeSpeakers,summary.speakers,summary.speakers>=THRESHOLDS.nativeSpeakers),
    check("native-registers",">="+THRESHOLDS.nativeRegisters,summary.registers.length,summary.registers.length>=THRESHOLDS.nativeRegisters),
    check("natural-source","natural",summary.speechRates.join(", ")||"none",rates.has("natural")),
    check("stretch-source","fast",summary.speechRates.join(", ")||"none",rates.has("fast"))
  ];
}

export function auditReport(registry,currentInventory){
  const validation=validateNativeSourceRegistry(registry);
  const expectedInventory=buildP9Inventory(registry);
  const inventoryMatches=stableJson(currentInventory)===stableJson(expectedInventory);
  return {
    schema:"thiepn-japanese-p11-native-source-audit",
    schemaVersion:1,
    generatedAt:new Date().toISOString(),
    registryGeneratedAt:registry.generatedAt,
    sourceCount:validation.sources,
    uniqueSpeakers:validation.uniqueSpeakers,
    registers:validation.registers,
    speechRates:validation.speechRates,
    mediaGateChecks:validation.thresholdChecks,
    releaseMediaGateSatisfied:validation.releaseMediaGateSatisfied,
    checkedInInventoryMatchesRegistry:inventoryMatches,
    p9MediaGateReady:validation.releaseMediaGateSatisfied&&inventoryMatches,
    evidenceBoundary:registry.evidenceBoundary
  };
}

export function reportMarkdown(report){
  return [
    "# P11.2 Native Corpus Audit",
    "",
    "Generated: "+report.generatedAt,
    "Sources: "+report.sourceCount,
    "Independent speakers: "+report.uniqueSpeakers,
    "Registers: "+(report.registers.join(", ")||"none"),
    "Source-rate conditions: "+(report.speechRates.join(", ")||"none"),
    "Checked-in inventory matches registry: "+(report.checkedInInventoryMatchesRegistry?"yes":"no"),
    "P9 media gate ready: "+(report.p9MediaGateReady?"YES":"NO"),
    "",
    "## Media-gate checks",
    "",
    "| Check | Required | Actual | Result |",
    "| --- | --- | --- | --- |",
    ...report.mediaGateChecks.map((item)=>"| "+item.id+" | "+item.required+" | "+item.actual+" | "+(item.passed?"PASS":"BLOCKED")+" |"),
    "",
    "## Evidence boundary",
    "",
    "- Synthetic audio never counts.",
    "- Native-speaker status must have a dedicated evidence URL; language alone is not inferred into native status.",
    "- Every source carries license and content/provenance evidence URLs.",
    "- Connected speech must be at least "+MIN_CONNECTED_SECONDS+" seconds.",
    "- The fast label is a relative pedagogical stretch-source condition, not an acoustic words-per-minute or pronunciation score.",
    "- Repository inventory is generated from this source registry; hand-edited divergence blocks the audit."
  ].join("\n");
}

function parseArgs(args){
  const out={registry:DEFAULT_REGISTRY,inventory:DEFAULT_INVENTORY,outDir:"artifacts",apply:false};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--registry"){out.registry=args[++i];continue;}
    if(arg==="--inventory"){out.inventory=args[++i];continue;}
    if(arg==="--out-dir"){out.outDir=args[++i];continue;}
    if(arg==="--apply"){out.apply=true;continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  const registryPath=path.resolve(ROOT,options.registry);
  const inventoryPath=path.resolve(ROOT,options.inventory);
  const registry=readJson(registryPath);
  const expected=buildP9Inventory(registry);
  validateNativeSourceRegistry(registry);

  if(options.apply){
    fs.writeFileSync(inventoryPath,JSON.stringify(expected,null,2)+"\n");
    process.stdout.write("Applied P11.2 verified native registry to "+path.relative(ROOT,inventoryPath)+"\n");
  }

  const current=readJson(inventoryPath);
  const report=auditReport(registry,current);
  const outDir=path.resolve(ROOT,options.outDir);
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,"p11-native-source-audit.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(outDir,"p11-native-source-audit.md"),reportMarkdown(report)+"\n");

  process.stdout.write("P11.2 NATIVE SOURCE AUDIT — "+(report.p9MediaGateReady?"READY":"BLOCKED")+"\n");
  for(const item of report.mediaGateChecks)process.stdout.write((item.passed?"PASS ":"BLOCKED ")+item.id+": "+item.actual+" (required "+item.required+")\n");
  if(!report.checkedInInventoryMatchesRegistry)process.stdout.write("BLOCKED inventory-drift: checked-in P9 inventory does not match the verified P11.2 registry\n");
  if(!report.p9MediaGateReady)process.exitCode=1;
  return report;
}

function check(id,required,actual,passed){return {id,required:String(required),actual:String(actual),passed:Boolean(passed)};}
function stableJson(value){return JSON.stringify(value);}
function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P11_NATIVE_FIELD_REQUIRED:"+label);}
function requireHttpUrl(value,label){
  requireString(value,label);
  let url;try{url=new URL(value);}catch{throw new Error("P11_NATIVE_URL_INVALID:"+label);}
  if(!["http:","https:"].includes(url.protocol))throw new Error("P11_NATIVE_URL_INVALID:"+label);
}
function allowedReusableLicense(value){
  const normalized=String(value).toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
  if(!normalized)return false;
  if(/\bnc\b/.test(normalized)||normalized.includes("noncommercial")||/\bnd\b/.test(normalized)||normalized.includes("no derivatives"))return false;
  return normalized.includes("cc0")||normalized.includes("public domain")||normalized.includes("cc by")||normalized.includes("creative commons attribution");
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
