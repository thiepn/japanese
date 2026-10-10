import {expect,test} from "@playwright/test";
import {DOMAINS} from "../../scripts/j28-independent-custody.mjs";
import {renderReconciliationHtml} from "../../scripts/j29-witness-reconciliation.mjs";

const report={
 schema:"thiepn-japanese-j29-operator-reconciliation",version:1,
 candidateCommit:"a".repeat(40),j27ReportDigest:"b".repeat(64),j28WorkbenchDigest:"c".repeat(64),
 j28MachineChainRoot:"d".repeat(64),independentlyAcceptedVisualCases:0,independentlyAcceptedOriginalPngs:0,
 externalWitnessPacket:"NOT_SUPPLIED_TO_CI",releaseAuthorityContinuity:"NOT_VERIFIED_BY_CI",
 domains:DOMAINS.map(kind=>({kind,status:"OPEN",externalObservation:"NOT_SUPPLIED_TO_CI",independentReviewer:"NOT_VERIFIED",humanAcceptance:false})),
 verifiedExternalAcceptanceDomains:0,remainingExternalAcceptanceDomains:9,
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:"BLOCKED_WITNESSED_ACCEPTANCE_AND_RELEASE_AUTHORITY"
};

test("J29 read-only operator view exposes nine OPEN decisions with no release controls",async({page})=>{
 await page.setContent(renderReconciliationHtml(report));
 await expect(page.getByRole("heading",{name:"Japanese J29 · witness reconciliation"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("BLOCKED");
 await expect(page.getByRole("table")).toBeVisible();
 await expect(page.getByRole("row")).toHaveCount(10);
 await expect(page.getByText("0 / 42")).toBeVisible();
 await expect(page.getByText("0 / 126")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Release authority"})).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("textbox").count()).toBe(0);
});
test("J29 offline workbench is responsive at 320px and 200% zoom",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderReconciliationHtml(report));
 let overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await page.evaluate(()=>{document.documentElement.style.zoom="2"});
 overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await expect(page.getByRole("status")).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
});
