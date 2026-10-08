import {expect,test,type Page} from "@playwright/test";

test("J15 presents Japanese editorial navigation instead of SaaS dashboard chrome",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop editorial-shell contract");
  await page.setViewportSize({width:1440,height:1000});
  await page.goto("./");

  const workspace=page.locator(".j2-workspace");
  await expect(workspace).toHaveCSS("display","block");

  const nav=page.getByRole("navigation",{name:"Primary"});
  const navBox=await nav.boundingBox();
  expect(navBox).not.toBeNull();
  expect(navBox!.width).toBeGreaterThan(1200);
  expect(navBox!.height).toBeLessThan(90);

  const today=nav.getByRole("button",{name:"Today",exact:true});
  await expect(today).toHaveCSS("border-radius","0px");

  for(const [surface,hero] of [
    ["Today",".j3-today__hero"],
    ["Learn",".j4-hero"],
    ["Immerse",".j6-hero"],
    ["Library",".j7-library__masthead"],
    ["Progress",".j8-hero"],
  ] as const){
    await nav.getByRole("button",{name:surface,exact:true}).click();
    await expect(page.locator(hero)).toHaveCSS("border-radius","0px");
    await expect(page.locator(hero)).toHaveCSS("box-shadow","none");
  }
});

test("J15 keeps the mobile rail flat and Japanese rather than floating-card navigation",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="android-mobile","mobile editorial-shell contract");
  await page.goto("./");

  const nav=page.getByRole("navigation",{name:"Primary"});
  await expect(nav).toHaveCSS("box-shadow","none");
  await expect(nav.getByRole("button",{name:"Today",exact:true})).toHaveCSS("border-radius","0px");
  await expect(page.locator(".j3-today__hero")).toHaveCSS("border-radius","0px");
});

test("J14 dark mode is coherent across core and legacy learner surfaces",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("japanese:j-theme","dark"));
  await page.goto("./");

  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content","#0D0D0C");

  const tokens=await page.locator(".j2-shell").evaluate((node)=>{
    const style=getComputedStyle(node);
    return {
      bg:style.getPropertyValue("--j-bg").trim(),
      elevated:style.getPropertyValue("--j-bg-elevated").trim(),
      fg:style.getPropertyValue("--j-fg").trim(),
      muted:style.getPropertyValue("--j-fg-muted").trim(),
    };
  });
  expect(tokens.bg.toLowerCase()).toBe("#0d0d0c");
  expect(tokens.elevated.toLowerCase()).toBe("#151513");
  expect(tokens.fg.toLowerCase()).toBe("#ede7dc");

  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const realWorld=page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"});
  await realWorld.locator("summary").click();
  await expect(page.locator(".real-world-performance")).toBeVisible();
  await expectDarkSurface(page,".real-world-performance");

  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator("#j6-studio-native-listening > summary").click();
  await expect(page.locator(".native-listening-lab")).toBeVisible();
  await expectDarkSurface(page,".native-listening-lab");

  await page.getByRole("button",{name:"Library",exact:true}).click();
  await expectDarkSurface(page,'.j7-search input[aria-label="Search Japanese"]');

  await page.getByRole("button",{name:"Progress",exact:true}).click();
  await page.getByTestId("j8-c1-vault").locator("summary").click();
  await expect(page.locator(".p20-readiness")).toBeVisible();
  await expectDarkSurface(page,".p20-readiness");

  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});

test("J14 removes legacy light islands and restores muted-text contrast in dark mode",async({page})=>{
  await page.addInitScript(()=>localStorage.setItem("japanese:j-theme","dark"));
  await page.goto("./");

  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const realWorld=page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"});
  await realWorld.locator("summary").click();
  await expectDarkSurface(page,".performance-summary>div");
  await expectReadableTextAgainst(page,".real-world-performance>p",".real-world-performance");

  await page.getByRole("button",{name:"Immerse",exact:true}).click();
  await page.locator("#j6-studio-native-listening > summary").click();
  await expectDarkSurface(page,".native-depth-stats>div");
  await expectDarkSurface(page,".native-listening-workspace textarea");

  await page.getByRole("button",{name:"Progress",exact:true}).click();
  await page.getByTestId("j8-c1-vault").locator("summary").click();
  await expectDarkSurface(page,".p20-matrix");
  await expectDarkSurface(page,".p20-matrix-head");
  await expectReadableTextAgainst(page,".p20-matrix-row span",".p20-matrix-row");

  const skip=page.locator(".skip-link");
  await skip.focus();
  await expectDarkSurface(page,".skip-link");
});

