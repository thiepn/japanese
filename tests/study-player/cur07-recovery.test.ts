import {describe,it,expect} from "vitest";
import {isStudyLesson} from "../../packages/study-player/src/index";
import {coreContent} from "../../apps/web/src/coreContent";
import {starterVocabulary,vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {buildCur06VocabularyJourney} from "../../apps/web/src/study/cur06VocabularyJourney";
import {readCoursePosition,coursePositionFingerprint} from "../../apps/web/src/study/cur03CoursePosition";
import {rememberCur07Section,inspectCur07History,restoreCur07Section,cur07HistoryKey,cur07PracticeKey,type Cur07HistoryStore} from "../../apps/web/src/study/cur07History";
class Store implements Cur07HistoryStore {
 values=new Map<string,string>();
 getItem(k:string){return this.values.get(k)??null}
 setItem(k:string,v:string){this.values.set(k,v)}
 removeItem(k:string){this.values.delete(k)}
}
const now=Date.UTC(2026,9,27,12);
const multi=starterVocabulary.find(word=>coreContent.courseUnits.filter(unit=>unit.vocabularyIds.includes(word.lexeme.id)).length>=2)!;
const refs=coreContent.courseUnits.filter(u=>u.vocabularyIds.includes(multi.lexeme.id));
const sessionKey=cur07PracticeKey(multi.lexeme.id,refs[0]!.id,refs[1]!.id);
const steps=buildCur06VocabularyJourney(multi.lexeme.id,"practice",refs[0]!.id,refs[1]!.id);
const revise=(source:typeof steps,n:number)=>{
 return source.map((step,index)=>index===source.length-1&&isStudyLesson(step)
   ?{...step,body:step.body+" correction "+n}
   :index===source.length-1&&!isStudyLesson(step)
      ?{...step,explanation:(step.explanation??"")+" source edit "+n}:step);
};
describe("CUR-07 learner-selected canonical comparison",()=>{
 it("retains only learner-selected distinct verified unit identities and original Can-do claims",()=>{
  const paired=buildCur06VocabularyJourney(multi.lexeme.id,"practice",refs[0]!.id,refs[1]!.id);
  const originalUnits=paired.filter(step=>step.id.includes("-unit-"));
  expect(originalUnits.map(step=>step.id)).toEqual([
   "cur06-"+multi.lexeme.id+"-unit-"+refs[0]!.id,
   "cur06-"+multi.lexeme.id+"-unit-"+refs[1]!.id
  ]);
  const compare=paired.find(step=>step.id.includes("-compare-"))!;
  expect(isStudyLesson(compare)).toBe(true);
  if(isStudyLesson(compare)){
   expect(compare.facts).toHaveLength(2);
   expect(compare.facts?.map(f=>f.value)).toEqual(refs.slice(0,2).map(u=>
    coreContent.canDos.find(can=>can.id===u.canDoId)!.statement));
   expect(compare.examples??[]).toEqual([]);
  }
 });
 it("does not alter the original exhaustive exploration or default CUR-06 prompt set",()=>{
  const before=buildCur06VocabularyJourney(multi.lexeme.id,"explore");
  const original=buildCur06VocabularyJourney(multi.lexeme.id,"practice");
  const after=buildCur06VocabularyJourney(multi.lexeme.id,"explore");
  expect(after).toEqual(before);
  expect(original.filter(step=>!isStudyLesson(step)).map(s=>s.id))
    .toEqual(steps.filter(step=>!isStudyLesson(step)).map(s=>s.id));
  expect(original.every(s=>!s.id.includes("-compare-"))).toBe(true);
  const authoritative=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts];
  expect(authoritative.every(p=>!p.id.startsWith("cur07-"))).toBe(true);
  expect(steps.filter(s=>!isStudyLesson(s)).every(s=>!isStudyLesson(s)&&s.eventMetadata?.schedulerExcluded===true)).toBe(true);
 });
 it("fails closed on invented, repeated, absent or impossible pair selections",()=>{
  expect(()=>buildCur06VocabularyJourney(multi.lexeme.id,"practice",refs[0]!.id,refs[0]!.id)).toThrow(/INVALID_CONTRAST/);
  expect(()=>buildCur06VocabularyJourney(multi.lexeme.id,"practice",undefined,refs[1]!.id)).toThrow(/INVALID_CONTRAST/);
  expect(()=>buildCur06VocabularyJourney(multi.lexeme.id,"explore",refs[0]!.id,refs[1]!.id)).toThrow(/INVALID_CONTRAST/);
  expect(()=>buildCur06VocabularyJourney(multi.lexeme.id,"practice",refs[0]!.id,"invented")).toThrow(/INVALID_CONTRAST/);
  expect(()=>cur07PracticeKey("bad!")).toThrow(/INVALID_KEY_PART/);
 });
 it("separates account-scoped changed-source position without retaining answer text",()=>{
  const store=new Store();
  expect(rememberCur07Section("alice",sessionKey,steps,2,store,now)).toBe(true);
  const raw=store.getItem(cur07HistoryKey("alice",sessionKey))!;
  expect(raw).not.toContain("acceptedAnswers");
  expect(raw).not.toContain("日本語");
  expect(raw.length).toBeLessThan(700);
  const changed=revise(steps,1);
  expect(coursePositionFingerprint(changed)).not.toBe(coursePositionFingerprint(steps));
  const entries=inspectCur07History("alice",sessionKey,changed,store,now);
  expect(entries).toHaveLength(1);
  expect(entries[0]?.status).toBe("recoverable");
  expect(entries[0]?.currentOrdinal).toBe(2);
  expect(inspectCur07History("bob",sessionKey,changed,store,now)).toEqual([]);
  expect(restoreCur07Section("bob",sessionKey,changed,entries[0]!.receipt,store,now)).toBeNull();
  expect(restoreCur07Section("alice",sessionKey,changed,entries[0]!.receipt,store,now)).toBe(2);
  expect(readCoursePosition("alice",sessionKey,changed,store)).toBe(2);
  expect(readCoursePosition("bob",sessionKey,changed,store)).toBe(0);
 });
 it("permits unchanged exact-section identity after reordered source, not merely an old ordinal",()=>{
  const store=new Store();
  rememberCur07Section("alice",sessionKey,steps,2,store,now);
  const reordered=[steps[0]!,steps[2]!,steps[1]!,...steps.slice(3)];
  const found=inspectCur07History("alice",sessionKey,reordered,store,now);
  expect(found).toHaveLength(1);
  expect(found[0]?.currentOrdinal).toBe(1);
  expect(restoreCur07Section("alice",sessionKey,reordered,found[0]!.receipt,store,now)).toBe(1);
 });
 it("blocks recovery when the saved section body itself changes, or a source step disappears",()=>{
  const store=new Store();
  rememberCur07Section("alice",sessionKey,steps,2,store,now);
  const changed=steps.map((step,i)=>i===2&&isStudyLesson(step)?{...step,body:step.body+" changed"}:step);
  expect(inspectCur07History("alice",sessionKey,changed,store,now)[0]?.status).toBe("changed_or_removed");
  const old=inspectCur07History("alice",sessionKey,changed,store,now)[0]!.receipt;
  expect(restoreCur07Section("alice",sessionKey,changed,old,store,now)).toBeNull();
  const missing=steps.filter((_,i)=>i!==2);
  expect(inspectCur07History("alice",sessionKey,missing,store,now)[0]?.currentOrdinal).toBeNull();
  expect(readCoursePosition("alice",sessionKey,steps,store)).toBe(0);
 });
 it("bounded history retains only latest four distinct source generations",()=>{
  const store=new Store();let version=steps;
  for(let n=0;n<8;n++){
   version=revise(version,n);
   expect(rememberCur07Section("alice",sessionKey,version,1,store,now+n*10)).toBe(true);
  }
  const data=JSON.parse(store.getItem(cur07HistoryKey("alice",sessionKey))!);
  expect(data).toHaveLength(4);
  expect(new Set(data.map((x:{sessionHash:string})=>x.sessionHash)).size).toBe(4);
  expect(inspectCur07History("alice",sessionKey,version,store,now+80)).toHaveLength(3);
 });
 it("rejects tampered or oversized storage, future receipts and failed storage writes",()=>{
  const store=new Store();
  const key=cur07HistoryKey("alice",sessionKey);
  rememberCur07Section("alice",sessionKey,steps,1,store,now);
  const records=JSON.parse(store.getItem(key)!);
  store.setItem(key,JSON.stringify([{...records[0],sectionHash:"fake"}]));
  expect(inspectCur07History("alice",sessionKey,revise(steps,2),store,now)).toEqual([]);
  store.setItem(key,"x".repeat(2202));
  expect(inspectCur07History("alice",sessionKey,revise(steps,2),store,now)).toEqual([]);
  store.setItem(key,JSON.stringify([{...records[0],recordedAt:now+60*60*1000}]));
  expect(inspectCur07History("alice",sessionKey,revise(steps,2),store,now)).toEqual([]);
  const denied:Cur07HistoryStore={getItem(){throw Error("private")},setItem(){throw Error("quota")},removeItem(){throw Error("private")}};
  expect(rememberCur07Section("alice",sessionKey,steps,1,denied,now)).toBe(false);
  expect(inspectCur07History("alice",sessionKey,steps,denied,now)).toEqual([]);
 });
});