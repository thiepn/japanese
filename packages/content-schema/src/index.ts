import type { EntityRef } from "@thiepn/domain";

export interface Lexeme { id: string; canonicalForm: string; forms: OrthographicForm[]; readings: Reading[]; senseIds: string[]; }
export interface OrthographicForm { text: string; script?: string; status?: string; }
export interface Reading { text: string; restrictedToForms?: string[]; }
export interface Sense { id: string; glosses: string[]; partOfSpeech?: string[]; }
export interface GrammarConcept { id: string; label: string; prerequisiteIds: string[]; contrastIds: string[]; }
export interface Sentence { id: string; text: string; normalizedText: string; entityRefs: EntityRef[]; }

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
