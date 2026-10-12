import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";

/**
 * Independently authored situational Japanese pedagogy. The PDFs are private
 * teaching references; no publisher exercises, dialogue text or audio is used.
 */
export type P25Mode="lesson"|"repair"|"transfer";
export type P25Skill="comprehension"|"form_selection"|"production";
export interface P25Choice{
  id:string;japanese:string;german:string;explanation:string;correct:boolean;
}
export interface P25Turn{ id:string;japanese:string;german:string;choices:P25Choice[]; }
export interface P25Exercise{
  id:string;mode:"choice"|"typed";skill:P25Skill;
  question:string;answer:string;choices:string[];explanation:string;
}
export interface P25Scenario{
  id:string;level:"A1"|"A2";title:string;canDo:string;
  situation:string;mentalModel:string;contrast:string;pitfall:string;
  words:{japanese:string;reading:string;german:string;example:string}[];
  revision:{
    writing:string;speaking:string;reference:string;features:string[];advice:string;
  };
  turns:P25Turn[];exercises:P25Exercise[];
}

const SOURCE_ID="thiepn-original";
export const p25Scenarios:readonly P25Scenario[] = [
  {
    "id": "directions",
    "level": "A1",
    "title": "Nach dem Weg fragen",
    "canDo": "Ich kann einen Ort erfragen und einfache Weganweisungen verstehen.",
    "situation": "Du bist neu in der Stadt und suchst den Bahnhof.",
    "mentalModel": "どこですか erfragt einen Ort. Bei einer Wegbeschreibung kombinierst du Richtung und Handlung: 右に曲がってください. 〜てください ist eine höfliche Aufforderung.",
    "contrast": "駅はどこですか fragt nach dem Ort. 駅に行きます beschreibt die Bewegung zum Bahnhof.",
    "pitfall": "で ist nicht die Standardmarkierung für das Ziel mit 行きます; dafür steht häufig に oder へ.",
    "words": [
      {
        "japanese": "駅",
        "reading": "えき",
        "german": "Bahnhof",
        "example": "駅はどこですか。"
      },
      {
        "japanese": "右",
        "reading": "みぎ",
        "german": "rechts",
        "example": "右に曲がってください。"
      },
      {
        "japanese": "左",
        "reading": "ひだり",
        "german": "links",
        "example": "左に曲がります。"
      },
      {
        "japanese": "まっすぐ",
        "reading": "まっすぐ",
        "german": "geradeaus",
        "example": "まっすぐ行ってください。"
      }
    ],
    "revision": {
      "writing": "Schreibe eine höfliche Frage nach dem Bahnhof und eine kurze Wegbeschreibung.",
      "speaking": "Bitte eine Person auf Japanisch um eine einfache Wegbeschreibung und wiederhole den ersten Schritt.",
      "reference": "すみません、駅はどこですか。まっすぐ行って、右に曲がってください。",
      "features": [
        "駅",
        "どこ",
        "ください"
      ],
      "advice": "Sind die Richtungsangaben verständlich und die Handlung im passenden Höflichkeitsstil formuliert?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "すみません、駅はどこですか。",
        "german": "Entschuldigung, wo ist der Bahnhof?",
        "choices": [
          {
            "id": "right0",
            "japanese": "まっすぐ行ってください。",
            "german": "Gehen Sie geradeaus.",
            "explanation": "Gut: Die Weganweisung reagiert auf die Ortsfrage.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "あちらです。",
            "german": "Dort drüben.",
            "explanation": "Eine kurze Ortsangabe passt ebenfalls.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "お茶をください。",
            "german": "Einen Tee bitte.",
            "explanation": "Das ist keine Wegauskunft.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "右ですか、左ですか。",
        "german": "Rechts oder links?",
        "choices": [
          {
            "id": "right0",
            "japanese": "右に曲がってください。",
            "german": "Bitte rechts abbiegen.",
            "explanation": "Die Richtungsfrage wird beantwortet.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "右です。",
            "german": "Rechts.",
            "explanation": "Kurze Antwort mit Ortsrichtung.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "今日は寒いです。",
            "german": "Heute ist es kalt.",
            "explanation": "Das ist keine Richtungsangabe.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "わかりました。ありがとうございます。",
        "german": "Verstanden, vielen Dank.",
        "choices": [
          {
            "id": "right0",
            "japanese": "どういたしまして。",
            "german": "Gern geschehen.",
            "explanation": "Höflicher Abschluss.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "はい、どうぞ。",
            "german": "Ja, bitte.",
            "explanation": "Je nach Situation kurz und höflich.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "いくらですか。",
            "german": "Wie viel kostet es?",
            "explanation": "Die Preisfrage ist hier nicht passend.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "directions-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Welche Frage erkundigt sich nach dem Bahnhof?",
        "answer": "駅はどこですか",
        "choices": [
          "駅はどこですか",
          "駅を読みます",
          "駅で食べます"
        ],
        "explanation": "どこ fragt nach einem Ort."
      },
      {
        "id": "directions-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "駅 ___ 行きます。",
        "answer": "に",
        "choices": [
          "に",
          "で",
          "を"
        ],
        "explanation": "Das Ziel einer Bewegung kann mit に markiert werden."
      },
      {
        "id": "directions-3",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'rechts' auf Japanisch (Kanji).",
        "answer": "右",
        "choices": [],
        "explanation": "右 = rechts; die Lesung ist みぎ."
      },
      {
        "id": "directions-4",
        "mode": "choice",
        "skill": "form_selection",
        "question": "右に曲がっ ___。",
        "answer": "てください",
        "choices": [
          "てください",
          "ますか",
          "です"
        ],
        "explanation": "Die höfliche Handlungsaufforderung verwendet die て-Form + ください."
      },
      {
        "id": "directions-5",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Wo ist der Bahnhof?' (ohne Satzzeichen).",
        "answer": "駅はどこですか",
        "choices": [],
        "explanation": "は markiert das Thema; どこですか fragt nach dem Ort."
      },
      {
        "id": "directions-6",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet まっすぐ行ってください?",
        "answer": "Gehen Sie geradeaus.",
        "choices": [
          "Gehen Sie geradeaus.",
          "Bitte kommen Sie morgen.",
          "Wo ist das Geschäft?"
        ],
        "explanation": "まっすぐ bezeichnet die gerade Richtung."
      }
    ]
  },
  {
    "id": "transport",
    "level": "A1",
    "title": "Mit Zug und Bus unterwegs",
    "canDo": "Ich kann nach Abfahrtszeiten fragen und mein Verkehrsmittel nennen.",
    "situation": "Du planst eine Fahrt zum Campus und fragst nach einer Abfahrtszeit.",
    "mentalModel": "Mit 何時に erfragst du die Uhrzeit einer Handlung. Verkehrsmittel werden mit で ausgedrückt: 電車で行きます. 〜から und 〜まで markieren Beginn und Ende eines Zeitraums.",
    "contrast": "九時に出ます ist eine Abfahrtszeit; 電車で行きます bezeichnet das Verkehrsmittel.",
    "pitfall": "で ist das Mittel des Reisens, に die konkrete Uhrzeit — beide Partikeln haben verschiedene Aufgaben.",
    "words": [
      {
        "japanese": "電車",
        "reading": "でんしゃ",
        "german": "Zug",
        "example": "電車で行きます。"
      },
      {
        "japanese": "バス",
        "reading": "ばす",
        "german": "Bus",
        "example": "バスで大学に行きます。"
      },
      {
        "japanese": "何時",
        "reading": "なんじ",
        "german": "wie viel Uhr",
        "example": "何時に出ますか。"
      },
      {
        "japanese": "出る",
        "reading": "でる",
        "german": "abfahren / verlassen",
        "example": "九時に出ます。"
      }
    ],
    "revision": {
      "writing": "Beschreibe eine Fahrt: Nenne Verkehrsmittel, Ziel und Uhrzeit.",
      "speaking": "Erfrage eine Abfahrtszeit und sage, wie du zum Campus fährst.",
      "reference": "何時に出ますか。九時に出ます。電車で大学に行きます。",
      "features": [
        "時",
        "に",
        "で"
      ],
      "advice": "Unterscheidest du で für Verkehrsmittel, に für Ziel und konkrete Uhrzeit?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "大学にはどうやって行きますか。",
        "german": "Wie kommst du zur Universität?",
        "choices": [
          {
            "id": "right0",
            "japanese": "電車で行きます。",
            "german": "Ich fahre mit dem Zug.",
            "explanation": "Das Verkehrsmittel wird genannt.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "バスで行きます。",
            "german": "Ich fahre mit dem Bus.",
            "explanation": "Auch diese Antwort nennt ein Verkehrsmittel.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "私は学生です。",
            "german": "Ich bin Student/in.",
            "explanation": "Das beantwortet die Frage nach dem Weg nicht.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "何時に出ますか。",
        "german": "Wann fährst du los?",
        "choices": [
          {
            "id": "right0",
            "japanese": "九時に出ます。",
            "german": "Ich fahre um neun los.",
            "explanation": "Die Zeit ist klar.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "十時に出ます。",
            "german": "Ich fahre um zehn los.",
            "explanation": "Auch eine passende Abfahrtszeit.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "電車で出ます。",
            "german": "Ich fahre mit dem Zug los.",
            "explanation": "Es fehlt die erfragte Uhrzeit.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "じゃあ、また大学で。",
        "german": "Dann bis an der Uni.",
        "choices": [
          {
            "id": "right0",
            "japanese": "また大学で。",
            "german": "Bis an der Uni.",
            "explanation": "Passender Abschluss.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "はい、また。",
            "german": "Ja, bis dann.",
            "explanation": "Passende Verabschiedung.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "本をください。",
            "german": "Ein Buch bitte.",
            "explanation": "Die Bitte passt hier nicht.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "transport-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Wie fragt man 'Um wie viel Uhr?'",
        "answer": "何時に",
        "choices": [
          "何時に",
          "だれの",
          "いくら"
        ],
        "explanation": "何時に fragt nach der Uhrzeit einer Handlung."
      },
      {
        "id": "transport-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "電車 ___ 大学に行きます。",
        "answer": "で",
        "choices": [
          "に",
          "で",
          "を"
        ],
        "explanation": "で markiert das Verkehrsmittel."
      },
      {
        "id": "transport-3",
        "mode": "typed",
        "skill": "production",
        "question": "Ergänze: 九時 ___ 出ます。",
        "answer": "に",
        "choices": [],
        "explanation": "Eine konkrete Uhrzeit kann に erhalten."
      },
      {
        "id": "transport-4",
        "mode": "choice",
        "skill": "form_selection",
        "question": "九時 ___ 十時まで働きます。",
        "answer": "から",
        "choices": [
          "まで",
          "から",
          "で"
        ],
        "explanation": "から markiert den Anfang des Zeitraums."
      },
      {
        "id": "transport-5",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Ich fahre mit dem Zug.' ohne Satzzeichen.",
        "answer": "電車で行きます",
        "choices": [],
        "explanation": "電車で gibt das Mittel an; 行きます die Bewegung."
      },
      {
        "id": "transport-6",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet バスで行きます?",
        "answer": "Ich fahre mit dem Bus.",
        "choices": [
          "Ich fahre mit dem Bus.",
          "Der Bus ist dort.",
          "Der Bus ist teuer."
        ],
        "explanation": "Mit で wird hier das Verkehrsmittel ausgedrückt."
      }
    ]
  },
  {
    "id": "library",
    "level": "A2",
    "title": "In der Bibliothek um Erlaubnis bitten",
    "canDo": "Ich kann höflich um Erlaubnis bitten und ein Buch ausleihen.",
    "situation": "Du hast in der Bibliothek ein Buch gefunden und möchtest es ausleihen.",
    "mentalModel": "Die て-Form plus もいいですか fragt, ob eine Handlung erlaubt ist: 借りてもいいですか. Mit 〜たいです drückst du einen persönlichen Wunsch aus.",
    "contrast": "本を借りたいです = Ich möchte das Buch ausleihen. 借りてもいいですか = Darf ich es ausleihen?",
    "pitfall": "Das Verb 借りる wird zu 借りて, nicht zu 借りって. いいですか bezieht sich auf die Handlung.",
    "words": [
      {
        "japanese": "図書館",
        "reading": "としょかん",
        "german": "Bibliothek",
        "example": "図書館で勉強します。"
      },
      {
        "japanese": "借りる",
        "reading": "かりる",
        "german": "ausleihen",
        "example": "本を借りたいです。"
      },
      {
        "japanese": "返す",
        "reading": "かえす",
        "german": "zurückgeben",
        "example": "来週返します。"
      },
      {
        "japanese": "来週",
        "reading": "らいしゅう",
        "german": "nächste Woche",
        "example": "来週返してもいいですか。"
      }
    ],
    "revision": {
      "writing": "Bitte um Erlaubnis, ein Buch auszuleihen, und nenne den Rückgabetermin.",
      "speaking": "Frage am Schalter, ob du ein Buch ausleihen darfst und wann du es zurückgeben kannst.",
      "reference": "この本を借りてもいいですか。来週返します。",
      "features": [
        "借りて",
        "いいですか",
        "返します"
      ],
      "advice": "Unterscheidest du einen Wunsch (たい) von einer Frage nach Erlaubnis (てもいいですか)?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "何かお探しですか。",
        "german": "Suchen Sie etwas?",
        "choices": [
          {
            "id": "right0",
            "japanese": "日本語の本を探しています。",
            "german": "Ich suche ein japanisches Buch.",
            "explanation": "Das beantwortet die Nachfrage.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "この本を借りたいです。",
            "german": "Ich möchte dieses Buch ausleihen.",
            "explanation": "Das Ziel ist klar.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "九時に出ます。",
            "german": "Ich fahre um neun los.",
            "explanation": "Das ist keine Antwort zur Suche.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "この本でいいですか。",
        "german": "Ist dieses Buch in Ordnung?",
        "choices": [
          {
            "id": "right0",
            "japanese": "はい、借りてもいいですか。",
            "german": "Ja, darf ich es ausleihen?",
            "explanation": "Höfliche Bitte um Erlaubnis.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "はい、これがいいです。",
            "german": "Ja, dieses ist gut.",
            "explanation": "Die Auswahl wird bestätigt.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "電車で行きます。",
            "german": "Ich fahre mit dem Zug.",
            "explanation": "Das beantwortet die Buchfrage nicht.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "来週返してください。",
        "german": "Bitte nächste Woche zurückgeben.",
        "choices": [
          {
            "id": "right0",
            "japanese": "わかりました。",
            "german": "Verstanden.",
            "explanation": "Passende Zusage.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "はい、ありがとうございます。",
            "german": "Ja, vielen Dank.",
            "explanation": "Passende Antwort mit Dank.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "これはいくらですか。",
            "german": "Wie viel kostet das?",
            "explanation": "Es geht um die Rückgabe, nicht um einen Kauf.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "library-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Welche Form fragt nach Erlaubnis?",
        "answer": "借りてもいいですか",
        "choices": [
          "借りました",
          "借りてもいいですか",
          "借りません"
        ],
        "explanation": "て-Form + もいいですか fragt nach Erlaubnis."
      },
      {
        "id": "library-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "この本を借り ___ いいですか。",
        "answer": "ても",
        "choices": [
          "ても",
          "ます",
          "から"
        ],
        "explanation": "借りてもいいですか ist hier die höfliche Erlaubnisfrage."
      },
      {
        "id": "library-3",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe die て-Form von 借りる.",
        "answer": "借りて",
        "choices": [],
        "explanation": "一段動詞: 借りる → 借りて."
      },
      {
        "id": "library-4",
        "mode": "choice",
        "skill": "form_selection",
        "question": "本を借り ___ です。 (Wunsch)",
        "answer": "たい",
        "choices": [
          "たい",
          "ません",
          "でしょう"
        ],
        "explanation": "Der Wunsch 〜たいです hängt an die ます-Basis."
      },
      {
        "id": "library-5",
        "mode": "typed",
        "skill": "production",
        "question": "Ergänze: 来週 ___。 (Ich gebe es zurück.)",
        "answer": "返します",
        "choices": [],
        "explanation": "返します = ich gebe zurück."
      },
      {
        "id": "library-6",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet 来週返してください?",
        "answer": "Bitte nächste Woche zurückgeben.",
        "choices": [
          "Bitte nächste Woche zurückgeben.",
          "Kann ich es heute kaufen?",
          "Wo ist die Bibliothek?"
        ],
        "explanation": "来週 nächste Woche; 返してください höfliche Rückgabebitte."
      }
    ]
  },
  {
    "id": "shopping",
    "level": "A2",
    "title": "Im Geschäft vergleichen und kaufen",
    "canDo": "Ich kann nach Varianten und Preisen fragen und eine Auswahl treffen.",
    "situation": "Du suchst ein Geschenk und möchtest eine andere Farbe ausprobieren.",
    "mentalModel": "Das Muster [Adjektiv] + の kann eine bereits bekannte Sache vertreten: 赤いの = das rote (Exemplar). こちら und これ können zum Zeigen verwendet werden, mit unterschiedlicher Höflichkeit.",
    "contrast": "赤いかばん = eine rote Tasche. 赤いの = die rote (Sache), wenn das Nomen klar ist.",
    "pitfall": "い-Adjektive behalten bei 赤いの ihr い. Bei な-Adjektiven ist die Konstruktion anders (z. B. きれいなの).",
    "words": [
      {
        "japanese": "赤い",
        "reading": "あかい",
        "german": "rot",
        "example": "赤いのはありますか。"
      },
      {
        "japanese": "安い",
        "reading": "やすい",
        "german": "günstig",
        "example": "こちらのほうが安いです。"
      },
      {
        "japanese": "値段",
        "reading": "ねだん",
        "german": "Preis",
        "example": "値段はいくらですか。"
      },
      {
        "japanese": "かばん",
        "reading": "かばん",
        "german": "Tasche",
        "example": "このかばんが好きです。"
      }
    ],
    "revision": {
      "writing": "Frage nach einer anderen Farbe, vergleiche zwei Produkte und entscheide dich.",
      "speaking": "Bitte eine Verkäuferin um eine andere Farbe und frage anschließend nach dem Preis.",
      "reference": "赤いのはありますか。こちらのほうが安いですか。これをください。",
      "features": [
        "赤い",
        "いくら",
        "ください"
      ],
      "advice": "Bezieht sich の auf eine bereits bekannte Sache? Stimmen これ und この mit dem Nomen überein?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "何をお探しですか。",
        "german": "Was suchen Sie?",
        "choices": [
          {
            "id": "right0",
            "japanese": "赤いかばんを探しています。",
            "german": "Ich suche eine rote Tasche.",
            "explanation": "Klares Produkt mit Farbe.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "かばんを見たいです。",
            "german": "Ich möchte mir Taschen ansehen.",
            "explanation": "Passender Wunsch.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "電車で行きます。",
            "german": "Ich fahre mit dem Zug.",
            "explanation": "Das passt nicht zur Frage nach dem Produkt.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "この青いのはどうですか。",
        "german": "Wie wäre es mit diesem blauen Exemplar?",
        "choices": [
          {
            "id": "right0",
            "japanese": "赤いのはありますか。",
            "german": "Gibt es ein rotes?",
            "explanation": "Du fragst nach einer passenden Alternative.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "いいですね。いくらですか。",
            "german": "Gut. Wie viel kostet es?",
            "explanation": "Du akzeptierst den Vorschlag und fragst nach dem Preis.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "昨日は学校でした。",
            "german": "Gestern war Schule.",
            "explanation": "Das ist keine Produktauswahl.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "こちらは二千円です。",
        "german": "Das hier kostet 2000 Yen.",
        "choices": [
          {
            "id": "right0",
            "japanese": "これをください。",
            "german": "Das hier bitte.",
            "explanation": "Eine klare Kaufentscheidung.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "ありがとうございます。少し考えます。",
            "german": "Danke, ich überlege es mir.",
            "explanation": "Auch eine höfliche Antwort ohne Kauf.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "先生はどこですか。",
            "german": "Wo ist die Lehrerin?",
            "explanation": "Hier ist eine Kaufentscheidung gefragt.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "shopping-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet 赤いの?",
        "answer": "das rote Exemplar",
        "choices": [
          "das rote Exemplar",
          "das rote Licht",
          "morgen früh"
        ],
        "explanation": "の ersetzt ein im Kontext bereits klares Nomen."
      },
      {
        "id": "shopping-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "赤い ___ はありますか。",
        "answer": "の",
        "choices": [
          "を",
          "の",
          "で"
        ],
        "explanation": "赤いの kann eine rote Sache vertreten."
      },
      {
        "id": "shopping-3",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'rot' als い-Adjektiv.",
        "answer": "赤い",
        "choices": [],
        "explanation": "赤い bedeutet rot."
      },
      {
        "id": "shopping-4",
        "mode": "choice",
        "skill": "form_selection",
        "question": "この ___ が好きです。",
        "answer": "かばん",
        "choices": [
          "これ",
          "かばん",
          "どこ"
        ],
        "explanation": "この modifiziert direkt das folgende Nomen."
      },
      {
        "id": "shopping-5",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Das hier bitte' auf Japanisch ohne Satzzeichen.",
        "answer": "これをください",
        "choices": [],
        "explanation": "Die höfliche Bitte verwendet をください."
      },
      {
        "id": "shopping-6",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet 値段はいくらですか?",
        "answer": "Wie hoch ist der Preis?",
        "choices": [
          "Wann treffen wir uns?",
          "Wie hoch ist der Preis?",
          "Wie heißt die Person?"
        ],
        "explanation": "値段 = Preis; いくら erfragt den Geldbetrag."
      }
    ]
  },
  {
    "id": "appointment",
    "level": "A2",
    "title": "Einen Termin aushandeln",
    "canDo": "Ich kann höflich einen Termin vorschlagen und eine Alternative nennen.",
    "situation": "Für ein Tandemgespräch sucht ihr einen gemeinsamen Zeitpunkt.",
    "mentalModel": "〜はどうですか macht einen Vorschlag. Mit 〜なら大丈夫です begrenzt du, unter welcher Bedingung etwas passt. すみません und eine Alternative entschärfen eine Absage.",
    "contrast": "金曜日はどうですか = Wie wäre es mit Freitag? 金曜日なら大丈夫です = Wenn es Freitag ist, passt es.",
    "pitfall": "〜なら markiert hier eine Bedingung, nicht einfach eine Uhrzeit. Eine höfliche Absage braucht nicht automatisch ein hartes 'Nein'.",
    "words": [
      {
        "japanese": "金曜日",
        "reading": "きんようび",
        "german": "Freitag",
        "example": "金曜日はどうですか。"
      },
      {
        "japanese": "予定",
        "reading": "よてい",
        "german": "Plan / Termin",
        "example": "予定があります。"
      },
      {
        "japanese": "大丈夫",
        "reading": "だいじょうぶ",
        "german": "in Ordnung / passend",
        "example": "三時なら大丈夫です。"
      },
      {
        "japanese": "都合",
        "reading": "つごう",
        "german": "Verfügbarkeit",
        "example": "都合が悪いです。"
      }
    ],
    "revision": {
      "writing": "Schlage einen Termin vor, lehne einen Zeitpunkt höflich ab und biete eine Alternative.",
      "speaking": "Vereinbare für diese Woche ein Tandemtreffen mit zwei Zeitvorschlägen.",
      "reference": "金曜日はどうですか。すみません、三時はちょっと。四時なら大丈夫です。",
      "features": [
        "どうですか",
        "すみません",
        "なら"
      ],
      "advice": "Gibst du nach einer Absage eine verständliche Alternative an?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "金曜日はどうですか。",
        "german": "Wie wäre es mit Freitag?",
        "choices": [
          {
            "id": "right0",
            "japanese": "金曜日なら大丈夫です。",
            "german": "Freitag passt mir.",
            "explanation": "Der Vorschlag wird akzeptiert.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "すみません、金曜日はちょっと。",
            "german": "Freitag ist leider schwierig.",
            "explanation": "Eine höfliche indirekte Absage.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "昨日、行きました。",
            "german": "Gestern bin ich gegangen.",
            "explanation": "Das passt nicht zur Terminfrage.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "三時ならどうですか。",
        "german": "Wie wäre es um drei Uhr?",
        "choices": [
          {
            "id": "right0",
            "japanese": "三時なら大丈夫です。",
            "german": "Um drei passt es.",
            "explanation": "Klarer Terminzuspruch.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "四時はどうですか。",
            "german": "Wie wäre es um vier?",
            "explanation": "Du schlägst eine Alternative vor.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "本をください。",
            "german": "Ein Buch bitte.",
            "explanation": "Das passt nicht zur Zeitabsprache.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "では、また金曜日に。",
        "german": "Dann bis Freitag.",
        "choices": [
          {
            "id": "right0",
            "japanese": "また金曜日に。",
            "german": "Bis Freitag.",
            "explanation": "Passender Abschluss.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "よろしくお願いします。",
            "german": "Freut mich, danke.",
            "explanation": "Höfliche Bestätigung.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "赤いのをください。",
            "german": "Das Rote bitte.",
            "explanation": "Hier wird kein Produkt bestellt.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "appointment-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Welche Aussage schlägt einen Termin vor?",
        "answer": "金曜日はどうですか",
        "choices": [
          "金曜日はどうですか",
          "金曜日でした",
          "本を読みます"
        ],
        "explanation": "はどうですか stellt einen Vorschlag zur Diskussion."
      },
      {
        "id": "appointment-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "三時 ___ 大丈夫です。",
        "answer": "なら",
        "choices": [
          "で",
          "なら",
          "を"
        ],
        "explanation": "なら bezeichnet hier eine Bedingung."
      },
      {
        "id": "appointment-3",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Freitag' in Kanji.",
        "answer": "金曜日",
        "choices": [],
        "explanation": "金曜日 = Freitag."
      },
      {
        "id": "appointment-4",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Wie lässt sich eine Absage höflich einleiten?",
        "answer": "すみません",
        "choices": [
          "いただきます",
          "すみません",
          "ただいま"
        ],
        "explanation": "すみません kann einer höflichen Ablehnung vorangestellt werden."
      },
      {
        "id": "appointment-5",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Wie wäre es mit Freitag?' ohne Satzzeichen.",
        "answer": "金曜日はどうですか",
        "choices": [],
        "explanation": "はどうですか ist ein höflicher Vorschlag."
      },
      {
        "id": "appointment-6",
        "mode": "choice",
        "skill": "form_selection",
        "question": "四時 ___ どうですか。",
        "answer": "は",
        "choices": [
          "が",
          "は",
          "を"
        ],
        "explanation": "Vier Uhr wird als Vorschlagsthema eingeführt."
      }
    ]
  },
  {
    "id": "lostfound",
    "level": "A2",
    "title": "Einen verlorenen Gegenstand suchen",
    "canDo": "Ich kann einen Verlust erklären, einen Gegenstand beschreiben und nachfragen.",
    "situation": "Du hast im Zug einen schwarzen Regenschirm verloren und fragst am Fundbüro.",
    "mentalModel": "〜ました beschreibt ein abgeschlossenes Ereignis: 傘をなくしました. Für Eigenschaften kombinierst du い-Adjektiv und Nomen: 黒い傘. Mit ありませんか kann man höflich nach dem Vorhandensein fragen.",
    "contrast": "黒い傘 = schwarzer Regenschirm. 傘がありません = Es gibt keinen Regenschirm / der Regenschirm ist nicht da.",
    "pitfall": "Mit なくしました sagst du, dass etwas verloren ging. ありません allein kann auch einfach Abwesenheit ausdrücken.",
    "words": [
      {
        "japanese": "傘",
        "reading": "かさ",
        "german": "Regenschirm",
        "example": "傘をなくしました。"
      },
      {
        "japanese": "黒い",
        "reading": "くろい",
        "german": "schwarz",
        "example": "黒い傘です。"
      },
      {
        "japanese": "忘れる",
        "reading": "わすれる",
        "german": "vergessen",
        "example": "電車に忘れました。"
      },
      {
        "japanese": "探す",
        "reading": "さがす",
        "german": "suchen",
        "example": "傘を探しています。"
      }
    ],
    "revision": {
      "writing": "Beschreibe einen verlorenen Gegenstand, wo er verloren ging und frage höflich nach.",
      "speaking": "Frage am Fundbüro nach einem schwarzen Regenschirm und beschreibe den Verlust.",
      "reference": "黒い傘をなくしました。電車に忘れました。傘はありませんか。",
      "features": [
        "傘",
        "ました",
        "ありませんか"
      ],
      "advice": "Sind Gegenstand, Ort, Zeitpunkt und höfliche Frage im Kontext verständlich?"
    },
    "turns": [
      {
        "id": "start",
        "japanese": "どうしましたか。",
        "german": "Was ist passiert?",
        "choices": [
          {
            "id": "right0",
            "japanese": "傘をなくしました。",
            "german": "Ich habe meinen Regenschirm verloren.",
            "explanation": "Der Verlust wird beschrieben.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "電車に傘を忘れました。",
            "german": "Ich habe den Regenschirm im Zug vergessen.",
            "explanation": "Genaue Angabe des Ortes.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "明日は雨です。",
            "german": "Morgen regnet es.",
            "explanation": "Das erklärt den Verlust nicht.",
            "correct": false
          }
        ]
      },
      {
        "id": "second",
        "japanese": "どんな傘ですか。",
        "german": "Was für ein Regenschirm?",
        "choices": [
          {
            "id": "right0",
            "japanese": "黒い傘です。",
            "german": "Ein schwarzer Regenschirm.",
            "explanation": "Die Eigenschaft passt.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "小さい傘です。",
            "german": "Ein kleiner Regenschirm.",
            "explanation": "Auch eine Gegenstandsbeschreibung.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "九時に行きます。",
            "german": "Ich gehe um neun Uhr.",
            "explanation": "Das beschreibt keinen Gegenstand.",
            "correct": false
          }
        ]
      },
      {
        "id": "end",
        "japanese": "こちらの傘ですか。",
        "german": "Ist es dieser Regenschirm?",
        "choices": [
          {
            "id": "right0",
            "japanese": "はい、そうです。ありがとうございます。",
            "german": "Ja, genau. Vielen Dank.",
            "explanation": "Du bestätigst und bedankst dich.",
            "correct": true
          },
          {
            "id": "right1",
            "japanese": "いいえ、違います。",
            "german": "Nein, der ist es nicht.",
            "explanation": "Eine höfliche Korrektur ist möglich.",
            "correct": true
          },
          {
            "id": "wrong",
            "japanese": "電車で行きます。",
            "german": "Ich fahre mit dem Zug.",
            "explanation": "Das beantwortet die Zuordnungsfrage nicht.",
            "correct": false
          }
        ]
      }
    ],
    "exercises": [
      {
        "id": "lostfound-1",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was bedeutet 傘をなくしました?",
        "answer": "Ich habe den Regenschirm verloren.",
        "choices": [
          "Ich kaufe einen Regenschirm.",
          "Ich habe den Regenschirm verloren.",
          "Wo ist das Wetter?"
        ],
        "explanation": "なくしました bezeichnet einen abgeschlossenen Verlust."
      },
      {
        "id": "lostfound-2",
        "mode": "choice",
        "skill": "form_selection",
        "question": "黒い ___ です。",
        "answer": "傘",
        "choices": [
          "傘",
          "を",
          "で"
        ],
        "explanation": "Ein い-Adjektiv steht direkt vor dem Nomen."
      },
      {
        "id": "lostfound-3",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Regenschirm' in Kanji.",
        "answer": "傘",
        "choices": [],
        "explanation": "傘 wird かさ gelesen."
      },
      {
        "id": "lostfound-4",
        "mode": "choice",
        "skill": "form_selection",
        "question": "傘をなくし ___。",
        "answer": "ました",
        "choices": [
          "ません",
          "ました",
          "ましょう"
        ],
        "explanation": "Vergangenheit der höflichen Verbform."
      },
      {
        "id": "lostfound-5",
        "mode": "typed",
        "skill": "production",
        "question": "Schreibe 'Ein schwarzer Regenschirm' ohne Satzzeichen.",
        "answer": "黒い傘",
        "choices": [],
        "explanation": "黒い steht direkt vor 傘."
      },
      {
        "id": "lostfound-6",
        "mode": "choice",
        "skill": "comprehension",
        "question": "Was fragt どんな傘ですか?",
        "answer": "Was für ein Regenschirm ist es?",
        "choices": [
          "Wie viel kostet der Regenschirm?",
          "Was für ein Regenschirm ist es?",
          "Wohin fahren Sie?"
        ],
        "explanation": "どんな erfragt eine Art oder Eigenschaft."
      }
    ]
  }
];

const CONTEXT="p25:";
export function p25Context(scenarioId:string){return CONTEXT+scenarioId;}
export const p25StructuredPrompts:StudyPrompt[]=p25Scenarios.flatMap(scenario=>scenario.exercises.map((exercise,index)=>{
  const base={
    id:"p25-"+exercise.id,
    primaryTarget:{kind:"can_do" as const,id:"p25:"+scenario.id},
    skill:exercise.skill,
    cueFamily:"p25-structured-"+exercise.id,
    instruction:index<2?"Situation verstehen":index<4?"Japanisch anwenden":"In neuen Kontext übertragen",
    prompt:exercise.question,
    acceptedAnswers:[exercise.answer],displayAnswer:exercise.answer,
    explanation:exercise.explanation,
    contextId:p25Context(scenario.id),
    answerNormalization:"japanese" as const,
    sourceId:SOURCE_ID,contentVersion:"p25-1",
    eventMetadata:{p25:true,scenarioId:scenario.id,exerciseId:exercise.id}
  };
  return exercise.mode==="choice"
    ?{...base,promptType:"choice" as const,choices:exercise.choices}
    :{...base,promptType:"typed" as const,placeholder:"Auf Japanisch antworten"};
}));
export function p25DialoguePrompt(scenarioId:string,turn:P25Turn):StudyPrompt{
  return {
    id:"p25-dialogue-"+scenarioId+"-"+turn.id,
    primaryTarget:{kind:"can_do",id:"p25:dialogue:"+scenarioId},
    skill:"comprehension",cueFamily:"p25-dialogue-"+scenarioId+"-"+turn.id,
    promptType:"choice",instruction:"Im Gespräch passend antworten",
    prompt:turn.japanese,promptLanguage:"ja",
    choices:turn.choices.map(choice=>choice.japanese),
    acceptedAnswers:turn.choices.filter(c=>c.correct).map(choice=>choice.japanese),
    displayAnswer:turn.choices.filter(c=>c.correct).map(choice=>choice.japanese).join(" / "),
    explanation:"Wähle eine situationsangemessene Antwort.",
    contextId:p25Context(scenarioId),answerNormalization:"japanese",
    sourceId:SOURCE_ID,contentVersion:"p25-1",
    eventMetadata:{p25:true,scenarioId,turnId:turn.id,kind:"dialogue"}
  };
}
export const p25DialoguePrompts:StudyPrompt[]=p25Scenarios.flatMap(s=>
  s.turns.map(turn=>p25DialoguePrompt(s.id,turn))
);
export const p25Prompts:StudyPrompt[]=[...p25StructuredPrompts,...p25DialoguePrompts];
export const p25Lessons:Record<string,StudyLesson>=Object.fromEntries(p25Scenarios.map(s=>{
  const contextId=p25Context(s.id);
  const lesson:StudyLesson={
    kind:"lesson",id:"p25-original-"+s.id,contextId,title:s.title,
    body:s.situation+"\n\n"+s.mentalModel,
    facts:[
      {label:"Lernziel",value:s.canDo},
      {label:"Wichtiger Unterschied",value:s.contrast},
      {label:"Häufiger Fehler",value:s.pitfall},
      {label:"Transfer",value:s.revision.writing}
    ],
    examples:[
      ...s.words.map(w=>({expression:w.japanese+"（"+w.reading+"）",note:w.german+" · "+w.example})),
      ...s.turns.map(t=>({expression:t.japanese,note:t.german}))
    ],
    sourceLabel:"THIEPN Japanese · original P25 learning material"
  };
  return [contextId,lesson];
}));
export function traceId(prompt:StudyPrompt):string{
  return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
}
export type P25Priority="due"|"retry"|"unseen"|"maintain";
export function promptPriority(
  prompt:StudyPrompt,
  traces:ReadonlyMap<string,MemoryTrace>,
  events:readonly StudyEvent[],
  now=Date.now()
):P25Priority{
  const trace=traces.get(traceId(prompt));
  if(trace&&Date.parse(trace.card.due)<=now)return "due";
  const latest=events.filter(e=>e.metadata?.promptId===prompt.id&&(e.result==="correct"||e.result==="incorrect"))
    .sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt))[0];
  if(latest?.result==="incorrect")return "retry";
  return trace?"maintain":"unseen";
}
const weights:Record<P25Priority,number>={due:4,retry:3,unseen:2,maintain:1};
export interface P25Stats{
  id:string;total:number;attempted:number;due:number;retry:number;
  unseen:number;correct:number;incorrect:number;lastAt?:string;
}
export function p25Stats(
  traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):P25Stats[]{
  const traceMap=new Map(traces.map(trace=>[trace.id,trace]));
  return p25Scenarios.map(s=>{
    const prompts=p25Prompts.filter(p=>p.contextId===p25Context(s.id));
    const priorities=prompts.map(p=>promptPriority(p,traceMap,events,now));
    const graded=events.filter(e=>
      e.contextId===p25Context(s.id)&&e.metadata?.p25===true&&
      (e.result==="correct"||e.result==="incorrect"));
    return {
      id:s.id,total:prompts.length,
      attempted:prompts.filter(p=>traceMap.has(traceId(p))).length,
      due:priorities.filter(p=>p==="due").length,
      retry:priorities.filter(p=>p==="retry").length,
      unseen:priorities.filter(p=>p==="unseen").length,
      correct:graded.filter(e=>e.result==="correct").length,
      incorrect:graded.filter(e=>e.result==="incorrect").length,
      ...(graded.length?{lastAt:graded.map(e=>e.occurredAt).sort().at(-1)!}:{})
    };
  });
}
export function recommendP25(stats:readonly P25Stats[]):string{
  const sorted=[...stats].sort((a,b)=>
    b.due-a.due||b.retry-a.retry||b.unseen-a.unseen||a.attempted-b.attempted
  );
  return sorted[0]?.id??p25Scenarios[0]!.id;
}
/** Due is based on the existing FSRS card, never a synthetic P25 interval. */
export function p25Session(
  scenarioId:string,mode:P25Mode,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):StudyStep[]{
  const s=p25Scenarios.find(s=>s.id===scenarioId);
  if(!s)throw new Error("UNKNOWN_P25_SCENARIO:"+scenarioId);
  const lookup=new Map(traces.map(trace=>[trace.id,trace]));
  const prompts=(mode==="lesson"?p25StructuredPrompts:p25Prompts).filter(p=>p.contextId===p25Context(s.id));
  const scored=prompts.map(prompt=>({prompt,status:promptPriority(prompt,lookup,events,now)}))
    .sort((a,b)=>weights[b.status]-weights[a.status]);
  const selected=mode==="repair"?scored.filter(p=>p.status==="due"||p.status==="retry")
    :mode==="transfer"?scored.filter(p=>p.prompt.skill==="production"||p.status==="due")
    :scored;
  const final=selected.length?selected:(mode==="repair"?scored.filter(p=>p.status==="unseen"):scored);
  const bounded=final.length?final:scored;
  return [p25Lessons[p25Context(s.id)]!,...bounded.map(p=>p.prompt)];
}
export interface RevisionObservations{
  beforeCount:number;afterCount:number;beforeFeatures:string[];afterFeatures:string[];
  addedFeatures:string[];removedFeatures:string[];newWriting:boolean;
}
function featuresOf(text:string,features:readonly string[]):string[]{
  const flat=text.normalize("NFKC").replace(/\s+/gu,"");
  return features.filter(f=>flat.includes(f));
}
/** Non-normative observations. No token count or pattern hit is a semantic or acoustic grade. */
export function observeRevision(
  original:string,revised:string,features:readonly string[]
):RevisionObservations{
  const first=featuresOf(original,features),second=featuresOf(revised,features);
  const chars=(text:string)=>[...text.normalize("NFKC").replace(/[\s。、！？!?「」『』（）・,.]/gu,"")].length;
  return {
    beforeCount:chars(original),afterCount:chars(revised),
    beforeFeatures:first,afterFeatures:second,
    addedFeatures:second.filter(f=>!first.includes(f)),
    removedFeatures:first.filter(f=>!second.includes(f)),
    newWriting:original.normalize("NFKC").trim()!==revised.normalize("NFKC").trim()
  };
}
