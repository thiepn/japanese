/**
 * E08 is independently authored original Japanese; no Marugoto excerpt,
 * textbook translation or purported native recording appears here.
 * IDs are extension keys ONLY. Canonical source/Can-do IDs are inherited from
 * the corresponding real E06/E02–E04 unit in e06IndependentCourse.ts.
 */
export interface E08Extension {
 caseId:string;focus:string;why:string;culture:string;
 dialogue:readonly {speaker:string;ja:string;en:string;intention:string}[];
 notice:{title:string;ja:string;en:string};
 evidence:{question:string;answer:string;foils:readonly [string,string];reasons:readonly [string,string]};
 decision:{question:string;answer:string;foils:readonly [string,string];reasons:readonly [string,string]};
 revision:{
  task:string;audience:string;contentChecks:readonly [string,string,string][];
  modelPitfall:string;politeness:string;secondDraftTask:string;
  speakingFollowUp:string;
 };
 delayed:{
  spoken:string;question:string;answer:string;foils:readonly [string,string];
  reading:string;readingQuestion:string;readingAnswer:string;readingFoils:readonly [string,string];
  contrast:string;
 };
}
export const E08_EXTENSIONS:readonly E08Extension[]=[
{
 caseId:"introduce-and-find-help",focus:"Repair a classroom misunderstanding with two clarifications",
 why:"A useful clarification identifies what was missed, not just 'I don't understand'.",
 culture:"すみません can open an information request without implying a serious apology. Names are usually more natural than repeating あなた.",
 dialogue:[
 {speaker:"受付",ja:"会話の練習は三階です。今日は三〇五号室に変わりました。",en:"Conversation practice is on floor three. Today it has moved to room 305.",intention:"Correct the room despite the unchanged floor."},
 {speaker:"レナ",ja:"すみません。三〇二号室ではないんですか。",en:"Excuse me, isn't it room 302?",intention:"Contrast the old number with the new one."},
 {speaker:"受付",ja:"はい。三〇二号室は使えません。三〇五号室です。",en:"Right. Room 302 isn't available. It's 305.",intention:"Confirm what changed and what stayed the same."},
 {speaker:"レナ",ja:"分かりました。三階の三〇五号室ですね。ありがとうございます。",en:"Got it, room 305 on the third floor. Thank you.",intention:"Repeat the confirmed destination to avoid a second mistake."}
 ],
 notice:{title:"本日の教室変更",ja:"【お知らせ】日本語会話の教室は本日だけ三〇五号室です。三〇二号室では授業を行いません。階は変わりません。受付で場所を聞くことができます。",en:"For today only, Japanese conversation meets in 305, not 302. The floor is unchanged. Reception can answer location questions."},
 evidence:{question:"変わったのは何ですか。",answer:"教室の番号",foils:["建物の階","授業の曜日"],reasons:["The floor stays the same; the room number changes.","The notice says nothing about moving to a different day."]},
 decision:{question:"前に聞いた教室と今の案内が違います。適切な確認は？",answer:"今日は三〇五号室ですね。",foils:["前と同じ三〇二号室ですね。","教室を二つください。"],reasons:["302 is explicitly unavailable today.","Classrooms are locations, not ordered objects."]},
 revision:{task:"Write to a late classmate: introduce yourself, identify the old and new room, state what has not changed, and ask them to confirm.",audience:"New classmate",contentChecks:[["名前","Did you identify yourself rather than only give a number?","Add an opening with your own name."],["変更","Did you communicate a changed detail and the correct replacement?","Contrast 三〇二号室 with 三〇五号室 explicitly."],["確認","Did you give the other person an actionable way to confirm?","Ask them to repeat or check the new destination."]],
 modelPitfall:"Do not write that the class moved floors: only the room changed.",politeness:"Use すみません or a friendly greeting and avoid sounding as if you blame the recipient.",secondDraftTask:"Revise the message so someone who has never visited the classroom can find it without guessing.",speakingFollowUp:"Ask the teacher to confirm the room number, then repeat the corrected room."},
 delayed:{spoken:"受付：明日の教室は四階の四〇二号室です。今日はまだ三階ですが、明日から四階です。",
 question:"明日変わるのは何ですか。",answer:"階と教室",foils:["曜日だけ","先生の名前"],reading:"来週月曜日の初心者クラスは一階の一〇四号室です。今週の水曜日は三階の三〇一号室で行います。",
 readingQuestion:"来週月曜日の教室は何号室ですか。",readingAnswer:"一〇四号室",readingFoils:["三〇一号室","四〇二号室"],contrast:"Today room-only change; tomorrow floor and room; Monday is another separate notice."}
},
{
 caseId:"origin-family-and-plans",focus:"Clarify a changed destination and incompatible time",
 why:"An origin and current home do not tell you where a future meeting will happen.",
 culture:"When offering a new meeting time, acknowledge the other person's restriction before presenting an alternative.",
 dialogue:[
 {speaker:"ミナ",ja:"レナさんはドイツから来たんですね。今は横浜ですか。",en:"So you came from Germany. Do you live in Yokohama now?",intention:"Confirm two separate personal facts."},
 {speaker:"レナ",ja:"いいえ、今は川崎に住んでいます。横浜は学校の場所です。",en:"No, I live in Kawasaki. Yokohama is where my school is.",intention:"Correct an assumption about residence."},
 {speaker:"ミナ",ja:"そうですか。土曜日に横浜で会えますか。",en:"I see. Can we meet in Yokohama on Saturday?",intention:"Propose a specific meeting."},
 {speaker:"レナ",ja:"土曜日は家族と出かけます。日曜日の午後なら行けます。",en:"I'll go out with my family Saturday. Sunday afternoon works.",intention:"Decline gently and offer a workable alternative."},
 {speaker:"ミナ",ja:"では、日曜日の午後二時に学校の前でどうですか。",en:"How about Sunday at two in front of the school?",intention:"Confirm a viable alternative time and place."}
 ],
 notice:{title:"二人の予定メモ",ja:"レナ：ドイツから来ました。住んでいる所は川崎、学校は横浜。土曜日は家族との予定があります。日曜日は午後二時から四時まで会えます。集合場所は学校の入口。",en:"Rena is from Germany, lives in Kawasaki and attends school in Yokohama. Saturday is booked with family. She is available Sunday 2–4 p.m., meeting at the school entrance."},
 evidence:{question:"レナさんは今どこに住んでいますか。",answer:"川崎",foils:["横浜","ドイツ"],reasons:["Yokohama is the school location, not her residence.","Germany is the place she came from, not her current home."]},
 decision:{question:"友達：土曜日は家族の予定があります。何と提案しますか。",answer:"日曜日の午後二時ならどうですか。",foils:["では土曜日の朝に会いましょう。","ドイツから会いましょう。"],reasons:["This ignores the Saturday family plan.","から denotes origin, not the proposed meeting time."]},
 revision:{task:"Write a connected invitation that separates where someone came from, where they live, and the location and time of the proposed meeting.",audience:"Classmate with a family commitment",contentChecks:[["から","Is the origin distinguished from present residence?","Use から for origin and に住んでいます for the current home."],["日曜日","Did you respect the declined day and propose a workable alternative?","Name the accepted alternative day and specific time."],["場所","Is the meeting location explicit?","State the school entrance or another unambiguous landmark."]],
 modelPitfall:"Do not claim Yokohama is the speaker's current home.",politeness:"Acknowledge the family plan before proposing a different time.",secondDraftTask:"Rewrite as a clear single message a classmate can answer yes or no to.",speakingFollowUp:"Explain your origin briefly, then politely decline one date and offer a suitable replacement."},
 delayed:{spoken:"アリ：私はトルコから来て、今は大阪に住んでいます。神戸にある学校には月曜日に行きます。土曜日は忙しいので日曜日の朝なら大丈夫です。",
 question:"アリさんが今住んでいるのは？",answer:"大阪",foils:["トルコ","神戸"],reading:"ケンさんのふるさとは長崎です。今は福岡に住み、週末は佐賀にいる友達を訪ねます。日曜日の午後はアルバイトです。",
 readingQuestion:"ケンさんが日曜日の午後にできない理由は？",readingAnswer:"アルバイト",readingFoils:["佐賀に住んでいるから","学校で試験があるから"],contrast:"Origin, home, school and visiting location are four different relationships."}
},
{
 caseId:"cafe-and-shopping",focus:"Resolve a total mismatch without confusing price and quantity",
 why:"A price quotation, an item's number and a bill total are separate claims that must be checked.",
 culture:"A neutral request to check the receipt is more constructive than accusing staff of dishonesty before verifying items.",
 dialogue:[
 {speaker:"客",ja:"パンを一つと、お茶を二つお願いします。",en:"One bread and two teas, please.",intention:"Order two item types with different quantities."},
 {speaker:"店員",ja:"パンは二百円、お茶は一つ三百円です。合計八百円です。",en:"Bread is ¥200 and each tea is ¥300. The total is ¥800.",intention:"Explain unit prices and total."},
 {speaker:"客",ja:"レシートは千百円になっています。確認していただけますか。",en:"The receipt says ¥1,100. Could you check?",intention:"Point out a concrete mismatch without assigning blame."},
 {speaker:"店員",ja:"失礼しました。お茶を三つにしていました。二つに直します。",en:"Sorry, I entered three teas. I'll correct it to two.",intention:"Identify and repair the specific mistake."},
 {speaker:"客",ja:"ありがとうございます。八百円ですね。",en:"Thank you. ¥800, then.",intention:"Confirm the corrected payable total."}
 ],
 notice:{title:"レシートの修正",ja:"注文：パン一つ（二百円）、お茶二つ（一つ三百円）。正しい合計：八百円。最初のレシートはお茶三つで計算したため千百円でした。修正済みのレシートを渡しました。",en:"Ordered: one bread ¥200 and two teas ¥300 each. Correct total ¥800. The original receipt used three teas, total ¥1,100. A corrected receipt was issued."},
 evidence:{question:"最初のレシートが高かった理由は？",answer:"お茶が一つ多かった",foils:["パンが三つだった","飲み物が無料だった"],reasons:["The bread count was correct; the extra count was tea.","Nothing in the receipt says the drinks were free."]},
 decision:{question:"注文は八百円なのにレシートは千百円です。何と言いますか。",answer:"すみません、合計を確認していただけますか。",foils:["千百円です。間違いありません。","全部無料にしてください。"],reasons:["The receipt and order do not agree, so accepting the wrong total hides the issue.","The stated facts warrant a check, not a demand for all items to be free."]},
 revision:{task:"Write a short polite message identifying the quantities, expected total, receipt total and one request for verification.",audience:"Shop staff",contentChecks:[["数量","Did you identify which item's count was wrong?","State one bread and two teas, not three."],["合計","Did you show both the expected and printed totals?","Compare 八百円 and 千百円."],["確認","Does your response ask for a verifiable correction?","Use 確認していただけますか rather than a demand."]],
 modelPitfall:"Do not conflate the unit price ¥300 with the total ¥800.",politeness:"Use a verification request before attributing intentional misconduct.",secondDraftTask:"Rewrite to be shorter while retaining all amounts, quantities and the polite question.",speakingFollowUp:"Role-play shop customer and cashier with a new wrong item count."},
 delayed:{spoken:"店員：水は一つ百円、ケーキは一つ四百円です。お客様は水を二つ、ケーキを一つ注文しました。合計は六百円です。",
 question:"お客さんは水をいくつ注文しましたか。",answer:"二つ",foils:["一つ","三つ"],reading:"本日の注文：おにぎり三つ（一つ百五十円）とお茶一つ（二百円）。合計は六百五十円です。おにぎりは四つではありません。",
 readingQuestion:"おにぎりはいくつですか。",readingAnswer:"三つ",readingFoils:["四つ","二つ"],contrast:"Different products and prices: recompute from the new quantities; do not recall the first bill."}
},
{
 caseId:"meeting-replan",focus:"Get three people's constraints into one viable final plan",
 why:"A socially successful invitation requires a plan everybody can actually attend.",
 culture:"Avoid treating a suggested rainy-day alternative as an approved change until the other participants confirm it.",
 dialogue:[
 {speaker:"レナ",ja:"日曜日の午後、みんなで映画を見ませんか。",en:"Shall we watch a movie Sunday afternoon?",intention:"Offer a plan without claiming consent."},
 {speaker:"アリ",ja:"午後二時までは仕事ですが、三時からなら行けます。",en:"I work until two, but I can go from three.",intention:"Offer a constraint and alternative."},
 {speaker:"ユナ",ja:"私は四時半に家に帰らないといけません。",en:"I must return home at 4:30.",intention:"Specify a finishing constraint."},
 {speaker:"レナ",ja:"映画は二時間ですから、難しそうですね。近くの展示会なら一時間で見られます。",en:"A movie takes two hours, so that sounds hard. We could see a nearby exhibit in one hour.",intention:"Compare duration against everybody's availability."},
 {speaker:"アリ",ja:"そうですね。三時から展示会に行きましょう。",en:"Agreed. Let's go to the exhibit from three.",intention:"Accept the feasible alternative."},
 {speaker:"ユナ",ja:"いいですね。入口で三時に会いましょう。",en:"Great. Let's meet at the entrance at three.",intention:"Confirm the location and time."}
 ],
 notice:{title:"最終予定の共有",ja:"日曜日の予定は映画ではなく展示会に変更しました。午後三時に入口で集合し、四時ごろまで見学します。ユナさんは四時半までに帰る必要があります。変更がある場合は前もって全員に連絡してください。",en:"The plan changed from a movie to an exhibit. Meet Sunday at 3 p.m. at the entrance; visit until about 4. Yuna must be home by 4:30. Inform everyone ahead of any changes."},
 evidence:{question:"なぜ映画ではなく展示会にしましたか。",answer:"映画は時間が足りないから",foils:["映画館が休みだから","だれも映画が好きではないから"],reasons:["The cinema's opening hours are never mentioned.","No one said they dislike films; the conflict is the two-hour duration."]},
 decision:{question:"全員が参加できる予定は？",answer:"日曜日の三時から一時間、展示会を見る",foils:["日曜日の三時から二時間、映画を見る","日曜日の午後一時に集合する"],reasons:["A two-hour movie would end after Yuna's constraint.","Ali is still at work before 2 p.m."]},
 revision:{task:"Write a group-message revision explaining why an earlier plan failed, the new time/place/activity and who must leave early.",audience:"Three friends",contentChecks:[["理由","Does your message explain the schedule conflict?","Mention the two-hour film and the home deadline."],["代わり","Did you propose the practical shorter alternative?","Specify the one-hour exhibit instead of an impossible movie."],["確認","Did you state a meeting point and seek confirmation?","Name the entrance and 3 p.m."]],
 modelPitfall:"Do not claim the film was cancelled by the cinema; it was rejected for timing reasons.",politeness:"Present a recommendation as a proposal until friends explicitly agree.",secondDraftTask:"Write a concise final group message that a late-arriving friend can follow.",speakingFollowUp:"Play the organizer: restate each constraint, propose a viable alternative and request confirmation."},
 delayed:{spoken:"先生：土曜日の勉強会は午後一時から三時までの予定でしたが、会場は二時からしか使えません。三時まで一時間だけ行います。",
 question:"新しい勉強会は何時に始まりますか。",answer:"午後二時",foils:["午後一時","午後三時"],reading:"交流会は金曜日の午後七時から八時までです。参加者の一人が七時半からしか来られないため、話し合いを七時半から始めます。開場は七時のままです。",
 readingQuestion:"話し合いが始まるのは何時ですか。",readingAnswer:"午後七時半",readingFoils:["午後七時","午後八時"],contrast:"Distinguish venue access, doors opening, discussion start and total duration."}
},
{
 caseId:"order-and-allergy",focus:"Handle ingredient statements and cross-contact uncertainty precisely",
 why:"A dish not listing an ingredient does not guarantee that the kitchen is free of exposure.",
 culture:"When discussing allergies, avoid promising safety from ingredient labels alone; explicitly ask staff about preparation.",
 dialogue:[
 {speaker:"客",ja:"このうどんには卵が入っていますか。",en:"Does this udon contain egg?",intention:"Ask an ingredient-specific question."},
 {speaker:"店員",ja:"材料には卵を使っていませんが、同じ厨房で卵を使う料理も作っています。",en:"Egg isn't used as an ingredient, but we prepare egg dishes in the same kitchen.",intention:"Distinguish recipe from the shared environment."},
 {speaker:"客",ja:"卵のアレルギーがあるので、調理器具についても確認していただけますか。",en:"I have an egg allergy; could you check the cooking utensils too?",intention:"Request concrete preparation details rather than assuming safety."},
 {speaker:"店員",ja:"調理方法を確認してからお知らせします。少々お待ちください。",en:"I'll check the preparation and let you know. Please wait.",intention:"Avoid guessing before checking."},
 {speaker:"客",ja:"ありがとうございます。確認ができてから注文を決めます。",en:"Thank you. I'll decide after you have checked.",intention:"Defer the decision until relevant information is available."}
 ],
 notice:{title:"調理についてのお知らせ",ja:"野菜うどんの材料には卵を使っていません。ただし、同じ厨房で卵を使った料理を調理しています。アレルギーのある方は、注文前に材料だけでなく調理方法もスタッフにご相談ください。",en:"Vegetable udon ingredients contain no egg, but egg dishes are prepared in the same kitchen. Guests with allergies should consult staff about preparation as well as ingredients before ordering."},
 evidence:{question:"うどんについて、まだ確認が必要なのは？",answer:"調理方法",foils:["卵が材料にあるかどうか","うどんの名前"],reasons:["The ingredient list already says no egg; the unresolved issue is shared preparation.","The dish's name does not answer whether shared utensils are used."]},
 decision:{question:"安全かどうかまだ分かりません。どうしますか。",answer:"調理方法の確認ができるまで注文を待ちます。",foils:["材料に卵がないので必ず安全です。","何も聞かずに注文します。"],reasons:["Shared kitchen equipment means an ingredient list alone cannot guarantee safety.","The notice explicitly advises consultation before ordering."]},
 revision:{task:"Write a polite request distinguishing ingredient information from the unresolved question of shared utensils or preparation.",audience:"Restaurant staff",contentChecks:[["材料","Did you identify which ingredient you need to avoid?","State the actual relevant ingredient clearly."],["調理","Did you ask about preparation or shared equipment rather than assume safety?","Include a request to check the cooking process."],["確認","Does the message avoid treating an unanswered question as resolved?","Say you will decide once staff have confirmed."]],
 modelPitfall:"No native educational exercise can certify that a food is safe for someone with an allergy.",politeness:"Use 〜ていただけますか for a concrete verification request.",secondDraftTask:"Revise so the request is short, actionable and does not claim safety without evidence.",speakingFollowUp:"Ask staff both the ingredient question and the separate equipment question; wait for an answer."},
 delayed:{spoken:"店員：このサラダには牛乳を入れていませんが、ドレッシングに乳製品が含まれることがあります。スタッフに確認してください。",
 question:"確認が必要なのは何ですか。",answer:"ドレッシング",foils:["サラダの名前","店の営業時間"],reading:"お知らせ：このパンの材料にはナッツを使っていません。ただし、同じ機械でナッツ入りのパンも作っています。ご心配な方は注文前にスタッフへご相談ください。",
 readingQuestion:"この店で相談する必要がある理由は？",readingAnswer:"同じ機械を使うから",readingFoils:["すべてのパンにナッツが入っているから","店が休みだから"],contrast:"Different allergens and different potential exposure sources; never infer a universal safety guarantee."}
},
{
 caseId:"service-delay",focus:"Correct a reservation record and distinguish deadlines",
 why:"A booking email documents what was agreed; it does not automatically grant a remedy not mentioned.",
 culture:"In service interactions a specific polite request for verification is usually more useful than a broad accusation.",
 dialogue:[
 {speaker:"受付",ja:"ご予約は一泊で、喫煙可能なお部屋ですね。",en:"Our record shows a one-night stay in a smoking room.",intention:"Read back the system's recorded reservation."},
 {speaker:"客",ja:"メールには二泊で禁煙室と書いてあります。こちらを確認していただけますか。",en:"The email says two nights in a nonsmoking room. Could you check it?",intention:"Reference exact documentary evidence."},
 {speaker:"受付",ja:"申し訳ありません。日数が一泊になっていました。二泊に直します。",en:"I'm sorry. The length was recorded as one night. I'll correct it to two.",intention:"Acknowledge and address one confirmed error."},
 {speaker:"客",ja:"ありがとうございます。禁煙室についても確認をお願いします。",en:"Thank you. Please also check the nonsmoking room.",intention:"Do not treat the second discrepancy as automatically fixed."},
 {speaker:"受付",ja:"空き状況を調べてお知らせします。少々お待ちください。",en:"I'll check availability and let you know. Please wait.",intention:"Keep the remaining issue explicitly unresolved."}
 ],
 notice:{title:"予約確認の重要事項",ja:"予約確認メール：二泊・禁煙室。受付の最初の記録：一泊・一般室。宿泊日数は二泊に修正済み。禁煙室への変更は空き状況を調査中です。回答を受けるまでは変更が確定したわけではありません。",en:"The email says two nights in a nonsmoking room; reception initially showed one night in a general room. Nights have been corrected to two; nonsmoking availability is still being checked, not confirmed."},
 evidence:{question:"まだ確定していないのは何ですか。",answer:"禁煙室への変更",foils:["宿泊日数","予約した人の名前"],reasons:["The number of nights has already been corrected.","The guest's name is not identified as a problem."]},
 decision:{question:"受付：禁煙室の空きを調べています。どんな返事が適切ですか。",answer:"確認ができたら教えてください。",foils:["では、禁煙室が必ずありますね。","二泊の修正も取り消してください。"],reasons:["The clerk has not confirmed room availability.","The correction to the stay length is independent and already completed."]},
 revision:{task:"Write a calm message describing two reservation discrepancies; clearly distinguish what staff fixed from what remains unanswered.",audience:"Hotel reception",contentChecks:[["メール","Did you quote the exact evidence instead of inventing a booking term?","Mention the two-night nonsmoking email."],["修正","Did you separate the confirmed nights correction?","State that two nights have already been corrected."],["確認","Did you leave the unresolved room issue open?","Ask for a follow-up on nonsmoking availability."]],
 modelPitfall:"Do not write that the hotel has already assigned a nonsmoking room.",politeness:"Acknowledge the confirmed correction, then request the remaining verification.",secondDraftTask:"Revise into two short paragraphs: confirmed facts first, outstanding question second.",speakingFollowUp:"Role-play asking staff to verify two different issues without treating partial progress as full resolution."},
 delayed:{spoken:"受付：朝食付きの記録は確認できました。しかし、午後二時のチェックインはまだ保証できません。確認してからお知らせします。",
 question:"まだ保証できないのは？",answer:"午後二時のチェックイン",foils:["朝食付き","予約者の名前"],reading:"ホテルのお知らせ：駐車場の予約は確定しましたが、送迎バスの時間はまだ決まっていません。決まり次第メールでご連絡します。",
 readingQuestion:"まだ決まっていないものは？",readingAnswer:"送迎バスの時間",readingFoils:["駐車場の予約","ホテルの住所"],contrast:"Distinguish confirmed booking components from unresolved transport or early check-in details."}
},
{
 caseId:"transport-volunteer",focus:"Prevent uncovered shift gaps when new delays appear",
 why:"A planned handover is not an actual handover until someone has arrived and accepted responsibility.",
 culture:"A precise contingency and safety-first update show consideration for the group more than an unrealistic arrival promise.",
 dialogue:[
 {speaker:"責任者",ja:"午後三時から受付に入る予定でしたよね。",en:"You were scheduled to take reception from three, correct?",intention:"Establish the expected shift start."},
 {speaker:"ユナ",ja:"すみません。バスが故障して、三時には間に合いそうにありません。",en:"Sorry. The bus broke down; I probably won't make it by three.",intention:"Report the risk rather than hide it."},
 {speaker:"責任者",ja:"今の担当者が三時半まで残れるか聞いてみます。",en:"I'll ask if the current person can stay until 3:30.",intention:"Check a possible bridge rather than assume acceptance."},
 {speaker:"ユナ",ja:"ありがとうございます。新しいバスが来たら到着予定を連絡します。",en:"Thanks. I'll send my expected arrival once the replacement bus comes.",intention:"Promise a specific update, not a guaranteed time."},
 {speaker:"責任者",ja:"担当者の交代が確定するまで、受付を無人にしないようにします。",en:"We'll ensure reception stays staffed until the handover is confirmed.",intention:"Maintain the actual operational requirement."}
 ],
 notice:{title:"交代時間の変更（未確定）",ja:"受付交代は午後三時の予定でしたが、交通の問題で変更の可能性があります。三時半まで現担当者が残れるか、責任者が確認中です。交代時刻はまだ決まっていません。確認できるまでは、受付を無人にしないでください。",en:"Reception was due to change at three, but transport may delay it. The coordinator is checking whether the current person can cover until 3:30. No new changeover time is confirmed. Keep reception staffed."},
 evidence:{question:"まだ確定していないのは何ですか。",answer:"交代時刻",foils:["今の担当者がいること","午後三時が元の予定だったこと"],reasons:["The current shift is not disputed; extra coverage is being checked.","The original start time is known, but the replacement time remains unsettled."]},
 decision:{question:"ユナさんはまだ到着していません。何が適切ですか。",answer:"交代が確認できるまで受付を続けます。",foils:["三時になったので受付を無人にします。","到着したと報告します。"],reasons:["The safety condition prohibits an unattended reception.","Claiming arrival when absent is factually wrong."]},
 revision:{task:"Prepare a handover update naming the original coverage, current delay, an unconfirmed backup and the next confirmation step.",audience:"Volunteer coordinator",contentChecks:[["予定","Did you state the original shift and changed arrival estimate?","Distinguish original time from possible new time."],["未確定","Did you avoid treating backup coverage as confirmed?","Say the current person's extra shift is still being checked."],["連絡","Did you specify who sends the next update?","Assign a clear contact action once the bus situation changes."]],
 modelPitfall:"Do not assert the current volunteer has agreed to stay without checking.",politeness:"Thank the coordinator while giving actionable, accurate information.",secondDraftTask:"Write a concise handover message a coordinator could forward without correcting uncertainties.",speakingFollowUp:"Role-play a coordinator asking for status and a volunteer making a concrete but conditional plan."},
 delayed:{spoken:"スタッフ：四時からの受付をケンさんが担当するはずでしたが、体調が悪くなりました。代わりの人が来るまで私が残ります。",
 question:"代わりの人が来るまでは誰が受付にいますか。",answer:"今話しているスタッフ",foils:["ケン","だれもいない"],reading:"運営連絡：午後二時から三時の受付はミナが担当します。三時以降はアリに交代する予定ですが、到着確認前に持ち場を離れないでください。",
 readingQuestion:"いつ持ち場を離れてもいいですか。",readingAnswer:"アリの到着を確認してから",readingFoils:["午後三時ちょうど","何も確認せずに"],contrast:"Different people and shifts: handover depends on actual confirmation rather than clock time."}
}
];
export const e08ByCase=new Map(E08_EXTENSIONS.map(x=>[x.caseId,x] as const));
