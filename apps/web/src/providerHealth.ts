export type ProviderHealthState="ok"|"configured"|"degraded"|"unreachable"|"unconfigured";

export interface ProviderHealthResult {
  id:"coach"|"morphology";
  label:string;
  endpoint?:string;
  state:ProviderHealthState;
  provider?:string;
  model?:string;
  operational?:boolean|null;
  detail?:string;
}

const coachEndpoint=String(import.meta.env.VITE_JAPANESE_COACH_ENDPOINT??"/api/japanese/coach").trim();
const morphologyEndpoint=String(import.meta.env.VITE_JAPANESE_MORPHOLOGY_ENDPOINT??"").trim();

export async function getProviderHealthSnapshot(fetchImpl:typeof fetch=fetch):Promise<ProviderHealthResult[]>{
  const [coach,morphology]=await Promise.all([
    probe("coach","AI coach",coachEndpoint,fetchImpl),
    morphologyEndpoint?probe("morphology","Dictionary morphology",morphologyEndpoint,fetchImpl):Promise.resolve<ProviderHealthResult>({
      id:"morphology",label:"Dictionary morphology",state:"unconfigured",operational:null,detail:"Bounded local morphology remains active."
    })
  ]);
  return [coach,morphology];
}

async function probe(id:"coach"|"morphology",label:string,endpoint:string,fetchImpl:typeof fetch):Promise<ProviderHealthResult>{
  if(!endpoint)return {id,label,state:"unconfigured",operational:null};
  try{
    const response=await fetchImpl(endpoint,{method:"GET",headers:{"accept":"application/json"},cache:"no-store",credentials:"include"});
    let raw:unknown=null;
    try{raw=await response.json();}catch{/* non-JSON deployment */}
    const value=raw&&typeof raw==="object"?raw as Record<string,unknown>:{};
    const reported=String(value.status??"").toLowerCase();
    const state:ProviderHealthState=response.ok
      ?reported==="ok"?"ok":"configured"
      :reported==="degraded"?"degraded":"unreachable";
    return {
      id,label,endpoint,state,
      ...(typeof value.provider==="string"?{provider:value.provider}:{}),
      ...(typeof value.model==="string"?{model:value.model}:{}),
      ...(typeof value.operational==="boolean"||value.operational===null?{operational:value.operational as boolean|null}:{}),
      ...(typeof value.detail==="string"?{detail:value.detail}:{})
    };
  }catch{
    return {id,label,endpoint,state:"unreachable",operational:false};
  }
}
