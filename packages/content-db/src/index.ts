import SQLiteESMFactory from "@journeyapps/wa-sqlite/dist/wa-sqlite-async.mjs";
import * as SQLite from "@journeyapps/wa-sqlite";
import { IDBBatchAtomicVFS } from "@journeyapps/wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import type { EntityKind, EntityRef } from "@thiepn/domain";
import { normalizeJapaneseSearch, type SearchDocument, type SearchResult } from "@thiepn/search";

type SqliteApi = ReturnType<typeof SQLite.Factory>;

export class ContentDatabase {
  private constructor(
    private readonly sqlite3: SqliteApi,
    private readonly db: number,
    private readonly vfs: { close(): void | Promise<void> }
  ) {}

  static async open(name = "jp-core.sqlite"): Promise<ContentDatabase> {
    if (typeof indexedDB === "undefined") throw new Error("INDEXEDDB_UNAVAILABLE");
    const module = await SQLiteESMFactory();
    const sqlite3 = SQLite.Factory(module);
    const factory = IDBBatchAtomicVFS as unknown as { create(name: string, module: unknown, options?: { idbName?: string }): Promise<{ close(): void | Promise<void> }> };
    const vfs = await factory.create("thiepn-japanese-content-vfs", module, { idbName: "thiepn-japanese-content" });
    sqlite3.vfs_register(vfs as Parameters<typeof sqlite3.vfs_register>[0], true);
    const db = await sqlite3.open_v2(name);
    const instance = new ContentDatabase(sqlite3, db, vfs);
    await instance.ensureSchema();
    return instance;
  }

  async upsertSearchDocuments(documents: readonly SearchDocument[]): Promise<void> {
    const sql = `
      INSERT INTO search_documents(
        entity_kind, entity_id, title, reading, gloss, aliases,
        title_norm, reading_norm, gloss_norm, aliases_norm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(entity_kind, entity_id) DO UPDATE SET
        title=excluded.title, reading=excluded.reading, gloss=excluded.gloss, aliases=excluded.aliases,
        title_norm=excluded.title_norm, reading_norm=excluded.reading_norm, gloss_norm=excluded.gloss_norm, aliases_norm=excluded.aliases_norm
    `;
    for (const document of documents) {
      const gloss = document.glosses?.join("; ") ?? "";
      const aliases = document.aliases?.join(" ") ?? "";
      for await (const stmt of this.sqlite3.statements(this.db, sql)) {
        this.sqlite3.bind_collection(stmt, [
          document.entity.kind, document.entity.id, document.title, document.reading ?? null, gloss || null, aliases || null,
          normalizeJapaneseSearch(document.title), normalizeJapaneseSearch(document.reading ?? ""),
          normalizeJapaneseSearch(gloss), normalizeJapaneseSearch(aliases)
        ]);
        await this.sqlite3.step(stmt);
      }
    }
  }

  async search(query: string, limit = 40): Promise<SearchResult[]> {
    const normalized = normalizeJapaneseSearch(query);
    if (!normalized) return [];
    const prefix = `${normalized}%`;
    const contains = `%${normalized}%`;
    const sql = `
      SELECT entity_kind, entity_id, title, reading, gloss,
        CASE
          WHEN title_norm = ? OR reading_norm = ? OR gloss_norm = ? OR aliases_norm = ? THEN 100
          WHEN title_norm LIKE ? OR reading_norm LIKE ? OR gloss_norm LIKE ? OR aliases_norm LIKE ? THEN 80
          ELSE 60
        END AS score
      FROM search_documents
      WHERE title_norm LIKE ? OR reading_norm LIKE ? OR gloss_norm LIKE ? OR aliases_norm LIKE ?
      ORDER BY score DESC, title ASC
      LIMIT ?
    `;
    const bindings = [normalized, normalized, normalized, normalized, prefix, prefix, prefix, prefix, contains, contains, contains, contains, limit];
    const results: SearchResult[] = [];
    for await (const stmt of this.sqlite3.statements(this.db, sql)) {
      this.sqlite3.bind_collection(stmt, bindings);
      while ((await this.sqlite3.step(stmt)) === SQLite.SQLITE_ROW) {
        const [kind, id, title, reading, gloss, score] = this.sqlite3.row(stmt);
        const entity: EntityRef = { kind: asEntityKind(String(kind)), id: String(id) };
        const subtitle = reading ? String(reading) : gloss ? String(gloss) : undefined;
        results.push(subtitle
          ? { entity, title: String(title), subtitle, matchedBy: "sqlite", score: Number(score) }
          : { entity, title: String(title), matchedBy: "sqlite", score: Number(score) });
      }
    }
    return results;
  }

  async close(): Promise<void> {
    await this.sqlite3.close(this.db);
    await this.vfs.close();
  }

  private async ensureSchema(): Promise<void> {
    await this.sqlite3.exec(this.db, `
      CREATE TABLE IF NOT EXISTS search_documents(
        entity_kind TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        title TEXT NOT NULL,
        reading TEXT,
        gloss TEXT,
        aliases TEXT,
        title_norm TEXT NOT NULL,
        reading_norm TEXT NOT NULL DEFAULT '',
        gloss_norm TEXT NOT NULL DEFAULT '',
        aliases_norm TEXT NOT NULL DEFAULT '',
        PRIMARY KEY(entity_kind, entity_id)
      );
      CREATE INDEX IF NOT EXISTS search_documents_title_norm ON search_documents(title_norm);
      CREATE INDEX IF NOT EXISTS search_documents_reading_norm ON search_documents(reading_norm);
    `);
  }
}

function asEntityKind(value: string): EntityKind {
  const allowed: readonly EntityKind[] = ["lexeme", "sense", "kanji", "grammar", "sentence", "kana", "can_do"];
  if (!allowed.includes(value as EntityKind)) throw new Error(`UNKNOWN_ENTITY_KIND:${value}`);
  return value as EntityKind;
}
