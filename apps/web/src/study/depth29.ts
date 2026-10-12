import type {StudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {journeySentencePuzzles,puzzleEvidence,type JourneySentencePuzzle} from "./sentence28";
import {normalizeP26} from "./pedagogy26";
import {type JourneyUnitProgress,journeyUnits} from "./journey27";

/** New source-owned additions to the P27/P28 journey. All material is authored, not sourced from textbooks. */
interface SentenceDesign {
  id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];
  explanation:string;variants:readonly (readonly number[])[];
}
export const p29Sentences:readonly SentenceDesign[]=[
  {
    "id": "p29-extra-0",
    "unitId": "p23:greetings",
    "context": "Schultag",
    "meaning": "Wir sehen uns morgen wieder in der Schule.",
    "tiles": [
      "明日",
      "また",
      "学校",
      "で",
      "会いましょう"
    ],
    "explanation": "Ort einer Begegnung mit で; ましょう für gemeinsames Vorhaben.",
    "variants": [
      [
        1,
        0,
        2,
        3,
        4
      ]
    ]
  },
  {
    "id": "p29-extra-1",
    "unitId": "p23:introduction",
    "context": "Beim Tandemtreffen",
    "meaning": "Ich lerne an der Universität Japanisch.",
    "tiles": [
      "私",
      "は",
      "大学",
      "で",
      "日本語",
      "を",
      "勉強します"
    ],
    "explanation": "は für das Thema; で für den Tätigkeitsort und を für das Objekt.",
    "variants": [
      [
        2,
        3,
        0,
        1,
        4,
        5,
        6
      ]
    ]
  },
  {
    "id": "p29-extra-2",
    "unitId": "p23:ownership",
    "context": "Im Klassenraum",
    "meaning": "Dieses Buch gehört meiner Freundin.",
    "tiles": [
      "この",
      "本",
      "は",
      "友達",
      "の",
      "です"
    ],
    "explanation": "この steht unmittelbar vor dem Nomen; の beschreibt den Besitz.",
    "variants": []
  },
  {
    "id": "p29-extra-3",
    "unitId": "p23:places",
    "context": "Eine Bibliothek suchen",
    "meaning": "Neben der Universität gibt es eine Bibliothek.",
    "tiles": [
      "大学",
      "の",
      "隣",
      "に",
      "図書館",
      "が",
      "あります"
    ],
    "explanation": "に markiert den Ort der Existenz; あります für Dinge.",
    "variants": []
  },
  {
    "id": "p29-extra-4",
    "unitId": "p23:routine",
    "context": "Tagesablauf",
    "meaning": "Ich lerne jeden Morgen um sieben Uhr.",
    "tiles": [
      "毎朝",
      "七時",
      "に",
      "勉強",
      "します"
    ],
    "explanation": "に markiert eine konkrete Uhrzeit; das Verb steht am Ende.",
    "variants": [
      [
        1,
        2,
        0,
        3,
        4
      ]
    ]
  },
  {
    "id": "p29-extra-5",
    "unitId": "p23:cafe",
    "context": "Eine Bestellung",
    "meaning": "Entschuldigung, einen Tee bitte.",
    "tiles": [
      "すみません",
      "お茶",
      "を",
      "一つ",
      "お願いします"
    ],
    "explanation": "を markiert das Gewünschte; お願いします ist höflich.",
    "variants": []
  },
  {
    "id": "p29-extra-6",
    "unitId": "p23:plans",
    "context": "Für Sonntag verabreden",
    "meaning": "Wollen wir am Sonntag zusammen einen Film sehen?",
    "tiles": [
      "日曜日",
      "に",
      "一緒に",
      "映画",
      "を",
      "見ませんか"
    ],
    "explanation": "ませんか lädt höflich ein. に markiert den vereinbarten Tag.",
    "variants": [
      [
        2,
        0,
        1,
        3,
        4,
        5
      ]
    ]
  },
  {
    "id": "p29-extra-7",
    "unitId": "p23:past",
    "context": "Über gestern sprechen",
    "meaning": "Gestern bin ich mit einem Freund in den Park gegangen.",
    "tiles": [
      "昨日",
      "友達",
      "と",
      "公園",
      "に",
      "行きました"
    ],
    "explanation": "と verbindet eine Begleitung; に das Ziel; ました Vergangenheit.",
    "variants": [
      [
        1,
        2,
        0,
        3,
        4,
        5
      ]
    ]
  },
  {
    "id": "p29-extra-8",
    "unitId": "p25:directions",
    "context": "In der Stadt",
    "meaning": "Der Bahnhof ist auf der rechten Seite.",
    "tiles": [
      "駅",
      "は",
      "右",
      "に",
      "あります"
    ],
    "explanation": "は markiert den Bahnhof als Thema; に die Lage.",
    "variants": []
  },
  {
    "id": "p29-extra-9",
    "unitId": "p25:transport",
    "context": "Umsteigen",
    "meaning": "Ich fahre morgen um acht Uhr mit dem Zug.",
    "tiles": [
      "明日",
      "八時",
      "に",
      "電車",
      "で",
      "行きます"
    ],
    "explanation": "に für die Uhrzeit und で für das Verkehrsmittel.",
    "variants": [
      [
        3,
        4,
        0,
        1,
        2,
        5
      ]
    ]
  },
  {
    "id": "p29-extra-10",
    "unitId": "p25:library",
    "context": "Ausleihe verlängern",
    "meaning": "Darf ich das Buch nächste Woche zurückgeben?",
    "tiles": [
      "来週",
      "本",
      "を",
      "返しても",
      "いいですか"
    ],
    "explanation": "て-Form + もいいですか ist eine Erlaubnisfrage.",
    "variants": [
      [
        1,
        2,
        0,
        3,
        4
      ]
    ]
  },
  {
    "id": "p29-extra-11",
    "unitId": "p25:shopping",
    "context": "Eine Tasche auswählen",
    "meaning": "Ich möchte die rote Tasche ansehen.",
    "tiles": [
      "赤い",
      "かばん",
      "を",
      "見たい",
      "です"
    ],
    "explanation": "い-Adjektiv vor dem Nomen, を für das Objekt, たいです für einen Wunsch.",
    "variants": []
  },
  {
    "id": "p29-extra-12",
    "unitId": "p25:appointment",
    "context": "Ein Treffen bestätigen",
    "meaning": "Am Freitag um vier Uhr passt es.",
    "tiles": [
      "金曜日",
      "の",
      "四時",
      "なら",
      "大丈夫",
      "です"
    ],
    "explanation": "の verbindet Tag und Uhrzeit; なら macht das Zeitangebot zur Bedingung.",
    "variants": []
  },
  {
    "id": "p29-extra-13",
    "unitId": "p25:lostfound",
    "context": "Fundbüro",
    "meaning": "Ich habe gestern meinen Regenschirm im Zug vergessen.",
    "tiles": [
      "昨日",
      "電車",
      "に",
      "傘",
      "を",
      "忘れました"
    ],
    "explanation": "電車に nennt den Ort, an dem etwas zurückgelassen wurde.",
    "variants": [
      [
        3,
        4,
        0,
        1,
        2,
        5
      ]
    ]
  },
  {
    "id": "p29-extra-14",
    "unitId": "p26:station-to-campus",
    "context": "Vor dem Unterricht",
    "meaning": "Ich lerne in der Universität um neun Uhr Japanisch.",
    "tiles": [
      "九時",
      "に",
      "大学",
      "で",
      "日本語",
      "を",
      "勉強します"
    ],
    "explanation": "Zeit に, Handlungsort で, Lernobjekt を.",
    "variants": [
      [
        2,
        3,
        0,
        1,
        4,
        5,
        6
      ]
    ]
  },
  {
    "id": "p29-extra-15",
    "unitId": "p26:library-project",
    "context": "Zusammen lernen",
    "meaning": "Wollen wir nächste Woche in der Bibliothek zusammen lernen?",
    "tiles": [
      "来週",
      "図書館",
      "で",
      "一緒に",
      "勉強しませんか"
    ],
    "explanation": "で für den Lernort; ませんか als höfliche Einladung.",
    "variants": [
      [
        3,
        0,
        1,
        2,
        4
      ]
    ]
  },
  {
    "id": "p29-extra-16",
    "unitId": "p26:cafe-conversation",
    "context": "Bei der Bezahlung",
    "meaning": "Kann ich mit Bargeld bezahlen?",
    "tiles": [
      "現金",
      "で",
      "払っても",
      "いいですか"
    ],
    "explanation": "で für das Zahlungsmittel, てもいいですか für Erlaubnis.",
    "variants": []
  },
  {
    "id": "p29-extra-17",
    "unitId": "p26:weekend-switch",
    "context": "Wochenende verschieben",
    "meaning": "Am Samstag habe ich etwas vor, also treffen wir uns am Sonntag.",
    "tiles": [
      "土曜日",
      "は",
      "予定",
      "が",
      "あります",
      "から",
      "日曜日",
      "に",
      "会いましょう"
    ],
    "explanation": "から verbindet Begründung und Vorschlag; に den Termintag.",
    "variants": []
  }
];
export const p29SentencePuzzles:JourneySentencePuzzle[]=p29Sentences.map(s=>{
  const answer=s.tiles.join("");
  const acceptedAnswers=[answer,...s.variants.map(order=>order.map(i=>s.tiles[i]).join(""))];
  const prompt:StudyPrompt={
    id:"p29-build-"+s.id,
    primaryTarget:{kind:"can_do",id:"p29:sentence:"+s.unitId},
    skill:"production",cueFamily:"p29-build-"+s.id,
    promptType:"typed",instruction:"Japanischen Satz aus Wortteilen bilden",
    prompt:s.context+" — "+s.meaning,acceptedAnswers,displayAnswer:answer,
    explanation:s.explanation,contextId:"p29:unit:"+s.unitId,
    answerNormalization:"japanese",sourceId:"thiepn-original",contentVersion:"p29-1",
    eventMetadata:{p29:true,kind:"sentence-build",unitId:s.unitId,puzzleId:s.id}
  };
  return {...s,answer,prompt};
});
/** Selected P24/P28 exercises admit separately authored meaningful reorderings.
 * IDs/cue families remain untouched, retaining their established FSRS identity.
 */
