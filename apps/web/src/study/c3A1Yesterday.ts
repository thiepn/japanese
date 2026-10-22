import type {CourseFirstUnit} from "./courseAuthoring";

/** Original authored teaching; E02 `past` remains the canonical final scene. */
export const C3_A1_YESTERDAY:CourseFirstUnit={
 id:"a1-unit-04",title:"Yesterday and recent activities",
 objective:"Distinguish everyday and completed actions, explain where someone went and compare short past-time accounts.",
 lessons:[
 {id:"cf-a1-04-01",title:"Today versus yesterday",
  objective:"Understand when an action happened using 昨日 and polite verb tense.",
  teach:"Japanese polite verbs distinguish nonpast and past in the predicate. 行きます describes a habitual or future trip according to context, while 行きました states that someone went. 昨日（きのう）means yesterday, and 今日（きょう）means today. The time expression and verb together tell the story: 昨日、図書館に行きました means I went to the library yesterday. に marks the destination here, not the time. The same sentence without 昨日 is still past because of 行きました.",
  examples:[["今日、学校に行きます。","I go / will go to school today."],["昨日、学校に行きました。","I went to school yesterday."],["昨日、図書館に行きました。","I went to the library yesterday."],["毎日、学校に行きます。","I go to school every day."]],
  checks:[
   ["ミナ：昨日、図書館に行きました。 When was the library visit?","Yesterday","Tomorrow","Every morning","昨日 establishes the past-time setting, and 行きました is polite past."],
   ["Which verb marks a completed trip rather than a routine?","行きました","行きます","行きません","ました is the polite past ending in this sentence."],
   ["今日、学校に行きます。 What does this sentence express here?","Going to school today","Went to school yesterday","Where is the school?","今日 is today, and 行きます is nonpast."],
   ["In 昨日、図書館に行きました, what is 図書館に?","The destination","The day of the week","The person speaking","図書館 means library; に marks where someone went."]
  ],
  recall:["Write 'I went to the library yesterday' using 昨日 and 図書館.","昨日、図書館に行きました。"],
  writing:"Write three original sentences: something you do regularly, where you went yesterday, and where you plan to go today. Make the time references and verb forms agree."},
 {id:"cf-a1-04-02",title:"Polite past of familiar actions",
  objective:"Recognize the shift from ます to ました in activity descriptions.",
  teach:"For verbs already learned in the polite nonpast, the ending ます changes to ました for polite past: 勉強します → 勉強しました; 起きます → 起きました; 行きます → 行きました. This is the affirmative past, not the past negative. A context such as 昨日の夜（きのうのよる, last night）often calls for a past action. Do not treat every sentence ending in ます as something that happened before; the verb ending must match the intended time.",
  examples:[["昨日、日本語を勉強しました。","I studied Japanese yesterday."],["今朝、六時に起きました。","I got up at six this morning."],["週末に公園に行きました。","I went to the park on the weekend."],["毎日、日本語を勉強します。","I study Japanese every day."]],
  checks:[
   ["Which is the polite past of 勉強します?","勉強しました","勉強します","勉強しません","勉強しました describes a completed act of studying."],
   ["昨夜、日本語を勉強＿＿. Choose the ending for a finished activity.","しました","します","しません","昨夜 establishes last night, so affirmative past is しました."],
   ["今朝、六時に起きました。 What happened?","The speaker woke at six this morning","The speaker will sleep at six tomorrow","The speaker studied at six every night","起きました is past of get up; 今朝 is this morning."],
   ["毎日、日本語を勉強します。 Which time reference best fits this?","A regular routine","A one-time trip yesterday","A future-only statement with no repetition","毎日 signals a repeated activity, expressed here with nonpast ます."]
  ],
  recall:["Write the polite past of 勉強します.","勉強しました。"],
  writing:"Write about yesterday in three different polite past sentences using an activity, a waking time, and a place you visited. Do not copy a model exchange."},
 {id:"cf-a1-04-03",title:"Where did you go?",
  objective:"Ask a polite past destination question and answer with place + に + 行きました.",
  teach:"To ask where someone went, use 昨日、どこに行きましたか. The question word どこ asks where, に marks the destination, and か marks the question. A concise answer is 駅に行きました or 図書館に行きました; the subject can stay unspoken. A question about the place should not be answered with a time alone. Keep どこに（where to）separate from 何時に（at what time）.",
  examples:[["昨日、どこに行きましたか。","Where did you go yesterday?"],["図書館に行きました。","I went to the library."],["日曜日、公園に行きました。","I went to the park on Sunday."],["何時に行きましたか。","What time did you go?"]],
  checks:[
   ["先生：昨日、どこに行きましたか。 Which answer directly fits?","図書館に行きました。","七時です。","日本語が好きです。","どこ asks for a destination, not a time or preference."],
   ["What is the function of に in 公園に行きました?","Mark the place reached","Mark the past tense","Mark whose park it is","The ending ました is the tense marker; に marks destination."],
   ["Which asks about the destination of a past trip?","どこに行きましたか。","何時に起きますか。","お名前は何ですか。","どこに行きましたか asks where the trip ended."],
   ["ケン：日曜日、駅に行きました。 Where did Ken go?","Station","Library","School","駅 means station; 日曜日 means Sunday."]
  ],
  recall:["Write 'Where did you go yesterday?' politely.","昨日、どこに行きましたか。"],
  writing:"Compose a four-turn exchange: one person asks where another went yesterday, gets a specific answer, asks what time, and receives the time."},
 {id:"cf-a1-04-04",title:"Read two weekend reports",
  objective:"Extract who went where and when from connected short Japanese passages.",
  teach:"Read the full miniature account before deciding. ミナ：土曜日、図書館に行きました。日曜日は家で勉強しました。ケン：土曜日、公園に行きました。日曜日は学校に行きました。 土曜日 is Saturday and 日曜日 is Sunday. A speaker can change from a place they went to a location where an action happened: 家で勉強しました uses で for the location of studying, while 学校に行きました uses に for the destination of going. Matching the correct day to the correct speaker is the real reading task.",
  examples:[["ミナ：土曜日、図書館に行きました。","Mina: On Saturday, I went to the library."],["ミナ：日曜日は家で勉強しました。","Mina: On Sunday, I studied at home."],["ケン：土曜日、公園に行きました。","Ken: On Saturday, I went to the park."],["ケン：日曜日は学校に行きました。","Ken: On Sunday, I went to school."]],
  checks:[
   ["ミナは土曜日、どこに行きましたか。","図書館","公園","学校","Mina's Saturday line states 図書館に行きました."],
   ["Who studied at home on Sunday?","Mina","Ken","Both speakers","ミナ says 日曜日は家で勉強しました."],
   ["ケンは日曜日、どこに行きましたか。","学校","図書館","公園","Ken's Sunday trip was to school, not Saturday's park."],
   ["In 家で勉強しました, what does で contribute?","The place where studying took place","A destination reached by going","A polite greeting","Studying is an activity at home; で marks the action location."]
  ],
  recall:["Write 'I studied at home on Sunday' using 日曜日 and 家.","日曜日は家で勉強しました。"],
  writing:"Write a two-day note about a fictional student's Saturday and Sunday in at least four original Japanese sentences. Include two destinations and one activity location."},
 {id:"cf-a1-04-05",title:"Follow up and find common ground",
  objective:"Use も to compare completed actions and avoid confusing past and present contexts.",
  teach:"When someone mentions a completed action that you also did, 私も means I too. ミナ：昨日、図書館に行きました。ケン：私も図書館に行きました expresses two matching experiences. も can replace は when focusing on shared information; in the second sentence it emphasizes Ken did it as well. You can follow a short report with そうですか to acknowledge it. Always read the new situation: a shared trip last Sunday still needs 行きました, not the habitual 行きます.",
  examples:[["ミナ：昨日、図書館に行きました。","Mina: Yesterday I went to the library."],["ケン：私も図書館に行きました。","Ken: I also went to the library."],["日曜日、私も公園に行きました。","I went to the park on Sunday too."],["そうですか。","I see."]],
  checks:[
   ["ミナ：図書館に行きました。ケン：私も図書館に行きました。 What do we know?","Both went to the library","Neither went to the library","Only Mina visited a park","私も expresses that Ken did the same action."],
   ["What does も signal in 私も?","Also / too","A destination","Tomorrow","も marks shared or added information."],
   ["A friend says 昨日、公園に行きました. You went there yesterday too. Choose a reply.","私も公園に行きました。","私も公園に行きます。","公園をください。","A completed matching visit needs the polite past 行きました."],
   ["Which statement does NOT describe a completed past visit?","毎日、学校に行きます。","昨日、学校に行きました。","日曜日、図書館に行きました。","毎日 and 行きます express an everyday routine, not a single finished visit."]
  ],
  recall:["Write 'I also went to the library' with 私も.","私も図書館に行きました。"],
  writing:"Write a five-turn dialogue about last weekend: two distinct past visits, one shared experience using も, and a natural acknowledgment. Include a new place not in the model."},
 {id:"cf-a1-04-06",title:"Past visit conversation challenge",
  scene:"past",objective:"Read the original library-visit conversation, respond with correct past destination language and revisit native delayed transfer."}
 ]};
