import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {DOMAINS,sha256} from "./j28-independent-custody.mjs";
import {reconcileMachine,inspectWitnessedReconciliation} from "./j29-witness-reconciliation.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[a-f0-9]{40}$/, HASH=/^[a-f0-9]{64}$/, NONCE=/^[a-f0-9]{32}$/;
const DAY=86_400_000;
function reject(reason){throw new Error("J30_"+reason)}
function assertSha(v){if(typeof v!=="string"||!SHA.test(v))reject("EXACT_SHA_REQUIRED")}
function assertHash(v){if(typeof v!=="string"||!HASH.test(v))reject("SHA256_REQUIRED")}
function asJson(raw,label){
 if(!Buffer.isBuffer(raw)||raw.length<2||raw.length>2_000_000)reject("INVALID_SOURCE_BYTES:"+label);
 try{return JSON.parse(raw.toString("utf8"))}catch{reject("INVALID_JSON:"+label)}
}
function pinned(raw,pin,label){assertHash(pin);if(!Buffer.isBuffer(raw)||sha256(raw)!==pin)reject("INDEPENDENT_PIN_MISMATCH:"+label)}
function time(v,label){
 if(typeof v!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(v)||!Number.isFinite(Date.parse(v)))reject("INVALID_TIME:"+label);
 return Date.parse(v)
}
function current(from,to,at,maximum,label){
 const first=time(from,label+":from"),last=time(to,label+":until");
 if(first>=last||last-first>maximum||first>at||last<at)reject("STALE_OR_FUTURE:"+label);
 return [first,last]
}
function publicKey(item){
 try{
  const key=crypto.createPublicKey(item.publicKeyPem);
  if(key.asymmetricKeyType!=="ed25519"||sha256(key.export({type:"spki",format:"der"}))!==item.keyFingerprint)reject("AUDITOR_KEY_INVALID");
  return key;
 }catch(error){if(String(error).includes("J30_"))throw error;reject("AUDITOR_PUBLIC_KEY_INVALID")}
}
function verifySignature(key,message,sig){
 if(typeof sig!=="string"||!/^[A-Za-z0-9+/]+={0,2}$/.test(sig))reject("AUDIT_SIGNATURE_ENCODING");
 const decoded=Buffer.from(sig,"base64");
 if(decoded.length!==64||decoded.toString("base64")!==sig||
 !crypto.verify(null,Buffer.from(message),key,decoded))reject("AUDIT_SIGNATURE_INVALID");
}
export function buildBlockedAudit({candidateCommit,j27,j28,j29}){
 assertSha(candidateCommit);
 const canonical=reconcileMachine({candidateCommit,j27,j28});
 if(JSON.stringify(j29)!==JSON.stringify(canonical))reject("J29_NOT_CANONICAL_BLOCKED");
 return {
  schema:"thiepn-japanese-j30-signoff-readiness",version:1,candidateCommit,
  j27ReportSha256:j27.reportSha256,j28ReportSha256:sha256(Buffer.from(JSON.stringify(j28))),
  j29ReportSha256:sha256(Buffer.from(JSON.stringify(j29))),chainRoot:j27.chainRoot,
  independentPrimaryArchive:"NOT_PROVIDED_TO_CI",verifiedPrimaryEvidenceFiles:0,
  externalAuditorRoster:"NOT_PROVIDED_TO_CI",externalWitnesses:"NOT_PERSONALLY_VERIFIED",
  revocationAndContinuity:"NOT_EXTERNALLY_ATTESTED_BY_CI",
  acceptedOriginalVisualCases:0,acceptedOriginalPngs:0,
  domains:DOMAINS.map(kind=>({kind,status:"OPEN",sourceBytes:"NOT_VERIFIED_BY_CI",
   witnessIdentity:"NOT_VERIFIED_BY_CI",operatorAcceptance:false})),
  unresolvedDiscrepancies:["Nine independent primary evidence files and human witness approvals not supplied",
   "Physical Android PWA/TalkBack, audio and microphone acceptance missing",
   "First-party registered THIEPN Account OAuth callbacks and persistence unverified",
   "Independent Japanese/P11, visual, accessibility and operator reviews missing",
   "Original 42-case/126-PNG human screenshot comparison not performed",
   "Exact staging deployment and witnessed rollback not performed",
   "Independent identity, signer custody and human release signoff not supplied"],
  signoffReadiness:"NOT_READY",humanAcceptanceGranted:false,
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
  decision:"BLOCKED_PRIMARY_EVIDENCE_AUDIT_AND_HUMAN_SIGNOFF"
 }
}
/** Generates a separate static operator workbench; never accepts a signed machine receipt as human authorization. */
export function renderReadinessHtml(report){
 if(report?.schema!=="thiepn-japanese-j30-signoff-readiness"||
 report.decision!=="BLOCKED_PRIMARY_EVIDENCE_AUDIT_AND_HUMAN_SIGNOFF"||
 report.signoffReadiness!=="NOT_READY"||report.humanAcceptanceGranted!==false||
 report.releaseAuthorized!==false||report.mergeAuthorized!==false||report.deploymentAuthorized!==false||
 report.acceptedOriginalVisualCases!==0||report.acceptedOriginalPngs!==0||
 !Array.isArray(report.domains)||report.domains.length!==DOMAINS.length||
 report.domains.some((x,i)=>x.kind!==DOMAINS[i]||x.status!=="OPEN"||x.operatorAcceptance!==false)||
 !Array.isArray(report.unresolvedDiscrepancies)||!report.unresolvedDiscrepancies.length)reject("UNSAFE_SIGNOFF_VIEW");
 const escape=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const rows=report.domains.map(x=>"<tr><th scope=\"row\">"+escape(x.kind)+"</th><td>OPEN</td><td>"+escape(x.sourceBytes)+"</td></tr>").join("");
 const discrepancies=report.unresolvedDiscrepancies.map(x=>"<li>"+escape(x)+"</li>").join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Japanese J30 — signoff readiness</title><style>:root{font-family:system-ui,sans-serif;color-scheme:light dark;background:#f4f2eb;color:#212828}'+
 '*{box-sizing:border-box}html,body,header,main,section,table{min-width:0;max-width:100%;overflow-wrap:anywhere}'+
 'body{max-width:1100px;margin:auto;padding:clamp(12px,4vw,44px);line-height:1.5}h1{font-size:clamp(1.5rem,4vw,2.4rem)}'+
 'header{border-bottom:3px solid currentColor}.decision{border-left:5px solid #735b3b;background:#e9dfce;padding:14px;font-weight:700}'+
 'table{width:100%;table-layout:fixed;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #9da29c;overflow-wrap:anywhere}'+
 'li{margin-block:8px}@media(max-width:550px){table,tbody,tr,th,td{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:1px solid #9da29c}th,td{border:0;padding:3px}}'+
 '@media(prefers-color-scheme:dark){:root{background:#1e2525;color:#f3f0e8}.decision{background:#443929;color:white}}'+
 '</style></head><body><header><p>RESTRICTED / READ-ONLY RELEASE AUDIT</p><h1>Japanese J30 — signoff readiness</h1>'+
 '<p>Candidate <code>'+escape(report.candidateCommit)+'</code></p><p class="decision" role="status">BLOCKED — independent human signoff is NOT READY</p></header>'+
 '<main><section><h2>Independent acceptance</h2><p>Original visual review: <strong>0 / 42 cases</strong>, <strong>0 / 126 images</strong> accepted.</p>'+
 '<p>Verified external primary evidence in CI: <strong>0 / 9 domains</strong>. Valid cryptographic signatures do not prove real-world source truth.</p></section>'+
 '<section><h2>Evidence gates</h2><table><caption>Nine external domains, all OPEN</caption><thead><tr><th>Domain</th><th>Status</th><th>Source custody</th></tr></thead><tbody>'+rows+'</tbody></table></section>'+
 '<section><h2>Unresolved discrepancies and missing evidence</h2><ul>'+discrepancies+'</ul></section>'+
 '<section><h2>Human handoff</h2><p>Independent reviewers must validate original source evidence and signoffs outside this tool. No automated approvals, deployment controls or release operations are available.</p></section></main></body></html>\n'
}
/** Canonical raw signature payload shared with external independent human auditors. */
export function auditPayload({candidateCommit,j29WitnessReceiptSha256,batchId,kind,primaryPath,primarySha256,primaryBytes,auditorId,signedAt,expiresAt}){
 return JSON.stringify({schema:"thiepn-japanese-j30-independent-audit-signature",version:1,
 candidateCommit,j29WitnessReceiptSha256,batchId,kind,primaryPath,primarySha256,primaryBytes,auditorId,signedAt,expiresAt,
 meaning:"BYTE_PROVENANCE_CHECK_ONLY_NOT_HUMAN_RELEASE_APPROVAL"})
}
function observationDigest(kind,facts){
 if(kind==="exactVisualArchive")return facts.archiveSha256;
 if(kind==="physicalAndroidAndTalkBack"||kind==="realAccountOAuth")return facts.sessionSha256;
 if(["independentJapaneseReview","independentVisualAccessibilityReview","independentAccessibilitySignoff","independentP11LearnerReview"].includes(kind))return facts.reviewSha256;
 if(kind==="exactStagingIdentity")return facts.deployReceiptSha256;
 if(kind==="testedRollback")return facts.rollbackReceiptSha256;
 reject("UNKNOWN_DOMAIN");
}
export function inspectPrimaryEvidenceAudit({candidateCommit,j27,j28,j29,witnessInputs,
 auditManifestBytes,auditManifestPin,auditorRosterBytes,auditorRosterPin,
 auditorRevocationsBytes,auditorRevocationsPin,auditLedgerBytes,auditLedgerPin,
 readPrimary,inspectedAt}){
 const base=buildBlockedAudit({candidateCommit,j27,j28,j29});
 if(!witnessInputs||witnessInputs.candidateCommit!==candidateCommit)reject("J29_VERIFICATION_CONTEXT_REQUIRED");
 // Re-run J29 cryptographic verification against independently supplied original sources and pins.
 const witnessed=inspectWitnessedReconciliation({...witnessInputs,candidateCommit,j27,j28,inspectedAt});
 if(witnessed.decision!==j29.decision||witnessed.releaseAuthorized!==false||
 witnessed.structurallyVerifiedWitnessStatements!==9||
 witnessed.structurallyVerifiedAuthoritySignatures!==2||
 witnessed.humanAcceptanceGranted!==false)reject("J29_WITNESS_STRUCTURE_INVALID");
 const witnessReceiptSha256=sha256(Buffer.from(JSON.stringify(witnessed)));
 pinned(auditManifestBytes,auditManifestPin,"primary-audit-manifest");
 pinned(auditorRosterBytes,auditorRosterPin,"auditor-roster");
 pinned(auditorRevocationsBytes,auditorRevocationsPin,"auditor-revocations");
 pinned(auditLedgerBytes,auditLedgerPin,"audit-ledger");
 const manifest=asJson(auditManifestBytes,"audit-manifest"),roster=asJson(auditorRosterBytes,"roster"),
 rev=asJson(auditorRevocationsBytes,"revocations"),ledger=asJson(auditLedgerBytes,"ledger");
 const now=time(inspectedAt,"inspection");
 if(manifest?.schema!=="thiepn-japanese-j30-primary-evidence-audit"||manifest.version!==1||
 manifest.candidateCommit!==candidateCommit||manifest.j29WitnessReceiptSha256!==witnessReceiptSha256||
 !NONCE.test(manifest.batchId??"")||manifest.status!=="SUBMITTED_FOR_INDEPENDENT_HUMAN_REVIEW"||
 manifest.releaseAuthorized!==false||manifest.humanAcceptanceGranted!==false||
 manifest.mergeAuthorized!==false||manifest.deploymentAuthorized!==false||
 !Array.isArray(manifest.records)||manifest.records.length!==9)reject("AUDIT_MANIFEST_INVALID");
 current(manifest.createdAt,manifest.expiresAt,now,DAY,"manifest");
 if(roster?.schema!=="thiepn-japanese-j30-independent-auditor-roster"||roster.version!==1||
 !Array.isArray(roster.signers)||roster.signers.length<9)reject("AUDITOR_ROSTER_INVALID");
 if(rev?.schema!=="thiepn-japanese-j30-auditor-revocations"||rev.version!==1||
 !Array.isArray(rev.revokedIds)||new Set(rev.revokedIds).size!==rev.revokedIds.length||
 rev.revokedIds.some(x=>typeof x!=="string"||!x.trim()))reject("AUDITOR_REVOCATION_INVALID");
 current(rev.validFrom,rev.validUntil,now,DAY,"auditor-revocations");
 if(ledger?.schema!=="thiepn-japanese-j30-independent-audit-ledger"||ledger.version!==1||
 ledger.candidateCommit!==candidateCommit||!Array.isArray(ledger.consumedBatches)||!Array.isArray(ledger.receiptDigests)||
 ledger.consumedBatches.length!==ledger.receiptDigests.length||
 new Set(ledger.consumedBatches).size!==ledger.consumedBatches.length||
 new Set(ledger.receiptDigests).size!==ledger.receiptDigests.length||
 ledger.consumedBatches.some(x=>!NONCE.test(x))||ledger.receiptDigests.some(x=>!HASH.test(x))||
 ledger.consumedBatches.includes(manifest.batchId)||ledger.receiptDigests.includes(auditManifestPin))reject("AUDIT_REPLAY_LEDGER_INVALID_OR_REPLAYED");
 if(typeof readPrimary!=="function")reject("PRIMARY_FILE_READER_REQUIRED");
 const excludedIds=new Set([
  ...asJson(witnessInputs.packetBytes,"j29-witness-packet").records.map(x=>x.signerId),
  ...asJson(witnessInputs.j28ReceiptBytes,"j28-receipt").custodyEvidence.map(x=>x.custodySigner)
 ]);
 const transition=asJson(witnessInputs.continuityBytes,"j29-transition");
 excludedIds.add(transition.outgoingId);excludedIds.add(transition.incomingId);
 const identities=new Map(),keys=new Set();
 for(const s of roster.signers){
  if(typeof s?.id!=="string"||!s.id.trim()||identities.has(s.id)||excludedIds.has(s.id)||
  !Array.isArray(s.roles)||!s.roles.length||new Set(s.roles).size!==s.roles.length||
  s.roles.some(x=>!DOMAINS.includes(x))||s.independentToProject!==true||
  s.identityAuditedByOperator!==true||!HASH.test(s.identityEvidenceSha256??"")||
  s.revoked!==false||rev.revokedIds.includes(s.id))reject("INVALID_REVOKED_OR_NONINDEPENDENT_AUDITOR");
  current(s.validFrom,s.validUntil,now,366*DAY,"auditor-key");
  const key=publicKey(s);
  if(keys.has(s.keyFingerprint))reject("DUPLICATE_AUDITOR_PUBLIC_KEY");
  keys.add(s.keyFingerprint);identities.set(s.id,{...s,key});
 }
 const signedObservations=asJson(witnessInputs.packetBytes,"witness-packet");
 const byKind=new Map(signedObservations.records.map(x=>[x.kind,x]));
 const seenDomains=new Set(),seenAuditors=new Set(),paths=new Set(),rows=[];
 for(const record of manifest.records){
  if(!DOMAINS.includes(record?.kind)||seenDomains.has(record.kind)||!/^primary\/[a-z0-9-]{1,80}\.(json|bin|png|md)$/.test(record.primaryPath??"")||
  paths.has(record.primaryPath)||!HASH.test(record.primarySha256??"")||
  !Number.isSafeInteger(record.primaryBytes)||record.primaryBytes<1||record.primaryBytes>2_000_000||
  typeof record.auditorId!=="string"||seenAuditors.has(record.auditorId))reject("PRIMARY_AUDIT_RECORD_INVALID");
  const auditor=identities.get(record.auditorId);
  if(!auditor?.roles.includes(record.kind))reject("AUDITOR_IDENTITY_SCOPE_MISMATCH");
  const [signedAt,expiresAt]=current(record.signedAt,record.expiresAt,now,DAY,"audit-record");
  if(signedAt<time(manifest.createdAt,"manifest-created")||expiresAt>time(manifest.expiresAt,"manifest-expires")||
  signedAt<time(auditor.validFrom,"auditor-valid-from")||expiresAt>time(auditor.validUntil,"auditor-valid-until"))reject("AUDIT_RECORD_TIME_OUTSIDE_VALIDITY");
  const originalWitness=byKind.get(record.kind);
  if(!originalWitness)reject("MISSING_WITNESS_OBSERVATION");
  const observation=asJson(witnessInputs.readRaw(originalWitness.path),"witness-observation");
  const claimed=observationDigest(record.kind,observation.facts);
  if(record.primarySha256!==claimed)reject("PRIMARY_HASH_DOES_NOT_MATCH_SIGNED_WITNESS");
  const raw=readPrimary(record.primaryPath);
  if(!Buffer.isBuffer(raw)||raw.length!==record.primaryBytes||sha256(raw)!==record.primarySha256)reject("PRIMARY_SOURCE_BYTES_TAMPERED");
  verifySignature(auditor.key,auditPayload({...record,candidateCommit,j29WitnessReceiptSha256:witnessReceiptSha256,batchId:manifest.batchId}),record.signature);
  seenDomains.add(record.kind);seenAuditors.add(record.auditorId);paths.add(record.primaryPath);
  rows.push({kind:record.kind,sourceSha256:record.primarySha256,
   sourceHashMatchesWitnessClaim:true,independentAuditSignature:true,
   primarySourceTruthWitnessedByThisTool:false,humanAcceptance:false})
 }
 if(seenDomains.size!==9)reject("INCOMPLETE_PRIMARY_AUDIT");
 const proposedLedger={...ledger,consumedBatches:[...ledger.consumedBatches,manifest.batchId],
 receiptDigests:[...ledger.receiptDigests,auditManifestPin]};
 return {...base,unresolvedDiscrepancies:[...base.unresolvedDiscrepancies.filter(x=>!x.startsWith("Nine independent primary evidence files")),"Nine primary source hashes matched witness claims; independent real-world source authenticity and human approval remain unverified"],independentPrimaryArchive:"NINE_PINNED_SOURCE_HASHES_MATCH_SIGNED_CLAIMS_ONLY",
  verifiedPrimaryEvidenceFiles:9,externalAuditorRoster:"EXTERNALLY_PINNED_SIGNATURES_VALID",
  externalWitnesses:"SIGNED_STATEMENTS_NOT_REAL_WORLD_AUTHENTICATION",
  revocationAndContinuity:"SUPPLIED_PINNED_RECORDS_STRUCTURALLY_CURRENT",
  auditManifestSha256:auditManifestPin,j29WitnessReceiptSha256:witnessReceiptSha256,
  auditedSourceRows:rows,proposedReplayLedger:proposedLedger,replayLedgerWritten:false,
  humanReviewHandoff:"REQUIRES_SEPARATE_PRIMARY_SOURCE_AUTHENTICATION_AND_HUMAN_SIGNOFF",
  signoffReadiness:"NOT_READY",decision:"BLOCKED_PRIMARY_EVIDENCE_AUDIT_AND_HUMAN_SIGNOFF"};
}
function safeFiles(dir){
 const root=fs.realpathSync(dir);
 return file=>{
  if(!/^primary\/[a-z0-9-]{1,80}\.(json|bin|png|md)$/.test(file))reject("UNSAFE_PRIMARY_PATH");
  const abs=path.resolve(root,file);
  if(!abs.startsWith(root+path.sep)||!fs.statSync(abs,{throwIfNoEntry:false})?.isFile()||fs.realpathSync(abs)!==abs)reject("PATH_TRAVERSAL_OR_SYMLINK");
  return fs.readFileSync(abs)
 }
}
export function runCli(args=process.argv.slice(2)){
 const candidateCommit=process.env.J30_CANDIDATE_SHA;assertSha(candidateCommit);
 const read=file=>asJson(fs.readFileSync(path.join(ROOT,"artifacts",file)),file);
 const j27=read("j27-evidence-chain.json"),j28=read("j28-operator-workbench.json"),j29=read("j29-operator-reconciliation.json");
 if(!args.length){
  const report=buildBlockedAudit({candidateCommit,j27,j28,j29});
  fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(ROOT,"artifacts/j30-signoff-readiness.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(ROOT,"artifacts/j30-signoff-readiness.html"),renderReadinessHtml(report));
  console.log("J30 independent primary audit BLOCKED: genuine human signoff and source witnessing absent");
  return report
 }
 if(args.length!==10||args[0]!=="--inspect-primary")reject("OFFLINE_CLI_USAGE");
 const [,primaryDir,auditManifestFile,auditorRosterFile,auditorRevocationFile,auditLedgerFile,
   witnessDir,j28ReceiptFile,witnessRosterFile,witnessRevocationFile]=args;
 const readSafe=directory=>{
  const root=fs.realpathSync(directory);
  return rel=>{
   if(!/^observations\/[a-z0-9-]{1,80}\.json$/.test(rel))reject("UNSAFE_WITNESS_PATH");
   const full=path.resolve(root,rel);
   if(!full.startsWith(root+path.sep)||!fs.statSync(full,{throwIfNoEntry:false})?.isFile()||fs.realpathSync(full)!==full)reject("UNSAFE_WITNESS_FILE");
   return fs.readFileSync(full)
  }
 };
 // Offline CLI requires a separately pinned J29 witness packet and authority transition.
 // CLI-only paths are obtained from explicit independently controlled environment variables.
 const witnessInputs={candidateCommit,
  j28ReceiptBytes:fs.readFileSync(j28ReceiptFile),j28ReceiptPin:process.env.J29_J28_RECEIPT_SHA256,
  packetBytes:fs.readFileSync(path.join(witnessDir,"manifest.json")),
  rosterBytes:fs.readFileSync(witnessRosterFile),rosterPin:process.env.J29_WITNESS_ROSTER_SHA256,
  revocationBytes:fs.readFileSync(witnessRevocationFile),revocationPin:process.env.J29_REVOCATION_SHA256,
  ledgerBytes:fs.readFileSync(process.env.J30_WITNESS_LEDGER_FILE),ledgerPin:process.env.J29_LEDGER_SHA256,
  continuityBytes:fs.readFileSync(process.env.J30_AUTHORITY_TRANSITION_FILE),
  continuityPin:process.env.J29_CONTINUITY_SHA256,previousRosterPin:process.env.J29_PREVIOUS_ROSTER_SHA256,
  readRaw:readSafe(witnessDir)};
 const result=inspectPrimaryEvidenceAudit({candidateCommit,j27,j28,j29,witnessInputs,
  auditManifestBytes:fs.readFileSync(auditManifestFile),auditManifestPin:process.env.J30_AUDIT_MANIFEST_SHA256,
  auditorRosterBytes:fs.readFileSync(auditorRosterFile),auditorRosterPin:process.env.J30_AUDITOR_ROSTER_SHA256,
  auditorRevocationsBytes:fs.readFileSync(auditorRevocationFile),auditorRevocationsPin:process.env.J30_AUDITOR_REVOCATION_SHA256,
  auditLedgerBytes:fs.readFileSync(auditLedgerFile),auditLedgerPin:process.env.J30_AUDIT_LEDGER_SHA256,
  readPrimary:safeFiles(primaryDir),inspectedAt:new Date().toISOString()});
 process.stdout.write(JSON.stringify(result,null,2)+"\n");return result
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
