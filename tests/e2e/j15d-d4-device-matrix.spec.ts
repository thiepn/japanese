import {expect,test,type Page} from "@playwright/test";

const routes=[
  ["Today",".j3-today__hero"],
  ["Learn",".j4-hero"],
  ["Immerse",".j6-hero"],
  ["Library",".j7-library__masthead"],
  ["Progress",".j8-hero"]
] as const;

async function noOverflow(page:Page){
  const result=await page.evaluate(()=>({
    documentWidth:document.documentElement.scrollWidth,
    viewport:window.innerWidth
  }));
  expect(result.documentWidth-result.viewport).toBeLessThanOrEqual(1);
}

test("D4 keeps the five Japanese surfaces usable at 320 CSS pixels in both themes",async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto("./?season=autumn");
  const nav=page.getByRole("navigation",{name:"Primary"});
  for(const theme of ["light","dark"] as const){
    if(theme==="dark")await page.getByRole("button",{name:"Use dark theme"}).click();
    await expect(page.locator("html")).toHaveAttribute("data-j-theme",theme);
    for(const [surface,selector] of routes){
      await nav.getByRole("button",{name:surface,exact:true}).click();
      await expect(page.locator(selector)).toBeVisible();
      await noOverflow(page);
    }
    await nav.getByRole("button",{name:"Today",exact:true}).click();
    const start=page.getByRole("button",{name:/Continue today’s study|Review anyway/});
    await expect(start).toBeVisible();
    const rect=await start.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.width).toBeGreaterThanOrEqual(44);
  }
});

test("D4 tablet and desktop preserve lazy exhibition composition and technical isolation",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","tablet/exhibition test on desktop Chromium");
  for(const width of [834,1024,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto("./?season=autumn");
    await expect.poll(()=>page.locator(".j2-shell").evaluate(el=>getComputedStyle(el).getPropertyValue("--j13-exhibition").trim())).toBe("1");
    const nav=page.getByRole("navigation",{name:"Primary"});
    await expect(nav).toBeVisible();
    await nav.getByRole("button",{name:"Learn",exact:true}).click();
    await expect(page.locator(".j4-emaki")).toBeVisible();
    await noOverflow(page);
    await nav.getByRole("button",{name:"Library",exact:true}).click();
    await expect(page.locator(".j7-search")).toBeVisible();
    const field=page.getByRole("textbox",{name:"Search Japanese"});
    await field.focus();
    expect(await field.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe("none");
    await noOverflow(page);
  }
  await page.goto("./?diagnostics=1&panel=release&season=autumn");
  await expect(page.locator(".native-curation-panel")).toBeVisible();
  await expect(page.locator(".release-operations")).toBeVisible();
  await expect(page.locator(".j11-diagnostics")).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Primary"})).toHaveCount(0);
  await noOverflow(page);
});
