import { expect,test } from "@playwright/test";

test("P10 exposes human review, release operations and native curation without weakening P9 gates",async({page})=>{
  await page.goto("/");

  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByRole("heading",{name:"Review productive evidence without rewriting mastery"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Turn source-dependent blockers into auditable work"})).toBeVisible();
  await expect(page.getByText("P9 gate remains authoritative")).toBeVisible();

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toBeVisible();
  await expect(page.getByText(/P10 intentionally does not create synthetic inventory/)).toBeVisible();
});
