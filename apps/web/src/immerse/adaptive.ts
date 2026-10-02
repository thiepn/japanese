import { getImmersionProgress } from "./reader";
import { listPrivateDocumentViews } from "./authentic";

export interface AdaptiveImmersionRecommendation {
  focus:"reading"|"listening";
  canonical:{id:string;title:string;level:string;readiness:number;mastery:number;reason:string}|null;
  privateDocument:{id:string;title:string;knownRatio:number;difficulty:string;reason:string}|null;
}

export async function getAdaptiveImmersionRecommendation():Promise<AdaptiveImmersionRecommendation>{
  const [immersion,privateDocs]=await Promise.all([getImmersionProgress(),listPrivateDocumentViews()]);
  const readingMean=mean(immersion.texts.map((item)=>item.readingMastery));
  const listeningMean=mean(immersion.texts.map((item)=>item.listeningMastery));
  const focus:listeningOrReading= listeningMean+0.04<readingMean ? "listening" : "reading";
  const canonical=immersion.texts
    .map((item)=>{
      const mastery=focus==="reading"?item.readingMastery:item.listeningMastery;
      const target=.86;
      const levelBonus=item.level==="B1"?.12:item.level.startsWith("A2")?.06:0;
      const score=(1-Math.abs(item.readiness-target))*0.55+(1-mastery)*0.35+levelBonus;
      return {item,mastery,score};
    })
    .sort((a,b)=>b.score-a.score)[0];
  const privateBest=privateDocs
    .map((item)=>{
      const mastery=focus==="reading"?item.readingMastery:item.listeningMastery;
      const score=(1-Math.abs(item.analysis.knownRatio-.84))*.65+(1-mastery)*.35;
      return {item,score};
    })
    .sort((a,b)=>b.score-a.score)[0];
  return {
    focus,
    canonical:canonical?{
      id:canonical.item.id,title:canonical.item.title,level:canonical.item.level,readiness:canonical.item.readiness,mastery:canonical.mastery,
      reason:canonical.item.readiness>=.72&&canonical.item.readiness<=.94
        ?"Vocabulary coverage is high enough for context while leaving useful retrieval pressure."
        :"This is the closest graded text to the current target difficulty with room for new evidence."
    }:null,
    privateDocument:privateBest?{
      id:privateBest.item.document.id,title:privateBest.item.document.title,knownRatio:privateBest.item.analysis.knownRatio,
      difficulty:privateBest.item.analysis.difficulty,
      reason:privateBest.item.analysis.knownRatio>=.75&&privateBest.item.analysis.knownRatio<=.92
        ?"This import sits near the preferred stretch range for known lexical coverage."
        :"This is the closest private import to the current stretch target."
    }:null
  };
}
type listeningOrReading="reading"|"listening";
function mean(values:number[]):number{return values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;}
