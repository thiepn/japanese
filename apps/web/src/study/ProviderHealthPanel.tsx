import { useEffect,useState } from "react";
import { getProviderHealthSnapshot,type ProviderHealthResult } from "../providerHealth";

export function ProviderHealthPanel(){
  const [items,setItems]=useState<ProviderHealthResult[]|null>(null);
  useEffect(()=>{void getProviderHealthSnapshot().then(setItems).catch(()=>setItems([]));},[]);
  if(!items)return null;
  return <section className="provider-health">
    <div className="section-heading"><div><span className="course-kicker">P8 PROVIDER OBSERVABILITY</span><h2>AI + morphology runtime status</h2></div><span className="course-count">fallback certified</span></div>
    <p>Provider status is operational metadata only. An unavailable external provider triggers the documented local/unavailable path rather than fabricating provider-grade output.</p>
    <div className="provider-health-grid">{items.map((item)=><article key={item.id} className={"provider-health-card "+item.state}>
      <div><strong>{item.label}</strong><span>{healthLabel(item)}</span></div>
      <small>{item.provider??(item.state==="unconfigured"?"not configured":"provider not reported")}{item.model?" · "+item.model:""}</small>
      {item.detail?<p>{item.detail}</p>:fallbackCopy(item)}
    </article>)}</div>
  </section>;
}

function healthLabel(item:ProviderHealthResult):string{
  if(item.state==="ok")return "operational";
  if(item.state==="configured")return item.operational===null?"configured · no active probe":"configured";
  if(item.state==="degraded")return "degraded";
  if(item.state==="unconfigured")return "unconfigured";
  return "unreachable";
}
function fallbackCopy(item:ProviderHealthResult){
  if(item.id==="morphology"&&(item.state==="unconfigured"||item.state==="unreachable"))return <p>Authentic input falls back visibly to bounded local analysis.</p>;
  if(item.id==="coach"&&(item.state==="unreachable"||item.state==="degraded"))return <p>AI coaching is unavailable; no learner evidence or mastery is changed.</p>;
  if(item.state==="configured")return <p>The route is configured, but this deployment does not expose an active provider health check.</p>;
  return null;
}
