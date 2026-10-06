import { expect,test } from "@playwright/test";

test("P17 exposes the C1-to-C2 precision bridge and keeps evidence boundaries explicit",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const lab=page.locator(".p17-precision");
  await expect(lab.getByText("P17 C1→C2 PRECISION BRIDGE",{exact:true})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Make advanced Japanese more exact, adaptive and specialist"})).toBeVisible();
  await expect(lab.locator(".p17-challenge-grid button")).toHaveCount(8);
  await expect(lab.getByRole("heading",{name:"Compress without flattening the argument"})).toBeVisible();

  await lab.getByRole("button",{name:"Specialist discourse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByText(/Create a P16 specialist track first/)).toBeVisible();

  await lab.getByRole("button",{name:"Fresh-source refresh"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByText(/Register and evaluate at least two real sources/)).toBeVisible();

  await lab.getByRole("button",{name:"Human-review repair"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByText(/A P16 human review is required/)).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("P20 C1→C2 PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("P17 PRECISION BRIDGE",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Stylistic control + specialist discourse + repair"})).toBeVisible();
});
