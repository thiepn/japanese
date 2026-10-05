import { expect,test } from "@playwright/test";

test("Immerse exposes graded A1→C1 autonomy and long-form missions without creating a separate learning silo",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Immerse"}).click();

  await expect(page.getByRole("heading",{name:"A1 → C1 autonomy"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Long-form B2 task chains"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"C1 evidence, policy & causal reasoning"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Listen across real sources, then synthesize"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Respond before you can script the answer"})).toBeVisible();
  await expect(page.locator(".mission-card")).toHaveCount(6);
  await expect(page.locator(".immersion-card")).toHaveCount(50);
  await expect(page.getByRole("heading",{name:/Focus on (reading|listening)/})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Listen → record → compare"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Your Japanese"})).toBeVisible();
  const morning=page.locator(".immersion-card").filter({hasText:"A school morning"});
  await expect(morning.getByText(/Known-word readiness/)).toBeVisible();
  await morning.getByRole("button",{name:"Open text"}).click();

  await expect(page.getByRole("heading",{name:"A school morning"})).toBeVisible();
  await page.getByRole("checkbox",{name:"Reading hints"}).uncheck();
  await expect(page.locator(".reader-japanese").first()).toContainText("毎日七時に起きます。");
  await page.getByRole("button",{name:"Show translation"}).first().click();
  await expect(page.getByText("I get up at seven every day.",{exact:true})).toBeVisible();

  await page.locator(".reader-token").first().click();
  await expect(page.getByRole("button",{name:"Mine for review"})).toBeVisible();

  await page.getByRole("button",{name:"Reading check"}).click();
  await expect(page.getByText("What time does the person get up?",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Seven o'clock"}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
});
