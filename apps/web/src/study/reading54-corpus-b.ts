import {authoredP54,type P54RawReading} from "./reading54-types";
/** P54 08–14: academic, digital, neighborhood and practical communication. */
const authored:readonly P54RawReading[]=[
{id:"group-presentation",title:"発表の準備と役割",genre:"story",unit:"p26:library-project",
 situation:"Drei Studierende teilen Aufgaben für eine Präsentation auf.",purpose:"Arbeitsfolge und Zuständigkeiten aus einer Erzählung ableiten",
 paragraphs:[
 ["私たちのグループは来週、町の交通について発表します。私は時刻表を調べて、ケンさんは駅で写真を撮ることになりました。アヤさんはその結果をまとめます。みんな仕事が違います。","Unsere Gruppe präsentiert nächste Woche den Stadtverkehr. Ich recherchiere Fahrpläne, Ken macht Bahnhofsfotos und Aya fasst die Ergebnisse zusammen. Die Aufgaben sind unterschiedlich."],
 ["昨日、ケンさんから「駅では一部の場所で写真が禁止だ」と連絡が来ました。そこで、私たちは駅員さんに許可を聞くことにしました。許可がもらえなければ、写真の代わりに自分たちで地図を作ります。","Gestern schrieb Ken, dass Fotografieren in Teilen des Bahnhofs verboten sei. Deshalb wollen wir beim Personal nach Erlaubnis fragen. Wenn wir sie nicht bekommen, erstellen wir statt Fotos eine eigene Karte."],
 ["金曜日までに資料を共有し、土曜日にみんなで説明の練習をします。まだ写真はありませんが、発表を中止する予定はありません。","Bis Freitag teilen wir die Unterlagen und üben am Samstag gemeinsam den Vortrag. Die Fotos fehlen noch, aber eine Absage ist nicht vorgesehen."]
 ],words:["happyou","shiraberu","kyoka","kyouyuu","kinshi"],grammar:"ことになりました / なければ / 代わりに / までに",contrast:"Berichtetes Fotoverbot führt erst zur Nachfrage; keine behauptete Genehmigung.",
 questions:[
 ["speaker","結果をまとめるのは誰ですか。","アヤさんです。","アヤさんがまとめます。","ケンさんです。","Ken sollte fotografieren, Aya fasst zusammen.","アヤさんはその結果をまとめます"],
 ["inference","写真の許可がもらえない時、どうしますか。","自分たちで地図を作ります。","写真の代わりに地図を作ります。","発表を必ず中止します。","Es gibt einen ausgearbeiteten Ersatzplan statt Absage.","許可がもらえなければ、写真の代わりに自分たちで地図を作ります"],
 ["chronology","土曜日の練習の前に何をしますか。","金曜日までに資料を共有します。","先に資料を共有します。","土曜日に写真を撮ることが決まりました。","Freitag ist der verbindliche Abgabezeitpunkt vor dem Üben.","金曜日までに資料を共有し"]
 ],
 writing:["Neue Aufgabe: Eine Gruppe darf im Museum keine Fotos machen und nutzt eigene Zeichnungen. Schreibe zwei passende Sätze.","博物館で写真を撮れなかったので、自分たちで絵を描きました。","写真が禁止だったので、代わりに絵を作りました。","Die Ersatzhandlung gehört der Gruppe; keine Bildrechte behaupten.","博物館が写真を許可しました。"],
 returnCue:["Neue Situation: Ein Forscherteam erhält keine Audioaufnahme-Erlaubnis und erstellt handschriftliche Notizen.","録音の許可がなかったので、代わりにメモを取りました。","録音できなければ、メモを使います。","Quellenart und Ersatzmethode sind neu.","録音はもう公開しました。"]
},
{id:"wrong-attachment",title:"送信したメールの間違い",genre:"email",unit:"p26:library-project",
 situation:"Praktikantin schreibt eine höfliche Korrektur an eine Kollegin.",purpose:"Versand, Fehler und Reparatur anhand zweier Nachrichten ordnen",
 paragraphs:[
 ["佐藤さん、お疲れさまです。午前中に会議の資料を送信しましたが、後で確認したら古いファイルを添付していました。申し訳ありません。新しいファイルはまだ送っていません。","Frau Sato, guten Tag. Am Vormittag habe ich die Besprechungsunterlagen versendet. Bei späterer Kontrolle bemerkte ich, dass eine alte Datei angehängt war. Entschuldigung. Die neue Datei ist noch nicht versandt."],
 ["現在、新しい表を編集しています。数字をもう一度確認してから保存し、午後三時までに送信する予定です。間違ったメールは削除しないでください。変更した部分を比べるために必要です。","Ich bearbeite gerade die neue Tabelle. Nachdem ich die Zahlen kontrolliert habe, werde ich speichern und bis 15 Uhr senden. Bitte löschen Sie die falsche E-Mail nicht; sie wird zum Vergleichen der Änderungen benötigt."],
 ["佐藤さんからは「了解しました。会議は四時からなので、三時に届けば大丈夫です」と返事が来ました。私はまだ作業中ですが、少し安心しました。","Sato schrieb zurück, sie habe verstanden. Die Besprechung sei um vier, eine Lieferung um drei sei ausreichend. Ich arbeite noch, bin aber etwas erleichtert."]
 ],words:["soushin","tenpu","henshuu","kakunin","hozon"],grammar:"たら / てから / までに / ば / まだ",contrast:"Speichern, Anhängen, Senden und Empfangen sind vier getrennte Vorgänge.",
 questions:[
 ["evidence","午前中のメールには何が間違っていましたか。","古いファイルが添付されていました。","古い資料を送ってしまいました。","メールが届きませんでした。","Die Mail wurde gesendet, nur die angehängte Version war falsch.","古いファイルを添付していました"],
 ["chronology","新しい表を送る前に何をしますか。","数字を確認して保存します。","数字を確かめてから保存します。","間違ったメールを削除します。","Der Arbeitsablauf lautet kontrollieren, speichern, absenden; Löschen wird ausdrücklich verneint.","数字をもう一度確認してから保存し"],
 ["inference","佐藤さんは三時までの送信で問題ないと言っていますか。","はい、三時に届けば大丈夫です。","はい、会議は四時からです。","いいえ、会議は二時からです。","Hier ist Ankunft/Empfang bis drei relevant, nicht lediglich Absenden um drei.","三時に届けば大丈夫です"]
 ],
 writing:["Du hast aus Versehen die falsche Seminarfolie angehängt. Entschuldige dich und kündige die neue Version an.","古いスライドを添付してしまいました。すみません。新しいファイルを送ります。","間違った資料を送ってしまいました。確認してから送り直します。","Fehler klar benennen, künftige Reparatur nicht als erledigt darstellen.","新しい資料はもう届きました。"],
 returnCue:["Neue Situation: Eine Bewerbung enthält eine falsche Telefonnummer. Schreibe korrigierende Nachricht.","書類の電話番号が間違っていました。申し訳ありません。修正して送り直します。","電話番号を直してから新しい書類を送ります。","Neues Dokument und personenbezogener Fehler, gleiche Reparaturlogik.","応募を中止しました。"]
},
{id:"neighbors-moving",title:"新しい部屋と近所の人",genre:"diary",unit:"p23:places",
 situation:"Ein Student zieht um und lernt das Haus kennen.",purpose:"Erlebte Ereignisse von Vermutungen und Hilfsangeboten unterscheiden",
 paragraphs:[
 ["私は先週、小さなアパートに引っ越しました。駅まで歩いて十五分ですが、近くにスーパーと図書館があるので便利です。古い部屋より少し狭いのに、明るくて気に入っています。","Letzte Woche zog ich in eine kleine Wohnung. Zum Bahnhof gehe ich 15 Minuten; Supermarkt und Bibliothek sind nah. Obwohl sie etwas enger als die alte ist, gefällt mir die helle Wohnung."],
 ["昨日、隣の部屋の人が階段で荷物を運ぶのを手伝ってくれました。名前を聞いて、お礼を言いました。その人は「この建物ではごみを分別してください」と教えてくれました。","Gestern half mir die Nachbarin auf der Treppe beim Tragen. Ich fragte ihren Namen und bedankte mich. Sie erklärte, dass in diesem Gebäude Müll getrennt werden soll."],
 ["今朝、玄関の前に大きな段ボール箱がありました。誰の箱かまだわかりません。勝手に捨てないで、まず管理人さんに確認しようと思います。","Heute Morgen stand ein großer Karton vor dem Eingang. Wem er gehört, weiß ich noch nicht. Ich werde ihn nicht einfach wegwerfen, sondern erst beim Hausmeister nachfragen."]
 ],words:["benri","tetsudau","bunbetsu","suteru","kakunin"],grammar:"より / のに / てくれました / ないで",contrast:"Ein unbekannter Karton wird nicht automatisch als Abfall eingeordnet.",
 questions:[
 ["cause","新しい部屋が便利なのはなぜですか。","スーパーと図書館が近くにあるからです。","近所に店と図書館があるからです。","古い部屋より広いからです。","Die neue Wohnung ist gerade enger, aber günstig gelegen.","近くにスーパーと図書館があるので便利です"],
 ["speaker","ごみの分別について教えたのは誰ですか。","隣の部屋の人です。","荷物を手伝ってくれた人です。","管理人さんです。","Die Nachbarin gab den Hinweis; der Hausmeister ist erst für spätere Nachfrage vorgesehen.","その人は「この建物ではごみを分別してください」"],
 ["inference","なぜ段ボール箱をすぐ捨てませんか。","誰の箱かわからないからです。","持ち主がわからないので、確認してからにします。","ごみの日が過ぎたからです。","Eigentum ist unbekannt; der Erzähler wartet auf Bestätigung.","誰の箱かまだわかりません"]
 ],
 writing:["Du entdeckst im Wohnheim eine Tasche ohne Namen und willst erst nachfragen.","持ち主がわからないので、捨てずに受付に確認します。","誰のか知らないので、まず管理人さんに聞きます。","Keine fremde Sache ohne Klärung entsorgen.","誰のか知らないので捨てました。"],
 returnCue:["Neuer Fall: Ein Fahrrad steht vor einem Laden, Eigentümer unbekannt; du informierst Personal.","この自転車の持ち主がわからないので、店員さんに聞きます。","誰の自転車か確認してから対応します。","Neue Sache, Ort und Ansprechpartner.","自転車をもう持って帰りました。"]
},
{id:"public-course",title:"市民講座の参加案内",genre:"notice",unit:"p25:appointment",
 situation:"Städtischer Aushang zur Anmeldung für einen Kochkurs.",purpose:"Kosten, Anmeldung und Platzgarantie differenzieren",
 paragraphs:[
 ["市民センターで来月、週末の料理講座を開きます。初心者も参加できます。毎週土曜日、午前十時から十二時までです。材料費は一回五百円で、授業料は無料です。","Das Bürgerzentrum bietet nächsten Monat einen Wochenend-Kochkurs auch für Anfänger an. Er findet jeden Samstag von 10 bis 12 Uhr statt. Zutaten kosten pro Einheit 500 Yen, Unterricht ist kostenlos."],
 ["参加を希望する人は、今月二十五日までにウェブサイトから申し込んでください。定員は十二人です。申し込みを送信しただけでは、参加はまだ決まりません。三日以内に確認のメールを送ります。","Interessierte müssen sich bis zum 25. des Monats online anmelden. Maximal zwölf Personen können teilnehmen. Allein das Absenden bestätigt noch keinen Platz; innerhalb von drei Tagen kommt eine Bestätigungsmail."],
 ["食べ物に苦手な材料がある人は、申し込みの時に書いてください。講座では、使う材料を先に説明してから料理を始めます。","Wer bestimmte Zutaten nicht verträgt oder nicht mag, soll dies bei der Anmeldung angeben. Vor dem Kochen werden die verwendeten Zutaten erklärt."]
 ],words:["moushikomi","sanka","muryou","zairyou","soushin","kakunin"],grammar:"までに / だけでは / てから / 以内",contrast:"Kostenloser Unterricht bedeutet nicht kostenloses Material; Absenden bedeutet nicht Zulassung.",
 questions:[
 ["evidence","講座には全くお金がかかりませんか。","いいえ、材料費は一回五百円です。","いいえ、授業料は無料ですが材料費がかかります。","はい、すべて無料です。","An zwei Preisbestandteile gebunden: Unterricht frei, Material nicht.","材料費は一回五百円で、授業料は無料です"],
 ["inference","申し込みを送信したら、すぐ参加が決まりますか。","いいえ、確認のメールを待ちます。","いいえ、送信だけでは決まりません。","はい、送信すれば必ず参加できます。","Der Aushang verneint die automatische Zusage.","送信しただけでは、参加はまだ決まりません"],
 ["chronology","料理を始める前に何を説明しますか。","使う材料です。","料理に使う材料を説明します。","講座が終わってから材料を説明します。","説明 erfolgt vor dem Kochen.","使う材料を先に説明してから"]
 ],
 writing:["Anderes Angebot: Ein Zeichenkurs ist gratis, Material kostet 200 Yen. Formuliere den Hinweis.","絵の講座は無料ですが、材料費は二百円です。","授業料はかかりませんが、材料に二百円かかります。","Kostenbestandteile klar getrennt nennen.","絵の講座はすべて無料です。"],
 returnCue:["Neuer Kontext: Eintritt zur Ausstellung gratis, Audiogerät kostet 300 Yen; Registrierung bestätigt keinen Platz.","入場は無料ですが、音声ガイドは三百円です。申し込みだけでは予約は決まりません。","展示会は無料で入れますが、ガイドは有料です。","Andere Einrichtung und anderer optionaler Preis.","申し込めば必ず席があります。"]
},
{id:"rain-plan",title:"公園清掃の連絡",genre:"message",unit:"p23:plans",
 situation:"Freiwilligengruppe stimmt wetterabhängige Parkreinigung ab.",purpose:"Bedingung, Änderung und Ankündigungsstatus erkennen",
 paragraphs:[
 ["来週の日曜日、私たちは公園でごみを拾う活動をします。集合は朝九時、北の入口です。参加する人は手袋と水を持ってきてください。ごみ袋はこちらで用意しておきます。","Nächsten Sonntag sammelt unsere Gruppe Müll im Park. Treffpunkt ist um neun am Nordeingang. Teilnehmer sollen Handschuhe und Wasser mitbringen; Müllbeutel werden bereitgestellt."],
 ["ただし、天気予報では日曜日の朝に強い雨が降るかもしれないそうです。安全のため、雨が強ければ活動を延期して、次の日曜日に行います。小さい雨なら予定どおり始めます。","Die Prognose berichtet möglicherweise starken Regen am Sonntagmorgen. Bei starkem Regen verschieben wir aus Sicherheitsgründen auf den Folgesonntag; bei leichtem Regen beginnen wir planmäßig."],
 ["最終的な予定は土曜日の午後六時にグループのページで公開します。それまでは、別の日に変更されたと決めつけないでください。","Der endgültige Plan wird Samstag um 18 Uhr auf der Gruppenseite veröffentlicht. Vorher sollte niemand annehmen, dass der Termin bereits geändert ist."]
 ],words:["shugo","sanka","yobou","enki","koukai","gomi"],grammar:"ておく / かもしれないそう / ければ / なら",contrast:"Wetterprognose ist unsicher; Entscheidungsveröffentlichung erst Samstagabend.",
 questions:[
 ["evidence","活動の最終予定はいつわかりますか。","土曜日の午後六時です。","土曜日の夕方六時です。","日曜日の九時です。","Sonntag neun ist Treffzeit, Samstag sechs Veröffentlichungszeit.","土曜日の午後六時にグループのページで公開します"],
 ["cause","強い雨の場合、なぜ活動を延期しますか。","安全のためです。","安全を守るためです。","手袋がないからです。","Die Bedingung ist Regenintensität, Grund ist Sicherheit.","安全のため、雨が強ければ活動を延期して"],
 ["inference","雨が少し降る時は活動をやめますか。","いいえ、予定どおり始めます。","いいえ、小さい雨なら始めます。","はい、必ず延期します。","Die Entscheidung unterscheidet starken und leichten Regen.","小さい雨なら予定どおり始めます"]
 ],
 writing:["Du organisierst eine Wanderung: nur bei Schnee wird verschoben, Entscheidung Freitag. Teile dies mit.","雪が降ったら延期します。最終予定は金曜日に知らせます。","雪が強い場合は延期します。金曜日に予定を公開します。","Bedingung und angekündigte spätere Entscheidung nicht als bereits erfolgt ausgeben.","もう延期することが決まりました。"],
 returnCue:["Neue Situation: Fahrradkurs entfällt nur bei Sturm; verbindliche Nachricht kommt Donnerstag.","強い風なら自転車の講座を延期します。木曜日に知らせます。","嵐の場合は延期して、木曜日に最終予定を発表します。","Neues Wetter und neuer Kurstyp.","木曜日の活動は中止です。"]
},
{id:"lost-wallet",title:"財布が見つかった日",genre:"story",unit:"p25:lostfound",
 situation:"Ein Reisender sucht im Bahnhof nach seiner Geldbörse.",purpose:"Suchvorgang, Fundort und Kontaktfolge lesen",
 paragraphs:[
 ["土曜日、私は友達と映画を見る予定でした。駅で切符を買おうとした時、財布がないことに気がつきました。かばんとコートを調べましたが、どこにも見つかりませんでした。","Samstag wollte ich mit einem Freund ins Kino. Beim Fahrkartenkauf am Bahnhof bemerkte ich, dass die Geldbörse fehlte. Ich suchte in Tasche und Mantel, fand sie aber nicht."],
 ["私は駅の受付で「茶色い財布の落とし物はありませんか」と聞きました。係の人は「今は届いていませんが、見つかったら連絡します」と言いました。名前と電話番号を紙に書きました。","Am Bahnschalter fragte ich nach einer gefundenen braunen Geldbörse. Das Personal sagte, derzeit sei sie nicht abgegeben, man werde aber bei Fund anrufen. Ich hinterließ Namen und Telefonnummer."],
 ["午後、駅から電話がありました。財布は電車の中で見つかったそうです。取りに行ってから友達に連絡しました。映画には間に合いませんでしたが、財布が戻って安心しました。","Nachmittags rief der Bahnhof an. Die Geldbörse wurde wohl im Zug gefunden. Ich holte sie ab und informierte meinen Freund. Für den Film war es zu spät, aber ich war erleichtert, sie wiederzuhaben."]
 ],words:["sagasu","mitsukaru","uketsuke","maniau","anshin"],grammar:"とした時 / ありませんか / たら / てから / そうです",contrast:"Im ersten Gespräch war die Geldbörse nicht gefunden; erst später kommt Fundmeldung.",
 questions:[
 ["chronology","駅から電話が来た後、まず何をしましたか。","財布を取りに行きました。","財布を受け取りに行きました。","映画を見に行きました。","Zuerst holen, dann Freund informieren; Film wurde verpasst.","取りに行ってから友達に連絡しました"],
 ["evidence","財布はどこで見つかったそうですか。","電車の中です。","電車の中で見つかったそうです。","映画館です。","Die Fundinformation stammt aus dem Anruf.","財布は電車の中で見つかったそうです"],
 ["inference","この人は映画を見られましたか。","いいえ、映画には間に合いませんでした。","いいえ、映画を見る時間に遅れました。","はい、財布が見つかったからです。","Gefundener Gegenstand beseitigt nicht automatisch den verpassten Film.","映画には間に合いませんでした"]
 ],
 writing:["Du verlierst dein Telefon im Bus; es wurde noch nicht abgegeben. Schreibe höfliche Nachfrage.","すみません、黒い携帯電話の落とし物はありませんか。","バスで携帯電話をなくしました。届いていませんか。","Nicht behaupten, der Gegenstand sei bereits gefunden.","携帯電話はもう見つかりました。"],
 returnCue:["Neuer Fall: Ein Freund hat eine Jacke im Café liegenlassen, der Laden soll bei Fund anrufen.","カフェで上着を忘れました。見つかったら連絡していただけますか。","上着が届いたら電話してください。","Neuer Ort und Gegenstand, bedingter Kontakt bleibt.","上着はもう取りに行きました。"]
},
{id:"museum-choice",title:"博物館で何を見ますか",genre:"article",unit:"p25:directions",
 situation:"Kurzer Magazintext vergleicht Besucherprogramme in einem Museum.",purpose:"Kosten, Dauer und Interessengruppen sachbezogen vergleichen",
 paragraphs:[
 ["町の博物館には三つのコースがあります。歴史コースは九十分で、昔の町の生活を紹介します。科学コースは一時間で、小さな実験を見ることができます。子ども向けの短いコースは三十分です。","Das Stadtmuseum hat drei Rundgänge: Geschichte dauert 90 Minuten und zeigt das Leben früher, Wissenschaft eine Stunde mit kleinen Experimenten, die kurze Kindertour 30 Minuten."],
 ["入場料はすべて同じですが、科学コースだけは事前の予約が必要です。土曜日は混雑するので、できれば平日に行くといいでしょう。受付で各コースの開始時間を確認できます。","Der Eintritt kostet überall gleich viel; nur der Wissenschaftsrundgang benötigt eine Reservierung. Samstag ist voll, daher ist ein Werktag zu empfehlen. Startzeiten kann man am Empfang prüfen."],
 ["私は来週、妹と行きます。妹は科学が好きですが、まだ予約していません。もし予約が取れなかったら、歴史コースを見るつもりです。","Ich gehe nächste Woche mit meiner Schwester hin. Sie mag Wissenschaft, aber wir haben noch nicht reserviert. Wenn keine Buchung möglich ist, sehen wir die Geschichtstour."]
 ],words:["yoyaku","kakunin","konzatsu","shoukai","hitsuyou"],grammar:"だけ / ので / といい / もし〜たら",contrast:"Präferenz für Wissenschaft ist keine vorhandene Reservierung.",
 questions:[
 ["evidence","予約が必要なのはどのコースですか。","科学コースだけです。","科学コースです。","三つ全部です。","Es steht ausdrücklich だけ.","科学コースだけは事前の予約が必要です"],
 ["inference","予約ができなかった場合、二人は何を見ますか。","歴史コースを見ます。","歴史コースを見るつもりです。","必ず科学コースを見ます。","Der Ersatzplan ist eine Bedingung.","予約が取れなかったら、歴史コースを見る"],
 ["cause","土曜日より平日がすすめられるのはなぜですか。","土曜日は混雑するからです。","土曜日は人が多いからです。","科学コースが無料だからです。","Der Hinweis ist Besucherandrang, nicht Preisunterschied.","土曜日は混雑するので"]
 ],
 writing:["Anderer Ort: Ein Aquarium bietet zwei Touren, die lange erfordert Reservierung. Empfiehl Plan B.","長いコースは予約が必要です。取れなかったら短いコースを見ましょう。","予約できない場合は短いコースに参加しましょう。","Reservierung und tatsächliche Verfügbarkeit getrennt halten.","予約がなくても長いコースに必ず入れます。"],
 returnCue:["Neues Angebot: Drei Stadtführungen; nur Abendtour reservierungspflichtig, bei Ausfall Morgentour wählen.","夜のツアーだけ予約が必要です。取れなければ朝のツアーに参加します。","夜の予約ができなかったら朝の見学に行きます。","Neuer Besuchsort und andere Tourzeit.","三つのツアーはすべて無料で予約不要です。"]
}
];
export const p54ReadingsB=authored.map(authoredP54);
