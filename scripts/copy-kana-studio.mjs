import fs from 'node:fs';
import path from 'node:path';
const from = path.resolve('apps/kana-studio/dist');
const to = path.resolve('apps/web/dist/kana');
if (!fs.existsSync(path.join(from, 'index.html'))) {
  throw new Error('KANA_STUDIO_BUILD_MISSING: build apps/kana-studio before packaging the Japanese site');
}
fs.cpSync(from, to, {recursive: true, force: true});
console.log('Kana Studio included at /japanese/kana/');
