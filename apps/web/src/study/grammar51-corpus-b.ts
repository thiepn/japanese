import {authoredP51Contrast,type P51RawContrast} from "./grammar51-types";
/** Original P51 B: conditions, purposes and evidence commitments. */
export const p51CorpusB=[
  [
    "tara-to",
    "〜たら versus 〜と",
    "condition",
    [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "雨が降ったら",
    "このボタンを押すと",
    "Wenn etwas eintritt; danach auch Vorschlag/Absicht",
    "Regelmäßige/automatische Folge; nicht normaler Platz für auffordernde Folge",
    "Du entscheidest bei Regen über einen Ausflug und erklärst einen Automaten.",
    "Freund und Reisender",
    "〜たら flexibel im gesprochenen Alltagsjapanisch",
    "〜たら eignet sich für einmalige Bedingungen und Vorhaben; 〜と typischerweise für wiederholbare, natürliche oder automatische Folgen.",
    [
      [
        "雨が降ったら、家にいましょう。",
        "Wenn es regnet, bleiben wir zuhause.",
        "Ein Vorschlag als Folge."
      ],
      [
        "このボタンを押すと、ドアが開きます。",
        "Beim Drücken öffnet sich die Tür.",
        "Mechanische Folge."
      ],
      [
        "駅に着いたら、電話してください。",
        "Wenn du angekommen bist, ruf bitte an.",
        "Aufforderung nach Ereignis."
      ]
    ],
    "〜と automatisch benutzen, wenn die Folge ein freier Befehl ist.",
    "Für persönliche Entscheidungen und Bitten ist 〜たら der sichere Ausgangspunkt.",
    [
      "Bitte einen Freund: Ruf mich an, wenn du angekommen bist.",
      "着いたら電話してください。",
      "駅に着いたら連絡してください。",
      "駅に着くと電話してください。",
      "Ein individueller Auftrag passt besser zu 〜たら."
    ],
    [
      "Neuer Kontext: Wird eine Tür automatisch geöffnet, wenn man einen Knopf drückt.",
      "ボタンを押すとドアが開きます。",
      "このボタンを押すと開きます。",
      "ボタンを押したら開いてください。",
      "Die Tür öffnet sich automatisch; niemand wird gebeten."
    ],
    "P49 Geräteanleitungen und P50 Änderungen im Verkehr."
  ],
  [
    "nara-tara",
    "〜なら versus 〜たら",
    "condition",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "京都に行くなら",
    "京都に行ったら",
    "Thema/Annahme aus Gespräch aufgreifen und Rat geben",
    "Erst nach Eintreten bzw. Erreichen der Bedingung",
    "Eine Freundin erzählt von ihrer Kyoto-Reise; du gibst vorher Rat und später eine Handlung.",
    "Freund",
    "beide normal, unterschiedliche Bezugspunkte",
    "〜なら greift eine bereits angesprochene Absicht/Annahme auf; 〜たら setzt Handeln zeitlich oder logisch nach der Bedingung.",
    [
      [
        "京都に行くなら、秋がいいですよ。",
        "Wenn du nach Kyoto reist: Herbst ist gut.",
        "Rat schon im Planungsstadium."
      ],
      [
        "京都に着いたら、連絡してください。",
        "Melde dich, wenn du in Kyoto angekommen bist.",
        "Handlung erst danach."
      ],
      [
        "時間があるなら、少し手伝ってください。",
        "Falls du Zeit hast, hilf etwas.",
        "Voraussetzung als Gesprächsannahme."
      ]
    ],
    "〜たら bei jedem bereits diskutierten Wunsch verwenden, auch wenn Rat vorab erfolgt.",
    "Zeitpunkt und Gesprächsstatus unterscheiden.",
    [
      "Ein Freund plant Osaka. Empfiehl den Zug als frühen Planungstipp.",
      "大阪に行くなら、電車が便利ですよ。",
      "大阪に行くなら、電車がおすすめです。",
      "大阪に着いたら電車が便利です。",
      "Die Empfehlung betrifft die Reiseplanung vorher."
    ],
    [
      "Neuer Kontext: Bitte nach Ankunft im Hotel um Nachricht.",
      "ホテルに着いたら連絡してください。",
      "ホテルに着いたらメールしてください。",
      "ホテルに着くなら連絡しました。",
      "Die Handlung soll erst bei Ankunft erfolgen."
    ],
    "P44 pragmatische Ratschläge und P50 Reisemissionen."
  ],
  [
    "temo-tara",
    "〜ても versus 〜たら",
    "condition",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "雨が降っても",
    "雨が降ったら",
    "Trotz der Bedingung gilt Folge",
    "Folge wird abhängig von Bedingung",
    "Eine Gruppe klärt, ob ihr Training stattfindet.",
    "Mitorganisator",
    "neutral höflich",
    "〜ても führt Zugeständnis trotz Hindernis ein; 〜たら legt eine bedingte Entscheidung fest.",
    [
      [
        "雨が降っても、練習します。",
        "Auch wenn es regnet, trainieren wir.",
        "Ereignis findet trotzdem statt."
      ],
      [
        "雨が降ったら、練習は中止です。",
        "Wenn es regnet, entfällt das Training.",
        "Entscheidung ist wetterabhängig."
      ],
      [
        "忙しくても、少し勉強します。",
        "Obwohl ich beschäftigt bin, lerne ich etwas.",
        "Trotz Einschränkung."
      ]
    ],
    "〜ても und 〜たら als zwei Wörter für 'wenn' ohne gegensätzliche Logik.",
    "Die eine Form bewahrt die Handlung trotz Hindernis, die andere macht sie bedingt.",
    [
      "Teile mit, dass der Unterricht auch bei Schnee stattfindet.",
      "雪が降っても授業はあります。",
      "雪でも授業をします。",
      "雪が降ったら授業は中止です。",
      "Die letzte Aussage macht aus 'trotzdem' eine Absage."
    ],
    [
      "Neues Training: Bei starkem Wind wird abgesagt.",
      "強い風が吹いたら、練習は中止です。",
      "風が強かったら練習しません。",
      "風が強くても中止です。",
      "Das kann sprachlich funktionieren, verschiebt aber die Logik; gefordert ist die Wenn-Bedingung."
    ],
    "P48/50 Wettermeldungen korrekt auswerten."
  ],
  [
    "node-kara",
    "〜ので versus 〜から",
    "evidence",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "遅れたので",
    "遅れたから",
    "Grund als erklärender Hintergrund, häufig weich",
    "Grund deutlich direkt/argumentativ behauptet; Register je nach Satz",
    "Du erklärst einer Lehrkraft eine Verspätung, später einem Freund.",
    "Lehrkraft und Freund",
    "〜ので wirkt bei höflichen Erklärungen oft zurückhaltender",
    "Beide geben Gründe an; 〜ので kann den Kontext sachlicher/weicher darstellen, 〜から Gründe entschiedener artikulieren. Nicht absolut formell vs. informell.",
    [
      [
        "電車が遅れたので、少し遅くなりました。",
        "Weil der Zug verspätet war, kam ich etwas spät.",
        "Höfliche Erklärung."
      ],
      [
        "電車が遅れたから、遅くなったんだ。",
        "Der Zug hatte Verspätung, deshalb war ich spät.",
        "Direkte Freundeserklärung."
      ],
      [
        "雨なので、今日は中に入りましょう。",
        "Da es regnet, gehen wir hinein.",
        "Höflicher Vorschlag mit Hintergrund."
      ]
    ],
    "〜から stets als unhöflich oder 〜ので stets als formell verstehen.",
    "Beide können höflich sein; der Fokus liegt auf Erklärungsstil.",
    [
      "Entschuldige dich bei der Lehrkraft wegen Zugverspätung.",
      "電車が遅れたので、授業に遅れました。すみません。",
      "電車が遅れたので、少し遅くなりました。",
      "電車が遅れましたから、先生が悪いです。",
      "Das schiebt Schuld zu statt höflich zu erklären."
    ],
    [
      "Neuer Kontext: Freund fragt direkt, warum du zu Hause bist: Regen.",
      "雨が降っているから、家にいるんだ。",
      "雨だから、家にいるよ。",
      "雨が降らないので、家にいるよ。",
      "Die Ursache wird umgekehrt."
    ],
    "P44 Register und P47 Erklärungen."
  ],
  [
    "noni-kedo",
    "〜のに versus 〜けど",
    "evidence",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "予約したのに",
    "予約したけど",
    "Unerwarteter Gegensatz, häufig Enttäuschung",
    "Allgemeine Gegenüberstellung, Abschwächung oder Einleitung",
    "Du hast trotz Reservierung keinen Platz, sagst es einem Freund.",
    "Freund und Bedienung",
    "〜のに kann Enttäuschung transportieren; 〜けど kann mildern",
    "〜のに setzt enttäuschte Erwartung voraus; 〜けど ist vielseitiger und impliziert nicht notwendig eine Verletzung der Erwartung.",
    [
      [
        "予約したのに、席がありませんでした。",
        "Obwohl ich reserviert hatte, gab es keinen Platz!",
        "Unerwartetes, frustrierendes Ergebnis."
      ],
      [
        "予約しましたけど、確認できますか。",
        "Ich habe reserviert, könnten Sie nachschauen?",
        "Höfliche Überleitung zur Bitte."
      ],
      [
        "この店は安いけど、おいしいです。",
        "Der Laden ist günstig, aber lecker.",
        "Neutraler Gegensatz."
      ]
    ],
    "Jeden Gegensatz mit 〜のに formulieren, obwohl keine enttäuschte Erwartung vorliegt.",
    "Wähle 〜けど für ruhige Kontraste und höfliche Einleitungen.",
    [
      "Beschwere dich bei einem Freund: Trotz Zusage wurde das Treffen abgesagt.",
      "約束したのに、会えませんでした。",
      "約束したのに、来ませんでした。",
      "約束したけど、来なかったかな。",
      "Die geforderte Enttäuschung wird viel weniger deutlich."
    ],
    [
      "Neuer Kontext: Höflich bitten, eine Buchung zu prüfen.",
      "予約したんですが、確認していただけますか。",
      "予約したのですが、確認できますか。",
      "予約したのに、確認できますか。",
      "Bei der Bitte ist eine weiche Überleitung natürlicher."
    ],
    "P43 reparative Gespräche und P45 unabhängige Reaktion."
  ],
  [
    "tame-youni",
    "〜ために versus 〜ように",
    "intention",
    [
      "p25:library",
      "p26:library-project"
    ],
    "日本語を勉強するために",
    "聞こえるように",
    "Bewusstes Ziel einer kontrollierbaren Handlung",
    "Erwünschter Zustand/Fähigkeit oder indirekt kontrollierbares Ergebnis",
    "Ein Student lernt für einen Beruf, der Lehrer macht Sprache verständlich.",
    "Lernpartner und Lehrkraft",
    "beide neutral; 〜ように auch für Bitten und Gewohnheitsziele",
    "〜ために an selbst kontrollierte Zweckhandlungen, 〜ように oft an Möglichkeiten/erwünschte Zustände wie 聞こえる und 忘れない.",
    [
      [
        "日本で働くために、日本語を勉強しています。",
        "Ich lerne Japanisch, um in Japan zu arbeiten.",
        "Ziel eigener Handlung."
      ],
      [
        "みんなに聞こえるように、大きな声で話します。",
        "Ich spreche laut, damit alle mich hören können.",
        "Erwünschter Zustand."
      ],
      [
        "忘れないように、メモします。",
        "Ich notiere es, damit ich es nicht vergesse.",
        "Vermeiden eines Zustands."
      ]
    ],
    "〜ために und 〜ように überall ohne Unterschied einsetzen.",
    "Bei Fähigkeiten und negierten erwünschten Zuständen hilft 〜ように.",
    [
      "Sage: Ich schreibe mit, um die Uhrzeit nicht zu vergessen.",
      "時間を忘れないように、メモします。",
      "忘れないように書いておきます。",
      "時間を忘れるためにメモします。",
      "Das hieße: mit dem Ziel, die Uhrzeit zu vergessen."
    ],
    [
      "Neuer Kontext: Du arbeitest, um Geld für eine Reise zu sparen.",
      "旅行のお金をためるために働きます。",
      "旅行のためにアルバイトをします。",
      "旅行のお金をなくすように働きます。",
      "Das Ziel ist Sparen, nicht Verlust."
    ],
    "P49 Formularzwecke und P50 Zielbestimmungen."
  ],
  [
    "tomo-kamo",
    "〜と思います versus 〜かもしれません",
    "evidence",
    [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "来ると思います",
    "来るかもしれません",
    "Eigene Meinung/Vermutung mit subjektiver Einschätzung",
    "Möglichkeit ohne Festlegung",
    "Eine Fähre hat wegen Wind einen unsicheren Ersatztermin.",
    "Freund und Mitreisender",
    "neutral höflich; beide keine objektive Gewissheit",
    "〜と思います markiert eine subjektive Einschätzung; 〜かもしれません drückt eine mögliche, ausdrücklich offene Eventualität aus. Eine Meinung kann selbst unsicher sein.",
    [
      [
        "明日は晴れると思います。",
        "Ich denke, morgen wird es sonnig.",
        "Persönliche Einschätzung."
      ],
      [
        "船は遅れるかもしれません。",
        "Vielleicht verspätet sich das Schiff.",
        "Mögliches Risiko."
      ],
      [
        "田中さんも来ると思いますが、まだ聞いていません。",
        "Ich denke, Tanaka kommt, aber habe nicht nachgefragt.",
        "Meinung ohne bestätigten Beleg."
      ]
    ],
    "〜と思います als zuverlässige Bestätigung an andere weitergeben.",
    "Weder Vermutung noch Möglichkeit entspricht einer offiziellen Zusage.",
    [
      "Sage vorsichtig, dass der Bus möglicherweise verspätet ist.",
      "バスは遅れるかもしれません。",
      "バスが遅れる可能性があります。",
      "バスは必ず遅れます。",
      "Eine Möglichkeit ist nicht sicher."
    ],
    [
      "Anderer Kontext: Du denkst, dass morgen die Lehrerin kommt, ohne Bestätigung.",
      "明日、先生が来ると思います。",
      "先生は明日来ると思います。",
      "先生が必ず来るそうです。",
      "Der letzte Satz behauptet eine gehörte Nachricht."
    ],
    "P50 Fährausfall und unsichere Ankünfte."
  ],
  [
    "sou-hearsay-think",
    "〜そうです (Hörensagen) versus 〜と思います",
    "evidence",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "明日は休みだそうです",
    "明日は休みだと思います",
    "Von anderer Quelle berichtete Information",
    "Eigene Meinung",
    "Ein Kollege berichtet eine Öffnungsänderung; du vermutest selbst eine zusätzliche Änderung.",
    "Kollege",
    "だそうです nach Nomen/na-Adjektiv; 思います mit Satzform",
    "Hörensagen 〜そうです mit gewöhnlicher Form des berichteten Satzes; Meinung 〜と思います benennt eigene Einschätzung. Gewissheit nicht automatisch aus Bericht ableiten.",
    [
      [
        "受付は明日休みだそうです。",
        "Ich habe gehört, morgen ist der Schalter zu.",
        "Quelle ist eine andere Person."
      ],
      [
        "受付は明日休みだと思います。",
        "Ich denke, morgen ist der Schalter zu.",
        "Eigene Annahme."
      ],
      [
        "先生によると、試験は金曜日だそうです。",
        "Laut Lehrkraft soll die Prüfung Freitag sein.",
        "Fremdaussage samt Quelle."
      ]
    ],
    "Eine subjektive Vermutung mit そうです als Fremdquelle ausgeben.",
    "Berichten ist nicht erfinden; Quelle und eigener Wissensstand unterscheiden.",
    [
      "Berichte: Laut Lehrerin findet der Unterricht morgen nicht statt.",
      "先生によると、明日の授業はないそうです。",
      "先生が明日は休みだと言っていました。",
      "明日の授業はないと思います。",
      "Das kennzeichnet nur eigene Meinung statt Quelle."
    ],
    [
      "Neuer Kontext: Du denkst selbst, das Museum sei morgen voll.",
      "明日は美術館が混むと思います。",
      "美術館は明日人が多いと思います。",
      "美術館は混むそうです。",
      "Ohne berichtete Fremdquelle ist Hörensagen unbegründet."
    ],
    "P48 Quellenstatus statt bloße Antworten."
  ],
  [
    "sou-appearance-hearsay",
    "〜そうです: Aussehen versus Hörensagen",
    "evidence",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "雨が降りそうです",
    "雨が降るそうです",
    "Es sieht nach unmittelbarer Beobachtung danach aus",
    "Man hört/liest, dass es regnen soll",
    "Vor dem Sport wird der Himmel dunkel; ein Freund nennt eine Wettervorhersage.",
    "Mitspieler",
    "gleiches そうです, aber andere Verbform",
    "ます-Stamm＋そうです beschreibt hier sichtbare Anzeichen; Wörterbuchform＋そうです meldet gehörte/gelernte Vorhersage.",
    [
      [
        "空が暗いです。雨が降りそうです。",
        "Der Himmel ist dunkel; es sieht nach Regen aus.",
        "Visuelle Evidenz."
      ],
      [
        "天気予報によると、明日は雨が降るそうです。",
        "Laut Wetterbericht soll es morgen regnen.",
        "Fremdinformation."
      ],
      [
        "このケーキはおいしそうです。",
        "Der Kuchen sieht lecker aus.",
        "Eindruck aus Erscheinung."
      ]
    ],
    "降りそう und 降るそう als denselben Prognosetyp lesen.",
    "Die Form vor そう zeigt die Quelle der Information.",
    [
      "Sage: Der Himmel ist dunkel; es sieht nach Schnee aus.",
      "雪が降りそうです。",
      "空が暗いので、雪が降りそうです。",
      "雪が降るそうです。",
      "Der letzte Satz benötigt eine gehörte Information."
    ],
    [
      "Neuer Kontext: Laut Radio soll der Zug morgen ausfallen.",
      "ラジオによると、明日の電車は運休するそうです。",
      "ラジオでは、明日の電車は走らないそうです。",
      "電車は運休しそうです。",
      "Hier ist die Quelle ein Radiobericht, nicht bloßer Augenschein."
    ],
    "P47 Hörquellen und P50 Schrift/Ton."
  ],
  [
    "you-da-rashii",
    "〜ようです versus 〜らしいです",
    "evidence",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "電気が消えているようです",
    "駅は工事中らしいです",
    "Schluss aus vorhandenen Anzeichen; auch Vergleich je nach Konstruktion",
    "Hörensagen oder Eindruck, Quelle oft indirekter",
    "Vor einem Gebäude siehst du keine Lichter, ein Freund hat vom Umbau gehört.",
    "Freund",
    "beide können Unsicherheit markieren; 〜ようです oft etwas formeller",
    "〜ようです kann einen begründeten Eindruck aus Beobachtung markieren; 〜らしい kann eine unbestätigte Nachricht/indirekten Eindruck vermitteln. Beide sind kontextabhängig.",
    [
      [
        "部屋に明かりがありません。誰もいないようです。",
        "Kein Licht; anscheinend ist niemand da.",
        "Sichtbare Anzeichen."
      ],
      [
        "駅は工事中らしいです。",
        "Anscheinend wird am Bahnhof gebaut.",
        "Indirekter Bericht."
      ],
      [
        "この道は静かなようです。",
        "Dieser Weg scheint ruhig zu sein.",
        "Vorsichtiger Eindruck."
      ]
    ],
    "〜らしい immer als offiziell bestätigte Nachricht lesen.",
    "Indirekte Evidenz bleibt indirekt; beschreibe die Quelle.",
    [
      "Sage mit Vorsicht: Wegen fehlendem Licht scheint das Geschäft geschlossen.",
      "電気が消えています。店は閉まっているようです。",
      "店はもう閉まったようです。",
      "店は必ず閉まっています。",
      "Die Anzeichen garantieren den Schluss nicht."
    ],
    [
      "Neue Situation: Du hast nur von anderen gehört, dass ein Park morgen gesperrt sei.",
      "公園は明日使えないらしいです。",
      "明日は公園に入れないらしいです。",
      "公園は必ず使えません。",
      "Eine Hörensagenquelle ist keine Bestätigung."
    ],
    "P43/50 unverifizierte Sprecherbehauptungen."
  ]
] satisfies P51RawContrast[];
export const p51ContrastsB=p51CorpusB.map(authoredP51Contrast);
