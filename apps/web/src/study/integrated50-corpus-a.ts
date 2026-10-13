import {authoredP50Mission,type P50RawMission} from "./integrated50-types";
/** Five original A1 text-plus-listening missions with explicit changed facts and evidence. */
export const p50CorpusA=[
  {
    "id": "station-exit",
    "title": "Treffpunkt trotz Ausgangssperre",
    "level": "A1",
    "genre": "travel",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Du hast einen Treffpunkt schriftlich und hörst kurz darauf eine Bahnhofsdurchsage.",
    "goal": "Lage und Zugang voneinander trennen",
    "readLabel": "Nachricht von Yuki",
    "readGenre": "message",
    "reading": [
      "明日、駅の北口の花屋の前で会おう。",
      "午後二時に来てね。赤いかばんを持っていくよ。"
    ],
    "readingGerman": "Morgen um 14 Uhr am Blumenladen beim Nordausgang; Yuki trägt eine rote Tasche.",
    "spokenContext": "Aktuelle Bahnhofsdurchsage",
    "listening": [
      [
        "放送",
        "お知らせします。北口は今日から工事で使えません。",
        "Der Nordausgang ist ab heute gesperrt."
      ],
      [
        "放送",
        "南口から出て、駅の外を歩いて北口へ行ってください。",
        "Benutzen Sie den Südausgang und gehen Sie außen zum Norden."
      ],
      [
        "係員",
        "花屋は開いています。場所は変わっていません。",
        "Der Blumenladen ist offen, sein Ort unverändert."
      ],
      [
        "乗客",
        "南口から出て、花屋まで歩きます。",
        "Ich verlasse den Bahnhof im Süden und gehe zum Blumenladen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Um wie viel Uhr war das Treffen verabredet?",
        "午後二時です。",
        "二時に会います。",
        "午後三時です。",
        "Die Durchsage ändert keine Zeit.",
        [
          [
            "reading",
            "午後二時",
            "vereinbarte Zeit"
          ]
        ]
      ],
      [
        "correction",
        "Über welchen Ausgang kommst du zum verabredeten Ort?",
        "南口から出ます。",
        "南口を使います。",
        "北口から出ます。",
        "Der nördliche Ausgang ist gesperrt; der Ort bleibt nördlich.",
        [
          [
            "reading",
            "駅の北口の花屋",
            "Treffziel"
          ],
          [
            "listening",
            "南口から出て",
            "gültige Zugangsanweisung"
          ]
        ]
      ],
      [
        "inference",
        "Müsst ihr nun vor dem Südausgang warten?",
        "いいえ、花屋の前で会います。",
        "花屋まで歩いて行きます。",
        "はい、南口で会います。",
        "Nur der Weg, nicht der Treffpunkt, hat sich geändert.",
        [
          [
            "reading",
            "花屋の前で会おう",
            "Treffort"
          ],
          [
            "listening",
            "場所は変わっていません",
            "Ort bleibt"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "北口",
        "きたぐち",
        "Nordausgang",
        "reading: 北口の花屋"
      ],
      [
        "工事",
        "こうじ",
        "Bauarbeiten",
        "listening: 工事で使えません"
      ]
    ],
    "writing": [
      "Antworte Yuki mit unveränderter Treffzeit und dem neuen Weg.",
      "二時に南口から出て、花屋の前まで行くね。",
      "南口から歩いて花屋に行きます。二時に会おう。",
      "二時に北口から出るね。",
      "Der Nordausgang ist gesperrt."
    ],
    "transfer": [
      "Neuer Fall: Ostausgang gesperrt, Treffen am Café östlich vom Bahnhof um 15 Uhr. Nimm Westausgang.",
      "三時に西口から出て、東側のカフェまで行きます。",
      "西口から歩いてカフェに行くね。",
      "東口から出るね。",
      "Der Zugang und das Ziel sind verschieden."
    ],
    "pedagogy": "聞き取った出口は道順であり、待ち合わせ場所と同一とは限らない。"
  },
  {
    "id": "bakery-delay",
    "title": "Die Bestellung und der neue Abholtermin",
    "level": "A1",
    "genre": "service",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Auf einem Kassenbeleg steht die ursprüngliche Uhrzeit; eine Sprachnachricht ändert sie.",
    "goal": "Abholzeit und Ladenöffnungszeit auseinanderhalten",
    "readLabel": "Beleg einer Bäckerei",
    "readGenre": "receipt",
    "reading": [
      "アップルパイ二つ　注文番号二七。",
      "受け取り：木曜日の午後二時。料金：八百円。"
    ],
    "readingGerman": "Zwei Apfelkuchen, Nummer 27, Abholung Donnerstag um 14 Uhr, Preis 800 Yen.",
    "spokenContext": "Nachricht der Bäckerei",
    "listening": [
      [
        "店員",
        "ご予約ありがとうございます。アップルパイを二つご注文ですね。",
        "Vielen Dank, zwei Apfelkuchen sind bestellt."
      ],
      [
        "店員",
        "今日はオーブンが故障したので、二時にはできません。",
        "Der Ofen ist defekt; um zwei noch nicht fertig."
      ],
      [
        "店員",
        "午後四時からお渡しできます。料金は変わりません。",
        "Ab 16 Uhr abholbar, Preis bleibt."
      ],
      [
        "店員",
        "当店は六時に閉まります。番号をお持ちください。",
        "Wir schließen um 18 Uhr. Bringen Sie Ihre Nummer mit."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie viele Kuchen wurden reserviert?",
        "二つです。",
        "アップルパイ二つです。",
        "三つです。",
        "Beleg und Rückruf bestätigen dieselbe Menge.",
        [
          [
            "reading",
            "アップルパイ二つ",
            "Stückzahl"
          ],
          [
            "listening",
            "二つご注文ですね",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wann können die Kuchen nun abgeholt werden?",
        "午後四時からです。",
        "四時から受け取れます。",
        "二時からです。",
        "Der Rückruf ersetzt die ursprünglich gedruckte Abholzeit.",
        [
          [
            "reading",
            "午後二時",
            "alt"
          ],
          [
            "listening",
            "午後四時からお渡しできます",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Ist eine Abholung um 17 Uhr möglich?",
        "はい、できます。",
        "五時なら受け取れます。",
        "いいえ、四時だけです。",
        "Ware ab 16 Uhr bereit, Laden schließt erst um 18 Uhr.",
        [
          [
            "listening",
            "午後四時から",
            "bereit"
          ],
          [
            "listening",
            "六時に閉まります",
            "Schließung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "受け取り",
        "うけとり",
        "Abholung",
        "reading: 受け取り"
      ],
      [
        "故障",
        "こしょう",
        "Defekt",
        "listening: オーブンが故障"
      ]
    ],
    "writing": [
      "Bestätige Abholung um 17 Uhr und nenne die Reservierungsnummer.",
      "五時に番号二七を持って受け取りに行きます。",
      "午後五時にアップルパイを取りに行きます。",
      "二時に取りに行きます。",
      "Um zwei sind die Kuchen noch nicht fertig."
    ],
    "transfer": [
      "Andere Konditorei: Kuchenbestellung um 13 Uhr geplant, jetzt ab 15 Uhr, Laden bis 17 Uhr. Bestätige 16 Uhr.",
      "四時に取りに行きます。",
      "午後四時に受け取ります。",
      "一時に取りに行きます。",
      "Die neue Bereitschaft beginnt um drei."
    ],
    "pedagogy": "紙の時刻は過去の約束。音声の変更連絡で最新情報を確認する。"
  },
  {
    "id": "bus-weather",
    "title": "Schulbus mit Umstieg wegen Sturm",
    "level": "A1",
    "genre": "travel",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Ein Busfahrplan und eine Durchsage nennen verschiedene Routen.",
    "goal": "Alte Verbindung mit angekündigtem Umstieg vergleichen",
    "readLabel": "Schulbus-Fahrplan",
    "readGenre": "timetable",
    "reading": [
      "大学行き　駅前発　八時十分／八時四十分／九時十分。",
      "大学前まで約二十分。土日は運休。"
    ],
    "readingGerman": "Bus werktags ab Bahnhof 8:10, 8:40 und 9:10, rund 20 Minuten bis zur Uni; nicht am Wochenende.",
    "spokenContext": "Busansage am Montagmorgen",
    "listening": [
      [
        "放送",
        "強い風のため、八時十分のバスは今日は走りません。",
        "Wegen Wind fährt der Bus um 8:10 heute nicht."
      ],
      [
        "放送",
        "八時四十分のバスは出ますが、大学前まで行きません。",
        "8:40 fährt, aber nicht bis zum Uniplatz."
      ],
      [
        "放送",
        "市役所前で降りて、三番のバスに乗り換えてください。",
        "Am Rathaus aussteigen und Linie drei nehmen."
      ],
      [
        "乗客",
        "八時四十分に乗って、市役所で乗り換えます。",
        "Ich nehme 8:40 und steige am Rathaus um."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche geplante Fahrt fällt aus?",
        "八時十分のバスです。",
        "八時十分発が運休です。",
        "八時四十分です。",
        "8:40 fährt mit geänderter Route.",
        [
          [
            "listening",
            "八時十分のバスは今日は走りません",
            "Ausfall"
          ]
        ]
      ],
      [
        "correction",
        "Wie gelangt man heute mit dem 8:40-Bus zur Uni?",
        "市役所前で三番に乗り換えます。",
        "市役所で三番のバスを使います。",
        "八時四十分のバスでそのまま大学前です。",
        "Der neue Umstieg überschreibt die gedruckte Direktfahrt.",
        [
          [
            "reading",
            "大学前まで約二十分",
            "ursprüngliche Fahrt"
          ],
          [
            "listening",
            "三番のバスに乗り換えて",
            "neuer Weg"
          ]
        ]
      ],
      [
        "inference",
        "Gilt die Wochenendregel des Fahrplans auch für diese Montagsänderung?",
        "いいえ、月曜日の変更です。",
        "今日は月曜日の特別なお知らせです。",
        "はい、今日は日曜日です。",
        "Die Ursache Wind betrifft die heutige Montagsfahrt, nicht die Wochenendregel.",
        [
          [
            "reading",
            "土日は運休",
            "allgemeine Regel"
          ],
          [
            "listening",
            "今日は走りません",
            "heute"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "運休",
        "うんきゅう",
        "Fahrtausfall",
        "reading: 土日は運休"
      ],
      [
        "乗り換え",
        "のりかえ",
        "Umstieg",
        "listening: 乗り換えてください"
      ]
    ],
    "writing": [
      "Sage einem Kommilitonen, wie du mit dem Bus zur Uni fährst.",
      "八時四十分のバスに乗り、市役所で三番に乗り換えます。",
      "市役所から三番で大学へ行きます。",
      "八時十分のバスで直接行きます。",
      "8:10 fällt aus."
    ],
    "transfer": [
      "Neue Route: 9:00 fährt nur zum Museum, von dort Linie zwei zur Bibliothek. Beschreibe.",
      "九時のバスで美術館まで行き、二番に乗り換えます。",
      "美術館で二番のバスに乗ります。",
      "大学前まで直接行きます。",
      "Die neuen Zielorte sind anders."
    ],
    "pedagogy": "古い時刻表と最新の放送を統合するが、臨時変更を毎日の規則にしない。"
  },
  {
    "id": "library-room",
    "title": "Bibliotheksreservierung und Kapazität",
    "level": "A1",
    "genre": "study",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Ein Reservierungsbeleg und eine telefonische Nachricht beschreiben einen Raumwechsel.",
    "goal": "Gültigen Raum und Gruppenregel kombinieren",
    "readLabel": "Reservierungsbestätigung",
    "readGenre": "email",
    "reading": [
      "金曜日、午後三時〜五時、二階の学習室を予約しました。",
      "人数：五人。予約番号：一八。"
    ],
    "readingGerman": "Reservierter Lernraum Freitag 15–17 Uhr im zweiten Stock für fünf Personen, Nummer 18.",
    "spokenContext": "Telefonische Nachricht der Bibliothek",
    "listening": [
      [
        "職員",
        "二階の学習室が工事になりました。",
        "Der Lernraum oben ist wegen Bauarbeiten gesperrt."
      ],
      [
        "職員",
        "一階の小さい部屋なら、同じ時間に使えます。",
        "Ein kleiner Raum unten ist zur selben Zeit verfügbar."
      ],
      [
        "職員",
        "でも、その部屋は四人までです。五人なら受付に相談してください。",
        "Aber höchstens vier. Bei fünf Personen bitte Rücksprache."
      ],
      [
        "職員",
        "予約はまだ新しい部屋に変えていません。",
        "Die Reservierung wurde noch nicht umgebucht."
      ]
    ],
    "questions": [
      [
        "detail",
        "Für wie viele Personen wurde zunächst gebucht?",
        "五人です。",
        "五人で予約しました。",
        "四人です。",
        "Vier ist das Limit des Ersatzraums.",
        [
          [
            "reading",
            "人数：五人",
            "Gruppengröße"
          ]
        ]
      ],
      [
        "correction",
        "Ist der Ersatzraum für fünf Personen bereits fest gebucht?",
        "いいえ、まだです。",
        "受付に相談する必要があります。",
        "はい、変更されました。",
        "Eine angebotene Option ist noch keine bestätigte Umbuchung.",
        [
          [
            "listening",
            "四人まで",
            "Limit"
          ],
          [
            "listening",
            "まだ新しい部屋に変えていません",
            "Status"
          ]
        ]
      ],
      [
        "inference",
        "Ist die Uhrzeit des Ersatzraums anders?",
        "いいえ、同じ時間です。",
        "三時から五時です。",
        "はい、六時からです。",
        "Die Zeit bleibt unverändert, falls eine passende Lösung gefunden wird.",
        [
          [
            "reading",
            "午後三時〜五時",
            "erste Zeit"
          ],
          [
            "listening",
            "同じ時間に使えます",
            "gleich"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "人数",
        "にんずう",
        "Personenzahl",
        "reading: 人数：五人"
      ],
      [
        "受付",
        "うけつけ",
        "Auskunftsschalter",
        "listening: 受付に相談"
      ]
    ],
    "writing": [
      "Bitte um eine Lösung für eine Gruppe von fünf Personen.",
      "五人なのですが、使える部屋はありますか。",
      "五人で利用したいので、相談できますか。",
      "四人の部屋を五人で使います。",
      "Die Kapazität ist vier."
    ],
    "transfer": [
      "Neues Haus: sechs Personen, Ersatzraum für drei, Reservierung noch nicht geändert. Bitte um passende Alternative.",
      "六人で使える部屋を教えてください。",
      "六人なのですが、別の部屋はありますか。",
      "三人の部屋を六人で使います。",
      "Die Ersatzkapazität wird überschritten."
    ],
    "pedagogy": "可能な提案、予約済みの状態、人数の制限を区別する。"
  },
  {
    "id": "movie-tickets",
    "title": "Zwei Plätze und geänderte Anfangszeit",
    "level": "A1",
    "genre": "social",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Auf Eintrittskarten steht die erste Filmzeit; eine Durchsage ändert nur den Beginn.",
    "goal": "Beginn, Einlass und unveränderte Sitzplätze unterscheiden",
    "readLabel": "Kinoticket",
    "readGenre": "ticket",
    "reading": [
      "映画『夏の道』　日曜日の午後三時上映。",
      "指定席：A列の七番・八番。開場：二時半。"
    ],
    "readingGerman": "Sonntag 15 Uhr Film, Sitze A7/A8, Einlass 14:30.",
    "spokenContext": "Aktuelle Ansage im Kino",
    "listening": [
      [
        "放送",
        "機械の問題で、映画は三十分遅れて始まります。",
        "Der Film beginnt wegen Technikproblemen 30 Minuten später."
      ],
      [
        "放送",
        "新しい開始時間は午後三時半です。",
        "Neuer Beginn 15:30."
      ],
      [
        "放送",
        "席の番号は変わりません。会場には二時半から入れます。",
        "Sitznummern unverändert, Einlass ab 14:30."
      ],
      [
        "客",
        "三時半から、席はA列の七番と八番ですね。",
        "15:30, Plätze A7 und A8."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Plätze gehören zu den Tickets?",
        "A列の七番と八番です。",
        "A列の七番と八番の席です。",
        "B列の七番です。",
        "Die ursprüngliche Sitzangabe bleibt.",
        [
          [
            "reading",
            "A列の七番・八番",
            "Sitze"
          ],
          [
            "listening",
            "席の番号は変わりません",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wann beginnt der Film tatsächlich?",
        "午後三時半です。",
        "三時三十分です。",
        "午後三時です。",
        "Die Ansage verschiebt um eine halbe Stunde.",
        [
          [
            "reading",
            "午後三時上映",
            "alt"
          ],
          [
            "listening",
            "午後三時半です",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Kann man weiterhin um 14:30 das Kino betreten?",
        "はい、入れます。",
        "二時半から入れます。",
        "いいえ、三時半まで入れません。",
        "Einlass ist nicht verschoben worden.",
        [
          [
            "reading",
            "開場：二時半",
            "Einlass"
          ],
          [
            "listening",
            "二時半から入れます",
            "Bestätigung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "上映",
        "じょうえい",
        "Filmvorführung",
        "reading: 午後三時上映"
      ],
      [
        "指定席",
        "していせき",
        "reservierter Sitz",
        "reading: 指定席"
      ]
    ],
    "writing": [
      "Schreibe einem Freund die neue Filmzeit und die weiterhin gültigen Plätze.",
      "映画は三時半からです。席はA列七番と八番のままです。",
      "三時半に始まるけど、席は変わらないよ。",
      "席も変わったから取り直そう。",
      "Die Plätze sind unverändert."
    ],
    "transfer": [
      "Neue Vorstellung: Karte für 17 Uhr, Ansage auf 17:20 verschoben, Sitz B4 bleibt. Informiere.",
      "映画は五時二十分からで、席はB列四番のままです。",
      "五時二十分に始まります。席は変わりません。",
      "五時のままです。",
      "Die Zeit wurde geändert."
    ],
    "pedagogy": "開始時刻だけが変わった場合、入場と席を誤って変更しない。"
  }
] satisfies P50RawMission[];
export const p50MissionsA=p50CorpusA.map(authoredP50Mission);
