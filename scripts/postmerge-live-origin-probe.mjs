import fs from "node:fs";
import path from "node:path";

// Read-only deployment probe. Never send cookies, credentials, OAuth codes or
// Account requests beyond the public empty entry route.
const origins=[
  {name:"cloudflare-root",base:"https://japanese.thiepn.dev/"},
  {name:"github-pages-subpath",base:"https://thiepn.dev/japanese/"},
];
async function fetchSummary(url) {
  try {
    const res=await fetch(url,{redirect:"manual",cache:"no-store",signal:AbortSignal.timeout(12000)});
    return {status:res.status,contentType:res.headers.get("content-type")||"",res};
  }catch(e) {
    return {status:null,contentType:"",error:e instanceof Error?e.name:"fetch unavailable",res:null};
  }
}
async function probe({name,base}) {
  const results={name,base,checkedAt:new Date().toISOString(),routes:{},observedCommit:null,channel:null,manifestScope:null};
  for(const route of ["","release-meta.json","auth/callback/","manifest.webmanifest","sw.js","kana/"]){
    const uri=new URL(route,base).href;
    const data=await fetchSummary(uri);
    const item={status:data.status,contentType:data.contentType};
    if(data.error)item.error=data.error;
    results.routes[route||"home"]=item;
    if(route==="release-meta.json" && data.res?.ok){
      try {
        const body=await data.res.json();
        if(body.schema==="thiepn-japanese-release-meta"&&body.channel==="candidate"&&/^[a-f0-9]{40}$/.test(body.commit)){
          results.observedCommit=body.commit;results.channel=body.channel;
        }else{item.error="INVALID_CANDIDATE_METADATA";}
      }catch{item.error="INVALID_METADATA_JSON";}
    }
    if(route==="manifest.webmanifest"&&data.res?.ok){
      try{
        const body=await data.res.json();
        results.manifestScope=new URL(body.scope||"./",uri).href;
        item.standalone=body.display==="standalone";
        item.startMatchesBase=new URL(body.start_url||"./",uri).href===base;
      }catch{item.error="INVALID_MANIFEST_JSON";}
    }
    if(route==="sw.js"&&data.res?.ok)item.js=!/text\/html/i.test(data.contentType);
  }
  results.status=results.observedCommit&&
    results.routes.home.status===200&&
    results.routes["auth/callback/"].status===200&&
    results.routes["manifest.webmanifest"].status===200&&
    results.routes["sw.js"].status===200&&results.routes["sw.js"].js&&
    results.routes["manifest.webmanifest"].standalone&&
    results.routes["manifest.webmanifest"].startMatchesBase&&
    results.manifestScope===base?"candidate_routes_ok":"unverified";
  return results;
}
const observations=await Promise.all(origins.map(probe));
const accountEntry=await fetchSummary("https://account.thiepn.dev/japanese/entry/");
const report={
  schema:"japanese-postmerge-readonly-origins",schemaVersion:1,
  checkedAt:new Date().toISOString(),
  nature:"synthetic, unauthenticated GET only; does not prove sign-in or physical PWA",
  expectedSourceCommit:process.env.EXPECTED_MAIN_SHA||null,
  origins:observations,
  accountEntry:{status:accountEntry.status},
};
fs.mkdirSync(path.resolve("artifacts"),{recursive:true});
fs.writeFileSync(path.resolve("artifacts/postmerge-live-origins.json"),JSON.stringify(report,null,2)+"\n");
for(const row of observations)console.log(JSON.stringify({
  origin:row.name,status:row.status,observedCommit:row.observedCommit,
  channel:row.channel,callback:row.routes["auth/callback/"].status,
  manifest:row.routes["manifest.webmanifest"].status,serviceWorker:row.routes["sw.js"].status,
  kana:row.routes["kana/"].status,
}));
console.log("Public Account entry HTTP status:",report.accountEntry.status);
