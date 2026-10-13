import {authoredP59Compact,type P59Compact} from "./performance59-types";
/** 22–28: more independent inference, conflicting plans and several constraints. */
const raw:readonly P59Compact[]=[
["seminar-room-capacity","ゼミの教室と人数","p26:library-project","ゼミの連絡","polite",
"Ein Seminar mit großem Interesse verliert den ursprünglichen Raum und kann nicht jedem Teilnehmer zusagen.",
"Personenzahl, gültige Raumkapazität und Teilnehmendenstatus in einer schriftlichen Korrektur verbinden",
[
["最初の連絡","金曜日のゼミは午後三時からＡ室で行います。参加したい人は木曜日までに連絡してください。","Erste Nachricht: Seminar Freitag 15 Uhr Raum A, Meldung bis Donnerstag."],
["教室について","Ａ室は工事で使えません。Ｂ室には十六人まで入れます。人数が多い場合は別の方法を考えます。","Raumhinweis: A wegen Bau gesperrt; B fasst 16 Personen, bei größerer Gruppe Alternative prüfen."],
["申込状況","参加を希望している学生は二十三人です。ただし、確認が取れたのは十四人だけです。","Anmeldestatus: 23 Interessierte, 14 Rückmeldungen bestätigt."]],
[
["ミホ","Ｂ室の定員なら今の十四人は入れるけど、残りの人にも返事を待ってもらう必要があるね。","Miho: 14 passen in B, aber übrige Studierende noch offen."],
["先生","希望者を全部入れられるか、教室の担当に相談してみます。まだ全員の参加は決まっていません。","Dozent: Prüft mit Raumbüro die Teilnahme der übrigen; noch keine Gesamtzusage."]],
[
["事務員","Ｂ室を午後三時から使う許可は出ました。定員の十六人は変わりません。","Raumbüro: B 15 Uhr genehmigt, maximal 16."],
["ミホ","十四人は参加の確認が取れています。残り二席の案内を先に出してもよいですか。","Miho: 14 bestätigt; darf ich zwei restliche Plätze vergeben?"],
["先生","申し込みの順番を確認してから、二人に連絡してください。ほかの人には次回の予定を知らせましょう。","Dozent: Vergabe nach Anmeldung, übrigen nächsten Termin nennen."],
["ミホ","承知しました。順番を調べてから個別に確認の連絡をします。","Miho: Prüft Reihenfolge vor einzelnen Zusagen."]],
[
["status","二十三人全員の参加は確定していますか。","いいえ、定員は十六人です。","いいえ、まだ順番の確認が必要です。","はい、希望しているので全員確定です。","Interesse, Bestätigung und Platzkapazität getrennt.","確認が取れたのは十四人","定員の十六人は変わりません"],
["chronology","残りの二席を案内する前に何をしますか。","申し込みの順番を確認します。","先に申し込んだ人を調べます。","希望者全員に確定メールを送ります。","Vergabeprozess konkret.","木曜日までに連絡してください","申し込みの順番を確認してから"],
["evidence","ゼミの開始時間は変更されましたか。","いいえ、午後三時のままです。","いいえ、場所だけＢ室です。","はい、午後四時になりました。","Stunde unverändert.","午後三時からＡ室","Ｂ室を午後三時から"]
],
["Die praktische Aufgabe: Begrenzte Zusagen ohne Überbuchung.","Ｂ室は十六人までなので、順番を確認してから残り二人に連絡します。ほかの方には次回を案内します。","人数と会場の許可を確認してから連絡します。","希望した二十三人に参加決定を出します。","Reihenfolge und Kapazität."],
["Schreibe eine höfliche mehrteilige Mitteilung an noch unbestätigte Studierende.","金曜日のゼミは午後三時からＢ室で行います。ただし、定員が十六人のため、全員には席をご用意できません。申し込みの順番を確認し、結果を個別にお知らせします。","ご希望ありがとうございます。参加できるか確認してからご連絡いたします。","希望者は全員参加できます。","Verständliche Mitteilung ohne persönliche Zusage."],
["事務員","消防の確認で、Ｂ室の定員が十四人に変更されました。追加の二席は使えません。","Raumbüro: Brandschutz reduziert B auf 14; keine weiteren Plätze.","Aktualisiere Auswahlregel für nun voll ausgelasteten Raum.","ご連絡ありがとうございます。最新の定員は十四人ですので、新しい方への参加確認は送りません。ほかの方には次回をご案内します。","定員が変わったため、案内を修正します。","残り二席があるので二人追加します。","Neue offizielle Sicherheitsgrenze ersetzt frühere."],
["Ｂ室は十六人まで入れるので、さらに二人に確定を送ります。","Korrigiere veraltete Kapazität.","最新の定員は十四人です。今の確認済み人数で満席なので、追加の案内はしません。","次回のゼミを案内します。","Änderung betrifft entscheidende Grenze."],
["Neue Veranstaltung: Lesesaal zuerst 20 Plätze, 18 Zusagen, Sicherheitsprüfung senkt auf 15; neue Zusagen stoppen, Rückfragen an Verantwortliche.","最新の定員は十五人です。確認済みの人数が多いので、担当者に相談してから案内を修正します。","勝手に追加の確定を送りません。","二十人のままで問題ありません。","Jetzt mehr Bestätigte als Plätze, gerechte Rücksprache."],
"希望者 ≠ 参加確認; Sicherheitsprüfung kann frühere Freigabe konkret ändern.",["sanka","kyoka","kakunin"]],
["travel-luggage","荷物が別の駅にあります","p25:transport","旅行中の紛失物","service",
"Reisender hat Gepäck an Zwischenstation verloren; Auskunft unterscheidet Fund, Transport und sichere Übergabe.",
"Neue Abholbedingung aus mehreren Reisestationen und Sprecherrollen zuverlässig weitergeben",
[
["列車の切符","午前九時に名古屋を出発し、十一時に京都に着きます。大阪へは十二時の電車に乗り換えます。","Fahrkarte: 9 Uhr Nagoya, Kyoto 11, Osaka-Anschluss 12."],
["忘れ物の案内","列車内の忘れ物は見つかった駅で一時保管します。持ち主の確認ができたら、受け取り方法を相談します。","Fundregel: Gegenstände am Fundbahnhof zwischengelagert, nach Eigentumsprüfung Abholung klären."],
["荷物の特徴","黒いかばんには赤い細いひもがついています。中にある物の詳しい説明は、窓口で本人が伝えます。","Merkmale: Schwarze Tasche mit rotem Band, detaillierte Inhaltsangaben persönlich am Schalter."]],
[
["旅人","京都で降りる時にかばんがないことに気づきました。今は大阪に向かっています。","Reisender: In Kyoto Verlust entdeckt, jetzt Richtung Osaka."],
["友達","京都駅に連絡して、見つかっても受け取る方法を確認しよう。","Freund: Fundstelle und Abholmodalität in Kyoto klären."]],
[
["駅員","京都駅で黒いかばんが見つかりました。しかし、赤いひもがあるかはまだ確認していません。","Personal: Schwarze Tasche in Kyoto gefunden, Band ungeprüft."],
["旅人","大阪から京都に戻らなければいけませんか。","Reisender: Muss ich aus Osaka zurückfahren?"],
["駅員","特徴を確認してから案内します。まず大阪駅の窓口でご相談ください。","Personal: Erst Eigentumsmerkmal prüfen, vorerst Osaka-Schalter konsultieren."],
["旅人","承知しました。見つかっただけでは私のかばんか決まらないですね。","Reisender: Fund ≠ gesichertes eigenes Gepäck."]],
[
["status","黒いかばんは旅人の物と確定しましたか。","いいえ、赤いひもはまだ確認していません。","いいえ、特徴を照合する必要があります。","はい、色が黒いので確定です。","Ähnlichkeit reicht nicht.","赤い細いひもがついています","赤いひもがあるかはまだ確認していません"],
["chronology","最初にどこの窓口へ行くように案内されましたか。","大阪駅の窓口です。","まず大阪駅で相談します。","名古屋駅です。","Gegenwärtiger Standort und neue Anweisung.","大阪へは十二時の電車","まず大阪駅の窓口で"],
["speaker","受け取り方法についてまだ確認が必要だと言ったのは誰ですか。","駅員です。","京都の駅員さんです。","友達が本人確認を認めました。","Institutionelle Auskunft.","持ち主の確認ができたら","特徴を確認してから案内します"]
],
["Wähle vor einer Rückfahrt die belegbare Handlungsfolge.","大阪駅の窓口で相談し、かばんの特徴を確認してから受け取り方法を決めます。","赤いひもを確認してもらい、案内を待ちます。","黒いかばんなので必ず京都へ取りに戻ります。","Keine unnötige Rückreise oder unbewiesene Zuordnung."],
["Formuliere eine respektvolle Anfrage in drei japanischen Sätzen.","京都駅で黒いかばんが見つかったと聞きました。私のかばんには赤いひもがありますが、まだ確認できていません。大阪駅の窓口で受け取り方法を相談できますか。","かばんの特徴を確認していただきたいです。受け取り方法について教えてください。","黒いので私の荷物です。すぐ大阪へ送ってください。","Identifikation und Übergabe trennen."],
["駅員","確認したところ、赤いひもがありませんでした。ほかのかばんが届いていないか調べます。","Personal: Keine rote Schnur, sucht nach weiteren Taschen.","Neue negative Evidenz anerkennen.","ご確認ありがとうございます。私のかばんとは違うかもしれません。ほかの物が届いたら教えてください。","承知しました。赤いひもがある物を引き続き探します。","ひもがなくても必ず私のかばんです。","Fehlendes wesentliches Merkmal ändert Einschätzung."],
["黒いかばんが見つかったので、赤いひもを確認せず私の物として受け取ります。","Revidiere voreilige Eigentumsbehauptung.","赤いひもがないため、私のかばんとは確認できません。ほかの忘れ物の情報を待ちます。","まだ見つかっていません。引き続き確認します。","Privatsphäre und Fundrecht wahren."],
["Neuer Zugfall: Grüner Schal mit weißem Etikett verloren, Fundbüro hat grünen ohne Etikett, Abholung erst nach Merkmalabgleich.","色は同じですが、白いラベルがないため自分の物とは確認できません。別の物も探していただけますか。","特徴を確認してから受け取り方法を相談します。","緑色なので必ず自分の物です。","Anderes Objekt und Merkmal."],
"見つかりました ≠ 自分の所有物と確認できました; bei Übergabe Identität prüfen.",["kakunin","uketsuke","anai"]],
["community-prayer-room","集会の部屋を決める","p23:plans","集まりの準備","polite",
"Gemeinschaftsgruppe plant einen kleinen Lesekreis mit Raumverfügbarkeit, Zugang und einer stillen Ersatzoption.",
"Personenwünsche respektieren, Grenzen verbindlich klären und höflich kommunizieren",
[
["集まりの案内","土曜日の午後四時に小さな読書会を行います。誰でも参加できますが、部屋の定員は十二人です。","Gruppenankündigung: Samstag 16 Uhr Lesekreis, offen, Raumkapazität zwölf."],
["施設の利用案内","建物は午後五時に閉まります。延長して使いたい場合は、二日前までに相談してください。","Gebäuderegel: Schließt 17 Uhr, Verlängerungsanfrage zwei Tage vorher."],
["入室について","会場では大きな音を出さず、ほかの利用者にも気をつけてください。車椅子の利用者は北の入り口を使えます。","Zugang: Ruhe wahren und andere achten; rollstuhlgerechter Nordeingang."]],
[
["ミオ","読む本が少し長いから、五時までに終わらないかもしれないね。","Mio: Buch länger, eventuell nicht bis 17 Uhr fertig."],
["ユウ","十二人以上来るかもしれないから、別の部屋も調べておきたい。","Yu: Vielleicht mehr als zwölf, alternativem Raum prüfen."]],
[
["施設担当","一時間の利用は許可されていますが、延長はまだ認められていません。","Hauspersonal: Nutzung bis 17 Uhr erlaubt, Verlängerung nicht genehmigt."],
["ミオ","では、読む部分を短くして五時に終わりましょうか。","Mio: Wollen wir Text kürzen, um 17 Uhr zu enden?"],
["施設担当","それなら問題ありません。人数も十二人までにしてください。","Hauspersonal: Okay, höchstens zwölf."],
["ユウ","わかりました。人数を確認してから、参加者に新しい予定を伝えます。","Yu: Zahl prüfen, dann aktualisierten Plan versenden."]],
[
["status","五時を過ぎても部屋を使えますか。","いいえ、延長は認められていません。","いいえ、五時までに終わります。","はい、時間を自由に延ばせます。","Anfrage ≠ genehmigte Verlängerung.","延長して使いたい場合は","延長はまだ認められていません"],
["evidence","車椅子の人が利用できる入り口はどこですか。","北の入り口です。","北口です。","裏口の階段です。","Zugang ausdrücklich.","車椅子の利用者は北の入り口","それなら問題ありません"],
["chronology","参加者へ知らせる前に何を確認しますか。","人数です。","十二人以内か確認します。","本の長さだけです。","Personenzahl ist bindende Grenze.","部屋の定員は十二人","人数を確認してから"]
],
["Entwickle einen tragfähigen Ablauf.","四時に始め、読む部分を短くして五時に終わります。人数は十二人までに確認します。","必要なら次の読書会を別の日に考えます。","二時間延長して全員入れます。","Zeit und Kapazität."],
["Schreibe höfliche Mitteilung in 2–3 Sätzen.","読書会は土曜日の午後四時から五時までです。部屋の定員は十二人なので、参加する方は事前にご連絡ください。ほかの利用者のため、静かに活動します。","ご参加を希望する方は人数確認にご協力ください。","何人でも夜まで部屋を使えます。","Höflich und präzise."],
["施設担当","北の入り口は土曜日に点検があります。車椅子の方は東側のスロープからお入りください。","Hauspersonal: Samstag Nordeingang unter Wartung, Ost-Rampe nutzbar.","Aktualisiere Zugang ohne vollständige Unzugänglichkeit zu behaupten.","ご連絡ありがとうございます。北口は使えないので、東側のスロープをご案内します。参加者にも伝えます。","承知しました。新しい入り口をお知らせします。","車椅子では建物に入れません。","Alternative bleibt verfügbar."],
["北口が閉まるから、車椅子の人は参加できなくなりました。","Korrigiere ungestützte Ausschlussaussage.","北口は点検中ですが、東側のスロープから入れます。参加希望者に案内します。","入り口が変わっただけです。","Barrierefreiheit nicht pauschal negieren."],
["Neue Schreibgruppe: Mittwoch 18–19 Uhr, maximal zehn Plätze, Haupteingang gesperrt, Rampe Süden offen.","会は六時から七時までで、定員は十人です。南側のスロープを使って入れます。","参加人数と新しい入り口を案内します。","入り口が閉まったので全員来られません。","Neue Veranstaltung."],
"利用許可・参加人数・アクセスは別々の条件; Einschränkung != Ausschluss.",["sanka","kakunin","henkou"]],
["seasonal-market","旬の品物を選ぶ","p25:shopping","買い物の比較","service",
"Gemüsehändler ändert Sortiment und Herkunftshinweis; eine Person hat Allergie, nicht alle Produkte sind geeignet.",
"Bestand, Eigenschaftsangaben, Allergievermeidung und Kaufentscheidung sorgfältig unterscheiden",
[
["店の案内","今週は新しいりんごと秋の野菜が入荷しました。りんごは一袋四百円、野菜セットは七百円です。","Ladeninformation: Neue Äpfel und Herbstgemüse, Äpfel 400 Yen/Beutel, Gemüsekiste 700."],
["商品の説明","野菜セットにはかぼちゃとにんじんが入っています。季節によってほかの材料は変わるので、購入前に確認してください。","Produktinfo: Kürbis/Karotten, andere Zutaten saisonabhängig, vor Kauf prüfen."],
["安全のお願い","食物アレルギーがある方は、必ず商品の材料を店員に確認してください。わからない時は購入を待ってください。","Hinweis: Bei Lebensmittelallergie Zutaten ausdrücklich prüfen, bei Unklarheit mit Kauf warten."]],
[
["アヤ","友達はある食べ物を食べられないので、セットの材料を全部確認したいです。","Aya: Freundin kann bestimmte Zutat nicht essen; möchte alle Bestandteile klären."],
["ユキ","りんごだけなら簡単だけど、野菜セットは日によって違うんだね。","Yuki: Äpfel einfacher, Gemüsekiste je nach Tag anders."]],
[
["店員","今日の野菜セットにはかぼちゃ、にんじん、玉ねぎが入っています。","Personal: Heutige Kiste enthält Kürbis, Karotten und Zwiebeln."],
["アヤ","説明ありがとうございます。ほかの材料は入っていませんか。","Aya: Danke, sind weitere Zutaten enthalten?"],
["店員","作業する場所ではほかの野菜も扱っています。詳しくは担当者に確認します。","Personal: Im Arbeitsbereich werden weitere Gemüse verarbeitet; weitere Details werden geklärt."],
["ユキ","全部確認できるまで、無理に買わない方がいいね。","Yuki: Besser nicht kaufen, bis alles geklärt."]],
[
["status","安全について必要な確認はもうすべて終わりましたか。","いいえ、担当者に確認中です。","いいえ、まだわからないことがあります。","はい、三つの材料を聞いたから完了です。","Zutatenliste und mögliche andere Verarbeitung getrennt.","材料を店員に確認してください","詳しくは担当者に確認します"],
["evidence","今日説明されたセットの三つの野菜は何ですか。","かぼちゃ、にんじん、玉ねぎです。","かぼちゃとにんじんと玉ねぎです。","りんごと魚と肉です。","Sprecher zählt ausdrücklich.","かぼちゃとにんじん","かぼちゃ、にんじん、玉ねぎ"],
["inference","材料が不明なまま必ず買うべきですか。","いいえ、確認するまで待ちます。","いいえ、無理に買いません。","はい、値段が安いので買います。","Risiko vor Preis.","わからない時は購入を待ってください","全部確認できるまで"]
],
["Verantworte vorsichtige Kaufentscheidung.","友達が食べられない材料があるので、すべて確認できてから買うか決めます。","担当者の確認を待ちます。","安いから確認せず買います。","Kein medizinischer Eignungsbeweis."],
["Schreibe höfliche Rückfrage nach Zutaten und möglicher Verarbeitung.","友達には食べられない物があります。今日のセットの材料と、同じ場所で扱っているほかの野菜について確認していただけますか。わかるまで購入は待ちたいです。","詳しい材料の説明をお願いします。確認してから決めます。","三つだけなのでアレルギーでも必ず安全です。","Sicherheit nicht erfinden."],
["店員","担当者によると、今日は同じ道具で別の材料も扱いました。安全かどうかはこちらでは判断できません。","Personal: Gleiche Geräte auch für andere Zutaten, kann Sicherheit nicht garantieren.","Informiere ohne medizinische Diagnose und verzichte bei Unsicherheit.","詳しい説明をありがとうございます。安全だと確認できないので、今回は購入を見送ります。","無理せず、別の商品について確認します。","絶対に安全だとわかりました。","Unklarheit bleibt trotz zusätzlicher Auskunft."],
["同じ道具でも三つの野菜だけだから必ず大丈夫です。","Korrigiere unbelegte Allergiesicherheit.","別の材料も同じ道具で扱っているため、安全かまだわかりません。今回は購入を待ちます。","確認が取れない場合は買いません。","Keine medizinisch unzulässige Sicherheit behaupten."],
["Neuer Imbiss: Reisgericht 600 Yen, Soße enthält unbekannte Zutaten, Küchenpersonal nutzt gemeinsame Utensilien; kein Allergiesicherheitsnachweis.","材料と調理方法がまだ確認できないので、今回は注文を待ちます。","安全かどうかわかるまで、ほかの物を選びます。","ご飯なので必ず安全です。","Andere Lebensmittel."],
"商品表示の情報 ≠ 個人の安全確認; unklare Allergiesituation nicht automatisch freigeben.",["zairyou","kakunin","hitsuyou"]],
["museum-schedule","博物館の無料の日","p25:directions","公共施設の利用","polite",
"Museum hat freien Eintritt an bestimmten Tagen, aber eine kostenpflichtige begrenzte Führung.",
"Eintritt, Führung, Anmeldung und aktuelles Zeitfenster unabhängig rekonstruieren",
[
["博物館の案内","毎月第一日曜日は展示室への入場が無料です。通常は午前十時から午後五時まで開いています。","Museuminfo: Erster Sonntag im Monat kostenfreier Ausstellungseintritt, regulär 10–17 Uhr."],
["見学ツアー","特別な案内ツアーは午前十一時からです。無料の日でもツアーの料金は五百円で、申し込みが必要です。","Sonderführung 11 Uhr kostet auch am Gratistag 500 Yen, Anmeldung erforderlich."],
["今月のお知らせ","今月の第一日曜日は電気の点検があるため、展示室は午後四時に閉まります。","Sonderinfo: Diesen ersten Sonntag schließt Ausstellung wegen Wartung 16 Uhr."]],
[
["エミ","無料の日に行きたいけど、十一時のツアーにも参加できるかな。","Emi: Will Gratistag nutzen, fragt nach 11-Uhr-Führung."],
["ハル","展示室が無料でも、ツアーは有料らしいから先に確認しよう。","Haru: Ausstellung gratis, Führung bezahlt; vorher prüfen."]],
[
["受付","ツアーはまだ二人分の空きがありますが、予約が必要です。","Empfang: Noch zwei Führungsplätze frei, aber Reservierung erforderlich."],
["エミ","二人で申し込みたいです。料金は一人五百円ですか。","Emi: Will zu zweit anmelden, 500 Yen pro Person?"],
["受付","はい。ただし、受付で予約が完了してから参加できます。","Empfang: Ja, nur nach abgeschlossener Anmeldung."]],
["ハル","それなら、予約の確認をしてから行こう。","Haru: Erst Reservierung klären."]],
[
["status","無料なのは何ですか。","展示室への入場です。","展示を見るだけなら無料です。","特別ツアーも無料です。","Ausstellung und Führung.","展示室への入場が無料です","料金は一人五百円ですか"],
["chronology","今月の無料日は何時に閉まりますか。","午後四時です。","十六時です。","午後五時のままです。","Monatsspezifische Ausnahme.","通常は午前十時から午後五時","展示室は午後四時に閉まります"],
["evidence","案内ツアーに参加する前に何が必要ですか。","予約を完了することです。","受付で申し込みの確認をします。","空席があるだけで大丈夫です。","Freie Plätze sind keine Zusage.","申し込みが必要です","予約が完了してから"]
],
["Wähle gute Besuchsplanung.","展示室は無料ですが、ツアーは一人五百円で予約が必要です。二人分を確認します。","四時までに展示を見て、ツアーの申し込みを確認します。","無料の日だからツアーも予約不要です。","Zwei Berechtigungen."],
["Schreibe Freund die korrekte aktuelle Besuchsinfo.","今月の第一日曜日は展示室が無料だけど、四時に閉まるよ。十一時のツアーは一人五百円で、事前の予約が必要だって。申し込めるか確認しよう。","無料で展示を見られるけど、ツアーは別にお金がかかるよ。","ツアーも無料で、五時まで予約なしで入れるよ。","Kumulierte Korrektheit."],
["受付","確認しました。十一時のツアーは二人分ご予約できました。集合は十時五十分に東のロビーです。","Empfang: Reservierung für zwei bestätigt; Treffpunkt Ostlobby 10:50.","Neue echte Buchung anerkennen.","ありがとうございます。十一時のツアーに二人で参加します。十時五十分に東のロビーで待ちます。","予約の確認をありがとうございます。集合時間を守ります。","まだ予約できないので行きません。","Status verändert sich tatsächlich."],
["ツアーに空きがあるだけなので、予約はまだできていません。","Korrigiere nach der letzten ausdrücklichen Bestätigung.","二人分のツアー予約が確定しました。十時五十分に東のロビーに集合します。","十一時のツアーに参加する予定です。","Aktuelle Buchungsbestätigung."],
["Neues Aquarium: Monatsfeiertag Eintritt frei, Fütterungstour 800 Yen extra, 13 Uhr nach Buchung bestätigt, Treffpunkt 12:50 Südeingang.","展示は無料ですが、案内ツアーには八百円かかります。予約が確定しているので、十二時五十分に南口へ行きます。","ツアーの料金と集合時間を確認します。","展示が無料なのでツアーも無料です。","Andere Einrichtung."],
"無料入場 ≠ 有料ツアー; offene Verfügbarkeit kann durch spätere Bestätigung tatsächlich erledigt werden.",["moushikomi","yoyaku","kakunin"]],
["school-notice-conflict","二つの連絡が違います","p26:library-project","学校連絡の訂正","polite",
"Eltern erhalten veraltete Schulanzeige und aktuelle telefonische Ausnahme; öffentliche Ankündigung braucht zeitlich klare Korrektur.",
"Unterschiedliche Quellen und Fristen klar trennen und widerspruchsfrei neu formulieren",
[
["先週の学校案内","来週の保護者会は水曜日の午後六時から、学校の二階で行います。","Vorwöchiger Schulbrief: Elternabend Mittwoch 18 Uhr, zweiter Stock."],
["学校のウェブサイト","会場の工事が始まったため、保護者会の場所を図書室に変更する予定です。時間はまだ確認中です。","Website: Raumwechsel zur Bibliothek geplant, Zeit noch in Klärung."],
["出席の注意","会場が変更された場合も、参加できるかどうかは前日までに学校へ伝えてください。","Teilnahmeregel: Auch bei Ortswechsel bis Vortag Zu- oder Absage an Schule melden."]],
[
["母","サイトを見たけど、六時のままなのかな。確認してから予定を書きたい。","Mutter: Fragt, ob 18 Uhr bleibt, will vor Kalendereintrag klären."],
["父","仕事が長引くかもしれないから、開始時間と場所を分けて聞いておこう。","Vater: Arbeitszeit unsicher, Ort und Uhrzeit separat fragen."]],
[
["先生","保護者会は水曜日の午後六時半からになりました。","Lehrkraft: Elternabend Mittwoch 18:30."],
["母","場所は図書室に決まったのですか。","Mutter: Ist Bibliothek bestätigt?"],
["先生","はい、一階の図書室で行います。参加の返事は火曜日までにお願いします。","Lehrkraft: Ja, Bibliothek im Erdgeschoss, Antwort bis Dienstag."],
["父","時間と場所が両方変わったね。参加できるか確認してから返事しよう。","Vater: Beide geändert; nach eigener Prüfung Zusage."]],
[
["chronology","保護者会は最終的に何時からですか。","水曜日の午後六時半からです。","水曜日の十八時三十分からです。","水曜日の六時です。","Neuere mündliche Auskunft.","水曜日の午後六時から","午後六時半からになりました"],
["evidence","最終会場はどこですか。","一階の図書室です。","一階にある図書室です。","二階の教室です。","Bibliothek nun genehmigt.","図書室に変更する予定です","一階の図書室で行います"],
["status","参加の返事はいつまでにしますか。","火曜日までです。","水曜日の前の日までです。","水曜日の夜です。","Teilnahmebedingung bleibt mit neuer Zeit.","前日までに学校へ伝えて","火曜日までにお願いします"]
],
["Wähle nächsten Schritt, wenn eigene Teilnahme noch offen.","新しい時間と場所を家族に伝え、火曜日までに参加できるか学校へ返事します。","六時半に行けるか仕事の予定を確認します。","古い六時の二階に行って、返事はしません。","Alle aktualisierten Daten."],
["Schreibe höfliche Rückmeldung, dass du Teilnahme noch prüfen musst.","ご連絡ありがとうございます。保護者会は水曜日の午後六時半に一階の図書室で行うと承知しました。仕事の予定を確認し、火曜日までに出席できるかお返事します。","変更内容を確認しました。期限までにご連絡いたします。","水曜日の六時に二階へ伺います。","Höfliche Präzision ohne voreilige Zusage."],
["先生","火曜日になりました。人数を確認したいので、本日中に出席か欠席かをお知らせください。","Lehrkraft: Heute Dienstag, definitive Zusage/Absage bis heute.","Reagiere ehrlich: Du kannst nicht kommen, bitte nach Materialien fragen.","申し訳ありませんが、仕事のため今回は欠席します。後で配布資料を受け取れるでしょうか。","欠席のご連絡をします。資料について教えてください。","参加できるかわかりませんが返事しません。","Konkrete Teilnahmeentscheidung fristgerecht."],
["水曜日は六時から二階で、仕事が終わったら必ず参加します。","Korrigiere frühere Zeiten und tatsächliche Absage.","今回は欠席します。会は水曜日の六時半に一階の図書室で行われます。資料を後で確認したいです。","火曜日に欠席を学校へ伝えました。","Eigener neuer Status muss im Bericht stimmen."],
["Neue Stadtteilsitzung: Ursprünglich Freitag 17 Uhr Obergeschoss, nun Freitag 17:45 Raum unten, Antwort Donnerstag, Person sagt abgesagt.","会は金曜日の五時四十五分に下の部屋で行います。今回は欠席すると木曜日までに連絡します。","新しい場所と時間を確認し、参加できないことを伝えます。","古い時間に二階へ行きます。","Neue Institution."],
"古い連絡から新しい日時を正確に更新し、実際の返事も別に伝える.",["henkou","renraku","kakunin"]],
["town-bus-repair","町のバスが止まったら","p25:transport","地域交通の変更","polite",
"Ein Regionalbus wird nach einer früheren Ankündigung eingestellt; Reisende prüfen Umsteigemöglichkeiten, Kosten und Zugang zu einer Bürgersprechstunde.",
"Veralteten Busplan, aktuellen Ersatzverkehr und nur vorgeschlagene Fahrten getrennt kommunizieren",
[
["古いバスの時刻表","図書館前から市役所へ行くバスは、平日の午前九時十分に出発します。乗車料金は二百円です。","Alter Fahrplan: Bus vor Bibliothek zum Rathaus werktags 9:10, 200 Yen."],
["今週のお知らせ","道路工事のため、木曜日はこのバスが走りません。臨時のバスは南駅から九時半に出る予定です。","Wocheninfo: Donnerstag alte Linie wegen Bau gesperrt; Ersatzbus voraussichtlich 9:30 vom Südbahnhof."],
["市役所の案内","市役所の相談は午前十時からです。遅れる場合は、相談の窓口に事前にご連絡ください。","Rathausinfo: Beratung 10 Uhr, bei Verspätung vorher am Schalter melden."]],
[
["ハナ","九時十分のバスに乗るつもりだったけど、木曜日は動かないんだね。","Hana: Wollte 9:10-Bus, Donnerstag fährt er nicht."],
["タク","南駅まで歩くと二十分かかるよ。臨時バスに間に合うか調べよう。","Taku: Fußweg zum Südbahnhof 20 Minuten; Anschluss prüfen."]],
[
["運転手","臨時バスは南駅を九時半に出ますが、市役所に着く時間はまだ確認中です。","Fahrer: Ersatzbus 9:30 vom Südbahnhof, Ankunft am Rathaus noch ungeklärt."],
["ハナ","料金は前の二百円のままですか。","Hana: Bleibt Preis 200 Yen?"],
["運転手","料金は今、会社に確認しています。前と同じだとはまだ言えません。","Fahrer: Preis wird geprüft, bisheriger Tarif nicht bestätigt."],
["タク","時間と料金を確認してから、市役所に遅れる可能性も知らせよう。","Taku: Zeit, Preis und mögliche Verspätung mit Rathaus klären."]],
[
["status","古い九時十分のバスは木曜日も走りますか。","いいえ、木曜日は走りません。","いいえ、工事のため中止です。","はい、九時十分に必ず走ります。","Ein früher gültiger Fahrplan kann ausfallen.","木曜日はこのバスが走りません","臨時バスは南駅を九時半に出ます"],
["evidence","臨時バスの料金は二百円と決まりましたか。","いいえ、確認中です。","いいえ、同じ料金かまだわかりません。","はい、前と同じです。","Altes Ticket sagt nichts Verbindliches über Ersatzbus.","乗車料金は二百円です","前と同じだとはまだ言えません"],
["chronology","十時の相談に遅れる可能性がある時はどうしますか。","先に市役所の窓口へ連絡します。","相談の前に連絡します。","何も連絡せず遅れます。","Abfahrtszeit des Ersatzbusses garantiert nicht Ankunft.","遅れる場合は、相談の窓口に事前に","市役所に着く時間はまだ確認中です"]
],
["Überlege eine verantwortliche Reiseentscheidung.","南駅の九時半の臨時バスを確認し、料金と到着の予定を聞きます。遅れそうなら市役所に連絡します。","無理のない時間に南駅へ行き、相談に間に合うか確かめます。","古いバスに乗れば必ず十時に着きます。","Jeder Verkehrsparameter muss erneut belegt werden."],
["Schreibe zwei bis drei höfliche japanische Sätze an das Rathaus.","木曜日はいつものバスが工事で走らないそうです。南駅から九時半の臨時バスがありますが、市役所に着く時間はまだわかりません。相談に遅れるかもしれないため、事前にご連絡しました。","臨時バスの時間を確認しています。遅れそうな場合は改めて知らせます。","いつものバスで十時に必ず着きます。","Höfliche und ehrliche Ungewissheit."],
["運転手","会社から返事が来ました。臨時バスの料金は三百円で、市役所には十時十分ごろ着く予定です。","Fahrer: Unternehmen bestätigt Ersatzbus 300 Yen, Ankunft voraussichtlich 10:10.","Reagiere auf neue bestätigte Kosten und nur geplante Ankunft.","教えていただきありがとうございます。料金は三百円で、十時十分ごろの到着予定なのですね。市役所へ遅れることを連絡します。","新しい時間と料金を確認しました。相談の窓口に知らせます。","二百円で十時ちょうどに到着しました。","Kosten bestätigt, Ankunft nur voraussichtlich."],
["木曜日はいつものバスがあり、二百円で九時十分に図書館前を出ます。","Korrigiere alte Linie und unverbindliche Ankunft.","木曜日は南駅から九時半の臨時バスが出ます。料金は三百円で、到着は十時十分ごろの予定です。","相談には少し遅れる可能性があるので、事前に連絡します。","Hintereinander Quellen überschrieben."],
["Neuer Fährersatz: Original Fähre 8:45 für 400 Yen fährt Freitag nicht, Ersatzbus 9:15 für 500 Yen, Ankunft 10:05 nur geplant.","金曜日は船が中止で、九時十五分のバスを使う予定です。料金は五百円で、到着は十時五分ごろなので、遅れるなら連絡します。","交通の新しい条件を確認します。","船は予定どおり四百円で出ます。","Andere Verkehrsmittel und Beträge."],
"古い時刻表・臨時便・発車確定・到着予定・料金確定は別の情報.",["jikokuhyou","henkou","kakunin"]]

];
export const p59MissionsD=raw.map(authoredP59Compact);
