import {expect,test} from "@playwright/test";
import {DOMAINS} from "../../scripts/j28-independent-custody.mjs";
import {renderReadinessHtml} from "../../scripts/j30-primary-evidence-audit.mjs";
const report={
 schema:"thiepn-japanese-j30-signoff-readiness",version:1,
 candidateCommit:"a".repeat(40),j27ReportSha256:"b".repeat(64),
 j28ReportSha256:"c".repeat(64),j29ReportSha256:"d".repeat(64),chainRoot:"e".repeat(64),
 acceptedOriginalVisualCases:0,acceptedOriginalPngs:0,
 domains:DOMAINS.map(kind=>({kind,status:"OPEN",sourceBytes:"NOT_VERIFIED_BY_CI",
  witnessIdentity:"NOT_VERIFIED_BY_CI",operatorAcceptance:false})),
 unresolvedDiscrepancies:["No authenticated external original evidence","Human review remains missing"],
 signoffReadiness:"NOT_READY",humanAcceptanceGranted:false,
 mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:"BLOCKED_PRIMARY_EVIDENCE_AUDIT_AND_HUMAN_SIGNOFF"
};
test("J30 human signoff workbench lists nine OPEN gates and no authorization action",async({page})=>{
 await page.setContent(renderReadinessHtml(report));
 await expect(page.getByRole("heading",{name:"Japanese J30 — signoff readiness"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("BLOCKED");
 await expect(page.getByRole("table")).toBeVisible();
 await expect(page.getByRole("row")).toHaveCount(10);
 await expect(page.getByText("0 / 42 cases")).toBeVisible();
 await expect(page.getByText("0 / 126 images")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Human handoff"})).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("textbox").count()).toBe(0)
});
test("J30 independent operator report reflows at 320px and 200% zoom",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderReadinessHtml(report));
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.evaluate(()=>{document.documentElement.style.zoom="2"});
 expect(await overflow()).toBeLessThanOrEqual(1);
 await expect(page.getByRole("status")).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0)
});
