import {Fragment} from "react";
import type {Lexeme,Sentence} from "@thiepn/content-schema";
import type {StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {conjugateLexeme,type ConjugationForm} from "./conjugation";
import {sentenceFuriganaParts,type FuriganaPart} from "./a1Furigana";

/**
 * F2: A2 display-only ruby. The A2 corpus contains 72 sentences without
 * token-by-token readings, so fallback segmentation uses *only* canonical
 * linked lexeme readings and deterministic conjugations. Unknown and
 * homographic spans remain raw Japanese; no phonetic model is consulted.
 */
const hasKanji=(text:string)=>/[\u3400-\u9fff々]/u.test(text);
const isKana=(text:string)=>/^[\u3040-\u30ffー]+$/u.test(text);
const levels=new Set(["A1","A2"]);
const courseUnits=coreContent.courseUnits.filter((unit)=>levels.has(unit.level));
const approvedIds=new Set(courseUnits.flatMap((unit)=>unit.vocabularyIds));
const a2VocabularyIds=new Set(courseUnits.filter((unit)=>unit.level==="A2").flatMap((unit)=>unit.vocabularyIds));
const a2GrammarIds=new Set(coreContent.grammar.filter((item)=>item.level==="A2").map((item)=>item.id));
const a2SentenceIds=new Set(coreContent.sentences.filter((item)=>item.level==="A2").map((item)=>item.id));
const a2Sentences=new Map(coreContent.sentences.filter((item)=>item.level==="A2").map((item)=>[item.text,item]));
const lexemes=new Map(coreContent.lexemes.map((item)=>[item.id,item]));
const forms:readonly ConjugationForm[]=[
  "polite_nonpast","polite_negative","polite_past","polite_past_negative",
  "plain_negative","plain_past","te_form"
];

function safeReading(item:Lexeme,surface:string):string|undefined{
  const readings=new Set(item.readings
    .filter((entry)=>!entry.restrictedToForms||entry.restrictedToForms.includes(surface))
    .map((entry)=>entry.text).filter(isKana));
  return readings.size===1?[...readings][0]:undefined;
}

interface Candidate {surface:string;reading:string;}
function candidatesFor(ids:Iterable<string>):Candidate[]{
  const readings=new Map<string,string|null>();
  function register(surface:string,reading:string|undefined){
    if(!hasKanji(surface)||!reading||!isKana(reading)||surface===reading)return;
    const prior=readings.get(surface);
    // null permanently disqualifies ambiguous forms even after later entries.
    if(prior===null)return;
    if(prior!==undefined&&prior!==reading){readings.set(surface,null);return;}
    readings.set(surface,reading);
  }
  for(const id of ids){
    if(!approvedIds.has(id))continue;
    const lexeme=lexemes.get(id);
    if(!lexeme)continue;
    for(const surface of new Set([lexeme.canonicalForm,...lexeme.forms.map((form)=>form.text)])){
      register(surface,safeReading(lexeme,surface));
    }
    const reading=safeReading(lexeme,lexeme.canonicalForm);
    if(!reading||!lexeme.inflectionClass)continue;
    const readingLexeme={...lexeme,canonicalForm:reading};
    for(const form of forms){
      const surface=conjugateLexeme(lexeme,form);
      const kana=conjugateLexeme(readingLexeme,form);
      if(surface&&kana)register(surface,kana);
    }
  }
  return [...readings].filter((entry):entry is [string,string]=>entry[1]!==null)
    .map(([surface,reading])=>({surface,reading}))
    .sort((a,b)=>b.surface.length-a.surface.length||a.surface.localeCompare(b.surface,"ja"));
}

const generalCandidates=candidatesFor(approvedIds);

function segment(text:string,candidates:readonly Candidate[]):FuriganaPart[]{
  const parts:FuriganaPart[]=[];
  let cursor=0;
  while(cursor<text.length){
    const candidate=candidates.find((item)=>{
      if(!text.startsWith(item.surface,cursor))return false;
      const after=cursor+item.surface.length;
      // A dictionary substring is not proof of a reading inside another kanji
      // compound: 人 in 人気 is not ひと. Require a word boundary on both
      // kanji edges or a complete known compound matched longest-first.
      if(cursor>0&&hasKanji(text[cursor-1]!)&&hasKanji(item.surface[0]!))return false;
      if(after<text.length&&hasKanji(text[after]!)&&hasKanji(item.surface[item.surface.length-1]!))return false;
      return true;
    });
    if(candidate){
      parts.push({surface:candidate.surface,reading:candidate.reading});
      cursor+=candidate.surface.length;
    }else{
      const start=cursor++;
      while(cursor<text.length&&!candidates.some((item)=>text.startsWith(item.surface,cursor)))cursor++;
      parts.push({surface:text.slice(start,cursor)});
    }
  }
  return parts;
}

export function a2FuriganaParts(text:string):FuriganaPart[]{
  const sentence=a2Sentences.get(text);
  if(sentence){
    const authored=sentenceFuriganaParts(sentence);
    if(authored.some((part)=>Boolean(part.reading)))return authored;
    // Sentence entity references constrain candidates to the words used here.
    const ids=sentence.entityRefs.filter((ref)=>ref.kind==="lexeme").map((ref)=>ref.id);
    return segment(text,candidatesFor(ids));
  }
  return segment(text,generalCandidates);
}

export function hasA2Furigana(text:string):boolean{
  return a2FuriganaParts(text).some((part)=>Boolean(part.reading));
}

/** No question that tests the reading, form or learner production may show hints. */
export function isA2FuriganaStep(step:StudyStep):boolean{
  if("kind" in step){
    if(step.id.startsWith("lesson-sentence-"))return a2SentenceIds.has(step.id.slice("lesson-".length));
    if(step.id.startsWith("lesson-grammar-"))return a2GrammarIds.has(step.id.slice("lesson-".length));
    if(step.id.startsWith("lesson-conjugation-"))return false;
    if(step.id.startsWith("lesson-"))return a2VocabularyIds.has(step.id.slice("lesson-".length));
    return false;
  }
  if(step.id.startsWith("sentence-understand-")){
    return step.primaryTarget.kind==="sentence"&&a2SentenceIds.has(step.primaryTarget.id)&&step.skill==="comprehension";
  }
  if(step.id.startsWith("vocab-meaning-")){
    return step.primaryTarget.kind==="lexeme"&&a2VocabularyIds.has(step.primaryTarget.id)&&step.skill==="meaning_recognition";
  }
  return false;
}

export function A2FuriganaText({text,visible}:{text:string;visible:boolean}){
  if(!visible)return <>{text}</>;
  return <>{a2FuriganaParts(text).map((part,index)=><Fragment key={index}>
    {part.reading?<ruby>{part.surface}<rp>(</rp><rt>{part.reading}</rt><rp>)</rp></ruby>:part.surface}
  </Fragment>)}</>;
}
