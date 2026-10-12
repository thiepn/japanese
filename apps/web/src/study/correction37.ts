import {normalizeP26} from "./pedagogy26";
/** Alternative independent Japanese phrasings preserving the task's given context.
 * The source StudyPrompt id and cueFamily remain unchanged. */
export interface P37CorrectionAlternative{
  correctionId:string;answer:string;nuance:string;
}
export const p37CorrectionAlternatives:readonly P37CorrectionAlternative[]=[
  {
    "correctionId": "p36-correction-01",
    "answer": "大学にバスで行きます。",
    "nuance": "Das Verkehrsmittel バスで und das Ziel 大学に können umgestellt werden."
  },
  {
    "correctionId": "p36-correction-02",
    "answer": "すみません、大学はどこですか。",
    "nuance": "Die höfliche Ortsfrage beginnt mit einer Entschuldigung als Anrede."
  },
  {
    "correctionId": "p36-correction-03",
    "answer": "私は図書館で勉強します。",
    "nuance": "Das Thema 私は wird ergänzt; der Handlungsort bleibt mit で markiert."
  },
  {
    "correctionId": "p36-correction-04",
    "answer": "すみません、この本を借りてもいいですか。",
    "nuance": "すみません macht die Erlaubnisfrage an das Bibliothekspersonal höflicher."
  },
  {
    "correctionId": "p36-correction-05",
    "answer": "コーヒーを一つお願いします。",
    "nuance": "お願いします ist eine andere höfliche Bitte beim Bestellen."
  },
  {
    "correctionId": "p36-correction-06",
    "answer": "すみません、コーヒーは二つでよろしいですか。",
    "nuance": "Eine höfliche Rückversicherung mit entschuldigender Einleitung."
  },
  {
    "correctionId": "p36-correction-07",
    "answer": "金曜日に会いませんか。",
    "nuance": "Eine höfliche Einladung für Freitag; weniger festlegend als ましょう."
  },
  {
    "correctionId": "p36-correction-08",
    "answer": "すみません、土曜日はちょっと難しいです。",
    "nuance": "Eine zurückhaltende höfliche Absage mit ちょっと難しいです."
  },
  {
    "correctionId": "p36-correction-09",
    "answer": "私は駅で傘をなくしました。",
    "nuance": "Das Thema 私は wird ausdrücklich genannt; 駅で bleibt der Verlustort."
  },
  {
    "correctionId": "p36-correction-10",
    "answer": "私は傘をなくしました。",
    "nuance": "Die Person wird als Thema genannt, ました bleibt Vergangenheit."
  },
  {
    "correctionId": "p36-correction-11",
    "answer": "すみません、このかばんはいくらですか。",
    "nuance": "Die höfliche Preisfrage wird mit すみません eingeleitet."
  },
  {
    "correctionId": "p36-correction-12",
    "answer": "もう少し小さいサイズはありますか。",
    "nuance": "サイズ benennt die Größe ausdrücklich; die Frage bleibt höflich."
  },
  {
    "correctionId": "p36-correction-13",
    "answer": "学生です。よろしくお願いします。",
    "nuance": "Eine knappe höfliche Selbstvorstellung mit Abschlussformel."
  },
  {
    "correctionId": "p36-correction-14",
    "answer": "私は学校で勉強しています。",
    "nuance": "Das Thema 私は wird genannt; で bleibt beim Lernort."
  },
  {
    "correctionId": "p36-correction-15",
    "answer": "では、日曜日はどうでしょうか。",
    "nuance": "どうでしょうか ist ein zurückhaltender, etwas höflicherer Vorschlag."
  },
  {
    "correctionId": "p36-correction-16",
    "answer": "すみません、土曜日はちょっと難しいです。日曜日はどうでしょうか。",
    "nuance": "Höfliche indirekte Absage mit zurückhaltendem Alternativvorschlag."
  }
];
export function p37CorrectionAlternativesFor(id:string):P37CorrectionAlternative[]{
  return p37CorrectionAlternatives.filter(a=>a.correctionId===id);
}
export function p37CorrectionAccepted(correctionId:string,base:string):string[]{
  return [...new Set([base,...p37CorrectionAlternativesFor(correctionId).map(a=>a.answer)].map(normalizeP26))];
}
