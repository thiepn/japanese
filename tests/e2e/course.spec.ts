import { expect,test } from "@playwright/test";

test("structured A1→B2 course and canonical grammar/sentence search work on every certified viewport",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Learn"}).click();

  await expect(page.getByRole("heading",{name:"Foundation → B2"})).toBeVisible();
  await expect(page.locator(".unit-card")).toHaveCount(58);
  const firstUnit=page.locator(".unit-card").first();
  await expect(firstUnit.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await expect(firstUnit.getByText(/Can identify oneself/)).toBeVisible();

  const lastUnit=page.locator(".unit-card").last();
  await expect(lastUnit.getByText(/B2|structured|evidence|response/i).first()).toBeVisible();

  await firstUnit.getByRole("button",{name:"Start unit"}).click();
  await expect(page.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByRole("heading",{name:"です",exact:true})).toBeVisible();
  await expect(page.getByText(/polite/i).first()).toBeVisible();

  await page.getByRole("button",{name:"Exit"}).click();
  const navTargetLibrary=page.getByRole("button",{name:"Library"});
  const navDebugLibrary=await navTargetLibrary.evaluate((element)=>{
    const rect=element.getBoundingClientRect();
    const nav=element.closest(".nav");
    const hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
    const style=getComputedStyle(element),navStyle=nav?getComputedStyle(nav):null;
    return {rect:{left:rect.left,top:rect.top,width:rect.width,height:rect.height},hit:hit?hit.tagName+"."+hit.className:"none",buttonPointer:style.pointerEvents,buttonZ:style.zIndex,navPointer:navStyle?.pointerEvents,navPosition:navStyle?.position,navZ:navStyle?.zIndex,navVisibility:navStyle?.visibility,navOpacity:navStyle?.opacity};
  });
  console.log("NAV_DEBUG_Library",JSON.stringify(navDebugLibrary));
  await navTargetLibrary.click({force:true});
  const search=page.getByRole("textbox",{name:"Search Japanese"});

  await search.fill("topic");
  await expect(page.getByText("は (topic)",{exact:true})).toBeVisible({timeout:15_000});

  await search.fill("What is your name?");
  await expect(page.getByText("名前は何ですか。",{exact:true})).toBeVisible({timeout:15_000});
});
