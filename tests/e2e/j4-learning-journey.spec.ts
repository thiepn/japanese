import {expect,test} from "@playwright/test";

test("J4 defaults to A1 and preserves archived higher-level journey",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  await expect(page.getByRole("heading",{name:"Dein Japanischkurs A1"})).toBeVisible();
  await expect(page.getByText("A1 · はじまり",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"The learning road"})).toBeVisible();

  const journey=page.getByRole("region",{name:"A1 learning journey"});
  await expect(journey).toBeVisible();

  const regions=journey.locator(".j4-region");
  await expect(regions).toHaveCount(1);
  await expect(page.getByRole("heading",{name:"Dein A1-Japanischkurs"})).toBeVisible();
  await expect(page.locator(".a1-course-path__module")).toHaveCount(6);
  await expect(page.locator(".a1-course-path__list li")).toHaveCount(24);
  await expect(regions.nth(0).getByRole("heading",{name:"A1",exact:true})).toBeVisible();
  await expect(regions.getByRole("heading",{name:"A2",exact:true})).toHaveCount(0);
  await expect(regions.getByRole("heading",{name:"B1",exact:true})).toHaveCount(0);
  await expect(regions.getByRole("heading",{name:"B2",exact:true})).toHaveCount(0);
  await expect(regions.getByRole("heading",{name:"C1",exact:true})).toHaveCount(0);

  const landmarks=journey.locator(".j4-landmark");
  await expect(landmarks).toHaveCount(20);
  await expect(landmarks.first().getByRole("heading",{name:"Identify people"})).toBeVisible();
  await expect(landmarks.last().getByRole("heading",{name:"Keep a simple exchange natural"})).toBeVisible();
  await page.getByRole("button",{name:"Archivierte höhere Niveaus anzeigen"}).click();
  await expect(page.getByRole("region",{name:"A1 to C1 learning journey"}).locator(".j4-region")).toHaveCount(5);
  await expect(page.locator(".j4-landmark")).toHaveCount(68);
  await expect(page.locator(".j4-landmark").last().getByRole("heading",{name:"Integrated recommendation and accountability"})).toBeVisible();

  await expect(page.locator(".unit-card")).toHaveCount(0);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("J4 preserves course entry and milestone truth",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  const first=page.locator(".j4-landmark").first();
  await first.getByRole("button",{name:/Enter landmark|Continue landmark|Review landmark|Study anyway/}).click();

  await expect(page.locator("main.j5-study-shell#main-content")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Identify people"})).toBeVisible();
  await page.getByRole("button",{name:"Exit"}).click();

  await expect(page.getByRole("heading",{name:"Dein Japanischkurs A1"})).toBeVisible();
  await expect(page.getByText("A1 milestone",{exact:true})).toBeVisible();
  await expect(page.getByText("B1 milestone",{exact:true})).toHaveCount(0);
  await page.getByRole("button",{name:"Archivierte höhere Niveaus anzeigen"}).click();
  await expect(page.getByText("B1 milestone",{exact:true})).toBeVisible();
  await expect(page.getByText("B2 milestone",{exact:true})).toBeVisible();
  await expect(page.getByText("C1 foundation diagnostic",{exact:true})).toBeVisible();
});

test("J4 keeps specialist practice out of the primary journey until requested",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  await expect(page.getByRole("heading",{name:"Practice beyond the road"})).toHaveCount(0);
  await page.getByRole("button",{name:"Archivierte höhere Niveaus anzeigen"}).click();
  await expect(page.getByRole("heading",{name:"Practice beyond the road"})).toBeVisible();
  await expect(page.getByRole("button",{name:/Lexical fluency/})).toBeVisible();
  await expect(page.getByRole("button",{name:/Writing/})).toBeVisible();
  await expect(page.getByRole("button",{name:/Speaking/})).toBeVisible();
  await expect(page.getByRole("button",{name:/C1 discourse/})).toBeVisible();

  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).not.toBeVisible();
  const drawer=page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"});
  await drawer.locator("summary").click();
  await expect(page.getByRole("heading",{name:"Functional chains under time pressure"})).toBeVisible();
});

test("J4 becomes a vertical route on mobile without document overflow",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile journey qualification");

  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();

  const emaki=page.locator(".j4-emaki");
  const regions=page.locator(".j4-region");
  const first=await regions.nth(0).boundingBox();
  await expect(regions).toHaveCount(1);
  await page.getByRole("button",{name:"Archivierte höhere Niveaus anzeigen"}).click();
  const second=await regions.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second!.y).toBeGreaterThan(first!.y);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await expect(emaki).toBeVisible();
});
