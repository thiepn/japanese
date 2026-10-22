import type {CourseFirstUnit} from "./courseAuthoring";

/** Original Unit 15 teaching; the canonical E02 family scene retains its own IDs. */
export const C5_A1_FAMILY:CourseFirstUnit={
 id:"a1-unit-15",title:"Family photographs and introductions",
 objective:"Identify close relatives, introduce someone in a photograph, read a family profile, and distinguish your own family terms from polite references to someone else's.",
 lessons:[
 {id:"cf-a1-15-01",title:"Whose family member?",
  objective:"Connect a person to a family relationship using A の B and respond to だれですか.",
  teach:"The particle の connects a person and their relationship: 私の兄です means 'This is my older brother'. Ask about a person in a photograph with この人はだれですか ('Who is this person?'). A の B does not mean that someone is travelling toward the person, and を does not mark possession. You can omit an obvious subject when pointing at a photograph; 私の兄です answers the question completely. Make sure you are talking about the pictured person, not the photographer.",
  examples:[["この人はだれですか。","Who is this person?"],["私の兄です。","This is my older brother."],["こちらは私の母です。","This is my mother."],["私の家族です。","This is my family."]],
  checks:[
   ["ケン：この人はだれですか。 What information does Ken request?","The person's identity","The time of a train","The price of the photograph","だれ asks who someone is."],
   ["ミナ：私の兄です。 Who is pictured?","Mina's older brother","Mina's older sister","Mina's teacher","兄 means one's own older brother when discussing family."],
   ["Choose the expression for 'my older brother'.","私の兄","私を兄","私に兄","の links the speaker to the family member."],
   ["Which directly answers この人はだれですか about your mother?","私の母です。","七時からです。","お茶が好きです。","The question asks for the person's relationship, not a time or food preference."]
  ],
  recall:["Write 'This is my older brother' using 私 and 兄.","私の兄です。"],
  writing:"Write four original lines for a fictional family photo: one identification question, a reply naming the relationship, one fact about the person, and an acknowledgment. Do not use real people's private details without their permission."},
 {id:"cf-a1-15-02",title:"My mother, your mother",
  objective:"Recognize family-reference politeness when speaking about your family versus another person's.",
  teach:"Japanese family words change with conversational perspective. When talking to someone outside your family, 母（はは）normally means 'my mother', while お母さん（おかあさん）is a polite way to refer to someone else's mother or to address your own mother. Similarly 兄（あに）usually refers to your own older brother, while お兄さん（おにいさん）can refer politely to someone else's older brother. Do not mechanically attach お to every relative; the relationship and speaking situation matter. In some families usage differs, but these forms are a useful standard for polite introductions.",
  examples:[["私の母は先生です。","My mother is a teacher."],["ミナさんのお母さんは先生ですか。","Is Mina's mother a teacher?"],["私の兄は大学生です。","My older brother is a university student."],["ケンさんのお兄さんは大学生ですか。","Is Ken's older brother a university student?"]],
  checks:[
   ["Talking politely to a new classmate about YOUR mother: choose the standard reference.","母","お母さん","お兄さん","母 is a standard humble/in-group reference to your own mother when talking to outsiders."],
   ["Asking about Mina's mother: which respectful term fits?","お母さん","母","兄","お母さん is appropriate when referring politely to another person's mother."],
   ["Which is a polite reference to another person's older brother?","お兄さん","兄","母","お兄さん is used respectfully when discussing someone else's older brother."],
   ["ミナさんのお母さんは先生ですか。 Whose job is being asked about?","Mina's mother","The speaker's brother","Ken's father","さん and の connect Mina with her mother; 先生 refers to her occupation."]
  ],
  recall:["Write 'my mother is a teacher' using 母 and 先生.","私の母は先生です。"],
  writing:"Write a two-person exchange: introduce your own mother or brother with the appropriate form, then politely ask about the other person's relative. Use fictional facts rather than identifying real relatives."},
 {id:"cf-a1-15-03",title:"One photograph, two facts",
  objective:"Describe a relative with noun + です and a separate activity or preference statement.",
  teach:"A natural introduction moves from identification to one fact: この人は私の兄です。兄は大学生です. First の marks the relationship, then は marks the person you are describing. You can add a familiar fact from earlier lessons: 兄は日本語を勉強します or 母はお茶が好きです. These sentences report separate facts: being a university student does not imply studying Japanese, and liking tea does not imply ordering it now. Use only facts the speaker actually supplies.",
  examples:[["この人は私の兄です。","This person is my older brother."],["兄は大学生です。","My older brother is a university student."],["母はお茶が好きです。","My mother likes tea."],["弟は日本語を勉強します。","My younger brother studies Japanese."]],
  checks:[
   ["ミナ：この人は私の兄です。兄は大学生です。 What can we conclude?","Her older brother is a university student","Her father is a teacher","Her younger brother works at a café","兄 is the subject of the second sentence and 大学生 is university student."],
   ["Which sentence expresses a preference of the speaker's mother?","母はお茶が好きです。","母はお茶をください。","母はお茶に行きました。","が好きです expresses liking an item; をください is a request."],
   ["弟は日本語を勉強します。 What is the activity?","Studying Japanese","Buying Japanese books","Leaving for Japan","勉強します is study; 弟 refers to one's younger brother."],
   ["After 私の兄です, which line adds the brother's role rather than introducing someone else?","兄は大学生です。","妹は大学生です。","父は先生です。","The same relative 兄 remains the topic."]
  ],
  recall:["Write 'my older brother is a university student' using 兄.","兄は大学生です。"],
  writing:"Create a four-sentence family-photo description of two fictional relatives: introduce both, state one supported occupation or study fact for each, and make their details different. Add no imaginary nationality or age unless the story explicitly provides it."},
 {id:"cf-a1-15-04",title:"Read a family introduction",
  objective:"Extract relationships and occupations from an original multi-person profile without inventing missing facts.",
  teach:"Read this short original postcard: 『はじめまして。私はユナです。これは私の家族の写真です。こちらは私の母です。母は先生です。こちらは弟です。弟は高校生です。弟は毎朝日本語を勉強します。』 The text explicitly identifies Yuna, her mother who is a teacher, and her younger brother who is a high-school student and studies Japanese each morning. 高校生（こうこうせい）means high-school student. The text does NOT state where they live or how old they are. Read the relation noun before attaching a fact to a family member.",
  examples:[["こちらは私の母です。","This is my mother."],["母は先生です。","My mother is a teacher."],["こちらは弟です。","This is my younger brother."],["弟は毎朝日本語を勉強します。","My younger brother studies Japanese every morning."]],
  checks:[
   ["ユナの母は何をしていますか。","先生","高校生","大学生","The postcard explicitly says 母は先生です."],
   ["Which relative is a high-school student?","Yuna's younger brother","Yuna's mother","Yuna's older sister","弟は高校生です identifies her younger brother."],
   ["How often does the younger brother study Japanese?","Every morning","Every Sunday","Only yesterday","毎朝 means every morning."],
   ["Where does Yuna's family live according to the postcard?","The postcard does not say","Kyoto","Tokyo","The text provides no residence; do not infer it from the Japanese language."]
  ],
  recall:["Write 'My younger brother studies Japanese every morning' using 弟.","弟は毎朝日本語を勉強します。"],
  writing:"Draft a 5–6 sentence original family introduction for a fictional student. Give two family relationships and two distinct facts. Add one short comprehension question whose answer is explicitly supported by your own passage."},
 {id:"cf-a1-15-05",title:"Introduce politely and ask back",
  objective:"Complete a respectful family introduction with an appropriate follow-up question and acknowledgment.",
  teach:"When a friend shows a photo, this is a useful sequence: この人はだれですか → 私の兄です → お兄さんは学生ですか → はい、大学生です → そうですか. The person introducing their own brother says 兄, while the listener politely asks about お兄さん. This shift depends on whose relative is being discussed. A short acknowledgment そうですか means 'I see'; it does not confirm that you already knew the answer. You may choose a fictional person rather than disclose private family details.",
  examples:[["この人はだれですか。","Who is this person?"],["私の兄です。","This is my older brother."],["お兄さんは学生ですか。","Is your older brother a student?"],["はい、大学生です。そうですか。","Yes, a university student. I see (separate turns)."]],
  checks:[
   ["A classmate says 私の兄です. Which polite follow-up asks about his studies?","お兄さんは学生ですか。","兄はお茶をください。","母は先生です。","For someone else's older brother, お兄さん is the polite reference."],
   ["Someone says 兄は大学生です. What does そうですか acknowledge?","New information about the brother","A request for food","A corrected train schedule","そうですか is an acknowledgment of what was just learned."],
   ["Which two-turn answer naturally follows この人はだれですか?","私の兄です。兄は学生です。","九時からです。十時までです。","カレーをください。お茶をください。","Both sentences identify and describe the pictured person."],
   ["Which conclusion is NOT warranted by a photo introduction of 兄?","He lives in Tokyo","He is the speaker's older brother","The person is a relative","No residence is given by the relationship phrase alone."]
  ],
  recall:["Write a polite question 'Is your older brother a student?' using お兄さん.","お兄さんは学生ですか。"],
  writing:"Create a six-turn introduction between two students about a fictional relative. Include an identification question, relationship, polite question about that relative, answer, acknowledgment, and return question. Keep the conversation self-consistent."},
 {id:"cf-a1-15-06",title:"Original family-photo conversation",
  scene:"family",objective:"Understand Mina's original family photograph dialogue and complete its source-linked E02 review and changed-context checks."}
 ]};
