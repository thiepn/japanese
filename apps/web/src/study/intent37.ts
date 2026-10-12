/** Extra independently authored forms for intent-1, one pair for each role scenario.
 * The P36 guided response flow remains ungraded and source-owned. */
export interface P37IntentVariation{
 scenarioId:string;role:"guest"|"host";intentId:"intent-1";
 alternateFirst:string;alternateSecond:string;nuance:string;
}
export const p37IntentVariations:readonly P37IntentVariation[]=[
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "ほかのバスはありますか。",
    "alternateSecond": "では、十時のバスで行きます。",
    "nuance": "は betont die Frage nach weiteren Busmöglichkeiten; で stellt das Verkehrsmittel in den Vordergrund."
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "駅の前のバス停から乗ってください。",
    "alternateSecond": "二番です。",
    "nuance": "Die erste Antwort nennt den Einstiegsort genauer; die zweite beantwortet die Busnummer knapp."
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "返却日はいつですか。",
    "alternateSecond": "来週の火曜日ですね。",
    "nuance": "返却日 bezeichnet das Rückgabedatum ausdrücklich; die Bestätigung bleibt höflich."
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "この箱に入れて返してください。",
    "alternateSecond": "はい、ここで大丈夫です。",
    "nuance": "Die Rückgabeanweisung nennt den Kasten; das anschließende はい bestätigt den Ort."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "すみません、コーヒーは一つです。",
    "alternateSecond": "はい、それでお願いします。",
    "nuance": "Die Menge wird als Thema hervorgehoben; die abschließende Bitte bestätigt die Korrektur."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "コーヒーは一つでよろしいですか。",
    "alternateSecond": "すみません、一つで承ります。",
    "nuance": "Servicehöflichkeit mit でよろしいですか und 承ります."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "図書館で会いましょうか。",
    "alternateSecond": "午後三時はどうですか。",
    "nuance": "ましょうか schlägt das Treffen vor; 午後 präzisiert den Uhrzeitvorschlag."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "金曜日ならどうですか。",
    "alternateSecond": "はい、金曜日に会いましょう。",
    "nuance": "なら rahmt die mögliche Alternative, に benennt den bestätigten Tag."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "私の傘は見つかりましたか。",
    "alternateSecond": "では、見つかったら教えてください。",
    "nuance": "Das Thema 私の傘 verdeutlicht den Bezug; 教えてください bittet um Benachrichtigung."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "黒い傘ですね。わかりました。",
    "alternateSecond": "少し探してみます。",
    "nuance": "Die erste Form bestätigt das Aussehen; てみます beschreibt einen Suchversuch."
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "もう少し小さいのもありますか。",
    "alternateSecond": "これを見てもいいですか。",
    "nuance": "も fragt nach einer zusätzlichen Option; てもいいですか bittet um Erlaubnis zum Ansehen."
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "このかばんも人気があります。",
    "alternateSecond": "はい、こちらをどうぞ。",
    "nuance": "も signalisiert ein weiteres beliebtes Produkt; どうぞ übergibt höflich die Alternative."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "一緒に日本語を勉強しませんか。",
    "alternateSecond": "来週の金曜日はどうですか。",
    "nuance": "日本語 macht das gemeinsame Lernziel ausdrücklich, 来週 präzisiert den Terminvorschlag."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "日本語を使って何をしたいですか。",
    "alternateSecond": "それはいいですね。",
    "nuance": "を使って hebt die Sprachverwendung hervor; eine positive Reaktion bestätigt das Reisevorhaben."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "intentId": "intent-1",
    "alternateFirst": "土曜日は予定があります。日曜日ならどうですか。",
    "alternateSecond": "ありがとうございます。では、日曜日に。",
    "nuance": "Die begründete Absage und der Alternativvorschlag bilden eine höfliche Gesprächsfolge."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "intentId": "intent-1",
    "alternateFirst": "何時ごろ会いましょうか。",
    "alternateSecond": "午後三時に会いましょう。",
    "nuance": "ごろ erfragt eine ungefähre Zeit, に fixiert den anschließend vereinbarten Termin."
  }
];
export function p37IntentVariation(scenarioId:string,role:"guest"|"host",intentId:string):P37IntentVariation|undefined{
 return p37IntentVariations.find(v=>v.scenarioId===scenarioId&&v.role===role&&v.intentId===intentId);
}
