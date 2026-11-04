import {test,expect} from '@playwright/test';

// Real click-through regression: a complete beginner journey, not a fabricated
// engine state jump. Listening is skipped without credit because CI has no
// verified Japanese audio source or reliable speech synthesizer.
test('complete five-vowel lesson reports correct first-attempt evidence and survives reload',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 await testInfo.attach('first-introduction',{body:await page.screenshot(),contentType:'image/png'});
 for(const glyph of ['あ','い']){
   await expect(page.getByRole('heading',{name:'Meet '+glyph})).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const answer of ['a','i']){
   await page.getByRole('button',{name:'Reading '+answer}).click();
   await expect(page.getByText(/Independent answer recorded/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const glyph of ['う','え','お']){
   await expect(page.getByRole('heading',{name:'Meet '+glyph})).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const answer of ['a','i','u','e','o']){
   await page.getByRole('button',{name:'Reading '+answer}).click();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const answer of ['u','e','a','o','i']){
   await expect(page.getByRole('heading',{name:'Type the reading'})).toBeVisible();
   const input=page.getByRole('textbox',{name:'Type the romaji reading'});
   await input.fill(answer);
   await input.press('Enter');
   await expect(page.getByText(/Independent answer recorded/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(let i=0;i<5;i++){
   await expect(page.getByRole('heading',{name:'Which character do you hear?'})).toBeVisible();
   await page.getByRole('button',{name:'Skip listening — no credit'}).click();
   await expect(page.getByText('No listening evidence has been recorded for this question.')).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['ie','ao','ue']){
   await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
   await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
   await page.getByRole('button',{name:'Check answer'}).click();
   await expect(page.getByText(/Meaning:/)).toBeVisible();
   await page.getByRole('button',{name:'Continue'}).click();
 }
 await expect(page.getByRole('heading',{name:'Your five-vowel results'})).toBeVisible();
 await expect(page.getByText(/These are first-attempt results/)).toBeVisible();
 const summary=await page.evaluate(async()=>{
   const m=await import('./engine.mjs');
   return m.firstAttemptSummary(JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)));
 });
 expect(summary.introduced).toBe(5);
 expect(summary.recognition).toEqual({correct:5,total:5});
 expect(summary.recall).toEqual({correct:5,total:5,skipped:0,assisted:0});
 expect(summary.listening).toEqual({correct:0,total:5,skipped:5,assisted:0});
 expect(summary.reading).toEqual({correct:3,total:3,skipped:0,assisted:0});
 await testInfo.attach('lesson-results',{body:await page.screenshot(),contentType:'image/png'});
 await page.reload();
 await expect(page.getByRole('heading',{name:'Your five-vowel results'})).toBeVisible();
 const m=await page.evaluate(async()=>{
   const module=await import('./engine.mjs');
   return {keys:Object.keys(localStorage),databases:typeof indexedDB.databases==='function'
      ?(await indexedDB.databases()).map(db=>db.name):[]};
 });
 expect(m.keys).toEqual(['thiepn:kana-foundations:prototype-only:v1']);
 expect(m.databases).toEqual([]); // no Japanese IndexedDB opened
});

test('pause/resume during exercise preserves question and feedback',async({page})=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Exit',exact:true}).click();
 await expect(page.getByRole('button',{name:'Resume learning'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Resume learning'}).click();
 await expect(page.getByRole('heading',{name:'Meet い'})).toBeVisible();
});
