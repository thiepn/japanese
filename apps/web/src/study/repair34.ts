/** An ungraded continuation after an original comprehension-repair exchange. */
export interface P34RepairContinuation{
  scenarioId:string;clarifiedAnswer:string;clarifiedMeaning:string;
  partnerFollowup:string;partnerMeaning:string;modelReply:string;modelMeaning:string;note:string;
}
export const p34RepairContinuations:readonly P34RepairContinuation[]=[
  {
    "scenarioId": "station-questions",
    "clarifiedAnswer": "はい、バスで大学に行きます。",
    "clarifiedMeaning": "Ja, ich fahre mit dem Bus zur Universität.",
    "partnerFollowup": "バスは何時に出ますか。",
    "partnerMeaning": "Wann fährt der Bus?",
    "modelReply": "九時に出ます。",
    "modelMeaning": "Um neun Uhr.",
    "note": "Die Rückfrage nach dem Verkehrsmittel führt zu einer Zeitangabe."
  },
  {
    "scenarioId": "library-study",
    "clarifiedAnswer": "日本語の本を探しています。",
    "clarifiedMeaning": "Ich suche ein Japanischbuch.",
    "partnerFollowup": "この本を借りたいですか。",
    "partnerMeaning": "Möchten Sie dieses Buch ausleihen?",
    "modelReply": "はい、借りたいです。",
    "modelMeaning": "Ja, ich möchte es ausleihen.",
    "note": "Nach der Klärung des Buchwunsches folgt eine Ausleihfrage."
  },
  {
    "scenarioId": "cafe-fix",
    "clarifiedAnswer": "コーヒーを一つお願いします。",
    "clarifiedMeaning": "Einen Kaffee bitte.",
    "partnerFollowup": "ケーキもいりますか。",
    "partnerMeaning": "Möchten Sie Kuchen dazu?",
    "modelReply": "いいえ、大丈夫です。",
    "modelMeaning": "Nein, danke.",
    "note": "Eine Zusatzbestellung kann höflich abgelehnt werden."
  },
  {
    "scenarioId": "appointment-shift",
    "clarifiedAnswer": "金曜日なら大丈夫です。",
    "clarifiedMeaning": "Freitag passt.",
    "partnerFollowup": "何時に会いますか。",
    "partnerMeaning": "Wann treffen wir uns?",
    "modelReply": "三時に会いましょう。",
    "modelMeaning": "Treffen wir uns um drei.",
    "note": "Nach geklärter Verfügbarkeit wird die genaue Uhrzeit vereinbart."
  },
  {
    "scenarioId": "umbrella-owner",
    "clarifiedAnswer": "駅で傘をなくしました。",
    "clarifiedMeaning": "Ich habe am Bahnhof einen Schirm verloren.",
    "partnerFollowup": "どんな傘ですか。",
    "partnerMeaning": "Was für einen Schirm?",
    "modelReply": "黒い傘です。",
    "modelMeaning": "Ein schwarzer Schirm.",
    "note": "Die Rückfrage führt von Ort zum Aussehen."
  },
  {
    "scenarioId": "shop-colors",
    "clarifiedAnswer": "このかばんを見たいです。",
    "clarifiedMeaning": "Ich möchte diese Tasche ansehen.",
    "partnerFollowup": "いくらですか。",
    "partnerMeaning": "Wie viel kostet sie?",
    "modelReply": "三千円です。",
    "modelMeaning": "Dreitausend Yen.",
    "note": "Beim Einkauf folgt auf die Auswahl eine Preisangabe."
  },
  {
    "scenarioId": "campus-greeting",
    "clarifiedAnswer": "大学で日本語を勉強しています。",
    "clarifiedMeaning": "Ich lerne an der Universität Japanisch.",
    "partnerFollowup": "毎日勉強しますか。",
    "partnerMeaning": "Lernen Sie jeden Tag?",
    "modelReply": "はい、毎日勉強しています。",
    "modelMeaning": "Ja, jeden Tag.",
    "note": "Nach geklärtem Studienfach folgt eine Gewohnheitsfrage."
  },
  {
    "scenarioId": "weekend-invite",
    "clarifiedAnswer": "日曜日なら大丈夫です。",
    "clarifiedMeaning": "Sonntag passt.",
    "partnerFollowup": "どこで会いますか。",
    "partnerMeaning": "Wo treffen wir uns?",
    "modelReply": "駅で会いましょう。",
    "modelMeaning": "Treffen wir uns am Bahnhof.",
    "note": "Nach Klärung des Tages wird der Treffpunkt vereinbart."
  }
];
export function p34RepairContinuationFor(id:string):P34RepairContinuation|undefined{
  return p34RepairContinuations.find(item=>item.scenarioId===id);
}
