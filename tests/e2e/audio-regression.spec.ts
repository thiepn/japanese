import {expect,test,type Page} from "@playwright/test";

async function initMockJapaneseVoice(page:Page){
  await page.addInitScript(()=>{
    const root=window as unknown as {__audioRegression:{utterances:Array<{
      text:string;onend:(()=>void)|null;onerror:(()=>void)|null;
    }>;cancels:number;speaks:number}};
    const state={utterances:[] as typeof root.__audioRegression.utterances,cancels:0,speaks:0};
    root.__audioRegression=state;
    class JapaneseVoice {
      lang="";rate=1;voice:null=null;
      onend:(()=>void)|null=null;
      onerror:(()=>void)|null=null;
      constructor(readonly text:string){}
    }
    Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:JapaneseVoice});
    Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{
      paused:false,getVoices:()=>[{lang:"ja-JP",name:"device Japanese mock"}],
      cancel:()=>{state.cancels++;},
      speak:(voice:JapaneseVoice)=>{state.speaks++;state.utterances.push(voice);},
    }});
  });
}
async function endCurrent(page:Page,kind:"end"|"error"){
  await page.evaluate((kind)=>{
    const state=(window as any).__audioRegression;
    const last=state.utterances.at(-1);
    if(kind==="end")last?.onend?.();
    else last?.onerror?.();
  },kind);
}
async function openMorning(page:Page){
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();
  await expect(page.locator(".j6-reader")).toBeVisible();
}

test("reader sentence replay retries on a device failure and unlocks controls on completion",async({page})=>{
  await initMockJapaneseVoice(page);
  await openMorning(page);
  await page.getByRole("button",{name:"Replay sentence"}).first().click();
  await expect(page.getByRole("button",{name:"Playing…",exact:true})).toBeVisible();
  await endCurrent(page,"error");
  await expect(page.locator(".j6-reader__tools .audio-error")).toContainText("Sentence playback failed");
  const replay=page.getByRole("button",{name:"Replay sentence"}).first();
  await expect(replay).toBeEnabled();
  await replay.click();
  await endCurrent(page,"end");
  await expect(replay).toBeEnabled();
  await expect(page.locator(".j6-reader__tools .audio-error")).toHaveCount(0);
  expect(await page.evaluate(()=>(window as any).__audioRegression.speaks)).toBe(2);
});

test("shadowing reference voice failure becomes a retryable visible error",async({page})=>{
  await initMockJapaneseVoice(page);
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator("#j6-studio-shadowing > summary").click();
  const action=page.getByRole("button",{name:"Play reference"});
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.getByRole("button",{name:"Playing…",exact:true})).toBeVisible();
  await endCurrent(page,"error");
  await expect(page.locator(".shadowing-lab .import-message[role=status]")).toContainText("Reference playback failed");
  await expect(action).toBeEnabled();
  await action.click();
  await endCurrent(page,"end");
  await expect(action).toBeEnabled();
  expect(await page.evaluate(()=>(window as any).__audioRegression.speaks)).toBe(2);
});

test("reader full-passage speech is cancelled when changing activities, without granting a listen",async({page})=>{
  await initMockJapaneseVoice(page);
  await openMorning(page);
  await page.getByRole("button",{name:"Listen to full text"}).click();
  const original=await page.evaluate(()=>(window as any).__audioRegression.utterances.at(-1)?.text);
  expect(original?.length).toBeGreaterThan(10);
  await page.locator(".j6-reader__back").click();
  const counts=await page.evaluate(()=>({
    cancels:(window as any).__audioRegression.cancels,
    speaks:(window as any).__audioRegression.speaks
  }));
  expect(counts.cancels).toBeGreaterThan(0);
  expect(counts.speaks).toBe(1);
  await page.evaluate(()=>{
    (window as any).__audioRegression.utterances.at(-1)?.onend?.();
  });
  const card=page.locator(".j6-cover").filter({hasText:"A school morning"});
  await expect(card.locator(".j6-cover__footer > div").nth(1).locator("strong")).toHaveText("0%");
});
