// E02 original teaching. The source books inform thematic progression only.
// These scenes are not replicas, translations, or exports of Marugoto lessons.
export interface E02Scene {
  id:string; title:string; unitId:string; setting:string;
  dialogue:readonly {ja:string;en:string}[];
  notice:string; grammarIds:readonly string[];
  listening:{answer:string;foils:readonly [string,string];feedback:string};
  reading:{prompt:string;answer:string;foils:readonly [string,string];feedback:string};
  reply:{prompt:string;answer:string;foils:readonly [string,string];feedback:string};
  recall:{prompt:string;answers:readonly string[];feedback:string};
  transfer:{audio:string;meaning:string;meaningFoils:readonly [string,string];prompt:string;answer:string;foils:readonly [string,string];feedback:string};
  writingTask:string;speakingTask:string; writingTargets:readonly string[];speakingTargets:readonly string[];
}
export const E02_SCENES:readonly E02Scene[]=[
{
 id:"greetings",title:"Greet someone appropriately",unitId:"a1-unit-01",setting:"You arrive for a morning lesson and meet your teacher.",
 dialogue:[{ja:"先生：おはようございます。",en:"Teacher: Good morning."},{ja:"ミナ：おはようございます。今日もよろしくお願いします。",en:"Mina: Good morning. I look forward to working with you today."}],
 notice:"おはようございます is a polite morning greeting; こんにちは is normally for daytime, こんばんは for evening. よろしくお願いします expresses goodwill or cooperation, not a literal promise.",
 grammarIds:["grammar-desu","grammar-ne"],
 listening:{answer:"A polite morning greeting",foils:["An evening farewell","A request for water"],feedback:"おはようございます is a greeting used in the morning. It does not mean good night."},
 reading:{prompt:"先生はいつミナに会いましたか。",answer:"朝",foils:["夜","来週"],feedback:"おはようございます identifies the greeting as morning. 夜 is night; 来週 is next week."},
 reply:{prompt:"先生：おはようございます。　ミナ：＿＿＿",answer:"おはようございます。",foils:["おやすみなさい。","さようなら。"],feedback:"Reply to a polite morning greeting with おはようございます; おやすみなさい is a bedtime greeting."},
 recall:{prompt:"Type the polite Japanese morning greeting.",answers:["おはようございます。","おはようございます"],feedback:"Do not confuse おはようございます with こんばんは (good evening)."},
 transfer:{audio:"先生：こんばんは。今日は遅いですね。",meaning:"The teacher greets someone in the evening.",meaningFoils:["The teacher orders breakfast.","The teacher asks for a train."],prompt:"先生：こんばんは。　あなた：＿＿＿",answer:"こんばんは。",foils:["おはようございます。","いただきます。"],feedback:"The new situation is in the evening, so こんばんは is appropriate."},
 writingTask:"Write a short first-meeting greeting and your name. Use your real name, not a copied script.",speakingTask:"Greet an adult politely and introduce yourself in two short utterances.",writingTargets:["はじめまして","です"],speakingTargets:["はじめまして","です"]
},
{
 id:"personal",title:"Ask and give a name",unitId:"a1-unit-02",setting:"At a community event, two participants exchange names.",
 dialogue:[{ja:"ケン：こんにちは。お名前は何ですか。",en:"Ken: Hello. What is your name?"},{ja:"ユナ：ユナです。あなたは？",en:"Yuna: I'm Yuna. And you?"},{ja:"ケン：ケンです。よろしくお願いします。",en:"Ken: I'm Ken. Nice to meet you."}],
 notice:"お名前 is a polite way to ask another person's name. A natural answer can be 名前 + です without repeating 私は. あなたは？ is possible here, but names are often preferable to repeating あなた in ordinary interaction.",
 grammarIds:["grammar-desu","grammar-wa-topic","grammar-ka-question"],
 listening:{answer:"They exchange names.",foils:["They discuss the train schedule.","They order coffee."],feedback:"お名前は何ですか asks the person's name, and both give their names."},
 reading:{prompt:"女の人の名前は何ですか。",answer:"ユナ",foils:["ケン","田中"],feedback:"ユナ answers the question about her name. ケン is the other speaker."},
 reply:{prompt:"ケン：お名前は何ですか。　ユナ：＿＿＿",answer:"ユナです。",foils:["ユナをください。","ユナに行きます。"],feedback:"A name followed by です is a polite answer; をください requests an item, and に行きます describes movement."},
 recall:{prompt:"Type the polite question 'What is your name?' in Japanese.",answers:["お名前は何ですか。","お名前は何ですか"],feedback:"お名前 + は + 何ですか asks the name; は is read wa."},
 transfer:{audio:"さくら：はじめまして。さくらです。お名前は？",meaning:"Sakura asks the other person's name.",meaningFoils:["Sakura asks for a menu.","Sakura asks about the weather."],prompt:"さくら：お名前は？　ケン：＿＿＿",answer:"ケンです。",foils:["ケンからです。","ケンで行きます。"],feedback:"Respond with a name plus です. This shortened question is suitable in a friendly first meeting."},
 writingTask:"Write a two-sentence introduction using your name and a polite greeting.",speakingTask:"Say your name and ask the listener for theirs, leaving room for a reply.",writingTargets:["はじめまして","です"],speakingTargets:["名前","です"]
},
{
 id:"origin",title:"Where are you from?",unitId:"a1-unit-05",setting:"Two new students tell each other where they came from.",
 dialogue:[{ja:"アリ：どこから来ましたか。",en:"Ali: Where did you come from?"},{ja:"ミナ：韓国から来ました。アリさんは？",en:"Mina: I came from Korea. And you, Ali?"},{ja:"アリ：トルコから来ました。",en:"Ali: I came from Turkey."}],
 notice:"から marks a starting point or origin. 来ました is the polite past of 来ます (to come). Don't confuse から (from) with に (destination) in this exchange.",
 grammarIds:["grammar-ka-question","grammar-masu","grammar-ni-destination"],
 listening:{answer:"Mina is from Korea; Ali is from Turkey.",foils:["Both are from Japan.","Mina is from Turkey; Ali is from Korea."],feedback:"Mina says 韓国から, and Ali says トルコから; the countries are not interchangeable."},
 reading:{prompt:"アリさんはどこから来ましたか。",answer:"トルコ",foils:["韓国","日本"],feedback:"アリ explicitly says トルコから来ました. 韓国 is Mina's origin."},
 reply:{prompt:"アリ：どこから来ましたか。　ミナ：＿＿＿",answer:"韓国から来ました。",foils:["韓国をください。","韓国にあります。"],feedback:"Origin takes から; をください requests a thing and にあります marks existence at a place."},
 recall:{prompt:"Write the model answer 'I came from Korea.'",answers:["韓国から来ました。","韓国から来ました","かんこくからきました。"],feedback:"Use place + から + 来ました for where someone came from."},
 transfer:{audio:"ジュン：日本から来ました。レナさんは？",meaning:"Jun says he came from Japan and asks Rena.",meaningFoils:["Jun is buying a Japanese book.","Jun wants to travel to Japan tomorrow."],prompt:"ジュン：どこから来ましたか。　レナ：＿＿＿",answer:"トルコから来ました。",foils:["トルコで来ました。","トルコが好きます。"],feedback:"The origin requires から. で indicates means or an action location depending on context."},
 writingTask:"Introduce yourself and mention your real place of origin in short, connected sentences.",speakingTask:"Answer where you came from and then ask the other speaker the same question.",writingTargets:["です","から"],speakingTargets:["から","来ました"]
},
{
 id:"routine",title:"Talk about a normal day",unitId:"a1-unit-03",setting:"Two classmates compare their morning routines.",
 dialogue:[{ja:"ミナ：毎朝、七時に起きます。",en:"Mina: Every morning, I get up at seven."},{ja:"ケン：私は八時に起きます。学校に行きます。",en:"Ken: I get up at eight. I go to school."}],
 notice:"に can mark a precise time such as 七時に. It can also mark a destination as in 学校に行きます. The surrounding words determine the role.",
 grammarIds:["grammar-masu","grammar-ni-destination","grammar-wa-topic"],
 listening:{answer:"Mina gets up at seven; Ken gets up at eight.",foils:["Both get up at eight.","Mina goes to bed at seven."],feedback:"起きます means get up, not go to sleep. 七時 and 八時 are different times."},
 reading:{prompt:"ケンさんは何時に起きますか。",answer:"八時",foils:["七時","九時"],feedback:"ケン says 八時に起きます. Mina's time is 七時."},
 reply:{prompt:"先生：何時に起きますか。　ミナ：＿＿＿",answer:"七時に起きます。",foils:["七時に行きます。","七時で起きます。"],feedback:"起きます means get up. に marks the specific clock time."},
 recall:{prompt:"Write the model 'I get up at seven.'",answers:["七時に起きます。","七時に起きます","7時に起きます。"],feedback:"Use time + に + 起きます. で is not the standard particle for a precise waking time."},
 transfer:{audio:"レナ：毎朝、六時に起きます。七時に学校へ行きます。",meaning:"Rena gets up at six and goes to school at seven.",meaningFoils:["Rena gets up at seven.","Rena goes to school at six."],prompt:"先生：六時に何をしますか。　レナ：＿＿＿",answer:"起きます。",foils:["買います。","寝ませんでした。"],feedback:"Six is the waking time in the new conversation, not the departure time."},
 writingTask:"Describe two things you actually do on a weekday, with appropriate times.",speakingTask:"Explain your usual wake-up time and one later activity.",writingTargets:["時","ます"],speakingTargets:["時","ます"]
},
{
 id:"family",title:"Introduce family members",unitId:"a1-unit-15",setting:"Mina shows a friend a family photograph.",
 dialogue:[{ja:"ケン：この人はだれですか。",en:"Ken: Who is this person?"},{ja:"ミナ：私の兄です。兄は大学生です。",en:"Mina: He's my older brother. My brother is a university student."},{ja:"ケン：そうですか。",en:"Ken: I see."}],
 notice:"の links nouns: 私の兄 means my older brother. 兄 is normally used for your own older brother when talking to others. そうですか can acknowledge newly learned information.",
 grammarIds:["grammar-desu","grammar-wa-topic"],
 listening:{answer:"Mina introduces her older brother.",foils:["Mina introduces a teacher.","Ken introduces his father."],feedback:"私の兄 means my older brother, not father (父) or teacher (先生)."},
 reading:{prompt:"ミナさんのお兄さんは何をしていますか。",answer:"大学生です。",foils:["先生です。","店員です。"],feedback:"Mina directly says 兄は大学生です. He is a university student."},
 reply:{prompt:"ケン：この人はだれですか。　ミナ：＿＿＿",answer:"私の兄です。",foils:["私を兄です。","兄に行きます。"],feedback:"の connects the possessor to the family member; を does not mark possession."},
 recall:{prompt:"Write 'my older brother' using 私 and 兄.",answers:["私の兄","わたしのあに"],feedback:"Possession and relations use A の B."},
 transfer:{audio:"ユナ：これは私の母です。母は先生です。",meaning:"Yuna introduces her mother, who is a teacher.",meaningFoils:["Yuna's mother is a student.","Yuna's sister is a teacher."],prompt:"友達：この人はだれですか。　ユナ：＿＿＿",answer:"私の母です。",foils:["私の兄です。","母からです。"],feedback:"母 is mother, not older brother; 私の marks whose mother."},
 writingTask:"Write two short sentences about one real family member. Use appropriate family terms.",speakingTask:"Introduce one member of your family and give one simple fact about them.",writingTargets:["の","です"],speakingTargets:["の","です"]
},
{
 id:"time",title:"Understand time and meetings",unitId:"a1-unit-12",setting:"Students are checking when a study meeting begins.",
 dialogue:[{ja:"ケン：勉強会は何時からですか。",en:"Ken: What time does the study meeting start?"},{ja:"ミナ：九時からです。十時までです。",en:"Mina: From nine. Until ten."},{ja:"ケン：ありがとうございます。",en:"Ken: Thank you."}],
 notice:"から means from/start; まで means until/end. Do not confuse a start time with an end time. The topic marker は introduces the meeting.",
 grammarIds:["grammar-wa-topic","grammar-ka-question"],
 listening:{answer:"The meeting runs from nine until ten.",foils:["The meeting starts at ten.","The meeting runs from eight until nine."],feedback:"九時から is the start time, 十時まで the ending time."},
 reading:{prompt:"勉強会は何時までですか。",answer:"十時",foils:["九時","八時"],feedback:"まで marks the endpoint. 九時 is the start (から)."},
 reply:{prompt:"ケン：何時からですか。　ミナ：＿＿＿",answer:"九時からです。",foils:["九時までです。","九時をください。"],feedback:"から answers a starting-time question; まで would answer an ending-time question."},
 recall:{prompt:"Write 'from nine o'clock' in Japanese.",answers:["九時から","9時から"],feedback:"Clock time + から means from that time."},
 transfer:{audio:"先生：授業は八時から九時半までです。",meaning:"The class runs from eight until half past nine.",meaningFoils:["The class begins at half past nine.","The class lasts until eight."],prompt:"先生：授業は何時からですか。　生徒：＿＿＿",answer:"八時からです。",foils:["九時半までです。","八時に行きます。"],feedback:"The beginning is 八時から; 九時半まで refers to the end."},
 writingTask:"Write a short message giving the start and end time of a real or imaginary meeting.",speakingTask:"Tell someone a meeting's start and end times, then ask whether they understood.",writingTargets:["から","まで"],speakingTargets:["から","まで"]
},
{
 id:"food",title:"Order a drink politely",unitId:"a1-unit-16",setting:"You stop at a small café.",
 dialogue:[{ja:"店員：いらっしゃいませ。",en:"Staff: Welcome."},{ja:"ミナ：すみません。お茶をください。",en:"Mina: Excuse me. Tea, please."},{ja:"店員：はい、どうぞ。",en:"Staff: Certainly, here you are."},{ja:"ミナ：ありがとうございます。",en:"Mina: Thank you."}],
 notice:"Noun + をください is a standard request for an item. すみません can attract the staff's attention; ありがとうございます thanks them. Don't confuse ordering with a question about preference.",
 grammarIds:["grammar-o-kudasai","grammar-o-object"],
 listening:{answer:"Mina asks for tea.",foils:["Mina asks for a ticket.","Mina asks for coffee."],feedback:"お茶 is tea; コーヒー is coffee."},
 reading:{prompt:"ミナさんは何をくださいと言いましたか。",answer:"お茶",foils:["水","コーヒー"],feedback:"The object before をください is お茶."},
 reply:{prompt:"店員：ご注文は？　ミナ：＿＿＿",answer:"お茶をください。",foils:["お茶に行きます。","お茶がありますかで。"],feedback:"お茶をください politely orders tea. を marks the requested item."},
 recall:{prompt:"Write 'Water, please' using 水.",answers:["水をください。","水をください","みずをください"],feedback:"Use 水 + を + ください to request water."},
 transfer:{audio:"客：すみません。コーヒーをください。",meaning:"The customer orders coffee.",meaningFoils:["The customer orders tea.","The customer asks for the restroom."],prompt:"店員：何にしますか。　客：＿＿＿",answer:"コーヒーをください。",foils:["コーヒーに来ました。","コーヒーまでです。"],feedback:"The request structure remains noun + をください, but the item changes."},
 writingTask:"Write a short polite café exchange with an item you would actually order.",speakingTask:"Get a server's attention, order one drink and thank them.",writingTargets:["すみません","ください"],speakingTargets:["ください","ありがとうございます"]
},
{
 id:"shopping",title:"Ask about prices",unitId:"a1-unit-17",setting:"Mina is deciding whether to buy a notebook.",
 dialogue:[{ja:"ミナ：これはいくらですか。",en:"Mina: How much is this?"},{ja:"店員：五百円です。",en:"Staff: It is 500 yen."},{ja:"ミナ：じゃあ、これをください。",en:"Mina: In that case, I'll take this one."}],
 notice:"いくら asks for a price; 円 is yen. これ points to something close to the speaker. これをください uses the object marker を.",
 grammarIds:["grammar-desu","grammar-o-kudasai","grammar-ka-question"],
 listening:{answer:"The notebook costs 500 yen.",foils:["The item costs 50 yen.","Mina buys a train ticket."],feedback:"五百円 (ごひゃくえん) is 500 yen, not 50 yen."},
 reading:{prompt:"品物はいくらですか。",answer:"五百円",foils:["千円","百円"],feedback:"The staff states 五百円です."},
 reply:{prompt:"ミナ：これはいくらですか。　店員：＿＿＿",answer:"五百円です。",foils:["五百円をください。","五百円に行きます。"],feedback:"Price reporting uses amount + です. をください is for requesting an item."},
 recall:{prompt:"Write 'How much is this?' using これ.",answers:["これはいくらですか。","これはいくらですか"],feedback:"The question is これ + は + いくら + ですか."},
 transfer:{audio:"店員：このかばんは千円です。",meaning:"This bag costs 1,000 yen.",meaningFoils:["The bag costs 100 yen.","The bag is free."],prompt:"客：これはいくらですか。　店員：＿＿＿",answer:"千円です。",foils:["百円です。","千円をください。"],feedback:"千円 is 1,000 yen, different from 百円 (100 yen)."},
 writingTask:"Write a brief shopping exchange asking the price and deciding to buy an item.",speakingTask:"Ask an item's price and respond politely after hearing the amount.",writingTargets:["いくら","ですか"],speakingTargets:["いくら","ですか"]
},
{
 id:"preferences",title:"Discuss food you like",unitId:"a1-unit-07",setting:"Two classmates are chatting about food.",
 dialogue:[{ja:"ケン：日本の料理が好きですか。",en:"Ken: Do you like Japanese food?"},{ja:"ミナ：はい、好きです。特にカレーが好きです。",en:"Mina: Yes, I do. I especially like curry."},{ja:"ケン：私もカレーが好きです。",en:"Ken: I like curry too."}],
 notice:"〜が好きです expresses preference. も expresses 'also' when a shared fact applies. 特に means especially; don't translate 好きです as an action verb 'like' with を.",
 grammarIds:["grammar-mo-also","grammar-wa-topic","grammar-ka-question"],
 listening:{answer:"Both speakers like curry.",foils:["Neither speaker likes curry.","They are choosing train tickets."],feedback:"ミナ likes curry and ケン says 私も, indicating the same preference."},
 reading:{prompt:"ミナさんは特に何が好きですか。",answer:"カレー",foils:["お茶","電車"],feedback:"特にカレーが好きです says she particularly likes curry."},
 reply:{prompt:"ケン：カレーが好きです。　ミナ：＿＿＿",answer:"私も好きです。",foils:["私を好きです。","私に好きます。"],feedback:"も means also; 好き is not a ます-verb."},
 recall:{prompt:"Write 'I also like curry.' in the short model form.",answers:["私もカレーが好きです。","私もカレーが好きです","わたしもカレーが好きです。"],feedback:"私も identifies another person with the same preference; カレーが marks the liked item."},
 transfer:{audio:"ユナ：お茶が好きです。ケン：私もお茶が好きです。",meaning:"Both Yuna and Ken like tea.",meaningFoils:["Only Yuna likes tea.","Ken prefers coffee."],prompt:"ユナ：お茶が好きです。　ケン：＿＿＿",answer:"私も好きです。",foils:["私は行きます。","私にください。"],feedback:"私も好きです appropriately agrees with the same preference."},
 writingTask:"Write two sentences about things you genuinely like, including one reason if you can.",speakingTask:"State a food preference, ask someone else's preference, and acknowledge their response.",writingTargets:["好き","です"],speakingTargets:["好き","ですか"]
},
{
 id:"past",title:"Describe where you went",unitId:"a1-unit-04",setting:"Two friends talk about yesterday.",
 dialogue:[{ja:"ミナ：昨日、図書館に行きました。",en:"Mina: I went to the library yesterday."},{ja:"ケン：そうですか。私も図書館に行きました。",en:"Ken: I see. I went to the library too."}],
 notice:"昨日 marks yesterday. The polite past of 行きます is 行きました. に marks the movement destination; も marks a shared action.",
 grammarIds:["grammar-ni-destination","grammar-masu","grammar-mo-also"],
 listening:{answer:"Both friends went to the library yesterday.",foils:["Both are going tomorrow.","Mina went to a restaurant."],feedback:"昨日 means yesterday, 行きました signals polite past."},
 reading:{prompt:"二人は昨日どこに行きましたか。",answer:"図書館",foils:["学校","駅"],feedback:"Both say 図書館に行きました."},
 reply:{prompt:"先生：昨日どこに行きましたか。　ミナ：＿＿＿",answer:"図書館に行きました。",foils:["図書館に行きます。","図書館を行きました。"],feedback:"昨日 requires a past answer; the destination takes に, not を."},
 recall:{prompt:"Write 'I went to the station yesterday.'",answers:["昨日、駅に行きました。","昨日駅に行きました。","きのう、えきにいきました。"],feedback:"昨日 indicates past time; 駅に marks the destination; 行きました is polite past."},
 transfer:{audio:"ケン：日曜日、公園に行きました。",meaning:"Ken went to a park on Sunday.",meaningFoils:["Ken is at a park now.","Ken will go to school tomorrow."],prompt:"友達：日曜日、どこに行きましたか。　ケン：＿＿＿",answer:"公園に行きました。",foils:["公園で来ます。","公園をください。"],feedback:"Here に marks the destination; 行きました is past."},
 writingTask:"Write two short sentences about real places you went recently.",speakingTask:"Say where you went yesterday and ask another person about their recent activity.",writingTargets:["に","ました"],speakingTargets:["に","ました"]
},
{
 id:"transport",title:"Find your way to the station",unitId:"a1-unit-18",setting:"Mina asks how a friend gets to the station.",
 dialogue:[{ja:"ミナ：駅までどうやって行きますか。",en:"Mina: How do you get to the station?"},{ja:"ケン：バスで行きます。十分ぐらいです。",en:"Ken: I go by bus. It takes about ten minutes."},{ja:"ミナ：ありがとうございます。",en:"Mina: Thank you."}],
 notice:"まで names the endpoint; で marks the means of transport, as in バスで. ぐらい indicates an approximate amount.",
 grammarIds:["grammar-ni-destination","grammar-masu"],
 listening:{answer:"Ken goes to the station by bus.",foils:["Ken walks to the station.","Ken takes a taxi."],feedback:"バスで means by bus. で here marks the transportation method."},
 reading:{prompt:"ケンさんは何で駅まで行きますか。",answer:"バス",foils:["電車","自転車"],feedback:"ケン says バスで行きます."},
 reply:{prompt:"ミナ：何で駅まで行きますか。　ケン：＿＿＿",answer:"バスで行きます。",foils:["バスに行きます。","バスをください。"],feedback:"The means of transport takes で in this answer; に is for destination."},
 recall:{prompt:"Write the model 'I go by bus.'",answers:["バスで行きます。","バスで行きます","ばすでいきます"],feedback:"Transport + で + 行きます, not バスに行きます for traveling by bus."},
 transfer:{audio:"ユナ：学校まで電車で行きます。",meaning:"Yuna goes to school by train.",meaningFoils:["Yuna goes to the station by bus.","Yuna walks home."],prompt:"先生：何で学校に行きますか。　ユナ：＿＿＿",answer:"電車で行きます。",foils:["電車に行きます。","電車を行きます。"],feedback:"電車で signals transportation by train."},
 writingTask:"Write simple directions or a message explaining how you travel to a familiar place.",speakingTask:"Ask how to reach a place and answer how you travel there.",writingTargets:["まで","で"],speakingTargets:["で","行きます"]
},
{
 id:"help",title:"Ask for repetition and clarification",unitId:"a1-unit-19",setting:"A visitor misses part of an explanation at a ticket desk.",
 dialogue:[{ja:"店員：切符はあちらです。",en:"Staff: Tickets are over there."},{ja:"ミナ：すみません。もう一度言ってください。",en:"Mina: Excuse me. Please say that again."},{ja:"店員：あちらです。",en:"Staff: Over there."},{ja:"ミナ：ありがとうございます。",en:"Mina: Thank you."}],
 notice:"もう一度 means one more time. A verb in て-form + ください makes a polite action request. Asking for clarification is a useful communication strategy, not evidence of failure.",
 grammarIds:["grammar-te-form","grammar-te-kudasai"],
 listening:{answer:"Mina asks the staff member to repeat.",foils:["Mina buys a drink.","Mina refuses the ticket."],feedback:"もう一度言ってください requests another repetition."},
 reading:{prompt:"ミナさんは何をお願いしますか。",answer:"もう一度言ってください。",foils:["水をください。","切符を二枚ください。"],feedback:"She needs the statement repeated; she has not ordered or purchased anything."},
 reply:{prompt:"説明が聞こえませんでした。何と言いますか。",answer:"もう一度言ってください。",foils:["おはようございます。","お茶があります。"],feedback:"Use もう一度言ってください when you did not hear or understand something."},
 recall:{prompt:"Write 'Please say it again.'",answers:["もう一度言ってください。","もう一度言ってください","もういちどいってください。"],feedback:"もう一度 + 言って + ください, not an ordinary noun request with をください."},
 transfer:{audio:"先生：次は三ページです。　ケン：すみません。もう一度お願いします。",meaning:"Ken asks the teacher to repeat information.",meaningFoils:["Ken asks to go home.","Ken says he finished page three."],prompt:"先生：分かりましたか。　ケン：＿＿＿",answer:"もう一度お願いします。",foils:["何時からですか。","千円です。"],feedback:"もう一度お願いします politely asks for a repetition even without the explicit verb."},
 writingTask:"Write a polite short message asking someone to repeat or clarify information.",speakingTask:"Ask for repetition, then acknowledge that you understood.",writingTargets:["すみません","もう一度"],speakingTargets:["もう一度","ください"]
},
{
 id:"exchange",title:"Connect a short everyday conversation",unitId:"a1-unit-20",setting:"Two friends talk about today's weather and tomorrow's plans.",
 dialogue:[{ja:"ミナ：今日は寒いですね。",en:"Mina: It's cold today, isn't it?"},{ja:"ケン：そうですね。明日は暖かいですよ。",en:"Ken: Yes. Tomorrow will be warm, you know."},{ja:"ミナ：そうですか。ありがとうございます。",en:"Mina: I see. Thank you."}],
 notice:"ね invites shared agreement or confirmation; よ introduces information that the listener might not know. そうですか acknowledges new information rather than agreement.",
 grammarIds:["grammar-ne","grammar-yo","grammar-ka-question"],
 listening:{answer:"They discuss cold weather today and warmer weather tomorrow.",foils:["They plan to go shopping now.","They discuss a train cancellation."],feedback:"今日は寒い and 明日は暖かい refer to different days and temperatures."},
 reading:{prompt:"明日の天気はどうですか。",answer:"暖かいです。",foils:["寒いです。","雪です。"],feedback:"The second speaker says 明日は暖かいですよ; today, not tomorrow, is cold."},
 reply:{prompt:"ミナ：今日は寒いですね。　ケン：＿＿＿",answer:"そうですね。",foils:["そうですか。","お水をください。"],feedback:"そうですね shows agreement with what both can observe; そうですか reacts to new information."},
 recall:{prompt:"Write the brief response 'I see' on hearing new information.",answers:["そうですか。","そうですか"],feedback:"そうですか signals acknowledgment, distinct from agreement そうですね."},
 transfer:{audio:"ユナ：今日は暑いですね。　ケン：そうですね。",meaning:"Both agree that it is hot today.",meaningFoils:["They agree it is cold.","Ken has never heard of hot weather."],prompt:"ユナ：今日は暑いですね。　ケン：＿＿＿",answer:"そうですね。",foils:["そうですか。","行きました。"],feedback:"Use そうですね for shared agreement about the weather."},
 writingTask:"Write a brief three-turn everyday exchange with a comment, an appropriate response and an acknowledgment.",speakingTask:"Start a short conversation about the weather, agree or acknowledge new information and close politely.",writingTargets:["ね","です"],speakingTargets:["ね","そうです"]
}
];
