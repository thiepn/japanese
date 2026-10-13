import {authoredP59Compact,type P59Compact} from "./performance59-types";
/** 29–35: least-scaffolded cumulative independent A2 source interpretation and transfer. */
const raw:readonly P59Compact[]=[
["three-source-research","三つの資料をどうまとめる","p26:library-project","研究レポート","polite",
"Eine Projektgruppe muss veraltete Zahlen, neuere offizielle Daten und Meinungen sauber unterscheiden und auf eine neue Lehreranweisung reagieren.",
"Berichtsschreibung mit Quellenhierarchie, zeitlicher Reichweite, Zitatgrenze und fristgerechter Änderung",
[
["去年の調査報告","昨年、市内の図書館を利用した人は一日に平均百二十人でした。調査は六月の平日に行われました。","Vorjahresbericht: Im Juni an Werktagen durchschnittlich 120 Bibliotheksbesucher pro Tag."],
["今年の市の報告","今年の四月に行った調査では、一日の平均が百四十人でした。ただし、調査した月が違うため、単純に同じ条件とは言えません。","Aktueller Stadtbericht: April durchschnittlich 140; anderer Erhebungsmonat, daher Vergleich nicht unter gleichen Bedingungen."],
["アンケートのまとめ","学生の多くは、図書館をもっと遅くまで開けてほしいと答えました。しかし、これは希望についての質問で、利用者数の調査ではありません。","Umfrage: Viele wünschen spätere Öffnung; erhebt Wünsche, nicht reale Besucherzahl."]],
[
["マリ","数字だけ見ると二十人増えているけど、調べた時期が違うから理由はわからないね。","Mari: Zahlen +20, Untersuchungsmonate verschieden, Ursache unbekannt."],
["ケン","希望のアンケートも同じ表に入れようと思ったけど、種類が違うから分ける方がよさそう。","Ken: Wollte Umfrage in gleiche Tabelle, trennt lieber Datenarten."]],
[
["先生","数字の違いを書いてもいいですが、調査した月が違うことを説明してください。","Dozent: Zahlendifferenz nennen, aber Monate transparent machen."],
["マリ","『利用者が増えた原因は開館時間です』と書いてもいいですか。","Mari: Darf ich als Ursache Öffnungszeiten angeben?"],
["先生","その理由は資料だけではわかりません。出典を示して、事実と意見を分けてください。","Dozent: Ursache nicht aus Quellen belegbar; Tatsachen und Meinungen mit Quellen trennen."],
["ケン","わかりました。数字、条件、希望の三つを別々にまとめます。","Ken: Zahlen, Bedingungen und Wünsche getrennt zusammenfassen."]],
[
["evidence","二つの調査の平均人数はそれぞれ何人ですか。","去年は百二十人で、今年は百四十人です。","前年百二十人、今年百四十人です。","両方百四十人です。","Originaldaten präzise halten.","平均百二十人でした","数字の違いを書いてもいい"],
["inference","数字の違いから、増えた原因までわかりますか。","いいえ、原因は資料だけではわかりません。","いいえ、調査の月が違うので断定できません。","はい、開館時間が原因です。","Mögliche Scheinkorrelation darf nicht als Ursache behauptet werden.","調査した月が違うため","その理由は資料だけではわかりません"],
["status","学生アンケートは利用人数の調査ですか。","いいえ、希望についての調査です。","いいえ、開館時間への意見です。","はい、今年の人数を示しています。","Meinungen und Messgrößen getrennt.","希望についての質問で","事実と意見を分けてください"]
],
["Entscheide selbst die Gliederung des Berichts.","二つの調査の人数と調査時期を比べ、開館時間への希望は別の項目で説明します。出典も書きます。","数字だけで原因を決めずに、資料の条件を明記します。","二十人増えた原因は開館時間だと断定します。","Quellenbezogene, überprüfbare Aussagen."],
["Schreibe in drei oder mehr japanischen Sätzen eine eigenständige Zusammenfassung mit Einschränkung.","去年の調査では一日の利用者が平均百二十人で、今年は百四十人でした。ただし、調査した月が異なるため、人数が違う理由まではわかりません。アンケートで多くの学生が希望したのは、開館時間を長くすることです。","数字の調査と学生の意見は別の内容です。資料の出典を示してまとめます。","開館時間が短いせいで利用者が二十人増えました。","Evidenz, Unsicherheit, Meinung."],
["先生","もう一つお願いします。今の報告は今月の調査も入っているので、『今年の四月』と『今月』を混ぜないでください。","Dozent: Trenne Erhebung im April von eventuell neuer aktueller Untersuchung; vermische Zeitpunkte nicht.","Reagiere auf neue zeitliche Präzisierung.","ご指摘ありがとうございます。今年の四月の調査だと明記し、今月の情報とは区別して書き直します。","調査の月をそれぞれ確認してから提出します。","今年の四月も今月も必ず同じです。","Aktuelle Sprecherpräzisierung verengt belastbare Aussage."],
["百二十人から百四十人になったのは開館時間のせいで、アンケートも利用者数の証明です。","Korrigiere Ursache und falsche Zuordnung.","二つの調査では人数が違いますが、時期も異なるため原因は不明です。アンケートは開館時間への希望を示しています。","数字と意見を別に説明し、調査時期と出典を記載します。","Entstehungszeit nicht weglassen."],
["Neues Sportprojekt: Vorjahr Mai durchschnittlich 40, dieses Jahr September 55, Onlineumfrage wünscht mehr Training, Ursache ungeklärt.","去年五月の平均は四十人で、今年九月は五十五人です。時期が違うため、増えた原因はわかりません。希望の調査は別にまとめます。","数と意見を分け、出典を書きます。","希望があるから十五人増えたと断定します。","Anderer Datensatz und Meinungsquelle."],
"相関する数字・調査時期・原因の証明・希望は別々の情報.",["houkoku","shiryō","kakunin"]],
["family-visit-emergency","家族の訪問を決め直す","p26:weekend-switch","家族の相談","casual",
"Großfamilie koordiniert Besuch, Ausfall der Fähre, alternative Bahn, Verfügbarkeit der Großmutter und den tatsächlichen Ticketkauf.",
"Mehrere familiäre und verkehrliche Zustimmungen chronologisch auseinanderhalten",
[
["旅行の予定","土曜日の午後一時の船で島へ行き、祖母の家に一泊する予定です。日曜日の午後に帰る計画です。","Reiseplan: Samstag 13-Uhr-Fähre, Übernachtung bei Großmutter, Sonntag zurück."],
["船会社のお知らせ","土曜日の船は強い風のため中止です。日曜日の船が出るかどうかは、前日の夕方にお知らせします。","Fährmeldung: Samstagsfähre wegen Wind gestrichen; ob Sonntagsfahrt stattfindet, Info am Vorabend."],
["駅の案内","島へ行く別の電車は日曜日の午前九時発です。ただし、駅から祖母の家までバスで四十分かかります。","Alternative: Sonntagszug 9 Uhr; vom Bahnhof 40 Minuten Bus zum Haus."]],
[
["姉","土曜日は行けないね。日曜日の電車なら行けるかな。まず祖母に聞いてみるよ。","Schwester: Samstag unmöglich, fragt zuerst Großmutter zu Sonntag."],
["父","母さんは日曜日の朝に用事があるって言ってたから、午後に会えるか確認しよう。","Vater: Großmutter Sonntagmorgen beschäftigt, fragt nach Nachmittag."]],
[
["祖母","日曜日の午後なら家にいるよ。でも帰りの時間は早めに確認してね。","Großmutter: Sonntagnachmittag daheim; Rückfahrt früh prüfen."],
["姉","じゃあ、九時の電車を予約しても大丈夫かな。","Schwester: Können wir 9-Uhr-Zug buchen?"],
["父","まだ空席を見ていないし、バスの時間も確認していないよ。調べてから予約しよう。","Vater: Noch keine Zugplätze oder Buszeiten geprüft; zuerst prüfen."],
["姉","そうだね。祖母の予定がわかっただけで、交通の予約はまだだよね。","Schwester: Großmutter passt, Verkehr noch nicht gebucht."]],
[
["chronology","訪問できそうなのはいつですか。","日曜日の午後です。","日曜日の午後なら祖母が家にいます。","土曜日の一時です。","Fährabsage und Großmutters Zusage.","土曜日の船は強い風のため中止","日曜日の午後なら家にいるよ"],
["status","日曜日の電車はもう予約できていますか。","いいえ、空席をまだ確認していません。","いいえ、これから調べます。","はい、祖母が大丈夫なので予約済みです。","Zielpersonenzusage ≠ Verkehrsbuchung.","別の電車は日曜日の午前九時発","まだ空席を見ていない"],
["inference","電車だけで祖母の家まで行けますか。","いいえ、駅からバスで四十分かかります。","いいえ、駅からバスが必要です。","はい、駅に家があります。","Letzte Wegstrecke beachten.","バスで四十分かかります","バスの時間も確認していない"]
],
["Plane einen machbaren nächsten Schritt ohne Zusageüberschuss.","祖母には日曜日の午後に会えるので、まず電車の空席とバスの時刻を調べます。帰りの予定も確認してから予約します。","交通と帰りの時間がわかってから切符を買います。","祖母がいいと言ったので全部予約済みです。","Mehrfachbedingungen."],
["Schreibe mehrsätzige Nachricht an die Familie mit bestätigtem und offenem Stand.","土曜日の船は中止です。祖母は日曜日の午後なら会えますが、電車の予約とバスの時間はまだ確認できていません。調べてから行けるかどうか連絡します。","日曜日の訪問を考えていますが、交通を確認してから決めたいです。","土曜日に島へ行けることは確定しました。","Keine ungesicherte Reise."],
["父","九時の電車はもう満席だったよ。十時半の便には空きがあるけど、バスの接続が悪いかもしれない。","Vater: 9-Uhr-Zug voll; 10:30 frei, Busanschluss eventuell schlecht.","Wähle erneut überprüfbaren Ablauf.","教えてくれてありがとう。十時半の電車とバスの接続を確認し、無理なら今回は別の日にしよう。","新しい便で行けるか調べてから祖母に知らせるね。","九時の切符を買ってすぐ行きます。","Neuer Platzstatus und Anschlussrisiko."],
["九時の電車は必ず乗れるし、祖母の返事があれば帰りも決まりました。","Korrigiere fehlende Tickets und Rückfahrt.","九時の電車は満席です。十時半の便とバスの接続を確認してから訪問を決めます。","祖母には日曜日に会えますが、まだ交通は確定していません。","Verfügbarkeit auf zwei Ebenen."],
["Neuer Besuch: Samstagszug abgesagt, Sonntagszug 8 Uhr voll, 11 Uhr frei, Tante Sonntagabend erreichbar, Busanschluss ungeprüft.","日曜日の十一時の電車を検討しますが、バスの接続を確認してから予約します。叔母は夜なら会えます。","交通の条件を先に調べます。","八時の電車が満席でも予約できます。","Andere Person und Reise."],
"家族の都合が合った ≠ 交通予約と帰りの時間まで決まった.",["yoyaku","norikae","kakunin"]],
["community-center-release","集会の案内が三回変わる","p26:library-project","地域の行事","polite",
"Gemeindeversammlung erlebt Raumwechsel, kürzere Nutzungsdauer und einen letzten Kapazitätsentscheid; bisherige Zusagen müssen korrekt revidiert werden.",
"Öffentliche Aussagen erst nach Eigentümerfreigabe und Kapazitätsprüfung aktualisieren",
[
["最初のお知らせ","地域の文化交流会は土曜日の午後二時から四時まで、駅前の会館で行います。予約は不要と案内しました。","Ursprüngliche Einladung: Samstag 14–16 Uhr im Bahnhofshaus, keine Anmeldung laut Alttext."],
["工事の連絡","会館の一階で工事が始まるため、会場を市民センターに変更する必要があります。変更の案内を準備してください。","Bauinfo: Erdgeschoss des alten Hauses gesperrt, Umzug ins Zentrum nötig, neue Info vorbereiten."],
["市民センターの規則","大きい部屋は午後三時まで利用できます。使用には事前の許可が必要で、人数も確認します。","Zentrumsregel: Großer Raum nur bis 15 Uhr, vorherige Genehmigung und Kapazitätsprüfung nötig."]],
[
["担当Ａ","会場を市民センターに直したけど、時間はまだ四時までになっている。","A: Ort schon geändert, Ende irrtümlich noch 16 Uhr."],
["担当Ｂ","許可と定員を確認してから、新しい案内を送ろう。まだ全員に知らせない方がいいね。","B: Erst Genehmigung/Kapazität; noch nicht alles verbreiten."]],
[
["施設担当","センターは二時から三時まで利用できます。定員は二十人です。","Hauspersonal: Raum 14–15 Uhr, maximal 20."],
["担当Ａ","二十人以上申し込んだらどうしますか。","A: Was bei mehr als 20 Anmeldungen?"],
["施設担当","人数を確認して、参加できない方には次の会を案内してください。","Hauspersonal: Zahl prüfen, übrigen nächstes Treffen anbieten."],
["担当Ｂ","予約なしという古い案内も直して、人数を先に確認しよう。","B: Alte 'ohne Anmeldung'-Info ändern, Plätze prüfen."]],
[
["chronology","最新の会場と時間は何ですか。","市民センターで午後二時から三時までです。","センターの二時から三時です。","駅前の会館で四時までです。","Alttext durch Hausbestätigung ersetzt.","午後二時から四時まで","二時から三時まで利用できます"],
["evidence","定員は何人ですか。","二十人です。","最大二十人です。","何人でも大丈夫です。","Kapazität ausdrücklich.","人数も確認します","定員は二十人です"],
["status","古い案内の『予約不要』をそのまま残してよいですか。","いいえ、人数を確認する必要があります。","いいえ、参加の確認が必要です。","はい、古い案内なので必ず正しいです。","Platzbeschränkung macht alte Zusage irreführend.","予約は不要と案内しました","予約なしという古い案内も直して"]
],
["Wähle nächste faire Kommunikationshandlung.","会場と時間を修正し、二十人までの参加を確認してから、新しい案内を出します。","予約不要という古い情報を訂正します。","変更があっても古い案内を送ります。","Zulassung nur bei belegter Platzregel."],
["Schreibe öffentliche Korrektur in mindestens drei japanischen Sätzen.","交流会の会場を市民センターに変更しました。時間は土曜日の午後二時から三時までで、定員は二十人です。古い案内と違い、参加人数を確認する必要がありますので、希望する方はご連絡ください。","以前の会場と時間の案内を訂正します。ご参加について事前に確認をお願いします。","駅前で四時まで予約なしで参加できます。","Höfliche öffentliche Genauigkeit."],
["施設担当","今日、消防の確認がありました。定員は二十人ではなく十八人になりました。新しい人数で案内してください。","Hauspersonal: Brandschutz reduziert auf 18, bitte neue Zahl veröffentlichen.","Reagiere, bevor endgültig gesendet wird.","ご連絡ありがとうございます。最新の定員を十八人に修正し、案内を出す前に確認します。","承知しました。人数をもう一度調べます。","二十人に確定メールを送ります。","Neue offizielle Grenze."],
["二十人まで入れるので、前の人数で全員に案内を送ります。","Korrigiere neuere Sicherheitszahl.","最新の定員は十八人です。参加を希望する方の人数を確認してから案内します。","古い二十人の情報は訂正します。","Vor Veröffentlichung erneut prüfen."],
["Neues Straßenfest: Ursprünglich 13–17 Uhr im Park ohne Anmeldung, neues Gemeindehaus 14–16 Uhr, 25 Plätze, später auf 22 reduziert.","会場は公民館に変更され、時間は二時から四時です。最新の定員は二十二人なので、参加を確認してから案内します。","古い案内を訂正し、人数を再確認します。","公園で五時まで誰でも入れます。","Andere Veranstaltung mit drei Änderungen."],
"公開済みの文面を引きずらず、最新の許可と安全人数を優先.",["kyoka","anai","henkou"]],
["workplace-handover","引き継ぎの数字が違います","p26:library-project","仕事の引き継ぎ","polite",
"Fachteam übergibt Bestellungen mit unterschiedlichen Summen, ausstehender Rechnung und einer jüngeren Supervisor-Korrektur.",
"Quellenbezogene Korrektur, Abrechnung, Zahlung und Versandstatus unabhängig behandeln",
[
["注文の記録","今週の注文は小さい箱が十二個、大きい箱が八個です。配達は金曜日の午後を予定しています。","Bestellliste: 12 kleine, 8 große Kartons; Lieferung für Freitagnachmittag vorgesehen."],
["古い請求書","昨日の請求書には、小さい箱が十個、大きい箱が十個と書いてあります。合計は二十個です。","Alte Rechnung: 10 kleine, 10 große, Gesamtzahl ebenfalls zwanzig."],
["会計のルール","数の訂正が必要な時は、元の注文記録と比べてから請求書を直し、上司に確認してもらってください。","Buchungsregel: Originalbestellung abgleichen, Rechnung korrigieren, Leitung prüfen lassen."]],
[
["社員Ａ","合計は同じ二十個だけど、箱の種類の数が違っています。","A: Gesamtsumme 20 stimmt, Verteilung nicht."],
["社員Ｂ","まだ請求書をお客様に送り直していません。上司の確認を待っています。","B: Berichtigte Rechnung noch nicht versandt, Vorgesetztenprüfung offen."]],
[
["上司","元の注文は十二個と八個です。請求書の種類別の数を直してください。","Leitung: Original 12/8, korrigiere positionsweise."],
["社員Ａ","直した請求書をすぐ送信してもよろしいでしょうか。","A: Soll ich sofort senden?"],
["上司","修正したファイルを一度見せてください。金曜日の配達予定は変わっていません。","Leitung: Erst korrigiertes Dokument vorlegen; Freitaglieferung weiterhin nur Plan."],
["社員Ｂ","わかりました。数とファイルの名前を確認してからお見せします。","B: Prüft Positionen und Dateiname vor Freigabe."]],
[
["evidence","正しい小さい箱と大きい箱の数は何個ですか。","小さい箱が十二個で、大きい箱が八個です。","十二個と八個です。","両方十個ずつです。","Total stimmt, Distribution nicht.","小さい箱が十二個、大きい箱が八個","元の注文は十二個と八個です"],
["status","修正した請求書はお客様に届いていますか。","いいえ、まだ再送信していません。","いいえ、上司の確認待ちです。","はい、合計が同じなので送信済みです。","Gleiche Summe erlaubt keine ungenehmigte Position.","上司に確認してもらって","修正したファイルを一度見せてください"],
["chronology","金曜日の配達はすでに完了したと書けますか。","いいえ、予定です。","いいえ、金曜日の午後に配達する予定です。","はい、すでに届きました。","Vorgesehene Lieferung ist kein Empfang.","配達は金曜日の午後を予定","金曜日の配達予定は変わっていません"]
],
["Strukturierte nächste Arbeitsschritte formulieren.","元の注文記録で十二個と八個を確認し、請求書を修正して上司に見せます。許可の後でお客様に送ります。","合計だけでなく種類別の数も確認します。","二十個なので間違いはありません。","Mengenstruktur statt bloß total."],
["Schreibe drei höfliche japanische Sätze als internen Status.","注文記録では小さい箱が十二個、大きい箱が八個ですが、請求書の内訳が違っていました。現在、数とファイル名を修正しています。上司の確認を受けてからお客様に送り直します。","合計は同じですが、種類別の数を訂正します。金曜日の配達はまだ予定です。","合計が同じなので請求書は正しく、もう発送しました。","Exakte Quelle und offene Freigabe."],
["上司","確認しました。数は正しいですが、配達日が土曜日に変更されました。新しい日付も書いてから送信してください。","Leitung: Mengen jetzt richtig, Lieferung verschiebt sich auf Samstag; Datum aktualisieren vor Versand.","Reagiere auf neue unabhängige Lieferfrist.","ご確認ありがとうございます。数量は修正できたので、配達日も土曜日に直してから送信します。","承知しました。日付を変更し、内容を確認して送ります。","金曜日のままで送ります。","Zweite Korrektur nach erster Freigabe."],
["数は直しましたが、配達は金曜日のままです。すでにお客様に送信しました。","Korrigiere alte Lieferzeit und fiktiven Versand.","正しい数量は十二個と八個です。配達予定を土曜日に直してから送信します。まだ送っていません。","新しい日付を確認して請求書を送り直します。","Fortgeschriebene neueste Anweisung."],
["Neue Büromaterialliste: 15 Stifte/5 Mappen bestellt, Rechnung 10/10, neuer Liefertag Montag statt Freitag; vor Kundenversand Leitung prüfen.","注文記録を確認して十五本と五冊に直し、配達日を月曜日に変更します。上司の確認後に送信します。","合計だけでなく種類も確認します。","同じ合計なので問題なく送信しました。","Andere Zahlen und Materialien."],
"合計の一致 ≠ 内訳の正しさ; 上司確認済み ≠ 送信済み; 予定日 ≠ 配達完了.",["houkoku","kakunin","soushin"]],
["travel-community-service","観光案内を手伝う","p25:directions","地域案内ボランティア","polite",
"Anlaufstelle muss einen Besucher nach aktualisierter Stadtroute und einer individuell zugänglichen Alternative leiten.",
"Zwei Wege, neue Businformation, Sprecherabsicht und unabhängig überprüfbare Sicherheit verbinden",
[
["観光地図","駅から古い博物館へは北の橋を渡って歩いて十分です。日曜日は午前十時に開きます。","Alte Touristenkarte: Vom Bahnhof über Nordbrücke zehn Minuten, Sonntagsöffnung 10 Uhr."],
["市の工事案内","今週は北の橋が閉まっています。南の橋からなら歩いて二十分ほどかかります。工事中の場所へは入らないでください。","Aktuelle Stadtinfo: Nordbrücke geschlossen, Südroute etwa zwanzig Minuten, Baustelle nicht betreten."],
["交通の補足","歩くのが難しい方は駅前から市のバスを利用できます。ただし、日曜日の本数は少ないので時刻を調べてください。","Businfo: Für mobilitätseingeschränkte Personen Stadtbus möglich, sonntags selten, Fahrplan prüfen."]],
[
["旅行者","日曜日の十時に博物館へ行きたいのですが、古い地図しかありません。歩くのが少し難しいです。","Gast: Möchte Sonntag 10 Uhr zum Museum, hat alte Karte, Laufen ist schwierig."],
["案内係","北の橋は今使えません。安全な道とバスの時間を確認しましょう。","Guide: Nordbrücke gesperrt; sichere Route/Bus prüfen."]],
[
["バス係員","日曜日の次のバスは九時半に駅前を出ます。博物館の近くまで行きます。","Buspersonal: Nächster Sonntagsbus 9:30 Bahnhof, hält museumnah."],
["旅行者","そのバスなら十時に間に合いますか。","Gast: Kommt er rechtzeitig zu 10 Uhr?"],
["バス係員","道路が混むと少し遅れることもあるので、到着時間は保証できません。","Buspersonal: Wegen Verkehr keine garantierte Ankunft."],
["案内係","博物館へ行く前に、受付に開館時間と到着予定を確認してみましょう。","Guide: Vorher Museumkontakt zu Öffnung/Ankunft prüfen."]],
[
["evidence","今使えない道はどこですか。","北の橋です。","北側の橋は閉まっています。","南の橋です。","Baustelle aktuell.","北の橋が閉まっています","北の橋は今使えません"],
["status","九時半のバスで必ず十時に着きますか。","いいえ、到着は保証されていません。","いいえ、道が混む可能性があります。","はい、必ず十時ちょうどです。","Abfahrtszeit ≠ Ankunftsgarantie.","日曜日の本数は少ない","到着時間は保証できません"],
["inference","旅行者に古い北の橋の近道をすすめてもよいですか。","いいえ、閉鎖中で危険です。","いいえ、南の橋かバスを考えます。","はい、地図にあるので使えます。","Sicherheit schlägt altes Material.","工事中の場所へは入らないでください","北の橋は今使えません"]
],
["Schlage eigenständig realistische, zugängliche Optionen vor.","北の橋は閉まっているので使いません。歩くのが難しければ九時半のバスを検討し、到着について博物館に確認します。","南の道もありますが、無理をせずバスの時間を調べます。","北の橋を急いで渡れば必ず間に合います。","Keine riskante Abkürzung oder garantierte Ankunft."],
["Verfasse eine höfliche dreisätzige Wegauskunft an den Gast.","今週は北の橋が工事で閉まっています。南の橋なら歩いて二十分ほどですが、歩くのが難しければ駅前からバスに乗れます。日曜日は本数が少なく、到着時間も変わる可能性があるため、先に確認しましょう。","新しい工事情報に従って、安全な道を選んでください。バスも利用できます。","北の橋から十分で必ず十時に着きます。","Höfliches praktisches Register."],
["博物館の受付","日曜日は設備点検のため、開館が午前十一時に変更になりました。","Museumsrezeption: Sonntag wegen Prüfung erst 11 Uhr geöffnet.","Reagiere und kombiniere Anreise mit geänderter Öffnung.","教えていただきありがとうございます。開館は十一時なのですね。バスの時刻をもう一度確認して、無理のない時間に伺います。","新しい開館時間を旅行者に伝えます。","十時に開くので急いで行きます。","Neueste offizielle Öffnungszeit ersetzt bisherige."],
["道だけ確認したので、博物館は十時に開き、北の橋も使えます。","Korrigiere doppelt veraltete Reiseinformation.","北の橋は閉まっており、博物館は日曜日に十一時に開きます。安全な行き方とバスを確認します。","十一時の開館に合わせて、移動方法を考えます。","Ort und Zeit aus verschiedenen Quellen."],
["Neuer Ausflug: Zoo ursprünglich 9 Uhr, wegen Reinigung 10:30 geöffnet, Westweg gesperrt, Südweg 25 Minuten, Kleinbus selten.","動物園は十時半に開きます。西の道は閉まっているので、南の道かバスを確認します。","移動時間に余裕を持ちます。","西の道から九時に必ず入れます。","Andere Destination."],
"時刻表・予定・開館・安全情報は別の出典、変更は複数同時に起こりうる.",["anai","jikokuhyou","kakunin"]],
["independent-capstone","自分で考えて返事を書く","p26:library-project","地域と学びの総合活動","polite",
"Ein kleines gemeinnütziges Sprach- und Bücherprojekt verbindet Veranstaltungsort, Materialabgabe, rechtmäßige Bildnutzung und Anmeldebeschränkung.",
"Alle Quellen kritisch zusammenführen und ohne Vorlagen echte eigenständige japanische Kommunikation formulieren",
[
["地域交流会の古い案内","日曜日の午後二時から、駅前の会館で読書と日本語の交流会を開きます。参加は無料で、どなたでも来られると書きました。","Alte Einladung: Sonntag 14 Uhr Bahnhofshaus, gemeinsames Lesen und Sprachtausch, frei und offen."],
["運営の新しい情報","会館は工事のため使えなくなりました。市民センターを申請していますが、使用許可はまだです。センターの部屋には十八人まで入れます。","Orga-Neuigkeit: Ursprungsort gesperrt, Zentrum beantragt aber nicht genehmigt, 18 Plätze."],
["資料と写真のルール","本の紹介文は自分の言葉で書いてください。参加者の写真は本人の許可が必要です。資料を公開する前に担当者が確認します。","Materialregel: Buchvorstellungen selbst schreiben, Foto-Einwilligung, Dokumentfreigabe durch Verantwortliche vor Publikation."]],
[
["アキ","二十四人に案内したけど、返事が来たのは十五人だよ。ほかの人にはまだ確認できていない。","Aki: 24 eingeladen, 15 Antworten, Rest unklar."],
["ミナ","紹介文は私が書き直したよ。でも写真の許可を取れていない人もいるし、会場もまだ決まっていないね。","Mina: Texte neu formuliert, einige Fotogenehmigungen fehlen, Ort offen."]],
[
["施設担当","センターの利用が認められました。ただし、集会は午後二時から三時半まで、十八人以下にしてください。","Zentrumsleitung: Genehmigt, nur 14:00–15:30, höchstens 18."],
["アキ","では、二十四人全員に参加が決まったと知らせていいですか。","Aki: Dürfen wir allen 24 Teilnahme zusagen?"],
["施設担当","いいえ、人数を確認してください。先に申し込んだ方から席を決めて、確認メールを送ってください。","Leitung: Nein, zuerst Teilnehmendenliste prüfen, Reihenfolge beachten, Bestätigungsmails."],
["ミナ","わかった。会場と時間を新しく書いて、写真は許可が取れるまで公開しないでおこう。","Mina: Ort/Zeit korrigieren, Fotos bis Einwilligung zurückhalten."]],
[
["status","二十四人全員が参加できると確定していますか。","いいえ、定員は十八人です。","いいえ、順番と返事を確認する必要があります。","はい、招待したので全員参加できます。","Interesse und Einladung sind keine tatsächliche Teilnahme.","センターの部屋には十八人まで","十八人以下にしてください"],
["chronology","最新の場所と時間は何ですか。","市民センターで日曜日の二時から三時半までです。","日曜日の午後二時から三時半にセンターです。","駅前の会館で午後四時までです。","Letzter offizieller Stand.","会館は工事のため使えなくなりました","午後二時から三時半まで"],
["evidence","写真や本の紹介文にはどのような注意がありますか。","写真は許可が必要で、紹介文は自分の言葉で書きます。","公開前に許可と担当者の確認が必要です。","写真も文章も自由にコピーできます。","Rechte und Verfasserpflicht unterscheiden.","本の紹介文は自分の言葉で","写真は許可が取れるまで公開しないでおこう"]
],
["Unabhängige praktische Planung in mehreren Sätzen.","最初に人数と申し込みの順番を確認し、十八人まで確認メールを送ります。会場を市民センター、時間を二時から三時半に直し、写真は許可が出るまで使いません。資料は担当者に確認してもらってから公開します。","招待した人と参加が決まった人を分け、人数と許可を確認してから案内します。","二十四人全員の席があり、写真も自由に公開できます。","Vier voneinander getrennte Beleggrenzen."],
["Schreibe mindestens 3 zusammenhängende originale japanische Sätze als offizielle Einladungskorrektur; nicht die fertige Modellform übernehmen.","以前の案内から会場と時間が変更になりました。交流会は日曜日の午後二時から三時半まで、市民センターで行います。部屋の定員は十八人ですので、参加については申し込みの順番を確認してからお知らせします。写真は許可を確認するまで公開しません。","会場が変わりましたので、古い案内を訂正します。参加が決まった方には個別にご連絡いたします。","駅前で何人でも参加でき、写真は許可なしで使えます。","Inhaltsgenauigkeit, Rollen und Höflichkeit."],
["施設担当","申し訳ありません。明日の設備点検のため、センターの開場は午後二時半になります。交流会の終了は三時半のままです。","Zentrumsleitung: Wegen Wartung Einlass nun 14:30, Ende 15:30 unverändert.","Neue letzte Änderung in unabhängiger öffentlicher Antwort integrieren.","ご連絡ありがとうございます。開始は二時半から、終了は三時半のままとして案内を修正します。人数と写真の許可も引き続き確認します。","承知しました。開始時間を変更し、確認後に新しい案内を出します。","二時から四時までのままで案内します。","Neue letzte Uhrzeit ersetzt vorherige."],
["最初のお知らせのとおり駅前で二時から行い、二十四人を入れて写真も自由に公開します。","Revidiere Ort, aktualisierte Startzeit, zulässige Teilnehmerzahl und Medienfreigabe.","会場は市民センターで、開始は午後二時半、終了は三時半です。定員は十八人なので参加を確認し、写真は許可なしで公開しません。","新しい時間と場所に直し、担当者の確認を受けてから案内します。","Cumulative evidenzgebundene Korrektur."],
["Völlig neuer Fall: Sprachbibliothekstreffen zuerst Montag 17–19 Uhr Rathaus für alle angekündigt, Rathaus geschlossen, Schulraum genehmigt 17:30–18:30 für 12, 17 Anmeldungen, Audioaufnahmen nicht freigegeben.","場所は学校の部屋に変更され、時間は五時半から六時半までです。定員は十二人なので、参加を個別に確認します。録音は許可なしで公開しません。","最新の会場、時間、人数、許可を確認してから案内します。","十七人全員が市役所で夜七時まで参加し、録音も自由です。","Alle Dimensionen in wirklich neuer Situation."],
"予定した・申し込んだ・許可が出た・公開した・参加が決まった は五つの異なる状態.",["kyoka","sanka","kakunin"]],
["library-outreach-final","新しい参加案内を自分で直す","p26:library-project","地域と学びの総合","polite",
"Ein Sprachhilfeprojekt muss Ort, Termin, eingeschränkte Teilnahme, personenbezogene Daten und eine allerletzte Rückmeldung gleichzeitig verantworten.",
"Quellenhierarchie, bestätigte Zeit, Platzstatus, Schriftproduktion und Privatsphäre vollständig zusammenführen",
[
["最初の交流会案内","来週の土曜日に新しく来た学生のための町の案内会を開きます。午前十時から、駅前の二階の部屋です。申し込みは木曜日までにお願いします。","Ursprüngliche Einladung: Samstag 10 Uhr, Bahnhofshaus im zweiten Stock, Anmeldung bis Donnerstag."],
["会場と交通の新情報","駅前の建物はエレベーター点検で利用できません。図書館の一階なら利用できる可能性がありますが、担当者の使用許可が必要です。東口から歩いて十五分ほどです。","Neuer Sachstand: Bahnhofshaus wegen Fahrstuhlwartung nicht verfügbar; Bibliothek Erdgeschoss nur nach Genehmigung, 15 Minuten Fußweg vom Osteingang."],
["申し込みとプライバシー","部屋の定員は十二人です。フォームを送っただけでは参加できると決まりません。名簿は担当者だけに共有し、写真を公開する時は本人の許可も確認してください。","Teilnahme und Privatsphäre: Maximal zwölf, Formular keine Zusage, Liste nur Leitung, Fotos nur mit Einwilligung."]],
[
["ユウ","十五人から申し込みが来たよ。でも全員に確認メールを送ったわけじゃないし、古い駅前の会場を伝えた人もいる。","Yu: 15 Anträge erhalten, Bestätigungen und Ortskorrektur noch unvollständig."],
["ミナ","許可を待ってから案内を直そう。名簿も写真も誰でも見られるようにはしないでね。","Mina: Vor Freigabe neuen Hinweis, Listen und Fotos nicht öffentlich."]],
[
["図書館の担当","一階の部屋を使う許可が出ました。ただし、土曜日の十一時から午後一時までです。定員は十二人です。","Bibliothek: EG genehmigt, Samstag 11–13 Uhr, zwölf Plätze."],
["ユウ","十五人に申し込みがあるのですが、全員に参加確認をしてもいいでしょうか。","Yu: Darf ich allen fünfzehn zusagen?"],
["図書館の担当","いいえ。申し込み順に十二人まで確認し、ほかの方には次回をご案内ください。写真の許可も忘れないでください。","Bibliothek: Nur zwölf in Anmeldereihenfolge, übrigen nächste Gelegenheit, Fotogenehmigungen beachten."],
["ミナ","会場と時間を直し、確認が取れた人にだけ新しい案内を送りましょう。","Mina: Aktualisierte Nachricht nur an wirklich bestätigte Personen."]],
[
["chronology","正式な会場と時間は何ですか。","土曜日の十一時から午後一時まで、図書館の一階です。","図書館の一階で十一時から一時までです。","駅前の二階で十時からです。","Ältere Einladung durch zuständige Auskunft ersetzt.","駅前の二階の部屋です","十一時から午後一時までです"],
["status","十五人全員の参加が決まっていますか。","いいえ、定員は十二人で確認が必要です。","いいえ、申し込みの順番を調べます。","はい、申し込んだので全員参加できます。","Antrag ist keine Zusage.","フォームを送っただけでは参加できると決まりません","申し込み順に十二人まで"],
["evidence","名簿と写真を公開する時の注意は何ですか。","名簿は担当者だけに共有し、写真は本人の許可が必要です。","個人情報を外へ出さず、写真の許可を確認します。","名簿も写真も自由に公開できます。","Teilnehmerdaten und Bildrechte getrennt.","名簿は担当者だけに共有し","写真の許可も忘れないでください"]
],
["Formuliere selbst die sichere gesamte Vorgehensweise.","まず申し込み順に十二人まで確認します。新しい会場と時間を伝え、残りの人には次回を案内します。名簿は担当者だけに共有し、写真は許可なく公開しません。","場所、日時、定員、写真の許可を確認してから案内します。","十五人全員を古い会場で確定し、写真を公開します。","Fünf unabhängige Bedingungen korrekt."],
["Schreibe mindestens vier vollständige japanische Sätze als höfliche neue Nachricht für Teilnehmende.","最初の案内から会場と時間が変更になりました。来週の土曜日は午前十一時から午後一時まで、図書館の一階で行います。定員は十二人ですので、参加について申し込み順に確認のご連絡をします。古い駅前の案内は使用しないでください。写真は本人の許可を確認するまで公開しません。","以前の会場と時間を訂正します。参加が決まった方には個別にお知らせします。名簿は公開しません。","駅前で十五人全員が参加でき、写真も自由に公開できます。","Lange natürliche eigenständige Mitteilung mit belegten Einschränkungen."],
["図書館の担当","申し訳ありません。設備点検のため、その日は一階の部屋を正午までしか使えません。十一時開始のままで、終了だけ正午に訂正してください。","Bibliothek: Wegen Wartung Raum nur bis 12 Uhr; Beginn 11 Uhr unverändert, nur Ende ändern.","Reagiere auf letzte autoritative Änderung ohne andere Regeln zu verwerfen.","ご連絡ありがとうございます。十一時開始のままで、終了を正午に訂正します。定員は十二人で、参加の確認と写真の許可も引き続き守ります。","承知しました。終了時間だけ変え、確認後に新しい案内を送ります。","終了も一時のままで案内します。","Aktuellste verbindliche Frist."],
["前の案内どおり駅前で十時から一時まで行い、十五人全員を入れて写真も公開します。","Repariere Ort, Beginn, Ende, Zahl und Medienrecht gemeinsam.","案内会は土曜日の十一時から正午まで、図書館の一階で行います。定員は十二人で、参加は申し込み順に確認します。名簿と写真は許可なく公開しません。","新しい時間と場所に直して、確認した人へ個別に案内します。","Cumulative Quellenkorrektur."],
["Ungesehener neuer Langfall: Sprachgruppe ursprünglich Rathaus Montag 17–19 Uhr ohne Grenze, Gebäude geschlossen, Schulraum Dienstag 17:30–18:30 genehmigt, später Ende 18 Uhr, 19 Anträge auf 10 Plätze, Audio nur mit Einwilligung.","交流会は火曜日の五時半から六時まで学校で行います。定員は十人なので、申し込みを確認してから案内します。録音は許可なく公開しません。","古い市役所の案内を訂正し、人数と録音の許可を確認します。","市役所で十九人全員を入れて録音を公開します。","Neuer Ort, Tag, Zeit, Medium und Rangfolge."],
"古い案内・使用許可・参加人数・名簿の権限・写真の同意・直前の終了変更 sind unabhängige Sachverhalte.",["kyoka","sanka","henkou"]]

];
export const p59MissionsE=raw.map(authoredP59Compact);
