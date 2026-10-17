import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e19-browser-seed.json","utf8")) as {
 guest:string;key:string;events:Array<Record<string,unknown>>;firstText:string;
};
async function seedOriginalOwner(page:import("@playwright/test").Page){
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
}
test("E19 source prerequisites lead the learner to the original Japanese listening lesson",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 const studio=page.getByRole("region",{name:"Write, compare and revise your own Japanese"});
 await expect(studio).toBeVisible();
 await expect(studio).toContainText("Original listening");
 await expect(studio.getByRole("button",{name:"Study original listening and reading"})).toBeEnabled();
 await studio.getByRole("button",{name:"Study original listening and reading"}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 await expect(page.locator("main.j5-study-shell")).toContainText(/A1|A2/);
});
test("E19 owner-private first draft continues to a distinct native unscored revised writing event",async({page})=>{
 await seedOriginalOwner(page);
 const studio=page.getByRole("region",{name:"Write, compare and revise your own Japanese"});
 await expect(studio).toBeVisible();
 await expect(studio.getByRole("button",{name:"Continue independent revision"})).toBeEnabled();
 const hiddenDraft=studio.getByText(fixture.firstText);
 await expect(hiddenDraft).not.toBeVisible();
 await studio.getByRole("button",{name:"Continue independent revision"}).click();
 const main=page.locator("main.j5-study-shell");
 await expect(main).toBeVisible();
 const revision=main.getByRole("heading",{name:"Revise your first original Japanese message"});
 for(let i=0;i<12&&!await revision.isVisible();i++){
  await main.locator("button.j5-next").click();
 }
 await expect(revision).toBeVisible();
 await expect(main.locator(".e19-revision pre")).toContainText(fixture.firstText);
 await main.locator(".e19-revision button").filter({hasText:"Use my original as a starting point"}).click();
 await expect(main.getByRole("button",{name:"Record E19 unscored revision"})).toBeDisabled();
 const second="おはようございます。今日もよろしくお願いいたします。会場でお待ちしています。";
 await main.locator(".j5-writing textarea").fill(second);
 await main.getByRole("button",{name:"Record E19 unscored revision"}).click();
 await expect(main.locator(".j5-feedback")).toContainText("Response recorded");
 const stored=await page.evaluate(async(guest)=>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   const req=indexedDB.open("thiepn-japanese:"+guest,8);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  const items=await new Promise<Array<Record<string,unknown>>>((resolve,reject)=>{
   const req=db.transaction("study_events","readonly").objectStore("study_events").getAll();
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  db.close();return items;
 },fixture.guest);
 const revised=stored.filter(e=>(e.metadata as Record<string,unknown>|undefined)?.e19===true);
 expect(revised).toHaveLength(1);
 expect(revised[0]?.result).toBe("skipped");
 expect((revised[0]?.metadata as Record<string,unknown>)?.learnerResponse).toBe(second);
 expect((revised[0]?.metadata as Record<string,unknown>)?.schedulerExcluded).toBe(true);
 await page.getByRole("button",{name:"Exit"}).click();
 await expect(studio.getByRole("button",{name:"Revise again"})).toBeVisible();
 await studio.getByText("Compare my saved private drafts").click();
 await expect(studio.getByText(second)).toBeVisible();
});
test("E19 original writing comparison and original source navigation fit compact mobile",async({page},testInfo)=>{
 test.skip(testInfo.project.name==="desktop-chromium","Mobile responsive acceptance only");
 await seedOriginalOwner(page);
 const studio=page.getByRole("region",{name:"Write, compare and revise your own Japanese"});
 await expect(studio).toBeVisible();
 await studio.getByRole("button",{name:"A2",exact:true}).click();
 const a2Choice=studio.getByLabel("Original writing situation");
 if(await a2Choice.count()){
  await expect(a2Choice).toBeVisible();
 }else{
  // An A2-only empty result is correct when provisional source material has
  // no admissible canonical link; never invent an A2 can-do just for the UI.
  await expect(studio.getByRole("status")).toContainText("No canonically source-linked original writing situations");
 }
 await studio.getByRole("button",{name:"A1",exact:true}).click();
 await expect(studio.getByLabel("Original writing situation")).toBeVisible();
 const target=studio.getByRole("button",{name:"Continue independent revision"});
 await expect(target).toBeVisible();
 await target.scrollIntoViewIfNeeded();
 const b=await target.boundingBox(),viewport=page.viewportSize()!;
 expect(b).not.toBeNull();
 expect(b!.height).toBeGreaterThanOrEqual(44);
 expect(b!.x).toBeGreaterThanOrEqual(-1);
 expect(b!.x+b!.width).toBeLessThanOrEqual(viewport.width+1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
