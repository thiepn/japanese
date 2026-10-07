import {expect,test} from "@playwright/test";

test("J11 keeps deployment identity and stable-release operations in explicit technical panels",async({page})=>{
  await page.goto("./");
  await expect(page.locator(".phase")).toHaveCount(0);

  await page.goto("./?diagnostics=1&panel=deployment");
  await expect(page.getByRole("heading",{name:"Japanese operations"})).toBeVisible();
  await expect(page.getByText("P22 DEPLOYMENT IDENTITY",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Know exactly which build is running"})).toBeVisible();
  await expect(page.getByText("Development build",{exact:true})).toBeVisible();
  await expect(page.getByText(/no immutable commit embedded/)).toBeVisible();

  await page.goto("./?diagnostics=1&panel=release");
  await expect(page.getByText("P22 stable activation",{exact:true})).toBeVisible();
  await expect(page.getByText(/GitHub release artifact is not treated as proof that production deployment succeeded/)).toBeVisible();
  await expect(page.getByText("P22 production + maintenance",{exact:true})).toBeVisible();
  await expect(page.getByText(/capability expansion is outside P22/)).toBeVisible();

  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Technical diagnostics"})).toBeVisible();
});
