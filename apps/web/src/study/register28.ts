import type {StudyPrompt} from "@thiepn/study-player";
/** Original pragmatic contrasts, scoped to real learner situations rather than abstract politeness grading. */
interface RegisterCase{
  id:string;units:readonly string[];context:string;best:string;
  alternatives:readonly string[];reason:string;
}
export const register28Cases:readonly RegisterCase[]=[
  {
    "id": "teacher-morning",
    "units": [
      "p23:greetings",
      "p23:introduction"
    ],
    "context": "8 Uhr. Du triffst zum ersten Mal eine Lehrerin. Welche Begrüßung ist für die Situation am passendsten?",
    "best": "おはようございます。",
    "alternatives": [
      "おはよう。",
      "おやすみなさい。"
    ],
    "reason": "ございます kennzeichnet eine höfliche Begrüßung. おはよう ist unter Nahestehenden normal, aber für die erste Begegnung weniger passend."
  },
  {
    "id": "friend-morning",
    "units": [
      "p23:greetings",
      "p26:weekend-switch"
    ],
    "context": "Ein enger Freund sagt morgens おはよう. Du möchtest in derselben lockeren Sprechweise antworten.",
    "best": "おはよう。",
    "alternatives": [
      "おはようございます、先生。",
      "いただきます。"
    ],
    "reason": "Unter engen Freunden ist おはよう häufig natürlich. Die höfliche Form wäre nicht grundsätzlich ungrammatisch, passt aber weniger zum angefragten Ton."
  },
  {
    "id": "asking-stranger",
    "units": [
      "p25:directions",
      "p26:station-to-campus",
      "p23:places"
    ],
    "context": "Du möchtest auf der Straße eine unbekannte Person nach dem Bahnhof fragen. Wähle die höfliche Frage.",
    "best": "すみません、駅はどこですか。",
    "alternatives": [
      "駅、どこ？",
      "駅に行け。"
    ],
    "reason": "すみません eröffnet eine höfliche Kontaktaufnahme; ですか macht die Frage höflich."
  },
  {
    "id": "cafe-order-polite",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "context": "Du sprichst im Café mit dem Personal. Welche Bestellung wirkt höflich und klar?",
    "best": "コーヒーを一つください。",
    "alternatives": [
      "コーヒー、早く。",
      "コーヒーを飲め。"
    ],
    "reason": "を一つください benennt Gegenstand und Anzahl und formuliert die Bestellung höflich."
  },
  {
    "id": "cafe-correction",
    "units": [
      "p26:cafe-conversation",
      "p25:shopping"
    ],
    "context": "Im Café wurden zwei Kuchen statt einem verstanden. Wie korrigierst du das Personal höflich?",
    "best": "すみません、ケーキは一つだけです。",
    "alternatives": [
      "違う、二つだよ。",
      "もう一つください。"
    ],
    "reason": "すみません leitet die Korrektur höflich ein, だけ begrenzt die Menge auf eins."
  },
  {
    "id": "library-permission",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "context": "Du sprichst mit Personal am Bibliotheksschalter und möchtest ein Buch ausleihen. Welche Form fragt um Erlaubnis?",
    "best": "この本を借りてもいいですか。",
    "alternatives": [
      "この本を借りたいです。",
      "この本を読め。"
    ],
    "reason": "〜てもいいですか erfragt ausdrücklich Erlaubnis. 〜たいです sagt lediglich, dass du es möchtest."
  },
  {
    "id": "borrowing-peer",
    "units": [
      "p23:ownership",
      "p25:library"
    ],
    "context": "Du kennst die Person kaum und möchtest ihr Buch kurz ansehen. Welche Bitte ist höflich?",
    "best": "すみません、この本を見てもいいですか。",
    "alternatives": [
      "見せろ。",
      "本が好きだよ。"
    ],
    "reason": "Die Erlaubnisfrage mit 〜てもいいですか vermeidet einen direkten Befehl."
  },
  {
    "id": "request-repeat",
    "units": [
      "p23:introduction",
      "p25:transport",
      "p26:library-project"
    ],
    "context": "Du hast eine Auskunft einer unbekannten Person nicht verstanden. Bitte höflich um Wiederholung.",
    "best": "すみません、もう一度お願いします。",
    "alternatives": [
      "何？",
      "もう一度言え。"
    ],
    "reason": "Die höfliche Bitte ist situationsangemessen; die anderen Formen sind je nach Beziehung sehr direkt oder grob."
  },
  {
    "id": "appointment-decline",
    "units": [
      "p23:plans",
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "context": "Du musst eine Einladung einer neuen Tandempartnerin für Samstag höflich ablehnen und einen Alternativtermin anbieten.",
    "best": "すみません、土曜日は予定があります。日曜日はどうですか。",
    "alternatives": [
      "土曜日はだめ。",
      "土曜日に行きましょう。"
    ],
    "reason": "Die Formulierung nennt einen Grund und ein Alternativangebot, ohne die Einladung hart abzuwürgen."
  },
  {
    "id": "invitation-peer",
    "units": [
      "p23:plans",
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "context": "Du möchtest eine neue Kursbekanntschaft höflich zum gemeinsamen Lernen einladen.",
    "best": "一緒に勉強しませんか。",
    "alternatives": [
      "一緒に勉強しろ。",
      "勉強した。"
    ],
    "reason": "〜ませんか ist eine Einladung, ein Imperativ dagegen ein Befehl. 〜した berichtet Vergangenes."
  },
  {
    "id": "lost-property-report",
    "units": [
      "p25:lostfound",
      "p23:ownership"
    ],
    "context": "Du meldest am Fundbüro den Verlust eines Regenschirms. Welche Einleitung ist höflich und relevant?",
    "best": "すみません、黒い傘をなくしました。",
    "alternatives": [
      "黒い傘、どこだよ。",
      "ケーキを一つください。"
    ],
    "reason": "Entschuldigung und höfliche Vergangenheit beschreiben das Problem ohne groben Ton."
  },
  {
    "id": "customer-thanks",
    "units": [
      "p25:shopping",
      "p26:cafe-conversation"
    ],
    "context": "Der Verkäufer hat dir geholfen und du gehst. Welcher Abschluss ist höflich?",
    "best": "ありがとうございました。",
    "alternatives": [
      "ありがとうな。",
      "おやすみなさい。"
    ],
    "reason": "Die höfliche Dankformel passt zur abgeschlossenen Hilfeleistung. Unter Freunden sind lockere Formen normal."
  }
];
export const register28Prompts:StudyPrompt[]=register28Cases.map(c=>({
  id:"p28-register-"+c.id,
  primaryTarget:{kind:"can_do",id:"p28:register:"+c.id},
  skill:"form_selection",cueFamily:"p28-pragmatics-"+c.id,promptType:"choice",
  instruction:"Höflichkeit und Register im konkreten Zusammenhang",
  prompt:c.context,choices:[c.best,...c.alternatives],
  acceptedAnswers:[c.best],displayAnswer:c.best,
  explanation:c.reason,answerNormalization:"japanese",
  contextId:"p28:register:"+c.id,sourceId:"thiepn-original",contentVersion:"p28-1",
  eventMetadata:{p28:true,kind:"register-contrast",registerId:c.id,unitIds:[...c.units]}
}));
export function registerForUnit(unitId:string):StudyPrompt[]{
  return register28Prompts.filter(p=>{
    const ids=p.eventMetadata?.unitIds;
    return Array.isArray(ids)&&ids.includes(unitId);
  });
}
