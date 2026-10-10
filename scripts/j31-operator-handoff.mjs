import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {DOMAINS,sha256} from "./j28-independent-custody.mjs";
import {buildBlockedAudit} from "./j30-primary-evidence-audit.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/, HASH=/^[0-9a-f]{64}$/, NONCE=/^[0-9a-f]{32}$/;
const DAY=86_400_000;
const TASKS=Object.freeze({
 exactVisualArchive:"Compare all 42 original cases and 126 PNGs with independent human visual approval",
 physicalAndroidAndTalkBack:"Run witnessed installed Android/PWA, TalkBack, microphone and audio acceptance",
 realAccountOAuth:"Witness genuine registered first-party Account OAuth, callbacks, persistence and logout",
 independentJapaneseReview:"Obtain authentic independent Japanese language and curriculum assessment",
 independentVisualAccessibilityReview:"Obtain independent original-image and visual accessibility assessment",
 independentAccessibilitySignoff:"Obtain separately authorized human accessibility signoff",
 independentP11LearnerReview:"Witness independent P11 learner writing and speaking review",
 exactStagingIdentity:"Verify real, exact-commit staging build and independently signed deployment provenance",
 testedRollback:"Witness actual rollback to independently proven known-good release"
});
function deny(code){throw new Error("J31_"+code)}
function hash(v){if(typeof v!=="string"||!HASH.test(v))deny("SHA256_REQUIRED")}
function exact(v){if(typeof v!=="string"||!SHA.test(v))deny("EXACT_SHA_REQUIRED")}
function read(raw,label){
 if(!Buffer.isBuffer(raw)||raw.length<2||raw.length>2_000_000)deny("RAW_BYTES_INVALID:"+label);
 try{return JSON.parse(raw.toString("utf8"))}catch{deny("JSON_INVALID:"+label)}
}
function pinned(raw,pin,label){hash(pin);if(!Buffer.isBuffer(raw)||sha256(raw)!==pin)deny("EXTERNAL_PIN_INVALID:"+label)}
function instant(s,label){
 if(typeof s!=="string"||!/^20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(s)||!Number.isFinite(Date.parse(s)))deny("TIME_INVALID:"+label);
 return Date.parse(s)
}
function valid(from,to,now,max,label){
 const a=instant(from,label+":start"),b=instant(to,label+":end");
 if(a>=b||b-a>max||now<a||now>b)deny("WINDOW_INVALID:"+label);
 return [a,b]
}
function keyFor(s){
 try{
  const key=crypto.createPublicKey(s.publicKeyPem);
  if(key.asymmetricKeyType!=="ed25519"||sha256(key.export({type:"spki",format:"der"}))!==s.keyFingerprint)deny("KEY_FINGERPRINT_INVALID");
  return key
 }catch(e){if(String(e).includes("J31_"))throw e;deny("PUBLIC_KEY_INVALID")}
}
function verifySignature(key,msg,sig){
 if(typeof sig!=="string"||!/^[A-Za-z0-9+/]+={0,2}$/.test(sig))deny("SIGNATURE_ENCODING_INVALID");
 const raw=Buffer.from(sig,"base64");
 if(raw.length!==64||raw.toString("base64")!==sig||!crypto.verify(null,Buffer.from(msg),key,raw))deny("SIGNATURE_INVALID")
}
function serialize(x){return JSON.stringify(x)}
export function machineHandoff({candidateCommit,j27,j28,j29,j30}){
 exact(candidateCommit);
 const check=buildBlockedAudit({candidateCommit,j27,j28,j29});
 if(serialize(j30)!==serialize(check))deny("J30_NOT_CANONICAL_BLOCKED");
 const j30Digest=sha256(Buffer.from(serialize(j30)));
 const discrepancies=DOMAINS.map((kind,i)=>({
  id:"J31-D"+String(i+1).padStart(2,"0"),kind,state:"OPEN",
  sourceAuthentication:"NOT_AVAILABLE_IN_CI",
  independentHumanAcceptance:"NOT_RECEIVED",
  closureState:"OPEN",nextAction:TASKS[kind],
  decisionImpact:"BLOCKING"
 }));
 return {
  schema:"thiepn-japanese-j31-operator-handoff",version:1,candidateCommit,
  j27ReportSha256:j27.reportSha256,j28ReportSha256:sha256(Buffer.from(serialize(j28))),
  j29ReportSha256:sha256(Buffer.from(serialize(j29))),j30ReportSha256:j30Digest,
  chainRoot:j27.chainRoot,
  handoffMode:"RESTRICTED_OFFLINE_REVIEW_ONLY",
  independentHandoff:"NOT_SUPPLIED_TO_CI",
  reviewerAndCustodianIdentities:"NOT_EXTERNALLY_ATTESTED",
  signedHandoffChain:"NOT_EXTERNALLY_PROVIDED",
  discrepancies,openDiscrepancies:9,closedDiscrepancies:0,
  originalVisualCasesHumanAccepted:0,originalPngsHumanAccepted:0,
  physicalAndOAuthAcceptance:"NOT_VERIFIED",
  signoffReadiness:"NOT_READY",simulationDecision:"DENY",
  simulationIsRealAuthorization:false,humanAcceptanceGranted:false,
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
  decision:"BLOCKED_OPERATOR_HANDOFF_AND_MANUAL_RELEASE_AUTHORITY"
 }
}
/** A dry run never turns simulated outcomes into actual human approval. */
export function simulateDecision({report,scenario}){
 if(report?.schema!=="thiepn-japanese-j31-operator-handoff"||
 report.decision!=="BLOCKED_OPERATOR_HANDOFF_AND_MANUAL_RELEASE_AUTHORITY"||
 report.mergeAuthorized!==false||report.deploymentAuthorized!==false||report.releaseAuthorized!==false||
 report.humanAcceptanceGranted!==false)deny("UNSAFE_SIMULATION_SOURCE");
 if(scenario?.schema!=="thiepn-japanese-j31-dry-run"||scenario.version!==1||
 scenario.candidateCommit!==report.candidateCommit||scenario.testOnly!==true||
 scenario.requestedDecision!=="SIMULATE"||
 !Array.isArray(scenario.hypotheticalPasses)||
 scenario.hypotheticalPasses.some(x=>!DOMAINS.includes(x))||
 new Set(scenario.hypotheticalPasses).size!==scenario.hypotheticalPasses.length||
 scenario.humanApproval!==false||scenario.releaseAuthorized!==false)deny("UNSAFE_DRY_RUN_SCENARIO");
 return {schema:"thiepn-japanese-j31-simulated-decision",candidateCommit:report.candidateCommit,
  inputType:"HYPOTHETICAL_NOT_EVIDENCE",
  hypotheticalPassedDomains:scenario.hypotheticalPasses.length,
  hypotheticalRemaining:9-scenario.hypotheticalPasses.length,
  actualHumanOpenDomains:report.openDiscrepancies,
  originalVisualCasesHumanAccepted:0,originalPngsHumanAccepted:0,
  simulationDecision:"DENY",simulationIsRealAuthorization:false,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"DRY_RUN_DENIED_NOT_RELEASE_APPROVAL"}
}
export function reviewSignatureMessage({candidateCommit,j30ReportSha256,batchId,kind,
 discrepancyId,closureState,evidenceState,reviewerId,reviewedAt,expiresAt}){
 return JSON.stringify({schema:"thiepn-japanese-j31-review-custody-signature",version:1,
  candidateCommit,j30ReportSha256,batchId,kind,discrepancyId,closureState,
  evidenceState,reviewerId,reviewedAt,expiresAt,
  meaning:"MISSING_EVIDENCE_HANDOFF_ONLY_NOT_ACCEPTANCE"})
}
export function custodySignatureMessage({candidateCommit,j30ReportSha256,packetSha256,
 previousCustodySha256,currentCustodySha256,revocationsSha256,
 sentAt,expiresAt,senderId,receiverId}){
 return JSON.stringify({schema:"thiepn-japanese-j31-two-person-custody",version:1,
 candidateCommit,j30ReportSha256,packetSha256,previousCustodySha256,currentCustodySha256,
 revocationsSha256,sentAt,expiresAt,senderId,receiverId,
 meaning:"HANDOFF_RECEIPT_ONLY_NOT_RELEASE_AUTHORITY"})
}
/** Inspect a separately pinned, independently operated HANDOFF. This is never an acceptance-signing API. */
export function inspectExternalHandoff({candidateCommit,j27,j28,j29,j30,
 packetBytes,packetPin,rosterBytes,rosterPin,previousCustodyPin,
 revocationBytes,revocationPin,ledgerBytes,ledgerPin,
 custodyBytes,custodyPin,inspectedAt}){
 const base=machineHandoff({candidateCommit,j27,j28,j29,j30});
 for(const [a,b,k] of [[packetBytes,packetPin,"packet"],[rosterBytes,rosterPin,"roster"],
  [revocationBytes,revocationPin,"revocations"],[ledgerBytes,ledgerPin,"ledger"],
  [custodyBytes,custodyPin,"custody"]])pinned(a,b,k);
 hash(previousCustodyPin);
 const packet=read(packetBytes,"packet"),roster=read(rosterBytes,"roster"),
 rev=read(revocationBytes,"revocations"),ledger=read(ledgerBytes,"ledger"),
 custody=read(custodyBytes,"custody"),now=instant(inspectedAt,"inspection");
 if(packet?.schema!=="thiepn-japanese-j31-handoff-packet"||packet.version!==1||
 packet.candidateCommit!==candidateCommit||packet.j30ReportSha256!==base.j30ReportSha256||
 !NONCE.test(packet.batchId??"")||packet.purpose!=="MISSING_EVIDENCE_REVIEW"||
 packet.humanApproval!==false||packet.mergeAuthorized!==false||
 packet.deploymentAuthorized!==false||packet.releaseAuthorized!==false||
 !Array.isArray(packet.records)||packet.records.length!==9)deny("HANDOFF_PACKET_INVALID");
 valid(packet.createdAt,packet.expiresAt,now,DAY,"packet");
 if(roster?.schema!=="thiepn-japanese-j31-independent-operators"||roster.version!==1||
 !Array.isArray(roster.signers)||roster.signers.length<11||
 roster.previousCustodySha256!==previousCustodyPin)deny("ROSTER_CONTINUITY_INVALID");
 if(rev?.schema!=="thiepn-japanese-j31-revocations"||rev.version!==1||
 !Array.isArray(rev.revokedIds)||new Set(rev.revokedIds).size!==rev.revokedIds.length||
 rev.revokedIds.some(x=>typeof x!=="string"||!x.trim()))deny("REVOCATIONS_INVALID");
 valid(rev.validFrom,rev.validUntil,now,DAY,"revocations");
 if(ledger?.schema!=="thiepn-japanese-j31-independent-ledger"||ledger.version!==1||
 ledger.candidateCommit!==candidateCommit||!Array.isArray(ledger.batchIds)||!Array.isArray(ledger.packetDigests)||
 ledger.batchIds.length!==ledger.packetDigests.length||new Set(ledger.batchIds).size!==ledger.batchIds.length||
 new Set(ledger.packetDigests).size!==ledger.packetDigests.length||
 ledger.batchIds.some(x=>!NONCE.test(x))||ledger.packetDigests.some(x=>!HASH.test(x))||
 ledger.batchIds.includes(packet.batchId)||ledger.packetDigests.includes(packetPin))deny("REPLAY_LEDGER_INVALID");
 const signers=new Map(),fingerprints=new Set(),allowedRoles=[...DOMAINS,"handoff-sender","handoff-receiver"];
 for(const s of roster.signers){
  if(typeof s?.id!=="string"||!s.id.trim()||signers.has(s.id)||
   s.revoked!==false||rev.revokedIds.includes(s.id)||
   s.independentToProject!==true||s.identityAuditedByOperator!==true||
   !HASH.test(s.identityEvidenceSha256??"")||
   !Array.isArray(s.roles)||!s.roles.length||new Set(s.roles).size!==s.roles.length||
   s.roles.some(x=>!allowedRoles.includes(x)))deny("OPERATOR_UNTRUSTED_OR_REVOKED");
  valid(s.validFrom,s.validUntil,now,366*DAY,"operator");
  const key=keyFor(s);
  if(fingerprints.has(s.keyFingerprint))deny("DUPLICATE_OPERATOR_KEY");
  fingerprints.add(s.keyFingerprint);signers.set(s.id,{...s,key})
 }
 const seenKinds=new Set(),seenReviewers=new Set(),rows=[];
 for(const rec of packet.records){
  if(!DOMAINS.includes(rec?.kind)||seenKinds.has(rec.kind)||
   rec.discrepancyId!==base.discrepancies.find(d=>d.kind===rec.kind)?.id||
   rec.closureState!=="OPEN"||rec.evidenceState!=="EXTERNAL_HUMAN_ACCEPTANCE_MISSING"||
   typeof rec.reviewerId!=="string"||seenReviewers.has(rec.reviewerId))deny("FORGED_DISCREPANCY_CLOSURE");
  const signer=signers.get(rec.reviewerId);
  if(!signer?.roles.includes(rec.kind)||signer.roles.some(role=>role.startsWith("handoff-")))deny("REVIEWER_SCOPE_OR_SEPARATION_INVALID");
  const [from,to]=valid(rec.reviewedAt,rec.expiresAt,now,DAY,"review");
  if(from<instant(packet.createdAt,"packet-start")||to>instant(packet.expiresAt,"packet-end")||
   from<instant(signer.validFrom,"key-from")||to>instant(signer.validUntil,"key-to"))deny("REVIEW_OUTSIDE_VALIDITY");
  verifySignature(signer.key,reviewSignatureMessage({...rec,candidateCommit,
   j30ReportSha256:base.j30ReportSha256,batchId:packet.batchId}),rec.signature);
  seenKinds.add(rec.kind);seenReviewers.add(rec.reviewerId);
  rows.push({kind:rec.kind,discrepancyId:rec.discrepancyId,
   signedGapHandoff:true,actualHumanReview:"NOT_VERIFIED_BY_TOOL",closureState:"OPEN"})
 }
 if(seenKinds.size!==9)deny("DOMAIN_COVERAGE_INCOMPLETE");
 if(custody?.schema!=="thiepn-japanese-j31-handoff-custody"||custody.version!==1||
  custody.candidateCommit!==candidateCommit||custody.j30ReportSha256!==base.j30ReportSha256||
  custody.packetSha256!==packetPin||custody.previousCustodySha256!==previousCustodyPin||
  custody.currentCustodySha256!==rosterPin||custody.revocationsSha256!==revocationPin||
  typeof custody.senderId!=="string"||typeof custody.receiverId!=="string"||
  custody.senderId===custody.receiverId||seenReviewers.has(custody.senderId)||
  seenReviewers.has(custody.receiverId)||custody.releaseAuthorized!==false||
  custody.humanApproval!==false)deny("CUSTODY_SEPARATION_OR_PROVENANCE_INVALID");
 valid(custody.sentAt,custody.expiresAt,now,DAY,"custody");
 const sender=signers.get(custody.senderId),receiver=signers.get(custody.receiverId);
 if(!sender?.roles.includes("handoff-sender")||!receiver?.roles.includes("handoff-receiver")||
 sender.roles.some(x=>DOMAINS.includes(x))||receiver.roles.some(x=>DOMAINS.includes(x)))deny("CUSTODIAN_ROLE_INVALID");
 const msg=custodySignatureMessage(custody);
 verifySignature(sender.key,msg,custody.senderSignature);
 verifySignature(receiver.key,msg,custody.receiverSignature);
 const proposedLedger={...ledger,batchIds:[...ledger.batchIds,packet.batchId],
 packetDigests:[...ledger.packetDigests,packetPin]};
 return {...base,independentHandoff:"NINE_SIGNED_OPEN_GAPS_ONLY",
 reviewerAndCustodianIdentities:"DECLARED_BY_EXTERNALLY_PINNED_ROSTER_NOT_PERSONALLY_VERIFIED",
 signedHandoffChain:"TWO_CUSTODIANS_SIGNATURES_VALID_NO_RELEASE_AUTHORITY",
 verifiedGapHandoffRecords:9,custodySignaturesVerified:2,
 witnessedGapRecords:rows,ledgerMutation:"NOT_PERFORMED",
 proposedLedger,proposedLedgerSha256:sha256(Buffer.from(serialize(proposedLedger))),
 simulationDecision:"DENY",signoffReadiness:"NOT_READY"}
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function renderOperatorHtml(r){
 if(r?.schema!=="thiepn-japanese-j31-operator-handoff"||
 r.decision!=="BLOCKED_OPERATOR_HANDOFF_AND_MANUAL_RELEASE_AUTHORITY"||
 r.openDiscrepancies!==9||r.closedDiscrepancies!==0||
 r.originalVisualCasesHumanAccepted!==0||r.originalPngsHumanAccepted!==0||
 r.signoffReadiness!=="NOT_READY"||r.simulationDecision!=="DENY"||
 r.mergeAuthorized!==false||r.deploymentAuthorized!==false||r.releaseAuthorized!==false||
 r.humanAcceptanceGranted!==false||r.simulationIsRealAuthorization!==false||
 !Array.isArray(r.discrepancies)||r.discrepancies.length!==9||
 r.discrepancies.some((d,i)=>d.kind!==DOMAINS[i]||d.closureState!=="OPEN"||d.state!=="OPEN"))deny("UNSAFE_OPERATOR_HTML");
 const table=r.discrepancies.map(d=>"<tr><th scope=\"row\">"+escape(d.id)+" · "+escape(d.kind)+
 "</th><td>OPEN</td><td>"+escape(d.nextAction)+"</td></tr>").join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Japanese J31 — operator handoff</title>'+
 '<style>:root{font-family:system-ui,sans-serif;color-scheme:light dark;background:#f5f3ef;color:#242928}'+
 '*{box-sizing:border-box}html,body,main,section,table,header{max-width:100%;min-width:0;overflow-wrap:anywhere}'+
 'body{width:100%;max-width:1100px;margin:auto;padding:clamp(12px,4vw,44px);line-height:1.5}h1{font-size:clamp(1.5rem,4vw,2.4rem)}'+
 'header{border-bottom:3px solid currentColor}.deny{padding:12px;border-left:5px solid #765a3b;background:#e8dfcf;font-weight:700}'+
 'table{width:100%;table-layout:fixed;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #a5a5a5;text-align:left;overflow-wrap:anywhere}'+
 'ul{padding-inline-start:24px}@media(max-width:550px){table,tbody,tr,th,td{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:1px solid #999}th,td{padding:3px;border:0}}'+
 '@media(prefers-color-scheme:dark){:root{background:#1d2323;color:#f2f0e9}.deny{background:#403526;color:#fff}}</style></head><body>'+
 '<header><p>RESTRICTED · OFFLINE OPERATOR HANDOFF</p><h1>Japanese J31 — release decision simulation</h1>'+
 '<p>Exact candidate <code>'+escape(r.candidateCommit)+'</code></p>'+
 '<p role="status" class="deny">DENIED — nine open human acceptance gates; no merge, deploy or release authority</p></header>'+
 '<main><section><h2>Evidence and closure status</h2><p>Original visuals: <strong>0 / 42 cases</strong> and <strong>0 / 126 PNGs</strong> independently human-accepted.</p>'+
 '<p>Gaps open: <strong>9 / 9</strong>; verified human closures: <strong>0</strong>. Dry-run outcomes never approve production.</p></section>'+
 '<section><h2>Independent operator action register</h2><table><caption>Nine blocking gaps and next verification actions</caption>'+
 '<thead><tr><th>Evidence domain</th><th>Decision</th><th>Required action</th></tr></thead><tbody>'+table+'</tbody></table></section>'+
 '<section><h2>Custody and authority</h2><p>Independent reviewer and custodian signatures must be pinned outside CI. Witness identity, physical execution, source authenticity and release authority are not proved by simulation.</p>'+
 '<p>No approval form or production release action exists. Submit genuine external observations and separately authorized human decisions through controlled operations.</p></section></main></body></html>\n'
}
export function runCli(args=process.argv.slice(2)){
 exact(process.env.J31_CANDIDATE_SHA);
 const readMachine=name=>read(fs.readFileSync(path.join(ROOT,"artifacts",name)),"machine:"+name);
 const inputs={candidateCommit:process.env.J31_CANDIDATE_SHA,
  j27:readMachine("j27-evidence-chain.json"),j28:readMachine("j28-operator-workbench.json"),
  j29:readMachine("j29-operator-reconciliation.json"),j30:readMachine("j30-signoff-readiness.json")};
 const baseline=machineHandoff(inputs);
 if(!args.length){
  fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(ROOT,"artifacts/j31-operator-handoff.json"),JSON.stringify(baseline,null,2)+"\n");
  fs.writeFileSync(path.join(ROOT,"artifacts/j31-operator-handoff.html"),renderOperatorHtml(baseline));
  console.log("J31 default-DENY operator handoff generated; all real-world human review gates OPEN");return baseline
 }
 if(args.length===2&&args[0]==="--simulate"){
  const scenario=read(fs.readFileSync(args[1]),"simulation");
  const simulated=simulateDecision({report:baseline,scenario});
  process.stdout.write(JSON.stringify(simulated,null,2)+"\n");return simulated
 }
 if(args.length===6&&args[0]==="--inspect-handoff"){
  const [,packetPath,rosterPath,revocationsPath,ledgerPath,custodyPath]=args;
  const result=inspectExternalHandoff({...inputs,packetBytes:fs.readFileSync(packetPath),packetPin:process.env.J31_PACKET_SHA256,
  rosterBytes:fs.readFileSync(rosterPath),rosterPin:process.env.J31_ROSTER_SHA256,
  previousCustodyPin:process.env.J31_PREVIOUS_CUSTODY_SHA256,
  revocationBytes:fs.readFileSync(revocationsPath),revocationPin:process.env.J31_REVOCATION_SHA256,
  ledgerBytes:fs.readFileSync(ledgerPath),ledgerPin:process.env.J31_LEDGER_SHA256,
  custodyBytes:fs.readFileSync(custodyPath),custodyPin:process.env.J31_CUSTODY_SHA256,
  inspectedAt:new Date().toISOString()});
  process.stdout.write(JSON.stringify(result,null,2)+"\n");return result
 }
 deny("UNSUPPORTED_CLI_USAGE")
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
