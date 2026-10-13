import {authoredP51Contrast,type P51RawContrast} from "./grammar51-types";
/** Original P51 C: permissions, social action roles and obligations. */
export const p51CorpusC=[
  [
    "teii-tekudasai",
    "〜てもいいです versus 〜てください",
    "permission",
    [
      "p25:library",
      "p26:library-project"
    ],
    "ここに座ってもいいですか",
    "ここに座ってください",
    "Um Erlaubnis bitten bzw. Erlaubnis ausdrücken",
    "Jemanden um eine Handlung bitten/anweisen",
    "In einer Bibliothek unterscheidest du, wer einen Stuhl benutzen darf und was das Personal bittet.",
    "Besucher und Bibliotheksmitarbeiter",
    "beide höflich; Erlaubnisfrage mit か",
    "〜てもいいですか fragt nach Erlaubnis; 〜てください ist eine Aufforderung. Eine Bitte ist keine Berechtigungsfrage.",
    [
      [
        "ここに座ってもいいですか。",
        "Darf ich mich hier setzen?",
        "Permission für mich."
      ],
      [
        "こちらに座ってください。",
        "Bitte setzen Sie sich hier.",
        "Anweisung an Gast."
      ],
      [
        "写真を撮ってもいいですよ。",
        "Sie dürfen fotografieren.",
        "Erlaubnis erteilt."
      ]
    ],
    "Eine Bitte nach Erlaubnis als Befehl an die andere Person formulieren.",
    "Das Subjekt und die soziale Handlung müssen zum Kontext passen.",
    [
      "Bitte den Mitarbeiter höflich um Erlaubnis, das Buch mitzunehmen.",
      "この本を持って行ってもいいですか。",
      "この本を借りてもいいですか。",
      "この本を持って行ってください。",
      "Das wäre eine Anweisung an den Mitarbeiter."
    ],
    [
      "Anderer Kontext: Bitte einen Gast, hier zu warten.",
      "ここで待ってください。",
      "こちらでお待ちください。",
      "ここで待ってもいいですか。",
      "Die Frage bittet um eigene Erlaubnis."
    ],
    "P44 soziale Höflichkeit und P49 Bibliotheksregeln."
  ],
  [
    "tewaikenai-nakutewaikenai",
    "〜てはいけません versus 〜なければなりません",
    "permission",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "ここで食べてはいけません",
    "ここで靴を脱がなければなりません",
    "Verbot einer Handlung",
    "Pflicht, eine Handlung auszuführen",
    "Museumsschild und Kursanweisung kombinieren ein Verbot mit einer Pflicht.",
    "Besucher",
    "〜なければなりません eher klar/formell; alltagsnah 〜ないといけません",
    "Verbて形＋はいけません verbietet; Verbない形＋なければなりません verpflichtet. Die Negation der Form ist keine gleiche Bedeutung.",
    [
      [
        "展示室で食べてはいけません。",
        "Im Ausstellungsraum darf man nicht essen.",
        "Verbot."
      ],
      [
        "入口で靴を脱がなければなりません。",
        "Am Eingang muss man Schuhe ausziehen.",
        "Pflicht."
      ],
      [
        "この紙をなくしてはいけません。",
        "Dieses Blatt darf nicht verloren gehen.",
        "Verbot."
      ]
    ],
    "Beide mit 'man darf nicht' übersetzen.",
    "Das eine untersagt, das andere verlangt Handeln.",
    [
      "Formuliere: Im Lesesaal darf man nicht telefonieren.",
      "閲覧室で電話してはいけません。",
      "ここで電話をしてはいけません。",
      "閲覧室で電話しなければなりません。",
      "Das wäre eine Telefonpflicht."
    ],
    [
      "Anderer Ort: Im Labor muss man Schutzbrille tragen.",
      "研究室では保護めがねをかけなければなりません。",
      "保護めがねをかけないといけません。",
      "保護めがねをかけてはいけません。",
      "Das verbietet die Brille."
    ],
    "P49 Formulare und Sicherheitsregeln fiktiver Szenarien."
  ],
  [
    "nakutemoii-nakutewa",
    "〜なくてもいい versus 〜なければならない",
    "permission",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "予約しなくてもいいです",
    "予約しなければなりません",
    "Nicht notwendig, optional",
    "Verbindlich erforderlich",
    "Ein Lesekreis benötigt keine Anmeldung; ein anderer Kurs schon.",
    "Besucher",
    "höfliche Regelbeschreibung",
    "ない形−い＋くてもいい ist Befreiung von Pflicht, ない形−い＋ければならない drückt Pflicht aus.",
    [
      [
        "この会には予約しなくてもいいです。",
        "Für dieses Treffen ist keine Buchung nötig.",
        "Fehlende Pflicht."
      ],
      [
        "この講座は予約しなければなりません。",
        "Dieser Kurs erfordert Reservierung.",
        "Anmeldepflicht."
      ],
      [
        "全部読まなくてもいいです。",
        "Du musst nicht alles lesen.",
        "Teilumfang genügt."
      ]
    ],
    "〜なくてもいい mit 'nicht erlaubt' gleichsetzen.",
    "Nicht müssen ist etwas anderes als nicht dürfen.",
    [
      "Schreibe: Du musst das ganze Buch nicht lesen.",
      "本を全部読まなくてもいいです。",
      "全部読む必要はありません。",
      "本を全部読んではいけません。",
      "Das verbietet das Lesen statt es optional zu machen."
    ],
    [
      "Neuer Workshop: Anmeldung ist zwingend erforderlich.",
      "ワークショップに申し込まなければなりません。",
      "参加する前に予約する必要があります。",
      "予約しなくてもいいです。",
      "Für den neuen Kurs ist Buchung Pflicht."
    ],
    "P49 praktische Dokumentfristen direkt verwenden."
  ],
  [
    "hazu-beki",
    "〜はずです versus 〜べきです",
    "evidence",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "もう届くはずです",
    "早く連絡すべきです",
    "Begründete Erwartung aufgrund von Wissen",
    "Normativer Rat: man sollte",
    "Eine Sendung müsste aufgrund des Plans ankommen; jemand soll Verspätung melden.",
    "Kollege",
    "〜べきです kann bestimmend klingen; vorsichtig bei persönlichen Ratschlägen",
    "〜はず ist erwarteter Sachstand; 〜べき bewertet angemessenes Handeln. Für A2 als rezeptiver Aufbau, aktive Alternative 〜たほうがいい.",
    [
      [
        "予定ではもう着くはずです。",
        "Laut Plan sollte es schon angekommen sein.",
        "Erwartung."
      ],
      [
        "遅れるなら連絡すべきです。",
        "Wer sich verspätet, sollte Bescheid geben.",
        "Verhaltensnorm."
      ],
      [
        "明日は休みのはずですが、確認します。",
        "Morgen müsste frei sein, ich prüfe es.",
        "Erwartung ohne Garantie."
      ]
    ],
    "〜はず als ausdrücklichen Befehl lesen oder 〜べき als sichere Prognose.",
    "Sachprognose und normativer Anspruch unterscheiden.",
    [
      "Drücke aus: Laut Fahrplan müsste der Zug jetzt ankommen.",
      "時刻表では電車がもう着くはずです。",
      "予定では今着くはずです。",
      "電車は今着くべきです。",
      "Das klingt nach normativer Forderung statt Schluss aus Fahrplan."
    ],
    [
      "Neuer Fall: Verspäteter Teilnehmer sollte vorher Bescheid geben.",
      "遅れるなら先に連絡すべきです。",
      "遅れるときは連絡したほうがいいです。",
      "先に連絡するはずです。",
      "Das wäre eine Erwartung über die Person."
    ],
    "P48/50 Terminänderungen mit begrenztem Anspruch."
  ],
  [
    "tehoshii-tai",
    "〜たい versus 〜てほしい",
    "intention",
    [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "食べたいです",
    "作ってほしいです",
    "Eigener Wunsch, selbst etwas zu tun",
    "Wunsch, dass jemand anders etwas tut",
    "Im Café bestellst du selbst, dann möchtest du, dass dein Freund kocht.",
    "Freund und Bedienung",
    "〜てほしい kann fordernd wirken; höfliche Bitte oft besser",
    "Verbます-Stamm＋たい beschreibt eigene Handlung; て形＋ほしい wünscht fremde Handlung.",
    [
      [
        "私は寿司を食べたいです。",
        "Ich möchte Sushi essen.",
        "Subjekt will selbst essen."
      ],
      [
        "友だちに料理を作ってほしいです。",
        "Ich möchte, dass mein Freund kocht.",
        "Eine andere Person soll handeln."
      ],
      [
        "店員さんに教えてほしいです。",
        "Ich möchte, dass mir das Personal hilft/es erklärt.",
        "Wunsch an andere; situationsbedingt höflich umformulieren."
      ]
    ],
    "〜たい auf andere Handlungen übertragen, ohne den Handelnden zu benennen.",
    "Beim Wunsch nach fremder Handlung 〜てほしい wählen; höflich ggf. 〜ていただけますか.",
    [
      "Formuliere: Ich möchte, dass mein Freund mir die Adresse schickt.",
      "友だちに住所を送ってほしいです。",
      "友だちに住所を知らせてほしいです。",
      "私は住所を送りたいです。",
      "Das würde den Handelnden zu dir verschieben."
    ],
    [
      "Neue Situation: Ich selbst möchte im neuen Café essen.",
      "新しいカフェで食べたいです。",
      "そのカフェに行って食べたいです。",
      "友だちに食べてほしいです。",
      "Hier ist es der eigene Wunsch."
    ],
    "P43 Verhandlungen und P45 unabhängige Antworten."
  ],
  [
    "yotei-tsumori",
    "〜予定です versus 〜つもりです",
    "intention",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "金曜日に行く予定です",
    "金曜日に行くつもりです",
    "Geplanter Termin/organisierter Plan",
    "Eigener Entschluss/Absicht",
    "Ein Freund unterscheidet festen Kurskalender und persönliche Reiseabsicht.",
    "Freund und Verwaltungsstelle",
    "neutral höflich; beides nicht automatisch garantiert",
    "〜予定だ beschreibt einen Plan im Kalender/Arrangement; 〜つもりだ betont Absicht. Auch 予定 kann geändert werden, つもり ist keine Zusage anderer.",
    [
      [
        "講座は金曜日に始まる予定です。",
        "Der Kurs ist für Freitag geplant.",
        "Organisatorischer Plan."
      ],
      [
        "来年、日本へ行くつもりです。",
        "Ich habe vor, nächstes Jahr nach Japan zu reisen.",
        "Persönlicher Entschluss."
      ],
      [
        "明日は休むつもりですが、まだ先生に話していません。",
        "Ich will morgen fehlen, habe es aber noch nicht besprochen.",
        "Absicht ist nicht bestätigte Erlaubnis."
      ]
    ],
    "〜つもり zu einer verbindlichen Buchung anderer machen.",
    "Intention und arrangierte Veranstaltung unterscheiden.",
    [
      "Sage, dass du nächstes Jahr Japanisch weiterlernen willst.",
      "来年も日本語を勉強するつもりです。",
      "来年も勉強を続けるつもりです。",
      "日本語の授業は必ずあります。",
      "Deine Absicht garantiert keinen Kurs."
    ],
    [
      "Neuer Kontext: Laut Programm beginnt das Konzert am Samstag um 17 Uhr.",
      "コンサートは土曜日の五時に始まる予定です。",
      "土曜日の午後五時からの予定です。",
      "私は土曜日にコンサートを始めるつもりです。",
      "Ein Kursprogramm ist kein persönlicher Entschluss."
    ],
    "P49 Ankündigung und P50 unbestätigte Optionen."
  ],
  [
    "kudasai-itadakemasuka",
    "〜てください versus 〜ていただけますか",
    "social",
    [
      "p25:appointment",
      "p23:routine"
    ],
    "説明してください",
    "説明していただけますか",
    "Direkte höfliche Bitte/Aufforderung",
    "Zurückhaltendere Frage nach der Möglichkeit einer Gefälligkeit",
    "Du bittest einen Kollegen und eine offizielle Servicestelle um dieselbe Information.",
    "Kollege und Schalterpersonal",
    "〜ていただけますか besonders zurückhaltend im Dienstleistungskontext",
    "Beide können freundlich sein, aber いただけますか rückt die Belastung der anderen Person und Zustimmung stärker in den Vordergrund.",
    [
      [
        "もう一度説明してください。",
        "Bitte erklären Sie noch einmal.",
        "Direkte Bitte."
      ],
      [
        "もう一度説明していただけますか。",
        "Könnten Sie es bitte erneut erklären?",
        "Höfliche Gefälligkeit."
      ],
      [
        "少し待ってください。",
        "Bitte warten Sie kurz.",
        "Serviceanweisung."
      ]
    ],
    "〜てください als grundsätzlich unhöflich einstufen.",
    "Situation und Rolle bestimmen die natürliche Stärke.",
    [
      "Bitte im Amt besonders höflich um langsamere Erklärung.",
      "もう少しゆっくり説明していただけますか。",
      "ゆっくり話していただけますか。",
      "ゆっくり話して。",
      "Die letzte Form ist für eine unbekannte Amtsperson zu direkt."
    ],
    [
      "Neuer Fall: Als Leiter bitte Teilnehmer höflich direkt, hier kurz zu warten.",
      "ここで少し待ってください。",
      "こちらでお待ちください。",
      "ここで待っていただけますか。",
      "Die Alternative ist ebenfalls höflich, aber die Rolle erlaubt eine direkte Anweisung."
    ],
    "P44 soziale Registerkontraste und P47 Servicegespräche."
  ],
  [
    "morau-kureru",
    "〜てもらう versus 〜てくれる",
    "social",
    [
      "p25:library",
      "p26:library-project"
    ],
    "友だちに教えてもらいました",
    "友だちが教えてくれました",
    "Hilfe erhalten aus Sicht des Empfängers",
    "Helfer als Handelnder, der mir/uns etwas zugutekommt",
    "Ein Kommilitone hat die Aufgaben erklärt und du erzählst davon.",
    "Freund",
    "neutral, mit もらいました / くれました höflich",
    "〜てもらう: Empfänger が oder は, Helfer に; 〜てくれる: Helfer が, Empfänger oft implicit. Perspektive auf dieselbe Hilfe verändert die Satzstruktur.",
    [
      [
        "友だちに宿題を教えてもらいました。",
        "Ein Freund hat mir bei Hausaufgaben geholfen (ich erhielt Hilfe).",
        "Ich bin Empfänger."
      ],
      [
        "友だちが宿題を教えてくれました。",
        "Ein Freund hat mir die Hausaufgaben erklärt (er half mir).",
        "Freund als Handelnder."
      ],
      [
        "先生に日本語を直してもらいました。",
        "Ich ließ mir das Japanisch korrigieren.",
        "Erhaltene Hilfe."
      ]
    ],
    "Bei 〜てくれる denselben Helfer einfach mit に wie bei 〜てもらう markieren.",
    "Die Partikeln folgen der Perspektive.",
    [
      "Sage aus Empfängersicht: Die Lehrerin hat mir meinen Text verbessert.",
      "先生に作文を直してもらいました。",
      "先生に作文を見てもらいました。",
      "先生が作文を直してもらいました。",
      "先生 ist Helferin, nicht Empfängerin."
    ],
    [
      "Neue Situation: Ein Freund hat für dich eine Karte gekauft (Helferperspektive).",
      "友だちが切符を買ってくれました。",
      "友だちが私のために切符を買ってくれました。",
      "友だちに切符を買ってくれました。",
      "Bei くれる ist der Handelnde mit が markiert."
    ],
    "P44 Dankesreaktionen und P45 längere Gespräche."
  ],
  [
    "ageru-kureru",
    "〜てあげる versus 〜てくれる",
    "social",
    [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "友だちを手伝ってあげました",
    "友だちが手伝ってくれました",
    "Ich helfe jemand anderem (aus meiner Perspektive)",
    "Jemand hilft mir oder meiner Gruppe",
    "Zwei Studierende beschreiben dieselbe Hilfe aus entgegengesetzten Rollen.",
    "Freund",
    "〜てあげる kann sich selbstlobend anhören; nicht bei jeder höheren Person natürlich",
    "Geben der Gefälligkeit versus Empfang. Wer handelt und wer profitiert muss im Satz klar sein.",
    [
      [
        "私は妹に宿題を教えてあげました。",
        "Ich half meiner kleinen Schwester mit Hausaufgaben.",
        "Meine Hilfe für jemand anderen."
      ],
      [
        "妹が私を手伝ってくれました。",
        "Meine Schwester half mir.",
        "Hilfe zu mir hin."
      ],
      [
        "友だちが道を案内してくれました。",
        "Ein Freund zeigte mir den Weg.",
        "Empfangene Hilfe."
      ]
    ],
    "〜てあげる benutzen, um zu sagen, dass andere mir halfen.",
    "Die Hilfsrichtung kehrt sich um.",
    [
      "Sage: Ein Kollege hat mir beim Umzug geholfen.",
      "同僚が引っ越しを手伝ってくれました。",
      "友だちが引っ越しを手伝ってくれました。",
      "私は同僚を手伝ってあげました。",
      "Das bedeutet, du halfst dem Kollegen."
    ],
    [
      "Neuer Kontext: Du hast deinem Bruder das Handy eingerichtet.",
      "弟にスマホの設定をしてあげました。",
      "弟のスマホを設定してあげました。",
      "弟がスマホを設定してくれました。",
      "Die letzte Form vertauscht den Helfer."
    ],
    "P40–P45 soziale Akteursrollen."
  ],
  [
    "deshou-kamoshirenai",
    "〜でしょう versus 〜かもしれません",
    "evidence",
    null,
    "明日は晴れるでしょう",
    "明日は雨が降るかもしれません",
    "Vermutung/Prognose, oft mit Erwartung",
    "Bloße Möglichkeit ohne starke Erwartung",
    "Ein Wetterbericht beschreibt wahrscheinliches Wetter, du leitest eine Alternative ab.",
    "Reisende",
    "〜でしょう kann in Prognosen sachlicher wirken; Kontexte unterscheiden sich",
    "Beide markieren Unsicherheit, でしょう oft prognostische Einschätzung, かもしれません eine Möglichkeit ohne vergleichbaren Erwartungsgrad.",
    [
      [
        "明日は晴れるでしょう。",
        "Morgen wird es wahrscheinlich sonnig.",
        "Prognose."
      ],
      [
        "午後は雨が降るかもしれません。",
        "Nachmittags könnte es regnen.",
        "Mögliches Ereignis."
      ],
      [
        "バスはもう来るでしょう。",
        "Der Bus wird vermutlich bald kommen.",
        "Erwartung."
      ]
    ],
    "〜でしょう stets wie ein garantiertes Futur behandeln.",
    "Ein Prognosemarker ist keine Buchungsbestätigung.",
    [
      "Sage: Es könnte heute später schneien, aber das ist nicht sicher.",
      "あとで雪が降るかもしれません。",
      "今日は雪になるかもしれません。",
      "今日は必ず雪が降ります。",
      "Vielleicht ist nicht zwingend."
    ],
    [
      "Neue Situation: Aufgrund des Plans wird der Lehrer wahrscheinlich bald kommen.",
      "先生はもうすぐ来るでしょう。",
      "もうすぐ先生が来ると思います。",
      "先生は絶対に来ます。",
      "Die Prognose garantiert nicht die Ankunft."
    ],
    "P50 unsichere Ersatzverbindungen."
  ]
] satisfies P51RawContrast[];
export const p51ContrastsC=p51CorpusC.map(authoredP51Contrast);
