import {useMemo} from "react";
import type {StudySummary,E01Progress,E02Overview,E03Overview,E04Overview,E05Evidence} from "../study/runtime";
import {JCartouche,JDivider,JInkProgress,JPattern,JSeal} from "./index";

type J3TodayProps={
  summary:StudySummary;
  completedToday:number;
  status:string;
  onStart:()=>void;
  e01:E01Progress;onStartE01:()=>void;onStartE01Delayed:()=>void;
  e02:E02Overview;onStartE02:(id:string)=>void;onStartE02Delayed:(id:string)=>void;
  e03:E03Overview;onStartE03:(id:string)=>void;onStartE03Delayed:(id:string)=>void;
  e04:E04Overview;onStartE04:(id:string)=>void;onStartE04Delayed:(id:string)=>void;
  e05:E05Evidence;onStartE05Repair:()=>void;
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

export function J3Today({summary,completedToday,status,onStart,e01,onStartE01,onStartE01Delayed,e02,onStartE02,onStartE02Delayed,e03,onStartE03,onStartE03Delayed,e04,onStartE04,onStartE04Delayed,e05,onStartE05Repair}:J3TodayProps){
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

  return <section className="j3-today" aria-labelledby="j3-today-title">
    <span className="j13-marginal" aria-hidden="true">今日</span>
    <div className="j3-today__hero">
      <div className="j3-today__shoji" aria-hidden="true"/>
      <JPattern name="asanoha" className="j3-today__pattern"/>

      <div className="j3-today__hero-copy">
        <div className="j3-today__date">
          <span aria-hidden="true">一日一歩</span>
          <i/>
          <span lang="ja">{japaneseDate()}</span>
        </div>

        <div className="j3-today__title-lockup">
          <span className="j3-today__glyph" aria-hidden="true" lang="ja">今日</span>
          <div>
            <p className="j3-today__eyebrow">TODAY · 今日</p>
            <h1 id="j3-today-title">{remaining?"Continue Japanese":"You’re caught up"}</h1>
            <p className="j3-today__lead">
              {remaining
                ?"Follow today’s path: recover what is fading, add a little new Japanese, then use it."
                :"Today’s planned path is complete. You can still open a light review session if you want another pass."}
            </p>
          </div>
        </div>

        <div className="j3-today__action-row">
          <button
            className="j3-today__continue"
            disabled={status==="loading"}
            onClick={onStart}
            type="button"
          >
            <span className="j3-today__continue-seal" aria-hidden="true">{remaining?"始":"復"}</span>
            <span>
              <strong>{status==="loading"?"Preparing…":remaining?"Continue today’s study":"Review anyway"}</strong>
              <small>{remaining?remaining+" steps waiting":"No required steps waiting"}</small>
            </span>
            <span className="j3-today__continue-arrow" aria-hidden="true">→</span>
          </button>

          <div className="j3-today__visit">
            <strong>{completedToday}</strong>
            <span>answers today</span>
          </div>
        </div>

        {status==="error"?<p className="j3-today__error" role="status">Could not open local study data. Reload and try again.</p>:null}
        {status==="empty"?<p className="j3-today__error" role="status">No study items are due right now. Open Learn to choose a lesson.</p>:null}
      </div>

      <aside className="j3-today__ritual" aria-label="Today overview">
        <div className="j3-today__sun" aria-hidden="true"/>
        <JSeal className="j3-today__daily-seal" size="large" label={remaining?"Today’s study path":"Today complete"}>
          {remaining?"道":"済"}
        </JSeal>
        <div className="j3-today__ritual-copy">
          <span lang="ja">今日の道</span>
          <strong>{remaining?remaining:"済"}</strong>
          <small>{remaining?"steps remain":"path complete"}</small>
        </div>
        <JInkProgress value={completedFraction} label="Today's progress through the current queue"/>
        <p>{routeKinds} active study modes · {introduced} new items queued</p>
      </aside>
    </div>

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
