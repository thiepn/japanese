import { useEffect,useMemo,useState } from "react";
import type { PrivateMediaReviewChecklist,PrivateMediaReviewStatus } from "@thiepn/local-db";
import { downloadPortfolioText } from "../study/portfolioExport";
import {
  buildNativeCurationSummary,buildP10NativeCandidateManifest,listNativeCurationCandidates,saveNativeMediaReview,
  serializeP10NativeCandidateManifest,type NativeCurationCandidate,type NativeCurationSummary
} from "./nativeCuration";

const EMPTY_CHECKLIST:PrivateMediaReviewChecklist={
  sourceReachable:false,licenseVerified:false,nativeSpeakerVerified:false,
  transcriptMatchVerified:false,registerReviewed:false,speechRateReviewed:false
};

export function NativeCurationPanel(){
  const [candidates,setCandidates]=useState<NativeCurationCandidate[]>([]);
  const [summary,setSummary]=useState<NativeCurationSummary|null>(null);
  const [selectedKey,setSelectedKey]=useState<string|null>(null);
  const [reviewer,setReviewer]=useState("");
  const [status,setStatus]=useState<PrivateMediaReviewStatus>("candidate");
  const [checklist,setChecklist]=useState<PrivateMediaReviewChecklist>(EMPTY_CHECKLIST);
  const [notes,setNotes]=useState("");
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  async function refresh(){
    const next=await listNativeCurationCandidates();
    setCandidates(next);setSummary(buildNativeCurationSummary(next));
    setSelectedKey((current)=>current&&next.some((item)=>keyOf(item)===current)?current:(next.find((item)=>!item.review)??next[0])?keyOf(next.find((item)=>!item.review)??next[0]!):null);
  }
  useEffect(()=>{void refresh().catch(()=>{setCandidates([]);setSummary(null);});},[]);

  const selected=useMemo(()=>candidates.find((item)=>keyOf(item)===selectedKey)??null,[candidates,selectedKey]);

  function choose(candidate:NativeCurationCandidate){
    setSelectedKey(keyOf(candidate));
    setReviewer(candidate.review?.reviewerLabel??"");
    setStatus(candidate.review?.status??"candidate");
    setChecklist(candidate.review?{...candidate.review.checklist}:{...EMPTY_CHECKLIST});
    setNotes(candidate.review?.notes??"");
    setMessage("");
  }

  async function save(){
    if(!selected)return;
    setSaving(true);setMessage("");
    try{
      await saveNativeMediaReview({
        documentId:selected.document.id,recordingKey:selected.recordingKey,reviewerLabel:reviewer,status,checklist,notes
      });
      setMessage(status==="verified"
        ?"Recording verified locally. It is now eligible for a P10 promotion candidate export."
        :"Media review saved.");
      await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save media review.");}
    finally{setSaving(false);}
  }

  function exportCandidates(){
    try{
      const manifest=buildP10NativeCandidateManifest(candidates);
      downloadPortfolioText(
        "japanese-p10-native-candidates-"+manifest.generatedAt.slice(0,10)+".json",
        serializeP10NativeCandidateManifest(manifest),
        "application/json"
      );
      setMessage(manifest.documents.length
        ?"Exported human-verified promotion candidates. Repository CI must still validate and promote them before they count toward the P9 gate."
        :"No recordings currently satisfy every promotion check.");
    }catch(error){setMessage(error instanceof Error?error.message:"Could not export native candidates.");}
  }

  return <section className="native-curation-panel">
    <div className="section-heading">
      <div><span className="course-kicker">P10 NATIVE CORPUS CURATION</span><h2>Verify media before it can count toward release</h2></div>
      <span className="course-count">{summary?.promotableRecordings??0} promotable · {summary?.recordings??0} imported</span>
    </div>
    <p>Imported audio is not release-qualified merely because it plays. P10 requires a human review of source access, reuse license, explicit native-speaker evidence, transcript match, register and source-rate metadata before a recording can be exported for repository promotion.</p>

    {summary?<div className="curation-stats">
      <CurationStat value={summary.documents} label="source documents"/>
      <CurationStat value={summary.recordings} label="recordings"/>
      <CurationStat value={summary.reviewed} label="reviewed"/>
      <CurationStat value={summary.verified} label="verified"/>
      <CurationStat value={summary.speakers} label="verified speakers"/>
      <CurationStat value={summary.registers.length} label="verified registers"/>
    </div>:null}

    <div className="human-review-actions"><button className="unit-action" type="button" disabled={!candidates.length} onClick={exportCandidates}>Export verified candidates</button></div>

    {!candidates.length?<div className="human-review-empty">
      <strong>No imported native recordings to curate.</strong>
      <p>Import a reusable source pack or other source-provenanced native media first. P10 intentionally does not create synthetic inventory to satisfy the P9 release gate.</p>
    </div>:<div className="curation-workspace">
      <aside>{candidates.map((candidate)=><button type="button" className={keyOf(candidate)===selectedKey?"active":""} key={keyOf(candidate)} onClick={()=>choose(candidate)}>
        <span>{candidate.review?.status??"unreviewed"} · {candidate.recording.speechRate??"rate n/a"} · {candidate.recording.register??"register n/a"}</span>
        <strong>{candidate.document.title}</strong>
        <small>{candidate.recording.speakerLabel??candidate.recording.credit}</small>
      </button>)}</aside>

      {selected?<article className="curation-editor">
        <div className="curation-source">
          <strong>{selected.document.title}</strong>
          <span>{selected.recording.credit} · {selected.recording.licenseName}</span>
          <a href={selected.document.sourceUrl??selected.recording.attributionUrl??selected.recording.url} target="_blank" rel="noreferrer">Open source evidence</a>
          <audio controls preload="none" src={selected.recording.url}/>
        </div>
        {selected.blockers.length?<div className="curation-blockers"><strong>Current blockers</strong>{selected.blockers.map((blocker)=><span key={blocker}>{blocker}</span>)}</div>:<div className="curation-ready">All promotion checks satisfied.</div>}

        <label><span>Reviewer label</span><input value={reviewer} onChange={(event)=>setReviewer(event.target.value)} placeholder="Reviewer or curator"/></label>
        <label><span>Review status</span><select value={status} onChange={(event)=>setStatus(event.target.value as PrivateMediaReviewStatus)}>
          <option value="candidate">Candidate</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
        </select></label>

        <div className="curation-checklist">
          <Checklist label="Source URL opens and matches this item" checked={checklist.sourceReachable} onChange={(value)=>setChecklist((current)=>({...current,sourceReachable:value}))}/>
          <Checklist label="Reuse license independently verified" checked={checklist.licenseVerified} onChange={(value)=>setChecklist((current)=>({...current,licenseVerified:value}))}/>
          <Checklist label="Source explicitly supports native-speaker status" checked={checklist.nativeSpeakerVerified} onChange={(value)=>setChecklist((current)=>({...current,nativeSpeakerVerified:value}))}/>
          <Checklist label="Recording matches the Japanese transcript/content" checked={checklist.transcriptMatchVerified} onChange={(value)=>setChecklist((current)=>({...current,transcriptMatchVerified:value}))}/>
          <Checklist label="Register label manually reviewed" checked={checklist.registerReviewed} onChange={(value)=>setChecklist((current)=>({...current,registerReviewed:value}))}/>
          <Checklist label="Source speech-rate label manually reviewed" checked={checklist.speechRateReviewed} onChange={(value)=>setChecklist((current)=>({...current,speechRateReviewed:value}))}/>
        </div>

        <label><span>Review notes</span><textarea rows={4} value={notes} onChange={(event)=>setNotes(event.target.value)} placeholder="Evidence notes, attribution details, uncertainty, rejection reason…"/></label>
        <button className="primary" disabled={saving||!reviewer.trim()} type="button" onClick={()=>void save()}>{saving?"Saving…":"Save media review"}</button>
      </article>:null}
    </div>}
    {message?<p className="import-message" role="status">{message}</p>:null}
    <p className="course-note">Local verification is only the curation stage. Exported candidates still require repository-side promotion and CI qualification before they contribute to the P9 release gate.</p>
  </section>;
}

function Checklist({label,checked,onChange}:{label:string;checked:boolean;onChange:(checked:boolean)=>void}){
  return <label><input type="checkbox" checked={checked} onChange={(event)=>onChange(event.target.checked)}/><span>{label}</span></label>;
}
function CurationStat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}
function keyOf(candidate:NativeCurationCandidate):string{return candidate.document.id+"|"+candidate.recordingKey;}
