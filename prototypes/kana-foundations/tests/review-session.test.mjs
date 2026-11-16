import test from 'node:test';
import assert from 'node:assert/strict';
import {createReviewRound,rateReviewPrompt,moveReviewPrompt,
 finishReviewRound,reviewRoundSummary,retryReviewRound} from '../review-session-model.mjs';

test('ratings stay in immutable memory and advance without fabricating lesson results',()=>{
 const first=createReviewRound([2,7,8]);
 const second=rateReviewPrompt(first,'remembered');
 assert.equal(first.position,0);assert.deepEqual(first.ratings,{});
 assert.equal(second.position,1);assert.deepEqual(second.ratings,{'2':'remembered'});
 const third=rateReviewPrompt(second,'again');
 assert.deepEqual(third.ratings,{'2':'remembered','7':'again'});
 assert.deepEqual(reviewRoundSummary(third),{total:3,remembered:1,again:1,unrated:1});
 assert.equal(third.position,2);assert.equal(third.finished,false);
});
test('rating the final prompt ends the round with honest self-reported counts',()=>{
 let s=createReviewRound([5,8]);
 s=rateReviewPrompt(s,'remembered');
 s=rateReviewPrompt(s,'again');
 assert.equal(s.finished,true);
 assert.deepEqual(reviewRoundSummary(s),{total:2,remembered:1,again:1,unrated:0});
 assert.strictEqual(rateReviewPrompt(s,'again'),s);
});
test('retry queue includes missed and skipped prompts and never passed ones',()=>{
 let s=createReviewRound([4,11,16,21]);
 s=rateReviewPrompt(s,'remembered');
 s=rateReviewPrompt(s,'again');
 s=moveReviewPrompt(s,1);
 s=finishReviewRound(s);
 assert.deepEqual(retryReviewRound(s).ids,[11,16,21]);
 assert.equal(retryReviewRound(s).number,2);
 assert.deepEqual(reviewRoundSummary(s),{total:4,remembered:1,again:1,unrated:2});
});
test('filter changes start a fresh review without touching original queues',()=>{
 const all=createReviewRound([0,4,8]);
 const filtered=createReviewRound([4,8]);
 assert.deepEqual(all.ids,[0,4,8]);
 assert.deepEqual(filtered.ids,[4,8]);
 assert.equal(filtered.number,1);
});
test('invalid queues and unsupported ratings are rejected without side effects',()=>{
 assert.throws(()=>createReviewRound([1,1]),/Invalid/);
 assert.throws(()=>createReviewRound([-2]),/Invalid/);
 assert.strictEqual(rateReviewPrompt(createReviewRound([2]),'mastered').position,0);
 const done=createReviewRound([]);
 assert.equal(done.finished,true);
 assert.equal(retryReviewRound(done),null);
});
