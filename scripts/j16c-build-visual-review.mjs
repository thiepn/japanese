import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export const BASELINE="d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a";
const SHA=/^[0-9a-f]{40}$/;
export function visualCaseNames(){
  const result=[];
  for(const viewport of ["desktop","tablet","android-emulated"])for(const theme of ["light","dark"])for(const surface of ["today","learn","immerse","library","progress"])result.push(viewport+"_"+theme+"_"+surface);
  for(const [view,surface] of [["desktop","study"],["android-emulated","study"],["tablet","reader"],["android-emulated","reader"],["desktop","diagnostics-review"],["android-emulated","diagnostics-release"]])for(const theme of ["light","dark"])result.push(view+"_"+theme+"_"+surface);
  return result;
}
export function auditVisualReview({report,expectedCommit,imageExists}){
  const failures=[],expected=visualCaseNames();
  if(report?.schema!=="thiepn-japanese-j15d-d4-visual-comparison"||report?.schemaVersion!==1)failures.push("SCHEMA_INVALID");
  if(!SHA.test(expectedCommit??""))failures.push("EXPECTED_SHA_INVALID");
  if(report?.baselineCommit!==BASELINE)failures.push("BASELINE_MISMATCH");
  if(report?.candidateCommit!==expectedCommit)failures.push("CANDIDATE_MISMATCH");
  if(report?.passed!==true)failures.push("COMPARISON_FAILED");
  if(!Array.isArray(report?.cases)||report.cases.length!==42)failures.push("EXACTLY_42_CASES_REQUIRED");
  const cases=report?.cases??[],names=new Set(cases.map(c=>c.name));
  if(names.size!==cases.length)failures.push("DUPLICATE_CASE");
  for(const name of expected){
    const c=cases.find(x=>x.name===name);
    if(!c){failures.push("MISSING_CASE:"+name);continue;}
    if(c.passed!==true||typeof c.changedPixelRatio!=="number"||!Number.isFinite(c.changedPixelRatio)||c.changedPixelRatio<0||c.changedPixelRatio>.008)failures.push("FAILED_CASE:"+name);
    for(const kind of ["reference","candidate","diff"]){
      const file=name+"_"+kind+".png";
      if(!imageExists(file))failures.push("MISSING_IMAGE:"+file);
    }
  }
  for(const c of cases)if(!expected.includes(c.name))failures.push("UNEXPECTED_CASE:"+c.name);
  return {schema:"thiepn-japanese-j16c-visual-archive-audit",schemaVersion:1,passed:failures.length===0,baselineCommit:BASELINE,candidateCommit:expectedCommit,caseCount:names.size,expectedImageCount:126,failures,note:"Archive integrity is not visual human approval or real-device evidence."};
}

