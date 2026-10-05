import { useEffect,useMemo,useState } from "react";
import {
  c1PressureChallenges,c1SourcePortals,c1WritingProjects,citationEntries,drawC1PressureChallenge,evaluateC1ExternalSource,
  getC1EnvironmentProgress,portalById,recordC1ProjectDefense,registerC1ExternalSource,saveC1ProjectDraft,
  saveC1ProjectReflection,saveC1ProjectRevision,saveC1ProjectSourceMap,saveC1SpecialistTerm,
  type C1EnvironmentProgress,type C1PressureChallenge,type C1SourceEvaluationConfidence,type C1WritingProjectProgress
} from "../study/c1Environment";

type WorkspaceTab="sources"|"writing"|"defense";

const EMPTY_PROGRESS:C1EnvironmentProgress={
  activeDays:0,registeredSources:0,evaluatedSources:0,sourceGenres:0,sourcePublishers:0,specialistTerms:0,
  writingProjectsStarted:0,writingProjectsCompleted:0,defenseTurns:0,uniquePressureTypes:0,
  sourceEvaluations:[],sources:[],specialistTermItems:[],projects:[]
};

export function C1EnvironmentLab(){
  const [tab,setTab]=useState<WorkspaceTab>("sources");
  const [progress,setProgress]=useState<C1EnvironmentProgress>(EMPTY_PROGRESS);
  const [message,setMessage]=useState("");
  const [portalId,setPortalId]=useState(c1SourcePortals[0]!.id);
  const [sourceTitle,setSourceTitle]=useState("");
  const [sourceUrl,setSourceUrl]=useState("");
  const [sourceDomain,setSourceDomain]=useState(c1SourcePortals[0]!.domains[0]!);
  const [activeSourceId,setActiveSourceId]=useState<string|null>(null);
  const [claim,setClaim]=useState("");
  const [evidence,setEvidence]=useState("");
  const [limitation,setLimitation]=useState("");
  const [purpose,setPurpose]=useState("");
  const [confidence,setConfidence]=useState<C1SourceEvaluationConfidence>("medium");
  const [term,setTerm]=useState("");
  const [termReading,setTermReading]=useState("");
  const [termMeaning,setTermMeaning]=useState("");
  const [termContext,setTermContext]=useState("");
  const [activeProjectId,setActiveProjectId]=useState(c1WritingProjects[0]!.id);
  const [sourceSelection,setSourceSelection]=useState<string[]>([]);
  const [thesis,setThesis]=useState("");
  const [draft,setDraft]=useState("");
  const [revision,setRevision]=useState("");
  const [reflection,setReflection]=useState("");

  async function refresh(){
    const next=await getC1EnvironmentProgress();
    setProgress(next);
    if(!activeSourceId&&next.sources[0])setActiveSourceId(next.sources[0].id);
  }
  useEffect(()=>{void refresh().catch(()=>setProgress(EMPTY_PROGRESS));},[]);

  const portal=portalById(portalId);
  const activeSource=progress.sources.find((source)=>source.id===activeSourceId)??null;
  const activeEvaluation=progress.sourceEvaluations.find((item)=>item.sourceId===activeSourceId)??null;
  const activeProject=progress.projects.find((item)=>item.project.id===activeProjectId)??null;
  const evaluatedIds=new Set(progress.sourceEvaluations.map((item)=>item.sourceId));

  function choosePortal(id:string){
    const next=portalById(id);setPortalId(id);setSourceUrl("");setSourceDomain(next.domains[0]!);setMessage("");
  }

  async function registerSource(){
    setMessage("");
    try{
      const source=await registerC1ExternalSource({portalId,title:sourceTitle,url:sourceUrl,domain:sourceDomain});
      setSourceTitle("");setSourceUrl("");setActiveSourceId(source.id);
      setMessage("External Japanese source registered. Evaluate its claim, evidence and limitations before using it in a project.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveEvaluation(){
    if(!activeSource)return;
    setMessage("");
    try{
      await evaluateC1ExternalSource({sourceId:activeSource.id,claim,evidence,limitation,rhetoricOrPurpose:purpose,confidence});
      setClaim("");setEvidence("");setLimitation("");setPurpose("");
      setMessage("Source evaluation saved. This source can now enter a C1 project source map.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveTerm(){
    if(!activeSource)return;
    setMessage("");
    try{
      await saveC1SpecialistTerm({sourceId:activeSource.id,canonicalForm:term,reading:termReading,meaning:termMeaning,context:termContext});
      setTerm("");setTermReading("");setTermMeaning("");setTermContext("");
      setMessage("Specialist term saved into the existing private-vocabulary review path.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveSourceMap(){
    if(!activeProject)return;
    setMessage("");
    try{
      await saveC1ProjectSourceMap({projectId:activeProject.project.id,sourceIds:sourceSelection,thesis});
      setThesis("");setSourceSelection([]);
      setMessage("Project source map frozen. Draft citations now use the assigned [S#] keys.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveDraft(){
    if(!activeProject)return;
    setMessage("");
    try{
      await saveC1ProjectDraft({projectId:activeProject.project.id,text:draft});
      setDraft("");setMessage("First draft saved. Complete two different pressure defenses, then wait 20+ hours before the delayed revision.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveRevision(){
    if(!activeProject)return;
    setMessage("");
    try{
      await saveC1ProjectRevision({projectId:activeProject.project.id,text:revision});
      setRevision("");setMessage("Delayed revision saved. Finish with a reflection on what changed and why.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveReflection(){
    if(!activeProject)return;
    setMessage("");
    try{
      await saveC1ProjectReflection({projectId:activeProject.project.id,text:reflection});
      setReflection("");setMessage("C1 writing project complete as internal longitudinal evidence.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  return <section className="p15-environment" id="p15-c1-environment">
    <div className="section-heading">
      <div><span className="course-kicker">P15 ACTUAL C1 ENVIRONMENT</span><h2>Research real Japanese, cite it, defend it, rewrite it</h2></div>
      <span className="course-count">{progress.activeDays} active day{progress.activeDays===1?"":"s"}</span>
    </div>
    <p className="course-note">This workspace uses external Japanese sources in their original context instead of copying them into the course. You register the exact page you read, evaluate what it can support, mine specialist vocabulary, build a cited long-form project, defend it under unpredictable pressure and revise it on another day.</p>

    <div className="p15-environment-stats">
      <EnvStat value={progress.registeredSources} label="sources"/>
      <EnvStat value={progress.evaluatedSources} label="evaluated"/>
      <EnvStat value={progress.sourceGenres} label="genres"/>
      <EnvStat value={progress.sourcePublishers} label="publishers"/>
      <EnvStat value={progress.specialistTerms} label="specialist terms"/>
      <EnvStat value={progress.writingProjectsCompleted} label="projects complete"/>
      <EnvStat value={progress.defenseTurns} label="defense turns"/>
      <EnvStat value={progress.uniquePressureTypes} label="pressure types"/>
    </div>

    <div className="p15-tabs" role="tablist" aria-label="C1 environment workspace">
      <button className={tab==="sources"?"active":""} type="button" onClick={()=>setTab("sources")}>Source desk</button>
      <button className={tab==="writing"?"active":""} type="button" onClick={()=>setTab("writing")}>Writing studio</button>
      <button className={tab==="defense"?"active":""} type="button" onClick={()=>setTab("defense")}>Live defense</button>
    </div>

    {tab==="sources"?<div className="p15-source-desk">
      <section>
        <div className="section-heading"><div><span className="course-kicker">NATIVE SOURCE PORTALS</span><h3>Choose the real document, not a synthetic lesson</h3></div><span>{c1SourcePortals.length} portals</span></div>
        <div className="p15-portal-grid">{c1SourcePortals.map((item)=><article key={item.id} className={portalId===item.id?"selected":""}>
          <div><span>{item.genre.replaceAll("_"," ")}</span><small>{item.sourceRole.replaceAll("_"," ")}</small></div>
          <h4>{item.title}</h4><strong>{item.publisher}</strong><p>{item.task}</p>
          <div className="p15-card-actions"><a className="quiet-button" href={item.url} target="_blank" rel="noreferrer">Open portal ↗</a><button className="unit-action" type="button" onClick={()=>choosePortal(item.id)}>Use source</button></div>
        </article>)}</div>
      </section>

      <section className="p15-register-source">
        <div className="section-heading"><div><span className="course-kicker">REGISTER EXACT SOURCE</span><h3>{portal.publisher}</h3></div><span>{portal.genre.replaceAll("_"," ")}</span></div>
        <p>{portal.citationHint}</p>
        <div className="p15-form-grid">
          <label><span>Portal</span><select value={portalId} onChange={(event)=>choosePortal(event.target.value)}>{c1SourcePortals.map((item)=><option value={item.id} key={item.id}>{item.publisher} · {item.title}</option>)}</select></label>
          <label><span>Domain</span><select value={sourceDomain} onChange={(event)=>setSourceDomain(event.target.value)}>{portal.domains.map((domain)=><option value={domain} key={domain}>{domain}</option>)}</select></label>
          <label className="wide"><span>Exact document/article title</span><input value={sourceTitle} onChange={(event)=>setSourceTitle(event.target.value)} placeholder="実際に読んだ資料のタイトル"/></label>
          <label className="wide"><span>Exact HTTPS URL from this portal</span><input value={sourceUrl} onChange={(event)=>setSourceUrl(event.target.value)} placeholder={portal.url}/></label>
        </div>
        <button className="primary" type="button" disabled={sourceTitle.trim().length<6||!sourceUrl.trim()} onClick={()=>void registerSource()}>Register source</button>
      </section>

      {progress.sources.length?<section className="p15-source-evaluation">
        <div className="section-heading"><div><span className="course-kicker">SOURCE EVALUATION</span><h3>What does this source actually support?</h3></div><span>{progress.evaluatedSources}/{progress.registeredSources} evaluated</span></div>
        <div className="p15-source-picker">
          <aside>{progress.sources.map((source)=>{
            const evaluated=evaluatedIds.has(source.id);
            return <button type="button" className={source.id===activeSourceId?"active":""} key={source.id} onClick={()=>{setActiveSourceId(source.id);setMessage("");}}>
              <span>{evaluated?"✓ evaluated":"○ needs evaluation"}</span><strong>{source.title}</strong><small>{source.publisher} · {source.genre.replaceAll("_"," ")}</small>
            </button>;
          })}</aside>
          {activeSource?<article className="p15-evaluation-editor">
            <div className="p15-source-meta"><div><span>{activeSource.publisher}</span><strong>{activeSource.title}</strong><small>{activeSource.sourceRole.replaceAll("_"," ")} · {activeSource.domain}</small></div><a href={activeSource.url} target="_blank" rel="noreferrer">Open exact source ↗</a></div>
            {activeEvaluation?<details><summary>Current saved evaluation</summary><div className="p15-saved-evaluation"><p><strong>Claim</strong>{activeEvaluation.claim}</p><p><strong>Evidence</strong>{activeEvaluation.evidence}</p><p><strong>Limitation</strong>{activeEvaluation.limitation}</p><p><strong>Purpose</strong>{activeEvaluation.rhetoricOrPurpose}</p></div></details>:null}
            <label><span>Central claim / what the source says</span><textarea rows={4} value={claim} onChange={(event)=>setClaim(event.target.value)} placeholder="この資料が実際に主張・報告していること…"/></label>
            <label><span>Evidence basis / what supports it</span><textarea rows={4} value={evidence} onChange={(event)=>setEvidence(event.target.value)} placeholder="統計、方法、法文、観測、引用された研究など…"/></label>
            <label><span>Limitation / what it does not establish</span><textarea rows={3} value={limitation} onChange={(event)=>setLimitation(event.target.value)} placeholder="対象範囲、因果、時点、利害関係、方法上の限界…"/></label>
            <label><span>Purpose / rhetorical or institutional role</span><textarea rows={3} value={purpose} onChange={(event)=>setPurpose(event.target.value)} placeholder="誰が、誰に、何のために発信しているか…"/></label>
            <label><span>Your confidence in using it for this purpose</span><select value={confidence} onChange={(event)=>setConfidence(event.target.value as C1SourceEvaluationConfidence)}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></label>
            <button className="primary" type="button" disabled={claim.trim().length<45||evidence.trim().length<45||limitation.trim().length<30||purpose.trim().length<25} onClick={()=>void saveEvaluation()}>{activeEvaluation?"Save updated evaluation":"Save evaluation"}</button>

            <section className="p15-term-miner">
              <span className="course-kicker">SPECIALIST VOCABULARY</span><h4>Mine terminology from this source</h4>
              <p>Saved terms enter the existing private-vocabulary review path; they are not added to the public canonical lexicon automatically.</p>
              <div className="p15-form-grid">
                <label><span>Term</span><input lang="ja" value={term} onChange={(event)=>setTerm(event.target.value)} placeholder="専門用語"/></label>
                <label><span>Reading</span><input lang="ja" value={termReading} onChange={(event)=>setTermReading(event.target.value)} placeholder="よみ（任意）"/></label>
                <label className="wide"><span>Meaning / working definition</span><input value={termMeaning} onChange={(event)=>setTermMeaning(event.target.value)} placeholder="Meaning you want to review"/></label>
                <label className="wide"><span>Source context</span><textarea rows={3} value={termContext} onChange={(event)=>setTermContext(event.target.value)} placeholder="この語がこの資料でどう使われていたか…"/></label>
              </div>
              <button className="unit-action" type="button" disabled={!term.trim()||termMeaning.trim().length<2||termContext.trim().length<12} onClick={()=>void saveTerm()}>Save + add to review</button>
            </section>
          </article>:null}
        </div>
      </section>:null}
    </div>:null}

    {tab==="writing"?<WritingStudio
      progress={progress}
      activeProjectId={activeProjectId}
      onProject={(id)=>{setActiveProjectId(id);setMessage("");setSourceSelection([]);setThesis("");setDraft("");setRevision("");setReflection("");}}
      sourceSelection={sourceSelection}
      setSourceSelection={setSourceSelection}
      thesis={thesis}
      setThesis={setThesis}
      draft={draft}
      setDraft={setDraft}
      revision={revision}
      setRevision={setRevision}
      reflection={reflection}
      setReflection={setReflection}
      onSaveSourceMap={()=>void saveSourceMap()}
      onSaveDraft={()=>void saveDraft()}
      onSaveRevision={()=>void saveRevision()}
      onSaveReflection={()=>void saveReflection()}
      onOpenDefense={()=>setTab("defense")}
    />:null}

    {tab==="defense"?<DefenseLab progress={progress} activeProjectId={activeProjectId} onProject={setActiveProjectId} onSaved={async()=>{setMessage("Pressure response saved as ungraded interaction evidence.");await refresh();}} setMessage={setMessage}/>:null}

    {message?<p className="import-message p15-message" role="status">{message}</p>:null}
    <p className="course-note">External links remain external references. P15 stores your source identity, notes, citations, drafts and transcript evidence; it does not copy third-party articles into the canonical course or turn source evaluation, typed speaking proxies or internal writing completion into CEFR certification.</p>
  </section>;
}

function WritingStudio(props:{
  progress:C1EnvironmentProgress;activeProjectId:string;onProject:(id:string)=>void;
  sourceSelection:string[];setSourceSelection:(ids:string[])=>void;thesis:string;setThesis:(value:string)=>void;
  draft:string;setDraft:(value:string)=>void;revision:string;setRevision:(value:string)=>void;reflection:string;setReflection:(value:string)=>void;
  onSaveSourceMap:()=>void;onSaveDraft:()=>void;onSaveRevision:()=>void;onSaveReflection:()=>void;onOpenDefense:()=>void;
}){
  const active=props.progress.projects.find((item)=>item.project.id===props.activeProjectId)??props.progress.projects[0]??null;
  const evaluatedIds=new Set(props.progress.sourceEvaluations.map((item)=>item.sourceId));
  const evaluatedSources=props.progress.sources.filter((source)=>evaluatedIds.has(source.id));
  if(!active)return null;
  const project=active.project;
  const sourceEntries=active.sourceMap?citationEntries(active.sourceMap,props.progress.sources):[];
  const selectedSources=evaluatedSources.filter((source)=>props.sourceSelection.includes(source.id));
  const sourceReady=selectedSources.length>=project.minimumSources&&new Set(selectedSources.map((source)=>source.genre)).size>=project.minimumGenres&&new Set(selectedSources.map((source)=>source.publisher)).size>=project.minimumPublishers;
  const distinctDefenses=new Set(active.defenses.map((item)=>item.pressureType)).size;
  const hoursRemaining=Math.max(0,20-active.delayHours);

  return <div className="p15-writing-studio">
    <div className="section-heading"><div><span className="course-kicker">MULTI-DAY C1 WRITING</span><h3>Build an argument that survives sources, pressure and time</h3></div><span>{props.progress.writingProjectsCompleted}/{c1WritingProjects.length} complete</span></div>
    <div className="p15-project-grid">{props.progress.projects.map((entry)=><button type="button" className={entry.project.id===active.project.id?"active":""} onClick={()=>props.onProject(entry.project.id)} key={entry.project.id}>
      <span>{entry.project.domain}</span><strong>{entry.project.title}</strong><small>{stageLabel(entry)}</small>
    </button>)}</div>

    <article className="p15-project-workspace">
      <div className="p15-project-head"><div><span>{project.domain}</span><h3>{project.title}</h3><p>{project.brief}</p></div><strong>{project.deliverable}</strong></div>
      <div className="coach-goals">{project.targetMoves.map((move)=><span key={move}>{move}</span>)}</div>
      <div className="p15-stage-strip">
        {["source_map","draft","defense","waiting_revision","revision","reflection","complete"].map((stage)=><span key={stage} className={active.nextStage===stage?"active":stageCompleted(active,stage)?"done":""}>{stage.replaceAll("_"," ")}</span>)}
      </div>

      {active.nextStage==="source_map"?<section className="p15-stage-editor">
        <h4>1. Build a source map</h4>
        <p>Use evaluated sources only. This project needs at least {project.minimumSources} sources, {project.minimumGenres} genres and {project.minimumPublishers} publishers.</p>
        {evaluatedSources.length?<div className="p15-project-sources">{evaluatedSources.map((source)=><label key={source.id}>
          <input type="checkbox" checked={props.sourceSelection.includes(source.id)} onChange={(event)=>props.setSourceSelection(event.target.checked?[...props.sourceSelection,source.id]:props.sourceSelection.filter((id)=>id!==source.id))}/>
          <span><strong>{source.title}</strong><small>{source.publisher} · {source.genre.replaceAll("_"," ")}</small></span>
        </label>)}</div>:<p className="p15-empty">Evaluate sources in the Source desk before starting a project.</p>}
        <label><span>Working thesis / question</span><textarea rows={5} value={props.thesis} onChange={(event)=>props.setThesis(event.target.value)} placeholder="現時点の仮説・中心的な問い・判断基準を日本語で…"/></label>
        <small>{selectedSources.length}/{project.minimumSources} sources · {new Set(selectedSources.map((source)=>source.genre)).size}/{project.minimumGenres} genres · {new Set(selectedSources.map((source)=>source.publisher)).size}/{project.minimumPublishers} publishers</small>
        <button className="primary" disabled={!sourceReady||props.thesis.trim().length<70} type="button" onClick={props.onSaveSourceMap}>Freeze source map</button>
      </section>:null}

      {active.nextStage==="draft"&&active.sourceMap?<section className="p15-stage-editor">
        <h4>2. First cited draft</h4>
        <CitationLegend entries={sourceEntries}/>
        <p>Every mapped source must appear at least once using its exact citation key. These markers are traceability aids, not a formal academic citation style.</p>
        <CitationInsert entries={sourceEntries} value={props.draft} onChange={props.setDraft}/>
        <textarea className="p15-long-editor" rows={16} lang="ja" value={props.draft} onChange={(event)=>props.setDraft(event.target.value)} placeholder="資料を統合し、根拠・留保・反論を明示した長文を書く…"/>
        <small>{props.draft.trim().length}/{project.draftMinimumCharacters} minimum characters</small>
        <button className="primary" type="button" disabled={props.draft.trim().length<project.draftMinimumCharacters||!allCitationsPresent(props.draft,sourceEntries.map((entry)=>entry.key))} onClick={props.onSaveDraft}>Save first draft</button>
      </section>:null}

      {active.nextStage==="defense"?<section className="p15-stage-editor">
        <h4>3. Defend the argument under unpredictable pressure</h4>
        <p>{active.defenses.length}/{project.requiredDefenseTurns} responses saved · {distinctDefenses}/{project.requiredDefenseTurns} different pressure types. Same-pressure repetition does not satisfy this stage.</p>
        <button className="primary" type="button" onClick={props.onOpenDefense}>Open live defense lab</button>
      </section>:null}

      {active.nextStage==="waiting_revision"?<section className="p15-stage-editor p15-waiting">
        <h4>4. Let the first draft get cold</h4>
        <strong>{hoursRemaining.toFixed(1)}h remaining</strong>
        <p>The revision unlocks 20 hours after the latest first draft. This prevents same-session polishing from masquerading as durable control.</p>
        {active.revisionUnlockAt?<small>Unlock: {new Date(active.revisionUnlockAt).toLocaleString()}</small>:null}
      </section>:null}

      {active.nextStage==="revision"&&active.sourceMap&&active.draft?<section className="p15-stage-editor">
        <h4>5. Delayed reconstruction</h4>
        <details><summary>Review first draft</summary><p className="p15-draft-preview" lang="ja">{active.draft.text}</p></details>
        <CitationLegend entries={sourceEntries}/>
        <CitationInsert entries={sourceEntries} value={props.revision} onChange={props.setRevision}/>
        <textarea className="p15-long-editor" rows={18} lang="ja" value={props.revision} onChange={(event)=>props.setRevision(event.target.value)} placeholder="反論を踏まえて、翌日の視点から論証を組み直す…"/>
        <small>{props.revision.trim().length}/{project.revisionMinimumCharacters} minimum characters · draft age {active.delayHours.toFixed(1)}h</small>
        <button className="primary" type="button" disabled={props.revision.trim().length<project.revisionMinimumCharacters||props.revision.trim()===active.draft.text.trim()||!allCitationsPresent(props.revision,sourceEntries.map((entry)=>entry.key))} onClick={props.onSaveRevision}>Save delayed revision</button>
      </section>:null}

      {active.nextStage==="reflection"?<section className="p15-stage-editor">
        <h4>6. Reflection</h4>
        <p>Explain which source, pressure challenge or delayed rereading changed the argument most, and which uncertainty still remains.</p>
        <textarea rows={7} lang="ja" value={props.reflection} onChange={(event)=>props.setReflection(event.target.value)} placeholder="初稿から何が変わったか、なぜ変えたか、何が未解決か…"/>
        <small>{props.reflection.trim().length}/120 minimum characters</small>
        <button className="primary" type="button" disabled={props.reflection.trim().length<120} onClick={props.onSaveReflection}>Complete project reflection</button>
      </section>:null}

      {active.nextStage==="complete"?<section className="p15-stage-editor p15-complete">
        <h4>Project complete</h4>
        <p>{active.sourceMap?.sourceIds.length??0} evaluated sources · {active.defenses.length} defense turns · delayed revision and reflection saved.</p>
        <small>This is internal C1 longitudinal evidence, not external certification or human semantic review.</small>
      </section>:null}
    </article>
  </div>;
}

function DefenseLab({progress,activeProjectId,onProject,onSaved,setMessage}:{progress:C1EnvironmentProgress;activeProjectId:string;onProject:(id:string)=>void;onSaved:()=>Promise<void>;setMessage:(message:string)=>void}){
  const candidates=progress.projects.filter((item)=>Boolean(item.draft));
  const active=candidates.find((item)=>item.project.id===activeProjectId)??candidates[0]??null;
  const [challenge,setChallenge]=useState<C1PressureChallenge|null>(null);
  const [response,setResponse]=useState("");
  const [inputMode,setInputMode]=useState<"text"|"speech">("text");
  const [sourceId,setSourceId]=useState("");
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");

  const usedIds=active?.defenses.map((item)=>item.pressureId)??[];
  const projectSources=active?.sourceMap?citationEntries(active.sourceMap,progress.sources):[];

  useEffect(()=>{setChallenge(null);setResponse("");setSourceId("");setInputMode("text");},[activeProjectId]);

  function draw(){
    const next=drawC1PressureChallenge(usedIds);
    setChallenge(next);setResponse("");setSourceId(next.sourceAware?(projectSources[0]?.source.id??""):"");setMessage("");
  }

  async function save(){
    if(!active||!challenge)return;
    try{
      await recordC1ProjectDefense({projectId:active.project.id,pressureId:challenge.id,response,inputMode,...(challenge.sourceAware&&sourceId?{sourceId}:{})});
      setChallenge(null);setResponse("");setInputMode("text");setSourceId("");await onSaved();
    }catch(error){setMessage(errorMessage(error));}
  }

  function startSpeech(){
    const w=window as unknown as {
      SpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
      webkitSpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
    };
    const Recognition=w.SpeechRecognition??w.webkitSpeechRecognition;
    if(!Recognition){setSpeechState("unsupported");return;}
    const recognition=new Recognition();recognition.lang="ja-JP";recognition.interimResults=false;recognition.continuous=false;
    recognition.onresult=(event)=>{const transcript=event.results[0]?.[0]?.transcript?.trim()??"";if(transcript){setResponse(transcript);setInputMode("speech");}};
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((state)=>state==="error"?state:"idle");
    setSpeechState("listening");try{recognition.start();}catch{setSpeechState("error");}
  }

  return <div className="p15-defense-lab">
    <div className="section-heading"><div><span className="course-kicker">UNPREDICTABLE C1 DEFENSE</span><h3>Draw the objection after you commit to the argument</h3></div><span>{c1PressureChallenges.length} pressure types</span></div>
    <p>The challenge is not shown until you draw it. Responses are saved as transcript/typed interaction evidence only; there is no hidden semantic score.</p>
    {candidates.length?<div className="p15-defense-projects">{candidates.map((entry)=><button className={active?.project.id===entry.project.id?"active":""} key={entry.project.id} type="button" onClick={()=>onProject(entry.project.id)}><strong>{entry.project.title}</strong><small>{entry.defenses.length} saved defenses</small></button>)}</div>:<p className="p15-empty">Save a first draft in the Writing studio before opening live defense.</p>}

    {active?<article className="p15-defense-workspace">
      <div className="p15-defense-head"><div><span>{active.project.domain}</span><strong>{active.project.title}</strong></div><small>{new Set(active.defenses.map((item)=>item.pressureType)).size} unique pressure types encountered</small></div>
      {!challenge?<button className="primary" type="button" onClick={draw}>Draw hidden pressure</button>:<>
        <div className="p15-pressure-card">
          <span>{challenge.type.replaceAll("_"," ")}</span><h4>{challenge.title}</h4><p>{challenge.prompt}</p>
          <div className="coach-goals">{challenge.goals.map((goal)=><span key={goal}>{goal}</span>)}</div>
        </div>
        {challenge.sourceAware&&projectSources.length?<label><span>Source being challenged</span><select value={sourceId} onChange={(event)=>setSourceId(event.target.value)}>{projectSources.map((entry)=><option value={entry.source.id} key={entry.source.id}>[{entry.key}] {entry.source.publisher} · {entry.source.title}</option>)}</select></label>:null}
        <label><span>Respond in Japanese</span><textarea rows={8} lang="ja" value={response} onChange={(event)=>{setResponse(event.target.value);setInputMode("text");}} placeholder="反論を受け止め、主張を必要な範囲で修正しながら答える…"/></label>
        <div className="p15-defense-actions">
          <button className="unit-action" type="button" disabled={speechState==="listening"} onClick={startSpeech}>{speechState==="listening"?"Listening…":"Use microphone"}</button>
          <button className="primary" type="button" disabled={response.trim().length<100||(challenge.sourceAware&&!sourceId)} onClick={()=>void save()}>Save defense response</button>
          <button className="quiet-button" type="button" onClick={draw}>Draw different pressure</button>
        </div>
        {speechState==="unsupported"?<p className="coach-warning">Japanese speech recognition is unavailable in this browser. Typed defense remains available and is labeled as a typed speaking proxy.</p>:null}
        {speechState==="error"?<p className="coach-warning">Speech recognition failed. Retry or type the response.</p>:null}
      </>}
    </article>:null}
  </div>;
}

function CitationLegend({entries}:{entries:Array<{key:string;source:{title:string;publisher:string;url:string}}>}) {
  return <div className="p15-citation-legend">{entries.map((entry)=><div key={entry.key}><strong>[{entry.key}]</strong><span>{entry.source.publisher} · {entry.source.title}</span><a href={entry.source.url} target="_blank" rel="noreferrer">open ↗</a></div>)}</div>;
}

function CitationInsert({entries,value,onChange}:{entries:Array<{key:string;source:{title:string}}>;value:string;onChange:(value:string)=>void}){
  return <div className="p15-citation-insert"><span>Insert citation marker</span>{entries.map((entry)=><button type="button" className="quiet-button" key={entry.key} onClick={()=>onChange(value+(value.endsWith(" ")||!value?"":" ")+"["+entry.key+"]")}>[{entry.key}]</button>)}</div>;
}

function stageCompleted(progress:C1WritingProjectProgress,stage:string):boolean{
  const order=["source_map","draft","defense","waiting_revision","revision","reflection","complete"];
  return order.indexOf(stage)<order.indexOf(progress.nextStage);
}

function stageLabel(progress:C1WritingProjectProgress):string{
  if(progress.complete)return "complete";
  if(progress.nextStage==="waiting_revision")return "revision unlocks after 20h";
  return "next: "+progress.nextStage.replaceAll("_"," ");
}

function allCitationsPresent(text:string,keys:string[]):boolean{
  return keys.every((key)=>text.includes("["+key+"]"));
}

function EnvStat({value,label}:{value:number;label:string}){
  return <div><strong>{value}</strong><span>{label}</span></div>;
}

function errorMessage(error:unknown):string{
  const code=error instanceof Error?error.message:String(error);
  const friendly:Record<string,string>={
    P15_SOURCE_TITLE_TOO_SHORT:"Use the real document/article title, not a short placeholder.",
    P15_SOURCE_URL_NOT_FROM_SELECTED_PORTAL:"The URL must be an HTTPS page on the selected source portal.",
    P15_SOURCE_CLAIM_TOO_SHORT:"Describe the source's central claim in more detail.",
    P15_SOURCE_EVIDENCE_TOO_SHORT:"Describe the evidence or basis in more detail.",
    P15_SOURCE_LIMITATION_TOO_SHORT:"State at least one meaningful limitation.",
    P15_SOURCE_PURPOSE_TOO_SHORT:"Explain the source's audience, purpose or institutional role.",
    P15_PROJECT_NEEDS_MORE_SOURCES:"Add more evaluated sources to meet this project's source minimum.",
    P15_PROJECT_SOURCES_REQUIRE_EVALUATION:"Every project source must be evaluated first.",
    P15_PROJECT_NEEDS_MORE_SOURCE_GENRES:"Use a broader mix of source genres.",
    P15_PROJECT_NEEDS_MORE_PUBLISHERS:"Use sources from more independent publishers/institutions.",
    P15_PROJECT_THESIS_TOO_SHORT:"Develop the working thesis/question before freezing the source map.",
    P15_PROJECT_SOURCE_MAP_LOCKED_AFTER_DRAFT:"The source map is locked after the first draft so citation identity remains stable.",
    P15_PROJECT_DRAFT_TOO_SHORT:"The first draft is below this project's minimum length.",
    P15_PROJECT_MISSING_SOURCE_CITATIONS:"Use every assigned [S#] citation marker at least once.",
    P15_DEFENSE_RESPONSE_TOO_SHORT:"Give a fuller Japanese response before saving the defense.",
    P15_PROJECT_DEFENSES_REQUIRED:"Complete the required live-defense turns first.",
    P15_PROJECT_DEFENSES_MUST_DIFFER:"The required defenses must use different pressure types.",
    P15_PROJECT_REVISION_DELAY_NOT_MET:"The delayed revision unlocks 20 hours after the first draft.",
    P15_PROJECT_REVISION_TOO_SHORT:"The delayed revision is below this project's minimum length.",
    P15_PROJECT_REVISION_MUST_CHANGE:"Revise the argument rather than resaving the original draft.",
    P15_PROJECT_REFLECTION_TOO_SHORT:"Write at least 120 characters of reflection.",
    P15_SPECIALIST_TERM_REQUIRES_CONTEXT:"Save the term with enough source context to remember how it was used."
  };
  return friendly[code]??code;
}
