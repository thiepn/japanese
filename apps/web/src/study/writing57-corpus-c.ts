import {authoredP57,type P57RawThread} from "./writing57-types";
const authored:readonly P57RawThread[]=[
{id:"trip-rail-refund",title:"電車の中止と切符の相談",genre:"email",unit:"p25:transport",setting:"Bahnkundenservice berichtet Ausfall und ungesicherten Ersatz.",goal:"Stornierung, Erstattungsanfrage, Alternative und Kaufstatus trennen",register:"service",contrast:"Geplanter Zug abgesagt, Ersatz nicht automatisch gebucht.",words:["chuushi","yoyaku","kakunin"],messages:[
["会社","土曜日の九時発の電車は工事のため中止となりました。別の便への変更をご希望の場合はお問い合わせください。","Bahn: Samstagszug 9 Uhr fällt aus, Umbuchung auf Anfrage."],
["客","ご連絡ありがとうございます。十時発の便に変更できますか。追加料金はありますか。","Kunde: Ist Wechsel auf 10 Uhr möglich und fallen Gebühren an?"],
["会社","十時の便には空席がありますが、変更手続きはまだ完了していません。料金を確認して折り返します。","Bahn: 10-Uhr-Plätze verfügbar; Umbuchung und Gebührenprüfung noch offen."],
["客","承知しました。切符はまだ変更されていないのですね。ご連絡をお待ちしています。","Kunde: Ticket noch nicht umgebucht, wartet."]
],questions:[
["status","十時の便に変更できましたか。","いいえ、まだ手続き中です。","いいえ、変更は完了していません。","はい、空席があるので決まりました。","Verfügbarkeit ist keine Buchung.","変更手続きはまだ完了していません"],
["reason","九時の電車はなぜ中止ですか。","工事のためです。","工事があるからです。","雨のためです。","Expliziter Grund.","工事のため中止"]
],compose:["Neuer Bus: 11-Uhr-Verbindung fällt aus; frage nach 12-Uhr-Ersatz und möglicher Zusatzgebühr.","十一時のバスが中止になりました。十二時の便に変更できますか。追加料金も教えてください。","十二時のバスに変更できるか確認していただけますか。","すでに十二時の便を予約しました。","Anfrage ohne Behauptung."],
reply:["十二時の便は満席ですが、一時なら空きがあります。","12 Uhr voll, 13 Uhr verfügbar.","Antworte mit Bitte um 13 Uhr und bestätige noch nicht den Abschluss.","ご案内ありがとうございます。一時の便に変更できますか。手続きをお願いします。","それでは一時に変更したいです。","十二時の席が確定しました。","Verfügbare Alternative erfragen."],
revision:["十二時のバスに予約を変更しました。","Korrigiere die nicht erfüllte 12-Uhr-Umbuchung.","十二時は満席のため、一時への変更をお願いしています。まだ確定していません。","一時の便が利用できるか確認をお願いしました。","Keine fiktive Reservierung."],
returnCue:["Andere Bahn: Fährfahrt Montag 14 Uhr abgesagt, Dienstag 15 Uhr nur Anfrage.","月曜日の船が中止になったので、火曜日の三時に変更できるか確認をお願いします。","火曜日の便を希望していますが、まだ予約は決まっていません。","火曜日の便は必ず予約済みです。","Neuer Verkehrstyp und Zeit."]
},
{id:"apartment-leak",title:"水道の修理について",genre:"email",unit:"p26:weekend-switch",setting:"Mieter meldet tropfenden Wasserhahn und Hausverwaltung antwortet.",goal:"Bericht, geplanten Besuch, tatsächliche Reparatur sauber unterscheiden",register:"polite",contrast:"Technikerbesuch morgen nur geplant; Reparatur nicht abgeschlossen.",words:["shuuri","koshou","renraku"],messages:[
["住人","お世話になっております。台所の水道から水が少し漏れています。昨日から続いていますので、確認をお願いします。","Mieter: Wasserhahn in der Küche tropft seit gestern. Bitte prüfen."],
["管理人","ご連絡ありがとうございます。明日の午前中に修理の担当者が伺う予定です。ご都合はいかがでしょうか。","Verwaltung: Techniker soll morgen Vormittag kommen. Passt das?"],
["住人","午前中は家にいます。担当者が来る前に連絡していただけると助かります。","Mieter: Ich bin daheim; bitte vorher ankündigen."],
["管理人","承知しました。訪問前にご連絡します。ただし、修理が当日終わるかはまだわかりません。","Verwaltung: Meldung vor Besuch; ob Reparatur am selben Tag fertig wird, bleibt unklar."]
],questions:[
["status","修理はもう終わっていますか。","いいえ、まだ終わっていません。","いいえ、担当者が来る予定です。","はい、明日必ず終わります。","Besuch und Reparaturabschluss sind zwei Sachverhalte.","修理が当日終わるかはまだわかりません"],
["evidence","担当者はいつ来る予定ですか。","明日の午前中です。","明日の朝から昼までです。","今日の夕方です。","Verwaltung nennt Zeitfenster.","明日の午前中に"]
],compose:["Im Bad tropft seit zwei Tagen Wasser, schreibe freundliche Reparaturanfrage.","二日前からお風呂の水道から水が漏れています。確認して修理していただけますか。","浴室の水道に問題があります。ご対応をお願いいたします。","修理はもう終わりました。","Grund und Bitte, nicht Erfolg melden."],
reply:["明日の午後に担当者が訪問する予定です。時間が決まったら連絡します。","Techniker möglicherweise morgen Nachmittag, Uhrzeit noch offen.","Bestätige Erreichbarkeit, keine fixe Uhrzeit erfinden.","ありがとうございます。明日の午後は家にいます。時間が決まったら教えてください。","承知しました。ご連絡をお待ちしています。","明日の午後二時に修理が終わります。","Zeit und Abschluss bleiben offen."],
revision:["明日の二時に修理が終わると決まりました。","Überarbeite unbekannte Zeit und Abschlussstatus.","明日の午後に担当者が来る予定ですが、正確な時間と修理の終了はまだ未定です。","訪問の時間が決まったら連絡をいただきます。","Unbelegte Präzision vermeiden."],
returnCue:["Neuer Hausfall: Heizung funktioniert nicht, Techniker soll Freitag kommen, Zeitpunkt noch offen.","暖房が使えません。修理の人は金曜日に来る予定ですが、時間はまだ決まっていません。","金曜日の訪問予定を確認し、時間の連絡を待っています。","金曜日の朝九時に修理済みです。","Neue Anlage und Terminstatus."]
},
{id:"team-meeting",title:"会議の資料と場所",genre:"work",unit:"p26:library-project",setting:"Arbeitsgruppe stimmt Raum, Frist und Unterlagen in mehreren Nachrichten ab.",goal:"Kumulierte Änderungen ohne Verlust älterer weiterhin gültiger Bedingungen schreiben",register:"polite",contrast:"Zeit 15 Uhr bleibt, Raum wechselt, Materialfrist bis 12 Uhr unverändert.",words:["henkou","shimekiri","kyouyuu"],messages:[
["部長","金曜日の会議は午後三時からです。資料は同日の正午までに共有してください。","Leitung: Freitag Sitzung 15 Uhr, Materialien bis 12 Uhr teilen."],
["社員Ａ","ありがとうございます。会議室Ａを使えばよろしいでしょうか。","A: Treffen wir uns in Raum A?"],
["部長","会議室Ａは使えなくなりました。会議はＢ室で行います。時間と資料の締め切りは変わりません。","Leitung: Raum A fällt aus, Raum B. Zeit und Materialfrist unverändert."],
["社員Ｂ","承知しました。正午までに資料を共有し、三時にＢ室へ行きます。","B: Unterlagen bis 12 Uhr teilen, 15 Uhr Raum B."]
],questions:[
["status","会議の時間は変更されましたか。","いいえ、三時のままです。","いいえ、午後三時です。","はい、正午になりました。","Mittags ist Materialfrist.","時間と資料の締め切りは変わりません"],
["evidence","資料はいつまでに共有しますか。","金曜日の正午までです。","金曜日の十二時までです。","午後三時までです。","Unveränderte separate Frist.","同日の正午までに共有してください"]
],compose:["Neue Konferenz: Dienstag 14 Uhr, Raum C statt A, Präsentation bis 11 Uhr senden.","火曜日の会議は午後二時にＣ室で行います。発表資料は午前十一時までに共有してください。","場所はＡ室からＣ室に変更されました。時間と提出期限は同じです。","会議は十一時からＡ室です。","Mehrere Dimensionen getrennt führen."],
reply:["会議室Ｃも使えなくなりました。Ｄ室を予約しました。","C ebenfalls nicht verfügbar; Raum D gebucht.","Verfasse präzise Korrektur, andere Uhrzeiten erhalten.","ご連絡ありがとうございます。会議は二時にＤ室ですね。資料は十一時までに共有します。","承知しました。場所はＤ室に変更し、時間はそのままです。","会議は十一時にＣ室です。","Nur Ort ändert sich erneut."],
revision:["会議は十一時にＣ室で、資料は二時までです。","Korrigiere vertauschte Fristen und alten Raum.","会議は火曜日の午後二時にＤ室です。資料は午前十一時までに共有します。","新しい会場はＤ室です。会議時間と資料の期限は変わりません。","Drei Sachangaben konsistent."],
returnCue:["Neues Seminar: Donnerstag 10 Uhr, Hörsaal gewechselt 1 auf 2, Abgabe bleibt Mittwoch 16 Uhr.","授業は木曜日の十時から二番の教室です。提出期限は水曜日の四時のままです。","場所だけ変更で、時間と期限は同じです。","教室一で水曜日十時です。","Andere Veranstaltung, unveränderte Mehrfachbedingungen."]
},
{id:"informal-boundary",title:"無理をせず断る",genre:"chat",unit:"p23:plans",setting:"Freundeskreis lädt trotz Erschöpfung zu Abendaktivität ein.",goal:"Höflich nein sagen, ohne ungefragte künftige Zusage",register:"casual",contrast:"Nächste Woche bleibt unklar, aktueller Samstag wird abgesagt.",words:["sasou","tsugou","kyuukei"],messages:[
["ナオ","今週の土曜日、夜にみんなで映画を見るけど、一緒に来ない？","Nao: Kommst du diesen Samstag zum Kino?"],
["サキ","誘ってくれてありがとう。でも今週は仕事が忙しいから、土曜日は家で休みたいんだ。","Saki: Danke, aber diese Woche viel Arbeit, ich möchte Samstag ausruhen."],
["ナオ","わかった。じゃあ、来週の土曜日ならどうかな。","Nao: Okay, wie wäre nächsten Samstag?"],
["サキ","来週はまだ予定が決まっていないから、確認してから返事してもいい？","Saki: Nächsten Samstag steht noch nicht fest; darf ich nach Prüfung antworten?"]
],questions:[
["status","来週の映画は決まりましたか。","いいえ、まだ決まっていません。","いいえ、返事を待っています。","はい、来週必ず行きます。","Späteres Antworten ist keine Zusage.","確認してから返事してもいい？"],
["reason","サキさんが今週行けない理由は何ですか。","仕事が忙しく、休みたいからです。","土曜日に家で休む予定だからです。","映画が嫌いだからです。","Sie nennt Erholung, nicht Abneigung.","土曜日は家で休みたいんだ"]
],compose:["Du möchtest Samstag nicht zum Sport, fragst nach späterem Kontakt ohne Versprechen.","誘ってくれてありがとう。でも土曜日は休みたいから行けないよ。また予定がわかったら連絡するね。","今回は難しいけど、また誘ってね。","来週は必ず行くよ。","Kein erfundener Folgetermin."],
reply:["日曜日の午前中に少しだけ散歩するのはどう？","Alternativ Sonntagvormittag kurzer Spaziergang?","Du hast auch Sonntag keine sichere Zeit; antworte respektvoll.","ありがとう。でも日曜日も予定がまだわからないんだ。確認してから返事するね。","誘ってくれてうれしいけど、まだ約束できない。","日曜日には必ず行けるよ。","Ungewissheit nicht wegreden."],
revision:["日曜日も来週も必ず参加します。","Richte Zusagen am tatsächlichen Status aus.","今週は休みたいので行けません。来週の予定もまだ未定なので、決まったら連絡します。","ありがとう。まだ次の予定はわからないから、後で返事するね。","Mehrere nicht zugesagte Termine."],
returnCue:["Neue soziale Anfrage: Kollegin lädt Montag zum Essen, du kannst nicht und Freitag ist offen.","月曜日は行けません。金曜日の予定はまだわからないので、確認してから連絡します。","誘ってくれてありがとう。月曜日は難しいけど、また連絡します。","金曜日は必ず行けます。","Andere Beziehung und Tage."]
},
{id:"city-service-form",title:"申し込みは届きましたか",genre:"email",unit:"p25:appointment",setting:"Bürgeramt bearbeitet Formular nach Versand.",goal:"Entwurf, eingegangenen Antrag und noch ausstehende Entscheidung trennen",register:"service",contrast:"Eingangsbestätigung bedeutet nicht genehmigte Anfrage.",words:["moushikomi","uketsuke","kakunin"],messages:[
["利用者","昨日、登録フォームを送信しました。受付が完了したか確認していただけますか。","Antragsteller: Ich habe gestern das Formular abgeschickt. Ist es angekommen?"],
["窓口","フォームは受信しました。ただし、申請内容の確認はまだ終わっていません。","Behörde: Formular empfangen, Inhalt noch nicht geprüft."],
["利用者","承知しました。申請が認められたわけではないのですね。結果はいつわかりますか。","Antragsteller: Also nicht bewilligt. Wann kommt das Ergebnis?"],
["窓口","来週中にメールでお知らせする予定です。追加の資料が必要な場合は、ご連絡します。","Behörde: Ergebnis voraussichtlich nächste Woche; eventuell werden Unterlagen nachgefordert."]
],questions:[
["status","申請はすでに認められましたか。","いいえ、まだ確認中です。","いいえ、結果はまだ出ていません。","はい、受信したので認められました。","Eingang ist nicht Genehmigung.","確認はまだ終わっていません"],
["chronology","結果はいつ伝えられる予定ですか。","来週中です。","来週メールで知らせる予定です。","昨日です。","Zukunftsplanung, nicht bestätigte Uhrzeit.","来週中にメールでお知らせ"]
],compose:["Neues Formular: Hochschulantrag gesendet, Eingangsbestätigung erhalten, Ergebnis offen. Frage nach Bearbeitung.","申請フォームは送信し、受信の連絡も受け取りました。結果はまだなので、今後の手続きを教えてください。","申し込みは受け付けられましたが、結果はいつわかりますか。","申請はもう認められました。","Status differenzieren."],
reply:["今週は審査中です。追加の書類が必要になったら来週ご連絡します。","Diese Woche Prüfung, eventuell nächste Woche Unterlagenanfrage.","Antworte mit Bereitschaft zur Unterlagenergänzung.","ご連絡ありがとうございます。追加の書類が必要になりましたら、提出します。結果をお待ちしています。","承知しました。来週のご連絡をお待ちします。","審査はすべて終わりました。","Konditionale Nachforderung, nicht bereits erteilt."],
revision:["申請が認められ、追加書類もすべて提出しました。","Korrigiere unbelegte Abschlussmeldung.","申請は現在審査中です。必要になれば追加の書類を提出します。","結果はまだ出ていません。連絡を待っています。","Keine fiktive Zusage oder Nachreichung."],
returnCue:["Anderer Vorgang: Workshopantrag bestätigt eingegangen, Platzentscheidung erst Dienstag.","申し込みは受け付けられましたが、席が取れたかはまだわかりません。火曜日の連絡を待ちます。","参加の確認はまだです。火曜日にわかる予定です。","参加は必ず確定しました。","Anderer Prozess und Termin."]
},
{id:"food-group-budget",title:"注文する前に人数を確認",genre:"chat",unit:"p23:cafe",setting:"Team organisiert gemeinsames Essen und sammelt Präferenzen.",goal:"Mengenplanung und Unverträglichkeiten erst nach Rückmeldung festlegen",register:"casual",contrast:"Sechs eingeladen, Essensbestellung noch nicht erfolgt.",words:["chuumon","kakunin","zairyou"],messages:[
["ユリ","土曜日の集まり、六人に連絡したよ。昼ご飯を六人分注文していいかな。","Yuri: Sechs eingeladen. Soll ich für sechs Essen bestellen?"],
["ケン","まだ待って。三人しか返事をしていないし、一人は肉を食べないそうだよ。","Ken: Noch warten. Nur drei Antworten, eine Person isst kein Fleisch."],
["ユリ","わかった。全員の返事を確認して、料理の種類も聞いておくね。","Yuri: Ich prüfe die Rückmeldungen und Speisewünsche."],
["ケン","ありがとう。金曜日の昼までに人数を決めてから注文しよう。","Ken: Danke. Erst Freitagmittag nach endgültiger Zahl bestellen."]
],questions:[
["status","もう食事を注文しましたか。","いいえ、まだ注文していません。","いいえ、人数を確認してからです。","はい、六人分です。","Einladung ≠ Anzahl Essender.","人数を決めてから注文しよう"],
["reason","料理の種類も確認するのはなぜですか。","肉を食べない人がいるからです。","食事の希望が違うからです。","全員が肉を食べるからです。","Präferenz und Bedarf ausdrücklich.","一人は肉を食べないそうだよ"]
],compose:["Neues Büroessen: Acht eingeladen, vier Antworten, eine Person vegetarisch. Frage nach Rest.","八人に声をかけましたが、返事は四人だけです。肉を食べない方もいるので、全員に確認してから注文します。","参加人数と食事の希望を確認したいです。まだ注文していません。","八人分の肉料理を注文しました。","Zahl und Essenswahl noch offen."],
reply:["あと二人は来られないそうです。残り二人にはまだ聞いていません。","Zwei weitere haben abgesagt, zwei bleiben ohne Antwort.","Schreibe Update mit offener Zahl statt endgültiger Bestellung.","わかりました。二人は欠席ですね。まだ返事がない方に確認してから注文します。","ありがとうございます。残りの人の希望も聞きます。","もう八人分注文して大丈夫です。","Mehrschrittstatus nicht zu voller Teilnahme aufblasen."],
revision:["八人とも肉料理を食べるので、注文しました。","Korrigiere unbestätigte Teilnehmer- und Speiseangaben.","まだ全員の返事がありません。食事の希望も確認してから注文します。","二人は欠席するそうなので、残りの人数を確認します。","Keine falschen Kosten oder Bedürfnisse behaupten."],
returnCue:["Neues Picknick: Zehn eingeladen, sechs Antworten, zwei bringen eigenes Essen; noch nicht bestellen.","十人を招待しましたが、返事は六人です。二人は自分で食べ物を持ってくるので、注文はまだ待ちます。","参加人数と注文する量を確認してから決めます。","十人分を必ず注文しました。","Neue Mengen und Organisation."]
},
{id:"work-hours",title:"勤務時間を確認するメール",genre:"work",unit:"p25:appointment",setting:"Teilzeitkraft und Leitung klären allgemeine Arbeitszeit und Ausnahme.",goal:"Regel, Ausnahme und Rückmeldefrist getrennt halten",register:"polite",contrast:"Grundsätzlich 8:30, dienstags 9:00 genehmigt, am Vortag informieren.",words:["henkou","tsugou","yotei"],messages:[
["店長","来週から勤務開始は八時半です。都合が悪い日があれば、前日までに連絡してください。","Leitung: Ab nächster Woche Beginn 8:30; Ausnahmen bis zum Vortag melden."],
["社員","火曜日は授業があるため、九時からでもよろしいでしょうか。ほかの日は八時半に行けます。","Mitarbeiter: Dienstag wegen Unterricht erst 9 Uhr, andere Tage 8:30 möglich."],
["店長","火曜日だけ九時からで大丈夫です。ただし、月曜日にもう一度連絡してください。","Leitung: Dienstag 9 Uhr genehmigt; Montag nochmals melden."],
["社員","承知しました。火曜日だけ九時からにしていただき、ありがとうございます。月曜日にご連絡します。","Mitarbeiter: Danke für Ausnahme dienstags, melde mich Montag."]
],questions:[
["status","九時から出勤できるのはいつですか。","火曜日だけです。","火曜日だけ九時からです。","毎日九時からです。","Genehmigung hat engen Geltungsbereich.","火曜日だけ九時からで大丈夫です"],
["chronology","火曜日の前にいつ連絡しますか。","月曜日です。","月曜日にもう一度連絡します。","火曜日の夜です。","Konkrete Zusatzfrist.","月曜日にもう一度連絡してください"]
],compose:["Neue Schicht: Normalbeginn 7:30, Ausnahme Donnerstag 8:00 beantragen.","通常は七時半からですが、木曜日だけ八時から勤務できますか。ご確認をお願いします。","木曜日に授業があるため、八時開始に変更をお願いしたいです。","毎日八時に変更しました。","Nur Anfrage für einen Tag."],
reply:["木曜日は八時で大丈夫です。水曜日の午前中に確認の連絡をしてください。","Ausnahme Donnerstag 8 Uhr genehmigt; Mittwoch vormittag melden.","Bestätige Ausnahme und zusätzliche Frist.","ご返信ありがとうございます。木曜日は八時から伺います。水曜日の午前中に連絡します。","承知しました。水曜日に確認の連絡をします。","毎日八時からにします。","Ausnahme und Rückmeldebedingung korrekt."],
revision:["毎日八時に変更されたので、木曜日も確認は不要です。","Korrigiere pauschale Ausnahme und ignorierte Meldung.","木曜日だけ八時からです。水曜日の午前中に確認の連絡をします。","ほかの日は七時半のままで、木曜日だけ八時に伺います。","Unveränderte Normalregel."],
returnCue:["Neuer Verein: Training grundsätzlich 17 Uhr, nur freitags 18 Uhr erlaubt, Donnerstag melden.","金曜日だけ六時からで、ほかの日は五時のままです。木曜日に連絡します。","金曜日の例外を確認して、前日に知らせます。","毎日六時に変更です。","Neue Organisation und Regel."]
}
];
export const p57ThreadsC=authored.map(authoredP57);
