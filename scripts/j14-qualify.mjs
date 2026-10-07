import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const strict=process.argv.includes("--strict");
const evidencePath=path.join(ROOT,"artifacts/j14-regression-evidence.json");
const budgetPath=path.join(ROOT,"artifacts/j14-experience-budget.json");
const devicePath=path.join(ROOT,"release/j14-device-acceptance.json");

for(const file of [evidencePath,budgetPath,devicePath]){
  if(!fs.existsSync(file))throw new Error("J14_QUALIFICATION_INPUT_MISSING:"+path.relative(ROOT,file));
}

const evidence=JSON.parse(fs.readFileSync(evidencePath,"utf8"));
const budget=JSON.parse(fs.readFileSync(budgetPath,"utf8"));
const device=JSON.parse(fs.readFileSync(devicePath,"utf8"));

const requiredAutomated=[
  "typecheck",
  "unitTests",
  "contentValidation",
  "nativeProvenanceAudit",
  "productionBuild",
  "bundleBudget",
  "e2e",
  "darkMode",
  "reflow320",
  "keyboard",
  "screenReaderStructure",
  "reducedMotion",
  "mobile",
  "tabletDesktop",
  "offlinePwa"
];
const missing=requiredAutomated.filter(key=>evidence[key]!==true);
const budgetPass=budget?.assertions?.technicalDiagnosticsLazy===true
  &&budget?.assertions?.mobileLayerLazy===true
  &&budget?.assertions?.exhibitionLayerLazy===true
  &&budget?.assertions?.noOversizedVisualAsset===true;

let status="pass";
const blockers=[];
if(missing.length){
  status="fail";
  blockers.push("Automated evidence missing or false: "+missing.join(", "));
}
if(!budgetPass){
  status="fail";
  blockers.push("J14 experience budget assertions are not all passing.");
}
if(device.status!=="pass"){
  if(status!=="fail")status="blocked_physical_device";
  blockers.push("Physical Android/PWA acceptance is still "+String(device.status??"unknown")+".");
}

const report={
  schema:"thiepn-japanese-j14-qualification",
  schemaVersion:1,
  status,
  automatedPass:missing.length===0&&budgetPass,
  physicalDeviceStatus:device.status,
  requiredAutomated,
  blockers,
  evidence,
  budgetSummary:{
    lazyChunkBudgets:budget.lazyChunkBudgets,
    visualAssetBudgets:budget.visualAssetBudgets,
    visualTotalBytes:budget.visualTotalBytes,
  },
  note:"J14 does not treat emulated Playwright profiles as physical-device acceptance."
};

fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"artifacts/j14-qualification.json"),JSON.stringify(report,null,2)+"\n");
fs.writeFileSync(path.join(ROOT,"artifacts/j14-qualification.md"),markdown(report));

process.stdout.write(`J14 qualification: ${status}\n`);
if(blockers.length)process.stdout.write(blockers.map(item=>"- "+item).join("\n")+"\n");
if(strict&&status!=="pass")process.exitCode=1;

function markdown(report){
  const lines=[
    "# J14 Qualification",
    "",
    `Status: **${report.status}**`,
    "",
    `Automated qualification: **${report.automatedPass?"PASS":"FAIL"}**`,
    `Physical-device acceptance: **${report.physicalDeviceStatus}**`,
    "",
    "## Blockers",
    "",
    ...(report.blockers.length?report.blockers.map(item=>"- "+item):["- None"]),
    "",
    "Automated browser/device profiles do not substitute for a real physical Android/PWA acceptance pass.",
    ""
  ];
  return lines.join("\n");
}
