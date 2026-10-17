import {useMemo} from "react";
import type {E01Progress,E02Overview,E03Overview,E04Overview,E19Overview} from "../study/runtime";
import type {E07Action,E07Journey} from "../study/e07LearningRoute";
import {buildE22Chapters,e22InitialLocation,getE22NextChapter,
 type E22Chapter,type E22Level,type E22Node,type E22Selection} from "../study/e22ChapterProgression";

/** Preserve UX1 deep links and initial E07 selection without adding a scheduler. */
export const ux1InitialPathLocation=e22InitialLocation;
type Props={
 e01:E01Progress;e02:E02Overview;e03:E03Overview;e04:E04Overview;e19:E19Overview;
 route:E07Journey;busy:boolean;onOpenE07:(action:E07Action)=>void;
 selection:E22Selection|null;onSelectionChange:(selection:E22Selection)=>void;
 onE01:()=>void;onE01Delayed:()=>void;
 onE02:(id:string)=>void;onE02Delayed:(id:string)=>void;onE02Preview:(id:string)=>void;
 onE03:(id:string)=>void;onE03Delayed:(id:string)=>void;onE03Preview:(id:string)=>void;
 onE04:(id:string)=>void;onE04Delayed:(id:string)=>void;onE04Preview:(id:string)=>void;
 onE19:(key:string)=>void;onE20:(key:string)=>void;
};
type ChapterFocus={node:E22Node|null;mode:"guided"|"review"|"write"|"source"|"next"};

/** All decisions are projections of original owner-owned source events. */
export function e22ChapterFocus(chapter:E22Chapter):ChapterFocus{
 const by=(key:string|null)=>chapter.nodes.find(n=>n.key===key)??null;
 if(chapter.nextGuidedKey)return {node:by(chapter.nextGuidedKey),mode:"guided"};
 if(chapter.nextReviewKey)return {node:by(chapter.nextReviewKey),mode:"review"};
 if(chapter.nextWritingKey)return {node:by(chapter.nextWritingKey),mode:"write"};
 if(chapter.nextPreviewKey)return {node:by(chapter.nextPreviewKey),mode:"source"};
 return {node:null,mode:"next"};
}
function focusLabel(focus:ChapterFocus):string{
 if(!focus.node)return "Browse the next original chapter";
 if(focus.mode==="guided")return "Continue source-linked lesson · "+focus.node.title;
 if(focus.mode==="review")return "Open available delayed review · "+focus.node.title;
 if(focus.mode==="write")return "Continue optional independent writing · "+focus.node.title;
 return "Explore original ungraded source · "+focus.node.title;
}
/** UX1 + E22: desktop/mobile source-first chapter progression, without new levels.
 * E19 and E20 navigation goes to their existing native engines, not clones. */
