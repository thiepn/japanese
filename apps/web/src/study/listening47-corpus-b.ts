import {authoredP47Scene,type P47RawScene} from "./listening47-types";
export const p47CorpusB= [
  {
    "id": "bus-last-stop",
    "title": "Der Bus endet früher",
    "genre": "announcement",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Im Bus wird die geänderte Endhaltestelle durchgesagt.",
    "listeningGoal": "Nicht ursprünglichen und neuen Endpunkt verwechseln",
    "prediction": "Wohin fährt der Bus jetzt wirklich?",
    "lines": [
      [
        "放送",
        "このバスは大学前まで行く予定でした。",
        "Der Bus sollte bis Universität-Vorplatz fahren."
      ],
      [
        "放送",
        "しかし、今日は工事のため、市役所前が終点です。",
        "Heute ist wegen Bauarbeiten Rathaus die Endstation."
      ],
      [
        "放送",
        "大学へ行く方は、市役所前で三番のバスに乗り換えてください。",
        "Zur Uni bitte am Rathaus in Linie drei umsteigen."
      ],
      [
        "乗客",
        "市役所で三番のバスですね。",
        "Am Rathaus also Linie drei."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wo endet dieser Bus heute?",
        "市役所前です。",
        "市役所前が終点です。",
        "大学前です。",
        "Universität war nur die ursprüngliche Route.",
        "市役所前が終点です"
      ],
      [
        "inference",
        "Was müssen Uni-Fahrgäste zusätzlich tun?",
        "三番のバスに乗り換えます。",
        "市役所で乗り換えます。",
        "そのまま座っています。",
        "Der heutige Bus erreicht die Universität nicht.",
        "三番のバスに乗り換えてください"
      ],
      [
        "intent",
        "Warum gibt es die Abweichung?",
        "工事のためです。",
        "工事があるからです。",
        "祝日のためです。",
        "Die Durchsage nennt Bauarbeiten.",
        "工事のため"
      ]
    ],
    "vocabulary": [
      [
        "終点",
        "しゅうてん",
        "Endhaltestelle",
        "終点です"
      ],
      [
        "乗り換え",
        "のりかえ",
        "Umstieg",
        "乗り換えて"
      ]
    ],
    "notes": "Zuerst wird die alte Fahrt genannt; しかし leitet die geltende Änderung ein.",
    "response": [
      "Bestätige den nötigen Umstieg.",
      "市役所前で三番のバスに乗り換えます。",
      "市役所で乗り換えます。",
      "大学前までそのまま乗ります。",
      "Der Bus fährt nicht mehr direkt dorthin."
    ],
    "transfer": [
      "Andere Buslinie endet am Bahnhof; danach Linie zwei zum Museum. Bestätige.",
      "駅で二番のバスに乗り換えます。",
      "駅で乗り換えて美術館へ行きます。",
      "市役所で三番に乗ります。",
      "Die neue Aufgabe verwendet Bahnhof und Linie zwei."
    ]
  },
  {
    "id": "bakery-after-noon",
    "title": "Brot erst am Nachmittag",
    "genre": "service",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "In einer Bäckerei ist das gewünschte Brot erst später fertig.",
    "listeningGoal": "Verfügbarkeit, Alternative und Abholzeit unterscheiden",
    "prediction": "Achte auf いま und 三時.",
    "lines": [
      [
        "客",
        "あのパンを二つください。",
        "Zwei davon bitte."
      ],
      [
        "店員",
        "すみません。今はありません。午後三時に焼き上がります。",
        "Derzeit aus. Es wird um drei fertig."
      ],
      [
        "客",
        "では、三時にまた来ます。二つ残しておいてもらえますか。",
        "Dann komme ich um drei zurück. Können Sie zwei zurücklegen?"
      ],
      [
        "店員",
        "はい、お取り置きします。",
        "Ja, wir legen sie zurück."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann wird das Brot fertig?",
        "午後三時です。",
        "三時に焼き上がります。",
        "午前九時です。",
        "Drei Uhr am Nachmittag wird genannt.",
        "午後三時に焼き上がります"
      ],
      [
        "inference",
        "Nimmt der Kunde jetzt anderes Brot mit?",
        "いいえ、あとで来ます。",
        "三時に戻ります。",
        "はい、ほかのパンを買います。",
        "Der Kunde plant Rückkehr statt Ersatzkauf.",
        "三時にまた来ます"
      ],
      [
        "intent",
        "Was bittet der Kunde die Bedienung zu tun?",
        "パンを二つ残しておくことです。",
        "二つ取り置きすることです。",
        "パンを全部売ることです。",
        "お取り置き ist Zurücklegen.",
        "二つ残しておいてもらえますか"
      ]
    ],
    "vocabulary": [
      [
        "焼き上がる",
        "やきあがる",
        "fertig gebacken werden",
        "焼き上がります"
      ],
      [
        "取り置き",
        "とりおき",
        "Zurücklegen",
        "お取り置きします"
      ]
    ],
    "notes": "Die Nachfrage betrifft eine Reservierung von zwei fertigen Stücken für später.",
    "response": [
      "Bestätige deine Rückkehr um drei.",
      "三時にまた来ます。",
      "午後三時に取りに来ます。",
      "今すぐ二つください。",
      "Das Brot ist noch nicht fertig."
    ],
    "transfer": [
      "Andere Bäckerei: Kuchen um vier fertig, bitte ein Stück zurücklegen.",
      "四時に取りに来ます。一つ残しておいてください。",
      "一つ取り置きしてもらえますか。",
      "三時にパンを二つください。",
      "Das neue Gebäck und die Uhrzeit sind anders."
    ]
  },
  {
    "id": "rain-club-venue",
    "title": "Treffen in der Sporthalle",
    "genre": "message",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Ein Verein informiert über die Verlegung wegen Regen.",
    "listeningGoal": "Wetterbedingte Ortsänderung erkennen",
    "prediction": "Ist das ursprüngliche Treffen draußen noch gültig?",
    "lines": [
      [
        "係",
        "明日のスポーツクラブは、午後四時からです。",
        "Morgen beginnt der Sportclub um vier."
      ],
      [
        "係",
        "公園で行う予定でしたが、雨の予報があるため、学校の体育館に変わりました。",
        "War im Park geplant, ist wegen Regen in die Turnhalle verlegt."
      ],
      [
        "係",
        "運動靴と水を持って来てください。",
        "Sportschuhe und Wasser mitbringen."
      ],
      [
        "係",
        "時間は変わりません。",
        "Die Zeit bleibt unverändert."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wo trifft sich der Club morgen?",
        "学校の体育館です。",
        "体育館で行います。",
        "公園です。",
        "Der Park ist der alte Ort.",
        "体育館に変わりました"
      ],
      [
        "inference",
        "Welche Information bleibt unverändert?",
        "時間です。",
        "午後四時からです。",
        "場所です。",
        "Der Ort, nicht die Uhrzeit, wird geändert.",
        "時間は変わりません"
      ],
      [
        "intent",
        "Was soll mitgebracht werden?",
        "運動靴と水です。",
        "水と運動靴を持って行きます。",
        "かばんと傘です。",
        "Der Hinweis nennt Sportschuhe und Wasser.",
        "運動靴と水を持って来てください"
      ]
    ],
    "vocabulary": [
      [
        "予報",
        "よほう",
        "Wettervorhersage",
        "雨の予報"
      ],
      [
        "体育館",
        "たいいくかん",
        "Sporthalle",
        "体育館に変わりました"
      ]
    ],
    "notes": "変更 wird hier mit 変わりました ausgedrückt; der letzte Satz grenzt ab, was sich nicht ändert.",
    "response": [
      "Bestätige neuen Ort und gleiche Uhrzeit.",
      "四時に学校の体育館へ行きます。",
      "午後四時に体育館ですね。",
      "四時に公園へ行きます。",
      "Der Park fällt als Treffpunkt weg."
    ],
    "transfer": [
      "Anderer Kurs: bei Regen Treffpunkt Bibliothek um 17 Uhr. Bestätige.",
      "五時に図書館へ行きます。",
      "雨なので、五時に図書館で会います。",
      "四時に体育館へ行きます。",
      "Es handelt sich um einen neuen Treffpunkt."
    ]
  },
  {
    "id": "teacher-room-204",
    "title": "Neuer Seminarraum",
    "genre": "announcement",
    "level": "A1",
    "units": [
      "p23:routine",
      "p26:library-project"
    ],
    "situation": "In einem Uni-Gebäude wird die Raumnummer eines Kurses geändert.",
    "listeningGoal": "Korrigierte Raumnummer hören",
    "prediction": "Achte auf die Zahlen 二〇三 und 二〇四.",
    "lines": [
      [
        "放送",
        "日本語の授業は、今日の午後一時からです。",
        "Japanischunterricht ist heute um eins."
      ],
      [
        "放送",
        "二〇三号室と書いてありますが、今日は二〇四号室です。",
        "Auf dem Plan steht Raum 203, heute ist es Raum 204."
      ],
      [
        "放送",
        "教科書とノートを持って来てください。",
        "Lehrbuch und Heft mitbringen."
      ],
      [
        "学生",
        "二〇四号室に行きます。",
        "Ich gehe in Raum 204."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welcher Raum gilt heute?",
        "二〇四号室です。",
        "二〇四号室に行きます。",
        "二〇三号室です。",
        "203 ist die veraltete Angabe.",
        "今日は二〇四号室です"
      ],
      [
        "inference",
        "Warum darf man sich nicht nur auf den Aushang verlassen?",
        "古い部屋が書いてあるからです。",
        "部屋が変わったからです。",
        "授業がなくなったからです。",
        "Der Kurs findet statt, nur in anderem Raum.",
        "二〇三号室と書いてありますが"
      ],
      [
        "intent",
        "Welche Dinge sollen Studenten mitnehmen?",
        "教科書とノートです。",
        "ノートと教科書を持って行きます。",
        "傘と水です。",
        "Zwei konkrete Lernmaterialien werden genannt.",
        "教科書とノートを持って来てください"
      ]
    ],
    "vocabulary": [
      [
        "号室",
        "ごうしつ",
        "Raumnummer",
        "二〇四号室"
      ],
      [
        "教科書",
        "きょうかしょ",
        "Lehrbuch",
        "教科書とノート"
      ]
    ],
    "notes": "Eine sichtbare Raumnummer kann veraltet sein. Das gesprochene 今日は liefert die tagesaktuelle Ausnahme.",
    "response": [
      "Sage, dass du zu Raum 204 gehst.",
      "二〇四号室に行きます。",
      "今日の授業は二〇四号室ですね。",
      "二〇三号室に行きます。",
      "Die Nummer wurde korrigiert."
    ],
    "transfer": [
      "Anderer Kurs: alter Raum 305, neuer Raum 306. Bestätige den neuen.",
      "三〇六号室に行きます。",
      "今日は三〇六号室ですね。",
      "二〇四号室に行きます。",
      "Es ist ein anderer Raumwechsel."
    ]
  },
  {
    "id": "museum-last-entry",
    "title": "Letzter Einlass am Museum",
    "genre": "announcement",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Eine Ansage nennt Schließzeit und letzten Einlass.",
    "listeningGoal": "Einlass von tatsächlicher Schließzeit unterscheiden",
    "prediction": "Achte auf die zwei Uhrzeiten.",
    "lines": [
      [
        "案内",
        "本日の美術館は午後五時に閉まります。",
        "Heute schließt das Museum um fünf."
      ],
      [
        "案内",
        "新しく入れるのは午後四時半までです。",
        "Neu hineinkommen darf man bis halb fünf."
      ],
      [
        "案内",
        "二階の特別展示は午後四時に終わります。",
        "Die Sonderausstellung oben endet schon um vier."
      ],
      [
        "案内",
        "ご協力をお願いします。",
        "Vielen Dank für Ihre Mithilfe."
      ]
    ],
    "questions": [
      [
        "detail",
        "Bis wann kann man neu ins Museum hinein?",
        "午後四時半までです。",
        "四時半まで入れます。",
        "午後五時までです。",
        "Fünf Uhr ist die Schließzeit, nicht der Einlass.",
        "午後四時半までです"
      ],
      [
        "inference",
        "Kann ein Besucher um 16:30 die Sonderausstellung sehen?",
        "いいえ、終わっています。",
        "特別展示はもう終わっています。",
        "はい、五時までです。",
        "Sonderausstellung endet bereits um vier.",
        "特別展示は午後四時に終わります"
      ],
      [
        "intent",
        "Welche Information unterscheidet die Ansage ausdrücklich?",
        "入る時間と閉まる時間です。",
        "最終入場と閉館時間です。",
        "バスの時間です。",
        "Es sind verschiedene Museumstermine.",
        "五時に閉まります…四時半まで"
      ]
    ],
    "vocabulary": [
      [
        "展示",
        "てんじ",
        "Ausstellung",
        "特別展示"
      ],
      [
        "閉まる",
        "しまる",
        "schließen",
        "午後五時に閉まります"
      ]
    ],
    "notes": "Einlass, Programmschluss und Gebäudeschluss bilden drei unterschiedliche zeitliche Grenzen.",
    "response": [
      "Sage, dass du vor halb fünf hineingehen willst.",
      "四時半までに入ります。",
      "四時に美術館に入ります。",
      "五時半に入ります。",
      "Dann wäre das Museum schon geschlossen."
    ],
    "transfer": [
      "Neue Galerie: letzter Einlass 17 Uhr, Schließung 18 Uhr. Nenne den letzten Einlass.",
      "五時までに入ります。",
      "午後五時が最後の入場です。",
      "六時に入ります。",
      "Die Schließzeit ist später als der Einlass."
    ]
  },
  {
    "id": "parcel-pickup-id",
    "title": "Paket nur mit Ausweis",
    "genre": "service",
    "level": "A1",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Am Paketschalter wird die fehlende Voraussetzung zur Abholung erklärt.",
    "listeningGoal": "Erkennen, warum eine sofortige Abholung nicht klappt",
    "prediction": "Was muss die Kundin noch mitbringen?",
    "lines": [
      [
        "客",
        "すみません。荷物を取りに来ました。これが紙です。",
        "Ich möchte ein Paket abholen. Hier ist der Schein."
      ],
      [
        "係",
        "ありがとうございます。身分証はありますか。",
        "Danke. Haben Sie einen Ausweis?"
      ],
      [
        "客",
        "今日は持っていません。",
        "Heute nicht dabei."
      ],
      [
        "係",
        "では、明日、身分証とこの紙を持って来てください。午前九時から開いています。",
        "Dann morgen Ausweis und Schein mitbringen. Ab 9 Uhr geöffnet."
      ],
      [
        "客",
        "わかりました。明日の朝に来ます。",
        "Verstanden, ich komme morgen früh."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welches Dokument fehlt?",
        "身分証です。",
        "身分証を持っていません。",
        "紙です。",
        "Den Schein hat die Person bereits gezeigt.",
        "身分証はありますか"
      ],
      [
        "inference",
        "Kann sie das Paket heute abholen?",
        "いいえ、できません。",
        "明日また来ます。",
        "はい、今受け取ります。",
        "Sie muss den Ausweis erst mitbringen.",
        "明日、身分証とこの紙を持って来てください"
      ],
      [
        "intent",
        "Ab wann ist die Stelle morgen geöffnet?",
        "午前九時からです。",
        "九時に開きます。",
        "午後九時です。",
        "九時 am Vormittag wird genannt.",
        "午前九時から開いています"
      ]
    ],
    "vocabulary": [
      [
        "身分証",
        "みぶんしょう",
        "Ausweis",
        "身分証とこの紙"
      ],
      [
        "荷物",
        "にもつ",
        "Paket/Gepäck",
        "荷物を取りに"
      ]
    ],
    "notes": "Die Bitte nennt beide Unterlagen: den fehlenden Ausweis und den vorhandenen Abholschein.",
    "response": [
      "Bestätige Rückkehr morgen mit den Papieren.",
      "明日、身分証と紙を持って来ます。",
      "明日の朝、取りに来ます。",
      "今日、身分証なしで受け取ります。",
      "Die Voraussetzung ist nicht erfüllt."
    ],
    "transfer": [
      "Anderes Paket: Abholung Freitag mit Ausweis. Formuliere die Rückkehr.",
      "金曜日に身分証を持って来ます。",
      "金曜日に取りに来ます。",
      "明日、紙だけ持って来ます。",
      "Die neue Bedingung nennt Freitag und Ausweis."
    ]
  },
  {
    "id": "soup-instructions",
    "title": "Gemüsesuppe in Schritten",
    "genre": "instructions",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "situation": "In einem Kochkurs erklärt jemand die Reihenfolge für eine einfache Suppe.",
    "listeningGoal": "Die Handlungsreihenfolge hörend nachvollziehen",
    "prediction": "Höre auf まず, 次に und 最後に.",
    "lines": [
      [
        "先生",
        "まず、にんじんとじゃがいもを小さく切ります。",
        "Zuerst Karotte und Kartoffel klein schneiden."
      ],
      [
        "先生",
        "次に、なべに水を入れて、野菜を煮ます。",
        "Dann Wasser in Topf, Gemüse kochen."
      ],
      [
        "先生",
        "十分ぐらいたったら、塩を少し入れます。",
        "Nach etwa zehn Minuten etwas Salz dazu."
      ],
      [
        "先生",
        "最後に、火を止めてください。",
        "Zum Schluss den Herd ausschalten."
      ],
      [
        "生徒",
        "塩は野菜のあとですね。",
        "Das Salz kommt nach dem Gemüse."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was macht man als Erstes?",
        "野菜を切ります。",
        "にんじんとじゃがいもを切ります。",
        "塩を入れます。",
        "Salz kommt erst später.",
        "まず、にんじんとじゃがいもを"
      ],
      [
        "inference",
        "Wann wird Salz hinzugefügt?",
        "十分ぐらいあとです。",
        "野菜を煮てからです。",
        "火をつける前です。",
        "Zehn Minuten später, nach dem Kochen.",
        "十分ぐらいたったら、塩を少し入れます"
      ],
      [
        "intent",
        "Was ist der allerletzte Schritt?",
        "火を止めます。",
        "火を止めてください。",
        "野菜を切ります。",
        "Das Schneiden findet ganz zu Beginn statt.",
        "最後に、火を止めてください"
      ]
    ],
    "vocabulary": [
      [
        "煮る",
        "にる",
        "kochen/sieden",
        "野菜を煮ます"
      ],
      [
        "最後",
        "さいご",
        "am Schluss",
        "最後に"
      ]
    ],
    "notes": "まず / 次に / 最後に strukturieren einen Prozess; die Reihenfolge ist lernrelevant.",
    "response": [
      "Formuliere den abschließenden Arbeitsschritt.",
      "最後に火を止めます。",
      "火を止めてください。",
      "最後ににんじんを切ります。",
      "Das Schneiden ist der erste Schritt."
    ],
    "transfer": [
      "Andere Anleitung: Zuerst Reis waschen, dann kochen. Beschreibe die Reihenfolge.",
      "まず米を洗って、次に炊きます。",
      "米を洗ってから炊きます。",
      "まず塩を入れて火を止めます。",
      "Eine andere Abfolge ist gefordert."
    ]
  },
  {
    "id": "umbrella-lost-school",
    "title": "Ein Regenschirm mit blauem Griff",
    "genre": "dialogue",
    "level": "A1",
    "units": [
      "p23:routine",
      "p26:library-project"
    ],
    "situation": "Ein Schüler fragt im Sekretariat nach einem verlorenen Regenschirm.",
    "listeningGoal": "Gegenstand anhand zweier Merkmale unterscheiden",
    "prediction": "Höre auf Farbe und Griff.",
    "lines": [
      [
        "生徒",
        "昨日、学校に傘を忘れました。",
        "Ich habe gestern meinen Regenschirm in der Schule vergessen."
      ],
      [
        "先生",
        "黒い傘がありますよ。これですか。",
        "Hier ist ein schwarzer. Dieser?"
      ],
      [
        "生徒",
        "私の傘も黒いですが、持つところが青いです。",
        "Meiner ist auch schwarz, aber der Griff ist blau."
      ],
      [
        "先生",
        "ああ、こちらですね。青いところがあります。",
        "Ah, dieser hier. Hier ist eine blaue Stelle."
      ],
      [
        "生徒",
        "はい、それです。ありがとうございます。",
        "Ja, der ist es. Danke."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Farbe hat der Regenschirm selbst?",
        "黒いです。",
        "黒い傘です。",
        "赤いです。",
        "Der Schirm ist schwarz.",
        "私の傘も黒いですが"
      ],
      [
        "inference",
        "Wodurch kann die richtige Person unterschieden werden?",
        "持つところが青いことです。",
        "青い持ち手です。",
        "傘が赤いことです。",
        "Der Griff, nicht der Schirmkörper, ist blau.",
        "持つところが青いです"
      ],
      [
        "intent",
        "Was bestätigt der Schüler am Ende?",
        "自分の傘だということです。",
        "この傘が自分の傘です。",
        "新しい傘を買うことです。",
        "Es geht um Rückgabe eines Fundstücks.",
        "はい、それです"
      ]
    ],
    "vocabulary": [
      [
        "忘れる",
        "わすれる",
        "vergessen",
        "傘を忘れました"
      ],
      [
        "持つところ",
        "もつところ",
        "Griff",
        "持つところが青い"
      ]
    ],
    "notes": "〜も〜ですが markiert ein gemeinsames Merkmal und den danach folgenden entscheidenden Unterschied.",
    "response": [
      "Beschreibe den richtigen Schirm noch einmal.",
      "黒い傘で、持つところは青いです。",
      "黒くて青い持ち手の傘です。",
      "赤い傘です。",
      "Die Farbe und der Griff passen nicht."
    ],
    "transfer": [
      "Anderer Schirm: rot mit weißem Griff. Beschreibe ihn.",
      "赤い傘で、持つところは白いです。",
      "白い持ち手の赤い傘です。",
      "黒い傘で持つところが青いです。",
      "Die Merkmale der alten Geschichte gelten nicht."
    ]
  }
] satisfies P47RawScene[];
export const p47ScenesB=p47CorpusB.map(authoredP47Scene);
