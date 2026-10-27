import {expect,test,type Page} from "@playwright/test";

const OWNER="00000000-0000-4000-8000-000000000001";
const READING_TRACE="kana:hiragana-あ:reading:kana-to-romaji-recall";

async function openIntegratedFlashcards(page:Page){
  await page.goto("./");
  const review=page.getByRole("region",{name:"Kana Review"});
  await expect(review).toBeVisible();
  await review.getByRole("button",{name:"Review flashcards"}).click();
  await expect(page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Kana"}))
    .toHaveAttribute("aria-current","page");
  await expect(page.getByRole("navigation",{name:"Kana sections"})
    .getByRole("button",{name:/Flashcards/})).toHaveAttribute("aria-current","page");
  await expect(page.getByPlaceholder("Type romaji... (or Space to reveal)")).toBeVisible();
}
async function evidence(page:Page){
  return page.evaluate(async({owner,id})=>{
    const request=indexedDB.open("thiepn-japanese:"+owner);
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    try{
      return await new Promise<{trace:{revision:number;card:{due:string;reps:number}}|null;events:any[];outbox:any[]}>((resolve,reject)=>{
        const tx=db.transaction(["memory_traces","study_events","sync_outbox"],"readonly");
        const trace=tx.objectStore("memory_traces").get(id);
        const events=tx.objectStore("study_events").getAll();
        const outbox=tx.objectStore("sync_outbox").getAll();
        tx.oncomplete=()=>resolve({trace:trace.result??null,events:events.result,outbox:outbox.result});
        tx.onerror=()=>reject(tx.error);
      });
    }finally{db.close();}
  },{owner:OWNER,id:READING_TRACE});
}

test("Japanese flashcard entry uses native Kana and canonical FSRS after reload",async({page})=>{
  await openIntegratedFlashcards(page);
  await expect(page.getByRole("dialog",{name:"Kana flashcards"})).toHaveCount(0);
  const input=page.getByPlaceholder("Type romaji... (or Space to reveal)");
  await input.fill("a");
  await input.press("Enter");
  await expect(page.getByText("Correct",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:/3. Good/}).click();
  const saved=await evidence(page);
  expect(saved.trace?.revision).toBe(1);
  expect(saved.trace?.card.reps).toBe(1);
  expect(Number.isFinite(Date.parse(saved.trace!.card.due))).toBe(true);
  expect(saved.events.some(e=>e.primaryTarget?.id==="hiragana-あ"&&e.metadata?.googleKanaStudio&&
    e.metadata?.reviewGrade==="good")).toBe(true);
  await page.reload();
  const persisted=await evidence(page);
  expect(persisted.trace).toEqual(saved.trace);
  expect(persisted.events).toEqual(saved.events);
});

test("revealing a Kana answer without rating does not fabricate review evidence",async({page})=>{
  await openIntegratedFlashcards(page);
  const input=page.getByPlaceholder("Type romaji... (or Space to reveal)");
  await input.press("Enter");
  await expect(page.getByRole("button",{name:/1. Again/})).toBeVisible();
  const before=await evidence(page);
  expect(before.events.filter(e=>e.primaryTarget?.id==="hiragana-あ")).toHaveLength(0);
  await page.getByRole("navigation",{name:"Kana sections"}).getByRole("button",{name:/Words/}).click();
  const after=await evidence(page);
  expect(after.trace).toEqual(before.trace);
  expect(after.events).toEqual(before.events);
});

test("incorrect answer locks grading to Again and commits one canonical grade",async({page})=>{
  await openIntegratedFlashcards(page);
  const input=page.getByPlaceholder("Type romaji... (or Space to reveal)");
  await input.fill("wrong");
  await input.press("Enter");
  await expect(page.getByText("Incorrect",{exact:false}).first()).toBeVisible();
  await expect(page.getByRole("button",{name:/3. Good/})).toBeDisabled();
  await page.getByRole("button",{name:/1. Again/}).click();
  const saved=await evidence(page);
  expect(saved.trace?.revision).toBe(1);
  expect(saved.trace?.card.reps).toBe(1);
  expect(saved.events.filter(e=>e.primaryTarget?.id==="hiragana-あ"&&e.metadata?.reviewGrade==="again")).toHaveLength(1);
});

test("offline native Kana grading preserves Japanese FSRS and sync outbox",async({page,context})=>{
  await openIntegratedFlashcards(page);
  const input=page.getByPlaceholder("Type romaji... (or Space to reveal)");
  await input.fill("a");
  await input.press("Enter");
  await expect(page.getByRole("button",{name:/3. Good/})).toBeVisible();
  await context.setOffline(true);
  try{
    await page.getByRole("button",{name:/3. Good/}).click();
    const offline=await evidence(page);
    expect(offline.trace?.revision).toBe(1);
    expect(offline.events).toHaveLength(1);
    expect(offline.outbox.length).toBeGreaterThanOrEqual(1);
  }finally{await context.setOffline(false);}
});

test.describe("mobile Kana controls",()=>{
  test.use({viewport:{width:390,height:844},hasTouch:true});
  test("native flashcard review and study tools remain touch-accessible",async({page})=>{
    await openIntegratedFlashcards(page);
    const input=page.getByPlaceholder("Type romaji... (or Space to reveal)");
    await input.tap();
    await input.fill("a");
    await input.press("Enter");
    await expect(page.getByRole("button",{name:/3. Good/})).toBeVisible();
    await page.getByRole("button",{name:"Study tools"}).tap();
    await page.getByRole("button",{name:"Review schedule"}).tap();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".j2-brand")).toBeVisible();
    const widths=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
    expect(widths[0]).toBeLessThanOrEqual(widths[1]+1);
  });
});
