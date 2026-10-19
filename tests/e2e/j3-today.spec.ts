import {expect,test} from "@playwright/test";

test("Today gives a new learner a single start and separate review action",async({page})=>{
  await page.goto("./");
  const today=page.locator(".j3-today");
  await expect(today).toBeVisible();
  await expect(today.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await expect(today.getByRole("button",{name:"Start Japanese from Zero"})).toBeVisible();
  await expect(today.getByRole("button",{name:"Review due material"})).toBeDisabled();
  await expect(today.getByText("Hiragana · Five vowel sounds")).toBeVisible();
  await expect(today.getByRole("button",{name:"Open full course and advanced practice"})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("Today beginner entry remains legible in dark mode and mobile",async({page},testInfo)=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.getByRole("button",{name:"Start Japanese from Zero"})).toBeVisible();
  if(testInfo.project.name!=="desktop-chromium"){
    const bounds=await page.getByRole("button",{name:"Start Japanese from Zero"}).boundingBox();
    expect(bounds?.height??0).toBeGreaterThanOrEqual(48);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("Today opens a taught vowel lesson with audio before quizzes",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.locator("main.j5-study-shell#main-content")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  for(const kana of ["あ","い","う","え","お"])
    await expect(page.getByRole("button",{name:"Hear "+kana+" pronounced"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-prompt")).toContainText("あ");
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("button",{name:"Start Japanese from Zero"})).toBeVisible();
});
