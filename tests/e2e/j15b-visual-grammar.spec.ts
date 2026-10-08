import {expect,test} from "@playwright/test";

test("J15B freezes five distinct editorial page frames and flat navigation",async({page})=>{
  await page.goto("./");
  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav).toHaveCSS("box-shadow","none");
  await expect(nav).toHaveCSS("backdrop-filter","none");
  await expect(nav.getByRole("button",{name:"Today",exact:true})).toHaveCSS("border-radius","0px");
  for(const [name,selector] of [
    ["Today",".j3-today__hero"],
    ["Learn",".j4-hero"],
    ["Immerse",".j6-hero"],
    ["Library",".j7-library__masthead"],
    ["Progress",".j8-hero"],
  ] as const){
    await nav.getByRole("button",{name,exact:true}).click();
    await expect(page.locator(selector)).toHaveCSS("border-radius","0px");
    await expect(page.locator(selector)).toHaveCSS("box-shadow","none");
  }
});

test("J15B semantic roles and archive input hold in dark mode",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("japanese:j-theme","dark"));
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  const tokens=await page.locator(".j2-shell").evaluate(element=>{
    const s=getComputedStyle(element);
    return ["--j-vg-paper","--j-vg-sheet","--j-vg-ink","--j-vg-rule"].map(k=>s.getPropertyValue(k).trim());
  });
  expect(tokens.every(Boolean)).toBe(true);
  await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Library",exact:true}).click();
  await expect(page.locator('.j7-search__field input')).toHaveCSS("border-radius","0px");
  await page.locator('.j7-search__field input').focus();
  const outline=await page.locator('.j7-search__field input').evaluate(el=>getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});
