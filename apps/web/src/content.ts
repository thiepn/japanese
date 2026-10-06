import type { ContentDatabase } from "@thiepn/content-db";
import type { SearchResult } from "@thiepn/search";
import { coreContent, senseForLexeme, starterLexemes } from "./coreContent";

let dbPromise: Promise<ContentDatabase> | null = null;

async function getDatabase(): Promise<ContentDatabase> {
  dbPromise ??= import("@thiepn/content-db")
    .then(({ContentDatabase})=>ContentDatabase.open())
    .then(async (db) => {
    await db.upsertCoreContent(coreContent);
    return db;
  });
  return dbPromise;
}

export async function searchLocalJapanese(query: string): Promise<SearchResult[]> {
  const db = await getDatabase();
  if(query.trim())return db.search(query);
  return starterLexemes.slice(0,24).map((lexeme)=>{
    const sense=senseForLexeme(lexeme);
    const reading=lexeme.readings[0]?.text;
    return {
      entity:{kind:"lexeme" as const,id:lexeme.id},
      title:lexeme.canonicalForm,
      ...(reading?{subtitle:`${reading} · ${sense.glosses.join(" / ")}`}:{subtitle:sense.glosses.join(" / ")}),
      matchedBy:"starter-content",
      score:100-(lexeme.priority??99)
    };
  });
}

export async function getLocalLexeme(id:string){
  const db=await getDatabase();
  return db.getLexeme(id);
}
