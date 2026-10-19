import {expect,test} from "@playwright/test";

test("J16D daily answers survive leaving Study and reloading",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByText("あ",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.locator(".beginner-entry__progress")).toContainText("1/7 answers correct in this group");
  await page.reload();
  await expect(page.locator(".beginner-entry__progress")).toContainText("1/7 answers correct in this group");
  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByText("Answers today")).toBeVisible();
});
