import {expect,test} from "@playwright/test";

// Defect reproduction on main: these checks intentionally fail until the
// observed interaction contract is repaired. Never modify learner evidence.
test("UI-02 Library publishes active search result and filter selection",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("person");
  await expect(page.locator(".j7-search__status")).toHaveText(/\\d+ matches/);
  const options=page.locator(".j7-results [role=option]");
  await expect(options.first()).toBeVisible();
  await expect(search).toHaveAttribute("aria-controls","j7-results");
  await expect(search).toHaveAttribute("aria-activedescendant",await options.first().getAttribute("id")??"");
  if(await options.count()>1){
    await search.press("ArrowDown");
    await expect(options.nth(1)).toHaveAttribute("aria-selected","true");
    await expect(search).toHaveAttribute("aria-activedescendant",await options.nth(1).getAttribute("id")??"");
  }
  const filter=page.getByLabel("Reference type filters").getByRole("button",{name:/Kanji/});
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed","true");
});

test("UI-03 selected mobile Library reference comes into view",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile-only stacked catalog");
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("person");
  await expect(page.locator(".j7-search__status")).toHaveText(/\\d+ matches/);
  const first=page.locator(".j7-results [role=option]").first();
  await expect(first).toBeVisible();
  await first.click();
  await expect(page.locator(".j7-reference")).toBeInViewport({ratio:0.1});
});

test("UI-04 top-level destination survives reload and browser history",async({page})=>{
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await nav.getByRole("button",{name:"Library",exact:true}).click();
  await page.reload();
  await expect(nav.getByRole("button",{name:"Library",exact:true})).toHaveAttribute("aria-current","page");
  await nav.getByRole("button",{name:"Progress",exact:true}).click();
  await page.goBack();
  await expect(nav.getByRole("button",{name:"Library",exact:true})).toHaveAttribute("aria-current","page");
  await page.goBack();
  await expect(nav.getByRole("button",{name:"Today",exact:true})).toHaveAttribute("aria-current","page");
  await page.goForward();
  await expect(nav.getByRole("button",{name:"Library",exact:true})).toHaveAttribute("aria-current","page");
});

test("UI-05 Account entry and close restore focus",async({page})=>{
  await page.goto("./");
  const trigger=page.getByRole("button",{name:"Open THIEPN Account"});
  await trigger.click();
  const close=page.getByRole("dialog",{name:"THIEPN Account"}).getByRole("button",{name:"Close Account panel"});
  await expect(close).toBeFocused();
  await close.click();
  await expect(trigger).toBeFocused();
});
