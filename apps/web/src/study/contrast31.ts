import type {StudyPrompt} from "@thiepn/study-player";

/** Author-owned, scenario-specific form/meaning/register contrasts. */
export interface P31Contrast {
  id:string;unitId:string;situation:string;preferred:string;alternative:string;
  why:string;focus:"particle"|"form"|"register"|"time"|"meaning";
}
export const p31Contrasts:readonly P31Contrast[]=[
  {
    "id": "p31-contrast-1",
    "unitId": "p23:greetings",
    "situation": "Du begrüßt morgens eine unbekannte Lehrkraft.",
    "preferred": "おはようございます。",
    "alternative": "おはよう。",
    "why": "Im Erstkontakt ist die höfliche Morgenform meist angemessener; unter Freunden ist die kurze Form üblich.",
    "focus": "register"
  },
  {
    "id": "p31-contrast-2",
    "unitId": "p23:introduction",
    "situation": "Du stellst dich in einem formellen Einführungskurs vor.",
    "preferred": "私は学生です。",
    "alternative": "私は学生だ。",
    "why": "Das höfliche Nominalprädikat endet auf です. だ ist informell.",
    "focus": "register"
  },
  {
    "id": "p31-contrast-3",
    "unitId": "p23:ownership",
    "situation": "Du erklärst höflich, dass das Buch dir gehört.",
    "preferred": "この本は私のです。",
    "alternative": "この本は私のをです。",
    "why": "の ersetzt hier den besessenen Gegenstand; ein zusätzliches を wäre grammatisch unpassend.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-4",
    "unitId": "p23:places",
    "situation": "Du beschreibst, wo du lernst.",
    "preferred": "大学で勉強します。",
    "alternative": "大学に勉強します。",
    "why": "で steht beim Ort der Tätigkeit 勉強します, nicht に.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-5",
    "unitId": "p23:routine",
    "situation": "Du gibst eine konkrete Startzeit an.",
    "preferred": "七時に勉強します。",
    "alternative": "七時で勉強します。",
    "why": "Bei dieser Uhrzeit verwendet man に; で markiert hier keine Zeitangabe.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-6",
    "unitId": "p23:cafe",
    "situation": "Im Café erbittest du höflich ein Getränk.",
    "preferred": "お茶をください。",
    "alternative": "お茶にください。",
    "why": "を markiert den Gegenstand der Bestellung.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-7",
    "unitId": "p23:plans",
    "situation": "Du lädst eine neue Kursbekanntschaft ein.",
    "preferred": "一緒に行きませんか。",
    "alternative": "一緒に行きました。",
    "why": "ませんか lädt ein, ました berichtet über die Vergangenheit.",
    "focus": "meaning"
  },
  {
    "id": "p31-contrast-8",
    "unitId": "p23:past",
    "situation": "Die Frage betrifft eine abgeschlossene Handlung gestern.",
    "preferred": "昨日、本を読みました。",
    "alternative": "昨日、本を読みます。",
    "why": "Bei abgeschlossenem Geschehen wird die höfliche Vergangenheit ました verwendet.",
    "focus": "time"
  },
  {
    "id": "p31-contrast-9",
    "unitId": "p25:directions",
    "situation": "Du fragst einen Passanten höflich nach dem Bahnhof.",
    "preferred": "すみません、駅はどこですか。",
    "alternative": "駅、どこ？",
    "why": "Die längere Frage ist im Erstkontakt angemessener, die verkürzte eher unter Bekannten.",
    "focus": "register"
  },
  {
    "id": "p31-contrast-10",
    "unitId": "p25:transport",
    "situation": "Du nennst das Verkehrsmittel zur Universität.",
    "preferred": "バスで大学に行きます。",
    "alternative": "バスに大学で行きます。",
    "why": "で markiert das Verkehrsmittel, に das Bewegungsziel.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-11",
    "unitId": "p25:library",
    "situation": "Du fragst das Bibliothekspersonal um Erlaubnis.",
    "preferred": "この本を借りてもいいですか。",
    "alternative": "この本を借りたいです。",
    "why": "たい beschreibt einen Wunsch; てもいいですか erfragt Erlaubnis.",
    "focus": "meaning"
  },
  {
    "id": "p31-contrast-12",
    "unitId": "p25:shopping",
    "situation": "Du fragst nach dem Preis dieser Tasche.",
    "preferred": "このかばんはいくらですか。",
    "alternative": "これかばんはいくらですか。",
    "why": "この muss unmittelbar vor einem Nomen stehen; これ ist selbstständig.",
    "focus": "form"
  },
  {
    "id": "p31-contrast-13",
    "unitId": "p25:appointment",
    "situation": "Du möchtest einen Alternativtermin anbieten.",
    "preferred": "金曜日はどうですか。",
    "alternative": "金曜日に行きました。",
    "why": "はどうですか schlägt einen Termin vor; ました berichtet Vergangenes.",
    "focus": "meaning"
  },
  {
    "id": "p31-contrast-14",
    "unitId": "p25:lostfound",
    "situation": "Du meldest einen bereits verlorenen Schirm.",
    "preferred": "黒い傘をなくしました。",
    "alternative": "黒い傘をなくします。",
    "why": "Vergangener Verlust verlangt in diesem Kontext ました.",
    "focus": "time"
  },
  {
    "id": "p31-contrast-15",
    "unitId": "p26:station-to-campus",
    "situation": "Die Universität ist das Ziel deiner Bewegung.",
    "preferred": "大学に行きます。",
    "alternative": "大学で行きます。",
    "why": "に steht für das Bewegungsziel, で für Handlungsort oder Verkehrsmittel.",
    "focus": "particle"
  },
  {
    "id": "p31-contrast-16",
    "unitId": "p26:library-project",
    "situation": "Du vereinbarst ein gemeinsames Lernen höflich.",
    "preferred": "一緒に勉強しませんか。",
    "alternative": "一緒に勉強しろ。",
    "why": "ませんか ist eine höfliche Einladung; しろ ist ein direkter Imperativ.",
    "focus": "register"
  },
  {
    "id": "p31-contrast-17",
    "unitId": "p26:cafe-conversation",
    "situation": "Du korrigierst die Bestellung auf genau einen Kuchen.",
    "preferred": "すみません、一つだけです。",
    "alternative": "はい、二つです。",
    "why": "だけ beschränkt die Menge auf einen; die andere Antwort bestätigt zwei.",
    "focus": "meaning"
  },
  {
    "id": "p31-contrast-18",
    "unitId": "p26:weekend-switch",
    "situation": "Du lehnst Samstag mit einer begründeten Alternative ab.",
    "preferred": "土曜日は予定があります。日曜日はどうですか。",
    "alternative": "土曜日は無理。",
    "why": "Begründung mit Ersatzvorschlag wirkt gegenüber neuen Bekannten höflicher als eine knappe Absage.",
    "focus": "register"
  }
];
export const p31ContrastPrompts:StudyPrompt[]=p31Contrasts.map(c=>({
  id:c.id,primaryTarget:{kind:"can_do",id:"p31:contrast:"+c.unitId},
  skill:"form_selection",cueFamily:"p31-contextual-choice-"+c.id,
  promptType:"choice",instruction:"Wähle im genannten Kontext die passendere Form",
  prompt:c.situation,choices:[c.preferred,c.alternative],
  acceptedAnswers:[c.preferred],displayAnswer:c.preferred,
  explanation:c.why,
  contextId:"p31:unit:"+c.unitId,answerNormalization:"japanese",
  sourceId:"thiepn-original",contentVersion:"p31-1",
  eventMetadata:{p31:true,unitId:c.unitId,kind:"contextual-contrast",focus:c.focus,contrastId:c.id}
}));
export function p31ContrastForUnit(unitId:string):P31Contrast|undefined{
  return p31Contrasts.find(c=>c.unitId===unitId);
}
