import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {DOMAINS,sha256} from "./j28-independent-custody.mjs";
import {machineHandoff,inspectExternalHandoff} from "./j31-operator-handoff.mjs";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/, HASH=/^[0-9a-f]{64}$/, NONCE=/^[0-9a-f]{32}$/;
const DAY=86_400_000;
const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const VISUAL_IDS=Object.freeze(Array.from({length:42},(_,i)=>"VIS-"+String(i+1).padStart(3,"0")));
const IMAGE_IDS=Object.freeze(Array.from({length:126},(_,i)=>"PNG-"+String(i+1).padStart(3,"0")));
export const REVIEW_PROTOCOL=Object.freeze({
 exactVisualArchive:"Reconcile original 42 case IDs and 126 raw original PNGs against independently acquired source archive; reviewers visually compare originals, never auto-approve from hashes.",
 physicalAndroidAndTalkBack:"Witness installed physical Android PWA offline/recovery, TalkBack navigation, audio playback and microphone with device/session provenance.",
 realAccountOAuth:"Witness genuinely registered first-party THIEPN Account OAuth consent and callbacks, persistence, logout and privacy protections with test-account session evidence.",
 independentJapaneseReview:"Independent Japanese language reviewer verifies kanji, kana, readings, JLPT coverage, explanations and audio against the provided original learning sources.",
 independentVisualAccessibilityReview:"Independent human visually compares original screenshots at mobile/desktop/200% zoom and assesses legibility, contrast and layout.",
 independentAccessibilitySignoff:"Independent qualified reviewer witnesses keyboard, semantics, TalkBack and accessibility findings; records separate signoff outside CI.",
 independentP11LearnerReview:"Qualified independent P11 reviewer assesses speaking and writing, original source provenance and open defects.",
 exactStagingIdentity:"Independently witness staging at the identical commit and preserve full binary/build provenance and rollback prerequisites.",
 testedRollback:"Independently witness a real controlled rollback from exact candidate to a known-good build with restoration proof."
});
function fail(k){throw new Error("J32_"+k)}
function sha(v){if(typeof v!=="string"||!SHA.test(v))fail("EXACT_COMMIT_REQUIRED")}
function digest(v){if(typeof v!=="string"||!HASH.test(v))fail("DIGEST_REQUIRED")}
function readJson(v,label){if(!Buffer.isBuffer(v)||v.length<2||v.length>8_000_000)fail("INVALID_JSON_BYTES:"+label);try{return JSON.parse(v.toString("utf8"))}catch{fail("INVALID_JSON:"+label)}}
function pin(raw,expected,label){digest(expected);if(!Buffer.isBuffer(raw)||sha256(raw)!==expected)fail("INDEPENDENT_PIN_MISMATCH:"+label)}
function timestamp(s,k){if(typeof s!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(s)||!Number.isFinite(Date.parse(s)))fail("INVALID_TIMESTAMP:"+k);return Date.parse(s)}
function valid(from,to,now,max,label){const a=timestamp(from,label+":from"),b=timestamp(to,label+":until");if(a>=b||b-a>max||now<a||now>b)fail("STALE_OR_FUTURE:"+label);return[a,b]}
function publicKey(s){try{const k=crypto.createPublicKey(s.publicKeyPem);if(k.asymmetricKeyType!=="ed25519"||sha256(k.export({type:"spki",format:"der"}))!==s.keyFingerprint)fail("SIGNER_FINGERPRINT_MISMATCH");return k}catch(e){if(String(e).includes("J32_"))throw e;fail("INVALID_ED25519_PUBLIC_KEY")}}
function signed(key,message,signature){
 if(typeof signature!=="string"||!/^[A-Za-z0-9+/]+={0,2}$/.test(signature))fail("SIGNATURE_ENCODING_INVALID");
 const b=Buffer.from(signature,"base64");
 if(b.length!==64||b.toString("base64")!==signature||!crypto.verify(null,Buffer.from(message),key,b))fail("SIGNATURE_INVALID");
}
function byteFile(raw,bytes,expected,label){
 if(!Buffer.isBuffer(raw)||!Number.isSafeInteger(bytes)||bytes<1||bytes>20_000_000||raw.length!==bytes||sha256(raw)!==expected)fail("RAW_SOURCE_BYTES_MISMATCH:"+label)
}
export function machinePreparation({candidateCommit,j27,j28,j29,j30,j31}){
 sha(candidateCommit);
 const canonical=machineHandoff({candidateCommit,j27,j28,j29,j30});
 if(JSON.stringify(j31)!==JSON.stringify(canonical))fail("J31_NOT_CANONICAL_BLOCKED");
 return {
  schema:"thiepn-japanese-j32-signoff-intake",version:1,candidateCommit,
  sourceCommitChain:j27.chainRoot,
  j27Digest:j27.reportSha256,
  j28Digest:sha256(Buffer.from(JSON.stringify(j28))),
  j29Digest:sha256(Buffer.from(JSON.stringify(j29))),
  j30Digest:sha256(Buffer.from(JSON.stringify(j30))),
  j31Digest:sha256(Buffer.from(JSON.stringify(j31))),
  mode:"OPERATOR_ONLY_OFFLINE_INTAKE_NOT_APPROVAL",
  originalCaseSlots:VISUAL_IDS.map(id=>({id,state:"AWAITING_ORIGINAL",sourceArchive:"NOT_PROVIDED",humanComparison:"NOT_DONE"})),
  originalPngSlots:IMAGE_IDS.map(id=>({id,state:"AWAITING_ORIGINAL",sourceSha256:"NOT_PROVIDED",independentVisualApproval:false})),
  domains:DOMAINS.map(kind=>({kind,status:"OPEN",protocol:REVIEW_PROTOCOL[kind],
   externalPrimarySource:"NOT_PROVIDED_TO_CI",verifiedReviewerIdentity:false,humanAcceptance:false})),
  sourceBytesVerified:0,sourceDomainsStructurallyVerified:0,
  genuineDeviceAcceptance:false,genuineOAuthAcceptance:false,originalCasesHumanAccepted:0,
  originalPngsHumanAccepted:0,independentLanguageSignoff:false,
  externalSignerAttestation:"NOT_PROVIDED",custodyContinuity:"NOT_VERIFIED",
  missingEvidenceGates:9,signoffReadiness:"NOT_READY",
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
  decision:"BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF"
 }
}
/** Blank inventory: IDs are accounting slots, NOT the true original filenames or acceptance evidence. */
export function blankSubmission({candidateCommit,j27,j28,j29,j30,j31}){
 const r=machinePreparation({candidateCommit,j27,j28,j29,j30,j31});
 return {schema:"thiepn-japanese-j32-blank-evidence-submission",version:1,candidateCommit,
  j31ReportDigest:r.j31Digest,warning:"UNSIGNED_TEMPLATE_ONLY_ORIGINAL_FILENAMES_AND_HUMAN_EVIDENCE_NOT_IN_REPOSITORY",
  visualCases:r.originalCaseSlots,originalPngs:r.originalPngSlots,
  protocols:r.domains.map(d=>({kind:d.kind,instructions:d.protocol,sourcePath:"NOT_PROVIDED",signature:"NOT_PROVIDED",
   independentHumanAcceptance:"NOT_CLAIMED"})),
  releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,humanAcceptanceGranted:false}
}
export function reviewPayload({candidateCommit,j31ReportDigest,batchId,kind,sourcePath,sourceSha256,
 sourceBytes,signerId,reviewedAt,expiresAt}){
 return JSON.stringify({schema:"thiepn-japanese-j32-submission-signature",version:1,candidateCommit,
  j31ReportDigest,batchId,kind,sourcePath,sourceSha256,sourceBytes,signerId,reviewedAt,expiresAt,
  declaration:"SOURCE_INTAKE_ONLY_NOT_HUMAN_ACCEPTANCE"})
}
export function continuityPayload({candidateCommit,j31ReportDigest,packetSha256,previousRosterSha256,
 currentRosterSha256,revocationSha256,sentAt,expiresAt,senderId,receiverId}){
 return JSON.stringify({schema:"thiepn-japanese-j32-intake-custody",version:1,candidateCommit,
 j31ReportDigest,packetSha256,previousRosterSha256,currentRosterSha256,revocationSha256,
 sentAt,expiresAt,senderId,receiverId,meaning:"DUAL_SIGNED_INTAKE_NOT_PRODUCTION_APPROVAL"})
}
function validateVisualInventory(doc,readPrimary){
 if(doc?.schema!=="thiepn-japanese-j32-original-visual-inventory"||doc.version!==1||
 doc.humanApprovedCases!==0||doc.humanApprovedPngs!==0||
 !Array.isArray(doc.cases)||doc.cases.length!==42||
 !Array.isArray(doc.pngs)||doc.pngs.length!==126)fail("VISUAL_INVENTORY_INVALID");
 const perCase=new Map(VISUAL_IDS.map(x=>[x,0])),seenAssets=new Set(),seenNames=new Set(),seenPaths=new Set();
 for(let i=0;i<42;i++){
  const entry=doc.cases[i];
  if(entry?.id!==VISUAL_IDS[i]||entry.humanCompared!==false||
    typeof entry.originalCaseLabel!=="string"||!entry.originalCaseLabel.trim()||
    entry.originalCaseLabel.length>160)fail("VISUAL_CASE_SOURCE_UNMAPPED")
 }
 for(let i=0;i<126;i++){
  const x=doc.pngs[i];
  if(x?.id!==IMAGE_IDS[i]||!perCase.has(x.caseId)||
    x.humanApproved!==false||!/^original\/[a-z0-9-]{1,80}\.png$/.test(x.path??"")||
    seenPaths.has(x.path)||typeof x.originalFilename!=="string"||
    !/^[^/\\\u0000-\u001f]{1,160}\.png$/i.test(x.originalFilename)||
    seenNames.has(x.originalFilename)||!HASH.test(x.sha256??""))fail("ORIGINAL_PNG_SOURCE_UNMAPPED");
  const raw=readPrimary(x.path);
  byteFile(raw,x.bytes,x.sha256,x.id);
  if(raw.length<45||!raw.subarray(0,8).equals(PNG)||raw.toString("ascii",12,16)!=="IHDR"||
     raw.readUInt32BE(16)<1||raw.readUInt32BE(16)>32768||raw.readUInt32BE(20)<1||raw.readUInt32BE(20)>32768||
     raw.toString("ascii",raw.length-8,raw.length-4)!=="IEND")fail("MALFORMED_PNG_SOURCE:"+x.id);
  perCase.set(x.caseId,perCase.get(x.caseId)+1);
  seenAssets.add(x.id);seenNames.add(x.originalFilename);seenPaths.add(x.path)
 }
 if([...perCase.values()].some(x=>x===0)||seenAssets.size!==126)fail("CASE_AND_PNG_COVERAGE_INCOMPLETE");
 return {sourcePngBytesVerified:126,originalCaseSlotsMapped:42,humanApprovedCases:0,humanApprovedPngs:0}
}
function sourceClaim(kind,doc,candidateCommit){
 if(doc?.schema!=="thiepn-japanese-j32-operator-source-claim"||
 doc.kind!==kind||doc.candidateCommit!==candidateCommit||
 doc.sourceStatus!=="SUBMITTED_NOT_INDEPENDENTLY_ACCEPTED"||
 doc.humanAccepted!==false||doc.verifiedOnRealDeviceByThisTool!==false||
 !Array.isArray(doc.requiredWitnessItems)||doc.requiredWitnessItems.length<3||
 doc.requiredWitnessItems.some(x=>typeof x!=="string"||x.length<3||x.length>160)||
 typeof doc.originalSourceOrigin!=="string"||!doc.originalSourceOrigin.trim()||
 doc.originalSourceOrigin.length>300)fail("DOMAIN_SOURCE_CLAIM_INVALID");
}
export function inspectExternalPacket({candidateCommit,j27,j28,j29,j30,j31,
 j31HandoffInputs,packetBytes,packetPin,rosterBytes,rosterPin,previousRosterPin,
 revocationBytes,revocationPin,ledgerBytes,ledgerPin,
 continuityBytes,continuityPin,readPrimary,inspectedAt}){
 const base=machinePreparation({candidateCommit,j27,j28,j29,j30,j31});
 // Require independent verification of the J31 missing-evidence handoff, not a source-controlled success string.
 if(!j31HandoffInputs)fail("J31_EXTERNAL_HANDOFF_REQUIRED");
 const inherited=inspectExternalHandoff({candidateCommit,j27,j28,j29,j30,...j31HandoffInputs,inspectedAt});
 if(inherited.openDiscrepancies!==9||inherited.releaseAuthorized!==false||
 inherited.verifiedGapHandoffRecords!==9||inherited.custodySignaturesVerified!==2)fail("J31_UPSTREAM_CUSTODY_INCOMPLETE");
 for(const [raw,p,k] of [[packetBytes,packetPin,"packet"],[rosterBytes,rosterPin,"roster"],
 [revocationBytes,revocationPin,"revocation"],[ledgerBytes,ledgerPin,"ledger"],[continuityBytes,continuityPin,"continuity"]])pin(raw,p,k);
 digest(previousRosterPin);
 const packet=readJson(packetBytes,"packet"),roster=readJson(rosterBytes,"roster"),
 rev=readJson(revocationBytes,"revocations"),ledger=readJson(ledgerBytes,"ledger"),
 transition=readJson(continuityBytes,"continuity"),now=timestamp(inspectedAt,"inspection");
 if(packet?.schema!=="thiepn-japanese-j32-primary-source-packet"||packet.version!==1||
 packet.candidateCommit!==candidateCommit||packet.j31ReportDigest!==base.j31Digest||
 !NONCE.test(packet.batchId??"")||packet.purpose!=="UNAPPROVED_EVIDENCE_INTAKE_ONLY"||
 packet.humanAcceptanceGranted!==false||packet.mergeAuthorized!==false||
 packet.deploymentAuthorized!==false||packet.releaseAuthorized!==false||
 !Array.isArray(packet.records)||packet.records.length!==9)fail("PACKET_SCHEMA_OR_RELEASE_CLAIM");
 valid(packet.createdAt,packet.expiresAt,now,DAY,"packet");
 if(roster?.schema!=="thiepn-japanese-j32-external-reviewer-roster"||roster.version!==1||
 roster.previousRosterSha256!==previousRosterPin||!Array.isArray(roster.signers)||
 roster.signers.length<11)fail("ROSTER_CONTINUITY_INVALID");
 if(rev?.schema!=="thiepn-japanese-j32-external-revocations"||rev.version!==1||
 !Array.isArray(rev.revokedIds)||new Set(rev.revokedIds).size!==rev.revokedIds.length||
 rev.revokedIds.some(x=>typeof x!=="string"||!x.trim()))fail("REVOCATIONS_INVALID");
 valid(rev.validFrom,rev.validUntil,now,DAY,"revocations");
 if(ledger?.schema!=="thiepn-japanese-j32-replay-ledger"||ledger.version!==1||
 ledger.candidateCommit!==candidateCommit||!Array.isArray(ledger.batches)||!Array.isArray(ledger.packetDigests)||
 ledger.batches.length!==ledger.packetDigests.length||
 new Set(ledger.batches).size!==ledger.batches.length||
 new Set(ledger.packetDigests).size!==ledger.packetDigests.length||
 ledger.batches.some(x=>!NONCE.test(x))||ledger.packetDigests.some(x=>!HASH.test(x))||
 ledger.batches.includes(packet.batchId)||ledger.packetDigests.includes(packetPin))fail("REPLAY_DETECTED_OR_LEDGER_INVALID");
 if(typeof readPrimary!=="function")fail("READ_PRIMARY_REQUIRED");
 const inheritedRoster=readJson(j31HandoffInputs.rosterBytes,"j31-roster");
 const oldIds=new Set(inheritedRoster.signers.map(s=>s.id));
 const oldKeys=new Set(inheritedRoster.signers.map(s=>s.keyFingerprint));
 const signers=new Map(),fingerprints=new Set();
 for(const s of roster.signers){
  if(typeof s?.id!=="string"||!s.id.trim()||signers.has(s.id)||oldIds.has(s.id)||
  !HASH.test(s.identityEvidenceSha256??"")||s.identityAuditedByOperator!==true||
  s.independentToProject!==true||s.revoked!==false||rev.revokedIds.includes(s.id)||
  !Array.isArray(s.roles)||!s.roles.length||new Set(s.roles).size!==s.roles.length||
  s.roles.some(x=>![...DOMAINS,"intake-custodian-sender","intake-custodian-receiver"].includes(x)))fail("UNTRUSTED_REVIEWER_IDENTITY");
  valid(s.validFrom,s.validUntil,now,366*DAY,"reviewer");
  const key=publicKey(s);
  if(fingerprints.has(s.keyFingerprint)||oldKeys.has(s.keyFingerprint))fail("DUPLICATE_OR_UPSTREAM_SIGNING_KEY");
  fingerprints.add(s.keyFingerprint);signers.set(s.id,{...s,key})
 }
 const kinds=new Set(),ids=new Set(),paths=new Set(),verified=[];
 let visualResult=null;
 for(const record of packet.records){
  if(!DOMAINS.includes(record?.kind)||kinds.has(record.kind)||
  typeof record.signerId!=="string"||ids.has(record.signerId)||
  !/^evidence\/[a-z0-9-]{1,80}\.json$/.test(record.sourcePath??"")||
  paths.has(record.sourcePath)||!HASH.test(record.sourceSha256??"")||
  record.humanAccepted!==false)fail("DUPLICATE_OR_FORGED_DOMAIN_RECORD");
  const signer=signers.get(record.signerId);
  if(!signer?.roles.includes(record.kind)||signer.roles.some(x=>x.startsWith("intake-custodian-")))fail("REVIEWER_ROLE_MISMATCH");
  const [a,b]=valid(record.reviewedAt,record.expiresAt,now,DAY,"review");
  if(a<timestamp(packet.createdAt,"packet-start")||b>timestamp(packet.expiresAt,"packet-end")||
    a<timestamp(signer.validFrom,"reviewer-start")||b>timestamp(signer.validUntil,"reviewer-end"))fail("SIGNATURE_WINDOW_MISMATCH");
  digest(record.sourceSha256);
  const bytes=readPrimary(record.sourcePath);byteFile(bytes,record.sourceBytes,record.sourceSha256,record.kind);
  const doc=readJson(bytes,record.kind);
  if(record.kind==="exactVisualArchive"){
   if(doc.candidateCommit!==candidateCommit)fail("VISUAL_CANDIDATE_INVALID");
   visualResult=validateVisualInventory(doc,readPrimary)
  }else sourceClaim(record.kind,doc,candidateCommit);
  signed(signer.key,reviewPayload({...record,candidateCommit,j31ReportDigest:base.j31Digest,
   batchId:packet.batchId}),record.signature);
  verified.push({kind:record.kind,sourceSha256:record.sourceSha256,signatureStructurallyValid:true,
   realWorldSourceAuthenticityProven:false,humanAccepted:false});
  kinds.add(record.kind);ids.add(record.signerId);paths.add(record.sourcePath)
 }
 if(kinds.size!==9||!visualResult)fail("DOMAIN_COVERAGE_INCOMPLETE");
 if(transition?.schema!=="thiepn-japanese-j32-intake-transfer"||transition.version!==1||
 transition.candidateCommit!==candidateCommit||transition.j31ReportDigest!==base.j31Digest||
 transition.packetSha256!==packetPin||transition.previousRosterSha256!==previousRosterPin||
 transition.currentRosterSha256!==rosterPin||transition.revocationSha256!==revocationPin||
 typeof transition.senderId!=="string"||typeof transition.receiverId!=="string"||
 transition.senderId===transition.receiverId||ids.has(transition.senderId)||ids.has(transition.receiverId)||
 transition.releaseAuthorized!==false||transition.humanAcceptanceGranted!==false)fail("CUSTODY_TRANSFER_INVALID");
 valid(transition.sentAt,transition.expiresAt,now,DAY,"transfer");
 const sender=signers.get(transition.senderId),receiver=signers.get(transition.receiverId);
 if(!sender?.roles.includes("intake-custodian-sender")||
 !receiver?.roles.includes("intake-custodian-receiver")||
 sender.roles.some(x=>DOMAINS.includes(x))||receiver.roles.some(x=>DOMAINS.includes(x)))fail("CUSTODY_ROLE_SEPARATION_INVALID");
 const msg=continuityPayload(transition);
 signed(sender.key,msg,transition.senderSignature);signed(receiver.key,msg,transition.receiverSignature);
 const proposedLedger={...ledger,batches:[...ledger.batches,packet.batchId],packetDigests:[...ledger.packetDigests,packetPin]};
 return {...base,externalSignerAttestation:"STRUCTURAL_SIGNATURE_VERIFICATION_ONLY",
 custodyContinuity:"EXTERNALLY_PINNED_DUAL_SIGNATURES_VALID_NOT_HUMAN_SIGNOFF",
 sourceBytesVerified:126+9,sourceDomainsStructurallyVerified:9,
 sourcesMatchingSubmittedHashes:verified,visualIntake:visualResult,
 originalCasesHumanAccepted:0,originalPngsHumanAccepted:0,
 manualHumanAcceptanceStillMissing:9,signoffReadiness:"NOT_READY",
 proposedLedger,ledgerUpdated:false,
 decision:"BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF"}
}
function escape(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
export function renderOperatorHtml(report){
 if(report?.schema!=="thiepn-japanese-j32-signoff-intake"||
 report.decision!=="BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF"||
 report.signoffReadiness!=="NOT_READY"||report.humanAcceptanceGranted!==false||
 report.mergeAuthorized!==false||report.deploymentAuthorized!==false||report.releaseAuthorized!==false||
 report.originalCasesHumanAccepted!==0||report.originalPngsHumanAccepted!==0||
 !Array.isArray(report.domains)||report.domains.length!==9||
 report.domains.some((d,i)=>d.kind!==DOMAINS[i]||d.status!=="OPEN"||d.humanAcceptance!==false)||
 !Array.isArray(report.originalCaseSlots)||report.originalCaseSlots.length!==42||
 !Array.isArray(report.originalPngSlots)||report.originalPngSlots.length!==126)fail("UNSAFE_OPERATOR_WORKBENCH");
 const rows=report.domains.map(d=>'<tr><th scope="row">'+escape(d.kind)+'</th><td>OPEN</td><td>'+escape(d.protocol)+'</td></tr>').join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Japanese J32 — evidence intake</title>'+
 '<style>:root{font-family:system-ui,sans-serif;color-scheme:light dark;background:#f5f3ed;color:#202826}'+
 '*{box-sizing:border-box}html,body,header,main,section,table{min-width:0;max-width:100%;overflow-wrap:anywhere}'+
 'body{width:100%;max-width:1080px;margin:auto;padding:clamp(12px,4vw,42px);line-height:1.55}'+
 'h1{font-size:clamp(1.5rem,4vw,2.25rem)}header{border-bottom:3px solid currentColor}'+
 '.block{padding:12px;background:#e8ddc8;border-left:5px solid #796344;font-weight:700}'+
 'table{width:100%;table-layout:fixed;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #a0a3a0;overflow-wrap:anywhere}'+
 '@media(max-width:550px){table,thead,tbody,tr,th,td{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:1px solid #a0a3a0}th,td{border:0;padding:4px}}'+
 '@media(prefers-color-scheme:dark){:root{background:#1d2524;color:#f3f1ea}.block{background:#443927;color:white}}</style></head><body>'+
 '<header><p>RESTRICTED · READ-ONLY OPERATOR SIGNOFF PREPARATION</p><h1>Japanese J32 — original evidence intake</h1>'+
 '<p>Candidate <code>'+escape(report.candidateCommit)+'</code></p>'+
 '<p role="status" class="block">BLOCKED — nine real-world human acceptance domains remain OPEN</p></header>'+
 '<main><section><h2>Original-source reconciliation</h2><p><strong>0 / 42</strong> independently approved visual cases; <strong>0 / 126</strong> approved original PNGs.</p>'+
 '<p>Inventory contains 42 case slots and 126 image slots only. The original filenames and images have not been supplied to CI.</p></section>'+
 '<section><h2>Real-world witness procedures</h2><table><caption>Nine independent human acceptance procedures, all OPEN</caption>'+
 '<thead><tr><th>Evidence domain</th><th>Gate</th><th>Required operator procedure</th></tr></thead><tbody>'+rows+'</tbody></table></section>'+
 '<section><h2>Separate human authority</h2><p>Submitted source hashes and signatures cannot prove actual Android, OAuth, Japanese review, visual quality or a human decision. Independently witness sources and approve in a separate authorized process. No production controls exist here.</p></section></main></body></html>\n'
}
function sourceReader(directory){
 const root=fs.realpathSync(directory);
 return (rel)=>{
  if(!/^(?:original\/[a-z0-9-]{1,80}\.png|evidence\/[a-z0-9-]{1,80}\.json)$/.test(rel))fail("UNSAFE_SOURCE_PATH");
  const full=path.resolve(root,rel);
  if(!full.startsWith(root+path.sep)||!fs.statSync(full,{throwIfNoEntry:false})?.isFile()||fs.realpathSync(full)!==full)fail("TRAVERSAL_OR_SYMLINK");
  return fs.readFileSync(full)
 }
}
export function runCli(args=process.argv.slice(2)){
 const candidateCommit=process.env.J32_CANDIDATE_SHA;sha(candidateCommit);
 const source=n=>readJson(fs.readFileSync(path.join(ROOT,"artifacts",n)),n);
 const inputs={candidateCommit,j27:source("j27-evidence-chain.json"),j28:source("j28-operator-workbench.json"),
 j29:source("j29-operator-reconciliation.json"),j30:source("j30-signoff-readiness.json"),
 j31:source("j31-operator-handoff.json")};
 const blocked=machinePreparation(inputs);
 if(args.length===0){
  fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(ROOT,"artifacts/j32-signoff-intake.json"),JSON.stringify(blocked,null,2)+"\n");
  fs.writeFileSync(path.join(ROOT,"artifacts/j32-signoff-intake.html"),renderOperatorHtml(blocked));
  fs.writeFileSync(path.join(ROOT,"artifacts/j32-unsigned-intake-template.json"),JSON.stringify(blankSubmission(inputs),null,2)+"\n");
  console.log("J32 intake: BLOCKED; nine human domains OPEN, 0/42 cases and 0/126 original PNGs accepted");return blocked
 }
 if(args.length!==7||args[0]!=="--inspect-external")fail("OFFLINE_USAGE");
 const [,sourceDir,packetFile,rosterFile,revocationFile,ledgerFile,continuityFile]=args;
 // Independent J31 handoff inputs cannot be substituted with generated machine reports.
 const j31Files=JSON.parse(process.env.J32_EXTERNAL_J31_INPUT_PATHS||"null");
 if(!j31Files||typeof j31Files!=="object")fail("EXTERNAL_J31_FILES_REQUIRED");
 const prev={packetBytes:fs.readFileSync(j31Files.packet),packetPin:process.env.J31_PACKET_SHA256,
 rosterBytes:fs.readFileSync(j31Files.roster),rosterPin:process.env.J31_ROSTER_SHA256,
 previousCustodyPin:process.env.J31_PREVIOUS_CUSTODY_SHA256,
 revocationBytes:fs.readFileSync(j31Files.revocations),revocationPin:process.env.J31_REVOCATION_SHA256,
 ledgerBytes:fs.readFileSync(j31Files.ledger),ledgerPin:process.env.J31_LEDGER_SHA256,
 custodyBytes:fs.readFileSync(j31Files.custody),custodyPin:process.env.J31_CUSTODY_SHA256};
 const report=inspectExternalPacket({...inputs,j31HandoffInputs:prev,
 packetBytes:fs.readFileSync(packetFile),packetPin:process.env.J32_PACKET_SHA256,
 rosterBytes:fs.readFileSync(rosterFile),rosterPin:process.env.J32_ROSTER_SHA256,
 previousRosterPin:process.env.J32_PREVIOUS_ROSTER_SHA256,
 revocationBytes:fs.readFileSync(revocationFile),revocationPin:process.env.J32_REVOCATION_SHA256,
 ledgerBytes:fs.readFileSync(ledgerFile),ledgerPin:process.env.J32_LEDGER_SHA256,
 continuityBytes:fs.readFileSync(continuityFile),continuityPin:process.env.J32_CONTINUITY_SHA256,
 readPrimary:sourceReader(sourceDir),inspectedAt:new Date().toISOString()});
 process.stdout.write(JSON.stringify(report,null,2)+"\n");return report
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
