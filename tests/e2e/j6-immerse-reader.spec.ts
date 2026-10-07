import {expect,test} from "@playwright/test";

test("J6 turns Immerse into an editorial reading room",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();

  await expect(page.locator(".j6-immerse")).toBeVisible();
  await expect(page.getByRole("heading",{name:/Enter Japanese/})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Japanese to live inside"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Read across a theme"})).toBeVisible();

  const covers=page.locator(".j6-cover");
  await expect(covers).toHaveCount(50);

  await page.getByRole("button",{name:"Story",exact:true}).click();
  const storyCount=await covers.count();
  expect(storyCount).toBeGreaterThan(0);
  expect(storyCount).toBeLessThan(50);

  await page.getByRole("button",{name:"All",exact:true}).click();
  await expect(covers).toHaveCount(50);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J6 Reader keeps Japanese primary and support layered",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();

  const morning=page.locator(".j6-cover").filter({hasText:"A school morning"});
  await morning.getByRole("button",{name:"Open text"}).click();

  await expect(page.locator(".j6-reader")).toBeVisible();
  await expect(page.getByRole("heading",{name:"A school morning"})).toBeVisible();
  await expect(page.locator(".j6-reader__paper")).toBeVisible();
  await expect(page.getByRole("checkbox",{name:"Reading hints"})).toBeChecked();

  await page.getByRole("button",{name:"Show translation"}).first().click();
  await expect(page.getByText("I get up at seven every day.",{exact:true})).toBeVisible();

  await page.locator(".reader-token").first().click();
  await expect(page.locator(".j6-reader-lookup")).toBeVisible();
  await expect(page.getByRole("button",{name:"Mine for review"})).toBeVisible();

  await page.getByRole("button",{name:"Close word lookup"}).click();
  await expect(page.locator(".j6-reader-lookup")).toHaveCount(0);
});

test("J6 listening-first creates pressure without removing controls",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();

  await page.getByRole("button",{name:"Listening-first",exact:true}).click();
  await expect(page.getByText("Understand the passage before reading it",{exact:true})).toBeVisible();
  await expect(page.locator(".j6-reader-sentences")).toHaveClass(/listening-first-hidden/);
  await expect(page.getByRole("button",{name:/Listen to full text|Play native recording/})).toBeVisible();
  await expect(page.getByRole("checkbox",{name:"Reading hints"})).toBeVisible();
});

test("J6 advanced native tools are progressive-disclosure studios",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();

  const p15=page.locator("#j6-studio-p15");
  await expect(p15).not.toHaveAttribute("open","");
  await p15.locator(":scope > summary").click();
  await expect(p15).toHaveAttribute("open","");
  await expect(p15.getByRole("heading",{name:"Research real Japanese, cite it, defend it, rewrite it"})).toBeVisible();

  const authentic=page.locator("#j6-studio-authentic");
  await authentic.locator(":scope > summary").click();
  await expect(authentic.getByRole("heading",{name:"Your Japanese"})).toBeVisible();
});

test("J6 Reader remains readable on mobile without document overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile reader qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();

  const paper=await page.locator(".j6-reader__paper").boundingBox();
  expect(paper).not.toBeNull();
  expect(paper!.width).toBeLessThanOrEqual((page.viewportSize()?.width??paper!.width)-16);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
