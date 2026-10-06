import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");

export const ALLOWED_P22_CHANGE_TYPES=[
  "defect",
  "security",
  "privacy",
  "accessibility",
  "dependency",
  "content_correction",
  "reliability",
  "operations"
];

export function summarizeMaintenanceManifest(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P22_MAINTENANCE_MANIFEST_INVALID");
  if(manifest.schema!=="thiepn-japanese-p22-maintenance")throw new Error("P22_MAINTENANCE_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P22_MAINTENANCE_VERSION_UNSUPPORTED");
  if(manifest.policy!=="defect-only")throw new Error("P22_MAINTENANCE_POLICY_INVALID");
  if(manifest.capabilityFreeze!=="P20")throw new Error("P22_CAPABILITY_FREEZE_INVALID");
  if(!Array.isArray(manifest.entries))throw new Error("P22_MAINTENANCE_ENTRIES_REQUIRED");

  const ids=new Set();
  const entries=manifest.entries.map((entry,index)=>{
    const where="entry "+(index+1);
    requireString(entry?.id,where+" id");
    if(ids.has(entry.id))throw new Error("P22_MAINTENANCE_DUPLICATE_ID:"+entry.id);
    ids.add(entry.id);
    if(!ALLOWED_P22_CHANGE_TYPES.includes(entry?.changeType))throw new Error("P22_MAINTENANCE_CHANGE_TYPE_INVALID:"+entry.id);
    requireString(entry?.summary,where+" summary");
    requireCommit(entry?.commit,where+" commit");
    if(!["low","medium","high","critical"].includes(entry?.risk))throw new Error("P22_MAINTENANCE_RISK_INVALID:"+entry.id);
    if(!["planned","verified","released","rolled_back"].includes(entry?.status))throw new Error("P22_MAINTENANCE_STATUS_INVALID:"+entry.id);
    if(!Array.isArray(entry?.regressionScope)||entry.regressionScope.length<1)throw new Error("P22_MAINTENANCE_REGRESSION_SCOPE_REQUIRED:"+entry.id);
    for(const item of entry.regressionScope)requireString(item,where+" regressionScope");
    if(typeof entry?.requiresPhysicalDeviceRetest!=="boolean")throw new Error("P22_MAINTENANCE_DEVICE_RETEST_REQUIRED:"+entry.id);
    if(entry.status==="released")requireIsoDate(entry?.releasedAt,"P22_MAINTENANCE_RELEASE_DATE_INVALID:"+entry.id);
    if(entry.status!=="released"&&entry.releasedAt!=null)throw new Error("P22_MAINTENANCE_PREMATURE_RELEASE_DATE:"+entry.id);
    if(entry.capabilityExpansion===true)throw new Error("P22_MAINTENANCE_CAPABILITY_EXPANSION_FORBIDDEN:"+entry.id);
    return {
      id:entry.id,
      changeType:entry.changeType,
      summary:entry.summary,
      commit:entry.commit.toLowerCase(),
      risk:entry.risk,
      status:entry.status,
      regressionScope:[...entry.regressionScope],
      requiresPhysicalDeviceRetest:entry.requiresPhysicalDeviceRetest,
      releasedAt:entry.releasedAt??null,
      capabilityExpansion:false
    };
  });

  return {
    policy:"defect-only",
    capabilityFreeze:"P20",
    entries,
    open:entries.filter((item)=>item.status==="planned"||item.status==="verified").length,
    released:entries.filter((item)=>item.status==="released").length,
    rolledBack:entries.filter((item)=>item.status==="rolled_back").length,
    physicalRetestRequired:entries.filter((item)=>item.requiresPhysicalDeviceRetest&&item.status!=="rolled_back").length
  };
}

export function runCli(args=process.argv.slice(2)){
  let manifestPath="release/p22-maintenance.json";
  let outDir="artifacts";
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--manifest"){manifestPath=args[++i];continue;}
    if(arg==="--out-dir"){outDir=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  const manifest=JSON.parse(fs.readFileSync(path.resolve(ROOT,manifestPath),"utf8"));
  const summary=summarizeMaintenanceManifest(manifest);
  const target=path.resolve(ROOT,outDir);
  fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,"p22-maintenance-summary.json"),JSON.stringify(summary,null,2)+"\n");
  process.stdout.write("P22 maintenance manifest valid — "+summary.entries.length+" recorded changes\n");
  return summary;
}

function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P22_FIELD_REQUIRED:"+label);}
function requireCommit(value,label){if(typeof value!=="string"||!/^[a-f0-9]{40}$/i.test(value))throw new Error("P22_COMMIT_INVALID:"+label);}
function requireIsoDate(value,label){if(typeof value!=="string"||!Number.isFinite(Date.parse(value)))throw new Error(label);}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
