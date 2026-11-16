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
 await expect(page.locator('#review-count')).toHaveText('1 / 3 prompts');
 await page.getByLabel('Review unit').selectOption('2');
 await expect(page.locator('#review-count')).toHaveText('1 / 2 prompts');
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
 await expect(page.getByText('Remembered').locator('..').locator('dd')).toHaveText('1');
 await expect(page.getByText('Review again',{exact:true}).first().locator('..').locator('dd')).toHaveText('1');
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
