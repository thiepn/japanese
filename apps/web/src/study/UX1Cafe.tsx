import {useState} from "react";
import type {StudyStep} from "@thiepn/study-player";
const STAGES:Record<string,number>={setup:0,hear:0,reveal:1,read:1,notice:2,try:3,reply:4,recall:5,free:6,write:6,speak:6,return:6};
const LABELS=["Encounter","Understand","Discover","Practise","Respond","Recall","Extend"];
export function isUX1CafeJourney(steps:readonly StudyStep[]):boolean{
 return steps.some(s=>s.id==="a1-e02-food-setup");
}
export function ux1CafeStage(steps:readonly StudyStep[],index:number):number{
 for(let i=index;i>=0;i--){
  const id=steps[i]?.id??"";
  if(!id.startsWith("a1-e02-food-"))continue;
  const stage=STAGES[id.slice("a1-e02-food-".length)];
  if(stage!==undefined)return stage;
 }
 return 0;
}
export function UX1CafeHeader({steps,index}:{steps:readonly StudyStep[];index:number}){
 const stage=ux1CafeStage(steps,index);
 return <div className="ux1-cafe-head"><div className="ux1-cafe-head__top"><strong>A small café · <span lang="ja">喫茶店</span></strong><small>STAGE {stage+1} OF 7 · {LABELS[stage]}</small></div><div className="ux1-cafe-head__progress" role="progressbar" aria-label="Café presentation stage" aria-valuemin={0} aria-valuemax={7} aria-valuenow={stage+1}><span style={{width:String((stage+1)/7*100)+"%"}}/></div><p>Learn a polite request, then recall it without the model.</p></div>;
}
export function UX1CafeTiles(){
 const [tiles,setTiles]=useState<string[]>([]);
 const [checked,setChecked]=useState(false);
 const words=["お茶","を","ください","です","に"];
 const correct=tiles.join("")==="お茶をください";
 return <section className="ux1-cafe-tiles" aria-labelledby="ux1-tiles-title"><h2 id="ux1-tiles-title">Build a polite order</h2><p>Arrange the tiles to order tea. This is ungraded rehearsal, not independent recall.</p>
  <div className="ux1-cafe-tiles__answer" role="group" aria-label="Assembled answer">{tiles.length?tiles.map((word,i)=><button key={word} aria-label={"Remove "+word} type="button" onClick={()=>{setTiles(a=>a.filter((_,j)=>i!==j));setChecked(false);}}>{word}</button>):<span>Choose tiles below</span>}</div>
  <div className="ux1-cafe-tiles__bank" role="group" aria-label="Available tiles">{words.filter(w=>!tiles.includes(w)).map(w=><button type="button" key={w} aria-label={"Add "+w} onClick={()=>{setTiles(a=>[...a,w]);setChecked(false);}}>{w}</button>)}</div>
  <button type="button" className="ux1-cafe-tiles__check" disabled={tiles.length===0} onClick={()=>setChecked(true)}>Check rehearsal</button>
  {checked?<p role="status" className="ux1-cafe-tiles__feedback">{correct?"Correct. お茶をください requests tea.":"Use お茶 + を + ください. を marks the item being requested."}</p>:null}
 </section>;
}
