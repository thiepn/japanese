import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";

/** All scenarios and sentences are original THIEPN teaching content, not textbook transcriptions. */
export type PedagogyMode="lesson"|"repair";
type PedagogySkill="comprehension"|"form_selection"|"production";
export interface PedagogyQuestion {
  id:string;mode:"choice"|"typed";skill:PedagogySkill;prompt:string;answer:string;
  choices:string[];explanation:string;
}
export interface PedagogyScenario {
  id:string;level:"A1"|"A2";title:string;canDo:string;situation:string;
  model:string;contrast:string;trap:string;transfer:string;
  words:{written:string;reading:string;meaning:string;example:string}[];
  dialogue:{speaker:string;japanese:string;german:string}[];
  questions:PedagogyQuestion[];
}

export const pedagogyScenarios:readonly PedagogyScenario[]=[
  {
    "id": "greetings",
    "level": "A1",
    "title": "Ankommen und begrüßen",
    "canDo": "Ich kann in einer neuen Situation höflich begrüßen und mich verabschieden.",
    "situation": "Du begegnest zum ersten Mal einer Lehrerin auf dem Flur.",
    "model": "Die Wahl der Grußformel hängt von Tageszeit, Verhältnis und Situation ab. Höfliche Formeln sind für erste Begegnungen sicher.",
    "contrast": "おはようございます ist höflich; おはよう ist vertrauter. こんにちは gilt nicht als morgendliche Standardbegrüßung.",
    "trap": "Das は in こんにちは gehört historisch zur Grußformel und wird wa gesprochen.",
    "words": [
      {
        "written": "先生",
        "reading": "せんせい",
        "meaning": "Lehrkraft",
        "example": "先生、おはようございます。"
      },
      {
        "written": "はじめまして",
        "reading": "はじめまして",
        "meaning": "Freut mich, Sie kennenzulernen",
        "example": "はじめまして。"
      },
      {
        "written": "また",
        "reading": "また",
        "meaning": "wieder / bis dann",
        "example": "また、あした。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "おはようございます。",
        "german": "Guten Morgen."
      },
      {
        "speaker": "B",
        "japanese": "おはようございます。",
        "german": "Guten Morgen."
      }
    ],
    "transfer": "Stell dir ein formelles und ein lockeres Treffen vor. Formuliere jeweils die passende Begrüßung.",
    "questions": [
      {
        "id": "greetings-1",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Du triffst deine neue Lehrerin um 8 Uhr. Was sagst du?",
        "answer": "おはようございます",
        "choices": [
          "こんばんは",
          "おはようございます",
          "おやすみなさい",
          "さようなら"
        ],
        "explanation": "Die höfliche Morgenformel passt zu einer neuen Lehrkraft."
      },
      {
        "id": "greetings-2",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "Ein Mitschüler sagt はじめまして. Welche Erwiderung passt?",
        "answer": "はじめまして",
        "choices": [
          "いただきます",
          "はじめまして",
          "ただいま",
          "おやすみ"
        ],
        "explanation": "Die Begrüßung kann bei einer ersten Vorstellung erwidert werden."
      },
      {
        "id": "greetings-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Schreibe die höfliche Grußformel für den Abend.",
        "answer": "こんばんは",
        "choices": [],
        "explanation": "こんばんは ist die konventionelle Abendbegrüßung."
      },
      {
        "id": "greetings-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welche Aussage ist korrekt?",
        "answer": "こんにちは ist eine Tagesgrußformel.",
        "choices": [
          "こんにちは ist immer ein Abschiedsgruß.",
          "こんにちは ist eine Tagesgrußformel.",
          "おやすみなさい heißt Guten Morgen.",
          "はじめまして heißt Bis morgen."
        ],
        "explanation": "Grüße hängen vom sozialen und zeitlichen Kontext ab."
      }
    ]
  },
  {
    "id": "introduction",
    "level": "A1",
    "title": "Sich vorstellen und nachfragen",
    "canDo": "Ich kann meinen Namen sagen und höflich nach dem Namen anderer fragen.",
    "situation": "Beim ersten Kurstreffen stellst du dich einer anderen Person vor.",
    "model": "Mit A は B です führst du A als Thema ein und gibst Information über A. Die Fragepartikel か steht am Satzende.",
    "contrast": "私は学生です ist eine Aussage über mich. お名前は何ですか fragt nach dem Namen, nicht nach einem Ort.",
    "trap": "は ist als Themenpartikel wa, nicht ha. です ist keine ます-Endung und wird nicht an ein Verb gehängt.",
    "words": [
      {
        "written": "名前",
        "reading": "なまえ",
        "meaning": "Name",
        "example": "お名前は何ですか。"
      },
      {
        "written": "学生",
        "reading": "がくせい",
        "meaning": "Studierende/r",
        "example": "私は学生です。"
      },
      {
        "written": "日本語",
        "reading": "にほんご",
        "meaning": "Japanisch",
        "example": "日本語を勉強しています。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "お名前は何ですか。",
        "german": "Wie heißen Sie?"
      },
      {
        "speaker": "B",
        "japanese": "田中です。よろしくお願いします。",
        "german": "Ich bin Tanaka. Freut mich."
      }
    ],
    "transfer": "Stell dich in zwei Sätzen vor und frage dein Gegenüber nach dem Namen.",
    "questions": [
      {
        "id": "introduction-1",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "私は学生 ___。",
        "answer": "です",
        "choices": [
          "ます",
          "です",
          "を",
          "の"
        ],
        "explanation": "Bei Nomen steht im höflichen Aussagesatz です."
      },
      {
        "id": "introduction-2",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welche Frage erkundigt sich nach dem Namen?",
        "answer": "お名前は何ですか。",
        "choices": [
          "どこですか。",
          "お名前は何ですか。",
          "何時ですか。",
          "いくらですか。"
        ],
        "explanation": "名前 bezeichnet den Namen; 何ですか erfragt die Information."
      },
      {
        "id": "introduction-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Vervollständige: わたし ___ がくせいです。",
        "answer": "は",
        "choices": [],
        "explanation": "は führt das Gesprächsthema ein."
      },
      {
        "id": "introduction-4",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "Welcher Satz ist höflich und grammatisch passend?",
        "answer": "私は学生です。",
        "choices": [
          "私は学生ます。",
          "私は学生です。",
          "私は学生を。",
          "私は学生か。"
        ],
        "explanation": "Bei nominalen Aussagen nutzt die höfliche Form です."
      }
    ]
  },
  {
    "id": "ownership",
    "level": "A1",
    "title": "Dinge erkennen und zuordnen",
    "canDo": "Ich kann Gegenstände zeigen, benennen und Besitz ausdrücken.",
    "situation": "Im Kursraum wurden Bücher vertauscht. Du suchst dein Buch.",
    "model": "これ steht selbstständig für 'dies hier'. この braucht ein folgendes Nomen. の verbindet Personen oder Eigenschaften mit einem Nomen.",
    "contrast": "これは本です = Das hier ist ein Buch. この本は私のです = Dieses Buch gehört mir.",
    "trap": "この und これ lassen sich nicht austauschen: この本, aber これは.",
    "words": [
      {
        "written": "本",
        "reading": "ほん",
        "meaning": "Buch",
        "example": "これは私の本です。"
      },
      {
        "written": "これ",
        "reading": "これ",
        "meaning": "dies hier",
        "example": "これは何ですか。"
      },
      {
        "written": "私の",
        "reading": "わたしの",
        "meaning": "mein / meine",
        "example": "私の本です。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "これはだれの本ですか。",
        "german": "Wessen Buch ist das?"
      },
      {
        "speaker": "B",
        "japanese": "私の本です。",
        "german": "Das ist mein Buch."
      }
    ],
    "transfer": "Zeige auf zwei Gegenstände und sage, wem sie gehören.",
    "questions": [
      {
        "id": "ownership-1",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "___ 本は私のです。",
        "answer": "この",
        "choices": [
          "これ",
          "この",
          "ここ",
          "どこ"
        ],
        "explanation": "この muss direkt vor einem Nomen stehen."
      },
      {
        "id": "ownership-2",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Was bedeutet これは私の本です。?",
        "answer": "Das ist mein Buch.",
        "choices": [
          "Wo ist das Buch?",
          "Das ist mein Buch.",
          "Ich lese das Buch.",
          "Das Buch ist neu."
        ],
        "explanation": "の stellt hier den Besitzbezug her."
      },
      {
        "id": "ownership-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Ergänze den Besitzpartikel: 私 ___ 本",
        "answer": "の",
        "choices": [],
        "explanation": "私の本 bedeutet mein Buch."
      },
      {
        "id": "ownership-4",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "Welcher Satz ist passend?",
        "answer": "これは本です。",
        "choices": [
          "このは本です。",
          "これは本です。",
          "これ本はです。",
          "ここは本です。"
        ],
        "explanation": "これ ist ein selbstständiges Demonstrativpronomen."
      }
    ]
  },
  {
    "id": "places",
    "level": "A1",
    "title": "Orte und Anwesenheit erklären",
    "canDo": "Ich kann sagen, wo Personen oder Gegenstände sind und wo etwas passiert.",
    "situation": "Eine Freundin sucht die Lehrkraft und den Schlüssel im Campusgebäude.",
    "model": "に markiert oft den Ort, an dem etwas existiert; で markiert den Ort einer Handlung. います steht typischerweise bei Lebewesen, あります bei Dingen.",
    "contrast": "教室に先生がいます = Im Unterrichtsraum ist eine Lehrkraft. 教室で勉強します = Im Unterrichtsraum lerne ich.",
    "trap": "Nicht automatisch で für jeden Ort verwenden: Bei あります / います ist der Existenzort üblicherweise mit に markiert.",
    "words": [
      {
        "written": "教室",
        "reading": "きょうしつ",
        "meaning": "Unterrichtsraum",
        "example": "教室に先生がいます。"
      },
      {
        "written": "鍵",
        "reading": "かぎ",
        "meaning": "Schlüssel",
        "example": "鍵があります。"
      },
      {
        "written": "図書館",
        "reading": "としょかん",
        "meaning": "Bibliothek",
        "example": "図書館で勉強します。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "先生はどこにいますか。",
        "german": "Wo ist die Lehrkraft?"
      },
      {
        "speaker": "B",
        "japanese": "教室にいます。",
        "german": "Sie ist im Unterrichtsraum."
      }
    ],
    "transfer": "Beschreibe, wo eine Person ist und wo du normalerweise lernst.",
    "questions": [
      {
        "id": "places-1",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "図書館 ___ 勉強します。",
        "answer": "で",
        "choices": [
          "を",
          "に",
          "で",
          "の"
        ],
        "explanation": "Eine Handlung findet an einem Ort statt: で."
      },
      {
        "id": "places-2",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "教室 ___ 先生がいます。",
        "answer": "に",
        "choices": [
          "で",
          "を",
          "と",
          "に"
        ],
        "explanation": "に markiert den Existenzort."
      },
      {
        "id": "places-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Ergänze: 机の上に本が ___。",
        "answer": "あります",
        "choices": [],
        "explanation": "Ein Buch ist ein unbelebtes Objekt; あります."
      },
      {
        "id": "places-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Was beschreibt 教室で勉強します。?",
        "answer": "Im Unterrichtsraum lernen.",
        "choices": [
          "Im Unterrichtsraum lernen.",
          "Eine Lehrkraft ist dort.",
          "Das Buch liegt dort.",
          "Der Unterrichtsraum gehört mir."
        ],
        "explanation": "で markiert hier den Ort des Lernens."
      }
    ]
  },
  {
    "id": "routine",
    "level": "A1",
    "title": "Über den Alltag sprechen",
    "canDo": "Ich kann tägliche Handlungen und höfliche Verneinung ausdrücken.",
    "situation": "Du berichtest einem neuen Tandempartner von deinem Studienalltag.",
    "model": "Das Verb steht gewöhnlich am Ende des japanischen Satzes. を markiert das direkte Objekt, で den Handlungsort. 〜ます ist höflich bejahend, 〜ません höflich verneinend.",
    "contrast": "本を読みます = Ich lese ein Buch. 今日は本を読みません = Heute lese ich kein Buch.",
    "trap": "を wird beim Objekt 'o' ausgesprochen; で beim Handlungsort ist keine Alternative zum Objektpartikel.",
    "words": [
      {
        "written": "毎日",
        "reading": "まいにち",
        "meaning": "jeden Tag",
        "example": "毎日、日本語を勉強します。"
      },
      {
        "written": "読む",
        "reading": "よむ",
        "meaning": "lesen",
        "example": "本を読みます。"
      },
      {
        "written": "勉強する",
        "reading": "べんきょうする",
        "meaning": "lernen",
        "example": "大学で勉強します。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "毎日、日本語を勉強しますか。",
        "german": "Lernst du täglich Japanisch?"
      },
      {
        "speaker": "B",
        "japanese": "はい、毎日勉強します。",
        "german": "Ja, ich lerne jeden Tag."
      }
    ],
    "transfer": "Schreibe zwei Dinge, die du täglich tust, und eines, das du heute nicht tust.",
    "questions": [
      {
        "id": "routine-1",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "毎日、学校 ___ 日本語を勉強します。",
        "answer": "で",
        "choices": [
          "を",
          "で",
          "に",
          "の"
        ],
        "explanation": "Der Ort der Handlung wird mit で markiert."
      },
      {
        "id": "routine-2",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "本 ___ 読みます。",
        "answer": "を",
        "choices": [
          "に",
          "で",
          "の",
          "を"
        ],
        "explanation": "本 ist das direkte Objekt des Lesens."
      },
      {
        "id": "routine-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Ergänze die höfliche Verneinung: 今日は行き ___。",
        "answer": "ません",
        "choices": [],
        "explanation": "ません bildet die höfliche nichtvergangene Negation."
      },
      {
        "id": "routine-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Was bedeutet 今日は学校に行きません。?",
        "answer": "Heute gehe ich nicht zur Schule.",
        "choices": [
          "Ich ging gestern zur Schule.",
          "Heute gehe ich nicht zur Schule.",
          "Ich arbeite heute in der Schule.",
          "Morgen gehe ich zur Schule."
        ],
        "explanation": "ません ist höflich verneinend; 今日は setzt den heutigen Kontext."
      }
    ]
  },
  {
    "id": "cafe",
    "level": "A1",
    "title": "Im Café bestellen",
    "canDo": "Ich kann etwas bestellen und höflich nach dem Preis fragen.",
    "situation": "Du bist in einem kleinen Café und möchtest ein Getränk bestellen.",
    "model": "Nomen + をください ist eine praktische höfliche Bitte um eine Sache. いくらですか fragt nach dem Preis. Zählwörter werden passend zum Gegenstand gewählt.",
    "contrast": "お茶をください ist eine Bitte um Tee; お茶を飲みます ist die Aussage, dass man Tee trinkt.",
    "trap": "Das Verb ください nicht automatisch mit jeder Verbbasis verwenden; Handlungsbitten erfordern andere Formen wie 〜てください.",
    "words": [
      {
        "written": "お茶",
        "reading": "おちゃ",
        "meaning": "Tee",
        "example": "お茶をください。"
      },
      {
        "written": "一つ",
        "reading": "ひとつ",
        "meaning": "ein Stück / einmal",
        "example": "ケーキを一つください。"
      },
      {
        "written": "いくら",
        "reading": "いくら",
        "meaning": "wie viel (Preis)",
        "example": "これはいくらですか。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "ご注文は？",
        "german": "Was möchten Sie bestellen?"
      },
      {
        "speaker": "B",
        "japanese": "お茶を一つください。",
        "german": "Einen Tee bitte."
      }
    ],
    "transfer": "Bestelle zwei Dinge, frage nach dem Preis und bedanke dich.",
    "questions": [
      {
        "id": "cafe-1",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welche Frage verwendet man für den Preis?",
        "answer": "いくらですか。",
        "choices": [
          "いつですか。",
          "だれですか。",
          "いくらですか。",
          "どこですか。"
        ],
        "explanation": "いくら erfragt einen Geldbetrag."
      },
      {
        "id": "cafe-2",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "お茶 ___ ください。",
        "answer": "を",
        "choices": [
          "で",
          "を",
          "に",
          "が"
        ],
        "explanation": "を markiert den gewünschten Gegenstand."
      },
      {
        "id": "cafe-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Ergänze die Bitte: ケーキを一つ ___。",
        "answer": "ください",
        "choices": [],
        "explanation": "ください macht aus dieser Nominalkonstruktion eine höfliche Bitte."
      },
      {
        "id": "cafe-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welche Äußerung ist eine Bestellung?",
        "answer": "水をください。",
        "choices": [
          "水があります。",
          "水が好きです。",
          "水をください。",
          "水はどこですか。"
        ],
        "explanation": "Eine Bitte um einen Gegenstand hat die Form 〜をください."
      }
    ]
  },
  {
    "id": "plans",
    "level": "A2",
    "title": "Gemeinsam etwas planen",
    "canDo": "Ich kann eine Einladung aussprechen, höflich ablehnen und einen Vorschlag machen.",
    "situation": "Am Wochenende möchtest du mit einer Freundin einen Park besuchen.",
    "model": "〜ませんか ist eine höfliche Einladung; 〜ましょう bietet gemeinsames Handeln an. Antworten hängen vom sozialen Kontext ab.",
    "contrast": "公園に行きませんか = Wollen wir in den Park gehen? 行きましょう = Gehen wir!",
    "trap": "Eine höfliche Ablehnung sollte im Gespräch oft mit einem kurzen Grund oder einer Alternative ergänzt werden.",
    "words": [
      {
        "written": "週末",
        "reading": "しゅうまつ",
        "meaning": "Wochenende",
        "example": "週末は空いていますか。"
      },
      {
        "written": "公園",
        "reading": "こうえん",
        "meaning": "Park",
        "example": "公園に行きませんか。"
      },
      {
        "written": "一緒に",
        "reading": "いっしょに",
        "meaning": "zusammen",
        "example": "一緒に行きましょう。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "土曜日、公園に行きませんか。",
        "german": "Wollen wir am Samstag in den Park gehen?"
      },
      {
        "speaker": "B",
        "japanese": "いいですね。行きましょう。",
        "german": "Gute Idee. Gehen wir!"
      }
    ],
    "transfer": "Lade jemanden ein und formuliere alternativ eine höfliche Absage mit anderem Terminvorschlag.",
    "questions": [
      {
        "id": "plans-1",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welche Formulierung ist eine Einladung?",
        "answer": "一緒に行きませんか。",
        "choices": [
          "一緒に行きました。",
          "一緒に行きませんか。",
          "一緒に行きませんでした。",
          "一緒に行きません。"
        ],
        "explanation": "Die Frage 〜ませんか dient oft einer Einladung."
      },
      {
        "id": "plans-2",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "いいですね。行き ___。",
        "answer": "ましょう",
        "choices": [
          "ません",
          "ました",
          "ましょう",
          "です"
        ],
        "explanation": "ましょう signalisiert den gemeinsamen Vorschlag."
      },
      {
        "id": "plans-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Vervollständige die Einladung: 映画を見 ___ か。",
        "answer": "ません",
        "choices": [],
        "explanation": "見ませんか ist eine höfliche Einladung."
      },
      {
        "id": "plans-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Was drückt 行きましょう。 aus?",
        "answer": "Lass uns gehen.",
        "choices": [
          "Ich ging.",
          "Ich gehe nicht.",
          "Lass uns gehen.",
          "Wohin geht es?"
        ],
        "explanation": "ましょう schlägt gemeinsames Handeln vor."
      }
    ]
  },
  {
    "id": "past",
    "level": "A2",
    "title": "Von einem Erlebnis erzählen",
    "canDo": "Ich kann über vergangene Aktivitäten berichten und nach einem Grund fragen.",
    "situation": "Am Montag erzählst du, was du am Wochenende gemacht hast.",
    "model": "Bei höflichen Verben markiert 〜ました Vergangenes; 〜ませんでした verneint vergangene Handlungen. 〜から kann einen Grund erklären.",
    "contrast": "昨日、映画を見ました = Gestern habe ich einen Film gesehen. 見ませんでした = Ich habe ihn nicht gesehen.",
    "trap": "Das Zeitwort 昨日 allein macht ein Verb nicht zur Vergangenheit; die Verbform muss zum Bericht passen.",
    "words": [
      {
        "written": "昨日",
        "reading": "きのう",
        "meaning": "gestern",
        "example": "昨日、映画を見ました。"
      },
      {
        "written": "週末",
        "reading": "しゅうまつ",
        "meaning": "Wochenende",
        "example": "週末は何をしましたか。"
      },
      {
        "written": "雨",
        "reading": "あめ",
        "meaning": "Regen",
        "example": "雨でしたから、家にいました。"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "japanese": "週末は何をしましたか。",
        "german": "Was hast du am Wochenende gemacht?"
      },
      {
        "speaker": "B",
        "japanese": "映画を見ました。",
        "german": "Ich habe einen Film angesehen."
      }
    ],
    "transfer": "Schreibe drei Sätze über dein Wochenende, darunter eine Verneinung und eine Begründung.",
    "questions": [
      {
        "id": "past-1",
        "mode": "choice",
        "skill": "form_selection",
        "prompt": "昨日、映画を見 ___。",
        "answer": "ました",
        "choices": [
          "ます",
          "ません",
          "ました",
          "ましょう"
        ],
        "explanation": "Das vergangene Ereignis verlangt die höfliche Vergangenheitsform."
      },
      {
        "id": "past-2",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Was bedeutet 先週、学校に行きませんでした。?",
        "answer": "Letzte Woche ging ich nicht zur Schule.",
        "choices": [
          "Ich gehe nicht zur Schule.",
          "Letzte Woche ging ich nicht zur Schule.",
          "Morgen gehe ich zur Schule.",
          "Ich war gestern im Park."
        ],
        "explanation": "ませんでした ist die höfliche Vergangenheitsverneinung."
      },
      {
        "id": "past-3",
        "mode": "typed",
        "skill": "production",
        "prompt": "Ergänze die Vergangenheitsverneinung: 食べ ___。",
        "answer": "ませんでした",
        "choices": [],
        "explanation": "ませんでした ist die Vergangenheitsverneinung."
      },
      {
        "id": "past-4",
        "mode": "choice",
        "skill": "comprehension",
        "prompt": "Welcher Ausdruck kann einen Grund einleiten?",
        "answer": "から",
        "choices": [
          "から",
          "を",
          "へ",
          "か"
        ],
        "explanation": "から kann nach einem Satzgrund stehen."
      }
    ]
  }
];

