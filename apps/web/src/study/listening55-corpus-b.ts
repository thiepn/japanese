import {authoredP55,type P55RawScene} from "./listening55-types";
/** 08–14: service, care, work, academic and digital misunderstandings. */
const authored:readonly P55RawScene[]=[
{id:"clinic-scheduling",title:"検査の時間",genre:"service",unit:"p25:appointment",setting:"Patient ruft Klinik wegen zweier unterschiedlicher Termine an.",listeningGoal:"Veränderbaren Untersuchungstermin von festem Gespräch unterscheiden",prediction:"Welcher Termin steht bereits fest und für welchen wird eine Änderung angefragt?",
 turns:[
 ["患者","もしもし、明日の診察は午後二時でしたよね。","Patient: Hallo, meine Untersuchung morgen ist um 14 Uhr, richtig?"],
 ["受付","はい、診察は二時です。血液検査は一時半に予約されています。","Empfang: Ja, Arzttermin um zwei, Bluttest ist für 13:30 gebucht."],
 ["患者","電車が遅れていて、検査には間に合わないかもしれません。","Patient: Der Zug verspätet sich; vielleicht schaffe ich den Test nicht."],
 ["受付","わかりました。診察の時間はそのままで、検査だけ三時に変更できるか確認します。","Empfang: Verstanden. Ich prüfe, ob nur der Test auf drei verschoben werden kann, der Arzttermin bleibt."],
 ["患者","まだ変更が決まったわけではないんですね。","Patient: Also ist die Änderung noch nicht bestätigt?"],
 ["受付","そうです。担当の人に聞いてから折り返します。","Empfang: Richtig. Ich frage das zuständige Personal und rufe zurück."],
 ["患者","ありがとうございます。連絡を待っています。","Patient: Danke, ich warte auf die Antwort."]
 ],words:["yoyaku","kensa","henkou","maniau","kakunin"],contrast:"Prüfanfrage auf 15 Uhr noch unbestätigt; Arzttermin 14 Uhr bleibt.",
 questions:[
 ["inference","血液検査はもう三時に変更されましたか。","いいえ、まだ確認中です。","いいえ、返事を待っています。","はい、三時に決まりました。","受付 spricht nur von Nachfrage.","変更できるか確認します"],
 ["speaker","診察の時間を変えないと言ったのは誰ですか。","受付の人です。","病院の受付です。","患者さんです。","Das Rezeptionspersonal erläutert die Trennung.","診察の時間はそのままで"]
 ],
 response:["Du bittest um Verschiebung nur einer Untersuchung, möchtest aber den bestehenden Arzttermin behalten.","診察はそのままで、検査だけ変更できますか。","診察の時間を変えずに検査を遅くできますか。","両方もう変更されました。","Bedingung und Status klar halten."],
 delayed:["Neue Situation: Zahnarztkontrolle 11 Uhr bleibt, Röntgenaufnahme soll vielleicht 12 Uhr stattfinden.","診察は十一時のままで、レントゲン検査だけ十二時に変更できるか確認してください。","診察の予約は変えずに、検査だけ変更したいです。","両方、十二時に決まりました。","Neuer Test, neue Uhrzeiten, keine vorweggenommene Bewilligung."]
},
{id:"online-registration",title:"送信しても決まりません",genre:"conversation",unit:"p26:library-project",setting:"Studentin erklärt einer Freundin die Onlinekursanmeldung.",listeningGoal:"Speichern, Abschicken, und tatsächliche Zulassung trennen",prediction:"Was hat die Freundin getan, welche Bestätigung fehlt?",
 turns:[
 ["エミ","日本語のワークショップに申し込んだんだけど、返事が来ないの。","Emi: Ich habe mich zum Japanischworkshop angemeldet, aber keine Antwort erhalten."],
 ["サラ","申し込みフォームは送信した？","Sara: Hast du das Formular abgesendet?"],
 ["エミ","名前を入力して保存したよ。","Emi: Ich habe den Namen eingegeben und gespeichert."],
 ["サラ","保存だけじゃ届かないかもしれない。送信ボタンを押した？","Sara: Nur Speichern reicht womöglich nicht. Hast du auf Senden gedrückt?"],
 ["エミ","あ、まだ押していなかった。今送信するね。","Emi: Ach, noch nicht. Ich sende es jetzt."],
 ["サラ","それでも、参加が決まるのは確認メールが来てからだよ。","Sara: Trotzdem ist die Teilnahme erst mit der Bestätigungsmail klar."],
 ["エミ","わかった。メールを受信したら教えるね。","Emi: Verstanden, ich sag Bescheid, sobald die E-Mail kommt."]
 ],words:["nyuuryoku","hozon","soushin","jushin","moushikomi"],contrast:"Speichern, Senden und Zusage sind drei getrennte Ereignisse.",
 questions:[
 ["chronology","エミさんは最初に何をしていましたか。","名前を入力して保存していました。","フォームを保存しただけでした。","参加の確認メールを受信しました。","Das erste abgeschlossene Ereignis ist Speichern.","名前を入力して保存したよ"],
 ["inference","今、参加が確定しましたか。","いいえ、確認メールを待つ必要があります。","いいえ、送信してもまだ決まりません。","はい、送信ボタンを押しました。","Senden ist nicht Bestätigung.","参加が決まるのは確認メールが来てから"]
 ],
 response:["Neuer Fall: Bewerbungsformular wurde gespeichert, nicht abgeschickt. Erkläre nötige Schritte.","保存しただけなので、送信してから確認メールを待ってください。","まず送信ボタンを押して、その後で連絡を確認してください。","保存したので採用が決まりました。","Weder Speicherstand noch Versand garantiert Erfolg."],
 delayed:["Anderes System: Bibliotheksplatz online vorgemerkt; erst nach Bestätigung gültig.","申し込んだだけでは席が決まりません。確認メールが来るまで待ってください。","予約の確認が必要です。まだ席は確定していません。","席はもう必ずあります。","Neue Einrichtung mit gleichem Statuskontrast."]
},
{id:"report-to-manager",title:"上司への報告と相談",genre:"meeting",unit:"p26:library-project",setting:"Mitarbeiter berichtet Fortschritt und bittet um Rat zur Verzögerung.",listeningGoal:"Bereits erledigte Arbeit von vorgeschlagener Maßnahme unterscheiden",prediction:"Welche Arbeit ist fertig, was muss noch besprochen werden?",
 turns:[
 ["部長","先週の資料はどうなりましたか。","Leitung: Wie ist der Stand der Unterlagen von letzter Woche?"],
 ["社員","数字は確認して、表を更新しました。ただ、説明の部分はまだ編集しています。","Mitarbeiter: Die Zahlen sind geprüft und die Tabelle aktualisiert. An der Erläuterung arbeite ich noch."],
 ["部長","お客様にはもう送信しましたか。","Leitung: Ist die Datei schon an den Kunden geschickt?"],
 ["社員","いいえ、まだです。完成してから送りたいと思います。","Mitarbeiter: Noch nicht, ich möchte erst nach Fertigstellung senden."],
 ["部長","それなら、今日中に終わりそうですか。","Leitung: Glauben Sie, dass es heute noch fertig wird?"],
 ["社員","少し難しいかもしれません。明日の午前中まで延期してもよろしいでしょうか。","Mitarbeiter: Es könnte schwierig werden. Dürfen wir auf morgen Vormittag verschieben?"],
 ["部長","まずお客様に相談してみましょう。まだ延期が決まったわけではありません。","Leitung: Wir fragen erst den Kunden. Die Verschiebung ist noch nicht beschlossen."]
 ],words:["houkoku","soudan","kakunin","koushin","enki"],contrast:"Tabelle fertig; Erläuterung unfertig; Verlängerung ist noch Kundenanfrage.",
 questions:[
 ["evidence","もう終わった仕事は何ですか。","数字の確認と表の更新です。","表を更新することです。","資料をお客様に送ることです。","Der Versand wurde ausdrücklich verneint.","数字は確認して、表を更新しました"],
 ["inference","明日の午前中への延期は決まりましたか。","いいえ、まだお客様に相談する必要があります。","いいえ、相談してから決めます。","はい、部長が決めました。","Leitung verlangt erst Rücksprache.","まだ延期が決まったわけではありません"]
 ],
 response:["Du meldest fertige Datenkontrolle, noch nicht gesendeten Bericht, und bittest höflich um einen Tag Aufschub.","数字は確認しましたが、報告はまだ送っていません。一日延期できますか。","表は完成しましたが、説明はまだです。明日までお時間をいただけますか。","報告は全部送信しました。","Erledigung, Versand und Bitte getrennt kommunizieren."],
 delayed:["Neue Arbeit: Poster fertig, Übersetzung fehlt; Bitte um Verschiebung noch nicht genehmigt.","ポスターはできましたが、翻訳がまだです。提出を明日まで延期できますか。","翻訳が終わっていないので、期限について相談したいです。","延期はもう決まりました。","Neues Projekt, gleiches Statusgefälle."]
},
{id:"friend-feeling",title:"誘いを断る理由",genre:"dialogue",unit:"p23:plans",setting:"Zwei Freundinnen sprechen über Kinoeinladung und Befinden.",listeningGoal:"Höfliche Absage ohne falsche Begründung erkennen",prediction:"Welche Absicht drückt ちょっと schwierig aus?",
 turns:[
 ["ナナ","土曜日、いっしょに映画を見に行かない？","Nana: Kommst du Samstag mit ins Kino?"],
 ["ユリ","誘ってくれてありがとう。でも土曜日はちょっと難しいな。","Yuri: Danke für die Einladung. Samstag ist etwas schwierig."],
 ["ナナ","忙しいの？ 無理しなくていいよ。","Nana: Bist du beschäftigt? Kein Druck."],
 ["ユリ","今週は仕事が多くて、週末は家でゆっくり休みたいんだ。","Yuri: Diese Woche ist viel Arbeit, ich möchte am Wochenende zuhause ausruhen."],
 ["ナナ","わかった。じゃあ、来週ならどうかな。","Nana: Verstanden. Wie wäre es nächste Woche?"],
 ["ユリ","来週はまだ予定が決まっていないから、後で連絡してもいい？","Yuri: Meine Pläne für nächste Woche stehen noch nicht. Darf ich mich später melden?"],
 ["ナナ","もちろん。返事は急がなくていいよ。","Nana: Natürlich. Die Antwort hat keine Eile."]
 ],words:["sasou","kotowaru","tsugou","kyuukei","kimeru"],contrast:"今週のAbsage ist klar, 来週 ist nur möglicher Termin ohne Zusage.",
 questions:[
 ["intention","ユリさんは土曜日の誘いをどうしましたか。","断りました。","土曜日は行けないと言いました。","映画に行くと約束しました。","Indirektes ちょっと難しい plus Ruhebedarf zeigt Absage.","土曜日はちょっと難しいな"],
 ["inference","来週の映画はもう決まりましたか。","いいえ、予定がまだ決まっていません。","いいえ、後で返事をします。","はい、来週の土曜日に行きます。","Yuri bietet späteres Feedback statt fester Termin.","後で連絡してもいい？"]
 ],
 response:["Ein Bekannter lädt zum Essen ein, du bist erschöpft und möchtest diese Woche höflich ablehnen, ohne nächste Woche zu versprechen.","誘ってくれてありがとうございます。でも今週は少し難しいです。また予定がわかったら連絡します。","今週は休みたいので行けません。来週の予定はまだわかりません。","来週必ず行きます。","Nicht unbeabsichtigt verbindliche Zukunft zusagen."],
 delayed:["Neue Situation: Nach Sporteinladung am Sonntag willst du lernen; folgender Sonntag bleibt unklar.","日曜日は勉強したいので難しいです。次の日曜日はまだ予定がわかりません。","誘ってくれてありがとう。でも今回は行けないんだ。","来週の日曜日は必ず参加します。","Neue Aktivität, gleiches höfliches Nein."]
},
{id:"care-plan",title:"薬と検査の説明",genre:"instructions",unit:"p25:appointment",setting:"Ärztin erklärt Patientin einen Untersuchungsablauf; keine Diagnosen.",listeningGoal:"Anweisung, Bedingung und noch ausstehendes Testergebnis unterscheiden",prediction:"Welche Anweisung ist sicher, was hängt vom Ergebnis ab?",
 turns:[
 ["医師","今日は検査をしましたが、結果はまだ出ていません。","Ärztin: Wir haben heute einen Test gemacht, Ergebnisse liegen noch nicht vor."],
 ["患者","では、今すぐ治療を始めるんですか。","Patientin: Beginnen wir dann sofort die Behandlung?"],
 ["医師","必要かどうかは結果を確認してから考えましょう。","Ärztin: Über die Notwendigkeit entscheiden wir nach den Ergebnissen."],
 ["患者","今は何をすればいいですか。","Patientin: Was soll ich bis dahin tun?"],
 ["医師","十分に休んで、もし体調が悪くなったら病院に連絡してください。","Ärztin: Ruhen Sie sich aus und kontaktieren Sie die Klinik bei Verschlechterung."],
 ["患者","明日の仕事はどうしましょうか。","Patientin: Und was ist mit meiner Arbeit morgen?"],
 ["医師","仕事については体調を見て、必要なら休むことも考えてください。","Ärztin: Beurteilen Sie Ihren Zustand; falls nötig, denken Sie an eine Pause."]
 ],words:["kensa","kekka","chiryuu","taichou","kyuukei"],contrast:"Testergebnis ausstehend; etwaige Therapieentscheidung noch nicht getroffen.",
 questions:[
 ["chronology","治療が必要かどうかはいつ考えますか。","検査の結果を確認してからです。","結果が出た後です。","検査する前です。","Ärztin verschiebt Entscheidung bis zur Datenlage.","結果を確認してから考えましょう"],
 ["inference","治療はもう始まることが決まっていますか。","いいえ、まだ決まっていません。","いいえ、結果を待っています。","はい、検査をしたからです。","Test ist nicht Therapie.","必要かどうかは結果を確認してから"]
 ],
 response:["Eine Freundin fragt, ob ein unbekanntes Testergebnis automatisch eine bestimmte Diagnose bedeutet. Antworte vorsichtig ohne medizinische Prognose.","結果がまだ出ていないので、何が必要かはまだわかりません。","検査の結果を待ってから相談しましょう。","検査をしたので病気が決まりました。","Keine Diagnose aus Testdurchführung erfinden."],
 delayed:["Neuer nichtmedizinischer Fall: Computerdiagnose läuft; Reparaturart entscheidet man erst nach Ergebnissen.","検査の結果が出てから修理の方法を決めます。","まだ原因がわからないので、確認してから考えます。","修理はもう終わりました。","Anderer Sachbereich, gleiche evidenzabhängige Entscheidung."]
},
{id:"document-privacy",title:"共有と公開のちがい",genre:"conversation",unit:"p26:library-project",setting:"Projektteam diskutiert Freigabe der Präsentationsunterlagen.",listeningGoal:"Interne Freigabe und öffentliche Veröffentlichung trennen",prediction:"Wem soll die Datei zugänglich sein?",
 turns:[
 ["ケイ","資料はもう作成できたよ。みんなと共有してもいい？","Kei: Die Unterlagen sind fertig. Darf ich sie mit allen im Team teilen?"],
 ["ミナ","チームの人だけなら大丈夫。でも、まだ公開しないでね。","Mina: Nur im Team ist okay. Bitte noch nicht veröffentlichen."],
 ["ケイ","わかった。リンクを知っている人なら誰でも見られる設定でいい？","Kei: Verstanden. Wäre eine Einstellung okay, bei der jeder mit dem Link Zugriff hat?"],
 ["ミナ","それだとチーム以外の人にも見えるかもしれないよ。","Mina: Dann könnten auch Menschen außerhalb des Teams zugreifen."],
 ["ケイ","そうか。じゃあ、メンバーだけに共有する。","Kei: Ach so. Dann teile ich nur mit Mitgliedern."],
 ["ミナ","ありがとう。金曜日に内容を確認してから公開するか決めよう。","Mina: Danke. Freitag prüfen wir den Inhalt und entscheiden danach über Veröffentlichung."],
 ["ケイ","了解。今日は非公開のままにするね。","Kei: Verstanden. Heute bleibt es nicht öffentlich."]
 ],words:["kyouyuu","koukai","hikooukai","seisaku","kakunin"],contrast:"Jeder-mit-Link ist nicht strikt intern; öffentliche Freigabe ist noch zukünftige Entscheidung.",
 questions:[
 ["intention","今、資料を見られるのは誰だけにしますか。","チームのメンバーだけです。","メンバーだけに共有します。","リンクを知っている人全員です。","Team-private Einstellung wird gewählt.","メンバーだけに共有する"],
 ["chronology","公開するかどうかはいつ決めますか。","金曜日に内容を確認してからです。","金曜日の確認の後です。","今日すぐです。","Prüfung geht Entscheidung voraus.","金曜日に内容を確認してから"]
 ],
 response:["Neue Datei soll nur in einer Lerngruppe sichtbar sein; bitte ausdrücklich keine öffentliche Linkfreigabe.","この資料はグループの人だけに共有してください。まだ公開しないでください。","リンクを誰でも見られるようにはしないでください。","誰でも見られるリンクを公開しましょう。","Privatheit aus Empfängerkreis und Zugang ableiten."],
 delayed:["Neue Situation: Familienfoto nur vier Angehörigen zeigen, nicht öffentlich teilen.","この写真は家族の四人だけに共有して、公開しないでください。","家族以外の人が見られないようにしてください。","誰でも写真を見られるようにします。","Neuer Inhalt und Empfängerkreis."]
},
{id:"second-hand-museum",title:"入場無料って本当？",genre:"interview",unit:"p25:shopping",setting:"Touristin fragt Museumsmitarbeiter nach mehrdeutiger Werbeaussage.",listeningGoal:"Kostenloser Eintritt gegen kostenpflichtige Zusatzleistung abgrenzen",prediction:"Was ist tatsächlich gratis, was ist ein optionaler Preis?",
 turns:[
 ["旅行者","友達から、日曜日は全部無料だと聞きました。","Touristin: Eine Freundin erzählte, sonntags sei alles gratis."],
 ["係員","日曜日は入場料が無料です。でも、音声ガイドは三百円かかります。","Mitarbeiter: Sonntags ist nur der Eintritt kostenlos. Der Audioguide kostet 300 Yen."],
 ["旅行者","展示を見るだけならお金はいらないんですか。","Touristin: Wenn ich nur die Ausstellung sehe, muss ich nichts bezahlen?"],
 ["係員","はい。特別な案内ツアーに参加する場合は、別に申し込みが必要です。","Mitarbeiter: Genau. Für eine spezielle Führung ist eine zusätzliche Anmeldung nötig."],
 ["旅行者","音声ガイドと案内ツアーは同じものですか。","Touristin: Ist der Audioguide dasselbe wie die Führung?"],
 ["係員","いいえ、別のサービスです。今日は音声ガイドだけでも使えますよ。","Mitarbeiter: Nein, das sind separate Angebote. Heute können Sie auch nur den Audioguide nutzen."],
 ["旅行者","ありがとうございます。今日は展示だけ見ます。","Touristin: Danke. Heute besuche ich nur die Ausstellung."]
 ],words:["muryou","moushikomi","sanka","kakunin","shoukai"],contrast:"Freundin übertreibt alle kostenlos; Personal trennt Eintritt, Audioguide, Führung.",
 questions:[
 ["inference","旅行者は今日いくら払うと決めましたか。","今日は展示だけ見るので入場料は無料です。","今日はお金を払わずに展示を見ます。","音声ガイドに三百円払います。","Die letzte Wahl schließt kostenpflichtige Optionen aus.","今日は展示だけ見ます"],
 ["speaker","全部無料だと言ったのは誰の情報ですか。","友達から聞いた話です。","旅行者の友達です。","係員の説明です。","Die Behauptung stammt aus zweiter Hand.","友達から、日曜日は全部無料だと聞きました"]
 ],
 response:["Neue Bibliothek: Eintritt frei, Spezialworkshop kostet Geld. Korrigiere die Behauptung alles sei gratis.","入るのは無料ですが、特別な講座は有料です。","入場料はかかりませんが、ワークショップにはお金がかかります。","全部無料です。","Umfang der Kostenfreiheit genau benennen."],
 delayed:["Neuer Fall: Parkeintritt gratis, Fahrradverleih kostet 500 Yen.","公園には無料で入れますが、自転車を借りるには五百円かかります。","入場は無料ですが、レンタルは有料です。","何をしても無料です。","Andere Dienstleistung, gleiche Abgrenzung."]
}
];
export const p55ScenesB=authored.map(authoredP55);
