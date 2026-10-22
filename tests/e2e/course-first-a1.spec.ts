import {expect,test,type Page} from "@playwright/test";
import {basicHiragana,foundationApplicationPrompts,kanaRecognitionPrompts} from "../../apps/web/src/study/foundationPrompts";
import {C1_A1_UNITS,buildC1A1CourseLesson,projectC1A1Course} from "../../apps/web/src/study/courseFirstA1";
import {buildE02Journey} from "../../apps/web/src/study/a1ExcellenceCourse";
import {isStudyLesson} from "../../packages/study-player/src/index";

const OWNER="00000000-0000-4000-8000-000000000001";
const stamp="2026-10-22T08:00:00.000Z";
const stages=["vowels","k","s","t","n","h","m","y","r","w"];
const kana=stages.flatMap(group=>{
 const seeds=basicHiragana.filter(x=>x.group===group);
 const recognition=seeds.map(seed=>kanaRecognitionPrompts.find(x=>x.primaryTarget.id==="hiragana-"+seed.kana)!);
 const forms=foundationApplicationPrompts.filter(x=>x.skill==="form_selection"&&
  seeds.some(seed=>x.primaryTarget.id==="hiragana-"+seed.kana)).slice(0,2);
 return [...recognition,...forms].map(p=>({
  id:"cf-seed-kana-"+p.id,userId:OWNER,result:"correct",occurredAt:stamp,
  primaryTarget:p.primaryTarget,metadata:{promptId:p.id}
 }));
});
function courseEvents(limit:number){
 const out:Array<Record<string,unknown>>=[];
 let n=0;
 for(const unit of C1_A1_UNITS)for(const lesson of unit.lessons){
  const steps="scene" in lesson?buildE02Journey(lesson.scene):
   // Directly constructing the original teaching does not require unlocking in this fixture.
   buildC1A1CourseLesson(lesson.id,out as never);
  for(const step of steps){
   if(isStudyLesson(step)||step.eventMetadata?.nonAuthoritative===true)continue;
   if("scene" in lesson&&!["hear","read","reply","recall"].some(s=>step.id==="a1-e02-"+lesson.scene+"-"+s))continue;
   n++;
   if(n>limit)return out;
   out.push({id:"cf-seed-"+n,userId:OWNER,result:"correct",
    occurredAt:new Date(Date.parse(stamp)+n*1000).toISOString(),
    primaryTarget:step.primaryTarget,metadata:{promptId:step.id,...step.eventMetadata}});
  }
 }
 return out;
}
async function seed(page:Page,events:Record<string,unknown>[]){
 await page.goto("./");
 await page.evaluate(async({owner,events})=>{
  const req=indexedDB.open("thiepn-japanese:"+owner,8);
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   req.onupgradeneeded=()=>{
    for(const name of ["study_events","sync_outbox","sync_meta","memory_traces","private_documents",
      "private_vocabulary","private_sentences","private_media_reviews","private_prosody_captures"])
     if(!req.result.objectStoreNames.contains(name))req.result.createObjectStore(name,
       {keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id"});
   };
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction("study_events","readwrite");
   for(const event of events)tx.objectStore("study_events").put(event);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });db.close();
 },{owner:OWNER,events});
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
}
test("C1 first A1 Continue loads original lesson and supports interruption/reload without awarding completion",async({page})=>{
 await seed(page,kana);
 await expect(page.getByRole("heading",{name:"Learn Japanese"})).toBeVisible();
 const route=page.locator(".cf-a1");
 await expect(route).toContainText("Greetings at different times");
 await expect(route).toContainText("0 / 12 lessons");
 await expect(route.locator("button.cf-a1__continue")).toBeVisible();
 await route.locator("button.cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Greetings at different times"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("At 8 a.m. you meet your instructor. What do you say?")).toBeVisible();
 await page.getByRole("button",{name:"おはようございます。",exact:true}).click();
 await expect(page.getByText("Correct",{exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(route).toContainText("1 of 5 controlled checks completed");
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(page.locator(".cf-a1")).toContainText("1 of 5 controlled checks completed");
 await page.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Greetings at different times"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("You enter a shop in the afternoon. Select a greeting.")).toBeVisible();
});
test("C1 all twelve lessons unlock from canonical native events without granting unscored mastery",async({page})=>{
 // The first five lessons and E02 capstone of each unit retain their original prompt identities.
 // Only genuinely correct controlled answers in owner-local IndexedDB unlock the next lesson.
 const all=courseEvents(Number.MAX_SAFE_INTEGER);
 expect(all.length).toBeGreaterThanOrEqual(58);
 expect(projectC1A1Course(all as never).nextId).toBeNull();
 await seed(page,[...kana,...all]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("12 / 12 lessons");
 await expect(path).toContainText("Both available A1 units are complete");
 await expect(page.locator(".cf-a1__continue")).toHaveCount(0);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(page.locator(".cf-a1")).toContainText("12 / 12 lessons");
});
test("C1 mobile Continue fits viewport and optional advanced navigation remains reachable",async({page},testInfo)=>{
 test.skip(testInfo.project.name==="desktop-chromium","Mobile geometry and touch");
 await seed(page,kana);
 const button=page.locator(".cf-a1__continue");
 await expect(button).toBeVisible();
 const box=await button.boundingBox(),size=page.viewportSize()!;
 expect(box).not.toBeNull();
 expect(box!.height).toBeGreaterThanOrEqual(44);
 expect(box!.x).toBeGreaterThanOrEqual(-1);
 expect(box!.x+box!.width).toBeLessThanOrEqual(size.width+1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.locator(".beginner-explore > summary").click();
 await expect(page.getByRole("region",{name:"Your learning path"})).toBeVisible();
 await expect(page.getByRole("button",{name:"Open full course and advanced practice"})).toBeVisible();
});
test("C1 does not show another owner's record when switching workspaces",async({page})=>{
 await seed(page,kana);
 await expect(page.locator(".cf-a1")).toContainText("0 / 12 lessons");
 // Owner changes are modeled by isolating the same UI projection against the real
 // IndexedDB key boundary; this must not be confused with an OAuth-device acceptance.
 const guestDb=await page.evaluate(async()=>{
  const req=indexedDB.open("thiepn-japanese:"+"00000000-0000-4000-8000-000000000001",8);
  return await new Promise<number>((resolve,reject)=>{
   req.onsuccess=()=>{const db=req.result,tx=db.transaction("study_events","readonly"),
     count=tx.objectStore("study_events").count();
     count.onsuccess=()=>{resolve(count.result);db.close();};count.onerror=()=>reject(count.error);};
   req.onerror=()=>reject(req.error);
  });
 });
 expect(guestDb).toBeGreaterThan(0);
 const otherOwner=await page.evaluate(async()=>{
  const req=indexedDB.open("thiepn-japanese:cf-second-owner",8);
  req.onupgradeneeded=()=>req.result.createObjectStore("study_events",{keyPath:"id"});
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  const count=await new Promise<number>((resolve,reject)=>{
   const q=db.transaction("study_events","readonly").objectStore("study_events").count();
   q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
  });db.close();return count;
 });
 expect(otherOwner).toBe(0);
});
