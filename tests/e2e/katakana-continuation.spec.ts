import {expect,test} from "@playwright/test";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "@thiepn/study-player";
import {buildBeginnerStage,type BeginnerStageId} from "../../apps/web/src/study/beginnerCourse";

const guest="00000000-0000-4000-8000-000000000001";
const hiraganaIds:BeginnerStageId[]=["vowels","k","s","t","n","h","m","y","r","w"];
function originalHiraganaEvents(){
  let events:ReturnType<typeof createStudyEvent>[]=[];
  for(const id of hiraganaIds){
    const steps=buildBeginnerStage(id,events);
    const fresh=steps.filter((step):step is StudyPrompt=>!isStudyLesson(step)).map(prompt=>createStudyEvent({
      id:"disposable-"+prompt.id,userId:guest,deviceId:"e2e-katakana-fixture",
      prompt,response:prompt.acceptedAnswers[0]!,occurredAt:"2026-10-20T09:00:00.000Z",responseTimeMs:100
    }));
    events=[...events,...fresh];
  }
  return events;
}
test("a missed original katakana cue changes position across reload without changing A1",async({page},testInfo)=>{
  await page.goto("./");
  await page.evaluate(async events=>{
    const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      await new Promise<void>((resolve,reject)=>{
        const tx=db.transaction("study_events","readwrite");
        for(const event of events)tx.objectStore("study_events").add(event);
        tx.oncomplete=()=>resolve();
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  },originalHiraganaEvents());
  await page.reload();
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
  await page.getByRole("button",{name:"Start katakana"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const first=page.locator(".j5-choices").getByRole("button");
  await expect(first.nth(1).locator("span:not(.j5-choice-index)")).toHaveText("a");
  await first.nth(0).click();
  await expect(page.locator(".j5-feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".katakana-entry")).toContainText("0 of 10 groups completed");
  await page.reload();
  await page.getByRole("button",{name:"Continue katakana"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const retry=page.locator(".j5-choices").getByRole("button");
  await expect(retry.nth(2).locator("span:not(.j5-choice-index)")).toHaveText("a");
  await page.locator(".j5-choices").getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-choices").getByRole("button").nth(2).locator("span:not(.j5-choice-index)")).toHaveText("i");
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".katakana-entry")).toContainText("1/7 answers correct");
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
  if(testInfo.project.name!=="desktop-chromium"){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("Katakana is optional after hiragana and saves seven real FSRS cues",async({page},testInfo)=>{
  await page.addInitScript(()=>{
    Object.defineProperty(window.speechSynthesis,"getVoices",{
      configurable:true,value:()=>[{name:"English only",lang:"en-US"}]
    });
  });
  await page.goto("./");
  await expect(page.getByRole("button",{name:"Start katakana"})).toHaveCount(0);

  // Seed only original correctly-graded hiragana events in Playwright's disposable guest.
  // This is test preparation, not learner evidence or an alternative production writer.
  await page.evaluate(async events=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      await new Promise<void>((resolve,reject)=>{
        const tx=db.transaction("study_events","readwrite");
        for(const event of events)tx.objectStore("study_events").put(event);
        tx.oncomplete=()=>resolve();
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  },originalHiraganaEvents());
  await page.reload();
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
  await expect(page.getByRole("button",{name:"Start katakana"})).toBeVisible();
  await expect(page.locator(".katakana-entry")).toContainText("0 of 10 groups completed");
  await page.getByRole("button",{name:"Start katakana"}).click();
  await expect(page.getByRole("heading",{name:"Katakana · Five vowel sounds"})).toBeVisible();
  await expect(page.locator(".j5-lesson-examples")).toContainText("ア");
  await page.getByRole("button",{name:"Hear ア pronounced"}).click();
  await expect(page.getByRole("status")).toContainText("Japanese device speech is unavailable");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const firstChoices=page.locator(".j5-choices").getByRole("button");
  await expect(firstChoices.nth(0).locator("span:not(.j5-choice-index)")).not.toHaveText("a");
  await expect(firstChoices.nth(1).locator("span:not(.j5-choice-index)")).toHaveText("a");
  const answers=["a","i","u","e","o","ア","イ"];
  for(const [index,answer] of answers.entries()){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===answers.length-1?"Finish":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("button",{name:"Continue katakana"})).toBeVisible();
  await expect(page.locator(".katakana-entry")).toContainText("1 of 10 groups completed");
  await expect(page.locator(".beginner-entry__objective")).toContainText("A1 ·");
  const records=await page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<{events:string[];traces:number}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const ev=tx.objectStore("study_events").getAll();
        const traces=tx.objectStore("memory_traces").count();
        tx.oncomplete=()=>resolve({
          events:(ev.result as Array<{metadata?:{promptId?:string}}>).map(x=>x.metadata?.promptId??"")
            .filter(id=>id.startsWith("foundation-katakana-")),
          traces:traces.result
        });
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
  expect(records.events).toHaveLength(7);
  expect(new Set(records.events).size).toBe(7);
  expect(records.traces).toBe(7);
  await page.reload();
  await expect(page.getByRole("button",{name:"Continue katakana"})).toBeVisible();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.locator(".katakana-entry")).toContainText("K sounds");
  if(testInfo.project.name!=="desktop-chromium"){
    const box=await page.getByRole("button",{name:"Continue katakana"}).boundingBox();
    expect(box?.height??0).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});
