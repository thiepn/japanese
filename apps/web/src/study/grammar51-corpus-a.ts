import {authoredP51Contrast,type P51RawContrast} from "./grammar51-types";
/** Original P51 A: time, sequence and aspect with speaker-perspective distinctions. */
export const p51CorpusA=[
  [
    "teiru-state-action",
    "〜ています: Verlauf oder Zustand",
    "aspect",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "今、読んでいます",
    "ドアが開いています",
    "Gerade stattfindende Tätigkeit",
    "Resultierender Zustand nach einer Veränderung",
    "Im Leseraum liest eine Person; daneben ist ein Fenster offen.",
    "Freund und Bibliothekspersonal",
    "höfliches 〜ています oder alltagssprachliches 〜ている",
    "Dieselbe Form 〜ている drückt je nach Verb eine laufende Handlung oder einen gegenwärtigen Ergebniszustand aus.",
    [
      [
        "今、本を読んでいます。",
        "Ich lese gerade ein Buch.",
        "読む ist eine fortlaufende Tätigkeit."
      ],
      [
        "窓が開いています。",
        "Das Fenster steht offen.",
        "開く bezeichnet hier den resultierenden Zustand."
      ],
      [
        "毎日バスに乗っています。",
        "Ich fahre regelmäßig Bus.",
        "Auch Gewohnheiten sind bei passenden Kontexten möglich."
      ]
    ],
    "〜ています bedeutet nicht bei jedem Verb genau jetzt aktiv handeln.",
    "Bei Zustandswechselverben kann das Ergebnis im Vordergrund stehen.",
    [
      "Erkläre dem Freund, dass der Laden gerade geöffnet ist.",
      "店は今開いています。",
      "今、店が開いています。",
      "店は今開けています。",
      "開いています beschreibt den Ladenzustand, 開けています eine Handlung eines Handelnden."
    ],
    [
      "Anderes Szenario: Das Fenster ist jetzt geschlossen (Zustand).",
      "窓が閉まっています。",
      "今、窓は閉まっています。",
      "窓を閉めています。",
      "Mit を閉めています wird eher eine aktive Schließhandlung ausgedrückt."
    ],
    "Mit P47 Ansagen über Öffnungszustände und P49 Aushangzeiten kombinieren."
  ],
  [
    "teiru-habit-now",
    "〜ています und 〜ます: gerade oder Routine",
    "aspect",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "今、勉強しています",
    "毎朝、勉強します",
    "Aktuelle Aktivität im Moment",
    "Allgemeine Gewohnheit mit Zeitfrequenz",
    "Ein Freund fragt, was du gerade tust; später fragt er nach deinem Alltag.",
    "Gleichaltriger Lernpartner",
    "beide Formen sind neutral höflich",
    "Mit 今 hilft 〜ています beim laufenden Geschehen, während 毎朝 + 〜ます eine wiederholte Gewohnheit zeigt; 〜ています kann ebenfalls Gewohnheiten beschreiben.",
    [
      [
        "今、日本語を勉強しています。",
        "Ich lerne gerade Japanisch.",
        "Aktuelle Handlung."
      ],
      [
        "毎朝、日本語を勉強します。",
        "Jeden Morgen lerne ich Japanisch.",
        "Wiederholtes Muster."
      ],
      [
        "東京に住んでいます。",
        "Ich wohne in Tokio.",
        "Zustandsartiger Gebrauch von 〜ています."
      ]
    ],
    "Jede 〜ます-Form als Zukunft und jede 〜ています-Form als Handlung im Moment lesen.",
    "Zeitadverbien und Verbart begrenzen die Interpretation.",
    [
      "Antworte: Ich koche gerade, aber ich koche nicht jeden Tag.",
      "今、料理をしていますが、毎日は料理しません。",
      "今は料理しています。毎日はしません。",
      "毎日料理しています。",
      "Die Aufgabe unterscheidet Moment und Häufigkeit."
    ],
    [
      "Neuer Kontext: Du liest gerade ein Buch, jeden Abend hörst du Musik.",
      "今、本を読んでいます。毎晩、音楽を聞きます。",
      "今は読書中です。毎晩音楽を聞きます。",
      "毎晩、本を読みました。",
      "Vergangenheit passt nicht zu der verlangten Routine."
    ],
    "P45 freie Situationen verlangen Kontext statt reine Endungsregel."
  ],
  [
    "before-after",
    "〜前に und 〜てから",
    "sequence",
    [
      "p25:library",
      "p26:library-project"
    ],
    "出かける前に",
    "着いてから",
    "Vor einem Bezugsereignis",
    "Nach Abschluss eines Bezugsereignisses",
    "Du planst eine Ausleihe und das spätere Lernen.",
    "Mitstudent",
    "neutral höflich",
    "辞書形＋前に; て形＋から: Ereignisreihenfolge ist semantisch entscheidend.",
    [
      [
        "出かける前に鍵を確認します。",
        "Vor dem Weggehen prüfe ich den Schlüssel.",
        "Vorzeitigkeit mit Wörterbuchform."
      ],
      [
        "図書館に着いてから勉強します。",
        "Nach Ankunft in der Bibliothek lerne ich.",
        "Erst Ankommen, dann Lernen."
      ],
      [
        "寝る前に本を読みます。",
        "Vor dem Schlafen lese ich.",
        "Die Haupttätigkeit geschieht vorher."
      ]
    ],
    "〜てから verwenden, wenn die Haupttätigkeit eigentlich vorher passiert.",
    "〜前に richtet den Blick vor das Ereignis, 〜てから dahinter.",
    [
      "Sage: Vor der Bibliothek Frühstück, nach Ankunft lesen.",
      "図書館へ行く前に朝ご飯を食べて、着いてから本を読みます。",
      "出かける前に食べ、図書館に着いてから読みます。",
      "図書館に着いてから朝ご飯を食べる前に行きます。",
      "Ereignisse werden unklar und vertauscht."
    ],
    [
      "Neuer Alltag: Vor dem Zugticketkauf prüfen, danach einsteigen.",
      "切符を買う前に時間を確認し、買ってから電車に乗ります。",
      "時間を確認してから切符を買い、それから乗ります。",
      "電車に乗ってから切符を買います。",
      "Das Ticket soll vor dem Einsteigen gekauft werden."
    ],
    "P49 Dokumentabläufe und P46 Lesetexte verwenden."
  ],
  [
    "tokini-form",
    "〜とき: Gegenwart versus Vergangenheit vor dem Zeitpunkt",
    "time",
    [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "日本へ行くとき",
    "日本へ行ったとき",
    "Zeitlicher Bezug vor/auf dem Weg zum Ereignis",
    "Zeitlicher Bezug nach Eintritt oder Abschluss des Ereignisses",
    "Du vergleichst Vorbereitung auf eine Reise und Erinnerungen an die Ankunft.",
    "Freund",
    "höfliche Satzenden, Nebensatzneutralität",
    "辞書形＋とき kann die noch nicht abgeschlossene Bewegung rahmen, た形＋とき einen bereits eingetretenen Zeitpunkt.",
    [
      [
        "日本へ行くとき、飛行機の中で本を読みました。",
        "Als ich nach Japan flog, las ich im Flugzeug.",
        "Noch im Verlauf der Hinreise."
      ],
      [
        "日本へ行ったとき、京都にも行きました。",
        "Als ich in Japan war, fuhr ich auch nach Kyoto.",
        "Reise als erlebter Rahmen."
      ],
      [
        "家を出るとき、電気を消します。",
        "Beim Verlassen schalte ich das Licht aus.",
        "Tätigkeit nahe dem Beginn der Bewegung."
      ]
    ],
    "〜たとき immer als eine zusätzliche vergangene Hauptsatzzeit missverstehen.",
    "Die Form im とき-Satz zeigt die Relation zum Bezug, nicht schlicht den Sprechzeitpunkt.",
    [
      "Erzähle, dass du beim Eintreffen am Bahnhof einen Freund sahst.",
      "駅に着いたとき、友だちに会いました。",
      "駅に着いたとき、友だちがいました。",
      "駅に着くとき、友だちに会いました。",
      "Die Aufgabe betont den erreichten Ankunftspunkt."
    ],
    [
      "Andere Situation: Vor dem Hinausgehen das Wetter prüfen.",
      "外に出るとき、天気を確認します。",
      "出かけるとき、天気を見ます。",
      "外に出たとき、先に天気を確認します。",
      "Zuerst prüfen, dann das Haus verlassen."
    ],
    "Mehrstufige P40–P43 Gespräche zu Vor- und Nachher."
  ],
  [
    "mada-mou",
    "もう versus まだ bei bestätigtem Status",
    "time",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "もう終わりました",
    "まだ終わっていません",
    "Bereits vollzogen",
    "Bis jetzt noch nicht abgeschlossen",
    "Die Hausaufgaben wurden bei zwei Gruppen zu unterschiedlichen Zeiten erledigt.",
    "Klassenpartner",
    "neutral höflich",
    "もう markiert Übergang zum erreichten Status; まだ＋negative Verbform markiert ausstehende Vollendung. まだ＋affirmativ kann Fortdauer ausdrücken.",
    [
      [
        "レポートはもう出しました。",
        "Den Bericht habe ich schon eingereicht.",
        "Abgeschlossene Handlung."
      ],
      [
        "レポートはまだ出していません。",
        "Ich habe ihn noch nicht abgegeben.",
        "Ausstehende Handlung."
      ],
      [
        "まだ図書館にいます。",
        "Ich bin noch in der Bibliothek.",
        "Affirmatives まだ bedeutet Fortdauer."
      ]
    ],
    "まだ automatisch mit jeder positiven Verbform als noch nicht übersetzen.",
    "Die Polarität und der Verbstatus sind entscheidend.",
    [
      "Sage, dass die Anmeldung noch nicht erledigt ist.",
      "申し込みはまだしていません。",
      "まだ申し込んでいません。",
      "もう申し込みました。",
      "Das behauptet das Gegenteil."
    ],
    [
      "Neue Situation: Die Fahrkarte wurde bereits gekauft.",
      "切符はもう買いました。",
      "もう切符を買っています。",
      "切符はまだ買っていません。",
      "Die Handlung ist abgeschlossen."
    ],
    "P49 Formulare und P48 geänderte Fristen bieten Kontext."
  ],
  [
    "toki-ato",
    "〜たあとで versus 〜てから",
    "sequence",
    [
      "p25:library",
      "p26:library-project"
    ],
    "授業が終わったあとで",
    "授業が終わってから",
    "Danach als zeitliche Einordnung",
    "Danach mit Fokus auf dem ersten abgeschlossenen Schritt",
    "Ein Studienplan verbindet Kursende und Bibliotheksbesuch.",
    "Kommilitone",
    "beide alltagstauglich",
    "Beide beschreiben Nachzeitigkeit; 〜たあとで hebt 'nach diesem Ereignis' hervor, 〜てから oft die abgeschlossene Abfolge und kann eine Bedingung für den Folgeschritt betonen.",
    [
      [
        "授業が終わったあとで、図書館に行きます。",
        "Nach Unterricht gehe ich zur Bibliothek.",
        "Ereignis als Zeitanker."
      ],
      [
        "説明を聞いてから、申込書を書きます。",
        "Erst nach Erklärung fülle ich das Formular aus.",
        "Abfolge erforderlich."
      ],
      [
        "ご飯を食べたあとで、散歩しました。",
        "Nach Essen ging ich spazieren.",
        "Schlichte zeitliche Folge."
      ]
    ],
    "Diese Ausdrücke immer als völlig austauschbar ohne Perspektivwechsel behandeln.",
    "Ein Ablauf kann den ersten Schritt als notwendige Voraussetzung voraussetzen.",
    [
      "Bitte jemanden: erst Instruktionen anhören, dann Formular ausfüllen.",
      "説明を聞いてから、申込書を書いてください。",
      "説明を聞いたあとで、書いてください。",
      "申込書を書いてから説明を聞いてください。",
      "Die geforderte Reihenfolge wird umgekehrt."
    ],
    [
      "Neuer Kontext: Nach dem Essen das Geschirr abspülen.",
      "ご飯を食べたあとで、お皿を洗います。",
      "食べてからお皿を洗います。",
      "食べる前にお皿を洗います。",
      "Die Tätigkeit findet danach statt."
    ],
    "P49 Schrittfolgen natürlicher machen."
  ],
  [
    "nagara-tari",
    "〜ながら versus 〜たり〜たり",
    "aspect",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "音楽を聞きながら",
    "音楽を聞いたり、本を読んだり",
    "Zwei gleichzeitige Tätigkeiten, meist gleicher Handelnder",
    "Beispielhafte wechselnde/verschiedene Tätigkeiten",
    "Ein Freund fragt nach Tätigkeiten während des Lernens und am freien Sonntag.",
    "Freund",
    "casual wie höflich möglich",
    "Verbます-Stamm＋ながら für gleichzeitige Begleithandlung; た形＋り…たりします listet Beispiele ohne feste Reihenfolge.",
    [
      [
        "音楽を聞きながら勉強します。",
        "Ich lerne während ich Musik höre.",
        "Gleichzeitigkeit."
      ],
      [
        "日曜日は本を読んだり、散歩したりします。",
        "Sonntags lese ich z.B. und gehe spazieren.",
        "Beispielhafte Tätigkeiten."
      ],
      [
        "歩きながら電話しました。",
        "Ich telefonierte während ich ging.",
        "Überlappung."
      ]
    ],
    "〜たり als stets gleichzeitige Handlung übersetzen.",
    "〜たり listet Auswahl/Beispiele; 〜ながら verbindet parallel.",
    [
      "Beschreibe: Du gehst spazieren, während du Musik hörst.",
      "音楽を聞きながら散歩します。",
      "散歩しながら音楽を聞きます。",
      "音楽を聞いたり、散歩したりします。",
      "Das beschreibt nur Beispiele, nicht zwingend Gleichzeitigkeit."
    ],
    [
      "Neuer Kontext: Am freien Tag zum Beispiel kochen und lesen.",
      "休みの日は料理をしたり、本を読んだりします。",
      "休日には本を読んだり、料理をしたりします。",
      "料理しながら本を読みます。",
      "Das macht fälschlich eine parallele Handlung daraus."
    ],
    "P45 unguided Erzählungen und P46 Lesepassagen."
  ],
  [
    "teoku-temiru",
    "〜ておく versus 〜てみる",
    "aspect",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "予約しておきます",
    "予約してみます",
    "Vorbeugend oder vorbereitend erledigen",
    "Versuchsweise etwas ausprobieren",
    "Zwei Lernende planen die Anmeldung zu einem Workshop.",
    "Mitstudent",
    "neutral höflich",
    "〜ておく stellt Vorbereitung für später dar; 〜てみる betont einen Versuch/Erfahrung ohne garantiertes Ergebnis.",
    [
      [
        "旅行の前にホテルを予約しておきます。",
        "Vor der Reise buche ich vorsorglich ein Hotel.",
        "Vorbereitende Handlung."
      ],
      [
        "新しい店で食べてみます。",
        "Ich probiere Essen im neuen Restaurant.",
        "Erfahrungsversuch."
      ],
      [
        "席があるか聞いてみます。",
        "Ich frage einmal, ob Plätze frei sind.",
        "Versuch statt Reservierung."
      ]
    ],
    "『聞いてみます』 als bereits fest gebuchte Lösung betrachten.",
    "Ein Versuch bestätigt nicht automatisch einen Platz.",
    [
      "Sage: Ich reserviere vorsorglich einen Tisch für morgen.",
      "明日の席を予約しておきます。",
      "明日のために席を予約しておきます。",
      "明日の席を予約してみました。",
      "Die letzte Form stellt den Versuch, nicht sicher die Vorbereitung in den Vordergrund."
    ],
    [
      "Neuer Kontext: Du willst das unbekannte Getränk einmal probieren.",
      "この飲み物を飲んでみます。",
      "新しい飲み物を試してみます。",
      "飲み物を飲んでおきます。",
      "Der Zweck ist Probieren, nicht Vorsorge."
    ],
    "P44 Absichten und P49 Reservierungsdokumente."
  ],
  [
    "teshimau",
    "〜てしまう: Abschluss und Bedauern",
    "aspect",
    null,
    "全部読んでしまいました",
    "鍵を忘れてしまいました",
    "Etwas vollständig erledigt haben",
    "Unerwünschtes Ereignis, Bedauern oder Versehen",
    "Du hast das Buch ausgelesen, dein Freund hat den Schlüssel vergessen.",
    "Freund",
    "auch höflich mit しまいました",
    "Die Konstruktion kann Vollständigkeit hervorheben oder die negative Bewertung einer ungewollten Handlung; Kontext bestimmt.",
    [
      [
        "本を全部読んでしまいました。",
        "Ich habe das Buch ganz ausgelesen.",
        "Abschluss."
      ],
      [
        "切符をなくしてしまいました。",
        "Ich habe leider das Ticket verloren.",
        "Bedauern."
      ],
      [
        "ケーキを全部食べてしまった。",
        "Der Kuchen ist vollständig aufgegessen.",
        "Wegsein/Vollständigkeit, eventuell Bedauern."
      ]
    ],
    "しまう immer als 'versehentlich' verstehen.",
    "Auch erwünschte Vollendung ist möglich.",
    [
      "Entschuldige dich: Du hast den geliehenen Schirm leider vergessen.",
      "借りた傘を忘れてしまいました。すみません。",
      "傘を忘れてしまって、すみません。",
      "傘を忘れておきました。",
      "Vorbereiten passt nicht zur ungewollten Situation."
    ],
    [
      "Andere Situation: Du hast den ganzen Roman bereits fertig gelesen.",
      "小説を全部読んでしまいました。",
      "もう小説を最後まで読んでしまいました。",
      "小説を忘れてしまいました。",
      "Hier geht es um Vollendung, nicht Vergessen."
    ],
    "P47 Hörpassagen zu Fehlentscheidungen."
  ],
  [
    "tearu-teiru",
    "〜てあります versus 〜ています",
    "aspect",
    [
      "p25:library",
      "p26:library-project"
    ],
    "ドアが閉めてあります",
    "ドアが閉まっています",
    "Absichtlich herbeigeführter und relevanter Zustand",
    "Resultierender Zustand ohne Aussage über menschliche Absicht",
    "Eine Übungsraumtür ist geschlossen; im Seminar sind Tische vorbereitet.",
    "Bibliothekspersonal",
    "höflich, passive Beobachtung vermeiden",
    "他動詞てあります betont absichtlich arrangiertes Resultat; 自動詞ています beschreibt den Zustand, unabhängig vom arrangierenden Menschen.",
    [
      [
        "教室にいすが並べてあります。",
        "Im Kursraum sind Stühle bereitgestellt.",
        "Absichtliche Vorbereitung."
      ],
      [
        "ドアが閉まっています。",
        "Die Tür ist zu.",
        "Zustand ohne Absichtsfokus."
      ],
      [
        "机の上に資料が置いてあります。",
        "Unterlagen liegen bereit.",
        "Arrangiertes Ergebnis."
      ]
    ],
    "閉めてあります und 閉まっています als gleiche Verbform ohne Unterschied behandeln.",
    "Transitivität und Vorbereitung sind wesentlich.",
    [
      "Sage: Im Raum sind Unterlagen für die Gruppe bereitgelegt.",
      "部屋に資料が置いてあります。",
      "資料は机の上に置いてあります。",
      "資料が置いています。",
      "Bei arrangiertem Ergebnis ist 置いてあります idiomatisch."
    ],
    [
      "Neue Situation: Das Fenster ist offen, ohne bekannte Person als Ursache.",
      "窓が開いています。",
      "今、窓は開いています。",
      "窓が開けてあります。",
      "Das kann gezielte Vorbereitung suggerieren, die nicht belegt ist."
    ],
    "P49 praktische Aushänge und P50 Vorbereitungsnachrichten."
  ]
] satisfies P51RawContrast[];
export const p51ContrastsA=p51CorpusA.map(authoredP51Contrast);
