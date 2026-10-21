import {openAdditionalLearn} from "./open-additional-learn";
import {readFileSync} from "node:fs";
import {readFile} from "node:fs/promises";
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
          if(!database.objectStoreNames.contains(name))
            database.createObjectStore(name,{
              keyPath:name==="sync_outbox"?"mutation_id":name==="sync_meta"?"key":"id",
            });
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction("study_events","readwrite");
      for(const row of events)tx.objectStore("study_events").put(row);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    db.close();
  },source);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,true);
}
function studio(page:Page){
  return page.getByRole("region",{name:"Follow the whole conversation, one speaker at a time"});
}
function notebook(page:Page){
  return studio(page).getByRole("region",{name:"Private original listening notebook"});
}
async function storeRows(page:Page){
  return page.evaluate(async guest=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open("thiepn-japanese:"+guest,8);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    const names=["private_documents","study_events","memory_traces","sync_outbox"];
    const tx=db.transaction(names,"readonly");
    const rows=await Promise.all(names.map(name=>
      new Promise<Array<Record<string,unknown>>>((resolve,reject)=>{
        const req=tx.objectStore(name).getAll();
        req.onsuccess=()=>resolve(req.result as Array<Record<string,unknown>>);
        req.onerror=()=>reject(req.error);
      })));
    db.close();return {documents:rows[0]!,events:rows[1]!,traces:rows[2]!,outbox:rows[3]!};
  },source.guest);
}

test("E17 private listening note survives reload and is included in existing owner workspace backup",async({page})=>{
  await qualifiedLearn(page);
  const before=await storeRows(page);
  const original=studio(page),notes=notebook(page);
  await original.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  const text="すみません。受付の場所を確認したいです。";
  await original.getByLabel(/Try the next Japanese line/).fill(text);
  await notes.getByRole("button",{name:"Save my private listening note"}).click();
  await expect(notes).toContainText("Private listening note saved locally");
  const after=await storeRows(page);
  expect(after.documents).toHaveLength(1);
  expect(after.documents[0]).toMatchObject({accountId:source.guest,sourceKind:"paste",text});
  expect(after.events.length).toBe(before.events.length);
  expect(after.traces.length).toBe(before.traces.length);
  expect(after.outbox.length).toBe(before.outbox.length);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await openAdditionalLearn(page,true);
  const restored=notebook(page);
  await expect(restored).toContainText("Saved on this device");
  await restored.getByText("Read my last saved listening note").click();
  await expect(restored.locator("pre[lang='ja']")).toHaveText(text);
  await restored.getByRole("button",{name:"Rehearse again from my saved note"}).click();
  await expect(studio(page).getByLabel(/Try the next Japanese line/)).toHaveValue(text);
  await expect(studio(page).getByText("Japanese transcript hidden until you reveal this turn.")).toBeVisible();

  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  const downloadEvent=page.waitForEvent("download");
  await panel.getByRole("button",{name:"Save a local backup"}).click();
  const download=await downloadEvent;
  const raw=await readFile((await download.path())!,"utf8");
  const backup=JSON.parse(raw) as {
    accountId:string;schemaVersion:number;stores:{private_documents:Array<{id:string;accountId:string;text:string}>};
  };
  expect(backup.accountId).toBe(source.guest);
  expect(backup.schemaVersion).toBe(1);
  expect(backup.stores.private_documents).toEqual(expect.arrayContaining([
    expect.objectContaining({accountId:source.guest,text}),
  ]));
});

test("E17 source note is speaker-specific, editable and deletable without altering original StudyEvents",async({page})=>{
  await qualifiedLearn(page);
  const root=studio(page);
  await root.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  const writing=root.getByLabel(/Try the next Japanese line/);
  await writing.fill("案内について聞きます。");
  await notebook(page).getByRole("button",{name:"Save my private listening note"}).click();
  await expect(notebook(page)).toContainText("Saved on this device");
  await root.getByRole("button",{name:"Next speaker"}).click();
  await expect(notebook(page)).toContainText("No saved note for this original speaker");
  await writing.fill("今は何時ですか。");
  await notebook(page).getByRole("button",{name:"Save my private listening note"}).click();
  let rows=await storeRows(page);
  expect(rows.documents).toHaveLength(2);
  await root.getByRole("button",{name:"Previous speaker"}).click();
  await expect(notebook(page)).toContainText("Saved on this device");
  await notebook(page).getByRole("button",{name:"Delete this saved note"}).click();
  await expect(notebook(page).getByRole("group",{name:"Confirm deleting private listening note"})).toBeVisible();
  await notebook(page).getByRole("button",{name:"Keep the note"}).click();
  await expect(notebook(page)).toContainText("Saved on this device");
  await notebook(page).getByRole("button",{name:"Delete this saved note"}).click();
  await notebook(page).getByRole("button",{name:"Confirm deleting my note"}).click();
  await expect(notebook(page)).toContainText("No saved note for this original speaker");
  rows=await storeRows(page);
  expect(rows.documents).toHaveLength(1);
  expect(rows.documents[0]?.text).toBe("今は何時ですか。");
  expect(rows.traces).toHaveLength(0);
  expect(rows.events.length).toBe(source.events.length);
});

