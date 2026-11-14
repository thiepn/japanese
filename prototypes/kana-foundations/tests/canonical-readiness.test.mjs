import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyCanonicalCue,previewCanonicalAttempt} from '../qualification/canonical-readiness.mjs';

const lease={owner:'synthetic-owner',epoch:'12345678-1234-4234-9234-123456789abc'};
const prompt={id:'reverse-1',mode:'reverse',kanaIds:['h-a'],answer:'h-a',choices:['h-a','h-i','h-u','h-e','h-o'],correctionOf:null};
const registry={traceId:'kana:hiragana-あ:form_selection:sound-to-kana',
 primaryTarget:{kind:'kana',id:'hiragana-あ'},skill:'form_selection',cueFamily:'sound-to-kana',
 prompt:'a',displayAnswer:'あ',cardId:'h-a:rev',kanaId:'h-a'};
const attempt={attemptId:'synthetic-session:reverse-1:1',sessionId:'synthetic-session',
 promptId:'reverse-1',mode:'reverse',kanaIds:['h-a'],responseNormalized:'h-a',correct:true,
 assisted:false,assistanceLevel:'none',independent:true,correction:false,revealed:false,
 practiceOnly:true,canonicalEligible:false,canonicalGradeId:null};
const args=(overrides={})=>({attempt,prompt,registry,leaseAtStart:lease,currentLease:lease,
 existingAttemptIds:new Set(),...overrides});
test('source-readiness classifies only precisely identical form-selection cues',()=>{
 assert.equal(classifyCanonicalCue(prompt,registry).status,'EXACT_FORM_SELECTION_CANDIDATE');
 assert.equal(classifyCanonicalCue({...prompt,mode:'recognition',answer:'a'},registry).status,'UNMAPPED_CUE');
 assert.equal(classifyCanonicalCue({...prompt,mode:'sequence',kanaIds:['h-a','h-i','h-u'],answer:'aiu',choices:[]},registry).status,'UNMAPPED_CUE');
 assert.equal(classifyCanonicalCue(prompt,{...registry,skill:'reading',cueFamily:'kana-to-romaji-recall'}).status,'UNMAPPED_CUE');
 assert.equal(classifyCanonicalCue(prompt,{...registry,prompt:'e'}).status,'UNMAPPED_CUE');
 assert.equal(classifyCanonicalCue(prompt,{...registry,displayAnswer:'い'}).status,'UNMAPPED_CUE');
});
test('all existing S1 practice events remain strictly forbidden for canonical grading',()=>{
 const result=previewCanonicalAttempt(args());
 assert.deepEqual(result,{status:'BLOCKED',reason:'PRACTICE_ONLY',wouldWrite:false});
});
test('synthetic future independently qualified candidate is a PREVIEW only, never a write',()=>{
 const hypothetical={...attempt,practiceOnly:false,canonicalEligible:true};
 const once=previewCanonicalAttempt(args({attempt:hypothetical}));
 const twice=previewCanonicalAttempt(args({attempt:hypothetical}));
 assert.equal(once.status,'PREVIEW_CANDIDATE');
 assert.equal(once.wouldWrite,false);
 assert.equal(once.reason,'SYNTHETIC_PREVIEW_ONLY');
 assert.equal(once.dryRunKey,twice.dryRunKey,'key must be deterministic under same owner/attempt');
 assert(once.dryRunKey.startsWith('synthetic-preview:'));
});
test('duplicate attempt IDs are refused; retries may not silently double grade',()=>{
 const hypothetical={...attempt,practiceOnly:false,canonicalEligible:true};
 const seen=new Set([attempt.attemptId]);
 assert.equal(previewCanonicalAttempt(args({attempt:hypothetical,existingAttemptIds:seen})).reason,'DUPLICATE_ATTEMPT');
});
test('owner change and same-owner lease epoch rollover are both hard blocks',()=>{
 const hypothetical={...attempt,practiceOnly:false,canonicalEligible:true};
 assert.equal(previewCanonicalAttempt(args({attempt:hypothetical,currentLease:{owner:'second-owner',epoch:lease.epoch}})).reason,'OWNER_LEASE_CHANGED');
 assert.equal(previewCanonicalAttempt(args({attempt:hypothetical,currentLease:{owner:lease.owner,epoch:'another-epoch-12345678'}})).reason,'OWNER_LEASE_CHANGED');
 assert.equal(previewCanonicalAttempt(args({attempt:hypothetical,leaseAtStart:null})).reason,'OWNER_LEASE_MISSING');
});
test('assisted, incorrect, corrected, revealed and tampered events never become candidate grades',()=>{
 const source={...attempt,practiceOnly:false,canonicalEligible:true};
 const variants=[
  [{...source,assistanceLevel:'cue',independent:false},'ASSISTED_OR_CORRECTIVE'],
  [{...source,correct:false,independent:false},'NOT_INDEPENDENT_CORRECT'],
  [{...source,correction:true,independent:false},'ASSISTED_OR_CORRECTIVE'],
  [{...source,revealed:true,independent:false},'ASSISTED_OR_CORRECTIVE'],
  [{...source,canonicalGradeId:'existing'},'ALREADY_GRADED'],
  [{...source,responseNormalized:'h-e'},'RESPONSE_MISMATCH']
 ];
 for(const [candidate,reason] of variants)assert.equal(previewCanonicalAttempt(args({attempt:candidate})).reason,reason);
});
test('only pure synthetic read-only qualification files are used, never live scheduler modules',()=>{
 const src=readFileSync(new URL('../qualification/canonical-readiness.mjs',import.meta.url),'utf8');
 for(const banned of ['@thiepn/local-db','@thiepn/scheduler','gradeJapaneseKanaCard','gradeCard(','saveStudyReview(','indexedDB','localStorage','fetch('])
  assert(!src.includes(banned),'forbidden storage or scheduler dependency: '+banned);
 assert(src.includes('NO_WRITE'));
});
