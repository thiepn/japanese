import {expect,test} from "@playwright/test";
import {ESCALATION_PLAN,renderTriageHtml} from "../../scripts/j33-acceptance-triage.mjs";

const report={
 schema:"thiepn-japanese-j33-acceptance-triage",version:1,
 candidateCommit:"a".repeat(40),
 priorities:ESCALATION_PLAN.map((p,i)=>({
  discrepancyId:"J31-D"+String(i+1).padStart(2,"0"),...p,
  state:"OPEN",triageState:"AWAITING_ORIGINAL_EVIDENCE",observations:[],
  independentHumanAcceptance:false,releaseImpact:"BLOCKING"
 })),
 reportedObservations:0,openDiscrepancies:9,closedDiscrepancies:0,
 originalVisualCasesHumanAccepted:0,originalPngsHumanAccepted:0,
 signoffReadiness:"NOT_READY",humanAcceptanceGranted:false,mergeAuthorized:false,
 deploymentAuthorized:false,releaseAuthorized:false,
 decision:"BLOCKED_EXTERNAL_HUMAN_AND_PHYSICAL_ACCEPTANCE"
};
test("J33 operator queue exposes nine concrete unresolved domains without authorization controls",async({page})=>{
 await page.setContent(renderTriageHtml(report));
 await expect(page.getByRole("heading",{name:"Japanese J33 — independent acceptance discrepancy triage"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("BLOCKED");
 await expect(page.getByRole("row")).toHaveCount(10);
 await expect(page.getByRole("rowheader")).toHaveCount(9);
 await expect(page.getByText("0 / 42")).toBeVisible();
 await expect(page.getByText("0 / 126")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Separate authorization"})).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("textbox").count()).toBe(0);
});
test("J33 source-only triage stays usable at 320px and two-times zoom",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderTriageHtml(report));
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.evaluate(()=>{document.documentElement.style.zoom="2"});
 expect(await overflow()).toBeLessThanOrEqual(1);
 await expect(page.getByRole("status")).toBeVisible();
});
test("J33 mobile, dark-mode and keyboard inspection preserves nine exact OPEN gate cells",async({page})=>{
 await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
 await page.setContent(renderTriageHtml(report));
 await expect(page.getByRole("table")).toBeVisible();
 await expect(page.getByRole("cell",{name:"OPEN",exact:true})).toHaveCount(9);
 await page.keyboard.press("Tab");
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("link").count()).toBe(0);
});
