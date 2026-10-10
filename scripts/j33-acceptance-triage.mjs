import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {DOMAINS,sha256} from "./j28-independent-custody.mjs";
import {machinePreparation} from "./j32-signoff-intake.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/;
const HASH=/^[0-9a-f]{64}$/;
const ID=/^[A-Z0-9][A-Z0-9_-]{2,63}$/;
const SOURCE=/^evidence\/[a-z0-9][a-z0-9_-]{0,79}\.(?:json|png|pdf|txt)$/;
const OBSERVATIONS=new Set(["MISSING","SOURCE_SUPPLIED_UNVERIFIED","DEFECT_REPORTED","CONFLICT_REPORTED"]);
const DENIAL="BLOCKED_EXTERNAL_HUMAN_AND_PHYSICAL_ACCEPTANCE";
function fail(code){throw new Error("J33_"+code);}
function digest(x){return sha256(Buffer.from(JSON.stringify(x)));}
function equal(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function cleanText(x,max){return typeof x==="string"&&x.trim()&&x.length<=max&& !/[\u0000-\u001f]/.test(x);}
function isDate(x){return typeof x==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(x)&&Number.isFinite(Date.parse(x));}

export const ESCALATION_PLAN=Object.freeze([
 {kind:"physicalAndroidAndTalkBack",priority:"P0",ownerRole:"Independent Android field witness",required:"Exact-head installed Android PWA; offline/reload/resume; TalkBack; speaker/headphones; microphone and local-audio deletion",nextAction:"Record each physical P21 device check with device/build identity; reproduce and classify actual failures"},
 {kind:"realAccountOAuth",priority:"P0",ownerRole:"First-party THIEPN Account operator",required:"Real Google OAuth browser and standalone-PWA callbacks, verified account identity, persistence, sign-out and local-data isolation",nextAction:"Record real OAuth stage diagnostics on Chrome and Android PWA; reproduce signed-out return without exposing secrets"},
 {kind:"independentJapaneseReview",priority:"P0",ownerRole:"Independent Japanese language specialist",required:"Source-verified kana, kanji, vocabulary, grammar, readings, audio and curriculum review",nextAction:"Review original J21 packet against primary Japanese source material; document corrections and reviewer identity evidence"},
 {kind:"independentP11LearnerReview",priority:"P0",ownerRole:"Independent Japanese teacher or language professional",required:"Six original representative productive artifacts including both speaking and writing with a signed P11 reviewer judgment",nextAction:"Acquire a genuine external P11 review; bind original artifact bytes and packet SHA-256 without promoting learner mastery"},
 {kind:"exactVisualArchive",priority:"P0",ownerRole:"Independent original-image custodian and human visual reviewer",required:"All 42 original visual cases and 126 original reference/candidate/diff PNGs plus independently compared originals",nextAction:"Acquire originals, map real filenames to accounting slots, verify PNG bytes, then obtain separate human visual decisions"},
 {kind:"independentVisualAccessibilityReview",priority:"P1",ownerRole:"Independent visual and legibility reviewer",required:"Original desktop/mobile/320px/200%/dark comparisons, contrast, focus and layout findings",nextAction:"Visually inspect each original screenshot and record every disagreement separately from automated pixel checks"},
 {kind:"independentAccessibilitySignoff",priority:"P1",ownerRole:"Independent accessibility specialist",required:"Real keyboard, semantics, TalkBack and assistive-technology witness; explicit review authority",nextAction:"Observe actual accessibility behavior, document open defects and sign off only through an independent process"},
 {kind:"exactStagingIdentity",priority:"P1",ownerRole:"Independent release operations witness",required:"Exact commit staged build, binary integrity, deployment origin, source rights and independent operator custody",nextAction:"Capture genuine staging origin/build checksums and independently verify the same candidate SHA"},
 {kind:"testedRollback",priority:"P1",ownerRole:"Independent recovery and rollback operator",required:"Original previous-stable bytes and witnessed restore/rollback rehearsal on authorized disposable staging",nextAction:"Run an authorized controlled rollback and preserve original recovery evidence; do not touch live production"}
]);
if(ESCALATION_PLAN.length!==9||new Set(ESCALATION_PLAN.map(x=>x.kind)).size!==9||ESCALATION_PLAN.some(x=>!DOMAINS.includes(x.kind)))throw new Error("J33_ESCALATION_CONTRACT_INVALID");

function checkedNotes(notes,candidateCommit,j32Digest){
 if(notes==null)return [];
 if(notes?.schema!=="thiepn-japanese-j33-operator-observations"||notes.version!==1||
   notes.candidateCommit!==candidateCommit||notes.j32ReportDigest!==j32Digest||
   notes.humanAcceptanceGranted!==false||notes.mergeAuthorized!==false||
   notes.deploymentAuthorized!==false||notes.releaseAuthorized!==false||
   !Array.isArray(notes.observations)||notes.observations.length>45)fail("OBSERVATION_ENVELOPE_INVALID");
 const ids=new Set();
 return notes.observations.map(item=>{
  if(!item||!ID.test(item.id??"")||ids.has(item.id)||!DOMAINS.includes(item.kind)||
   !OBSERVATIONS.has(item.assessment)||!cleanText(item.description,1200)||
   !isDate(item.reportedAt)||!cleanText(item.reporterRole,120)||
   item.humanAccepted!==false||item.independentIdentityVerified!==false||
   item.releaseAuthorized!==false)fail("UNTRUSTED_OBSERVATION_OR_DUPLICATE");
  ids.add(item.id);
  if(item.assessment==="MISSING"){
   if(item.evidencePath!==null||item.evidenceSha256!==null)fail("MISSING_SOURCE_CLAIM_CONFLICT");
  }else if(item.evidencePath!==null||item.evidencePath!==undefined||
            item.evidenceSha256!==null||item.evidenceSha256!==undefined){
   if(!SOURCE.test(item.evidencePath??"")||!HASH.test(item.evidenceSha256??""))fail("UNSAFE_UNPINNED_SOURCE_REFERENCE");
  }
  return {id:item.id,kind:item.kind,assessment:item.assessment,description:item.description,
   reporterRole:item.reporterRole,reportedAt:item.reportedAt,
   evidencePath:item.evidencePath??null,evidenceSha256:item.evidenceSha256??null,
   originalBytesAuthenticated:false,reporterIdentityVerified:false,humanAccepted:false};
 });
}
export function blankOperatorObservations({candidateCommit,j32ReportDigest}){
 if(!SHA.test(candidateCommit)||!HASH.test(j32ReportDigest))fail("TEMPLATE_BINDING_INVALID");
 return {schema:"thiepn-japanese-j33-operator-observations",version:1,candidateCommit,j32ReportDigest,
  warning:"UNSIGNED_OPERATOR_NOTES_ONLY_NO_INDEPENDENT_SOURCE_OR_HUMAN_AUTHORITY",
  observations:[],humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false};
}
export function reconcileTriage({candidateCommit,j27,j28,j29,j30,j31,j32,operatorNotes=null}){
 if(!SHA.test(candidateCommit))fail("EXACT_COMMIT_REQUIRED");
 const canonical=machinePreparation({candidateCommit,j27,j28,j29,j30,j31});
 if(!equal(j32,canonical))fail("J32_CANONICAL_BLOCKED_REPORT_MISMATCH");
 if(!Array.isArray(j31.discrepancies)||j31.discrepancies.length!==9||
  j31.openDiscrepancies!==9||j31.closedDiscrepancies!==0)fail("J31_GAPS_INVALID");
 const seen=new Set();
 for(const d of j31.discrepancies){
  if(!ID.test(d?.id??"")||seen.has(d.kind)||!DOMAINS.includes(d.kind)||
   d.state!=="OPEN"||d.closureState!=="OPEN"||d.decisionImpact!=="BLOCKING"||
   d.independentHumanAcceptance!=="NOT_RECEIVED")fail("UPSTREAM_DISCREPANCY_TAMPERED");
  seen.add(d.kind);
 }
 const j32ReportDigest=digest(j32);
 const observations=checkedNotes(operatorNotes,candidateCommit,j32ReportDigest);
 const entries=ESCALATION_PLAN.map(plan=>{
  const upstream=j31.discrepancies.find(x=>x.kind===plan.kind);
  const notes=observations.filter(x=>x.kind===plan.kind);
  const state=notes.some(x=>x.assessment==="CONFLICT_REPORTED")?"CONFLICT_REQUIRES_INDEPENDENT_REVIEW":
    notes.some(x=>x.assessment==="DEFECT_REPORTED")?"REPORTED_DEFECT_REQUIRES_REPRODUCTION":
    notes.some(x=>x.assessment==="SOURCE_SUPPLIED_UNVERIFIED")?"SOURCE_REPORTED_NOT_ACCEPTED":"AWAITING_ORIGINAL_EVIDENCE";
  return {discrepancyId:upstream.id,kind:plan.kind,priority:plan.priority,ownerRole:plan.ownerRole,
   requirement:plan.required,nextAction:plan.nextAction,upstreamAction:upstream.nextAction,
   state:"OPEN",triageState:state,observations:notes,reportedObservationCount:notes.length,
   independentlyAuthenticatedOriginals:0,independentHumanAcceptance:false,releaseImpact:"BLOCKING"};
 });
 return {schema:"thiepn-japanese-j33-acceptance-triage",version:1,candidateCommit,
  upstreamChainRoot:j27.chainRoot,j31ReportDigest:digest(j31),j32ReportDigest,
  source:"CANONICAL_J31_J32_BLOCKED_AND_UNSIGNED_OPERATOR_NOTES",operatorNotesDigest:operatorNotes?digest(operatorNotes):null,
  priorities:entries,openDiscrepancies:9,closedDiscrepancies:0,
  reportedObservations:observations.length,unverifiedSourceReferences:observations.filter(x=>x.evidenceSha256).length,
  originalVisualCasesHumanAccepted:0,originalPngsHumanAccepted:0,
  actualDeviceAndOAuthAcceptance:false,independentJapaneseAndP11Acceptance:false,
  operatorNotesAreNotEvidence:true,needsIndependentPhysicalHumanWitness:true,
  signoffReadiness:"NOT_READY",humanAcceptanceGranted:false,mergeAuthorized:false,
  deploymentAuthorized:false,releaseAuthorized:false,decision:DENIAL};
}
function escape(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
export function renderTriageHtml(r){
 if(r?.schema!=="thiepn-japanese-j33-acceptance-triage"||r.decision!==DENIAL||
  r.signoffReadiness!=="NOT_READY"||r.humanAcceptanceGranted!==false||
  r.mergeAuthorized!==false||r.deploymentAuthorized!==false||r.releaseAuthorized!==false||
  r.openDiscrepancies!==9||r.closedDiscrepancies!==0||
  r.originalVisualCasesHumanAccepted!==0||r.originalPngsHumanAccepted!==0||
  !Array.isArray(r.priorities)||r.priorities.length!==9||
  r.priorities.some((x,i)=>x.kind!==ESCALATION_PLAN[i].kind||x.state!=="OPEN"||
   x.independentHumanAcceptance!==false||x.releaseImpact!=="BLOCKING"))fail("UNSAFE_OPERATOR_REPORT");
 const rows=r.priorities.map(x=>{
  const notes=(x.observations||[]).map(n=>'<li><strong>'+escape(n.assessment)+'</strong> · '+
   escape(n.description)+' (unverified; '+escape(n.id)+')</li>').join("");
  return '<tr><th scope="row">'+escape(x.discrepancyId)+' · '+escape(x.kind)+'</th>'+
   '<td>'+escape(x.priority)+'</td><td>OPEN</td><td>'+escape(x.ownerRole)+'</td>'+
   '<td>'+escape(x.nextAction)+'<ul>'+notes+'</ul></td></tr>';
 }).join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Japanese J33 — acceptance discrepancy triage</title>'+
 '<style>:root{font-family:system-ui,sans-serif;color-scheme:light dark;color:#202826;background:#f5f3ed}'+
 '*{box-sizing:border-box}html,body,main,table{min-width:0;max-width:100%;overflow-wrap:anywhere}'+
 'body{max-width:1120px;margin:auto;padding:clamp(12px,3vw,34px);line-height:1.55}'+
 'h1{font-size:clamp(1.5rem,4vw,2.1rem)}.blocked{border-left:5px solid #775c43;padding:12px;background:#e8ddc8}'+
 'table{table-layout:fixed;border-collapse:collapse;width:100%}th,td{text-align:left;padding:10px;border-bottom:1px solid #9b9c99;overflow-wrap:anywhere}'+
 '@media(max-width:600px){table,thead,tbody,tr,td,th{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:2px solid currentColor}td,th{padding:4px;border:0}}'+
 '@media(prefers-color-scheme:dark){:root{color:#f3f1ea;background:#1d2524}.blocked{background:#443927}}</style></head><body>'+
 '<header><p>READ-ONLY · SOURCE-BOUND OPERATOR TRIAGE · NOT RELEASE APPROVAL</p>'+
 '<h1>Japanese J33 — independent acceptance discrepancy triage</h1>'+
 '<p>Candidate <code>'+escape(r.candidateCommit)+'</code></p>'+
 '<p role="status" class="blocked">BLOCKED: nine acceptance domains remain OPEN; no release or deploy authority.</p></header>'+
 '<main><p>Original visual approvals: <strong>0 / 42</strong> cases; <strong>0 / 126</strong> PNGs. '+
 'Operator notes: '+escape(r.reportedObservations)+' unverified; never promote them to acceptance.</p>'+
 '<h2>Prioritized physical and human escalations</h2><table><caption>Nine independently blocked acceptance domains</caption>'+
 '<thead><tr><th>Discrepancy</th><th>Priority</th><th>Gate</th><th>Required witness role</th><th>Next concrete action</th></tr></thead>'+
 '<tbody>'+rows+'</tbody></table>'+
 '<h2>Separate authorization</h2><p>Source-byte hashes, self-described operator notes, automated tests and signed handoff mechanics do not prove a physical test, qualified reviewer identity, human visual approval, P11 qualification, staging, rollback, or production permission. Every decision remains independently held.</p>'+
 '</main></body></html>';
}
export function runCli(args=process.argv.slice(2)){
 const candidateCommit=process.env.J33_CANDIDATE_SHA;
 if(!SHA.test(candidateCommit??""))fail("EXACT_COMMIT_REQUIRED");
 const from=n=>JSON.parse(fs.readFileSync(path.join(ROOT,"artifacts",n),"utf8"));
 const input={candidateCommit,j27:from("j27-evidence-chain.json"),
  j28:from("j28-operator-workbench.json"),j29:from("j29-operator-reconciliation.json"),
  j30:from("j30-signoff-readiness.json"),j31:from("j31-operator-handoff.json"),
  j32:from("j32-signoff-intake.json")};
 if(args.length){
  if(args.length!==2||args[0]!=="--observations")fail("OFFLINE_USAGE");
  const bytes=fs.readFileSync(args[1]);
  if(bytes.length>256000)fail("OBSERVATIONS_TOO_LARGE");
  input.operatorNotes=JSON.parse(bytes.toString("utf8"));
 }
 const report=reconcileTriage(input);
 fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
 fs.writeFileSync(path.join(ROOT,"artifacts/j33-acceptance-triage.json"),JSON.stringify(report,null,2)+"\n");
 fs.writeFileSync(path.join(ROOT,"artifacts/j33-acceptance-triage.html"),renderTriageHtml(report));
 fs.writeFileSync(path.join(ROOT,"artifacts/j33-operator-observations-blank.json"),JSON.stringify(
   blankOperatorObservations({candidateCommit,j32ReportDigest:report.j32ReportDigest}),null,2)+"\n");
 console.log("J33: 9 OPEN discrepancies; no external original accepted, 0/42 cases, 0/126 PNGs, all release flags denied.");
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
