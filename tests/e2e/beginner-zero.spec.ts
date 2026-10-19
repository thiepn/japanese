import {expect,test} from "@playwright/test";

test("A0 first launch teaches before testing and keeps advanced tools optional",async({page},testInfo)=>{
  await page.goto("./");
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Your learning path"})).toBeHidden();
  await page.locator(".beginner-explore > summary").click();
  await expect(page.getByRole("heading",{name:"Your learning path"})).toBeVisible();
  await page.locator(".beginner-explore > summary").click();
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  await expect(page.locator(".j5-lesson-examples")).toContainText("あ");
  await expect(page.getByRole("button",{name:"Hear う pronounced"})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  if(testInfo.project.name!=="desktop-chromium"){
    const play=await page.getByRole("button",{name:"Hear う pronounced"}).boundingBox();
    expect(play?.height??0).toBeGreaterThanOrEqual(44);
  }
});

test("A0 review is not mixed with new course items",async({page})=>{
  await page.goto("./");
  await expect(page.getByRole("button",{name:"Review due material"})).toBeDisabled();
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.locator(".j5-lesson")).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("button",{name:"Review due material"})).toBeDisabled();
});
