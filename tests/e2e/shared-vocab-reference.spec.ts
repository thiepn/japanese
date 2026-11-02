import {expect,test,type Locator,type Page} from "@playwright/test";

async function openLibrary(page:Page){
 await page.goto("./");
 await page.getByRole("button",{name:"Library",exact:true}).click();
 return page.getByRole("textbox",{name:"Search Japanese"});
}
async function openWord(page:Page,search:Locator,term:string){
 await search.fill(term);
 const result=page.locator(".j7-result.result-lexeme").filter({has:page.getByText(term,{exact:true})}).first();
 await expect(result).toBeVisible({timeout:15000});
 await result.getByRole("option").click();
 return page.locator(".j7-reference__sheet--lexeme");
}
test("J7 displays source-qualified shared concepts with original same-origin images",async({page})=>{
 const search=await openLibrary(page);
 for(const row of [
  {term:"りんご",concept:"food.apple",file:"apple.svg"},
  {term:"学校",concept:"place.school",file:"school.svg"},
  {term:"静か",concept:"gesture.request-quiet",file:"quiet.svg"}
 ]){
  const sheet=await openWord(page,search,row.term);
  const figure=sheet.locator(".vocabulary-visual");
  await expect(figure).toHaveAttribute("data-shared-concept-id",row.concept);
  const image=figure.locator("img");
  await expect(image).toHaveAttribute("src",new RegExp("/vocab/"+row.file.replace(".","\\.")+"$"));
  await expect(image).toHaveAttribute("loading","lazy");
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 }
 await search.fill("日本語");
 const unsupported=page.locator(".j7-result.result-lexeme").filter({has:page.getByText("日本語",{exact:true})}).first();
 await expect(unsupported).toBeVisible({timeout:15000});
 await unsupported.getByRole("option").click();
 await expect(page.locator(".j7-reference__sheet--lexeme .vocabulary-visual")).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("original 48-image cache retains a viewed J7 illustration after offline reload",async({page,context})=>{
 await page.goto("./");
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker?.controller)).toBe(true);
 // Cache public built shell resources during a controlled online reload.
 await page.reload();
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 const sheet=await openWord(page,search,"りんご");
 const img=sheet.locator(".vocabulary-visual img");
 await img.scrollIntoViewIfNeeded();
 await expect.poll(()=>img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await expect.poll(()=>page.evaluate(async()=>{
  const cache=await caches.open("japanese-shell-vocab-v5");
  return Boolean(await cache.match(new URL("vocab/apple.svg",document.baseURI).href));
 })).toBe(true);
 await context.setOffline(true);
 await page.reload();
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const offlineSearch=page.getByRole("textbox",{name:"Search Japanese"});
 const offlineSheet=await openWord(page,offlineSearch,"りんご");
 const cached=offlineSheet.locator(".vocabulary-visual img");
 await expect(cached).toHaveAttribute("src",/\/vocab\/apple\.svg$/);
 await cached.scrollIntoViewIfNeeded();
 await expect.poll(()=>cached.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await expect(offlineSheet).toContainText(/apple/i);
 const count=await page.evaluate(async()=>(await(await caches.open("japanese-shell-vocab-v5")).keys()).length);
 expect(count).toBeLessThanOrEqual(48);
});
