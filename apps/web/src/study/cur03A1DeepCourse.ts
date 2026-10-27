import {coreContent,canDoDescriptor,courseUnit} from "../coreContent";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {courseUnitSession} from "./grammarCourse";

/** New original teaching around canonical grammar anchors, not a fork of the independent CF-A1 PR #103. */
type Check=readonly [question:string,answer:string,foilA:string,foilB:string,feedback:string,foilANote:string,foilBNote:string];
type Case=Readonly<{anchor:string;title:string;situation:string;why:string;contrast:string;
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
  independent:"Describe where one person or animal and one inanimate object are located, choosing います and あります deliberately."}
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
 return CASES.filter(c=>unit.grammarIds.includes(c.anchor)).map(c=>c.anchor);
}
/** The original course prompts are passed through unchanged: no duplicate canonical IDs or FSRS engine. */
export function buildCur03CourseUnitSession(unitId:string):StudyStep[]{
 const base=courseUnitSession(unitId);
 const unit=requireSourceUnit(unitId);
 if(!unit)return base;
 const situations=CASES.filter(c=>unit.grammarIds.includes(c.anchor));
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
