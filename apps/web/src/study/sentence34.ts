import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneySentencePuzzle} from "./sentence28";
/** New independent Japanese contextual phrase-order exercises with two authored arrangements. */
interface P34SentenceDesign{
  id:string;unitId:string;context:string;meaning:string;tiles:readonly string[];
  alternate:readonly number[];explanation:string;
}
export const p34SentenceDesigns:readonly P34SentenceDesign[]=[
  {
    "id": "p34-order-1",
    "unitId": "p23:greetings",
    "context": "Eine Lehrkraft treffen",
    "meaning": "Gestern habe ich in der Schule die Lehrkraft getroffen.",
    "tiles": [
      "昨日",
      "学校",
      "で",
      "先生",
      "に",
      "会いました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Zeit und Begegnungsort sind umstellbar; に bleibt bei der Person, der man begegnet."
  },
  {
    "id": "p34-order-2",
    "unitId": "p23:introduction",
    "context": "Einen Studienfreund treffen",
    "meaning": "Nächste Woche treffe ich an der Universität einen Freund.",
    "tiles": [
      "来週",
      "大学",
      "で",
      "友達",
      "と",
      "会います"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Die Wochenangabe kann hinter dem Ort stehen; と begleitet die gemeinsame Begegnung."
  },
  {
    "id": "p34-order-3",
    "unitId": "p23:ownership",
    "context": "Ein Buch leihen",
    "meaning": "Heute habe ich von der Lehrkraft ein Buch ausgeliehen.",
    "tiles": [
      "今日",
      "先生",
      "から",
      "本",
      "を",
      "借りました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "から markiert die Quelle der Ausleihe, を das entgegengenommene Buch."
  },
  {
    "id": "p34-order-4",
    "unitId": "p23:places",
    "context": "Vor dem Bahnhof warten",
    "meaning": "Ich warte vor dem Bahnhof auf einen Freund.",
    "tiles": [
      "駅",
      "の",
      "前",
      "で",
      "友達",
      "を",
      "待ちます"
    ],
    "alternate": [
      4,
      5,
      0,
      1,
      2,
      3,
      6
    ],
    "explanation": "Das Objekt kann vor der Ortsphrase stehen; で kennzeichnet den Warteort."
  },
  {
    "id": "p34-order-5",
    "unitId": "p23:routine",
    "context": "Wochenroutine",
    "meaning": "Jeden Montag lerne ich an der Universität.",
    "tiles": [
      "毎週",
      "月曜日",
      "に",
      "大学",
      "で",
      "勉強します"
    ],
    "alternate": [
      3,
      4,
      0,
      1,
      2,
      5
    ],
    "explanation": "Zeit und Lernort können ihren Platz tauschen, die Partikeln bleiben erhalten."
  },
  {
    "id": "p34-order-6",
    "unitId": "p23:cafe",
    "context": "Im Café mit einem Freund sprechen",
    "meaning": "Heute spreche ich im Café mit einem Freund.",
    "tiles": [
      "今日",
      "カフェ",
      "で",
      "友達",
      "と",
      "話します"
    ],
    "alternate": [
      3,
      4,
      0,
      1,
      2,
      5
    ],
    "explanation": "Die Gesprächspartnerphrase mit と kann vor der Zeit- und Ortsangabe stehen."
  },
  {
    "id": "p34-order-7",
    "unitId": "p23:plans",
    "context": "Gemeinsam ins Kino",
    "meaning": "Wollen wir nächsten Samstag zusammen einen Film ansehen?",
    "tiles": [
      "来週",
      "の",
      "土曜日",
      "に",
      "一緒に",
      "映画",
      "を",
      "見ませんか"
    ],
    "alternate": [
      4,
      0,
      1,
      2,
      3,
      5,
      6,
      7
    ],
    "explanation": "一緒に steht in beiden Varianten vor dem Verb; ませんか bleibt die Einladung."
  },
  {
    "id": "p34-order-8",
    "unitId": "p23:past",
    "context": "Vom Kino berichten",
    "meaning": "Gestern habe ich mit einem Freund einen Film gesehen.",
    "tiles": [
      "昨日",
      "友達",
      "と",
      "映画",
      "を",
      "見ました"
    ],
    "alternate": [
      1,
      2,
      0,
      3,
      4,
      5
    ],
    "explanation": "Zeit und Begleitung können ihren Platz tauschen; ました markiert abgeschlossene Vergangenheit."
  },
  {
    "id": "p34-order-9",
    "unitId": "p25:directions",
    "context": "Eine Strecke zu Fuß",
    "meaning": "Ich gehe von hier bis zum Bahnhof zu Fuß.",
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
    "explanation": "Die Zielphrase kann vor dem Ausgangspunkt stehen; die neutrale Reihenfolge beginnt hier."
  },
  {
    "id": "p34-order-10",
    "unitId": "p25:shopping",
    "context": "Einen Kauf vorhaben",
    "meaning": "Heute möchte ich diese Tasche kaufen.",
    "tiles": [
      "今日",
      "この",
      "かばん",
      "を",
      "買いたい",
      "です"
    ],
    "alternate": [
      1,
      2,
      3,
      0,
      4,
      5
    ],
    "explanation": "この bleibt unmittelbar beim Nomen; die Zeit kann auf das Objekt folgen."
  },
  {
    "id": "p34-order-11",
    "unitId": "p25:appointment",
    "context": "Treffen in der Bibliothek",
    "meaning": "Treffen wir uns Freitag in der Bibliothek.",
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
    "explanation": "Treffort und Treffzeit sind umstellbar. Das Verb bleibt die höfliche gemeinsame Einladung."
  },
  {
    "id": "p34-order-12",
    "unitId": "p26:weekend-switch",
    "context": "Lernen am Sonntag",
    "meaning": "Am Sonntag lerne ich mit Freunden im Café.",
    "tiles": [
      "日曜日",
      "に",
      "友達",
      "と",
      "カフェ",
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
    "explanation": "Zeit und Begleitung können umgestellt werden; で bleibt beim Lernort."
  }
];
export const p34SentencePuzzles:JourneySentencePuzzle[]=p34SentenceDesigns.map(d=>{
 const answer=d.tiles.join("");
 const variant=d.alternate.map(index=>d.tiles[index]).join("");
 const prompt:StudyPrompt={
   id:d.id,primaryTarget:{kind:"can_do",id:"p34:sentence:"+d.unitId},
   skill:"production",cueFamily:"p34-sentence-"+d.id,
   promptType:"typed",instruction:"Japanischen Satz zusammensetzen; zwei natürliche Reihenfolgen sind hinterlegt",
   prompt:d.context+" — "+d.meaning,acceptedAnswers:[answer,variant],
   displayAnswer:answer,explanation:d.explanation,
   answerNormalization:"japanese",contextId:"p34:unit:"+d.unitId,
   sourceId:"thiepn-original",contentVersion:"p34-1",
   eventMetadata:{p34:true,kind:"sentence-order-variation",unitId:d.unitId,exerciseId:d.id}
 };
 return {id:d.id,unitId:d.unitId,context:d.context,meaning:d.meaning,
   tiles:d.tiles,answer,explanation:d.explanation,prompt};
});
export const p34SentencePrompts:StudyPrompt[]=p34SentencePuzzles.map(p=>p.prompt);
