import { readFile } from "node:fs/promises";

interface RegistrySource { id:string; title:string; publicExport:boolean; license:string; }
interface Registry { sources:RegistrySource[]; }
interface Manifest { id:string; sources?:string[]; }

const registry=JSON.parse(await readFile(new URL("../../../content/sources/registry.json",import.meta.url),"utf8")) as Registry;
const manifest=JSON.parse(await readFile(new URL("../../../content/manifests/jp-core.json",import.meta.url),"utf8")) as Manifest;
const sourceMap=new Map(registry.sources.map((source)=>[source.id,source]));
const violations:string[]=[];
for (const sourceId of manifest.sources ?? []) {
  const source=sourceMap.get(sourceId);
  if (!source) violations.push(`Unknown source: ${sourceId}`);
  else if (!source.publicExport) violations.push(`Non-exportable source in public package: ${source.title} (${source.id})`);
  else if (!source.license.trim()) violations.push(`Missing license: ${source.title}`);
}
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode=1;
} else {
  console.log(`Content license validation passed for ${manifest.id}.`);
}
