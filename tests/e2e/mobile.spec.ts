import { expect,test } from "@playwright/test";

test("mobile shell keeps navigation and study controls thumb-safe without horizontal overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile certification only");
  await page.goto("./");
  const viewport=page.viewportSize();
  expect(viewport).not.toBeNull();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const nav=page.getByRole("navigation",{name:"Primary"});
  const navBox=await nav.boundingBox();
  expect(navBox).not.toBeNull();
  expect(Math.abs((navBox!.y+navBox!.height)-viewport!.height)).toBeLessThanOrEqual(2);
  for(const button of await nav.getByRole("button").all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(48);
  }

  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  const exit=page.getByRole("button",{name:"Exit"});
  const exitBox=await exit.boundingBox();
  expect(exitBox?.height??0).toBeGreaterThanOrEqual(44);
  await page.getByRole("button",{name:"Continue"}).click();
  const choices=page.locator(".study-choices button");
  await expect(choices.first()).toBeVisible();
  const firstChoice=await choices.first().boundingBox();
  expect(firstChoice?.height??0).toBeGreaterThanOrEqual(48);
  const studyOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(studyOverflow).toBeLessThanOrEqual(1);
});