const CONTEXT_PREFIX="p23:context:";
const SOURCE="thiepn-original";
export function scenarioContextId(id:string):string{return CONTEXT_PREFIX+id;}
export const pedagogyPrompts:StudyPrompt[]=pedagogyScenarios.flatMap(scenario=>scenario.questions.map((q,index)=>{
  const base={
    id:"p23-"+q.id,
    primaryTarget:{kind:"can_do" as const,id:"p23:"+scenario.id},
    skill:q.skill,
    cueFamily:"p23-"+q.id,
    instruction:index===0?"Situation verstehen":index===1?"Im Kontext entscheiden":index===2?"Aktiv abrufen":"Übertragen und unterscheiden",
    prompt:q.prompt,
    acceptedAnswers:[q.answer],displayAnswer:q.answer,explanation:q.explanation,
    contextId:scenarioContextId(scenario.id),
    sourceId:SOURCE,contentVersion:"p23-1",
    answerNormalization:"japanese" as const,
    eventMetadata:{pedagogy23:true,scenarioId:scenario.id,level:scenario.level}
  };
  return q.mode==="choice"
    ?{...base,promptType:"choice" as const,choices:q.choices}
    :{...base,promptType:"typed" as const,placeholder:"Japanisch eingeben"};
}));
export const pedagogyLessons:Record<string,StudyLesson>=Object.fromEntries(pedagogyScenarios.map(scenario=>{
  const lesson:StudyLesson={
    kind:"lesson",id:"p23-intro-"+scenario.id,contextId:scenarioContextId(scenario.id),
    title:scenario.title,body:scenario.situation+"\n\n"+scenario.model,
    facts:[
      {label:"Lernziel",value:scenario.canDo},
      {label:"Kontrast",value:scenario.contrast},
      {label:"Häufiger Fehler",value:scenario.trap},
      {label:"Selbst anwenden",value:scenario.transfer}
    ],
    examples:[
      ...scenario.words.map(word=>({expression:word.written+"（"+word.reading+"）",note:word.meaning+" · "+word.example})),
      ...scenario.dialogue.map(line=>({expression:line.speaker+": "+line.japanese,note:line.german}))
    ],
    sourceLabel:"THIEPN Japanese · original contextual pedagogy"
  };
  return [lesson.contextId,lesson];
}));
export interface PedagogyProgress {
  scenarioId:string;attempts:number;correct:number;incorrect:number;
  practicedPrompts:number;totalPrompts:number;due:number;needsRepair:boolean;
}
export function pedagogyProgress(
  traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):PedagogyProgress[]{
  const byTrace=new Map(traces.map(t=>[t.id,t]));
  return pedagogyScenarios.map(scenario=>{
    const prompts=pedagogyPrompts.filter(p=>p.contextId===scenarioContextId(scenario.id));
    const ids=new Set(prompts.map(p=>p.id));
    const relevant=events.filter(event=>
      event.contextId===scenarioContextId(scenario.id)&&
      typeof event.metadata?.promptId==="string"&&ids.has(event.metadata.promptId)&&
      (event.result==="correct"||event.result==="incorrect")
    );
    const recent=relevant.slice().sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt)).slice(0,8);
    const incorrect=relevant.filter(e=>e.result==="incorrect").length;
    const due=prompts.filter(prompt=>{
      const id="can_do:"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
      const trace=byTrace.get(id);
      return Boolean(trace)&&Date.parse(trace!.card.due)<=now;
    }).length;
    return {
      scenarioId:scenario.id,attempts:relevant.length,
      correct:relevant.length-incorrect,incorrect,
      practicedPrompts:new Set(relevant.map(e=>e.metadata?.promptId)).size,
      totalPrompts:prompts.length,due,
      needsRepair:recent.some(e=>e.result==="incorrect")||due>0
    };
  });
}
/** Recommendations are projections of existing StudyEvents/FSRS, not a second mastery store. */
export function recommendPedagogyScenario(progress:readonly PedagogyProgress[]):string{
  const due=progress.filter(p=>p.due>0).sort((a,b)=>b.due-a.due);
  if(due.length)return due[0]!.scenarioId;
  const repair=progress.filter(p=>p.needsRepair&&p.attempts>0);
  if(repair.length)return repair[0]!.scenarioId;
  return progress.find(p=>p.practicedPrompts<p.totalPrompts)?.scenarioId??pedagogyScenarios[0]!.id;
}
export function pedagogySession(
  scenarioId:string,mode:PedagogyMode,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):StudyStep[]{
  const scenario=pedagogyScenarios.find(s=>s.id===scenarioId);
  if(!scenario)throw new Error("UNKNOWN_P23_SCENARIO:"+scenarioId);
  const context=scenarioContextId(scenarioId);
  const prompts=pedagogyPrompts.filter(p=>p.contextId===context);
  if(mode==="lesson")return [pedagogyLessons[context]!,...prompts];
  const byTrace=new Map(traces.map(t=>[t.id,t]));
  const latest=new Map<string,StudyEvent>();
  for(const event of events){
    if(event.contextId!==context||typeof event.metadata?.promptId!=="string")continue;
    const id=event.metadata.promptId;
    if(!latest.has(id)||latest.get(id)!.occurredAt<event.occurredAt)latest.set(id,event);
  }
  const priority=(p:StudyPrompt):number=>{
    const id="can_do:"+p.primaryTarget.id+":"+p.skill+":"+p.cueFamily;
    const trace=byTrace.get(id);
    if(trace&&Date.parse(trace.card.due)<=now)return 3;
    if(latest.get(p.id)?.result==="incorrect")return 2;
    if(!trace)return 1;
    return 0;
  };
  const ranked=[...prompts].sort((a,b)=>priority(b)-priority(a));
  const targeted=ranked.filter(p=>priority(p)>1);
  return [pedagogyLessons[context]!,...(targeted.length?targeted:ranked)];
}