test("J14 theme preference survives reload and can return cleanly to light mode",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  expect(await page.evaluate(()=>localStorage.getItem("japanese:j-theme"))).toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.getByRole("button",{name:"Use light theme"})).toBeVisible();

  await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.locator(".j5-study")).toHaveAttribute("data-j-theme","dark");
  await page.getByRole("button",{name:"Exit"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.getByRole("button",{name:"Use light theme"})).toBeVisible();

  await page.getByRole("button",{name:"Use light theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","light");
  expect(await page.evaluate(()=>localStorage.getItem("japanese:j-theme"))).toBe("light");
});

test("J14 keeps core foreground/background contrast strong in both themes",async({page})=>{
  await page.goto("./");

  for(const target of ["light","dark"] as const){
    const button=page.getByRole("button",{name:target==="dark"?"Use dark theme":"Use light theme"});
    if(await button.count())await button.click();
    await expect(page.locator("html")).toHaveAttribute("data-j-theme",target);

    const pair=await page.locator(".j2-shell").evaluate((node)=>{
      const style=getComputedStyle(node);
      return {foreground:style.color,background:style.backgroundColor};
    });
    const foreground=parseCssColor(pair.foreground);
    const background=parseCssColor(pair.background);
    expect(foreground).not.toBeNull();
    expect(background).not.toBeNull();
    expect(contrastRatio(foreground!,background!)).toBeGreaterThanOrEqual(7);
  }
});

test("J14 keeps an already-used dark PWA functional through offline reload",async({page,context},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","single-profile offline dark qualification");

  await page.goto("./");
  await page.evaluate(async()=>{if(!("serviceWorker" in navigator))throw new Error("SERVICE_WORKER_UNAVAILABLE");await navigator.serviceWorker.ready;});
  await page.reload();

  await page.getByRole("button",{name:"Use dark theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  const drawer=page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"});
  await drawer.locator("summary").click();
  await expectDarkSurface(page,".real-world-performance");

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-j-theme","dark");
  await expect(page.getByRole("heading",{name:/Continue Japanese|You’re caught up/})).toBeVisible();
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await page.locator(".j4-practice__drawer").filter({hasText:"Real-world performance"}).locator("summary").click();
  await expectDarkSurface(page,".real-world-performance");
  await context.setOffline(false);
});

test("J14 supports 320 CSS-pixel reflow across all learner destinations",async({page})=>{
  await page.setViewportSize({width:320,height:860});
  await page.goto("./");

  await expect.poll(()=>page.locator(".j2-shell").evaluate((node)=>getComputedStyle(node).getPropertyValue("--j12-mobile").trim())).toBe("1");
  const surfaces=["Today","Learn","Immerse","Library","Progress"] as const;
  for(const surface of surfaces){
    await page.getByRole("button",{name:surface,exact:true}).click();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const main=await page.locator("main#main-content").boundingBox();
    expect(main).not.toBeNull();
    expect(main!.width).toBeLessThanOrEqual(320);
  }
});

test("J14 preserves landmark and heading order for assistive technology",async({page})=>{
  await page.goto("./");

  await expect(page.locator("main#main-content")).toHaveCount(1);
  const primary=page.getByRole("navigation",{name:"Primary"});
  await expect(primary).toHaveCount(1);
  await expect(primary.getByRole("button")).toHaveCount(5);
  await expect(page.locator("main#main-content h1")).toHaveCount(1);

  const order=await page.locator("body").evaluate(()=>{
    const nav=document.querySelector('nav[aria-label="Primary"]');
    const main=document.querySelector("main#main-content");
    if(!nav||!main)return 0;
    return nav.compareDocumentPosition(main)&Node.DOCUMENT_POSITION_FOLLOWING;
  });
  expect(order).toBeTruthy();

  for(const surface of ["Learn","Immerse","Library","Progress"] as const){
    await primary.getByRole("button",{name:surface,exact:true}).click();
    await expect(page.locator("main#main-content h1")).toHaveCount(1);
  }
});

