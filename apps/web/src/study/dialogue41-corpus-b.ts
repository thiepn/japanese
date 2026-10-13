import {makeP41Arc} from "./dialogue41-authoring";
/** Original conversation pivots: weather, museums, commerce, study, introductions. */
export const p41CorpusB=[
makeP41Arc({
  "id": "rain-picnic",
  "level": "A1",
  "units": [
    "p23:plans",
    "p26:weekend-switch"
  ],
  "title": "Picknick wird Café-Treffen",
  "setting": "Du planst ein Picknick am Sonntag. Wegen Regen ändert ihr den Ort, nicht den Tag.",
  "pivotTurn": 3,
  "outcome": "Sonntag um 11 Uhr im Café statt im Park.",
  "turns": [
    [
      "日曜日に公園へ行きませんか。",
      "Nimm die Einladung für Sonntag an.",
      "はい、行きましょう。",
      "いいですね。行きましょう。",
      "日曜日に行きました。",
      "Du sprichst über die Vergangenheit statt zuzustimmen.",
      "Einladung"
    ],
    [
      "でも、日曜日は雨です。",
      "Reagiere auf die schlechte Wettervorhersage.",
      "そうですか。雨なんですね。",
      "それは困りますね。",
      "いいえ、昨日は晴れでした。",
      "Gestern ist nicht das Wetter für das vereinbarte Treffen.",
      "Wetter"
    ],
    [
      "カフェに行きませんか。",
      "Stimme einem Café als Ersatz für den Park zu.",
      "はい、カフェに行きましょう。",
      "いいですね。カフェにしましょう。",
      "はい、公園で会いましょう。",
      "Der Park ist wegen Regen gerade ersetzt worden.",
      "Ort ändern"
    ],
    [
      "何時に会いましょうか。",
      "Schlage 11 Uhr vor.",
      "午前十一時はどうですか。",
      "十一時に会いましょう。",
      "昨日、十一時に会いました。",
      "Eine vergangene Begegnung ist kein Terminangebot.",
      "Uhrzeit"
    ],
    [
      "カフェで十一時ですね。",
      "Bestätige Sonntag, 11 Uhr, Café.",
      "はい、日曜日の十一時にカフェで会いましょう。",
      "はい、日曜日、カフェで十一時ですね。",
      "はい、土曜日に公園で会いましょう。",
      "Alter Ort und falscher Tag brechen die gemeinsame Planung.",
      "Kontinuität"
    ]
  ],
  "returnCue": [
    "Ein Parktreffen am Samstag findet wegen Regen im Café statt. Bestätige den Ort.",
    "では、土曜日にカフェで会いましょう。",
    "土曜日はカフェで会いませんか。",
    "土曜日に公園で会いましょう。",
    "Der Treffort wurde wegen Regen geändert."
  ]
}),
makeP41Arc({
  "id": "early-closing",
  "level": "A2",
  "units": [
    "p25:directions",
    "p23:plans"
  ],
  "title": "Das Museum schließt früh",
  "setting": "Du willst ein Museum besuchen und erfährst, dass es heute zwei Stunden früher schließt.",
  "pivotTurn": 3,
  "outcome": "Nur die kurze Ausstellung; Eintritt vor 15:30 Uhr.",
  "turns": [
    [
      "チケットはお持ちですか。",
      "Sage, dass du noch kein Ticket hast.",
      "いいえ、まだ持っていません。",
      "まだチケットがありません。",
      "はい、もう買いました。",
      "Damit behauptest du bereits einen Ticketkauf.",
      "Ticketstatus"
    ],
    [
      "今日は四時に閉まります。",
      "Frage nach der Schließzeit 16 Uhr.",
      "今日は午後四時までですか。",
      "四時に閉まるんですか。",
      "今日は六時までですね。",
      "Sechs Uhr widerspricht der mitgeteilten Zeit.",
      "Neue Öffnungszeit"
    ],
    [
      "はい。短い展示なら見られます。",
      "Entscheide dich für die kurze Ausstellung.",
      "では、短い展示を見たいです。",
      "短い展示を見ます。",
      "では、全部ゆっくり見ます。",
      "Der geplante lange Besuch passt nicht zur verkürzten Zeit.",
      "Besuch verkürzen"
    ],
    [
      "このチケットで大丈夫ですか。",
      "Bitte um genau ein Ticket.",
      "はい、一枚お願いします。",
      "チケットを一枚ください。",
      "はい、三枚お願いします。",
      "Drei Tickets sind nicht gewünscht.",
      "Menge"
    ],
    [
      "三時半までにお入りください。",
      "Bestätige Eintritt vor 15:30 Uhr.",
      "三時半までですね。ありがとうございます。",
      "わかりました。三時半までに入ります。",
      "四時半に入ります。",
      "16:30 ist nach dem Schluss des Museums.",
      "Eintrittsfrist"
    ]
  ],
  "returnCue": [
    "Eine andere Ausstellung schließt um 15 Uhr. Frage, ob du sie vorher besichtigen kannst.",
    "三時までに見られますか。",
    "午後三時までに見てもいいですか。",
    "三時半から見ます。",
    "15:30 liegt nach der angegebenen Schließzeit."
  ]
}),
makeP41Arc({
  "id": "bag-stock",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p23:ownership"
  ],
  "title": "Die blaue Tasche ist ausverkauft",
  "setting": "Du suchst eine blaue Tasche und bekommst eine rote angeboten. Du willst ausdrücklich bei Blau bleiben.",
  "pivotTurn": 3,
  "outcome": "Du bittest um eine andere blaue Tasche und prüfst ihren Preis.",
  "turns": [
    [
      "何をお探しですか。",
      "Beschreibe deine gewünschte blaue Tasche.",
      "青いかばんを探しています。",
      "青いかばんが欲しいです。",
      "赤いかばんを買いました。",
      "Kauf und Farbe passen nicht zur Suche.",
      "Farbe und Wunsch"
    ],
    [
      "この青いかばんは売り切れです。",
      "Bestätige, dass diese blaue Tasche ausverkauft ist.",
      "そうですか。もうないんですね。",
      "わかりました。売り切れですね。",
      "では、これを買います。",
      "Ein ausverkaufter Artikel kann nicht jetzt gekauft werden.",
      "Verfügbarkeit"
    ],
    [
      "赤いかばんならあります。",
      "Lehne Rot ab und frage nach einer anderen blauen Tasche.",
      "赤ではなく、ほかの青いかばんはありますか。",
      "すみません、青いかばんがいいです。",
      "はい、赤いのをください。",
      "Damit änderst du ungewollt deinen Farbwunsch.",
      "Ersatz nicht akzeptieren"
    ],
    [
      "小さい青いかばんならあります。",
      "Bitte darum, die kleinere blaue Tasche zu sehen.",
      "では、それを見せてください。",
      "小さい青いかばんを見たいです。",
      "では、赤いかばんを見せてください。",
      "Rot wurde bereits abgelehnt.",
      "Andere Größe"
    ],
    [
      "こちらは二千円です。",
      "Bestätige den Preis von 2000 Yen.",
      "二千円ですね。ありがとうございます。",
      "二千円ですか。わかりました。",
      "三千円ですね。",
      "Du änderst den genannten Preis ohne Grund.",
      "Preis"
    ]
  ],
  "returnCue": [
    "Im anderen Geschäft ist nur eine kleine schwarze Tasche da; du möchtest ausdrücklich Schwarz. Bitte darum, sie zu sehen.",
    "小さい黒いかばんを見せてください。",
    "では、その黒いかばんを見たいです。",
    "赤いかばんをください。",
    "Die gewünschte Farbe ist Schwarz und nicht Rot."
  ]
}),
makeP41Arc({
  "id": "study-room-busy",
  "level": "A2",
  "units": [
    "p25:library",
    "p26:library-project"
  ],
  "title": "Lernraum schon belegt",
  "setting": "Der ruhige Raum ist besetzt. Eine andere Nummer und spätere Uhrzeit werden vereinbart.",
  "pivotTurn": 3,
  "outcome": "Du reservierst Raum zwei ab 13 Uhr statt Raum eins am Vormittag.",
  "turns": [
    [
      "どこで勉強したいですか。",
      "Bitte um einen ruhigen Lernraum.",
      "静かな部屋で勉強したいです。",
      "静かな部屋はありますか。",
      "にぎやかな部屋で勉強したいです。",
      "にぎやか passt nicht zum Wunsch nach Ruhe.",
      "Raumwunsch"
    ],
    [
      "この部屋はもう使っています。",
      "Bitte um eine andere Möglichkeit.",
      "ほかの部屋はありますか。",
      "別の部屋を使ってもいいですか。",
      "では、この部屋を使います。",
      "Der gezeigte Raum ist schon belegt.",
      "Belegung"
    ],
    [
      "二番の部屋なら午後から使えます。",
      "Nimm Raum zwei am Nachmittag an.",
      "では、午後に二番の部屋を使います。",
      "二番の部屋を午後にお願いします。",
      "では、午前に一番の部屋を使います。",
      "Alte Raum- und Zeitangaben passen nicht zum Angebot.",
      "Neuer Raum und neue Zeit"
    ],
    [
      "予約しますか。",
      "Bitte um die Reservierung dieses Raums.",
      "はい、二番の部屋を予約したいです。",
      "はい、予約をお願いします。",
      "いいえ、予約しました。",
      "Du möchtest jetzt reservieren, nicht die Anfrage ablehnen.",
      "Reservierung"
    ],
    [
      "午後一時から使えます。",
      "Bestätige die Uhrzeit 13 Uhr.",
      "午後一時からですね。ありがとうございます。",
      "わかりました。一時に来ます。",
      "午後三時からですね。",
      "Drei Uhr ist nicht die zugesagte Anfangszeit.",
      "Startzeit"
    ]
  ],
  "returnCue": [
    "Ein anderer Lernraum wird erst um 15 Uhr frei. Bestätige die neue Startzeit.",
    "午後三時からですね。",
    "午後三時に来ます。",
    "午後一時からですね。",
    "Der neue Raum ist erst später verfügbar."
  ]
}),
makeP41Arc({
  "id": "language-partner",
  "level": "A1",
  "units": [
    "p23:greetings",
    "p23:introduction"
  ],
  "title": "Vorstellung mit Namenskorrektur",
  "setting": "Du lernst einen Tandempartner kennen. Er versteht deinen Namen falsch; danach vereinbart ihr eine Sprache.",
  "pivotTurn": 3,
  "outcome": "Dein Name ist Hana; ihr übt zuerst Japanisch.",
  "turns": [
    [
      "こんにちは。お名前は何ですか。",
      "Stelle dich höflich als Hana vor.",
      "ハナです。よろしくお願いします。",
      "私はハナです。",
      "あなたはハナです。",
      "Das weist dem Gegenüber deinen Namen zu.",
      "Vorstellung"
    ],
    [
      "ナナさんですか。",
      "Korrigiere den falsch verstandenen Namen Nana.",
      "いいえ、ハナです。",
      "ナナではなく、ハナです。",
      "はい、ナナです。",
      "Du bestätigst den falsch gehörten Namen.",
      "Namenskorrektur"
    ],
    [
      "ハナさんですね。日本語を勉強しますか。",
      "Bestätige deinen Namen und dass du Japanisch lernst.",
      "はい、ハナです。日本語を勉強しています。",
      "はい、日本語を勉強します。",
      "はい、ナナです。英語を勉強しています。",
      "Du wechselst Namen und Zielsprache ungewollt.",
      "Identität und Ziel"
    ],
    [
      "最初は何語で話しましょうか。",
      "Bitte darum, zuerst Japanisch zu sprechen.",
      "最初は日本語でお願いします。",
      "まず日本語で話しましょう。",
      "最初は英語でお願いします。",
      "Du willst zuerst Japanisch statt Englisch verwenden.",
      "Sprachauswahl"
    ],
    [
      "わかりました。日本語で始めましょう。",
      "Stimme höflich dem Beginn zu.",
      "はい、よろしくお願いします。",
      "はい、始めましょう。",
      "いいえ、もう終わりました。",
      "Du beendest das Gespräch statt es zu beginnen.",
      "Beginn"
    ]
  ],
  "returnCue": [
    "Ein anderer Partner nennt dich Mina statt Mika. Korrigiere den Namen.",
    "ミナではなく、ミカです。",
    "いいえ、ミカです。",
    "はい、ミナです。",
    "Du darfst nicht den falsch gehörten Namen bestätigen."
  ]
})
];
