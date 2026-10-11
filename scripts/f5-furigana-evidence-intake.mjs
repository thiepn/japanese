import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/;
const HASH=/^[0-9a-f]{64}$/;
const VERDICTS=new Set(["PASS","FAIL","NOT_TESTED"]);
const STATUSES=new Set(["NOT_TESTED","IN_PROGRESS","SUBMITTED"]);
const UNRESOLVED=Object.freeze([
  "sentence/sentence-a1-040",
  "sentence/sentence-a1-043",
  "sentence/sentence-a1-072"
]);
const sha256=(value)=>crypto.createHash("sha256").update(value).digest("hex");
const fail=(code)=>{throw Error("F5_"+code)};
const nonempty=(value)=>typeof value==="string"&&value.trim().length>0&&value.length<=2000;
const validDate=(value)=>typeof value==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value)&&Number.isFinite(Date.parse(value));
const record=(v)=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const exactKeys=(items,expected,label)=>{
  if(!Array.isArray(items)||items.length!==expected.length)fail(label+"_COUNT");
  const got=items.map((item)=>item?.id);
  if(got.some((id)=>typeof id!=="string")||new Set(got).size!==got.length)fail(label+"_DUPLICATE");
  if(got.some((id)=>!expected.includes(id)))fail(label+"_UNKNOWN_ID");
  if(expected.some((id)=>!got.includes(id)))fail(label+"_MISSING_ID");
};
const pinned=(v,packet,label)=>{
  if(!record(v)||JSON.stringify(v)!==JSON.stringify(packet.source))fail(label+"_SOURCE_MISMATCH");
};
const claimStatus=(v,pass,failed,total,label)=>{
  if(!STATUSES.has(v))fail(label+"_STATUS_INVALID");
  if(v==="NOT_TESTED"&&(pass||failed))fail(label+"_STATUS_CONTRADICTS_OBSERVATIONS");
  if(v==="SUBMITTED"&&pass+failed!==total)fail(label+"_SUBMITTED_INCOMPLETE");
  if(v==="IN_PROGRESS"&&pass+failed===0)fail(label+"_IN_PROGRESS_WITHOUT_OBSERVATIONS");
};
function evidenceRef(ref){
  // Never allow arbitrary URLs, absolute paths, Unicode lookalikes, dot segments,
  // virtual paths, or environment-sensitive path expansion.
  if(typeof ref!=="string"||ref.length>200||!/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(ref)||
     ref.split("/").some((x)=>!x||x==="."||x===".."))fail("UNSAFE_EVIDENCE_REF");
  return ref;
}
function evidenceBytes(base,ref,maxBytes){
  const root=fs.realpathSync(base);
  const parts=evidenceRef(ref).split("/");
  let cursor=root;
  for(const part of parts){
    cursor=path.join(cursor,part);
    const stat=fs.lstatSync(cursor);
    if(stat.isSymbolicLink())fail("SYMLINK_EVIDENCE");
  }
  const resolved=fs.realpathSync(cursor);
  if(!resolved.startsWith(root+path.sep))fail("OUTSIDE_EVIDENCE_ROOT");
  const stat=fs.statSync(resolved);
  if(!stat.isFile()||stat.size<1||stat.size>maxBytes)fail("INVALID_EVIDENCE_BYTES");
  return fs.readFileSync(resolved);
}
function indexEvidence(manifest,candidateCommit,dir){
  if(manifest===null)return new Map();
  if(!record(manifest)||manifest.schema!=="thiepn-japanese-f5-evidence-manifest"||
     manifest.schemaVersion!==1||manifest.candidateCommit!==candidateCommit||
     !Array.isArray(manifest.files)||!dir)fail("MANIFEST_INVALID");
  if(manifest.files.length>500)fail("MANIFEST_TOO_LARGE");
  const entries=new Map();
  for(const file of manifest.files){
    if(!record(file))fail("INVALID_MANIFEST_FILE");
    const ref=evidenceRef(file.ref);
    if(entries.has(ref))fail("DUPLICATE_MANIFEST_FILE");
    if(!HASH.test(file.sha256)||!Number.isSafeInteger(file.sizeBytes)||
       file.sizeBytes<1||file.sizeBytes>10_000_000||
       !["observation","screenshot","attestation","device-log"].includes(file.kind))fail("MANIFEST_FILE_METADATA");
    const bytes=evidenceBytes(dir,ref,10_000_000);
    if(bytes.length!==file.sizeBytes||sha256(bytes)!==file.sha256)fail("EVIDENCE_DIGEST_MISMATCH");
    if(file.kind==="screenshot"&&
       !bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))fail("PNG_SIGNATURE_INVALID");
    entries.set(ref,file);
  }
  return entries;
}
function requireRefs(refs,index,label){
  if(!Array.isArray(refs)||refs.length<1||refs.length>5||
     new Set(refs).size!==refs.length)fail(label+"_EVIDENCE_REFS_REQUIRED");
  for(const ref of refs){
    evidenceRef(ref);
    if(!index.has(ref))fail(label+"_EVIDENCE_NOT_FOUND");
  }
}
function sourceChecked(packet){
  if(!record(packet)||packet.schema!=="thiepn-japanese-f4-furigana-editorial-packet"||
     packet.schemaVersion!==1||packet.caseCounts?.total!==240||
     !Array.isArray(packet.cases)||packet.cases.length!==240||
     !HASH.test(packet.source?.sourceSHA256))fail("SOURCE_PACKET_INVALID");
  const raw=fs.readFileSync(path.join(ROOT,"content/seed/jp-core.json"));
  if(sha256(raw)!==packet.source.sourceSHA256)fail("CANONICAL_SOURCE_CHANGED");
  const ids=packet.cases.map((x)=>x.id);
  if(new Set(ids).size!==240)fail("PACKET_CASE_IDS");
  if(JSON.stringify(packet.audit?.manualResolutionCaseIds)!==JSON.stringify(UNRESOLVED))fail("UNRESOLVED_CASES_CHANGED");
  return ids;
}
/**
 * Structural intake of raw locally provided evidence, not independent authentication.
 * A structurally valid PASS is always an unverified reviewer/operator claim.
 * Nothing here can authorize production or change learner data.
 */
