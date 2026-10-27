import {describe,it,expect} from 'vitest';
import {createEmptyCard} from 'ts-fsrs';
import {nextStageCharacterIndex,wasKanaIntroduced} from '../apps/kana-studio/src/services/stageProgress';
import type {StoredCardData} from '../apps/kana-studio/src/types/kana';

const ids=['h-a','h-i','h-u','h-e','h-o'];
function card(id:string,options:{introduced?:boolean;reviews?:number}={}):StoredCardData {
 return {cardId:id,direction:'kana-to-romaji',card:createEmptyCard(),
   totalReviews:options.reviews??0,totalLapses:0,
   ...(options.introduced?{introducedAt:'2026-10-27T12:00:00.000Z'}:{})};
}
describe('Kana stage continuation',()=>{
 it('starts at the first unintroduced character rather than replaying completed ones',()=>{
   const cards=new Map<string,StoredCardData>([
     ['h-a',card('h-a',{introduced:true})],['h-i',card('h-i',{introduced:true})]
   ]);
   expect(nextStageCharacterIndex({kanaIds:ids},cards)).toBe(2);
   expect(wasKanaIntroduced(cards.get('h-a'))).toBe(true);
   expect(wasKanaIntroduced(cards.get('h-u'))).toBe(false);
 });
 it('works across gaps and replays a fully introduced stage from its first character',()=>{
   const cards=new Map<string,StoredCardData>([
     ['h-a',card('h-a',{reviews:3})],['h-u',card('h-u',{introduced:true})]
   ]);
   expect(nextStageCharacterIndex({kanaIds:ids},cards)).toBe(1);
   for(const id of ids)cards.set(id,card(id,{introduced:true}));
   expect(nextStageCharacterIndex({kanaIds:ids},cards)).toBe(0);
 });
});
