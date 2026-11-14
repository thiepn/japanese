import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';

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
  assert(/not (?:claimed|a|been|conducted|executed)|not yet|no learner results/i.test(s));
 }
 assert(guide.includes('consent')&&/do not reveal|without feedback/i.test(guide));
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


test('forensic SHA-256 identities and unapproved human signoff are explicit',()=>{
 const report=proto('audio-review/ORIGINAL_AUDIO_EVIDENCE.md');
 const human=proto('audio-review/HUMAN_AUDIO_SIGNOFF.md');
 const hashes=[
  '37d8b51acbdec5f1a4768520c4ad94a14f21f1230f33a2d7f50406ca9b32aff6',
  '39a55eee1bd2dbacbee318c7c7a4f499d905b909dcf0b3400961b1142801e9f2',
  '45abe18943e57e1d0bbe68e57a2a617f2ce917b5af44baf1e057390d292b231d',
  'd529d33b371fd63b3edeb2e3be5e785d90d4fba66281be9b55076a477a3ee297',
  'daafc582b17287df5707038bdd08e43754e44c03b08b723e2afa81015155c198'
 ];
 for(const hash of hashes)assert(report.includes(hash));
 assert(report.includes('HARD GATE'));
 assert(human.includes('No approval has been obtained'));
 assert(human.includes('PENDING'));
 assert(!/- \[[xX]\]/.test(human),'a human approval must never be prechecked');
});
test('prototype repository does not bundle reviewed-but-unapproved media binaries',()=>{
 const root=new URL('../',import.meta.url);
 const visit=url=>{
  for(const entry of readdirSync(url,{withFileTypes:true})){
   if(entry.isDirectory())visit(new URL(entry.name+'/',url));
   else assert(!/\.(ogg|oga|wav|mp3|m4a|opus)$/i.test(entry.name),'unexpected shipped audio: '+entry.name);
  }
 };
 visit(root);
});


test('crop/gain decision matrix is review-only, source-hash-pinned and explicitly non-phonetic',()=>{
 const decisions=proto('audio-review/ACOUSTIC_CROP_GAIN_DECISIONS.md');
 assert(decisions.includes('UNAPPROVED'));
 assert(decisions.includes('NOT')&&decisions.includes('speech'));
 for(const kana of ['あ','い','う','え','お'])assert(decisions.includes(kana));
 assert(decisions.includes('twenty unapproved')||decisions.includes('twenty unapproved test derivatives'));
 assert(decisions.includes('No deployment')||decisions.includes('no Account'));
 const script=readFileSync(new URL('../../../scripts/kana-foundations-acoustic-review.py',import.meta.url),'utf8');
 assert(script.includes('same_phoneme_or_repetition_identity_verified'));
 assert(script.includes('REVIEW_ONLY'));
 const upstream=readFileSync(new URL('../../../scripts/kana-foundations-audio-evidence.py',import.meta.url),'utf8');
 assert(upstream.includes('PINNED_ORIGINALS'));
 assert(upstream.includes('Unapproved original upload-version change'));
 for(const hash of [
  '37d8b51acbdec5f1a4768520c4ad94a14f21f1230f33a2d7f50406ca9b32aff6',
  '39a55eee1bd2dbacbee318c7c7a4f499d905b909dcf0b3400961b1142801e9f2',
  '45abe18943e57e1d0bbe68e57a2a617f2ce917b5af44baf1e057390d292b231d',
  'd529d33b371fd63b3edeb2e3be5e785d90d4fba66281be9b55076a477a3ee297',
  'daafc582b17287df5707038bdd08e43754e44c03b08b723e2afa81015155c198'
 ])assert(upstream.includes(hash));
});
