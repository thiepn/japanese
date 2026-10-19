import type {BeginnerOverview} from "../study/beginnerCourse";
import "./beginner.css";

export function BeginnerEntry({overview,due,busy,sessionError,onContinue,onReview}:{
  overview:BeginnerOverview;due:number;busy:boolean;sessionError:boolean;
  onContinue:()=>void;onReview:()=>void;
}){
  const current=overview.stages.find(stage=>stage.id===overview.nextId);
  const nextName=current?"Hiragana · "+current.title:"First conversations";
  const initial=!overview.started&&!overview.complete;
  return <section className="beginner-entry" aria-labelledby="beginner-title">
    <header className="beginner-entry__header">
      <p className="beginner-entry__level">A0 → A1</p>
      <h1 id="beginner-title">{initial?"Start Japanese from Zero":"Your next Japanese lesson"}</h1>
      <p className="beginner-entry__objective">{nextName}</p>
    </header>
    <div className="beginner-entry__actions">
      <button className="beginner-entry__primary" type="button" disabled={busy} onClick={onContinue}>
        {busy?"Opening…":initial?"Start Japanese from Zero":"Continue lesson"}
      </button>
      <button className="beginner-entry__review" type="button" disabled={busy||due===0} onClick={onReview}>
        Review due material{due>0?" ("+due+")":""}
      </button>
    </div>
    <p className="beginner-entry__progress">
      {overview.completed} of {overview.total} hiragana sound groups completed
      {current&&current.correct>0?" · "+current.correct+"/"+current.total+" sounds recognized in this group":""}
    </p>
    <progress aria-label="Beginner hiragana groups completed" value={overview.completed} max={overview.total}/>
    {sessionError?<p className="beginner-entry__error" role="alert">The lesson could not be opened. Retry without clearing local progress.</p>:null}
    <ol className="beginner-entry__stages" aria-label="Hiragana learning sequence">
      {overview.stages.map((stage,index)=><li key={stage.id} aria-current={stage.id===overview.nextId?"step":undefined}>
        <span>{index+1}. {stage.title}</span><span>{stage.completed?"Done":stage.unlocked?stage.correct+"/"+stage.total:"Locked"}</span>
      </li>)}
    </ol>
    {overview.complete?<p className="beginner-entry__next">Next: greetings, names and introductions in A1.</p>:null}
  </section>;
}
