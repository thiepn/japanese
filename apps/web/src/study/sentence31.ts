import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneySentencePuzzle} from "./sentence28";
interface P31OrderDesign{
  id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];
  alternate:readonly number[];explanation:string;
}
export const p31OrderDesigns:readonly P31OrderDesign[]=[
  {
    "id": "p31-order-1",
    "unitId": "p23:greetings",
    "context": "Jemanden morgens begrüßen",
    "meaning": "Am Morgen begrüße ich die Lehrkraft.",
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
    "explanation": "Die Zeitangabe 朝 kann vor oder nach der markierten Person stehen."
  },
  {
    "id": "p31-order-2",
    "unitId": "p23:introduction",
    "context": "Die Universität nennen",
    "meaning": "An der Universität lerne ich Japanisch.",
    "tiles": [
      "大学",
      "で",
      "私",
      "は",
      "日本語",
      "を",
      "勉強します"
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
    "explanation": "Die Thema-Phrase 私は kann vor oder nach dem Handlungsort stehen; ersteres ist neutraler."
  },
  {
    "id": "p31-order-3",
    "unitId": "p23:ownership",
    "context": "Ein gefundenes Buch beschreiben",
    "meaning": "Im Klassenzimmer fand ich ein Buch.",
    "tiles": [
      "教室",
      "で",
      "私",
      "は",
      "本",
      "を",
      "見つけました"
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
    "explanation": "Das Thema 私は kann an erster Stelle stehen; で bleibt beim Fundort."
  },
  {
    "id": "p31-order-4",
    "unitId": "p23:places",
    "context": "Eine Person lokalisieren",
    "meaning": "In der Bibliothek ist eine Lehrkraft.",
    "tiles": [
      "図書館",
      "に",
      "先生",
      "が",
      "います"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4
    ],
    "explanation": "Bei います steht der Existenzort mit に; Person und Ort können umgestellt werden."
  },
  {
    "id": "p31-order-5",
    "unitId": "p23:routine",
    "context": "Über die Lernroutine erzählen",
    "meaning": "Ich lerne täglich zu Hause Japanisch.",
    "tiles": [
      "毎日",
      "家",
      "で",
      "日本語",
      "を",
      "勉強します"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Ort und Häufigkeit sind flexibel; で bleibt Handlungsort und を das Lernobjekt."
  },
  {
    "id": "p31-order-6",
    "unitId": "p23:cafe",
    "context": "Ein Treffen im Café",
    "meaning": "Im Café trinke ich Tee mit Freunden.",
    "tiles": [
      "カフェ",
      "で",
      "友達",
      "と",
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
    "explanation": "Die Begleitperson mit と kann vor oder nach dem Ort stehen."
  },
  {
    "id": "p31-order-7",
    "unitId": "p23:plans",
    "context": "Ein Wochenendvorhaben",
    "meaning": "Am Samstag sehe ich mit Freunden einen Film.",
    "tiles": [
      "土曜日",
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
      5,
      6
    ],
    "explanation": "Zeitangabe und Begleitung lassen sich umstellen, ohne die Partikeln zu ändern."
  },
  {
    "id": "p31-order-8",
    "unitId": "p23:past",
    "context": "Über einen Parkbesuch berichten",
    "meaning": "Gestern machte ich im Park Fotos.",
    "tiles": [
      "昨日",
      "公園",
      "で",
      "写真",
      "を",
      "撮りました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Die Zeitangabe kann nach dem Ort stehen; ました bleibt für abgeschlossene Handlung."
  },
  {
    "id": "p31-order-9",
    "unitId": "p25:directions",
    "context": "Mit dem Bus zum Bahnhof",
    "meaning": "Ich fahre mit dem Bus zum Bahnhof.",
    "tiles": [
      "駅",
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
    "explanation": "Ziel und Verkehrsmittel sind umstellbar; まで und で bleiben an ihrer Phrase."
  },
  {
    "id": "p31-order-10",
    "unitId": "p25:transport",
    "context": "Zum Campus fahren",
    "meaning": "Ich fahre mit der Bahn bis zur Universität.",
    "tiles": [
      "大学",
      "まで",
      "電車",
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
    "explanation": "Bis-Ziel und Verkehrsmittel können ihren Platz tauschen."
  },
  {
    "id": "p31-order-11",
    "unitId": "p25:library",
    "context": "Eine Ausleihe planen",
    "meaning": "Morgen leihe ich in der Bibliothek ein Buch aus.",
    "tiles": [
      "図書館",
      "で",
      "明日",
      "本",
      "を",
      "借ります"
    ],
    "alternate": [
      2,
      0,
      1,
      3,
      4,
      5
    ],
    "explanation": "Morgen kann am Satzanfang oder nach dem Handlungsort stehen."
  },
  {
    "id": "p31-order-12",
    "unitId": "p25:shopping",
    "context": "Einen Kauf vorhaben",
    "meaning": "Morgen kaufe ich diese Tasche.",
    "tiles": [
      "明日",
      "この",
      "かばん",
      "を",
      "買います"
    ],
    "alternate": [
      1,
      2,
      3,
      0,
      4
    ],
    "explanation": "Zeitangabe und Objekt können ihre Reihenfolge ändern; この bleibt direkt vor かばん."
  },
  {
    "id": "p31-order-13",
    "unitId": "p25:appointment",
    "context": "Einen Treffpunkt ausmachen",
    "meaning": "Am Freitag treffen wir uns in der Bibliothek.",
    "tiles": [
      "金曜日",
      "に",
      "図書館",
      "で",
      "会いましょう"
    ],
    "alternate": [
      2,
      3,
      0,
      1,
      4
    ],
    "explanation": "Treffzeit und Treffort können umgestellt werden; に markiert Zeit, で den Treffort."
  },
  {
    "id": "p31-order-14",
    "unitId": "p25:lostfound",
    "context": "Einen Verlust melden",
    "meaning": "Gestern habe ich am Bahnhof einen Schirm verloren.",
    "tiles": [
      "昨日",
      "駅",
      "で",
      "傘",
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
    "explanation": "Zeit und Verlustort lassen sich umstellen, ohne で oder を zu verändern."
  },
  {
    "id": "p31-order-15",
    "unitId": "p26:station-to-campus",
    "context": "Tägliches Lernen",
    "meaning": "An der Universität lerne ich jeden Tag Japanisch.",
    "tiles": [
      "大学",
      "で",
      "毎日",
      "日本語",
      "を",
      "勉強します"
    ],
    "alternate": [
      2,
      0,
      1,
      3,
      4,
      5
    ],
    "explanation": "Die tägliche Häufigkeit kann vor dem Handlungsort stehen."
  },
  {
    "id": "p31-order-16",
    "unitId": "p26:library-project",
    "context": "Gemeinsames Lernen",
    "meaning": "Am Freitag lerne ich mit Freunden in der Bibliothek.",
    "tiles": [
      "金曜日",
      "に",
      "友達",
      "と",
      "図書館",
      "で",
      "勉強します"
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
    "explanation": "Tag und Begleitung können umgestellt werden, ohne die Funktionspartikeln zu ändern."
  },
  {
    "id": "p31-order-17",
    "unitId": "p26:cafe-conversation",
    "context": "Spätere Kaffeepause",
    "meaning": "Am Nachmittag trinke ich im Café Kaffee.",
    "tiles": [
      "午後",
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
    "explanation": "Zeit und Ort sind flexibel, で bleibt beim Café."
  },
  {
    "id": "p31-order-18",
    "unitId": "p26:weekend-switch",
    "context": "Neues Filmvorhaben",
    "meaning": "Sonntag schaue ich mit Freunden einen Film.",
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
    "explanation": "Zeit und Begleitung sind frei umstellbar, ihre Partikeln bleiben erhalten."
  }
];
export const p31SentencePuzzles:JourneySentencePuzzle[]=p31OrderDesigns.map(d=>{
  const answer=d.tiles.join("");
  const variant=d.alternate.map(index=>d.tiles[index]).join("");
  const prompt:StudyPrompt={
    id:d.id,primaryTarget:{kind:"can_do",id:"p31:sentence:"+d.unitId},
    skill:"production",cueFamily:"p31-word-order-"+d.id,promptType:"typed",
    instruction:"Setze japanische Satzteile zusammen; zwei authored Satzstellungen sind möglich",
    prompt:d.context+" — "+d.meaning,
    acceptedAnswers:[answer,variant],displayAnswer:answer,explanation:d.explanation,
    contextId:"p31:unit:"+d.unitId,answerNormalization:"japanese",
    sourceId:"thiepn-original",contentVersion:"p31-1",
    eventMetadata:{p31:true,kind:"sentence-order-variation",unitId:d.unitId,exerciseId:d.id}
  };
  return {id:d.id,unitId:d.unitId,context:d.context,meaning:d.meaning,
    tiles:d.tiles,answer,explanation:d.explanation,prompt};
});
export const p31SentencePrompts:StudyPrompt[]=p31SentencePuzzles.map(p=>p.prompt);
