import type { EntityRef } from "@thiepn/domain";

export interface ProvenancedContent {
  sourceIds: string[];
}

export interface Lexeme extends ProvenancedContent {
  id: string;
  canonicalForm: string;
  forms: OrthographicForm[];
  readings: Reading[];
  senseIds: string[];
  kanjiLinks: KanjiLexemeLink[];
  tags?: string[];
  priority?: number;
}

export interface OrthographicForm {
  text: string;
  script?: "hiragana" | "katakana" | "kanji" | "mixed" | "latin" | string;
  status?: string;
}

export interface Reading {
  text: string;
  restrictedToForms?: string[];
}

export interface KanjiLexemeLink {
  kanjiId: string;
  position: number;
  readingInWord?: string;
  readingNote?: string;
}

export interface Sense extends ProvenancedContent {
  id: string;
  lexemeId: string;
  glosses: string[];
  partOfSpeech?: string[];
}

export interface Kanji extends ProvenancedContent {
  id: string;
  literal: string;
  meanings: string[];
}

export interface GrammarConcept extends ProvenancedContent {
  id: string;
  label: string;
  prerequisiteIds: string[];
  contrastIds: string[];
}

export interface Sentence extends ProvenancedContent {
  id: string;
  text: string;
  normalizedText: string;
  entityRefs: EntityRef[];
}

export interface SeedGrammarRecord extends ProvenancedContent {
  id: string;
  label: string;
  summary: string;
}

export interface SeedSentenceRecord extends ProvenancedContent {
  id: string;
  text: string;
}

export interface ContentSeedPackage {
  schemaVersion: number;
  version: string;
  sourceIds: string[];
  lexemes: Lexeme[];
  senses: Sense[];
  kanji: Kanji[];
  grammar: SeedGrammarRecord[];
  sentences: SeedSentenceRecord[];
}

export interface LicensePolicy {
  canStore: boolean;
  canTransform: boolean;
  canRedistributeRaw: boolean;
  canRedistributeDerived: boolean;
  canUseCommercially: boolean | null;
  requiresAttribution: boolean;
  requiresShareAlike: boolean;
  requiresPerItemCredit: boolean;
  privateOnly: boolean;
  verifiedAt?: string;
}
export interface SourceRecord {
  id: string;
  title: string;
  roles: string[];
  version?: string;
  licenseName?: string;
  canonicalUrl?: string;
  policy: LicensePolicy;
}
