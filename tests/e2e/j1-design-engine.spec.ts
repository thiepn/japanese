import {expect,test} from "@playwright/test";

test("J1 visual QA sandbox exposes reusable Japanese design primitives",async({page})=>{
  await page.goto("./?visual-qa=j1");

  await expect(page.getByRole("heading",{name:"Japanese Design Engine"})).toBeVisible();
  await expect(page.getByText("Pattern Library",{exact:true})).toBeVisible();
  await expect(page.getByText("Signature Primitives",{exact:true})).toBeVisible();

  await expect(page.getByRole("progressbar",{name:"Visual QA mastery progress"})).toHaveAttribute("aria-valuenow","68");
  await expect(page.getByLabel("Mastered")).toBeVisible();

  const root=page.locator("main.j1-root");
  await expect(root).toHaveAttribute("data-j-theme","light");
  await page.getByRole("button",{name:"Dark · 墨"}).click();
  await expect(root).toHaveAttribute("data-j-theme","dark");

  await page.getByLabel("Season").selectOption("winter");
  await expect(root).toHaveAttribute("data-j-season","winter");

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J1 reduced-motion mode keeps the QA surface understandable",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./?visual-qa=j1");
  await expect(page.getByText("Motion Language",{exact:true})).toBeVisible();
  await expect(page.getByLabel("Animated completion seal")).toBeVisible();
  await expect(page.getByRole("progressbar",{name:"Animated ink progress"})).toHaveAttribute("aria-valuenow","82");
});
