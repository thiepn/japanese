import {E03_SCENES,type E03Scene} from "./a2ExcellenceScenes";
import {E04_SCENES,type E04Scene} from "./a2ExcellenceAdvancedScenes";
import {E03_UNMAPPED_SCENES} from "./a2ExcellenceCourse";
import {E04_UNMAPPED} from "./a2ExcellenceAdvancedCourse";

/**
 * E20 is a SOURCE-ONLY learner workshop. It uses existing, app-authored E03/E04
 * material which cannot currently receive an admissible canonical Can-do link.
 * It never manufactures a StudyPrompt, StudyEvent, grade, review or scheduler.
 * The existing E03/E04 reading-only previews retain their original IDs.
 */
export type E20Cohort="e03"|"e04";
export type E20Stage="listen"|"read"|"respond"|"compose"|"follow-up";
export const E20_STAGES:readonly {id:E20Stage;title:string;description:string}[]=[
 {id:"listen",title:"Listen",description:"Hear the original dialogue using device speech synthesis if available, then compare the source's gist and detail."},
 {id:"read",title:"Read",description:"Interpret an original Japanese text, then compare what it actually supports."},
 {id:"respond",title:"Respond",description:"Make an appropriate reply, then recall an exact original model before revealing it."},
 {id:"compose",title:"Compose",description:"Write your own message, revise it after source reflection and compare changes without grading."},
 {id:"follow-up",title:"Follow-up",description:"Transfer your attention to the original second situation: another speaker, changed constraints, source-only listening and connected reading, then an independent message."}
];
export interface E20Question{
 id:string;kind:"gist"|"detail"|"reply";prompt:string;
 choices:readonly string[];reference:string;sourceExplanation:string;
}
export interface E20FollowUp{
 audio:string;reading:string;
 listen:E20Question;read:E20Question;
}
export interface E20Scene{
 key:string;cohort:E20Cohort;sceneId:string;title:string;setting:string;goal:string;
 dialogue:readonly {speaker:string;ja:string;en:string;intention:string}[];
 originalJapaneseDialogue:string;
 reading:{title:string;ja:string;en:string};
 sourceNotice:string;sourceNotes:readonly {expression:string;note:string}[];
 listenQuestions:readonly [E20Question,E20Question];
 readQuestions:readonly [E20Question,E20Question];
 reply:E20Question;model:{question:string;references:readonly string[];sourceExplanation:string};
 writingTask:string;speakingTask:string;sourceWritingChecks:readonly string[];
 followUp:E20FollowUp;
}
function choices(reference:string,foils:readonly string[]):string[]{
 const options=[reference,...foils];
 if(new Set(options).size!==options.length||options.some(x=>!x.trim()))
  throw Error("E20_UNVERIFIED_SOURCE_OPTIONS");
 return options;
}
function question(key:string,kind:E20Question["kind"],prompt:string,reference:string,
 foils:readonly string[],sourceExplanation:string):E20Question{
 if(!prompt.trim()||!reference.trim()||!sourceExplanation.trim())
  throw Error("E20_ORIGINAL_QUESTION_INCOMPLETE:"+key);
 return {id:key,kind,prompt,choices:choices(reference,foils),
  reference,sourceExplanation};
}
function e03(s:E03Scene):E20Scene{
 const key="e03:"+s.id;
 const dialogue=s.dialogue.map(t=>({speaker:t.speaker,ja:t.ja,en:t.en,intention:""}));
 const originalJapaneseDialogue=dialogue.map(t=>t.speaker+"： "+t.ja).join("\n");
 return {
  key,cohort:"e03",sceneId:s.id,title:s.title,setting:s.setting,goal:s.objective,
  dialogue,originalJapaneseDialogue,
  reading:{title:"Original connected reading",ja:s.read.ja,en:s.read.en},
  sourceNotice:s.notice,sourceNotes:s.vocabulary.map(v=>({expression:v.ja,note:v.en})),
  listenQuestions:[
   question(key+":listen:gist","gist","What is the main point of the original conversation?",
    s.listen.gist,s.listen.gistFoils,s.listen.feedback),
   question(key+":listen:detail","detail",s.listen.detailQuestion,
    s.listen.detailAnswer,s.listen.detailFoils,s.listen.feedback)
  ],
  readQuestions:[
   question(key+":read:gist","gist","What does this original written source establish?",
    s.read.gist,s.read.gistFoils,s.read.feedback),
   question(key+":read:detail","detail",s.read.detailQuestion,
    s.read.detailAnswer,s.read.detailFoils,s.read.feedback)
  ],
  reply:question(key+":reply","reply",s.respond.question,s.respond.answer,s.respond.foils,s.respond.feedback),
  model:{question:s.recall.question,references:s.recall.answers,sourceExplanation:s.recall.feedback},
  writingTask:s.writing,speakingTask:s.speaking,
  followUp:{
   audio:s.transfer.audio,reading:s.transfer.reading,
   listen:question(key+":follow-up:listen","detail",s.transfer.question,s.transfer.answer,
    s.transfer.foils,s.transfer.feedback),
   read:question(key+":follow-up:read","detail",s.transfer.readingQuestion,
    s.transfer.readingAnswer,s.transfer.readingFoils,
    "Compare this reference to the original follow-up written source above; a response is not a graded reading assessment.")
  },
  sourceWritingChecks:[
   "Does your reply actually accomplish the original communicative objective: "+s.objective,
   "Does it keep the time, people, place and conditions consistent with the original dialogue and written passage?",
   "Does the chosen expression suit the relationship and communicative purpose explained by the source notice?"
  ]
 };
}
function e04(s:E04Scene):E20Scene{
 const key="e04:"+s.id;
 const dialogue=s.turns.map(t=>({speaker:t.who,ja:t.ja,en:t.en,intention:t.intention}));
 const originalJapaneseDialogue=dialogue.map(t=>t.speaker+"： "+t.ja).join("\n");
 return {
  key,cohort:"e04",sceneId:s.id,title:s.title,setting:s.setting,goal:s.goal,
  dialogue,originalJapaneseDialogue,
  reading:{title:s.reading.title,ja:s.reading.ja,en:s.reading.en},
  sourceNotice:s.focus.map(f=>f.expression+" — "+f.meaning+" · Common confusion: "+f.trap).join("\n"),
  sourceNotes:s.focus.map(f=>({expression:f.expression,note:f.meaning+" · Pitfall: "+f.trap})),
  listenQuestions:[
   question(key+":listen:gist","gist","What is the main situation in this original dialogue?",
    s.listening.gist,s.listening.foils,s.listening.correction),
   question(key+":listen:detail","detail",s.listening.detailQuestion,
    s.listening.detailAnswer,s.listening.detailFoils,s.listening.correction)
  ],
  readQuestions:[
   question(key+":read:gist","gist","What is the main meaning of this original practical notice?",
    s.comprehension.gist,s.comprehension.foils,s.comprehension.correction),
   question(key+":read:detail","detail",s.comprehension.detailQuestion,
    s.comprehension.detailAnswer,s.comprehension.detailFoils,s.comprehension.correction)
  ],
  reply:question(key+":reply","reply",s.response.question,s.response.answer,s.response.foils,s.response.correction),
  model:{question:s.recall.question,references:s.recall.answers,sourceExplanation:s.recall.correction},
  writingTask:s.writing.prompt,speakingTask:s.speaking.prompt,
  followUp:{
   audio:s.transfer.audio,reading:s.transfer.reading,
   listen:question(key+":follow-up:listen","detail",s.transfer.question,s.transfer.answer,
    s.transfer.foils,s.transfer.correction),
   read:question(key+":follow-up:read","detail",s.transfer.readingQuestion,
    s.transfer.readingAnswer,s.transfer.readingFoils,s.transfer.correction)
  },
  sourceWritingChecks:[
   "Does your message accomplish the original practical goal: "+s.goal,
   "Does it distinguish confirmed facts from assumptions in the original dialogue and practical notice?",
   "Does it respect the original social intention and avoid the language pitfalls described in the source notes?",
   ...s.writing.selfChecks.map(term=>"Review the source expression "+term+" in context; including it does not establish correctness.")
  ]
 };
}
const e03Unlinked=new Set(E03_UNMAPPED_SCENES.map(s=>s.id));
const e04Unlinked=new Set(E04_UNMAPPED.map(s=>s.id));
const E20_SOURCES:readonly E20Scene[]=[
 ...E03_SCENES.filter(s=>e03Unlinked.has(s.id)).map(e03),
 ...E04_SCENES.filter(s=>e04Unlinked.has(s.id)).map(e04)
];
export function getE20SourceOnlyScenes():readonly E20Scene[]{return E20_SOURCES;}
export function getE20SourceOnlyScene(key:string):E20Scene|null{return E20_SOURCES.find(s=>s.key===key)??null;}
/** Just compare the actual literal text; no inference about Japanese correctness. */
export function compareE20WrittenDrafts(first:string,revised:string){
 const a=first.trim(),b=revised.trim();
 const before=[...a],after=[...b];
 let prefix=0;while(prefix<before.length&&prefix<after.length&&before[prefix]===after[prefix])prefix++;
 let suffix=0;while(suffix<before.length-prefix&&suffix<after.length-prefix&&
  before[before.length-1-suffix]===after[after.length-1-suffix])suffix++;
 return {changed:a!==b,beforeChange:before.slice(prefix,before.length-suffix).join(""),
  afterChange:after.slice(prefix,after.length-suffix).join("")};
}

