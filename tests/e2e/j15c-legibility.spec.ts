import {expect,test,type Locator} from "@playwright/test";

async function minFont(node:Locator,atLeast:number){
  await expect(node.first()).toBeAttached();
  const size=await node.first().evaluate(element=>parseFloat(getComputedStyle(element).fontSize));
  expect(size).toBeGreaterThanOrEqual(atLeast);
}
async function noOverflow(page:import("@playwright/test").Page){
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
}
test("J15C Library type hierarchy is readable at every viewport",async({page})=>{
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await minFont(nav.locator(".j2-nav__label small"),10);
  await nav.getByRole("button",{name:"Library",exact:true}).click();
  await minFont(page.locator(".j7-filter-strip strong"),11);
  await minFont(page.locator(".j7-result__body small"),11);
  await page.getByRole("textbox",{name:"Search Japanese"}).fill("eat");
  const word=page.locator(".j7-result").filter({hasText:"食べる"}).first();
  await expect(word).toBeVisible({timeout:15_000});
  await word.getByRole("option").click();
  const sheet=page.locator(".j7-reference__sheet--lexeme");
  await expect(sheet).toBeVisible();
  await minFont(sheet.locator(".j7-reference__section p,.j7-reference__section ul"),14);
  await minFont(sheet.locator(".j7-reference__provenance code"),11);
  await noOverflow(page);
});

test("J15C Progress ledger is legible without hiding source evidence",async({page})=>{
  await page.goto("./");
  await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Progress",exact:true}).click();
  await minFont(page.locator(".j8-crest__evidence small"),10);
  await minFont(page.locator(".j8-ledger__item small"),11);
  await minFont(page.locator(".j8-ledger>p"),12);
  await expect(page.getByText("Graded answers",{exact:true})).toBeVisible();
  await noOverflow(page);
});

test("J15C preserves keyboard focus and dark mode after native responsive layers load",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("japanese:j-theme","dark"));
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(nav).toHaveCSS("backdrop-filter","none");
  await nav.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await search.focus();
  const focus=await search.evaluate(el=>getComputedStyle(el).outlineStyle);
  expect(focus).not.toBe("none");
  await minFont(page.locator(".j7-result__body small"),11);
  await noOverflow(page);
});
