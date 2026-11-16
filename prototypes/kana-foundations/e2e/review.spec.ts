import {test,expect} from '@playwright/test';
import * as K from '../k-row-engine.mjs';

test('review reveals an original answer without mutating learner or account data',async({page})=>{
 await page.goto('/review.html');
 await expect(page.getByRole('heading',{name:'Review first attempts'})).toBeVisible();
 await expect(page.getByText('No first-attempt difficulties are saved in this browser.')).toBeVisible();
 const raw=await page.evaluate(async()=>{
  const m=await import('./k-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'wrong');
  const raw=JSON.stringify(s);
  localStorage.setItem(m.STORAGE_KEY,raw);localStorage.setItem('thiepn:account:test','preserve');
  return raw;
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 await expect(page.locator('#review-answer')).toHaveCount(0);
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await expect(page.locator('#review-answer strong')).toHaveText('ka');
 await page.getByRole('button',{name:'Hide answer'}).click();
 await expect(page.locator('#review-answer')).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),K.STORAGE_KEY)).toBe(raw);
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:test'))).toBe('preserve');
});
test('review filters and advances through real missed items at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/review.html');
 await page.evaluate(async()=>{
  const m=await import('./k-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'wrong');
  s=m.advance(s);s=m.beginRecall(s);s=m.answer(s,'wrong');
  localStorage.setItem(m.STORAGE_KEY,JSON.stringify(s));
  const v=await import('./engine.mjs');
  let a=v.start(v.initialState());a=v.beginIntroCheck(a);a=v.submit(a,'wrong');
  localStorage.setItem(v.PROTOTYPE_STORAGE_KEY,JSON.stringify(a));
 });
 await page.reload();
 await expect(page.locator('#review-count')).toHaveText('1 / 3 prompts · Round 1');
 await page.getByLabel('Review unit').selectOption('2');
 await expect(page.locator('#review-count')).toHaveText('1 / 2 prompts · Round 1');
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 await page.getByRole('button',{name:'Next'}).click();
 await expect(page.getByRole('heading',{name:'き'})).toBeVisible();
 await expect(page.locator('#review-answer')).toHaveCount(0);
 await page.getByRole('button',{name:'Previous'}).click();
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('corrupt lesson data is reported without rewriting it',async({page})=>{
 await page.goto('/review.html');
 const raw='{"schema":900,"keep":"original"}';
 await page.evaluate(([key,value])=>localStorage.setItem(key,value),[K.STORAGE_KEY,raw]);
 await page.reload();
 await expect(page.getByRole('alert')).toContainText('1 saved unit is unavailable or invalid');
 await expect(page.getByText('No first-attempt difficulties are saved in this browser.')).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),K.STORAGE_KEY)).toBe(raw);
});

