import {useMemo} from "react";
import {UX1Today} from "./UX1Today";
import {BeginnerEntry} from "./BeginnerEntry";
import type {BeginnerOverview} from "../study/beginnerCourse";
import type {UX1Engagement,StudySummary,E01Progress,E02Overview,E03Overview,E04Overview,E05Evidence,E06Overview} from "../study/runtime";
import {E07JourneyPanel} from "./E07JourneyPanel";
import type {E07Journey,E07Action} from "../study/e07LearningRoute";
import {JCartouche,JDivider,JInkProgress,JPattern,JSeal} from "./index";

type J3TodayProps={
  beginner:BeginnerOverview;onStartBeginner:()=>void;onReviewDue:()=>void;
  engagement:UX1Engagement;
  summary:StudySummary;
  completedToday:number;
  status:string;
  onStart:()=>void;
  e01:E01Progress;onStartE01:()=>void;onStartE01Delayed:()=>void;
  e02:E02Overview;onStartE02:(id:string)=>void;onStartE02Delayed:(id:string)=>void;
  e03:E03Overview;onStartE03:(id:string)=>void;onStartE03Delayed:(id:string)=>void;
  e04:E04Overview;onStartE04:(id:string)=>void;onStartE04Delayed:(id:string)=>void;
  e05:E05Evidence;onStartE05Repair:()=>void;
  e06:E06Overview;onStartE06:(id:string)=>void;onStartE06Delayed:(id:string)=>void;onStartE11Micro:(id:string)=>void;
  e07:E07Journey;onOpenE07:(action:E07Action)=>void;
};

type RouteItem={
  id:string;
  japanese:string;
  label:string;
  count:number;
  tone:"review"|"learn"|"listen"|"apply";
};

function japaneseDate(now=new Date()):string{
  try{
    return new Intl.DateTimeFormat("ja-JP",{
      month:"long",
      day:"numeric",
      weekday:"long",
    }).format(now);
  }catch{
    return "";
  }
}

