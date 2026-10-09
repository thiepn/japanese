import {afterAll,beforeAll,describe,expect,it} from "vitest";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {PNG} from "pngjs";
import {auditAndBuildPacket} from "../../scripts/j21-language-audit.mjs";
import {auditArchive,blankReview} from "../../scripts/j22-visual-accessibility.mjs";
import {visualCaseNames,BASELINE} from "../../scripts/j16c-build-visual-review.mjs";
import {pendingReadiness,inspectBundle,REQUIRED_ROLES,ANDROID_CHECKS} from "../../scripts/j24-operator-evidence-qualification.mjs";

const SHA="f".repeat(40),H="sha256:"+"a".repeat(64);
let root,bundle,roster,packet;
const hash=x=>crypto.createHash("sha256").update(x).digest("hex");
function setupFixtures(){
  const seed={sourceIds:["thiepn-original"],
    grammar:[{id:"a",label:"〜ながら",sourceIds:["thiepn-original"]}],
    lexemes:[{id:"b",canonicalForm:"日本語",sourceIds:["thiepn-original"]}]};
  packet=auditAndBuildPacket({
    candidateCommit:SHA,manifest:{sources:["thiepn-original"]},
    registry:{sources:[{id:"thiepn-original",publicExport:true,license:"original"}]},
    seeds:[{filename:"fixture.json",raw:JSON.stringify(seed),data:seed}]
  }).packet;
  root=fs.mkdtempSync(path.join(os.tmpdir(),"j24-fixture-"));
  fs.mkdirSync(path.join(root,"screenshots"));
  const p=new PNG({width:16,height:16});
  for(let i=0;i<p.data.length;i+=4){
    p.data[i]=i%256;p.data[i+1]=(i*13)%256;p.data[i+2]=(i*97)%256;p.data[i+3]=255;
  }
  const png=PNG.sync.write(p);
  for(const name of visualCaseNames())for(const kind of ["reference","candidate","diff"]){
    fs.writeFileSync(path.join(root,"screenshots",name+"_"+kind+".png"),png);
  }
  const report={schema:"thiepn-japanese-j15d-d4-visual-comparison",schemaVersion:1,
    baselineCommit:BASELINE,candidateCommit:SHA,passed:true,
    cases:visualCaseNames().map(name=>({name,passed:true,changedPixelRatio:0}))};
  const visualPacket=auditArchive({candidateCommit:SHA,report,readImage:()=>png});
  const languageReview={
    schema:"thiepn-japanese-j21-language-review-submission",schemaVersion:1,
    candidateCommit:SHA,packetSha256:packet.packetSha256,
    reviewer:{label:"Synthetic language tester (unit fixture)",role:"teacher",externalToProject:true,
      reviewedAt:"2026-10-10T10:00:00Z",independentEvidenceRef:H},
    itemReviews:packet.items.map(x=>({key:x.key,verdict:"accepted",
      scores:{accuracy:4,naturalness:4,register:4,pedagogy:4},notes:""})),
    decision:"approve",blockingIssues:[]
  };
  const visualReview=blankReview(visualPacket);
  visualReview.reviewer={name:"Synthetic visual tester (unit fixture)",role:"visual-reviewer",
    independentToProject:true,reviewedAt:"2026-10-10T10:00:00Z",evidenceRef:H};
  visualReview.cases=visualReview.cases.map(c=>({...c,status:"pass"}));
  for(const row of Object.values(visualReview.accessibility)){
    row.status="pass";row.evidenceRef=H;
  }
  visualReview.decision="reviewed-no-defects";
  const checks=Object.fromEntries(ANDROID_CHECKS.map(k=>[k,{
    status:"pass",verifiedAt:"2026-10-10T10:00:00Z",evidenceRef:H,observation:"Synthetic fixture"
  }]));
  const data={
    exactVisualArchive:report,
    physicalAndroidAndTalkBack:{
      schema:"thiepn-japanese-j16b-android-session",candidateCommit:SHA,status:"pass",
      sessionId:"synthetic-test-only",completedAt:"2026-10-10T10:00:00Z",
      device:{model:"Fixture device",androidVersion:"fixture",browserVersion:"fixture",installedPwa:true},
      accountSso:{status:"pass"},checks
    },
    realAccountOAuth:{
      schema:"thiepn-japanese-j24-oauth-session",candidateCommit:SHA,status:"pass",provider:"THIEPN Account",
      firstPartyClientRegistered:true,chromeCallbackVerified:true,installedPwaCallbackVerified:true,
      stateAndNonceVerified:true,sessionPersistenceVerified:true,signOutVerified:true,
      tokensRedacted:true,testedAt:"2026-10-10T10:00:00Z",evidenceRef:H
    },
    independentJapaneseReview:languageReview,
    independentVisualAccessibilityReview:visualReview,
    independentAccessibilitySignoff:{
      schema:"thiepn-japanese-j24-accessibility-signoff",candidateCommit:SHA,status:"pass",
      talkBackVerified:true,keyboardVerified:true,textScaleVerified:true,
      reviewedAt:"2026-10-10T10:00:00Z",evidenceRef:H
    },
    independentP11LearnerReview:{
      schema:"thiepn-japanese-j24-p11-review",candidateCommit:SHA,status:"pass",
      externalReviewComplete:true,reviewedAt:"2026-10-10T10:00:00Z",evidenceRef:H
    },
    exactStagingIdentity:{
      schema:"thiepn-japanese-j24-staging-identity",candidateCommit:SHA,status:"pass",
      deployedCommit:SHA,releaseMetaCommit:SHA,url:"https://example.invalid/staging",
      observedAt:"2026-10-10T10:00:00Z",evidenceRef:H
    },
    testedRollback:{
      schema:"thiepn-japanese-j24-rollback-drill",candidateCommit:SHA,tested:true,
      preRollbackCommit:SHA,restoredCommit:"a".repeat(40),
      performedAt:"2026-10-10T10:00:00Z",evidenceRef:H
    }
  };
  const keys={};
  roster={schema:"thiepn-japanese-j24-external-trust-roster",signers:[]};
  bundle={schema:"thiepn-japanese-j24-independent-evidence-bundle",
    candidateCommit:SHA,releaseAuthorized:false,humanApprovalGranted:false,records:{}};
  for(const [kind,value] of Object.entries(data)){
    const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
    const signerId="fixture-"+kind;
    keys[kind]=privateKey;
    roster.signers.push({id:signerId,publicKeyPem:publicKey.export({format:"pem",type:"spki"}),
      roles:[REQUIRED_ROLES[kind]],independentToProject:true,revoked:false});
    const file="evidence-"+kind+".json";
    const bytes=Buffer.from(JSON.stringify(value));
    fs.writeFileSync(path.join(root,file),bytes);
    const entry={status:"submitted",candidateCommit:SHA,file,sha256:hash(bytes),
      imagesDigest:kind==="exactVisualArchive"?hash(Buffer.from(JSON.stringify(visualPacket.imageMeta))):undefined,
      attestation:{signerId,signature:""}};
    const message=JSON.stringify({schema:"thiepn-japanese-j24-detached-evidence-signature",
      candidateCommit:SHA,kind,file,sha256:entry.sha256,
      imagesDigest:entry.imagesDigest??null,signerId});
    entry.attestation.signature=crypto.sign(null,Buffer.from(message),privateKey).toString("base64");
    bundle.records[kind]=entry;
  }
}
beforeAll(setupFixtures);
afterAll(()=>{if(root)fs.rmSync(root,{recursive:true,force:true});});
const inspect=options=>inspectBundle({candidateCommit:SHA,rootDir:root,bundle, keyring:roster,
  languagePacket:packet,...options});
