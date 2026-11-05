import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';

test('compact intro exposes teaching before the primary action without scrolling',async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 const details=await page.evaluate(()=>{
  const rect=selector=>document.querySelector(selector)?.getBoundingClientRect().toJSON();
  return {note:rect('.intro-screen .essential-note'),audio:rect('.intro-screen .audio-button'),
   primary:rect('.action-area .primary'),footer:rect('.action-area'),
   scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,
   duplicateExit:[...document.querySelectorAll('button')].filter(b=>/Exit and save/.test(b.textContent)).length};
 });
 expect(details.note).toBeTruthy();
 expect(details.audio).toBeTruthy();
 expect(details.footer).toBeTruthy();
 expect(details.note.bottom,'Sound/shape explanation must appear above sticky action').toBeLessThanOrEqual(details.footer.top+2);
 expect(details.audio.bottom,'Audio button must remain visible above the action').toBeLessThanOrEqual(details.footer.top+2);
 expect(details.scrollWidth).toBeLessThanOrEqual(details.viewportWidth+1);
 expect(details.duplicateExit).toBe(0);
 expect(details.primary.height).toBeGreaterThanOrEqual(48);
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';
  mkdirSync(dir,{recursive:true});
  await page.screenshot({path:dir+'/'+testInfo.project.name+'-intro-viewport.png',fullPage:false});
 }
});
test('mobile results explain unresolved skill before normal-flow actions',async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/index.html');
 await page.evaluate(async()=>{
  const m=await import('./engine.mjs');
  localStorage.setItem(m.PROTOTYPE_STORAGE_KEY,JSON.stringify({...m.initialState(),
   phase:7,paused:false,records:[{stage:'recall',mode:'recall',item:'h-u',
    correct:false,assisted:false,correction:false,practiceOnly:false,
    submitted:'o',at:'2026-11-05T00:00:00Z'}]}));
 });
 await page.reload();
 await expect(page.getByText('う (u)')).toBeVisible();
 const box=await page.evaluate(()=>{
  const note=document.querySelector('.teaching-note').getBoundingClientRect();
  const buttons=document.querySelector('.results-actions').getBoundingClientRect();
  const footer=document.querySelector('.action-area').getBoundingClientRect();
  return {noteBottom:note.bottom,actionsTop:buttons.top,footerHeight:footer.height,
    scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth};
 });
 expect(box.noteBottom).toBeLessThan(box.actionsTop);
 expect(box.footerHeight).toBe(0);
 expect(box.scrollWidth).toBeLessThanOrEqual(box.viewportWidth+1);
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';
  mkdirSync(dir,{recursive:true});
  await page.screenshot({path:dir+'/'+testInfo.project.name+'-results-viewport.png',fullPage:false});
 }
});
test('keyboard, live feedback and reduced-motion preferences remain usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 await expect(page.getByRole('button',{name:'Exit lesson; progress is saved'})).toBeVisible();
 const reduce=await page.locator('.progress-bar').evaluate(el=>getComputedStyle(el).transitionDuration);
 expect(reduce).toBe('0s');
 await page.getByRole('button',{name:'Try recalling あ'}).click();
 const input=page.getByRole('textbox',{name:'Type the romaji reading'});
 await expect(input).toBeFocused();
 await input.fill('i');
 await input.press('Enter');
 await expect(page.locator('[role="status"][aria-live="polite"]')).toContainText('Not quite');
 const box=await page.locator('.feedback').evaluate(el=>({
  text:el.textContent,background:getComputedStyle(el).backgroundColor
 }));
 expect(box.text).toContain('Correct: a');
 expect(box.background).not.toBe('rgba(0, 0, 0, 0)');
});
test('measure local answer and navigation rendering without network calls',async({page},testInfo)=>{
 await page.goto('/index.html');
 await page.getByRole('button',{name:'Start learning'}).click();
 const timings=[];
 const measure=async(selector,kind)=>{
  const ms=await page.evaluate(sel=>{
   const el=document.querySelector(sel);
   if(!el)throw Error('missing interaction target '+sel);
   const before=performance.now();el.click();return performance.now()-before;
  },selector);
  timings.push({kind,ms});
 };
 for(const [kana,reading] of [['あ','a'],['い','i']]){
  await measure('button[data-action="intro-check"]','intro-transition');
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  const ms=await page.evaluate(()=>{
   const before=performance.now();
   document.getElementById('answer-form').requestSubmit();
   return performance.now()-before;
  });
  timings.push({kind:'typed-feedback',ms});
  await measure('button[data-action="advance"]','next-character');
 }
 for(const reading of ['a','i']){
  await measure('button[data-value="'+reading+'"]','recognition-feedback');
  await measure('button[data-action="advance"]','recognition-next');
 }
 const ordered=timings.map(x=>x.ms).sort((a,b)=>a-b);
 const p95=ordered[Math.ceil(0.95*ordered.length)-1];
 const report={browser:testInfo.project.name,sampleCount:timings.length,
  medianMs:ordered[Math.floor(ordered.length/2)],p95Ms:p95,
  maxMs:ordered.at(-1),environment:'GitHub Actions browser runner, not physical-device performance',timings};
 await testInfo.attach('local-interaction-timings',{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
 if(process.env.CI){
  const dir='prototypes/kana-foundations/.visual-evidence';
  mkdirSync(dir,{recursive:true});
  writeFileSync(dir+'/'+testInfo.project.name+'-interaction-timings.json',JSON.stringify(report,null,2));
 }
 expect(p95).toBeLessThan(250);
});
