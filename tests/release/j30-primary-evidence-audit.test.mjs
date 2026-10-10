import crypto from "node:crypto";
import {describe,it,expect} from "vitest";
import {DOMAINS,sha256,blockedWorkbench} from "../../scripts/j28-independent-custody.mjs";
import {reconcileMachine,inspectWitnessedReconciliation,witnessPayload,continuityPayload} from "../../scripts/j29-witness-reconciliation.mjs";
import {buildBlockedAudit,renderReadinessHtml,auditPayload,inspectPrimaryEvidenceAudit} from "../../scripts/j30-primary-evidence-audit.mjs";
const C="a".repeat(40),WRONG="b".repeat(40),PREVIOUS="e".repeat(64);
const at="2026-10-10T12:00:00Z",from="2026-10-10T11:00:00Z",until="2026-10-10T13:00:00Z";
const packFrom="2026-10-10T10:00:00Z",packUntil="2026-10-10T14:00:00Z";
function raw(x){return Buffer.from(JSON.stringify(x))}
function j27(){
 let previous="0".repeat(64);
 const sequence=["J20","J21","J21-review","J22","J23","J24","J25","J26"].map((name,i)=>{
  const row={name,path:"artifacts/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:i+2};
  const chainSha256=sha256(raw({candidateCommit:C,previous,...row}));const item={...row,previous,chainSha256};
  previous=chainSha256;return item
 });
 const releaseManifestDigests=["signoffs","field","production"].map(name=>({name,path:"release/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:3}));
 const base={schema:"thiepn-japanese-j27-evidence-chain",schemaVersion:1,candidateCommit:C,
  sequence,releaseManifestDigests,chainRoot:previous,manifestRoot:sha256(raw(releaseManifestDigests)),
  independentVisualArchive:"not_supplied_to_ci",trustedHumanApprovals:"not_verified_by_ci",
  originalScreenshotCases:42,originalImageFiles:126,
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE"};
 return {...base,reportSha256:sha256(raw(base))}
}
function signer(id,roles){
 const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
 return {privateKey,entry:{id,roles,publicKeyPem:publicKey.export({format:"pem",type:"spki"}).toString(),
  keyFingerprint:sha256(publicKey.export({format:"der",type:"spki"})),
  identityEvidenceSha256:sha256(Buffer.from(id)),independentToProject:true,identityAuditedByOperator:true,
  revoked:false,validFrom:"2026-10-09T12:00:00Z",validUntil:"2026-10-11T12:00:00Z"}}
}
function claimedFacts(kind,digest){
 if(kind==="exactVisualArchive")return {originalCases:42,originalPngs:126,archiveSha256:digest};
 if(kind==="physicalAndroidAndTalkBack")return {installedPwa:true,talkBack:true,audio:true,microphone:true,sessionSha256:digest};
 if(kind==="realAccountOAuth")return {registeredClient:true,realCallback:true,persistence:true,logout:true,sessionSha256:digest};
 if(["independentJapaneseReview","independentVisualAccessibilityReview","independentAccessibilitySignoff","independentP11LearnerReview"].includes(kind))
 return {reviewSha256:digest,reviewerSigned:true};
 if(kind==="exactStagingIdentity")return {deployedCommit:C,deployReceiptSha256:digest};
 return {fromCommit:C,knownGoodCommit:WRONG,rollbackReceiptSha256:digest}
}
function fixture(){
 // Fixtures are explicitly synthetic: signed source byte consistency is NOT genuine real-world acceptance.
 const j27Record=j27(),j28=blockedWorkbench({candidateCommit:C,j27:j27Record}),
 j29=reconcileMachine({candidateCommit:C,j27:j27Record,j28});
 const custodyEvidence=DOMAINS.map((kind,i)=>({kind,recordSha256:sha256(Buffer.from("custody:"+kind)),
  custodySigner:"custody-"+i,cryptographicSignature:"valid"}));
 const j28ReceiptBytes=raw({schema:"thiepn-japanese-j28-custody-inspection",candidateCommit:C,
  j27ReportDigest:j27Record.reportSha256,checkedRecords:9,signatureVerification:"passed",
  actualEvidenceTruth:"NOT_ATTESTED_BY_AUTOMATED_TOOL",ledgerUpdated:false,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,custodyEvidence});
 const j28ReceiptPin=sha256(j28ReceiptBytes),observationFiles=new Map(),primaryFiles=new Map();
 const keys=Array.from({length:11},(_,i)=>signer("witness-"+i,
  [i<9?DOMAINS[i]:i===9?"outgoing-release-custodian":"incoming-release-custodian"]));
 const rosterBytes=raw({schema:"thiepn-japanese-j29-independent-witness-roster",version:1,
  previousRosterSha256:PREVIOUS,signers:keys.map(x=>x.entry)});
 const rosterPin=sha256(rosterBytes);
 const revocationBytes=raw({schema:"thiepn-japanese-j29-revocations",version:1,
  validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]});
 const revocationPin=sha256(revocationBytes);
 const witnessLedgerBytes=raw({schema:"thiepn-japanese-j29-independent-replay-ledger",
  version:1,candidateCommit:C,batches:[],packetDigests:[]}),witnessLedgerPin=sha256(witnessLedgerBytes);
 const witnessBatchId="c".repeat(32);
 const records=DOMAINS.map((kind,i)=>{
  const key=kind.toLowerCase();
  const primaryPath="primary/"+key+".bin",primary=Buffer.from("SYNTHETIC_TEST_PRIMARY_BYTES:"+kind);
  const primarySha256=sha256(primary);primaryFiles.set(primaryPath,primary);
  const path="observations/"+key+".json";
  const observation=raw({schema:"thiepn-japanese-j29-observation",kind,candidateCommit:C,
   statement:"EXTERNAL_WITNESS_CLAIM_NOT_AUTOMATED_ACCEPTANCE",facts:claimedFacts(kind,primarySha256)});
  observationFiles.set(path,observation);
  const witness={kind,path,evidenceSha256:custodyEvidence[i].recordSha256,
   observationSha256:sha256(observation),signerId:keys[i].entry.id,observedAt:from,expiresAt:until};
  return {...witness,signature:crypto.sign(null,Buffer.from(witnessPayload({...witness,candidateCommit:C,
   j28ReceiptSha256:j28ReceiptPin,batchId:witnessBatchId})),keys[i].privateKey).toString("base64")}
 });
 const packetBytes=raw({schema:"thiepn-japanese-j29-witness-packet",version:1,candidateCommit:C,
  j28ReceiptSha256:j28ReceiptPin,batchId:witnessBatchId,createdAt:packFrom,expiresAt:packUntil,
  humanApproval:false,releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,records});
 const continuation={candidateCommit:C,j28ReceiptSha256:j28ReceiptPin,
  previousRosterSha256:PREVIOUS,currentRosterSha256:rosterPin,revocationSha256:revocationPin,
  issuedAt:from,expiresAt:until,outgoingId:keys[9].entry.id,incomingId:keys[10].entry.id};
 const continuityMessage=continuityPayload(continuation);
 const continuityBytes=raw({schema:"thiepn-japanese-j29-authority-transition",version:1,...continuation,
  releaseAuthorized:false,humanAuthorizationGranted:false,
  outgoingSignature:crypto.sign(null,Buffer.from(continuityMessage),keys[9].privateKey).toString("base64"),
  incomingSignature:crypto.sign(null,Buffer.from(continuityMessage),keys[10].privateKey).toString("base64")});
 const witnessInputs={candidateCommit:C,j28ReceiptBytes,j28ReceiptPin,packetBytes,
  rosterBytes,rosterPin,revocationBytes,revocationPin,ledgerBytes:witnessLedgerBytes,
  ledgerPin:witnessLedgerPin,continuityBytes,continuityPin:sha256(continuityBytes),
  previousRosterPin:PREVIOUS,readRaw:p=>observationFiles.get(p),inspectedAt:at};
 const verified=inspectWitnessedReconciliation({candidateCommit:C,j27:j27Record,j28,...witnessInputs});
 const witnessReceiptSha256=sha256(raw(verified)),auditKeys=DOMAINS.map((kind,i)=>signer("auditor-"+i,[kind]));
 const auditorRosterBytes=raw({schema:"thiepn-japanese-j30-independent-auditor-roster",version:1,
  signers:auditKeys.map(x=>x.entry)});
 const auditorRosterPin=sha256(auditorRosterBytes);
 const auditorRevocationsBytes=raw({schema:"thiepn-japanese-j30-auditor-revocations",version:1,
  validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]});
 const auditorRevocationsPin=sha256(auditorRevocationsBytes);
 const auditLedgerBytes=raw({schema:"thiepn-japanese-j30-independent-audit-ledger",version:1,
  candidateCommit:C,consumedBatches:[],receiptDigests:[]});
 const auditLedgerPin=sha256(auditLedgerBytes),batchId="d".repeat(32);
 const auditRecords=DOMAINS.map((kind,i)=>{
  const primaryPath="primary/"+kind.toLowerCase()+".bin",primary=primaryFiles.get(primaryPath);
  const item={kind,primaryPath,primarySha256:sha256(primary),primaryBytes:primary.length,
   auditorId:auditKeys[i].entry.id,signedAt:from,expiresAt:until};
  return {...item,signature:crypto.sign(null,Buffer.from(auditPayload({...item,candidateCommit:C,
   j29WitnessReceiptSha256:witnessReceiptSha256,batchId})),auditKeys[i].privateKey).toString("base64")}
 });
 const auditManifestBytes=raw({schema:"thiepn-japanese-j30-primary-evidence-audit",version:1,
  candidateCommit:C,j29WitnessReceiptSha256:witnessReceiptSha256,batchId,
  status:"SUBMITTED_FOR_INDEPENDENT_HUMAN_REVIEW",createdAt:packFrom,expiresAt:packUntil,
  releaseAuthorized:false,humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
  records:auditRecords});
 const f={candidateCommit:C,j27:j27Record,j28,j29,witnessInputs,auditManifestBytes,
  auditManifestPin:sha256(auditManifestBytes),auditorRosterBytes,auditorRosterPin,
  auditorRevocationsBytes,auditorRevocationsPin,auditLedgerBytes,auditLedgerPin,
  readPrimary:p=>primaryFiles.get(p),inspectedAt:at};
 return {f,primaryFiles,observationFiles}
}
function modify(f,key,transform,pin){
 const obj=JSON.parse(f[key]);transform(obj);const buf=raw(obj);
 return {...f,[key]:buf,...(pin?{[pin]:sha256(buf)}:{})}
}
describe("J30 independent primary archive audit and human signoff boundary",()=>{
 it("emits canonical blocked CI report with nine OPEN human gates",()=>{
  const {f}=fixture(),r=buildBlockedAudit(f);
  expect(r.domains).toHaveLength(9);expect(r.domains.every(d=>d.status==="OPEN")).toBe(true);
  expect(r.signoffReadiness).toBe("NOT_READY");expect(r.acceptedOriginalVisualCases).toBe(0);
  expect(r.acceptedOriginalPngs).toBe(0);expect(r.releaseAuthorized).toBe(false);
  expect(r.unresolvedDiscrepancies.length).toBeGreaterThanOrEqual(6)
 });
 it("synthetic source bytes and nine independent auditor signatures match witness digests without release authority",()=>{
  const {f}=fixture(),r=inspectPrimaryEvidenceAudit(f);
  expect(r.verifiedPrimaryEvidenceFiles).toBe(9);
  expect(r.auditedSourceRows).toHaveLength(9);
  expect(r.auditedSourceRows.every(row=>row.sourceHashMatchesWitnessClaim&&row.independentAuditSignature)).toBe(true);
  expect(r.domains.every(row=>row.status==="OPEN")).toBe(true);
  expect(r.signoffReadiness).toBe("NOT_READY");
  expect(r.humanAcceptanceGranted).toBe(false);
  expect(r.mergeAuthorized).toBe(false);expect(r.deploymentAuthorized).toBe(false);
  expect(r.releaseAuthorized).toBe(false);
  expect(r.replayLedgerWritten).toBe(false)
 });
 it("rejects unpinned or altered independent roots and J29 head mismatch",()=>{
  const {f}=fixture();
  expect(()=>inspectPrimaryEvidenceAudit({...f,auditManifestPin:null})).toThrow(/J30_SHA256_REQUIRED/);
  expect(()=>inspectPrimaryEvidenceAudit({...f,auditorRosterPin:"0".repeat(64)})).toThrow(/J30_INDEPENDENT_PIN_MISMATCH/);
  expect(()=>inspectPrimaryEvidenceAudit({...f,candidateCommit:WRONG})).toThrow(/J29_/);
  expect(()=>buildBlockedAudit({...f,j29:{...f.j29,releaseAuthorized:true}})).toThrow(/J30_J29_NOT_CANONICAL_BLOCKED/)
 });
 it("rejects source bytes altered after signature and independently mismatched witness primary digest",()=>{
  const {f,primaryFiles}=fixture(),first=[...primaryFiles.keys()][0],changed=new Map(primaryFiles);
  changed.set(first,Buffer.from("tampered"));
  expect(()=>inspectPrimaryEvidenceAudit({...f,readPrimary:p=>changed.get(p)})).toThrow(/J30_PRIMARY_SOURCE_BYTES_TAMPERED/);
  const bad=modify(f,"auditManifestBytes",m=>m.records[0].primarySha256="0".repeat(64),"auditManifestPin");
  expect(()=>inspectPrimaryEvidenceAudit(bad)).toThrow(/J30_PRIMARY_HASH_DOES_NOT_MATCH_SIGNED_WITNESS/)
 });
 it("rejects fake release flags and malformed reviewer/audit credentials",()=>{
  const {f}=fixture();
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditManifestBytes",m=>m.releaseAuthorized=true,"auditManifestPin"))).toThrow(/J30_AUDIT_MANIFEST_INVALID/);
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditManifestBytes",m=>m.records[0].signature="A".repeat(88),"auditManifestPin"))).toThrow(/J30_AUDIT_SIGNATURE_INVALID/);
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditManifestBytes",m=>m.records[1].auditorId=m.records[0].auditorId,"auditManifestPin"))).toThrow(/J30_PRIMARY_AUDIT_RECORD_INVALID/);
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditManifestBytes",m=>m.records.pop(),"auditManifestPin"))).toThrow(/J30_AUDIT_MANIFEST_INVALID/)
 });
 it("rejects source custody signers being reused as purported independent auditors",()=>{
  const {f}=fixture();
  const changed=modify(f,"auditorRosterBytes",r=>r.signers[0].id="witness-0","auditorRosterPin");
  expect(()=>inspectPrimaryEvidenceAudit(changed)).toThrow(/J30_INVALID_REVOKED_OR_NONINDEPENDENT_AUDITOR/)
 });
 it("rejects revoked signer, stale revocation snapshot, and replayed batch",()=>{
  const {f}=fixture();
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditorRevocationsBytes",r=>r.revokedIds.push("auditor-1"),"auditorRevocationsPin"))).toThrow(/J30_INVALID_REVOKED_OR_NONINDEPENDENT_AUDITOR/);
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditorRevocationsBytes",r=>r.validUntil="2026-10-10T11:00:00Z","auditorRevocationsPin"))).toThrow(/J30_STALE_OR_FUTURE/);
  expect(()=>inspectPrimaryEvidenceAudit(modify(f,"auditLedgerBytes",r=>{r.consumedBatches.push("d".repeat(32));r.receiptDigests.push("0".repeat(64))},"auditLedgerPin"))).toThrow(/J30_AUDIT_REPLAY_LEDGER_INVALID_OR_REPLAYED/)
 });
 it("read-only operator HTML escapes untrusted text and refuses ready/signoff forging",()=>{
  const {f}=fixture(),r=buildBlockedAudit(f),html=renderReadinessHtml(r);
  expect(html).toContain("0 / 42 cases");expect(html).toContain("0 / 126 images");
  expect(html.match(/<tr><th scope="row">/g)).toHaveLength(9);expect(html).not.toContain("<button");
  const changed={...r,unresolvedDiscrepancies:["<img onerror=alert(1)>"]};
  expect(renderReadinessHtml(changed)).not.toContain("<img onerror");
  expect(()=>renderReadinessHtml({...r,signoffReadiness:"READY"})).toThrow(/J30_UNSAFE_SIGNOFF_VIEW/);
  expect(()=>renderReadinessHtml({...r,releaseAuthorized:true})).toThrow(/J30_UNSAFE_SIGNOFF_VIEW/)
 });
});