export function inspectFuriganaEvidence({
 candidateCommit,packet,reviewer=null,device=null,manifest=null,evidenceDir=null
}){
  if(!SHA.test(candidateCommit))fail("EXACT_CANDIDATE_REQUIRED");
  const caseIds=sourceChecked(packet);
  const index=indexEvidence(manifest,candidateCommit,evidenceDir);
  const referenced=new Set();
  const mark=(refs,label)=>{requireRefs(refs,index,label);for(const ref of refs)referenced.add(ref)};
  let reviewSummary={pass:0,fail:0,notTested:240,status:"NOT_PROVIDED",identityClaim:"NOT_VERIFIED"};
  let deviceSummary={pass:0,fail:0,notTested:15,status:"NOT_PROVIDED",identityClaim:"NOT_VERIFIED"};
  if(reviewer!==null){
    if(!record(reviewer)||reviewer.schema!=="thiepn-japanese-f4-furigana-review-submission"||
       reviewer.schemaVersion!==1||reviewer.candidateCommit!==candidateCommit||
       !record(reviewer.reconciliation)||reviewer.reconciliation.releaseAuthorized!==false||
       reviewer.reconciliation.ownerApproval===true)fail("REVIEWER_NOT_PINNED_OR_APPROVAL_CLAIMED");
    pinned(reviewer.source,packet,"REVIEWER");
    exactKeys(reviewer.caseReviews,caseIds,"REVIEW");
    reviewSummary={pass:0,fail:0,notTested:0,status:reviewer.status,identityClaim:"NOT_VERIFIED"};
    for(const item of reviewer.caseReviews){
      if(!VERDICTS.has(item.verdict))fail("INVALID_REVIEW_VERDICT");
      if(item.verdict==="NOT_TESTED"){
        reviewSummary.notTested++;
        if((item.evidenceRefs?.length??0)!==0)fail("UNTESTED_CASE_REFERENCES_EVIDENCE");
        continue;
      }
      reviewSummary[item.verdict==="PASS"?"pass":"fail"]++;
      if(!nonempty(item.observedReading)||!nonempty(item.reason))fail("REVIEW_NOT_DOCUMENTED");
      if(item.verdict==="FAIL"&&(!nonempty(item.expectedCorrection)||!nonempty(item.reproduction)))fail("FAIL_REPRODUCTION_REQUIRED");
      mark(item.evidenceRefs,"REVIEW");
    }
    claimStatus(reviewer.status,reviewSummary.pass,reviewSummary.fail,240,"REVIEWER");
    if(reviewSummary.pass||reviewSummary.fail){
      const actor=reviewer.reviewer;
      if(!record(actor)||!nonempty(actor.label)||!nonempty(actor.role)||
         actor.independentFromImplementation!==true||
         actor.consentToShareEvidence!==true||!validDate(actor.reviewedAt))fail("REVIEWER_INDEPENDENCE_CLAIM_MISSING");
      const independentRef=evidenceRef(actor.independenceEvidenceRef);
      if(index.get(independentRef)?.kind!=="attestation")fail("REVIEWER_ATTESTATION_BYTES_REQUIRED");
      mark([independentRef],"REVIEWER_ATTESTATION");
      reviewSummary.identityClaim="SELF_DECLARED_WITH_HASHED_ATTESTATION_NOT_AUTHENTICATED";
    }
  }
  if(device!==null){
    if(!record(device)||device.schema!=="thiepn-japanese-f4-furigana-device-witness"||
       device.schemaVersion!==1||device.candidateCommit!==candidateCommit||
       !record(device.summary)||device.summary.releaseAuthorized!==false||
       device.summary.independentHumanAcceptance===true||
       device.summary.physicalDeviceAccepted===true)fail("DEVICE_NOT_PINNED_OR_APPROVAL_CLAIMED");
    pinned(device.source,packet,"DEVICE");
    const template=JSON.parse(fs.readFileSync(path.join(ROOT,"docs/furigana/f4-device-witness.template.json"),"utf8"));
    const expected=template.checks.map((x)=>x.id);
    exactKeys(device.checks,expected,"DEVICE");
    deviceSummary={pass:0,fail:0,notTested:0,status:device.status,identityClaim:"NOT_VERIFIED"};
    for(const item of device.checks){
      if(!VERDICTS.has(item.result))fail("DEVICE_VERDICT_INVALID");
      if(item.result==="NOT_TESTED"){
        deviceSummary.notTested++;
        if((item.evidenceRefs?.length??0)!==0||item.evidenceSHA256)fail("UNTESTED_DEVICE_EVIDENCE");
        continue;
      }
      deviceSummary[item.result==="PASS"?"pass":"fail"]++;
      if(!nonempty(item.actualObservation))fail("DEVICE_OBSERVATION_REQUIRED");
      mark(item.evidenceRefs,"DEVICE");
      if(!HASH.test(item.evidenceSHA256)||
         index.get(item.evidenceRefs[0]).sha256!==item.evidenceSHA256)fail("DEVICE_EVIDENCE_DIGEST_MISMATCH");
    }
    claimStatus(device.status,deviceSummary.pass,deviceSummary.fail,15,"DEVICE");
    if(deviceSummary.pass||deviceSummary.fail){
      const actor=device.operator,hardware=device.device;
      if(!record(actor)||!nonempty(actor.label)||!validDate(actor.observedAt)||
         !record(hardware)||!nonempty(hardware.model)||!nonempty(hardware.os)||
         !nonempty(hardware.browser)||!nonempty(hardware.locale)||
         hardware.installedPwa!==true||!nonempty(device.origin)||
         !/^https:\/\/[^/\s]+(?:\/[^\s]*)?$/.test(device.origin)||
         /^https:\/\/(?:www\.)?thiepn\.dev\/japanese(?:\/|$)/.test(device.origin))
         fail("ACTUAL_STAGING_DEVICE_IDENTITY_REQUIRED");
      const witnessRef=evidenceRef(actor.attestationEvidenceRef);
      if(index.get(witnessRef)?.kind!=="attestation")fail("DEVICE_WITNESS_ATTESTATION_REQUIRED");
      mark([witnessRef],"DEVICE_ATTESTATION");
      deviceSummary.identityClaim="SELF_DECLARED_WITH_HASHED_ATTESTATION_NOT_AUTHENTICATED";
    }
  }
  if(index.size>0){
    if(reviewer===null&&device===null)fail("UNREFERENCED_EVIDENCE");
    for(const ref of index.keys())if(!referenced.has(ref))fail("UNREFERENCED_EVIDENCE");
  }
  const unresolved=UNRESOLVED.filter((id)=>{
    const item=reviewer?.caseReviews.find((x)=>x.id===id);
    return item?.verdict!=="PASS";
  });
  const observedDefects=reviewSummary.fail+deviceSummary.fail;
  const missing=reviewSummary.notTested+deviceSummary.notTested;
  return {
    schema:"thiepn-japanese-f5-furigana-intake-receipt",
    schemaVersion:1,candidateCommit,sourceSHA256:packet.source.sourceSHA256,
    packetCases:caseIds.length,evidenceFilesHashed:index.size,
    reviewer:reviewSummary,device:deviceSummary,
    mandatoryUnresolvedCaseIds:unresolved,
    observedDefects,missingChecks:missing,
    structuralIntake:"VALIDATED_BYTES_ONLY",
    reviewerIndependenceAuthenticated:false,
    primarySourceAuthenticityEstablished:false,
    physicalDeviceIndependentlyWitnessed:false,
    visual42Cases126ImagesAccepted:false,
    realAccountOAuthAccepted:false,
    humanAcceptanceGranted:false,
    P11:"HOLD",J21:"NOT_TESTED",J22:"HOLD",P21:"HOLD",P22:"HOLD",
    mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
    decision:"NO_GO_INDEPENDENT_OPERATOR_AND_OWNER_GATES_REQUIRED"
  };
}
function parseJson(p,max=3_000_000){
  const b=fs.readFileSync(p);
  if(b.length===0||b.length>max)fail("JSON_FILE_SIZE");
  try{return JSON.parse(b.toString("utf8"))}catch{fail("INVALID_JSON")}
}
function cli(){
  const args=process.argv.slice(2);
  const options=new Map();
  for(let i=0;i<args.length;i+=2){
    if(!["--candidate","--reviewer","--device","--manifest","--evidence-dir"].includes(args[i])||
       !args[i+1]||options.has(args[i]))fail("CLI_OPTIONS");
    options.set(args[i],args[i+1]);
  }
  const candidateCommit=options.get("--candidate");
  const packet=parseJson(path.join(ROOT,"docs/furigana/f4-cases.json"),1_000_000);
  const reviewer=options.has("--reviewer")?parseJson(options.get("--reviewer")):null;
  const device=options.has("--device")?parseJson(options.get("--device")):null;
  const manifest=options.has("--manifest")?parseJson(options.get("--manifest")):null;
  const receipt=inspectFuriganaEvidence({candidateCommit,packet,reviewer,device,manifest,evidenceDir:options.get("--evidence-dir")??null});
  process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{cli()}catch(e){process.stderr.write(String(e.message)+"\n");process.exitCode=1}
}
