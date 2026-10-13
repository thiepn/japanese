import {authoredP57,type P57RawThread} from "./writing57-types";
const authored:readonly P57RawThread[]=[
{id:"intern-update",title:"報告書の確認をお願いします",genre:"work",unit:"p26:library-project",setting:"Mitarbeiterin schickt Statusupdate an Teamleitung.",goal:"Erledigte Revision, offene Freigabe und Versandstatus unterscheiden",register:"polite",contrast:"Tabelle korrigiert, Kundenversand wartet Leitungsfreigabe.",words:["houkoku","kakunin","soushin"],messages:[
["社員","お疲れ様です。報告書の数字を元の資料で確認し、表を修正しました。説明の部分はまだ見直しています。","Mitarbeiterin: Zahlen gegen Originalquelle geprüft und Tabelle korrigiert; Text wird noch geprüft."],
["主任","ご報告ありがとうございます。お客様にはもう送信しましたか。","Leitung: Danke. Ist das Dokument bereits beim Kunden?"],
["社員","いいえ、まだ送信していません。修正したファイルを保存しただけです。ご確認後に送りたいと思います。","Mitarbeiterin: Nein, nur gespeichert. Versand erst nach Ihrer Prüfung."],
["主任","わかりました。今日の午後に確認します。それまでは送信しないでください。","Leitung: Ich prüfe heute Nachmittag. Bitte bis dahin nicht versenden."]
],questions:[
["status","ファイルはもうお客様に送られましたか。","いいえ、保存しただけです。","いいえ、まだ送信していません。","はい、もう送信しました。","Speichern und Versenden sind getrennt.","まだ送信していません"],
["chronology","いつ送信する予定ですか。","主任に確認してもらってからです。","確認が終わった後です。","確認前にすぐ送ります。","Vorläufige Sperre bis Freigabe.","それまでは送信しないでください"]
],compose:["Kollegin hat korrigierte Rechnung gespeichert, noch nicht geschickt. Bitte Leitung um Prüfung.","請求書を修正して保存しましたが、まだ送信していません。内容をご確認いただけますか。","修正した請求書の確認をお願いします。承認後に送信します。","すでにお客様に送りました。","Status wahrheitsgemäß berichten."],
reply:["修正内容を確認しました。ただし、添付ファイルの名前も直してから送ってください。","Änderungen geprüft, Dateiname muss vor Versand korrigiert werden.","Bestätige neue Bedingung, ohne Versand vorwegzunehmen.","ご確認ありがとうございます。ファイル名も修正してから送信します。","承知しました。添付ファイル名を直し、その後で送ります。","もう送信しました。","Nachtrag als Teil des autorisierten Workflows."],
revision:["確認を待たず、間違った名前で送信しました。","Korrigiere den Status anhand der letzten Anweisung.","ご指示ありがとうございます。ファイル名を直し、送信前にもう一度確認します。","添付ファイルを修正してからお客様へ送信します。","Ungeprüfte Veröffentlichung nicht behaupten."],
returnCue:["Neuer Fall: Postertext ist korrigiert, Fotos brauchen noch Genehmigung; Veröffentlichung erst danach.","文章は修正しましたが、写真の許可がまだです。確認してから公開します。","ポスターはまだ公開していません。写真の許可を待っています。","もう全部公開しました。","Neue Quelle und Genehmigungsbedingung."]
},
{id:"clinic-callback",title:"病院からの折り返し連絡",genre:"chat",unit:"p25:appointment",setting:"Klinik und Patient koordinieren Untersuchung und Rückruf.",goal:"Bestehende Termine, Prüfung und später bestätigte Änderung rekonstruieren",register:"service",contrast:"Untersuchungstermin 13:30 ist nur bis bestätigtem Rückruf unverändert.",words:["kensa","yoyaku","henkou"],messages:[
["患者","明日の診察は二時ですが、検査の予約が一時半になっています。電車の都合で検査だけ遅くできますか。","Patient: Arzttermin 14 Uhr, Test 13:30. Kann nur der Test später sein?"],
["受付","ご連絡ありがとうございます。診察は二時のままで、検査を三時に変更できるか担当者に確認します。","Empfang: Arzttermin bleibt 14 Uhr. Wir prüfen Test um 15 Uhr."],
["患者","ありがとうございます。三時への変更はまだ決まっていないのですね。ご連絡をお待ちしています。","Patient: Also Änderung auf 15 Uhr noch unbestätigt; ich warte."],
["受付","確認できました。検査は三時に変更しました。診察は二時のままです。","Empfang: Test jetzt auf 15 Uhr geändert, Arzttermin unverändert 14 Uhr."]
],questions:[
["status","最後に三時になったのは何ですか。","検査です。","検査だけ三時になりました。","診察も三時です。","Nur Test wurde geändert.","検査は三時に変更しました"],
["chronology","変更が決まる前に受付は何をしましたか。","担当者に確認しました。","変更できるか確認しました。","何も確認せず変更しました。","Rückfrage vor Zusage.","担当者に確認します"]
],compose:["Neuer Fall: Zahnarzttermin 10 Uhr, Röntgen 9:30. Bitte nur Röntgen auf 11 Uhr prüfen.","診察は十時のままで、レントゲン検査だけ十一時に変更できますか。ご確認をお願いします。","診察時間を変えずに、検査だけ遅くしていただけますか。","両方十一時に変更されました。","Einen Teil des Ablaufs auswählen."],
reply:["十一時の検査は予約がいっぱいですが、十一時半なら空いています。","11 Uhr ausgebucht, 11:30 möglich.","Neue Alternative erfragen beziehungsweise akzeptieren.","ご確認ありがとうございます。それでは十一時半に検査をお願いできますか。診察は十時のままでお願いします。","十一時半の検査を希望します。診察は変更しません。","十一時に検査が決まりました。","11:00 ausdrücklich abgelehnt."],
revision:["診察も検査も十一時になりました。","Korrigiere nur Testzeit und noch zu bestätigende Alternative.","診察は十時のままです。検査は十一時半に変更できるかお願いしています。","検査は十一時半を希望しています。診察は十時です。","Vorgeschlagener Slot nicht vor Bestätigung als abgeschlossen melden."],
returnCue:["Anderer Dienst: Zugticket 8 Uhr unverändert, Sitzplatzwechsel angefragt und bestätigt erst später.","電車の時間は八時のままです。座席の変更をお願いしましたが、まだ確認中です。","出発時間は変わらず、席だけ変更できるか聞いています。","電車も座席も変更済みです。","Anderes Objekt mit Teiländerung."]
},
{id:"library-group-room",title:"勉強部屋を借りる手続き",genre:"email",unit:"p25:library",setting:"Studiengruppe möchte reservierbaren Raum nutzen.",goal:"Verfügbarkeit, Ausweisanforderung und tatsächliche Buchung auseinanderhalten",register:"polite",contrast:"Freier Raum 16–17 Uhr, Reservierung erst nach Ausweis.",words:["yoyaku","uketsuke","kakunin"],messages:[
["学生","明日、四人で勉強したいのですが、午後四時から五時まで使える部屋はありますか。","Student: Morgen Raum für vier von 16 bis 17 Uhr verfügbar?"],
["図書館","その時間は空いています。予約する場合は、学生証を持って受付へ来てください。","Bibliothek: Verfügbar; Buchung am Schalter mit Ausweis."],
["学生","ありがとうございます。今は学生証が手元にありません。夕方取りに行ってから受付へ行きます。","Student: Ich habe den Ausweis noch nicht bei mir, gehe ihn abends holen."],
["図書館","承知しました。ただし、まだ予約は確定していません。ほかの方が先に申し込む可能性もあります。","Bibliothek: Verstanden. Buchung noch nicht bestätigt; andere könnten zuerst buchen."]
],questions:[
["status","部屋の予約は確定しましたか。","いいえ、まだ確定していません。","いいえ、受付で手続きが必要です。","はい、空いているから確定です。","Verfügbarkeit ≠ Reservierung.","まだ予約は確定していません"],
["evidence","予約するために何が必要ですか。","学生証です。","受付で学生証を見せることです。","図書カードは必要ありません。","Ausweis ausdrücklich genannt.","学生証を持って受付へ来てください"]
],compose:["Sporthalle ist vermutlich Dienstag 17–18 Uhr frei, Buchung erst nach Zahlung. Frage höflich.","火曜日の五時から六時まで利用できますか。料金を払ってから予約できますでしょうか。","予約のために必要な支払い方法を教えていただけますか。","空いていたので予約は確定しました。","Verfügbarkeit und Zahlung."],
reply:["空いていますが、予約の確定には事前のお支払いが必要です。","Raum frei, Vorauszahlung nötig.","Bestätige Bedingung ohne schon bezahlte Buchung zu behaupten.","ご返信ありがとうございます。先に料金を支払ってから予約の手続きをします。","承知しました。支払い方法を確認して、予約します。","支払い前に予約できました。","Vorbedingung für rechtswirksame Buchung."],
revision:["もう予約が確定したので、支払いはしません。","Schreibe korrekte Absicht.","まだ予約は確定していません。事前に料金を支払ってから手続きします。","空きはありますが、予約には支払いが必要です。","Zahlung bleibt Voraussetzung."],
returnCue:["Neuer Fall: Seminarraum verfügbar Mittwoch, Zugang erst nach Anmeldung an der Rezeption.","水曜日は部屋が空いていますが、受付で申し込んでから使えます。","利用する前に受付で手続きします。","空いているので自由に入れます。","Andere Bedingung, gleicher Status."]
},
{id:"feedback-linguistic",title:"発表の感想への返事",genre:"chat",unit:"p23:introduction",setting:"Lernende erhält konstruktives Feedback zu ihrem Vortrag.",goal:"Fortschritt anerkennen, konkrete verbleibende Schwierigkeit benennen",register:"polite",contrast:"Klarere Einleitung bedeutet nicht perfektes Beantworten schwieriger Fragen.",words:["happyou","shitsumon","mokuhyou"],messages:[
["ミナ","今日の発表、前より最初の説明がわかりやすかったよ。","Mina: Dein Einleitungsteil war heute verständlicher als früher."],
["ハル","ありがとう。質問に答える時は少し時間がかかったと思う。","Haru: Danke, beim Beantworten von Fragen brauchte ich etwas Zeit."],
["ミナ","そうだね。でも、理由を説明できたのはよかったよ。次は難しい質問を聞き返してもいいと思う。","Mina: Ja, aber Gründe konntest du erklären. Bei schweren Fragen solltest du nachfragen."],
["ハル","そうしてみるね。次回は質問をメモしてから、自分の言葉で答える練習をするよ。","Haru: Das mache ich. Nächstes Mal notiere ich Fragen und übe eigene Antworten."]
],questions:[
["reason","ハルさんは何をもっと練習したいですか。","質問を聞いて自分の言葉で答えることです。","質問をメモして答える練習です。","最初の説明だけです。","Lernziel am Ende genannt.","自分の言葉で答える練習をするよ"],
["status","質問にはいつもすぐ答えられましたか。","いいえ、少し時間がかかりました。","いいえ、答えるのに時間がかかりました。","はい、すべてすぐ答えました。","Selbsteinschätzung differenziert.","少し時間がかかったと思う"]
],compose:["Neue Sprachgruppe: Dein Zuhören wurde besser, längere Antworten bleiben schwierig. Schreibe reflektiert.","前より相手の話を聞けるようになりましたが、長い答えはまだ全部理解できません。もっと練習したいです。","聞く力は少し上達しました。でも、長い説明は難しいので復習します。","もうすべて完全に理解できます。","Fortschritt und echte Grenze."],
reply:["次は短い答えをまとめてから、少しずつ長い説明にも挑戦しよう。","Nächstes Mal erst kurze Antworten zusammenfassen, dann längere Erklärungen üben.","Antworte auf konkreten Vorschlag.","ありがとう。まず短い答えを自分の言葉でまとめて、少しずつ長い話にも挑戦するね。","その方法で練習してみるよ。助かります。","長い話はもう全部わかります。","Nächsten Lernschritt korrekt übernehmen."],
revision:["先生が全部できると言ったので、練習は終わりです。","Korrigiere zugeschriebenes Feedback und Kompetenzstand.","聞く力は前よりよくなりましたが、長い話はまだ難しいです。短い説明から練習します。","少し上達しました。でも、次の目標があります。","Lob ist keine umfassende Zertifizierung."],
returnCue:["Andere Fachkompetenz: Mathematikaufgaben schneller lösen, Beweise weiterhin schlecht erklären.","前より問題を早く解けますが、証明を説明するのはまだ難しいです。もっと練習します。","計算は上達しました。でも、証明には時間がかかります。","証明も全部完璧です。","Neues akademisches Thema."]
},
{id:"neighborhood-notice",title:"公園の明かりについて",genre:"community",unit:"p26:library-project",setting:"Nachbarschaft meldet defekte und ausgeschaltete Lampen.",goal:"Beobachtung, Ursache und nur angekündigte Reparatur differenzieren",register:"polite",contrast:"Zwei dunkle Lampen: eine defekt, andere baubedingt aus. Reparatur erst geplant.",words:["koshou","shuuri","houkoku"],messages:[
["住民","公園の道で二か所の電気がついていませんでした。両方故障しているのでしょうか。","Bewohner: Zwei Stellen dunkel. Sind beide Lampen defekt?"],
["係員","ご連絡ありがとうございます。一か所は故障していますが、もう一か所は工事のため消してあります。","Stadt: Eine defekt, die andere wegen Bauarbeiten ausgeschaltet."],
["住民","わかりました。修理はもう終わりましたか。夜に通る人に知らせたいです。","Bewohner: Ist die Reparatur bereits fertig? Ich möchte die Nachbarschaft informieren."],
["係員","まだです。故障した電気は来週修理する予定です。工事中の場所には入らないでください。","Stadt: Noch nicht. Reparatur für nächste Woche vorgesehen; Baugebiet meiden."]
],questions:[
["status","二か所とも故障していますか。","いいえ、一か所だけ故障しています。","いいえ、もう一か所は工事で消えています。","はい、二つとも故障です。","Dunkelheit hat zwei Gründe.","一か所は故障していますが、もう一か所は工事のため"],
["chronology","修理はすでに終わりましたか。","いいえ、来週の予定です。","いいえ、まだ終わっていません。","はい、昨日終わりました。","Zukunft ≠ Vollzug.","まだです。故障した電気は来週修理する予定です"]
],compose:["Neuer öffentlicher Hinweis: Aufzug defekt, Reparatur Freitag geplant, Treppe verfügbar.","エレベーターは現在故障中です。金曜日に修理する予定です。それまでは階段をご利用ください。","エレベーターはまだ使えません。修理は金曜日の予定です。","修理はすでに終わりました。","Klare Sicherheit und Zeitstatus."],
reply:["修理は金曜日ではなく土曜日の予定に変更しました。","Reparatur auf Samstag verschoben.","Passe öffentlichen Text an und markiere noch nicht repariert.","ご連絡ありがとうございます。修理予定を土曜日に直します。完了するまでは階段をご利用ください。","承知しました。土曜日の予定と案内します。","金曜日に修理済みです。","Aktuelle Planung ersetzt ältere Information."],
revision:["エレベーターは金曜日に修理が終わりました。","Korrigiere unzutreffende Vergangenheitsform.","エレベーターはまだ故障中です。土曜日に修理する予定です。","修理は土曜日に変更されました。まだ使えません。","Geplanter Reparaturtag ist kein Abschluss."],
returnCue:["Neues Stadtproblem: Wasserhahn außer Betrieb, Ersatz möglich, Reparatur erst Mittwoch vorgesehen.","水道は現在使えません。修理は水曜日の予定です。それまでは別の水道をご利用ください。","まだ修理が終わっていないので、別の場所を使ってください。","もう修理が終わりました。","Neue Anlage und anderes Ersatzangebot."]
},
{id:"school-exchange",title:"来週の交流会のお願い",genre:"email",unit:"p23:plans",setting:"Student bittet Veranstalter um Teilnahmeinformation.",goal:"Anfrage, Veranstaltungsfristen und begrenzte Plätze integrieren",register:"polite",contrast:"Registrieren vor Mittwoch, Teilnahme erst nach Bestätigung.",words:["moushikomi","sanka","kakunin"],messages:[
["学生","来週の国際交流会に参加したいのですが、今から申し込むことはできますか。","Student: Ich möchte nächste Woche teilnehmen. Ist eine Anmeldung noch möglich?"],
["事務局","ご連絡ありがとうございます。水曜日まで申し込めますが、定員は三十名です。申し込み後、確認メールをお送りします。","Orga: Anmeldung bis Mittwoch, maximal 30; Bestätigungsmail nach Antrag."],
["学生","わかりました。今日中にフォームを送信します。メールが来るまで参加はまだ確定しないのですね。","Student: Ich sende heute das Formular, Teilnahme erst mit Bestätigung."],
["事務局","はい、そのとおりです。満席の場合は、次の交流会についてご案内します。","Orga: Richtig. Bei Vollbelegung gibt es Informationen zum nächsten Treffen."]
],questions:[
["evidence","申し込みの締め切りはいつですか。","水曜日までです。","今週の水曜日です。","木曜日までです。","Deadline ausdrücklich.","水曜日まで申し込めます"],
["status","フォームを送信すれば必ず参加できますか。","いいえ、確認メールを待つ必要があります。","いいえ、定員があります。","はい、必ず参加できます。","Kapazität und bestätigte Aufnahme.","メールが来るまで参加はまだ確定しない"]
],compose:["Neue Workshopanfrage: Ob man Freitag noch anmelden kann und wann die Zusage kommt.","金曜日までに申し込めますか。また、参加の確認はいつ届きますか。よろしくお願いします。","申し込みの締め切りと、確認メールの予定を教えていただけますか。","参加はもう決まりました。","Frist und Bestätigung erfragen."],
reply:["申し込みは木曜日までです。確認メールは金曜日の午後に送る予定です。","Anmeldeschluss Donnerstag, Mail geplant Freitag Nachmittag.","Passe Plan an geänderte Frist an.","ご案内ありがとうございます。木曜日までに申し込み、金曜日の確認メールを待ちます。","承知しました。締め切り前に手続きをします。","金曜日に申し込みます。","Donnerstag statt zuvor gewünschtem Freitag."],
revision:["金曜日までに申し込めるので、金曜日に送信します。","Richte Antwort an offiziellem Donnerstag aus.","申し込みは木曜日までなので、木曜日までにフォームを送信します。","締め切りは木曜日です。確認メールを待ちます。","Vorgeschlagene Frist durch echte Anweisung ersetzen."],
returnCue:["Neue Museumsführung: Anmeldung bis Dienstag, Bestätigung erst Mittwoch, maximal zwölf.","火曜日までに申し込んで、水曜日の確認を待ちます。定員は十二人なので、まだ参加は確定していません。","申し込みだけでは参加が決まらないので、連絡を待ちます。","十二人なら誰でも必ず参加できます。","Neue Kapazität und Termine."]
},
{id:"lost-item-note",title:"忘れ物の連絡",genre:"email",unit:"p25:directions",setting:"Gast meldet vergessenes Buch und erhält Rückmeldung.",goal:"Fund, Eigentumsprüfung und tatsächliche Übergabe unterscheiden",register:"service",contrast:"Buch vermutlich vorhanden, Ausgabe erst nach Beschreibung.",words:["kakunin","uketsuke","anai"],messages:[
["客","昨日そちらの店に青いノートを忘れたかもしれません。受付に届いているか確認していただけますか。","Gast: Ich habe vielleicht ein blaues Notizbuch vergessen. Ist es am Schalter?"],
["店員","お問い合わせありがとうございます。青いノートが一冊届いていますが、お客様の物かどうかまだわかりません。","Personal: Ein blaues Notizbuch liegt vor, Zugehörigkeit unklar."],
["客","表紙の右下に小さな星のシールがあります。それが私のノートだと思います。","Gast: Unten rechts ist ein kleiner Sternaufkleber; vermutlich meins."],
["店員","確認しました。同じシールがあります。今日の午後六時までに受付へお越しください。","Personal: Aufkleber bestätigt. Bitte bis 18 Uhr am Schalter abholen."]
],questions:[
["status","最初の返事で自分のノートだと確定しましたか。","いいえ、まだわかりませんでした。","いいえ、特徴を確認する必要がありました。","はい、青かったので確定しました。","Farbe allein reicht nicht.","お客様の物かどうかまだわかりません"],
["chronology","いつまでにどこへ行きますか。","今日の午後六時までに受付です。","六時までに受付へ行きます。","明日の六時に行きます。","Letzter Fundhinweis.","今日の午後六時までに受付へ"]
],compose:["Du vermisst einen roten Schirm, im Café eventuell liegengeblieben. Beschreibe einen schwarzen Griff.","昨日、赤い傘を忘れたかもしれません。持ち手は黒いです。届いているかご確認いただけますか。","赤い傘の忘れ物はありますか。黒い持ち手がついています。","私の傘はもう返されました。","Fundanfrage ohne Übergabe."],
reply:["赤い傘はありますが、持ち手は白いです。もう少し特徴を教えていただけますか。","Roter Schirm vorhanden, aber weißer Griff. Weitere Merkmale erbeten.","Erkläre, dass dies vermutlich nicht dein Schirm ist.","ご確認ありがとうございます。私の傘は持ち手が黒いので、違うかもしれません。引き続き確認をお願いします。","持ち手が白いなら、私の傘ではないと思います。","それは必ず私の傘です。","Ähnliche Farbe allein nicht ausreichend."],
revision:["赤い傘があったので、私の物に決まりました。","Korrigiere falsche Identifikation.","赤い傘は見つかりましたが、持ち手が違うため、私の物かはまだわかりません。","私の傘は黒い持ち手です。見つかった物とは違うようです。","Merkmalskonflikt beachten."],
returnCue:["Neue Fundsache: Schwarze Tasche mit gelbem Anhänger, gefunden wurde schwarze Tasche ohne Anhänger.","黒いかばんはあるそうですが、私の物には黄色い飾りがついています。同じ物か確認してください。","色だけではわからないので、特徴を確認したいです。","黒いので必ず私のかばんです。","Andere Identifikation und Gegenstand."]
}
];
export const p57ThreadsB=authored.map(authoredP57);
