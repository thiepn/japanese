import {authoredP55,type P55RawScene} from "./listening55-types";
/** 22–28: richer interviews, nuanced services and conversational repair. */
const authored:readonly P55RawScene[]=[
{id:"interview-commute",title:"通学に何を使いますか",genre:"interview",unit:"p25:transport",setting:"Campusumfrage mit drei Studierenden zu Verkehrsmitteln.",listeningGoal:"Erfahrungen und Zahlen einzelnen Sprechern zuordnen",prediction:"Wer nutzt Rad, wer Bus, wer zieht den Zug vor?",
 turns:[
 ["聞き手","大学へは普通どうやって来ますか。","Interviewer: Wie kommt ihr normalerweise zur Uni?"],
 ["ナオ","私は自転車です。駅からだと二十分ですが、家から直接なら十五分です。","Nao: Ich fahre Rad. Vom Bahnhof wären es zwanzig Minuten, direkt von zuhause fünfzehn."],
 ["聞き手","雨の日はどうしますか。","Interviewer: Was machst du bei Regen?"],
 ["ナオ","雨が強ければバスに乗ります。","Nao: Bei starkem Regen nehme ich den Bus."],
 ["ケン","僕は毎日バスですが、朝は混雑して、時々遅れます。","Ken: Ich nehme täglich den Bus, der morgens oft voll und manchmal verspätet ist."],
 ["ミホ","私は電車のほうが時間を確認しやすいので使っています。でも、乗り換えは一回あります。","Miho: Ich nutze eher den Zug, dessen Fahrzeiten sich leicht prüfen lassen. Ich muss aber einmal umsteigen."],
 ["聞き手","なるほど。同じ大学でも通学の理由は違いますね。","Interviewer: Interessant. Auch an derselben Uni gibt es unterschiedliche Gründe."]
 ],words:["konzatsu","norikae","jikokuhyou","osoku","koutsuu"],contrast:"Interviewer fasst zusammen; einzelne Sprecher besitzen unterschiedliche Routinen.",
 questions:[
 ["speaker","毎日バスで来ると言ったのは誰ですか。","ケンさんです。","ケンさんがバスで来ます。","ナオさんです。","Nao fährt Rad und nur bedingt Bus.","僕は毎日バスですが"],
 ["inference","ナオさんは雨が少し降るだけでも必ずバスに乗りますか。","いいえ、強い雨の時だけと言いました。","いいえ、強い雨ならバスに乗ります。","はい、雨なら必ずバスです。","Die Bedingung schränkt die Aussage ein.","雨が強ければバスに乗ります"]
 ],
 response:["Interviewer fragt dich: normalerweise Fahrrad, bei Schnee U-Bahn. Antworte mit Bedingung.","普通は自転車ですが、雪の日は地下鉄を使います。","晴れていれば自転車で、雪なら地下鉄で行きます。","毎日必ず地下鉄です。","Routine und Ausnahme unterscheiden."],
 delayed:["Neuer Interviewfall: Normalerweise zu Fuß zur Arbeit, bei Sturm Bus; Kollegin fährt immer Zug.","私は普通歩いて仕事に行きますが、風が強い日はバスです。同僚はいつも電車です。","普段は徒歩ですが、強風の日はバスに乗ります。","同僚もいつも歩きます。","Neue Sprecher und Transportkombination."]
},
{id:"library-room",title:"勉強部屋の利用時間",genre:"service",unit:"p25:library",setting:"Student und Bibliothekarin sprechen über Gruppenraum.",listeningGoal:"Buchbare Uhrzeit, tatsächlich freie Stunde und Antrag trennen",prediction:"Was ist noch verfügbar und ist es reserviert?",
 turns:[
 ["学生","明日、四人で使える勉強部屋を予約したいのですが。","Student: Ich möchte morgen einen Lernraum für vier buchen."],
 ["職員","午後一時から三時までは予約が入っています。三時半から五時なら空いています。","Bibliothekarin: Von 13 bis 15 Uhr ist er gebucht; 15:30 bis 17 Uhr ist frei."],
 ["学生","私たちは四時からなら集まれます。四時から五時でも大丈夫ですか。","Student: Wir können erst ab vier zusammenkommen. Wäre 16 bis 17 Uhr okay?"],
 ["職員","はい。ただし、利用時間は一時間ですから、五時までに片づけてください。","Bibliothekarin: Ja. Die Nutzungszeit beträgt eine Stunde; bitte bis fünf aufräumen."],
 ["学生","わかりました。予約には学生証が必要ですか。","Student: Ist für die Buchung ein Studierendenausweis nötig?"],
 ["職員","はい、受付で見せてください。その後で予約を確定します。","Bibliothekarin: Ja, bitte am Schalter vorzeigen. Danach bestätigen wir die Buchung."],
 ["学生","では、今から学生証を取りに行きます。","Student: Dann hole ich jetzt den Ausweis."]
 ],words:["yoyaku","hitsuyou","uketsuke","katazukeru","shugo"],contrast:"Möglicher 16-Uhr-Slot noch nicht verbindlich vor Studierendenausweis.",
 questions:[
 ["chronology","予約を確定する前に何を見せますか。","学生証です。","受付で学生証を見せます。","部屋の鍵です。","Ausweisprüfung geht verbindlicher Reservierung voraus.","その後で予約を確定します"],
 ["inference","学生はもう部屋を予約できましたか。","いいえ、学生証をまだ見せていません。","いいえ、これから学生証を取りに行きます。","はい、四時から決まっています。","Verfügbarkeit ist nicht abgeschlossene Buchung.","今から学生証を取りに行きます"]
 ],
 response:["Du willst Seminarrraum von 10 bis 11 nutzen; musst Ausweis erst bringen. Frage höflich.","十時から十一時まで使いたいです。学生証を持ってきてから予約できますか。","その時間は空いていますか。学生証は後で見せます。","もう予約が確定しました。","Zeitfenster und Bedingung klar halten."],
 delayed:["Neue Szene: Sporthalle verfügbar 14 bis 15 Uhr, Bezahlung vor endgültiger Buchung nötig.","二時から三時まで使いたいです。支払いをしてから予約が決まりますか。","利用料金を払えば予約できますか。","もう無料で予約しました。","Neuer Raum und Bedingung."]
},
{id:"recycling-neighbors",title:"ごみ出しの日を聞き直す",genre:"dialogue",unit:"p23:routine",setting:"Neue Bewohnerin fragt Nachbarin nach Abfalltagen.",listeningGoal:"Wochentage und Materialkategorien korrekt zuordnen",prediction:"Was darf heute hinaus, was erst später?",
 turns:[
 ["新人","すみません、今日はプラスチックのごみを出してもいいですか。","Neue Bewohnerin: Darf ich heute Plastikmüll rausstellen?"],
 ["隣人","今日は水曜日なので、紙の日ですよ。プラスチックは金曜日です。","Nachbarin: Heute ist Mittwoch, Papiertag. Plastik kommt Freitag."],
 ["新人","あっ、金曜日でしたね。ガラスはどうですか。","Neue Bewohnerin: Ach, Freitag. Und Glas?"],
 ["隣人","ガラスは月曜日です。入口の案内に書いてあります。","Nachbarin: Glas montags. Steht auf dem Aushang am Eingang."],
 ["新人","ありがとうございます。古い家具も金曜日に出せますか。","Neue Bewohnerin: Danke. Darf ich alte Möbel auch Freitag abgeben?"],
 ["隣人","いいえ、大きい物は市に申し込まないといけません。","Nachbarin: Nein, für große Gegenstände muss man sich bei der Stadt anmelden."],
 ["新人","わかりました。まず案内を確認します。","Neue Bewohnerin: Verstanden, ich prüfe erst den Aushang."]
 ],words:["gomi","bunbetsu","moushikomi","kakunin","kisoku"],contrast:"Drei Materialtage und separate Sperrmüllanmeldung, kein gemeinsamer Freitag.",
 questions:[
 ["chronology","プラスチックは何曜日に出しますか。","金曜日です。","金曜日に出します。","水曜日です。","Mittwoch ist Papier.","プラスチックは金曜日です"],
 ["inference","大きい家具は普通のごみの日に出せますか。","いいえ、市への申し込みが必要です。","いいえ、別に申し込まなければなりません。","はい、金曜日なら出せます。","Sperrmüll folgt Sonderverfahren.","市に申し込まないといけません"]
 ],
 response:["Du erklärst neuer Mitbewohnerin: Papier Dienstag, Glas Donnerstag, Möbel nur auf Anmeldung.","紙は火曜日、ガラスは木曜日です。家具は別に申し込む必要があります。","紙とガラスは別々の日で、大きい家具には申し込みが必要です。","家具も火曜日に全部出せます。","Regel für große Gegenstände nicht verallgemeinern."],
 delayed:["Neue Abfallregeln: Biomüll Samstag, Papier Montag, alte Elektrogeräte nur bei Sammelstelle.","生ごみは土曜日、紙は月曜日です。古い電化製品は回収所に持って行ってください。","電化製品は普通のごみの日には出せません。","電化製品も紙と一緒に出します。","Neue Kategorien und Verfahren."]
},
{id:"study-peer-feedback",title:"発表の練習を見て",genre:"meeting",unit:"p26:library-project",setting:"Zwei Lernende geben sich Feedback nach einem Kurzvortrag.",listeningGoal:"Beobachtete Verbesserung und noch bestehende Schwierigkeit unterscheiden",prediction:"Welcher Aspekt gelingt besser, was muss weiterhin geübt werden?",
 turns:[
 ["ハル","さっきの発表、どうだった？","Haru: Wie war mein Vortrag gerade?"],
 ["ミナ","最初の説明は前よりわかりやすかったよ。","Mina: Der Anfang war verständlicher als vorher."],
 ["ハル","よかった。質問に答える時は緊張したけど。","Haru: Gut. Bei Fragen war ich aber nervös."],
 ["ミナ","うん、答える前に少し時間がかかったね。でも、理由を説明できたのはよかった。","Mina: Ja, vor Antworten brauchtest du Zeit. Aber die Gründe konntest du erklären."],
 ["ハル","次はもっと早く答えられるように練習するよ。","Haru: Nächstes Mal übe ich schnellere Antworten."],
 ["ミナ","その前に、難しい質問を聞き返す練習もしたらどう？","Mina: Wie wäre es, vorher das Nachfragen bei schwierigen Fragen zu üben?"],
 ["ハル","そうだね。次回は質問をメモしてから答えることにする。","Haru: Stimmt. Nächstes Mal notiere ich die Frage vor der Antwort."]
 ],words:["happyou","shitsumon","riyuu","kinchou","mokuhyou"],contrast:"Bessere Erklärung bedeutet nicht sofortige Antworten ohne Nervosität.",
 questions:[
 ["speaker","質問をメモしてから答えようと決めたのは誰ですか。","ハルさんです。","発表したハルさんです。","ミナさんです。","Mina gibt Vorschlag, Haru trifft eigene Entscheidung.","次回は質問をメモしてから"],
 ["inference","ハルさんは質問への答えがもう全部早くできていますか。","いいえ、まだ時間がかかっています。","いいえ、これから練習したいと言っています。","はい、すべてすぐ答えました。","Feedback nennt weiterhin Verzögerung.","答える前に少し時間がかかったね"]
 ],
 response:["Nach einem Sprachvortrag lobst du klare Einleitung, weist aber höflich auf langsame Antworten hin.","最初の説明はわかりやすかったですが、質問への答えには少し時間がかかりました。","説明は上手でした。次は質問に答える練習をしましょう。","質問も全部すぐ答えられました。","Lob darf Grenze nicht ausradieren."],
 delayed:["Neues Projekt: Video klar geschnitten, Untertitel noch unvollständig. Gib konstruktive Rückmeldung.","動画は見やすく編集されていますが、字幕はまだ全部できていません。","編集はよかったです。次は字幕を確認しましょう。","字幕は完全にできています。","Neue Arbeitsform, Leistung vs offener Teil."]
},
{id:"price-call",title:"税抜きの値段",genre:"service",unit:"p25:shopping",setting:"Kunde und Verkäufer besprechen zwei Preisetiketten.",listeningGoal:"Nettoangabe, Endpreis und Rabatt unterscheiden",prediction:"Welcher Preis enthält bereits Steuer?",
 turns:[
 ["客","このかばんは三千円と書いてありますね。税込みですか。","Kunde: Auf der Tasche steht 3.000 Yen. Ist das inklusive Steuer?"],
 ["店員","いいえ、そちらは税抜き価格です。","Verkäufer: Nein, das ist der Preis ohne Steuer."],
 ["客","では、レジでは三千円より高くなるんですね。","Kunde: Dann ist es an der Kasse mehr als 3.000?" ],
 ["店員","はい。こちらの財布は税込みで二千二百円です。","Verkäufer: Ja. Diese Geldbörse kostet inklusive Steuer 2.200."],
 ["客","財布には割引がありますか。","Kunde: Gibt es auf die Geldbörse Rabatt?"],
 ["店員","今日は五百円の値下げがもう価格に含まれています。","Verkäufer: Die heutige Preisreduktion von 500 ist bereits enthalten."],
 ["客","なるほど。では、財布のほうを買います。","Kunde: Verstanden. Dann nehme ich die Geldbörse."]
 ],words:["zeinuki","zeikomi","waribiki","nesage","kakaku"],contrast:"Netto 3000 kein Endpreis; 2200 inklusive Steuern und bestehendem Nachlass.",
 questions:[
 ["inference","財布の二千二百円からさらに五百円引きますか。","いいえ、値下げはもう含まれています。","いいえ、今の価格に含まれています。","はい、千七百円になります。","Preisnachlass ist schon eingerechnet.","もう価格に含まれています"],
 ["evidence","三千円のかばんは税込みですか。","いいえ、税抜きです。","いいえ、税抜き価格です。","はい、税込みです。","Verkäufer sagt ausdrücklich ohne Steuer.","そちらは税抜き価格です"]
 ],
 response:["Neues Geschäft: Kopfhörerpreis 5000 ohne Steuer, Kundenkarte-Rabatt schon im Preisschild enthalten. Erkläre.","五千円は税抜きで、割引はもう表示価格に含まれています。","税金は別ですが、割引はすでに入っています。","税込みでさらに割引します。","Steuerstatus und Nachlassstatus unabhängig halten."],
 delayed:["Neue Ware: Ticket 1200 Yen inklusive Steuer, Aktionsrabatt schon darin enthalten.","切符は税込みで千二百円です。割引ももう含まれています。","千二百円が税込みの価格で、さらに値下げはありません。","千二百円からまた値下げします。","Neue Zahl und Artikel, kein doppelter Rabatt."]
},
{id:"volunteer-phone",title:"人数を確認してから",genre:"conversation",unit:"p23:plans",setting:"Zwei Ehrenamtliche organisieren Getränke für ein Treffen.",listeningGoal:"Unsichere Teilnehmerzahl von Bedarf und Bestellung trennen",prediction:"Wann darf verbindlich bestellt werden?",
 turns:[
 ["ユリ","土曜日の交流会の飲み物を注文してもいい？","Yuri: Darf ich Getränke für Samstag bestellen?"],
 ["アキ","ちょっと待って。参加者が何人になるかまだ確認していないんだ。","Aki: Warte kurz, wir haben die Teilnehmerzahl noch nicht geprüft."],
 ["ユリ","先週は二十人だったよね。今回も二十人分でいいかな。","Yuri: Letzte Woche waren es zwanzig. Sollen wir diesmal auch für zwanzig bestellen?"],
 ["アキ","今回は初めて来る人もいるかもしれないよ。","Aki: Diesmal könnten auch Neulinge kommen."],
 ["ユリ","じゃあ、今日中に参加者へ連絡してみるね。","Yuri: Dann frage ich heute noch bei den Teilnehmern nach."],
 ["アキ","ありがとう。明日の朝、人数が決まってから注文しよう。","Aki: Danke. Bestellen wir morgen früh nach Festlegung der Zahl."],
 ["ユリ","了解。今は注文しないでおくね。","Yuri: Verstanden. Ich bestelle noch nichts."]
 ],words:["sanka","chuumon","kakunin","kimeru","mae"],contrast:"Vergangene 20 sind kein aktueller gesicherter Bedarf; Bestellung noch nicht erfolgt.",
 questions:[
 ["inference","ユリさんは今すぐ飲み物を注文しますか。","いいえ、明日人数を確認してからです。","いいえ、今は注文しません。","はい、二十人分を注文します。","Aktuelle Teilnehmerzahl fehlt.","今は注文しないでおくね"],
 ["cause","先週の人数をそのまま使わないのはなぜですか。","今回は初めて来る人もいるかもしれないからです。","参加者の人数が変わる可能性があるからです。","先週の注文が間違っていたからです。","Neulinge machen 20 zum unsicheren Wert.","初めて来る人もいるかもしれないよ"]
 ],
 response:["Du organisierst Mittagessen, letzte Woche waren zehn Personen, diesmal unbekannt; bitte zunächst zählen.","前回は十人でしたが、今回はまだわかりません。人数を確認してから注文しましょう。","人数が決まるまで注文しないでください。","今回も必ず十人分を注文します。","Alte Zahl nicht als aktuelle Gewissheit verwenden."],
 delayed:["Neuer Fall: Für Ausflug Busplätze; vergangene Woche 15, jetzt unbekannt, Buchung nach Bestätigung.","先週は十五人でしたが、今回は人数が未定です。確認してからバスを予約します。","参加人数が決まってから予約しましょう。","今回も十五人で予約しました。","Andere Ressource und Teilnehmerzahl."]
},
{id:"appointment-register",title:"友達とお客様への話し方",genre:"interview",unit:"p23:introduction",setting:"Neue Servicekraft übt zwei Register mit Kollegin.",listeningGoal:"Gleiche Information in vertrauter und formeller Form erkennen",prediction:"Für wen gilt 了解, für wen 承知しました?",
 turns:[
 ["先輩","友達から時間の変更が来たら、どう答える？","Kollegin: Wie antwortest du einem Freund auf Zeitänderung?"],
 ["新人","「了解、七時に行くね」でいいですか。","Neue Kraft: Ist „Okay, ich komme um sieben“ passend?"],
 ["先輩","うん、友達なら自然だね。では、お客様には？","Kollegin: Ja, für Freunde natürlich. Und bei Kunden?"],
 ["新人","「承知しました。七時にお待ちしております」と言います。","Neue Kraft: „Verstanden. Wir erwarten Sie um sieben.“"],
 ["先輩","いいね。ただし、まだ変更できるかわからない時は、どうする？","Kollegin: Gut. Und wenn wir nicht wissen, ob die Änderung möglich ist?"],
 ["新人","「確認してからご連絡します」と言います。","Neue Kraft: „Ich prüfe und melde mich.“"],
 ["先輩","そのとおり。丁寧な言い方でも、できない約束をしないことが大切だよ。","Kollegin: Genau. Auch höflich darf man nichts versprechen, was man nicht leisten kann."]
 ],words:["shouchi","ryoukai","teinei","kakunin","yakusoku"],contrast:"Registerwechsel ändert Höflichkeit, nicht Status der Bestätigung.",
 questions:[
 ["speaker","「承知しました」を使うのはどんな相手ですか。","お客様です。","お客様に丁寧に答える時です。","親しい友達だけです。","Kollegin kontrastiert Freund und Kunde.","では、お客様には？"],
 ["inference","変更できるかわからない時、すぐ約束しますか。","いいえ、確認してから連絡します。","いいえ、先に確認します。","はい、必ずできますと言います。","Höflichkeit ist keine Autorisierung zu falscher Zusage.","確認してからご連絡します"]
 ],
 response:["Eine Kundin möchte Terminverschiebung, Verfügbarkeit unklar. Formuliere angemessen förmlich.","承知しました。変更できるか確認してからご連絡します。","ご希望の時間を確認いたします。少々お待ちください。","必ず変更できます。","Formelles Register ohne unbestätigte Zusage."],
 delayed:["Neue Situation: Freund bittet lockere Antwort auf geänderten Treffpunkt, du kannst ihn akzeptieren.","了解、新しい場所に七時に行くね。","わかった。七時に新しい場所で会おう。","承知いたしました。お待ちしております。","Vertraute Beziehung statt Kundenservice."]
}
];
export const p55ScenesD=authored.map(authoredP55);
