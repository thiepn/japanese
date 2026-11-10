import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const priorKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1',
 'thiepn:kana-foundations:m-row:prototype-only:v1',
 'thiepn:kana-foundations:y-row:prototype-only:v1',
 'thiepn:kana-foundations:r-row:prototype-only:v1'
];
async function submitCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 10 teaches three kana, five genuine words and a complete object-marked phrase',async({page},info)=>{
 await page.goto('/w-row.html');
 await page.evaluate(async()=>{
  const vowels=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n','h','m','y','r'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(vowels.PROTOTYPE_STORAGE_KEY,JSON.stringify(vowels.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
 });
 const previous=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Learn わ・を・ん'})).toBeVisible();
 await expect(page.getByText(/object particle, pronounced o/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 10'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-w-row-introduction.png'});
 }
 for(const [kana,reading] of [['わ','wa'],['を','o'],['ん','n']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await submitCorrect(page,reading);
 }
 for(const reading of ['wa','o','n']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const [reading,meaning] of [
  ['wani','crocodile'],['hon','book'],['mikan','mandarin orange'],
  ['sensei','teacher'],['wakaru','understand']
 ]){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(new RegExp('Meaning: .*'+meaning))).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Read the phrase'})).toBeVisible();
 await expect(page.getByText(/を marks the object and sounds o/)).toBeVisible();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('hon o yomu');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await expect(page.getByText(/Meaning: read a book/)).toBeVisible();
 await expect(page.getByText(/ほん \(book\)/)).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 await expect(page.getByText('6 / 6')).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-w-row-results.png'});
 const saved=await page.evaluate(async keys=>({
  previous:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  w:JSON.parse(localStorage.getItem('thiepn:kana-foundations:w-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(saved.previous).toEqual(previous);
 expect(saved.w.finished).toBe(true);
 expect(saved.w.records).toHaveLength(12);
 expect(saved.w.records.every(x=>x.correct===true&&!x.assisted)).toBe(true);
 expect(saved.w.records[11].submitted).toBe('honoyomu');
 expect(saved.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 09'}).click();
 await expect(page.getByRole('heading',{name:'Learn ら・り・る・れ・ろ'})).toBeVisible();
});
test('Unit 10 accepts wo spelling but teaches o sound, and separately corrects nasal, book and phrase',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/w-row.html');
 await page.getByRole('button',{name:'Start Unit 10'}).click();
 for(const [kana,reading,wrong] of [['わ','wa',false],['を','ＷＯ',false],['ん','nu',true]]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(wrong?'Not quite.':'Correct.')).toBeVisible();
  if(kana==='を')await expect(page.getByText('Correct reading: o')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['wa','o','n']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 await submitCorrect(page,'wani');
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 for(const reading of ['mikan','sensei','wakaru'])await submitCorrect(page,reading);
 await expect(page.getByRole('heading',{name:'Read the phrase'})).toBeVisible();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('honoyomi');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await submitCorrect(page,'n');
 await submitCorrect(page,'hon');
 await expect(page.getByRole('heading',{name:'Read the phrase'})).toBeVisible();
 await submitCorrect(page,'HON WO YOMU');
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 const rec=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:w-row:prototype-only:v1')).records);
 expect(rec).toHaveLength(15);
 expect(rec[1].submitted).toBe('wo');
 expect(rec[1].correct).toBe(true);
 expect(rec[2].submitted).toBe('nu');
 expect(rec[2].correct).toBe(false);
 expect(rec[7].correct).toBeNull();
 expect(rec[7].assisted).toBe(true);
 expect(rec[11].submitted).toBe('honoyomi');
 expect(rec[11].correct).toBe(false);
 expect(rec.slice(-3).map(r=>r.taskId)).toEqual(['intro-n','word-hon','phrase-hon-o-yomu']);
 expect(rec.at(-1).submitted).toBe('honwoyomu');
 expect(rec.slice(-3).every(r=>r.correction&&r.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 09 completion offers Unit 10 while preserving all original Unit 09 records',async({page})=>{
 await page.goto('/r-row.html');
 await page.evaluate(async()=>{
  const r=await import('./r-row-engine.mjs');
  let state=r.resume(r.initialState());
  for(const task of r.TASKS){
   if(task.mode==='introduction')state=r.beginRecall(state);
   state=r.advance(r.answer(state,task.answer));
  }
  localStorage.setItem(r.STORAGE_KEY,JSON.stringify(state));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 10 · わをん'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:r-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 10 · わをん'}).click();
 await expect(page.getByRole('heading',{name:'Learn わ・を・ん'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:r-row:prototype-only:v1'))).toBe(before);
});
