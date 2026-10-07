import { expect,test } from "@playwright/test";

test("P19 exposes bounded real-audio evidence, overlap listening and external review",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.locator("#j6-studio-p19 > summary").click();
  const lab=page.locator(".p19-evidence");
  await expect(lab.getByText("PROSODY · OVERLAP · EXTERNAL REVIEW",{exact:true})).toBeVisible();
  await expect(lab.getByRole("heading",{name:"Add real audio evidence without inventing acoustic scores"})).toBeVisible();
  await expect(lab.locator(".p19-target-grid button")).toHaveCount(4);
  await expect(lab.getByText(/does not infer pitch-accent correctness/i)).toBeVisible();

  await lab.getByRole("button",{name:"Listening under overlap"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.locator(".p19-overlap-grid button")).toHaveCount(4);
  await expect(lab.getByText("ARTIFICIAL OVERLAP OF VERIFIED NATIVE SOURCES",{exact:true})).toBeVisible();
  await expect(lab.getByText(/not evidence of a naturally occurring multi-speaker conversation/i)).toBeVisible();

  await lab.getByRole("button",{name:"External C2-oriented review"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await expect(lab.getByRole("heading",{name:"Give a reviewer evidence without giving the app a fake C2 authority"})).toBeVisible();
  await expect(lab.getByRole("button",{name:"Export reviewer packet"})).toBeVisible();
  await expect(lab.getByText(/not a CEFR certification exam/i)).toBeVisible();

  await page.getByRole("button",{name:"Progress"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.getByTestId("j8-c1-vault").locator("summary").click();
  await expect(page.getByText("C1→C2 LONGITUDINAL PORTFOLIO",{exact:true})).toBeVisible();
  await expect(page.getByText("AUDIO + EXTERNAL REVIEW",{exact:true})).toBeVisible();
});

test("P19 local-audio capture remains visibly local-only before microphone permission",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Immerse"}).evaluate((button)=>(button as HTMLButtonElement).click());
  await page.locator("#j6-studio-p19 > summary").click();
  const lab=page.locator(".p19-evidence");
  await expect(lab.getByRole("button",{name:"Record real audio"})).toBeVisible();
  await expect(lab.getByText(/Raw recording stays local-only/)).toBeVisible();
  await expect(lab.getByText(/not Japanese pitch accent or intonation correctness/)).toBeVisible();
});