const TEMPLATE="<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Japanese · J16C Visual Review</title>\n<style>\n:root{color-scheme:light;background:#f5f2ec;color:#24272c;font:15px/1.5 system-ui,sans-serif}\n*{box-sizing:border-box}body{margin:0}header{padding:22px 3%;border-bottom:2px solid #34393b;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}\nh1,h2{font:400 31px/1.2 Georgia,serif;margin:0}header small{font:12px/1.7 monospace;color:#505b60}\nbutton,select,textarea{font:inherit;border-radius:0}button{cursor:pointer;border:1px solid #34393b;padding:7px 11px;background:#f5f2ec}\nbutton:hover,button:focus-visible{background:#223b48;color:white;outline:2px solid #223b48;outline-offset:2px}\n.page{display:grid;grid-template-columns:240px minmax(0,1fr)}aside{border-right:1px solid #929796;padding:12px;max-height:calc(100vh - 120px);overflow:auto;position:sticky;top:0}\naside button{display:block;width:100%;font-size:12px;border:0;border-bottom:1px solid #ccc;text-align:left;padding:7px}\naside button[aria-current=true]{background:#dfe7e4;border-left:4px solid #2a5260;font-weight:700}\nmain{min-width:0;padding:25px 3%}.controls{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid #9ca3a2;padding-bottom:15px}\n.controls div{display:flex;gap:8px;flex-wrap:wrap}#details{font:12px monospace;color:#606468;margin:9px 0 20px}\n.panels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.panel{border:1px solid #a2a7a4;background:white}\n.panel h3{padding:8px;margin:0;border-bottom:1px solid #a2a7a4;text-transform:uppercase;letter-spacing:.06em;font:600 11px monospace}\n.panel a{display:block;overflow:auto;max-height:680px}.panel img{display:block;max-width:100%;margin:auto;height:auto}\n.review{margin-top:20px;padding-top:15px;border-top:2px solid #34393b;display:flex;flex-wrap:wrap;gap:14px}\n.review label{display:grid;gap:6px;font-size:13px;font-weight:600}textarea{min-height:90px;width:min(600px,80vw);padding:9px;border:1px solid #a2a7a4}\nselect{padding:9px;background:white}p.note{color:#5c6266;font-size:13px;max-width:1000px}\nfooter{padding:17px 3%;border-top:1px solid #9ca3a2;font-size:12px;color:#5c6266}\n@media(max-width:1000px){.panels{grid-template-columns:1fr}.panel a{max-height:600px}}\n@media(max-width:650px){.page{display:block}aside{position:static;max-height:140px;border-right:0;border-bottom:1px solid #929796}aside button{width:auto;display:inline-block}}\n</style></head>\n<body><header><h1><span lang=\"ja\">視覚審査</span> / Visual review</h1><small id=\"identity\"></small></header>\n<div class=\"page\"><aside><p id=\"progress\"></p><nav aria-label=\"Review cases\" id=\"index\"></nav></aside>\n<main><div class=\"controls\"><h2 id=\"title\"></h2><div>\n<button id=\"previous\">Previous</button><button id=\"next\">Next</button><button id=\"export\">Export draft</button><button id=\"clear\">Clear local notes</button>\n</div></div><p id=\"details\"></p><section class=\"panels\" id=\"panels\"></section>\n<div class=\"review\"><label>Reviewer assessment<select id=\"assessment\"><option value=\"pending\">Not reviewed</option><option value=\"pass\">Inspected: no defect</option><option value=\"fail\">Potential defect</option></select></label>\n<label>Observation<textarea id=\"observation\" placeholder=\"Note Japanese readability, cropping, theme contrast, composition, and unexpected changes.\"></textarea></label></div>\n<p class=\"note\">Visual comparison is not accessibility/keyboard/TalkBack or physical Android acceptance. Review notes are drafts. The final J15D D5 signoff requires independent reviewer identity, real evidence and commit verification.</p></main></div>\n<footer>Offline viewer; all notes stay in local browser storage. No uploads, Account access, or release authorization.</footer>\n<script type=\"application/json\" id=\"data\">__DATA__</script>\n<script>\n(()=>{\"use strict\";\nconst data=JSON.parse(document.getElementById(\"data\").textContent);\nconst prefix=\"j16c-review:\"+data.candidate;\nlet state={};try{state=JSON.parse(localStorage.getItem(prefix)||\"{}\")}catch{}\nlet selected=0;const get=id=>document.getElementById(id);\nget(\"identity\").textContent=\"BASELINE: \"+data.baseline+\" / CANDIDATE: \"+data.candidate;\nfunction persist(){try{localStorage.setItem(prefix,JSON.stringify(state))}catch{}}\nfunction render(){\n  const entry=data.cases[selected],s=state[entry.name]||{};\n  get(\"title\").textContent=entry.surface+\" · \"+entry.viewport;\n  get(\"details\").textContent=entry.name+\" · \"+entry.theme+\" · visual changed pixels \"+(100*entry.changedPixelRatio).toFixed(4)+\"%\";\n  get(\"assessment\").value=s.status||\"pending\";get(\"observation\").value=s.observation||\"\";\n  get(\"panels\").replaceChildren();\n  for(const kind of [\"reference\",\"candidate\",\"diff\"]){\n    const panel=document.createElement(\"div\");panel.className=\"panel\";\n    const heading=document.createElement(\"h3\");heading.textContent=kind;panel.append(heading);\n    const a=document.createElement(\"a\");a.href=\"../j15d-d4-screenshots/\"+entry.name+\"_\"+kind+\".png\";a.target=\"_blank\";a.rel=\"noopener\";\n    const img=document.createElement(\"img\");img.src=a.href;img.alt=entry.name+\" \"+kind+\" screenshot\";img.loading=\"lazy\";a.append(img);panel.append(a);get(\"panels\").append(panel);\n  }\n  get(\"index\").replaceChildren();for(let i=0;i<data.cases.length;i++){\n    const v=data.cases[i],button=document.createElement(\"button\");button.textContent=v.name+\" \"+(state[v.name]?.status===\"pass\"?\"✓\":state[v.name]?.status===\"fail\"?\"!\":\"·\");\n    button.setAttribute(\"aria-current\",String(i===selected));button.addEventListener(\"click\",()=>{selected=i;render()});get(\"index\").append(button);\n  }\n  const reviewed=data.cases.filter(c=>[\"pass\",\"fail\"].includes(state[c.name]?.status)).length;\n  get(\"progress\").textContent=reviewed+\" / 42 cases inspected; \"+data.cases.filter(c=>state[c.name]?.status===\"fail\").length+\" flagged\";\n}\nfunction move(by){selected=(selected+by+data.cases.length)%data.cases.length;render()}\nget(\"previous\").addEventListener(\"click\",()=>move(-1));get(\"next\").addEventListener(\"click\",()=>move(1));\ndocument.addEventListener(\"keydown\",event=>{if([\"TEXTAREA\",\"INPUT\",\"SELECT\"].includes(document.activeElement.tagName))return;if(event.key===\"ArrowLeft\")move(-1);if(event.key===\"ArrowRight\")move(1)});\nfor(const id of [\"assessment\",\"observation\"])get(id).addEventListener(\"change\",()=>{state[data.cases[selected].name]={status:get(\"assessment\").value,observation:get(\"observation\").value};persist();render()});\nget(\"clear\").addEventListener(\"click\",()=>{if(!confirm(\"Remove locally stored visual-review notes?\"))return;state={};persist();render()});\nget(\"export\").addEventListener(\"click\",()=>{\n const reviewedCases=data.cases.filter(c=>[\"pass\",\"fail\"].includes(state[c.name]?.status)).map(c=>c.name);\n const draft={schema:\"thiepn-japanese-j16c-review-draft\",status:\"draft_not_approved\",baselineCommit:data.baseline,candidateCommit:data.candidate,reviewedCases,observations:state,exportedAt:new Date().toISOString(),note:\"Not a D5 review approval; manual reviewer identity and independent evidence required.\"};\n const url=URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)],{type:\"application/json\"}));\n const a=document.createElement(\"a\");a.href=url;a.download=\"j16c-review-draft.json\";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);\n});render();})();\n</script></body></html>";

