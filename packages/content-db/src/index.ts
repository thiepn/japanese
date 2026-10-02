import SQLiteESMFactory from "@journeyapps/wa-sqlite/dist/wa-sqlite-async.mjs";
import * as SQLite from "@journeyapps/wa-sqlite";
import { IDBBatchAtomicVFS } from "@journeyapps/wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import type { AudioAssetRecord, CanDoDescriptor, ContentSeedPackage, CourseUnit, GrammarConcept, Kanji, Lexeme, ReadingText, Sense, Sentence } from "@thiepn/content-schema";
import type { EntityKind, EntityRef } from "@thiepn/domain";
import { normalizeJapaneseSearch, type SearchDocument, type SearchResult } from "@thiepn/search";

type SqliteApi = ReturnType<typeof SQLite.Factory>;
type SqlBinding = string | number | bigint | Uint8Array | null;

export interface LexemeDetail {
  lexeme:Lexeme; senses:Sense[]; kanji:Kanji[]; audioAssets:AudioAssetRecord[];
}
export interface GrammarDetail { grammar:GrammarConcept; sentences:Sentence[]; }
export interface CourseUnitDetail { unit:CourseUnit; canDo:CanDoDescriptor|null; grammar:GrammarConcept[]; sentences:Sentence[]; }
export interface ReadingTextDetail { text:ReadingText; sentences:Sentence[]; }

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
          `INSERT INTO lexemes(id,canonical_form,forms_json,readings_json,sense_ids_json,audio_ids_json,tags_json,priority,inflection_class,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET canonical_form=excluded.canonical_form,forms_json=excluded.forms_json,readings_json=excluded.readings_json,
             sense_ids_json=excluded.sense_ids_json,audio_ids_json=excluded.audio_ids_json,tags_json=excluded.tags_json,priority=excluded.priority,inflection_class=excluded.inflection_class,source_ids_json=excluded.source_ids_json`,
          [lexeme.id,lexeme.canonicalForm,JSON.stringify(lexeme.forms),JSON.stringify(lexeme.readings),JSON.stringify(lexeme.senseIds),JSON.stringify(lexeme.audioIds),JSON.stringify(lexeme.tags ?? []),lexeme.priority ?? null,lexeme.inflectionClass ?? null,JSON.stringify(lexeme.sourceIds)]
        );
        await this.run("DELETE FROM lexeme_kanji WHERE lexeme_id=?", [lexeme.id]);
        for (const link of lexeme.kanjiLinks) {
          await this.run(
            "INSERT INTO lexeme_kanji(lexeme_id,kanji_id,position,reading_in_word,reading_note) VALUES(?,?,?,?,?)",
            [lexeme.id,link.kanjiId,link.position,link.readingInWord ?? null,link.readingNote ?? null]
          );
        }
      }
      for (const audio of content.audioAssets) {
        await this.run(
          `INSERT INTO audio_assets(id,kind,text,reading,language,format,url,credit,accent,speaker,license_name,attribution_url,native_speaker,external_id,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,text=excluded.text,reading=excluded.reading,language=excluded.language,format=excluded.format,url=excluded.url,credit=excluded.credit,accent=excluded.accent,speaker=excluded.speaker,license_name=excluded.license_name,attribution_url=excluded.attribution_url,native_speaker=excluded.native_speaker,external_id=excluded.external_id,source_ids_json=excluded.source_ids_json`,
          [audio.id,audio.kind,audio.text,audio.reading ?? null,audio.language,audio.format,audio.url,audio.credit,audio.accent ?? null,audio.speaker ?? null,audio.licenseName ?? null,audio.attributionUrl ?? null,audio.nativeSpeaker===undefined?null:(audio.nativeSpeaker?1:0),audio.externalId ?? null,JSON.stringify(audio.sourceIds)]
        );
      }
      for (const grammar of content.grammar) {
        await this.run(
          `INSERT INTO grammar(id,label,summary,mental_model,formation_json,uses_json,prerequisite_ids_json,contrast_ids_json,level,register_name,priority,tags_json,practice_json,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET label=excluded.label,summary=excluded.summary,mental_model=excluded.mental_model,formation_json=excluded.formation_json,uses_json=excluded.uses_json,prerequisite_ids_json=excluded.prerequisite_ids_json,contrast_ids_json=excluded.contrast_ids_json,level=excluded.level,register_name=excluded.register_name,priority=excluded.priority,tags_json=excluded.tags_json,practice_json=excluded.practice_json,source_ids_json=excluded.source_ids_json`,
          [grammar.id,grammar.label,grammar.summary,grammar.mentalModel,JSON.stringify(grammar.formation),JSON.stringify(grammar.uses),JSON.stringify(grammar.prerequisiteIds),JSON.stringify(grammar.contrastIds),grammar.level,grammar.register,grammar.priority ?? null,JSON.stringify(grammar.tags ?? []),grammar.practice?JSON.stringify(grammar.practice):null,JSON.stringify(grammar.sourceIds)]
        );
      }
      for (const sentence of content.sentences) {
        await this.run(
          `INSERT INTO sentences(id,text,normalized_text,reading,translation,level,register_name,grammar_ids_json,entity_refs_json,tokens_json,tags_json,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET text=excluded.text,normalized_text=excluded.normalized_text,reading=excluded.reading,translation=excluded.translation,level=excluded.level,register_name=excluded.register_name,grammar_ids_json=excluded.grammar_ids_json,entity_refs_json=excluded.entity_refs_json,tokens_json=excluded.tokens_json,tags_json=excluded.tags_json,source_ids_json=excluded.source_ids_json`,
          [sentence.id,sentence.text,sentence.normalizedText,sentence.reading ?? null,sentence.translation,sentence.level,sentence.register,JSON.stringify(sentence.grammarIds),JSON.stringify(sentence.entityRefs),JSON.stringify(sentence.tokens),JSON.stringify(sentence.tags ?? []),JSON.stringify(sentence.sourceIds)]
        );
      }
      for (const canDo of content.canDos) {
        await this.run(
          `INSERT INTO can_dos(id,statement,level,language_activity,grammar_ids_json,sentence_ids_json,prerequisite_ids_json,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET statement=excluded.statement,level=excluded.level,language_activity=excluded.language_activity,grammar_ids_json=excluded.grammar_ids_json,sentence_ids_json=excluded.sentence_ids_json,prerequisite_ids_json=excluded.prerequisite_ids_json,source_ids_json=excluded.source_ids_json`,
          [canDo.id,canDo.statement,canDo.level,canDo.languageActivity,JSON.stringify(canDo.grammarIds),JSON.stringify(canDo.sentenceIds),JSON.stringify(canDo.prerequisiteIds),JSON.stringify(canDo.sourceIds)]
        );
      }
      for (const unit of content.courseUnits) {
        await this.run(
          `INSERT INTO course_units(id,title,order_index,level,can_do_id,prerequisite_unit_ids_json,grammar_ids_json,sentence_ids_json,vocabulary_ids_json,conjugation_lexeme_ids_json,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET title=excluded.title,order_index=excluded.order_index,level=excluded.level,can_do_id=excluded.can_do_id,prerequisite_unit_ids_json=excluded.prerequisite_unit_ids_json,grammar_ids_json=excluded.grammar_ids_json,sentence_ids_json=excluded.sentence_ids_json,vocabulary_ids_json=excluded.vocabulary_ids_json,conjugation_lexeme_ids_json=excluded.conjugation_lexeme_ids_json,source_ids_json=excluded.source_ids_json`,
          [unit.id,unit.title,unit.order,unit.level,unit.canDoId,JSON.stringify(unit.prerequisiteUnitIds),JSON.stringify(unit.grammarIds),JSON.stringify(unit.sentenceIds),JSON.stringify(unit.vocabularyIds),JSON.stringify(unit.conjugationLexemeIds ?? []),JSON.stringify(unit.sourceIds)]
        );
      }
      for (const text of content.readingTexts) {
        await this.run(
          `INSERT INTO reading_texts(id,title,description,level,kind,sentence_ids_json,target_lexeme_ids_json,grammar_ids_json,tags_json,estimated_minutes,audio_mode,audio_asset_id,questions_json,source_ids_json)
           VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,level=excluded.level,kind=excluded.kind,sentence_ids_json=excluded.sentence_ids_json,target_lexeme_ids_json=excluded.target_lexeme_ids_json,grammar_ids_json=excluded.grammar_ids_json,tags_json=excluded.tags_json,estimated_minutes=excluded.estimated_minutes,audio_mode=excluded.audio_mode,audio_asset_id=excluded.audio_asset_id,questions_json=excluded.questions_json,source_ids_json=excluded.source_ids_json`,
          [text.id,text.title,text.description,text.level,text.kind,JSON.stringify(text.sentenceIds),JSON.stringify(text.targetLexemeIds),JSON.stringify(text.grammarIds),JSON.stringify(text.tags),text.estimatedMinutes,text.audioMode,text.audioAssetId ?? null,JSON.stringify(text.comprehensionQuestions),JSON.stringify(text.sourceIds)]
        );
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
        entity:{kind:"kanji",id:item.id}, title:item.literal, glosses:item.meanings
      })),
      ...content.grammar.map((item):SearchDocument=>({
        entity:{kind:"grammar",id:item.id}, title:item.label, glosses:[item.summary,...item.uses], aliases:item.formation
      })),
      ...content.sentences.map((item):SearchDocument=>({
        entity:{kind:"sentence",id:item.id}, title:item.text, ...(item.reading?{reading:item.reading}:{}), glosses:[item.translation], aliases:[item.normalizedText]
      })),
      ...content.readingTexts.map((item):SearchDocument=>({
        entity:{kind:"text",id:item.id}, title:item.title, glosses:[item.description,item.level], aliases:item.tags
      }))
    ]);
  }

  async getLexeme(id:string):Promise<LexemeDetail|null>{
    const lexemeRow=await this.firstRow(
      "SELECT canonical_form,forms_json,readings_json,sense_ids_json,audio_ids_json,tags_json,priority,inflection_class,source_ids_json FROM lexemes WHERE id=?",
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
      audioIds:JSON.parse(String(lexemeRow[4])) as string[],
      kanjiLinks:links.map((row)=>({
        kanjiId:String(row[0]),
        position:Number(row[1]),
        ...(row[2]===null?{}:{readingInWord:String(row[2])}),
        ...(row[3]===null?{}:{readingNote:String(row[3])})
      })),
      tags:JSON.parse(String(lexemeRow[5])) as string[],
      ...(lexemeRow[6]===null?{}:{priority:Number(lexemeRow[6])}),
      ...(lexemeRow[7]===null?{}:{inflectionClass:String(lexemeRow[7]) as NonNullable<Lexeme["inflectionClass"]>}),
      sourceIds:JSON.parse(String(lexemeRow[8])) as string[]
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
    const audioAssets:AudioAssetRecord[]=[];
    for(const audioId of lexeme.audioIds){
      const row=await this.firstRow("SELECT kind,text,reading,language,format,url,credit,accent,speaker,license_name,attribution_url,native_speaker,external_id,source_ids_json FROM audio_assets WHERE id=?",[audioId]);
      if(row)audioAssets.push({
        id:audioId,
        kind:String(row[0]) as AudioAssetRecord["kind"],
        text:String(row[1]),
        ...(row[2]===null?{}:{reading:String(row[2])}),
        language:String(row[3]),
        format:String(row[4]) as AudioAssetRecord["format"],
        url:String(row[5]),
        credit:String(row[6]),
        ...(row[7]===null?{}:{accent:String(row[7])}),
        ...(row[8]===null?{}:{speaker:String(row[8])}),
        ...(row[9]===null?{}:{licenseName:String(row[9])}),
        ...(row[10]===null?{}:{attributionUrl:String(row[10])}),
        ...(row[11]===null?{}:{nativeSpeaker:Number(row[11])===1}),
        ...(row[12]===null?{}:{externalId:String(row[12])}),
        sourceIds:JSON.parse(String(row[13])) as string[]
      });
    }
    return {lexeme,senses,kanji:kanjiItems,audioAssets};
  }

  async getGrammar(id:string):Promise<GrammarDetail|null>{
    const row=await this.firstRow("SELECT label,summary,mental_model,formation_json,uses_json,prerequisite_ids_json,contrast_ids_json,level,register_name,priority,tags_json,practice_json,source_ids_json FROM grammar WHERE id=?",[id]);
    if(!row)return null;
    const grammar:GrammarConcept={id,label:String(row[0]),summary:String(row[1]),mentalModel:String(row[2]),formation:JSON.parse(String(row[3])) as string[],uses:JSON.parse(String(row[4])) as string[],prerequisiteIds:JSON.parse(String(row[5])) as string[],contrastIds:JSON.parse(String(row[6])) as string[],level:String(row[7]),register:String(row[8]),...(row[9]===null?{}:{priority:Number(row[9])}),tags:JSON.parse(String(row[10])) as string[],...(row[11]===null?{}:{practice:JSON.parse(String(row[11])) as NonNullable<GrammarConcept["practice"]>}),sourceIds:JSON.parse(String(row[12])) as string[]};
    const rows=await this.allRows("SELECT id,text,normalized_text,reading,translation,level,register_name,grammar_ids_json,entity_refs_json,tokens_json,tags_json,source_ids_json FROM sentences WHERE grammar_ids_json LIKE ?",[`%"${id}"%`]);
    return {grammar,sentences:rows.map(sentenceFromRow)};
  }

  async getSentence(id:string):Promise<Sentence|null>{
    const row=await this.firstRow("SELECT id,text,normalized_text,reading,translation,level,register_name,grammar_ids_json,entity_refs_json,tokens_json,tags_json,source_ids_json FROM sentences WHERE id=?",[id]);
    return row?sentenceFromRow(row):null;
  }

  async listCourseUnits():Promise<CourseUnitDetail[]>{
    const rows=await this.allRows("SELECT id,title,order_index,level,can_do_id,prerequisite_unit_ids_json,grammar_ids_json,sentence_ids_json,vocabulary_ids_json,source_ids_json FROM course_units ORDER BY order_index ASC");
    const result:CourseUnitDetail[]=[];
    for(const row of rows){
      const unit:CourseUnit={id:String(row[0]),title:String(row[1]),order:Number(row[2]),level:String(row[3]),canDoId:String(row[4]),prerequisiteUnitIds:JSON.parse(String(row[5])) as string[],grammarIds:JSON.parse(String(row[6])) as string[],sentenceIds:JSON.parse(String(row[7])) as string[],vocabularyIds:JSON.parse(String(row[8])) as string[],sourceIds:JSON.parse(String(row[9])) as string[]};
      const canDoRow=await this.firstRow("SELECT statement,level,language_activity,grammar_ids_json,sentence_ids_json,prerequisite_ids_json,source_ids_json FROM can_dos WHERE id=?",[unit.canDoId]);
      const canDo:CanDoDescriptor|null=canDoRow?{id:unit.canDoId,statement:String(canDoRow[0]),level:String(canDoRow[1]),languageActivity:String(canDoRow[2]) as CanDoDescriptor["languageActivity"],grammarIds:JSON.parse(String(canDoRow[3])) as string[],sentenceIds:JSON.parse(String(canDoRow[4])) as string[],prerequisiteIds:JSON.parse(String(canDoRow[5])) as string[],sourceIds:JSON.parse(String(canDoRow[6])) as string[]}:null;
      const grammar:GrammarConcept[]=[];for(const grammarId of unit.grammarIds){const detail=await this.getGrammar(grammarId);if(detail)grammar.push(detail.grammar);}
      const sentences:Sentence[]=[];for(const sentenceId of unit.sentenceIds){const sentence=await this.getSentence(sentenceId);if(sentence)sentences.push(sentence);}
      result.push({unit,canDo,grammar,sentences});
    }
    return result;
  }

  async getReadingText(id:string):Promise<ReadingTextDetail|null>{
    const row=await this.firstRow("SELECT id,title,description,level,kind,sentence_ids_json,target_lexeme_ids_json,grammar_ids_json,tags_json,estimated_minutes,audio_mode,audio_asset_id,questions_json,source_ids_json FROM reading_texts WHERE id=?",[id]);
    if(!row)return null;
    const text=readingTextFromRow(row);
    const sentences:Sentence[]=[];
    for(const sentenceId of text.sentenceIds){const sentence=await this.getSentence(sentenceId);if(sentence)sentences.push(sentence);}
    return {text,sentences};
  }

  async listReadingTexts():Promise<ReadingTextDetail[]>{
    const rows=await this.allRows("SELECT id,title,description,level,kind,sentence_ids_json,target_lexeme_ids_json,grammar_ids_json,tags_json,estimated_minutes,audio_mode,audio_asset_id,questions_json,source_ids_json FROM reading_texts ORDER BY estimated_minutes ASC,title ASC");
    const result:ReadingTextDetail[]=[];
    for(const row of rows){const text=readingTextFromRow(row);const sentences:Sentence[]=[];for(const sentenceId of text.sentenceIds){const sentence=await this.getSentence(sentenceId);if(sentence)sentences.push(sentence);}result.push({text,sentences});}
    return result;
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
        audio_ids_json TEXT NOT NULL DEFAULT '[]',
        tags_json TEXT NOT NULL,
        priority INTEGER,
        inflection_class TEXT,
        source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS audio_assets(
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        text TEXT NOT NULL,
        reading TEXT,
        language TEXT NOT NULL,
        format TEXT NOT NULL,
        url TEXT NOT NULL,
        credit TEXT NOT NULL,
        accent TEXT,
        speaker TEXT,
        license_name TEXT,
        attribution_url TEXT,
        native_speaker INTEGER,
        external_id TEXT,
        source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS grammar(
        id TEXT PRIMARY KEY,label TEXT NOT NULL,summary TEXT NOT NULL,mental_model TEXT NOT NULL,formation_json TEXT NOT NULL,uses_json TEXT NOT NULL,
        prerequisite_ids_json TEXT NOT NULL,contrast_ids_json TEXT NOT NULL,level TEXT NOT NULL,register_name TEXT NOT NULL,priority INTEGER,tags_json TEXT NOT NULL,practice_json TEXT,source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sentences(
        id TEXT PRIMARY KEY,text TEXT NOT NULL,normalized_text TEXT NOT NULL,reading TEXT,translation TEXT NOT NULL,level TEXT NOT NULL,register_name TEXT NOT NULL,
        grammar_ids_json TEXT NOT NULL,entity_refs_json TEXT NOT NULL,tokens_json TEXT NOT NULL,tags_json TEXT NOT NULL,source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS can_dos(
        id TEXT PRIMARY KEY,statement TEXT NOT NULL,level TEXT NOT NULL,language_activity TEXT NOT NULL,grammar_ids_json TEXT NOT NULL,sentence_ids_json TEXT NOT NULL,prerequisite_ids_json TEXT NOT NULL,source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS course_units(
        id TEXT PRIMARY KEY,title TEXT NOT NULL,order_index INTEGER NOT NULL,level TEXT NOT NULL,can_do_id TEXT NOT NULL,prerequisite_unit_ids_json TEXT NOT NULL,
        grammar_ids_json TEXT NOT NULL,sentence_ids_json TEXT NOT NULL,vocabulary_ids_json TEXT NOT NULL,conjugation_lexeme_ids_json TEXT NOT NULL DEFAULT '[]',source_ids_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reading_texts(
        id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL,level TEXT NOT NULL,kind TEXT NOT NULL,
        sentence_ids_json TEXT NOT NULL,target_lexeme_ids_json TEXT NOT NULL,grammar_ids_json TEXT NOT NULL,tags_json TEXT NOT NULL,
        estimated_minutes INTEGER NOT NULL,audio_mode TEXT NOT NULL,audio_asset_id TEXT,questions_json TEXT NOT NULL,source_ids_json TEXT NOT NULL
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
    await this.ensureColumn("lexemes","audio_ids_json","TEXT NOT NULL DEFAULT \'[]\'");
    await this.ensureColumn("audio_assets","license_name","TEXT");
    await this.ensureColumn("audio_assets","attribution_url","TEXT");
    await this.ensureColumn("audio_assets","native_speaker","INTEGER");
    await this.ensureColumn("audio_assets","external_id","TEXT");
    await this.ensureColumn("grammar","practice_json","TEXT");
    await this.ensureColumn("reading_texts","audio_asset_id","TEXT");
    await this.ensureColumn("lexemes","inflection_class","TEXT");
    await this.ensureColumn("course_units","conjugation_lexeme_ids_json","TEXT NOT NULL DEFAULT \'[]\'");
  }

  private async ensureColumn(table:string,column:string,declaration:string):Promise<void>{
    const rows=await this.allRows(`PRAGMA table_info(${table})`);
    if(rows.some((row)=>String(row[1])===column))return;
    await this.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${declaration}`);
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
  const allowed: readonly EntityKind[] = ["lexeme", "sense", "kanji", "grammar", "sentence", "text", "document", "kana", "can_do"];
  if (!allowed.includes(value as EntityKind)) throw new Error(`UNKNOWN_ENTITY_KIND:${value}`);
  return value as EntityKind;
}

function sentenceFromRow(row:unknown[]):Sentence{
  return {
    id:String(row[0]),text:String(row[1]),normalizedText:String(row[2]),
    ...(row[3]===null?{}:{reading:String(row[3])}),translation:String(row[4]),level:String(row[5]),register:String(row[6]),
    grammarIds:JSON.parse(String(row[7])) as string[],entityRefs:JSON.parse(String(row[8])) as Sentence["entityRefs"],
    tokens:JSON.parse(String(row[9])) as Sentence["tokens"],tags:JSON.parse(String(row[10])) as string[],sourceIds:JSON.parse(String(row[11])) as string[]
  };
}


function readingTextFromRow(row:unknown[]):ReadingText{
  return {
    id:String(row[0]),title:String(row[1]),description:String(row[2]),level:String(row[3]),kind:String(row[4]) as ReadingText["kind"],
    sentenceIds:JSON.parse(String(row[5])) as string[],targetLexemeIds:JSON.parse(String(row[6])) as string[],grammarIds:JSON.parse(String(row[7])) as string[],
    tags:JSON.parse(String(row[8])) as string[],estimatedMinutes:Number(row[9]),audioMode:String(row[10]) as ReadingText["audioMode"],
    ...(row[11]===null?{}:{audioAssetId:String(row[11])}),
    comprehensionQuestions:JSON.parse(String(row[12])) as ReadingText["comprehensionQuestions"],sourceIds:JSON.parse(String(row[13])) as string[]
  };
}
