import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const sha256=x=>createHash("sha256").update(x).digest("hex");
const REQUIREMENTS=Object.freeze([
 ["realAccountOAuth","P0","Account OAuth","Verify first-party Google code exchange, callback, verified session, logout and owner isolation with authorized disposable accounts","Account/identity operator"],
 ["physicalAndroidAndTalkBack","P0","Physical Android PWA","Witness install, offline reload, background/resume, rotation, large text, TalkBack, speakers, headphones, microphone and local audio deletion on a real device","Android/accessibility witness"],
 ["independentJapaneseReview","P0","Japanese curriculum and audio","Obtain qualified human language review of kana, kanji, readings, grammar, source rights and audio; preserve corrections as separate evidence","Independent Japanese reviewer"],
 ["independentP11LearnerReview","P0","P11 productive language","Submit at least six original writing/speaking artifacts to a qualified external teacher/tutor and admit independently verified review","P11 language reviewer"],
 ["exactVisualArchive","P0","Original 42-case visual archive","Recover original exact-candidate 42 cases and 126 original PNGs from independent custody; compare originals, not fixtures","Visual source custodian"],
 ["independentVisualAccessibilityReview","P1","Visual accessibility","Human-review original desktop/mobile/200% visual differences, legibility, contrast, overflow and layout","Independent visual reviewer"],
 ["independentAccessibilitySignoff","P1","Accessibility signoff","Independently witness keyboard/semantic/real TalkBack accessibility, record actual findings and separate signoff","Accessibility reviewer"],
 ["exactStagingIdentity","P1","Exact-head staging","Independently establish identical commit, build provenance, assets and recovery prerequisites on staging","Staging/release operator"],
 ["testedRollback","P1","Actual rollback","Witness restoration from exact candidate to verified prior stable original bytes and record success/failures","Independent recovery operator"]
]);
const fail=code=>{throw Error("J33_"+code)};
export function triageJ33(report,expectedCommit){
 if(!/^[a-f0-9]{40}$/.test(expectedCommit))fail("EXACT_SHA_REQUIRED");
 if(report?.schema!=="thiepn-japanese-j32-signoff-intake"||report.version!==1||
 report.candidateCommit!==expectedCommit||report.decision!=="BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF"||
 report.mode!=="OPERATOR_ONLY_OFFLINE_INTAKE_NOT_APPROVAL"||
 report.humanAcceptanceGranted!==false||report.mergeAuthorized!==false||
 report.deploymentAuthorized!==false||report.releaseAuthorized!==false)fail("UNSAFE_J32_SOURCE");
 if(!Array.isArray(report.domains)||report.domains.length!==9||
 !Array.isArray(report.originalCaseSlots)||report.originalCaseSlots.length!==42||
 !Array.isArray(report.originalPngSlots)||report.originalPngSlots.length!==126||
 report.originalCasesHumanAccepted!==0||report.originalPngsHumanAccepted!==0||
 report.missingEvidenceGates!==9)fail("SOURCE_COVERAGE_OR_AUTHORITY");
 const seen=new Set();
 for(const [i,d] of report.domains.entries()){
  if(!REQUIREMENTS.some(r=>r[0]===d?.kind)||seen.has(d.kind)||
    d.status!=="OPEN"||d.humanAcceptance!==false||
    d.verifiedReviewerIdentity!==false||
    d.externalPrimarySource!=="NOT_PROVIDED_TO_CI")fail("DOMAIN_NOT_INDEPENDENTLY_OPEN:"+i);
  seen.add(d.kind)
 }
 for(let i=0;i<42;i++)if(report.originalCaseSlots[i]?.id!=="VIS-"+String(i+1).padStart(3,"0")||
 report.originalCaseSlots[i]?.state!=="AWAITING_ORIGINAL")fail("VISUAL_CASE_TAMPER");
 for(let i=0;i<126;i++)if(report.originalPngSlots[i]?.id!=="PNG-"+String(i+1).padStart(3,"0")||
 report.originalPngSlots[i]?.state!=="AWAITING_ORIGINAL")fail("VISUAL_PNG_TAMPER");
 const raw=Buffer.from(JSON.stringify(report));
 const entries=REQUIREMENTS.map(([kind,priority,title,nextAction,operator],i)=>({
  discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),kind,priority,title,operator,
  state:"OPEN",evidenceState:"AWAITING_INDEPENDENT_PRIMARY_SOURCE",
  nextAction,requiredOriginalWitness:true,humanApproved:false,
  sourceEvidence:"NONE_PROVIDED",nextReviewState:"NOT_SCHEDULED",
  releaseImpact:"BLOCKING"
 }));
 return {schema:"thiepn-japanese-j33-evidence-triage",version:1,
  candidateCommit:expectedCommit,j32ReportSha256:sha256(raw),
  purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
  summary:{open:9,closed:0,p0:5,p1:4,originalCasesAccepted:0,
   originalPngsAccepted:0,independentHumanSignoffs:0},
  entries,unverifiedPhysicalDevice:true,unverifiedAccountOAuth:true,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE"};
}
export function renderJ33(report){
 if(report?.schema!=="thiepn-japanese-j33-evidence-triage"||
 report.decision!=="BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE"||
 report.releaseAuthorized!==false)fail("UNSAFE_OPERATOR_HTML");
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const rows=report.entries.map(d=>`<tr><th scope="row">${esc(d.discrepancyId)}</th><td>${esc(d.priority)}</td><td>${esc(d.title)}</td><td>${esc(d.nextAction)}</td><td>${esc(d.operator)}</td><td>OPEN</td></tr>`).join("");
 return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Japanese J33 — operator triage</title><style>body{font:16px/1.6 system-ui;margin:auto;max-width:1100px;padding:clamp(12px,3vw,30px);color:CanvasText;background:Canvas}h1{font-size:1.6rem}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{padding:.6rem;overflow-wrap:anywhere;text-align:left;border-bottom:1px solid GrayText;vertical-align:top}th{font-weight:650}caption{text-align:left;margin-bottom:1rem}a:focus-visible{outline:3px solid Highlight;outline-offset:3px}@media(max-width:650px){table,tbody,tr,th,td{display:block;width:auto}thead{position:absolute;clip-path:inset(50%);height:1px;overflow:hidden}tr{padding:.6rem 0;border-bottom:2px solid GrayText}th,td{border:0;padding:.1rem 0}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style><main><h1>Japanese J33 — independent evidence triage</h1><p role="status">BLOCKED — nine OPEN external acceptance domains, zero human visual approvals. No merge, deployment or release authorization.</p><p>Candidate <code>${esc(report.candidateCommit)}</code>. Source SHA256 <code>${esc(report.j32ReportSha256)}</code>. Priority P0 denotes evidence to collect first, not an automated approval decision.</p><table><caption>Operator-owned discrepancy actions. All require original independent evidence.</caption><thead><tr><th>ID</th><th>Priority</th><th>Domain</th><th>Next original witness action</th><th>Responsible role</th><th>State</th></tr></thead><tbody>${rows}</tbody></table><p>Original visual cases approved: 0/42. Original PNGs approved: 0/126. Machine verification never substitutes for actual human or physical acceptance.</p></main></html>`;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const candidate=process.env.J33_CANDIDATE_SHA;
 const src=path.resolve(root,"artifacts/j32-signoff-intake.json");
 const raw=JSON.parse(fs.readFileSync(src,"utf8"));
 const report=triageJ33(raw,candidate);
 const folder=path.resolve(root,"artifacts");fs.mkdirSync(folder,{recursive:true});
 fs.writeFileSync(path.join(folder,"j33-evidence-triage.json"),JSON.stringify(report,null,2)+"\n");
 fs.writeFileSync(path.join(folder,"j33-evidence-triage.html"),renderJ33(report)+"\n");
 console.log("J33 BLOCKED: 9 actionable OPEN domains, 0/42 original cases, 0/126 original PNG approvals");
}
