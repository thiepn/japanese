import { expect,test } from "@playwright/test";

test("P20 exposes the longitudinal readiness matrix and preserves the certification boundary",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("P20 C1→C2 PORTFOLIO",{exact:true})).toBeVisible();

  const panel=page.locator(".p20-readiness");
  await expect(panel.getByText("P20 LONGITUDINAL C2 READINESS",{exact:true})).toBeVisible();
  await expect(panel.getByRole("heading",{name:"Consolidate advanced evidence before calling the pathway qualified"})).toBeVisible();
  await expect(panel.getByText(/internal product qualification/i)).toBeVisible();
  await expect(panel.getByText(/not an accredited CEFR C2 certificate/i)).toBeVisible();
  await expect(panel.locator(".p20-requirements article")).toHaveCount(11);
  await expect(panel.locator(".p20-matrix-row")).toHaveCount(7);
  await expect(panel.getByRole("button",{name:"Export readiness JSON"})).toBeVisible();
  await expect(panel.getByRole("button",{name:"Export readiness Markdown"})).toBeVisible();
});

test("P20 keeps reviewer calibration explicit even when no broad review pair exists",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const panel=page.locator(".p20-readiness");
  await expect(panel.getByRole("heading",{name:"Compare broad reviewers instead of averaging disagreement away"})).toBeVisible();
  await expect(panel.getByText(/Two broad reviews are needed before reviewer calibration can be compared/)).toBeVisible();
  await expect(panel.getByText(/Different reviewer labels are useful calibration evidence/)).toBeVisible();
});
