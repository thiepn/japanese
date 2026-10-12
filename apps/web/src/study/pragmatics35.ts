import type {StudyPrompt} from "@thiepn/study-player";
export interface P35PragmaticChoice{
  id:string;unitId:string;scenarioId:string;focus:string;
  question:string;preferred:string;contrast:string;explanation:string;
}
export const p35PragmaticChoices:readonly P35PragmaticChoice[]=[
  {
    "id": "p35-pragmatic-1",
    "unitId": "p26:station-to-campus",
    "scenarioId": "station-questions",
    "focus": "Reiseziel statt Tätigkeitsort",
    "question": "Du möchtest sagen, dass du zur Universität fährst.",
    "preferred": "大学に行きます。",
    "contrast": "大学で勉強します。",
    "explanation": "に markiert das Ziel von 行きます; で den Ort von 勉強します."
  },
  {
    "id": "p35-pragmatic-2",
    "unitId": "p26:station-to-campus",
    "scenarioId": "station-questions",
    "focus": "Verkehrsmittel",
    "question": "Wie sagst du, dass du mit dem Bus fährst?",
    "preferred": "バスで行きます。",
    "contrast": "バスにいます。",
    "explanation": "で kennzeichnet das Verkehrsmittel. います sagt, wo jemand ist."
  },
  {
    "id": "p35-pragmatic-3",
    "unitId": "p26:library-project",
    "scenarioId": "library-study",
    "focus": "Erlaubnis versus Wunsch",
    "question": "Du möchtest beim Bibliothekspersonal ausdrücklich um Erlaubnis bitten.",
    "preferred": "この本を借りてもいいですか。",
    "contrast": "この本を借りたいです。",
    "explanation": "てもいいですか erbittet Erlaubnis; たいです äußert einen Wunsch."
  },
  {
    "id": "p35-pragmatic-4",
    "unitId": "p26:library-project",
    "scenarioId": "library-study",
    "focus": "Rückgabebitte",
    "question": "Als Bibliotheksmitarbeiter bittest du darum, das Buch bis nächste Woche zurückzugeben.",
    "preferred": "来週までに返してください。",
    "contrast": "来週返しました。",
    "explanation": "てください formuliert eine Bitte; ました erzählt von einer abgeschlossenen Handlung."
  },
  {
    "id": "p35-pragmatic-5",
    "unitId": "p26:cafe-conversation",
    "scenarioId": "cafe-fix",
    "focus": "Menge richtigstellen",
    "question": "Das Personal hat zwei statt einem Kaffee verstanden. Was korrigiert die Anzahl auf eins?",
    "preferred": "コーヒーは一つだけです。",
    "contrast": "コーヒーは二つです。",
    "explanation": "だけ begrenzt die Zahl; 二つ bestätigt zwei."
  },
  {
    "id": "p35-pragmatic-6",
    "unitId": "p26:cafe-conversation",
    "scenarioId": "cafe-fix",
    "focus": "Höfliche Bestellung",
    "question": "Du sprichst höflich zum Cafépersonal und bestellst einen Kaffee.",
    "preferred": "コーヒーを一つお願いします。",
    "contrast": "コーヒーを飲め。",
    "explanation": "お願いします formuliert eine Bitte; 飲め ist ein direkter Imperativ."
  },
  {
    "id": "p35-pragmatic-7",
    "unitId": "p25:appointment",
    "scenarioId": "appointment-shift",
    "focus": "Begründete Absage",
    "question": "Du kannst am Samstag nicht. Welche Antwort sagt das höflich?",
    "preferred": "すみません、土曜日は予定があります。",
    "contrast": "土曜日に会いましょう。",
    "explanation": "予定があります begründet die Nichtverfügbarkeit; 会いましょう schlägt ein Treffen vor."
  },
  {
    "id": "p35-pragmatic-8",
    "unitId": "p25:appointment",
    "scenarioId": "appointment-shift",
    "focus": "Alternativtermin vorschlagen",
    "question": "Du willst eine andere Zeit vorschlagen, nicht einen Vorschlag annehmen.",
    "preferred": "日曜日はどうですか。",
    "contrast": "日曜日なら大丈夫です。",
    "explanation": "はどうですか schlägt eine Option vor; なら大丈夫です signalisiert Zustimmung."
  },
  {
    "id": "p35-pragmatic-9",
    "unitId": "p25:lostfound",
    "scenarioId": "umbrella-owner",
    "focus": "Verlust melden",
    "question": "Du möchtest dem Fundbüro sagen, dass du den Schirm verloren hast.",
    "preferred": "傘をなくしました。",
    "contrast": "傘があります。",
    "explanation": "なくしました beschreibt den Verlust, あります das Vorhandensein."
  },
  {
    "id": "p35-pragmatic-10",
    "unitId": "p25:lostfound",
    "scenarioId": "umbrella-owner",
    "focus": "Verlustort nennen",
    "question": "Du sagst, dass du den Schirm am Bahnhof verloren hast.",
    "preferred": "駅で傘をなくしました。",
    "contrast": "駅に傘があります。",
    "explanation": "で kennzeichnet die Handlung des Verlierens, に den Existenzort."
  },
  {
    "id": "p35-pragmatic-11",
    "unitId": "p25:shopping",
    "scenarioId": "shop-colors",
    "focus": "Nach dem Preis fragen",
    "question": "Du möchtest vor dem Kauf den Preis einer Tasche wissen.",
    "preferred": "このかばんはいくらですか。",
    "contrast": "このかばんをください。",
    "explanation": "いくら erfragt den Preis; ください bestellt etwas."
  },
  {
    "id": "p35-pragmatic-12",
    "unitId": "p25:shopping",
    "scenarioId": "shop-colors",
    "focus": "Nach anderen Farben fragen",
    "question": "Du möchtest wissen, ob eine weitere Farbe erhältlich ist.",
    "preferred": "ほかの色はありますか。",
    "contrast": "赤いのをください。",
    "explanation": "ほかの色はありますか fragt nach Alternativen; 赤いのをください verlangt das Rote."
  },
  {
    "id": "p35-pragmatic-13",
    "unitId": "p23:introduction",
    "scenarioId": "campus-greeting",
    "focus": "Sich vorstellen",
    "question": "Du triffst jemanden zum ersten Mal und beginnst eine Vorstellung.",
    "preferred": "初めまして。",
    "contrast": "おやすみなさい。",
    "explanation": "初めまして leitet die erste Begegnung ein; おやすみなさい ist ein Abschiedsgruß zur Nacht."
  },
  {
    "id": "p35-pragmatic-14",
    "unitId": "p23:introduction",
    "scenarioId": "campus-greeting",
    "focus": "Gegenwart höflich",
    "question": "Du möchtest höflich sagen, dass du jetzt Student bist.",
    "preferred": "私は学生です。",
    "contrast": "私は学生でした。",
    "explanation": "です beschreibt hier die Gegenwart; でした die höfliche Vergangenheit."
  },
  {
    "id": "p35-pragmatic-15",
    "unitId": "p26:weekend-switch",
    "scenarioId": "weekend-invite",
    "focus": "Höflich einladen",
    "question": "Du möchtest für Sonntag eine Einladung aussprechen.",
    "preferred": "日曜日に行きませんか。",
    "contrast": "日曜日に行きました。",
    "explanation": "ませんか lädt ein; ました berichtet Vergangenes."
  },
  {
    "id": "p35-pragmatic-16",
    "unitId": "p26:weekend-switch",
    "scenarioId": "weekend-invite",
    "focus": "Ersatztermin anbieten",
    "question": "Du kannst Samstag nicht und möchtest Sonntag als Alternative vorschlagen.",
    "preferred": "土曜日は難しいです。日曜日はどうですか。",
    "contrast": "土曜日に行きましょう。",
    "explanation": "Die erste Antwort verbindet Absage und Gegenangebot, die zweite sagt für Samstag zu."
  }
];
export const p35PragmaticPrompts:StudyPrompt[]=p35PragmaticChoices.map((c,i)=>({
 id:c.id,primaryTarget:{kind:"can_do",id:"p35:pragmatics:"+c.scenarioId},
 skill:"form_selection",cueFamily:"p35-situation-"+c.id,promptType:"choice",
 instruction:"Deutung von Partikeln, Zeitform oder kommunikativer Absicht",
 prompt:c.question,choices:i%2?[c.contrast,c.preferred]:[c.preferred,c.contrast],
 acceptedAnswers:[c.preferred],displayAnswer:c.preferred,
 explanation:c.explanation,answerNormalization:"japanese",
 contextId:"p35:unit:"+c.unitId,sourceId:"thiepn-original",contentVersion:"p35-1",
 eventMetadata:{p35:true,kind:"contextual-contrast",unitId:c.unitId,scenarioId:c.scenarioId,focus:c.focus}
}));
export function p35PragmaticForScenario(id:string):P35PragmaticChoice[]{
 return p35PragmaticChoices.filter(c=>c.scenarioId===id);
}
