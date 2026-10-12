import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";

/** Original independent production tasks. Never infer Japanese proficiency from a template match alone. */
export interface P30Transformation {
  id:string;unitId:string;context:string;startingSentence:string;model:string;
  alternatives:readonly string[];explanation:string;
  focus:"particle"|"form"|"register"|"time"|"meaning";
}
export const p30Transformations:readonly P30Transformation[]=[
  {
    "id": "transform-01",
    "unitId": "p23:greetings",
    "context": "Lehrkraft am Morgen ansprechen",
    "startingSentence": "おはよう。",
    "model": "おはようございます。",
    "alternatives": [
      "先生、おはようございます。"
    ],
    "explanation": "Die höfliche Morgenform ist beim Erstkontakt mit Lehrkräften gewöhnlich passender.",
    "focus": "register"
  },
  {
    "id": "transform-02",
    "unitId": "p23:introduction",
    "context": "Sich höflich als Student vorstellen",
    "startingSentence": "私は学生だ。",
    "model": "私は学生です。",
    "alternatives": [],
    "explanation": "Bei einer höflichen Nominalaussage schließt です den Satz ab.",
    "focus": "form"
  },
  {
    "id": "transform-03",
    "unitId": "p23:ownership",
    "context": "Besitz höflich erklären",
    "startingSentence": "これは私の本だ。",
    "model": "これは私の本です。",
    "alternatives": [],
    "explanation": "の verbindet Besitz, です markiert höfliche Aussage.",
    "focus": "form"
  },
  {
    "id": "transform-04",
    "unitId": "p23:places",
    "context": "Ort einer Tätigkeit korrigieren",
    "startingSentence": "図書館に勉強します。",
    "model": "図書館で勉強します。",
    "alternatives": [],
    "explanation": "Bei 勉強します benennt で den Handlungsort, nicht に.",
    "focus": "particle"
  },
  {
    "id": "transform-05",
    "unitId": "p23:routine",
    "context": "Eine Routine höflich ausdrücken",
    "startingSentence": "毎日日本語を勉強する。",
    "model": "毎日日本語を勉強します。",
    "alternatives": [],
    "explanation": "Die ます-Form ist die neutrale höfliche Aussage.",
    "focus": "register"
  },
  {
    "id": "transform-06",
    "unitId": "p23:cafe",
    "context": "Im Café höflich bestellen",
    "startingSentence": "お茶一つ。",
    "model": "お茶を一つください。",
    "alternatives": [
      "すみません、お茶を一つください。"
    ],
    "explanation": "をください formuliert eine Bitte mit klarer Menge; すみません kann höflich einleiten.",
    "focus": "register"
  },
  {
    "id": "transform-07",
    "unitId": "p23:plans",
    "context": "Eine lockere Einladung höflich formulieren",
    "startingSentence": "土曜日、一緒に行く？",
    "model": "土曜日、一緒に行きませんか。",
    "alternatives": [],
    "explanation": "ませんか ist eine höfliche Einladung, nicht bloß eine Verneinung.",
    "focus": "register"
  },
  {
    "id": "transform-08",
    "unitId": "p23:past",
    "context": "Einen vergangenen Kinobesuch berichtigen",
    "startingSentence": "昨日、映画を見ます。",
    "model": "昨日、映画を見ました。",
    "alternatives": [],
    "explanation": "Bei einer abgeschlossenen gestrigen Handlung steht die ました-Form.",
    "focus": "time"
  },
  {
    "id": "transform-09",
    "unitId": "p25:directions",
    "context": "Einen unbekannten Passanten nach dem Bahnhof fragen",
    "startingSentence": "駅、どこ？",
    "model": "すみません、駅はどこですか。",
    "alternatives": [
      "駅はどこですか。"
    ],
    "explanation": "Die längere Form mit すみません ist beim Ansprechen Fremder besonders höflich.",
    "focus": "register"
  },
  {
    "id": "transform-10",
    "unitId": "p25:transport",
    "context": "Eine höfliche Fahrplanauskunft erfragen",
    "startingSentence": "電車、何時に出る？",
    "model": "電車は何時に出ますか。",
    "alternatives": [],
    "explanation": "Die konkrete Uhrzeit fragt mit 何時に, das höfliche Verb mit ますか.",
    "focus": "form"
  },
  {
    "id": "transform-11",
    "unitId": "p25:library",
    "context": "Aus einem Wunsch eine Erlaubnisfrage machen",
    "startingSentence": "この本を借りたいです。",
    "model": "この本を借りてもいいですか。",
    "alternatives": [],
    "explanation": "たいです beschreibt einen Wunsch; てもいいですか bittet um Erlaubnis.",
    "focus": "meaning"
  },
  {
    "id": "transform-12",
    "unitId": "p25:shopping",
    "context": "Den Preis höflich erfragen",
    "startingSentence": "かばん、いくら？",
    "model": "このかばんはいくらですか。",
    "alternatives": [],
    "explanation": "この bestimmt かばん; は markiert das Thema und ですか die höfliche Frage.",
    "focus": "form"
  },
  {
    "id": "transform-13",
    "unitId": "p25:appointment",
    "context": "Einen Vorschlag höflicher machen",
    "startingSentence": "金曜どう？",
    "model": "金曜日はどうですか。",
    "alternatives": [],
    "explanation": "はどうですか formuliert eine neutrale höfliche Terminanfrage.",
    "focus": "register"
  },
  {
    "id": "transform-14",
    "unitId": "p25:lostfound",
    "context": "Im Fundbüro einen Verlust beschreiben",
    "startingSentence": "傘なくした。",
    "model": "すみません、傘をなくしました。",
    "alternatives": [],
    "explanation": "を markiert den verlorenen Gegenstand, ました die höfliche Vergangenheit.",
    "focus": "time"
  },
  {
    "id": "transform-15",
    "unitId": "p26:station-to-campus",
    "context": "Ziel und Handlungsort unterscheiden",
    "startingSentence": "大学で行きます。",
    "model": "大学に行きます。",
    "alternatives": [
      "大学へ行きます。"
    ],
    "explanation": "Mit 行きます wird ein Bewegungsziel in diesem Satz mit に oder へ markiert.",
    "focus": "particle"
  },
  {
    "id": "transform-16",
    "unitId": "p26:library-project",
    "context": "Eine Studienverabredung höflich anbieten",
    "startingSentence": "一緒に勉強しない？",
    "model": "一緒に勉強しませんか。",
    "alternatives": [],
    "explanation": "Die Einladung mit ませんか ist höflicher als die lockere Form ない？.",
    "focus": "register"
  },
  {
    "id": "transform-17",
    "unitId": "p26:cafe-conversation",
    "context": "Eine falsch verstandene Menge berichtigen",
    "startingSentence": "ケーキは二つです。",
    "model": "すみません、ケーキは一つだけです。",
    "alternatives": [
      "ケーキは一つだけです。"
    ],
    "explanation": "Eine Korrektur mit すみません ist höflich, だけ schränkt die Menge auf eins ein.",
    "focus": "meaning"
  },
  {
    "id": "transform-18",
    "unitId": "p26:weekend-switch",
    "context": "Eine Absage mit Alternative höflich machen",
    "startingSentence": "土曜日は無理。",
    "model": "すみません、土曜日は予定があります。日曜日はどうですか。",
    "alternatives": [],
    "explanation": "Absage, nachvollziehbarer Grund und alternative Einladung bilden eine höfliche Gesprächsreparatur.",
    "focus": "register"
  }
];
export const p30TransformationPrompts:StudyPrompt[]=p30Transformations.map(t=>({
  id:"p30-transform-"+t.id,
  primaryTarget:{kind:"can_do",id:"p30:transformation:"+t.unitId},
  skill:"production",cueFamily:"p30-reformulate-"+t.id,
  promptType:"typed",instruction:"Ändere den Satz für das genannte Gesprächsziel",
  prompt:t.context+"\nAusgangssatz: "+t.startingSentence,
  acceptedAnswers:[t.model,...t.alternatives].map(normalizeP26),displayAnswer:t.model,
  explanation:t.explanation,contextId:"p30:unit:"+t.unitId,
  answerNormalization:"japanese",sourceId:"thiepn-original",contentVersion:"p30-1",
  eventMetadata:{p30:true,kind:"reformulation",focus:t.focus,unitId:t.unitId,taskId:t.id}
}));
export function transformationForUnit(id:string):P30Transformation|undefined{
  return p30Transformations.find(t=>t.unitId===id);
}
export function inspectTransformation(t:P30Transformation,response:string):{known:boolean;remarks:string[]}{
  const normalized=normalizeP26(response);
  const model=normalizeP26(t.model);
  const known=[t.model,...t.alternatives].some(form=>normalizeP26(form)===normalized);
  const focus:Record<P30Transformation["focus"],string>={
    particle:"Achte bei に／へ auf ein Bewegungsziel, bei で auf Ort oder Mittel, bei を auf ein Objekt.",
    form:"Achte darauf, ob Nomen mit です, Verben mit ます und höfliche Fragen mit か gebildet sind.",
    register:"Überlege, mit wem du sprichst: fremdes Personal, Lehrkraft oder enger Freund.",
    time:"Stimmen Zeitangabe und Vergangenheitsform zusammen? ました berichtet Vergangenes.",
    meaning:"Wunsch (たい), Erlaubnis (てもいいですか), Menge (だけ) und höfliche Korrektur ändern die Absicht."
  };
  const observations:string[]=[focus[t.focus]];
  if(t.focus==="particle"){
    for(const particle of ["に","へ","で","を"]){
      if(model.includes(particle)&&!normalized.includes(particle))
        observations.push("Im Modell kommt "+particle+" vor. Prüfe seine Rolle in deinem Satz.");
    }
  }
  if(t.focus==="time"&&model.includes("ました")&&!normalized.includes("ました"))
    observations.push("Das Modell berichtet mit ました über eine abgeschlossene Handlung.");
  if(t.focus==="register"&&/です|ます|ください/.test(model)&&
      !/です|ます|ください/.test(normalized))
    observations.push("Im Modell erscheint eine höfliche Endung beziehungsweise Bitte.");
  if(t.focus==="meaning"&&model.includes("てもいいですか")&&!normalized.includes("てもいいですか"))
    observations.push("Die Bitte um Erlaubnis ist nicht dasselbe wie die Aussage, dass man etwas möchte.");
  return {known,remarks:[
    t.explanation,...observations,
    known?"Eine ausdrücklich hinterlegte Zielform getroffen, aber keine umfassende Sprachbewertung.":
      "Eine andere sprachlich richtige Antwort ist möglich und bleibt ohne automatische Negativwertung."
  ]};
}
