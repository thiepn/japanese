import { readFile } from "node:fs/promises";

interface RegistrySource { id:string; title:string; publicExport:boolean; license:string; }
interface Registry { sources:RegistrySource[]; }
interface Manifest { id:string; sources?:string[]; }
interface Provenanced { id:string; sourceIds?:string[]; }
interface LexemeRecord extends Provenanced { audioIds?:string[]; }
interface AudioRecord extends Provenanced { kind?:string; credit?:string; licenseName?:string; attributionUrl?:string; nativeSpeaker?:boolean; }
interface GrammarRecord extends Provenanced { prerequisiteIds?:string[]; contrastIds?:string[]; }
interface EntityRef { kind:string; id:string; }
interface SentenceRecord extends Provenanced { grammarIds?:string[]; entityRefs?:EntityRef[]; }
interface CanDoRecord extends Provenanced { grammarIds?:string[]; sentenceIds?:string[]; prerequisiteIds?:string[]; }
interface CourseUnitRecord extends Provenanced { canDoId?:string; prerequisiteUnitIds?:string[]; grammarIds?:string[]; sentenceIds?:string[]; vocabularyIds?:string[]; conjugationLexemeIds?:string[]; }
interface ReadingSegmentRecord { id?:string; sentenceId?:string; startMs?:number; endMs?:number; }
interface ReadingTextRecord extends Provenanced { sentenceIds?:string[]; targetLexemeIds?:string[]; grammarIds?:string[]; audioMode?:string; audioAssetId?:string; listeningSegments?:ReadingSegmentRecord[]; }
interface LexicalChunkRecord extends Provenanced { lexemeIds?:string[]; grammarIds?:string[]; exampleSentenceIds?:string[]; expression?:string; meaning?:string; }
interface ProductiveTaskRecord extends Provenanced { targetGrammarIds?:string[]; targetLexemeIds?:string[]; targetChunkIds?:string[]; requiredTerms?:string[]; minimumCharacters?:number; mode?:string; }
interface Seed {
  sourceIds?:string[]; lexemes?:LexemeRecord[]; senses?:Provenanced[]; kanji?:Provenanced[]; audioAssets?:AudioRecord[];
  grammar?:GrammarRecord[]; sentences?:SentenceRecord[]; lexicalChunks?:LexicalChunkRecord[]; canDos?:CanDoRecord[]; courseUnits?:CourseUnitRecord[]; readingTexts?:ReadingTextRecord[]; productiveTasks?:ProductiveTaskRecord[];
}

const registry=JSON.parse(await readFile(new URL("../../../content/sources/registry.json",import.meta.url),"utf8")) as Registry;
const manifest=JSON.parse(await readFile(new URL("../../../content/manifests/jp-core.json",import.meta.url),"utf8")) as Manifest;
const baseSeed=JSON.parse(await readFile(new URL("../../../content/seed/jp-core.json",import.meta.url),"utf8")) as Seed;
const c1Lexicon=JSON.parse(await readFile(new URL("../../../content/seed/jp-c1-lexicon.json",import.meta.url),"utf8")) as Seed;
const c1Language=JSON.parse(await readFile(new URL("../../../content/seed/jp-c1-language.json",import.meta.url),"utf8")) as Seed;
const c1Course=JSON.parse(await readFile(new URL("../../../content/seed/jp-c1-course.json",import.meta.url),"utf8")) as Seed;
const seed:Seed={
  ...baseSeed,
  sourceIds:unique([...(baseSeed.sourceIds??[]),...(c1Lexicon.sourceIds??[]),...(c1Language.sourceIds??[]),...(c1Course.sourceIds??[])]),
  lexemes:[...(baseSeed.lexemes??[]),...(c1Lexicon.lexemes??[])],
  senses:[...(baseSeed.senses??[]),...(c1Lexicon.senses??[])],
  kanji:[...(baseSeed.kanji??[])],
  audioAssets:[...(baseSeed.audioAssets??[])],
  grammar:[...(baseSeed.grammar??[]),...(c1Language.grammar??[])],
  sentences:[...(baseSeed.sentences??[]),...(c1Language.sentences??[])],
  lexicalChunks:[...(baseSeed.lexicalChunks??[]),...(c1Language.lexicalChunks??[])],
  canDos:[...(baseSeed.canDos??[]),...(c1Course.canDos??[])],
  courseUnits:[...(baseSeed.courseUnits??[]),...(c1Course.courseUnits??[])],
  readingTexts:[...(baseSeed.readingTexts??[]),...(c1Course.readingTexts??[])],
  productiveTasks:[...(baseSeed.productiveTasks??[]),...(c1Course.productiveTasks??[])]
};
const sourceMap=new Map(registry.sources.map((source)=>[source.id,source]));
const manifestSources=new Set(manifest.sources ?? []);
const violations:string[]=[];

