import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {P21_REQUIRED_DEVICE_CHECKS} from "./p21-release-certify.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/;
const digest=value=>createHash("sha256").update(value).digest("hex");
const fail=code=>{throw new Error("J34_"+code)};
const OAUTH=[
 ["accountEntry","Open the first-party Account entry and explicitly choose Google sign-in"],
 ["providerReturn","Witness the real Google consent and callback in the expected browser context"],
 ["verifiedSession","Confirm the app shows the independently verified signed-in Account session"],
 ["installedPwaReturn","Return to installed standalone PWA, cold-reopen and verify retained session"],
 ["logout","Explicitly log out, then verify Account and Japanese both show signed out"],
 ["accountIsolation","Use two independently authorized disposable accounts and check local evidence isolation"]
];
const ANDROID=[
 ["candidateIdentity","Compare live release-meta.json with the exact tested candidate commit"],
 ...P21_REQUIRED_DEVICE_CHECKS.map(key=>[key,({
  installStandalone:"Install from real Chrome, launch from the home-screen icon in standalone mode",
  coreSurfaces:"Open Today, Learn, Immerse, Library and Progress without clipping",
  studyControls:"Start/answer/exit a Study Player session, including large touch targets",
  speakerAudio:"Play source-labelled audio using the handset speaker",
  headphoneAudio:"Play the same task through attached headphones",
  offlineReload:"Cache a task, enable airplane mode, close/reopen and recover learner state",
  backgroundResume:"Background and resume a partially completed review without lost evidence",
  rotation:"Rotate portrait-landscape-portrait and confirm all actions remain reachable",
  largeText:"Increase system/browser text scaling to 200% and check readability/reflow",
  microphoneRecording:"Give real microphone permission, record locally and replay sample",
  localAudioDelete:"Delete an actual locally captured P19 recording and verify it is gone",
  safeAreaNavigation:"Check system bars, keyboard and bottom navigation without overlapping controls"
 })[key]]),
 ["talkBackTraversal","Enable real TalkBack and independently witness name, focus order and activation"]
];
const REVIEW=[
 ["japaneseReadings","Independently check original kana, kanji, readings and romanization examples"],
 ["grammarExplanations","Independently check grammar levels, conjugations, examples and answer keys"],
 ["nativeAudio","Confirm real recording provenance, license, attribution and audible correctness"],
 ["sourceRights","Inspect original source rights independently of machine manifest statements"],
 ["p11Writing","Have an external teacher/tutor review original connected writing artifacts"],
 ["p11Speaking","Have an external teacher/tutor review spoken interaction/production artifacts; at least six representative artifacts in total"]
];
const VISUAL=[
 ["original42","Acquire and map 42 authentic original visual cases, not blank accounting slots"],
 ["original126","Acquire and hash all 126 independently sourced original PNG files"],
 ["humanComparison","Visually inspect original/candidate/diff per case with an external reviewer"],
 ["visualAccessibility","Witness mobile/desktop/dark/200% zoom legibility and contrast"],
 ["accessibilitySignoff","Obtain a separate real keyboard/TalkBack accessibility witness"],
 ["stagingRollback","Independently witness exact-head staging and actual restoration of a known-good release"]
];
const GROUPS=Object.freeze([
 {id:"oauth",title:"First-party Account / Google OAuth",role:"Authorized identity operator",checks:OAUTH},
 {id:"android",title:"Physical Android / installed PWA",role:"Physical handset and accessibility witness",checks:ANDROID},
 {id:"language",title:"Japanese and P11 external reviewers",role:"Independent qualified language reviewer",checks:REVIEW},
 {id:"visual",title:"Original visuals / staging / recovery",role:"Independent visual and release operator",checks:VISUAL}
]);
export const J34_GROUPS=GROUPS;

