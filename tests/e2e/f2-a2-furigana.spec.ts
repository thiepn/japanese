import {expect,test} from "@playwright/test";

test("F2 A2 grammar examples render optional ruby without changing exercise prompts",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const unit=page.locator(".j4-region").nth(1).locator(".j4-landmark").first();
  await expect(unit.getByRole("heading",{name:"Talk about life in progress"})).toBeVisible();
  await unit.getByRole("button",{name:/Enter landmark|Continue landmark|Review landmark|Study anyway/}).click();
  await expect(page.getByRole("heading",{name:"Talk about life in progress"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();

  const sheet=page.locator(".j5-sheet");
  await expect(sheet.getByRole("heading",{name:"〜ている"})).toBeVisible();
  await expect(sheet.getByRole("button",{name:"Hide furigana"})).toBeVisible();
  await expect(sheet.locator(".j5-lesson-examples ruby rt").first()).toBeVisible();

  await sheet.getByRole("button",{name:"Hide furigana"}).click();
  await expect(sheet.locator("ruby")).toHaveCount(0);
  await sheet.getByRole("button",{name:"Show furigana"}).click();
  await expect(sheet.locator(".j5-lesson-examples ruby rt").first()).toBeVisible();
  await sheet.getByRole("button",{name:"Continue"}).click();

  // Grammar-meaning prompt has no kanji. The subsequent cloze must never show ruby.
  await expect(sheet.locator(".j5-choices")).toBeVisible();
  await sheet.locator(".j5-choices button").first().click();
  await expect(sheet.locator(".j5-feedback")).toBeVisible();
  await sheet.getByRole("button",{name:"Continue"}).click();
  await expect(sheet.locator(".eyebrow").getByText("COMPLETE THE SENTENCE.",{exact:true})).toBeVisible();
  await expect(sheet.locator(".j5-prompt ruby")).toHaveCount(0);
  await expect(sheet.getByRole("button",{name:/furigana/i})).toHaveCount(0);
});

test("F2 A2 graded reader honors reading-hints toggle on known vocabulary",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  const text=page.locator(".j6-cover").filter({hasText:"Weekend plans"});
  await text.getByRole("button",{name:"Open text"}).click();
  const paper=page.locator(".j6-reader__paper");
  await expect(paper.locator("ruby rt").first()).toBeVisible();
  const hints=page.getByRole("checkbox",{name:"Reading hints"});
  await hints.uncheck();
  await expect(paper.locator("ruby")).toHaveCount(0);
  await hints.check();
  await expect(paper.locator("ruby rt").first()).toBeVisible();
});
