import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const EXACT=/^[0-9a-f]{40}$/;
const DEFAULT_BASE="https://thiepn.dev/japanese/";
const ACCOUNT_ENTRY="https://account.thiepn.dev/japanese/entry/";
const CHECKS=["entry","releaseMeta","accountEntry","accountCallback","pwaManifest","pwaIcon","serviceWorker"];
function normalizedBase(raw){
  const url=new URL(raw);
  if(url.protocol!=="https:"||url.search||url.hash||!url.pathname.endsWith("/"))throw Error("J16A_BASE_URL_MUST_BE_HTTPS_DIRECTORY");
  return url.href;
}
async function request(url,fetchImpl){
  try{
    const response=await fetchImpl(url,{headers:{accept:"text/html,application/json;q=0.9,*/*;q=0.8"},cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(10000)});
    return {ok:response.ok,status:response.status,contentType:response.headers.get("content-type")??"",response};
  }catch(e){return{ok:false,status:null,error:e instanceof Error?e.message:String(e),response:null};}
}
export async function probeJ16Candidate({baseUrl=DEFAULT_BASE,expectedCommit,fetchImpl=fetch,now=new Date()}){
  const base=normalizedBase(baseUrl);
  if(!EXACT.test(expectedCommit??""))throw Error("J16A_EXPECTED_40_HEX_COMMIT_REQUIRED");
  const urls={
    entry:base,releaseMeta:new URL("release-meta.json",base).href,
    accountEntry:ACCOUNT_ENTRY,accountCallback:new URL("auth/callback/",base).href,
    pwaManifest:new URL("manifest.webmanifest",base).href,
    pwaIcon:new URL("icon.svg",base).href,serviceWorker:new URL("sw.js",base).href
  };
  const results={};let metadata=null,manifest=null;
  for(const key of CHECKS){
    const result=await request(urls[key],fetchImpl);
    let valid=Boolean(result.ok),reason=result.ok?"HTTP_OK":"HTTP_UNAVAILABLE";
    if(key==="releaseMeta"&&result.ok){
      try{
        metadata=await result.response.json();
        valid=metadata?.schema==="thiepn-japanese-release-meta"
          &&metadata?.schemaVersion===1&&metadata?.phase==="P22"
          &&metadata?.channel==="candidate"&&metadata?.commit===expectedCommit;
        reason=valid?"EXACT_CANDIDATE":"CANDIDATE_IDENTITY_MISMATCH";
      }catch{valid=false;reason="INVALID_RELEASE_META";}
    }
    if(key==="pwaManifest"&&result.ok){
      try{
        manifest=await result.response.json();
        const start=new URL(manifest?.start_url??"",urls.pwaManifest).href;
        const scope=new URL(manifest?.scope??"",urls.pwaManifest).href;
        valid=manifest?.display==="standalone"&&start===base&&scope===base&&Array.isArray(manifest.icons)&&manifest.icons.length>0;
        reason=valid?"PWA_MANIFEST_CORRECT":"PWA_MANIFEST_INVALID";
      }catch{valid=false;reason="INVALID_PWA_MANIFEST";}
    }
    if(key==="serviceWorker"&&result.ok){
      // The SW must be served as JS, not the SPA's index.html fallback.
      valid=!/text\/html/i.test(result.contentType??"");
      reason=valid?"SERVICE_WORKER_AVAILABLE":"SERVICE_WORKER_HTML_FALLBACK";
    }
    results[key]={url:urls[key],status:result.status,pass:valid,reason};
  }
  const pass=CHECKS.every(key=>results[key]?.pass===true);
  const blockers=CHECKS.filter(key=>!results[key]?.pass).map(key=>key+": "+results[key].reason);
  return {
    schema:"thiepn-japanese-j16a-live-candidate",schemaVersion:1,
    checkedAt:now.toISOString(),status:pass?"verified_candidate":"blocked",
    expectedCommit,observedCommit:typeof metadata?.commit==="string"?metadata.commit:null,
    observedChannel:metadata?.channel??null,baseUrl:base,checks:results,
    pwaDisplay:manifest?.display??null,blockers,
    nextHumanChecks:["Real installed Android PWA testing","Actual OAuth/SSO user journey","TalkBack and audio hardware","42-case human visual review","Physical-device signoff and stable promotion"],
    note:"Synthetic HTTPS route and identity check only. No login action, physical device, offline network drill or stable activation is claimed."
  };
}
export async function runCli(args=process.argv.slice(2)){
  let expectedCommit=null,baseUrl=DEFAULT_BASE,strict=false;
  for(let i=0;i<args.length;i++){
    if(args[i]==="--commit"){expectedCommit=args[++i];continue;}
    if(args[i]==="--url"){baseUrl=args[++i];continue;}
    if(args[i]==="--strict"){strict=true;continue;}
    throw Error("J16A_UNKNOWN_ARGUMENT: "+args[i]);
  }
  const result=await probeJ16Candidate({baseUrl,expectedCommit});
  const dir=path.join(ROOT,"artifacts");fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"j16a-live-candidate.json"),JSON.stringify(result,null,2)+"\n");
  fs.writeFileSync(path.join(dir,"j16a-live-candidate.md"),[
    "# J16A — Verified live candidate","",
    "- Checked at: "+result.checkedAt,"- Expected commit: "+result.expectedCommit,
    "- Observed commit: "+result.observedCommit,"- Result: "+result.status,"",
    "| Route | HTTP | Result |","| --- | --- | --- |",
    ...CHECKS.map(key=>"| "+key+" | "+result.checks[key].status+" | "+(result.checks[key].pass?"PASS":result.checks[key].reason)+" |"),
    "","## Blockers","",...(result.blockers.length?result.blockers.map(x=>"- "+x):["- None"]),
    "","A successful synthetic check does not prove physical PWA or Account sign-in behavior.",""
  ].join("\n"));
  process.stdout.write("J16A live candidate "+result.status+"; expected="+result.expectedCommit+" observed="+result.observedCommit+"\n");
  if(strict&&!result.status.startsWith("verified_"))process.exitCode=1;
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  runCli().catch(e=>{process.stderr.write(String(e?.stack??e)+"\n");process.exitCode=1;});
}
