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

test('search by Japanese, romaji or unit number updates results without dropping keyboard focus',async({page})=>{
 await page.goto('/course-map.html');
 const search=page.getByRole('searchbox',{name:'Find a unit'});
 await expect(search).toBeVisible();
 await search.fill('ヤ');
 await expect(page.locator('.course-card')).toHaveCount(1);
 await expect(page.locator('.course-card').first()).toHaveAttribute('href','./katakana-y-row.html');
 await expect(search).toBeFocused();
 await search.fill('unit 27');
 await expect(page.locator('.course-card')).toHaveCount(1);
 await search.fill('nonexistent');
 await expect(page.getByText('No units match this search or status.')).toBeVisible();
 await page.getByRole('button',{name:'Show all units',exact:true}).click();
 await expect(page.locator('.course-card')).toHaveCount(27);
 await expect(search).toBeFocused();
});
test('status filter shows unfinished and invalid local records without changing them',async({page})=>{
 await page.goto('/course-map.html');
 const original='{"schema":999,"keep":"unchanged"}';
 const started=await page.evaluate(async keys=>{
  const m=await import('./katakana-y-row-engine.mjs');
  let s=m.resume(m.initialState());s=m.beginRecall(s);s=m.answer(s,'ya');
  const save=JSON.stringify(s);
  localStorage.setItem(keys[0],save);
  localStorage.setItem(keys[1],'{"schema":999,"keep":"unchanged"}');
  return save;
 },[Y.STORAGE_KEY,K.STORAGE_KEY]);
 await page.reload();
 await page.getByRole('button',{name:'In progress',exact:true}).click();
 await expect(page.locator('.course-card')).toHaveCount(1);
 await expect(page.locator('.course-card').first()).toHaveAttribute('href','./katakana-y-row.html');
 await page.getByRole('button',{name:'Needs review',exact:true}).click();
 await expect(page.locator('.course-card')).toHaveCount(1);
 await expect(page.locator('.course-card').first()).toHaveAttribute('href','./k-row.html');
 expect(await page.evaluate(k=>localStorage.getItem(k),Y.STORAGE_KEY)).toBe(started);
 expect(await page.evaluate(k=>localStorage.getItem(k),K.STORAGE_KEY)).toBe(original);
 await page.getByRole('button',{name:'All units',exact:true}).click();
 await expect(page.locator('.course-card')).toHaveCount(27);
});

test('intermediate lessons expose the course map when paused, not during active assessment',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 for(const route of ['k-row.html','reading-review.html','sokuon-rhythm.html','yoon-kshch.html','katakana-n-row.html']){
  await page.goto('/'+route);
  const nav=page.getByRole('link',{name:'All units',exact:true});
  await expect(nav).toBeVisible();
  await expect(nav).toHaveAttribute('href','./course-map.html');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 await page.goto('/k-row.html');
 await page.getByRole('button',{name:'Start Unit 02'}).click();
 await expect(page.getByRole('link',{name:'All units',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Exit lesson; progress is saved'}).click();
 const before=await page.evaluate(key=>localStorage.getItem(key),K.STORAGE_KEY);
 expect(before).toBeTruthy();
 await page.getByRole('link',{name:'All units',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Choose a kana unit'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),K.STORAGE_KEY)).toBe(before);
});


test('download exports every saved lesson exactly, even when view is filtered',async({page})=>{
 const {readFileSync}=await import('node:fs');
 await page.goto('/course-map.html');
 const invalid=' { "schema": 999, "kana": "あ", "padding": " " }  ';
 const stored=await page.evaluate(async([k,y,bad])=>{
  const m=await import('./katakana-y-row-engine.mjs');
  let state=m.resume(m.initialState());
  state=m.beginRecall(state);state=m.answer(state,'ya');
  const raw=JSON.stringify(state);
  localStorage.setItem(k,bad);localStorage.setItem(y,raw);
  localStorage.setItem('thiepn:account:secret','do-not-export');
  localStorage.setItem('thiepn:kana-foundations:unlisted','do-not-export-either');
  return raw;
 },[K.STORAGE_KEY,Y.STORAGE_KEY,invalid]);
 const before=await page.evaluate(()=>Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)]));
 await page.getByRole('searchbox',{name:'Find a unit'}).fill('unit 27');
 await expect(page.locator('.course-card')).toHaveCount(1);
 const [download]=await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button',{name:'Download local progress'}).click()
 ]);
 expect(download.suggestedFilename()).toMatch(/^kana-foundations-progress-\d{4}-\d{2}-\d{2}\.json$/);
 const backup=JSON.parse(readFileSync(await download.path(),'utf8'));
 expect(backup.format).toBe('thiepn-kana-foundations-local-progress');
 expect(backup.version).toBe(1);
 expect(backup.records).toEqual([
  {unitId:2,key:K.STORAGE_KEY,raw:invalid},
  {unitId:27,key:Y.STORAGE_KEY,raw:stored}
 ]);
 await expect(page.locator('#backup-feedback')).toHaveText('Backup download prepared for 2 saved units.');
 expect(await page.evaluate(()=>Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)]))).toEqual(before);
});
test('no progress or inaccessible saved data cannot produce a misleading backup',async({page})=>{
 await page.goto('/course-map.html');
 await page.getByRole('button',{name:'Download local progress'}).click();
 await expect(page.locator('#backup-feedback')).toHaveText('No Kana Foundations lesson progress is saved in this browser.');
 await page.evaluate(key=>{
  const original=Storage.prototype.getItem;
  Storage.prototype.getItem=function(k){if(k===key)throw Error('blocked');return original.call(this,k);};
 },K.STORAGE_KEY);
 await page.getByRole('button',{name:'Download local progress'}).click();
 await expect(page.locator('#backup-feedback')).toHaveText('Unable to prepare a complete backup. Saved lessons were not changed.');
});
