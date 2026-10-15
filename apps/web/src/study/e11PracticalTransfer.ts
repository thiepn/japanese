/**
 * Original E11 micro-transfer: new problems, not extra canonical course units.
 * Distinct from E06/E08/E09 dialogues and notices. Japanese text was authored
 * for this app and is not a Marugoto excerpt or native recording.
 */
export interface E11PracticalTransfer {
 caseId:string;goal:string;setting:string;
 turns:readonly {speaker:string;ja:string;en:string;intent:string}[];
 reading:{title:string;ja:string;en:string};
 vocabulary:readonly {expression:string;meaning:string;contrast:string}[];
 grammar:{pattern:string;function:string;mistake:string};
 listening:{question:string;answer:string;wrong:readonly [string,string];wrongWhy:readonly [string,string]};
 readingQuestion:{question:string;answer:string;wrong:readonly [string,string];wrongWhy:readonly [string,string]};
 pragmaticDecision:string;writingAudience:string;
 writingRevision:readonly [string,string,string][]; // skill, question, suggested revision
 spokenChallenge:string;
}
export const E11_TRANSFER:readonly E11PracticalTransfer[]=[
 {caseId:"introduce-and-find-help",goal:"Clarify the right entrance when the same event is held twice",
 setting:"A visitor recognizes a familiar event name, but the morning and evening sessions enter from different doors.",
 turns:[
  {speaker:"来場者",ja:"すみません、交流会の受付はここですか。",en:"Excuse me, is this the reception desk for the exchange event?",intent:"Request a location without assuming this is the right session."},
  {speaker:"案内係",ja:"午前の交流会ですか。それとも午後の交流会ですか。",en:"The morning session or the afternoon session?",intent:"Disambiguate two sessions with the same name."},
  {speaker:"来場者",ja:"午後六時からの交流会です。",en:"The exchange event starting at six in the evening.",intent:"Supply a decisive time."},
  {speaker:"案内係",ja:"その会は西の入り口から入ってください。こちらは午前の受付です。",en:"Please enter that one through the west entrance. This is reception for the morning event.",intent:"Contrast the correct route with the current desk."},
  {speaker:"来場者",ja:"西の入り口ですね。もう一度場所を教えていただけますか。",en:"The west entrance, right? Could you show me where it is again?",intent:"Confirm and politely request actionable directions."}
 ],
 reading:{title:"交流会の参加案内",ja:"午前の部：九時から正午まで、東入り口で受付。午後の部：十八時から二十時まで、西入り口で受付。会場名は同じですが、受付場所は時間帯によって違います。",en:"The morning event uses the east entrance, 09:00–12:00. The evening event uses the west entrance, 18:00–20:00. The event name is identical, but the entrance depends on the session."},
 vocabulary:[
  {expression:"午前の部／午後の部",meaning:"morning/afternoon session",contrast:"部 denotes a session here, not a building floor"},
  {expression:"西の入り口",meaning:"west entrance",contrast:"西 (west) is a direction; it is not the same as 右 (right)"},
  {expression:"受付場所",meaning:"check-in point",contrast:"The meeting venue name does not uniquely determine its reception desk"}
 ],
 grammar:{pattern:"午前の会ですか。それとも午後の会ですか。",function:"Present alternatives before giving directions.",mistake:"A familiar event name alone does not identify the intended session."},
 listening:{question:"午後六時から参加する人は、どの入り口を使いますか。",answer:"西の入り口",wrong:["東の入り口","午前の受付"],wrongWhy:["The east entrance is for the morning session.","The person explicitly names the evening session."]},
 readingQuestion:{question:"午前の受付は何時からですか。",answer:"九時",wrong:["十八時","十二時"],wrongWhy:["18:00 is the evening session's beginning.","Noon is the end of the morning event, not its start."]},
 pragmaticDecision:"Ask which session the visitor is attending before giving directions; repeat the location to check understanding.",
 writingAudience:"A guest who only knows the event name",
 writingRevision:[["Session","Have you clarified which session the guest needs?","State the time and morning/evening distinction."],["Directions","Did you name an entrance rather than just 'the building'?","Use 東／西の入り口 accurately."],["Confirmation","Can the guest repeat one unambiguous next action?","End with a confirmation question."]],
 spokenChallenge:"Role-play the helper. Ask whether the visitor wants the morning or evening meeting, then confirm the correct entrance."},
 {caseId:"origin-family-and-plans",goal:"Avoid confusing a temporary stay with where someone lives",
 setting:"Two classmates coordinate a visit while one person is staying with relatives for only one weekend.",
 turns:[
  {speaker:"ミナ",ja:"今週末も大阪の家から来ますか。",en:"Will you come from your Osaka home again this weekend?",intent:"Assume the usual starting location."},
  {speaker:"レナ",ja:"いいえ。土曜日は神戸の親せきの家に泊まります。住んでいるのは大阪です。",en:"No. I'll stay at relatives' home in Kobe on Saturday. I live in Osaka.",intent:"Separate temporary stay from residence."},
  {speaker:"ミナ",ja:"それなら、日曜日は神戸駅で会いませんか。",en:"Then shall we meet at Kobe Station on Sunday?",intent:"Offer a better starting point."},
  {speaker:"レナ",ja:"午後なら大丈夫ですが、午前中は親せきと食事をします。",en:"Afternoon works, but I'll eat with my relatives in the morning.",intent:"State a concrete time restriction."},
  {speaker:"ミナ",ja:"二時に中央口で会いましょう。",en:"Let's meet at the central entrance at two.",intent:"Confirm time and specific meeting point."}
 ],
 reading:{title:"日曜日の集合メモ",ja:"レナの住所は大阪です。土曜日は神戸に一泊しますが、引っ越しではありません。日曜日の午前は家族の予定があり、午後二時に神戸駅中央口でミナと会います。",en:"Rena's home address is Osaka. She stays one night in Kobe but has not moved. Sunday morning is reserved for family; she meets Mina at Kobe Station's central entrance at two."},
 vocabulary:[
 {expression:"一泊します",meaning:"stays one night",contrast:"Does not indicate a permanent address"},
 {expression:"親せき",meaning:"relative",contrast:"Not automatically someone you live with"},
 {expression:"引っ越し",meaning:"moving residence",contrast:"Different from a weekend visit"}
 ],
 grammar:{pattern:"神戸に泊まりますが、住んでいるのは大阪です。",function:"Contrast a temporary destination with current residence.",mistake:"Do not turn one night's stay into a claim that someone has moved."},
 listening:{question:"レナさんが今住んでいるのはどこですか。",answer:"大阪",wrong:["神戸","京都"],wrongWhy:["Kobe is the one-night stay.","Kyoto is not mentioned."]},
 readingQuestion:{question:"日曜日の午前、レナさんは何をしますか。",answer:"家族との予定",wrong:["ミナさんに会う","引っ越しをする"],wrongWhy:["Mina's meeting begins at two in the afternoon.","The memo explicitly says this is not a move."]},
 pragmaticDecision:"Confirm where to meet on the actual day, not merely where someone normally lives.",
 writingAudience:"A friend joining the visit who has your old address",
 writingRevision:[["Residence","Did you distinguish home from the temporary stay?","Contrast 大阪に住んでいます and 神戸に泊まります."],["Constraint","Did you explain why morning is unavailable?","Mention the family meal."],["Location","Did you give an actionable station entrance?","Name 中央口 and the meeting time."]],
 spokenChallenge:"Tell a friend where you live, where you are staying temporarily, and why you propose a different meeting point."},
 {caseId:"cafe-and-shopping",goal:"Correct a changed shopping order before paying",
 setting:"A customer changed from two notebooks to three, but the price displayed is still based on the older quantity.",
 turns:[
 {speaker:"客",ja:"ノートを二冊お願いします。",en:"Two notebooks, please.",intent:"Place the original order."},
 {speaker:"客",ja:"すみません、やっぱり三冊にしてください。",en:"Sorry, make that three after all.",intent:"Explicitly revise the quantity before payment."},
 {speaker:"店員",ja:"一冊百五十円なので、三冊で四百五十円です。",en:"They're ¥150 each, so three are ¥450.",intent:"Calculate based on the revised order."},
 {speaker:"客",ja:"画面にはまだ三百円と出ています。変更を確認していただけますか。",en:"The screen still says ¥300. Could you verify the change?",intent:"Identify the concrete mismatch."},
 {speaker:"店員",ja:"失礼しました。表示を直しました。四百五十円です。",en:"Sorry, I've corrected the display. It's ¥450.",intent:"Confirm the corrected total."}
 ],
 reading:{title:"注文の変更メモ",ja:"ノート一冊は百五十円です。最初の注文は二冊で三百円でした。支払い前に三冊へ変更したため、正しい合計は四百五十円になりました。領収書の数量と合計をご確認ください。",en:"One notebook costs ¥150. Two were ¥300; the customer changed the order to three before paying, so the correct total is ¥450. Check both quantity and total on the receipt."},
 vocabulary:[
 {expression:"やっぱり",meaning:"after all / on second thought",contrast:"Signals changed intention, not a new item category"},
 {expression:"一冊／三冊",meaning:"one/three bound volumes",contrast:"冊 is appropriate for notebooks; not the generic つ counter"},
 {expression:"表示",meaning:"on-screen display",contrast:"A shown total can lag behind the latest order"}
 ],
 grammar:{pattern:"三冊にしてください。",function:"Request a change to the final quantity.",mistake:"The new final total must follow the latest order, not the first request."},
 listening:{question:"最後に何冊買いますか。",answer:"三冊",wrong:["二冊","四冊"],wrongWhy:["Two was the original order, explicitly changed.","Four was never requested."]},
 readingQuestion:{question:"正しい合計はいくらですか。",answer:"四百五十円",wrong:["三百円","百五十円"],wrongWhy:["¥300 belongs to the old two-notebook order.","¥150 is the unit price, not the three-item total."]},
 pragmaticDecision:"Politely verify quantity and total before paying; do not assume a mismatch is deliberate.",
 writingAudience:"Shop assistant who did not hear the first change",
 writingRevision:[["Final count","Which quantity is final, not merely first mentioned?","Mention 三冊 explicitly."],["Total","Does your total match item price times the final count?","Contrast 三百円 and 四百五十円."],["Request","Are you asking staff to verify the displayed total?","Use 確認していただけますか."]],
 spokenChallenge:"Change your order from two to three items and verify the receipt without accusing the shop worker."},
 {caseId:"meeting-replan",goal:"Recognize provisional plans and wait for confirmation",
 setting:"A club changes rooms, but the substitute room has not yet been approved.",
 turns:[
 {speaker:"主催者",ja:"土曜日の集まりはいつもの教室が使えません。",en:"We can't use the usual classroom on Saturday.",intent:"Announce an actual constraint."},
 {speaker:"アリ",ja:"図書室はどうですか。",en:"How about the library room?",intent:"Suggest an alternative."},
 {speaker:"主催者",ja:"今、予約できるか聞いています。まだ決まっていません。",en:"I'm checking whether we can book it. It's not decided yet.",intent:"Keep the alternative explicitly provisional."},
 {speaker:"ミナ",ja:"分かりました。確定したら全員に教えてください。",en:"Understood. Please inform everybody once confirmed.",intent:"Request a follow-up rather than assume booking."},
 {speaker:"主催者",ja:"午後五時までに結果を送ります。",en:"I'll send the result by five.",intent:"Promise an update deadline, not automatic approval."}
 ],
 reading:{title:"会場変更のお知らせ",ja:"土曜日の集まりは元の教室が使用できません。図書室への変更を検討中ですが、予約は未確定です。本日の十七時までに会場の決定を連絡します。今は図書室に直接行かないでください。",en:"Saturday's original classroom is unavailable. The library room is being considered but not reserved yet. The venue decision will be sent by 17:00. Do not go straight to the library now."},
 vocabulary:[
 {expression:"検討中",meaning:"under consideration",contrast:"Not an approved replacement"},
 {expression:"未確定",meaning:"not confirmed",contrast:"A proposed venue is not a reservation"},
 {expression:"結果を送ります",meaning:"will send the result",contrast:"An update deadline is not a guaranteed venue"}
 ],
 grammar:{pattern:"確定したら連絡します。",function:"Put the communication after confirmation.",mistake:"Do not announce a merely suggested room as definite."},
 listening:{question:"図書室はもう予約できましたか。",answer:"まだ決まっていません",wrong:["はい、確定しました","図書室は閉館しています"],wrongWhy:["The organizer is still asking about booking.","The library's opening status was not specified."]},
 readingQuestion:{question:"今、参加者がしないほうがよいことは？",answer:"図書室に直接行くこと",wrong:["結果の連絡を待つこと","主催者から連絡を読むこと"],wrongWhy:["Waiting for confirmation is appropriate.","Reading the organizer's message is expected, not prohibited."]},
 pragmaticDecision:"Keep group logistics provisional until the organizer has an actual accepted reservation.",
 writingAudience:"Club member who missed the change announcement",
 writingRevision:[["Facts","Did you say the original room is unavailable?","Do not imply the old location still works."],["Uncertainty","Is the new room clearly marked tentative?","Use 検討中 or まだ決まっていません."],["Next step","Did you give the update deadline and say to wait?","Include 午後五時まで and a clear follow-up."]],
 spokenChallenge:"Explain a possible room change without falsely telling everyone the substitute is confirmed."},
 {caseId:"order-and-allergy",goal:"Ask precise food questions without assuming cross-contact safety",
 setting:"A cafeteria announces a new sauce; the recipe answer and the equipment answer come from different staff members.",
 turns:[
 {speaker:"客",ja:"新しいソースに乳製品は入っていますか。",en:"Does the new sauce contain dairy?",intent:"Ask specifically about the recipe."},
 {speaker:"店員",ja:"材料には使っていません。",en:"We don't use dairy as an ingredient.",intent:"Report the ingredient fact only."},
 {speaker:"客",ja:"同じ器具で乳製品を使う料理も作りますか。",en:"Are dairy dishes also prepared with the same utensils?",intent:"Ask separately about cross-contact."},
 {speaker:"店員",ja:"そこは調理スタッフに確認する必要があります。",en:"We need to check that with the kitchen staff.",intent:"State the limit of current knowledge."},
 {speaker:"客",ja:"では、確認ができるまで注文を待ちます。",en:"Then I'll wait to order until it has been checked.",intent:"Avoid a decision based on incomplete information."}
 ],
 reading:{title:"食品表示の確認",ja:"新しいソースの材料として乳製品は使っていません。しかし、同じ調理器具を使っているかどうかは未確認です。食物アレルギーのある方は、注文前に調理スタッフへの確認をお願いします。材料表示のみで安全を保証しません。",en:"The sauce does not list dairy ingredients. Utensil sharing hasn't been verified. Guests with allergies should ask kitchen staff before ordering. The ingredient label alone is not a safety guarantee."},
 vocabulary:[
 {expression:"器具",meaning:"utensils/equipment",contrast:"Not equivalent to an ingredient list"},
 {expression:"必要があります",meaning:"it is necessary",contrast:"Signals a remaining step, not confirmation"},
 {expression:"〜まで待ちます",meaning:"wait until something happens",contrast:"Decision is deferred pending verification"}
 ],
 grammar:{pattern:"確認ができるまで注文を待ちます。",function:"Express a safety-critical sequence without overstating evidence.",mistake:"Ingredient absence does not prove preparation safety."},
 listening:{question:"調理スタッフに何を確認しますか。",answer:"調理器具の使い方",wrong:["ソースの名前","材料として乳製品を使うか"],wrongWhy:["The name isn't the unresolved issue.","The staff already answered the recipe question; utensil use is unknown."]},
 readingQuestion:{question:"材料の情報だけで安全が保証されますか。",answer:"いいえ",wrong:["はい","注文前の確認は必要ありません"],wrongWhy:["The notice explicitly disclaims a safety guarantee.","The notice asks for preparation verification before ordering."]},
 pragmaticDecision:"Ask both recipe and utensil questions; do not treat language-study answers as medical safety advice.",
 writingAudience:"Kitchen worker who has not seen the ingredient notice",
 writingRevision:[["Ingredient","Is your restricted ingredient clear?","Name the specific ingredient being checked."],["Preparation","Do you ask about utensils separately?","Mention 同じ器具."],["Decision","Did you avoid an unsupported safety guarantee?","Ask for a staff reply before deciding."]],
 spokenChallenge:"Ask a kitchen worker about both ingredients and shared utensils, then clearly wait for their confirmation."},
 {caseId:"service-delay",goal:"Correct a billing issue separately from a room request",
 setting:"A hotel fixes an incorrect total, but still needs to verify the guest's requested room type.",
 turns:[
 {speaker:"客",ja:"メールの料金は一万二千円ですが、画面は一万五千円になっています。",en:"My email says ¥12,000, but the screen shows ¥15,000.",intent:"Present documentary evidence of a specific discrepancy."},
 {speaker:"受付",ja:"失礼しました。料金を一万二千円に修正しました。",en:"Sorry. I've corrected the price to ¥12,000.",intent:"Confirm one resolved issue."},
 {speaker:"客",ja:"ありがとうございます。禁煙室の希望についてはいかがですか。",en:"Thank you. What about my nonsmoking room request?",intent:"Keep a separate open question visible."},
 {speaker:"受付",ja:"そちらは確認中です。決まり次第お知らせします。",en:"We're still checking. We'll let you know once decided.",intent:"Avoid promising an unconfirmed room."},
 {speaker:"客",ja:"では、お部屋が確定したらメールをお願いします。",en:"Then please email me once the room is confirmed.",intent:"Request a concrete follow-up."}
 ],
 reading:{title:"予約情報の変更履歴",ja:"支払予定額：一万二千円（修正済み）。最初の表示額：一万五千円。禁煙室の希望：確認中。禁煙室の割当てについては、決定後にメールでお知らせします。料金の修正は部屋の変更確定を意味しません。",en:"Final intended price corrected to ¥12,000, previously displayed as ¥15,000. Nonsmoking request still pending. Room assignment will be emailed after decision. Price correction is not room confirmation."},
 vocabulary:[
 {expression:"修正済み",meaning:"already corrected",contrast:"Only the specified item is resolved"},
 {expression:"希望",meaning:"preference/request",contrast:"Not necessarily a confirmed booking term"},
 {expression:"割当て",meaning:"assignment",contrast:"Only the actual room assignment could confirm that part"}
 ],
 grammar:{pattern:"決まり次第お知らせします。",function:"Promise notice after an outcome is decided.",mistake:"Do not equate a corrected bill with a confirmed room request."},
 listening:{question:"すでに修正したのは何ですか。",answer:"料金",wrong:["禁煙室","到着時刻"],wrongWhy:["The room type is still being checked.","An arrival time is not discussed."]},
 readingQuestion:{question:"まだ確認中なのは何ですか。",answer:"禁煙室の希望",wrong:["料金","一万二千円の金額"],wrongWhy:["The price discrepancy has already been corrected.","¥12,000 is the corrected confirmed amount, not the unresolved item."]},
 pragmaticDecision:"Thank staff for the correction, then state the separate unresolved request and ask for a follow-up.",
 writingAudience:"Hotel worker taking over from the previous receptionist",
 writingRevision:[["Corrected fact","Did you state the new correct price?","Contrast 一万五千円 and 一万二千円."],["Open issue","Did you preserve the uncertainty of the room request?","Use 確認中."],["Follow-up","Did you say what notification you need?","Ask for an email once the room type is confirmed."]],
 spokenChallenge:"Role-play two consecutive hotel requests, thanking staff for a completed price correction before asking about the still-pending room."},
 {caseId:"transport-volunteer",goal:"Acknowledge partial cover without inventing a complete handover",
 setting:"A volunteer coordinator confirms a substitute for the first half-hour, but not the remaining gap.",
 turns:[
 {speaker:"責任者",ja:"三時から三時半まではミナさんが受付を代わってくれます。",en:"Mina will cover reception from three to three-thirty.",intent:"Confirm a limited time interval."},
 {speaker:"ユナ",ja:"ありがとうございます。三時半から四時まではどうしますか。",en:"Thank you. What about three-thirty to four?",intent:"Identify the remaining uncovered period."},
 {speaker:"責任者",ja:"その時間はまだ担当者を探しています。",en:"We're still looking for someone for that time.",intent:"State what has not been solved."},
 {speaker:"ユナ",ja:"私は四時ごろ着く予定ですが、遅れるかもしれません。",en:"I expect to arrive around four but may be late.",intent:"Give an estimate, not a promise."},
 {speaker:"責任者",ja:"では、別の人が決まるまで受付を無人にしないようにします。",en:"Then we'll make sure reception isn't unattended until someone else is confirmed.",intent:"Maintain the responsible handover constraint."}
 ],
 reading:{title:"受付の時間別確認表",ja:"十五時〜十五時半：ミナが担当（確定）。十五時半〜十六時：担当者未決定。ユナの到着予想：十六時ごろ（未確定）。責任者は空白の時間に対応できる人を確認中です。",en:"15:00–15:30 Mina confirmed. 15:30–16:00 unfilled. Yuna expects to arrive around 16:00 but this is not guaranteed. Coordinator is seeking cover."},
 vocabulary:[
 {expression:"時間別",meaning:"by time interval",contrast:"One covered interval does not imply full-shift coverage"},
 {expression:"未決定",meaning:"undecided",contrast:"Not the same as an explicit refusal"},
 {expression:"空白の時間",meaning:"uncovered time gap",contrast:"A real operational problem, not a stylistic detail"}
 ],
 grammar:{pattern:"三時半から四時までは未決定です。",function:"Specify an unresolved interval with から and まで.",mistake:"Do not generalize Mina's 30-minute coverage to the entire hour."},
 listening:{question:"ミナさんが確実に担当するのはいつですか。",answer:"三時から三時半",wrong:["三時半から四時","三時から四時まで"],wrongWhy:["The later half-hour has no confirmed person.","Mina's confirmed coverage is 30 minutes, not the full hour."]},
 readingQuestion:{question:"まだ担当者が決まっていないのはいつですか。",answer:"十五時半から十六時",wrong:["十五時から十五時半","十六時から十七時"],wrongWhy:["The earlier interval is confirmed for Mina.","Four to five isn't listed as the open interval."]},
 pragmaticDecision:"Report the uncovered interval and who is checking it, rather than claiming the shift is fully covered.",
 writingAudience:"A coordinator who needs an accurate shift update immediately",
 writingRevision:[["Confirmed cover","Are the confirmed minutes named?","Specify 15:00–15:30."],["Gap","Did you explicitly identify the unresolved half-hour?","Specify 15:30–16:00."],["Uncertainty","Did you avoid treating expected arrival as guaranteed?","Use 到着予定／かもしれません."]],
 spokenChallenge:"Brief a new coordinator: say which period is covered, what gap remains, and who will confirm a replacement."}
];
export const E11_BY_CASE=new Map(E11_TRANSFER.map(v=>[v.caseId,v] as const));

