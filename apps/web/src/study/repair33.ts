/** Independently authored conversational repair exchanges linked to existing role paths. */
export interface P33Repair{
 scenarioId:string;partner:string;meaning:string;model:string;gloss:string;
 clarification:string;clarificationMeaning:string;explanation:string;
}
export const p33Repairs:readonly P33Repair[]=[
  {
    "scenarioId": "station-questions",
    "partner": "大学へは何で行きますか。",
    "meaning": "Wie gelangen Sie zur Universität?",
    "model": "すみません、もう一度言ってください。",
    "gloss": "Bitte sagen Sie es noch einmal.",
    "clarification": "大学にはバスで行きますか。",
    "clarificationMeaning": "Fahren Sie mit dem Bus zur Universität?",
    "explanation": "Mit もう一度 bittet man um Wiederholung."
  },
  {
    "scenarioId": "library-study",
    "partner": "どんな日本語の本が必要ですか。",
    "meaning": "Was für ein Japanischbuch brauchen Sie?",
    "model": "すみません、ゆっくりお願いします。",
    "gloss": "Bitte etwas langsamer.",
    "clarification": "どんな本を探していますか。",
    "clarificationMeaning": "Was für ein Buch suchen Sie?",
    "explanation": "ゆっくりお願いします ist eine höfliche Bitte um langsameres Sprechen."
  },
  {
    "scenarioId": "cafe-fix",
    "partner": "ご注文を確認してもよろしいですか。",
    "meaning": "Darf ich Ihre Bestellung prüfen?",
    "model": "すみません、もう一度お願いします。",
    "gloss": "Noch einmal bitte.",
    "clarification": "コーヒーはいくつですか。",
    "clarificationMeaning": "Wie viele Kaffees?",
    "explanation": "Die Bitte mit もう一度 ist höflich und knapp."
  },
  {
    "scenarioId": "appointment-shift",
    "partner": "金曜日の午後はご都合いかがですか。",
    "meaning": "Wie passt es Ihnen Freitagnachmittag?",
    "model": "すみません、よくわかりません。",
    "gloss": "Entschuldigung, ich verstehe es nicht ganz.",
    "clarification": "金曜日の午後は大丈夫ですか。",
    "clarificationMeaning": "Passt Freitagnachmittag?",
    "explanation": "よくわかりません meldet höflich eine Verständnislücke."
  },
  {
    "scenarioId": "umbrella-owner",
    "partner": "なくした場所を覚えていますか。",
    "meaning": "Erinnern Sie sich an den Verlustort?",
    "model": "すみません、もう少しゆっくりお願いします。",
    "gloss": "Bitte etwas langsamer.",
    "clarification": "どこでなくしましたか。",
    "clarificationMeaning": "Wo haben Sie ihn verloren?",
    "explanation": "もう少しゆっくり konkretisiert die Bitte um langsameres Sprechen."
  },
  {
    "scenarioId": "shop-colors",
    "partner": "こちらの色もご覧になりますか。",
    "meaning": "Möchten Sie auch diese Farbe ansehen?",
    "model": "すみません、もう一度お願いします。",
    "gloss": "Könnten Sie das wiederholen?",
    "clarification": "この色も見ますか。",
    "clarificationMeaning": "Möchten Sie diese Farbe auch ansehen?",
    "explanation": "Eine höfliche Reparaturfrage vermeidet bloßes Nicken bei Unklarheit."
  },
  {
    "scenarioId": "campus-greeting",
    "partner": "何を専門に勉強していますか。",
    "meaning": "Was studieren Sie als Fach?",
    "model": "すみません、意味を教えてください。",
    "gloss": "Bitte erklären Sie die Bedeutung.",
    "clarification": "大学で何を勉強していますか。",
    "clarificationMeaning": "Was lernen Sie an der Universität?",
    "explanation": "意味を教えてください bittet um eine Erklärung der Bedeutung."
  },
  {
    "scenarioId": "weekend-invite",
    "partner": "週末のご予定はいかがですか。",
    "meaning": "Wie sehen Ihre Wochenendpläne aus?",
    "model": "すみません、もう一度言ってください。",
    "gloss": "Bitte wiederholen Sie das.",
    "clarification": "土曜日か日曜日に時間がありますか。",
    "clarificationMeaning": "Haben Sie Samstag oder Sonntag Zeit?",
    "explanation": "Wenn eine höfliche Frage zu kompliziert ist, kann man um Wiederholung bitten."
  }
];
export function p33RepairForScenario(id:string):P33Repair|undefined{
 return p33Repairs.find(r=>r.scenarioId===id);
}
