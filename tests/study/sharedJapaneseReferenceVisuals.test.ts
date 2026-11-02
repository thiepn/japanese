import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {coreContent} from "../../apps/web/src/coreContent";
import {VOCABULARY_VISUALS} from "../../apps/web/src/study/vocabVisuals";
import {SHARED_JAPANESE_CONCEPT_ROWS,sharedJapaneseReferenceForLexeme} from "../../apps/web/src/study/sharedJapaneseReferenceVisuals";

describe("Phase 6 Japanese J7 shared concept reference",()=>{
 it("maps 103 canonical lexemes and concepts to matching original images",()=>{
  expect(SHARED_JAPANESE_CONCEPT_ROWS).toHaveLength(103);
  for(const column of [0,1,2] as const)
   expect(new Set(SHARED_JAPANESE_CONCEPT_ROWS.map(row=>row[column])).size).toBe(103);
  const originals=new Map(VOCABULARY_VISUALS.map(row=>[row.lexemeId,row]));
  const canonical=new Set(coreContent.lexemes.map(row=>row.id));
  expect(originals.size).toBe(103);
  for(const [lexemeId,conceptId,asset,alt,originalBlobSha] of SHARED_JAPANESE_CONCEPT_ROWS){
   expect(canonical.has(lexemeId)).toBe(true);
   expect(originals.get(lexemeId)?.file).toBe(asset);
   expect(originals.get(lexemeId)?.alt).toBe(alt);
   expect(originals.get(lexemeId)?.rights).toBe("Original THIEPN illustration");
   expect(conceptId).toMatch(/^[a-z]+\.[a-z0-9-]+$/);
   expect(sharedJapaneseReferenceForLexeme(lexemeId)).toEqual({
    conceptId,asset,alt,originalBlobSha
   });
  }
 });
 it("preserves all 103 local SVG bytes against original source Git blob SHA",()=>{
  for(const [lexemeId,,asset,,originalBlobSha] of SHARED_JAPANESE_CONCEPT_ROWS){
   const bytes=readFileSync(new URL("../../apps/web/public/vocab/"+asset,import.meta.url));
   const sha=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
   expect(sha,lexemeId).toBe(originalBlobSha);
  }
 });
 it("fails closed on unsupported, private or similarly named vocabulary IDs",()=>{
  for(const id of ["","__proto__","constructor","lex-nonexistent","lex-ue","student","private-word-1"]){
   expect(sharedJapaneseReferenceForLexeme(id)).toBeNull();
  }
  expect(sharedJapaneseReferenceForLexeme("lex-ringo")?.conceptId).toBe("food.apple");
  expect(sharedJapaneseReferenceForLexeme("lex-mizu")?.conceptId).toBe("beverage.water");
  expect(sharedJapaneseReferenceForLexeme("lex-shizuka")?.conceptId).toBe("gesture.request-quiet");
 });
 it("only presents shared identifiers in J7 reference, preserving cache and graded study",()=>{
  const j7=readFileSync(new URL("../../apps/web/src/design/J7Library.tsx",import.meta.url),"utf8");
  const image=readFileSync(new URL("../../apps/web/src/study/VocabularyIllustration.tsx",import.meta.url),"utf8");
  const sw=readFileSync(new URL("../../apps/web/public/sw.js",import.meta.url),"utf8");
  const prompts=readFileSync(new URL("../../apps/web/src/study/vocabulary.ts",import.meta.url),"utf8");
  expect(j7).toContain("sharedJapaneseReferenceForLexeme(item.entity.id)");
  expect(j7).toContain("sharedConceptId={referenceConcept.conceptId}");
  expect(image).toContain("data-shared-concept-id={sharedConceptId}");
  expect(image).toContain("vocab/"+String.fromCharCode(36)+"{visual.file}");
  expect(sw).toContain("const MAX_VOCAB_IMAGES = 48;");
  expect(sw).toContain("vocab-v5");
  expect(sw).toContain('event.request.destination === "image"');
  expect(prompts).not.toContain("sharedJapaneseReference");
  expect(prompts).not.toContain("sharedConceptId");
 });
});
