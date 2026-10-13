import {makeP45Challenge} from "./independence45-authoring";
/** Six original A1–A2 appointments, volunteer work and personal coordination situations. */
export const p45CorpusC=[
makeP45Challenge({
  "id": "clinic-reschedule-polite",
  "title": "Arzttermin nach Terminfehler",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p26:weekend-switch"
  ],
  "parentCase": "missed-appointment",
  "relationship": "Empfangsmitarbeiterin, höflich",
  "setting": "Du rufst in einer Praxis an. Ein vermeintlicher Termin liegt gleichzeitig mit deinem Unterricht.",
  "purpose": "Fehler korrigieren, neuen Termin wählen und Zeit bestätigen.",
  "unexpected": "Dienstag 15 Uhr ist ebenfalls belegt; Donnerstag 9 Uhr ist frei.",
  "outcome": "Du vereinbarst Donnerstag um neun Uhr.",
  "turns": [
    [
      "お名前と予約の日を教えてください。",
      "Nenne deinen Namen Ito und den Mittwoch.",
      "伊藤です。水曜日に予約しています。",
      "伊藤と申します。水曜日の予約です。",
      "田中です。月曜日に行きました。",
      "Name und Datum passen nicht zu deinem Termin.",
      "Halte die Person und den Wochentag korrekt."
    ],
    [
      "水曜日の十時ですね。",
      "Erkläre höflich, dass du zu dieser Zeit Unterricht hast und einen anderen Termin brauchst.",
      "すみません、十時は授業があります。変更できますか。",
      "水曜日の十時は難しいです。別の日はありますか。",
      "はい、十時でお願いします。",
      "Du könntest wegen Unterricht nicht erscheinen.",
      "Eine Zusage ohne Zeitabgleich wäre unzuverlässig."
    ],
    [
      "火曜日の三時も満員です。木曜日の九時なら空いています。",
      "Nimm Donnerstag 9 Uhr ausdrücklich an.",
      "木曜日の九時でお願いします。",
      "では、木曜日の午前九時に伺います。",
      "火曜日の三時でお願いします。",
      "Dienstag um drei ist ebenfalls ausgebucht.",
      "Ein anderer freier Termin ersetzt die alte Option."
    ],
    [
      "木曜日の九時に変更しました。",
      "Bestätige die Änderung und bedanke dich.",
      "木曜日の九時ですね。ありがとうございます。",
      "変更ありがとうございます。九時に行きます。",
      "水曜日の十時に行きます。",
      "Die alte Terminkollision ist bereits aufgehoben.",
      "Die Praxis erwartet dich Donnerstag um neun."
    ]
  ],
  "returnCue": [
    "Eine andere Praxis hat nur Freitag um 11 Uhr frei. Bestätige höflich diesen Termin.",
    "金曜日の十一時でお願いします。",
    "金曜日の午前十一時に伺います。",
    "木曜日の十一時でお願いします。",
    "Du musst den neu angebotenen Freitag bestätigen."
  ]
}),
makeP45Challenge({
  "id": "school-festival-volunteer",
  "title": "Helferdienst beim Schulfest",
  "level": "A2",
  "units": [
    "p23:plans",
    "p25:appointment"
  ],
  "parentCase": "new-volunteer",
  "relationship": "freiwillige Helferin und Organisator, höflich",
  "setting": "Du willst beim Schulfest helfen. Der Empfang braucht Hilfe, die Essensausgabe nicht.",
  "purpose": "Sinnvollen Dienst erfragen, Aufgabenbereich und Beginn klären.",
  "unexpected": "Die Essensausgabe ist voll besetzt; beim Empfang fehlen ab 10 Uhr Helfer.",
  "outcome": "Du hilfst ab zehn Uhr am Empfang.",
  "turns": [
    [
      "今日は手伝えますか。",
      "Sage höflich zu, dass du helfen möchtest.",
      "はい、手伝いたいです。",
      "はい、何かできることはありますか。",
      "昨日手伝いました。",
      "Vergangenheit beantwortet die heutige Hilfsbereitschaft nicht.",
      "Du willst tatsächlich helfen."
    ],
    [
      "食事の係はどうですか。",
      "Sage, dass du zuerst gern beim Essen helfen würdest.",
      "食事の係を手伝ってもいいですか。",
      "はい、食事の係に興味があります。",
      "食事の係が嫌いです。",
      "Das widerspricht dem geäußerten Interesse.",
      "Du erkundigst dich zunächst nach der Essensausgabe."
    ],
    [
      "すみません、食事の係は足りています。受付なら十時からお願いします。",
      "Wechsle zum Empfang und bestätige zehn Uhr.",
      "では、十時から受付を手伝います。",
      "受付で十時からお願いします。",
      "では、食事の係を続けます。",
      "Dort wird keine zusätzliche Hilfe gebraucht.",
      "Ändere die Aufgabe, nicht deinen Wunsch zu helfen."
    ],
    [
      "名前を書いてから受付に来てください。",
      "Bestätige Anmeldung und anschließend Empfang.",
      "はい、名前を書いてから受付に行きます。",
      "わかりました。先に名前を書きます。",
      "名前を書かないで帰ります。",
      "Die Registrierung ist vor Dienstbeginn erforderlich.",
      "Die Reihenfolge bleibt wichtig."
    ]
  ],
  "returnCue": [
    "Bei einem anderen Fest ist nur die Aufräumhilfe ab 16 Uhr nötig. Sage höflich zu.",
    "午後四時から片付けを手伝います。",
    "四時からお手伝いします。",
    "午前九時から食事を作ります。",
    "Der aktuelle Bedarf liegt beim Aufräumen ab vier."
  ]
}),
makeP45Challenge({
  "id": "concert-ticket-change",
  "title": "Ausverkauftes Konzert, neuer Sitzplatz",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p23:plans"
  ],
  "parentCase": "movie-soldout",
  "relationship": "Ticketverkäufer, höflich",
  "setting": "Du möchtest zwei Konzertkarten nebeneinander kaufen; die günstige Reihe ist ausverkauft.",
  "purpose": "Sitznachbarschaft und Preis klären, ehe du Karten kaufst.",
  "unexpected": "Nur zwei teurere Plätze nebeneinander sind verfügbar.",
  "outcome": "Du entscheidest dich für zwei nebeneinanderliegende Plätze der anderen Kategorie.",
  "turns": [
    [
      "チケットは何枚ですか。",
      "Bitte um zwei nebeneinanderliegende Karten.",
      "二枚お願いします。隣の席がいいです。",
      "二人で隣に座りたいです。",
      "一枚でお願いします。",
      "Du brauchst Karten für zwei Personen.",
      "Beide müssen gemeinsam sitzen können."
    ],
    [
      "安い席は売り切れました。",
      "Frage nach anderen nebeneinanderliegenden Plätzen.",
      "ほかに隣の席はありますか。",
      "別の席を二枚取れますか。",
      "では、安い席を二枚ください。",
      "Die günstigen Plätze sind ausverkauft.",
      "Der ursprüngliche Preiswunsch muss neu geprüft werden."
    ],
    [
      "少し高い席なら、二つ並んでいます。",
      "Bitte um den Preis dieser Plätze.",
      "その席はいくらですか。",
      "二枚でいくらになりますか。",
      "では、別々の席をください。",
      "Du möchtest nebeneinandersitzen, nicht getrennt.",
      "Akzeptiere den höheren Preis nicht blind."
    ],
    [
      "二枚で六千円です。",
      "Bestätige beide Tickets zum Gesamtpreis.",
      "六千円ですね。二枚お願いします。",
      "では、隣の席を二枚ください。",
      "一枚で六千円ですね。",
      "Der Gesamtbetrag gilt für beide Karten.",
      "Du schließt den Kauf der zwei zusammenliegenden Plätze ab."
    ]
  ],
  "returnCue": [
    "Ein anderes Kino hat nur zwei nebeneinanderliegende Plätze für 4000 Yen. Bestätige zwei Karten.",
    "二枚で四千円ですね。お願いします。",
    "隣の席を二枚ください。",
    "一枚で四千円ですね。",
    "Der Preis bezieht sich auf zwei Karten."
  ]
}),
makeP45Challenge({
  "id": "tandem-new-partner",
  "title": "Neue Sprachpartnerin mit anderem Zeitplan",
  "level": "A2",
  "units": [
    "p23:introduction",
    "p26:library-project"
  ],
  "parentCase": "hesitate-invitation",
  "relationship": "neue Tandempartnerin, höflich",
  "setting": "Beim ersten Sprachaustausch möchte die andere Person Englisch üben, du aber Japanisch.",
  "purpose": "Beide Sprachziele berücksichtigen und die verbleibenden 20 Minuten aufteilen.",
  "unexpected": "Nach zehn Minuten muss deine Partnerin schon gehen.",
  "outcome": "Ihr sprecht noch fünf Minuten auf Japanisch und vereinbart einen neuen Termin.",
  "turns": [
    [
      "はじめまして。今日は何語で話しますか。",
      "Schlage einen Wechsel zwischen Englisch und Japanisch vor.",
      "英語と日本語を練習しませんか。",
      "両方の言葉で話しましょうか。",
      "英語だけでいいです。",
      "Du willst selbst auch Japanisch üben.",
      "Beide Personen sollen vom Treffen profitieren."
    ],
    [
      "では、十分ずつ話しましょう。",
      "Nimm zehn Minuten pro Sprache an.",
      "はい、十分ずつお願いします。",
      "いいですね。まず英語で話しましょう。",
      "一時間ずつ話しましょう。",
      "Ihr habt nur zwanzig Minuten vorgesehen.",
      "Behalte die knappe Zeit im Blick."
    ],
    [
      "すみません、もう十分後に帰らないといけません。",
      "Schlage vor, die restliche Zeit auf Japanisch zu sprechen.",
      "では、残りは日本語で話しませんか。",
      "あと十分、日本語でいいですか。",
      "では、一時間日本語で話します。",
      "Ihr bleiben nur noch zehn Minuten.",
      "Die ursprüngliche Zeitteilung muss verkürzt werden."
    ],
    [
      "五分だけなら大丈夫です。また来週会えますか。",
      "Bestätige fünf Minuten und schlage nächste Woche vor.",
      "はい、五分話しましょう。来週も会いたいです。",
      "来週もよろしくお願いします。",
      "いいえ、今日は一時間話しましょう。",
      "Die Zeitbegrenzung wurde zweimal erklärt.",
      "Der spätere Termin hält den Austausch aufrecht."
    ]
  ],
  "returnCue": [
    "Ein anderer Sprachpartner hat nur zehn Minuten. Schlage vor, davon fünf Minuten Japanisch zu sprechen.",
    "五分、日本語で話しませんか。",
    "日本語を五分だけ練習してもいいですか。",
    "一時間、日本語で話しましょう。",
    "Die verfügbare Zeit ist nur zehn Minuten."
  ]
}),
makeP45Challenge({
  "id": "lost-key-neighbor",
  "title": "Schlüssel bei der Nachbarin abholen",
  "level": "A2",
  "units": [
    "p25:lostfound",
    "p23:ownership"
  ],
  "parentCase": "neighbor-keys",
  "relationship": "ältere Nachbarin, höflich",
  "setting": "Eine ältere Nachbarin hat einen Schlüssel gefunden. Zunächst zeigt sie dir den falschen Bund.",
  "purpose": "Mit präzisen Merkmalen erklären, welcher Schlüssel deiner ist.",
  "unexpected": "Der erste Bund ist rot markiert, dein Schlüssel hat einen blauen Anhänger.",
  "outcome": "Die Nachbarin erkennt deinen Schlüssel am blauen Anhänger.",
  "turns": [
    [
      "鍵を探していますか。",
      "Bestätige, dass du einen Schlüssel verloren hast.",
      "はい、鍵をなくしました。",
      "はい、鍵を探しています。",
      "昨日、鍵を買いました。",
      "Ein Kauf ist keine Verlustmeldung.",
      "Du suchst den verlorenen eigenen Gegenstand."
    ],
    [
      "この赤い飾りの鍵ですか。",
      "Erkläre höflich, dass dein Anhänger blau ist.",
      "すみません、私のは青い飾りが付いています。",
      "いいえ、青い飾りの鍵です。",
      "はい、赤い鍵です。",
      "Der rote Anhänger gehört nicht dir.",
      "Korrigiere das Unterscheidungsmerkmal, nicht nur die Farbe des Metalls."
    ],
    [
      "青い飾りの鍵は二つあります。",
      "Erkläre, dass deiner zwei Schlüssel am Bund hat.",
      "私のには鍵が二つ付いています。",
      "鍵が二つあるほうです。",
      "鍵が一つしかありません。",
      "Das würde ein anderes Schlüsselbündel bezeichnen.",
      "Jetzt reicht die Anhängerfarbe allein nicht mehr aus."
    ],
    [
      "これですね。二つ付いています。",
      "Bestätige den richtigen Fund und bedanke dich.",
      "はい、それです。ありがとうございます。",
      "私の鍵です。本当に助かりました。",
      "いいえ、赤いほうです。",
      "Der rote Bund wurde bereits abgelehnt.",
      "Farbe und Anzahl identifizieren deinen Besitz."
    ]
  ],
  "returnCue": [
    "Eine Nachbarin hält zwei schwarze Taschen; deine hat einen weißen Anhänger. Beschreibe sie höflich.",
    "私のは白い飾りが付いた黒いかばんです。",
    "白い飾りのある黒いかばんを探しています。",
    "赤いかばんを探しています。",
    "Die entscheidenden Merkmale sind schwarz und weißer Anhänger."
  ]
}),
makeP45Challenge({
  "id": "booking-multi-day",
  "title": "Hotelbuchung und Frühstück",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p25:shopping"
  ],
  "parentCase": "wrong-reservation-day",
  "relationship": "Hotelrezeption, höflich",
  "setting": "Du hast von Freitag bis Sonntag reserviert und möchtest Frühstück ergänzen.",
  "purpose": "Übernachtungstage korrigieren und Frühstück nur für Samstag dazubuchen.",
  "unexpected": "Im System steht Anreise Samstag statt Freitag.",
  "outcome": "Der Aufenthalt beginnt korrekt Freitag und Frühstück ist am Samstag enthalten.",
  "turns": [
    [
      "お名前とご予約をお願いします。",
      "Nenne den Namen Sato und die Reservierung von Freitag bis Sonntag.",
      "佐藤です。金曜日から日曜日まで予約しました。",
      "佐藤です。二泊予約しています。",
      "日曜日から火曜日まで予約しました。",
      "Das wäre ein anderer Zeitraum.",
      "Die Anreise ist Freitag, Abreise Sonntag."
    ],
    [
      "土曜日から二泊ですね。",
      "Korrigiere die falsche Anreise auf Freitag.",
      "すみません、土曜日ではなく金曜日からです。",
      "金曜日から日曜日までです。",
      "はい、土曜日からです。",
      "Sonst würdest du eine Nacht verlieren.",
      "Korrigiere nur das falsch gespeicherte Datum."
    ],
    [
      "確認できました。金曜日からですね。朝食はどうしますか。",
      "Bitte um Frühstück ausschließlich am Samstag.",
      "土曜日の朝だけお願いします。",
      "土曜日だけ朝食を付けたいです。",
      "毎朝、朝食をお願いします。",
      "Du möchtest Frühstück nicht an jedem Morgen.",
      "Die Zusatzleistung ist auf Samstag beschränkt."
    ],
    [
      "土曜日の朝食を付けました。",
      "Bestätige den korrigierten Aufenthalt und Frühstück.",
      "ありがとうございます。金曜日から日曜日までですね。",
      "土曜日の朝食ですね。ありがとうございます。",
      "日曜日から火曜日までですね。",
      "Das kehrt zum falschen Buchungszeitraum zurück.",
      "Beide Buchungsänderungen sind nun geklärt."
    ]
  ],
  "returnCue": [
    "Eine andere Buchung läuft Montag bis Mittwoch. Bitte höflich nur um Frühstück am Dienstag.",
    "火曜日の朝だけ朝食をお願いします。",
    "火曜日だけ朝食を付けたいです。",
    "毎朝、朝食をお願いします。",
    "Die Zusatzleistung ist auf Dienstag begrenzt."
  ]
})
];