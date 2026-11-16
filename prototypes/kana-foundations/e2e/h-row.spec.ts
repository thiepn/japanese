import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const oldKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1'
];
async function submitCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 06 complete five-character, five-choice, five-word journey preserves prior Units 01–05',async({page},info)=>{
 await page.goto('/h-row.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(old.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),oldKeys);
 await expect(page.getByRole('heading',{name:'Learn は・ひ・ふ・へ・ほ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 06'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-h-row-introduction.png'});
 }
 for(const [kana,reading] of [['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await submitCorrect(page,reading);
 }
 for(const reading of ['ha','hi','fu','he','ho']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [['hako','box'],['hito','person'],['fune','boat'],['heta','unskilled'],['hoshi','star']]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-h-row-results.png'});
 const snapshot=await page.evaluate(async keys=>({
  previous:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  h:JSON.parse(localStorage.getItem('thiepn:kana-foundations:h-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),oldKeys);
 expect(snapshot.previous).toEqual(before);
 expect(snapshot.h.finished).toBe(true);
 expect(snapshot.h.records).toHaveLength(15);
 expect(snapshot.h.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 05'}).click();
 await expect(page.getByRole('heading',{name:'Learn な・に・ぬ・ね・の'})).toBeVisible();
});
test('Unit 06 accepts HU/hune and preserves wrong, revealed and corrected answers at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/h-row.html');
 await page.getByRole('button',{name:'Start Unit 06'}).click();
 for(const [kana,reading,wrong] of [['は','ho',true],['ひ','hi',false],['ふ','ＨＵ',false],['へ',null,false],['ほ','ho',false]]){
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
 for(const reading of ['ha','hi','fu','he','ho']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['hako','hito','hune','heta','hoshi'])await submitCorrect(page,reading);
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await submitCorrect(page,'ha');
 await submitCorrect(page,'he');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:h-row:prototype-only:v1')).records);
 expect(records).toHaveLength(17);
 expect(records[0].submitted).toBe('ho');
 expect(records[0].correct).toBe(false);
 expect(records[2].submitted).toBe('hu');
 expect(records[2].correct).toBe(true);
 expect(records[3].correct).toBeNull();
 expect(records[3].assisted).toBe(true);
 expect(records[12].submitted).toBe('hune');
 expect(records[12].correct).toBe(true);
 expect(records.slice(-2).map(r=>r.taskId)).toEqual(['intro-ha','intro-he']);
 expect(records.slice(-2).every(r=>r.correct===true&&r.correction)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 05 completion links to Unit 06 without rewriting Unit 05 progress',async({page})=>{
 await page.goto('/n-row.html');
 await page.evaluate(async()=>{
  const n=await import('./n-row-engine.mjs');
  let state=n.resume(n.initialState());
  for(let i=0;i<n.TASKS.length;i++){
   const t=n.taskAt(state);
   if(t.mode==='introduction')state=n.beginRecall(state);
   state=n.advance(n.answer(state,t.answer));
  }
  localStorage.setItem(n.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:'Continue to Unit 06 · はひふへほ'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:n-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 06 · はひふへほ'}).click();
 await expect(page.getByRole('heading',{name:'Learn は・ひ・ふ・へ・ほ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:n-row:prototype-only:v1'))).toBe(before);
});
