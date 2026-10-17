import {
  deletePrivateDocument,listPrivateDocuments,savePrivateDocument,
  type PrivateDocumentRecord,
} from "@thiepn/local-db";
import type { E06CaseProgress } from "./e06IndependentCourse";
import { coreContent } from "../coreContent";
import { availableE16Dialogues, buildE16OriginalConversation } from "./e16DialogueRehearsal";
import { E11_BY_CASE } from "./e11PracticalTransfer";

/**
 * E17 is an owner-private listening notebook for EXACT original E11 dialogue
 * turns. Its rows live in the existing private_documents IndexedDB store, so
 * the original owner-locked local backup/export and restore already cover them.
 * No new grading, StudyEvent, FSRS record, remote upload, or store is created.
 */
const PREFIX="e17-original-listening-note:";
export const E17_NOTE_MAX_CHARACTERS=3600;

export interface E17OriginalListeningNote {
  readonly caseId:string;
  readonly turnIndex:number;
  readonly speaker:string;
  readonly originalJapanese:string;
  readonly contentVersion:string;
  readonly text:string;
  readonly savedAt:string;
}
export interface E17ListeningQuestion {
  readonly question:string;
  readonly answer:string;
  readonly misconceptionExplanations:readonly string[];
}

function requireSource(caseId:string,turnIndex:number,cases:readonly E06CaseProgress[]){
  if(!Number.isInteger(turnIndex)||turnIndex<0)
    throw Error("E17_INVALID_ORIGINAL_TURN");
  const dialogue=buildE16OriginalConversation(caseId,cases);
  const turn=dialogue.turns[turnIndex];
  if(!turn)throw Error("E17_INVALID_ORIGINAL_TURN");
  return {dialogue,turn};
}

function docId(caseId:string,turnIndex:number):string{
  return PREFIX+encodeURIComponent(caseId)+":"+turnIndex+":"+
    encodeURIComponent(coreContent.version);
}
function sourceLabel(caseId:string,turnIndex:number):string{
  return "thiepn-original:e11:"+caseId+":turn:"+turnIndex+":version:"+coreContent.version;
}
function validateNoteRecord(
  row:PrivateDocumentRecord,accountId:string,caseId:string,turnIndex:number,
):E17OriginalListeningNote|null{
  const source=E11_BY_CASE.get(caseId),turn=source?.turns[turnIndex];
  if(!turn||row.id!==docId(caseId,turnIndex)||row.accountId!==accountId||
    row.sourceKind!=="paste"||row.sourceLabel!==sourceLabel(caseId,turnIndex)||
    typeof row.text!=="string"||!row.text.trim()||row.text.length>E17_NOTE_MAX_CHARACTERS||
    !Number.isFinite(Date.parse(row.updatedAt)))return null;
  return {
    caseId,turnIndex,speaker:turn.speaker,originalJapanese:turn.ja,
    contentVersion:coreContent.version,text:row.text,savedAt:row.updatedAt,
  };
}
function assertOwner(accountId:string,allowed:()=>boolean):void{
  if(!accountId||!allowed())throw Error("E17_WORKSPACE_CHANGED");
}

export async function listE17ListeningNotes(
  accountId:string,caseId:string,cases:readonly E06CaseProgress[],
  allowed:()=>boolean=()=>true,
):Promise<E17OriginalListeningNote[]>{
  assertOwner(accountId,allowed);
  const {dialogue}=requireSource(caseId,0,cases);
  const originalRows=await listPrivateDocuments(accountId);
  assertOwner(accountId,allowed);
  return dialogue.turns.flatMap(turn=>{
    const found=originalRows.find(row=>row.id===docId(caseId,turn.sourceTurnIndex));
    if(!found)return [];
    const validated=validateNoteRecord(found,accountId,caseId,turn.sourceTurnIndex);
    return validated?[validated]:[];
  });
}

export async function saveE17ListeningNote(
  accountId:string,caseId:string,turnIndex:number,text:string,
  cases:readonly E06CaseProgress[],allowed:()=>boolean=()=>true,
):Promise<E17OriginalListeningNote>{
  assertOwner(accountId,allowed);
  const {dialogue,turn}=requireSource(caseId,turnIndex,cases);
  if(typeof text!=="string"||!text.trim()||text.length>E17_NOTE_MAX_CHARACTERS)
    throw Error("E17_NOTE_CONTENT_INVALID");
  const existing=await listPrivateDocuments(accountId);
  assertOwner(accountId,allowed);
  const id=docId(caseId,turnIndex);
  const conflicting=existing.find(row=>row.id===id);
  if(conflicting&&!validateNoteRecord(conflicting,accountId,caseId,turnIndex))
    throw Error("E17_EXISTING_SOURCE_NOTE_INVALID");
  const now=new Date().toISOString();
  await savePrivateDocument(accountId,{
    id,accountId,
    title:"E17 listening notebook · "+dialogue.caseTitle+" · "+(turnIndex+1)+
      "/"+dialogue.turns.length+" · "+turn.speaker,
    sourceKind:"paste",sourceLabel:sourceLabel(caseId,turnIndex),
    text,importedAt:conflicting?.importedAt??now,updatedAt:now,
  });
  // Switching owners never writes into the new owner's DB: accountId remains
  // pinned to the starting owner through the awaited original store method.
  assertOwner(accountId,allowed);
  return {
    caseId,turnIndex,speaker:turn.speaker,originalJapanese:turn.japanese,
    contentVersion:coreContent.version,text,savedAt:now,
  };
}

export async function deleteE17ListeningNote(
  accountId:string,caseId:string,turnIndex:number,
  cases:readonly E06CaseProgress[],allowed:()=>boolean=()=>true,
):Promise<void>{
  assertOwner(accountId,allowed);
  requireSource(caseId,turnIndex,cases);
  const existing=await listPrivateDocuments(accountId);
  assertOwner(accountId,allowed);
  const row=existing.find(item=>item.id===docId(caseId,turnIndex));
  if(!row)return;
  if(!validateNoteRecord(row,accountId,caseId,turnIndex))
    throw Error("E17_EXISTING_SOURCE_NOTE_INVALID");
  await deletePrivateDocument(accountId,row.id);
  assertOwner(accountId,allowed);
}

/** Text and explanations come unchanged from the existing E11 transfer case. */
export function getE17OriginalListeningQuestion(
  caseId:string,cases:readonly E06CaseProgress[],
):E17ListeningQuestion{
  requireSource(caseId,0,cases);
  const source=E11_BY_CASE.get(caseId)!;
  if(source.listening.wrongWhy.length!==2||source.listening.wrong.length!==2)
    throw Error("E17_ORIGINAL_LISTENING_SOURCE_MISSING");
  return {
    question:source.listening.question,
    answer:source.listening.answer,
    misconceptionExplanations:source.listening.wrongWhy.map((reason,index)=>
      source.listening.wrong[index]+" — "+reason),
  };
}
