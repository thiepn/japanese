import {describe,expect,it} from "vitest";
import {readFileSync,statSync} from "node:fs";
import {coreContent} from "../../apps/web/src/coreContent";
import {VOCABULARY_VISUALS,validateVocabularyVisuals,vocabularyVisualForLexeme} from "../../apps/web/src/study/vocabVisuals";

describe("Japanese beginner vocabulary illustrations",()=>{
 const ids=new Set(coreContent.lexemes.map(v=>v.id));
 it("uses canonical Japanese IDs and ships only small original local SVGs",()=>{
   expect(VOCABULARY_VISUALS).toHaveLength(103);
   expect(validateVocabularyVisuals(ids)).toEqual([]);
   for(const item of VOCABULARY_VISUALS){
     const file=new URL(`../../apps/web/public/vocab/${item.file}`,import.meta.url);
     const text=readFileSync(file,"utf8");
     expect(statSync(file).size).toBeLessThan(8192);
     expect(text).toContain('viewBox="0 0 320 240"');
     expect(text).not.toMatch(/<(?:script|foreignObject|image|iframe|object|embed|style|use|a)\b|\son[a-z]+\s*=|\shref\s*=|url\s*\(/i);
     expect(vocabularyVisualForLexeme(item.lexemeId)).toEqual(item);
   }
 });
 it("requires stable safe picture IDs that exactly match local file basenames",()=>{
   const changed=[{...VOCABULARY_VISUALS[0],id:"../wrong",file:"apple.svg"}];
   expect(validateVocabularyVisuals(ids,changed)).toEqual(expect.arrayContaining([
     expect.stringContaining("Unsafe image ID"),
     expect.stringContaining("Mismatched image ID/file")
   ]));
   const misfile=[{...VOCABULARY_VISUALS[0],file:"book.svg"}];
   expect(validateVocabularyVisuals(ids,misfile)).toEqual(expect.arrayContaining([
     expect.stringContaining("Mismatched image ID/file")
   ]));
 });
 it("represents quiet with a visible hush gesture rather than decorative symbols",()=>{
   expect(vocabularyVisualForLexeme("lex-shizuka")?.file).toBe("quiet.svg");
   expect(vocabularyVisualForLexeme("lex-shizuka")?.alt).toContain("finger to their lips");
 });
 it("leaves unsupported words unillustrated",()=>{expect(vocabularyVisualForLexeme("missing")).toBeNull();expect(vocabularyVisualForLexeme("lex-ue")).toBeNull();});
 it("rejects broken mappings and missing accessibility labels",()=>{
   const bad=[{...VOCABULARY_VISUALS[0],lexemeId:"not-real",file:"../bad.svg",alt:""}];
   expect(validateVocabularyVisuals(ids,bad)).toEqual(expect.arrayContaining([expect.stringContaining("Unknown canonical lexeme"),expect.stringContaining("Unsafe image filename"),expect.stringContaining("Missing accessible description")]));
   expect(validateVocabularyVisuals(ids,[VOCABULARY_VISUALS[0],VOCABULARY_VISUALS[0]])).toEqual(expect.arrayContaining([expect.stringContaining("Duplicate image ID")]));
 });
 it("preserves old visual IDs and maps all 43 additions to enrolled A1/A2 course words",()=>{
   expect(VOCABULARY_VISUALS.slice(0,8).map(entry=>entry.id)).toEqual(["apple","water","tea","book","car","bread","fish","coffee"]);
   const unitIds=new Set(coreContent.courseUnits.filter(unit=>unit.level==="A1"||unit.level==="A2").flatMap(unit=>unit.vocabularyIds));
   for(const entry of VOCABULARY_VISUALS.slice(8))expect(unitIds.has(entry.lexemeId)).toBe(true);
   expect(new Set(VOCABULARY_VISUALS.map(entry=>entry.lexemeId)).size).toBe(103);
 });
 it("maps every Phase 3 image to an original A1/A2 lexical source without adding a grading hint",()=>{
   const unitIds=new Set(coreContent.courseUnits.filter(unit=>unit.level==="A1"||unit.level==="A2").flatMap(unit=>unit.vocabularyIds));
   const additions=VOCABULARY_VISUALS.slice(51);
   expect(additions).toHaveLength(52);
   for(const entry of additions)expect(unitIds.has(entry.lexemeId)).toBe(true);
   expect(new Set(VOCABULARY_VISUALS.map(entry=>entry.file)).size).toBe(VOCABULARY_VISUALS.length);
 });
 it("keeps revised related directional and condition illustrations distinct and correctly described",()=>{
   const expected:Record<string,string>={
     board:"train doorway to board",
     "get-off":"out of a train doorway",
     near:"close together",
     far:"long distance",
     walk:"walking stride",
     new:"clean new shoe",
     old:"worn shoe",
     shop:"striped awning",
     meeting:"discussing documents",
     rest:"reclining on a sofa"
   };
   for(const [id,fragment] of Object.entries(expected)){
     const visual=VOCABULARY_VISUALS.find(entry=>entry.id===id);
     expect(visual?.alt).toContain(fragment);
   }
   expect(VOCABULARY_VISUALS).toHaveLength(103);
 });
 it("keeps three original VOC8 action scenes semantically labeled",()=>{
   const descriptions:Record<string,string>={
     eat:"bringing food from a plate to their mouth",
     drink:"lifting a tilted cup to drink",
     "wake-up":"sitting up and stretching in bed"
   };
   for(const [id,phrase] of Object.entries(descriptions)){
     const visual=VOCABULARY_VISUALS.find(entry=>entry.id===id);
     expect(visual?.alt).toContain(phrase);
     expect(visual?.file).toBe(id+".svg");
   }
   expect(VOCABULARY_VISUALS).toHaveLength(103);
 });
});
