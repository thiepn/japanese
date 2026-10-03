import { coreContent } from "../coreContent";
import { realWorldChains } from "./realWorldPerformance";

export interface P9RegressionCertification {
  typecheck:boolean;
  unitTests:boolean;
  contentValidation:boolean;
  productionBuild:boolean;
  e2e:boolean;
  offlineDrill:boolean;
  providerOutageDrill:boolean;
  longHistoryDrill:boolean;
}

export interface P9NativeInventoryCertification {
  sourceDocuments:number;
  recordings:number;
  speakers:number;
  registers:number;
  speechRates:string[];
}

export interface P9ReleaseCheck {
  id:string;
  label:string;
  required:string;
  actual:string;
  passed:boolean;
  category:"content"|"performance"|"native_media"|"regression";
}

export interface P9ReleaseQualification {
  checks:P9ReleaseCheck[];
  passed:number;
  total:number;
  releaseQualified:boolean;
  c1RoadmapGateOpen:boolean;
}

export const P9_RELEASE_THRESHOLDS={
  b2Texts:20,
  b2ProductiveTasks:20,
  lexicalChunks:120,
  realWorldChains:5,
  realWorldPrompts:20,
  nativeSourceDocuments:4,
  nativeRecordings:8,
  nativeSpeakers:3,
  nativeRegisters:2
} as const;

export function qualifyP9Release(native:P9NativeInventoryCertification,regression:P9RegressionCertification):P9ReleaseQualification{
  const b2Texts=coreContent.readingTexts.filter((text)=>text.level==="B2").length;
  const b2Tasks=coreContent.productiveTasks.filter((task)=>task.level==="B2").length;
  const performancePrompts=realWorldChains.reduce((sum,chain)=>sum+chain.stages.length,0);
  const rates=new Set(native.speechRates);
  const checks:P9ReleaseCheck[]=[
    check("b2-text-breadth","B2 connected-text breadth",">="+P9_RELEASE_THRESHOLDS.b2Texts,String(b2Texts),b2Texts>=P9_RELEASE_THRESHOLDS.b2Texts,"content"),
    check("b2-production-breadth","B2 productive-task breadth",">="+P9_RELEASE_THRESHOLDS.b2ProductiveTasks,String(b2Tasks),b2Tasks>=P9_RELEASE_THRESHOLDS.b2ProductiveTasks,"content"),
    check("collocation-breadth","First-class B2 lexical chunks",">="+P9_RELEASE_THRESHOLDS.lexicalChunks,String(coreContent.lexicalChunks.length),coreContent.lexicalChunks.length>=P9_RELEASE_THRESHOLDS.lexicalChunks,"content"),
    check("functional-chains","Real-world functional chains",">="+P9_RELEASE_THRESHOLDS.realWorldChains,String(realWorldChains.length),realWorldChains.length>=P9_RELEASE_THRESHOLDS.realWorldChains,"performance"),
    check("unseen-performance-bank","Unseen/paraphrase/repair/timed prompt bank",">="+P9_RELEASE_THRESHOLDS.realWorldPrompts,String(performancePrompts),performancePrompts>=P9_RELEASE_THRESHOLDS.realWorldPrompts,"performance"),
    check("native-documents","Licensed native connected-source documents",">="+P9_RELEASE_THRESHOLDS.nativeSourceDocuments,String(native.sourceDocuments),native.sourceDocuments>=P9_RELEASE_THRESHOLDS.nativeSourceDocuments,"native_media"),
    check("native-recordings","Licensed native recordings",">="+P9_RELEASE_THRESHOLDS.nativeRecordings,String(native.recordings),native.recordings>=P9_RELEASE_THRESHOLDS.nativeRecordings,"native_media"),
    check("native-speakers","Independent speaker labels/credits",">="+P9_RELEASE_THRESHOLDS.nativeSpeakers,String(native.speakers),native.speakers>=P9_RELEASE_THRESHOLDS.nativeSpeakers,"native_media"),
    check("native-registers","Native register coverage",">="+P9_RELEASE_THRESHOLDS.nativeRegisters,String(native.registers),native.registers>=P9_RELEASE_THRESHOLDS.nativeRegisters,"native_media"),
    check("native-rate-natural","Natural-rate native source represented","natural",native.speechRates.join(", ")||"none",rates.has("natural"),"native_media"),
    check("native-rate-stretch","Faster-than-baseline source condition represented","fast",native.speechRates.join(", ")||"none",rates.has("fast"),"native_media"),
    regressionCheck("typecheck","TypeScript typecheck",regression.typecheck),
    regressionCheck("unit-tests","Unit/integration tests",regression.unitTests),
    regressionCheck("content-validation","Content validation",regression.contentValidation),
    regressionCheck("production-build","Production build",regression.productionBuild),
    regressionCheck("e2e","Certified viewport E2E",regression.e2e),
    regressionCheck("offline-drill","Offline resilience drill",regression.offlineDrill),
    regressionCheck("provider-outage","Provider outage drill",regression.providerOutageDrill),
    regressionCheck("long-history","Long-history projection drill",regression.longHistoryDrill)
  ];
  const passed=checks.filter((item)=>item.passed).length;
  const releaseQualified=passed===checks.length;
  return {checks,passed,total:checks.length,releaseQualified,c1RoadmapGateOpen:releaseQualified};
}

function regressionCheck(id:string,label:string,passed:boolean):P9ReleaseCheck{
  return check(id,label,"pass",passed?"pass":"not certified",passed,"regression");
}
function check(id:string,label:string,required:string,actual:string,passed:boolean,category:P9ReleaseCheck["category"]):P9ReleaseCheck{
  return {id,label,required,actual,passed,category};
}
