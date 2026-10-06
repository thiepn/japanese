import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");

export function buildReleaseMeta({commit,builtAt=new Date().toISOString(),channel="stable"}){
  if(typeof commit!=="string"||!/^[a-f0-9]{40}$/i.test(commit))throw new Error("P22_RELEASE_COMMIT_INVALID");
  if(!["stable","candidate"].includes(channel))throw new Error("P22_RELEASE_CHANNEL_INVALID");
  if(!Number.isFinite(Date.parse(builtAt)))throw new Error("P22_RELEASE_BUILT_AT_INVALID");
  return {
    schema:"thiepn-japanese-release-meta",
    schemaVersion:1,
    phase:"P22",
    channel,
    commit:commit.toLowerCase(),
    builtAt
  };
}

export function runCli(args=process.argv.slice(2)){
  let commit=process.env.GITHUB_SHA??null;
  let channel="stable";
  let out="apps/web/public/release-meta.json";
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--commit"){commit=args[++i];continue;}
    if(arg==="--channel"){channel=args[++i];continue;}
    if(arg==="--out"){out=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  const meta=buildReleaseMeta({commit,channel});
  const target=path.resolve(ROOT,out);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,JSON.stringify(meta,null,2)+"\n");
  process.stdout.write("P22 release metadata written for "+meta.commit.slice(0,8)+" ("+meta.channel+")\n");
  return meta;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
