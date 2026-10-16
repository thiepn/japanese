import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("Account panel offers an actual offline local backup with privacy and no cloud-sync claim",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  const recovery=panel.getByRole("region",{name:"Local Japanese study backup"});
  await expect(recovery).toBeVisible();
  await expect(recovery.getByText(/does not sync them to another device/)).toBeVisible();
  const downloadPromise=page.waitForEvent("download");
  await recovery.getByRole("button",{name:"Save a local backup"}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^japanese-.*-local-backup-\d{4}-\d\d-\d\d\.json$/);
  const location=await download.path();
  expect(location).not.toBeNull();
  const raw=await readFile(location!,"utf8");
  const backup=JSON.parse(raw) as {schema:string;schemaVersion:number;accountId:string;stores:Record<string,unknown[]>};
  expect(backup.schema).toBe("thiepn-japanese-workspace-backup");
  expect(backup.schemaVersion).toBe(1);
  expect(backup.accountId).toBeTruthy();
  expect(Object.keys(backup.stores).sort()).toEqual([
    "memory_traces","private_documents","private_media_reviews","private_prosody_captures",
    "private_sentences","private_vocabulary","study_events","sync_outbox",
  ].sort());
  await expect(recovery.getByText(/It was not uploaded/)).toBeVisible();
});

test("local recovery rejects another owner without overwriting Japanese study data",async({page})=>{
  await page.goto("./");
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const panel=page.getByRole("dialog",{name:"THIEPN Account"});
  const recovery=panel.getByRole("region",{name:"Local Japanese study backup"});
  const exportPromise=page.waitForEvent("download");
  await recovery.getByRole("button",{name:"Save a local backup"}).click();
  const download=await exportPromise;
  const raw=await readFile((await download.path())!,"utf8");
  const foreign=JSON.parse(raw) as {accountId:string};
  foreign.accountId="another-account-owner";
  await recovery.getByLabel("Select Japanese local backup file").setInputFiles({
    name:"foreign-account-backup.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(foreign)),
  });
  await expect(recovery.getByText(/different Japanese workspace or has an invalid header/)).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
});

test("recovery controls remain keyboard-accessible and inside compact Android viewport",async({page},testInfo)=>{
  test.skip(testInfo.project.name==="desktop-chromium","Focus on phone-specific geometry and touch controls");
  await page.goto("./");
  await page.getByRole("button",{name:"Open THIEPN Account"}).click();
  const recovery=page.getByRole("region",{name:"Local Japanese study backup"});
  const save=recovery.getByRole("button",{name:"Save a local backup"});
  await save.scrollIntoViewIfNeeded();
  const bounds=await save.boundingBox();
  expect(bounds?.height??0).toBeGreaterThanOrEqual(44);
  const viewport=page.viewportSize()!;
  expect(bounds!.x).toBeGreaterThanOrEqual(-1);
  expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width+1);
  const chooser=recovery.getByLabel("Select Japanese local backup file");
  await chooser.scrollIntoViewIfNeeded();
  await expect(chooser).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
