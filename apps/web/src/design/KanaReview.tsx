import {useState} from "react";
import {getDevelopmentAccountId} from "../study/runtime";
import {openKanaStudio} from "../kanaHandoff";
import type {KanaReviewOverview,KanaReviewScript,KanaReviewSkill} from "../study/kanaReview";
import "./kanaReview.css";

const SCRIPTS:readonly {id:KanaReviewScript;label:string}[]=[
  {id:"hiragana",label:"Hiragana"},{id:"katakana",label:"Katakana"},{id:"mixed",label:"Mixed"}
];
const SKILLS:readonly {id:KanaReviewSkill;label:string}[]=[
  {id:"all",label:"All skills"},{id:"recognition",label:"Recognition"},
  {id:"reading",label:"Reading recall"},{id:"form_selection",label:"Form selection"}
];

export function KanaReview({overview,busy,status,onStart}:{
  overview:KanaReviewOverview;busy:boolean;status:string;
  onStart:(script:KanaReviewScript,skill:KanaReviewSkill)=>void;
  onFlashcardsChanged?:()=>void;
}){
  const [script,setScript]=useState<KanaReviewScript>("mixed");
  const [skill,setSkill]=useState<KanaReviewSkill>("recognition");
  const counts=overview[script][skill];
  const available=counts.due+counts.new>0;
  return <section className="kana-review" aria-label="Kana Review">
    <h2>Kana Review</h2>
    <div className="kana-review__choices" role="group" aria-label="Writing system">
      {SCRIPTS.map(item=><button key={item.id} type="button" aria-pressed={script===item.id}
        onClick={()=>setScript(item.id)}>{item.label}</button>)}
    </div>
    <div className="kana-review__choices" role="group" aria-label="Practice skill">
      {SKILLS.map(item=><button key={item.id} type="button" aria-pressed={skill===item.id}
        onClick={()=>setSkill(item.id)}>{item.label}</button>)}
    </div>
    <dl className="kana-review__counts">
      <div><dt>Due</dt><dd>{counts.due}</dd></div>
      <div><dt>New</dt><dd>{counts.new}</dd></div>
      <div><dt>Weak due</dt><dd>{counts.weakDue}</dd></div>
    </dl>
    <div className="kana-review__actions">
      <button type="button" className="kana-review__start" disabled={busy}
        onClick={()=>{
          openKanaStudio(getDevelopmentAccountId(),"review");
        }}>Review flashcards</button>
      <button type="button" className="kana-review__secondary" disabled={busy||!available}
        onClick={()=>onStart(script,skill)}>Multiple-choice practice</button>
    </div>
    {!available?<p role="status">No eligible kana for this selection.</p>:null}
    {status==="error"?<p role="alert">Kana practice could not be opened. Try again.</p>:null}
  </section>;
}
