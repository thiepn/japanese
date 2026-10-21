import {expect,test} from "@playwright/test";

test("A0 first launch teaches before testing and keeps advanced tools optional",async({page},testInfo)=>{
  await page.goto("./");
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Start Japanese from Zero"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Your learning path"})).toBeHidden();
  await page.locator(".beginner-explore > summary").click();
  await expect(page.getByRole("heading",{name:"Your learning path"})).toBeVisible();
  await page.locator(".beginner-explore > summary").click();
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.getByRole("heading",{name:"Hiragana · Five vowel sounds"})).toBeVisible();
  await expect(page.locator(".j5-lesson-examples")).toContainText("あ");
  await expect(page.getByRole("button",{name:"Hear う pronounced"})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  if(testInfo.project.name!=="desktop-chromium"){
    const play=await page.getByRole("button",{name:"Hear う pronounced"}).boundingBox();
    expect(play?.height??0).toBeGreaterThanOrEqual(44);
  }
});

test("the first A0 kana choice cannot be passed by clicking the first button",async({page},testInfo)=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const choices=page.locator(".j5-choices").getByRole("button");
  await expect(choices.nth(0)).not.toHaveText("a");
  await expect(choices.nth(1)).toHaveText("a");
  await choices.nth(0).click();
  await expect(page.locator(".j5-feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · Five vowel sounds");
  await expect(page.locator(".beginner-entry__progress")).toContainText("0 of 10 hiragana sound groups completed");
  await page.reload();
  await page.getByRole("button",{name:"Continue lesson"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-choices").getByRole("button").nth(1)).toHaveText("a");
  await page.locator(".j5-choices").getByRole("button",{name:"a",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.locator(".j5-choices").getByRole("button").nth(2)).toHaveText("i");
  if(testInfo.project.name!=="desktop-chromium"){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("A0 review is not mixed with new course items",async({page})=>{
  await page.goto("./");
  await expect(page.getByRole("button",{name:"Review due material"})).toBeDisabled();
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await expect(page.locator(".study-lesson")).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.getByRole("button",{name:"Review due material"})).toBeDisabled();
});

test("A0 requires five recognition and two form answers before opening K sounds",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const answers=["a","i","u","e","o","あ","い"];
  for(const [index,answer] of answers.entries()){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===answers.length-1?"Finish":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:"Your next Japanese lesson"})).toBeVisible();
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
  await expect(page.locator(".beginner-entry__progress")).toContainText("1 of 10 hiragana sound groups completed");

  const evidence=await page.evaluate(async()=>{
    const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<{ids:string[];traces:number}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const events=tx.objectStore("study_events").getAll();
        const traces=tx.objectStore("memory_traces").count();
        tx.oncomplete=()=>resolve({
          ids:(events.result as Array<{metadata?:{promptId?:string}}>).map(event=>String(event.metadata?.promptId??"")),
          traces:traces.result
        });
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
  expect(evidence.ids).toHaveLength(7);
  expect(evidence.traces).toBe(7);
  expect(new Set(evidence.ids).size).toBe(7);
  expect(evidence.ids.every(id=>id.startsWith("foundation-hiragana-"))).toBe(true);
  await page.reload();
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
});

test("A0 reports an unavailable Japanese device voice instead of using an English voice",async({page})=>{
  await page.addInitScript(()=>{
    Object.defineProperty(window.speechSynthesis,"getVoices",{
      configurable:true,
      value:()=>[{name:"English only",lang:"en-US"}]
    });
  });
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Hear あ pronounced"}).click();
  await expect(page.getByRole("status")).toContainText("Japanese device speech is unavailable");
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeEnabled();
});
