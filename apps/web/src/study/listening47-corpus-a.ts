import {authoredP47Scene,type P47RawScene} from "./listening47-types";
export const p47CorpusA= [
  {
    "id": "meet-north-exit",
    "title": "Ein anderer Bahnhofsausgang",
    "genre": "dialogue",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Zwei Freunde verabreden sich am Bahnhof. Die Person am Telefon verwechselt den Ausgang.",
    "listeningGoal": "Ursprünglichen und korrigierten Treffpunkt unterscheiden",
    "prediction": "Höre besonders auf きた und みなみ.",
    "lines": [
      [
        "あき",
        "明日は何時に会う？",
        "Wann treffen wir uns morgen?"
      ],
      [
        "れん",
        "午後二時に駅で会おう。",
        "Treffen wir uns um zwei am Bahnhof."
      ],
      [
        "あき",
        "南口でいい？",
        "Ist der Südausgang okay?"
      ],
      [
        "れん",
        "ううん、北口だよ。北口の前に小さい花屋がある。",
        "Nein, Nordausgang. Davor ist ein kleiner Blumenladen."
      ],
      [
        "あき",
        "わかった。二時に北口の花屋の前でね。",
        "Okay, um zwei vor dem Blumenladen am Nordausgang."
      ]
    ],
    "questions": [
      [
        "detail",
        "Um wie viel Uhr treffen sie sich?",
        "午後二時です。",
        "二時に会います。",
        "午後三時です。",
        "Zwei Uhr wird zweimal genannt.",
        "午後二時に駅で会おう"
      ],
      [
        "inference",
        "Wo muss Aki tatsächlich hingehen?",
        "北口の花屋の前です。",
        "駅の北口です。",
        "南口です。",
        "Ren korrigiert den zuerst vorgeschlagenen Ausgang.",
        "ううん、北口だよ"
      ],
      [
        "intent",
        "Warum erwähnt Ren den Blumenladen?",
        "待ち合わせ場所をわかりやすくするためです。",
        "北口を見つけやすくするためです。",
        "花を買うためです。",
        "Der Laden dient als Orientierungspunkt, nicht als Einkaufsziel.",
        "北口の前に小さい花屋がある"
      ]
    ],
    "vocabulary": [
      [
        "北口",
        "きたぐち",
        "Nordausgang",
        "北口の前"
      ],
      [
        "南口",
        "みなみぐち",
        "Südausgang",
        "南口でいい"
      ]
    ],
    "notes": "Der Gegensatz ううん ... だよ korrigiert eine beiläufige Annahme unter Freunden.",
    "response": [
      "Bestätige den endgültigen Treffpunkt.",
      "午後二時に北口の花屋の前で会います。",
      "二時に北口で会おう。",
      "二時に南口で会おう。",
      "Der Süd- statt Nordausgang ist die korrigierte Fehlinformation."
    ],
    "transfer": [
      "Anderer Treffpunkt: Samstag um 15 Uhr am Südausgang. Bestätige dies.",
      "土曜日の三時に南口で会おう。",
      "土曜日の午後三時に南口に行くね。",
      "日曜日の二時に北口で会おう。",
      "Tag, Zeit und Ausgang unterscheiden sich."
    ]
  },
  {
    "id": "cafe-no-cake",
    "title": "Der Kuchen ist ausverkauft",
    "genre": "service",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "situation": "Ein Gast bestellt Kaffee und Kuchen, das gewünschte Gebäck ist nicht verfügbar.",
    "listeningGoal": "Erkennen, welcher Teil der Bestellung geändert wird",
    "prediction": "Höre auf ありません und では.",
    "lines": [
      [
        "店員",
        "いらっしゃいませ。ご注文は？",
        "Willkommen, was darf es sein?"
      ],
      [
        "客",
        "コーヒーとチョコレートケーキを一つずつお願いします。",
        "Einen Kaffee und ein Stück Schokokuchen bitte."
      ],
      [
        "店員",
        "すみません。チョコレートケーキはもうありません。アップルパイならあります。",
        "Tut mir leid. Schokokuchen ist aus. Apfelkuchen gibt es."
      ],
      [
        "客",
        "では、アップルパイをお願いします。コーヒーはそのままで。",
        "Dann Apfelkuchen bitte. Der Kaffee bleibt."
      ],
      [
        "店員",
        "はい。コーヒーとアップルパイですね。",
        "Gut, Kaffee und Apfelkuchen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welcher Kuchen ist nicht erhältlich?",
        "チョコレートケーキです。",
        "チョコレートケーキがありません。",
        "アップルパイです。",
        "Der Apfelkuchen wird angeboten.",
        "チョコレートケーキはもうありません"
      ],
      [
        "inference",
        "Wird der Kaffee abbestellt?",
        "いいえ、そのままです。",
        "コーヒーは注文したままです。",
        "はい、キャンセルします。",
        "そのままで heißt, dass der Kaffee unverändert bleibt.",
        "コーヒーはそのままで"
      ],
      [
        "intent",
        "Was bestätigt die Bedienung am Schluss?",
        "コーヒーとアップルパイです。",
        "新しい注文です。",
        "コーヒーとチョコレートケーキです。",
        "Die letzte Rückfrage wiederholt die ersetzte Bestellung.",
        "コーヒーとアップルパイですね"
      ]
    ],
    "vocabulary": [
      [
        "そのまま",
        "そのまま",
        "unverändert",
        "そのままで"
      ],
      [
        "注文",
        "ちゅうもん",
        "Bestellung",
        "ご注文は"
      ]
    ],
    "notes": "では signalisiert die neue Entscheidung; そのままで grenzt die Änderung auf das Gebäck ein.",
    "response": [
      "Bestelle in diesem Café die endgültige Kombination.",
      "コーヒーとアップルパイをお願いします。",
      "アップルパイとコーヒーを一つずつください。",
      "コーヒーとチョコレートケーキをお願いします。",
      "Schokokuchen ist ausverkauft."
    ],
    "transfer": [
      "In einem anderen Café gibt es keinen Tee. Behalte den Toast und wähle Wasser.",
      "トーストはそのままで、水をお願いします。",
      "トーストと水をください。",
      "トーストもキャンセルします。",
      "Das Essen soll ausdrücklich bleiben."
    ]
  },
  {
    "id": "shopping-two-apples",
    "title": "Die Anzahl an der Kasse",
    "genre": "dialogue",
    "level": "A1",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "An einer Obsttheke werden Äpfel und Bananen abgerechnet.",
    "listeningGoal": "Korrektur von Mengen über mehrere Sprecher erkennen",
    "prediction": "Notiere die Mengen für beide Obstsorten.",
    "lines": [
      [
        "店員",
        "りんごは三つ、バナナは二本ですね。",
        "Drei Äpfel und zwei Bananen, richtig?"
      ],
      [
        "客",
        "りんごは二つです。バナナは二本で合っています。",
        "Zwei Äpfel. Zwei Bananen stimmt."
      ],
      [
        "店員",
        "失礼しました。りんご二つとバナナ二本ですね。",
        "Entschuldigung. Zwei Äpfel und zwei Bananen."
      ],
      [
        "客",
        "はい。全部でいくらですか。",
        "Ja. Wie viel zusammen?"
      ],
      [
        "店員",
        "五百円です。",
        "500 Yen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie viele Äpfel möchte der Kunde?",
        "二つです。",
        "りんごを二つ買います。",
        "三つです。",
        "Die erste Menge wird korrigiert.",
        "りんごは二つです"
      ],
      [
        "inference",
        "Welche Mengenangabe bleibt unverändert?",
        "バナナは二本です。",
        "バナナ二本です。",
        "バナナは三本です。",
        "Der Kunde bestätigt die Bananen ausdrücklich.",
        "バナナは二本で合っています"
      ],
      [
        "intent",
        "Was kostet der endgültige Einkauf?",
        "五百円です。",
        "全部で五百円です。",
        "二百円です。",
        "Der genannte Gesamtpreis ist 500 Yen.",
        "五百円です"
      ]
    ],
    "vocabulary": [
      [
        "合う",
        "あう",
        "stimmen",
        "合っています"
      ],
      [
        "全部",
        "ぜんぶ",
        "alles zusammen",
        "全部で"
      ]
    ],
    "notes": "二つ ist das allgemeine Zählwort für Äpfel; 二本 für lange Gegenstände wie Bananen.",
    "response": [
      "Wiederhole die korrigierte Bestellung.",
      "りんごを二つとバナナを二本お願いします。",
      "りんご二つ、バナナ二本です。",
      "りんご三つ、バナナ二本です。",
      "Drei Äpfel war die falsche Ausgangszahl."
    ],
    "transfer": [
      "Neue Bestellung: vier Äpfel und eine Banane. Formuliere sie.",
      "りんごを四つとバナナを一本お願いします。",
      "りんご四つとバナナ一本ください。",
      "りんご二つ、バナナ二本です。",
      "Die alten Mengen gelten nicht."
    ]
  },
  {
    "id": "library-return-wednesday",
    "title": "Das Buch muss früher zurück",
    "genre": "dialogue",
    "level": "A1",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Eine Bibliotheksangestellte erklärt eine kürzere Leihfrist.",
    "listeningGoal": "Erkennen, welcher Rückgabetag verbindlich ist",
    "prediction": "Höre auf Donnerstag und Mittwoch.",
    "lines": [
      [
        "学生",
        "この本を借りたいです。木曜日までいいですか。",
        "Ich möchte dieses Buch bis Donnerstag leihen. Geht das?"
      ],
      [
        "職員",
        "すみません。この本は水曜日に予約があります。",
        "Leider ist es für Mittwoch reserviert."
      ],
      [
        "学生",
        "では、火曜日までに返します。",
        "Dann gebe ich es bis Dienstag zurück."
      ],
      [
        "職員",
        "ありがとうございます。返すときは一階のカウンターへどうぞ。",
        "Danke. Zur Rückgabe bitte zum Schalter im Erdgeschoss."
      ],
      [
        "学生",
        "はい、火曜日に一階へ持って来ます。",
        "Okay, ich bringe es Dienstag ins Erdgeschoss."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann gibt der Student das Buch zurück?",
        "火曜日です。",
        "火曜日までに返します。",
        "木曜日です。",
        "Donnerstag wurde nur erfragt, nicht vereinbart.",
        "火曜日までに返します"
      ],
      [
        "inference",
        "Warum kann er es nicht bis Donnerstag behalten?",
        "水曜日に予約があるからです。",
        "ほかの人が水曜日に借りるからです。",
        "図書館が木曜日に休みだからです。",
        "Die Nachricht nennt eine Reservierung, keine Schließung.",
        "水曜日に予約があります"
      ],
      [
        "intent",
        "Wo soll die Rückgabe erfolgen?",
        "一階のカウンターです。",
        "一階で返します。",
        "二階の教室です。",
        "Der Schalter ist ausdrücklich im Erdgeschoss.",
        "一階のカウンターへどうぞ"
      ]
    ],
    "vocabulary": [
      [
        "返す",
        "かえす",
        "zurückgeben",
        "返します"
      ],
      [
        "予約",
        "よやく",
        "Reservierung",
        "予約があります"
      ]
    ],
    "notes": "水曜日 ist der Reservierungstag; 火曜日 ist der tatsächlich vereinbarte Rückgabetag.",
    "response": [
      "Schreibe einen Satz über die Rückgabe.",
      "火曜日までに本を返します。",
      "火曜日に一階で返します。",
      "木曜日に返します。",
      "Das Buch wird schon Mittwoch benötigt."
    ],
    "transfer": [
      "Neues Buch ist Freitag reserviert. Sage, dass du es Donnerstag zurückgibst.",
      "木曜日までに本を返します。",
      "木曜日に返しに来ます。",
      "金曜日まで借ります。",
      "Die neue Reservierung ist bereits Freitag."
    ]
  },
  {
    "id": "campus-building",
    "title": "Nicht das rote Gebäude",
    "genre": "dialogue",
    "level": "A1",
    "units": [
      "p25:directions",
      "p26:station-to-campus"
    ],
    "situation": "Ein Besucher sucht die Universitätsbibliothek.",
    "listeningGoal": "Ein verneintes Wegmerkmal als Korrektur erkennen",
    "prediction": "Höre auf 色 und Richtungen.",
    "lines": [
      [
        "訪問者",
        "すみません。大学の図書館はどこですか。",
        "Entschuldigung, wo ist die Unibibliothek?"
      ],
      [
        "学生",
        "ここからまっすぐ行ってください。",
        "Gehen Sie hier geradeaus."
      ],
      [
        "訪問者",
        "あの赤い建物ですか。",
        "Ist es das rote Gebäude?"
      ],
      [
        "学生",
        "いいえ。赤い建物の右にある白い建物です。入り口は一階です。",
        "Nein, das weiße rechts vom roten. Eingang im Erdgeschoss."
      ],
      [
        "訪問者",
        "白い建物ですね。ありがとうございます。",
        "Das weiße Gebäude, danke."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Farbe hat das gesuchte Gebäude?",
        "白いです。",
        "白い建物です。",
        "赤いです。",
        "Rot bezeichnet nur den Bezugspunkt.",
        "赤い建物の右にある白い建物"
      ],
      [
        "inference",
        "Wie nutzt der Besucher das rote Gebäude?",
        "目印にします。",
        "赤い建物の右を見ます。",
        "赤い建物に入ります。",
        "Das rote Gebäude ist nur Orientierung.",
        "赤い建物の右にある"
      ],
      [
        "intent",
        "In welchem Stock befindet sich der Eingang?",
        "一階です。",
        "入り口は一階です。",
        "二階です。",
        "Der Eingang ist ausdrücklich im ersten japanischen Stockwerk.",
        "入り口は一階です"
      ]
    ],
    "vocabulary": [
      [
        "建物",
        "たてもの",
        "Gebäude",
        "白い建物"
      ],
      [
        "入り口",
        "いりぐち",
        "Eingang",
        "入り口は"
      ]
    ],
    "notes": "Das japanische 一階 bezeichnet das Erdgeschoss. Die Lagebeziehung rechts vom roten Gebäude ist entscheidend.",
    "response": [
      "Bestätige die Lage der Bibliothek.",
      "図書館は赤い建物の右の白い建物ですね。",
      "白い建物の一階ですね。",
      "赤い建物に入ります。",
      "Rot ist nur der Orientierungspunkt."
    ],
    "transfer": [
      "Neues Ziel: die Mensa ist links vom blauen Gebäude im gelben Gebäude. Bestätige es.",
      "青い建物の左の黄色い建物ですね。",
      "食堂は黄色い建物です。",
      "青い建物の右です。",
      "Die neue Lage ist links statt rechts."
    ]
  },
  {
    "id": "train-platform-change",
    "title": "Gleiswechsel vor der Abfahrt",
    "genre": "announcement",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Eine automatische Bahnhofsdurchsage korrigiert ein Gleis.",
    "listeningGoal": "Neue Gleisnummer und unveränderte Abfahrtszeit identifizieren",
    "prediction": "Merke dir erst Zeit und dann Gleis.",
    "lines": [
      [
        "放送",
        "お知らせします。三時十分発の電車は、最初、二番ホームから出る予定でした。",
        "Achtung: Der Zug um 15:10 sollte ursprünglich von Gleis zwei fahren."
      ],
      [
        "放送",
        "しかし、今日は三番ホームから出ます。出発時間は変わりません。",
        "Heute fährt er aber von Gleis drei. Die Zeit bleibt."
      ],
      [
        "放送",
        "お間違えのないようにお願いします。",
        "Bitte beachten Sie die Änderung."
      ],
      [
        "乗客",
        "三番ホームで三時十分ですね。",
        "Gleis drei um 15:10, richtig?"
      ],
      [
        "駅員",
        "はい、そのとおりです。",
        "Ja, das stimmt."
      ]
    ],
    "questions": [
      [
        "detail",
        "Von welchem Gleis fährt der Zug heute?",
        "三番ホームです。",
        "今日は三番ホームから出ます。",
        "二番ホームです。",
        "Zwei war nur der alte Plan.",
        "今日は三番ホームから出ます"
      ],
      [
        "inference",
        "Hat sich die Abfahrtszeit geändert?",
        "いいえ、変わりません。",
        "三時十分のままです。",
        "はい、三時半です。",
        "Die Zeit bleibt ausdrücklich gleich.",
        "出発時間は変わりません"
      ],
      [
        "intent",
        "Welche Information sollen Reisende besonders prüfen?",
        "ホームの番号です。",
        "乗るホームが変わったことです。",
        "電車の値段です。",
        "Die Durchsage warnt vor Verwechslung des Gleises.",
        "お間違えのないように"
      ]
    ],
    "vocabulary": [
      [
        "変更",
        "へんこう",
        "Änderung",
        "時間は変わりません"
      ],
      [
        "発",
        "はつ",
        "Abfahrt um",
        "三時十分発"
      ]
    ],
    "notes": "Die Information enthält erst den alten, dann den gültigen Wert: für das Handeln zählt 三番ホーム.",
    "response": [
      "Bestätige Gleis und Zeit.",
      "三時十分に三番ホームから出ます。",
      "三番ホームで三時十分ですね。",
      "二番ホームで三時十分です。",
      "Gleis zwei ist überholt."
    ],
    "transfer": [
      "Andere Durchsage: Zug um 11:20 wechselt zu Gleis vier, Zeit gleich. Bestätige.",
      "十一時二十分に四番ホームから出ます。",
      "四番ホームで十一時二十分ですね。",
      "三番ホームで三時十分です。",
      "Die neuen Angaben unterscheiden sich vollständig."
    ]
  },
  {
    "id": "weekend-museum",
    "title": "Sonntag statt Samstag",
    "genre": "voicemail",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Eine Sprachnachricht verschiebt einen Museumsbesuch.",
    "listeningGoal": "Aus einer kurzen Nachricht die letzte Terminentscheidung erfassen",
    "prediction": "Achte auf でも und 代わりに.",
    "lines": [
      [
        "まゆ",
        "あや、こんにちは。土曜日、美術館に行く予定だったよね。",
        "Aya, wir wollten Samstag ins Museum."
      ],
      [
        "まゆ",
        "でも、土曜日はアルバイトが入ったんだ。ごめんね。",
        "Aber ich muss Samstag arbeiten. Tut mir leid."
      ],
      [
        "まゆ",
        "日曜日の午後なら時間があるよ。二時はどうかな。",
        "Sonntagnachmittag hätte ich Zeit. Wie wäre es um zwei?"
      ],
      [
        "まゆ",
        "返事をもらえるとうれしいな。",
        "Ich würde mich über eine Antwort freuen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welcher Tag ist neu vorgeschlagen?",
        "日曜日です。",
        "日曜日の午後です。",
        "土曜日です。",
        "Samstag ist wegen Arbeit nicht mehr möglich.",
        "日曜日の午後なら時間がある"
      ],
      [
        "inference",
        "Warum kann Mayu nicht am alten Termin?",
        "アルバイトがあるからです。",
        "土曜日に働くからです。",
        "美術館が休みだからです。",
        "Sie erwähnt ihre Arbeit, keine Museumsschließung.",
        "土曜日はアルバイトが入った"
      ],
      [
        "intent",
        "Welche Reaktion wünscht Mayu?",
        "返事です。",
        "二時でいいか返事をすることです。",
        "今すぐ美術館へ行くことです。",
        "Sie fragt ausdrücklich nach einer Rückmeldung.",
        "返事をもらえるとうれしい"
      ]
    ],
    "vocabulary": [
      [
        "代わり",
        "かわり",
        "Ersatz",
        "日曜日の午後なら"
      ],
      [
        "返事",
        "へんじ",
        "Antwort",
        "返事をもらえる"
      ]
    ],
    "notes": "Sprachnachrichten sind einseitig; der konkrete Antwortwunsch steht erst am Ende.",
    "response": [
      "Antworte freundlich mit Zustimmung zu Sonntag um zwei.",
      "日曜日の二時でいいよ。",
      "うん、日曜日の二時に会おう。",
      "土曜日の二時でいいよ。",
      "Samstag geht nicht."
    ],
    "transfer": [
      "Eine andere Freundin verschiebt eine Verabredung auf Montag um 17 Uhr. Sage zu.",
      "月曜日の五時でいいよ。",
      "うん、月曜日の五時に会おう。",
      "日曜日の二時でいいよ。",
      "Der neue Termin ist Montag 17 Uhr."
    ]
  },
  {
    "id": "health-center-hours",
    "title": "Öffnungszeiten der Sprechstunde",
    "genre": "announcement",
    "level": "A1",
    "units": [
      "p23:routine",
      "p25:appointment"
    ],
    "situation": "Ein Gesundheitszentrum informiert über Termin- und Öffnungszeiten, ohne medizinische Beratung.",
    "listeningGoal": "Annahmezeiten und besondere Schließung unterscheiden",
    "prediction": "Höre besonders auf Uhrzeiten und Wochentage.",
    "lines": [
      [
        "案内",
        "健康センターからのお知らせです。月曜日から金曜日まで、受付は朝九時から午後四時までです。",
        "Das Gesundheitszentrum: Anmeldung Montag bis Freitag von 9 bis 16 Uhr."
      ],
      [
        "案内",
        "木曜日だけ、午後は職員の会議があるので、受付は正午までです。",
        "Nur Donnerstag ist die Anmeldung wegen einer Besprechung mittags geschlossen."
      ],
      [
        "案内",
        "土曜日と日曜日はお休みです。予約の変更はお電話でお願いします。",
        "Samstag und Sonntag geschlossen. Änderungen bitte telefonisch."
      ],
      [
        "案内",
        "電話は平日の朝九時からつながります。",
        "Telefonisch werktags ab 9 erreichbar."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann endet die Anmeldung am Donnerstag?",
        "正午です。",
        "木曜日は十二時までです。",
        "午後四時です。",
        "16 Uhr gilt für andere Werktage.",
        "木曜日だけ…受付は正午まで"
      ],
      [
        "inference",
        "Kann man sonntags persönlich zur Anmeldung gehen?",
        "いいえ、休みです。",
        "日曜日は受付がありません。",
        "はい、朝九時からです。",
        "Das Wochenende ist geschlossen.",
        "土曜日と日曜日はお休みです"
      ],
      [
        "intent",
        "Wie soll man einen Termin ändern?",
        "電話で連絡します。",
        "電話で予約を変更します。",
        "直接日曜日に行きます。",
        "Die Ansage nennt telefonische Änderungen.",
        "予約の変更はお電話でお願いします"
      ]
    ],
    "vocabulary": [
      [
        "受付",
        "うけつけ",
        "Anmeldung",
        "受付は"
      ],
      [
        "正午",
        "しょうご",
        "12 Uhr mittags",
        "正午まで"
      ]
    ],
    "notes": "Die Sonderregel 木曜日だけ schränkt die normale Montag-Freitag-Zeit ein.",
    "response": [
      "Frage telefonisch höflich nach einer Terminänderung.",
      "予約を変更したいです。",
      "予約の時間を変えたいのですが。",
      "日曜日に受付へ行きます。",
      "Sonntags ist geschlossen."
    ],
    "transfer": [
      "Andere Stelle: Dienstag nur bis 13 Uhr geöffnet. Sage, dass du Dienstag um zwölf kommst.",
      "火曜日の十二時に行きます。",
      "火曜日は正午に伺います。",
      "火曜日の三時に行きます。",
      "15 Uhr liegt nach der neuen Schließzeit."
    ]
  }
] satisfies P47RawScene[];
export const p47ScenesA=p47CorpusA.map(authoredP47Scene);
