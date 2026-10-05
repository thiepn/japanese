import { describe,expect,it } from "vitest";
import {
  JAPANESE_PLATFORM_SOURCE_BASELINE,
  languagePlatformCompatibility
} from "../../apps/web/src/platformCompatibility";

describe("P7 THIEPN Languages read-only integration",()=>{
  it("pins the audited Japanese source baseline",()=>{
    expect(JAPANESE_PLATFORM_SOURCE_BASELINE).toBe(
      "45d03f5b027bdb36fcf5a7f7df3c063e1ba09893"
    );
    expect(languagePlatformCompatibility.baselineCompatible).toBe(true);
  });

  it("does not transfer learner authority to the shared platform",()=>{
    expect(languagePlatformCompatibility.integrationMode).toBe("read-only");
    expect(languagePlatformCompatibility.authority).toEqual({
      content:"consumer",
      learnerState:"consumer",
      studyEvents:"consumer",
      memory:"consumer",
      mastery:"consumer",
      proficiency:"consumer",
      orchestration:"consumer",
      sync:"consumer"
    });
    expect(
      languagePlatformCompatibility.capabilities.sharedStateAuthoritative
    ).toBe(false);
    expect(
      languagePlatformCompatibility.capabilities.consumerWritesSharedState
    ).toBe(false);
    expect(
      languagePlatformCompatibility.capabilities.consumerUsesSharedScheduler
    ).toBe(false);
  });
});
