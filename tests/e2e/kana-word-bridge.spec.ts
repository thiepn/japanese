import {expect,test} from "@playwright/test";

test("source-backed word reading begins after first kana row and returns to the original A0 lesson",async({page},testInfo)=>{
  await page.goto("./");
  await expect(page.getByRole("heading",{name:"Read Japanese words"})).toHaveCount(0);
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const kana=["a","i","u","e","o","あ","い"];
  for(const [index,answer] of kana.entries()){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===kana.length-1?"Finish":"Continue",exact:true}).click();
  }
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
  const bridge=page.locator(".kana-words-entry");
  await expect(bridge).toContainText("0 of 2 available words recognized");
  await bridge.getByRole("button",{name:"Read new words"}).click();
  await expect(page.getByRole("heading",{name:"いい",exact:true})).toBeVisible();
  await expect(page.locator(".j5-lesson-facts")).toContainText("good");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.locator(".j5-choices").getByRole("button",{name:"good",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"いいえ",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.locator(".j5-choices").getByRole("button",{name:"no",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Finish",exact:true}).click();
  await expect(bridge).toContainText("2 of 2 available words recognized");
  await expect(bridge.getByRole("button",{name:"Read learned words"})).toBeVisible();

  await page.reload();
  await expect(bridge.getByRole("button",{name:"Read learned words"})).toBeVisible();
  await bridge.getByRole("button",{name:"Read learned words"}).click();
  for(const [index,answer] of ["いい","いいえ"].entries()){
    await page.locator(".j5-typed-form input").fill(answer);
    await page.locator(".j5-typed-form").getByRole("button",{name:"Check"}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===1?"Finish":"Continue",exact:true}).click();
  }
  await expect(bridge.getByRole("button",{name:"Use learned words"})).toBeVisible();
  await bridge.getByRole("button",{name:"Use learned words"}).click();
  for(const [index,answer] of ["いい","いいえ"].entries()){
    await page.locator(".j5-typed-form input").fill(answer);
    await page.locator(".j5-typed-form").getByRole("button",{name:"Check"}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===1?"Finish":"Continue",exact:true}).click();
  }
  await expect(bridge).toHaveCount(0);
  const durable=await page.evaluate(async()=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<{promptIds:string[];traceIds:string[]}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const events=tx.objectStore("study_events").getAll();
        const traces=tx.objectStore("memory_traces").getAll();
        tx.oncomplete=()=>resolve({
          promptIds:(events.result as Array<{primaryTarget?:{kind?:string};result:string;metadata?:{promptId?:string}}>)
            .filter(event=>event.primaryTarget?.kind==="lexeme"&&event.result==="correct")
            .map(event=>event.metadata?.promptId??""),
          traceIds:(traces.result as Array<{id:string}>).map(trace=>trace.id)
            .filter(id=>id.startsWith("lexeme:lex-ii:")||id.startsWith("lexeme:lex-iie:"))
        });
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  });
  expect(durable.promptIds).toHaveLength(6);
  expect(new Set(durable.promptIds).size).toBe(6);
  expect(durable.traceIds).toHaveLength(6);
  expect(new Set(durable.traceIds).size).toBe(6);
  await page.reload();
  await expect(bridge).toHaveCount(0);
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Read Japanese words"})).toHaveCount(0);
  if(testInfo.project.name!=="desktop-chromium"){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});
