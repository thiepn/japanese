import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const priorKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1',
 'thiepn:kana-foundations:m-row:prototype-only:v1'
];
async function submitCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 08 three-kana complete flow, five words and preserved earlier evidence',async({page},info)=>{
 await page.goto('/y-row.html');
 await page.evaluate(async()=>{
  const original=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n','h','m'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(original.PROTOTYPE_STORAGE_KEY,JSON.stringify(original.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Learn や・ゆ・よ'})).toBeVisible();
 await expect(page.getByText(/no regular yi or ye characters/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 08'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-y-row-introduction.png'});
 }
 for(const [kana,reading] of [['や','ya'],['ゆ','yu'],['よ','yo']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await submitCorrect(page,reading);
 }
 for(const reading of ['ya','yu','yo']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [['yama','mountain'],['yuki','snow'],['yoko','side'],['yume','dream'],['yasai','vegetables']]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-y-row-results.png'});
 await expect(page.getByText('3 / 3').first()).toBeVisible();
 await expect(page.getByText('5 / 5')).toBeVisible();
 const snapshot=await page.evaluate(async keys=>({
  prior:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  y:JSON.parse(localStorage.getItem('thiepn:kana-foundations:y-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(snapshot.prior).toEqual(before);
 expect(snapshot.y.finished).toBe(true);
 expect(snapshot.y.records).toHaveLength(11);
 expect(snapshot.y.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 07'}).click();
 await expect(page.getByRole('heading',{name:'Learn ま・み・む・め・も'})).toBeVisible();
});
test('Unit 08 corrected first errors and assisted words persist separately on a 320px device',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/y-row.html');
 await page.getByRole('button',{name:'Start Unit 08'}).click();
 for(const [kana,reading,wrong] of [['や','ya',false],['ゆ','yo',true],['よ','yo',false]]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(wrong?'Not quite.':'Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ya','yu','yo']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 await submitCorrect(page,'yama');
 await submitCorrect(page,'yuki');
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await submitCorrect(page,'yume');
 await submitCorrect(page,'yasai');
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await submitCorrect(page,'yu');
 await submitCorrect(page,'yoko');
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:y-row:prototype-only:v1')).records);
 expect(records).toHaveLength(13);
 expect(records[1].correct).toBe(false);
 expect(records[1].submitted).toBe('yo');
 expect(records[8].correct).toBeNull();
 expect(records[8].assisted).toBe(true);
 expect(records.slice(-2).map(x=>x.taskId)).toEqual(['intro-yu','word-yoko']);
 expect(records.slice(-2).every(x=>x.correction&&x.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 07 completed lessons link to Unit 08 with unchanged saved results',async({page})=>{
 await page.goto('/m-row.html');
 await page.evaluate(async()=>{
  const m=await import('./m-row-engine.mjs');
  let s=m.resume(m.initialState());
  for(const t of m.TASKS){
   if(t.mode==='introduction')s=m.beginRecall(s);
   s=m.advance(m.answer(s,t.answer));
  }
  localStorage.setItem(m.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 08 · やゆよ'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:m-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 08 · やゆよ'}).click();
 await expect(page.getByRole('heading',{name:'Learn や・ゆ・よ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:m-row:prototype-only:v1'))).toBe(before);
});