test("E17 never displays a note from another original situation during source switching",async({page})=>{
  await qualifiedLearn(page);
  const root=studio(page);
  const selector=root.getByLabel("Original situation");
  // Choices arrive after the async source-qualified learner projection.
  // evaluateAll on an unmounted select would silently return an empty list.
  await expect(selector).toBeVisible();
  await expect.poll(()=>selector.locator("option").count()).toBeGreaterThanOrEqual(2);
  const values=await selector.locator("option").evaluateAll(options=>
    options.map(item=>(item as HTMLOptionElement).value));
  const [a,b]=values as [string,string,...string[]];
  await selector.selectOption(a);
  await root.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  await root.getByLabel(/Try the next Japanese line/).fill("SOURCE_A_PRIVATE_NOTE");
  await notebook(page).getByRole("button",{name:"Save my private listening note"}).click();
  await expect(notebook(page)).toContainText("Saved on this device");
  await selector.selectOption(b);
  await expect(root.getByLabel(/Try the next Japanese line/)).toHaveValue("");
  await expect(notebook(page)).toContainText("No saved note for this original speaker");
  await expect(notebook(page)).not.toContainText("SOURCE_A_PRIVATE_NOTE");
  await root.getByLabel(/Try the next Japanese line/).fill("SOURCE_B_PRIVATE_NOTE");
  await notebook(page).getByRole("button",{name:"Save my private listening note"}).click();
  await expect(notebook(page)).toContainText("Saved on this device");
  await selector.selectOption(a);
  await expect(root.getByLabel(/Try the next Japanese line/)).toHaveValue("");
  await expect(notebook(page)).toContainText("Saved on this device");
  await notebook(page).getByText("Read my last saved listening note").click();
  await expect(notebook(page).locator("pre[lang='ja']")).toHaveText("SOURCE_A_PRIVATE_NOTE");
  await expect(notebook(page)).not.toContainText("SOURCE_B_PRIVATE_NOTE");
  expect((await storeRows(page)).documents).toHaveLength(2);
});

test("E17 self-check uses the actual E11 listening answer and wrong-why without creating grades",async({page})=>{
  await qualifiedLearn(page);
  const root=studio(page);
  for(let i=0;i<4;i++)await root.getByRole("button",{name:"Next speaker"}).click();
  await expect(root).toContainText("Original turn 5 of 5");
  await root.getByRole("button",{name:"Reveal original Japanese and communicative intention"}).click();
  const checks=root.getByRole("region",{name:"Source-backed listening self-check"});
  await expect(checks).toBeVisible();
  await checks.getByLabel(/What did you understand/).fill("もう一度確認してください。");
  await checks.getByRole("button",{name:"Reveal original listening answer and misconceptions"}).click();
  const answer=checks.locator(".e17-notebook__answer");
  await expect(answer).toBeVisible();
  await expect(answer.locator("li")).toHaveCount(2);
  await expect(answer).toContainText("does not calculate correctness");
  expect((await storeRows(page)).documents).toHaveLength(0);
  expect((await storeRows(page)).events).toHaveLength(source.events.length);
  expect((await storeRows(page)).traces).toHaveLength(0);
});

test("E17 private-note save and recovery controls fit Android and compact mobile viewports",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Mobile touch geometry acceptance");
  await qualifiedLearn(page);
  const root=studio(page);
  await root.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  await root.getByLabel(/Try the next Japanese line/).fill("すみません、お願いします。");
  const save=notebook(page).getByRole("button",{name:"Save my private listening note"});
  await save.scrollIntoViewIfNeeded();
  const a=await save.boundingBox();
  const viewport=page.viewportSize()!;
  expect(a).not.toBeNull();
  expect(a!.height).toBeGreaterThanOrEqual(44);
  expect(a!.x).toBeGreaterThanOrEqual(-1);
  expect(a!.x+a!.width).toBeLessThanOrEqual(viewport.width+1);
  await save.click();
  await expect(notebook(page)).toContainText("Saved on this device");
  const restore=notebook(page).getByRole("button",{name:"Rehearse again from my saved note"});
  await restore.scrollIntoViewIfNeeded();
  const b=await restore.boundingBox();
  expect(b).not.toBeNull();
  expect(b!.height).toBeGreaterThanOrEqual(44);
  expect(b!.x).toBeGreaterThanOrEqual(-1);
  expect(b!.x+b!.width).toBeLessThanOrEqual(viewport.width+1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
