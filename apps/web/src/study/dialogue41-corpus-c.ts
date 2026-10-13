import {makeP41Arc} from "./dialogue41-authoring";
/** Original scripts: ingredients, route detours, group plans, booking repair, gift exchange. */
export const p41CorpusC=[
makeP41Arc({
  "id": "milk-free-meal",
  "level": "A2",
  "units": [
    "p23:cafe",
    "p25:shopping"
  ],
  "title": "Zutat erfragen und Gericht wechseln",
  "setting": "Du möchtest in einem Café ein Gericht ohne Milch bestellen und fragst nach den Zutaten, bevor du die Bestellung änderst.",
  "pivotTurn": 3,
  "outcome": "Sandwich ohne Milch und Wasser statt Milchprodukt.",
  "turns": [
    [
      "何を食べますか。",
      "Frage, ob der Kuchen Milch enthält.",
      "このケーキに牛乳は入っていますか。",
      "ケーキに牛乳が入っていますか。",
      "牛乳のケーキを二つください。",
      "Du sollst vor der Bestellung nach einer Zutat fragen.",
      "Zutat"
    ],
    [
      "はい、牛乳が入っています。",
      "Bitte ausdrücklich um etwas ohne Milch.",
      "牛乳が入っていないものをお願いします。",
      "すみません、牛乳なしのものがいいです。",
      "では、牛乳をください。",
      "Damit bestellst du die gerade unerwünschte Milch.",
      "Einschränkung"
    ],
    [
      "このサンドイッチには牛乳が入っていません。",
      "Entscheide dich für den angebotenen Sandwich.",
      "では、そのサンドイッチをください。",
      "それを一つお願いします。",
      "では、ケーキをください。",
      "Der Kuchen enthält Milch; der Sandwich wurde als Alternative angeboten.",
      "Gericht wechseln"
    ],
    [
      "飲み物はどうしますか。",
      "Bestelle dazu Wasser.",
      "水を一つお願いします。",
      "お水をください。",
      "牛乳を一つお願いします。",
      "Eine Milchbestellung widerspricht deiner Einschränkung.",
      "Getränk"
    ],
    [
      "サンドイッチと水ですね。",
      "Bestätige die neue Bestellung.",
      "はい、サンドイッチと水です。",
      "はい、それでお願いします。",
      "いいえ、ケーキと牛乳です。",
      "Damit würdest du zu den ungeeigneten Produkten wechseln.",
      "Bestätigung"
    ]
  ],
  "returnCue": [
    "Bei einem anderen Essen ist Milch enthalten. Bitte um einen Salat ohne Milch.",
    "では、牛乳なしのサラダをお願いします。",
    "サラダを一つお願いします。",
    "牛乳入りの料理をお願いします。",
    "Das ausgewählte Gericht soll gerade keine Milch enthalten."
  ]
}),
makeP41Arc({
  "id": "closed-street",
  "level": "A2",
  "units": [
    "p25:directions",
    "p26:station-to-campus"
  ],
  "title": "Gesperrte Straße auf dem Weg",
  "setting": "Du gehst zu Fuß zur Universität. Eine Straße ist gesperrt; du musst eine andere Route erfragen.",
  "pivotTurn": 3,
  "outcome": "Du benutzt den neuen Weg über die Brücke und gehst danach links.",
  "turns": [
    [
      "どこに行きますか。",
      "Nenne die Universität als Ziel.",
      "大学に行きます。",
      "大学まで歩いて行きます。",
      "大学で勉強しました。",
      "Eine frühere Lerntätigkeit nennt nicht dein aktuelles Wegziel.",
      "Ziel"
    ],
    [
      "この道は工事中です。",
      "Frage höflich nach einem anderen Weg.",
      "別の道はありますか。",
      "どう行けばいいですか。",
      "では、この道を行きます。",
      "Die Straße ist wegen Bauarbeiten nicht nutzbar.",
      "Sperrung"
    ],
    [
      "橋を渡ってください。",
      "Bestätige, dass du über die Brücke gehen wirst.",
      "はい、橋を渡ります。",
      "わかりました。橋を渡ります。",
      "はい、トンネルを通ります。",
      "Ein Tunnel ist nicht die neu genannte Brücke.",
      "Neue Route"
    ],
    [
      "橋の後で左に曲がってください。",
      "Wiederhole die Linksabbiegung nach der Brücke.",
      "橋の後で左ですね。",
      "橋を渡ってから左に曲がります。",
      "橋の前で右ですね。",
      "Die Weganweisung lautet nach der Brücke links.",
      "Richtung"
    ],
    [
      "大学はその先です。",
      "Bestätige und bedanke dich für die Route.",
      "わかりました。ありがとうございます。",
      "橋を渡って左ですね。ありがとうございます。",
      "駅に戻ります。",
      "Du solltest zur Universität weitergehen, nicht zum Bahnhof zurück.",
      "Route sichern"
    ]
  ],
  "returnCue": [
    "Wegen einer Straßensperre sollst du erst über eine Brücke und dann rechts gehen. Bestätige den neuen Weg.",
    "橋を渡ってから右に曲がります。",
    "橋の後で右ですね。",
    "橋の前で左ですね。",
    "Die neue Anweisung lautet danach rechts."
  ]
}),
makeP41Arc({
  "id": "study-group-room",
  "level": "A2",
  "units": [
    "p23:plans",
    "p26:library-project"
  ],
  "title": "Lerngruppe wechselt den Treffpunkt",
  "setting": "Drei Mitschüler möchten lernen. Der zuerst geplante Raum ist geschlossen; der Termin bleibt bestehen.",
  "pivotTurn": 3,
  "outcome": "Freitag 16 Uhr in der Bibliothek statt im Schulraum.",
  "turns": [
    [
      "金曜日に一緒に勉強しませんか。",
      "Stimme dem gemeinsamen Lernen am Freitag zu.",
      "はい、金曜日に勉強しましょう。",
      "はい、ぜひ一緒に勉強しましょう。",
      "昨日、勉強しました。",
      "Eine Handlung gestern sagt nicht zum Freitag zu.",
      "Einladung"
    ],
    [
      "学校の部屋は使えません。",
      "Erkundige dich nach einem anderen Lernort.",
      "どこで勉強しましょうか。",
      "ほかの場所はありますか。",
      "では、その部屋を使います。",
      "Der ursprüngliche Raum ist nicht verfügbar.",
      "Ortsproblem"
    ],
    [
      "図書館なら空いています。",
      "Bestätige ausdrücklich die Bibliothek als Ersatz.",
      "では、図書館で勉強しましょう。",
      "図書館にしましょう。",
      "学校の部屋で勉強しましょう。",
      "Der Schulraum wurde ausgeschlossen; ändere den Ort.",
      "Neuer Ort"
    ],
    [
      "何時からにしましょうか。",
      "Schlage Beginn um 16 Uhr vor.",
      "午後四時からはどうですか。",
      "午後四時に始めましょう。",
      "午後二時に終わりました。",
      "Vergangenheit und andere Uhrzeit erfüllen die Frage nicht.",
      "Beginn"
    ],
    [
      "では、金曜日の四時に図書館で。",
      "Bestätige Tag, Zeit und Ort gemeinsam.",
      "はい、金曜日の午後四時に図書館で会いましょう。",
      "金曜日の四時ですね。よろしくお願いします。",
      "木曜日の午後四時に学校で会いましょう。",
      "Das ersetzt ungewollt Tag und Ort des endgültigen Plans.",
      "Zusammenfassung"
    ]
  ],
  "returnCue": [
    "Eine andere Gruppe kann nicht im Café lernen; schlage für Samstag um 14 Uhr die Bibliothek vor.",
    "土曜日の午後二時に図書館で勉強しませんか。",
    "土曜日に図書館で二時から勉強しましょう。",
    "土曜日にカフェで勉強しましょう。",
    "Das Café ist nicht mehr der geeignete Lernort."
  ]
}),
makeP41Arc({
  "id": "wrong-reservation",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p25:shopping"
  ],
  "title": "Falsches Datum bei Reservierung",
  "setting": "Du hast einen Termin am Freitag reserviert. Am Schalter ist irrtümlich Donnerstag eingetragen.",
  "pivotTurn": 3,
  "outcome": "Freitag 10 Uhr statt Donnerstag wird ausdrücklich korrigiert.",
  "turns": [
    [
      "ご予約のお名前は？",
      "Nenne den Reservierungsnamen Sato.",
      "佐藤です。",
      "予約した佐藤です。",
      "田中です。",
      "Der Name stimmt nicht mit deiner Reservierung überein.",
      "Name"
    ],
    [
      "木曜日の十時ですね。",
      "Erkenne, dass Donnerstag fälschlich genannt wird.",
      "すみません、木曜日ではありません。",
      "日にちが違います。",
      "はい、木曜日の十時です。",
      "Du bestätigst das falsche Datum.",
      "Falsches Datum"
    ],
    [
      "では、いつですか。",
      "Korrigiere ausdrücklich auf Freitag 10 Uhr.",
      "金曜日の十時です。",
      "金曜日の午前十時に予約しました。",
      "木曜日の十時です。",
      "Du würdest das bereits beanstandete Datum wiederholen.",
      "Richtiges Datum"
    ],
    [
      "金曜日の十時ですね。",
      "Bestätige die berichtigte Eintragung.",
      "はい、金曜日の十時でお願いします。",
      "はい、それで合っています。",
      "いいえ、土曜日です。",
      "Samstag wäre ein dritter, nicht vereinbarter Tag.",
      "Korrektur bestätigen"
    ],
    [
      "少しお待ちください。",
      "Bedanke dich und warte höflich.",
      "はい、ありがとうございます。",
      "わかりました。待ちます。",
      "いいえ、帰りました。",
      "Du sollst auf die Auskunft warten, nicht eine vergangene Heimfahrt erzählen.",
      "Abschluss"
    ]
  ],
  "returnCue": [
    "Eine andere Reservierung ist irrtümlich auf Dienstag statt Mittwoch eingetragen. Korrigiere.",
    "火曜日ではなく、水曜日です。",
    "すみません、水曜日に予約しました。",
    "はい、火曜日です。",
    "Bestätige nicht den verwechselten Tag."
  ]
}),
makeP41Arc({
  "id": "gift-size",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p23:ownership"
  ],
  "title": "Geschenk in der falschen Größe",
  "setting": "Du kaufst ein T-Shirt für einen Freund. Größe M ist nicht verfügbar, deshalb wählst du L, aber behältst die Farbe Blau.",
  "pivotTurn": 3,
  "outcome": "Blaues T-Shirt in Größe L statt M.",
  "turns": [
    [
      "どんなシャツを探していますか。",
      "Frage nach einem blauen T-Shirt in Größe M.",
      "青いMサイズのTシャツはありますか。",
      "Mサイズの青いTシャツを探しています。",
      "赤いLサイズのTシャツを買いました。",
      "Farbe, Größe und bereits abgeschlossener Kauf sind falsch.",
      "Wunsch"
    ],
    [
      "Mサイズは売り切れです。",
      "Bestätige, dass Größe M ausverkauft ist.",
      "そうですか。Mサイズはないんですね。",
      "わかりました。売り切れですね。",
      "では、Mサイズをください。",
      "Die gewünschte Größe kann gerade nicht verkauft werden.",
      "Nichtverfügbarkeit"
    ],
    [
      "Lサイズならあります。",
      "Bitte um Größe L, aber ausdrücklich weiter in Blau.",
      "では、青いLサイズを見せてください。",
      "青いLサイズでお願いします。",
      "では、赤いLサイズをください。",
      "Die Größe darf sich ändern, die Farbe sollte Blau bleiben.",
      "Größe wechseln"
    ],
    [
      "こちらでいいですか。",
      "Bestätige das gezeigte blaue Shirt.",
      "はい、それでお願いします。",
      "はい、この青いシャツをください。",
      "いいえ、Mサイズを買いました。",
      "M ist nicht verfügbar; die Auswahl war auf L geändert worden.",
      "Gegenstand"
    ],
    [
      "プレゼントですか。",
      "Erkläre höflich, dass es ein Geschenk für deinen Freund ist.",
      "はい、友達へのプレゼントです。",
      "はい、友達にあげます。",
      "いいえ、自分の古いシャツです。",
      "Ein altes eigenes Shirt ist nicht das neu gekaufte Geschenk.",
      "Zweck"
    ]
  ],
  "returnCue": [
    "Ein Laden hat Größe S nicht, aber Größe M in Schwarz. Bitte um das schwarze Shirt in M.",
    "では、黒いMサイズをお願いします。",
    "黒いMサイズを見せてください。",
    "黒いSサイズをください。",
    "Größe S ist gerade ausverkauft."
  ]
})
];
