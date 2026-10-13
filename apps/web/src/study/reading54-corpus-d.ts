import {authoredP54,type P54RawReading} from "./reading54-types";
/** P54 22–28: interdependent sources and multi-person planning decisions. */
const authored:readonly P54RawReading[]=[
{id:"bike-tour-repair",title:"自転車旅行の前日",genre:"story",unit:"p23:plans",situation:"Drei Freunde ändern nach einer Reparatur ihre Radtour.",purpose:"Reparatur, Machbarkeit und bestätigten Alternativplan verknüpfen",
 paragraphs:[
 ["土曜日、私たちは自転車で湖まで行く予定でした。金曜日の夕方、レナさんの自転車が壊れてしまいました。近くの店に修理を頼みましたが、店員さんは「日曜日までかかるかもしれません」と言いました。","Samstag wollten wir mit dem Fahrrad zum See. Freitagabend ging Renas Fahrrad kaputt. Im Laden bat sie um Reparatur; der Mitarbeiter sagte, es könne bis Sonntag dauern."],
 ["ケンさんは自分の自転車を貸そうとしました。でも、レナさんには少し大きすぎます。そこで三人で相談して、土曜日は電車で湖まで行き、湖の近くを歩くことにしました。","Ken bot sein Fahrrad an, doch es war für Rena zu groß. Die drei besprachen sich und beschlossen, Samstag mit dem Zug zum See zu fahren und dort zu spazieren."],
 ["日曜日に自転車の修理が終わったら、来週、短い自転車旅行をするつもりです。天気予報では来週も晴れるそうですが、まだ予約はしていません。","Wenn die Reparatur am Sonntag fertig wird, wollen sie nächste Woche eine kurze Fahrradtour unternehmen. Der Wetterbericht sagt Sonne voraus, aber noch wurde nichts gebucht."]
 ],words:["kowareru","shuuri","soudan","yotei","yoyaku"],grammar:"てしまいました / すぎる / ことにしました / たら",contrast:"Reparaturprognose für Sonntag ist nicht ein bereits fertiges Fahrrad.",
 questions:[
 ["cause","土曜日に電車で行くのはなぜですか。","レナさんの自転車が壊れて、借りる自転車も大きすぎたからです。","自転車が壊れたからです。","湖に自転車が禁止だからです。","Defekt und ungeeignetes Ersatzrad führen zur Zugentscheidung.","レナさんには少し大きすぎます"],
 ["chronology","三人は修理を頼んだ後で何を決めましたか。","土曜日は電車で湖へ行くことにしました。","電車で行って湖の近くを歩くことにしました。","もう来週の旅行を予約しました。","Erst Reparaturversuch, dann Ersatzplan; nächste Reise noch nicht gebucht.","土曜日は電車で湖まで行き"],
 ["inference","来週の自転車旅行はもう確実ですか。","いいえ、修理が終わるかどうかによります。","いいえ、まだ予定で予約もしていません。","はい、天気が晴れるそうです。","Wetterbericht ist kein Ersatz für Reparatur oder Buchung.","日曜日に自転車の修理が終わったら"]
 ],
 writing:["Neue Szene: Du willst wandern, doch Stiefel sind kaputt; du gehst Samstag in die Stadt und planst Wanderung erst später.","靴が壊れたので、土曜日は町に行きます。直ったら来週山へ行きたいです。","修理に時間がかかるので、今週の山歩きは延期します。","Ursache und möglicher Folgetermin unterscheiden.","靴はもう完全に直りました。"],
 returnCue:["Unbekannte Reise: Kamera kaputt, Fototour entfällt nicht, stattdessen Zeichnen im Park.","カメラが壊れたので、写真の代わりに公園で絵を描くことにしました。","撮影はできませんが、公園に行ってスケッチをします。","Neues Gerät und alternative Aktivität.","公園は必ず閉まっています。"]
},
{id:"workplace-feedback",title:"初めての仕事の報告",genre:"report",unit:"p26:library-project",situation:"Praktikantin verfasst einen Wochenbericht nach einem Fehler.",purpose:"Fehlerentdeckung, selbstständige Korrektur und Rat unterscheiden",
 paragraphs:[
 ["私は今週から会社で実習をしています。月曜日に、お客様の予約時間を表に入力しました。火曜日、先輩が表を確認したところ、一人のお客様の時間が間違っているとわかりました。","Diese Woche begann mein Praktikum. Montag trug ich Kundenbuchungen in eine Tabelle ein. Dienstag stellte eine ältere Kollegin bei der Kontrolle fest, dass eine Zeit falsch war."],
 ["先輩はすぐに私を怒るのではなく、「まず正しい時間を調べて、その後で変更しましょう」と説明しました。私はお客様に電話をして予約時間を確認し、表を編集しました。","Die Kollegin schimpfte nicht, sondern erklärte, man solle zunächst die korrekte Uhrzeit recherchieren und erst danach ändern. Ich rief den Kunden an, bestätigte den Termin und korrigierte die Tabelle."],
 ["金曜日に、何が起きたかを上司に報告しました。上司は「間違いを隠さずに直したのはよかった。でも次は入力した後ですぐ確認してね」と言いました。来週から毎日確認するつもりです。","Freitag meldete ich der Leitung den Ablauf. Sie fand gut, dass der Fehler nicht versteckt, sondern behoben wurde, bat aber um direkte Kontrolle nach Eingabe. Ab nächster Woche will ich täglich prüfen."]
 ],words:["jisshuu","nyuuryoku","kakunin","henshuu","houkoku"],grammar:"たところ / のではなく / てから / つもりです",contrast:"Die Kollegin entdeckt am Dienstag einen Montagfehler; Chefbericht ist Freitag.",
 questions:[
 ["chronology","予約時間の間違いはいつわかりましたか。","火曜日です。","火曜日に先輩が確認した時です。","月曜日に上司が報告しました。","Eingabe Montag, Entdeckung Dienstag, Bericht Freitag.","火曜日、先輩が表を確認したところ"],
 ["cause","なぜお客様に電話しましたか。","正しい予約時間を確認するためです。","間違いを直すために時間を確かめました。","新しい予約を取るためです。","Der Anruf klärt den bestehenden Termin, nicht eine neue Buchung.","予約時間を確認し、表を編集しました"],
 ["speaker","次から入力の後にすぐ確認するように言ったのは誰ですか。","上司です。","上司が言いました。","お客様です。","Das abschließende Feedback stammt von der Leitung.","上司は「間違いを隠さずに直したのはよかった"]
 ],
 writing:["Neue Szene: Du entdeckst einen falschen Namen in der Anwesenheitsliste; erst nach Rückfrage korrigieren, dann melden.","名前が間違っていたので、本人に確認してからリストを直しました。先生にも報告しました。","本人に聞いて正しい名前を確認しました。それからリストを修正しました。","Nicht ohne Bestätigung personenbezogene Daten ändern.","本人に聞かずに勝手に変更しました。"],
 returnCue:["Neuer Fehler: Veranstaltungsadresse im Flyer falsch; Organisator bestätigen lassen, Datei korrigieren.","会場の住所が間違っていたので、主催者に確認してから資料を直しました。","住所を確かめた後、新しい案内を作成しました。","Neuer Fehler und neues Dokument.","案内は間違っていませんでした。"]
},
{id:"rental-request",title:"アパートのお願い",genre:"email",unit:"p23:places",situation:"Mieter schreibt wegen Heizung und dokumentiert vorsichtig den Sachstand.",purpose:"Defektmeldung, vermutete Ursache und höfliche Bitte trennen",
 paragraphs:[
 ["管理人様。いつもお世話になっております。三階の田中です。昨夜から部屋の暖房が使えなくなりました。リモコンの電池を交換してみましたが、まだ動きません。","Sehr geehrter Hausmeister, hier ist Tanaka aus dem dritten Stock. Seit gestern Abend funktioniert meine Heizung nicht. Ich habe probeweise Batterien der Fernbedienung gewechselt, aber sie funktioniert weiterhin nicht."],
 ["原因はまだわかりません。自分で機械を開けると危ないかもしれないので、それ以上は触っていません。明日の午後、修理の人に来てもらうことはできますか。","Die Ursache ist unklar. Weil es gefährlich sein könnte, das Gerät selbst zu öffnen, habe ich es nicht weiter berührt. Könnte morgen Nachmittag jemand zur Reparatur kommen?"],
 ["私も午後二時から五時までは家にいます。その時間が難しければ、別の時間を教えてください。お返事をお待ちしております。","Ich bin zwischen 14 und 17 Uhr zuhause. Falls das nicht passt, teilen Sie bitte einen anderen Termin mit. Ich warte auf Ihre Antwort."]
 ],words:["koshou","koukan","shuuri","shinpai","tsugou"],grammar:"てみました / かもしれないので / てもらう / ければ",contrast:"Batteriewechsel war ein Versuch und keine bestätigte Reparatur.",
 questions:[
 ["evidence","田中さんは何を交換してみましたか。","リモコンの電池です。","リモコンの電池を交換しました。","暖房の機械全部です。","Nur Batterien der Fernbedienung wurden getauscht.","リモコンの電池を交換してみました"],
 ["cause","なぜそれ以上機械に触りませんでしたか。","危ないかもしれないからです。","自分で開けると危険かもしれないからです。","もう直ったからです。","Sicherheitsbedenken und unklarer Defekt, nicht Genesung.","機械を開けると危ないかもしれないので"],
 ["inference","修理の時間はすでに決まっていますか。","いいえ、まだお願いしているだけです。","いいえ、返事を待っています。","はい、明日二時に決まりました。","Verfügbarkeit wird angeboten, nicht bestätigt.","明日の午後、修理の人に来てもらうことはできますか"]
 ],
 writing:["Neue Wohnung: Wasserhahn tropft, Ursache unklar, bitte höflich um Reparatur am Freitag.","水道から水が出続けています。原因はわかりません。金曜日に見ていただけますか。","水道が壊れたようです。金曜日に修理をお願いできますか。","Fehler nennen und Termin erbitten, nicht festlegen.","修理はもう終わりました。"],
 returnCue:["Neues Problem: Fenster schließt nicht; Mieter ist am Montagmorgen zuhause, möchte Termin vereinbaren.","窓が閉まらなくなりました。月曜日の午前中に修理していただけますか。","窓が故障したようです。月曜日の午前なら家にいます。","Anderer Defekt und andere Verfügbarkeit.","月曜日に必ず修理が終わります。"]
},
{id:"school-festival",title:"文化祭のお知らせと返事",genre:"email",unit:"p23:plans",situation:"Schüler organisieren einen Stand und erhalten eine Antwort des Lehrers.",purpose:"Antrag, vorläufige Freigabe und bestätigte Erlaubnis auseinanderhalten",
 paragraphs:[
 ["先生へ。来月の文化祭で、日本語のクイズの店を出したいと思います。三人で問題を作成し、来た人が答えたら小さな景品を渡します。必要な材料は自分たちで用意する予定です。","Sehr geehrte Lehrerin, wir möchten auf dem Schulfest nächsten Monat einen Japanischquizstand betreiben. Drei Schüler erstellen Fragen; Besucher erhalten für Antworten kleine Preise. Materialien bereiten wir selbst vor."],
 ["学校の部屋を一つ使わせてもらえますか。机と椅子は学校のものを借りたいです。まだ参加人数が決まっていないので、場所の広さについても相談したいです。","Dürften wir einen Schulraum verwenden? Tische und Stühle würden wir ausleihen. Da die Teilnehmerzahl noch offen ist, möchten wir über die Größe sprechen."],
 ["先生から「いい考えですね。ただし、部屋の使用には校長先生の許可が必要です。まず計画書を金曜日までに提出してください」と返事がありました。私たちは先に計画書を作ることにしました。","Die Lehrerin antwortete, es sei eine gute Idee, aber Raumbenutzung brauche die Erlaubnis der Schulleitung. Zuerst solle der Plan bis Freitag eingereicht werden. Daher erstellen wir zunächst die Unterlagen."]
 ],words:["seisaku","shitsumon","kyoka","soudan","teisuutsu"],grammar:"たいと思います / てもらえますか / ので / 必要",contrast:"Positives Feedback der Lehrerin ist keine Genehmigung durch die Schulleitung.",
 questions:[
 ["inference","先生の返事で部屋の使用が決まりましたか。","いいえ、校長先生の許可が必要です。","いいえ、まだ許可をもらっていません。","はい、いい考えだと言ったからです。","Lob und Genehmigung sind getrennt.","校長先生の許可が必要です"],
 ["chronology","部屋を使う許可の前に何を提出しますか。","金曜日までに計画書を提出します。","計画書です。","クイズの景品です。","Die Lehrerin fordert zuerst den Plan.","まず計画書を金曜日までに提出してください"],
 ["evidence","クイズの問題を作るのは何人ですか。","三人です。","三人で作ります。","一人です。","Der erste Absatz nennt ausdrücklich drei.","三人で問題を作成し"]
 ],
 writing:["Neuer Fall: Du willst einen Basketballstand am Fest, musst vorher Plan beim Direktor einreichen.","バスケットボールの活動をしたいですが、先に計画書を提出して許可をもらう必要があります。","計画書を出してから、場所を使えるか確認します。","Genehmigung nicht aus bloßem Interesse ableiten.","場所はもう自由に使えます。"],
 returnCue:["Neue Gruppe: Kinderlesung in der Bibliothek, Räume nur nach Genehmigung, Antrag bis Mittwoch.","図書館で子ども向けの朗読会をしたいです。水曜日までに申込書を提出して、許可を待ちます。","部屋を使うには許可が必要なので、まず水曜日に申し込みます。","Neue Institution und Veranstaltung, gleiche Erlaubnislogik.","図書館はすでに許可しました。"]
},
{id:"home-recycling",title:"引っ越しの日のごみの問題",genre:"story",unit:"p23:routine",situation:"Wohnungsgemeinschaft muss am Umzugstag Abfallregeln befolgen.",purpose:"Lokale Regeln, Zuständigkeit und zeitliche Folgen nachvollziehen",
 paragraphs:[
 ["私たちは日曜日に引っ越しました。新しい部屋には段ボール箱がたくさんありました。ユキさんは全部まとめて外に出そうとしましたが、私は建物のごみの規則をまだ読んでいませんでした。","Sonntag zogen wir um. Viele Kartons standen im Zimmer. Yuki wollte alles hinausstellen, aber ich hatte die Müllregeln des Gebäudes noch nicht gelesen."],
 ["管理人さんに聞くと、「紙は水曜日、プラスチックは金曜日です。大きい家具は普通のごみの日には出せません」と教えてくれました。そこで、箱を分別して、紙だけ水曜日に出すことにしました。","Der Hausmeister erklärte: Papier mittwochs, Plastik freitags. Große Möbel dürfen nicht am normalen Mülltag hinausgestellt werden. Also trennten wir die Kartons und beschlossen, Papier erst Mittwoch abzugeben."],
 ["家具を捨てる方法はまだわからなかったので、市のウェブサイトで調べました。先に確認してよかったと思います。もし全部出していたら、ほかの人に迷惑をかけたかもしれません。","Für Möbel recherchierten wir auf der Stadtwebsite. Es war gut, zuerst nachgefragt zu haben. Hätten wir alles hinausgestellt, hätten wir andere womöglich gestört."]
 ],words:["gomi","bunbetsu","suteru","kisoku","shiraberu"],grammar:"ようとしました / と / ことにしました / ていたら",contrast:"Papierfreigabe Mittwoch berechtigt nicht zur Möbelentsorgung.",
 questions:[
 ["evidence","紙のごみは何曜日に出せますか。","水曜日です。","水曜日に出せます。","金曜日です。","Freitag gilt Plastik, Mittwoch Papier.","紙は水曜日、プラスチックは金曜日です"],
 ["chronology","箱を外に出す前に何をしましたか。","管理人さんにごみの規則を聞きました。","ごみの分別のルールを確認しました。","家具を全部捨てました。","Informationsbeschaffung ging der Entscheidung voraus.","管理人さんに聞くと"],
 ["inference","大きい家具を普通のごみの日に出してもいいですか。","いいえ、出せません。","いいえ、別の方法を調べる必要があります。","はい、紙と同じ日に出せます。","Der Hausmeister verbietet Möbel im normalen Rhythmus.","大きい家具は普通のごみの日には出せません"]
 ],
 writing:["Neues Haus: Glas wird montags gesammelt, Papier donnerstags. Informiere Mitbewohner.","ガラスは月曜日、紙は木曜日に出してください。まず分別しましょう。","ごみの規則を確認しました。ガラスと紙は別々の日に出します。","Kategorie und Tag korrekt zusammenführen.","紙もガラスもいつでも出せます。"],
 returnCue:["Neuer Fall: Büromüll; Batterien dürfen nicht in Papierkorb, Sonderbox beim Empfang.","電池は紙のごみと一緒に捨てないでください。受付の箱に入れましょう。","電池は別に集めます。受付の専用箱を使ってください。","Neuer Ort und Gegenstand, gleiche Trennregel.","電池を普通の紙の箱に捨ててください。"]
},
{id:"seasonal-market",title:"週末の市場で見つけたこと",genre:"article",unit:"p25:shopping",situation:"Kurzer Lokalbericht über Marktpreise und Einkauf.",purpose:"Frische, Lagerbestand und Preisänderung aus Bericht interpretieren",
 paragraphs:[
 ["駅の近くの市場では、土曜日の朝に地元の野菜を売っています。今月は雨が多かったため、トマトの入荷が少なくなりました。先週より少し値上げされた店もあります。","Auf dem Markt nahe dem Bahnhof werden samstags morgens lokale Gemüse verkauft. Wegen vielen Regens kamen diesen Monat weniger Tomaten an. Einige Stände erhöhten den Preis gegenüber letzter Woche."],
 ["一方、キャベツはたくさん入荷したので、値下げされたそうです。八百屋さんは「安いからといって、必要以上に買わないでください。新鮮なうちに食べるのがいいですよ」と話していました。","Dagegen wurde viel Kohl geliefert, daher soll der Preis gesunken sein. Der Händler riet, trotz des günstigen Preises nicht mehr als nötig zu kaufen und Gemüse frisch zu essen."],
 ["私はキャベツを一つとトマトを二つ買いました。値段だけでなく、料理に使う量も考えました。帰ってから、買った物とレシートを確認し、夕食の材料を準備しました。","Ich kaufte einen Kohl und zwei Tomaten. Neben dem Preis berücksichtigte ich die benötigte Menge fürs Kochen. Zuhause kontrollierte ich Einkauf und Bon und bereitete die Zutaten fürs Abendessen vor."]
 ],words:["nyuuka","neage","nesage","hitsuyou","zairyou"],grammar:"ため / 一方 / といって / だけでなく",contrast:"Die Preisentwicklung betrifft unterschiedliche Gemüsesorten; ein Mengenrabatt wird nicht behauptet.",
 questions:[
 ["cause","トマトの入荷が減ったのはなぜですか。","雨が多かったからです。","今月雨の日が多かったためです。","キャベツが安かったからです。","Wetter beeinflusst Tomatenlieferung.","雨が多かったため、トマトの入荷が少なく"],
 ["evidence","値下げされたと言われた野菜は何ですか。","キャベツです。","キャベツが安くなったそうです。","トマトです。","Preisrückgang gilt Kohl, Tomaten eher teurer.","キャベツはたくさん入荷したので、値下げされた"],
 ["inference","書いた人は値段だけで買う物を決めましたか。","いいえ、料理に使う量も考えました。","いいえ、必要な量も考えました。","はい、安い物を全部買いました。","Zweites Entscheidungskriterium ist benötigte Menge.","値段だけでなく、料理に使う量も考えました"]
 ],
 writing:["Anderer Markt: Äpfel sind teuer wegen geringer Lieferung, Birnen günstig wegen hoher Lieferung. Vergleiche.","りんごは入荷が少ないので高いですが、梨は多く入荷して安くなりました。","りんごは値上げされ、梨は値下げされたそうです。","Unterschiedliche Artikel und Gründe beibehalten.","りんごも梨も入荷がありません。"],
 returnCue:["Neuer Fall: Konzertkarten knapp und teuer, Museumskarten reichlich und billiger.","コンサートの切符は少なくて値段が高いですが、博物館の切符は安く買えます。","コンサートの券は値上げされましたが、博物館の券は安くなりました。","Anderer Markt, Vergleich in richtigem Richtungssinn.","どちらも同じ値段です。"]
},
{id:"visitor-information",title:"外国からのお客様を案内する",genre:"diary",unit:"p25:directions",situation:"Ein freiwilliger Helfer begleitet eine internationale Besucherin.",purpose:"Sprachbarriere, Wegführung und anschließende eigene Reflexion lesen",
 paragraphs:[
 ["昨日、大学の入口で外国から来たお客様に会いました。その人は日本語を勉強していますが、まだ難しい案内を読むのが苦手だと言いました。私は簡単な言葉で図書館までの道を説明しました。","Gestern traf ich am Universitätseingang eine internationale Besucherin. Sie lernt Japanisch, findet aber schwierige Wegweiser noch schwer zu lesen. Ich erklärte in einfachen Worten den Weg zur Bibliothek."],
 ["最初は「次の交差点で右に曲がってください」と言いました。でも、道が工事中だったので、その道は使えませんでした。そこで、地下道を通る別の行き方を案内しました。","Zuerst sagte ich, sie solle an der nächsten Kreuzung rechts gehen. Wegen Bauarbeiten war diese Straße unpassierbar. Deshalb führte ich sie über eine Unterführung."],
 ["図書館に着いてから、お客様は「ゆっくり話してくれたのでわかりました」と言いました。私はうれしかったですが、最初から工事を確認していれば、もっと早く案内できたと思います。","An der Bibliothek dankte die Besucherin, weil sie die langsame Erklärung verstanden hatte. Ich freute mich, erkannte aber, dass eine vorherige Baustellenkontrolle den Weg schneller gemacht hätte."]
 ],words:["anai","setsumei","kousaten","chikadou","kakunin"],grammar:"と言いました / ので / てから / ていれば",contrast:"Die erste Weganweisung wurde durch Bauarbeiten ungültig und später korrigiert.",
 questions:[
 ["cause","最初の道が使えなかったのはなぜですか。","工事中だったからです。","その道で工事をしていたからです。","お客様が日本語を話せなかったからです。","Sprachstand wirkt auf Erklärung, Baustelle auf Weg.","道が工事中だったので"],
 ["chronology","地下道を案内する前にどんな説明をしましたか。","交差点で右に曲がるように説明しました。","次の交差点で右に曲がると言いました。","図書館に着いてから案内しました。","Zuerst Kreuzung rechts, dann Umleitung.","次の交差点で右に曲がってください"],
 ["inference","書いた人は最初の説明が一番よかったと思っていますか。","いいえ、先に工事を確認すればよかったと思っています。","いいえ、最初から道を確認したかったです。","はい、何も変えませんでした。","Abschließende Reflexion benennt verbesserungsfähige Vorbereitung.","最初から工事を確認していれば"]
 ],
 writing:["Neuer Campus: Haupteingang gesperrt; führe Besucher über Hintereingang und entschuldige Korrektur.","すみません、正面入口は工事中です。後ろの入口から入ってください。","最初の道は通れません。こちらの入口からご案内します。","Wegänderung ohne erfundene andere Baustellendauer.","正面入口は問題なく使えます。"],
 returnCue:["Unbekannter Besucher: Fahrstuhl außer Betrieb, nur Treppe nutzbar. Erkläre kurz und höflich.","エレベーターは故障中ですので、階段をご利用ください。","すみません、今はエレベーターが使えません。階段はこちらです。","Neues Verkehrsmittel im Gebäude und neue Route.","エレベーターはもう直っています。"]
}
];
export const p54ReadingsD=authored.map(authoredP54);
