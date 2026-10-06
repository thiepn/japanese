import { expect,test } from "@playwright/test";

test("P22 exposes stable-release operations without claiming production activation",async({page})=>{
  await page.goto("/");
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

test("P22 deployment identity parser fails closed on malformed metadata",async({page})=>{
  await page.route("**/release-meta.json",async(route)=>{
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
      schema:"wrong-schema",schemaVersion:1,phase:"P22",channel:"stable",commit:"a".repeat(40),builtAt:"2026-10-06T14:00:00Z"
    })});
  });
  await page.goto("/");
  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("Deployment identity unavailable",{exact:true})).toBeVisible();
  await expect(page.getByText(/Do not infer a deployed commit or stable-release state/)).toBeVisible();
});