function validateSource(sourceId:string,where:string):void {
  const source=sourceMap.get(sourceId);
  if(!source) violations.push("Unknown source "+sourceId+" at "+where);
  else if(!source.publicExport) violations.push("Non-exportable source at "+where+": "+source.title+" ("+source.id+")");
  else if(!source.license.trim()) violations.push("Missing license at "+where+": "+source.title);
  if(!manifestSources.has(sourceId)) violations.push("Source "+sourceId+" used at "+where+" is missing from public manifest");
}
function requireRef(set:ReadonlySet<string>,id:string|undefined,where:string):void {
  if(!id||!set.has(id))violations.push("Unresolved reference "+String(id)+" at "+where);
}
function unique<T>(items:readonly T[]):T[]{return [...new Set(items)];}
function validateUniqueIds(items:readonly Provenanced[],collection:string):void {
  const seen=new Set<string>();
  for(const item of items){
    if(seen.has(item.id))violations.push("Duplicate id in "+collection+": "+item.id);
    seen.add(item.id);
  }
}

for(const sourceId of manifest.sources ?? []) validateSource(sourceId,"manifest");
for(const sourceId of seed.sourceIds ?? []) validateSource(sourceId,"seed package");

for(const [collection,items] of Object.entries({
  lexemes:seed.lexemes ?? [],senses:seed.senses ?? [],kanji:seed.kanji ?? [],audioAssets:seed.audioAssets ?? [],
  grammar:seed.grammar ?? [],sentences:seed.sentences ?? [],lexicalChunks:seed.lexicalChunks ?? [],canDos:seed.canDos ?? [],courseUnits:seed.courseUnits ?? [],readingTexts:seed.readingTexts ?? [],productiveTasks:seed.productiveTasks ?? []
})) {
  for(const item of items) {
    if(!item.sourceIds?.length) violations.push("Missing provenance: "+collection+"/"+item.id);
    for(const sourceId of item.sourceIds ?? []) validateSource(sourceId,collection+"/"+item.id);
  }
}

for(const [collection,items] of Object.entries({
  lexemes:seed.lexemes ?? [],senses:seed.senses ?? [],kanji:seed.kanji ?? [],audioAssets:seed.audioAssets ?? [],
  grammar:seed.grammar ?? [],sentences:seed.sentences ?? [],lexicalChunks:seed.lexicalChunks ?? [],canDos:seed.canDos ?? [],
  courseUnits:seed.courseUnits ?? [],readingTexts:seed.readingTexts ?? [],productiveTasks:seed.productiveTasks ?? []
}))validateUniqueIds(items as Provenanced[],collection);

const lexemeIds=new Set((seed.lexemes ?? []).map((item)=>item.id));
const kanjiIds=new Set((seed.kanji ?? []).map((item)=>item.id));
const grammarIds=new Set((seed.grammar ?? []).map((item)=>item.id));
const sentenceIds=new Set((seed.sentences ?? []).map((item)=>item.id));
const canDoIds=new Set((seed.canDos ?? []).map((item)=>item.id));
const courseUnitIds=new Set((seed.courseUnits ?? []).map((item)=>item.id));
const audioIds=new Set((seed.audioAssets ?? []).map((item)=>item.id));
const lexicalChunkIds=new Set((seed.lexicalChunks ?? []).map((item)=>item.id));

