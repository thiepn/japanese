import type {KanaWordBridgeOverview} from "../study/kanaWordBridge";
import "./beginner.css";

export function KanaWordsEntry({overview,due,busy,onContinue,onReviewDue,onReadContext,onRevisitContext,onRevisitWords}:{
  overview:KanaWordBridgeOverview;due:number;busy:boolean;
  onContinue:()=>void;onReviewDue:()=>void;onReadContext:()=>void;onRevisitContext:()=>void;onRevisitWords:()=>void;
}){
  if(!overview.available&&overview.pendingReview===0&&!overview.readingContext.available&&!overview.readingContext.revisitable)return null;
  return <section className="kana-words-entry" aria-label="Kana to words">
    <div>
      <h2>{overview.available||overview.pendingReview>0?"Read Japanese words":"Read A1 sentences"}</h2>
      {overview.available||overview.pendingReview>0?<p>{overview.learned} of {overview.eligible} available words recognized
        {overview.readyToUse>0?" · "+overview.readyToUse+" ready for independent recall":""}
        {overview.pendingReview>0?" · "+overview.pendingReview+" awaiting review":""}</p>:null}
      {overview.readingContext.available||overview.readingContext.revisitable?<p>{overview.readingContext.completed} of {overview.readingContext.total} original A1 sentences attempted
        {overview.readingContext.needsRetry>0?" · "+overview.readingContext.needsRetry+" to retry":""}</p>:null}
    </div>
    <div className="kana-words-entry__actions">
      {overview.available?<button type="button" disabled={busy} onClick={onContinue}>
        {busy?"Opening…":overview.readyToUse>0?"Use learned words":overview.readyToRead>0?"Read learned words":"Read new words"}
      </button>:null}
      {overview.readingContext.available?<button type="button" disabled={busy} onClick={onReadContext}>
        Read A1 sentences
      </button>:null}
      {overview.readingContext.revisitable?<button type="button" disabled={busy} onClick={onRevisitContext}>
        Revisit source sentences
      </button>:null}
      {overview.pendingReview>0?<button type="button" disabled={busy} onClick={onRevisitWords}>
        Revisit word lessons
      </button>:null}
      {overview.pendingReview>0&&due>0?<button type="button" disabled={busy} onClick={onReviewDue}>
        Review due material ({due})
      </button>:null}
    </div>
  </section>;
}
