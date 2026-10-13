import {authoredP46Reading,type P46RawReading} from "./reading46-types";
/** Six original extended A2 texts with cause, limits, interpretation and synthesis. */
export const p46CorpusE = [
  {
    "id": "mountain-weather",
    "genre": "guide",
    "level": "A2",
    "units": [
      "p25:transport",
      "p23:plans"
    ],
    "title": "山へ行く前に",
    "purpose": "Wetterbedingungen, Sicherheit und Alternativplan lesen",
    "setting": "Besucherhinweise für eine fiktive Bergregion",
    "paragraphs": [
      "青山へ行く皆さんへ。山の天気は町より早く変わることがあります。今週の土曜日は午前中に晴れる見込みですが、午後一時ごろから雨と強い風になる可能性があります。山の上まで歩くには、普通二時間半ぐらいかかります。午前十時よりあとに出発する方は、頂上まで行かないでください。",
      "天気が悪くなった場合は、途中の休憩所まで戻り、そこで係員の案内を聞いてください。帰りのバスは午後四時が最後です。日曜日は雨が強くなる予報なので、山道を歩くイベントは行いません。町の資料館は日曜日も開いています。"
    ],
    "words": [
      [
        "見込み",
        "みこみ",
        "Prognose",
        "晴れる見込み"
      ],
      [
        "可能性",
        "かのうせい",
        "Möglichkeit",
        "なる可能性"
      ],
      [
        "頂上",
        "ちょうじょう",
        "Gipfel",
        "頂上まで"
      ],
      [
        "休憩所",
        "きゅうけいじょ",
        "Rastplatz",
        "途中の休憩所"
      ]
    ],
    "contextNote": "Fiktiver Sicherheitstext, keine reale Bergwanderempfehlung. Eine Warnung muss mit der Laufdauer und den letzten Rückfahrmöglichkeiten kombiniert werden.",
    "questions": [
      [
        "detail",
        "Wann wird am Samstag schlechtes Wetter erwartet?",
        "午後一時ごろからです。",
        "午後一時から雨と風になるかもしれません。",
        "朝六時からです。",
        "Der Vormittag soll voraussichtlich sonnig sein.",
        "午後一時ごろから雨と強い風"
      ],
      [
        "inference",
        "Warum soll man nach 10 Uhr nicht mehr bis zum Gipfel gehen?",
        "天気が悪くなる前に戻れないかもしれないからです。",
        "歩くのに時間がかかるからです。",
        "頂上に店がないからです。",
        "Zweieinhalb Stunden Aufstieg bei Wetterumschwung um 13 Uhr schaffen Zeitdruck.",
        "午前十時よりあとに出発する方は、頂上まで行かないで"
      ],
      [
        "purpose",
        "Welche Alternative gibt es am verregneten Sonntag?",
        "町の資料館です。",
        "資料館へ行けます。",
        "山道のイベントです。",
        "Die Wanderveranstaltung am Sonntag fällt aus.",
        "町の資料館は日曜日も開いています"
      ]
    ],
    "writing": [
      "Schreibe eine angemessene Zusammenfassung: Bei schlechtem Wetter sollte man umkehren.",
      "天気が悪くなったら、戻ってください。",
      "雨と風が強くなったら、休憩所に戻ります。",
      "午後から頂上に行きます。",
      "Die Warnung rät gerade von spätem Gipfelaufstieg ab."
    ],
    "returnCue": [
      "Neue Wetterwarnung: Am Nachmittag Gewitter; ein Museumsbesuch ist möglich. Empfiehl stattdessen das Museum.",
      "午後は雷雨なので、博物館に行きましょう。",
      "天気が悪いから、博物館に行ったほうがいいです。",
      "午後は山に登りましょう。",
      "Die neue Warnung betrifft Gewitter am Nachmittag."
    ]
  },
  {
    "id": "school-lunch-project",
    "genre": "article",
    "level": "A2",
    "units": [
      "p23:cafe",
      "p26:library-project"
    ],
    "title": "学校の昼ご飯を変える",
    "purpose": "Beteiligteninteressen und einen Versuch im Schulalltag analysieren",
    "setting": "Kurzer journalistischer Schulbericht",
    "paragraphs": [
      "ある中学校では、昼ご飯のあとに食べ物がたくさん残ることが問題になっていました。生徒たちは「食べる時間が短い」「量が多すぎる」と話しました。一方、給食を作る人たちは、毎日何人が食べるかわからないので準備が難しいと考えていました。",
      "学校は先月から、新しい方法を試しています。生徒は朝のうちに食べたい量を選びます。そして昼休みを十分長くしました。その結果、残る食べ物は少なくなりましたが、まだ時々足りない料理も出ます。学校は来月も意見を集めて、方法を直す予定です。"
    ],
    "words": [
      [
        "残る",
        "のこる",
        "übrig bleiben",
        "食べ物が残る"
      ],
      [
        "一方",
        "いっぽう",
        "andererseits",
        "一方、給食を"
      ],
      [
        "給食",
        "きゅうしょく",
        "Schulessen",
        "給食を作る"
      ],
      [
        "意見",
        "いけん",
        "Meinung",
        "意見を集める"
      ]
    ],
    "contextNote": "Der Bericht stellt zwei Sichtweisen und eine unvollkommene Maßnahme gegenüber. Das Ergebnis ist verbessert, aber nicht vollständig gelöst.",
    "questions": [
      [
        "detail",
        "Welche zwei Probleme nannten Schüler vor der Änderung?",
        "時間が短く、量が多すぎることです。",
        "食べる時間と量です。",
        "教室が遠いことです。",
        "Es geht um Essenszeit und Portionsgröße.",
        "食べる時間が短い」「量が多すぎる"
      ],
      [
        "inference",
        "Ist nach dem Versuch jedes Problem gelöst?",
        "いいえ、料理が足りないときもあります。",
        "まだ問題があります。",
        "はい、全部解決しました。",
        "Manchmal reicht eine Speise nicht.",
        "まだ時々足りない料理も出ます"
      ],
      [
        "purpose",
        "Warum sammelt die Schule weiterhin Meinungen?",
        "方法をもっとよくするためです。",
        "来月も方法を直すためです。",
        "今すぐ給食をやめるためです。",
        "Die Fortsetzung zielt auf Verbesserung.",
        "来月も意見を集めて、方法を直す"
      ]
    ],
    "writing": [
      "Beschreibe Ergebnis und verbleibendes Problem.",
      "残る食べ物は減りましたが、足りない料理もあります。",
      "前よりよくなりましたが、まだ問題があります。",
      "すべての問題がなくなりました。",
      "Die Lage ist verbessert, aber nicht perfekt."
    ],
    "returnCue": [
      "Anderes Projekt: Der Schulbus ist pünktlicher, manchmal aber noch voll. Schreibe den Kontrast.",
      "バスは前より時間どおりですが、時々まだ混んでいます。",
      "時間はよくなりましたが、バスは時々いっぱいです。",
      "全部の問題がなくなりました。",
      "Die neue Situation nennt ein verbleibendes Problem."
    ]
  },
  {
    "id": "city-bike-share",
    "genre": "instructions",
    "level": "A2",
    "units": [
      "p25:transport",
      "p25:shopping"
    ],
    "title": "自転車を借りる手順",
    "purpose": "Anleitung, Gebühren und Rückgabebedingung verknüpfen",
    "setting": "Fiktive Anleitung einer Fahrradstation",
    "paragraphs": [
      "この町では、駅の前と公園の入り口で自転車を借りられます。まず、画面で使いたい時間を選びます。そのあと、カードで料金を払い、表示された番号の自転車を使ってください。一時間までは三百円です。一時間を過ぎると、三十分ごとに百円かかります。",
      "借りた場所と違う場所に返しても大丈夫です。ただし、自転車は必ず町の決められた場所に返してください。駅の自転車置き場がいっぱいの場合は、公園の入り口の置き場を使えます。返すときは画面で『返却完了』と表示されるまで確認してください。"
    ],
    "words": [
      [
        "料金",
        "りょうきん",
        "Gebühr",
        "料金を払い"
      ],
      [
        "番号",
        "ばんごう",
        "Nummer",
        "表示された番号"
      ],
      [
        "返却",
        "へんきゃく",
        "Rückgabe",
        "返却完了"
      ],
      [
        "置き場",
        "おきば",
        "Abstellplatz",
        "自転車置き場"
      ]
    ],
    "contextNote": "Alle Kosten sind erfundene Unterrichtswerte. Der Text unterscheidet flexible Stationen von verpflichtend registrierter Rückgabe.",
    "questions": [
      [
        "detail",
        "Wie viel kostet bis zu einer Stunde Fahrt?",
        "三百円です。",
        "一時間までは三百円です。",
        "百円です。",
        "100 Yen ist nur der zusätzliche 30-Minuten-Preis.",
        "一時間までは三百円"
      ],
      [
        "inference",
        "Was tun, wenn die Fahrradstation am Bahnhof voll ist?",
        "公園の入り口に返します。",
        "公園の置き場を使います。",
        "道のどこでも置きます。",
        "Die erlaubte Alternative ist die Station am Park.",
        "公園の入り口の置き場を使えます"
      ],
      [
        "purpose",
        "Wann gilt die Rückgabe als bestätigt?",
        "返却完了と表示されたときです。",
        "画面で返却完了を確認したときです。",
        "自転車を置いたらすぐです。",
        "Abstellen allein ist nicht genug; die Anzeige muss die Rückgabe bestätigen.",
        "返却完了と表示されるまで確認"
      ]
    ],
    "writing": [
      "Fasse die Rückgabeanweisung zusammen.",
      "決められた場所に返して、画面を確認します。",
      "返却完了の表示を確認します。",
      "好きな道に自転車を置きます。",
      "Nur registrierte Orte sind erlaubt."
    ],
    "returnCue": [
      "Neuer Verleih: Du musst einen Schließcode nach Rückgabe bestätigen. Formuliere die Anweisung.",
      "返したあと、暗証番号を確認してください。",
      "返却したらコードを確認します。",
      "自転車を置くだけでいいです。",
      "Die neue Rückgaberegel verlangt eine Codebestätigung."
    ]
  },
  {
    "id": "friends-photography",
    "genre": "story",
    "level": "A2",
    "units": [
      "p23:plans",
      "p25:directions"
    ],
    "title": "写真にない思い出",
    "purpose": "Erzählperspektive und emotionale Entwicklung verstehen",
    "setting": "Originale A2-Kurzgeschichte",
    "paragraphs": [
      "はるかは旅行に行くたびに、たくさん写真を撮っていました。先月、友だちのなおと海の近くの町へ行きました。最初の日、はるかはきれいな建物を見つけるたびに写真を撮りました。しかし、なおが話しているときもカメラを見ていたので、なおは少しさびしくなりました。",
      "次の日、二人は小さな港を歩きました。はるかはカメラをかばんに入れて、なおの話をゆっくり聞きました。二人は昔の学校のことや、これからやってみたいことを話しました。帰りの電車で、はるかは「今日は写真が少ないけれど、昨日よりよく覚えている」と言いました。"
    ],
    "words": [
      [
        "たびに",
        "たびに",
        "jedes Mal wenn",
        "旅行に行くたびに"
      ],
      [
        "港",
        "みなと",
        "Hafen",
        "小さな港"
      ],
      [
        "さびしい",
        "さびしい",
        "einsam/traurig",
        "少しさびしく"
      ],
      [
        "覚える",
        "おぼえる",
        "sich erinnern",
        "よく覚えている"
      ]
    ],
    "contextNote": "Der Schluss stellt Anzahl der Fotos und persönlich erlebte Erinnerung gegenüber, ohne Fotografieren grundsätzlich als falsch darzustellen.",
    "questions": [
      [
        "detail",
        "Was machte Haruka am ersten Tag oft?",
        "写真を撮っていました。",
        "建物の写真をたくさん撮りました。",
        "ずっと本を読んでいました。",
        "Die Geschichte nennt das Fotografieren von Gebäuden.",
        "建物を見つけるたびに写真を撮りました"
      ],
      [
        "inference",
        "Warum war Nao am ersten Tag etwas traurig?",
        "はるかが話を聞いていなかったからです。",
        "カメラばかり見ていたからです。",
        "海がきたなかったからです。",
        "Nao fühlte sich übergangen, weil Haruka auf die Kamera achtete.",
        "なおが話しているときもカメラを見ていた"
      ],
      [
        "purpose",
        "Was meint Haruka mit dem Vergleich am Ende?",
        "話したことをよく覚えているという意味です。",
        "写真は少ないけれど、思い出が強いということです。",
        "昨日より写真が多かったという意味です。",
        "Sie hat ausdrücklich weniger Fotos, aber stärkere Erinnerungen.",
        "写真が少ないけれど、昨日よりよく覚えている"
      ]
    ],
    "writing": [
      "Erkläre die Veränderung in Harukas Verhalten.",
      "二日目はカメラをしまって、友だちの話を聞きました。",
      "二日目は写真より会話を大切にしました。",
      "二日目は写真だけを撮りました。",
      "Am zweiten Tag unterhielt sie sich mehr."
    ],
    "returnCue": [
      "Neue Geschichte: Ein Schüler legt das Handy weg, um einer Freundin zuzuhören. Beschreibe den Grund.",
      "友だちの話をよく聞くために、スマホをしまいました。",
      "スマホを使わずに友だちの話を聞きました。",
      "友だちの話を聞かずにスマホを見ました。",
      "Er legt das Handy gerade weg."
    ]
  },
  {
    "id": "local-volunteer-news",
    "genre": "community",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:library-project"
    ],
    "title": "図書館に新しい席を",
    "purpose": "Fakt, Vorschlag und noch offene Entscheidung in einer Nachricht unterscheiden",
    "setting": "Lokalnachricht über eine Bibliotheksinitiative",
    "paragraphs": [
      "駅前の図書館では、試験の前になると勉強する人が多くなり、席が足りなくなります。そこで大学生のグループが「夜も使える静かな部屋を増やしてほしい」と図書館に伝えました。図書館の職員は、その考えに興味を持ちましたが、夜に働く人を増やすことは簡単ではないと説明しました。",
      "来月はまず土曜日だけ、いつもより二時間長く開ける予定です。その間に何人が利用するかを調べて、今後どうするかを決めます。大学生たちは、開館時間が増えたら自分たちも机の整理などを手伝いたいと話しています。まだ毎日夜まで開くと決まったわけではありません。"
    ],
    "words": [
      [
        "職員",
        "しょくいん",
        "Mitarbeiter",
        "図書館の職員"
      ],
      [
        "利用",
        "りよう",
        "Nutzung",
        "何人が利用するか"
      ],
      [
        "開館",
        "かいかん",
        "Öffnung",
        "開館時間"
      ],
      [
        "整理",
        "せいり",
        "Ordnung schaffen",
        "机の整理"
      ]
    ],
    "contextNote": "Der Unterschied zwischen beschlossenem Probelauf und noch unentschiedener Dauerregelung ist zentral. Eine Planung ist kein belegter dauerhafter Beschluss.",
    "questions": [
      [
        "detail",
        "Was ist für den nächsten Monat konkret geplant?",
        "土曜日に二時間長く開けます。",
        "土曜日だけ開館時間を二時間延ばします。",
        "毎日夜まで開けます。",
        "Eine tägliche Verlängerung ist noch nicht beschlossen.",
        "まず土曜日だけ、いつもより二時間長く"
      ],
      [
        "inference",
        "Warum misst die Bibliothek die Zahl der Nutzer?",
        "今後どうするか決めるためです。",
        "時間を延ばすか考えるためです。",
        "学生を減らすためです。",
        "Die Messung soll spätere Entscheidungen informieren.",
        "何人が利用するかを調べて、今後どうするかを決めます"
      ],
      [
        "purpose",
        "Welche Schwierigkeit nennt das Personal?",
        "夜に働く人を増やすことです。",
        "夜の職員を増やすのが難しいことです。",
        "椅子を全部捨てることです。",
        "Die praktische Schwierigkeit ist zusätzliches Personal.",
        "夜に働く人を増やすことは簡単ではない"
      ]
    ],
    "writing": [
      "Fasse vorsichtig zusammen, was beschlossen und was noch offen ist.",
      "土曜日は長く開きますが、毎日についてはまだ決まっていません。",
      "土曜日だけ試してから今後を決めます。",
      "毎日夜まで開くことが決まりました。",
      "Die tägliche Verlängerung ist noch nicht beschlossen."
    ],
    "returnCue": [
      "Andere Stadt: Das Schwimmbad öffnet testweise sonntags länger, aber nicht dauerhaft. Schreibe diese Unterscheidung.",
      "日曜日は試しに長く開きますが、まだ正式には決まっていません。",
      "日曜日だけ試して、今後決めます。",
      "毎日長く開くことが決まりました。",
      "Die Regelung ist nur ein Versuch."
    ]
  },
  {
    "id": "weekend-workshop-program",
    "genre": "schedule",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:plans"
    ],
    "title": "週末の体験教室",
    "purpose": "Ablauf, Anmeldung und Kapazität in einem Programm lesen",
    "setting": "Programm eines fiktiven Kulturzentrums",
    "paragraphs": [
      "文化センターの週末体験教室は日曜日に開かれます。十時から十一時は書道、十一時半から十二時半は簡単な和菓子作り、午後二時から三時は日本の昔話を読む時間です。書道と昔話は予約しなくても参加できますが、和菓子作りは材料を準備するため、前日までの申し込みが必要です。",
      "和菓子作りに参加できるのは十二人までです。今のところ、あと二人申し込めます。参加費は書道が五百円、和菓子が八百円、昔話は無料です。全部に参加する人には昼休みが一時間以上ありますが、お昼ご飯は自分で用意してください。"
    ],
    "words": [
      [
        "体験",
        "たいけん",
        "Erlebnis-/Schnupperangebot",
        "体験教室"
      ],
      [
        "材料",
        "ざいりょう",
        "Zutaten/Material",
        "材料を準備"
      ],
      [
        "参加費",
        "さんかひ",
        "Teilnahmegebühr",
        "参加費は"
      ],
      [
        "申し込み",
        "もうしこみ",
        "Anmeldung",
        "前日までの申し込み"
      ]
    ],
    "contextNote": "Im Plan gibt es kostenpflichtige und kostenlose Angebote sowie eine begrenzte Veranstaltung mit Anmeldepflicht.",
    "questions": [
      [
        "detail",
        "Welche Veranstaltung benötigt eine Anmeldung bis zum Vortag?",
        "和菓子作りです。",
        "お菓子作りの教室です。",
        "昔話の時間です。",
        "Für die Märchenlesung ist keine Anmeldung nötig.",
        "和菓子作りは…前日までの申し込みが必要"
      ],
      [
        "inference",
        "Können noch drei Personen gemeinsam zum Süßigkeitenkurs angemeldet werden?",
        "いいえ、あと二人だけです。",
        "三人は申し込めません。",
        "はい、十二人までだからです。",
        "Es sind nur zwei Plätze frei, nicht zwölf.",
        "あと二人申し込めます"
      ],
      [
        "purpose",
        "Was müssen Besucher für die Mittagspause berücksichtigen?",
        "昼ご飯は自分で用意します。",
        "自分でお昼ご飯を持って行きます。",
        "昼ご飯は無料です。",
        "Eine Verpflegung ist ausdrücklich nicht enthalten.",
        "お昼ご飯は自分で用意してください"
      ]
    ],
    "writing": [
      "Schreibe: Ich möchte an der kostenlosen Märchenlesung um 14 Uhr teilnehmen.",
      "午後二時の昔話に参加したいです。",
      "無料の昔話の時間に行きます。",
      "午前十時の和菓子教室に行きます。",
      "Zeit und Veranstaltung wären anders."
    ],
    "returnCue": [
      "Neues Programm: Kostenloses Zeichenatelier um 16 Uhr. Sage, dass du teilnehmen möchtest.",
      "午後四時の絵の教室に参加したいです。",
      "四時の無料のお絵かき教室に行きたいです。",
      "午後二時の昔話に行きます。",
      "Die neue Veranstaltung ist das Zeichenatelier um 16 Uhr."
    ]
  }
] satisfies P46RawReading[];
export const p46ReadingsE=p46CorpusE.map(authoredP46Reading);
