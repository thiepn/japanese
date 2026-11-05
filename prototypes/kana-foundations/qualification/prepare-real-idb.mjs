/**
 * Compile the EXACT checked-out production local-db and sync-protocol sources
 * to temporary browser ESM. No mocks, no source edits and no canonical writes.
 * The Playwright localhost browser context uses disposable synthetic account IDs.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../..');
const dest=resolve(root,'prototypes/kana-foundations/.real-idb-harness');
const modules=[
 ['packages/sync-protocol/src/index.ts','sync-protocol.mjs'],
 ['packages/local-db/src/index.ts','local-db.mjs']
];
mkdirSync(dest,{recursive:true});
const manifest={reviewOnly:true,productionCodeModified:false,bundledDate:null,modules:[]};
for(const [source,target] of modules){
 const text=readFileSync(resolve(root,source),'utf8');
 const sha256=createHash('sha256').update(text).digest('hex');
 const output=ts.transpileModule(text,{fileName:source,reportDiagnostics:true,
  compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,
   verbatimModuleSyntax:true,importsNotUsedAsValues:ts.ImportsNotUsedAsValues?.Remove}
 });
 const errors=(output.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);
 if(errors.length)throw Error(source+' transpile errors: '+errors.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join(' | '));
 let js=output.outputText;
 if(target==='local-db.mjs'){
  if(!js.includes('from "@thiepn/sync-protocol"')&&!js.includes("from '@thiepn/sync-protocol'"))
   throw Error('Production sync-protocol import shape changed: fail closed');
  js=js.replace(/from ["']@thiepn\/sync-protocol["']/g,'from "./sync-protocol.mjs"');
 }
 if(/from ["']@thiepn\//.test(js)||/import\(["']@thiepn\//.test(js))
  throw Error('Unresolved runtime workspace import in generated browser module '+source);
 const signature='// GENERATED FROM EXACT PRODUCTION SOURCE; DO NOT COMMIT OR SHIP\n'
  +'// SOURCE_SHA256 '+sha256+'\n';
 writeFileSync(resolve(dest,target),signature+js,'utf8');
 manifest.modules.push({source,target,sha256,bytes:text.length});
}
writeFileSync(resolve(dest,'provenance.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('REAL_IDB_BROWSER_HARNESS_SOURCE_SHA256 '+manifest.modules.map(m=>m.source+'='+m.sha256).join(' '));
