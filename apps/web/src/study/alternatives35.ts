import {normalizeP26} from "./pedagogy26";
export interface P35Alternative {
 scenarioId:string;role:"guest"|"host";turnIndex:number;
 answer:string;nuance:string;
}
/** Authored alternatives for third turns; earlier P34 variants remain unchanged. */
export const p35RoleAlternatives:readonly P35Alternative[]=[
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "turnIndex": 2,
    "answer": "十時ぐらいに着きます。",
    "nuance": "ごろ／ぐらい sind in diesem Zeitkontext beide ungefähre Angaben."
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "turnIndex": 2,
    "answer": "バス停は駅の前です。",
    "nuance": "Eine höfliche Nominalaussage beschreibt den Ort ohne あります."
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "turnIndex": 2,
    "answer": "はい、来週返します。",
    "nuance": "Eine einfache Zusage zur Rückgabe in der kommenden Woche."
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "turnIndex": 2,
    "answer": "はい、返却は来週までです。",
    "nuance": "Eine höfliche Aussage über den Rückgabetermin."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "turnIndex": 2,
    "answer": "カードで払います。",
    "nuance": "で markiert das Zahlungsmittel; die ます-Form ist höflich."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "turnIndex": 2,
    "answer": "ありがとうございました。またどうぞ。",
    "nuance": "Eine höfliche Abschiedsformel zum Kunden."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "turnIndex": 2,
    "answer": "駅の前で会いませんか。",
    "nuance": "Eine höfliche Einladung mit dem gleichen Treffpunkt."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "turnIndex": 2,
    "answer": "三時なら大丈夫です。",
    "nuance": "なら bestätigt die angebotene Uhrzeit bedingt."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "turnIndex": 2,
    "answer": "まだ見つかっていません。",
    "nuance": "Die negative Verlaufsform drückt aus, dass der Schirm noch nicht gefunden wurde."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "turnIndex": 2,
    "answer": "はい、連絡します。",
    "nuance": "Eine kurze höfliche Zusage, Kontakt aufzunehmen."
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "turnIndex": 2,
    "answer": "小さいサイズはありますか。",
    "nuance": "Die Nachfrage nennt ausdrücklich eine kleinere Größe."
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "turnIndex": 2,
    "answer": "はい、青いかばんもあります。",
    "nuance": "Das Nomen かばん wird zur Verdeutlichung wiederholt."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "turnIndex": 2,
    "answer": "はい、来週も授業に来ます。",
    "nuance": "Das Ziel 授業 wird genannt, die Höflichkeit bleibt gleich."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "turnIndex": 2,
    "answer": "はい、一緒に勉強しましょう。",
    "nuance": "Eine positive Antwort mit gemeinsamer Handlungsaufforderung."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "turnIndex": 2,
    "answer": "三時はどうですか。",
    "nuance": "Eine alternative höfliche Uhrzeitfrage statt direkter Festlegung."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "turnIndex": 2,
    "answer": "駅なら大丈夫です。",
    "nuance": "Der Treffpunkt wird mit なら als passende Bedingung bestätigt."
  }
];
export function p35AlternativesForTurn(id:string,role:"guest"|"host",index:number):P35Alternative[]{
 return p35RoleAlternatives.filter(item=>item.scenarioId===id&&item.role===role&&item.turnIndex===index);
}
export function p35AcceptedRoleAnswers(id:string,role:"guest"|"host",index:number):string[]{
 return p35AlternativesForTurn(id,role,index).map(item=>normalizeP26(item.answer));
}
