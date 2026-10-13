import {authoredP48Case,type P48RawCase} from "./connected48-types";
/** Five first-party A1 multi-document cases with actual revisions and conditional exceptions. */
export const p48CorpusA=[
  {
    "id": "station-exit",
    "title": "Bahnhofsausgang nach einer Korrektur",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "domain": "Verabredung",
    "goal": "Eine Textnachricht und eine aktuelle Bahnhofsdurchsage verbinden",
    "setup": "Du fährst zu einem Freund. Die erste Nachricht nennt einen Ausgang, die zweite Information korrigiert den Zugang.",
    "sourceNotes": "Die erste Nachricht ist kein falsches Zitat; eine spätere Zugangssperre verändert nur den Weg, nicht das Treffen.",
    "sources": [
      [
        "Nachricht von Yuki",
        "message",
        1,
        "午後二時に駅の北口の花屋の前で会いましょう。",
        "Treffen um zwei am Blumenladen am Nordausgang.",
        "Frühe persönliche Treffabsprache"
      ],
      [
        "Bahnhofsansage",
        "announcement",
        2,
        "今日は北口が工事で使えません。南口から出て、駅の外を歩いて北口へ行ってください。",
        "Nordausgang wegen Bauarbeiten gesperrt; durch Südausgang raus und außen zum Nordausgang gehen.",
        "Spätere Zugangsanweisung"
      ],
      [
        "Kurze Antwort von Yuki",
        "message",
        3,
        "花屋の前で待っています。時間は変わりません。",
        "Ich warte vor dem Blumenladen. Zeit bleibt gleich.",
        "Aktuelle Bestätigung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welchen Ausgang solltest du zum Verlassen des Bahnhofs benutzen?",
        "南口です。",
        "南口から出ます。",
        "北口から出ます。",
        "Der Nordausgang ist als Ausgang gesperrt.",
        [
          [
            0,
            "駅の北口の花屋",
            "ursprüngliches Ziel"
          ],
          [
            1,
            "南口から出て",
            "aktuelle Anweisung"
          ]
        ]
      ],
      [
        "inference",
        "Hat sich der eigentliche Treffpunkt geändert?",
        "いいえ、花屋の前のままです。",
        "花屋の前で会います。",
        "はい、南口で会います。",
        "Der Südausgang ist der Weg, nicht der Treffpunkt.",
        [
          [
            1,
            "南口から出て",
            "Wegänderung"
          ],
          [
            2,
            "花屋の前で待っています",
            "Treffort bleibt"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Angabe beweist, dass du nicht früher kommen musst?",
        "時間は変わりません。",
        "午後二時のままです。",
        "午前二時です。",
        "Die spätere Nachricht bestätigt ausdrücklich unveränderte Zeit.",
        [
          [
            0,
            "午後二時",
            "alte Zeit"
          ],
          [
            2,
            "時間は変わりません",
            "Zeitbestätigung"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe Yuki, dass du den Südausgang nimmst und um zwei zum Blumenladen kommst.",
      "南口から出て、二時に花屋の前へ行きます。",
      "二時に南口から歩いて花屋に行きます。",
      "二時に北口から出ます。",
      "Nordausgang ist als direkter Ausgang gesperrt."
    ],
    "returnCue": [
      "Neue Situation: Ostausgang geschlossen, verabredetes Café bleibt im Osten, du verlässt den Bahnhof im Westen. Bestätige.",
      "西口から出て、東側のカフェへ行きます。",
      "西口から出て、カフェまで歩きます。",
      "東口から出ます。",
      "Der geschlossene Ostausgang bleibt unbenutzbar."
    ]
  },
  {
    "id": "cafe-cancellation",
    "title": "Bestellung trotz ausverkauftem Kuchen",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "domain": "Restaurant",
    "goal": "Zwei Nachrichten derselben Bedienung zusammenführen",
    "setup": "Ein Gast bekommt zuerst eine Bestellbestätigung, dann eine Änderung und zum Schluss die Rechnung.",
    "sourceNotes": "Eine Änderung einer Speise bedeutet nicht automatisch, dass die gesamte Bestellung entfällt.",
    "sources": [
      [
        "Erste Bestätigung",
        "spoken",
        1,
        "ホットコーヒー一つとチョコレートケーキ一つですね。",
        "Ein heißer Kaffee und Schokokuchen.",
        "Ursprüngliche Bestellung"
      ],
      [
        "Zweite Information",
        "spoken",
        2,
        "申し訳ありません。チョコレートケーキは売り切れです。アップルパイならあります。コーヒーは用意できます。",
        "Schokokuchen aus, Apfelkuchen vorhanden, Kaffee weiterhin möglich.",
        "Aktuelle Verfügbarkeit"
      ],
      [
        "Antwort des Gastes",
        "message",
        3,
        "では、アップルパイをお願いします。コーヒーはそのままで。",
        "Dann Apfelkuchen; Kaffee unverändert.",
        "Endgültige Entscheidung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Was bestellt der Gast zuletzt?",
        "ホットコーヒーとアップルパイです。",
        "コーヒーとアップルパイを頼みます。",
        "チョコレートケーキとコーヒーです。",
        "Die Kuchenwahl wurde ersetzt.",
        [
          [
            0,
            "ホットコーヒー一つ",
            "zuvor festgelegt"
          ],
          [
            2,
            "アップルパイをお願いします",
            "Ersatz"
          ]
        ]
      ],
      [
        "inference",
        "Wird der Kaffee storniert?",
        "いいえ、そのままです。",
        "コーヒーは注文したままです。",
        "はい、飲み物もやめます。",
        "Die abschließende Aussage übernimmt den Kaffee.",
        [
          [
            1,
            "コーヒーは用意できます",
            "weiter verfügbar"
          ],
          [
            2,
            "コーヒーはそのままで",
            "unverändert"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Quelle bestätigt die endgültige Entscheidung?",
        "最後の返事です。",
        "お客さんの返事です。",
        "最初の確認です。",
        "Erst die Antwort nach der Nichtverfügbarkeit legt die Endbestellung fest.",
        [
          [
            0,
            "チョコレートケーキ一つ",
            "nicht mehr lieferbar"
          ],
          [
            2,
            "アップルパイをお願いします",
            "gültige Bestellung"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe die endgültige Bestellung.",
      "ホットコーヒーとアップルパイをお願いします。",
      "コーヒーとアップルパイを一つずつください。",
      "チョコレートケーキをお願いします。",
      "Der Schokoladenkuchen ist aus."
    ],
    "returnCue": [
      "Anderes Café: Erdbeerkuchen aus, Käsekuchen verfügbar, Tee soll bleiben. Bestelle passend.",
      "紅茶とチーズケーキをお願いします。",
      "紅茶はそのままで、チーズケーキをください。",
      "いちごのケーキとコーヒーをください。",
      "Neue Auswahl und weiterhin Tee."
    ]
  },
  {
    "id": "library-return",
    "title": "Bibliotheksbuch und neue Frist",
    "level": "A1",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Studium",
    "goal": "Reservierung und Aushang mit Leihfrist vergleichen",
    "setup": "Du hast ein Buch ausgeliehen und liest später eine Nachricht über eine frühere Reservierung.",
    "sourceNotes": "Die Uhrzeit der Bibliotheksöffnung und der Rückgabetag sind unterschiedliche Regeln.",
    "sources": [
      [
        "Alter Leihschein",
        "reading",
        1,
        "この本は金曜日まで借りられます。返す場所は一階です。",
        "Das Buch darf bis Freitag ausgeliehen werden; Rückgabe unten.",
        "Alte Leihfrist"
      ],
      [
        "Mitteilung der Bibliothek",
        "email",
        2,
        "別の人の予約が入りました。木曜日の午後五時までに返してください。",
        "Ein anderer Leser hat reserviert; bitte bis Donnerstag 17 Uhr zurück.",
        "Spätere Frist"
      ],
      [
        "Öffnungszeitenhinweis",
        "notice",
        3,
        "木曜日は午後六時まで開いています。返却ボックスは入り口の右です。",
        "Donnerstags bis 18 Uhr offen; Rückgabebox rechts vom Eingang.",
        "Öffnungszeiten und Ort"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Bis wann musst du das Buch nun zurückgeben?",
        "木曜日の午後五時までです。",
        "木曜日の五時までに返します。",
        "金曜日までです。",
        "Die neue Reservierung verkürzt die Frist.",
        [
          [
            0,
            "金曜日まで",
            "alte Frist"
          ],
          [
            1,
            "木曜日の午後五時まで",
            "neue Frist"
          ]
        ]
      ],
      [
        "inference",
        "Darfst du erst um 17:30 zurückgeben, nur weil bis 18 Uhr geöffnet ist?",
        "いいえ、五時までです。",
        "いいえ、返却の締め切りは五時です。",
        "はい、六時までなら大丈夫です。",
        "Öffnung des Gebäudes hebt die Buchfrist nicht auf.",
        [
          [
            1,
            "午後五時までに返してください",
            "Buchfrist"
          ],
          [
            2,
            "午後六時まで開いています",
            "Gebäudezeit"
          ]
        ]
      ],
      [
        "evidence",
        "Wo ist die Rückgabebox?",
        "入り口の右です。",
        "入り口の右側にあります。",
        "二階です。",
        "Die jüngste Öffnungsnotiz nennt den konkreten Standort.",
        [
          [
            0,
            "返す場所は一階",
            "Stock"
          ],
          [
            2,
            "返却ボックスは入り口の右",
            "Box"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe der Bibliothek, dass du Donnerstag vor fünf zurückgibst.",
      "木曜日の五時までに本を返します。",
      "木曜日の午後五時より前に返します。",
      "金曜日に返します。",
      "Die neue Frist endet Donnerstag."
    ],
    "returnCue": [
      "Neues Buch: Ursprünglich Dienstag, später Montag um 16 Uhr verlangt. Bestätige neue Frist.",
      "月曜日の四時までに返します。",
      "月曜日の午後四時に返します。",
      "火曜日に返します。",
      "Dienstag wurde ersetzt."
    ]
  },
  {
    "id": "rain-school-club",
    "title": "Schulclub nach Regennachrichten",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Freizeit",
    "goal": "Wetter und aktuellen Treffort aus zwei verschiedenen Quellen zusammenlesen",
    "setup": "Eine Nachricht des Clubs wird durch einen Wetterbericht und anschließende Teamnachricht ergänzt.",
    "sourceNotes": "Die Prognose allein ist noch keine Ortsverlegung; erst die Teamentscheidung macht sie verbindlich.",
    "sources": [
      [
        "Erste Clubnachricht",
        "message",
        1,
        "土曜日の三時に公園で練習します。運動靴を持って来てください。",
        "Samstag um drei im Park trainieren, Sportschuhe mitbringen.",
        "Plan"
      ],
      [
        "Wetterbericht",
        "announcement",
        2,
        "土曜日の午後は強い雨になるでしょう。",
        "Samstagnachmittag voraussichtlich starker Regen.",
        "Prognose, keine Teamentscheidung"
      ],
      [
        "Nachricht der Leiterin",
        "message",
        3,
        "雨のため、公園ではなく学校の体育館で練習します。時間は三時のままです。",
        "Wegen Regen Turnhalle statt Park, drei Uhr unverändert.",
        "Entscheidende Planänderung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wo findet das Training schließlich statt?",
        "学校の体育館です。",
        "体育館で練習します。",
        "公園です。",
        "Die Leiterin verändert den Ort.",
        [
          [
            0,
            "公園で練習します",
            "alter Treffpunkt"
          ],
          [
            2,
            "学校の体育館",
            "gültiger Treffpunkt"
          ]
        ]
      ],
      [
        "inference",
        "Hat sich auch die Trainingszeit verschoben?",
        "いいえ、三時のままです。",
        "三時からです。",
        "はい、四時からです。",
        "Nur der Ort wurde verlegt.",
        [
          [
            0,
            "土曜日の三時",
            "erste Uhrzeit"
          ],
          [
            2,
            "時間は三時のまま",
            "Bestätigung"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Quelle macht die Verlegung verbindlich?",
        "リーダーの最後のメッセージです。",
        "最後の連絡です。",
        "天気予報だけです。",
        "Die Wetterprognose ist ein Anlass, noch keine Ortsanweisung.",
        [
          [
            1,
            "強い雨になるでしょう",
            "Prognose"
          ],
          [
            2,
            "体育館で練習します",
            "verbindliche Mitteilung"
          ]
        ]
      ]
    ],
    "writing": [
      "Bestätige Ort und Zeit.",
      "土曜日の三時に学校の体育館へ行きます。",
      "三時に体育館で練習します。",
      "三時に公園へ行きます。",
      "Die Verlegung gilt."
    ],
    "returnCue": [
      "Anderer Club: ursprünglicher Parktreff Sonntag 11 Uhr, nun wegen Wind in die Aula, gleiche Zeit. Bestätige.",
      "日曜日の十一時に講堂で会います。",
      "十一時に学校の講堂へ行きます。",
      "日曜日に公園で会います。",
      "Der Wind führt zur Verlegung nach innen."
    ]
  },
  {
    "id": "shopping-pickup",
    "title": "Geschenkabholung mit geänderter Zeit",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "domain": "Einkauf",
    "goal": "Bestätigung und Abholmitteilung zeitlich verbinden",
    "setup": "Ein Geschenk wird im Geschäft bestellt; später teilt der Laden eine neue Abholzeit mit.",
    "sourceNotes": "Öffnungszeit, Reservierung und Zeitpunkt der tatsächlichen Warenbereitstellung dürfen nicht vermischt werden.",
    "sources": [
      [
        "Bestellbeleg",
        "reading",
        1,
        "青いかばんを一つ予約しました。木曜日の午後二時から受け取れます。",
        "Eine blaue Tasche reserviert, Donnerstag ab 14 Uhr abholbar.",
        "Frühere Zusage"
      ],
      [
        "Ladennachricht",
        "voicemail",
        2,
        "商品の到着が遅れました。木曜日の午後四時からお渡しできます。",
        "Lieferung verspätet; Donnerstag ab 16 Uhr erhältlich.",
        "Spätere Bereitschaft"
      ],
      [
        "Öffnungszeiten",
        "notice",
        3,
        "木曜日は午後六時まで営業します。受け取りには予約番号が必要です。",
        "Donnerstags bis 18 Uhr geöffnet; Reservierungsnummer erforderlich.",
        "Abholbedingung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Ab wann ist das Geschenk tatsächlich abholbar?",
        "木曜日の午後四時からです。",
        "木曜日の四時から受け取れます。",
        "木曜日の二時からです。",
        "Die zweite Nachricht verschiebt die Bereitstellung.",
        [
          [
            0,
            "午後二時から",
            "vorherige Zeit"
          ],
          [
            1,
            "午後四時から",
            "neue Zeit"
          ]
        ]
      ],
      [
        "inference",
        "Ist 17 Uhr ein möglicher Abholtermin?",
        "はい、五時に受け取れます。",
        "はい、四時から六時の間です。",
        "いいえ、四時に閉まります。",
        "Ware ab vier bereit, Laden bis sechs offen.",
        [
          [
            1,
            "午後四時から",
            "bereit"
          ],
          [
            2,
            "午後六時まで営業",
            "geöffnet"
          ]
        ]
      ],
      [
        "evidence",
        "Was musst du bei der Abholung vorzeigen?",
        "予約番号です。",
        "予約番号が必要です。",
        "学校のノートです。",
        "Die Regel im Aushang fordert die Reservierungsnummer.",
        [
          [
            2,
            "予約番号が必要です",
            "Anforderung"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe, dass du um fünf mit Reservierungsnummer kommst.",
      "木曜日の五時に予約番号を持って受け取りに行きます。",
      "木曜日の午後五時に行きます。予約番号も持っています。",
      "木曜日の二時に行きます。",
      "Die Ware wäre noch nicht bereit."
    ],
    "returnCue": [
      "Anderes Geschäft: Abholung erst Samstag 15 Uhr, offen bis 18 Uhr. Bestätige 16 Uhr.",
      "土曜日の四時に取りに行きます。",
      "土曜日の午後四時に受け取ります。",
      "土曜日の二時に行きます。",
      "Vor 15 Uhr ist die Ware nicht bereit."
    ]
  }
] satisfies P48RawCase[];
export const p48CasesA=p48CorpusA.map(authoredP48Case);
