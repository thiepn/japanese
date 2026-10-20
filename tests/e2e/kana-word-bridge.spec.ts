import {expect,test,type Page} from "@playwright/test";

async function decodeFirstSightWord(page:Page,romaji:string):Promise<void>{
  await expect(page.locator(".j5-sheet__cap")).toContainText("READ THIS UNFAMILIAR WORD IN ROMAJI");
  await page.locator(".j5-typed-form input").fill(romaji);
  await page.locator(".j5-typed-form").getByRole("button",{name:"Check"}).click();
  await expect(page.locator(".j5-feedback")).toContainText("Response recorded");
  await expect(page.locator(".j5-feedback")).toContainText("no language grade");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
}

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
  await decodeFirstSightWord(page,"ii");
  await expect(page.getByRole("heading",{name:"いい",exact:true})).toBeVisible();
  await expect(page.locator(".j5-lesson-facts")).toContainText("good");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.locator(".j5-choices").getByRole("button",{name:"good",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await decodeFirstSightWord(page,"iie");
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
      return await new Promise<{promptIds:string[];traceIds:string[];firstSightIds:string[]}>((resolve,reject)=>{
        const tx=db.transaction(["study_events","memory_traces"],"readonly");
        const events=tx.objectStore("study_events").getAll();
        const traces=tx.objectStore("memory_traces").getAll();
        tx.oncomplete=()=>resolve({
          promptIds:(events.result as Array<{primaryTarget?:{kind?:string};result:string;metadata?:{promptId?:string}}>)
            .filter(event=>event.primaryTarget?.kind==="lexeme"&&event.result==="correct")
            .map(event=>event.metadata?.promptId??""),
          firstSightIds:(events.result as Array<{result:string;metadata?:{promptId?:string;nonAuthoritative?:boolean;kanaWordFirstSight?:boolean}}>)
            .filter(event=>event.result==="skipped"&&event.metadata?.nonAuthoritative===true
              &&event.metadata?.kanaWordFirstSight===true)
            .map(event=>event.metadata?.promptId??"").sort(),
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
  expect(durable.firstSightIds).toEqual(["a0-kana-first-sight-lex-ii","a0-kana-first-sight-lex-iie"].sort());
  await page.reload();
  await expect(bridge).toHaveCount(0);
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Read Japanese words"})).toHaveCount(0);
  if(testInfo.project.name!=="desktop-chromium"){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("missed source words remain visible through reload and wait for original due review",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const kana=["a","i","u","e","o","あ","い"];
  for(const [index,answer] of kana.entries()){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===6?"Finish":"Continue",exact:true}).click();
  }
  const bridge=page.locator(".kana-words-entry");
  await expect(bridge).toContainText("0 of 2 available words recognized");
  await bridge.getByRole("button",{name:"Read new words"}).click();
  for(const [index,romaji] of ["ii","iie"].entries()){
    await decodeFirstSightWord(page,romaji);
    await page.getByRole("button",{name:"Continue",exact:true}).click();
    // The original canonical choice list has its correct answer first.
    await page.locator(".j5-choices").getByRole("button").nth(1).click();
    await expect(page.locator(".j5-feedback.incorrect")).toBeVisible();
    await page.getByRole("button",{name:index===1?"Finish":"Continue",exact:true}).click();
  }
  await expect(bridge).toContainText("2 awaiting review");
  await expect(bridge.getByRole("button",{name:"Read new words"})).toHaveCount(0);
  await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
  await page.reload();
  await expect(bridge).toContainText("2 awaiting review");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.locator(".kana-words-entry")).toContainText("2 awaiting review");
});

test("a newly recognized source word remains available offline with original account-scoped evidence",async({page,context})=>{
  await page.goto("./");
  await page.evaluate(async()=>{
    if(!("serviceWorker" in navigator))throw new Error("WORD_BRIDGE_SERVICE_WORKER_UNAVAILABLE");
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.getByRole("button",{name:"Start Japanese from Zero"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const kana=["a","i","u","e","o","あ","い"];
  for(const [index,answer] of kana.entries()){
    await page.locator(".j5-choices").getByRole("button",{name:answer,exact:true}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:index===6?"Finish":"Continue",exact:true}).click();
  }
  const bridge=page.locator(".kana-words-entry");
  await bridge.getByRole("button",{name:"Read new words"}).click();
  await decodeFirstSightWord(page,"ii");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.locator(".j5-choices").getByRole("button",{name:"good",exact:true}).click();
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  await expect(bridge).toContainText("1 of 2 available words recognized");

  await context.setOffline(true);
  try{
    await page.reload();
    await expect(bridge).toContainText("1 of 2 available words recognized");
    await expect(bridge.getByRole("button",{name:"Read learned words"})).toBeVisible();
    await bridge.getByRole("button",{name:"Read learned words"}).click();
    await page.locator(".j5-typed-form input").fill("いい");
    await page.locator(".j5-typed-form").getByRole("button",{name:"Check"}).click();
    await expect(page.getByText("Correct",{exact:true})).toBeVisible();
    await page.getByRole("button",{name:"Exit",exact:true}).click();
    await expect(bridge.getByRole("button",{name:"Use learned words"})).toBeVisible();
    await expect(page.locator(".beginner-entry__objective")).toHaveText("Hiragana · K sounds");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
  }finally{
    await context.setOffline(false);
  }
});
