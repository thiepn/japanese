import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

async function typeCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}

test('Unit 04 fully teaches T-row and five real words without changing prior unit progress',async({page},info)=>{
 await page.goto('/t-row.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const k=await import('./k-row-engine.mjs');
  const s=await import('./s-row-engine.mjs');
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(old.initialState()));
  localStorage.setItem(k.STORAGE_KEY,JSON.stringify(k.initialState()));
  localStorage.setItem(s.STORAGE_KEY,JSON.stringify(s.initialState()));
 });
 const previous=await page.evaluate(()=>Object.fromEntries([
  'thiepn:kana-foundations:prototype-only:v1',
  'thiepn:kana-foundations:k-row:prototype-only:v1',
  'thiepn:kana-foundations:s-row:prototype-only:v1'
 ].map(key=>[key,localStorage.getItem(key)])));
 await expect(page.getByRole('heading',{name:'Learn た・ち・つ・て・と'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 04'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-t-row-introduction.png'});
 }
 for(const [kana,reading] of [['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await typeCorrect(page,reading);
 }
 for(const reading of ['ta','chi','tsu','te','to']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['tako','chikai','tsuki','suteki','tokei']){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await typeCorrect(page,reading);
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-t-row-results.png'});
 const data=await page.evaluate(async()=>({
  previous:Object.fromEntries([
   'thiepn:kana-foundations:prototype-only:v1',
   'thiepn:kana-foundations:k-row:prototype-only:v1',
   'thiepn:kana-foundations:s-row:prototype-only:v1'
  ].map(key=>[key,localStorage.getItem(key)])),
  t:JSON.parse(localStorage.getItem('thiepn:kana-foundations:t-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(x=>x.name):[]
 }));
 expect(data.previous).toEqual(previous);
 expect(data.t.finished).toBe(true);
 expect(data.t.records).toHaveLength(15);
 expect(data.t.records.every(r=>r.correct===true&&!r.assisted)).toBe(true);
 expect(data.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 03'}).click();
 await expect(page.getByRole('heading',{name:'Learn さ・し・す・せ・そ'})).toBeVisible();
});

test('Unit 04 accepts chi/tsu typing alternatives; preserves wrong/revealed evidence and compact reflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/t-row.html');
 await page.getByRole('button',{name:'Start Unit 04'}).click();
 const intro=[['た','chi','wrong'],['ち','TI','correct'],['つ','ＴＵ','correct'],['て',null,'revealed'],['と','to','correct']];
 for(const [kana,reading,kind] of intro){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  if(reading===null){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
  }else{
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText(kind==='wrong'?'Not quite.':'Correct.')).toBeVisible();
  }
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ta','chi','tsu','te','to']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['tako','tikai','tuki','suteki','tokei'])await typeCorrect(page,reading);
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await typeCorrect(page,'ta');
 await typeCorrect(page,'te');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:t-row:prototype-only:v1')).records);
 expect(records).toHaveLength(17);
 expect(records[0].correct).toBe(false);
 expect(records[1].submitted).toBe('ti');
 expect(records[2].submitted).toBe('tu');
 expect(records[3].correct).toBeNull();
 expect(records[11].submitted).toBe('tikai');
 expect(records[12].submitted).toBe('tuki');
 expect(records.slice(-2).every(r=>r.correction&&r.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('Unit 03 completion provides navigation to Unit 04 without modifying saved Unit 03',async({page})=>{
 await page.goto('/s-row.html');
 await page.evaluate(async()=>{
  const sRow=await import('./s-row-engine.mjs');
  let state=sRow.resume(sRow.initialState());
  for(let i=0;i<sRow.TASKS.length;i++){
   const task=sRow.taskAt(state);
   if(task.mode==='introduction')state=sRow.beginRecall(state);
   state=sRow.advance(sRow.answer(state,task.answer));
  }
  localStorage.setItem(sRow.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:'Continue to Unit 04 · たちつてと'})).toBeVisible();
 const previous=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:s-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 04 · たちつてと'}).click();
 await expect(page.getByRole('heading',{name:'Learn た・ち・つ・て・と'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:s-row:prototype-only:v1'))).toBe(previous);
});
