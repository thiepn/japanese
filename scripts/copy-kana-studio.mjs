import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Retain existing browser origin and IndexedDB; only the mount path varies.
export function resolveKanaPublicBase(value = '/') {
  if (typeof value !== 'string' || !/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(value)) {
    throw Error('KANA_PUBLIC_BASE_INVALID');
  }
  return value;
}

export function renderKanaLegacyRedirect(rawBase = process.env.VITE_PUBLIC_BASE?.trim() || '/') {
  const base = resolveKanaPublicBase(rawBase);
  return [
    '<!doctype html>',
    '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Japanese · Kana</title>',
    '<script>var base=' + JSON.stringify(base) + ';var view=new URLSearchParams(location.search).get("view")||"home";var allowed=["home","learn","review","words","chart"];if(!allowed.includes(view))view="home";location.replace(base+"?kana=resume&kanaView="+encodeURIComponent(view));</script>',
    '<noscript><meta http-equiv="refresh" content="0;url=' + base + '"></noscript></head>',
    '<body><p>Continue in <a href="' + base + '">Japanese</a>.</p></body></html>',
  ].join('\n');
}

export function writeKanaLegacyRedirect(rawBase = process.env.VITE_PUBLIC_BASE?.trim() || '/') {
  const compiled = path.resolve('apps/kana-studio/dist/index.html');
  if (!fs.existsSync(compiled)) throw Error('KANA_STUDIO_BUILD_MISSING');
  const target = path.resolve('apps/web/dist/kana');
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'index.html'), renderKanaLegacyRedirect(rawBase), 'utf8');
  console.log('Legacy ' + resolveKanaPublicBase(rawBase) + 'kana/ redirects into the Japanese app.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeKanaLegacyRedirect();
}
