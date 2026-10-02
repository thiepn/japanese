import { gradedReadingTexts } from "../coreContent";
import type { ImmersionProgress,ImmersionTextProgress } from "./reader";

export interface ExtensiveTrack {
  id:string;
  title:string;
  description:string;
  textIds:string[];
  minutes:number;
  readiness:number;
  completed:number;
  total:number;
  nextText:ImmersionTextProgress|null;
}

const TRACKS=[
  {id:"work-negotiation",title:"Work, decisions & negotiation",description:"Build endurance across workplace change, priorities, compromise and responsible technology use.",tags:["workplace","interaction","technology"]},
  {id:"evidence-media",title:"Evidence, media & research",description:"Move between source checking, survey interpretation and balanced evidence-based synthesis.",tags:["media","academic-lite","synthesis"]},
  {id:"community-policy",title:"Community, policy & public life",description:"Follow connected arguments about services, education, disaster preparation and social change.",tags:["community","public","society"]},
  {id:"environment-everyday",title:"Environment & everyday choices",description:"Practice comparing realistic trade-offs in energy, housing, transport and daily decisions.",tags:["environment","everyday"]}
] as const;

export function buildExtensiveTracks(progress:ImmersionProgress):ExtensiveTrack[]{
  const progressById=new Map(progress.texts.map((item)=>[item.id,item] as const));
  return TRACKS.map((track)=>{
    const texts=gradedReadingTexts.filter((text)=>text.level==="B2"&&text.tags.some((tag)=>track.tags.includes(tag as never)));
    const projected=texts.map((text)=>progressById.get(text.id)).filter((item):item is ImmersionTextProgress=>Boolean(item));
    const readiness=projected.length?projected.reduce((sum,item)=>sum+item.readiness,0)/projected.length:0;
    const completed=projected.filter((item)=>item.readingEvidence>0&&item.listeningEvidence>0).length;
    const ranked=[...projected].sort((a,b)=>{
      const aDone=Number(a.readingEvidence>0&&a.listeningEvidence>0),bDone=Number(b.readingEvidence>0&&b.listeningEvidence>0);
      return aDone-bDone||Math.abs(.82-b.readiness)-Math.abs(.82-a.readiness)||b.readiness-a.readiness;
    });
    return {
      id:track.id,title:track.title,description:track.description,textIds:texts.map((text)=>text.id),
      minutes:texts.reduce((sum,text)=>sum+text.estimatedMinutes,0),readiness,completed,total:texts.length,nextText:ranked[0]??null
    };
  }).filter((track)=>track.total>0);
}
