import { useEffect,useState } from "react";
import {
  getC2ReadinessReport,getC2ReadinessSummary,serializeC2ReadinessMarkdown,
  type C2ReadinessSummary
} from "./c2Readiness";

export function C2ReadinessPanel(){
  const [summary,setSummary]=useState<C2ReadinessSummary|null>(null);
  const [exporting,setExporting]=useState(false);
  useEffect(()=>{void getC2ReadinessSummary().then(setSummary).catch(()=>setSummary(null));},[]);

  async function exportReport(format:"json"|"markdown"){
    setExporting(true);
    try{
      const report=await getC2ReadinessReport();
      const stamp=report.generatedAt.slice(0,10);
      if(format==="json")download("japanese-advanced-pathway-readiness-"+stamp+".json",JSON.stringify(report,null,2),"application/json");
      else download("japanese-advanced-pathway-readiness-"+stamp+".md",serializeC2ReadinessMarkdown(report),"text/markdown");
    }finally{setExporting(false);}
  }

  if(!summary)return null;
  const requirementPercent=Math.round(summary.requirementsMet/summary.requirements.length*100);

  return <section className={"p20-readiness "+(summary.qualified?"qualified":"")}>
    <div className="section-heading">
      <div><span className="course-kicker">P20 LONGITUDINAL C2 READINESS</span><h2>Consolidate advanced evidence before calling the pathway qualified</h2></div>
      <span className="p20-status">{summary.statusLabel}</span>
    </div>
    <p className="course-note">P20 is an internal product qualification for the advanced-learning pathway. It requires durable evidence, repeated broad human review and resolved reviewer calibration. It is not an accredited CEFR C2 certificate.</p>

    <div className="p20-hero">
      <div className="p20-gauge">
        <div><strong>{summary.requirementsMet}/{summary.requirements.length}</strong><span>requirements met</span></div>
        <div className="meter"><span style={{width:requirementPercent+"%"}}/></div>
        <small>{requirementPercent}% of the transparent internal qualification gate</small>
      </div>
      <div className="p20-hero-stats">
        <P20Stat value={summary.evidenceSpanDays} label="evidence span days"/>
        <P20Stat value={summary.advancedActiveDays} label="advanced active days"/>
        <P20Stat value={summary.stableDimensions} label="stable dimensions"/>
        <P20Stat value={summary.strongDimensions} label="strong dimensions"/>
        <P20Stat value={summary.broadExternalReviews} label="broad external reviews"/>
        <P20Stat value={summary.distinctReviewerLabels} label="reviewer labels"/>
      </div>
      <div className="p20-export">
        <button className="unit-action" type="button" disabled={exporting} onClick={()=>void exportReport("json")}>Export readiness JSON</button>
        <button className="quiet-button" type="button" disabled={exporting} onClick={()=>void exportReport("markdown")}>Export readiness Markdown</button>
      </div>
    </div>

    {summary.qualified?<div className="p20-qualified-card">
      <span>INTERNAL PRODUCT QUALIFICATION</span>
      <h3>Advanced pathway qualified</h3>
      <p>The current evidence clears every P20 gate. This means the THIEPN Japanese advanced-learning pathway has enough longitudinal, externally calibrated evidence to mark the learner internally qualified for this pathway. It does not certify CEFR C2.</p>
    </div>:null}

    <section className="p20-section">
      <div className="section-heading"><div><span className="course-kicker">QUALIFICATION GATES</span><h3>Every gate is explicit and independently inspectable</h3></div><span>{summary.requirementsMet}/{summary.requirements.length}</span></div>
      <div className="p20-requirements">{summary.requirements.map((item)=><article className={item.met?"met":""} key={item.id}>
        <span className="p20-check">{item.met?"✓":"○"}</span>
        <div><div><strong>{item.label}</strong><span>{item.current}</span></div><small>Target: {item.target}</small><p>{item.explanation}</p></div>
      </article>)}</div>
    </section>

    <section className="p20-section">
      <div className="section-heading"><div><span className="course-kicker">SEVEN-DIMENSION MATRIX</span><h3>Internal support stays separate from external human scores</h3></div><span>{summary.externalAverage===null?"external average n/a":summary.externalAverage.toFixed(2)+"/5 external average"}</span></div>
      <div className="p20-matrix" role="table" aria-label="C2-oriented readiness dimensions">
        <div className="p20-matrix-head" role="row"><span>Dimension</span><span>Internal support</span><span>Broad observations</span><span>Mean</span><span>Latest</span><span>Trend</span><span>Status</span></div>
        {summary.dimensions.map((item)=><div className={"p20-matrix-row "+item.status} role="row" key={item.dimension}>
          <strong>{item.label}</strong>
          <span>{item.internalSupport} · {item.internalEvidenceCount}</span>
          <span>{item.broadObservations}</span>
          <span>{item.meanScore===null?"—":item.meanScore.toFixed(2)}</span>
          <span>{item.latestScore===null?"—":item.latestScore.toFixed(1)}</span>
          <span>{item.trend===null?"—":(item.trend>0?"+":"")+item.trend.toFixed(1)}</span>
          <span>{item.status}{item.persistentWeakness?" · persistent":""}</span>
        </div>)}
      </div>
      <p className="course-note">Internal support counts structural evidence only; it is never mathematically converted into a semantic language score. Final dimension status comes from repeated broad external observations.</p>
    </section>

    <section className="p20-section">
      <div className="section-heading"><div><span className="course-kicker">EXTERNAL CALIBRATION</span><h3>Compare broad reviewers instead of averaging disagreement away</h3></div><span>{summary.calibration.status.replaceAll("_"," ")}</span></div>
      {summary.calibration.earlierReviewer&&summary.calibration.laterReviewer?<div className="p20-calibration-head">
        <div><span>Earlier</span><strong>{summary.calibration.earlierReviewer}</strong></div>
        <div><span>Later</span><strong>{summary.calibration.laterReviewer}</strong></div>
        <div><span>Mean |Δ|</span><strong>{summary.calibration.meanAbsoluteDelta===null?"—":summary.calibration.meanAbsoluteDelta.toFixed(2)+"/5"}</strong></div>
        <div><span>Max |Δ|</span><strong>{summary.calibration.maxAbsoluteDelta===null?"—":summary.calibration.maxAbsoluteDelta.toFixed(1)+"/5"}</strong></div>
      </div>:<p className="p20-empty">Two broad reviews are needed before reviewer calibration can be compared.</p>}
      {summary.calibration.earlierReviewer&&summary.calibration.laterReviewer?<div className="p20-calibration-grid">{summary.calibration.dimensions.map((item)=><article className={item.delta!==null&&Math.abs(item.delta)>=3?"divergent":""} key={item.dimension}>
        <strong>{item.label}</strong>
        <span>{item.earlier===null?"—":item.earlier+"/5"} → {item.later===null?"—":item.later+"/5"}</span>
        <small>{item.delta===null?"not jointly observed":"Δ "+(item.delta>0?"+":"")+item.delta.toFixed(1)}</small>
      </article>)}</div>:null}
      <p className="course-note">Different reviewer labels are useful calibration evidence, but the app does not verify that they are different people or validate their credentials. A ≥3-point disagreement on any jointly scored dimension blocks qualification.</p>
    </section>

    {summary.nextActions.length?<section className="p20-next">
      <span className="course-kicker">NEXT EVIDENCE</span><h3>Highest-value gaps to close</h3>
      <ol>{summary.nextActions.map((item)=><li key={item}>{item}</li>)}</ol>
    </section>:null}

    <p className="p20-boundary">P20 qualification is deliberately product-scoped: accredited CEFR certification = false · reviewer identity verified = false · reviewer scores change mastery = false · internal evidence becomes semantic score = false · raw local audio included in export = false.</p>
  </section>;
}

function P20Stat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}

function download(filename:string,content:string,mime:string){
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
