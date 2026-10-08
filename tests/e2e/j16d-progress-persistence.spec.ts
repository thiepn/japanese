import {expect,test} from "@playwright/test";

test("J16D daily answers survive leaving Study and reloading",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(page.getByRole("heading",{name:"Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByText("あ",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.locator(".j3-today__visit strong")).toHaveText("1");
  await page.reload();
  await expect(page.locator(".j3-today__visit strong")).toHaveText("1");
  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByText("Answers today")).toBeVisible();
});
