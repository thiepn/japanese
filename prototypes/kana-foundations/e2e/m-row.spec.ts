import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const oldKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1'
];
async function answerCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 07 full M-row lesson, five words, reload and data preservation across earlier units',async({page},info)=>{
 await page.goto('/m-row.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n','h'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(old.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const previous=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),oldKeys);
 await expect(page.getByRole('heading',{name:'Learn ま・み・む・め・も'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 07'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-m-row-introduction.png'});
 }
 for(const [kana,reading] of [['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await answerCorrect(page,reading);
 }
 for(const reading of ['ma','mi','mu','me','mo']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [
  ['mame','bean'],['mimi','ear'],['mushi','insect'],['meshi','meal'],['momo','peach']
 ]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-m-row-results.png'});
 const snapshot=await page.evaluate(async keys=>({
  old:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  m:JSON.parse(localStorage.getItem('thiepn:kana-foundations:m-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),oldKeys);
 expect(snapshot.old).toEqual(previous);
 expect(snapshot.m.finished).toBe(true);
 expect(snapshot.m.records).toHaveLength(15);
 expect(snapshot.m.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 06'}).click();
 await expect(page.getByRole('heading',{name:'Learn は・ひ・ふ・へ・ほ'})).toBeVisible();
});
test('Unit 07 keeps first errors and reveal uncredited, accepts musi/mesi, and corrects at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/m-row.html');
 await page.getByRole('button',{name:'Start Unit 07'}).click();
 for(const [kana,reading,wrong] of [['ま','mo',true],['み','mi',false],['む',null,false],['め','me',false],['も','mo',false]]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  if(reading===null){
   await page.getByRole('button',{name:'Show answer (no credit)'}).click();
   await expect(page.getByText(/Answer revealed/)).toBeVisible();
  }else{
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText(wrong?'Not quite.':'Correct.')).toBeVisible();
  }
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ma','mi','mu','me','mo']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['mame','mimi','ＭＵＳＩ','ＭＥＳＩ','momo'])await answerCorrect(page,reading);
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await answerCorrect(page,'ma');
 await answerCorrect(page,'mu');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:m-row:prototype-only:v1')).records);
 expect(records).toHaveLength(17);
 expect(records[0].submitted).toBe('mo');
 expect(records[0].correct).toBe(false);
 expect(records[2].correct).toBeNull();
 expect(records[2].assisted).toBe(true);
 expect(records[12].submitted).toBe('musi');
 expect(records[12].correct).toBe(true);
 expect(records[13].submitted).toBe('mesi');
 expect(records[13].correct).toBe(true);
 expect(records.slice(-2).map(x=>x.taskId)).toEqual(['intro-ma','intro-mu']);
 expect(records.slice(-2).every(x=>x.correction&&x.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 06 completion links to Unit 07 without changing previous evidence',async({page})=>{
 await page.goto('/h-row.html');
 await page.evaluate(async()=>{
  const h=await import('./h-row-engine.mjs');
  let state=h.resume(h.initialState());
  for(let i=0;i<h.TASKS.length;i++){
   const task=h.taskAt(state);
   if(task.mode==='introduction')state=h.beginRecall(state);
   state=h.advance(h.answer(state,task.answer));
  }
  localStorage.setItem(h.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:'Continue to Unit 07 · まみむめも'})).toBeVisible();
 const previous=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:h-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 07 · まみむめも'}).click();
 await expect(page.getByRole('heading',{name:'Learn ま・み・む・め・も'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:h-row:prototype-only:v1'))).toBe(previous);
});
