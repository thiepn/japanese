import {authoredP46Reading,type P46RawReading} from "./reading46-types";
/** Six original A1 everyday practical texts. */
export const p46CorpusA = [
  {
    "id": "station-meeting",
    "genre": "message",
    "level": "A1",
    "units": [
      "p25:transport",
      "p23:plans"
    ],
    "title": "駅で会う時間",
    "purpose": "Treffzeit und Ort einer Nachricht entnehmen",
    "setting": "Eine Nachricht von Yui an Hiro",
    "paragraphs": [
      "ひろさんへ。あした、いっしょに本屋に行きませんか。午後二時に駅の北口で会いましょう。駅の南口ではありません。北口の前には小さい花屋があります。",
      "私は一時半に家を出ます。でも、雨が強かったら、駅の中のカフェで待っています。着いたら、メッセージをください。ゆい"
    ],
    "words": [
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
        "南口ではありません"
      ],
      [
        "花屋",
        "はなや",
        "Blumengeschäft",
        "小さい花屋"
      ],
      [
        "着く",
        "つく",
        "ankommen",
        "着いたら"
      ]
    ],
    "contextNote": "Eine japanische Verabredungsnachricht nennt oft einen konkreten Bahnhofsausgang, damit der Treffpunkt eindeutig ist.",
    "questions": [
      [
        "detail",
        "Wo soll Hiro sich normalerweise treffen?",
        "駅の北口です。",
        "北口で会います。",
        "駅の南口です。",
        "Die Nachricht verneint ausdrücklich den Südausgang.",
        "午後二時に駅の北口で会いましょう"
      ],
      [
        "inference",
        "Wo wartet Yui bei starkem Regen?",
        "駅の中のカフェです。",
        "駅のカフェで待ちます。",
        "北口の花屋です。",
        "Das Café ist der bedingte Ersatzort bei Regen.",
        "雨が強かったら、駅の中のカフェで待っています"
      ],
      [
        "purpose",
        "Was soll Hiro nach der Ankunft tun?",
        "メッセージを送ります。",
        "ゆいさんに連絡します。",
        "家を出ます。",
        "Das Weggehen aus dem Haus passiert vor der Ankunft.",
        "着いたら、メッセージをください"
      ]
    ],
    "writing": [
      "Schreibe an Yui: Du kommst um 14 Uhr zum Nordausgang.",
      "二時に北口に行きます。",
      "午後二時に駅の北口で会いましょう。",
      "二時に南口に行きます。",
      "Der Südausgang wäre der ausdrücklich falsche Treffpunkt."
    ],
    "returnCue": [
      "Eine andere Freundin trifft dich um 15 Uhr am Südausgang. Bestätige diesen neuen Ort und die Zeit.",
      "三時に南口で会いましょう。",
      "午後三時に駅の南口に行きます。",
      "二時に北口で会います。",
      "Ort und Zeit aus der alten Nachricht dürfen nicht übernommen werden."
    ]
  },
  {
    "id": "lunch-menu",
    "genre": "notice",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p25:shopping"
    ],
    "title": "今日のランチ",
    "purpose": "Kurze Menükarte lesen",
    "setting": "Angebot eines kleinen Cafés",
    "paragraphs": [
      "今日のランチはカレーとサラダです。カレーは七百円、サラダは三百円です。カレーには肉が入っています。サラダには肉が入っていません。",
      "飲み物はお茶と水があります。お茶は百円、水は無料です。ランチは十一時から二時までです。二時のあとにカレーは注文できません。"
    ],
    "words": [
      [
        "今日",
        "きょう",
        "heute",
        "今日のランチ"
      ],
      [
        "肉",
        "にく",
        "Fleisch",
        "肉が入っています"
      ],
      [
        "無料",
        "むりょう",
        "kostenlos",
        "水は無料"
      ],
      [
        "注文",
        "ちゅうもん",
        "Bestellung",
        "注文できません"
      ]
    ],
    "contextNote": "Die Zeitgrenze gilt hier ausdrücklich für das Mittagsangebot, nicht für den gesamten Betrieb.",
    "questions": [
      [
        "detail",
        "Wie viel kostet der Salat?",
        "三百円です。",
        "サラダは三百円です。",
        "七百円です。",
        "700 Yen ist der Preis des Currys.",
        "サラダは三百円です"
      ],
      [
        "inference",
        "Was kann jemand bestellen, der kein Fleisch möchte?",
        "サラダです。",
        "肉が入っていないサラダです。",
        "カレーです。",
        "Die Karte nennt Fleisch im Curry.",
        "サラダには肉が入っていません"
      ],
      [
        "purpose",
        "Warum kann man nach 14 Uhr kein Curry bestellen?",
        "ランチの時間が終わるからです。",
        "二時までだからです。",
        "水が無料だからです。",
        "Der Wasserpreis erklärt die Bestellfrist nicht.",
        "ランチは十一時から二時までです"
      ]
    ],
    "writing": [
      "Bestelle Salat und kostenloses Wasser.",
      "サラダと水をお願いします。",
      "サラダを一つと水をください。",
      "カレーとお茶をお願いします。",
      "Das wäre ein anderes Essen und ein kostenpflichtiges Getränk."
    ],
    "returnCue": [
      "Anderes Café: Der Salat kostet 400 Yen und Tee 100 Yen. Bestelle beides.",
      "サラダとお茶をお願いします。",
      "サラダを一つ、お茶を一つください。",
      "カレーと水をください。",
      "Die neue Bestellung umfasst Salat und Tee."
    ]
  },
  {
    "id": "rain-diary",
    "genre": "diary",
    "level": "A1",
    "units": [
      "p23:past",
      "p23:routine"
    ],
    "title": "雨の日の日記",
    "purpose": "Vergangenheit und Reihenfolge aus einem Tagebuch verstehen",
    "setting": "Ein Eintrag von Emi",
    "paragraphs": [
      "今日は朝から雨でした。私は八時に起きて、パンを食べました。九時に学校へ行きました。電車が少し遅れたので、授業に五分遅れました。",
      "昼は友だちのまことさんと教室でお弁当を食べました。午後は図書館で本を読みました。帰るとき、雨はもうやんでいました。傘を学校に忘れないでよかったです。"
    ],
    "words": [
      [
        "遅れる",
        "おくれる",
        "sich verspäten",
        "五分遅れました"
      ],
      [
        "教室",
        "きょうしつ",
        "Klassenzimmer",
        "教室でお弁当"
      ],
      [
        "帰る",
        "かえる",
        "zurückgehen",
        "帰るとき"
      ],
      [
        "傘",
        "かさ",
        "Regenschirm",
        "傘を学校に"
      ]
    ],
    "contextNote": "Der Text erzählt mit Vergangenheitsformen einen abgeschlossenen Tagesablauf.",
    "questions": [
      [
        "detail",
        "Um wie viele Minuten kam Emi zu spät?",
        "五分です。",
        "五分遅れました。",
        "九分です。",
        "九時 ist die Abfahrt zur Schule, nicht die Verspätungsdauer.",
        "授業に五分遅れました"
      ],
      [
        "inference",
        "Brauchte Emi bei der Heimkehr noch Schutz vor Regen?",
        "いいえ、雨はやんでいました。",
        "帰るとき、雨は降っていませんでした。",
        "はい、雨が強かったです。",
        "Zum Heimweg war der Regen schon vorbei.",
        "帰るとき、雨はもうやんでいました"
      ],
      [
        "purpose",
        "Warum ist Emi froh über ihren Schirm?",
        "傘を学校に忘れなかったからです。",
        "傘を持って帰ったからです。",
        "傘をなくしたからです。",
        "Der Text freut sich gerade darüber, ihn nicht vergessen zu haben.",
        "傘を学校に忘れないでよかったです"
      ]
    ],
    "writing": [
      "Fasse zusammen, wo Emi am Nachmittag gelesen hat.",
      "午後は図書館で本を読みました。",
      "図書館で読みました。",
      "午後は教室で読みました。",
      "Das Klassenzimmer war der Mittagsort."
    ],
    "returnCue": [
      "Neues Tagebuch: Du hast am Nachmittag zu Hause gelernt. Schreibe diesen einen Satz.",
      "午後は家で勉強しました。",
      "家で午後に勉強しました。",
      "午後は学校で勉強しました。",
      "Das neue Szenario spielt zu Hause."
    ]
  },
  {
    "id": "club-poster",
    "genre": "notice",
    "level": "A1",
    "units": [
      "p23:plans",
      "p23:introduction"
    ],
    "title": "日本語クラブのお知らせ",
    "purpose": "Ort und Bedingungen eines Posters lesen",
    "setting": "Aushang auf dem Campus",
    "paragraphs": [
      "日本語クラブに来ませんか。毎週水曜日、午後四時から五時まで、大学の三〇五号室で話します。日本語がまだ上手ではない人も大丈夫です。お金はかかりません。",
      "今週は『好きな食べ物』がテーマです。自分の好きな料理を一つ考えて来てください。飲み物は自分で持って来てください。質問があれば、先生の田中さんに聞いてください。"
    ],
    "words": [
      [
        "毎週",
        "まいしゅう",
        "jede Woche",
        "毎週水曜日"
      ],
      [
        "上手",
        "じょうず",
        "gut in etwas",
        "上手ではない人"
      ],
      [
        "テーマ",
        "てーま",
        "Thema",
        "食べ物がテーマ"
      ],
      [
        "持って来る",
        "もってくる",
        "mitbringen",
        "飲み物を持って来て"
      ]
    ],
    "contextNote": "Ein Clubangebot kann ausdrücklich Anfänger zulassen; die Aussage 上手ではない人も大丈夫 nimmt mögliche Hemmungen.",
    "questions": [
      [
        "detail",
        "Wann trifft sich der Club?",
        "水曜日の午後四時からです。",
        "毎週水曜日の四時です。",
        "木曜日の午後四時です。",
        "Auf dem Aushang steht Mittwoch.",
        "毎週水曜日、午後四時から五時まで"
      ],
      [
        "inference",
        "Kann jemand mit wenig Japanisch teilnehmen?",
        "はい、参加できます。",
        "はい、大丈夫です。",
        "いいえ、上手な人だけです。",
        "Der Aushang lässt ausdrücklich weniger Geübte zu.",
        "日本語がまだ上手ではない人も大丈夫です"
      ],
      [
        "purpose",
        "Was sollen Besucher diese Woche vorbereiten?",
        "好きな料理を一つ考えます。",
        "好きな食べ物を考えて来ます。",
        "三百円を持って来ます。",
        "Der Club kostet nichts; vorbereitet werden soll ein Gericht.",
        "好きな料理を一つ考えて来てください"
      ]
    ],
    "writing": [
      "Antworte Tanaka: Ich möchte am Mittwoch zum Club kommen.",
      "水曜日に日本語クラブに行きたいです。",
      "水曜日のクラブに参加したいです。",
      "木曜日に行きます。",
      "Die Veranstaltung findet mittwochs statt."
    ],
    "returnCue": [
      "Anderer Club: Treffen am Freitag um 17 Uhr in Raum 202. Schreibe die Terminbestätigung.",
      "金曜日の五時に二〇二号室に行きます。",
      "金曜日の午後五時、二〇二号室ですね。",
      "水曜日の四時に三〇五号室です。",
      "Du musst den neuen Termin statt den alten verwenden."
    ]
  },
  {
    "id": "family-message",
    "genre": "message",
    "level": "A1",
    "units": [
      "p23:routine",
      "p23:plans"
    ],
    "title": "買い物のメモ",
    "purpose": "Einkaufsliste und Gründe verstehen",
    "setting": "Kurze Nachricht einer Mutter",
    "paragraphs": [
      "けんへ。今日は仕事で帰るのが遅くなります。冷蔵庫に卵が二つありますが、牛乳はありません。スーパーで牛乳を一本とバナナを三本買ってください。",
      "お金は机の上にあります。夕ご飯は七時半ごろに食べましょう。買い物が終わったら、メッセージをください。母より"
    ],
    "words": [
      [
        "冷蔵庫",
        "れいぞうこ",
        "Kühlschrank",
        "冷蔵庫に卵"
      ],
      [
        "卵",
        "たまご",
        "Ei",
        "卵が二つ"
      ],
      [
        "牛乳",
        "ぎゅうにゅう",
        "Milch",
        "牛乳はありません"
      ],
      [
        "一本",
        "いっぽん",
        "ein langes Stück",
        "牛乳を一本"
      ]
    ],
    "contextNote": "Zählwörter im Kontext: 本 bei Flaschen und Bananen, つ bei Eiern.",
    "questions": [
      [
        "detail",
        "Welche beiden Produkte soll Ken kaufen?",
        "牛乳とバナナです。",
        "牛乳を一本とバナナを三本です。",
        "卵と牛乳です。",
        "Eier sind bereits vorhanden.",
        "牛乳を一本とバナナを三本買ってください"
      ],
      [
        "inference",
        "Warum muss Ken keine Eier kaufen?",
        "卵は冷蔵庫にあります。",
        "卵が二つあるからです。",
        "卵はスーパーにありません。",
        "Der Text macht keine Aussage über die Vorräte des Supermarktes.",
        "冷蔵庫に卵が二つあります"
      ],
      [
        "purpose",
        "Wann soll Ken eine Nachricht schreiben?",
        "買い物が終わったらです。",
        "買い物のあとです。",
        "夕ご飯のあとです。",
        "Die Mutter verlangt die Nachricht nach dem Einkauf.",
        "買い物が終わったら、メッセージをください"
      ]
    ],
    "writing": [
      "Schreibe: Ich kaufe Milch und drei Bananen.",
      "牛乳とバナナを三本買います。",
      "牛乳一本とバナナ三本を買います。",
      "卵を二つ買います。",
      "Eier stehen nicht auf der Einkaufsliste."
    ],
    "returnCue": [
      "Neue Liste: Brot und zwei Äpfel fehlen. Schreibe, dass du sie kaufen wirst.",
      "パンとりんごを二つ買います。",
      "パンとりんご二つを買って来ます。",
      "牛乳とバナナを買います。",
      "Die neue Liste nennt Brot und Äpfel."
    ]
  },
  {
    "id": "park-map",
    "genre": "guide",
    "level": "A1",
    "units": [
      "p25:directions",
      "p25:transport"
    ],
    "title": "公園までの道",
    "purpose": "Kurze Wegbeschreibung mit zwei möglichen Wegen lesen",
    "setting": "Hinweise für Besucher eines Stadtparks",
    "paragraphs": [
      "駅から緑公園まで歩いて十分です。駅の東口を出て、まっすぐ五分歩いてください。銀行が見えたら、右に曲がります。小さい橋を渡ると、公園の入り口があります。",
      "雨の日は橋がすべりやすいので、駅から二番のバスも使えます。バスは公園の南口に止まります。公園の大きい池は北側にあります。"
    ],
    "words": [
      [
        "東口",
        "ひがしぐち",
        "Ostausgang",
        "駅の東口"
      ],
      [
        "橋",
        "はし",
        "Brücke",
        "小さい橋"
      ],
      [
        "渡る",
        "わたる",
        "überqueren",
        "橋を渡る"
      ],
      [
        "池",
        "いけ",
        "Teich",
        "大きい池"
      ]
    ],
    "contextNote": "Diese Beschreibung nennt zwei verschiedene Eingänge; Ostausgang des Bahnhofs und Südeingang des Parks sind nicht dasselbe.",
    "questions": [
      [
        "detail",
        "Wo biegt man zu Fuß rechts ab?",
        "銀行のところです。",
        "銀行が見えたら右に曲がります。",
        "橋の前で左に曲がります。",
        "Die Anweisung nennt die Bank als Orientierung.",
        "銀行が見えたら、右に曲がります"
      ],
      [
        "inference",
        "Welche Fahrtmöglichkeit ist an Regentagen angeboten?",
        "二番のバスです。",
        "二番のバスに乗れます。",
        "一番の電車です。",
        "Bei Regen wird ausdrücklich Bus Nummer zwei genannt.",
        "雨の日は…二番のバスも使えます"
      ],
      [
        "purpose",
        "Wo liegt der große Teich im Park?",
        "北側です。",
        "公園の北側にあります。",
        "南口です。",
        "Der Bus hält südlich; der Teich liegt nördlich.",
        "大きい池は北側にあります"
      ]
    ],
    "writing": [
      "Schreibe eine einfache Richtungsanweisung: Geh an der Bank rechts.",
      "銀行のところで右に曲がってください。",
      "銀行が見えたら右へ行ってください。",
      "銀行で左に曲がってください。",
      "Die Richtung nach der Bank ist rechts."
    ],
    "returnCue": [
      "Neuer Park: An der Post links abbiegen. Formuliere die Anweisung.",
      "郵便局のところで左に曲がってください。",
      "郵便局が見えたら左へ行ってください。",
      "銀行で右に曲がってください。",
      "Neuer Orientierungspunkt und neue Richtung müssen stimmen."
    ]
  }
] satisfies P46RawReading[];
export const p46ReadingsA=p46CorpusA.map(authoredP46Reading);
