import {expect,test} from '@playwright/test';

const guest='00000000-0000-4000-8000-000000000001';
test('Google Kana deep link keeps its requested view and returns to Japanese',async({page})=>{
  await page.addInitScript(({owner})=>{
    const lease={owner,epoch:'a'.repeat(32)};
    localStorage.setItem('thiepn:japanese:kana-owner:v2',JSON.stringify(lease));
    sessionStorage.setItem('thiepn:japanese:kana-handoff',
      JSON.stringify({...lease,at:Date.now()}));
  },{owner:guest});
  await page.goto('kana/?view=chart');
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Kana Chart'}).first()).toBeVisible();
  await expect(page.locator('main')).toContainText(/Hiragana|Katakana/);
  await page.getByRole('button',{name:'Back to Japanese app'}).click();
  await expect(page).toHaveURL(/\/japanese\/?(?:\?.*)?$/);
});
test('opening Kana directly resolves the workspace through Japanese without a stale guest handoff',async({page})=>{
  await page.goto('kana/?view=learn');
  await expect(page).toHaveURL(/\/japanese\/kana\/\?view=learn/, {timeout:20000});
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toBeVisible();
});
test('cross-tab owner change invalidates an active Google Kana page',async({page,context})=>{
  await page.addInitScript(({owner})=>{
    const lease={owner,epoch:'a'.repeat(32)};
    localStorage.setItem('thiepn:japanese:kana-owner:v2',JSON.stringify(lease));
    sessionStorage.setItem('thiepn:japanese:kana-handoff',
      JSON.stringify({...lease,at:Date.now()}));
  },{owner:guest});
  await page.goto('kana/?view=review');
  await expect(page.getByRole('button',{name:'Back to Japanese app'})).toBeVisible();
  const other=await context.newPage();
  await other.goto('./');
  const wentBack=page.waitForEvent('framenavigated',{
    predicate:frame=>frame===page.mainFrame() && frame.url().includes('kana=resume'),
    timeout:15000
  });
  await other.evaluate(()=>{
    localStorage.setItem('thiepn:japanese:kana-owner:v2',
      JSON.stringify({owner:'other-account',epoch:'b'.repeat(32)}));
  });
  await wentBack;
  await other.close();
});
