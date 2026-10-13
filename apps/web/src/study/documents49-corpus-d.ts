import {authoredP49Document,type P49RawDocument} from "./documents49-types";
/** Eight original A2 event/registration/source-limited everyday documents. */
export const p49CorpusD=[
  {
    "id": "conference-entry-pass",
    "genre": "ticket",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "市民講演会の参加券",
    "purpose": "Kostenloses Ticket, beschränkte Plätze und notwendige Einlasszeit lesen",
    "audience": "Vortragsgäste",
    "issuer": "市民ホール",
    "blocks": [
      "市民講演会　参加券　番号：A-042　十月十七日（土）",
      "講演：午後二時〜三時半　受付：午後一時半〜一時五十分",
      "参加費は無料です。会場の席は指定されていません。受付は一時五十分に終わります。途中から入ることはできません。"
    ],
    "terms": [
      [
        "講演",
        "こうえん",
        "Vortrag",
        "講演：午後二時"
      ],
      [
        "指定",
        "してい",
        "festgelegt/zugewiesen",
        "指定されていません"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann beginnt der Vortrag?",
        "午後二時です。",
        "二時からです。",
        "午後一時半です。",
        "13:30 ist die Registrierung.",
        "講演：午後二時〜三時半"
      ],
      [
        "condition",
        "Kann man um 14:10 eintreten, wenn der Vortrag läuft?",
        "いいえ、入れません。",
        "途中から入れません。",
        "はい、無料なので入れます。",
        "Später Einlass ist ausgeschlossen.",
        "途中から入ることはできません"
      ],
      [
        "inference",
        "Warum sollte man spätestens 13:50 ankommen?",
        "受付が終わるからです。",
        "一時五十分に受付が終わります。",
        "席が決まっているからです。",
        "Die Registrierung endet um 13:50.",
        "受付は一時五十分に終わります"
      ]
    ],
    "contextNote": "無料 bezieht sich auf den Preis, nicht auf beliebige Einlasszeiten oder Platzwahl.",
    "writing": [
      "Informiere einen Freund: Kostenlos, aber bis 13:50 anmelden.",
      "参加は無料ですが、一時五十分までに受付をしてください。",
      "二時の講演に行きます。一時五十分までに受付します。",
      "二時十分に入ります。",
      "Späte Eintritte sind unzulässig."
    ],
    "returnCue": [
      "Neues Konzertticket: Beginn 19 Uhr, Einlass endet 18:45, danach kein Eintritt. Bestätige rechtzeitige Ankunft.",
      "六時四十五分までに入ります。",
      "七時のコンサートなので、六時半に行きます。",
      "七時十分に入ります。",
      "Einlass endet vor Beginn."
    ]
  },
  {
    "id": "clinic-number-slip",
    "genre": "ticket",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "受付番号と呼び出し方法",
    "purpose": "Wartenummer, Aufruf und Ausnahmesituation unterscheiden",
    "audience": "Besucher einer fiktiven Anmeldung",
    "issuer": "もり受付",
    "blocks": [
      "受付番号　五十二番　受付日：火曜日",
      "呼び出しは番号で行います。五十二番が呼ばれたら二番の窓口へ来てください。",
      "番号を聞き逃した場合は、順番を待たずに係員にお知らせください。番号札は捨てないでください。"
    ],
    "terms": [
      [
        "呼び出し",
        "よびだし",
        "Aufruf",
        "呼び出しは番号で"
      ],
      [
        "窓口",
        "まどぐち",
        "Schalter",
        "二番の窓口"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Nummer hat die Person?",
        "五十二番です。",
        "受付番号は五十二番です。",
        "二番です。",
        "Zwei ist der Schalter, nicht die Wartenummer.",
        "受付番号　五十二番"
      ],
      [
        "condition",
        "Wohin geht man nach dem Aufruf?",
        "二番の窓口です。",
        "二番の窓口へ行きます。",
        "五十二番の窓口です。",
        "Die Schalternummer ist zwei.",
        "二番の窓口へ来てください"
      ],
      [
        "inference",
        "Was tun, wenn man den Aufruf verpasst hat?",
        "係員に知らせます。",
        "番号を聞き逃したら係員に聞きます。",
        "番号札を捨てます。",
        "Bei Verpassen gibt es eine besondere Rückfrage-Regel.",
        "聞き逃した場合は…係員に"
      ]
    ],
    "contextNote": "Die Nummer ist kein garantierter Zeitplan. Keine reale medizinische Anleitung.",
    "writing": [
      "Sage am Schalter, dass du Nummer 52 nicht gehört hast.",
      "五十二番を聞き逃しました。すみません。",
      "五十二番はもう呼ばれましたか。",
      "番号札を捨てました。",
      "Das Blatt soll aufbewahrt werden."
    ],
    "returnCue": [
      "Neues Amt: Wartenummer 73, Schalter 4, Aufruf verpasst. Frage höflich.",
      "七十三番を聞き逃しました。四番の窓口でいいですか。",
      "七十三番はもう呼ばれましたか。",
      "五十二番の二番窓口です。",
      "Neue Nummer und Schalter."
    ]
  },
  {
    "id": "school-trip-consent",
    "genre": "form",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "校外学習の参加確認票",
    "purpose": "Einverständnisformular mit zwei Entscheidungen und Abgabefrist interpretieren",
    "audience": "Eltern und Lernende",
    "issuer": "学校の先生",
    "blocks": [
      "校外学習　十一月十二日（木）午前九時集合",
      "＊生徒名：＿＿　＊参加：□する　□しない（どちらか一つ）",
      "参加する方：昼食は自分で用意してください。アレルギーなど連絡事項があれば下に書いてください。",
      "この用紙を十一月五日（木）までに担任へ提出してください。"
    ],
    "terms": [
      [
        "担任",
        "たんにん",
        "Klassenleitung",
        "担任へ"
      ],
      [
        "提出",
        "ていしゅつ",
        "abgeben",
        "提出してください"
      ]
    ],
    "questions": [
      [
        "locate",
        "Bis wann muss der Zettel abgegeben werden?",
        "十一月五日までです。",
        "十一月五日に先生に出します。",
        "十一月十二日までです。",
        "12. November ist der Ausflug, nicht die Formularfrist.",
        "十一月五日（木）までに"
      ],
      [
        "condition",
        "Wie viele Teilnahmefelder sind anzukreuzen?",
        "一つです。",
        "参加するかしないか一つ選びます。",
        "二つです。",
        "Die Auswahl ist exklusiv.",
        "どちらか一つ"
      ],
      [
        "inference",
        "Wer muss selbst Mittagessen vorbereiten?",
        "参加する人です。",
        "参加する生徒です。",
        "参加しない人だけです。",
        "Die Mittagsregel gilt den Teilnehmenden.",
        "参加する方：昼食は自分で"
      ]
    ],
    "contextNote": "Fiktives Schulformular, kein offizielles Einverständnisdokument; Unterschriftsanforderungen werden nicht behauptet.",
    "writing": [
      "Sage, dass du teilnimmst und eigenes Essen mitbringst.",
      "参加します。昼食を自分で用意します。",
      "参加したいです。お弁当を持って行きます。",
      "参加しませんが、行きます。",
      "Die Entscheidungen widersprechen sich."
    ],
    "returnCue": [
      "Neuer Ausflug 20. November, Zettel bis 10. November, Teilnahme ja. Bestätige.",
      "十一月十日の前に用紙を出して、二十日の校外学習に参加します。",
      "参加するに丸を付けます。",
      "二十日に用紙を出します。",
      "Die Frist liegt vor dem Ausflug."
    ]
  },
  {
    "id": "language-course-survey",
    "genre": "form",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "日本語クラスの希望調査",
    "purpose": "Pflichtfelder, Mehrfachwahl und eine offene Frage unterscheiden",
    "audience": "Kursteilnehmer",
    "issuer": "日本語センター",
    "blocks": [
      "希望調査：＊名前：＿＿　＊今のレベル：□A1　□A2（どちらか一つ）",
      "勉強したいこと（いくつでも）：□会話　□読む　□聞く　□書く",
      "クラスの時間：□午前　□午後（どちらか一つ）",
      "来月のクラスを考えるための調査です。回答しても参加が決まるわけではありません。"
    ],
    "terms": [
      [
        "調査",
        "ちょうさ",
        "Umfrage",
        "希望調査"
      ],
      [
        "回答",
        "かいとう",
        "Antwort",
        "回答しても"
      ]
    ],
    "questions": [
      [
        "locate",
        "Welche Fertigkeiten darf man mehrfach auswählen?",
        "勉強したいことです。",
        "会話や読むことなどです。",
        "レベルです。",
        "Das Level erlaubt nur eine Wahl.",
        "勉強したいこと（いくつでも）"
      ],
      [
        "condition",
        "Wie viele Zeitfenster darf man angeben?",
        "一つです。",
        "午前か午後のどちらかです。",
        "二つです。",
        "Das Formular setzt exklusives Feld.",
        "どちらか一つ"
      ],
      [
        "inference",
        "Ist ein Kursplatz nach Abgabe der Umfrage sicher?",
        "いいえ、決まりません。",
        "回答しても参加は未定です。",
        "はい、必ず入れます。",
        "Umfrage ist kein bestätigter Platz.",
        "参加が決まるわけではありません"
      ]
    ],
    "contextNote": "希望調査 erfasst Präferenzen, nicht verbindliche Anmeldung oder Fortschritt.",
    "writing": [
      "Wähle A2, vormittags, Lesen und Hören als Wünsche.",
      "A2で午前のクラスを希望します。読むことと聞くことを勉強したいです。",
      "A2の朝のクラスで読み聞きの練習を希望します。",
      "参加が必ず決まりました。",
      "Die Umfrage sichert keinen Platz."
    ],
    "returnCue": [
      "Neue Umfrage: Niveau A1, nachmittags, Schreiben und Sprechen. Formuliere Wünsche.",
      "A1で午後を希望します。書くことと話すことを練習したいです。",
      "A1の午後のクラスがいいです。",
      "A2の午前のクラスです。",
      "Die neue Auswahl ist anders."
    ]
  },
  {
    "id": "cultural-club-invite",
    "genre": "invitation",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "地域交流会への招待",
    "purpose": "Teilnahmemöglichkeit, Kosten und individuelle Bedingung verstehen",
    "audience": "Stadtteilbewohner",
    "issuer": "地域交流会",
    "blocks": [
      "交流会へようこそ。九月十九日（土）午後四時から六時まで、公民館の二階で行います。",
      "参加費は無料ですが、飲み物は自分で持って来てください。",
      "最初の三十分は自己紹介、そのあとは自由に話します。途中から来る人は前日の金曜日までに連絡してください。"
    ],
    "terms": [
      [
        "交流会",
        "こうりゅうかい",
        "Austauschtreffen",
        "交流会"
      ],
      [
        "自己紹介",
        "じこしょうかい",
        "Selbstvorstellung",
        "自己紹介"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wo findet das Treffen statt?",
        "公民館の二階です。",
        "公民館の二階で行います。",
        "図書館の一階です。",
        "Die Einladung nennt Gemeindehaus zweiten Stock.",
        "公民館の二階"
      ],
      [
        "condition",
        "Was müssen Leute tun, die später kommen?",
        "金曜日までに連絡します。",
        "前日までに知らせます。",
        "連絡しなくていいです。",
        "Die Nachricht fordert Vorabmeldung.",
        "途中から来る人は前日の金曜日までに連絡"
      ],
      [
        "inference",
        "Kann jemand um 16:40 an der ersten Vorstellungsrunde teilnehmen?",
        "いいえ、もう終わっています。",
        "最初の三十分は終わっています。",
        "はい、六時まで自己紹介です。",
        "16:00–16:30 ist die Vorstellungsrunde.",
        "最初の三十分は自己紹介"
      ]
    ],
    "contextNote": "Die Meldung bei später Ankunft ist eine besondere Bedingung, nicht allgemeine Anmeldung für alle.",
    "writing": [
      "Sage höflich, dass du später ab fünf kommst und dies ankündigst.",
      "五時から参加したいです。遅れるので連絡します。",
      "午後五時ごろ行きます。よろしくお願いします。",
      "四時に自己紹介だけします。",
      "Die Person kommt erst um fünf."
    ],
    "returnCue": [
      "Neues Treffen: ab drei, erste 20 Minuten Vorstellung, du kommst um vier; melde es.",
      "四時から参加します。遅れて行くので、先に連絡します。",
      "午後四時ごろ行きます。",
      "三時の自己紹介に出ます。",
      "Du verpasst den Beginn."
    ]
  },
  {
    "id": "study-group-invitation",
    "genre": "invitation",
    "level": "A2",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "title": "試験前の勉強会",
    "purpose": "Treffort, Material und Anmeldung aus einer Einladung extrahieren",
    "audience": "Studierende",
    "issuer": "学習グループ",
    "blocks": [
      "試験の前に一緒に練習しませんか。来週の水曜日午後五時〜七時、図書館の三階で勉強します。",
      "最初の一時間は問題を解き、最後の一時間は答えを説明します。",
      "申し込みは必要ありませんが、自分のノートと問題集を持って来てください。席は十人分しかありません。"
    ],
    "terms": [
      [
        "問題集",
        "もんだいしゅう",
        "Aufgabensammlung",
        "問題集を持って"
      ],
      [
        "席",
        "せき",
        "Sitzplatz",
        "十人分"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wann werden Lösungen besprochen?",
        "最後の一時間です。",
        "六時から七時までです。",
        "五時から六時です。",
        "Das erste Segment ist zum Lösen.",
        "最後の一時間は答えを説明"
      ],
      [
        "condition",
        "Muss man sich anmelden?",
        "いいえ、必要ありません。",
        "申し込みは要りません。",
        "はい、必要です。",
        "Die Einladung schließt Anmeldepflicht ausdrücklich aus.",
        "申し込みは必要ありません"
      ],
      [
        "inference",
        "Ist Platz für 20 Personen garantiert?",
        "いいえ、十人分だけです。",
        "席は十人分しかありません。",
        "はい、二十人分あります。",
        "Beschränkung: nur zehn Plätze.",
        "席は十人分しかありません"
      ]
    ],
    "contextNote": "Keine Anmeldung bedeutet nicht, dass beliebig viele Plätze vorhanden sind.",
    "writing": [
      "Sage zu und bestätige, dass du Notizen und Aufgaben mitbringst.",
      "水曜日の勉強会に行きます。ノートと問題集を持って行きます。",
      "五時から参加します。ノートを持って行きます。",
      "何も持って行きません。",
      "Material ist erforderlich."
    ],
    "returnCue": [
      "Neue Gruppe: Freitag 16–18 Uhr, Lehrbuch und Stift mitbringen, nur sechs Plätze. Bestätige.",
      "金曜日の四時に教科書とペンを持って行きます。",
      "金曜日に勉強会へ行きます。",
      "水曜日の五時に行きます。",
      "Neue Zeit und Materialien."
    ]
  },
  {
    "id": "lost-found-request",
    "genre": "message",
    "level": "A2",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "title": "忘れ物センターからのメール",
    "purpose": "Merkmale, Unsicherheit und Rückmeldeprozess lesen",
    "audience": "Eigentümer eines verlorenen Gegenstands",
    "issuer": "駅の忘れ物センター",
    "blocks": [
      "お忘れ物のお問い合わせを受け付けました。黒いかばんが二つ届いています。",
      "一つは青いひもがありますが、中は空です。もう一つには赤いノートが入っていますが、ひもがありません。",
      "お客様のかばんかどうかはまだ確認できていません。ほかの特徴があればメールで教えてください。"
    ],
    "terms": [
      [
        "特徴",
        "とくちょう",
        "Merkmal",
        "ほかの特徴"
      ],
      [
        "確認",
        "かくにん",
        "prüfen",
        "確認できていません"
      ]
    ],
    "questions": [
      [
        "locate",
        "Wie viele schwarze Taschen liegen vor?",
        "二つです。",
        "黒いかばんが二つです。",
        "一つです。",
        "Zwei verschiedene Fundstücke.",
        "黒いかばんが二つ届いています"
      ],
      [
        "condition",
        "Was ist beim Fundstück mit blauer Schnur im Inneren?",
        "何もありません。",
        "中は空です。",
        "赤いノートがあります。",
        "Das Heft gehört dem anderen Fundstück.",
        "青いひもがありますが、中は空"
      ],
      [
        "inference",
        "Ist die eigene Tasche schon eindeutig gefunden?",
        "いいえ、確認できていません。",
        "まだわかりません。",
        "はい、青いひもがあるからです。",
        "Keines der beiden Stücke wurde identifiziert.",
        "まだ確認できていません"
      ]
    ],
    "contextNote": "Ein passendes Teilmerkmal genügt nicht für eine sichere Eigentumszuordnung.",
    "writing": [
      "Bitte um erneute Prüfung und nenne ein zusätzliches Merkmal.",
      "もう少し調べていただけますか。私のかばんには白い名前札があります。",
      "かばんの中をもう一度確認してください。",
      "青いひもなら必ず私のです。",
      "Die Herkunft ist noch unsicher."
    ],
    "returnCue": [
      "Neuer Fund: drei ähnliche Jacken, eigene Jacke hat kleinen gelben Knopf. Beschreibe.",
      "私のジャケットには小さい黄色いボタンがあります。",
      "黄色いボタンが付いているジャケットです。",
      "黒いかばんに青いひもがあります。",
      "Das neue Merkmal ist der Knopf."
    ]
  },
  {
    "id": "community-project-update",
    "genre": "public-info",
    "level": "A2",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "title": "図書館の開館時間を考える",
    "purpose": "Probelauf und noch unentschiedene Dauerregelung lesen",
    "audience": "Bibliotheksbesucher",
    "issuer": "町立図書館",
    "blocks": [
      "図書館の利用者が増えたため、開館時間を長くする方法を考えています。",
      "来月は試しに土曜日だけ午後七時まで開けます。平日はこれまでどおりです。",
      "土曜日の利用者数を調べてから、来年も続けるか決めます。毎日夜まで開くことはまだ決まっていません。"
    ],
    "terms": [
      [
        "利用者",
        "りようしゃ",
        "Nutzer",
        "利用者が増えた"
      ],
      [
        "試しに",
        "ためしに",
        "probeweise",
        "試しに土曜日"
      ]
    ],
    "questions": [
      [
        "locate",
        "An welchem Wochentag wird probeweise länger geöffnet?",
        "土曜日です。",
        "来月の土曜日だけです。",
        "毎日です。",
        "Der Test betrifft nur Samstag.",
        "土曜日だけ午後七時まで"
      ],
      [
        "condition",
        "Sind die Werktagszeiten während des Versuchs länger?",
        "いいえ、そのままです。",
        "平日は変わりません。",
        "はい、平日も七時までです。",
        "Werktage ausdrücklich unverändert.",
        "平日はこれまでどおり"
      ],
      [
        "inference",
        "Ist eine dauerhafte tägliche Abendöffnung beschlossen?",
        "いいえ、まだ決まっていません。",
        "毎日開けるかは未定です。",
        "はい、来年から毎日です。",
        "Die Entscheidung wird erst nach Auswertung getroffen.",
        "毎日夜まで開くことはまだ決まっていません"
      ]
    ],
    "contextNote": "試しに und まだ決まっていません signalisieren Probebetrieb statt Zusage.",
    "writing": [
      "Informiere sachlich über den Test ohne eine dauerhafte Änderung zu behaupten.",
      "来月は土曜日だけ七時まで開きますが、そのあとはまだ決まっていません。",
      "土曜日の開館時間を試しに長くします。",
      "来年は毎日七時まで開きます。",
      "Der Dauerbetrieb ist noch offen."
    ],
    "returnCue": [
      "Neues Schwimmbad: testweise Sonntag bis 20 Uhr, alle anderen Tage gleich, dauerhafte Änderung offen. Informiere.",
      "日曜日だけ試しに八時まで開きます。ほかの曜日は変わりません。",
      "毎日の延長はまだ決まっていません。",
      "毎日八時まで開きます。",
      "Der Versuch gilt nur Sonntag."
    ]
  }
] satisfies P49RawDocument[];
export const p49DocumentsD=p49CorpusD.map(authoredP49Document);
