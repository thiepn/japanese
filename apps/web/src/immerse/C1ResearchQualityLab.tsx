import { useEffect,useMemo,useState } from "react";
import {
  buildC1ReviewPacket,formatC1Bibliography,getC1ResearchQualityProgress,saveC1BibliographyRecord,saveC1ProjectHumanReview,
  saveC1SourceExcerpt,saveC1SpecialistTrack,
  type C1CitationStyle,type C1ExcerptAccess,type C1HumanReviewScores,type C1ResearchQualityProgress,type C1ReviewerRole
} from "../study/c1ResearchQuality";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "../study/c1Environment";

const EMPTY_ENV:C1EnvironmentProgress={
  activeDays:0,registeredSources:0,evaluatedSources:0,sourceGenres:0,sourcePublishers:0,specialistTerms:0,
  writingProjectsStarted:0,writingProjectsCompleted:0,defenseTurns:0,uniquePressureTypes:0,
  sourceEvaluations:[],sources:[],specialistTermItems:[],projects:[]
};
const EMPTY_QUALITY:C1ResearchQualityProgress={
  bibliographyRecords:[],excerpts:[],humanReviews:[],specialistTracks:[],
  bibliographySources:0,privateExcerpts:0,redistributableExcerpts:0,reviewedProjects:0,specialistDomains:0
};
const DEFAULT_SCORES:C1HumanReviewScores={argumentControl:2,sourceUse:2,languagePrecision:2,registerControl:2};

