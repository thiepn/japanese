import type { AudioAssetRecord, CanDoDescriptor, ContentSeedPackage, CourseUnit, GrammarConcept, Kanji, Lexeme, LexicalChunk, ProductiveTask, ReadingText, Sense, Sentence } from "@thiepn/content-schema";
import rawContent from "../../../content/seed/jp-core.json";
import rawC1Lexicon from "../../../content/seed/jp-c1-lexicon.json";
import rawC1Language from "../../../content/seed/jp-c1-language.json";
import rawC1Course from "../../../content/seed/jp-c1-course.json";
import rawRegistry from "../../../content/sources/registry.json";

const base=rawContent as unknown as ContentSeedPackage;
const c1Lexicon=rawC1Lexicon as unknown as Pick<ContentSeedPackage,"lexemes"|"senses">;
const c1Language=rawC1Language as unknown as Pick<ContentSeedPackage,"grammar"|"sentences"|"lexicalChunks">;
const c1Course=rawC1Course as unknown as Pick<ContentSeedPackage,"canDos"|"courseUnits"|"readingTexts"|"productiveTasks">;

export const coreContent:ContentSeedPackage={
  ...base,
  version:"0.10.0",
  lexemes:[...base.lexemes,...c1Lexicon.lexemes],
  senses:[...base.senses,...c1Lexicon.senses],
  grammar:[...base.grammar,...c1Language.grammar],
  sentences:[...base.sentences,...c1Language.sentences],
  lexicalChunks:[...base.lexicalChunks,...c1Language.lexicalChunks],
  canDos:[...base.canDos,...c1Course.canDos],
  courseUnits:[...base.courseUnits,...c1Course.courseUnits],
  readingTexts:[...base.readingTexts,...c1Course.readingTexts],
  productiveTasks:[...base.productiveTasks,...c1Course.productiveTasks]
};

const sensesByLexeme = new Map<string,Sense>();
for (const sense of coreContent.senses) {
  if (!sensesByLexeme.has(sense.lexemeId)) sensesByLexeme.set(sense.lexemeId,sense);
}
const kanjiById = new Map(coreContent.kanji.map((item)=>[item.id,item] as const));
const audioById = new Map(coreContent.audioAssets.map((item)=>[item.id,item] as const));
const grammarById = new Map(coreContent.grammar.map((item)=>[item.id,item] as const));
const sentenceById = new Map(coreContent.sentences.map((item)=>[item.id,item] as const));
const canDoById = new Map(coreContent.canDos.map((item)=>[item.id,item] as const));
const courseUnitById = new Map(coreContent.courseUnits.map((item)=>[item.id,item] as const));
const readingTextById = new Map(coreContent.readingTexts.map((item)=>[item.id,item] as const));
const productiveTaskById = new Map(coreContent.productiveTasks.map((item)=>[item.id,item] as const));
const lexicalChunkById = new Map(coreContent.lexicalChunks.map((item)=>[item.id,item] as const));
const sourceTitles = new Map((rawRegistry.sources as Array<{id:string;title:string}>).map((source)=>[source.id,source.title] as const));

export function senseForLexeme(lexeme:Lexeme):Sense {
  const sense=sensesByLexeme.get(lexeme.id);
  if(!sense)throw new Error(`MISSING_SENSE:${lexeme.id}`);
  return sense;
}

export function kanjiForLexeme(lexeme:Lexeme):Kanji[] {
  return lexeme.kanjiLinks.map((link)=>kanjiById.get(link.kanjiId)).filter((item):item is Kanji=>Boolean(item));
}

export function audioForLexeme(lexeme:Lexeme):AudioAssetRecord[] { return lexeme.audioIds.map((id)=>audioById.get(id)).filter((item):item is AudioAssetRecord=>Boolean(item)); }

export function audioAsset(id:string):AudioAssetRecord { const asset=audioById.get(id); if(!asset)throw new Error(`MISSING_AUDIO:${id}`); return asset; }

export function grammarConcept(id:string):GrammarConcept { const item=grammarById.get(id); if(!item)throw new Error(`MISSING_GRAMMAR:${id}`); return item; }
export function sentenceRecord(id:string):Sentence { const item=sentenceById.get(id); if(!item)throw new Error(`MISSING_SENTENCE:${id}`); return item; }
export function canDoDescriptor(id:string):CanDoDescriptor { const item=canDoById.get(id); if(!item)throw new Error(`MISSING_CAN_DO:${id}`); return item; }
export function courseUnit(id:string):CourseUnit { const item=courseUnitById.get(id); if(!item)throw new Error(`MISSING_COURSE_UNIT:${id}`); return item; }
export function readingText(id:string):ReadingText { const item=readingTextById.get(id); if(!item)throw new Error(`MISSING_READING_TEXT:${id}`); return item; }
export function productiveTask(id:string):ProductiveTask { const item=productiveTaskById.get(id); if(!item)throw new Error(`MISSING_PRODUCTIVE_TASK:${id}`); return item; }
export function lexicalChunk(id:string):LexicalChunk { const item=lexicalChunkById.get(id); if(!item)throw new Error(`MISSING_LEXICAL_CHUNK:${id}`); return item; }
export const gradedReadingTexts=[...coreContent.readingTexts];
export const productiveTasks=[...coreContent.productiveTasks];
export const lexicalChunks=[...coreContent.lexicalChunks].sort((a,b)=>(a.priority??999)-(b.priority??999));
export const a1CourseUnits=[...coreContent.courseUnits].sort((a,b)=>a.order-b.order);
export const a1Grammar=[...coreContent.grammar].sort((a,b)=>(a.priority??999)-(b.priority??999));

export function sourceTitle(sourceId:string):string {
  return sourceTitles.get(sourceId) ?? sourceId;
}

export const starterLexemes = [...coreContent.lexemes].sort((a,b)=>(a.priority??Number.MAX_SAFE_INTEGER)-(b.priority??Number.MAX_SAFE_INTEGER));
