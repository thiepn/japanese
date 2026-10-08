import fs from "node:fs";
import path from "node:path";
import {spawn,execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {chromium} from "@playwright/test";
import pixelmatch from "pixelmatch";
import {PNG} from "pngjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const baselineRoot=path.resolve(root,"../baseline");
const baseSha="d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a";
const candidateSha=execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();
const actualBase=execFileSync("git",["rev-parse","HEAD"],{cwd:baselineRoot,encoding:"utf8"}).trim();
if(actualBase!==baseSha)throw Error("J15D_D4_REFERENCE_MISMATCH: "+actualBase);
if(!/^[0-9a-f]{40}$/.test(candidateSha)||candidateSha===baseSha)throw Error("J15D_D4_CANDIDATE_INVALID");
const out=path.join(root,"artifacts/j15d-d4-screenshots");
fs.mkdirSync(out,{recursive:true});
const VIEWPORTS=[
  {id:"desktop",width:1440,height:900,deviceScaleFactor:1,isMobile:false,hasTouch:false},
  {id:"tablet",width:834,height:1112,deviceScaleFactor:1,isMobile:false,hasTouch:true},
  {id:"android-emulated",width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true}
];
const THEMES=["light","dark"];
const pages=["Today","Learn","Immerse","Library","Progress"];
const cases=[];
for(const vp of VIEWPORTS)for(const theme of THEMES)for(const surface of pages)cases.push({viewport:vp,theme,surface});
for(const [view,surface] of [
  ["desktop","Study"],["android-emulated","Study"],
  ["tablet","Reader"],["android-emulated","Reader"],
  ["desktop","Diagnostics review"],["android-emulated","Diagnostics release"]
])for(const theme of THEMES)cases.push({viewport:VIEWPORTS.find(v=>v.id===view),theme,surface});
const maxRatio=.008; // <0.8% visually changed pixels, reviewed diffs still required
const report={
  schema:"thiepn-japanese-j15d-d4-visual-comparison",schemaVersion:1,
  baselineCommit:baseSha,candidateCommit:candidateSha,
  browser:"Playwright Chromium",season:"autumn",maxChangedPixelRatio:maxRatio,
  screenshotSize:"viewport, scale=css",cases:[],passed:false,
  notes:["Identical CI runner/fonts/Chromium with separate clean guest contexts.","Pixel diffs detect visual drift, not every accessibility or functional defect.","Emulated mobile viewports are not physical Android PWA acceptance."]
};
const stdout=[];
function server(cwd,port){
  const child=spawn("pnpm",["--filter","@thiepn/japanese-web","preview","--host","127.0.0.1","--port",String(port),"--strictPort"],{
    cwd,env:{...process.env,VITE_PUBLIC_BASE:"/japanese/"},stdio:["ignore","pipe","pipe"]
  });
  for(const stream of [child.stdout,child.stderr])stream.on("data",chunk=>stdout.push(String(chunk)));
  return child;
}
async function ready(port){
  const url="http://127.0.0.1:"+port+"/japanese/";
  for(let i=0;i<75;i++){
    try{const r=await fetch(url);if(r.ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw Error("Preview failed: "+url+" "+stdout.slice(-16).join(""));
}
function variant(surface){
  if(surface==="Diagnostics review")return {query:"&diagnostics=1&panel=review",target:".human-review-panel"};
  if(surface==="Diagnostics release")return {query:"&diagnostics=1&panel=release",target:".native-curation-panel"};
  if(surface==="Study")return {query:"",target:".j5-study"};
  if(surface==="Reader")return {query:"",target:".j6-reader"};
  return {query:"",target:{Today:".j3-today__hero",Learn:".j4-hero",Immerse:".j6-hero",Library:".j7-library__masthead",Progress:".j8-hero"}[surface]};
}
async function capture(browser,port,spec){
  const ctx=await browser.newContext({
    viewport:{width:spec.viewport.width,height:spec.viewport.height},
    deviceScaleFactor:spec.viewport.deviceScaleFactor,
    hasTouch:spec.viewport.hasTouch,isMobile:spec.viewport.isMobile,
    reducedMotion:"reduce",colorScheme:spec.theme==="dark"?"dark":"light",
    locale:"en-US",timezoneId:"Europe/Berlin",serviceWorkers:"block"
  });
  try{
    const page=await ctx.newPage();
    page.setDefaultTimeout(15_000);
    page.setDefaultNavigationTimeout(30_000);
    await page.addInitScript(theme=>{
      localStorage.setItem("japanese:j-theme",theme);
      localStorage.setItem("japanese:j9-sensory","off");
    },spec.theme);
    const state=variant(spec.surface);
    await page.goto("http://127.0.0.1:"+port+"/japanese/?season=autumn"+state.query,{waitUntil:"domcontentloaded",timeout:30000});
    await page.locator(".j2-shell").waitFor({state:"visible",timeout:15000});
    const responsive=spec.viewport.width<=760?"--j12-mobile":"--j13-exhibition";
    await page.waitForFunction(key=>getComputedStyle(document.querySelector(".j2-shell")).getPropertyValue(key).trim()==="1",responsive,{timeout:12000});
    if(spec.surface==="Study"){
      await page.getByRole("button",{name:/Continue today’s study|Review anyway/}).click();
    }else if(spec.surface==="Reader"){
      await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:"Immerse",exact:true}).click();
      await page.locator(".j6-cover").filter({hasText:"A school morning"}).getByRole("button",{name:"Open text"}).click();
    }else if(!spec.surface.startsWith("Diagnostics")){
      await page.getByRole("navigation",{name:"Primary"}).getByRole("button",{name:spec.surface,exact:true}).click();
    }
    await page.locator(state.target).waitFor({state:"visible",timeout:20000});
    await page.evaluate(async()=>{await document.fonts.ready;});
    await page.addStyleTag({content:"*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.j2-account-status{visibility:hidden!important}"});
    await page.waitForTimeout(120);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    if(overflow>1)throw Error("Document horizontal overflow: "+overflow+"px");
    return await page.screenshot({animations:"disabled",caret:"hide",scale:"css",fullPage:false});
  }finally{await ctx.close();}
}
let left=null,right=null,browser=null;
try{
  left=server(baselineRoot,4173);right=server(root,4174);
  await Promise.all([ready(4173),ready(4174)]);
  browser=await chromium.launch({headless:true});
  for(let i=0;i<cases.length;i++){
    const spec=cases[i],label=[spec.viewport.id,spec.theme,spec.surface.toLowerCase().replaceAll(" ","-")].join("_");
    process.stdout.write("J15D D4 START "+label+" ("+(i+1)+"/"+cases.length+")\n");
    const result={name:label,viewport:spec.viewport.id,theme:spec.theme,surface:spec.surface,changedPixelRatio:null,passed:false,error:null};
    try{
      const [baseline,candidate]=await Promise.all([capture(browser,4173,spec),capture(browser,4174,spec)]);
      const a=PNG.sync.read(baseline),b=PNG.sync.read(candidate);
      fs.writeFileSync(path.join(out,label+"_reference.png"),baseline);
      fs.writeFileSync(path.join(out,label+"_candidate.png"),candidate);
      if(a.width!==b.width||a.height!==b.height)throw Error("Image dimensions mismatch "+a.width+"x"+a.height+" / "+b.width+"x"+b.height);
      const diff=new PNG({width:a.width,height:a.height});
      const changed=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.1,includeAA:false});
      fs.writeFileSync(path.join(out,label+"_diff.png"),PNG.sync.write(diff));
      const ratio=changed/(a.width*a.height);
      result.changedPixels=changed;result.totalPixels=a.width*a.height;result.changedPixelRatio=ratio;
      result.passed=ratio<=maxRatio;
      if(!result.passed)result.error="Exceeded D4 visual drift limit "+(maxRatio*100)+"%";
    }catch(e){result.error=String(e?.message??e);}
    report.cases.push(result);
    process.stdout.write(label+" "+(result.passed?"PASS":"FAIL")+" "+(result.changedPixelRatio===null?"":(100*result.changedPixelRatio).toFixed(3)+"%")+" "+(result.error??"")+"\n");
  }
}finally{
  if(browser)await browser.close();
  if(left)left.kill("SIGTERM");
  if(right)right.kill("SIGTERM");
  report.passed=report.cases.length===cases.length&&report.cases.every(x=>x.passed);
  fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(root,"artifacts/j15d-d4-visual-comparison.json"),JSON.stringify(report,null,2)+"\n");
}
if(!report.passed)throw Error("J15D_D4_VISUAL_COMPARISON_FAILED: "+report.cases.filter(x=>!x.passed).map(x=>x.name+" "+x.error).join(" | "));
process.stdout.write("J15D D4 VISUAL PASS: "+report.cases.length+" viewport/theme/surface comparisons at "+candidateSha+"\n");
