import {test,expect} from '@playwright/test';
async function correctCurrent(page,value){
 const text=page.getByRole('textbox',{name:'Type the romaji reading'});
 await text.fill(value);
 await text.press('Enter');
 await expect(page.getByText('Correct.')).toBeVisible();
 await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
}
test('Unit 03 teaches all five S-row characters, reads five words, preserves other units',async({page})=>{
 await page.goto('/s-row.html');
 await page.evaluate(async()=>{
  const old=await import('./engine.mjs');
  const k=await import('./k-row-engine.mjs');
  localStorage.setItem(old.PROTOTYPE_STORAGE_KEY,JSON.stringify(old.initialState()));
  localStorage.setItem(k.STORAGE_KEY,JSON.stringify(k.initialState()));
 });
 const previous=await page.evaluate(()=>({
  old:localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'),
  k:localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1')
 }));
 await expect(page.getByRole('heading',{name:'Learn さ・し・す・せ・そ'})).toBeVisible();
 await page.getByRole('button',{name:'Start Unit 03'}).click();
 for(const [kana,reading] of [['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so']]){
  await expect(page.getByRole('heading',{name:'Meet '+kana})).toBeVisible();
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  await correctCurrent(page,reading);
 }
 for(const reading of ['sa','shi','su','se','so']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await expect(page.getByText('Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['kasa','shio','sushi','sekai','soko']){
  await expect(page.getByRole('heading',{name:'Read the word'})).toBeVisible();
  await page.getByRole('textbox',{name:'Type the romaji reading'}).fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(/Meaning:/)).toBeVisible();
  await page.getByRole('button',{name:/^(Continue|See next step)$/}).click();
 }
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const snapshot=await page.evaluate(async()=>({
  old:localStorage.getItem('thiepn:kana-foundations:prototype-only:v1'),
  k:localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1'),
  s:JSON.parse(localStorage.getItem('thiepn:kana-foundations:s-row:prototype-only:v1')),
  dbs:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(x=>x.name):[]
 }));
 expect(snapshot.old).toBe(previous.old);
 expect(snapshot.k).toBe(previous.k);
 expect(snapshot.s.finished).toBe(true);
 expect(snapshot.s.records).toHaveLength(15);
 expect(snapshot.s.records.every(r=>r.correct===true)).toBe(true);
 expect(snapshot.dbs).toEqual([]);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 await page.getByRole('link',{name:'Return to Unit 02'}).click();
 await expect(page.getByRole('heading',{name:'Learn か・き・く・け・こ'})).toBeVisible();
});
test('Unit 03 accepts typed Kunrei si/sio/susi, retains first errors and completes correction on compact mobile',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/s-row.html');
 await page.getByRole('button',{name:'Start Unit 03'}).click();
 for(const [i,kana,reading] of [[0,'さ','so'],[1,'し','SI'],[2,'す','su'],[3,'せ','se'],[4,'そ','so']]){
  await page.getByRole('button',{name:'Try recalling '+kana}).click();
  const field=page.getByRole('textbox',{name:'Type the romaji reading'});
  await field.fill(reading);
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText(i===0?'Not quite.':'Correct.')).toBeVisible();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['sa','shi','su','se','so']){
  await page.getByRole('button',{name:'Reading '+reading}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 for(const reading of ['kasa','sio','susi','sekai','soko'])await correctCurrent(page,reading);
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await page.reload();
 await expect(page.getByText(/Correction practice · first attempt retained/)).toBeVisible();
 await correctCurrent(page,'sa');
 await expect(page.getByRole('heading',{name:'Five more hiragana learned'})).toBeVisible();
 const evidence=await page.evaluate(()=>JSON.parse(localStorage.getItem('thiepn:kana-foundations:s-row:prototype-only:v1')));
 expect(evidence.records).toHaveLength(16);
 expect(evidence.records[0].correct).toBe(false);
 expect(evidence.records[1].submitted).toBe('si');
 expect(evidence.records[11].submitted).toBe('sio');
 expect(evidence.records[12].submitted).toBe('susi');
 expect(evidence.records.at(-1).correction).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('Unit 02 completion offers Unit 03 without altering existing saved evidence',async({page})=>{
 await page.goto('/k-row.html');
 await page.evaluate(async()=>{
  const k=await import('./k-row-engine.mjs');
  let s=k.resume(k.initialState());
  for(let i=0;i<15;i++){
   const t=k.taskAt(s);
   if(t.mode==='introduction')s=k.beginRecall(s);
   s=k.advance(k.answer(s,t.answer));
  }
  localStorage.setItem(k.STORAGE_KEY,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.getByRole('link',{name:'Continue to Unit 03 · さしすせそ'})).toBeVisible();
 const before=await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1'));
 await page.getByRole('link',{name:'Continue to Unit 03 · さしすせそ'}).click();
 await expect(page.getByRole('heading',{name:'Learn さ・し・す・せ・そ'})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('thiepn:kana-foundations:k-row:prototype-only:v1'))).toBe(before);
});
