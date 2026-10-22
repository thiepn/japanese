import type {BeginnerOverview} from "../study/beginnerCourse";
import "./beginner.css";

export function KatakanaEntry({overview,busy,onContinue}:{
  overview:BeginnerOverview;busy:boolean;onContinue:()=>void;
}){
  const current=overview.stages.find(stage=>stage.id===overview.nextId);
  if(!current)return null;
  return <section className="katakana-entry" aria-label="Optional katakana lessons">
    <div className="katakana-entry__header">
      <div>
        <h2>Katakana</h2>
        <p>{current.title} · {overview.completed} of {overview.total} groups completed
          {current.correct>0?" · "+current.correct+"/"+current.total+" answers correct":""}</p>
      </div>
      <button className="katakana-entry__action" type="button" disabled={busy} onClick={onContinue}>
        {busy?"Opening…":overview.started?"Continue katakana":"Start katakana"}
      </button>
    </div>
    <progress aria-label="Katakana sound groups completed" value={overview.completed} max={overview.total}/>
    <details className="beginner-entry__path">
      <summary>See all katakana lessons</summary>
      <ol className="beginner-entry__stages" aria-label="Katakana learning sequence">
        {overview.stages.map((stage,index)=><li key={stage.id} aria-current={stage.id===overview.nextId?"step":undefined}>
          <span>{index+1}. {stage.title}</span>
          <span>{stage.completed?"Done":stage.unlocked?stage.correct+"/"+stage.total:"Locked"}</span>
        </li>)}
      </ol>
    </details>
  </section>;
}
