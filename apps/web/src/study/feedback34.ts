import {normalizeP26} from "./pedagogy26";
/** Authored function distinctions, not a Japanese parser or grammar grade. */
export interface P34RoleContrast {
 scenarioId:string;title:string;explanation:string;observations:readonly string[];
 contextualGoal:string;
}
export const p34RoleContrasts:readonly P34RoleContrast[]=[
  {
    "scenarioId": "station-questions",
    "title": "交通手段・目的地",
    "explanation": "で steht beim Verkehrsmittel (バスで), に／へ beim Reiseziel (大学に／大学へ).",
    "observations": [
      "で",
      "に",
      "へ"
    ],
    "contextualGoal": "Die Partnerfrage betrifft den Weg, nicht den Preis oder die Verfügbarkeit."
  },
  {
    "scenarioId": "library-study",
    "title": "希望・許可",
    "explanation": "を markiert das Buch als Objekt; たい beschreibt einen Wunsch, てもいいですか ist eine Erlaubnisfrage.",
    "observations": [
      "を",
      "たい",
      "てもいい"
    ],
    "contextualGoal": "Achte darauf, ob du als Nutzer ausleihen möchtest oder als Personal Erlaubnis gibst."
  },
  {
    "scenarioId": "cafe-fix",
    "title": "数量・丁寧さ",
    "explanation": "を markiert die Bestellung, 一つ／二つ die Zahl; ください／お願いします sind höfliche Bitten.",
    "observations": [
      "を",
      "一つ",
      "二つ",
      "お願いします"
    ],
    "contextualGoal": "Unterscheide Bestellung, Nachfrage und Korrektur der Menge."
  },
  {
    "scenarioId": "appointment-shift",
    "title": "日付・提案",
    "explanation": "なら legt ein passendes Zeitfenster fest, ませんか lädt ein und ましょう schlägt gemeinsames Handeln vor.",
    "observations": [
      "なら",
      "ませんか",
      "ましょう",
      "に"
    ],
    "contextualGoal": "Eine Einladung braucht eine andere Reaktion als eine Terminbestätigung."
  },
  {
    "scenarioId": "umbrella-owner",
    "title": "場所・目的語",
    "explanation": "で markiert den Verlustort mit なくす, を das verlorene Objekt; 黒い beschreibt den Schirm.",
    "observations": [
      "で",
      "を",
      "黒い"
    ],
    "contextualGoal": "Die Person im Fundbüro benötigt Ort und Aussehen, nicht lediglich ein Ja oder Nein."
  },
  {
    "scenarioId": "shop-colors",
    "title": "指示・値段",
    "explanation": "この／その／あの unterscheiden Bezug und Entfernung; いくら erfragt einen Preis.",
    "observations": [
      "この",
      "あの",
      "いくら",
      "円"
    ],
    "contextualGoal": "Beim Einkauf unterscheide Suchwunsch, Preisfrage und Angebot."
  },
  {
    "scenarioId": "campus-greeting",
    "title": "話題・丁寧語",
    "explanation": "は markiert ein Thema, です schließt eine höfliche Nominalaussage; よろしくお願いします ist eine Begrüßungsformel.",
    "observations": [
      "は",
      "です",
      "よろしく"
    ],
    "contextualGoal": "Eine Selbstvorstellung unterscheidet sich von der Antwort auf die Studienfrage."
  },
  {
    "scenarioId": "weekend-invite",
    "title": "誘い・都合",
    "explanation": "ませんか lädt ein, たい beschreibt einen Wunsch, ちょっと kann eine indirekte Absage signalisieren.",
    "observations": [
      "ませんか",
      "たい",
      "ちょっと",
      "大丈夫"
    ],
    "contextualGoal": "Ein Vorschlag zum gemeinsamen Handeln kann angenommen, abgelehnt oder auf einen anderen Termin verlegt werden."
  }
];
export function p34RoleFeedback(scenarioId:string,response:string):string[]{
 const contrast=p34RoleContrasts.find(c=>c.scenarioId===scenarioId);
 if(!contrast)return [];
 const normalized=normalizeP26(response);
 const observed=contrast.observations.filter(marker=>normalized.includes(marker));
 return [
   contrast.title+" — "+contrast.explanation,
   contrast.contextualGoal,
   observed.length?"Sichtbare Sprachsignale: "+observed.join(" · "):
     "Keine der hervorgehobenen Musterformen sichtbar. Das ist keine automatische Fehlerdiagnose.",
   "Diese Hinweise vergleichen Textmuster. Ob die Aussage grammatisch und in der Situation passend ist, muss gesondert beurteilt werden."
 ];
}
