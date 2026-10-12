import type {ContinuityScenario} from "./continuity28";
/** Four original A1/A2 repair situations; target ids use the existing continuity engine. */
export const p32ContinuityScenarios:readonly ContinuityScenario[]=[
  {
    "id": "office-way",
    "sourceUnitId": "p26:station-to-campus",
    "destinationUnitId": "p26:library-project",
    "title": "Von der Haltestelle zur Sprechstunde",
    "situation": "Du suchst ein Büro auf dem Campus und fragst unterwegs nach dem Weg.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "事務室を探していますか。",
        "meaning": "Suchst du das Büro?",
        "choices": [
          {
            "japanese": "はい、事務室に行きたいです。",
            "meaning": "Ja, ich möchte ins Büro.",
            "next": "one",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "先生に会いたいです。",
            "meaning": "Ich möchte die Lehrkraft treffen.",
            "next": "two",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "one",
        "partner": "二階にあります。わかりますか。",
        "meaning": "Es ist im zweiten Stock. Verstanden?",
        "choices": [
          {
            "japanese": "はい、わかりました。",
            "meaning": "Ja, verstanden.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "すみません、もう一度お願いします。",
            "meaning": "Entschuldigung, noch einmal bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "two",
        "partner": "先生は図書館にいます。",
        "meaning": "Die Lehrkraft ist in der Bibliothek.",
        "choices": [
          {
            "japanese": "ありがとうございます。行ってみます。",
            "meaning": "Danke, ich gehe hin.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "図書館はどこですか。",
            "meaning": "Wo ist die Bibliothek?",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、お気をつけて。",
        "meaning": "Dann passen Sie gut auf sich auf.",
        "choices": [
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "失礼します。",
            "meaning": "Entschuldigen Sie mich.",
            "next": null,
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      }
    ]
  },
  {
    "id": "library-change",
    "sourceUnitId": "p26:library-project",
    "destinationUnitId": "p25:appointment",
    "title": "Lernort und Zeitpunkt ändern",
    "situation": "Die Bibliothek ist voll und du willst das Treffen retten.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "今日は図書館がいっぱいです。",
        "meaning": "Die Bibliothek ist heute voll.",
        "choices": [
          {
            "japanese": "カフェで勉強しませんか。",
            "meaning": "Wollen wir im Café lernen?",
            "next": "one",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "では、明日はどうですか。",
            "meaning": "Wie wäre morgen?",
            "next": "two",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "one",
        "partner": "カフェは静かですか。",
        "meaning": "Ist das Café ruhig?",
        "choices": [
          {
            "japanese": "午前中なら静かです。",
            "meaning": "Vormittags ist es ruhig.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "少しにぎやかです。",
            "meaning": "Es ist etwas laut.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "two",
        "partner": "明日は何時に会いますか。",
        "meaning": "Wann treffen wir uns morgen?",
        "choices": [
          {
            "japanese": "十時に会いましょう。",
            "meaning": "Treffen wir uns um zehn.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "午後はどうですか。",
            "meaning": "Wie wäre der Nachmittag?",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、また。",
        "meaning": "Dann bis dann.",
        "choices": [
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "よろしくお願いします。",
            "meaning": "Vielen Dank im Voraus.",
            "next": null,
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      }
    ]
  },
  {
    "id": "shopping-receipt",
    "sourceUnitId": "p25:shopping",
    "destinationUnitId": "p26:cafe-conversation",
    "title": "Kassenbon und Bestellkorrektur",
    "situation": "Nach einem Kauf stimmt die Stückzahl auf dem Bon nicht.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "こちらは二つですね。",
        "meaning": "Das sind zwei, richtig?",
        "choices": [
          {
            "japanese": "はい、二つです。",
            "meaning": "Ja, zwei.",
            "next": "one",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "いいえ、一つだけです。",
            "meaning": "Nein, nur einer.",
            "next": "two",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "one",
        "partner": "レシートを確認してください。",
        "meaning": "Prüfen Sie bitte den Kassenbon.",
        "choices": [
          {
            "japanese": "はい、ありがとうございます。",
            "meaning": "Ja, danke.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "すみません、もう一度お願いします。",
            "meaning": "Entschuldigung, noch einmal bitte.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "two",
        "partner": "すみません。一つですね。",
        "meaning": "Entschuldigung, also einer.",
        "choices": [
          {
            "japanese": "はい、一つだけです。",
            "meaning": "Ja, nur einer.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "ありがとうございます。",
            "meaning": "Vielen Dank.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "end",
        "partner": "またお越しください。",
        "meaning": "Kommen Sie gerne wieder.",
        "choices": [
          {
            "japanese": "ありがとうございました。",
            "meaning": "Vielen Dank.",
            "next": null,
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis bald.",
            "next": null,
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      }
    ]
  },
  {
    "id": "weekend-break",
    "sourceUnitId": "p26:weekend-switch",
    "destinationUnitId": "p23:cafe",
    "title": "Vom geänderten Termin ins Café",
    "situation": "Samstag geht nicht, ihr findet einen anderen Tag und einen Treffpunkt.",
    "start": "start",
    "turns": [
      {
        "id": "start",
        "partner": "土曜日は難しいです。",
        "meaning": "Samstag ist schwierig.",
        "choices": [
          {
            "japanese": "日曜日はどうですか。",
            "meaning": "Wie wäre Sonntag?",
            "next": "one",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "来週の金曜日はどうですか。",
            "meaning": "Wie wäre nächsten Freitag?",
            "next": "two",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "one",
        "partner": "日曜日なら大丈夫です。",
        "meaning": "Sonntag passt.",
        "choices": [
          {
            "japanese": "駅で会いましょう。",
            "meaning": "Treffen wir uns am Bahnhof.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "カフェで会いませんか。",
            "meaning": "Wollen wir uns im Café treffen?",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "two",
        "partner": "金曜日は何時がいいですか。",
        "meaning": "Wann passt Freitag?",
        "choices": [
          {
            "japanese": "三時がいいです。",
            "meaning": "Um drei wäre gut.",
            "next": "end",
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "四時なら大丈夫です。",
            "meaning": "Vier würde passen.",
            "next": "end",
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      },
      {
        "id": "end",
        "partner": "では、また。",
        "meaning": "Dann bis dann.",
        "choices": [
          {
            "japanese": "はい、また。",
            "meaning": "Ja, bis dann.",
            "next": null,
            "appropriate": true,
            "note": "Diese passende Antwort verändert das nächste Thema."
          },
          {
            "japanese": "楽しみにしています。",
            "meaning": "Ich freue mich darauf.",
            "next": null,
            "appropriate": true,
            "note": "Eine andere passende kommunikative Absicht mit eigenem Fortgang."
          }
        ]
      }
    ]
  }
];
