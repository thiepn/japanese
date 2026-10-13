import {makeP45Challenge} from "./independence45-authoring";
/** Six original school, café, plans and service conversations; four turns each. */
export const p45CorpusA=[
makeP45Challenge({
  "id": "campus-bus-switch",
  "title": "Umleitung zur Universität",
  "level": "A2",
  "units": [
    "p26:station-to-campus",
    "p25:transport"
  ],
  "parentCase": "speaker-misheard",
  "relationship": "unbekannter Verkehrsmitarbeiter, höflich",
  "setting": "Du willst zur Universität. Wegen Bauarbeiten ändern sich die Verkehrsmittel.",
  "purpose": "Kläre Weg, Umstieg und den endgültigen Zielhalt.",
  "unexpected": "Der gewöhnliche direkte Bus fällt unerwartet aus.",
  "outcome": "Du nimmst Bus zwei, steigst am Rathaus um und steigst an der Universität aus.",
  "turns": [
    [
      "どちらまで行きますか。",
      "Nenne die Universität als Ziel.",
      "大学まで行きたいです。",
      "大学に行きたいです。",
      "駅まで行きたいです。",
      "Der Bahnhof ist Ausgangsort und nicht dein Ziel.",
      "Halte das Ziel Universität in allen weiteren Antworten fest."
    ],
    [
      "大学へは一番のバスです。",
      "Frage nach dem richtigen Einstieg.",
      "一番のバスはどこから出ますか。",
      "乗り場はどこですか。",
      "一番のバスに乗りました。",
      "Eine vergangene Fahrt klärt den noch unbekannten Einstieg nicht.",
      "Zunächst wurde Linie eins empfohlen."
    ],
    [
      "すみません、一番は運休です。二番で市役所まで行ってください。",
      "Übernimm die Änderung und frage nach dem Umstieg am Rathaus.",
      "では、二番のバスに乗ります。市役所で乗り換えますか。",
      "二番で市役所まで行けばいいですか。",
      "では、一番のバスを待ちます。",
      "運休 bedeutet, dass Linie eins nicht fährt.",
      "Die neue Route führt zunächst zum Rathaus."
    ],
    [
      "はい。市役所で乗り換えて、大学前で降りてください。",
      "Bestätige Umstieg und Endhaltestelle.",
      "市役所で乗り換えて、大学前で降りますね。ありがとうございます。",
      "わかりました。大学前で降ります。",
      "市役所で降りて終わりですね。",
      "Das Rathaus ist nur Umstieg, nicht das endgültige Ziel.",
      "Die Fahrt endet erst an der Haltestelle vor der Universität."
    ]
  ],
  "returnCue": [
    "Eine andere Linie zum Museum fällt aus. Frage höflich, ob du stattdessen Linie drei nehmen kannst.",
    "三番のバスで美術館まで行けますか。",
    "代わりに三番のバスに乗ってもいいですか。",
    "運休のバスを待ちます。",
    "Ein ausgefallener Bus ist keine verfügbare Alternative."
  ]
}),
makeP45Challenge({
  "id": "library-loan-deadline",
  "title": "Ein Buch mit enger Rückgabefrist",
  "level": "A2",
  "units": [
    "p25:library",
    "p26:library-project"
  ],
  "parentCase": "library-permission",
  "relationship": "Bibliothekspersonal, höflich",
  "setting": "Du brauchst ein ausgeliehenes Lehrbuch mehrere Tage; die Bibliothek nennt erst beim Ausleihen eine kürzere Frist.",
  "purpose": "Leihberechtigung, Rückgabefrist und eine mögliche Alternative klären.",
  "unexpected": "Das Buch wird bereits am Donnerstag von einem anderen Leser gebraucht.",
  "outcome": "Du gibst es Donnerstag zurück und nutzt danach die digitale Ausgabe.",
  "turns": [
    [
      "この本を借りますか。",
      "Bitte höflich darum, das Buch auszuleihen.",
      "はい、この本を借りたいです。",
      "この本を借りてもいいですか。",
      "この本を買いました。",
      "Ein Kauf ist keine Ausleihanfrage.",
      "Du möchtest lesen, aber das Buch gehört der Bibliothek."
    ],
    [
      "いつまで必要ですか。",
      "Sage, dass du es bis Freitag brauchst.",
      "金曜日まで必要です。",
      "金曜日まで借りたいです。",
      "金曜日に返しました。",
      "Eine bereits erfolgte Rückgabe passt nicht zur aktuellen Bitte.",
      "Freitag war zunächst dein Plan."
    ],
    [
      "すみません、木曜日に別の方の予約があります。",
      "Akzeptiere die Grenze und frage nach digitaler Fortsetzung.",
      "では、木曜日に返します。電子版はありますか。",
      "木曜日まで借りて、電子版を使えますか。",
      "では、金曜日まで借ります。",
      "Ein anderer Leser hat die Reservierung für Donnerstag.",
      "Die ursprüngliche Freitagsabsicht muss der bestehenden Reservierung weichen."
    ],
    [
      "電子版なら金曜日も使えます。",
      "Bestätige die Rückgabe und digitale Nutzung.",
      "木曜日に返して、金曜日は電子版を読みます。",
      "わかりました。木曜日に返します。ありがとうございます。",
      "金曜日に本を返します。",
      "Das Papierexemplar muss bereits Donnerstag zurück.",
      "Das digitale Exemplar ersetzt das Buch ab Freitag."
    ]
  ],
  "returnCue": [
    "Ein Lehrbuch muss am Dienstag zurück; du brauchst es Mittwoch. Frage nach einer digitalen Ausgabe.",
    "火曜日に返します。電子版はありますか。",
    "水曜日に読める電子版はありますか。",
    "水曜日まで紙の本を借ります。",
    "Die Papierfrist endet bereits Dienstag."
  ]
}),
makeP45Challenge({
  "id": "cafe-order-retained",
  "title": "Kaffee behalten, Kuchen wechseln",
  "level": "A1",
  "units": [
    "p23:cafe",
    "p26:cafe-conversation"
  ],
  "parentCase": "wrong-drink",
  "relationship": "Servicekraft, höflich",
  "setting": "Du bestellst im Café ein Getränk und Kuchen. Eine Zutat ist ausverkauft.",
  "purpose": "Die Getränkebestellung behalten und nur den Kuchen anpassen.",
  "unexpected": "Schokoladenkuchen ist ausverkauft; es gibt Apfelkuchen.",
  "outcome": "Ein Kaffee und ein Apfelkuchen werden bestellt.",
  "turns": [
    [
      "ご注文は何ですか。",
      "Bestelle Kaffee und Schokoladenkuchen.",
      "コーヒーとチョコレートケーキを一つずつお願いします。",
      "コーヒーを一つとチョコレートケーキをください。",
      "コーヒーだけお願いします。",
      "Das würde den Kuchen bereits weglassen.",
      "Beide Artikel sind am Anfang gewünscht."
    ],
    [
      "コーヒーはホットでいいですか。",
      "Bestätige heißen Kaffee.",
      "はい、ホットでお願いします。",
      "はい、温かいコーヒーをください。",
      "アイスコーヒーにします。",
      "Der geplante Kaffee soll ausdrücklich heiß sein.",
      "Die Temperatur wurde geklärt."
    ],
    [
      "チョコレートケーキはありません。アップルパイならあります。",
      "Ersetze nur den Kuchen.",
      "では、アップルパイを一つお願いします。",
      "アップルパイにします。",
      "では、コーヒーもキャンセルします。",
      "Der Kaffee ist weiter erhältlich und soll bleiben.",
      "Die Änderung betrifft nur das Gebäck."
    ],
    [
      "ホットコーヒーとアップルパイですね。",
      "Bestätige die endgültige Zweierbestellung.",
      "はい、それでお願いします。ありがとうございます。",
      "はい、コーヒーとアップルパイです。",
      "いいえ、チョコレートケーキです。",
      "Der Schokoladenkuchen ist ausverkauft.",
      "Bestätige genau beide weiterhin gewünschten Artikel."
    ]
  ],
  "returnCue": [
    "Im anderen Café gibt es keinen Käsekuchen. Behalte den Tee und bestelle statt dessen Apfelkuchen.",
    "紅茶とアップルパイをお願いします。",
    "アップルパイにします。紅茶もお願いします。",
    "紅茶も要りません。",
    "Die Teebestellung soll nicht entfallen."
  ]
}),
makeP45Challenge({
  "id": "rain-meeting-shift",
  "title": "Picknick nach Wetterwechsel umplanen",
  "level": "A1",
  "units": [
    "p23:plans",
    "p26:weekend-switch"
  ],
  "parentCase": "plan-rain-proposal",
  "relationship": "enge Freundin, locker",
  "setting": "Du wolltest am Sonntag mit Mina im Park essen. Es wird regnen.",
  "purpose": "Trefftag halten, geeigneten neuen Ort auswählen und Uhrzeit bestätigen.",
  "unexpected": "Das ursprünglich vorgeschlagene Café öffnet sonntags nicht.",
  "outcome": "Ihr trefft euch Sonntag um 14 Uhr zu Hause bei Mina.",
  "turns": [
    [
      "日曜日、公園で会わない？",
      "Stimme Sonntag im Park zu.",
      "うん、日曜日に会おう。",
      "いいね。公園に行こう。",
      "昨日公園に行った。",
      "Das beschreibt gestern statt einer Zusage.",
      "Der Tag Sonntag ist vereinbart."
    ],
    [
      "でも、日曜日は雨だって。",
      "Schlage als Wetterschutz ein Café vor.",
      "じゃ、カフェに行かない？",
      "カフェで会おうか。",
      "じゃ、雨の中でピクニックしよう。",
      "Starker Regen macht den unveränderten Parkplan ungeeignet.",
      "Der Plan hat jetzt einen Innenraum als Ziel."
    ],
    [
      "そのカフェ、日曜日は休みだよ。うちならいいよ。",
      "Nimm stattdessen ihre Wohnung an.",
      "じゃ、ミナの家で会おう。",
      "いいね。ミナの家に行くよ。",
      "じゃ、そのカフェで会おう。",
      "Das Café ist sonntags geschlossen.",
      "Weder Park noch Café bleiben als Treffort übrig."
    ],
    [
      "二時に来られる？",
      "Bestätige Sonntag 14 Uhr bei Mina.",
      "うん、日曜日の二時に行くね。",
      "二時にミナの家で会おう。",
      "土曜日の二時に公園に行く。",
      "Damit wären Tag und Ort wieder falsch.",
      "Final sind Sonntag, 14 Uhr, Wohnung."
    ]
  ],
  "returnCue": [
    "Ein Parktreffen wird wegen Regen in die Wohnung deines Freundes verlegt. Bestätige Samstag um 15 Uhr.",
    "土曜日の三時に家に行くね。",
    "うん、土曜日の三時に会おう。",
    "土曜日の三時に公園で会おう。",
    "Der Park ist nicht mehr der vereinbarte Ort."
  ]
}),
makeP45Challenge({
  "id": "lost-wallet-identification",
  "title": "Falsche Geldbörse im Fundbüro",
  "level": "A2",
  "units": [
    "p25:lostfound",
    "p23:ownership"
  ],
  "parentCase": "wrong-day",
  "relationship": "Fundbüromitarbeiter, höflich",
  "setting": "Du meldest eine verlorene schwarze Geldbörse. Zunächst wird dir eine braune gezeigt.",
  "purpose": "Gegenstand und Farbe präzise korrigieren, den Fundort nennen und Identität sichern.",
  "unexpected": "Ein zweiter schwarzer Gegenstand wird gefunden, aber es ist eine Tasche.",
  "outcome": "Die schwarze Geldbörse wird erst nach genauer Beschreibung identifiziert.",
  "turns": [
    [
      "何をなくしましたか。",
      "Beschreibe die schwarze Geldbörse.",
      "黒い財布をなくしました。",
      "私の黒い財布を探しています。",
      "茶色いかばんを買いました。",
      "Gesucht wird eine schwarze Geldbörse, nicht eine gekaufte Tasche.",
      "Halte Farbe und Gegenstand fest."
    ],
    [
      "この茶色い財布ですか。",
      "Lehne den braunen Gegenstand höflich ab.",
      "いいえ、私のは黒い財布です。",
      "すみません、これは私のではありません。",
      "はい、それが私のです。",
      "Der gezeigte Gegenstand hat die falsche Farbe.",
      "Eine höfliche Korrektur verhindert eine falsche Besitzbestätigung."
    ],
    [
      "では、この黒いかばんでしょうか。",
      "Korrigiere auch die Gegenstandsart.",
      "いいえ、かばんではなく財布です。",
      "黒い財布をなくしました。",
      "はい、黒いかばんです。",
      "Eine schwarze Tasche ist nicht die schwarze Geldbörse.",
      "Jetzt stimmt die Farbe, aber noch nicht der Gegenstand."
    ],
    [
      "この小さい黒い財布ですか。",
      "Bestätige den richtigen kleinen Gegenstand.",
      "はい、それが私の財布です。ありがとうございます。",
      "はい、小さい黒い財布です。",
      "いいえ、茶色いかばんです。",
      "Das kehrt zum falsch beschriebenen Gegenstand zurück.",
      "Gegenstand und Farbe stimmen jetzt."
    ]
  ],
  "returnCue": [
    "Dir wird eine blaue Jacke angeboten, du suchst einen schwarzen Mantel. Korrigiere beides höflich.",
    "いいえ、青いジャケットではなく、黒いコートです。",
    "すみません、私のは黒いコートです。",
    "はい、青いジャケットです。",
    "Farbe und Kleidungsart stimmen nicht."
  ]
}),
makeP45Challenge({
  "id": "classroom-room-change",
  "title": "Lehrraum und Uhrzeit ändern sich",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p23:routine"
  ],
  "parentCase": "correct-quantity",
  "relationship": "Dozentin, höflich",
  "setting": "Du fragst am Institut nach deinem Kurs. Er wurde erst im Plan, dann kurzfristig verlegt.",
  "purpose": "Sicherstellen, dass du am richtigen Tag, zur richtigen Zeit und im richtigen Raum erscheinst.",
  "unexpected": "Der ursprünglich freie Raum 201 ist gesperrt; der Unterricht startet außerdem eine Stunde später.",
  "outcome": "Du gehst um 11 Uhr in Raum 304.",
  "turns": [
    [
      "授業はどこですか。",
      "Frage höflich nach dem Seminarraum.",
      "今日の授業は何号室ですか。",
      "すみません、教室はどこでしょうか。",
      "昨日授業を受けました。",
      "Ein Bericht von gestern nennt keinen Raum.",
      "Du suchst den heutigen Kurs."
    ],
    [
      "二〇一号室です。十時からです。",
      "Bestätige Raum 201 und 10 Uhr.",
      "二〇一号室で十時からですね。",
      "十時に二〇一号室に行きます。",
      "三〇四号室で十一時ですね。",
      "Die erste Auskunft lautet anders; warte auf eine Änderung.",
      "Du kannst die zunächst genannten Fakten erinnern."
    ],
    [
      "すみません、部屋が使えなくなりました。三〇四号室で十一時からです。",
      "Korrigiere beide Teile des Plans.",
      "わかりました。三〇四号室に十一時に行きます。",
      "三〇四号室で十一時からですね。",
      "二〇一号室に十時に行きます。",
      "Raum 201 ist nun gesperrt und der Beginn wurde verlegt.",
      "Die neue Auskunft ersetzt beide vorherigen Angaben."
    ],
    [
      "変更をほかの学生にも伝えてください。",
      "Sage höflich zu, die anderen zu informieren.",
      "はい、ほかの学生にも伝えます。",
      "わかりました。みんなに連絡します。",
      "いいえ、前の教室に行きます。",
      "Das ignoriert die Änderung und die Bitte.",
      "Teile den gültigen neuen Termin mit."
    ]
  ],
  "returnCue": [
    "Die heutige Übung wird von Raum 102 um 9 Uhr auf Raum 205 um 10 Uhr verlegt. Bestätige beides.",
    "二〇五号室で十時からですね。",
    "十時に二〇五号室に行きます。",
    "一〇二号室で九時ですね。",
    "Alter Raum und alte Uhrzeit gelten nicht mehr."
  ]
})
];