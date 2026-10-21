import {openAdditionalLearn} from "./open-additional-learn";
import {expect,test} from "@playwright/test";
import {readFileSync} from "node:fs";
const e24=JSON.parse(readFileSync("artifacts/e24-review-browser-seed.json","utf8")) as {
 owner:string;events:Array<Record<string,unknown>>;sceneId:string;
};
const e19=JSON.parse(readFileSync("artifacts/e19-browser-seed.json","utf8")) as {
 guest:string;key:string;events:Array<Record<string,unknown>>;firstText:string;
};
async function openLearn(page:import("@playwright/test").Page){
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,false);
 const atlas=page.getByRole("region",{name:"Your learning path"});
 await expect(atlas).toBeVisible();
 return atlas;
}
async function seedPrivateE19(page:import("@playwright/test").Page){
 await page.goto("./");
 await page.evaluate(async({guest,events})=>{
  const database=await new Promise<IDBDatabase>((resolve,reject)=>{
   const request=indexedDB.open("thiepn-japanese:"+guest,8);
   request.onupgradeneeded=()=>{
    const db=request.result;
    for(const name of ["study_events","sync_outbox","sync_meta","memory_traces","private_documents",
     "private_vocabulary","private_sentences","private_media_reviews","private_prosody_captures"])
     if(!db.objectStoreNames.contains(name))
      db.createObjectStore(name,{keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id"});
   };
   request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
  await new Promise<void>((resolve,reject)=>{
   const tx=database.transaction("study_events","readwrite");
   for(const event of events)tx.objectStore("study_events").put(event);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  database.close();
 },e19);
}
test("E22 desktop and mobile chapter path distinguishes guided progress, independent writing and spaced review",async({page})=>{
 const atlas=await openLearn(page);
 await expect(atlas.getByRole("heading",{name:"Your learning path"})).toBeVisible();
 await atlas.getByRole("button",{name:/Daily Life/}).click();
 await expect(atlas.getByRole("heading",{name:/Daily Life/})).toBeVisible();
 await expect(atlas).toContainText("source-linked guided lessons complete");
 await expect(atlas).toContainText("delayed checks currently ready");
 await expect(atlas).toContainText("writing-eligible sources");
 const cafe=atlas.locator(".ux1-node").filter({hasText:"Order a drink politely"});
 await expect(cafe).toBeVisible();
 await cafe.getByRole("button",{name:/^(Start lesson|Practise lesson)$/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await page.getByRole("button",{name:"Exit"}).click();
 await expect(atlas).toBeVisible();
 await atlas.getByRole("button",{name:/Browse next original chapter/}).click();
 await expect(atlas.getByRole("heading",{name:/Out & About/})).toBeVisible();
 await atlas.getByLabel("Learning level").selectOption("A2");
 await expect(atlas.getByRole("button",{name:/Connected conversations/})).toBeVisible();
 await expect(atlas.getByRole("button",{name:/Everyday problem solving/})).toBeVisible();
});
test("E22 unlinked A2 chapter opens the matching original source-only workshop without inventing a grade",async({page})=>{
 const atlas=await openLearn(page);
 await atlas.getByLabel("Learning level").selectOption("A2");
 const preview=atlas.locator(".ux1-node").filter({hasText:"Original THIEPN source · ungraded"}).first();
 await expect(preview).toBeVisible();
 const title=await preview.locator("h3").innerText();
 await preview.getByRole("button",{name:"Study original source-only workshop"}).click();
 const workshop=page.getByRole("region",{name:"Source-only A2 communication workshop"});
 await expect(workshop).toBeVisible();
 await expect(workshop.getByLabel("Choose an original A2-oriented situation").locator("option:checked")).toHaveText(title);
 await expect(workshop).toContainText("zero scored items");
 await expect(workshop.getByRole("heading",{name:"Source-only A2 communication workshop"})).toBeFocused();
});
test("E22 source-linked A1 chapter resumes the real existing owner-private independent writing engine",async({page})=>{
 await seedPrivateE19(page);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,false);
 const atlas=page.getByRole("region",{name:"Your learning path"});
 const sourceTitle=e19.key.split(":")[1]!;
 // The same original scene ID remains the owner of the writing evidence.
 const node=atlas.locator(".ux1-node").filter({has:page.locator("button",{hasText:"Revise saved private message"})}).first();
 // Some A1 cases appear in other chapters, so visit their real A1 chapter.
 if(!await node.count()){
  for(const group of ["First Words","People & Time","Daily Life","Out & About","Keep Talking"]){
   await atlas.getByRole("button",{name:new RegExp(group)}).click();
   if(await atlas.getByRole("button",{name:"Revise saved private message"}).count())break;
  }
 }
 const resume=atlas.getByRole("button",{name:"Revise saved private message"}).first();
 await expect(resume).toBeVisible();
 await resume.click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await expect(page.locator("main.j5-study-shell")).toContainText(/Independent Japanese|original Japanese|revision/i);
});
test("E22 full five-chapter navigator fits compact and Android mobile screens",async({page},testInfo)=>{
 test.skip(testInfo.project.name==="desktop-chromium","Mobile geometry only");
 const atlas=await openLearn(page);
 await atlas.getByRole("button",{name:/Keep Talking/}).click();
 await expect(atlas.getByRole("heading",{name:/Keep Talking/})).toBeVisible();
 const next=atlas.getByRole("button",{name:/Browse A2-oriented original situations/});
 await next.scrollIntoViewIfNeeded();
 const box=await next.boundingBox(),viewport=page.viewportSize()!;
 expect(box).not.toBeNull();
 expect(box!.height).toBeGreaterThanOrEqual(44);
 expect(box!.x).toBeGreaterThanOrEqual(-1);
 expect(box!.x+box!.width).toBeLessThanOrEqual(viewport.width+1);
 await next.click();
 await expect(atlas.getByRole("heading",{name:/Connected conversations/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("E24 original delayed review is accessible across chapters without switching the selected chapter",async({page})=>{
 await page.goto("./");
 await page.evaluate(async({owner,events})=>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const req=indexedDB.open("thiepn-japanese:"+owner,8);
   req.onupgradeneeded=()=>{
    for(const name of ["study_events","sync_outbox","sync_meta","memory_traces","private_documents",
     "private_vocabulary","private_sentences","private_media_reviews","private_prosody_captures"])
     if(!req.result.objectStoreNames.contains(name))
      req.result.createObjectStore(name,{keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id"});
   };
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction("study_events","readwrite");
   for(const event of events)tx.objectStore("study_events").put(event);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  db.close();
 },e24);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,false);
 const atlas=page.getByRole("region",{name:"Your learning path"});
 // E07 may initially select the actual due source's chapter; deliberately move
 // elsewhere to test cross-chapter access without depending on FSRS due counts.
 await atlas.getByRole("button",{name:/First Words/}).click();
 await expect(atlas.getByRole("heading",{name:/First Words/})).toBeVisible();
 const cross=atlas.getByRole("region",{name:"Ready source reviews outside this chapter"});
 await expect(cross).toContainText("Order a drink politely");
 await expect(atlas.getByRole("region",{name:"Existing Today or FSRS priority"})).toBeVisible();
 await cross.getByRole("button",{name:/Order a drink politely/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await expect(page.locator("main.j5-study-shell")).toContainText(/Delayed A1 transfer|changed|review/i);
 await page.getByRole("button",{name:"Exit"}).click();
 await expect(atlas.getByRole("heading",{name:/First Words/})).toBeVisible();
});
