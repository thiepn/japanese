import {authoredP57,type P57RawThread} from "./writing57-types";
/** 01–07: personal exchanges, short messages and service replies. */
const authored:readonly P57RawThread[]=[
{id:"cafe-three-guests",title:"予約人数を変更するメール",genre:"email",unit:"p23:cafe",setting:"Gast und Restaurant schreiben über drei statt zwei Personen.",goal:"Anfrage, Platzprüfung und bestätigten Stand differenzieren",register:"service",contrast:"Drei Personen um sieben werden erst nach der letzten Nachricht bestätigt.",words:["yoyaku","henkou","kakunin"],messages:[
["田中","こんばんは。今夜七時に二人で予約した田中です。友人が一人増えたので、三人に変更できますか。","Tanaka: Für heute 19 Uhr habe ich für zwei reserviert. Ein Freund kommt dazu. Ist eine Änderung auf drei möglich?"],
["レストラン","ご連絡ありがとうございます。席を確認しますので、少々お待ちください。七時半でもよろしいでしょうか。","Restaurant: Danke. Wir prüfen die Plätze. Wäre 19:30 eine Möglichkeit?"],
["田中","七時半は難しいです。七時のまま三人で入れなければ、元の二人で伺います。","Tanaka: 19:30 ist schwierig. Falls drei um 19 Uhr nicht gehen, kommen wir zu zweit."],
["レストラン","お待たせしました。七時から三名様でご用意できます。ご予約を変更しました。","Restaurant: Wir können um 19 Uhr drei Gäste empfangen. Die Buchung wurde geändert."]
],questions:[
["chronology","三人の予約が決まったのはいつですか。","店から最後の返事が来た時です。","最後のメールの後です。","最初のお願いを送った時です。","Anfrage war zunächst offen.","ご予約を変更しました"],
["status","最終的な時間と人数はどうなりましたか。","七時に三人です。","午後七時から三名です。","七時半に三人です。","Vorschlag 19:30 wurde abgelehnt.","七時から三名様でご用意できます"]
],compose:["Andere Restaurantbuchung: Zwei werden vier, ursprüngliche Zeit 18 Uhr. Frage höflich, ohne Bestätigung zu behaupten.","六時に二人で予約していますが、四人に変更できますでしょうか。ご確認をお願いします。","予約人数を二人から四人に変更したいです。六時のままで可能ですか。","四人に変更しました。","Anfrage und Zusage unterscheiden."],
reply:["申し訳ありません。六時は三人までですが、六時半なら四人でご案内できます。","Um 18 Uhr höchstens drei; um 18:30 vier möglich.","Deine Gruppe kann 18:30. Bestätige die neue Zeit und Personen.","ご確認ありがとうございます。それでは六時半に四人でお願いします。","承知しました。六時半、四人で予約したいです。","六時に四人で決まりました。","Neue verbindliche Alternative ausdrücklich annehmen."],
revision:["三人に変更しましたか。七時半で行きます。","Korrigiere den Entwurf anhand der tatsächlichen ursprünglichen Endbestätigung.","七時から三人で予約できたことを確認しました。ありがとうございます。","七時に三名で伺います。ご対応ありがとうございます。","19:30 war nur ein abgelehnter Vorschlag."],
returnCue:["Neue Frisörbuchung: Ein Termin ist um 14 Uhr, du möchtest auf 15 Uhr wechseln; erst nach Rückmeldung steht es fest.","二時に予約していますが、三時に変更できますか。ご確認をお願いします。","三時に変更したいのですが、空いていますか。","三時に必ず変更されました。","Andere Dienstleistung, keine vorgezogene Bestätigung."]
},
{id:"library-renewal",title:"返却期限の問い合わせ",genre:"email",unit:"p25:library",setting:"Bibliothek informiert über ein möglicherweise nicht verlängerbares Buch.",goal:"Antragsfrist und Bibliotheksentscheidung aus Schriftverkehr rekonstruieren",register:"polite",contrast:"Antrag bis Donnerstag, ursprüngliche Rückgabe Freitag; Vormerkung verhindert Verlängerung.",words:["shimekiri","moushikomi","yoyaku"],messages:[
["図書館","お借りの本の返却期限は今週の金曜日です。延長をご希望の場合は木曜日までに申請してください。","Bibliothek: Rückgabe bis Freitag. Verlängerungsantrag bis Donnerstag."],
["利用者","お知らせありがとうございます。今夜、延長を申し込みました。これで来週まで借りられますか。","Nutzer: Danke. Ich habe heute Abend die Verlängerung beantragt. Darf ich bis nächste Woche behalten?"],
["図書館","ご申請を受け付けました。ただし、ほかの方が予約しているため、今回は延長できません。金曜日までにご返却ください。","Bibliothek: Antrag eingegangen, aber wegen Vormerkung nicht genehmigt; Rückgabe Freitag."],
["利用者","承知しました。延長はできないのですね。金曜日の午後までに返します。","Nutzer: Verstanden, keine Verlängerung. Ich gebe bis Freitagnachmittag zurück."]
],questions:[
["status","延長はできましたか。","いいえ、予約があるためできません。","いいえ、延長は認められませんでした。","はい、申請を送ったので決まりました。","Antrag ist nicht Bewilligung.","今回は延長できません"],
["chronology","本はいつまでに返しますか。","金曜日までです。","今週の金曜日です。","来週の金曜日です。","Ablehnung belässt ursprüngliche Frist.","金曜日までにご返却ください"]
],compose:["Du brauchst eine Verlängerung für ein Buch bis nächsten Dienstag; bitte schriftlich um Prüfung.","本の返却期限を来週の火曜日まで延長できますか。ご確認をお願いいたします。","来週の火曜日まで借りたいのですが、延長は可能でしょうか。","延長したので火曜日に返します。","Ein Antrag wird nicht zu einer Zusage."],
reply:["申し訳ありません。次の予約があるため、火曜日までの延長はできません。","Wegen der folgenden Vormerkung ist Dienstag nicht möglich.","Antworte auf die Ablehnung und frage nach regulärer Rückgabe.","承知しました。延長できないとのこと、わかりました。元の期限までに返します。","ご連絡ありがとうございます。予定どおり返却します。","火曜日まで借ります。","Ablehnung nicht ignorieren."],
revision:["延長していただいたので、来週返します。","Korrigiere die irrtümliche Zusagebehauptung.","今回は延長できないことを確認しました。金曜日までに返却します。","予約があるため、予定どおり金曜日に返します。","Das schriftliche Nein bleibt maßgeblich."],
returnCue:["Neues System: Laborausrüstung soll verlängert werden, aber andere Gruppe hat reserviert.","使用期間を延長したいのですが、予約がある場合は難しいでしょうか。","別のグループの予約があるなら、元の期限までに返します。","申し込めば必ず延長できます。","Neue Gegenstände, gleiche Bedingung."]
},
{id:"missed-bus",title:"集合時間に遅れそう",genre:"chat",unit:"p25:transport",setting:"Freunde koordinieren Treffpunkt bei Zugverspätung.",goal:"Verspätung, neuen Treffpunkt und explizite Zusage kombinieren",register:"casual",contrast:"Zuerst 9 Uhr Nordtor, nach Absprache 9:20 Ostausgang.",words:["chikoku","henkou","shugo"],messages:[
["アキ","おはよう。今日は九時に北口の前で会う予定だよね。","Aki: Heute um neun am Nordausgang, richtig?"],
["ミナ","ごめん、電車が遅れているんだ。九時二十分ごろになると思う。北口は工事中らしいよ。","Mina: Mein Zug verspätet sich; wohl gegen 9:20. Der Nordausgang soll gesperrt sein."],
["アキ","そうなんだ。じゃあ、東口の時計の前はどう？九時二十分まで待てるよ。","Aki: Dann vor der Uhr am Ostausgang? Ich kann bis 9:20 warten."],
["ミナ","ありがとう。東口の時計の前に九時二十分ごろ行くね。着いたら連絡するよ。","Mina: Danke, ich komme gegen 9:20 zur Uhr am Ostausgang und melde mich bei Ankunft."]
],questions:[
["evidence","新しい集合場所はどこですか。","東口の時計の前です。","東口にある時計の前です。","北口です。","Änderung wird in letzter Nachricht akzeptiert.","東口の時計の前に九時二十分ごろ行くね"],
["status","ミナさんは九時二十分ちょうどに着くと約束しましたか。","いいえ、九時二十分ごろと言いました。","いいえ、だいたい九時二十分です。","はい、必ず九時二十分です。","ごろ markiert ungefähr.","九時二十分ごろ行くね"]
],compose:["Deine Bahn verspätet sich; statt 16 Uhr vermutlich 16:15, bitte Freund um Warten.","ごめん、電車が遅れているから四時十五分ごろになりそう。少し待ってくれる？","遅れそうでごめんね。四時十五分くらいに着くと思う。","四時に必ず着いたよ。","Realistische Prognose statt falsche Ankunft."],
reply:["駅の南口は閉まっているよ。西口で待つね。","Südausgang geschlossen; ich warte am Westausgang.","Reagiere auf neuen Treffpunkt und veränderte Ankunft.","ありがとう。西口に四時十五分ごろ行くね。着いたら連絡する。","了解。西口に向かうよ。遅れてごめん。","南口に四時ちょうど行くね。","Letzte Ortsinformation übernehmen."],
revision:["四時に南口へ必ず行くよ。","Korrigiere Ort und unsichere Ankunft.","四時十五分ごろ西口に着くと思う。着いたら連絡するね。","西口に向かうよ。少し遅れそうでごめん。","Weder vier Uhr noch Südausgang sind aktuell."],
returnCue:["Anderer Fall: Fahrradpanne, 12:30 statt 12:00, Treffpunkt an Bibliotheksrückseite.","自転車が壊れたから十二時半ごろになるよ。図書館の裏で会おう。","少し遅れるので、図書館の裏で十二時半ごろ待ち合わせよう。","十二時に正面入口で必ず会える。","Andere Panne, Uhrzeit und Ort."]
},
{id:"course-question",title:"課題の意味を確かめる",genre:"email",unit:"p26:library-project",setting:"Studierende klärt Aufgabenstellung mit Lehrkraft.",goal:"Klärungsfrage und neue Quelle-/Formatvorgaben übernehmen",register:"polite",contrast:"Nicht wörtlich kopieren; paraphrasieren und Quelle angeben.",words:["shitsumon","happyou","kakunin"],messages:[
["学生","先生、お世話になっております。レポートでは二つの資料を比べればよろしいでしょうか。どの部分をまとめるのか、もう少し教えていただけますか。","Studentin: Soll ich zwei Texte vergleichen? Können Sie erklären, welche Teile zusammenzufassen sind?"],
["先生","最初と最後の段落を比べてください。それぞれの違いを自分の言葉で説明してください。","Lehrkraft: Vergleichen Sie erste und letzte Absätze und erklären Unterschiede in eigenen Worten."],
["学生","ありがとうございます。文章をそのまま写さずに、違いを短くまとめます。","Studentin: Danke. Ich werde die Unterschiede kurz zusammenfassen, nicht abschreiben."],
["先生","そのとおりです。あと、使った資料の出典も書いてください。提出は金曜日の十時までです。","Lehrkraft: Genau. Bitte Quellen angeben. Abgabe Freitag bis 10 Uhr."]
],questions:[
["evidence","比べるのはどの部分ですか。","最初と最後の段落です。","二つの資料の最初と最後です。","文章の全部をコピーします。","Lehrkraft nennt konkret zwei Abschnitte.","最初と最後の段落を比べてください"],
["chronology","提出期限はいつですか。","金曜日の十時までです。","金曜日の午前十時です。","金曜日の午後十時です。","Zeit steht in letzter Nachricht.","金曜日の十時までです"]
],compose:["Schreibe eine höfliche Rückfrage an den Kursleiter, ob 2 Seiten genügen und Quellen genannt werden müssen.","先生、レポートは二ページでよろしいでしょうか。また、出典を書く必要がありますか。ご確認をお願いいたします。","お忙しいところすみません。二ページでも大丈夫か、出典が必要か教えていただけますか。","二ページで出典なしと決まりました。","Eine Rückfrage ist keine Festlegung."],
reply:["二ページで大丈夫です。ただし、引用した資料の出典は必ず書いてください。","Zwei Seiten genügen, aber Quellenangaben sind Pflicht.","Bestätige Bedingung und geplante Umsetzung höflich.","ご返信ありがとうございます。二ページにまとめ、引用した資料の出典も書きます。","承知しました。二ページで作成し、出典を忘れずに記載します。","二ページなので出典は書きません。","Zustimmung zur Länge hebt Quellenpflicht nicht auf."],
revision:["出典は必要ないので、文章をコピーします。","Korrigiere Quellenpflicht und Paraphrase.","自分の言葉で二ページにまとめ、使った資料の出典を記載します。","文章をそのまま写さず、必要な出典を書きます。","Kopieren und fehlende Zuschreibung widersprechen beiden Nachrichten."],
returnCue:["Neues Seminar: Kurzreferat höchstens fünf Minuten, am Ende Literatur nennen.","発表は五分以内にまとめ、最後に使った資料を紹介します。","五分を超えないようにして、出典も示します。","資料をコピーして十五分話します。","Neues Format und Frist."]
},
{id:"volunteer-registration",title:"参加の返事はまだ",genre:"chat",unit:"p23:plans",setting:"Team plant Veranstaltung mit ungeklärten Rückmeldungen.",goal:"Einladungen, Antworten und Teilnahmezusagen klar unterscheiden",register:"casual",contrast:"Drei eingeladen, zwei Antworten, nur eine Zusage.",words:["sanka","moushikomi","kakunin"],messages:[
["ユウ","土曜日のイベント、三人に声をかけたよ。参加人数は三人でいいかな。","Yu: Ich habe drei eingeladen. Kann ich drei Teilnehmer zählen?"],
["ミオ","まだだよ。二人から返事が来たけど、一人は欠席するって。もう一人は返事がないよ。","Mio: Noch nicht. Zwei Antworten, davon eine Absage; eine Person hat nicht geantwortet."],
["ユウ","なるほど。今決まっているのは一人だけなんだね。あと一人にはもう一度連絡するよ。","Yu: Also nur eine Person sicher. Ich frage bei einer weiteren nach."],
["ミオ","ありがとう。金曜日の夕方までに人数を確認してから、飲み物を注文しよう。","Mio: Danke. Freitagabend überprüfen wir die Zahl und bestellen erst danach Getränke."]
],questions:[
["status","参加が決まっているのは何人ですか。","一人です。","一人だけです。","三人です。","Einladung und Reaktion sind nicht automatisch Zusage.","今決まっているのは一人だけ"],
["chronology","飲み物はいつ注文しますか。","金曜日の夕方に人数を確認してからです。","人数が決まってからです。","もう三人分を注文しました。","Bestellung folgt Kontrolle.","人数を確認してから、飲み物を注文しよう"]
],compose:["Neue Jugendgruppe: Sieben eingeladen, vier Antworten, zwei Zusagen; bitte Status exakt weitergeben.","七人に声をかけましたが、返事は四人からです。今、参加が決まったのは二人だけです。","七人を招待し、四人から返事が来ました。そのうち二人が参加します。","七人とも参加します。","Unterschiedliche Mengen korrekt beibehalten."],
reply:["今朝、あと二人から参加の返事が来たよ。","Heute Morgen haben zwei weitere zugesagt.","Aktualisiere vorherige zwei bestätigte Personen.","ありがとう。これで参加が決まった人は四人だね。ほかの人の返事も待とう。","了解。参加者は今のところ四人だね。","参加が決まったのは七人です。","Neue Zusagen erhöhen den bestätigten Wert nur um zwei."],
revision:["全員参加するので、七人分を注文します。","Korrigiere unbelegte Gesamtteilnahme.","参加が決まったのは今のところ四人です。残りの返事を確認してから注文します。","まだ全員の返事がないので、人数が決まるまで注文を待ちます。","Keine Mengenprognose als vollständige Bestätigung."],
returnCue:["Neue Schulaktion: Acht eingeladen, fünf Antworten, davon drei sicher zugesagt.","八人を招待しましたが、返事は五人からです。そのうち三人が参加します。","参加が決まったのは三人です。まだ全員の返事はありません。","八人全員が来ます。","Andere Gruppengröße, gleiche Evidenz."]
},
{id:"revised-delivery",title:"配達予定の訂正",genre:"chat",unit:"p25:shopping",setting:"Online-Shop korrigiert geplanten Liefertermin.",goal:"Versand, geplante Lieferung und bestätigten Empfang trennen",register:"service",contrast:"Donnerstag geplant, nach Update Freitag; Lieferung noch nicht geschehen.",words:["hassou","haitatsu","henkou"],messages:[
["店","ご注文の商品は火曜日に発送しました。木曜日の午後にお届けする予定です。","Shop: Ware wurde Dienstag versandt, Lieferung Donnerstag Nachmittag vorgesehen."],
["客","ありがとうございます。木曜日の夜には使いたいのですが、間に合いそうでしょうか。","Kunde: Danke. Ich möchte sie Donnerstagabend nutzen. Wird sie rechtzeitig kommen?"],
["店","申し訳ありません。交通の影響で配達予定が金曜日に変更になりました。まだ商品は届いていません。","Shop: Aufgrund des Verkehrs nun Freitag vorgesehen. Artikel noch nicht geliefert."],
["客","承知しました。予定が変わったことを確認しました。金曜日の配達を待ちます。","Kunde: Verstanden, ich habe die Planänderung zur Kenntnis genommen und warte bis Freitag."]
],questions:[
["chronology","商品はいつ発送されましたか。","火曜日です。","火曜日に発送されました。","金曜日に発送されました。","Versandtag unverändert trotz Lieferplanänderung.","火曜日に発送しました"],
["status","商品はもう届きましたか。","いいえ、まだ届いていません。","いいえ、金曜日の予定です。","はい、木曜日に届きました。","Geplante Zustellung ist kein Empfang.","まだ商品は届いていません"]
],compose:["Schreibe Support: Paket sollte Mittwoch kommen, noch nicht da; bitte aktuellen Stand prüfen.","水曜日に届く予定の荷物がまだ届いていません。現在の配達状況を確認していただけますか。","配達予定日を過ぎましたが、荷物は届いていません。ご確認をお願いします。","荷物はもう受け取りました。","Nicht tatsächlichen Empfang behaupten."],
reply:["確認しました。配達は土曜日に延期されています。ご迷惑をおかけします。","Die Zustellung wurde auf Samstag verschoben.","Danke und erkenne neuen Plan an; keine Garantie behaupten.","ご確認ありがとうございます。土曜日の配達予定を確認しました。引き続きお待ちしています。","承知しました。土曜日に届く予定なのですね。","土曜日に必ず受け取りました。","Termin bleibt Prognose, nicht Vergangenheitsfakt."],
revision:["水曜日に配達されたので、もう使っています。","Korrigiere an neuen Lieferstatus.","荷物はまだ届いていません。配達予定が土曜日になったと連絡を受けました。","土曜日の配達予定を確認しましたが、まだ受け取っていません。","Vergangenheit und geplante Zukunft unterscheiden."],
returnCue:["Andere Lieferung: Repariertes Fahrrad Montag verschickt, am Mittwoch statt Dienstag erwartet.","自転車は月曜日に発送されましたが、配達予定は水曜日に変更されました。","まだ届いていません。水曜日に届く予定です。","火曜日にもう受け取りました。","Neue Ware und Zeitfolge."]
},
{id:"polite-absence",title:"欠席と代わりの資料",genre:"email",unit:"p25:appointment",setting:"Lernende informiert Dozent über Abwesenheit.",goal:"Absage, Frage nach Materialien und neue Alternative schriftlich aufbauen",register:"polite",contrast:"Krankheit erklärt Abwesenheit, Kommilitonenhilfe erst nach Antwort möglich.",words:["renraku","kyuukei","shitsumon"],messages:[
["学生","先生、お世話になっております。明日は体調が悪いため、授業を欠席します。資料を後で受け取ることはできますか。","Studentin: Morgen bin ich krank und fehle. Kann ich die Unterlagen später erhalten?"],
["先生","お大事にしてください。資料は授業の後で公開します。ただし、授業中の話し合いは記録していません。","Lehrkraft: Gute Besserung. Unterlagen werden nach der Stunde bereitgestellt, Diskussion wird nicht aufgezeichnet."],
["学生","ありがとうございます。公開された資料を確認します。話し合いの内容は友達に聞いてみます。","Studentin: Danke, ich sehe die Dateien nach Veröffentlichung an und frage Freunde nach der Diskussion."],
["先生","そうしてください。次の課題は来週の火曜日までです。提出方法は資料に書いてあります。","Lehrkraft: Genau. Nächste Aufgabe bis nächsten Dienstag; Abgabeweg in den Materialien."]
],questions:[
["status","話し合いの記録はもらえますか。","いいえ、記録されていません。","いいえ、授業中の話し合いは録音されませんでした。","はい、全部公開されます。","Materialien und Diskussion sind getrennt.","話し合いは記録していません"],
["chronology","次の課題はいつまでですか。","来週の火曜日までです。","次の火曜日です。","明日の授業までです。","Frist in letzter Lehrkraftantwort.","来週の火曜日までです"]
],compose:["Schreibe höflich: Du kannst Freitag nicht zur Übung, fragst nach dem Blatt.","先生、金曜日の演習に出席できません。問題のプリントを後で受け取れますか。よろしくお願いいたします。","申し訳ありませんが、金曜日は欠席します。資料を確認する方法を教えていただけますか。","金曜日の授業は中止になりました。","Eigene Abwesenheit ist keine Absage der Veranstaltung."],
reply:["問題は授業後に掲載しますが、解説の録音はありません。","Aufgaben nach Stunde veröffentlicht, keine Aufnahme der Erklärung.","Bestätige beiden Grenzen und nenne eigene Maßnahme.","ありがとうございます。問題が公開されたら確認します。解説は友達に聞いてみます。","承知しました。資料を読み、必要なら質問します。","解説の録音を聞きます。","Nicht existierende Aufnahme vermeiden."],
revision:["授業は中止なので、先生から録音が来ます。","Überarbeite aus tatsächlichen Tatsachen.","私は欠席しますが、授業は予定どおりです。資料は授業後に確認します。","授業には出られません。公開される問題を見て、わからない所は質問します。","Personenabwesenheit und Veranstaltungstatus unterscheiden."],
returnCue:["Neuer Sportkurs: Du fehlst Montag, Mitschrift online ab Dienstag, keine Videoaufzeichnung.","月曜日は参加できません。火曜日に公開される資料を確認します。動画はないので、友達に内容を聞きます。","月曜日は休みます。資料が出たら読んでおきます。","講座は中止で動画があります。","Neues Fach und Bereitstellungsdatum."]
}
];
export const p57ThreadsA=authored.map(authoredP57);
