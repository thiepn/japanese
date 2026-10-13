import {authoredP50Mission,type P50RawMission} from "./integrated50-types";
/** Five independent cross-modal everyday missions from A1 to A2. */
export const p50CorpusB=[
  {
    "id": "flower-shop",
    "title": "Flower delivery: Farbe und Lieferzeit",
    "level": "A1",
    "genre": "shopping",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Eine schriftliche Bestellung wird kurz vor der Lieferung telefonisch korrigiert.",
    "goal": "Letzte gültige Ware und Lieferzeit kombinieren",
    "readLabel": "Blumenbestellung",
    "readGenre": "order",
    "reading": [
      "花束：赤いバラ五本。",
      "配達：金曜日、午後二時〜四時。送り先：山田さん。"
    ],
    "readingGerman": "Fünf rote Rosen für Yamada, Freitag zwischen 14 und 16 Uhr.",
    "spokenContext": "Nachricht vom Blumenladen",
    "listening": [
      [
        "店員",
        "ご注文の赤いバラが今日は足りません。",
        "Heute sind nicht genug rote Rosen da."
      ],
      [
        "店員",
        "黄色いバラ五本なら用意できます。値段は同じです。",
        "Fünf gelbe Rosen zum selben Preis verfügbar."
      ],
      [
        "客",
        "では、黄色いバラにしてください。",
        "Dann bitte gelbe Rosen."
      ],
      [
        "店員",
        "金曜日の三時ごろに山田さんへ届けます。",
        "Wir liefern Freitag etwa um drei an Yamada."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie viele Rosen werden am Ende geliefert?",
        "五本です。",
        "バラを五本です。",
        "三本です。",
        "Die Anzahl bleibt in beiden Quellen fünf.",
        [
          [
            "reading",
            "赤いバラ五本",
            "ursprüngliche Menge"
          ],
          [
            "listening",
            "黄色いバラ五本",
            "gültige Menge"
          ]
        ]
      ],
      [
        "correction",
        "Welche Farbe ist jetzt bestellt?",
        "黄色いバラです。",
        "黄色に変えます。",
        "赤いバラです。",
        "Der Kunde akzeptiert die angebotene Alternative.",
        [
          [
            "reading",
            "赤いバラ",
            "alte Farbe"
          ],
          [
            "listening",
            "黄色いバラにしてください",
            "neue Farbe"
          ]
        ]
      ],
      [
        "inference",
        "Ist Freitag um 15 Uhr mit der bestätigten Zustellzeit vereinbar?",
        "はい、三時ごろです。",
        "金曜日の三時ごろです。",
        "いいえ、日曜日です。",
        "Die mündliche Bestätigung präzisiert das zuvor breitere Zeitfenster.",
        [
          [
            "reading",
            "午後二時〜四時",
            "Zeitfenster"
          ],
          [
            "listening",
            "三時ごろ",
            "aktuell erwartete Zeit"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "花束",
        "はなたば",
        "Blumenstrauß",
        "reading: 花束"
      ],
      [
        "届ける",
        "とどける",
        "liefern",
        "listening: 届けます"
      ]
    ],
    "writing": [
      "Schreibe dem Empfänger, was wann geliefert wird.",
      "金曜日の三時ごろに黄色いバラ五本が届きます。",
      "金曜日に黄色い花束が届きます。",
      "赤いバラを送ります。",
      "Die Farbe wurde geändert."
    ],
    "transfer": [
      "Neue Lieferung: Weiße Tulpen sechs statt rosa, Lieferung Dienstag etwa elf. Informiere.",
      "火曜日の十一時ごろに白いチューリップ六本が届きます。",
      "白いチューリップを火曜日に送ります。",
      "黄色いバラを金曜日に送ります。",
      "Neue Farbe, Blumensorte und Tag."
    ],
    "pedagogy": "注文書を読み、音声の代替案と受諾によって有効な品物を更新する。"
  },
  {
    "id": "sports-club",
    "title": "Sportverein: Training im Innenraum",
    "level": "A1",
    "genre": "community",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Ein gedruckter Kurszettel und eine Sprachnachricht nennen unterschiedliche Übungsorte.",
    "goal": "Absage von Ortswechsel unterscheiden",
    "readLabel": "Trainingszettel",
    "readGenre": "notice",
    "reading": [
      "土曜日は公園でサッカーを練習します。午後四時〜五時半。",
      "持ち物：運動靴、水、タオル。"
    ],
    "readingGerman": "Samstag Fußball im Park 16 bis 17:30, Schuhe, Wasser, Handtuch mitbringen.",
    "spokenContext": "Sprachnachricht des Trainers",
    "listening": [
      [
        "先生",
        "土曜日は雨が降りそうです。",
        "Samstag könnte es regnen."
      ],
      [
        "先生",
        "練習は中止しませんが、公園から学校の体育館に変えます。",
        "Training nicht abgesagt, aber in die Turnhalle verlegt."
      ],
      [
        "先生",
        "時間は同じです。体育館では上履きを使ってください。",
        "Zeit unverändert, Hallenschuhe nötig."
      ],
      [
        "選手",
        "わかりました。上履きも持って行きます。",
        "Verstanden, ich bringe Hallenschuhe mit."
      ]
    ],
    "questions": [
      [
        "detail",
        "Um wie viel Uhr beginnt das Training?",
        "午後四時です。",
        "四時からです。",
        "午後五時半です。",
        "17:30 bezeichnet das Ende.",
        [
          [
            "reading",
            "午後四時〜五時半",
            "Zeit"
          ],
          [
            "listening",
            "時間は同じです",
            "unverändert"
          ]
        ]
      ],
      [
        "correction",
        "Wo findet das Training statt?",
        "学校の体育館です。",
        "体育館で練習します。",
        "公園です。",
        "Der Trainer verlegt ausdrücklich, statt abzusagen.",
        [
          [
            "reading",
            "公園でサッカー",
            "alter Ort"
          ],
          [
            "listening",
            "学校の体育館に変えます",
            "neuer Ort"
          ]
        ]
      ],
      [
        "inference",
        "Was ist zusätzlich zu den zuerst aufgelisteten Sachen nötig?",
        "上履きです。",
        "体育館の靴が必要です。",
        "雨傘を持って行きます。",
        "Der Innenraum erfordert eigene Hallenschuhe.",
        [
          [
            "reading",
            "運動靴、水、タオル",
            "alte Materialliste"
          ],
          [
            "listening",
            "上履きを使ってください",
            "neue Ergänzung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "中止",
        "ちゅうし",
        "Absage",
        "listening: 中止しません"
      ],
      [
        "上履き",
        "うわばき",
        "Hallenschuhe",
        "listening: 上履きを"
      ]
    ],
    "writing": [
      "Bestätige, dass du in die Turnhalle gehst und Hallenschuhe mitbringst.",
      "四時に体育館に行き、上履きを持って行きます。",
      "土曜日は体育館で練習します。上履きも必要です。",
      "土曜日は中止です。",
      "Der Kurs findet statt."
    ],
    "transfer": [
      "Neue Sportgruppe: Sonntags Yoga im Garten bei Kälte in Klassenraum, Beginn 10 Uhr gleich, Matte mitnehmen.",
      "日曜日の十時に教室へ行き、マットを持って行きます。",
      "十時から教室でヨガをします。",
      "庭で練習します。",
      "Der neue Treffort ist drinnen."
    ],
    "pedagogy": "雨が降りそうと決定した移動を混同しない。"
  },
  {
    "id": "grocery-quantity",
    "title": "Supermarktbestellung und telefonische Mengenänderung",
    "level": "A1",
    "genre": "shopping",
    "units": [
      "p25:shopping",
      "p23:ownership"
    ],
    "situation": "Die Einkaufsliste eines Nachbarn wird telefonisch teilweise korrigiert.",
    "goal": "Bestätigte Menge statt ursprünglicher Liste wählen",
    "readLabel": "Einkaufszettel",
    "readGenre": "list",
    "reading": [
      "りんご三つ、バナナ二本、牛乳一本を買ってください。",
      "予算は千円ぐらいです。"
    ],
    "readingGerman": "Bitte drei Äpfel, zwei Bananen und eine Milch kaufen, Budget etwa 1000 Yen.",
    "spokenContext": "Telefonanruf des Nachbarn",
    "listening": [
      [
        "友だち",
        "ごめん。りんごは二つでいいよ。",
        "Entschuldigung, zwei Äpfel reichen."
      ],
      [
        "友だち",
        "バナナ二本はそのままでお願いします。",
        "Zwei Bananen bleiben."
      ],
      [
        "友だち",
        "牛乳は今日は買わないで。冷蔵庫に一本あったんだ。",
        "Heute keine Milch; eine war noch im Kühlschrank."
      ],
      [
        "買う人",
        "りんご二つとバナナ二本だけだね。",
        "Also zwei Äpfel und zwei Bananen."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wie viele Bananen sollst du kaufen?",
        "二本です。",
        "バナナ二本です。",
        "三本です。",
        "Die Menge bleibt gleich.",
        [
          [
            "reading",
            "バナナ二本",
            "Liste"
          ],
          [
            "listening",
            "そのままで",
            "Bestätigung"
          ]
        ]
      ],
      [
        "correction",
        "Wie viele Äpfel werden am Ende gekauft?",
        "二つです。",
        "りんごを二つです。",
        "三つです。",
        "Der Anruf ersetzt drei durch zwei.",
        [
          [
            "reading",
            "りんご三つ",
            "alt"
          ],
          [
            "listening",
            "りんごは二つでいい",
            "neu"
          ]
        ]
      ],
      [
        "inference",
        "Soll heute Milch gekauft werden?",
        "いいえ、買いません。",
        "牛乳は要りません。",
        "はい、一本です。",
        "Der Nachbar widerruft ausdrücklich den Milchposten.",
        [
          [
            "reading",
            "牛乳一本",
            "alt"
          ],
          [
            "listening",
            "今日は買わないで",
            "neu"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "予算",
        "よさん",
        "Budget",
        "reading: 予算"
      ],
      [
        "冷蔵庫",
        "れいぞうこ",
        "Kühlschrank",
        "listening: 冷蔵庫"
      ]
    ],
    "writing": [
      "Schicke eine kurze Bestätigung der endgültigen Einkaufsliste.",
      "りんご二つとバナナ二本だけ買います。牛乳は買いません。",
      "りんご二つ、バナナ二本だね。",
      "りんご三つと牛乳を買うよ。",
      "Beide Positionen sind geändert."
    ],
    "transfer": [
      "Neue Liste: Karotten ursprünglich vier, telefonisch auf drei, Brot eins bleibt, Eier gestrichen. Bestätige.",
      "にんじん三本とパン一つだけ買います。卵は買いません。",
      "にんじん三本、パン一つですね。",
      "にんじん四本と卵を買います。",
      "Menge und Streichung sind anders."
    ],
    "pedagogy": "手書きの一覧に後から入る数量訂正を品目別に反映する。"
  },
  {
    "id": "clinic-paperwork",
    "title": "Termin und Dokumente nach Rückruf",
    "level": "A2",
    "genre": "service",
    "units": [
      "p25:appointment",
      "p23:routine"
    ],
    "situation": "Eine fiktive Praxisbestätigung wird durch einen Rückruf mit neuem Termin ergänzt.",
    "goal": "Angebotene Optionen von bestätigter Umbuchung unterscheiden",
    "readLabel": "Terminzettel",
    "readGenre": "booking",
    "reading": [
      "山本さん　木曜日　午前十時　相談窓口二番。",
      "必要な物：予約票、身分証。"
    ],
    "readingGerman": "Yamamoto, Donnerstag 10 Uhr, Beratungsschalter zwei; Buchungsbeleg und Ausweis.",
    "spokenContext": "Aktuelle Voicemail",
    "listening": [
      [
        "受付",
        "木曜日の十時ですが、担当者の予定が変わりました。",
        "Der zuständige Mitarbeiter ist Donnerstag zehn nicht verfügbar."
      ],
      [
        "受付",
        "水曜日の午後三時か、金曜日の午前九時なら空いています。",
        "Mittwoch 15 Uhr oder Freitag 9 Uhr sind frei."
      ],
      [
        "受付",
        "まだ変更していません。火曜日までにご希望を電話で教えてください。",
        "Noch nichts umgebucht; bitte bis Dienstag telefonieren."
      ],
      [
        "受付",
        "持って来る書類は変わりません。",
        "Mitbringunterlagen bleiben gleich."
      ]
    ],
    "questions": [
      [
        "detail",
        "Welche beiden Ersatzzeiten werden angeboten?",
        "水曜日の三時と金曜日の九時です。",
        "水曜日の午後三時か金曜日の午前九時です。",
        "木曜日の十時だけです。",
        "Donnerstag ist nicht mehr verfügbar.",
        [
          [
            "listening",
            "水曜日の午後三時か、金曜日の午前九時",
            "Optionen"
          ]
        ]
      ],
      [
        "correction",
        "Ist Mittwoch bereits fest gebucht?",
        "いいえ、まだ変更していません。",
        "いいえ、電話で選ぶ必要があります。",
        "はい、水曜日になりました。",
        "Eine angebotene Zeit ist kein bestätigter Termin.",
        [
          [
            "reading",
            "木曜日　午前十時",
            "alte Buchung"
          ],
          [
            "listening",
            "まだ変更していません",
            "Status"
          ]
        ]
      ],
      [
        "inference",
        "Muss Yamamoto einen anderen Ausweis mitbringen?",
        "いいえ、書類は同じです。",
        "予約票と身分証のままです。",
        "はい、パスポートだけです。",
        "Die letzte Aussage bewahrt die ursprünglichen Unterlagen.",
        [
          [
            "reading",
            "予約票、身分証",
            "Liste"
          ],
          [
            "listening",
            "書類は変わりません",
            "Bestätigung"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "担当者",
        "たんとうしゃ",
        "zuständige Person",
        "listening: 担当者"
      ],
      [
        "希望",
        "きぼう",
        "Wunsch",
        "listening: ご希望"
      ]
    ],
    "writing": [
      "Rufe zurück und wähle Freitag um neun, mit Bezug auf die Unterlagen.",
      "金曜日の午前九時に変更したいです。書類は同じですね。",
      "金曜日の九時でお願いします。身分証を持って行きます。",
      "水曜日に決まりました。",
      "Es wurde bislang gar kein Termin geändert."
    ],
    "transfer": [
      "Neue Stelle: Montag 14 Uhr fällt aus, Dienstag 11 Uhr oder Mittwoch 16 Uhr angeboten, noch nicht gebucht. Wähle Mittwoch.",
      "水曜日の午後四時でお願いします。変更をお願いできますか。",
      "水曜日の四時に予約したいです。",
      "もう火曜日に決まりました。",
      "Es ist noch eine aktive Wahl nötig."
    ],
    "pedagogy": "旧予約、選択肢、確定済みという三つの状態は別物。"
  },
  {
    "id": "hotel-checkin",
    "title": "Später Check-in mit begrenzter Parkplatzkapazität",
    "level": "A2",
    "genre": "service",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "situation": "Die Bestätigung einer Pension und die gesprochene Anreiseauskunft unterscheiden mehrere Bedingungen.",
    "goal": "Check-in-Fenster und begrenzt verfügbare Zusatzleistung kombinieren",
    "readLabel": "Pensionsmail",
    "readGenre": "email",
    "reading": [
      "ご宿泊ありがとうございます。金曜日から二泊のご予約です。",
      "チェックイン：午後三時〜七時。朝食：朝七時半〜九時。"
    ],
    "readingGerman": "Zwei Nächte ab Freitag. Check-in zwischen 15 und 19 Uhr, Frühstück 7:30 bis 9.",
    "spokenContext": "Telefonische Auskunft der Pension",
    "listening": [
      [
        "受付",
        "七時を過ぎて到着する場合は、当日の五時までにお電話ください。",
        "Bei Ankunft nach 19 Uhr am Anreisetag bis 17 Uhr anrufen."
      ],
      [
        "受付",
        "駐車場は三台分ありますが、予約はできません。",
        "Drei Parkplätze vorhanden, keine Reservierung möglich."
      ],
      [
        "受付",
        "満車でしたら、近くの有料駐車場をご利用ください。",
        "Bei vollem Parkplatz kostenpflichtige Alternative nutzen."
      ],
      [
        "宿泊客",
        "八時ごろ着くので、五時までに電話します。",
        "Ich komme etwa um acht und rufe bis fünf an."
      ]
    ],
    "questions": [
      [
        "detail",
        "Wann endet das normale Check-in-Fenster?",
        "午後七時です。",
        "七時までです。",
        "午後五時です。",
        "17 Uhr ist die Telefonfrist für späte Ankunft.",
        [
          [
            "reading",
            "午後三時〜七時",
            "normaler Check-in"
          ]
        ]
      ],
      [
        "correction",
        "Was muss jemand bei Ankunft um 20 Uhr zusätzlich tun?",
        "午後五時までに電話します。",
        "当日の五時までに連絡します。",
        "八時にそのまま行きます。",
        "Die späte Ankunft aktiviert eine Vorabmeldung.",
        [
          [
            "reading",
            "午後三時〜七時",
            "normales Zeitfenster"
          ],
          [
            "listening",
            "五時までにお電話ください",
            "Sonderregel"
          ]
        ]
      ],
      [
        "inference",
        "Hat ein Übernachtungsgast automatisch einen eigenen Parkplatz?",
        "いいえ、予約できません。",
        "満車かもしれません。",
        "はい、予約済みです。",
        "Parkplätze sind begrenzt und nicht reservierbar.",
        [
          [
            "listening",
            "三台分ありますが、予約はできません",
            "keine Zusage"
          ],
          [
            "listening",
            "満車でしたら",
            "Alternative"
          ]
        ]
      ]
    ],
    "vocabulary": [
      [
        "満車",
        "まんしゃ",
        "Parkplatz voll",
        "listening: 満車"
      ],
      [
        "到着",
        "とうちゃく",
        "Ankunft",
        "listening: 到着する"
      ]
    ],
    "writing": [
      "Bestätige eine Ankunft nach 19 Uhr und dass du vorher anrufst.",
      "金曜日は八時ごろ着きます。五時までに電話します。",
      "八時に到着するので、先に連絡します。",
      "八時に予約なしで駐車できます。",
      "Weder Spätanreise ohne Anruf noch Parkplatz sind garantiert."
    ],
    "transfer": [
      "Neue Unterkunft: Check-in bis 18 Uhr, Ankunft 20:30, Meldung bis 16 Uhr. Formuliere.",
      "八時半に着くので、四時までに電話します。",
      "夜八時半に到着します。先に連絡します。",
      "八時半にそのまま行きます。",
      "Frühzeitige Meldung ist nötig."
    ],
    "pedagogy": "後着時の連絡期限とチェックインの時間を混同せず、駐車場の不確実性も表現する。"
  }
] satisfies P50RawMission[];
export const p50MissionsB=p50CorpusB.map(authoredP50Mission);
