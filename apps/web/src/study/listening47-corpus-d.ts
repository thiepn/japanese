import {authoredP47Scene,type P47RawScene} from "./listening47-types";
export const p47CorpusD=[
  {
    "id": "a2-typhoon-event",
    "title": "Festival mit wetterbedingtem Teilersatz",
    "genre": "announcement",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Ein Stadtteilverein erklärt, welche Festivalaktivitäten stattfinden und welche ausfallen.",
    "listeningGoal": "Absagen, Verlegungen und unveränderten Beginn verbinden",
    "prediction": "Achte auf 中止 und 予定どおり.",
    "lines": [
      [
        "司会",
        "本日の町の秋祭りについてお知らせします。強い雨のため、外の音楽会は中止です。",
        "Wegen starkem Regen fällt das Konzert im Freien aus."
      ],
      [
        "司会",
        "しかし、子どもの工作教室は学校の体育館で予定どおり十時から行います。",
        "Bastelworkshop um zehn wie geplant, aber in der Turnhalle."
      ],
      [
        "司会",
        "食べ物のお店も体育館の入り口に移りました。",
        "Essensstände sind zum Eingang der Turnhalle gezogen."
      ],
      [
        "司会",
        "駐車場は使えませんので、できればバスでお越しください。",
        "Parkplatz gesperrt; wenn möglich Bus nutzen."
      ],
      [
        "司会",
        "前に配った地図は古い情報です。会場の案内を確認してください。",
        "Alte Karte ist nicht mehr gültig; aktuelle Beschilderung beachten."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was wird vollständig abgesagt?",
        "外の音楽会です。",
        "音楽会が中止です。",
        "工作教室です。",
        "Der Workshop bleibt erhalten.",
        "音楽会は中止です"
      ],
      [
        "inference",
        "Warum soll die alte Karte nicht verwendet werden?",
        "会場が変わったからです。",
        "体育館に移ったからです。",
        "時間が九時に変わったからです。",
        "Der Veranstaltungsort, nicht Beginn, hat sich geändert.",
        "前に配った地図は古い情報です"
      ],
      [
        "intent",
        "Wie sollen Gäste vorzugsweise anreisen?",
        "バスで来ます。",
        "バスで行ったほうがいいです。",
        "車で駐車場に行きます。",
        "Der Parkplatz kann nicht genutzt werden.",
        "できればバスでお越しください"
      ]
    ],
    "vocabulary": [
      [
        "中止",
        "ちゅうし",
        "Absage",
        "中止です"
      ],
      [
        "会場",
        "かいじょう",
        "Veranstaltungsort",
        "会場の案内"
      ]
    ],
    "notes": "Eine teilweise Verlegung ist keine Gesamtab­sage. 予定どおり betrifft die Anfangszeit.",
    "response": [
      "Fasse die gültige Bastelveranstaltung zusammen.",
      "工作教室は十時から学校の体育館であります。",
      "工作教室は中止ではありません。体育館で行います。",
      "工作教室は外で行います。",
      "Der Ort wurde geändert."
    ],
    "transfer": [
      "Neue Veranstaltung: Markt nach innen verlegt und beginnt unverändert um elf, Konzert abgesagt. Informiere eine Freundin.",
      "市場は十一時から室内で行いますが、コンサートは中止です。",
      "十一時の市場はありますが、音楽会はありません。",
      "市場も中止です。",
      "Die Marktveranstaltung findet weiterhin statt."
    ]
  },
  {
    "id": "a2-bicycle-return",
    "title": "Fahrradstation ist voll",
    "genre": "instructions",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Verleihstation erklärt Rückgabe bei einem vollen Standort.",
    "listeningGoal": "Gebühren, Rückgabeort und Bestätigung als Prozess erkennen",
    "prediction": "Ist ein Fahrrad nur durch Abstellen zurückgegeben?",
    "lines": [
      [
        "案内",
        "この自転車は一時間まで三百円で借りられます。一時間を過ぎると追加料金がかかります。",
        "Bis zu einer Stunde 300 Yen, danach Zusatzgebühren."
      ],
      [
        "案内",
        "借りた駅の置き場がいっぱいの場合は、公園の入り口にある置き場へ返してください。",
        "Bei voller Bahnhofsstation am Parkeingang zurückgeben."
      ],
      [
        "案内",
        "道の途中に置いただけでは返したことになりません。",
        "Bloßes Abstellen unterwegs zählt nicht."
      ],
      [
        "案内",
        "返すときは画面の『返却完了』を必ず確認してください。",
        "Bei Rückgabe die Anzeige 'abgeschlossen' prüfen."
      ],
      [
        "利用者",
        "公園の置き場で、画面を確認するんですね。",
        "Also Parkstation und Anzeige prüfen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche alternative Station wird genannt?",
        "公園の入り口です。",
        "公園の置き場です。",
        "スーパーの前です。",
        "Die Ausweichstation ist am Park.",
        "公園の入り口にある置き場"
      ],
      [
        "inference",
        "Was passiert, wenn man das Fahrrad einfach am Straßenrand abstellt?",
        "返したことになりません。",
        "返却が終わっていません。",
        "返却完了です。",
        "Nur Abstellen ist keine ordnungsgemäße Rückgabe.",
        "置いただけでは返したことになりません"
      ],
      [
        "intent",
        "Was ist das letzte notwendige Prüfsignal?",
        "返却完了です。",
        "画面の返却完了を確認します。",
        "借りた駅の名前です。",
        "Die Bildschirmbestätigung zählt.",
        "返却完了を必ず確認"
      ]
    ],
    "vocabulary": [
      [
        "置き場",
        "おきば",
        "Abstellplatz",
        "置き場がいっぱい"
      ],
      [
        "返却完了",
        "へんきゃくかんりょう",
        "Rückgabe abgeschlossen",
        "返却完了"
      ]
    ],
    "notes": "Die Gebühren sind fiktives Unterrichtsbeispiel; die Rückgabebestätigung ist wichtiger als bloßes Parken.",
    "response": [
      "Beschreibe den ordnungsgemäßen Ersatzweg.",
      "公園の置き場に返して、画面を確認します。",
      "公園で返却完了を確認します。",
      "道に置いて帰ります。",
      "Das gilt nicht als registrierte Rückgabe."
    ],
    "transfer": [
      "Andere Verleihstation: Hauptstation voll, im Rathaus zurückgeben und Code bestätigen. Erkläre.",
      "市役所の置き場に返して、コードを確認します。",
      "市役所で返したあと、番号を確認します。",
      "道に置けば大丈夫です。",
      "Neuer Standort und Bestätigung sind nötig."
    ]
  },
  {
    "id": "a2-interview-commute",
    "title": "Arbeitsweg früher und heute",
    "genre": "interview",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Interview mit einer Pendlerin über Verkehrsmittelwechsel.",
    "listeningGoal": "Vorher-Nachher-Vergleich und verbleibende Einschränkung erfassen",
    "prediction": "Warum fährt sie nicht immer mit dem Rad?",
    "lines": [
      [
        "記者",
        "前はどうやって会社に行っていましたか。",
        "Wie kamen Sie früher zur Arbeit?"
      ],
      [
        "あや",
        "前は毎日バスで行っていました。混んでいると四十分かかりました。",
        "Früher täglich Bus, bei Überfüllung 40 Minuten."
      ],
      [
        "記者",
        "今は自転車を使っているんですか。",
        "Heute Fahrrad?"
      ],
      [
        "あや",
        "はい。自転車なら二十分です。朝の時間に余裕ができました。",
        "Mit dem Rad 20 Minuten, mehr Zeit morgens."
      ],
      [
        "記者",
        "雨の日も自転車ですか。",
        "Auch bei Regen?"
      ],
      [
        "あや",
        "いいえ。雨が強い日はバスに戻ります。時間がかかっても、安全なほうがいいです。",
        "Bei starkem Regen wieder Bus; Sicherheit geht vor."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie lange dauert der Radweg?",
        "二十分です。",
        "自転車なら二十分です。",
        "四十分です。",
        "Vierzig Minuten beschreibt den früheren Busweg.",
        "自転車なら二十分です"
      ],
      [
        "inference",
        "Warum benutzt Aya bei starkem Regen den Bus?",
        "安全のためです。",
        "自転車より安全だと思うからです。",
        "バスのほうがいつも速いからです。",
        "Sicherheit statt Geschwindigkeit wird genannt.",
        "時間がかかっても、安全なほうがいい"
      ],
      [
        "intent",
        "Was hat sich am Morgen mit dem Fahrrad verbessert?",
        "時間に余裕ができました。",
        "朝の時間が増えました。",
        "仕事がなくなりました。",
        "Es geht um Zeitpuffer, nicht die Arbeit.",
        "朝の時間に余裕ができました"
      ]
    ],
    "vocabulary": [
      [
        "余裕",
        "よゆう",
        "Spielraum",
        "時間に余裕"
      ],
      [
        "混む",
        "こむ",
        "voll/überfüllt sein",
        "混んでいると"
      ]
    ],
    "notes": "Der Zeitgewinn gilt im Normalfall, nicht als pauschale Wahl bei jedem Wetter.",
    "response": [
      "Fasse Ayas Verkehrsmittelwahl zusammen.",
      "晴れた日は自転車で、雨が強い日はバスを使います。",
      "普段は自転車ですが、雨の日はバスに乗ります。",
      "いつも自転車で行きます。",
      "Die Regenausnahme fehlt."
    ],
    "transfer": [
      "Andere Pendlerin: normal zu Fuß, bei Schnee mit der Bahn. Beschreibe.",
      "普段は歩きますが、雪の日は電車に乗ります。",
      "雪が降る日は電車を使います。",
      "いつもバスに乗ります。",
      "Das neue Verkehrsmuster unterscheidet sich."
    ]
  },
  {
    "id": "a2-gift-return-conditions",
    "title": "Geschenk umtauschen statt zurückgeben",
    "genre": "service",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Ein Kunde möchte ein unbenutztes Geschenk wegen falscher Größe ändern.",
    "listeningGoal": "Rückgabe, Umtausch und Nachweis unterscheiden",
    "prediction": "Ist Rückerstattung sicher möglich?",
    "lines": [
      [
        "客",
        "昨日、友だちへのシャツを買いましたが、サイズが小さすぎました。",
        "Gestern Shirt als Geschenk gekauft, zu klein."
      ],
      [
        "店員",
        "レシートはありますか。",
        "Haben Sie den Kassenbon?"
      ],
      [
        "客",
        "はい、あります。まだ一度も着ていません。",
        "Ja; noch nie getragen."
      ],
      [
        "店員",
        "ありがとうございます。同じ値段の別のサイズと交換できます。お金を返すことはできません。",
        "Gleicher Preis und andere Größe tauschbar, keine Geldrückgabe."
      ],
      [
        "客",
        "では、大きいサイズの青いシャツに交換したいです。",
        "Dann in größeres blaues Shirt tauschen."
      ],
      [
        "店員",
        "青はありますが、同じ値段なのは白だけです。",
        "Blau verfügbar, aber zum gleichen Preis nur Weiß."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was bietet der Laden ohne Mehrkosten an?",
        "同じ値段の別のサイズです。",
        "同じ値段のシャツと交換できます。",
        "お金を返します。",
        "Bargeldrückerstattung wird ausgeschlossen.",
        "同じ値段の別のサイズと交換できます"
      ],
      [
        "inference",
        "Warum ist das blaue Shirt noch nicht als gleichwertiger Tausch bestätigt?",
        "同じ値段ではないからです。",
        "青いシャツは値段が違うからです。",
        "青は売り切れだからです。",
        "Blau ist da, aber nicht zum gleichen Preis.",
        "青はありますが、同じ値段なのは白だけ"
      ],
      [
        "intent",
        "Welcher Beleg unterstützt den Umtausch?",
        "レシートです。",
        "レシートを持っています。",
        "クーポンです。",
        "Der Mitarbeiter fragt gezielt nach Kassenbon.",
        "レシートはありますか"
      ]
    ],
    "vocabulary": [
      [
        "交換",
        "こうかん",
        "Umtausch",
        "交換できます"
      ],
      [
        "レシート",
        "れしーと",
        "Kassenbon",
        "レシートはありますか"
      ]
    ],
    "notes": "Die Bedingungen sind fiktive Ladenregeln. Die letzte Aussage ändert erneut die verfügbare Wahl.",
    "response": [
      "Bitte um ein weißes Shirt gleicher Größe, sofern gleicher Preis.",
      "では、同じ値段の白いシャツに交換します。",
      "白いシャツに交換してください。",
      "青いシャツを無料で交換します。",
      "Blau ist nicht zum gleichen Preis erhältlich."
    ],
    "transfer": [
      "Anderer Laden: roter Pullover ist nur teurer, grüner gleicher Preis. Bitte um grünen.",
      "では、緑のセーターに交換したいです。",
      "同じ値段の緑をお願いします。",
      "赤いセーターを無料でください。",
      "Rot erfüllt die Preisbedingung nicht."
    ]
  },
  {
    "id": "a2-campus-room-late",
    "title": "Seminar beginnt später und anderswo",
    "genre": "voicemail",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Dozentin informiert über gleichzeitigen Raum- und Zeitwechsel.",
    "listeningGoal": "Zwei neue Fakten aus einer Sprachnachricht richtig notieren",
    "prediction": "Höre auf die korrigierte Kombination.",
    "lines": [
      [
        "先生",
        "明日の日本語セミナーについてお知らせします。",
        "Information zum Seminar morgen."
      ],
      [
        "先生",
        "最初の予定では十時から二〇一号室でしたが、その部屋の機械が故障しました。",
        "Ursprünglich zehn Uhr Raum 201, Gerät defekt."
      ],
      [
        "先生",
        "三〇四号室で十一時から行います。",
        "Nun 11 Uhr Raum 304."
      ],
      [
        "先生",
        "午後のグループ学習は予定どおり二時からです。",
        "Nachmittags Gruppenarbeit weiterhin zwei Uhr."
      ],
      [
        "先生",
        "新しい教室を友だちにも伝えてください。",
        "Neuen Raum bitte weitergeben."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wo und wann beginnt das Seminar?",
        "十一時に三〇四号室です。",
        "三〇四号室で十一時からです。",
        "十時に二〇一号室です。",
        "Beide alten Werte wurden ersetzt.",
        "三〇四号室で十一時から"
      ],
      [
        "inference",
        "Wurde auch die Nachmittagsgruppenarbeit verschoben?",
        "いいえ、二時からです。",
        "午後の学習は変わりません。",
        "はい、三時からです。",
        "Die Aussage 予定どおり gilt für die Gruppenarbeit.",
        "予定どおり二時からです"
      ],
      [
        "intent",
        "Was sollen die Studenten ihren Freunden sagen?",
        "新しい教室です。",
        "三〇四号室になったことです。",
        "セミナーは中止です。",
        "Der Kurs findet statt, nur an anderem Ort.",
        "新しい教室を友だちにも伝えてください"
      ]
    ],
    "vocabulary": [
      [
        "故障",
        "こしょう",
        "Defekt",
        "機械が故障"
      ],
      [
        "予定どおり",
        "よていどおり",
        "wie geplant",
        "予定どおり二時"
      ]
    ],
    "notes": "Zwei parallele Termine haben unterschiedliche Änderungsstände.",
    "response": [
      "Teile einem Freund neuen Raum und Uhrzeit mit.",
      "セミナーは十一時から三〇四号室だよ。",
      "明日の授業は三〇四号室で十一時からだよ。",
      "二〇一号室で十時からだよ。",
      "Das ist die überholte Kombination."
    ],
    "transfer": [
      "Neue Sitzung: Raum 405 ab 13 Uhr statt Raum 101 ab 12 Uhr. Informiere eine Freundin.",
      "会議は午後一時から四〇五号室だよ。",
      "四〇五号室で一時からだよ。",
      "三〇四号室で十一時だよ。",
      "Der neue Termin ist anders."
    ]
  },
  {
    "id": "a2-museum-guide-language",
    "title": "Führung in anderer Sprache",
    "genre": "service",
    "level": "A2",
    "units": [
      "p25:directions",
      "p26:station-to-campus"
    ],
    "situation": "Eine Besucherin sucht einen japanischen Audioguide.",
    "listeningGoal": "Nicht verfügbares Medium und Alternativformat erfassen",
    "prediction": "Welche Alternative bleibt trotz ausverkaufter Geräte?",
    "lines": [
      [
        "客",
        "日本語の音声ガイドを一つ借りたいです。",
        "Ich möchte einen japanischen Audioguide."
      ],
      [
        "係員",
        "申し訳ありません。日本語の機械は全部貸し出し中です。",
        "Alle japanischen Audiogeräte sind verliehen."
      ],
      [
        "客",
        "英語の機械ならありますか。",
        "Gibt es englische Geräte?"
      ],
      [
        "係員",
        "英語はあります。それから、日本語の説明が書かれた無料の冊子もあります。",
        "Englisch als Audio verfügbar, kostenlose japanische Broschüre vorhanden."
      ],
      [
        "客",
        "日本語で読みたいので、その冊子をお願いします。",
        "Ich möchte auf Japanisch lesen, also die Broschüre."
      ],
      [
        "係員",
        "こちらです。二階から見学できます。",
        "Bitte, Sie können im zweiten Stock beginnen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Sprachversion ist als Audio nicht verfügbar?",
        "日本語です。",
        "日本語の音声ガイドです。",
        "英語です。",
        "Englisches Audio gibt es.",
        "日本語の機械は全部貸し出し中"
      ],
      [
        "inference",
        "Warum wählt die Besucherin die Broschüre statt das englische Gerät?",
        "日本語で読みたいからです。",
        "日本語の説明がほしいからです。",
        "冊子が英語だからです。",
        "Die Broschüre bietet japanischen Text.",
        "日本語で読みたいので"
      ],
      [
        "intent",
        "Von welchem Stock aus beginnt der Rundgang?",
        "二階です。",
        "二階から見学します。",
        "一階です。",
        "Der Mitarbeiter nennt ausdrücklich Stock zwei.",
        "二階から見学できます"
      ]
    ],
    "vocabulary": [
      [
        "貸し出し中",
        "かしだしちゅう",
        "ausgeliehen",
        "全部貸し出し中"
      ],
      [
        "冊子",
        "さっし",
        "Broschüre",
        "無料の冊子"
      ]
    ],
    "notes": "Zielsprache und Medium sind zwei voneinander unabhängige Eigenschaften.",
    "response": [
      "Bitte um die kostenlose japanische Broschüre.",
      "日本語の無料の冊子をお願いします。",
      "日本語の冊子を一つください。",
      "日本語の音声ガイドをください。",
      "Das japanische Audiogerät ist nicht verfügbar."
    ],
    "transfer": [
      "Andere Ausstellung: deutscher Audioguide aus, deutsche Broschüre gratis. Bitte darum.",
      "ドイツ語の無料の冊子をお願いします。",
      "ドイツ語の説明がある冊子をください。",
      "日本語の音声ガイドを借りたいです。",
      "Sprache und Format sind anders."
    ]
  },
  {
    "id": "a2-housing-viewing",
    "title": "Wohnungsbesichtigung mit Einschränkung",
    "genre": "voicemail",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Vermieterin spricht über Besichtigungstermine und anfallende Kosten.",
    "listeningGoal": "Regelzeit, verbotenen Termin und separate Kosten interpretieren",
    "prediction": "Welcher Tag kommt für Besichtigung nicht in Frage?",
    "lines": [
      [
        "管理人",
        "お問い合わせありがとうございます。お部屋の見学についてご案内します。",
        "Danke für die Anfrage, Info zu Besichtigung."
      ],
      [
        "管理人",
        "火曜日と木曜日の午後三時から六時まで見学できます。",
        "Dienstag und Donnerstag von 15 bis 18 Uhr."
      ],
      [
        "管理人",
        "今週の木曜日だけは工事があるので、見学できません。",
        "Ausnahmsweise diesen Donnerstag wegen Arbeiten nicht."
      ],
      [
        "管理人",
        "家賃には水道代が入っていますが、電気代とインターネット代は別です。",
        "Wasser in Miete enthalten, Strom und Internet extra."
      ],
      [
        "管理人",
        "見学したい方は前の日までにご連絡ください。",
        "Für Besuch bis Vortag anmelden."
      ]
    ],
    "questions": [
      [
        "detail",
        "An welchem Tag ist diese Woche keine Besichtigung möglich?",
        "木曜日です。",
        "今週の木曜日はできません。",
        "火曜日です。",
        "Dienstag bleibt grundsätzlich verfügbar.",
        "今週の木曜日だけは…見学できません"
      ],
      [
        "inference",
        "Sind Internetkosten bereits in der Miete enthalten?",
        "いいえ、別です。",
        "インターネット代は別に払います。",
        "はい、入っています。",
        "Wasser ist enthalten, Internet extra.",
        "インターネット代は別です"
      ],
      [
        "intent",
        "Wie früh muss eine Besichtigung angekündigt werden?",
        "前の日までです。",
        "前日までに連絡します。",
        "当日の夜です。",
        "Die Bitte lautet bis zum Vortag.",
        "前の日までにご連絡ください"
      ]
    ],
    "vocabulary": [
      [
        "見学",
        "けんがく",
        "Besichtigung",
        "見学できます"
      ],
      [
        "別",
        "べつ",
        "separat",
        "代は別です"
      ]
    ],
    "notes": "Fiktive Anzeige, keine reale Mietberatung. Die Ausnahme だけ begrenzt die Schließung auf diesen Donnerstag.",
    "response": [
      "Bitte um eine Besichtigung am Dienstag um 16 Uhr.",
      "火曜日の午後四時に見学したいです。",
      "火曜日の四時に見学できますか。",
      "今週の木曜日に見学したいです。",
      "Dieser Donnerstag ist ausgeschlossen."
    ],
    "transfer": [
      "Neue Anzeige: Besichtigungen Freitag 14–17 Uhr, aber diesen Freitag abgesagt. Bitte um nächste Woche Freitag 15 Uhr.",
      "来週の金曜日の三時に見学できますか。",
      "来週の金曜日の午後三時に見学したいです。",
      "今週の金曜日に行きます。",
      "Diese Woche findet keine Besichtigung statt."
    ]
  },
  {
    "id": "a2-study-feedback",
    "title": "Rückmeldung zur schriftlichen Aufgabe",
    "genre": "dialogue",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Lehrkraft erklärt, was an einem kurzen Text zuerst verbessert werden soll.",
    "listeningGoal": "Lob, Hauptproblem, Korrekturreihenfolge und Frist trennen",
    "prediction": "Welche Verbesserung ist diesmal wichtiger als einzelne Kanji?",
    "lines": [
      [
        "先生",
        "作文を読みました。旅行の話はわかりやすかったです。",
        "Ich habe den Text gelesen; die Reisebeschreibung war verständlich."
      ],
      [
        "学生",
        "ありがとうございます。どこを直したほうがいいですか。",
        "Was sollte ich verbessern?"
      ],
      [
        "先生",
        "旅行した日の話と、来月の予定が同じ段落に入っています。時間の順番がわかりにくいですね。",
        "Vergangene Reise und zukünftiger Plan stehen in einem Absatz; Zeitfolge unklar."
      ],
      [
        "学生",
        "漢字の間違いから直したほうがいいですか。",
        "Soll ich zuerst Kanji korrigieren?"
      ],
      [
        "先生",
        "漢字も大切ですが、今回は段落を分けてください。新しい作文は月曜日までに送ってください。",
        "Kanji auch wichtig, aber zuerst Absätze trennen; Abgabe Montag."
      ],
      [
        "学生",
        "まず段落を直して、月曜日までに出します。",
        "Ich verbessere zuerst die Absätze, schicke bis Montag."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was ist die Hauptkorrektur für diese Version?",
        "段落を分けることです。",
        "時間の順番をわかりやすくします。",
        "漢字だけです。",
        "Kanji sind wichtig, aber dieses Mal nicht zuerst.",
        "今回は段落を分けてください"
      ],
      [
        "inference",
        "Warum hilft die Trennung der Absätze?",
        "旅行した日と来月の予定を分けられるからです。",
        "時間の順番がわかりやすくなるからです。",
        "旅行がなくなるからです。",
        "Das Ziel ist Klarheit zwischen Vergangenheit und Zukunft.",
        "時間の順番がわかりにくい"
      ],
      [
        "intent",
        "Bis wann muss die neue Fassung geschickt werden?",
        "月曜日までです。",
        "月曜日までに送ります。",
        "金曜日までです。",
        "Die Lehrkraft nennt Montag.",
        "月曜日までに送ってください"
      ]
    ],
    "vocabulary": [
      [
        "段落",
        "だんらく",
        "Absatz",
        "同じ段落"
      ],
      [
        "作文",
        "さくぶん",
        "Aufsatz",
        "新しい作文"
      ]
    ],
    "notes": "Der Hinweis も大切ですが kontrastiert allgemeine Wichtigkeit mit einer aktuellen Priorität.",
    "response": [
      "Sage höflich, welche Korrektur du zuerst vornehmen wirst.",
      "まず段落を分けて直します。",
      "時間の順番を直します。",
      "漢字だけ直して出します。",
      "Die Lehrkraft priorisiert Textstruktur."
    ],
    "transfer": [
      "Andere Aufgabe: Erst Quellenangabe ergänzen, danach Stil korrigieren. Bestätige.",
      "まず出典を書いて、そのあと文体を直します。",
      "先に出典を入れます。",
      "文体だけ直します。",
      "Die neue Priorität ist die Quellenangabe."
    ]
  }
] satisfies P47RawScene[];
export const p47ScenesD=p47CorpusD.map(authoredP47Scene);
