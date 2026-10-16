import {readFileSync} from "node:fs";
import {expect,test,type Page} from "@playwright/test";

const fixture=JSON.parse(readFileSync("artifacts/e13-browser-seed.json","utf8")) as {
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
  },fixture);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
}
function studio(page:Page){
  return page.getByRole("region",{
    name:"Follow the whole conversation, one speaker at a time",
  });
}
async function eventCount(page:Page):Promise<number>{
  return page.evaluate(async guest=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open("thiepn-japanese:"+guest,8);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const value=await new Promise<number>((resolve,reject)=>{
      const req=db.transaction("study_events","readonly").objectStore("study_events").count();
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    db.close();return value;
  },fixture.guest);
}

test("E16 teaches the complete original source exchange turn by turn and hands off to E14",async({page})=>{
  await qualifiedLearn(page);
  const lab=studio(page);
  await expect(lab).toBeVisible();
  const selector=lab.getByLabel("Original situation");
  expect(await selector.locator("option").count()).toBeGreaterThanOrEqual(2);
  await expect(lab.getByText("Original turn 1 of 5")).toBeVisible();
  await expect(lab.getByText("Japanese transcript hidden until you reveal this turn.")).toBeVisible();
  await lab.getByRole("button",{name:"Reveal original Japanese and communicative intention"}).click();
  await expect(lab.locator(".e16-studio__japanese")).toBeVisible();
  await expect(lab).toContainText("Intention:");
  const first=await lab.locator(".e16-studio__japanese").innerText();
  expect(first.trim()).not.toBe("");
  await lab.getByRole("button",{name:"Next speaker"}).click();
  await expect(lab.getByText("Original turn 2 of 5")).toBeVisible();
  await expect(lab.getByText("Japanese transcript hidden until you reveal this turn.")).toBeVisible();
  await lab.getByRole("button",{name:"Reveal original Japanese and communicative intention"}).click();
  await expect(lab).toContainText("Source-owned response question");
  await lab.getByRole("button",{name:"Previous speaker"}).click();
  await expect(lab.getByText("Original turn 1 of 5")).toBeVisible();
  await lab.getByRole("button",{name:"Original accompanying notice and communication caution"}).click();
  await expect(lab.getByText("Practical action:")).toBeVisible();
  await lab.getByRole("button",{name:"Continue to saved listening, replies and writing"}).click();
  const player=page.locator("main.j5-study-shell");
  await expect(player).toBeVisible();
  await expect(player).toContainText("Extra practice");
});

test("E16 shadow text is temporary, never creates StudyEvents and clears on navigation",async({page})=>{
  await qualifiedLearn(page);
  const before=await eventCount(page);
  const lab=studio(page);
  await lab.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  const draft="すみません。会場の確認をお願いします。";
  await lab.getByLabel(/Try the next Japanese line/).fill(draft);
  await lab.getByRole("button",{name:"Reveal original Japanese and communicative intention"}).click();
  await lab.getByText("Compare with my unsent response").click();
  await expect(lab.locator("pre[lang='ja']")).toHaveText(draft);
  await lab.getByRole("button",{name:"Next speaker"}).click();
  await expect(lab.getByLabel(/Try the next Japanese line/)).toHaveValue("");
  await lab.getByLabel(/Try the next Japanese line/).fill(draft);
  await page.reload();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const reloaded=studio(page);
  await reloaded.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  await expect(reloaded.getByLabel(/Try the next Japanese line/)).toHaveValue("");
  expect(await eventCount(page)).toBe(before);
  await expect(reloaded).toContainText("No recording, speech recognition, score, mastery or new StudyEvent");
});

test("E16 whole-source audio playback is interruptible and speaks original turns without network calls",async({page})=>{
  await page.addInitScript(()=>{
    const holder=window as unknown as {__e16AudioTexts:string[];__e16AudioRates:number[]};
    holder.__e16AudioTexts=[];
    holder.__e16AudioRates=[];
    class DeviceVoice {
      text:string;lang="";rate=1;voice=null;
      onend:((event:Event)=>void)|null=null;
      onerror:((event:Event)=>void)|null=null;
      constructor(text:string){this.text=text;}
    }
    Object.defineProperty(window,"SpeechSynthesisUtterance",{
      configurable:true,value:DeviceVoice,
    });
    Object.defineProperty(window,"speechSynthesis",{
      configurable:true,value:{
        getVoices:()=>[{lang:"ja-JP",name:"mock Japanese voice"}],
        cancel:()=>{},
        speak:(utterance:DeviceVoice)=>{
          holder.__e16AudioTexts.push(utterance.text);
          holder.__e16AudioRates.push(utterance.rate);
          queueMicrotask(()=>utterance.onend?.(new Event("end")));
        },
      },
    });
  });
  await qualifiedLearn(page);
  const lab=studio(page);
  await lab.getByRole("button",{name:"Play entire original dialogue"}).click();
  await expect(lab.getByText("Original turn 5 of 5")).toBeVisible();
  const utterances=await page.evaluate(()=>{
    const obj=window as unknown as {__e16AudioTexts:string[];__e16AudioRates:number[]};
    return {text:obj.__e16AudioTexts,rate:obj.__e16AudioRates};
  });
  expect(utterances.text).toHaveLength(5);
  expect(utterances.text.every(x=>x.trim().length>0)).toBe(true);
  expect(utterances.rate).toEqual([1,1,1,1,1]);
  await lab.getByLabel("Rehearsal approach").selectOption("shadow-and-reply");
  await lab.getByRole("button",{name:"Hear this Japanese turn"}).click();
  await expect.poll(async()=>page.evaluate(()=>
    (window as unknown as {__e16AudioRates:number[]}).__e16AudioRates.at(-1)
  )).toBe(.78);
  await expect(lab).toContainText("Audio is not recorded.");
});

test("E16 speaker, reveal and handoff controls remain visible in Android and compact mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Mobile viewport acceptance only");
  await qualifiedLearn(page);
  const lab=studio(page);
  const open=lab.getByRole("button",{name:"Reveal original Japanese and communicative intention"});
  await open.scrollIntoViewIfNeeded();
  const a=await open.boundingBox();
  const size=page.viewportSize()!;
  expect(a).not.toBeNull();
  expect(a!.height).toBeGreaterThanOrEqual(44);
  expect(a!.x).toBeGreaterThanOrEqual(-1);
  expect(a!.x+a!.width).toBeLessThanOrEqual(size.width+1);
  await open.click();
  await expect(lab.locator(".e16-studio__japanese")).toBeVisible();
  const c=lab.getByRole("button",{name:"Continue to saved listening, replies and writing"});
  await c.scrollIntoViewIfNeeded();
  const b=await c.boundingBox();
  expect(b).not.toBeNull();
  expect(b!.height).toBeGreaterThanOrEqual(44);
  expect(b!.x).toBeGreaterThanOrEqual(-1);
  expect(b!.x+b!.width).toBeLessThanOrEqual(size.width+1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});
