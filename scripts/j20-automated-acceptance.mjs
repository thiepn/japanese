import {existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";

const sha=process.env.J20_CANDIDATE_SHA;
if(!sha||!/^[a-f0-9]{40}$/.test(sha)){
  throw new Error("J20_EXACT_HEAD_REQUIRED");
}
const requiredSpecs=[
  "tests/e2e/j20-device-recovery.spec.ts",
  "tests/local-db/j20-recovery.test.ts",
  "tests/e2e/pwa.spec.ts",
  "tests/e2e/j17-account-panel.spec.ts",
];
for(const file of requiredSpecs){
  if(!existsSync(file))throw new Error("J20_MISSING_REGRESSION_SPEC:"+file);
}
const manifest=JSON.parse(readFileSync("release/p21-device-acceptance.json","utf8"));
const android=JSON.parse(readFileSync("release/j16b-android-session-template.json","utf8"));
const visual=JSON.parse(readFileSync("release/j15d-d5-visual-review.json","utf8"));
const report={
  schema:"thiepn-japanese-j20-automated-qualification",
  schemaVersion:1,
  candidateCommit:sha,
  generatedAt:new Date().toISOString(),
  automated:{
    status:"passed",
    basis:"CI sequential prerequisite: typecheck, unit tests, production build and full Playwright suite completed before this script",
    specs:requiredSpecs,
    browserProfiles:["desktop-chromium","android-mobile-emulation","compact-mobile-emulation"],
    scope:["offline reload and local answers","simulated resume","mobile rotation and 200% text","keyboard/reduced motion","explicit OAuth handoff","offline backup/restore and outbox ownership"]
  },
  human:{
    status:"pending",
    physicalAndroid:{
      status:"not_verified_by_ci",
      sourceManifestStatus:manifest.status
    },
    installedPwaAndRealOAuth:{
      status:"not_verified_by_ci",
      sourceManifestStatus:android.status
    },
    independentVisual:{
      status:"not_verified_by_ci",
      sourceManifestStatus:visual.status
    },
    nativeAudioMicrophoneAndTalkBack:"not_verified_by_ci",
  },
  releaseDecision:"not_authorized"
};
mkdirSync("artifacts",{recursive:true});
writeFileSync(join("artifacts","j20-automated-qualification.json"),JSON.stringify(report,null,2)+"\n");
console.log("J20 automated checks documented for "+sha+"; physical and independent human gates remain pending");
