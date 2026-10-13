import {authoredP55,type P55RawScene} from "./listening55-types";
/** 01–07: transit, appointments, purchases, everyday spoken decisions. */
const authored:readonly P55RawScene[]=[
{id:"platform-change",title:"ホームが変わった",genre:"announcement",unit:"p25:transport",setting:"Am Bahnhof: Durchsage und Gespräch zweier Fahrgäste.",listeningGoal:"Alte Gleisangabe gegen neue verbindliche Durchsage abgleichen",prediction:"Achte auf 以前, 変更, ではなく und auf die tatsächliche Abfahrt.",
 turns:[
 ["放送","お知らせします。九時二十分発の大阪行きは、三番線ではなく五番線から出発します。","Durchsage: Der Zug nach Osaka um 9:20 fährt nicht von Gleis drei, sondern fünf."],
 ["アキ","あれ、時刻表には三番線と書いてあったよ。","Aki: Im Fahrplan stand doch Gleis drei."],
 ["ミホ","でも、今の放送では五番線と言っていたね。","Miho: Aber die jetzige Durchsage sagte Gleis fünf."],
 ["アキ","じゃあ、五番線へ行こう。乗り換えの時間は大丈夫かな。","Aki: Dann gehen wir zu Gleis fünf. Reicht die Umsteigezeit?"],
 ["ミホ","十分あるから、急がなくても間に合うと思う。","Miho: Wir haben zehn Minuten; wahrscheinlich schaffen wir es ohne zu rennen."],
 ["放送","足元にご注意ください。列車の出発時間に変更はありません。","Durchsage: Bitte achten Sie auf Ihren Schritt. Die Abfahrtszeit bleibt unverändert."],
 ["アキ","よかった。場所だけ変わったんだね。","Aki: Gut. Nur der Ort wurde geändert."]
 ],words:["henkou","shuppatsu","jikokuhyou","norikae","maniau"],contrast:"Gleisänderung ist keine Abfahrtszeitänderung; alte Druckinfo gegen aktuelle Durchsage.",
 questions:[
 ["chronology","どの番線から電車に乗りますか。","五番線から乗ります。","五番線です。","三番線から乗ります。","Die aktuelle Durchsage ersetzt die frühere Angabe.","三番線ではなく五番線"],
 ["inference","出発時間も変わりましたか。","いいえ、時間は変わっていません。","いいえ、場所だけ変更されました。","はい、十分遅れます。","Die zehn Minuten sind verbleibende Zeit der Reisenden, nicht Verspätung.","出発時間に変更はありません"]
 ],
 response:["Eine Mitreisende fragt nach dem neuen Gleis. Antworte freundlich und unterscheide Gleis von Uhrzeit.","五番線に変更されましたが、出発時間は同じです。","今は五番線です。時間は変わりません。","九時二十分が五分遅れます。","Keine Zeitverschiebung aus Gleiswechsel erfinden."],
 delayed:["Neuer Fall: Flughafengate A6 wird zu B2, Abflugzeit bleibt gleich. Informiere einen Freund.","搭乗口はＡ６からＢ２に変更されましたが、出発時間は変わりません。","Ｂ２から乗ります。時間は同じです。","飛行機は二時間遅れます。","Neue Verkehrsart und Ortskennung, gleiche Unterscheidung."]
},
{id:"restaurant-booking",title:"二人から三人へ",genre:"service",unit:"p23:cafe",setting:"Telefonat zwischen Gast und Restaurant.",listeningGoal:"Reservierungsänderung von bereits bestätigter Buchung trennen",prediction:"Wer bittet um Änderung, was ist bereits bestätigt?",
 turns:[
 ["客","すみません、今夜七時に二人で予約した田中です。","Gast: Entschuldigung, hier Tanaka. Ich habe für heute um sieben für zwei Personen reserviert."],
 ["店員","はい、田中様、二名様で承っております。","Personal: Ja, Herr/Frau Tanaka, für zwei Gäste haben wir die Reservierung."],
 ["客","友達が一人増えたので、三人に変更できますか。","Gast: Ein Freund kommt dazu. Können wir auf drei ändern?"],
 ["店員","少々お待ちください。席を確認いたします。","Personal: Einen Moment bitte, ich kontrolliere die Plätze."],
 ["客","もし難しければ、七時半でも大丈夫です。","Gast: Falls es schwierig ist, wäre halb acht auch in Ordnung."],
 ["店員","七時なら三名様でご用意できます。時間はそのままでよろしいですか。","Personal: Für drei Personen geht sieben Uhr. Soll die Uhrzeit bleiben?"],
 ["客","はい、ありがとうございます。三人で七時に伺います。","Gast: Ja, vielen Dank. Wir kommen zu dritt um sieben."]
 ],words:["yoyaku","henkou","kakunin","tsugou","shouchi"],contrast:"Halb acht ist nur angebotene Alternative; bestätigt sind drei Personen um sieben.",
 questions:[
 ["chronology","店員が席を確認した後、何が決まりましたか。","三人で七時の予約になりました。","七時に三人で行けます。","七時半に二人で行くことです。","Der Vorschlag 19:30 wird nicht angenommen.","七時なら三名様でご用意できます"],
 ["speaker","七時半でも大丈夫と言ったのは誰ですか。","お客さんです。","田中さんです。","店員さんです。","Die alternative Uhrzeit bietet der Gast, nicht das Personal.","七時半でも大丈夫です"]
 ],
 response:["Neuer Gast möchte von vier auf fünf Personen umbuchen. Bitte höflich um Änderung ohne sie als bestätigt auszugeben.","五人に変更できますか。","予約を四人から五人に変更したいのですが。","五人に変更しました。","Eine Anfrage ist noch keine Bestätigung."],
 delayed:["Neuer Kontext: Hotelbuchung von zwei auf drei Nächte, Rezeption prüft erst. Frage höflich.","二泊の予約を三泊に変更できますか。","三泊にしたいのですが、空いていますか。","三泊に変更が決まりました。","Neuer Service und Einheit, Status bleibt Anfrage."]
},
{id:"wrong-station",title:"バスを降りる場所",genre:"dialogue",unit:"p25:directions",setting:"Touristin erkundigt sich im Bus bei einer Mitfahrerin.",listeningGoal:"Umstieg und Ausstieg mit korrigierter Ortsangabe unterscheiden",prediction:"Achte auf 先ほど, でも und 訂正.",
 turns:[
 ["旅行者","すみません、市役所へ行きたいんですが、このバスでいいですか。","Touristin: Entschuldigung, ist dieser Bus richtig zum Rathaus?"],
 ["乗客","はい。最初は中央駅で降りると聞いたんですが、ちょっと待ってください。","Fahrgast: Ja. Zunächst habe ich gehört, man solle am Hauptbahnhof aussteigen, aber warten Sie kurz."],
 ["旅行者","中央駅から歩くんでしょうか。","Touristin: Soll ich vom Hauptbahnhof laufen?"],
 ["乗客","今の案内を聞くと、次の交差点のあとに市役所前という停留所がありますね。","Fahrgast: Laut aktueller Ansage gibt es nach der nächsten Kreuzung die Haltestelle Rathaus."],
 ["旅行者","じゃあ、中央駅では降りなくていいんですね。","Touristin: Dann muss ich nicht am Hauptbahnhof aussteigen."],
 ["乗客","そうです。市役所前で降りて、横断歩道を渡ってください。","Fahrgast: Richtig. Steigen Sie bei Rathaus aus und gehen Sie über den Zebrastreifen."],
 ["旅行者","助かりました。ありがとうございます。","Touristin: Das hat mir geholfen, danke."]
 ],words:["anai","kousaten","yokodanhodou","noriba"],contrast:"Erster indirekter Tipp wird nach neuer Haltestellenansage korrigiert.",
 questions:[
 ["chronology","旅行者は結局どこでバスを降りますか。","市役所前で降ります。","市役所前という停留所です。","中央駅で降ります。","Der erste Rat war unsicher und wurde revidiert.","市役所前で降りて"],
 ["cause","どうして中央駅で降りませんか。","市役所前という停留所があるからです。","今の案内で市役所前がわかったからです。","中央駅は工事中だからです。","Die neue Durchsage erklärt die Änderung, nicht eine Baustelle.","今の案内を聞くと"]
 ],
 response:["Du korrigierst deine frühere Wegbeschreibung zu einem Besucher: nicht Westausgang, sondern Ostausgang.","すみません、西口ではなく東口から出てください。","さっきの案内を訂正します。東口が正しいです。","西口に必ず行ってください。","Die Reparatur soll die ursprüngliche Angabe explizit ersetzen."],
 delayed:["Neuer Fall: Nicht am Park aussteigen, sondern an der Universität. Korrigiere ohne Fahrplandaten.","公園前ではなく、大学前で降りてください。","すみません、大学前が正しい停留所です。","公園前で降りてください。","Neue Haltestellen und neue korrigierte Information."]
},
{id:"grocery-substitution",title:"牛乳が売り切れ",genre:"service",unit:"p25:shopping",setting:"Anruf aus einem Supermarkt an die WG.",listeningGoal:"Ausverkauft, Ersatzprodukt und tatsächliche Kaufentscheidung hören",prediction:"Welche Alternative ist lediglich vorgeschlagen, welche wird gewählt?",
 turns:[
 ["ケン","もしもし、買い物中なんだけど、いつもの牛乳が品切れだよ。","Ken: Hallo, ich bin einkaufen. Die übliche Milch ist ausverkauft."],
 ["ミカ","そうなんだ。別の会社の牛乳はある？","Mika: Ach so. Gibt es Milch einer anderen Marke?"],
 ["ケン","あるけど、少し高い。豆乳なら割引になっているよ。","Ken: Ja, etwas teurer. Sojamilch ist im Angebot."],
 ["ミカ","今日はケーキを作るから、牛乳のほうがいいな。","Mika: Heute backen wir Kuchen, da wäre normale Milch besser."],
 ["ケン","わかった。高くても別の会社の牛乳を買うね。","Ken: Verstanden. Ich kaufe die Milch der anderen Marke trotz des höheren Preises."],
 ["ミカ","ありがとう。領収書をもらってきてね。","Mika: Danke. Bring bitte die Quittung mit."],
 ["ケン","うん。帰ったら材料を一緒に確認しよう。","Ken: Ja. Zuhause kontrollieren wir die Zutaten zusammen."]
 ],words:["hinagire","waribiki","ryoushuusho","zairyou","kakunin"],contrast:"Preisangebot für Sojamilch führt nicht zum Kauf; Kochzweck erklärt Alternativwahl.",
 questions:[
 ["inference","ケンさんは豆乳を買うことにしましたか。","いいえ、別の会社の牛乳を買います。","いいえ、高い牛乳を買います。","はい、割引だからです。","Mika braucht für den Kuchen ausdrücklich Milch.","高くても別の会社の牛乳を買うね"],
 ["speaker","領収書を頼んだのは誰ですか。","ミカさんです。","ミカさんが頼みました。","ケンさんです。","Mika bittet Ken im letzten Drittel.","領収書をもらってきてね"]
 ],
 response:["Neuer Einkauf: Der übliche Reis ist ausverkauft; Kunde wählt trotz Preissteigerung anderen Reis.","いつものお米は品切れなので、少し高くても別のお米を買います。","別の種類のお米をお願いします。","安いパンを買いました。","Ersatz darf nicht mit vorgeschlagenem Fremdprodukt verwechselt werden."],
 delayed:["Neuer Kontext: Gewünschter Tee fehlt, anderer Tee ist teuer, günstiger Kaffee wird abgelehnt.","コーヒーではなく、少し高い別のお茶にします。","いつものお茶がないので、別のお茶を買います。","安いコーヒーを買います。","Neue Gegenstände, gleiche Wahl gegen Preisempfehlung."]
},
{id:"library-call",title:"返却期限の電話",genre:"voice-message",unit:"p25:library",setting:"Voicemail der Bibliothek, danach Gespräch im Haushalt.",listeningGoal:"Genannte Frist, Handlungsaufforderung und unbewilligte Verlängerung trennen",prediction:"Ist eine Frist schon geändert oder nur ein Antrag möglich?",
 turns:[
 ["録音","図書館からのお知らせです。お借りの本の返却期限は今週の金曜日です。","Aufnahme: Dies ist die Bibliothek. Rückgabe ist diesen Freitag."],
 ["録音","延長を希望する場合は、木曜日までにウェブサイトで手続きをしてください。","Aufnahme: Wer verlängern möchte, erledigt das Verfahren bis Donnerstag online."],
 ["録音","ほかの方の予約がある場合、延長できないことがあります。","Aufnahme: Bei Vormerkungen kann die Verlängerung unmöglich sein."],
 ["ユウ","今の電話、もう一週間延長されたってこと？","Yu: Heißt das, es wurde bereits um eine Woche verlängert?"],
 ["姉","いいえ。木曜日までに申し込めるという案内だよ。","Schwester: Nein. Es ist eine Mitteilung, dass man bis Donnerstag beantragen kann."],
 ["ユウ","じゃあ、今日中に確認するね。","Yu: Dann kontrolliere ich das heute."],
 ["姉","忘れないで。予約があったら延長できないかもしれないよ。","Schwester: Vergiss nicht: Bei einer Vormerkung klappt es vielleicht nicht."]
 ],words:["shimekiri","moushikomi","yoyaku","kakunin","uketsukeru"],contrast:"Antragsweg und bedingte Bewilligung nicht als automatische Verlängerung hören.",
 questions:[
 ["chronology","延長を希望する人はいつまでに手続きしますか。","木曜日までです。","木曜日までにします。","金曜日の後です。","Telefon nennt Donnerstag als Antragsfrist.","木曜日までにウェブサイトで手続きを"],
 ["inference","本はもう延長されましたか。","いいえ、まだ手続きが必要です。","いいえ、申し込みをしなければなりません。","はい、電話があったので延長済みです。","Voicemail berichtet eine Möglichkeit, keine Zusage.","延長を希望する場合は"]
 ],
 response:["Eine Kollegin denkt, ihre Anmeldung sei automatisch bestätigt. Erkläre die notwendige Prüfung.","申し込みをしただけでは決まりません。確認の連絡を待ってください。","まだ確認が必要です。","もう必ず参加できます。","Anmeldung nicht mit Teilnahmebestätigung gleichsetzen."],
 delayed:["Neue Situation: Museumsticket muss bis Dienstag beantragt werden, Platz hängt von Kapazität ab.","火曜日までに申し込んでください。ただし、席があるかどうかはまだわかりません。","火曜日までに手続きをして、確認を待ってください。","申し込めば必ず入れます。","Neues Verfahren mit echter Unsicherheit."]
},
{id:"cafe-payments",title:"お会計は別々ですか",genre:"service",unit:"p23:cafe",setting:"Drei Gäste zahlen nach dem Essen.",listeningGoal:"Zahlungsart, gemeinsames Essen und getrennte Rechnung auseinanderhalten",prediction:"Wie viele Gäste zahlen zusammen, wer will Quittung?",
 turns:[
 ["店員","お食事はいかがでしたか。お会計はご一緒ですか。","Service: Hat es geschmeckt? Zahlen Sie gemeinsam?"],
 ["アヤ","私は別々に払いたいです。","Aya: Ich möchte getrennt bezahlen."],
 ["ケン","僕はミホさんの分も払います。二人分を一緒にお願いします。","Ken: Ich bezahle auch M ih os Anteil. Zwei Personen zusammen bitte."],
 ["ミホ","ありがとう。でも、私は飲み物を一つ追加したよ。","Miho: Danke. Aber ich habe noch ein Getränk bestellt."],
 ["店員","かしこまりました。お二人の飲み物も含めて確認します。","Service: Verstanden, ich berücksichtige und prüfe auch Ihre Getränke."],
 ["アヤ","私は現金で払います。領収書を一枚ください。","Aya: Ich zahle bar. Eine Quittung bitte."],
 ["ケン","こちらはカードでお願いします。","Ken: Wir zahlen diesen Teil mit Karte."]
 ],words:["kaikei","betsubetsu","genkin","ryoushuusho","kakunin"],contrast:"Drei Gäste: eine Einzelrechnung und eine gemeinsame Zweierrechnung.",
 questions:[
 ["speaker","現金で払うのは誰ですか。","アヤさんです。","アヤさんが現金で払います。","ケンさんです。","Ken zahlt mit Karte, Aya bar.","私は現金で払います"],
 ["inference","三人は全員別々に払いますか。","いいえ、二人分は一緒に払います。","いいえ、ケンさんが二人分払います。","はい、三人とも別々です。","A yas Einzelzahlung schließt gemeinsame Zahlung anderer nicht aus.","二人分を一緒にお願いします"]
 ],
 response:["Du bist mit drei Kollegen im Café: zwei zahlen zusammen, du allein bar. Teile dies dem Service mit.","お二人は一緒に、私は別々に現金で払います。","二人分は一緒で、私の分は現金でお願いします。","全員で一つのお会計です。","Sprecher und Teilgruppe klar trennen."],
 delayed:["Neuer Fall: Vier Gäste, drei zahlen zusammen mit Karte, eine Person allein in bar.","三人分はカードで一緒に、一人分は現金で別々にお願いします。","お会計は三人と一人に分けてください。","四人全員がカードで払います。","Neue Gruppengröße und Zahlungsaufteilung."]
},
{id:"club-invitation",title:"音楽クラブに入りますか",genre:"conversation",unit:"p23:introduction",setting:"Zwei Freundinnen besprechen den Besuch einer Musik-AG.",listeningGoal:"Einladung, zeitweilige Teilnahme und endgültige Entscheidung unterscheiden",prediction:"Wer hat sich schon entschieden, wer will zunächst schauen?",
 turns:[
 ["ハナ","明日の音楽クラブ、いっしょに行かない？","Hana: Kommst du morgen mit zum Musikclub?"],
 ["ナオ","興味はあるけど、まだ楽器を弾いたことがないんだ。","Nao: Interessiert mich, aber ich habe noch nie ein Instrument gespielt."],
 ["ハナ","最初は見学だけでも大丈夫らしいよ。","Hana: Man kann wohl anfangs einfach zuschauen."],
 ["ナオ","それなら行ってみようかな。でも、入るかどうかは後で決めたい。","Nao: Dann schaue ich es mir vielleicht an, aber über die Mitgliedschaft entscheide ich später."],
 ["ハナ","いいよ。先生に場所を確認しておくね。","Hana: Klar. Ich frage vorher die Lehrerin nach dem Raum."],
 ["ナオ","ありがとう。練習は四時からだったよね。","Nao: Danke. Die Probe beginnt um vier, oder?"],
 ["ハナ","うん、でも見学の人は三時五十分に来てほしいって。","Hana: Ja, aber Besucher sollen schon um 15:50 da sein."]
 ],words:["sasou","sanka","kimeru","kakunin","shitsumon"],contrast:"Besuch 15:50, Training 16:00, Mitgliedschaft noch nicht beschlossen.",
 questions:[
 ["chronology","見学する人は何時に来るといいですか。","三時五十分です。","午後三時五十分です。","四時です。","Die Startzeit 16:00 ist nicht die gewünschte Besucherankunft.","三時五十分に来てほしい"],
 ["inference","ナオさんはもうクラブに入ると決めましたか。","いいえ、見学してから決めます。","いいえ、まだ決めていません。","はい、明日行くので入会しました。","Interesse und Besuch sind keine Mitgliedschaft.","入るかどうかは後で決めたい"]
 ],
 response:["Du lädst Freund zu Kursbesuch ein, versprichst aber keine Anmeldung.","最初は見学だけでもいいので、一緒に行ってみませんか。","まだ申し込まなくても、見に行けますよ。","もう申し込みましたよね。","Vorschau und feste Teilnahme unterscheiden."],
 delayed:["Neuer Fall: Kletterclub Probetraining um 18:00, Besucher kommen 17:45, Mitgliedschaft später.","練習は六時からですが、見学する人は五時四十五分に来てください。入会は後で決められます。","まず見学してから入るかどうか決めてください。","全員、もう入会しました。","Anderer Sport und neue Zeiten."]
}
];
export const p55ScenesA=authored.map(authoredP55);
