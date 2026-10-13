import {authoredP51Contrast,type P51RawContrast} from "./grammar51-types";
/** Original P51 E: A2 discourse, ongoing experiences, uncertainty, and independent context. */
export const p51CorpusE=[
  [
    "takotogaaru-koto",
    "〜たことがあります versus 〜ことがあります",
    "aspect",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "京都に行ったことがあります",
    "電車が遅れることがあります",
    "Vergangene Erfahrung: irgendwann getan",
    "Gelegentliche Möglichkeit oder wiederkehrendes Vorkommen",
    "Ein Mitreisender fragt nach Japanerfahrung und Bahnzuverlässigkeit.",
    "Reisepartner",
    "beide neutral höflich",
    "た形＋ことがある berichtet erlebte Vergangenheit; 辞書形＋ことがある kann gelegentliches Auftreten beschreiben.",
    [
      [
        "京都に行ったことがあります。",
        "Ich war schon einmal in Kyoto.",
        "Persönliche Erfahrung."
      ],
      [
        "この電車は遅れることがあります。",
        "Dieser Zug verspätet sich manchmal.",
        "Gelegentliches Ereignis."
      ],
      [
        "寿司を作ったことがありません。",
        "Ich habe noch nie Sushi zubereitet.",
        "Verneinte Erfahrung."
      ]
    ],
    "〜たことがあります als regelmäßiges Ereignis missverstehen.",
    "Vergangenheitsform vor ことが markiert Erfahrung.",
    [
      "Sage: Ich war schon einmal in Osaka.",
      "大阪に行ったことがあります。",
      "前に大阪に行ったことがあります。",
      "大阪に行くことがあります。",
      "Das würde regelmäßige/gelegentliche Fahrten nahelegen."
    ],
    [
      "Neuer Fall: Diese Straße ist manchmal gesperrt.",
      "この道は通れないことがあります。",
      "この道は閉まることがあります。",
      "この道が閉まったことがあります。",
      "Die letzte Form betont nur vergangene Erfahrung."
    ],
    "P48 Quellen zu wiederkehrenden Ausnahmen."
  ],
  [
    "you-ni-naru-dekiru",
    "〜ようになる versus Potenzialform",
    "aspect",
    [
      "p25:library",
      "p26:library-project"
    ],
    "読めるようになりました",
    "読めます",
    "Erworbene Fähigkeit bzw. neue Gewohnheit als Veränderung",
    "Fähigkeit im aktuellen Zustand",
    "Du erklärst, wie sich deine Lesekompetenz entwickelt hat.",
    "Lernpartner",
    "neutral höflich; Prozess versus Status",
    "〜ようになる hebt einen Übergang hervor (zuvor nicht, jetzt möglich); Potenzialform stellt primär die aktuelle Möglichkeit fest.",
    [
      [
        "漢字が少し読めるようになりました。",
        "Ich kann nun etwas Kanji lesen.",
        "Kompetenzzuwachs."
      ],
      [
        "漢字が少し読めます。",
        "Ich kann etwas Kanji lesen.",
        "Aktueller Zustand."
      ],
      [
        "毎朝勉強するようになりました。",
        "Ich habe angefangen, jeden Morgen zu lernen.",
        "Neue Gewohnheit."
      ]
    ],
    "〜ようになる als gleichbedeutende Kurzform für jede bestehende Fähigkeit behandeln.",
    "Es setzt einen Wandel zum jetzigen Zustand in Szene.",
    [
      "Sage: Seit dem Kurs kann ich jetzt Hiragana lesen.",
      "授業のあと、ひらがなが読めるようになりました。",
      "今はひらがなが読めるようになりました。",
      "今もひらがなが読めます。",
      "Der letzte Satz ist möglich, verschweigt aber den geforderten Kompetenzzuwachs."
    ],
    [
      "Neuer Kontext: Erkläre nur die gegenwärtige Fähigkeit, eine Fahrplantabelle zu lesen.",
      "時刻表が読めます。",
      "日本語の時刻表を読むことができます。",
      "時刻表が読めるようになりました。",
      "Das legt einen nicht genannten Entwicklungsprozess nahe."
    ],
    "P23–P50 keine erfundenen Niveaubestätigungen; nur eigene Aussagen."
  ],
  [
    "sugiru-yasui",
    "〜すぎる versus 〜やすい",
    "description",
    [
      "p25:shopping",
      "p23:ownership"
    ],
    "高すぎます",
    "使いやすいです",
    "Übermäßiger Grad",
    "Leicht ausführbare Tätigkeit / Benutzerfreundlichkeit",
    "Ein neuer Fahrkartenautomat ist leicht, aber ein Ticket zu teuer.",
    "Kunde",
    "い-Adjektiv−い＋すぎる; ます-Stamm＋やすい",
    "〜すぎる bewertet zu viel; Verbます-Stamm＋やすい beschreibt geringe Schwierigkeit. Nicht bloß zwei graduelle Adjektive.",
    [
      [
        "この切符は高すぎます。",
        "Dieses Ticket ist zu teuer.",
        "Übermaß."
      ],
      [
        "この機械は使いやすいです。",
        "Der Automat ist leicht zu bedienen.",
        "Geringe Schwierigkeit."
      ],
      [
        "説明が長すぎて、よくわかりません。",
        "Die Erklärung ist zu lang, ich verstehe sie schlecht.",
        "Kritischer Übergrad."
      ]
    ],
    "〜やすい als 'zu leicht' übersetzen.",
    "Es beschreibt tendenzielle Leichtigkeit, nicht Übermaß.",
    [
      "Sage: Diese Anleitung ist einfach zu lesen.",
      "この説明は読みやすいです。",
      "この案内は読みやすいです。",
      "この説明は読みすぎます。",
      "Das wäre 'zu viel lesen' statt leicht lesbar."
    ],
    [
      "Neue Situation: Der Koffer ist zu schwer.",
      "このスーツケースは重すぎます。",
      "荷物が重すぎます。",
      "この荷物は重いやすいです。",
      "Bei Adjektiv nutzt man 〜すぎる, nicht 〜やすい."
    ],
    "P49 Bedienhinweise und P50 Ticketpreise."
  ],
  [
    "yasui-nikui",
    "〜やすい versus 〜にくい",
    "description",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "読みやすい",
    "読みにくい",
    "Leicht bei der Tätigkeit",
    "Schwer/umständlich bei der Tätigkeit",
    "Eine Lehrkraft gibt eine gut lesbare und eine sehr kleine Schriftprobe.",
    "Lehrkraft",
    "beide an ます-Stamm; neutrale Beobachtung",
    "Verbます-Stamm＋やすい und ＋にくい drücken zwei Richtungen der Ausführbarkeit aus; sie sind keine zeitlichen Tempusformen.",
    [
      [
        "この字は大きくて読みやすいです。",
        "Die Schrift ist groß und gut lesbar.",
        "Leicht lesbar."
      ],
      [
        "この字は小さくて読みにくいです。",
        "Diese Schrift ist klein und schwer zu lesen.",
        "Schwierig."
      ],
      [
        "この道は歩きにくいです。",
        "Dieser Weg ist schwer zu begehen.",
        "Bewegung erschwert."
      ]
    ],
    "〜にくい mit 'ich will nicht' oder 'verboten' gleichsetzen.",
    "Es beschreibt Hindernis/Schwierigkeit, nicht Verbot.",
    [
      "Sage: Der Text ist wegen kleiner Zeichen schwer zu lesen.",
      "字が小さくて、この文章は読みにくいです。",
      "この文章は字が小さくて読みにくいです。",
      "字が小さいので読んではいけません。",
      "Schwierigkeit ist kein Leseverbot."
    ],
    [
      "Neue Situation: Diese App ist leicht zu bedienen.",
      "このアプリは使いやすいです。",
      "このアプリは操作しやすいです。",
      "このアプリは使いにくいです。",
      "Das würde schwer bedienbar bedeuten."
    ],
    "P49 echte Lesbarkeitsübungen, nicht nur Formendefinition."
  ],
  [
    "aida-aidani",
    "〜間 versus 〜間に",
    "time",
    [
      "p25:library",
      "p26:library-project"
    ],
    "授業の間",
    "授業の間に",
    "Während des gesamten/fortlaufenden Zeitraums",
    "Ein begrenztes Ereignis innerhalb dieses Zeitraums",
    "Du liest die ganze Bahnfahrt und rufst irgendwann unterwegs kurz an.",
    "Mitreisender",
    "neutral höflich; Partikel に verändert Ereignisrahmen",
    "〜間 beschreibt anhaltende Aktivität während des Rahmens, 〜間に ein Ereignis, das irgendwann innerhalb der Dauer stattfindet.",
    [
      [
        "電車に乗っている間、本を読みました。",
        "Während der Bahnfahrt las ich.",
        "Fortlaufende Aktivität."
      ],
      [
        "電車に乗っている間に、友だちから電話が来ました。",
        "Während der Bahnfahrt kam ein Anruf.",
        "Einzelereignis."
      ],
      [
        "母が料理している間に、テーブルを片づけました。",
        "Während sie kochte, räumte ich den Tisch.",
        "Abgeschlossene Teilhandlung im Zeitraum."
      ]
    ],
    "〜間 und 〜間に ohne Unterschied als unmarkiertes 'während' behandeln.",
    "Die Frage lautet: Dauerhandlung oder punktuelles Ereignis?",
    [
      "Berichte, dass während der Fahrt ein Anruf kam.",
      "電車に乗っている間に電話が来ました。",
      "電車の中にいる間に電話がありました。",
      "電車に乗っている間、ずっと電話が来ました。",
      "Das suggeriert fortwährende Anrufe."
    ],
    [
      "Neuer Kontext: Du hast die ganze Wartezeit gelesen.",
      "待っている間、本を読んでいました。",
      "待ち時間の間、ずっと本を読んでいました。",
      "待っている間に、一回本を読みました。",
      "Die Aufgabe betont eine anhaltende Tätigkeit."
    ],
    "P47 Hörchronologie und P48 Abfolgen."
  ],
  [
    "naide-zuni",
    "〜ないで versus 〜ずに",
    "sequence",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "朝ご飯を食べないで",
    "朝ご飯を食べずに",
    "Ohne Handlung; auch Bitte um Unterlassung",
    "Ohne Handlung (etwas schriftsprachlicher)",
    "Ein Freund ging ohne Frühstück; eine Anweisung fordert nicht zu rennen auf.",
    "Freund und Aushang",
    "〜ないで oft Gespräch; 〜ずに etwas formeller/schriftlicher; する→せずに",
    "Beide können 'ohne etwas zu tun' ausdrücken; 〜ないでください ist zudem eine Bitte um Unterlassen. 〜ずに bildet keine entsprechende simple höfliche Verbotsbitte.",
    [
      [
        "朝ご飯を食べないで出かけました。",
        "Ich ging ohne Frühstück los.",
        "Auslassung."
      ],
      [
        "朝ご飯を食べずに出かけました。",
        "Ich ging ohne Frühstück los.",
        "Etwas schriftsprachlicher."
      ],
      [
        "ここで走らないでください。",
        "Bitte laufen Sie hier nicht.",
        "Bitte um Unterlassung."
      ]
    ],
    "〜ずにください als direkte Entsprechung von 〜ないでください bilden.",
    "Für Bitte um Nichttun ist 〜ないでください idiomatisch.",
    [
      "Sage auf einem Schild: Bitte hier nicht rauchen.",
      "ここでたばこを吸わないでください。",
      "ここでは喫煙しないでください。",
      "ここでたばこを吸わずにください。",
      "Die Bitte braucht 〜ないでください."
    ],
    [
      "Neuer Kontext: Du bist ohne Schirm aus dem Haus gegangen.",
      "傘を持たずに出かけました。",
      "傘を持たないで出かけました。",
      "傘を持って出かけました。",
      "Die letzte Antwort sagt genau das Gegenteil."
    ],
    "P49 Hinweisstile und P44 höfliche Handlungen."
  ],
  [
    "kadouka-ka",
    "〜かどうか versus Fragewort＋か",
    "evidence",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "開いているかどうか",
    "何時に開くか",
    "Ja/Nein-Wahrheitsfrage indirekt einbetten",
    "Offene W-Frage indirekt einbetten",
    "Ein Besucher muss klären, ob die Bibliothek geöffnet ist, und zusätzlich wann.",
    "Bibliothekspersonal",
    "neutral höflich; Konstruktion in größerem Satz",
    "〜かどうか bei binärer Entscheidung; Fragewort＋か bei einer konkreten offenen Informationslücke.",
    [
      [
        "図書館が開いているかどうか調べます。",
        "Ich prüfe, ob die Bibliothek offen ist.",
        "Ja/Nein."
      ],
      [
        "図書館が何時に開くか調べます。",
        "Ich prüfe, wann sie öffnet.",
        "W-Frage."
      ],
      [
        "バスが来るかどうかわかりません。",
        "Ich weiß nicht, ob ein Bus kommt.",
        "Unklarer Wahrheitswert."
      ]
    ],
    "何時かどうか als natürliche Angabe für 'um wieviel Uhr' verwenden.",
    "Das konkrete Fragewort steht unmittelbar vor か.",
    [
      "Bitte: Prüfe, ob das Museum morgen offen hat.",
      "明日、美術館が開いているかどうか確認してください。",
      "美術館が明日開くかどうか調べてください。",
      "明日、美術館が何時かどうか調べてください。",
      "Es geht um ob, nicht wann."
    ],
    [
      "Neuer Kontext: Du weißt nicht, in welchem Raum der Kurs beginnt.",
      "授業がどの部屋で始まるかわかりません。",
      "授業がどこであるか知りません。",
      "授業の部屋かどうかわかりません。",
      "Die konkrete Ortsinformation fehlt."
    ],
    "P50 unklare Buchungs-/Ortsauskünfte."
  ],
  [
    "bakari-dake",
    "〜ばかり versus 〜だけ",
    "comparison",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "テレビばかり見ています",
    "テレビだけ見ます",
    "Überwiegend/immer wieder, oft kritisch empfunden",
    "Nur diese Sache im betreffenden Umfang",
    "Eltern kritisieren einseitige Bildschirmzeit; jemand sagt neutral, er sieht nur Nachrichten.",
    "Familie und Freund",
    "ばかり kann wertend wirken; だけ oft neutral",
    "〜ばかり beschreibt Häufung/Einseitigkeit; 〜だけ grenzt den Umfang aus. Eine einmalige 'nur'-Entscheidung heißt nicht automatisch 'ständig'.",
    [
      [
        "弟はゲームばかりしています。",
        "Mein Bruder spielt ständig/nur noch Spiele.",
        "Kritische Einseitigkeit."
      ],
      [
        "今日はニュースだけ見ます。",
        "Heute schaue ich nur Nachrichten.",
        "Neutrale Auswahl."
      ],
      [
        "甘いものばかり食べています。",
        "Ich esse dauernd Süßes.",
        "Häufigkeit/Einseitigkeit."
      ]
    ],
    "〜ばかり als rein logisches genau-eins-Element lesen.",
    "Wähle だけ für neutrale Begrenzung.",
    [
      "Sage neutral: Heute trinke ich nur Tee.",
      "今日はお茶だけ飲みます。",
      "今日はお茶だけにします。",
      "今日はお茶ばかり飲んでいます。",
      "Das beschreibt wiederholte Einseitigkeit."
    ],
    [
      "Neuer Kontext: Jemand spielt fast ständig am Handy, du kritisierst die Einseitigkeit.",
      "スマホのゲームばかりしています。",
      "いつもスマホばかり見ています。",
      "今日はスマホだけ見ます。",
      "Das ist eine neutrale Tagesentscheidung, keine Gewohnheitskritik."
    ],
    "P45 natürlichere freie Erzählung."
  ],
  [
    "koto-ni-suru-koto-ni-naru",
    "〜ことにする versus 〜ことになる",
    "intention",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "来週行くことにしました",
    "来週行くことになりました",
    "Eigene bewusste Entscheidung",
    "Entscheidung/Ergebnis durch Umstände oder andere Vereinbarung",
    "Du beschließt Urlaub, ein Kurs wird administrativ verschoben.",
    "Freund oder Kursleitung",
    "neutral höflich; Agentivität unterscheidet",
    "辞書形＋ことにする betont Entscheidung durch Subjekt; ＋ことになる eine Entscheidung/Entwicklung, die durch äußere Umstände/Absprachen zustande kommt.",
    [
      [
        "来週、日本へ行くことにしました。",
        "Ich habe beschlossen, nächste Woche nach Japan zu reisen.",
        "Eigener Entschluss."
      ],
      [
        "授業は来週から始まることになりました。",
        "Es wurde festgelegt, dass der Kurs nächste Woche beginnt.",
        "Ergebnis einer Regelung."
      ],
      [
        "毎朝歩くことにしました。",
        "Ich habe mir vorgenommen, jeden Morgen zu gehen.",
        "Individuelle Entscheidung."
      ]
    ],
    "Eine verlegte Kurszeit als persönliche Entscheidung der Lernenden formulieren.",
    "Wer entscheidet, ist kommunikativ relevant.",
    [
      "Sage: Es wurde beschlossen, dass der Kurs am Montag beginnt.",
      "授業は月曜日から始まることになりました。",
      "月曜日に授業が始まることになりました。",
      "私は授業を月曜日に始めることにしました。",
      "Das behauptet, du hättest den Kursbeginn selbst festgelegt."
    ],
    [
      "Neue Situation: Du beschließt selbst, ab morgen täglich zu lesen.",
      "明日から毎日本を読むことにしました。",
      "明日から読書することにします。",
      "毎日読むことになりました。",
      "Das verschiebt den eigenen Entschluss in äußere Festlegung."
    ],
    "P43 Entscheidungen mit echten Folgen."
  ],
  [
    "toiu-yobareteiru",
    "〜という versus 〜と呼ばれています",
    "description",
    [
      "p25:library",
      "p26:library-project"
    ],
    "『さくら』という店",
    "『さくら』と呼ばれています",
    "Namen oder Inhalt einer Bezeichnung angeben",
    "Häufig gebrauchte Benennung/passive Gewohnheit ausdrücken",
    "Du erläuterst den Namen eines Cafés und den Spitznamen eines Platzes.",
    "Freund",
    "〜という kompakt im Alltag; 呼ばれる benennt soziale Benennung",
    "〜という benennt etwas 'mit dem Namen/inhaltlich ...'; 〜と呼ばれている sagt, dass andere es üblicherweise so nennen.",
    [
      [
        "『さくら』というカフェがあります。",
        "Es gibt ein Café namens Sakura.",
        "Name wird eingeführt."
      ],
      [
        "この公園は『緑の広場』と呼ばれています。",
        "Dieser Park wird Grüner Platz genannt.",
        "Übliche Benennung."
      ],
      [
        "田中さんという先生に会いました。",
        "Ich traf einen Lehrer namens Tanaka.",
        "Person als Name vorgestellt."
      ]
    ],
    "〜という und passive Benennung als exakt gleiche Perspektive verstehen.",
    "Ersteinführung eines Namens versus gesellschaftliche Gewohnheit unterscheiden.",
    [
      "Sage: Es gibt ein Buch mit dem Titel 'Kleine Reise'.",
      "『小さな旅』という本があります。",
      "『小さな旅』という題名の本があります。",
      "『小さな旅』と呼ばれています本があります。",
      "Das ist in dieser Verbindung keine natürliche Nominalmodifikation."
    ],
    [
      "Neuer Kontext: Der Platz wird allgemein 'Blumenplatz' genannt.",
      "その広場は『花の広場』と呼ばれています。",
      "みんなはそこを『花の広場』と呼んでいます。",
      "『花の広場』という広場です。",
      "Die letzte Form ist möglich als Name, lässt aber die übliche soziale Benennung aus."
    ],
    "P46 narrative Beschreibungen und P49 Eigennamen."
  ]
] satisfies P51RawContrast[];
export const p51ContrastsE=p51CorpusE.map(authoredP51Contrast);
