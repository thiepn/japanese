import {makeP45Challenge} from "./independence45-authoring";
/** Final six original independent A1–A2 conversations: new plans and corrections. */
export const p45CorpusE=[
makeP45Challenge({
  "id": "bakery-change-return",
  "title": "Bäckerei korrigiert den Preis",
  "level": "A1",
  "units": [
    "p25:shopping",
    "p23:cafe"
  ],
  "parentCase": "correct-quantity",
  "relationship": "Bäckereiverkäufer, höflich",
  "setting": "Du kaufst drei Brötchen. Zuerst berechnet die Kasse versehentlich vier.",
  "purpose": "Richtige Menge und passenden Gesamtpreis klären.",
  "unexpected": "Der Verkäufer merkt, dass vier Stück statt drei registriert wurden.",
  "outcome": "Drei Brötchen werden korrekt berechnet.",
  "turns": [
    [
      "パンは何個ですか。",
      "Bitte um drei Brötchen.",
      "三つお願いします。",
      "パンを三つください。",
      "四つお願いします。",
      "Du möchtest drei, nicht vier Stück.",
      "Die Anzahl ist drei."
    ],
    [
      "こちらでよろしいですか。",
      "Bestätige die bereitgelegten drei Stück.",
      "はい、三つです。",
      "はい、それでお願いします。",
      "いいえ、五つです。",
      "Du erhöhst grundlos die Menge.",
      "Auch die sichtbare Anzahl stimmt."
    ],
    [
      "あ、レジには四つと入っていました。",
      "Korrigiere höflich die Kassenmenge.",
      "すみません、三つです。",
      "四つではなく、三つお願いします。",
      "はい、四つです。",
      "Der Kassenfehler darf nicht bestätigt werden.",
      "Die Korrektur betrifft die Rechnung."
    ],
    [
      "三つで三百円です。",
      "Bestätige 300 Yen und bedanke dich.",
      "三百円ですね。ありがとうございます。",
      "はい、三百円です。",
      "四百円ですね。",
      "Der korrigierte Preis ist 300 Yen.",
      "Menge und Gesamtpreis stimmen jetzt."
    ]
  ],
  "returnCue": [
    "Ein anderer Verkäufer registriert fünf statt zwei Äpfel. Korrigiere höflich auf zwei.",
    "五つではなく二つです。",
    "すみません、りんごは二つお願いします。",
    "はい、五つです。",
    "Das würde die falsch erfasste Menge bestätigen."
  ]
}),
makeP45Challenge({
  "id": "class-speech-shorter",
  "title": "Referat überraschend verkürzen",
  "level": "A2",
  "units": [
    "p26:library-project",
    "p23:plans"
  ],
  "parentCase": "team-decision",
  "relationship": "Lehrkraft, höflich",
  "setting": "Du hältst morgen ein Referat. Die Lehrkraft verkürzt die erlaubte Redezeit.",
  "purpose": "Die neue Dauer bestätigen und einen sinnvollen inhaltlichen Schwerpunkt nennen.",
  "unexpected": "Statt zehn Minuten sind nur fünf Minuten erlaubt.",
  "outcome": "Du konzentrierst dich in fünf Minuten auf zwei zentrale Punkte.",
  "turns": [
    [
      "明日の発表は準備できましたか。",
      "Sage, dass dein Vortrag vorbereitet ist.",
      "はい、準備できました。",
      "はい、発表の準備はできています。",
      "昨日発表しました。",
      "Der Vortrag steht erst morgen an.",
      "Du bist vorbereitet."
    ],
    [
      "何分ぐらい話しますか。",
      "Nenne die geplanten zehn Minuten.",
      "十分ぐらい話す予定です。",
      "十分の発表を考えています。",
      "五分前に話しました。",
      "Das ist keine geplante Dauer.",
      "Die erste Planung geht von zehn Minuten aus."
    ],
    [
      "明日は時間が短いので、五分だけでお願いします。",
      "Bestätige ausdrücklich die neue fünfminütige Dauer.",
      "わかりました。五分にします。",
      "五分で発表します。",
      "では、十分話します。",
      "Die Dauer wurde wegen Zeitmangel halbiert.",
      "Das wichtige Neue ist fünf statt zehn Minuten."
    ],
    [
      "何を一番伝えたいですか。",
      "Nenne zwei Hauptpunkte statt den ganzen langen Vortrag.",
      "大事な点を二つ話します。",
      "一番大切なことを二つ説明します。",
      "全部を十分話します。",
      "Das ignoriert die neue Zeitbeschränkung.",
      "Du verdichtest den Inhalt sinnvoll."
    ]
  ],
  "returnCue": [
    "Eine andere Lehrerin kürzt deinen achtminütigen Vortrag auf drei Minuten. Bestätige drei Minuten.",
    "三分で発表します。",
    "わかりました。三分にします。",
    "八分話します。",
    "Die neue Vorgabe beträgt drei Minuten."
  ]
}),
makeP45Challenge({
  "id": "bus-card-not-working",
  "title": "Fahrkarte statt defekter Karte",
  "level": "A2",
  "units": [
    "p25:transport",
    "p26:station-to-campus"
  ],
  "parentCase": "last-bus",
  "relationship": "Busfahrer, höflich",
  "setting": "Deine elektronische Fahrkarte wird im Bus nicht erkannt.",
  "purpose": "Problem erklären, anderes Zahlungsmittel erfragen und Ziel bestätigen.",
  "unexpected": "Die elektronische Karte funktioniert nicht, aber ein Papierticket kann gekauft werden.",
  "outcome": "Du kaufst ein reguläres Papierticket zum Bahnhof.",
  "turns": [
    [
      "どちらまでですか。",
      "Sage, dass du zum Bahnhof möchtest.",
      "駅までお願いします。",
      "駅に行きたいです。",
      "大学で勉強しました。",
      "Der Fahrer fragt nach dem Fahrtziel.",
      "Der Zielort ist der Bahnhof."
    ],
    [
      "カードを見せてください。",
      "Reiche die Fahrkarte höflich.",
      "はい、こちらです。",
      "このカードです。",
      "カードをなくしました。",
      "Du hast die Karte bei dir.",
      "Zunächst versuchst du die normale Karte."
    ],
    [
      "このカードは使えません。切符を買ってください。",
      "Bitte um ein normales Ticket zum Bahnhof.",
      "では、駅までの切符を一枚ください。",
      "わかりました。切符をお願いします。",
      "では、このカードで払います。",
      "Das Lesegerät akzeptiert die Karte nicht.",
      "Ändere die Fahrkartenart."
    ],
    [
      "駅まで三百円です。",
      "Bestätige den Preis von 300 Yen.",
      "三百円ですね。はい、お願いします。",
      "わかりました。三百円です。",
      "三千円ですね。",
      "3000 Yen ist das Zehnfache des genannten Preises.",
      "Die Fahrt kann mit dem Ticket stattfinden."
    ]
  ],
  "returnCue": [
    "In einem anderen Bus funktioniert deine Karte nicht. Bitte um ein Papierticket zum Museum.",
    "では、美術館までの切符を一枚ください。",
    "切符で美術館まで行きたいです。",
    "このカードで払います。",
    "Die Karte wird nicht akzeptiert."
  ]
}),
makeP45Challenge({
  "id": "wrong-meeting-link",
  "title": "Onlinebesprechung mit neuem Link",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p26:library-project"
  ],
  "parentCase": "coworker-message",
  "relationship": "neue Arbeitskollegin, höflich",
  "setting": "Du hast für heute eine Onlinebesprechung. Der alte Zugangslink funktioniert nicht.",
  "purpose": "Neuen Link erfragen und die unveränderte Uhrzeit bestätigen.",
  "unexpected": "Die Kollegin schickt einen neuen Link; die Besprechung bleibt um 14 Uhr.",
  "outcome": "Du nutzt den neuen Link zur ursprünglichen Uhrzeit.",
  "turns": [
    [
      "今日の会議は二時からですね。",
      "Bestätige 14 Uhr.",
      "はい、午後二時からです。",
      "二時でお願いします。",
      "四時からです。",
      "Die vereinbarte Zeit ist 14 Uhr.",
      "Die Uhrzeit steht fest."
    ],
    [
      "リンクは届きましたか。",
      "Erkläre, dass du den Link erhalten hast, aber nicht öffnen kannst.",
      "はい、でも開けません。",
      "リンクはありますが、使えません。",
      "まだ送っていません。",
      "Die Kollegin hat den Link schon geschickt.",
      "Das Problem ist Zugang, nicht Fehlen der Nachricht."
    ],
    [
      "すみません、新しいリンクを送ります。",
      "Bitte um den neuen Link und bedanke dich.",
      "ありがとうございます。新しいリンクをお願いします。",
      "助かります。送ってください。",
      "では、会議をやめます。",
      "Der Ersatzlink löst wahrscheinlich das Zugangsproblem.",
      "Du brauchst den neuen Link, nicht eine Absage."
    ],
    [
      "送りました。時間は二時のままです。",
      "Bestätige, dass der neue Link und 14 Uhr gelten.",
      "新しいリンクですね。二時に参加します。",
      "ありがとうございます。二時ですね。",
      "では、三時に参加します。",
      "Die Uhrzeit wurde ausdrücklich nicht geändert.",
      "Nur der technische Zugang hat sich geändert."
    ]
  ],
  "returnCue": [
    "Ein anderer Termin bleibt um 11 Uhr, aber der Zugangslink wird ersetzt. Bestätige beides höflich.",
    "新しいリンクで十一時に参加します。",
    "十一時のままですね。ありがとうございます。",
    "十二時に古いリンクで参加します。",
    "Weder neue Zeit noch alter Link sind korrekt."
  ]
}),
makeP45Challenge({
  "id": "friend-birthday-change",
  "title": "Geburtstagsgeschenk neu abstimmen",
  "level": "A1",
  "units": [
    "p23:plans",
    "p25:shopping"
  ],
  "parentCase": "birthday-gift",
  "relationship": "enger Freund, locker",
  "setting": "Du kaufst mit deinem Freund ein Geschenk für eure Freundin. Sie mag offenbar keine rote Kleidung.",
  "purpose": "Vorliebe berücksichtigen, gemeinsames Budget halten und Geschenk festlegen.",
  "unexpected": "Der rote Schal ist ungeeignet, der blaue Schal kostet 1500 Yen und passt ins Budget.",
  "outcome": "Ihr kauft gemeinsam den blauen Schal.",
  "turns": [
    [
      "誕生日のプレゼント、何にする？",
      "Schlage einen Schal vor.",
      "マフラーはどう？",
      "マフラーを買わない？",
      "昨日マフラーを買った。",
      "Das ist kein jetziger Vorschlag.",
      "Der Gegenstand Schal ist zunächst eine Idee."
    ],
    [
      "この赤いのはどうかな。",
      "Bitte darum, die Farbe zu prüfen.",
      "赤いのが好きかな。",
      "別の色も見ようか。",
      "うん、絶対赤がいいよ。",
      "Ihr kennt ihre Farbvorliebe noch nicht.",
      "Die Entscheidung ist noch offen."
    ],
    [
      "赤はあまり好きじゃないみたい。青いのは千五百円だよ。",
      "Nimm den blauen Schal als bessere Wahl.",
      "じゃ、青いのにしよう。",
      "青いマフラーがいいね。",
      "じゃ、赤いのを買おう。",
      "Rot passt nicht zur bekannten Vorliebe.",
      "Die neue Wahl berücksichtigt die Freundin."
    ],
    [
      "二人でお金を出す？",
      "Stimme zu, gemeinsam zu bezahlen.",
      "うん、二人で払おう。",
      "半分ずつ出そう。",
      "じゃ、全部君が払って。",
      "Der Freund fragt nach gemeinsamer Finanzierung.",
      "Das Geschenk wird gemeinsam gekauft."
    ]
  ],
  "returnCue": [
    "Deine Freundin mag kein Grün. Schlage für ihr Geschenk locker eine gelbe Tasche vor.",
    "じゃ、黄色いかばんにしよう。",
    "黄色いのはどう？",
    "緑のを買おう。",
    "Die grüne Farbe ist gerade ausgeschlossen."
  ]
}),
makeP45Challenge({
  "id": "post-pickup-notice",
  "title": "Paketabholung mit Ausweis",
  "level": "A2",
  "units": [
    "p25:shopping",
    "p25:appointment"
  ],
  "parentCase": "post-office",
  "relationship": "Postmitarbeiter, höflich",
  "setting": "Du möchtest ein Paket abholen, hast den Abholschein, aber zunächst keinen Ausweis vorgezeigt.",
  "purpose": "Abholschein, Ausweispflicht und den neuen Abholzeitpunkt klären.",
  "unexpected": "Ohne Ausweis darf das Paket nicht ausgegeben werden; die Filiale ist morgen vormittags wieder geöffnet.",
  "outcome": "Du kommst morgen mit Ausweis und Abholschein zurück.",
  "turns": [
    [
      "何かお受け取りですか。",
      "Sage, dass du ein Paket abholen möchtest.",
      "荷物を受け取りに来ました。",
      "荷物を取りに来ました。",
      "荷物を送りました。",
      "Abholen und Verschicken sind verschiedene Handlungen.",
      "Du bist Empfänger des Pakets."
    ],
    [
      "お知らせの紙はありますか。",
      "Bestätige den Abholschein.",
      "はい、持っています。こちらです。",
      "この紙です。お願いします。",
      "いいえ、送りました。",
      "Du hast den Schein dabei.",
      "Die Benachrichtigung ist vorhanden."
    ],
    [
      "本人確認の書類も必要です。",
      "Erkläre höflich, dass du deinen Ausweis nicht dabei hast.",
      "すみません、今日は身分証を持っていません。",
      "身分証を忘れました。",
      "では、今すぐ渡してください。",
      "Die Filiale benötigt das Dokument vor der Ausgabe.",
      "Der Paketwunsch bleibt, aber die Abholung wird verschoben."
    ],
    [
      "明日の午前中なら開いています。",
      "Bestätige Rückkehr morgen Vormittag mit Ausweis.",
      "明日の午前中に身分証を持って来ます。",
      "わかりました。明日また来ます。",
      "今日は身分証なしでも受け取ります。",
      "Das Paket kann heute ohne Ausweis nicht herausgegeben werden.",
      "Du nimmst die erforderlichen Dokumente morgen mit."
    ]
  ],
  "returnCue": [
    "Ein anderes Paket lässt sich nur mit Ausweis abholen. Sage höflich, dass du ihn morgen mitbringst.",
    "明日、身分証を持って来ます。",
    "身分証を持って、明日受け取りに来ます。",
    "今日、身分証なしで受け取ります。",
    "Die Dokumentenpflicht gilt weiterhin."
  ]
})
];