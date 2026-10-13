/** P59: original independent A2 performance scenarios. No account, grade or progress authority. */
export type P59SourceLine=readonly [speaker:string,japanese:string,german:string];
export type P59QuestionKind="chronology"|"evidence"|"status"|"inference"|"speaker"|"intent";
export type P59QuestionRaw=readonly [
 kind:P59QuestionKind,question:string,model:string,alternative:string,misleading:string,
 explanation:string,sourceQuote:string,dialogueQuote:string
];
export type P59TaskRaw=readonly [
 situation:string,model:string,alternative:string,misleading:string,explanation:string
];
export type P59ReplyRaw=readonly [
 incomingSpeaker:string,incomingJapanese:string,incomingGerman:string,
 newGoal:string,model:string,alternative:string,misleading:string,explanation:string
];
export type P59RevisionRaw=readonly [
 flawed:string,goal:string,model:string,alternative:string,explanation:string
];
export interface P59RawMission{
 id:string;title:string;unit:string;genre:string;register:"casual"|"polite"|"service";
 situation:string;goal:string;source:readonly [P59SourceLine,P59SourceLine,P59SourceLine];
 messages:readonly [P59SourceLine,P59SourceLine];
 dialogue:readonly [P59SourceLine,P59SourceLine,P59SourceLine,P59SourceLine];
 questions:readonly [P59QuestionRaw,P59QuestionRaw,P59QuestionRaw];
 strategy:P59TaskRaw;write:P59TaskRaw;reply:P59ReplyRaw;revision:P59RevisionRaw;
 returnCue:P59TaskRaw;contrast:string;words:readonly string[];
}
export interface P59Line{speaker:string;japanese:string;german:string}
export interface P59Question{
 id:string;kind:P59QuestionKind;question:string;model:string;alternative:string;
 misleading:string;explanation:string;sourceQuote:string;dialogueQuote:string
}
export interface P59Task{
 situation:string;model:string;alternative:string;misleading:string;explanation:string
}
export interface P59Reply{
 incomingSpeaker:string;incomingJapanese:string;incomingGerman:string;newGoal:string;
 model:string;alternative:string;misleading:string;explanation:string
}
export interface P59Revision{
 flawed:string;goal:string;model:string;alternative:string;explanation:string
}
export interface P59Mission{
 id:string;title:string;level:"A2";units:readonly string[];genre:string;
 register:P59RawMission["register"];situation:string;goal:string;
 source:readonly [P59Line,P59Line,P59Line];messages:readonly [P59Line,P59Line];
 dialogue:readonly [P59Line,P59Line,P59Line,P59Line];
 questions:readonly [P59Question,P59Question,P59Question];
 strategy:P59Task;write:P59Task;reply:P59Reply;revision:P59Revision;returnCue:P59Task;
 contrast:string;words:readonly string[];
}
export function authoredP59(raw:P59RawMission):P59Mission{
 const line=([speaker,japanese,german]:P59SourceLine):P59Line=>({speaker,japanese,german});
 const task=([situation,model,alternative,misleading,explanation]:P59TaskRaw):P59Task=>
  ({situation,model,alternative,misleading,explanation});
 const question=(q:P59QuestionRaw,i:number):P59Question=>{
  const [kind,question,model,alternative,misleading,explanation,sourceQuote,dialogueQuote]=q;
  return {id:raw.id+"-q"+(i+1),kind,question,model,alternative,misleading,
   explanation,sourceQuote,dialogueQuote};
 };
 const [incomingSpeaker,incomingJapanese,incomingGerman,newGoal,model,alternative,misleading,explanation]=raw.reply;
 const [flawed,goal,revisionModel,revisionAlternate,revisionWhy]=raw.revision;
 return {id:raw.id,title:raw.title,units:[raw.unit],level:"A2",
  genre:raw.genre,register:raw.register,situation:raw.situation,goal:raw.goal,
  source:raw.source.map(line) as unknown as P59Mission["source"],
  messages:raw.messages.map(line) as unknown as P59Mission["messages"],
  dialogue:raw.dialogue.map(line) as unknown as P59Mission["dialogue"],
  questions:raw.questions.map(question) as unknown as P59Mission["questions"],
  strategy:task(raw.strategy),write:task(raw.write),
  reply:{incomingSpeaker,incomingJapanese,incomingGerman,newGoal,model,alternative,misleading,explanation},
  revision:{flawed,goal,model:revisionModel,alternative:revisionAlternate,explanation:revisionWhy},
  returnCue:task(raw.returnCue),contrast:raw.contrast,words:[...raw.words]};
}
