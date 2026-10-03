import type { MorphologyAnalysis,MorphologyCandidate,MorphologyToken,SenseResolution } from "@thiepn/japanese-nlp";

export interface DictionaryMorpheme {
  surface:string;
  dictionaryForm:string;
  reading?:string;
  partOfSpeech?:string[];
}

export interface JapaneseDictionaryTokenizer {
  provider:string;
  tokenize(text:string):Promise<DictionaryMorpheme[]>|DictionaryMorpheme[];
  healthCheck?:()=>Promise<{ok:boolean;detail?:string}>|{ok:boolean;detail?:string};
}

export function createSudachiMorphologyAdapter(tokenizer:{tokenize(text:string):unknown[];healthCheck?:()=>Promise<{ok:boolean;detail?:string}>|{ok:boolean;detail?:string}}):JapaneseDictionaryTokenizer{
  return {
    provider:"sudachi",
    ...(tokenizer.healthCheck?{healthCheck:tokenizer.healthCheck}:{}),
    tokenize(text:string):DictionaryMorpheme[]{
      return tokenizer.tokenize(text).map((raw,index)=>{
        if(!raw||typeof raw!=="object")throw new Error("SUDACHI_TOKEN_INVALID:"+index);
        const item=raw as Record<string,unknown>;
        const surface=String(item.surface??item.surfaceForm??"");
        const dictionaryForm=String(item.dictionaryForm??item.normalizedForm??surface);
        const reading=String(item.readingForm??item.reading??"").trim();
        const partOfSpeech=Array.isArray(item.partOfSpeech)?item.partOfSpeech.map(String):[];
        if(!surface)throw new Error("SUDACHI_SURFACE_MISSING:"+index);
        return {surface,dictionaryForm,...(reading?{reading}:{}),...(partOfSpeech.length?{partOfSpeech}:{})};
      });
    }
  };
}

export function createMorphologyFetchHandler(tokenizer:JapaneseDictionaryTokenizer){
  return async function handleMorphologyRequest(request:Request):Promise<Response>{
    if(request.method==="GET"){
      if(!tokenizer.healthCheck)return json({service:"japanese-morphology",status:"configured",provider:tokenizer.provider,dictionaryGrade:true,operational:null},200);
      try{
        const health=await tokenizer.healthCheck();
        return json({service:"japanese-morphology",status:health.ok?"ok":"degraded",provider:tokenizer.provider,dictionaryGrade:true,operational:health.ok,...(health.detail?{detail:health.detail}:{})},health.ok?200:503);
      }catch{return json({service:"japanese-morphology",status:"degraded",provider:tokenizer.provider,dictionaryGrade:true,operational:false},503);}
    }
    if(request.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405,{Allow:"GET, POST"});
    const contentLength=Number(request.headers.get("content-length")??0);
    if(Number.isFinite(contentLength)&&contentLength>32_768)return json({error:"REQUEST_TOO_LARGE"},413);
    let raw:unknown;
    try{raw=await request.json();}catch{return json({error:"INVALID_JSON"},400);}
    const text=String((raw as Record<string,unknown>)?.text??"").normalize("NFKC").trim();
    if(!text)return json({error:"MORPHOLOGY_TEXT_REQUIRED"},400);
    if(text.length>12_000)return json({error:"MORPHOLOGY_TEXT_TOO_LONG"},400);
    try{
      const morphemes=await tokenizer.tokenize(text);
      const tokens:MorphologyToken[]=[];
      let cursor=0;
      for(const morpheme of morphemes){
        let start=text.indexOf(morpheme.surface,cursor);
        if(start<0)start=cursor;
        const end=Math.min(text.length,start+morpheme.surface.length);
        cursor=end;
        const senseResolution:SenseResolution="none";
        const candidate:MorphologyCandidate={
          surface:morpheme.surface,lemma:morpheme.dictionaryForm,...(morpheme.reading?{reading:morpheme.reading}:{}),
          senseIds:[],resolution:"provider",confidence:.98,senseResolution,provider:tokenizer.provider
        };
        tokens.push({surface:morpheme.surface,start,end,candidates:[candidate]});
      }
      const body:MorphologyAnalysis={text,tokens,provider:tokenizer.provider,dictionaryGrade:true};
      return json(body,200);
    }catch{return json({error:"MORPHOLOGY_PROVIDER_FAILED"},502);}
  };
}

function json(body:unknown,status:number,headers:Record<string,string>={}):Response{
  return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
}
