import "fake-indexeddb/auto";
import fs from "node:fs";
import path from "node:path";
import {afterEach,describe,expect,it} from "vitest";
import {PNG} from "pngjs";
import {createIcon} from "../../scripts/generate-pwa-icons.mjs";
import {getCompletedTodayCount,GUEST_ACCOUNT_ID,setDevelopmentAccountId} from "../../apps/web/src/study/runtime";
import {openLocalDb} from "../../packages/local-db/src/index";

const ROOT=path.resolve(process.cwd());
afterEach(()=>setDevelopmentAccountId(GUEST_ACCOUNT_ID));

describe("J16D installed Android stability",()=>{
  it("provides real-sized raster icons and keeps installable standalone metadata",()=>{
    const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,"apps/web/public/manifest.webmanifest"),"utf8"));
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.map((icon:{src:string})=>icon.src)).toEqual(["icon-192.png","icon-512.png","icon.svg"]);
    for(const size of [192,512]){
      const png=PNG.sync.read(createIcon(size));
      expect([png.width,png.height]).toEqual([size,size]);
      expect(png.data[(Math.floor(size/2)*size+Math.floor(size/2))*4+3]).toBe(255);
    }
  });

  it("reconstructs the daily completed count from IndexedDB across reads",async()=>{
    const accountId="11111111-2222-4333-8444-555555555555";
    setDevelopmentAccountId(accountId);
    const today=new Date("2026-10-08T12:00:00");
    const yesterday=new Date(today.getTime()-86400000);
    const db=await openLocalDb(accountId);
    await new Promise<void>((resolve,reject)=>{
      const transaction=db.transaction("study_events","readwrite");
      const store=transaction.objectStore("study_events");
      store.put({id:"a",userId:accountId,occurredAt:today.toISOString(),result:"correct"});
      store.put({id:"b",userId:accountId,occurredAt:today.toISOString(),result:"incorrect"});
      store.put({id:"c",userId:accountId,occurredAt:yesterday.toISOString(),result:"correct"});
      transaction.oncomplete=()=>resolve();
      transaction.onerror=()=>reject(transaction.error);
    });
    db.close();
    expect(await getCompletedTodayCount(today)).toBe(2);
    expect(await getCompletedTodayCount(today)).toBe(2);
  });
});
