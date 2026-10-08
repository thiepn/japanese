import "./j11-operations.css";
import "./j11.css";
import {useEffect,useState} from "react";
import {getRecentJapaneseAuthFailure} from "@thiepn/auth";
import {HumanReviewPanel} from "../study/HumanReviewPanel";
import {ReleaseOperationsPanel} from "../study/ReleaseOperationsPanel";
import {ReleaseIdentityPanel} from "../study/ReleaseIdentityPanel";
import {ProviderHealthPanel} from "../study/ProviderHealthPanel";
import {NativeCurationPanel} from "../immerse/NativeCurationPanel";

type Panel="overview"|"review"|"release"|"deployment"|"runtime"|"account";

const PANELS:readonly {id:Panel;glyph:string;label:string;note:string}[]=[
  {id:"overview",glyph:"総",label:"Overview",note:"Technical boundary"},
  {id:"review",glyph:"評",label:"Human review",note:"Advisory evidence"},
  {id:"release",glyph:"門",label:"Release gates",note:"Curation + qualification"},
  {id:"deployment",glyph:"版",label:"Deployment",note:"Build identity"},
  {id:"runtime",glyph:"脈",label:"Runtime",note:"Provider health"},
  {id:"account",glyph:"認",label:"Account",note:"Sign-in diagnostics"},
];

function initialPanel():Panel{
  try{
    const value=new URLSearchParams(window.location.search).get("panel");
    return PANELS.some((item)=>item.id===value)?value as Panel:"overview";
  }catch{return "overview";}
}

export function J11Diagnostics({onExit,accountStatus,accountConnected}:{onExit:()=>void;accountStatus:string;accountConnected:boolean}){
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
      {panel==="account"?<AccountDiagnostics status={accountStatus} connected={accountConnected}/>:null}
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
      <code>?diagnostics=1&amp;panel=account</code>
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
    case "account":return "See the last redacted Google callback failure and installed-PWA environment without revealing tokens or your account ID.";
  }
}


function AccountDiagnostics({status,connected}:{status:string;connected:boolean}){
  const [copyStatus,setCopyStatus]=useState("");
  const recent=getRecentJapaneseAuthFailure();
  const displayMode=window.matchMedia?.("(display-mode: standalone)").matches?"standalone":"browser";
  const failure=recent?.code??"none";
  const summary=[
    "Japanese Account diagnostics",
    "Auth status: "+status,
    "App connection: "+(connected?"connected":"not connected"),
    "Display mode: "+displayMode,
    "Recent OAuth failure: "+failure,
    "Logged at: "+(recent?new Date(recent.at).toISOString():"none"),
  ].join("\n");
  const help:Record<string,string>={
    "AUTH-01":"Google returned without a usable authorization code.",
    "AUTH-02":"Japanese could not exchange the returned authorization code for an Account session.",
    "AUTH-03":"The PKCE verification data was unavailable or rejected in this browser context.",
  };
  async function copy(){
    try{
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Diagnostics copied. No passwords, tokens, or account ID were included.");
    }catch{setCopyStatus("Clipboard unavailable. You can report the failure code displayed above.");}
  }
  return <section className="j11-account-diagnostics" aria-labelledby="j11-account-title">
    <header>
      <p className="j11-kicker">ACCOUNT · 認証</p>
      <h2 id="j11-account-title">Sign-in diagnostics</h2>
      <p>Local, non-secret troubleshooting details for Google → THIEPN Account → Japanese handoff. These checks do not prove that the OAuth provider is configured correctly.</p>
    </header>
    <dl>
      <div><dt>Account session</dt><dd>{status}</dd></div>
      <div><dt>Japanese connection</dt><dd>{connected?"Connected":"Not connected"}</dd></div>
      <div><dt>App display mode</dt><dd>{displayMode}</dd></div>
      <div><dt>Last OAuth failure</dt><dd>{failure}</dd></div>
      {recent?<div><dt>Failure explanation</dt><dd>{help[recent.code]}</dd></div>:null}
      {recent?<div><dt>Recorded locally</dt><dd>{new Date(recent.at).toLocaleString()}</dd></div>:null}
    </dl>
    <p>OAuth failure records expire after 30 minutes and store only a failure category and timestamp. Never share a callback URL containing an authorization code.</p>
    <button type="button" onClick={()=>void copy()}>Copy safe diagnostic summary</button>
    {copyStatus?<p role="status">{copyStatus}</p>:null}
  </section>;
}
