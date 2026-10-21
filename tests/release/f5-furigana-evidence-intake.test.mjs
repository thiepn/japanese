import {describe,it,expect} from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {inspectFuriganaEvidence} from "../../scripts/f5-furigana-evidence-intake.mjs";

const DIR=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=(p)=>JSON.parse(fs.readFileSync(path.join(DIR,"docs/furigana",p),"utf8"));
const packet=read("f4-cases.json");
const templateReview=read("f4-review-submission.template.json");
const templateDevice=read("f4-device-witness.template.json");
const SHA="2ba4b5eb4df6a1b9187fe3cb103767c392af2e2a";
const digest=(value)=>createHash("sha256").update(value).digest("hex");
const copy=(value)=>JSON.parse(JSON.stringify(value));
const inspect=(options={})=>inspectFuriganaEvidence({candidateCommit:SHA,packet,...options});
const setup=()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"japanese-f5-evidence-"));
  const add=(ref,bytes,kind="observation")=>{
    const target=path.join(dir,ref);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,bytes);
    return {ref,sha256:digest(bytes),sizeBytes:bytes.length,kind};
  };
  const manifest={schema:"thiepn-japanese-f5-evidence-manifest",schemaVersion:1,candidateCommit:SHA,files:[]};
  return {dir,manifest,add,cleanup:()=>fs.rmSync(dir,{recursive:true,force:true})};
};
function claimReview(s,manifest){
  const r=copy(templateReview);
  r.candidateCommit=SHA;
  r.status="IN_PROGRESS";
  r.reviewer={
    label:"SYNTHETIC TEST FIXTURE — NOT A REAL REVIEWER",
    role:"test-only",independentFromImplementation:true,
    reviewedAt:"2026-10-11T20:00:00Z",consentToShareEvidence:true,
    independenceEvidenceRef:"attest/reviewer.txt"
  };
  const c=r.caseReviews.find(x=>x.id==="sentence/sentence-a1-001");
  c.verdict="PASS";
  c.observedReading="synthetic value, not authentic Japanese";
  c.reason="synthetic byte validation test — not acceptance";
  c.evidenceRefs=["notes/sentence.txt"];
  return r;
}
describe("F5 fail-closed furigana evidence intake",()=>{
  it("keeps empty source-locked reviewer and physical witness at 240+15 NOT_TESTED",()=>{
    const r=inspect();
    expect(r.packetCases).toBe(240);
    expect(r.reviewer).toMatchObject({pass:0,fail:0,notTested:240,status:"NOT_PROVIDED"});
    expect(r.device).toMatchObject({pass:0,fail:0,notTested:15,status:"NOT_PROVIDED"});
    expect(r.mandatoryUnresolvedCaseIds).toEqual([
      "sentence/sentence-a1-040","sentence/sentence-a1-043","sentence/sentence-a1-072"
    ]);
    expect(r.decision).toBe("NO_GO_INDEPENDENT_OPERATOR_AND_OWNER_GATES_REQUIRED");
    expect(r.releaseAuthorized).toBe(false);

  });

  it("rejects unsigned/unpinned template rather than endorsing it",()=>{
    expect(()=>inspect({reviewer:templateReview})).toThrow(/F5_REVIEWER_NOT_PINNED/);
    expect(()=>inspect({device:templateDevice})).toThrow(/F5_DEVICE_NOT_PINNED/);
    expect(()=>inspectFuriganaEvidence({candidateCommit:"0".repeat(40),packet})).not.toThrow();
    expect(()=>inspectFuriganaEvidence({candidateCommit:"bad",packet})).toThrow(/F5_EXACT_CANDIDATE_REQUIRED/);
  });

  it("accepts pinned empty worksheets only as untested, never as PASS",()=>{
    const r=copy(templateReview),d=copy(templateDevice);
    r.candidateCommit=SHA;d.candidateCommit=SHA;
    const result=inspect({reviewer:r,device:d});
    expect(result.missingChecks).toBe(255);
    expect(result.reviewerIndependenceAuthenticated).toBe(false);
    expect(result.physicalDeviceIndependentlyWitnessed).toBe(false);
    expect(result.humanAcceptanceGranted).toBe(false);
    expect(result.releaseAuthorized).toBe(false);
  });

  it("rejects duplicate or invalid IDs, fake approval, mismatched digest and undocumented claims",()=>{
    const r=copy(templateReview);r.candidateCommit=SHA;
    r.caseReviews[1].id=r.caseReviews[0].id;
    expect(()=>inspect({reviewer:r})).toThrow(/F5_REVIEW_DUPLICATE/);
    const x=copy(templateReview);x.candidateCommit=SHA;
    x.reconciliation.releaseAuthorized=true;
    expect(()=>inspect({reviewer:x})).toThrow(/F5_REVIEWER_NOT_PINNED_OR_APPROVAL_CLAIMED/);
    const y=copy(templateReview);y.candidateCommit=SHA;
    y.source.sourceSHA256="f".repeat(64);
    expect(()=>inspect({reviewer:y})).toThrow(/F5_REVIEWER_SOURCE_MISMATCH/);
    const z=copy(templateReview);z.candidateCommit=SHA;
    z.caseReviews[0].verdict="PASSED";
    expect(()=>inspect({reviewer:z})).toThrow(/F5_INVALID_REVIEW_VERDICT/);
    const w=copy(templateReview);w.candidateCommit=SHA;
    w.caseReviews[0].verdict="PASS";
    expect(()=>inspect({reviewer:w})).toThrow(/F5_REVIEW_NOT_DOCUMENTED/);
  });

  it("hashes every referenced raw byte, requires claimed reviewer independence and never trusts a PASS",()=>{
    const f=setup();
    try{
      f.manifest.files.push(f.add("notes/sentence.txt",Buffer.from("Fixture only: synthetic source observation\n")));
      f.manifest.files.push(f.add("attest/reviewer.txt",Buffer.from("Fixture only: unsigned test attestation\n"),"attestation"));
      const r=claimReview(null,null);
      const result=inspect({reviewer:r,manifest:f.manifest,evidenceDir:f.dir});
      expect(result.reviewer.pass).toBe(1);
      expect(result.reviewer.notTested).toBe(239);
      expect(result.reviewer.identityClaim).toMatch(/NOT_AUTHENTICATED/);
      expect(result.reviewerIndependenceAuthenticated).toBe(false);
      expect(result.releaseAuthorized).toBe(false);
      expect(result.mandatoryUnresolvedCaseIds).toHaveLength(3);
      r.reviewer.independentFromImplementation=false;
      expect(()=>inspect({reviewer:r,manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_REVIEWER_INDEPENDENCE_CLAIM_MISSING/);
      r.reviewer.independentFromImplementation=true;
      fs.writeFileSync(path.join(f.dir,"notes/sentence.txt"),"tampered fixture");
      expect(()=>inspect({reviewer:r,manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_EVIDENCE_DIGEST_MISMATCH/);
    }finally{f.cleanup()}
  });

  it("rejects path traversal, symlink custody and unreferenced files",()=>{
    const f=setup();
    try{
      f.manifest.files.push({ref:"../outside.txt",sha256:digest("x"),sizeBytes:1,kind:"observation"});
      expect(()=>inspect({manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_UNSAFE_EVIDENCE_REF/);
      f.manifest.files=[f.add("orphan.txt",Buffer.from("not referenced"))];
      expect(()=>inspect({manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_UNREFERENCED_EVIDENCE/);
      fs.symlinkSync(path.join(f.dir,"orphan.txt"),path.join(f.dir,"link.txt"));
      f.manifest.files=[{ref:"link.txt",sha256:digest("not referenced"),sizeBytes:14,kind:"observation"}];
      expect(()=>inspect({manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_SYMLINK_EVIDENCE/);
    }finally{f.cleanup()}
  });

  it("requires exact device metadata, referenced SHA-256 and separate witness attestation",()=>{
    const f=setup();
    try{
      const x=f.add("device/screen.txt",Buffer.from("synthetic simulated device, NOT physical witness"));
      f.manifest.files.push(x);
      f.manifest.files.push(f.add("attest/device.txt",Buffer.from("synthetic device witness fixture"),"attestation"));
      const d=copy(templateDevice);
      d.candidateCommit=SHA;d.status="IN_PROGRESS";
      d.operator={label:"SYNTHETIC — NOT A REAL WITNESS",observedAt:"2026-10-11T20:00:00Z",attestationEvidenceRef:"attest/device.txt"};
      d.device={model:"Synthetic test model",os:"Synthetic OS",browser:"Synthetic browser",locale:"ja-JP",installedPwa:true};
      d.origin="https://staging.example.test/japanese/";
      const entry=d.checks[0];entry.result="PASS";entry.actualObservation="synthetic only";entry.evidenceRefs=[x.ref];entry.evidenceSHA256=x.sha256;
      const result=inspect({device:d,manifest:f.manifest,evidenceDir:f.dir});
      expect(result.device).toMatchObject({pass:1,notTested:14});
      expect(result.physicalDeviceIndependentlyWitnessed).toBe(false);
      expect(result.releaseAuthorized).toBe(false);
      entry.evidenceSHA256="0".repeat(64);
      expect(()=>inspect({device:d,manifest:f.manifest,evidenceDir:f.dir})).toThrow(/F5_DEVICE_EVIDENCE_DIGEST_MISMATCH/);
    }finally{f.cleanup()}
  });

  it("runs the read-only CLI inventory without modifying source or gate records",()=>{
    const stdout=execFileSync(process.execPath,[
      path.join(DIR,"scripts/f5-furigana-evidence-intake.mjs"),"--candidate",SHA
    ],{encoding:"utf8"});
    const r=JSON.parse(stdout);
    expect(r.evidenceFilesHashed).toBe(0);
    expect(r.releaseAuthorized).toBe(false);
    expect(r.decision).toBe("NO_GO_INDEPENDENT_OPERATOR_AND_OWNER_GATES_REQUIRED");
  });
});
