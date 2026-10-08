import {expect,test} from "@playwright/test";

test("J16C Reader starts at the article heading and restores Immerse scroll",async({page})=>{
  await page.goto("./?season=autumn");
  await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Immerse",exact:true}).click();
  const story=page.locator(".j6-cover").filter({hasText:"A school morning"});
  const open=story.getByRole("button",{name:"Open text"});
  await expect(open).toBeVisible();
  await open.scrollIntoViewIfNeeded();
  const sourceScroll=await page.evaluate(()=>window.scrollY);
  expect(sourceScroll).toBeGreaterThan(0);

  await open.click();
  await expect(page.locator(".j6-reader")).toBeVisible();
  const heading=page.locator(".j6-reader__identity h1");
  await expect(heading).toHaveText("A school morning");
  await expect(heading).toBeFocused();
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeLessThanOrEqual(1);
  await expect(page.locator(".j6-reader__head")).toBeInViewport();

  await page.locator(".j6-reader__back").click();
  await expect(story).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator(".j6-reader")).toHaveCount(0);
});
