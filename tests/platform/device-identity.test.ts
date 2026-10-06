import { describe,expect,it } from "vitest";
import { getJapaneseDeviceId } from "../../apps/web/src/deviceIdentity";
import { DEVELOPMENT_DEVICE_ID } from "../../apps/web/src/study/runtime";

describe("Japanese browser device identity",()=>{
  it("uses one stable browser identity across study subsystems",()=>{
    const first=getJapaneseDeviceId();
    const second=getJapaneseDeviceId();
    expect(first).toBe(second);
    expect(first).toMatch(/^jp-browser-[A-Za-z0-9-]{12,80}$/);
    expect(DEVELOPMENT_DEVICE_ID).toBe(first);
  });
});
