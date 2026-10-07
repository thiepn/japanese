import {describe,expect,it} from "vitest";
import {j10SeasonFromDate,j10SeasonLabel,j10SeasonPattern,resolveJ10Season} from "../../apps/web/src/design/j10Season";

describe("J10 seasonal resolver",()=>{
  it("maps the calendar into the six J10 seasonal worlds",()=>{
    expect(j10SeasonFromDate(new Date(2026,0,1))).toBe("new-year");
    expect(j10SeasonFromDate(new Date(2026,0,8))).toBe("winter");
    expect(j10SeasonFromDate(new Date(2026,2,20))).toBe("spring");
    expect(j10SeasonFromDate(new Date(2026,5,18))).toBe("tsuyu");
    expect(j10SeasonFromDate(new Date(2026,6,20))).toBe("summer");
    expect(j10SeasonFromDate(new Date(2026,9,7))).toBe("autumn");
    expect(j10SeasonFromDate(new Date(2026,11,12))).toBe("winter");
  });

  it("supports explicit visual-QA season preview without accepting arbitrary values",()=>{
    const fallback=new Date(2026,9,7);
    expect(resolveJ10Season(fallback,"?season=spring")).toBe("spring");
    expect(resolveJ10Season(fallback,"?season=tsuyu")).toBe("tsuyu");
    expect(resolveJ10Season(fallback,"?season=invalid")).toBe("autumn");
  });

  it("keeps labels and procedural pattern choices deterministic",()=>{
    expect(j10SeasonLabel("new-year")).toBe("正月");
    expect(j10SeasonLabel("tsuyu")).toBe("梅雨");
    expect(j10SeasonPattern("spring")).toBe("shippo");
    expect(j10SeasonPattern("summer")).toBe("seigaiha");
    expect(j10SeasonPattern("autumn")).toBe("asanoha");
    expect(j10SeasonPattern("winter")).toBe("kikko");
    expect(j10SeasonPattern("new-year")).toBe("ichimatsu");
  });
});
