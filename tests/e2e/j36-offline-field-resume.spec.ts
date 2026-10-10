import {test,expect} from "@playwright/test";
import {createJ34FieldKit,renderJ34FieldKit} from "../../scripts/j34-real-world-field-kit.mjs";
const sha="a".repeat(40);
const kinds=["realAccountOAuth","physicalAndroidAndTalkBack","independentJapaneseReview","independentP11LearnerReview","exactVisualArchive","independentVisualAccessibilityReview","independentAccessibilitySignoff","exactStagingIdentity","testedRollback"];
const j33={schema:"thiepn-japanese-j33-evidence-triage",version:1,candidateCommit:sha,
 j32ReportSha256:"b".repeat(64),purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
 decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE",
 summary:{open:9,closed:0,originalCasesAccepted:0,originalPngsAccepted:0},
 entries:kinds.map((kind,i)=>({kind,discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),state:"OPEN",humanApproved:false,releaseImpact:"BLOCKING"})),
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false};
const kit=createJ34FieldKit(j33,sha),html=renderJ34FieldKit(kit);
const sample=()=>({
 schema:"thiepn-japanese-j34-operator-observation-export",version:1,candidateCommit:sha,
 j33ReportSha256:kit.j33ReportSha256,observedCommit:sha,buildIdentityMatched:true,operatorAlias:"device-A",
 recordedAt:"2026-10-10T12:00:00.000Z",independentlyWitnessed:false,
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 finalDecision:"UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY",
 observations:kit.groups.flatMap(g=>g.checks.map(c=>({group:g.id,check:c.id,status:"NOT_TESTED",note:"",evidenceRef:""})))
});
test("J36 resumes only a matching, local unverified session and reexports without approval",async({page})=>{
 await page.setContent(html);
 const record=sample();record.observations[0].status="OBSERVED_FAIL";record.observations[0].note="Callback returned signed out; no identifying data";
 record.observations[7].status="OBSERVED_PASS";
 await page.locator("#resume").setInputFiles({name:"offline.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(record))});
 await expect(page.locator("#resume-info")).toContainText("Prior unverified notes restored locally");
 await expect(page.locator("#status")).toContainText("2 / 32");
 await expect(page.locator('select[data-check="accountEntry"]')).toHaveValue("OBSERVED_FAIL");
 await expect(page.locator("#operator")).toHaveValue("device-A");
 const d=page.waitForEvent("download");await page.getByRole("button",{name:"Export unverified session JSON"}).click();
 const dl=await d;const f=await dl.path();if(!f)throw Error("download not saved");
 const restored=JSON.parse(await (await import("node:fs/promises")).readFile(f,"utf8"));
 expect(restored.observations[0].status).toBe("OBSERVED_FAIL");
 expect(restored.observations[0].note).toBe(record.observations[0].note);
 expect([restored.independentlyWitnessed,restored.humanAcceptanceGranted,restored.mergeAuthorized,restored.deploymentAuthorized,restored.releaseAuthorized]).toEqual([false,false,false,false,false]);
});
test("J36 refuses cross-head, forged approval and truncated session without changing controls",async({page})=>{
 await page.setContent(html);
 const wrong=sample();wrong.candidateCommit="c".repeat(40);wrong.observations[0].status="OBSERVED_PASS";
 await page.locator("#resume").setInputFiles({name:"wrong.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(wrong))});
 await expect(page.locator("#resume-info")).toContainText("Import rejected");
 await expect(page.locator('select[data-check="accountEntry"]')).toHaveValue("NOT_TESTED");
 const forged=sample();forged.releaseAuthorized=true;forged.observations[0].status="OBSERVED_PASS";
 await page.locator("#resume").setInputFiles({name:"forged.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(forged))});
 await expect(page.locator("#resume-info")).toContainText("Import rejected");
 const incomplete=sample();incomplete.observations.pop();
 await page.locator("#resume").setInputFiles({name:"truncated.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(incomplete))});
 await expect(page.locator("#resume-info")).toContainText("Import rejected");
 await expect(page.locator('select[data-check="accountEntry"]')).toHaveValue("NOT_TESTED");
});
test("J36 local resume respects 320px zoom, dark mode, reduced motion and keyboard",async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
 await page.setContent(html);
 await page.locator("#resume").setInputFiles({name:"session.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(sample()))});
 await expect(page.locator("#resume-info")).toContainText("notes restored");
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);await page.evaluate(()=>document.documentElement.style.zoom="2");
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.keyboard.press("Tab");await expect(page.locator("#status")).toContainText("release BLOCKED");
});
