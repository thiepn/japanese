export type MorphologyResolution="canonical"|"generated"|"deinflected"|"provider";
export type SenseResolution="single"|"ambiguous"|"provider-resolved"|"none";

export interface MorphologyCandidate {
  surface:string;
  lemma:string;
  reading?:string;
  lexemeId?:string;
  senseIds:string[];
  resolution:MorphologyResolution;
  confidence:number;
  senseResolution:SenseResolution;
  provider?:string;
}

export interface MorphologyToken {
  surface:string;
  start:number;
  end:number;
  candidates:MorphologyCandidate[];
}

export interface MorphologyAnalysis {
  text:string;
  tokens:MorphologyToken[];
  provider:string;
  dictionaryGrade:boolean;
}

export interface JapaneseMorphologyProvider {
  id:string;
  dictionaryGrade:boolean;
  analyze(text:string):Promise<MorphologyAnalysis>;
}

export function normalizeMorphologyCandidate(candidate:MorphologyCandidate):MorphologyCandidate{
  return {
    ...candidate,
    surface:candidate.surface.normalize("NFKC"),
    lemma:candidate.lemma.normalize("NFKC"),
    senseIds:[...new Set(candidate.senseIds.filter(Boolean))],
    confidence:Math.max(0,Math.min(1,candidate.confidence)),
    senseResolution:candidate.senseIds.length===0?"none":candidate.senseResolution
  };
}

export function selectProviderCandidate(candidates:readonly MorphologyCandidate[]):MorphologyCandidate|null{
  if(!candidates.length)return null;
  return [...candidates].map(normalizeMorphologyCandidate).sort((a,b)=>{
    const sourceWeight=(value:MorphologyCandidate)=>value.resolution==="provider"?4:value.resolution==="canonical"?3:value.resolution==="generated"?2:1;
    return sourceWeight(b)-sourceWeight(a)||b.confidence-a.confidence||Number(b.senseResolution==="provider-resolved")-Number(a.senseResolution==="provider-resolved");
  })[0]??null;
}

export function senseResolutionForIds(senseIds:readonly string[]):SenseResolution{
  const count=new Set(senseIds.filter(Boolean)).size;
  return count===0?"none":count===1?"single":"ambiguous";
}
