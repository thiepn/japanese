import {coreContent,canDoDescriptor,courseUnit} from "../coreContent";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {courseUnitSession} from "./grammarCourse";

/** New original teaching around canonical grammar anchors, not a fork of the independent CF-A1 PR #103. */
type Check=readonly [question:string,answer:string,foilA:string,foilB:string,feedback:string,foilANote:string,foilBNote:string];
type Case=Readonly<{anchor:string;unitId?:string;title:string;situation:string;why:string;contrast:string;
 examples:readonly (readonly [string,string])[];checks:readonly Check[];independent:string}>;
const CASES:readonly Case[]=[
 {anchor:"grammar-wa-topic",title:"Introduce yourself without repeating the subject",
  situation:"At a class welcome desk, two learners introduce themselves. One says ミナです。 The other asks ミナさんは学生ですか。 The name is already known, so the answer can be はい、学生です。 The topic is clear from the question.",
  why:"は marks what a statement is about; it is pronounced wa even though it is written は. It need not appear in every answer. Noun + です is a polite nominal predicate, and か at the end makes a simple question. The subject can be omitted when a listener can recover it from context.",
  contrast:"私はミナです。 introduces the speaker explicitly. ミナです。 is enough when the situation already establishes who is speaking. Do not mechanically add 私は to every sentence.",
  examples:[["ミナです。","I'm Mina. The subject is understood."],["ミナさんは学生ですか。","Is Mina a student? は introduces the topic."],["はい、学生です。","Yes, (she is) a student. Do not repeat the topic without need."],["いいえ、先生です。","No, (she is) a teacher. Context supplies the topic."]],
  checks:[
   ["At an introduction, the speaker's identity is already obvious. Which reply is concise and polite?","ミナです。","ミナをです。","ミナで行きます。","A name plus です is enough for a basic polite introduction.","を marks an object; it cannot attach to です this way.","で行きます describes a means or location, not a name."],
   ["ミナさんは学生ですか。 — はい、＿＿＿。","学生です。","学生か。","学生を。","The topic is already understood; complete the predicate with です.","か would turn this reply into another question.","を does not form a polite noun predicate."],
   ["Which statement about は is accurate?","It marks the sentence topic and is pronounced wa.","It marks every direct object.","It must appear after every pronoun.","Topic は is written は and pronounced wa.","The object particle is を.","Subjects and topics are often omitted when understood."]
  ],
  independent:"Write two lines introducing yourself, then replying to a classmate's polite question. Your response is self-review only."},
 {anchor:"grammar-ka-question",title:"Ask, confirm, and answer the question actually asked",
  situation:"At a station counter, one person says 東京ですか。 The questioner is checking a destination, not introducing themselves. A response such as はい、東京です。 confirms the information without turning it into another question.",
  why:"A final か commonly marks a polite question. A positive answer may begin はい and repeat only the information being confirmed. A negative answer should correct the misunderstood information rather than answering a different question.",
  contrast:"東京です。 is a statement; 東京ですか。 asks for confirmation. Rising intonation alone is not a reliable replacement for learning the written polite structure.",
  examples:[["東京ですか。","Is it Tokyo? A confirmation question."],["はい、東京です。","Yes, Tokyo. Confirmation."],["いいえ、大阪です。","No, Osaka. A correction."],["何時ですか。","What time is it? か follows the question word and predicate."]],
  checks:[
   ["You want to confirm whether the destination is Osaka. Choose the question.","大阪ですか。","大阪です。","大阪をです。","Final か turns the polite predicate into a question.","This is a statement, not a question.","を cannot connect to です as a destination check."],
   ["大阪ですか。 The destination is actually Tokyo. Respond accurately.","いいえ、東京です。","はい、大阪です。","東京をください。","Reject the mistaken destination, then supply the correct one.","はい would incorrectly confirm Osaka.","ください requests an item and does not answer the destination check."],
   ["Which expression requests the time?","何時ですか。","今は先生です。","駅を飲みます。","何時 asks what time; ですか completes the polite question.","This identifies a teacher, not a time.","This is semantically implausible; 飲む takes something drinkable."]
  ],
  independent:"Write a two-turn exchange where you misunderstand a destination, receive a correction, and acknowledge it. Do not copy the model."},
 {anchor:"grammar-o-object",title:"Order a drink and notice what を marks",
  situation:"At a café, a customer says お茶を飲みます。 The drink is what the action applies to. In a different situation, お茶をください requests tea directly; it is not the same grammatical action as describing what you drink.",
  why:"を marks the direct object of many action verbs. In お茶を飲みます, お茶 is consumed by 飲みます. A request such as お茶をください uses the same object particle with a request expression, but its communicative purpose is different.",
  contrast:"Compare お茶を飲みます (I drink tea) with お茶をください (Tea, please). One describes an action; the other makes an item request. Do not confuse the object marker を with the topic marker は.",
  examples:[["お茶を飲みます。","I drink tea."],["水を飲みます。","I drink water."],["お茶をください。","Tea, please."],["本を読みます。","I read a book. The book is the object of reading."]],
  checks:[
   ["Which particle marks the thing being drunk? 水＿＿飲みます。","を","で","に","を marks 水 as the direct object of 飲みます.","で may mark an action location or means, not the drink here.","に marks destinations and various relations, not the drink here."],
   ["A customer wants to order tea rather than describe their routine. Choose the request.","お茶をください。","お茶を飲みます。","お茶は学生です。","ください requests the specified item.","飲みます describes drinking; it is not a direct request.","A drink cannot be a student."],
   ["Which sentence describes reading a book?","本を読みます。","本でいます。","本に食べます。","本 is the thing read, so を marks the object.","でいます is not an appropriate description of reading.","に食べます misuses the particle and verb."]
  ],
  independent:"Write a four-line café scene that distinguishes a request for an item from describing what you normally drink. Treat it as independent ungraded writing."},
 {anchor:"grammar-de-action-place",title:"Where an action happens: で versus に",
  situation:"A learner studies Japanese at school: 学校で日本語を勉強します。 Here the school is the location of an action. The same school can be a destination in 学校に行きます, where に highlights the direction of movement.",
  why:"で commonly marks the place where a deliberate action happens. に can mark a destination with verbs such as 行きます and appears with other uses that are not interchangeable. Always inspect the verb and the role of the location.",
  contrast:"学校で勉強します = study at school. 学校に行きます = go to school. Replacing で with に in the first expression changes or breaks the intended relationship.",
  examples:[["学校で日本語を勉強します。","I study Japanese at school."],["学校に行きます。","I go to school."],["家で本を読みます。","I read at home."],["駅に行きます。","I go to the station."]],
  checks:[
   ["Where do you read? 家＿＿本を読みます。","で","に","を","The home is where the reading action happens, so choose で.","に is not the normal action-place marker for 読みます.","を already marks 本, the direct object."],
   ["You are going to the station. Select the destination marker.","駅に行きます。","駅で行きます。","駅を読みます。","に marks the destination of 行きます.","で would normally mark means or an action place, not this destination.","を読みます would make the station an object of reading."],
   ["Which sentence says 'I study Japanese at school'?","学校で日本語を勉強します。","学校に日本語を勉強します。","学校を日本語に行きます。","で identifies the action location, and を marks the object of studying.","に does not mark this deliberate action location.","The particles and verb do not express the intended studying event."]
  ],
  independent:"Describe one place where you study and one destination you travel to. Use different verbs and decide independently whether で or に fits."}
 ,{anchor:"grammar-ni-destination",title:"Plan a route: arrival point versus action location",
  situation:"You are meeting a friend after class. First you say 駅に行きます because the station is where you intend to go. Later, while explaining the meeting, you say 駅で待ちます, because waiting takes place at the station. The same noun can play different roles depending on the verb.",
  why:"に commonly marks the destination with movement verbs such as 行きます or 来ます. で commonly marks the scene of an activity, such as 待ちます or 勉強します. A change in the verb can change the particle even when the place word is identical.",
  contrast:"駅に行きます means go to the station; 駅で待ちます means wait at the station. Do not decide between に and で based only on whether the word is a place.",
  examples:[["駅に行きます。","I will go to the station; a destination."],["駅で待ちます。","I will wait at the station; an action location."],["学校に行きます。","I go to school."],["学校で勉強します。","I study at school."]],
  checks:[
   ["Which means that the station is your destination?","駅に行きます。","駅で待ちます。","駅を飲みます。","に with 行きます marks the destination.","で with 待ちます identifies where an activity happens, not where you are going.","を飲みます requires a drinkable object, not a station."],
   ["You are already at the station and will wait. Which particle fits? 駅＿＿待ちます。","で","に","を","で marks the place of the waiting action.","に could mark destination with movement, but 待ちます is an action here.","を would make the station a direct object in this sentence."],
   ["Which statement is true?","A place can take に or で depending on the event.","All place nouns must take に.","で always means travel to a destination.","The verb and the intended role determine the particle.","Places where actions happen often use で.","The destination of movement is generally marked by に here."]
  ],
  independent:"Write a two-sentence plan: where you will travel and where you will wait for a classmate. Explain to yourself why the particles differ."},
 {anchor:"grammar-suki-ga",title:"Talk about preferences without treating 好き as a verb",
  situation:"Two students discuss free-time interests. One says 私は本が好きです and the other replies 私は音楽が好きです. Each is naming something liked, not describing an action performed on that thing. Japanese commonly uses が for the liked object with 好き.",
  why:"好き is a な-adjectival noun-like predicate expressing liking; in the basic pattern X が好きです, が identifies what is liked. This differs from the verb 読みます, where a book being read is an object marked by を. The topic of whose preference is discussed can be expressed by は.",
  contrast:"本が好きです: I like books. 本を読みます: I read a book. Do not change が to を just because an English translation uses the verb 'like'.",
  examples:[["私は本が好きです。","I like books."],["音楽が好きです。","I like music."],["本を読みます。","I read a book."],["何が好きですか。","What do you like?"]],
  checks:[
   ["Complete 'I like music': 音楽＿＿好きです。","が","を","で","が commonly marks what is liked with 好き.","を normally marks the object of an action verb, not 好き in this beginner pattern.","で can locate an action, not indicate a liked object."],
   ["Which sentence describes the action of reading a book?","本を読みます。","本が好きです。","本で好きです。","読みます is the reading action and takes the book as direct object.","好きです names a preference, not the reading action.","で好きです is not the ordinary preference construction."],
   ["What is the natural response to 何が好きですか。?","音楽が好きです。","駅に行きます。","八時です。","The question asks what is liked, so a preference is relevant.","This gives a destination rather than a preference.","This gives a time rather than a preference."]
  ],
  independent:"Write a short conversation about two different things you and a classmate like. Add one sentence describing an action involving one of those things."},
 {anchor:"grammar-aru-iru",title:"Find people and objects: あります and います",
  situation:"A learner looks for a teacher and a textbook before class. 教室に先生がいます tells us a teacher is present in the classroom. かばんに本があります tells us a book is in the bag. The type of entity changes the existence verb, even though the location is marked similarly.",
  why:"For simple location and existence statements, います is used for people and animals, while あります is used for most inanimate things. The entity that exists commonly takes が; the location often takes に. Do not confuse a destination with the location in which something exists.",
  contrast:"教室に先生がいます is about a person; 教室に本があります is about a thing. Both refer to existence in a place, so the verb depends on the entity rather than which building is being described.",
  examples:[["教室に先生がいます。","A teacher is in the classroom."],["かばんに本があります。","There is a book in the bag."],["庭に猫がいます。","A cat is in the garden."],["机にペンがあります。","A pen is on the desk."]],
  checks:[
   ["Your teacher is in the classroom. Complete: 教室に先生が＿＿。","います","あります","行きます","A person exists at the location, so use います.","あります is the usual existence verb for things, not people.","行きます means goes; it does not state that the teacher is present."],
   ["A pen is on the desk. Complete: 机にペンが＿＿。","あります","います","飲みます","A pen is an inanimate thing, so use あります.","います is generally used for people and animals.","飲みます means drinks and cannot describe this existence relation."],
   ["Which sentence says there is a cat in the garden?","庭に猫がいます。","庭に猫があります。","庭で猫を飲みます。","Cats are animals, so the basic existence verb is います.","あります is not the usual existence predicate for cats.","The action verb and object are semantically wrong."]
  ],
  independent:"Describe where one person or animal and one inanimate object are located, choosing います and あります deliberately."},
{
  "anchor": "grammar-demonstrative-pronouns",
  "title": "Point to things: これ versus この",
  "situation": "At a classroom desk, a learner points to a book and says これは本です。 A little later, the learner uses この本は日本語です to describe the same book. The first demonstrative stands alone; the second must go directly before its noun.",
  "why": "これ, それ and あれ can stand as noun-like expressions ('this', 'that near you', 'that over there'). この, その and あの must modify a following noun. Both sets reflect the situation of speaker, listener and referent rather than translating every English 'this' into the same Japanese word.",
  "contrast": "これは本です。 is complete because これ stands alone. この本は日本語です。 requires 本 immediately after この. Do not write このは本です or これ本は日本語です.",
  "checks": [
    [
      "You are pointing to a book. Complete: ＿＿は本です。",
      "これ",
      "この",
      "その",
      "これ can be the topic without an accompanying noun.",
      "この requires an immediately following noun.",
      "その also needs a noun; it cannot stand alone here."
    ],
    [
      "You want to describe this particular book. Complete: ＿＿本は日本語です。",
      "この",
      "これ",
      "あれ",
      "この modifies 本 directly.",
      "これ is a pronoun and cannot directly modify 本.",
      "あれ stands alone; あの would modify 本."
    ],
    [
      "Which source sentence points to a school over there?",
      "あれは学校です。",
      "それは水です。",
      "この本は日本語です。",
      "あれ stands alone and indicates a distant referent.",
      "それ here identifies water, not the distant school.",
      "この本 identifies a particular book, not a school."
    ]
  ],
  "independent": "Point to two objects at different distances. Write one line using a standalone demonstrative and another using a demonstrative followed by a noun. Self-check the noun placement.",
  "examples": [
    [
      "これは本です。",
      "これ stands on its own as 'this'."
    ],
    [
      "それは水です。",
      "それ refers to something near the listener or otherwise in context."
    ],
    [
      "あれは学校です。",
      "あれ points to something distant from both speakers."
    ],
    [
      "この本は日本語です。",
      "この directly determines the noun 本."
    ]
  ]
},
{
  "anchor": "grammar-kara-made",
  "title": "From when to when: から and まで",
  "situation": "A learner tells a colleague 九時から五時まで働きます。 The time range begins at nine and ends at five. A separate sentence 八時に学校に行きます gives one scheduled time rather than a start-to-end interval.",
  "why": "から marks the starting boundary and まで the endpoint of a range. The particles can frame a period with a verb describing what happens during it. に in 八時に学校に行きます instead marks when that movement is scheduled.",
  "contrast": "九時から五時まで働きます。 reports a range. 八時に学校に行きます。 reports a time point. Do not use まで to mean 'at' or mistake から for the destination particle.",
  "checks": [
    [
      "Complete the start of the work interval: 九時＿＿五時まで働きます。",
      "から",
      "まで",
      "に",
      "から introduces the starting boundary.",
      "まで introduces an endpoint and is already attached to 五時.",
      "に would describe a time point, not this marked start-to-end frame."
    ],
    [
      "Complete the endpoint: 九時から五時＿＿働きます。",
      "まで",
      "から",
      "で",
      "まで marks the end of this time interval.",
      "から is already the starting marker after 九時.",
      "で marks other relations, not this endpoint."
    ],
    [
      "Which original sentence gives a single school departure time rather than a work interval?",
      "八時に学校に行きます。",
      "九時から五時まで働きます。",
      "七時半です。",
      "八時に marks the time of going to school.",
      "This reports working over a period of time.",
      "This tells the current clock time but not a scheduled school trip."
    ]
  ],
  "independent": "Write a two-line schedule: one action at a specific clock time and one activity over an interval. Check に against から…まで without using a model answer.",
  "examples": [
    [
      "九時から五時まで働きます。",
      "から gives the start; まで gives the endpoint."
    ],
    [
      "八時に学校に行きます。",
      "に marks a specific clock time for the action."
    ],
    [
      "七時半です。",
      "半 means half past in this clock-time statement."
    ],
    [
      "明日は十時に来ます。",
      "十時に identifies a time point on the next day."
    ]
  ]
},
{
  "anchor": "grammar-de-means",
  "title": "By train or to the station: two roles for particles",
  "situation": "A classmate asks how you travel to school. 電車で学校に行きます answers with a mode of travel and a destination. In バスで駅に行きます the bus is still the means, while the station is where the movement is headed.",
  "why": "With transportation expressions, で can mark the means of travel; に commonly marks the movement destination. The same sentence can have both particles, each with a different function. Do not confuse this means-で with the action-location で encountered earlier.",
  "contrast": "電車で学校に行きます: 電車で is how, 学校に is where to. 駅はどこですか。 asks for the station's location, but gives no means of travel.",
  "checks": [
    [
      "Complete the travel means: 電車＿＿学校に行きます。",
      "で",
      "に",
      "を",
      "で marks the train as the means of travel.",
      "に identifies a destination here, not a vehicle used to travel.",
      "を would not express travel by train in this pattern."
    ],
    [
      "Which source sentence means going to the station by bus?",
      "バスで駅に行きます。",
      "電車で学校に行きます。",
      "自転車で家に帰ります。",
      "バスで states the means and 駅に the destination.",
      "This travels by train to school.",
      "This returns home by bicycle."
    ],
    [
      "Which sentence asks where the station is, instead of identifying a travel means?",
      "駅はどこですか。",
      "バスで駅に行きます。",
      "電車で学校に行きます。",
      "どこ asks where, with no means of transport specified.",
      "This describes traveling by bus.",
      "This describes traveling by train."
    ]
  ],
  "independent": "Write two lines for different journeys, each giving a vehicle and a destination. Then write one separate question asking where one destination is.",
  "examples": [
    [
      "電車で学校に行きます。",
      "電車で marks transport; 学校に is the destination."
    ],
    [
      "バスで駅に行きます。",
      "バスで is the means; 駅に is the destination."
    ],
    [
      "自転車で家に帰ります。",
      "自転車で marks bicycle travel; 家に is homeward movement."
    ],
    [
      "駅はどこですか。",
      "どこですか asks for the place, not how to travel."
    ]
  ]
},
{
  "anchor": "grammar-te-kudasai",
  "title": "Ask someone to repeat or slow down",
  "situation": "A learner cannot follow a fast explanation. Instead of pretending to understand, the learner says ゆっくり話してください。 If a word is missed, もう一度言ってください。 asks for it again. These are requests for another person's action.",
  "why": "Verb て-form plus ください makes a polite request for an action. 言ってください asks the listener to say something; 話してください asks them to speak. 分かりません can report not understanding, but it does not by itself specify what help is being requested.",
  "contrast": "もう一度言ってください。 requests repetition; 分かりません。 reports lack of understanding. Noun + をください, used to request an item, is a different construction from verb て-form + ください.",
  "checks": [
    [
      "Your partner is speaking too quickly. Which response directly requests slower speech?",
      "ゆっくり話してください。",
      "もう一度言ってください。",
      "分かりません。",
      "ゆっくり specifies slower speech, and 話してください makes the request.",
      "This asks for repetition, not specifically for a slower pace.",
      "This reports a problem without asking for a specific action."
    ],
    [
      "You missed a sentence. Which response politely requests repetition?",
      "もう一度言ってください。",
      "ここに書いてください。",
      "分かりません。",
      "もう一度 together with 言ってください asks the speaker to say it again.",
      "This asks someone to write here.",
      "This reports non-understanding rather than a specific repeat request."
    ],
    [
      "Which statement about ください in these examples is correct?",
      "Verb て-form + ください asks someone to perform an action.",
      "Verb dictionary form + をください requests an action.",
      "分かりません is a verb て-form request.",
      "The source examples use て-form verbs before ください.",
      "をください with a noun requests an item, not a verb action.",
      "分かりません is a statement, not an action request."
    ]
  ],
  "independent": "Write a three-turn conversation: you do not understand, you ask for a specific kind of help, and you acknowledge the response. Treat the exchange as ungraded writing.",
  "examples": [
    [
      "もう一度言ってください。",
      "言ってください asks for another utterance."
    ],
    [
      "ゆっくり話してください。",
      "ゆっくり plus 話してください requests slower speech."
    ],
    [
      "ここに書いてください。",
      "書いてください asks someone to write in the indicated location."
    ],
    [
      "分かりません。",
      "分かりません reports that something is not understood."
    ]
  ]
},
{
  "anchor": "grammar-to-with",
  "unitId": "a1-unit-05",
  "title": "Talk with someone, or add someone too",
  "situation": "Two classmates describe their day. 友達と話します。 describes talking with a friend; 友達も学生です。 adds a friend to a group already described as students. The noun 友達 is shared, but its grammatical relationship differs.",
  "why": "The companion particle と identifies someone who joins an activity. In contrast, も means 'also' or 'too': it includes another participant or entity in a previously understood group or claim. Use the verb and discourse context to decide, not the English word 'friend' alone.",
  "contrast": "友達と話します。 = talk with a friend. 友達も学生です。 = the friend is also a student. 友達と does not mean 'also' in the second sentence.",
  "examples": [
    [
      "友達と話します。",
      "と marks the person participating in the conversation."
    ],
    [
      "友達も学生です。",
      "も adds another person with the same characteristic."
    ],
    [
      "駅で友達と話します。",
      "駅で locates the talking; 友達と marks the companion."
    ]
  ],
  "checks": [
    [
      "Say you talk WITH a friend. 友達＿＿話します。",
      "と",
      "も",
      "を",
      "と indicates the person in the activity.",
      "も is additive, not the companion marker in this original statement.",
      "を marks an object, not the participant here."
    ],
    [
      "A classmate is already a student. You say your friend is ALSO a student. 友達＿＿学生です。",
      "も",
      "と",
      "で",
      "も adds a parallel student to the discussion.",
      "と would indicate a companion, not inclusion in this predicate.",
      "で would not mark the added student in the noun predicate."
    ],
    [
      "Which installed sentence says you talk with a friend at the station?",
      "駅で友達と話します。",
      "友達も学生です。",
      "友達と話します。",
      "駅で is the location and 友達と the companion.",
      "This adds a student but does not mention conversation.",
      "This mentions a conversation but gives no location."
    ]
  ],
  "independent": "Write one sentence about doing something with a friend, then one that says someone else shares a stated characteristic. Explain why you chose と or も."
},
{
  "anchor": "grammar-masen",
  "unitId": "a1-unit-08",
  "title": "Going, not going, and what already happened",
  "situation": "Today, a learner can say 今日は学校に行きます。 or 今日は学校に行きません。 The second statement negates today's plan. お茶を飲みました。 describes a separate completed action rather than a present or future plan.",
  "why": "Polite ます is nonpast affirmative, ません is nonpast negative, and ました is past affirmative. The nonpast form can describe a habit, a current situation, or a planned future event depending on context. Tense and polarity are distinct choices.",
  "contrast": "行きません is not a past tense. 飲みました does not mean 'will not drink'. A past negative requires a form such as ませんでした, which belongs to another lesson.",
  "examples": [
    [
      "今日は学校に行きます。",
      "行きます states today's affirmative plan."
    ],
    [
      "今日は学校に行きません。",
      "行きません negates that nonpast plan."
    ],
    [
      "お茶を飲みました。",
      "飲みました states a completed action."
    ]
  ],
  "checks": [
    [
      "You are NOT going to school today. Choose the exact sentence.",
      "今日は学校に行きません。",
      "今日は学校に行きます。",
      "お茶を飲みました。",
      "行きません is nonpast negative in this context.",
      "行きます confirms going; it does not negate the plan.",
      "This is a different action in the past."
    ],
    [
      "Choose the completed affirmative action.",
      "お茶を飲みました。",
      "お茶を飲みません。",
      "お茶を飲みます。",
      "ました expresses past affirmative here.",
      "ません expresses nonpast negative.",
      "ます expresses nonpast affirmative."
    ],
    [
      "Which explanation is correct for 行きません?",
      "Polite nonpast negative.",
      "Polite past affirmative.",
      "Always a statement about yesterday.",
      "ません negates a nonpast action; context supplies the time.",
      "Past affirmative uses ました, not ません.",
      "There is no inherent 'yesterday' in this form."
    ]
  ],
  "independent": "Write two lines about today's plans, one affirmative and one negative, and one line about an activity completed earlier. Verify the endings ます, ません, and ました."
},
{
  "anchor": "grammar-no-attribute",
  "unitId": "a1-unit-11",
  "title": "Relate nouns with の, or list items with と",
  "situation": "This book belongs to someone: これは私の本です。 The form 私の describes the book. When shopping, パンと水を買います。 lists two things to buy instead. The connecting particles do different work.",
  "why": "Noun A + の + noun B can express possession, naming or other relationships: 私の本, 先生の名前, 家族の写真. The particle と can join two nouns in a complete list. An English apostrophe is not a reliable translation for every relationship shown by の.",
  "contrast": "私の本 = my book; パンと水 = bread and water. の makes one noun determine another, while と coordinates listed nouns.",
  "examples": [
    [
      "これは私の本です。",
      "私の connects the book to the speaker."
    ],
    [
      "先生の名前は何ですか。",
      "先生の identifies whose name is asked about."
    ],
    [
      "パンと水を買います。",
      "パンと水 lists two purchases."
    ],
    [
      "家族の写真です。",
      "家族の relates the photograph to family."
    ]
  ],
  "checks": [
    [
      "Complete 'This is my book': これは私＿＿本です。",
      "の",
      "と",
      "を",
      "の links the owner to the book.",
      "と joins nouns but does not express this possessive relation.",
      "を is an object particle, not a noun modifier."
    ],
    [
      "Buy bread AND water. パン＿＿水を買います。",
      "と",
      "の",
      "が",
      "と connects two listed purchase items.",
      "の would make a different noun relationship.",
      "が does not enumerate the two objects here."
    ],
    [
      "Which source sentence asks for a teacher's name?",
      "先生の名前は何ですか。",
      "家族の写真です。",
      "これは私の本です。",
      "先生の specifies the person whose name is sought.",
      "This identifies a family photograph.",
      "This states ownership of a book."
    ]
  ],
  "independent": "Write a label for a personal object with の, then a separate shopping sentence joining two items with と. Do not reuse the source objects."
},
{
  "anchor": "grammar-i-adj-past",
  "unitId": "a1-unit-14",
  "title": "Past and negative forms for two adjective types",
  "situation": "Yesterday was hot: 昨日は暑かったです。 Today is not cold: 今日は寒くないです。 A different adjective type appears in 昨日は静かじゃなかったです。 ('It was not quiet yesterday').",
  "why": "An い-adjective usually replaces final い with かった to form past affirmative, and with くない for nonpast negative. A な-adjective such as 静か uses a noun-like predicate; the attested past-negative form is 静かじゃなかったです. Do not add でした to an unchanged い-adjective.",
  "contrast": "暑かったです = was hot; 寒くないです = is not cold; 静かじゃなかったです = was not quiet. Adjective class and time/polarity each matter.",
  "examples": [
    [
      "昨日は暑かったです。",
      "暑い becomes 暑かった for past affirmative."
    ],
    [
      "今日は寒くないです。",
      "寒い becomes 寒くない for nonpast negative."
    ],
    [
      "ここは静かです。",
      "静か is a な-adjective with a noun-like predicate."
    ],
    [
      "昨日は静かじゃなかったです。",
      "静かじゃなかった is past negative."
    ]
  ],
  "checks": [
    [
      "You want to say 'It was hot yesterday'. 昨日は＿＿。",
      "暑かったです",
      "暑いでした",
      "暑くないです",
      "暑かったです is the correct い-adjective past.",
      "Do not append でした to an unchanged い-adjective.",
      "暑くないです is a nonpast negative."
    ],
    [
      "Say 'It is not cold today'. 今日は＿＿。",
      "寒くないです",
      "寒かったです",
      "寒いでした",
      "寒くないです is the nonpast negative.",
      "寒かったです is past affirmative.",
      "寒いでした incorrectly adds でした."
    ],
    [
      "Which source sentence says it was NOT quiet yesterday?",
      "昨日は静かじゃなかったです。",
      "ここは静かです。",
      "昨日は暑かったです。",
      "静かじゃなかったです is past negative.",
      "This affirms that it is quiet here.",
      "This is past hot weather, not a negative quietness statement."
    ]
  ],
  "independent": "Describe yesterday and today with one past い-adjective, one negative い-adjective and one past-negative な-adjective. Check the form of each ending."
},
{
  "anchor": "grammar-counter-tsu",
  "unitId": "a1-unit-16",
  "title": "Order quantities with 一つ and 二つ",
  "situation": "At a small counter, パンを二つください。 orders two bread items. 水を一つください。 asks for one water item or serving. コーヒーをください。 shows that a simple item request does not always specify a number.",
  "why": "The structure noun + を + quantity/counter + ください politely requests items and quantities. The common native counter forms are 一つ (ひとつ) and 二つ (ふたつ), not mechanical readings of the numerals. Without a quantity, noun + をください still requests the item.",
  "contrast": "パンを二つください requests two items; 野菜を食べます describes eating rather than ordering. ください is a request expression, not the same as an action verb in a statement.",
  "examples": [
    [
      "パンを二つください。",
      "二つ gives the quantity of bread items."
    ],
    [
      "水を一つください。",
      "一つ requests one water item or serving."
    ],
    [
      "コーヒーをください。",
      "Coffee is requested without stating a count."
    ],
    [
      "野菜を食べます。",
      "食べます describes eating instead of making an order."
    ]
  ],
  "checks": [
    [
      "Order TWO bread items. パンを＿＿ください。",
      "二つ",
      "一つ",
      "二人",
      "二つ is the correct two-item counter here.",
      "一つ means one item.",
      "二人 counts people, not bread items."
    ],
    [
      "Which source sentence requests ONE water serving?",
      "水を一つください。",
      "コーヒーをください。",
      "野菜を食べます。",
      "水を一つ specifies one item or serving.",
      "This requests coffee without an explicit count.",
      "This describes eating vegetables."
    ],
    [
      "What does コーヒーをください。 specify?",
      "Coffee, without an explicit quantity.",
      "Exactly two cups of coffee.",
      "That the speaker drank coffee yesterday.",
      "This is an item request without a numeral/counter.",
      "The sentence has no 二つ or other counted quantity.",
      "A completed drinking action would have a different verb form."
    ]
  ],
  "independent": "Write an order for one item and another for two, using the correct つ forms. Add a simple third request without stating a number."
},
{
  "anchor": "grammar-location-words",
  "unitId": "a1-unit-10",
  "title": "Ask where, what, which, or who",
  "situation": "You are new to a school building. 学校はどこですか。 asks for a location, and トイレはあそこです。 points to a distant place. At the same reception desk, これは何ですか。 asks about an object, どの本ですか。 narrows down a book, and あの人はだれですか。 asks about a person.",
  "why": "どこ requests a place; 何 asks what something is; だれ asks who someone is. どの directly modifies a following noun, unlike standalone どれ. Location terms ここ, そこ, あそこ point from a speaker's spatial perspective. Select the question word by the missing kind of information, not simply by a question-mark translation.",
  "contrast": "学校はどこですか。 asks where the school is, not which school. どの本ですか。 includes a noun after どの; これは何ですか。 asks what the pointed-to object is.",
  "examples": [
    [
      "学校はどこですか。",
      "どこ requests the school's location."
    ],
    [
      "トイレはあそこです。",
      "あそこ places the restroom over there."
    ],
    [
      "これは何ですか。",
      "何 asks the identity of an object."
    ],
    [
      "どの本ですか。",
      "どの must precede 本."
    ],
    [
      "あの人はだれですか。",
      "だれ asks the identity of a person."
    ]
  ],
  "checks": [
    [
      "You need the school location. Choose the matching source question.",
      "学校はどこですか。",
      "これは何ですか。",
      "どの本ですか。",
      "どこ asks for a place, matching a school-location request.",
      "何 asks what an object is, not where a school is.",
      "どの本 asks which book, not where a school is."
    ],
    [
      "You see several books and ask which book someone means.",
      "どの本ですか。",
      "学校はどこですか。",
      "あの人はだれですか。",
      "どの directly modifies 本 to ask which one.",
      "どこ asks a location, not selection among books.",
      "だれ asks who a person is, not which book."
    ],
    [
      "Which source sentence asks who the distant person is?",
      "あの人はだれですか。",
      "トイレはあそこです。",
      "これは何ですか。",
      "あの人 identifies the distant person and だれ asks who.",
      "This points to a restroom without asking a person.",
      "This asks what an object is, not who someone is."
    ]
  ],
  "independent": "Write a short exchange at an unfamiliar school: ask for a room, identify one object, and distinguish a person from several possible people. Use different question words deliberately."
},
{
  "anchor": "grammar-masen-deshita",
  "unitId": "a1-unit-13",
  "title": "Tell your routine and what did not happen",
  "situation": "A learner describes a normal weekday: 毎日七時に起きます。, 朝ご飯を食べます。, and 夜十時に寝ます。 But a report about yesterday differs: 昨日は勉強しませんでした。 states that the studying did not happen.",
  "why": "〜ます describes a polite nonpast action, often habitual with 毎日. に can mark the specific time 七時 or 十時. For a past negative, ませんでした combines negative polarity with past time. By contrast, ません alone is nonpast negative and ました is past affirmative.",
  "contrast": "勉強しませんでした means 'did not study', not 'do not study'. 毎日七時に起きます。 tells a habitual time. The temporal marker 昨日は and the verb ending together make the past-negative meaning clear.",
  "examples": [
    [
      "毎日七時に起きます。",
      "毎日 makes getting up at seven a daily routine."
    ],
    [
      "朝ご飯を食べます。",
      "食べます expresses the habitual breakfast action."
    ],
    [
      "学校で日本語を勉強します。",
      "学校で identifies where the studying happens."
    ],
    [
      "夜十時に寝ます。",
      "十時に specifies the bedtime."
    ],
    [
      "昨日は勉強しませんでした。",
      "しませんでした is the past negative of します."
    ]
  ],
  "checks": [
    [
      "Yesterday you did NOT study. Which original line states that?",
      "昨日は勉強しませんでした。",
      "学校で日本語を勉強します。",
      "朝ご飯を食べます。",
      "しませんでした reports a past non-event; 昨日は sets yesterday.",
      "This describes studying at school in the nonpast.",
      "This describes eating breakfast, not a past study omission."
    ],
    [
      "Which original sentence gives a habitual wake-up time?",
      "毎日七時に起きます。",
      "夜十時に寝ます。",
      "昨日は勉強しませんでした。",
      "毎日 makes the seven-o'clock event a routine; 七時に gives the clock time.",
      "This gives a bedtime, not a wake-up time.",
      "This describes a past negative action, not a repeated morning routine."
    ],
    [
      "Which ending marks polite PAST NEGATIVE in this unit?",
      "ませんでした",
      "ません",
      "ました",
      "ませんでした combines past tense and negative meaning.",
      "ません is nonpast negative; it does not itself indicate past.",
      "ました is past affirmative, not past negative."
    ]
  ],
  "independent": "Write three lines about an ordinary day with specific times. Then report one thing you did not do yesterday using a past-negative verb, without copying the model."
},
{
  "anchor": "grammar-question-words",
  "unitId": "a1-unit-17",
  "title": "Ask a price and choose what to buy",
  "situation": "At a shop, これはいくらですか。 asks a price. The reply 三百円です。 gives a yen amount. You then consider その本は高いです。 versus このパンは安いです。, choose an item, and say りんごを三つください。 to request three apples.",
  "why": "いくら asks how much an item costs; 円 labels the stated currency amount. どれを買いますか。 instead asks which item someone will purchase. 高い and 安い express relative expense; a quantity with をください specifies what to request, not what the price is.",
  "contrast": "これはいくらですか。 asks the price; どれを買いますか。 asks which object. 三百円です。 answers the price question but is not itself an order. りんごを三つください。 is an order with an item count, not a price question.",
  "examples": [
    [
      "これはいくらですか。",
      "いくら requests the item's price."
    ],
    [
      "三百円です。",
      "三百円です gives a yen amount."
    ],
    [
      "その本は高いです。",
      "高い describes the book as expensive."
    ],
    [
      "りんごを三つください。",
      "三つ counts the apples being requested."
    ],
    [
      "どれを買いますか。",
      "どれ requests a choice among items."
    ]
  ],
  "checks": [
    [
      "You want the price of the object near you. What do you ask?",
      "これはいくらですか。",
      "どれを買いますか。",
      "りんごを三つください。",
      "いくら asks how much it costs.",
      "どれ asks which item will be purchased, not its price.",
      "This places an order for three apples rather than asking cost."
    ],
    [
      "A clerk states the price is three hundred yen. Which original reply fits?",
      "三百円です。",
      "その本は高いです。",
      "りんごを三つください。",
      "三百円です states an amount in yen.",
      "高い evaluates a relative price, without giving a numerical amount.",
      "This is a quantity request, not a numerical price answer."
    ],
    [
      "You have chosen three apples and want to order them. Which is the request?",
      "りんごを三つください。",
      "これはいくらですか。",
      "どれを買いますか。",
      "りんごを三つください identifies the item and number to request.",
      "This asks a price; no order is made.",
      "This asks what will be bought; no order is made."
    ]
  ],
  "independent": "Write a three-turn shopping dialogue: ask the price, receive a numerical yen response, then request a quantity of an item. Add a different question about which item to buy."
},
{
  "anchor": "grammar-ne",
  "unitId": "a1-unit-20",
  "title": "Invite agreement or provide new information",
  "situation": "Two people comment on the weather: 今日は寒いですね。 invites the listener's agreement. Another speaker gives useful directions: 駅はあそこですよ。 presents information to the listener. 日本語は難しいですか。 is instead a direct question, which can be answered with a relevant yes/no response.",
  "why": "Sentence-final ね often seeks shared recognition or agreement, whereas よ signals information the speaker presents assertively to the listener. か marks a straightforward polite question. These are pragmatic tendencies, not fixed translations of English question tags; audience and context matter.",
  "contrast": "今日は寒いですね。 shares an observation and invites agreement. 駅はあそこですよ。 offers information. 日本語は難しいですか。 asks a question. Do not treat ね, よ and か as interchangeable punctuation.",
  "examples": [
    [
      "今日は寒いですね。",
      "ね invites agreement on a weather observation."
    ],
    [
      "この店はいいですね。",
      "ね can also invite agreement about a shop."
    ],
    [
      "駅はあそこですよ。",
      "よ actively provides the station's location."
    ],
    [
      "日本語は難しいですか。",
      "か makes a direct question about Japanese."
    ],
    [
      "はい、少し分かります。",
      "はい introduces a relevant affirmative response."
    ]
  ],
  "checks": [
    [
      "You and a friend both feel it is cold. Which source sentence invites shared agreement?",
      "今日は寒いですね。",
      "駅はあそこですよ。",
      "日本語は難しいですか。",
      "ね seeks agreement on a shared observation.",
      "よ actively informs the listener about the station.",
      "か asks a yes/no question about Japanese rather than sharing the weather."
    ],
    [
      "A visitor needs to find the station. Which source sentence actively tells them where it is?",
      "駅はあそこですよ。",
      "この店はいいですね。",
      "日本語は難しいですか。",
      "よ conveys the location as information for the listener.",
      "ね invites agreement about a shop, not a direction.",
      "か asks a question unrelated to directions."
    ],
    [
      "You want to ask whether Japanese is difficult. Which ending belongs in the source question?",
      "か",
      "ね",
      "よ",
      "か creates the polite question here.",
      "ね commonly invites alignment with an observation, not this direct question.",
      "よ signals information being presented, not the intended direct question."
    ]
  ],
  "independent": "Write a short encounter: state one shared observation with ね, give one useful fact with よ, and ask a direct yes/no question with か. Review each sentence's purpose."
},
{
  "anchor": "grammar-counter-nin",
  "title": "Talk about your family: people, roles, and locations",
  "situation": "At a class welcome event, a learner says 私の家族は四人です。 and then identifies relatives: 父は先生です。, 母は会社員です。 Later the learner describes where a younger sister and the parents are: 妹は家にいます。 and 両親は日本にいます。",
  "why": "人 is a counter for people. In 四人 (よにん), the counter expresses the number of family members; it does not label a person's occupation. For roles such as 先生 or 会社員, the polite nominal predicate ends with です. To say someone is at a place, location に and います are used. Keep number, role and location as separate information needs.",
  "contrast": "私の家族は四人です。 gives a count. 父は先生です。 describes a role. 妹は家にいます。 gives a person's location. Do not answer 'Where is your sister?' with a family size.",
  "checks": [
    [
      "How many people are in this family? Choose the installed sentence that gives the count.",
      "私の家族は四人です。",
      "父は先生です。",
      "妹は家にいます。",
      "四人 is the family size, using the people counter 人.",
      "This identifies the father's role but gives no count.",
      "This identifies a person's location, not the total."
    ],
    [
      "A classmate asks where the learner's younger sister is. Select the matching original sentence.",
      "妹は家にいます。",
      "母は会社員です。",
      "私の家族は四人です。",
      "家にいます states where the sister is.",
      "This is the mother's occupation, not a location.",
      "A people count does not answer a location question."
    ],
    [
      "Which answer gives the father's job rather than the family size or where someone lives?",
      "父は先生です。",
      "両親は日本にいます。",
      "私の家族は四人です。",
      "先生です states the occupation.",
      "日本にいます states a location.",
      "四人 counts people in the family."
    ]
  ],
  "independent": "Introduce a small imaginary family in four short Japanese lines: give its size with 人, introduce one person's role, and locate two family members. Self-check each sentence's information type.",
  "unitId": "a1-unit-15",
  "examples": [
    [
      "私の家族は四人です。",
      "四人 (よにん) counts the people in the family."
    ],
    [
      "父は先生です。",
      "先生です describes the father's occupation."
    ],
    [
      "母は会社員です。",
      "会社員です describes the mother's occupation."
    ],
    [
      "妹は家にいます。",
      "家にいます locates the younger sister."
    ],
    [
      "両親は日本にいます。",
      "日本にいます locates the parents."
    ]
  ]
},
{
  "anchor": "grammar-time-counters",
  "title": "Read the clock and set a precise meeting time",
  "situation": "Someone checks the clock: 今は七時です。 A little later, 七時半です。 means half past seven, not seven-thirty minutes of activity. When planning a trip, 八時に学校に行きます。 identifies a specific time of travel, while 九時から五時まで働きます。 reports a work interval.",
  "why": "時 identifies clock hours. 半 after the hour expresses half past; 七時半 is seven thirty. For an activity at a specific clock time, に can mark the time, as in 八時に学校に行きます. For an interval, から marks the start and まで the endpoint. A clock reading and a scheduled event answer different questions.",
  "contrast": "七時半です。 reports the clock reading. 八時に学校に行きます。 names when something happens. 九時から五時まで働きます。 spans a start and end. Do not treat 半 as a counter for duration in these source examples.",
  "checks": [
    [
      "A friend asks what time it is: it is half past seven. Choose the original clock reading.",
      "七時半です。",
      "今は七時です。",
      "八時に学校に行きます。",
      "半 after 七時 gives half past seven.",
      "This is seven o'clock, not half past.",
      "This gives the scheduled time of an action rather than the requested clock reading."
    ],
    [
      "Choose the sentence that says when school travel happens.",
      "八時に学校に行きます。",
      "七時半です。",
      "九時から五時まで働きます。",
      "八時に identifies the event's clock time.",
      "This states a clock reading, not an action time.",
      "This describes a work interval, not a school trip."
    ],
    [
      "Which sentence describes a start-to-end work schedule rather than one clock reading?",
      "九時から五時まで働きます。",
      "今は七時です。",
      "七時半です。",
      "から…まで expresses the beginning and endpoint of the work period.",
      "This only states the current hour.",
      "This is a single clock reading."
    ]
  ],
  "independent": "Write a short schedule with a clock reading, a fixed meeting time using に, and a work or study interval using から…まで. Check that the expressions answer three different questions.",
  "unitId": "a1-unit-12",
  "examples": [
    [
      "今は七時です。",
      "七時 identifies the current hour."
    ],
    [
      "七時半です。",
      "七時半 means half past seven."
    ],
    [
      "八時に学校に行きます。",
      "八時に marks the time of going to school."
    ],
    [
      "九時から五時まで働きます。",
      "から and まで bound the working interval."
    ],
    [
      "明日は十時に来ます。",
      "十時に states a planned arrival time tomorrow."
    ]
  ]
},
{
  "anchor": "grammar-i-adj-polite",
  "title": "Describe an object instead of stating a preference",
  "situation": "A learner says 本が好きです。 to express liking books. Later, the learner describes something physical: 家は大きいです。 and 本は小さいです。 These last two sentences describe size; they do not mean that the learner likes the house or the book.",
  "why": "好きです expresses a preference and commonly marks what is liked with が in the beginner pattern. 大きい and 小さい are い-adjectives used as predicates; です adds politeness but the adjective keeps its final い. は identifies the topic being described. Distinguish subjective preference from an observed quality.",
  "contrast": "本が好きです。 reports liking. 本は小さいです。 reports size. Do not replace が好き with an adjective merely because both English translations use 'is', and do not change 大きいです to 大きです.",
  "checks": [
    [
      "You want to say the HOUSE is big rather than that you like it. Choose the original description.",
      "家は大きいです。",
      "本が好きです。",
      "本は小さいです。",
      "大きいです describes the house's size.",
      "好きです expresses liking, not size.",
      "小さいです describes a small book, not a big house."
    ],
    [
      "Someone asks whether the book is small. Choose the installed size description.",
      "本は小さいです。",
      "日本語が好きですか。",
      "家は大きいです。",
      "小さいです is a size predicate referring to the book.",
      "This asks about a preference, not size.",
      "This describes a different object as big."
    ],
    [
      "Which sentence asks about liking Japanese rather than describing size?",
      "日本語が好きですか。",
      "家は大きいです。",
      "本は小さいです。",
      "好きですか asks a polite question about preference.",
      "大きい describes physical size.",
      "小さい describes physical size."
    ]
  ],
  "independent": "Write two independent lines describing the size of different objects, and a third line asking about someone's preference. Use い-adjectives and 好きですか for different communicative purposes.",
  "unitId": "a1-unit-07",
  "examples": [
    [
      "本が好きです。",
      "本が好きです expresses a preference."
    ],
    [
      "日本語が好きですか。",
      "か turns the preference into a polite question."
    ],
    [
      "家は大きいです。",
      "大きいです describes the house's size."
    ],
    [
      "本は小さいです。",
      "小さいです describes a book's size."
    ]
  ]
},
{
  "anchor": "grammar-te-form",
  "title": "Build polite requests from the verb て-form",
  "situation": "At school, a learner needs different kinds of help. ここに書いてください。 requests writing at a location. もう一度言ってください。 requests repetition, and ゆっくり話してください。 requests slower speech. 分かりません。 states that the learner does not understand, but it is not itself an action request.",
  "why": "In these source expressions, the verb's て-form comes before ください: 書く→書いて, 言う→言って, 話す→話して. The surface shape varies with the verb; simply attaching て to every dictionary form would be incorrect. ください attaches to the completed て-form when asking someone to perform the action. Learn these attested combinations before extending the rule to other verbs.",
  "contrast": "書いてください, 言ってください and 話してください request actions. 分かりません reports a problem. Noun + をください requests an item instead and is not interchangeable with verb て-form + ください.",
  "checks": [
    [
      "You want the teacher to WRITE here. Which source request fits?",
      "ここに書いてください。",
      "もう一度言ってください。",
      "分かりません。",
      "書いてください requests the writing action; ここに gives the place.",
      "This asks someone to say something again.",
      "This reports non-understanding, not writing."
    ],
    [
      "Which source request uses the て-form 言って rather than 話して?",
      "もう一度言ってください。",
      "ゆっくり話してください。",
      "ここに書いてください。",
      "言ってください requests saying something again.",
      "話してください asks for speech, with the slower manner given by ゆっくり.",
      "書いてください asks someone to write."
    ],
    [
      "Which analysis of the attested verb request is correct?",
      "話す becomes 話して before ください.",
      "All dictionary forms simply add て unchanged.",
      "分かりません is a て-form request.",
      "話して is the attested て-form in 話してください.",
      "Verbs have different て-form changes; 話す does not become 話すて.",
      "分かりません is a statement about understanding."
    ]
  ],
  "independent": "In a new classroom situation, write three polite requests asking for writing, repetition, and slower speech. Then add a separate line stating you do not understand. Check the て-form before ください.",
  "unitId": "a1-unit-19",
  "examples": [
    [
      "ここに書いてください。",
      "書いてください uses 書く→書いて to request writing."
    ],
    [
      "もう一度言ってください。",
      "言ってください uses 言う→言って to request repetition."
    ],
    [
      "ゆっくり話してください。",
      "話してください uses 話す→話して for slower speech."
    ],
    [
      "分かりません。",
      "分かりません reports non-understanding, not a request."
    ]
  ]
},
{
  "anchor": "grammar-desu",
  "title": "Identify someone with a polite noun predicate",
  "situation": "In a new classroom, someone can answer a question about their role with 学生です。 Someone else can say 先生です。 Neither answer supplies an explicit topic; the listener understands who is being identified from the conversation.",
  "why": "Noun + です makes a simple polite identification, such as 学生です or 先生です. The omitted topic can be supplied by context. です does not make a noun into a verb action. The identities are statements, not questions; a question would additionally require the appropriate question form.",
  "contrast": "学生です。 identifies a student; 先生です。 identifies a teacher. The difference is the noun, not a different ending. Do not treat です as the same verb ending as ます for actions.",
  "checks": [
    [
      "At a school introduction, you want to identify yourself as a STUDENT. Choose the exact original answer.",
      "学生です。",
      "先生です。",
      "本を読みます。",
      "学生です identifies the student role with a polite noun predicate.",
      "先生です identifies a teacher instead.",
      "読みます reports an action rather than a person's role."
    ],
    [
      "Your colleague identifies themself as a TEACHER. Which canonical answer matches?",
      "先生です。",
      "学生です。",
      "お茶を飲みます。",
      "先生です gives the teacher role, with です.",
      "学生です gives the student role instead.",
      "飲みます is an action verb, not a noun predicate."
    ],
    [
      "What grammatical purpose does です serve in 学生です。?",
      "It makes a polite identification using a noun.",
      "It marks the object of reading a book.",
      "It is the same verb ending as 飲みます.",
      "Noun + です expresses a polite noun predicate.",
      "The direct object of an action is marked differently, for example with を.",
      "Verb + ます and noun + です have different roles."
    ]
  ],
  "independent": "Write a three-turn classroom introduction: a question about someone's role, a polite role answer with a noun + です, and a different person's role. Decide from context when you need to state the topic.",
  "unitId": "a1-unit-01",
  "examples": [
    [
      "学生です。",
      "学生 is the identifying noun and です keeps the answer polite."
    ],
    [
      "先生です。",
      "先生 is the role being identified, with the same です predicate."
    ]
  ]
},
{
  "anchor": "grammar-masu",
  "title": "State an everyday action or ask what someone will do",
  "situation": "A learner describes a routine: 本を読みます。 or お茶を飲みます。 At lunch they say ご飯を食べます。 A friend asks 何を食べますか。 to find out what the learner will eat. These sentences use a polite action verb rather than a noun identity.",
  "why": "In these original sentences, 読みます, 飲みます and 食べます are polite nonpast action verbs. ます itself does not uniquely indicate 'right now' or 'tomorrow': habitual and future interpretations depend on time and conversation. The object particle を tells what is read, drunk or eaten; 何を makes that object the missing information in a question.",
  "contrast": "本を読みます。 says an action involving a book; 学生です。 would instead identify a person. 何を食べますか。 asks for an object, whereas ご飯を食べます。 supplies one.",
  "checks": [
    [
      "You want to say you READ a book, not drink tea. Which source sentence fits?",
      "本を読みます。",
      "お茶を飲みます。",
      "ご飯を食べます。",
      "読みます gives the action of reading, with 本を as its object.",
      "飲みます is drinking, not reading.",
      "食べます is eating, not reading."
    ],
    [
      "Your partner asks WHAT you will eat. Which original question do they ask?",
      "何を食べますか。",
      "ご飯を食べます。",
      "本を読みます。",
      "何を asks for the missing object of 食べます.",
      "This supplies a meal but is not a question.",
      "This describes reading a book instead."
    ],
    [
      "Which interpretation of 飲みます is accurate without further time context?",
      "A polite nonpast action, with time determined by context.",
      "Necessarily an action completed yesterday.",
      "A polite noun identification ending with です.",
      "ます is the polite nonpast action ending here; context supplies habitual or future meaning.",
      "A completed past action uses a past ending, not bare ます.",
      "飲みます is a verb predicate, not a noun + です statement."
    ]
  ],
  "independent": "Describe three different everyday actions with polite ます verbs, then ask one what-object question using 何を. Make sure each object matches its action.",
  "unitId": "a1-unit-03",
  "examples": [
    [
      "本を読みます。",
      "読みます expresses reading a book in the polite nonpast."
    ],
    [
      "お茶を飲みます。",
      "飲みます expresses drinking tea."
    ],
    [
      "ご飯を食べます。",
      "食べます expresses eating a meal."
    ],
    [
      "何を食べますか。",
      "何を makes the eaten object the subject of a question."
    ]
  ]
},
{
  "anchor": "grammar-ga-subject",
  "title": "Say what exists in a place: に, が and existence verbs",
  "situation": "A visitor says 学校に先生がいます。 to report a teacher at school. At home, a learner says 家に本があります。 to report a book. Both answers give a location and identify what is present, but the person and object require different existence verbs.",
  "why": "In these existence statements, に marks the location, while が identifies the person or thing whose existence is asserted. 先生が goes with います for a person; 本が goes with あります for an inanimate object. This use of が does not by itself mean 'likes' or indicate a direct object. The broader contrast between います and あります is covered in the existing anchor; this lesson focuses on the grammatical roles of に and が.",
  "contrast": "学校に is where; 先生が is who exists there. 家に is where; 本が is what exists there. Replacing が with を would no longer give the same simple existence pattern.",
  "checks": [
    [
      "You want to say a teacher is present AT SCHOOL. Which original sentence does that?",
      "学校に先生がいます。",
      "家に本があります。",
      "本を読みます。",
      "学校に identifies the location and 先生が names the person.",
      "This describes a book at home, not a teacher at school.",
      "This reports a reading action, not presence at school."
    ],
    [
      "Which part of 家に本があります。 tells WHAT is present?",
      "本が",
      "家に",
      "あります",
      "本が identifies the thing whose existence is asserted.",
      "家に identifies where it exists.",
      "あります tells that an inanimate thing exists; it is not its name."
    ],
    [
      "What is the role of が in 学校に先生がいます。?",
      "It marks the person whose existence is asserted.",
      "It marks school as the movement destination.",
      "It marks the person as the direct object of reading.",
      "先生が identifies the existing person; 学校に supplies the location.",
      "学校に marks a location, but が is attached to 先生.",
      "A direct object of an action would usually be marked with を, not this existence が."
    ]
  ],
  "independent": "Write two brief location descriptions: one person somewhere and one inanimate object elsewhere. Label the location に and the existing noun が in your own sentences.",
  "unitId": "a1-unit-06",
  "examples": [
    [
      "学校に先生がいます。",
      "学校に indicates the place; 先生が names the person present."
    ],
    [
      "家に本があります。",
      "家に indicates the place; 本が names the object present."
    ]
  ]
},
{
  "anchor": "grammar-o-kudasai",
  "title": "Request an item, or report an action",
  "situation": "At a food counter, a customer says コーヒーをください。 The same pattern can specify a count: パンを二つください。 and 水を一つください。 In contrast, 野菜を食べます。 describes eating and is not an order. もう一度お願いします。 is a separate polite request to repeat, without naming a food item.",
  "why": "Noun + をください politely requests an item, and a quantity such as 一つ or 二つ can make the count explicit. を identifies the requested item; ください is the requesting expression. This differs from an action report with a ます verb and from the verb て-form + ください request for another person's action. The separate counting lesson covers how to form the numerals.",
  "contrast": "コーヒーをください。 asks for coffee. 野菜を食べます。 says someone eats vegetables. The two sentences both use を, but only the first is an item request. For an action request, use a suitable verb て-form before ください, not an item noun + を.",
  "checks": [
    [
      "You are ready to order coffee without naming a quantity. Which original line fits?",
      "コーヒーをください。",
      "野菜を食べます。",
      "パンを二つください。",
      "コーヒーをください is a direct request for the item.",
      "食べます reports eating rather than asking for coffee.",
      "This requests bread and specifies a count, not coffee."
    ],
    [
      "Which source sentence requests two bread items rather than reporting an action?",
      "パンを二つください。",
      "野菜を食べます。",
      "水を一つください。",
      "パンを二つください uses noun + を + quantity + ください.",
      "This reports eating vegetables, not ordering items.",
      "This orders one water item, not two bread items."
    ],
    [
      "What does を mark in コーヒーをください。?",
      "The item being requested.",
      "A clock-time point for the order.",
      "A polite て-form action request.",
      "コーヒーを identifies coffee as the requested item.",
      "Time points may use に, but no time is stated here.",
      "There is no verb て-form in this item request."
    ]
  ],
  "independent": "Write two restaurant orders with and without a quantity, and a separate statement of something you eat. Explain why only the first two are item requests.",
  "unitId": "a1-unit-16",
  "examples": [
    [
      "コーヒーをください。",
      "コーヒーをください requests an item without stating its count."
    ],
    [
      "パンを二つください。",
      "パンを二つください requests two bread items."
    ],
    [
      "水を一つください。",
      "水を一つください requests one water item or serving."
    ],
    [
      "野菜を食べます。",
      "野菜を食べます reports eating rather than ordering."
    ]
  ]
}
];

