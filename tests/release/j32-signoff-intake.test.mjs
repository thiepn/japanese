import crypto from "node:crypto";
import {describe,it,expect} from "vitest";
import {DOMAINS,sha256,blockedWorkbench} from "../../scripts/j28-independent-custody.mjs";
import {reconcileMachine} from "../../scripts/j29-witness-reconciliation.mjs";
import {buildBlockedAudit} from "../../scripts/j30-primary-evidence-audit.mjs";
import {machineHandoff,reviewSignatureMessage,custodySignatureMessage} from "../../scripts/j31-operator-handoff.mjs";
import {machinePreparation,blankSubmission,reviewPayload,continuityPayload,inspectExternalPacket,renderOperatorHtml} from "../../scripts/j32-signoff-intake.mjs";
const C="a".repeat(40),WRONG="b".repeat(40),PREVIOUS="e".repeat(64),PREVIOUS2="f".repeat(64);
const NOW="2026-10-10T12:00:00Z",FROM="2026-10-10T11:00:00Z",UNTIL="2026-10-10T13:00:00Z";
const START="2026-10-10T10:00:00Z",END="2026-10-10T14:00:00Z";
const raw=o=>Buffer.from(JSON.stringify(o));
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a5kAAAAASUVORK5CYII=","base64");
function j27(){
 let previous="0".repeat(64);
 const sequence=["J20","J21","J21-review","J22","J23","J24","J25","J26"].map((name,i)=>{
  const row={name,path:"artifacts/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:i+2};
  const chainSha256=sha256(raw({candidateCommit:C,previous,...row}));
  const item={...row,previous,chainSha256};previous=chainSha256;return item
 });
 const releaseManifestDigests=["signoffs","field","production"].map(name=>({name,path:"release/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:3}));
 const base={schema:"thiepn-japanese-j27-evidence-chain",schemaVersion:1,candidateCommit:C,sequence,releaseManifestDigests,
  chainRoot:previous,manifestRoot:sha256(raw(releaseManifestDigests)),
  originalScreenshotCases:42,originalImageFiles:126,independentVisualArchive:"not_supplied_to_ci",
  trustedHumanApprovals:"not_verified_by_ci",mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE"};
 return {...base,reportSha256:sha256(raw(base))}
}
function signer(id,roles){
 const {privateKey,publicKey}=crypto.generateKeyPairSync("ed25519");
 return {privateKey,entry:{id,roles,
  publicKeyPem:publicKey.export({type:"spki",format:"pem"}).toString(),
  keyFingerprint:sha256(publicKey.export({type:"spki",format:"der"})),
  independentToProject:true,identityAuditedByOperator:true,
  identityEvidenceSha256:sha256(Buffer.from(id)),revoked:false,
  validFrom:"2026-10-09T12:00:00Z",validUntil:"2026-10-11T12:00:00Z"}}
}
function fixture(){
 const j27Record=j27(),j28=blockedWorkbench({candidateCommit:C,j27:j27Record});
 const j29=reconcileMachine({candidateCommit:C,j27:j27Record,j28});
 const j30=buildBlockedAudit({candidateCommit:C,j27:j27Record,j28,j29});
 const j31=machineHandoff({candidateCommit:C,j27:j27Record,j28,j29,j30});
 const inputs={candidateCommit:C,j27:j27Record,j28,j29,j30,j31},blocked=machinePreparation(inputs);
 const j31keys=Array.from({length:11},(_,i)=>signer("old-operator-"+i,
  [i<9?DOMAINS[i]:i===9?"handoff-sender":"handoff-receiver"]));
 const j31rosterBytes=raw({schema:"thiepn-japanese-j31-independent-operators",version:1,
  previousCustodySha256:PREVIOUS,signers:j31keys.map(x=>x.entry)}),j31rosterPin=sha256(j31rosterBytes);
 const j31revocationBytes=raw({schema:"thiepn-japanese-j31-revocations",version:1,
  validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]});
 const j31revocationPin=sha256(j31revocationBytes);
 const j31ledgerBytes=raw({schema:"thiepn-japanese-j31-independent-ledger",version:1,candidateCommit:C,
  batchIds:[],packetDigests:[]});
 const j31batch="a".repeat(32);
 const j31records=DOMAINS.map((kind,i)=>{
  const item={kind,discrepancyId:"J31-D"+String(i+1).padStart(2,"0"),
   closureState:"OPEN",evidenceState:"EXTERNAL_HUMAN_ACCEPTANCE_MISSING",
   reviewerId:j31keys[i].entry.id,reviewedAt:FROM,expiresAt:UNTIL};
  return {...item,signature:crypto.sign(null,Buffer.from(reviewSignatureMessage({...item,candidateCommit:C,
    j30ReportSha256:j31.j30ReportSha256,batchId:j31batch})),j31keys[i].privateKey).toString("base64")}
 });
 const j31packetBytes=raw({schema:"thiepn-japanese-j31-handoff-packet",version:1,
  candidateCommit:C,j30ReportSha256:j31.j30ReportSha256,batchId:j31batch,
  purpose:"MISSING_EVIDENCE_REVIEW",createdAt:START,expiresAt:END,
  humanApproval:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,records:j31records});
 const j31packetPin=sha256(j31packetBytes);
 const oldFields={candidateCommit:C,j30ReportSha256:j31.j30ReportSha256,
  packetSha256:j31packetPin,previousCustodySha256:PREVIOUS,
  currentCustodySha256:j31rosterPin,revocationsSha256:j31revocationPin,
  sentAt:FROM,expiresAt:UNTIL,senderId:j31keys[9].entry.id,receiverId:j31keys[10].entry.id};
 const oldMessage=custodySignatureMessage(oldFields);
 const j31custodyBytes=raw({schema:"thiepn-japanese-j31-handoff-custody",version:1,...oldFields,
  humanApproval:false,releaseAuthorized:false,
  senderSignature:crypto.sign(null,Buffer.from(oldMessage),j31keys[9].privateKey).toString("base64"),
  receiverSignature:crypto.sign(null,Buffer.from(oldMessage),j31keys[10].privateKey).toString("base64")});
 const j31HandoffInputs={
  packetBytes:j31packetBytes,packetPin:j31packetPin,rosterBytes:j31rosterBytes,rosterPin:j31rosterPin,
  previousCustodyPin:PREVIOUS,
  revocationBytes:j31revocationBytes,revocationPin:j31revocationPin,
  ledgerBytes:j31ledgerBytes,ledgerPin:sha256(j31ledgerBytes),
  custodyBytes:j31custodyBytes,custodyPin:sha256(j31custodyBytes)
 };
 const originals=new Map();
 const cases=Array.from({length:42},(_,i)=>({id:"VIS-"+String(i+1).padStart(3,"0"),humanCompared:false,originalCaseLabel:"Synthetic Visual "+(i+1)}));
 const pngs=Array.from({length:126},(_,i)=>{
  const id="PNG-"+String(i+1).padStart(3,"0"),p="original/png-"+String(i+1).padStart(3,"0")+".png";
  originals.set(p,png);
  return {id,caseId:cases[Math.floor(i/3)].id,humanApproved:false,path:p,
   originalFilename:"synthetic-"+String(i+1).padStart(3,"0")+".png",sha256:sha256(png),bytes:png.length}
 });
 const visualDoc=raw({schema:"thiepn-japanese-j32-original-visual-inventory",version:1,
  candidateCommit:C,humanApprovedCases:0,humanApprovedPngs:0,cases,pngs});
 const keys=Array.from({length:11},(_,i)=>signer("j32-operator-"+i,
  [i<9?DOMAINS[i]:i===9?"intake-custodian-sender":"intake-custodian-receiver"]));
 const rosterBytes=raw({schema:"thiepn-japanese-j32-external-reviewer-roster",version:1,
  previousRosterSha256:PREVIOUS2,signers:keys.map(x=>x.entry)}),rosterPin=sha256(rosterBytes);
 const revocationBytes=raw({schema:"thiepn-japanese-j32-external-revocations",version:1,
  validFrom:"2026-10-10T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]});
 const revocationPin=sha256(revocationBytes);
 const ledgerBytes=raw({schema:"thiepn-japanese-j32-replay-ledger",version:1,candidateCommit:C,
  batches:[],packetDigests:[]});
 const batch="b".repeat(32),records=DOMAINS.map((kind,i)=>{
  const sourcePath="evidence/"+kind.toLowerCase()+".json";
  const bytes=kind==="exactVisualArchive"?visualDoc:raw({
   schema:"thiepn-japanese-j32-operator-source-claim",kind,candidateCommit:C,
   sourceStatus:"SUBMITTED_NOT_INDEPENDENTLY_ACCEPTED",humanAccepted:false,
   verifiedOnRealDeviceByThisTool:false,originalSourceOrigin:"synthetic-test-only",
   requiredWitnessItems:["source original authentication","qualified reviewer signature","real hardware or independent study"]
  });
  originals.set(sourcePath,bytes);
  const item={kind,sourcePath,sourceSha256:sha256(bytes),sourceBytes:bytes.length,
   signerId:keys[i].entry.id,reviewedAt:FROM,expiresAt:UNTIL,humanAccepted:false};
  return {...item,signature:crypto.sign(null,Buffer.from(reviewPayload({...item,
   candidateCommit:C,j31ReportDigest:blocked.j31Digest,batchId:batch})),keys[i].privateKey).toString("base64")}
 });
 const packetBytes=raw({schema:"thiepn-japanese-j32-primary-source-packet",version:1,
  candidateCommit:C,j31ReportDigest:blocked.j31Digest,batchId:batch,purpose:"UNAPPROVED_EVIDENCE_INTAKE_ONLY",
  createdAt:START,expiresAt:END,humanAcceptanceGranted:false,
  mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,records});
 const packetPin=sha256(packetBytes);
 const fields={candidateCommit:C,j31ReportDigest:blocked.j31Digest,packetSha256:packetPin,
  previousRosterSha256:PREVIOUS2,currentRosterSha256:rosterPin,
  revocationSha256:revocationPin,sentAt:FROM,expiresAt:UNTIL,
  senderId:keys[9].entry.id,receiverId:keys[10].entry.id};
 const signedMsg=continuityPayload(fields);
 const continuityBytes=raw({schema:"thiepn-japanese-j32-intake-transfer",version:1,...fields,
  humanAcceptanceGranted:false,releaseAuthorized:false,
  senderSignature:crypto.sign(null,Buffer.from(signedMsg),keys[9].privateKey).toString("base64"),
  receiverSignature:crypto.sign(null,Buffer.from(signedMsg),keys[10].privateKey).toString("base64")});
 const audit={...inputs,j31HandoffInputs,packetBytes,packetPin,
  rosterBytes,rosterPin,previousRosterPin:PREVIOUS2,
  revocationBytes,revocationPin,ledgerBytes,ledgerPin:sha256(ledgerBytes),
  continuityBytes,continuityPin:sha256(continuityBytes),
  readPrimary:p=>originals.get(p),inspectedAt:NOW};
 return {inputs,blocked,audit,originals}
}
function mutate(o,key,change,pinKey){
 const item=JSON.parse(o[key]);change(item);const bytes=raw(item);
 return {...o,[key]:bytes,...(pinKey?{[pinKey]:sha256(bytes)}:{})}
}
describe("J32 signed external original-source preparation without human approvals",()=>{
 it("generates exactly 42 blank case slots, 126 blank PNG slots and nine OPEN protocols",()=>{
  const {inputs,blocked}=fixture(),blank=blankSubmission(inputs);
  expect(blank.visualCases).toHaveLength(42);
  expect(blank.originalPngs).toHaveLength(126);
  expect(blank.originalPngs.every(x=>x.state==="AWAITING_ORIGINAL")).toBe(true);
  expect(blank.protocols).toHaveLength(9);
  expect(blocked.domains.every(x=>x.status==="OPEN"&&x.humanAcceptance===false)).toBe(true);
  expect(blocked.releaseAuthorized).toBe(false);
  expect(blocked.originalCasesHumanAccepted).toBe(0);
  expect(blocked.originalPngsHumanAccepted).toBe(0)
 });
 it("synthetic 42-case/126-original-PNG byte and signed-domain intake remains human acceptance BLOCKED",()=>{
  const {audit}=fixture(),r=inspectExternalPacket(audit);
  expect(r.sourceBytesVerified).toBe(135);
  expect(r.sourceDomainsStructurallyVerified).toBe(9);
  expect(r.visualIntake.originalCaseSlotsMapped).toBe(42);
  expect(r.visualIntake.sourcePngBytesVerified).toBe(126);
  expect(r.originalCasesHumanAccepted).toBe(0);
  expect(r.originalPngsHumanAccepted).toBe(0);
  expect(r.manualHumanAcceptanceStillMissing).toBe(9);
  expect(r.humanAcceptanceGranted).toBe(false);
  expect(r.releaseAuthorized).toBe(false);
  expect(r.ledgerUpdated).toBe(false);
  expect(r.decision).toBe("BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF");
 });
 it("rejects corrupt primary PNG bytes and raw source digest substitution",()=>{
  const {audit,originals}=fixture(),changed=new Map(originals);
  changed.set("original/png-001.png",Buffer.from("not a png"));
  expect(()=>inspectExternalPacket({...audit,readPrimary:p=>changed.get(p)})).toThrow(/J32_RAW_SOURCE_BYTES_MISMATCH/);
  const replaced=mutate(audit,"packetBytes",p=>p.records[0].sourceSha256="0".repeat(64),"packetPin");
  expect(()=>inspectExternalPacket(replaced)).toThrow(/J32_RAW_SOURCE_BYTES_MISMATCH/)
 });
 it("rejects forged acceptance of visual case, PNG and packet",()=>{
  const {audit,originals}=fixture();
  const visual=JSON.parse(originals.get("evidence/exactvisualarchive.json"));
  visual.cases[0].humanCompared=true;
  const files=new Map(originals);files.set("evidence/exactvisualarchive.json",raw(visual));
  expect(()=>inspectExternalPacket({...audit,readPrimary:p=>files.get(p)})).toThrow(/J32_RAW_SOURCE_BYTES_MISMATCH/);
  expect(()=>inspectExternalPacket(mutate(audit,"packetBytes",p=>p.humanAcceptanceGranted=true,"packetPin"))).toThrow(/J32_PACKET_SCHEMA_OR_RELEASE_CLAIM/);
  expect(()=>inspectExternalPacket(mutate(audit,"packetBytes",p=>p.records[0].humanAccepted=true,"packetPin"))).toThrow(/J32_DUPLICATE_OR_FORGED_DOMAIN_RECORD/)
 });
 it("rejects altered record signature, custody second signature and domain coverage",()=>{
  const {audit}=fixture();
  expect(()=>inspectExternalPacket(mutate(audit,"packetBytes",p=>p.records[0].signature="A".repeat(88),"packetPin"))).toThrow(/J32_SIGNATURE_INVALID/);
  expect(()=>inspectExternalPacket(mutate(audit,"continuityBytes",p=>p.receiverSignature="A".repeat(88),"continuityPin"))).toThrow(/J32_SIGNATURE_INVALID/);
  expect(()=>inspectExternalPacket(mutate(audit,"packetBytes",p=>p.records.pop(),"packetPin"))).toThrow(/J32_PACKET_SCHEMA_OR_RELEASE_CLAIM/)
 });
 it("rejects revoked signing identity, stale snapshot, replay nonce and digest",()=>{
  const {audit}=fixture();
  expect(()=>inspectExternalPacket(mutate(audit,"revocationBytes",p=>p.revokedIds.push("j32-operator-0"),"revocationPin"))).toThrow(/J32_UNTRUSTED_REVIEWER_IDENTITY/);
  expect(()=>inspectExternalPacket(mutate(audit,"revocationBytes",p=>p.validUntil=FROM,"revocationPin"))).toThrow(/J32_STALE_OR_FUTURE/);
  expect(()=>inspectExternalPacket(mutate(audit,"ledgerBytes",p=>{p.batches.push("b".repeat(32));p.packetDigests.push("0".repeat(64))},"ledgerPin"))).toThrow(/J32_REPLAY_DETECTED_OR_LEDGER_INVALID/)
 });
 it("rejects upstream J31 tamper, wrong candidate and unsigned independent roots",()=>{
  const {audit}=fixture();
  expect(()=>inspectExternalPacket({...audit,j31HandoffInputs:null})).toThrow(/J32_J31_EXTERNAL_HANDOFF_REQUIRED/);
  expect(()=>inspectExternalPacket({...audit,packetPin:"0".repeat(64)})).toThrow(/J32_INDEPENDENT_PIN_MISMATCH/);
  expect(()=>inspectExternalPacket({...audit,previousRosterPin:"0".repeat(64)})).toThrow(/J32_ROSTER_CONTINUITY_INVALID/);
  expect(()=>inspectExternalPacket({...audit,candidateCommit:WRONG})).toThrow(/J28_|J29_|J30_|J31_/)
 });
 it("rejects overlapping upstream keys and forged reviewer role separation",()=>{
  const {audit}=fixture();
  const src=JSON.parse(audit.j31HandoffInputs.rosterBytes).signers[0];
  const modified=mutate(audit,"rosterBytes",r=>{
   r.signers[0].id=src.id;r.signers[0].keyFingerprint=src.keyFingerprint;
   r.signers[0].publicKeyPem=src.publicKeyPem
  },"rosterPin");
  expect(()=>inspectExternalPacket(modified)).toThrow(/J32_UNTRUSTED_REVIEWER_IDENTITY/);
  expect(()=>inspectExternalPacket(mutate(audit,"continuityBytes",t=>t.senderId=t.receiverId,"continuityPin"))).toThrow(/J32_CUSTODY_TRANSFER_INVALID/)
 });
 it("rendered operator workbench escapes malicious descriptions and denies controls",()=>{
  const {blocked}=fixture(),html=renderOperatorHtml(blocked);
  expect(html).toContain("0 / 42");
  expect(html).toContain("0 / 126");
  expect(html.match(/<tr><th scope="row">/g)).toHaveLength(9);
  expect(html).not.toContain("<button");expect(html).not.toContain("<form");
  const changed={...blocked,domains:blocked.domains.map((x,i)=>i?x:{...x,protocol:"<img onerror=alert(1)>"})};
  expect(renderOperatorHtml(changed)).not.toContain("<img onerror");
  expect(()=>renderOperatorHtml({...blocked,releaseAuthorized:true})).toThrow(/J32_UNSAFE_OPERATOR_WORKBENCH/)
 });
});
