import type { EntityRef } from "@thiepn/domain";

export interface ProvenancedContent { sourceIds:string[]; }

export type InflectionClass =
  | "ichidan" | "godan" | "irregular-suru" | "irregular-kuru" | "irregular-aru"
  | "i-adjective" | "i-adjective-ii" | "na-adjective";

export interface Lexeme extends ProvenancedContent {
  id:string; canonicalForm:string; forms:OrthographicForm[]; readings:Reading[]; senseIds:string[];
  kanjiLinks:KanjiLexemeLink[]; audioIds:string[]; tags?:string[]; priority?:number; inflectionClass?:InflectionClass;
}
export interface OrthographicForm { text:string; script?:"hiragana"|"katakana"|"kanji"|"mixed"|"latin"|string; status?:string; }
export interface Reading { text:string; restrictedToForms?:string[]; }
export interface KanjiLexemeLink { kanjiId:string; position:number; readingInWord?:string; readingNote?:string; }
export interface Sense extends ProvenancedContent { id:string; lexemeId:string; glosses:string[]; partOfSpeech?:string[]; }
export interface Kanji extends ProvenancedContent { id:string; literal:string; meanings:string[]; }

export interface AudioAssetRecord extends ProvenancedContent {
  id:string; kind:"word"|"perception"|"sentence"; text:string; reading?:string; language:string;
  format:"ogg"|"mp3"|"wav"; url:string; credit:string; accent?:string; speaker?:string;
}

export interface GrammarConcept extends ProvenancedContent {
  id:string; label:string; summary:string; mentalModel:string; formation:string[]; uses:string[];
  prerequisiteIds:string[]; contrastIds:string[]; level:string; register:string; priority?:number; tags?:string[];
}

export interface SentenceToken {
  surface:string; reading?:string; entityRef?:EntityRef; grammarRole?:string;
}
export interface Sentence extends ProvenancedContent {
  id:string; text:string; normalizedText:string; reading?:string; translation:string;
  level:string; register:string; grammarIds:string[]; entityRefs:EntityRef[]; tokens:SentenceToken[]; tags?:string[];
}

export type LanguageActivity="listening"|"reading"|"spoken_interaction"|"spoken_production"|"writing";
export interface CanDoDescriptor extends ProvenancedContent {
  id:string; statement:string; level:string; languageActivity:LanguageActivity;
  grammarIds:string[]; sentenceIds:string[]; prerequisiteIds:string[];
}
export interface CourseUnit extends ProvenancedContent {
  id:string; title:string; order:number; level:string; canDoId:string; prerequisiteUnitIds:string[];
  grammarIds:string[]; sentenceIds:string[]; vocabularyIds:string[]; conjugationLexemeIds?:string[];
}

export interface ContentSeedPackage {
  schemaVersion:number; version:string; sourceIds:string[]; lexemes:Lexeme[]; senses:Sense[]; kanji:Kanji[];
  audioAssets:AudioAssetRecord[]; grammar:GrammarConcept[]; sentences:Sentence[]; canDos:CanDoDescriptor[]; courseUnits:CourseUnit[];
}

export interface LicensePolicy {
  canStore:boolean; canTransform:boolean; canRedistributeRaw:boolean; canRedistributeDerived:boolean;
  canUseCommercially:boolean|null; requiresAttribution:boolean; requiresShareAlike:boolean;
  requiresPerItemCredit:boolean; privateOnly:boolean; verifiedAt?:string;
}
export interface SourceRecord {
  id:string; title:string; roles:string[]; version?:string; licenseName?:string; canonicalUrl?:string; policy:LicensePolicy;
}
