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

interface TrackDefinition {
  id:string;
  title:string;
  description:string;
  levels:readonly string[];
  tags:readonly string[];
  readinessTarget:number;
}

const TRACKS:TrackDefinition[]=[
  {id:"work-negotiation",title:"Work, decisions & negotiation",description:"Build endurance across workplace change, priorities, compromise and responsible technology use.",levels:["B2"],tags:["workplace","interaction","technology"],readinessTarget:.82},
  {id:"evidence-media",title:"Evidence, media & research",description:"Move between source checking, survey interpretation and balanced evidence-based synthesis.",levels:["B2"],tags:["media","academic-lite","synthesis"],readinessTarget:.82},
  {id:"community-policy",title:"Community, policy & public life",description:"Follow connected arguments about services, education, disaster preparation and social change.",levels:["B2"],tags:["community","public","society"],readinessTarget:.82},
  {id:"environment-everyday",title:"Environment & everyday choices",description:"Practice comparing realistic trade-offs in energy, housing, transport and daily decisions.",levels:["B2"],tags:["environment","everyday"],readinessTarget:.82},
  {id:"c1-evidence-policy",title:"C1 evidence, policy & causal reasoning",description:"Track assumptions, evidential limits, causal claims and qualified recommendations across advanced formal texts.",levels:["C1"],tags:["research","policy","evidence","synthesis"],readinessTarget:.88},
  {id:"c1-institutions",title:"C1 institutions, autonomy & accountability",description:"Compare governance, education, workplace and community decisions through constraints, responsibility and implementation.",levels:["C1"],tags:["governance","education","workplace","community","accountability"],readinessTarget:.88},
  {id:"c1-public-argument",title:"C1 public argument & rhetoric",description:"Separate rhetoric from evidence, identify concessions and preserve nuance across contested public discourse.",levels:["C1"],tags:["media","argument","rhetoric","public"],readinessTarget:.88}
];

export function buildExtensiveTracks(progress:ImmersionProgress):ExtensiveTrack[]{
  const progressById=new Map(progress.texts.map((item)=>[item.id,item] as const));
  return TRACKS.map((track)=>{
    const texts=gradedReadingTexts.filter((text)=>track.levels.includes(text.level)&&text.tags.some((tag)=>track.tags.includes(tag)));
    const projected=texts.map((text)=>progressById.get(text.id)).filter((item):item is ImmersionTextProgress=>Boolean(item));
    const readiness=projected.length?projected.reduce((sum,item)=>sum+item.readiness,0)/projected.length:0;
    const completed=projected.filter((item)=>item.readingEvidence>0&&item.listeningEvidence>0).length;
    const ranked=[...projected].sort((a,b)=>{
      const aDone=Number(a.readingEvidence>0&&a.listeningEvidence>0),bDone=Number(b.readingEvidence>0&&b.listeningEvidence>0);
      return aDone-bDone||Math.abs(track.readinessTarget-a.readiness)-Math.abs(track.readinessTarget-b.readiness)||b.readiness-a.readiness;
    });
    return {
      id:track.id,title:track.title,description:track.description,textIds:texts.map((text)=>text.id),
      minutes:texts.reduce((sum,text)=>sum+text.estimatedMinutes,0),readiness,completed,total:texts.length,nextText:ranked[0]??null
    };
  }).filter((track)=>track.total>0);
}
