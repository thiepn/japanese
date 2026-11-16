import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const KEY='thiepn:kana-foundations:reading-review:prototype-only:v1';
const priorKeys=[
 'thiepn:kana-foundations:prototype-only:v1',
 'thiepn:kana-foundations:k-row:prototype-only:v1',
 'thiepn:kana-foundations:s-row:prototype-only:v1',
 'thiepn:kana-foundations:t-row:prototype-only:v1',
 'thiepn:kana-foundations:n-row:prototype-only:v1',
 'thiepn:kana-foundations:h-row:prototype-only:v1',
 'thiepn:kana-foundations:m-row:prototype-only:v1',
 'thiepn:kana-foundations:y-row:prototype-only:v1',
 'thiepn:kana-foundations:r-row:prototype-only:v1',
 'thiepn:kana-foundations:w-row:prototype-only:v1'
];
async function continueAfterFeedback(page){
 await page.getByRole('button',{name:/^(Continue|See results)$/}).click();
}
async function typeCorrect(page,reading){
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await continueAfterFeedback(page);
}
async function chooseCorrect(page,label){
 await page.getByRole('button',{name:label}).click();
 await expect(page.getByText('Correct.')).toBeVisible();
 await continueAfterFeedback(page);
}
test('Unit 11 teaches all four phases, accepts prior romanization, and never touches Units 01–10',async({page},info)=>{
 await page.goto('/reading-review.html');
 await page.evaluate(async()=>{
  const vowels=await import('./engine.mjs');
  const engines=await Promise.all(['k','s','t','n','h','m','y','r','w'].map(row=>import('./'+row+'-row-engine.mjs')));
  localStorage.setItem(vowels.PROTOTYPE_STORAGE_KEY,JSON.stringify(vowels.initialState()));
  for(const engine of engines)localStorage.setItem(engine.STORAGE_KEY,JSON.stringify(engine.initialState()));
  localStorage.setItem('thiepn:account:sentinel','account-original');
  localStorage.setItem('thiepn:fsrs:sentinel','fsrs-original');
 });
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),priorKeys);
 await expect(page.getByRole('heading',{name:'Hiragana in action'})).toBeVisible();
 await expect(page.getByText(/は is pronounced/)).toBeVisible();
 await expect(page.getByText(/object marker を is pronounced/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 11'}).click();
 if(process.env.CI){
  mkdirSync('prototypes/kana-foundations/.visual-evidence',{recursive:true});
  await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-review-introduction.png'});
 }
 for(const reading of ['sakana','neru','hasiru','muku','omosiroi']){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await typeCorrect(page,reading);
 }
 for(const particle of ['は','を','は','を']){
  await expect(page.getByRole('heading',{name:'Choose the particle'})).toBeVisible();
  await chooseCorrect(page,particle==='は'?'Particle は · topic (wa)':'Particle を · object (o)');
 }
 for(const reading of ['watasi wa hon wo yomu','nekowaneru','yamawatakai','senseiwahonoyomu']){
  await expect(page.getByRole('heading',{name:'Read the sentence'})).toBeVisible();
  await typeCorrect(page,reading);
 }
 for(const meaning of ['The dog runs.','The cat sees the fish.','I peel a mandarin orange.','The book is interesting.']){
  await expect(page.getByRole('heading',{name:'Understand the sentence'})).toBeVisible();
  await chooseCorrect(page,'Answer '+meaning);
 }
 await expect(page.getByRole('heading',{name:'Reading review completed'})).toBeVisible();
 await expect(page.getByText('5 / 5')).toBeVisible();
 await expect(page.getByText('4 / 4').first()).toBeVisible();
 if(process.env.CI)await page.screenshot({path:'prototypes/kana-foundations/.visual-evidence/'+info.project.name+'-review-results.png'});
 const saved=await page.evaluate(async keys=>({
  previous:Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),
  review:JSON.parse(localStorage.getItem('thiepn:kana-foundations:reading-review:prototype-only:v1')),
  account:localStorage.getItem('thiepn:account:sentinel'),
  fsrs:localStorage.getItem('thiepn:fsrs:sentinel'),
  databases:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(db=>db.name):[]
 }),priorKeys);
 expect(saved.previous).toEqual(before);
 expect(saved.review.finished).toBe(true);
 expect(saved.review.records).toHaveLength(17);
 expect(saved.review.records.every(r=>r.correct===true&&!r.assisted)).toBe(true);
 expect(saved.review.records[2].submitted).toBe('hasiru');
 expect(saved.review.records[4].submitted).toBe('omosiroi');
 expect(saved.review.records[9].submitted).toBe('watasiwahonwoyomu');
 expect(saved.account).toBe('account-original');
 expect(saved.fsrs).toBe('fsrs-original');
 expect(saved.databases).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Reading review completed'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 10'}).click();
 await expect(page.getByRole('heading',{name:'Learn わ・を・ん'})).toBeVisible();
});
test('Unit 11 corrects wrong, assisted and misread responses after mobile reload without revising first attempts',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/reading-review.html');
 await page.getByRole('button',{name:'Start Unit 11'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('sakano');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await continueAfterFeedback(page);
 for(const reading of ['neru','hashiru','muku','omoshiroi'])await typeCorrect(page,reading);
 await chooseCorrect(page,'Particle は · topic (wa)');
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 await expect(page.getByText(/Answer revealed/)).toBeVisible();
 await continueAfterFeedback(page);
 await chooseCorrect(page,'Particle は · topic (wa)');
 await chooseCorrect(page,'Particle を · object (o)');
 await typeCorrect(page,'watashiwahonoyomu');
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('nekowamiru');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText('Not quite.')).toBeVisible();
 await continueAfterFeedback(page);
 for(const reading of ['yamawatakai','senseiwahonoyomu'])await typeCorrect(page,reading);
 for(const meaning of ['The dog runs.','The cat sees the fish.','I peel a mandarin orange.','The book is interesting.'])
  await chooseCorrect(page,'Answer '+meaning);
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await typeCorrect(page,'sakana');
 await chooseCorrect(page,'Particle を · object (o)');
 await typeCorrect(page,'nekowaneru');
 await expect(page.getByRole('heading',{name:'Reading review completed'})).toBeVisible();
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:reading-review:prototype-only:v1')));
 expect(record.finished).toBe(true);
 expect(record.records).toHaveLength(20);
 expect(record.corrections).toEqual(['word-sakana','particle-object-hon','sentence-neko-neru']);
 expect(record.records[0].submitted).toBe('sakano');
 expect(record.records[0].correct).toBe(false);
 expect(record.records[6].correct).toBeNull();
 expect(record.records[6].assisted).toBe(true);
 expect(record.records[10].submitted).toBe('nekowamiru');
 expect(record.records[10].correct).toBe(false);
 expect(record.records.slice(-3).map(x=>x.taskId)).toEqual(record.corrections);
 expect(record.records.slice(-3).every(x=>x.correction&&x.correct===true)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 10 completion offers Unit 11 without modifying saved records or the original object lesson',async({page})=>{
 await page.goto('/w-row.html');
 await page.evaluate(async()=>{
  const w=await import('./w-row-engine.mjs');
  let s=w.resume(w.initialState());
  for(const t of w.TASKS){
   if(t.mode==='introduction')s=w.beginRecall(s);
   s=w.advance(w.answer(s,t.answer));
  }
  localStorage.setItem(w.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'3 more hiragana learned'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continue to Unit 11 · Hiragana in action'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:w-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 11 · Hiragana in action'}).click();
 await expect(page.getByRole('heading',{name:'Hiragana in action'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:w-row:prototype-only:v1'))).toBe(before);
});
test('Unit 11 refuses to overwrite corrupt or concurrently changed progress',async({page})=>{
 await page.goto('/reading-review.html');
 const invalid='{"schema":99,"malformed":"preserve this record"}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,invalid]);
 await page.reload();
 await expect(page.getByText(/progress is invalid or unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 11'}).click();
 await typeCorrect(page,'sakana');
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(invalid);
 await page.evaluate(key=>localStorage.removeItem(key),KEY);
 await page.reload();
 await page.getByRole('button',{name:'Start Unit 11'}).click();
 const foreign='{"schema":101,"fromOtherTab":true}';
 await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[KEY,foreign]);
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('sakana');
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/Another tab changed Unit 11/)).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe(foreign);
});
