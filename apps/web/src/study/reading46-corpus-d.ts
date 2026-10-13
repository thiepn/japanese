import {authoredP46Reading,type P46RawReading} from "./reading46-types";
/** Six original A2 reports, interviews, fiction and practical letters. */
export const p46CorpusD = [
  {
    "id": "neighborhood-cafe",
    "genre": "article",
    "level": "A2",
    "units": [
      "p23:cafe",
      "p23:plans"
    ],
    "title": "朝だけ開くカフェ",
    "purpose": "Ursachen und Perspektive in einem Cafébericht lesen",
    "setting": "Lokaler Artikel über ein ungewöhnliches Café",
    "paragraphs": [
      "駅の近くに「朝の木」という小さなカフェがあります。この店は朝六時半に開き、昼の十二時には閉まります。店長の森さんは「朝、仕事に行く前に少しゆっくりできる場所を作りたかった」と話します。早い時間には駅で働く人や学生がよく来ます。",
      "お店では毎日三種類のパンを焼きます。午前九時ごろに一番人気のパンが売り切れることもあります。しかし、前の日の夕方までに電話をすると、次の日のパンを二つまで予約できます。森さんは午後に店を閉めてから、翌日の準備をしています。"
    ],
    "words": [
      [
        "店長",
        "てんちょう",
        "Filialleiter",
        "店長の森さん"
      ],
      [
        "人気",
        "にんき",
        "beliebt",
        "一番人気のパン"
      ],
      [
        "予約",
        "よやく",
        "Reservierung",
        "予約できます"
      ],
      [
        "翌日",
        "よくじつ",
        "Folgetag",
        "翌日の準備"
      ]
    ],
    "contextNote": "Das Café richtet seine Öffnungszeiten gezielt auf Menschen vor dem Arbeits- oder Studientag aus; frühes Schließen ist Teil des Konzepts.",
    "questions": [
      [
        "detail",
        "Wann schließt das Café?",
        "昼の十二時です。",
        "正午に閉まります。",
        "午後六時です。",
        "Das Geschäft ist nur vormittags geöffnet.",
        "昼の十二時には閉まります"
      ],
      [
        "inference",
        "Warum ist eine Reservierung bei diesem Café sinnvoll?",
        "人気のパンが早く売り切れるからです。",
        "九時ごろには売り切れることがあるからです。",
        "午後にパンを売るからです。",
        "Nachmittags verkauft das Café nicht mehr.",
        "一番人気のパンが売り切れることもあります"
      ],
      [
        "purpose",
        "Was wollte der Inhaber mit dem Café erreichen?",
        "朝、ゆっくりできる場所を作ることです。",
        "仕事前に休める場所を作ることです。",
        "夜遅くまで遊ぶ場所です。",
        "Seine Motivation betrifft die Morgenstunden.",
        "朝、仕事に行く前に少しゆっくりできる場所"
      ]
    ],
    "writing": [
      "Schreibe eine begründete Empfehlung: Reserviere Brot, weil es früh ausverkauft sein kann.",
      "パンが早く売り切れるので、予約したほうがいいです。",
      "人気のパンは売り切れることがあるから、予約します。",
      "午後六時に買いに行きます。",
      "Das Café schließt bereits mittags."
    ],
    "returnCue": [
      "Anderes Café: Gebäck kann um 8 Uhr ausverkauft sein; Reservierung bis Vortag möglich. Empfiehl Reservieren.",
      "早く売り切れるので、前の日に予約したほうがいいです。",
      "八時にはなくなるかもしれないので、予約します。",
      "夜に店へ行けばいいです。",
      "Der Verkauf endet schon früh."
    ]
  },
  {
    "id": "student-interview",
    "genre": "interview",
    "level": "A2",
    "units": [
      "p23:routine",
      "p26:library-project"
    ],
    "title": "留学生の一日",
    "purpose": "Interviewantworten und Kontrast zwischen Anfang und Heute erkennen",
    "setting": "Interview mit einem Austauschstudenten",
    "paragraphs": [
      "記者「日本に来て一番困ったことは何ですか。」ミナ「最初はスーパーで商品の名前が読めませんでした。食べたいものを買うだけでも時間がかかりました。」記者「今はどうですか。」ミナ「毎日少しずつ漢字を勉強して、今はよく買う食べ物の名前がわかるようになりました。」",
      "記者「大学では何をしていますか。」ミナ「午前は授業で、午後は図書館で友だちと勉強します。先月から週に一度、地域の料理教室にも行っています。そこで習った料理を週末に家で作るのが楽しみです。」"
    ],
    "words": [
      [
        "最初",
        "さいしょ",
        "anfangs",
        "最初はスーパーで"
      ],
      [
        "商品",
        "しょうひん",
        "Produkt",
        "商品の名前"
      ],
      [
        "少しずつ",
        "すこしずつ",
        "allmählich",
        "毎日少しずつ"
      ],
      [
        "地域",
        "ちいき",
        "Stadtteil/Region",
        "地域の料理教室"
      ]
    ],
    "contextNote": "Durch 〜ようになりました wird eine Veränderung einer Fähigkeit oder Gewohnheit beschrieben; die Antwort vergleicht ausdrücklich früher und heute.",
    "questions": [
      [
        "detail",
        "Was fiel Mina am Anfang im Supermarkt schwer?",
        "商品の名前が読めなかったことです。",
        "商品の名前を読むことです。",
        "料理の作り方です。",
        "Die erste Schwierigkeit lag beim Lesen von Produktnamen.",
        "商品の名前が読めませんでした"
      ],
      [
        "inference",
        "Wodurch verbesserte sie den Einkauf?",
        "毎日漢字を勉強したからです。",
        "少しずつ漢字を勉強したからです。",
        "いつも友だちが買ったからです。",
        "Die Verbesserung wird mit eigenem regelmäßigen Lernen erklärt.",
        "毎日少しずつ漢字を勉強して"
      ],
      [
        "purpose",
        "Was macht sie besonders gern am Wochenende?",
        "習った料理を家で作ります。",
        "料理教室の料理を作ります。",
        "大学の授業を受けます。",
        "Die Wochenendfreude betrifft das Nachkochen.",
        "週末に家で作るのが楽しみ"
      ]
    ],
    "writing": [
      "Fasse ihre Veränderung zusammen.",
      "最初は読めませんでしたが、今は食べ物の名前がわかります。",
      "漢字を勉強して、買い物が楽になりました。",
      "今も何も読めません。",
      "Sie beschreibt ausdrücklich einen Lernfortschritt."
    ],
    "returnCue": [
      "Anderer Student: Am Anfang konnte er keine Zugfahrpläne lesen, jetzt schon. Beschreibe die Veränderung.",
      "最初は時刻表が読めませんでしたが、今は読めます。",
      "今は電車の時刻がわかるようになりました。",
      "今も時刻表が読めません。",
      "Die neue Geschichte beschreibt eine verbesserte Fähigkeit."
    ]
  },
  {
    "id": "rent-room-ad",
    "genre": "notice",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p25:shopping"
    ],
    "title": "学生向けの部屋",
    "purpose": "Wohnungsanzeige mit Einschränkungen verstehen",
    "setting": "Fiktive Anzeige für ein kleines Studentenzimmer",
    "paragraphs": [
      "学生向けの部屋を一つ貸します。駅から歩いて十二分、大学までは自転車で八分です。部屋は二階にあり、家賃は一か月五万円です。水道代は家賃に含まれていますが、電気代とインターネット代は別に払います。",
      "入居できるのは来月の一日からです。部屋で動物を飼うことはできません。見学したい人は、平日の午後二時から六時の間に電話をしてください。土曜日と日曜日は見学できません。"
    ],
    "words": [
      [
        "家賃",
        "やちん",
        "Miete",
        "家賃は一か月"
      ],
      [
        "含む",
        "ふくむ",
        "einschließen",
        "家賃に含まれています"
      ],
      [
        "入居",
        "にゅうきょ",
        "Einzug",
        "入居できるのは"
      ],
      [
        "見学",
        "けんがく",
        "Besichtigung",
        "見学したい人"
      ]
    ],
    "contextNote": "Alle Preis- und Mietangaben sind erfundene Beispielangaben, keine aktuelle reale Wohnungsanzeige.",
    "questions": [
      [
        "detail",
        "Welche Nebenkosten sind im Mietpreis enthalten?",
        "水道代です。",
        "水道代だけです。",
        "インターネット代です。",
        "Internet wird ausdrücklich separat bezahlt.",
        "水道代は家賃に含まれていますが"
      ],
      [
        "inference",
        "Kann jemand mit einem Hund in das Zimmer ziehen?",
        "いいえ、できません。",
        "動物を飼えないからです。",
        "はい、できます。",
        "Tierhaltung ist ausdrücklich verboten.",
        "動物を飼うことはできません"
      ],
      [
        "purpose",
        "Wann soll man wegen einer Besichtigung anrufen?",
        "平日の午後二時から六時までです。",
        "月曜日から金曜日の午後です。",
        "日曜日の朝です。",
        "Wochenenden sind für Besichtigungen ausgeschlossen.",
        "平日の午後二時から六時の間"
      ]
    ],
    "writing": [
      "Schreibe eine höfliche Frage nach einem Besichtigungstermin am Dienstag.",
      "火曜日に部屋を見学できますか。",
      "火曜日の午後に見学したいです。",
      "日曜日に見学できますか。",
      "Die Anzeige schließt Sonntage aus."
    ],
    "returnCue": [
      "Andere Anzeige: Besichtigung nur mittwochs ab 15 Uhr. Bitte höflich um einen Termin.",
      "水曜日の午後三時に見学できますか。",
      "水曜日の三時に見学したいです。",
      "火曜日の午前に見学します。",
      "Die neue Beschränkung ist Mittwoch nach 15 Uhr."
    ]
  },
  {
    "id": "teacher-feedback",
    "genre": "email",
    "level": "A2",
    "units": [
      "p26:library-project",
      "p23:past"
    ],
    "title": "作文を直す前に",
    "purpose": "Instruktionen und Prioritäten aus Lehrkraftfeedback lesen",
    "setting": "E-Mail an einen Sprachlernenden",
    "paragraphs": [
      "中村さん。先週の作文を読みました。旅行の経験がよくわかる文章でした。特に、友だちと道に迷った場面はおもしろかったです。ただ、旅行した日と今の予定が同じ段落に入っていて、少しわかりにくくなっています。",
      "次の作文では、最初に旅行した日のことを書き、そのあとで今後の予定を書いてみてください。漢字の間違いを全部直すことも大切ですが、今回はまず文章の順番を考えてみましょう。新しい作文は来週の月曜日までにメールで送ってください。"
    ],
    "words": [
      [
        "段落",
        "だんらく",
        "Absatz",
        "同じ段落"
      ],
      [
        "順番",
        "じゅんばん",
        "Reihenfolge",
        "文章の順番"
      ],
      [
        "今後",
        "こんご",
        "künftig",
        "今後の予定"
      ],
      [
        "作文",
        "さくぶん",
        "Aufsatz",
        "新しい作文"
      ]
    ],
    "contextNote": "Lehrkraftfeedback kann einen Schwerpunkt priorisieren; der Satz 漢字の間違いを全部直すことも大切 erkennt weitere Arbeit an, setzt aber hier die Struktur zuerst.",
    "questions": [
      [
        "detail",
        "Welcher Teil gefiel der Lehrkraft besonders?",
        "道に迷った場面です。",
        "友だちと道に迷ったところです。",
        "駅で買い物した場面です。",
        "Gelobt wird die Episode des Verirrens.",
        "道に迷った場面はおもしろかった"
      ],
      [
        "inference",
        "Was soll Nakamura diesmal zuerst verbessern?",
        "文章の順番です。",
        "段落の順番を直します。",
        "漢字だけです。",
        "Die Lehrkraft nennt die Reihenfolge ausdrücklich als Priorität.",
        "今回はまず文章の順番を考えてみましょう"
      ],
      [
        "purpose",
        "Bis wann muss die neue Fassung geschickt werden?",
        "来週の月曜日までです。",
        "来週の月曜日に送ります。",
        "今週の金曜日です。",
        "Die Frist ist nächster Montag.",
        "来週の月曜日までにメールで送ってください"
      ]
    ],
    "writing": [
      "Schreibe, wie du die zwei Themen ordnest.",
      "最初に旅行の経験を書き、そのあと予定を書きます。",
      "旅行した日のことを先に書きます。",
      "今後の予定と昔の経験を全部混ぜます。",
      "Die beiden Zeitebenen sollen getrennt werden."
    ],
    "returnCue": [
      "Neue Schreibaufgabe: Zuerst Ereignis, danach deine Meinung. Beschreibe die Reihenfolge.",
      "まず出来事を書いて、そのあとで意見を書きます。",
      "最初に何があったか書き、次に考えを書きます。",
      "意見と出来事を全部混ぜます。",
      "Die neue Vorgabe verlangt eine erkennbare Reihenfolge."
    ]
  },
  {
    "id": "package-delivery-update",
    "genre": "message",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p25:appointment"
    ],
    "title": "荷物が届くまで",
    "purpose": "Mehrstufige Paketnachricht verstehen",
    "setting": "Fiktive Versandbenachrichtigungen",
    "paragraphs": [
      "荷物についてのお知らせです。ご注文の商品は昨日の夕方に発送されました。最初の予定では木曜日に配達することになっていましたが、道路が工事中のため、金曜日の午前中になる見込みです。新しい配達時間を確認してください。",
      "金曜日の午前中に家にいない場合は、木曜日の夜八時までに配達時間の変更を申し込めます。近くの店で受け取ることもできます。その場合、金曜日の午後三時以降に受け取ってください。"
    ],
    "words": [
      [
        "発送",
        "はっそう",
        "Versand",
        "発送されました"
      ],
      [
        "配達",
        "はいたつ",
        "Zustellung",
        "配達時間"
      ],
      [
        "見込み",
        "みこみ",
        "voraussichtlich",
        "なる見込み"
      ],
      [
        "受け取る",
        "うけとる",
        "empfangen/abholen",
        "店で受け取る"
      ]
    ],
    "contextNote": "Die neuen Lieferbedingungen unterscheiden Zustellung zu Hause, zeitliche Änderung und Abholung im Geschäft.",
    "questions": [
      [
        "detail",
        "Warum verzögert sich die Zustellung?",
        "道路が工事中だからです。",
        "道路の工事のためです。",
        "商品がまだ売れていないからです。",
        "Der Artikel wurde schon verschickt.",
        "道路が工事中のため"
      ],
      [
        "inference",
        "Was kann jemand tun, der Freitagvormittag nicht daheim ist?",
        "配達時間を変えるか、店で受け取ります。",
        "店で受け取れます。",
        "必ず木曜日に受け取ります。",
        "Die Lieferung wurde von Donnerstag auf Freitag verschoben.",
        "家にいない場合は…変更…店で受け取ることも"
      ],
      [
        "purpose",
        "Ab wann ist das Paket im Geschäft abholbar?",
        "金曜日の午後三時以降です。",
        "金曜日の三時からです。",
        "木曜日の夜八時からです。",
        "Donnerstag 20 Uhr ist nur die Änderungsfrist.",
        "金曜日の午後三時以降"
      ]
    ],
    "writing": [
      "Schreibe: Ich möchte das Paket am Freitag nach 15 Uhr im Geschäft abholen.",
      "金曜日の午後三時以降に店で受け取りたいです。",
      "金曜日の三時すぎに店で受け取ります。",
      "木曜日の朝に家で受け取ります。",
      "Der neue Abholtermin ist Freitag nachmittags."
    ],
    "returnCue": [
      "Neue Lieferung: Abholung Samstag nach 16 Uhr. Schreibe eine höfliche Bestätigung.",
      "土曜日の午後四時以降に受け取ります。",
      "土曜日の四時すぎに店へ行きます。",
      "金曜日の午後三時に受け取ります。",
      "Der neue Termin ist Samstag nach 16 Uhr."
    ]
  },
  {
    "id": "old-bridge-story",
    "genre": "story",
    "level": "A2",
    "units": [
      "p23:past",
      "p25:directions"
    ],
    "title": "古い橋の約束",
    "purpose": "Motivation und Schlussfolgerung in einer Kurzgeschichte lesen",
    "setting": "Originale A2-Kurzgeschichte",
    "paragraphs": [
      "海の近くの町に、古い木の橋がありました。小学六年生のりくは、その橋から毎朝船を見るのが好きでした。ある日、橋の入り口に「危険なので渡らないでください」という紙が貼られました。りくはがっかりしましたが、約束を守って橋を渡りませんでした。",
      "次の週、町の人たちが橋を直すための作業を始めました。りくは手伝いたかったのですが、子どもは工事現場に入れません。そこで、橋について祖父から聞いた話を書いて、町の新聞に送りました。その記事を読んで、橋の大切さを思い出した人が増えました。新しい橋ができた日、りくは家族といっしょに船を見に行きました。"
    ],
    "words": [
      [
        "危険",
        "きけん",
        "gefährlich",
        "危険なので"
      ],
      [
        "直す",
        "なおす",
        "reparieren",
        "橋を直す"
      ],
      [
        "祖父",
        "そふ",
        "Großvater",
        "祖父から聞いた"
      ],
      [
        "記事",
        "きじ",
        "Artikel",
        "その記事"
      ]
    ],
    "contextNote": "Das Ende setzt eine indirekte Hilfeform in Beziehung zur früheren Absicht: Riku durfte nicht auf der Baustelle helfen, trug aber durch einen Artikel bei.",
    "questions": [
      [
        "detail",
        "Warum durfte Riku die Brücke nicht überqueren?",
        "危険だったからです。",
        "橋が危険だったからです。",
        "船がなかったからです。",
        "Das Schild nennt Gefahr, nicht fehlende Schiffe.",
        "危険なので渡らないでください"
      ],
      [
        "inference",
        "Wie half Riku, obwohl er nicht auf die Baustelle durfte?",
        "橋についての記事を書きました。",
        "祖父の話を新聞に送りました。",
        "工事の仕事をしました。",
        "Kinder durften die Baustelle nicht betreten.",
        "祖父から聞いた話を書いて、町の新聞に送りました"
      ],
      [
        "purpose",
        "Warum ist der Zeitungsartikel für die Geschichte wichtig?",
        "橋の大切さを思い出す人が増えたからです。",
        "町の人が橋を大切だと思ったからです。",
        "新しい船を買うためです。",
        "Der Artikel erinnerte Menschen an die Bedeutung der Brücke.",
        "橋の大切さを思い出した人が増えました"
      ]
    ],
    "writing": [
      "Schreibe einen Satz, wie Riku sich auf andere Weise beteiligte.",
      "りくは橋の記事を書いて手伝いました。",
      "りくは橋の話を新聞に送りました。",
      "りくは危険な橋を渡りました。",
      "Er befolgte ausdrücklich das Verbot."
    ],
    "returnCue": [
      "Andere Geschichte: Ein Mädchen darf nicht selbst bauen, hilft aber mit einem Poster. Fasse ihre Hilfe zusammen.",
      "女の子はポスターを作って手伝いました。",
      "工事はできませんでしたが、ポスターを作りました。",
      "女の子は工事現場で働きました。",
      "Sie darf selbst nicht bauen."
    ]
  }
] satisfies P46RawReading[];
export const p46ReadingsD=p46CorpusD.map(authoredP46Reading);
