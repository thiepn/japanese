import {expect,test} from "@playwright/test";

test("J16D daily answers survive leaving Study and reloading",async({page})=>{
  await page.goto("./");
  await page.locator(".ux1-native-queue").click();
  await expect(page.getByRole("heading",{name:"Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByText("あ",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.locator(".ux1-plan .ux1-section-head span")).toContainText("1 answer recorded");
  await page.reload();
  await expect(page.locator(".ux1-plan .ux1-section-head span")).toContainText("1 answer recorded");
  await page.getByRole("button",{name:"Progress"}).click();
  await expect(page.getByText("Answers today")).toBeVisible();
});
