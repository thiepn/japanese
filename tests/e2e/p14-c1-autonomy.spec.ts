import { expect,test } from "@playwright/test";

test("P14 exposes long-form C1 autonomy missions and the longitudinal C1 portfolio",async({page})=>{
  await page.goto("/");

  await page.getByRole("button",{name:"Immerse"}).click();
  await expect(page.getByText("P14 C1 LONG-FORM AUTONOMY",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Carry one argument across sources, pressure and time"})).toBeVisible();
  const p14=page.locator(".p14-autonomy");
  await expect(p14.locator(".mission-card")).toHaveCount(5);
  await expect(p14.getByRole("heading",{name:"Research evidence under uncertainty"})).toBeVisible();
  await expect(p14.getByText(/delayed transfer requires 20\+ hours/).first()).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("P16 C1 PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Long-form autonomy + research-quality evidence"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Breadth first, then sustained evidence"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Can the same advanced performance survive time?"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Export C1 JSON"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Export C1 Markdown"})).toBeVisible();
});
