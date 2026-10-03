import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export const THRESHOLDS={
  b2Texts:20,
  b2ProductiveTasks:20,
  lexicalChunks:120,
  realWorldChains:5,
  realWorldPrompts:20,
  nativeSourceDocuments:4,
  nativeRecordings:8,
  nativeSpeakers:3,
  nativeRegisters:2
};

export function readJson(filePath){
  return JSON.parse(fs.readFileSync(filePath,"utf8"));
}

export function getStaticProductMetrics(root=ROOT){
  const core=readJson(path.join(root,"content/seed/jp-core.json"));
  const performanceSource=fs.readFileSync(path.join(root,"apps/web/src/study/realWorldPerformance.ts"),"utf8");
  const start=performanceSource.indexOf("const CHAINS:");
  const end=performanceSource.indexOf("export const realWorldChains",start);
  if(start<0||end<0)throw new Error("P9_PERFORMANCE_BANK_NOT_FOUND");
  const block=performanceSource.slice(start,end);
  const chainIds=[...block.matchAll(/\n\s{2}\{\s*\n\s{4}id:"([^"]+)"/g)].map((match)=>match[1]);
  const promptIds=[...block.matchAll(/\bstage\("([^"]+)"/g)].map((match)=>match[1]);
  if(!chainIds.length||!promptIds.length)throw new Error("P9_PERFORMANCE_BANK_PARSE_FAILED");
  if(new Set(chainIds).size!==chainIds.length)throw new Error("P9_DUPLICATE_RELEASE_CHAIN_ID");
  if(new Set(promptIds).size!==promptIds.length)throw new Error("P9_DUPLICATE_RELEASE_PROMPT_ID");
  return {
    b2Texts:(core.readingTexts??[]).filter((item)=>item.level==="B2").length,
    b2ProductiveTasks:(core.productiveTasks??[]).filter((item)=>item.level==="B2").length,
    lexicalChunks:(core.lexicalChunks??[]).length,
    realWorldChains:chainIds.length,
    realWorldPrompts:promptIds.length,
    chainIds,
    promptIds
  };
}

export function summarizeNativeInventory(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P9_NATIVE_INVENTORY_INVALID");
  if(manifest.schema!=="thiepn-japanese-p9-native-inventory")throw new Error("P9_NATIVE_INVENTORY_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P9_NATIVE_INVENTORY_VERSION_UNSUPPORTED");
  if(!Array.isArray(manifest.documents))throw new Error("P9_NATIVE_INVENTORY_DOCUMENTS_REQUIRED");
  const documentIds=new Set();
  const recordingIds=new Set();
  const speakers=new Set();
  const registers=new Set();
  const speechRates=new Set();
  let recordings=0;

  for(const [documentIndex,document] of manifest.documents.entries()){
    const where="document "+(documentIndex+1);
    requireString(document?.id,where+" id");
    requireString(document?.title,where+" title");
    requireHttpUrl(document?.sourceUrl,where+" sourceUrl");
    if(documentIds.has(document.id))throw new Error("P9_NATIVE_INVENTORY_DUPLICATE_DOCUMENT:"+document.id);
    documentIds.add(document.id);
    if(!Array.isArray(document.recordings)||document.recordings.length===0)throw new Error("P9_NATIVE_INVENTORY_RECORDINGS_REQUIRED:"+document.id);
    for(const [recordingIndex,recording] of document.recordings.entries()){
      const audioWhere=document.id+" recording "+(recordingIndex+1);
      requireString(recording?.id,audioWhere+" id");
      requireHttpUrl(recording?.url,audioWhere+" url");
      requireString(recording?.credit,audioWhere+" credit");
      requireString(recording?.licenseName,audioWhere+" licenseName");
      if(recording.nativeSpeaker!==true)throw new Error("P9_NATIVE_SPEAKER_DECLARATION_REQUIRED:"+recording.id);
      if(!allowedReusableLicense(recording.licenseName))throw new Error("P9_NATIVE_AUDIO_LICENSE_NOT_ADMITTED:"+recording.id);
      if(requiresAttribution(recording.licenseName))requireHttpUrl(recording?.attributionUrl,audioWhere+" attributionUrl");
      if(recordingIds.has(recording.id))throw new Error("P9_NATIVE_INVENTORY_DUPLICATE_RECORDING:"+recording.id);
      recordingIds.add(recording.id);
      if(recording.register&&!["casual","neutral","polite","formal"].includes(recording.register))throw new Error("P9_NATIVE_REGISTER_INVALID:"+recording.id);
      if(recording.speechRate&&!["slow","natural","fast"].includes(recording.speechRate))throw new Error("P9_NATIVE_SPEECH_RATE_INVALID:"+recording.id);
      recordings+=1;
      speakers.add(String(recording.speakerLabel??recording.credit).trim());
      if(recording.register)registers.add(recording.register);
      if(recording.speechRate)speechRates.add(recording.speechRate);
    }
  }

  return {
    sourceDocuments:documentIds.size,
    recordings,
    speakers:speakers.size,
    registers:[...registers].sort(),
    speechRates:[...speechRates].sort(),
    documentIds:[...documentIds],
    recordingIds:[...recordingIds]
  };
}

export function normalizeRegressionEvidence(value={}){
  const keys=["typecheck","unitTests","contentValidation","productionBuild","e2e","offlineDrill","providerOutageDrill","longHistoryDrill"];
  return Object.fromEntries(keys.map((key)=>[key,value[key]===true]));
}

export function buildQualificationReport({staticMetrics,native,regression,generatedAt=new Date().toISOString(),commit=process.env.GITHUB_SHA??null}){
  const rates=new Set(native.speechRates);
  const checks=[
    check("b2-text-breadth","B2 connected-text breadth",">="+THRESHOLDS.b2Texts,String(staticMetrics.b2Texts),staticMetrics.b2Texts>=THRESHOLDS.b2Texts,"content"),
    check("b2-production-breadth","B2 productive-task breadth",">="+THRESHOLDS.b2ProductiveTasks,String(staticMetrics.b2ProductiveTasks),staticMetrics.b2ProductiveTasks>=THRESHOLDS.b2ProductiveTasks,"content"),
    check("collocation-breadth","First-class B2 lexical chunks",">="+THRESHOLDS.lexicalChunks,String(staticMetrics.lexicalChunks),staticMetrics.lexicalChunks>=THRESHOLDS.lexicalChunks,"content"),
    check("functional-chains","Real-world functional chains",">="+THRESHOLDS.realWorldChains,String(staticMetrics.realWorldChains),staticMetrics.realWorldChains>=THRESHOLDS.realWorldChains,"performance"),
    check("unseen-performance-bank","Unseen/paraphrase/repair/timed prompt bank",">="+THRESHOLDS.realWorldPrompts,String(staticMetrics.realWorldPrompts),staticMetrics.realWorldPrompts>=THRESHOLDS.realWorldPrompts,"performance"),
    check("native-documents","Licensed native connected-source documents",">="+THRESHOLDS.nativeSourceDocuments,String(native.sourceDocuments),native.sourceDocuments>=THRESHOLDS.nativeSourceDocuments,"native_media"),
    check("native-recordings","Licensed native recordings",">="+THRESHOLDS.nativeRecordings,String(native.recordings),native.recordings>=THRESHOLDS.nativeRecordings,"native_media"),
    check("native-speakers","Independent speaker labels/credits",">="+THRESHOLDS.nativeSpeakers,String(native.speakers),native.speakers>=THRESHOLDS.nativeSpeakers,"native_media"),
    check("native-registers","Native register coverage",">="+THRESHOLDS.nativeRegisters,String(native.registers.length),native.registers.length>=THRESHOLDS.nativeRegisters,"native_media"),
    check("native-rate-natural","Natural-rate native source represented","natural",native.speechRates.join(", ")||"none",rates.has("natural"),"native_media"),
    check("native-rate-stretch","Faster-than-baseline source condition represented","fast",native.speechRates.join(", ")||"none",rates.has("fast"),"native_media"),
    regressionCheck("typecheck","TypeScript typecheck",regression.typecheck),
    regressionCheck("unit-tests","Unit/integration tests",regression.unitTests),
    regressionCheck("content-validation","Content validation",regression.contentValidation),
    regressionCheck("production-build","Production build",regression.productionBuild),
    regressionCheck("e2e","Certified viewport E2E",regression.e2e),
    regressionCheck("offline-drill","Offline resilience drill",regression.offlineDrill),
    regressionCheck("provider-outage","Provider outage drill",regression.providerOutageDrill),
    regressionCheck("long-history","Long-history projection drill",regression.longHistoryDrill)
  ];
  const passed=checks.filter((item)=>item.passed).length;
  const releaseQualified=passed===checks.length;
  return {
    schema:"thiepn-japanese-p9-release-qualification",
    schemaVersion:1,
    generatedAt,
    commit,
    releaseQualified,
    c1RoadmapGateOpen:releaseQualified,
    passed,
    total:checks.length,
    checks,
    staticMetrics,
    nativeInventory:native,
    regressionEvidence:regression
  };
}

export function reportMarkdown(report){
  const blockers=report.checks.filter((item)=>!item.passed);
  const lines=[
    "# P9 Release Qualification",
    "",
    "Generated: "+report.generatedAt,
    "Commit: "+(report.commit??"local"),
    "Result: "+(report.releaseQualified?"QUALIFIED":"BLOCKED"),
    "Checks: "+report.passed+" / "+report.total,
    "",
    "This is a product/system release gate, not a learner CEFR judgment.",
    "",
    "## Checks",
    "",
    "| Category | Check | Required | Actual | Result |",
    "| --- | --- | ---: | ---: | --- |",
    ...report.checks.map((item)=>"| "+item.category+" | "+item.label+" | "+item.required+" | "+item.actual+" | "+(item.passed?"PASS":"BLOCKED")+" |"),
    "",
    "## Blockers",
    "",
    ...(blockers.length?blockers.map((item)=>"- "+item.label+": requires "+item.required+", actual "+item.actual):["- None. The P9 release gate is open."]),
    "",
    "Synthetic TTS, inferred native-speaker status, and unverified licenses never count toward the native-media gate."
  ];
  return lines.join("\n");
}

function check(id,label,required,actual,passed,category){return {id,label,required,actual,passed,category};}
function regressionCheck(id,label,passed){return check(id,label,"pass",passed?"pass":"not certified",Boolean(passed),"regression");}
function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P9_NATIVE_INVENTORY_FIELD_REQUIRED:"+label);}
function requireHttpUrl(value,label){
  requireString(value,label);
  let url;
  try{url=new URL(value);}catch{throw new Error("P9_NATIVE_INVENTORY_URL_INVALID:"+label);}
  if(!["http:","https:"].includes(url.protocol))throw new Error("P9_NATIVE_INVENTORY_URL_INVALID:"+label);
}
function allowedReusableLicense(value){
  const normalized=String(value).toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
  if(!normalized)return false;
  if(/\bnc\b/.test(normalized)||normalized.includes("noncommercial")||/\bnd\b/.test(normalized)||normalized.includes("no derivatives"))return false;
  return normalized.includes("cc0")||normalized.includes("public domain")||normalized.includes("cc by")||normalized.includes("creative commons attribution");
}
function requiresAttribution(value){
  const normalized=String(value).toLowerCase();
  return !(normalized.includes("cc0")||normalized.includes("public domain"));
}
function parseArgs(args){
  const out={inventory:"release/p9-native-inventory.json",regression:null,outDir:"artifacts",strict:false};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--strict"){out.strict=true;continue;}
    if(arg==="--inventory"){out.inventory=args[++i];continue;}
    if(arg==="--regression"){out.regression=args[++i];continue;}
    if(arg==="--out-dir"){out.outDir=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  const inventoryPath=path.resolve(ROOT,options.inventory);
  const regressionPath=options.regression?path.resolve(ROOT,options.regression):null;
  const staticMetrics=getStaticProductMetrics(ROOT);
  const native=summarizeNativeInventory(readJson(inventoryPath));
  const regression=normalizeRegressionEvidence(regressionPath?readJson(regressionPath):{});
  const report=buildQualificationReport({staticMetrics,native,regression});
  const outDir=path.resolve(ROOT,options.outDir);
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,"p9-release-qualification.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(outDir,"p9-release-qualification.md"),reportMarkdown(report)+"\n");
  process.stdout.write((report.releaseQualified?"P9 RELEASE QUALIFIED":"P9 RELEASE BLOCKED")+" — "+report.passed+"/"+report.total+" checks passed\n");
  for(const blocker of report.checks.filter((item)=>!item.passed))process.stdout.write("BLOCKED "+blocker.id+": "+blocker.actual+" (required "+blocker.required+")\n");
  if(options.strict&&!report.releaseQualified)process.exitCode=1;
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
