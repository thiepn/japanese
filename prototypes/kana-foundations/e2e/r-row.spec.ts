import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const earlierKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1',
 'thiepn:kana-foundations:m-row:prototype-only:v1',
 'thiepn:kana-foundations:y-row:prototype-only:v1'
];
async function correct(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 09 teaches five R-row kana and five words without changing Units 01–08',async({page},info)=>{
 await page.goto('/r-row.html');
 await page.evaluate(async()=>{
  const original=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n','h','m','y'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(original.PROTOTYPE_STORAGE_KEY,JSON.stringify(original.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),earlierKeys);
 await expect(page.getByRole('heading',{name:'Learn ら・り・る・れ・ろ'})).toBeVisible();
 await expect(page.getByText(/tongue tap/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 09'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-r-row-introduction.png'});
 }
 for(const [kana,reading] of [['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await correct(page,reading);
 }
 for(const reading of ['ra','ri','ru','re','ro']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [['raku','ease'],['rikai','understanding'],['rusu','absence'],['rekishi','history'],['roku','six']]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-r-row-results.png'});
 const snapshot=await page.evaluate(async keys=>({
  prior:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  r:JSON.parse(localStorage.getItem('thiepn:kana-foundations:r-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),earlierKeys);
 expect(snapshot.prior).toEqual(before);
 expect(snapshot.r.finished).toBe(true);
 expect(snapshot.r.records).toHaveLength(15);
 expect(snapshot.r.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 08'}).click();
 await expect(page.getByRole('heading',{name:'Learn や・ゆ・よ'})).toBeVisible();
});
test('Unit 09 keeps first wrong/revealed evidence and accepts rekisi during correction at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/r-row.html');
 await page.getByRole('button',{name:'Start Unit 09'}).click();
 for(const [kana,reading,wrong] of [['ら','ra',false],['り','ri',false],['る','ro',true],['れ','re',false],['ろ','ro',false]]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(wrong?'Not quite.':'Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ra','ri','ru','re','ro']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['raku','rikai','rusu'])await correct(page,reading);
 await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await correct(page,'roku');
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await correct(page,'ru');
 await correct(page,'ＲＥＫＩＳＩ');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:r-row:prototype-only:v1')).records);
 expect(records).toHaveLength(17);
 expect(records[2].correct).toBe(false);
 expect(records[2].submitted).toBe('ro');
 expect(records[13].correct).toBeNull();
 expect(records[13].assisted).toBe(true);
 expect(records.at(-1).submitted).toBe('rekisi');
 expect(records.slice(-2).map(x=>x.taskId)).toEqual(['intro-ru','word-rekishi']);
 expect(records.slice(-2).every(x=>x.correction&&x.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 08 completion links to Unit 09 without mutating the prior three-character score',async({page})=>{
 await page.goto('/y-row.html');
 await page.evaluate(async()=>{
  const y=await import('./y-row-engine.mjs');
  let state=y.resume(y.initialState());
  for(const t of y.TASKS){
   if(t.mode==='introduction')state=y.beginRecall(state);
   state=y.advance(y.answer(state,t.answer));
  }
  localStorage.setItem(y.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 09 · らりるれろ'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:y-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 09 · らりるれろ'}).click();
 await expect(page.getByRole('heading',{name:'Learn ら・り・る・れ・ろ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:y-row:prototype-only:v1'))).toBe(before);
});
