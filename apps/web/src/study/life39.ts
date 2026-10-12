import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";

/** Original A1/A2 real-life intentions. Distractors are explained only within
 * each authored scenario, not labelled universally ungrammatical. */
export interface P39LifeCase {
  id:string;unitIds:readonly string[];title:string;situation:string;
  model:string;alternative:string;rule:string;
  distractors:readonly {form:string;why:string}[];
}
export const p39LifeCases:readonly P39LifeCase[]=[
  {
    "id": "p39-life-01",
    "unitIds": [
      "p23:greetings",
      "p23:introduction"
    ],
    "title": "Höfliche Vorstellung",
    "situation": "Du stellst dich einer neuen Lehrkraft als Austauschstudent vor.",
    "model": "はじめまして。私は留学生です。よろしくお願いします。",
    "alternative": "はじめまして。留学生です。よろしくお願いします。",
    "distractors": [
      {
        "form": "よろしく。私は留学生だ。",
        "why": "Die Kurzformen und だ sind im freundschaftlichen Kontakt möglich, wirken hier aber weniger förmlich."
      },
      {
        "form": "おはようございます。",
        "why": "Der Gruß alleine erfüllt die gefragte Selbstvorstellung nicht."
      }
    ],
    "rule": "Im Erstkontakt sind はじめまして, です und よろしくお願いします passend."
  },
  {
    "id": "p39-life-02",
    "unitIds": [
      "p23:ownership",
      "p25:lostfound"
    ],
    "title": "Besitz im Fundbüro",
    "situation": "Die Mitarbeiterin zeigt dir einen Schirm. Sage, dass dieser Schirm dir gehört.",
    "model": "この傘は私のです。",
    "alternative": "これは私の傘です。",
    "distractors": [
      {
        "form": "この傘が私をです。",
        "why": "Die Partikelfolge が…を kann diese Besitzzuordnung nicht ausdrücken."
      },
      {
        "form": "この傘を私のです。",
        "why": "を kennzeichnet nicht das Thema dieser Besitzangabe; hier passt は."
      }
    ],
    "rule": "この傘は私のです weist das Exemplar zu; これは私の傘です identifiziert den Gegenstand."
  },
  {
    "id": "p39-life-03",
    "unitIds": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "Mit dem Bus zum Campus",
    "situation": "Du fährst mit dem Bus zur Universität.",
    "model": "バスで大学に行きます。",
    "alternative": "大学へバスで行きます。",
    "distractors": [
      {
        "form": "バスに大学で行きます。",
        "why": "に und で sind vertauscht: Verkehrsmittel mit で, Ziel mit に oder へ."
      },
      {
        "form": "バスを大学へ行きます。",
        "why": "Mit 行く bezeichnet を hier kein Verkehrsmittel; benutze バスで."
      }
    ],
    "rule": "交通手段には で、行き先には に／へ."
  },
  {
    "id": "p39-life-04",
    "unitIds": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "Erlaubnis zum Fotografieren",
    "situation": "Frage eine Bibliotheksmitarbeiterin, ob du hier fotografieren darfst.",
    "model": "ここで写真を撮ってもいいですか。",
    "alternative": "ここで写真を撮っても大丈夫ですか。",
    "distractors": [
      {
        "form": "ここで写真を撮りたいです。",
        "why": "たい sagt, dass du fotografieren möchtest; eine Erlaubnis wird nicht erfragt."
      },
      {
        "form": "ここで写真を撮ってください。",
        "why": "てください fordert dein Gegenüber auf, Fotos zu machen; du fragst nach deiner Erlaubnis."
      }
    ],
    "rule": "てもいいですか erfragt die Erlaubnis für die eigene Handlung."
  },
  {
    "id": "p39-life-05",
    "unitIds": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "Kaffee ohne Milch",
    "situation": "Bestelle höflich genau einen Kaffee ohne Milch.",
    "model": "ミルクなしのコーヒーを一つお願いします。",
    "alternative": "コーヒーを一つ、ミルクなしでお願いします。",
    "distractors": [
      {
        "form": "ミルクのコーヒーを一つお願いします。",
        "why": "ミルクのコーヒー gibt die gewünschte Eigenschaft ohne Milch nicht wieder."
      },
      {
        "form": "ミルクなしのコーヒーが一つお願いします。",
        "why": "Bei der Bestellung mit お願いします kennzeichnet を das Bestellobjekt."
      }
    ],
    "rule": "なし drückt den Ausschluss aus; を bleibt am bestellten Gegenstand."
  },
  {
    "id": "p39-life-06",
    "unitIds": [
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "title": "Termin mit Gegenvorschlag",
    "situation": "Du kannst Samstag nicht. Schlage ausdrücklich Sonntag als neuen Termin vor.",
    "model": "土曜日は予定があります。日曜日はどうですか。",
    "alternative": "すみません、土曜日は予定があります。日曜日はどうですか。",
    "distractors": [
      {
        "form": "日曜日なら大丈夫です。",
        "why": "なら大丈夫です bestätigt eine Option; es stellt sie nicht ausdrücklich als Rückfrage."
      },
      {
        "form": "土曜日は予定があります。",
        "why": "Die Absage enthält noch keinen neuen Terminvorschlag."
      }
    ],
    "rule": "はどうですか eröffnet eine Alternative; すみません kann die Absage abschwächen."
  },
  {
    "id": "p39-life-07",
    "unitIds": [
      "p23:routine",
      "p25:appointment"
    ],
    "title": "Verabredung am Freitagnachmittag",
    "situation": "Schlage vor, sich am Freitag um 15 Uhr zu treffen.",
    "model": "金曜日の午後三時に会いましょう。",
    "alternative": "金曜日、午後三時に会いましょう。",
    "distractors": [
      {
        "form": "金曜日の午後三時で会いましょう。",
        "why": "Ein bestimmter Termin der Verabredung wird hier mit に bezeichnet."
      },
      {
        "form": "金曜日の午後三時に会いました。",
        "why": "会いました erzählt von einer vergangenen Begegnung, nicht von einem Vorschlag."
      }
    ],
    "rule": "ましょう schlägt gemeinsames Handeln vor; 三時に gibt die Uhrzeit an."
  },
  {
    "id": "p39-life-08",
    "unitIds": [
      "p23:past",
      "p25:lostfound"
    ],
    "title": "Vergangenen Verlust melden",
    "situation": "Du meldest, dass du gestern am Bahnhof dein Portemonnaie verloren hast.",
    "model": "昨日、駅で財布をなくしました。",
    "alternative": "昨日、駅で私の財布をなくしました。",
    "distractors": [
      {
        "form": "昨日、駅で財布をなくします。",
        "why": "なくします ist nicht die benötigte Vergangenheitsform für den abgeschlossenen Verlust."
      },
      {
        "form": "昨日、駅に財布をなくしました。",
        "why": "駅 ist der Ort des Verlusts; die Handlung geschieht 駅で."
      }
    ],
    "rule": "Gestern geschehen: なくしました. Handlungsort: 駅で."
  },
  {
    "id": "p39-life-09",
    "unitIds": [
      "p25:directions",
      "p26:station-to-campus"
    ],
    "title": "Wegstrecke korrekt schildern",
    "situation": "Du gehst vom Bahnhof bis zur Bibliothek.",
    "model": "駅から図書館まで歩いて行きます。",
    "alternative": "駅から図書館まで歩きます。",
    "distractors": [
      {
        "form": "図書館から駅まで歩いて行きます。",
        "why": "Dieser Satz kehrt Start und Ziel der gefragten Route um."
      },
      {
        "form": "駅で図書館に歩きます。",
        "why": "で markiert hier nicht den gefragten Ausgangspunkt und die Wegspanne."
      }
    ],
    "rule": "から kennzeichnet den Startpunkt; まで den Endpunkt."
  },
  {
    "id": "p39-life-10",
    "unitIds": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "Offene Museumseinladung",
    "situation": "Frage eine neue Bekanntschaft, ob sie Sonntag mit dir ins Museum gehen möchte.",
    "model": "日曜日に一緒に美術館に行きませんか。",
    "alternative": "日曜日、美術館に一緒に行きませんか。",
    "distractors": [
      {
        "form": "日曜日に一緒に美術館に行きましょう。",
        "why": "ましょう formuliert einen gemeinsamen Vorschlag, keine offene Ja/Nein-Einladung."
      },
      {
        "form": "日曜日に一緒に美術館に行きます。",
        "why": "Die Aussage beschreibt eine Absicht, sie erfragt keine Bereitschaft."
      }
    ],
    "rule": "ませんか eröffnet höflich eine Einladung mit echter Antwortmöglichkeit."
  },
  {
    "id": "p39-life-11",
    "unitIds": [
      "p23:ownership",
      "p25:shopping"
    ],
    "title": "Preis einer blauen Tasche",
    "situation": "Frage im Geschäft nach dem Preis dieser blauen Tasche.",
    "model": "この青いかばんはいくらですか。",
    "alternative": "すみません、この青いかばんはいくらですか。",
    "distractors": [
      {
        "form": "これ青いかばんはいくらですか。",
        "why": "これ steht selbstständig; direkt vor dem Nomen wird この verwendet."
      },
      {
        "form": "この青いかばんをいくらですか。",
        "why": "Die Preisfrage kennzeichnet das Thema normalerweise mit は."
      }
    ],
    "rule": "この + Nomen verweist auf den Gegenstand; はいくらですか fragt nach dem Preis."
  },
  {
    "id": "p39-life-12",
    "unitIds": [
      "p23:places",
      "p25:library"
    ],
    "title": "Gerade in der Bibliothek lernen",
    "situation": "Du erklärst, dass du gerade in der Bibliothek Japanisch lernst.",
    "model": "図書館で日本語を勉強しています。",
    "alternative": "日本語を図書館で勉強しています。",
    "distractors": [
      {
        "form": "図書館に日本語を勉強しています。",
        "why": "に ist hier keine passende Markierung für den Ort der Lerntätigkeit."
      },
      {
        "form": "図書館で日本語を勉強しました。",
        "why": "ました berichtet von einer abgeschlossenen Tätigkeit, nicht von einer aktuellen."
      }
    ],
    "rule": "Bei einer laufenden Tätigkeit kennzeichnet で den Ort und ています den Verlauf."
  },
  {
    "id": "p39-life-13",
    "unitIds": [
      "p23:plans",
      "p26:library-project"
    ],
    "title": "Gemeinsame Lernsession",
    "situation": "Lade einen Mitschüler höflich ein, morgen gemeinsam zu lernen.",
    "model": "明日、一緒に勉強しませんか。",
    "alternative": "明日、一緒に勉強しませんか？",
    "distractors": [
      {
        "form": "明日、一緒に勉強します。",
        "why": "Eine Aussage über den eigenen Plan ist noch keine Einladung."
      },
      {
        "form": "明日、一緒に勉強してください。",
        "why": "ください bittet die andere Person, etwas zu tun, statt offen gemeinsames Lernen anzubieten."
      }
    ],
    "rule": "一緒に + ませんか ist eine höfliche Einladung zu gemeinsamer Aktivität."
  },
  {
    "id": "p39-life-14",
    "unitIds": [
      "p23:routine",
      "p23:past"
    ],
    "title": "Hausaufgaben von gestern",
    "situation": "Du berichtest, dass du gestern Hausaufgaben gemacht hast.",
    "model": "昨日、宿題をしました。",
    "alternative": "昨日は宿題をしました。",
    "distractors": [
      {
        "form": "昨日、宿題をします。",
        "why": "Die Gegenwarts-/Zukunftsform stimmt nicht mit der beendeten Handlung gestern überein."
      },
      {
        "form": "昨日、宿題にしました。",
        "why": "宿題 ist das Objekt des Machens und steht mit を."
      }
    ],
    "rule": "Gestern abgeschlossen: しました; Hausaufgaben als Objekt: 宿題を."
  },
  {
    "id": "p39-life-15",
    "unitIds": [
      "p23:cafe",
      "p25:shopping"
    ],
    "title": "Preis eines gezeigten Artikels",
    "situation": "Du deutest auf einen Gegenstand und fragst höflich nach seinem Preis.",
    "model": "これはいくらですか。",
    "alternative": "すみません、これはいくらですか。",
    "distractors": [
      {
        "form": "このはいくらですか。",
        "why": "この muss direkt ein Nomen begleiten; これ kann allein stehen."
      },
      {
        "form": "これをいくらですか。",
        "why": "In einer normalen Preisfrage lautet der Rahmen これはいくらですか."
      }
    ],
    "rule": "これ ist ein eigenständiges Pronomen; この braucht ein folgendes Nomen."
  },
  {
    "id": "p39-life-16",
    "unitIds": [
      "p25:directions",
      "p25:library"
    ],
    "title": "Nach der Bibliothek fragen",
    "situation": "Du kennst die Lage der Bibliothek nicht und fragst fremdes Personal höflich.",
    "model": "すみません、図書館はどこですか。",
    "alternative": "図書館はどこですか。",
    "distractors": [
      {
        "form": "図書館でどこですか。",
        "why": "で kann die gefragte Ortsidentifikation mit どこですか nicht so markieren."
      },
      {
        "form": "図書館はここです。",
        "why": "Hier wird ein Ort angegeben statt danach gefragt."
      }
    ],
    "rule": "はどこですか ist eine höfliche Ortsfrage; すみません leitet sie passend ein."
  },
  {
    "id": "p39-life-17",
    "unitIds": [
      "p25:appointment",
      "p26:cafe-conversation"
    ],
    "title": "Eine fremde Person um Wiederholung bitten",
    "situation": "Das Personal spricht zu schnell. Bitte höflich um eine Wiederholung.",
    "model": "すみません、もう一度お願いします。",
    "alternative": "もう一度言っていただけますか。",
    "distractors": [
      {
        "form": "もう一度言え。",
        "why": "Der Imperativ 言え klingt gegenüber fremdem Personal sehr grob."
      },
      {
        "form": "もう一度言いたいです。",
        "why": "たい macht deinen Wunsch auszudrücken zum Thema; du bittest nicht dein Gegenüber."
      }
    ],
    "rule": "すみません + お願いします ist eine kurze höfliche Wiederholungsbitte."
  },
  {
    "id": "p39-life-18",
    "unitIds": [
      "p25:shopping",
      "p25:lostfound"
    ],
    "title": "Verlorene Tasche suchen",
    "situation": "Du sagst, dass du gerade deine schwarze Tasche suchst.",
    "model": "黒いかばんを探しています。",
    "alternative": "私の黒いかばんを探しています。",
    "distractors": [
      {
        "form": "黒いかばんが探しています。",
        "why": "が macht die Tasche fälschlich zum Suchenden; das gesuchte Objekt erhält を."
      },
      {
        "form": "黒いかばんを買いました。",
        "why": "買いました berichtet über einen Kauf, nicht über das Suchen."
      }
    ],
    "rule": "探しています beschreibt hier eine aktuelle Suche; を markiert das Gesuchte."
  },
  {
    "id": "p39-life-19",
    "unitIds": [
      "p23:ownership",
      "p26:library-project"
    ],
    "title": "Nach dem Besitzer eines Buches fragen",
    "situation": "Du fragst, ob dieses Buch der Lehrkraft gehört.",
    "model": "この本は先生のですか。",
    "alternative": "これは先生の本ですか。",
    "distractors": [
      {
        "form": "この本は先生ですか。",
        "why": "Die Form identifiziert das Buch fälschlich als die Person selbst."
      },
      {
        "form": "この本を先生のですか。",
        "why": "を passt nicht als Themenmarkierung zur Besitzfrage."
      }
    ],
    "rule": "先生の bezeichnet Zugehörigkeit; この本は…ですか fragt nach dem Besitzer."
  },
  {
    "id": "p39-life-20",
    "unitIds": [
      "p23:routine",
      "p25:transport"
    ],
    "title": "Tägliche Fahrt zur Schule",
    "situation": "Du beschreibst, dass du jeden Morgen mit dem Zug zur Schule fährst.",
    "model": "毎朝、電車で学校に行きます。",
    "alternative": "毎朝、学校へ電車で行きます。",
    "distractors": [
      {
        "form": "毎朝、電車に学校で行きます。",
        "why": "Verkehrsmittel und Bewegungsziel sind mit に und で vertauscht."
      },
      {
        "form": "昨日、電車で学校に行きました。",
        "why": "Das beschreibt eine einzelne Fahrt gestern, nicht die tägliche Routine."
      }
    ],
    "rule": "毎朝 setzt einen wiederkehrenden Rahmen, 行きます drückt die Gewohnheit aus."
  }
];

export function p39CasesForUnit(unitId:string):P39LifeCase[]{
  return p39LifeCases.filter(c=>c.unitIds.includes(unitId));
}

/** Exact authored variants only: never classify arbitrary learner writing. */
export function p39AuthoredFeedback(c:P39LifeCase,answer:string):
  {kind:"model"|"other"|"misconception"|"unknown";message:string}{
  const normalized=normalizeP26(answer);
  if(normalized===normalizeP26(c.model)||normalized===normalizeP26(c.alternative))
    return {kind:"model",message:c.rule};
  const distractor=c.distractors.find(d=>normalizeP26(d.form)===normalized);
  if(distractor)return {kind:"misconception",message:distractor.why};
  return {kind:"unknown",message:"Diese Form wurde nicht automatisch beurteilt. Vergleiche die Aussageabsicht und das Sprachregister mit dem originalen Beispiel."};
}
export const p39LifeChoicePrompts:StudyPrompt[]=p39LifeCases.map((c,i)=>({
  id:"p39-context-"+c.id,primaryTarget:{kind:"can_do",id:"p39:context:"+c.id},
  skill:"form_selection",cueFamily:"p39-context-"+c.id,promptType:"choice",
  instruction:"Wähle die beste Form für genau diese Alltagssituation.",
  prompt:c.situation,
  choices:i%3===0?[c.distractors[0]!.form,c.model,c.distractors[1]!.form]
    :i%3===1?[c.model,c.distractors[1]!.form,c.distractors[0]!.form]
    :[c.distractors[1]!.form,c.distractors[0]!.form,c.model],
  acceptedAnswers:[c.model],displayAnswer:c.model,
  explanation:c.rule+" Verwechslungsgefahr: "+c.distractors.map(d=>d.form+" — "+d.why).join(" "),
  answerNormalization:"japanese",contextId:"p39:context:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p39-1",
  eventMetadata:{p39:true,kind:"cross-context-transfer",unitIds:[...c.unitIds],
    caseId:c.id,focus:"communicative-intent"}
}));
export const p39LifeRepairPrompts:StudyPrompt[]=p39LifeCases.map(c=>({
  id:"p39-repair-"+c.id,primaryTarget:{kind:"can_do",id:"p39:repair:"+c.id},
  skill:"production",cueFamily:"p39-written-repair-"+c.id,promptType:"typed",
  instruction:"Überarbeite den problematischen Satz selbstständig und schreibe Japanisch.",
  prompt:c.situation+" Ausgangssatz: "+c.distractors[0]!.form,
  acceptedAnswers:[normalizeP26(c.model),normalizeP26(c.alternative)],
  displayAnswer:c.model,explanation:c.distractors[0]!.why+" "+c.rule,
  answerNormalization:"japanese",contextId:"p39:repair:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p39-1",
  eventMetadata:{p39:true,kind:"cross-context-reformulation",unitIds:[...c.unitIds],
    caseId:c.id,focus:"written-repair"}
}));
export const p39LifePrompts:StudyPrompt[]=[
  ...p39LifeChoicePrompts,...p39LifeRepairPrompts
];
