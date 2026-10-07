import { expect,test } from "@playwright/test";

test("P18 exposes hidden live pressure, real-partner evidence and cross-domain transfer",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const lab=page.locator(".p18-interaction");
  await expect(lab.getByText("P18 ADVANCED NATIVE INTERACTION",{exact:true})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Repair, reformulate and hold the floor under live pressure"})).toBeVisible();
  await expect(lab.getByText("PRESSURE HIDDEN",{exact:true})).toBeVisible();
  await expect(lab.getByText(/simulator uses native-style Japanese discourse pressure/i)).toBeVisible();

  await lab.getByRole("button",{name:"Real partner log"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByRole("heading",{name:"Separate actual human interaction from simulation"})).toBeVisible();
  await expect(lab.getByText(/Partner background is self-reported/)).toBeVisible();

  await lab.getByRole("button",{name:"Cross-domain transfer"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByText(/Create a P16 specialist track before testing expert-domain transfer/)).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("P20 C1→C2 PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("P18 ADVANCED INTERACTION",{exact:true})).toBeVisible();
});

test("P18 upgrades the C1 AI coach with live-repair scenario chains",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Learn"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.locator(".j4-practice__drawer").filter({hasText:"AI coach"}).locator(":scope > summary").click();

  await expect(page.getByText("P18 ADVANCED LIVE INTERACTION",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Hidden pressure, repair and reformulation"})).toBeVisible();
  const scenario=page.getByLabel("Scenario chain");
  await expect(scenario.locator('option[value="c1-live-committee-repair"]')).toHaveText("Survive a hostile committee interruption");
  await expect(scenario.locator('option[value="c1-specialist-roundtable"]')).toHaveText("Handle a specialist roundtable with shifting audiences");
  await expect(scenario.locator('option[value="c1-cross-domain-live-transfer"]')).toHaveText("Transfer expertise under live challenge");
});
