import {authoredP48Case,type P48RawCase} from "./connected48-types";
/** Five further original A1 cross-source reconciliation missions. */
export const p48CorpusB=[
  {
    "id": "campus-room-and-time",
    "title": "Zwei Kursänderungen, verschiedene Fristen",
    "level": "A1",
    "units": [
      "p23:routine",
      "p26:library-project"
    ],
    "domain": "Studium",
    "goal": "Aktuellen Raum und Beginn nach zwei Updates bestimmen",
    "setup": "Eine Kursmail wird durch einen späteren Aushang korrigiert; eine dritte Nachricht nennt nur die Übung.",
    "sourceNotes": "Die Änderung des Hörsaals gilt für die Vorlesung, die Übungsinformation ist ein anderer Termin.",
    "sources": [
      [
        "E-Mail der Lehrerin",
        "email",
        1,
        "今日の授業は十時から二〇一号室で行います。ノートを持って来てください。",
        "Unterricht um zehn in Raum 201, Heft mitbringen.",
        "Erste Vorlesungsinformation"
      ],
      [
        "Aktueller Aushang",
        "notice",
        2,
        "二〇一号室は使えません。日本語の授業は十一時から三〇四号室になりました。",
        "Raum 201 gesperrt; Japanisch heute ab elf in Raum 304.",
        "Neue Raum- und Zeitangabe"
      ],
      [
        "Mail zur Übung",
        "message",
        3,
        "午後二時からの会話の練習は予定どおり三〇一号室です。",
        "Gesprächsübung um zwei in Raum 301 bleibt.",
        "Anderer, nicht verlegter Unterrichtsteil"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wann und wo beginnt der Unterricht?",
        "十一時に三〇四号室です。",
        "三〇四号室で十一時からです。",
        "十時に二〇一号室です。",
        "Der aktuelle Aushang ersetzt beide frühen Angaben.",
        [
          [
            0,
            "十時から二〇一号室",
            "alter Stand"
          ],
          [
            1,
            "十一時から三〇四号室",
            "neuer Stand"
          ]
        ]
      ],
      [
        "inference",
        "Ist auch die Gesprächsübung um zwei verlegt?",
        "いいえ、三〇一号室のままです。",
        "会話の練習は変わりません。",
        "はい、三〇四号室です。",
        "Die dritte Quelle sagt ausdrücklich 予定どおり.",
        [
          [
            2,
            "予定どおり三〇一号室",
            "Übung unverändert"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Quelle belegt, dass Raum 201 unbenutzbar ist?",
        "新しい掲示です。",
        "現在の掲示です。",
        "最初のメールです。",
        "Erst der Aushang nennt die Sperrung.",
        [
          [
            1,
            "二〇一号室は使えません",
            "Raumsperrung"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe einem Kommilitonen beide Termine korrekt.",
      "授業は十一時に三〇四号室、練習は二時に三〇一号室です。",
      "十一時に三〇四号室へ行って、二時に三〇一号室です。",
      "授業は十時に二〇一号室です。",
      "Die Vorlesung wurde verlegt."
    ],
    "returnCue": [
      "Neuer Kurs: Vorlesung um neun in Raum 102 statt acht in Raum 101; Übung um 14 Uhr Raum 210 bleibt. Gib beides weiter.",
      "授業は九時に一〇二号室、練習は二時に二一〇号室です。",
      "午前九時に一〇二号室で、午後二時の練習は変わりません。",
      "八時に一〇一号室です。",
      "Die früheren Vorlesungsdaten sind überholt."
    ]
  },
  {
    "id": "festival-partial",
    "title": "Musik fällt aus, Basteln bleibt",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Freizeit",
    "goal": "Absage und Ortsverlegung getrennt aus Hinweisen erkennen",
    "setup": "Eine Stadtteilveranstaltung ändert ihr Programm wegen Regen.",
    "sourceNotes": "Das Wetter ist eine Ursache; Programmabsage, Ortswechsel und Beginn werden getrennt genannt.",
    "sources": [
      [
        "Festivalprogramm",
        "schedule",
        1,
        "土曜日の十時に公園で工作教室、午後一時に音楽会があります。",
        "Basteln Samstag zehn im Park, Konzert um eins.",
        "Erstes Programm"
      ],
      [
        "Wetterhinweis",
        "announcement",
        2,
        "土曜日は午後から強い雨が降る可能性があります。",
        "Ab Samstagmittag könnte starker Regen fallen.",
        "Wetterprognose"
      ],
      [
        "Mitteilung der Organisatoren",
        "notice",
        3,
        "工作教室は十時から学校の体育館で行います。午後の音楽会は中止です。",
        "Basteln um zehn in Turnhalle; Konzert abgesagt.",
        "Verbindliche Aktualisierung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Was findet am Samstag um zehn statt und wo?",
        "体育館で工作教室があります。",
        "学校の体育館で十時から工作教室です。",
        "公園で工作教室です。",
        "Der Ort hat sich geändert.",
        [
          [
            0,
            "公園で工作教室",
            "alt"
          ],
          [
            2,
            "学校の体育館",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Kann man nachmittags das Konzert besuchen?",
        "いいえ、中止です。",
        "音楽会はありません。",
        "はい、体育館であります。",
        "Nur Basteln wird verlegt; das Konzert fällt aus.",
        [
          [
            2,
            "音楽会は中止です",
            "Absage"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Information entscheidet endgültig über das Programm?",
        "主催者の最後のお知らせです。",
        "最後の案内です。",
        "天気予報だけです。",
        "Die Wetterprognose allein sagt nicht ab.",
        [
          [
            1,
            "可能性があります",
            "nur Möglichkeit"
          ],
          [
            2,
            "中止です",
            "Entscheidung"
          ]
        ]
      ]
    ],
    "writing": [
      "Erkläre einer Freundin Bastelort und Konzertabsage.",
      "工作教室は体育館でありますが、音楽会は中止です。",
      "十時に体育館で工作をします。音楽会はありません。",
      "公園で音楽会を見ます。",
      "Das Konzert findet nicht statt."
    ],
    "returnCue": [
      "Neuer Markt: Bücherverkauf in Turnhalle, Lesung fällt aus. Schreibe die Änderung.",
      "本の販売は体育館でありますが、朗読会は中止です。",
      "体育館で本を売ります。朗読会はありません。",
      "朗読会もあります。",
      "Die Lesung wurde abgesagt."
    ]
  },
  {
    "id": "bus-calendar-exception",
    "title": "Wochenendbus und Feiertag",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "domain": "Mobilität",
    "goal": "Fahrplan und Ausnahme für einen einzigen Tag vergleichen",
    "setup": "Ein Fahrplan zeigt sonntägliche Fahrten, ein Feiertagsaushang setzt eine aus.",
    "sourceNotes": "Aus einem allgemeinen Rhythmus darf für einen angekündigten Ausnahme-Sonntag keine normale Fahrt angenommen werden.",
    "sources": [
      [
        "Busfahrplan",
        "schedule",
        1,
        "日曜日は駅から公園へ十時にバスが出ます。帰りは午後四時です。",
        "Sonntags Hinfahrt um zehn; Rückfahrt um vier.",
        "Normalfahrplan"
      ],
      [
        "Feiertagsnotiz",
        "notice",
        2,
        "今月の最後の日曜日は、朝十時のバスは運休です。",
        "Am letzten Sonntag des Monats fällt der Zehn-Uhr-Bus aus.",
        "Ausnahmetag"
      ],
      [
        "Serviceinformation",
        "announcement",
        3,
        "公園へ行く方は土曜日の九時か十一時のバスを使ってください。",
        "Für den Park stattdessen Samstag neun oder elf fahren.",
        "Praktische Alternative"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Kann man am letzten Sonntag um zehn abfahren?",
        "いいえ、運休です。",
        "十時のバスはありません。",
        "はい、出ます。",
        "Die Sonderregel ersetzt den Normalfahrplan.",
        [
          [
            0,
            "日曜日は…十時",
            "normal"
          ],
          [
            1,
            "最後の日曜日…運休",
            "Ausnahme"
          ]
        ]
      ],
      [
        "inference",
        "Welche frühere Fahrmöglichkeit wird alternativ genannt?",
        "土曜日の九時です。",
        "土曜日の九時か十一時です。",
        "日曜日の十一時です。",
        "Nur Samstag bietet die angegebene Alternative.",
        [
          [
            2,
            "土曜日の九時か十一時",
            "Alternative"
          ]
        ]
      ],
      [
        "evidence",
        "Warum ist das Auslassen dieses Sonntags keine Regel für jeden Sonntag?",
        "最後の日曜日だけだからです。",
        "今月の最後の日曜日についてだからです。",
        "毎週日曜日は休みだからです。",
        "Die Formulierung begrenzt die Ausnahme auf einen Tag.",
        [
          [
            1,
            "今月の最後の日曜日",
            "Scope"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe, dass du stattdessen Samstag um elf fährst.",
      "土曜日の十一時のバスに乗ります。",
      "土曜日は十一時に行きます。",
      "最後の日曜日の十時に乗ります。",
      "Die Sonntagsfahrt fällt aus."
    ],
    "returnCue": [
      "Neuer Bus: Montag regulär um acht, nur nächsten Montag gestrichen; Dienstag um neun Alternative. Informiere jemanden.",
      "来週の月曜日のバスは運休なので、火曜日の九時に乗ります。",
      "火曜日の九時のバスを使います。",
      "来週の月曜日に八時のバスに乗ります。",
      "Die einmalige Montagsfahrt entfällt."
    ]
  },
  {
    "id": "teacher-assignment",
    "title": "Aufgabe geändert, Frist bleibt",
    "level": "A1",
    "units": [
      "p23:routine",
      "p26:library-project"
    ],
    "domain": "Lernen",
    "goal": "Korrigierte Aufgabenmenge mit einem unveränderten Termin verknüpfen",
    "setup": "Eine Lehrkraft sendet nach dem Übungsblatt eine vereinfachte Vorgabe.",
    "sourceNotes": "Eine neue Seitenzahl ersetzt die alte Seitenzahl, aber nicht automatisch den Abgabetermin.",
    "sources": [
      [
        "Erste Aufgabenliste",
        "reading",
        1,
        "作文を五ページ書いてください。金曜日に出してください。",
        "Fünf Seiten schreiben, Freitag abgeben.",
        "Frühe Vorgabe"
      ],
      [
        "Spätere Lehrkraft-Mail",
        "email",
        2,
        "すみません。作文は三ページでいいです。テーマは『私の町』のままです。",
        "Drei Seiten reichen; Thema bleibt meine Stadt.",
        "Menge geändert"
      ],
      [
        "Erinnerung",
        "message",
        3,
        "提出日は予定どおり金曜日です。メールで送ってください。",
        "Abgabe weiter Freitag, per Mail senden.",
        "Frist und Abgabeformat"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wie lang soll der Text nun sein?",
        "三ページです。",
        "作文は三ページです。",
        "五ページです。",
        "Die Lehrkraft reduziert auf drei Seiten.",
        [
          [
            0,
            "五ページ",
            "alt"
          ],
          [
            1,
            "三ページでいいです",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Muss das Thema angepasst werden?",
        "いいえ、同じです。",
        "私の町のままです。",
        "はい、旅行です。",
        "Das Thema bleibt ausdrücklich unverändert.",
        [
          [
            1,
            "『私の町』のまま",
            "gleich"
          ]
        ]
      ],
      [
        "evidence",
        "Was bleibt vom ursprünglichen Abgabetermin?",
        "金曜日です。",
        "金曜日までです。",
        "月曜日です。",
        "Eine neue Erinnerung bestätigt Freitag.",
        [
          [
            0,
            "金曜日に出して",
            "frühere Frist"
          ],
          [
            2,
            "予定どおり金曜日",
            "gültige Frist"
          ]
        ]
      ]
    ],
    "writing": [
      "Bestätige drei Seiten und Freitag per Mail.",
      "三ページの作文を金曜日にメールで送ります。",
      "金曜日までに三ページ書いて送ります。",
      "五ページを月曜日に出します。",
      "Anzahl, Zeit und Format würden nicht stimmen."
    ],
    "returnCue": [
      "Neues Projekt: Bericht von vier auf zwei Seiten reduziert, Abgabe Montag bleibt. Bestätige.",
      "二ページのレポートを月曜日に出します。",
      "月曜日までに二ページ書きます。",
      "四ページを火曜日に出します。",
      "Die spätere Vorgabe reduziert nur den Umfang."
    ]
  },
  {
    "id": "dinner-food-limit",
    "title": "Abendessen und neue Gästeinformation",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "domain": "Essen",
    "goal": "Zwei Informationen zu Speisen und Vorlieben zusammenführen",
    "setup": "Ein Freund lädt ein; eine weitere Nachricht ergänzt eine Ernährungsvorliebe.",
    "sourceNotes": "Eine bekannte Einschränkung gilt für eine Person; nicht automatisch für alle Gäste.",
    "sources": [
      [
        "Einladung",
        "message",
        1,
        "土曜日の六時にみんなでカレーを作りましょう。肉と野菜を買いました。",
        "Samstag sechs Uhr gemeinsam Curry kochen, Fleisch und Gemüse gekauft.",
        "Erster Plan"
      ],
      [
        "Nachricht von Nao",
        "message",
        2,
        "ありがとう。でも、私は肉を食べません。野菜のカレーなら食べられます。",
        "Nao isst kein Fleisch, Gemüse-Curry wäre möglich.",
        "Neue persönliche Information"
      ],
      [
        "Antwort des Gastgebers",
        "message",
        3,
        "では、野菜だけのカレーを作ります。時間は六時のままです。",
        "Dann nur Gemüse-Curry, sechs Uhr bleibt.",
        "Geänderte Entscheidung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welche Art Curry wird tatsächlich gekocht?",
        "野菜のカレーです。",
        "肉なしのカレーです。",
        "肉のカレーです。",
        "Die Gastgeberentscheidung ersetzt die Fleischversion.",
        [
          [
            0,
            "肉と野菜",
            "erster Plan"
          ],
          [
            2,
            "野菜だけのカレー",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Weshalb wird Fleisch weggelassen?",
        "なおさんが肉を食べないからです。",
        "なおさんも食べられるようにするためです。",
        "野菜がありません。",
        "Das Angebot soll Nao einschließen.",
        [
          [
            1,
            "私は肉を食べません",
            "Einschränkung"
          ],
          [
            2,
            "野菜だけ",
            "Rücksicht"
          ]
        ]
      ],
      [
        "evidence",
        "Zu welcher Zeit sollen die Freunde zusammenkommen?",
        "土曜日の六時です。",
        "六時のままです。",
        "七時です。",
        "Die Zeit wird ausdrücklich bestätigt.",
        [
          [
            0,
            "土曜日の六時",
            "alte Uhrzeit"
          ],
          [
            2,
            "時間は六時のまま",
            "gültig"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe eine kurze Einladung zur endgültigen Mahlzeit.",
      "土曜日の六時に野菜のカレーを食べましょう。",
      "六時に肉なしのカレーを作ります。",
      "土曜日に肉のカレーを食べます。",
      "Das wäre für Nao unpassend."
    ],
    "returnCue": [
      "Neue Einladung: Ein Gast isst keine Eier; es gibt ab sieben eifreie Nudeln. Lade ein.",
      "七時に卵なしの麺を食べましょう。",
      "午後七時に卵を使わない料理を作ります。",
      "七時に卵入りの料理を食べましょう。",
      "Die neue Einschränkung betrifft Eier."
    ]
  }
] satisfies P48RawCase[];
export const p48CasesB=p48CorpusB.map(authoredP48Case);
