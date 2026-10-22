import {enterAdvancedLearn} from "./support/courseNavigation";
import {readFileSync} from "node:fs";
import {test,expect} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e12-browser-seed.json","utf8")) as {
 guest:string;caseId:string;events:Array<Record<string,unknown>>
};
test.setTimeout(100_000);

/**
 * Browser acceptance of the original account-scoped E07 unsent buffer for an
 * actual E12 revision. This uses only a disposable guest PWA profile and the
 * original IndexedDB stores; it does not impersonate THIEPN Account OAuth.
 */
test("E12 unsent revised writing survives offline restart without events, FSRS or other-owner exposure",async({page,context})=>{
 await page.goto("./");
 await page.evaluate(async({guest,events})=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{
     const request=indexedDB.open("thiepn-japanese:"+guest,8);
     request.onupgradeneeded=()=>{
       const db=request.result;
       for(const name of ["study_events","sync_outbox","sync_meta","memory_traces",
         "private_documents","private_vocabulary","private_sentences",
         "private_media_reviews","private_prosody_captures"]){
         if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{
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
     tx.oncomplete=()=>resolve();
     tx.onerror=()=>reject(tx.error);
   });
   db.close();
 },fixture);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.reload();
 await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
 await enterAdvancedLearn(page);

 await page.locator("details.e07-track-list > summary").click();
 const card=page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"});
 await card.getByRole("button",{name:/Optional E11–E12 conversation/}).click();
 const first=page.getByRole("button",{name:"Record unscored E11 writing"});
 for(let i=0;i<24&&!await first.isVisible();i++){
   const skip=page.locator("main.j5-study-shell .e11-optional-note button");
   if(await skip.isVisible())await skip.click();
   else await page.locator("main.j5-study-shell button.j5-next").click();
 }
 await expect(first).toBeVisible();
 const original="午後の交流会は西の入り口で受付があります。もう一度確認をお願いします。";
 await page.locator("main.j5-study-shell textarea").fill(original);
 await first.click();
 await expect(page.locator(".j5-feedback")).toContainText("Response recorded");
 await page.locator("main.j5-study-shell button.j5-next").click();
 await page.locator("main.j5-study-shell button.j5-next").click();
 const revised=page.getByRole("button",{name:"Record E12 unscored revision"});
 await expect(revised).toBeVisible();
 const draft="午後六時の交流会の受付は西の入り口です。場所を確認していただけますか。";
 await page.getByLabel(/Keep unfinished ungraded writing or recognized speech/).check();
 await page.locator("main.j5-study-shell textarea").fill(draft);
 await expect(page.getByRole("status").filter({hasText:"Draft saved locally."})).toBeVisible();
 // A different user's locally saved value must not appear in the active guest.
 await page.evaluate(guest=>{
   const key=Object.keys(localStorage).find(x=>x.startsWith("thiepn-japanese-e07-original-draft-v1:")&&x.includes(guest));
   if(!key)throw Error("E12_GUEST_DRAFT_KEY_MISSING");
   localStorage.setItem(key.replace(guest,"separate-synthetic-owner"),JSON.stringify({
     text:"SECRET_FROM_OTHER_OWNER",updatedAt:"2026-10-15T10:00:00.000Z"
   }));
 },fixture.guest);
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await context.setOffline(true);
 try{
   await page.reload();
   await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
   await enterAdvancedLearn(page);

 await page.locator("details.e07-track-list > summary").click();
   const returnCard=page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"});
   await expect(returnCard).toContainText("first message recorded");
   await expect(returnCard).toContainText("optional revision pending");
   await returnCard.getByRole("button",{name:/Optional E11–E12 conversation/}).click();
   await page.getByRole("button",{name:/Resume saved draft/}).click();
   await expect(revised).toBeVisible();
   await expect(page.locator(".e12-revision pre")).toContainText(original);
   await expect(page.locator("main.j5-study-shell textarea")).toHaveValue(draft);
   expect(await page.locator("main.j5-study-shell textarea").inputValue()).not.toContain("SECRET_FROM_OTHER_OWNER");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
   const state=await page.evaluate(async guest=>{
     const db=await new Promise<IDBDatabase>((resolve,reject)=>{
       const req=indexedDB.open("thiepn-japanese:"+guest,8);
       req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
     });
     const result=await new Promise<{events:any[];traces:number}>((resolve,reject)=>{
       const tx=db.transaction(["study_events","memory_traces"],"readonly");
       const events=tx.objectStore("study_events").getAll();
       const traces=tx.objectStore("memory_traces").count();
       tx.oncomplete=()=>resolve({events:events.result,traces:traces.result});
       tx.onerror=()=>reject(tx.error);
     });
     db.close();return result;
   },fixture.guest);
   expect(state.events.filter(e=>e.metadata?.e11Task==="independent-letter")).toHaveLength(1);
   expect(state.events.filter(e=>e.metadata?.e11Task==="revised-letter")).toHaveLength(0);
   expect(state.traces).toBe(0);
 }finally{
   await context.setOffline(false);
 }
});
