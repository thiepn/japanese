import {expect,test} from "@playwright/test";

test("J12 loads the mobile design layer only for mobile viewports",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile runtime qualification");

  await page.goto("./");
  const shell=page.locator(".j2-shell");
  await expect.poll(()=>shell.evaluate((node)=>getComputedStyle(node).getPropertyValue("--j12-mobile").trim())).toBe("1");

  const viewport=await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");

  const topbar=page.locator(".j2-topbar");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(topbar).toHaveCSS("backdrop-filter","none");
  await expect(nav).toHaveCSS("backdrop-filter","none");
  await expect(page.locator(".j2-ambient__brush")).toHaveCSS("display","none");
});

test("J12 keeps the daily study action above the mobile navigation fold",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile composition qualification");

  await page.goto("./");
  const viewport=page.viewportSize()!;
  const action=page.getByRole("button",{name:/Continue today’s study|Review anyway/});
  const nav=page.getByRole("navigation",{name:"Primary"});
  const [actionBox,navBox]=await Promise.all([action.boundingBox(),nav.boundingBox()]);

  expect(actionBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(actionBox!.y+actionBox!.height).toBeLessThan(navBox!.y);
  expect(navBox!.y+navBox!.height).toBeGreaterThanOrEqual(viewport.height-2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J12 makes Library search sticky and reference filters thumb-scrollable",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile Library qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  await expect(page.locator(".j7-search")).toHaveCSS("position","sticky");
  const filters=page.getByLabel("Reference type filters");
  const metrics=await filters.evaluate((node)=>({scrollWidth:node.scrollWidth,clientWidth:node.clientWidth,display:getComputedStyle(node).display}));
  expect(metrics.display).toBe("flex");
  expect(metrics.scrollWidth).toBeGreaterThanOrEqual(metrics.clientWidth);

  for(const button of await filters.getByRole("button").all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(48);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J12 Study is a full-screen thumb-first chamber",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile Study qualification");

  await page.goto("./");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
  const viewport=page.viewportSize()!;
  const study=page.locator(".j5-study");
  const studyBox=await study.boundingBox();
  expect(studyBox).not.toBeNull();
  expect(studyBox!.height).toBeGreaterThanOrEqual(viewport.height-1);

  const exit=page.getByRole("button",{name:"Exit"});
  expect((await exit.boundingBox())?.height??0).toBeGreaterThanOrEqual(44);

  await page.getByRole("button",{name:"Continue"}).click();
  const choices=page.locator(".j5-choices button");
  await expect(choices.first()).toBeVisible();
  for(const choice of await choices.all()){
    const box=await choice.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(48);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J12 preserves all five learner surfaces without document overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile cross-surface qualification");

  await page.goto("./");
  const surfaces=["Today","Learn","Immerse","Library","Progress"] as const;
  for(const surface of surfaces){
    await page.getByRole("button",{name:surface,exact:true}).click();
    await expect(page.getByRole("button",{name:surface,exact:true})).toHaveAttribute("aria-current","page");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("J12 removes expensive shell effects on coarse mobile UI",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile low-end design qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  await expect(page.locator(".j2-ambient__brush")).toHaveCSS("display","none");
  const practice=page.locator(".j4-practice");
  await expect(practice).toBeVisible();
  const contentVisibility=await practice.evaluate((node)=>getComputedStyle(node).contentVisibility);
  expect(contentVisibility).toBe("auto");

  const navShadow=await page.getByRole("navigation",{name:"Primary"}).evaluate((node)=>getComputedStyle(node).boxShadow);
  expect(navShadow).not.toBe("none");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});


test("J12 keeps Android/PWA chrome synchronized with the active Japanese theme",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile PWA chrome qualification");

  await page.goto("./");
  const themeMeta=page.locator('meta[name="theme-color"]');
  await expect(themeMeta).toHaveAttribute("content","#FBF8F1");

  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(themeMeta).toHaveAttribute("content","#0D0D0C");

  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(themeMeta).toHaveAttribute("content","#0D0D0C");
  await page.getByRole("button",{name:"Use light theme"}).click();
  await expect(themeMeta).toHaveAttribute("content","#FBF8F1");

  const manifest=await page.evaluate(async()=>{
    const response=await fetch("./manifest.webmanifest");
    return response.json() as Promise<{id?:string;display?:string;display_override?:string[]}>;
  });
  expect(manifest.id).toBe("./");
  expect(manifest.display).toBe("standalone");
  expect(manifest.display_override).toContain("standalone");
});