function requireSourceUnit(unitId:string){
 const unit=courseUnit(unitId);
 if(unit.level!=="A1")return null;
 if(!unit.sourceIds.length||unit.sourceIds.some(x=>!x.trim())||!canDoDescriptor(unit.canDoId).sourceIds.length)
  throw Error("CUR03_CANONICAL_SOURCE_MISSING:"+unitId);
 return unit;
}
export function deepTeachingAnchors(unitId:string):readonly string[]{
 const unit=requireSourceUnit(unitId);
 if(!unit)return [];
 return CASES.filter(c=>(!c.unitId||c.unitId===unit.id)&&unit.grammarIds.includes(c.anchor)).sort((a,b)=>Number(Boolean(b.unitId))-Number(Boolean(a.unitId))).map(c=>c.anchor);
}
/** The original course prompts are passed through unchanged: no duplicate canonical IDs or FSRS engine. */
export function buildCur03CourseUnitSession(unitId:string):StudyStep[]{
 const base=courseUnitSession(unitId);
 const unit=requireSourceUnit(unitId);
 if(!unit)return base;
 const situations=CASES.filter(c=>(!c.unitId||c.unitId===unit.id)&&unit.grammarIds.includes(c.anchor)).sort((a,b)=>Number(Boolean(b.unitId))-Number(Boolean(a.unitId)));
 const added:StudyStep[]=[];
 for(const c of situations){
  const prefix="cur03-"+unitId+"-"+c.anchor;
  const sourceLabel="THIEPN original CUR-03 teaching · "+unitId+" · "+unit.sourceIds.join(", ");
  const facts=[{label:"Original canonical can-do",value:canDoDescriptor(unit.canDoId).statement}];
  const lesson=(key:string,title:string,body:string,examples:StudyLesson["examples"]):StudyLesson=>
   ({kind:"lesson",id:prefix+"-"+key,contextId:prefix,title,body,examples:examples??[],sourceLabel,facts});
  added.push(lesson("context",c.title,c.situation,c.examples.map(([expression,note])=>({expression,note}))));
  added.push(lesson("explanation","Why it works",c.why+" "+c.contrast,c.examples.slice(0,2).map(([expression,note])=>({expression,note}))));
  c.checks.forEach(([question,answer,foilA,foilB,feedback,noteA,noteB],n)=>{
   const choices=n%2===0?[foilA,answer,foilB]:[foilB,foilA,answer];
   const prompt:StudyPrompt={id:prefix+"-check-"+(n+1),primaryTarget:{kind:"can_do",id:unit.canDoId},
    skill:"comprehension",cueFamily:prefix+"-context-"+(n+1),
    promptType:"choice",instruction:"Choose the contextually accurate response.",
    prompt:question,promptLanguage:"en",choices,acceptedAnswers:[answer],displayAnswer:answer,explanation:feedback,
    contextId:prefix,sourceId:"thiepn-original",contentVersion:coreContent.version,
    languageActivity:"reading",activity:"review",
    eventMetadata:{cur03:true,cur03UnitId:unit.id,cur03Anchor:c.anchor,nonAuthoritative:true,
      schedulerExcluded:true,independentCompetenceVerified:false,
      e06FoilFeedback:[{response:foilA,feedback:noteA},{response:foilB,feedback:noteB}]}};
   added.push(prompt);
  });
  const free:StudyPrompt={id:prefix+"-independent",primaryTarget:{kind:"can_do",id:unit.canDoId},
   skill:"writing_quality",cueFamily:prefix+"-self-writing",promptType:"textarea",
   instruction:"Independent written transfer (ungraded)",prompt:c.independent,promptLanguage:"en",
   placeholder:"自分の日本語で書いてください…",acceptedAnswers:[],displayAnswer:"Self-review; no certified model answer.",
   explanation:"Read your own response for topic clarity, particle role, context and politeness. This structural activity is not evaluated as communicative competence.",
   contextId:prefix,sourceId:"thiepn-original",contentVersion:coreContent.version,
   languageActivity:"writing",activity:"writing",
   eventMetadata:{cur03:true,cur03UnitId:unit.id,cur03Anchor:c.anchor,nonAuthoritative:true,
      schedulerExcluded:true,independentCompetenceVerified:false}};
  added.push(lesson("transfer","Use it in a different situation",c.independent,[]));
  added.push(free);
 }
 return added.length?[base[0]!, ...added,...base.slice(1)]:base;
}
