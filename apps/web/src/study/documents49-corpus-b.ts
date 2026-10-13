import {authoredP49Document,type P49RawDocument} from "./documents49-types";
/** Original travel tickets, service advertisements, instructions and public notices. */
export const p49CorpusB=[
  {
    "id": "museum-entry-ticket",
    "genre": "ticket",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "美術館の入場券",
    "purpose": "Ticketdatum, Uhrzeit und Wiedereintrittsregel verstehen",
    "audience": "Museumsbesucher",
    "issuer": "町立美術館",
    "blocks": [
      "入場券　大人　一枚　八百円",
      "有効日：七月十四日（火）　入場：午前十時〜午後四時半",
      "この券で一回だけ入れます。一度外に出ると、もう一度入ることはできません。"
    ],
    "terms": [
      [
        "有効日",
        "ゆうこうび",
        "Gültigkeitstag",
        "有効日"
      ],
      [
        "一度",
        "いちど",
        "einmal",
        "一度外に出ると"
      ]
    ],
    "questions": [
      [
        "locate",
        "Für welches Datum gilt die Eintrittskarte?",
        "七月十四日です。",
        "七月十四日だけです。",
        "七月十五日です。",
        "Die Gültigkeit ist datiert.",
        "有効日：七月十四日"
      ],
      [
        "condition",
        "Kann man mit diesem Ticket nach Verlassen erneut hinein?",
        "いいえ、できません。",
        "一回だけ入れます。",
        "はい、何回でも入れます。",
        "Die Karte gilt nur für einen Eintritt.",
        "この券で一回だけ入れます"
      ],
      [
        "inference",
        "Kann man um 17 Uhr zum ersten Mal eintreten?",
        "いいえ、四時半までです。",
        "午後五時には入れません。",
        "はい、五時までです。",
        "Einlass endet 16:30.",
        "入場：午前十時〜午後四時半"
      ]
    ],
    "contextNote": "Ein Ticket ist an genau bezeichnete Nutzung und Datum gebunden; es sagt nicht alle Museumsöffnungszeiten.",
    "writing": [
      "Erkläre, dass du am 14. Juli um elf hineinmöchtest.",
      "七月十四日の十一時に入ります。",
      "十四日の午前十一時に美術館に行きます。",
      "七月十五日に入ります。",
      "Dann wäre das Ticket nicht gültig."
    ],
    "returnCue": [
      "Neues Ticket: gültig am 8. August, 9–15 Uhr, einmaliger Eintritt. Plane um zehn.",
      "八月八日の十時に一回入ります。",
      "八月八日の午前十時に入場します。",
      "八月九日に入ります。",
      "Ticket ist nur am 8. gültig."
    ]
  },
  {
    "id": "local-train-pass",
    "genre": "ticket",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "電車の一日乗車券",
    "purpose": "Geltungsdauer und ausgeschlossene Verkehrsmittel lesen",
    "audience": "Nahverkehrsnutzer",
    "issuer": "青空鉄道",
    "blocks": [
      "一日乗車券　七百円　利用日：八月五日",
      "この券で青空線の電車には何回でも乗れます。",
      "路線バスには使えません。夜十二時を過ぎると無効です。"
    ],
    "terms": [
      [
        "乗車券",
        "じょうしゃけん",
        "Fahrschein",
        "一日乗車券"
      ],
      [
        "無効",
        "むこう",
        "ungültig",
        "無効です"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was kostet der Tagespass?",
        "七百円です。",
        "一日券は七百円です。",
        "五百円です。",
        "Der Preis ist 700 Yen.",
        "一日乗車券　七百円"
      ],
      [
        "condition",
        "Ist der Pass auch für Busse gültig?",
        "いいえ、バスには使えません。",
        "電車だけです。",
        "はい、バスにも使えます。",
        "Die Verkehrsmittel sind eingeschränkt.",
        "路線バスには使えません"
      ],
      [
        "inference",
        "Kann man damit am Folgetag morgens fahren?",
        "いいえ、できません。",
        "次の日は無効です。",
        "はい、一日券だからいつでもです。",
        "Ab Mitternacht ungültig.",
        "夜十二時を過ぎると無効です"
      ]
    ],
    "contextNote": "一日 ist hier ein bestimmter Nutzungstag, nicht 24 Stunden ab beliebiger erster Nutzung.",
    "writing": [
      "Erkläre, dass du am 5. August mehrmals Zug fährst.",
      "八月五日にこの券で電車に何回も乗ります。",
      "五日に電車を何度も使います。",
      "バスに何回でも乗ります。",
      "Bus ist ausgeschlossen."
    ],
    "returnCue": [
      "Neue Karte: Nur Straßenbahnen am 10. September, nicht Züge. Beschreibe.",
      "九月十日は路面電車に乗れますが、電車には使えません。",
      "九月十日の路面電車だけです。",
      "電車にも使えます。",
      "Der neue Pass schließt reguläre Züge aus."
    ]
  },
  {
    "id": "bookshop-weekend-ad",
    "genre": "advertisement",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "本屋の週末セール",
    "purpose": "Rabatt und Produktgruppen aus einer Anzeige lesen",
    "audience": "Käufer",
    "issuer": "星の本屋",
    "blocks": [
      "週末セール　土曜日・日曜日　午前十時〜午後六時",
      "日本語の小説は二十パーセント引きです。",
      "辞書と教科書は割引になりません。会員カードがなくても買えます。"
    ],
    "terms": [
      [
        "小説",
        "しょうせつ",
        "Roman",
        "日本語の小説"
      ],
      [
        "辞書",
        "じしょ",
        "Wörterbuch",
        "辞書と教科書"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Buchgruppe ist reduziert?",
        "小説です。",
        "日本語の小説です。",
        "教科書です。",
        "Lehrbücher sind ausgenommen.",
        "小説は二十パーセント引き"
      ],
      [
        "condition",
        "Gilt der Rabatt für Wörterbücher?",
        "いいえ、なりません。",
        "辞書は割引がありません。",
        "はい、二十パーセント引きです。",
        "辞書 explizit ausgeschlossen.",
        "辞書と教科書は割引になりません"
      ],
      [
        "inference",
        "Braucht man eine Mitgliedskarte, um zu kaufen?",
        "いいえ、要りません。",
        "会員カードなしでも買えます。",
        "はい、必ず必要です。",
        "Die Anzeige erlaubt Einkauf ohne Karte.",
        "会員カードがなくても買えます"
      ]
    ],
    "contextNote": "Eine Werbeaussage für Romane erlaubt keine Übertragung des Rabatts auf alle Bücher.",
    "writing": [
      "Frage nach dem reduzierten japanischen Roman.",
      "割引の日本語の小説はどこですか。",
      "日本語の小説を見たいです。",
      "辞書も二十パーセント引きですね。",
      "Das Wörterbuch ist ausgenommen."
    ],
    "returnCue": [
      "Anderer Laden: Nur Comics 10 % günstiger, Hefte nicht. Frage danach.",
      "漫画は十パーセント引きですか。",
      "ノートにも割引がありますか。",
      "ノートは必ず十パーセント引きです。",
      "Der Rabatt gilt nur für Comics."
    ]
  },
  {
    "id": "part-time-job-ad",
    "genre": "advertisement",
    "level": "A1",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "短時間アルバイト募集",
    "purpose": "Arbeitszeiten, Voraussetzung und Kontaktweg lesen",
    "audience": "Bewerber",
    "issuer": "花屋みどり",
    "blocks": [
      "花屋でアルバイトを募集しています。週に二日、火曜日と木曜日の午後三時〜六時です。",
      "花が好きな方を歓迎します。経験がなくても大丈夫です。",
      "応募したい方は日曜日までにメールで名前と電話番号を送ってください。"
    ],
    "terms": [
      [
        "応募",
        "おうぼ",
        "Bewerbung",
        "応募したい方"
      ],
      [
        "経験",
        "けいけん",
        "Erfahrung",
        "経験がなくても"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Tage sind Arbeitstage?",
        "火曜日と木曜日です。",
        "火曜日と木曜日の午後です。",
        "月曜日と金曜日です。",
        "Die Anzeige benennt Dienstag und Donnerstag.",
        "火曜日と木曜日"
      ],
      [
        "condition",
        "Ist vorherige Erfahrung verpflichtend?",
        "いいえ、必要ありません。",
        "経験がなくても大丈夫です。",
        "はい、経験が必要です。",
        "Auch Unerfahrene können sich bewerben.",
        "経験がなくても大丈夫です"
      ],
      [
        "inference",
        "Welche Angaben werden mit der Bewerbung erwartet?",
        "名前と電話番号です。",
        "メールで名前と電話番号を送ります。",
        "住所と生年月日です。",
        "Die Anzeige nennt nur Name und Telefonnummer.",
        "名前と電話番号を送ってください"
      ]
    ],
    "contextNote": "Fiktive Anzeige, keine reale Stelle; 募集 signalisiert einen Aufruf und noch keine Zusage.",
    "writing": [
      "Schreibe eine kurze höfliche Bewerbung für die angegebenen Tage.",
      "火曜日と木曜日のアルバイトに応募したいです。",
      "お花屋さんで働きたいです。よろしくお願いします。",
      "月曜日だけ働きたいです。",
      "Montag ist kein genannter Arbeitstag."
    ],
    "returnCue": [
      "Neuer Job: samstags 9–12 Uhr, Erfahrung nicht nötig. Bitte höflich um Bewerbung.",
      "土曜日の午前のアルバイトに応募したいです。",
      "土曜日の九時から働きたいです。",
      "木曜日の午後に働きます。",
      "Die neue Anzeige betrifft Samstag."
    ]
  },
  {
    "id": "rice-cooker-guide",
    "genre": "instructions",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "炊飯器の使い方",
    "purpose": "Reihenfolge, Mengenverhältnis und Sicherheit verstehen",
    "audience": "Küchennutzer",
    "issuer": "料理教室",
    "blocks": [
      "ご飯を炊く前に、米をよく洗ってください。",
      "米一合に対して水を目盛りの一の線まで入れます。ふたを閉めて「炊飯」を押します。",
      "炊いている間はふたを開けないでください。終わったら十分待ってから食べましょう。"
    ],
    "terms": [
      [
        "炊飯",
        "すいはん",
        "Reis kochen",
        "「炊飯」を押します"
      ],
      [
        "目盛り",
        "めもり",
        "Markierung",
        "目盛りの一"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was macht man vor dem Wasser-Einfüllen?",
        "米を洗います。",
        "よく米を洗います。",
        "ふたを開けて食べます。",
        "Waschen ist der erste Schritt.",
        "米をよく洗ってください"
      ],
      [
        "condition",
        "Was darf man während des Kochens nicht tun?",
        "ふたを開けません。",
        "炊いている間は開けないでください。",
        "炊飯ボタンを押しません。",
        "Die Anleitung verbietet Öffnen während des Kochens.",
        "炊いている間はふたを開けないでください"
      ],
      [
        "inference",
        "Darf man unmittelbar nach Ende ohne Warten essen?",
        "いいえ、十分待ちます。",
        "十分待ってから食べます。",
        "はい、すぐに食べます。",
        "Nach dem Kochende folgt eine zehnminütige Wartezeit.",
        "終わったら十分待ってから"
      ]
    ],
    "contextNote": "Die Linie '一' gilt für einen Becher Reis im fiktiven Gerätebeispiel; reale Geräte unterscheiden sich.",
    "writing": [
      "Beschreibe die ersten beiden Schritte.",
      "まず米を洗って、それから水を入れます。",
      "米を洗ってから水を入れます。",
      "まずふたを開けて食べます。",
      "Die Reihenfolge beginnt mit Waschen."
    ],
    "returnCue": [
      "Neue Anleitung: Erst Gemüse waschen, dann schneiden, danach kochen. Gib die Reihenfolge an.",
      "まず野菜を洗い、次に切って、それから煮ます。",
      "野菜を洗ってから切ります。",
      "最初に煮ます。",
      "Die neue Reihenfolge beginnt mit Waschen."
    ]
  },
  {
    "id": "parcel-locker-guide",
    "genre": "instructions",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "宅配ロッカーの受け取り方",
    "purpose": "Abholcode, Frist und Fehlerversuch aus einer Anleitung lesen",
    "audience": "Paketempfänger",
    "issuer": "荷物サービス",
    "blocks": [
      "荷物を受け取る方へ：画面で「受け取り」を選び、六けたの番号を入力してください。",
      "ロッカーが開いたら荷物を取り、扉を閉めてください。",
      "受け取りは金曜日の午後八時までです。番号がわからない場合は、受付に聞いてください。"
    ],
    "terms": [
      [
        "六けた",
        "ろっけた",
        "sechsstellig",
        "六けたの番号"
      ],
      [
        "扉",
        "とびら",
        "Tür",
        "扉を閉めて"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wie viele Ziffern hat der Code?",
        "六けたです。",
        "六つの数字です。",
        "四けたです。",
        "六けた bedeutet sechs Stellen.",
        "六けたの番号"
      ],
      [
        "condition",
        "Bis wann ist Abholung möglich?",
        "金曜日の午後八時までです。",
        "金曜日の八時までです。",
        "土曜日の八時までです。",
        "Die Abholfrist ist Freitag.",
        "金曜日の午後八時まで"
      ],
      [
        "inference",
        "Was sollte man bei unbekanntem Code tun?",
        "受付に聞きます。",
        "係の人に聞きます。",
        "番号を何度も適当に押します。",
        "Die Anleitung nennt das Personal als Hilfe.",
        "番号がわからない場合は、受付に聞いてください"
      ]
    ],
    "contextNote": "Die sechsstellige Zahl ist nur ein Übungsformat; in realen Services sind andere Verfahren möglich.",
    "writing": [
      "Bitte höflich um Hilfe mit dem unbekannten Abholcode.",
      "番号がわからないので、教えてください。",
      "受け取りの番号を教えていただけますか。",
      "番号がわからなくても大丈夫です。",
      "Die Anleitung nennt Rückfrage."
    ],
    "returnCue": [
      "Neuer Automat: achtstelliger Code erforderlich, bis Donnerstag 18 Uhr. Frage nach Hilfe.",
      "八けたの番号がわかりません。教えてください。",
      "受け取りの番号を確認したいです。",
      "六けたの番号で金曜日に受け取ります。",
      "Code und Frist haben sich geändert."
    ]
  },
  {
    "id": "recycling-category",
    "genre": "public-info",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "ごみの分け方",
    "purpose": "Unterschiedliche Sammelkategorien und Ausnahme-Feiertag lesen",
    "audience": "Neue Stadtbewohner",
    "issuer": "町役場",
    "blocks": [
      "紙は月曜日、プラスチックは水曜日、びんと缶は金曜日の朝八時までに出してください。",
      "来週の月曜日は祝日のため、紙の回収は火曜日になります。ほかの曜日は変わりません。",
      "大きい家具は普通の場所に出せません。先に町役場に連絡してください。"
    ],
    "terms": [
      [
        "回収",
        "かいしゅう",
        "Abholung",
        "紙の回収"
      ],
      [
        "祝日",
        "しゅくじつ",
        "Feiertag",
        "祝日のため"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann wird Glas normal abgeholt?",
        "金曜日です。",
        "金曜日の朝八時までです。",
        "水曜日です。",
        "Mittwoch gilt für Plastik.",
        "びんと缶は金曜日"
      ],
      [
        "condition",
        "Wann erfolgt Papierabholung in der Feiertagswoche?",
        "火曜日です。",
        "来週は火曜日になります。",
        "月曜日です。",
        "Einmalige Verschiebung wegen Feiertag.",
        "紙の回収は火曜日になります"
      ],
      [
        "inference",
        "Kann ein großes Möbelstück in die normale Müllsammlung?",
        "いいえ、町役場に連絡します。",
        "先に町役場へ連絡します。",
        "はい、金曜日に出します。",
        "Für Möbel ist eine Sonderabsprache nötig.",
        "大きい家具は普通の場所に出せません"
      ]
    ],
    "contextNote": "Alle Müllregeln sind fiktive Lerntexte und dürfen nicht als reale lokale Vorschriften genutzt werden.",
    "writing": [
      "Teile einem Mitbewohner die verschobene Papierabholung mit.",
      "来週の紙の回収は火曜日です。",
      "祝日なので、来週は火曜日に紙を出します。",
      "来週も月曜日です。",
      "Feiertag verschiebt diesen Termin."
    ],
    "returnCue": [
      "Neue Gemeinde: Kartons normalerweise Donnerstag, wegen Feiertag Freitag; Glas bleibt Montag. Sage dies.",
      "段ボールは今週金曜日に出します。びんは月曜日のままです。",
      "段ボールだけ金曜日に変わります。",
      "びんも金曜日になります。",
      "Glas bleibt Montag."
    ]
  },
  {
    "id": "town-clinic-notice",
    "genre": "public-info",
    "level": "A2",
    "title": "クリニックの受付時間",
    "purpose": "Unterschied zwischen Gebäudeöffnung, Anmeldung und Ausnahme lesen",
    "audience": "Patienten mit organisatorischen Fragen",
    "issuer": "山川クリニック",
    "blocks": [
      "受付時間：月・火・水・金　午前九時〜午後四時",
      "木曜日　午前九時〜正午。土日祝日は受付しません。",
      "予約を変える場合は電話をしてください。診察の終了時間は受付時間と同じではありません。"
    ],
    "terms": [
      [
        "正午",
        "しょうご",
        "Mittag",
        "正午"
      ],
      [
        "受付",
        "うけつけ",
        "Anmeldung",
        "受付時間"
      ]
    ],
    "questions": [
      [
        "locate",
        "Bis wann ist die Anmeldung donnerstags offen?",
        "正午までです。",
        "木曜日は十二時までです。",
        "午後四時までです。",
        "16 Uhr gilt an anderen Wochentagen.",
        "木曜日　午前九時〜正午"
      ],
      [
        "condition",
        "Kann man sonntags an der Anmeldung erscheinen?",
        "いいえ、受付しません。",
        "日曜日は休みです。",
        "はい、午前九時からです。",
        "Wochenenden ausgeschlossen.",
        "土日祝日は受付しません"
      ],
      [
        "inference",
        "Ist das Ende der Patientenanmeldung identisch mit dem Ende aller Untersuchungen?",
        "いいえ、同じではありません。",
        "受付と診察の終了時間は違います。",
        "はい、必ず同じです。",
        "Die Notiz unterscheidet ausdrücklich beide Grenzen.",
        "診察の終了時間は受付時間と同じではありません"
      ]
    ],
    "contextNote": "Organisationsbeispiel, keine medizinische Auskunft oder realer Kliniköffnungsplan.",
    "writing": [
      "Bitte höflich um telefonische Terminänderung.",
      "予約の時間を変更したいです。",
      "予約を変えたいのですが。",
      "日曜日に受付に行きます。",
      "Sonntag ist geschlossen."
    ],
    "returnCue": [
      "Neue Praxis: Anmeldung Dienstag bis 13 Uhr, Freitag bis 16 Uhr; bitte um Terminänderung Dienstag 11 Uhr.",
      "火曜日の十一時に予約を変えたいです。",
      "火曜日の午前十一時は空いていますか。",
      "火曜日の午後三時に伺います。",
      "Die Anmeldung endet um 13 Uhr."
    ]
  }
] satisfies P49RawDocument[];
export const p49DocumentsB=p49CorpusB.map(authoredP49Document);