for(const lexeme of seed.lexemes ?? []){
  for(const id of lexeme.audioIds ?? [])requireRef(audioIds,id,"lexemes/"+lexeme.id+"/audioIds");
}
for(const audio of seed.audioAssets ?? []){
  if(audio.sourceIds?.includes("tofugu-wanikani-audio")){
    if(audio.licenseName!=="CC BY-SA 4.0")violations.push("Tofugu/WaniKani audio must declare CC BY-SA 4.0: "+audio.id);
    if(!audio.attributionUrl)violations.push("Native audio missing attribution URL: "+audio.id);
    if(audio.nativeSpeaker!==true)violations.push("Tofugu/WaniKani source should be marked native-speaker audio: "+audio.id);
  }
}
for(const grammar of seed.grammar ?? []){
  for(const id of grammar.prerequisiteIds ?? [])requireRef(grammarIds,id,"grammar/"+grammar.id+"/prerequisiteIds");
  for(const id of grammar.contrastIds ?? [])requireRef(grammarIds,id,"grammar/"+grammar.id+"/contrastIds");
}
for(const sentence of seed.sentences ?? []){
  for(const id of sentence.grammarIds ?? [])requireRef(grammarIds,id,"sentences/"+sentence.id+"/grammarIds");
  for(const ref of sentence.entityRefs ?? []){
    if(ref.kind==="grammar")requireRef(grammarIds,ref.id,"sentences/"+sentence.id+"/entityRefs");
    else if(ref.kind==="lexeme")requireRef(lexemeIds,ref.id,"sentences/"+sentence.id+"/entityRefs");
    else if(ref.kind==="kanji")requireRef(kanjiIds,ref.id,"sentences/"+sentence.id+"/entityRefs");
  }
}
for(const chunk of seed.lexicalChunks ?? []){
  if(!chunk.expression?.trim())violations.push("Lexical chunk missing expression: "+chunk.id);
  if(!chunk.meaning?.trim())violations.push("Lexical chunk missing meaning: "+chunk.id);
  for(const id of chunk.lexemeIds ?? [])requireRef(lexemeIds,id,"lexicalChunks/"+chunk.id+"/lexemeIds");
  for(const id of chunk.grammarIds ?? [])requireRef(grammarIds,id,"lexicalChunks/"+chunk.id+"/grammarIds");
  for(const id of chunk.exampleSentenceIds ?? [])requireRef(sentenceIds,id,"lexicalChunks/"+chunk.id+"/exampleSentenceIds");
}
for(const canDo of seed.canDos ?? []){
  for(const id of canDo.grammarIds ?? [])requireRef(grammarIds,id,"canDos/"+canDo.id+"/grammarIds");
  for(const id of canDo.sentenceIds ?? [])requireRef(sentenceIds,id,"canDos/"+canDo.id+"/sentenceIds");
  for(const id of canDo.prerequisiteIds ?? [])requireRef(canDoIds,id,"canDos/"+canDo.id+"/prerequisiteIds");
}
for(const text of seed.readingTexts ?? []){
  for(const id of text.sentenceIds ?? [])requireRef(sentenceIds,id,"readingTexts/"+text.id+"/sentenceIds");
  for(const id of text.targetLexemeIds ?? [])requireRef(lexemeIds,id,"readingTexts/"+text.id+"/targetLexemeIds");
  for(const id of text.grammarIds ?? [])requireRef(grammarIds,id,"readingTexts/"+text.id+"/grammarIds");
  if(text.audioAssetId)requireRef(audioIds,text.audioAssetId,"readingTexts/"+text.id+"/audioAssetId");
  if(text.audioMode==="recorded"&&!text.audioAssetId)violations.push("Recorded reading text missing audioAssetId: "+text.id);
  const segmentIds=new Set<string>();
  let previousStart=-1;
  for(const segment of text.listeningSegments ?? []){
    if(!segment.id?.trim())violations.push("Reading text segment missing id: "+text.id);
    else if(segmentIds.has(segment.id))violations.push("Duplicate reading segment id: "+text.id+"/"+segment.id);
    else segmentIds.add(segment.id);
    requireRef(sentenceIds,segment.sentenceId,"readingTexts/"+text.id+"/listeningSegments");
    if(segment.sentenceId&&!text.sentenceIds?.includes(segment.sentenceId))violations.push("Reading segment references sentence outside text: "+text.id+"/"+segment.sentenceId);
    if(segment.startMs!==undefined||segment.endMs!==undefined){
      if(segment.startMs===undefined||segment.endMs===undefined||segment.startMs<0||segment.endMs<=segment.startMs)violations.push("Invalid reading segment timing: "+text.id+"/"+String(segment.id));
      if(segment.startMs!==undefined&&segment.startMs<previousStart)violations.push("Reading segments out of order: "+text.id);
      previousStart=segment.startMs??previousStart;
    }
  }
}
for(const task of seed.productiveTasks ?? []){
  for(const id of task.targetGrammarIds ?? [])requireRef(grammarIds,id,"productiveTasks/"+task.id+"/targetGrammarIds");
  for(const id of task.targetLexemeIds ?? [])requireRef(lexemeIds,id,"productiveTasks/"+task.id+"/targetLexemeIds");
  for(const id of task.targetChunkIds ?? [])requireRef(lexicalChunkIds,id,"productiveTasks/"+task.id+"/targetChunkIds");
  if(task.mode!=="writing"&&task.mode!=="speaking")violations.push("Invalid productive task mode: "+task.id);
  if((task.minimumCharacters??0)<1)violations.push("Productive task missing minimumCharacters: "+task.id);
  if(!(task.requiredTerms?.length))violations.push("Productive task missing requiredTerms: "+task.id);
}
for(const unit of seed.courseUnits ?? []){
  requireRef(canDoIds,unit.canDoId,"courseUnits/"+unit.id+"/canDoId");
  for(const id of unit.prerequisiteUnitIds ?? [])requireRef(courseUnitIds,id,"courseUnits/"+unit.id+"/prerequisiteUnitIds");
  for(const id of unit.grammarIds ?? [])requireRef(grammarIds,id,"courseUnits/"+unit.id+"/grammarIds");
  for(const id of unit.sentenceIds ?? [])requireRef(sentenceIds,id,"courseUnits/"+unit.id+"/sentenceIds");
  for(const id of unit.vocabularyIds ?? [])requireRef(lexemeIds,id,"courseUnits/"+unit.id+"/vocabularyIds");
  for(const id of unit.conjugationLexemeIds ?? [])requireRef(lexemeIds,id,"courseUnits/"+unit.id+"/conjugationLexemeIds");
}

