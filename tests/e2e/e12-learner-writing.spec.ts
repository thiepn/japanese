import {openAdditionalLearn} from "./open-additional-learn";
import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e12-browser-seed.json","utf8")) as {
 guest:string;caseId:string;events:Array<Record<string,unknown>>
};
test.setTimeout(90_000);

test("E12 browser: source-gated guest first message, skip optional checks, revise, reload and preserve original events",async({page})=>{
 await page.goto("./");
 // Disposable browser account only. Reuse the exact original IndexedDB version
 // and owner key; never add a mock route, fixture API or alternative event store.
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
     const store=tx.objectStore("study_events");
     for(const event of events)store.put(event);
     tx.oncomplete=()=>resolve();
     tx.onerror=()=>reject(tx.error);
     tx.onabort=()=>reject(tx.error);
   });
   db.close();
 },fixture);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,false);
 await page.locator("details.e07-track-list > summary").click();
 const caseCard=page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"});
 await expect(caseCard).toBeVisible();
 await expect(caseCard).toContainText("Listening source done");
 await expect(caseCard).toContainText("Text/form source done");
 await caseCard.getByRole("button",{name:/Optional E11–E12 conversation/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();

 const first=page.getByRole("button",{name:"Record unscored E11 writing"});
 for(let i=0;i<24&&!await first.isVisible();i++){
   const skip=page.locator("main.j5-study-shell .e11-optional-note button");
   if(await skip.isVisible())await skip.click();
   else await page.locator("main.j5-study-shell button.j5-next").click();
 }
 await expect(first).toBeVisible();
 const original="ご連絡ありがとうございます。午後の交流会は西の入り口から入ります。確認してください。";
 await page.locator("main.j5-study-shell textarea").fill(original);
 await expect(first).toBeEnabled();
 await first.click();
 await expect(page.locator("main.j5-study-shell .j5-feedback")).toContainText("Response recorded");
 await page.locator("main.j5-study-shell button.j5-next").click();
 // The original separate E12 revision coach is a genuine StudyLesson.
 await expect(page.getByRole("heading",{name:/Revise the message, not just the checklist/})).toBeVisible();
 await page.locator("main.j5-study-shell button.j5-next").click();
 await expect(page.getByRole("heading",{name:/Second message/})).toBeVisible();
 await expect(page.locator(".e12-revision pre")).toContainText(original);
 const revised=page.getByRole("button",{name:"Record E12 unscored revision"});
 await expect(revised).toBeDisabled();
 await page.getByRole("button",{name:"Use my first draft as a starting point"}).click();
 await expect(revised).toBeDisabled();
 const changed="ご連絡ありがとうございます。午後六時の交流会は西の入り口で受付します。場所をご確認ください。";
 await page.locator("main.j5-study-shell textarea").fill(changed);
 await expect(revised).toBeEnabled();
 await revised.click();
 await expect(page.locator("main.j5-study-shell .j5-feedback")).toContainText("Response recorded");

 const evidence=await page.evaluate(async guest=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{
     const request=indexedDB.open("thiepn-japanese:"+guest,8);
     request.onsuccess=()=>resolve(request.result);
     request.onerror=()=>reject(request.error);
   });
   const result=await new Promise<{events:Array<Record<string,unknown>>;traces:number}>((resolve,reject)=>{
     const tx=db.transaction(["study_events","memory_traces"],"readonly");
     const events=tx.objectStore("study_events").getAll();
     const traces=tx.objectStore("memory_traces").count();
     tx.oncomplete=()=>resolve({events:events.result,traces:traces.result});
     tx.onerror=()=>reject(tx.error);
   });
   db.close();
   return result;
 },fixture.guest);
 const optional=evidence.events.filter(e=>{
   const m=e.metadata as Record<string,unknown>|undefined;
   return m?.e11===true&&m?.e06CaseId===fixture.caseId;
 });
 expect(optional).toHaveLength(2);
 expect(optional.map(e=>(e.metadata as Record<string,unknown>).e11Task).sort()).toEqual(["independent-letter","revised-letter"]);
 expect(optional.every(e=>e.result==="skipped")).toBe(true);
 expect(optional.every(e=>(e.metadata as Record<string,unknown>).nonAuthoritative===true)).toBe(true);
 expect(evidence.traces).toBe(0); // Skipped optional practice never creates FSRS mastery.

 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await openAdditionalLearn(page,false);
 await page.locator("details.e07-track-list > summary").click();
 const recovered=page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"});
 await expect(recovered).toContainText("first message recorded");
 await expect(recovered).toContainText("revised message recorded");
});
