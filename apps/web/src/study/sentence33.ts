import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneySentencePuzzle} from "./sentence28";
interface P33Order {id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];variant:readonly number[];note:string;}
export const p33SentenceOrder:readonly P33Order[]=[
  {
    "id": "p33-order-1",
    "unitId": "p23:introduction",
    "context": "Morgen an der Universität lernen",
    "meaning": "Morgen lerne ich an der Universität Japanisch.",
    "tiles": [
      "明日",
      "大学",
      "で",
      "日本語",
      "を",
      "勉強します"
    ],
    "variant": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "note": "Zeitangabe und Ort sind umstellbar. で bezeichnet den Handlungsort."
  },
  {
    "id": "p33-order-2",
    "unitId": "p23:ownership",
    "context": "Das Buch einer Freundin finden",
    "meaning": "Heute finde ich im Klassenzimmer das Buch meiner Freundin.",
    "tiles": [
      "今日",
      "教室",
      "で",
      "友達",
      "の",
      "本",
      "を",
      "見つけます"
    ],
    "variant": [
      1,
      2,
      0,
      3,
      4,
      5,
      6,
      7
    ],
    "note": "の verbindet die Besitzerin mit dem Buch, で den Fundort."
  },
  {
    "id": "p33-order-3",
    "unitId": "p23:places",
    "context": "Auf einen Freund warten",
    "meaning": "Vor dem Bahnhof warte ich auf meinen Freund.",
    "tiles": [
      "駅",
      "の",
      "前",
      "で",
      "友達",
      "を",
      "待ちます"
    ],
    "variant": [
      4,
      5,
      0,
      1,
      2,
      3,
      6
    ],
    "note": "Der Handlungsort mit で kann vor oder nach dem Objekt stehen."
  },
  {
    "id": "p33-order-4",
    "unitId": "p23:routine",
    "context": "Montags in der Bibliothek",
    "meaning": "Jeden Montag lerne ich in der Bibliothek.",
    "tiles": [
      "毎週",
      "月曜日",
      "に",
      "図書館",
      "で",
      "勉強します"
    ],
    "variant": [
      3,
      4,
      0,
      1,
      2,
      5
    ],
    "note": "Der Wochentag mit に und der Tätigkeitsort mit で bleiben durch Partikeln erkennbar."
  },
  {
    "id": "p33-order-5",
    "unitId": "p23:cafe",
    "context": "Tee mit Freunden",
    "meaning": "Im Café trinke ich mit Freunden Tee.",
    "tiles": [
      "友達",
      "と",
      "カフェ",
      "で",
      "お茶",
      "を",
      "飲みます"
    ],
    "variant": [
      2,
      3,
      0,
      1,
      4,
      5,
      6
    ],
    "note": "Die Begleitung と und der Ort で sind im Satz umstellbar."
  },
  {
    "id": "p33-order-6",
    "unitId": "p23:plans",
    "context": "Nächsten Freitag ins Kino",
    "meaning": "Wollen wir nächsten Freitag gemeinsam einen Film sehen?",
    "tiles": [
      "来週",
      "の",
      "金曜日",
      "に",
      "一緒に",
      "映画",
      "を",
      "見ませんか"
    ],
    "variant": [
      4,
      0,
      1,
      2,
      3,
      5,
      6,
      7
    ],
    "note": "Der Ausdruck 一緒に kann vor der Zeit stehen. ませんか bleibt eine Einladung."
  },
  {
    "id": "p33-order-7",
    "unitId": "p25:transport",
    "context": "Mit dem Bus zum Campus",
    "meaning": "Ich fahre mit dem Bus bis zur Universität.",
    "tiles": [
      "バス",
      "で",
      "大学",
      "まで",
      "行きます"
    ],
    "variant": [
      2,
      3,
      0,
      1,
      4
    ],
    "note": "Verkehrsmittel und Endpunkt sind umstellbar, nicht ihre Funktionspartikeln."
  },
  {
    "id": "p33-order-8",
    "unitId": "p25:library",
    "context": "Morgen ein Buch ausleihen",
    "meaning": "Morgen leihe ich in der Bibliothek ein Japanischbuch.",
    "tiles": [
      "明日",
      "図書館",
      "で",
      "日本語",
      "の",
      "本",
      "を",
      "借ります"
    ],
    "variant": [
      1,
      2,
      0,
      3,
      4,
      5,
      6,
      7
    ],
    "note": "の verbindet Sprache und Buch. Zeit und Handlungsort bleiben flexibel."
  },
  {
    "id": "p33-order-9",
    "unitId": "p25:shopping",
    "context": "Heute die blaue Tasche kaufen",
    "meaning": "Heute kaufe ich diese blaue Tasche.",
    "tiles": [
      "今日",
      "この",
      "青い",
      "かばん",
      "を",
      "買います"
    ],
    "variant": [
      1,
      2,
      3,
      4,
      0,
      5
    ],
    "note": "この und 青い bleiben beim Nomen; heute kann nach der Objektphrase stehen."
  },
  {
    "id": "p33-order-10",
    "unitId": "p25:lostfound",
    "context": "Einen Schirm verlieren",
    "meaning": "Gestern habe ich am Bahnhof einen schwarzen Schirm verloren.",
    "tiles": [
      "昨日",
      "駅",
      "で",
      "黒い",
      "傘",
      "を",
      "なくしました"
    ],
    "variant": [
      1,
      2,
      0,
      3,
      4,
      5,
      6
    ],
    "note": "Zeit und Ort lassen sich umstellen, 黒い bleibt unmittelbar beim Nomen."
  },
  {
    "id": "p33-order-11",
    "unitId": "p26:station-to-campus",
    "context": "Vormittags gemeinsam lernen",
    "meaning": "Vormittags lerne ich mit Freunden an der Universität.",
    "tiles": [
      "午前中",
      "に",
      "大学",
      "で",
      "友達",
      "と",
      "勉強します"
    ],
    "variant": [
      2,
      3,
      0,
      1,
      4,
      5,
      6
    ],
    "note": "Zeit に, Lernort で und Begleitung と kennzeichnen die Phrasen."
  },
  {
    "id": "p33-order-12",
    "unitId": "p26:weekend-switch",
    "context": "Sonntag gemeinsam einen Film sehen",
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
    "variant": [
      2,
      3,
      0,
      1,
      4,
      5,
      6
    ],
    "note": "Zeitphrase und Begleitung sind vor dem Verb umstellbar."
  }
];
export const p33SentencePuzzles:JourneySentencePuzzle[]=p33SentenceOrder.map(item=>{
  const answer=item.tiles.join("");
  const alternative=item.variant.map(i=>item.tiles[i]).join("");
  const prompt:StudyPrompt={
    id:item.id,primaryTarget:{kind:"can_do",id:"p33:sentence:"+item.unitId},
    skill:"production",cueFamily:"p33-order-"+item.id,promptType:"typed",
    instruction:"Bilde einen natürlichen Satz; zwei Wortstellungsvarianten sind zugelassen",
    prompt:item.context+" — "+item.meaning,acceptedAnswers:[answer,alternative],
    displayAnswer:answer,explanation:item.note,answerNormalization:"japanese",
    contextId:"p33:unit:"+item.unitId,sourceId:"thiepn-original",contentVersion:"p33-1",
    eventMetadata:{p33:true,kind:"sentence-order-variation",unitId:item.unitId,exerciseId:item.id}
  };
  return {id:item.id,unitId:item.unitId,context:item.context,meaning:item.meaning,
    tiles:item.tiles,answer,explanation:item.note,prompt};
});
export const p33SentencePrompts:StudyPrompt[]=p33SentencePuzzles.map(item=>item.prompt);
