import { useEffect,useState } from "react";

export interface ReleaseIdentity{
  schema:"thiepn-japanese-release-meta";
  schemaVersion:1;
  phase:"P22";
  channel:"development"|"candidate"|"stable";
  commit:string|null;
  builtAt:string|null;
}

export async function getReleaseIdentity(fetchImpl:typeof fetch=fetch):Promise<ReleaseIdentity|null>{
  try{
    const response=await fetchImpl("/release-meta.json",{cache:"no-store",headers:{"accept":"application/json"}});
    if(!response.ok)return null;
    const raw:unknown=await response.json();
    if(!raw||typeof raw!=="object")return null;
    const value=raw as Record<string,unknown>;
    if(value.schema!=="thiepn-japanese-release-meta"||value.schemaVersion!==1||value.phase!=="P22")return null;
    if(!["development","candidate","stable"].includes(String(value.channel)))return null;
    const commit=typeof value.commit==="string"&&/^[a-f0-9]{40}$/i.test(value.commit)?value.commit.toLowerCase():null;
    const builtAt=typeof value.builtAt==="string"&&Number.isFinite(Date.parse(value.builtAt))?value.builtAt:null;
    return {
      schema:"thiepn-japanese-release-meta",schemaVersion:1,phase:"P22",
      channel:value.channel as ReleaseIdentity["channel"],commit,builtAt
    };
  }catch{return null;}
}

export function ReleaseIdentityPanel(){
  const [identity,setIdentity]=useState<ReleaseIdentity|null|undefined>(undefined);
  useEffect(()=>{void getReleaseIdentity().then(setIdentity);},[]);
  if(identity===undefined)return null;
  return <section className="release-identity">
    <div className="section-heading">
      <div><span className="course-kicker">P22 DEPLOYMENT IDENTITY</span><h2>Know exactly which build is running</h2></div>
      <span className="course-count">{identity?.channel??"identity unavailable"}</span>
    </div>
    {identity?<div className={"release-human-note "+(identity.channel==="stable"?"pass":"")}>
      <strong>{identity.channel==="stable"?"Stable release build":identity.channel==="candidate"?"Release candidate build":"Development build"}</strong>
      <span>{identity.commit?identity.commit.slice(0,12):"no immutable commit embedded"}{identity.builtAt?" · built "+new Date(identity.builtAt).toLocaleString():""}</span>
      <p>Deployment identity is operational metadata only. A stable label is accepted only when the deploy-time file carries an exact commit; it does not itself prove P21 qualification, production health, real-device acceptance or learner proficiency.</p>
    </div>:<div className="release-human-note blocked">
      <strong>Deployment identity unavailable</strong>
      <span>The runtime could not read <code>/release-meta.json</code>.</span>
      <p>Do not infer a deployed commit or stable-release state when release identity cannot be read.</p>
    </div>}
  </section>;
}
