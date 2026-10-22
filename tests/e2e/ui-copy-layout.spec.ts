import {openAdditionalLearn} from "./open-additional-learn";
import {expect,test} from "@playwright/test";

test("functional Japanese copy layout across desktop, Android and compact mobile",async({page},testInfo)=>{
  await page.goto("./");
  const screens=[
    {tab:"Today",selector:".j3-today",heading:"Start Japanese from Zero"},
    {tab:"Learn",selector:".j4-learn",heading:"Your Japanese journey"},
    {tab:"Immerse",selector:".j6-immerse",heading:"Immersion"},
    {tab:"Library",selector:".j7-library",heading:"Japanese knowledge"},
    {tab:"Progress",selector:".j8-progress",heading:"Progress"}
  ] as const;
  for(const screen of screens){
    if(screen.tab!=="Today")await page.getByRole("button",{name:screen.tab,exact:true}).click();
    await expect(page.locator(screen.selector)).toBeVisible();
    if(screen.tab==="Learn"){
      await openAdditionalLearn(page,true);
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

test("advanced Japanese studios and evidence portfolios keep readable layouts",async({page},testInfo)=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  const studios=[
    {id:"j6-studio-authentic",name:"Your Japanese"},
    {id:"j6-studio-p15",name:"Research real Japanese, cite it, defend it, rewrite it"},
    {id:"j6-studio-p16",name:"Turn real-source work into research-grade evidence"}
  ];
  for(const studio of studios){
    const region=page.locator("#"+studio.id);
    await region.locator(":scope > summary").click();
    await expect(region.getByRole("heading",{name:studio.name,exact:true})).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow,studio.id+" horizontal overflow").toBeLessThanOrEqual(1);
    await page.screenshot({path:testInfo.outputPath("advanced-"+studio.id+".png"),animations:"disabled"});
  }
  await page.getByRole("button",{name:"Progress",exact:true}).click();
  for(const id of ["j8-b2-vault","j8-c1-vault"]){
    const vault=page.getByTestId(id);
    await vault.locator(":scope > summary").click();
    await expect(vault).toHaveAttribute("open","");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow,id+" horizontal overflow").toBeLessThanOrEqual(1);
    await page.screenshot({path:testInfo.outputPath("advanced-"+id+".png"),animations:"disabled"});
  }
});
