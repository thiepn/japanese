import type { EntityRef } from "@thiepn/domain";

export interface SearchDocument {
  entity: EntityRef;
  title: string;
  reading?: string;
  glosses?: string[];
  aliases?: string[];
}
export interface SearchResult { entity: EntityRef; title: string; subtitle?: string; matchedBy: string; score: number; }

export function normalizeJapaneseSearch(value: string): string {
  return katakanaToHiragana(value.normalize("NFKC").trim().toLowerCase());
}

export function searchDocuments(query: string, documents: SearchDocument[]): SearchResult[] {
  const q=normalizeJapaneseSearch(query);
  if (!q) return [];
  const results: SearchResult[]=[];
  for (const document of documents) {
    const candidates=[
      ["title",document.title],
      ["reading",document.reading ?? ""],
      ...((document.glosses ?? []).map((v)=>["gloss",v] as const)),
      ...((document.aliases ?? []).map((v)=>["alias",v] as const))
    ] as const;
    let best:{matchedBy:string;score:number}|null=null;
    for (const [kind,value] of candidates) {
      const normalized=normalizeJapaneseSearch(value);
      const score=normalized===q?100:normalized.startsWith(q)?80:normalized.includes(q)?60:0;
      if (score && (!best || score>best.score)) best={matchedBy:kind,score};
    }
    if (best) results.push({entity:document.entity,title:document.title,subtitle:document.reading ?? document.glosses?.[0],...best});
  }
  return results.sort((a,b)=>b.score-a.score || a.title.localeCompare(b.title,"ja"));
}

function katakanaToHiragana(value:string):string {
  return Array.from(value,(char)=>{
    const code=char.charCodeAt(0);
    return code>=0x30a1 && code<=0x30f6 ? String.fromCharCode(code-0x60) : char;
  }).join("");
}
