/**
 * KP-PARITY qualification-only pure preview.
 * NO_WRITE: this is not a scheduler, event writer, adapter, or auth/lease provider.
 * All registry and lease inputs are synthetic in current tests.
 * It cannot issue a canonical grade under any circumstances.
 */
import {VOWELS} from '../engine.mjs';

const byId=new Map(VOWELS.map(v=>[v.id,v]));
const ownerPattern=/^[a-zA-Z0-9_-]{1,128}$/;
const epochPattern=/^[a-zA-Z0-9-]{16,80}$/;
const blocked=reason=>({status:'BLOCKED',reason,wouldWrite:false});

function validLease(value){
 return Boolean(value&&typeof value.owner==='string'&&ownerPattern.test(value.owner)
  &&typeof value.epoch==='string'&&epochPattern.test(value.epoch));
}
/** Exact synthetic cue equivalence, never recognition-choice or sequence equivalence. */
export function classifyCanonicalCue(prompt,registry){
 const mismatch={status:'UNMAPPED_CUE'};
 if(!prompt||!registry||prompt.mode!=='reverse'||!Array.isArray(prompt.kanaIds)
  ||prompt.kanaIds.length!==1||typeof prompt.answer!=='string'
  ||prompt.answer!==prompt.kanaIds[0])return mismatch;
 const v=byId.get(prompt.kanaIds[0]);
 if(!v||registry.skill!=='form_selection'||registry.cueFamily!=='sound-to-kana'
  ||registry.primaryTarget?.kind!=='kana'
  ||registry.primaryTarget?.id!=='hiragana-'+v.kana
  ||registry.prompt!==v.reading||registry.displayAnswer!==v.kana
  ||registry.kanaId!==v.id||registry.cardId!==v.id+':rev'
  ||registry.traceId!=='kana:hiragana-'+v.kana+':form_selection:sound-to-kana')
  return mismatch;
 return {status:'EXACT_FORM_SELECTION_CANDIDATE',traceId:registry.traceId};
}
/**
 * The preview returns a potential future *eligibility* classification only.
 * No grade, rating, trace update, or event is constructed or saved.
 */
export function previewCanonicalAttempt({attempt,prompt,registry,leaseAtStart,currentLease,existingAttemptIds}={}){
 if(!validLease(leaseAtStart)||!validLease(currentLease))return blocked('OWNER_LEASE_MISSING');
 if(leaseAtStart.owner!==currentLease.owner||leaseAtStart.epoch!==currentLease.epoch)
  return blocked('OWNER_LEASE_CHANGED');
 // Existing five-vowel S1 attempts are always forbidden from canonical grading.
 if(attempt?.practiceOnly===true)return blocked('PRACTICE_ONLY');
 if(attempt?.canonicalEligible!==true)return blocked('NONCANONICAL_EVIDENCE');
 if(attempt?.canonicalGradeId!==null)return blocked('ALREADY_GRADED');
 if(typeof attempt?.attemptId!=='string'||!attempt.attemptId
  ||attempt.attemptId.length>160||typeof attempt.sessionId!=='string'
  ||typeof attempt.promptId!=='string'||attempt.promptId!==prompt?.id
  ||attempt.mode!==prompt.mode)return blocked('MALFORMED_ATTEMPT');
 if(!(existingAttemptIds instanceof Set))return blocked('IDEMPOTENCY_EVIDENCE_MISSING');
 if(existingAttemptIds.has(attempt.attemptId))return blocked('DUPLICATE_ATTEMPT');
 if(classifyCanonicalCue(prompt,registry).status!=='EXACT_FORM_SELECTION_CANDIDATE')
  return blocked('UNMAPPED_CUE');
 if(attempt.assistanceLevel!=='none'||attempt.correction||attempt.revealed
  ||attempt.assisted===true)return blocked('ASSISTED_OR_CORRECTIVE');
 if(attempt.correct!==true||attempt.independent!==true)return blocked('NOT_INDEPENDENT_CORRECT');
 if(attempt.responseNormalized!==prompt.answer)return blocked('RESPONSE_MISMATCH');
 // A stable, derived demonstration key, not a real StudyEvent id.
 return {status:'PREVIEW_CANDIDATE',reason:'SYNTHETIC_PREVIEW_ONLY',wouldWrite:false,
  dryRunKey:'synthetic-preview:'+leaseAtStart.owner+':'+encodeURIComponent(attempt.attemptId)};
}
