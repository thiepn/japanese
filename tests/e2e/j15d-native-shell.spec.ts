import {expect,test} from "@playwright/test";

test("J15D uses only the native Japanese navigation, not the retired shell",async({page})=>{
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(page.locator(".j2-shell")).toBeVisible();
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("button")).toHaveCount(5);
  await expect(nav).toHaveCSS("box-shadow","none");
  await expect(page.locator(".app-shell,.nav,.topbar,.study-shell,.study-card")).toHaveCount(0);
  await nav.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.locator(".j4-hero")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J15D Study entry still opens the native task chamber with accessible controls",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(page.locator(".j5-study")).toBeVisible();
  await expect(page.getByRole("button",{name:"Exit"})).toBeVisible();
  await expect(page.locator(".study-card,.study-shell,.study-progress")).toHaveCount(0);
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J15D preserves Library search and the Progress destination after legacy CSS removal",async({page})=>{
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await nav.getByRole("button",{name:"Library",exact:true}).click();
  const search=page.getByRole("textbox",{name:"Search Japanese"});
  await expect(search).toBeVisible();
  await search.fill("eat");
  await expect(page.locator(".j7-result").filter({hasText:"食べる"}).first()).toBeVisible({timeout:15_000});
  await nav.getByRole("button",{name:"Progress",exact:true}).click();
  await expect(page.locator(".j8-progress")).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
