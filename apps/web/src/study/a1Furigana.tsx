import {Fragment} from "react";
import type {StudyStep} from "@thiepn/study-player";
import type {Lexeme,Sentence,SentenceToken} from "@thiepn/content-schema";
import {coreContent} from "../coreContent";

/**
 * F1: display-only A1 learning hints. Content readings are authoritative; there is no
 * implicit kanji-to-kana conversion and no change to study prompts or mastery records.
 */
export interface FuriganaPart {surface:string;reading?:string;}
const hasKanji=(value:string)=>/[\u3400-\u9fff々]/u.test(value);
const isKana=(value:string)=>/^[\u3040-\u30ffー]+$/u.test(value);
const a1Units=coreContent.courseUnits.filter((unit)=>unit.level==="A1");
const a1LexemeIds=new Set(a1Units.flatMap((unit)=>unit.vocabularyIds));
const a1GrammarIds=new Set(coreContent.grammar.filter((item)=>item.level==="A1").map((item)=>item.id));
const a1SentencesById=new Map(coreContent.sentences.filter((item)=>item.level==="A1").map((item)=>[item.id,item]));
const a1SentencesByText=new Map([...a1SentencesById.values()].map((item)=>[item.text,item]));
const lexemesById=new Map(coreContent.lexemes.map((item)=>[item.id,item]));
const a1Forms=new Map<string,Lexeme>();
const ambiguousA1Forms=new Set<string>();

for(const lexemeId of a1LexemeIds){
  const item=lexemesById.get(lexemeId);
  if(!item)continue;
  for(const form of [item.canonicalForm,...item.forms.map((form)=>form.text)]){
    if(ambiguousA1Forms.has(form))continue;
    const prior=a1Forms.get(form);
    // Once ambiguous, a homograph stays excluded regardless of insertion order.
    if(prior&&knownReading(prior,form)!==knownReading(item,form)){
      ambiguousA1Forms.add(form);
      a1Forms.delete(form);
      continue;
    }
    a1Forms.set(form,item);
  }
}

function knownReading(lexeme:Lexeme,surface:string):string|undefined{
  if(surface!==lexeme.canonicalForm&&!lexeme.forms.some((form)=>form.text===surface))return undefined;
  const candidates=lexeme.readings.filter((reading)=>!reading.restrictedToForms||reading.restrictedToForms.includes(surface));
  const readings=new Set(candidates.map((item)=>item.text));
  return readings.size===1?[...readings][0]:undefined;
}

function tokenReading(token:SentenceToken):string|undefined{
  if(token.reading&&isKana(token.reading))return token.reading;
  if(token.entityRef?.kind==="lexeme"){
    const lexeme=lexemesById.get(token.entityRef.id);
    if(lexeme)return knownReading(lexeme,token.surface);
  }
  return undefined;
}


/**
 * Apply a sentence's author-provided full kana reading only when all literal
 * kana/punctuation anchors align uniquely. This is not a dictionary guess:
 * unmatched, repeated or non-kana reading spans fail closed.
 */
export function sentenceReadingFallback(sentence:Sentence):FuriganaPart[]|null{
  if(!sentence.reading||!hasKanji(sentence.text))return null;
  const pieces=sentence.text.match(/[\u3400-\u9fff々]+|[^\u3400-\u9fff々]+/gu);
  if(!pieces)return null;
  const result:FuriganaPart[]=[];
  let cursor=0;
  for(let i=0;i<pieces.length;i++){
    const surface=pieces[i]!;
    if(!hasKanji(surface)){
      if(!sentence.reading.startsWith(surface,cursor))return null;
      result.push({surface});
      cursor+=surface.length;
      continue;
    }
    const anchor=pieces[i+1];
    const end=anchor===undefined?sentence.reading.length:sentence.reading.indexOf(anchor,cursor);
    if(end<=cursor||end<0)return null;
    // Repeated literal anchors do not reliably locate an earlier kanji span.
    if(anchor!==undefined&&sentence.reading.indexOf(anchor,end+anchor.length)>=0)return null;
    const reading=sentence.reading.slice(cursor,end);
    if(!isKana(reading))return null;
    result.push({surface,reading});
    cursor=end;
  }
  return cursor===sentence.reading.length?result:null;
}

export function sentenceFuriganaParts(sentence:Sentence):FuriganaPart[]{
  if(!sentence.tokens.length)return sentenceReadingFallback(sentence)??[{surface:sentence.text}];
  const parts:FuriganaPart[]=[];
  let cursor=0;
  for(const token of sentence.tokens){
    if(!token.surface)return [{surface:sentence.text}];
    const position=sentence.text.indexOf(token.surface,cursor);
    if(position<0)return [{surface:sentence.text}];
    const gap=sentence.text.slice(cursor,position);
    // Canonical A1 token lists are often *sparse* lexical annotations.
    // Keep omitted particles and words literally, but do not invent readings.
    if(gap)parts.push({surface:gap});
    const reading=tokenReading(token);
    parts.push({surface:token.surface,...(reading&&hasKanji(token.surface)&&reading!==token.surface?{reading}:{})});
    cursor=position+token.surface.length;
  }
  const remaining=sentence.text.slice(cursor);
  if(remaining)parts.push({surface:remaining});
  // The A1 author provided a complete kana reading even for sentences whose
  // sparse lexeme list contains no annotated kanji. Prefer that source over
  // fabricating a reading from unlinked dictionary matches.
  if(!parts.some((part)=>part.reading))return sentenceReadingFallback(sentence)??parts;
  return parts;
}

export function a1FuriganaParts(text:string):FuriganaPart[]{
  const sentence=a1SentencesByText.get(text);
  if(sentence)return sentenceFuriganaParts(sentence);
  const lexeme=a1Forms.get(text);
  const reading=lexeme?knownReading(lexeme,text):undefined;
  return [{surface:text,...(reading&&hasKanji(text)&&reading!==text?{reading}:{})}];
}

export function hasA1Furigana(text:string):boolean{
  return a1FuriganaParts(text).some((part)=>Boolean(part.reading));
}

/**
 * Reading-recall, grammar-form, dictation, assessments and production retain their
 * original unhinted stimulus. Only A1 lessons and meaning/comprehension prompts
 * that do not assess kana reading are eligible.
 */
export function isA1FuriganaStep(step:StudyStep):boolean{
  if("kind" in step){
    if(step.id.startsWith("lesson-sentence-"))return a1SentencesById.has(step.id.slice("lesson-".length));
    if(step.id.startsWith("lesson-grammar-"))return a1GrammarIds.has(step.id.slice("lesson-".length));
    if(step.id.startsWith("lesson-"))return a1LexemeIds.has(step.id.slice("lesson-".length));
    return false;
  }
  if(step.id.startsWith("sentence-understand-")){
    return step.primaryTarget.kind==="sentence"&&a1SentencesById.has(step.primaryTarget.id)&&step.skill==="comprehension";
  }
  if(step.id.startsWith("vocab-meaning-")){
    return step.primaryTarget.kind==="lexeme"&&a1LexemeIds.has(step.primaryTarget.id)&&step.skill==="meaning_recognition";
  }
  return false;
}

export function A1FuriganaText({text,visible}:{text:string;visible:boolean}){
  if(!visible)return <>{text}</>;
  const parts=a1FuriganaParts(text);
  return <>{parts.map((part,index)=><Fragment key={index}>
    {part.reading?<ruby>{part.surface}<rp>(</rp><rt>{part.reading}</rt><rp>)</rp></ruby>:part.surface}
  </Fragment>)}</>;
}