test("J14 removes decorative motion when reduced motion is requested",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("./");

  for(const [surface,selector] of [
    ["Today",".j3-today"],
    ["Learn",".j4-learn"],
    ["Immerse",".j6-immerse"],
    ["Library",".j7-library"],
    ["Progress",".j8-progress"],
  ] as const){
    await page.getByRole("button",{name:surface,exact:true}).click();
    await expect(page.locator(selector)).toBeVisible();
    const animation=await page.locator(selector).evaluate((node)=>getComputedStyle(node).animationName);
    expect(animation).toBe("none");
  }

  await expect(page.locator(".j9-fusuma")).toHaveCSS("display","none");
});

test("J14 exposes visible keyboard focus without pointer-only navigation",async({page})=>{
  await page.goto("./");

  const learn=page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Learn",exact:true});
  await learn.focus();
  await expectVisibleFocus(learn);

  await learn.press("Enter");
  await expect(page.locator(".j4-learn")).toBeVisible();

  const emaki=page.locator(".j4-emaki");
  await emaki.focus();
  await expectVisibleFocus(emaki);

  const practice=page.locator(".j4-practice__drawer").first().locator("summary");
  await practice.focus();
  await expectVisibleFocus(practice);
  await practice.press("Enter");
  await expect(page.locator(".j4-practice__drawer").first()).toHaveAttribute("open","");
});

async function expectDarkSurface(page:Page,selector:string){
  const data=await page.locator(selector).first().evaluate((node)=>{
    const style=getComputedStyle(node);
    return {background:style.backgroundColor,color:style.color};
  });
  const background=parseCssColor(data.background);
  const foreground=parseCssColor(data.color);
  expect(background).not.toBeNull();
  expect(foreground).not.toBeNull();
  expect(relativeLuminance(background!)).toBeLessThan(.18);
  expect(contrastRatio(foreground!,background!)).toBeGreaterThanOrEqual(4.5);
}

async function expectReadableTextAgainst(page:Page,textSelector:string,surfaceSelector:string){
  const pair=await page.locator(textSelector).first().evaluate((node,surfaceSelector)=>{
    const surface=document.querySelector(surfaceSelector as string);
    if(!surface)throw new Error("SURFACE_NOT_FOUND:"+surfaceSelector);
    return {
      foreground:getComputedStyle(node).color,
      background:getComputedStyle(surface).backgroundColor,
    };
  },surfaceSelector);
  const foreground=parseCssColor(pair.foreground);
  const background=parseCssColor(pair.background);
  expect(foreground).not.toBeNull();
  expect(background).not.toBeNull();
  expect(relativeLuminance(background!)).toBeLessThan(.18);
  expect(contrastRatio(foreground!,background!)).toBeGreaterThanOrEqual(4.5);
}

async function expectVisibleFocus(locator:import("@playwright/test").Locator){
  const focus=await locator.evaluate((node)=>{
    const style=getComputedStyle(node);
    return {
      outline:style.outlineStyle,
      width:parseFloat(style.outlineWidth)||0,
      shadow:style.boxShadow,
    };
  });
  expect(focus.outline!=="none"&&focus.width>=2||focus.shadow!=="none").toBe(true);
}

function parseCssColor(value:string):[number,number,number]|null{
  const rgb=value.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
  if(rgb)return [Number(rgb[1]),Number(rgb[2]),Number(rgb[3])];
  const srgb=value.match(/color\(srgb\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/i);
  if(srgb)return [Number(srgb[1])*255,Number(srgb[2])*255,Number(srgb[3])*255];
  const hex=value.trim().match(/^#([0-9a-f]{6})$/i);
  if(hex){
    const n=parseInt(hex[1],16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  }
  return null;
}

function relativeLuminance([r,g,b]:[number,number,number]):number{
  const channel=(v:number)=>{
    const x=v/255;
    return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);
  };
  return .2126*channel(r)+.7152*channel(g)+.0722*channel(b);
}

function contrastRatio(a:[number,number,number],b:[number,number,number]):number{
  const high=Math.max(relativeLuminance(a),relativeLuminance(b));
  const low=Math.min(relativeLuminance(a),relativeLuminance(b));
  return (high+.05)/(low+.05);
}
