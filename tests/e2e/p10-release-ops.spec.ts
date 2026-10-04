import { expect,test } from "@playwright/test";

test("P11.2 preserves P10 review workflows while exposing provenance-audited release evidence",async({page})=>{
  await page.goto("/");

  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByRole("heading",{name:"Review productive evidence without rewriting mastery"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Qualify B2 before opening C1"})).toBeVisible();
  await expect(page.getByText("P9 media provenance + external evidence remain authoritative")).toBeVisible();

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toBeVisible();
  await expect(page.getByText(/P10 intentionally does not create synthetic inventory/)).toBeVisible();
});