const reordered:Record<string,{orders:number[][];note:string}>={
  "routine-a":{orders:[[1,2,0,3,4]],note:"日本語を毎日勉強します ist auch möglich: Das Objekt steht hier vor dem Zeitausdruck."},
  "places-a":{orders:[[2,3,0,1,4]],note:"先生が教室にいます ist ebenfalls natürlich, wenn die Person im Vordergrund steht."},
  "past-a":{orders:[[1,2,0,3]],note:"映画を昨日見ました ist als markierte Informationsstruktur möglich; 昨日 zuerst ist neutraler."},
  "transport-1":{orders:[[2,3,0,1,4]],note:"大学にバスで行きます setzt das Bewegungsziel vor das Verkehrsmittel."},
  "campus-1":{orders:[[2,3,0,1,4]],note:"大学にバスで行きます ist eine alternative natürliche Anordnung."},
  "project-2":{orders:[[2,0,1,3]],note:"一緒に金曜日に勉強しませんか ist möglich, betont aber das gemeinsame Lernen."},
  "library-2":{orders:[[1,2,0,3]],note:"本を来週返します stellt den Gegenstand vor die Zeitangabe."},
  "library-1":{orders:[],note:"Dieses Satzmuster wird in seiner festen höflichen Form verwendet."}
};
export const p29AllSentencePuzzles:JourneySentencePuzzle[]=[...journeySentencePuzzles.map(p=>{
  const extra=reordered[p.id];
  if(!extra||extra.orders.length===0)return p;
  const answers=[p.answer,...extra.orders.map(indices=>indices.map(i=>p.tiles[i]).join(""))];
  return {...p,prompt:{...p.prompt,acceptedAnswers:answers,explanation:p.explanation+" "+extra.note}};
}),...p29SentencePuzzles];
export const p29AdditionalPrompts:StudyPrompt[]=p29SentencePuzzles.map(p=>p.prompt);
export function sentenceVariants(p:JourneySentencePuzzle):{answer:string;note:string}[]{
  const info=reordered[p.id];
  return (p.prompt.acceptedAnswers??[p.answer]).map((answer,i)=>({
    answer,note:i===0?"Geübte Standardreihenfolge":info?.note??"Ebenfalls zugelassene authored Satzstellung"
  }));
}
export function acceptedSentenceOrder(p:JourneySentencePuzzle,answer:string):boolean{
  return (p.prompt.acceptedAnswers??[p.answer]).some(valid=>
    normalizeP26(valid)===normalizeP26(answer));
}
export interface LinkedLexeme{
  id:string;firstUnit:string;secondUnit:string;first:string;firstMeaning:string;
  second:string;secondMeaning:string;example:string;translation:string;
}
export const p29LexicalLinks:readonly LinkedLexeme[]=[
  {
    "id": "station-library",
    "firstUnit": "p26:station-to-campus",
    "secondUnit": "p26:library-project",
    "first": "駅",
    "firstMeaning": "Bahnhof",
    "second": "図書館",
    "secondMeaning": "Bibliothek",
    "example": "駅から図書館まで歩きます。",
    "translation": "Ich gehe vom Bahnhof bis zur Bibliothek."
  },
  {
    "id": "library-shopping",
    "firstUnit": "p25:library",
    "secondUnit": "p25:shopping",
    "first": "借りる",
    "firstMeaning": "ausleihen",
    "second": "買う",
    "secondMeaning": "kaufen",
    "example": "本を借りたいですが、かばんは買いたいです。",
    "translation": "Ich möchte ein Buch ausleihen, aber eine Tasche kaufen."
  },
  {
    "id": "cafe-shopping",
    "firstUnit": "p26:cafe-conversation",
    "secondUnit": "p25:shopping",
    "first": "値段",
    "firstMeaning": "Preis",
    "second": "お会計",
    "secondMeaning": "Rechnung / Bezahlung",
    "example": "値段を聞いてから、お会計をします。",
    "translation": "Ich frage nach dem Preis und bezahle danach."
  },
  {
    "id": "schedule-transport",
    "firstUnit": "p25:appointment",
    "secondUnit": "p25:transport",
    "first": "何時",
    "firstMeaning": "wann, um wie viel Uhr",
    "second": "金曜日",
    "secondMeaning": "Freitag",
    "example": "金曜日の電車は何時に出ますか。",
    "translation": "Wann fährt der Zug am Freitag?"
  },
  {
    "id": "lost-ownership",
    "firstUnit": "p25:lostfound",
    "secondUnit": "p23:ownership",
    "first": "傘",
    "firstMeaning": "Regenschirm",
    "second": "私の",
    "secondMeaning": "meiner/meine",
    "example": "この傘は私のです。",
    "translation": "Dieser Regenschirm gehört mir."
  },
  {
    "id": "campus-routine",
    "firstUnit": "p26:station-to-campus",
    "secondUnit": "p23:routine",
    "first": "大学",
    "firstMeaning": "Universität",
    "second": "毎日",
    "secondMeaning": "jeden Tag",
    "example": "毎日大学で勉強します。",
    "translation": "Ich lerne täglich an der Universität."
  },
  {
    "id": "weekend-invite",
    "firstUnit": "p26:weekend-switch",
    "secondUnit": "p23:plans",
    "first": "予定",
    "firstMeaning": "Plan/Termin",
    "second": "一緒に",
    "secondMeaning": "zusammen",
    "example": "予定がなければ、一緒に行きませんか。",
    "translation": "Wenn du nichts vorhast, wollen wir zusammen gehen?"
  },
  {
    "id": "directions-campus",
    "firstUnit": "p25:directions",
    "secondUnit": "p26:station-to-campus",
    "first": "右",
    "firstMeaning": "rechts",
    "second": "大学",
    "secondMeaning": "Universität",
    "example": "大学に行くには右に曲がってください。",
    "translation": "Um zur Universität zu kommen, bitte rechts abbiegen."
  },
  {
    "id": "greetings-appointment",
    "firstUnit": "p23:greetings",
    "secondUnit": "p25:appointment",
    "first": "こんにちは",
    "firstMeaning": "Guten Tag",
    "second": "都合",
    "secondMeaning": "Verfügbarkeit",
    "example": "こんにちは。金曜日はご都合いかがですか。",
    "translation": "Guten Tag. Passt es Ihnen am Freitag?"
  },
  {
    "id": "book-routine",
    "firstUnit": "p26:library-project",
    "secondUnit": "p23:routine",
    "first": "本",
    "firstMeaning": "Buch",
    "second": "読む",
    "secondMeaning": "lesen",
    "example": "毎朝図書館で本を読みます。",
    "translation": "Ich lese jeden Morgen in der Bibliothek."
  },
  {
    "id": "past-weather",
    "firstUnit": "p23:past",
    "secondUnit": "p26:weekend-switch",
    "first": "昨日",
    "firstMeaning": "gestern",
    "second": "雨",
    "secondMeaning": "Regen",
    "example": "昨日は雨が降りました。",
    "translation": "Gestern hat es geregnet."
  },
  {
    "id": "cafe-price",
    "firstUnit": "p23:cafe",
    "secondUnit": "p25:shopping",
    "first": "お茶",
    "firstMeaning": "Tee",
    "second": "いくら",
    "secondMeaning": "wie viel",
    "example": "このお茶はいくらですか。",
    "translation": "Wie viel kostet dieser Tee?"
  }
];
/** Three different cues for each cross-unit link: meaning + recall of each source word. */
export const p29LexicalPrompts:StudyPrompt[]=p29LexicalLinks.flatMap(link=>{
  const base={
    primaryTarget:{kind:"can_do" as const,id:"p29:linked-lexicon:"+link.id},
    contextId:"p29:lexicon:"+link.id,sourceId:"thiepn-original",contentVersion:"p29-1",
    answerNormalization:"japanese" as const,
    eventMetadata:{p29:true,kind:"linked-lexicon",unitIds:[link.firstUnit,link.secondUnit],linkId:link.id}
  };
  return [
    {...base,id:"p29-link-meaning-"+link.id,skill:"comprehension" as const,
      cueFamily:"p29-meaning-"+link.id,promptType:"choice" as const,
      instruction:"Zwei Themen verbinden: Kontext erschließen",
      prompt:link.example+"\n"+link.translation+"\nWas bedeutet "+link.first+"?",
      choices:[link.firstMeaning,link.secondMeaning,...p29LexicalLinks
        .filter(other=>other.id!==link.id)
        .flatMap(other=>[other.firstMeaning,other.secondMeaning])].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4),
      acceptedAnswers:[link.firstMeaning],displayAnswer:link.firstMeaning,
      explanation:link.first+" = "+link.firstMeaning+" · "+link.second+" = "+link.secondMeaning},
    {...base,id:"p29-link-first-"+link.id,skill:"production" as const,
      cueFamily:"p29-first-"+link.id,promptType:"typed" as const,
      instruction:"Kontextwort aktiv abrufen",prompt:"Situation: "+link.translation+"\nWie lautet «"+link.firstMeaning+"» auf Japanisch?",
      acceptedAnswers:[link.first],displayAnswer:link.first,explanation:link.example},
    {...base,id:"p29-link-second-"+link.id,skill:"production" as const,
      cueFamily:"p29-second-"+link.id,promptType:"typed" as const,
      instruction:"Verknüpftes Wort aktiv abrufen",prompt:"Situation: "+link.translation+"\nWie lautet «"+link.secondMeaning+"» auf Japanisch?",
      acceptedAnswers:[link.second],displayAnswer:link.second,explanation:link.example}
  ];
});
export function lexicalLinksForUnit(unitId:string):LinkedLexeme[]{
  return p29LexicalLinks.filter(link=>link.firstUnit===unitId||link.secondUnit===unitId);
}
export type LearningFocus="review"|"sentence"|"conversation"|"transfer";
export interface JourneyNextAction{
  id:string;unitId:string;focus:LearningFocus;label:string;reason:string;
}
export function recommendP29Actions(
  unitId:string,progress:readonly JourneyUnitProgress[],
  events:readonly StudyEvent[],traces:readonly MemoryTrace[]
):JourneyNextAction[]{
  const current=progress.find(p=>p.id===unitId);
  const due=progress.slice().filter(p=>p.due+p.retry>0)
    .sort((a,b)=>b.due-a.due||b.retry-a.retry);
  const linked=lexicalLinksForUnit(unitId);
  const adjacent=linked.map(link=>link.firstUnit===unitId?link.secondUnit:link.firstUnit)
    .filter((id,index,all)=>all.indexOf(id)===index);
  const candidates:JourneyNextAction[]=[];
  if(current&&(current.due||current.retry))candidates.push({
    id:"review-current",unitId,focus:"review",label:"Fehler und fällige Karten",
    reason:current.due+" fällig, "+current.retry+" zuletzt fehlerhaft (FSRS und StudyEvents)"
  });
  if(due.length&&due[0]!.id!==unitId)candidates.push({
    id:"review-related",unitId:due[0]!.id,focus:"review",label:"Dringende andere Einheit wiederholen",
    reason:due[0]!.due+" fällig; "+due[0]!.retry+" zuletzt fehlerhaft"
  });
  const source=events.filter(e=>e.metadata?.unitId===unitId&&!e.metadata?.schedulerExcluded);
  const latest=source.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  const count=traces.filter(t=>t.id.includes(unitId)).length;
  candidates.push({
    id:"sentence-current",unitId,focus:"sentence",label:"Satzbau ohne Musterhilfe",
    reason:latest?.result==="incorrect"?"Jüngstes gewertetes Ereignis war fehlerhaft":"Eigene Satzproduktion, unabhängig von bloßem Lesen"
  });
  if(adjacent.length){
    const next=adjacent.find(id=>(progress.find(p=>p.id===id)?.attempted??0)===0)??adjacent[0]!;
    candidates.push({id:"linked-transfer",unitId:next,focus:"transfer",label:"Verknüpften Wortschatz übertragen",
      reason:"Gemeinsame Wörter zwischen "+(journeyUnits.find(u=>u.id===unitId)?.title??unitId)+" und "+(journeyUnits.find(u=>u.id===next)?.title??next)});
  }
  if(!current?.due&&!current?.retry)candidates.push({
    id:"conversation",unitId,focus:"conversation",label:"Mehrstufig frei antworten",
    reason:count?"Gesprächsformen in neuen Zusammenhängen weiter üben":"Noch ohne belegte selbstständige Gesprächsantwort"
  });
  return candidates.slice(0,4);
}

