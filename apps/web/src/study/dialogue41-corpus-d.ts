import {makeP41Arc} from "./dialogue41-authoring";
/** Original context repairs: changed class time, bus side, quantities, lunch, postcards. */
export const p41CorpusD=[
makeP41Arc({
  "id": "morning-class",
  "level": "A1",
  "units": [
    "p23:routine",
    "p23:past"
  ],
  "title": "Unterricht beginnt früher",
  "setting": "Ein Mitschüler fragt nach dem normalen Kursbeginn. Heute beginnt der Unterricht ausnahmsweise eine Stunde früher.",
  "pivotTurn": 3,
  "outcome": "Heute um acht statt um neun Uhr.",
  "turns": [
    [
      "いつも何時に学校に行きますか。",
      "Beschreibe deine Gewohnheit: normalerweise um neun Uhr.",
      "いつも九時に学校に行きます。",
      "九時に行きます。",
      "昨日九時に行きました。",
      "Vergangenheit gestern beantwortet nicht die regelmäßige Routine.",
      "Gewohnheit"
    ],
    [
      "今日は授業が早いですよ。",
      "Frage nach der heutigen Anfangszeit.",
      "今日は何時からですか。",
      "今日は何時に始まりますか。",
      "昨日は何時でしたか。",
      "Es geht um heute, nicht um den Vortag.",
      "Heute nachfragen"
    ],
    [
      "今日は八時からです。",
      "Bestätige, dass heute um acht begonnen wird.",
      "今日は八時からですね。",
      "わかりました。八時に来ます。",
      "今日は九時からですね。",
      "Neun Uhr ist die normale, nicht die neue heutige Zeit.",
      "Ausnahme"
    ],
    [
      "遅れないでくださいね。",
      "Versprich höflich, heute nicht zu spät zu kommen.",
      "はい、八時までに行きます。",
      "はい、遅れないようにします。",
      "はい、九時に行きます。",
      "Ankunft um neun wäre heute zu spät.",
      "Verbindlichkeit"
    ]
  ],
  "returnCue": [
    "Ein anderer Kurs beginnt heute schon um sieben statt acht Uhr. Bestätige die Ausnahme.",
    "今日は七時からですね。",
    "今日は七時に行きます。",
    "今日は八時からですね。",
    "Acht Uhr ist die gewöhnliche, aber nicht die neue Zeit."
  ]
}),
makeP41Arc({
  "id": "wrong-bus-stop",
  "level": "A2",
  "units": [
    "p25:directions",
    "p25:transport"
  ],
  "title": "Falsche Bushaltestelle korrigieren",
  "setting": "Du fragst nach dem Bus zum Bahnhof. Die erste Haltestelle ist für die Gegenrichtung.",
  "pivotTurn": 3,
  "outcome": "Du gehst zur Haltestelle gegenüber statt vor dem Geschäft.",
  "turns": [
    [
      "駅に行きたいですか。",
      "Bestätige das Ziel Bahnhof.",
      "はい、駅に行きたいです。",
      "はい、駅まで行きます。",
      "いいえ、駅に行きました。",
      "Eine vergangene Fahrt bestätigt nicht das jetzige Ziel.",
      "Ziel"
    ],
    [
      "この店の前のバス停ですか。",
      "Frage, ob dies der Bus zum Bahnhof ist.",
      "ここから駅に行けますか。",
      "駅行きのバスはここですか。",
      "はい、もう駅に着きました。",
      "Du bist noch an der Haltestelle, nicht angekommen.",
      "Linie prüfen"
    ],
    [
      "いいえ、反対側のバス停です。",
      "Übernimm die Korrektur auf die gegenüberliegende Seite.",
      "では、反対側に行きます。",
      "向こうのバス停ですね。",
      "では、この店の前で待ちます。",
      "Die Haltestelle vor dem Geschäft führt in die falsche Richtung.",
      "Richtung ändern"
    ],
    [
      "道を渡るとすぐです。",
      "Bestätige das Überqueren der Straße und danke.",
      "道を渡ります。ありがとうございます。",
      "わかりました。反対側ですね。",
      "ここでバスを待ちます。",
      "Du sollst auf der gegenüberliegenden Seite warten.",
      "Weg bestätigen"
    ]
  ],
  "returnCue": [
    "Ein anderer Bus hält auf der anderen Straßenseite. Bestätige den Wechsel.",
    "では、反対側のバス停に行きます。",
    "向こうのバス停ですね。",
    "こちらのバス停で待ちます。",
    "Die erste Haltestelle ist nicht die richtige."
  ]
}),
makeP41Arc({
  "id": "grocery-quantity",
  "level": "A1",
  "units": [
    "p25:shopping",
    "p23:cafe"
  ],
  "title": "Drei Äpfel statt zwei",
  "setting": "Du kaufst Äpfel. Die Verkäuferin versteht die gewünschte Menge falsch; du korrigierst auf drei.",
  "pivotTurn": 3,
  "outcome": "Drei Äpfel und keine Birnen.",
  "turns": [
    [
      "何を買いますか。",
      "Bitte um Äpfel.",
      "りんごをお願いします。",
      "りんごを買いたいです。",
      "バナナをください。",
      "Bananen sind nicht der gewünschte Artikel.",
      "Gegenstand"
    ],
    [
      "りんごは二つですね。",
      "Korrigiere die Menge zwei auf drei.",
      "いいえ、三つです。",
      "りんごを三つお願いします。",
      "はい、二つです。",
      "Du bestätigst sonst die falsch verstandenen zwei Äpfel.",
      "Mengenfehler"
    ],
    [
      "三つですね。なしも買いますか。",
      "Bestätige drei Äpfel und lehne Birnen ab.",
      "りんごは三つです。なしは要りません。",
      "三つだけお願いします。",
      "りんごは二つで、なしもください。",
      "Der alte Mengenfehler und eine zusätzliche Birne widersprechen deinem Wunsch.",
      "Nur drei Äpfel"
    ],
    [
      "わかりました。三つで三百円です。",
      "Bestätige 300 Yen und bedanke dich.",
      "三百円ですね。ありがとうございます。",
      "はい、三百円です。",
      "二百円ですね。",
      "Der genannte Gesamtpreis beträgt 300 Yen.",
      "Preis"
    ]
  ],
  "returnCue": [
    "Ein Verkäufer versteht vier Orangen statt fünf. Korrigiere höflich die Menge.",
    "いいえ、五つお願いします。",
    "オレンジを五つください。",
    "はい、四つです。",
    "Du solltest fünf statt vier erhalten."
  ]
}),
makeP41Arc({
  "id": "quiet-lunch",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p23:cafe"
  ],
  "title": "Mittagessen nach einer Terminänderung",
  "setting": "Du hast in einer Stunde ein Treffen. Ein Freund schlägt Essen vor, aber das erste Lokal öffnet zu spät.",
  "pivotTurn": 3,
  "outcome": "Ihr esst früher in einem anderen Café und behaltet den späteren Termin im Blick.",
  "turns": [
    [
      "お昼ご飯を食べませんか。",
      "Nimm die Einladung zum gemeinsamen Mittagessen an.",
      "はい、一緒に食べましょう。",
      "いいですね。行きましょう。",
      "昨日食べました。",
      "Du erzählst von gestern, statt auf die Einladung zu antworten.",
      "Einladung"
    ],
    [
      "あのお店は一時に開きます。",
      "Erkläre, dass du um 13 Uhr schon einen Termin hast.",
      "一時は予定があります。",
      "一時には用事があります。",
      "では、一時まで待ちます。",
      "Du kannst gerade nicht bis zur Öffnungszeit warten.",
      "Zeitkonflikt"
    ],
    [
      "では、駅のカフェはどうですか。",
      "Stimme dem Café als schnellere Alternative zu.",
      "駅のカフェにしましょう。",
      "はい、そこなら大丈夫です。",
      "では、あのお店で一時に食べます。",
      "Du kehrst zum zu spät öffnenden Lokal zurück.",
      "Lokal wechseln"
    ],
    [
      "十二時に会いましょう。",
      "Bestätige zwölf Uhr und das Café.",
      "十二時に駅のカフェで会いましょう。",
      "はい、十二時ですね。",
      "一時にあのお店で会いましょう。",
      "Alter Ort und alte Uhrzeit passen nicht zur Änderung.",
      "Termin erhalten"
    ]
  ],
  "returnCue": [
    "Ein Restaurant öffnet erst um 14 Uhr; du brauchst um 13 Uhr Essen. Schlage ein Café um zwölf Uhr vor.",
    "十二時にカフェで食べませんか。",
    "では、十二時にカフェに行きましょう。",
    "二時まで待ちましょう。",
    "Warten bis 14 Uhr würde den neuen Zeitbedarf verfehlen."
  ]
}),
makeP41Arc({
  "id": "postcard-address",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p25:directions"
  ],
  "title": "Postkarte an die neue Adresse",
  "setting": "Du sendest eine Postkarte. Das Personal liest zunächst die alte Stadt vor; du musst die neue Adresse angeben.",
  "pivotTurn": 3,
  "outcome": "Neue Anschrift in Kyoto statt alter Anschrift in Osaka.",
  "turns": [
    [
      "どこに送りますか。",
      "Sage, dass du die Karte nach Kyoto schicken möchtest.",
      "京都に送ります。",
      "京都までお願いします。",
      "大阪で買いました。",
      "Ein Kauf in Osaka ist kein Versandziel.",
      "Ziel"
    ],
    [
      "大阪の住所ですね。",
      "Korrigiere, dass Osaka nicht das Versandziel ist.",
      "いいえ、大阪ではありません。",
      "大阪ではなく、京都です。",
      "はい、大阪に送ります。",
      "Damit akzeptierst du die alte Stadt.",
      "Adressfehler"
    ],
    [
      "では、京都の住所を書いてください。",
      "Stimme zu, die aktuelle Adresse in Kyoto aufzuschreiben.",
      "はい、京都の住所を書きます。",
      "ここに新しい住所を書きます。",
      "大阪の古い住所を書きます。",
      "Die alte Anschrift darf nicht wiederverwendet werden.",
      "Neue Anschrift"
    ],
    [
      "京都に送りますね。",
      "Bestätige das neue Ziel und danke.",
      "はい、京都にお願いします。ありがとうございます。",
      "そうです。京都です。ありがとうございます。",
      "いいえ、大阪でお願いします。",
      "Damit würdest du die berichtigte Stadt wieder vertauschen.",
      "Abschluss"
    ]
  ],
  "returnCue": [
    "Bei einer anderen Karte steht Tokyo statt Osaka. Bitte ausdrücklich um Versand nach Osaka.",
    "東京ではなく、大阪に送ってください。",
    "大阪の住所にお願いします。",
    "東京に送ってください。",
    "Das zuerst gelesene Tokyo ist falsch."
  ]
})
];
