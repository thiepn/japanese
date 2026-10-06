import { expect,test } from "@playwright/test";

test("P15 exposes the real-source C1 environment, multi-day writing and hidden-pressure defense",async({page})=>{
  await page.goto("./");

  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const lab=page.locator(".p15-environment");
  await expect(lab.getByText("P15 ACTUAL C1 ENVIRONMENT",{exact:true})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Research real Japanese, cite it, defend it, rewrite it"})).toBeVisible();

  await expect(lab.locator(".p15-portal-grid article")).toHaveCount(12);
  await expect(lab.getByRole("link",{name:"Open portal ↗"}).first()).toHaveAttribute("href",/^https:\/\//);
  await expect(lab.getByRole("heading",{name:"環境省"})).toBeVisible();
  await expect(lab.getByRole("button",{name:"Register source"})).toBeDisabled();

  await lab.getByRole("button",{name:"Writing studio"}).click();
  await expect(lab.getByRole("heading",{name:"Build an argument that survives sources, pressure and time"})).toBeVisible();
  await expect(lab.locator(".p15-project-grid button")).toHaveCount(5);
  await expect(lab.getByText("Evaluate sources in the Source desk before starting a project.")).toBeVisible();

  await lab.getByRole("button",{name:"Live defense"}).click();
  await expect(lab.getByRole("heading",{name:"Draw the objection after you commit to the argument"})).toBeVisible();
  await expect(lab.getByText("Save a first draft in the Writing studio before opening live defense.")).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(page.getByText("P20 C1→C2 PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("P15 AUTHENTIC ENVIRONMENT",{exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Real-source research + multi-day production"})).toBeVisible();
});

test("P15 source portal selection keeps the selected institution and source constraints visible",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  const lab=page.locator(".p15-environment");

  await lab.getByRole("button",{name:"Use source"}).nth(6).click();
  const registration=lab.locator(".p15-register-source");
  await expect(registration).toContainText("経済産業研究所 RIETI");
  await expect(registration).toContainText("policy research");
  await expect(registration.getByPlaceholder(/https:\/\/www\.rieti\.go\.jp/)).toBeVisible();
});
