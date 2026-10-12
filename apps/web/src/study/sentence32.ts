import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneySentencePuzzle} from "./sentence28";
interface P32SentenceDesign {id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];alternate:readonly number[];explanation:string;}
export const p32SentenceDesigns:readonly P32SentenceDesign[]=[
  {
    "id": "p32-sentence-1",
    "unitId": "p23:greetings",
    "context": "Im Schulflur",
    "meaning": "Morgens begrüße ich die Lehrkraft.",
    "tiles": [
      "朝",
      "先生",
      "に",
      "あいさつします"
    ],
    "alternate": [
      1,
      2,
      0,
      3
    ],
    "explanation": "Die Zeit 朝 kann an verschiedenen Positionen vor dem Verb stehen."
  },
  {
    "id": "p32-sentence-2",
    "unitId": "p23:places",
    "context": "Heute lernen",
    "meaning": "Heute lerne ich in der Schule.",
    "tiles": [
      "今日",
      "学校",
      "で",
      "勉強します"
    ],
    "alternate": [
      1,
      2,
      0,
      3
    ],
    "explanation": "今日 kann vor oder nach dem Ort stehen; で bleibt beim Tätigkeitsort."
  },
  {
    "id": "p32-sentence-3",
    "unitId": "p23:cafe",
    "context": "Mit Freunden Tee trinken",
    "meaning": "Ich trinke im Café mit Freunden Tee.",
    "tiles": [
      "友達",
      "と",
      "カフェ",
      "で",
      "お茶",
      "を",
      "飲みます"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4,
      5,
      6
    ],
    "explanation": "と markiert Begleitung, で den Ort; die Phrasen können getauscht werden."
  },
  {
    "id": "p32-sentence-4",
    "unitId": "p23:past",
    "context": "Gestern gelernt",
    "meaning": "Gestern lernte ich in der Schule Japanisch.",
    "tiles": [
      "昨日",
      "学校",
      "で",
      "日本語",
      "を",
      "勉強しました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Gestern und Handlungsort sind umstellbar; das Verb behält ました."
  },
  {
    "id": "p32-sentence-5",
    "unitId": "p25:directions",
    "context": "Vom Ort zum Ziel",
    "meaning": "Ich gehe von hier bis zum Bahnhof.",
    "tiles": [
      "ここ",
      "から",
      "駅",
      "まで",
      "歩きます"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4
    ],
    "explanation": "から und まで bleiben bei Ausgangspunkt und Ziel."
  },
  {
    "id": "p32-sentence-6",
    "unitId": "p25:transport",
    "context": "Morgen fahren",
    "meaning": "Ich fahre morgen mit dem Zug zur Universität.",
    "tiles": [
      "明日",
      "電車",
      "で",
      "大学",
      "に",
      "行きます"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "明日 kann nach dem Verkehrsmittel stehen, で und に behalten ihre Rolle."
  },
  {
    "id": "p32-sentence-7",
    "unitId": "p25:library",
    "context": "Eine Ausleihe planen",
    "meaning": "Nächste Woche leihe ich in der Bibliothek ein Buch.",
    "tiles": [
      "来週",
      "図書館",
      "で",
      "本",
      "を",
      "借ります"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Zeit und Handlungsort sind umstellbar."
  },
  {
    "id": "p32-sentence-8",
    "unitId": "p25:lostfound",
    "context": "Verlust unterwegs",
    "meaning": "Ich verlor gestern am Bahnhof die Tasche.",
    "tiles": [
      "昨日",
      "駅",
      "で",
      "かばん",
      "を",
      "なくしました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Zeit und Ort können die Reihenfolge wechseln; die Endung bleibt vergangen."
  },
  {
    "id": "p32-sentence-9",
    "unitId": "p26:station-to-campus",
    "context": "Busverbindung",
    "meaning": "Ich fahre mit dem Bus bis zur Universität.",
    "tiles": [
      "大学",
      "まで",
      "バス",
      "で",
      "行きます"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4
    ],
    "explanation": "Zielphrase und Verkehrsphrase sind bei gleichbleibenden Partikeln flexibel."
  },
  {
    "id": "p32-sentence-10",
    "unitId": "p26:library-project",
    "context": "Lernverabredung",
    "meaning": "Wir lernen am Freitag gemeinsam in der Bibliothek.",
    "tiles": [
      "金曜日",
      "に",
      "図書館",
      "で",
      "一緒に",
      "勉強しましょう"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4,
      5
    ],
    "explanation": "Ort und Zeitpunkt lassen sich vor 一緒に umstellen."
  },
  {
    "id": "p32-sentence-11",
    "unitId": "p26:cafe-conversation",
    "context": "Kaffeepause",
    "meaning": "Später trinke ich im Café Kaffee.",
    "tiles": [
      "あとで",
      "カフェ",
      "で",
      "コーヒー",
      "を",
      "飲みます"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Zeit und Ort sind flexibel; で kennzeichnet den Handlungsort."
  },
  {
    "id": "p32-sentence-12",
    "unitId": "p26:weekend-switch",
    "context": "Freunde am Sonntag",
    "meaning": "Am Sonntag sehe ich mit Freunden einen Film.",
    "tiles": [
      "日曜日",
      "に",
      "友達",
      "と",
      "映画",
      "を",
      "見ます"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4,
      5
    ],
    "explanation": "Zeit und Begleitung können umgestellt werden; ます ist die höfliche Verbform."
  }
];
export const p32SentencePuzzles:JourneySentencePuzzle[]=p32SentenceDesigns.map(d=>{
  const answer=d.tiles.join("");
  const variant=d.alternate.map(i=>d.tiles[i]).join("");
  const prompt:StudyPrompt={
    id:d.id,primaryTarget:{kind:"can_do",id:"p32:sentence:"+d.unitId},
    skill:"production",cueFamily:"p32-natural-variation-"+d.id,promptType:"typed",
    instruction:"Bilde den Satz; zwei natürlich passende Satzteilstellungen sind hinterlegt",
    prompt:d.context+" — "+d.meaning,acceptedAnswers:[answer,variant],
    displayAnswer:answer,explanation:d.explanation,
    contextId:"p32:unit:"+d.unitId,answerNormalization:"japanese",
    sourceId:"thiepn-original",contentVersion:"p32-1",
    eventMetadata:{p32:true,kind:"sentence-order-variation",unitId:d.unitId,exerciseId:d.id}
  };
  return {id:d.id,unitId:d.unitId,context:d.context,meaning:d.meaning,tiles:d.tiles,answer,explanation:d.explanation,prompt};
});
export const p32SentencePrompts:StudyPrompt[]=p32SentencePuzzles.map(p=>p.prompt);
