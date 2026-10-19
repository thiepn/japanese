/**
 * Second/third-attempt variants for E05 targeted repair.
 * Different original facts; never the original question restated.
 * Only used for the already-verified canonical source target.
 */
export interface E07RepairVariant {
 cohort:"e01"|"e02"|"e03"|"e04";scene:string;
 situation:string;contrast:string;question:string;correct:string;
 foils:readonly [string,string];feedback:string;
}
export const E07_REPAIR_VARIANTS:readonly E07RepairVariant[]=[
 {cohort:"e02",scene:"greetings",situation:"A guest arrives at a reception at 7 p.m.",contrast:"Time of day controls the greeting, not how familiar the visitor is.",
 question:"夜七時です。受付の人：こんばんは。　あなた：＿＿＿",correct:"こんばんは。",foils:["おはようございます。","いただきます。"],feedback:"The guest arrives in the evening. The morning greeting is not appropriate."},
 {cohort:"e02",scene:"personal",situation:"At a language class, two learners exchange personal names.",contrast:"A name is stated with です, not with the direct-object particle を.",
 question:"先生：お名前は？　学生：＿＿＿",correct:"レナです。",foils:["レナをください。","レナへ行きます。"],feedback:"レナです supplies a name. The other alternatives request an object or describe motion."},
 {cohort:"e02",scene:"origin",situation:"A classmate says she came to Osaka from Germany last month.",contrast:"から points to origin, while に marks destination.",
 question:"レナさんはドイツから大阪に来ました。どこから来ましたか。",correct:"ドイツ",foils:["大阪","駅"],feedback:"Germany is the starting point. Osaka is where she arrived."},
 {cohort:"e02",scene:"routine",situation:"A student wakes at six but eats breakfast at seven.",contrast:"起きます and 食べます describe different actions; do not take the wrong clock time.",
 question:"アリ：六時に起きて、七時に朝ご飯を食べます。いつ起きますか。",correct:"六時",foils:["七時","八時"],feedback:"The first time is waking; seven refers to breakfast."},
 {cohort:"e02",scene:"time",situation:"A club meeting starts at three and ends at four-thirty.",contrast:"から is the start. まで marks the ending.",
 question:"会議は三時から四時半までです。何時までですか。",correct:"四時半",foils:["三時","五時"],feedback:"The meeting ends at four-thirty, not its three o'clock beginning."},
 {cohort:"e02",scene:"food",situation:"A customer wants coffee rather than tea.",contrast:"をください orders an item; に行きます describes movement.",
 question:"店員：お飲み物は？　客：＿＿＿",correct:"コーヒーをください。",foils:["コーヒーに行きます。","コーヒーで住んでいます。"],feedback:"This is an item request to service staff, not movement or residence."},
 {cohort:"e02",scene:"shopping",situation:"A shopper asks the price of a scarf; staff says 1,800 yen.",contrast:"Distinguish the price of an item from the quantity in stock.",
 question:"客：このマフラーはいくらですか。店員：千八百円です。いくらですか。",correct:"千八百円",foils:["八百円","二千八百円"],feedback:"千八百円 is 1,800 yen. Do not drop or add one thousand."},
 {cohort:"e02",scene:"transport",situation:"A traveler goes to Kyoto by bus.",contrast:"で identifies means of travel; に identifies a destination.",
 question:"レナ：バスで京都に行きます。何で行きますか。",correct:"バス",foils:["京都","電車"],feedback:"バス is the means. 京都 is the destination."},
 {cohort:"e02",scene:"past",situation:"Someone visited a museum yesterday and is talking about it now.",contrast:"昨日 triggers polite past 行きました, not present 行きます.",
 question:"友達：昨日、美術館に行きましたか。　あなた：＿＿＿（affirmative）",correct:"はい、行きました。",foils:["はい、行きます。","いいえ、行きません。"],feedback:"Affirmative past fits the completed yesterday visit."},
 {cohort:"e02",scene:"help",situation:"The bus driver spoke too quickly to hear the stop name.",contrast:"Request repetition instead of pretending to know the destination.",
 question:"運転手の話が聞き取れませんでした。何を言いますか。",correct:"すみません、もう一度お願いします。",foils:["分かりました。","昨日は晴れでした。"],feedback:"A repetition request repairs the missed destination. Agreement would falsely imply understanding."},
 {cohort:"e03",scene:"weekend-invitation",situation:"Two friends make a plan conditional on heavy rain.",contrast:"The alternative after 雨だったら is used only if that condition happens.",
 question:"晴れなら海へ行きます。雨だったら図書館に行きます。今日は雨です。どこへ行きますか。",correct:"図書館",foils:["海","映画館"],feedback:"The rainy-weather destination is the library, not the fair-weather beach."},
 {cohort:"e03",scene:"restaurant-adjustment",situation:"A guest cannot eat milk and chooses a tofu dish instead of cheese pasta.",contrast:"〜にします selects a dish; a preparation request does not change the chosen item automatically.",
 question:"店員：チーズパスタか豆腐の料理があります。客：牛乳が苦手なので豆腐にします。何を選びますか。",correct:"豆腐の料理",foils:["チーズパスタ","両方"],feedback:"The customer chooses tofu, not the dairy-based pasta."},
 {cohort:"e03",scene:"moving-around-town",situation:"A walker must turn at the first crossing rather than the third.",contrast:"Count the landmark and read 右/左 independently.",
 question:"一つ目の交差点を右に曲がってください。どこで曲がりますか。",correct:"一つ目の交差点",foils:["三つ目の交差点","二つ目の信号"],feedback:"一つ目の交差点 is the first intersection; don't transfer the original landmark."},
 {cohort:"e03",scene:"health-and-scheduling",situation:"A friend feels sick Wednesday but can work on Friday.",contrast:"〜なら marks the workable day and should not be confused with the refused one.",
 question:"水曜日は熱があるので休みますが、金曜日なら行けます。いつ行けますか。",correct:"金曜日",foils:["水曜日","火曜日"],feedback:"The speaker cannot go Wednesday; Friday is the alternative."},
 {cohort:"e03",scene:"weather-and-plans",situation:"The forecast expresses a chance of wind tomorrow.",contrast:"かもしれません communicates possibility, not certainty.",
 question:"明日は風が強くなるかもしれません。正しい説明は？",correct:"強い風になる可能性があります。",foils:["必ず強い風になります。","風は絶対にありません。"],feedback:"The outcome is uncertain. Neither certainty nor impossibility is supported."},
 {cohort:"e03",scene:"community-event",situation:"The room has been booked but guest name tags have not been printed.",contrast:"まだ〜ていません identifies unfinished work, not completed preparation.",
 question:"会場は予約しましたが、名札はまだ作っていません。何が残っていますか。",correct:"名札を作ること",foils:["会場を予約すること","参加者に帰ってもらうこと"],feedback:"Room booking is completed. Name tags remain to be made."},
 {cohort:"e04",scene:"train-disruption",situation:"A visitor may miss an appointment because the bus might be late.",contrast:"Possible lateness should trigger responsible advance communication, not a promise.",
 question:"バスが渋滞で遅れそうです。予約先へ何をしますか。",correct:"遅れる可能性を先に伝えます。",foils:["必ず間に合うと言います。","連絡せずに待ちます。"],feedback:"Notify the destination about possible delay. Certainty is unsupported."},
 {cohort:"e04",scene:"hotel-reservation",situation:"A booking email confirms breakfast but reception says otherwise.",contrast:"Show original evidence and ask staff to verify, instead of silently accepting a mistake.",
 question:"受付：朝食なしと書いてあります。メールには『朝食付き』です。どうしますか。",correct:"メールを見せて確認をお願いします。",foils:["何も言わずに帰ります。","証拠がないと言います。"],feedback:"The email is relevant evidence and justifies a polite request to check."},
 {cohort:"e04",scene:"store-return",situation:"Replacement shoes are sold out, and the customer has proof of purchase.",contrast:"Request a discussion of available remedies; do not invent a guaranteed refund.",
 question:"交換できる靴の在庫がありません。レシートがあります。適切なお願いは？",correct:"返金について相談したいです。",foils:["必ず現金を今すぐください。","買ったことを忘れました。"],feedback:"Discussion is appropriate when availability and store policy are not yet confirmed."},
 {cohort:"e04",scene:"course-comparison",situation:"A learner cannot attend a cheap morning course, but can attend a more expensive evening course.",contrast:"Compare the real constraint, not only the numeric price.",
 question:"安い講座は仕事中です。夜の講座なら行けます。どちらがいいですか。",correct:"夜の講座",foils:["安い朝の講座","どちらも行けません"],feedback:"The evening option fits the learner's available time."},
 {cohort:"e04",scene:"community-noise",situation:"A neighbor needs to ask for reduced noise during early morning hours.",contrast:"A bounded, respectful request works better than an unqualified accusation.",
 question:"朝六時の大きな音が気になります。どの言い方がいいですか。",correct:"朝七時までは音を小さくしていただけませんか。",foils:["今すぐ全部やめろ。","どんな音でも大好きです。"],feedback:"The request specifies a reasonable time window and avoids a confrontational command."},
 {cohort:"e04",scene:"club-project",situation:"A team wants to publish a flyer containing an image with unconfirmed rights.",contrast:"Copyright permission must precede publication; an unfinished check is not approval.",
 question:"写真の使用許可がまだ不明です。いつ公開できますか。",correct:"確認して許可を得てから",foils:["確認する前に","関係ありません"],feedback:"Publication must wait until permission has been verified."},
 {cohort:"e02",scene:"origin",situation:"A new employee moved to Fukuoka from Canada.",contrast:"Place + から describes where the person came from; に can identify Fukuoka as the new destination.",
 question:"ケンはカナダから福岡に来ました。出身地はどこですか。",correct:"カナダ",foils:["福岡","東京"],feedback:"Canada is the point of origin, while Fukuoka is where Ken arrived."},
 {cohort:"e02",scene:"time",situation:"A class runs from ten in the morning until noon.",contrast:"The clock time after まで is the end, not the beginning.",
 question:"授業は午前十時から正午までです。終わるのはいつですか。",correct:"正午",foils:["午前十時","午後十時"],feedback:"正午 means noon. The start at ten is not the finishing time."},
 {cohort:"e02",scene:"food",situation:"At a stall, a customer asks for one bottle of water.",contrast:"The particle を marks the requested item.",
 question:"店員：何を買いますか。　客：＿＿＿",correct:"水を一本ください。",foils:["水で学校にいます。","水から来ました。"],feedback:"水を一本ください asks for one bottle of water rather than talking about location or origin."},
 {cohort:"e03",scene:"weekend-invitation",situation:"Friends planned a park outing, but a strong wind makes an indoor activity preferable.",contrast:"The contingency, not the default plan, applies under the stated weather condition.",
 question:"風が強かったら博物館に行きます。風が強いです。どこに行きますか。",correct:"博物館",foils:["公園","プール"],feedback:"The strong-wind condition activates the museum plan."},
 {cohort:"e03",scene:"restaurant-adjustment",situation:"A diner chooses a salad instead of a sandwich that contains egg.",contrast:"The final 〜にします phrase communicates the choice, not the unavailable or refused dish.",
 question:"サンドイッチには卵が入っています。客：じゃあ、サラダにします。何を選びましたか。",correct:"サラダ",foils:["サンドイッチ","卵"],feedback:"The customer explicitly chooses salad after hearing about egg in the sandwich."},
 {cohort:"e03",scene:"weather-and-plans",situation:"A traveler hears that afternoon trains may be delayed.",contrast:"〜かもしれません reports a risk; it does not confirm that the delay has already occurred.",
 question:"午後の電車は遅れるかもしれません。正しい説明は？",correct:"遅れる可能性があります。",foils:["すでに全部遅れています。","必ず早く着きます。"],feedback:"The sentence reports possibility, not confirmed delay or guaranteed early arrival."},
 {cohort:"e04",scene:"hotel-reservation",situation:"The booking says two nights but a clerk's system shows one.",contrast:"A polite correction cites the reservation email, rather than guessing what the hotel will offer.",
 question:"受付：一泊の予約ですね。メール：『二泊』。何と言いますか。",correct:"メールでは二泊です。確認していただけますか。",foils:["はい、一泊でいいです。","今すぐ必ず返金してください。"],feedback:"The email supports the two-night booking. Ask for verification before assuming a remedy."},
 {cohort:"e04",scene:"store-return",situation:"A newly purchased device fails; the customer wants to ask about repair instead of demanding money immediately.",contrast:"〜について相談したい expresses a request to discuss an option, not a guaranteed entitlement.",
 question:"買った機器が動きません。修理できるか聞きたいです。どう言いますか。",correct:"修理について相談したいです。",foils:["必ず無料でもう一台ください。","昨日、修理しました。"],feedback:"The customer requests a repair discussion; the alternatives assert an unsupported demand or past repair."},
];
export function selectE07RepairVariant(cohort:E07RepairVariant["cohort"],scene:string,failedRepairs:number):E07RepairVariant|undefined{
 if(failedRepairs<1)return undefined;
 const matches=E07_REPAIR_VARIANTS.filter(v=>v.cohort===cohort&&v.scene===scene);
 return matches.length?matches[(failedRepairs-1)%matches.length]:undefined;
}
