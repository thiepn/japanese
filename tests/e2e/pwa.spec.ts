import {expect,test} from "@playwright/test";

test("PWA native A0 evidence, lesson resume and Library survive offline reload",async({page,context},testInfo)=>{
 await page.goto("./");
 await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
 await page.evaluate(async()=>{
  if(!("serviceWorker" in navigator))throw Error("SERVICE_WORKER_UNAVAILABLE");
  await navigator.serviceWorker.ready;
 });
 await page.reload();
 await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
 await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator(".j5-prompt")).toContainText("あ");
 await page.getByRole("button",{name:"a",exact:true}).click();
 await expect(page.getByText("Correct",{exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(page.locator(".beginner-entry__progress")).toContainText("1/7 answers correct");

 // Load optional app destinations before going offline, preserving the original PWA boundary.
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Your next Japanese lesson"})).toBeVisible();
 await page.getByRole("button",{name:"Library",exact:true}).click();
 const search=page.getByRole("textbox",{name:"Search Japanese"});
 await search.fill("eat");
 await expect(page.locator(".j7-result").filter({hasText:"食べる"}).first()).toBeVisible({timeout:15_000});
 await search.fill("person");
 const personResult=page.getByRole("listbox",{name:"Japanese reference results"})
  .getByRole("option",{name:/^語彙 · Word 人 ひと/});
 await expect(personResult).toBeVisible({timeout:15_000});
 await search.fill("food");
 await page.getByLabel("Reference type filters").getByRole("button",{name:/Kanji/}).click();
 await expect(page.locator(".j7-result.result-kanji").filter({hasText:"食"}).first()).toBeVisible({timeout:15_000});

 await context.setOffline(true);
 try{
  await page.reload();
  await expect(page.getByRole("heading",{name:"Your next Japanese lesson"})).toBeVisible();
  if(testInfo.project.name!=="desktop-chromium")
   await expect.poll(()=>page.locator(".j2-shell").evaluate(node=>
    getComputedStyle(node).getPropertyValue("--j12-mobile").trim())).toBe("1");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await page.getByRole("button",{name:"Continue lesson",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-prompt")).toContainText("い");
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await page.getByRole("button",{name:"Library",exact:true}).click();
  await page.getByRole("textbox",{name:"Search Japanese"}).fill("train");
  await expect(page.locator(".j7-result").filter({hasText:"電車"}).first()).toBeVisible({timeout:15_000});
 }finally{await context.setOffline(false);}
});
