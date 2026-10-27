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