export function createJ34FieldKit(triage,candidateCommit){
 if(!SHA.test(candidateCommit))fail("EXACT_SHA_REQUIRED");
 if(triage?.schema!=="thiepn-japanese-j33-evidence-triage"||
  triage.version!==1||triage.candidateCommit!==candidateCommit||
  !/^[a-f0-9]{64}$/.test(triage.j32ReportSha256??"")||
  triage.purpose!=="ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL"||
  triage.decision!=="BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE"||
  triage.humanAcceptanceGranted!==false||triage.mergeAuthorized!==false||
  triage.deploymentAuthorized!==false||triage.releaseAuthorized!==false)fail("UNSAFE_TRIAGE_SOURCE");
 if(triage.summary?.open!==9||triage.summary?.closed!==0||
  triage.summary?.originalCasesAccepted!==0||triage.summary?.originalPngsAccepted!==0||
  !Array.isArray(triage.entries)||triage.entries.length!==9||
  new Set(triage.entries.map(x=>x.kind)).size!==9||
  triage.entries.some((x,i)=>x.discrepancyId!=="J33-D"+String(i+1).padStart(2,"0")||
    x.state!=="OPEN"||x.humanApproved!==false||x.releaseImpact!=="BLOCKING"))fail("MISSING_OPEN_DOMAINS");
 const checks=GROUPS.map(g=>({
  id:g.id,title:g.title,role:g.role,
  checks:g.checks.map(([id,instructions])=>({id,instructions,state:"NOT_TESTED",originalEvidence:"NOT_PROVIDED"}))
 }));
 return {schema:"thiepn-japanese-j34-physical-field-kit",version:1,
  candidateCommit,j33ReportSha256:digest(JSON.stringify(triage)),
  mode:"OFFLINE_ORIGINAL_OBSERVATION_CAPTURE_NOT_CERTIFICATION",
  groups:checks,originalVisualCasesApproved:0,originalPngsApproved:0,
  independentHumanSignoffs:0,recordedObservations:0,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"BLOCKED_AWAITING_ACTUAL_OPERATOR_SESSIONS"};
}
export function validateObservationExport(packet,kit){
 if(packet?.schema!=="thiepn-japanese-j34-operator-observation-export"||packet.version!==1||
 packet.candidateCommit!==kit.candidateCommit||packet.j33ReportSha256!==kit.j33ReportSha256||
 packet.humanAcceptanceGranted!==false||packet.mergeAuthorized!==false||
 packet.deploymentAuthorized!==false||packet.releaseAuthorized!==false||
 packet.independentlyWitnessed!==false||packet.finalDecision!=="UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY"||
 !Array.isArray(packet.observations))fail("UNSAFE_OBSERVATION_EXPORT");
 const required=kit.groups.flatMap(group=>group.checks.map(c=>group.id+":"+c.id));
 if(packet.observations.length!==required.length||
 new Set(packet.observations.map(o=>o.group+":"+o.check)).size!==required.length)fail("OBSERVATION_COVERAGE");
 for(let i=0;i<required.length;i++){
  const o=packet.observations[i];
  if(o.group+":"+o.check!==required[i]||
  !["NOT_TESTED","OBSERVED_PASS","OBSERVED_FAIL"].includes(o.status)||
  typeof o.note!=="string"||o.note.length>1200||
  typeof o.evidenceRef!=="string"||o.evidenceRef.length>250)fail("OBSERVATION_INVALID");
 }
 const match=packet.observedCommit===kit.candidateCommit;
 if(!match&&packet.observations.some(x=>x.status==="OBSERVED_PASS"))fail("CROSS_SHA_PASS_FORBIDDEN");
 if(packet.buildIdentityMatched!==match)fail("BUILD_IDENTITY_FALSE");
 return {observations:packet.observations.length,operatorPasses:packet.observations.filter(x=>x.status==="OBSERVED_PASS").length,
  independentApprovals:0,decision:"UNVERIFIED_ONLY"};
}
export function renderJ34FieldKit(kit){
 if(kit?.schema!=="thiepn-japanese-j34-physical-field-kit"||
 kit.decision!=="BLOCKED_AWAITING_ACTUAL_OPERATOR_SESSIONS"||kit.releaseAuthorized!==false||
 kit.humanAcceptanceGranted!==false)fail("UNSAFE_HTML_SOURCE");
 const seed=JSON.stringify(kit).replace(/</g,"\\u003c");
 return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Japanese J34 — real-world field session</title>'+
 '<style>body{font:16px/1.55 system-ui;color:CanvasText;background:Canvas;max-width:900px;margin:auto;padding:clamp(12px,3vw,30px);overflow-wrap:anywhere}h1{font-size:1.5rem}h2{font-size:1.2rem}input,textarea,select,button{font:inherit;max-width:100%;box-sizing:border-box}input,textarea{width:100%;padding:.6rem;margin:.25rem 0 .75rem}label{display:block;font-weight:600}button{padding:.65rem 1rem;min-height:44px}select{padding:.5rem;min-height:44px}.check{border-top:1px solid GrayText;padding:.8rem 0}.check small{display:block}.controls{display:grid;grid-template-columns:1fr 2fr;gap:12px}.group{margin:1.25rem 0;border:1px solid GrayText;padding:1rem}.banner{border-left:4px solid GrayText;padding:.5rem 1rem}summary{font-weight:650;cursor:pointer}:focus-visible{outline:3px solid Highlight;outline-offset:3px}@media(max-width:600px){.controls{grid-template-columns:1fr}.group{padding:.6rem}}@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}</style>'+
 '<main><h1>Japanese J34 — physical field session</h1><p class="banner" role="status" id="status">BLOCKED — no original hardware, OAuth, reviewer or visual acceptance has been recorded.</p>'+
 '<p>Offline-only field tool. No automatic testing, network requests, storage or submission. Do not type or export passwords, tokens, personal account identifiers, private transcripts or raw audio. Notes are self-reported, not independently approved.</p>'+
 '<p>Target exact commit: <code id="target"></code></p><label for="observed">Observed deployment commit (40 lowercase hexadecimal characters)</label><input id="observed" autocomplete="off" spellcheck="false" maxlength="40" placeholder="Read from the deployed release-meta.json">'+
 '<label for="operator">Non-identifying operator alias</label><input id="operator" autocomplete="off" maxlength="64" placeholder="e.g. device-tester-A">'+
 '<div id="groups"></div><p>Observed PASS/FAIL is an operator note, not a certified release result. Wrong or absent deployed commit prevents exporting passes.</p>'+
 '<label for="resume">Resume previously exported unverified JSON (local only)</label><input id="resume" type="file" accept=".json,application/json"><p id="resume-info" role="status" aria-live="polite">No prior session loaded; acceptance remains OPEN.</p>'+\n '<button id="export" type="button">Export unverified session JSON</button><p id="export-info" aria-live="polite"></p>'+
 '<script id="j34-seed" type="application/json">'+seed+'</script>'+
 '<script>(function(){"use strict";'+
 'const kit=JSON.parse(document.getElementById("j34-seed").textContent);'+
 'document.getElementById("target").textContent=kit.candidateCommit;'+
 'const root=document.getElementById("groups");'+
 'for(const group of kit.groups){const d=document.createElement("details");d.className="group";d.open=group.id==="oauth"||group.id==="android";'+
 'const summary=document.createElement("summary");summary.textContent=group.title+" — "+group.role;d.append(summary);'+
 'for(const check of group.checks){const box=document.createElement("div");box.className="check";'+
 'const label=document.createElement("label");label.textContent=check.instructions;const select=document.createElement("select");select.dataset.group=group.id;select.dataset.check=check.id;'+
 'for(const [value,title] of [["NOT_TESTED","Not tested"],["OBSERVED_PASS","Observed pass (unverified)"],["OBSERVED_FAIL","Observed fail"]]){const o=document.createElement("option");o.value=value;o.textContent=title;select.append(o)}label.append(select);box.append(label);'+
 'const note=document.createElement("label");note.textContent="Sanitized original observation / reproduction steps";const area=document.createElement("textarea");area.maxLength=1200;area.rows=2;area.dataset.note=check.id;note.append(area);box.append(note);'+
 'const ev=document.createElement("label");ev.textContent="Non-sensitive evidence reference (optional)";const field=document.createElement("input");field.maxLength=250;field.dataset.evidence=check.id;ev.append(field);box.append(ev);d.append(box)}root.append(d)}'+
 'const selects=[...document.querySelectorAll("select[data-check]")];const observed=document.getElementById("observed");'+
 'const banner=document.getElementById("status");function refresh(){const n=selects.filter(x=>x.value!=="NOT_TESTED").length;'+
 'const match=observed.value===kit.candidateCommit;banner.textContent=(match?"Exact SHA entered; ":"STOP — exact deployed SHA not confirmed; ")+n+" / "+selects.length+" observations entered. All independent acceptance remains OPEN; release BLOCKED."}'+
 'observed.addEventListener("input",refresh);selects.forEach(x=>x.addEventListener("change",refresh));refresh();'+
 'document.getElementById("resume").addEventListener("change",async function(){'+
 'const output=document.getElementById("resume-info");const file=this.files&&this.files[0];'+
 'if(!file){output.textContent="No session selected; acceptance remains OPEN.";return}'+
 'try{if(file.size<2||file.size>131072)throw Error("size");'+
 'const raw=JSON.parse(await file.text());const same=raw.candidateCommit===kit.candidateCommit&&raw.j33ReportSha256===kit.j33ReportSha256;'+
 'const safe=raw.schema==="thiepn-japanese-j34-operator-observation-export"&&raw.version===1&&same&&'+
 'raw.observedCommit===kit.candidateCommit&&raw.buildIdentityMatched===true&&raw.independentlyWitnessed===false&&'+
 'raw.humanAcceptanceGranted===false&&raw.mergeAuthorized===false&&raw.deploymentAuthorized===false&&'+
 'raw.releaseAuthorized===false&&raw.finalDecision==="UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY"&&'+
 'typeof raw.operatorAlias==="string"&&raw.operatorAlias.length<=64&&Array.isArray(raw.observations)&&'+
 'raw.observations.length===selects.length;'+
 'if(!safe)throw Error("source");'+
 'for(let i=0;i<selects.length;i++){const v=raw.observations[i];const e=selects[i];'+
 'if(!v||v.group!==e.dataset.group||v.check!==e.dataset.check||'+
 '!["NOT_TESTED","OBSERVED_PASS","OBSERVED_FAIL"].includes(v.status)||'+
 'typeof v.note!=="string"||v.note.length>1200||typeof v.evidenceRef!=="string"||v.evidenceRef.length>250)throw Error("item")}'+
 'document.getElementById("observed").value=kit.candidateCommit;'+
 'document.getElementById("operator").value=raw.operatorAlias;'+
 'raw.observations.forEach((v,i)=>{const e=selects[i],box=e.closest(".check");e.value=v.status;box.querySelector("textarea").value=v.note;box.querySelector("input").value=v.evidenceRef});'+
 'refresh();output.textContent="Prior unverified notes restored locally; all independent acceptance stays OPEN."'+
 '}catch{output.textContent="Import rejected: missing, altered or mismatched exact-head unverified session. No fields changed."}'+
 'this.value=""});'+
 
 'document.getElementById("export").addEventListener("click",function(){const match=observed.value===kit.candidateCommit;'+
 'const observations=selects.map(s=>{const container=s.closest(".check");return {group:s.dataset.group,check:s.dataset.check,status:match?s.value:"NOT_TESTED",'+
 'note:container.querySelector("textarea").value,evidenceRef:container.querySelector("input").value}});'+
 'const record={schema:"thiepn-japanese-j34-operator-observation-export",version:1,candidateCommit:kit.candidateCommit,j33ReportSha256:kit.j33ReportSha256,observedCommit:observed.value,buildIdentityMatched:match,operatorAlias:document.getElementById("operator").value,'+
 'recordedAt:new Date().toISOString(),observations,independentlyWitnessed:false,humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,finalDecision:"UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY"};'+
 'const blob=new Blob([JSON.stringify(record,null,2)+"\\n"],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="j34-unverified-field-session.json";a.click();URL.revokeObjectURL(url);'+
 'document.getElementById("export-info").textContent="Exported local unverified notes only. No approval or external submission occurred."})'+
 '})();</script></main></html>';
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const candidate=process.env.J34_CANDIDATE_SHA;
 const j33=JSON.parse(fs.readFileSync(path.join(ROOT,"artifacts/j33-evidence-triage.json"),"utf8"));
 const kit=createJ34FieldKit(j33,candidate);
 const dir=path.join(ROOT,"artifacts");fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"j34-field-kit.json"),JSON.stringify(kit,null,2)+"\n");
 fs.writeFileSync(path.join(dir,"j34-field-kit.html"),renderJ34FieldKit(kit)+"\n");
 console.log("J34 offline field kit generated; all actual physical/human acceptance OPEN; authorization denied");
}
