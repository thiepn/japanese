import "./j11-operations.css";
import "./j11.css";
import {useEffect,useState} from "react";
import {HumanReviewPanel} from "../study/HumanReviewPanel";
import {ReleaseOperationsPanel} from "../study/ReleaseOperationsPanel";
import {ReleaseIdentityPanel} from "../study/ReleaseIdentityPanel";
import {ProviderHealthPanel} from "../study/ProviderHealthPanel";
import {NativeCurationPanel} from "../immerse/NativeCurationPanel";

type Panel="overview"|"review"|"release"|"deployment"|"runtime";

const PANELS:readonly {id:Panel;glyph:string;label:string;note:string}[]=[
  {id:"overview",glyph:"総",label:"Overview",note:"Technical boundary"},
  {id:"review",glyph:"評",label:"Human review",note:"Advisory evidence"},
  {id:"release",glyph:"門",label:"Release gates",note:"Curation + qualification"},
  {id:"deployment",glyph:"版",label:"Deployment",note:"Build identity"},
  {id:"runtime",glyph:"脈",label:"Runtime",note:"Provider health"},
];

function initialPanel():Panel{
  try{
    const value=new URLSearchParams(window.location.search).get("panel");
    return PANELS.some((item)=>item.id===value)?value as Panel:"overview";
  }catch{return "overview";}
}

export function J11Diagnostics({onExit}:{onExit:()=>void}){
  const [panel,setPanel]=useState<Panel>(initialPanel);

  useEffect(()=>{
    const onPop=()=>setPanel(initialPanel());
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  function select(next:Panel){
    setPanel(next);
    const url=new URL(window.location.href);
    url.searchParams.set("diagnostics","1");
    if(next==="overview")url.searchParams.delete("panel");
    else url.searchParams.set("panel",next);
    window.history.replaceState({},"",url.pathname+url.search+url.hash);
  }

  return <section className="j11-diagnostics" aria-labelledby="j11-title">
    <header className="j11-diagnostics__masthead">
      <div>
        <p className="j11-kicker">TECHNICAL WORKSPACE · 診断</p>
        <h1 id="j11-title">Japanese operations</h1>
        <p>Release qualification, provider health, deployment identity, source curation and reviewer administration live here—not in the learner experience.</p>
      </div>
      <button className="j11-back" type="button" onClick={onExit}><span aria-hidden="true">←</span><strong>Back to Japanese</strong></button>
    </header>

    <div className="j11-boundary" role="note">
      <span aria-hidden="true">境</span>
      <p><strong>Operations boundary.</strong> Nothing in this workspace is learner mastery, a CEFR result, a scheduler input or a substitute for the evidence recorded by the learning product.</p>
    </div>

    <nav className="j11-tabs" aria-label="Technical diagnostics">
      {PANELS.map((item)=><button
        aria-current={panel===item.id?"page":undefined}
        className={panel===item.id?"active":""}
        key={item.id}
        onClick={()=>select(item.id)}
        type="button"
      >
        <span aria-hidden="true">{item.glyph}</span>
        <strong>{item.label}</strong>
        <small>{item.note}</small>
      </button>)}
    </nav>

    <div className="j11-panel" data-j11-panel={panel}>
      {panel==="overview"?<Overview onOpen={select}/>:null}
      {panel==="review"?<section aria-label="Human review administration"><HumanReviewPanel/></section>:null}
      {panel==="release"?<section aria-label="Release qualification and source curation"><NativeCurationPanel/><ReleaseOperationsPanel/></section>:null}
      {panel==="deployment"?<section aria-label="Deployment identity"><ReleaseIdentityPanel/></section>:null}
      {panel==="runtime"?<section aria-label="Runtime provider health"><ProviderHealthPanel/></section>:null}
    </div>
  </section>;
}

function Overview({onOpen}:{onOpen:(panel:Panel)=>void}){
  return <section className="j11-overview" aria-labelledby="j11-overview-title">
    <header>
      <p className="j11-kicker">SYSTEM MAP · 技術境界</p>
      <h2 id="j11-overview-title">Technical concerns stay technical</h2>
      <p>The learner surfaces now contain study, immersion, reference and evidence views only. Operational controls are available from this explicit workspace or a direct diagnostics URL.</p>
    </header>

    <div className="j11-overview__grid">
      {PANELS.filter((item)=>item.id!=="overview").map((item)=><article key={item.id}>
        <span aria-hidden="true">{item.glyph}</span>
        <div><small>{item.note}</small><h3>{item.label}</h3><p>{overviewCopy(item.id)}</p></div>
        <button type="button" onClick={()=>onOpen(item.id)}>Open {item.label.toLowerCase()}</button>
      </article>)}
    </div>

    <div className="j11-direct">
      <strong>Direct maintainer routes</strong>
      <code>?diagnostics=1&amp;panel=review</code>
      <code>?diagnostics=1&amp;panel=release</code>
      <code>?diagnostics=1&amp;panel=deployment</code>
      <code>?diagnostics=1&amp;panel=runtime</code>
    </div>
  </section>;
}

function overviewCopy(panel:Panel):string{
  switch(panel){
    case "overview":return "Technical workspace overview.";
    case "review":return "Review productive artifacts and export external-review handoffs without rewriting learner mastery.";
    case "release":return "Inspect source curation, static release gates, external evidence and physical-device qualification boundaries.";
    case "deployment":return "Inspect the immutable build/channel metadata actually embedded in the running deployment.";
    case "runtime":return "Inspect speech/audio/provider availability and operational degradation without exposing it as learner progress.";
  }
}
