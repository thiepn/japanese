import type {KanaWordBridgeOverview} from "../study/kanaWordBridge";
import "./beginner.css";

export function KanaWordsEntry({overview,due,busy,onContinue,onReviewDue}:{
  overview:KanaWordBridgeOverview;due:number;busy:boolean;
  onContinue:()=>void;onReviewDue:()=>void;
}){
  if(!overview.available&&overview.pendingReview===0)return null;
  return <section className="kana-words-entry" aria-label="Kana to words">
    <div>
      <h2>Read Japanese words</h2>
      <p>{overview.learned} of {overview.eligible} available words recognized
        {overview.readyToUse>0?" · "+overview.readyToUse+" ready for independent recall":""}
        {overview.pendingReview>0?" · "+overview.pendingReview+" awaiting review":""}</p>
    </div>
    <div className="kana-words-entry__actions">
      {overview.available?<button type="button" disabled={busy} onClick={onContinue}>
        {busy?"Opening…":overview.readyToUse>0?"Use learned words":overview.readyToRead>0?"Read learned words":"Read new words"}
      </button>:null}
      {overview.pendingReview>0&&due>0?<button type="button" disabled={busy} onClick={onReviewDue}>
        Review due material ({due})
      </button>:null}
    </div>
  </section>;
}
