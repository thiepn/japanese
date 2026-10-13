/** P53 original first-party A2 lexical usage: authored examples and transfer, no parallel grades. */
export type P53Domain="travel"|"time"|"services"|"shopping"|"study"|"work"|"digital"|"home"|"health"|"social";
export interface P53Vocabulary {
 id:string;written:string;reading:string;meaning:string;domain:P53Domain;units:readonly string[];
 collocations:readonly [string,string];
 nuance:string;scene:string;example:string;translation:string;
 misconception:string;repair:string;
 production:{situation:string;model:string};
 return:{situation:string;model:string};
}
/** Authored in compact single-line form to keep 200 pedagogical items editorially inspectable. */
export function parseP53Corpus(domain:P53Domain,raw:string):P53Vocabulary[]{
 return raw.trim().split("\n").map((line,i)=>{
   const a=line.trim().split("|").map(v=>v.trim());
   if(a.length!==16)throw new Error("P53_AUTHORING_FIELDS:"+domain+":"+(i+1)+":"+a.length);
   const [id,written,reading,meaning,unit,c1,c2,nuance,scene,example,translation,misconception,repair,productionScene,productionModel,delayed]=a;
   const split=delayed!.split("⇒");
   if(split.length!==2)throw new Error("P53_RETURN_FIELDS:"+domain+":"+id);
   return {id:id!,written:written!,reading:reading!,meaning:meaning!,domain,
    units:[unit!],collocations:[c1!,c2!],nuance:nuance!,
    scene:scene!,example:example!,translation:translation!,misconception:misconception!,
    repair:repair!,production:{situation:productionScene!,model:productionModel!},
    return:{situation:split[0]!.trim(),model:split[1]!.trim()}};
 });
}
