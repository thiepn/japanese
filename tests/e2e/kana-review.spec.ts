import {expect,test} from "@playwright/test";

test("Kana Review is accessible from Learn and launches native study without a new scheduler",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const review=page.getByRole("region",{name:"Kana Review"});
  await expect(review).toBeVisible();
  await expect(review.getByText("Due",{exact:true})).toBeVisible();
  await expect(review.locator("dt").filter({hasText:"New"})).toBeVisible();
  await review.getByRole("button",{name:"Katakana"}).click();
  await expect(review.getByRole("button",{name:"Katakana"})).toHaveAttribute("aria-pressed","true");
  await review.getByRole("button",{name:"Recognition"}).click();
  await expect(review.getByRole("button",{name:"Recognition"})).toHaveAttribute("aria-pressed","true");
  await review.getByRole("button",{name:"Start kana practice"}).click();
  await expect(page.locator(".study-lesson")).toBeVisible();
  await expect(page.getByRole("button",{name:"Exit"})).toBeVisible();
});

test("Kana Review script selection remains separate from beginner lesson progress",async({page})=>{
  await page.goto("./");
  const review=page.getByRole("region",{name:"Kana Review"});
  await expect(review).toBeVisible();
  await review.getByRole("button",{name:"Hiragana"}).click();
  await review.getByRole("button",{name:"Reading recall"}).click();
  await expect(review.getByRole("button",{name:"Start kana practice"})).toBeEnabled();
  await expect(review.locator(".kana-review__counts dd").nth(1)).toHaveText("1");
  await review.getByRole("button",{name:"All skills"}).click();
  await expect(review.getByRole("button",{name:"Start kana practice"})).toBeEnabled();
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
});
