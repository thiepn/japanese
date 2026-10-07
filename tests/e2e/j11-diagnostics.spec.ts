import {expect,test} from "@playwright/test";

test("J11 diagnostics is an explicit technical workspace with no learner primary nav",async({page})=>{
  await page.goto("./?diagnostics=1");

  await expect(page.locator(".j11-diagnostics")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Japanese operations"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);

  const technical=page.getByRole("navigation",{name:"Technical diagnostics"});
  await expect(technical).toBeVisible();
  await expect(technical.getByRole("button")).toHaveCount(5);
  await expect(page.getByText(/Nothing in this workspace is learner mastery/i)).toBeVisible();
});

test("J11 direct panel URLs resolve to the requested technical concern",async({page})=>{
  await page.goto("./?diagnostics=1&panel=review");
  await expect(page.getByRole("heading",{name:"Review productive evidence without rewriting mastery"})).toBeVisible();

  await page.goto("./?diagnostics=1&panel=release");
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Activation, production evidence and maintenance stay fail-closed"})).toBeVisible();

  await page.goto("./?diagnostics=1&panel=deployment");
  await expect(page.getByRole("heading",{name:"Know exactly which build is running"})).toBeVisible();

  await page.goto("./?diagnostics=1&panel=runtime");
  await expect(page.getByRole("heading",{name:/provider/i})).toBeVisible();
});

test("J11 back action returns to the learner shell and removes diagnostics from the URL",async({page})=>{
  await page.goto("./?diagnostics=1&panel=runtime");

  await page.getByRole("button",{name:"Back to Japanese"}).click();

  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
  await expect(page.locator(".j11-diagnostics")).toHaveCount(0);
  expect(new URL(page.url()).searchParams.has("diagnostics")).toBe(false);
  expect(new URL(page.url()).searchParams.has("panel")).toBe(false);
});

test("J11 removes release/source-curation administration from learner Immerse",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();

  await expect(page.getByRole("heading",{name:"Native-source and advanced work"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Verify media before it can count toward release"})).toHaveCount(0);
  await expect(page.getByText("P10 NATIVE CORPUS CURATION",{exact:true})).toHaveCount(0);

  await page.locator("#j6-studio-p15 > summary").click();
  await expect(page.getByText("C1 REAL-SOURCE ENVIRONMENT",{exact:true})).toBeVisible();
  await expect(page.getByText("P15 ACTUAL C1 ENVIRONMENT",{exact:true})).toHaveCount(0);
});

test("J11 learner Progress keeps evidence while hiding internal phase vocabulary",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  await page.getByTestId("j8-b2-vault").locator("summary").click();
  await expect(page.getByText("B2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("P10 B2 PORTFOLIO",{exact:true})).toHaveCount(0);

  await page.getByTestId("j8-c1-vault").locator("summary").click();
  await expect(page.getByText("C1→C2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("LONGITUDINAL C2 READINESS",{exact:true})).toBeVisible();
  await expect(page.getByText("P20 C1→C2 PORTFOLIO",{exact:true})).toHaveCount(0);
});

test("J11 technical workspace remains usable on mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile diagnostics qualification");

  await page.goto("./?diagnostics=1");
  const tabs=page.getByRole("navigation",{name:"Technical diagnostics"}).getByRole("button");
  for(const button of await tabs.all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(44);
  }

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
