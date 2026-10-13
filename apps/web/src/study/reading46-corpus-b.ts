import {authoredP46Reading,type P46RawReading} from "./reading46-types";
/** Six original A1 reading pieces with growing temporal and causal reasoning. */
export const p46CorpusB = [
  {
    "id": "part-time-shift",
    "genre": "email",
    "level": "A1",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "アルバイトの時間",
    "purpose": "Arbeitszeiten und eine Änderung aus einer Mail erkennen",
    "setting": "Nachricht an eine Teilzeitkraft",
    "paragraphs": [
      "山田さんへ。今週のアルバイトについて連絡します。月曜日と水曜日は午後五時から九時まで働いてください。金曜日はお店が休みなので、来なくてもいいです。",
      "ただし、水曜日だけはお店の会議があります。仕事の前、午後四時半に来てください。会議が終わったら、いつもどおり五時から仕事を始めます。よろしくお願いします。店長より"
    ],
    "words": [
      [
        "働く",
        "はたらく",
        "arbeiten",
        "九時まで働いて"
      ],
      [
        "店長",
        "てんちょう",
        "Filialleitung",
        "店長より"
      ],
      [
        "会議",
        "かいぎ",
        "Besprechung",
        "お店の会議"
      ],
      [
        "いつもどおり",
        "いつもどおり",
        "wie gewohnt",
        "いつもどおり五時"
      ]
    ],
    "contextNote": "Bei Arbeitsnachrichten zwischen Vorgesetzten und Beschäftigten können besondere Vorbereitungszeiten von der eigentlichen Schicht getrennt sein.",
    "questions": [
      [
        "detail",
        "An welchem Tag ist das Geschäft geschlossen?",
        "金曜日です。",
        "金曜日は休みです。",
        "水曜日です。",
        "Mittwochs gibt es gerade eine Besprechung.",
        "金曜日はお店が休み"
      ],
      [
        "inference",
        "Warum soll Yamada am Mittwoch früher kommen?",
        "会議があるからです。",
        "四時半から会議に出るためです。",
        "仕事が四時半に始まるからです。",
        "Die reguläre Arbeit beginnt weiterhin um fünf.",
        "仕事の前、午後四時半に来てください"
      ],
      [
        "purpose",
        "Wann beginnt die normale Arbeit am Mittwoch?",
        "午後五時です。",
        "五時からです。",
        "午後四時半です。",
        "4:30 ist die Besprechung, nicht der Schichtbeginn.",
        "いつもどおり五時から仕事を始めます"
      ]
    ],
    "writing": [
      "Antworte höflich, dass du Mittwoch um 16:30 kommst.",
      "水曜日の四時半に行きます。",
      "水曜日は午後四時半に伺います。",
      "金曜日の四時半に行きます。",
      "Freitag ist arbeitsfrei."
    ],
    "returnCue": [
      "Neue Schicht: Dienstag regulär ab 18 Uhr, Treffen um 17:30. Bestätige die Ankunft.",
      "火曜日の五時半に行きます。",
      "火曜日は午後五時半に伺います。",
      "火曜日の六時半に行きます。",
      "Du sollst schon vor der Schicht da sein."
    ]
  },
  {
    "id": "secondhand-bike",
    "genre": "review",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "自転車のレビュー",
    "purpose": "Eine Produktbewertung verstehen",
    "setting": "Rezension eines gebrauchten Fahrrads",
    "paragraphs": [
      "先週、中古の自転車を買いました。値段は八千円でした。色は青くて、少し古いですが、軽いです。毎朝、この自転車で大学に行っています。歩くと三十分かかりますが、自転車では十五分です。",
      "一つ困っていることがあります。雨の日はブレーキの音が大きいです。今度、自転車屋さんで見てもらいます。それでも、今は買ってよかったと思っています。"
    ],
    "words": [
      [
        "中古",
        "ちゅうこ",
        "gebraucht",
        "中古の自転車"
      ],
      [
        "軽い",
        "かるい",
        "leicht",
        "軽いです"
      ],
      [
        "困る",
        "こまる",
        "Probleme haben",
        "困っている"
      ],
      [
        "見てもらう",
        "みてもらう",
        "prüfen lassen",
        "自転車屋さんで見てもらいます"
      ]
    ],
    "contextNote": "Eine Rezension kann positive und negative Punkte enthalten; ein Kritikpunkt bedeutet nicht zwingend eine insgesamt negative Empfehlung.",
    "questions": [
      [
        "detail",
        "Wie viel kostet das Fahrrad?",
        "八千円です。",
        "八千円でした。",
        "一万五千円です。",
        "15 ist die Fahrtdauer in Minuten.",
        "値段は八千円でした"
      ],
      [
        "inference",
        "Wie viel Zeit spart die Person auf dem Weg zur Uni?",
        "十五分です。",
        "十五分短くなります。",
        "三十分です。",
        "Zu Fuß sind es 30, mit Rad 15 Minuten.",
        "歩くと三十分…自転車では十五分"
      ],
      [
        "purpose",
        "Warum soll der Fahrradladen besucht werden?",
        "ブレーキの音が大きいからです。",
        "ブレーキを見てもらうためです。",
        "青い色を変えるためです。",
        "Die Farbe wird nicht als Problem beschrieben.",
        "雨の日はブレーキの音が大きいです"
      ]
    ],
    "writing": [
      "Schreibe einen Satz über den Zeitvorteil des Fahrrads.",
      "自転車では十五分で大学に行けます。",
      "歩くより自転車のほうが早いです。",
      "自転車では三十分かかります。",
      "30 Minuten ist die Gehzeit."
    ],
    "returnCue": [
      "Neues Fahrrad: Der Schulweg dauert 10 statt 25 Minuten. Beschreibe den Zeitvorteil.",
      "自転車なら十分で行けます。",
      "歩くより十五分早いです。",
      "自転車では二十五分かかります。",
      "25 Minuten gelten für den Fußweg."
    ]
  },
  {
    "id": "guest-house-rules",
    "genre": "notice",
    "level": "A1",
    "units": [
      "p25:appointment",
      "p25:shopping"
    ],
    "title": "ゲストハウスのルール",
    "purpose": "Regeln und Ausnahmen erkennen",
    "setting": "Aushang in einer Unterkunft",
    "paragraphs": [
      "ゲストハウス「あおい」へようこそ。チェックインは午後三時から、チェックアウトは午前十時までです。夜十時から朝七時までは静かにしてください。部屋でたばこを吸ってはいけません。",
      "朝ご飯は一階のキッチンで七時半から九時まで食べられます。タオルは部屋にありますが、歯ブラシは受付で買ってください。チェックアウトのとき、鍵を受付に返してください。"
    ],
    "words": [
      [
        "受付",
        "うけつけ",
        "Rezeption",
        "受付で買って"
      ],
      [
        "静か",
        "しずか",
        "leise",
        "静かにしてください"
      ],
      [
        "返す",
        "かえす",
        "zurückgeben",
        "鍵を受付に返して"
      ],
      [
        "歯ブラシ",
        "はぶらし",
        "Zahnbürste",
        "歯ブラシは受付で"
      ]
    ],
    "contextNote": "Ein Hotel-Aushang benutzt oft てください für Anweisungen und てはいけません für Verbote; die Zeiten haben unterschiedliche Funktionen.",
    "questions": [
      [
        "detail",
        "Bis wann muss man auschecken?",
        "午前十時までです。",
        "十時までにチェックアウトします。",
        "午後三時までです。",
        "15 Uhr ist Check-in-Beginn.",
        "チェックアウトは午前十時まで"
      ],
      [
        "inference",
        "Wo bekommt man eine Zahnbürste?",
        "受付で買えます。",
        "受付で買います。",
        "部屋にあります。",
        "Im Zimmer sind Handtücher; Zahnbürsten gibt es an der Rezeption.",
        "歯ブラシは受付で買ってください"
      ],
      [
        "purpose",
        "Was muss beim Auschecken abgegeben werden?",
        "鍵です。",
        "鍵を返します。",
        "タオルを買います。",
        "Der Aushang nennt ausdrücklich die Schlüsselrückgabe.",
        "鍵を受付に返してください"
      ]
    ],
    "writing": [
      "Schreibe eine kurze Anweisung: Bitte gib den Schlüssel an der Rezeption ab.",
      "鍵を受付に返してください。",
      "チェックアウトのとき鍵を返してください。",
      "鍵を部屋に置いてください。",
      "Der Schlüssel soll zur Rezeption zurück."
    ],
    "returnCue": [
      "Andere Unterkunft: Frühstück von 8 bis 10 Uhr. Schreibe diese Information.",
      "朝ご飯は八時から十時までです。",
      "朝食は午前八時から十時までです。",
      "朝ご飯は七時半から九時までです。",
      "Die neuen Zeiten weichen ab."
    ]
  },
  {
    "id": "friend-recipe",
    "genre": "instructions",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p23:routine"
    ],
    "title": "かんたんな朝ご飯",
    "purpose": "Anleitung in zeitlicher Reihenfolge lesen",
    "setting": "Ein kurzes Rezept von einem Freund",
    "paragraphs": [
      "私の好きな朝ご飯は、卵と野菜のパンです。まず、トマトを小さく切ります。次に、卵を一つ皿に入れて、よく混ぜます。フライパンで卵を焼きます。火は強くしないでください。",
      "卵ができたら、パンの上に卵とトマトをのせます。少し塩をかけてもいいです。チーズが好きな人は、チーズものせてください。私は朝、お茶といっしょに食べています。"
    ],
    "words": [
      [
        "まず",
        "まず",
        "zuerst",
        "まず、トマトを"
      ],
      [
        "次に",
        "つぎに",
        "danach",
        "次に、卵を"
      ],
      [
        "混ぜる",
        "まぜる",
        "mischen",
        "よく混ぜます"
      ],
      [
        "焼く",
        "やく",
        "braten/backen",
        "卵を焼きます"
      ]
    ],
    "contextNote": "Die Reihenfolge in einer Anleitung wird mit まず, 次に und たら markiert. Die Ergänzung von Käse ist ausdrücklich optional.",
    "questions": [
      [
        "detail",
        "Was wird zuerst klein geschnitten?",
        "トマトです。",
        "トマトを切ります。",
        "パンです。",
        "Der erste Schritt nennt Tomaten.",
        "まず、トマトを小さく切ります"
      ],
      [
        "inference",
        "Muss jeder Käse hinzufügen?",
        "いいえ、好きな人だけです。",
        "いいえ、チーズは自由です。",
        "はい、必ず入れます。",
        "Käse wird nur für Menschen empfohlen, die ihn mögen.",
        "チーズが好きな人は"
      ],
      [
        "purpose",
        "Wann legt man Ei und Tomate auf das Brot?",
        "卵ができたらです。",
        "卵を焼いたあとです。",
        "卵を混ぜる前です。",
        "Zuerst wird das Ei gebraten.",
        "卵ができたら、パンの上に"
      ]
    ],
    "writing": [
      "Formuliere eine kleine Anweisung: Schneide zuerst die Tomate.",
      "まず、トマトを切ってください。",
      "最初にトマトを小さく切ります。",
      "まず、チーズを焼いてください。",
      "Der erste Arbeitsschritt betrifft Tomaten."
    ],
    "returnCue": [
      "Neues Rezept: Zuerst Zwiebeln schneiden, dann Reis braten. Beschreibe die Reihenfolge.",
      "まず、玉ねぎを切ります。次に、ご飯を炒めます。",
      "玉ねぎを切ってから、ご飯を炒めます。",
      "まず、ご飯を食べます。",
      "Der neue Ablauf beginnt mit dem Schneiden."
    ]
  },
  {
    "id": "dog-walk-story",
    "genre": "story",
    "level": "A1",
    "units": [
      "p23:past",
      "p23:plans"
    ],
    "title": "犬と小さい公園",
    "purpose": "Eine einfache Erzählung mit Ursache und Ergebnis",
    "setting": "Kurze eigene Lerngeschichte",
    "paragraphs": [
      "日曜日の朝、ゆうとは犬のモモと公園に行きました。公園はいつも静かですが、その日は人がたくさんいました。小さい子どもたちがサッカーをしていたからです。モモは大きい音が少し苦手です。",
      "ゆうとは公園の中で走らないで、川の近くの道をゆっくり歩きました。そこで白い花を見つけました。モモも元気になりました。帰り道でゆうとは「今日は別の道を歩いてよかった」と思いました。"
    ],
    "words": [
      [
        "苦手",
        "にがて",
        "nicht gut vertragen",
        "音が少し苦手"
      ],
      [
        "川",
        "かわ",
        "Fluss",
        "川の近く"
      ],
      [
        "道",
        "みち",
        "Weg",
        "近くの道"
      ],
      [
        "見つける",
        "みつける",
        "finden",
        "花を見つけました"
      ]
    ],
    "contextNote": "Der Grund für eine Handlung kann über den vorherigen Satz erschlossen werden, auch wenn er nicht unmittelbar neben der Handlung steht.",
    "questions": [
      [
        "detail",
        "Warum war der Park lauter als üblich?",
        "子どもたちがサッカーをしていたからです。",
        "サッカーをしている子どもが多かったからです。",
        "犬がたくさんいたからです。",
        "Der Text nennt Fußball spielende Kinder als Grund.",
        "小さい子どもたちがサッカーをしていたからです"
      ],
      [
        "inference",
        "Warum wählte Yuto den Weg am Fluss?",
        "モモは大きい音が苦手だからです。",
        "静かな道を歩きたかったからです。",
        "モモはサッカーが好きだからです。",
        "Momo verträgt laute Geräusche schlecht.",
        "モモは大きい音が少し苦手です"
      ],
      [
        "purpose",
        "Wie bewertet Yuto den anderen Weg am Ende?",
        "よかったと思いました。",
        "別の道を歩いてよかったです。",
        "道が悪かったと思いました。",
        "Die Schlussbemerkung ist ausdrücklich positiv.",
        "別の道を歩いてよかった"
      ]
    ],
    "writing": [
      "Erkläre in einem Satz, warum sie nicht im Park liefen.",
      "モモは大きい音が苦手だからです。",
      "公園は人が多くて、うるさかったからです。",
      "モモは走るのが速いからです。",
      "Laufgeschwindigkeit ist nicht der genannte Grund."
    ],
    "returnCue": [
      "Andere Geschichte: Ein Hund hat Angst vor Regen, deshalb geht sein Besitzer nach Hause. Erkläre den Grund.",
      "犬は雨が苦手なので、家に帰りました。",
      "雨がこわいから帰りました。",
      "犬は雨が好きなので帰りました。",
      "Die neue Ursache ist Angst vor Regen."
    ]
  },
  {
    "id": "weekend-timetable",
    "genre": "schedule",
    "level": "A1",
    "units": [
      "p25:transport",
      "p23:plans"
    ],
    "title": "週末のバスの時刻",
    "purpose": "Wochenendfahrplan und Umstieg lesen",
    "setting": "Kleiner Fahrplan mit Hinweis",
    "paragraphs": [
      "駅から山の公園へ行くバスは、土曜日に朝九時と十一時に出ます。日曜日は朝十時に一本だけ出ます。公園まで四十分かかります。帰りのバスは午後三時と五時です。",
      "今月の最後の日曜日だけは、道路の工事があります。その日は午前十時のバスがありません。山の公園に行きたい人は、土曜日のバスを使ってください。"
    ],
    "words": [
      [
        "一本",
        "いっぽん",
        "ein Fahrzeug in dieser Reihe",
        "一本だけ出ます"
      ],
      [
        "工事",
        "こうじ",
        "Baustelle",
        "道路の工事"
      ],
      [
        "帰り",
        "かえり",
        "Rückweg",
        "帰りのバス"
      ],
      [
        "最後",
        "さいご",
        "letzter",
        "最後の日曜日"
      ]
    ],
    "contextNote": "Fahrpläne können Sonderregeln für bestimmte Tage enthalten; die Sonderregel hat hier Vorrang vor der normalen Sonntagsangabe.",
    "questions": [
      [
        "detail",
        "Wie oft fährt der Bus samstags morgens zum Park?",
        "二回です。",
        "九時と十一時の二本です。",
        "一回です。",
        "Die einzelne Fahrt betrifft den normalen Sonntag.",
        "土曜日に朝九時と十一時"
      ],
      [
        "inference",
        "Kann man am letzten Sonntag dieses Monats um 10 Uhr fahren?",
        "いいえ、できません。",
        "いいえ、その日はバスがありません。",
        "はい、十時に出ます。",
        "Die Sonderregel streicht genau diese Fahrt.",
        "最後の日曜日…十時のバスがありません"
      ],
      [
        "purpose",
        "Welchen Tag empfiehlt der Hinweis stattdessen?",
        "土曜日です。",
        "土曜日のバスです。",
        "月曜日です。",
        "Die Empfehlung ist ausdrücklich Samstag.",
        "土曜日のバスを使ってください"
      ]
    ],
    "writing": [
      "Schreibe: Am Samstag fährt ein Bus um neun und um elf.",
      "土曜日は九時と十一時にバスが出ます。",
      "土曜日のバスは九時と十一時です。",
      "日曜日は九時と十一時です。",
      "Die beiden Zeiten gehören zum Samstag."
    ],
    "returnCue": [
      "Neuer Fahrplan: Freitags Busse um 8 und 12 Uhr. Schreibe die Zeiten.",
      "金曜日は八時と十二時にバスが出ます。",
      "金曜日のバスは八時と十二時です。",
      "土曜日は九時と十一時です。",
      "Die neuen Zeiten und der Tag unterscheiden sich."
    ]
  }
] satisfies P46RawReading[];
export const p46ReadingsB=p46CorpusB.map(authoredP46Reading);
