import crypto from "node:crypto";
import {describe,it,expect} from "vitest";
import {DOMAINS,sha256,blockedWorkbench} from "../../scripts/j28-independent-custody.mjs";
import {reconcileMachine} from "../../scripts/j29-witness-reconciliation.mjs";
import {buildBlockedAudit} from "../../scripts/j30-primary-evidence-audit.mjs";
import {machineHandoff,simulateDecision,inspectExternalHandoff,reviewSignatureMessage,custodySignatureMessage,renderOperatorHtml} from "../../scripts/j31-operator-handoff.mjs";

const C="a".repeat(40),WRONG="b".repeat(40),PREVIOUS="e".repeat(64);
const NOW="2026-10-10T12:00:00Z",FROM="2026-10-10T11:00:00Z",UNTIL="2026-10-10T13:00:00Z";
const start="2026-10-10T10:00:00Z",end="2026-10-10T14:00:00Z";
const raw=o=>Buffer.from(JSON.stringify(o));
function j27(){
 let previous="0".repeat(64);
 const sequence=["J20","J21","J21-review","J22","J23","J24","J25","J26"].map((name,i)=>{
  const item={name,path:"artifacts/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:i+2};
  const chainSha256=sha256(raw({candidateCommit:C,previous,...item}));
  const result={...item,previous,chainSha256};previous=chainSha256;return result
 });
 const releaseManifestDigests=["signoffs","field","production"].map(name=>({name,path:"release/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:3}));
 const base={schema:"thiepn-japanese-j27-evidence-chain",schemaVersion:1,candidateCommit:C,sequence,releaseManifestDigests,
  chainRoot:previous,manifestRoot:sha256(raw(releaseManifestDigests)),originalScreenshotCases:42,
  originalImageFiles:126,independentVisualArchive:"not_supplied_to_ci",
  trustedHumanApprovals:"not_verified_by_ci",
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
  decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE"};
 return {...base,reportSha256:sha256(raw(base))}
}
function signer(id,roles){
 const {privateKey,publicKey}=crypto.generateKeyPairSync("ed25519");
 return {privateKey,entry:{id,roles,
  publicKeyPem:publicKey.export({format:"pem",type:"spki"}).toString(),
  keyFingerprint:sha256(publicKey.export({format:"der",type:"spki"})),
  independentToProject:true,identityAuditedByOperator:true,
  identityEvidenceSha256:sha256(Buffer.from(id)),revoked:false,
  validFrom:"2026-10-09T12:00:00Z",validUntil:"2026-10-11T12:00:00Z"}}
}
function fixture(){
 const prev=j27(),j28=blockedWorkbench({candidateCommit:C,j27:prev});
 const j29=reconcileMachine({candidateCommit:C,j27:prev,j28});
 const j30=buildBlockedAudit({candidateCommit:C,j27:prev,j28,j29});
 const inputs={candidateCommit:C,j27:prev,j28,j29,j30};
 const baseline=machineHandoff(inputs);
 const keys=Array.from({length:11},(_,i)=>signer("operator-"+i,
  [i<9?DOMAINS[i]:i===9?"handoff-sender":"handoff-receiver"]));
 const rosterBytes=raw({schema:"thiepn-japanese-j31-independent-operators",version:1,previousCustodySha256:PREVIOUS,
  signers:keys.map(k=>k.entry)}),rosterPin=sha256(rosterBytes);
 const revocationBytes=raw({schema:"thiepn-japanese-j31-revocations",version:1,
  revokedIds:[],validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z"});
 const revocationPin=sha256(revocationBytes);
 const ledgerBytes=raw({schema:"thiepn-japanese-j31-independent-ledger",version:1,candidateCommit:C,
  batchIds:[],packetDigests:[]}),ledgerPin=sha256(ledgerBytes),batchId="c".repeat(32);
 const records=DOMAINS.map((kind,i)=>{
  const discrepancyId="J31-D"+String(i+1).padStart(2,"0");
  const v={kind,discrepancyId,closureState:"OPEN",evidenceState:"EXTERNAL_HUMAN_ACCEPTANCE_MISSING",
   reviewerId:keys[i].entry.id,reviewedAt:FROM,expiresAt:UNTIL};
  const msg=reviewSignatureMessage({...v,candidateCommit:C,j30ReportSha256:baseline.j30ReportSha256,batchId});
  return {...v,signature:crypto.sign(null,Buffer.from(msg),keys[i].privateKey).toString("base64")}
 });
 const packetBytes=raw({schema:"thiepn-japanese-j31-handoff-packet",version:1,
  candidateCommit:C,j30ReportSha256:baseline.j30ReportSha256,batchId,purpose:"MISSING_EVIDENCE_REVIEW",
  createdAt:start,expiresAt:end,humanApproval:false,mergeAuthorized:false,
  deploymentAuthorized:false,releaseAuthorized:false,records});
 const packetPin=sha256(packetBytes);
 const fields={candidateCommit:C,j30ReportSha256:baseline.j30ReportSha256,
  packetSha256:packetPin,previousCustodySha256:PREVIOUS,currentCustodySha256:rosterPin,
  revocationsSha256:revocationPin,sentAt:FROM,expiresAt:UNTIL,
  senderId:keys[9].entry.id,receiverId:keys[10].entry.id};
 const msg=custodySignatureMessage(fields);
 const custodyBytes=raw({schema:"thiepn-japanese-j31-handoff-custody",version:1,...fields,
  humanApproval:false,releaseAuthorized:false,
  senderSignature:crypto.sign(null,Buffer.from(msg),keys[9].privateKey).toString("base64"),
  receiverSignature:crypto.sign(null,Buffer.from(msg),keys[10].privateKey).toString("base64")});
 return {baseline,inputs,details:{...inputs,packetBytes,packetPin,rosterBytes,rosterPin,
  previousCustodyPin:PREVIOUS,revocationBytes,revocationPin,ledgerBytes,ledgerPin,
  custodyBytes,custodyPin:sha256(custodyBytes),inspectedAt:NOW}}
}
function mutate(o,field,fn,pin){
 const value=JSON.parse(o[field]);fn(value);const b=raw(value);
 return {...o,[field]:b,...(pin?{[pin]:sha256(b)}:{})}
}
describe("J31 operator handoff and always-blocked simulation",()=>{
 it("generates nine reproducible open discrepancies and nine explicit next actions",()=>{
  const {baseline}=fixture();
  expect(baseline.discrepancies).toHaveLength(9);
  expect(new Set(baseline.discrepancies.map(x=>x.id)).size).toBe(9);
  expect(baseline.discrepancies.every(x=>x.state==="OPEN"&&x.closureState==="OPEN"&&x.nextAction.length>30)).toBe(true);
  expect(baseline.openDiscrepancies).toBe(9);expect(baseline.closedDiscrepancies).toBe(0);
  expect(baseline.originalVisualCasesHumanAccepted).toBe(0);
  expect(baseline.originalPngsHumanAccepted).toBe(0);
  expect(baseline.signoffReadiness).toBe("NOT_READY");
  expect(baseline.releaseAuthorized).toBe(false)
 });
 it("hypothetical nine-of-nine success still denies release and asserts no real signoffs",()=>{
  const {baseline}=fixture();
  for(const passes of [[],[DOMAINS[0]],DOMAINS]){
   const r=simulateDecision({report:baseline,scenario:{schema:"thiepn-japanese-j31-dry-run",
    version:1,candidateCommit:C,testOnly:true,requestedDecision:"SIMULATE",
    hypotheticalPasses:passes,humanApproval:false,releaseAuthorized:false}});
   expect(r.hypotheticalPassedDomains).toBe(passes.length);
   expect(r.actualHumanOpenDomains).toBe(9);
   expect(r.simulationDecision).toBe("DENY");expect(r.releaseAuthorized).toBe(false)
  }
 });
 it("refuses simulation source, production intent, fake human approval, duplicate domains or wrong SHA",()=>{
  const {baseline}=fixture();
  const scenario={schema:"thiepn-japanese-j31-dry-run",version:1,candidateCommit:C,
   testOnly:true,requestedDecision:"SIMULATE",hypotheticalPasses:[],humanApproval:false,releaseAuthorized:false};
  expect(()=>simulateDecision({report:{...baseline,releaseAuthorized:true},scenario})).toThrow(/J31_UNSAFE_SIMULATION_SOURCE/);
  for(const changed of [{...scenario,requestedDecision:"PRODUCTION"},
   {...scenario,humanApproval:true},{...scenario,candidateCommit:WRONG},
   {...scenario,hypotheticalPasses:[DOMAINS[0],DOMAINS[0]]}])
   expect(()=>simulateDecision({report:baseline,scenario:changed})).toThrow(/J31_UNSAFE_DRY_RUN_SCENARIO/)
 });
 it("validates nine synthetic independent handoff signatures and two custodian receipts while leaving all gaps OPEN",()=>{
  const {details}=fixture(),r=inspectExternalHandoff(details);
  expect(r.verifiedGapHandoffRecords).toBe(9);expect(r.custodySignaturesVerified).toBe(2);
  expect(r.witnessedGapRecords.every(x=>x.closureState==="OPEN")).toBe(true);
  expect(r.proposedLedger.batchIds).toEqual(["c".repeat(32)]);
  expect(r.ledgerMutation).toBe("NOT_PERFORMED");
  expect(r.openDiscrepancies).toBe(9);expect(r.releaseAuthorized).toBe(false)
 });
 it("denies tampered independent trust roots, wrong head, and altered J30 approval",()=>{
  const {details}=fixture();
  expect(()=>inspectExternalHandoff({...details,packetPin:"0".repeat(64)})).toThrow(/J31_EXTERNAL_PIN_INVALID/);
  expect(()=>inspectExternalHandoff({...details,rosterPin:null})).toThrow(/J31_SHA256_REQUIRED/);
  expect(()=>inspectExternalHandoff({...details,candidateCommit:WRONG})).toThrow(/J28_|J29_|J30_/);
  expect(()=>inspectExternalHandoff({...details,j30:{...details.j30,releaseAuthorized:true}})).toThrow(/J31_J30_NOT_CANONICAL_BLOCKED/)
 });
 it("blocks forged closed discrepancy, omitted domain, fake release approval and duplicated reviewer",()=>{
  const {details}=fixture();
  expect(()=>inspectExternalHandoff(mutate(details,"packetBytes",p=>p.records[0].closureState="CLOSED","packetPin"))).toThrow(/J31_FORGED_DISCREPANCY_CLOSURE/);
  expect(()=>inspectExternalHandoff(mutate(details,"packetBytes",p=>p.records.pop(),"packetPin"))).toThrow(/J31_HANDOFF_PACKET_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"packetBytes",p=>p.releaseAuthorized=true,"packetPin"))).toThrow(/J31_HANDOFF_PACKET_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"packetBytes",p=>p.records[1].reviewerId=p.records[0].reviewerId,"packetPin"))).toThrow(/J31_FORGED_DISCREPANCY_CLOSURE/)
 });
 it("blocks unsigned or modified review / custody signatures and reviewer impersonation",()=>{
  const {details}=fixture();
  expect(()=>inspectExternalHandoff(mutate(details,"packetBytes",p=>p.records[0].signature="A".repeat(88),"packetPin"))).toThrow(/J31_SIGNATURE_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"custodyBytes",p=>p.receiverSignature="A".repeat(88),"custodyPin"))).toThrow(/J31_SIGNATURE_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"custodyBytes",p=>p.receiverId=p.senderId,"custodyPin"))).toThrow(/J31_CUSTODY_SEPARATION_OR_PROVENANCE_INVALID/)
 });
 it("blocks revoked reviewers, stale revocations and replayed packet digests or nonces",()=>{
  const {details}=fixture();
  expect(()=>inspectExternalHandoff(mutate(details,"revocationBytes",p=>p.revokedIds.push("operator-1"),"revocationPin"))).toThrow(/J31_OPERATOR_UNTRUSTED_OR_REVOKED/);
  expect(()=>inspectExternalHandoff(mutate(details,"revocationBytes",p=>p.validUntil=FROM,"revocationPin"))).toThrow(/J31_WINDOW_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"ledgerBytes",p=>{p.batchIds.push("c".repeat(32));p.packetDigests.push("0".repeat(64))},"ledgerPin"))).toThrow(/J31_REPLAY_LEDGER_INVALID/);
 });
 it("refuses swapped custody lineage or reused individual signing keys",()=>{
  const {details}=fixture();
  expect(()=>inspectExternalHandoff({...details,previousCustodyPin:"0".repeat(64)})).toThrow(/J31_ROSTER_CONTINUITY_INVALID/);
  expect(()=>inspectExternalHandoff(mutate(details,"rosterBytes",p=>{p.signers[1].keyFingerprint=p.signers[0].keyFingerprint;p.signers[1].publicKeyPem=p.signers[0].publicKeyPem},"rosterPin"))).toThrow(/J31_DUPLICATE_OPERATOR_KEY/);
 });
 it("rendered handoff is static, accessible, escaped, default denied and never has controls",()=>{
  const {baseline}=fixture(),html=renderOperatorHtml(baseline);
  expect(html).toContain("0 / 42 cases");expect(html).toContain("0 / 126 PNGs");
  expect(html.match(/<tr><th scope="row">/g)).toHaveLength(9);
  expect(html).not.toContain("<button");expect(html).not.toContain("<form");
  const dirty={...baseline,discrepancies:baseline.discrepancies.map((x,i)=>i?x:{...x,nextAction:"<img onerror=alert(1)>"})};
  expect(renderOperatorHtml(dirty)).not.toContain("<img onerror");
  expect(()=>renderOperatorHtml({...baseline,releaseAuthorized:true})).toThrow(/J31_UNSAFE_OPERATOR_HTML/);
 });
});
