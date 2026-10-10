import crypto from 'node:crypto';
import {describe,it,expect} from 'vitest';
import {DOMAINS,sha256,signatureMessage,verifyJ27,blockedWorkbench,inspectExternalCustody,renderOperatorHtml} from '../../scripts/j28-independent-custody.mjs';
const C='a'.repeat(40),WRONG='b'.repeat(40);
function bytes(o){return Buffer.from(JSON.stringify(o))}
function j27(){
 let previous='0'.repeat(64);
 const sequence=['J20','J21','J21-review','J22','J23','J24','J25','J26'].map((name,i)=>{
  const row={name,path:'artifacts/'+name+'.json',sha256:sha256(Buffer.from(name)),bytes:i+3};
  const chainSha256=sha256(bytes({candidateCommit:C,previous,...row}));
  const result={...row,previous,chainSha256};previous=chainSha256;return result
 });
 const releaseManifestDigests=['signoffs','field','production'].map(name=>({name,path:'release/'+name+'.json',sha256:sha256(Buffer.from(name)),bytes:4}));
 const x={schema:'thiepn-japanese-j27-evidence-chain',schemaVersion:1,candidateCommit:C,sequence,
  releaseManifestDigests,chainRoot:previous,manifestRoot:sha256(bytes(releaseManifestDigests)),
  independentVisualArchive:'not_supplied_to_ci',originalScreenshotCases:42,originalImageFiles:126,
  trustedHumanApprovals:'not_verified_by_ci',mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:'BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE'};
 return {...x,reportSha256:sha256(bytes(x))}
}
function fixture(){
 const report=j27(),j27Bytes=bytes(report),now='2026-10-10T12:00:00Z',
  createdAt='2026-10-10T11:00:00Z',expiresAt='2026-10-10T13:00:00Z',batchId='c'.repeat(32);
 const keys=[],signers=[];
 for(let i=0;i<DOMAINS.length;i++){
  const {publicKey,privateKey}=crypto.generateKeyPairSync('ed25519'),id='external-'+i;
  keys.push(privateKey);
  signers.push({id,roles:[DOMAINS[i]],publicKeyPem:publicKey.export({type:'spki',format:'pem'}).toString(),
   keyFingerprint:sha256(publicKey.export({type:'spki',format:'der'})),
   independentToProject:true,identityAuditedByOperator:true,revoked:false,
   identityEvidenceSha256:sha256(Buffer.from(id)),
   validFrom:'2026-10-09T12:00:00Z',validUntil:'2026-10-11T12:00:00Z'})
 }
 const rosterBytes=bytes({schema:'thiepn-japanese-j28-independent-roster',version:1,signers});
 const revocationBytes=bytes({schema:'thiepn-japanese-j28-independent-revocations',
  version:1,validFrom:'2026-10-10T00:00:00Z',validUntil:'2026-10-11T00:00:00Z',revokedIds:[]});
 const ledgerBytes=bytes({schema:'thiepn-japanese-j28-external-ledger',
  version:1,candidateCommit:C,consumedBatchIds:[],receiptDigests:[]});
 const contents=new Map();
 const records=DOMAINS.map((kind,i)=>{
  const file='evidence/'+kind.toLowerCase()+'.json';
  const raw=bytes({kind,note:'Synthetic-only fixture. No real evidence or acceptance.'});
  contents.set(file,raw);
  const r={kind,path:file,sha256:sha256(raw),bytes:raw.length,
   signerId:'external-'+i,signedAt:createdAt,expiresAt};
  const message=signatureMessage({...r,candidateCommit:C,j27ReportDigest:report.reportSha256,batchId});
  return {...r,signature:crypto.sign(null,Buffer.from(message),keys[i]).toString('base64')}
 });
 const manifest={schema:'thiepn-japanese-j28-external-custody',version:1,
  candidateCommit:C,j27ReportDigest:report.reportSha256,batchId,createdAt,expiresAt,
  records,releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false};
 const f={candidateCommit:C,j27:report,j27Bytes,j27Pin:sha256(j27Bytes),
  manifestBytes:bytes(manifest),rosterBytes,rosterPin:sha256(rosterBytes),
  revocationBytes,revocationPin:sha256(revocationBytes),
  ledgerBytes,ledgerPin:sha256(ledgerBytes),readRaw:p=>contents.get(p),inspectedAt:now};
 return {f,contents}
}
function mutate(f,change){const v=JSON.parse(f.manifestBytes);change(v);return {...f,manifestBytes:bytes(v)}}
describe('J28 fail-closed independent evidence custody',()=>{
 it('verifies nine Ed25519 signatures, never authorizes human acceptance or production',()=>{
  const {f}=fixture(),r=inspectExternalCustody(f);
  expect(r.checkedRecords).toBe(9);
  expect(r.signatureVerification).toBe('passed');
  expect(r.releaseAuthorized).toBe(false);
  expect(r.mergeAuthorized).toBe(false);
  expect(r.deploymentAuthorized).toBe(false);
  expect(r.humanAcceptanceGranted).toBe(false);
  expect(r.originalVisualCasesIndependentlyVerified).toBe(0);
  expect(r.ledgerUpdated).toBe(false);
  expect(r.proposedLedger.consumedBatchIds).toEqual(['c'.repeat(32)])
 });
 it('rejects missing independent pins, altered machine chain, and cross-SHA files',()=>{
  const {f}=fixture();
  expect(()=>inspectExternalCustody({...f,rosterPin:null})).toThrow(/J28_INVALID_DIGEST/);
  expect(()=>inspectExternalCustody({...f,j27Pin:'f'.repeat(64)})).toThrow(/J28_INDEPENDENT_PIN_MISMATCH/);
  expect(()=>verifyJ27({candidateCommit:C,j27:{...f.j27,chainRoot:'e'.repeat(64)}})).toThrow(/J28_J27_REPORT_TAMPERED/);
  expect(()=>verifyJ27({candidateCommit:WRONG,j27:f.j27})).toThrow(/J28_J27_NOT_QUALIFIED/)
 });
 it('rejects modified raw bytes, broken signature, missing domain and unsafe paths',()=>{
  const {f,contents}=fixture(),altered=new Map(contents),first=contents.keys().next().value;
  altered.set(first,Buffer.from('tampered'));
  expect(()=>inspectExternalCustody({...f,readRaw:p=>altered.get(p)})).toThrow(/J28_RECORD_BYTES_TAMPERED/);
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.records[0].signature='A'.repeat(88)}))).toThrow(/J28_INVALID_SIGNATURE/);
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.records.pop()}))).toThrow(/J28_BUNDLE_INVALID/);
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.records[0].path='../secrets.json'}))).toThrow(/J28_EVIDENCE_RECORD_INVALID/)
 });
 it('rejects duplicate signer, revoked keys and stale revocations',()=>{
  const {f}=fixture();
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.records[1].signerId=m.records[0].signerId}))).toThrow(/J28_EVIDENCE_RECORD_INVALID/);
  const rev=JSON.parse(f.revocationBytes);rev.revokedIds=['external-2'];
  const b=bytes(rev);
  expect(()=>inspectExternalCustody({...f,revocationBytes:b,revocationPin:sha256(b)})).toThrow(/J28_UNTRUSTED_SIGNER/);
  rev.revokedIds=[];rev.validUntil='2026-10-10T11:00:00Z';
  const c=bytes(rev);
  expect(()=>inspectExternalCustody({...f,revocationBytes:c,revocationPin:sha256(c)})).toThrow(/J28_EXPIRED_OR_FUTURE/)
 });
 it('rejects used nonce and forged authorization',()=>{
  const {f}=fixture(),ledger=JSON.parse(f.ledgerBytes);
  ledger.consumedBatchIds.push('c'.repeat(32));ledger.receiptDigests.push('d'.repeat(64));
  const b=bytes(ledger);
  expect(()=>inspectExternalCustody({...f,ledgerBytes:b,ledgerPin:sha256(b)})).toThrow(/J28_BUNDLE_INVALID_OR_REPLAYED/);
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.candidateCommit=WRONG}))).toThrow(/J28_BUNDLE_INVALID/);
  expect(()=>inspectExternalCustody(mutate(f,m=>{m.releaseAuthorized=true}))).toThrow(/J28_BUNDLE_INVALID/)
 });
 it('renders offline report safely without release controls or hidden signoffs',()=>{
  const r=blockedWorkbench({candidateCommit:C,j27:j27()}),html=renderOperatorHtml(r);
  expect(html).toContain('0 / 42 cases; 0 / 126 PNGs');
  expect(html.match(/<tr><th scope="row">/g)).toHaveLength(9);
  expect(html).not.toContain('<button');
  const changed={...r,domains:r.domains.map((d,i)=>i===0?{...d,label:'<img onerror=alert(1)>'}:d)};
  expect(renderOperatorHtml(changed)).not.toContain('<img onerror');
  expect(()=>renderOperatorHtml({...r,releaseAuthorized:true})).toThrow(/J28_UNSAFE_WORKBENCH_REPORT/)
 });
});
