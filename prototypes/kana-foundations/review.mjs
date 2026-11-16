import {UNITS} from './course-map-model.mjs';
import {reviewFromSnapshot} from './review-model.mjs';
const root=document.getElementById('app');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;')
 .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
async function load(unit){
 try{
  const engine=await import(unit.engine);
  const key=unit.id===1?engine.PROTOTYPE_STORAGE_KEY:engine.STORAGE_KEY;
  if(typeof key!=='string'||!key.startsWith('thiepn:kana-foundations:'))
   return {items:[],unavailable:true};
  return reviewFromSnapshot(unit,engine,localStorage.getItem(key));
 }catch{return {items:[],unavailable:true};}
}
const loaded=await Promise.all(UNITS.map(load));
const items=loaded.flatMap(x=>x.items);
const unavailable=loaded.filter(x=>x.unavailable).length;
let selected='all',index=0,show=false;
const visible=()=>selected==='all'?items:items.filter(x=>String(x.unitId)===selected);
function render(focus=''){
 const list=visible(),item=list[index];
 const options=UNITS.filter(u=>items.some(x=>x.unitId===u.id)).map(u=>
  '<option value="'+u.id+'"'+(selected===String(u.id)?' selected':'')+'>Unit '
  +String(u.id).padStart(2,'0')+' · '+esc(u.title)+'</option>').join('');
 root.innerHTML='<div class="course-shell"><header class="course-header">'
  +'<div class="brand"><div class="brand-mark" lang="ja">あ</div><div><h2>Kana Foundations</h2></div></div>'
  +'<a href="./course-map.html" class="course-back">All units</a></header>'
  +'<main id="main" class="course-main"><h1>Review first attempts</h1>'
  +'<p class="review-intro">Review prompts answered incorrectly, with help or after revealing the answer. Answers stay hidden until requested. Corrections, practice-only rounds and unverified listening prompts are excluded. This does not measure long-term recall.</p>'
  +(unavailable?'<p class="review-warning" role="alert">'+unavailable+' saved '
    +(unavailable===1?'unit is':'units are')+' unavailable or invalid. Records were not changed.</p>':'')
  +(items.length?'<div class="review-toolbar"><label for="review-unit">Review unit'
     +'<select id="review-unit"><option value="all">All units with difficult prompts</option>'
     +options+'</select></label><span id="review-count" class="review-count" role="status" aria-live="polite">'
     +(item?index+1:0)+' / '+list.length+' prompts</span></div>'
     +(item?'<article class="review-card"><p class="context">Unit '+String(item.unitId).padStart(2,'0')
       +' · '+esc(item.unitTitle)+'</p><p class="reason">'+esc(item.reason)+'</p>'
       +'<h2>'+esc(item.prompt)+'</h2>'
       +(show?'<div class="review-answer" id="review-answer"><span>Answer</span><strong>'
         +esc(item.answer)+'</strong>'
         +(item.meaning?'<p>Meaning: '+esc(item.meaning)+'</p>':'')
         +(item.note?'<p>'+esc(item.note)+'</p>':'')+'</div>':'')
       +'</article><div class="review-actions">'
       +'<button type="button" data-action="previous"'+(index===0?' disabled':'')+'>Previous</button>'
       +'<button type="button" data-action="toggle" aria-expanded="'+show+'">'
       +(show?'Hide answer':'Reveal answer')+'</button>'
       +'<button type="button" data-action="next"'+(index+1===list.length?' disabled':'')+'>Next</button></div>'
       +'<a class="review-lesson" href="'+item.href+'">Open Unit '
       +String(item.unitId).padStart(2,'0')+'</a>'
      :'<p class="review-empty">This unit has no difficult first attempts recorded.</p>')
    :'<p class="review-empty">No first-attempt difficulties are saved in this browser.</p>')
  +'</main></div>';
 if(focus)root.querySelector(focus)?.focus();
}
root.addEventListener('change',event=>{
 if(event.target.id==='review-unit'){
  selected=event.target.value;index=0;show=false;render('#review-unit');
 }
});
root.addEventListener('click',event=>{
 const act=event.target.closest('button[data-action]')?.dataset.action;
 if(!act)return;
 if(act==='next'&&index+1<visible().length){index++;show=false;}
 if(act==='previous'&&index>0){index--;show=false;}
 if(act==='toggle')show=!show;
 render('[data-action="toggle"]');
});
render();
