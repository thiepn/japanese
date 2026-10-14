/**
 * E09 original cross-context Japanese authored for this app.
 * No new canonical IDs, Marugoto passages, native recordings or proficiency grades.
 * Every item inherits the already validated E06 source unit/Can-do or remains read-only.
 */
export interface E09CaseDepth {
 caseId:string;title:string;communicativeGoal:string;
 speakers:readonly {name:string;ja:string;meaning:string;intention:string}[];
 reading:{type:string;title:string;ja:string;meaning:string};
 vocabulary:readonly {ja:string;meaning:string;contrast:string}[];
 grammar:readonly {expression:string;role:string;misconception:string}[];
 listening:{question:string;answer:string;wrong:readonly [string,string];why:readonly [string,string]};
 readingCheck:{question:string;answer:string;wrong:readonly [string,string];why:readonly [string,string]};
 production:{newAudience:string;firstProblem:string;revisionFocus:string;selfCheck:readonly string[];followUp:string};
 delayed:{speech:string;question:string;answer:string;wrong:readonly [string,string];why:readonly [string,string];
  notice:string;readQuestion:string;readAnswer:string;readWrong:readonly [string,string];readWhy:readonly [string,string]};
}
export const E09_DEPTH:readonly E09CaseDepth[]=[
{
 caseId:"introduce-and-find-help",title:"Find the right event when two locations share a name",
 communicativeGoal:"Check which event you mean, then give the correct entrance, floor and start time.",
 speakers:[
 {name:"受付",ja:"日本語の交流会ですか。それとも会話クラスですか。",meaning:"Are you here for the Japanese social meeting or the conversation class?",intention:"Disambiguate two plausible destinations."},
 {name:"レナ",ja:"交流会です。初めて来ました。",meaning:"The social meeting. It's my first time here.",intention:"Specify the event without pretending familiarity."},
 {name:"受付",ja:"交流会は別館の二階で、六時からです。会話クラスは本館の三階です。",meaning:"The meeting is on floor two of the annex from six. The conversation class is on floor three of the main building.",intention:"Distinguish building, floor and schedule."},
 {name:"レナ",ja:"別館はどちらですか。入り口が二つあるので、分かりません。",meaning:"Which way is the annex? There are two entrances, and I'm not sure.",intention:"Make the unresolved part explicit."},
 {name:"受付",ja:"右の入り口から入って、階段で二階に上がってください。",meaning:"Enter through the right entrance and go up to floor two using the stairs.",intention:"Give executable navigation."},
 {name:"レナ",ja:"ありがとうございます。右の入り口からですね。",meaning:"Thank you. Through the right entrance, then.",intention:"Confirm the new directional information."}
 ],
 reading:{type:"event notice",title:"二つの日本語イベント",ja:"本館三階：会話クラス、午後五時開始。別館二階：交流会、午後六時開始。別館の入り口は建物の右側にあります。参加したいイベントと場所を受付でご確認ください。",meaning:"Conversation class: main building, floor three, 5 p.m. Social meeting: annex, floor two, 6 p.m. Annex entrance on the right. Check which event you want."},
 vocabulary:[
 {ja:"本館",meaning:"main building",contrast:"Not the annex: 別館"},
 {ja:"別館",meaning:"annex / separate building",contrast:"A building difference is not merely a room change"},
 {ja:"入り口",meaning:"entrance",contrast:"Not identical to 受付 (reception desk)"},
 {ja:"どちらですか",meaning:"Which way / which of the two?",contrast:"Used politely to resolve an ambiguous destination"}
 ],
 grammar:[
 {expression:"Aですか。それともBですか。",role:"Offer two options when the first question is ambiguous.",misconception:"Do not assume the person means the more familiar class."},
 {expression:"右の入り口から入ってください。",role:"The て-form connects the action to a polite direction.",misconception:"から marks the point of entry, not a personal origin."},
 {expression:"別館の二階",role:"の connects the building to the floor.",misconception:"Second floor of another building is not the main building's second floor."}
 ],
 listening:{question:"レナさんはどちらのイベントに行きたいですか。",answer:"交流会",wrong:["会話クラス","両方"],why:["She explicitly says 交流会, not 会話クラス.","No one says she intends to attend both events."]},
 readingCheck:{question:"会話クラスはどこで始まりますか。",answer:"本館三階",wrong:["別館二階","別館三階"],why:["The annex's second floor is for the social meeting.","The class takes place in the main building, not the annex."]},
 production:{newAudience:"A first-time visitor who mixes up the two Japanese events",firstProblem:"Explain both event locations, identify the right entrance and offer a clarification question.",revisionFocus:"Make the destination, building and floor explicit; avoid repeating an unexplained room number.",selfCheck:["Does your message distinguish the two events?","Does it include the right entrance for the annex?","Would a visitor know how to confirm which event they need?"],followUp:"Answer the visitor's question, then ask which event they intend to attend."},
 delayed:{speech:"案内係：今日の交流会は北館一階です。会話クラスは南館の三階で午後七時に始まります。",
 question:"会話クラスはどこですか。",answer:"南館三階",wrong:["北館一階","南館一階"],why:["The north building is the social event.","The conversation class is on the third floor, not the first."],
 notice:"本日の勉強会は西館の二階、映画会は東館の一階です。どちらも午後五時からです。建物を間違えないでください。",
 readQuestion:"映画会はどこですか。",readAnswer:"東館一階",readWrong:["西館二階","東館二階"],readWhy:["The study group, not the film event, is in the west building.","The film event is on floor one in the east building."]}
},
{
 caseId:"origin-family-and-plans",title:"Plan a visit without confusing home, work and destination",
 communicativeGoal:"Ask where someone lives now, understand work constraints and confirm a visit rather than infer from origin.",
 speakers:[
 {name:"アリ",ja:"休みの日はどこへ行きたいですか。",meaning:"Where would you like to go on your day off?",intention:"Ask about a future destination."},
 {name:"ミナ",ja:"京都に行きたいです。今は大阪に住んでいますが、京都へはまだ行ったことがありません。",meaning:"I want to go to Kyoto. I live in Osaka now, but haven't been to Kyoto yet.",intention:"Separate residence from destination and experience."},
 {name:"アリ",ja:"私は京都で働いています。でも、土曜日は仕事なので、日曜日なら案内できます。",meaning:"I work in Kyoto, but work Saturday, so I can show you around on Sunday.",intention:"Distinguish workplace and available day."},
 {name:"ミナ",ja:"ありがとうございます。日曜日の朝は家族に電話するので、午後がいいです。",meaning:"Thanks. I'll call my family Sunday morning, so afternoon is better.",intention:"Give a reason for a second constraint."},
 {name:"アリ",ja:"それなら二時に京都駅の中央口で会いましょう。",meaning:"Then let's meet at Kyoto Station's central entrance at two.",intention:"Specify the agreed location and time."},
 {name:"ミナ",ja:"日曜日の二時、京都駅の中央口ですね。",meaning:"Sunday at two, Kyoto Station central entrance.",intention:"Confirm the actionable result."}
 ],
 reading:{type:"personal message",title:"日曜日のお出かけ",ja:"ミナは大阪に住んでいます。日曜日の午前中は家族に電話する予定です。午後二時に京都駅の中央口でアリと会い、京都の町を歩きます。アリの職場は京都ですが、住んでいる場所については書かれていません。",meaning:"Mina lives in Osaka, calls family Sunday morning and meets Ali at Kyoto Station at 2 p.m. Ali works in Kyoto; his home is not given."},
 vocabulary:[
 {ja:"住んでいます",meaning:"currently lives",contrast:"Different from 出身です (is from)"},
 {ja:"働いています",meaning:"works",contrast:"Workplace is not necessarily residence"},
 {ja:"行ったことがありません",meaning:"has never been",contrast:"Past experience, not a future plan"},
 {ja:"中央口",meaning:"central entrance",contrast:"A specific station entrance, not just the station"}
 ],
 grammar:[
 {expression:"京都へはまだ行ったことがありません。",role:"State absence of prior experience.",misconception:"This does not mean Kyoto is inaccessible tomorrow."},
 {expression:"土曜日は仕事なので、日曜日なら案内できます。",role:"Reason + conditional availability.",misconception:"なら identifies a viable day, not the declined one."},
 {expression:"京都駅の中央口で会いましょう。",role:"で marks the location of meeting.",misconception:"に in 京都に行きます marks a destination; it is not automatically interchangeable."}
 ],
 listening:{question:"二人が会うのはいつですか。",answer:"日曜日の午後二時",wrong:["土曜日の午後二時","日曜日の午前二時"],why:["Ali is working on Saturday.","Mina says Sunday morning is for calling family."]},
 readingCheck:{question:"アリさんは京都に住んでいますか。",answer:"書かれていません",wrong:["はい、住んでいます","大阪に住んでいます"],why:["His workplace in Kyoto does not establish his residence.","The notice says Mina lives in Osaka; Ali's home is unstated."]},
 production:{newAudience:"Friend arranging to accompany you on a first visit",firstProblem:"Explain what you have not done before, a non-negotiable schedule constraint, and the proposed entrance and time.",revisionFocus:"Distinguish past experience, current home, work location and the future meeting.",selfCheck:["Did you use a specific day and entrance?","Did you distinguish the place of work from a home address?","Did you explain why one time is unavailable?"],followUp:"Have the friend question your home city; correct the assumption before agreeing on a meeting."},
 delayed:{speech:"ケン：東京に住んでいますが、横浜の会社で働いています。日曜日は夕方まで用事があるので月曜日に会いませんか。",
 question:"ケンさんが働いているのはどこですか。",answer:"横浜",wrong:["東京","京都"],why:["Tokyo is his home.","Kyoto is not mentioned in this new plan."],
 notice:"レナは福岡出身で、今は長崎に住んでいます。佐賀の学校に月曜から金曜まで通っています。土曜日は自由です。",
 readQuestion:"レナさんの出身地は？",readAnswer:"福岡",readWrong:["長崎","佐賀"],readWhy:["Nagasaki is current residence.","Saga is the school location, not origin."]}
},
{
 caseId:"cafe-and-shopping",title:"Make an exchange and keep item price separate from refund",
 communicativeGoal:"Clarify size, exchange eligibility and receipt facts without demanding an unconfirmed store remedy.",
 speakers:[
 {name:"客",ja:"昨日買ったこのシャツは少し小さかったです。サイズを交換できますか。",meaning:"The shirt I bought yesterday was a bit small. Can I exchange the size?",intention:"Ask whether an exchange is possible."},
 {name:"店員",ja:"レシートはお持ちですか。",meaning:"Do you have the receipt?",intention:"Request evidence before explaining policy."},
 {name:"客",ja:"はい、あります。千八百円で買いました。",meaning:"Yes. I bought it for ¥1,800.",intention:"Supply proof and the amount paid."},
 {name:"店員",ja:"同じ色の大きいサイズは売り切れましたが、青ならあります。",meaning:"The larger size in the same color is sold out, but blue is available.",intention:"Explain a relevant stock limitation."},
 {name:"客",ja:"青は少し苦手です。返金できるか確認していただけますか。",meaning:"Blue isn't quite for me. Could you check whether a refund is possible?",intention:"Request a check, not assert an entitlement."},
 {name:"店員",ja:"担当者に確認してからお知らせします。",meaning:"I'll check with the person responsible and let you know.",intention:"Leave outcome pending verification."}
 ],
 reading:{type:"store policy notice",title:"交換と返金について",ja:"商品交換にはレシートが必要です。同じ商品が在庫切れの場合、ほかの色を案内することがあります。返金の可否は商品状態と購入日を確認してからご案内します。返金が必ずできるとは限りません。",meaning:"Receipt needed for exchange. If the identical item is out of stock, staff may suggest another color. Refund eligibility depends on item condition and purchase date; it is not guaranteed."},
 vocabulary:[
 {ja:"交換",meaning:"exchange",contrast:"Different from 返金 (refund)"},
 {ja:"在庫切れ",meaning:"out of stock",contrast:"Does not mean every alternative size or color is unavailable"},
 {ja:"売り切れました",meaning:"has sold out",contrast:"A stock fact, not proof that refund is obligatory"},
 {ja:"可否",meaning:"whether allowed/possible",contrast:"Indicates pending eligibility, not confirmed approval"}
 ],
 grammar:[
 {expression:"交換できますか。",role:"Ask about possibility politely.",misconception:"An affirmative answer is not presupposed."},
 {expression:"青ならあります。",role:"Offer a limited available alternative.",misconception:"Availability of blue doesn't imply the original color exists."},
 {expression:"確認していただけますか。",role:"Ask staff to verify uncertain policy details.",misconception:"Do not use a statement of certain refund when the outcome is pending."}
 ],
 listening:{question:"在庫があるのは何ですか。",answer:"青の大きいサイズ",wrong:["同じ色の大きいサイズ","すべての色"],why:["The same-color larger shirt has sold out.","Only blue is identified as an available alternative."]},
 readingCheck:{question:"返金が必ずできますか。",answer:"いいえ、確認が必要です",wrong:["はい、必ずできます","レシートなしでもできます"],why:["Eligibility requires an assessment; approval is not guaranteed.","The store requires a receipt for exchanges, and nothing guarantees unconditional refunds."]},
 production:{newAudience:"Shop employee responsible for checking returns",firstProblem:"Write a concise message including purchase date, receipt, size issue and the unresolved refund question.",revisionFocus:"Avoid mixing the price paid, exchange options and refund policy.",selfCheck:["Is the original item and size problem clear?","Did you distinguish exchanging from refunding?","Did you request verification rather than assert guaranteed approval?"],followUp:"Role-play the employee who suggests blue; politely explain why it is unsuitable and ask about another option."},
 delayed:{speech:"客：この靴は二千四百円でした。サイズが合わないので交換したいです。店員：同じ色はありませんが、黒ならございます。",
 question:"店員が提案した色は何ですか。",answer:"黒",wrong:["青","白"],why:["The new scenario offers black, not blue.","White is not offered."],
 notice:"店のお知らせ：先月のセール品については購入日を確認します。返品・返金の対応が可能かは個別にお知らせします。必ず返金するわけではありません。",
 readQuestion:"この店はセール品の返金を保証していますか。",readAnswer:"いいえ",readWrong:["はい","購入日を確認しなくてもいい"],readWhy:["Individual eligibility check is required.","The purchase date is one of the facts to verify."]}
},
{
 caseId:"meeting-replan",title:"Negotiate a group booking with a limited room",
 communicativeGoal:"Compare an original plan to real venue availability and confirm a viable alternative for everyone.",
 speakers:[
 {name:"ユナ",ja:"三人で料理教室に参加したいんですが、土曜日の午後は空いていますか。",meaning:"The three of us would like to join a cooking class. Is Saturday afternoon available?",intention:"Ask for availability before assuming a reservation."},
 {name:"受付",ja:"土曜日は満席ですが、日曜日の十時なら三名参加できます。",meaning:"Saturday is full, but there are three places Sunday at ten.",intention:"Offer a precise alternative."},
 {name:"アリ",ja:"日曜日の午前中は家族の予定があるので、十一時からなら行けます。",meaning:"I have family plans Sunday morning; I can attend from eleven.",intention:"Make a second constraint visible."},
 {name:"受付",ja:"教室は十時から正午までで、途中からの参加はできません。",meaning:"The class is from ten until noon; late entry is not possible.",intention:"State a constraint that defeats the offered alternative."},
 {name:"ユナ",ja:"分かりました。別の日の午後のクラスを教えていただけますか。",meaning:"Understood. Could you tell us about another afternoon class?",intention:"Seek a feasible option rather than claim a booking."}
 ],
 reading:{type:"booking page",title:"料理教室の予約状況",ja:"土曜十四時：満席。日曜十時〜十二時：三名分の空席あり。ただし開始後の入室はできません。次の土曜十四時の予約開始日は来週月曜です。現在、その回の予約はできません。",meaning:"Saturday 2 p.m. full; Sunday 10–12 has three places, but late entry not possible. Booking for the following Saturday opens next Monday and is not yet available."},
 vocabulary:[
 {ja:"満席",meaning:"fully booked",contrast:"Does not mean the venue is closed"},
 {ja:"空席",meaning:"available places/seats",contrast:"Availability isn't proof that each friend can attend"},
 {ja:"途中から",meaning:"from partway through",contrast:"Not allowed in this event"},
 {ja:"予約開始日",meaning:"date bookings open",contrast:"Not the date of the actual lesson"}
 ],
 grammar:[
 {expression:"十時なら三名参加できます。",role:"Conditional availability for a specific number.",misconception:"Three open places alone don't satisfy a friend's timing constraint."},
 {expression:"途中からの参加はできません。",role:"Express a disallowed participation format.",misconception:"Cannot infer an exception for one participant."},
 {expression:"別の日の午後のクラスを教えていただけますか。",role:"Ask for a feasible different option politely.",misconception:"Asking doesn't automatically create a reservation."}
 ],
 listening:{question:"アリさんが参加できない理由は？",answer:"十一時からしか来られないから",wrong:["参加費が高いから","三人分の空席がないから"],why:["No price was discussed.","Three seats are free Sunday but Ali cannot attend from the start."]},
 readingCheck:{question:"来週土曜の予約は今できますか。",answer:"いいえ、来週月曜からです",wrong:["はい、もうできます","日曜十時からできます"],why:["Booking for that class only opens next Monday.","Sunday at ten is the time of another lesson, not the booking opening date."]},
 production:{newAudience:"Friends coordinating a course and the venue manager",firstProblem:"Explain why the first alternative also fails, quote the no-late-entry policy and request a future afternoon slot.",revisionFocus:"Distinguish capacity, individual availability and booking opening dates.",selfCheck:["Did you separate all three constraints?","Does the request avoid promising a place before booking opens?","Is the alternative time workable for all participants?"],followUp:"Play one friend who cannot attend from ten; politely ask for another option without pressuring the venue."},
 delayed:{speech:"受付：木曜日は満席ですが、金曜日の午後六時なら四名参加できます。途中入場はできません。",
 question:"参加できるのはいつですか。",answer:"金曜日の午後六時",wrong:["木曜日の午後六時","金曜日の午前六時"],why:["Thursday is full.","The time is 6 p.m., not 6 a.m."],
 notice:"スポーツ講座：日曜午後三時の枠は空いていますが、予約は金曜の午前九時から受け付けます。予約前に参加が確定したとは言えません。",
 readQuestion:"予約受付が始まるのは？",readAnswer:"金曜の午前九時",readWrong:["日曜の午後三時","金曜の午後九時"],readWhy:["Sunday 3 p.m. is the event time.","The booking opens at nine in the morning, not evening."]}
},
{
 caseId:"order-and-allergy",title:"Confirm a changed recipe without assuming medical safety",
 communicativeGoal:"Clarify ingredient changes, separate information from confirmation and decide only after preparation details are verified.",
 speakers:[
 {name:"客",ja:"前にこのカレーを食べましたが、今日は材料が変わりましたか。",meaning:"I've had this curry before. Have the ingredients changed today?",intention:"Avoid assuming last visit's recipe still applies."},
 {name:"店員",ja:"今日は新しいソースを使っています。材料表を確認します。",meaning:"We use a new sauce today. I'll check the ingredient list.",intention:"Identify a recipe change and initiate verification."},
 {name:"客",ja:"乳製品を食べられないので、そのソースに入っているか知りたいです。",meaning:"I can't eat dairy, so I need to know whether that sauce contains it.",intention:"Explain the precise restriction."},
 {name:"店員",ja:"ソースには牛乳が入っていませんが、同じ調理場で乳製品を使っています。",meaning:"The sauce contains no milk, but we handle dairy in the same kitchen.",intention:"Distinguish ingredients from shared handling."},
 {name:"客",ja:"分かりました。調理器具も確認していただけますか。",meaning:"Understood. Could you check the equipment as well?",intention:"Seek missing preparation information."},
 {name:"店員",ja:"はい。確認してからお伝えしますので、少々お待ちください。",meaning:"Yes. I'll check and then tell you. Please wait.",intention:"Keep the response unconfirmed until checked."}
 ],
 reading:{type:"ingredient update",title:"本日のメニュー変更",ja:"本日より新しいソースに変わりました。ソース自体に牛乳は使っていませんが、調理場では乳製品を使用しています。アレルギーに関する調理器具の使用状況はスタッフへお問い合わせください。材料表示だけで安全性を保証するものではありません。",meaning:"A new sauce is used today. It contains no milk as an ingredient, but dairy is handled in the kitchen. Ask staff about equipment use; the ingredient notice doesn't guarantee safety."},
 vocabulary:[
 {ja:"材料表",meaning:"ingredient list",contrast:"Not a complete map of kitchen cross-contact"},
 {ja:"調理器具",meaning:"cooking utensils/equipment",contrast:"Separate from the ingredients of a dish"},
 {ja:"変わりました",meaning:"has changed",contrast:"Previously safe or familiar recipes cannot be assumed unchanged"},
 {ja:"保証",meaning:"guarantee",contrast:"A limited ingredient statement is not an unconditional guarantee"}
 ],
 grammar:[
 {expression:"変わりましたか。",role:"Ask about a change from a prior state.",misconception:"Past familiarity is not proof of today's recipe."},
 {expression:"確認してからお伝えします。",role:"Sequence verification before reporting results.",misconception:"Staff have not yet answered the equipment question."},
 {expression:"〜ていただけますか。",role:"Polite request for a specific action.",misconception:"Courtesy doesn't supply information that has not yet been checked."}
 ],
 listening:{question:"まだ分からないことは何ですか。",answer:"調理器具の使い方",wrong:["ソースに牛乳が入るかどうか","ソースが新しくなったかどうか"],why:["The sauce ingredient list already states that no milk is used.","The staff clearly said the sauce is new."]},
 readingCheck:{question:"材料表示だけで安全だと保証していますか。",answer:"いいえ",wrong:["はい","すべての乳製品が禁止されています"],why:["The notice expressly declines a safety guarantee.","It does not say dairy is entirely banned from the kitchen."]},
 production:{newAudience:"Restaurant staff handling a changed menu",firstProblem:"Ask about one restricted ingredient, identify the recipe change and request checking of equipment before choosing.",revisionFocus:"Never rewrite an unanswered preparation question as a promise of safety.",selfCheck:["Did you ask specifically about the ingredient?","Did you acknowledge the changed recipe?","Did you ask for the missing preparation detail without assuming the answer?"],followUp:"In a new role-play, explain why you cannot decide until staff have verified the equipment."},
 delayed:{speech:"店員：今週からこのパンには新しいクリームを使っています。原材料に卵がありますので、卵が苦手な方はお気を付けください。",
 question:"新しいクリームには何が入っていますか。",answer:"卵",wrong:["牛乳だけ","魚"],why:["The staff explicitly mentions egg.","Fish isn't mentioned."],
 notice:"季節のスープには豆を使っています。ナッツは材料に使っていませんが、同じ厨房でナッツ入りの料理も作ります。詳しくはスタッフにお問い合わせください。",
 readQuestion:"確認が必要なのはどんな情報ですか。",readAnswer:"調理場での扱い",readWrong:["スープの名前","店の開店時刻"],readWhy:["The question concerns how the kitchen handles nuts.","Opening hours don't address the dietary concern."]}
},
{
 caseId:"service-delay",title:"Distinguish verified hotel changes from pending arrangements",
 communicativeGoal:"Track confirmation, pending requests and practical deadlines across two messages.",
 speakers:[
 {name:"受付",ja:"予約の部屋は確保できましたが、チェックイン時間の変更はまだ確認中です。",meaning:"We've secured your reserved room, but the check-in time change is still under review.",intention:"Separate a confirmed fact from a pending request."},
 {name:"客",ja:"ありがとうございます。何時ごろ分かりますか。",meaning:"Thank you. Around when will you know?",intention:"Ask for a verification timeline."},
 {name:"受付",ja:"午後一時までにメールでお知らせします。",meaning:"We'll email you by 1 p.m.",intention:"Commit to a response deadline, not an early check-in."},
 {name:"客",ja:"一時に入れるという意味ですか。",meaning:"Does that mean I can check in at one?",intention:"Check the meaning rather than assume."},
 {name:"受付",ja:"いいえ、回答をお送りする時間です。入室時間はまだ決まっていません。",meaning:"No, that's when we'll send the answer. The room entry time isn't decided yet.",intention:"Clarify two distinct time commitments."},
 {name:"客",ja:"分かりました。メールを確認してから向かいます。",meaning:"Understood. I'll check the email before coming.",intention:"Choose a plan based on confirmed information."}
 ],
 reading:{type:"hotel follow-up email",title:"ホテルからのご連絡",ja:"お部屋の予約は確定しております。チェックイン時刻の変更については、現在確認中です。午後一時までに結果をメールでご案内いたします。午後一時に入室できることを保証するものではありません。",meaning:"The room reservation is confirmed. A check-in change is under review; results will be emailed by 1 p.m. This does not guarantee entry at 1."},
 vocabulary:[
 {ja:"確保できました",meaning:"has been secured",contrast:"Specific to the room, not necessarily early check-in"},
 {ja:"確認中",meaning:"being checked",contrast:"Not yet confirmed"},
 {ja:"結果",meaning:"result/outcome",contrast:"A result-delivery deadline is not an entry time"},
 {ja:"入室",meaning:"entering the room",contrast:"Separate from receiving a message"}
 ],
 grammar:[
 {expression:"〜までにお知らせします。",role:"Promise to notify by a deadline.",misconception:"The notification deadline is not automatically the action time."},
 {expression:"〜という意味ですか。",role:"Verify an interpretation of someone else's words.",misconception:"Do not silently treat ambiguity as confirmed."},
 {expression:"〜てから向かいます。",role:"Sequence confirmation before action.",misconception:"This doesn't claim the requested accommodation has been approved."}
 ],
 listening:{question:"午後一時は何の時間ですか。",answer:"回答のメールを送る期限",wrong:["入室できる時刻","チェックアウトの時間"],why:["Staff explicitly deny that one is a guaranteed check-in time.","Check-out is not the point of discussion."]},
 readingCheck:{question:"午後一時に入室できると保証されていますか。",answer:"いいえ",wrong:["はい","すべての予約が取消しになりました"],why:["The notice explicitly says no guarantee.","The room reservation is confirmed, not canceled."]},
 production:{newAudience:"Hotel reception following an incomplete request",firstProblem:"Write a polite reply distinguishing what is confirmed, the promised reply deadline and the still-unknown check-in time.",revisionFocus:"Do not transform an email response deadline into a guarantee of room access.",selfCheck:["Did you name the confirmed room reservation?","Did you ask about the unconfirmed change?","Did you distinguish the email deadline from entry time?"],followUp:"Ask a hotel representative to clarify an ambiguous check-in time, then restate it accurately."},
 delayed:{speech:"受付：荷物のお預かりはできますが、お部屋に入れる時間はまだ決まっていません。午後二時までにご連絡します。",
 question:"確実にできるのは何ですか。",answer:"荷物を預けること",wrong:["午後二時に入室すること","すぐチェックアウトすること"],why:["Only a reply by two is promised, not room entry.","Checkout isn't the discussed service."],
 notice:"予約の駐車場は確保しました。空港への送迎については担当者に確認中です。今日の午後四時までに結果をお知らせします。",
 readQuestion:"まだ確認中なのは？",readAnswer:"空港への送迎",readWrong:["駐車場の予約","ホテルの建物"],readWhy:["The parking is confirmed.","The building isn't identified as unresolved."]}
},
{
 caseId:"transport-volunteer",title:"Hand over responsibility during two separate delays",
 communicativeGoal:"Separate an expected arrival from confirmed handover and update the responsible coordinator.",
 speakers:[
 {name:"ユナ",ja:"交通事故でバスが遅れています。予定の四時には着けません。",meaning:"The bus is delayed by a traffic accident. I can't arrive by the planned four.",intention:"Report confirmed delay accurately."},
 {name:"ケン",ja:"今の受付担当は四時半まで残れるかもしれません。まだ本人に確認していません。",meaning:"The current receptionist might be able to stay until 4:30, but I haven't checked.",intention:"Mark tentative cover as tentative."},
 {name:"ユナ",ja:"私は五時ごろ着くと思います。誰が四時半から五時まで対応できますか。",meaning:"I think I'll arrive around five. Who can cover 4:30–5?",intention:"Identify an uncovered gap, not just the initial delay."},
 {name:"ケン",ja:"責任者に相談して、決まったら全員に連絡します。",meaning:"I'll consult the coordinator and update everyone when decided.",intention:"Assign the next verification step."},
 {name:"ユナ",ja:"ありがとうございます。安全に移動して、到着したら必ず連絡します。",meaning:"Thanks. I'll travel safely and contact you on arrival.",intention:"Commit to safety and concrete communication."}
 ],
 reading:{type:"handover update",title:"受付の交代（確認中）",ja:"ユナの到着予想は午後五時ごろです。現在の受付担当が四時半まで残れるかは未確認です。四時半から五時までの担当も決まっていません。責任者が交代者を確認するまで受付を無人にしないでください。",meaning:"Yuna expects to arrive around five. Whether current coverage lasts to 4:30 is unverified, and 4:30–5 has no confirmed cover. Keep reception staffed until the coordinator confirms a handover."},
 vocabulary:[
 {ja:"予想",meaning:"estimate/prediction",contrast:"Not a guaranteed arrival"},
 {ja:"未確認",meaning:"not yet checked",contrast:"Not equivalent to refusal"},
 {ja:"対応",meaning:"provide coverage/handle",contrast:"A proposed person isn't a confirmed replacement"},
 {ja:"無人",meaning:"unattended/unmanned",contrast:"A risk requiring a real handover plan"}
 ],
 grammar:[
 {expression:"〜かもしれません。",role:"Represent uncertain extra coverage.",misconception:"Do not claim a possible substitute has agreed."},
 {expression:"〜ごろ着くと思います。",role:"Provide an estimated arrival.",misconception:"An estimate isn't a binding coverage promise."},
 {expression:"決まったら全員に連絡します。",role:"Commit to notification after confirmation.",misconception:"Conditional communication does not itself confirm the replacement."}
 ],
 listening:{question:"四時半から五時までの問題は？",answer:"受付担当が決まっていない",wrong:["ユナがすでに着いた","イベントが中止になった"],why:["Yuna expects to arrive around five; she hasn't arrived.","No cancellation is announced."]},
 readingCheck:{question:"現在確認できていないことは？",answer:"四時半までの延長とその後の担当",wrong:["ユナの名前","建物の住所"],why:["Her identity is not in question.","The issue is actual coverage, not the building's address."]},
 production:{newAudience:"Volunteer lead and two prospective cover staff",firstProblem:"Draft an update listing expected arrival, currently unconfirmed coverage, the uncovered interval and who verifies the replacement.",revisionFocus:"Don't report a tentative substitute as a confirmed person; specify who will communicate the result.",selfCheck:["Did you distinguish actual coverage from suggestions?","Did you identify the four-thirty-to-five gap?","Did you specify the next verification and handover contact?"],followUp:"Role-play a volunteer explaining two delays while protecting an unstaffed reception point."},
 delayed:{speech:"責任者：午後六時から七時までの受付担当は決まりました。でも、七時から八時の担当はまだ探しています。",
 question:"まだ担当者がいないのは？",answer:"午後七時から八時",wrong:["午後六時から七時","午後五時から六時"],why:["Six to seven has a confirmed person.","Five to six isn't the uncovered time in this update."],
 notice:"お知らせ：午後二時から三時はアリが受付をします。三時から四時は調整中です。交代が確定したらメールで連絡します。まだ確定していません。",
 readQuestion:"確認が必要なのはいつの担当ですか。",readAnswer:"午後三時から四時",readWrong:["午後二時から三時","午後四時から五時"],readWhy:["Two to three is covered by Ali.","Four to five isn't specified as the unresolved interval."]}
}
];
export const E09_BY_CASE=new Map(E09_DEPTH.map(c=>[c.caseId,c] as const));
