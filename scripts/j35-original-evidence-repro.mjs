import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
import {createJ34FieldKit,validateObservationExport} from "./j34-real-world-field-kit.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/;
const HASH=/^[0-9a-f]{64}$/;
const PNG_SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
const digest=value=>crypto.createHash("sha256").update(value).digest("hex");
const error=id=>{throw Error("J35_"+id)};
const VIS=Array.from({length:42},(_,i)=>"VIS-"+String(i+1).padStart(3,"0"));
const PNG=Array.from({length:126},(_,i)=>"PNG-"+String(i+1).padStart(3,"0"));

function jsonFromFile(p,label,max=3_000_000){
 const bytes=fs.readFileSync(p);
 if(bytes.length<2||bytes.length>max)error(label+"_SIZE");
 try{return {data:JSON.parse(bytes.toString("utf8")),sha256:digest(bytes)}}
 catch{error(label+"_JSON")}
}
function canonicalKit(j33,j34,candidateCommit){
 if(!SHA.test(candidateCommit))error("COMMIT_REQUIRED");
 const expected=createJ34FieldKit(j33,candidateCommit);
 if(JSON.stringify(j34)!==JSON.stringify(expected))error("J34_KIT_NOT_CANONICAL");
 return expected;
}
/** Operator reports are NOT admitted evidence. Raw operator notes and references never enter the derived output. */
export function makeReproductionReport({candidateCommit,j33,j34,observation=null,visual=null}){
 const kit=canonicalKit(j33,j34,candidateCommit);
 const checks=kit.groups.flatMap(g=>g.checks.map(c=>({
  group:g.id,check:c.id,description:c.instructions,reportedStatus:"NOT_TESTED",
  nextAction:"REQUEST_REAL_OPERATOR_OBSERVATION",noteSha256:null,evidenceReferenceSha256:null,
  operatorClaimOnly:true,independentlyVerified:false
 })));
 if(observation!==null){
  validateObservationExport(observation,kit);
  if(typeof observation.recordedAt!=="string"||!Number.isFinite(Date.parse(observation.recordedAt))||
     typeof observation.operatorAlias!=="string"||observation.operatorAlias.length>64)error("OBSERVATION_METADATA_INVALID");
  for(let i=0;i<checks.length;i++){
   const received=observation.observations[i],entry=checks[i];
   entry.reportedStatus=received.status;
   entry.noteSha256=received.note?digest(received.note):null;
   entry.evidenceReferenceSha256=received.evidenceRef?digest(received.evidenceRef):null;
   entry.nextAction=received.status==="OBSERVED_FAIL"?"REPRODUCE_ON_EXACT_BUILD_AND_FILE_ISSUE":
    received.status==="OBSERVED_PASS"?"OBTAIN_INDEPENDENT_WITNESS_AND_AUTHORITY":
    "REQUEST_REAL_OPERATOR_OBSERVATION";
  }
 }
 if(visual!==null&&(visual.schema!=="thiepn-japanese-j35-original-bytes-inventory"||
    visual.candidateCommit!==candidateCommit||visual.checkedPngs!==126||
    visual.mappedCases!==42||visual.humanApprovedCases!==0||visual.humanApprovedPngs!==0))error("VISUAL_SUMMARY_INVALID");
 const outcomes={
  notTested:checks.filter(c=>c.reportedStatus==="NOT_TESTED").length,
  operatorReportedPasses:checks.filter(c=>c.reportedStatus==="OBSERVED_PASS").length,
  operatorReportedFailures:checks.filter(c=>c.reportedStatus==="OBSERVED_FAIL").length
 };
 return {
  schema:"thiepn-japanese-j35-reproduction-and-original-custody",version:1,candidateCommit,
  j34ReportSha256:digest(Buffer.from(JSON.stringify(kit))),
  intakeMode:"UNVERIFIED_OPERATOR_CLAIMS_AND_OPTIONAL_ORIGINAL_BYTE_INTEGRITY_ONLY",
  fieldChecks:checks,fieldSummary:outcomes,
  originalPngBytesInspected:visual?.checkedPngs??0,
  originalCaseMappingsInspected:visual?.mappedCases??0,
  originalSourceManifestSha256:visual?.manifestSha256??null,
  originalArchiveClaimIndependent:false,originalSourceAuthenticityCertified:false,
  originalVisualCasesHumanApproved:0,originalPngsHumanApproved:0,
  physicalAndroidAccepted:false,realAccountOAuthAccepted:false,
  independentJapaneseAndP11Accepted:false,rollbackAccepted:false,
  humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"BLOCKED_REAL_WORLD_EVIDENCE_NOT_INDEPENDENTLY_ACCEPTED"
 };
}
function safeRawPng(bytes,label){
 if(bytes.length<45||bytes.length>20_000_000||
 !bytes.subarray(0,8).equals(PNG_SIGNATURE)||
 bytes.toString("ascii",12,16)!=="IHDR"||
 bytes.readUInt32BE(16)<1||bytes.readUInt32BE(16)>32768||
 bytes.readUInt32BE(20)<1||bytes.readUInt32BE(20)>32768||
 bytes.toString("ascii",bytes.length-8,bytes.length-4)!=="IEND")error("PNG_STRUCTURE:"+label);
}
/** Optional local-only original inventory inspection; hashes and counts do not prove originality. */
export function inspectOriginalFiles({manifest,manifestBytes,sourceRoot,candidateCommit}){
 if(!SHA.test(candidateCommit)||manifest?.schema!=="thiepn-japanese-j35-original-files"||
 manifest.version!==1||manifest.candidateCommit!==candidateCommit||
 manifest.humanApprovedCases!==0||manifest.humanApprovedPngs!==0||
 !Array.isArray(manifest.cases)||manifest.cases.length!==42||
 !Array.isArray(manifest.pngs)||manifest.pngs.length!==126||
 !Buffer.isBuffer(manifestBytes))error("ORIGINAL_MANIFEST_INVALID");
 const root=fs.realpathSync(sourceRoot);
 if(!fs.statSync(root).isDirectory())error("ORIGINAL_ROOT_INVALID");
 const perCase=new Map(VIS.map(id=>[id,0]));
 for(let i=0;i<42;i++){
  const c=manifest.cases[i];
  if(c?.id!==VIS[i]||typeof c.originalCaseLabel!=="string"||
  !c.originalCaseLabel.trim()||c.originalCaseLabel.length>160||
  c.humanCompared!==false)error("ORIGINAL_CASE_MAPPING");
 }
 const seenPaths=new Set(),seenNames=new Set(),sourceDigests=[];
 for(let i=0;i<126;i++){
  const p=manifest.pngs[i];
  if(p?.id!==PNG[i]||!perCase.has(p.caseId)||
   !/^original\/[a-z0-9-]{1,80}\.png$/.test(p.relativePath??"")||
   seenPaths.has(p.relativePath)||typeof p.originalFilename!=="string"||
   !/^[^\/\\\u0000-\u001f]{1,160}\.png$/i.test(p.originalFilename)||
   seenNames.has(p.originalFilename)||!HASH.test(p.sha256??"")||
   p.humanApproved!==false||
   !Number.isSafeInteger(p.bytes)||p.bytes<45||p.bytes>20_000_000)error("ORIGINAL_PNG_INVENTORY");
  const file=path.resolve(root,p.relativePath);
  if(!file.startsWith(root+path.sep))error("ORIGINAL_PATH_ESCAPE");
  const stat=fs.lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink())error("ORIGINAL_NONFILE_OR_SYMLINK");
  const real=fs.realpathSync(file);
  if(!real.startsWith(root+path.sep)||real!==file)error("ORIGINAL_REALPATH_ESCAPE");
  if(stat.size!==p.bytes)error("ORIGINAL_LENGTH:"+p.id);
  const bytes=fs.readFileSync(real);
  if(bytes.length!==p.bytes||digest(bytes)!==p.sha256)error("ORIGINAL_HASH:"+p.id);
  safeRawPng(bytes,p.id);
  seenPaths.add(p.relativePath);seenNames.add(p.originalFilename);
  perCase.set(p.caseId,perCase.get(p.caseId)+1);
  sourceDigests.push(p.sha256);
 }
 if([...perCase.values()].some(x=>x<1))error("UNMAPPED_CASE");
 return {schema:"thiepn-japanese-j35-original-bytes-inventory",version:1,
  candidateCommit,checkedPngs:126,mappedCases:42,
  manifestSha256:digest(manifestBytes),
  digestInventorySha256:digest(sourceDigests.join("\n")),
  bytesValidatedOnly:true,sourceAuthenticityVerified:false,
  humanApprovedCases:0,humanApprovedPngs:0,releaseAuthorized:false};
}
export function reportMarkdown(report){
 if(report?.schema!=="thiepn-japanese-j35-reproduction-and-original-custody"||
 report.releaseAuthorized!==false||report.decision!=="BLOCKED_REAL_WORLD_EVIDENCE_NOT_INDEPENDENTLY_ACCEPTED")error("REPORT_UNSAFE");
 const lines=[
 "# Japanese J35 — actual-source reproduction worklist","",
 "Candidate: "+report.candidateCommit,
 "Decision: BLOCKED (no independent human or physical acceptance)",
 "Input: unverified J34 operator observations, optionally original bytes inspected offline",
 "Original PNG bytes checked: "+report.originalPngBytesInspected+"/126; original case mappings: "+report.originalCaseMappingsInspected+"/42",
 "Note text and raw evidence references are intentionally NOT included.",
 "",
 "## Reported problems (operator statements only)",""
 ];
 const failed=report.fieldChecks.filter(x=>x.reportedStatus==="OBSERVED_FAIL");
 if(!failed.length)lines.push("- No operator-reported failures supplied; real-world testing still pending.");
 for(const x of failed)lines.push("- "+x.group+"/"+x.check+" — reproduce on the exact candidate; note digest "+(x.noteSha256??"absent")+
  "; evidence-reference digest "+(x.evidenceReferenceSha256??"absent"));
 lines.push("","## Next physical and human actions","",
 "- Authorize disposable exact-head staging; verify real Account Google OAuth and per-owner isolation.",
 "- Witness actual installed Android PWA/TalkBack/audio/microphone/offline and data recovery.",
 "- Obtain original Japanese and P11 reviewer assessments without leaking learner artifacts into CI.",
 "- Recover original 42-case/126-PNG sources in independent custody and conduct human visual review.",
 "- Separately authorize and witness exact staging identity and a genuine previous-stable rollback.",
 "",
 "All machine approvals are false. Source hashes and operator notes do not constitute authenticated human evidence.");
 return lines.join("\n")+"\n";
}
function cli(args){
 const opts={};
 for(let i=0;i<args.length;i++){
  const k=args[i];
  if(!["--operator-export","--original-manifest","--original-root"].includes(k)||
    !args[i+1]||args[i+1].startsWith("--"))error("CLI_ARGUMENT");
  if(opts[k])error("DUPLICATE_ARG");
  opts[k]=args[++i];
 }
 if(Boolean(opts["--original-manifest"])!==Boolean(opts["--original-root"]))error("ORIGINAL_INPUT_PAIR_REQUIRED");
 const sha=process.env.J35_CANDIDATE_SHA;
 const j33=jsonFromFile(path.join(ROOT,"artifacts/j33-evidence-triage.json"),"J33").data;
 const j34=jsonFromFile(path.join(ROOT,"artifacts/j34-field-kit.json"),"J34").data;
 const kit=canonicalKit(j33,j34,sha);
 const observation=opts["--operator-export"]?jsonFromFile(opts["--operator-export"],"OPERATOR").data:null;
 let visual=null;
 if(opts["--original-manifest"]){
  const raw=fs.readFileSync(opts["--original-manifest"]);
  if(raw.length<2||raw.length>3_000_000)error("ORIGINAL_MANIFEST_SIZE");
  let original;try{original=JSON.parse(raw.toString("utf8"))}catch{error("ORIGINAL_MANIFEST_JSON")}
  visual=inspectOriginalFiles({manifest:original,manifestBytes:raw,sourceRoot:opts["--original-root"],candidateCommit:sha});
 }
 const report=makeReproductionReport({candidateCommit:sha,j33,j34:kit,observation,visual});
 const dir=path.join(ROOT,"artifacts");fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,"j35-evidence-reproduction.json"),JSON.stringify(report,null,2)+"\n");
 fs.writeFileSync(path.join(dir,"j35-evidence-reproduction.md"),reportMarkdown(report));
 console.log("J35 BLOCKED: "+report.fieldSummary.operatorReportedFailures+" unverified failure observations, "+report.originalPngBytesInspected+"/126 original bytes structurally inspected; all human/release approval false");
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))cli(process.argv.slice(2));
