import type {StudyPrompt} from "@thiepn/study-player";
import {p29ContinuityScenarios} from "./continuity29";
import {p31ContinuityScenarios} from "./continuity31";
import {normalizeP26} from "./pedagogy26";
export interface ContinuityReply{
  japanese:string;meaning:string;next:string|null;appropriate:boolean;note:string;
}
export interface ContinuityTurn{
  id:string;partner:string;meaning:string;choices:readonly ContinuityReply[];
}
export interface ContinuityScenario{
  id:string;sourceUnitId:string;destinationUnitId:string;title:string;situation:string;
  start:string;turns:readonly ContinuityTurn[];
}

const p28ContinuityScenarios:readonly ContinuityScenario[]=[
  {
    "id": "campus-route",
    "sourceUnitId": "p23:places",
    "destinationUnitId": "p25:directions",
    "title": "Vom Klassenraum zum Bahnhof",
    "situation": "Du verabredest einen Weg mit jemandem, der die Stadt noch nicht kennt.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "大学に行きたいですか。",
        "meaning": "Möchten Sie zur Universität?",
        "choices": [
          {
            "japanese": "はい、バスで行きます。",
            "meaning": "Ja, ich fahre mit dem Bus.",
            "next": "one",
            "appropriate": true,
            "note": "Passende Angabe des Verkehrsmittels."
          },
          {
            "japanese": "はい、歩いて行きます。",
            "meaning": "Ja, ich gehe zu Fuß.",
            "next": "two",
            "appropriate": true,
            "note": "Eine ebenso passende andere Reiseroute."
          },
          {
            "japanese": "昨日、映画を見ました。",
            "meaning": "Ich habe gestern einen Film gesehen.",
            "next": "start",
            "appropriate": false,
            "note": "Das beantwortet nicht die Frage nach dem Weg."
          }
        ]
      },
      {
        "id": "one",
        "partner": "バスは何時に出ますか。",
        "meaning": "Wann fährt der Bus?",
        "choices": [
          {
            "japanese": "九時に出ます。",
            "meaning": "Um neun Uhr.",
            "next": "end",
            "appropriate": true,
            "note": "Der Bus hat eine bestimmte Abfahrtszeit."
          },
          {
            "japanese": "十時に出ます。",
            "meaning": "Um zehn Uhr.",
            "next": "end",
            "appropriate": true,
            "note": "Eine alternative Abfahrtszeit."
          },
          {
            "japanese": "本をください。",
            "meaning": "Ein Buch bitte.",
            "next": "one",
            "appropriate": false,
            "note": "Die Anfrage betrifft die Uhrzeit."
          }
        ]
      },
      {
        "id": "two",
        "partner": "どの道を歩きますか。",
        "meaning": "Welchen Weg nehmen Sie zu Fuß?",
        "choices": [
          {
            "japanese": "駅までまっすぐ行きます。",
            "meaning": "Ich gehe geradeaus bis zum Bahnhof.",
            "next": "end",
            "appropriate": true,
            "note": "Eine nachvollziehbare Richtungsangabe."
          },
          {
            "japanese": "公園を通ります。",
            "meaning": "Ich gehe durch den Park.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere Route als Antwort."
          },
          {
            "japanese": "何時ですか。",
            "meaning": "Wie spät ist es?",
            "next": "two",
            "appropriate": false,
            "note": "Es wird nach dem Weg gefragt."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、気をつけてください。",
        "meaning": "Passen Sie auf sich auf.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Eine höfliche Erwiderung."
          },
          {
            "japanese": "はい、ありがとう。",
            "meaning": "Ja, danke.",
            "next": null,
            "appropriate": true,
            "note": "Freundlich und etwas weniger formal."
          },
          {
            "japanese": "いくらですか。",
            "meaning": "Wie viel kostet es?",
            "next": "end",
            "appropriate": false,
            "note": "Die Preisfrage passt nicht zur Verabschiedung."
          }
        ]
      }
    ]
  },
  {
    "id": "cafe-order",
    "sourceUnitId": "p23:cafe",
    "destinationUnitId": "p26:cafe-conversation",
    "title": "Vom Bestellen zur Nachfrage",
    "situation": "Das Personal versteht eine Menge falsch. Du musst die Bestellung bestätigen oder korrigieren.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "コーヒーは二つですか。",
        "meaning": "Sind es zwei Kaffees?",
        "choices": [
          {
            "japanese": "はい、二つください。",
            "meaning": "Ja, zwei bitte.",
            "next": "one",
            "appropriate": true,
            "note": "Die Menge wird bestätigt."
          },
          {
            "japanese": "いいえ、一つだけです。",
            "meaning": "Nein, nur einer.",
            "next": "two",
            "appropriate": true,
            "note": "Du korrigierst höflich die Menge."
          },
          {
            "japanese": "金曜日はどうですか。",
            "meaning": "Wie wäre Freitag?",
            "next": "start",
            "appropriate": false,
            "note": "Das ist kein Antwort auf die Mengenfrage."
          }
        ]
      },
      {
        "id": "one",
        "partner": "ケーキもいりますか。",
        "meaning": "Möchten Sie auch Kuchen?",
        "choices": [
          {
            "japanese": "はい、一つお願いします。",
            "meaning": "Ja, einen bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine zusätzliche Bestellung."
          },
          {
            "japanese": "いいえ、大丈夫です。",
            "meaning": "Nein, danke.",
            "next": "end",
            "appropriate": true,
            "note": "Höfliche Ablehnung der Zusatzbestellung."
          },
          {
            "japanese": "図書館で勉強します。",
            "meaning": "Ich lerne in der Bibliothek.",
            "next": "two",
            "appropriate": false,
            "note": "Die Frage betrifft Kuchen."
          }
        ]
      },
      {
        "id": "two",
        "partner": "では、コーヒーを一つですね。",
        "meaning": "Also einen Kaffee, richtig?",
        "choices": [
          {
            "japanese": "はい、お願いします。",
            "meaning": "Ja, bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Bestätigung der korrekten Menge."
          },
          {
            "japanese": "そうです、ありがとうございます。",
            "meaning": "Genau, vielen Dank.",
            "next": "end",
            "appropriate": true,
            "note": "Eine passende Antwort."
          },
          {
            "japanese": "駅まで行きます。",
            "meaning": "Ich gehe zum Bahnhof.",
            "next": "one",
            "appropriate": false,
            "note": "Die Bestellbestätigung fehlt."
          }
        ]
      },
      {
        "id": "end",
        "partner": "ありがとうございます。お会計はこちらです。",
        "meaning": "Danke. Bitte hier bezahlen.",
        "choices": [
          {
            "japanese": "現金で払います。",
            "meaning": "Ich zahle bar.",
            "next": null,
            "appropriate": true,
            "note": "Die Zahlungsweise wird genannt."
          },
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Höflicher Abschluss."
          },
          {
            "japanese": "また来週勉強します。",
            "meaning": "Ich lerne nächste Woche wieder.",
            "next": "end",
            "appropriate": false,
            "note": "Die Aussage passt nicht zur Bezahlung."
          }
        ]
      }
    ]
  },
  {
    "id": "weekend-change",
    "sourceUnitId": "p23:plans",
    "destinationUnitId": "p26:weekend-switch",
    "title": "Einladung und Planänderung",
    "situation": "Dein Gegenüber schlägt den Park vor. Du entscheidest und reagierst auf eine Änderung.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "土曜日、公園に行きませんか。",
        "meaning": "Wollen wir Samstag in den Park?",
        "choices": [
          {
            "japanese": "はい、行きましょう。",
            "meaning": "Ja, gehen wir.",
            "next": "one",
            "appropriate": true,
            "note": "Einladung wird angenommen."
          },
          {
            "japanese": "すみません、土曜日はちょっと。",
            "meaning": "Samstag ist schwierig.",
            "next": "two",
            "appropriate": true,
            "note": "Höfliche indirekte Absage."
          },
          {
            "japanese": "私は学生です。",
            "meaning": "Ich studiere.",
            "next": "start",
            "appropriate": false,
            "note": "Die Frage war eine Einladung."
          }
        ]
      },
      {
        "id": "one",
        "partner": "でも、雨が降りそうです。",
        "meaning": "Es sieht aber nach Regen aus.",
        "choices": [
          {
            "japanese": "じゃあ、映画を見ましょう。",
            "meaning": "Dann sehen wir einen Film.",
            "next": "end",
            "appropriate": true,
            "note": "Der Plan wird an das Wetter angepasst."
          },
          {
            "japanese": "カフェに行きませんか。",
            "meaning": "Wollen wir ins Café?",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere geeignete Alternative."
          },
          {
            "japanese": "来週本を返します。",
            "meaning": "Nächste Woche gebe ich das Buch zurück.",
            "next": "one",
            "appropriate": false,
            "note": "Das bezieht sich nicht auf das Wetter."
          }
        ]
      },
      {
        "id": "two",
        "partner": "日曜日ならどうですか。",
        "meaning": "Wie wäre es dann Sonntag?",
        "choices": [
          {
            "japanese": "日曜日なら大丈夫です。",
            "meaning": "Sonntag würde passen.",
            "next": "end",
            "appropriate": true,
            "note": "Die Bedingung wird ausgedrückt."
          },
          {
            "japanese": "日曜日にしましょう。",
            "meaning": "Nehmen wir Sonntag.",
            "next": "end",
            "appropriate": true,
            "note": "Aktiver Vorschlag als Reaktion."
          },
          {
            "japanese": "九時のバスです。",
            "meaning": "Der Bus um neun.",
            "next": "two",
            "appropriate": false,
            "note": "Das beantwortet die Terminanfrage nicht."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、また週末に。",
        "meaning": "Dann bis zum Wochenende.",
        "choices": [
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Kurzer passender Abschluss."
          },
          {
            "japanese": "楽しみにしています。",
            "meaning": "Ich freue mich darauf.",
            "next": null,
            "appropriate": true,
            "note": "Freundlicher Abschluss."
          },
          {
            "japanese": "本は黒いです。",
            "meaning": "Das Buch ist schwarz.",
            "next": "end",
            "appropriate": false,
            "note": "Die Aussage gehört nicht zur Verabschiedung."
          }
        ]
      }
    ]
  },
  {
    "id": "lost-item",
    "sourceUnitId": "p23:ownership",
    "destinationUnitId": "p25:lostfound",
    "title": "Vom Besitz zum Fundbüro",
    "situation": "Ein Gegenstand fehlt. Du musst feststellen, ob er verloren oder nur verlegt ist.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "これはあなたの傘ですか。",
        "meaning": "Ist das Ihr Regenschirm?",
        "choices": [
          {
            "japanese": "はい、私の傘です。",
            "meaning": "Ja, meiner.",
            "next": "one",
            "appropriate": true,
            "note": "Der Gegenstand wird erkannt."
          },
          {
            "japanese": "いいえ、私のではありません。",
            "meaning": "Nein, der ist nicht meiner.",
            "next": "two",
            "appropriate": true,
            "note": "Du verneinst den Besitz."
          },
          {
            "japanese": "カフェで飲みます。",
            "meaning": "Ich trinke im Café.",
            "next": "start",
            "appropriate": false,
            "note": "Der Besitz wurde erfragt."
          }
        ]
      },
      {
        "id": "one",
        "partner": "どこで見つけましたか。",
        "meaning": "Wo haben Sie ihn gefunden?",
        "choices": [
          {
            "japanese": "駅で見つけました。",
            "meaning": "Am Bahnhof.",
            "next": "end",
            "appropriate": true,
            "note": "Der Fundort ist angegeben."
          },
          {
            "japanese": "教室で見つけました。",
            "meaning": "Im Klassenzimmer.",
            "next": "end",
            "appropriate": true,
            "note": "Ein anderer Fundort."
          },
          {
            "japanese": "今日は金曜日です。",
            "meaning": "Heute ist Freitag.",
            "next": "one",
            "appropriate": false,
            "note": "Das ist kein Fundort."
          }
        ]
      },
      {
        "id": "two",
        "partner": "どんな傘をなくしましたか。",
        "meaning": "Was für einen Schirm haben Sie verloren?",
        "choices": [
          {
            "japanese": "黒い傘をなくしました。",
            "meaning": "Ich habe einen schwarzen Schirm verloren.",
            "next": "end",
            "appropriate": true,
            "note": "Beschreibung und Vergangenheit stimmen zusammen."
          },
          {
            "japanese": "小さい傘です。",
            "meaning": "Ein kleiner Schirm.",
            "next": "end",
            "appropriate": true,
            "note": "Kurze passende Beschreibung."
          },
          {
            "japanese": "映画を見たいです。",
            "meaning": "Ich möchte einen Film sehen.",
            "next": "two",
            "appropriate": false,
            "note": "Die Frage betrifft den verlorenen Gegenstand."
          }
        ]
      },
      {
        "id": "end",
        "partner": "わかりました。探してみます。",
        "meaning": "Verstanden, ich werde suchen.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Passender Dank."
          },
          {
            "japanese": "よろしくお願いします。",
            "meaning": "Vielen Dank im Voraus.",
            "next": null,
            "appropriate": true,
            "note": "Höfliche Erwartung an die Hilfe."
          },
          {
            "japanese": "コーヒーをください。",
            "meaning": "Kaffee bitte.",
            "next": "end",
            "appropriate": false,
            "note": "Kein Bezug zum Fundbüro."
          }
        ]
      }
    ]
  },
  {
    "id": "library-meeting",
    "sourceUnitId": "p23:routine",
    "destinationUnitId": "p26:library-project",
    "title": "Von der Lernroutine zur Ausleihe",
    "situation": "Du möchtest gemeinsam lernen und dafür ein Buch ausleihen.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "よく図書館で勉強しますか。",
        "meaning": "Lernen Sie oft in der Bibliothek?",
        "choices": [
          {
            "japanese": "はい、よく勉強します。",
            "meaning": "Ja, oft.",
            "next": "one",
            "appropriate": true,
            "note": "Die Gewohnheit wird bestätigt."
          },
          {
            "japanese": "いいえ、家で勉強します。",
            "meaning": "Nein, ich lerne zu Hause.",
            "next": "two",
            "appropriate": true,
            "note": "Eine andere Gewohnheit."
          },
          {
            "japanese": "二つください。",
            "meaning": "Zwei bitte.",
            "next": "start",
            "appropriate": false,
            "note": "Es geht nicht um eine Bestellung."
          }
        ]
      },
      {
        "id": "one",
        "partner": "日本語の本を借りたいですか。",
        "meaning": "Möchten Sie ein japanisches Buch ausleihen?",
        "choices": [
          {
            "japanese": "はい、借りたいです。",
            "meaning": "Ja, ich möchte es ausleihen.",
            "next": "end",
            "appropriate": true,
            "note": "Wunschform passt."
          },
          {
            "japanese": "借りてもいいですか。",
            "meaning": "Darf ich es ausleihen?",
            "next": "end",
            "appropriate": true,
            "note": "Alternative Erlaubnisfrage."
          },
          {
            "japanese": "昨日雨でした。",
            "meaning": "Gestern regnete es.",
            "next": "one",
            "appropriate": false,
            "note": "Das beantwortet die Ausleihfrage nicht."
          }
        ]
      },
      {
        "id": "two",
        "partner": "では、金曜日に一緒に勉強しませんか。",
        "meaning": "Wollen wir Freitag zusammen lernen?",
        "choices": [
          {
            "japanese": "いいですね。行きましょう。",
            "meaning": "Gute Idee, machen wir es.",
            "next": "end",
            "appropriate": true,
            "note": "Die Einladung wird angenommen."
          },
          {
            "japanese": "金曜日なら大丈夫です。",
            "meaning": "Freitag passt.",
            "next": "end",
            "appropriate": true,
            "note": "Die Zeit wird bestätigt."
          },
          {
            "japanese": "黒い傘です。",
            "meaning": "Ein schwarzer Schirm.",
            "next": "two",
            "appropriate": false,
            "note": "Kein Bezug zum Treffen."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、金曜日に会いましょう。",
        "meaning": "Dann sehen wir uns Freitag.",
        "choices": [
          {
            "japanese": "よろしくお願いします。",
            "meaning": "Freut mich, danke.",
            "next": null,
            "appropriate": true,
            "note": "Höflicher Abschluss."
          },
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Informeller Abschluss."
          },
          {
            "japanese": "駅はどこですか。",
            "meaning": "Wo ist der Bahnhof?",
            "next": "end",
            "appropriate": false,
            "note": "Die Verabredung wird abgeschlossen."
          }
        ]
      }
    ]
  },
  {
    "id": "departure-campus",
    "sourceUnitId": "p25:transport",
    "destinationUnitId": "p26:station-to-campus",
    "title": "Vom Fahrplan zum Campus",
    "situation": "Eine Zugfahrt ändert sich. Du suchst nach einem anderen Weg zur Universität.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "電車は遅れています。どうしますか。",
        "meaning": "Der Zug hat Verspätung. Was tun Sie?",
        "choices": [
          {
            "japanese": "バスで行きます。",
            "meaning": "Ich fahre mit dem Bus.",
            "next": "one",
            "appropriate": true,
            "note": "Das Verkehrsmittel wird gewechselt."
          },
          {
            "japanese": "歩いて行きます。",
            "meaning": "Ich gehe zu Fuß.",
            "next": "two",
            "appropriate": true,
            "note": "Alternative Route."
          },
          {
            "japanese": "赤いのが好きです。",
            "meaning": "Mir gefällt das Rote.",
            "next": "start",
            "appropriate": false,
            "note": "Keine Reiseentscheidung."
          }
        ]
      },
      {
        "id": "one",
        "partner": "バスは何時に出ますか。",
        "meaning": "Wann fährt der Bus?",
        "choices": [
          {
            "japanese": "九時に出ます。",
            "meaning": "Um neun.",
            "next": "end",
            "appropriate": true,
            "note": "Eine Abfahrtszeit."
          },
          {
            "japanese": "十時に出ます。",
            "meaning": "Um zehn.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere Abfahrtszeit."
          },
          {
            "japanese": "本を読んでいます。",
            "meaning": "Ich lese ein Buch.",
            "next": "one",
            "appropriate": false,
            "note": "Die Abfahrtszeit wurde erfragt."
          }
        ]
      },
      {
        "id": "two",
        "partner": "大学まで遠いですか。",
        "meaning": "Ist es weit zur Universität?",
        "choices": [
          {
            "japanese": "いいえ、近いです。",
            "meaning": "Nein, es ist nah.",
            "next": "end",
            "appropriate": true,
            "note": "Eine Einschätzung der Strecke."
          },
          {
            "japanese": "はい、少し遠いです。",
            "meaning": "Ja, etwas weit.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere Streckenbeschreibung."
          },
          {
            "japanese": "先生は学生です。",
            "meaning": "Die Lehrerin ist Studentin.",
            "next": "two",
            "appropriate": false,
            "note": "Die Frage bezieht sich auf Entfernung."
          }
        ]
      },
      {
        "id": "end",
        "partner": "気をつけて行ってください。",
        "meaning": "Gute Fahrt, seien Sie vorsichtig.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Höflicher Abschluss."
          },
          {
            "japanese": "はい、気をつけます。",
            "meaning": "Ja, ich passe auf.",
            "next": null,
            "appropriate": true,
            "note": "Passende Erwiderung."
          },
          {
            "japanese": "いくらですか。",
            "meaning": "Wie viel kostet es?",
            "next": "end",
            "appropriate": false,
            "note": "Die Reiseempfehlung ist der Kontext."
          }
        ]
      }
    ]
  },
  {
    "id": "reschedule",
    "sourceUnitId": "p25:appointment",
    "destinationUnitId": "p26:weekend-switch",
    "title": "Neuer Termin nach einer Absage",
    "situation": "Das Treffen verschiebt sich wegen eines anderen Termins.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "土曜日の予定はどうですか。",
        "meaning": "Wie sieht es Samstag aus?",
        "choices": [
          {
            "japanese": "三時なら大丈夫です。",
            "meaning": "Um drei passt es.",
            "next": "one",
            "appropriate": true,
            "note": "Zeitfenster wird angeboten."
          },
          {
            "japanese": "土曜日は予定があります。",
            "meaning": "Ich habe Samstag etwas vor.",
            "next": "two",
            "appropriate": true,
            "note": "Ein Konflikt wird genannt."
          },
          {
            "japanese": "昨日映画を見ました。",
            "meaning": "Gestern sah ich einen Film.",
            "next": "start",
            "appropriate": false,
            "note": "Die Frage betrifft zukünftige Verfügbarkeit."
          }
        ]
      },
      {
        "id": "one",
        "partner": "三時に会いましょうか。",
        "meaning": "Treffen wir uns um drei?",
        "choices": [
          {
            "japanese": "はい、三時に会いましょう。",
            "meaning": "Ja, um drei.",
            "next": "end",
            "appropriate": true,
            "note": "Der Termin wird bestätigt."
          },
          {
            "japanese": "四時はどうですか。",
            "meaning": "Wie wäre vier?",
            "next": "end",
            "appropriate": true,
            "note": "Eine höfliche Alternative."
          },
          {
            "japanese": "バスで行きます。",
            "meaning": "Ich fahre mit dem Bus.",
            "next": "one",
            "appropriate": false,
            "note": "Das ist keine Zeitbestätigung."
          }
        ]
      },
      {
        "id": "two",
        "partner": "では、日曜日はどうですか。",
        "meaning": "Wie wäre es dann Sonntag?",
        "choices": [
          {
            "japanese": "日曜日なら大丈夫です。",
            "meaning": "Sonntag passt.",
            "next": "end",
            "appropriate": true,
            "note": "Der Alternativtermin passt."
          },
          {
            "japanese": "日曜日に会いましょう。",
            "meaning": "Treffen wir uns Sonntag.",
            "next": "end",
            "appropriate": true,
            "note": "Ein Gegenangebot."
          },
          {
            "japanese": "ケーキを一つください。",
            "meaning": "Ein Stück Kuchen bitte.",
            "next": "two",
            "appropriate": false,
            "note": "Kein Bezug zum Termin."
          }
        ]
      },
      {
        "id": "end",
        "partner": "また連絡しますね。",
        "meaning": "Ich melde mich wieder.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Danke.",
            "next": null,
            "appropriate": true,
            "note": "Höfliche Rückmeldung."
          },
          {
            "japanese": "はい、よろしくお願いします。",
            "meaning": "Ja, gerne.",
            "next": null,
            "appropriate": true,
            "note": "Höfliche Rückmeldung."
          },
          {
            "japanese": "学校に行きます。",
            "meaning": "Ich gehe zur Schule.",
            "next": "end",
            "appropriate": false,
            "note": "Die Unterhaltung wird gerade abgeschlossen."
          }
        ]
      }
    ]
  },
  {
    "id": "shopping-cafe",
    "sourceUnitId": "p25:shopping",
    "destinationUnitId": "p26:cafe-conversation",
    "title": "Vom Einkauf zur Pause",
    "situation": "Nach dem Einkauf möchtest du etwas bestellen und musst einen Preis nachfragen.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "買い物は終わりましたか。",
        "meaning": "Sind Sie mit dem Einkaufen fertig?",
        "choices": [
          {
            "japanese": "はい、終わりました。",
            "meaning": "Ja, ich bin fertig.",
            "next": "one",
            "appropriate": true,
            "note": "Das Einkaufsergebnis wird bestätigt."
          },
          {
            "japanese": "いいえ、まだです。",
            "meaning": "Noch nicht.",
            "next": "two",
            "appropriate": true,
            "note": "Das Einkaufsergebnis wird verneint."
          },
          {
            "japanese": "朝、勉強します。",
            "meaning": "Morgens lerne ich.",
            "next": "start",
            "appropriate": false,
            "note": "Die Frage betrifft den Einkauf."
          }
        ]
      },
      {
        "id": "one",
        "partner": "では、何を飲みますか。",
        "meaning": "Was möchten Sie trinken?",
        "choices": [
          {
            "japanese": "コーヒーをください。",
            "meaning": "Kaffee bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Höfliche Bestellung."
          },
          {
            "japanese": "お茶をお願いします。",
            "meaning": "Einen Tee bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Alternative höfliche Bestellung."
          },
          {
            "japanese": "教室にいます。",
            "meaning": "Ich bin im Klassenraum.",
            "next": "one",
            "appropriate": false,
            "note": "Es wird nach dem Getränk gefragt."
          }
        ]
      },
      {
        "id": "two",
        "partner": "何時にカフェに行きますか。",
        "meaning": "Wann gehen wir ins Café?",
        "choices": [
          {
            "japanese": "四時に行きましょう。",
            "meaning": "Gehen wir um vier.",
            "next": "end",
            "appropriate": true,
            "note": "Ein zeitlicher Vorschlag."
          },
          {
            "japanese": "五時はどうですか。",
            "meaning": "Wie wäre fünf?",
            "next": "end",
            "appropriate": true,
            "note": "Alternativer Terminvorschlag."
          },
          {
            "japanese": "本を借りたいです。",
            "meaning": "Ich möchte ein Buch ausleihen.",
            "next": "two",
            "appropriate": false,
            "note": "Die Frage betrifft die Cafézeit."
          }
        ]
      },
      {
        "id": "end",
        "partner": "ありがとうございます。またどうぞ。",
        "meaning": "Vielen Dank, gerne wieder.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Danke.",
            "next": null,
            "appropriate": true,
            "note": "Höflicher Abschluss."
          },
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis bald.",
            "next": null,
            "appropriate": true,
            "note": "Lockerere passende Antwort."
          },
          {
            "japanese": "駅まで遠いです。",
            "meaning": "Der Bahnhof ist weit.",
            "next": "end",
            "appropriate": false,
            "note": "Keine Verabschiedung."
          }
        ]
      }
    ]
  }
];
export const continuityScenarios:readonly ContinuityScenario[]=[...p28ContinuityScenarios,...p29ContinuityScenarios,...p31ContinuityScenarios];
export function continuityScenariosForUnit(unitId:string):ContinuityScenario[]{
  return continuityScenarios.filter(s=>s.sourceUnitId===unitId);
}
export function continuityForUnit(unitId:string):ContinuityScenario|undefined{
  return continuityScenarios.find(s=>s.sourceUnitId===unitId);
}
export function continuityPrompt(scenario:ContinuityScenario,turn:ContinuityTurn,kind:"typed"|"choice"):StudyPrompt{
  const base={
    id:"p28-continuity-"+kind+"-"+scenario.id+"-"+turn.id,
    primaryTarget:{kind:"can_do" as const,id:"p28:continuity:"+scenario.id},
    skill:(kind==="choice"?"comprehension":"production") as "comprehension"|"production",
    cueFamily:"p28-followup-"+kind+"-"+turn.id,
    prompt:turn.partner,instruction:"In einer verbundenen Situation reagieren",
    promptLanguage:"ja" as const,
    acceptedAnswers:turn.choices.filter(c=>c.appropriate).map(c=>normalizeP26(c.japanese)),
    displayAnswer:turn.choices.find(c=>c.appropriate)?.japanese??"",
    explanation:scenario.situation,
    answerNormalization:"japanese" as const,
    contextId:"p28:continuity:"+scenario.id,
    sourceId:"thiepn-original",contentVersion:"p28-1",
    eventMetadata:{p28:true,scenarioId:scenario.id,sourceUnit:scenario.sourceUnitId,destinationUnit:scenario.destinationUnitId,kind:"continuity-"+kind,turnId:turn.id}
  };
  return kind==="choice"
    ?{...base,promptType:"choice",choices:turn.choices.map(c=>c.japanese)}
    :{...base,promptType:"typed"};
}
export const continuityPrompts:StudyPrompt[]=continuityScenarios.flatMap(s=>s.turns.flatMap(t=>[
  continuityPrompt(s,t,"choice"),continuityPrompt(s,t,"typed")
]));
/** Unknown learner expressions are not marked wrong; navigation remains available. */
export function chooseContinuityNext(turn:ContinuityTurn,reply:string):string|null{
  const normalized=normalizeP26(reply);
  const match=turn.choices.find(c=>normalizeP26(c.japanese)===normalized);
  return match?.next??turn.id;
}