export function renderGallery({report,audit}){
  const byName=new Map(report.cases.map(c=>[c.name,c]));
  const data={baseline:audit.baselineCommit,candidate:audit.candidateCommit,cases:visualCaseNames().map(name=>byName.get(name))};
  const json=JSON.stringify(data).replaceAll("<","\\u003c");
  return TEMPLATE.replace("__DATA__",json);
}
export function createVisualReview({reportPath,imageDir,outDir,expectedCommit}){
  const report=JSON.parse(fs.readFileSync(reportPath,"utf8"));
  const audit=auditVisualReview({report,expectedCommit,imageExists:name=>{
    const file=path.join(imageDir,name);return fs.existsSync(file)&&fs.statSync(file).isFile()&&fs.statSync(file).size>100;
  }});
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,"review-validation.json"),JSON.stringify(audit,null,2)+"\n");
  if(!audit.passed)throw Error("J16C_VISUAL_ARCHIVE_INVALID: "+audit.failures.join(" | "));
  fs.writeFileSync(path.join(outDir,"index.html"),renderGallery({report,audit}));
  return audit;
}
export function runCli(args=process.argv.slice(2)){
  const value=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
  const expectedCommit=value("--commit");
  const reportPath=path.resolve(ROOT,value("--report")??"artifacts/j15d-d4-visual-comparison.json");
  const imageDir=path.resolve(ROOT,value("--images")??"artifacts/j15d-d4-screenshots");
  const outDir=path.resolve(ROOT,value("--out")??"artifacts/j16c-review");
  const audit=createVisualReview({reportPath,imageDir,outDir,expectedCommit});
  process.stdout.write("J16C visual archive PASS: "+audit.caseCount+" cases / "+audit.expectedImageCount+" image files; human review pending\n");
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{runCli();}catch(e){process.stderr.write(String(e?.stack??e)+"\n");process.exitCode=1;}
}
