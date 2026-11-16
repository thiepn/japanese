import {UNITS,GROUPS,COURSE_FILTERS,statusFromSnapshot,suggestedUnit,filterRows,makeProgressBackup} from './course-map-model.mjs';
const root=document.getElementById('app');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
async function readUnit(unit){
 try{
  const engine=await import(unit.engine);
  const key=unit.id===1?engine.PROTOTYPE_STORAGE_KEY:engine.STORAGE_KEY;
  if(typeof key!=='string'||!key.startsWith('thiepn:kana-foundations:'))throw Error('Invalid prototype key');
  // Reads only. No setItem, removeItem, IndexedDB, Account or scheduler code.
  return {unit,key,status:statusFromSnapshot(unit.id,engine,localStorage.getItem(key))};
 }catch{return {unit,key:null,status:{kind:'unavailable',detail:'Local progress unavailable'}};}
}
function card({unit:u,status:s}){
 return '<a class="course-card" data-status="'+s.kind+'" href="'+u.href
  +'" aria-label="Unit '+u.id+' '+esc(u.title)+'. '+esc(s.detail)+'">'
  +'<span class="course-number">UNIT '+String(u.id).padStart(2,'0')+'</span>'
  +'<span class="course-title">'+esc(u.title)+'</span>'
  +'<span class="course-kana" lang="ja">'+esc(u.kana)+'</span>'
  +'<span class="course-status">'+esc(s.detail)+'</span></a>';
}
let rowsCache=[];
let selectedFilter='all';
let searchText='';

 const filterControls='<section class="course-tools" aria-label="Find and filter units">'
  +'<label for="unit-search">Find a unit</label>'
  +'<input id="unit-search" type="search" autocomplete="off" placeholder="Unit number, kana, reading or row">'
  +'<div class="course-filters" role="group" aria-label="Lesson status">'
  +COURSE_FILTERS.map(f=>'<button type="button" data-filter="'+f.id+'" aria-pressed="'+(f.id==='all'?'true':'false')+'">'+esc(f.label)+'</button>').join('')
  +'</div></section>'
  +'<p class="course-result-count" id="result-count" role="status" aria-live="polite"></p>'
  +'<div id="unit-results"></div>';

 const backupPanel='<section class="course-backup" aria-label="Progress backup">'
  +'<button id="download-progress" type="button">Download local progress</button>'
  +'<div><p>Saves all existing Kana Foundations lesson records to JSON, including invalid records. Restore is not available yet.</p>'
  +'<p id="backup-feedback" role="status" aria-live="polite"></p></div></section>';
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

 out+='<div class="course-review-link"><a href="./review.html">Review difficult first attempts</a></div>';
 out+=backupPanel+filterControls+'<footer class="course-footer">No learner records were imported, migrated or rescheduled.</footer></main></div>';
 root.innerHTML=out;
 rowsCache=rows;
 refreshResults();
}
function refreshResults(){
 const filtered=filterRows(rowsCache,{filter:selectedFilter,query:searchText});
 const count=document.getElementById('result-count'),target=document.getElementById('unit-results');
 if(!count||!target)return;
 count.textContent=filtered.length+' of '+rowsCache.length+' units shown';
 target.innerHTML=filtered.length?GROUPS.map(g=>{
  const items=filtered.filter(r=>r.unit.group===g.id);
  return items.length?'<section class="course-group" aria-labelledby="group-'+g.id+'">'
   +'<h2 id="group-'+g.id+'">'+esc(g.name)+'</h2><div class="course-grid">'
   +items.map(card).join('')+'</div></section>':'';
 }).join(''):'<div class="course-empty"><p>No units match this search or status.</p><button type="button" data-reset>Show all units</button></div>';
 for(const button of root.querySelectorAll('[data-filter]')){
  button.setAttribute('aria-pressed',String(button.dataset.filter===selectedFilter));
 }
}
root.addEventListener('input',event=>{
 if(event.target.id!=='unit-search')return;
 searchText=event.target.value;
 refreshResults(); // Does not replace the focused search input.
});

function downloadProgress(){
 const feedback=document.getElementById('backup-feedback');
 try{
  const backup=makeProgressBackup(rowsCache,key=>localStorage.getItem(key),new Date().toISOString());
  if(backup.records.length===0){
   feedback.textContent='No Kana Foundations lesson progress is saved in this browser.';
   return;
  }
  const blob=new Blob([JSON.stringify(backup,null,2)+'\n'],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.download='kana-foundations-progress-'+backup.createdAt.slice(0,10)+'.json';
  link.href=url;link.hidden=true;document.body.append(link);
  try{link.click();}finally{
   link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  feedback.textContent='Backup download prepared for '+backup.records.length
   +' saved '+(backup.records.length===1?'unit.':'units.');
 }catch{
  feedback.textContent='Unable to prepare a complete backup. Saved lessons were not changed.';
 }
}
root.addEventListener('click',event=>{
 if(event.target.closest('button#download-progress')){downloadProgress();return;}
 const filter=event.target.closest('button[data-filter]');
 if(filter){selectedFilter=filter.dataset.filter;refreshResults();return;}
 if(event.target.closest('button[data-reset]')){
  selectedFilter='all';searchText='';
  const input=document.getElementById('unit-search');
  if(input){input.value='';input.focus();}
  refreshResults();
 }
});
render(await Promise.all(UNITS.map(readUnit)));

