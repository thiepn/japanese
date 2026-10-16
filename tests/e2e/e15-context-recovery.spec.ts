import {readFileSync} from "node:fs";
import {expect,test,type Page} from "@playwright/test";

const source=JSON.parse(readFileSync("artifacts/e13-browser-seed.json","utf8")) as {
  guest:string;caseIds:string[];events:Array<Record<string,unknown>>;
};

async function qualifiedLearn(page:Page){
  await page.goto("./");
  await page.evaluate(async ({guest,events})=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open("thiepn-japanese:"+guest,8);
      req.onupgradeneeded=()=>{
        const database=req.result;
        for(const name of ["study_events","sync_outbox","sync_meta","memory_traces",
          "private_documents","private_vocabulary","private_sentences",
          "private_media_reviews","private_prosody_captures"]){
          if(!database.objectStoreNames.contains(name))database.createObjectStore(name,{
            keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id",
          });
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction("study_events","readwrite");
      for(const event of events)tx.objectStore("study_events").put(event);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
  },source);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
}
const queue=(page:Page)=>page.getByRole("region",{name:"Return to what you heard and meant"});

test("E15 unlocked original stages offer a focused synthesized listening-to-context session, not FSRS",async({page})=>{
  await qualifiedLearn(page);
  const panel=queue(page);
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("practice suggestions, not FSRS due cards");
  await expect(panel).toContainText("20 hours after a mismatched original choice");
  await expect(panel).toContainText("72 hours");
  await expect(panel.getByRole("button",{name:"Practise this original cue"}).first()).toBeEnabled();
  const first=panel.locator(".e15-recovery__list li").filter({hasText:"Original listening"}).first();
  await expect(first).toContainText("No previous original attempt");
  await first.getByRole("button",{name:"Practise this original cue"}).click();
  const player=page.locator("main.j5-study-shell");
  await expect(player).toBeVisible();
  await player.locator("button.j5-next").click();
  await player.locator("button.j5-next").click();
  await expect(player.getByRole("button",{name:"Play Japanese audio"})).toBeVisible();
  await expect(player).toContainText("Play the listening cue before answering.");
  await expect(player).toContainText("Device Japanese voice");
});

test("E15 bounded reply recovery reuses existing StudyEvent and suggests waiting rather than regrading mastery",async({page})=>{
  await qualifiedLearn(page);
  const panel=queue(page);
  await panel.getByRole("button",{name:/Show all/}).click();
  const chosen=panel.locator(".e15-recovery__list li")
    .filter({hasText:"First situated reply"}).first();
  // Save the source identity before the advised queue reprioritizes.
  // After answering, this card must move behind still-unattempted cases.
  const sourceGoal=await chosen.locator(".e15-recovery__goal").innerText();
  await chosen.getByRole("button",{name:"Practise this original cue"}).click();
  const main=page.locator("main.j5-study-shell");
  for(let i=0;i<4;i++)await main.locator("button.j5-next").click();
  const choices=main.locator(".j5-choices button");
  await expect(choices).toHaveCount(3);
  await choices.first().click();
  await expect(main.locator(".j5-feedback")).toContainText("UNSCORED CONTEXT CHECK");
  await expect(main.locator(".j5-feedback")).toContainText("Original conversational intention");
  await main.locator("button.j5-next").click();
  await main.locator("button.j5-next").click();

  await expect(queue(page)).toBeVisible();
  const all=queue(page).getByRole("button",{name:/Show all/});
  if(await all.isVisible())await all.click();
  const revisited=queue(page).locator(".e15-recovery__list li")
    .filter({hasText:"First situated reply"}).filter({hasText:sourceGoal});
  await expect(revisited).toContainText("Suggested");
  await expect(revisited.getByRole("button",{name:"Wait for suggested revisit"})).toBeDisabled();
  const values=await page.evaluate(async guest=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open("thiepn-japanese:"+guest,8);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const tx=db.transaction(["study_events","memory_traces"],"readonly");
    const rows=await Promise.all(["study_events","memory_traces"].map(name=>new Promise<Array<Record<string,unknown>>>((resolve,reject)=>{
      const req=tx.objectStore(name).getAll();
      req.onsuccess=()=>resolve(req.result as Array<Record<string,unknown>>);
      req.onerror=()=>reject(req.error);
    })));
    db.close();
    return {events:rows[0]!,traces:rows[1]!};
  },source.guest);
  expect(values.events.some(e=>(e.metadata as Record<string,unknown>)?.e11RoleResponse===true)).toBe(true);
  expect(values.events.filter(e=>(e.metadata as Record<string,unknown>)?.e11RoleResponse===true)
    .every(e=>(e.metadata as Record<string,unknown>)?.nonAuthoritative===true&&
      (e.metadata as Record<string,unknown>)?.schedulerExcluded===true)).toBe(true);
  expect(values.traces).toHaveLength(0);
});

test("E15 suggestion buttons and private correction disclosure remain touch-safe on compact mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Mobile-sized geometry only");
  await qualifiedLearn(page);
  const panel=queue(page);
  const trigger=panel.getByRole("button",{name:"Practise this original cue"}).first();
  await trigger.scrollIntoViewIfNeeded();
  const rectangle=await trigger.boundingBox();
  const viewport=page.viewportSize()!;
  expect(rectangle).not.toBeNull();
  expect(rectangle!.height).toBeGreaterThanOrEqual(44);
  expect(rectangle!.x).toBeGreaterThanOrEqual(-1);
  expect(rectangle!.x+rectangle!.width).toBeLessThanOrEqual(viewport.width+1);
  const sourceDetail=panel.getByText("Original situation and corrective context").first();
  await sourceDetail.click();
  await expect(panel.locator(".e15-recovery__context[open]").first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))
    .toBeLessThanOrEqual(1);
});
