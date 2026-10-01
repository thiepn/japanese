import { ContentDatabase } from "@thiepn/content-db";
import type { SearchDocument, SearchResult } from "@thiepn/search";

const seed: SearchDocument[] = [
  { entity: { kind: "lexeme", id: "lex-taberu" }, title: "食べる", reading: "たべる", glosses: ["to eat"], aliases: ["taberu"] },
  { entity: { kind: "lexeme", id: "lex-gakkou" }, title: "学校", reading: "がっこう", glosses: ["school"], aliases: ["gakkou"] },
  { entity: { kind: "grammar", id: "grammar-teiru" }, title: "〜ている", reading: "ている", glosses: ["ongoing action", "resulting state"], aliases: ["te iru"] }
];

let dbPromise: Promise<ContentDatabase> | null = null;

async function getDatabase(): Promise<ContentDatabase> {
  dbPromise ??= ContentDatabase.open().then(async (db) => {
    await db.upsertSearchDocuments(seed);
    return db;
  });
  return dbPromise;
}

export async function searchLocalJapanese(query: string): Promise<SearchResult[]> {
  const db = await getDatabase();
  return query.trim() ? db.search(query) : db.search("食");
}
