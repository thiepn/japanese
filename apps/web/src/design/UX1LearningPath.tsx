import {useEffect,useState} from "react";
import type {E01Progress,E02Overview,E03Overview,E04Overview} from "../study/runtime";
import type {E07Action,E07Journey} from "../study/e07LearningRoute";
type Node={id:string;title:string;progress:string;status:string;open:()=>void;review?:(()=>void)|undefined;preview?:boolean;recommended:boolean};
const A1=[
 {title:"First Words",jp:"はじまり",ids:["first-conversation","greetings","personal","origin"]},
 {title:"People & Time",jp:"人と時間",ids:["family","routine","time"]},
 {title:"Daily Life",jp:"毎日の暮らし",ids:["preferences","food","shopping"]},
 {title:"Out & About",jp:"外へ",ids:["transport","past"]},
 {title:"Keep Talking",jp:"会話を続ける",ids:["help","exchange"]}
];
/** First visible chapter follows actual E07 source ownership, not an XP gate. */
export function ux1InitialPathLocation(primary:Pick<E07Action,"origin"|"targetId">):{level:"A1"|"A2";chapter:number}{
 if(primary.origin==="e02"&&primary.targetId){
  const chapter=A1.findIndex(item=>item.ids.includes(primary.targetId!));
  return {level:"A1",chapter:chapter<0?0:chapter};
 }
 if(primary.origin==="e03")return {level:"A2",chapter:0};
 if(primary.origin==="e04")return {level:"A2",chapter:1};
 return {level:"A1",chapter:0};
}
export function UX1LearningPath({e01,e02,e03,e04,route,busy,onOpenE07,onE01,onE01Delayed,onE02,onE02Delayed,onE02Preview,onE03,onE03Delayed,onE03Preview,onE04,onE04Delayed,onE04Preview}:{
 e01:E01Progress;e02:E02Overview;e03:E03Overview;e04:E04Overview;route:E07Journey;busy:boolean;
 onOpenE07:(action:E07Action)=>void;
 onE01:()=>void;onE01Delayed:()=>void;
 onE02:(id:string)=>void;onE02Delayed:(id:string)=>void;onE02Preview:(id:string)=>void;
 onE03:(id:string)=>void;onE03Delayed:(id:string)=>void;onE03Preview:(id:string)=>void;
 onE04:(id:string)=>void;onE04Delayed:(id:string)=>void;onE04Preview:(id:string)=>void;
}){
 const [level,setLevel]=useState<"A1"|"A2">(()=>ux1InitialPathLocation(route.primary).level);
 const [selected,setSelected]=useState(()=>ux1InitialPathLocation(route.primary).chapter);
 const [chosenByLearner,setChosenByLearner]=useState(false);
 useEffect(()=>{
  if(chosenByLearner)return;
  const location=ux1InitialPathLocation(route.primary);
  setLevel(location.level);
  setSelected(location.chapter);
 },[route.primary.key,chosenByLearner]);
 const a1:Node[]=[
  ...(e01.unitId?[{id:"first-conversation",title:"First conversations",progress:e01.correct+" correct guided responses · "+e01.answered+" answered",status:e01.status,open:onE01,review:e01.status==="ready"||e01.status==="reviewed"?onE01Delayed:undefined,recommended:route.primary.origin==="e01"&&route.primary.kind!=="delayed"}]:[]),
  ...e02.scenes.map(s=>({id:s.id,title:s.title,progress:s.completedControlled+" / "+s.requiredControlled+" controlled correct",status:s.state,open:()=>onE02(s.id),review:s.state==="ready"||s.state==="reviewed"?()=>onE02Delayed(s.id):undefined,recommended:route.primary.origin==="e02"&&route.primary.targetId===s.id&&route.primary.kind!=="delayed"})),
  ...e02.unmappedScenes.map(s=>({id:s.id,title:s.title,progress:"Original reading · ungraded",status:"preview",preview:true,open:()=>onE02Preview(s.id),recommended:false}))
 ];
 const a2:Node[]=[
  ...e03.scenes.map(s=>({id:"e03-"+s.id,title:s.title,progress:s.correct+" / "+s.required+" controlled correct",status:s.state,open:()=>onE03(s.id),review:s.state==="ready"||s.state==="reviewed"?()=>onE03Delayed(s.id):undefined,recommended:route.primary.origin==="e03"&&route.primary.targetId===s.id})),
  ...e04.scenes.map(s=>({id:"e04-"+s.id,title:s.title,progress:s.guidedCorrect+" / "+s.guidedTotal+" controlled correct",status:s.status,open:()=>onE04(s.id),review:s.status==="ready"||s.status==="reviewed"?()=>onE04Delayed(s.id):undefined,recommended:route.primary.origin==="e04"&&route.primary.targetId===s.id})),
  ...e03.unmappedScenes.map(s=>({id:"e03-preview-"+s.id,title:s.title,progress:"Original reading · ungraded",status:"preview",preview:true,open:()=>onE03Preview(s.id),recommended:false})),
  ...e04.unmapped.map(s=>({id:"e04-preview-"+s.id,title:s.title,progress:"Original reading · ungraded",status:"preview",preview:true,open:()=>onE04Preview(s.id),recommended:false}))
 ];
 const chapters=level==="A1"?A1.map((c,i)=>({id:i,title:c.title,jp:c.jp,nodes:a1.filter(n=>c.ids.includes(n.id))})):[
  {id:0,title:"Connected conversations",jp:"つながる会話",nodes:a2.filter(n=>n.id.startsWith("e03-"))},
  {id:1,title:"Everyday problem solving",jp:"暮らしの課題",nodes:a2.filter(n=>n.id.startsWith("e04-"))}
 ];
 const current=chapters.find(c=>c.id===selected)??chapters[0]!;
 const scoredNodes=current.nodes.filter(n=>!n.preview);
 const practised=scoredNodes.filter(n=>n.status==="waiting"||n.status==="ready"||n.status==="reviewed").length;
 return <section className="ux1-mobile-path" aria-labelledby="ux1-path-title">
  <header className="ux1-intro"><p className="ux1-eyebrow">LEARN · <span lang="ja">学ぶ</span></p><div className="ux1-path-head"><h1 id="ux1-path-title">Your learning path</h1><label><span className="ux1-sr">Learning level</span><select value={level} onChange={e=>{setChosenByLearner(true);setLevel(e.target.value as "A1"|"A2");setSelected(0);}}><option>A1</option><option>A2</option></select></label></div></header>
  <div className="ux1-chapter-tabs" role="group" aria-label="Learning chapters">{chapters.map(c=><button type="button" key={c.id} aria-pressed={c.id===current.id} onClick={()=>{setChosenByLearner(true);setSelected(c.id);}}>{c.title}</button>)}</div>
  <section className="ux1-chapter" aria-labelledby="ux1-chapter-title"><p className="ux1-eyebrow">{level} · CHAPTER {current.id+1}</p><h2 id="ux1-chapter-title">{current.title} <span lang="ja">{current.jp}</span></h2><p>{practised} / {scoredNodes.length} source-linked scenes practised or review-ready</p>{current.nodes.length>scoredNodes.length?<small>{current.nodes.length-scoredNodes.length} original reading preview(s) remain ungraded</small>:null}<progress value={practised} max={Math.max(1,scoredNodes.length)} aria-label="Source-linked chapter scenarios practised"/></section>
  <ol className="ux1-nodes">{current.nodes.map(n=><li className={n.recommended?"ux1-node ux1-node--recommended":"ux1-node"} key={n.id}><span className="ux1-node__mark" aria-hidden="true">{n.preview?"読":n.status==="reviewed"?"✓":n.recommended?"今":"学"}</span><div className="ux1-node__body"><h3>{n.title}</h3><p>{n.progress}</p><small>{n.preview?"Reading preview · not graded":n.status==="ready"?"Changed-context review ready":n.status==="waiting"?"Practised · review later":n.status.replaceAll("_"," ")}</small><div className="ux1-node__actions"><button type="button" disabled={busy} onClick={n.open}>{n.preview?"Read original":n.status==="not_started"?"Start lesson":"Practise lesson"}</button>{n.review?<button type="button" disabled={busy} onClick={n.review}>Delayed review</button>:null}</div></div></li>)}</ol>
  {current.nodes.length===0?<p role="status">No source-linked lessons are ready in this chapter. Open the full course catalogue below.</p>:null}
  {(route.primary.kind==="scheduled"||route.primary.kind==="delayed")?<button type="button" className="ux1-path-review" disabled={busy} onClick={()=>onOpenE07(route.primary)}>{route.primary.label} →</button>:null}
  <p className="ux1-path-note">Original situations, not an external language certification. Advanced course tools remain available below.</p>
 </section>;
}
