import {authoredP48Case,type P48RawCase} from "./connected48-types";
/** Five independent A2 cross-document synthesis cases with plausible competing evidence. */
export const p48CorpusE=[
  {
    "id": "library-study-feedback",
    "title": "Lesekreis und unabhängige Aufgabe",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Bibliothek",
    "goal": "Zwei Bibliotheksveranstaltungen und eine Buchliste auseinanderhalten",
    "setup": "Die Bibliothek teilt einen neuen Lesekreistermin mit; eine Dozentin erwähnt zusätzlich ein separates Projekt.",
    "sourceNotes": "Ein Veranstaltungstermin ist keine akademische Abgabefrist; der Zweck jeder Quelle ist anders.",
    "sources": [
      [
        "Lesekreisankündigung",
        "email",
        1,
        "読書会は木曜日の六時からの予定でしたが、金曜日の五時から図書館の二階に変更します。",
        "Lesekreis von Donnerstag 18 Uhr auf Freitag 17 Uhr in Bibliothek, zweiter Stock.",
        "Verlegter Termin"
      ],
      [
        "Leseliste",
        "reading",
        2,
        "読書会では『小さな町の朝』の最初の二十ページを読んでください。全部読む必要はありません。",
        "Lesekreis: erste 20 Seiten lesen, nicht das ganze Buch.",
        "Vorbereitungsumfang"
      ],
      [
        "Nachricht der Dozentin",
        "message",
        3,
        "授業のレポートは来週の月曜日までに出してください。読書会とは別の課題です。",
        "Seminarbericht nächsten Montag abgeben; andere Aufgabe.",
        "Unabhängige akademische Frist"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wann und wo findet der Lesekreis jetzt statt?",
        "金曜日の五時に図書館の二階です。",
        "金曜日の午後五時からです。",
        "木曜日の六時です。",
        "Die erste Einladung wurde ersetzt.",
        [
          [
            0,
            "木曜日の六時",
            "alt"
          ],
          [
            0,
            "金曜日の五時",
            "aktuell"
          ]
        ]
      ],
      [
        "inference",
        "Müssen Teilnehmer für den Lesekreis das ganze Buch lesen?",
        "いいえ、最初の二十ページです。",
        "二十ページだけで大丈夫です。",
        "はい、全部です。",
        "Die Leseliste grenzt den Umfang ausdrücklich ein.",
        [
          [
            1,
            "全部読む必要はありません",
            "kein vollständiges Buch"
          ]
        ]
      ],
      [
        "evidence",
        "Welche Frist gilt für den Seminarbericht statt für den Lesekreis?",
        "来週の月曜日までです。",
        "月曜日にレポートを出します。",
        "金曜日の五時までです。",
        "Die separate Dozentenmitteilung benennt eine andere Aufgabe.",
        [
          [
            2,
            "読書会とは別の課題",
            "getrennt"
          ],
          [
            2,
            "月曜日まで",
            "Frist"
          ]
        ]
      ]
    ],
    "writing": [
      "Schreibe beide Verpflichtungen als getrennte Sätze.",
      "金曜日の五時に読書会へ行きます。レポートは月曜日までに出します。",
      "金曜日に本を読み、月曜日にレポートを出します。",
      "金曜日にレポートを出します。",
      "Freitag ist der Termin des Lesekreises."
    ],
    "returnCue": [
      "Neuer Kurs: Lesekreis Dienstag 16 Uhr, Schreibbericht Donnerstag abzugeben. Formuliere beide Verpflichtungen.",
      "火曜日の四時に読書会へ行き、木曜日までにレポートを出します。",
      "読書会は火曜日、レポートの締め切りは木曜日です。",
      "火曜日にレポートを出します。",
      "Lesekreis und Bericht sind verschieden."
    ]
  },
  {
    "id": "ferry-alternative-uncertain",
    "title": "Ersatzfähre ohne garantierte Abfahrt",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "domain": "Reise",
    "goal": "Verbindlichen Ausfall von ungewisser Ersatzankunft unterscheiden",
    "setup": "Ein Reiseplan wird durch eine Wetteransage, dann durch eine aktualisierte Bordmeldung ersetzt.",
    "sourceNotes": "Eine noch mögliche Verspätung ist keine sichere Absage; die Formulierung かもしれません beschreibt nur das Risiko.",
    "sources": [
      [
        "Buchungsbestätigung",
        "reading",
        1,
        "午前九時に島行きの船が出発します。予約番号を持って来てください。",
        "Abfahrt um neun mit Buchungsnummer.",
        "Alter fester Plan"
      ],
      [
        "Hafendurchsage",
        "announcement",
        2,
        "強い風のため九時の船は欠航です。十一時の船に乗れる予定ですが、天気によって遅れるかもしれません。",
        "Neunuhrfähre fällt aus, Ersatz um elf vorgesehen, wetterbedingt möglicherweise verspätet.",
        "Aktuelle Ausfall- und Unsicherheitsinfo"
      ],
      [
        "Ticketbüro",
        "spoken",
        3,
        "九時の切符はそのまま使えます。乗る前に出発時間を確認してください。",
        "Altes Ticket gültig; Zeit vor Abfahrt prüfen.",
        "Ticketregel und Verifikationsanweisung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Ist die Neunuhrfähre heute verfügbar?",
        "いいえ、欠航です。",
        "九時の船は出ません。",
        "はい、出発します。",
        "Die spätere Hafendurchsage storniert sie.",
        [
          [
            0,
            "午前九時に…出発",
            "alte Buchung"
          ],
          [
            1,
            "九時の船は欠航",
            "aktuelle Absage"
          ]
        ]
      ],
      [
        "inference",
        "Ist die Abfahrt um elf bereits sicher garantiert?",
        "いいえ、遅れるかもしれません。",
        "十一時の船も遅れる可能性があります。",
        "はい、必ず十一時に出ます。",
        "予定 plus かもしれません signalisiert Unsicherheit.",
        [
          [
            1,
            "遅れるかもしれません",
            "ungewiss"
          ]
        ]
      ],
      [
        "evidence",
        "Kann das ursprüngliche Ticket weiterverwendet werden?",
        "はい、そのまま使えます。",
        "九時の切符で大丈夫です。",
        "いいえ、新しい切符が必要です。",
        "Das Ticketbüro nennt es ausdrücklich.",
        [
          [
            2,
            "九時の切符はそのまま使えます",
            "Ticket bleibt"
          ]
        ]
      ]
    ],
    "writing": [
      "Erkläre vorsichtig die Ersatzoption und ihre Unsicherheit.",
      "九時の船は欠航です。十一時の船に乗れる予定ですが、遅れるかもしれません。",
      "十一時の船を使いたいですが、時間を確認します。",
      "十一時に必ず出発します。",
      "Die genaue Abfahrt ist nicht garantiert."
    ],
    "returnCue": [
      "Neuer Flug: Acht-Uhr-Flug abgesagt, Ersatz zehn Uhr möglich, könnte später werden, altes Ticket gültig. Formuliere ohne Gewissheit.",
      "八時の便は欠航で、十時の便に乗れる予定ですが、遅れるかもしれません。",
      "十時の便を確認します。切符はそのまま使えます。",
      "十時に必ず飛びます。",
      "Die Ersatzzeit ist nicht garantiert."
    ]
  },
  {
    "id": "two-teachers-conflicting",
    "title": "Unterschiedliche Lehrer, unterschiedliche Kurse",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Studium",
    "goal": "Scheinbar widersprüchliche E-Mails durch Kurszuordnung auflösen",
    "setup": "Zwei Lehrkräfte nennen unterschiedliche Abgabeformate; beide können gleichzeitig stimmen.",
    "sourceNotes": "Frühere und spätere Nachrichten zu unterschiedlichen Kursen dürfen nicht zu einer universellen Regel verschmolzen werden.",
    "sources": [
      [
        "Mail aus dem Japanischkurs",
        "email",
        1,
        "日本語の作文は月曜日までにメールで送ってください。手書きでなくてもかまいません。",
        "Japanischaufsatz bis Montag per Mail; handschriftlich nicht erforderlich.",
        "Japanischkurs"
      ],
      [
        "Mail aus dem Zeichenkurs",
        "email",
        2,
        "絵の課題は火曜日に教室で紙を提出してください。メールでは受け取りません。",
        "Zeichenaufgabe Dienstag im Kursraum auf Papier, keine Mail.",
        "Anderer Kurs"
      ],
      [
        "Frage eines Studenten",
        "message",
        3,
        "先生によって出し方が違うんですね。日本語はメールで、絵は紙ですね。",
        "Verschiedene Lehrkräfte, unterschiedliche Abgabearten: Japanisch Mail, Zeichnen Papier.",
        "Lernende Zusammenfassung"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Wie wird die Japanischaufgabe abgegeben?",
        "月曜日までにメールで送ります。",
        "日本語はメールです。",
        "火曜日に紙で出します。",
        "Die zweite Regel gilt einem anderen Kurs.",
        [
          [
            0,
            "作文は月曜日までにメール",
            "Japanisch"
          ],
          [
            1,
            "絵の課題は火曜日…紙",
            "Zeichnen"
          ]
        ]
      ],
      [
        "inference",
        "Widersprechen sich die Lehrer zwingend?",
        "いいえ、別の授業です。",
        "授業が違うので矛盾しません。",
        "はい、全部の課題はメールです。",
        "Die Regeln haben verschiedene Aufgaben als Bezug.",
        [
          [
            0,
            "日本語の作文",
            "Kurs A"
          ],
          [
            1,
            "絵の課題",
            "Kurs B"
          ]
        ]
      ],
      [
        "evidence",
        "Für welche Arbeit ist Papier verpflichtend?",
        "絵の課題です。",
        "絵の授業です。",
        "日本語の作文です。",
        "Die Papierpflicht betrifft nur das Zeichnen.",
        [
          [
            1,
            "紙を提出してください",
            "verpflichtend"
          ],
          [
            1,
            "メールでは受け取りません",
            "Mail nicht zulässig"
          ]
        ]
      ]
    ],
    "writing": [
      "Fasse beide Abgabewege und Tage korrekt zusammen.",
      "日本語の作文は月曜日までにメールで、絵の課題は火曜日に紙で出します。",
      "日本語はメール、絵は紙で出します。",
      "全部メールで出します。",
      "Der Zeichenkurs verlangt Papier."
    ],
    "returnCue": [
      "Neue Kurse: Geschichtsarbeit Freitag digital, Kunstprojekt Mittwoch auf Papier. Unterscheide sie.",
      "歴史の課題は金曜日にオンラインで、絵の課題は水曜日に紙で出します。",
      "歴史はオンラインで、芸術は紙で提出します。",
      "全部紙で出します。",
      "Zwei Fächer haben zwei Regeln."
    ]
  },
  {
    "id": "town-news-proposal",
    "title": "Neue Bibliothekszeiten als Probelauf",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "domain": "Gemeinschaft",
    "goal": "Beobachtete Nutzung, befristeten Versuch und noch offene Dauerentscheidung trennen",
    "setup": "Eine Lokalnachricht berichtet einen Vorschlag; die Bibliothek informiert später über einen kleinen Versuch.",
    "sourceNotes": "Eine beabsichtigte Verbesserung bedeutet nicht, dass sie bereits als dauerhafte Regel beschlossen ist.",
    "sources": [
      [
        "Lokalartikel",
        "reading",
        1,
        "学生から『図書館を毎日夜まで開けてほしい』という意見が出ました。職員は人手が足りないと話しています。",
        "Studenten wünschen tägliche Abendöffnung; Personal knapp.",
        "Wunsch und Hindernis"
      ],
      [
        "Offizieller Versuchsaushang",
        "notice",
        2,
        "来月は試しに土曜日だけ二時間長く開けます。ほかの日の時間は変わりません。",
        "Nächsten Monat testweise nur Samstag zwei Stunden länger; andere Tage unverändert.",
        "Beschlossener begrenzter Versuch"
      ],
      [
        "Presseantwort der Bibliothek",
        "spoken",
        3,
        "何人が来るか調べてから、今後の時間を決めます。毎日夜まで開けるかはまだ未定です。",
        "Nutzerzahlen auswerten, tägliche Abendöffnung noch unentschieden.",
        "Entscheidungsgrundlage"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welche verlängerte Öffnung ist tatsächlich beschlossen?",
        "土曜日だけ二時間長く開けます。",
        "来月の土曜日だけです。",
        "毎日夜まで開けます。",
        "Tägliche Abende sind nur ein Wunsch.",
        [
          [
            0,
            "毎日夜まで…ほしい",
            "Forderung"
          ],
          [
            1,
            "土曜日だけ二時間長く",
            "Versuch"
          ]
        ]
      ],
      [
        "inference",
        "Warum wird die Nutzung gemessen?",
        "今後の時間を決めるためです。",
        "続けるか考えるためです。",
        "すぐ毎日夜まで開くためです。",
        "Die Entscheidung bleibt bis nach der Beobachtung offen.",
        [
          [
            2,
            "何人が来るか調べてから",
            "Auswertung"
          ],
          [
            2,
            "まだ未定",
            "offen"
          ]
        ]
      ],
      [
        "evidence",
        "Beweist die Ankündigung eine dauerhafte tägliche Änderung?",
        "いいえ、まだ決まっていません。",
        "いいえ、試しに土曜日だけです。",
        "はい、毎日開きます。",
        "Probelauf und 未定 begrenzen die Behauptung.",
        [
          [
            1,
            "試しに",
            "probeweise"
          ],
          [
            2,
            "まだ未定です",
            "unentschieden"
          ]
        ]
      ]
    ],
    "writing": [
      "Erkläre in zwei Sätzen, was sicher und was offen ist.",
      "来月は土曜日だけ長く開きます。毎日夜まで開くかはまだ決まっていません。",
      "土曜日は試しに長く開きます。ほかの日は変わりません。",
      "毎日夜まで開くことが決まりました。",
      "Der Beschluss ist nur der Versuch."
    ],
    "returnCue": [
      "Andere Initiative: Schwimmbad öffnet nächsten Monat probeweise sonntags länger; tägliche Verlängerung offen. Formuliere.",
      "来月は日曜日だけ試しに長く開きますが、毎日については未定です。",
      "日曜日の延長は試験的です。",
      "毎日長く開きます。",
      "Es wurde nur ein Versuch beschlossen."
    ]
  },
  {
    "id": "volunteer-what-to-bring",
    "title": "Einsatzplan mit Materialliste und Einschränkung",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "domain": "Freiwilligenarbeit",
    "goal": "Verlegten Arbeitseinsatz, benötigte Materialien und optionale Hilfe getrennt interpretieren",
    "setup": "Die Gruppenleitung verlegt die Arbeit nach innen. Eine Liste und spätere Nachricht erklären die neue Ausrüstung.",
    "sourceNotes": "Nicht alles auf einer früheren Ausrüstungsliste gilt unverändert, sobald die Arbeit wechselt.",
    "sources": [
      [
        "Erster Einsatzplan",
        "schedule",
        1,
        "日曜日の十時から公園の掃除をします。軍手とごみ袋を持って来てください。",
        "Sonntag zehn Parkreinigung; Handschuhe und Müllsäcke.",
        "Erster Plan"
      ],
      [
        "Neue Leitungsnachricht",
        "message",
        2,
        "雨のため、掃除は来週にします。今週は十時から公民館で古い本を整理します。軍手は要りません。",
        "Parkreinigung verschoben, Sonntag 10 Uhr Bücher im Gemeindehaus sortieren; keine Handschuhe.",
        "Gültige Aufgabenänderung"
      ],
      [
        "Materialnachricht",
        "message",
        3,
        "本を入れる大きい袋が足りません。持っている方は持って来ていただけると助かります。",
        "Große Taschen für Bücher fehlen; wer eine hat, kann sie mitbringen.",
        "Optionale Bitte"
      ]
    ],
    "questions": [
      [
        "reconcile",
        "Welche Arbeit steht jetzt am Sonntag an?",
        "公民館で本を整理します。",
        "十時から本の整理です。",
        "公園の掃除です。",
        "Die Parkreinigung wurde auf nächste Woche verschoben.",
        [
          [
            0,
            "公園の掃除",
            "alt"
          ],
          [
            1,
            "公民館で古い本を整理",
            "gültig"
          ]
        ]
      ],
      [
        "inference",
        "Muss jeder zwingend eine große Tasche besitzen?",
        "いいえ、持っている人だけです。",
        "いいえ、あれば持って来ます。",
        "はい、全員必要です。",
        "Die Bitte richtet sich an Menschen, die schon eine Tasche haben.",
        [
          [
            2,
            "持っている方は",
            "bedingt"
          ],
          [
            2,
            "助かります",
            "Bitte"
          ]
        ]
      ],
      [
        "evidence",
        "Sind die zunächst geforderten Handschuhe jetzt nötig?",
        "いいえ、要りません。",
        "軍手は必要ありません。",
        "はい、必ず持ちます。",
        "Die Leitung widerruft die frühere Anweisung ausdrücklich.",
        [
          [
            0,
            "軍手…持って来て",
            "alt"
          ],
          [
            1,
            "軍手は要りません",
            "aktuell"
          ]
        ]
      ]
    ],
    "writing": [
      "Bestätige neuen Ort, Zeit und Materiallage.",
      "日曜日の十時に公民館で本を整理します。大きい袋があれば持って行きます。",
      "軍手はいりません。公民館へ行きます。",
      "公園で掃除をします。",
      "Der Einsatz wurde verlegt."
    ],
    "returnCue": [
      "Andere Initiative: Parkarbeit auf Montag verschoben, Samstag 14 Uhr Stühle in Schule sortieren, Handschuhe nicht nötig. Bestätige.",
      "土曜日の二時に学校でいすを整理します。軍手は要りません。",
      "公園の仕事は月曜日です。土曜日は学校で手伝います。",
      "土曜日に公園で掃除します。",
      "Die Arbeit am Samstag findet innen statt."
    ]
  }
] satisfies P48RawCase[];
export const p48CasesE=p48CorpusE.map(authoredP48Case);