describe("J24 independently provisioned operator intake",()=>{
  it("CI stays blocked even after J23 machine qualification",()=>{
    const x=pendingReadiness(SHA,{
      schema:"thiepn-japanese-j23-release-evidence-reconciliation",candidateCommit:SHA,
      automatedIntegrity:"passed",decision:"BLOCKED_AWAITING_INDEPENDENT_EVIDENCE",
      releaseAuthorized:false
    });
    expect(x.decision).toBe("BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT");
    expect(x.releaseAuthorized).toBe(false);
    expect(x.externalSignaturesVerified).toBe(false);
    expect(Object.keys(REQUIRED_ROLES)).toHaveLength(9);
  });
  it("checks synthetic hash-bound external artifacts and Ed25519 signatures, never approves release",()=>{
    const x=inspect();
    expect(x.locallyHashedEvidenceCount).toBe(9);
    expect(x.signaturesValidAgainstSuppliedRoster).toBe(true);
    expect(x.humanIdentityIndependentlyVerified).toBe(false);
    expect(x.releaseAuthorized).toBe(false);
  });
  it("fails closed when a signed artifact changes after the manifest was signed",()=>{
    const value=fs.readFileSync(path.join(root,bundle.records.realAccountOAuth.file));
    fs.writeFileSync(path.join(root,bundle.records.realAccountOAuth.file),Buffer.concat([value,Buffer.from("\n")]));
    try{expect(()=>inspect()).toThrow(/J24_ARTIFACT_HASH_MISMATCH/);}
    finally{fs.writeFileSync(path.join(root,bundle.records.realAccountOAuth.file),value);}
  });
  it("rejects a swapped exact SHA, missing category or fake release status",()=>{
    const b=structuredClone(bundle);b.records.testedRollback.candidateCommit="0".repeat(40);
    expect(()=>inspect({bundle:b})).toThrow(/J24_RECORD_INCOMPLETE_OR_WRONG_SHA/);
    const c=structuredClone(bundle);delete c.records.realAccountOAuth;
    expect(()=>inspect({bundle:c})).toThrow(/J24_EVIDENCE_CATEGORY_COVERAGE_INVALID/);
    const d=structuredClone(bundle);d.releaseAuthorized=true;
    expect(()=>inspect({bundle:d})).toThrow(/J24_BUNDLE_CANNOT_AUTHORIZE_RELEASE/);
  });
  it("rejects revoked keys and forged reviewer signature",()=>{
    const ring=structuredClone(roster);ring.signers.find(x=>x.id==="fixture-independentJapaneseReview").revoked=true;
    expect(()=>inspect({keyring:ring})).toThrow(/J24_UNTRUSTED_REVIEWER_ROLE/);
    const b=structuredClone(bundle);b.records.exactVisualArchive.attestation.signature="YWJjZA==";
    expect(()=>inspect({bundle:b})).toThrow(/J24_INVALID_SIGNATURE/);
  });
  it("rejects traversal and symlink attempts",()=>{
    const a=structuredClone(bundle);a.records.exactVisualArchive.file="../outside.json";
    expect(()=>inspect({bundle:a})).toThrow(/J24_UNSAFE_EVIDENCE_PATH/);
    const target=path.join(root,"evidence-exactVisualArchive.json");
    const link=path.join(root,"linked.json");
    fs.symlinkSync(target,link);
    try{
      const b=structuredClone(bundle);b.records.exactVisualArchive.file="linked.json";
      expect(()=>inspect({bundle:b})).toThrow(/J24_EVIDENCE_SYMLINK_OR_ESCAPE/);
    }finally{fs.rmSync(link,{force:true});}
  });
  it("rejects PNG archive corruption, tampered review and incomplete real device checks",()=>{
    const imageFile=path.join(root,"screenshots",visualCaseNames()[0]+"_reference.png");
    const raw=fs.readFileSync(imageFile);fs.writeFileSync(imageFile,Buffer.from("corrupt"));
    try{expect(()=>inspect()).toThrow(/J22_VISUAL_ARCHIVE_INVALID/);}
    finally{fs.writeFileSync(imageFile,raw);}
    const b=structuredClone(bundle);
    b.records.exactVisualArchive.imagesDigest="f".repeat(64);
    expect(()=>inspect({bundle:b})).toThrow(/J24_INVALID_SIGNATURE/);
    const other=structuredClone(bundle);
    const android=path.join(root,other.records.physicalAndroidAndTalkBack.file);
    const old=fs.readFileSync(android);
    const changed=JSON.parse(old.toString());changed.checks.screenReaderTalkBack.status="pending";
    fs.writeFileSync(android,JSON.stringify(changed));
    try{expect(()=>inspect({bundle:other})).toThrow(/J24_ARTIFACT_HASH_MISMATCH/);}
    finally{fs.writeFileSync(android,old);}
  });
  it("does not accept an untrusted key roster or a different language packet",()=>{
    expect(()=>inspect({keyring:{schema:"thiepn-japanese-j24-external-trust-roster",signers:[]}})).toThrow(/J24_INDEPENDENT_TRUST_ROSTER_REQUIRED/);
    const wrong=structuredClone(packet);wrong.candidateCommit="e".repeat(40);
    expect(()=>inspect({languagePacket:wrong})).toThrow(/J21_PACKET_DIGEST_MISMATCH|J24_CANDIDATE_MISMATCH/);
  });
});
