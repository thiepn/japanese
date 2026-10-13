import {authoredP57,type P57RawThread} from "./writing57-types";
const authored:readonly P57RawThread[]=[
{id:"shared-file-privacy",title:"資料を公開しないでください",genre:"work",unit:"p26:library-project",setting:"Team dokumentiert sichere Freigabe eines Projektentwurfs.",goal:"Empfängerbegrenzung, Linkberechtigung und spätere Veröffentlichung auseinanderhalten",register:"polite",contrast:"Teaminterne Freigabe ist nicht öffentlicher Linkzugang.",words:["kyouyuu","koukai","kakunin"],messages:[
["ケイ","資料は完成しました。リンクを知っている人が誰でも見られる設定で共有してもよろしいでしょうか。","Kei: Datei fertig, darf jeder mit Link sie sehen?"],
["ミナ","いいえ。まだ公開しないでください。チームのメンバーだけが見られるようにしたいです。","Mina: Noch nicht öffentlich, nur Teammitglieder."],
["ケイ","承知しました。メンバーだけに変更しました。金曜日に最終確認してから公開するか決めましょう。","Kei: Auf Teammitglieder begrenzt, Entscheidung über Publikation nach Freitagprüfung."],
["ミナ","ありがとうございます。共有できる人を確認しました。金曜日までは非公開のままでお願いします。","Mina: Empfängerkreis geprüft. Bis Freitag nicht öffentlich machen."]
],questions:[
["status","今、資料は誰が見られますか。","チームのメンバーだけです。","メンバーだけに共有されています。","リンクを知っている人全員です。","Ausdrücklich eingeschränkte Sichtbarkeit.","メンバーだけに変更しました"],
["chronology","公開するかどうかはいつ決めますか。","金曜日の確認後です。","金曜日に確認してからです。","もう公開されました。","Freigabe für Team != späterer öffentlicher Release.","金曜日に最終確認してから公開するか決めましょう"]
],compose:["Neue Seminarunterlagen: nur Tutorinnen sehen sie, Veröffentlichung erst Montag prüfen.","資料は先生たちだけに共有してください。月曜日に確認するまでは公開しないでください。","今は非公開で、先生だけが見られるようにお願いします。","誰でも見られるリンクを作りました。","Adressatenkreis präzise."],
reply:["現在のリンクは外部の人も見られるようです。設定を直してください。","Aktueller Link gewährt externen Zugang; bitte korrigieren.","Antworte konkret, ohne die Berechtigung für bereits repariert zu halten.","ご連絡ありがとうございます。外部の人が見られない設定に変更し、もう一度確認します。","失礼しました。共有する相手を先生だけに直します。","設定はもう安全です。","Zugriffsproblem zuerst beheben und prüfen."],
revision:["先生だけの資料ですが、リンクを知る人は誰でも見られます。","Revidiere widersprüchliche Zugriffsaussage.","リンクは先生たちだけが見られるように変更します。公開はまだしません。","外部から見られないように設定を確認します。","Ein jeder-mit-Link-Zugang ist nicht privat."],
returnCue:["Neue Familienfotos: Vier Personen dürfen sie sehen, öffentliche Freigabe erst nach Zustimmung.","写真は家族の四人だけに共有します。許可が出るまで公開しません。","ほかの人には見せず、まず許可を確認します。","誰でも写真を見られます。","Neue private Materialien."]
},
{id:"book-drive-progress",title:"本の寄付と配達予定",genre:"community",unit:"p26:library-project",setting:"Freiwillige stimmen Sachspenden, Prüfung und Transport ab.",goal:"Gesammelt, ausgewählt, transportiert und verfügbar trennen",register:"polite",contrast:"30 gesammelt, 20 geeignet, noch nicht an Kinder ausgegeben.",words:["kakunin","haitatsu","enki"],messages:[
["アキ","近所の方から本が三十冊集まりました。ただ、古くて破れた本もあります。","Aki: 30 Bücher gesammelt, einige beschädigt."],
["ミオ","確認して、子どもが読める本を二十冊選びました。月曜日に運ぶ予定です。","Mio: 20 geeignete ausgewählt, Transport Montag geplant."],
["アキ","車が故障したので、月曜日には運べなくなりました。水曜日への変更をお願いできますか。","Aki: Fahrzeug defekt, Transport Montag unmöglich; bitte Mittwoch prüfen."],
["ミオ","水曜日で大丈夫です。ただし、本棚は来週届くので、本を使い始めるのはその後です。","Mio: Mittwoch Transport möglich; Regale erst nächste Woche, Benutzung danach."]
],questions:[
["evidence","使える本は何冊ですか。","二十冊です。","二十冊を選びました。","三十冊全部です。","Eignungsprüfung vs Gesamtmenge.","二十冊選びました"],
["chronology","本を使い始めるのはいつですか。","本棚が届いてからです。","来週、本棚が届いた後です。","水曜日の配達直後です。","Transport != Lesestart.","本を使い始めるのはその後です"]
],compose:["Neue Spenden: 50 Jacken gesammelt, 35 geeignet, Auslieferung Freitag geplant.","服が五十着集まりましたが、使えるのは三十五着です。金曜日に届ける予定です。","確認して三十五着選びました。配達は金曜日の予定です。","五十着全部をもう配りました。","Mengentrennung und Zukunft."],
reply:["運ぶ車が使えなくなったので、配達は月曜日に変更できますか。","Lieferfahrzeug fällt aus, Montag angefragt.","Antworte mit Vorbehalt bis Fahrer bestätigt.","月曜日に変更できるか、運転する人に確認してから連絡します。","今はまだ決められないので、担当者に聞いてみます。","月曜日に必ず配達が終わりました。","Neuer Termin ist ungeprüfte Bitte."],
revision:["服は全部配り終わりました。月曜日も確定しました。","Korrigiere Zahl und unbekannten Transportstatus.","使える服は三十五着です。配達は月曜日に変更できるか確認中です。","配達はまだ終わっていません。日時が決まったら知らせます。","Nicht Auslieferung oder Zusage erfinden."],
returnCue:["Neue Sammlung: 40 Hefte, 25 geeignet, Ausgabe erst nach Schrankaufbau.","ノートは四十冊集まりましたが、使えるのは二十五冊です。棚を設置してから配ります。","二十五冊を選びました。まだ配っていません。","四十冊は全部配りました。","Neue Gegenstände und Freigabeschritt."]
},
{id:"festival-volunteer",title:"会場変更を知らせるまで",genre:"community",unit:"p23:plans",setting:"Organisation einer Veranstaltung über mehrere Bestätigungen.",goal:"Wetterrisiko, Raumgenehmigung, Aktualisierung und Teilnehmerhinweis berücksichtigen",register:"polite",contrast:"Wechsel ins Gemeindehaus erst nach offizieller Genehmigung.",words:["kyoka","henkou","anai"],messages:[
["委員","日曜日の文化祭は公園で行う予定です。ただし、強い雨なら市民センターに変更したいと思います。","Komitee: Kulturfest Sonntag im Park, bei Starkregen eventuell im Zentrum."],
["先生","センターは今のところ利用できるかわかりません。申請書を提出してから確認してください。","Lehrkraft: Nutzung unklar; erst Antrag einreichen und prüfen."],
["委員","申請書を提出しました。許可を待ってから参加者に新しい場所をお知らせします。","Komitee: Antrag eingereicht; Information erst nach Genehmigung."],
["先生","今日、許可が出ました。強い雨の場合はセンターを使えます。最終の会場は土曜日に案内しましょう。","Lehrkraft: Genehmigt für starken Regen; endgültiger Ort wird Samstag bekannt."]
],questions:[
["status","今すぐ場所をセンターに変更すると決まっていますか。","いいえ、強い雨の場合です。","いいえ、雨の強さによります。","はい、雨がなくても必ずセンターです。","Genehmigung ist bedingt.","強い雨の場合はセンターを使えます"],
["chronology","最終的な会場はいつ案内しますか。","土曜日です。","土曜日に知らせます。","日曜日の後です。","Ankündigung nach Genehmigung.","最終の会場は土曜日に案内しましょう"]
],compose:["Neue Sportveranstaltung: draußen, bei Schnee Halle nur wenn genehmigt, Info Freitag.","イベントは屋外で行う予定です。雪の場合は体育館に変更できるか確認します。最終予定は金曜日に知らせます。","雪なら体育館を使えるか申請します。決まったら連絡します。","体育館で必ず行うことが決まりました。","Bedingung, Genehmigung und Info."],
reply:["体育館の使用許可が出ました。ただし、入れるのは二十人までです。","Halle genehmigt, maximal 20.","Informiere mit Grenze, nicht unbeschränkt.","体育館の許可が出ましたが、定員は二十人です。参加人数を確認してから案内します。","二十人まで入れるので、人数を先に確認します。","何人でも参加できます。","Neue Kapazitätsbedingung."],
revision:["体育館には何人でも入れるので、全員に確定を送りました。","Beachte neue Kapazitätsgrenze und Informationsstatus.","体育館は二十人まで利用できます。人数を確認してから参加者に案内します。","会場は使えますが、参加人数に制限があります。","Genehmigung erweitert nicht Platzkapazität."],
returnCue:["Neue Gartenaktion: Bei Wind Innenraum genehmigt, nur 15 Plätze, endgültige Nachricht Donnerstag.","風が強ければ室内を使えますが、定員は十五人です。最終の案内は木曜日にします。","人数を確認してから新しい場所を知らせます。","何人でも室内に入れます。","Neue Wetterursache und Kapazität."]
},
{id:"commuter-question",title:"新しいバスの時間",genre:"chat",unit:"p25:transport",setting:"Kommilitonen vergleichen alten und neuen Fahrplan.",goal:"Aktuelle Information von Vorjahresplan und persönlicher Vermutung abgrenzen",register:"casual",contrast:"Alter Fahrplan 8:15, aktueller 8:30, Hörensagen 8:45 ungeprüft.",words:["jikokuhyou","kakunin","koutsuu"],messages:[
["ケン","去年の時刻表には八時十五分とあるけど、今日も同じかな。","Ken: Im alten Fahrplan 8:15, gilt das heute?"],
["サラ","今月の公式サイトでは、工事のため八時半に変更されたと書いてあるよ。","Sara: Aktuelle offizielle Website sagt wegen Bauarbeiten 8:30."],
["ミホ","友達は八時四十五分かもしれないって言ってた。どっちだろう。","Miho: Eine Freundin vermutet 8:45. Was stimmt?"],
["サラ","今確認できる公式の時間は八時半だよ。八時四十五分の話はまだ確認できていないね。","Sara: Offiziell bestätigt ist derzeit 8:30. 8:45 noch unbestätigt."]
],questions:[
["evidence","今の公式案内では何時に出発しますか。","八時半です。","八時三十分です。","八時四十五分です。","Aktueller amtlicher Beleg.","八時半に変更された"],
["speaker","八時四十五分かもしれないと言ったのは誰ですか。","ミホさんです。","ミホさんが友達から聞いた話です。","サラさんが公式サイトで見ました。","Quelle der Vermutung genau zuschreiben.","友達は八時四十五分かもしれないって言ってた"]
],compose:["Neue Museumzeit: Alte Broschüre 9 Uhr, aktuelle Website 10 Uhr, Freund vermutet 11 Uhr.","古い案内は九時ですが、公式サイトでは十時です。十一時という話はまだ確認できていません。","最新の情報は十時です。友達の話とは分けよう。","友達が言ったので十一時で決まりです。","Quellenhierarchie."],
reply:["公式サイトに今朝、十時半に変更したという新しいお知らせが出たよ。","Neue offizielle Nachricht heute Morgen: nun 10:30.","Aktualisiere offiziellen Stand, ohne alten als immer gültig.","教えてくれてありがとう。新しい案内では十時半なんだね。みんなにも訂正して知らせるよ。","わかった。今朝の公式情報に直そう。","十時のままで決まりです。","Neuere bestätigte Quelle ersetzt vorherige."],
revision:["公式サイトが十時と言っているので、十時半の案内は間違いです。","Korrigiere Datums- und Quellenwechsel.","今朝の新しい公式案内で十時半に変更されました。前の十時という情報を訂正します。","最新情報は十時半です。古い案内は使いません。","Neuestes offizielles Update maßgeblich."],
returnCue:["Neuer Abflug: Frühe Anzeige 13 Uhr, Fluglinie meldet später 13:40, Freund vermutet 14 Uhr.","航空会社の最新の案内では一時四十分です。二時という話はまだ確認できていません。","古い一時の案内を訂正して、一時四十分と伝えます。","友達が言ったので二時で決まりです。","Andere Transportmodalität."]
},
{id:"neighborhood-quiet",title:"夜の音について相談",genre:"community",unit:"p26:weekend-switch",setting:"Nachbarn verhandeln über Lärm beim Lernen.",goal:"Höfliche Beschwerde mit überprüfbarem Kompromiss und Frist",register:"polite",contrast:"Musik ab 21 Uhr leiser, nicht vollständiges Verbot versprochen.",words:["soudan","tsugou","renraku"],messages:[
["住人Ａ","こんばんは。最近、夜九時すぎに音楽が聞こえることがあります。試験前なので、少し音を小さくしていただけますか。","A: Nach 21 Uhr höre ich manchmal Musik. Wegen Prüfung bitte leiser."],
["住人Ｂ","すみません。気づきませんでした。九時からは音を小さくします。","B: Entschuldigung. Ab neun leiser."],
["住人Ａ","ありがとうございます。もし難しい日があれば、先に教えてください。","A: Danke; bei Schwierigkeiten bitte vorher informieren."],
["住人Ｂ","承知しました。友人が来る日は前日までに連絡します。ご迷惑をおかけしました。","B: Verstanden; Besuchstage melde ich bis zum Vortag."]
],questions:[
["status","住人Ｂは音楽を全部やめると約束しましたか。","いいえ、九時から小さくします。","いいえ、音を小さくする約束です。","はい、音楽は禁止です。","Verminderung ≠ vollständiges Verbot.","九時からは音を小さくします"],
["chronology","友人が来る日について、いつ連絡しますか。","前日までです。","友人が来る前の日までです。","次の日です。","Vorherige Benachrichtigung.","前日までに連絡します"]
],compose:["Neue Wohngemeinschaft: Vor acht Uhr morgens laute Gespräche, Bitte um leiseres Reden.","朝八時前に声が大きく聞こえることがあります。もう少し静かに話していただけますか。","朝は勉強しているので、八時前は声を小さくしてもらえると助かります。","朝はもう絶対に話せません。","Konkret und nicht beleidigend."],
reply:["すみません。朝は会議がある日もありますが、その日は前もってお知らせします。","Morgens manchmal Meeting, wird vorher angekündigt.","Antworte verständnisvoll und halte Vorabhinweis fest.","ありがとうございます。会議の日は前もって教えていただければ助かります。","承知しました。静かにしていただけると助かります。","会議はすべて中止してください。","Gesprächskompromiss statt Überforderung."],
revision:["朝は絶対に一言も話してはいけません。","Formuliere verbindliche, aber maßvolle Bitte.","朝八時前は声を小さくしていただけますか。会議のある日は先に連絡してください。","朝の音について相談したいです。","Wunsch ist nicht generelles Sprachverbot."],
returnCue:["Neue Gemeinschaft: Im Flur nach 22 Uhr telefonieren; Bitte um leiseres Gespräch.","夜十時以降は廊下での電話の声を小さくしていただけますか。","遅い時間は少し静かに話していただけると助かります。","電話は一日中完全に禁止です。","Anderer Ort und Frist."]
},
{id:"volunteer-schedule",title:"当番の変更と確認",genre:"chat",unit:"p23:routine",setting:"Verein organisiert zwei Helferschichten und Tausch.",goal:"Zwei Schichten, ursprüngliche und neue Verantwortliche verfolgen",register:"casual",contrast:"A übernahm vormittags, B nachmittags, nach Tausch umgekehrt; Bestätigung noch bei Teamleitung.",words:["henkou","kakunin","sanka"],messages:[
["アキ","土曜日の当番、私が午前でケンが午後だよね。","Aki: Samstagsschichten: ich vormittags, Ken nachmittags, richtig?"],
["ケン","うん。でも午前中に用事ができたから、交代できないかな。","Ken: Ja, aber ich habe vormittags einen Termin. Könnten wir tauschen?"],
["アキ","いいよ。じゃあ、私が午後で、ケンが午前だね。係の人にも連絡しておこう。","Aki: Okay. Dann ich nachmittags, Ken vormittags. Wir informieren Leitung."],
["ケン","ありがとう。まだ係の人から確認が来ていないので、返事を待ってからみんなに知らせよう。","Ken: Danke, aber Leitung hat noch nicht bestätigt. Wir informieren alle erst danach."]
],questions:[
["status","係の人は変更を確認しましたか。","いいえ、まだ返事がありません。","いいえ、確認待ちです。","はい、全員に連絡しました。","Privater Tausch ist nicht organisatorische Freigabe.","まだ係の人から確認が来ていない"],
["evidence","交換案ではアキさんはいつ担当しますか。","午後です。","アキさんは午後の担当です。","午前です。","Neue Rollenverteilung in dritter Nachricht.","私が午後で、ケンが午前だね"]
],compose:["Neue Vereinsschicht: Du arbeitest abends, willst mit Freund die Sonntagmorgen-Schicht tauschen.","日曜日の朝は都合が悪いので、午後の担当と交代できるかな。係の人にも確認しよう。","日曜日の当番を交代したいんだ。先に確認してから決めよう。","もう全員に変更が決まりました。","Interner Wunsch und Bestätigung."],
reply:["責任者から返事が来たよ。交代しても大丈夫だって。","Leitung hat Tausch genehmigt.","Jetzt bestätige tatsächliche neue Verantwortung.","連絡ありがとう。では、私は午後の担当で、あなたは午前だね。みんなにも知らせよう。","確認が取れたから、変更した予定を共有するね。","確認がまだなので何も変わりません。","Status wurde nun tatsächlich geändert."],
revision:["係の人に聞かずに変更が決まったよ。","Korrigiere fehlende Zuständigkeitsangabe.","責任者に確認したところ、交代が認められました。新しい当番を共有します。","責任者から許可が出たので、予定を変更しました。","Entscheidende Quelle der Genehmigung."],
returnCue:["Neue Bürotausch: Montag und Dienstag mit Kollegin tauschen; Chef hat zugestimmt.","上司に確認したところ、月曜日と火曜日の担当を交換してもいいことになりました。","許可をいただいたので、新しい当番をお知らせします。","上司の返事は不要です。","Neue Termine und Hierarchie."]
},
{id:"tour-appointment",title:"見学案内への返事",genre:"email",unit:"p25:directions",setting:"Museumsgast erhält Weg, Termin und zugangsbeschränkte Ausnahme.",goal:"Ankunftsort, Termin, Barriere und mögliche Alternative verbinden",register:"polite",contrast:"Tour 10 Uhr, Eingang Ost; West geschlossen; verspätete Ankunft vorher melden.",words:["anai","henkou","shugo"],messages:[
["係員","明日の見学は午前十時からです。西口は工事中なので、東口にお集まりください。","Museum: Führung morgen 10 Uhr. Westzugang gesperrt, Treffpunkt Ostausgang."],
["客","ご案内ありがとうございます。電車の都合で十時に少し遅れるかもしれません。途中から参加できますか。","Gast: Zugbedingte Verspätung möglich, darf ich später dazukommen?"],
["係員","途中からの参加は場所によって難しいことがあります。遅れる場合は受付にご連絡ください。","Personal: Späterer Einstieg ortsabhängig schwierig; bei Verspätung Empfang kontaktieren."],
["客","承知しました。東口へ向かいます。もし遅れそうなら、事前に受付へ連絡します。","Gast: Ich gehe zum Ostausgang; bei drohender Verspätung vorher melden."]
],questions:[
["evidence","見学の集合場所はどこですか。","東口です。","東口に集合します。","西口です。","Explizite Baustelle.","東口にお集まりください"],
["status","遅れても必ず途中から参加できますか。","いいえ、難しい場合があります。","いいえ、受付に確認する必要があります。","はい、いつでも参加できます。","Ausnahme nur bedingt.","途中からの参加は場所によって難しいことがあります"]
],compose:["Neue Campusführung: Freitag 14 Uhr, Nordtor wegen Bauarbeiten gesperrt, Südeingang; melde voraussichtliche Verspätung.","金曜日の二時の見学に少し遅れるかもしれません。南口へ行きますが、途中から参加できるか教えていただけますか。","遅れる場合は受付に連絡します。集合場所は南口ですね。","北口へ必ず二時に行きます。","Neue Sperrung und Unsicherheit."],
reply:["南口は開いています。開始後の参加は受け付けられません。","Südeingang offen, Einstieg nach Start ausgeschlossen.","Bitte ehrlich nach neuer Option fragen.","ご連絡ありがとうございます。遅れた場合は参加できないのですね。別の時間の見学はありますか。","承知しました。二時に間に合うか確認します。","遅れても途中から参加します。","Ablehnung einer Option respektieren."],
revision:["北口から遅れて参加する予定です。","Korrigiere beide Bedingungen.","南口に二時までに行く必要があります。遅れると参加できないので、時間を確認します。","途中参加はできないので、別の見学があるか聞きます。","Verfügbarkeit und Zugang korrekt."],
returnCue:["Neue Theaterführung: Start 11 Uhr, Haupteingang geschlossen, Hintereingang offen, kein späterer Einlass.","十一時までに裏口へ行きます。遅れると入れないので、間に合うように確認します。","正面入口ではなく裏口です。途中参加はできません。","遅れても正面から入れます。","Neue Kulturveranstaltung."]
}
];
export const p57ThreadsD=authored.map(authoredP57);
