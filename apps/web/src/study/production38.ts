import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
export interface P38ProductionTransfer{
 id:string;unitIds:readonly string[];title:string;task:string;
 model:string;alternative:string;explanation:string;
 focus:"topic"|"particle"|"time"|"register"|"function";
}
/** Original contextual production tasks; each has two authored expressions.
 * Neither answer list nor its explanations are used to semantically judge
 * arbitrary Japanese alternatives. Only existing StudyPlayer grades targets. */
export const p38ProductionTransfers:readonly P38ProductionTransfer[]=[
  {
    "id": "p38-rewrite-01",
    "unitIds": [
      "p23:introduction",
      "p23:greetings"
    ],
    "title": "Selbstvorstellung im Sprachkurs",
    "task": "Du lernst zum ersten Mal mit einer Lehrkraft. Stelle dich höflich als Student vor.",
    "model": "私は学生です。",
    "alternative": "学生です。",
    "explanation": "私は kann entfallen, wenn aus dem Kontext klar ist, dass du dich selbst vorstellst.",
    "focus": "topic"
  },
  {
    "id": "p38-rewrite-02",
    "unitIds": [
      "p23:ownership",
      "p25:lostfound"
    ],
    "title": "Besitzer eines Schirms",
    "task": "Du erklärst im Fundbüro höflich, dass dieser Schirm dir gehört.",
    "model": "この傘は私のです。",
    "alternative": "これは私の傘です。",
    "explanation": "Die erste Form thematisiert diesen Schirm, die zweite identifiziert den Gegenstand.",
    "focus": "topic"
  },
  {
    "id": "p38-rewrite-03",
    "unitIds": [
      "p23:places",
      "p25:library"
    ],
    "title": "Im Raum lernen",
    "task": "Du sollst sagen, dass du in der Bibliothek Japanisch lernst.",
    "model": "図書館で日本語を勉強します。",
    "alternative": "日本語を図書館で勉強します。",
    "explanation": "で bleibt beim Handlungsort, を beim Lernobjekt; die Phrase ist beweglich.",
    "focus": "particle"
  },
  {
    "id": "p38-rewrite-04",
    "unitIds": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "Zur Universität fahren",
    "task": "Du sagst, dass du mit dem Zug zur Universität fährst.",
    "model": "電車で大学に行きます。",
    "alternative": "大学へ電車で行きます。",
    "explanation": "で benennt das Verkehrsmittel; に und へ sind hier mögliche Ziel-/Richtungsmarkierungen.",
    "focus": "particle"
  },
  {
    "id": "p38-rewrite-05",
    "unitIds": [
      "p25:directions",
      "p26:station-to-campus"
    ],
    "title": "Zu Fuß vom Bahnhof",
    "task": "Du gehst vom Bahnhof aus zu Fuß zur Universität.",
    "model": "駅から大学まで歩きます。",
    "alternative": "駅から大学まで歩いて行きます。",
    "explanation": "から markiert den Ausgangspunkt und まで den Endpunkt. Die zweite Form betont das Hingehen.",
    "focus": "particle"
  },
  {
    "id": "p38-rewrite-06",
    "unitIds": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "Einen Kaffee bestellen",
    "task": "Du bist Kunde in einem Café und bestellst einen Kaffee höflich.",
    "model": "コーヒーを一つお願いします。",
    "alternative": "コーヒーを一つください。",
    "explanation": "Beide bitten um einen Kaffee. お願いします klingt im Servicekontext oft etwas indirekter.",
    "focus": "register"
  },
  {
    "id": "p38-rewrite-07",
    "unitIds": [
      "p25:shopping",
      "p26:cafe-conversation"
    ],
    "title": "Höfliche Preisfrage",
    "task": "Du möchtest im Geschäft den Preis der Tasche in deiner Nähe erfahren.",
    "model": "このかばんはいくらですか。",
    "alternative": "すみません、このかばんはいくらですか。",
    "explanation": "すみません kann die Aufmerksamkeit des Personals höflich gewinnen.",
    "focus": "register"
  },
  {
    "id": "p38-rewrite-08",
    "unitIds": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "Erlaubnis für ein Buch",
    "task": "Du fragst das Bibliothekspersonal ausdrücklich, ob du dieses Buch ausleihen darfst.",
    "model": "この本を借りてもいいですか。",
    "alternative": "すみません、この本を借りてもいいですか。",
    "explanation": "Beide sind Erlaubnisfragen; すみません leitet die Bitte höflich ein.",
    "focus": "function"
  },
  {
    "id": "p38-rewrite-09",
    "unitIds": [
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "title": "Termin ändern",
    "task": "Du möchtest nächsten Freitag als Ersatztermin vorschlagen.",
    "model": "来週の金曜日はどうですか。",
    "alternative": "では、来週の金曜日はどうですか。",
    "explanation": "では leitet den Alternativvorschlag ein, はどうですか fragt nach der Option.",
    "focus": "function"
  },
  {
    "id": "p38-rewrite-10",
    "unitIds": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "Höflich ins Kino einladen",
    "task": "Lade eine neue Bekanntschaft ein, am Sonntag gemeinsam einen Film anzusehen.",
    "model": "日曜日に一緒に映画を見ませんか。",
    "alternative": "日曜日、一緒に映画を見ませんか。",
    "explanation": "Eine Zeitangabe wie 日曜日 kann mit oder ohne に stehen; ませんか ist eine Einladung.",
    "focus": "function"
  },
  {
    "id": "p38-rewrite-11",
    "unitIds": [
      "p23:past",
      "p25:lostfound"
    ],
    "title": "Verlust gestern melden",
    "task": "Du meldest, dass du gestern am Bahnhof deinen Schirm verloren hast.",
    "model": "昨日、駅で傘をなくしました。",
    "alternative": "昨日、駅で私の傘をなくしました。",
    "explanation": "ました erzählt von einer vergangenen Handlung. 私の spezifiziert den Besitzer.",
    "focus": "time"
  },
  {
    "id": "p38-rewrite-12",
    "unitIds": [
      "p23:greetings",
      "p23:introduction"
    ],
    "title": "Lehrkraft am Morgen begrüßen",
    "task": "Du grüßt deine Lehrkraft morgens höflich.",
    "model": "おはようございます。",
    "alternative": "先生、おはようございます。",
    "explanation": "Die Anrede 先生 kann ergänzt werden; die Grußform selbst bleibt höflich.",
    "focus": "register"
  },
  {
    "id": "p38-rewrite-13",
    "unitIds": [
      "p23:routine",
      "p25:appointment"
    ],
    "title": "Freitag nachmittags treffen",
    "task": "Schlage ein Treffen am Freitagnachmittag um drei Uhr vor.",
    "model": "金曜日の午後三時に会いましょう。",
    "alternative": "金曜日、午後三時に会いましょう。",
    "explanation": "の verbindet den Wochentag mit der Tageszeit; im zweiten Satz steht 金曜日 als abgesetzte Zeitangabe.",
    "focus": "time"
  },
  {
    "id": "p38-rewrite-14",
    "unitIds": [
      "p26:library-project",
      "p25:library"
    ],
    "title": "Am Tisch lernen dürfen",
    "task": "Du bittest an einem öffentlichen Lernort höflich um die Erlaubnis, hier zu lernen.",
    "model": "ここで勉強してもいいですか。",
    "alternative": "ここで勉強しても大丈夫ですか。",
    "explanation": "Beide erfragen, ob die Tätigkeit hier erlaubt bzw. in Ordnung ist.",
    "focus": "function"
  },
  {
    "id": "p38-rewrite-15",
    "unitIds": [
      "p26:weekend-switch",
      "p25:appointment"
    ],
    "title": "Absage mit Alternativtag",
    "task": "Du sagst höflich, dass Samstag nicht passt, und schlägst Sonntag vor.",
    "model": "すみません、土曜日は予定があります。日曜日はどうですか。",
    "alternative": "すみません、土曜日はちょっと難しいです。日曜日はどうですか。",
    "explanation": "Eine Absage mit Ersatzvorschlag hält die Gesprächsführung kooperativ; beide sind höflich.",
    "focus": "register"
  },
  {
    "id": "p38-rewrite-16",
    "unitIds": [
      "p25:lostfound",
      "p25:shopping"
    ],
    "title": "Einen Gegenstand beschreiben",
    "task": "Du beschreibst dem Fundbüro deinen verlorenen schwarzen Schirm.",
    "model": "黒い傘をなくしました。",
    "alternative": "私は黒い傘をなくしました。",
    "explanation": "Beide nennen den verlorenen Schirm; 私は macht das Thema ausdrücklich.",
    "focus": "topic"
  }
];
export const p38ProductionPrompts:StudyPrompt[]=p38ProductionTransfers.map(c=>({
  id:c.id,primaryTarget:{kind:"can_do",id:"p38:rewrite:"+c.id},
  skill:"production",cueFamily:"p38-cross-production-"+c.id,promptType:"typed",
  instruction:"Japanischen Satz selbstständig in einer neuen Situation schreiben",
  prompt:c.task,acceptedAnswers:[normalizeP26(c.model),normalizeP26(c.alternative)],
  displayAnswer:c.model,explanation:c.explanation,
  answerNormalization:"japanese",contextId:"p38:rewrite:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p38-1",
  eventMetadata:{p38:true,kind:"cross-context-reformulation",unitIds:[...c.unitIds],
    focus:c.focus,taskId:c.id}
}));
export function p38ProductionForUnit(unitId:string):P38ProductionTransfer[]{
  return p38ProductionTransfers.filter(c=>c.unitIds.includes(unitId));
}
