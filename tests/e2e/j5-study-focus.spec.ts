import {expect,test} from "@playwright/test";

test("J5 turns Study Player into a focused task chamber",async({page})=>{
  await page.goto("./");

  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  const study=page.locator(".j5-study");
  await expect(study).toBeVisible();
  await expect(page.locator("main.j5-study-shell#main-content")).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
  await expect(study).toHaveAttribute("data-j-study-mode","kana");
  await expect(page.getByLabel("Kana study mode")).toBeVisible();
  await expect(page.getByRole("button",{name:"Exit"})).toBeVisible();

  await expect(page.locator(".j5-sheet")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.locator(".study-choices.j5-choices")).toBeVisible();

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J5 uses a manuscript treatment for connected writing",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  const writing=page.locator(".j4-practice__quick button").filter({hasText:"Writing"});
  await writing.click();

  const study=page.locator(".j5-study");
  await expect(study).toHaveAttribute("data-j-study-mode","writing");
  await expect(page.getByLabel("Writing study mode")).toBeVisible();

  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.locator(".j5-writing__paper textarea")).toBeVisible();
  await expect(page.getByRole("button",{name:"Check structure"})).toBeDisabled();

  await page.locator(".j5-writing__paper textarea").fill("日本語で自分の考えを書きます。理由も説明します。");
  await expect(page.getByRole("button",{name:"Check structure"})).toBeEnabled();
});

test("J5 carries the J-series theme into the isolated study session",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Use dark theme"}).click();
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  await expect(page.locator(".j5-study")).toHaveAttribute("data-j-theme","dark");
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");

  await page.getByRole("button",{name:"Use light theme"}).click();
  await expect(page.locator(".j5-study")).toHaveAttribute("data-j-theme","light");
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","light");
});

test("J5 remains a single-column task chamber on mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile chamber qualification");

  await page.goto("./");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  const exit=await page.getByRole("button",{name:"Exit"}).boundingBox();
  expect(exit?.height??0).toBeGreaterThanOrEqual(40);

  const card=await page.locator(".j5-sheet").boundingBox();
  expect(card).not.toBeNull();
  const viewportWidth=page.viewportSize()?.width??card!.width;
  expect(card!.width).toBeLessThanOrEqual(viewportWidth+1);
  expect(card!.width).toBeGreaterThanOrEqual(viewportWidth-4);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J5 reduced-motion mode preserves all study controls",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  await expect(page.getByRole("button",{name:"Exit"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeVisible();
  await expect(page.locator(".j5-mode-rail")).toBeVisible();
});
