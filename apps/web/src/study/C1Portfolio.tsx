import { useEffect,useState } from "react";
import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "./c1Environment";
import { getC1ResearchQualityProgress,type C1ResearchQualityProgress } from "./c1ResearchQuality";
import {
  downloadC1Portfolio,getC1PortfolioExport,serializeC1PortfolioJson,serializeC1PortfolioMarkdown
} from "./c1PortfolioExport";

export function C1Portfolio(){
  const [portfolio,setPortfolio]=useState<C1PortfolioSummary|null>(null);
  const [environment,setEnvironment]=useState<C1EnvironmentProgress|null>(null);
  const [quality,setQuality]=useState<C1ResearchQualityProgress|null>(null);
  const [exporting,setExporting]=useState(false);
  useEffect(()=>{void Promise.all([getC1PortfolioSummary(),getC1EnvironmentProgress(),getC1ResearchQualityProgress()]).then(([nextPortfolio,nextEnvironment,nextQuality])=>{setPortfolio(nextPortfolio);setEnvironment(nextEnvironment);setQuality(nextQuality);}).catch(()=>{setPortfolio(null);setEnvironment(null);setQuality(null);});},[]);

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
      <div><span className="course-kicker">P16 C1 PORTFOLIO</span><h2>Long-form autonomy + research-quality evidence</h2></div>
      <span className="course-count">{portfolio.activeDays} active C1 days</span>
    </div>
    <p>P16 keeps the P14–P15 longitudinal and real-source evidence, then adds bibliography provenance, licensed/private source handling, artifact-bound human review and specialist-track depth. It remains descriptive evidence rather than a CEFR C1 result.</p>
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

    {quality?<section className="p16-portfolio-quality">
      <div className="section-heading"><div><span className="course-kicker">P16 RESEARCH QUALITY</span><h3>Provenance + human review + specialist depth</h3></div><span>{quality.reviewedProjects} projects human-reviewed</span></div>
      <div className="portfolio-stats">
        <PortfolioStat value={quality.bibliographySources} label="Sources documented"/>
        <PortfolioStat value={quality.privateExcerpts} label="Private excerpts"/>
        <PortfolioStat value={quality.redistributableExcerpts} label="Licensed excerpts"/>
        <PortfolioStat value={quality.reviewedProjects} label="Human-reviewed projects"/>
        <PortfolioStat value={quality.humanReviews.length} label="Review records"/>
        <PortfolioStat value={quality.specialistTracks.length} label="Specialist tracks"/>
        <PortfolioStat value={quality.specialistDomains} label="Specialist domains"/>
        <PortfolioStat value={quality.bibliographyRecords.filter((item)=>Boolean(item.doi)).length} label="DOI-linked sources"/>
      </div>
      {quality.humanReviews.length?<div className="portfolio-mission-list">{quality.humanReviews.slice(0,8).map((review)=><div key={review.id}>
        <div><strong>{review.projectTitle}</strong><span>{review.reviewerRole.replaceAll("_"," ")}</span></div>
        <small>argument {review.scores.argumentControl}/4 · sources {review.scores.sourceUse}/4 · language {review.scores.languagePrecision}/4 · register {review.scores.registerControl}/4{review.blockingIssues.length?" · "+review.blockingIssues.length+" blocking issue(s)":""}</small>
      </div>)}</div>:null}
      <p className="course-note">Human review is external qualitative evidence only. Bibliography metadata and stored excerpts improve traceability; they do not prove source interpretation, change FSRS mastery or award a CEFR result.</p>
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

    <p className="course-note">Repeated internal success, source exposure, learner source evaluation, human review and AI-supported interaction remain explicitly bounded evidence. P16 does not convert them into accredited certification, independent fact verification, automatic mastery updates or acoustic scoring.</p>
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
