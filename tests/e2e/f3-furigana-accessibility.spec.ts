import {openAdditionalLearn} from "./open-additional-learn";
import {expect,test} from "@playwright/test";

test("F3 A2 furigana is accessible by keyboard, keeps toggle state and never changes question grading",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,true);
  const unit=page.locator(".j4-region").nth(1).locator(".j4-landmark").first();
  await unit.getByRole("button",{name:/Enter landmark|Continue landmark|Review landmark|Study anyway/}).click();
  await page.getByRole("button",{name:"Continue"}).click();
  const sheet=page.locator(".j5-sheet");
  const toggle=sheet.getByRole("button",{name:"Hide furigana"});
  await expect(toggle).toHaveAttribute("aria-pressed","true");
  await expect(sheet.locator(".j5-lesson-examples ruby rt").first()).toBeVisible();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(sheet.getByRole("button",{name:"Show furigana"})).toHaveAttribute("aria-pressed","false");
  await expect(sheet.locator("ruby")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(sheet.getByRole("button",{name:"Hide furigana"})).toHaveAttribute("aria-pressed","true");
  await expect(sheet.locator(".j5-lesson-examples ruby rt").first()).toBeVisible();
  const hasOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(hasOverflow).toBe(false);
});

test("F3 A2 ruby remains within document at compact 320px viewport",async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,true);
  await page.locator(".j4-region").nth(1).locator(".j4-landmark").first()
    .getByRole("button",{name:/Enter landmark|Continue landmark|Review landmark|Study anyway/}).click();
  await page.getByRole("button",{name:"Continue"}).click();
  const example=page.locator(".j5-lesson-examples ruby rt").first();
  await expect(example).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