export function C1ResearchQualityLab(){
  const [environment,setEnvironment]=useState<C1EnvironmentProgress>(EMPTY_ENV);
  const [quality,setQuality]=useState<C1ResearchQualityProgress>(EMPTY_QUALITY);
  const [message,setMessage]=useState("");
  const [sourceId,setSourceId]=useState("");
  const [author,setAuthor]=useState("");
  const [publishedDate,setPublishedDate]=useState("");
  const [accessedDate,setAccessedDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [containerTitle,setContainerTitle]=useState("");
  const [doi,setDoi]=useState("");
  const [citationStyle,setCitationStyle]=useState<C1CitationStyle>("japanese");
  const [locator,setLocator]=useState("");
  const [excerptText,setExcerptText]=useState("");
  const [excerptAccess,setExcerptAccess]=useState<C1ExcerptAccess>("private_reference");
  const [licenseName,setLicenseName]=useState("");
  const [licenseUrl,setLicenseUrl]=useState("");
  const [projectId,setProjectId]=useState("");
  const [reviewerName,setReviewerName]=useState("");
  const [reviewerRole,setReviewerRole]=useState<C1ReviewerRole>("language_professional");
  const [scores,setScores]=useState<C1HumanReviewScores>(DEFAULT_SCORES);
  const [feedback,setFeedback]=useState("");
  const [blockingIssues,setBlockingIssues]=useState("");
  const [trackTitle,setTrackTitle]=useState("");
  const [trackDomain,setTrackDomain]=useState("");
  const [trackGoal,setTrackGoal]=useState("");
  const [trackSourceIds,setTrackSourceIds]=useState<string[]>([]);
  const [trackTermIds,setTrackTermIds]=useState<string[]>([]);
  const [trackProjectIds,setTrackProjectIds]=useState<string[]>([]);

  async function refresh(){
    const [nextEnvironment,nextQuality]=await Promise.all([getC1EnvironmentProgress(),getC1ResearchQualityProgress()]);
    setEnvironment(nextEnvironment);setQuality(nextQuality);
    if(!sourceId&&nextEnvironment.sources[0])setSourceId(nextEnvironment.sources[0].id);
    const completed=nextEnvironment.projects.find((item)=>item.complete);
    if(!projectId&&completed)setProjectId(completed.project.id);
  }
  useEffect(()=>{void refresh().catch(()=>{setEnvironment(EMPTY_ENV);setQuality(EMPTY_QUALITY);});},[]);

  const source=environment.sources.find((item)=>item.id===sourceId)??null;
  const bibliography=quality.bibliographyRecords.find((item)=>item.sourceId===sourceId)??null;
  const completedProjects=environment.projects.filter((item)=>item.complete);
  const reviewProject=completedProjects.find((item)=>item.project.id===projectId)??null;
  const citationPreview=useMemo(()=>bibliography?formatC1Bibliography(bibliography,citationStyle):"",[bibliography,citationStyle]);

  async function saveBibliography(){
    setMessage("");
    try{
      await saveC1BibliographyRecord({sourceId,author,publishedDate,accessedDate,containerTitle,doi});
      setMessage("Bibliography metadata saved. Citation styles are presentation only; the source URL remains authoritative.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveExcerpt(){
    setMessage("");
    try{
      await saveC1SourceExcerpt({sourceId,locator,text:excerptText,access:excerptAccess,licenseName,licenseUrl});
      setLocator("");setExcerptText("");setLicenseName("");setLicenseUrl("");
      setMessage(excerptAccess==="private_reference"?"Private reference excerpt saved locally as learner-supplied material.":"Redistributable excerpt saved with explicit license metadata.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveReview(){
    setMessage("");
    try{
      await saveC1ProjectHumanReview({
        projectId,reviewerName,reviewerRole,scores,feedback,
        blockingIssues:blockingIssues.split("\n").map((item)=>item.trim()).filter(Boolean)
      });
      setFeedback("");setBlockingIssues("");
      setMessage("Human review saved as external qualitative evidence. It does not update mastery or award a CEFR result.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  function exportReviewPacket(){
    if(!reviewProject)return;
    try{
      const packet=buildC1ReviewPacket({project:reviewProject,sources:environment.sources,bibliography:quality.bibliographyRecords});
      const blob=new Blob([JSON.stringify(packet,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement("a");anchor.href=url;anchor.download=reviewProject.project.id+"-c1-review-packet.json";anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),0);
      setMessage("Review packet exported with revision, defenses, source map and rubric.");
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveTrack(){
    setMessage("");
    try{
      await saveC1SpecialistTrack({
        title:trackTitle,domain:trackDomain,goal:trackGoal,
        sourceIds:trackSourceIds,termIds:trackTermIds,projectIds:trackProjectIds
      });
      setTrackTitle("");setTrackDomain("");setTrackGoal("");setTrackSourceIds([]);setTrackTermIds([]);setTrackProjectIds([]);
      setMessage("Specialist track saved as an evidence-linked plan, not as a new mastery score.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  return <section className="p16-quality" id="p16-c1-research-quality">
    <div className="section-heading">
      <div><span className="course-kicker">C1 RESEARCH QUALITY</span><h2>Turn real-source work into research-grade evidence</h2></div>
      <span className="course-count">quality · provenance · human review</span>
    </div>
    <p className="course-note">This workspace deepens the real-source environment without adding another mastery layer: structured bibliography, learner-supplied licensed/private excerpts, artifact-bound human review and interest-driven specialist tracks. The app does not automatically scrape or republish external pages.</p>

    <div className="p16-stats">
      <QualityStat value={quality.bibliographySources} label="sources documented"/>
      <QualityStat value={quality.privateExcerpts+quality.redistributableExcerpts} label="source excerpts"/>
      <QualityStat value={quality.reviewedProjects} label="projects reviewed"/>
      <QualityStat value={quality.specialistDomains} label="specialist domains"/>
    </div>

    <div className="p16-grid">
      <article className="p16-card">
        <div className="p16-card-head"><span>01 · BIBLIOGRAPHY</span><h3>Document the source you actually used</h3></div>
        {environment.sources.length?<div className="p16-form">
          <label>Registered source<select value={sourceId} onChange={(event)=>setSourceId(event.target.value)}>{environment.sources.map((item)=><option key={item.id} value={item.id}>{item.publisher} · {item.title}</option>)}</select></label>
          {source?<p className="p16-source-context"><strong>{source.publisher}</strong><span>{source.genre.replaceAll("_"," ")} · {source.sourceRole.replaceAll("_"," ")}</span><a href={source.url} target="_blank" rel="noreferrer">Open exact source ↗</a></p>:null}
          <div className="p16-two"><label>Author / responsible person<input value={author} onChange={(event)=>setAuthor(event.target.value)} placeholder="Optional"/></label><label>Published date<input type="date" value={publishedDate} onChange={(event)=>setPublishedDate(event.target.value)}/></label></div>
          <div className="p16-two"><label>Container / report / journal<input value={containerTitle} onChange={(event)=>setContainerTitle(event.target.value)} placeholder="Optional"/></label><label>Accessed<input type="date" value={accessedDate} onChange={(event)=>setAccessedDate(event.target.value)}/></label></div>
          <label>DOI<input value={doi} onChange={(event)=>setDoi(event.target.value)} placeholder="Optional · 10.xxxx/xxxxx"/></label>
          <button className="unit-action" type="button" disabled={!sourceId} onClick={()=>void saveBibliography()}>Save bibliography metadata</button>
          {bibliography?<div className="p16-citation-preview"><div><strong>Citation preview</strong><select aria-label="Citation style" value={citationStyle} onChange={(event)=>setCitationStyle(event.target.value as C1CitationStyle)}><option value="japanese">Japanese research note</option><option value="apa">APA-like</option><option value="compact">Compact</option></select></div><p>{citationPreview}</p></div>:null}
        </div>:<p className="p16-empty">Register a real source in the Source desk first.</p>}
      </article>

      <article className="p16-card">
        <div className="p16-card-head"><span>02 · SOURCE VAULT</span><h3>Keep only material you are allowed to keep</h3></div>
        {source?<div className="p16-form">
          <label>Locator<input value={locator} onChange={(event)=>setLocator(event.target.value)} placeholder="Page, section, table, paragraph, timestamp…"/></label>
          <label>Storage status<select value={excerptAccess} onChange={(event)=>setExcerptAccess(event.target.value as C1ExcerptAccess)}><option value="private_reference">Private reference only</option><option value="redistributable">Redistributable / licensed</option></select></label>
          {excerptAccess==="redistributable"?<div className="p16-two"><label>License<input value={licenseName} onChange={(event)=>setLicenseName(event.target.value)} placeholder="e.g. CC BY 4.0"/></label><label>License URL<input value={licenseUrl} onChange={(event)=>setLicenseUrl(event.target.value)} placeholder="https://…"/></label></div>:<p className="p16-boundary">Private reference excerpts stay learner-supplied and local. They are not promoted into the public canonical content package.</p>}
          <label>Excerpt<textarea value={excerptText} onChange={(event)=>setExcerptText(event.target.value)} rows={7} placeholder="Paste only the passage you need for your own study/research workflow."/></label>
          <button className="unit-action" type="button" disabled={!sourceId||excerptText.trim().length<40} onClick={()=>void saveExcerpt()}>Save source excerpt</button>
        </div>:<p className="p16-empty">Select a registered source first.</p>}
      </article>

      <article className="p16-card">
        <div className="p16-card-head"><span>03 · HUMAN REVIEW</span><h3>Bind expert feedback to the exact finished artifact</h3></div>
        {completedProjects.length?<div className="p16-form">
          <label>Completed project<select value={projectId} onChange={(event)=>setProjectId(event.target.value)}>{completedProjects.map((item)=><option key={item.project.id} value={item.project.id}>{item.project.title}</option>)}</select></label>
          <button className="quiet-button" type="button" onClick={exportReviewPacket}>Export reviewer packet</button>
          <div className="p16-two"><label>Reviewer<input value={reviewerName} onChange={(event)=>setReviewerName(event.target.value)} placeholder="Name"/></label><label>Role<select value={reviewerRole} onChange={(event)=>setReviewerRole(event.target.value as C1ReviewerRole)}><option value="language_professional">Language professional</option><option value="teacher">Teacher</option><option value="tutor">Tutor</option><option value="peer_specialist">Peer specialist</option></select></label></div>
          <div className="p16-rubric">
            <ScoreField label="Argument" value={scores.argumentControl} setValue={(value)=>setScores((current)=>({...current,argumentControl:value}))}/>
            <ScoreField label="Source use" value={scores.sourceUse} setValue={(value)=>setScores((current)=>({...current,sourceUse:value}))}/>
            <ScoreField label="Language" value={scores.languagePrecision} setValue={(value)=>setScores((current)=>({...current,languagePrecision:value}))}/>
            <ScoreField label="Register" value={scores.registerControl} setValue={(value)=>setScores((current)=>({...current,registerControl:value}))}/>
          </div>
          <label>Qualitative feedback<textarea value={feedback} onChange={(event)=>setFeedback(event.target.value)} rows={6} placeholder="What is strong, what remains weak, and what should change next?"/></label>
          <label>Blocking issues<textarea value={blockingIssues} onChange={(event)=>setBlockingIssues(event.target.value)} rows={3} placeholder="Optional · one issue per line"/></label>
          <button className="unit-action" type="button" disabled={!projectId||feedback.trim().length<80} onClick={()=>void saveReview()}>Save human review</button>
        </div>:<p className="p16-empty">Finish a real-source project through delayed revision + reflection before requesting formal human review.</p>}
      </article>

      <article className="p16-card">
        <div className="p16-card-head"><span>04 · SPECIALIST TRACK</span><h3>Build depth around your actual interests</h3></div>
        <div className="p16-form">
          <div className="p16-two"><label>Track title<input value={trackTitle} onChange={(event)=>setTrackTitle(event.target.value)} placeholder="e.g. Japanese education policy"/></label><label>Domain<input value={trackDomain} onChange={(event)=>setTrackDomain(event.target.value)} placeholder="education / policy"/></label></div>
          <label>Working goal<textarea value={trackGoal} onChange={(event)=>setTrackGoal(event.target.value)} rows={4} placeholder="Define the Japanese-language capability you want to build and the kind of evidence that would count."/></label>
          <EvidencePicker title="Sources" empty="No registered sources yet." items={environment.sources.map((item)=>({id:item.id,label:item.publisher+" · "+item.title}))} selected={trackSourceIds} setSelected={setTrackSourceIds}/>
          <EvidencePicker title="Specialist terms" empty="No specialist terms yet." items={environment.specialistTermItems.map((item)=>({id:item.id,label:item.canonicalForm+" · "+item.meaning}))} selected={trackTermIds} setSelected={setTrackTermIds}/>
          <EvidencePicker title="Projects" empty="No C1 projects yet." items={environment.projects.filter((item)=>item.sourceMap||item.draft||item.complete).map((item)=>({id:item.project.id,label:item.project.title}))} selected={trackProjectIds} setSelected={setTrackProjectIds}/>
          <button className="unit-action" type="button" disabled={trackGoal.trim().length<40||trackSourceIds.length+trackTermIds.length+trackProjectIds.length<3} onClick={()=>void saveTrack()}>Save specialist track</button>
          {quality.specialistTracks.length?<div className="p16-track-list">{quality.specialistTracks.map((track)=><div key={track.id}><strong>{track.title}</strong><span>{track.domain} · {track.sourceIds.length} sources · {track.termIds.length} terms · {track.projectIds.length} projects</span><p>{track.goal}</p></div>)}</div>:null}
        </div>
      </article>
    </div>
    {message?<p className="p16-message" role="status">{message}</p>:null}
  </section>;
}

function QualityStat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}

function ScoreField({label,value,setValue}:{label:string;value:number;setValue:(value:number)=>void}){
  return <label>{label}<select value={value} onChange={(event)=>setValue(Number(event.target.value))}>{[0,1,2,3,4].map((score)=><option key={score} value={score}>{score}</option>)}</select></label>;
}

function EvidencePicker({title,empty,items,selected,setSelected}:{title:string;empty:string;items:Array<{id:string;label:string}>;selected:string[];setSelected:(value:string[])=>void}){
  function toggle(id:string){setSelected(selected.includes(id)?selected.filter((item)=>item!==id):[...selected,id]);}
  return <fieldset className="p16-picker"><legend>{title}</legend>{items.length?items.map((item)=><label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)}/><span>{item.label}</span></label>):<small>{empty}</small>}</fieldset>;
}

function errorMessage(error:unknown):string{return error instanceof Error?error.message:"Research action failed.";}
