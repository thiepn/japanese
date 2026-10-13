import {authoredP57,type P57RawThread} from "./writing57-types";
/** Cumulative original multi-message threads with multiple information revisions. */
const authored:readonly P57RawThread[]=[
{id:"conference-sources",title:"発表前の三つの情報",genre:"work",unit:"p26:library-project",setting:"Seminargruppe korrigiert konkurrierende Quellen vor Vortrag.",goal:"Zeitliche Gültigkeit, Meinung und freigegebene Endfassung in Schreiben integrieren",register:"polite",contrast:"Alte Uhrzeit 8:15, aktueller Hinweis 8:30, Kommentar 8:45 nicht bestätigt.",words:["jikokuhyou","kakunin","koukai"],messages:[
["ユキ","明日の発表資料には、バスが八時十五分に出ると書きました。去年の時刻表を使っています。","Yuki: Die Folien nennen 8:15 aus dem Vorjahresfahrplan."],
["マリ","今月の公式サイトでは八時半に変わったそうです。工事のためと書いてあります。","Mari: Die aktuelle offizielle Website nennt wegen Bauarbeiten 8:30."],
["ケン","友達から八時四十五分とも聞きましたが、どの資料で確認できるかわかりません。","Ken: Ein Freund meinte 8:45, Quelle unklar."],
["ユキ","では、公式サイトの八時半に直します。友達から聞いた時間は、確認できるまでは書きません。","Yuki: Ich übernehme die offiziellen 8:30 und lasse unbestätigte 8:45 weg."],
["先生","よいと思います。時刻表とアンケートの意見を分けて、出典も書いてください。","Lehrkraft: Gut. Fahrtzeit und Meinungsumfrage trennen, Quellen nennen."]
],questions:[
["status","最終的な発表で使う予定の時間は何時ですか。","八時半です。","八時三十分です。","八時四十五分です。","Zeit nach Verifikation.","公式サイトの八時半に直します"],
["speaker","八時四十五分の話を持ってきたのは誰ですか。","ケンさんです。","ケンさんが友達から聞きました。","先生です。","Hörensagen dem Sprecher zuordnen.","友達から八時四十五分とも聞きました"]
],compose:["Andere Uni: Alte Bibliotheksseite sagt 18 Uhr, neue offizielle 19 Uhr, Student wünscht 20 Uhr. Schreibe quellenpräzisen Bericht.","古いサイトでは六時ですが、最新の案内では七時までです。八時までという話は希望なので、現在の開館時間とは分けます。","今の閉館時間は七時です。学生の希望は事実と区別して紹介します。","希望があるので八時が公式です。","Daten und Meinung trennen."],
reply:["大学から新しいお知らせが来ました。今日は特別に六時で閉館するそうです。","Neuer offizieller Sonderhinweis: heute ausnahmsweise 18 Uhr.","Unterscheide heutige Ausnahme und normale Regel.","ご連絡ありがとうございます。今日は特別に六時で、通常は七時までですね。発表にも例外を書きます。","本日の時間と普段の時間を分けて説明します。","毎日六時になりました。","Sonderregel gilt nicht jeden Tag."],
revision:["図書館は毎日六時に閉まるので、ほかの情報は間違いです。","Überarbeite allgemeine Regel und heute geltende Ausnahme.","通常は七時までですが、今日は特別に六時で閉館します。学生の希望も別に示します。","今日の例外と普段の開館時間を区別して記載します。","Mehrere Geltungsbereiche zugleich."],
returnCue:["Neue Ausstellung: Normale Öffnung 10 Uhr, Samstag Sonderöffnung 11 Uhr, Umfrage wünscht 9 Uhr.","通常は十時に開きますが、土曜日は十一時です。九時は来館者の希望です。","特別な時間と通常の時間を別々にお知らせします。","毎日九時に開きます。","Anderer Ort und Zeitbezug."]
},
{id:"regional-train-reroute",title:"乗り換えと集合場所",genre:"chat",unit:"p25:transport",setting:"Drei Reisende organisieren Route nach Zug- und Gleisänderung.",goal:"Uhrzeit, Bahnsteig und Folgeanschluss in aktualisierter Nachricht konsistent halten",register:"casual",contrast:"Abfahrt von 10 auf 10:20 geändert, Gleis 2 geblieben, Treffpunkt Osttreppe.",words:["henkou","norikae","shuppatsu"],messages:[
["アキ","十時発の京都行きに乗るから、九時四十分に二番線で会おう。","Aki: Wir fahren Kyoto 10 Uhr, Treffen 9:40 Gleis zwei."],
["ミホ","公式の案内が変わったよ。工事のため、出発は十時二十分になったけど、二番線のままだって。","Miho: Offizielle Meldung: wegen Bauarbeiten Abfahrt 10:20, Gleis zwei unverändert."],
["ケン","じゃあ、九時五十分に駅の東階段で会おう。乗り換え時間は短くなるかな。","Ken: Treffen 9:50 Osttreppe. Wird Umsteigen knapp?"],
["アキ","それでいいよ。でも乗り換えについてはまだ確認していないから、駅で調べよう。","Aki: Okay. Anschluss noch nicht geprüft; am Bahnhof nachsehen."],
["ミホ","了解。九時五十分、東階段ね。十時二十分発の二番線まで一緒に行こう。","Miho: 9:50 Osttreppe, gemeinsam zu Gleis zwei für 10:20."]
],questions:[
["evidence","最後に決めた集合場所と時間は何ですか。","九時五十分に東階段です。","九時五十分、駅の東階段です。","九時四十分に二番線です。","Treffpunkt wurde zusätzlich verschoben.","九時五十分、東階段ね"],
["status","乗り換えが間に合うか確認できましたか。","いいえ、まだ調べていません。","いいえ、駅で調べる予定です。","はい、必ず大丈夫です。","Neue mögliche Folge wird ausdrücklich offen gelassen.","乗り換えについてはまだ確認していない"]
],compose:["Anderer Trip: Abfahrt 15:00 wird 15:30, Gleis 4 bleibt, Treffen 15:10 Südtreppe.","出発は三時半に変更されましたが、四番線のままです。三時十分に南階段で会おう。","三時十分に南階段へ来てね。三時半発の四番線に行こう。","三時に三番線で会おう。","Drei Eckdaten beibehalten."],
reply:["南階段は工事中で使えないらしいよ。西口なら開いているそうだよ。","Südtreppe wegen Bauarbeiten vermutlich gesperrt, Westeingang offen gemeldet.","Neuen Ort nur nach aktueller Aussage übernehmen.","わかった。南階段ではなく西口で会おう。三時十分でいい？","西口に変更しよう。時間は三時十分のままでどう？","南階段で待つよ。","Ort anpassen, Zeit nicht fälschlich ändern."],
revision:["三時に三番線の南階段で待つね。","Aktualisiere Zeit, Ort und Gleis.","三時十分に西口で会おう。電車は三時半に四番線から出る予定だよ。","西口に三時十分ね。四番線は変わっていないよ。","Drei unabhängige Änderungen korrekt."],
returnCue:["Neuer Fall: Bus 17:15 wird 17:45, Haltestelle Nord unverändert, Treffen Südpark um 17:20.","バスは五時四十五分に変更になったよ。乗り場は北のまま。五時二十分に南公園で会おう。","五時二十分に南公園集合で、バスは五時四十五分発だね。","五時十五分に北で集合しよう。","Neue Verkehrsdaten."]
},
{id:"charity-capacity",title:"会場の定員と確認メール",genre:"community",unit:"p26:library-project",setting:"Organisation muss Raum verkleinern und Teilnahme priorisieren.",goal:"Anmeldestatus, Raumgenehmigung und Platzbegrenzung über mehrere Nachrichten verfolgen",register:"polite",contrast:"40 Interessierte, Raum erlaubt 25, Aufnahme richtet sich nach Bestätigung.",words:["sanka","kyoka","moushikomi"],messages:[
["担当Ａ","交流会には四十人が興味を持っています。でも、大きい会場が使えなくなりました。","A: 40 Interessierte, großer Saal nicht verfügbar."],
["担当Ｂ","小さい部屋なら二十五人まで入れますが、使用許可はまだです。","B: Kleiner Raum hat Kapazität 25, noch keine Genehmigung."],
["担当Ａ","では、許可が出るまで全員に参加決定のメールは送りません。先に部屋を確認します。","A: Keine Teilnahmezusagen vor Erlaubnis, erst Raum prüfen."],
["担当Ｂ","今日許可をもらいました。申し込みの早い二十五人に確認メールを送り、ほかの方には次の会をご案内しましょう。","B: Heute genehmigt; ersten 25 bestätigen, übrigen nächstes Treffen anbieten."],
["担当Ａ","承知しました。メールを分けて送り、人数と会場をもう一度確認します。","A: Unterschiedliche Mails, Kapazität und Raum nochmals prüfen."]
],questions:[
["status","最終的な部屋の定員は何人ですか。","二十五人です。","最大二十五人です。","四十人です。","Interessierte sind mehr als Raumkapazität.","二十五人まで入れます"],
["chronology","確認メールを送るのは何の後ですか。","部屋の許可をもらった後です。","許可が出てからです。","許可が出る前です。","Bestätigung darf Genehmigung nicht vorwegnehmen.","今日許可をもらいました"]
],compose:["Neue Kulturwerkstatt: 30 Interessierte, Raum für 18 genehmigt; ersten 18 bestätigen, übrigen neuen Termin anbieten.","会場の定員は十八人です。先に申し込んだ十八人に確認の連絡を送り、ほかの方には次の講座を案内します。","三十人から申し込みがありましたが、参加できるのは十八人までです。","三十人全員に参加決定を送りました。","Kapazitäts- und Fairnessregel."],
reply:["担当者から、部屋の定員が十六人に変更されたと連絡がありました。","Verantwortliche senken Kapazität auf 16.","Überarbeite Bestätigungsplan ohne fiktiv gesendete Nachrichten.","ありがとうございます。定員が十六人になったので、メールを送る前に対象者を確認し直します。","十六人に合わせて案内を修正します。","十八人にもう確定メールを送りました。","Neue Quelle vor Versand berücksichtigen."],
revision:["十八人まで参加できるので、メールはもう送りました。","Korrigiere jüngste Kapazität und Versandstatus.","最新の定員は十六人です。対象者を確認してからメールを送ります。","まだ全員に送っていません。十六人までの案内に直します。","Unerlaubte Überbuchung vermeiden."],
returnCue:["Neue Sporthalle: 22 angemeldet, offiziell nur 12 Plätze, Auswahl nach Anmeldezeit.","申し込みは二十二人ですが、定員は十二人です。早く申し込んだ人から確認します。","定員を超えているので、十二人に案内し、ほかの方には別の日を紹介します。","二十二人全員の席があります。","Neue Veranstaltung und Zahl."]
},
{id:"client-project-revision",title:"見積もりを送り直す前に",genre:"work",unit:"p26:library-project",setting:"Bericht muss nach Kundenkorrektur überarbeitet werden.",goal:"Fehlerentdeckung, geprüfte Korrektur, neue Bedingung und rechtmäßigen Versand auseinanderhalten",register:"polite",contrast:"Falsch versandtes Altdokument, korrigiertes noch nicht erneut geschickt.",words:["kakunin","henshuu","soushin"],messages:[
["お客様","昨日いただいた見積もりの金額が、前の説明と違います。確認していただけますか。","Kunde: Gestern erhaltenes Angebot enthält Betrag abweichend von Gespräch."],
["社員","ご連絡ありがとうございます。元の資料を確認したところ、一つの金額に間違いがありました。申し訳ありません。","Mitarbeiter: Originalquelle geprüft, ein Betrag war falsch; Entschuldigung."],
["主任","修正した資料は送信前に私にも見せてください。添付ファイル名も新しい日付にしてください。","Leitung: Korrigiertes Dokument vor erneuter Sendung vorlegen, Dateiname aktualisieren."],
["社員","承知しました。表とファイル名を修正し、いったん保存しました。まだお客様には送り直していません。","Mitarbeiter: Tabelle und Dateiname korrigiert, gespeichert, noch nicht erneut versandt."],
["主任","確認しました。これで大丈夫です。お客様におわびの一文を添えて送信してください。","Leitung: Jetzt geprüft und freigegeben, bitte mit Entschuldigung versenden."]
],questions:[
["status","最後の返事の時点で修正した見積もりは再送されましたか。","いいえ、まだ送信されていません。","いいえ、これから送るよう指示されました。","はい、すでに再送しました。","Erlaubnis ist nicht vollzogener Versand.","送信してください"],
["evidence","修正する必要があったものは何ですか。","金額と添付ファイル名です。","表の金額と新しい日付のファイル名です。","会議の場所です。","Zwei Korrekturen über mehrere Nachrichten.","表とファイル名を修正し"]
],compose:["Neue Kundenmail: Ein Lieferdatum war falsch, aktualisiert, Vorgesetzte hat noch nicht geprüft.","配達の日付に間違いがあり、修正しました。まだ再送信していませんので、ご確認をお願いします。","日付を直して保存しました。送る前に確認していただけますか。","修正済みでお客様に送り直しました。","Sorgfältige Fehlerkommunikation."],
reply:["内容を確認しました。新しい日付は正しいです。変更理由も一文加えてから送信してください。","Leitung genehmigt Datum, fordert Grundsatz.","Konkret nachführen, nicht behaupten bereits gesendet.","ご確認ありがとうございます。変更の理由を一文追加してから送信します。","承知しました。理由を加え、内容を見直してから送ります。","理由を加えずすでに送りました。","Neue letzte Bedingung vor Versand."],
revision:["理由も書かずに送信してしまいました。","Korrigiere Versand- und Inhaltsbehauptung.","修正の理由を追加し、最終確認をしてからお客様に送信します。","指示に従って説明を加えてから送り直します。","Authentischer Schritt bis zur Freigabe."],
returnCue:["Neue Museumsankündigung: Falsche Eintrittszeit korrigiert, noch nicht veröffentlicht, Leitung verlangt Quellenlink.","時間の間違いは直しましたが、まだ公開していません。出典のリンクを追加してから公開します。","新しい案内を確認し、資料の出典も記載します。","出典なしで公開済みです。","Neues Artefakt, gleiche Freigabekette."]
},
{id:"exchange-long-letter",title:"交流会のあとに書くメール",genre:"email",unit:"p23:introduction",setting:"Lernender antwortet Veranstalter und plant nächste Übung.",goal:"Dank, beobachtbaren Fortschritt, Grenzen und konkrete Rückfrage natürlich verbinden",register:"polite",contrast:"Besseres Nachfragen bedeutet nicht vollständiges spontanes Hörverstehen.",words:["sanka","mokuhyou","shitsumon"],messages:[
["主催者","先日は交流会にご参加いただき、ありがとうございました。日本語の会話はいかがでしたか。","Orga: Danke für Teilnahme. Wie lief das japanische Gespräch?"],
["学生","こちらこそ、ありがとうございました。前より質問ができるようになりましたが、速い話はまだ全部理解できませんでした。","Lernende: Ich kann besser fragen, verstehe schnelle Gespräche aber nicht vollständig."],
["主催者","それでも、わからない時に聞き返せたのはよかったですね。次回は短い説明をまとめる練習もしてみましょう。","Orga: Gut, dass Sie nachfragen konnten. Nächstes Mal kurze Erklärungen zusammenfassen."],
["学生","ありがとうございます。次回は相手の答えをメモして、自分の言葉で説明してみたいです。参加方法も教えていただけますか。","Lernende: Nächstes Mal Antworten notieren, eigenständig erklären; bitte Teilnahmeweg."],
["主催者","申し込みフォームは来週の月曜日に公開します。定員があるので、申し込み後の確認メールをお待ちください。","Orga: Formular nächsten Montag, Plätze begrenzt, Bestätigungsmail abwarten."]
],questions:[
["status","次回の参加はもう決まりましたか。","いいえ、申し込みと確認が必要です。","いいえ、まだ参加は確定していません。","はい、もう参加できます。","Registrierungsöffnung ist nicht Aufnahme.","確認メールをお待ちください"],
["reason","学生は次回どんな練習をしたいですか。","答えをメモして自分の言葉で説明したいです。","短い話を自分でまとめる練習です。","難しい単語を全部覚えるだけです。","Konkretes Lernziel aus vierter Nachricht.","自分の言葉で説明してみたいです"]
],compose:["Neue Tandem-Erfahrung: Du kannst klarer schreiben, verstehst aber schwierige Rückfragen noch nicht; danke und frage nach Übung.","先日はありがとうございました。前より書けるようになりましたが、難しい質問にはまだうまく答えられません。次の練習について教えていただけますか。","交流会は勉強になりました。質問に答える練習を続けたいです。","もうすべての会話を完全に理解できます。","Fortschritt konkret, nicht zertifiziert."],
reply:["次回は短い会話から始めます。ただし、参加するには水曜日までの申し込みが必要です。","Nächstes Mal kurze Gespräche, Anmeldung bis Mittwoch nötig.","Antworte mit Wertschätzung und klarer Frist.","ご案内ありがとうございます。短い会話から練習したいです。水曜日までに申し込みます。","承知しました。締め切りまでに手続きして、確認を待ちます。","申し込みなしで必ず参加できます。","Teilnahme bleibt an Anmeldung gebunden."],
revision:["次回はもう参加が決まりました。速い話も全部わかります。","Korrigiere unbelegte Zusage und Kompetenzbehauptung.","次回は水曜日までに申し込む必要があります。会話は少し上達しましたが、難しい質問はまだ練習中です。","参加はまだ確定していません。質問に答える力を伸ばしたいです。","Status und Fertigkeit unabhängig prüfen."],
returnCue:["Neue Lernveranstaltung: Besseres Französischlesen, spontanes Sprechen schwierig; Anmeldung bis Freitag nötig.","前より文章を読めるようになりましたが、話すのはまだ難しいです。金曜日までに申し込みます。","次回は会話を練習したいです。参加の確認を待ちます。","参加も能力もすべて確定しました。","Andere Sprache und Anmeldepflicht."]
},
{id:"family-travel-letter",title:"祖母との予定を決めるまで",genre:"chat",unit:"p26:weekend-switch",setting:"Familie ändert Reise nach zwei ausgefallenen Verbindungen.",goal:"Familienzustimmung, ausgebuchte Alternative, neue Ankunft und begrenzte Besuchszeit behalten",register:"casual",contrast:"Ursprüngliche Samstagfahrt gestrichen, Nachtbus voll, Sonntag erst nach Bestätigung gebucht.",words:["yoyaku","chuushi","tsugou"],messages:[
["姉","土曜日の夜の電車が中止になったよ。祖母のところに行く予定を変えないと。","Schwester: Samstagszug fällt aus; Besuchsreise muss geändert werden."],
["弟","夜行バスは調べた？土曜日のうちに出られるかもしれないよ。","Bruder: Nachtbus als mögliche Alternative?"],
["姉","調べたけど満席だった。日曜日の朝なら電車があるみたい。祖母に先に聞いてみるね。","Schwester: Nachtbus voll; Zug Sonntagmorgen möglich, Oma zuerst fragen."],
["祖母","日曜日の午後なら大丈夫だよ。無理しないで、気をつけて来てね。","Oma: Sonntagnachmittag passt, reist ohne Eile."],
["姉","ありがとう。日曜日の九時の電車を予約したよ。前より短い時間だけど、会えるのが楽しみ。","Schwester: 9-Uhr-Sonntagszug gebucht, kürzerer Aufenthalt als ursprünglich."]
],questions:[
["chronology","電車を予約する前に誰の都合を確認しましたか。","祖母です。","おばあさんに聞きました。","夜行バスの運転手です。","Zustimmung ging Ticketbuchung voraus.","祖母に先に聞いてみるね"],
["reason","土曜日の夜行バスで行かなかったのはなぜですか。","満席だったからです。","席がなかったからです。","日曜日に予約したからです。","Nachtbusausfall wegen Kapazität.","調べたけど満席だった"]
],compose:["Neuer Besuch: Freitagsfähre fällt aus, Samstagsbus möglich; erst bei Tante nachfragen.","金曜日の船が中止になりました。土曜日のバスで行けるかもしれませんが、先に叔母の都合を聞いてから予約します。","土曜日でもいいか叔母に確認してからバスを予約します。","叔母に聞かずにもう予約しました。","Planung und Zustimmung."],
reply:["土曜日は病院に行くので、日曜日の午後なら会えるよ。","Tante hat Samstag Arzttermin, Sonntag Nachmittag frei.","Ändere Zieltag respektvoll, keine voreilige Buchung.","教えてくれてありがとう。日曜日の午後に行けるか、バスを確認してから連絡するね。","日曜日の午後ならいいんだね。交通を調べるよ。","土曜日に必ず行くね。","Neue Verfügbarkeit und offene Verkehrsbuchung."],
revision:["土曜日のバスを予約したから、その日に会うね。","Korrigiere zum neuen Termin und offene Buchung.","土曜日は都合が悪いと聞いたので、日曜日の午後に行けるか交通を確認しています。","日曜日に会いたいです。まだバスは予約していません。","Nicht Einwilligung übergehen."],
returnCue:["Neuer Fall: Sonntagflug entfällt, Montagzug möglich, Freund erst abends frei.","日曜日の飛行機が中止なので、月曜日の電車を調べます。友達は夜なら会えるそうです。","月曜日の夜に会えるか確認してから予約します。","日曜日の飛行機でもう行きました。","Neue Verkehrsart und Person."]
},
{id:"public-correction",title:"間違った案内を直す",genre:"notice",unit:"p26:library-project",setting:"Gemeindeverein veröffentlicht Korrektur eines Aushangs.",goal:"Verantwortlich transparent korrigieren, alte und neue Zeiten benennen und offene Frage offenlassen",register:"polite",contrast:"Öffnungszeit offiziell auf 16 Uhr korrigiert; geplanter Workshopbeginn separat ungeklärt.",words:["anai","kakunin","koukai"],messages:[
["事務局","昨日の案内では、交流室は午後三時に閉まると書きました。","Büro: Gestern wurde Schließung um 15 Uhr angekündigt."],
["係員","市の最新の案内を確認したところ、閉まるのは午後四時でした。昨日の説明を訂正してください。","Mitarbeiter: Aktuelle Stadtinfo sagt 16 Uhr, bitte korrigieren."],
["事務局","ご指摘ありがとうございます。閉館時間を四時に直しました。講座の開始時間も変わりますか。","Büro: Korrigiert auf 16 Uhr; ändert sich auch Workshopbeginn?"],
["係員","開始時間はまだ確認していません。午後四時の閉館だけを公開して、講座については後で知らせてください。","Mitarbeiter: Workshopstart ungeprüft. Nur 16-Uhr-Schließung veröffentlichen, Workshop später."],
["事務局","承知しました。昨日の三時という案内は間違いでした。現在は四時に閉まります。講座の時間は確認後にお知らせします。","Büro: Formelle Korrektur von 15 zu 16 Uhr; Workshopzeit folgt."]
],questions:[
["status","講座の開始時間も決まりましたか。","いいえ、まだ確認していません。","いいえ、後で知らせる予定です。","はい、午後四時開始です。","Schließzeit ist nicht Workshopstart.","開始時間はまだ確認していません"],
["chronology","間違った三時の案内はいつのものですか。","昨日の案内です。","昨日公開した情報です。","来週の案内です。","Chronologie der Korrektur.","昨日の案内では"]
],compose:["Neuer öffentlicher Bericht: Falsche Zugabfahrt 12 Uhr gestern, heute offiziell 12:30, Ankunftszeit noch offen.","昨日、出発は十二時と案内しましたが、最新情報では十二時半です。到着時間はまだ確認中です。","出発時間を十二時半に訂正します。到着については後でお知らせします。","到着も十二時半で確定しました。","Korrektur ohne weitere erfundene Angaben."],
reply:["新しい案内では到着は午後二時ごろの予定です。ただし、遅れる可能性があります。","Neue Ankunftsprognose ca. 14 Uhr, Verspätung möglich.","Ergänze Prognose ohne verbindliche Zusage.","ご連絡ありがとうございます。到着は午後二時ごろの予定ですが、変更の可能性がありますと案内します。","到着は二時ごろと書き、確定ではないことも伝えます。","午後二時に必ず到着しました。","Prognose und Unsicherheit."],
revision:["昨日から到着も出発も十二時半と決まっていました。","Korrigiere beide unabhängigen Zeitangaben.","最新の出発時間は十二時半です。到着は午後二時ごろの予定で、遅れる可能性があります。","昨日の出発の案内を訂正します。到着はまだ予定です。","Keine unbelegte Rückdatierung oder Garantie."],
returnCue:["Neue Stadtinfo: Falscher Busfahrplan 18 Uhr alt, 17:30 neu; Ankunft 19 Uhr nur geplant.","古い案内は六時ですが、今の出発は五時半です。到着は七時ごろの予定です。","出発時間を訂正し、到着はまだ予定だと伝えます。","出発も到着も必ず六時です。","Anderer Sachverhalt mit zwei Zeitdimensionen."]
}
];
export const p57ThreadsE=authored.map(authoredP57);
