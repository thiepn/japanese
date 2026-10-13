import {authoredP54,type P54RawReading} from "./reading54-types";
/** P54 01–07: short connected everyday sources; all content original. */
const authored:readonly P54RawReading[]=[
{id:"station-change",title:"乗り換えの朝",genre:"message",unit:"p25:transport",
 situation:"Freundinnen tauschen vor einer Zugfahrt aktuelle Nachrichten aus.",purpose:"Fahrplan und tatsächliche Information auseinanderhalten",
 paragraphs:[
 ["明日は九時に駅で会う予定でした。でも、今夜、駅から「工事のため、朝の電車は十分遅れます」というお知らせが来ました。私はすぐに時刻表を確認しました。","Wir wollten uns morgen um neun am Bahnhof treffen. Heute Abend kam aber die Mitteilung, dass der Morgenzug wegen Bauarbeiten zehn Minuten Verspätung hat. Ich kontrollierte sofort den Fahrplan."],
 ["友達のミナさんには「九時に集合して、九時二十分の電車に乗りましょう」と送りました。ミナさんはバスなら乗り換えがいらないと言いましたが、朝は道路も混雑するそうです。","Ich schrieb Mina, wir sollten uns um neun treffen und den Zug um 9:20 nehmen. Sie sagte, beim Bus müsse man nicht umsteigen, aber morgens sei die Straße wohl auch überfüllt."],
 ["それで、私たちは駅で会う約束を変えずに、少し早めに出発することにしました。電車がまた遅れたら、駅員さんに別の行き方を聞きます。","Deshalb beschlossen wir, den Treffpunkt am Bahnhof beizubehalten, aber etwas früher loszugehen. Falls der Zug noch einmal verspätet ist, fragen wir das Bahnhofspersonal nach einer anderen Route."]
 ],words:["norikae","shuppatsu","jikokuhyou","konzatsu","shugo"],grammar:"予定でした / そうです / たら / ことにしました",contrast:"Der berichtete Busvorteil ist nicht die getroffene Entscheidung.",
 questions:[
 ["evidence","なぜ朝の電車が遅れますか。","工事のためです。","工事があるからです。","友達が遅刻したからです。","Der Aushang nennt Bauarbeiten als Grund; die Freundin hat keinen Zug aufgehalten.","工事のため、朝の電車は十分遅れます"],
 ["chronology","時刻表を確認した後、誰に何を送りましたか。","ミナさんに九時集合のメッセージを送りました。","友達に九時に集合すると送りました。","確認する前に駅員に聞きました。","Zuerst Fahrplan prüfen, dann die Freundin informieren; Bahnhofspersonal wird nur bei weiterer Verspätung gefragt.","私はすぐに時刻表を確認しました"],
 ["inference","二人は最終的にバスで行くことにしましたか。","いいえ、早めに駅へ行くことにしました。","いいえ、駅で会う約束を変えませんでした。","はい、バスは乗り換えがないからです。","Der Bustipp war eine Alternative, nicht der neue gemeinsame Plan.","駅で会う約束を変えずに、少し早めに出発する"]
 ],
 writing:["別の路線が遅れたと聞いた友達に、確認した情報と待ち合わせの変更を短く伝えなさい。","電車が遅れるそうなので、集合時間を十時に変更しませんか。","電車が遅れるそうです。十時に駅で会いましょう。","Fremdauskunft markieren und einen tatsächlich neuen Treffzeitpunkt anbieten.","電車が必ず十時に来ます。"],
 returnCue:["Neuer unbekannter Fall: Wegen starken Winds fährt die Fähre später; du behältst den Treffpunkt, reist aber früher an. Antworte einer Kollegin ohne den Ursprungstext.","船が遅れるそうですが、集合場所は変えずに早めに行きます。","風で船が遅れるそうです。集合場所はそのままで、早く出ます。","Treffpunkt bleibt gleich, Transportmeldung ist nur berichtet.","船がもう出発しました。"]
},
{id:"quiet-cafe",title:"静かな店を選ぶ",genre:"diary",unit:"p23:cafe",
 situation:"Eine Lernende erzählt von einem Nachmittag zum Üben.",purpose:"Empfehlung, Entscheidung und Rückblick unterscheiden",
 paragraphs:[
 ["試験の前の日、私は家で勉強しようと思いました。しかし、隣の部屋で工事をしていて、集中できませんでした。友達に相談すると、駅の近くの小さなカフェを紹介してくれました。","Am Tag vor der Prüfung wollte ich zuhause lernen. Wegen Bauarbeiten nebenan konnte ich mich aber nicht konzentrieren. Eine Freundin empfahl mir ein kleines Café nahe dem Bahnhof."],
 ["店に入る前に、飲み物の価格を確認しました。コーヒーは少し高かったのですが、店内は静かで、席も空いていました。私はお茶を注文して、二時間復習しました。","Vor dem Betreten kontrollierte ich die Getränkepreise. Kaffee war etwas teuer, aber das Lokal war ruhig und es gab freie Plätze. Ich bestellte Tee und wiederholte zwei Stunden."],
 ["帰る時、店員さんにお礼を言いました。静かな場所で勉強できたので、明日の試験にも少し安心しました。でも、答えを全部覚えたわけではありません。","Beim Gehen bedankte ich mich beim Personal. Weil ich in Ruhe lernen konnte, war ich hinsichtlich der Prüfung etwas beruhigt. Das bedeutet aber nicht, dass ich alle Antworten auswendig wusste."]
 ],words:["soudan","shoukai","kakaku","fukushuu","anshin"],grammar:"ようと思いました / てくれました / のですが / わけではありません",contrast:"Ein ruhiger Ort bewirkt Zuversicht, nicht automatisch vollständige Beherrschung.",
 questions:[
 ["cause","どうして家で勉強できませんでしたか。","隣の部屋で工事をしていたからです。","工事の音で集中できなかったからです。","コーヒーが高かったからです。","Der Preis wurde erst im Café überprüft; das Hindernis zu Hause war die Baustelle.","隣の部屋で工事をしていて、集中できませんでした"],
 ["chronology","お茶を注文する前に何を確認しましたか。","飲み物の価格を確認しました。","店に入る前に価格を見ました。","二時間勉強してから価格を確認しました。","Die Preiskontrolle erfolgte vor Eintritt und Bestellung.","店に入る前に、飲み物の価格を確認しました"],
 ["inference","この人は試験の答えを全部覚えたと思っていますか。","いいえ、全部覚えたわけではありません。","いいえ、まだ全部は覚えていません。","はい、安心したので全部覚えました。","Beruhigung ist nicht das gleiche wie vollständiges Wissen.","答えを全部覚えたわけではありません"]
 ],
 writing:["Du findest im Park einen ruhigen Lernort. Teile einem Freund mit, warum du dort gelernt hast und wie du dich fühlst.","家ではうるさかったので、公園で復習しました。少し安心しました。","静かな公園で勉強できたので、気持ちが落ち着きました。","Ursache und Befinden dürfen nicht zu erfundener Prüfungsnote werden.","試験はもう合格しました。"],
 returnCue:["Neuer Kontext: Wegen lauter Musik kannst du im Wohnheim nicht lesen; du gehst in die Bibliothek. Erkläre den Grund knapp.","寮がうるさかったので、図書館で本を読みました。","音楽がうるさかったので、静かな図書館に行きました。","Andere Tätigkeit und anderer Ort, gleiche Kausalstruktur.","図書館も工事中でした。"]
},
{id:"library-extension",title:"図書館からのメール",genre:"email",unit:"p25:library",
 situation:"Bibliotheksnutzerin liest eine Antwort auf ihre Verlängerungsanfrage.",purpose:"Bestätigung, Bedingung und Frist aus einer Mail erkennen",
 paragraphs:[
 ["山本様。お問い合わせありがとうございます。お借りになった本の返却期限は今週の金曜日です。現在、その本にはほかの方の予約が入っていません。","Sehr geehrte Frau Yamamoto. Vielen Dank für Ihre Anfrage. Die Rückgabefrist für das ausgeliehene Buch ist diesen Freitag. Derzeit liegt keine Vormerkung einer anderen Person vor."],
 ["そのため、木曜日までに手続きをすれば、返却期限を一週間延長できます。ただし、金曜日になってからでは延長を受け付けられません。図書館のウェブサイトで利用状況を確認してください。","Daher können Sie die Ausleihe um eine Woche verlängern, wenn Sie das Verfahren bis Donnerstag erledigen. Ab Freitag wird eine Verlängerung aber nicht mehr angenommen. Prüfen Sie Ihren Status auf der Bibliothekswebsite."],
 ["延長を希望されない場合は、予定どおり金曜日までに本を返してください。ご不明な点があれば受付でお尋ねください。","Wenn Sie nicht verlängern wollen, geben Sie das Buch wie geplant bis Freitag zurück. Bei Fragen erkundigen Sie sich bitte am Schalter."]
 ],words:["shimekiri","uketsukeru","kakunin","yoyaku","uketsuke"],grammar:"までに / ば / 受け付けられません / 場合",contrast:"Die Mail bestätigt eine mögliche Verlängerung, nicht eine bereits erledigte.",
 questions:[
 ["evidence","なぜ今は本を延長できますか。","ほかの人の予約がないからです。","その本に予約が入っていないからです。","もう返却したからです。","Die mögliche Verlängerung beruht auf dem fehlenden Folgereservierungsanspruch.","予約が入っていません"],
 ["chronology","いつまでに延長の手続きをする必要がありますか。","木曜日までです。","今週の木曜日までにする必要があります。","金曜日になってからでいいです。","木曜日までに schließt nachfolgenden Freitag ausdrücklich aus.","木曜日までに手続きをすれば"],
 ["inference","何もしないでいると返却日は自動的に変わりますか。","いいえ、金曜日までに返す必要があります。","いいえ、延長には手続きが必要です。","はい、自動で来週になります。","Die Verlängerung benötigt Handlung; keine automatische Fristverschiebung.","延長を希望されない場合は、予定どおり金曜日までに本を返してください"]
 ],
 writing:["Schreibe der Bibliothek, dass du die Verlängerung vor Donnerstag beantragen möchtest.","木曜日までに延長の手続きをしたいです。","返却期限を一週間延長できますか。木曜日までに申し込みます。","Vorsätzliche Bitte und noch nicht bestätigte Änderung trennen.","もう延長されたそうです。"],
 returnCue:["Unbekannter Kontext: Sportgerät ist bis Dienstag ausgeliehen, eine einmalige Verlängerung ist nur bis Montag möglich. Formuliere eine höfliche Anfrage.","月曜日までに貸し出しの延長を申し込めますか。","火曜日が返却期限ですが、月曜日までに延長できますか。","Neue Fristen und neues Objekt; keine automatische Bewilligung behaupten.","来週まで借りられると決まりました。"]
},
{id:"market-allergy",title:"買い物のメモ",genre:"message",unit:"p25:shopping",
 situation:"Zwei Freunde stimmen einen Markt-Einkauf ab.",purpose:"Einkauf, Vorschrift und höfliche Rückfrage auseinanderhalten",
 paragraphs:[
 ["明日の夕食はみんなで作ります。私は野菜とお米を買う係になりました。駅前の店は安いそうですが、午後はとても混雑するので、朝のうちに買い物を済ませる予定です。","Morgen kochen alle gemeinsam Abendessen. Ich soll Gemüse und Reis kaufen. Das Geschäft am Bahnhof soll günstig sein, ist aber nachmittags überfüllt; daher will ich morgens einkaufen."],
 ["ユウさんは辛い料理が苦手です。ですから、カレーを作る前に、材料をみんなで確認したいと思います。安い商品でも、賞味期限は必ず見ます。","Yu verträgt scharfes Essen nicht gut. Deshalb möchte ich vor dem Kochen die Zutaten gemeinsam prüfen. Selbst bei günstigen Produkten kontrolliere ich unbedingt das Mindesthaltbarkeitsdatum."],
 ["買う物のリストを共有したら、ミカさんから「牛乳は家にあるので、もう買わなくていいよ」と返事が来ました。私はリストから牛乳を削除しました。","Nachdem ich die Einkaufsliste teilte, schrieb Mika, dass Milch bereits zuhause sei und man keine mehr kaufen müsse. Ich strich die Milch von der Liste."]
 ],words:["konzatsu","zairyou","shoumi","kyouyuu","sakujo"],grammar:"そうです / ので / ても / なくていい",contrast:"Nicht kaufen müssen ist keine Verbotsregel; eine berichtete Preisqualität ist nicht selbst geprüft.",
 questions:[
 ["cause","なぜ朝に買い物をしますか。","午後は店が混雑するからです。","午後の混雑を避けたいからです。","午後は店が閉まるからです。","Es steht nichts über Schließung; Grund ist erwartetes Gedränge.","午後はとても混雑するので、朝のうちに"],
 ["speaker","辛い料理が苦手なのは誰ですか。","ユウさんです。","ユウさんは辛い料理が苦手です。","ミカさんです。","Yu hat die Essenspräferenz; Mika antwortet zur Milch.","ユウさんは辛い料理が苦手です"],
 ["chronology","リストから牛乳を消したのはいつですか。","ミカさんの返事が来た後です。","牛乳はあると聞いた後です。","共有する前です。","Zuerst teilen, dann Mikas Rückmeldung, dann löschen.","ミカさんから「牛乳は家にあるので、もう買わなくていいよ」と返事が来ました"]
 ],
 writing:["Du planst eine Mahlzeit und streichst ein Produkt, weil es bereits vorhanden ist. Schreibe eine kurze Gruppennachricht.","卵は家にあるので、買い物のリストから削除しました。","卵はもうあります。だからリストから消しました。","Begründe die Korrektur, nicht behaupten, die ganze Mahlzeit sei fertig.","卵は絶対に食べてはいけません。"],
 returnCue:["Anderer Kontext: Für eine Ausflugsliste werden Getränke gestrichen, weil jeder eigenes Wasser mitnimmt. Erkläre es.","みんなが水を持ってくるので、飲み物をリストから削除しました。","各自で水を持つので、水はもう買わなくていいです。","Getränkeeinkauf entfällt, nicht das ganze Treffen.","旅行は中止になりました。"]
},
{id:"new-clinic",title:"はじめての診察",genre:"story",unit:"p25:appointment",
 situation:"Ein Student schildert die Vorbereitung eines ersten Arztbesuchs.",purpose:"Reihenfolge von Anmeldung, Gespräch und Untersuchung verstehen",
 paragraphs:[
 ["昨日から少し熱があったので、今朝、病院に電話しました。受付の人は「診察は十一時からですが、十時半までに来てください」と言いました。私は保険証をかばんに入れて、早めに家を出ました。","Weil ich seit gestern etwas Fieber hatte, rief ich heute Morgen im Krankenhaus an. Der Empfang sagte, die Untersuchung beginne um elf, ich solle aber bis 10:30 kommen. Ich nahm meine Versicherungskarte mit und ging früh los."],
 ["病院に着いてから、受付で名前を書きました。その後、先生に熱と咳について説明しました。先生は話を聞いて、必要なら検査をすると言いました。","Nach Ankunft trug ich am Empfang meinen Namen ein. Danach erklärte ich der Ärztin Fieber und Husten. Sie hörte zu und sagte, bei Bedarf werde sie eine Untersuchung machen."],
 ["今日は薬をもらいましたが、検査はしませんでした。家に帰ってから十分に休憩して、明日も体調が悪ければ、もう一度連絡するつもりです。","Heute bekam ich Medikamente, aber es gab keinen Test. Zuhause will ich mich ausreichend ausruhen und morgen bei weiterem Unwohlsein nochmals Kontakt aufnehmen."]
 ],words:["netsu","seki","uketsuke","yoyakuiryou","kensa","taichou"],grammar:"から / までに / 着いてから / なら / ければ",contrast:"Eine mögliche Untersuchung ist keine durchgeführte; gebuchter Termin ist nicht Untersuchung.",
 questions:[
 ["chronology","受付で名前を書く前に何をしましたか。","病院に電話して、保険証を持って行きました。","電話してから病院に行きました。","先に先生に薬をもらいました。","Telefon und Ankunft lagen vor der Registrierung; Medikamente kamen später.","今朝、病院に電話しました"],
 ["evidence","今日は検査をしましたか。","いいえ、検査はしませんでした。","いいえ、薬はもらいましたが検査はありませんでした。","はい、先生が必要だと言ったからです。","Ein Konditional ist nicht die tatsächliche Durchführung.","今日は薬をもらいましたが、検査はしませんでした"],
 ["cause","明日、また連絡するのはどんな時ですか。","体調がまだ悪い時です。","明日も体調が悪ければ連絡します。","元気になったら必ず連絡します。","Erneuter Kontakt ist an anhaltendes Unwohlsein geknüpft.","明日も体調が悪ければ、もう一度連絡する"]
 ],
 writing:["Eine Person verschiebt einen Termin, weil sie Fieber hat, und schlägt vorsichtig morgen einen Anruf vor.","熱があるので、今日の予約を変更したいです。明日また連絡します。","今日は熱があるので、予約を変更できますか。明日ご連絡します。","Keine Diagnose oder garantierte Genesung erfinden.","もう完全に治りました。"],
 returnCue:["Neuer Kontext: Zahnarzttermin um 15 Uhr, aber Busverspätung. Bitte um Rücksprache, statt sichere Untersuchung zu behaupten.","バスが遅れているので、三時の予約に間に合わないかもしれません。","すみません、予約の時間に遅れそうです。変更できますか。","Verspätungsrisiko und höfliche Frage unterscheiden.","診察はもう終わりました。"]
},
{id:"part-time-notice",title:"週末のアルバイト",genre:"notice",unit:"p25:appointment",
 situation:"Ein Café informiert neue Mitarbeitende über geänderte Dienstzeiten.",purpose:"Regel, Ausnahme und Terminfolge aus einem Aushang entnehmen",
 paragraphs:[
 ["アルバイトの皆さんへ。来週の土曜日は近くでお祭りがあるため、いつもよりお客様が多いと予想しています。そのため、開店時間を九時から八時半に変更します。","An alle Aushilfen. Wegen eines Fests in der Nähe erwarten wir kommenden Samstag mehr Gäste. Deshalb ändern wir die Öffnungszeit von neun auf 8:30."],
 ["土曜日に働く人は八時までに集合してください。制服を着てから、店内の掃除と材料の確認をします。忙しい時間に休憩できないかもしれないので、先に水を飲んでおいてください。","Samstags Arbeitende sollen sich bis acht versammeln. Nach dem Anziehen der Uniform werden Laden und Zutaten kontrolliert. Weil eine Pause bei Andrang womöglich nicht möglich ist, trinkt bitte vorher Wasser."],
 ["出勤できない人は木曜日までに店長へ連絡してください。金曜日に知らせても、代わりの人を探す時間が十分にありません。ご協力をお願いします。","Wer nicht kommen kann, muss sich bis Donnerstag beim Filialleiter melden. Eine Freitagsmeldung lässt nicht genug Zeit, Ersatz zu finden. Danke für Ihre Mitarbeit."]
 ],words:["henkou","shugo","souji","zairyou","kyuukei","mae"],grammar:"ため / までに / てから / かもしれない / ておく",contrast:"Öffnungszeit 8:30 und Arbeitsbeginn 8:00 sind nicht dieselbe Uhrzeit.",
 questions:[
 ["evidence","来週の土曜日の開店時間は何時ですか。","八時半です。","午前八時三十分です。","八時です。","Acht Uhr ist die Sammelzeit, nicht die neue Öffnungszeit.","開店時間を九時から八時半に変更します"],
 ["chronology","制服を着た後に何をしますか。","店内を掃除して材料を確認します。","掃除と材料の確認をします。","店長に電話してから制服を着ます。","Die Aufgaben folgen auf das Umziehen.","制服を着てから、店内の掃除と材料の確認をします"],
 ["cause","出勤できない人が木曜日までに連絡するのはなぜですか。","代わりの人を探す時間が必要だからです。","金曜日では代わりを探す時間が足りないからです。","木曜日は祭りがあるからです。","Die Meldungsfrist dient der Ersatzplanung; das Fest ist Samstag.","代わりの人を探す時間が十分にありません"]
 ],
 writing:["Ein Freiwilligenteam braucht wegen hoher Besucherzahl Hilfe; bitte rechtzeitig um Rückmeldung und nenne zwei Uhrzeiten korrekt.","イベントは九時に始まります。参加する人は八時半までに集合してください。","九時開始ですが、準備のため八時半までに集まってください。","Beginnen und Zusammenkommen sind unterschiedliche Zeitpunkte.","九時に集合し、八時半から始めます。"],
 returnCue:["Unbekannter Aushang: Museum öffnet um zehn, Helfer treffen sich um neun; Absagen bis Dienstag. Schreibe Hinweis.","博物館は十時に開きます。係の人は九時に集合してください。来られない人は火曜日までに連絡してください。","開館は十時ですが、準備のため九時に集まります。欠席は火曜日までに知らせてください。","Neue Frist, neuer Ort, gleiche Abfolge.","火曜日に博物館を閉めます。"]
},
{id:"birthday-change",title:"誕生日の予定が変わった",genre:"email",unit:"p23:plans",
 situation:"Ein Gastgeber aktualisiert eine Geburtstagseinladung.",purpose:"Ursprünglichen Plan, Absage und neue Vereinbarung rekonstruieren",
 paragraphs:[
 ["みなさん、こんにちは。今度の日曜日、私の家で誕生日の集まりをする予定でした。でも、マンションの水道工事が急に決まって、日曜日は水が使えないそうです。","Hallo zusammen. Diesen Sonntag sollte bei mir zuhause ein Geburtstagstreffen stattfinden. Doch im Haus wurden plötzlich Wasserarbeiten angesetzt, weshalb sonntags wohl kein Wasser verfügbar sein wird."],
 ["そこで、集まりを中止するのではなく、近くの公園で会うことにしました。午後二時に公園の入口に集合してください。雨が降ったら、駅のカフェに場所を変更します。","Daher haben wir beschlossen, das Treffen nicht abzusagen, sondern uns im nahen Park zu treffen. Bitte kommt um 14 Uhr zum Parkeingang. Falls es regnet, wechseln wir ins Café am Bahnhof."],
 ["ケーキは私が持っていきます。飲み物は各自で用意してもらえると助かります。参加できない人は金曜日までに教えてください。返事を楽しみにしています。","Den Kuchen bringe ich mit. Es wäre hilfreich, wenn jeder selbst ein Getränk vorbereitet. Wer nicht teilnehmen kann, meldet sich bitte bis Freitag. Ich freue mich auf Antworten."]
 ],words:["yotei","henkou","chuushi","shugo","sanka","tanoshimi"],grammar:"予定でした / そうです / のではなく / たら / てもらえる",contrast:"Ortswechsel ist keine Absage; der Regenort ist nur Bedingung.",
 questions:[
 ["inference","誕生日の集まりは中止になりましたか。","いいえ、場所を公園に変更しました。","いいえ、公園で行うことになりました。","はい、水道工事があるので中止です。","Der Verfasser bestreitet die Absage ausdrücklich.","集まりを中止するのではなく、近くの公園で会う"],
 ["chronology","雨が降らない場合はどこで会いますか。","公園の入口で会います。","午後二時に公園で会います。","駅のカフェで会います。","Das Café gilt nur bei Regen; ohne Regen bleibt der Park.","雨が降ったら、駅のカフェに場所を変更します"],
 ["evidence","出席できない場合、いつまでに知らせますか。","金曜日までです。","金曜日までに知らせます。","日曜日の二時までです。","Die Rückmeldefrist ist Freitag, nicht der Veranstaltungstermin.","参加できない人は金曜日までに"]
 ],
 writing:["Ein Treffen verlegt sich wegen einer Raumreparatur vom Kursraum zur Bibliothek. Informiere Teilnehmende ohne es abzusagen.","教室が使えないので、集まりの場所を図書館に変更しました。","集まりは中止ではありません。図書館で会いましょう。","Nicht Absage und Ortsänderung verwechseln.","集まりは完全に中止になりました。"],
 returnCue:["Neuer Fall: Ein Konzert fällt nicht aus, beginnt wegen Zugproblemen aber eine Stunde später. Informiere einen Freund.","コンサートは中止ではありませんが、一時間遅く始まります。","電車の問題で開演時間が一時間遅れますが、開催されます。","Zeitänderung statt Streichung, neuer Ereignistyp.","コンサートはもう終わりました。"]
}
];
export const p54ReadingsA=authored.map(authoredP54);
