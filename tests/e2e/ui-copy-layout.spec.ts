import {expect,test} from "@playwright/test";

test("functional Japanese copy layout across desktop, Android and compact mobile",async({page},testInfo)=>{
  await page.goto("./");
  const screens=[
    {tab:"Today",selector:".j3-today",heading:"Your Japanese today"},
    {tab:"Learn",selector:".j4-learn",heading:"Your Japanese journey"},
    {tab:"Immerse",selector:".j6-immerse",heading:"Immersion"},
    {tab:"Library",selector:".j7-library",heading:"Japanese knowledge"},
    {tab:"Progress",selector:".j8-progress",heading:"Progress"}
  ] as const;
  for(const screen of screens){
    if(screen.tab!=="Today")await page.getByRole("button",{name:screen.tab,exact:true}).click();
    await expect(page.locator(screen.selector)).toBeVisible();
    if(screen.tab==="Learn"){
      const full=page.getByRole("button",{name:"Open full course and advanced practice"});
      if(await full.isVisible())await full.click();
    }
    await expect(page.getByRole("heading",{name:screen.heading,exact:true})).toBeVisible();
    const result=await page.evaluate(()=>{
      const small=[...document.querySelectorAll<HTMLElement>("#root .j2-shell small")]
        .filter(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=="hidden")
        .map(el=>Number.parseFloat(getComputedStyle(el).fontSize));
      return {
        overflow:document.documentElement.scrollWidth-window.innerWidth,
        minimumVisibleSmall:small.length?Math.min(...small):null,
        viewport:window.innerWidth
      };
    });
    expect(result.overflow,screen.tab+" document horizontal overflow").toBeLessThanOrEqual(1);
    if(result.minimumVisibleSmall!==null)
      expect(result.minimumVisibleSmall,screen.tab+" readable secondary labels").toBeGreaterThanOrEqual(14);
    await page.screenshot({path:testInfo.outputPath("copy-"+screen.tab.toLowerCase()+".png"),animations:"disabled"});
  }
});
