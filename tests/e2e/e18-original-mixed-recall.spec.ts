import {openAdditionalLearn} from "./open-additional-learn";
import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";
const fixture=JSON.parse(readFileSync("artifacts/e18-browser-seed.json","utf8")) as {
 guest:string;caseKeys:string[];events:Array<Record<string,unknown>>;
};
async function seedOriginalSources(page:import("@playwright/test").Page){
 await page.goto("./");
 await page.evaluate(async({guest,events})=>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const request=indexedDB.open("thiepn-japanese:"+guest,8);
   request.onupgradeneeded=()=>{
    const database=request.result;
    for(const name of ["study_events","sync_outbox","sync_meta","memory_traces","private_documents",
      "private_vocabulary","private_sentences","private_media_reviews","private_prosody_captures"]){
     if(!database.objectStoreNames.contains(name))database.createObjectStore(name,{
      keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id"
     });
    }
   };
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction("study_events","readwrite");
   for(const event of events)tx.objectStore("study_events").put(event);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  db.close();
 },fixture);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,false);
}
test("E18 initially sends learner to original linked source rather than offering unsourced mixed grades",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,false);
 const section=page.getByRole("region",{name:"Recall across real situations"});
 await expect(section).toBeVisible();
 await expect(section).toContainText("Complete all controlled questions in at least two");
 await section.getByRole("button",{name:/Continue original lesson/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
});
test("E18 mixed listening/reading uses existing Study Player and unchanged original source",async({page})=>{
 await seedOriginalSources(page);
 const section=page.getByRole("region",{name:"Recall across real situations"});
 await expect(section).toBeVisible();
 await expect(section.locator(".ux3-mixed__case[aria-pressed='true']")).toHaveCount(2);
 await section.getByLabel("Choose your retrieval focus").selectOption("listen-read");
 await section.getByRole("button",{name:"Start 2-situation original review"}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await expect(page.locator("main.j5-study-shell")).toContainText(/Different original situations|previously encountered|canonical/i);
 await expect(page.locator("main.j5-study-shell textarea")).toHaveCount(0);
});
test("E18 mixed source controls fit compact mobile without loss of native modes",async({page},testInfo)=>{
 test.skip(testInfo.project.name==="desktop-chromium","Mobile viewport acceptance only");
 await seedOriginalSources(page);
 const section=page.getByRole("region",{name:"Recall across real situations"});
 await expect(section.locator(".ux3-mixed__case")).toHaveCount(3);
 await section.getByLabel("Choose your retrieval focus").selectOption("respond-recall");
 const start=section.getByRole("button",{name:"Start 2-situation original review"});
 await expect(start).toBeEnabled();
 await start.scrollIntoViewIfNeeded();
 const rect=await start.boundingBox();
 const viewport=page.viewportSize()!;
 expect(rect).not.toBeNull();
 expect(rect!.x).toBeGreaterThanOrEqual(-1);
 expect(rect!.x+rect!.width).toBeLessThanOrEqual(viewport.width+1);
 expect(rect!.height).toBeGreaterThanOrEqual(44);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
 await start.click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
});
