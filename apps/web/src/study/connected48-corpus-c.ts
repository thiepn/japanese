import {authoredP48Case,type P48RawCase} from "./connected48-types";
/** Five original A2 multi-source evidence and uncertainty missions. */
export const p48CorpusC=[
  {
    "id": "exam-room-dual",
    "title": "Klausurraum und gesonderte Besprechung",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Studium",
    "goal": "Zwei ähnliche Termine über drei Dokumente trennen",
    "setup": "Ein Dozent verschiebt eine Klausur räumlich. Eine studentische Chatnachricht mischt die Klausur mit einer vorbereitenden Besprechung.",
    "sourceNotes": "Prüfung und Vorbereitung haben verschiedene Verantwortliche; eine Vermutung im Gruppenchat ist keine offizielle Raumzusage.",
    "sources": [
      [
        "Offizielle Klausurankündigung",
        "email",
        1,
        "金曜日の試験は九時から二〇一号室で行う予定です。開始の十分前までに来てください。",
        "Freitag neun Uhr Klausur in Raum 201; zehn Minuten vorher kommen.",
        "Früherer offizieller Plan"
      ],
      [
        "Neue offizielle Mail",
        "email",
        2,
        "教室が使えなくなったため、試験は三〇四号室に変更します。開始は九時のままです。",
        "Raum unbenutzbar, Prüfung nach 304, Beginn bleibt neun.",
        "Gültiger Klausurstand"
      ],
      [
        "Nachricht einer Studentin",
        "message",
        3,
        "試験の前の勉強会は木曜日の六時に図書館でやろう。試験は三〇四号室らしいよ。",
        "Lerngruppe Donnerstag 18 Uhr Bibliothek; Klausur wohl Raum 304.",
        "Private Besprechung und Hörensagen"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wo und wann findet die Klausur statt?",
        "金曜日の九時に三〇四号室です。",
        "三〇四号室で九時からです。",
        "木曜日の六時に図書館です。",
        "Donnerstag ist Lerngruppe, nicht Klausur.",
        [
          [
            0,
            "九時から二〇一号室",
            "alter Plan"
          ],
          [
            1,
            "三〇四号室に変更",
            "verbindliche Änderung"
          ]
        ]
      ],
      [
        "inference",
        "Was kann man zur Vorbereitungsrunde sicher sagen?",
        "木曜日の六時に図書館です。",
        "木曜日の勉強会は図書館で行います。",
        "試験も木曜日です。",
        "Der Gruppenchat betrifft eine getrennte Veranstaltung.",
        [
          [
            2,
            "試験の前の勉強会は木曜日の六時に図書館",
            "anderer Termin"
          ]
        ]
      ],
      [
        "evidence",
        "Warum ist die Raumangabe 304 besser belegt als nur durch den Gruppenchat?",
        "先生の新しいメールにあります。",
        "公式の変更のお知らせに書いてあります。",
        "学生の話だけです。",
        "Die offizielle Mail bestätigt die Änderung unabhängig.",
        [
          [
            1,
            "試験は三〇四号室に変更",
            "offizieller Beleg"
          ],
          [
            2,
            "三〇四号室らしいよ",
            "Hörensagen"
          ]
        ]
      ]
    ],
    "writing": [
      "Schicke eine knappe Nachricht mit Klausur und Lerngruppe.",
      "試験は金曜日九時に三〇四号室、勉強会は木曜日六時に図書館です。",
      "金曜日の試験は三〇四号室です。木曜日は図書館で勉強会があります。",
      "試験は木曜日に図書館です。",
      "Das verwechselt zwei Veranstaltungen."
    ],
    "returnCue": [
      "Neue Situation: Workshop Donnerstag 13 Uhr Raum 405 statt Raum 101, Lerngruppe Mittwoch 16 Uhr Bibliothek. Gib beides weiter.",
      "ワークショップは木曜日の一時に四〇五号室、勉強会は水曜日の四時に図書館です。",
      "木曜日のワークショップは四〇五号室です。勉強会は水曜日です。",
      "木曜日に図書館でワークショップです。",
      "Die zwei Termine sind getrennt."
    ]
  },
  {
    "id": "rental-fees",
    "title": "Wohnung: Werbung und Vertragshinweis",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "domain": "Wohnen",
    "goal": "Einschluss von Kosten anhand zweier Dokumente konkret bestimmen",
    "setup": "Eine fiktive Anzeige bewirbt eine Miete. Eine neuere Nachricht schlüsselt Nebenkosten auf.",
    "sourceNotes": "Ein Werbetext ist nicht automatisch die letzte Information über jede Kostenart; Zahlen sind erfundene Unterrichtswerte.",
    "sources": [
      [
        "Wohnungsanzeige",
        "reading",
        1,
        "家賃は五万円です。水道代を含みます。駅まで歩いて十分です。",
        "Miete 50.000 Yen, Wasser enthalten, 10 Minuten Fußweg zum Bahnhof.",
        "Öffentliche Anzeige"
      ],
      [
        "E-Mail der Verwaltung",
        "email",
        2,
        "ご質問ありがとうございます。電気代は家賃に含まれません。インターネットも別にお支払いください。",
        "Strom und Internet sind nicht enthalten.",
        "Aktuelle ergänzende Kosteninfo"
      ],
      [
        "Besichtigungsnachricht",
        "message",
        3,
        "土曜日は見学できません。火曜日の午後四時なら空いています。",
        "Samstag keine Besichtigung; Dienstag 16 Uhr frei.",
        "Terminoption"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welche Kosten sind ausdrücklich enthalten?",
        "水道代だけです。",
        "水道代は含まれています。",
        "インターネット代も入っています。",
        "Die Verwaltung nennt Internet als Zusatzkosten.",
        [
          [
            0,
            "水道代を含みます",
            "enthalten"
          ],
          [
            1,
            "インターネットも別",
            "separat"
          ]
        ]
      ],
      [
        "inference",
        "Ist die Miete inklusive Strom und Internet?",
        "いいえ、別に払います。",
        "電気代とインターネット代は別です。",
        "はい、全部込みです。",
        "Die Mail widerspricht dieser Annahme.",
        [
          [
            1,
            "電気代は家賃に含まれません",
            "Strom"
          ],
          [
            1,
            "インターネットも別",
            "Internet"
          ]
        ]
      ],
      [
        "evidence",
        "Welcher Besichtigungstermin ist tatsächlich angeboten?",
        "火曜日の午後四時です。",
        "火曜日の四時です。",
        "土曜日の午後四時です。",
        "Die separate Nachricht schließt Samstag aus.",
        [
          [
            2,
            "土曜日は見学できません",
            "Ausschluss"
          ],
          [
            2,
            "火曜日の午後四時",
            "gültige Option"
          ]
        ]
      ]
    ],
    "writing": [
      "Bitte höflich um den angebotenen Termin und eine Kostenbestätigung.",
      "火曜日の四時に見学したいです。電気代とネット代は別ですね。",
      "火曜日の午後四時に伺います。水道代は含まれていますね。",
      "土曜日に見学します。",
      "Samstag ist nicht verfügbar."
    ],
    "returnCue": [
      "Andere Anzeige: Heizkosten enthalten, Internet extra, Besichtigung Freitag 15 Uhr. Bitte höflich um den Termin.",
      "金曜日の三時に見学したいです。インターネット代は別ですね。",
      "金曜日の午後三時に伺えますか。",
      "火曜日の四時に行きます。",
      "Der neue Termin gilt Freitag."
    ]
  },
  {
    "id": "package-deadline",
    "title": "Zustellversuch und Abholfenster",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "domain": "Einkauf",
    "goal": "Änderungsfrist, Hauslieferung und Ladenabholung sauber unterscheiden",
    "setup": "Drei Nachrichten des Paketdienstes benutzen verschiedene Uhrzeiten.",
    "sourceNotes": "Nicht jede Uhrzeit ist eine Abholzeit; eine kann das Ende der Änderungsmöglichkeit bezeichnen.",
    "sources": [
      [
        "Erste Versandmail",
        "email",
        1,
        "お荷物は木曜日の午前中に配達する予定です。",
        "Geplante Hauslieferung Donnerstagvormittag.",
        "Alter Plan"
      ],
      [
        "Sprachnachricht des Fahrers",
        "voicemail",
        2,
        "道路工事のため、配達は金曜日の午後二時から五時になります。時間を変える方は木曜日の夜八時までに連絡してください。",
        "Neue Hauslieferung Freitag 14–17 Uhr; Änderung bis Donnerstag 20 Uhr melden.",
        "Spätere Änderung und Antwortfrist"
      ],
      [
        "Nachricht der Abholstation",
        "notice",
        3,
        "店で受け取る場合は、金曜日の午前十一時以降に来てください。身分証が必要です。",
        "Ladenabholung Freitag ab 11 Uhr, Ausweis erforderlich.",
        "Alternative Übergabe"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wann wird nun nach Hause geliefert?",
        "金曜日の午後二時から五時です。",
        "金曜日の午後に配達されます。",
        "木曜日の午前中です。",
        "Die spätere Zustellmitteilung ersetzt Donnerstag.",
        [
          [
            0,
            "木曜日の午前中",
            "alt"
          ],
          [
            1,
            "金曜日の午後二時から五時",
            "aktuell"
          ]
        ]
      ],
      [
        "inference",
        "Kann man im Laden vor der Hauszustellung abholen?",
        "はい、金曜日の十一時からです。",
        "はい、店なら十一時以降です。",
        "いいえ、五時以降だけです。",
        "Die Station öffnet die Abholung früher als das Hauslieferfenster.",
        [
          [
            1,
            "午後二時から五時",
            "Haus"
          ],
          [
            2,
            "午前十一時以降",
            "Laden"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Bedeutung hat Donnerstag 20 Uhr?",
        "変更の連絡の締め切りです。",
        "配達時間を変える連絡の期限です。",
        "荷物の受け取り時間です。",
        "Der Termin betrifft die Änderungsanmeldung, nicht die Abholung.",
        [
          [
            1,
            "時間を変える方は木曜日の夜八時まで",
            "Änderungsfrist"
          ]
        ]
      ]
    ],
    "writing": [
      "Bitte um Ladenabholung am Freitag um zwölf und erwähne den Ausweis.",
      "金曜日の十二時に店で受け取ります。身分証を持って行きます。",
      "金曜日の昼に身分証を持って店へ行きます。",
      "木曜日の朝に家で受け取ります。",
      "Die Zustellung wurde verschoben."
    ],
    "returnCue": [
      "Neue Lieferung: Haus Samstag 16–18 Uhr, Laden ab 10 Uhr mit Ausweis. Bitte um Abholung um elf.",
      "土曜日の十一時に身分証を持って店で受け取ります。",
      "土曜日の十一時に店へ取りに行きます。",
      "土曜日の九時に店へ行きます。",
      "Neun Uhr liegt vor der Ladenabholung."
    ]
  },
  {
    "id": "community-garden-plan",
    "title": "Gemeinschaftsgarten und unbestätigte Idee",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Nachbarschaft",
    "goal": "Beschlossene Termine von noch diskutierten Vorschlägen unterscheiden",
    "setup": "Ein Gartenverein plant ein Treffen; ein Vereinsmitglied schlägt eine zusätzliche Veranstaltung vor.",
    "sourceNotes": "〜かもしれません und まだ決まっていません markieren hier ausdrücklich Unsicherheit.",
    "sources": [
      [
        "Aushang des Vereins",
        "notice",
        1,
        "今月の土曜日は朝九時から十一時まで畑の手入れをします。雨でも温室の掃除は行います。",
        "Samstag 9–11 Gartenpflege, bei Regen Gewächshaus reinigen.",
        "Bestätigter Arbeitseinsatz"
      ],
      [
        "Gruppenchat",
        "message",
        2,
        "午後に野菜の料理会もできるかもしれません。場所はまだ決まっていません。",
        "Vielleicht nachmittags Kochrunde, Ort unklar.",
        "Unverbindlicher Vorschlag"
      ],
      [
        "Antwort der Leitung",
        "message",
        3,
        "料理会は今回はありません。午前の活動だけ予定どおり行います。",
        "Diesmal kein Kochtreffen; Vormittagsaktivität bleibt.",
        "Aktuelle endgültige Entscheidung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Was findet tatsächlich statt?",
        "午前の畑の活動だけです。",
        "朝九時から十一時までの活動です。",
        "午後の料理会です。",
        "Die Leitung sagt die optionale Kochrunde ab.",
        [
          [
            0,
            "朝九時から十一時まで",
            "sicherer Termin"
          ],
          [
            2,
            "午前の活動だけ",
            "gültig"
          ]
        ]
      ],
      [
        "inference",
        "Was wird bei Regen getan?",
        "温室を掃除します。",
        "温室の掃除をします。",
        "活動は全部中止です。",
        "Die erste Nachricht nennt eine explizite Regenalternative.",
        [
          [
            0,
            "雨でも温室の掃除",
            "Wetteralternative"
          ],
          [
            2,
            "予定どおり",
            "Veranstaltung bleibt"
          ]
        ]
      ],
      [
        "evidence",
        "War die nachmittägliche Kochrunde jemals sicher zugesagt?",
        "いいえ、まだ決まっていませんでした。",
        "いいえ、案だけでした。",
        "はい、必ずあります。",
        "Schon der Chat markiert sie als unsicher, die Leitung sagt sie ab.",
        [
          [
            1,
            "かもしれません",
            "möglich"
          ],
          [
            1,
            "まだ決まっていません",
            "unentschieden"
          ],
          [
            2,
            "料理会は今回はありません",
            "Endstand"
          ]
        ]
      ]
    ],
    "writing": [
      "Informiere einen Freund über den sicheren Vormittag und das nicht stattfindende Kochen.",
      "土曜日の朝は畑の活動がありますが、料理会はありません。",
      "朝九時から手伝います。午後の料理会はありません。",
      "午後の料理会に行きます。",
      "Die Kochrunde ist abgesagt."
    ],
    "returnCue": [
      "Andere Initiative: Samstagsbüchertausch bestätigt, Sonntagslesung nur vorgeschlagen und noch nicht beschlossen. Formuliere vorsichtig.",
      "土曜日の本の交換会はありますが、日曜日の朗読会はまだ決まっていません。",
      "日曜日の朗読会はあるかもしれません。",
      "日曜日の朗読会は必ずあります。",
      "Ein Vorschlag ist keine feste Zusage."
    ]
  },
  {
    "id": "museum-double-times",
    "title": "Sonderausstellung mit drei Uhrzeiten",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Kultur",
    "goal": "Einlass, Ende der Sonderausstellung und Gebäudeschluss abgleichen",
    "setup": "Eine Website und zwei Aushänge nennen unterschiedliche Zeitgrenzen für das Museum.",
    "sourceNotes": "Die drei Zeiten beschreiben unterschiedliche Handlungen; sie widersprechen einander nicht notwendigerweise.",
    "sources": [
      [
        "Museumswebsite",
        "reading",
        1,
        "美術館は毎日午後六時まで開いています。",
        "Museum grundsätzlich bis 18 Uhr geöffnet.",
        "Gebäudeschluss"
      ],
      [
        "Einlass-Aushang",
        "notice",
        2,
        "新しく入れるのは午後五時までです。受付は五時に終わります。",
        "Letzter Einlass 17 Uhr, Anmeldung endet.",
        "Einlassgrenze"
      ],
      [
        "Ausstellungshinweis",
        "notice",
        3,
        "二階の特別展示は午後四時半に終了します。展示を見たい方は早めに入ってください。",
        "Sonderausstellung oben endet 16:30, früher kommen.",
        "Programmgrenze"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Bis wann muss jemand kommen, der die Sonderausstellung sehen will?",
        "午後四時半より前です。",
        "四時半までに二階へ行きます。",
        "午後六時までです。",
        "Das Gebäude ist länger offen als diese Ausstellung.",
        [
          [
            0,
            "午後六時まで",
            "Gebäude"
          ],
          [
            2,
            "午後四時半に終了",
            "Ausstellung"
          ]
        ]
      ],
      [
        "inference",
        "Kann man um 17:15 noch neu ins Museum eintreten?",
        "いいえ、受付は終わっています。",
        "いいえ、五時までしか入れません。",
        "はい、六時まで開いています。",
        "Öffnungszeit ist keine Einlasszeit.",
        [
          [
            0,
            "午後六時まで",
            "Schließung"
          ],
          [
            1,
            "受付は五時に終わります",
            "Einlass"
          ]
        ]
      ],
      [
        "evidence",
        "Sind die drei Angaben zwingend widersprüchlich?",
        "いいえ、違う時間の規則です。",
        "いいえ、展示と入場と閉館の時間です。",
        "はい、全部同じ時間です。",
        "Sie betreffen verschiedene Aktivitäten.",
        [
          [
            0,
            "午後六時まで",
            "Schließung"
          ],
          [
            1,
            "午後五時まで",
            "Einlass"
          ],
          [
            2,
            "午後四時半に終了",
            "Ausstellung"
          ]
        ]
      ]
    ],
    "writing": [
      "Empfiehl, vor halb fünf zur Sonderausstellung zu kommen.",
      "特別展示を見たいなら、四時半より前に行ったほうがいいです。",
      "四時半までに二階へ行きましょう。",
      "六時に特別展示に行きます。",
      "Die Ausstellung endet um halb fünf."
    ],
    "returnCue": [
      "Neues Museum: Gebäudeschluss 19 Uhr, Einlass 18 Uhr, Sonderführung 17 Uhr beendet. Empfiehl Ankunft vor fünf.",
      "特別案内を見たいなら、五時より前に行きましょう。",
      "五時までに行ったほうがいいです。",
      "七時に行けばいいです。",
      "Die Führung endet früher als das Gebäude."
    ]
  }
] satisfies P48RawCase[];
export const p48CasesC=p48CorpusC.map(authoredP48Case);
