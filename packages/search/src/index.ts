import type { EntityRef } from "@thiepn/domain";

export interface SearchDocument {
  entity: EntityRef;
  title: string;
  reading?: string;
  glosses?: string[];
  aliases?: string[];
}
export interface SearchResult { entity: EntityRef; title: string; subtitle?: string; matchedBy: string; score: number; }

type CandidateKind="title"|"reading"|"gloss"|"alias";
interface PreparedCandidate { kind:CandidateKind; normalized:string; }
interface PreparedSearchDocument { document:SearchDocument; candidates:PreparedCandidate[]; }

export interface SearchIndex {
  readonly size:number;
  search(query:string):SearchResult[];
}

export function normalizeJapaneseSearch(value: string): string {
  return katakanaToHiragana(value.normalize("NFKC").trim().toLowerCase());
}

export function createSearchIndex(documents:readonly SearchDocument[]):SearchIndex {
  const indexed:PreparedSearchDocument[]=documents.map((document)=>({
    document,
    candidates:[
      prepareCandidate("title",document.title),
      ...(document.reading?[prepareCandidate("reading",document.reading)]:[]),
      ...((document.glosses??[]).map((value)=>prepareCandidate("gloss",value))),
      ...((document.aliases??[]).map((value)=>prepareCandidate("alias",value)))
    ].filter((candidate)=>candidate.normalized.length>0)
  }));

  return {
    size:indexed.length,
    search(query:string):SearchResult[] {
      const q=normalizeJapaneseSearch(query);
      if(!q)return [];
      const results:SearchResult[]=[];
      for(const {document,candidates} of indexed){
        let best:{matchedBy:CandidateKind;score:number}|null=null;
        for(const candidate of candidates){
          const score=candidate.normalized===q?100:candidate.normalized.startsWith(q)?80:candidate.normalized.includes(q)?60:0;
          if(score&&(!best||score>best.score))best={matchedBy:candidate.kind,score};
        }
        if(best){
          const subtitle=document.reading??document.glosses?.[0];
          results.push(subtitle?{entity:document.entity,title:document.title,subtitle,...best}:{entity:document.entity,title:document.title,...best});
        }
      }
      return results.sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,"ja"));
    }
  };
}

export function searchDocuments(query: string, documents: SearchDocument[]): SearchResult[] {
  return createSearchIndex(documents).search(query);
}

function prepareCandidate(kind:CandidateKind,value:string):PreparedCandidate{
  return {kind,normalized:normalizeJapaneseSearch(value)};
}

function katakanaToHiragana(value:string):string {
  return Array.from(value,(char)=>{
    const code=char.charCodeAt(0);
    return code>=0x30a1 && code<=0x30f6 ? String.fromCharCode(code-0x60) : char;
  }).join("");
}
