import test from 'node:test';
import assert from 'node:assert/strict';
import {
 VOWELS,STAGES,initialState,validState,currentStage,currentItem,vowel,word,start,
 advance,submit,skipListening,markAudioPlayed,setHint,pause,
 firstAttemptSummary,progress,practiceAgain,normalizeReading,allowedChoices,PROTOTYPE_STORAGE_KEY
} from '../engine.mjs';

function answerCorrect(s){
 const mode=currentStage(s).mode,item=currentItem(s);
 if(mode==='teach')return advance(s);
 if(mode==='listening')s=markAudioPlayed(s);
 const input=mode==='reading'?word(item).reading:
  mode==='listening'?item:vowel(item).reading;
 return advance(submit(s,input));
}
function complete(){
 let s=start(initialState()),guard=0;
 while(currentStage(s).mode!=='results'){
   if(guard++>100)throw Error('lesson did not terminate');
   s=answerCorrect(s);
 }
 return s;
}
test('canonical five-vowel identities and correct stroke counts',()=>{
 assert.deepEqual(VOWELS.map(x=>x.kana),['あ','い','う','え','お']);
 assert.deepEqual(VOWELS.map(x=>x.strokes),[3,2,2,2,3]);
 assert.equal(new Set(VOWELS.map(x=>x.id)).size,5);
 assert.equal(PROTOTYPE_STORAGE_KEY.includes('prototype-only'),true);
});
test('independent two-vowel introduction precedes recognition',()=>{
 let s=start(initialState());
 assert.equal(currentStage(s).mode,'teach');
 assert.equal(currentItem(s),'h-a');
 s=advance(s);assert.deepEqual(s.introduced,['h-a']);
 s=advance(s);assert.deepEqual(s.introduced,['h-a','h-i']);
 assert.equal(currentStage(s).mode,'recognition');
 assert.equal(currentItem(s),'h-a');
 assert.equal(s.records.filter(x=>x.mode==='introduction').length,2);
});
test('wrong answer is recorded once and rechecked as correction without erasing first failure',()=>{
 let s=start(initialState());s=advance(advance(s));
 s=submit(s,'i');
 assert.equal(s.feedback.correct,false);
 assert.deepEqual(s.retryItems,['h-a']);
 assert.equal(s.records[2].correct,false);
 assert.equal(s.records[2].correction,false);
 const duplicate=submit(s,'a');
 assert.deepEqual(duplicate,s,'duplicate submission blocked before advance');
 s=advance(s);s=submit(s,'i');s=advance(s);
 assert.equal(s.retryMode,true);
 assert.equal(currentItem(s),'h-a');
 s=submit(s,'a');assert.equal(s.feedback.correct,true);
 assert.equal(s.records.at(-1).correction,true);
 s=advance(s);
 assert.equal(currentStage(s).id,'introduce-rest');
 assert.equal(s.records[2].correct,false,'wrong first attempt unchanged');
});
test('hint marks an answer as assisted',()=>{
 let s=start(initialState());s=advance(advance(s));
 s=setHint(s);
 s=submit(s,'a');
 assert.equal(s.records.at(-1).assisted,true);
 assert.equal(s.records.at(-1).correct,true);
});
test('listening requires playback or a skipped-no-evidence record',()=>{
 let s=start(initialState());
 s={...s,phase:5,paused:false};
 assert.equal(submit(s,'h-e'),s,'cannot answer without audio');
 let skip=skipListening(s);
 assert.equal(skip.feedback.correct,null);
 assert.equal(skip.records.at(-1).correct,null);
 assert.equal(skip.records.at(-1).mode,'listening');
 let played=markAudioPlayed(s);
 let success=submit(played,'h-e');
 assert.equal(success.feedback.correct,true);
});
test('full lesson produces independent evidence and results without claiming retention',()=>{
 const s=complete(),out=firstAttemptSummary(s);
 assert.equal(currentStage(s).mode,'results');
 assert.equal(out.introduced,5);
 assert.deepEqual(out.recognition,{correct:5,total:5});
 assert.equal(out.recall.correct,5);
 assert.equal(out.listening.correct,5);
 assert.equal(out.reading.correct,3);
 assert.equal(progress(s).percent,100);
 assert.equal(validState(JSON.parse(JSON.stringify(s))),true);
});
test('practice-only repetition preserves prior first-attempt evidence',()=>{
 let s=complete(),before=firstAttemptSummary(s);
 s=practiceAgain(s);
 assert.equal(s.practiceOnly,true);
 assert.equal(currentStage(s).id,'recognize-all');
 while(currentStage(s).mode!=='results')s=answerCorrect(s);
 assert.deepEqual(firstAttemptSummary(s),before);
 assert(s.records.some(x=>x.practiceOnly));
});
test('pausing preserves index, preventing accidental progress loss',()=>{
 let s=start(initialState());s=advance(s);const saved=JSON.parse(JSON.stringify(pause(s)));
 assert.equal(saved.paused,true);
 assert.equal(saved.cursor,1);
 assert.equal(validState(saved),true);
 assert.equal(currentItem(start(saved)),'h-i');
});
test('normalization accepts harmless formatting but not wrong vowels',()=>{
 assert.equal(normalizeReading('  I E  '),'ie');
 assert.equal(normalizeReading('h-a'),'ha');
 assert.notEqual(normalizeReading('i'),normalizeReading('e'));
});

test('choices preserve valid targets and diversify correct positions without rerender drift',()=>{
 const slots=[];
 VOWELS.forEach((v,cursor)=>{
   const s={...initialState(),phase:3,cursor,paused:false};
   const options=allowedChoices(s);
   assert.deepEqual(new Set(options),new Set(VOWELS.map(v=>v.reading)));
   assert.deepEqual(allowedChoices(JSON.parse(JSON.stringify(s))),options);
   slots.push(options.indexOf(v.reading));
 });
 assert.deepEqual(slots,[3,1,4,2,0]);
 const intro={...initialState(),phase:1,paused:false};
 assert.deepEqual(new Set(allowedChoices(intro)),new Set(['a','i']));
});
