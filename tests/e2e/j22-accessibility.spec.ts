import {expect,test} from "@playwright/test";

test("J22 keyboard, semantic navigation and theme hold across all learner destinations",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.addInitScript(()=>localStorage.setItem("japanese:j-theme","dark"));
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link",{name:"Skip to main content"})).toBeFocused();
  await expect(page.getByRole("link",{name:"Skip to main content"})).toHaveAttribute("href","#main-content");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav.getByRole("button")).toHaveCount(5);
  for(const name of ["Today","Learn","Immerse","Library","Progress"] as const){
    const button=nav.getByRole("button",{name,exact:true});
    await button.click();
    await expect(button).toHaveAttribute("aria-current","page");
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.getByRole("main")).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
});

test("J22 320px responsive focus and 200% text do not hide navigation",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","emulated small mobile viewport; not physical Android");
  await page.setViewportSize({width:320,height:700});
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav.getByRole("button")).toHaveCount(5);
  for(const name of ["Today","Library","Progress"] as const){
    await nav.getByRole("button",{name,exact:true}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.evaluate(()=>{document.documentElement.style.fontSize="200%";});
  await nav.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.locator(".j7-search__field input");
  await search.focus();
  await expect(search).toBeFocused();
  await expect(search).not.toHaveCSS("outline-style","none");
  expect(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeGreaterThanOrEqual(30);
});

test("J22 Account Escape returns keyboard focus without performing sign-in",async({page})=>{
  await page.goto("./");
  const trigger=page.getByRole("button",{name:"Open THIEPN Account"});
  await trigger.click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
});
