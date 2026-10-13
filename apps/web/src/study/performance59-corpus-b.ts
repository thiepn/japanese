import {authoredP59Compact,type P59Compact} from "./performance59-types";
/** 08–14: contextual evidence, responsibilities and multi-message response. */
const raw:readonly P59Compact[]=[
["report-deadline","レポートの出典を直す","p26:library-project","大学課題","polite",
"Dozent verlangt einen eigenständigen Vergleich und korrigiert das Format nach einer Nachfrage.",
"Quellenangabe, korrektes Format, Bearbeitungsstand und Frist integrieren",
[
["課題の案内","二つの新聞記事を比較し、共通点と違いを自分の言葉で書いてください。レポートは金曜日の午前十時までに提出します。","Kursblatt: Zwei Zeitungsartikel in eigenen Worten vergleichen, Gemeinsamkeiten und Unterschiede, Frist Freitag 10 Uhr."],
["授業資料","引用した文章には出典を記載してください。文章を長くコピーするのではなく、必要な部分だけ短く引用します。","Handreichung: Quellen für Zitate angeben; nur kurze notwendige Abschnitte zitieren statt lange kopieren."],
["提出方法","ファイルの形式はPDFです。提出した後で訂正したい場合は、先生に先に連絡してください。","Abgabeinfo: PDF; bei Korrektur nach Einreichen erst Lehrkraft kontaktieren."]],
[
["学生","昨日レポートを書き終えましたが、出典の一つを忘れていました。まだ提出していません。","Studentin: Bericht gestern fertig, eine Quelle vergessen, noch nicht eingereicht."],
["友達","書き直す時間はあるよ。まず資料の名前と日付を確認してからPDFにしよう。","Freund: Noch Zeit; Titel/Datum prüfen und dann PDF erstellen."]],
[
["先生","出典を直してから提出してください。文章の長さは今のままで大丈夫です。","Dozent: Quellen korrigieren, Länge kann bleiben."],
["学生","出典だけ直したら、そのままPDFで送ってよろしいですか。","Studentin: Nach Quellenkorrektur PDF direkt einreichen?"],
["先生","はい。ただし、提出は金曜日の朝十時までです。夜十時ではありません。","Dozent: Ja, aber Frist Freitag 10 Uhr morgens, nicht abends."],
["学生","承知しました。出典を確認し、PDFで早めに提出します。","Studentin: Ich prüfe Quellen und gebe rechtzeitig als PDF ab."]],
[
["evidence","最後に提出するファイルの形式は何ですか。","PDFです。","PDFのファイルで提出します。","手書きの紙だけです。","Abgabeweg ist ausdrücklich festgelegt.","ファイルの形式はPDFです","PDFで送ってよろしいですか"],
["chronology","出典を直すのは提出の前ですか。","はい、提出する前に直します。","出典を確認してから送ります。","提出した後でそのままにします。","Quelle muss vor Versand korrigiert werden.","出典の一つを忘れていました","出典を直してから提出してください"],
["status","午前十時を夜十時と考えてもよいですか。","いいえ、午前十時までです。","いいえ、金曜日の朝です。","はい、夜十時までです。","Präzise Frist darf nicht großzügig interpretiert werden.","金曜日の午前十時まで","夜十時ではありません"]
],
["Welcher nächste Schritt erfüllt alles?","出典を確認してからPDFにして、金曜日の午前十時までに提出します。","引用の情報を直し、期限前に送ります。","長い文章をコピーして金曜日の夜に出します。","Quelle, Format und Frist zugleich beachten."],
["Schreibe Dozent höflich, dass eine Quelle fehlte, noch nichts eingereicht wurde und du korrigieren wirst.","先生、レポートは書き終えましたが、出典が一つ抜けていました。まだ提出していません。出典を直してPDFにし、金曜日の朝十時までに送ります。","出典を確認してから提出します。締め切りまでに対応いたします。","すでに提出しましたので、出典は書きません。","Verbleibende Handlung wahrheitsgemäß beschreiben."],
["先生","ご連絡ありがとうございます。金曜日の九時から十時まではシステムの点検があります。九時前に提出してください。","Dozent: Systemwartung Freitag 9–10 Uhr; bitte vor 9 Uhr einreichen.","Reagiere auf neue engere praktische Abgabefrist.","ご案内ありがとうございます。点検の前に提出できるように、金曜日の九時より前にPDFを送ります。","承知しました。木曜日のうちに提出するようにします。","金曜日の九時半に送ります。","Neuere konkrete technische Sperre verkürzt das sichere Fenster."],
["金曜日の夜十時に文章をコピーしたファイルを出しました。","Korrigiere die nicht belegte Einreichung, Kopieren und neue Abgabefrist.","出典を直したPDFを金曜日の九時より前に提出します。まだ送っていません。","資料を自分の言葉でまとめ、木曜日までにPDFを提出します。","Nur angekündigte Abgabe nennen; keine erfundene fertige Handlung."],
["Andere Aufgabe: Literaturvergleich als PDF ursprünglich Dienstag 14 Uhr, Portal ab 13 Uhr geschlossen; Quelle prüfen und bis 13 Uhr abgeben.","出典を確認し、火曜日の午後一時より前にPDFを提出します。","システムが閉まる前に送ります。","午後二時に送れば必ず大丈夫です。","Neue Frist und anderes Studienprojekt."],
"書き終えた ≠ 提出済み; technische Einschränkungen und tatsächliche Frist abgleichen.",["shimekiri","kakunin","happyou"]],
["clinic-transport","病院までの行き方を相談","p25:appointment","通院と交通","service",
"Patient besucht reguläre Konsultation und separate Blutabnahme; Bus fällt kurzfristig aus.",
"Nur bestätigte einzelne Termine ändern, keine medizinischen Ergebnisse erfinden",
[
["予約票","診察は火曜日の午後二時から、採血は一時半からです。来院前に受付で予約票を見せてください。","Terminzettel: Arzttermin Dienstag 14 Uhr, Blutabnahme 13:30; am Empfang Zettel vorzeigen."],
["交通のお知らせ","火曜日の午前中は駅前で工事があります。一部のバスは遅れるため、最新の時刻を確認してください。","Verkehr: Dienstagvormittag Baustelle, manche Busse verspätet; aktuelle Fahrt prüfen."],
["病院の説明","採血の時間を変更したい場合は電話でご相談ください。診察の変更は別に手続きします。","Klinik: Blutabnahme telefonisch verschiebbar, Arzttermin nur separat."]],
[
["患者","バスの時間が不安なので、採血だけ二時半に変えられないか相談したいです。","Patient: Unsichere Busfahrt, möchte nur Blutabnahme auf 14:30 prüfen."],
["家族","診察は二時のままでいいんだね。病院から確認が来るまで決めない方がいいよ。","Familie: Sprechstunde bleibt 14 Uhr; Änderung erst bei Klinikbestätigung."]],
[
["受付","採血の二時半は今のところ空いていますが、担当者に確認します。","Empfang: 14:30 vorläufig verfügbar, noch Rückfrage."],
["患者","では、診察は二時のままにしてください。採血の変更だけお願いします。","Patient: Arzttermin bitte 14 Uhr lassen, nur Blutabnahme ändern."],
["受付","確認が取れました。採血は二時半に変更しました。診察は二時です。","Empfang: Blutabnahme 14:30 bestätigt, Sprechstunde 14 Uhr."],
["患者","ありがとうございます。受付で二つの時間をもう一度確認します。","Patient: Danke, beide Zeiten am Empfang erneut prüfen."]],
[
["chronology","採血の時間が確定したのはいつですか。","受付の最後の確認の後です。","担当者への確認が取れてからです。","患者が最初に希望した時です。","Erst durch autorisierte Bestätigung.","採血の時間を変更したい場合は電話","確認が取れました"],
["status","最後の診察時間と採血時間は何時ですか。","診察は二時で、採血は二時半です。","診察が午後二時、採血が午後二時半です。","二つとも二時半です。","Teiländerung darf nicht auf beide Termine übertragen werden.","診察は火曜日の午後二時","診察は二時です"],
["evidence","病院では何を受付に見せる必要がありますか。","予約票です。","予約の紙を見せます。","交通の切符だけです。","Vorgabe unabhängig von Terminen.","受付で予約票を見せてください","受付で二つの時間をもう一度確認します"]
],
["Wähle sichere Ankunftsstrategie.","診察の二時と採血の二時半を確認し、予約票を持って早めに病院へ行きます。","バスの時刻を調べてから出発します。","採血が二時半なので診察も二時半です。","Geänderte und unveränderte Werte trennen."],
["Schreibe einer Begleitperson in 2–3 japanischen Sätzen, was geändert wurde und was unverändert blieb.","診察は午後二時のままですが、採血は二時半に変更されました。バスが遅れるかもしれないので、時間を確認して早めに出ます。","病院から採血の変更を確認してもらいました。予約票を持って行きます。","診察と採血は両方二時半になりました。","Ankündigen ohne medizinische Schlussfolgerung."],
["病院","担当者の都合により、採血は午後三時以降になります。ご都合はいかがでしょうか。","Klinik: Wegen Personal kann Blutabnahme erst ab 15 Uhr erfolgen; passt das?","Antworte höflich als Anfrage und frage nach Trennung.","ご連絡ありがとうございます。午後三時からでも大丈夫です。診察は二時のままでよろしいでしょうか。","三時以降を希望します。診察時間についても確認をお願いします。","二つの検査は必ず三時になりました。","Ein neuer Vorschlag ist keine automatische Doppeländerung."],
["診察も採血も二時半になったので、結果もわかりました。","Entferne erfundene Resultate und falschen Gesamttermin.","診察は二時の予定です。採血は三時以降になる可能性があり、確認を待っています。","採血について新しい時間を相談中です。結果についてはまだ何も聞いていません。","Keine medizinische Diagnose oder Terminbehauptung."],
["Neue Praxis: Arzttermin 10 Uhr, bildgebende Untersuchung 9:30, verschoben auf 11 Uhr nur nach Bestätigung.","診察は十時のままで、検査を十一時に変更できるか確認します。","二つの予約を分けて確認します。","診察も検査も十一時になりました。","Anderer medizinischer Ablauf."],
"採血の時間と診察の時間は独立; keine Diagnosen oder Symptomdeutung.",["kensa","yoyaku","henkou"]],
["parcel-neighbor","宅配便と不在票","p25:shopping","配達と受取","service",
"Zusteller lässt Karte; Kunde verwechselt Abholfenster und bestätigte neue Zustellung.",
"Abgabefrist, Abholort und noch zu bestätigende erneute Lieferung verbinden",
[
["不在票","火曜日に荷物をお届けしましたが、ご不在でした。再配達は水曜日から申し込めます。","Benachrichtigung: Dienstag erfolgloser Zustellversuch; Neuzustellung ab Mittwoch beantragbar."],
["サービスの案内","荷物は営業所で保管しています。受け取りには番号と本人確認が必要です。","Service: Paket im Depot, Abholung nur mit Nummer und Identitätsprüfung."],
["受付時間","営業所は平日の午後六時まで開いています。再配達が決まるまでは、日付を確認してください。","Öffnungszeiten: Depot werktags bis 18 Uhr; Neuzustellungstermin muss ausdrücklich bestätigt sein."]],
[
["客","木曜日の夜なら家にいますが、まだ再配達を申し込んでいません。","Kunde: Donnerstagabend daheim, Neuzustellung noch nicht beantragt."],
["友人","営業所で受け取ることもできるけど、木曜日は六時前に着けないよね。","Freund: Depotabholung möglich, aber Kunde kommt Donnerstag nicht vor 18 Uhr."]],
[
["係員","木曜日の夜は配達できません。金曜日の午後なら空きがあります。","Service: Donnerstagabend geht nicht, Freitagnachmittag wäre frei."],
["客","金曜日の午後に変更したいです。今、予約できますか。","Kunde: Möchte Freitagnachmittag und fragt nach Buchung."],
["係員","ご希望を受け付けました。担当者が確認した後、確定メールを送ります。","Service: Wunsch erhalten; Bestätigungsmail erst nach Teamprüfung."],
["客","ありがとうございます。確定の連絡を待っています。","Kunde: Danke, wartet auf Bestätigung."]],
[
["status","金曜日の再配達は確定していますか。","いいえ、まだメールを待っています。","いいえ、希望を受け付けただけです。","はい、金曜日に必ず届きます。","Anfrage und Terminzusage getrennt.","再配達が決まるまでは","確定メールを送ります"],
["chronology","荷物を最初に届けようとしたのはいつですか。","火曜日です。","火曜日に不在でした。","金曜日です。","Versuch nicht mit späterem Wunsch verwechseln.","火曜日に荷物をお届けしました","金曜日の午後なら"],
["evidence","営業所で直接受け取るなら何が必要ですか。","番号と本人確認です。","受付番号と身分の確認が必要です。","何もいりません。","Depotverfahren eigenständig.","番号と本人確認が必要です","確定メールを送ります"]
],
["Wähle realistischen nächsten Schritt.","金曜日の再配達の確認メールを待ち、日時が決まってから家で受け取ります。","受け取り方法と時間を確認してから決めます。","木曜日の夜に必ず営業所で受け取ります。","Öffnung und Verfügbarkeit beachten."],
["Schreibe 2–3 höfliche japanische Sätze an den Versandservice.","金曜日の午後に再配達を希望しています。まだ確定メールが届いていないため、予約の状況を確認していただけますか。よろしくお願いいたします。","再配達の受付をありがとうございます。確定の連絡を待っています。","金曜日の配達はもう完了しました。","Status angemessen berichten."],
["係員","申し訳ありません。金曜日の午後は満席になりました。土曜日の午前中ならお届けできます。","Service: Freitag nun voll; Samstagvormittag möglich.","React to revised proposal; do not pretend delivery happened.","ご連絡ありがとうございます。土曜日の午前中にお願いできますか。確定しましたらご連絡ください。","それでは土曜日の午前を希望します。確認をお願いします。","金曜日の再配達で決まりました。","Spätere Absage ersetzt die frühere Möglichkeit."],
["金曜日の夜に営業所で番号なしで受け取り、再配達も完了しました。","Korrigiere unzulässige Depotabholung und fiktive Zustellung.","まだ受け取っていません。土曜日の午前中の再配達をお願いし、確認を待っています。","番号が必要な営業所ではなく、再配達を希望しています。","Kein abgeschlossener Empfang."],
["Neuer Kurier: Repariertes Gerät liegt im Depot bis 17 Uhr; Neuzustellung Montag 10 Uhr angefragt, unbestätigt.","荷物はまだ受け取っていません。月曜日の十時に再配達できるか確認中です。","予約が確定するまで待ちます。","もう受け取りました。","Andere Ware und Termin."],
"再配達希望 ≠ 確定メール; erfolgloser Zustellversuch ≠ zugestellt.",["haitatsu","kakunin","yoyaku"]],
["neighborhood-closure","公園の二つの入口","p25:directions","近所の安全案内","polite",
"Parkweg, Baustelle und Radfahrerregel widersprechen einem alten Onlineplan.",
"Verlässliche Sicherheitsansagen priorisieren und unsichere Wege nicht empfehlen",
[
["公園の地図","北口と東口から公園に入れます。図書館へは北口が近いです。","Ältere Parkkarte: Nord- und Osteingang, Bibliothek näher am Norden."],
["工事のお知らせ","今週は北口が工事のため閉まっています。公園の中の自転車道も一部使えません。","Aktuelle Baustelleninfo: Nordtor diese Woche geschlossen, Teile des Radwegs gesperrt."],
["安全の案内","工事中の場所には入らないでください。東口から歩いて行く道を利用できます。","Sicherheitshinweis: Baustellen nicht betreten; Fußweg vom Osttor möglich."]],
[
["リナ","図書館へ自転車で行こうと思ったけど、北口を通れないみたい。","Rina: Wollte mit Fahrrad zur Bibliothek, Nordtor offenbar gesperrt."],
["マサ","友人の地図には北口の道があるけど、今週の工事情報を優先しよう。","Masa: Freundeskarte nennt Norden, aktuelle Sperre ist wichtiger."]],
[
["係員","北口は使えません。東口の案内板に歩く道が書いてあります。","Parkpersonal: Norden nicht nutzbar; Wegweiser am Osttor für Fußweg."],
["リナ","自転車はどうしたらいいですか。","Rina: Was soll ich mit Fahrrad tun?"],
["係員","工事の区域には入らず、決められた駐輪場に止めてください。","Parkpersonal: Nicht in Bauzone, ausgewiesenen Fahrradständer nutzen."],
["マサ","それなら東口から歩いて行こう。安全な道を確認できたね。","Masa: Dann vom Osttor zu Fuß; sicheren Weg geklärt."]],
[
["evidence","今週、図書館へ向かうにはどちらの入口を使いますか。","東口です。","東口から歩きます。","北口です。","Neuere Sicherheitsinformation schlägt alte Karte.","北口が工事のため閉まっています","東口の案内板に"],
["inference","古い地図だけで北口をすすめてもよいですか。","いいえ、今は閉まっています。","いいえ、新しい工事情報を確認します。","はい、地図に道があるからです。","Zeitliche Quelle und aktuelle Sicherheit.","北口が近いです","北口は使えません"],
["status","自転車で工事の場所を通ってもよいですか。","いいえ、駐輪場に止めて歩きます。","いいえ、工事区域には入れません。","はい、急げば通れます。","Sicherheitsregel explizit.","工事中の場所には入らないでください","決められた駐輪場に止めてください"]
],
["Empfiehl einer Freundin eine sichere Route.","北口は工事中なので、東口から歩いて行きましょう。自転車は駐輪場に止めます。","新しい案内を見て、安全な道を選ぼう。","工事の中を自転車で通ります。","Keine riskante Abkürzung."],
["Schreibe kürzere Wegbeschreibung mit zwei Sätzen und Bedingung.","今週は北口が閉まっています。図書館へは東口から歩いて行ってください。自転車は指定された駐輪場に止めます。","工事区域を避けて東口からお入りください。","北口が一番早いのでそこを使ってください。","Offiziellen Weg respektieren."],
["係員","東口の近くで小さな工事が始まりましたが、歩く道はそのまま使えます。自転車では入らないでください。","Personal: Kleine Baustelle am Osttor, Fußweg weiterhin offen, Fahrräder nicht erlaubt.","Update Weg mit neuer Einschränkung.","ご連絡ありがとうございます。東口の歩く道は使えるのですね。自転車は止めてから向かいます。","自転車では入らず、案内された歩道を使います。","東口も完全に閉まりました。","Neue Baustelle ist nicht automatisch volle Sperrung."],
["北口を自転車で通れないから、東口も閉まったと思います。","Korrigiere ungestützte vollständige Ostsperre.","北口は閉まっていますが、東口の歩道は使えます。自転車は止めてください。","東口は歩けます。工事の場所には入りません。","Sicherheitsinformation differenziert."],
["Neuer Stadtweg: Fußbrücke gesperrt, Tunnel für Fußgänger offen, Fahrräder schieben.","橋が閉まっているので、地下道を歩きます。自転車は降りて押します。","新しい安全案内に従ってください。","閉まっている橋を渡ります。","Andere Infrastruktur."],
"案内の古さ・工事・安全regel unterscheiden; keine unbelegten Vollsperrungen.",["anai","henkou","kakunin"]],
["team-photo-approval","写真と報告書の公開","p26:library-project","学校行事の広報","polite",
"Schulverein bereitet Bericht vor, aber Foto- und Textfreigabe hängen an verschiedenen Zuständigen.",
"Schutz personenbezogener Bilder, Teamzugriff und Veröffentlichung prüfen",
[
["学校の規則","イベントの写真を公開する時は、写っている人の許可を確認してください。名前と顔を勝手に出さないでください。","Schulregel: Bei Fotoveröffentlichung Einwilligung der Abgebildeten prüfen; Namen/Gesichter nicht ungefragt publizieren."],
["チームの予定","報告書は金曜日までに先生へ提出します。公開する場合は別に担当者の確認が必要です。","Teamplan: Bericht bis Freitag an Lehrkraft; separate Freigabe für Veröffentlichung."],
["共有の案内","編集途中の資料はチームのメンバーだけに共有してください。外部へのリンク公開はしないでください。","Share-Regel: Entwürfe nur Teammitglieder, keine externen Freigabelinks."]],
[
["ユリ","写真は四枚あります。一枚には許可をもらっていない人が写っています。","Yuri: Vier Fotos, bei einem fehlt Einwilligung."],
["ケン","文章は直したけど、共有リンクが誰でも見られる設定だったかもしれない。","Ken: Text korrigiert, Link vielleicht öffentlich."]],
[
["先生","許可のない写真は使わず、文章で説明してください。","Lehrkraft: Foto ohne Einwilligung weglassen, durch Text ersetzen."],
["ユリ","では、残りの三枚はすぐ公開してもいいですか。","Yuri: Dürfen andere drei sofort öffentlich werden?"],
["先生","まだです。写真の確認とは別に、報告書全体を担当者が確認します。","Lehrkraft: Noch nicht; Gesamtbericht braucht separate Freigabe."],
["ケン","まずリンクをメンバーだけに直して、金曜日に先生に見てもらおう。","Ken: Link einschränken und Freitag Lehrkraft zeigen."]],
[
["status","報告書を外部公開してもよいですか。","いいえ、担当者の確認がまだです。","いいえ、リンクの設定と許可の確認が必要です。","はい、文章を直したので公開できます。","Textkorrektur ersetzt keine Einwilligung oder Freigabe.","公開する場合は別に担当者の確認","報告書全体を担当者が確認します"],
["evidence","使えないのはどの写真ですか。","許可をもらっていない人の写真です。","人の許可がない一枚です。","四枚全部が必ず使えます。","Foto-bezogene Einschränkung.","一枚には許可をもらっていない人","許可のない写真は使わず"],
["chronology","先にチームで何をする必要がありますか。","リンクをメンバーだけに直します。","共有設定を確認します。","公開リンクを全員に送ります。","Zugriff vor weiterer Prüfung.","外部へのリンク公開はしない","まずリンクをメンバーだけに直して"]
],
["Teampriorität setzen.","まずリンクをチームだけに制限し、許可のない写真を外します。それから担当者の確認を待ちます。","非公開のまま内容を見直します。","文章が直ったので写真も全部公開します。","Mindestens drei gates."],
["Schreibe höflichen Zwischenstand an die betreuende Lehrkraft in 3 Sätzen.","報告書の文章を修正しましたが、公開はまだしていません。許可のない写真は使わず、共有リンクもチームだけに直します。金曜日に全体をご確認いただけますか。","内容と共有設定を確認してから、先生に見ていただきます。","すべて公開済みですので、確認は不要です。","Autorität respektieren."],
["先生","担当者が報告書を確認しました。文章は公開できますが、写真は来週まで待ってください。","Lehrkraft: Gesamttext freigegeben, Fotos erst nächste Woche.","Unterscheide Freigabe einzelner Medien.","ありがとうございます。文章だけ先に公開し、写真は許可が確認できるまで待ちます。","承知しました。写真はまだ使わず、文章のみ公開します。","写真も全部自由に公開します。","Medienbezogene Freigabe."],
["文章が許可されたので、写真四枚もすべて公開できます。","Korrigiere ungültigen Freigabeumfang.","文章だけが公開可能です。写真はまだ確認中なので使いません。","許可が出たのは文章で、写真は来週まで待ちます。","Sichtbares personenbezogenes Medium bleibt gesperrt."],
["Neue Vereinsseite: Texte veröffentlicht erlaubt, Gruppenbild ohne Einwilligung, Link noch öffentlich.","文章は公開できますが、集合写真は許可がないので使いません。共有リンクも確認します。","写真を公開する前に全員の許可を確認します。","文章が大丈夫なので写真も公開します。","Anderer Auftrag und medium."],
"文章の許可 ≠ 写真の許可; チーム内共有 ≠ 公開.",["kyoka","kyouyuu","koukai"]],
["book-fair-budget","古本市の値段と配達","p25:shopping","学校の本市","polite",
"Kleiner Büchermarkt aktualisiert Preis, Lieferdatum und erwartete Bestellmenge getrennt.",
"Preis ohne doppelten Rabatt und Versand erst nach Bestätigung formulieren",
[
["古本市のお知らせ","本を三冊買うと、合計で千二百円です。袋は必要な方だけ一枚五十円です。","Buchmarkt: Drei Bücher zusammen 1200 Yen; optionale Tüte 50 Yen."],
["店の訂正","昨日お知らせした『さらに二百円引き』は、すでに千二百円の値段に含まれています。二重に引かないでください。","Korrektur: Ursprünglich angekündigter weiterer Rabatt 200 Yen ist schon in 1200 enthalten; nicht doppelt abziehen."],
["配達について","注文が多い場合、配達は月曜日ではなく水曜日になる可能性があります。確定したらメールでお知らせします。","Versand: Bei vielen Bestellungen statt Montag möglicherweise Mittwoch; endgültiger Termin per Mail."]],
[
["学生","三冊お願いしたいです。袋は自分で持って行くので必要ありません。","Studentin: Drei Bücher, keine Tüte, bringt eigene Tasche."],
["店員","注文のフォームを受け取りました。配達の日はまだ確定していません。","Personal schriftlich: Formular erhalten, Lieferung noch offen."]],
[
["店員","料金は千二百円です。追加の割引はありません。","Personal: Zahlbetrag 1200 Yen, kein zusätzlicher Rabatt."],
["学生","では、袋を買わなければ千二百円だけですね。","Studentin: Ohne Tüte genau 1200?" ],
["店員","そうです。ただし、お届け日は今確認しているところです。","Personal: Ja; Liefertag noch in Prüfung."],
["学生","ありがとうございます。配達の日が決まったら知らせてください。","Studentin: Danke, bitte Datum nach Festlegung mitteilen."]],
[
["status","三冊の本の料金はいくらですか。","千二百円です。","袋なしで千二百円です。","千円です。","Discount bereits eingepreist.","すでに千二百円の値段に含まれています","追加の割引はありません"],
["evidence","配達は月曜日に確定していますか。","いいえ、まだ確認中です。","いいえ、水曜日になる可能性があります。","はい、月曜日に届きました。","Geplantes Lieferdatum nicht Vollzug.","水曜日になる可能性があります","お届け日は今確認しているところです"],
["inference","袋を買わない人が五十円を払いますか。","いいえ、袋を買わなければ必要ありません。","いいえ、千二百円だけです。","はい、全員必要です。","Gebühr optional.","袋は必要な方だけ","袋を買わなければ千二百円だけですね"]
],
["Bezahlen und Lieferung ohne Übertreibung planen.","三冊で千二百円を払い、配達日はメールで確認します。袋は買いません。","追加の割引はないので、千二百円です。","さらに二百円引いて千円にします。","Preis und Datum auseinanderhalten."],
["Verfasse sachliche 2–3 Sätze für Gruppenbestellung und noch offene Lieferung.","本三冊の代金は千二百円です。割引はもう含まれていて、袋は注文しません。配達日はまだ決まっていないので、連絡を待ちます。","料金を確認しました。配達の日がわかったらグループに知らせます。","月曜日に必ず届くので、千円だけ払います。","Preis, optionale Tüte und ungewisses Datum."],
["店員","新しい配達日は木曜日になりました。注文した本はまだ発送していません。","Shop: Neue Lieferung Donnerstag, Bücher noch nicht versandt.","Berichte korrigierten Lieferplan ehrlich.","木曜日の配達予定を確認しました。まだ発送前なのですね。ご連絡ありがとうございます。","承知しました。木曜日の到着を待ちます。","月曜日にもう受け取りました。","Neueste Quelle und Versandstatus."],
["割引でもう千円になり、月曜日に配達済みです。","Korrigiere doppelten Rabatt und fiktiven Empfang.","料金は千二百円です。木曜日の配達予定ですが、まだ発送されていません。","追加の値引きはなく、配達は木曜日の予定です。","Doppelt falsche Quantität/Zeit."],
["Neue Kleinanzeige: Zwei Bücher 900 Yen rabattiert, Tüte 30 Yen optional, Zustellung Freitag nur vorgesehen.","本二冊は九百円で、割引は含まれています。袋は必要なら三十円で、配達は金曜日の予定です。","まだ届いていません。予定を確認します。","値引きして七百円になり、もう届きました。","Andere Zahlen und Lieferung."],
"割引済みの価格 ≠ もう一度割引; 配達予定 ≠ 受取済み.",["waribiki","haitatsu","kakunin"]],
["visitor-entrance","見学者が迷わない道","p25:directions","大学見学","polite",
"Universitätsbesuch benötigt aktualisierte Richtung, barrierearme Alternative und Treffpunktprüfung.",
"Richtung, Zugang und bestätigte Ankunft unterscheidbar kommunizieren",
[
["大学の案内","見学は水曜日の午後一時に正門から始まります。遅れないように来てください。","Uni-Hinweis alt: Mittwoch 13 Uhr Treffpunkt Haupttor."],
["工事のお知らせ","正門は今週、工事のため使えません。南門から入ってください。階段が難しい方は事務室へ連絡してください。","Bauinfo: Haupttor diese Woche gesperrt; Südeingang, bei Treppenproblemen Büro kontaktieren."],
["交通案内","南門からの道は少し遠くなります。駅からは歩いて十五分ほどかかるので、時間に余裕を持ってください。","Weginfo: Südeingang etwas weiter, etwa 15 Minuten Fußweg ab Bahnhof; Zeitpuffer einplanen."]],
[
["交換学生","初めて行くので、道が心配です。正門で待っていればいいでしょうか。","Austauschstudent: Erster Besuch, unsicher; sollte ich am Haupttor warten?"],
["案内学生","工事で正門は閉まっているよ。南門までの道を一緒に確認しよう。","Guide: Haupttor wegen Bauarbeiten geschlossen; Route zum Südeingang prüfen."]],
[
["受付","見学の開始時間は一時のままです。集合場所だけ南門に変わりました。","Empfang: Beginn bleibt 13 Uhr, nur Treffpunkt Südeingang."],
["交換学生","駅に十二時五十分に着く電車でも間に合いますか。","Gast: Reicht Zugankunft Bahnhof 12:50?"],
["受付","歩くと十五分ほどかかります。遅れそうなら事前に連絡してください。","Empfang: Etwa 15 Minuten Fußweg; Verspätung vorab melden."],
["案内学生","もう少し早い電車を調べておこう。急いで危ない道を通らないようにね。","Guide: Früheren Zug prüfen; nicht gefährliche Abkürzungen nehmen."]],
[
["chronology","集合場所はどこに変更されましたか。","南門です。","正門から南門に変わりました。","正門のままです。","Letztgültige Änderung.","南門から入ってください","集合場所だけ南門に変わりました"],
["inference","十二時五十分に駅に着くなら、一時の開始に確実に間に合いますか。","いいえ、歩くと十五分ほどかかります。","いいえ、開始に遅れる可能性があります。","はい、十分あるので必ず間に合います。","12:50+15 Minuten liegt nach 13:00.","駅からは歩いて十五分ほど","歩くと十五分ほどかかります"],
["evidence","階段の利用が難しい場合はどうしますか。","事務室に連絡します。","大学の事務室に相談します。","工事中の正門から入ります。","Hinweis auf individuelle Zugangsberatung.","階段が難しい方は事務室へ","遅れそうなら事前に連絡してください"]
],
["Guest safely orientieren.","南門で一時に集合するので、早い電車を調べて余裕を持って行きます。","南門への道を確認してから向かいます。","正門に十二時五十分に行けば大丈夫です。","Zeitpuffer und Zugang."],
["Schreibe kurze höfliche Nachricht an neuen Teilnehmer.","今週は正門が工事中なので、南門に集合します。見学は一時からで、駅から十五分ほど歩きます。時間に余裕を持って来てください。","南門への道を確認し、遅れそうなら連絡してください。","正門で一時に会いましょう。","Mehrere praktische Informationen."],
["受付","南門の階段も工事中ですが、横のスロープは使えます。","Empfang: Treppe am Südeingang gesperrt, seitliche Rampe offen.","Aktualisiere barrierearme Route ohne falsche Sperrung.","ご案内ありがとうございます。南門の横のスロープから入れるのですね。皆さんに知らせます。","階段ではなくスロープを使うように伝えます。","南門も全部閉まりました。","Teilbereich gesperrt, alternative Route offen."],
["正門だけでなく南門も全部閉鎖され、入れません。","Korrigiere ungestützte Gesamtsperrung.","正門は閉まっていますが、南門のスロープは使えます。集合時間は一時です。","南門へ行き、スロープから入ります。","Genauen Zugang nennen."],
["Neue Museumstour: 10 Uhr, Nordtor geschlossen, Osttor 20 Minuten Fußweg, Seitentür stufenfrei.","十時までに東口へ向かいます。駅から二十分かかるので早く出ます。段差が難しい人は横の入口を使えます。","安全な入口を確認してから案内します。","北口から九時五十分に行けば十分です。","Andere Route und Zeitrechnung."],
"変更された集合場所＋所要時間＋安全な入口を別々に確認.",["anai","henkou","kakunin"]]
];
export const p59MissionsB=raw.map(authoredP59Compact);
