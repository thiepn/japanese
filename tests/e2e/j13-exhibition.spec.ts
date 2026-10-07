import {expect,test} from "@playwright/test";

test("J13 lazy-loads the exhibition layer on tablet and desktop only",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop/tablet exhibition qualification");

  await page.setViewportSize({width:1280,height:900});
  await page.goto("./");

  await expect.poll(()=>page.locator(".j2-shell").evaluate((node)=>getComputedStyle(node).getPropertyValue("--j13-exhibition").trim())).toBe("1");
  expect(await page.locator(".j2-shell").evaluate((node)=>getComputedStyle(node).getPropertyValue("--j12-mobile").trim())).toBe("");

  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav).toHaveCSS("position","sticky");
  const box=await nav.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThan(4);
});

test("J13 Learn uses the wide canvas as a panoramic emakimono",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop exhibition qualification");

  await page.setViewportSize({width:1440,height:960});
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  const emaki=page.locator(".j4-emaki");
  await expect(emaki).toBeVisible();
  const style=await emaki.evaluate((node)=>{
    const css=getComputedStyle(node);
    return {snap:css.scrollSnapType,minHeight:css.minHeight,overflowX:css.overflowX};
  });
  expect(style.snap).toContain("mandatory");
  expect(parseFloat(style.minHeight)).toBeGreaterThanOrEqual(600);
  expect(style.overflowX).toBe("auto");

  const firstRegion=page.locator(".j4-region").first();
  const regionStyle=await firstRegion.evaluate((node)=>getComputedStyle(node).scrollSnapAlign);
  expect(regionStyle).toBe("start");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J13 tablet Reader becomes a persistent two-pane reading desk",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","tablet exhibition qualification");

  await page.setViewportSize({width:1024,height:900});
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();

  const tools=page.locator(".j6-reader__tools");
  const paper=page.locator(".j6-reader__paper");
  const [toolsBox,paperBox]=await Promise.all([tools.boundingBox(),paper.boundingBox()]);
  expect(toolsBox).not.toBeNull();
  expect(paperBox).not.toBeNull();
  expect(toolsBox!.x+toolsBox!.width).toBeLessThan(paperBox!.x);
  await expect(tools).toHaveCSS("position","sticky");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J13 Library is a desktop research desk with persistent reference sheet",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop exhibition qualification");

  await page.setViewportSize({width:1440,height:960});
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  const catalog=page.locator(".j7-catalog");
  const columns=await catalog.evaluate((node)=>getComputedStyle(node).gridTemplateColumns.split(" ").filter(Boolean).length);
  expect(columns).toBeGreaterThanOrEqual(2);

  const reference=page.locator(".j7-reference");
  await expect(reference).toHaveCSS("position","sticky");
  const sheet=await page.locator(".j7-reference__sheet").boundingBox();
  expect(sheet).not.toBeNull();
  expect(sheet!.height).toBeGreaterThanOrEqual(560);
});

test("J13 Progress becomes an asymmetric multi-panel exhibition",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop exhibition qualification");

  await page.setViewportSize({width:1440,height:1000});
  await page.goto("./");
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  const progress=page.locator(".j8-progress");
  await expect(progress).toHaveCSS("display","grid");

  const [skills,milestones]=await Promise.all([
    page.locator(".j8-skills").boundingBox(),
    page.locator(".j8-milestones").boundingBox(),
  ]);
  expect(skills).not.toBeNull();
  expect(milestones).not.toBeNull();
  expect(milestones!.x).toBeGreaterThan(skills!.x+skills!.width);

  const road=page.locator(".j8-milestone-road");
  const roadColumns=await road.evaluate((node)=>getComputedStyle(node).gridTemplateColumns.split(" ").filter(Boolean).length);
  expect(roadColumns).toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J13 keeps keyboard focus visible across the exhibition shell",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop keyboard qualification");

  await page.setViewportSize({width:1280,height:900});
  await page.goto("./");

  await page.keyboard.press("Tab");
  const focused=page.locator(":focus");
  await expect(focused).toBeVisible();
  const outline=await focused.evaluate((node)=>getComputedStyle(node).outlineStyle);
  expect(outline).not.toBe("none");

  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const emaki=page.locator(".j4-emaki");
  await emaki.focus();
  const emakiOutline=await emaki.evaluate((node)=>getComputedStyle(node).outlineStyle);
  expect(emakiOutline).not.toBe("none");
});
