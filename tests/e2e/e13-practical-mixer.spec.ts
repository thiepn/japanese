import {readFileSync} from "node:fs";
import {expect,test} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e13-browser-seed.json","utf8")) as {
 guest:string;caseIds:string[];events:Array<Record<string,unknown>>;
};

async function unlockOriginalCases(page:import("@playwright/test").Page){
  await page.goto("./");
  // The exact existing owner-scoped IndexedDB schema and original source
  // StudyEvent records, with no mocked HTTP endpoint or second event store.
  await page.evaluate(async({guest,events})=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open("thiepn-japanese:"+guest,8);
      request.onupgradeneeded=()=>{
        const database=request.result;
        for(const name of ["study_events","sync_outbox","sync_meta","memory_traces",
          "private_documents","private_vocabulary","private_sentences",
          "private_media_reviews","private_prosody_captures"]){
          if(!database.objectStoreNames.contains(name))database.createObjectStore(name,{
            keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id",
          });
        }
      };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction("study_events","readwrite");
      for(const event of events)tx.objectStore("study_events").put(event);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
  },fixture);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
}

test("E13 cross-situation mixer exposes source-qualified cases and opens native Japanese player",async({page})=>{
  await unlockOriginalCases(page);
  const lab=page.getByRole("region",{name:/Practice across different situations/});
  await expect(lab).toBeVisible();
  await expect(lab.getByRole("button",{name:/Start 2-situation practice/})).toBeEnabled();
  await expect(lab.locator(".e13-lab__case[aria-pressed='true']")).toHaveCount(2);
  await expect(lab).toContainText("original Can-do linked");
  await expect(lab).toContainText("listening new");
  await lab.getByLabel("Your practice focus").selectOption("understand");
  await lab.getByRole("button",{name:/Start 2-situation practice/}).click();
  await expect(page.locator("main.j5-study-shell")).toBeVisible();
  await expect(page.locator("main.j5-study-shell")).toContainText("Extra practice");
  await expect(page.locator("main.j5-study-shell")).toContainText(/Original|original|source/i);
  // User can leave normally. The session is not a new synthetic course route.
  await expect(page.locator("main.j5-study-shell textarea")).toHaveCount(0);
});

test("E13 writing-focused mode reuses native unscored first and revised draft controls",async({page})=>{
  await unlockOriginalCases(page);
  const lab=page.getByRole("region",{name:/Practice across different situations/});
  await lab.getByLabel("Your practice focus").selectOption("write-revise");
  await lab.getByRole("button",{name:/Start 2-situation practice/}).click();
  const main=page.locator("main.j5-study-shell");
  await expect(main).toBeVisible();
  const first=page.getByRole("button",{name:"Record unscored E11 writing"});
  for(let i=0;i<20&&!await first.isVisible();i++){
    const skip=main.locator(".e11-optional-note button");
    if(await skip.isVisible())await skip.click();
    else await main.locator("button.j5-next").click();
  }
  await expect(first).toBeVisible();
  const value="午後六時からの交流会は西の入り口で受付します。場所をもう一度教えてください。";
  await main.locator("textarea").fill(value);
  await first.click();
  await expect(main.locator(".j5-feedback")).toContainText("Response recorded");
  const events=await page.evaluate(async guest=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open("thiepn-japanese:"+guest,8);
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    const values=await new Promise<Array<Record<string,unknown>>>((resolve,reject)=>{
      const tx=db.transaction("study_events","readonly");
      const request=tx.objectStore("study_events").getAll();
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    db.close();
    return values;
  },fixture.guest);
  const written=events.filter(e=>e.id!==undefined&&(e.metadata as Record<string,unknown>|undefined)?.e11Task==="independent-letter");
  expect(written).toHaveLength(1);
  expect(written[0]?.result).toBe("skipped");
  expect((written[0]?.metadata as Record<string,unknown>)?.nonAuthoritative).toBe(true);
  expect((written[0]?.metadata as Record<string,unknown>)?.learnerResponse).toBe(value);
});

test("E13 case choices are touch-safe and do not overflow compact mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Phone-size acceptance only");
  await unlockOriginalCases(page);
  const lab=page.getByRole("region",{name:/Practice across different situations/});
  await expect(lab).toBeVisible();
  const selected=lab.locator(".e13-lab__case[aria-pressed='true']").first();
  await selected.scrollIntoViewIfNeeded();
  const bounds=await selected.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  const viewport=page.viewportSize()!;
  expect(bounds!.x).toBeGreaterThanOrEqual(-1);
  expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width+1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
