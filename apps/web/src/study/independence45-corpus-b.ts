import {makeP45Challenge} from "./independence45-authoring";
/** Six original independent shopping, academic and navigation dialogues. */
export const p45CorpusB=[
makeP45Challenge({
  "id": "supermarket-budget",
  "title": "Mit Preisgrenze im Laden",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p23:ownership"
  ],
  "parentCase": "unsure-price",
  "relationship": "Verkäuferin im Geschenkgeschäft, höflich",
  "setting": "Du suchst ein kleines Geschenk, darfst aber nicht mehr als 2000 Yen ausgeben.",
  "purpose": "Erkläre die Preisgrenze, korrigiere eine zu teure Empfehlung und bestätige den Ersatz.",
  "unexpected": "Der empfohlene Becher kostet 2500 Yen; der günstigere kostet 1800.",
  "outcome": "Du kaufst den 1800-Yen-Becher und bleibst im Budget.",
  "turns": [
    [
      "何をお探しですか。",
      "Bitte um ein Geschenk unter zweitausend Yen.",
      "二千円以下のプレゼントを探しています。",
      "二千円までのものはありますか。",
      "三千円のものをください。",
      "3000 Yen überschreiten die Preisgrenze.",
      "Die Höchstgrenze bleibt 2000 Yen."
    ],
    [
      "このカップはいかがですか。",
      "Frage höflich nach dem Preis.",
      "これはいくらですか。",
      "このカップの値段を教えてください。",
      "もう買いました。",
      "Du kennst den Preis noch nicht und hast nicht bezahlt.",
      "Prüfe den Preis vor der Zusage."
    ],
    [
      "二千五百円です。こちらは千八百円です。",
      "Lehne den teuren Becher ab und wähle den günstigeren.",
      "では、千八百円のほうをお願いします。",
      "二千円以下のこちらにします。",
      "二千五百円のほうをください。",
      "2500 Yen sind über deinem Limit.",
      "Die neue Information verlangt eine Änderung der Auswahl."
    ],
    [
      "千八百円ですね。プレゼント用に包みますか。",
      "Bitte um Geschenkverpackung.",
      "はい、プレゼント用にお願いします。",
      "包んでいただけますか。",
      "いいえ、二千五百円です。",
      "Der Preis ist 1800 und die Frage betrifft Verpackung.",
      "Preis und Geschenkzweck sind nun geklärt."
    ]
  ],
  "returnCue": [
    "In einem anderen Laden hast du 1000 Yen Budget. Lehne einen Artikel für 1300 ab und frage nach etwas Günstigerem.",
    "千円以下のものはありますか。",
    "すみません、もう少し安いものをお願いします。",
    "千三百円のものをください。",
    "Der Artikel würde dein Budget überschreiten."
  ]
}),
makeP45Challenge({
  "id": "cashless-payment",
  "title": "Kartenzahlung ist heute unmöglich",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p23:cafe"
  ],
  "parentCase": "cafe-customer",
  "relationship": "Cafépersonal, höflich",
  "setting": "Du hast Kaffee bestellt und möchtest mit Karte bezahlen. Das Lesegerät funktioniert nicht.",
  "purpose": "Zahlungsart ändern, ohne die Bestellung versehentlich zu stornieren.",
  "unexpected": "Kartenzahlung ist ausgefallen; du hast Bargeld dabei.",
  "outcome": "Der Kaffee bleibt bestellt und du bezahlst bar.",
  "turns": [
    [
      "コーヒーを一つですね。",
      "Bestätige die einzelne Kaffeebestellung.",
      "はい、コーヒーを一つお願いします。",
      "はい、それでお願いします。",
      "コーヒーを二つお願いします。",
      "Du möchtest nur einen Kaffee.",
      "Menge und Getränk sollen gleich bleiben."
    ],
    [
      "お支払いはどうしますか。",
      "Sage, dass du gern mit Karte zahlen würdest.",
      "カードで払いたいです。",
      "カードでお願いします。",
      "昨日カードで払いました。",
      "Vergangenheitsform ist keine heutige Zahlungsentscheidung.",
      "Du hast zunächst Kartenzahlung gewünscht."
    ],
    [
      "申し訳ありません。今日はカードが使えません。",
      "Wechsle auf Bargeld und behalte den Kaffee.",
      "わかりました。現金で払います。",
      "では、現金でお願いします。",
      "じゃ、コーヒーをキャンセルします。",
      "Du hast Bargeld; eine Stornierung ist nicht nötig.",
      "Nur die Zahlungsweise wird geändert."
    ],
    [
      "四百円になります。",
      "Bestätige und überreiche 400 Yen.",
      "四百円ですね。はい、どうぞ。",
      "はい、四百円です。",
      "四千円ですね。",
      "4000 Yen sind ein anderer Betrag.",
      "Du schließt die Bestellung mit Barzahlung ab."
    ]
  ],
  "returnCue": [
    "Ein neuer Laden kann heute keine Karten annehmen. Sage höflich, dass du bar zahlst.",
    "では、現金で払います。",
    "現金でお願いします。",
    "カードで払いました。",
    "Die Karte funktioniert dort gerade nicht."
  ]
}),
makeP45Challenge({
  "id": "restaurant-no-nuts",
  "title": "Speise mit Nüssen erkennen",
  "level": "A2",
  "units": [
    "p23:cafe",
    "p25:shopping"
  ],
  "parentCase": "meal-ingredients",
  "relationship": "Bedienung, höflich",
  "setting": "Du möchtest im Restaurant kein Gericht mit Nüssen bestellen und erkundigst dich nach Zutaten.",
  "purpose": "Vor dem Bestellen nach der Zutat fragen und bei positivem Befund wechseln.",
  "unexpected": "Die Suppe enthält Nüsse; ein Reisgericht enthält laut Service keine.",
  "outcome": "Du bestellst das Reisgericht statt der Nuss-Suppe.",
  "turns": [
    [
      "何を召し上がりますか。",
      "Frage nach Nüssen in der Suppe.",
      "このスープにナッツは入っていますか。",
      "スープにナッツが入っているか教えてください。",
      "ナッツ入りのスープをください。",
      "Du willst zuerst die Zutaten prüfen.",
      "Eine klare Zutatenfrage geht der Bestellung voraus."
    ],
    [
      "はい、少し入っています。",
      "Sage, dass du etwas ohne Nüsse möchtest.",
      "では、ナッツが入っていないものはありますか。",
      "ナッツなしの料理をお願いします。",
      "では、そのスープをください。",
      "Die Suppe enthält gerade die vermiedene Zutat.",
      "Verwechsle nicht die Antwort mit einer Erlaubnis zum Bestellen."
    ],
    [
      "ご飯の料理にはナッツが入っていません。",
      "Bitte um das neu angebotene Reisgericht.",
      "では、そのご飯の料理をお願いします。",
      "ご飯の料理を一つください。",
      "やっぱりスープにします。",
      "Die Suppe enthält Nüsse und war ausgeschlossen.",
      "Die neue Wahl entspricht deiner zuvor genannten Einschränkung."
    ],
    [
      "お飲み物は何にしますか。",
      "Bitte um Wasser zusätzlich zum Essen.",
      "お水をお願いします。",
      "水を一つください。",
      "ナッツをお願いします。",
      "Die Frage betrifft Getränke und du möchtest Wasser.",
      "Die sichere Alternative und das Getränk bleiben getrennt."
    ]
  ],
  "returnCue": [
    "Eine andere Suppe enthält Sesam, den du vermeiden möchtest. Frage nach einem Gericht ohne Sesam.",
    "ごまが入っていない料理はありますか。",
    "ごまなしの料理をお願いします。",
    "ごま入りのスープをください。",
    "Die Suppe enthält die Zutat, die du vermeiden möchtest."
  ]
}),
makeP45Challenge({
  "id": "classmate-project-scope",
  "title": "Lerngruppe ändert die Aufgabe",
  "level": "A2",
  "units": [
    "p26:library-project",
    "p23:plans"
  ],
  "parentCase": "team-decision",
  "relationship": "zwei gleichaltrige Studienfreunde, locker",
  "setting": "Du bereitest mit Freunden eine Präsentation vor; kurz vor Abgabe wird der Umfang reduziert.",
  "purpose": "Aufgabe, Termin und Zuständigkeit korrekt abstimmen.",
  "unexpected": "Der Lehrer verlangt jetzt nur drei Folien statt fünf; die Deadline bleibt Freitag.",
  "outcome": "Du erstellst drei Folien bis Freitag und gibst die alte Fünf-Folien-Idee auf.",
  "turns": [
    [
      "発表の準備、どうする？",
      "Biete an, fünf Folien zu erstellen.",
      "私がスライドを五枚作るよ。",
      "五枚、作っておくね。",
      "昨日五枚作ったよ。",
      "Du bietest eine zukünftige Arbeit an.",
      "Zunächst war die Aufgabenmenge fünf Folien."
    ],
    [
      "金曜日までにできる？",
      "Bestätige Freitag als Abgabe.",
      "うん、金曜日までにできるよ。",
      "金曜日までに作るね。",
      "土曜日までに作るよ。",
      "Samstag ist später als die Frist.",
      "Die Deadline ist Freitag."
    ],
    [
      "先生から連絡が来たよ。スライドは三枚だけだって。",
      "Passe ausschließlich die Anzahl an.",
      "わかった。三枚にするよ。",
      "じゃ、三枚作るね。",
      "じゃ、五枚作り続ける。",
      "Der Lehrer hat die Menge ausdrücklich auf drei reduziert.",
      "Ändere nur die Anzahl, nicht die Frist."
    ],
    [
      "じゃ、金曜日に送ってくれる？",
      "Versprich drei Folien bis Freitag zu schicken.",
      "うん、三枚を金曜日までに送るね。",
      "わかった。金曜日に送るよ。",
      "来週、五枚送るよ。",
      "Anzahl und Zeit verletzen die neue Vereinbarung.",
      "Sende die fertige Version pünktlich."
    ]
  ],
  "returnCue": [
    "Eine andere Gruppe reduziert ihre geplanten vier Seiten auf zwei, der Termin Dienstag bleibt. Bestätige das.",
    "二ページを火曜日までに書くね。",
    "火曜日までに二ページにするよ。",
    "四ページを水曜日に書くよ。",
    "Menge und Termin wären falsch."
  ]
}),
makeP45Challenge({
  "id": "classmate-review-ask",
  "title": "Kommilitonin um Rückmeldung bitten",
  "level": "A2",
  "units": [
    "p26:library-project",
    "p23:introduction"
  ],
  "parentCase": "check-confusion",
  "relationship": "neue Studienpartnerin, höflich",
  "setting": "Du hast einen kurzen Text geschrieben und möchtest sachliches Feedback. Die andere Person hat wenig Zeit.",
  "purpose": "Bitte begrenzen, späteren Termin annehmen und präzise um eine Korrektur bitten.",
  "unexpected": "Sie kann den Text heute nicht lesen, aber morgen fünf Minuten dafür aufbringen.",
  "outcome": "Du schickst den Text und besprichst morgen eine konkrete Stelle.",
  "turns": [
    [
      "何か手伝いましょうか。",
      "Bitte höflich darum, deinen kurzen Text anzusehen.",
      "短い文章を見てもらえますか。",
      "少し読んでいただけますか。",
      "文章を全部直しなさい。",
      "Das ist ein Befehl statt einer Bitte.",
      "Sie entscheidet freiwillig, ob sie helfen kann."
    ],
    [
      "今日は時間があまりありません。",
      "Erfrage eine spätere Möglichkeit.",
      "では、明日はどうですか。",
      "明日、少し時間がありますか。",
      "今すぐ読んでください。",
      "Sie hat heute wenig Zeit.",
      "Heute ist nicht möglich, ohne dass die Hilfe grundsätzlich entfällt."
    ],
    [
      "明日なら五分ぐらい見られます。",
      "Bitte um kurze Rückmeldung morgen.",
      "ありがとうございます。明日、五分だけお願いします。",
      "明日、少し見てください。",
      "では、今日一時間お願いします。",
      "Die freie Zeit beträgt morgen fünf Minuten.",
      "Passe Umfang und Termin an."
    ],
    [
      "どの部分が一番大事ですか。",
      "Bitte um Prüfung der Einleitung.",
      "最初の部分を見てください。",
      "導入のところをお願いします。",
      "全部の文章を直してください。",
      "Sie hat nur fünf Minuten; der Schwerpunkt soll klar sein.",
      "So kann die begrenzte Zeit sinnvoll genutzt werden."
    ]
  ],
  "returnCue": [
    "Eine andere Kollegin kann deinen Lebenslauf erst Freitag kurz prüfen. Bitte sie um Rückmeldung zur Einleitung.",
    "金曜日に最初の部分を見てもらえますか。",
    "金曜日に導入を確認していただけますか。",
    "今日全部直してください。",
    "Die Hilfe ist nur Freitag und nur kurz verfügbar."
  ]
}),
makeP45Challenge({
  "id": "medicine-pharmacy-location",
  "title": "Apotheke in anderer Straße",
  "level": "A2",
  "units": [
    "p25:directions",
    "p25:shopping"
  ],
  "parentCase": "speaker-misheard",
  "relationship": "fremder Fußgänger, höflich",
  "setting": "Du suchst die Apotheke in der Nähe des Bahnhofs. Ein Passant korrigiert eine veraltete Wegbeschreibung.",
  "purpose": "Nach dem richtigen Laden fragen und die geänderte Richtung übernehmen.",
  "unexpected": "Die frühere Apotheke links ist geschlossen; die neue ist rechts hinter der Bank.",
  "outcome": "Du gehst rechts an der Bank vorbei zur neuen Apotheke.",
  "turns": [
    [
      "何かお探しですか。",
      "Frage höflich nach der Apotheke.",
      "薬局はどこですか。",
      "すみません、この近くに薬局はありますか。",
      "病院に行きました。",
      "Ein Krankenhausbesuch ist keine Ortsfrage.",
      "Das Ziel ist eine Apotheke."
    ],
    [
      "駅の左にありましたよ。",
      "Kläre, ob die Apotheke noch dort ist.",
      "今もそこにありますか。",
      "まだ開いていますか。",
      "じゃ、もう着きました。",
      "Du bist noch nicht dort und weißt nichts über die Öffnung.",
      "Eine Aussage in Vergangenheit kann veraltet sein."
    ],
    [
      "あ、そこは閉店しました。今は銀行の右側です。",
      "Bestätige die neue Lage rechts der Bank.",
      "銀行の右側ですね。ありがとうございます。",
      "では、銀行の右に行きます。",
      "では、駅の左に行きます。",
      "Die frühere Stelle ist geschlossen.",
      "Die Änderung ersetzt die alte Linksangabe."
    ],
    [
      "銀行を過ぎたら、すぐ見えますよ。",
      "Bestätige die Orientierung hinter der Bank.",
      "銀行を過ぎてから探します。ありがとうございます。",
      "わかりました。銀行の先ですね。",
      "銀行の前で帰ります。",
      "Die Apotheke liegt erst hinter der Bank.",
      "Nutze die gesamte korrigierte Wegbeschreibung."
    ]
  ],
  "returnCue": [
    "Ein Museum ist nicht mehr links vom Rathaus, sondern rechts hinter dem Park. Bestätige den neuen Ort.",
    "公園の先の右側ですね。",
    "右側に行って、公園の先を探します。",
    "市役所の左ですね。",
    "Die alte Richtung ist nicht mehr gültig."
  ]
})
];