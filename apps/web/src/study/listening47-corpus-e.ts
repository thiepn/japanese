import {authoredP47Scene,type P47RawScene} from "./listening47-types";
export const p47CorpusE=[
  {
    "id": "a2-ferry-weather",
    "title": "Fährfahrt nach Wetteränderung",
    "genre": "announcement",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Ein fiktiver Hafen gibt veränderte Schiffsverbindungen bekannt.",
    "listeningGoal": "Ausfall, Alternative, Ticketgültigkeit und Zeit unterscheiden",
    "prediction": "Welches Schiff fährt statt des ursprünglich gebuchten?",
    "lines": [
      [
        "放送",
        "午前九時発の青島行きの船は、強い風のため欠航になりました。",
        "Das Schiff nach Aoshima um 9 Uhr fällt wegen Wind aus."
      ],
      [
        "放送",
        "次の船は十一時発ですが、こちらも天候によっては遅れる可能性があります。",
        "Das nächste fährt um 11, kann sich wetterbedingt verspäten."
      ],
      [
        "放送",
        "九時の切符をお持ちの方は、十一時の船にもそのまま乗れます。",
        "Die Tickets um neun gelten auch um elf."
      ],
      [
        "放送",
        "今日のうちに旅行をやめる方は、窓口で払い戻しについてご相談ください。",
        "Bei Stornierung heute am Schalter wegen Erstattung nachfragen."
      ],
      [
        "乗客",
        "まず十一時の出発を確認します。",
        "Ich überprüfe zuerst die Abfahrt um elf."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann fährt frühestens die nächste angekündigte Fähre?",
        "十一時です。",
        "午前十一時です。",
        "九時です。",
        "Neun Uhr ist ausgefallen.",
        "次の船は十一時発"
      ],
      [
        "inference",
        "Muss ein Reisender mit dem ursprünglichen Ticket neu bezahlen?",
        "いいえ、そのまま乗れます。",
        "九時の切符で乗れます。",
        "はい、新しい切符が必要です。",
        "Alte Tickets gelten für die neue Abfahrt.",
        "九時の切符…十一時の船にもそのまま乗れます"
      ],
      [
        "intent",
        "Welche Unsicherheit bleibt trotz des neuen Fahrplans?",
        "天候で遅れるかもしれません。",
        "十一時の船も遅れる可能性があります。",
        "船が絶対に早く着きます。",
        "Die Durchsage garantiert die neue Abfahrtszeit nicht.",
        "遅れる可能性があります"
      ]
    ],
    "vocabulary": [
      [
        "欠航",
        "けっこう",
        "Ausfall einer Schiff-/Flugverbindung",
        "欠航になりました"
      ],
      [
        "払い戻し",
        "はらいもどし",
        "Erstattung",
        "払い戻しについて"
      ]
    ],
    "notes": "Die fiktive Durchsage enthält eine Ersatzoption, aber keine Garantie für pünktliche Abfahrt.",
    "response": [
      "Sage, dass du mit deinem vorhandenen Ticket die neue Fahrt nehmen möchtest.",
      "九時の切符で十一時の船に乗りたいです。",
      "十一時の船にそのまま乗ります。",
      "九時の船に乗ります。",
      "Die Neunuhrfahrt ist ausgefallen."
    ],
    "transfer": [
      "Neue Fähre: Acht-Uhr-Abfahrt fällt aus, Ticket gilt für 10:30. Bestätige diese Option.",
      "八時の切符で十時半の船に乗ります。",
      "十時半の船を利用します。",
      "十一時の船に乗ります。",
      "Die neue Ersatzzeit ist 10:30."
    ]
  },
  {
    "id": "a2-lost-phone-call",
    "title": "Ein verlorenes Handy und zwei Fundstücke",
    "genre": "service",
    "level": "A2",
    "units": [
      "p25:directions",
      "p25:transport"
    ],
    "situation": "Fundbüro-Gespräch über ähnliche verlorene Handys.",
    "listeningGoal": "Merkmalsvergleich und noch offene Identifikation erkennen",
    "prediction": "Welches Merkmal allein reicht nicht?",
    "lines": [
      [
        "客",
        "昨日の夕方、電車で黒いスマホをなくしました。",
        "Gestern Abend schwarzes Handy im Zug verloren."
      ],
      [
        "職員",
        "黒いスマホは二つ届いています。一つは赤いケースに入っています。",
        "Es sind zwei schwarze Handys da, eines mit roter Hülle."
      ],
      [
        "客",
        "私のケースは青いです。画面の左上に小さい傷があります。",
        "Meine Hülle ist blau, links oben ein kleiner Kratzer."
      ],
      [
        "職員",
        "もう一つは青いケースですが、画面に傷はありません。",
        "Das andere hat blaue Hülle, aber keinen Kratzer."
      ],
      [
        "客",
        "そうですか。まだ私のかどうかわかりませんね。",
        "Dann ist noch nicht klar, ob es meins ist."
      ],
      [
        "職員",
        "見つかったら連絡しますので、こちらに電話番号を書いてください。",
        "Wenn wir es finden, melden wir uns. Bitte Telefonnummer eintragen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welches konkrete zusätzliche Merkmal hat das gesuchte Handy?",
        "画面の左上に傷があります。",
        "左上に小さい傷があります。",
        "赤いケースです。",
        "Die gesuchte Hülle ist blau.",
        "画面の左上に小さい傷"
      ],
      [
        "inference",
        "Ist eines der beiden Stücke bereits eindeutig als Eigentum erkannt?",
        "いいえ、まだわかりません。",
        "どちらも全部の特徴が合いません。",
        "はい、青いケースのスマホです。",
        "Auch das blaue Handy hat nicht den genannten Kratzer.",
        "青いケースですが、画面に傷はありません"
      ],
      [
        "intent",
        "Warum soll die Telefonnummer aufgeschrieben werden?",
        "見つかったら連絡するためです。",
        "あとで連絡するためです。",
        "新しいスマホを買うためです。",
        "Die Kontaktdaten dienen der Fundbenachrichtigung.",
        "見つかったら連絡します"
      ]
    ],
    "vocabulary": [
      [
        "傷",
        "きず",
        "Kratzer",
        "小さい傷"
      ],
      [
        "特徴",
        "とくちょう",
        "Merkmal",
        "ケースは青い"
      ]
    ],
    "notes": "Eine oberflächliche Übereinstimmung allein begründet keinen Eigentumsnachweis.",
    "response": [
      "Bitte höflich um Nachricht, wenn ein passendes Telefon auftaucht.",
      "見つかったら連絡をお願いします。",
      "私のスマホが見つかったら教えてください。",
      "青いケースなら全部私のです。",
      "Die Hülle allein reicht nicht zur Identifizierung."
    ],
    "transfer": [
      "Anderer Verlust: graues Handy, grüne Hülle, Kratzer rechts unten. Beschreibe es.",
      "灰色のスマホで、緑のケースと右下に傷があります。",
      "緑のケースで画面の右下に傷があります。",
      "青いケースで左上に傷があります。",
      "Es gelten völlig neue Merkmale."
    ]
  },
  {
    "id": "a2-team-report-handoff",
    "title": "Übergabe eines Teamberichts",
    "genre": "dialogue",
    "level": "A2",
    "units": [
      "p26:library-project",
      "p25:library"
    ],
    "situation": "Eine Lerngruppe verändert wegen fehlender Ergebnisse den Aufbau ihres Berichts.",
    "listeningGoal": "Zuständigkeit, geänderten Umfang und unveränderte Abgabe verstehen",
    "prediction": "Was wird gestrichen, was bleibt?",
    "lines": [
      [
        "はる",
        "発表の資料、どこまでできた？",
        "Wie weit sind die Unterlagen?"
      ],
      [
        "けい",
        "グラフはできたけど、アンケートの結果がまだ全部集まっていない。",
        "Grafik fertig, aber Fragebogenergebnisse unvollständig."
      ],
      [
        "はる",
        "じゃ、今回は結果の説明を短くして、調査の方法を詳しく話そう。",
        "Dann Ergebnisse kurz halten, Methode genauer erklären."
      ],
      [
        "けい",
        "いいね。私は方法の部分を書き直すよ。グラフはそのまま使おう。",
        "Ich überarbeite den Methodenteil; Grafik bleibt."
      ],
      [
        "はる",
        "ありがとう。締め切りは金曜日のままだね。",
        "Danke, Frist bleibt Freitag."
      ],
      [
        "けい",
        "うん、木曜日までに私の部分を送るね。",
        "Ja, meinen Teil schicke ich bis Donnerstag."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welchen Teil schreibt Kei neu?",
        "調査の方法の部分です。",
        "方法の部分です。",
        "グラフです。",
        "Die Grafik bleibt unverändert.",
        "方法の部分を書き直す"
      ],
      [
        "inference",
        "Warum wird der Ergebnisteil gekürzt?",
        "結果がまだ全部集まっていないからです。",
        "アンケートがまだ終わっていないからです。",
        "金曜日は休みだからです。",
        "Die unvollständige Datensammlung ist der Grund.",
        "結果がまだ全部集まっていない"
      ],
      [
        "intent",
        "Was ist die interne Abgabefrist für Keis Teil?",
        "木曜日までです。",
        "木曜日に送ります。",
        "金曜日の夜です。",
        "Die Teamfrist ist Freitag, Kei liefert bereits Donnerstag.",
        "木曜日までに私の部分を送る"
      ]
    ],
    "vocabulary": [
      [
        "調査",
        "ちょうさ",
        "Untersuchung",
        "調査の方法"
      ],
      [
        "締め切り",
        "しめきり",
        "Abgabefrist",
        "締め切りは"
      ]
    ],
    "notes": "Die Gesamtfrist und Keis interne Frist sind verschiedene Angaben. Das Original der Grafik bleibt bestehen.",
    "response": [
      "Fasse Keis zugesagte Arbeit zusammen.",
      "木曜日までに方法の部分を書き直して送ります。",
      "グラフはそのままで、方法を直します。",
      "金曜日にグラフを全部書き直します。",
      "Grafik und interne Frist werden falsch dargestellt."
    ],
    "transfer": [
      "Neue Gruppe: Einleitung bis Mittwoch verbessern, Tabellen bleiben, Gesamtfrist Donnerstag. Beschreibe deine Aufgabe.",
      "水曜日までに導入を書き直します。表はそのままです。",
      "水曜日に導入の部分を送ります。",
      "木曜日までに表を全部直します。",
      "Hier soll die Einleitung korrigiert werden."
    ]
  },
  {
    "id": "a2-friend-invite-repair",
    "title": "Verabredung mit höflicher Absage",
    "genre": "dialogue",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Neue Bekannte möchten sich treffen, doch eine Person kann nicht am ersten Termin.",
    "listeningGoal": "Absage von unverbindlicher Zusage unterscheiden und Ersatztermin hören",
    "prediction": "Ist die erste Einladung angenommen?",
    "lines": [
      [
        "さき",
        "金曜日の夜、一緒に映画に行きませんか。",
        "Möchten Sie Freitagabend ins Kino?"
      ],
      [
        "ゆか",
        "ありがとうございます。でも、金曜日はちょっと予定がありまして。",
        "Danke, aber Freitag habe ich schon etwas vor."
      ],
      [
        "さき",
        "そうですか。では、土曜日の午後はいかがですか。",
        "Verstehe, dann Samstagnachmittag?"
      ],
      [
        "ゆか",
        "土曜日なら大丈夫です。三時からでしたら行けます。",
        "Samstag passt, aber erst ab drei."
      ],
      [
        "さき",
        "それでは、四時の映画にしましょう。駅で三時半に会えますか。",
        "Dann Film um vier; Treffen Bahnhof um halb vier?"
      ],
      [
        "ゆか",
        "はい、駅で三時半ですね。楽しみにしています。",
        "Ja, 15:30 am Bahnhof. Ich freue mich."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welcher Filmtermin wird schließlich vereinbart?",
        "土曜日の四時です。",
        "土曜日の午後四時の映画です。",
        "金曜日の夜です。",
        "Die Freitagseinladung wurde abgelehnt.",
        "四時の映画にしましょう"
      ],
      [
        "inference",
        "Weshalb ist Samstagnachmittag ab 15 Uhr möglich?",
        "土曜日なら時間があるからです。",
        "三時からなら行けるからです。",
        "金曜日の予定がなくなったからです。",
        "Freitag bleibt belegt; Samstag ist frei.",
        "三時からでしたら行けます"
      ],
      [
        "intent",
        "Wo und wann wollen sie sich treffen?",
        "駅で三時半です。",
        "土曜日の午後三時半に駅です。",
        "映画館で四時半です。",
        "Der Film beginnt um vier, Treffen zuvor am Bahnhof.",
        "駅で三時半に会えますか"
      ]
    ],
    "vocabulary": [
      [
        "でしたら",
        "でしたら",
        "wenn es ... wäre (höflich)",
        "三時からでしたら"
      ],
      [
        "予定",
        "よてい",
        "Termin/Plan",
        "予定がありまして"
      ]
    ],
    "notes": "金曜日はちょっと予定が… ist im Kontext eine höfliche Absage, keine unsichere Zusage.",
    "response": [
      "Bestätige den tatsächlichen Treffpunkt höflich.",
      "土曜日の三時半に駅でお会いしましょう。",
      "土曜日の三時半に駅ですね。",
      "金曜日の夜に会いましょう。",
      "Die Freitagseinladung konnte nicht angenommen werden."
    ],
    "transfer": [
      "Neue Einladung: Dienstag geht nicht, Donnerstag ab 18 Uhr schon. Schlage Treffen um 18:30 vor.",
      "木曜日の六時半はいかがですか。",
      "木曜日なら六時半に会えます。",
      "火曜日の夜に行きます。",
      "Der neue verfügbare Tag ist Donnerstag."
    ]
  },
  {
    "id": "a2-restaurant-reservation",
    "title": "Restaurant ohne gewünschte Sitzplätze",
    "genre": "service",
    "level": "A2",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "situation": "Eine Person telefoniert wegen einer Tischreservierung.",
    "listeningGoal": "Verfügbarkeit, Personenanzahl und Alternativtermin verbinden",
    "prediction": "Bleibt die erste Wunschzeit bestehen?",
    "lines": [
      [
        "客",
        "土曜日の七時に四人で予約できますか。",
        "Samstag um sieben für vier Personen reservierbar?"
      ],
      [
        "店員",
        "申し訳ありません。七時は満席ですが、六時か八時半なら空いています。",
        "Sieben ausgebucht; sechs oder halb neun frei."
      ],
      [
        "客",
        "一人が仕事で遅くなるので、六時は難しいです。八時半でお願いします。",
        "Jemand arbeitet länger, sechs geht nicht; bitte halb neun."
      ],
      [
        "店員",
        "八時半に四名様ですね。お席は窓側ではなく中央になります。",
        "20:30 vier Personen, Tisch in der Mitte statt am Fenster."
      ],
      [
        "客",
        "大丈夫です。四人でお願いします。",
        "Das ist okay, vier Personen."
      ],
      [
        "店員",
        "では、お名前をお願いします。",
        "Dann bitte Ihren Namen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Uhrzeit nimmt der Gast?",
        "八時半です。",
        "土曜日の八時半です。",
        "七時です。",
        "Sieben war ausgebucht.",
        "八時半でお願いします"
      ],
      [
        "inference",
        "Warum wird die frühere Alternative um sechs ausgeschlossen?",
        "一人が仕事で遅くなるからです。",
        "仕事が終わらない人がいるからです。",
        "六時も満席だからです。",
        "Sechs ist verfügbar, aber die Gruppe kann nicht.",
        "一人が仕事で遅くなるので"
      ],
      [
        "intent",
        "Welche Einschränkung beim Sitzplatz akzeptiert der Gast?",
        "中央の席です。",
        "窓側ではない席です。",
        "窓側の席です。",
        "Ein Fensterplatz steht nicht zu.",
        "窓側ではなく中央"
      ]
    ],
    "vocabulary": [
      [
        "満席",
        "まんせき",
        "ausgebucht",
        "七時は満席"
      ],
      [
        "中央",
        "ちゅうおう",
        "Mitte",
        "中央になります"
      ]
    ],
    "notes": "Fiktive Unterhaltung, keine echte Tischverfügbarkeit. Eine angebotene Uhrzeit ist nicht für alle Gruppen praktisch.",
    "response": [
      "Bestätige korrekt die Reservierungsdetails.",
      "土曜日の八時半に四人でお願いします。",
      "八時半に四名です。",
      "土曜日の七時に四人です。",
      "Sieben ist ausgebucht."
    ],
    "transfer": [
      "Neues Restaurant: Sonntag 19 Uhr ausgebucht, 20 Uhr für drei frei. Bitte um die Alternative.",
      "日曜日の八時に三人でお願いします。",
      "日曜日の二十時に三名で予約したいです。",
      "土曜日の八時半に四人でお願いします。",
      "Andere Zeit, Tag und Gruppengröße."
    ]
  },
  {
    "id": "a2-training-announcement",
    "title": "Schwimmkurs: Ort, Zeit und Ausnahme",
    "genre": "announcement",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Ein fiktiver Schwimmverein informiert über Kursänderungen.",
    "listeningGoal": "Wochenplan und einmalige Ausnahme unterscheiden",
    "prediction": "Welche Woche ist anders als üblich?",
    "lines": [
      [
        "案内",
        "水泳教室は毎週火曜日の夕方六時から七時までです。",
        "Schwimmkurs jeden Dienstag 18 bis 19 Uhr."
      ],
      [
        "案内",
        "来週だけはプールの点検があるため、水曜日の同じ時間に行います。",
        "Nur nächste Woche wegen Wartung am Mittwoch zur selben Zeit."
      ],
      [
        "案内",
        "集合場所はプールの入り口ではなく、一階の受付前になります。",
        "Treffpunkt vor der Rezeption im Erdgeschoss, nicht Eingang."
      ],
      [
        "案内",
        "タオルと水泳帽を忘れずにお持ちください。",
        "Handtuch und Badekappe mitbringen."
      ],
      [
        "案内",
        "再来週からは火曜日の通常の時間に戻ります。",
        "Ab übernächster Woche wieder regulärer Dienstag."
      ]
    ],
    "questions": [
      [
        "detail",
        "An welchem Tag findet der Kurs nächste Woche statt?",
        "水曜日です。",
        "来週だけ水曜日です。",
        "火曜日です。",
        "Für nur nächste Woche gibt es eine Ausnahme.",
        "来週だけは…水曜日"
      ],
      [
        "inference",
        "Gilt der Mittwoch ab jetzt dauerhaft?",
        "いいえ、再来週は火曜日です。",
        "次の週から火曜日に戻ります。",
        "はい、ずっと水曜日です。",
        "Übernächste Woche Rückkehr zum Dienstag.",
        "再来週からは火曜日の通常の時間に戻ります"
      ],
      [
        "intent",
        "Wo sollen sich Teilnehmende treffen?",
        "一階の受付前です。",
        "受付の前です。",
        "プールの入り口です。",
        "Der Eingang wird ausdrücklich ausgeschlossen.",
        "入り口ではなく、一階の受付前"
      ]
    ],
    "vocabulary": [
      [
        "点検",
        "てんけん",
        "Kontrolle/Wartung",
        "プールの点検"
      ],
      [
        "再来週",
        "さらいしゅう",
        "übernächste Woche",
        "再来週から"
      ]
    ],
    "notes": "来週だけ markiert eine einmalige Änderung; 再来週 die Rückkehr zum Regelfall.",
    "response": [
      "Fasse die Ausnahme für nächste Woche zusammen.",
      "来週は水曜日の六時に受付前で集まります。",
      "水曜日の六時からです。受付で会います。",
      "来週も火曜日に入り口で会います。",
      "Tag und Treffpunkt sind anders."
    ],
    "transfer": [
      "Neuer Kurs: normalerweise Freitag um 17 Uhr, nächste Woche einmalig Donnerstag um 17 Uhr, dann wieder Freitag. Beschreibe.",
      "来週だけ木曜日の五時で、その次は金曜日に戻ります。",
      "来週は木曜日ですが、再来週は金曜日です。",
      "これからずっと木曜日です。",
      "Die Änderung gilt nur für eine Woche."
    ]
  },
  {
    "id": "a2-mini-interview-language",
    "title": "Sprachlernen durch tägliche Gespräche",
    "genre": "interview",
    "level": "A2",
    "units": [
      "p26:library-project",
      "p25:library"
    ],
    "situation": "Interview mit einer Sprachschülerin über ihre neue Lernroutine.",
    "listeningGoal": "Frühere Schwierigkeit, Lernänderung und verbliebene Grenze verknüpfen",
    "prediction": "Was kann sie nun besser und was noch nicht?",
    "lines": [
      [
        "記者",
        "日本語を勉強し始めたころ、何が大変でしたか。",
        "Was war zu Beginn schwierig?"
      ],
      [
        "りお",
        "読むことより、聞いてすぐ答えることが難しかったです。",
        "Schwieriger als Lesen war Zuhören und sofort reagieren."
      ],
      [
        "記者",
        "どうやって練習しましたか。",
        "Wie haben Sie geübt?"
      ],
      [
        "りお",
        "毎朝、短い会話を二回聞いて、聞こえたことをノートに書きました。そのあと声に出してまねしました。",
        "Jeden Morgen zweimal kurze Gespräche gehört, notiert und nachgesprochen."
      ],
      [
        "記者",
        "今は全部わかるようになりましたか。",
        "Verstehen Sie inzwischen alles?"
      ],
      [
        "りお",
        "いいえ。速いニュースはまだ難しいです。でも、買い物の会話なら前よりよくわかります。",
        "Schnelle Nachrichten noch schwer, Einkaufsgespräche besser."
      ]
    ],
    "questions": [
      [
        "detail",
        "Was war für Rio zunächst besonders schwierig?",
        "聞いてすぐ答えることです。",
        "会話を聞いて答えることです。",
        "読むことだけです。",
        "Die Schwierigkeit wird ausdrücklich zum Lesen kontrastiert.",
        "聞いてすぐ答えることが難しかった"
      ],
      [
        "inference",
        "Welche Übung unterstützt das Nachsprechen?",
        "短い会話を二回聞くことです。",
        "聞いてノートに書いたあとまねします。",
        "ニュースを一度だけ見ることです。",
        "Zuerst hört und notiert sie, dann spricht sie nach.",
        "そのあと声に出してまねしました"
      ],
      [
        "intent",
        "Welche Fähigkeit hat sich verbessert, ohne perfekt zu sein?",
        "買い物の会話を聞く力です。",
        "買い物の会話は前よりわかります。",
        "速いニュースを全部理解します。",
        "Sie versteht Einkaufsgespräche besser, schnelle Nachrichten noch nicht.",
        "買い物の会話なら前よりよくわかります"
      ]
    ],
    "vocabulary": [
      [
        "声に出す",
        "こえにだす",
        "laut aussprechen",
        "声に出して"
      ],
      [
        "まねする",
        "まねする",
        "nachahmen/nachsprechen",
        "まねしました"
      ]
    ],
    "notes": "Das Interview behauptet ausdrücklich keine perfekte Gesamtkompetenz; Fortschritt ist kontextgebunden.",
    "response": [
      "Beschreibe die Reihenfolge ihrer Hörübung.",
      "短い会話を二回聞いて、ノートに書き、それから声に出します。",
      "聞いてから、書いて、まねします。",
      "最初に速いニュースを全部理解します。",
      "Das ist nicht ihre beschriebene Routine."
    ],
    "transfer": [
      "Neuer Lernender: hört täglich eine Nachricht, wiederholt schwierige Sätze und kann nun Ansagen besser verstehen. Beschreibe den Fortschritt.",
      "毎日聞いて練習したので、案内が前よりわかるようになりました。",
      "前より放送が聞き取れます。",
      "全部のニュースを完璧に理解します。",
      "Die neue Angabe betrifft Ansagen, nicht perfektes Nachrichtenverständnis."
    ]
  },
  {
    "id": "a2-park-cleanup-schedule",
    "title": "Gemeindeaktion mit begrenzten Aufgaben",
    "genre": "message",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Eine Koordinatorin informiert neue Helfer per Sprachnachricht.",
    "listeningGoal": "Aufgabenänderung und benötigte Materialien aus einer einseitigen Nachricht erschließen",
    "prediction": "Wird Müll gesammelt oder werden Bücher sortiert?",
    "lines": [
      [
        "担当者",
        "ボランティアの皆さんへ。今週の日曜日の活動についてご連絡します。",
        "Nachricht an die Helfer wegen Sonntag."
      ],
      [
        "担当者",
        "公園でごみを集める予定でしたが、雨のため来週に延期します。",
        "Die Parkreinigung wird wegen Regen auf nächste Woche verschoben."
      ],
      [
        "担当者",
        "代わりに、図書館の倉庫で古い本を整理します。午前十時に図書館の裏口に集まってください。",
        "Stattdessen alte Bücher im Bibliothekslager sortieren, Treffen 10 Uhr am Hintereingang."
      ],
      [
        "担当者",
        "軍手は用意してありますが、本を入れる大きい袋が足りません。持っている人は持って来てください。",
        "Handschuhe vorhanden, große Taschen fehlen."
      ],
      [
        "担当者",
        "途中から来る方は、先にメールでお知らせください。",
        "Wer später kommt, vorher per Mail informieren."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann und wo treffen sich die Helfer?",
        "日曜日の十時に図書館の裏口です。",
        "午前十時に裏口に集まります。",
        "公園の入り口です。",
        "Der Parkeinsatz wurde verschoben.",
        "図書館の裏口に集まってください"
      ],
      [
        "inference",
        "Welche Ausrüstung muss nicht extra mitgebracht werden?",
        "軍手です。",
        "軍手は用意されています。",
        "大きい袋です。",
        "Es fehlen Taschen, nicht Handschuhe.",
        "軍手は用意してありますが"
      ],
      [
        "intent",
        "Wie sollen Helfer eine späte Ankunft ankündigen?",
        "先にメールします。",
        "メールで知らせます。",
        "会ってから話します。",
        "Die Meldung soll vorher erfolgen.",
        "先にメールでお知らせください"
      ]
    ],
    "vocabulary": [
      [
        "延期",
        "えんき",
        "Verschiebung",
        "来週に延期"
      ],
      [
        "裏口",
        "うらぐち",
        "Hintereingang",
        "図書館の裏口"
      ]
    ],
    "notes": "Die Verlegung betrifft Arbeit, Ort und Ausrüstung; die freiwillige Mitnahme von Taschen ist keine Pflicht für alle.",
    "response": [
      "Bestätige den neuen Sonntagseinsatz.",
      "日曜日の十時に図書館の裏口へ行きます。",
      "日曜日は図書館で本を整理します。",
      "日曜日に公園でごみを集めます。",
      "Diese Aufgabe wurde auf nächste Woche verschoben."
    ],
    "transfer": [
      "Neue Aktion: Gartenarbeit wegen Regen verschoben; heute Bücherkisten im Gemeindehaus um elf sortieren. Sage zu.",
      "十一時に公民館で本の箱を整理します。",
      "今日は公民館で手伝います。十一時に行きます。",
      "今日は公園でごみを集めます。",
      "Es ist eine andere Innenraumaufgabe."
    ]
  }
] satisfies P47RawScene[];
export const p47ScenesE=p47CorpusE.map(authoredP47Scene);
