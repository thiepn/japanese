import { useEffect,useState } from "react";
import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "./c1Environment";
import {
  downloadC1Portfolio,getC1PortfolioExport,serializeC1PortfolioJson,serializeC1PortfolioMarkdown
} from "./c1PortfolioExport";

export function C1Portfolio(){
  const [portfolio,setPortfolio]=useState<C1PortfolioSummary|null>(null);
  const [environment,setEnvironment]=useState<C1EnvironmentProgress|null>(null);
  const [exporting,setExporting]=useState(false);
  useEffect(()=>{void Promise.all([getC1PortfolioSummary(),getC1EnvironmentProgress()]).then(([nextPortfolio,nextEnvironment])=>{setPortfolio(nextPortfolio);setEnvironment(nextEnvironment);}).catch(()=>{setPortfolio(null);setEnvironment(null);});},[]);

  async function exportPortfolio(format:"json"|"markdown"){
    setExporting(true);
    try{
      const value=await getC1PortfolioExport();
      const stamp=value.generatedAt.slice(0,10);
      if(format==="json")downloadC1Portfolio("japanese-c1-portfolio-"+stamp+".json",serializeC1PortfolioJson(value),"application/json");
      else downloadC1Portfolio("japanese-c1-portfolio-"+stamp+".md",serializeC1PortfolioMarkdown(value),"text/markdown");
    }finally{setExporting(false);}
  }

  if(!portfolio)return null;
  const developing=portfolio.domains.filter((domain)=>domain.status==="developing"||domain.status==="sustained").length;

  return <section className="b2-portfolio">
    <div className="section-heading">
      <div><span className="course-kicker">P15 C1 PORTFOLIO</span><h2>Long-form autonomy + real-source working evidence</h2></div>
      <span className="course-count">{portfolio.activeDays} active C1 days</span>
    </div>
    <p>P15 keeps the P14 longitudinal evidence and adds real-source research, source evaluation, specialist vocabulary, cited multi-day writing and unpredictable defense. It remains descriptive internal evidence rather than a CEFR C1 result.</p>
    <div className="portfolio-export-actions">
      <button className="unit-action" disabled={exporting} type="button" onClick={()=>void exportPortfolio("json")}>Export C1 JSON</button>
      <button className="quiet-button" disabled={exporting} type="button" onClick={()=>void exportPortfolio("markdown")}>Export C1 Markdown</button>
    </div>

    <div className="portfolio-stats">
      <PortfolioStat value={portfolio.readingTexts} label="C1 texts read"/>
      <PortfolioStat value={portfolio.listeningTexts} label="C1 texts heard"/>
      <PortfolioStat value={portfolio.synthesisPacks} label="Synthesis packs"/>
      <PortfolioStat value={portfolio.nativeSourceSyntheses} label="Native syntheses"/>
      <PortfolioStat value={portfolio.spontaneousCoachTurns} label="Spontaneous turns"/>
      <PortfolioStat value={portfolio.autonomyMissionsCompleted} label="Long-form missions"/>
      <PortfolioStat value={portfolio.reliability.reliableArtifacts} label="Reliable repeated artifacts"/>
      <PortfolioStat value={developing} label="Developing/sustained domains"/>
    </div>

    {environment?<section className="p15-portfolio-environment">
      <div className="section-heading"><div><span className="course-kicker">P15 AUTHENTIC ENVIRONMENT</span><h3>Real-source research + multi-day production</h3></div><span>{environment.writingProjectsCompleted}/{environment.projects.length} projects complete</span></div>
      <div className="portfolio-stats">
        <PortfolioStat value={environment.registeredSources} label="External sources"/>
        <PortfolioStat value={environment.evaluatedSources} label="Evaluated sources"/>
        <PortfolioStat value={environment.sourceGenres} label="Source genres"/>
        <PortfolioStat value={environment.sourcePublishers} label="Publishers"/>
        <PortfolioStat value={environment.specialistTerms} label="Specialist terms"/>
        <PortfolioStat value={environment.defenseTurns} label="Defense turns"/>
        <PortfolioStat value={environment.uniquePressureTypes} label="Pressure types"/>
        <PortfolioStat value={environment.activeDays} label="Environment days"/>
      </div>
      <div className="portfolio-mission-list">{environment.projects.map((entry)=><div key={entry.project.id}>
        <div><strong>{entry.project.title}</strong><span>{entry.complete?"complete":entry.nextStage.replaceAll("_"," ")}</span></div>
        <div className="meter"><span style={{width:projectPercent(entry.nextStage)+"%"}}/></div>
        <small>{entry.sourceMap?.sourceIds.length??0} sources · {entry.defenses.length} defenses{entry.revision?" · delayed revision":""}{entry.reflection?" · reflection":""}</small>
      </div>)}</div>
      <p className="course-note">Learner source evaluation is critical-reading evidence, not independent source verification. External pages remain external; P15 stores your traceable notes, source identity and authored work.</p>
    </section>:null}

    <div className="portfolio-columns">
      <article>
        <span className="course-kicker">DOMAIN SPECIALIZATION</span>
        <h3>Breadth first, then sustained evidence</h3>
        <div className="portfolio-mission-list">{portfolio.domains.map((domain)=><div key={domain.missionId}>
          <div><strong>{domain.title}</strong><span>{domain.status.replace("_"," ")}</span></div>
          <div className="meter"><span style={{width:Math.round(domain.completionRatio*100)+"%"}}/></div>
          <small>{domain.completedStages}/{domain.totalStages} stages · {domain.activeDays} active day{domain.activeDays===1?"":"s"}{domain.nextStage?" · next: "+domain.nextStage.title:" · mission complete"}</small>
        </div>)}</div>
      </article>

      <article>
        <span className="course-kicker">CROSS-SESSION RELIABILITY</span>
        <h3>Can the same advanced performance survive time?</h3>
        <p>{portfolio.reliability.successfulAttempts} structurally successful attempts across {portfolio.reliability.activeDays} active production days. Reliability requires success on at least two days separated by 20+ hours.</p>
        {portfolio.reliability.artifactEvidence.length?<div className="reliable-task-list">{portfolio.reliability.artifactEvidence.slice(0,10).map((item)=><div key={item.id}>
          <span>{item.reliableAcrossSessions?"✓":"○"}</span>
          <div><strong>{item.title}</strong><small>{item.attempts} attempts · {item.successfulDays} successful days · {Math.round(item.spanHours)}h span</small></div>
        </div>)}</div>:<small>No graded C1 production or synthesis evidence yet.</small>}
      </article>
    </div>

    {portfolio.reliability.interactionEvidence.length?<section className="portfolio-patterns">
      <span className="course-kicker">SPONTANEOUS INTERACTION RELIABILITY</span>
      <div>{portfolio.reliability.interactionEvidence.map((item)=><article key={item.chainId}>
        <strong>{item.reliableAcrossSessions?"✓":"○"}</strong>
        <p>{item.title}</p>
        <small>{item.turns} turns · {item.stagesCovered}/{item.totalStages} stages · {item.repeatedStages} stage{item.repeatedStages===1?"":"s"} repeated across days · {item.activeDays} active days · {Math.round(item.spanHours)}h span</small>
      </article>)}</div>
    </section>:null}

    {portfolio.recentArtifacts.length?<details className="portfolio-artifacts">
      <summary>Recent C1 productive artifacts ({portfolio.recentArtifacts.length})</summary>
      <div>{portfolio.recentArtifacts.map((artifact)=><article key={artifact.eventId}>
        <div><strong>{artifact.title}</strong><span>{artifact.kind} · {artifact.mode} · {new Date(artifact.occurredAt).toLocaleDateString()}</span></div>
        <p lang="ja">{artifact.response}</p>
        <small>{artifact.advisory?"AI-coach artifact · advisory only":"Internal structural evidence · "+artifact.result}</small>
      </article>)}</div>
    </details>:null}

    <p className="course-note">Repeated internal success, source exposure, learner source evaluation and AI-supported interaction remain descriptive learner evidence. P15 does not convert them into external certification, independent fact verification, semantic human review or acoustic scoring.</p>
  </section>;
}

function PortfolioStat({value,label}:{value:number;label:string}){
  return <div><strong>{value}</strong><span>{label}</span></div>;
}


function projectPercent(stage:string):number{
  const order=["source_map","draft","defense","waiting_revision","revision","reflection","complete"];
  const index=Math.max(0,order.indexOf(stage));
  return Math.round(index/(order.length-1)*100);
}
