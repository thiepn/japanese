import {test,expect} from '@playwright/test';
async function learn(page,kana,reading){
 await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
 await page.getByRole('button',{name:'Try recalling '+kana}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
 await page.getByRole('button',{name:'Check answer'}).click();
 await expect(page.getByText(/Independent answer recorded/)).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
}


test('guided first two vowels and correct practice with durable prototype-only state',async({page})=>{
 await page.goto('/index.html');
 await expect(page.getByRole('heading',{name:/Read your first Japanese characters/})).toBeVisible();
 await page.getByRole('button',{name:'Start learning'}).click();
 await learn(page,'あ','a');
 await expect(page.getByRole('heading',{name:'Meet い'})).toBeVisible();
 await page.reload();
 await learn(page,'い','i');
 await expect(page.getByRole('heading',{name:'How do you read this?'})).toBeVisible();
 await page.getByRole('button',{name:'Reading a'}).click();
 await expect(page.getByText('Independent answer recorded.')).toBeVisible();
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Reading i'}).click();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByRole('heading',{name:'Meet う'})).toBeVisible();
 const keys=await page.evaluate(()=>Object.keys(localStorage));
 expect(keys).toEqual(['thiepn:kana-foundations:prototype-only:v1']);
});

test('wrong first answer is recorded then correction offered later',async({page})=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 await learn(page,'あ','a');
 await learn(page,'い','i');
 await page.getByRole('button',{name:'Reading i'}).click(); // Wrong for あ
 await expect(page.getByText(/The correct answer is/)).toContainText('a');
 await page.getByRole('button',{name:'Continue'}).click();
 await page.getByRole('button',{name:'Reading i'}).click();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByText('Correction practice',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Reading a'}).click();
 await page.getByRole('button',{name:'Continue'}).click();
 await expect(page.getByRole('heading',{name:'Meet う'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records);
 expect(records.filter(r=>r.item==='h-a'&&r.mode==='recognition').map(r=>({correct:r.correct,correction:r.correction})))
  .toEqual([{correct:false,correction:false},{correct:true,correction:true}]);
});

test('listening can be skipped without credit if audio unavailable',async({page})=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({...m.initialState(),phase:5,paused:false}));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Which character do you hear?'})).toBeVisible();
 await page.getByRole('button',{name:'Continue without listening (not assessed)'}).click();
 await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records);
 expect(records[0].mode).toBe('listening');expect(records[0].correct).toBeNull();
});

test('mobile lesson has no document horizontal overflow and accessible control sizes',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 const bounds=await page.evaluate(()=>{
  const button=document.querySelector('button[data-action="advance"]').getBoundingClientRect();
  return {documentWidth:document.documentElement.scrollWidth,viewportWidth:window.innerWidth,
   buttonHeight:button.height,buttonWidth:button.width};
 });
 expect(bounds.documentWidth).toBeLessThanOrEqual(bounds.viewportWidth+1);
 expect(bounds.buttonHeight).toBeGreaterThanOrEqual(48);
 expect(bounds.buttonWidth).toBeGreaterThanOrEqual(44);
 await expect(page.locator('.hero-glyph')).toBeVisible();
 await testInfo.attach('kana-foundations-first-lesson',{body:await page.screenshot(),contentType:'image/png'});
});

test('typed recall is keyboard-submittable and assisted attempts stay marked',async({page})=>{
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({...m.initialState(),phase:4,paused:false}));
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'Type the reading'})).toBeVisible();
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await page.getByRole('textbox',{name:'Type the romaji reading'}).fill('u');
 await page.getByRole('textbox',{name:'Type the romaji reading'}).press('Enter');
 await expect(page.getByText(/You used a hint/)).toBeVisible();
 const event=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:prototype-only:v1')).records.at(-1));
 expect(event.assisted).toBe(true);expect(event.correct).toBe(true);
});