import {expect,test} from "@playwright/test";

const MERGED_MAIN="a40e0ff7e8e7033fdc2de4efbd1aa8f91cd7dcf1";
const PUBLIC_SITES=[
  {name:"Cloudflare root",base:"https://japanese.thiepn.dev/"},
  {name:"GitHub Pages subpath",base:"https://thiepn.dev/japanese/"},
] as const;

for(const site of PUBLIC_SITES){
  test(`${site.name}: deployed merge and anonymous Kana due progress survive reload`,async({page})=>{
    test.setTimeout(90000);
    const meta=await page.request.get(new URL("release-meta.json",site.base).href,{timeout:15000});
    expect(meta.status()).toBe(200);
    expect(await meta.json()).toMatchObject({channel:"candidate",commit:MERGED_MAIN});
    await page.goto(site.base,{waitUntil:"domcontentloaded"});
    const primary=page.getByRole("navigation",{name:"Primary"});
    await expect(primary.getByRole("button",{name:"Kana",exact:true})).toBeVisible();
    await primary.getByRole("button",{name:"Kana",exact:true}).click();
    const sections=page.getByRole("navigation",{name:"Kana sections"});
    await expect(sections.getByRole("button")).toHaveCount(5);
    await sections.getByRole("button",{name:/Lessons/}).click();
    await page.getByRole("button",{name:"Start",exact:true}).first().click();
    await page.getByRole("button",{name:"Next Character"}).click();
    const flashcards=sections.getByRole("button",{name:/Flashcards/});
    await expect(flashcards.getByLabel("1 Kana reviews due")).toBeVisible();
    await page.reload();
    await expect(primary.getByRole("button",{name:"Kana",exact:true})).toBeVisible();
    await primary.getByRole("button",{name:"Kana",exact:true}).click();
    const reloaded=page.getByRole("navigation",{name:"Kana sections"})
      .getByRole("button",{name:/Flashcards/});
    await expect(reloaded.getByLabel("1 Kana reviews due")).toBeVisible();
    expect(new URL(page.url()).origin).toBe(new URL(site.base).origin);
  });

  test(`${site.name}: legacy Kana redirect stays on the same deployment base`,async({page})=>{
    test.setTimeout(60000);
    await page.goto(new URL("kana/?view=learn",site.base).href,{waitUntil:"domcontentloaded"});
    await expect.poll(()=>new URL(page.url()).origin).toBe(new URL(site.base).origin);
    await expect.poll(()=>new URL(page.url()).pathname).toBe(new URL(site.base).pathname);
    await expect(page.getByRole("navigation",{name:"Primary"})
      .getByRole("button",{name:"Kana",exact:true})).toBeVisible();
  });
}