test('self-check ratings advance, summarize and retry only missed items without persistence',async({page})=>{
 await page.goto('/review.html');
 const original=await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let s=k.resume(k.initialState());
  s=k.beginRecall(s);s=k.answer(s,'wrong');
  s=k.advance(s);s=k.beginRecall(s);s=k.answer(s,'wrong');
  const raw=JSON.stringify(s);
  localStorage.setItem(k.STORAGE_KEY,raw);
  localStorage.setItem('thiepn:account:self-check','preserve');
  return raw;
 });
 await page.reload();
 await expect(page.locator('#review-count')).toContainText('1 / 2 prompts');
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await expect(page.locator('#review-answer strong')).toHaveText('ka');
 await page.getByRole('button',{name:'I remembered'}).click();
 await expect(page.getByRole('heading',{name:'き'})).toBeVisible();
 await expect(page.locator('#review-answer')).toHaveCount(0);
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await page.getByRole('button',{name:'Review again',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Round 1 summary'})).toBeVisible();
 await expect(page.locator('.review-summary dt').filter({hasText:'Remembered'}).locator('..').locator('dd')).toHaveText('1');
 await expect(page.locator('.review-summary dt').filter({hasText:'Review again'}).locator('..').locator('dd')).toHaveText('1');
 await page.getByRole('button',{name:'Retry missed or skipped'}).click();
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts · Round 2');
 await expect(page.getByRole('heading',{name:'き'})).toBeVisible();
 await page.getByRole('button',{name:'Finish round'}).click();
 await expect(page.getByRole('heading',{name:'Round 2 summary'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toEqual(original);
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:self-check'))).toBe('preserve');
});
test('skipped prompts stay in retry queue; ratings reset on unit switch and reload',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/review.html');
 await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let s=k.resume(k.initialState());s=k.beginRecall(s);s=k.answer(s,'wrong');
  s=k.advance(s);s=k.beginRecall(s);s=k.answer(s,'wrong');
  localStorage.setItem(k.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await page.getByRole('button',{name:'Next'}).click();
 await page.getByRole('button',{name:'Finish round'}).click();
 await expect(page.getByRole('heading',{name:'Round 1 summary'})).toBeVisible();
 await expect(page.getByText('Skipped').locator('..').locator('dd')).toHaveText('2');
 await page.getByRole('button',{name:'Retry missed or skipped'}).click();
 await expect(page.locator('#review-count')).toContainText('1 / 2 prompts · Round 2');
 await page.getByLabel('Review unit').selectOption('2');
 await expect(page.locator('#review-count')).toContainText('Round 1');
 await page.reload();
 await expect(page.locator('#review-count')).toContainText('Round 1');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});


test('typed kana is retained verbatim, compared manually and never written to learner storage',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/review.html');
 const raw=await page.evaluate(async()=>{
  const m=await import('./k-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'wrong');
  s=m.advance(s);s=m.beginRecall(s);s=m.answer(s,'wrong');
  const save=JSON.stringify(s);
  localStorage.setItem(m.STORAGE_KEY,save);
  localStorage.setItem('thiepn:account:typed','keep');
  return save;
 });
 await page.reload();
 const input=page.getByRole('textbox',{name:'Your answer (optional)'});
 await expect(input).toBeVisible();
 await input.fill('カ・ｋａ');
 await expect(input).toHaveValue('カ・ｋａ');
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await expect(page.locator('#review-your-response strong')).toHaveText('カ・ｋａ');
 await expect(page.locator('#review-answer strong')).toHaveText('ka');
 await expect(page.getByText('no automatic score is assigned.',{exact:false})).toBeVisible();
 await expect(page.getByText('Correct',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Hide answer'}).click();
 await expect(input).toBeDisabled();
 await expect(input).toHaveValue('カ・ｋａ');
 await page.getByRole('button',{name:'Next'}).click();
 await page.getByRole('textbox',{name:'Your answer (optional)'}).fill('ki');
 await page.getByRole('button',{name:'Previous'}).click();
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('カ・ｋａ');
 await page.getByRole('button',{name:'Next'}).click();
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('ki');
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toBe(raw);
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:typed'))).toBe('keep');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.reload();
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('');
});
test('romanized draft stays until reveal and resets for a retry round',async({page})=>{
 await page.goto('/review.html');
 await page.evaluate(async()=>{
  const m=await import('./k-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'wrong');
  localStorage.setItem(m.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 const input=page.getByRole('textbox',{name:'Your answer (optional)'});
 await input.fill('ko');
 await expect(input).toBeFocused();
 await input.fill('ka');
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await expect(page.locator('#review-your-response strong')).toHaveText('ka');
 await page.getByRole('button',{name:'Review again',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Round 1 summary'})).toBeVisible();
 await page.getByRole('button',{name:'Retry missed or skipped'}).click();
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('');
 await expect(page.locator('#review-answer')).toHaveCount(0);
 await expect(page.locator('#review-count')).toContainText('Round 2');
});


test('all-recorded mode allows useful practice after a fully correct first response without persistence',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/review.html');
 const original=await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let s=k.resume(k.initialState());s=k.beginRecall(s);s=k.answer(s,'ka');
  const raw=JSON.stringify(s);
  localStorage.setItem(k.STORAGE_KEY,raw);
  localStorage.setItem('thiepn:account:all-attempts','preserve');
  return raw;
 });
 await page.reload();
 await expect(page.getByText('No difficult first attempts recorded.',{exact:false})).toBeVisible();
 await page.getByLabel('Practice set').selectOption('all');
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 await expect(page.getByText('Independent first response',{exact:true})).toBeVisible();
 await page.getByRole('textbox',{name:'Your answer (optional)'}).fill('か');
 await page.getByRole('button',{name:'Reveal answer'}).click();
 await expect(page.locator('#review-your-response strong')).toHaveText('か');
 await expect(page.locator('#review-answer strong')).toHaveText('ka');
 await page.getByRole('button',{name:'I remembered'}).click();
 await expect(page.getByRole('heading',{name:'Round 1 summary'})).toBeVisible();
 await page.getByLabel('Practice set').selectOption('difficult');
 await expect(page.getByText('No difficult first attempts recorded.',{exact:false})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toBe(original);
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:all-attempts'))).toBe('preserve');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.reload();
 await expect(page.getByLabel('Practice set')).toHaveValue('difficult');
});
test('switching between mixed and difficult sets resets only temporary review inputs',async({page})=>{
 await page.goto('/review.html');
 const original=await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let s=k.resume(k.initialState());s=k.beginRecall(s);s=k.answer(s,'wrong');
  s=k.advance(s);s=k.beginRecall(s);s=k.answer(s,'ki');
  const raw=JSON.stringify(s);localStorage.setItem(k.STORAGE_KEY,raw);return raw;
 });
 await page.reload();
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await page.getByRole('textbox',{name:'Your answer (optional)'}).fill('temporary');
 await page.getByLabel('Practice set').selectOption('all');
 await expect(page.locator('#review-count')).toContainText('1 / 2 prompts');
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('');
 await page.getByRole('button',{name:'Next'}).click();
 await expect(page.getByRole('heading',{name:'き'})).toBeVisible();
 await expect(page.getByText('Independent first response',{exact:true})).toBeVisible();
 await page.getByLabel('Review unit').selectOption('2');
 await expect(page.locator('#review-count')).toContainText('1 / 2 prompts');
 await page.getByLabel('Practice set').selectOption('difficult');
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toBe(original);
});


test('section choice reviews recorded hiragana, patterns and katakana separately at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/review.html');
 const originals=await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let a=k.resume(k.initialState());a=k.beginRecall(a);a=k.answer(a,'wrong');
  const reading=await import('./reading-review-engine.mjs');
  let b=reading.resume(reading.initialState());b=reading.answer(b,'wrong');
  const katakana=await import('./katakana-vowels-engine.mjs');
  let c=katakana.resume(katakana.initialState());c=katakana.beginRecall(c);
  c=katakana.answer(c,'wrong');
  const values=[[k.STORAGE_KEY,JSON.stringify(a)],
   [reading.STORAGE_KEY,JSON.stringify(b)],
   [katakana.STORAGE_KEY,JSON.stringify(c)]];
  values.forEach(([key,raw])=>localStorage.setItem(key,raw));
  localStorage.setItem('thiepn:account:sections','preserve');
  return values;
 });
 await page.reload();
 await expect(page.locator('#review-count')).toContainText('1 / 3 prompts');
 await page.getByLabel('Review unit or section').selectOption('group:katakana');
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await expect(page.getByText('Unit 20',{exact:false}).first()).toBeVisible();
 await page.getByRole('textbox',{name:'Your answer (optional)'}).fill('temporary');
 await page.getByLabel('Review unit or section').selectOption('group:combinations');
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await expect(page.getByText('Unit 11',{exact:false}).first()).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Your answer (optional)'})).toHaveValue('');
 await page.getByLabel('Review unit or section').selectOption('group:hiragana');
 await expect(page.locator('#review-count')).toContainText('1 / 1 prompts');
 await expect(page.getByRole('heading',{name:'か'})).toBeVisible();
 await page.getByLabel('Review unit or section').selectOption('all');
 await expect(page.locator('#review-count')).toContainText('1 / 3 prompts');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const actual=await page.evaluate(keys=>keys.map(([key])=>[key,localStorage.getItem(key)]),originals);
 expect(actual).toEqual(originals);
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:sections'))).toBe('preserve');
});
