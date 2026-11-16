import {UNITS,GROUPS,statusFromSnapshot,suggestedUnit} from './course-map-model.mjs';
const root=document.getElementById('app');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
async function readUnit(unit){
 try{
  const engine=await import(unit.engine);
  const key=unit.id===1?engine.PROTOTYPE_STORAGE_KEY:engine.STORAGE_KEY;
  if(typeof key!=='string'||!key.startsWith('thiepn:kana-foundations:'))throw Error('Invalid prototype key');
  // Reads only. No setItem, removeItem, IndexedDB, Account or scheduler code.
  return {unit,status:statusFromSnapshot(unit.id,engine,localStorage.getItem(key))};
 }catch{return {unit,status:{kind:'unavailable',detail:'Local progress unavailable'}};}
}
function card({unit:u,status:s}){
 return '<a class="course-card" data-status="'+s.kind+'" href="'+u.href
  +'" aria-label="Unit '+u.id+' '+esc(u.title)+'. '+esc(s.detail)+'">'
  +'<span class="course-number">UNIT '+String(u.id).padStart(2,'0')+'</span>'
  +'<span class="course-title">'+esc(u.title)+'</span>'
  +'<span class="course-kana" lang="ja">'+esc(u.kana)+'</span>'
  +'<span class="course-status">'+esc(s.detail)+'</span></a>';
}
function render(rows){
 const done=rows.filter(r=>r.status.kind==='finished').length;
 const active=rows.filter(r=>r.status.kind==='in-progress').length;
 const warnings=rows.filter(r=>['invalid','unavailable'].includes(r.status.kind)).length;
 const next=suggestedUnit(rows);
 let out='<div class="course-shell"><header class="course-header"><div class="brand"><div class="brand-mark" lang="ja">あ</div><div>'
  +'<h2>Kana Foundations</h2><p class="eyebrow">LOCAL COURSE MAP</p></div></div>'
  +'<a class="course-back" href="./index.html">Unit 01</a></header>'
  +'<main id="main" class="course-main"><h1>Choose a kana unit</h1>'
  +'<p class="course-intro">Lesson records stay in this browser. Finished does not mean mastered or remembered later. This view does not read or change Japanese Account or FSRS progress.</p>'
  +'<div class="course-counts"><div><strong>'+done+' / '+UNITS.length+'</strong><span>lessons finished locally</span></div>'
  +'<div><strong>'+active+'</strong><span>in progress</span></div>'
  +(warnings?'<div><strong>'+warnings+'</strong><span>unavailable or need review</span></div>':'')+'</div>';
 if(next)out+='<section class="course-next" aria-label="Suggested next lesson"><div><strong>'
   +(next.status.kind==='in-progress'?'Resume unfinished lesson':'Next unstarted lesson')+'</strong>'
   +'<p>Unit '+String(next.unit.id).padStart(2,'0')+' · '+esc(next.unit.title)+'</p></div>'
   +'<a href="'+next.unit.href+'">'+(next.status.kind==='in-progress'?'Resume':'Open lesson')+'</a></section>';
 for(const group of GROUPS){
  out+='<section class="course-group" aria-labelledby="group-'+group.id+'">'
   +'<h2 id="group-'+group.id+'">'+esc(group.name)+'</h2><div class="course-grid">'
   +rows.filter(r=>r.unit.group===group.id).map(card).join('')+'</div></section>';
 }
 root.innerHTML=out+'<footer class="course-footer">No learner records were imported, migrated or rescheduled.</footer></main></div>';
}
render(await Promise.all(UNITS.map(readUnit)));
