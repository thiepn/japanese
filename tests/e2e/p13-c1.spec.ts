import { expect,test } from "@playwright/test";

test("P13 exposes C1 native depth, multi-source synthesis and hidden-future spontaneous interaction",async({page})=>{
  await page.goto("/");

  await page.getByRole("button",{name:"Learn"}).click();
  await expect(page.getByText("P13 SPONTANEOUS INTERACTION",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Guided B2 → hidden-future C1 pressure"})).toBeVisible();
  await expect(page.getByRole("button",{name:"C1 spontaneous"})).toHaveClass(/active/);
  await expect(page.getByText(/future pressure hidden/)).toBeVisible();
  await expect(page.getByText("Defend a policy recommendation under challenge",{exact:true})).toBeVisible();

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByText("P13 C1 SOURCE DEPTH",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Native sources → multi-source synthesis"})).toBeVisible();
  await expect(page.getByText("Policy continuity across two formal addresses",{exact:true})).toBeVisible();
  await expect(page.locator(".p13-advanced-lab audio")).toHaveCount(2);
  await expect(page.getByRole("heading",{name:"Synthesize before you generalize"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Evidence, causality and justified conclusions"})).toBeVisible();
});
