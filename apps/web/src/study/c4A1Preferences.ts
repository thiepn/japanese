import type {CourseFirstUnit} from "./courseAuthoring";

/** New original learner material; native E02 preferences remains its own capstone. */
export const C4_A1_PREFERENCES:CourseFirstUnit={
 id:"a1-unit-07",title:"Food preferences and shared choices",
 objective:"Ask about likes, understand preference contrasts, read a shared menu discussion, and respond to another person's choice without confusing preference with an order.",
 lessons:[
 {id:"cf-a1-07-01",title:"What do you like?",
  objective:"Express a food preference using N が好きです and ask a polite question.",
  teach:"好き is a な-adjective, not the English action verb 'like'. In a simple polite preference statement, the thing liked is marked by が: カレーが好きです means I like curry. The question カレーが好きですか asks whether someone likes curry; the same sentence without か makes the statement. を好きます is not a grammatical alternative. If your listener does not know the food, naming it before discussing preference helps the exchange.",
  examples:[["カレーが好きです。","I like curry."],["お茶が好きですか。","Do you like tea?"],["はい、お茶が好きです。","Yes, I like tea."],["日本の料理が好きです。","I like Japanese cuisine."]],
  checks:[
   ["ユナ：カレーが好きです。 What does Yuna express?","She likes curry","She orders curry","She went for curry yesterday","好きです communicates preference; it does not order an item."],
   ["Choose the natural polite statement 'I like tea.'","お茶が好きです。","お茶を好きます。","お茶に来ました。","が marks the liked item; 好き is not a ます verb."],
   ["What does か do in カレーが好きですか。?","Makes the preference a question","Marks the restaurant","Marks a completed action","The final か marks a polite question."],
   ["ケン：日本の料理が好きですか。 Which is a direct affirmative response?","はい、好きです。","いいえ、行きました。","はい、何時からですか。","はい、好きです agrees with a preference question."]
  ],
  recall:["Write 'Do you like curry?' using カレー.","カレーが好きですか。"],
  writing:"Write a four-turn exchange in Japanese with a real or fictional partner: ask about a food, answer, then ask about a different drink. Keep asking separate from ordering."},
 {id:"cf-a1-07-02",title:"Especially and not especially",
  objective:"Differentiate a general preference from a more specific favorite using 特に.",
  teach:"特に（とくに）means 'especially' or 'particularly'. Someone can like a broad category and single out a favorite: 日本の料理が好きです。特にカレーが好きです。 The second statement adds precision without reversing the first. あまり好きではありません expresses that something is not liked very much; it is a softened negative and requires the negative expression, not just あまり好きです. When answering, avoid assuming all dishes in a category are equally liked.",
  examples:[["日本の料理が好きです。","I like Japanese cooking."],["特にカレーが好きです。","I especially like curry."],["魚はあまり好きではありません。","I do not like fish very much."],["お茶も好きです。","I like tea too."]],
  checks:[
   ["ミナ：特にカレーが好きです。 Which meaning fits 特に?","Especially","Yesterday","By train","特に highlights a particular favorite."],
   ["Which expresses a mild negative preference for fish?","魚はあまり好きではありません。","魚はあまり好きです。","魚に行きました。","あまり works here with the negative 好きではありません."],
   ["ミナ：日本の料理が好きです。特にカレーが好きです。 Which is supported?","Curry is her special favorite within Japanese food","She dislikes all Japanese food","She ordered curry already","The second preference narrows the first without describing an order."],
   ["What does お茶も好きです indicate?","Tea is also liked","Tea is the only liked item","Tea was consumed yesterday","も adds another shared or additional preference."]
  ],
  recall:["Write 'I especially like curry' using 特に.","特にカレーが好きです。"],
  writing:"Write an original four-sentence preference profile. Include a broad preference, one particular favorite, another item you also like, and something you do not like very much. Treat these as opinions, not facts about a whole culture."},
 {id:"cf-a1-07-03",title:"I like that too",
  objective:"Agree with a classmate using も and distinguish another person's preference from your own.",
  teach:"In the existing first-meeting work, 私も meant 'me too'. It works with preferences: ケン：カレーが好きです。ミナ：私も好きです。 The second speaker shares the preference; it does not mean that the first speaker likes Mina. も may replace は to mark the additional person, while が still connects the preferred item with 好き. A considerate conversation can recognize a different preference without claiming agreement: そうですか。私はお茶が好きです.",
  examples:[["ケン：カレーが好きです。","Ken: I like curry."],["ミナ：私もカレーが好きです。","Mina: I like curry too."],["アリ：お茶が好きです。","Ali: I like tea."],["レナ：そうですか。私は水が好きです。","Lena: I see. I like water."]],
  checks:[
   ["ケン：カレーが好きです。ミナ：私も好きです。 What can we conclude?","Both like curry","Only Ken likes curry","Mina asked Ken to buy curry","私も means the second person shares the preference."],
   ["Which reply explicitly agrees with お茶が好きです?","私もお茶が好きです。","私はお茶に行きます。","私はお茶を好きます。","私も carries shared preference with grammatically correct が好き."],
   ["Ali likes tea, Lena likes water. Which reply avoids falsely claiming agreement?","そうですか。私は水が好きです。","私もお茶が好きです。","お茶をください。","Acknowledge the other speaker, then state the different preference."],
   ["In 私もカレーが好きです, what does も emphasize?","The speaker shares a preference","The curry is a destination","The action happened in the past","も relates the second speaker to the earlier statement."]
  ],
  recall:["Write 'I also like curry' beginning with 私.","私もカレーが好きです。"],
  writing:"Write a six-turn dialogue among three people where two share one preference and a third politely states a different preference. Use も only where agreement is true."},
 {id:"cf-a1-07-04",title:"Read three short food profiles",
  objective:"Track individual preferences and shared favorites across a connected Japanese text.",
  teach:"Read the full original notice rather than selecting from a single isolated sentence. ミナ：日本の料理が好きです。特にカレーが好きです。ケン：私もカレーが好きです。でも、魚はあまり好きではありません。ユナ：カレーも好きです。お茶も好きです。 Here でも means 'but' and connects Ken's contrasting comment. Every speaker likes curry, but only Ken explicitly says he does not like fish very much; the text does not state Mina's opinion of fish. Do not manufacture facts that a passage never mentions.",
  examples:[["ミナ：特にカレーが好きです。","Mina especially likes curry."],["ケン：私もカレーが好きです。","Ken likes curry too."],["ケン：でも、魚はあまり好きではありません。","Ken does not particularly like fish."],["ユナ：お茶も好きです。","Yuna also likes tea."]],
  checks:[
   ["How many speakers explicitly say they like curry in the notice?","Three","One","Two","Mina, Ken and Yuna each say they like curry."],
   ["Who explicitly says they do not like fish very much?","Ken","Mina","Yuna","Only Ken's line contains 魚はあまり好きではありません."],
   ["What do we know about Mina's opinion of fish?","The notice does not say","She dislikes it","It is her favorite","Do not infer someone's view from another speaker's statement."],
   ["Which item does Yuna mention in addition to curry?","Tea","Train tickets","Coffee","ユナ says お茶も好きです."]
  ],
  recall:["Write 'I don't like fish very much' using 魚.","魚はあまり好きではありません。"],
  writing:"Invent three short lunch-preference profiles with a shared favorite and one contrast. Then add a one-sentence Japanese summary grounded only in the statements you wrote."},
 {id:"cf-a1-07-05",title:"Choose together without ordering",
  objective:"Ask two preference questions and negotiate a shared meal idea without confusing 好き with をください.",
  teach:"When two people are choosing a place to eat, first ask about preference: カレーが好きですか。はい、好きです。私も好きです。これは a conversation about liking curry, not an order to a server. To request food at a counter, the different expression カレーをください can be used, but it should not replace が好きです in a preference question. The distinction matters when transferring skills from a classroom chat to a cafe. You can end with a simple suggestion or acknowledgment without claiming to have already ordered anything.",
  examples:[["カレーが好きですか。","Do you like curry?"],["はい、好きです。","Yes, I like it."],["私もカレーが好きです。","I also like curry."],["カレーをください。","Curry, please (an order/request)."]],
  checks:[
   ["A classmate asks what food you like. Which sentence answers with a preference?","カレーが好きです。","カレーをください。","昨日、カレーを食べました。","が好きです expresses a preference; をください requests an item."],
   ["A server is ready to take an order. Which is a request for curry?","カレーをください。","カレーが好きですか。","私もカレーが好きです。","をください requests the item instead of asking about a preference."],
   ["ケン：カレーが好きですか。ミナ：はい、好きです。 Which is a natural agreeing follow-up?","私も好きです。","私を好きです。","昨日、学校です。","私も好きです states a shared opinion."],
   ["Which conclusion is unjustified after 2 people say カレーが好きです?","They already bought curry","They both like curry","Curry is their shared preference","A preference conversation does not establish an actual purchase."]
  ],
  recall:["Write a polite question 'Do you like tea?' using お茶.","お茶が好きですか。"],
  writing:"Draft a realistic five-turn lunch-planning chat: ask about two foods, respond with a preference or contrast, find one shared option, then close. Write a separate one-line order only if the participants actually enter a cafe."},
 {id:"cf-a1-07-06",title:"Independent food preference conversation",
  scene:"preferences",objective:"Comprehend the original Ken–Mina food discussion, identify shared favorites and complete the original E02 delayed transfer checks."}
 ]};
