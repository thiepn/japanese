import {expect,test} from "@playwright/test";

test("front/back flashcards preserve canonical FSRS schedule after keyboard review and reload",async({page})=>{
  await page.goto("./");
  const review=page.getByRole("region",{name:"Kana Review"});
  await expect(review).toBeVisible();
  await review.getByRole("button",{name:"Review flashcards"}).click();
  const dialog=page.getByRole("dialog",{name:"Kana flashcards"});
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".flashcards-front")).toHaveText("あ");
  await expect(dialog.locator(".flashcards-back")).toHaveCount(0);
  await page.keyboard.press("Space");
  await expect(dialog.locator(".flashcards-back")).toHaveText("a");
  await page.keyboard.press("3");
  await expect(dialog.locator(".flashcards-front")).not.toHaveText("あ");
  const saved=await page.evaluate(async()=>{
    const name="thiepn-japanese:00000000-0000-4000-8000-000000000001";
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open(name);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    const result=await new Promise<{trace:any;events:any[]}>((resolve,reject)=>{
      const tx=db.transaction(["memory_traces","study_events"],"readonly");
      const a=tx.objectStore("memory_traces").get("kana:hiragana-あ:recognition:kana-to-sound");
      const b=tx.objectStore("study_events").getAll();
      tx.oncomplete=()=>resolve({trace:a.result,events:b.result});tx.onerror=()=>reject(tx.error);
    });db.close();return result;
  });
  expect(saved.trace).toBeTruthy();
  expect(saved.trace.revision).toBe(1);
  expect(saved.trace.card.due).toBeTruthy();
  expect(saved.events.some(event=>event.responseMode==="flashcard"&&event.metadata?.reviewGrade==="good")).toBe(true);
  await dialog.getByRole("button",{name:"Close flashcards"}).click();
  await page.reload();
  await expect(page.getByRole("region",{name:"Kana Review"})).toBeVisible();
  await page.getByRole("button",{name:"Review flashcards"}).click();
  await expect(page.getByRole("dialog",{name:"Kana flashcards"})).toBeVisible();
  await expect(page.getByRole("dialog",{name:"Kana flashcards"}).locator(".flashcards-front")).not.toHaveText("あ");
});

test("last unsynced flashcard grade can be undone without erasing history",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Review flashcards"}).click();
  const dialog=page.getByRole("dialog",{name:"Kana flashcards"});
  await dialog.getByRole("button",{name:"Show answer",exact:true}).last().click();
  await dialog.getByRole("button",{name:/Good/}).click();
  await dialog.getByRole("button",{name:/Undo last review/}).click();
  await expect(dialog.locator(".flashcards-front")).toHaveText("あ");
  await expect(dialog.locator(".flashcards-back")).toHaveText("a");
  await dialog.getByRole("button",{name:/Again/}).click();
  await expect(dialog.locator(".flashcards-front")).not.toHaveText("あ");
});

test("in-session Again waits for canonical FSRS and resumes due learning after reload",async({page})=>{
  await page.clock.install({time:new Date("2026-10-26T12:00:00Z")});
  await page.goto("./");
  await page.getByRole("button",{name:"Review flashcards"}).click();
  const dialog=page.getByRole("dialog",{name:"Kana flashcards"});
  await dialog.getByRole("button",{name:"Deck settings"}).click();
  await dialog.getByRole("spinbutton",{name:"New cards per session"}).fill("1");
  await dialog.getByRole("spinbutton",{name:"Reviews per session"}).fill("0");
  await dialog.getByRole("button",{name:"Save limits and restart deck"}).click();
  await expect(dialog.locator(".flashcards-front")).toHaveText("あ");
  await dialog.getByRole("button",{name:"Show answer",exact:true}).click();
  await dialog.getByRole("button",{name:/Again/}).click();
  await expect(dialog.getByRole("heading",{name:"Learning cards waiting"})).toBeVisible();
  const due=await page.evaluate(async()=>{
    const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    const record=await new Promise<{card:{due:string;state:number};revision:number}>((resolve,reject)=>{
      const tx=db.transaction("memory_traces","readonly");
      const get=tx.objectStore("memory_traces").get("kana:hiragana-あ:recognition:kana-to-sound");
      get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);
    });db.close();return record;
  });
  expect(due.card.state).toBe(1);
  expect(due.revision).toBe(1);
  const waitMs=Date.parse(due.card.due)-await page.evaluate(()=>Date.now());
  expect(waitMs).toBeGreaterThan(0);
  await page.clock.fastForward(waitMs+1000);
  await expect(dialog.locator(".flashcards-front")).toHaveText("あ");
  await expect(dialog.getByText("Learning",{exact:true})).toBeVisible();
  await dialog.getByRole("button",{name:"Close flashcards"}).click();
  await page.reload();
  await page.getByRole("button",{name:"Review flashcards"}).click();
  const restarted=page.getByRole("dialog",{name:"Kana flashcards"});
  await restarted.getByRole("button",{name:"Deck settings"}).click();
  await expect(restarted.getByRole("spinbutton",{name:"New cards per session"})).toHaveValue("1");
  await expect(restarted.getByRole("spinbutton",{name:"Reviews per session"})).toHaveValue("0");
  await restarted.getByRole("spinbutton",{name:"Reviews per session"}).fill("1");
  await restarted.getByRole("button",{name:"Save limits and restart deck"}).click();
  await expect(restarted.locator(".flashcards-front")).toHaveText("あ");
  await restarted.getByRole("button",{name:"Show answer",exact:true}).click();
  await restarted.getByRole("button",{name:/Good/}).click();
  await expect.poll(async()=>page.evaluate(async()=>{
    const request=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    const result=await new Promise<{revision:number}>((resolve,reject)=>{
      const get=db.transaction("memory_traces","readonly").objectStore("memory_traces")
        .get("kana:hiragana-あ:recognition:kana-to-sound");
      get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);
    });db.close();return result.revision;
  })).toBe(2);
});

