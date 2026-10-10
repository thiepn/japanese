import crypto from "node:crypto";
import {describe,it,expect} from "vitest";
import {DOMAINS,sha256,blockedWorkbench} from "../../scripts/j28-independent-custody.mjs";
import {reconcileMachine,renderReconciliationHtml,inspectWitnessedReconciliation,witnessPayload,continuityPayload} from "../../scripts/j29-witness-reconciliation.mjs";
const C="a".repeat(40),WRONG="b".repeat(40),PREVIOUS="f".repeat(64);
function raw(x){return Buffer.from(JSON.stringify(x))}
function j27(){
 let previous="0".repeat(64);
 const sequence=["J20","J21","J21-review","J22","J23","J24","J25","J26"].map((name,i)=>{
  const r={name,path:"artifacts/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:i+2};
  const chainSha256=sha256(raw({candidateCommit:C,previous,...r}));
  const result={...r,previous,chainSha256};previous=chainSha256;return result
 });
 const releaseManifestDigests=["signoffs","field","production"].map(name=>({name,path:"release/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:5}));
 const r={schema:"thiepn-japanese-j27-evidence-chain",schemaVersion:1,candidateCommit:C,sequence,releaseManifestDigests,
  chainRoot:previous,manifestRoot:sha256(raw(releaseManifestDigests)),originalScreenshotCases:42,originalImageFiles:126,
  independentVisualArchive:"not_supplied_to_ci",trustedHumanApprovals:"not_verified_by_ci",
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE"};
 return {...r,reportSha256:sha256(raw(r))}
}
function facts(kind){
 const hash="e".repeat(64);
 if(kind==="exactVisualArchive")return {originalCases:42,originalPngs:126,archiveSha256:hash};
 if(kind==="physicalAndroidAndTalkBack")return {installedPwa:true,talkBack:true,audio:true,microphone:true,sessionSha256:hash};
 if(kind==="realAccountOAuth")return {registeredClient:true,realCallback:true,persistence:true,logout:true,sessionSha256:hash};
 if(["independentJapaneseReview","independentVisualAccessibilityReview","independentAccessibilitySignoff","independentP11LearnerReview"].includes(kind))
 return {reviewSha256:hash,reviewerSigned:true};
 if(kind==="exactStagingIdentity")return {deployedCommit:C,deployReceiptSha256:hash};
 return {fromCommit:C,knownGoodCommit:"b".repeat(40),rollbackReceiptSha256:hash}
}
function fixture(){
 const j27Record=j27(),j28=blockedWorkbench({candidateCommit:C,j27:j27Record});
 const issuedAt="2026-10-10T11:00:00Z",expiresAt="2026-10-10T13:00:00Z",
   now="2026-10-10T12:00:00Z",batchId="c".repeat(32);
 const custodyEvidence=DOMAINS.map((kind,i)=>({kind,recordSha256:sha256(Buffer.from(kind)),custodySigner:"custody-"+i,
  cryptographicSignature:"valid",humanWitness:"not_automatically_verified"}));
 const receipt={schema:"thiepn-japanese-j28-custody-inspection",candidateCommit:C,
  j27ReportDigest:j27Record.reportSha256,checkedRecords:9,signatureVerification:"passed",
  actualEvidenceTruth:"NOT_ATTESTED_BY_AUTOMATED_TOOL",ledgerUpdated:false,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,custodyEvidence};
 const j28ReceiptBytes=raw(receipt),j28ReceiptPin=sha256(j28ReceiptBytes),signers=[],privateKeys=[];
 for(let i=0;i<11;i++){
  const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
  const id="independent-"+i;
  const roles=[i<9?DOMAINS[i]:i===9?"outgoing-release-custodian":"incoming-release-custodian"];
  signers.push({id,roles,publicKeyPem:publicKey.export({type:"spki",format:"pem"}).toString(),
   keyFingerprint:sha256(publicKey.export({type:"spki",format:"der"})),
   independentToProject:true,identityAuditedByOperator:true,
   identityEvidenceSha256:sha256(Buffer.from(id)),revoked:false,
   validFrom:"2026-10-09T12:00:00Z",validUntil:"2026-10-11T12:00:00Z"});
  privateKeys.push(privateKey);
 }
 const rosterBytes=raw({schema:"thiepn-japanese-j29-independent-witness-roster",version:1,previousRosterSha256:PREVIOUS,signers});
 const rosterPin=sha256(rosterBytes);
 const revocationBytes=raw({schema:"thiepn-japanese-j29-revocations",version:1,
  validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]});
 const revocationPin=sha256(revocationBytes);
 const ledgerBytes=raw({schema:"thiepn-japanese-j29-independent-replay-ledger",version:1,candidateCommit:C,batches:[],packetDigests:[]});
 const ledgerPin=sha256(ledgerBytes),observationBytes=new Map();
 const records=DOMAINS.map((kind,i)=>{
  const p="observations/"+kind.toLowerCase()+".json";
  const observation=raw({schema:"thiepn-japanese-j29-observation",kind,candidateCommit:C,
   statement:"EXTERNAL_WITNESS_CLAIM_NOT_AUTOMATED_ACCEPTANCE",facts:facts(kind)});
  observationBytes.set(p,observation);
  const rec={kind,path:p,evidenceSha256:custodyEvidence[i].recordSha256,
   observationSha256:sha256(observation),signerId:signers[i].id,observedAt:issuedAt,expiresAt};
  const message=witnessPayload({...rec,candidateCommit:C,j28ReceiptSha256:j28ReceiptPin,batchId});
  return {...rec,signature:crypto.sign(null,Buffer.from(message),privateKeys[i]).toString("base64")}
 });
 const packet={schema:"thiepn-japanese-j29-witness-packet",version:1,candidateCommit:C,
  j28ReceiptSha256:j28ReceiptPin,batchId,createdAt:"2026-10-10T10:00:00Z",expiresAt:"2026-10-10T14:00:00Z",
  humanApproval:false,releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,records};
 const packetBytes=raw(packet);
 const common={candidateCommit:C,j28ReceiptSha256:j28ReceiptPin,
  previousRosterSha256:PREVIOUS,currentRosterSha256:rosterPin,revocationSha256:revocationPin,
  issuedAt,expiresAt,outgoingId:signers[9].id,incomingId:signers[10].id};
 const payload=continuityPayload(common);
 const transition={schema:"thiepn-japanese-j29-authority-transition",version:1,
  ...common,releaseAuthorized:false,humanAuthorizationGranted:false,
  outgoingSignature:crypto.sign(null,Buffer.from(payload),privateKeys[9]).toString("base64"),
  incomingSignature:crypto.sign(null,Buffer.from(payload),privateKeys[10]).toString("base64")};
 const continuityBytes=raw(transition);
 const f={candidateCommit:C,j27:j27Record,j28,j28ReceiptBytes,j28ReceiptPin,packetBytes,rosterBytes,rosterPin,
  revocationBytes,revocationPin,ledgerBytes,ledgerPin,continuityBytes,continuityPin:sha256(continuityBytes),
  previousRosterPin:PREVIOUS,readRaw:p=>observationBytes.get(p),inspectedAt:now};
 return {f,observationBytes}
}
function changeBytes(f,key,change,pinKey){
 const next=JSON.parse(f[key]);change(next);
 const b=raw(next);return {...f,[key]:b,...(pinKey?{[pinKey]:sha256(b)}:{})}
}
describe("J29 externally witnessed evidence and release custody",()=>{
 it("CI report remains nine domains open and completely non-authorizing",()=>{
  const {f}=fixture(),r=reconcileMachine({candidateCommit:C,j27:f.j27,j28:f.j28});
  expect(r.remainingExternalAcceptanceDomains).toBe(9);
  expect(r.independentlyAcceptedVisualCases).toBe(0);
  expect(r.independentlyAcceptedOriginalPngs).toBe(0);
  expect(r.releaseAuthorized).toBe(false);
  expect(r.domains.every(x=>x.status==="OPEN")).toBe(true)
 });
 it("checks nine synthetic signed observations and dual authority continuity, without elevating approval",()=>{
  const {f}=fixture(),r=inspectWitnessedReconciliation(f);
  expect(r.structurallyVerifiedWitnessStatements).toBe(9);
  expect(r.structurallyVerifiedAuthoritySignatures).toBe(2);
  expect(r.independentRealWorldWitness).toBe("NOT_ATTESTED_BY_AUTOMATED_TOOL");
  expect(r.releaseAuthorityContinuity).toMatch(/CONTINUITY_ONLY/);
  expect(r.proposedReplayLedger.batches).toHaveLength(1);
  expect(r.replayLedgerWritten).toBe(false);
  expect(r.verifiedExternalAcceptanceDomains).toBe(0);
  expect(r.humanAcceptanceGranted).toBe(false);
  expect(r.mergeAuthorized).toBe(false);
  expect(r.deploymentAuthorized).toBe(false);
  expect(r.releaseAuthorized).toBe(false)
 });
 it("rejects unpinned roots, cross-commit receipt and altered upstream machine approval",()=>{
  const {f}=fixture();
  expect(()=>inspectWitnessedReconciliation({...f,rosterPin:"0".repeat(64)})).toThrow(/J29_EXTERNAL_PIN_MISMATCH/);
  expect(()=>inspectWitnessedReconciliation({...f,j28ReceiptPin:null})).toThrow(/J29_DIGEST_REQUIRED/);
  expect(()=>inspectWitnessedReconciliation({...f,candidateCommit:WRONG})).toThrow(/J28_/);
  expect(()=>reconcileMachine({candidateCommit:C,j27:f.j27,j28:{...f.j28,releaseAuthorized:true}})).toThrow(/J29_UPSTREAM_J28_NOT_CANONICAL_BLOCKED/)
 });
 it("rejects tampered evidence bytes, forged signature and wrong source hash",()=>{
  const {f,observationBytes}=fixture(),kind=DOMAINS[0],p="observations/"+kind.toLowerCase()+".json";
  const modified=new Map(observationBytes);modified.set(p,Buffer.from("changed"));
  expect(()=>inspectWitnessedReconciliation({...f,readRaw:k=>modified.get(k)})).toThrow(/J29_WITNESS_OBSERVATION_BYTES_TAMPERED/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.records[0].signature="A".repeat(88)))).toThrow(/J29_SIGNATURE_INVALID/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.records[0].evidenceSha256="0".repeat(64)))).toThrow(/J29_WITNESS_CUSTODY_SEPARATION_OR_BINDING/)
 });
 it("rejects duplicate reviewer, source signer reuse, missing domain, and fake acceptance",()=>{
  const {f}=fixture();
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.records[1].signerId=v.records[0].signerId))).toThrow(/J29_WITNESS_CUSTODY_SEPARATION_OR_BINDING/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.records[0].signerId="custody-0"))).toThrow(/J29_WITNESS_CUSTODY_SEPARATION_OR_BINDING/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.records.pop()))).toThrow(/J29_PACKET_INVALID/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"packetBytes",v=>v.releaseAuthorized=true))).toThrow(/J29_PACKET_INVALID/)
 });
 it("rejects forged 42-case visual evidence, incomplete TalkBack/OAuth and rollback claims",()=>{
  const {f,observationBytes}=fixture();
  for(const [kind,transform,reason] of [
   ["exactVisualArchive",v=>v.facts.originalPngs=125,/J29_VISUAL_42_126/],
   ["physicalAndroidAndTalkBack",v=>v.facts.talkBack=false,/J29_ANDROID_WITNESS_CLAIM/],
   ["realAccountOAuth",v=>v.facts.realCallback=false,/J29_OAUTH_WITNESS_CLAIM/],
   ["testedRollback",v=>v.facts.knownGoodCommit=C,/J29_ROLLBACK_WITNESS_CLAIM/]
  ]){
   const p="observations/"+kind.toLowerCase()+".json",data=JSON.parse(observationBytes.get(p));
   transform(data);
   const changed=raw(data),f2=changeBytes(f,"packetBytes",v=>{
    const rec=v.records.find(x=>x.kind===kind);rec.observationSha256=sha256(changed);
   });
   const amended=new Map(observationBytes);amended.set(p,changed);
   // A signer would also have to re-sign; any such false observation is still refused by semantic bounds.
   expect(()=>inspectWitnessedReconciliation({...f2,readRaw:q=>amended.get(q)})).toThrow(reason)
  }
 });
 it("rejects revoked signer, stale snapshot and replayed nonce",()=>{
  const {f}=fixture();
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"revocationBytes",v=>v.revokedIds.push("independent-0"),"revocationPin"))).toThrow(/J29_REVOKED_DUPLICATE_OR_UNTRUSTED_SIGNER/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"revocationBytes",v=>v.validUntil="2026-10-10T11:00:00Z","revocationPin"))).toThrow(/J29_EXPIRED_STALE_OR_FUTURE/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"ledgerBytes",v=>{v.batches.push("c".repeat(32));v.packetDigests.push("d".repeat(64))},"ledgerPin"))).toThrow(/J29_PACKET_INVALID_OR_REPLAYED/)
 });
 it("rejects invalid authority continuity, missing second signature and swapped roster generation",()=>{
  const {f}=fixture();
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"continuityBytes",v=>v.incomingSignature="A".repeat(88),"continuityPin"))).toThrow(/J29_SIGNATURE_INVALID/);
  expect(()=>inspectWitnessedReconciliation(changeBytes(f,"continuityBytes",v=>v.previousRosterSha256="0".repeat(64),"continuityPin"))).toThrow(/J29_AUTHORITY_TRANSITION_INVALID/);
  expect(()=>inspectWitnessedReconciliation({...f,previousRosterPin:"0".repeat(64)})).toThrow(/J29_ROSTER_CONTINUITY_UNTRUSTED/)
 });
 it("read-only operator HTML has no decision controls, escapes untrusted labels, rejects forged approvals",()=>{
  const {f}=fixture(),r=reconcileMachine({candidateCommit:C,j27:f.j27,j28:f.j28}),html=renderReconciliationHtml(r);
  expect(html).toContain("0 / 42");
  expect(html).toContain("0 / 126");
  expect(html.match(/<tr><th scope="row">/g)).toHaveLength(9);
  expect(html).not.toContain("<button");
  const changed={...r,domains:r.domains.map((v,i)=>i===0?{...v,externalObservation:"<img onerror=alert(1)>"}:v)};
  expect(renderReconciliationHtml(changed)).not.toContain("<img onerror");
  expect(()=>renderReconciliationHtml({...r,releaseAuthorized:true})).toThrow(/J29_UNSAFE_OPERATOR_VIEW/)
 });
});
