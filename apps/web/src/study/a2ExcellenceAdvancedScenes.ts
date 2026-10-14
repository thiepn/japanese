/**
 * E04 original A2.2-oriented source material. No Marugoto dialogue, text or media reproduced.
 * Original scenes remain readable without inventing a canonical Can-do assignment.
 */
export interface E04Scene {
 id:string;title:string;goal:string;setting:string;keywords:readonly string[];
 turns:readonly {who:string;ja:string;en:string;intention:string}[];
 reading:{ja:string;en:string;title:string};
 focus:readonly {expression:string;meaning:string;trap:string}[];
 listening:{gist:string;foils:readonly [string,string];detailQuestion:string;detailAnswer:string;detailFoils:readonly [string,string];correction:string};
 comprehension:{gist:string;foils:readonly [string,string];detailQuestion:string;detailAnswer:string;detailFoils:readonly [string,string];correction:string};
 response:{question:string;answer:string;foils:readonly [string,string];correction:string};
 recall:{question:string;answers:readonly string[];correction:string};
 writing:{prompt:string;selfChecks:readonly string[]};
 speaking:{prompt:string;selfChecks:readonly string[]};
 transfer:{audio:string;question:string;answer:string;foils:readonly [string,string];reading:string;readingQuestion:string;readingAnswer:string;readingFoils:readonly [string,string];correction:string};
}
export const E04_SCENES:readonly E04Scene[]=[
{
 id:"train-disruption",title:"Recover from a cancelled train",goal:"Explain a travel disruption, compare practical alternatives and agree on a revised meeting plan.",
 setting:"Two friends are trying to reach a museum while the direct train service has stopped.",
 keywords:["train","transport","travel","station","route","direction","movement","traffic","public transportation","journey"],
 turns:[
 {who:"ミナ",ja:"大変です。駅の案内によると、電車が事故で止まっているそうです。",en:"This is a problem. According to the station notice, trains have stopped because of an accident.",intention:"Report a problem using an attributed source."},
 {who:"ケン",ja:"そうですか。博物館の予約は二時でしたよね。",en:"I see. Our museum reservation was for two, wasn't it?",intention:"Confirm a constraint."},
 {who:"ミナ",ja:"はい。バスで行けば間に合うかもしれませんが、道が混んでいるそうです。",en:"Yes. We might make it by bus, but apparently the roads are congested.",intention:"Compare an alternative and its uncertainty."},
 {who:"ケン",ja:"それなら、地下鉄で中央駅まで行って、そこから歩くのはどうですか。",en:"Then how about taking the subway to Central Station and walking from there?",intention:"Offer an alternative itinerary."},
 {who:"ミナ",ja:"そのほうが確実そうですね。先に博物館に遅れるかもしれないと連絡しておきます。",en:"That sounds more reliable. I'll let the museum know in advance that we might be late.",intention:"Choose an option and proactively communicate."},
 {who:"ケン",ja:"お願いします。中央駅で乗り換えなくてもいいので、助かります。",en:"Please do. It helps that we won't need to transfer at Central Station.",intention:"Agree and identify an advantage."}],
 reading:{title:"旅の変更メモ",ja:"本日の午後、事故のため市内の一部の電車が運転を見合わせています。博物館へ行く方は、地下鉄で中央駅まで行き、北口から徒歩約十五分です。路線バスは道路の混雑により遅れが出ています。予約の時間に間に合わない場合は、施設へ事前に連絡してください。",en:"This afternoon, some city trains are suspended due to an accident. For the museum, take the subway to Central Station, then walk approximately fifteen minutes from the north exit. Buses are delayed because of road congestion. If you cannot arrive by your reserved time, contact the venue in advance."},
 focus:[{expression:"〜によると／〜そうです",meaning:"According to a source / apparently",trap:"The speaker reports information rather than claiming to have personally witnessed it."},{expression:"〜ば",meaning:"if / provided that",trap:"A condition does not guarantee reaching the destination on time."},{expression:"〜ておきます",meaning:"do something in preparation",trap:"It means contacting the museum in advance, not after arriving."},{expression:"そのほうが",meaning:"that option is preferable",trap:"Refers back to the newly suggested route."}],
 listening:{gist:"They choose a subway-and-walk alternative after train service stops.",foils:["They decide to cancel the museum permanently.","They take the delayed bus without discussion."],detailQuestion:"ミナさんは先に誰に連絡しますか。",detailAnswer:"博物館",detailFoils:["バスの会社","駅員"],correction:"She will notify the museum of a possible delay, not report the incident to the station."},
 comprehension:{gist:"The notice advises subway access and advance contact about lateness.",foils:["The notice says all routes are operating normally.","The notice recommends taking a taxi only."],detailQuestion:"中央駅から博物館まで、どう行きますか。",detailAnswer:"歩いて行きます。",detailFoils:["バスに乗ります。","電車に乗り換えます。"],correction:"The notice specifies a walk of around fifteen minutes from the north exit."},
 response:{question:"ケン：バスも遅れているそうです。どうしましょうか。　ミナ：＿＿＿",answer:"地下鉄で行くのはどうですか。",foils:["昨日は歩きました。","予約を食べましょう。"],correction:"〜のはどうですか suggests a practical alternative; past narration or an unrelated request does not solve the disruption."},
 recall:{question:"Write: 'I'll contact the museum in advance.'",answers:["先に博物館に連絡しておきます。","博物館に先に連絡しておきます。"],correction:"連絡しておきます expresses preparing before the potential problem."},
 writing:{prompt:"Write a connected message to someone expecting you: state the disruption, cite the source, propose another route and explain the likely delay.",selfChecks:["運転","連絡"]},
 speaking:{prompt:"Role-play rescheduling an arrival: explain the interruption, weigh bus versus subway, ask your partner's view and agree on a plan.",selfChecks:["そうです","どうですか"]},
 transfer:{audio:"駅員：台風のため、午後の特急はすべて運休です。普通電車は動いていますが、通常より時間がかかります。",question:"午後の特急はどうなっていますか。",answer:"運休しています。",foils:["通常どおりです。","五分遅れています。"],reading:"空港へ行く方へ。快速電車は本日運転していません。普通電車で三つ先の駅まで行き、空港バスに乗り換えてください。混雑が予想されるため、早めに出発することをおすすめします。",readingQuestion:"空港へは何に乗り換えますか。",readingAnswer:"空港バス",readingFoils:["快速電車","地下鉄"],correction:"A different disruption still requires distinguishing cancelled services from the available alternative."}
},
{
 id:"hotel-reservation",title:"Resolve a reservation misunderstanding",goal:"Explain a booking discrepancy, provide evidence and reach a courteous solution.",
 setting:"At a small hotel, a guest discovers that the reserved room type does not match the booking.",
 keywords:["hotel","reservation","travel","accommodation","booking","stay","room","check in","lodging","service"],
 turns:[
 {who:"受付",ja:"いらっしゃいませ。ご予約のお名前をお願いします。",en:"Welcome. May I have the name on your reservation?",intention:"Request identifying booking information."},
 {who:"アリ",ja:"アリです。二泊の予定で、禁煙の部屋を予約したはずなんですが。",en:"It's Ali. I'm staying two nights, and I believe I reserved a non-smoking room.",intention:"Explain a discrepancy without accusation."},
 {who:"受付",ja:"申し訳ございません。こちらでは喫煙室になっています。確認いたします。",en:"I'm very sorry. Our record shows a smoking room. I'll check.",intention:"Acknowledge the issue and verify."},
 {who:"アリ",ja:"予約のメールには『禁煙』と書いてあります。見ていただけますか。",en:"My confirmation email says non-smoking. Would you please look at it?",intention:"Present supporting evidence and request review."},
 {who:"受付",ja:"失礼いたしました。禁煙の部屋をご用意できますが、少々お待ちいただけますか。",en:"My apologies. We can prepare a non-smoking room, but could you wait a moment?",intention:"Offer a remedy with a limitation."},
 {who:"アリ",ja:"はい、大丈夫です。対応していただいてありがとうございます。",en:"Yes, that's fine. Thank you for handling it.",intention:"Accept and acknowledge the response."}],
 reading:{title:"ホテルからのお知らせ",ja:"ご予約内容：十月二十日から二泊、禁煙シングルルーム一室、朝食付き。チェックインは午後三時からです。到着が午後十時を過ぎる場合は、ホテルまでご連絡ください。予約内容に相違がある場合は、このメールを受付でお見せください。",en:"Reservation: two nights from October 20, one non-smoking single room with breakfast. Check-in begins at 3 p.m. If arriving after 10 p.m., contact the hotel. If reservation details differ, show this email at reception."},
 focus:[{expression:"〜はずなんですが",meaning:"I understood/expected that...",trap:"Softer than a categorical accusation and signals room for checking."},{expression:"〜ていただけますか",meaning:"Could you kindly...?",trap:"Requests service politely rather than commanding."},{expression:"確認いたします",meaning:"I will confirm (humble business style)",trap:"Staff uses service-register language; guests need not mimic every honorific form."},{expression:"〜をご用意できます",meaning:"We can prepare...",trap:"An offer may still require waiting."}],
 listening:{gist:"Ali and staff resolve a non-smoking room reservation discrepancy.",foils:["Ali changes hotels without speaking.","Ali books a smoking room intentionally."],detailQuestion:"受付の人は何をお願いしましたか。",detailAnswer:"少し待つこと",detailFoils:["料金を二回払うこと","予約を取り消すこと"],correction:"The staff can provide the correct room but asks the guest to wait."},
 comprehension:{gist:"The confirmation email says non-smoking, two nights, breakfast included.",foils:["Only one night with no breakfast.","A smoking double room was reserved."],detailQuestion:"チェックインは何時からですか。",detailAnswer:"午後三時",detailFoils:["午前十時","午後十時"],correction:"3 p.m. is check-in start; 10 p.m. is the deadline requiring prior contact."},
 response:{question:"受付：予約と違うようです。確認いたします。　客：＿＿＿",answer:"ありがとうございます。よろしくお願いします。",foils:["もう二泊しました。","禁煙を食べます。"],correction:"The staff has offered to verify, so acknowledgment is appropriate."},
 recall:{question:"Write the polite request: 'Could you take a look at it?'",answers:["見ていただけますか。","見ていただけますか"],correction:"〜ていただけますか is a polite request; don't confuse it with a statement that something was already seen."},
 writing:{prompt:"Write a hotel message explaining a discrepancy between the booking confirmation and the room, quoting only the relevant details and requesting a correction politely.",selfChecks:["予約","確認"]},
 speaking:{prompt:"At reception, explain what you expected, respond to the clerk's clarification, and negotiate an acceptable remedy.",selfChecks:["予約","お願いします"]},
 transfer:{audio:"受付：申し訳ございません。朝食付きのご予約ですが、朝食券を渡し忘れました。ただいまお持ちします。",question:"何を渡し忘れましたか。",answer:"朝食券",foils:["部屋の鍵","予約のメール"],reading:"ご予約は禁煙ツインルーム一室、三泊です。駐車場をご利用の場合は、到着前にご連絡ください。料金は現地でのお支払いです。",readingQuestion:"支払いはどこでしますか。",readingAnswer:"現地",readingFoils:["予約した時","空港"],correction:"The new problem concerns a missing breakfast voucher, not an incorrect room category."}
},
{
 id:"store-return",title:"Resolve a faulty purchase",goal:"Explain a product problem, discuss the receipt and request a realistic exchange.",
 setting:"A customer returns to an electronics counter after a recently purchased charger stops working.",
 keywords:["shopping","store","return","exchange","repair","product","buy","purchase","customer","service"],
 turns:[
 {who:"店員",ja:"いらっしゃいませ。本日はどうされましたか。",en:"Welcome. How can I help you today?",intention:"Open a service conversation."},
 {who:"レナ",ja:"昨日買った充電器が使えなくなってしまいました。交換できますか。",en:"The charger I bought yesterday has stopped working. Could it be exchanged?",intention:"Describe the problem and request remedy."},
 {who:"店員",ja:"ご不便をおかけして申し訳ありません。レシートはお持ちですか。",en:"I'm sorry for the inconvenience. Do you have the receipt?",intention:"Apologize and request proof of purchase."},
 {who:"レナ",ja:"はい、こちらです。買ったときから接続が不安定でした。",en:"Yes, here it is. The connection was unreliable from the beginning.",intention:"Provide evidence and clarify the timeline."},
 {who:"店員",ja:"同じ商品が在庫にあるか確認します。少々お待ちください。",en:"I'll check whether we have the same item in stock. Please wait a moment.",intention:"Explain the next service step."},
 {who:"レナ",ja:"分かりました。同じ物がなければ、返金について相談したいです。",en:"Understood. If you don't have the same item, I'd like to discuss a refund.",intention:"State a conditional alternative without demanding it."}],
 reading:{title:"購入後のご案内",ja:"ご購入いただいた商品に問題がある場合は、まず店頭で状態を確認いたします。レシートまたは購入履歴をご用意ください。同じ商品の在庫がない場合は、スタッフに交換方法や返金についてご相談ください。条件は商品の状態によって異なります。",en:"If a purchased product has a problem, staff will first check its condition. Prepare a receipt or purchase history. If no identical stock remains, discuss exchange or refund options with staff. Conditions vary depending on the product's state."},
 focus:[{expression:"〜てしまいました",meaning:"an unfortunate or completed outcome",trap:"Marks the undesired breakdown; not a voluntary decision."},{expression:"〜たときから",meaning:"since the time when...",trap:"The issue existed from purchase; it did not first arise at the store visit."},{expression:"〜なければ",meaning:"if there isn't / unless",trap:"The refund is conditional on stock availability."},{expression:"相談したいです",meaning:"I would like to discuss",trap:"Softer than asserting a guaranteed legal entitlement."}],
 listening:{gist:"A customer asks about exchanging an unreliable charger.",foils:["The customer wants a second charger as a gift.","The staff refuses to listen."],detailQuestion:"レナさんは何を持ってきましたか。",detailAnswer:"レシート",detailFoils:["商品の箱だけ","保証書だけ"],correction:"The customer hands over the receipt, which the staff requested."},
 comprehension:{gist:"The store checks the product and proof of purchase before discussing remedies.",foils:["Every return is refunded automatically.","The notice says never to contact staff."],detailQuestion:"同じ商品がない場合、何について相談できますか。",detailAnswer:"交換や返金",detailFoils:["旅行の予約","配達の天気"],correction:"The notice explicitly mentions exchange methods and refunds as topics for discussion, not automatic guarantees."},
 response:{question:"店員：同じ商品がないかもしれません。　客：＿＿＿",answer:"それなら、返金について相談したいです。",foils:["もう一度買ってしまいました。","明日、電車が止まります。"],correction:"A conditional request to discuss a refund fits an unavailable replacement."},
 recall:{question:"Write: 'I would like to discuss an exchange.'",answers:["交換について相談したいです。","交換について相談したいです"],correction:"〜について marks the topic, and 相談したいです politely requests a discussion."},
 writing:{prompt:"Write a short customer-service message: state the defect, when it began, relevant purchase proof and two acceptable remedies.",selfChecks:["買った","交換"]},
 speaking:{prompt:"Explain a faulty purchase, answer a question about the receipt and propose an alternative if a replacement is unavailable.",selfChecks:["交換","相談"]},
 transfer:{audio:"店員：同じサイズは売り切れですが、別の色ならご用意できます。　客：そうですか。では、青い物を見せてください。",question:"お客さんは次に何を見ますか。",answer:"青い商品",foils:["同じ色の商品","修理代"],reading:"修理のお知らせ：お預かりした機器は部品の取り寄せが必要です。修理には一週間ほどかかる見込みです。完成後にメールでご連絡します。",readingQuestion:"修理が終わったら、どう知らせますか。",readingAnswer:"メール",readingFoils:["電話だけ","手紙"],correction:"The new case offers a different color due to stock; the repair notice promises an email, not immediate pickup."}
},
{
 id:"festival-volunteering",title:"Coordinate a local festival task",goal:"Assign responsibilities, explain an obstacle and politely renegotiate the task plan.",
 setting:"A neighborhood group prepares a multicultural festival and discovers there are too few helpers.",
 keywords:["festival","event","community","celebration","volunteer","prepare","organize","group","party","activity"],
 turns:[
 {who:"ケン",ja:"来週のお祭りの準備ですが、受付の人が二人足りません。",en:"About preparation for next week's festival, we are short two people at reception.",intention:"Identify a specific staffing shortage."},
 {who:"ユナ",ja:"私は午後なら手伝えます。でも、午前中は仕事が入っています。",en:"I can help in the afternoon, but I'm working in the morning.",intention:"Offer limited availability."},
 {who:"ケン",ja:"助かります。午後一時から三時までお願いしてもいいですか。",en:"That helps. Could I ask you to work from one to three?",intention:"Confirm a bounded request."},
 {who:"ユナ",ja:"はい。ただ、三時から別の予定があるので、時間どおりに終わりたいです。",en:"Yes, but I have another commitment at three, so I'd like to finish on time.",intention:"Set a polite boundary."},
 {who:"ケン",ja:"分かりました。三時には次の担当者が来るようにしておきます。",en:"Understood. I'll arrange for the next person to arrive at three.",intention:"Commit to a transition arrangement."},
 {who:"ユナ",ja:"ありがとうございます。受付で使う資料は前の日にもらえますか。",en:"Thanks. Could I receive the reception materials the day before?",intention:"Request preparation information."}],
 reading:{title:"ボランティアへの連絡",ja:"地域交流祭の受付は午前十時から午後五時までです。午後一時から三時までの担当者は、開始十五分前に集合してください。資料は前日までにメールで送ります。交代する人が遅れた場合は、責任者に連絡してください。自分だけで勤務時間を延長する必要はありません。",en:"Reception for the local exchange festival runs 10 a.m.–5 p.m. Volunteers covering 1–3 p.m. should arrive fifteen minutes before their shift. Materials will be emailed by the previous day. If the next person is delayed, contact the coordinator; do not feel required to extend your own shift alone."},
 focus:[{expression:"〜なら",meaning:"if that time or condition works",trap:"ユナ's offer is only for the afternoon, not the entire day."},{expression:"〜てもいいですか",meaning:"ask permission to make a request",trap:"This is a polite request, not an order."},{expression:"〜ようにしておきます",meaning:"make arrangements in advance",trap:"Indicates intentional preparation for the shift handoff."},{expression:"前の日にもらえますか",meaning:"can I get it the day before?",trap:"The request concerns materials before the event."}],
 listening:{gist:"Yuna agrees to a time-limited afternoon volunteer shift.",foils:["Yuna agrees to work all morning.","The festival is cancelled."],detailQuestion:"ユナさんは何時まで手伝えますか。",detailAnswer:"午後三時",detailFoils:["午後五時","午前十時"],correction:"Her next commitment begins at three, so her shift has to end then."},
 comprehension:{gist:"The volunteer notice gives shift arrival, materials and handoff instructions.",foils:["Everyone must work all day.","Materials are only available after the festival."],detailQuestion:"受付の担当者はいつ集合しますか。",detailAnswer:"開始十五分前",detailFoils:["開始一時間後","三時ちょうど"],correction:"集合 is fifteen minutes before the assigned start, not at the end of the shift."},
 response:{question:"ユナ：三時から別の予定があります。　ケン：＿＿＿",answer:"三時に交代できるようにしておきます。",foils:["五時までお願いします。","祭りは昨日でした。"],correction:"Arrange a handoff that respects the volunteer's stated end time."},
 recall:{question:"Write: 'Could I receive the materials the day before?'",answers:["資料は前の日にもらえますか。","資料を前の日にもらえますか。"],correction:"もらえますか requests receiving the materials; 前の日 indicates before the event."},
 writing:{prompt:"Write a practical volunteer coordination message with assigned shift, responsibilities, one known risk and the handoff plan.",selfChecks:["時","担当"]},
 speaking:{prompt:"Discuss a staffing shortage, offer limited availability, make a reasonable request and confirm the handoff.",selfChecks:["お願いします","まで"]},
 transfer:{audio:"責任者：準備の時間が変わりました。午後四時ではなく、午後三時半に集合してください。遅れそうな人は連絡をお願いします。",question:"新しい集合時間は何時ですか。",answer:"午後三時半",foils:["午後四時","午後五時"],reading:"明日のイベントでは、午前中に会場の椅子を並べて、午後から受付を始めます。資料は受付の机に置いてあります。担当者が来ない場合は、入口の責任者に知らせてください。",readingQuestion:"担当者が来ないとき、誰に知らせますか。",readingAnswer:"責任者",readingFoils:["参加者全員","店員"],correction:"Different times and handoff procedures must be re-read; don't reuse the original shift time."}
},
{
 id:"home-visit-etiquette",title:"Plan a polite home visit",goal:"Accept an invitation, check expectations and express gratitude without overgeneralizing cultural practices.",
 setting:"A Japanese-speaking friend invites a visitor to dinner at home.",
 keywords:["home","family","culture","custom","visit","invitation","meal","friend","social","manners","etiquette"],
 turns:[
 {who:"さくら",ja:"今度の土曜日、よかったら家に夕食を食べに来ませんか。",en:"If you like, would you come to my home for dinner next Saturday?",intention:"Make a warm but optional invitation."},
 {who:"アリ",ja:"ありがとうございます。ぜひ行きたいです。何時ごろ伺えばいいですか。",en:"Thanks. I'd love to. Around what time should I come?",intention:"Accept and check timing politely."},
 {who:"さくら",ja:"六時ごろで大丈夫です。食べられない物はありますか。",en:"Around six is fine. Is there anything you can't eat?",intention:"Clarify dietary needs in advance."},
 {who:"アリ",ja:"魚は食べられますが、えびは食べられません。すみません。",en:"I can eat fish, but not shrimp. Sorry.",intention:"State a clear constraint without exaggerating."},
 {who:"さくら",ja:"分かりました。えびは使わないようにします。気にしないでください。",en:"Understood. I'll make sure not to use shrimp. Don't worry.",intention:"Acknowledge and accommodate the constraint."},
 {who:"アリ",ja:"ありがとうございます。何か持っていったほうがいいですか。",en:"Thank you. Should I bring something?",intention:"Offer a contribution."},
 {who:"さくら",ja:"お気持ちだけで十分ですよ。楽しみにしています。",en:"Your thoughtfulness is plenty. I'm looking forward to it.",intention:"Politely decline the need to bring a gift."}],
 reading:{title:"訪問の前のメッセージ",ja:"土曜日の夕食は午後六時からです。駅に着いたら連絡してください。家までは歩いて五分ぐらいです。食事に使えない食材があれば、前日までに教えてください。特別な手土産を用意する必要はありません。気をつけて来てくださいね。",en:"Saturday dinner begins at six. Please message when you arrive at the station; the house is around five minutes' walk away. Let us know by the previous day if there are ingredients you cannot eat. No special gift is needed. Travel safely."},
 focus:[{expression:"よかったら〜ませんか",meaning:"optional invitation, if you'd like",trap:"Not a command or obligation."},{expression:"伺えばいいですか",meaning:"how/when should I visit? (humble 伺う)",trap:"Politeness depends on relationship; humble forms aren't mandatory in every casual visit."},{expression:"〜ないようにします",meaning:"make sure not to do",trap:"An intentional precaution, not simply a past fact."},{expression:"〜たほうがいいですか",meaning:"ask if doing something would be better",trap:"Asks for advice, not permission guaranteed in every home."}],
 listening:{gist:"Ali accepts dinner but explains an ingredient restriction.",foils:["Ali declines because of work.","Sakura asks Ali to bring shrimp."],detailQuestion:"アリさんは何を食べられませんか。",detailAnswer:"えび",detailFoils:["魚","ご飯"],correction:"Ali explicitly contrasts fish, which is fine, with shrimp, which is not."},
 comprehension:{gist:"The host provides time, station contact and ingredient instructions.",foils:["Guests must bring expensive gifts.","The host will pick everyone up at the airport."],detailQuestion:"駅に着いたら、何をしますか。",detailAnswer:"連絡します。",detailFoils:["すぐに帰ります。","電車に乗ります。"],correction:"駅に着いたら is the trigger for contacting the host."},
 response:{question:"さくら：食べられない物はありますか。　アリ：＿＿＿",answer:"えびは食べられません。",foils:["えびを伺います。","えびで来ました。"],correction:"Use 食べられません to state what you cannot eat; no invented obligation to eat the ingredient."},
 recall:{question:"Write the polite question 'Should I bring something?'",answers:["何か持っていったほうがいいですか。","何か持って行ったほうがいいですか。"],correction:"持っていく is to bring; ほうがいいですか asks if that would be advisable."},
 writing:{prompt:"Write a short reply accepting or declining a home invitation, clarifying time and one practical need, and thanking the host.",selfChecks:["ありがとうございます","時"]},
 speaking:{prompt:"Accept a home invitation politely, clarify a dietary requirement and ask if any preparation is helpful.",selfChecks:["ありがとうございます","ですか"]},
 transfer:{audio:"ケン：日曜日の昼、家でお茶を飲みませんか。　ユナ：ありがとうございます。でも日曜日は予定があるので、来週なら伺えます。",question:"ユナさんはいつ行けますか。",answer:"来週",foils:["日曜日","今日"],reading:"土曜日の集まりは午後二時からです。玄関が分からない場合は電話をしてください。お茶は用意してありますので、飲み物を持参する必要はありません。",readingQuestion:"飲み物は持って行く必要がありますか。",readingAnswer:"ありません。",readingFoils:["あります。","分かりません。"],correction:"Respect what the particular host actually says; etiquette is contextual, not a universal fixed rule."}
},
{
 id:"course-comparison",title:"Compare classes before enrolling",goal:"Evaluate a short information notice, explain priorities and make a justified choice.",
 setting:"Two friends compare part-time Japanese conversation classes with different times and fees.",
 keywords:["study","school","class","learning","education","course","hobby","comparison","choice","schedule","lessons"],
 turns:[
 {who:"ユナ",ja:"日本語の会話教室、どちらに申し込もうか迷っています。",en:"I'm undecided which Japanese conversation class to apply for.",intention:"Present a decision problem."},
 {who:"レナ",ja:"火曜日のクラスは安いけれど、仕事が終わってから間に合いますか。",en:"Tuesday's class is cheaper, but can you make it after work?",intention:"Identify a schedule constraint."},
 {who:"ユナ",ja:"たぶん間に合いません。土曜日のクラスは少し高いですが、時間に余裕があります。",en:"Probably not. Saturday's class costs a bit more, but I have time to spare.",intention:"Compare cost with feasibility."},
 {who:"レナ",ja:"先生に質問する時間が多いほうがいいなら、少人数のほうが合うと思いますよ。",en:"If you want more time to ask the teacher questions, I think the smaller group might suit you.",intention:"Give a conditional recommendation."},
 {who:"ユナ",ja:"それは大事ですね。土曜日のクラスに申し込むことにします。",en:"That's important. I've decided to enroll in Saturday's class.",intention:"Choose with a reason."},
 {who:"レナ",ja:"いいと思います。申込期限を忘れないでくださいね。",en:"Sounds good. Don't forget the application deadline.",intention:"Offer a practical reminder."}],
 reading:{title:"講座のご案内",ja:"会話講座A：火曜日、午後六時から七時、月四回、月額三千円、定員二十人。会話講座B：土曜日、午前十時から十一時半、月四回、月額四千円、定員八人。どちらも初心者歓迎です。申し込みは今月二十五日までにオンラインで行ってください。",en:"Conversation Course A: Tuesdays 6–7 p.m., four classes monthly, ¥3,000, capacity 20. Course B: Saturdays 10–11:30 a.m., four classes monthly, ¥4,000, capacity 8. Both welcome beginners. Apply online by the 25th of this month."},
 focus:[{expression:"〜ようか迷っています",meaning:"I'm undecided whether/which to choose",trap:"Shows indecision, not a final application."},{expression:"〜なら",meaning:"if that is your priority",trap:"A conditional recommendation depends on learner goals."},{expression:"〜と思います",meaning:"I think / in my opinion",trap:"Advice is framed as judgment, not absolute fact."},{expression:"〜ことにします",meaning:"make the decision to do",trap:"Decision is now reached; earlier uncertainty no longer applies."}],
 listening:{gist:"Yuna chooses a more expensive Saturday class because it fits her schedule.",foils:["Yuna chooses Tuesday because it is cheaper.","Neither class accepts beginners."],detailQuestion:"ユナさんはどちらに申し込みますか。",detailAnswer:"土曜日のクラス",detailFoils:["火曜日のクラス","どちらにも申し込みません"],correction:"She explicitly decides on Saturday after considering time and smaller class size."},
 comprehension:{gist:"The notice compares two class schedules, costs and capacities.",foils:["Both courses cost the same.","Both classes meet on Saturday."],detailQuestion:"定員が八人のクラスはどちらですか。",detailAnswer:"講座B",detailFoils:["講座A","どちらも"],correction:"Class B meets Saturday and has a capacity of eight."},
 response:{question:"ユナ：先生に質問できる時間がほしいです。　レナ：＿＿＿",answer:"少人数のクラスが合うと思います。",foils:["どちらも昨日終わりました。","質問を食べましょう。"],correction:"A recommendation should address the stated priority and use a suitable comparative option."},
 recall:{question:"Write 'I have decided to enroll in Saturday's class.'",answers:["土曜日のクラスに申し込むことにします。","土曜日のクラスに申し込むことにしました。"],correction:"ことにする marks one's decision, distinct from a timetable imposed from outside."},
 writing:{prompt:"Compare two courses using published hours, group sizes and prices. Choose one with two reasons and acknowledge a disadvantage.",selfChecks:["より","と思います"]},
 speaking:{prompt:"Explain what you need from a course, compare two options and respond to an objection before making a choice.",selfChecks:["ほう","ことに"]},
 transfer:{audio:"案内：水曜日の講座は夜七時からです。金曜日の講座は午後五時からで、参加費は少し安くなっています。",question:"参加費が安いのはどちらですか。",answer:"金曜日の講座",foils:["水曜日の講座","同じ値段"],reading:"講座Cは日曜日の午前九時からです。定員は六人で、練習時間が長いのが特徴です。講座Dは平日の夜にオンラインで参加できます。",readingQuestion:"オンラインで参加できるのはどちらですか。",readingAnswer:"講座D",readingFoils:["講座C","どちらも"],correction:"Re-evaluate the changed schedule and course properties rather than copying the original choice."}
},
{
 id:"community-noise",title:"Raise a neighborhood concern tactfully",goal:"Make a specific request, acknowledge the other person's circumstances and agree on a practical compromise.",
 setting:"A resident asks their neighbor about late-night noise without escalating the conversation.",
 keywords:["home","neighbor","neighbour","living","apartment","housing","community","problem","noise","rules","request"],
 turns:[
 {who:"ミナ",ja:"こんばんは。急にすみません。少しご相談してもいいですか。",en:"Good evening. Sorry to bother you unexpectedly. May I ask you about something?",intention:"Open gently and ask permission to discuss."},
 {who:"ケン",ja:"はい、どうしましたか。",en:"Sure. What's wrong?",intention:"Invite explanation."},
 {who:"ミナ",ja:"最近、夜十一時ごろまで音楽が聞こえることがあって、眠れない日があるんです。",en:"Lately I sometimes hear music until around eleven at night, and on some days I can't sleep.",intention:"Give a concrete experience without blame."},
 {who:"ケン",ja:"そうだったんですね。気づきませんでした。申し訳ありません。",en:"I didn't realize. I'm sorry.",intention:"Acknowledge unintended impact."},
 {who:"ミナ",ja:"よかったら、夜十時以降は音を少し小さくしていただけませんか。",en:"Would you be willing to turn the volume down after ten?",intention:"Make a bounded, polite request."},
 {who:"ケン",ja:"もちろんです。これから気をつけます。教えてくれてありがとうございます。",en:"Of course. I'll be careful from now on. Thanks for telling me.",intention:"Agree and close constructively."}],
 reading:{title:"共同住宅からのお願い",ja:"夜十時から朝七時までは、音楽やテレビの音量にご配慮ください。近所の方と問題が起きた場合は、まず落ち着いて具体的な状況を確認し、相談してください。対応が難しい場合は管理人に連絡できます。",en:"Between 10 p.m. and 7 a.m., please be considerate with music and TV volume. If a neighbor concern arises, first calmly confirm the concrete situation and discuss it. If it proves difficult to address, you may contact the building manager."},
 focus:[{expression:"〜ことがある",meaning:"sometimes happens",trap:"Describes intermittent experiences, not constant intentional behavior."},{expression:"〜んです",meaning:"explain a situation or reason",trap:"Softens/contextualizes the request rather than a bare command."},{expression:"よかったら〜ていただけませんか",meaning:"would you mind doing...?",trap:"More deferential than a direct imperative."},{expression:"〜ように気をつける",meaning:"be careful to adjust behavior",trap:"A promise of changed behavior, not proof the issue has already been resolved."}],
 listening:{gist:"Mina explains a late-night noise issue and asks for lower volume.",foils:["Mina is inviting Ken to a concert.","Ken tells Mina to turn up the music."],detailQuestion:"いつから音を小さくしてほしいですか。",detailAnswer:"夜十時以降",detailFoils:["朝七時から","午後三時以降"],correction:"The request targets after 10 p.m., not all hours."},
 comprehension:{gist:"The building asks residents to be considerate with noise overnight.",foils:["Loud music is required after ten.","Only the manager may speak to neighbors."],detailQuestion:"静かにする時間はいつからですか。",detailAnswer:"夜十時",detailFoils:["夜十一時","朝七時"],correction:"The notice begins the quiet period at ten, while seven is the morning endpoint."},
 response:{question:"ミナ：夜十時以降、少し音を小さくしていただけませんか。　ケン：＿＿＿",answer:"申し訳ありません。これから気をつけます。",foils:["もっと大きくします。","それはおいしいですね。"],correction:"Acknowledging the request and committing to be mindful fits the exchange."},
 recall:{question:"Write a polite request to make the volume a little lower.",answers:["音を少し小さくしていただけませんか。","少し音を小さくしていただけませんか。"],correction:"〜ていただけませんか is a politely softened request, suitable for a neighbor."},
 writing:{prompt:"Draft a courteous message about a recurring neighborhood inconvenience: include concrete times, impact, a bounded request and a constructive closing.",selfChecks:["すみません","いただけませんか"]},
 speaking:{prompt:"Role-play a respectful discussion of a neighborhood concern, listening to the other person's explanation and negotiating a feasible change.",selfChecks:["ご相談","お願いします"]},
 transfer:{audio:"住人：すみません。朝六時から廊下で大きな声が聞こえます。できれば、七時までは静かにしていただけますか。",question:"何時まで静かにしてほしいですか。",answer:"朝七時",foils:["朝六時","夜十時"],reading:"ごみの分別に関するお知らせ：紙とプラスチックは別の袋に入れてください。収集日の前夜からごみを出さないでください。分からないときは管理人にお尋ねください。",readingQuestion:"紙とプラスチックはどうしますか。",readingAnswer:"別の袋に入れます。",readingFoils:["同じ袋に入れます。","駅に持って行きます。"],correction:"Transfer to a different house rule by checking the new time and exact instruction."}
},
{
 id:"club-project",title:"Negotiate project responsibilities",goal:"Explain a shared task, clarify deadlines and handle an unexpected obstacle cooperatively.",
 setting:"A student club is preparing an event poster and coordinating edits before printing.",
 keywords:["work","study","project","club","school","group","team","meeting","plan","prepare","deadline","responsibility"],
 turns:[
 {who:"レナ",ja:"来週の発表会のポスター、もうできましたか。",en:"Is the poster for next week's presentation event ready yet?",intention:"Check project status."},
 {who:"アリ",ja:"文章は書き終わりましたが、写真の使用許可をまだ確認していません。",en:"I've finished the text, but haven't confirmed permission to use the photo yet.",intention:"Distinguish finished and outstanding work."},
 {who:"レナ",ja:"許可がないまま印刷しないほうがいいですね。別の写真も探しておきましょう。",en:"We shouldn't print without permission. Let's also look for another image in advance.",intention:"Suggest a safer contingency."},
 {who:"アリ",ja:"そうですね。私は今日中に許可を確認します。レナさんは時間と場所を見直してもらえますか。",en:"Agreed. I'll check permission by today. Could you review the time and location?",intention:"Divide responsibilities and set a deadline."},
 {who:"レナ",ja:"分かりました。明日の昼までに修正したものを共有します。",en:"Understood. I'll share the revised version by tomorrow noon.",intention:"Commit to a deliverable and deadline."},
 {who:"アリ",ja:"ありがとうございます。全員が確認してから印刷しましょう。",en:"Thanks. Let's print after everyone has checked.",intention:"Set an approval-dependent sequence."}],
 reading:{title:"制作チームの共有メモ",ja:"発表会のポスターについて、日時と会場の情報を明日の正午までに確認してください。写真は使用許可が得られるまで公開しないこと。修正版はメンバー全員に共有し、内容を確認してもらった後で印刷します。印刷の締め切りは金曜日の午後三時です。",en:"For the presentation poster, check the event date, time and venue by noon tomorrow. Do not publish the photo until permission is obtained. Share the revised version with all members and print only after they have checked it. Printing deadline is Friday at 3 p.m."},
 focus:[{expression:"〜終わりました",meaning:"has finished doing",trap:"Only the text is finished; other tasks remain."},{expression:"まだ〜ていません",meaning:"has not yet done",trap:"Permission is pending, not denied."},{expression:"〜ないまま",meaning:"while something remains undone",trap:"Printing before permission would skip the agreed prerequisite."},{expression:"〜てから",meaning:"after completing an action",trap:"The approval sequence matters."}],
 listening:{gist:"The team delays printing until permissions and details are checked.",foils:["Everything is ready for immediate printing.","The event is cancelled."],detailQuestion:"アリさんは今日中に何をしますか。",detailAnswer:"写真の使用許可を確認します。",detailFoils:["ポスターを印刷します。","会場を変更します。"],correction:"Ali will verify image permission; Lena will check event information."},
 comprehension:{gist:"Printing depends on permission and all-member review.",foils:["No one needs to review the poster.","All photos can be posted without permission."],detailQuestion:"印刷の締め切りはいつですか。",detailAnswer:"金曜日の午後三時",detailFoils:["木曜日の正午","土曜日の午後三時"],correction:"Tomorrow noon is the information check; Friday at three is the printing deadline."},
 response:{question:"レナ：写真の許可はまだありません。　アリ：＿＿＿",answer:"許可を確認してから印刷しましょう。",foils:["今すぐ全部印刷しましょう。","昨日、写真を食べました。"],correction:"〜てから respects the prerequisite; printing immediately would violate it."},
 recall:{question:"Write: 'Let's print after everyone has checked.'",answers:["全員が確認してから印刷しましょう。","みんなが確認してから印刷しましょう。"],correction:"確認してから indicates doing the review before printing."},
 writing:{prompt:"Draft a team update explaining what is done, what remains, who owns each task, a deadline and the condition for release.",selfChecks:["まだ","まで"]},
 speaking:{prompt:"Discuss unfinished project work, negotiate task ownership and confirm the review-before-release sequence.",selfChecks:["確認","ましょう"]},
 transfer:{audio:"先生：動画の音声に問題があるので、発表の前に修正する必要があります。修正版は木曜日までに送ってください。",question:"修正版はいつまでに必要ですか。",answer:"木曜日",foils:["金曜日","来週"],reading:"サークルからのお知らせ：会場の利用時間が短くなったため、発表は各グループ十分以内にしてください。資料の提出期限は変更ありません。",readingQuestion:"変わったのは何ですか。",readingAnswer:"発表時間",readingFoils:["資料の提出期限","参加するグループ"],correction:"The new issue is audio revision and shorter presentation time; original printing deadlines do not apply."}
}
];
