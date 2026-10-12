import type {StudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {sentencePuzzles,sentencePuzzlePrompt} from "./pedagogy24";
import {journeyUnit,traceIdJourney} from "./journey27";

export interface JourneySentencePuzzle {
  id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];
  answer:string;explanation:string;prompt:StudyPrompt;
}
interface Blueprint {
  unitId:string;id:string;context:string;meaning:string;tiles:string[];explanation:string;
}
/** New authored sentence-order tasks for each P25 and P26 unit. */
const authored:readonly Blueprint[]=[
  {unitId:"p25:directions",id:"directions-1",context:"Vor dem Bahnhof nach dem Ziel fragen",meaning:"Entschuldigung, wo ist der Bahnhof?",tiles:["すみません","駅","は","どこ","ですか"],explanation:"Die höfliche Anrede steht vor der Ortsfrage; は markiert das Thema."},
  {unitId:"p25:directions",id:"directions-2",context:"Eine einfache Weganweisung geben",meaning:"Gehen Sie geradeaus, bitte.",tiles:["まっすぐ","行って","ください"],explanation:"Verb in て-Form + ください formuliert eine höfliche Aufforderung."},
  {unitId:"p25:transport",id:"transport-1",context:"Mit dem Bus zur Uni",meaning:"Ich fahre mit dem Bus zur Universität.",tiles:["バス","で","大学","に","行きます"],explanation:"で für Verkehrsmittel, に für das Ziel."},
  {unitId:"p25:transport",id:"transport-2",context:"Nach der Abfahrtszeit fragen",meaning:"Um wie viel Uhr fährt der Zug ab?",tiles:["電車","は","何時","に","出ますか"],explanation:"は markiert das Thema, 何時に die gesuchte Uhrzeit."},
  {unitId:"p25:library",id:"library-1",context:"Im Lesesaal höflich fragen",meaning:"Darf ich dieses Buch ausleihen?",tiles:["この","本","を","借りても","いいですか"],explanation:"Verb て-Form + もいいですか fragt nach Erlaubnis."},
  {unitId:"p25:library",id:"library-2",context:"Rückgabetermin erklären",meaning:"Ich gebe das Buch nächste Woche zurück.",tiles:["来週","本","を","返します"],explanation:"を markiert den zurückgegebenen Gegenstand."},
  {unitId:"p25:shopping",id:"shopping-1",context:"Im Geschäft eine andere Farbe suchen",meaning:"Gibt es ein rotes Exemplar?",tiles:["赤い","の","は","ありますか"],explanation:"Das substantivierende の verweist auf einen Gegenstand im Kontext."},
  {unitId:"p25:shopping",id:"shopping-2",context:"Preis einer Tasche erfragen",meaning:"Wie viel kostet diese Tasche?",tiles:["この","かばん","は","いくら","ですか"],explanation:"この steht vor dem Nomen, いくら fragt nach dem Preis."},
  {unitId:"p25:appointment",id:"appointment-1",context:"Einen Termin vorschlagen",meaning:"Wie wäre es mit Freitag?",tiles:["金曜日","は","どう","ですか"],explanation:"はどうですか macht einen höflichen Vorschlag."},
  {unitId:"p25:appointment",id:"appointment-2",context:"Alternative Uhrzeit anbieten",meaning:"Um vier Uhr wäre es für mich in Ordnung.",tiles:["四時","なら","大丈夫","です"],explanation:"なら grenzt die Aussage auf die angebotene Uhrzeit ein."},
  {unitId:"p25:lostfound",id:"lostfound-1",context:"Dem Fundbüro den Verlust schildern",meaning:"Ich habe einen schwarzen Regenschirm verloren.",tiles:["黒い","傘","を","なくしました"],explanation:"Das い-Adjektiv steht vor dem Nomen; ました markiert höfliche Vergangenheit."},
  {unitId:"p25:lostfound",id:"lostfound-2",context:"Beschreiben, was du gerade suchst",meaning:"Ich suche einen Regenschirm.",tiles:["傘","を","探して","います"],explanation:"〜ています beschreibt hier eine gerade andauernde Tätigkeit."},
  {unitId:"p26:station-to-campus",id:"campus-1",context:"Weg und Verkehrsmittel kombinieren",meaning:"Ich fahre mit dem Bus zur Universität.",tiles:["バス","で","大学","に","行きます"],explanation:"Verkehrsmittel で, Ziel に — derselbe Inhalt als neuer Kontextabruf."},
  {unitId:"p26:station-to-campus",id:"campus-2",context:"Zur Abfahrtzeit der Linie nachfragen",meaning:"Fährt der Bus um neun Uhr ab?",tiles:["バス","は","九時","に","出ますか"],explanation:"Die Abfahrtzeit folgt に; ein Satz mit か ist eine Frage."},
  {unitId:"p26:library-project",id:"project-1",context:"Buchausleihe höflich erbitten",meaning:"Darf ich dieses Buch ausleihen?",tiles:["この","本","を","借りても","いいですか"],explanation:"〜てもいいですか ist eine Erlaubnisfrage."},
  {unitId:"p26:library-project",id:"project-2",context:"Gemeinsames Lernen anregen",meaning:"Wollen wir am Freitag zusammen lernen?",tiles:["金曜日","に","一緒に","勉強しませんか"],explanation:"Konkreter Tag に; 〜ませんか als höfliche Einladung."},
  {unitId:"p26:cafe-conversation",id:"cafe-1",context:"Eine Bestellung präzisieren",meaning:"Einen Kaffee bitte.",tiles:["コーヒー","を","一つ","ください"],explanation:"をください markiert das Gewünschte; 一つ die Stückzahl."},
  {unitId:"p26:cafe-conversation",id:"cafe-2",context:"Eine Menge berichtigen",meaning:"Entschuldigung, nur einen Kuchen.",tiles:["すみません","ケーキ","は","一つ","だけ","です"],explanation:"だけ schränkt die Anzahl ein; die Höflichkeitsform bleibt erhalten."},
  {unitId:"p26:weekend-switch",id:"weekend-1",context:"Einen Grund für die Absage nennen",meaning:"Ich habe einen Termin, deshalb kann ich nicht gehen.",tiles:["予定","が","ある","から","行けません"],explanation:"から verbindet den Grund mit der Folge."},
  {unitId:"p26:weekend-switch",id:"weekend-2",context:"Eine andere Verabredung vorschlagen",meaning:"Wie wäre es mit Sonntag?",tiles:["日曜日","は","どう","ですか"],explanation:"はどうですか schlägt ein Thema oder einen Termin vor."}
];
function newPuzzle(spec:Blueprint):JourneySentencePuzzle{
  const answer=spec.tiles.join("");
  const prompt:StudyPrompt={
    id:"p28-build-"+spec.id,primaryTarget:{kind:"can_do",id:"p28:sentence:"+spec.unitId},
    skill:"production",cueFamily:"p28-sentence-"+spec.id,promptType:"typed",
    instruction:"Japanische Satzteile in die Zielreihenfolge setzen",
    prompt:spec.context+" — "+spec.meaning,
    acceptedAnswers:[answer],displayAnswer:answer,explanation:spec.explanation,
    contextId:"p28:unit:"+spec.unitId,answerNormalization:"japanese",
    sourceId:"thiepn-original",contentVersion:"p28-1",
    eventMetadata:{p28:true,kind:"sentence-order",unitId:spec.unitId,puzzleId:spec.id}
  };
  return {...spec,answer,prompt};
}
const reused:JourneySentencePuzzle[]=sentencePuzzles.map(p=>({
  id:p.id,unitId:"p23:"+p.scenarioId,context:p.situation,meaning:p.meaning,
  tiles:p.tokens,answer:p.answer,explanation:p.explanation,prompt:sentencePuzzlePrompt(p)
}));
export const journeySentencePuzzles:readonly JourneySentencePuzzle[]=[...reused,...authored.map(newPuzzle)];
export const p28NewSentencePrompts:StudyPrompt[]=journeySentencePuzzles
  .filter(p=>p.prompt.id.startsWith("p28-build-"))
  .map(p=>p.prompt);
