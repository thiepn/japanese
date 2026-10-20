import {expect,test} from "@playwright/test";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,type BeginnerStageId} from "../../apps/web/src/study/beginnerCourse";

const stages:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function hiraganaEvidence(){
  let events:ReturnType<typeof createStudyEvent>[]=[];
  for(const id of stages){
    const steps=buildBeginnerStage(id,events).filter((step):step is StudyPrompt=>!isStudyLesson(step));
    events=[...events,...steps.map((prompt,index)=>createStudyEvent({
      id:"seed-hira-"+id+"-"+index,userId:"00000000-0000-4000-8000-000000000001",
      deviceId:"temporary-browser-fixture",prompt,response:prompt.acceptedAnswers[0]!,
      occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100
    }))];
  }
  return events;
}
test("original A1 reading comprehension unlocks after hiragana and survives browser reload",async({page,context},testInfo)=>{
  await page.goto("./");
  await expect(page.getByRole("button",{name:"Read A1 sentences"})).toHaveCount(0);
  await page.evaluate(async events=>{
    const req=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    try{
      await new Promise<void>((resolve,reject)=>{
        const tx=db.transaction("study_events","readwrite");
        for(const event of events)tx.objectStore("study_events").add(event);
        tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  },hiraganaEvidence());
  await page.reload();
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
  const card=page.locator(".kana-words-entry");
  await expect(card).toContainText("0 of 7 original A1 sentences attempted");
  await card.getByRole("button",{name:"Read A1 sentences"}).click();
  await expect(page.locator(".j5-sheet")).toContainText("ほんをよみます。");
  await page.locator(".j5-choices").getByRole("button",{name:"I read a book.",exact:true}).click();
  await expect(page.locator(".j5-feedback")).toContainText("Context matched");
  await expect(page.locator(".j5-feedback")).toContainText("not a mastery grade");
  await expect(page.locator(".j5-feedback")).toContainText("本を読みます。");
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(card).toContainText("1 of 7 original A1 sentences attempted");
  const evidence=await page.evaluate(async()=>{
    const req=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    try{
      return await new Promise<{events:Array<{id:string;result:string;metadata?:{promptId?:string;nonAuthoritative?:boolean}}>;traces:string[]}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const ev=tx.objectStore("study_events").getAll();
        const traces=tx.objectStore("memory_traces").getAll();
        tx.oncomplete=()=>resolve({events:(ev.result as Array<{id:string;result:string;metadata?:{promptId?:string;nonAuthoritative?:boolean}}>).filter(item=>item.metadata?.promptId?.startsWith("a0-source-reading-")),
          traces:(traces.result as Array<{id:string}>).map(item=>item.id)});
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
  expect(evidence.events).toHaveLength(1);
  expect(evidence.events[0]).toMatchObject({result:"skipped",metadata:{nonAuthoritative:true,promptId:"a0-source-reading-sentence-a1-004"}});
  expect(evidence.traces.filter(id=>id.startsWith("sentence:sentence-a1-004:"))).toHaveLength(0);
  await page.reload();
  await expect(card).toContainText("1 of 7 original A1 sentences attempted");
  await page.evaluate(async()=>{
    if(!("serviceWorker" in navigator))throw new Error("A0_SOURCE_READING_SERVICE_WORKER_UNAVAILABLE");
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(card).toContainText("1 of 7 original A1 sentences attempted");
    await card.getByRole("button",{name:"Read A1 sentences"}).click();
    await expect(page.locator(".j5-sheet")).toContainText("えきにいきます。");
    await page.getByRole("button",{name:"Exit",exact:true}).click();
  }finally{
    await context.setOffline(false);
  }
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.locator(".kana-words-entry")).toContainText("1 of 7 original A1 sentences attempted");
  await page.locator(".kana-words-entry").getByRole("button",{name:"Read A1 sentences"}).click();
  await expect(page.locator(".j5-sheet")).toContainText("えきにいきます。");
  if(testInfo.project.name!=="desktop-chromium"){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("incorrect original A1 comprehension gives source-token correction and stays available for retry",async({page})=>{
  await page.goto("./");
  // Disposable original hiragana evidence; the production course writer is unchanged.
  await page.evaluate(async events=>{
    const req=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    try{
      await new Promise<void>((resolve,reject)=>{
        const tx=db.transaction("study_events","readwrite");
        for(const item of events)tx.objectStore("study_events").add(item);
        tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  },hiraganaEvidence());
  await page.reload();
  const card=page.locator(".kana-words-entry");
  await card.getByRole("button",{name:"Read A1 sentences"}).click();
  await expect(page.locator(".j5-sheet")).toContainText("ほんをよみます。");
  // The original first source sentence has its correct option at position zero.
  await page.locator(".j5-choices").getByRole("button").nth(1).click();
  await expect(page.locator(".j5-feedback")).toContainText("Recheck the new context");
  await expect(page.locator(".j5-feedback")).toContainText("本 (ほん) — book");
  await expect(page.locator(".j5-feedback")).toContainText("を — marks the direct object of an action");
  await expect(page.locator(".j5-feedback")).toContainText("〜ます — polite nonpast verb predicate");
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(card).toContainText("1 of 7 original A1 sentences attempted");
  await expect(card).toContainText("1 to retry");
  await page.reload();
  await expect(card).toContainText("1 to retry");
  await card.getByRole("button",{name:"Read A1 sentences"}).click();
  await expect(page.locator(".j5-sheet")).toContainText("えきにいきます。");
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
});
