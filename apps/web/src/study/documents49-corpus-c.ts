import {authoredP49Document,type P49RawDocument} from "./documents49-types";
/** Eight richer A2 documents involving multiple simultaneous conditions. */
export const p49CorpusC=[
  {
    "id": "train-workday-exception",
    "genre": "timetable",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "電車の工事期間の時刻表",
    "purpose": "Wochentag, Betriebsunterbrechung und Ersatzfahrplan kombinieren",
    "audience": "Bahnfahrgäste",
    "issuer": "あお線案内所",
    "blocks": [
      "工事のお知らせ　十月五日（月）〜九日（金）",
      "この期間、駅前発の八時十分の電車は運休です。八時四十分と九時十分の電車は通常どおり走ります。",
      "土曜日と日曜日は工事をしません。特別バスは平日の八時十五分に南口から出ます。"
    ],
    "terms": [
      [
        "期間",
        "きかん",
        "Zeitraum",
        "この期間"
      ],
      [
        "通常どおり",
        "つうじょうどおり",
        "regulär",
        "通常どおり走ります"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Zugfahrt entfällt an Werktagen in diesem Zeitraum?",
        "八時十分の電車です。",
        "八時十分発が運休です。",
        "八時四十分です。",
        "8:40 fährt regulär.",
        "八時十分の電車は運休"
      ],
      [
        "condition",
        "Wo fährt der Ersatzbus ab?",
        "南口です。",
        "平日の八時十五分に南口からです。",
        "北口です。",
        "Nur Süd wird als Abfahrt angegeben.",
        "平日の八時十五分に南口から"
      ],
      [
        "inference",
        "Ist die 8:10-Abfahrt auch am Samstag wegen dieser Arbeiten gestrichen?",
        "いいえ、土日は工事がありません。",
        "土曜日はこの工事による運休ではありません。",
        "はい、毎日運休です。",
        "Der Zeitraum hat die Einschränkung auf Werktage.",
        "土曜日と日曜日は工事をしません"
      ]
    ],
    "contextNote": "Der zeitliche Geltungsbereich umfasst Werktage im genannten Zeitraum; über andere Ausfälle sagt der Text nichts.",
    "writing": [
      "Informiere jemanden über die Ersatzmöglichkeit montags.",
      "月曜日は八時十五分に南口から特別バスが出ます。",
      "月曜日の八時十分の電車は運休です。",
      "月曜日の八時十分の電車に乗ります。",
      "Die Zugfahrt fällt in der Baustellenwoche aus."
    ],
    "returnCue": [
      "Neue Baustelle: nur Dienstag 7:30-Zug entfällt, Bus 7:40 Ostausgang. Beschreibe Ersatz.",
      "火曜日の七時四十分に東口からバスに乗ります。",
      "七時半の電車は運休なので、東口のバスを使います。",
      "南口の八時十五分のバスに乗ります。",
      "Andere Zeiten und Ausgang."
    ]
  },
  {
    "id": "bus-transfer-card",
    "genre": "ticket",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "バスの乗り継ぎ券",
    "purpose": "Umstiegsgültigkeit und Ausschluss einer Route lesen",
    "audience": "Fahrgäste",
    "issuer": "町のバス会社",
    "blocks": [
      "乗り継ぎ券　利用日：六月二十日　料金：四百円",
      "中央駅から市役所までは一番のバス、市役所から大学までは三番のバスに乗れます。",
      "この券は同じ日に二回まで使えます。二番の空港バスには使えません。乗り換えるときも券を見せてください。"
    ],
    "terms": [
      [
        "乗り継ぎ",
        "のりつぎ",
        "Umstieg/Anschluss",
        "乗り継ぎ券"
      ],
      [
        "空港",
        "くうこう",
        "Flughafen",
        "空港バス"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche zweite Buslinie erreicht die Universität?",
        "三番のバスです。",
        "市役所から三番に乗ります。",
        "二番のバスです。",
        "Linie zwei ist Flughafenbus und ausgeschlossen.",
        "市役所から大学までは三番"
      ],
      [
        "condition",
        "Darf man die Fahrkarte auf dem Flughafenbus nutzen?",
        "いいえ、使えません。",
        "二番には使えません。",
        "はい、全部のバスに使えます。",
        "Das Ticket enthält einen spezifischen Ausschluss.",
        "二番の空港バスには使えません"
      ],
      [
        "inference",
        "Was muss man beim Umsteigen am Rathaus tun?",
        "券を見せます。",
        "乗り換えるときも券を見せます。",
        "新しい券を買います。",
        "Der Text verlangt Vorzeigen, nicht Neukauf.",
        "乗り換えるときも券を見せてください"
      ]
    ],
    "contextNote": "Der 2-Fahrten-Wert ist für einen einzigen Tag und die benannten Linien gedacht.",
    "writing": [
      "Erkläre den Umstieg zur Universität.",
      "市役所で一番から三番のバスに乗り換えます。",
      "市役所から三番のバスで大学に行きます。",
      "二番の空港バスで行きます。",
      "Die Flughafenlinie ist nicht gültig."
    ],
    "returnCue": [
      "Neues Ticket: Linie vier Bahnhof–Park, Linie sieben Park–Schule, Linie sechs ausgeschlossen. Beschreibe.",
      "公園で四番から七番に乗り換えます。",
      "公園で七番のバスに乗って学校へ行きます。",
      "六番のバスを使います。",
      "Linie sechs ist ausgeschlossen."
    ]
  },
  {
    "id": "library-study-room-booking",
    "genre": "form",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "図書館グループ室利用申請",
    "purpose": "Pflichtangaben, Raumkapazität und Vorlauf erkennen",
    "audience": "Studentische Lerngruppe",
    "issuer": "図書館受付",
    "blocks": [
      "グループ室利用申請　＊は必須項目です。",
      "＊代表者氏名：＿＿　＊利用日：＿＿　＊人数：＿＿（二〜四人）　連絡先メール：＿＿",
      "希望する時間：□十時〜十二時　□二時〜四時（どちらか一つ）",
      "前日午後五時までに申し込んでください。五人以上のグループは受付へ相談してください。"
    ],
    "terms": [
      [
        "代表者",
        "だいひょうしゃ",
        "Vertretung/Leitung",
        "代表者氏名"
      ],
      [
        "申請",
        "しんせい",
        "Antrag",
        "利用申請"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Gruppengröße steht im regulären Formular?",
        "二人から四人です。",
        "二〜四人です。",
        "一人から十人です。",
        "Das Formular nennt 2–4.",
        "人数：＿＿（二〜四人）"
      ],
      [
        "condition",
        "Bis wann muss ein Termin beantragt sein?",
        "前日の午後五時までです。",
        "利用日の前日五時までです。",
        "当日午後五時です。",
        "Frist ist am Vortag.",
        "前日午後五時までに申し込んでください"
      ],
      [
        "inference",
        "Was tut eine Gruppe mit sechs Personen?",
        "受付に相談します。",
        "窓口で相談します。",
        "二〜四人の欄に六人と書いて終わります。",
        "Für Gruppen ab fünf gilt ein anderer Prozess.",
        "五人以上のグループは受付へ相談"
      ]
    ],
    "contextNote": "Nicht alle Formularfelder tragen ein Sternchen; das Zeitfenster lässt exakt eine Auswahl zu.",
    "writing": [
      "Bitte höflich um ein Zeitfenster für drei Personen ab 14 Uhr.",
      "三人で午後二時から四時まで利用したいです。",
      "三人で二時からの部屋を申し込みます。",
      "六人でそのまま申し込みます。",
      "Ab fünf Personen andere Regel."
    ],
    "returnCue": [
      "Neues Raumformular: maximal fünf, sechs Personen müssen nachfragen; vier Personen wollen 10–12 Uhr. Bitte darum.",
      "四人で十時から十二時まで申し込みたいです。",
      "十時から二時間、四人で利用できますか。",
      "六人で普通の申込書を出します。",
      "Es sind vier Teilnehmende."
    ]
  },
  {
    "id": "city-festival-program",
    "genre": "timetable",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "文化センターの一日プログラム",
    "purpose": "Überschneidungen, Anmeldungen und Zeitpuffer verstehen",
    "audience": "Teilnehmende eines Kulturzentrums",
    "issuer": "文化センター",
    "blocks": [
      "日曜日の体験プログラム",
      "書道　十時〜十一時　予約不要　参加費五百円",
      "お菓子作り　十一時半〜十二時半　前日まで予約　参加費八百円（先着十二人）",
      "昔話を聞く会　午後二時〜三時　予約不要　参加費無料",
      "お菓子作りは材料の用意が必要です。時間に遅れないようにしてください。"
    ],
    "terms": [
      [
        "先着",
        "せんちゃく",
        "in Reihenfolge des Eingangs",
        "先着十二人"
      ],
      [
        "参加費",
        "さんかひ",
        "Teilnahmegebühr",
        "参加費無料"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Veranstaltung ist kostenlos?",
        "昔話を聞く会です。",
        "午後二時の昔話です。",
        "書道です。",
        "Kalligrafie kostet 500 Yen.",
        "昔話を聞く会…参加費無料"
      ],
      [
        "condition",
        "Welche Anmeldung muss bis zum Vortag erfolgen?",
        "お菓子作りです。",
        "お菓子作りの予約です。",
        "書道です。",
        "Wegen Zutaten ist Anmeldung nötig.",
        "前日まで予約"
      ],
      [
        "inference",
        "Ist die Teilnahme am Süßigkeitenkurs sicher, nur weil es zwölf Plätze gibt?",
        "いいえ、先着順です。",
        "予約が必要で、十二人までです。",
        "はい、だれでも入れます。",
        "Plätze sind beschränkt und nach Reihenfolge.",
        "先着十二人"
      ]
    ],
    "contextNote": "Anmeldung und Gebühr sind unabhängig; kostenlos heißt nicht notwendig ohne Anmeldung in jedem anderen Programm.",
    "writing": [
      "Bitte höflich um Anmeldung für den Süßigkeitenkurs.",
      "お菓子作りの教室に申し込みたいです。",
      "十一時半の教室を予約したいです。",
      "当日予約しなくても大丈夫ですね。",
      "Die Anmeldung muss vorher erfolgen."
    ],
    "returnCue": [
      "Neues Programm: Papierkunst 13 Uhr für 10 Personen, Anmeldung bis Freitag. Bitte um Reservierung.",
      "金曜日までに午後一時の紙工作に申し込みたいです。",
      "紙工作の教室を予約したいです。",
      "予約なしで必ず参加できます。",
      "Es gibt eine Anmeldefrist."
    ]
  },
  {
    "id": "parcel-tracking-notice",
    "genre": "notice",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "配達のお知らせと受け取り方法",
    "purpose": "Hauszustellung und alternative Paketabholung unterscheiden",
    "audience": "Paketkunde",
    "issuer": "青い宅配",
    "blocks": [
      "お荷物のお届け予定を変更しました。道路工事のため、木曜日午前の配達は金曜日の午後二時〜五時になります。",
      "その時間に家にいない場合は、木曜日の午後八時までに変更を申し込んでください。",
      "店での受け取りは金曜日の朝十一時から可能です。店へ行く際は身分証を持って来てください。"
    ],
    "terms": [
      [
        "配達",
        "はいたつ",
        "Zustellung",
        "配達は金曜日"
      ],
      [
        "身分証",
        "みぶんしょう",
        "Ausweis",
        "身分証を持って"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann erfolgt die neue Hauszustellung?",
        "金曜日の午後二時から五時です。",
        "金曜日の午後です。",
        "木曜日の午前です。",
        "Die ursprüngliche Zustellung wurde verschoben.",
        "金曜日の午後二時〜五時"
      ],
      [
        "condition",
        "Bis wann kann man das Zustellfenster ändern?",
        "木曜日の午後八時までです。",
        "木曜日の夜八時までに申し込みます。",
        "金曜日の午後八時までです。",
        "Die Änderungsfrist ist Donnerstag.",
        "木曜日の午後八時までに変更"
      ],
      [
        "inference",
        "Kann man die Sendung Freitag um 12 Uhr im Laden abholen, vor der Hauszustellung?",
        "はい、受け取れます。",
        "店なら十一時から可能です。",
        "いいえ、午後二時までだめです。",
        "Die Ladenoption beginnt früher als Hauszustellung.",
        "店での受け取りは金曜日の朝十一時から"
      ]
    ],
    "contextNote": "Die Änderungsfrist, Hauslieferung und Ladenabholung sind drei getrennte Zeitangaben.",
    "writing": [
      "Bitte um Ladenabholung Freitag um zwölf mit Ausweis.",
      "金曜日の十二時に身分証を持って店で受け取ります。",
      "金曜日の昼に店へ取りに行きます。",
      "木曜日の午前に家で受け取ります。",
      "Das war die alte Planung."
    ],
    "returnCue": [
      "Neue Lieferung: Samstag 16–18 Uhr nach Hause, Laden ab Samstag 10 Uhr; bitte um Abholung um elf.",
      "土曜日の十一時に店で受け取りたいです。",
      "土曜日の午前十一時に取りに行きます。",
      "土曜日の九時に受け取ります。",
      "Die Abholung beginnt zehn Uhr."
    ]
  },
  {
    "id": "housing-ad-terms",
    "genre": "advertisement",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "学生向けワンルーム",
    "purpose": "Mietkosten, Haustiere und Besichtigungspflicht lesen",
    "audience": "Zimmerinteressenten",
    "issuer": "空室案内センター",
    "blocks": [
      "学生向けのお部屋：駅から徒歩十二分、大学まで自転車で八分。家賃は月五万円。",
      "水道代は家賃に入っています。電気代とインターネット代は別です。",
      "動物は飼えません。見学は火曜日と木曜日の午後三時〜六時、前日までにメールで予約してください。"
    ],
    "terms": [
      [
        "家賃",
        "やちん",
        "Miete",
        "家賃は月五万円"
      ],
      [
        "別",
        "べつ",
        "separat",
        "代は別です"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Kosten sind im Mietbetrag enthalten?",
        "水道代です。",
        "水道代は家賃に含まれています。",
        "インターネット代です。",
        "Internetkosten sind ausdrücklich separat.",
        "水道代は家賃に入っています"
      ],
      [
        "condition",
        "Kann jemand mit Haustier dieses Zimmer mieten?",
        "いいえ、飼えません。",
        "動物を飼うことはできません。",
        "はい、大丈夫です。",
        "Der Text untersagt Tierhaltung.",
        "動物は飼えません"
      ],
      [
        "inference",
        "Darf man ohne Voranmeldung Donnerstag um vier kommen?",
        "いいえ、予約が必要です。",
        "前日までにメールしなければなりません。",
        "はい、四時ならいつでもいいです。",
        "Besichtigungen benötigen vorherige Anmeldung.",
        "前日までにメールで予約してください"
      ]
    ],
    "contextNote": "Alle Preise und Regeln sind fiktive Unterrichtsdaten und keine echte Wohnungsanzeige.",
    "writing": [
      "Bitte höflich um Besichtigung am Dienstag um 16 Uhr.",
      "火曜日の午後四時に見学したいです。",
      "火曜日の四時に見学できますか。",
      "日曜日に見学します。",
      "Sonntag ist nicht angeboten."
    ],
    "returnCue": [
      "Neue Anzeige: Mittwoch 14–17 Uhr, Reservierung per Telefon bis Vortag. Bitte um 15 Uhr.",
      "水曜日の午後三時に見学したいです。電話で予約します。",
      "水曜日の三時に見学できますか。",
      "木曜日の午後六時に見学します。",
      "Andere Besichtigungszeiten."
    ]
  },
  {
    "id": "restaurant-allergy-menu",
    "genre": "menu",
    "level": "A2",
    "title": "料理の材料について",
    "purpose": "Zutatenliste und Austauschmöglichkeit interpretieren",
    "audience": "Restaurantgast",
    "issuer": "ごはんの家",
    "blocks": [
      "本日の定食　魚とご飯　九百円（小麦を使ったたれが付いています）",
      "野菜スープ定食　八百円（牛乳を使っています）",
      "たれを別にすることはできますが、料理に使う材料を変えることはできません。材料について質問がある方は注文前に係員に聞いてください。"
    ],
    "terms": [
      [
        "材料",
        "ざいりょう",
        "Zutat",
        "料理に使う材料"
      ],
      [
        "小麦",
        "こむぎ",
        "Weizen",
        "小麦を使った"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welches Gericht enthält Milch?",
        "野菜スープ定食です。",
        "野菜スープに牛乳が使われています。",
        "魚の定食です。",
        "Milch wird ausdrücklich der Suppe zugeordnet.",
        "野菜スープ定食…牛乳"
      ],
      [
        "condition",
        "Kann man die Soße separat bekommen?",
        "はい、別にできます。",
        "たれを別にできます。",
        "いいえ、絶対にできません。",
        "Separate Soße wird angeboten.",
        "たれを別にすることはできます"
      ],
      [
        "inference",
        "Garantiert getrennte Soße, dass das Fischgericht weizenfrei ist?",
        "いいえ、保証できません。",
        "材料を確認する必要があります。",
        "はい、絶対に小麦がありません。",
        "Getrennt serviert schließt Weizenexposition nicht sicher aus; die Küche darf Zutaten nicht ändern.",
        "料理に使う材料を変えることはできません"
      ]
    ],
    "contextNote": "Diese fiktive Speisekarte ist keine verbindliche Allergenberatung; bei tatsächlicher Allergie beim Personal nachfragen.",
    "writing": [
      "Frage höflich, welche Zutaten im Gericht enthalten sind.",
      "この料理には何が入っていますか。",
      "材料について教えていただけますか。",
      "たれを別にすれば絶対に安全ですね。",
      "Das ist ohne genaue Bestätigung nicht gesichert."
    ],
    "returnCue": [
      "Anderes Lokal: Nuss im Salat, Dressing separat, Zutaten unveränderbar. Bitte vor Bestellung um Klärung.",
      "サラダにナッツが入っていますか。材料を確認したいです。",
      "この料理の材料を教えてください。",
      "ドレッシングを別にすれば絶対に大丈夫です。",
      "Zutaten und Kreuzkontakt bedürfen genauer Prüfung."
    ]
  },
  {
    "id": "workshop-rule-sheet",
    "genre": "instructions",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "ものづくり教室の参加案内",
    "purpose": "Registrierung, Ausrüstung und Minderjährigenbedingung erkennen",
    "audience": "Workshopteilnehmende",
    "issuer": "町の工作教室",
    "blocks": [
      "土曜日の木工作教室　午前十時〜正午。参加費千円（材料費を含みます）。",
      "申し込みは水曜日まで。道具はこちらで用意しますが、汚れてもいい服で来てください。",
      "中学生以下の方は保護者と一緒に参加してください。開始十分前に受付へ来てください。"
    ],
    "terms": [
      [
        "保護者",
        "ほごしゃ",
        "Erziehungsberechtigter",
        "保護者と一緒"
      ],
      [
        "道具",
        "どうぐ",
        "Werkzeuge",
        "道具はこちらで"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was ist im Teilnahmebeitrag enthalten?",
        "材料費です。",
        "材料費が含まれます。",
        "昼ご飯です。",
        "Genannt sind Materialkosten.",
        "材料費を含みます"
      ],
      [
        "condition",
        "Was gilt für Mittelschüler und Jüngere?",
        "保護者と一緒に参加します。",
        "保護者が必要です。",
        "一人で参加できます。",
        "Die Teilnahme verlangt Begleitung.",
        "中学生以下の方は保護者と一緒に参加"
      ],
      [
        "inference",
        "Wann sollten Teilnehmer spätestens zur Anmeldung erscheinen?",
        "九時五十分です。",
        "十時の十分前です。",
        "十時十分です。",
        "Zehn Minuten vor Beginn um zehn.",
        "開始十分前に受付へ"
      ]
    ],
    "contextNote": "Anmeldeschluss am Mittwoch und Erscheinen am Samstag sind unterschiedliche Verpflichtungen.",
    "writing": [
      "Bestätige, dass du am Samstag um 9:50 kommst.",
      "土曜日の九時五十分に受付へ行きます。",
      "開始の十分前に行きます。",
      "土曜日の十時十分に行きます。",
      "Zehn Minuten vorher, nicht nach Beginn."
    ],
    "returnCue": [
      "Neuer Kurs: Beginn Sonntag 13 Uhr, Ankunft 15 Minuten vorher, Kleidung selbst mitbringen. Bestätige.",
      "日曜日の十二時四十五分に行きます。服も持って行きます。",
      "開始の十五分前に受付へ行きます。",
      "日曜日の一時十五分に行きます。",
      "Ankunft muss vor 13 Uhr erfolgen."
    ]
  }
] satisfies P49RawDocument[];
export const p49DocumentsC=p49CorpusC.map(authoredP49Document);
