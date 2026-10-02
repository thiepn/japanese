import { expect,test } from "@playwright/test";

test("structured A1→A2 course and canonical grammar/sentence search work on every certified viewport",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Learn"}).click();

  await expect(page.getByRole("heading",{name:"Foundation → A2"})).toBeVisible();
  await expect(page.locator(".unit-card")).toHaveCount(32);
  const firstUnit=page.locator(".unit-card").first();
  await expect(firstUnit.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await expect(firstUnit.getByText(/Can identify oneself/)).toBeVisible();

  await firstUnit.getByRole("button",{name:"Start unit"}).click();
  await expect(page.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByRole("heading",{name:"です",exact:true})).toBeVisible();
  await expect(page.getByText(/polite/i).first()).toBeVisible();

  await page.getByRole("button",{name:"Exit"}).click();
  await page.getByRole("button",{name:"Library"}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});

  await search.fill("topic");
  await expect(page.getByText("は (topic)",{exact:true})).toBeVisible({timeout:15_000});

  await search.fill("What is your name?");
  await expect(page.getByText("名前は何ですか。",{exact:true})).toBeVisible({timeout:15_000});
});