/** Seven original later messages keyed ONLY to existing E11 case IDs.
 * Additional reading/interpretation, never canonical course IDs, grades or FSRS.
 */
export interface E11SourceUpdate {
 readonly caseId:string;readonly ja:string;readonly en:string;
 readonly compare:string;readonly limit:string;
 readonly decision:Readonly<{question:string;answer:string;wrong:readonly [string,string];why:readonly [string,string]}>;
 readonly authority:"original-unscored-update";
}
export const E11_SOURCE_UPDATES:readonly E11SourceUpdate[]=Object.freeze([
 {caseId:"introduce-and-find-help",ja:"本日の午後の交流会は、受付を十七時半から始めます。開始時刻は十八時のままで、受付は西入り口です。",en:"The evening session now opens reception at 17:30, but the event still starts at 18:00 through the west entrance.",compare:"Separate the new reception time from the unchanged event start and entrance.",limit:"An earlier check-in does not change the session start time.",decision:{question:"午後の交流会で、新しい連絡から確実に変わったことは何ですか。",answer:"受付は十七時半からです。",wrong:["交流会の開始は十七時半です。","受付は東入り口に移りました。"] as const,why:["The check-in time changed; the event still begins at 18:00.","The evening entrance remains the west entrance."] as const},decision:{question:"レナさんの追加メッセージで、変わらないことは何ですか。",answer:"待ち合わせ場所は神戸駅の中央口です。",wrong:["レナさんは神戸に引っ越しました。","必ず十分遅れます。"] as const,why:["The message concerns an expected delay, not a change of residence.","遅れそう is an expectation; it does not guarantee a precise new arrival time."] as const},decision:{question:"新しいお知らせから分かる正しいことは何ですか。",answer:"ノート三冊は四百五十円で、ペンは別会計です。",wrong:["ノート三冊とペンで四百五十円です。","ノートは二冊に戻りました。"] as const,why:["The separately charged pen is not included in the notebook subtotal.","The final quantity is still three, not the initial two."] as const},decision:{question:"追加連絡の後、確定していることは何ですか。",answer:"会場の決定は十七時半までに連絡されます。",wrong:["図書室の予約は承認されました。","十七時に図書室に集まります。"] as const,why:["The possible library room remains unapproved.","The earlier 17:00 update was postponed, not confirmed as a meeting."] as const},decision:{question:"調理スタッフの追加回答について、正しい理解は何ですか。",answer:"乳製品は材料に使いませんが、器具は共用しています。",wrong:["調理器具はほかの料理と共用していません。","このソースは全員に安全だと確認されました。"] as const,why:["The additional reply explicitly confirms shared utensils.","No safety guarantee can be drawn from the source, even with the ingredient report."] as const},decision:{question:"ホテルの追加連絡で、まだ確認中なのは何ですか。",answer:"禁煙室の割り当てです。",wrong:["一万二千円への料金修正です。","一万五千円の請求が正しいかどうかです。"] as const,why:["The price was already corrected, so that issue is resolved.","The former screen amount is not the confirmed final rate."] as const},decision:{question:"新しい受付表で、まだ担当者が決まっていない時間はいつですか。",answer:"十五時四十五分から十六時までです。",wrong:["十五時半から十五時四十五分までです。","十五時から十五時半までです。"] as const,why:["Ari confirmed the quarter-hour immediately before the remaining gap.","Mina's earlier coverage remains confirmed, not unassigned."] as const},authority:"original-unscored-update" as const},
 {caseId:"origin-family-and-plans",ja:"ミナさんへ。日曜日の待ち合わせに十分ほど遅れそうです。場所は神戸駅の中央口のままでお願いします。レナ",en:"Rena now expects to be about ten minutes late on Sunday; the Kobe Station central entrance has not changed.",compare:"Distinguish an expected delay from a change to someone's home or meeting location.",limit:"遅れそうです is an expectation, not a confirmed revised meeting time.",authority:"original-unscored-update" as const},
 {caseId:"cafe-and-shopping",ja:"お知らせ：ペンはノートと別会計です。ノート三冊の代金は四百五十円で、領収書の冊数も三冊に訂正しました。",en:"A pen is billed separately; the three notebooks still cost ¥450, and their receipt count has been corrected.",compare:"State what the notebook receipt confirms, and identify the separate purchase.",limit:"The pen charge does not alter the three-notebook subtotal.",authority:"original-unscored-update" as const},
 {caseId:"meeting-replan",ja:"追加連絡：図書室の利用はまだ承認されていません。会場の決定を知らせる時間は十七時半に変更しました。それまでは集合場所を確定しないでください。",en:"The library room remains unapproved; the venue update deadline moves to 17:30, with no confirmed room yet.",compare:"Distinguish the changed notification deadline from the unapproved replacement room.",limit:"A revised notification time is not a confirmed room reservation.",authority:"original-unscored-update" as const},
 {caseId:"order-and-allergy",ja:"調理スタッフからの追加回答：新しいソースには乳製品を材料として使っていませんが、調理器具はほかの料理と共用しています。安全性を保証するものではありません。",en:"Staff confirm shared utensils despite no dairy ingredient in the sauce; they do not guarantee safety.",compare:"Separate the ingredient report from the new shared-equipment information.",limit:"Language-learning examples cannot establish the safety of a food for an allergic person.",authority:"original-unscored-update" as const},
 {caseId:"service-delay",ja:"追加のご案内：料金は一万二千円に修正済みですが、禁煙室の割り当てはまだ確認できていません。決定後、メールでお知らせします。",en:"The corrected price remains ¥12,000 but the nonsmoking-room assignment is still unconfirmed; an email will follow.",compare:"Identify the resolved price separately from the unresolved room request.",limit:"An updated bill is not evidence that a particular room has been assigned.",authority:"original-unscored-update" as const},
 {caseId:"transport-volunteer",ja:"新しい連絡：十五時半から十五時四十五分まではアリさんが受付を担当できます。十五時四十五分から十六時までは、まだ担当者が決まっていません。",en:"Ari covers 15:30–15:45, while 15:45–16:00 remains without a confirmed volunteer.",compare:"Revise the original staffing gap with the newly covered interval and remaining gap.",limit:"A partial handover is not evidence that the entire shift is covered.",authority:"original-unscored-update" as const}
].map(item=>Object.freeze(item)));
const E11_UPDATES_BY_CASE=new Map(E11_SOURCE_UPDATES.map(item=>[item.caseId,item] as const));
export function e11SourceUpdate(caseId:string):E11SourceUpdate|null{
 return E11_UPDATES_BY_CASE.get(caseId)??null;
}
