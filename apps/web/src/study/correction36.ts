import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p37CorrectionAccepted} from "./correction37";
export interface P36Correction {
  id:string;scenarioId:string;
  focus:"particle"|"register"|"function"|"time";
  situation:string;startingSentence:string;model:string;explanation:string;
}
/** First-party correction tasks, each restricted to a stated communicative context. */
export const p36Corrections:readonly P36Correction[]=[
  {
    "id": "p36-correction-01",
    "scenarioId": "station-questions",
    "focus": "particle",
    "situation": "Anfahrt zur Universität: Verkehrsmittel und Ziel unterscheiden.",
    "startingSentence": "バスに大学で行きます。",
    "model": "バスで大学に行きます。",
    "explanation": "で bezeichnet das Verkehrsmittel, に das Bewegungsziel."
  },
  {
    "id": "p36-correction-02",
    "scenarioId": "station-questions",
    "focus": "register",
    "situation": "Einen fremden Fahrgast höflich nach seinem Ziel fragen.",
    "startingSentence": "大学、どこ？",
    "model": "大学はどこですか。",
    "explanation": "はどこですか ist eine höfliche Ortsfrage; die knappe Version wirkt informell."
  },
  {
    "id": "p36-correction-03",
    "scenarioId": "library-study",
    "focus": "particle",
    "situation": "In der Bibliothek lernen: Handlungsort kennzeichnen.",
    "startingSentence": "図書館に勉強します。",
    "model": "図書館で勉強します。",
    "explanation": "Bei 勉強します steht で für den Ort der Tätigkeit."
  },
  {
    "id": "p36-correction-04",
    "scenarioId": "library-study",
    "focus": "function",
    "situation": "Das Bibliothekspersonal um Ausleiherlaubnis fragen, nicht bloß einen Wunsch nennen.",
    "startingSentence": "この本を借りたいです。",
    "model": "この本を借りてもいいですか。",
    "explanation": "たいです nennt einen Wunsch; てもいいですか erfragt die Erlaubnis."
  },
  {
    "id": "p36-correction-05",
    "scenarioId": "cafe-fix",
    "focus": "particle",
    "situation": "Im Café einen Kaffee bestellen: das Bestellte markieren.",
    "startingSentence": "コーヒーに一つください。",
    "model": "コーヒーを一つください。",
    "explanation": "を markiert den Gegenstand einer Bestellung mit ください."
  },
  {
    "id": "p36-correction-06",
    "scenarioId": "cafe-fix",
    "focus": "register",
    "situation": "Als Servicekraft die Bestellung höflich bestätigen.",
    "startingSentence": "コーヒー二つ？",
    "model": "コーヒーは二つでよろしいですか。",
    "explanation": "でよろしいですか ist im Servicekontakt eine höfliche Bestätigung."
  },
  {
    "id": "p36-correction-07",
    "scenarioId": "appointment-shift",
    "focus": "particle",
    "situation": "Ein Treffen am Freitag verabreden: Wochentag markieren.",
    "startingSentence": "金曜日で会いましょう。",
    "model": "金曜日に会いましょう。",
    "explanation": "に markiert in dieser Aussage den konkreten Termin."
  },
  {
    "id": "p36-correction-08",
    "scenarioId": "appointment-shift",
    "focus": "register",
    "situation": "Eine neue Bekanntschaft höflich über Samstag informieren.",
    "startingSentence": "土曜無理。",
    "model": "すみません、土曜日は予定があります。",
    "explanation": "Die Begründung und すみません machen die Absage im Erstkontakt höflicher."
  },
  {
    "id": "p36-correction-09",
    "scenarioId": "umbrella-owner",
    "focus": "particle",
    "situation": "Den Verlustort in einem Fundbüro benennen.",
    "startingSentence": "駅に傘をなくしました。",
    "model": "駅で傘をなくしました。",
    "explanation": "で bezeichnet den Ort der Handlung なくす."
  },
  {
    "id": "p36-correction-10",
    "scenarioId": "umbrella-owner",
    "focus": "time",
    "situation": "Einen vergangenen Verlust gegenüber dem Personal schildern.",
    "startingSentence": "傘をなくします。",
    "model": "傘をなくしました。",
    "explanation": "ました markiert das bereits abgeschlossene Verlieren."
  },
  {
    "id": "p36-correction-11",
    "scenarioId": "shop-colors",
    "focus": "particle",
    "situation": "Beim Einkauf den Preis dieser Tasche erfragen.",
    "startingSentence": "このかばんをいくらですか。",
    "model": "このかばんはいくらですか。",
    "explanation": "は markiert die Tasche als Thema der Preisfrage."
  },
  {
    "id": "p36-correction-12",
    "scenarioId": "shop-colors",
    "focus": "register",
    "situation": "Einen Verkäufer höflich nach einer kleineren Größe fragen.",
    "startingSentence": "小さいのある？",
    "model": "もう少し小さいのはありますか。",
    "explanation": "ありますか bildet die höfliche Existenzfrage; もう少し macht die Größenänderung genauer."
  },
  {
    "id": "p36-correction-13",
    "scenarioId": "campus-greeting",
    "focus": "register",
    "situation": "Sich einer Lehrkraft höflich als Student vorstellen.",
    "startingSentence": "私は学生だ。",
    "model": "私は学生です。",
    "explanation": "です ist eine passende höfliche nominale Satzendung; だ ist informell."
  },
  {
    "id": "p36-correction-14",
    "scenarioId": "campus-greeting",
    "focus": "particle",
    "situation": "Sagen, an welchem Ort man lernt.",
    "startingSentence": "学校に勉強しています。",
    "model": "学校で勉強しています。",
    "explanation": "で steht hier am Ort der laufenden Tätigkeit."
  },
  {
    "id": "p36-correction-15",
    "scenarioId": "weekend-invite",
    "focus": "function",
    "situation": "Einen Alternativtermin am Sonntag vorschlagen.",
    "startingSentence": "日曜日にどうですか。",
    "model": "日曜日はどうですか。",
    "explanation": "は macht den Sonntag zum Thema des Vorschlags, statt に bei einer Orts-/Zeitangabe zu verwenden."
  },
  {
    "id": "p36-correction-16",
    "scenarioId": "weekend-invite",
    "focus": "register",
    "situation": "Eine Samstagseinladung höflich ablehnen und Sonntag anbieten.",
    "startingSentence": "土曜日は無理。",
    "model": "すみません、土曜日は予定があります。日曜日はどうですか。",
    "explanation": "Eine sanfte Absage mit Grund und Alternativvorschlag führt das Gespräch weiter."
  }
];
const sourceUnits:Record<string,string>={
  "station-questions": "p26:station-to-campus",
  "library-study": "p26:library-project",
  "cafe-fix": "p26:cafe-conversation",
  "appointment-shift": "p25:appointment",
  "umbrella-owner": "p25:lostfound",
  "shop-colors": "p25:shopping",
  "campus-greeting": "p23:introduction",
  "weekend-invite": "p26:weekend-switch"
};
export const p36CorrectionPrompts:StudyPrompt[]=p36Corrections.map(c=>({
  id:c.id,
  primaryTarget:{kind:"can_do",id:"p36:correct:"+c.scenarioId},
  skill:"production",cueFamily:"p36-reformulate-"+c.id,
  promptType:"typed",instruction:"Formuliere den Ausgangssatz für die gegebene Situation neu",
  prompt:c.situation+"\nAusgangssatz: "+c.startingSentence,
  acceptedAnswers:p37CorrectionAccepted(c.id,c.model),displayAnswer:c.model,
  explanation:c.explanation,
  contextId:"p36:unit:"+sourceUnits[c.scenarioId],
  answerNormalization:"japanese",sourceId:"thiepn-original",contentVersion:"p36-1",
  eventMetadata:{p36:true,kind:"reformulation",unitId:sourceUnits[c.scenarioId],
    scenarioId:c.scenarioId,focus:c.focus,taskId:c.id}
}));
export function p36CorrectionsForScenario(id:string):P36Correction[]{
 return p36Corrections.filter(c=>c.scenarioId===id);
}
export function p36CorrectionRecognized(c:P36Correction,typed:string):boolean{
 return p37CorrectionAccepted(c.id,c.model).includes(normalizeP26(typed));
}
