import { useEffect,useState } from "react";
import { getB2PortfolioSummary,type B2PortfolioSummary } from "./reliability";
import { downloadPortfolioText,getB2PortfolioExport,serializeB2PortfolioJson,serializeB2PortfolioMarkdown } from "./portfolioExport";

export function B2Portfolio(){
  const [portfolio,setPortfolio]=useState<B2PortfolioSummary|null>(null);
  const [exporting,setExporting]=useState(false);
  useEffect(()=>{void getB2PortfolioSummary().then(setPortfolio).catch(()=>setPortfolio(null));},[]);
  async function exportPortfolio(format:"json"|"markdown"){
    setExporting(true);
    try{
      const value=await getB2PortfolioExport();
      const stamp=value.generatedAt.slice(0,10);
      if(format==="json")downloadPortfolioText("japanese-b2-portfolio-"+stamp+".json",serializeB2PortfolioJson(value),"application/json");
      else downloadPortfolioText("japanese-b2-portfolio-"+stamp+".md",serializeB2PortfolioMarkdown(value),"text/markdown");
    }finally{setExporting(false);}
  }
  if(!portfolio)return null;

  return <section className="b2-portfolio">
    <div className="section-heading">
      <div><span className="course-kicker">B2 LONGITUDINAL PORTFOLIO</span><h2>Longitudinal evidence, not a pass/fail badge</h2></div>
      <span className="course-count">{portfolio.activeDays} active days</span>
    </div>
    <p>Portfolio evidence accumulates from normal reading, listening, speaking, writing and advisory revision events. It shows breadth and repeated performance without turning the internal data into an accredited CEFR verdict.</p>
    <div className="portfolio-export-actions"><button className="unit-action" disabled={exporting} type="button" onClick={()=>void exportPortfolio("json")}>Export JSON</button><button className="quiet-button" disabled={exporting} type="button" onClick={()=>void exportPortfolio("markdown")}>Export Markdown</button></div>

    <div className="portfolio-stats">
      <PortfolioStat value={portfolio.readingTexts} label="B2 texts read"/>
      <PortfolioStat value={portfolio.listeningTexts} label="B2 texts heard"/>
      <PortfolioStat value={portfolio.speakingTasks} label="Speaking tasks"/>
      <PortfolioStat value={portfolio.writingTasks} label="Writing tasks"/>
      <PortfolioStat value={portfolio.reliability.reliableTasks} label="Cross-session reliable tasks"/>
      <PortfolioStat value={portfolio.reliability.transferredChunks} label="Chunks transferred across contexts"/>
      <PortfolioStat value={portfolio.delayedRevisions} label="Delayed revisions"/>
      <PortfolioStat value={portfolio.reliability.recurringPatterns} label="Recurring feedback patterns"/>
    </div>

    <div className="portfolio-columns">
      <article>
        <span className="course-kicker">AUTONOMY MISSIONS</span>
        <h3>Multi-document chains</h3>
        <div className="portfolio-mission-list">{portfolio.missionProgress.map((entry)=><div key={entry.mission.id}>
          <div><strong>{entry.mission.title}</strong><span>{entry.completedStages}/{entry.totalStages}</span></div>
          <div className="meter"><span style={{width:Math.round(entry.completedStages/entry.totalStages*100)+"%"}}/></div>
          <small>{entry.activeDays} active day{entry.activeDays===1?"":"s"}{entry.nextStage?" · next: "+entry.nextStage.title:" · all evidence collected"}</small>
        </div>)}</div>
      </article>

      <article>
        <span className="course-kicker">PRODUCTION RELIABILITY</span>
        <h3>Repeat success after time has passed</h3>
        <p>{portfolio.reliability.successfulAttempts} structurally successful attempts across {portfolio.reliability.tasksAttempted} B2 tasks and {portfolio.reliability.activeDays} production days.</p>
        {portfolio.reliability.taskEvidence.length?<div className="reliable-task-list">{portfolio.reliability.taskEvidence.slice(0,8).map((item)=><div key={item.taskId}>
          <span>{item.reliableAcrossSessions?"✓":"○"}</span><div><strong>{item.title}</strong><small>{item.attempts} attempts · {item.successfulDays} successful days · {Math.round(item.spanHours)}h span</small></div>
        </div>)}</div>:<small>No graded B2 production evidence yet.</small>}
      </article>
    </div>

    {portfolio.reliability.feedbackPatterns.length?<section className="portfolio-patterns">
      <span className="course-kicker">RECURRING ADVISORY FEEDBACK</span>
      <div>{portfolio.reliability.feedbackPatterns.slice(0,6).map((pattern)=><article key={pattern.message}><strong>{pattern.count}×</strong><p>{pattern.message}</p><small>{pattern.areas.join(" · ")}</small></article>)}</div>
    </section>:null}

    {portfolio.recentArtifacts.length?<details className="portfolio-artifacts">
      <summary>Recent productive artifacts ({portfolio.productiveArtifacts})</summary>
      <div>{portfolio.recentArtifacts.map((artifact)=><article key={artifact.eventId}>
        <div><strong>{artifact.title}</strong><span>{artifact.mode} · {new Date(artifact.occurredAt).toLocaleDateString()}</span></div>
        <p lang="ja">{artifact.response}</p>
        <small>{artifact.advisory?"AI-coach artifact · advisory only":"Study Player artifact · structural result: "+artifact.result}{artifact.revisionOfEventId?" · delayed revision":""}</small>
      </article>)}</div>
    </details>:null}
  </section>;
}

function PortfolioStat({value,label}:{value:number;label:string}){
  return <div><strong>{value}</strong><span>{label}</span></div>;
}
