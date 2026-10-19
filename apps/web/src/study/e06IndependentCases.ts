/**
 * Original E06 cumulative role-play and transfer material.
 * No copied textbook dialogue, fabricated recordings or self-assigned course IDs.
 */
export interface E06Case {
  id:string;title:string;level:"A1"|"A2";anchor:{cohort:"e02"|"e03"|"e04";sceneId:string};
  objective:string;setting:string;
  turns:readonly {speaker:string;ja:string;en:string;purpose:string}[];
  reading:{title:string;ja:string;en:string};
  listen:{question:string;answer:string;wrong:readonly [string,string];feedback:readonly [string,string]};
  read:{question:string;answer:string;wrong:readonly [string,string];feedback:readonly [string,string]};
  negotiate:{question:string;answer:string;wrong:readonly [string,string];feedback:readonly [string,string]};
  recall:{question:string;answers:readonly string[];correction:string};
  independent:{writing:string;speaking:string;writingChecks:readonly string[];speakingChecks:readonly string[];revision:string};
  transfer:{audio:string;question:string;answer:string;wrong:readonly [string,string];reading:string;readQuestion:string;readAnswer:string;readWrong:readonly [string,string];freeQuestion:string;freeAnswers:readonly string[];correction:string};
}
export const E06_CASES:readonly E06Case[]=[
 {
 id:"introduce-and-find-help",title:"Meet someone and ask for help",level:"A1",anchor:{cohort:"e02",sceneId:"personal"},
 objective:"Introduce yourself and recover politely when a conversation is unclear.",setting:"Two new classmates meet before a workshop; one cannot find the classroom.",
 turns:[
 {speaker:"ケン",ja:"はじめまして。ケンです。お名前は？",en:"Nice to meet you. I'm Ken. What's your name?",purpose:"Open a first meeting politely."},
 {speaker:"ユナ",ja:"ユナです。よろしくお願いします。",en:"I'm Yuna. Nice to meet you.",purpose:"Reply with a name and matching politeness."},
 {speaker:"ケン",ja:"すみません。日本語の教室はどこですか。",en:"Excuse me, where is the Japanese classroom?",purpose:"Ask a simple relevant follow-up."},
 {speaker:"ユナ",ja:"三階です。三〇二号室ですよ。",en:"On the third floor, room 302.",purpose:"Provide actionable location details."},
 {speaker:"ケン",ja:"すみません。もう一度お願いします。",en:"Sorry, one more time, please.",purpose:"Repair a missed part without pretending to understand."},
 {speaker:"ユナ",ja:"三階の三〇二号室です。いっしょに行きましょう。",en:"It's room 302 on the third floor. Let's go together.",purpose:"Repeat and offer to accompany the visitor."}
 ],
 reading:{title:"教室の案内",ja:"今日の日本語の教室は三階の三〇二号室です。二階ではありません。初めて来た方は受付でお名前を教えてください。分からないことがあれば、スタッフに聞いてください。",en:"Today's Japanese class is on the third floor in room 302, not the second floor. New visitors should give their names at reception; ask staff if anything is unclear."},
 listen:{question:"ケンさんは何を聞き返しましたか。",answer:"教室の場所",wrong:["ユナさんの好きな食べ物","授業の値段"],feedback:["The class location is repeated. The conversation contains no food preference.","Nobody asks about the fee; the misunderstanding concerns room 302."]},
 read:{question:"二階ですか、三階ですか。",answer:"三階",wrong:["二階","一階"],feedback:["二階ではありません explicitly rules out the second floor.","The notice says 三階, not the first floor."]},
 negotiate:{question:"場所が聞き取れませんでした。適切な言い方は？",answer:"もう一度お願いします。",wrong:["三階をください。","はい、全部分かりました。"],feedback:["をください requests an object; it does not request repetition.","Do not claim understanding when you missed the location."]},
 recall:{question:"Type a polite question asking another person's name.",answers:["お名前は何ですか。","お名前は何ですか","お名前は？"],correction:"お名前 identifies the name; 何ですか makes the question polite."},
 independent:{writing:"Write a short original first-meeting exchange: your name, a practical question, and a clarification if you did not understand the answer.",speaking:"Speak as both participants in a first meeting; ask for a room and politely request repetition once.",writingChecks:["です","すみません"],speakingChecks:["です","もう一度"],revision:"Remove one model expression and replace it with information about yourself; check whether your request remains courteous."},
 transfer:{audio:"受付：今日は四階の四〇一号室です。　学生：すみません。もう一度教えてください。",
 question:"今日は何階ですか。",answer:"四階",wrong:["三階","一階"],reading:"明日の会話クラスは二階の二〇六号室です。今日の三〇二号室とは違います。初めての方は二階の受付まで来てください。",
 readQuestion:"明日の教室は何号室ですか。",readAnswer:"二〇六号室",readWrong:["三〇二号室","四〇一号室"],freeQuestion:"Type 'Please say it again' politely.",freeAnswers:["もう一度お願いします。","もう一度言ってください。","もう一度お願いします"],correction:"The room and floor changed. Check the new notice rather than relying on the previous 302/third-floor model."}
 },
 {
 id:"origin-family-and-plans",title:"Introduce your background and arrange a visit",level:"A1",anchor:{cohort:"e02",sceneId:"origin"},
 objective:"Link simple personal facts and negotiate a convenient meeting time.",setting:"Two participants exchange origins and make a simple plan to meet again.",
 turns:[
 {speaker:"アリ",ja:"どこから来ましたか。",en:"Where did you come from?",purpose:"Ask about origin, not destination."},
 {speaker:"ミナ",ja:"韓国から来ました。今は東京に住んでいます。",en:"I came from Korea. I live in Tokyo now.",purpose:"Separate origin and current residence."},
 {speaker:"アリ",ja:"そうですか。私はトルコから来ました。家族はトルコにいます。",en:"I see. I came from Turkey. My family is in Turkey.",purpose:"React and add parallel personal information."},
 {speaker:"ミナ",ja:"日曜日は時間がありますか。",en:"Are you free on Sunday?",purpose:"Invite a continuation beyond introductions."},
 {speaker:"アリ",ja:"午前は忙しいですが、午後なら大丈夫です。",en:"I'm busy in the morning, but afternoon is fine.",purpose:"Decline part of the plan and provide an option."},
 {speaker:"ミナ",ja:"では、三時に駅で会いましょう。",en:"Then let's meet at the station at three.",purpose:"Confirm time and place."}
 ],
 reading:{title:"新しい友達へのメッセージ",ja:"アリさんはトルコから来ましたが、今は日本で勉強しています。日曜日の午前中はアルバイトがあります。午後三時に東京駅でミナさんと会う予定です。家族はトルコに住んでいます。",en:"Ali came from Turkey and studies in Japan now. He works part time Sunday morning and plans to meet Mina at Tokyo Station at 3 p.m. His family lives in Turkey."},
 listen:{question:"二人はいつ会いますか。",answer:"日曜日の午後三時",wrong:["日曜日の午前九時","土曜日の午後三時"],feedback:["アリ explicitly cannot meet in the morning.","The agreed day is Sunday, not Saturday."]},
 read:{question:"アリさんの家族はどこに住んでいますか。",answer:"トルコ",wrong:["東京","韓国"],feedback:["東京 is Ali's meeting place, not his family's home.","韓国 is Mina's place of origin, not Ali's family location."]},
 negotiate:{question:"アリ：午前は忙しいですが、午後なら大丈夫です。　ミナ：＿＿＿",answer:"では、午後三時に会いましょう。",wrong:["では、午前に会いましょう。","家族をください。"],feedback:["The suggested time ignores the stated unavailability.","Family members cannot be requested with をください."]},
 recall:{question:"Write 'I came from Turkey.' in the polite past.",answers:["トルコから来ました。","トルコから来ました"],correction:"から marks origin; に would mark destination in another construction."},
 independent:{writing:"Write four connected sentences about where you came from, where you live, one family fact, and a time you could meet a new friend.",speaking:"Introduce yourself, ask where someone came from, then agree on a specific time and location.",writingChecks:["から","に"],speakingChecks:["から","ましょう"],revision:"After drafting, distinguish origin (から) from current location and confirm the plan has both a day and a meeting place."},
 transfer:{audio:"レナ：ドイツから来ました。土曜日の午後は忙しいですが、日曜日の午前十時なら会えます。",
 question:"レナさんはいつ会えますか。",answer:"日曜日の午前十時",wrong:["土曜日の午後","日曜日の午後十時"],reading:"ユナさんは韓国から来て、今は大阪に住んでいます。家族は韓国にいます。来週の月曜日、友達と大阪駅で会う予定です。",
 readQuestion:"ユナさんは今どこに住んでいますか。",readAnswer:"大阪",readWrong:["韓国","トルコ"],freeQuestion:"Type 'I came from Korea.'",freeAnswers:["韓国から来ました。","かんこくからきました。"],correction:"The new person comes from Germany, can meet Sunday morning, and the reading separates origin from current residence."}
 },
 {
 id:"cafe-and-shopping",title:"Order, check the bill, and buy something",level:"A1",anchor:{cohort:"e02",sceneId:"shopping"},
 objective:"Ask prices, request a drink and resolve a simple quantity misunderstanding.",setting:"A student buys a drink and a small gift while watching a budget.",
 turns:[
 {speaker:"店員",ja:"いらっしゃいませ。",en:"Welcome.",purpose:"Open a customer interaction."},
 {speaker:"ユナ",ja:"すみません。お茶を一つください。",en:"Excuse me, one tea, please.",purpose:"Make a countable item request."},
 {speaker:"店員",ja:"はい、三百円です。",en:"Certainly, it's 300 yen.",purpose:"Quote a price."},
 {speaker:"ユナ",ja:"このノートはいくらですか。",en:"How much is this notebook?",purpose:"Ask for the price of a different item."},
 {speaker:"店員",ja:"五百円です。二冊あります。",en:"It's 500 yen. We have two copies.",purpose:"Separate price from availability."},
 {speaker:"ユナ",ja:"一冊でいいです。お茶とノートをお願いします。",en:"One notebook is enough. The tea and a notebook, please.",purpose:"Clarify quantity and finalize the order."}
 ],
 reading:{title:"お会計のメモ",ja:"お茶　一つ　三百円。ノート　一冊　五百円。合計　八百円。ノートは二冊ではなく、一冊です。おつりを受け取ってから、品物を確認してください。",en:"Tea: one at ¥300. Notebook: one at ¥500. Total: ¥800. There is one notebook, not two. Check the items after receiving change."},
 listen:{question:"ユナさんはノートを何冊買いますか。",answer:"一冊",wrong:["二冊","三冊"],feedback:["The shop has two available, but Yuna orders only one.","No one asks for three notebooks."]},
 read:{question:"お会計の合計はいくらですか。",answer:"八百円",wrong:["五百円","三百円"],feedback:["¥500 is only the notebook's price, not the total.","¥300 is only the tea's price, not the total."]},
 negotiate:{question:"店員：ノートを二冊ですね。　客：＿＿＿（correct quantity）",answer:"いいえ、一冊でお願いします。",wrong:["はい、二冊です。","昨日、来ました。"],feedback:["This would accept two instead of correcting to one.","A past-visit statement does not clarify the order."]},
 recall:{question:"Write 'How much is this notebook?'",answers:["このノートはいくらですか。","このノートはいくらですか"],correction:"このノート is the object whose price is being asked. は marks the topic."},
 independent:{writing:"Write a short café-and-shop exchange ordering two different items and checking the price or quantity.",speaking:"Role-play as customer and staff: order a drink, ask a price, then correct a mistaken quantity politely.",writingChecks:["ください","いくら"],speakingChecks:["お願いします","一つ"],revision:"Re-read every quantity and total, and replace any abrupt correction with a polite expression."},
 transfer:{audio:"店員：水は二百円、パンは四百円です。　客：水を一つ、パンを一つください。",
 question:"水はいくらですか。",answer:"二百円",wrong:["四百円","六百円"],reading:"今日のメモ：コーヒー一杯四百円、パン一つ三百円。二つ合わせて七百円です。水は注文していません。",
 readQuestion:"パンはいくらですか。",readAnswer:"三百円",readWrong:["四百円","七百円"],freeQuestion:"Write a polite request for one tea.",freeAnswers:["お茶を一つください。","お茶をください。"],correction:"Read each item's new price and quantity. The second total is not the first purchase's total."}
 },
 {
 id:"meeting-replan",title:"Negotiate an invitation when plans change",level:"A2",anchor:{cohort:"e03",sceneId:"weekend-invitation"},
 objective:"Decline an inconvenient time politely, propose a new plan and communicate a backup.",
 setting:"Three friends intend to visit a park but must coordinate different work schedules and a weather change.",
 turns:[
 {speaker:"ユナ",ja:"来週の土曜日、みんなで公園に行きませんか。",en:"Why don't we all go to the park next Saturday?",purpose:"Invite the group without presuming agreement."},
 {speaker:"アリ",ja:"土曜日は夕方まで仕事がありますが、日曜日なら空いています。",en:"I work until evening Saturday, but I'm free Sunday.",purpose:"State a genuine constraint and alternative."},
 {speaker:"レナ",ja:"日曜日は午前中だけ時間があります。お昼までなら行けます。",en:"I'm only free Sunday morning. I can go until noon.",purpose:"Narrow the available window."},
 {speaker:"ユナ",ja:"じゃあ、日曜日の十時に駅で会いましょう。",en:"Then let's meet Sunday at ten at the station.",purpose:"Select a mutually viable time and place."},
 {speaker:"アリ",ja:"天気予報では雨になるかもしれませんよ。",en:"The forecast says it might rain.",purpose:"Introduce a risk without asserting certainty."},
 {speaker:"レナ",ja:"雨だったら、近くのカフェでお茶を飲むのはどうですか。",en:"If it rains, how about having tea at a nearby café?",purpose:"Offer a specific contingency."},
 {speaker:"ユナ",ja:"いいですね。前の日に天気を確認して、みんなに連絡します。",en:"Sounds good. I'll check the weather the day before and message everyone.",purpose:"Commit to a preparation and notification step."}
 ],
 reading:{title:"グループチャットの確認",ja:"日曜日の予定：午前十時に駅の北口に集合。晴れなら公園を散歩します。雨だったら駅の近くのカフェに入ります。レナさんは正午に帰る必要があります。天気の確認と最終連絡はユナさんが土曜日の夜に行います。",en:"Sunday plan: meet at the station's north exit at ten. Walk in the park if sunny; go to a nearby café if rainy. Rena has to leave at noon. Yuna will check weather and send the final message Saturday evening."},
 listen:{question:"集合はいつ、どこですか。",answer:"日曜日の十時、駅",wrong:["土曜日の十時、公園","日曜日の十二時、カフェ"],feedback:["Saturday is Ali's work day; the agreed meeting is Sunday at the station.","Noon is Rena's departure deadline, not the meeting time."]},
 read:{question:"誰が最後の連絡をしますか。",answer:"ユナ",wrong:["アリ","レナ"],feedback:["Ali explains his availability but is not assigned the final message.","Rena has the noon deadline; Yuna sends the weather update."]},
 negotiate:{question:"友達：雨になるかもしれません。公園はどうしますか。　あなた：＿＿＿",answer:"雨だったら、カフェに行くのはどうですか。",wrong:["必ず晴れるので大丈夫です。","明日、昨日の公園に行きました。"],feedback:["かもしれません is uncertain; declaring guaranteed sunshine ignores the risk.","The past tense doesn't provide a workable plan for the future."]},
 recall:{question:"Type a polite proposal: 'Why don't we meet Sunday at ten?'",answers:["日曜日の十時に会いませんか。","日曜日、十時に会いませんか。"],correction:"〜ませんか proposes an activity politely, while に marks a definite clock time."},
 independent:{writing:"Write a realistic multi-turn group planning message: invite, accommodate two different availability constraints, state a location, add a rain alternative and assign the person who will confirm.",speaking:"Role-play with two people: propose, decline part of the plan, negotiate an option and summarize final time, place and weather backup.",writingChecks:["日曜日","雨"],speakingChecks:["ませんか","だったら"],revision:"Check whether every person's availability is respected. Replace any unsupported weather certainty with an appropriate possibility form."},
 transfer:{audio:"ケン：金曜日は残業ですが、土曜日の午後二時なら大丈夫です。雨なら映画館にしましょう。",
 question:"ケンさんはいつ時間がありますか。",answer:"土曜日の午後二時",wrong:["金曜日の夜","土曜日の午前二時"],reading:"次の読書会は月曜日の午後六時に始まります。会場の利用ができない場合、同じ時間にオンラインで行います。参加方法は前日の夜に知らせます。",
 readQuestion:"会場が使えなかったら、どうしますか。",readAnswer:"オンラインで行います。",readWrong:["中止します。","火曜日にします。"],freeQuestion:"Write 'If it rains, let's go to a café.'",freeAnswers:["雨だったら、カフェに行きましょう。","雨だったらカフェに行きましょう。"],correction:"The first new invitation is Saturday afternoon; the second meeting moves online, not to a different day."}
 },
 {
 id:"order-and-allergy",title:"Clarify food restrictions and correct an order",level:"A2",anchor:{cohort:"e03",sceneId:"restaurant-adjustment"},
 objective:"Ask for ingredient information, explain a restriction and resolve a misunderstanding before food is prepared.",
 setting:"At a restaurant, a guest has a dietary restriction and notices the waiter wrote down a different meal.",
 turns:[
 {speaker:"店員",ja:"ご注文はお決まりですか。",en:"Have you decided what you'd like to order?",purpose:"Open the order politely."},
 {speaker:"ミナ",ja:"すみません。このスープにはえびが入っていますか。",en:"Excuse me. Does this soup contain shrimp?",purpose:"Ask a specific ingredient question."},
 {speaker:"店員",ja:"少し入っています。えびを使わない野菜スープもあります。",en:"There is a little. We also have vegetable soup without shrimp.",purpose:"Give an accurate distinction between menu items."},
 {speaker:"ミナ",ja:"えびは食べられないので、野菜スープにします。",en:"I can't eat shrimp, so I'll choose vegetable soup.",purpose:"Explain the requirement and choose."},
 {speaker:"店員",ja:"野菜カレーを一つですね。",en:"One vegetable curry, correct?",purpose:"Read back the order, but with an error."},
 {speaker:"ミナ",ja:"いいえ、野菜スープです。カレーではありません。",en:"No, vegetable soup. Not curry.",purpose:"Correct the error promptly and clearly."},
 {speaker:"店員",ja:"失礼いたしました。野菜スープを一つですね。",en:"My apologies. One vegetable soup.",purpose:"Confirm the corrected item."}
 ],
 reading:{title:"メニューの食材案内",ja:"魚介スープ：魚、えび、野菜を使っています。野菜スープ：野菜と豆を使い、えびは入っていません。ただし、同じ調理場で魚介類を扱っています。食べられない食材がある場合は、ご注文前にスタッフへ必ずお知らせください。",en:"Seafood soup uses fish, shrimp and vegetables. Vegetable soup uses vegetables and beans with no shrimp, but the kitchen also handles seafood. Inform staff of foods you cannot eat before ordering."},
 listen:{question:"ミナさんが最終的に注文したのは何ですか。",answer:"野菜スープ",wrong:["野菜カレー","魚介スープ"],feedback:["The waiter mistakenly says curry; Mina corrects it to vegetable soup.","The seafood soup contains shrimp, which Mina cannot eat."]},
 read:{question:"野菜スープにはえびが入っていますか。",answer:"入っていません。",wrong:["少し入っています。","必ず入っています。"],feedback:["The vegetable soup has no shrimp ingredient, but the shared kitchen is still a separate concern.","The notice explicitly states that shrimp isn't in the vegetable soup."]},
 negotiate:{question:"店員：野菜カレーですね。　客：＿＿＿",answer:"いいえ、野菜スープをお願いします。",wrong:["はい、カレーでいいです。","えびは好きます。"],feedback:["Accepting curry would fail to correct the order.","好き is not conjugated with ます and does not correct the item."]},
 recall:{question:"Type 'I'll choose the vegetable soup.'",answers:["野菜スープにします。","野菜のスープにします。"],correction:"〜にします announces a choice. Don't use 〜をください when the task is explicitly to practise the selection construction."},
 independent:{writing:"Write a short restaurant conversation with an ingredient question, a reasoned order, a mistaken staff confirmation and a courteous correction.",speaking:"Play guest and server; confirm whether an ingredient is present and correct a wrong order before the meal is prepared.",writingChecks:["入っていますか","スープ"],speakingChecks:["ありません","お願いします"],revision:"Separate 'ingredient absent' from 'shared preparation area': do not promise allergy safety merely from a menu label."},
 transfer:{audio:"店員：こちらのサラダには卵が入っています。卵が使われていない料理は、この野菜スープです。　客：では、スープにします。",
 question:"お客さんは何を注文しますか。",answer:"野菜スープ",wrong:["卵のサラダ","魚介スープ"],reading:"本日の定食には乳製品が使われています。乳製品を使わないメニューについては、注文前にスタッフに確認してください。厨房では同じ調理器具を使う場合があります。",
 readQuestion:"乳製品を避ける人は何をするべきですか。",readAnswer:"注文前にスタッフに確認する",readWrong:["定食を必ず注文する","何も聞かない"],freeQuestion:"Type 'Does this contain eggs?'",freeAnswers:["これには卵が入っていますか。","この料理には卵が入っていますか。"],correction:"The transfer changes the restricted ingredient and keeps kitchen handling separate from menu ingredients."}
 },
 {
 id:"service-delay",title:"Explain a delayed reservation and ask for options",level:"A2",anchor:{cohort:"e04",sceneId:"hotel-reservation"},
 objective:"Give reservation details, compare the booking evidence and negotiate a time-sensitive alternative.",
 setting:"A traveler arrives late at a hotel and finds an error in the reserved breakfast plan.",
 turns:[
 {speaker:"受付",ja:"こんばんは。ご予約のお名前を教えていただけますか。",en:"Good evening. Could you give your booking name?",purpose:"Confirm the guest's reservation."},
 {speaker:"アリ",ja:"アリです。電車が遅れて、予定より二時間遅く着きました。",en:"It's Ali. The train was delayed, so I arrived two hours later than planned.",purpose:"Explain an unexpected late arrival."},
 {speaker:"受付",ja:"ご到着ありがとうございます。朝食なしの二泊でお間違いありませんか。",en:"Thank you for arriving. Two nights without breakfast, correct?",purpose:"Confirm the current reservation record."},
 {speaker:"アリ",ja:"予約メールには朝食付きと書いてあります。確認していただけますか。",en:"The booking email says breakfast included. Would you check?",purpose:"Correct the mismatch using an actual source."},
 {speaker:"受付",ja:"申し訳ございません。こちらの登録が間違っていました。朝食付きに変更いたします。",en:"I'm very sorry. Our system was wrong. I'll update it to breakfast included.",purpose:"Acknowledge and fix the record."},
 {speaker:"アリ",ja:"ありがとうございます。明日の朝食は何時までですか。",en:"Thank you. Until what time is breakfast tomorrow?",purpose:"Ask one practical follow-up."},
 {speaker:"受付",ja:"九時半までです。お部屋の鍵はこちらです。",en:"Until 9:30. Here's your room key.",purpose:"Supply the deadline and close the transaction."}
 ],
 reading:{title:"予約確認メール",ja:"予約者：アリ。チェックイン：金曜日。チェックアウト：日曜日。滞在：二泊。プラン：朝食付きシングルルーム。朝食：午前七時から午前九時半まで。到着が遅れる場合は受付にお知らせください。",en:"Guest: Ali. Check-in Friday; check-out Sunday. Two nights in a single room with breakfast included. Breakfast 7–9:30 a.m. Contact reception if arriving late."},
 listen:{question:"受付で、最初に何が間違っていましたか。",answer:"朝食の有無",wrong:["宿泊者の名前","泊まる日数"],feedback:["The clerk knows Ali's name; the issue is that breakfast is missing from the record.","Both agree on two nights; breakfast is the discrepancy."]},
 read:{question:"朝食は何時までですか。",answer:"午前九時半",wrong:["午前七時","午前十時"],feedback:["Seven is the starting time, not the cutoff.","Ten is not stated in the confirmation."]},
 negotiate:{question:"受付：朝食なしの予約ですね。　客：＿＿＿",answer:"メールには朝食付きと書いてあります。確認していただけますか。",wrong:["はい、朝食なしで大丈夫です。","朝食を昨日買いました。"],feedback:["That answer silently accepts the error rather than showing the confirmation.","Past purchase information doesn't verify the hotel's reservation."]},
 recall:{question:"Write 'Could you check my reservation?'",answers:["予約を確認していただけますか。","予約を確認してもらえますか。"],correction:"予約を確認する asks to check a booking; 〜ていただけますか offers appropriate deference."},
 independent:{writing:"Draft a message explaining a late arrival, citing booking evidence, asking for a correction and confirming a practical deadline.",speaking:"Act out the guest and clerk: state the delay, verify the reservation and ask politely about breakfast hours.",writingChecks:["予約","確認"],speakingChecks:["遅れて","いただけますか"],revision:"Differentiate reported facts from what the system actually says. Avoid assuming a refund or room change that was never promised."},
 transfer:{audio:"受付：ご予約は一泊となっていますが、メールには二泊と書いてありますね。こちらの間違いでした。二泊に直します。",
 question:"何が間違っていましたか。",answer:"宿泊日数",wrong:["朝食の時間","部屋の階"],reading:"ホテルからの変更通知：明日の朝食は工事のため午前八時から始まります。終了時間は午前十時で変更ありません。早朝に出発する方は前夜に受付へご相談ください。",
 readQuestion:"朝食が始まるのは何時ですか。",readAnswer:"午前八時",readWrong:["午前七時","午前十時"],freeQuestion:"Write 'Could you check the email?'",freeAnswers:["メールを確認していただけますか。","メールを確認してもらえますか。"],correction:"The discrepancy changes to length of stay; the later notice changes breakfast start, not end."}
 },
 {
 id:"transport-volunteer",title:"Reorganize a volunteer shift after travel fails",level:"A2",anchor:{cohort:"e04",sceneId:"festival-volunteering"},
 objective:"Explain a travel problem, redistribute responsibilities and confirm a realistic handover.",
 setting:"A community festival volunteer cannot reach the venue by the original shift start.",
 turns:[
 {speaker:"ケン",ja:"今日の交流祭の受付、午後一時からでしたよね。",en:"You were covering festival reception from one this afternoon, right?",purpose:"Verify the assigned time."},
 {speaker:"ユナ",ja:"はい。でも、電車が止まっていて、一時までに着けないかもしれません。",en:"Yes. But train service has stopped, so I might not arrive by one.",purpose:"State the disruption without guaranteeing a time."},
 {speaker:"ケン",ja:"分かりました。今、どこにいますか。",en:"Understood. Where are you now?",purpose:"Gather actionable information."},
 {speaker:"ユナ",ja:"駅です。バスなら二時ごろ着くと思います。",en:"At the station. I think I can arrive around two by bus.",purpose:"Offer a cautious estimate."},
 {speaker:"ケン",ja:"では、一時から二時までは私が受付をします。",en:"Then I'll cover reception from one to two.",purpose:"Propose coverage for the gap."},
 {speaker:"ユナ",ja:"助かります。到着したらすぐ連絡します。",en:"That helps. I'll message immediately on arrival.",purpose:"Accept help and commit to confirmation."},
 {speaker:"ケン",ja:"無理しないでください。二時までに間に合わなかったら、もう一度連絡してください。",en:"Please don't rush dangerously. If you can't make it by two, contact me again.",purpose:"Set a safety-conscious contingency."}
 ],
 reading:{title:"受付の引き継ぎメモ",ja:"受付担当：午後一時から二時までケン、二時から三時までユナ。電車の運休で到着が遅れる可能性があります。担当者が到着してから交代してください。時間が変わる場合は責任者に知らせ、受付を無人にしないでください。",en:"Reception coverage: Ken 1–2 p.m.; Yuna 2–3 p.m. Train suspension may cause a further delay. Hand over only once the replacement arrives. Notify the coordinator if timings change; do not leave reception unattended."},
 listen:{question:"一時から二時までは誰が受付をしますか。",answer:"ケン",wrong:["ユナ","受付の人は誰もいません"],feedback:["Yuna may be delayed and Ken explicitly offers coverage until two.","The group arranges coverage rather than leaving the reception unmanned."]},
 read:{question:"どういう時に交代しますか。",answer:"次の担当者が到着してから",wrong:["必ず二時ちょうどに無人にする","電車が止まったらすぐ"],feedback:["The handover depends on actual arrival, not leaving an unattended desk at the clock time.","A train stoppage does not itself constitute a handover."]},
 negotiate:{question:"ユナ：二時までに着けないかもしれません。　ケン：＿＿＿",answer:"分かったら、もう一度連絡してください。",wrong:["必ず二時に着くと約束してください。","今すぐ走って来てください。"],feedback:["The arrival is uncertain; requiring a guarantee is inappropriate.","Safety matters; don't demand risky travel after a disruption."]},
 recall:{question:"Write 'I'll contact you when I arrive.'",answers:["到着したら連絡します。","着いたら連絡します。"],correction:"〜たら marks the future condition of arriving; 連絡します states what you will do then."},
 independent:{writing:"Write an operational handover note naming who covers each time period, what caused the delay, a realistic backup and who must be notified.",speaking:"Role-play the volunteer and coordinator: report the interruption, propose coverage and confirm the conditions for handing over safely.",writingChecks:["時","連絡"],speakingChecks:["かもしれません","連絡"],revision:"Check the handover for gaps. Replace absolute arrival promises with realistic conditional updates, and preserve safety."},
 transfer:{audio:"責任者：今日は道路が混んでいるため、受付担当の交代を午後三時から三時半に変更します。到着したら連絡してください。",
 question:"交代は何時半になりましたか。",answer:"午後三時半",wrong:["午後二時半","午後四時半"],reading:"会場からのお知らせ：午後四時からのイベントは予定どおり行います。午後三時までに機材を運んでください。スタッフの集合時間は午後二時半です。",
 readQuestion:"スタッフの集合時間はいつですか。",readAnswer:"午後二時半",readWrong:["午後三時","午後四時"],freeQuestion:"Write 'Please contact me when you arrive.'",freeAnswers:["到着したら連絡してください。","着いたら連絡してください。"],correction:"Three-thirty is the new handover; two-thirty is the equipment team's gathering time. These are distinct contexts."}
 }
];
