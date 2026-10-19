import {describe,expect,it} from "vitest";
import {readFileSync,statSync} from "node:fs";
import {coreContent} from "../../apps/web/src/coreContent";
import {VOCABULARY_VISUALS,validateVocabularyVisuals,vocabularyVisualForLexeme} from "../../apps/web/src/study/vocabVisuals";

describe("Japanese beginner vocabulary illustrations",()=>{
 const ids=new Set(coreContent.lexemes.map(v=>v.id));
 it("uses canonical Japanese IDs and ships only small original local SVGs",()=>{
   expect(VOCABULARY_VISUALS).toHaveLength(8);
   expect(validateVocabularyVisuals(ids)).toEqual([]);
   for(const item of VOCABULARY_VISUALS){
     const file=new URL(`../../apps/web/public/vocab/${item.file}`,import.meta.url);
     const text=readFileSync(file,"utf8");
     expect(statSync(file).size).toBeLessThan(8192);
     expect(text).toContain('viewBox="0 0 320 240"');
     expect(text).not.toMatch(/<script|<foreignObject|<image|(?:href|src)="https?:\/\//i);
     expect(vocabularyVisualForLexeme(item.lexemeId)).toEqual(item);
   }
 });
 it("leaves unsupported words unillustrated",()=>{expect(vocabularyVisualForLexeme("missing")).toBeNull();expect(vocabularyVisualForLexeme("lex-taberu")).toBeNull();});
 it("rejects broken mappings and missing accessibility labels",()=>{
   const bad=[{...VOCABULARY_VISUALS[0],lexemeId:"not-real",file:"../bad.svg",alt:""}];
   expect(validateVocabularyVisuals(ids,bad)).toEqual(expect.arrayContaining([expect.stringContaining("Unknown canonical lexeme"),expect.stringContaining("Unsafe image filename"),expect.stringContaining("Missing accessible description")]));
   expect(validateVocabularyVisuals(ids,[VOCABULARY_VISUALS[0],VOCABULARY_VISUALS[0]])).toEqual(expect.arrayContaining([expect.stringContaining("Duplicate image ID")]));
 });
});
