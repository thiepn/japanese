import { expect,test } from "@playwright/test";

test("P22 exposes stable-release operations without claiming production activation",async({page})=>{
  await page.goto("./");
  await expect(page.locator(".phase")).toContainText("P22 stable release activation");

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());

  await expect(page.getByText("P22 DEPLOYMENT IDENTITY",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Know exactly which build is running"})).toBeVisible();
  await expect(page.getByText("Development build",{exact:true})).toBeVisible();
  await expect(page.getByText(/no immutable commit embedded/)).toBeVisible();

  await expect(page.getByText("P22 stable activation",{exact:true})).toBeVisible();
  await expect(page.getByText(/GitHub release artifact is not treated as proof that production deployment succeeded/)).toBeVisible();
  await expect(page.getByText("P22 production + maintenance",{exact:true})).toBeVisible();
  await expect(page.getByText(/capability expansion is outside P22/)).toBeVisible();
});