export function J3Today({beginner,onStartBeginner,onReviewDue,engagement,summary,completedToday,status,onStart,e01,onStartE01,onStartE01Delayed,e02,onStartE02,onStartE02Delayed,e03,onStartE03,onStartE03Delayed,e04,onStartE04,onStartE04Delayed,e05,onStartE05Repair,e06,onStartE06,onStartE06Delayed,onStartE11Micro,e07,onOpenE07}:J3TodayProps){
  const route=useMemo<RouteItem[]>(()=>[
    {id:"review",japanese:"復",label:"Review",count:summary.due,tone:"review"},
    {id:"learn",japanese:"学",label:"Learn",count:summary.newKana+summary.newVocabulary+summary.course,tone:"learn"},
    {id:"listen",japanese:"聴",label:"Listen",count:summary.listening,tone:"listen"},
    {id:"apply",japanese:"使",label:"Apply",count:summary.application,tone:"apply"},
  ],[summary]);

  const remaining=route.reduce((sum,item)=>sum+item.count,0);
  const introduced=summary.newKana+summary.newVocabulary;
  const routeKinds=route.filter((item)=>item.count>0).length;
  const completedFraction=completedToday>0
    ?completedToday/(completedToday+remaining)
    :remaining===0?1:0;

  if(!beginner.complete||e01.status==="not_started"||e01.status==="learning"||Boolean(e02.nextSceneId)){
    return <section className="j3-today" aria-label="Beginner Japanese study">
      <BeginnerEntry overview={beginner}
        a1Next={e01.unitId&&(e01.status==="not_started"||e01.status==="learning")?"First conversations":
          e02.scenes.find(scene=>scene.id===e02.nextSceneId)?.title??"A1 practice"}
        due={summary.due} busy={status==="loading"} sessionError={status==="error"}
        onContinue={onStartBeginner} onReview={onReviewDue}/>
    </section>;
  }
  return <section className="j3-today" aria-labelledby="ux1-today-title">
    <span className="j13-marginal" aria-hidden="true">今日</span>
    <UX1Today engagement={engagement} route={e07} summary={summary} status={status} completedToday={completedToday} onActivate={onOpenE07} onStartQueue={onStart}/>
    <details className="e07-track-list">
      <summary>Browse the original E01–E09 lesson entry points</summary>
    <section className="e01-entry" aria-label="A1 first conversations practice">
      <div className="e01-entry__copy"><strong>A1 · First conversations</strong><p>Encounter → understand → discover → practice → communicate → independent response → delayed retrieval. Original dialogues; device-synthesized listening is labeled.</p></div>
      <div className="e01-entry__actions"><button type="button" disabled={status==="loading"} onClick={onStartE01}>Study first conversations</button>{(e01.status==="ready"||e01.status==="reviewed")?<button type="button" disabled={status==="loading"} onClick={onStartE01Delayed}>Delayed transfer</button>:null}</div>
    </section>
    {e02.total>0?<section className="e02-entry" aria-label="A1 situational learning">
      <div><p className="j3-today__eyebrow">E02 · SITUATIONAL A1</p><h2>Use Japanese in daily life</h2><p>{e02.started} / {e02.total} situations started · {e02.delayedReviewed} delayed checks completed</p></div>
      <div className="e02-entry__actions">{e02.nextSceneId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE02(e02.nextSceneId!)}>Continue: {e02.scenes.find(s=>s.id===e02.nextSceneId)?.title}</button>:null}{e02.scenes.find(s=>s.state==="ready")?<button type="button" disabled={status==="loading"} onClick={()=>onStartE02Delayed(e02.scenes.find(s=>s.state==="ready")!.id)}>Review a changed situation</button>:null}</div>
    </section>:null}
    {e03.total>0?<section className="e03-entry" aria-label="A2.1 contextual communication">
      <div><p className="j3-today__eyebrow">E03 · CONTEXTUAL A2.1</p><h2>Continue connected Japanese</h2><p>{e03.started} / {e03.total} linked situations started · {e03.readyForDelay} delayed checks ready</p></div>
      <div className="e03-entry__actions">{e03.nextSceneId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE03(e03.nextSceneId!)}>Continue: {e03.scenes.find(s=>s.id===e03.nextSceneId)?.title}</button>:null}
        {e03.scenes.find(s=>s.state==="ready")?<button type="button" disabled={status==="loading"} onClick={()=>onStartE03Delayed(e03.scenes.find(s=>s.state==="ready")!.id)}>Unseen transfer review</button>:null}</div>
    </section>:null}
    {e04.linked>0?<section className="e04-entry" aria-label="A2.2 independent communication">
      <div><p className="j3-today__eyebrow">E04 · INDEPENDENT A2.2 PRACTICE</p><h2>Handle an everyday problem</h2><p>{e04.started}/{e04.linked} linked situations started · {e04.reviewReady} changed-context reviews ready. A2.2 placement is provisional.</p></div>
      <div className="e04-entry__actions">{e04.nextSceneId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE04(e04.nextSceneId!)}>Continue: {e04.scenes.find(s=>s.id===e04.nextSceneId)?.title}</button>:null}
        {e04.scenes.find(s=>s.status==="ready")?<button type="button" disabled={status==="loading"} onClick={()=>onStartE04Delayed(e04.scenes.find(s=>s.status==="ready")!.id)}>Delayed transfer</button>:null}</div>
    </section>:null}
    {e05.repair.pending>0?<section className="e05-panel" aria-label="Misconception correction">
      <div><p className="j3-today__eyebrow">E05 · SPECIFIC REPAIR</p><h2>{e05.repair.pending} misunderstood original cue{e05.repair.pending===1?"":"s"}</h2><p>Practise a changed question without changing your original FSRS schedule.</p></div>
      <button type="button" disabled={status==="loading"} onClick={onStartE05Repair}>Repair now</button>
    </section>:null}
    {e06.total>0?<section className="e06-entry" aria-label="Cumulative independent Japanese">
      <div><p className="j3-today__eyebrow">E06 · CUMULATIVE COMMUNICATION</p><h2>Use Japanese across situations</h2><p>{e06.prerequisiteReady}/{e06.total} source-ready cases · {e06.cases.filter(c=>c.firstDraftSubmitted&&!c.revisedDraftSubmitted).length} revisions waiting · {e06.cases.filter(c=>c.canDoId!==null&&c.e09Correct>0&&c.e09Correct<c.e09Required).length} third-context lessons in progress · {e06.reviewed} delayed sets complete</p></div>
      <div className="e06-entry__actions">{e06.nextId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE06(e06.nextId!)}>Continue: {e06.cases.find(c=>c.id===e06.nextId)?.dailyStages.find(s=>s.id===e06.cases.find(c=>c.id===e06.nextId)?.nextDailyStage)?.title??e06.cases.find(c=>c.id===e06.nextId)?.title}</button>:null}
      {e06.nextDelayedId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE06Delayed(e06.nextDelayedId!)}>Delayed: {e06.cases.find(c=>c.id===e06.nextDelayedId)?.delayedStages.find(s=>s.id===e06.cases.find(c=>c.id===e06.nextDelayedId)?.nextDelayedStage)?.title??"Changed context"}</button>:null}
      {e06.cases.find(c=>c.prerequisiteReady&&c.canDoId)?<button type="button" disabled={status==="loading"} onClick={()=>onStartE11Micro(e06.cases.find(c=>c.prerequisiteReady&&c.canDoId)!.id)}>Optional E11 · real-life listening and reading</button>:null}</div>
      {!e06.nextId&&!e06.nextDelayedId?<small>Practise listening and reading in the original source lesson first; the cumulative task will then unlock.</small>:null}
    </section>:null}
    </details>
    <JDivider kind="ink" className="j3-today__divider"/>

    <section className="j3-route" aria-labelledby="j3-route-title">
      <header className="j3-route__head">
        <div>
          <JCartouche japanese="今日の道" subtitle="Today’s path"/>
          <h2 id="j3-route-title">One route, four intentions</h2>
          <p>Review comes first. New material and active use stay visible without turning the page into a wall of statistics.</p>
        </div>
        <div className="j3-route__total">
          <span>待</span>
          <strong>{remaining}</strong>
          <small>remaining</small>
        </div>
      </header>

      <ol className="j3-route__line">
        {route.map((item,index)=>{
          const inactive=item.count===0;
          return <li
            className={"j3-route__item j3-route__item--"+item.tone+(inactive?" is-empty":"")}
            key={item.id}
          >
            <div className="j3-route__node" aria-hidden="true">
              <span>{item.japanese}</span>
              {index<route.length-1?<i/>:null}
            </div>
            <div className="j3-route__copy">
              <span>{item.label}</span>
              <strong>{item.count}</strong>
              <small>{routeDescription(item.id,item.count)}</small>
            </div>
          </li>;
        })}
      </ol>
    </section>

    <section className="j3-today__quiet" aria-label="Today details">
      <div>
        <span className="j3-today__quiet-glyph" aria-hidden="true">新</span>
        <p><strong>{introduced}</strong><span>new kana + words</span></p>
      </div>
      <div>
        <span className="j3-today__quiet-glyph" aria-hidden="true">課</span>
        <p><strong>{summary.course}</strong><span>course steps</span></p>
      </div>
      <div>
        <span className="j3-today__quiet-glyph" aria-hidden="true">記</span>
        <p><strong>{summary.memoryTraces}</strong><span>memory traces</span></p>
      </div>
    </section>
  </section>;
}

function routeDescription(id:string,count:number):string{
  if(count===0)return "nothing waiting";
  if(id==="review")return count===1?"memory item due":"memory items due";
  if(id==="learn")return "new script, words and course";
  if(id==="listen")return "connected listening";
  return "production and transfer";
}
