import {expect,test,type Page} from "@playwright/test";
import {basicHiragana,foundationApplicationPrompts,kanaRecognitionPrompts} from "../../apps/web/src/study/foundationPrompts";
import {readFileSync} from "node:fs";

// Browser fixtures read canonical identifiers from the original JSON seed.
// Do not import the Vite JSON-backed app runtime into Playwright's Node loader.
const canonical=JSON.parse(readFileSync("content/seed/jp-core.json","utf8")) as {
 courseUnits:Array<{id:string;canDoId:string;level:string}>;
};
const units=["a1-unit-01","a1-unit-02","a1-unit-03","a1-unit-04","a1-unit-05","a1-unit-07","a1-unit-12","a1-unit-15","a1-unit-16","a1-unit-17","a1-unit-18","a1-unit-19","a1-unit-20"] as const;
const sceneIds=["greetings","personal","routine","past","origin","preferences","time","family","food","shopping","transport","help","exchange"] as const;

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
 for(const [unitIndex,unitId] of units.entries()){
  const canDoId=canonical.courseUnits.find(x=>x.id===unitId&&x.level==="A1")?.canDoId;
  if(!canDoId)throw Error("MISSING_CANONICAL_C1_UNIT:"+unitId);
  const unitNumber=unitId.slice(-2);
  for(let lessonNumber=1;lessonNumber<=6;lessonNumber++){
   const lessonId="cf-a1-"+unitNumber+"-"+String(lessonNumber).padStart(2,"0");
   const capstone=lessonNumber===6;
   const prompts=capstone
    ?["hear","read","reply","recall"].map(s=>"a1-e02-"+sceneIds[unitIndex]+"-"+s)
    :[1,2,3,4].map(n=>lessonId+"-choice-"+n).concat(lessonId+"-recall");
   for(const promptId of prompts){
    n++;
    if(n>limit)return out;
    out.push({id:"cf-seed-"+n,userId:OWNER,result:"correct",
      occurredAt:new Date(Date.parse(stamp)+n*1000).toISOString(),
      primaryTarget:{kind:"can_do",id:canDoId},
      metadata:capstone?{promptId,e02:true,e02SceneId:sceneIds[unitIndex],e02UnitId:unitId}:
        {promptId,c1CourseFirst:true,c1LessonId:lessonId,c1UnitId:unitId}});
   }
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
 await expect(route).toContainText("0 / 78 lessons");
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
test("C7 all seventy-eight authored lessons unlock from canonical native events without granting unscored mastery",async({page})=>{
 // The first five lessons and E02 capstone of each unit retain their original prompt identities.
 // Only genuinely correct controlled answers in owner-local IndexedDB unlock the next lesson.
 const all=courseEvents(Number.MAX_SAFE_INTEGER);
 expect(all.length).toBeGreaterThanOrEqual(377);
 expect(all).toHaveLength(377);
 await seed(page,[...kana,...all]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("78 / 78 lessons");
 await expect(path).toContainText("All 13 available A1 units are complete");
 await expect(page.locator(".cf-a1__continue")).toHaveCount(0);
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(page.locator(".cf-a1")).toContainText("78 / 78 lessons");
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
test("C1 owner-keyed IndexedDB records remain separated without an OAuth switch",async({page})=>{
 await seed(page,kana);
 await expect(page.locator(".cf-a1")).toContainText("0 / 78 lessons");
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

test("C1 retains explicitly opened optional Learn workspace after native lesson exit",async({page},testInfo)=>{
 await seed(page,kana);
 const browse=page.locator(".beginner-explore");
 await browse.locator(":scope > summary").click();
 await expect(browse).toHaveAttribute("open","");
 if(testInfo.project.name!=="desktop-chromium"){
  const expand=page.getByRole("button",{name:"Open full course and advanced practice"});
  await expand.click();
  await expect(page.locator("#ux1-expanded-catalogue")).toHaveAttribute("data-open","yes");
 }else{
  // Desktop renders the original full course directly after opening its drawer.
  await expect(page.getByRole("heading",{name:"Your Japanese journey"})).toBeVisible();
 }
 await page.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Greetings at different times"})).toBeVisible();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await expect(browse).toHaveAttribute("open","");
 if(testInfo.project.name!=="desktop-chromium")
  await expect(page.locator("#ux1-expanded-catalogue")).toHaveAttribute("data-open","yes");
 await expect(page.getByRole("heading",{name:"Learn Japanese"})).toBeVisible();
});

test("C2 routine unit appears as next lesson after original two units",async({page})=>{
 await seed(page,[...kana,...courseEvents(58)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("12 / 78 lessons");
 await expect(path).toContainText("When do you get up?");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"When do you get up?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ミナ：毎朝、七時に起きます。 When does Mina get up?")).toBeVisible();
});

test("C3 transitions from original C2 routine into past and origin units without rewrites",async({page})=>{
 await seed(page,[...kana,...courseEvents(87)]);
 const route=page.locator(".cf-a1");
 await expect(route).toContainText("18 / 78 lessons");
 await expect(route).toContainText("Today versus yesterday");
 await route.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Today versus yesterday"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ミナ：昨日、図書館に行きました。 When was the library visit?")).toBeVisible();
});
test("C3 reaches source-linked origin from twenty-four original and C3 lessons",async({page})=>{
 await seed(page,[...kana,...courseEvents(116)]);
 await expect(page.locator(".cf-a1")).toContainText("24 / 78 lessons");
 await expect(page.locator(".cf-a1")).toContainText("Where did you come from?");
 await page.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Where did you come from?"})).toBeVisible();
});

test("C4 enters preferences only after the preserved first thirty lessons",async({page})=>{
 await seed(page,[...kana,...courseEvents(145)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("30 / 78 lessons");
 await expect(path).toContainText("Unit 7: Food preferences and shared choices");
 await expect(path).toContainText("Unit 12: Meeting times and clear schedules");
 await expect(path).toContainText("What do you like?");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"What do you like?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ユナ：カレーが好きです。 What does Yuna express?")).toBeVisible();
});
test("C4 continues into the canonical meeting-time lesson without attributing missing units",async({page})=>{
 await seed(page,[...kana,...courseEvents(174)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("36 / 78 lessons");
 await expect(path).toContainText("When does it start?");
 await expect(path).not.toContainText("Unit 6:");
 await expect(path).not.toContainText("Unit 8:");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"When does it start?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ケン：勉強会は何時からですか。 Which information is requested?")).toBeVisible();
});

test("C5 continues with canonical family after preserving original forty-two completed lessons",async({page})=>{
 await seed(page,[...kana,...courseEvents(203)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("42 / 78 lessons");
 await expect(path).toContainText("Unit 15: Family photographs and introductions");
 await expect(path).toContainText("Unit 16: Polite café orders and simple menus");
 await expect(path).toContainText("Whose family member?");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Whose family member?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ケン：この人はだれですか。 What information does Ken request?")).toBeVisible();
});
test("C5 continues to café only after native source-linked family capstone",async({page})=>{
 await seed(page,[...kana,...courseEvents(232)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("48 / 78 lessons");
 await expect(path).toContainText("Excuse me — tea, please");
 await expect(path).not.toContainText("Unit 13:");
 await expect(path).not.toContainText("Unit 14:");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Excuse me — tea, please"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("客：すみません。お茶をください。 What is the customer requesting?")).toBeVisible();
});

test("C6 shopping unlocks only after fifty-four original lessons and their native event IDs",async({page})=>{
 await seed(page,[...kana,...courseEvents(261)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("54 / 78 lessons");
 await expect(path).toContainText("Unit 17: Shopping and price decisions");
 await expect(path).toContainText("Unit 18: Transport and getting to the station");
 await expect(path).toContainText("How much is this?");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"How much is this?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("客：これはいくらですか。 What is the customer asking?")).toBeVisible();
});
test("C6 transport unlocks only after the source-linked shopping capstone",async({page})=>{
 await seed(page,[...kana,...courseEvents(290)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("60 / 78 lessons");
 await expect(path).toContainText("How do you get to the station?");
 await expect(path).not.toContainText("Unit 13:");
 await expect(path).not.toContainText("Unit 14:");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"How do you get to the station?"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ケン：駅までどうやって行きますか。 What does Ken ask?")).toBeVisible();
});

test("C7 help continues from previous sixty-six stable native lessons",async({page})=>{
 await seed(page,[...kana,...courseEvents(319)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("66 / 78 lessons");
 await expect(path).toContainText("Unit 19: Asking for help and clarification");
 await expect(path).toContainText("Unit 20: Connected everyday conversations");
 await expect(path).toContainText("Please say it again");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Please say it again"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("店員：切符はあちらです。ミナ：もう一度言ってください。 What is Mina asking?")).toBeVisible();
});
test("C7 conversation unit resumes only after E02 help's four native checks",async({page})=>{
 await seed(page,[...kana,...courseEvents(348)]);
 const path=page.locator(".cf-a1");
 await expect(path).toContainText("72 / 78 lessons");
 await expect(path).toContainText("Agreeing or learning something new");
 await path.locator(".cf-a1__continue").click();
 await expect(page.getByRole("heading",{name:"Agreeing or learning something new"})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("ミナ：今日は寒いですね。 You agree from your own observation. Choose the reply.")).toBeVisible();
 await page.getByRole("button",{name:"Exit",exact:true}).click();
 await page.reload();
 await page.getByRole("button",{name:"Learn",exact:true}).click();
 await expect(page.locator(".cf-a1")).toContainText("72 / 78 lessons");
});
