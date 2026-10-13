import {authoredP54,type P54RawReading} from "./reading54-types";
/** P54 29–35: cumulative connected A2 reading with longer multi-paragraph developments. */
const authored:readonly P54RawReading[]=[
{id:"international-festival",title:"国際交流会の一週間",genre:"story",unit:"p26:weekend-switch",situation:"Freiwillige organisieren über mehrere Tage eine kulturelle Begegnung.",purpose:"Aufgaben, Änderungen, ungeklärte Genehmigung und Ergebnis über vier Abschnitte verbinden",
 paragraphs:[
 ["大学の国際交流会は来週の土曜日です。私たち五人は、小さな展示と日本語の会話コーナーを準備しています。最初の会議では、私は会場の案内を作り、マリさんは参加者の申し込みを確認することになりました。","Die internationale Begegnung an der Uni ist kommenden Samstag. Fünf von uns bereiten eine kleine Ausstellung und einen Japanisch-Gesprächsbereich vor. Ich erstelle die Wegführung, Mari kontrolliert Anmeldungen."],
 ["火曜日、会場の大きな部屋が使えなくなったと連絡がありました。まだ原因はわかりませんでしたが、担当の先生に相談すると、小さい部屋なら使えるかもしれないと言われました。ただし、正式な許可はまだ出ていません。","Dienstag kam die Nachricht, der große Raum sei nicht verfügbar. Die Ursache blieb unklar. Eine Lehrkraft meinte, der kleine Raum könnte nutzbar sein, jedoch lag noch keine offizielle Genehmigung vor."],
 ["水曜日に計画書を提出し、木曜日の朝、やっと許可をもらいました。小さい部屋では三十人しか入れないので、申し込み済みの人を先に案内することにしました。まだ申し込んでいない人には、次の交流会を紹介します。","Mittwoch reichten wir den Plan ein; Donnerstagmorgen erhielten wir die Genehmigung. Im kleineren Raum ist nur Platz für 30, daher laden wir zuerst angemeldete Personen ein. Andere verweisen wir auf das nächste Treffen."],
 ["金曜日、私たちは新しい会場の地図を共有しました。土曜日には無事に会が行われ、参加者から「説明が丁寧で安心しました」という声を聞きました。準備は大変でしたが、役割を分けてよかったです。","Freitag teilten wir die neue Raumkarte. Samstag fand die Begegnung erfolgreich statt; Gäste lobten die klare Anleitung. Die Vorbereitung war aufwendig, aber Aufgabenteilung half."]
 ],words:["sanka","moushikomi","kyoka","teinei","kyouyuu","anshin"],grammar:"ことになりました / かもしれない / しか〜ない / てよかった",contrast:"Dienstag war der kleine Raum nur eine Möglichkeit; Donnerstag die Genehmigung.",
 questions:[
 ["chronology","小さい部屋を使う許可をもらったのはいつですか。","木曜日の朝です。","水曜日に計画書を出した次の日です。","火曜日に相談した時です。","Beratung und Genehmigung geschahen an verschiedenen Tagen.","木曜日の朝、やっと許可をもらいました"],
 ["cause","まだ申し込んでいない人を次の会に案内するのはなぜですか。","小さい部屋には三十人しか入れないからです。","会場に人数の制限があるからです。","参加者が全員来なかったからです。","Die neue Kapazitätsgrenze motiviert die Auswahl.","三十人しか入れないので"],
 ["inference","火曜日には小さい部屋で会をすることが決まっていましたか。","いいえ、正式な許可はまだありませんでした。","いいえ、使えるかもしれないという話だけでした。","はい、許可をもらいました。","Hörensagen über Möglichkeit ist keine Genehmigung.","正式な許可はまだ出ていません"]
 ],
 writing:["Andere Veranstaltung: Der große Konzertsaal ist gesperrt, kleines Zimmer erst nach Antrag genehmigt; Gruppe informiert nach tatsächlicher Bestätigung.","最初は小さい部屋を使えるかわかりませんでしたが、許可をもらってから新しい場所を知らせました。","計画書を提出し、許可が出た後で会場を変更しました。","Nicht vor der Genehmigung eine feste Zusage behaupten.","相談しただけで許可が決まりました。"],
 returnCue:["Unbekannter Fall: Museumsworkshop wechselt in kleinen Raum, höchstens 15 Plätze; spätere Besucher erhalten anderen Termin.","新しい部屋には十五人しか入れないので、先に申し込んだ人を案内します。","人数に制限があるので、ほかの人には次の講座を紹介します。","Andere Institution, Teilnehmerzahl und Terminfolge.","十五人以上でも全員入れます。"]
},
{id:"community-book-drive",title:"本を届けるまで",genre:"story",unit:"p26:library-project",situation:"Nachbarschaft sammelt Bücher für eine kleine Leseecke.",purpose:"Absicht, Sachprüfung, Verzögerung und tatsächliche Übergabe über mehrere Tage rekonstruieren",
 paragraphs:[
 ["私の町では、子どもたちのために小さな読書コーナーを作ることになりました。最初は図書館から古い本をもらう予定でしたが、図書館には必要な本があまりありませんでした。それで、近所の人たちに協力をお願いしました。","In meiner Stadt sollte eine Leseecke für Kinder entstehen. Zuerst wollte man ältere Bücher aus der Bibliothek holen, doch dort gab es zu wenige passende Bücher. Deshalb bat die Gruppe Nachbarn um Mithilfe."],
 ["一週間で三十冊集まりました。しかし、全部をすぐ子どもたちに渡せるわけではありません。破れている本や、内容が難しすぎる本もあったからです。私たちは本を確認して、使える本を二十冊選びました。","Innerhalb einer Woche kamen 30 Bücher zusammen. Nicht alle konnten sofort weitergegeben werden: Manche waren zerrissen oder sprachlich zu schwierig. Nach Sichtung wählte die Gruppe 20 geeignete aus."],
 ["月曜日に本を運ぶ予定でしたが、車が故障したため、配達を水曜日に延期しました。運転できる人を探して、火曜日の夜に新しい予定をみんなと共有しました。待っている人には、理由も説明しました。","Der Transport war Montag geplant, wurde aber wegen einer Autopanne auf Mittwoch verschoben. Die Gruppe suchte einen Fahrer und teilte Dienstagabend den neuen Plan. Wartenden erklärte sie den Grund."],
 ["水曜日の午後、本は無事に届きました。子どもたちは喜んでいましたが、まだ読書コーナーの準備は終わっていません。来週、本棚を置いてから使い始める予定です。","Mittwochnachmittag kamen die Bücher an. Die Kinder freuten sich, doch die Leseecke ist noch nicht fertig. Nächste Woche sollen Regale aufgestellt werden, bevor sie benutzt wird."]
 ],words:["onegai","kakunin","shuuri","enki","haitatsu","yorokobu"],grammar:"ことになりました / わけではありません / ため / てから",contrast:"30 gesammelt, 20 ausgewählt, Mittwoch geliefert, Leseecke noch nicht geöffnet.",
 questions:[
 ["evidence","集まった本の中から何冊を選びましたか。","二十冊です。","使える本を二十冊選びました。","三十冊全部です。","Sammlung ist nicht identisch mit geeigneter Auswahl.","使える本を二十冊選びました"],
 ["cause","なぜ配達は水曜日になりましたか。","車が故障したからです。","運ぶ車が壊れたためです。","子どもたちが本を読みたくなかったからです。","Autoausfall ist der angegebene Grund.","車が故障したため、配達を水曜日に延期しました"],
 ["inference","水曜日に読書コーナーを使えるようになりましたか。","いいえ、まだ本棚を置く必要があります。","いいえ、準備が終わっていません。","はい、本が届いたから全部終わりました。","Lieferung ist nicht Eröffnung.","まだ読書コーナーの準備は終わっていません"]
 ],
 writing:["Neue Sammelaktion: 50 Jacken, 35 geeignet, Lieferung wegen Busproblemen Donnerstag. Gib sachlichen Bericht.","五十着集まりましたが、使えるのは三十五着です。バスの問題で配達は木曜日に延期しました。","集めた服を確認して三十五着選びました。木曜日に届ける予定です。","Gezählt, geprüft und geliefert sind drei verschiedene Stufen.","五十着全部をもう渡しました。"],
 returnCue:["Unbekannte Sachspendenaktion: 40 Hefte gesammelt, 25 brauchbar; Ausgabestart erst nach Regaleinbau.","ノートは四十冊集まりましたが、使えるのは二十五冊です。棚を置いてから配ります。","二十五冊を選びました。まだ準備が終わっていないので配っていません。","Neue Gegenstände, Zahlen und Status.","四十冊はもう全部配りました。"]
},
{id:"university-collaboration",title:"研究発表の三つの資料",genre:"report",unit:"p26:library-project",situation:"Studiengruppe vergleicht drei Quellen zum Campusverkehr.",purpose:"Unterschiedliche Informationsquellen, zeitliche Gültigkeit und begründete Korrektur verstehen",
 paragraphs:[
 ["大学までの交通について調べるため、私たちは三つの資料を集めました。一つ目は去年の時刻表、二つ目は今月の交通情報、三つ目は学生が書いた短いアンケートです。資料によって内容が違いました。","Für ein Projekt zum Campusverkehr sammelten wir drei Quellen: einen alten Fahrplan, aktuelle Verkehrsinformation und eine kurze Studierendenumfrage. Ihre Angaben unterschieden sich."],
 ["去年の時刻表には「八時十五分に出発」と書いてありました。しかし、今月の案内では「工事のため、八時半に変更」となっています。アンケートには「朝のバスは混雑する」という意見が多くありましたが、これは出発時間を示す資料ではありません。","Der alte Plan nennt Abfahrt 8:15, der aktuelle Bauhinweis 8:30. In der Umfrage sagen viele, Busse seien morgens überfüllt; sie nennt aber keine verbindlichen Abfahrtszeiten."],
 ["最初、私たちの発表には八時十五分と書いてしまいました。先生が「情報が古いかもしれません」と教えてくれたので、もう一度調べました。その後、古い時間を削除し、新しい時間に直しました。","Zunächst stand in der Präsentation 8:15. Die Lehrerin warnte, die Angabe könne veraltet sein. Nach erneuter Recherche ersetzten wir die alte durch die aktuelle Uhrzeit."],
 ["発表では、どの資料から情報を得たのかを説明することにしました。「バスは必ず混雑する」とは言わず、「多くの学生が混雑すると答えました」と言います。","In der Präsentation sollen die Quellen offengelegt werden. Statt zu behaupten, Busse seien immer voll, berichten wir, dass viele Studierende dies in der Umfrage angaben."]
 ],words:["jikokuhyou","koutsuu","konzatsu","kakunin","sakujo","happyou"],grammar:"ため / と書いてありました / かもしれない / とは言わず",contrast:"Aktueller Fahrplan ist Zeitquelle; Befragung bietet nur berichtete Wahrnehmungen.",
 questions:[
 ["evidence","今月の案内によると、バスは何時に出発しますか。","八時半です。","八時三十分です。","八時十五分です。","Aktuelle Meldung hat Vorrang vor Vorjahresplan.","八時半に変更"],
 ["cause","発表の出発時間を直したのはなぜですか。","去年の情報が古かったからです。","先生に言われて新しい案内を確認したからです。","アンケートで八時半と書いてあったからです。","Befragung enthält keine Uhrzeit, nur Meinungen über Gedränge.","情報が古いかもしれません"],
 ["inference","アンケートからバスが毎朝必ず混雑すると言えますか。","いいえ、多くの学生の意見だとしか言えません。","いいえ、学生がそう答えたという情報です。","はい、全員が必ず混雑すると証明しました。","Befragte Meinungen sind weder Zeitmessung noch ausnahmslose Regel.","多くの学生が混雑すると答えました"]
 ],
 writing:["Neue Forschung: Ein alter Websiteeintrag nennt 10 Uhr, neue amtliche Bekanntmachung 11 Uhr, Befragung sagt nur es sei spät. Formuliere korrekt.","古いサイトには十時とありますが、新しい案内では十一時です。アンケートは時間を証明しません。","最新の案内によると十一時です。学生の意見とは区別します。","Aktuelle offizielle Zeit nicht mit subjektiver Befragung vermischen.","アンケートで十一時が必ず証明されました。"],
 returnCue:["Unbekannte Quellenlage: Altes Museumblatt 15 Uhr, aktuelle Website 16 Uhr, Besucher vermuten früheren Schluss.","古い案内には十五時とありますが、今のサイトには十六時と書いてあります。","最新情報によると十六時です。来館者の意見だけでは決められません。","Anderer Sachbereich und neue Zeiten.","古い十五時が必ず正しいです。"]
},
{id:"family-visit",title:"祖母を訪ねるまでの連絡",genre:"story",unit:"p26:weekend-switch",situation:"Geschwister koordinieren den Besuch bei der Großmutter trotz Zugausfall.",purpose:"Mehrere Rollen, Alternativen und bestätigte Entscheidung rekonstruieren",
 paragraphs:[
 ["来月、私は弟と祖母に会いに行く予定です。祖母は遠い町に住んでいるので、いつもは電車で行きます。今回は弟が学校の試験を受けるため、土曜日の朝には出発できません。","Nächsten Monat wollen mein Bruder und ich Großmutter besuchen. Gewöhnlich fahren wir wegen der Entfernung Zug. Diesmal kann der Bruder wegen einer Schulprüfung Samstagmorgen nicht los."],
 ["最初は土曜日の夕方に出発して、夜に着こうと思いました。ところが、駅のサイトを見ると、工事で夕方の電車が中止になっていました。夜行バスも調べましたが、席はもう全部予約されていました。","Zunächst planten wir die Abfahrt am Samstagabend. Dann sahen wir auf der Bahnhofwebsite, dass der Abendzug wegen Bauarbeiten ausfällt. Der Nachtbus war ebenfalls bereits ausgebucht."],
 ["弟は「日曜日の朝なら出発できるよ」と言いました。私は祖母に電話して、日曜日の午後に着いてもいいか聞きました。祖母は「急がなくていいから、気をつけて来てね」と答えました。","Der Bruder sagte, sonntagmorgens könne er fahren. Ich rief Großmutter an und fragte, ob eine Ankunft sonntagnachmittags passe. Sie sagte, wir sollten uns nicht beeilen und vorsichtig anreisen."],
 ["それで、日曜日の朝の電車を予約しました。最初の予定より短い時間しか一緒に過ごせませんが、祖母に会えるので楽しみにしています。","Wir buchten deshalb den Zug am Sonntagmorgen. Zwar bleibt weniger gemeinsame Zeit als ursprünglich, aber wir freuen uns auf den Besuch."]
 ],words:["shuppatsu","chuushi","yoyaku","katamichi","tanoshimi"],grammar:"ため / ところが / なら / しか〜ない",contrast:"Samstagabend wurde zunächst geplant, Sonntagmorgen nach Absprache gebucht.",
 questions:[
 ["cause","弟が土曜日の朝に出発できないのはなぜですか。","学校の試験があるからです。","試験を受けるためです。","祖母の都合が悪いからです。","Grund liegt in Prüfung, nicht Großmutters Wunsch.","弟が学校の試験を受けるため"],
 ["chronology","日曜日の電車を予約する前に誰に電話しましたか。","祖母です。","おばあさんに電話しました。","駅員さんです。","Die Absprache mit Großmutter ging der Buchung voraus.","私は祖母に電話して"],
 ["inference","二人は祖母と過ごす時間が長くなりますか。","いいえ、前より短くなります。","いいえ、短い時間しか過ごせません。","はい、日曜日に出発するからです。","Letzter Absatz stellt verkürzten Aufenthalt fest.","短い時間しか一緒に過ごせません"]
 ],
 writing:["Neuer Familienbesuch: Samstag wegen Arbeit unmöglich, Sonntag Zug erst nach Bestätigung durch Tante buchen.","土曜日は仕事があるので、日曜日に行けるか叔母に聞いてから電車を予約します。","叔母に日曜日の予定を確認してから切符を買います。","Zusage vor Buchung und Ursache beachten.","確認しなくても土曜日に出発しました。"],
 returnCue:["Neue Reise: Nach Zugausfall fragt jemand den Freund, ob Montagmorgen passt, und bucht danach Bus.","電車が中止になったので、月曜日の朝でもいいか友達に聞いてからバスを予約しました。","友達と予定を確認して、月曜日のバスにしました。","Neue Beziehung, Verkehrsmittel und Terminfolge.","友達に聞く前に必ず予約が決まりました。"]
},
{id:"repair-clinic-comparison",title:"二つの予約を同じ日に",genre:"diary",unit:"p25:appointment",situation:"Person koordiniert Geräteabholung und Arzttermin, beide mit unterschiedlichen Sicherheiten.",purpose:"Fristen, Zusagen und Wahrscheinlichkeiten aus vier Absätzen auswerten",
 paragraphs:[
 ["今週の水曜日、私は二つの用事がありました。一つは壊れたパソコンを店から受け取ること、もう一つは午後に病院で診察を受けることです。病院は三時に予約してありました。","Diesen Mittwoch hatte ich zwei Dinge vor: den reparierten Computer im Laden abzuholen und am Nachmittag zum Arzt zu gehen. Der Arzttermin war für 15 Uhr fest gebucht."],
 ["火曜日、修理店から「パソコンは水曜日の午前中に直る予定です」と連絡が来ました。でも、「必ず午前中に渡せます」とは言いませんでした。私は、診察の前に行けるか心配になりました。","Dienstag meldete der Reparaturshop, der Rechner solle Mittwochvormittag fertig werden. Eine garantierte Übergabe am Vormittag wurde nicht zugesagt. Ich machte mir Sorgen, ob es vor dem Arzttermin klappt."],
 ["そこで、病院の予約は変更せず、修理店に電話して「木曜日に受け取っても大丈夫ですか」と聞きました。店員さんは「はい、木曜日でもかまいません」と答えました。私は安心して病院へ行きました。","Daher ließ ich den Arzttermin unverändert und fragte den Laden, ob Donnerstag als Abholung passe. Das Personal stimmte zu. Erleichtert ging ich zum Arzt."],
 ["木曜日に店へ行くと、パソコンは修理が終わっていました。受け取る前に店員さんと動作を確認し、問題がないことがわかりました。急いで取りに行かなくてよかったと思いました。","Donnerstag war die Reparatur fertig. Vor Übergabe prüfte ich mit dem Personal die Funktion und bestätigte, dass sie problemlos war. Ich war froh, nicht übereilt gefahren zu sein."]
 ],words:["shuuri","yoyaku","henkou","kakunin","anshin","shinpai"],grammar:"予約してありました / 予定です / とは言いませんでした / てもかまいません",contrast:"Feste Arztbuchung und unverbindliche Reparaturprognose haben unterschiedliche Gewissheit.",
 questions:[
 ["evidence","確実に予約してあったのは何ですか。","病院の診察です。","三時の病院の予約です。","パソコンの受け取りです。","Nur Arzttermin wird als bestehende Buchung beschrieben.","病院は三時に予約してありました"],
 ["chronology","パソコンを受け取る前に何を確認しましたか。","動作を確認しました。","パソコンが問題なく動くことです。","病院の新しい予約時間です。","Funktionsprüfung erfolgte vor der tatsächlichen Übergabe.","受け取る前に店員さんと動作を確認し"],
 ["inference","水曜日の修理店の連絡は午前中の受け取りを保証しましたか。","いいえ、修理が終わる予定だけでした。","いいえ、必ず渡せるとは言っていません。","はい、午前中に必ず受け取れると言いました。","予定と verbindlicher Abholung unterscheiden.","必ず午前中に渡せますとは言いませんでした"]
 ],
 writing:["Neue Person: Fest gebuchter Zug um 14 Uhr und unsichere Paketlieferung vormittags; Abholung stattdessen Freitag vereinbaren.","電車は二時に予約していますが、荷物が午前中に届くかはわかりません。金曜日に受け取ってもいいですか。","配達が確実ではないので、受け取りを金曜日に変更したいです。","Sichere Buchung und unsichere Lieferung getrennt halten.","荷物は必ず午前中に届きました。"],
 returnCue:["Neuer Fall: Geplante Bibliotheksbuchlieferung Dienstag unsicher, Prüfung Mittwoch fest. Abholung Donnerstag.","本が火曜日に届くかはまだわかりませんが、試験は水曜日に決まっています。木曜日に受け取ります。","試験の予約は変更せず、本は木曜日に受け取ることにしました。","Neue Dinge und Daten, gleiche Gewissheitsunterschiede.","火曜日に本は必ず届きました。"]
},
{id:"language-exchange",title:"日本語交流会で学んだこと",genre:"report",unit:"p23:introduction",situation:"Lernender reflektiert Fortschritt nach zwei Austauschveranstaltungen.",purpose:"Ursprüngliche Fähigkeit, Rückmeldung, Anpassung und echte Verbesserung trennen",
 paragraphs:[
 ["私は先月から週に一回、日本語の交流会に参加しています。最初の日は緊張して、自己紹介をするだけで精いっぱいでした。相手の質問を聞いても、答えを考えるのに時間がかかりました。","Seit letzten Monat besuche ich wöchentlich einen Japanisch-Austausch. Beim ersten Treffen war ich so nervös, dass die Selbstvorstellung schwer genug war. Für Antworten auf Fragen brauchte ich lange."],
 ["二回目の前に、私は短い会話を練習しました。難しい単語をたくさん覚えるより、相手の話を聞いて質問する練習をしました。わからない時には「もう一度ゆっくり言っていただけますか」と聞くことにしました。","Vor dem zweiten Treffen übte ich kurze Gespräche. Statt viele schwere Wörter zu pauken, trainierte ich Zuhören und Nachfragen. Bei Verständnisproblemen wollte ich höflich um Wiederholung bitten."],
 ["交流会では、先生ではない参加者が「質問が自然になりましたね」と言ってくれました。ただし、私はまだ速い会話を全部理解できません。そのことを正直に伝えると、「少しずつ練習すれば大丈夫」と励ましてもらいました。","Beim Treffen sagte eine Mitlernende, meine Fragen klängen natürlicher. Schnelle Gespräche verstehe ich aber noch nicht vollständig. Als ich dies offen sagte, ermutigte man mich, schrittweise weiterzuüben."],
 ["帰り道で、私は上手になったことだけでなく、まだできないこともノートに書きました。次回は、知らない言葉を聞き返してから自分の言葉でまとめることを目標にしています。","Auf dem Heimweg notierte ich sowohl Verbesserungen als auch verbleibende Grenzen. Beim nächsten Treffen will ich unbekannte Wörter erfragen und danach mit eigenen Worten zusammenfassen."]
 ],words:["sanka","kinchou","shitsumon","oboeru","mokuhyou","tsutaeru"],grammar:"より / ことにしました / ただし / だけでなく / てから",contrast:"Ermutigung und bessere Fragen bedeuten nicht vollständiges Hörverstehen.",
 questions:[
 ["chronology","二回目の交流会の前に何を練習しましたか。","短い会話と質問の練習をしました。","相手の話を聞いて質問する練習をしました。","難しい単語を全部覚えました。","Vorbereitung fokussiert Zuhören und Nachfragen.","相手の話を聞いて質問する練習をしました"],
 ["speaker","「質問が自然になりましたね」と言ったのは誰ですか。","交流会の参加者です。","先生ではない参加者です。","学校の先生です。","Der Text grenzt die Person von Lehrkräften ab.","先生ではない参加者が"],
 ["inference","この人は日本語の速い会話を全部理解できるようになりましたか。","いいえ、まだ全部は理解できません。","いいえ、今も速い会話は難しいです。","はい、質問が自然になったので全部わかります。","Positive Rückmeldung darf nicht auf nicht gezeigte Fertigkeit übertragen werden.","まだ速い会話を全部理解できません"]
 ],
 writing:["Neue Erfahrung: Beim Französischtandem kannst du besser fragen, aber lange Antworten noch nicht komplett verstehen.","前より質問できるようになりましたが、長い答えはまだ全部わかりません。","質問は上手になったと思います。でも、長い話を聞く練習が必要です。","Fortschritt und Grenze ehrlich trennen.","すべての会話を完全に理解できます。"],
 returnCue:["Unbekannte Lage: Bei einer Präsentation sprichst du flüssiger, kannst aber schwierige Rückfragen noch nicht beantworten.","前より発表できるようになりましたが、難しい質問にはまだうまく答えられません。","話すのは少し上達しました。でも、質問への答え方をもっと練習したいです。","Neue Aktivität und anderer Kompetenzkontrast.","難しい質問にも全部正しく答えました。"]
},
{id:"neighborhood-coordination",title:"町の小さな問題を解決する",genre:"article",unit:"p26:weekend-switch",situation:"Stadtteilgruppe löst gemeinsam ein Problem mit widersprüchlichen Angaben.",purpose:"Mehrere Beteiligte, begrenzte Belege und begründeten Ablauf in vier Absätzen integrieren",
 paragraphs:[
 ["先月、私たちの町の公園で夜に道が暗いという声が増えました。近所の人は「電気が故障しているのではないか」と話していました。でも、原因を確認した人はいませんでした。","Letzten Monat berichteten zunehmend Nachbarn, dass der Parkweg nachts dunkel sei. Einige vermuteten einen Lichtdefekt. Niemand hatte die Ursache jedoch geprüft."],
 ["そこで、町のボランティア三人が夕方に公園へ行きました。電気がついていない場所は二か所ありましたが、一つは本当に故障中で、もう一つは工事のため電気を消していただけでした。","Drei Freiwillige besuchten den Park am Abend. An zwei Stellen brannte kein Licht. Eine Lampe war tatsächlich defekt, die andere war wegen Bauarbeiten lediglich ausgeschaltet."],
 ["三人はそれぞれの場所を写真とメモで記録して、市の担当者に報告しました。担当者は「故障した電気は来週修理する予定です。工事の場所にはしばらく入らないでください」と答えました。","Sie dokumentierten beide Stellen mit Fotos und Notizen und meldeten es der Stadt. Die Verantwortliche sagte, die defekte Lampe solle nächste Woche repariert werden; das Baugebiet dürfe vorerst nicht betreten werden."],
 ["私たちはその内容を町のページで共有しました。「公園の電気は全部壊れている」という説明は正しくありません。また、修理が終わったと確認できるまでは、夜の道を使う時に注意する必要があります。","Wir teilten diese Informationen auf der Stadtteilseite. Die Behauptung, alle Parklichter seien kaputt, ist falsch. Bis die Reparatur bestätigt ist, bleibt beim nächtlichen Weg Vorsicht nötig."]
 ],words:["koshou","kakunin","houkoku","shuuri","kyouyuu","anzen"],grammar:"のではないか / だけ / 予定です / までは",contrast:"Zwei dunkle Stellen haben unterschiedliche Ursachen; angekündigte Reparatur ist nicht erledigt.",
 questions:[
 ["evidence","電気がついていなかった二か所は両方故障でしたか。","いいえ、一つだけ故障していました。","いいえ、もう一つは工事のためでした。","はい、二つとも同じ故障でした。","Kausaler Gegensatz ausdrücklich genannt.","一つは本当に故障中で、もう一つは工事のため"],
 ["chronology","修理の予定を聞く前に三人は何をしましたか。","場所を写真とメモで記録して報告しました。","公園を調べてから市に報告しました。","修理が終わったと公開しました。","Recherche und Bericht gehen städtischer Rückmeldung voraus.","写真とメモで記録して、市の担当者に報告しました"],
 ["inference","来週の修理はすでに終わっていますか。","いいえ、まだ予定です。","いいえ、終わった確認はありません。","はい、来週修理すると言ったからです。","Zukünftiger Plan kein Vollzug.","故障した電気は来週修理する予定です"]
 ],
 writing:["Neue Szene: Zwei Wasserhähne tropfen; einer defekt, anderer wegen Reinigung geöffnet; Team meldet differenziert.","二つの水道を調べたところ、一つは故障していましたが、もう一つは掃除のために使われていました。","一つだけ修理が必要です。もう一つは故障ではありません。","Beide Ursachen unterschiedlich belassen.","二つとも完全に壊れていました。"],
 returnCue:["Neuer Sachverhalt: Zwei Automaten außer Betrieb; einer defekt, anderer absichtlich ausgeschaltet; Reparatur noch nicht bestätigt.","二台の機械のうち、一台は故障中ですが、もう一台は電源を切ってあるだけです。修理はまだ終わっていません。","一台だけ故障しています。もう一台は故障ではありません。","Anderes Objekt und differenzierte Ursachen.","二台はもう修理が終わりました。"]
}
];
export const p54ReadingsE=authored.map(authoredP54);
