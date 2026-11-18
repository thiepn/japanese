import {expect,test,type Page} from "@playwright/test";

const PUBLIC_SITES=[
  {name:"Cloudflare root",base:"https://japanese.thiepn.dev/"},
  {name:"GitHub Pages subpath",base:"https://thiepn.dev/japanese/"},
] as const;

/** The two candidate hosts deploy independently. Observe and record each
 * exact release identity; do not pin yesterday's SHA to a moving domain. */
async function readCandidateCommit(page:Page,site:(typeof PUBLIC_SITES)[number]):Promise<string>{
  const meta=await page.request.get(new URL("release-meta.json",site.base).href,{
    timeout:15000,headers:{"Cache-Control":"no-cache"},
  });
  expect(meta.status()).toBe(200);
  const identity=await meta.json();
  expect(identity).toMatchObject({
    schema:"thiepn-japanese-release-meta",
    channel:"candidate",
  });
  expect(identity.commit).toMatch(/^[a-f0-9]{40}$/);
  const observedCommit:string=identity.commit;
  console.log(`LIVE_DEPLOYED_COMMIT ${site.name}: ${observedCommit}`);
  return observedCommit;
}

for(const site of PUBLIC_SITES){
  test(`${site.name}: deployed candidate and anonymous Kana due progress survive reload`,async({page})=>{
    test.setTimeout(90000);
    const testedCommit=await readCandidateCommit(page,site);
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
    // Reconfirm that an automatic deployment did not change the test target.
    expect(await readCandidateCommit(page,site)).toBe(testedCommit);
  });

  test(`${site.name}: legacy Kana redirect stays on the same deployment base`,async({page})=>{
    test.setTimeout(60000);
    const testedCommit=await readCandidateCommit(page,site);
    await page.goto(new URL("kana/?view=learn",site.base).href,{waitUntil:"domcontentloaded"});
    await expect.poll(()=>new URL(page.url()).origin).toBe(new URL(site.base).origin);
    await expect.poll(()=>new URL(page.url()).pathname).toBe(new URL(site.base).pathname);
    await expect(page.getByRole("navigation",{name:"Primary"})
      .getByRole("button",{name:"Kana",exact:true})).toBeVisible();
    expect(await readCandidateCommit(page,site)).toBe(testedCommit);
  });
}
