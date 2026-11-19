import {expect,test} from "@playwright/test";

test("safe primary-view navigation reloads offline without caching query URLs",async({page,context})=>{
 await page.goto("./");
 await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.reload();
 await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
 await page.getByRole("button",{name:"Library",exact:true}).click();
 await expect(page).toHaveURL(/\?view=Library$/);
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 await search.fill("eat");
 await expect(page.locator(".j7-result").filter({hasText:"食べる"}).first()).toBeVisible();
 await expect.poll(()=>page.evaluate(async()=>{
  const names=(await caches.keys()).filter(name=>name.startsWith("japanese-shell-"));
  const keys=(await Promise.all(names.map(async name=>(await (await caches.open(name)).keys()).map(req=>req.url)))).flat();
  return keys.some(url=>/\/assets\/J7Library-[^/]+\.js$/.test(url));
 })).toBe(true);
 await page.reload();
 await expect(search).toBeVisible();
 await context.setOffline(true);
 try{
  await page.reload();
  await expect(page).toHaveURL(/\?view=Library$/);
  await expect(page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Library",exact:true})).toHaveAttribute("aria-current","page");
  await search.fill("train");
  await expect(page.locator(".j7-result").filter({hasText:"電車"}).first()).toBeVisible();
  const queryKeys=await page.evaluate(async()=>{
   const names=(await caches.keys()).filter(name=>name.startsWith("japanese-shell-"));
   return (await Promise.all(names.map(async name=>(await (await caches.open(name)).keys()).map(req=>req.url)))).flat().filter(url=>new URL(url).search);
  });
  expect(queryKeys).toEqual([]);
 }finally{await context.setOffline(false);}
});
