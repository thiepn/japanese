import {expect,test} from '@playwright/test';

const owner='00000000-0000-4000-8000-000000000001';
test.beforeEach(async({page})=>{
  await page.addInitScript(({owner})=>{
    const lease={owner,epoch:'a'.repeat(32)};
    localStorage.setItem('thiepn:japanese:kana-owner:v2',JSON.stringify(lease));
    sessionStorage.setItem('thiepn:japanese:kana-handoff',JSON.stringify({...lease,at:Date.now()}));
  },{owner});
});

test('a partially introduced lesson resumes at the first unfinished character after reload',async({page})=>{
  await page.goto('kana/?view=learn');
  await page.getByRole('button',{name:'Start',exact:true}).first().click();
  await expect(page.getByText('Character 1 of 5')).toBeVisible();
  await page.getByRole('button',{name:'Next Character'}).dblclick({delay:25});
  await expect(page.getByText('Character 2 of 5')).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Continue',exact:true}).first().click();
  await expect(page.getByText('Character 2 of 5')).toBeVisible();
});

test('Kana Learn and Review have no sideways page overflow at mobile widths',async({page,isMobile})=>{
  if(!isMobile)test.skip();
  for(const view of ['learn','review']){
    await page.goto('kana/?view='+view);
    await expect(page.getByRole('button',{name:'Back to Japanese app'})).toBeVisible();
    const widths=await page.evaluate(()=>({
      content:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth
    }));
    expect(widths.content,view+' overflow').toBeLessThanOrEqual(widths.viewport+1);
  }
});

test('review finishes after the remaining daily new card and preserves the summary on refresh',async({page})=>{
  await page.goto('kana/?view=review');
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toBeVisible();
  await page.evaluate(async({owner})=>{
    const db=await new Promise<IDBDatabase>((resolve,reject)=>{
      const req=indexedDB.open('kana_mastery_v1:'+owner,1);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    const ids=['h-a','h-i','h-u','h-e','h-o','h-ka','h-ki','h-ku','h-ke'];
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('cards','readwrite');
      for(const id of ids){
        tx.objectStore('cards').put({
          cardId:id,direction:'kana-to-romaji',
          introducedAt:new Date().toISOString(),firstReviewedAt:new Date().toISOString(),
          lastReviewedAt:new Date().toISOString(),
          totalReviews:1,totalLapses:0,
          card:{due:new Date('2035-01-01T00:00:00.000Z'),stability:2,
            difficulty:5,elapsed_days:0,scheduled_days:2,learning_steps:0,
            reps:1,lapses:0,state:2}
        });
      }
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
    db.close();
  },{owner});
  await page.reload();
  const textbox=page.getByPlaceholder('Type romaji... (or Space to reveal)');
  await expect(textbox).toBeVisible();
  await textbox.press('Enter');
  await page.getByRole('button',{name:/Again/}).click();
  await expect(page.getByRole('heading',{name:'Review Summary'})).toBeVisible();
  await page.waitForTimeout(300);
  await expect(page.getByRole('heading',{name:'Review Summary'})).toBeVisible();
});
