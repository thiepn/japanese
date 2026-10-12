import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {gradeStudyPrompt} from "@thiepn/study-player";

/** Authored independently. Reference books inform teaching principles only. */
export type P26Mode="course"|"precision"|"repair"|"transfer";
export interface P26Turn{
  partner:string;meaning:string;accepted:string[];modelMeaning:string;explanation:string;stretch:string;
}
export interface P26Mission{
  id:string;level:"A1"|"A2";title:string;situation:string;objective:string;
  mental:string;contrast:string;register:string;
  words:{written:string;reading:string;meaning:string;example:string}[];
  turns:P26Turn[];
}
export interface P26Grammar{
  id:string;mission:string;label:string;explanation:string;
  items:{stem:string;answer:string;choices:string[]}[];
}
export interface P26Lexeme{
  mission:string;written:string;reading:string;meaning:string;example:string;
}
export const p26Missions:readonly P26Mission[]=[
  {
    "id": "station-to-campus",
    "level": "A1",
    "title": "Vom Bahnhof zur Universität",
    "situation": "Du bist zum ersten Mal am Bahnhof und musst vor einem Kursbeginn den Weg zur Universität finden.",
    "objective": "Weg, Verkehrsmittel und Uhrzeit in einem zusammenhängenden Gespräch erfragen.",
    "mental": "Ziel + に行きます, Verkehrsmittel + で行きます, Uhrzeit + に, Ort einer Handlung + で.",
    "contrast": "大学に行きます (Ziel) versus 大学で勉強します (Handlungsort).",
    "register": "Fremde höflich mit すみません ansprechen; ください eignet sich für eine Bitte.",
    "words": [
      {
        "written": "駅",
        "reading": "えき",
        "meaning": "Bahnhof",
        "example": "駅から大学に行きます。"
      },
      {
        "written": "大学",
        "reading": "だいがく",
        "meaning": "Universität",
        "example": "大学で勉強します。"
      },
      {
        "written": "バス",
        "reading": "ばす",
        "meaning": "Bus",
        "example": "バスで行きます。"
      },
      {
        "written": "右",
        "reading": "みぎ",
        "meaning": "rechts",
        "example": "右に曲がります。"
      }
    ],
    "turns": [
      {
        "partner": "すみません、大学はどこですか。",
        "meaning": "Entschuldigung, wo ist die Universität?",
        "accepted": [
          "バスで行けます",
          "あのバスで行けます"
        ],
        "modelMeaning": "Mit dem Bus kommen Sie dorthin.",
        "explanation": "Antworte mit dem Verkehrsmittel, nicht mit einem Zeitwort.",
        "stretch": "まず、大学までの行き方を説明します。"
      },
      {
        "partner": "バスは何時に出ますか。",
        "meaning": "Wann fährt der Bus ab?",
        "accepted": [
          "九時に出ます",
          "バスは九時に出ます"
        ],
        "modelMeaning": "Er fährt um neun Uhr ab.",
        "explanation": "Die Uhrzeit steht mit に vor 出ます.",
        "stretch": "九時に出る予定です。"
      },
      {
        "partner": "バスで何分ぐらいかかりますか。",
        "meaning": "Wie viele Minuten dauert es ungefähr?",
        "accepted": [
          "十分ぐらいです",
          "十分ぐらいかかります"
        ],
        "modelMeaning": "Ungefähr zehn Minuten.",
        "explanation": "ぐらい markiert eine ungefähre Menge oder Zeit.",
        "stretch": "十分ぐらいかかります。"
      },
      {
        "partner": "大学では何をしますか。",
        "meaning": "Was machst du an der Universität?",
        "accepted": [
          "日本語を勉強します",
          "大学で日本語を勉強します"
        ],
        "modelMeaning": "Ich lerne Japanisch.",
        "explanation": "を markiert das Gelernte; で den Handlungsort.",
        "stretch": "日本語の授業があります。"
      },
      {
        "partner": "ありがとうございます。気をつけて。",
        "meaning": "Danke, pass auf dich auf.",
        "accepted": [
          "ありがとうございます",
          "はい、ありがとうございます"
        ],
        "modelMeaning": "Vielen Dank.",
        "explanation": "Zum Abschluss ist eine höfliche Erwiderung passend.",
        "stretch": "また今度。"
      }
    ]
  },
  {
    "id": "library-project",
    "level": "A2",
    "title": "Eine Hausarbeit vorbereiten",
    "situation": "Du suchst ein Buch, fragst nach der Ausleihe und triffst eine Verabredung zum Lernen.",
    "objective": "Eine Ausleihe, die Dauer und einen gemeinsamen Lerntermin aushandeln.",
    "mental": "Verb て-Form + もいいですか erfragt Erlaubnis. 〜たいです sagt, was du möchtest. 〜ませんか lädt höflich ein.",
    "contrast": "借りたいです (Wunsch) vs. 借りてもいいですか (Erlaubnis).",
    "register": "Im öffentlichen Servicekontakt höfliche です/ます-Form wählen; bei Kommilitonen sind lockere Varianten möglich.",
    "words": [
      {
        "written": "本",
        "reading": "ほん",
        "meaning": "Buch",
        "example": "本を借ります。"
      },
      {
        "written": "借りる",
        "reading": "かりる",
        "meaning": "ausleihen",
        "example": "借りてもいいですか。"
      },
      {
        "written": "返す",
        "reading": "かえす",
        "meaning": "zurückgeben",
        "example": "来週返します。"
      },
      {
        "written": "一緒に",
        "reading": "いっしょに",
        "meaning": "zusammen",
        "example": "一緒に勉強しませんか。"
      }
    ],
    "turns": [
      {
        "partner": "何をお探しですか。",
        "meaning": "Was suchen Sie?",
        "accepted": [
          "日本語の本を探しています",
          "日本語の本を探しています。"
        ],
        "modelMeaning": "Ich suche ein japanisches Buch.",
        "explanation": "探しています bedeutet 'ich suche gerade'.",
        "stretch": "日本語の本を読みたいです。"
      },
      {
        "partner": "この本を借りたいですか。",
        "meaning": "Möchten Sie dieses Buch ausleihen?",
        "accepted": [
          "はい、借りたいです",
          "はい、借りてもいいですか"
        ],
        "modelMeaning": "Ja, ich möchte es ausleihen / Darf ich es ausleihen?",
        "explanation": "たい drückt Wunsch aus, てもいいですか ist Erlaubnis.",
        "stretch": "この本を借りたいです。"
      },
      {
        "partner": "来週までに返せますか。",
        "meaning": "Können Sie es bis nächste Woche zurückgeben?",
        "accepted": [
          "はい、来週返します",
          "はい、返せます"
        ],
        "modelMeaning": "Ja, ich gebe es nächste Woche zurück.",
        "explanation": "Zeitliche Zusage muss zur Rückfrage passen.",
        "stretch": "来週の月曜日に返します。"
      },
      {
        "partner": "いつ一緒に勉強しますか。",
        "meaning": "Wann lernen wir zusammen?",
        "accepted": [
          "金曜日はどうですか",
          "土曜日に勉強しましょう"
        ],
        "modelMeaning": "Wie wäre Freitag? / Lernen wir Samstag!",
        "explanation": "はどうですか schlägt einen Termin vor.",
        "stretch": "金曜日なら大丈夫です。"
      },
      {
        "partner": "じゃあ、金曜日に会いましょう。",
        "meaning": "Dann sehen wir uns Freitag.",
        "accepted": [
          "はい、よろしくお願いします",
          "はい、また金曜日に"
        ],
        "modelMeaning": "Ja, bis Freitag.",
        "explanation": "Höflicher Abschluss einer Vereinbarung.",
        "stretch": "楽しみにしています。"
      }
    ]
  },
  {
    "id": "cafe-conversation",
    "level": "A2",
    "title": "Im Café genauer nachfragen",
    "situation": "Du bestellst mit einer Freundin und musst eine Bestellung höflich ändern und bezahlen.",
    "objective": "Eine Bestellung machen, Mengen und Varianten erfragen, etwas korrigieren und bezahlen.",
    "mental": "をください verlangt höflich eine Sache; 〜てもいいですか bittet um Erlaubnis. 〜じゃなくて stellt eine Korrektur her.",
    "contrast": "コーヒーをください (Bitte) vs. コーヒーを飲みたいです (Wunsch).",
    "register": "Bei Personal すみません und ください; gegenüber Freunden können die Formulierungen weniger formell sein.",
    "words": [
      {
        "written": "注文",
        "reading": "ちゅうもん",
        "meaning": "Bestellung",
        "example": "注文をお願いします。"
      },
      {
        "written": "水",
        "reading": "みず",
        "meaning": "Wasser",
        "example": "水をください。"
      },
      {
        "written": "一つ",
        "reading": "ひとつ",
        "meaning": "ein Stück",
        "example": "ケーキを一つください。"
      },
      {
        "written": "現金",
        "reading": "げんきん",
        "meaning": "Bargeld",
        "example": "現金で払います。"
      }
    ],
    "turns": [
      {
        "partner": "ご注文はお決まりですか。",
        "meaning": "Haben Sie sich entschieden?",
        "accepted": [
          "コーヒーを一つください",
          "水とケーキをください"
        ],
        "modelMeaning": "Einen Kaffee bitte / Wasser und Kuchen bitte.",
        "explanation": "をください ist eine höfliche Bestellung.",
        "stretch": "コーヒーをお願いします。"
      },
      {
        "partner": "お飲み物はホットですか、アイスですか。",
        "meaning": "Heiß oder kalt?",
        "accepted": [
          "ホットでお願いします",
          "アイスでお願いします"
        ],
        "modelMeaning": "Heiß, bitte / Kalt, bitte.",
        "explanation": "Auf eine Auswahlfrage folgt die passende Variante.",
        "stretch": "アイスコーヒーをお願いします。"
      },
      {
        "partner": "ほかには何かいりますか。",
        "meaning": "Möchten Sie sonst noch etwas?",
        "accepted": [
          "ケーキも一つください",
          "いいえ、大丈夫です"
        ],
        "modelMeaning": "Auch einen Kuchen bitte / Nein, danke.",
        "explanation": "も ergänzt eine Bestellung, 大丈夫です kann höflich ablehnen.",
        "stretch": "ケーキを追加してください。"
      },
      {
        "partner": "あ、ケーキは二つですね。",
        "meaning": "Also zwei Stück Kuchen?",
        "accepted": [
          "いいえ、一つです",
          "すみません、一つだけです"
        ],
        "modelMeaning": "Nein, nur einen.",
        "explanation": "Eine Korrektur sollte eindeutig bleiben.",
        "stretch": "ケーキは一つでお願いします。"
      },
      {
        "partner": "全部で千円です。",
        "meaning": "Zusammen 1000 Yen.",
        "accepted": [
          "現金で払います",
          "ありがとうございます"
        ],
        "modelMeaning": "Ich bezahle bar / Vielen Dank.",
        "explanation": "Mit で gibst du ein Zahlungsmittel an.",
        "stretch": "カードで払ってもいいですか。"
      }
    ]
  },
  {
    "id": "weekend-switch",
    "level": "A2",
    "title": "Wochenendpläne spontan ändern",
    "situation": "Du triffst einen Tandempartner und musst wegen des Wetters eure Wochenendverabredung anpassen.",
    "objective": "Einladen, höflich ablehnen, Gründe nennen, eine Alternative anbieten und vergangene Ereignisse vergleichen.",
    "mental": "〜ませんか formuliert Einladungen, 〜ましょう gemeinsame Vorschläge, 〜から einen Grund, 〜ました Vergangenheit.",
    "contrast": "行きませんか (Einladung) vs. 行きましょう (gemeinsamer Vorschlag).",
    "register": "Ablehnungen mit すみません, ちょっと, Grund und Alternative wirken oft höflicher als ein abruptes Nein.",
    "words": [
      {
        "written": "週末",
        "reading": "しゅうまつ",
        "meaning": "Wochenende",
        "example": "週末に会いましょう。"
      },
      {
        "written": "雨",
        "reading": "あめ",
        "meaning": "Regen",
        "example": "雨が降ります。"
      },
      {
        "written": "予定",
        "reading": "よてい",
        "meaning": "Plan",
        "example": "予定があります。"
      },
      {
        "written": "映画",
        "reading": "えいが",
        "meaning": "Film",
        "example": "映画を見ました。"
      }
    ],
    "turns": [
      {
        "partner": "土曜日、公園に行きませんか。",
        "meaning": "Wollen wir Samstag in den Park gehen?",
        "accepted": [
          "いいですね、行きましょう",
          "すみません、土曜日はちょっと"
        ],
        "modelMeaning": "Gute Idee / Samstag ist leider schwierig.",
        "explanation": "ませんか ist hier eine Einladung.",
        "stretch": "土曜日は予定があります。"
      },
      {
        "partner": "どうしてですか。",
        "meaning": "Warum?",
        "accepted": [
          "雨が降るからです",
          "予定があるからです"
        ],
        "modelMeaning": "Weil es regnen wird / Weil ich etwas vorhabe.",
        "explanation": "から begründet eine Aussage.",
        "stretch": "土曜日は仕事があるからです。"
      },
      {
        "partner": "では、日曜日はどうですか。",
        "meaning": "Wie wäre es Sonntag?",
        "accepted": [
          "日曜日なら大丈夫です",
          "日曜日は空いています"
        ],
        "modelMeaning": "Sonntag passt / Ich habe Sonntag Zeit.",
        "explanation": "なら grenzt die Zusage auf den vorgeschlagenen Tag ein.",
        "stretch": "日曜日にしましょう。"
      },
      {
        "partner": "何をしたいですか。",
        "meaning": "Was möchtest du machen?",
        "accepted": [
          "映画を見たいです",
          "カフェに行きたいです"
        ],
        "modelMeaning": "Ich möchte einen Film sehen / ins Café gehen.",
        "explanation": "〜たいです drückt den eigenen Wunsch aus.",
        "stretch": "一緒に映画を見ましょう。"
      },
      {
        "partner": "そういえば、先週末は何をしましたか。",
        "meaning": "Übrigens, was hast du letztes Wochenende gemacht?",
        "accepted": [
          "映画を見ました",
          "家で勉強しました"
        ],
        "modelMeaning": "Ich sah einen Film / lernte zu Hause.",
        "explanation": "Bei vergangener Handlung 〜ました wählen.",
        "stretch": "友達と会いました。"
      }
    ]
  }
];
export const p26Grammar:readonly P26Grammar[]=[
  {
    "id": "destination-place",
    "mission": "station-to-campus",
    "label": "Ziel oder Handlungsort",
    "explanation": "に markiert das Bewegungsziel, で den Ort einer Tätigkeit.",
    "items": [
      {
        "stem": "大学 ___ 行きます。",
        "answer": "に",
        "choices": [
          "に",
          "で",
          "を"
        ]
      },
      {
        "stem": "大学 ___ 日本語を勉強します。",
        "answer": "で",
        "choices": [
          "で",
          "に",
          "を"
        ]
      },
      {
        "stem": "駅 ___ 電車に乗ります。",
        "answer": "で",
        "choices": [
          "で",
          "へ",
          "を"
        ]
      }
    ]
  },
  {
    "id": "means-time",
    "mission": "station-to-campus",
    "label": "Verkehrsmittel und Uhrzeit",
    "explanation": "電車で: Verkehrsmittel; 九時に: konkrete Uhrzeit.",
    "items": [
      {
        "stem": "バス ___ 行きます。",
        "answer": "で",
        "choices": [
          "で",
          "に",
          "を"
        ]
      },
      {
        "stem": "九時 ___ 出ます。",
        "answer": "に",
        "choices": [
          "に",
          "を",
          "で"
        ]
      },
      {
        "stem": "電車 ___ 学校へ行きます。",
        "answer": "で",
        "choices": [
          "で",
          "が",
          "に"
        ]
      }
    ]
  },
  {
    "id": "request-permission",
    "mission": "library-project",
    "label": "Wunsch oder Erlaubnis",
    "explanation": "〜たいです äußert einen Wunsch; て-Form + もいいですか fragt nach Erlaubnis.",
    "items": [
      {
        "stem": "この本を借り ___ いいですか。",
        "answer": "ても",
        "choices": [
          "ても",
          "たい",
          "ます"
        ]
      },
      {
        "stem": "日本語の本を読み ___ です。",
        "answer": "たい",
        "choices": [
          "たい",
          "ても",
          "ます"
        ]
      },
      {
        "stem": "ここで勉強して ___ いいですか。",
        "answer": "も",
        "choices": [
          "も",
          "は",
          "を"
        ]
      }
    ]
  },
  {
    "id": "invite-schedule",
    "mission": "library-project",
    "label": "Einladung und Termin",
    "explanation": "〜ませんか lädt ein; 〜ましょう schlägt gemeinsames Handeln vor.",
    "items": [
      {
        "stem": "一緒に勉強し ___ か。",
        "answer": "ません",
        "choices": [
          "ません",
          "ましょう",
          "ます"
        ]
      },
      {
        "stem": "金曜日に会い ___。",
        "answer": "ましょう",
        "choices": [
          "ましょう",
          "ませんか",
          "たい"
        ]
      },
      {
        "stem": "四時 ___ 大丈夫です。",
        "answer": "なら",
        "choices": [
          "なら",
          "で",
          "を"
        ]
      }
    ]
  },
  {
    "id": "ordering-particle",
    "mission": "cafe-conversation",
    "label": "Bestellen und auflisten",
    "explanation": "をください benennt den Gegenstand; も fügt einen weiteren Wunsch hinzu.",
    "items": [
      {
        "stem": "水 ___ ください。",
        "answer": "を",
        "choices": [
          "を",
          "が",
          "で"
        ]
      },
      {
        "stem": "コーヒー ___ お願いします。",
        "answer": "を",
        "choices": [
          "を",
          "に",
          "は"
        ]
      },
      {
        "stem": "ケーキ ___ 一つください。",
        "answer": "も",
        "choices": [
          "も",
          "へ",
          "に"
        ]
      }
    ]
  },
  {
    "id": "quantity-correction",
    "mission": "cafe-conversation",
    "label": "Menge höflich korrigieren",
    "explanation": "一つ = ein Stück; 二つ = zwei Stück; だけ schränkt auf 'nur' ein.",
    "items": [
      {
        "stem": "ケーキは一つ ___ です。",
        "answer": "だけ",
        "choices": [
          "だけ",
          "から",
          "より"
        ]
      },
      {
        "stem": "コーヒーを一 ___ ください。",
        "answer": "つ",
        "choices": [
          "つ",
          "人",
          "時"
        ]
      },
      {
        "stem": "お茶は二 ___ ですか。",
        "answer": "つ",
        "choices": [
          "つ",
          "人",
          "円"
        ]
      }
    ]
  },
  {
    "id": "invitations-reasons",
    "mission": "weekend-switch",
    "label": "Einladen und begründen",
    "explanation": "〜ませんか lädt ein; 〜から gibt einen Grund an.",
    "items": [
      {
        "stem": "公園に行き ___ か。",
        "answer": "ません",
        "choices": [
          "ません",
          "ました",
          "ませんでした"
        ]
      },
      {
        "stem": "雨が降る ___ です。",
        "answer": "から",
        "choices": [
          "から",
          "まで",
          "で"
        ]
      },
      {
        "stem": "日曜日 ___ どうですか。",
        "answer": "は",
        "choices": [
          "は",
          "を",
          "に"
        ]
      }
    ]
  },
  {
    "id": "past-proposals",
    "mission": "weekend-switch",
    "label": "Vorschlag und Vergangenheit",
    "explanation": "〜ましょう ist Vorschlag; 〜ました berichtet über eine abgeschlossene Handlung.",
    "items": [
      {
        "stem": "一緒に行き ___。",
        "answer": "ましょう",
        "choices": [
          "ましょう",
          "ました",
          "ませんでした"
        ]
      },
      {
        "stem": "昨日映画を見 ___。",
        "answer": "ました",
        "choices": [
          "ました",
          "ましょう",
          "ませんか"
        ]
      },
      {
        "stem": "先週、学校に行き ___。 (nicht gegangen)",
        "answer": "ませんでした",
        "choices": [
          "ませんでした",
          "ませんか",
          "ます"
        ]
      }
    ]
  }
];
export const p26Lexemes:readonly P26Lexeme[]=[
  {
    "mission": "station-to-campus",
    "written": "駅",
    "reading": "えき",
    "meaning": "Bahnhof",
    "example": "駅から大学に行きます。"
  },
  {
    "mission": "station-to-campus",
    "written": "大学",
    "reading": "だいがく",
    "meaning": "Universität",
    "example": "大学で勉強します。"
  },
  {
    "mission": "station-to-campus",
    "written": "バス",
    "reading": "ばす",
    "meaning": "Bus",
    "example": "バスで行きます。"
  },
  {
    "mission": "station-to-campus",
    "written": "右",
    "reading": "みぎ",
    "meaning": "rechts",
    "example": "右に曲がります。"
  },
  {
    "mission": "library-project",
    "written": "図書館",
    "reading": "としょかん",
    "meaning": "Bibliothek",
    "example": "図書館で本を読みます。"
  },
  {
    "mission": "library-project",
    "written": "借りる",
    "reading": "かりる",
    "meaning": "ausleihen",
    "example": "本を借りたいです。"
  },
  {
    "mission": "library-project",
    "written": "返す",
    "reading": "かえす",
    "meaning": "zurückgeben",
    "example": "来週返します。"
  },
  {
    "mission": "library-project",
    "written": "一緒に",
    "reading": "いっしょに",
    "meaning": "zusammen",
    "example": "一緒に勉強しましょう。"
  },
  {
    "mission": "cafe-conversation",
    "written": "水",
    "reading": "みず",
    "meaning": "Wasser",
    "example": "水をください。"
  },
  {
    "mission": "cafe-conversation",
    "written": "注文",
    "reading": "ちゅうもん",
    "meaning": "Bestellung",
    "example": "注文をお願いします。"
  },
  {
    "mission": "cafe-conversation",
    "written": "現金",
    "reading": "げんきん",
    "meaning": "Bargeld",
    "example": "現金で払います。"
  },
  {
    "mission": "cafe-conversation",
    "written": "一つ",
    "reading": "ひとつ",
    "meaning": "ein Stück",
    "example": "ケーキを一つください。"
  },
  {
    "mission": "weekend-switch",
    "written": "週末",
    "reading": "しゅうまつ",
    "meaning": "Wochenende",
    "example": "週末に会いましょう。"
  },
  {
    "mission": "weekend-switch",
    "written": "予定",
    "reading": "よてい",
    "meaning": "Plan",
    "example": "予定があります。"
  },
  {
    "mission": "weekend-switch",
    "written": "映画",
    "reading": "えいが",
    "meaning": "Film",
    "example": "映画を見ました。"
  },
  {
    "mission": "weekend-switch",
    "written": "雨",
    "reading": "あめ",
    "meaning": "Regen",
    "example": "雨が降るからです。"
  }
];

