import {expect,test} from '@playwright/test';
import {createEmptyCard} from 'ts-fsrs';

const owner='00000000-0000-4000-8000-000000000001';

test.beforeEach(async({page})=>{
  await page.addInitScript(({owner})=>{
    const lease={owner,epoch:'a'.repeat(32)};
    localStorage.setItem('thiepn:japanese:kana-owner:v2',JSON.stringify(lease));
    sessionStorage.setItem('thiepn:japanese:kana-handoff',JSON.stringify({...lease,at:Date.now()}));
  },{owner});
});

test('learning a character updates the staged lesson progress before grading',async({page})=>{
  await page.goto('kana/?view=learn');
  await expect(page.getByRole('button',{name:'Start',exact:true}).first()).toBeVisible();
  await page.getByRole('button',{name:'Start',exact:true}).first().click();
  await expect(page.getByRole('button',{name:'Next Character'})).toBeVisible();
  await page.getByRole('button',{name:'Next Character'}).click();
  await page.getByRole('button',{name:'Stages',exact:true}).click();
  await expect(page.getByRole('button',{name:'Continue',exact:true}).first()).toBeVisible();
});

test('portable backup restores Google cards and separately opts into same-account Japanese FSRS',async({page})=>{
  await page.goto('kana/');
  const reviewed=createEmptyCard(new Date('2026-10-18T12:00:00.000Z'));
  reviewed.reps=2;reviewed.state=2;reviewed.stability=4;reviewed.difficulty=4;
  reviewed.due=new Date('2026-11-18T12:00:00.000Z');
  const entries=(id:string)=>({cardId:id,card:reviewed,
    direction:'kana-to-romaji' as const,totalReviews:2,totalLapses:0,
    lastReviewedAt:'2026-10-18T12:00:00.000Z'});
  const payload={
    version:3,appName:'KANA',owner,settings:null,
    cards:[entries('h-ka')],canonicalProjection:[entries('h-ke')],
    logs:[{cardId:'h-ka',reviewTime:'2026-10-18T12:00:00.000Z',log:{rating:3}}]
  };
  await expect(page.getByRole('navigation',{name:'Primary'})).toBeVisible();
  await page.getByRole('button',{name:'Study tools'}).click();
  await page.getByRole('button',{name:'Settings & backup'}).click();
  await page.locator('input[type="file"]').setInputFiles({
    name:'kana-backup.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify(payload))
  });
  await expect(page.getByRole('button',{name:'Back up current data and restore missing cards'})).toBeVisible();
  const downloaded=page.waitForEvent('download');
  await page.getByRole('button',{name:'Back up current data and restore missing cards'}).click();
  await downloaded;
  await expect(page.getByText(/Restored 1 missing cards and 1 review logs/)).toBeVisible();
  await page.getByRole('button',{name:'Restore 1 missing Japanese schedules'}).click();
  await expect(page.getByText(/1 Japanese schedules restored/)).toBeVisible();
  const actual=await page.evaluate(async({owner})=>{
    const kana=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open('kana_mastery_v1:'+owner);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    const studio=await new Promise<{cardId:string}>((resolve,reject)=>{
      const req=kana.transaction('cards').objectStore('cards').get('h-ka');
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });kana.close();
    const native=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open('thiepn-japanese:'+owner);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    const summary=await new Promise<{reps:number,imports:number}>((resolve,reject)=>{
      const tx=native.transaction(['memory_traces','study_events'],'readonly');
      const trace=tx.objectStore('memory_traces').get('kana:hiragana-け:reading:kana-to-romaji-recall');
      const events=tx.objectStore('study_events').getAll();
      tx.oncomplete=()=>resolve({reps:trace.result?.card.reps??0,
        imports:events.result.filter((x:{metadata?:{kanaStudioImport?:boolean}})=>x.metadata?.kanaStudioImport).length});
      tx.onerror=()=>reject(tx.error);
    });native.close();
    return {studio:studio?.cardId,...summary};
  },{owner});
  expect(actual).toEqual({studio:'h-ka',reps:2,imports:1});
});
