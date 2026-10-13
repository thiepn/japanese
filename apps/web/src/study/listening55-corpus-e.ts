import {authoredP55,type P55RawScene} from "./listening55-types";
/** 29–35: cumulative connected spoken narratives with source corrections and multiple roles. */
const authored:readonly P55RawScene[]=[
{id:"multi-source-delay",title:"三つの情報と電車の遅れ",genre:"announcement",unit:"p25:transport",setting:"Bahnhofsdurchsage, Gruppenanruf und Rückmeldung in mehreren Sprecherrollen.",listeningGoal:"Gedruckten alten Plan, aktuelle offizielle Meldung und Vermutung trennen",prediction:"Welche Angabe ist aktuell, welche bloß die Vermutung eines Freundes?",
 turns:[
 ["放送・朝","お知らせします。十時発の京都行きは、工事のため十時二十分に変更になりました。","Durchsage morgens: Der Zug nach Kyoto um zehn fährt wegen Bauarbeiten nun um 10:20."],
 ["ユウ","古い時刻表には十時と書いてあるよ。どちらが正しいの？","Yu: Der alte Fahrplan sagt zehn. Was stimmt?"],
 ["マリ","今の放送のほうが新しい情報だね。十時二十分だよ。","Mari: Die Durchsage ist aktueller: 10:20."],
 ["ケン・電話","僕は十時半になるかもしれないって聞いたけど。","Ken am Telefon: Ich habe gehört, es könnte halb elf werden."],
 ["マリ","それは誰から聞いたの？ 駅の案内では十時二十分だよ。","Mari: Von wem hast du das gehört? Der Bahnhof sagt 10:20."],
 ["放送・再","京都行きの出発は十時二十分です。乗り場は二番線のままです。","Neue Durchsage: Kyoto-Zug um 10:20, Gleis zwei bleibt."],
 ["ユウ","わかった。時間だけ変更で、乗り場は同じだね。","Yu: Verstanden: Nur die Zeit hat sich geändert, nicht das Gleis."],
 ["ケン・電話","ありがとう。確かめずに十時半だと言ってごめん。","Ken: Danke, tut mir leid, dass ich ungeprüft halb elf behauptet habe."]
 ],words:["jikokuhyou","henkou","shuppatsu","kakunin","noriba"],contrast:"Offizielle Wiederholung 10:20 gilt, Gerücht 10:30 und alter Plan 10:00 nicht.",
 questions:[
 ["evidence","駅の新しい案内によると、電車は何時に出発しますか。","十時二十分です。","午前十時二十分です。","十時半です。","Neue Durchsage wiederholt 10:20.","京都行きの出発は十時二十分です"],
 ["speaker","十時半になるかもしれないと言ったのは誰ですか。","ケンさんです。","電話のケンさんです。","駅の放送です。","Ken bringt unbestätigtes Hörensagen ein.","僕は十時半になるかもしれない"],
 ["inference","乗り場も変わりましたか。","いいえ、二番線のままです。","いいえ、乗り場は同じです。","はい、三番線に変更されました。","Zeitänderung ohne Gleiswechsel.","乗り場は二番線のままです"]
 ],
 response:["Neue Reise: Altes Plakat nennt 14:00, aktuelle Durchsage 14:30, Freund vermutet 15:00. Informiere klar.","今の放送では二時半です。三時という情報は確認できていません。","古い案内は二時ですが、最新の時間は二時半です。","三時に必ず出ます。","Sprecherzuordnung und Evidenzrang erhalten."],
 delayed:["Neuer Fall: Museumöffnung altes Schild 9 Uhr, Webseite jetzt 10 Uhr, Freund vermutet 11 Uhr.","最新のサイトでは十時に開きます。十一時という話はまだ確認できません。","古い案内は九時ですが、今の情報は十時です。","十一時に必ず開きます。","Anderer Veranstaltungsort und neue Zeiten."]
},
{id:"group-rehearsal",title:"発表が中止になったわけではありません",genre:"meeting",unit:"p26:library-project",setting:"Drei Studierende besprechen Präsentation trotz Defekts.",listeningGoal:"Teilaufgabe, Ersatzlösung und tatsächliche Gesamtentscheidung erfassen",prediction:"Was wurde abgesagt: gesamter Vortrag oder eine Vorführtechnik?",
 turns:[
 ["ハル","明日の発表で動画を見せる予定だったんだけど、プロジェクターが故障したらしい。","Haru: Morgen wollten wir ein Video zeigen, aber der Projektor scheint kaputt zu sein."],
 ["エミ","それなら発表を中止するの？","Emi: Sagen wir dann den Vortrag ab?"],
 ["ハル","いや、動画だけは使えないかもしれない。発表は予定どおり行うよ。","Haru: Nein, eventuell kann nur das Video nicht gezeigt werden. Der Vortrag findet statt."],
 ["ケン","動画の内容を写真と短い説明で紹介するのはどう？","Ken: Wie wäre es, den Inhalt mit Fotos und kurzer Erklärung zu präsentieren?"],
 ["エミ","いいね。でも、写真を公開しても大丈夫か確認しよう。","Emi: Gute Idee, aber prüfen wir erst, ob wir die Fotos öffentlich zeigen dürfen."],
 ["ハル","先生に相談してから、新しい資料を作成するね。","Haru: Ich frage die Lehrerin und erstelle dann neue Unterlagen."],
 ["ケン","今日の夜に練習できる？","Ken: Können wir heute Abend üben?"],
 ["エミ","八時からなら大丈夫。許可が出なければ、絵を使おう。","Emi: Ab acht geht. Falls wir keine Erlaubnis bekommen, verwenden wir Zeichnungen."]
 ],words:["happyou","koshou","koukai","kyoka","soudan","seisaku"],contrast:"Technikproblem betrifft Video, nicht gesamte Präsentation; Fotos brauchen Erlaubnis.",
 questions:[
 ["inference","明日の発表は中止ですか。","いいえ、予定どおり行います。","いいえ、動画だけ使えない可能性があります。","はい、プロジェクターが壊れたからです。","Explizite Unterscheidung zwischen Gesamtveranstaltung und Teil.","発表は予定どおり行うよ"],
 ["chronology","新しい資料を作成する前に何をしますか。","先生に相談します。","先生に確認してから作ります。","写真をすぐ公開します。","Genehmigungsabklärung vor Materialänderung.","先生に相談してから"],
 ["speaker","許可がなければ絵を使おうと言ったのは誰ですか。","エミさんです。","エミさんが言いました。","ケンさんです。","Ken schlägt Fotos vor, Emi nennt Ersatzfall.","許可が出なければ、絵を使おう"]
 ],
 response:["Neuer Kurs: Mikrofon kaputt, Vorlesung läuft ohne Mikro, Audioaufnahme nur nach Genehmigung.","マイクが故障しましたが、講義は予定どおり行います。録音は許可を確認してからにします。","授業は中止しません。録音できるか先生に聞きます。","授業は完全に中止です。","Teilproblem nicht zu Gesamtabsage aufblasen."],
 delayed:["Neuer Fall: Ausstellungsvideo defekt, Bilder nur mit Erlaubnis; notfalls Textbeschreibungen.","動画が使えませんが、展示は中止しません。写真の許可がなければ説明文を使います。","写真を使えるか確認して、難しければ文章で説明します。","展示は必ず中止します。","Andere Institution, gleiche Teilersatzlogik."]
},
{id:"family-emergency-plan",title:"おばあさんへの行き方",genre:"conversation",unit:"p26:weekend-switch",setting:"Familie organisiert Besuch nach zwei verhinderten Verbindungen.",listeningGoal:"Reiseoptionen, bestätigten Ersatz und Familienzusagen ordnen",prediction:"Was ist geplant, was wird wirklich gebucht?",
 turns:[
 ["姉","土曜日の夜に祖母に会いに行く予定だったけど、電車が中止になったよ。","Schwester: Wir wollten Samstagabend Großmutter besuchen, aber der Zug fällt aus."],
 ["弟","夜行バスはどう？","Bruder: Wie wäre es mit dem Nachtbus?"],
 ["姉","調べたけど、もう満席だった。","Schwester: Ich habe geschaut, er ist ausgebucht."],
 ["弟","じゃあ、日曜日の朝なら行けるかな。","Bruder: Dann könnte Sonntagmorgen gehen."],
 ["姉","先に祖母に都合を聞こう。日曜日の午後でもいいか電話するね。","Schwester: Wir fragen zuerst Großmutter, ob Sonntagnachmittag passt."],
 ["祖母・電話","急がなくていいよ。日曜日の午後なら大丈夫。","Großmutter am Telefon: Keine Eile, Sonntagnachmittag passt."],
 ["姉","ありがとう。それなら朝九時の電車を予約するよ。","Schwester: Danke. Dann buche ich den 9-Uhr-Zug."],
 ["弟","最初より短い時間になるけど、会えるのが楽しみだね。","Bruder: Es wird kürzer als gedacht, aber wir freuen uns."]
 ],words:["chuushi","yoyaku","tsugou","tanoshimi","oufuku"],contrast:"Nachtbus nur vorgeschlagen, aber ausverkauft; Sonntag wird nach Bestätigung gebucht.",
 questions:[
 ["chronology","日曜日の電車を予約する前に何をしましたか。","祖母に電話して都合を聞きました。","おばあさんに日曜日でもいいか確認しました。","夜行バスを予約しました。","Buchung folgt Familie-Abstimmung.","日曜日の午後でもいいか電話するね"],
 ["cause","夜行バスを使わなかったのはなぜですか。","満席だったからです。","席が空いていなかったからです。","祖母が嫌いだからです。","Die Nachtbusoption scheitert an Kapazität.","もう満席だった"],
 ["inference","祖母と過ごす時間は最初の計画より長くなりますか。","いいえ、短くなります。","いいえ、前より短い時間です。","はい、二日間増えます。","Bruder stellt verkürzten Aufenthalt fest.","最初より短い時間になる"]
 ],
 response:["Neue Familienfahrt: Freitagsbus voll, Samstagvormittag Zug erst nach Absprache mit Onkel reservieren.","金曜日のバスは満席なので、叔父に確認してから土曜日の電車を予約します。","土曜日の朝でもいいか叔父に聞いてから切符を買います。","金曜日のバスは予約しました。","Knappe Kapazität und neue Absprache beachten."],
 delayed:["Neuer Fall: Fähre fällt Sonntag aus, Bus Montag nur nach Bestätigung durch Gastgeber buchbar.","日曜日の船が中止なので、月曜日のバスで行けるか先に相手に確認します。","確認してから月曜日のバスを予約します。","船で予定どおり行きます。","Andere Verbindung und Gastgeber."]
},
{id:"project-source-correction",title:"古い情報を発表する前に",genre:"meeting",unit:"p26:library-project",setting:"Eine Projektgruppe korrigiert anhand zweier Quellen ein Datum.",listeningGoal:"Quellenvergleich, Zeitpunkt der Korrektur und Zuschreibung verstehen",prediction:"Welche Zahl stammt aus welcher Quelle?",
 turns:[
 ["ユキ","来週の発表で、図書館が六時に閉まると説明する予定です。","Yuki: Im Vortrag wollten wir sagen, die Bibliothek schließe um sechs."],
 ["ケン","それは去年のパンフレットに書いてあった時間だよね。","Ken: Das stammt aus der Broschüre vom letzten Jahr, oder?"],
 ["ユキ","そうです。まだ新しい案内は見ていません。","Yuki: Ja. Die neuere Mitteilung habe ich noch nicht gesehen."],
 ["マリ","今月のウェブサイトには、七時まで開いていると書いてあるよ。","Mari: Auf der aktuellen Website steht offen bis sieben."],
 ["ケン","じゃあ、去年の数字をそのまま使わないほうがいいね。","Ken: Dann sollten wir die alte Uhrzeit nicht ungeprüft übernehmen."],
 ["ユキ","確認してから資料を編集します。アンケートの「もっと遅くまで開いてほしい」という声も紹介したいです。","Yuki: Ich prüfe und überarbeite die Folien. Ich möchte auch den Wunsch aus der Umfrage nach längeren Öffnungszeiten nennen."],
 ["マリ","それは希望だから、今の閉館時間と分けて説明しよう。","Mari: Das ist ein Wunsch; trennen wir ihn von der tatsächlichen Schließzeit."],
 ["ケン","よし、発表では最新の案内とアンケートの意見を別々に示そう。","Ken: Im Vortrag stellen wir aktuelle Information und Umfragewünsche getrennt dar."]
 ],words:["happyou","kakunin","henshuu","shoukai","kekka"],contrast:"Alte sechs Uhr, aktuelle sieben Uhr, Umfragewunsch ist keine weitere tatsächliche Zeit.",
 questions:[
 ["evidence","今月のサイトによると、図書館は何時まで開いていますか。","七時までです。","午後七時までです。","六時までです。","Aktuelle Website ersetzt alte Broschüre.","七時まで開いている"],
 ["speaker","アンケートの意見と今の時間を分けようと言ったのは誰ですか。","マリさんです。","マリさんが言いました。","ユキさんです。","Yuki schlägt Umfrage vor; Mari fordert Trennung.","それは希望だから"],
 ["inference","アンケートから図書館が今もっと遅く開いているとわかりますか。","いいえ、希望が書かれているだけです。","いいえ、実際の閉館時間ではありません。","はい、希望があるので時間は延びています。","Wunsch und Betriebszeit sind andere Evidenztypen.","今の閉館時間と分けて説明しよう"]
 ],
 response:["Neuer Bericht: Alte Webseite sagt 12 Uhr, neue amtliche Seite 13 Uhr, Umfrage wünscht 14 Uhr. Korrigiere sachlich.","古い案内は十二時ですが、今は一時までです。二時までというのはアンケートの希望です。","最新情報では十三時までです。希望と実際の時間を区別します。","アンケートによると今は十四時です。","Drei Quelltypen getrennt halten."],
 delayed:["Neue Sachlage: Alter Busplan 17 Uhr, neuer 18 Uhr, Nutzer möchten 19 Uhr.","古い時刻表は五時ですが、新しい案内では六時です。七時は利用者の希望です。","今の出発は十八時で、十九時は希望にすぎません。","七時の出発が決まりました。","Neue Verkehrsdaten statt Bibliothek."]
},
{id:"workshop-limited-seats",title:"定員と参加の確定",genre:"service",unit:"p25:appointment",setting:"Mitarbeiterin erklärt Anmeldeverfahren und begrenzte Plätze.",listeningGoal:"Registrierung, Warteliste und bestätigte Teilnahme differenzieren",prediction:"Wer bekommt sofort verbindlichen Platz?",
 turns:[
 ["客","来月の料理講座に参加したいのですが、まだ空きがありますか。","Interessentin: Ich möchte nächsten Monat am Kochkurs teilnehmen. Gibt es noch Plätze?"],
 ["係員","定員は十二名で、今は十一名が確定しています。","Mitarbeiterin: Maximal zwölf, elf sind bestätigt."],
 ["客","では、今申し込めば最後の一席を予約できますか。","Interessentin: Wenn ich mich jetzt anmelde, kann ich den letzten Platz bekommen?"],
 ["係員","申し込みは受け付けますが、順番を確認してからメールでお知らせします。","Mitarbeiterin: Wir nehmen den Antrag an, prüfen aber zuerst die Reihenfolge und informieren per Mail."],
 ["客","まだ参加が決まったわけではないんですね。","Interessentin: Also ist meine Teilnahme noch nicht sicher."],
 ["係員","はい。もし満席になったら、次の講座をご案内します。","Mitarbeiterin: Richtig. Falls voll, empfehlen wir den nächsten Kurs."],
 ["客","わかりました。連絡を待っています。","Interessentin: Verstanden, ich warte."]
 ],words:["sanka","moushikomi","uketsukeru","kakunin","anai"],contrast:"Ein freier rechnerischer Platz ist nicht zugesagte Teilnahme, Reihenfolge ist zu prüfen.",
 questions:[
 ["inference","お客さんの参加はもう決まっていますか。","いいえ、メールを待っています。","いいえ、申し込みの順番を確認してからです。","はい、最後の一席を取りました。","Antrag noch nicht abschließend verarbeitet.","順番を確認してからメールでお知らせします"],
 ["cause","満席になったらどうしますか。","次の講座を案内します。","次の講座を紹介します。","今の講座に必ず入れます。","Kapazitätsgrenze löst alternative Empfehlung aus.","満席になったら、次の講座をご案内します"]
 ],
 response:["Neue Schulveranstaltung: 20 Plätze, Anmeldung angenommen, Bestätigungsmail ausstehend.","申し込みは受け付けましたが、参加はまだ決まっていません。確認メールをお待ちください。","順番を確認してから連絡します。","申し込んだので参加が確定しました。","Annahme und Genehmigung trennen."],
 delayed:["Neuer Fall: Museumsworkshop 8 Plätze, bei Überbuchung nächster Monat, aktuelle Reservierung nur Anfrage.","予約はまだ確定していません。満席なら来月の講座をご案内します。","申し込みを確認してからお知らせします。","必ず八人全員以上が参加できます。","Neuer Ort, Kapazität und Folgetermin."]
},
{id:"morning-office-recovery",title:"失敗した報告を直す",genre:"meeting",unit:"p26:library-project",setting:"Praktikant erklärt einer Leiterin Korrektur eines falschen Angebots.",listeningGoal:"Festgestellte Fehler, erledigte Reparatur und noch offene Freigabe chronologisch rekonstruieren",prediction:"Was ist repariert, was benötigt noch Entscheidung der Leitung?",
 turns:[
 ["主任","昨日、お客様に送った見積もりをもう一度確認しましょう。","Vorgesetzte: Prüfen wir das gestern versandte Angebot noch einmal."],
 ["新人","金額の一つが間違っているとわかりました。申し訳ありません。","Neuer Mitarbeiter: Ein Betrag ist falsch. Es tut mir leid."],
 ["主任","まず正しい金額を調べましたか。","Vorgesetzte: Haben Sie den korrekten Betrag recherchiert?"],
 ["新人","はい。元の資料で確認して、表を直しました。","Neuer Mitarbeiter: Ja, in den Originalunterlagen geprüft und Tabelle korrigiert."],
 ["主任","新しい見積もりはもうお客様に送りましたか。","Vorgesetzte: Haben Sie das neue Angebot bereits zum Kunden geschickt?"],
 ["新人","いいえ、まだ保存しただけです。送信の前に見ていただきたいです。","Neuer Mitarbeiter: Noch nicht, nur gespeichert. Ich möchte Ihre Prüfung vor dem Versand."],
 ["主任","わかりました。私が確認した後で送りましょう。","Vorgesetzte: Verstanden. Wir senden nach meiner Kontrolle."],
 ["新人","ありがとうございます。間違いを隠さずに報告してよかったです。","Neuer Mitarbeiter: Danke, gut, dass ich den Fehler offengelegt habe."]
 ],words:["houkoku","kakunin","hozon","soushin","naosu"],contrast:"Korrigierte Datei gespeichert, aber neuer Versand noch nicht erfolgt; Autorisierung ausstehend.",
 questions:[
 ["chronology","金額を直した後、すぐお客様に送りましたか。","いいえ、保存しただけです。","いいえ、主任の確認を待っています。","はい、すぐ送信しました。","Senden folgt erst Vorgesetztenprüfung.","まだ保存しただけです"],
 ["speaker","新しい資料を送る前に確認すると言ったのは誰ですか。","主任です。","主任が言いました。","お客様です。","Vorgesetzte beansprucht die Kontrolle.","私が確認した後で送りましょう"],
 ["cause","新人が元の資料を見たのはなぜですか。","正しい金額を確認するためです。","間違いを直すためです。","新しいお客様を探すためです。","Originalquelle dient der Fehlerkorrektur.","元の資料で確認して、表を直しました"]
 ],
 response:["Neuer Betrieb: Falsche Lieferadresse korrigiert, Datei gespeichert, Weiterleitung erst nach Freigabe. Berichte genau.","住所を確認して直しましたが、まだ送信していません。許可をいただいてから送ります。","修正した資料は保存しました。ご確認の後で送信します。","お客様にはもう送信済みです。","Speichern nicht zu Versand hochstufen."],
 delayed:["Neue Szene: Öffnungszeiten im Flyer korrigiert, noch nicht veröffentlicht, Leitung soll prüfen.","時間の間違いは直しましたが、まだ公開していません。確認してから公開します。","案内を修正して保存しました。公開は承認を待っています。","もうサイトで公開しました。","Neues Medium und neuer Publikationsstatus."]
},
{id:"long-conversation-growth",title:"聞く力が少しずつ変わった",genre:"interview",unit:"p23:introduction",setting:"Tutor spricht mit japanischlernender Studentin über Fortschritte und Grenzen.",listeningGoal:"Berichteter Fortschritt, Beobachtung und noch bestehende Schwierigkeit unterscheiden",prediction:"Welche Fähigkeit ist gewachsen, welche wird weiter geübt?",
 turns:[
 ["先生","最近、日本語の会話はどうですか。","Tutor: Wie läuft dein Japanischsprechen in letzter Zeit?"],
 ["学生","前より質問ができるようになりました。でも、速い話はまだ全部わかりません。","Studentin: Ich kann besser Fragen stellen, aber schnelle Gespräche verstehe ich noch nicht ganz."],
 ["先生","先週の交流会では何をしてみましたか。","Tutor: Was hast du letzte Woche beim Austauschtreffen versucht?"],
 ["学生","相手の話を聞いて、わからない時はゆっくり言ってもらいました。","Studentin: Ich hörte zu und bat bei Problemen um langsameres Wiederholen."],
 ["先生","相手はどう言っていましたか。","Tutor: Was sagte dein Gegenüber?"],
 ["学生","「質問が自然になりましたね」と言ってくれました。うれしかったです。","Studentin: Die Person sagte, meine Fragen klängen natürlicher. Das freute mich."],
 ["先生","よかったですね。次の目標は何ですか。","Tutor: Schön. Was ist dein nächstes Ziel?"],
 ["学生","長い答えを聞いてから、自分の言葉で短くまとめたいです。まだ練習が必要だと思います。","Studentin: Ich möchte längere Antworten anhören und mit eigenen Worten zusammenfassen. Dafür muss ich noch üben."]
 ],words:["shitsumon","mokuhyou","kinchou","tsutaeru","sanka"],contrast:"Natürlicheres Nachfragen ist Fortschritt, keine nachgewiesene vollständige Hörkompetenz.",
 questions:[
 ["inference","学生は速い会話を全部理解できていますか。","いいえ、まだ全部わかりません。","いいえ、速い話はまだ難しいです。","はい、全部聞き取れます。","Sie beschreibt ausdrücklich die bestehende Grenze.","速い話はまだ全部わかりません"],
 ["speaker","質問が自然になったと言ったのは誰ですか。","交流会で話した相手です。","交流会の相手です。","先生が今言いました。","Das Lob stammt aus dem Austauschtreffen, nicht der aktuellen Gesprächsfrage.","質問が自然になりましたね"],
 ["intention","学生の次の目標は何ですか。","長い答えを自分の言葉で短くまとめることです。","長い話を聞いて要約することです。","新しい単語だけを全部覚えることです。","Ziel ist kontextuelle Zusammenfassung, nicht reines Auswendiglernen.","自分の言葉で短くまとめたい"]
 ],
 response:["Neue Lernerfahrung: Du kannst besser schriftlich antworten, verstehst spontane Rückfragen aber noch nicht immer.","前より書けるようになりましたが、急な質問はまだ全部理解できません。","文章は上手になりました。でも、質問を聞く練習が必要です。","質問も全部完璧にわかります。","Fortschritt und verbleibende Grenze ehrlich melden."],
 delayed:["Neues Fach: Mathevorlesungen besser verstehen, Beweise selbst erklären noch schwierig.","数学の講義は前より理解できますが、証明を自分で説明するのはまだ難しいです。","話を聞くのは少し上手になりました。でも、説明する練習が必要です。","証明は全部もう説明できます。","Neues akademisches Feld, reale Kompetenzabgrenzung."]
}
];
export const p55ScenesE=authored.map(authoredP55);
