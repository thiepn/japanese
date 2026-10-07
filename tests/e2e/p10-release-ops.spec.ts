import {expect,test} from "@playwright/test";

test("J11 keeps human review, release gates and source curation inside diagnostics",async({page})=>{
  await page.goto("./?diagnostics=1");

  await expect(page.getByRole("heading",{name:"Japanese operations"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Technical diagnostics"})).toBeVisible();

  await page.getByRole("button",{name:/Human review/}).click();
  await expect(page.getByRole("heading",{name:"Review productive evidence without rewriting mastery"})).toBeVisible();
  await expect(page.getByText("P11 external-review packet readiness")).toBeVisible();
  await expect(page.getByRole("button",{name:"Export P11 external-review handoff"})).toBeDisabled();

  await page.getByRole("button",{name:/Release gates/}).click();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Activation, production evidence and maintenance stay fail-closed"})).toBeVisible();
  await expect(page.getByText("P11 external-review handoff",{exact:true})).toBeVisible();
  await expect(page.getByText("P21 physical-device gate",{exact:true})).toBeVisible();
  await expect(page.getByText("P22 stable activation",{exact:true})).toBeVisible();
  await expect(page.getByText("P22 production + maintenance",{exact:true})).toBeVisible();
  await expect(page.getByText(/Playwright Pixel\/compact profiles remain automated regression evidence/)).toBeVisible();

  await page.getByRole("button",{name:"Back to Japanese"}).click();
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
  await page.getByRole("button",{name:"Progress",exact:true}).click();
  await expect(page.getByText("C1 FOUNDATION",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toHaveCount(0);
  await expect(page.getByText(/P10 intentionally does not create synthetic inventory/)).toHaveCount(0);
});
