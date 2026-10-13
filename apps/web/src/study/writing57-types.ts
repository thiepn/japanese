/** P57 original practical written communication; no learner-data authority. */
export type P57Genre="email"|"chat"|"notice"|"request"|"followup"|"work"|"community";
export type P57QuestionKind="status"|"chronology"|"speaker"|"evidence"|"reason";
export type P57RawMessage=readonly [sender:string,japanese:string,german:string];
export type P57RawQuestion=readonly [kind:P57QuestionKind,question:string,model:string,alternate:string,misleading:string,why:string,evidence:string];
export type P57RawTask=readonly [situation:string,model:string,alternate:string,misleading:string,why:string];
export type P57RawReply=readonly [newMessage:string,newMessageGerman:string,goal:string,model:string,alternate:string,misleading:string,why:string];
export type P57RawRevision=readonly [flawedDraft:string,instruction:string,model:string,alternate:string,why:string];
export interface P57RawThread{
 id:string;title:string;genre:P57Genre;unit:string;setting:string;goal:string;
 messages:readonly P57RawMessage[];questions:readonly P57RawQuestion[];
 compose:P57RawTask;reply:P57RawReply;revision:P57RawRevision;returnCue:P57RawTask;
 words:readonly string[];register:string;contrast:string;
}
export interface P57Message{sender:string;japanese:string;german:string}
export interface P57Question{
 id:string;kind:P57QuestionKind;question:string;model:string;alternate:string;
 misleading:string;why:string;evidence:string;
}
export interface P57Task{
 situation:string;model:string;alternate:string;misleading:string;why:string;
}
export interface P57Reply{
 newMessage:string;newMessageGerman:string;goal:string;model:string;
 alternate:string;misleading:string;why:string;
}
export interface P57Revision{
 flawedDraft:string;instruction:string;model:string;alternate:string;why:string;
}
export interface P57Thread{
 id:string;title:string;level:"A2";genre:P57Genre;units:readonly string[];
 setting:string;goal:string;messages:readonly P57Message[];
 questions:readonly P57Question[];compose:P57Task;reply:P57Reply;
 revision:P57Revision;returnCue:P57Task;words:readonly string[];
 register:string;contrast:string;
}
export function authoredP57(raw:P57RawThread):P57Thread{
 const task=([situation,model,alternate,misleading,why]:P57RawTask):P57Task=>
  ({situation,model,alternate,misleading,why});
 const [newMessage,newMessageGerman,goal,model,alternate,misleading,why]=raw.reply;
 const [flawedDraft,instruction,revisionModel,revisionAlternate,revisionWhy]=raw.revision;
 return {id:raw.id,title:raw.title,level:"A2",genre:raw.genre,units:[raw.unit],
  setting:raw.setting,goal:raw.goal,register:raw.register,contrast:raw.contrast,
  messages:raw.messages.map(([sender,japanese,german])=>({sender,japanese,german})),
  questions:raw.questions.map(([kind,question,model,alternate,misleading,why,evidence],i)=>
   ({id:raw.id+"-q"+(i+1),kind,question,model,alternate,misleading,why,evidence})),
  compose:task(raw.compose),reply:{newMessage,newMessageGerman,goal,model,alternate,misleading,why},
  revision:{flawedDraft,instruction,model:revisionModel,alternate:revisionAlternate,why:revisionWhy},
  returnCue:task(raw.returnCue),words:[...raw.words]};
}
