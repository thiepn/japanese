import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

async function submitCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}

test('Unit 05 teaches the full N-row, reads five real words, and preserves Units 01–04',async({page},info)=>{
 await page.goto('/n-row.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const k=await import('./k-row-engine.mjs');
  const s=await import('./s-row-engine.mjs');
  const t=await import('./t-row-engine.mjs');
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(old.initialState()));
  for(const engine of [k,s,t])localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const oldKeys=['thiepn:kana-foundations:prototype-only:v1',
  'thiepn:kana-foundations:k-row:prototype-only:v1',
  'thiepn:kana-foundations:s-row:prototype-only:v1',
  'thiepn:kana-foundations:t-row:prototype-only:v1'];
 const previous=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),oldKeys);
 await expect(page.getByRole('heading',{name:'Learn な・に・ぬ・ね・の'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 05'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-n-row-introduction.png'});
 }
 for(const [kana,reading] of [['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await submitCorrect(page,reading);
 }
 for(const reading of ['na','ni','nu','ne','no']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [['nani','what'],['inu','dog'],['neko','cat'],['kinoko','mushroom'],['nuno','cloth']]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-n-row-results.png'});
 const snapshot=await page.evaluate(async keys=>({
  previous:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  n:JSON.parse(localStorage.getItem('thiepn:kana-foundations:n-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),oldKeys);
 expect(snapshot.previous).toEqual(previous);
 expect(snapshot.n.finished).toBe(true);
 expect(snapshot.n.records).toHaveLength(15);
 expect(snapshot.n.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 04'}).click();
 await expect(page.getByRole('heading',{name:'Learn た・ち・つ・て・と'})).toBeVisible();
});

test('Unit 05 distinguishes ぬ and の, preserves wrong/revealed attempts, repairs through corrections at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/n-row.html');
 await page.getByRole('button',{name:'Start Unit 05'}).click();
 for(const [kana,reading] of [['な','na'],['に','ni'],['ぬ','no'],['ね','ne'],['の','no']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(kana==='ぬ'?'Not quite.':'Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['na','ni','nu','ne','no']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['nani','inu','neko'])await submitCorrect(page,reading);
 await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await submitCorrect(page,'nuno');
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await submitCorrect(page,'nu');
 await submitCorrect(page,'kinoko');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:n-row:prototype-only:v1')).records);
 expect(records).toHaveLength(17);
 expect(records[2].submitted).toBe('no');
 expect(records[2].correct).toBe(false);
 expect(records[13].correct).toBeNull();
 expect(records[13].assisted).toBe(true);
 expect(records.slice(-2).map(x=>x.taskId)).toEqual(['intro-nu','word-kinoko']);
 expect(records.slice(-2).every(x=>x.correct===true&&x.correction)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('Unit 04 completion opens Unit 05 without rewriting its existing records',async({page})=>{
 await page.goto('/t-row.html');
 await page.evaluate(async()=>{
  const t=await import('./t-row-engine.mjs');
  let state=t.resume(t.initialState());
  for(let i=0;i<t.TASKS.length;i++){
   const task=t.taskAt(state);
   if(task.mode==='introduction')state=t.beginRecall(state);
   state=t.advance(t.answer(state,task.answer));
  }
  localStorage.setItem(t.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:'Continue to Unit 05 · なにぬねの'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:t-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 05 · なにぬねの'}).click();
 await expect(page.getByRole('heading',{name:'Learn な・に・ぬ・ね・の'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:t-row:prototype-only:v1'))).toBe(before);
});
