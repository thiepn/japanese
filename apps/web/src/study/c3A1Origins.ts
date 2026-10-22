import type {CourseFirstUnit} from "./courseAuthoring";

/** Original authored teaching linked to the canonical E02 `origin` capstone. */
export const C3_A1_ORIGINS:CourseFirstUnit={
 id:"a1-unit-05",title:"Places and where people came from",
 objective:"Ask and explain where people came from, distinguish source and destination, and read short introductions.",
 lessons:[
 {id:"cf-a1-05-01",title:"Where did you come from?",
  objective:"Use どこから来ましたか and an origin phrase with から.",
  teach:"どこから来ましたか asks where someone came from. どこ means where; から marks a starting point or origin; 来ました is the polite past of 来ます (come). For example, 韓国から来ました means I came from Korea. This question is about the place of departure, not necessarily nationality or permanent home. When talking about a person you just met, listen carefully to what they actually state; do not infer citizenship or birthplace from a recent trip.",
  examples:[["どこから来ましたか。","Where did you come from?"],["韓国から来ました。","I came from Korea."],["日本から来ました。","I came from Japan."],["トルコから来ました。","I came from Turkey."]],
  checks:[
   ["アリ：どこから来ましたか。 What is Ali asking?","The place someone came from","The person's age","The price of a ticket","どこから asks for the origin or starting point of a movement."],
   ["ミナ：韓国から来ました。 What place does she name?","Korea","Japan","Turkey","韓国 is Korea; から marks the source."],
   ["Which particle marks the source in 韓国から来ました?","から","に","を","から means from or starting at."],
   ["Select a polite answer to どこから来ましたか.","日本から来ました。","日本をください。","日本で起きます。","Place + から + 来ました answers a question about origin."]
  ],
  recall:["Write 'I came from Korea' using 韓国.","韓国から来ました。"],
  writing:"Answer どこから来ましたか in two contrasting contexts: arriving from a place this morning and a fictional visitor arriving from abroad. Do not invent a nationality unless explicitly stated."},
 {id:"cf-a1-05-02",title:"From versus to",
  objective:"Distinguish から as origin from に as movement destination.",
  teach:"Japanese uses different particles for a source and a destination. 学校に行きました means I went to school: に marks where the movement ends. 家から来ました means I came from home: から marks where the movement started. A single journey may mention both: 家から学校に行きました means I went from home to school. If you reverse the particles, you may change which place was left and which was reached. The verbs come and go also describe direction from the speaker's perspective.",
  examples:[["家から学校に行きました。","I went from home to school."],["学校から家に帰りました。","I returned from school to home."],["駅から来ました。","I came from the station."],["図書館に行きました。","I went to the library."]],
  checks:[
   ["家から学校に行きました。 Where did the trip begin?","At home","At school","At the library","家から states the origin of the journey."],
   ["家から学校に行きました。 Where did the person go?","To school","To home","To the station","学校に names the destination."],
   ["Which expression means 'from the station'?","駅から","駅に","駅をください","から marks a starting point; 駅 is station."],
   ["Which statement correctly says 'I went from home to school'?","家から学校に行きました。","家に学校から行きました。","家を学校で行きました。","Source takes から and destination takes に."]
  ],
  recall:["Write 'I went from home to school' with 家 and 学校.","家から学校に行きました。"],
  writing:"Describe two actual or fictional journeys with both a starting place and a destination. For each, underline (in your own notes) which place is marked by から and which by に."},
 {id:"cf-a1-05-03",title:"Ask and answer between classmates",
  objective:"Exchange origin information politely and return the question without overusing あなた.",
  teach:"A natural first-meeting exchange may be: はじめまして。どこから来ましたか。韓国から来ました。アリさんは？ トルコから来ました. The short follow-up アリさんは？ means And you, Ali? It avoids unnecessarily repeating あなた, which can sound distant or pointed in some contexts. Name + さん is a polite way to address someone you know by name; do not attach さん to your own name when introducing yourself. よろしくお願いします can close an introduction.",
  examples:[["アリさんはどこから来ましたか。","Ali, where did you come from?"],["私は韓国から来ました。","I came from Korea."],["アリさんは？","And you, Ali?"],["トルコから来ました。よろしくお願いします。","I came from Turkey. I look forward to getting along."]],
  checks:[
   ["ミナ：韓国から来ました。アリさんは？ What is Mina asking?","Where Ali came from","Whether Ali wants tea","What time the train leaves","The short さんは？ returns the current question to Ali."],
   ["Which polite form addresses a classmate called アリ?","アリさん","私さん","アリを","さん after the addressee's name is appropriate; avoid attaching さん to yourself."],
   ["アリ：どこから来ましたか。ミナ：＿＿","韓国から来ました。","韓国をください。","韓国までです。","The question requests a source of movement, not an item."],
   ["Which phrase can close this initial exchange politely?","よろしくお願いします。","おやすみなさい。","いただきます。","よろしくお願いします is common at the end of a first introduction."]
  ],
  recall:["Write 'And you, Ali?' using さん and は.","アリさんは？"],
  writing:"Create a six-turn first meeting between a local student and a visiting student. Use a full origin question, a short return question, and a polite closing. Name both speakers instead of repeatedly using あなた."},
 {id:"cf-a1-05-04",title:"Read a community introduction",
  objective:"Extract a speaker's name, point of departure, and destination from a short written profile.",
  teach:"Read this original introduction carefully: はじめまして。私はレナです。トルコから来ました。今は東京にいます。毎朝、日本語を勉強します。 It tells us Lena's name, that she came from Turkey, that she is in Tokyo now, and that she studies Japanese every morning. 今は marks a present situation; it does not mean she was born in Tokyo. Place + から and place + に express different roles. Read the verb and time word before deciding what a place means.",
  examples:[["はじめまして。私はレナです。","Nice to meet you. I'm Lena."],["トルコから来ました。","I came from Turkey."],["今は東京にいます。","I am in Tokyo now."],["毎朝、日本語を勉強します。","I study Japanese every morning."]],
  checks:[
   ["In the profile, what is the person's name?","レナ","ミナ","ケン","The first sentence introduces レナ."],
   ["Which country does レナ say she came from?","トルコ","日本","韓国","トルコから来ました explicitly states Turkey as her point of departure."],
   ["Where is レナ now according to the profile?","東京","トルコ","学校","今は東京にいます places her in Tokyo now."],
   ["What does レナ do every morning?","Studies Japanese","Goes to the station","Buys coffee","毎朝、日本語を勉強します states the recurring action."]
  ],
  recall:["Write 'I came from Turkey' using トルコ.","トルコから来ました。"],
  writing:"Write a four-sentence mini-profile of a fictional exchange student: name, where they came from, where they are now, and a daily routine. Include one fact that differs from the reading model."},
 {id:"cf-a1-05-05",title:"Origin or destination?",
  objective:"Transfer から and に to changed trips without confusing residence, nationality, and recent travel.",
  teach:"The same place can be an origin in one sentence and a destination in another. 昨日、大阪から京都に行きました describes a journey from Osaka to Kyoto yesterday. 今日、京都から大阪に行きます reverses it. These sentences tell a route, not a person's passport or long-term residence. To ask about origin, use どこから来ましたか; to ask about where someone went, use どこに行きましたか. The appropriate reply depends on the question, not a memorized country label.",
  examples:[["昨日、大阪から京都に行きました。","Yesterday I went from Osaka to Kyoto."],["今日、京都から大阪に行きます。","Today I go from Kyoto to Osaka."],["どこから来ましたか。","Where did you come from?"],["昨日、どこに行きましたか。","Where did you go yesterday?"]],
  checks:[
   ["昨日、大阪から京都に行きました。 Where did the trip start?","Osaka","Kyoto","Tokyo","大阪から marks the origin of the journey."],
   ["昨日、大阪から京都に行きました。 Where did the person arrive?","Kyoto","Osaka","Turkey","京都に is the destination."],
   ["A visitor asks どこから来ましたか. Which answer matches a journey from Osaka?","大阪から来ました。","大阪に行きました。","大阪をください。","The question asks for the starting place, so use から."],
   ["Which conclusion is NOT warranted by 大阪から来ました?","The person has Japanese citizenship","The person came from Osaka","Osaka was the stated starting place","An origin statement does not certify nationality."]
  ],
  recall:["Write 'I went from Osaka to Kyoto yesterday' with 昨日.","昨日、大阪から京都に行きました。"],
  writing:"Compose two contrasting travel messages (at least four original Japanese sentences total). One reports yesterday's route, the other describes today's route in reverse. Add one sentence explicitly identifying a present location; do not claim the traveler's nationality."},
 {id:"cf-a1-05-06",title:"Independent first-arrival exchange",
  scene:"origin",objective:"Follow the original Ali–Mina origin conversation, respond with から in a new context and revisit existing E02 delayed checks."}
 ]};
