import {expect,test} from "@playwright/test";

test("J8 turns Progress into a longitudinal Japanese path",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  await expect(page.locator(".j8-progress")).toBeVisible();
  await expect(page.getByRole("heading",{name:"The path you have actually built"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Six views of durable ability"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Checkpoints on the road"})).toBeVisible();

  const crests=page.locator(".j8-crest");
  await expect(crests).toHaveCount(6);

  await expect(page.getByText("A1 ASSESSMENT",{exact:true})).toBeVisible();
  await expect(page.getByText("B1 ASSESSMENT",{exact:true})).toBeVisible();
  await expect(page.getByText("B2 ASSESSMENT",{exact:true})).toBeVisible();
  await expect(page.getByText("C1 FOUNDATION",{exact:true})).toBeVisible();

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J8 skill crests disclose the existing mastery dimensions",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  const script=page.locator(".j8-crest--script");
  await script.locator("summary").click();

  await expect(script.getByText("Hiragana",{exact:true})).toBeVisible();
  await expect(script.getByText("Katakana",{exact:true})).toBeVisible();
  await expect(script.getByText("Recognition",{exact:true})).toBeVisible();
  await expect(script.getByRole("progressbar",{name:"Hiragana"})).toBeVisible();
});

test("J8 keeps detailed B2 and C1 portfolios behind evidence drill-down",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  const b2=page.getByTestId("j8-b2-vault");
  const c1=page.getByTestId("j8-c1-vault");

  await expect(b2).not.toHaveAttribute("open","");
  await expect(c1).not.toHaveAttribute("open","");

  await b2.locator("summary").click();
  await expect(page.getByText("B2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();

  await c1.locator("summary").click();
  await expect(page.getByText("C1→C2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("LONGITUDINAL C2 READINESS",{exact:true})).toBeVisible();
});

test("J8 evidence ledger remains explicit behind the decorative landscape",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  await expect(page.getByRole("heading",{name:"What exists behind the picture"})).toBeVisible();
  await expect(page.getByText("Graded answers",{exact:true})).toBeVisible();
  await expect(page.getByText("Memory traces",{exact:true})).toBeVisible();
  await expect(page.getByText("Due now",{exact:true})).toBeVisible();
  await expect(page.getByText(/visual summaries only/i)).toBeVisible();
});

test("J8 Progress remains usable on mobile without horizontal overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile progress qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  const world=await page.locator(".j8-world").boundingBox();
  expect(world).not.toBeNull();
  expect(world!.width).toBeLessThanOrEqual((page.viewportSize()?.width??world!.width)-16);

  const firstMilestone=await page.locator(".j8-milestone").first().boundingBox();
  const secondMilestone=await page.locator(".j8-milestone").nth(1).boundingBox();
  expect(firstMilestone).not.toBeNull();
  expect(secondMilestone).not.toBeNull();
  expect(secondMilestone!.y).toBeGreaterThan(firstMilestone!.y);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
