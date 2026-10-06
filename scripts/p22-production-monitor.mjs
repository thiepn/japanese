import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");

export function summarizeProductionManifest(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P22_PRODUCTION_MANIFEST_INVALID");
  if(manifest.schema!=="thiepn-japanese-p22-production")throw new Error("P22_PRODUCTION_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P22_PRODUCTION_VERSION_UNSUPPORTED");
  if(!["inactive","candidate","active","maintenance"].includes(manifest.status))throw new Error("P22_PRODUCTION_STATUS_INVALID");
  if(typeof manifest.maintenanceMode!=="boolean")throw new Error("P22_PRODUCTION_MAINTENANCE_INVALID");
  if(!manifest.monitor||!Array.isArray(manifest.monitor.requiredPaths)||manifest.monitor.requiredPaths.length<1)throw new Error("P22_PRODUCTION_MONITOR_PATHS_REQUIRED");
  if(!Number.isFinite(manifest.monitor.maxHomepageMs)||manifest.monitor.maxHomepageMs<=0)throw new Error("P22_PRODUCTION_MONITOR_LATENCY_INVALID");

  const active=manifest.status==="active"||manifest.status==="maintenance";
  if(active){
    requireHttpsUrl(manifest.publicUrl,"publicUrl");
    requireCommit(manifest.releaseCommit,"releaseCommit");
    requireString(manifest.releaseTag,"releaseTag");
    requireIsoDate(manifest.activatedAt,"activatedAt");
  }
  if(manifest.status==="inactive"){
    if(manifest.publicUrl!==null||manifest.releaseCommit!==null||manifest.releaseTag!==null||manifest.activatedAt!==null){
      throw new Error("P22_INACTIVE_PRODUCTION_MUST_NOT_CLAIM_RELEASE");
    }
  }

  const incidents=Array.isArray(manifest.knownIncidents)?manifest.knownIncidents:[];
  const openIncidents=incidents.filter((item)=>item?.status==="open");
  const blockingIncidents=openIncidents.filter((item)=>["critical","high"].includes(item?.severity)||item?.releaseBlocking===true);
  return {
    status:manifest.status,
    active,
    maintenanceMode:manifest.maintenanceMode,
    publicUrl:manifest.publicUrl??null,
    releaseCommit:manifest.releaseCommit??null,
    releaseTag:manifest.releaseTag??null,
    activatedAt:manifest.activatedAt??null,
    requiredPaths:[...manifest.monitor.requiredPaths],
    maxHomepageMs:manifest.monitor.maxHomepageMs,
    incidents,
    openIncidents,
    blockingIncidents,
    operationallyHealthy:active&&!manifest.maintenanceMode&&blockingIncidents.length===0
  };
}

export async function probeProduction({baseUrl,expectedCommit,requiredPaths,maxHomepageMs=5000,fetchImpl=fetch,now=new Date()}){
  requireHttpsUrl(baseUrl,"baseUrl");
  requireCommit(expectedCommit,"expectedCommit");
  const normalized=baseUrl.replace(/\/$/,"");
  const paths=[...new Set(requiredPaths)];
  const checks=[];
  for(const requiredPath of paths){
    if(typeof requiredPath!=="string"||!requiredPath.startsWith("/"))throw new Error("P22_MONITOR_PATH_INVALID:"+requiredPath);
    const url=normalized+requiredPath;
    const started=Date.now();
    try{
      const response=await fetchImpl(url,{method:"GET",headers:{"accept":"text/html,application/json;q=0.9,*/*;q=0.8"},cache:"no-store",redirect:"follow"});
      const elapsedMs=Date.now()-started;
      const body=requiredPath==="/release-meta.json"?await response.text():"";
      checks.push({path:requiredPath,url,status:response.status,ok:response.ok,elapsedMs,body});
    }catch(error){
      checks.push({path:requiredPath,url,status:null,ok:false,elapsedMs:Date.now()-started,error:error instanceof Error?error.message:String(error),body:""});
    }
  }

  const homepage=checks.find((item)=>item.path==="/");
  const releaseMetaCheck=checks.find((item)=>item.path==="/release-meta.json");
  let releaseMeta=null;
  let releaseMetaValid=false;
  if(releaseMetaCheck?.ok){
    try{
      releaseMeta=JSON.parse(releaseMetaCheck.body);
      releaseMetaValid=
        releaseMeta?.schema==="thiepn-japanese-release-meta"&&
        releaseMeta?.schemaVersion===1&&
        releaseMeta?.phase==="P22"&&
        releaseMeta?.channel==="stable"&&
        String(releaseMeta?.commit??"").toLowerCase()===expectedCommit.toLowerCase();
    }catch{/* invalid JSON stays false */}
  }
  const pathAvailability=checks.every((item)=>item.ok);
  const homepageLatencyOk=Boolean(homepage&&homepage.ok&&homepage.elapsedMs<=maxHomepageMs);
  const healthy=pathAvailability&&homepageLatencyOk&&releaseMetaValid;
  return {
    schema:"thiepn-japanese-p22-production-smoke",
    schemaVersion:1,
    checkedAt:now.toISOString(),
    baseUrl:normalized,
    expectedCommit:expectedCommit.toLowerCase(),
    healthy,
    pathAvailability,
    homepageLatencyOk,
    releaseMetaValid,
    homepageElapsedMs:homepage?.elapsedMs??null,
    maxHomepageMs,
    checks:checks.map(({body,...item})=>item),
    releaseMeta
  };
}

