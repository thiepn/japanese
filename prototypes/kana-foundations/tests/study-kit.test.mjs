import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const kit=name=>readFileSync(new URL('../usability-kit/'+name,import.meta.url),'utf8');
const proto=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

test('pilot score templates contain only headers, without fabricated learner records',()=>{
 for(const name of ['trial-scores.csv','session-observations.csv','reviewer-issues.csv']){
  const lines=kit(name).trim().split(/\r?\n/);
  assert.equal(lines.length,1,name+' must remain empty until genuine participant observations exist');
  const cols=lines[0].split(',');
  assert(cols.length>=12);
  assert.equal(new Set(cols).size,cols.length,name+' has duplicate field names');
 }
 const trial=kit('trial-scores.csv');
 for(const col of ['participant_code','session','trial_order','item_kind','item_display','outcome','independent_correct','assisted','answer_mode'])
  assert(trial.includes(col));
});
test('kit protocol aligns with primary protocol and separates genuine delayed recall',()=>{
 const guide=kit('FACILITATOR_GUIDE.md');
 const base=proto('BEGINNER_STUDY_PROTOCOL.md');
 for(const s of [guide,base]){
  assert(s.includes('24–48'), 'a genuinely delayed session is required');
  assert(s.includes('えう')&&s.includes('いお'),'the held-out kana decoding items must be consistent');
  assert(/not (?:claimed|a|been|conducted)|not yet/i.test(s));
 }
 assert(guide.includes('consent')&&guide.includes('without feedback'));
 assert(kit('PARTICIPANT_CARDS.md').includes('あ')&&kit('PARTICIPANT_CARDS.md').includes('お'));
});
test('rights review has five unique file-page candidates but no premature approval',()=>{
 const doc=kit('AUDIO_RIGHTS_REVIEW.md');
 const files=['Ja-A.oga','Japanese_I.ogg','Japanese_U.ogg','Ja-E.oga','Japanese_O.ogg'];
 for(const file of files){
  assert(doc.includes('https://commons.wikimedia.org/wiki/File:'+file));
 }
 assert(doc.includes('PENDING'));
 assert(doc.includes('Marugoto'));
 assert(doc.includes('No audio files')||doc.includes('No recordings acquired'));
});