export function sentencePuzzlesForUnit(id:string):JourneySentencePuzzle[]{
  journeyUnit(id);
  return journeySentencePuzzles.filter(p=>p.unitId===id);
}
export type PuzzleEvidence="due"|"retry"|"new"|"seen";
export function puzzleEvidence(p:JourneySentencePuzzle,traces:ReadonlyMap<string,MemoryTrace>,events:readonly StudyEvent[],now=Date.now()):PuzzleEvidence{
  const trace=traces.get(traceIdJourney(p.prompt));
  if(trace&&Date.parse(trace.card.due)<=now)return "due";
  const last=events.filter(e=>e.metadata?.promptId===p.prompt.id&&(e.result==="incorrect"||e.result==="correct"))
    .sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  if(last?.result==="incorrect")return "retry";
  return trace?"seen":"new";
}
const priority:Record<PuzzleEvidence,number>={due:4,retry:3,new:2,seen:1};
export function sentenceQueue(id:string,traces:readonly MemoryTrace[],events:readonly StudyEvent[]):JourneySentencePuzzle[]{
  const map=new Map(traces.map(t=>[t.id,t]));
  return sentencePuzzlesForUnit(id).slice()
    .sort((a,b)=>priority[puzzleEvidence(b,map,events)]-priority[puzzleEvidence(a,map,events)]);
}
/** UI tile order deterministic across re-renders, but varied between sentences. */
export function shuffledTiles(puzzle:JourneySentencePuzzle):number[]{
  const indices=puzzle.tiles.map((_,i)=>i);
  let n=[...puzzle.id].reduce((h,c)=>(Math.imul(h,33)+c.charCodeAt(0))>>>0,2166136261);
  for(let i=indices.length-1;i>0;i--){
    n=(Math.imul(n,1664525)+1013904223)>>>0;
    const j=n%(i+1);
    [indices[i],indices[j]]=[indices[j]!,indices[i]!];
  }
  if(indices.length>1&&indices.every((v,i)=>v===i))indices.reverse();
  return indices;
}
export function builtAnswer(puzzle:JourneySentencePuzzle,selection:readonly number[]):string{
  return selection.map(i=>puzzle.tiles[i]??"").join("");
}
export function wordOrderFeedback(puzzle:JourneySentencePuzzle,selection:readonly number[]):string[]{
  const errors=selection.flatMap((index,pos)=>index===pos?[]:[pos+1]);
  if(!errors.length)return ["Die Zieltile-Reihenfolge stimmt mit dem Muster überein."];
  return [
    "An den Positionen "+errors.slice(0,4).join(", ")+" weicht der Satz von der geübten Zielreihenfolge ab.",
    puzzle.explanation,
    "Andere Umstellungen können im Japanischen möglich sein; hier wird ausschließlich die vorgegebene Zielanordnung überprüft."
  ];
}