export function UX1LearningPath({e01,e02,e03,e04,e19,route,busy,onOpenE07,selection,onSelectionChange,
 onE01,onE01Delayed,onE02,onE02Delayed,onE02Preview,onE03,onE03Delayed,
 onE03Preview,onE04,onE04Delayed,onE04Preview,onE19,onE20}:Props){
 const initial=selection??ux1InitialPathLocation(route.primary);
 const level=initial.level;
 const selected=initial.chapter;
 const path=useMemo(()=>buildE22Chapters({e01,e02,e03,e04,e19}),[e01,e02,e03,e04,e19]);
 const chapters=level==="A1"?path.a1:path.a2;
 const current=chapters.find(c=>c.id===selected)??chapters[0]??null;
 const focus=current?e22ChapterFocus(current):null;
 const next=current?getE22NextChapter(path,level,current.id):null;
 function openNode(node:E22Node,mode:"guided"|"review"|"write"|"source"="guided"){
  if(mode==="write"){if(node.linked&&node.sourceReady)onE19(node.key);return;}
  if(mode==="source"){
   if(node.cohort==="e03"||node.cohort==="e04")onE20(node.key);
   else if(node.cohort==="e02")onE02Preview(node.sceneId);
   return;
  }
  if(!node.linked){openNode(node,"source");return;}
  if(node.cohort==="e01"){if(mode==="review")onE01Delayed();else onE01();}
  else if(node.cohort==="e02"){if(mode==="review")onE02Delayed(node.sceneId);else onE02(node.sceneId);}
  else if(node.cohort==="e03"){if(mode==="review")onE03Delayed(node.sceneId);else onE03(node.sceneId);}
  else if(node.cohort==="e04"){if(mode==="review")onE04Delayed(node.sceneId);else onE04(node.sceneId);}
 }
 function changeChapter(nextLevel:E22Level,id:number){
  onSelectionChange({level:nextLevel,chapter:id});
 }
 return <section className="ux1-mobile-path" aria-labelledby="ux1-path-title">
  <header className="ux1-intro">
   <p className="ux1-eyebrow">E22 · ORIGINAL LEARNER CONTINUITY · <span lang="ja">学ぶ</span></p>
   <div className="ux1-path-head">
    <h1 id="ux1-path-title">Your learning path</h1>
    <label><span className="ux1-sr">Learning level</span>
     <select value={level} onChange={event=>changeChapter(event.target.value as E22Level,0)}>
      <option value="A1">A1</option><option value="A2">A2</option>
     </select>
    </label>
   </div>
   <p className="ux1-path-intro">Original THIEPN navigation groups. Chapter positions are not certified course levels. Complete source-linked controlled lessons, return for due delayed reviews and explore unlinked original sources without grades.</p>
  </header>
  <nav className="ux1-chapter-tabs" aria-label="Learning chapters">
   {chapters.map(c=><button type="button" key={c.key} aria-pressed={c.id===current?.id}
    onClick={()=>changeChapter(level,c.id)}>
    <strong>{c.title}</strong>
    <small>{c.guidedComplete}/{c.linkedCount} guided · {c.previewCount} ungraded</small>
   </button>)}
  </nav>
  {current?<>
   <section className="ux1-chapter" aria-labelledby="ux1-chapter-title">
    <p className="ux1-eyebrow">{level} · CHAPTER {current.id+1} / {chapters.length} · ORIGINAL LEARNER GROUP</p>
    <h2 id="ux1-chapter-title">{current.title} <span lang="ja">{current.jp}</span></h2>
    <p>{current.guidedComplete} / {current.linkedCount} source-linked guided lessons complete
     {current.previewCount>0?" · "+current.previewCount+" ungraded original source"+(current.previewCount===1?"":"s"):""}</p>
    <progress value={current.guidedComplete} max={Math.max(1,current.linkedCount)}
     aria-label="Source-linked guided chapter lessons complete"/>
    <div className="ux1-chapter-evidence" aria-label="Separate chapter learning evidence">
     <span>{current.reviewReady} delayed checks currently ready</span>
     <span>{current.reviewed} delayed checks previously reviewed</span>
     <span>{current.nodes.filter(n=>n.sourceReady&&n.writingStatus!=="study-source").length} writing-eligible sources</span>
    </div>
    <small className="ux1-chapter__authority">Guided progress is not a grade for your writing or a CEFR award. Review timing is managed by the existing FSRS and source-specific delayed gates.</small>
   </section>
   {focus?<section className="ux1-chapter-next" aria-label="Continue the selected original chapter">
    <strong>Next available chapter activity</strong>
    <p>{focus.mode==="guided"?"A real original lesson still needs its guided source responses.":
      focus.mode==="review"?"The original delayed check is ready; reviewing it does not certify the level.":
      focus.mode==="write"?"Original listening and reading are available for independent, unscored writing and revision.":
      focus.mode==="source"?"This original material lacks an admissible canonical Can-do link and remains ungraded.":
      "No remaining source-linked guided, available delayed or original preview activity in this chapter. Browse onward without claiming a mastery certificate."}</p>
    {focus.node?<button type="button" disabled={busy} onClick={()=>openNode(focus.node!,focus.mode==="next"?"guided":focus.mode)}>
     {focusLabel(focus)} <span aria-hidden="true">→</span>
    </button>:next?<button type="button" disabled={busy} onClick={()=>changeChapter(next.level,next.id)}>
     {next.level===level?"Browse the next chapter":"Browse original A2 source groups"} <span aria-hidden="true">→</span>
    </button>:null}
   </section>:null}
   <ol className="ux1-nodes">
    {current.nodes.map(node=>{
     const recommended=route.primary.origin===node.cohort&&
      (route.primary.targetId===node.sceneId||node.cohort==="e01")&&route.primary.kind!=="delayed";
     return <li className={recommended?"ux1-node ux1-node--recommended":"ux1-node"} key={node.key}>
      <span className="ux1-node__mark" aria-hidden="true">{!node.linked?"読":node.reviewed?"✓":recommended?"今":"学"}</span>
      <div className="ux1-node__body">
       <h3>{node.title}</h3>
       <p>{!node.linked?"Original THIEPN source · ungraded; no Can-do mapping":
        node.cohort==="e01"
        ?node.guidedAnswered+" source-guided attempts · "+node.guidedCorrect+" correct"
        :node.guidedCorrect+" / "+node.guidedRequired+" required controlled correct answers"}</p>
       <small>{!node.linked?"Unlinked original · source-only, no saved grade":
        node.reviewed?"Original delayed set reviewed":node.reviewReady?"Original changed-context review ready":
        node.status==="waiting"?"Guided responses recorded · delayed check not yet ready":
        node.guidedFinished?"Guided source covered · separate delayed checks remain":
        node.status==="learning"?"Guided source partly practised":"Not yet studied"}</small>
       <div className="ux1-node__actions">
        <button type="button" disabled={busy} onClick={()=>openNode(node,node.linked?"guided":"source")}>
         {!node.linked?(node.cohort==="e03"||node.cohort==="e04"?"Study original source-only workshop":"Read original source"):
          node.status==="not_started"?"Start lesson":"Practise lesson"}
        </button>
        {node.reviewReady?<button type="button" disabled={busy}
         onClick={()=>openNode(node,"review")}>Original delayed review</button>:null}
        {node.linked&&node.sourceReady&&(node.writingStatus==="first-draft"||node.writingStatus==="revise"||node.writingStatus==="review")?
         <button type="button" disabled={busy} onClick={()=>openNode(node,"write")}>
          {node.writingStatus==="first-draft"?"Write first independent message":
           node.writingStatus==="revise"?"Revise saved private message":"Review or revise my private writing"}
         </button>:null}
       </div>
      </div>
     </li>;
    })}
   </ol>
   {current.nodes.length===0?<p role="status">No original source material is available in this navigation chapter. No progress is inferred. Use the other original chapters or full catalogue below.</p>:null}
   {next?<button type="button" className="ux1-chapter-next-button" disabled={busy}
     onClick={()=>changeChapter(next.level,next.id)}>
     {next.level===level?"Browse next original chapter":"Browse A2-oriented original situations"}
     <span aria-hidden="true">→</span>
    </button>:null}
   {(route.primary.kind==="scheduled"||route.primary.kind==="delayed")?
    <button type="button" className="ux1-path-review" disabled={busy} onClick={()=>onOpenE07(route.primary)}>
     {route.primary.label} →</button>:null}
   <p className="ux1-path-note">These chapters organize existing THIEPN originals. The existing Today/FSRS queue is still authoritative for due reviews. Optional writing and unlinked A2 workshops cannot award new proficiency or mastery.</p>
  </>:null}
 </section>;
}
