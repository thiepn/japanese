// Display-only navigation for independent Kana Foundations prototype units.
const groups=[
 ['hiragana','Hiragana · Basic characters',[
  ['Hiragana vowels','あ・い・う・え・お','vowels'],['K-row','か・き・く・け・こ','k-row'],
  ['S-row','さ・し・す・せ・そ','s-row'],['T-row','た・ち・つ・て・と','t-row'],
  ['N-row','な・に・ぬ・ね・の','n-row'],['H-row','は・ひ・ふ・へ・ほ','h-row'],
  ['M-row','ま・み・む・め・も','m-row'],['Y-row','や・ゆ・よ','y-row'],
  ['R-row','ら・り・る・れ・ろ','r-row'],['W-row and ん','わ・を・ん','w-row']]],
 ['combinations','Hiragana · Reading and sound patterns',[
  ['Reading review','ひらがな','reading-review'],
  ['Voiced G/Z sounds','が・ざ・じ','dakuten-gz'],['Voiced D sounds','だ・ぢ・づ','dakuten-d'],
  ['B/P sounds','ば・ぱ','dakuten-bp'],['Small っ and rhythm','っ','sokuon-rhythm'],
  ['Combined sounds I','きゃ・しゃ・ちゃ','yoon-kshch'],
  ['Combined sounds II','にゃ・ひゃ・みゃ・りゃ','yoon-nhmr'],
  ['Voiced combined sounds','ぎゃ・じゃ・びゃ・ぴゃ','yoon-gjbp'],
  ['Integrated reading','よむ','integrated-reading']]],
 ['katakana','Katakana · Basic characters',[
  ['Katakana vowels','ア・イ・ウ・エ・オ','katakana-vowels'],
  ['K-row','カ・キ・ク・ケ・コ','katakana-k-row'],['S-row','サ・シ・ス・セ・ソ','katakana-s-row'],
  ['T-row','タ・チ・ツ・テ・ト','katakana-t-row'],['N-row','ナ・ニ・ヌ・ネ・ノ','katakana-n-row'],
  ['H-row','ハ・ヒ・フ・ヘ・ホ','katakana-h-row'],['M-row','マ・ミ・ム・メ・モ','katakana-m-row'],
  ['Y-row','ヤ・ユ・ヨ','katakana-y-row']]]
];
export const GROUPS=Object.freeze(groups.map(([id,name])=>Object.freeze({id,name})));
export const UNITS=Object.freeze(groups.flatMap(([group,,items])=>items.map(([title,kana,slug])=>({group,title,kana,slug})))
 .map((u,index)=>Object.freeze({...u,id:index+1,
 href:'./'+(u.slug==='vowels'?'index':u.slug)+'.html',
 engine:'./'+(u.slug==='vowels'?'engine':u.slug+'-engine')+'.mjs'})));
const state=(kind,detail)=>({kind,detail});
export function statusFromSnapshot(id,engine,raw){
 if(raw===null)return state('not-started','Not started');
 if(typeof raw!=='string')return state('unavailable','Local progress unavailable');
 let saved;
 try{saved=JSON.parse(raw);}catch{return state('invalid','Saved progress needs review');}
 try{
  if(typeof engine?.validState!=='function'||!engine.validState(saved))
   return state('invalid','Saved progress needs review');
  if(id===1){
   const summary=engine.firstAttemptSummary(saved);
   // Do not mistake a fully answered last question awaiting Continue for a finished unit.
   // Optional later practice resets the phase but preserves original completion evidence.
   const complete=saved.phase===7||(saved.practiceOnly===true
      &&summary.introduced===5&&summary.reading.total===3);
   const started=saved.phase>0||saved.records.length>0||saved.introduced.length>0;
   return state(complete?'finished':started?'in-progress':'not-started',
     complete?'Lesson finished':started?'In progress':'Not started');
  }
  const total=engine.TASKS?.length;
  if(!Number.isInteger(total)||total<=0||!Array.isArray(saved.records))
   return state('unavailable','Lesson status unavailable');
  const answered=saved.records.filter(r=>r.correction===false).length;
  if(answered>total)return state('invalid','Saved progress needs review');
  const kind=saved.finished?'finished':
   answered>0||saved.index>0||!saved.paused?'in-progress':'not-started';
  return state(kind,(kind==='finished'?'Lesson finished':
    kind==='in-progress'?'In progress':'Not started')+' · '+answered+'/'+total+' first responses');
 }catch{return state('invalid','Saved progress needs review');}
}
export function suggestedUnit(rows){
 return rows.find(r=>r.status.kind==='in-progress')||
  rows.find(r=>r.status.kind==='not-started')||null;
}

export const COURSE_FILTERS=Object.freeze([
 {id:'all',label:'All units'},
 {id:'in-progress',label:'In progress'},
 {id:'not-started',label:'Not started'},
 {id:'finished',label:'Finished'},
 {id:'attention',label:'Needs review'}
]);
// Sound spellings supplement title and script search; these are unit-level
// phonetics only, not a vocabulary or Japanese dictionary index.
const basicSounds=[
 'a i u e o','ka ki ku ke ko','sa shi si su se so','ta chi ti tsu tu te to',
 'na ni nu ne no','ha hi fu hu he ho','ma mi mu me mo','ya yu yo',
 'ra ri ru re ro','wa wo o n'
];
const soundIndex=Object.freeze(Object.fromEntries([
 ...basicSounds.map((sounds,i)=>[i+1,sounds]),
 ...basicSounds.slice(0,7).map((sounds,i)=>[20+i,sounds]),
 [27,basicSounds[7]]
]));
export function filterRows(rows,{filter='all',query=''}={}){
 const words=String(query??'').normalize('NFKC').toLowerCase().trim().split(/\s+/u).filter(Boolean);
 return rows.filter(({unit,status})=>{
  if(filter==='attention'){
   if(!['invalid','unavailable'].includes(status.kind))return false;
  }else if(filter!=='all'&&filter!==status.kind)return false;
  const haystack=[unit.title,unit.kana,unit.group,unit.slug,
   'unit '+unit.id,'unit '+String(unit.id).padStart(2,'0'),soundIndex[unit.id]||'']
    .join(' ').normalize('NFKC').toLowerCase();
  return words.every(word=>haystack.includes(word));
 });
}
