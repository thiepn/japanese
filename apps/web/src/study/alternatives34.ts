import {normalizeP26} from "./pedagogy26";
/**
 * Per-target alternative answers added without changing inherited prompt IDs,
 * target refs or FSRS cue families. Every alternative is authored and reviewed
 * as a context-appropriate response, never as an arbitrary grammar match.
 */
export interface P34Alternative {
  scenarioId:string;role:"guest"|"host";turnIndex:number;
  answer:string;nuance:string;
}
export const p34RoleAlternatives:readonly P34Alternative[]=[
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "turnIndex": 0,
    "answer": "大学へバスで行きます。",
    "nuance": "へ und に können bei 行きます das Ziel markieren."
  },
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "turnIndex": 1,
    "answer": "九時に出ます。",
    "nuance": "出ます ist hier eine einfachere Aussage zur Abfahrt."
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "turnIndex": 0,
    "answer": "バスで大学に行きます。",
    "nuance": "Das Ziel und das Verkehrsmittel bleiben mit に beziehungsweise で verbunden."
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "turnIndex": 1,
    "answer": "あちらです。",
    "nuance": "Die knappe höfliche Ortsangabe ist ebenfalls möglich."
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "turnIndex": 0,
    "answer": "日本語の本を探しているんです。",
    "nuance": "Die erklärende gesprochene Form んです ist etwas weicher und ausführlicher."
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "turnIndex": 1,
    "answer": "はい、この本を借りたいです。",
    "nuance": "Das konkrete Buch wird ausdrücklich benannt."
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "turnIndex": 0,
    "answer": "はい、いいですよ。",
    "nuance": "Eine gebräuchliche Erlaubnisformel, im Ton etwas lockerer als どうぞ."
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "turnIndex": 1,
    "answer": "来週までにお願いします。",
    "nuance": "Der Rückgabetermin wird höflich, aber elliptisch genannt."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "turnIndex": 0,
    "answer": "コーヒーを一つください。",
    "nuance": "ください ist eine alternative höfliche Bestellform."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "turnIndex": 1,
    "answer": "いいえ、大丈夫です。",
    "nuance": "Eine sanfte Ablehnung der zusätzlichen Bestellung."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "turnIndex": 0,
    "answer": "ありがとうございます。コーヒーを二つですね。",
    "nuance": "Höfliche Bestätigung der Zweierbestellung."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "turnIndex": 1,
    "answer": "すみません、コーヒーは一つですね。",
    "nuance": "Eine andere höfliche Korrektur der Menge."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "turnIndex": 0,
    "answer": "金曜日は大丈夫です。",
    "nuance": "Freitag ist eine passende Möglichkeit ohne なら."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "turnIndex": 1,
    "answer": "三時に会いませんか。",
    "nuance": "Eine höfliche Einladung zum Treffen um drei."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "turnIndex": 0,
    "answer": "すみません、土曜日はちょっと。",
    "nuance": "Eine höfliche, indirekte Absage in vertrautem Alltagsjapanisch."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "turnIndex": 1,
    "answer": "はい、日曜日なら大丈夫です。",
    "nuance": "Die Zustimmung wird mit はい explizit bekräftigt."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "turnIndex": 0,
    "answer": "黒い傘をなくしました。",
    "nuance": "Das verlorene Objekt wird als vollständiger Satz beschrieben."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "turnIndex": 1,
    "answer": "駅で傘をなくしました。",
    "nuance": "Der Fund-/Verlustort wird mit で bezeichnet, der Gegenstand mit を."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "turnIndex": 0,
    "answer": "傘は何色ですか。",
    "nuance": "Eine auf die Schirmfarbe zielende gleichfalls hilfreiche Rückfrage."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "turnIndex": 1,
    "answer": "わかりました。探します。",
    "nuance": "Eine direkte höfliche Suchzusage statt der vorsichtigeren てみます-Form."
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "turnIndex": 0,
    "answer": "赤いかばんはありますか。",
    "nuance": "Die Nachfrage nach der roten Tasche passt ebenfalls zur Suchsituation."
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "turnIndex": 1,
    "answer": "このかばんはいくらですか。",
    "nuance": "Eine höfliche Preisfrage ohne vorangestellten Dank."
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "turnIndex": 0,
    "answer": "三千円になります。",
    "nuance": "Eine im Servicekontakt verbreitete höfliche Preisangabe."
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "turnIndex": 1,
    "answer": "はい、青いかばんもあります。",
    "nuance": "Das Nomen かばん wird zur Verdeutlichung wiederholt."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "turnIndex": 0,
    "answer": "アキです。よろしくお願いします。",
    "nuance": "Der Name allein mit です und abschließender Formel ist bei Vorstellungen natürlich."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "turnIndex": 1,
    "answer": "大学で勉強します。",
    "nuance": "Auch die allgemeine Aussage zur Tätigkeit an der Universität ist passend."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "turnIndex": 0,
    "answer": "私の名前はユキです。よろしくお願いします。",
    "nuance": "Die ausführliche Selbstvorstellung nennt 名前 explizit."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "turnIndex": 1,
    "answer": "はい、日本語を毎日勉強しています。",
    "nuance": "Das Lernobjekt wird explizit hinzugefügt."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "turnIndex": 0,
    "answer": "はい、日曜日は空いています。",
    "nuance": "Eine ausdrückliche Bestätigung der sonntäglichen Verfügbarkeit."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "turnIndex": 1,
    "answer": "映画が見たいです。",
    "nuance": "が ist mit dem Wunschausdruck 見たい ebenfalls gebräuchlich."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "turnIndex": 0,
    "answer": "すみません、土曜日はちょっと。",
    "nuance": "Eine kurze indirekte, höfliche Absage."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "turnIndex": 1,
    "answer": "はい、いいですね。",
    "nuance": "Die positive Reaktion wird durch はい betont."
  }
];
export function p34AlternativesForTurn(id:string,role:"guest"|"host",index:number):P34Alternative[]{
 return p34RoleAlternatives.filter(a=>a.scenarioId===id&&a.role===role&&a.turnIndex===index);
}
export function p34AcceptedRoleAnswers(id:string,role:"guest"|"host",index:number,model:string):string[]{
 const models=[model,...p34AlternativesForTurn(id,role,index).map(a=>a.answer)];
 return [...new Set(models.map(normalizeP26))];
}