/** An explicit, local-only copy of learner text from the original ungraded
 * workshop. It cannot include source passages or write study/scheduler data.
 */
export interface E20WritingCopyInput{
 key:string;workingFirst:string;keptFirst:string;revision:string;followUp:string;
}
export function buildE20WritingCopy(input:E20WritingCopyInput):{filename:string;content:string}|null{
 const scene=getE20SourceOnlyScene(input.key);
 if(!scene)return null;
 const sections=[
  ["First message currently in the editor",input.workingFirst],
  ["First draft kept for revision",input.keptFirst],
  ["Second Japanese message",input.revision],
  ["Changed-context Japanese follow-up",input.followUp]
 ].filter((entry)=>entry[1].trim().length>0);
 if(!sections.length)return null;
 return {
  filename:"thiepn-japanese-"+scene.cohort+"-"+scene.sceneId.replace(/[^a-z0-9_-]/gi,"-")+"-writing.txt",
  content:[
   "THIEPN Japanese — personal writing copy",
   "Original THIEPN source-only situation: "+scene.title+" ("+scene.key+")",
   "Only learner-entered text is included; no source dialogues or readings are copied.",
   "Ungraded practice. No Can-do certification, StudyEvent, FSRS memory or cloud sync.",
   ...sections.map(([label,value])=>label+"\n"+value)
  ].join("\n\n")+"\n"
 };
}
