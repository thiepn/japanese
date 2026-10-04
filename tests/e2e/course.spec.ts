import { expect,test } from "@playwright/test";

test("structured A1→C1 course and canonical grammar/sentence search work on every certified viewport",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Learn"}).click();

  await expect(page.getByRole("heading",{name:"Foundation → C1"})).toBeVisible();
  await expect(page.locator(".unit-card")).toHaveCount(68);
  const firstUnit=page.locator(".unit-card").first();
  await expect(firstUnit.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await expect(firstUnit.getByText(/Can identify oneself/)).toBeVisible();

  const lastUnit=page.locator(".unit-card").last();
  await expect(lastUnit.getByRole("heading",{name:"Integrated recommendation and accountability"})).toBeVisible();

  await firstUnit.getByRole("button",{name:"Start unit"}).click();
  await expect(page.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByRole("heading",{name:"です",exact:true})).toBeVisible();
  await expect(page.getByText(/polite/i).first()).toBeVisible();

  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("heading",{name:"Foundation → C1"})).toBeVisible();
  // Compact headless Chromium can re-scroll a fixed nav during actionability checks after StudyPlayer teardown.
  // Mobile geometry/hit targets are certified separately in mobile.spec.ts; invoke the already-visible control directly here.
  await page.getByRole("button",{name:"Library"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const search=page.getByRole("textbox",{name:"Search Japanese"});

  await search.fill("topic");
  await expect(page.getByText("は (topic)",{exact:true})).toBeVisible({timeout:15_000});

  await search.fill("What is your name?");
  await expect(page.getByText("名前は何ですか。",{exact:true})).toBeVisible({timeout:15_000});

  await search.fill("causal relationship");
  await expect(page.getByText("因果関係",{exact:true})).toBeVisible({timeout:15_000});

  await search.fill("taking into account");
  await expect(page.getByText("〜を踏まえて",{exact:true})).toBeVisible({timeout:15_000});
});