const p12Counts={
  lexemes:(seed.lexemes??[]).filter((item)=>(item as LexemeRecord & {tags?:string[]}).tags?.includes("c1")).length,
  grammar:(seed.grammar??[]).filter((item)=>(item as GrammarRecord & {level?:string}).level==="C1").length,
  sentences:(seed.sentences??[]).filter((item)=>(item as SentenceRecord & {level?:string}).level==="C1").length,
  chunks:(seed.lexicalChunks??[]).filter((item)=>(item as LexicalChunkRecord & {level?:string}).level==="C1").length,
  canDos:(seed.canDos??[]).filter((item)=>(item as CanDoRecord & {level?:string}).level==="C1").length,
  units:(seed.courseUnits??[]).filter((item)=>(item as CourseUnitRecord & {level?:string}).level==="C1").length,
  texts:(seed.readingTexts??[]).filter((item)=>(item as ReadingTextRecord & {level?:string}).level==="C1").length,
  tasks:(seed.productiveTasks??[]).filter((item)=>(item as ProductiveTaskRecord & {level?:string}).level==="C1").length
};
const p12Minimums={lexemes:32,grammar:16,sentences:48,chunks:32,canDos:10,units:10,texts:8,tasks:12};
for(const [key,minimum] of Object.entries(p12Minimums)){
  const actual=p12Counts[key as keyof typeof p12Counts];
  if(actual<minimum)violations.push("P12 C1 foundation "+key+" below minimum: "+actual+" < "+minimum);
}
const c1Tasks=(seed.productiveTasks??[]).filter((item)=>(item as ProductiveTaskRecord & {level?:string}).level==="C1") as Array<ProductiveTaskRecord & {level?:string}>;
if(!c1Tasks.some((item)=>item.mode==="writing"))violations.push("P12 C1 foundation requires writing tasks");
if(!c1Tasks.some((item)=>item.mode==="speaking"))violations.push("P12 C1 foundation requires speaking tasks");

if(violations.length){
  console.error([...new Set(violations)].join("\n"));
  process.exitCode=1;
}else{
  console.log("Content license/provenance/reference validation passed for "+manifest.id+".");
}
