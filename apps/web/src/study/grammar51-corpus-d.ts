import {authoredP51Contrast,type P51RawContrast} from "./grammar51-types";
/** Original P51 D: comparative scope, particles, ability and change of state. */
export const p51CorpusD=[
  [
    "yori-hou",
    "〜より versus 〜のほうが",
    "comparison",
    [
      "p25:shopping",
      "p23:ownership"
    ],
    "電車よりバス",
    "バスのほうが安い",
    "Vergleichsmaßstab markieren",
    "Verglichenes Objekt mit höherem Wert der Eigenschaft hervorheben",
    "Am Bahnhof vergleichst du zwei Verkehrsmittel.",
    "Freund",
    "neutral höflich; meist miteinander verwendet",
    "AよりBのほうが～ bedeutet B ist in der Eigenschaft stärker als A; 〜より benennt A als Maßstab, 〜のほうが B.",
    [
      [
        "電車よりバスのほうが安いです。",
        "Der Bus ist günstiger als der Zug.",
        "Zug ist Maßstab; Bus günstiger."
      ],
      [
        "この本よりあの本のほうが簡単です。",
        "Das Buch dort ist leichter.",
        "Relativer Vergleich."
      ],
      [
        "昨日より今日は暖かいです。",
        "Heute ist es wärmer als gestern.",
        "Vergleich auch ohne ほうが."
      ]
    ],
    "Bei vertauschter Satzreihenfolge weiter dieselbe Bewertungsrichtung annehmen.",
    "Die Orientierung folgt dem genannten Maßstab und Gegenstand.",
    [
      "Vergleiche: Das Fahrrad ist schneller als zu Fuß gehen.",
      "歩くより自転車のほうが速いです。",
      "歩くより自転車で行くほうが速いです。",
      "自転車より歩くほうが速いです。",
      "Das kehrt die Richtung um."
    ],
    [
      "Neue Situation: Das neue Café ist leiser als das alte.",
      "古いカフェより新しいカフェのほうが静かです。",
      "前の店より新しい店のほうが静かです。",
      "新しい店より古い店が静かです。",
      "Das vertauscht die Aussage."
    ],
    "P49 Werbung und P50 Transportabwägung."
  ],
  [
    "ichiban-yori",
    "〜が一番 versus 〜より",
    "comparison",
    [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "この店が一番安い",
    "あの店より安い",
    "Höchstgrad innerhalb einer Gruppe",
    "Relativer Vergleich mit einer einzelnen Referenz",
    "Drei Cafés sind bekannt, aber nur zwei wurden direkt verglichen.",
    "Freund",
    "neutral höflich",
    "一番 braucht einen erschlossenen Vergleichsbereich; より behauptet nur eine Relation. Zwei verglichene Läden reichen nicht für den billigsten von allen.",
    [
      [
        "三つの店の中で、ここが一番安いです。",
        "Unter den drei Läden ist dieser am günstigsten.",
        "Expliziter Bereich."
      ],
      [
        "ここはあの店より安いです。",
        "Dieser Laden ist günstiger als jener.",
        "Nur paarweiser Vergleich."
      ],
      [
        "私はこのケーキが一番好きです。",
        "Ich mag diesen Kuchen am liebsten.",
        "Höchstgrad bei eigener Präferenz."
      ]
    ],
    "Aus einer einzigen Paarrelation einen absoluten Superlativ schließen.",
    "Gib bei Bedarf die Vergleichsmenge an.",
    [
      "Sage: Unter diesen drei Bussen ist Linie zwei am schnellsten.",
      "この三つのバスの中では二番が一番速いです。",
      "三つの中で二番のバスが一番速いです。",
      "二番のバスより一番が速いです。",
      "Das dreht den Favoriten um."
    ],
    [
      "Neuer Kontext: Du weißt nur, dass Buch A einfacher ist als Buch B.",
      "Bの本よりAの本のほうが簡単です。",
      "Aの本はBの本より簡単です。",
      "Aの本が世界で一番簡単です。",
      "Ein globaler Superlativ ist nicht belegt."
    ],
    "P48 Quellenvergleiche ohne unbelegte Verallgemeinerung."
  ],
  [
    "dake-shika",
    "〜だけ versus 〜しか〜ない",
    "comparison",
    [
      "p25:shopping",
      "p23:ownership"
    ],
    "千円だけあります",
    "千円しかありません",
    "Nur eine Menge, neutral begrenzt",
    "Nur diese Menge, oft als mangelhaft empfunden; stets Negation",
    "Beim Einkaufen erklärt eine Person ihr verfügbares Geld.",
    "Freund und Verkäufer",
    "しか benötigt negative Prädikation; Ton kann Einschränkung betonen",
    "だけ ist mit affirmativem Satz möglich, しか verlangt eine negative Form und kann eine als gering wahrgenommene Menge hervorheben.",
    [
      [
        "お金は千円だけあります。",
        "Ich habe nur tausend Yen.",
        "Menge als Grenze."
      ],
      [
        "お金は千円しかありません。",
        "Ich habe bloß tausend Yen.",
        "Knappheit im Kontext."
      ],
      [
        "今日は水だけ飲みます。",
        "Heute trinke ich nur Wasser.",
        "Neutrale Auswahl."
      ]
    ],
    "〜しかあります als zulässige affirmative Form benutzen.",
    "しか verlangt ない, ありません oder eine andere Negationsform.",
    [
      "Du bedauerst, dass nur zwei Karten verfügbar sind.",
      "切符は二枚しかありません。",
      "二枚しか残っていません。",
      "切符は二枚しかあります。",
      "しか kann nicht mit あります affirmativ verbunden werden."
    ],
    [
      "Neuer Kontext: Du bestellst neutral nur grünen Tee.",
      "緑茶だけお願いします。",
      "緑茶だけ飲みます。",
      "緑茶しかあります。",
      "Die しか-Form ist grammatisch unpassend."
    ],
    "P49 Geld, Anzahl und Ticketbedingungen."
  ],
  [
    "gurai-hodo",
    "〜ぐらい versus 〜ほど",
    "comparison",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "十分ぐらい",
    "思ったほど",
    "Ungefährer Betrag/Grad",
    "Gradmaß; in Negation 'nicht so sehr wie erwartet'",
    "Du schätzt eine Fahrtzeit und bewertest ein Buch.",
    "Freund",
    "〜くらい/ぐらい oft Menge; ほど auch Ausmaß und Vergleiche",
    "ぐらい setzt häufig eine grobe Zahl; ほど zeigt Grad, Vergleich oder Maß, z.B. 思ったほど〜ない.",
    [
      [
        "駅まで十分ぐらいかかります。",
        "Zum Bahnhof dauert es etwa zehn Minuten.",
        "Grobe Zeit."
      ],
      [
        "思ったほど遠くありません。",
        "Nicht so weit wie gedacht.",
        "Erwarteter Grad wird unterschritten."
      ],
      [
        "疲れて歩けないほどです。",
        "Ich bin so müde, dass ich kaum gehen kann.",
        "Intensität."
      ]
    ],
    "思ったぐらい遠くない als gleiche feste Vergleichskonstruktion voraussetzen.",
    "Im negierten Gradvergleich ist ほど besonders passend.",
    [
      "Sage: Die Bibliothek war nicht so voll wie erwartet.",
      "図書館は思ったほど混んでいませんでした。",
      "図書館は予想したほど混んでいませんでした。",
      "図書館は十分ぐらい混んでいません。",
      "Zahlmaß ersetzt hier keinen Erwartungsvergleich."
    ],
    [
      "Neuer Kontext: Der Fußweg dauert ungefähr zwanzig Minuten.",
      "歩いて二十分ぐらいかかります。",
      "徒歩で二十分くらいです。",
      "思ったほど二十分です。",
      "Die Aussage ist eine Zeitschätzung."
    ],
    "P50 Ankunftszeit nicht als Garantie behandeln."
  ],
  [
    "de-noni-location",
    "〜で versus 〜に beim Handlungsort",
    "description",
    [
      "p25:library",
      "p26:library-project"
    ],
    "図書館で勉強します",
    "図書館にいます",
    "Ort einer Handlung",
    "Existenz-/Zielpunkt/Ankunftsbezug",
    "Ein Freund fragt, wo du gerade lernst und wo du dich befindest.",
    "Freund",
    "neutrale Partikeln, nicht Registerfrage",
    "で für Ort einer Aktivität, に für Existenz, Ziel- und bestimmte Zustandsverben; nicht anhand deutscher Präposition 'in' allein wählen.",
    [
      [
        "図書館で勉強しています。",
        "Ich lerne in der Bibliothek.",
        "Handlung am Ort."
      ],
      [
        "図書館にいます。",
        "Ich bin in der Bibliothek.",
        "Existenz/Aufenthalt."
      ],
      [
        "駅に着きました。",
        "Ich bin am Bahnhof angekommen.",
        "Zielpunkt von 着く."
      ]
    ],
    "〜に und 〜で beide wahllos für jede Tätigkeit benutzen.",
    "Verbvalenz und Ereignistyp entscheiden.",
    [
      "Sage: Ich esse gerade in der Mensa.",
      "食堂でご飯を食べています。",
      "食堂で昼ご飯を食べています。",
      "食堂にご飯を食べています。",
      "Essen ist Handlung, Ort mit で."
    ],
    [
      "Neuer Kontext: Die Lehrerin befindet sich jetzt im Klassenraum.",
      "先生は今教室にいます。",
      "今、先生が教室にいます。",
      "先生は教室でいます。",
      "いる nimmt den Aufenthaltsort mit に."
    ],
    "P49 Ort in Aushang versus Handlungsort."
  ],
  [
    "ni-he-direction",
    "〜へ versus 〜に als Richtung und Ziel",
    "description",
    [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "駅へ行きます",
    "駅に着きます",
    "Richtung des Gehens",
    "Erreichter Zielpunkt bestimmter Verben",
    "Eine Person geht zum Bahnhof, später meldet sie die Ankunft.",
    "Reisepartner",
    "へ wird e ausgesprochen, aber へ geschrieben",
    "行く kann sowohl に als auch へ zum Ziel verwenden (Nuance Richtung); 着く verlangt normalerweise に.",
    [
      [
        "大学へ行きます。",
        "Ich gehe zur Universität.",
        "Richtung."
      ],
      [
        "大学に行きます。",
        "Ich gehe zur Universität.",
        "Ziel."
      ],
      [
        "大学に着きました。",
        "Ich bin an der Uni angekommen.",
        "Ankunftspunkt."
      ]
    ],
    "着く＋へ als normalen Ersatz zu 着く＋に behandeln.",
    "Bei 着く benennt に die tatsächliche Ankunft.",
    [
      "Sage: Ich bin jetzt am Bahnhof angekommen.",
      "今、駅に着きました。",
      "駅に今着きました。",
      "今、駅へ着きました。",
      "着く verbindet sich regulär mit に."
    ],
    [
      "Neuer Kontext: Du willst morgen zum Museum gehen.",
      "明日、美術館へ行きます。",
      "明日、美術館に行きます。",
      "明日、美術館で行きます。",
      "で ist hier kein Zielmarker."
    ],
    "P50 Bahnhofsdurchsagen und P41–P45 Wege."
  ],
  [
    "to-ya-list",
    "〜と versus 〜や bei Nomenlisten",
    "description",
    [
      "p25:shopping",
      "p23:ownership"
    ],
    "りんごとバナナ",
    "りんごやバナナ",
    "Aufgezählte Elemente vollständig/geschlossen im Kontext",
    "Beispiele aus einer größeren offenen Menge",
    "Eine Einkaufsliste enthält genau zwei Früchte, eine Party bietet verschiedenes Obst.",
    "Freund",
    "beide neutral; と hat weitere Funktionen",
    "AとB listet diese beiden als Gruppe; AやB gibt Beispiele und legt weitere Dinge nahe, oft mit など.",
    [
      [
        "りんごとバナナを買います。",
        "Ich kaufe Äpfel und Bananen.",
        "Beide konkreten Positionen."
      ],
      [
        "りんごやバナナを買います。",
        "Ich kaufe unter anderem Äpfel und Bananen.",
        "Offene Liste."
      ],
      [
        "本やノートなどを用意してください。",
        "Bereiten Sie z.B. Bücher und Hefte vor.",
        "Nicht erschöpfende Beispiele."
      ]
    ],
    "〜や als 'genau diese zwei Dinge, sonst nichts' verstehen.",
    "Für eindeutig vollständige Positionen verwende と.",
    [
      "Bestätige eine Einkaufsliste mit genau Reis und Milch.",
      "米と牛乳を買います。",
      "米と牛乳だけを買います。",
      "米や牛乳などを買います。",
      "やなど würde weitere Artikel offenlassen."
    ],
    [
      "Neue Aufgabe: Nenne Bücher und Zeitschriften als Beispiele für Lesematerial.",
      "本や雑誌などを読みます。",
      "本や雑誌を読んでいます。",
      "本と雑誌だけを読みます。",
      "Die exklusive Aufzählung ist nicht verlangt."
    ],
    "P49 Kaufzettel und P50 Mengenänderungen."
  ],
  [
    "naru-suru-adj",
    "〜くなる versus 〜くする",
    "description",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "部屋が明るくなりました",
    "部屋を明るくしました",
    "Zustandsveränderung aus Sicht des Gegenstands",
    "Handelnder verändert etwas aktiv in den Zustand",
    "In einem Kursraum geht Licht an; die Leitung stellt die Lampen heller.",
    "Freund und Mitarbeiter",
    "い-Adjektiv: 〜くなる/する; な-Adjektiv: 〜になる/する",
    "なる bezeichnet das resultierende Werden, する das aktive Bewirken durch jemanden.",
    [
      [
        "部屋が明るくなりました。",
        "Das Zimmer wurde heller.",
        "Veränderung."
      ],
      [
        "部屋を明るくしました。",
        "Ich/wir haben das Zimmer heller gemacht.",
        "Aktive Änderung."
      ],
      [
        "日本語が上手になりました。",
        "Mein Japanisch ist besser geworden.",
        "な-Adjektiv nominaler Zustand."
      ]
    ],
    "〜くする als spontanes Werden ohne Handelnden behandeln.",
    "Achte auf が vs を und auf aktive Urheberschaft.",
    [
      "Sage: Die Gruppe hat den Raum ruhig gemacht.",
      "みんなで部屋を静かにしました。",
      "部屋を静かにしました。",
      "部屋が静かにしました。",
      "Mit が wäre hier die transitive Konstruktion falsch."
    ],
    [
      "Neuer Fall: Das Wetter ist wärmer geworden.",
      "天気が暖かくなりました。",
      "今日は暖かくなりました。",
      "天気を暖かくしました。",
      "Ohne handelnde Person beschreibt なる den Zustand."
    ],
    "P45 Erzählungen über Veränderungen."
  ],
  [
    "potential-dekiru",
    "Potenzialform versus 〜ことができます",
    "description",
    [
      "p25:library",
      "p26:library-project"
    ],
    "日本語を読めます",
    "日本語を読むことができます",
    "Knappe Potenzialform einer Fähigkeit/Möglichkeit",
    "Explizite Fähigkeit/Möglichkeit als nominalisiertes Verb",
    "Du beschreibst, welche Schrift du lesen kannst.",
    "Kommilitone",
    "Potenzialform oft kurz/gesprochen, ことができます etwas erklärender",
    "Beide können Fähigkeit oder Möglichkeit ausdrücken, doch Potenzialverben bilden eigene Muster, z.B. 読める, 行ける; できます nicht einfach an jede Form hängen.",
    [
      [
        "ひらがなが読めます。",
        "Ich kann Hiragana lesen.",
        "Potenzialform von 読む."
      ],
      [
        "ひらがなを読むことができます。",
        "Ich kann Hiragana lesen.",
        "Nominalisierte Fähigkeit."
      ],
      [
        "この部屋では電話が使えません。",
        "In diesem Raum kann man kein Telefon benutzen.",
        "Praktische Möglichkeit/Verbot im Kontext."
      ]
    ],
    "読めますことができます als doppelte Fähigkeit bilden.",
    "Entweder die richtige Potenzialform oder 辞書形＋ことができます.",
    [
      "Sage kurz: Ich kann diese Kanji noch nicht lesen.",
      "この漢字はまだ読めません。",
      "この漢字をまだ読むことができません。",
      "この漢字は読むできます。",
      "読む braucht ことが oder eine Potenzialform."
    ],
    [
      "Neuer Kontext: Man kann diesen Raum online reservieren.",
      "この部屋はオンラインで予約できます。",
      "オンラインでこの部屋を予約することができます。",
      "オンラインで予約ことができます。",
      "Die Verbnominalisierung fehlt."
    ],
    "P49 Buchungstexte und P51 Fähigkeitsprofile."
  ],
  [
    "ga-hoshii-wo-tai",
    "〜がほしい versus 〜を〜たい",
    "intention",
    [
      "p25:shopping",
      "p23:ownership"
    ],
    "新しい本がほしい",
    "新しい本を買いたい",
    "Wunsch nach einem Gegenstand",
    "Wunsch nach einer eigenen Handlung",
    "Ein Freund fragt, ob du das Buch haben oder kaufen möchtest.",
    "Freund",
    "〜ほしい für Gegenstand, 〜たい an Verbstamm",
    "欲しい nimmt das gewünschte Ding typischerweise mit が, 〜たい bezeichnet die Handlung mit Verb; beide können sich im Alltag überschneiden, aber nicht grammatisch identisch.",
    [
      [
        "新しい辞書がほしいです。",
        "Ich hätte gern ein neues Wörterbuch.",
        "Gegenstand im Fokus."
      ],
      [
        "新しい辞書を買いたいです。",
        "Ich will ein neues Wörterbuch kaufen.",
        "Handlung im Fokus."
      ],
      [
        "今日はゆっくり休みたいです。",
        "Heute möchte ich mich ausruhen.",
        "Verb, kein Objektwunsch."
      ]
    ],
    "ほしい wie ein Verb an 〜ます-Stamm eines Verbs hängen.",
    "てほしい ist wieder ein anderes Muster für fremde Handlungen.",
    [
      "Formuliere: Ich möchte eine neue Tasche kaufen.",
      "新しいかばんを買いたいです。",
      "新しいかばんが買いたいです。",
      "新しいかばんをほしいです。",
      "ほしい benutzt typischerweise が, nicht を."
    ],
    [
      "Neue Situation: Du wünschst dir ein japanisches Wörterbuch, ohne Kaufhandlung zu nennen.",
      "日本語の辞書がほしいです。",
      "新しい日本語の辞書がほしいです。",
      "日本語の辞書を買ってほしいです。",
      "Das verlangt von anderen einen Kauf statt einen eigenen Gegenstandswunsch."
    ],
    "P49 Einkaufsanzeigen und P40 Kaufentscheidungen."
  ]
] satisfies P51RawContrast[];
export const p51ContrastsD=p51CorpusD.map(authoredP51Contrast);
