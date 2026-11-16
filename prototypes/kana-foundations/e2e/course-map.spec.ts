import {test,expect} from '@playwright/test';
import * as K from '../k-row-engine.mjs';
import * as Y from '../katakana-y-row-engine.mjs';
test('course map displays 27 real routes; leaves foreign storage unchanged',async({page})=>{
 await page.goto('/course-map.html');
 await expect(page.getByRole('heading',{name:'Choose a kana unit'})).toBeVisible();
 await expect(page.locator('.course-card')).toHaveCount(27);
 await page.evaluate(()=>localStorage.setItem('thiepn:account:test','preserve'));
 await page.reload();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:account:test'))).toBe('preserve');
 await page.locator('.course-card[href="./katakana-y-row.html"]').click();
 await expect(page.getByRole('heading',{name:'Learn ヤ・ユ・ヨ'})).toBeVisible();
});
test('unfinished lesson is suggested without rewriting its saved first attempt',async({page})=>{
 await page.goto('/course-map.html');
 const raw=await page.evaluate(async key=>{
  const m=await import('./katakana-y-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'ya');
  const json=JSON.stringify(s);localStorage.setItem(key,json);return json;
 },Y.STORAGE_KEY);
 await page.reload();
 await expect(page.locator('.course-card[href="./katakana-y-row.html"]')).toContainText('In progress');
 await expect(page.getByRole('link',{name:'Resume',exact:true})).toHaveAttribute('href','./katakana-y-row.html');
 expect(await page.evaluate(k=>localStorage.getItem(k),Y.STORAGE_KEY)).toEqual(raw);
});
test('invalid save remains byte-identical; narrow screen remains within viewport',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto('/course-map.html');
 const bad='{"schema":900,"keep":"original"}';
 await page.evaluate(([key,val])=>localStorage.setItem(key,val),[K.STORAGE_KEY,bad]);
 await page.reload();
 await expect(page.locator('.course-card[href="./k-row.html"]')).toContainText('Saved progress needs review');
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toEqual(bad);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
