import { describe,expect,it } from "vitest";
import { createSearchIndex,searchDocuments,type SearchDocument } from "../../packages/search/src/index";
import { searchLocalJapanese } from "../../apps/web/src/content";

const documents:SearchDocument[]=[
  {
    entity:{kind:"lexeme",id:"taberu"},
    title:"食べる",
    reading:"たべる",
    glosses:["to eat","to consume"],
    aliases:["タベル"]
  },
  {
    entity:{kind:"grammar",id:"topic"},
    title:"は",
    glosses:["topic marker"],
    aliases:["topic"]
  }
];

describe("prepared local search index",()=>{
  it("preserves title, reading, gloss and kana-equivalent matching",()=>{
    const index=createSearchIndex(documents);
    expect(index.size).toBe(2);
    expect(index.search("食べる")[0]?.entity.id).toBe("taberu");
    expect(index.search("タベル")[0]?.entity.id).toBe("taberu");
    expect(index.search("consume")[0]?.entity.id).toBe("taberu");
    expect(index.search("topic")[0]?.entity.id).toBe("topic");
  });

  it("keeps the compatibility search wrapper deterministic",()=>{
    expect(searchDocuments("eat",documents)).toEqual(createSearchIndex(documents).search("eat"));
  });
});

describe("Japanese Library search",()=>{
  it("searches the canonical bundled corpus after the lazy index is created",async()=>{
    const wordResults=await searchLocalJapanese("食べる");
    expect(wordResults.some((item)=>item.entity.kind==="lexeme"&&item.title==="食べる")).toBe(true);

    const grammarResults=await searchLocalJapanese("topic");
    expect(grammarResults.some((item)=>item.entity.kind==="grammar")).toBe(true);
  });

  it("still returns starter content for an empty query without building a visible empty state",async()=>{
    const results=await searchLocalJapanese("");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item)=>item.matchedBy==="starter-content")).toBe(true);
  });
});
