import type {UX1Engagement,StudySummary} from "../study/runtime";
import type {E07Action,E07Journey} from "../study/e07LearningRoute";
/** Source-owned E07 recommendation, presented as a single meaningful mission. */
export function UX1Today({engagement,route,summary,status,completedToday,onActivate,onStartQueue}:{
 engagement:UX1Engagement;route:E07Journey;summary:StudySummary;status:string;completedToday:number;onActivate:(action:E07Action)=>void;onStartQueue:()=>void;
}){
 const primary=route.primary;
 const cafe=primary.origin==="e02"&&primary.targetId==="food";
 const activities=[
  {label:"Review due Japanese",count:summary.due},
  {label:"Learn new Japanese",count:summary.newKana+summary.newVocabulary+summary.course},
  {label:"Listen and apply",count:summary.listening+summary.application}
 ].filter(item=>item.count>0);
 return <section className="ux1-today" aria-labelledby="ux1-today-title">
  <header className="ux1-intro"><p className="ux1-eyebrow">TODAY · <span lang="ja">今日</span></p><h1 id="ux1-today-title">Your Japanese today</h1></header>
  <div className="ux1-engagement" aria-label="Learning motivation"><span><strong>{engagement.totalXp} XP</strong><small>earned from saved practice</small></span><span><strong>{engagement.streakDays} day{engagement.streakDays===1?"":"s"}</strong><small>practice streak</small></span></div>
  <section className="ux1-mission" aria-labelledby="ux1-mission-title">
   <div className="ux1-mission__meta"><span>{cafe?"A1 · CAFÉ":"SOURCE-BASED STUDY"}</span></div>
   <div className="ux1-mission__seal" aria-hidden="true" lang="ja">{cafe?"喫茶":"学"}</div>
   <h2 id="ux1-mission-title">{cafe?(primary.kind==="delayed"?"Order in a new café situation":"Order a drink"):primary.label}</h2>
   <p>{cafe?"Listen to a conversation, make a polite request, and recall it independently.":primary.description}</p>
   <button className="ux1-mission__cta" type="button" disabled={status==="loading"} onClick={()=>onActivate(primary)}>
    {status==="loading"?"Preparing…":primary.kind==="scheduled"?"Review now":primary.kind==="repair"?"Practise correction":primary.kind==="resume"?"Continue lesson":primary.kind==="reading"?"Read original dialogue":"Start this step"} <span aria-hidden="true">→</span>
   </button>
   {primary.kind==="reading"?<small>Original reading preview · no graded Can-do evidence</small>:null}
  </section>
  <section className="ux1-plan" aria-labelledby="ux1-plan-title">
   <div className="ux1-section-head"><h2 id="ux1-plan-title">Today's plan</h2><span>{completedToday} answer{completedToday===1?"":"s"} recorded</span></div>
   {activities.length?<ul>{activities.map(item=><li key={item.label}><span aria-hidden="true">○</span><span>{item.label}</span><strong>{item.count} waiting</strong></li>)}</ul>:<p>No study items are scheduled.</p>}
  </section>
  <section className="ux1-daily-goal" aria-labelledby="ux1-daily-goal-title"><div className="ux1-section-head"><h2 id="ux1-daily-goal-title">Daily quest</h2><span>{Math.min(engagement.todayUniqueAnswers,engagement.dailyGoal)} / {engagement.dailyGoal}</span></div><progress value={Math.min(engagement.todayUniqueAnswers,engagement.dailyGoal)} max={engagement.dailyGoal} aria-label="Distinct saved Japanese answers today"/></section>
  <button className="ux1-native-queue" type="button" onClick={onStartQueue} disabled={status==="loading"}><span>Open daily study queue</span></button>
  <details className="ux1-alternatives"><summary>Other ways to study</summary><ul>{route.alternatives.map(item=><li key={item.key}><span><strong>{item.label}</strong><small>{item.description}</small></span><button disabled={status==="loading"} type="button" onClick={()=>onActivate(item)}>Open</button></li>)}</ul></details>
  {status==="error"?<p role="alert">The activity could not be opened. You can retry the recommended step or choose another lesson.</p>:null}
  {status==="empty"?<p role="status">No items are available for that activity. Choose another step.</p>:null}
 </section>;
}
