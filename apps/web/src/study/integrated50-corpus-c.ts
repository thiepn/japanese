import {authoredP50Mission,type P50RawMission} from "./integrated50-types";
/** Five original A2 integrated Japanese factual, cross-source and uncertainty tasks. */
export const p50CorpusC=[
  {
    "id": "museum-schedule",
    "title": "Sonderausstellung: Zeit und Führungsänderung",
    "level": "A2",
    "genre": "social",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Ein Museumsprogramm und eine Ansage ändern unterschiedliche Zeiten.",
    "goal": "Einlasszeit, Führung, Ausstellungsschluss differenzieren",
    "readLabel": "Offizielles Museumsprogramm",
    "readGenre": "notice",
    "reading": [
      "美術館は午後六時に閉まります。新しい入場は午後五時までです。",
      "二階の特別展示は午後四時半までです。日本語ガイドツアーは三時からの予定です。"
    ],
    "readingGerman": "Museum schließt 18 Uhr, letzter Einlass 17 Uhr, Sonderausstellung endet 16:30, japanische Führung zunächst um 15 Uhr.",
    "spokenContext": "Neue Museumsansage",
    "listening": [
      [
        "係員",
        "日本語のガイドツアーについてお知らせします。",
        "Information zur japanischen Führung."
      ],
      [
        "係員",
        "ガイドが遅れるため、開始は三時半に変更します。",
        "Die Führung beginnt wegen Verspätung um 15:30."
      ],
      [
        "係員",
        "特別展示が終わる時間は変わりません。",
        "Das Ende der Sonderausstellung bleibt gleich."
      ],
      [
        "係員",
        "参加したい方は三時二十分までに一階の受付へ来てください。",
        "Wer teilnehmen möchte, bis 15:20 an der Anmeldung im Erdgeschoss sein."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann endet die Sonderausstellung?",
        "午後四時半です。",
        "四時半に終わります。",
        "午後六時です。",
        "18 Uhr ist der Gebäudeschluss.",
        [
          [
            "reading",
            "午後四時半まで",
            "Ausstellung"
          ],
          [
            "listening",
            "終わる時間は変わりません",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wann beginnt die japanische Führung?",
        "午後三時半です。",
        "三時三十分です。",
        "午後三時です。",
        "Die Ansage ersetzt den gedruckten Beginn.",
        [
          [
            "reading",
            "三時からの予定",
            "alt"
          ],
          [
            "listening",
            "三時半に変更",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Reicht Ankunft um 15:25 zur Anmeldung der Führung?",
        "いいえ、遅いです。",
        "三時二十分までに受付へ行きます。",
        "はい、三時半まででいいです。",
        "Die Anmeldefrist liegt vor dem Führungsbeginn.",
        [
          [
            "listening",
            "三時二十分までに",
            "Anmeldefrist"
          ],
          [
            "listening",
            "三時半に変更",
            "Beginn"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "受付",
        "うけつけ",
        "Anmeldung",
        "listening: 一階の受付"
      ],
      [
        "特別展示",
        "とくべつてんじ",
        "Sonderausstellung",
        "reading: 特別展示"
      ]
    ],
    "writing": [
      "Informiere jemanden über neuen Beginn und Registrierungsfrist.",
      "ガイドツアーは三時半からですが、三時二十分までに受付へ行ってください。",
      "三時二十分までに受付へ来てね。ツアーは三時半です。",
      "三時半に直接行けば大丈夫です。",
      "Anmeldung endet früher."
    ],
    "transfer": [
      "Neue Galerie: Führung 17 Uhr, Anmeldung bis 16:45, Ausstellungsschluss 18 Uhr. Informiere.",
      "ツアーは五時からで、四時四十五分までに受付が必要です。",
      "四時四十五分までに申し込んでください。",
      "五時に申し込みます。",
      "Die Frist endet um 16:45."
    ],
    "pedagogy": "閉館・展示終了・申込締切・ツアー開始の各時刻を一つにまとめない。"
  },
  {
    "id": "campus-deadline",
    "title": "Abgabe und Gruppenbesprechung",
    "level": "A2",
    "genre": "study",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Die Aufgabenstellung und ein Lehreranruf betreffen unterschiedliche Pflichten.",
    "goal": "Material und Deadline nach Teilkorrektur rekonstruieren",
    "readLabel": "Aufgabenblatt im Kurs",
    "readGenre": "assignment",
    "reading": [
      "日本語の作文：町について四ページ書く。",
      "提出は金曜日の午後五時まで。月曜日の会話練習では作文の内容を話す。"
    ],
    "readingGerman": "Vier Seiten über die Stadt, Abgabe Freitag bis 17 Uhr; Montag Gesprächsübung zum Thema.",
    "spokenContext": "Ansage der Lehrkraft",
    "listening": [
      [
        "先生",
        "作文の量を変えます。四ページではなく、三ページでいいです。",
        "Der Umfang wird auf drei statt vier Seiten reduziert."
      ],
      [
        "先生",
        "金曜日の五時の締め切りは変わりません。",
        "Freitag 17 Uhr bleibt als Abgabefrist."
      ],
      [
        "先生",
        "月曜日はグループで理由を話すので、例を一つ用意してください。",
        "Montag in Gruppen Gründe besprechen, ein Beispiel vorbereiten."
      ],
      [
        "学生",
        "三ページを書いて金曜日に出し、月曜日には例を話します。",
        "Ich gebe Freitag drei Seiten ab und erkläre Montag ein Beispiel."
      ]
    ],
    "questions": [
      [
        "detail",
        "Bis wann muss der Text abgegeben werden?",
        "金曜日の午後五時です。",
        "金曜日の五時までです。",
        "月曜日の五時です。",
        "Montag ist die mündliche Übung.",
        [
          [
            "reading",
            "金曜日の午後五時まで",
            "Abgabe"
          ],
          [
            "listening",
            "締め切りは変わりません",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wie viele Seiten sind nun erforderlich?",
        "三ページです。",
        "三ページ書きます。",
        "四ページです。",
        "Die Lehrkraft reduziert ausdrücklich.",
        [
          [
            "reading",
            "四ページ",
            "alt"
          ],
          [
            "listening",
            "三ページでいいです",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Reicht es, Montag den Aufsatz still abzugeben?",
        "いいえ、例を話します。",
        "月曜日はグループで例を一つ説明します。",
        "はい、話す必要はありません。",
        "Die mündliche Übung verlangt Sprechen und ein Beispiel.",
        [
          [
            "reading",
            "会話練習では…話す",
            "Gesprächsaufgabe"
          ],
          [
            "listening",
            "例を一つ用意",
            "Ergänzung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "締め切り",
        "しめきり",
        "Abgabefrist",
        "listening: 締め切り"
      ],
      [
        "内容",
        "ないよう",
        "Inhalt",
        "reading: 作文の内容"
      ]
    ],
    "writing": [
      "Schreibe einem Studienpartner die beiden Verpflichtungen.",
      "金曜日の五時までに三ページを出して、月曜日に例を一つ説明します。",
      "作文は三ページです。月曜日は一つ例を話します。",
      "月曜日に四ページを出します。",
      "Umfang und Frist wären falsch."
    ],
    "transfer": [
      "Neue Aufgabe: Bericht ursprünglich sechs Seiten, jetzt vier, Frist Dienstag 12 Uhr bleibt; Mittwoch Kurzvortrag. Bestätige.",
      "火曜日の十二時までに四ページを出して、水曜日に発表します。",
      "レポートは四ページです。締め切りは火曜日です。",
      "六ページを水曜日に出します。",
      "Der Bericht wurde gekürzt und Frist bleibt."
    ],
    "pedagogy": "同じ課題の量が変わっても、提出日と別の口頭活動は独立している。"
  },
  {
    "id": "volunteer-two-activities",
    "title": "Regen: Bibliotheksaktion statt Parkarbeit",
    "level": "A2",
    "genre": "community",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Eine Freiwilligen-Mail und eine Audioansage legen fest, welche Aufgabe stattfindet.",
    "goal": "Absage, Änderung, Ausrüstung, optionale Mitnahme kombinieren",
    "readLabel": "Einladungsmail des Vereins",
    "readGenre": "email",
    "reading": [
      "日曜日の午前十時から公園の掃除をします。",
      "軍手とごみ袋を持って来てください。参加する方は土曜日までに返事をください。"
    ],
    "readingGerman": "Sonntag 10 Uhr Parkreinigung; Handschuhe und Müllbeutel, Rückmeldung bis Samstag.",
    "spokenContext": "Sprachnachricht der Leitung",
    "listening": [
      [
        "係",
        "日曜日は雨なので、公園の掃除は来週に延期します。",
        "Parkreinigung wegen Regen auf nächste Woche verschoben."
      ],
      [
        "係",
        "今週は同じ時間に図書館で古い本を整理します。",
        "Diese Woche um dieselbe Zeit alte Bücher in der Bibliothek sortieren."
      ],
      [
        "係",
        "軍手はいりません。大きい袋がある人は持って来てくれると助かります。",
        "Handschuhe unnötig; große Beutel wären hilfreich, wenn vorhanden."
      ],
      [
        "係",
        "参加できない方は今夜までに知らせてください。",
        "Wer nicht kann, soll bis heute Abend Bescheid geben."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Arbeit findet diesen Sonntag statt?",
        "図書館で本を整理します。",
        "古い本の整理です。",
        "公園の掃除です。",
        "Die Parkaktion wurde verschoben.",
        [
          [
            "reading",
            "公園の掃除",
            "alt"
          ],
          [
            "listening",
            "図書館で古い本を整理します",
            "gültig"
          ]
        ]
      ],
      [
        "correction",
        "Sind Handschuhe noch erforderlich?",
        "いいえ、要りません。",
        "軍手は必要ありません。",
        "はい、必ず持ちます。",
        "Die neuen Materialien unterscheiden sich.",
        [
          [
            "reading",
            "軍手…持って来て",
            "alte Vorgabe"
          ],
          [
            "listening",
            "軍手はいりません",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Muss jeder Helfer einen großen Beutel besitzen?",
        "いいえ、ある人だけです。",
        "袋があれば持って行きます。",
        "はい、全員必要です。",
        "Eine höfliche optionale Bitte wird nicht zum Zwang.",
        [
          [
            "listening",
            "袋がある人は",
            "bedingt"
          ],
          [
            "listening",
            "助かります",
            "Bitte"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "延期",
        "えんき",
        "Verschiebung",
        "listening: 延期します"
      ],
      [
        "整理",
        "せいり",
        "sortieren",
        "listening: 本を整理します"
      ]
    ],
    "writing": [
      "Antworte, dass du die Bücheraktion besuchst und einen Beutel mitbringst, falls du einen hast.",
      "日曜日の十時に図書館へ行きます。大きい袋があれば持って行きます。",
      "本の整理を手伝います。軍手は持って行きません。",
      "日曜日に公園を掃除します。",
      "Diese Aktion wurde verschoben."
    ],
    "transfer": [
      "Neue Aktion: Wegen Schnee Parkarbeit später, Samstag 11 Uhr Tische im Gemeindehaus ordnen; Handschuhe nicht nötig. Bestätige.",
      "土曜日の十一時に公民館で机を整理します。軍手はいりません。",
      "公園ではなく公民館で手伝います。",
      "土曜日に公園で掃除します。",
      "Die neue Aufgabe ist innen."
    ],
    "pedagogy": "任意のお願いと必須の準備を区別する。"
  },
  {
    "id": "parcel-courier",
    "title": "Paket: Zustellung oder Ladenabholung",
    "level": "A2",
    "genre": "service",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Eine Versandmail und eine Sprachmitteilung des Dienstes bieten verschiedene Zustellwege.",
    "goal": "Hauslieferfenster, Ladenalternative und Änderungsfrist trennen",
    "readLabel": "Versandbestätigung",
    "readGenre": "email",
    "reading": [
      "荷物の配達予定：木曜日午前十時〜正午。",
      "受け取り時に身分証が必要です。注文番号四五八。"
    ],
    "readingGerman": "Hauszustellung Donnerstag 10–12, Ausweis erforderlich, Nummer 458.",
    "spokenContext": "Nachricht des Paketzustellers",
    "listening": [
      [
        "配達員",
        "道路工事のため、木曜日の配達ができなくなりました。",
        "Hauszustellung Donnerstag wegen Bauarbeiten nicht möglich."
      ],
      [
        "配達員",
        "金曜日の午後二時から五時にもう一度お届けできます。",
        "Erneute Lieferung Freitag 14–17 möglich."
      ],
      [
        "配達員",
        "お店で受け取るなら、金曜日の午前十一時からです。",
        "Im Laden bereits Freitag ab 11 Uhr abholbar."
      ],
      [
        "配達員",
        "配達方法を変更する方は今日の八時までに電話してください。",
        "Für Änderung bis heute um acht anrufen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann beginnt die Ladenabholung?",
        "金曜日の午前十一時です。",
        "金曜日の十一時からです。",
        "木曜日の十時です。",
        "Donnerstag war die alte Hauszustellung.",
        [
          [
            "listening",
            "金曜日の午前十一時から",
            "Laden"
          ]
        ]
      ],
      [
        "correction",
        "Welches Zeitfenster gilt für eine erneute Hauszustellung?",
        "金曜日の午後二時から五時です。",
        "金曜日の二時から五時です。",
        "木曜日の十時から十二時です。",
        "Die Hauszustellung wurde verschoben.",
        [
          [
            "reading",
            "木曜日午前十時〜正午",
            "alt"
          ],
          [
            "listening",
            "金曜日の午後二時から五時",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Ist Freitag um zwölf eine mögliche Ladenabholung vor der Hauslieferung?",
        "はい、店なら可能です。",
        "はい、店で十一時以降に受け取れます。",
        "いいえ、午後二時からだけです。",
        "Laden und Hauslieferung haben unterschiedliche Zeitfenster.",
        [
          [
            "listening",
            "午前十一時から",
            "Laden"
          ],
          [
            "listening",
            "午後二時から五時",
            "Haus"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "道路工事",
        "どうろこうじ",
        "Straßenbauarbeiten",
        "listening: 道路工事"
      ],
      [
        "配達",
        "はいたつ",
        "Zustellung",
        "reading: 配達予定"
      ]
    ],
    "writing": [
      "Bitte telefonisch um Abholung im Laden um zwölf am Freitag.",
      "金曜日の十二時に店で受け取りたいです。変更をお願いします。",
      "金曜日の昼にお店へ取りに行きます。",
      "木曜日の朝に家で受け取ります。",
      "Die ursprüngliche Lieferung ist unmöglich."
    ],
    "transfer": [
      "Neue Lieferung: Haus Samstag 16–18 Uhr statt Freitag, Laden Samstag ab 9 Uhr; bitte Abholung um zehn.",
      "土曜日の十時に店で受け取りたいです。",
      "土曜日の午前十時に取りに行きます。",
      "土曜日の八時に行きます。",
      "Der Laden bietet Abholung erst ab neun."
    ],
    "pedagogy": "予約・届け先・受取窓口の時刻を区別して判断する。"
  },
  {
    "id": "market-conditional-offer",
    "title": "Wochenmarkt: Rabatt mit Kassenfrist",
    "level": "A2",
    "genre": "shopping",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Ein Preisschild und eine Händlerdurchsage ergeben einen rabattierten Einkauf mit Bedingung.",
    "goal": "Preisetikett, Rabattfenster und tatsächliche Zahlung auseinanderhalten",
    "readLabel": "Preistafel am Markt",
    "readGenre": "advertisement",
    "reading": [
      "トマト一袋五百円、りんご一個百五十円。",
      "営業は午前九時から午後六時までです。"
    ],
    "readingGerman": "Tomaten 500 Yen pro Beutel, Äpfel 150 Yen pro Stück, Geschäft 9–18 Uhr.",
    "spokenContext": "Aktuelle Händlerdurchsage",
    "listening": [
      [
        "店員",
        "今日は午後三時から四時まで、トマトは一袋四百円です。",
        "Tomaten heute 15–16 Uhr für 400 Yen."
      ],
      [
        "店員",
        "四時までにレジでお金を払ったお客様だけ割引します。",
        "Rabatt nur, wenn bis 16 Uhr an der Kasse bezahlt."
      ],
      [
        "店員",
        "りんごの値段はそのままです。",
        "Apfelpreise bleiben gleich."
      ],
      [
        "客",
        "では、三時半にトマトを買います。",
        "Dann kaufe ich um halb vier Tomaten."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie hoch ist der Tomaten-Aktionspreis?",
        "四百円です。",
        "一袋四百円です。",
        "五百円です。",
        "500 Yen ist der reguläre Preis.",
        [
          [
            "reading",
            "トマト一袋五百円",
            "Standard"
          ],
          [
            "listening",
            "トマトは一袋四百円",
            "Aktion"
          ]
        ]
      ],
      [
        "correction",
        "Wodurch erhält man den reduzierten Preis?",
        "四時までにレジで払います。",
        "午後四時までに支払います。",
        "四時までに選べばいいです。",
        "Die Ware nur zu nehmen reicht nicht; der Kassiervorgang muss rechtzeitig erfolgen.",
        [
          [
            "listening",
            "四時までにレジでお金を払った",
            "Bedingung"
          ]
        ]
      ],
      [
        "inference",
        "Sind auch Äpfel im Zeitraum 15–16 Uhr reduziert?",
        "いいえ、百五十円のままです。",
        "りんごは値段が変わりません。",
        "はい、百円になります。",
        "Der Rabatt betrifft ausschließlich Tomaten.",
        [
          [
            "reading",
            "りんご一個百五十円",
            "Regulärpreis"
          ],
          [
            "listening",
            "りんごの値段はそのまま",
            "Ausschluss"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "割引",
        "わりびき",
        "Rabatt",
        "listening: 割引"
      ],
      [
        "レジ",
        "れじ",
        "Kasse",
        "listening: レジで"
      ]
    ],
    "writing": [
      "Formuliere einen Einkauf um 15:30 mit rechtzeitiger Zahlung.",
      "三時半にトマトを一袋買って、四時までに払います。",
      "三時半に四百円でトマトを買います。",
      "五時に四百円で買います。",
      "Die Aktion endet um vier."
    ],
    "transfer": [
      "Neuer Markt: Brot normal 300 Yen, von 12–13 Uhr 250 Yen nur bei Zahlung bis 13 Uhr. Bestätige Einkauf um 12:30.",
      "十二時半にパンを買って、一時までに払います。",
      "十二時半に二百五十円で買います。",
      "二時に二百五十円で買います。",
      "Die Frist endet um 13 Uhr."
    ],
    "pedagogy": "商品の値段・割引の対象・払う時刻は別の条件。"
  }
] satisfies P50RawMission[];
export const p50MissionsC=p50CorpusC.map(authoredP50Mission);
