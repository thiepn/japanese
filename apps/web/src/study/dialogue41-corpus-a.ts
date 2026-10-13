import {makeP41Arc} from "./dialogue41-authoring";
/** Independently authored dialogue scenes: transport, borrowing, café, schedules, lost property. */
export const p41CorpusA=[
  makeP41Arc({
  "id": "late-train",
  "level": "A2",
  "units": [
    "p25:transport",
    "p26:station-to-campus"
  ],
  "title": "Zugverspätung und neuer Weg",
  "setting": "Du willst rechtzeitig zur Universität. Ein Mitarbeiter meldet eine Zugverspätung und schlägt einen Bus vor.",
  "pivotTurn": 3,
  "outcome": "Bus Nummer drei statt verspätetem Zug.",
  "turns": [
    [
      "どちらまで行きますか。",
      "Nenne die Universität als Ziel.",
      "大学まで行きたいです。",
      "大学に行きたいです。",
      "大学で行きたいです。",
      "で kennzeichnet hier nicht das Reiseziel.",
      "Reiseziel"
    ],
    [
      "電車は二十分遅れています。",
      "Erfrage eine andere Reisemöglichkeit.",
      "ほかの行き方はありますか。",
      "バスでも行けますか。",
      "電車で行きました。",
      "Vergangenheit erklärt keine neue Verbindung.",
      "Alternative"
    ],
    [
      "バスなら十分で着きます。",
      "Wechsle ausdrücklich zum Bus.",
      "では、バスで行きます。",
      "バスにします。",
      "では、電車で行きます。",
      "Der verspätete Zug ist nicht mehr die gewählte Option.",
      "Verkehrsmittelwechsel"
    ],
    [
      "バス停は駅の前です。",
      "Erfrage die Busnummer.",
      "何番のバスですか。",
      "どのバスに乗ればいいですか。",
      "駅はどこですか。",
      "Du bist bereits am Bahnhof; gefragt ist die Buslinie.",
      "Linie"
    ],
    [
      "三番のバスです。",
      "Bestätige die dritte Buslinie und danke.",
      "三番ですね。ありがとうございます。",
      "わかりました。三番のバスですね。",
      "一番のバスですね。",
      "Die erste ist nicht die genannte dritte Buslinie.",
      "Bestätigung"
    ]
  ],
  "returnCue": [
    "Die U-Bahn fährt nicht. Erkläre, dass du stattdessen mit dem Bus zum Museum fährst.",
    "では、バスで美術館に行きます。",
    "バスで美術館へ行きます。",
    "地下鉄で美術館に行きました。",
    "Verkehrsmittel und Zeitform passen nicht zum neuen Plan."
  ]
}),
  makeP41Arc({
  "id": "reserved-book",
  "level": "A2",
  "units": [
    "p25:library",
    "p26:library-project"
  ],
  "title": "Ausgeliehenes Buch reservieren",
  "setting": "Ein Buch ist bereits verliehen. Du passt die ursprüngliche Ausleihbitte an.",
  "pivotTurn": 3,
  "outcome": "Reservierung mit Abholung am kommenden Montag.",
  "turns": [
    [
      "何の本を探していますか。",
      "Erkläre, dass du das Japanischbuch suchst.",
      "この日本語の本を探しています。",
      "この本を借りたいです。",
      "この本を買いました。",
      "Ein Kauf ist nicht die aktuelle Buchsuche.",
      "Buch suchen"
    ],
    [
      "すみません、今は貸し出し中です。",
      "Akzeptiere, dass es derzeit verliehen ist.",
      "そうですか。今は借りられないんですね。",
      "わかりました。今はないんですね。",
      "では、今借ります。",
      "Jetzt ausleihen ist gerade nicht möglich.",
      "Verfügbarkeit"
    ],
    [
      "来週なら戻ります。",
      "Bitte nun um Reservierung, nicht um direkte Ausleihe.",
      "では、予約できますか。",
      "来週のために予約してもいいですか。",
      "では、今返します。",
      "返す ist Zurückgeben; du möchtest reservieren.",
      "Reservieren"
    ],
    [
      "はい。お名前をお願いします。",
      "Nenne den Namen Emi.",
      "エミです。よろしくお願いします。",
      "名前はエミです。",
      "あなたはエミです。",
      "Damit würdest du die Mitarbeiterin Emi nennen.",
      "Name"
    ],
    [
      "来週の月曜日に来てください。",
      "Bestätige Montag nächster Woche.",
      "来週の月曜日ですね。ありがとうございます。",
      "月曜日に来ます。ありがとうございます。",
      "今週の月曜日ですね。",
      "今週 verwechselt diese mit nächster Woche.",
      "Abholtermin"
    ]
  ],
  "returnCue": [
    "Ein anderes Buch ist erst am Freitag verfügbar. Bitte um Reservierung.",
    "金曜日のために予約できますか。",
    "金曜日に予約できますか。",
    "今すぐ借りました。",
    "Die Reservierung ist weder bereits erledigt noch sofortige Ausleihe."
  ]
}),
  makeP41Arc({
  "id": "cafe-sold-out",
  "level": "A1",
  "units": [
    "p23:cafe",
    "p26:cafe-conversation"
  ],
  "title": "Kuchen ausverkauft",
  "setting": "Du bestellst Kaffee und Kuchen; der Käsekuchen ist ausverkauft. Der Kaffee soll bleiben.",
  "pivotTurn": 3,
  "outcome": "Schokoladenkuchen ersetzt Käsekuchen, Kaffee bleibt.",
  "turns": [
    [
      "ご注文は何ですか。",
      "Bestelle einen Kaffee und einen Käsekuchen.",
      "コーヒーとチーズケーキを一つずつお願いします。",
      "コーヒーを一つとチーズケーキを一つください。",
      "コーヒーだけお願いします。",
      "だけ lässt den gewünschten Kuchen weg.",
      "Bestellung"
    ],
    [
      "チーズケーキは今日はありません。",
      "Bestätige, dass der Kuchen ausverkauft ist.",
      "そうですか。わかりました。",
      "チーズケーキはないんですね。",
      "チーズケーキを二つください。",
      "Mehr zu bestellen löst die Nichtverfügbarkeit nicht.",
      "Nichtverfügbarkeit"
    ],
    [
      "チョコレートケーキならあります。",
      "Ersetze nur den Kuchen durch Schokoladenkuchen.",
      "では、チョコレートケーキを一つお願いします。",
      "チョコレートケーキにします。",
      "では、コーヒーをやめます。",
      "Du solltest den Kaffee nicht abbestellen.",
      "Ersatz"
    ],
    [
      "コーヒーも一つでいいですか。",
      "Bestätige den einen Kaffee ausdrücklich.",
      "はい、コーヒーも一つお願いします。",
      "はい、コーヒーは一つでお願いします。",
      "いいえ、コーヒーは要りません。",
      "Du würdest den Kaffee ungewollt stornieren.",
      "Bestellung erhalten"
    ],
    [
      "かしこまりました。",
      "Beende höflich die Bestellung.",
      "ありがとうございます。",
      "お願いします。ありがとうございます。",
      "ケーキは要りません。",
      "Der Kuchen wurde ersetzt, nicht gestrichen.",
      "Abschluss"
    ]
  ],
  "returnCue": [
    "Im nächsten Café gibt es keinen Erdbeerkuchen; bestelle Schokoladenkuchen und behalte den Tee.",
    "チョコレートケーキと紅茶を一つずつお願いします。",
    "チョコレートケーキを一つ、紅茶もお願いします。",
    "紅茶は要りません。",
    "Tee bleibt Bestandteil deiner Bestellung."
  ]
}),
  makeP41Arc({
  "id": "meeting-time",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p26:weekend-switch"
  ],
  "title": "Uhrzeit neu verhandeln",
  "setting": "Ein Treffen soll am Sonntag stattfinden. 14 Uhr passt nicht; der Tag bleibt unverändert.",
  "pivotTurn": 3,
  "outcome": "Sonntag, 16 Uhr, vor dem Bahnhof.",
  "turns": [
    [
      "日曜日に会えますか。",
      "Bestätige den Sonntag.",
      "はい、日曜日なら大丈夫です。",
      "はい、日曜日に会えます。",
      "いいえ、日曜日は無理です。",
      "Du sollst zustimmen, nicht absagen.",
      "Tag"
    ],
    [
      "午後二時はどうですか。",
      "Lehne 14 Uhr höflich ab.",
      "すみません、午後二時は予定があります。",
      "二時はちょっと難しいです。",
      "はい、二時で大丈夫です。",
      "Damit bestätigst du die unmögliche Uhrzeit.",
      "Uhrzeit"
    ],
    [
      "では、午後四時は？",
      "Akzeptiere den Ersatztermin 16 Uhr.",
      "はい、午後四時でお願いします。",
      "午後四時なら大丈夫です。",
      "午後二時でお願いします。",
      "Du greifst auf die abgelehnte Uhrzeit zurück.",
      "Ersatzzeit"
    ],
    [
      "駅の前でいいですか。",
      "Bestätige den Bahnhofsvorplatz.",
      "はい、駅の前で会いましょう。",
      "はい、駅の前で大丈夫です。",
      "駅まで行きました。",
      "Eine vergangene Fahrt bestätigt keinen Treffpunkt.",
      "Treffpunkt"
    ],
    [
      "では、日曜日の四時に。",
      "Fasse Sonntag, 16 Uhr höflich zusammen.",
      "日曜日の午後四時ですね。よろしくお願いします。",
      "はい、日曜日の午後四時に。",
      "土曜日の午後四時ですね。",
      "Der Trefftag ist weiterhin Sonntag.",
      "Zusammenfassung"
    ]
  ],
  "returnCue": [
    "Ein neuer Trefftermin wird von Mittwoch auf Donnerstag um 17 Uhr verschoben. Bestätige.",
    "木曜日の午後五時ですね。",
    "木曜日の午後五時でお願いします。",
    "水曜日の午後五時ですね。",
    "Der alte Tag ist nicht mehr gültig."
  ]
}),
  makeP41Arc({
  "id": "wrong-umbrella",
  "level": "A2",
  "units": [
    "p25:lostfound",
    "p23:ownership"
  ],
  "title": "Falscher Schirm",
  "setting": "Im Fundbüro wird dir zuerst ein roter Schirm gezeigt. Du suchst aber einen schwarzen.",
  "pivotTurn": 3,
  "outcome": "Der schwarze Schirm wird als dein Eigentum erkannt.",
  "turns": [
    [
      "何をなくしましたか。",
      "Beschreibe deinen verlorenen schwarzen Schirm.",
      "黒い傘をなくしました。",
      "私の黒い傘がありません。",
      "赤い傘を買いました。",
      "Es geht um Verlust, nicht Kauf, und um Schwarz.",
      "Gegenstand"
    ],
    [
      "この赤い傘ですか。",
      "Lehne den roten Schirm höflich ab.",
      "いいえ、それは私の傘ではありません。",
      "いいえ、私のは黒い傘です。",
      "はい、それが私の傘です。",
      "Du bestätigst sonst den falschen Schirm.",
      "Falsche Identität"
    ],
    [
      "では、この黒い傘は？",
      "Bestätige, dass der schwarze Schirm deiner ist.",
      "はい、それが私の傘です。",
      "はい、この黒い傘は私のです。",
      "いいえ、その赤い傘です。",
      "Du würdest zum falschen roten Schirm zurückkehren.",
      "Richtigen identifizieren"
    ],
    [
      "どこでなくしましたか。",
      "Nenne den Bahnhof als Verlustort.",
      "駅でなくしました。",
      "駅で傘をなくしました。",
      "駅に行きます。",
      "Ein Fahrtziel beantwortet nicht die Frage nach dem Verlustort.",
      "Verlustort"
    ],
    [
      "こちらにお名前を書いてください。",
      "Stimme zu, deinen Namen aufzuschreiben.",
      "はい、名前を書きます。",
      "わかりました。ここに書きます。",
      "いいえ、傘を買います。",
      "Eine Kaufabsicht ersetzt das Namensfeld nicht.",
      "Abholung"
    ]
  ],
  "returnCue": [
    "Dir wird eine blaue Tasche gezeigt, aber du suchst eine schwarze. Lehne die falsche Tasche ab.",
    "いいえ、私のは黒いかばんです。",
    "いいえ、この青いかばんは私のではありません。",
    "はい、青いかばんが私のです。",
    "Bestätige nicht die falsche Farbe."
  ]
})
];
