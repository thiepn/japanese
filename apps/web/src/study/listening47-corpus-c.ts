import {authoredP47Scene,type P47RawScene} from "./listening47-types";
export const p47CorpusC=[
  {
    "id": "a2-station-connection",
    "title": "Die letzte Verbindung zur Universität",
    "genre": "announcement",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Mehrteilige Bahnhofsdurchsage zu Schienenersatzverkehr und Anschlussbus.",
    "listeningGoal": "Zeit, Ankunft, Haltestelle und Ausnahme kombinieren",
    "prediction": "Was bleibt von der ursprünglichen Route?",
    "lines": [
      [
        "放送",
        "お客様にお知らせします。午後四時発の大学行きの電車は、今日は走りません。",
        "Der Zug zur Universität um 16 Uhr fährt heute nicht."
      ],
      [
        "放送",
        "代わりに、駅の南口から四時十分にバスが出ます。",
        "Ersatzbus ab Südausgang um 16:10."
      ],
      [
        "放送",
        "このバスは市役所まで行きます。大学へ行く方は、そこで二番のバスに乗り換えてください。",
        "Bus fährt bis Rathaus; dort in Linie zwei umsteigen."
      ],
      [
        "放送",
        "なお、雨のため、南口の階段は使えません。東側のエレベーターを利用してください。",
        "Wegen Regen sind die Südtreppen gesperrt; benutzen Sie den östlichen Aufzug."
      ],
      [
        "乗客",
        "まずエレベーターで南口へ行って、バスですね。",
        "Also mit Aufzug zum Südausgang und in den Bus."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann fährt der Ersatzbus?",
        "四時十分です。",
        "午後四時十分に出ます。",
        "四時です。",
        "16 Uhr war der ausgefallene Zug.",
        "四時十分にバスが出ます"
      ],
      [
        "inference",
        "Reicht eine Busfahrt bis zum Rathaus, um die Universität zu erreichen?",
        "いいえ、乗り換えが必要です。",
        "二番のバスに乗り換えます。",
        "はい、そのまま大学に着きます。",
        "Die Durchsage benennt einen zweiten Bus.",
        "二番のバスに乗り換えてください"
      ],
      [
        "intent",
        "Warum wird der östliche Aufzug genannt?",
        "南口の階段が使えないからです。",
        "階段が閉まっているからです。",
        "エレベーターが故障したからです。",
        "Der Aufzug ist die Alternative zur gesperrten Treppe.",
        "南口の階段は使えません"
      ]
    ],
    "vocabulary": [
      [
        "代わりに",
        "かわりに",
        "stattdessen",
        "代わりに、駅の南口"
      ],
      [
        "利用",
        "りよう",
        "Benutzung",
        "利用してください"
      ]
    ],
    "notes": "Mehrere Änderungen gelten gleichzeitig: Zug fällt aus, Bus fährt später, Umstieg nötig und normaler Ausgangsweg gesperrt.",
    "response": [
      "Beschreibe den neuen Weg zur Universität.",
      "四時十分に南口からバスに乗り、市役所で二番に乗り換えます。",
      "南口からバスで市役所へ行き、二番のバスに乗ります。",
      "四時の電車で直接大学へ行きます。",
      "Der Zug fällt aus; ein Umstieg ist nötig."
    ],
    "transfer": [
      "Neue Verbindung: Zug 17 Uhr fällt aus, Bus 17:20 am Nordausgang bis Rathaus, dort Linie vier. Erkläre den Weg.",
      "五時二十分に北口からバスに乗り、市役所で四番に乗り換えます。",
      "北口のバスで市役所へ行って、四番に乗ります。",
      "四時十分に南口から二番に乗ります。",
      "Die Angaben stammen aus einer anderen Situation."
    ]
  },
  {
    "id": "a2-doctor-rebook",
    "title": "Sprechstundentermin am Telefon",
    "genre": "voicemail",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Eine Praxis hinterlässt eine Nachricht mit zwei Terminoptionen.",
    "listeningGoal": "Terminvorschlag, Ablehnungsgrund und Frist unterscheiden",
    "prediction": "Gibt es schon einen bestätigten Ersatztermin?",
    "lines": [
      [
        "受付",
        "こちらは山川クリニックです。佐藤さんの予約についてお電話しました。",
        "Hier Klinik Yamakawa wegen Ihrer Buchung."
      ],
      [
        "受付",
        "金曜日の午前十時の予約ですが、先生の予定が変わったため、その時間に診察できなくなりました。",
        "Ihr Freitagstermin 10 Uhr kann wegen Arztplanänderung nicht stattfinden."
      ],
      [
        "受付",
        "木曜日の午後三時か、来週の月曜日の午前九時なら予約できます。",
        "Donnerstag 15 Uhr oder nächsten Montag 9 Uhr sind möglich."
      ],
      [
        "受付",
        "まだ変更していませんので、どちらがいいか水曜日までにお電話ください。",
        "Noch nichts umgebucht; bitte bis Mittwoch anrufen."
      ],
      [
        "受付",
        "ご迷惑をおかけして申し訳ありません。",
        "Entschuldigung für die Unannehmlichkeiten."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche zwei Ersatzoptionen gibt es?",
        "木曜日の三時と来週月曜日の九時です。",
        "木曜日の午後三時か月曜日の午前九時です。",
        "金曜日の十時だけです。",
        "Freitag ist ausgefallen, die Alternativen sind andere Tage.",
        "木曜日の午後三時か、来週の月曜日の午前九時"
      ],
      [
        "inference",
        "Ist die Buchung bereits automatisch auf Donnerstag geändert?",
        "いいえ、まだ変更していません。",
        "いいえ、電話で選ぶ必要があります。",
        "はい、木曜日に決まりました。",
        "Die Praxis sagt ausdrücklich, dass noch keine Änderung vorgenommen wurde.",
        "まだ変更していません"
      ],
      [
        "intent",
        "Bis wann erwartet die Praxis Rückmeldung?",
        "水曜日までです。",
        "水曜日までに電話します。",
        "金曜日までです。",
        "Mittwoch ist die Antwortfrist.",
        "水曜日までにお電話ください"
      ]
    ],
    "vocabulary": [
      [
        "診察",
        "しんさつ",
        "Untersuchung/Sprechstunde",
        "診察できなく"
      ],
      [
        "変更",
        "へんこう",
        "Änderung",
        "変更していません"
      ]
    ],
    "notes": "Zwei angebotene Termine sind noch keine verbindliche Buchung; der Hörer muss aktiv wählen.",
    "response": [
      "Rufe zurück und wähle Donnerstag 15 Uhr.",
      "木曜日の午後三時でお願いします。",
      "木曜日の三時に変更したいです。",
      "金曜日の十時でお願いします。",
      "Der ursprüngliche Termin ist nicht verfügbar."
    ],
    "transfer": [
      "Andere Praxis: Dienstag 14 Uhr fällt aus; Mittwoch 11 Uhr ist frei. Bitte höflich um Umbuchung.",
      "水曜日の十一時に変更してください。",
      "水曜日の午前十一時でお願いします。",
      "木曜日の三時でお願いします。",
      "Das ist eine andere Terminoption."
    ]
  },
  {
    "id": "a2-hotel-breakfast",
    "title": "Frühstück an nur einem Morgen",
    "genre": "service",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Hotelcheck-in mit Buchungskorrektur und optionalem Frühstück.",
    "listeningGoal": "Von-bis-Zeitraum und Zusatzleistung zeitlich trennen",
    "prediction": "Welche Dinge werden korrigiert, welche bleiben?",
    "lines": [
      [
        "客",
        "田中です。金曜日から日曜日まで予約しました。",
        "Ich bin Tanaka. Reserviert Freitag bis Sonntag."
      ],
      [
        "受付",
        "確認します。土曜日から二泊となっていますね。",
        "Hier steht Samstag für zwei Nächte."
      ],
      [
        "客",
        "すみません、金曜日からです。日曜日の朝に帰ります。",
        "Nein, schon Freitag; ich fahre Sonntag früh ab."
      ],
      [
        "受付",
        "失礼しました。金曜日から二泊に直しました。朝食はどうされますか。",
        "Korrigiert: ab Freitag zwei Nächte. Frühstück?"
      ],
      [
        "客",
        "土曜日の朝だけお願いします。日曜日は早く出るので要りません。",
        "Nur Samstagmorgen bitte; Sonntag fahre ich früh."
      ],
      [
        "受付",
        "土曜日だけですね。かしこまりました。",
        "Nur Samstag, verstanden."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann beginnt der tatsächliche Aufenthalt?",
        "金曜日からです。",
        "金曜日にチェックインします。",
        "土曜日からです。",
        "Samstag war der Datensatzfehler.",
        "金曜日から二泊に直しました"
      ],
      [
        "inference",
        "Warum wird für Sonntag kein Frühstück bestellt?",
        "早く出るからです。",
        "日曜日の朝は早く帰るからです。",
        "ホテルに朝食がないからです。",
        "Das Frühstück wird nur wegen früher Abreise ausgelassen.",
        "日曜日は早く出るので要りません"
      ],
      [
        "intent",
        "Welche Leistung wird nur einmal bestellt?",
        "土曜日の朝食です。",
        "朝食は土曜日だけです。",
        "毎朝の夕食です。",
        "Es geht um Frühstück ausschließlich am Samstag.",
        "土曜日の朝だけお願いします"
      ]
    ],
    "vocabulary": [
      [
        "二泊",
        "にはく",
        "zwei Übernachtungen",
        "二泊に直しました"
      ],
      [
        "直す",
        "なおす",
        "korrigieren",
        "直しました"
      ]
    ],
    "notes": "Ein korrigierter Check-in und ein nur einmal gebuchtes Frühstück sind zwei getrennte Entscheidungen.",
    "response": [
      "Bestätige die endgültige Buchung.",
      "金曜日から日曜日まで泊まり、朝食は土曜日だけです。",
      "金曜日から二泊で、土曜日の朝食をお願いします。",
      "土曜日から二泊で、毎朝食べます。",
      "Datums- und Frühstücksangaben wären falsch."
    ],
    "transfer": [
      "Anderes Hotel: Aufenthalt Montag bis Mittwoch, Frühstück nur Dienstag. Bestätige.",
      "月曜日から水曜日まで泊まり、火曜日だけ朝食をお願いします。",
      "月曜日から二泊で、朝食は火曜日だけです。",
      "金曜日から日曜日まで泊まります。",
      "Neuer Zeitraum und Morgen."
    ]
  },
  {
    "id": "a2-library-room-rules",
    "title": "Gruppenraum mit neuen Regeln",
    "genre": "announcement",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Bibliothek erläutert einen Raumwechsel mit teilweise unveränderten Regeln.",
    "listeningGoal": "Alten und neuen Raum, Zeitregel und Reservierungsbedingung kombinieren",
    "prediction": "Welche Angaben gelten erst ab nächster Woche?",
    "lines": [
      [
        "案内",
        "来週から、二階のグループ学習室は工事で使えなくなります。",
        "Ab nächster Woche ist der Gruppenraum im zweiten Stock gesperrt."
      ],
      [
        "案内",
        "予約したグループは、一階の小会議室を利用してください。予約時間は変わりません。",
        "Reservierte Gruppen können den kleinen Besprechungsraum im Erdgeschoss nutzen; Zeiten bleiben."
      ],
      [
        "案内",
        "小会議室は四人まで入れます。五人以上のグループは受付に相談してください。",
        "Raum für maximal vier; Gruppen ab fünf müssen zum Schalter."
      ],
      [
        "学生",
        "私たちは五人なので、受付に聞いたほうがいいですね。",
        "Wir sind fünf, also besser nachfragen."
      ],
      [
        "案内",
        "なお、静かな勉強のため、電話は廊下でお願いします。",
        "Anrufe bitte draußen im Flur."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wo sollen kleine reservierte Gruppen nächste Woche arbeiten?",
        "一階の小会議室です。",
        "一階の部屋です。",
        "二階のグループ学習室です。",
        "Der alte Raum wird renoviert.",
        "一階の小会議室を利用してください"
      ],
      [
        "inference",
        "Was muss eine Gruppe mit fünf Personen tun?",
        "受付に相談します。",
        "受付で聞きます。",
        "そのまま五人で小会議室に入ります。",
        "Der neue Raum erlaubt nur vier Personen.",
        "五人以上のグループは受付に相談"
      ],
      [
        "intent",
        "Welche Eigenschaft der Reservierung bleibt gleich?",
        "予約時間です。",
        "予約した時間は変わりません。",
        "部屋の場所です。",
        "Der Raum ändert sich, die Zeit nicht.",
        "予約時間は変わりません"
      ]
    ],
    "vocabulary": [
      [
        "学習室",
        "がくしゅうしつ",
        "Lernraum",
        "グループ学習室"
      ],
      [
        "相談",
        "そうだん",
        "Rücksprache",
        "受付に相談"
      ]
    ],
    "notes": "Die Regel für Gruppen ab fünf Personen überschreibt nicht die zuvor genannten unveränderten Zeitfenster.",
    "response": [
      "Als fünfköpfige Gruppe bitte höflich um eine Alternative.",
      "五人なのですが、別の部屋を使えますか。",
      "五人で使える部屋はありますか。",
      "五人で小会議室を使います。",
      "Der Raum ist nur für vier zugelassen."
    ],
    "transfer": [
      "Anderes Lernhaus: Raum für maximal drei, eure Gruppe hat vier. Bitte höflich um Lösung.",
      "四人ですが、使える部屋はありますか。",
      "四人で入れる部屋を教えてください。",
      "そのまま四人で入ります。",
      "Die neue Grenze liegt bei drei."
    ]
  },
  {
    "id": "a2-neighbor-volunteer",
    "title": "Freiwilligenarbeit im Viertel",
    "genre": "interview",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Interview mit einer freiwilligen Helferin über eine verlegte Aktion.",
    "listeningGoal": "Motivation und geänderten Ablauf aus mehreren Aussagen erschließen",
    "prediction": "Warum findet die Aktion nun innen statt?",
    "lines": [
      [
        "記者",
        "いつから町の掃除を手伝っていますか。",
        "Seit wann helfen Sie beim Reinigen des Viertels?"
      ],
      [
        "ゆり",
        "去年からです。最初は友だちに誘われましたが、今は毎月参加しています。",
        "Seit letztem Jahr. Anfangs Einladung einer Freundin, jetzt monatlich."
      ],
      [
        "記者",
        "今週の活動はどうなりますか。",
        "Wie läuft die Aktion diese Woche?"
      ],
      [
        "ゆり",
        "雨が強そうなので、公園の掃除は来週にします。今週は公民館で使わなくなった本を整理します。",
        "Wegen Regen wird Parkreinigung verschoben, diese Woche Bücher im Gemeindehaus sortieren."
      ],
      [
        "記者",
        "参加する人に何か伝えたいですか。",
        "Mitteilung für Teilnehmende?"
      ],
      [
        "ゆり",
        "軍手は要りませんが、本を入れる袋があると助かります。",
        "Handschuhe unnötig, Beutel für Bücher hilfreich."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was machen die Helfer diese Woche?",
        "本を整理します。",
        "公民館で本を整理します。",
        "公園を掃除します。",
        "Die Parkreinigung wurde verschoben.",
        "今週は公民館で…本を整理します"
      ],
      [
        "inference",
        "Warum wird der Park nicht diese Woche gereinigt?",
        "雨が強そうだからです。",
        "強い雨が降りそうだからです。",
        "手伝う人がいないからです。",
        "Genannter Grund ist erwarteter Regen.",
        "雨が強そうなので"
      ],
      [
        "intent",
        "Was soll man sinnvollerweise mitbringen?",
        "本を入れる袋です。",
        "袋を持って行くと助かります。",
        "軍手が必要です。",
        "Handschuhe sind ausdrücklich nicht nötig.",
        "本を入れる袋があると助かります"
      ]
    ],
    "vocabulary": [
      [
        "整理",
        "せいり",
        "sortieren/ordnen",
        "本を整理します"
      ],
      [
        "軍手",
        "ぐんて",
        "Arbeitshandschuhe",
        "軍手は要りません"
      ]
    ],
    "notes": "Die Helferin unterscheidet langfristige Motivation, kurzfristige Terminänderung und praktische Vorbereitung.",
    "response": [
      "Sage, dass du dieses Mal beim Büchersortieren hilfst.",
      "今週は公民館で本の整理を手伝います。",
      "本を入れる袋を持って行きます。",
      "今週は公園を掃除します。",
      "Die Parkaktion wurde vertagt."
    ],
    "transfer": [
      "Andere Aktion: wegen Regen wird Spielplatzreinigung vertagt, heute werden Stühle in Halle aufgestellt. Melde dich für die Hallenarbeit.",
      "今日は体育館でいすを並べるのを手伝います。",
      "公園の代わりに体育館で手伝います。",
      "今日は公園を掃除します。",
      "Die neue Aufgabe ist innen."
    ]
  },
  {
    "id": "a2-school-presentation",
    "title": "Referat mit neuer Dauer",
    "genre": "instructions",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Eine Lehrkraft erklärt geänderte Vortragsvorgaben kurz vor dem Termin.",
    "listeningGoal": "Vorgabe, Reihenfolge und Begründung unterscheiden",
    "prediction": "Wie viel Zeit bleibt für jeden Vortrag?",
    "lines": [
      [
        "先生",
        "来週の発表について変更があります。",
        "Es gibt eine Änderung für nächste Woche."
      ],
      [
        "先生",
        "一人十分ずつ話す予定でしたが、参加者が増えたので五分にします。",
        "Statt zehn Minuten gibt es wegen mehr Teilnehmern fünf."
      ],
      [
        "先生",
        "まず、テーマを一つ説明してください。そのあと、例を一つだけ紹介してください。",
        "Zuerst ein Thema, dann nur ein Beispiel."
      ],
      [
        "先生",
        "写真を使ってもいいですが、動画は時間がかかるので使わないでください。",
        "Fotos erlaubt, Video nicht."
      ],
      [
        "学生",
        "五分でテーマと一つの例ですね。",
        "Fünf Minuten, Thema und ein Beispiel."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie lang ist der Vortrag jetzt?",
        "五分です。",
        "一人五分です。",
        "十分です。",
        "Zehn Minuten war die frühere Regel.",
        "五分にします"
      ],
      [
        "inference",
        "Warum werden Videos ausgeschlossen?",
        "時間がかかるからです。",
        "五分しかないからです。",
        "写真も禁止だからです。",
        "Fotos sind ausdrücklich erlaubt.",
        "動画は時間がかかるので使わないで"
      ],
      [
        "intent",
        "Was soll nach dem Thema präsentiert werden?",
        "例を一つです。",
        "例を一つ紹介します。",
        "三つの動画です。",
        "Die Vorgabe nennt genau ein Beispiel.",
        "そのあと、例を一つだけ紹介"
      ]
    ],
    "vocabulary": [
      [
        "参加者",
        "さんかしゃ",
        "Teilnehmende",
        "参加者が増えた"
      ],
      [
        "紹介",
        "しょうかい",
        "vorstellen",
        "例を一つ紹介"
      ]
    ],
    "notes": "Die neue Zeitgrenze ist durch mehr Teilnehmende begründet und führt zu reduzierter Komplexität.",
    "response": [
      "Bestätige die neue Präsentationsstruktur.",
      "五分でテーマを説明して、例を一つ紹介します。",
      "最初にテーマ、そのあと例を一つ話します。",
      "十分で動画を三つ見せます。",
      "Dauer und Videoeinsatz wären falsch."
    ],
    "transfer": [
      "Anderer Vortrag: drei Minuten, erst Ergebnis, dann ein Grund, keine Videos. Bestätige.",
      "三分で結果を話して、そのあと理由を一つ説明します。",
      "三分で結果と一つの理由を話します。",
      "十分で動画を見せます。",
      "Die neue Aufgabenstruktur ist anders."
    ]
  },
  {
    "id": "a2-dietary-dinner",
    "title": "Abendessen für unterschiedliche Gäste",
    "genre": "dialogue",
    "level": "A2",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "situation": "Drei Freunde planen eine Mahlzeit und ändern nach neuen Informationen das Gericht.",
    "listeningGoal": "Ernährungseinschränkungen ohne voreilige Annahmen berücksichtigen",
    "prediction": "Welche Zutat wird vermieden?",
    "lines": [
      [
        "みき",
        "土曜日、みんなでカレーを作ろうか。",
        "Samstag gemeinsam Curry kochen?"
      ],
      [
        "れい",
        "いいね。でも、なおさんは肉を食べないって言ってたよ。",
        "Gute Idee, aber Nao isst kein Fleisch."
      ],
      [
        "みき",
        "じゃ、野菜のカレーにしよう。",
        "Dann Gemüse-Curry."
      ],
      [
        "なお",
        "ありがとう。それなら食べられるよ。ただ、あまり辛くしないでね。",
        "Danke, das kann ich essen. Aber bitte nicht zu scharf."
      ],
      [
        "れい",
        "わかった。辛いものは食べる人があとで足せるようにしよう。",
        "Okay, Schärfe kann jeder später selbst hinzufügen."
      ],
      [
        "みき",
        "土曜日の六時に集まろう。",
        "Treffen wir uns Samstag um sechs."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welches Gericht wird nun zubereitet?",
        "野菜のカレーです。",
        "肉のないカレーです。",
        "肉のカレーです。",
        "Die Fleischvariante wurde geändert.",
        "野菜のカレーにしよう"
      ],
      [
        "inference",
        "Warum soll die Schärfe erst später hinzugefügt werden können?",
        "なおさんは辛いものが苦手だからです。",
        "みんなが辛さを選べるようにするためです。",
        "料理に味がないからです。",
        "Nao bittet um wenig Schärfe, andere können selbst ergänzen.",
        "あまり辛くしないで…あとで足せる"
      ],
      [
        "intent",
        "Wann kommen die Freunde zusammen?",
        "土曜日の六時です。",
        "土曜日の午後六時です。",
        "日曜日の六時です。",
        "Am Schluss wird Samstag sechs Uhr genannt.",
        "土曜日の六時に集まろう"
      ]
    ],
    "vocabulary": [
      [
        "辛い",
        "からい",
        "scharf",
        "辛いもの"
      ],
      [
        "足す",
        "たす",
        "hinzufügen",
        "あとで足せる"
      ]
    ],
    "notes": "Die Gruppe ändert erst die Fleischzutat und findet dann eine getrennte Lösung für unterschiedliche Schärfewünsche.",
    "response": [
      "Bestätige Gericht und Uhrzeit.",
      "土曜日の六時に野菜のカレーを作ります。",
      "六時に集まって、辛くない野菜のカレーを作ろう。",
      "土曜日に肉のカレーを作ります。",
      "Das würde Naos Einschränkung übergehen."
    ],
    "transfer": [
      "Andere Freunde: eine Person isst keine Milchprodukte. Schlage ein Gericht ohne Käse vor.",
      "チーズなしの料理にしよう。",
      "乳製品が入っていない料理を作ろう。",
      "チーズをたくさん入れよう。",
      "Die neue Bedingung betrifft Milchprodukte."
    ]
  },
  {
    "id": "a2-post-delivery-options",
    "title": "Drei Wege zur Paketübergabe",
    "genre": "voicemail",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Paketdienst hinterlässt eine Nachricht zur gescheiterten Zustellung.",
    "listeningGoal": "Drei mögliche Abholwege und ihre Fristen unterscheiden",
    "prediction": "Welche Option braucht eine Antwort bis heute?",
    "lines": [
      [
        "配達員",
        "お荷物についてご連絡します。今日、家にお届けしましたが、どなたもいらっしゃいませんでした。",
        "Heute Paketlieferung versucht, niemand daheim."
      ],
      [
        "配達員",
        "明日の午後二時から五時の間にもう一度お届けできます。",
        "Morgen zwischen 14 und 17 Uhr erneut möglich."
      ],
      [
        "配達員",
        "近くの店で受け取る場合は、明日の午前十時以降に来てください。",
        "Im Laden ab morgen 10 Uhr abholbar."
      ],
      [
        "配達員",
        "配達する日を変えたい方は、今日の午後八時までにお電話ください。",
        "Wer das Zustelldatum ändern möchte, muss heute bis 20 Uhr anrufen."
      ],
      [
        "配達員",
        "荷物は来週の金曜日まで保管します。",
        "Aufbewahrung bis nächsten Freitag."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann könnte erneut nach Hause geliefert werden?",
        "明日の午後二時から五時です。",
        "明日の午後です。",
        "今日の午前十時です。",
        "Der erneute Hausbesuch ist morgen Nachmittag.",
        "明日の午後二時から五時の間"
      ],
      [
        "inference",
        "Wann könnte man das Paket früher am Tag bekommen?",
        "明日の朝十時に店で受け取れます。",
        "店なら十時からです。",
        "家で朝十時に受け取れます。",
        "Hauszustellung beginnt erst um 14 Uhr, Ladenabholung schon um 10 Uhr.",
        "店で受け取る場合は、明日の午前十時以降"
      ],
      [
        "intent",
        "Was gilt bis heute 20 Uhr?",
        "配達日の変更の連絡です。",
        "配達日を変える電話です。",
        "荷物を捨てることです。",
        "20 Uhr ist die Änderungsfrist, nicht die Lagerfrist.",
        "今日の午後八時までにお電話"
      ]
    ],
    "vocabulary": [
      [
        "保管",
        "ほかん",
        "Aufbewahrung",
        "保管します"
      ],
      [
        "届ける",
        "とどける",
        "zustellen",
        "お届けできます"
      ]
    ],
    "notes": "Die letzte Frist betrifft Lagerung, nicht die heutige Änderungsfrist.",
    "response": [
      "Bitte telefonisch um Zustellung morgen Nachmittag.",
      "明日の午後にもう一度届けてください。",
      "明日の二時から五時の配達をお願いします。",
      "今日の午前十時に届けてください。",
      "Das ist nicht die angebotene Hauszustellung."
    ],
    "transfer": [
      "Neuer Dienst: Ladenabholung Freitag ab 11 Uhr, Hauszustellung erst nachmittags. Bitte um Ladenabholung.",
      "金曜日の十一時に店で受け取りたいです。",
      "金曜日の午前十一時以降に店へ行きます。",
      "明日の二時に家で受け取ります。",
      "Neue Option und Zeit sind anders."
    ]
  }
] satisfies P47RawScene[];
export const p47ScenesC=p47CorpusC.map(authoredP47Scene);
