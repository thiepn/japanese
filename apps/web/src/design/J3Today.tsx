import {useMemo} from "react";
import type {StudySummary} from "../study/runtime";
import {JCartouche,JDivider,JInkProgress,JPattern,JSeal} from "./index";

type J3TodayProps={
  summary:StudySummary;
  completedToday:number;
  status:string;
  onStart:()=>void;
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

export function J3Today({summary,completedToday,status,onStart}:J3TodayProps){
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
