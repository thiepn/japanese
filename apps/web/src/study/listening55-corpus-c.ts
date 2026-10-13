import {authoredP55,type P55RawScene} from "./listening55-types";
/** 15–21: interruptions, reported speech, contingencies, shifting commitments. */
const authored:readonly P55RawScene[]=[
{id:"festival-weather",title:"雨なら会場を変えます",genre:"meeting",unit:"p23:plans",setting:"Organisatorin berät mit zwei Freiwilligen über einen Festplatz.",listeningGoal:"Prognose, Bedingung, Entscheidung und Informationszeit unterscheiden",prediction:"Ist die Veranstaltung verschoben, abgesagt oder nur bedingt verlegt?",
 turns:[
 ["ナオ","日曜日の文化祭は公園で行う予定です。","Nao: Das Kulturfest ist Sonntag im Park geplant."],
 ["ケン","天気予報では強い雨が降るかもしれないそうですよ。","Ken: Die Prognose sagt, es könnte stark regnen."],
 ["ユキ","雨が強ければ、市民センターに場所を変更しましょう。","Yuki: Bei starkem Regen wechseln wir ins Bürgerzentrum."],
 ["ナオ","小さい雨なら公園のままでいいですか。","Nao: Und bei leichtem Regen bleibt es im Park?"],
 ["ユキ","はい。ただし、センターの使用許可をまだ確認していません。","Yuki: Ja. Aber wir haben die Genehmigung fürs Zentrum noch nicht geprüft."],
 ["ケン","いつ参加者に知らせますか。","Ken: Wann informieren wir die Teilnehmer?"],
 ["ナオ","土曜日の六時に最終予定を公開します。それまでは中止だと言わないでください。","Nao: Samstag um sechs veröffentlichen wir den endgültigen Plan. Vorher bitte keine Absage behaupten."]
 ],words:["yotei","kyoka","henkou","koukai","chuushi"],contrast:"Alternative Halle braucht noch Erlaubnis; Wetterprognose ist keine Absage.",
 questions:[
 ["inference","文化祭はもう中止になりましたか。","いいえ、中止は決まっていません。","いいえ、場所を変更する可能性があります。","はい、日曜日は中止です。","Gespräch betrifft bedingte Ortswahl, nicht Absage.","それまでは中止だと言わないでください"],
 ["speaker","市民センターの許可がまだ確認できていないと言ったのは誰ですか。","ユキさんです。","ユキさんが言いました。","ケンさんです。","Yuki nennt die Voraussetzung selbst.","使用許可をまだ確認していません"]
 ],
 response:["Eine Schulfete bleibt geplant; bei Starkwind neuer Raum möglich, Erlaubnis noch unklar. Informiere vorsichtig.","強い風なら場所を変更するかもしれませんが、まだ許可を確認していません。","中止ではありません。新しい場所は確認中です。","もう新しい部屋で決まりました。","Konditional und fehlende Genehmigung markieren."],
 delayed:["Neuer Fall: Markt im Hof; bei Schnee möglicherweise Sporthalle, endgültiger Stand Freitag.","雪なら体育館に変更するかもしれません。金曜日に最終予定を知らせます。","雪の場合は場所を変更する予定ですが、まだ確定していません。","市場は必ず中止です。","Andere Wetterlage und andere Zeit."]
},
{id:"speaker-repair",title:"聞き間違えた集合時間",genre:"dialogue",unit:"p25:appointment",setting:"In einer lauten Aula hören Schüler einen Termin falsch.",listeningGoal:"Akustische Rückfrage, Selbstkorrektur und genaue Zeit beachten",prediction:"Welche Zeit war falsch gehört, welche wird wiederholt?",
 turns:[
 ["先生","みなさん、明日の集合は八時十五分です。","Lehrerin: Morgen treffen wir uns um 8:15."],
 ["ソラ","ごめん、今、八時五十分って聞こえたんだけど。","Sora: Entschuldigung, ich habe 8:50 verstanden."],
 ["先生","いいえ、八時十五分です。じゅうごふん、ですよ。","Lehrerin: Nein, 8:15. Fünfzehn Minuten."],
 ["ミナ","場所はいつもの入口ですか。","Mina: Ist es am gewohnten Eingang?"],
 ["先生","工事中なので、南の入口に変更します。","Lehrerin: Wegen Bauarbeiten wechseln wir zum Südeingang."],
 ["ソラ","八時十五分、南の入口ですね。メモしておきます。","Sora: 8:15, Südeingang. Ich notiere es."],
 ["先生","そうです。遅刻しないように、少し早めに来てください。","Lehrerin: Genau. Kommt etwas früher, damit ihr nicht zu spät seid."]
 ],words:["shugo","henkou","chikoku","hayame","kakunin"],contrast:"十五分 vs 五十分, beide realistisch und klanglich ähnlich; nur 8:15 gilt.",
 questions:[
 ["evidence","正しい集合時間は何時ですか。","八時十五分です。","午前八時十五分です。","八時五十分です。","Lehrerin korrigiert das vertauschte Zahlenpaar.","八時十五分です。じゅうごふん"],
 ["cause","集合場所が変わったのはなぜですか。","工事中だからです。","入口の工事があるからです。","遅刻した人がいたからです。","Baustelle verursacht Ortsänderung.","工事中なので、南の入口に変更します"]
 ],
 response:["Du hast 14:50 statt 14:15 gehört. Bitte um Bestätigung und wiederhole die richtige Zeit.","二時五十分ではなく、二時十五分ですね。確認してもいいですか。","二時十五分ですか。もう一度お願いします。","二時五十分で決まりました。","Korrektur darf Zahl nicht vertauschen."],
 delayed:["Neue Situation: Ein Zug fährt 10:40, Freund hörte 10:14. Korrigiere freundlich.","十時十四分ではなく、十時四十分です。","じゅうじよんじゅっぷんです。十四分ではありません。","十時十四分に出発します。","Andere Minutenreihenfolge."]
},
{id:"lost-package",title:"発送と配達の電話",genre:"service",unit:"p25:shopping",setting:"Kundin und Online-Shop prüfen Lieferstatus telefonisch.",listeningGoal:"Absendung, Zustellung und Nachforschung unterscheiden",prediction:"Hat die Kundin Ware tatsächlich empfangen?",
 turns:[
 ["客","昨日発送したというメールを受け取ったのですが、荷物がまだ届きません。","Kundin: Ich bekam die E-Mail, dass das Paket gestern versandt wurde, aber es ist nicht angekommen."],
 ["担当","ご不便をおかけしています。発送番号はありますか。","Service: Entschuldigung für die Umstände. Haben Sie eine Versandnummer?"],
 ["客","はい、あります。番号は四一五二です。","Kundin: Ja, 4152."],
 ["担当","確認します。発送は済んでいますが、配達は明日の予定です。","Service: Ich prüfe. Versand erfolgte, Zustellung ist für morgen geplant."],
 ["客","では、今日の夜には受け取れないんですね。","Kundin: Also bekomme ich es heute Abend nicht?"],
 ["担当","はい、明日の午後に配達される予定ですが、交通によって遅れるかもしれません。","Service: Es soll morgen Nachmittag zugestellt werden, könnte sich aber verkehrsbedingt verspäten."],
 ["客","わかりました。まず明日まで待ってみます。","Kundin: Verstanden, ich warte zunächst bis morgen."]
 ],words:["hassou","haitatsu","jushin","kakunin","osoku"],contrast:"発送済み schließt nicht 配達済み ein; morgen ist Prognose, keine Empfangsbestätigung.",
 questions:[
 ["chronology","荷物はいつ発送されましたか。","昨日です。","昨日発送されました。","明日です。","Versand gestern, Zustellung frühestens morgen.","昨日発送したというメール"],
 ["inference","お客さんはもう荷物を受け取りましたか。","いいえ、まだ届いていません。","いいえ、配達はまだです。","はい、発送済みだからです。","Absendung und Empfang sind unterschiedliche Ereignisse.","荷物がまだ届きません"]
 ],
 response:["Neuer Fall: Dokument gestern versandt, erst Freitag voraussichtlich zugestellt. Trenne beides.","書類は昨日発送しましたが、配達は金曜日の予定です。","昨日送りました。まだ届いていないと思います。","書類は昨日すでに届きました。","Nicht aus Versand Zustellung erfinden."],
 delayed:["Andere Ware: Blumen heute verschickt, morgen vermutlich beim Empfänger.","花は今日発送しました。明日配達される予定です。","今日送りましたが、まだ届いたかは確認していません。","花はもう受け取ってもらいました。","Neue Ware und Frist."]
},
{id:"household-task",title:"掃除の役割が変わった",genre:"conversation",unit:"p23:routine",setting:"Drei Mitbewohner besprechen Haushalt vor Besuch.",listeningGoal:"Aufgabentausch, schon erledigte Schritte und offenen Rest unterscheiden",prediction:"Wer macht am Ende die Küche?",
 turns:[
 ["ユウ","明日、お客さんが来るから、今日は掃除しよう。","Yu: Morgen kommen Gäste, heute sollten wir putzen."],
 ["ケン","僕は台所を掃除する予定だったけど、夕方まで仕事なんだ。","Ken: Ich wollte die Küche putzen, muss aber bis abends arbeiten."],
 ["ミカ","じゃあ、私が台所を掃除するね。ケンさんは帰ってからごみを出せる？","Mika: Dann putze ich die Küche. Kann Ken nach der Heimkehr den Müll hinaustragen?"],
 ["ケン","うん、それならできる。ごみの分別はもう終わってる？","Ken: Ja, das geht. Ist der Müll schon getrennt?"],
 ["ユウ","紙は分けたけど、プラスチックはまだだよ。","Yu: Papier ist sortiert, Plastik noch nicht."],
 ["ケン","わかった。帰ってからプラスチックも分別して出すよ。","Ken: Verstanden, ich trenne nach der Arbeit auch das Plastik und bringe es weg."],
 ["ミカ","ありがとう。私は先に台所を片づけておくね。","Mika: Danke. Ich räume die Küche inzwischen auf."]
 ],words:["souji","gomi","bunbetsu","katazukeru","yotei"],contrast:"Ursprüngliche Zuweisung Küche an Ken wird auf Mika übertragen; Papier schon, Plastik nicht.",
 questions:[
 ["speaker","最後に台所を掃除することになったのは誰ですか。","ミカさんです。","ミカさんが掃除します。","ケンさんです。","Kens ursprüngliche Absicht wird geändert.","私が台所を掃除するね"],
 ["inference","プラスチックの分別はもう終わっていますか。","いいえ、まだです。","いいえ、ケンさんが後でします。","はい、紙と一緒に終わりました。","Yu unterscheidet Papier und Plastik.","プラスチックはまだだよ"]
 ],
 response:["Neue WG: Eigentlich solltest du bad putzen, musst arbeiten; frag Mitbewohner um Tausch gegen Müllentsorgung.","仕事があるので、お風呂の掃除をお願いできますか。代わりに私がごみを出します。","掃除を交代してもらえますか。私はごみを担当します。","お風呂はもう掃除しました。","Offene Aufgabe gegen neue Verantwortlichkeit tauschen."],
 delayed:["Neuer Fall: Garten gießen statt ursprünglich Staubsaugen; Schwester übernimmt Staubsaugen.","今日は庭の水やりをするので、掃除機は姉にお願いしました。","姉が掃除機をかけて、私は庭に水をやります。","私が両方もう終わらせました。","Andere Aufgaben und Personen."]
},
{id:"classroom-speaker",title:"学生の質問と先生の答え",genre:"meeting",unit:"p26:library-project",setting:"Seminar: Sprecher korrigiert falsche Aufgabenannahme.",listeningGoal:"Aufgabenzeitpunkt, Abgabeformat und unterschiedliche Stimmen hören",prediction:"Was meint der Student, was bestätigt Lehrkraft tatsächlich?",
 turns:[
 ["先生","レポートは金曜日の午後五時までに提出してください。","Dozentin: Bitte reicht den Bericht bis Freitag 17 Uhr ein."],
 ["学生Ａ","手書きで出してもいいですか。","Student A: Darf ich ihn handschriftlich abgeben?"],
 ["先生","いいえ、今回はPDFでオンライン提出です。","Dozentin: Nein, diesmal als PDF online."],
 ["学生Ｂ","土曜日の朝までだと思っていました。","Student B: Ich dachte, wir hätten bis Samstagmorgen Zeit."],
 ["先生","いいえ、金曜日の午後五時です。保存するだけでなく、送信もしてください。","Dozentin: Nein, Freitag 17 Uhr. Nicht nur speichern, sondern auch absenden."],
 ["学生Ａ","わかりました。送信の確認メールは来ますか。","Student A: Verstanden. Gibt es eine Eingangsbestätigung?"],
 ["先生","はい。メールが来なければ、受付に相談してください。","Dozentin: Ja. Falls keine E-Mail kommt, erkundigt euch am Empfang."]
 ],words:["teisuutsu","hozon","soushin","jushin","soudan"],contrast:"A glaubt handschriftlich, B glaubt Samstag; tatsächliche Frist Freitag 17 Uhr, PDF plus Versand.",
 questions:[
 ["speaker","土曜日の朝までだと思ったのは誰ですか。","学生Ｂです。","学生Ｂがそう思っていました。","学生Ａです。","Zwei verschiedene Missverständnisse von A und B.","学生Ｂ「土曜日の朝までだと思っていました」"],
 ["chronology","金曜日の五時までに何をする必要がありますか。","PDFをオンラインで提出する必要があります。","PDFを送信する必要があります。","ファイルを保存するだけでいいです。","Speichern ersetzt nicht Einreichen.","保存するだけでなく、送信もしてください"]
 ],
 response:["Du erklärst einem Kommilitonen, dass Dokument Donnerstag 14 Uhr elektronisch gesendet werden muss, nicht nur gespeichert.","木曜日の午後二時までにPDFを送信してください。保存だけでは提出になりません。","木曜日の二時までにオンラインで出してください。","木曜日に保存すれば提出済みです。","Abgabeformat und Uhrzeit erhalten."],
 delayed:["Neuer Workshop: Anmeldung bis Montag 11 Uhr als Onlineformular, nicht Papierantrag.","月曜日の午前十一時までにオンラインフォームを送信してください。紙では受け付けません。","申し込みは月曜日の十一時までです。オンラインで出してください。","紙で来週提出できます。","Neuer Prozess und Frist."]
},
{id:"daytrip-weather",title:"海ではなく山へ",genre:"dialogue",unit:"p23:plans",setting:"Zwei Freunde wählen wegen Wetter zwischen zwei Ausflügen.",listeningGoal:"Vorschläge, Risiko und endgültige Umplanung voneinander trennen",prediction:"Wer schlägt was vor und was wird beschlossen?",
 turns:[
 ["アヤ","日曜日は海へ行く予定だったよね。","Aya: Sonntag wollten wir ans Meer, oder?"],
 ["サラ","うん。でも、海の近くは強い風になるそうだよ。","Sara: Ja, aber an der Küste soll es starken Wind geben."],
 ["アヤ","じゃあ、山を歩くのはどう？","Aya: Wie wäre es mit Wandern in den Bergen?"],
 ["サラ","山も雨が降るかもしれないから、天気を確認したいな。","Sara: Auch dort könnte es regnen. Ich möchte das Wetter prüfen."],
 ["アヤ","今、見たら山は午後から雨だけど、朝は晴れみたい。","Aya: Laut aktueller Anzeige regnet es in den Bergen ab Nachmittag, vormittags scheint Sonne."],
 ["サラ","それなら、午前中だけ山を歩いて、昼には帰ろう。","Sara: Dann wandern wir nur vormittags und kommen bis mittags zurück."],
 ["アヤ","賛成。海の予定は別の日に延期しよう。","Aya: Einverstanden. Die Meerestour verschieben wir."]
 ],words:["yotei","enki","kakunin","shinpai"],contrast:"Wetter an Küste und Berg anders; Bergplan nur vormittags.",
 questions:[
 ["cause","どうして海へ行く予定を延期しましたか。","海の近くは強い風になるそうだからです。","海の強風を心配したからです。","山で雨が降るからです。","Wind betrifft Meer; Bergregen begrenzt Dauer.","海の近くは強い風になるそう"],
 ["inference","山では午後まで歩きますか。","いいえ、午前中だけです。","いいえ、昼には帰ります。","はい、午後も晴れです。","Regenrisiko ab Nachmittag motiviert Rückkehr.","午前中だけ山を歩いて、昼には帰ろう"]
 ],
 response:["Neuer Fall: Du verschiebst Seeausflug wegen Nebel, machst stattdessen Vormittagsspaziergang.","湖は霧が出そうなので延期して、午前中だけ散歩します。","湖には別の日に行って、今日は朝だけ歩きます。","午後まで湖で泳ぎます。","Alten Zielort nicht als neuen Plan beibehalten."],
 delayed:["Neue Szene: Sonntag Theater statt verregnetem Park, Beginn vormittags und Rückkehr mittags.","公園は雨なので、午前中は劇場に行って、昼に帰ります。","雨のため公園は延期し、午前中に劇を見ます。","午後は公園で遊びます。","Neues Wetterziel und Tätigkeit."]
},
{id:"work-shift-messages",title:"勤務時間を聞き直す",genre:"voice-message",unit:"p25:appointment",setting:"Drei kurze gesprochene Nachrichten zur Dienstplanänderung.",listeningGoal:"Alte Einladung von neuester bestätigter Rückmeldung unterscheiden",prediction:"Welche Aufnahme ist später und enthält tatsächliche Bestätigung?",
 turns:[
 ["店長・朝","明日の勤務は九時からです。いつもの入口に集合してください。","Leitung morgens: Morgen Dienstbeginn um neun am üblichen Eingang."],
 ["社員・昼","すみません、私の授業が十時までになりました。十一時からでもいいでしょうか。","Mitarbeiter mittags: Mein Unterricht geht jetzt bis zehn. Dürfte ich erst um elf anfangen?"],
 ["店長・昼","確認します。ほかの人の予定も見てから連絡します。","Leitung mittags: Ich prüfe den Plan anderer und melde mich."],
 ["社員・夕方","まだ返事がなかったので、九時に行くべきか迷っています。","Mitarbeiter abends: Ohne Antwort weiß ich nicht, ob ich um neun erscheinen soll."],
 ["店長・夕方","お待たせしました。明日は十一時からで大丈夫です。","Leitung abends: Danke fürs Warten. Morgen ist elf Uhr in Ordnung."],
 ["社員・夕方","ありがとうございます。入口は変わりませんか。","Mitarbeiter abends: Danke. Bleibt der Eingang gleich?"],
 ["店長・夕方","入口は同じですが、十一時までに来てください。","Leitung abends: Ja, Eingang bleibt. Kommen Sie bis elf."]
 ],words:["henkou","tsugou","kakunin","yotei","shugo"],contrast:"Mittags nur Prüfung, abends Bestätigung: Start 11 Uhr, Eingang unverändert.",
 questions:[
 ["chronology","十一時の勤務が決まったのはいつですか。","夕方です。","店長が夕方に返事をした時です。","昼に社員が聞いた時です。","Anfrage mittags, Bewilligung abends.","明日は十一時からで大丈夫です"],
 ["inference","集合する入口も変更されましたか。","いいえ、同じ入口です。","いいえ、入口は変わりません。","はい、新しい入口です。","Der Ort wird ausdrücklich beibehalten.","入口は同じですが"]
 ],
 response:["Ein Kollege fragt, ob die neue Schicht um zehn bereits genehmigt sei, Chef prüft noch. Antworte.","まだ確認中なので、十時からでいいかは決まっていません。","店長の返事を待っています。","十時に変更が決まりました。","Frage nicht als genehmigten Zeitplan melden."],
 delayed:["Neuer Fall: Auftrittsbeginn von 18 auf 19 Uhr beantragt, erst spätere bestätigte Nachricht gilt.","七時開始をお願いしましたが、まだ確認中です。決まったら知らせます。","時間の変更はまだ確定していません。","もう七時に決まりました。","Neue Veranstaltung, gleiches Antragsstatus."]
}
];
export const p55ScenesC=authored.map(authoredP55);
