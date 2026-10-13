import {authoredP48Case,type P48RawCase} from "./connected48-types";
/** Five original A2 parallel-source and authoritativeness cases. */
export const p48CorpusD=[
  {
    "id": "presentation-peer-critique",
    "title": "Peerfeedback und offizielle Vorgabe",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Studium",
    "goal": "Feedbackempfehlung von verbindlicher Vortragsvorgabe trennen",
    "setup": "Eine Lehrkraft setzt eine kürzere Dauer; ein Mitstudent macht einen Vorschlag für die Gestaltung.",
    "sourceNotes": "Eine Mitstudentenempfehlung kann sinnvoll sein, aber ändert nicht die verbindliche Dauer.",
    "sources": [
      [
        "Mail der Lehrkraft",
        "email",
        1,
        "参加者が増えたため、一人の発表は五分までです。写真は使ってもいいですが、動画は使わないでください。",
        "Wegen mehr Teilnehmern maximal fünf Minuten, Fotos erlaubt, Videos nicht.",
        "Verbindliche Kursvorgabe"
      ],
      [
        "Kommentar der Mitstudentin",
        "message",
        2,
        "写真を二枚ぐらい見せると話しやすいと思う。最初に結論を言うのはどう？",
        "Ich finde, etwa zwei Fotos und Schluss zuerst wären hilfreich.",
        "Empfehlung, kein Zwang"
      ],
      [
        "Letzte Rückfrage",
        "spoken",
        3,
        "先生、例は一つだけでいいですか。—はい。短く説明してください。",
        "Lehrkraft: ein Beispiel genügt, bitte kurz erklären.",
        "Weitere offizielle Präzisierung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welche Vortragsdauer ist verbindlich?",
        "五分までです。",
        "一人五分です。",
        "十分までです。",
        "Die Lehrkraft begrenzt die Rede auf fünf Minuten.",
        [
          [
            0,
            "五分までです",
            "verbindlich"
          ]
        ]
      ],
      [
        "inference",
        "Muss man genau zwei Fotos zeigen?",
        "いいえ、提案だけです。",
        "いいえ、写真は使ってもいいだけです。",
        "はい、二枚が必要です。",
        "写真 sind erlaubt; die Zahl stammt aus einem unverbindlichen Vorschlag.",
        [
          [
            0,
            "写真は使ってもいい",
            "Erlaubnis"
          ],
          [
            1,
            "二枚ぐらい…と思う",
            "Meinung"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Quelle begründet, dass nur ein Beispiel genügt?",
        "先生の最後の返事です。",
        "最後の先生の答えです。",
        "友だちのメッセージです。",
        "Die Lehrkraft bestätigt es auf Nachfrage.",
        [
          [
            2,
            "はい。短く説明してください",
            "offizielle Bestätigung"
          ]
        ]
      ]
    ],
    "writing": [
      "Erkläre deiner Gruppe Pflicht und mögliche Hilfe.",
      "発表は五分までで動画は使えません。写真は使ってもいいです。",
      "発表は五分で、例を一つ話します。",
      "動画を見せて十分話します。",
      "Zeit und Video-Regel wären verletzt."
    ],
    "returnCue": [
      "Anderer Kurs: maximal vier Minuten, Bilder erlaubt, Partner schlägt drei Bilder vor. Unterscheide Vorgabe und Vorschlag.",
      "発表は四分までです。写真は使ってもいいですが、三枚は提案です。",
      "四分以内に話します。写真は自由です。",
      "三枚の写真が必ず必要です。",
      "Der Partner-Vorschlag ist nicht verpflichtend."
    ]
  },
  {
    "id": "language-exchange-changes",
    "title": "Sprachtandem mit widersprüchlichem Treffort",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Sprache",
    "goal": "Zwei Teilnehmernachrichten und Plattformhinweis abstimmen",
    "setup": "In einer Tandemgruppe stimmen Uhrzeit und Ort scheinbar nicht überein.",
    "sourceNotes": "Ein persönlicher Vorschlag ist noch keine bestätigte Änderung; die letzte ausdrückliche Zustimmung klärt den Stand.",
    "sources": [
      [
        "Tandemkalender",
        "schedule",
        1,
        "会話の練習は水曜日の午後四時、図書館の入り口で待ち合わせです。",
        "Mittwoch 16 Uhr Treffpunkt Bibliothekseingang.",
        "Gemeinsame Terminvereinbarung"
      ],
      [
        "Nachricht von Ken",
        "message",
        2,
        "図書館は少し遠いので、駅のカフェで会うのはどうですか。四時なら行けます。",
        "Bibliothek weit; wie wäre Bahnhofscafé? Vier Uhr geht.",
        "Unbestätigter Vorschlag"
      ],
      [
        "Antwort von Mai",
        "message",
        3,
        "カフェでいいですよ。駅の北口のカフェにしましょう。四時に会いましょう。",
        "Café okay, konkretes Café am Nordausgang, vier Uhr.",
        "Ausdrückliche Annahme"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wo treffen sich die Partner jetzt?",
        "駅の北口のカフェです。",
        "北口のカフェで会います。",
        "図書館の入り口です。",
        "Der Vorschlag wurde ausdrücklich angenommen.",
        [
          [
            0,
            "図書館の入り口",
            "vorher"
          ],
          [
            2,
            "北口のカフェにしましょう",
            "aktuell"
          ]
        ]
      ],
      [
        "inference",
        "War die erste Cafénachricht allein bereits eine feste Änderung?",
        "いいえ、提案でした。",
        "いいえ、返事を待っていました。",
        "はい、決定でした。",
        "どうですか markiert zunächst einen Vorschlag.",
        [
          [
            1,
            "会うのはどうですか",
            "Vorschlag"
          ],
          [
            2,
            "カフェでいいですよ",
            "Akzeptanz"
          ]
        ]
      ],
      [
        "evidence",
        "Bleibt die Uhrzeit vier Uhr gültig?",
        "はい、四時のままです。",
        "午後四時に会います。",
        "いいえ、五時です。",
        "Beide Café-Nachrichten bestätigen vier Uhr.",
        [
          [
            1,
            "四時なら行けます",
            "Ken"
          ],
          [
            2,
            "四時に会いましょう",
            "Mai"
          ]
        ]
      ]
    ],
    "writing": [
      "Bestätige den neuen Ort und die Zeit.",
      "水曜日の四時に駅の北口のカフェで会います。",
      "北口のカフェで四時に会いましょう。",
      "図書館の入り口で会います。",
      "Der Treffort wurde gemeinsam geändert."
    ],
    "returnCue": [
      "Neue Tandemgruppe: Bibliothek geplant, Park vorgeschlagen, beide bestätigen Park am Donnerstag 17 Uhr. Bestätige.",
      "木曜日の五時に公園で会いましょう。",
      "木曜日の午後五時に公園へ行きます。",
      "図書館で会います。",
      "Der Park wurde angenommen."
    ]
  },
  {
    "id": "train-bike-mix",
    "title": "Zugticket und Fahrrad-Ersatz",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "domain": "Transport",
    "goal": "Teilroute und Ersatzabschnitt aus Zug- und Radstation kombinieren",
    "setup": "Ein Zug fällt für die letzte Strecke aus; eine Fahrradstation kann den letzten Abschnitt ersetzen.",
    "sourceNotes": "Ein allgemeiner Radverleihplan beweist nicht automatisch aktuelle Verfügbarkeit; der Stationshinweis muss gelesen werden.",
    "sources": [
      [
        "Zugticket",
        "reading",
        1,
        "駅から大学前までの電車を予約しました。午前九時の出発です。",
        "Zug ab Bahnhof um neun bis Universität.",
        "Ausgangsplan"
      ],
      [
        "Aktuelle Bahnansage",
        "announcement",
        2,
        "今日は大学前まで行けません。中央駅まで運転します。中央駅で降りてください。",
        "Zug fährt nur bis Zentralbahnhof, dort aussteigen.",
        "Verbindliche Streckenänderung"
      ],
      [
        "Anzeige an Radstation",
        "notice",
        3,
        "中央駅の貸し自転車は今、全部貸し出し中です。大学へは二番のバスをご利用ください。",
        "Alle Leihräder derzeit ausgeliehen; Bus zwei Richtung Universität.",
        "Verfügbarkeit und Alternative"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wo muss man aus dem Zug steigen?",
        "中央駅です。",
        "中央駅で降ります。",
        "大学前です。",
        "Die aktuelle Ansage verkürzt die Fahrt.",
        [
          [
            0,
            "大学前まで",
            "alter Plan"
          ],
          [
            1,
            "中央駅で降りて",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Kann man sofort ein Fahrrad als Ersatz nutzen?",
        "いいえ、全部貸し出し中です。",
        "貸し自転車はありません。",
        "はい、自転車がたくさんあります。",
        "Die Station meldet keine verfügbaren Räder.",
        [
          [
            2,
            "全部貸し出し中",
            "keine Räder"
          ]
        ]
      ],
      [
        "evidence",
        "Welcher Weg zur Universität ist tatsächlich angeboten?",
        "二番のバスです。",
        "二番のバスを使います。",
        "九時の電車で大学前までです。",
        "Bus zwei ist die verbleibende ausdrücklich genannte Option.",
        [
          [
            1,
            "中央駅まで運転",
            "Bahnende"
          ],
          [
            2,
            "二番のバスをご利用ください",
            "Ersatz"
          ]
        ]
      ]
    ],
    "writing": [
      "Fasse die neue Verbindung zusammen.",
      "中央駅で降りて、二番のバスで大学へ行きます。",
      "電車で中央駅まで行って、二番に乗り換えます。",
      "大学前まで電車に乗ります。",
      "Der Zug endet früher."
    ],
    "returnCue": [
      "Neue Verbindung: Zug nur zum Rathaus, alle Räder ausgeliehen, Bus drei zur Schule. Erkläre.",
      "市役所で電車を降りて、三番のバスで学校へ行きます。",
      "市役所から三番のバスに乗り換えます。",
      "自転車を借ります。",
      "Die Fahrräder stehen nicht zur Verfügung."
    ]
  },
  {
    "id": "health-center-callback",
    "title": "Rückruf nach ungenauer Auskunft",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "domain": "Terminorganisation",
    "goal": "Sprechzeiten, allgemeine Öffnung und persönlichen Rückruf abstimmen",
    "setup": "Eine automatisch gesprochene Ansage enthält allgemeine Zeiten; später folgt eine persönliche Rückmeldung.",
    "sourceNotes": "Der Inhalt ist ausschließlich organisatorisch, keine medizinische Empfehlung oder reale Praxisinformation.",
    "sources": [
      [
        "Automatische Ansage",
        "voicemail",
        1,
        "受付は平日の朝九時から午後四時までです。木曜日は十二時までです。",
        "Anmeldung werktags 9–16 Uhr, Donnerstag bis 12 Uhr.",
        "Regelzeiten"
      ],
      [
        "Persönliche Nachricht",
        "voicemail",
        2,
        "山田さんの書類について、金曜日の午後三時に折り返しお電話します。受付が閉まっていても電話はできます。",
        "Rückruf an Yamada Freitag 15 Uhr über Unterlagen; Anruf auch nach Schalterzeiten möglich.",
        "Spezieller Rückruf"
      ],
      [
        "Zusätzliche Notiz",
        "message",
        3,
        "書類を直接受け取るときは、身分証を持って来てください。",
        "Bei persönlicher Abholung Ausweis mitbringen.",
        "Bedingung für separate Handlung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wann ist der konkrete Rückruf geplant?",
        "金曜日の午後三時です。",
        "金曜日の三時です。",
        "木曜日の三時です。",
        "Donnerstag ist nur eine allgemeine Sonderöffnungszeit.",
        [
          [
            0,
            "木曜日は十二時まで",
            "allgemein"
          ],
          [
            1,
            "金曜日の午後三時",
            "persönlich"
          ]
        ]
      ],
      [
        "inference",
        "Ist ein Rückruf nach Schließung der Anmeldung automatisch ausgeschlossen?",
        "いいえ、電話はできます。",
        "受付が閉まっていても電話できます。",
        "はい、受付が閉まったら電話もできません。",
        "Die persönliche Nachricht unterscheidet Schalter und Telefon.",
        [
          [
            1,
            "受付が閉まっていても電話はできます",
            "Ausnahme"
          ]
        ]
      ],
      [
        "evidence",
        "Wozu wird ein Ausweis benötigt?",
        "書類を直接受け取るときです。",
        "直接書類を取りに行くときです。",
        "電話で話すときです。",
        "Die dritte Nachricht nennt die Bedingung ausdrücklich nur für Abholung.",
        [
          [
            2,
            "書類を直接受け取るとき",
            "Bedingung"
          ]
        ]
      ]
    ],
    "writing": [
      "Bestätige höflich den Rückruf und die separate Ausweispflicht.",
      "金曜日の午後三時のお電話をお待ちしています。書類を受け取るときは身分証を持って行きます。",
      "金曜日の三時ですね。身分証を持って受け取りに行きます。",
      "木曜日の三時に受付へ行きます。",
      "Es sind verschiedene Vorgänge."
    ],
    "returnCue": [
      "Andere Stelle: Anruf Dienstag um 14 Uhr, persönliche Abholung Mittwoch mit Ausweis. Bestätige die Trennung.",
      "火曜日の二時に電話を受けます。水曜日は身分証を持って受け取りに行きます。",
      "火曜日に電話し、水曜日に書類を取りに行きます。",
      "火曜日に身分証なしで受け取ります。",
      "Telefon und Abholung liegen an getrennten Tagen."
    ]
  },
  {
    "id": "local-market-prices",
    "title": "Marktangebot und Rabattbedingung",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "domain": "Markt",
    "goal": "Grundpreis, Angebot und Bedingung aus drei Quellen kombinieren",
    "setup": "Ein fiktiver Markt hat ein rabattiertes Gemüseangebot mit enger Zeitgrenze.",
    "sourceNotes": "Keine realen Preise: Die Quellen sind unabhängige, originale Unterrichtsbelege.",
    "sources": [
      [
        "Preisplakat",
        "notice",
        1,
        "トマトは一袋五百円です。りんごは一個百五十円です。",
        "Tomatenbeutel 500 Yen, Äpfel einzeln 150.",
        "Standardpreise"
      ],
      [
        "Marktdurchsage",
        "announcement",
        2,
        "今日は三時から四時まで、トマトを一袋四百円で売ります。りんごの値段は変わりません。",
        "Heute 15–16 Uhr Tomatenbeutel 400, Äpfel bleiben gleich.",
        "Zeitlich begrenzte Preisänderung"
      ],
      [
        "Kassennotiz",
        "reading",
        3,
        "割引は午後四時までにレジで払った方だけです。",
        "Rabatt nur, wer bis 16 Uhr an der Kasse bezahlt hat.",
        "Zahlungsfrist"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wie viel kosten Tomaten um 15:30 bei rechtzeitiger Zahlung?",
        "四百円です。",
        "一袋四百円です。",
        "五百円です。",
        "Der Aktionspreis gilt bei Zahlung bis vier Uhr.",
        [
          [
            1,
            "三時から四時まで…四百円",
            "Aktionspreis"
          ],
          [
            2,
            "四時までにレジで払った",
            "Bedingung"
          ]
        ]
      ],
      [
        "inference",
        "Reicht es, um 15:59 den Beutel nur auszusuchen?",
        "いいえ、支払いが必要です。",
        "四時までに払わないといけません。",
        "はい、選んだら大丈夫です。",
        "Die Kassennotiz macht Zahlung zum Kriterium.",
        [
          [
            2,
            "レジで払った方だけ",
            "Zahlung zwingend"
          ]
        ]
      ],
      [
        "evidence",
        "Ändert sich der Apfelpreis während des Angebots?",
        "いいえ、百五十円のままです。",
        "りんごは一個百五十円です。",
        "はい、百円になります。",
        "Der Aushang nennt 150, die Durchsage schließt Änderung aus.",
        [
          [
            0,
            "りんごは一個百五十円",
            "Ausgangspreis"
          ],
          [
            1,
            "りんごの値段は変わりません",
            "unverändert"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe, dass du vor vier Uhr einen Tomatenbeutel zum Angebotspreis kaufst.",
      "四時までに四百円でトマトを一袋買います。",
      "午後四時より前にレジで払います。",
      "五時に四百円で買います。",
      "Die Rabattbedingung wäre verfehlt."
    ],
    "returnCue": [
      "Neuer Markt: Reis regulär 700 Yen, zwischen 12 und 13 Uhr 600 Yen, Zahlung bis 13 Uhr. Formuliere.",
      "一時までに払えば、米は六百円です。",
      "十二時から一時までに六百円で米を買います。",
      "二時に六百円で買います。",
      "Die neue Bedingung endet um 13 Uhr."
    ]
  }
] satisfies P48RawCase[];
export const p48CasesD=p48CorpusD.map(authoredP48Case);
