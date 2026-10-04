import { useEffect,useMemo,useState } from "react";
import {
  buildHumanReviewPacket,getHumanReviewSummary,listHumanReviewArtifacts,saveHumanReview,serializeHumanReviewPacket,
  type HumanReviewArtifact,type HumanReviewRubric,type HumanReviewScore,type HumanReviewSummary
} from "./humanReview";
import { downloadPortfolioText } from "./portfolioExport";

const DEFAULT_RUBRIC:HumanReviewRubric={taskFulfillment:2,meaningAccuracy:2,coherence:2,register:2};

export function HumanReviewPanel(){
  const [artifacts,setArtifacts]=useState<HumanReviewArtifact[]>([]);
  const [summary,setSummary]=useState<HumanReviewSummary|null>(null);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [reviewer,setReviewer]=useState("");
  const [rubric,setRubric]=useState<HumanReviewRubric>(DEFAULT_RUBRIC);
  const [comment,setComment]=useState("");
  const [strengths,setStrengths]=useState("");
  const [nextPriority,setNextPriority]=useState("");
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  async function refresh(){
    const [nextArtifacts,nextSummary]=await Promise.all([listHumanReviewArtifacts(),getHumanReviewSummary()]);
    setArtifacts(nextArtifacts);setSummary(nextSummary);
    setSelectedId((current)=>current&&nextArtifacts.some((artifact)=>artifact.eventId===current)?current:(nextArtifacts.find((artifact)=>!artifact.reviewed)??nextArtifacts[0])?.eventId??null);
  }
  useEffect(()=>{void refresh().catch(()=>{setArtifacts([]);setSummary(null);});},[]);

  const selected=useMemo(()=>artifacts.find((artifact)=>artifact.eventId===selectedId)??null,[artifacts,selectedId]);

  async function submit(){
    if(!selected)return;
    setSaving(true);setMessage("");
    try{
      await saveHumanReview({artifact:selected,reviewerLabel:reviewer,rubric,comment,strengths,nextPriority});
      setMessage("Human review saved as separate advisory evidence. Mastery and FSRS were not changed.");
      setRubric(DEFAULT_RUBRIC);setComment("");setStrengths("");setNextPriority("");
      await refresh();
    }catch(error){setMessage(error instanceof Error?error.message:"Could not save review.");}
    finally{setSaving(false);}
  }

  function exportPacket(){
    const targets=artifacts.filter((artifact)=>!artifact.reviewed).slice(0,20);
    const packet=buildHumanReviewPacket(targets.length?targets:artifacts.slice(0,20));
    downloadPortfolioText("japanese-human-review-"+packet.generatedAt.slice(0,10)+".json",serializeHumanReviewPacket(packet),"application/json");
  }

  return <section className="human-review-panel">
    <div className="section-heading">
      <div><span className="course-kicker">P10 HUMAN EVALUATION</span><h2>Review productive evidence without rewriting mastery</h2></div>
      <span className="course-count">{summary?.reviewedArtifacts??0} reviewed · {summary?.unreviewedArtifacts??0} pending</span>
    </div>
    <p>Human feedback is stored separately from structural Study Player results and AI advice. A reviewer can score task fulfillment, meaning/accuracy, coherence and register from 0–4; the score is descriptive and never becomes CEFR certification or FSRS mastery automatically.</p>

    {summary&&summary.reviewedArtifacts>0?<div className="human-review-stats">
      <ReviewStat label="Overall" value={summary.averageOverall}/>
      <ReviewStat label="Task" value={summary.averageTaskFulfillment}/>
      <ReviewStat label="Meaning" value={summary.averageMeaningAccuracy}/>
      <ReviewStat label="Coherence" value={summary.averageCoherence}/>
      <ReviewStat label="Register" value={summary.averageRegister}/>
    </div>:null}

    <div className="human-review-actions">
      <button className="quiet-button" type="button" disabled={!artifacts.length} onClick={exportPacket}>Export review packet</button>
    </div>

    {!artifacts.length?<div className="human-review-empty"><strong>No B2 productive artifacts yet.</strong><p>Complete a B2 writing or speaking task first. Learner-authored responses will appear here for optional human review.</p></div>:<div className="human-review-workspace">
      <aside>{artifacts.slice(0,24).map((artifact)=><button type="button" className={artifact.eventId===selectedId?"active":""} key={artifact.eventId} onClick={()=>setSelectedId(artifact.eventId)}>
        <span>{artifact.reviewed?"reviewed":"pending"} · {artifact.mode}</span>
        <strong>{artifact.title}</strong>
        <small>{new Date(artifact.occurredAt).toLocaleDateString()}</small>
      </button>)}</aside>
      {selected?<article className="human-review-editor">
        <div className="human-review-source">
          <div><strong>{selected.title}</strong><span>{selected.mode} · structural result: {selected.structurallyCorrect?"correct":"not fully correct"}</span></div>
          <p lang="ja">{selected.response}</p>
          {selected.latestReview?<small>Latest review: {selected.latestReview.reviewerLabel} · {selected.latestReview.overall.toFixed(2)}/4 · {new Date(selected.latestReview.reviewedAt).toLocaleDateString()}</small>:null}
        </div>
        <label><span>Reviewer label</span><input value={reviewer} onChange={(event)=>setReviewer(event.target.value)} placeholder="Teacher, tutor, conversation partner…"/></label>
        <div className="human-rubric-grid">
          <RubricSelect label="Task fulfillment" value={rubric.taskFulfillment} onChange={(value)=>setRubric((current)=>({...current,taskFulfillment:value}))}/>
          <RubricSelect label="Meaning / accuracy" value={rubric.meaningAccuracy} onChange={(value)=>setRubric((current)=>({...current,meaningAccuracy:value}))}/>
          <RubricSelect label="Coherence" value={rubric.coherence} onChange={(value)=>setRubric((current)=>({...current,coherence:value}))}/>
          <RubricSelect label="Register" value={rubric.register} onChange={(value)=>setRubric((current)=>({...current,register:value}))}/>
        </div>
        <label><span>Strengths</span><textarea rows={2} value={strengths} onChange={(event)=>setStrengths(event.target.value)} placeholder="What already works well?"/></label>
        <label><span>Next priority</span><textarea rows={2} value={nextPriority} onChange={(event)=>setNextPriority(event.target.value)} placeholder="One high-value thing to improve next…"/></label>
        <label><span>Comment</span><textarea rows={3} value={comment} onChange={(event)=>setComment(event.target.value)} placeholder="Optional detailed feedback…"/></label>
        <button className="primary" type="button" disabled={saving||!reviewer.trim()} onClick={()=>void submit()}>{saving?"Saving…":"Save human review"}</button>
      </article>:null}
    </div>}

    {message?<p className="import-message" role="status">{message}</p>:null}
    <p className="course-note">Review packets can be sent to a teacher or tutor outside the app. Imported/manual reviews remain reviewer evidence only; there is no automatic CEFR pass/fail conversion.</p>
  </section>;
}

function RubricSelect({label,value,onChange}:{label:string;value:HumanReviewScore;onChange:(value:HumanReviewScore)=>void}){
  return <label><span>{label}</span><select value={value} onChange={(event)=>onChange(Number(event.target.value) as HumanReviewScore)}>
    {[0,1,2,3,4].map((score)=><option value={score} key={score}>{score} — {scoreLabel(score as HumanReviewScore)}</option>)}
  </select></label>;
}
function scoreLabel(score:HumanReviewScore):string{
  return ["not demonstrated","limited","adequate","strong","consistently strong"][score]!;
}
function ReviewStat({label,value}:{label:string;value:number}){
  return <div><strong>{value.toFixed(2)}</strong><span>{label} / 4</span></div>;
}
