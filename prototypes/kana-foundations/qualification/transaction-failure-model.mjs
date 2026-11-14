/**
 * Isolated, SYNTHETIC transaction failure-injection model.
 *
 * NO_WRITE: there are no database, network, account, FSRS or scheduler imports
 * and no browser APIs here. Mutations affect only caller-created in-memory Maps.
 *
 * This models desired invariants and failure outcomes; it does not execute
 * IndexedDB transaction logic or prove the deployed implementation has them.
 * In particular, production does NOT yet enforce attemptId uniqueness nor
 * atomically validate a workspace lease epoch within its IndexedDB transaction.
 */
import {previewCanonicalAttempt} from './canonical-readiness.mjs';

const FAILURES=new Set(['after-event','after-outbox','after-trace','before-commit','after-commit-before-ack']);
const invalid=(reason)=>({status:'BLOCKED',reason,wouldWrite:false});
export function createSyntheticLedger(){
 return {events:new Map(),traces:new Map(),outbox:new Map(),attemptIds:new Set()};
}
const clone=x=>typeof structuredClone==='function'?structuredClone(x):JSON.parse(JSON.stringify(x));
function leaseEq(a,b){
 return a&&b&&a.owner===b.owner&&a.epoch===b.epoch;
}
/**
 * Preview the effect of an ideal, transactionally safe future integration on
 * four independent IN-MEMORY stores. The live DB is never opened.
 * Injected errors are modeled after staging each store but before committing.
 */
export function previewSyntheticTransaction(ledger,input){
 if(!ledger||!(ledger.events instanceof Map)||!(ledger.traces instanceof Map)
  ||!(ledger.outbox instanceof Map)||!(ledger.attemptIds instanceof Set))
  return invalid('INVALID_SYNTHETIC_LEDGER');
 if(!input||typeof input!=='object')return invalid('INVALID_SYNTHETIC_INPUT');
 const {eventId,attempt,prompt,registry,leaseAtStart,leaseAtCommit,baseRevision,
  proposedRevision,fault}=input;
 if(fault!==undefined&&!FAILURES.has(fault))return invalid('INVALID_INJECTED_FAULT');
 if(!leaseAtStart||!leaseAtCommit)return invalid('OWNER_LEASE_MISSING');
 if(!leaseEq(leaseAtStart,leaseAtCommit))return invalid('OWNER_LEASE_CHANGED');
 if(typeof eventId!=='string'||!eventId||eventId.length>160)
  return invalid('INVALID_EVENT_ID');
 // Real study_events uses add(event) to reject duplicate IDs; a future
 // deterministic attempt-to-event binding is an ADDITIONAL REQUIRED guard.
 if(ledger.events.has(eventId)){
  return {status:'ALREADY_COMMITTED_SYNTHETIC',reason:'DUPLICATE_EVENT_ID',wouldWrite:false};
 }
 if(ledger.attemptIds.has(attempt?.attemptId))return invalid('DUPLICATE_ATTEMPT_ID');
 const candidate=previewCanonicalAttempt({attempt,prompt,registry,leaseAtStart,
  currentLease:leaseAtCommit,existingAttemptIds:ledger.attemptIds});
 if(candidate.status!=='PREVIEW_CANDIDATE')return invalid(candidate.reason);
 if(!Number.isInteger(baseRevision)||baseRevision<0||!Number.isInteger(proposedRevision)
  ||proposedRevision!==baseRevision+1)return invalid('REVISION_NOT_SUCCESSOR');
 const traceId=registry.traceId;
 const previous=ledger.traces.get(traceId);
 const currentRevision=previous?.revision??0;
 if(currentRevision!==baseRevision)return invalid('FLASHCARD_REVISION_CONFLICT');
 if(previous&&previous.userId!==leaseAtStart.owner)return invalid('TRACE_OWNER_MISMATCH');

 // Changes are staged in copies: no partial real ledger changes can be observed.
 const next={
  events:new Map(ledger.events),traces:new Map(ledger.traces),
  outbox:new Map(ledger.outbox),attemptIds:new Set(ledger.attemptIds)
 };
 const abort=step=>({status:'ABORTED_SYNTHETIC',
  reason:'INJECTED_'+step.toUpperCase().replaceAll('-','_'),wouldWrite:false});
 next.events.set(eventId,{id:eventId,userId:leaseAtStart.owner,
  attemptId:attempt.attemptId,traceId,baseRevision});
 if(fault==='after-event')return abort(fault);
 next.outbox.set(eventId,{mutation_id:eventId,eventId,owner:leaseAtStart.owner});
 if(fault==='after-outbox')return abort(fault);
 next.traces.set(traceId,{id:traceId,userId:leaseAtStart.owner,
  revision:proposedRevision,card:{due:'synthetic-review-due-only'}});
 if(fault==='after-trace'||fault==='before-commit')return abort(fault);
 // Commit all four in one synchronous synthetic publication.
 // Future production work must qualify a genuine IndexedDB IDBTransaction.
 ledger.events=next.events;
 ledger.outbox=next.outbox;
 ledger.traces=next.traces;
 next.attemptIds.add(attempt.attemptId);
 ledger.attemptIds=next.attemptIds;
 if(fault==='after-commit-before-ack')
  return {status:'COMMIT_ACK_LOST_SYNTHETIC',reason:'ACK_INTERRUPTED',
   wouldWrite:false};
 return {status:'COMMITTED_SYNTHETIC',reason:'PREVIEW_ONLY',wouldWrite:false};
}
