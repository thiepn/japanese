import type {ContinuityScenario} from "./continuity28";

/** Six original extensions for the existing continuity player, not a separate engine. */
export const p29ContinuityScenarios:readonly ContinuityScenario[]=[
  {
    "id": "first-meeting",
    "sourceUnitId": "p23:greetings",
    "destinationUnitId": "p23:introduction",
    "title": "Vom Gruß zum Kennenlernen",
    "situation": "Nach der Begrüßung erzählt eine neue Kursbekanntschaft, wer sie ist.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "おはようございます。初めまして。",
        "meaning": "Guten Morgen. Freut mich.",
        "choices": [
          {
            "japanese": "おはようございます。初めまして。",
            "meaning": "Guten Morgen, freut mich.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "初めまして。よろしくお願いします。",
            "meaning": "Freut mich, danke.",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "おやすみなさい。",
            "meaning": "Gute Nacht.",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "お名前は何ですか。",
        "meaning": "Wie heißen Sie?",
        "choices": [
          {
            "japanese": "私はマリアです。",
            "meaning": "Ich heiße Maria.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "田中です。よろしくお願いします。",
            "meaning": "Ich heiße Tanaka, freut mich.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "三時に行きます。",
            "meaning": "Ich gehe um drei.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "日本語を勉強していますか。",
        "meaning": "Lernen Sie Japanisch?",
        "choices": [
          {
            "japanese": "はい、日本語を勉強しています。",
            "meaning": "Ja, ich lerne Japanisch.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "はい、大学で勉強しています。",
            "meaning": "Ja, an der Universität.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "バスで行きます。",
            "meaning": "Ich fahre mit dem Bus.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、授業でまた会いましょう。",
        "meaning": "Dann bis zum Kurs.",
        "choices": [
          {
            "japanese": "はい、また会いましょう。",
            "meaning": "Ja, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "よろしくお願いします。",
            "meaning": "Freut mich, danke.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "これはいくらですか。",
            "meaning": "Wie viel kostet das?",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  },
  {
    "id": "meet-and-read",
    "sourceUnitId": "p23:introduction",
    "destinationUnitId": "p26:library-project",
    "title": "Von der Vorstellung zum gemeinsamen Lesen",
    "situation": "Beim Kennenlernen entwickelt sich ein Gespräch über Japanischlernen und ein gemeinsames Buch.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "日本語を勉強していますか。",
        "meaning": "Lernen Sie Japanisch?",
        "choices": [
          {
            "japanese": "はい、大学で勉強しています。",
            "meaning": "Ja, an der Universität.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "はい、家で勉強しています。",
            "meaning": "Ja, zu Hause.",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "お茶を一つください。",
            "meaning": "Einen Tee bitte.",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "大学の図書館に行きますか。",
        "meaning": "Gehen Sie in die Unibibliothek?",
        "choices": [
          {
            "japanese": "はい、よく行きます。",
            "meaning": "Ja, häufig.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "日本語の本を借りたいです。",
            "meaning": "Ich möchte ein japanisches Buch ausleihen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "映画を見ました。",
            "meaning": "Ich habe einen Film gesehen.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "どんな本を読みたいですか。",
        "meaning": "Was für ein Buch möchten Sie lesen?",
        "choices": [
          {
            "japanese": "日本語の本を読みたいです。",
            "meaning": "Ich möchte ein japanisches Buch lesen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "短い本を読みたいです。",
            "meaning": "Ich möchte ein kurzes Buch lesen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "土曜日は雨です。",
            "meaning": "Am Samstag regnet es.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "一緒に図書館で勉強しましょう。",
        "meaning": "Lernen wir zusammen in der Bibliothek.",
        "choices": [
          {
            "japanese": "はい、そうしましょう。",
            "meaning": "Ja, machen wir das.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "赤いかばんをください。",
            "meaning": "Die rote Tasche bitte.",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  },
  {
    "id": "borrowing-followup",
    "sourceUnitId": "p25:library",
    "destinationUnitId": "p25:appointment",
    "title": "Ausleihen und einen Rückgabetermin vereinbaren",
    "situation": "Eine Ausleihe wird zum Gespräch über Abgabe und Treffzeit.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "この本を借りますか。",
        "meaning": "Leihen Sie dieses Buch aus?",
        "choices": [
          {
            "japanese": "はい、借りたいです。",
            "meaning": "Ja, das möchte ich.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "借りてもいいですか。",
            "meaning": "Darf ich es ausleihen?",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "金曜日はちょっと。",
            "meaning": "Freitag passt leider nicht.",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "いつ返しますか。",
        "meaning": "Wann geben Sie das Buch zurück?",
        "choices": [
          {
            "japanese": "来週返します。",
            "meaning": "Nächste Woche.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "金曜日に返します。",
            "meaning": "Am Freitag.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "お茶をください。",
            "meaning": "Einen Tee bitte.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "いつまでに返せますか。",
        "meaning": "Bis wann können Sie es zurückgeben?",
        "choices": [
          {
            "japanese": "来週までに返せます。",
            "meaning": "Bis nächste Woche.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "金曜日までに返します。",
            "meaning": "Bis Freitag.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "バスで行きます。",
            "meaning": "Ich fahre mit dem Bus.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "ありがとうございます。金曜日にお会いしましょう。",
        "meaning": "Danke, sehen wir uns Freitag.",
        "choices": [
          {
            "japanese": "はい、金曜日に。",
            "meaning": "Ja, bis Freitag.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "よろしくお願いします。",
            "meaning": "Vielen Dank im Voraus.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "今週は映画です。",
            "meaning": "Diese Woche ist Film.",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  },
  {
    "id": "directions-to-train",
    "sourceUnitId": "p25:directions",
    "destinationUnitId": "p25:transport",
    "title": "Nach dem Weg den Zug erreichen",
    "situation": "Am Bahnhof benötigst du erst den Weg und dann die Abfahrtsinformation.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "駅にはどうやって行きますか。",
        "meaning": "Wie kommt man zum Bahnhof?",
        "choices": [
          {
            "japanese": "まっすぐ行ってください。",
            "meaning": "Gehen Sie geradeaus.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "右に曲がってください。",
            "meaning": "Biegen Sie rechts ab.",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "友達がいます。",
            "meaning": "Da ist ein Freund.",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "電車は何時に出ますか。",
        "meaning": "Wann fährt der Zug?",
        "choices": [
          {
            "japanese": "九時に出ます。",
            "meaning": "Um neun Uhr.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "十時に出ます。",
            "meaning": "Um zehn Uhr.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "赤いのをください。",
            "meaning": "Das Rote bitte.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "駅はここから遠いですか。",
        "meaning": "Ist es von hier weit zum Bahnhof?",
        "choices": [
          {
            "japanese": "いいえ、近いです。",
            "meaning": "Nein, nah.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "はい、少し遠いです。",
            "meaning": "Ja, etwas weit.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "昨日勉強しました。",
            "meaning": "Gestern habe ich gelernt.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "どうもありがとうございます。",
        "meaning": "Vielen Dank.",
        "choices": [
          {
            "japanese": "どういたしまして。",
            "meaning": "Gern geschehen.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "お気をつけて。",
            "meaning": "Passen Sie auf sich auf.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "ケーキをください。",
            "meaning": "Einen Kuchen bitte.",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  },
  {
    "id": "replacement-umbrella",
    "sourceUnitId": "p25:lostfound",
    "destinationUnitId": "p25:shopping",
    "title": "Nach dem Verlust einen Ersatz finden",
    "situation": "Der verlorene Schirm ist nicht auffindbar. Du fragst im Laden nach einem Ersatz.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "傘は見つかりましたか。",
        "meaning": "Haben Sie den Schirm gefunden?",
        "choices": [
          {
            "japanese": "いいえ、まだです。",
            "meaning": "Nein, noch nicht.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "いいえ、なくしました。",
            "meaning": "Nein, ich habe ihn verloren.",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "図書館で勉強します。",
            "meaning": "Ich lerne in der Bibliothek.",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "どんな傘を探していますか。",
        "meaning": "Was für einen Schirm suchen Sie?",
        "choices": [
          {
            "japanese": "黒い傘を探しています。",
            "meaning": "Ich suche einen schwarzen Schirm.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "赤い傘を探しています。",
            "meaning": "Ich suche einen roten Schirm.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "土曜日に行きましょう。",
            "meaning": "Gehen wir Samstag.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "新しい傘を買いますか。",
        "meaning": "Kaufen Sie einen neuen Schirm?",
        "choices": [
          {
            "japanese": "はい、買いたいです。",
            "meaning": "Ja, ich möchte einen kaufen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "はい、値段はいくらですか。",
            "meaning": "Ja, wie viel kostet er?",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "大学に行きます。",
            "meaning": "Ich gehe zur Uni.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、こちらをどうぞ。",
        "meaning": "Dann bitte, hier ist er.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "これをください。",
            "meaning": "Das hier bitte.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "九時に出ます。",
            "meaning": "Ich fahre um neun los.",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  },
  {
    "id": "study-date",
    "sourceUnitId": "p26:library-project",
    "destinationUnitId": "p25:appointment",
    "title": "Ein Lernprojekt gemeinsam planen",
    "situation": "Für ein Projekt brauchst du einen Ort und einen passenden gemeinsamen Termin.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "今週、一緒に勉強しませんか。",
        "meaning": "Wollen wir diese Woche zusammen lernen?",
        "choices": [
          {
            "japanese": "はい、勉強しましょう。",
            "meaning": "Ja, lernen wir.",
            "next": "one",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "すみません、今週はちょっと。",
            "meaning": "Diese Woche ist schwierig.",
            "next": "two",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "駅はどこですか。",
            "meaning": "Wo ist der Bahnhof?",
            "next": "start",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "one",
        "partner": "金曜日の三時はどうですか。",
        "meaning": "Wie wäre es Freitag um drei?",
        "choices": [
          {
            "japanese": "金曜日なら大丈夫です。",
            "meaning": "Freitag passt.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "四時はどうですか。",
            "meaning": "Wie wäre es mit vier?",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "コーヒーを二つください。",
            "meaning": "Zwei Kaffee bitte.",
            "next": "one",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "two",
        "partner": "来週ならどうですか。",
        "meaning": "Wie wäre es nächste Woche?",
        "choices": [
          {
            "japanese": "来週なら大丈夫です。",
            "meaning": "Nächste Woche passt.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "来週の金曜日に会いましょう。",
            "meaning": "Treffen wir uns nächsten Freitag.",
            "next": "end",
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "映画を見ました。",
            "meaning": "Ich habe einen Film gesehen.",
            "next": "two",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、図書館で会いましょう。",
        "meaning": "Dann treffen wir uns in der Bibliothek.",
        "choices": [
          {
            "japanese": "はい、よろしくお願いします。",
            "meaning": "Ja, vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "ありがとうございます。また。",
            "meaning": "Danke, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Eine kontextbezogene Antwort, die den weiteren Gesprächsverlauf bestimmt."
          },
          {
            "japanese": "赤いのが好きです。",
            "meaning": "Ich mag das Rote.",
            "next": "end",
            "appropriate": false,
            "note": "Die Antwort passt nicht zur aktuellen Frage. Wiederhole oder formuliere eine passende Alternative."
          }
        ]
      }
    ]
  }
];
