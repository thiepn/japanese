import {authoredP54,type P54RawReading} from "./reading54-types";
/** P54 15–21: information sources, conditional commitments and longer reports. */
const authored:readonly P54RawReading[]=[
{id:"office-schedule",title:"新しい勤務時間",genre:"email",unit:"p25:appointment",situation:"Büroleiterin schreibt eine Änderung mit individuellen Ausnahmen.",purpose:"Allgemeine Arbeitsregel und individuelle Ausnahme unterscheiden",
 paragraphs:[
 ["チームの皆さんへ。来週から受付の時間が変更になります。今までは朝九時からでしたが、来週の月曜日から八時半に始めます。お客様が早く来ることが増えたためです。","Liebe Teammitglieder, ab nächster Woche ändern sich die Empfangszeiten. Bisher begann der Dienst um neun, ab Montag um 8:30. Grund ist, dass Kunden häufiger früh erscheinen."],
 ["ただし、火曜日に授業がある学生スタッフは、これまでどおり九時からでかまいません。その場合は、前もって私に連絡してください。急な変更があれば、共有カレンダーにも記入します。","Studentische Mitarbeitende mit Dienstagsunterricht dürfen an diesem Tag weiterhin um neun beginnen. Bitte meldet dies vorher. Weitere plötzliche Änderungen werden im gemeinsamen Kalender eingetragen."],
 ["先週の予定表はもう古いので、使わないでください。最新版を確認してから、必要なら勤務時間について相談しましょう。","Der Dienstplan der Vorwoche ist veraltet; bitte nicht verwenden. Prüft die neueste Version und besprecht bei Bedarf eure Arbeitszeit."]
 ],words:["henkou","mae","kyouyuu","kakunin","soudan"],grammar:"今までは / ただし / その場合 / てから",contrast:"Eine allgemeine neue Uhrzeit gilt nicht zwangsläufig für die Dienstagsausnahme.",
 questions:[
 ["cause","受付の時間が早くなったのはなぜですか。","お客様が早く来ることが増えたからです。","早く来るお客様が多くなったからです。","学生の授業が早く終わるからです。","Kundenanreise begründet die allgemeine Änderung, nicht Studentenvorlesungen.","お客様が早く来ることが増えたためです"],
 ["inference","火曜日に授業がある学生スタッフは八時半から働かなければなりませんか。","いいえ、九時からでもかまいません。","いいえ、九時から働けます。","はい、全員八時半からです。","Explizite Ausnahme erlaubt neun.","これまでどおり九時からでかまいません"],
 ["chronology","勤務時間を相談する前に何を確認しますか。","最新版の予定表です。","新しい予定表を確認します。","先週の古い予定表です。","Nur aktuelle Version ist maßgeblich.","最新版を確認してから"]
 ],
 writing:["Neuer Arbeitsplatz: Allgemein beginnt Arbeit um acht, Mitarbeitende mit Montagkurs dürfen neun. Informiere beide Gruppen.","仕事は八時からですが、月曜日に授業がある人は九時からでも大丈夫です。","通常は八時開始です。ただし、月曜日に授業がある人は九時から働けます。","Ausnahme ausdrücklich beschränken.","全員、月曜日は九時に始めます。"],
 returnCue:["Neue Szene: Sportverein beginnt ab April um 18 Uhr; Anfänger am Mittwoch dürfen 18:30. Schreibe Ausnahmeregel.","四月から練習は六時に始まります。ただし、水曜日の初心者は六時半からでも大丈夫です。","通常は十八時ですが、水曜日の初心者は十八時半から参加できます。","Neue Aktivität und Uhrzeiten.","毎日すべての人は六時半からです。"]
},
{id:"winter-coat",title:"二つのコートを比べる",genre:"story",unit:"p25:shopping",situation:"Ein Freund entscheidet nach Preis- und Nutzenvergleich.",purpose:"Preisnachlass, Eigenschaft und endgültige Wahl trennen",
 paragraphs:[
 ["父の誕生日にコートを買おうと思い、駅前の店に行きました。青いコートは一万円、黒いコートは一万二千円でした。黒いほうが少し暖かそうでしたが、予算より高かったです。","Für Vaters Geburtstag wollte ich einen Mantel kaufen. Der blaue kostete 10.000 Yen, der schwarze 12.000. Der schwarze wirkte wärmer, lag aber über meinem Budget."],
 ["店員さんに相談すると、「今日は黒いコートが二千円値下げされています」と教えてくれました。これで二つのコートの価格は同じになりました。でも、値段だけで決めないで、父が好きな色を考えました。","Die Verkäuferin erklärte, dass der schwarze Mantel heute um 2.000 Yen reduziert sei. Nun kosteten beide gleich viel. Ich dachte aber nicht nur über den Preis nach, sondern auch über Vaters Lieblingsfarbe."],
 ["父は昔から青い服をよく着ます。それで、私は青いコートを選びました。店でお礼を言い、領収書をもらって帰りました。まだ父にはプレゼントのことを伝えていません。","Vater trägt seit jeher gern Blau, daher wählte ich den blauen Mantel. Ich bedankte mich, bekam die Quittung und ging heim. Vom Geschenk habe ich Vater noch nichts gesagt."]
 ],words:["kakaku","nesage","soudan","orei","ryoushuusho"],grammar:"ほうが / そうでした / ても / それで / まだ",contrast:"Der Rabatt macht den schwarzen nicht günstiger; er gleicht nur die Preise an.",
 questions:[
 ["evidence","値下げの後、黒いコートはいくらになりましたか。","一万円です。","一万二千円から二千円安くなって一万円です。","八千円です。","12.000 − 2.000 = 10.000; beide gleich teuer.","黒いコートが二千円値下げされています"],
 ["cause","なぜ青いコートを選びましたか。","父が青い服をよく着るからです。","父が青い色を好きだからです。","青いコートのほうが安くなったからです。","Nach Rabatt war kein Preisvorteil mehr vorhanden; Präferenz entscheidet.","父は昔から青い服をよく着ます"],
 ["inference","父はもうプレゼントについて知っていますか。","いいえ、まだ伝えていません。","いいえ、プレゼントのことをまだ知りません。","はい、お礼を言ったからです。","Gedankt wurde Personal, nicht Vater informiert.","まだ父にはプレゼントのことを伝えていません"]
 ],
 writing:["Neue Entscheidung: Zwei Taschen kosten nach Rabatt gleich viel, aber deine Schwester mag Rot. Erkläre Wahl.","値段は同じですが、妹は赤が好きなので赤いかばんを選びました。","割引の後は同じ価格でした。それでも赤いかばんにしました。","Vergleich und Präferenz, nicht erfundene Preisersparnis.","赤いほうが必ず安かったです。"],
 returnCue:["Neuer Fall: Zwei Fahrräder kosten gleich viel; eines ist leichter, du nimmst das leichtere.","二つの自転車は同じ値段ですが、軽いほうを選びました。","価格は同じでも、こちらのほうが軽いのでこれにしました。","Entscheidungskriterium Gewicht statt Farbe.","値段が高いほうを買いました。"]
},
{id:"hospital-update",title:"診察のあとのメッセージ",genre:"message",unit:"p25:appointment",situation:"Patientin informiert einen Freund ohne ungesicherte Diagnosen.",purpose:"Erlebte Tatsachen, Untersuchungsergebnisse und Vorschläge unterscheiden",
 paragraphs:[
 ["心配してくれてありがとう。今日、病院で先生に診てもらいました。昨日から咳が続いていましたが、今日は熱がありません。先生に症状を説明してから、簡単な検査を受けました。","Danke, dass du dir Sorgen machst. Heute untersuchte mich die Ärztin. Seit gestern huste ich noch, aber heute habe ich kein Fieber. Nach Erklärung der Symptome wurde ein einfacher Test gemacht."],
 ["検査の結果はまだ出ていません。先生は「無理をしないで、十分に睡眠を取ってください」と言いました。薬の飲み方についても説明を受けました。","Die Testergebnisse liegen noch nicht vor. Die Ärztin sagte, ich solle mich schonen und genug schlafen. Auch die Einnahme des Medikaments wurde erklärt."],
 ["明日の練習には参加しないつもりです。結果が出たらまた連絡します。もう治ったと決めつけないでください。今は家でゆっくり休んでいます。","An der morgigen Probe werde ich wohl nicht teilnehmen. Ich melde mich wieder, wenn die Ergebnisse vorliegen. Bitte geh nicht davon aus, dass ich schon gesund bin. Ich ruhe zuhause."]
 ],words:["seki","kensa","kekka","suimin","sanka","shinpai"],grammar:"続いています / まだ / たら / ないでください",contrast:"Fieberfreiheit heute ist nicht vollständige Genesung; Testresultat ist ausstehend.",
 questions:[
 ["evidence","検査の結果はもう出ていますか。","いいえ、まだ出ていません。","いいえ、結果を待っています。","はい、もう治りました。","Ergebnis ausdrücklich offen.","検査の結果はまだ出ていません"],
 ["chronology","検査を受ける前に何をしましたか。","先生に症状を説明しました。","咳などの症状を話しました。","結果を友達に送りました。","Erklärung ging Untersuchung voraus.","先生に症状を説明してから、簡単な検査を受けました"],
 ["inference","明日の練習に行く予定ですか。","いいえ、参加しないつもりです。","いいえ、明日は休む予定です。","はい、今日は熱がないからです。","Fieberfreiheit begründet keine sichere Teilnahme.","明日の練習には参加しないつもりです"]
 ],
 writing:["Ein Kollege wartet auf Testergebnis und nimmt morgen nicht am Treffen teil. Formuliere keine Diagnose.","検査の結果はまだ出ていません。明日の会議は休むつもりです。","結果がわかったら連絡しますが、明日は参加しません。","Ergebnis offen und Teilnahmeabsage klar ausdrücken.","検査で病気が完全に治りました。"],
 returnCue:["Neuer Fall: Reparaturprüfung eines Geräts ist noch nicht fertig; Vorführung morgen wird verschoben.","機械の検査結果がまだ出ていないので、明日の実演を延期します。","結果がわかったら連絡します。明日の実演は延期です。","Nicht-medizinischer Test, gleiches Muster unsicherer Befund.","機械はもう完全に直りました。"]
},
{id:"music-club",title:"音楽クラブの新しい人",genre:"diary",unit:"p23:introduction",situation:"Eine neue Schülerin entdeckt eine AG und übernimmt eine Aufgabe.",purpose:"Einladung, Anmeldung, Teilnahme und Unterstützung zeitlich ordnen",
 paragraphs:[
 ["私は今月から新しい学校に通っています。昨日、昼休みに音楽クラブのポスターを見ました。楽しそうだったので、部屋を探して先生に質問しました。","Seit diesem Monat gehe ich auf eine neue Schule. Gestern sah ich in der Mittagspause das Plakat des Musikclubs. Es wirkte interessant, daher suchte ich den Raum und fragte die Lehrerin."],
 ["先生は「見学だけでも大丈夫ですよ」と言いました。そこで、最初は参加を決めずに練習を見ました。その後、先輩が楽器の使い方を丁寧に説明してくれて、私も少し演奏してみました。","Die Lehrerin sagte, reines Zuschauen sei auch möglich. Ich schaute zunächst zu, ohne mich festzulegen. Eine ältere Schülerin erklärte mir freundlich das Instrument; dann probierte ich zu spielen."],
 ["家に帰ってから、来週から参加することにしました。申し込みは金曜日までに必要だそうです。友達も誘いましたが、友達はまだ決めていません。","Zuhause beschloss ich, ab nächster Woche mitzumachen. Angeblich ist die Anmeldung bis Freitag nötig. Ich lud eine Freundin ein, doch sie hat sich noch nicht entschieden."]
 ],words:["tanoshimi","shitsumon","teinei","sanka","moushikomi","sasou"],grammar:"そうだったので / なくて / てくれて / てみました / ことにしました",contrast:"Zuschauen ist nicht Mitgliedschaft, Einladung ist nicht die Zustimmung der Freundin.",
 questions:[
 ["chronology","演奏する前に何をしましたか。","先輩から使い方の説明を受けました。","楽器の使い方を聞きました。","参加を申し込みました。","Die Schülerin erhielt Erklärung vor dem Probieren.","楽器の使い方を丁寧に説明してくれて、私も少し演奏してみました"],
 ["speaker","まだ参加するか決めていないのは誰ですか。","友達です。","誘われた友達です。","書いた本人です。","Erzählerin hat Entscheidung getroffen; Freundin noch nicht.","友達はまだ決めていません"],
 ["cause","なぜ音楽クラブの部屋を探しましたか。","ポスターを見て楽しそうだと思ったからです。","クラブが面白そうだったからです。","必ず参加しなければならなかったからです。","Neugier, nicht Zwang.","楽しそうだったので、部屋を探して"]
 ],
 writing:["Du besuchst ein Sportangebot zuerst als Gast, entscheidest danach zur Anmeldung.","最初は見学しましたが、楽しかったので参加することにしました。","まず練習を見てから、申し込むことにしました。","Entscheidung nach Besuch deutlich machen.","見る前に必ず登録しました。"],
 returnCue:["Neue Situation: Kochkurs zunächst beobachtet, erst nach Erklärung angemeldet; Freundin noch unentschlossen.","最初は料理を見学しました。説明を聞いてから申し込みましたが、友達はまだ決めていません。","先生の説明を聞いて参加することにしました。友達はまだ迷っています。","Neues Angebot und neue Rolle.","友達も必ず参加します。"]
},
{id:"weather-forecast",title:"天気予報はいつ変わったか",genre:"report",unit:"p23:plans",situation:"Wetterbericht und Entscheidung eines Schulvereins an zwei Tagen.",purpose:"Prognose versus tatsächliche Beobachtung und Zeitpunkt der Entscheidung trennen",
 paragraphs:[
 ["木曜日の天気予報では、土曜日は晴れると言っていました。そこで、学校は運動会を予定どおり行うと発表しました。家族はみんな楽しみにしていました。","Der Wetterbericht am Donnerstag sagte für Samstag Sonne voraus. Daher kündigte die Schule an, den Sporttag wie geplant abzuhalten. Die Familien freuten sich darauf."],
 ["しかし、金曜日の夕方になって予報が変わりました。土曜日は強い雨が降るかもしれないということです。先生たちは安全について相談し、運動会を日曜日に延期すると決めました。","Am Freitagabend änderte sich die Prognose: Samstag könnte starker Regen kommen. Die Lehrkräfte berieten über Sicherheit und entschieden, den Sporttag auf Sonntag zu verschieben."],
 ["金曜日の午後七時に新しい予定が公開されました。土曜日の朝には本当に雨が降りましたが、それは延期を決めた後のことです。日曜日は晴れて、無事に運動会ができました。","Freitag um 19 Uhr wurde der neue Plan veröffentlicht. Samstagmorgen regnete es tatsächlich, jedoch nach dem Verschiebungsbeschluss. Sonntag war sonnig und der Sporttag fand statt."]
 ],words:["yotei","enki","koukai","kimeru"],grammar:"と言っていました / かもしれない / と決めました / 後のこと",contrast:"Die Verschiebung wurde vor tatsächlichem Samstagregen beschlossen.",
 questions:[
 ["chronology","運動会を延期すると決めたのはいつですか。","金曜日の夕方です。","金曜日に予報が変わった後です。","土曜日に雨が降った後です。","Entscheidung Freitag vor Samstagregen.","金曜日の夕方になって予報が変わりました"],
 ["cause","なぜ運動会を日曜日に延期しましたか。","強い雨の可能性があり、安全を考えたからです。","土曜日に強い雨が降るかもしれなかったからです。","木曜日に雨が降ったからです。","Änderung beruht auf Risiko, nicht beobachteten Samstagregen.","安全について相談し、運動会を日曜日に延期する"],
 ["evidence","日曜日はどうなりましたか。","晴れて運動会ができました。","無事に運動会を行いました。","また延期になりました。","Letzter Absatz nennt die Durchführung.","日曜日は晴れて、無事に運動会ができました"]
 ],
 writing:["Neue Szene: Eine Wanderung wird Freitag aufgrund einer Sturmprognose verschoben; Sturm kommt Samstag tatsächlich.","金曜日に強い風の予報を聞いて、山歩きを延期しました。土曜日には本当に風が強くなりました。","予報を見て先に延期を決めました。翌日、強い風が吹きました。","Prognose-Auslöser und späteres Ereignis getrennt markieren.","土曜日の風を見た後、金曜日に延期しました。"],
 returnCue:["Neues Ereignis: Konzert findet wegen Schneevorhersage am Montag statt Sonntag statt; Sonntag schneit es.","雪の予報があったので、日曜日のコンサートを月曜日に延期しました。日曜日には雪が降りました。","雪が降る前に延期を決めました。日曜日には本当に雪でした。","Neue Wetterart, neuer Termin.","月曜日の雪を見て日曜日に変更しました。"]
},
{id:"shop-reservation",title:"予約と在庫は違います",genre:"conversation",unit:"p25:shopping",situation:"Buchhändlerin berät Kunden über eine nicht vorrätige Ausgabe.",purpose:"Verfügbarkeit, Bestellung und Quittung auseinanderhalten",
 paragraphs:[
 ["客「この日本語の辞書はありますか。」店員「今、店には在庫がありません。でも来週の火曜日に入荷する予定です。」客「それなら、取り寄せをお願いできますか。」","Kunde: Haben Sie dieses Japanischwörterbuch? Verkäuferin: Derzeit ist es nicht vorrätig, aber es soll kommenden Dienstag eintreffen. Kunde: Könnten Sie es für mich bestellen?"],
 ["店員「はい。お名前と電話番号を記入してください。入荷したら連絡します。まだお金を払う必要はありません。」客「では、ここに書きます。受け取りは火曜日の午後でもいいですか。」","Verkäuferin: Ja. Tragen Sie Namen und Telefonnummer ein. Wir informieren Sie nach Wareneingang. Sie müssen jetzt noch nicht bezahlen. Kunde: Dann trage ich es ein. Kann ich am Dienstagnachmittag abholen?"],
 ["店員「入荷を確認してからご連絡します。必ず火曜日に届くとは限りません。」客「わかりました。ありがとうございます。」客は申し込みを済ませましたが、辞書はまだ受け取っていません。","Verkäuferin: Wir kontaktieren Sie nach Kontrolle des Wareneingangs. Die Ware trifft nicht garantiert am Dienstag ein. Kunde: Verstanden, danke. Die Bestellung wurde aufgenommen, das Wörterbuch aber noch nicht abgeholt."]
 ],words:["zaiko","nyuuka","toriyose","kinyuu","hitsuyou"],grammar:"たら / 必要はありません / てから / とは限りません",contrast:"Geplante Lieferung ist weder Bestand noch sichere Zustellung; Bestellung ist nicht Empfang.",
 questions:[
 ["evidence","今、辞書は店にありますか。","いいえ、在庫がありません。","いいえ、まだ店にはありません。","はい、火曜日の午後です。","Künftiger Eingang ist nicht gegenwärtiger Bestand.","今、店には在庫がありません"],
 ["chronology","店員はいつ客に連絡しますか。","入荷を確認してからです。","辞書が入荷したと確認した後です。","客が書類を記入する前です。","Anruf folgt tatsächlicher Eingangskontrolle.","入荷を確認してからご連絡します"],
 ["inference","客はすでに辞書を受け取りましたか。","いいえ、まだ受け取っていません。","いいえ、申し込みだけ済ませました。","はい、申し込みをしたからです。","Bestellung und Aushändigung sind getrennt.","辞書はまだ受け取っていません"]
 ],
 writing:["Neue Szene: Ein Gitarrenladen hat keine Saiten, kann sie bestellen; Zahlung erst bei Abholung.","弦は今、在庫がありませんが、取り寄せできます。受け取る時に払ってください。","入荷したら連絡します。支払いは受け取りの時で大丈夫です。","Vorläufige Beschaffung nicht als vorhandene Ware darstellen.","弦はもうお渡ししました。"],
 returnCue:["Unbekannter Fall: Ein Fahrradhelm soll Donnerstag kommen; Verkäufer will erst Eingang bestätigen.","ヘルメットは木曜日に入荷する予定ですが、確認してから連絡します。","入荷はまだ確実ではありません。届いたら知らせます。","Ware, Frist und Gesprächspartner sind neu.","ヘルメットは必ず今日あります。"]
},
{id:"community-safety",title:"夜の公園の新しい案内",genre:"article",unit:"p25:directions",situation:"Ein Stadtteilverein meldet geänderte Wegenutzung nach Bauarbeiten.",purpose:"Verbot, Erlaubnis, Grund und alternative Route verstehen",
 paragraphs:[
 ["駅の南にある公園では、先月から歩道の修理をしています。工事のため、西の入口は今週いっぱい通行禁止です。東の入口はいつもどおり使えます。","Im Park südlich des Bahnhofs wird seit letztem Monat der Fußweg repariert. Wegen der Bauarbeiten ist der Westeingang bis Ende dieser Woche gesperrt, der Osteingang bleibt wie gewohnt nutzbar."],
 ["公園の中の大きな横断歩道にも新しい信号がつきました。以前は車が通るたびに危険でしたが、今は青信号になってから渡れるようになりました。子どもたちにもルールを説明しています。","An der großen Querungsstelle im Park wurde eine Ampel installiert. Früher war Überqueren wegen der Autos gefährlich; nun kann man bei Grün passieren. Kindern werden die Regeln erklärt."],
 ["来週から西の入口がまた使えるようになる予定ですが、雨が続いたら工事が延びるかもしれません。最新の案内を確認してから出かけてください。","Der Westeingang soll ab nächster Woche wieder nutzbar sein. Bei anhaltendem Regen könnten die Arbeiten länger dauern. Prüfen Sie aktuelle Hinweise vor dem Besuch."]
 ],words:["shuuri","kinshi","iriguchi","shingou","kakunin"],grammar:"ため / から / ようになりました / かもしれません",contrast:"Eine geplante Öffnung ist keine bestätigte Freigabe.",
 questions:[
 ["evidence","今週使えないのはどちらの入口ですか。","西の入口です。","西側の入口です。","東の入口です。","Nur der Westeingang ist gesperrt.","西の入口は今週いっぱい通行禁止です"],
 ["cause","なぜ西の入口は使えませんか。","歩道の工事をしているからです。","道を修理しているからです。","信号が青にならないからです。","Sperrung hat Baustelle als Grund, nicht Ampelfehler.","工事のため"],
 ["inference","西の入口は来週必ず開きますか。","いいえ、雨が続くと工事が延びるかもしれません。","いいえ、まだ予定だけです。","はい、もう工事は終わりました。","Es gibt bedingte Verzögerungsmöglichkeit.","工事が延びるかもしれません"]
 ],
 writing:["Neuer Aushang: Die Bibliothek hat wegen Fahrstuhlreparatur nur Treppenzugang; Öffnung nächster Woche unsicher.","エレベーターは修理中なので使えません。階段を使ってください。来週には直るかもしれません。","修理が終わるまで階段をご利用ください。来週はまだ未定です。","Ersatzroute und unbestätigten Reparaturtermin ausdrücken.","エレベーターは必ず明日使えます。"],
 returnCue:["Neue Szene: Brücke im Westen gesperrt, Ostbrücke bleibt offen; Freigabe abhängig vom Wetter.","西の橋は工事中で通れません。東の橋を使ってください。天気によって工事が延びるかもしれません。","今は東の橋を通れますが、西の橋の再開はまだ確実ではありません。","Andere Infrastruktur und Richtungen.","西の橋はもう開いています。"]
}
];
export const p54ReadingsC=authored.map(authoredP54);
