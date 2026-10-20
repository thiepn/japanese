import type {KanaWordBridgeOverview} from "../study/kanaWordBridge";
import "./beginner.css";

export function KanaWordsEntry({overview,busy,onContinue}:{
  overview:KanaWordBridgeOverview;busy:boolean;onContinue:()=>void;
}){
  if(!overview.available)return null;
  return <section className="kana-words-entry" aria-label="Kana to words">
    <div>
      <h2>Read Japanese words</h2>
      <p>{overview.learned} of {overview.eligible} available words recognized
        {overview.readyToUse>0?" · "+overview.readyToUse+" ready for independent recall":""}</p>
      {overview.nextWord?<p className="kana-words-entry__next" lang="ja">{overview.nextWord}</p>:null}
    </div>
    <button type="button" disabled={busy} onClick={onContinue}>
      {busy?"Opening…":overview.readyToUse>0?"Use learned words":overview.readyToRead>0?"Read learned words":"Read new words"}
    </button>
  </section>;
}
