import {enterAdvancedLearn} from "./support/courseNavigation";
import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";
import {E11_RESPONSE_BY_CASE} from "../../apps/web/src/study/e11ResponseMissions";
import {E11_BY_CASE} from "../../apps/web/src/study/e11PracticalTransfer";

const fixture=JSON.parse(readFileSync("artifacts/e12-browser-seed.json","utf8")) as {
 guest:string;caseId:string;events:Array<Record<string,unknown>>
};
const mission=E11_RESPONSE_BY_CASE.get(fixture.caseId);
const source=E11_BY_CASE.get(fixture.caseId);
if(!mission||!source)throw Error("E13_SOURCE_FIXTURE_CASE_MISSING");
test.setTimeout(90_000);

test("E13 source-anchored reply decisions run in StudyPlayer and record only unscored original events",async({page})=>{
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
           keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id",
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
 await page.reload();
 await enterAdvancedLearn(page);
 await page.locator("details.e07-track-list > summary").click();
 const card=page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"});
 await expect(card).toContainText("0/2 practical reply decisions");
 await card.getByRole("button",{name:/Optional E11–E12 conversation/}).click();
 await expect(page.locator("main.j5-study-shell")).toBeVisible();
 const scope=page.locator("main.j5-study-shell");

 // Move through the original E11 listening/reading and revealed turn lessons.
 // Skips never create mastery or StudyEvents.
 for(let i=0;i<25&&!await scope.getByText(mission.decisions[0].question,{exact:true}).isVisible();i++){
   const skip=scope.locator(".e11-optional-note button");
   if(await skip.isVisible())await skip.click();
   else await scope.locator("button.j5-next").click();
 }
 await expect(scope.getByText(mission.decisions[0].question,{exact:true})).toBeVisible();
 const correct=source.turns[mission.decisions[0].correctTurn]!.ja;
 await scope.getByRole("button",{name:correct,exact:false}).click();
 await expect(scope.locator(".j5-feedback")).toContainText("Context matched");
 await expect(scope.locator(".e06-boundary")).toContainText("no original FSRS or CEFR award");
 await scope.locator("button.j5-next").click();

 await expect(scope.getByText(mission.decisions[1].question,{exact:true})).toBeVisible();
 const foil=source.turns[mission.decisions[1].contrastTurns[0]]!.ja;
 await scope.getByRole("button",{name:foil,exact:false}).click();
 await expect(scope.locator(".j5-feedback")).toContainText("Recheck the new context");
 // The wrong reply has source-specific correction, but is NOT FSRS grade.
 await expect(scope.locator(".j5-feedback")).toContainText(source.turns[mission.decisions[1].correctTurn]!.intent);

 const rows=await page.evaluate(async guest=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{
     const request=indexedDB.open("thiepn-japanese:"+guest,8);
     request.onsuccess=()=>resolve(request.result);
     request.onerror=()=>reject(request.error);
   });
   const answer=await new Promise<{rows:Array<Record<string,unknown>>;traces:number}>((resolve,reject)=>{
     const tx=db.transaction(["study_events","memory_traces"],"readonly");
     const events=tx.objectStore("study_events").getAll();
     const traces=tx.objectStore("memory_traces").count();
     tx.oncomplete=()=>resolve({rows:events.result,traces:traces.result});
     tx.onerror=()=>reject(tx.error);
   });
   db.close();
   return answer;
 },fixture.guest);
 const performed=rows.rows.filter(item=>{
   const m=item.metadata as Record<string,unknown>|undefined;
   return m?.e11RoleResponse===true&&m.e11CaseId===fixture.caseId;
 });
 expect(performed).toHaveLength(2);
 expect(performed.every(item=>item.result==="skipped")).toBe(true);
 expect(performed.map(item=>(item.metadata as Record<string,unknown>).e11Task).sort())
   .toEqual(["e11-role-response-1","e11-role-response-2"]);
 expect(rows.traces).toBe(0);
 await page.reload();
 await enterAdvancedLearn(page);
 await page.locator("details.e07-track-list > summary").click();
 await expect(page.locator(".e06-course__case").filter({hasText:"Meet someone and ask for help"}))
   .toContainText("2/2 practical reply decisions (not a mastery score)");
});
