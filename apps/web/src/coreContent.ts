import type { AudioAssetRecord, ContentSeedPackage, Kanji, Lexeme, Sense } from "@thiepn/content-schema";
import rawContent from "../../../content/seed/jp-core.json";
import rawRegistry from "../../../content/sources/registry.json";

export const coreContent = rawContent as unknown as ContentSeedPackage;

const sensesByLexeme = new Map<string,Sense>();
for (const sense of coreContent.senses) {
  if (!sensesByLexeme.has(sense.lexemeId)) sensesByLexeme.set(sense.lexemeId,sense);
}
const kanjiById = new Map(coreContent.kanji.map((item)=>[item.id,item] as const));
const audioById = new Map(coreContent.audioAssets.map((item)=>[item.id,item] as const));
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

export function sourceTitle(sourceId:string):string {
  return sourceTitles.get(sourceId) ?? sourceId;
}

export const starterLexemes = [...coreContent.lexemes].sort((a,b)=>(a.priority??Number.MAX_SAFE_INTEGER)-(b.priority??Number.MAX_SAFE_INTEGER));
