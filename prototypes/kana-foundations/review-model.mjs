// Read-only first-attempt review. No learner evidence, grades or scheduler writes.
export function reviewFromSnapshot(unit,engine,raw){
 if(raw===null)return {items:[],unavailable:false};
 if(typeof raw!=='string')return {items:[],unavailable:true};
 try{
  const saved=JSON.parse(raw);
  if(typeof engine?.validState!=='function'||!engine.validState(saved)||
    !Array.isArray(saved.records))return {items:[],unavailable:true};
  const firstUnit=unit.id===1;
  if(firstUnit?(!Array.isArray(engine.VOWELS)||!Array.isArray(engine.WORDS)):
    !Array.isArray(engine.TASKS))return {items:[],unavailable:true};
  const lookup=new Map((firstUnit?[...engine.VOWELS,...engine.WORDS]:engine.TASKS)
   .map(task=>[task.id,task]));
  const items=[];
  for(const record of saved.records){
   if(!record||record.correction!==false||record.practiceOnly===true)continue;
   if(firstUnit&&(record.mode==='listening'||
      !['intro-check','recognition','recall','reading'].includes(record.mode)))continue;
   const wrong=record.correct===false;
   const helped=record.correct===true&&record.assisted===true;
   const revealed=record.revealed===true||
     (record.correct===null&&record.assisted===true);
   if(!wrong&&!helped&&!revealed)continue;
   const task=lookup.get(firstUnit?record.item:record.taskId);
   if(!task)continue;
   const answer=firstUnit?task.reading:task.answer;
   if(typeof answer!=='string'||!answer||typeof task.kana!=='string')continue;
   const chosen=(Array.isArray(task.choices)?task.choices:[]).find(option=>
    typeof option==='string'?option===answer:
    Array.isArray(option)?option[0]===answer:option?.value===answer);
   const label=typeof chosen==='string'?chosen:
    Array.isArray(chosen)?chosen[1]:typeof chosen?.label==='string'?chosen.label:answer;
   // Variants are taken ONLY from the lesson engine; never guess spellings,
   // translations or romanization equivalents for automated scoring.
   const alternatives=Array.isArray(task.aliases)?[...new Set(task.aliases
    .filter(x=>typeof x==='string'&&x.trim()&&x!==answer))]:[];
   items.push({unitId:unit.id,unitTitle:unit.title,href:unit.href,
    prompt:task.kana,answer:label,alternatives,meaning:task.meaning||'',
    note:task.note||task.tip||'',
    reason:wrong?'Incorrect first response':
      helped?'Assisted first response':'Answer revealed without an independent response'});
  }
  return {items,unavailable:false};
 }catch{return {items:[],unavailable:true};}
}
