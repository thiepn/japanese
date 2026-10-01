import { readFile } from "node:fs/promises";

interface RegistrySource { id:string; title:string; publicExport:boolean; license:string; }
interface Registry { sources:RegistrySource[]; }
interface Manifest { id:string; sources?:string[]; }
interface Provenanced { id:string; sourceIds?:string[]; }
interface Seed { sourceIds?:string[]; lexemes?:Provenanced[]; senses?:Provenanced[]; kanji?:Provenanced[]; audioAssets?:Provenanced[]; grammar?:Provenanced[]; sentences?:Provenanced[]; canDos?:Provenanced[]; courseUnits?:Provenanced[]; }

const registry=JSON.parse(await readFile(new URL("../../../content/sources/registry.json",import.meta.url),"utf8")) as Registry;
const manifest=JSON.parse(await readFile(new URL("../../../content/manifests/jp-core.json",import.meta.url),"utf8")) as Manifest;
const seed=JSON.parse(await readFile(new URL("../../../content/seed/jp-core.json",import.meta.url),"utf8")) as Seed;
const sourceMap=new Map(registry.sources.map((source)=>[source.id,source]));
const manifestSources=new Set(manifest.sources ?? []);
const violations:string[]=[];

function validateSource(sourceId:string,where:string):void {
  const source=sourceMap.get(sourceId);
  if(!source) violations.push(`Unknown source ${sourceId} at ${where}`);
  else if(!source.publicExport) violations.push(`Non-exportable source at ${where}: ${source.title} (${source.id})`);
  else if(!source.license.trim()) violations.push(`Missing license at ${where}: ${source.title}`);
  if(!manifestSources.has(sourceId)) violations.push(`Source ${sourceId} used at ${where} is missing from public manifest`);
}

for(const sourceId of manifest.sources ?? []) validateSource(sourceId,"manifest");
for(const sourceId of seed.sourceIds ?? []) validateSource(sourceId,"seed package");

for(const [collection,items] of Object.entries({
  lexemes:seed.lexemes ?? [],senses:seed.senses ?? [],kanji:seed.kanji ?? [],audioAssets:seed.audioAssets ?? [],grammar:seed.grammar ?? [],sentences:seed.sentences ?? [],canDos:seed.canDos ?? [],courseUnits:seed.courseUnits ?? []
})) {
  for(const item of items) {
    if(!item.sourceIds?.length) violations.push(`Missing provenance: ${collection}/${item.id}`);
    for(const sourceId of item.sourceIds ?? []) validateSource(sourceId,`${collection}/${item.id}`);
  }
}

if(violations.length){
  console.error([...new Set(violations)].join("\n"));
  process.exitCode=1;
}else{
  console.log(`Content license/provenance validation passed for ${manifest.id}.`);
}
