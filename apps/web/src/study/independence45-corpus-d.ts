import {makeP45Challenge} from "./independence45-authoring";
/** Original changed-plan conversation independence in social contexts. */
export const p45CorpusD=[
makeP45Challenge({
  "id": "sport-venue-relocation",
  "title": "Sporttraining am anderen Ort",
  "level": "A1",
  "units": [
    "p23:plans",
    "p26:weekend-switch"
  ],
  "parentCase": "maybe-joining",
  "relationship": "guter Sportfreund, locker",
  "setting": "Dein Training war für die Sporthalle um 18 Uhr geplant; sie ist wegen Reparatur gesperrt.",
  "purpose": "Neuen Treffort, Zeit und benötigte Ausrüstung klären.",
  "unexpected": "Das Training findet im Park statt, aber bereits um 17 Uhr.",
  "outcome": "Du triffst den Freund um fünf im Park mit Sportschuhen.",
  "turns": [
    [
      "今日、六時から体育館で練習だよね。",
      "Bestätige zunächst sechs Uhr in der Halle.",
      "うん、六時に体育館だね。",
      "そうだね。六時に行くよ。",
      "昨日、体育館で練習した。",
      "Das ist kein heutiges Treffen.",
      "Die erste Vereinbarung bezieht sich auf die Halle."
    ],
    [
      "体育館は工事中なんだ。",
      "Frage nach einem anderen Trainingsort.",
      "じゃ、どこで練習する？",
      "ほかの場所はある？",
      "じゃ、体育館に入ろう。",
      "Die Halle ist gesperrt.",
      "Du musst den Treffpunkt ändern."
    ],
    [
      "公園で五時からだって。",
      "Übernimm Park und fünf Uhr.",
      "わかった。五時に公園に行くよ。",
      "じゃ、五時に公園でね。",
      "六時に体育館で会おう。",
      "Beide Angaben wurden korrigiert.",
      "Die neue Nachricht ersetzt Zeit und Ort."
    ],
    [
      "運動靴を忘れないでね。",
      "Versprich, Sportschuhe mitzubringen.",
      "うん、運動靴を持っていくね。",
      "わかった。忘れないよ。",
      "じゃ、靴はいらないね。",
      "Du brauchst ausdrücklich Sportschuhe.",
      "Die letzte Nachricht betrifft Ausrüstung, nicht die Uhrzeit."
    ]
  ],
  "returnCue": [
    "Ein anderes Training beginnt nun Samstag um 16 Uhr im Park statt in der Halle. Bestätige Ort und Zeit.",
    "土曜日の四時に公園で会おう。",
    "わかった。土曜日の四時に公園に行く。",
    "土曜日の六時に体育館に行く。",
    "Alter Ort und alte Zeit gelten nicht mehr."
  ]
}),
makeP45Challenge({
  "id": "library-quiet-corner",
  "title": "Ruhiger Platz erst nach Umzug",
  "level": "A2",
  "units": [
    "p25:library",
    "p26:library-project"
  ],
  "parentCase": "study-room-option",
  "relationship": "Bibliothekar, höflich",
  "setting": "Du suchst einen ruhigen Lernort und möchtest dort telefonieren. Telefonate sind in diesem Bereich verboten.",
  "purpose": "Ruhe und Telefonat an zwei geeigneten Orten trennen.",
  "unexpected": "Im ruhigen Raum sind Anrufe nicht erlaubt; der Flur hat einen Telefonbereich.",
  "outcome": "Du telefonierst zunächst im Flur und lernst danach im ruhigen Raum.",
  "turns": [
    [
      "どんな席をお探しですか。",
      "Bitte um einen ruhigen Platz.",
      "静かな席を探しています。",
      "静かな場所で勉強したいです。",
      "にぎやかな席がいいです。",
      "Du möchtest ausdrücklich einen ruhigen Arbeitsplatz.",
      "Die Bibliothek kann einen geeigneten Platz nennen."
    ],
    [
      "二階の奥が静かですよ。",
      "Erfrage, ob du dort kurz telefonieren darfst.",
      "そこで電話してもいいですか。",
      "二階で電話はできますか。",
      "じゃ、そこで電話します。",
      "Eine Frage nach der Regel ist nötig.",
      "Der vorgeschlagene Raum ist leise."
    ],
    [
      "そこでは電話できません。廊下の電話スペースを使ってください。",
      "Nimm die neue Regel und den Ort an.",
      "わかりました。廊下で電話します。",
      "まず電話スペースに行きます。",
      "では、静かな席で電話します。",
      "Telefonate sind im ruhigen Bereich verboten.",
      "Trenne zwei Tätigkeiten räumlich."
    ],
    [
      "電話が終わったら二階で勉強できます。",
      "Bestätige die Reihenfolge.",
      "電話のあとで二階で勉強します。",
      "はい、先に電話します。ありがとうございます。",
      "二階で先に電話します。",
      "Die erste Tätigkeit findet im Flur statt.",
      "Nach dem Telefonat kannst du leise lernen."
    ]
  ],
  "returnCue": [
    "Eine neue Bibliothek erlaubt Essen nur im Café. Sage, dass du erst im Café isst und danach im Lernraum liest.",
    "先にカフェで食べてから、勉強します。",
    "カフェで食べたあとで本を読みます。",
    "勉強室で食べます。",
    "Essen ist im Lernraum nicht erlaubt."
  ]
}),
makeP45Challenge({
  "id": "dinner-new-guest",
  "title": "Unerwarteter Gast zum Abendessen",
  "level": "A2",
  "units": [
    "p23:plans",
    "p23:cafe"
  ],
  "parentCase": "decline-friend-party",
  "relationship": "vertraute Freundin, locker",
  "setting": "Du kochst für zwei Freunde. Kurz vor Beginn kommt eine dritte Person dazu.",
  "purpose": "Zusätzlichen Gast willkommen heißen und die Essensmenge sinnvoll anpassen.",
  "unexpected": "Die Freundin bringt ihre Schwester mit, die kein Fleisch isst.",
  "outcome": "Alle essen gemeinsam, die zusätzliche Portion ist ohne Fleisch.",
  "turns": [
    [
      "今夜、一緒に食べようね。",
      "Stimme dem gemeinsamen Essen zu.",
      "うん、七時にうちでね。",
      "楽しみにしてるよ。",
      "昨日食べたね。",
      "Du sagst nicht für das heutige Essen zu.",
      "Das gemeinsame Essen bleibt der Zweck."
    ],
    [
      "妹も連れて行っていい？",
      "Erlaube locker den zusätzlichen Gast.",
      "もちろん、いいよ。",
      "うん、妹さんも来てね。",
      "絶対に来ないで。",
      "Du möchtest den Gast willkommen heißen.",
      "Die Personenzahl steigt."
    ],
    [
      "ありがとう。妹は肉を食べないんだ。",
      "Sage, dass du eine Portion ohne Fleisch machst.",
      "わかった。肉なしの料理を作るね。",
      "じゃ、妹さんには野菜の料理を作るよ。",
      "じゃ、肉をたくさん入れるよ。",
      "Das missachtet die Ernährung der Schwester.",
      "Die neue Information betrifft nur die passende Portion."
    ],
    [
      "助かる！七時に行くね。",
      "Bestätige sieben Uhr und freue dich.",
      "うん、七時に待ってるよ。",
      "わかった。気をつけて来てね。",
      "じゃ、六時に帰るね。",
      "Du würdest vor dem vereinbarten Essen weggehen.",
      "Die Uhrzeit bleibt wie geplant."
    ]
  ],
  "returnCue": [
    "Dein Freund bringt einen zusätzlichen Gast mit, der kein Fleisch isst. Sage locker, dass du Gemüsegerichte vorbereitest.",
    "野菜の料理を用意するね。",
    "肉なしの料理を作るよ。",
    "肉だけ作るね。",
    "Der zusätzliche Gast isst kein Fleisch."
  ]
}),
makeP45Challenge({
  "id": "museum-audio-guide",
  "title": "Audioführung ohne Gerät",
  "level": "A2",
  "units": [
    "p23:plans",
    "p25:directions"
  ],
  "parentCase": "tour-time",
  "relationship": "Museumsmitarbeiterin, höflich",
  "setting": "Du möchtest eine japanische Audioführung. Vor Ort ist das übliche Gerät ausverkauft bzw. nicht mehr verfügbar.",
  "purpose": "Eine praktikable Führung wählen, die du verstehen kannst.",
  "unexpected": "Japanische Audiogeräte sind alle ausgeliehen; japanische schriftliche Informationen sind vorhanden.",
  "outcome": "Du nutzt den japanischen schriftlichen Führer und besuchst die Ausstellung.",
  "turns": [
    [
      "どの言語のガイドが必要ですか。",
      "Bitte um eine japanische Audioführung.",
      "日本語の音声ガイドをお願いします。",
      "日本語の音声ガイドはありますか。",
      "英語の地図を買いました。",
      "Ein früherer Kartenkauf nennt keine Audioführung.",
      "Deine Zielsprache ist Japanisch."
    ],
    [
      "音声ガイドは一台五百円です。",
      "Bitte um ein Gerät.",
      "一台お願いします。",
      "一台借りたいです。",
      "五台お願いします。",
      "Du möchtest genau ein Gerät.",
      "Zu diesem Zeitpunkt scheint es noch möglich."
    ],
    [
      "申し訳ありません。日本語の機械は全部貸し出し中です。説明の冊子ならあります。",
      "Bitte stattdessen um die japanische Broschüre.",
      "では、日本語の冊子をお願いします。",
      "日本語の説明の本を一つください。",
      "では、音声ガイドを二台ください。",
      "Die japanischen Audiogeräte sind bereits ausgeliehen.",
      "Wechsle vom Audioformat auf schriftliche Informationen."
    ],
    [
      "こちらです。展示は二階にあります。",
      "Bedanke dich und bestätige den zweiten Stock.",
      "ありがとうございます。二階に行きます。",
      "二階ですね。わかりました。",
      "一階で音声ガイドを待ちます。",
      "Der Besuch kann mit Broschüre im zweiten Stock fortgesetzt werden.",
      "Die alternative Führung ermöglicht den Museumsbesuch."
    ]
  ],
  "returnCue": [
    "Eine andere Ausstellung hat keinen deutschen Audioguide, aber ein deutsches Informationsblatt. Bitte höflich darum.",
    "では、ドイツ語の説明の紙をお願いします。",
    "ドイツ語のパンフレットはありますか。",
    "音声ガイドを二台ください。",
    "Das gewünschte Audiogerät ist nicht verfügbar."
  ]
}),
makeP45Challenge({
  "id": "phone-message-callback",
  "title": "Rückruf erst am Nachmittag",
  "level": "A2",
  "units": [
    "p25:appointment",
    "p23:routine"
  ],
  "parentCase": "phone-reservation",
  "relationship": "fremde Sekretärin, höflich",
  "setting": "Du rufst wegen einer Kursauskunft an. Die zuständige Person ist nicht da.",
  "purpose": "Eine passende Nachricht hinterlassen, Rückrufzeit klären und Namen sagen.",
  "unexpected": "Ein Rückruf ist heute nur nach 15 Uhr möglich.",
  "outcome": "Du hinterlässt Name und Rückrufwunsch für den Nachmittag.",
  "turns": [
    [
      "もしもし。どなたにご用ですか。",
      "Sage, dass du mit der Kursleitung sprechen möchtest.",
      "先生とお話ししたいです。",
      "授業について先生に質問があります。",
      "昨日先生と話しました。",
      "Ein früheres Gespräch ersetzt den heutigen Anruf nicht.",
      "Die aktuelle Auskunft betrifft den Kurs."
    ],
    [
      "先生は今、席を外しています。",
      "Bitte höflich um einen Rückruf.",
      "あとでお電話をいただけますか。",
      "折り返し電話していただけますか。",
      "では、すぐ先生を出してください。",
      "Die Kursleitung ist gerade abwesend.",
      "Erbitte eine zeitlich realistische Lösung."
    ],
    [
      "今日は午後三時以降なら電話できます。",
      "Bestätige Rückruf nach 15 Uhr.",
      "では、午後三時以降にお願いします。",
      "三時よりあとで大丈夫です。",
      "午前九時に電話してください。",
      "Neun Uhr morgens ist bereits vorbei oder nicht angeboten.",
      "Die Rückrufzeit wird konkret."
    ],
    [
      "お名前を教えてください。",
      "Gib höflich den Namen Yamamoto an.",
      "山本です。よろしくお願いします。",
      "山本と申します。",
      "先生は山本です。",
      "Du sollst deinen Namen angeben, nicht den der Lehrkraft.",
      "Der Rückruf kann nun richtig zugeordnet werden."
    ]
  ],
  "returnCue": [
    "Eine andere Sekretärin sagt, Rückrufe seien erst nach 16 Uhr möglich. Bitte höflich um diese Zeit.",
    "午後四時以降にお願いします。",
    "四時を過ぎてからお電話いただけますか。",
    "午前十時に電話してください。",
    "Der Rückruf ist erst am Nachmittag möglich."
  ]
}),
makeP45Challenge({
  "id": "friend-delayed-train",
  "title": "Verspäteter Zug, neuer Treffpunkt",
  "level": "A2",
  "units": [
    "p25:transport",
    "p26:station-to-campus"
  ],
  "parentCase": "friend-late",
  "relationship": "enger Freund, locker",
  "setting": "Du triffst einen Freund am Bahnhof, aber sein Zug verspätet sich. Ihr entscheidet, euch näher am Ziel zu treffen.",
  "purpose": "Sich auf geänderte Zeit und neuen Ort einigen.",
  "unexpected": "Der Freund kommt erst um 19 Uhr und möchte direkt zum Kino fahren.",
  "outcome": "Ihr trefft euch um 19:15 Uhr am Kino statt um 18 Uhr am Bahnhof.",
  "turns": [
    [
      "六時に駅で待ってるね。",
      "Bestätige den ursprünglichen Treffplan.",
      "うん、六時に駅でね。",
      "わかった、駅に行くよ。",
      "昨日駅で会ったね。",
      "Vergangenheitsform ist keine Zusage.",
      "Die ursprünglichen Angaben sind Bahnhof und 18 Uhr."
    ],
    [
      "ごめん、電車が遅れて七時になる。",
      "Akzeptiere die Verspätung.",
      "大丈夫、七時でもいいよ。",
      "わかった。気をつけて来てね。",
      "じゃ、六時に帰るよ。",
      "Damit würdest du vor seiner Ankunft weggehen.",
      "Jetzt ist 19 Uhr die relevante Ankunft."
    ],
    [
      "駅じゃなくて、直接映画館で会わない？",
      "Nimm die Verlegung zum Kino an.",
      "うん、映画館で会おう。",
      "わかった。映画館に行くよ。",
      "じゃ、駅で待ってるね。",
      "Der Freund schlägt ausdrücklich den anderen Treffpunkt vor.",
      "Auch der Ort ändert sich."
    ],
    [
      "七時十五分に映画館の前でね。",
      "Bestätige Zeit und Ort gemeinsam.",
      "うん、七時十五分に映画館の前でね。",
      "わかった。七時十五分に行くよ。",
      "六時に駅の前でね。",
      "Das wären der alte Ort und die alte Zeit.",
      "Das endgültige Treffen findet um 19:15 Uhr am Kino statt."
    ]
  ],
  "returnCue": [
    "Ein anderer Freund verlegt das Treffen vom Bahnhof zum Museum auf 14:30 Uhr. Bestätige beides locker.",
    "二時半に美術館でね。",
    "わかった。二時半に美術館へ行くよ。",
    "二時に駅でね。",
    "Zeit und Treffpunkt wurden geändert."
  ]
})
];