import { expect,test } from "@playwright/test";

test("P16 exposes research-quality tooling without creating a new mastery layer",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.locator("#j6-studio-p16 > summary").click();

  const lab=page.locator(".p16-quality");
  await expect(lab.getByText("C1 RESEARCH QUALITY",{exact:true})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Turn real-source work into research-grade evidence"})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Document the source you actually used"})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Keep only material you are allowed to keep"})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Bind expert feedback to the exact finished artifact"})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Build depth around your actual interests"})).toBeVisible();
  await expect(lab.getByText(/does not automatically scrape or republish external pages/i)).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.getByTestId("j8-c1-vault").locator("summary").click();
  await expect(page.getByText("C1→C2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("RESEARCH QUALITY",{exact:true})).toBeVisible();
});
