import {authoredP46Reading,type P46RawReading} from "./reading46-types";
/** Six substantial original A2 organizational and documentary readings. */
export const p46CorpusC = [
  {
    "id": "library-reading-group",
    "genre": "email",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "読書会の予定変更",
    "purpose": "Terminänderung und Vorbereitung aus einer E-Mail kombinieren",
    "setting": "Mail der Bibliothek an angemeldete Teilnehmende",
    "paragraphs": [
      "読書会に申し込んだ皆さんへ。来週の読書会についてお知らせします。もともと木曜日の午後六時から会議室で行う予定でしたが、その部屋が工事で使えなくなりました。そのため、金曜日の午後五時から図書館の二階で行います。参加するために、もう一度申し込む必要はありません。",
      "今週読む本は『小さな町の朝』です。全部読めなくても大丈夫ですが、最初の二十ページは読んできてください。好きな場面を一つ選び、その理由を簡単に話してもらいます。質問がある方は水曜日までにメールを送ってください。"
    ],
    "words": [
      [
        "申し込む",
        "もうしこむ",
        "sich anmelden",
        "読書会に申し込んだ"
      ],
      [
        "予定",
        "よてい",
        "Plan",
        "行う予定でした"
      ],
      [
        "場面",
        "ばめん",
        "Szene",
        "好きな場面"
      ],
      [
        "理由",
        "りゆう",
        "Grund",
        "その理由"
      ]
    ],
    "contextNote": "Die Nachricht ändert Zeitpunkt und Ort, aber nicht den Anmeldestatus. Das ist eine typische Lesefalle bei Organisationsmails.",
    "questions": [
      [
        "detail",
        "Wann und wo findet der neue Lesekreis statt?",
        "金曜日の午後五時に図書館の二階です。",
        "金曜日の五時から二階です。",
        "木曜日の午後六時です。",
        "Donnerstag ist der ursprüngliche Termin.",
        "金曜日の午後五時から図書館の二階で行います"
      ],
      [
        "inference",
        "Muss sich jemand erneut anmelden?",
        "いいえ、必要ありません。",
        "申し込み直さなくてもいいです。",
        "はい、もう一度申し込みます。",
        "Die Nachricht sagt ausdrücklich, dass es nicht nötig ist.",
        "もう一度申し込む必要はありません"
      ],
      [
        "purpose",
        "Was sollen Teilnehmende außer Lesen vorbereiten?",
        "好きな場面とその理由です。",
        "好きな場面を一つ選びます。",
        "全部の本の翻訳です。",
        "Gefragt ist eine Lieblingsszene mit Begründung.",
        "好きな場面を一つ選び、その理由を"
      ]
    ],
    "writing": [
      "Schreibe eine höfliche Antwort: Ich komme am Freitag um fünf.",
      "金曜日の五時に参加します。",
      "金曜日の午後五時に行きます。",
      "木曜日の六時に行きます。",
      "Die Veranstaltung wurde auf Freitag verlegt."
    ],
    "returnCue": [
      "Andere Gruppe: Treffen von Dienstag auf Mittwoch um 18 Uhr verlegt. Bestätige den neuen Termin.",
      "水曜日の午後六時に参加します。",
      "水曜日の六時ですね。よろしくお願いします。",
      "火曜日の午後六時に参加します。",
      "Dienstag ist nur der alte Termin."
    ]
  },
  {
    "id": "town-recycling",
    "genre": "notice",
    "level": "A2",
    "units": [
      "p23:routine",
      "p25:shopping"
    ],
    "title": "町のごみの出し方",
    "purpose": "Mehrere Kategorien und Ausnahmen aus Regeln entnehmen",
    "setting": "Informationsblatt der Gemeinde",
    "paragraphs": [
      "この町では、ごみを出す曜日が種類によって違います。紙は月曜日、プラスチックは水曜日、びんと缶は金曜日の朝八時までに出してください。袋は決められた場所に置きます。前の日の夜には出さないでください。",
      "来月の第一月曜日は祝日なので、紙の回収は火曜日になります。ただし、プラスチックとびん・缶の曜日は変わりません。大きい家具を捨てるときは、先に市役所に連絡して、回収の日を決めてください。"
    ],
    "words": [
      [
        "種類",
        "しゅるい",
        "Art/Kategorie",
        "種類によって"
      ],
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
        "祝日なので"
      ],
      [
        "家具",
        "かぐ",
        "Möbel",
        "大きい家具"
      ]
    ],
    "contextNote": "Dies ist ein frei erfundenes kommunales Beispiel, keine real geltende lokale Mülltrennungsregel; Sondertermine müssen immer aus dem konkreten Hinweis gelesen werden.",
    "questions": [
      [
        "detail",
        "Wann muss Glas normalerweise bereitstehen?",
        "金曜日の朝八時までです。",
        "金曜日の八時までに出します。",
        "水曜日の朝八時までです。",
        "Mittwoch gilt für Plastik.",
        "びんと缶は金曜日の朝八時まで"
      ],
      [
        "inference",
        "Wann ist die Papierabholung am ersten Montag des nächsten Monats?",
        "火曜日です。",
        "次の火曜日になります。",
        "月曜日のままです。",
        "Der erste Montag ist Feiertag; deshalb Verschiebung.",
        "第一月曜日は祝日なので、紙の回収は火曜日"
      ],
      [
        "purpose",
        "Was muss man für große Möbel zuerst machen?",
        "市役所に連絡します。",
        "回収の日を市役所と決めます。",
        "金曜日に袋に入れます。",
        "Große Möbel brauchen vorherige Absprache.",
        "先に市役所に連絡して"
      ]
    ],
    "writing": [
      "Formuliere die Ausnahme: Nächsten Monat wird Papier am Dienstag abgeholt.",
      "来月は紙を火曜日に回収します。",
      "来月の第一週は火曜日に紙を出します。",
      "来月はプラスチックを火曜日に回収します。",
      "Die Sonderregel betrifft Papier, nicht Plastik."
    ],
    "returnCue": [
      "Neuer erfundener Hinweis: Plastik wird ausnahmsweise Donnerstag statt Mittwoch gesammelt. Gib das an.",
      "プラスチックは木曜日に出してください。",
      "今週のプラスチックの回収は木曜日です。",
      "水曜日に出してください。",
      "Die neue Ausnahmeregel nennt Donnerstag."
    ]
  },
  {
    "id": "community-garden",
    "genre": "article",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:library-project"
    ],
    "title": "町の小さな畑",
    "purpose": "Ursache, Beteiligung und Ergebnis in einem Bericht verstehen",
    "setting": "Kurzer lokaler Magazintext",
    "paragraphs": [
      "駅の近くにある小さな空き地は、去年まで何もありませんでした。春に近所の人たちが集まり、そこで野菜を育て始めました。最初は水やりをする人が少なく、野菜があまり大きくなりませんでした。しかし、子どもたちが学校のあとで手伝うようになりました。",
      "今ではトマトやきゅうりがたくさんできます。土曜日にはみんなで野菜を分けて食べます。そこで知り合った人も多く、近所の人同士の会話が増えました。来年は小さいベンチを置いて、野菜を育てない人も休める場所にしたいそうです。"
    ],
    "words": [
      [
        "空き地",
        "あきち",
        "freies Grundstück",
        "小さな空き地"
      ],
      [
        "育てる",
        "そだてる",
        "anbauen/aufziehen",
        "野菜を育て"
      ],
      [
        "水やり",
        "みずやり",
        "Gießen",
        "水やりをする人"
      ],
      [
        "近所",
        "きんじょ",
        "Nachbarschaft",
        "近所の人"
      ]
    ],
    "contextNote": "Die Passage stellt Gemeinschaftsarbeit und soziale Begegnung neben die eigentliche Gartenarbeit; die Wirkung ist nicht auf Gemüseertrag beschränkt.",
    "questions": [
      [
        "detail",
        "Was gab es vor dem Garten auf dem Grundstück?",
        "何もありませんでした。",
        "去年まで空き地でした。",
        "大きい公園がありました。",
        "Der Text spricht von einem ungenutzten Grundstück.",
        "去年まで何もありませんでした"
      ],
      [
        "inference",
        "Warum wachsen die Pflanzen nun besser?",
        "手伝う人が増えたからです。",
        "子どもたちが水やりを手伝ったからです。",
        "雨が毎日降ったからです。",
        "Der Bericht nennt zusätzliche Hilfe, aber keinen täglichen Regen.",
        "学校のあとで手伝うようになりました"
      ],
      [
        "purpose",
        "Warum soll nächstes Jahr eine Bank aufgestellt werden?",
        "野菜を育てない人も休めるようにするためです。",
        "だれでも休める場所にするためです。",
        "野菜を売るためです。",
        "Eine Bank soll Menschen einen Ruheort bieten.",
        "育てない人も休める場所"
      ]
    ],
    "writing": [
      "Schreibe einen Satz, wie der Garten Nachbarn verbindet.",
      "近所の人の会話が増えました。",
      "畑で知り合う人が増えました。",
      "近所の人は話さなくなりました。",
      "Im Text nimmt der Austausch zu."
    ],
    "returnCue": [
      "Anderes Projekt: Ein neuer Spielplatz bringt Nachbarn zusammen. Beschreibe diese Folge.",
      "新しい公園で近所の人が知り合いました。",
      "近所の人同士の会話が増えました。",
      "近所の人は会わなくなりました。",
      "Die neue Situation fördert Begegnungen."
    ]
  },
  {
    "id": "train-delay-letter",
    "genre": "email",
    "level": "A2",
    "units": [
      "p25:transport",
      "p25:appointment"
    ],
    "title": "電車の遅れについて",
    "purpose": "Höfliche Entschuldigung und neue Lösung aus einer Mail verstehen",
    "setting": "Nachricht eines Kursteilnehmers an die Lehrkraft",
    "paragraphs": [
      "佐々木先生。おはようございます。今日の授業についてご連絡します。今、電車が故障のため止まっていて、駅で待っています。予定では九時半に大学に着くはずでしたが、駅の案内では十時半ごろになるそうです。そのため、授業の最初に間に合いません。",
      "課題は昨日の夜に終わらせました。授業の後で先生に直接渡す予定でしたが、もし遅れたらメールで送ってもよろしいでしょうか。電車が動き始めたら、もう一度ご連絡します。ご迷惑をおかけして申し訳ありません。"
    ],
    "words": [
      [
        "故障",
        "こしょう",
        "Defekt",
        "電車が故障"
      ],
      [
        "間に合う",
        "まにあう",
        "rechtzeitig schaffen",
        "間に合いません"
      ],
      [
        "直接",
        "ちょくせつ",
        "direkt/persönlich",
        "直接渡す"
      ],
      [
        "ご迷惑",
        "ごめいわく",
        "Unannehmlichkeit",
        "ご迷惑をおかけして"
      ]
    ],
    "contextNote": "Die Mail unterscheidet Ankunftsprognose, veränderte Übergabeform und versprochene weitere Nachricht.",
    "questions": [
      [
        "detail",
        "Wann wird die Ankunft nun ungefähr erwartet?",
        "十時半ごろです。",
        "十時半に着くそうです。",
        "九時半です。",
        "9:30 war der ursprüngliche Plan.",
        "十時半ごろになるそうです"
      ],
      [
        "inference",
        "Ist die Aufgabe noch unvollständig?",
        "いいえ、昨日終わりました。",
        "課題はもう終わっています。",
        "はい、まだです。",
        "Die Mail stellt ausdrücklich die Fertigstellung fest.",
        "課題は昨日の夜に終わらせました"
      ],
      [
        "purpose",
        "Worum bittet der Student?",
        "課題をメールで送る許可です。",
        "メールで課題を送ってもいいか聞いています。",
        "授業を中止することです。",
        "Es geht um den Übermittlungsweg, nicht um Ausfall des Kurses.",
        "メールで送ってもよろしいでしょうか"
      ]
    ],
    "writing": [
      "Schreibe höflich: Wegen einer Zugverspätung komme ich später.",
      "電車が遅れているので、遅れます。",
      "電車が遅れており、到着が遅くなります。",
      "電車が早いので、早く来ます。",
      "Die Verspätung führt zu späterer Ankunft."
    ],
    "returnCue": [
      "Neue Lage: Der Bus ist defekt und du wirst zu spät zum Termin kommen. Entschuldige dich höflich.",
      "バスが故障して、遅れます。申し訳ありません。",
      "バスの故障で到着が遅くなります。すみません。",
      "バスが早いので早く行きます。",
      "Die Ursache ist der Defekt des Busses."
    ]
  },
  {
    "id": "lost-found-interview",
    "genre": "interview",
    "level": "A2",
    "units": [
      "p25:lostfound",
      "p23:ownership"
    ],
    "title": "忘れ物センターでの会話",
    "purpose": "Mehrere Merkmale und fehlende Belege in einem Interview zuordnen",
    "setting": "Interviewartiger kurzer Dialog im Fundbüro",
    "paragraphs": [
      "係員「何をお探しですか。」客「小さい黒いかばんです。昨日の夕方、三番の電車に忘れました。」係員「黒いかばんは二つ届いています。どちらも小さいですよ。」客「私のかばんには青いひもが付いています。中には赤いノートもあります。」",
      "係員「一つ目には青いひもがありますが、中は空です。二つ目には赤いノートが入っていますが、ひもはありません。」客「そうですか。もう少し詳しく調べてもらえますか。」係員「はい。昨日の三番の電車の記録も確認します。」"
    ],
    "words": [
      [
        "係員",
        "かかりいん",
        "Angestellter",
        "係員「"
      ],
      [
        "届く",
        "とどく",
        "abgegeben werden/eintreffen",
        "二つ届いています"
      ],
      [
        "ひも",
        "ひも",
        "Schnur",
        "青いひも"
      ],
      [
        "記録",
        "きろく",
        "Aufzeichnung",
        "電車の記録"
      ]
    ],
    "contextNote": "Mehrere teilweise passende Merkmale beweisen noch nicht, dass ein Fundstück das richtige ist. Die Person handelt folgerichtig mit weiterer Nachfrage.",
    "questions": [
      [
        "detail",
        "Wo wurde die Tasche vergessen?",
        "三番の電車です。",
        "昨日の三番の電車です。",
        "二番の電車です。",
        "Es war Linie drei.",
        "三番の電車に忘れました"
      ],
      [
        "inference",
        "Ist bereits eindeutig klar, welche der beiden Taschen gehört?",
        "いいえ、まだわかりません。",
        "まだ確認が必要です。",
        "はい、一つ目です。",
        "Der ersten fehlt das rote Heft, der zweiten die blaue Schnur.",
        "一つ目…中は空です。二つ目…ひもはありません"
      ],
      [
        "purpose",
        "Was soll die Mitarbeiterin als Nächstes überprüfen?",
        "昨日の電車の記録です。",
        "三番の電車の記録を確認します。",
        "新しいかばんの値段です。",
        "Die angekündigte Prüfung betrifft Bahndaten.",
        "三番の電車の記録も確認します"
      ]
    ],
    "writing": [
      "Schreibe höflich: Könnten Sie noch einmal genauer nachsehen?",
      "もう少し詳しく調べてもらえますか。",
      "もう一度確認していただけますか。",
      "もう調べなくていいです。",
      "Der Sachverhalt ist noch nicht eindeutig."
    ],
    "returnCue": [
      "Anderer Fundfall: Eine Jacke passt bei Farbe, aber nicht Größe. Bitte höflich um weitere Prüfung.",
      "もう一度詳しく確認していただけますか。",
      "ほかのジャケットも調べてもらえますか。",
      "このジャケットで間違いありません。",
      "Die Größe passt noch nicht."
    ]
  },
  {
    "id": "rain-festival-update",
    "genre": "community",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "祭りの雨の日の予定",
    "purpose": "Planwechsel und unveränderte Elemente aus Veranstaltungshinweis kombinieren",
    "setting": "Nachricht des Stadtteilkomitees",
    "paragraphs": [
      "今週の土曜日に予定していた町の秋祭りについてお知らせします。天気予報によると午後から強い雨が降るため、外の広場で行う音楽会は中止します。ただし、手作りの品物を売るお店と子どもの工作教室は、近くの小学校の体育館に移して行います。",
      "開始時間は午前十時のままです。工作教室は午前十一時と午後一時の二回あります。前に配った地図にはまだ広場が会場と書いてありますので、間違えないようにしてください。体育館には靴を入れる袋を持って来てください。"
    ],
    "words": [
      [
        "中止",
        "ちゅうし",
        "Absage",
        "音楽会は中止"
      ],
      [
        "移す",
        "うつす",
        "verlegen",
        "体育館に移して"
      ],
      [
        "開始",
        "かいし",
        "Beginn",
        "開始時間"
      ],
      [
        "会場",
        "かいじょう",
        "Veranstaltungsort",
        "広場が会場"
      ]
    ],
    "contextNote": "Die aktuelle Ankündigung ersetzt Angaben auf älteren Karten. Ein Teil der Veranstaltung findet statt, ein anderer fällt aus.",
    "questions": [
      [
        "detail",
        "Welcher Programmpunkt fällt ganz aus?",
        "音楽会です。",
        "外の音楽会です。",
        "工作教室です。",
        "Die Bastelwerkstatt wird lediglich verlegt.",
        "音楽会は中止します"
      ],
      [
        "inference",
        "Warum darf man die alte Karte nicht unverändert benutzen?",
        "会場が変わったからです。",
        "体育館へ移ったからです。",
        "時間が午後になったからです。",
        "Der Beginn bleibt zehn Uhr; geändert wurde der Ort.",
        "前に配った地図にはまだ広場が会場"
      ],
      [
        "purpose",
        "Was sollen Besucher für die Sporthalle mitbringen?",
        "靴を入れる袋です。",
        "靴の袋を持って行きます。",
        "新しい地図だけです。",
        "Ausdrücklich gefordert ist ein Beutel für Schuhe.",
        "靴を入れる袋を持って来てください"
      ]
    ],
    "writing": [
      "Fasse zusammen: Das Musikprogramm fällt aus, aber die Bastelwerkstatt findet statt.",
      "音楽会は中止ですが、工作教室はあります。",
      "音楽会はありませんが、工作教室は体育館で行います。",
      "工作教室も中止です。",
      "Die Bastelwerkstatt wird verlegt, nicht gestrichen."
    ],
    "returnCue": [
      "Ein anderes Fest: Konzert fällt aus, Markt findet in der Schule statt. Schreibe diese Änderung.",
      "コンサートは中止ですが、市場は学校で行います。",
      "コンサートはありませんが、お店は学校に移ります。",
      "市場も中止です。",
      "Der Markt ist in der neuen Situation nicht abgesagt."
    ]
  }
] satisfies P46RawReading[];
export const p46ReadingsC=p46CorpusC.map(authoredP46Reading);
