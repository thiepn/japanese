import {authoredP50Mission,type P50RawMission} from "./integrated50-types";
/** Five original substantial A2 cross-modal verification and conditional-comprehension missions. */
export const p50CorpusD=[
  {
    "id": "library-trial-hours",
    "title": "Bibliotheksöffnungszeiten als Test",
    "level": "A2",
    "genre": "study",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "situation": "Eine öffentliche Ankündigung und ein Audiointerview unterscheiden eine befristete Öffnung von einem noch offenen Plan.",
    "goal": "Sicheren Probelauf von spekulativer Dauerlösung trennen",
    "readLabel": "Bibliotheksankündigung",
    "readGenre": "notice",
    "reading": [
      "来月は試しに土曜日だけ午後七時まで開けます。",
      "月曜日から金曜日は今までどおり午後五時までです。日曜日は休みです。"
    ],
    "readingGerman": "Nächsten Monat versuchsweise samstags bis 19 Uhr, Mo–Fr bis 17 Uhr wie bisher, sonntags geschlossen.",
    "spokenContext": "Kurzes Gespräch mit der Bibliotheksleitung",
    "listening": [
      [
        "記者",
        "これから毎日七時まで開くんですか。",
        "Ist die Bibliothek jetzt jeden Tag bis sieben geöffnet?"
      ],
      [
        "館長",
        "いいえ。まず土曜日の利用者を調べます。",
        "Nein, wir prüfen zunächst die Besucherzahlen am Samstag."
      ],
      [
        "館長",
        "その結果を見てから、続けるかどうか決めます。",
        "Erst nach der Auswertung wird über Fortsetzung entschieden."
      ],
      [
        "記者",
        "つまり、来年の予定はまだ決まっていないんですね。",
        "Also ist nächstes Jahr noch offen?"
      ],
      [
        "館長",
        "はい、まだ未定です。",
        "Ja, noch unentschieden."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Tage bleiben unter der Woche bis 17 Uhr geöffnet?",
        "月曜日から金曜日です。",
        "平日は五時までです。",
        "土曜日だけです。",
        "Samstag hat gerade die Ausnahme bis 19 Uhr.",
        [
          [
            "reading",
            "月曜日から金曜日は…午後五時",
            "Regel"
          ]
        ]
      ],
      [
        "correction",
        "Ist die tägliche Öffnung bis 19 Uhr bereits beschlossen?",
        "いいえ、土曜日だけです。",
        "来月は土曜日だけ七時までです。",
        "はい、毎日です。",
        "Die Nachfrage im Interview wird ausdrücklich verneint.",
        [
          [
            "reading",
            "土曜日だけ午後七時",
            "befristet"
          ],
          [
            "listening",
            "いいえ。まず土曜日",
            "Korrektur"
          ]
        ]
      ],
      [
        "inference",
        "Ist der verlängerte Samstag für das nächste Jahr garantiert?",
        "いいえ、まだ未定です。",
        "結果を見てから決めます。",
        "はい、来年も必ず続きます。",
        "Die Entscheidung folgt erst nach Beobachtung.",
        [
          [
            "listening",
            "結果を見てから",
            "Bedingung"
          ],
          [
            "listening",
            "まだ未定",
            "Unsicherheit"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "試しに",
        "ためしに",
        "probeweise",
        "reading: 試しに"
      ],
      [
        "未定",
        "みてい",
        "noch nicht entschieden",
        "listening: 未定"
      ]
    ],
    "writing": [
      "Schreibe eine sachliche Nachricht ohne dauerhafte Zusage.",
      "来月は土曜日だけ七時まで開きますが、来年はまだ決まっていません。",
      "土曜日の延長は試しなので、続くかは未定です。",
      "来年から毎日七時までです。",
      "Der längerfristige Plan ist offen."
    ],
    "transfer": [
      "Neue Gemeinde: Schwimmbad öffnet probeweise sonntags bis 20 Uhr, Montag unverändert, Dauerregel noch offen. Informiere.",
      "日曜日は試しに八時まで開きますが、続くかどうかは未定です。",
      "月曜日は今までどおりです。",
      "これから毎日八時まで開きます。",
      "Eine testweise Öffnung ist kein Dauerbeschluss."
    ],
    "pedagogy": "未定を確定事項として伝えない。文字情報の期間と話し手の不確実性を両方重視する。"
  },
  {
    "id": "restaurant-diet",
    "title": "Speisekarte und Küchenrückfrage",
    "level": "A2",
    "genre": "service",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "situation": "Die schriftliche Karte benennt Zutaten; im Gespräch klärt die Bedienung mögliche Veränderungen.",
    "goal": "Zutaten, erlaubte Änderungen und unbekannte Risiken getrennt behandeln",
    "readLabel": "Mittagskarte",
    "readGenre": "menu",
    "reading": [
      "野菜スープ定食　八百円（牛乳を使っています）。",
      "魚定食　千円（小麦を使ったたれが付いています）。",
      "飲み物はお茶です。"
    ],
    "readingGerman": "Gemüsesuppe mit Milch 800 Yen, Fischset mit weizenhaltiger Soße 1000 Yen, Getränke: Tee.",
    "spokenContext": "Auskunft der Bedienung auf Nachfrage",
    "listening": [
      [
        "客",
        "魚の定食で、たれを別にできますか。",
        "Kann ich beim Fischset die Soße separat erhalten?"
      ],
      [
        "店員",
        "はい、たれは別のお皿にできます。",
        "Ja, Soße auf einem separaten Teller."
      ],
      [
        "客",
        "それなら小麦は入っていませんか。",
        "Dann enthält das Gericht keinen Weizen?"
      ],
      [
        "店員",
        "ほかの材料については今、確認できません。料理を作る人に聞きます。",
        "Weitere Zutaten kann ich noch nicht bestätigen; ich frage die Küche."
      ],
      [
        "客",
        "わかりました。注文する前に教えてください。",
        "Danke, bitte vor der Bestellung Bescheid geben."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Speise enthält ausdrücklich Milch?",
        "野菜スープ定食です。",
        "野菜スープには牛乳が入っています。",
        "魚定食です。",
        "Milch ist bei der Suppe ausgewiesen.",
        [
          [
            "reading",
            "野菜スープ定食…牛乳",
            "Zutat"
          ]
        ]
      ],
      [
        "correction",
        "Ist die Soße auf einem separaten Teller möglich?",
        "はい、できます。",
        "たれは別のお皿にできます。",
        "いいえ、絶対にできません。",
        "Der Mitarbeiter sagt eine getrennte Servierweise zu.",
        [
          [
            "reading",
            "小麦を使ったたれ",
            "Soße"
          ],
          [
            "listening",
            "たれは別のお皿にできます",
            "Zusage"
          ]
        ]
      ],
      [
        "inference",
        "Darf man daraus schließen, dass das Fischgericht sicher weizenfrei ist?",
        "いいえ、まだ確認できません。",
        "材料を確認してもらう必要があります。",
        "はい、絶対に小麦がありません。",
        "Eine separat servierte Soße ist keine vollständige Allergenauskunft.",
        [
          [
            "listening",
            "ほかの材料については今、確認できません",
            "Unkenntnis"
          ],
          [
            "listening",
            "料理を作る人に聞きます",
            "Abklärung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "材料",
        "ざいりょう",
        "Zutaten",
        "listening: 材料"
      ],
      [
        "小麦",
        "こむぎ",
        "Weizen",
        "reading: 小麦"
      ]
    ],
    "writing": [
      "Bitte vor der Bestellung um verbindliche Klärung der Zutaten.",
      "注文する前に材料を確認していただけますか。",
      "ほかに小麦が入っているか教えてください。",
      "たれを別にすれば必ず安全ですね。",
      "Zutaten sind noch nicht vollständig bestätigt."
    ],
    "transfer": [
      "Neues Lokal: Salat hat Erdnüsse, Dressing separat möglich, andere Zutaten unbestätigt. Bitte vor Bestellung um Klärung.",
      "注文前にピーナッツがほかにも入っているか確認してください。",
      "材料について教えていただけますか。",
      "ドレッシングを別にすれば必ず安全です。",
      "Eine getrennte Beilage garantiert keine Allergenfreiheit."
    ],
    "pedagogy": "料理の分離と全材料の確認を混同しない。架空の教材であり、安全性の保証ではない。"
  },
  {
    "id": "ferry-cancellation",
    "title": "Fähre: Ausfall, Ersatz und verbleibende Unsicherheit",
    "level": "A2",
    "genre": "travel",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "situation": "Ein Fährticket und eine Hafenansage ermöglichen eine Ersatzfahrt, garantieren aber nicht deren genaue Zeit.",
    "goal": "Bekannten Ausfall von unsicherer Ersatzabfahrt unterscheiden",
    "readLabel": "Fährreservierung",
    "readGenre": "ticket",
    "reading": [
      "青島行き　土曜日　午前九時発。",
      "乗船券一枚。座席：十二番。出発十五分前に港へ来てください。"
    ],
    "readingGerman": "Samstag 9 Uhr nach Aoshima, Sitz 12; 15 Minuten vor Abfahrt erscheinen.",
    "spokenContext": "Hafendurchsage mit Rückfragen",
    "listening": [
      [
        "放送",
        "強い風のため、九時の便は欠航になりました。",
        "Die 9-Uhr-Fahrt fällt wegen Wind aus."
      ],
      [
        "放送",
        "十一時発の便を用意する予定ですが、まだ決まっていません。",
        "Eine Ersatzfahrt um elf ist geplant, aber noch nicht bestätigt."
      ],
      [
        "乗客",
        "この九時の切符は使えますか。",
        "Kann ich das alte Neunuhrticket nutzen?"
      ],
      [
        "係員",
        "はい。切符はそのまま使えます。ただし、出発前に時間を確認してください。",
        "Ja, Ticket bleibt gültig; Abfahrt vorher prüfen."
      ],
      [
        "乗客",
        "わかりました。十一時の便が出るか確認します。",
        "Ich prüfe, ob die Fahrt um elf wirklich stattfindet."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Fahrt ist sicher ausgefallen?",
        "九時の便です。",
        "午前九時の船は欠航です。",
        "十一時の便です。",
        "Elf Uhr ist nur vorläufig geplant.",
        [
          [
            "reading",
            "午前九時発",
            "ursprünglich"
          ],
          [
            "listening",
            "九時の便は欠航",
            "sicherer Ausfall"
          ]
        ]
      ],
      [
        "correction",
        "Ist das alte Ticket automatisch ungültig?",
        "いいえ、そのまま使えます。",
        "切符は使えます。",
        "はい、新しい切符が必要です。",
        "Der Mitarbeiter bestätigt Weitergeltung.",
        [
          [
            "reading",
            "乗船券一枚",
            "altes Ticket"
          ],
          [
            "listening",
            "切符はそのまま使えます",
            "aktuell gültig"
          ]
        ]
      ],
      [
        "inference",
        "Kannst du eine garantiert pünktliche Abfahrt um elf versprechen?",
        "いいえ、まだ決まっていません。",
        "十一時の便は未定です。",
        "はい、必ず出ます。",
        "Eine geplante Ersatzfahrt ist noch keine bestätigte Abfahrt.",
        [
          [
            "listening",
            "用意する予定",
            "Absicht"
          ],
          [
            "listening",
            "まだ決まっていません",
            "Unsicherheit"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "欠航",
        "けっこう",
        "Ausfall einer Verbindung",
        "listening: 欠航"
      ],
      [
        "乗船券",
        "じょうせんけん",
        "Schiffsticket",
        "reading: 乗船券"
      ]
    ],
    "writing": [
      "Schreibe an Freunde, was sicher ist und was noch geprüft werden muss.",
      "九時の船は欠航です。十一時の便はまだ決まっていないので、確認します。",
      "切符は使えますが、出発時間は未定です。",
      "十一時に必ず出ます。",
      "Die Ersatzfahrt ist nicht bestätigt."
    ],
    "transfer": [
      "Neuer Flug: 8-Uhr-Flug sicher abgesagt, 10:30-Ersatz nur möglich, Ticket bleibt gültig. Informiere ohne falsche Gewissheit.",
      "八時の便は欠航です。十時半の便はまだ未定ですが、切符は使えます。",
      "十時半に飛ぶか確認します。",
      "十時半に必ず出発します。",
      "Die Ersatzoption ist ungewiss."
    ],
    "pedagogy": "発券情報の確実な部分と案内の未決定部分を分離する。"
  },
  {
    "id": "housing-inspection",
    "title": "Wohnungsanzeige und Rückruf mit Ausnahmetermin",
    "level": "A2",
    "genre": "service",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Eine Wohnungsanzeige nennt allgemeine Besichtigungen; der Anruf schließt einen Tag kurzfristig aus.",
    "goal": "Buchungsbedarf, separat zu zahlende Kosten und Ausnahmetermin verbinden",
    "readLabel": "Fiktive Zimmeranzeige",
    "readGenre": "advertisement",
    "reading": [
      "駅から徒歩十二分。家賃は月五万円（水道代を含みます）。電気代とインターネット代は別です。",
      "見学：火曜日・木曜日の午後三時〜六時。前日までにメールで予約してください。"
    ],
    "readingGerman": "12 Minuten zum Bahnhof, 50.000 Yen monatlich inkl. Wasser, Strom/Internet extra; Besichtigungen Di/Do 15–18 Uhr mit Vorabmail.",
    "spokenContext": "Telefonische Auskunft",
    "listening": [
      [
        "担当者",
        "今週の木曜日は工事のため見学できません。",
        "Diesen Donnerstag keine Besichtigung wegen Bauarbeiten."
      ],
      [
        "担当者",
        "来週の火曜日なら午後四時が空いています。",
        "Nächsten Dienstag um 16 Uhr ist frei."
      ],
      [
        "客",
        "では、その時間で予約できますか。",
        "Kann ich die Zeit verbindlich buchen?"
      ],
      [
        "担当者",
        "はい。お名前を教えていただければ予約します。",
        "Ja, mit Ihrem Namen kann ich reservieren."
      ],
      [
        "客",
        "わかりました。メールで名前を送ります。",
        "Okay, ich schicke meinen Namen per Mail."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Kosten sind ausdrücklich in der Miete enthalten?",
        "水道代です。",
        "水道代は含まれています。",
        "インターネット代です。",
        "Internet ist separat.",
        [
          [
            "reading",
            "水道代を含みます",
            "inklusive"
          ]
        ]
      ],
      [
        "correction",
        "Kann die Person diesen Donnerstag zum Anzeigentermin kommen?",
        "いいえ、見学できません。",
        "今週の木曜日は工事で休みです。",
        "はい、四時なら可能です。",
        "Die aktuelle Nachricht setzt die allgemeine Donnerstagsregel für diese Woche außer Kraft.",
        [
          [
            "reading",
            "木曜日の午後三時〜六時",
            "allgemein"
          ],
          [
            "listening",
            "今週の木曜日は…見学できません",
            "Ausnahme"
          ]
        ]
      ],
      [
        "inference",
        "Ist der nächste Dienstag um 16 Uhr bereits gebucht, bevor der Name übermittelt wird?",
        "いいえ、まだです。",
        "名前を伝えて予約します。",
        "はい、もう予約済みです。",
        "Die Zusage steht unter der Bedingung, den Namen anzugeben.",
        [
          [
            "listening",
            "お名前を教えていただければ予約します",
            "Bedingung"
          ],
          [
            "listening",
            "名前を送ります",
            "künftige Handlung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "家賃",
        "やちん",
        "Miete",
        "reading: 家賃"
      ],
      [
        "見学",
        "けんがく",
        "Besichtigung",
        "reading: 見学"
      ]
    ],
    "writing": [
      "Schreibe eine E-Mail mit Bitte um Dienstag 16 Uhr und gib einen Beispielnamen an.",
      "来週の火曜日の午後四時に見学したいです。名前は田中です。",
      "田中です。来週火曜日の四時に予約をお願いします。",
      "今週木曜日に見学します。",
      "Dieser Donnerstag ist gesperrt."
    ],
    "transfer": [
      "Neue Besichtigung: normale Freitage, dieser Freitag abgesagt, Montag 15 Uhr möglich nach Namensnennung. Bitte um Termin.",
      "月曜日の三時に見学したいです。名前は山田です。",
      "山田です。月曜日の午後三時に予約できますか。",
      "今週金曜日に行きます。",
      "Die Freitagssperre gilt weiterhin."
    ],
    "pedagogy": "空いている時間は予約確定ではない。物件の費用条件も継続して読む。"
  },
  {
    "id": "language-exchange",
    "title": "Sprachtandem: Vorschlag wird angenommen",
    "level": "A2",
    "genre": "social",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Eine Gruppennachricht und ein gesprochenes Gespräch legen den aktuellen Treffpunkt fest.",
    "goal": "Nicht angenommenen Vorschlag von bestätigter Ortsänderung unterscheiden",
    "readLabel": "Sprachtandem-Kalender",
    "readGenre": "schedule",
    "reading": [
      "木曜日の午後五時、図書館の入り口で会話練習。",
      "持ち物：ノートとペン。練習時間は一時間。"
    ],
    "readingGerman": "Donnerstag 17 Uhr vor der Bibliothek, Gespräch eine Stunde, Heft und Stift.",
    "spokenContext": "Sprachpartner tauschen sich telefonisch aus",
    "listening": [
      [
        "けん",
        "図書館の入り口は工事中らしいですね。駅のカフェで会うのはどうですか。",
        "Der Bibliothekseingang soll wegen Bauarbeiten betroffen sein; wie wäre das Bahnhofscafé?"
      ],
      [
        "まい",
        "カフェなら行きやすいです。でも、何時にしましょうか。",
        "Café ist praktisch, aber welche Uhrzeit?"
      ],
      [
        "けん",
        "五時のままでいいですか。",
        "Bleibt es bei fünf?"
      ],
      [
        "まい",
        "はい。駅の北口のカフェで五時に会いましょう。",
        "Ja, Bahnhofscafé am Nordausgang um fünf."
      ],
      [
        "けん",
        "わかりました。ノートとペンも持って行きます。",
        "Okay, Heft und Stift bleiben dabei."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche Dinge sollten mitgebracht werden?",
        "ノートとペンです。",
        "ノートとペンを持って行きます。",
        "本だけです。",
        "Beide Quellen bestätigen das Lernmaterial.",
        [
          [
            "reading",
            "ノートとペン",
            "erste Liste"
          ],
          [
            "listening",
            "ノートとペンも持って行きます",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wo treffen sie sich jetzt?",
        "駅の北口のカフェです。",
        "駅の北口のカフェで会います。",
        "図書館の入り口です。",
        "Der Vorschlag wird erst mit Mais Zustimmung verbindlich.",
        [
          [
            "reading",
            "図書館の入り口",
            "alt"
          ],
          [
            "listening",
            "北口のカフェで五時に会いましょう",
            "vereinbart"
          ]
        ]
      ],
      [
        "inference",
        "Ist aus dem gesprochenen Gespräch sicher, dass der Bibliothekseingang wirklich gesperrt ist?",
        "いいえ、まだ確かではありません。",
        "工事中らしいだけです。",
        "はい、絶対に閉まっています。",
        "らしい signalisiert Hörensagen, obwohl die Treffänderung bestätigt ist.",
        [
          [
            "listening",
            "工事中らしい",
            "Hörensagen"
          ],
          [
            "listening",
            "カフェで五時に会いましょう",
            "Treffentscheidung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "工事中",
        "こうじちゅう",
        "im Bau",
        "listening: 工事中らしい"
      ],
      [
        "練習時間",
        "れんしゅうじかん",
        "Übungsdauer",
        "reading: 練習時間"
      ]
    ],
    "writing": [
      "Bestätige den neuen Ort und die weiterhin gültige Uhrzeit.",
      "木曜日の五時に駅の北口のカフェで会いましょう。",
      "木曜日の五時にカフェに行きます。ノートも持って行きます。",
      "図書館で会いましょう。",
      "Die Verabredung wurde gemeinsam geändert."
    ],
    "transfer": [
      "Neues Treffen: ursprünglich Park, jemand schlägt Gemeindehaus vor, andere Person stimmt zu; Samstag 13 Uhr unverändert. Bestätige.",
      "土曜日の一時に公民館で会いましょう。",
      "土曜日の午後一時に公民館に行きます。",
      "公園で会います。",
      "Der geänderte Ort wurde angenommen."
    ],
    "pedagogy": "うわさの確実性と、二人が合意した待ち合わせの確実性は別に評価する。"
  }
] satisfies P50RawMission[];
export const p50MissionsD=p50CorpusD.map(authoredP50Mission);
