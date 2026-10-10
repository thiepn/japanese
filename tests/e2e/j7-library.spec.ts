import {expect,test} from "@playwright/test";

test("J7 turns Library into a dense Japanese reference archive",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  await expect(page.locator(".j7-library")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Japanese knowledge"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Starter shelf"})).toBeVisible();
  await expect(page.locator(".j7-result")).toHaveCount(24);

  const filters=page.getByLabel("Reference type filters").getByRole("button");
  await expect(filters).toHaveCount(8);
  await expect(page.getByRole("textbox",{name:"Search Japanese"})).toBeVisible();

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J7 search preserves canonical local search and opens a word reference sheet",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("eat");

  // Do not click a stale Starter shelf entry before the query completes.
  await expect(page.locator(".j7-search__status")).toHaveText(/\d+ matches/,{timeout:15_000});
  const word=page.locator(".j7-result").filter({hasText:"食べる"}).first();
  await expect(word).toBeVisible({timeout:15_000});
  await word.getByRole("option").click();

  const sheet=page.locator(".j7-reference__sheet--lexeme");
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("heading",{name:"食べる"})).toBeVisible();
  await expect(sheet).toContainText(/eat/i);
  await expect(sheet).toContainText("MATCHED BY");
});

test("J7 differentiates kanji from word results and filters without changing search truth",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("food");

  const kanjiFilter=page.getByLabel("Reference type filters").getByRole("button",{name:/Kanji/});
  await kanjiFilter.click();

  const results=page.locator(".j7-result");
  // Local search runs asynchronously: require a rendered match rather than
  // sampling an intermediate empty result set immediately after filtering.
  await expect(results.first()).toBeVisible({timeout:15_000});
  await expect(results.first()).toHaveClass(/result-kanji/);

  const first=results.first();
  await first.getByRole("option").click();
  await expect(page.locator(".j7-reference__sheet--kanji")).toBeVisible();
});

test("J7 search supports keyboard result navigation",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.fill("person");
  await expect(page.locator(".j7-result").first()).toBeVisible({timeout:15_000});

  const first=page.locator(".j7-result").nth(0).getByRole("option");
  const second=page.locator(".j7-result").nth(1).getByRole("option");
  await expect(first).toHaveAttribute("aria-selected","true");
  await search.press("ArrowDown");
  await expect(second).toHaveAttribute("aria-selected","true");
  await search.press("ArrowUp");
  await expect(first).toHaveAttribute("aria-selected","true");
});

test("J7 archive remains usable on mobile without horizontal overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile archive qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Library",exact:true}).click();

  const search=await page.getByRole("textbox",{name:"Search Japanese"}).boundingBox();
  expect(search?.height??0).toBeGreaterThanOrEqual(54);

  const filters=page.getByLabel("Reference type filters").getByRole("button");
  for(const button of await filters.all()){
    const box=await button.boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(54);
  }

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
