import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SHA=/^[a-f0-9]{40}$/, HASH=/^[a-f0-9]{64}$/, BATCH=/^[a-f0-9]{32}$/;
const HOUR=3600000;
export const DOMAINS=Object.freeze([
 'exactVisualArchive','physicalAndroidAndTalkBack','realAccountOAuth',
 'independentJapaneseReview','independentVisualAccessibilityReview',
 'independentAccessibilitySignoff','independentP11LearnerReview',
 'exactStagingIdentity','testedRollback'
]);
const LABELS=[
 'Original screenshot review: 42 cases, 126 PNGs',
 'Physical Android PWA, TalkBack, audio and microphone',
 'Real THIEPN Account OAuth, persistence and logout',
 'Independent Japanese language/curriculum review',
 'Independent visual and accessibility review',
 'Independent accessibility signoff',
 'Independent P11 learner review',
 'Witnessed exact-head staging identity',
 'Witnessed rollback to independently known-good commit'
];
function deny(reason){throw new Error('J28_'+reason)}
export function sha256(bytes){return crypto.createHash('sha256').update(bytes).digest('hex')}
function digest(v,label){if(typeof v!=='string'||!HASH.test(v))deny('INVALID_DIGEST:'+label)}
function candidate(v){if(typeof v!=='string'||!SHA.test(v))deny('EXACT_SHA_REQUIRED')}
function parsed(raw,label){
 if(!Buffer.isBuffer(raw)||raw.length<1||raw.length>2000000)deny('INVALID_BYTES:'+label);
 try{return JSON.parse(raw.toString('utf8'))}catch{deny('INVALID_JSON:'+label)}
}
function pinned(raw,pin,label){digest(pin,label);if(!Buffer.isBuffer(raw)||sha256(raw)!==pin)deny('INDEPENDENT_PIN_MISMATCH:'+label)}
function timestamp(v,label){
 if(typeof v!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(v)||!Number.isFinite(Date.parse(v)))deny('INVALID_TIME:'+label);
 return Date.parse(v)
}
function interval(from,to,now,max,label){
 const a=timestamp(from,label+':from'),b=timestamp(to,label+':to');
 if(a>=b||b-a>max||now<a||now>b)deny('EXPIRED_OR_FUTURE:'+label);
 return [a,b]
}
export function verifyJ27({candidateCommit,j27}){
 candidate(candidateCommit);
 if(j27?.schema!=='thiepn-japanese-j27-evidence-chain'||j27.schemaVersion!==1||
 j27.candidateCommit!==candidateCommit||j27.decision!=='BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE'||
 j27.originalScreenshotCases!==42||j27.originalImageFiles!==126||
 j27.independentVisualArchive!=='not_supplied_to_ci'||j27.trustedHumanApprovals!=='not_verified_by_ci'||
 j27.releaseAuthorized!==false||j27.mergeAuthorized!==false||j27.deploymentAuthorized!==false||
 !Array.isArray(j27.sequence)||j27.sequence.length!==8||
 !Array.isArray(j27.releaseManifestDigests)||j27.releaseManifestDigests.length!==3)deny('J27_NOT_QUALIFIED_OR_WRONG_SHA');
 digest(j27.reportSha256,'j27-report');
 const {reportSha256,...unsigned}=j27;
 if(sha256(Buffer.from(JSON.stringify(unsigned)))!==reportSha256)deny('J27_REPORT_TAMPERED');
 let previous='0'.repeat(64);
 const names=['J20','J21','J21-review','J22','J23','J24','J25','J26'];
 for(let i=0;i<names.length;i++){
   const item=j27.sequence[i];
   if(item?.name!==names[i]||item.previous!==previous||!Number.isSafeInteger(item.bytes)||item.bytes<=0)deny('J27_SEQUENCE_INVALID');
   digest(item.sha256,'j27-source');
   const next=sha256(Buffer.from(JSON.stringify({candidateCommit,previous,name:item.name,path:item.path,sha256:item.sha256,bytes:item.bytes})));
   if(item.chainSha256!==next)deny('J27_CHAIN_TAMPERED');
   previous=next;
 }
 if(j27.chainRoot!==previous)deny('J27_ROOT_TAMPERED');
 if(j27.releaseManifestDigests.map(x=>x.name).join('|')!=='signoffs|field|production'||
    j27.releaseManifestDigests.some(x=>!HASH.test(x.sha256)||!Number.isSafeInteger(x.bytes)||x.bytes<=0)||
    j27.manifestRoot!==sha256(Buffer.from(JSON.stringify(j27.releaseManifestDigests))))deny('J27_MANIFEST_ROOT_TAMPERED');
 return reportSha256
}
export function blockedWorkbench({candidateCommit,j27}){
 const j27ReportDigest=verifyJ27({candidateCommit,j27});
 return {schema:'thiepn-japanese-j28-operator-workbench',version:1,candidateCommit,
 j27ReportDigest,j27MachineChainRoot:j27.chainRoot,
 originalVisualCasesIndependentlyVerified:0,originalPngsIndependentlyVerified:0,
 externallyPinnedRoster:'not_provided_to_ci',revocations:'not_provided_to_ci',
 independentPhysicalAndHumanWitness:'not_provided_to_ci',
 domains:DOMAINS.map((kind,i)=>({kind,label:LABELS[i],status:'OPEN'})),
 custodyStatus:'NO_INDEPENDENT_EXTERNAL_CUSTODY_IN_CI',
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:'BLOCKED_INDEPENDENT_EXTERNAL_ACCEPTANCE_AND_RELEASE_AUTHORITY'}
}
export function signatureMessage({candidateCommit,j27ReportDigest,batchId,kind,path:relativePath,sha256:recordDigest,bytes,signerId,signedAt,expiresAt}){
 return JSON.stringify({schema:'thiepn-japanese-j28-custody-signature',version:1,
 candidateCommit,j27ReportDigest,batchId,kind,path:relativePath,sha256:recordDigest,bytes,signerId,signedAt,expiresAt,
 acknowledgement:'EVIDENCE_CUSTODY_ONLY_NO_HUMAN_OR_RELEASE_AUTHORITY'})
}
function keyOf(s){
 try{
  const key=crypto.createPublicKey(s.publicKeyPem);
  if(key.asymmetricKeyType!=='ed25519'||sha256(key.export({type:'spki',format:'der'}))!==s.keyFingerprint)deny('KEY_OR_FINGERPRINT_INVALID');
  return key
 }catch(e){if(String(e).includes('J28_'))throw e;deny('KEY_PARSE_ERROR')}
}
export function inspectExternalCustody({candidateCommit,j27,j27Bytes,j27Pin,manifestBytes,
 rosterBytes,rosterPin,revocationBytes,revocationPin,ledgerBytes,ledgerPin,readRaw,inspectedAt}){
 pinned(j27Bytes,j27Pin,'j27');
 if(JSON.stringify(parsed(j27Bytes,'j27'))!==JSON.stringify(j27))deny('J27_BYTES_DISAGREE');
 const j27ReportDigest=verifyJ27({candidateCommit,j27});
 pinned(rosterBytes,rosterPin,'roster');pinned(revocationBytes,revocationPin,'revocations');
 pinned(ledgerBytes,ledgerPin,'replay-ledger');
 const roster=parsed(rosterBytes,'roster'),rev=parsed(revocationBytes,'revocations'),
 ledger=parsed(ledgerBytes,'ledger'),manifest=parsed(manifestBytes,'manifest');
 const now=timestamp(inspectedAt,'inspection');
 if(roster.schema!=='thiepn-japanese-j28-independent-roster'||roster.version!==1||
 !Array.isArray(roster.signers)||roster.signers.length<DOMAINS.length)deny('ROSTER_INVALID');
 if(rev.schema!=='thiepn-japanese-j28-independent-revocations'||rev.version!==1||
 !Array.isArray(rev.revokedIds)||new Set(rev.revokedIds).size!==rev.revokedIds.length||
 rev.revokedIds.some(id=>typeof id!=='string'||!id.trim()))deny('REVOCATIONS_INVALID');
 interval(rev.validFrom,rev.validUntil,now,24*HOUR,'revocations');
 if(ledger.schema!=='thiepn-japanese-j28-external-ledger'||ledger.version!==1||
 ledger.candidateCommit!==candidateCommit||!Array.isArray(ledger.consumedBatchIds)||
 !Array.isArray(ledger.receiptDigests)||ledger.consumedBatchIds.length!==ledger.receiptDigests.length||
 ledger.consumedBatchIds.some(v=>typeof v!=='string'||!BATCH.test(v))||
 ledger.receiptDigests.some(v=>typeof v!=='string'||!HASH.test(v))||
 new Set(ledger.consumedBatchIds).size!==ledger.consumedBatchIds.length||
 new Set(ledger.receiptDigests).size!==ledger.receiptDigests.length)deny('LEDGER_INVALID');
 if(manifest.schema!=='thiepn-japanese-j28-external-custody'||manifest.version!==1||
 manifest.candidateCommit!==candidateCommit||manifest.j27ReportDigest!==j27ReportDigest||
 !BATCH.test(manifest.batchId??'')||ledger.consumedBatchIds.includes(manifest.batchId)||
 !Array.isArray(manifest.records)||manifest.records.length!==DOMAINS.length||
 manifest.releaseAuthorized!==false||manifest.mergeAuthorized!==false||
 manifest.deploymentAuthorized!==false)deny('BUNDLE_INVALID_OR_REPLAYED');
 interval(manifest.createdAt,manifest.expiresAt,now,24*HOUR,'manifest');
 const signers=new Map(),fingerprints=new Set();
 for(const s of roster.signers){
  if(typeof s?.id!=='string'||!s.id.trim()||signers.has(s.id)||
  !Array.isArray(s.roles)||s.roles.length<1||s.roles.some(role=>!DOMAINS.includes(role))||
  new Set(s.roles).size!==s.roles.length||s.independentToProject!==true||
  s.identityAuditedByOperator!==true||s.revoked!==false||rev.revokedIds.includes(s.id)||
  !HASH.test(s.identityEvidenceSha256??''))deny('UNTRUSTED_SIGNER');
  interval(s.validFrom,s.validUntil,now,366*24*HOUR,'signer-key');
  const key=keyOf(s);
  if(fingerprints.has(s.keyFingerprint))deny('DUPLICATE_SIGNING_KEY');
  fingerprints.add(s.keyFingerprint);signers.set(s.id,{...s,key})
 }
 if(typeof readRaw!=='function')deny('SAFE_FILE_READER_REQUIRED');
 const domains=new Set(),usedIds=new Set(),paths=new Set(),evidence=[];
 for(const r of manifest.records){
  const kind=r?.kind;
  if(!DOMAINS.includes(kind)||domains.has(kind)||typeof r.path!=='string'||
    !/^evidence\/[a-z0-9-]{1,80}\.(json|bin|png|md)$/.test(r.path)||
    paths.has(r.path)||!HASH.test(r.sha256??'')||
    !Number.isSafeInteger(r.bytes)||r.bytes<1||r.bytes>2000000||
    typeof r.signerId!=='string'||usedIds.has(r.signerId))deny('EVIDENCE_RECORD_INVALID');
  const signer=signers.get(r.signerId);
  if(!signer||!signer.roles.includes(kind))deny('SIGNER_ROLE_OR_INDEPENDENCE_INVALID');
  const [start,end]=interval(r.signedAt,r.expiresAt,now,24*HOUR,'record');
  if(start<timestamp(manifest.createdAt,'manifest-created')||end>timestamp(manifest.expiresAt,'manifest-expires')||
  start<timestamp(signer.validFrom,'key-start')||end>timestamp(signer.validUntil,'key-end'))deny('RECORD_TIMING_INVALID');
  const raw=readRaw(r.path);
  if(!Buffer.isBuffer(raw)||raw.length!==r.bytes||sha256(raw)!==r.sha256)deny('RECORD_BYTES_TAMPERED:'+kind);
  if(typeof r.signature!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(r.signature))deny('SIGNATURE_ENCODING_INVALID');
  const sig=Buffer.from(r.signature,'base64');
  if(sig.length!==64||sig.toString('base64')!==r.signature||
    !crypto.verify(null,Buffer.from(signatureMessage({...r,candidateCommit,j27ReportDigest,batchId:manifest.batchId})),signer.key,sig))deny('INVALID_SIGNATURE:'+kind);
  paths.add(r.path);domains.add(kind);usedIds.add(r.signerId);
  evidence.push({kind,recordSha256:r.sha256,custodySigner:r.signerId,
    cryptographicSignature:'valid',humanWitness:'not_automatically_verified'})
 }
 if(domains.size!==DOMAINS.length)deny('DOMAIN_COVERAGE_INCOMPLETE');
 const submissionSha256=sha256(manifestBytes);
 if(ledger.receiptDigests.includes(submissionSha256))deny('REPLAYED_SUBMISSION');
 const proposedLedger={...ledger,consumedBatchIds:[...ledger.consumedBatchIds,manifest.batchId],
 receiptDigests:[...ledger.receiptDigests,submissionSha256]};
 return {schema:'thiepn-japanese-j28-custody-inspection',candidateCommit,batchId:manifest.batchId,
 j27ReportDigest,trustPins:{roster:rosterPin,revocations:revocationPin,ledger:ledgerPin,j27:j27Pin},
 submissionSha256,checkedRecords:DOMAINS.length,signatureVerification:'passed',
 sourceIdentity:'declared_in_independently_pinned_roster_not_personally_verified',
 actualEvidenceTruth:'NOT_ATTESTED_BY_AUTOMATED_TOOL',
 originalVisualCasesIndependentlyVerified:0,originalPngsIndependentlyVerified:0,
 custodyEvidence:evidence,proposedLedger,
 proposedLedgerSha256:sha256(Buffer.from(JSON.stringify(proposedLedger))),
 ledgerUpdated:false,operatorApproval:'not_granted',humanAcceptanceGranted:false,
 mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:'CUSTODY_SIGNATURES_VALID_HUMAN_ACCEPTANCE_AND_RELEASE_BLOCKED'}
}
function escapeHtml(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
export function renderOperatorHtml(r){
 if(r?.schema!=='thiepn-japanese-j28-operator-workbench'||r.releaseAuthorized!==false||
 r.mergeAuthorized!==false||r.deploymentAuthorized!==false||
 r.decision!=='BLOCKED_INDEPENDENT_EXTERNAL_ACCEPTANCE_AND_RELEASE_AUTHORITY'||
 !Array.isArray(r.domains)||r.domains.length!==DOMAINS.length)deny('UNSAFE_WORKBENCH_REPORT');
 const rows=r.domains.map((d,i)=>{
  if(d.kind!==DOMAINS[i]||d.status!=='OPEN')deny('UNSAFE_DOMAIN_STATUS');
  return '<tr><th scope="row">'+escapeHtml(d.label)+'</th><td>OPEN</td><td>Independent human evidence not accepted</td></tr>'
 }).join('');
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Japanese J28 — operator acceptance</title><style>'+
 ':root{color-scheme:light dark;font-family:system-ui,sans-serif;background:#f4f2ed;color:#232727}'+
 '*{box-sizing:border-box}body{max-width:1100px;margin:auto;padding:clamp(16px,4vw,48px);line-height:1.5}'+
 'h1{font-size:clamp(1.7rem,3vw,2.5rem)}header{border-bottom:3px solid currentColor}'+
 '.decision{padding:14px;border-left:5px solid #795d3c;background:#e8e0d1;font-weight:700}'+
 'code{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse}'+
 'th,td{padding:12px;border-bottom:1px solid #a5aaa6;text-align:left;vertical-align:top}'+
 '@media(max-width:600px){table,thead,tbody,tr,th,td{display:block}thead{position:absolute;clip-path:inset(50%)}tr{border-bottom:1px solid #8a928b}tr th,tr td{padding:3px;border:0}}'+
 '@media(prefers-color-scheme:dark){:root{background:#1d2424;color:#f1f0e7}.decision{background:#463b2c;color:white}}'+
 '</style></head><body><header><p>RESTRICTED / READ-ONLY RELEASE OPERATIONS</p>'+
 '<h1>Japanese · J28 operator acceptance</h1><p>Exact candidate <code>'+escapeHtml(r.candidateCommit)+'</code></p>'+
 '<div class="decision" role="status">BLOCKED — no human acceptance, merge, deployment or production authorization</div></header>'+
 '<main><section><h2>Evidence custody</h2><p>J27 machine evidence digest: <code>'+escapeHtml(r.j27ReportDigest)+
 '</code></p><p>Machine chain root: <code>'+escapeHtml(r.j27MachineChainRoot)+'</code></p>'+
 '<p>Original screenshots independently accepted: <strong>0 / 42 cases; 0 / 126 PNGs</strong>.</p>'+
 '<p>Valid custody signatures do not prove physical-device testing, OAuth, review quality or independent human identity.</p></section>'+
 '<section><h2>Independent acceptance gates</h2><table><caption>All nine external domains remain open</caption>'+
 '<thead><tr><th>Requirement</th><th>Status</th><th>Authority</th></tr></thead><tbody>'+rows+
 '</tbody></table></section><section><h2>Required human decision</h2>'+
 '<p>No automated approval or release controls exist. Verify actual evidence independently; obtain separate human release authority.</p>'+
 '</section></main></body></html>\n'
}
function safeRead(dir){
 const root=fs.realpathSync(dir);
 return relative=>{
  if(!/^evidence\/[a-z0-9-]{1,80}\.(json|bin|png|md)$/.test(relative))deny('PATH_INVALID');
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.statSync(file,{throwIfNoEntry:false})?.isFile()||
  fs.realpathSync(file)!==file)deny('SYMLINK_OR_PATH_INVALID');
  return fs.readFileSync(file)
 }
}
export function runCli(args=process.argv.slice(2)){
 const candidateCommit=process.env.J28_CANDIDATE_SHA;candidate(candidateCommit);
 const j27Bytes=fs.readFileSync(path.join(ROOT,'artifacts/j27-evidence-chain.json'));
 const j27=parsed(j27Bytes,'j27');
 if(!args.length){
  const r=blockedWorkbench({candidateCommit,j27});
  fs.mkdirSync(path.join(ROOT,'artifacts'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'artifacts/j28-operator-workbench.json'),JSON.stringify(r,null,2)+'\n');
  fs.writeFileSync(path.join(ROOT,'artifacts/j28-operator-workbench.html'),renderOperatorHtml(r));
  console.log('J28 machine custody: BLOCKED; offline workbench generated');return r
 }
 if(args.length!==5||args[0]!=='--inspect-external')deny('OFFLINE_USAGE');
 const [,dir,roster,revocations,ledger]=args;
 const receipt=inspectExternalCustody({candidateCommit,j27,j27Bytes,j27Pin:process.env.J28_J27_SHA256,
  manifestBytes:fs.readFileSync(path.join(dir,'manifest.json')),
  rosterBytes:fs.readFileSync(roster),rosterPin:process.env.J28_ROSTER_SHA256,
  revocationBytes:fs.readFileSync(revocations),revocationPin:process.env.J28_REVOCATION_SHA256,
  ledgerBytes:fs.readFileSync(ledger),ledgerPin:process.env.J28_LEDGER_SHA256,
  readRaw:safeRead(dir),inspectedAt:new Date().toISOString()});
 process.stdout.write(JSON.stringify(receipt,null,2)+'\n');return receipt
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