const source="thiepn-original";
export function p26Context(id:string):string{return "p26:mission:"+id;}
/**
 * Normalize only for authored-form matching; punctuation is not learning evidence.
 * This intentionally does NOT assert that any unmatched grammatical response is wrong.
 */
export function normalizeP26(value:string):string{
  return value.normalize("NFKC").replace(/[\s。、！？!?・･「」『』]/gu,"").trim();
}
export function missionTurnPrompt(mission:P26Mission,index:number):StudyPrompt{
  const turn=mission.turns[index];
  if(!turn)throw new Error("P26_UNKNOWN_TURN:"+mission.id+":"+index);
  return {
    id:"p26-mission-"+mission.id+"-"+index,
    primaryTarget:{kind:"can_do",id:"p26:mission:"+mission.id},
    skill:"production",
    cueFamily:"p26-guided-turn-"+index,
    promptType:"typed",
    instruction:"Antworte deinem Gesprächspartner (eine der geübten Musterantworten)",
    prompt:turn.partner,
    promptLanguage:"ja",
    acceptedAnswers:turn.accepted.map(normalizeP26),
    displayAnswer:turn.accepted[0]!,
    explanation:turn.explanation,
    contextId:p26Context(mission.id),
    answerNormalization:"japanese",sourceId:source,contentVersion:"p26-1",
    eventMetadata:{p26:true,kind:"guided-response",missionId:mission.id,turnIndex:index}
  };
}
export const p26MissionPrompts:StudyPrompt[]=p26Missions.flatMap(m=>m.turns.map((_,i)=>missionTurnPrompt(m,i)));
export const p26GrammarPrompts:StudyPrompt[]=p26Grammar.flatMap(group=>group.items.map((item,i)=>({
  id:"p26-grammar-"+group.id+"-"+i,
  primaryTarget:{kind:"can_do" as const,id:"p26:grammar:"+group.mission},
  skill:"form_selection" as const,
  cueFamily:"p26-contrast-"+group.id+"-"+i,
  promptType:"choice" as const,instruction:"Unterscheide Grammatik im Kontext",
  prompt:item.stem,choices:item.choices,
  acceptedAnswers:[item.answer],displayAnswer:item.answer,
  explanation:group.explanation,contextId:p26Context(group.mission),
  answerNormalization:"japanese" as const,
  sourceId:source,contentVersion:"p26-1",
  eventMetadata:{p26:true,kind:"contrast",missionId:group.mission,contrastId:group.id}
}))));
/** A different cue tests lexeme->meaning and meaning->lexeme, not duplicate prompts. */
export const p26VocabularyPrompts:StudyPrompt[]=p26Lexemes.flatMap((word,index)=>{
  const options=[word.meaning,...[1,5,9].map(offset=>p26Lexemes[(index+offset)%p26Lexemes.length]!.meaning)].filter((s,i,a)=>a.indexOf(s)===i).slice(0,4);
  const base={
    primaryTarget:{kind:"can_do" as const,id:"p26:lexicon:"+word.mission},
    contextId:p26Context(word.mission),sourceId:source,contentVersion:"p26-1",
    answerNormalization:"japanese" as const,eventMetadata:{p26:true,kind:"lexical-transfer",missionId:word.mission,word:word.written}
  };
  return [
    {...base,id:"p26-vocab-meaning-"+index,skill:"comprehension" as const,cueFamily:"p26-vocab-meaning-"+index,
      promptType:"choice" as const,instruction:"Wortbedeutung im neuen Zusammenhang",
      prompt:word.example+"\nWelches Wort wird hier geübt? "+word.written,
      choices:options,acceptedAnswers:[word.meaning],displayAnswer:word.meaning,
      explanation:word.written+"（"+word.reading+"）= "+word.meaning},
    {...base,id:"p26-vocab-active-"+index,skill:"production" as const,cueFamily:"p26-vocab-active-"+index,
      promptType:"typed" as const,instruction:"Aktiv auf Japanisch abrufen",
      prompt:word.meaning+" — "+word.example,
      acceptedAnswers:[word.written,word.reading].map(normalizeP26),displayAnswer:word.written,
      explanation:"Im Satz: "+word.example}
  ];
});
export const p26Prompts:StudyPrompt[]=[...p26MissionPrompts,...p26GrammarPrompts,...p26VocabularyPrompts];
export const p26Lessons:Record<string,StudyLesson>=Object.fromEntries(p26Missions.map(m=>{
  const contextId=p26Context(m.id);
  return [contextId,{
    kind:"lesson" as const,id:"p26-lesson-"+m.id,contextId,title:m.title,
    body:m.situation+"\n\n"+m.mental,
    facts:[
      {label:"Lernziel",value:m.objective},
      {label:"Grammatikkontrast",value:m.contrast},
      {label:"Höflichkeit",value:m.register}
    ],
    examples:m.words.map(w=>({expression:w.written+"（"+w.reading+"）",note:w.meaning+" · "+w.example})),
    sourceLabel:"THIEPN Japanese · original communication and precision"
  }];
}));
export interface P26Feedback{
  matched:boolean;model:string;modelMeaning:string;notes:string[];contrast:string;
}
/** Inspect only explicit patterns; don't pretend to grade freely generated Japanese. */
export function inspectP26Reply(mission:P26Mission,index:number,reply:string):P26Feedback{
  const turn=mission.turns[index]!;
  const prompt=missionTurnPrompt(mission,index);
  const matched=gradeStudyPrompt(prompt,normalizeP26(reply)).result==="correct";
  const notes:string[]=[];
  const flat=normalizeP26(reply);
  if(!flat)notes.push("Formuliere zuerst eine Antwort auf Japanisch.");
  if(flat&&/[A-Za-z]/.test(flat))notes.push("Prüfe, ob du die Zielantwort in japanischer Schrift formulieren möchtest.");
  if(flat&&/大学|図書館|バス|電車/.test(flat)&&!/[にでへ]/.test(flat))
    notes.push("Orts-, Ziel- und Verkehrsmittelpartikeln im vollständigen Satz prüfen.");
  if(flat&&/行きませんか|ましょう/.test(flat))
    notes.push("Einladung (ませんか) und gemeinsamer Vorschlag (ましょう) haben unterschiedliche Funktionen.");
  if(flat&&/ました|ませんでした/.test(flat))
    notes.push("Die höfliche Vergangenheit im zeitlichen Kontext prüfen.");
  if(flat&&/借り|てもいい/.test(flat))
    notes.push("Wunsch (たい) und Erlaubnis (てもいいですか) unterscheiden.");
  if(flat&&/です|ます/.test(flat))notes.push("Die gewählte höfliche Ausdrucksweise prüfen.");
  return {
    matched,model:turn.accepted[0]!,modelMeaning:turn.modelMeaning,
    notes:notes.length?notes:["Vergleiche deine Aussage mit dem Modell und prüfe Grammatik, Register und Kontext."],
    contrast:turn.explanation
  };
}
export function traceIdP26(p:StudyPrompt):string{
  return p.primaryTarget.kind+":"+p.primaryTarget.id+":"+p.skill+":"+p.cueFamily;
}
type EvidenceStatus="due"|"incorrect"|"unseen"|"maintain";
export function p26Status(prompt:StudyPrompt,traces:ReadonlyMap<string,MemoryTrace>,events:readonly StudyEvent[],now=Date.now()):EvidenceStatus{
  const trace=traces.get(traceIdP26(prompt));
  if(trace&&Date.parse(trace.card.due)<=now)return "due";
  const latest=events.filter(e=>e.metadata?.promptId===prompt.id&&(e.result==="correct"||e.result==="incorrect"))
    .sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  if(latest?.result==="incorrect")return "incorrect";
  return trace?"maintain":"unseen";
}
export interface P26Recommendation{missionId:string;due:number;incorrect:number;unseen:number;studied:number;reason:string;}
export function p26Recommendations(traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()):P26Recommendation[]{
  const map=new Map(traces.map(t=>[t.id,t]));
  const rows=p26Missions.map(m=>{
    const prompts=p26Prompts.filter(p=>p.contextId===p26Context(m.id));
    const states=prompts.map(p=>p26Status(p,map,events,now));
    const due=states.filter(s=>s==="due").length,incorrect=states.filter(s=>s==="incorrect").length,unseen=states.filter(s=>s==="unseen").length;
    return {missionId:m.id,due,incorrect,unseen,studied:prompts.length-unseen,
      reason:due?"FSRS fällig":incorrect?"Letzter Versuch fehlerhaft":unseen?"Neuer Stoff":"Vertiefung"};
  });
  return rows.sort((a,b)=>b.due-a.due||b.incorrect-a.incorrect||b.unseen-a.unseen);
}
export function p26Session(missionId:string,mode:P26Mode,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()):StudyStep[]{
  const mission=p26Missions.find(m=>m.id===missionId);
  if(!mission)throw new Error("P26_MISSION_NOT_FOUND:"+missionId);
  const map=new Map(traces.map(t=>[t.id,t]));
  const group=p26Prompts.filter(p=>p.contextId===p26Context(missionId));
  const annotated=group.map(prompt=>({prompt,status:p26Status(prompt,map,events,now)}));
  const weight:Record<EvidenceStatus,number>={due:4,incorrect:3,unseen:2,maintain:1};
  annotated.sort((a,b)=>weight[b.status]-weight[a.status]);
  const focus=mode==="precision"?annotated.filter(p=>p.prompt.id.startsWith("p26-grammar-"))
    :mode==="transfer"?annotated.filter(p=>p.prompt.id.startsWith("p26-vocab-"))
    :mode==="repair"?annotated.filter(p=>p.status==="due"||p.status==="incorrect")
    :annotated;
  // Missing focus must never silently become an empty training session.
  const selected=(focus.length?focus:annotated).slice(0,mode==="course"?20:12);
  return [p26Lessons[p26Context(missionId)]!,...selected.map(p=>p.prompt)];
}
