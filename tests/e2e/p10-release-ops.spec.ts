import { expect,test } from "@playwright/test";

test("P22 keeps P11/P21 evidence visible inside stable release operations",async({page})=>{
  await page.goto("/");

  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByRole("heading",{name:"Review productive evidence without rewriting mastery"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Activation, production evidence and maintenance stay fail-closed"})).toBeVisible();
  await expect(page.getByText("P11 external-review packet readiness")).toBeVisible();
  await expect(page.getByRole("button",{name:"Export P11 external-review handoff"})).toBeDisabled();
  await expect(page.getByText("P11 external-review handoff",{exact:true})).toBeVisible();
  await expect(page.getByText("P21 physical-device gate",{exact:true})).toBeVisible();
  await expect(page.getByText("P22 stable activation",{exact:true})).toBeVisible();
  await expect(page.getByText("P22 production + maintenance",{exact:true})).toBeVisible();
  await expect(page.getByText(/Playwright Pixel\/compact profiles remain automated regression evidence/)).toBeVisible();
  await expect(page.getByText("C1 FOUNDATION",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toBeVisible();
  await expect(page.getByText(/P10 intentionally does not create synthetic inventory/)).toBeVisible();
});