/** Preserve historic FSRS card IDs while admitting qualified alternate word orders. */
export const p29SentencePromptOverrides:ReadonlyMap<string,StudyPrompt>=new Map(
  p29AllSentencePuzzles.filter(p=>!p.prompt.id.startsWith("p29-build-"))
    .map(p=>[p.prompt.id,p.prompt])
);
const orderWeight={due:4,retry:3,new:2,seen:1} as const;
export function sentence29Queue(id:string,traces:readonly MemoryTrace[],events:readonly StudyEvent[]):JourneySentencePuzzle[]{
  const map=new Map(traces.map(t=>[t.id,t]));
  return p29AllSentencePuzzles.filter(p=>p.unitId===id).sort((a,b)=>
    orderWeight[puzzleEvidence(b,map,events)]-orderWeight[puzzleEvidence(a,map,events)]
  );
}
export function orderFeedback29(
  p:JourneySentencePuzzle,answer:string,selected:readonly number[]=[]
):string[]{
  if(acceptedSentenceOrder(p,answer)){
    return ["Eine der ausdrücklich hinterlegten korrekten Wortreihenfolgen erkannt.",p.explanation];
  }
  const firstDifference=selected.findIndex((tileIndex,position)=>tileIndex!==position);
  const positionHint=firstDifference>=0&&firstDifference<p.tiles.length
    ?"Erster Unterschied zur Standardanordnung: Position "+(firstDifference+1)+
      " — du hast «"+p.tiles[selected[firstDifference]!]!+
      "» gewählt; im Grundmuster steht «"+p.tiles[firstDifference]!+"»."
    :"Überprüfe den Schwerpunkt und die Reihenfolge von Thema, Ergänzungen und Verb.";
  return [
    "Die Anordnung entspricht keiner der ausdrücklich hinterlegten Varianten. Das ist kein Beweis für einen Grammatikfehler.",
    positionHint,p.explanation,
    "Japanische Wortstellung ist teilweise flexibel. Der Hinweis vergleicht nur ein authored Grundmuster."
  ];
}
