import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {DOMAINS,sha256,blockedWorkbench,verifyJ27} from "./j28-independent-custody.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/, HASH=/^[0-9a-f]{64}$/, NONCE=/^[0-9a-f]{32}$/;
const DAY=86400000;
const AUTHORITY_ROLES=["outgoing-release-custodian","incoming-release-custodian"];
function fail(s){throw new Error("J29_"+s)}
function requireSha(x){if(typeof x!=="string"||!SHA.test(x))fail("EXACT_COMMIT_REQUIRED")}
function hash(x){if(typeof x!=="string"||!HASH.test(x))fail("DIGEST_REQUIRED")}
function parse(raw,label){
 if(!Buffer.isBuffer(raw)||raw.length<1||raw.length>2_000_000)fail("INVALID_RAW_BYTES:"+label);
 try{return JSON.parse(raw.toString("utf8"))}catch{fail("INVALID_JSON:"+label)}
}
function pin(raw,expected,label){hash(expected);if(!Buffer.isBuffer(raw)||sha256(raw)!==expected)fail("EXTERNAL_PIN_MISMATCH:"+label)}
function instant(x,label){if(typeof x!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(x)||!Number.isFinite(Date.parse(x)))fail("INVALID_INSTANT:"+label);return Date.parse(x)}
function active(from,until,now,max,label){const a=instant(from,label+":from"),b=instant(until,label+":until");if(a>=b||b-a>max||now<a||now>b)fail("EXPIRED_STALE_OR_FUTURE:"+label);return [a,b]}
function keyOf(s){
 try{
  const k=crypto.createPublicKey(s.publicKeyPem);
  if(k.asymmetricKeyType!=="ed25519"||sha256(k.export({format:"der",type:"spki"}))!==s.keyFingerprint)fail("PUBLIC_KEY_FINGERPRINT_INVALID");
  return k;
 }catch(e){if(String(e).includes("J29_"))throw e;fail("PUBLIC_KEY_INVALID")}
}
function signature(key,body,encoded){
 if(typeof encoded!=="string"||!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))fail("SIGNATURE_ENCODING_INVALID");
 const b=Buffer.from(encoded,"base64");
 if(b.length!==64||b.toString("base64")!==encoded||!crypto.verify(null,Buffer.from(body),key,b))fail("SIGNATURE_INVALID");
}
export function reconcileMachine({candidateCommit,j27,j28}){
 requireSha(candidateCommit);
 verifyJ27({candidateCommit,j27});
 const expected=blockedWorkbench({candidateCommit,j27});
 if(JSON.stringify(j28)!==JSON.stringify(expected))fail("UPSTREAM_J28_NOT_CANONICAL_BLOCKED");
 const domains=DOMAINS.map(kind=>({kind,status:"OPEN",externalObservation:"NOT_SUPPLIED_TO_CI",independentReviewer:"NOT_VERIFIED",humanAcceptance:false}));
 return {
  schema:"thiepn-japanese-j29-operator-reconciliation",version:1,candidateCommit,
  j27ReportDigest:j27.reportSha256,j28WorkbenchDigest:sha256(Buffer.from(JSON.stringify(j28))),
  j28MachineChainRoot:j27.chainRoot,
  externalWitnessPacket:"NOT_SUPPLIED_TO_CI",revocationSnapshot:"NOT_SUPPLIED_TO_CI",
  releaseAuthorityContinuity:"NOT_VERIFIED_BY_CI",independentRealWorldWitness:"NOT_VERIFIED_BY_CI",
  independentlyAcceptedVisualCases:0,independentlyAcceptedOriginalPngs:0,
  domains,verifiedExternalAcceptanceDomains:0,remainingExternalAcceptanceDomains:9,
  approvalPolicy:"SEPARATE_HUMAN_OPERATOR_DECISION_REQUIRED",
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
  decision:"BLOCKED_WITNESSED_ACCEPTANCE_AND_RELEASE_AUTHORITY"
 };
}
/** Standalone read-only report. No HTML form, buttons, login, or production APIs. */
export function renderReconciliationHtml(report){
 if(report?.schema!=="thiepn-japanese-j29-operator-reconciliation"||
    report.decision!=="BLOCKED_WITNESSED_ACCEPTANCE_AND_RELEASE_AUTHORITY"||
    report.humanAcceptanceGranted!==false||report.mergeAuthorized!==false||
    report.deploymentAuthorized!==false||report.releaseAuthorized!==false||
    report.independentlyAcceptedVisualCases!==0||report.independentlyAcceptedOriginalPngs!==0||
    !Array.isArray(report.domains)||report.domains.length!==9||
    report.domains.some((x,i)=>x.kind!==DOMAINS[i]||x.status!=="OPEN"||x.humanAcceptance!==false))fail("UNSAFE_OPERATOR_VIEW");
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const rows=report.domains.map((x,i)=>'<tr><th scope="row">'+escape(x.kind)+'</th><td>OPEN</td><td>'+escape(x.externalObservation)+'</td></tr>').join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+
 '<title>Japanese J29 — release reconciliation</title><style>:root{font-family:system-ui,sans-serif;color-scheme:light dark;background:#f5f3ee;color:#252929}'+
 '*{box-sizing:border-box}html,body,main,section,table,header{max-width:100%;min-width:0;overflow-wrap:anywhere}'+
 'body{max-width:1050px;margin:auto;padding:clamp(12px,4vw,40px);line-height:1.5}h1{font-size:clamp(1.5rem,5vw,2.4rem)}'+
 'header{border-bottom:3px solid currentColor}.notice{border-left:5px solid #806545;background:#e6dccb;padding:12px;font-weight:700}'+
 'table{width:100%;table-layout:fixed;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #aaa;text-align:left;overflow-wrap:anywhere}'+
 '@media(max-width:550px){table,tbody,tr,th,td{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:1px solid #aaa}tr th,tr td{border:0;padding:3px}}'+
 '@media(prefers-color-scheme:dark){:root{background:#202626;color:#f3f1ea}.notice{background:#453a2c;color:white}}</style></head><body>'+
 '<header><p>RESTRICTED · READ-ONLY OPERATOR EVIDENCE</p><h1>Japanese J29 · witness reconciliation</h1><p>Candidate <code>'+escape(report.candidateCommit)+'</code></p>'+
 '<p class="notice" role="status">BLOCKED — no independent human release authority</p></header>'+
 '<main><section><h2>Acceptance coverage</h2><p><strong>0 / 42</strong> original visual cases; <strong>0 / 126</strong> original image files independently accepted.</p>'+
 '<p>Signed custody and witness statements cannot prove real device operation, source authenticity, a completed human review or permission to deploy.</p></section>'+
 '<section><h2>Nine external acceptance domains</h2><table><caption>All domains remain OPEN in CI</caption>'+
 '<thead><tr><th>Domain</th><th>Status</th><th>Evidence</th></tr></thead><tbody>'+rows+'</tbody></table></section>'+
 '<section><h2>Release authority</h2><p>Current independently witnessed approval is absent. Key continuity is not approval. Any future production decision requires a separate authorized human workflow.</p>'+
 '</section></main></body></html>\n';
}
export function witnessPayload({candidateCommit,j28ReceiptSha256,batchId,kind,evidenceSha256,observationSha256,signerId,observedAt,expiresAt}){
 return JSON.stringify({schema:"thiepn-japanese-j29-witness-statement",version:1,candidateCommit,j28ReceiptSha256,
 batchId,kind,evidenceSha256,observationSha256,signerId,observedAt,expiresAt,
 intent:"WITNESSED_EVIDENCE_STATEMENT_NOT_PRODUCTION_APPROVAL"});
}
export function continuityPayload({candidateCommit,j28ReceiptSha256,previousRosterSha256,currentRosterSha256,revocationSha256,issuedAt,expiresAt,outgoingId,incomingId}){
 return JSON.stringify({schema:"thiepn-japanese-j29-authority-continuity",version:1,candidateCommit,j28ReceiptSha256,
 previousRosterSha256,currentRosterSha256,revocationSha256,issuedAt,expiresAt,outgoingId,incomingId,
 intent:"KEY_CUSTODY_CONTINUITY_ONLY_NEVER_RELEASE_AUTHORIZATION"});
}
function validateObservation(kind,v,candidateCommit){
 if(v?.schema!=="thiepn-japanese-j29-observation"||v.kind!==kind||v.candidateCommit!==candidateCommit||
    v.statement!=="EXTERNAL_WITNESS_CLAIM_NOT_AUTOMATED_ACCEPTANCE")fail("OBSERVATION_SCHEMA_OR_CANDIDATE");
 const facts=v.facts;
 if(!facts||typeof facts!=="object")fail("OBSERVATION_FACTS_REQUIRED");
 if(kind==="exactVisualArchive"&&(facts.originalCases!==42||facts.originalPngs!==126||!HASH.test(facts.archiveSha256??"")))fail("VISUAL_42_126_EVIDENCE_REQUIRED");
 if(kind==="physicalAndroidAndTalkBack"&&(!facts.installedPwa||!facts.talkBack||!facts.audio||!facts.microphone||!HASH.test(facts.sessionSha256??"")))fail("ANDROID_WITNESS_CLAIM_INCOMPLETE");
 if(kind==="realAccountOAuth"&&(!facts.registeredClient||!facts.realCallback||!facts.persistence||!facts.logout||!HASH.test(facts.sessionSha256??"")))fail("OAUTH_WITNESS_CLAIM_INCOMPLETE");
 if(["independentJapaneseReview","independentVisualAccessibilityReview","independentAccessibilitySignoff","independentP11LearnerReview"].includes(kind)&&
 (!HASH.test(facts.reviewSha256??"")||facts.reviewerSigned!==true))fail("REVIEW_WITNESS_CLAIM_INCOMPLETE");
 if(kind==="exactStagingIdentity"&&(facts.deployedCommit!==candidateCommit||!HASH.test(facts.deployReceiptSha256??"")))fail("STAGING_CANDIDATE_INCORRECT");
 if(kind==="testedRollback"&&(facts.fromCommit!==candidateCommit||!SHA.test(facts.knownGoodCommit??"")||
 facts.knownGoodCommit===candidateCommit||!HASH.test(facts.rollbackReceiptSha256??"")))fail("ROLLBACK_WITNESS_CLAIM_INCOMPLETE");
}
export function inspectWitnessedReconciliation({candidateCommit,j27,j28,j28ReceiptBytes,j28ReceiptPin,
 packetBytes,rosterBytes,rosterPin,revocationBytes,revocationPin,ledgerBytes,ledgerPin,
 continuityBytes,continuityPin,previousRosterPin,readRaw,inspectedAt}){
 const machine=reconcileMachine({candidateCommit,j27,j28});
 pin(j28ReceiptBytes,j28ReceiptPin,"j28-custody");pin(rosterBytes,rosterPin,"witness-roster");
 pin(revocationBytes,revocationPin,"revocations");pin(ledgerBytes,ledgerPin,"replay-ledger");
 pin(continuityBytes,continuityPin,"authority-continuity");hash(previousRosterPin);
 const now=instant(inspectedAt,"inspection");
 const receipt=parse(j28ReceiptBytes,"j28-custody");
 if(receipt.schema!=="thiepn-japanese-j28-custody-inspection"||receipt.candidateCommit!==candidateCommit||
 receipt.j27ReportDigest!==j27.reportSha256||receipt.checkedRecords!==9||
 receipt.signatureVerification!=="passed"||receipt.actualEvidenceTruth!=="NOT_ATTESTED_BY_AUTOMATED_TOOL"||
 receipt.ledgerUpdated!==false||receipt.humanAcceptanceGranted!==false||
 receipt.mergeAuthorized!==false||receipt.deploymentAuthorized!==false||receipt.releaseAuthorized!==false||
 !Array.isArray(receipt.custodyEvidence)||receipt.custodyEvidence.length!==9||
 new Set(receipt.custodyEvidence.map(x=>x.kind)).size!==9||
 receipt.custodyEvidence.some(x=>!DOMAINS.includes(x.kind)||!HASH.test(x.recordSha256??"")||
 x.cryptographicSignature!=="valid"))fail("J28_CUSTODY_RECEIPT_INVALID");
 const roster=parse(rosterBytes,"roster"),rev=parse(revocationBytes,"revocations"),
 ledger=parse(ledgerBytes,"ledger"),pkg=parse(packetBytes,"packet"),transition=parse(continuityBytes,"continuity");
 if(roster?.schema!=="thiepn-japanese-j29-independent-witness-roster"||roster.version!==1||
 roster.previousRosterSha256!==previousRosterPin||!Array.isArray(roster.signers)||roster.signers.length<11)fail("ROSTER_CONTINUITY_UNTRUSTED");
 if(rev?.schema!=="thiepn-japanese-j29-revocations"||rev.version!==1||!Array.isArray(rev.revokedIds)||
 new Set(rev.revokedIds).size!==rev.revokedIds.length||rev.revokedIds.some(x=>typeof x!=="string"||!x.trim()))fail("REVOCATION_SCHEMA_INVALID");
 active(rev.validFrom,rev.validUntil,now,DAY,"revocations");
 if(ledger?.schema!=="thiepn-japanese-j29-independent-replay-ledger"||ledger.version!==1||
 ledger.candidateCommit!==candidateCommit||!Array.isArray(ledger.batches)||
 !Array.isArray(ledger.packetDigests)||ledger.batches.length!==ledger.packetDigests.length||
 new Set(ledger.batches).size!==ledger.batches.length||new Set(ledger.packetDigests).size!==ledger.packetDigests.length||
 ledger.batches.some(x=>!NONCE.test(x))||ledger.packetDigests.some(x=>!HASH.test(x)))fail("LEDGER_INVALID");
 if(pkg?.schema!=="thiepn-japanese-j29-witness-packet"||pkg.version!==1||pkg.candidateCommit!==candidateCommit||
 pkg.j28ReceiptSha256!==j28ReceiptPin||!NONCE.test(pkg.batchId??"")||
 ledger.batches.includes(pkg.batchId)||ledger.packetDigests.includes(sha256(packetBytes))||
 pkg.humanApproval!==false||pkg.releaseAuthorized!==false||pkg.mergeAuthorized!==false||
 pkg.deploymentAuthorized!==false||!Array.isArray(pkg.records)||pkg.records.length!==9)fail("PACKET_INVALID_OR_REPLAYED");
 active(pkg.createdAt,pkg.expiresAt,now,DAY,"packet");
 if(typeof readRaw!=="function")fail("SAFE_OBSERVATION_READER_REQUIRED");
 const signerMap=new Map(),fingerprints=new Set();
 for(const s of roster.signers){
  if(typeof s?.id!=="string"||!s.id.trim()||signerMap.has(s.id)||s.revoked!==false||
   s.independentToProject!==true||s.identityAuditedByOperator!==true||!HASH.test(s.identityEvidenceSha256??"")||
   !Array.isArray(s.roles)||!s.roles.length||new Set(s.roles).size!==s.roles.length||
   s.roles.some(x=>![...DOMAINS,...AUTHORITY_ROLES].includes(x))||rev.revokedIds.includes(s.id))fail("REVOKED_DUPLICATE_OR_UNTRUSTED_SIGNER");
  active(s.validFrom,s.validUntil,now,366*DAY,"signer");
  const key=keyOf(s);
  if(fingerprints.has(s.keyFingerprint))fail("DUPLICATE_SIGNING_KEY");
  fingerprints.add(s.keyFingerprint);signerMap.set(s.id,{...s,key})
 }
 const seenKinds=new Set(),seenPeople=new Set(),paths=new Set();
 const custodyByKind=new Map(receipt.custodyEvidence.map(x=>[x.kind,x]));
 const observed=[];
 for(const rec of pkg.records){
  if(!DOMAINS.includes(rec?.kind)||seenKinds.has(rec.kind)||
    !/^observations\/[a-z0-9-]{1,80}\.json$/.test(rec.path??"")||paths.has(rec.path)||
    !HASH.test(rec.observationSha256??"")||!HASH.test(rec.evidenceSha256??"")||
    rec.evidenceSha256!==custodyByKind.get(rec.kind)?.recordSha256||
    typeof rec.signerId!=="string"||seenPeople.has(rec.signerId)||
    receipt.custodyEvidence.some(x=>x.custodySigner===rec.signerId))fail("WITNESS_CUSTODY_SEPARATION_OR_BINDING");
  const signer=signerMap.get(rec.signerId);
  if(!signer||!signer.roles.includes(rec.kind)||signer.roles.some(x=>AUTHORITY_ROLES.includes(x)))fail("WITNESS_ROLE_NOT_INDEPENDENT");
  const [from,to]=active(rec.observedAt,rec.expiresAt,now,DAY,"witness");
  if(from<instant(pkg.createdAt,"packet-start")||to>instant(pkg.expiresAt,"packet-end")||
     from<instant(signer.validFrom,"signer-from")||to>instant(signer.validUntil,"signer-to"))fail("WITNESS_TIME_UNTRUSTED");
  const raw=readRaw(rec.path);
  if(!Buffer.isBuffer(raw)||raw.length>2_000_000||sha256(raw)!==rec.observationSha256)fail("WITNESS_OBSERVATION_BYTES_TAMPERED");
  validateObservation(rec.kind,parse(raw,rec.kind),candidateCommit);
  signature(signer.key,witnessPayload({...rec,candidateCommit,j28ReceiptSha256:j28ReceiptPin,batchId:pkg.batchId}),rec.signature);
  paths.add(rec.path);seenKinds.add(rec.kind);seenPeople.add(rec.signerId);
  observed.push({kind:rec.kind,sha256:rec.observationSha256,signatureValid:true,
   physicalTruthIndependentlyVerifiedByThisTool:false,humanAcceptanceGranted:false})
 }
 if(seenKinds.size!==9)fail("WITNESS_DOMAIN_COVERAGE_INCOMPLETE");
 if(transition?.schema!=="thiepn-japanese-j29-authority-transition"||transition.version!==1||
 transition.candidateCommit!==candidateCommit||transition.j28ReceiptSha256!==j28ReceiptPin||
 transition.previousRosterSha256!==previousRosterPin||transition.currentRosterSha256!==rosterPin||
 transition.revocationSha256!==revocationPin||
 typeof transition.outgoingId!=="string"||typeof transition.incomingId!=="string"||
 transition.outgoingId===transition.incomingId||seenPeople.has(transition.outgoingId)||seenPeople.has(transition.incomingId)||
 transition.releaseAuthorized!==false||transition.humanAuthorizationGranted!==false)fail("AUTHORITY_TRANSITION_INVALID");
 active(transition.issuedAt,transition.expiresAt,now,DAY,"authority-transition");
 const old=signerMap.get(transition.outgoingId),current=signerMap.get(transition.incomingId);
 if(!old?.roles.includes("outgoing-release-custodian")||!current?.roles.includes("incoming-release-custodian")||
 old.roles.some(x=>DOMAINS.includes(x))||current.roles.some(x=>DOMAINS.includes(x)))fail("AUTHORITY_SEPARATION_INVALID");
 const signedBody=continuityPayload(transition);
 signature(old.key,signedBody,transition.outgoingSignature);
 signature(current.key,signedBody,transition.incomingSignature);
 const accepted={...machine,
  externalWitnessPacket:"EXTERNAL_SIGNATURES_STRUCTURALLY_VALID_ONLY",
  revocationSnapshot:"EXTERNALLY_PINNED_AND_CURRENT",
  releaseAuthorityContinuity:"DUAL_SIGNED_KEY_CUSTODY_CONTINUITY_ONLY",
  independentRealWorldWitness:"NOT_ATTESTED_BY_AUTOMATED_TOOL",
  verificationReceiptSha256:sha256(packetBytes),
  structurallyVerifiedWitnessStatements:9,structurallyVerifiedAuthoritySignatures:2,
  proposedReplayLedger:{...ledger,batches:[...ledger.batches,pkg.batchId],packetDigests:[...ledger.packetDigests,sha256(packetBytes)]},
  replayLedgerWritten:false
 };
 return accepted; // The nine human acceptance domains remain OPEN, with no production rights.
}
function safeObservationReader(directory){
 const root=fs.realpathSync(directory);
 return relative=>{
  if(!/^observations\/[a-z0-9-]{1,80}\.json$/.test(relative))fail("OBSERVATION_PATH_INVALID");
  const p=path.resolve(root,relative);
  if(!p.startsWith(root+path.sep)||!fs.statSync(p,{throwIfNoEntry:false})?.isFile()||fs.realpathSync(p)!==p)fail("SYMLINK_OR_PATH_INVALID");
  return fs.readFileSync(p)
 }
}
export function runCli(args=process.argv.slice(2)){
 const candidateCommit=process.env.J29_CANDIDATE_SHA;
 requireSha(candidateCommit);
 const j27=parse(fs.readFileSync(path.join(ROOT,"artifacts/j27-evidence-chain.json")),"j27");
 const j28=parse(fs.readFileSync(path.join(ROOT,"artifacts/j28-operator-workbench.json")),"j28");
 if(args.length===0){
  const report=reconcileMachine({candidateCommit,j27,j28});
  fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(ROOT,"artifacts/j29-operator-reconciliation.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(ROOT,"artifacts/j29-operator-reconciliation.html"),renderReconciliationHtml(report));
  console.log("J29 operator reconciliation BLOCKED: independent human evidence and release authority absent");
  return report
 }
 if(args.length!==7||args[0]!=="--inspect-witness")fail("OFFLINE_CLI_USAGE");
 const [,bundleDir,custodyReceipt,roster,revocations,ledger,transition]=args;
 const report=inspectWitnessedReconciliation({candidateCommit,j27,j28,
  j28ReceiptBytes:fs.readFileSync(custodyReceipt),j28ReceiptPin:process.env.J29_J28_RECEIPT_SHA256,
  packetBytes:fs.readFileSync(path.join(bundleDir,"manifest.json")),
  rosterBytes:fs.readFileSync(roster),rosterPin:process.env.J29_WITNESS_ROSTER_SHA256,
  revocationBytes:fs.readFileSync(revocations),revocationPin:process.env.J29_REVOCATION_SHA256,
  ledgerBytes:fs.readFileSync(ledger),ledgerPin:process.env.J29_LEDGER_SHA256,
  continuityBytes:fs.readFileSync(transition),continuityPin:process.env.J29_CONTINUITY_SHA256,
  previousRosterPin:process.env.J29_PREVIOUS_ROSTER_SHA256,
  readRaw:safeObservationReader(bundleDir),inspectedAt:new Date().toISOString()});
  process.stdout.write(JSON.stringify(report,null,2)+"\n");return report
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
