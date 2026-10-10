import {expect,test} from "@playwright/test";
import {DOMAINS} from "../../scripts/j28-independent-custody.mjs";
import {REVIEW_PROTOCOL,renderOperatorHtml} from "../../scripts/j32-signoff-intake.mjs";
const report={
 schema:"thiepn-japanese-j32-signoff-intake",version:1,candidateCommit:"a".repeat(40),
 originalCaseSlots:Array.from({length:42},(_,i)=>({id:"VIS-"+String(i+1).padStart(3,"0"),state:"AWAITING_ORIGINAL"})),
 originalPngSlots:Array.from({length:126},(_,i)=>({id:"PNG-"+String(i+1).padStart(3,"0"),state:"AWAITING_ORIGINAL"})),
 domains:DOMAINS.map(kind=>({kind,status:"OPEN",protocol:REVIEW_PROTOCOL[kind],humanAcceptance:false})),
 originalCasesHumanAccepted:0,originalPngsHumanAccepted:0,
 signoffReadiness:"NOT_READY",humanAcceptanceGranted:false,
 mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
 decision:"BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF"
};
test("J32 workbench explains 42/126 original evidence, nine OPEN protocols and no release controls",async({page})=>{
 await page.setContent(renderOperatorHtml(report));
 await expect(page.getByRole("heading",{name:"Japanese J32 — original evidence intake"})).toBeVisible();
 await expect(page.getByRole("status")).toContainText("BLOCKED");
 await expect(page.getByRole("table")).toBeVisible();
 await expect(page.getByRole("row")).toHaveCount(10);
 await expect(page.getByText("0 / 42")).toBeVisible();
 await expect(page.getByText("0 / 126")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Separate human authority"})).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
 expect(await page.getByRole("textbox").count()).toBe(0);
});
test("J32 safe original-source workbench fits 320px and 200% zoom",async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.setContent(renderOperatorHtml(report));
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(await overflow()).toBeLessThanOrEqual(1);
 await page.evaluate(()=>document.documentElement.style.zoom="2");
 expect(await overflow()).toBeLessThanOrEqual(1);
 await expect(page.getByRole("status")).toBeVisible();
 expect(await page.getByRole("button").count()).toBe(0);
});
test("J32 semantic operator procedures survive dark mode, reduced motion and keyboard navigation",async({page})=>{
 await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
 await page.setContent(renderOperatorHtml(report));
 await expect(page.getByRole("table")).toBeVisible();
 expect(await page.getByRole("cell",{name:"OPEN"}).count()).toBe(9);
 await expect(page.getByRole("rowheader")).toHaveCount(9);
 await page.keyboard.press("Tab");
 expect(await page.getByRole("button").count()).toBe(0);
});
