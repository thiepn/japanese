import {expect,test} from "@playwright/test";
import {DOMAINS} from "../../scripts/j28-independent-custody.mjs";
import {renderOperatorHtml} from "../../scripts/j31-operator-handoff.mjs";
const report={schema:"thiepn-japanese-j31-operator-handoff",version:1,
 candidateCommit:"a".repeat(40),j27ReportSha256:"b".repeat(64),
 j28ReportSha256:"c".repeat(64),j29ReportSha256:"d".repeat(64),
 j30ReportSha256:"e".repeat(64),chainRoot:"f".repeat(64),
 openDiscrepancies:9,closedDiscrepancies:0,
 originalVisualCasesHumanAccepted:0,originalPngsHumanAccepted:0,
 discrepancies:DOMAINS.map((kind,i)=>({id:"J31-D"+String(i+1).padStart(2,"0"),kind,state:"OPEN",
  closureState:"OPEN",sourceAuthentication:"NOT_AVAILABLE_IN_CI",
  independentHumanAcceptance:"NOT_RECEIVED",
  nextAction:"Obtain genuine independent human verification for "+kind,
  decisionImpact:"BLOCKING"})),
 signoffReadiness:"NOT_READY",simulationDecision:"DENY",
 simulationIsRealAuthorization:false,humanAcceptanceGranted:false,
 mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:"BLOCKED_OPERATOR_HANDOFF_AND_MANUAL_RELEASE_AUTHORITY"
};
test("J31 operator handoff has nine visible OPEN gaps, explicit actions and no release controls",async({page})=>{
 await page.setContent(renderOperatorHtml(report));
 await expect(page.getByRole("heading",{name:"Japanese J31 — release decision simulation"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("DENIED");
 await expect(page.getByRole("table")).toBeVisible();
 await expect(page.getByRole("row")).toHaveCount(10);
 await expect(page.getByText("0 / 42 cases")).toBeVisible();
 await expect(page.getByText("0 / 126 PNGs")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Custody and authority"})).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("textbox").count()).toBe(0);
 expect(await page.getByRole("link").count()).toBe(0);
});
test("J31 offline handoff reflows without document overflow at 320px and 200% zoom",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderOperatorHtml(report));
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.evaluate(()=>{document.documentElement.style.zoom="2"});
 expect(await overflow()).toBeLessThanOrEqual(1);
 await expect(page.getByRole("status")).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
});
test("J31 operator audit remains readable under dark colors and keyboard navigation",async({page})=>{
 await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
 await page.setContent(renderOperatorHtml(report));
 await expect(page.getByRole("table")).toBeVisible();
 const tables=await page.getByRole("table").count();
 expect(tables).toBe(1);
 const statuses=await page.getByRole("cell",{name:"OPEN"}).count();
 expect(statuses).toBe(9);
 await page.keyboard.press("Tab");
 expect(await page.getByRole("button").count()).toBe(0);
});
