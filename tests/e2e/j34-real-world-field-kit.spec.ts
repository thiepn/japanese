import {expect,test} from "@playwright/test";
import fs from "node:fs/promises";
import {createJ34FieldKit,renderJ34FieldKit} from "../../scripts/j34-real-world-field-kit.mjs";
const sha="a".repeat(40);
const kinds=["realAccountOAuth","physicalAndroidAndTalkBack","independentJapaneseReview","independentP11LearnerReview","exactVisualArchive","independentVisualAccessibilityReview","independentAccessibilitySignoff","exactStagingIdentity","testedRollback"];
const triage={
 schema:"thiepn-japanese-j33-evidence-triage",version:1,candidateCommit:sha,
 j32ReportSha256:"b".repeat(64),purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
 decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE",summary:{open:9,closed:0,originalCasesAccepted:0,originalPngsAccepted:0},
 entries:kinds.map((kind,i)=>({kind,discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),state:"OPEN",humanApproved:false,releaseImpact:"BLOCKING"})),
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false
};
const html=renderJ34FieldKit(createJ34FieldKit(triage,sha));
test("J34 field-session workbench exports bounded observed notes without human signoff",async({page})=>{
 await page.setContent(html);
 await expect(page.getByRole("heading",{name:"Japanese J34 — physical field session"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("release BLOCKED");
 await page.locator("#observed").fill(sha);
 await page.locator('select[data-check="accountEntry"]').selectOption("OBSERVED_FAIL");
 await page.locator('select[data-check="microphoneRecording"]').selectOption("OBSERVED_PASS");
 const note=page.locator('select[data-check="accountEntry"]').locator("xpath=ancestor::*[contains(@class,'check')]").locator("textarea");
 await note.fill("Callback returned signed out; reproduce with approved disposable test account");
 const waiter=page.waitForEvent("download");
 await page.getByRole("button",{name:"Export unverified session JSON"}).click();
 const download=await waiter;
 const obj=JSON.parse(await fs.readFile(await download.path() as string,"utf8"));
 expect(obj.candidateCommit).toBe(sha);
 expect(obj.buildIdentityMatched).toBe(true);
 expect(obj.observations.find((o:{check:string})=>o.check==="accountEntry").status).toBe("OBSERVED_FAIL");
 expect(obj.observations.find((o:{check:string})=>o.check==="microphoneRecording").status).toBe("OBSERVED_PASS");
 expect(obj.independentlyWitnessed).toBe(false);
 expect([obj.releaseAuthorized,obj.deploymentAuthorized,obj.mergeAuthorized,obj.humanAcceptanceGranted]).toEqual([false,false,false,false]);
 await expect(page.locator("#export-info")).toContainText("No approval");
});
test("J34 wrong deployment SHA prevents exporting a false positive",async({page})=>{
 await page.setContent(html);
 await page.locator("#observed").fill("c".repeat(40));
 await page.locator('select[data-check="accountEntry"]').selectOption("OBSERVED_PASS");
 await expect(page.getByRole("status")).toContainText("STOP");
 const waiter=page.waitForEvent("download");
 await page.getByRole("button",{name:"Export unverified session JSON"}).click();
 const data=JSON.parse(await fs.readFile(await (await waiter).path() as string,"utf8"));
 expect(data.buildIdentityMatched).toBe(false);
 expect(data.observations.every((o:{status:string})=>o.status==="NOT_TESTED")).toBe(true);
});
test("J34 field kit survives 320px/200 percent, dark mode, reduced motion and keyboard",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
 await page.setContent(html);
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.evaluate(()=>document.documentElement.style.zoom="2");
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.keyboard.press("Tab");
 await expect(page.locator("#observed")).toBeVisible();
 await expect(page.getByRole("status")).toContainText("BLOCKED");
});
