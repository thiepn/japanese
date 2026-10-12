/** Original third-turn continuations for both sides of every P33 role scenario.
 * Inherited turns 0 and 1 retain their exact IDs and FSRS identity. */
export interface P35RoleContinuation{
  scenarioId:string;role:"guest"|"host";partner:string;meaning:string;model:string;gloss:string;
}
export const p35RoleContinuations:readonly P35RoleContinuation[]=[
  {
    "scenarioId": "station-questions",
    "role": "guest",
    "partner": "大学には何時ごろ着きますか。",
    "meaning": "Ungefähr wann kommen Sie an der Universität an?",
    "model": "十時ごろ着きます。",
    "gloss": "Ich komme gegen zehn an."
  },
  {
    "scenarioId": "station-questions",
    "role": "host",
    "partner": "バス停はどこにありますか。",
    "meaning": "Wo ist die Bushaltestelle?",
    "model": "駅の前にあります。",
    "gloss": "Sie liegt vor dem Bahnhof."
  },
  {
    "scenarioId": "library-study",
    "role": "guest",
    "partner": "来週までに返せますか。",
    "meaning": "Können Sie es bis nächste Woche zurückgeben?",
    "model": "はい、来週までに返します。",
    "gloss": "Ja, ich gebe es bis nächste Woche zurück."
  },
  {
    "scenarioId": "library-study",
    "role": "host",
    "partner": "返す日は来週ですね。",
    "meaning": "Das Rückgabedatum ist nächste Woche, richtig?",
    "model": "はい、来週までに返してください。",
    "gloss": "Ja, bitte geben Sie es bis nächste Woche zurück."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "guest",
    "partner": "お支払いはどうなさいますか。",
    "meaning": "Wie möchten Sie bezahlen?",
    "model": "カードでお願いします。",
    "gloss": "Mit Karte, bitte."
  },
  {
    "scenarioId": "cafe-fix",
    "role": "host",
    "partner": "ありがとうございました。",
    "meaning": "Vielen Dank.",
    "model": "またお越しください。",
    "gloss": "Kommen Sie gerne wieder."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "guest",
    "partner": "どこで会いましょうか。",
    "meaning": "Wo sollen wir uns treffen?",
    "model": "駅の前で会いましょう。",
    "gloss": "Treffen wir uns vor dem Bahnhof."
  },
  {
    "scenarioId": "appointment-shift",
    "role": "host",
    "partner": "その時間で大丈夫ですか。",
    "meaning": "Passt diese Uhrzeit?",
    "model": "はい、三時で大丈夫です。",
    "gloss": "Ja, drei Uhr passt."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "guest",
    "partner": "傘は見つかりましたか。",
    "meaning": "Wurde der Schirm gefunden?",
    "model": "いいえ、まだです。",
    "gloss": "Nein, noch nicht."
  },
  {
    "scenarioId": "umbrella-owner",
    "role": "host",
    "partner": "見つかったら連絡してください。",
    "meaning": "Bitte melden Sie sich, wenn er gefunden wird.",
    "model": "はい、見つかったら連絡します。",
    "gloss": "Ja, ich melde mich, falls er gefunden wird."
  },
  {
    "scenarioId": "shop-colors",
    "role": "guest",
    "partner": "こちらのサイズはいかがですか。",
    "meaning": "Wie wäre es mit dieser Größe?",
    "model": "もう少し小さいのはありますか。",
    "gloss": "Gibt es eine etwas kleinere?"
  },
  {
    "scenarioId": "shop-colors",
    "role": "host",
    "partner": "ほかの色はありますか。",
    "meaning": "Gibt es andere Farben?",
    "model": "はい、青いのもあります。",
    "gloss": "Ja, es gibt auch eine blaue."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "guest",
    "partner": "来週も授業に来ますか。",
    "meaning": "Kommen Sie nächste Woche auch zum Unterricht?",
    "model": "はい、来週も来ます。",
    "gloss": "Ja, ich komme auch nächste Woche."
  },
  {
    "scenarioId": "campus-greeting",
    "role": "host",
    "partner": "一緒に勉強しませんか。",
    "meaning": "Wollen wir zusammen lernen?",
    "model": "はい、ぜひお願いします。",
    "gloss": "Ja, sehr gerne."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "guest",
    "partner": "何時に会いましょうか。",
    "meaning": "Um wie viel Uhr wollen wir uns treffen?",
    "model": "午後三時に会いましょう。",
    "gloss": "Treffen wir uns um drei Uhr nachmittags."
  },
  {
    "scenarioId": "weekend-invite",
    "role": "host",
    "partner": "駅で会いませんか。",
    "meaning": "Wollen wir uns am Bahnhof treffen?",
    "model": "はい、駅で会いましょう。",
    "gloss": "Ja, treffen wir uns am Bahnhof."
  }
];
export function p35RoleContinuation(id:string,role:"guest"|"host"):P35RoleContinuation|undefined{
  return p35RoleContinuations.find(turn=>turn.scenarioId===id&&turn.role===role);
}
