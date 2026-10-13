import {authoredP49Document,type P49RawDocument} from "./documents49-types";
/** Eight entirely original A1 practical documents: menus, notices, schedules, invitations, forms and messages. */
export const p49CorpusA=[
  {
    "id": "cafe-breakfast",
    "genre": "menu",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "朝のセットメニュー",
    "purpose": "Preise, Kombinationsregel und Endzeit eines Frühstücksangebots lesen",
    "audience": "Frühstücksgast",
    "issuer": "喫茶さくら",
    "blocks": [
      "朝のセット（午前七時〜十時）",
      "Aセット　パン・ゆで卵・コーヒー　五百円",
      "Bセット　パン・サラダ・紅茶　六百円",
      "飲み物をジュースに変える場合は百円追加です。十時を過ぎるとセットは注文できません。"
    ],
    "terms": [
      [
        "追加",
        "ついか",
        "Aufpreis",
        "百円追加"
      ],
      [
        "注文",
        "ちゅうもん",
        "bestellen",
        "注文できません"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was kostet Set A ohne Änderung?",
        "五百円です。",
        "Aセットは五百円です。",
        "六百円です。",
        "600 Yen gilt für B.",
        "Aセット　パン・ゆで卵・コーヒー　五百円"
      ],
      [
        "condition",
        "Wie viel kostet Set A mit Saft?",
        "六百円です。",
        "五百円に百円を足して六百円です。",
        "五百円のままです。",
        "Der Saft kostet 100 Yen extra.",
        "ジュースに変える場合は百円追加"
      ],
      [
        "inference",
        "Kann man um 10:30 noch ein Set bestellen?",
        "いいえ、できません。",
        "十時を過ぎたので注文できません。",
        "はい、午前中ならいつでもいいです。",
        "Die Grenze ist 10 Uhr, nicht 12 Uhr.",
        "十時を過ぎるとセットは注文できません"
      ]
    ],
    "contextNote": "セット enthält mehrere Speisen; ein Getränkentausch ist kein kostenloser Austausch.",
    "writing": [
      "Bestelle Set B mit regulärem Tee.",
      "Bセットを一つお願いします。",
      "パンとサラダと紅茶のセットをください。",
      "Aセットをください。",
      "Set A enthält Kaffee und Ei."
    ],
    "returnCue": [
      "Neues Café: Set C kostet 700 Yen; Milch statt Tee kostet 50 Yen extra. Bestelle Set C mit Milch.",
      "Cセットを牛乳に変えてお願いします。七百五十円ですね。",
      "牛乳のCセットをお願いします。",
      "七百円で牛乳をください。",
      "Der Aufpreis muss berücksichtigt werden."
    ]
  },
  {
    "id": "noodle-lunch",
    "genre": "menu",
    "level": "A1",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "title": "昼のうどんメニュー",
    "purpose": "Portionsoption und Ausschluss eines Angebots erkennen",
    "audience": "Mittagsgast",
    "issuer": "うどん山",
    "blocks": [
      "うどん　小　四百五十円／大　六百円",
      "天ぷらを付けると二百円追加です。",
      "昼の割引：月曜日から金曜日の十一時〜二時まで、小サイズだけ五十円引き。土曜日と日曜日は割引がありません。"
    ],
    "terms": [
      [
        "割引",
        "わりびき",
        "Rabatt",
        "五十円引き"
      ],
      [
        "天ぷら",
        "てんぷら",
        "frittierte Beilage",
        "天ぷらを付ける"
      ]
    ],
    "questions": [
      [
        "locate",
        "Was kostet die große Portion ohne Beilage?",
        "六百円です。",
        "大は六百円です。",
        "四百五十円です。",
        "Der Kleinpreis wird verwechselt.",
        "大　六百円"
      ],
      [
        "condition",
        "Was kostet eine kleine Portion dienstags mittags ohne Beilage?",
        "四百円です。",
        "五十円引きで四百円です。",
        "四百五十円です。",
        "An Wochentagen mittags gelten 50 Yen Rabatt.",
        "小サイズだけ五十円引き"
      ],
      [
        "inference",
        "Gilt der Mittagsrabatt für eine große Portion am Dienstag?",
        "いいえ、小サイズだけです。",
        "大サイズには割引がありません。",
        "はい、五十円引きです。",
        "Die Größenbedingung gilt auch am Dienstag.",
        "小サイズだけ五十円引き"
      ]
    ],
    "contextNote": "Zwei Bedingungen für den Rabatt: Wochentag und kleine Größe.",
    "writing": [
      "Bestelle eine große Portion mit Tempura.",
      "大きいうどんに天ぷらを付けてください。",
      "うどんの大と天ぷらをお願いします。",
      "小サイズだけください。",
      "Die Aufgabe verlangt groß und Beilage."
    ],
    "returnCue": [
      "Neues Lokal: mittwochs nur Reisgerichte 100 Yen günstiger. Frage, ob Nudeln ebenfalls rabattiert sind.",
      "水曜日はうどんも安くなりますか。",
      "うどんにも割引がありますか。",
      "うどんは必ず百円引きです。",
      "Aus der Angabe zu Reis lässt sich kein Nudelnachlass ableiten."
    ]
  },
  {
    "id": "pool-closure",
    "genre": "notice",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "市民プールのお知らせ",
    "purpose": "Schließung und verfügbare Ersatzzeit lesen",
    "audience": "Besucher des Schwimmbads",
    "issuer": "市民プール",
    "blocks": [
      "お知らせ：六月十二日（金）は掃除のためプールを休みます。",
      "六月十三日（土）はいつもどおり朝九時から午後五時まで開きます。",
      "泳ぎたい方は土曜日にお越しください。入口では靴を脱いでください。"
    ],
    "terms": [
      [
        "掃除",
        "そうじ",
        "Reinigung",
        "掃除のため"
      ],
      [
        "入口",
        "いりぐち",
        "Eingang",
        "入口では"
      ]
    ],
    "questions": [
      [
        "locate",
        "An welchem Tag bleibt das Bad geschlossen?",
        "六月十二日です。",
        "金曜日の十二日です。",
        "六月十三日です。",
        "Samstag ist regulär geöffnet.",
        "六月十二日（金）は掃除のためプールを休みます"
      ],
      [
        "condition",
        "Wann öffnet das Bad am Samstag?",
        "朝九時からです。",
        "午前九時に開きます。",
        "午前十時からです。",
        "Der Samstag nennt 9 bis 17 Uhr.",
        "朝九時から午後五時まで"
      ],
      [
        "inference",
        "Kann jemand am Freitag schwimmen und dafür Schuhe ausziehen?",
        "いいえ、休みです。",
        "金曜日はプールに入れません。",
        "はい、靴を脱げば入れます。",
        "Die Schuhregel hebt die Schließung nicht auf.",
        "金曜日は…プールを休みます"
      ]
    ],
    "contextNote": "Das Schließdatum hat Vorrang vor allgemeinen Besucherregeln.",
    "writing": [
      "Sage, dass du am Samstag um zehn schwimmen gehst.",
      "土曜日の十時にプールへ行きます。",
      "土曜日の朝十時に泳ぎに行きます。",
      "金曜日に泳ぎます。",
      "Freitag ist geschlossen."
    ],
    "returnCue": [
      "Anderes Bad: Dienstag wegen Reinigung geschlossen, Mittwoch ab acht offen. Plane Mittwoch neun.",
      "水曜日の九時にプールへ行きます。",
      "水曜日の朝九時に泳ぎます。",
      "火曜日に行きます。",
      "Dienstag ist geschlossen."
    ]
  },
  {
    "id": "museum-photo-rule",
    "genre": "notice",
    "level": "A1",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "展示室の写真ルール",
    "purpose": "Erlaubnis, Verbot und Ausnahmeraum erkennen",
    "audience": "Museumsbesucher",
    "issuer": "町の美術館",
    "blocks": [
      "写真について：一階の展示室では写真を撮ってもかまいません。",
      "二階の特別展示では写真と動画を撮らないでください。",
      "一階でもフラッシュは使えません。係員の説明がある場合は、その案内を聞いてください。"
    ],
    "terms": [
      [
        "展示室",
        "てんじしつ",
        "Ausstellungsraum",
        "一階の展示室"
      ],
      [
        "禁止",
        "きんし",
        "Verbot",
        "撮らないでください"
      ]
    ],
    "questions": [
      [
        "locate",
        "In welchem Stock ist Fotografieren grundsätzlich erlaubt?",
        "一階です。",
        "一階の展示室です。",
        "二階です。",
        "Die Sonderausstellung oben untersagt Fotos.",
        "一階の展示室では写真を撮ってもかまいません"
      ],
      [
        "condition",
        "Darf im Erdgeschoss mit Blitz fotografiert werden?",
        "いいえ、使えません。",
        "フラッシュは使えません。",
        "はい、写真がいいならフラッシュもいいです。",
        "Fotoerlaubnis schließt Blitz ausdrücklich aus.",
        "一階でもフラッシュは使えません"
      ],
      [
        "inference",
        "Ist Video im zweiten Stock zulässig?",
        "いいえ、できません。",
        "二階は動画も禁止です。",
        "はい、写真だけ禁止です。",
        "Das Verbot umfasst Foto und Video.",
        "写真と動画を撮らないでください"
      ]
    ],
    "contextNote": "Erlaubnis und Einschränkung gelten gleichzeitig; 一階 ist japanisches Erdgeschoss.",
    "writing": [
      "Bitte freundlich um Erlaubnis, im Erdgeschoss ohne Blitz zu fotografieren.",
      "一階でフラッシュなしで写真を撮ってもいいですか。",
      "ここで写真を撮ってもいいですか。",
      "二階で動画を撮ります。",
      "Oben sind Video und Fotos verboten."
    ],
    "returnCue": [
      "Andere Ausstellung: Fotos im Garten erlaubt, im Gebäude verboten. Erkläre den Unterschied.",
      "庭では写真を撮れますが、建物の中では撮れません。",
      "外ではいいですが、中では写真は禁止です。",
      "建物の中で写真を撮ります。",
      "Das neue Innenraumverbot gilt."
    ]
  },
  {
    "id": "school-bus-times",
    "genre": "timetable",
    "level": "A1",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "title": "スクールバス時刻表",
    "purpose": "Abfahrtszeiten nach Wochentag unterscheiden",
    "audience": "Studierende",
    "issuer": "大学バス",
    "blocks": [
      "大学行きバス：駅前発",
      "月〜金　八時十分／八時四十分／九時十分",
      "土曜日　九時／十時",
      "日曜・祝日　運休。大学までは約二十分です。"
    ],
    "terms": [
      [
        "発",
        "はつ",
        "Abfahrt ab",
        "駅前発"
      ],
      [
        "運休",
        "うんきゅう",
        "entfällt",
        "祝日　運休"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann fährt der erste Bus samstags?",
        "九時です。",
        "土曜日の九時です。",
        "八時十分です。",
        "8:10 gehört zu Montag–Freitag.",
        "土曜日　九時／十時"
      ],
      [
        "condition",
        "Gibt es sonntags einen Bus?",
        "いいえ、運休です。",
        "日曜日はバスがありません。",
        "はい、十時に出ます。",
        "Der Aushang schließt Sonntage aus.",
        "日曜・祝日　運休"
      ],
      [
        "inference",
        "Wann kommt der Werktagsbus ab 8:40 ungefähr an?",
        "九時ごろです。",
        "九時に大学に着きます。",
        "八時四十分に着きます。",
        "Die Fahrt dauert etwa 20 Minuten.",
        "大学までは約二十分です"
      ]
    ],
    "contextNote": "Die 20 Minuten sind ein Näherungswert, keine pünktliche Ankunftsgarantie.",
    "writing": [
      "Schreibe, dass du samstags den Bus um neun nimmst.",
      "土曜日の九時のバスに乗ります。",
      "土曜日は九時に駅を出ます。",
      "日曜日の九時のバスに乗ります。",
      "Sonntag entfällt."
    ],
    "returnCue": [
      "Neuer Plan: Samstag fährt Bus nur um 11 Uhr, Sonntag gar nicht. Plane Samstag.",
      "土曜日の十一時のバスに乗ります。",
      "土曜日は十一時に出発します。",
      "日曜日にバスに乗ります。",
      "Sonntag gibt es keinen Bus."
    ]
  },
  {
    "id": "volunteer-invite",
    "genre": "invitation",
    "level": "A1",
    "title": "公園のボランティア募集",
    "purpose": "Einladung, Anmeldung und benötigte Ausrüstung verstehen",
    "audience": "Neue Freiwillige",
    "issuer": "町のボランティア会",
    "blocks": [
      "公園をきれいにしませんか。日曜日の朝十時から十二時まで、ごみを拾います。",
      "参加したい人は金曜日までにメールで申し込んでください。",
      "軍手はこちらで用意します。水は自分で持って来てください。雨の場合は中止です。"
    ],
    "terms": [
      [
        "募集",
        "ぼしゅう",
        "Aufruf/Suche",
        "ボランティア募集"
      ],
      [
        "軍手",
        "ぐんて",
        "Arbeitshandschuhe",
        "軍手はこちらで"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann findet die Aktion statt?",
        "日曜日の十時から十二時です。",
        "日曜日の朝十時からです。",
        "土曜日の十時です。",
        "Es ist Sonntag.",
        "日曜日の朝十時から十二時まで"
      ],
      [
        "condition",
        "Bis wann müssen sich Teilnehmer anmelden?",
        "金曜日までです。",
        "金曜日までにメールします。",
        "日曜日の朝です。",
        "Die Anmeldung endet vorher.",
        "金曜日までにメールで申し込んでください"
      ],
      [
        "inference",
        "Muss man eigene Handschuhe mitbringen?",
        "いいえ、必要ありません。",
        "軍手は用意されています。",
        "はい、軍手も水も持ちます。",
        "Handschuhe werden bereitgestellt, Wasser nicht.",
        "軍手はこちらで用意します"
      ]
    ],
    "contextNote": "Eine Einladung ist noch keine Anmeldung; Regen ist eine explizite Ausfallbedingung.",
    "writing": [
      "Melde dich per Mail für die Aktion an.",
      "日曜日のボランティアに参加したいです。",
      "日曜日の活動に申し込みます。",
      "参加したくありません。",
      "Der Auftrag lautet Teilnahme zusagen."
    ],
    "returnCue": [
      "Neue Aktion: Samstag 14 Uhr, Anmeldung bis Donnerstag, Handschuhe selbst mitbringen. Melde dich an.",
      "土曜日の二時の活動に参加したいです。軍手を持って行きます。",
      "土曜日の活動に申し込みます。",
      "日曜日の活動に行きます。",
      "Die neuen Daten unterscheiden sich."
    ]
  },
  {
    "id": "study-group-form",
    "genre": "form",
    "level": "A1",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "勉強会の申込書",
    "purpose": "Pflichtfelder und Auswahl auf einem Anmeldeformular lesen",
    "audience": "Teilnehmende einer Lerngruppe",
    "issuer": "学習センター",
    "blocks": [
      "勉強会　申込書　＊は必須です。",
      "＊名前：＿＿＿＿　＊メール：＿＿＿＿",
      "希望する曜日：□火曜日　□木曜日　（どちらか一つ）",
      "参加は無料です。申し込み後、メールで場所をお知らせします。"
    ],
    "terms": [
      [
        "必須",
        "ひっす",
        "Pflichtfeld",
        "＊は必須"
      ],
      [
        "希望",
        "きぼう",
        "Wunsch",
        "希望する曜日"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche beiden Angaben sind Pflicht?",
        "名前とメールです。",
        "名前とメールアドレスが必要です。",
        "電話番号と住所です。",
        "Telefon und Adresse erscheinen nicht.",
        "＊名前…＊メール"
      ],
      [
        "condition",
        "Wie viele Wochentage darf man auswählen?",
        "一つです。",
        "火曜日か木曜日のどちらかです。",
        "二つです。",
        "Das Formular erlaubt genau eine Auswahl.",
        "どちらか一つ"
      ],
      [
        "inference",
        "Steht der genaue Ort bereits auf dem Formular?",
        "いいえ、あとでメールが来ます。",
        "場所はメールで知らされます。",
        "はい、図書館です。",
        "Der Ort wird erst nach Anmeldung mitgeteilt.",
        "メールで場所をお知らせします"
      ]
    ],
    "contextNote": "Ein leeres Formular ist keine bestätigte Anmeldung oder Teilnahme.",
    "writing": [
      "Sage: Ich möchte Dienstag teilnehmen.",
      "火曜日に参加したいです。",
      "希望する曜日は火曜日です。",
      "火曜日と木曜日の両方を選びます。",
      "Genau eine Auswahl."
    ],
    "returnCue": [
      "Neues Formular: Pflichtfelder Name und Telefonnummer, Auswahl Mittwoch oder Freitag. Wähle Freitag.",
      "金曜日を希望します。名前と電話番号を書きます。",
      "金曜日に参加したいです。",
      "水曜日と金曜日を両方選びます。",
      "Es ist nur eine Wahl vorgesehen."
    ]
  },
  {
    "id": "friend-change-message",
    "genre": "message",
    "level": "A1",
    "title": "友だちからの時間変更",
    "purpose": "Korrektur von Ort und gleichbleibender Uhrzeit erkennen",
    "audience": "Freunde",
    "issuer": "ゆか",
    "blocks": [
      "なおへ。明日の映画は午後三時からだよ。最初は駅で会うつもりだったけど、駅の前が工事中だって。",
      "だから映画館の入り口で二時半に会おう。三時の映画は変わらないよ。",
      "返事をくれるとうれしいな。"
    ],
    "terms": [
      [
        "工事中",
        "こうじちゅう",
        "im Bau",
        "工事中だって"
      ],
      [
        "つもり",
        "つもり",
        "Absicht/Plan",
        "会うつもり"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wo sollen sich die Freunde nun treffen?",
        "映画館の入り口です。",
        "映画館で会います。",
        "駅です。",
        "Der Bahnhofsplatz ist betroffen.",
        "映画館の入り口で二時半に会おう"
      ],
      [
        "condition",
        "Wann treffen sie sich?",
        "二時半です。",
        "午後二時半です。",
        "午後三時です。",
        "3 Uhr ist der Filmbeginn.",
        "二時半に会おう"
      ],
      [
        "inference",
        "Ist der Film auf später verschoben?",
        "いいえ、三時のままです。",
        "映画は三時からです。",
        "はい、四時です。",
        "Nur der Treffpunkt wird geändert.",
        "三時の映画は変わらない"
      ]
    ],
    "contextNote": "Treffzeit und Veranstaltungszeit sind getrennte Zeitangaben.",
    "writing": [
      "Bestätige den neuen Treffpunkt freundlich.",
      "二時半に映画館の入り口で会おう。",
      "映画館で二時半だね。",
      "三時に駅で会おう。",
      "Ort und Uhrzeit wären falsch."
    ],
    "returnCue": [
      "Neue Nachricht: Konzert beginnt um sieben, Treffen vor Halle 18:30 statt am Bahnhof. Bestätige.",
      "六時半に会場の前で会おう。",
      "六時半にホールの入り口に行くね。",
      "七時に駅で会おう。",
      "Die Treffzeit liegt vor Konzertbeginn."
    ]
  }
] satisfies P49RawDocument[];
export const p49DocumentsA=p49CorpusA.map(authoredP49Document);