test("flashcard grading commits FSRS and outbox locally while offline",async({page,context})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Review flashcards"}).click();
  const dialog=page.getByRole("dialog",{name:"Kana flashcards"});
  await expect(dialog.locator(".flashcards-front")).toHaveText("あ");
  await context.setOffline(true);
  await dialog.getByRole("button",{name:"Show answer",exact:true}).click();
  await dialog.getByRole("button",{name:/Again/}).click();
  await expect(dialog.locator(".flashcards-front")).toHaveText("ア");
  const offline=await page.evaluate(async()=>{
    const opened=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      opened.onsuccess=()=>resolve(opened.result);opened.onerror=()=>reject(opened.error);
    });
    const result=await new Promise<{revision:number;due:string;events:number;outbox:number}>((resolve,reject)=>{
      const tx=db.transaction(["memory_traces","study_events","sync_outbox"],"readonly");
      const trace=tx.objectStore("memory_traces").get("kana:hiragana-あ:recognition:kana-to-sound");
      const events=tx.objectStore("study_events").getAll();
      const outbox=tx.objectStore("sync_outbox").getAll();
      tx.oncomplete=()=>resolve({revision:trace.result.revision,due:trace.result.card.due,
        events:events.result.length,outbox:outbox.result.length});
      tx.onerror=()=>reject(tx.error);
    });db.close();return result;
  });
  expect(offline.revision).toBe(1);
  expect(Number.isFinite(Date.parse(offline.due))).toBe(true);
  expect(offline.events).toBe(1);
  expect(offline.outbox).toBe(1);
  await context.setOffline(false);
  await dialog.getByRole("button",{name:"Close flashcards"}).click();
  await page.reload();
  const after=await page.evaluate(async()=>{
    const opened=indexedDB.open("thiepn-japanese:00000000-0000-4000-8000-000000000001");
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      opened.onsuccess=()=>resolve(opened.result);opened.onerror=()=>reject(opened.error);
    });
    const result=await new Promise<{revision:number;due:string}>((resolve,reject)=>{
      const get=db.transaction("memory_traces","readonly").objectStore("memory_traces")
        .get("kana:hiragana-あ:recognition:kana-to-sound");
      get.onsuccess=()=>resolve({revision:get.result.revision,due:get.result.card.due});
      get.onerror=()=>reject(get.error);
    });db.close();return result;
  });
  expect(after).toEqual({revision:offline.revision,due:offline.due});
});

test.describe("touch-sized flashcard controls",()=>{
  test.use({viewport:{width:390,height:844},hasTouch:true});
  test("tap reveal, suspend and restore cards on mobile",async({page})=>{
    await page.goto("./");
    await page.getByRole("button",{name:"Review flashcards"}).click();
    const dialog=page.getByRole("dialog",{name:"Kana flashcards"});
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button",{name:"Reveal flashcard answer"}).tap();
    await expect(dialog.locator(".flashcards-back")).toBeVisible();
    await dialog.getByRole("button",{name:"Suspend card"}).tap();
    await dialog.getByRole("button",{name:"Suspended (1)"}).tap();
    await expect(dialog.getByRole("button",{name:"Restore"})).toBeVisible();
    await dialog.getByRole("button",{name:"Restore"}).tap();
    await expect(dialog.getByRole("button",{name:"Suspended (0)"})).toBeVisible();
  });
});
