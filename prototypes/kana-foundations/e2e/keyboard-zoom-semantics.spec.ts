import {test,expect} from '@playwright/test';

async function begin(page){
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({
   ...m.initialState(),phase:7,paused:false,introduced:m.VOWELS.map(v=>v.id),records:[]
  }));
 });
 await page.reload();
 await page.getByRole('button',{name:'Start 15-question mixed practice'}).click();
 await expect(page.getByRole('heading',{name:'Mixed recognition'})).toBeVisible();
}
test('keyboard-only hint and answer preserve meaningful focus and feedback semantics',async({page})=>{
 await begin(page);
 const hint=page.getByRole('button',{name:'Need a hint?'});
 await hint.focus();await page.keyboard.press('Enter');
 const cue=page.locator('.practice-screen .hint');
 await expect(cue).toBeVisible();
 const focusedAfterHint=await page.evaluate(()=>({id:document.activeElement?.id,tag:document.activeElement?.tagName,role:document.activeElement?.getAttribute('role')}));
 expect(focusedAfterHint.tag).not.toBe('BODY');
 expect(['main','hint','status','button']).toContain(focusedAfterHint.id||focusedAfterHint.role||focusedAfterHint.tag?.toLowerCase());
 const choice=page.locator('.practice-screen button[data-practice-value]').first();
 await choice.focus();await page.keyboard.press('Enter');
 const result=page.locator('.practice-screen [role="status"].feedback');
 await expect(result).toBeVisible();
 expect(await page.evaluate(()=>document.activeElement?.tagName)).not.toBe('BODY');
 await expect(page.getByRole('button',{name:'Next practice question'})).toBeVisible();
 // Announcements are asserted by DOM semantics only. No actual screen reader used.
 await expect(result).toHaveAttribute('aria-live','polite');
});
test('200%-equivalent CSS viewport and text enlargement preserve reflow and keyboard access',async({page})=>{
 await page.setViewportSize({width:320,height:700}); // equivalent reduced CSS viewport to 640 px browser at 200% zoom
 await begin(page);
 await page.evaluate(()=>{
  document.documentElement.style.fontSize='200%';
  document.body.style.fontSize='200%';
 });
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await expect(page.getByRole('heading',{name:'Mixed recognition'})).toBeVisible();
 const widths=await page.evaluate(()=>{
  const root=document.documentElement;
  const main=document.querySelector('#main');
  const targets=[...document.querySelectorAll('.practice-screen button, .practice-screen .hint, .practice-screen .glyph-panel')];
  return {viewport:innerWidth,scroll:root.scrollWidth,
   mainLeft:main.getBoundingClientRect().left,mainRight:main.getBoundingClientRect().right,
   targets:targets.map(x=>({left:x.getBoundingClientRect().left,right:x.getBoundingClientRect().right}))};
 });
 expect(widths.scroll).toBeLessThanOrEqual(widths.viewport+1);
 expect(widths.mainLeft).toBeGreaterThanOrEqual(-1);
 expect(widths.mainRight).toBeLessThanOrEqual(widths.viewport+1);
 for(const box of widths.targets){
  expect(box.left).toBeGreaterThanOrEqual(-1);
  expect(box.right).toBeLessThanOrEqual(widths.viewport+1);
 }
 const answer=page.locator('.practice-screen button[data-practice-value]').first();
 await answer.focus();await page.keyboard.press('Space');
 await expect(page.locator('.practice-screen [role="status"].feedback')).toBeVisible();
});
test('screen-reader-facing semantics expose prompt, group, language and assisted status',async({page})=>{
 await begin(page);
 const main=page.locator('main#main');
 await expect(main).toHaveAttribute('tabindex','-1');
 await expect(page.getByRole('heading',{name:'Mixed recognition',level:1})).toBeVisible();
 await expect(page.locator('.practice-screen .glyph-panel [lang="ja"]')).toHaveCount(1);
 const options=page.locator('.practice-screen button[data-practice-value]');
 await expect(options).toHaveCount(5);
 for(const index of [0,1,2,3,4])expect(await options.nth(index).getAttribute('aria-label')).toMatch(/^Reading [aiueo]$/);
 await page.getByRole('button',{name:'Need a hint?'}).click();
 await expect(page.locator('.practice-screen .hint')).toHaveAttribute('role','status');
 await page.getByRole('button',{name:'Show answer (no credit)'}).click();
 const status=page.locator('.practice-screen [role="status"].feedback');
 await expect(status).toBeVisible();
 await expect(status).toContainText('no credit');
 await expect(status).toHaveAttribute('aria-live','polite');
 const saved=await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  return JSON.parse(localStorage.getItem(m.PROTOTYPE_STORAGE_KEY)).practiceSession.attempts.at(-1);
 });
 expect(saved).toMatchObject({practiceOnly:true,independent:false,correct:null,assistanceLevel:'revealed'});
});
