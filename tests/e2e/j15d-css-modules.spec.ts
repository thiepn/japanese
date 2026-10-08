import {expect,test} from "@playwright/test";

async function hasReviewCss(page:import("@playwright/test").Page){
  return page.evaluate(()=>Array.from(document.styleSheets).some(sheet=>{
    try{return Array.from(sheet.cssRules).some(rule=>rule.cssText.includes(".human-review-panel"));}
    catch{return false;}
  }));
}

test("J15D D3 loads administrative CSS only after entering diagnostics",async({page})=>{
  await page.goto("./");
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
  expect(await hasReviewCss(page)).toBe(false);
  await page.goto("./?diagnostics=1&panel=review");
  await expect(page.locator(".human-review-panel")).toBeVisible();
  await expect.poll(()=>hasReviewCss(page)).toBe(true);
  await expect(page.locator(".human-review-panel")).toHaveCSS("background-color",/rgba?\(/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});

test("J15D D3 retains release/curation layout inside the lazy technical workspace",async({page})=>{
  await page.goto("./?diagnostics=1&panel=release");
  await expect(page.locator(".native-curation-panel")).toBeVisible();
  await expect(page.locator(".release-operations")).toBeVisible();
  await expect(page.locator(".release-check-columns")).toHaveCSS("display","grid");
  await expect.poll(()=>hasReviewCss(page)).toBe(true);
  await expect(page.getByRole("heading",{name:"Activation, production evidence and maintenance stay fail-closed"})).toBeVisible();
});
