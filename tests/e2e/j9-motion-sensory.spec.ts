import {expect,test} from "@playwright/test";

test("J9 applies distinct one-shot motion language to the primary learner surfaces",async({page})=>{
  await page.goto("./");

  await expect(page.locator(".j3-today")).toBeVisible();
  const todayAnimation=await page.locator(".j3-today").evaluate((node)=>getComputedStyle(node).animationName);
  expect(todayAnimation).toContain("j9-noren-reveal");

  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await expect(page.locator(".j4-learn")).toBeVisible();
  const learnAnimation=await page.locator(".j4-learn").evaluate((node)=>getComputedStyle(node).animationName);
  expect(learnAnimation).toContain("j9-emaki-stage");

  // The transition curtain never owns pointer input, so navigation remains immediately usable.
  const curtain=page.locator(".j9-fusuma");
  await expect(curtain).toHaveCSS("pointer-events","none");
  await page.getByRole("button",{name:"Library",exact:true}).click();
  await expect(page.locator(".j7-library")).toBeVisible();
  const libraryAnimation=await page.locator(".j7-library").evaluate((node)=>getComputedStyle(node).animationName);
  expect(libraryAnimation).toContain("j9-ink-bloom");

  await page.getByRole("button",{name:"Progress",exact:true}).click();
  await expect(page.locator(".j8-progress")).toBeVisible();
  const progressAnimation=await page.locator(".j8-progress").evaluate((node)=>getComputedStyle(node).animationName);
  expect(progressAnimation).toContain("j9-byobu-stage");
});

test("J9 gives Reader a washi-turn reveal and Progress drill-down a byobu reveal",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();

  const paper=page.locator(".j6-reader__paper");
  await expect(paper).toBeVisible();
  const readerAnimation=await paper.evaluate((node)=>getComputedStyle(node).animationName);
  expect(readerAnimation).toContain("j9-washi-turn");

  await page.getByRole("button",{name:"← Immerse"}).click();
  await page.getByRole("button",{name:"Progress",exact:true}).click();

  const crest=page.locator(".j8-crest").first();
  await crest.locator("summary").click();
  const details=crest.locator(".j8-crest__details");
  await expect(details).toBeVisible();
  const detailsAnimation=await details.evaluate((node)=>getComputedStyle(node).animationName);
  expect(detailsAnimation).toContain("j9-byobu-unfold");
});

test("J9 sensory feedback is explicit opt-in and persists locally",async({page})=>{
  await page.goto("./");

  const sensory=page.getByRole("button",{name:"Enable subtle sound and haptics"});
  await expect(sensory).toHaveAttribute("aria-pressed","false");
  await expect(page.locator("html")).toHaveAttribute("data-j-sensory","off");

  await sensory.click();
  const enabled=page.getByRole("button",{name:"Disable subtle sound and haptics"});
  await expect(enabled).toHaveAttribute("aria-pressed","true");
  await expect(page.locator("html")).toHaveAttribute("data-j-sensory","on");
  expect(await page.evaluate(()=>localStorage.getItem("japanese:j-sensory"))).toBe("on");

  await page.reload();
  await expect(page.getByRole("button",{name:"Disable subtle sound and haptics"})).toHaveAttribute("aria-pressed","true");

  await page.getByRole("button",{name:"Disable subtle sound and haptics"}).click();
  await expect(page.getByRole("button",{name:"Enable subtle sound and haptics"})).toHaveAttribute("aria-pressed","false");
  expect(await page.evaluate(()=>localStorage.getItem("japanese:j-sensory"))).toBe("off");
});

test("J9 fully suppresses decorative motion when reduced motion is requested",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./");

  await expect(page.locator(".j9-fusuma")).toHaveCSS("display","none");
  const todayAnimation=await page.locator(".j3-today").evaluate((node)=>getComputedStyle(node).animationName);
  expect(todayAnimation).toBe("none");

  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const emakiAnimation=await page.locator(".j4-emaki__regions").evaluate((node)=>getComputedStyle(node).animationName);
  expect(emakiAnimation).toBe("none");

  await page.getByRole("button",{name:"Progress",exact:true}).click();
  const progressAnimation=await page.locator(".j8-progress").evaluate((node)=>getComputedStyle(node).animationName);
  expect(progressAnimation).toBe("none");
});

test("J9 sensory control remains touch-safe on mobile",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","mobile sensory qualification");

  await page.goto("./");
  const control=await page.getByRole("button",{name:"Enable subtle sound and haptics"}).boundingBox();
  expect(control).not.toBeNull();
  expect(control!.width).toBeGreaterThanOrEqual(42);
  expect(control!.height).toBeGreaterThanOrEqual(42);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
