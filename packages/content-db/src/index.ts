import SQLiteESMFactory from "@journeyapps/wa-sqlite/dist/wa-sqlite-async.mjs";
import * as SQLite from "@journeyapps/wa-sqlite";
import { IDBBatchAtomicVFS } from "@journeyapps/wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import type { ContentSeedPackage, Kanji, Lexeme, Sense } from "@thiepn/content-schema";
import type { EntityKind, EntityRef } from "@thiepn/domain";
import { normalizeJapaneseSearch, type SearchDocument, type SearchResult } from "@thiepn/search";

type SqliteApi = ReturnType<typeof SQLite.Factory>;
type SqlBinding = string | number | bigint | Uint8Array | null;

export interface LexemeDetail {
  lexeme: Lexeme;
  senses: Sense[];
  kanji: Kanji[];
}

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

  async upsertCoreContent(content: ContentSeedPackage): Promise<void> {
    await this.exec("BEGIN IMMEDIATE");
    try {
      for (const kanji of content.kanji) {
        await this.run(
          `INSERT INTO kanji(id,literal,meanings_json,source_ids_json)
           VALUES(?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET literal=excluded.literal,meanings_json=excluded.meanings_json,source_ids_json=excluded.source_ids_json`,
          [kanji.id,kanji.literal,JSON.stringify(kanji.meanings),JSON.stringify(kanji.sourceIds)]
        );
      }
      for (const lexeme of content.lexemes) {
        await this.run(
          `INSERT INTO lexemes(id,canonical_form,forms_json,readings_json,sense_ids_json,tags_json,priority,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET canonical_form=excluded.canonical_form,forms_json=excluded.forms_json,readings_json=excluded.readings_json,
             sense_ids_json=excluded.sense_ids_json,tags_json=excluded.tags_json,priority=excluded.priority,source_ids_json=excluded.source_ids_json`,
          [lexeme.id,lexeme.canonicalForm,JSON.stringify(lexeme.forms),JSON.stringify(lexeme.readings),JSON.stringify(lexeme.senseIds),JSON.stringify(lexeme.tags ?? []),lexeme.priority ?? null,JSON.stringify(lexeme.sourceIds)]
        );
        await this.run("DELETE FROM lexeme_kanji WHERE lexeme_id=?", [lexeme.id]);
        for (const link of lexeme.kanjiLinks) {
          await this.run(
            "INSERT INTO lexeme_kanji(lexeme_id,kanji_id,position,reading_in_word,reading_note) VALUES(?,?,?,?,?)",
            [lexeme.id,link.kanjiId,link.position,link.readingInWord ?? null,link.readingNote ?? null]
          );
        }
      }
      for (const sense of content.senses) {
        await this.run(
          `INSERT INTO senses(id,lexeme_id,glosses_json,pos_json,source_ids_json)
           VALUES(?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET lexeme_id=excluded.lexeme_id,glosses_json=excluded.glosses_json,pos_json=excluded.pos_json,source_ids_json=excluded.source_ids_json`,
          [sense.id,sense.lexemeId,JSON.stringify(sense.glosses),JSON.stringify(sense.partOfSpeech ?? []),JSON.stringify(sense.sourceIds)]
        );
      }
      await this.exec("COMMIT");
    } catch (error) {
      await this.exec("ROLLBACK");
      throw error;
    }

    await this.upsertSearchDocuments([
      ...content.lexemes.map((lexeme):SearchDocument=>{
        const sense=content.senses.find((item)=>item.lexemeId===lexeme.id);
        const reading=lexeme.readings[0]?.text;
        return {
          entity:{kind:"lexeme",id:lexeme.id},
          title:lexeme.canonicalForm,
          ...(reading?{reading}:{}),
          glosses:sense?.glosses ?? [],
          aliases:lexeme.forms.map((form)=>form.text)
        };
      }),
      ...content.kanji.map((item):SearchDocument=>({
        entity:{kind:"kanji",id:item.id},
        title:item.literal,
        glosses:item.meanings
      }))
    ]);
  }

  async getLexeme(id:string):Promise<LexemeDetail|null>{
    const lexemeRow=await this.firstRow(
      "SELECT canonical_form,forms_json,readings_json,sense_ids_json,tags_json,priority,source_ids_json FROM lexemes WHERE id=?",
      [id]
    );
    if(!lexemeRow)return null;
    const links=await this.allRows("SELECT kanji_id,position,reading_in_word,reading_note FROM lexeme_kanji WHERE lexeme_id=? ORDER BY position ASC",[id]);
    const senseRows=await this.allRows("SELECT id,glosses_json,pos_json,source_ids_json FROM senses WHERE lexeme_id=?",[id]);
    const lexeme:Lexeme={
      id,
      canonicalForm:String(lexemeRow[0]),
      forms:JSON.parse(String(lexemeRow[1])) as Lexeme["forms"],
      readings:JSON.parse(String(lexemeRow[2])) as Lexeme["readings"],
      senseIds:JSON.parse(String(lexemeRow[3])) as string[],
      kanjiLinks:links.map((row)=>({
        kanjiId:String(row[0]),
        position:Number(row[1]),
        ...(row[2]===null?{}:{readingInWord:String(row[2])}),
        ...(row[3]===null?{}:{readingNote:String(row[3])})
      })),
      tags:JSON.parse(String(lexemeRow[4])) as string[],
      ...(lexemeRow[5]===null?{}:{priority:Number(lexemeRow[5])}),
      sourceIds:JSON.parse(String(lexemeRow[6])) as string[]
    };
    const senses:Sense[]=senseRows.map((row)=>({
      id:String(row[0]),lexemeId:id,
      glosses:JSON.parse(String(row[1])) as string[],
      partOfSpeech:JSON.parse(String(row[2])) as string[],
      sourceIds:JSON.parse(String(row[3])) as string[]
    }));
    const kanjiItems:Kanji[]=[];
    for(const link of links){
      const row=await this.firstRow("SELECT literal,meanings_json,source_ids_json FROM kanji WHERE id=?",[String(link[0])]);
      if(row)kanjiItems.push({id:String(link[0]),literal:String(row[0]),meanings:JSON.parse(String(row[1])) as string[],sourceIds:JSON.parse(String(row[2])) as string[]});
    }
    return {lexeme,senses,kanji:kanjiItems};
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
      await this.run(sql,[
        document.entity.kind, document.entity.id, document.title, document.reading ?? null, gloss || null, aliases || null,
        normalizeJapaneseSearch(document.title), normalizeJapaneseSearch(document.reading ?? ""),
        normalizeJapaneseSearch(gloss), normalizeJapaneseSearch(aliases)
      ]);
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
    await this.exec(`
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
      CREATE TABLE IF NOT EXISTS lexemes(
        id TEXT PRIMARY KEY,
        canonical_form TEXT NOT NULL,
        forms_json TEXT NOT NULL,
        readings_json TEXT NOT NULL,
        sense_ids_json TEXT NOT NULL,
        tags_json TEXT NOT NULL,
        priority INTEGER,
        source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS senses(
        id TEXT PRIMARY KEY,
        lexeme_id TEXT NOT NULL,
        glosses_json TEXT NOT NULL,
        pos_json TEXT NOT NULL,
        source_ids_json TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS senses_lexeme_id ON senses(lexeme_id);
      CREATE TABLE IF NOT EXISTS kanji(
        id TEXT PRIMARY KEY,
        literal TEXT NOT NULL,
        meanings_json TEXT NOT NULL,
        source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS lexeme_kanji(
        lexeme_id TEXT NOT NULL,
        kanji_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        reading_in_word TEXT,
        reading_note TEXT,
        PRIMARY KEY(lexeme_id,kanji_id,position)
      );
    `);
  }

  private async run(sql:string,bindings:readonly SqlBinding[]=[]):Promise<void>{
    for await(const stmt of this.sqlite3.statements(this.db,sql)){
      this.sqlite3.bind_collection(stmt,[...bindings]);
      await this.sqlite3.step(stmt);
    }
  }

  private async exec(sql:string):Promise<void>{ await this.sqlite3.exec(this.db,sql); }

  private async firstRow(sql:string,bindings:readonly SqlBinding[]=[]):Promise<unknown[]|null>{
    for await(const stmt of this.sqlite3.statements(this.db,sql)){
      this.sqlite3.bind_collection(stmt,[...bindings]);
      if((await this.sqlite3.step(stmt))===SQLite.SQLITE_ROW)return this.sqlite3.row(stmt);
    }
    return null;
  }

  private async allRows(sql:string,bindings:readonly SqlBinding[]=[]):Promise<unknown[][]>{
    const rows:unknown[][]=[];
    for await(const stmt of this.sqlite3.statements(this.db,sql)){
      this.sqlite3.bind_collection(stmt,[...bindings]);
      while((await this.sqlite3.step(stmt))===SQLite.SQLITE_ROW)rows.push(this.sqlite3.row(stmt));
    }
    return rows;
  }
}

function asEntityKind(value: string): EntityKind {
  const allowed: readonly EntityKind[] = ["lexeme", "sense", "kanji", "grammar", "sentence", "kana", "can_do"];
  if (!allowed.includes(value as EntityKind)) throw new Error(`UNKNOWN_ENTITY_KIND:${value}`);
  return value as EntityKind;
}
