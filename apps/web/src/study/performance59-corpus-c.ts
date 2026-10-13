import {authoredP59Compact,type P59Compact} from "./performance59-types";
/** 15–21: multi-party obligations, changed constraints, institutional register. */
const raw:readonly P59Compact[]=[
["connecting-trains","乗り換えの時間が足りません","p25:transport","電車と乗り換え","polite",
"Zwei Bahnlinien und eine zeitweilige Baustelle erfordern mehr als eine bloße Abfahrtskorrektur.",
"Fahrt, Anschluss, Umsteigeweg und erst bestätigte Alternative eigenständig erklären",
[
["駅の時刻表","大阪行きの電車は九時四十分に二番線から出ます。京都で十時二十分発の電車に乗り換えられます。","Alter Plan: Osaka-Zug 9:40 Gleis 2, in Kyoto Anschluss 10:20."],
["新しい工事案内","今週は京都駅の連絡通路が一部使えません。乗り換えには普通より十分ほど長くかかります。","Bauhinweis: Einige Kyoto-Umsteigewege gesperrt, etwa zehn Minuten mehr Transferzeit."],
["交通会社の説明","乗り換えに間に合わない場合は、次の便について窓口で確認してください。新しい切符が必要かどうかも相談できます。","Bahnauskunft: Bei verpasstem Anschluss nächste Verbindung und Ticketbedingungen am Schalter klären."]],
[
["ケン","最初の電車が十分遅れているよ。京都で乗り換えられるか心配だね。","Ken: Erster Zug zehn Minuten verspätet, Anschluss unsicher."],
["ミオ","新しい通路も遠いから、急いで危ない所を通るより駅員さんに聞こう。","Mio: Neue Wege länger; Sicherheit vor riskantem Rennen."]],
[
["駅員","九時四十分の電車は今、九時五十分発になる予定です。二番線は変わりません。","Personal: 9:40-Zug voraussichtlich 9:50, Gleis 2 unverändert."],
["ケン","十時二十分の乗り換えは間に合いますか。","Ken: Klappt Anschluss 10:20?"],
["駅員","その時間は難しいかもしれません。十一時発の次の電車なら空席があります。","Personal: Anschluss könnte schwierig werden; im Zug 11 Uhr Plätze verfügbar."],
["ミオ","次の電車に変更できるか、切符の条件を確かめてから決めよう。","Mio: Umbuchungsbedingungen prüfen, nicht einfach einsteigen."]],
[
["chronology","最初の電車の最新の出発予定は何時ですか。","九時五十分です。","九時五十分の予定です。","九時四十分のままです。","Alte Liste wurde durch aktuelle Durchsage überholt.","九時四十分に二番線","九時五十分発になる予定です"],
["status","十一時の電車への変更はもう完了しましたか。","いいえ、条件を確認する必要があります。","いいえ、まだ窓口で相談していません。","はい、空席があるので予約済みです。","Sitzverfügbarkeit ≠ bestätigter Tickettausch.","新しい切符が必要かどうか","変更できるか、切符の条件を確かめて"],
["inference","十時二十分の乗り換えを必ず利用できると考えてよいですか。","いいえ、遅れと通路の工事があるからです。","いいえ、乗り換えが難しい可能性があります。","はい、二番線が変わらないからです。","Gleis der ersten Fahrt beantwortet nicht Anschlusszeit.","十分ほど長くかかります","その時間は難しいかもしれません"]
],
["Wähle eine selbständige, sichere Verkehrslösung.","九時五十分発の電車に乗り、京都で間に合わなければ十一時の便への変更を窓口で確認します。","危ない通路は使わず、次の便の条件を聞きます。","十一時の便はもう予約したので走ります。","Bedingungen und Sicherheit kombinieren."],
["Verfasse drei japanische Sätze an eine wartende Person.","最初の電車が九時五十分発になる予定です。乗り換えは工事で時間がかかるので、十時二十分の便に間に合わないかもしれません。次の便を確認して連絡します。","電車が遅れる可能性があります。切符の変更について駅で聞いてから知らせます。","十時二十分に必ず到着します。","Nur belegte Prognose."],
["駅員","十一時の便に変更できますが、窓口で手続きが必要です。発車の十分前までに来てください。","Personal: 11-Uhr-Umstieg möglich, Schalterumbuchung bis 10:50.","Passe Handlungsplan an verbindliche Frist an.","ありがとうございます。十時五十分までに窓口で手続きしてから、十一時の便に乗ります。","承知しました。窓口で変更してから向かいます。","手続きせず十一時に乗ります。","Neue Schalterpflicht mit Frist."],
["十一時には席があるので、切符を変えずに必ず乗れます。","Korrigiere fehlende Umbuchung und alte Sicherheit.","十一時の便には空席がありますが、十時五十分までに窓口で変更手続きが必要です。","切符を確認してから十一時の便を利用します。","Verfügbarkeit ohne wirksame Änderung unzureichend."],
["Neuer Flughafentransfer: Bus 12:10 wird 12:30, Anschluss 13 Uhr knapp, nächster Bus 14 Uhr erfordert Umbuchung am Schalter.","十二時半のバスに変更されたので、乗り換えを確認します。難しければ窓口で二時の便に変更します。","新しい便への変更を確認してから移動します。","二時の席があるので手続きは不要です。","Andere Modalität, klare Frist."],
"乗り換えの確実性・運行予定・切符の有効性 sind unabhängige Aussagen.",["norikae","jikokuhyou","henkou"]],
["workshop-access","交流会の二つの入口","p25:directions","市民センター","polite",
"Veranstaltung hat begrenzte Plätze, verschiedene Zugänge und einen kurzfristig veränderten Einlass.",
"Eintrittsberechtigung, Barrierefreiheit und Startzeit getrennt prüfen",
[
["交流会の案内","土曜日の交流会は午後二時からです。会場は市民センターの二階です。参加には確認メールが必要です。","Veranstaltungshinweis: Samstag 14 Uhr, zweiter Stock, Teilnahme nur mit Bestätigungsmail."],
["施設のご案内","正面の階段は工事中です。エレベーターを使う方は、建物の東口からお入りください。","Gebäudeinfo: Haupttreppe gesperrt; Fahrstuhlzugang über Osttor."],
["定員のお知らせ","一度の交流会には二十人まで参加できます。申し込みを送っただけでは席は確定しません。","Kapazität 20; bloße Anmeldung bestätigt keinen Platz."]],
[
["ユキ","私は確認メールを受け取ったけど、友達はまだなんだ。二人で行ってもいいのかな。","Yuki: Ich habe Bestätigung, Freundin nicht; zwei teilnehmen?"],
["サラ","友達の席も決まったか確認してから誘った方がいいね。","Sara: Freundesplatz separat prüfen."]],
[
["受付","確認メールをお持ちの方は、東口でお名前をお伝えください。","Empfang: Bestätigte Gäste am Osteingang mit Namen melden."],
["ユキ","友達は申し込んでいますが、まだメールが来ていません。","Yuki: Freundin hat beantragt, keine Mail."],
["受付","今は満席です。その方には次回をご案内します。","Empfang: Derzeit voll, Freundin auf Folgeveranstaltung verweisen."],
["サラ","では、今回入れるのはユキさんだけだね。","Sara: Diesmal nur Yuki sicher zugelassen."]],
[
["status","二人とも今回参加できますか。","いいえ、ユキさんだけです。","いいえ、友達は確認されていません。","はい、申し込んだから二人とも入れます。","Anmeldestatus personengebunden.","申し込みを送っただけでは席は確定しません","今は満席です"],
["evidence","エレベーターを使う人はどの入り口ですか。","東口です。","東の入り口から入ります。","正面の階段です。","Konkret zugeordneter Zugang.","エレベーターを使う方は","東口でお名前を"],
["chronology","交流会はいつ始まりますか。","土曜日の午後二時です。","土曜日の十四時です。","日曜日の二時です。","Zeit unverändert.","土曜日の交流会は午後二時","確認メールをお持ちの方は"]
],
["Empfiehl eine verantwortliche Teilnahmeentscheidung.","ユキさんは確認メールを持って東口から入れます。友達には次回の案内を伝えます。","友達の参加は今回できないので、別の機会を相談します。","二人で正面階段から入ります。","Personen, Zugang, Erlaubnis."],
["Schreibe höfliche mehrsätzige Antwort an Anmeldung.","私の参加確認メールは届いています。友達の席はまだなく、今回は満席とのこと、承知しました。友達には次回の案内をお願いできますか。","今回の参加について確認しました。東口から受付に向かいます。","友達の申し込みも参加の確定です。","Bescheid ohne Forderung."],
["受付","次回の交流会は来週の金曜日ですが、また申し込みが必要です。","Empfang: Nächstes Treffen kommenden Freitag, neue Anmeldung nötig.","Gib neuen Teilnahmeweg korrekt weiter.","ありがとうございます。来週の金曜日は新しく申し込む必要があると友達に伝えます。","次回の案内を確認してから申し込みます。","次回は自動的に参加が決まります。","Neuer Tag ohne automatische Übertragung."],
["今週の友達の申し込みで来週の席も確定している。","Repariere fehlende automatische Übertragung.","今回の友達の席はありません。来週参加するなら、もう一度申し込む必要があります。","来週の申し込みを確認します。","Neue Buchungskette."],
["Andere Kunstgruppe: Mittwoch 18 Uhr, Halle Westzugang, eigene Anmeldung für jede Person, nächste Woche neu anmelden.","参加できるか一人ずつ確認し、次の回も別に申し込みます。","西口の受付へ確認メールを持って行きます。","友達の申し込みだけで全員入れます。","Andere Zeit, anderer Zugang."],
"同伴者の申請は本人の確認メールではない; Zugangsweg bleibt unabhängig.",["sanka","kakunin","moushikomi"]],
["laptop-service","修理の見積もりを待つ","p25:shopping","修理サービス","service",
"Elektronikreparatur: Kostenvoranschlag und Reparaturbeginn benötigen getrennte Einwilligungen.",
"Empfangsbestätigung, geplanten Preis und tatsächlichen Auftrag unterscheiden",
[
["修理店の案内","パソコンの点検には三日ほどかかります。修理費用は点検後にお知らせします。","Werkstatt: Diagnose etwa drei Tage, Reparaturkosten erst danach."],
["受付の規則","点検が終わっても、お客様の許可が出るまでは修理を始めません。","Werkstattregel: Keine Reparatur ohne Zustimmung des Kunden, selbst nach Diagnose."],
["受取方法","修理が終わったらメールでお知らせします。お客様は受付番号を持って店に来てください。","Abholung: Mail nach Abschluss, Kundin bringt Nummer zum Laden."]],
[
["客","月曜日にパソコンを預けました。木曜日に仕事で使いたいのですが、間に合うでしょうか。","Kunde: Laptop Montag abgegeben, braucht Donnerstag; fragt nach Realisierbarkeit."],
["店員","預かったことは確認しましたが、修理を始めたわけではありません。","Personal schriftlich: Annahme bestätigt, Reparatur noch nicht begonnen."]],
[
["技術者","点検で部品の交換が必要だとわかりました。費用は八千円ぐらいです。","Techniker: Teil muss ersetzt werden, etwa 8000 Yen."],
["客","その金額で修理できるか、確定した見積もりをいただけますか。","Kunde: Kann ich festen Kostenvoranschlag erhalten?"],
["技術者","正確な金額を確認してからご連絡します。許可が出たら修理します。","Techniker: Erst endgültigen Betrag klären, dann nach Zustimmung reparieren."],
["店員","作業の開始はまだです。お急ぎなら別の方法も相談できます。","Personal: Arbeit noch nicht gestartet, bei Eile andere Optionen."]],
[
["status","パソコンの修理はもう始まりましたか。","いいえ、まだ許可を待っています。","いいえ、点検が終わっただけです。","はい、預けたので修理中です。","Abgabe und Auftrag getrennt.","許可が出るまでは修理を始めません","作業の開始はまだです"],
["evidence","八千円は必ず最終的な金額ですか。","いいえ、まだおおよその費用です。","いいえ、正確な見積もりを確認中です。","はい、必ず八千円です。","ぐらい signalisiert Schätzung.","修理費用は点検後にお知らせします","費用は八千円ぐらいです"],
["chronology","修理を始める前に何を確認しますか。","正確な費用とお客様の許可です。","見積もりを確認し、許可します。","受付番号を返してもらいます。","Einwilligung vor Arbeit.","お客様の許可が出るまでは","許可が出たら修理します"]
],
["Wähle eine budgetbewusste Reaktion.","まず正確な見積もりを確認してから、修理するか決めます。","金額と時間を確認してから許可します。","八千円で修理はもう終わりました。","Keine Kosten oder Abschluss erfinden."],
["Schreibe 2–3 höfliche Sätze an den Service.","点検のご連絡ありがとうございます。修理の正確な費用と、終わる予定の日を教えていただけますか。確認してから修理をお願いするか決めます。","見積もりを確認してから、お返事します。","すでに修理に同意し、受け取りました。","Kostenzusage ausdrücklich offenlassen."],
["店員","部品が入荷するのは来週です。今週中に修理を終えることはできません。","Werkstatt: Ersatzteil erst nächste Woche; diese Woche kein Abschluss.","Reagiere auf neue Frist.","承知しました。今週は無理なのですね。来週の予定と費用を確認してから判断します。","仕事で必要なので、代わりのパソコンについて相談したいです。","木曜日には必ず修理が終わります。","Neue Lieferbedingung."],
["点検したので木曜日に八千円で修理が終わると決まりました。","Korrigiere sowohl Betrag als auch Frist.","見積もりはまだ確定しておらず、部品は来週届く予定です。修理するか確認中です。","今週中には終わらないと連絡がありました。","Drei unabhängige Unsicherheiten."],
["Neue Fahrradwerkstatt: Diagnose fertig, 12000-Yen-Kosten geschätzt, Kundenfreigabe fehlt, Teil erst Freitag.","点検は終わりましたが、正確な費用と修理の許可はまだです。部品は金曜日の予定です。","見積もりを確認してから決めます。","金曜日に必ず修理済みです。","Andere Werkstatt und Zahlen."],
"預けました ≠ 修理が始まりました; 金額の見積もり ≠ 請求額確定.",["shuuri","kakunin","yotei"]],
["park-cleanup","公園の清掃と雨の可能性","p23:routine","ボランティア","casual",
"Zwei gemeinnützige Gruppen organisieren Müllsammeln, behalten Sicherheit und Wetterumplanung bei.",
"Ort, Aufgabenverteilung, Zustimmung und Sicherheitsgrenzen ohne Fantasie koordinieren",
[
["清掃のお知らせ","日曜日の朝九時に川の公園で清掃をします。参加する人は手袋と飲み物を持って来てください。","Aushang: Sonntag 9 Uhr Flusspark reinigen, Handschuhe/Getränke."],
["安全について","川の近くには危ない場所があります。大きなごみやガラスには触らず、係員に知らせてください。","Sicherheit: Am Fluss gefährliche Stellen; große Abfälle/Glas nicht anfassen, Personal melden."],
["天気の案内","雨が強い場合は、前日の夕方に中止か延期かをお知らせします。","Wetterregel: Bei starkem Regen am Vorabend Absage oder Verschiebung."]],
[
["ナオ","私は十時までなら手伝えるよ。軽いごみを集めたい。","Nao: Kann nur bis zehn helfen, leichte Abfälle sammeln."],
["アキ","川の近くは私たちだけで行かない方がいいね。担当者に聞こう。","Aki: Am Fluss nicht ohne Anleitung hin."]],
[
["係員","川の近くは専門の人が担当します。皆さんは広場の紙ごみをお願いします。","Personal: Fachleute am Fluss, Helfende Papier auf Platz."],
["ナオ","一時間だけでも参加できますか。","Nao: Ist eine Stunde Hilfe möglich?"],
["係員","はい。九時から十時までで大丈夫です。ただし、雨の時は朝出る前に連絡を確認してください。","Personal: 9–10 Uhr okay, bei Regen vor Aufbruch Nachricht prüfen."],
["アキ","了解。危ない物には触らず、雨の案内も見てから行こう。","Aki: Keine gefährlichen Gegenstände berühren, Regenansage prüfen."]],
[
["evidence","参加者が担当するのはどの場所ですか。","広場です。","広場の紙ごみを集めます。","川の危ない場所です。","Klare Aufgabenverteilung.","大きなごみやガラスには触らず","皆さんは広場の紙ごみを"],
["status","ナオさんは一時間だけ参加できますか。","はい、九時から十時までです。","はい、一時間でも大丈夫です。","いいえ、必ず一日中です。","Individuelle zeitliche Zusage.","私は十時までなら","九時から十時までで大丈夫です"],
["chronology","強い雨の時、出発前に何をしますか。","新しい連絡を確認します。","中止か延期の案内を見ます。","確認せず必ず行きます。","Wetter ist bedingt.","前日の夕方に","朝出る前に連絡を確認してください"]
],
["Plane die Teilnahme korrekt.","九時から十時まで広場を手伝います。危ない物には触らず、出発前に雨の案内を確認します。","安全な作業だけして、天気を見てから向かいます。","川のガラスを一人で全部拾います。","Keine gefährliche Aufgabe vorschlagen."],
["Schreibe informelle Gruppenmitteilung mit Zeit, Wetterstatus und Sicherheitsgrenze.","日曜日は九時から公園を掃除する予定だよ。強い雨の時は連絡が来るから、出発前に確認しよう。川の近くの危ないごみには触らないでね。","私は十時まで手伝うよ。安全な広場のごみを集めよう。","雨でも絶対に行って川のガラスを拾うよ。","Konditional und Sicherheit."],
["係員","天気予報が変わったので、清掃は来週の日曜日に延期します。時間は九時のままです。","Personal: Wegen Wetter auf nächsten Sonntag verschoben, Beginn bleibt 9 Uhr.","Respektiere tatsächlich bestätigte Verschiebung.","わかったよ。今週は行かず、来週の日曜日の九時に参加できるか確認するね。","教えてくれてありがとう。来週の予定を調べるよ。","今週の日曜日に必ず行くよ。","Zukünftige Arbeit statt heutige."],
["雨が降るかもしれないだけなので、今週も予定どおり清掃します。","Korrigiere den tatsächlich bestätigten Verschiebungsbeschluss.","清掃は来週の日曜日に延期になりました。時間は九時からです。","今週は中止なので、来週の参加予定を確認します。","Hinweis ist nun offizielle Verschiebung."],
["Andere Aktion: Samstag 14 Uhr Bachreinigung, bei Wind offiziell auf Mittwoch 16 Uhr verschoben; nur Wege säubern.","清掃は水曜日の四時に変更されました。危ない川の中には入りません。","新しい日と安全な作業を確認します。","土曜日に川へ入ります。","Andere Wetterursache und Uhrzeit."],
"予定の安全条件＋実際に決まった延期は個別に判断.",["sanka","henkou","kakunin"]],
["language-club","会話クラブで質問する","p23:introduction","日本語の学び","polite",
"Ein Lernclub bietet reale begrenzte Übungschancen; Lernfortschritt wird reflektiert ohne fingiertes Können.",
"Eigenes Ziel und tatsächliche Kursanmeldung unabhängig ausdrücken",
[
["クラブの案内","木曜日の夜七時から日本語会話クラブがあります。初めての方は事前にお申し込みください。","Club: Donnerstag 19 Uhr Konversation; neue Teilnehmer müssen vorab anmelden."],
["練習内容","今月は質問の聞き返しと、短い話を自分の言葉でまとめる練習をします。","Inhalte: Rückfragen und kurze Zusammenfassungen in eigenen Worten."],
["参加の注意","一回の定員は十人です。申し込み後の確認メールで参加が確定します。","Kapazität zehn, erst Bestätigungsmail sichert Platz."]],
[
["ソラ","最近は短い質問なら答えられるけど、長い説明はまだ難しいです。","Sora: Kurze Fragen klappen, lange Erklärungen noch schwer."],
["ハナ","私も同じだよ。わからない時にもう一度言ってもらう練習をしたい。","Hana: Will üben, bei Verständnisproblemen um Wiederholung zu bitten."]],
[
["先生","今回のクラブでは二人で短い会話をして、それを相手に説明します。","Lehrkraft: Dialog zu zweit, anschließend Partnerinhalt wiedergeben."],
["ソラ","知らない言葉があったら、聞き返してもいいですか。","Sora: Darf ich bei unbekanntem Wort nachfragen?"],
["先生","もちろんです。『もう一度ゆっくりお願いします』と言って大丈夫です。","Lehrkraft: Natürlich, 'Bitte noch einmal langsam' passt."],
["ハナ","まず参加を申し込んで、メールを確認しよう。","Hana: Erst anmelden, Mail prüfen."]],
[
["intent","二人はどんな練習をしたいですか。","わからない時に聞き返す練習です。","短い会話を説明する練習です。","話さずに全部暗記することです。","Eigene Lernabsicht vs tatsächliche Übung.","質問の聞き返しと","もう一度ゆっくりお願いします"],
["status","申し込みを送れば参加が確定しますか。","いいえ、確認メールが必要です。","いいえ、定員があります。","はい、すぐ確定します。","Anmeldung ≠ bestätigter Platz.","確認メールで参加が確定します","まず参加を申し込んで"],
["speaker","ゆっくり話してもらう言い方を教えたのは誰ですか。","先生です。","クラブの先生です。","ソラさんが禁止しました。","Sprecher und Unterrichtsrolle.","短い話を自分の言葉で","もう一度ゆっくりお願いします"]
],
["Kommunikativer Lernschritt wählen.","わからない時は聞き返し、相手の話を短くまとめる練習をします。参加はメールで確認します。","自分の目標を伝えて、申し込みます。","全部理解できるので確認は不要です。","Lernziele ohne Meisterschaftsbehauptung."],
["Schreibe höfliche Kurzvorstellung an Club: Was klappt, was fehlt, welches Ziel?","短い質問なら少し答えられますが、長い話はまだ難しいです。わからない時に聞き返して、自分の言葉で説明する練習をしたいです。参加方法を教えていただけますか。","日本語をもっと練習したいので、クラブに参加したいです。申し込みを確認します。","日本語はもう全部完璧に理解できます。","Authentische Selbsteinschätzung statt Zertifizierung."],
["クラブ係","今週は満席になりましたが、来週の木曜日ならまだ申し込めます。","Clubverwaltung: Diese Woche ausgebucht, kommende Woche Anmeldung möglich.","Antworte mit neuer Anmeldechance ohne Garantie.","ご連絡ありがとうございます。来週の木曜日に申し込みたいです。確認メールをお待ちしています。","今回は残念ですが、次回の案内をお願いします。","今週も参加が決まりました。","Neue Frist und erneute Anmeldung."],
["クラブから返事が来たので、今週の席は確定し、もう日本語が上手です。","Korrigiere Absage und unbelegte Kompetenz.","今週は満席です。来週の参加を申し込み、返事を待ちます。会話の練習を続けたいです。","次回に申し込みたいです。まだ長い話は難しいです。","Weder Platz noch Sprachlevel erfinden."],
["Neue englische Gesprächsgruppe: Mittwoch voll, Freitag Anmeldung offen; gutes Lesen, spontanes Reden schwierig.","水曜日は満席なので、金曜日に参加できるか申し込みます。読むのは少し上達しましたが、話す練習を続けます。","確認を待ってから参加します。","水曜日に参加が確定し、全部話せます。","Andere Sprache und Fertigkeit."],
"質問ができるようになった ≠ 長い会話を完全に理解できる.",["shitsumon","mokuhyou","sanka"]],
["public-sign-authorization","地域の掲示を修正する","p26:library-project","公的な案内","polite",
"Vereinsplakat hat falsche Uhrzeit und benötigt Freigabe, bevor öffentlich neu veröffentlicht wird.",
"Falsches Detail, neues Datum und erforderliche Endkontrolle transparent erklären",
[
["町内会の古いポスター","日曜日の古本市は朝九時から午後二時まで、市民広場で行います。入場は無料です。","Altes Poster: Sonntags-Bücherbasar 9–14 Uhr, Stadtplatz, kostenlos."],
["施設の最新情報","日曜日は広場の工事があるため、市民ホールが利用できます。ホールは午前十時からしか開いていません。","Neue Gebäudemeldung: Wegen Bauarbeiten Halle verfügbar, öffnet erst 10 Uhr."],
["広報ルール","会場や時間を変更した場合は、新しい案内を公開する前に担当者が内容を確認します。","Kommunikationsregel: Änderungen von Ort/Zeit müssen vor Publikation durch Verantwortliche geprüft werden."]],
[
["エリ","ポスターの場所をホールに直したけど、開始時間はまだ九時のままになっているよ。","Eri: Ort zur Halle korrigiert, Uhrzeit noch irrtümlich 9 Uhr."],
["ユウ","では十時に変更して保存するね。担当者から許可をもらってから公開しよう。","Yu: Auf 10 Uhr ändern, speichern; erst nach Freigabe publizieren."]],
[
["担当","ホールの使用許可は出ています。ただし、開始は十時で、終了は午後一時にしてください。","Verantwortliche: Hallengenehmigung, 10–13 Uhr."],
["エリ","では、十時から一時までのポスターに変更します。","Eri: Ändert auf 10–13 Uhr."],
["担当","修正後のポスターを見せてください。公開するかはその後に決めます。","Verantwortliche: Bitte Endfassung vorlegen, Publikationsentscheidung später."],
["ユウ","わかった。今は保存だけして、公開はしないよ。","Yu: Bis dahin nur gespeichert, nicht publiziert."]],
[
["chronology","最新の開催時間は何時から何時までですか。","午前十時から午後一時までです。","十時から十三時までです。","九時から二時までです。","Neuere Genehmigung verändert Anfang und Ende.","ホールは午前十時からしか","開始は十時で、終了は午後一時"],
["status","修正後のポスターはもう公開されていますか。","いいえ、まだ保存しただけです。","いいえ、担当者の確認待ちです。","はい、修正したので公開済みです。","Speichern ≠ veröffentlichen.","公開する前に担当者が内容を確認","公開はしないよ"],
["evidence","何が最終確認の対象ですか。","修正後のポスターです。","新しい会場と時間を書いたポスターです。","古い印刷物だけです。","Freigabe betrifft letzte Fassung.","新しい案内を公開する前に","修正後のポスターを見せてください"]
],
["Wähle verantwortliche Veröffentlichungskette.","会場をホール、時間を十時から一時に直し、担当者に確認してもらってから公開します。","保存しただけなので、確認の返事を待ちます。","古い九時のまま公開します。","Genehmigung und Vollzug."],
["Formuliere 3 höfliche japanische Sätze an verantwortliche Person.","古い案内には時間の間違いがありました。会場を市民ホールに、時間を午前十時から午後一時までに修正しました。公開する前にご確認いただけますか。","修正したポスターを保存しました。まだ公開していないので、ご確認をお願いします。","もう公開しましたので確認は不要です。","Transparente Korrektur ohne unautorisierte Publikation."],
["担当","内容を確認しました。時間は正しいですが、問い合わせ先も書いてから公開してください。","Verantwortliche: Zeit geprüft; vor Publikation Kontaktmöglichkeit ergänzen.","Passe letzten zusätzlichen Schritt an.","ご確認ありがとうございます。問い合わせ先を追加し、もう一度内容を確認してから公開します。","承知しました。連絡先を記載します。","連絡先を入れずに公開します。","Neuere konkrete Bedingung."],
["時間を直したから、連絡先なしで広場のポスターを公開してもいいです。","Korrigiere alten Ort und fehlenden Kontakt.","会場はホールです。問い合わせ先を追加し、最終確認してから公開します。","まだ公開せず、最後の指示を反映します。","Sachstand ohne fiktive Veröffentlichung."],
["Neuer Stadtteilmarkt: Alt 8–14 Uhr auf Platz, aktuell 9–12 Uhr in Schule, Verantwortliche verlangt Telefonnummer vor Freigabe.","新しい会場は学校で、時間は九時から正午です。電話番号を加えてから確認をお願いします。","まだ公開しません。最後の修正をします。","広場で八時から行います。","Neue Veranstaltung und Frist."],
"使える施設 ≠ 公開してよい案内; jede Korrektur hat eigene Freigabe.",["henkou","koukai","kakunin"]]
];
export const p59MissionsC=raw.map(authoredP59Compact);