export function reportMarkdown(report){
  return [
    "# P22 Production Smoke",
    "",
    "- Checked: "+report.checkedAt,
    "- URL: "+report.baseUrl,
    "- Expected commit: "+report.expectedCommit,
    "- Result: "+(report.healthy?"HEALTHY":"UNHEALTHY"),
    "- Homepage latency: "+(report.homepageElapsedMs===null?"n/a":report.homepageElapsedMs+" ms")+" / "+report.maxHomepageMs+" ms max",
    "- Release metadata matches: "+(report.releaseMetaValid?"yes":"no"),
    "",
    "## Paths",
    "",
    "| Path | Status | Time | Result |",
    "| --- | ---: | ---: | --- |",
    ...report.checks.map((item)=>"| "+item.path+" | "+(item.status??"error")+" | "+item.elapsedMs+" ms | "+(item.ok?"PASS":"FAIL")+" |"),
    "",
    "This synthetic check verifies availability and release identity only. It does not prove end-user device behavior, learner correctness, provider quality or CEFR outcomes."
  ].join("\n");
}

export async function runCli(args=process.argv.slice(2)){
  let manifestPath="release/p22-production.json";
  let baseUrl=null;
  let expectedCommit=null;
  let outDir="artifacts";
  let strict=false;
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--manifest"){manifestPath=args[++i];continue;}
    if(arg==="--url"){baseUrl=args[++i];continue;}
    if(arg==="--commit"){expectedCommit=args[++i];continue;}
    if(arg==="--out-dir"){outDir=args[++i];continue;}
    if(arg==="--strict"){strict=true;continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }

  const manifest=JSON.parse(fs.readFileSync(path.resolve(ROOT,manifestPath),"utf8"));
  const production=summarizeProductionManifest(manifest);
  if(!baseUrl)baseUrl=production.publicUrl;
  if(!expectedCommit)expectedCommit=production.releaseCommit;
  if(!baseUrl||!expectedCommit){
    const inactive={
      schema:"thiepn-japanese-p22-production-smoke",
      schemaVersion:1,
      checkedAt:new Date().toISOString(),
      baseUrl:baseUrl??null,
      expectedCommit:expectedCommit??null,
      healthy:false,
      skipped:true,
      reason:"PRODUCTION_NOT_ACTIVE"
    };
    const target=path.resolve(ROOT,outDir);
    fs.mkdirSync(target,{recursive:true});
    fs.writeFileSync(path.join(target,"p22-production-smoke.json"),JSON.stringify(inactive,null,2)+"\n");
    process.stdout.write("P22 production smoke skipped — production is not active\n");
    if(strict)process.exitCode=1;
    return inactive;
  }

  const report=await probeProduction({baseUrl,expectedCommit,requiredPaths:production.requiredPaths,maxHomepageMs:production.maxHomepageMs});
  const target=path.resolve(ROOT,outDir);
  fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,"p22-production-smoke.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(target,"p22-production-smoke.md"),reportMarkdown(report)+"\n");
  process.stdout.write("P22 production smoke "+(report.healthy?"HEALTHY":"UNHEALTHY")+"\n");
  if(strict&&!report.healthy)process.exitCode=1;
  return report;
}

function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P22_FIELD_REQUIRED:"+label);}
function requireCommit(value,label){if(typeof value!=="string"||!/^[a-f0-9]{40}$/i.test(value))throw new Error("P22_COMMIT_INVALID:"+label);}
function requireIsoDate(value,label){if(typeof value!=="string"||!Number.isFinite(Date.parse(value)))throw new Error("P22_DATE_INVALID:"+label);}
function requireHttpsUrl(value,label){
  requireString(value,label);
  let parsed;
  try{parsed=new URL(value);}catch{throw new Error("P22_URL_INVALID:"+label);}
  if(parsed.protocol!=="https:")throw new Error("P22_HTTPS_REQUIRED:"+label);
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await runCli();
