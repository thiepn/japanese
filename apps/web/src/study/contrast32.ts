import type {StudyPrompt} from "@thiepn/study-player";
export interface P32Contrast {id:string;unitId:string;context:string;first:string;second:string;explanation:string;focus:"register"|"topic"|"particle"|"function"|"time"|"reference";}
export const p32Contrasts:readonly P32Contrast[]=[
  {
    "id": "p32-contrast-1",
    "unitId": "p23:greetings",
    "context": "Lehrkraft gegenüber Freund",
    "first": "おはようございます。",
    "second": "おはよう。",
    "explanation": "Die erste Grußform ist im Erstkontakt höflicher; die zweite ist unter Freunden natürlich.",
    "focus": "register"
  },
  {
    "id": "p32-contrast-2",
    "unitId": "p23:introduction",
    "context": "Einführung im Kurs",
    "first": "私は学生です。",
    "second": "学生です。",
    "explanation": "私 は kann bei klarem Gesprächsthema entfallen; beide Sätze eignen sich zur höflichen Vorstellung.",
    "focus": "topic"
  },
  {
    "id": "p32-contrast-3",
    "unitId": "p23:ownership",
    "context": "Besitz erklären",
    "first": "この本は私のです。",
    "second": "これは私の本です。",
    "explanation": "Die erste Form nimmt das Buch als Thema; die zweite identifiziert den Gegenstand.",
    "focus": "topic"
  },
  {
    "id": "p32-contrast-4",
    "unitId": "p23:places",
    "context": "Weg oder Handlung erklären",
    "first": "図書館に行きます。",
    "second": "図書館で勉強します。",
    "explanation": "に markiert beim Gehen das Ziel; で den Ort des Lernens.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-5",
    "unitId": "p23:routine",
    "context": "Zeit oder Tätigkeitsort nennen",
    "first": "朝に勉強します。",
    "second": "家で勉強します。",
    "explanation": "朝に nennt die Zeit; 家で nennt den Tätigkeitsort. Auch 毎朝 ohne に ist üblich.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-6",
    "unitId": "p23:cafe",
    "context": "Bestellen oder bezahlen",
    "first": "コーヒーをください。",
    "second": "現金で払います。",
    "explanation": "を markiert die Bestellung, で das Zahlungsmittel.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-7",
    "unitId": "p23:plans",
    "context": "Einladung oder Vorschlag",
    "first": "日曜日に行きませんか。",
    "second": "日曜日に行きましょう。",
    "explanation": "ませんか ist eine höfliche Einladung; ましょう macht einen gemeinsamen Vorschlag.",
    "focus": "function"
  },
  {
    "id": "p32-contrast-8",
    "unitId": "p23:past",
    "context": "Gestern oder morgen berichten",
    "first": "昨日、勉強しました。",
    "second": "明日、勉強します。",
    "explanation": "Vergangene abgeschlossene Handlung ました und kommende Handlung ます sind kontextabhängig.",
    "focus": "time"
  },
  {
    "id": "p32-contrast-9",
    "unitId": "p25:directions",
    "context": "Existenz oder Warten am Bahnhof",
    "first": "駅に人がいます。",
    "second": "駅で人を待っています。",
    "explanation": "に für den Existenzort, で für den Ort der laufenden Handlung.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-10",
    "unitId": "p25:transport",
    "context": "Verkehrsmittel oder Wegspanne",
    "first": "バスで駅に行きます。",
    "second": "駅から大学まで歩きます。",
    "explanation": "で markiert das Verkehrsmittel; から und まで Beginn und Ende eines Wegs.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-11",
    "unitId": "p25:library",
    "context": "Wunsch oder Erlaubnis",
    "first": "この本を借りたいです。",
    "second": "この本を借りてもいいですか。",
    "explanation": "たい beschreibt einen Wunsch; てもいいですか fragt nach Erlaubnis.",
    "focus": "function"
  },
  {
    "id": "p32-contrast-12",
    "unitId": "p25:shopping",
    "context": "Tasche in Nähe oder Ferne",
    "first": "このかばんはいくらですか。",
    "second": "あのかばんはいくらですか。",
    "explanation": "この steht bei etwas nah am Sprecher, あの bei etwas entfernt von beiden.",
    "focus": "reference"
  },
  {
    "id": "p32-contrast-13",
    "unitId": "p25:appointment",
    "context": "Vorschlag oder Zusage",
    "first": "金曜日はどうですか。",
    "second": "金曜日なら大丈夫です。",
    "explanation": "どうですか bietet die Option an, なら signalisiert eine bedingte Zustimmung.",
    "focus": "function"
  },
  {
    "id": "p32-contrast-14",
    "unitId": "p25:lostfound",
    "context": "Finden oder Vorhandensein",
    "first": "駅で傘を見つけました。",
    "second": "駅に傘がありました。",
    "explanation": "で bezeichnet die Fundhandlung; に das Vorhandensein.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-15",
    "unitId": "p26:station-to-campus",
    "context": "Abfahrtszeit oder Transportmittel",
    "first": "バスは九時に出ます。",
    "second": "バスで大学に行きます。",
    "explanation": "に bezeichnet hier einmal eine Zeit und einmal ein Ziel; で das Transportmittel.",
    "focus": "particle"
  },
  {
    "id": "p32-contrast-16",
    "unitId": "p26:library-project",
    "context": "Einladen oder Erlaubnis bitten",
    "first": "一緒に勉強しませんか。",
    "second": "ここで勉強してもいいですか。",
    "explanation": "ませんか lädt ein; てもいいですか verlangt eine Erlaubnis.",
    "focus": "function"
  },
  {
    "id": "p32-contrast-17",
    "unitId": "p26:cafe-conversation",
    "context": "Menge korrigieren",
    "first": "ケーキは一つだけです。",
    "second": "すみません、ケーキは一つだけです。",
    "explanation": "Beide begrenzen auf ein Stück; すみません ist gegenüber Personal höflicher.",
    "focus": "register"
  },
  {
    "id": "p32-contrast-18",
    "unitId": "p26:weekend-switch",
    "context": "Absage und Gegenangebot",
    "first": "土曜日は予定があります。",
    "second": "日曜日はどうですか。",
    "explanation": "Der erste Satz begründet die Absage, der zweite schlägt eine Alternative vor.",
    "focus": "function"
  }
];
export const p32ContrastPrompts:StudyPrompt[]=p32Contrasts.map(c=>({
  id:c.id,primaryTarget:{kind:"can_do",id:"p32:contrast:"+c.unitId},
  skill:"form_selection",cueFamily:"p32-role-"+c.id,promptType:"choice",
  instruction:"Welche der beiden Aussagen drückt die erste genannte Funktion aus?",
  prompt:c.context+" — Form und Funktion unterscheiden",
  choices:[c.first,c.second],acceptedAnswers:[c.first],displayAnswer:c.first,
  explanation:c.explanation,answerNormalization:"japanese",
  contextId:"p32:unit:"+c.unitId,sourceId:"thiepn-original",contentVersion:"p32-1",
  eventMetadata:{p32:true,kind:"contextual-contrast",unitId:c.unitId,contrastId:c.id}
}));
export function p32ContrastForUnit(unitId:string):P32Contrast|undefined {
 return p32Contrasts.find(c=>c.unitId===unitId);
}
