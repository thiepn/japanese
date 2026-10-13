import {authoredP49Document,type P49RawDocument} from "./documents49-types";
/** Final eight substantial original A2 genre documents, explicitly fictional practical rules. */
export const p49CorpusE=[
  {
    "id": "allergy-lunch-card",
    "genre": "menu",
    "level": "A2",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "ランチのセットと変更ルール",
    "purpose": "Produktkombination, enthaltene Speisen und Änderbarkeit lesen",
    "audience": "Mittagsgäste",
    "issuer": "森の食堂",
    "blocks": [
      "ランチセット　千百円　魚・ご飯・みそ汁・お茶",
      "ご飯を大盛りにすると百五十円追加です。みそ汁には大豆を使っています。",
      "魚を野菜料理に変えることはできますが、材料の取り除きはできません。心配な方は注文前に係員に聞いてください。"
    ],
    "terms": [
      [
        "大盛り",
        "おおもり",
        "große Portion",
        "ご飯を大盛り"
      ],
      [
        "取り除く",
        "とりのぞく",
        "entfernen",
        "材料の取り除き"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Getränke sind im Menü enthalten?",
        "お茶です。",
        "セットにはお茶が付いています。",
        "コーヒーです。",
        "Das Set nennt Tee.",
        "魚・ご飯・みそ汁・お茶"
      ],
      [
        "condition",
        "Was kostet das Set mit größerer Reisportion?",
        "千二百五十円です。",
        "千百円に百五十円を足します。",
        "千百円です。",
        "150 Yen sind zusätzlich zu 1100.",
        "百五十円追加"
      ],
      [
        "inference",
        "Kann jemand aus der Wechselmöglichkeit schließen, jede Zutat entfernen zu können?",
        "いいえ、できません。",
        "材料は取り除けません。",
        "はい、全部変えられます。",
        "Gerichtetausch ist möglich, einzelne Zutatenentfernung nicht.",
        "材料の取り除きはできません"
      ]
    ],
    "contextNote": "Fiktive Speisekarte: keine Zusicherung über Allergensicherheit; bei Unverträglichkeiten direkte Rückfrage nötig.",
    "writing": [
      "Bitte höflich um Details zu den Zutaten im Gemüsegericht.",
      "野菜料理には何が入っていますか。",
      "野菜料理の材料を教えてください。",
      "材料は全部取り除けますね。",
      "Einzelne Zutaten lassen sich nicht entfernen."
    ],
    "returnCue": [
      "Neues Café: Set 900 Yen, Saftwechsel 200 Yen, bitte um Erklärung des Gesamtpreises.",
      "ジュースに変えると千百円ですね。",
      "九百円に二百円を足して千百円です。",
      "九百円のままです。",
      "Der Aufpreis beträgt 200 Yen."
    ]
  },
  {
    "id": "return-policy-poster",
    "genre": "notice",
    "level": "A2",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "title": "商品の交換について",
    "purpose": "Umtauschfrist, Kaufbeleg und Ausschlussfall unterscheiden",
    "audience": "Ladenkunden",
    "issuer": "駅前ストア",
    "blocks": [
      "商品交換のお知らせ：買ってから七日以内で、使っていない商品だけ交換できます。",
      "交換にはレシートが必要です。値段が違う商品との交換では、差額を払ってください。",
      "食品と開けた化粧品は交換できません。お金を返すサービスは行っていません。"
    ],
    "terms": [
      [
        "差額",
        "さがく",
        "Differenzbetrag",
        "差額を払って"
      ],
      [
        "以内",
        "いない",
        "innerhalb",
        "七日以内"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Frist gilt für einen Umtausch?",
        "七日以内です。",
        "買ってから七日以内です。",
        "三十日以内です。",
        "Der Aushang nennt sieben Tage.",
        "買ってから七日以内"
      ],
      [
        "condition",
        "Braucht man einen Kassenbeleg?",
        "はい、必要です。",
        "レシートが必要です。",
        "いいえ、要りません。",
        "Ohne Kassenbeleg keine Umtauschbedingung erfüllt.",
        "交換にはレシートが必要"
      ],
      [
        "inference",
        "Kann ein geöffnetes Kosmetikprodukt bei Kassenbon umgetauscht werden?",
        "いいえ、できません。",
        "開けた化粧品は交換できません。",
        "はい、レシートがあれば大丈夫です。",
        "Der Ausschluss gilt unabhängig vom Bon.",
        "開けた化粧品は交換できません"
      ]
    ],
    "contextNote": "Fiktive freiwillige Ladenpolitik, keine Darstellung rechtlicher Gewährleistungsansprüche.",
    "writing": [
      "Bitte höflich um Umtausch eines unbenutzten Produkts mit Bon.",
      "レシートがあります。この商品を交換できますか。",
      "未使用なので、交換をお願いします。",
      "お金を返してください。",
      "Der Aushang bietet keine Rückerstattung an."
    ],
    "returnCue": [
      "Anderer Laden: Umtausch nur binnen fünf Tagen, Kassenbon, Schuhe ungetragen. Bitte entsprechend.",
      "五日以内で、まだ履いていない靴を交換できますか。",
      "レシートがあります。靴の交換をお願いします。",
      "十日後に履いた靴を交換します。",
      "Neue Frist fünf Tage, ungetragen."
    ]
  },
  {
    "id": "passport-help-info",
    "genre": "public-info",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "書類相談窓口の案内",
    "purpose": "Öffnungszeiten und Art der Unterlagen ohne Rechtsberatung erkennen",
    "audience": "Besucher einer fiktiven Servicestelle",
    "issuer": "町の相談センター",
    "blocks": [
      "書類相談窓口：平日の午前九時〜午後三時。木曜日は午後一時までです。",
      "予約は必要ありませんが、相談内容を書いたメモと身分証を持って来てください。",
      "この窓口では書類の書き方を説明します。申請が許可されるかどうかは決めません。"
    ],
    "terms": [
      [
        "相談",
        "そうだん",
        "Beratung",
        "相談内容"
      ],
      [
        "許可",
        "きょか",
        "Genehmigung",
        "許可されるか"
      ]
    ],
    "questions": [
      [
        "locate",
        "Bis wann hat die Stelle donnerstags geöffnet?",
        "午後一時までです。",
        "木曜日は一時までです。",
        "午後三時までです。",
        "Donnerstag ist eine Ausnahme.",
        "木曜日は午後一時まで"
      ],
      [
        "condition",
        "Welche Unterlagen sollen Besucher mitbringen?",
        "メモと身分証です。",
        "相談のメモと身分証です。",
        "予約メールだけです。",
        "Der Text fordert Notiz und Ausweis.",
        "メモと身分証を持って"
      ],
      [
        "inference",
        "Kann die Beratungsstelle die Genehmigung eines Antrags garantieren?",
        "いいえ、決めません。",
        "許可はこの窓口では決められません。",
        "はい、必ず許可されます。",
        "Sie erläutert das Ausfüllen, entscheidet aber nicht.",
        "許可されるかどうかは決めません"
      ]
    ],
    "contextNote": "Fiktiver Organisationshinweis. Kein realer Behördenablauf oder Rechtsrat.",
    "writing": [
      "Frage höflich nach Hilfe beim Ausfüllen eines Formulars.",
      "書類の書き方を教えていただけますか。",
      "この書類について相談したいです。",
      "ここで必ず許可してください。",
      "Diese Stelle entscheidet nicht über Genehmigungen."
    ],
    "returnCue": [
      "Neues Büro: Hilfe beim Formular Montag 10–14 Uhr, keine Entscheidung über Bewilligung. Bitte um Erklärung.",
      "月曜日に書類の書き方を教えてください。",
      "月曜日の十一時に相談したいです。",
      "ここで申請の結果を決めてください。",
      "Die Stelle kann nur beraten."
    ]
  },
  {
    "id": "library-card-use",
    "genre": "instructions",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "図書館カードの使い方",
    "purpose": "Leihmenge, Sondermedien und Verlängerungsbedingung lesen",
    "audience": "Neue Bibliotheksnutzer",
    "issuer": "図書館カウンター",
    "blocks": [
      "図書館カードを見せると、本を五冊まで二週間借りられます。",
      "雑誌は一週間だけです。DVDはカード一枚につき二枚まで借りられます。",
      "予約がない本だけ、返す日の前に一回延長できます。返す日を過ぎた本は延長できません。"
    ],
    "terms": [
      [
        "延長",
        "えんちょう",
        "Verlängerung",
        "延長できます"
      ],
      [
        "雑誌",
        "ざっし",
        "Zeitschrift",
        "雑誌は一週間"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wie viele normale Bücher darf man ausleihen?",
        "五冊までです。",
        "本は五冊までです。",
        "二冊までです。",
        "Zwei gilt nur für DVDs.",
        "本を五冊まで"
      ],
      [
        "condition",
        "Welche Bücher sind verlängerbar?",
        "予約がない本です。",
        "期限の前で、予約がない本です。",
        "全部いつでもです。",
        "Es gibt Bedingungen: keine Reservierung und vor Fälligkeit.",
        "予約がない本だけ"
      ],
      [
        "inference",
        "Kann eine überfällige Zeitschrift gemäß der Buchverlängerung automatisch verlängert werden?",
        "いいえ、できません。",
        "返す日を過ぎると延長できません。",
        "はい、何度でもできます。",
        "Überfällig schließt eine Verlängerung aus.",
        "返す日を過ぎた本は延長できません"
      ]
    ],
    "contextNote": "Die Medienarten haben verschiedene Fristen und Mengen; Buchregel nicht unbesehen auf DVDs übertragen.",
    "writing": [
      "Bitte höflich um Prüfung, ob ein Buch verlängerbar ist.",
      "この本を延長できますか。予約はありますか。",
      "返す日を延ばしてもいいですか。",
      "何回でも延長してください。",
      "Es ist höchstens eine Verlängerung vorgesehen."
    ],
    "returnCue": [
      "Neue Bibliothek: vier Bücher drei Wochen, Verlängerung nur ohne Reservierung vor Frist. Frage danach.",
      "この本は予約がありませんか。延長できますか。",
      "返す日の前に延長したいです。",
      "期限を過ぎても必ず延長できます。",
      "Bedingungen gelten weiterhin."
    ]
  },
  {
    "id": "bike-share-poster",
    "genre": "advertisement",
    "level": "A2",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "自転車で町を回ろう",
    "purpose": "Kostenstaffel und Rückgabestation zusammen interpretieren",
    "audience": "Touristen",
    "issuer": "市の自転車サービス",
    "blocks": [
      "自転車レンタル：一時間まで三百円。以後三十分ごとに百円追加です。",
      "駅前と公園の入り口で借りられます。借りた場所と違う場所に返してもかまいません。",
      "ただし、決められた置き場に返し、画面で「返却完了」を確認してください。道に置くだけでは返したことになりません。"
    ],
    "terms": [
      [
        "以後",
        "いご",
        "danach",
        "以後三十分"
      ],
      [
        "返却",
        "へんきゃく",
        "Rückgabe",
        "返却完了"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was kostet bis zu einer Stunde?",
        "三百円です。",
        "一時間まで三百円です。",
        "百円です。",
        "100 Yen gilt für zusätzliche halbe Stunden.",
        "一時間まで三百円"
      ],
      [
        "condition",
        "Darf man an einer anderen offiziellen Station zurückgeben?",
        "はい、できます。",
        "決められた別の置き場なら大丈夫です。",
        "いいえ、借りた駅だけです。",
        "Ein anderer vorgeschriebener Standort ist erlaubt.",
        "違う場所に返してもかまいません"
      ],
      [
        "inference",
        "Reicht es, das Fahrrad irgendwo abzustellen?",
        "いいえ、足りません。",
        "返却完了を確認する必要があります。",
        "はい、置いたら終わりです。",
        "Nur bestätigte Rückgabe zählt.",
        "道に置くだけでは返したことになりません"
      ]
    ],
    "contextNote": "Alle Preise sind erfundene Werte; Rückgabe muss am registrierten Ort quittiert werden.",
    "writing": [
      "Beschreibe die korrekte Abgabe nach Fahrt.",
      "決められた置き場に返して、画面を確認します。",
      "返却完了の表示を確認します。",
      "道に置いて帰ります。",
      "Einfaches Abstellen ist unzureichend."
    ],
    "returnCue": [
      "Neuer Verleih: Im Park abgeben, danach Schließcode bestätigen. Erkläre.",
      "公園に返してから、コードを確認します。",
      "公園の置き場で返却の番号を確認します。",
      "道に置くだけで大丈夫です。",
      "Bestätigung ist notwendig."
    ]
  },
  {
    "id": "guesthouse-checkin-mail",
    "genre": "message",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "宿からのチェックイン案内",
    "purpose": "Ankunftsfenster, spätes Einchecken und Sonderbedingung verstehen",
    "audience": "Übernachtungsgäste",
    "issuer": "山の宿",
    "blocks": [
      "ご予約ありがとうございます。チェックインは午後三時から七時までです。朝食は午前七時半から九時までです。",
      "七時を過ぎて到着する場合は、当日の午後五時までに電話で知らせてください。",
      "駐車場は三台分ありますが、予約できません。満車の場合は近くの有料駐車場を使ってください。"
    ],
    "terms": [
      [
        "満車",
        "まんしゃ",
        "voller Parkplatz",
        "満車の場合"
      ],
      [
        "有料",
        "ゆうりょう",
        "kostenpflichtig",
        "有料駐車場"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann beginnt reguläres Check-in?",
        "午後三時からです。",
        "三時から七時までです。",
        "午前七時半です。",
        "7:30 ist Frühstück.",
        "チェックインは午後三時から七時まで"
      ],
      [
        "condition",
        "Was müssen Gäste tun, wenn sie nach 19 Uhr kommen?",
        "午後五時までに電話します。",
        "当日の五時までに連絡します。",
        "そのまま夜九時に行きます。",
        "Voranruf bis 17 Uhr erforderlich.",
        "当日の午後五時までに電話"
      ],
      [
        "inference",
        "Ist ein kostenloser Stellplatz durch die Buchung garantiert?",
        "いいえ、予約できません。",
        "満車かもしれません。",
        "はい、必ずあります。",
        "Nur drei Plätze, keine Reservierung.",
        "駐車場は三台分ありますが、予約できません"
      ]
    ],
    "contextNote": "Ein angebotenes Zusatzangebot ist nicht automatisch Teil eines verbindlichen Aufenthalts.",
    "writing": [
      "Rufe an, um spätere Ankunft um acht mitzuteilen.",
      "午後八時ごろ着く予定です。遅くなるので連絡しました。",
      "八時ごろチェックインしたいです。",
      "七時を過ぎても連絡しません。",
      "Anruf ist erforderlich."
    ],
    "returnCue": [
      "Neue Unterkunft: Check-in 14–18 Uhr, bei später Ankunft bis 16 Uhr anrufen. Melde 19 Uhr an.",
      "午後七時に着く予定です。四時までに連絡します。",
      "七時に着きます。遅くなってすみません。",
      "七時に何も言わず行きます。",
      "Spätankunft benötigt vorherigen Kontakt."
    ]
  },
  {
    "id": "meeting-reschedule-mail",
    "genre": "message",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "読書会の日程変更メール",
    "purpose": "Neuer Termin, unveränderte Anmeldung und Vorbereitung lesen",
    "audience": "Lesekreisteilnehmer",
    "issuer": "町の読書会",
    "blocks": [
      "読書会に申し込んだ皆さんへ。会議室の工事のため、木曜日六時からの読書会を金曜日五時に変更します。場所は図書館の二階です。",
      "すでに申し込んだ方は、もう一度申し込む必要はありません。",
      "本を全部読めなくてもかまいません。最初の二十ページを読んで、好きな場面を一つ選んできてください。"
    ],
    "terms": [
      [
        "場面",
        "ばめん",
        "Szene",
        "好きな場面"
      ],
      [
        "必要",
        "ひつよう",
        "notwendig",
        "必要はありません"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann und wo findet der Lesekreis jetzt statt?",
        "金曜日の五時に図書館の二階です。",
        "金曜日の午後五時からです。",
        "木曜日の六時です。",
        "Donnerstag ist alter Plan.",
        "金曜日五時に変更します"
      ],
      [
        "condition",
        "Muss ein bereits angemeldeter Teilnehmer erneut anmelden?",
        "いいえ、必要ありません。",
        "申し込み直さなくていいです。",
        "はい、必要です。",
        "Die alte Anmeldung bleibt gültig.",
        "もう一度申し込む必要はありません"
      ],
      [
        "inference",
        "Muss man das ganze Buch gelesen haben?",
        "いいえ、最初の二十ページです。",
        "二十ページは読んできます。",
        "はい、全部です。",
        "Der Text erlaubt unvollständige Lektüre, fordert die ersten zwanzig Seiten.",
        "全部読めなくてもかまいません"
      ]
    ],
    "contextNote": "Verlegter Termin, gültige Anmeldung und verkürzte Vorbereitung sind drei unabhängige Aspekte.",
    "writing": [
      "Bestätige höflich den neuen Termin.",
      "金曜日の午後五時に参加します。",
      "金曜日の五時に図書館へ行きます。",
      "木曜日の六時に行きます。",
      "Zeitplan wurde geändert."
    ],
    "returnCue": [
      "Neuer Lesekreis: von Dienstag auf Mittwoch 18 Uhr verlegt, erste zehn Seiten vorbereiten, keine neue Anmeldung. Bestätige.",
      "水曜日の六時に参加します。最初の十ページを読みます。",
      "申し込み直さずに水曜日に行きます。",
      "火曜日に参加します。",
      "Neuer Termin und Seitenumfang."
    ]
  },
  {
    "id": "neighborhood-emergency-notice",
    "genre": "public-info",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "水道工事と利用時間",
    "purpose": "Angekündigte Wasserunterbrechung mit Ausnahmen und zeitlichem Vorlauf lesen",
    "audience": "Bewohner einer fiktiven Straße",
    "issuer": "町の水道課",
    "blocks": [
      "水道工事のお知らせ：来週の水曜日、午前十時から午後一時まで、この通りの水が使えません。",
      "病院と学校は別の水道を使うため、今回の工事の影響はありません。",
      "水が必要な方は、朝十時までに用意してください。工事が終わる時間は少し遅れる可能性があります。"
    ],
    "terms": [
      [
        "影響",
        "えいきょう",
        "Auswirkung",
        "影響はありません"
      ],
      [
        "可能性",
        "かのうせい",
        "Möglichkeit",
        "可能性があります"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann ist der Wasserausfall geplant?",
        "水曜日の十時から一時までです。",
        "午前十時から午後一時です。",
        "木曜日の一時からです。",
        "Der Aushang nennt Mittwoch 10–13 Uhr.",
        "午前十時から午後一時まで"
      ],
      [
        "condition",
        "Welche beiden Einrichtungen sind ausdrücklich ausgenommen?",
        "病院と学校です。",
        "病院と学校には影響がありません。",
        "駅と図書館です。",
        "Sie nutzen eine andere Leitung.",
        "病院と学校は別の水道"
      ],
      [
        "inference",
        "Ist garantiert, dass um Punkt 13 Uhr wieder Wasser da ist?",
        "いいえ、遅れる可能性があります。",
        "一時より遅くなるかもしれません。",
        "はい、絶対に一時です。",
        "Ein mögliches Bauende ist nicht garantiert.",
        "少し遅れる可能性があります"
      ]
    ],
    "contextNote": "Dies ist ein erfundener Hinweis, keine reale Störungs- oder Sicherheitsmeldung.",
    "writing": [
      "Informiere einen Mitbewohner über geplante Unterbrechung und Unsicherheit.",
      "水曜日の十時から一時まで水が使えません。少し遅れるかもしれません。",
      "朝十時までに水を用意しましょう。",
      "一時に必ず終わります。",
      "Das Ende ist nicht garantiert."
    ],
    "returnCue": [
      "Neue Information: Stromabschaltung Freitag 9–12 Uhr, Ende kann sich verzögern. Informiere vorsichtig.",
      "金曜日の九時から十二時まで電気が使えません。遅れるかもしれません。",
      "金曜日は午前中に停電する予定です。",
      "十二時に必ず戻ります。",
      "Der neue Hinweis enthält Unsicherheit."
    ]
  }
] satisfies P49RawDocument[];
export const p49DocumentsE=p49CorpusE.map(authoredP49Document);
