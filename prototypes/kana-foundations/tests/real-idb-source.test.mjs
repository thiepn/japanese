import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const source=[
 ['packages/sync-protocol/src/index.ts','sync-protocol.mjs'],
 ['packages/local-db/src/index.ts','local-db.mjs']
];
test('Node 24 type-strips EXACT production sources to syntax-valid disposable browser ESM without changing input',()=>{
 const original=source.map(([src])=>readFileSync(resolve(root,src)));
 const out=execFileSync(process.execPath,[resolve(root,'prototypes/kana-foundations/qualification/prepare-real-idb.mjs')],{cwd:root,encoding:'utf8'});
 assert.match(out,/REAL_IDB_BROWSER_HARNESS_SOURCE_SHA256/);
 const base=resolve(root,'prototypes/kana-foundations/.real-idb-harness');
 const manifest=JSON.parse(readFileSync(resolve(base,'provenance.json'),'utf8'));
 assert.equal(manifest.reviewOnly,true);
 assert.equal(manifest.productionCodeModified,false);
 for(let i=0;i<source.length;i++){
  const [path,target]=source[i],actual=readFileSync(resolve(root,path));
  assert.deepEqual(actual,original[i],'production source changed unexpectedly');
  const sha=createHash('sha256').update(actual).digest('hex');
  assert.equal(manifest.modules[i].sha256,sha);
  const generated=readFileSync(resolve(base,target),'utf8');
  assert(generated.includes('// SOURCE_SHA256 '+sha));
  assert(!/from ["']@thiepn\//.test(generated),'unresolved production workspace import');
  execFileSync(process.execPath,['--check',resolve(base,target)],{cwd:root});
 }
});
