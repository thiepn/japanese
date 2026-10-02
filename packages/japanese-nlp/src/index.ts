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


export interface HttpMorphologyProviderOptions {
  providerId?:string;
  fetchImpl?:typeof fetch;
  maxCharacters?:number;
}

export function createHttpJapaneseMorphologyProvider(endpoint:string,options:HttpMorphologyProviderOptions={}):JapaneseMorphologyProvider{
  const url=endpoint.trim();
  if(!url)throw new Error("MORPHOLOGY_ENDPOINT_REQUIRED");
  const fetchImpl=options.fetchImpl??fetch;
  const maxCharacters=Math.max(256,options.maxCharacters??12_000);
  return {
    id:options.providerId??"remote-dictionary-grade",
    dictionaryGrade:true,
    async analyze(text:string):Promise<MorphologyAnalysis>{
      const normalized=text.normalize("NFKC").trim();
      if(!normalized)return {text:normalized,tokens:[],provider:options.providerId??"remote-dictionary-grade",dictionaryGrade:true};
      if(normalized.length>maxCharacters)throw new Error("MORPHOLOGY_TEXT_TOO_LONG");
      const response=await fetchImpl(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:normalized})});
      if(!response.ok)throw new Error("MORPHOLOGY_PROVIDER_FAILED:"+response.status);
      const raw=await response.json() as unknown;
      return parseMorphologyAnalysis(raw,normalized,options.providerId);
    }
  };
}

export function parseMorphologyAnalysis(raw:unknown,text:string,expectedProvider?:string):MorphologyAnalysis{
  if(!raw||typeof raw!=="object")throw new Error("MORPHOLOGY_RESPONSE_INVALID");
  const value=raw as Record<string,unknown>;
  if(value.dictionaryGrade!==true)throw new Error("MORPHOLOGY_PROVIDER_NOT_DICTIONARY_GRADE");
  const provider=String(value.provider??expectedProvider??"dictionary-grade").trim();
  if(!provider)throw new Error("MORPHOLOGY_PROVIDER_ID_REQUIRED");
  if(expectedProvider&&provider!==expectedProvider)throw new Error("MORPHOLOGY_PROVIDER_ID_MISMATCH");
  if(!Array.isArray(value.tokens))throw new Error("MORPHOLOGY_TOKENS_REQUIRED");
  const tokens:MorphologyToken[]=value.tokens.map((item,index)=>{
    if(!item||typeof item!=="object")throw new Error("MORPHOLOGY_TOKEN_INVALID:"+index);
    const token=item as Record<string,unknown>;
    const surface=String(token.surface??"");
    const start=Number(token.start),end=Number(token.end);
    if(!surface||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||end>text.length)throw new Error("MORPHOLOGY_TOKEN_RANGE_INVALID:"+index);
    const candidates=Array.isArray(token.candidates)?token.candidates:[];
    const normalizedCandidates=candidates.map((entry,candidateIndex)=>{
      if(!entry||typeof entry!=="object")throw new Error("MORPHOLOGY_CANDIDATE_INVALID:"+index+":"+candidateIndex);
      const candidate=entry as Record<string,unknown>;
      const senseIds=Array.isArray(candidate.senseIds)?candidate.senseIds.map(String):[];
      return normalizeMorphologyCandidate({
        surface:String(candidate.surface??surface),lemma:String(candidate.lemma??surface),
        ...(candidate.reading?{reading:String(candidate.reading)}:{}),...(candidate.lexemeId?{lexemeId:String(candidate.lexemeId)}:{}),
        senseIds,resolution:"provider",confidence:Number.isFinite(Number(candidate.confidence))?Number(candidate.confidence):.95,
        senseResolution:(candidate.senseResolution==="provider-resolved"||candidate.senseResolution==="single"||candidate.senseResolution==="ambiguous"||candidate.senseResolution==="none")
          ?candidate.senseResolution as SenseResolution:senseResolutionForIds(senseIds),provider
      });
    });
    return {surface,start,end,candidates:normalizedCandidates};
  });
  return {text,tokens,provider,dictionaryGrade:true};
}
