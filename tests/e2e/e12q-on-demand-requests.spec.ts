import {openAdditionalLearn} from "./open-additional-learn";
import {expect,test} from "@playwright/test";

/**
 * Proves actual route code and CSS are not fetched by the initial Today page.
 * This is a network-resource observation against the built HTTP-origin app,
 * not an assertion about Vite source syntax or a synthetic bundle manifest.
 */
test("P22 requested route code is absent on Today and loaded on deliberate navigation",async({page})=>{
 await page.goto("./");
 await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
 const files=()=>page.evaluate(()=>performance.getEntriesByType("resource").map(row=>row.name));
 const first=await files();
 expect(first.filter(x=>/\/assets\/(J4Learn|J7Library|Immersion|StudyPlayer)-[^/]+\.(js|css)(\?|$)/.test(x))).toEqual([]);
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,true);
 await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();
 await expect.poll(async()=> (await files()).some(x=>/\/assets\/J4Learn-[^/]+\.js/.test(x))).toBe(true);
 const learned=await files();
 expect(learned.some(x=>/\/assets\/StudyPlayer-[^/]+\.js/.test(x))).toBe(false);
 await page.getByRole("button",{name:"Library",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Japanese knowledge"})).toBeVisible();
 await expect.poll(async()=> (await files()).some(x=>/\/assets\/J7Library-[^/]+\.js/.test(x))).toBe(true);
});
