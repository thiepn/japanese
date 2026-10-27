import fs from 'node:fs';
import path from 'node:path';

// Legacy Kana URLs now enter the original Japanese shell. All indexedDB records
// remain on this origin; redirecting the old page does not move or delete them.
const compiled=path.resolve('apps/kana-studio/dist/index.html');
if(!fs.existsSync(compiled))throw Error('KANA_STUDIO_BUILD_MISSING');
const target=path.resolve('apps/web/dist/kana');
fs.mkdirSync(target,{recursive:true});
fs.writeFileSync(path.join(target,'index.html'),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Japanese · Kana</title>
<script>var view=new URLSearchParams(location.search).get("view")||"home";var allowed=["home","learn","review","words","chart"];if(!allowed.includes(view))view="home";location.replace("/japanese/?kana=resume&kanaView="+encodeURIComponent(view));</script>
<noscript><meta http-equiv="refresh" content="0;url=/japanese/"></noscript></head>
<body><p>Continue in <a href="/japanese/">Japanese</a>.</p></body></html>`,'utf8');
console.log('Legacy /japanese/kana/ redirects into the Japanese app.');
