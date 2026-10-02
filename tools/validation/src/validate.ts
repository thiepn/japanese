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
interface ReadingTextRecord extends Provenanced { sentenceIds?:string[]; targetLexemeIds?:string[]; grammarIds?:string[]; audioMode?:string; audioAssetId?:string; }
interface Seed {
  sourceIds?:string[]; lexemes?:LexemeRecord[]; senses?:Provenanced[]; kanji?:Provenanced[]; audioAssets?:AudioRecord[];
  grammar?:GrammarRecord[]; sentences?:SentenceRecord[]; canDos?:CanDoRecord[]; courseUnits?:CourseUnitRecord[]; readingTexts?:ReadingTextRecord[];
}

const registry=JSON.parse(await readFile(new URL("../../../content/sources/registry.json",import.meta.url),"utf8")) as Registry;
const manifest=JSON.parse(await readFile(new URL("../../../content/manifests/jp-core.json",import.meta.url),"utf8")) as Manifest;
const seed=JSON.parse(await readFile(new URL("../../../content/seed/jp-core.json",import.meta.url),"utf8")) as Seed;
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

for(const sourceId of manifest.sources ?? []) validateSource(sourceId,"manifest");
for(const sourceId of seed.sourceIds ?? []) validateSource(sourceId,"seed package");

for(const [collection,items] of Object.entries({
  lexemes:seed.lexemes ?? [],senses:seed.senses ?? [],kanji:seed.kanji ?? [],audioAssets:seed.audioAssets ?? [],
  grammar:seed.grammar ?? [],sentences:seed.sentences ?? [],canDos:seed.canDos ?? [],courseUnits:seed.courseUnits ?? [],readingTexts:seed.readingTexts ?? []
})) {
  for(const item of items) {
    if(!item.sourceIds?.length) violations.push("Missing provenance: "+collection+"/"+item.id);
    for(const sourceId of item.sourceIds ?? []) validateSource(sourceId,collection+"/"+item.id);
  }
}

const lexemeIds=new Set((seed.lexemes ?? []).map((item)=>item.id));
const kanjiIds=new Set((seed.kanji ?? []).map((item)=>item.id));
const grammarIds=new Set((seed.grammar ?? []).map((item)=>item.id));
const sentenceIds=new Set((seed.sentences ?? []).map((item)=>item.id));
const canDoIds=new Set((seed.canDos ?? []).map((item)=>item.id));
const courseUnitIds=new Set((seed.courseUnits ?? []).map((item)=>item.id));
const audioIds=new Set((seed.audioAssets ?? []).map((item)=>item.id));

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
}
for(const unit of seed.courseUnits ?? []){
  requireRef(canDoIds,unit.canDoId,"courseUnits/"+unit.id+"/canDoId");
  for(const id of unit.prerequisiteUnitIds ?? [])requireRef(courseUnitIds,id,"courseUnits/"+unit.id+"/prerequisiteUnitIds");
  for(const id of unit.grammarIds ?? [])requireRef(grammarIds,id,"courseUnits/"+unit.id+"/grammarIds");
  for(const id of unit.sentenceIds ?? [])requireRef(sentenceIds,id,"courseUnits/"+unit.id+"/sentenceIds");
  for(const id of unit.vocabularyIds ?? [])requireRef(lexemeIds,id,"courseUnits/"+unit.id+"/vocabularyIds");
  for(const id of unit.conjugationLexemeIds ?? [])requireRef(lexemeIds,id,"courseUnits/"+unit.id+"/conjugationLexemeIds");
}

if(violations.length){
  console.error([...new Set(violations)].join("\n"));
  process.exitCode=1;
}else{
  console.log("Content license/provenance/reference validation passed for "+manifest.id+".");
}
