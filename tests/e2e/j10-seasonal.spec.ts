import {expect,test} from "@playwright/test";

const seasons=[
  ["spring","春"],
  ["tsuyu","梅雨"],
  ["summer","夏"],
  ["autumn","秋"],
  ["winter","冬"],
  ["new-year","正月"],
] as const;

test("J10 exposes six deterministic seasonal art worlds without changing navigation",async({page})=>{
  const inks=new Set<string>();

  for(const [season,label] of seasons){
    await page.goto("./?season="+season);

    const shell=page.locator(".j2-shell");
    await expect(shell).toHaveAttribute("data-j-season",season);
    await expect(page.locator("html")).toHaveAttribute("data-j-season",season);
    await expect(page.locator(".j10-seasonal-world")).toHaveAttribute("data-j10-season",season);
    await expect(page.locator(".j2-topbar__season > span").first()).toHaveText(label);

    inks.add(await shell.evaluate((node)=>getComputedStyle(node).getPropertyValue("--j10-season-ink").trim()));

    await page.getByRole("button",{name:"Learn",exact:true}).click();
    await expect(page.locator(".j4-learn")).toBeVisible();
    await page.getByRole("button",{name:"Today",exact:true}).click();
    await expect(page.locator(".j3-today")).toBeVisible();
  }

  expect(inks.size).toBe(6);
});

test("J10 season carries into the isolated Study Focus Chamber",async({page})=>{
  await page.goto("./?season=winter");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();

  const study=page.locator(".j5-study");
  await expect(study).toHaveAttribute("data-j-season","winter");
  await expect(page.locator("html")).toHaveAttribute("data-j-season","winter");
  await expect(study.locator(".j10-seasonal-world--compact")).toHaveAttribute("data-j10-season","winter");
});

test("J10 keeps Reader typography primary while season remains active",async({page})=>{
  await page.goto("./?season=spring");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();

  await expect(page.locator("html")).toHaveAttribute("data-j-season","spring");
  await expect(page.locator(".j6-reader__paper")).toBeVisible();
  await expect(page.locator(".j6-reader-japanese").first()).toBeVisible();

  const fontFamily=await page.locator(".j6-reader-japanese").first().evaluate((node)=>getComputedStyle(node).fontFamily);
  expect(fontFamily.length).toBeGreaterThan(0);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J10 seasonal art is static under reduced motion",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./?season=summer");

  const world=page.locator(".j10-seasonal-world").first();
  await expect(world).toBeVisible();
  const animation=await world.evaluate((node)=>getComputedStyle(node).animationName);
  expect(animation).toBe("none");

  const childAnimations=await world.locator("*").evaluateAll((nodes)=>nodes.map((node)=>getComputedStyle(node).animationName));
  expect(childAnimations.every((value)=>value==="none")).toBe(true);
});

test("J10 seasonal system does not introduce mobile overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile seasonal qualification");

  for(const [season] of seasons){
    await page.goto("./?season="+season);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
