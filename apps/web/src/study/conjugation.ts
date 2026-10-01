import type { InflectionClass, Lexeme } from "@thiepn/content-schema";
import type { StudyLesson, StudyPrompt } from "@thiepn/study-player";
import { coreContent, senseForLexeme, starterLexemes } from "../coreContent";

export type ConjugationForm =
  | "polite_nonpast" | "polite_negative" | "polite_past" | "polite_past_negative"
  | "plain_negative" | "plain_past" | "te_form";

const FORM_LABELS:Readonly<Record<ConjugationForm,string>>={
  polite_nonpast:"polite nonpast",
  polite_negative:"polite negative",
  polite_past:"polite past",
  polite_past_negative:"polite past negative",
  plain_negative:"plain negative",
  plain_past:"plain past",
  te_form:"て-form"
};

const GODAN_I:Readonly<Record<string,string>>={う:"い",く:"き",ぐ:"ぎ",す:"し",つ:"ち",ぬ:"に",ぶ:"び",む:"み",る:"り"};
const GODAN_A:Readonly<Record<string,string>>={う:"わ",く:"か",ぐ:"が",す:"さ",つ:"た",ぬ:"な",ぶ:"ば",む:"ま",る:"ら"};
const GODAN_PAST:Readonly<Record<string,string>>={う:"った",つ:"った",る:"った",む:"んだ",ぶ:"んだ",ぬ:"んだ",く:"いた",ぐ:"いだ",す:"した"};
const GODAN_TE:Readonly<Record<string,string>>={う:"って",つ:"って",る:"って",む:"んで",ぶ:"んで",ぬ:"んで",く:"いて",ぐ:"いで",す:"して"};

export const inflectingLexemes=starterLexemes.filter((lexeme)=>Boolean(lexeme.inflectionClass));

export function conjugateLexeme(lexeme:Lexeme,form:ConjugationForm):string|null{
  const kind=lexeme.inflectionClass;
  if(!kind)return null;
  if(kind==="i-adjective"||kind==="i-adjective-ii")return conjugateIAdjective(lexeme.canonicalForm,kind,form);
  if(kind==="na-adjective")return conjugateNaAdjective(lexeme.canonicalForm,form);
  return conjugateVerb(lexeme,kind,form);
}

export const conjugationPrompts:StudyPrompt[]=inflectingLexemes.flatMap((lexeme)=>{
  const forms=verbClass(lexeme.inflectionClass)
    ?(["polite_negative","polite_past","polite_past_negative","plain_negative","plain_past","te_form"] as const)
    :(["polite_negative","polite_past","polite_past_negative"] as const);
  return forms.flatMap((form)=>{
    const answer=conjugateLexeme(lexeme,form);
    if(!answer)return [];
    return [{
      id:`conjugation-${lexeme.id}-${form}`,
      primaryTarget:{kind:"lexeme" as const,id:lexeme.id},
      skill:"form_selection" as const,
      cueFamily:`conjugation-${form}`,
      promptType:"typed" as const,
      instruction:`Write the ${FORM_LABELS[form]} form.`,
      prompt:lexeme.canonicalForm,
      promptLanguage:"ja" as const,
      placeholder:"日本語…",
      acceptedAnswers:[answer],
      displayAnswer:answer,
      explanation:`${lexeme.canonicalForm} → ${answer} (${FORM_LABELS[form]}).`,
      contextId:conjugationContext(lexeme.id),
      answerNormalization:"japanese" as const,
      sourceId:lexeme.sourceIds[0] ?? "thiepn-original",
      contentVersion:coreContent.version
    }];
  });
});

export const conjugationLessons:Record<string,StudyLesson>=Object.fromEntries(inflectingLexemes.map((lexeme)=>{
  const forms=(["polite_nonpast","polite_negative","polite_past","polite_past_negative"] as const)
    .flatMap((form)=>{const value=conjugateLexeme(lexeme,form);return value?[{label:FORM_LABELS[form],value,language:"ja" as const}]:[];});
  const sense=senseForLexeme(lexeme);
  return [conjugationContext(lexeme.id),{
    kind:"lesson" as const,
    id:`lesson-conjugation-${lexeme.id}`,
    title:`${lexeme.canonicalForm} · conjugation`,
    body:`This word follows the ${classLabel(lexeme.inflectionClass!)} pattern. Generate its forms from the pattern instead of memorizing every surface form as an unrelated fact.`,
    contextId:conjugationContext(lexeme.id),
    facts:[{label:"Meaning",value:sense.glosses.join(" / "),language:"en" as const},...forms],
    sourceLabel:"THIEPN Japanese conjugation model"
  }];
}));

export const CONJUGATION_TOTAL=conjugationPrompts.length;
export function conjugationContext(lexemeId:string):string{return "conjugation-"+lexemeId;}

function verbClass(kind:InflectionClass|undefined):boolean{
  return kind==="ichidan"||kind==="godan"||kind==="irregular-suru"||kind==="irregular-kuru"||kind==="irregular-aru";
}

function classLabel(kind:InflectionClass):string{
  const labels:Record<InflectionClass,string>={
    ichidan:"ichidan verb",
    godan:"godan verb",
    "irregular-suru":"する irregular verb",
    "irregular-kuru":"来る irregular verb",
    "irregular-aru":"ある irregular verb",
    "i-adjective":"い-adjective",
    "i-adjective-ii":"いい-type い-adjective",
    "na-adjective":"な-adjective"
  };
  return labels[kind];
}

function conjugateIAdjective(base:string,kind:"i-adjective"|"i-adjective-ii",form:ConjugationForm):string|null{
  const stem=kind==="i-adjective-ii"?"よ":base.endsWith("い")?base.slice(0,-1):base;
  if(form==="polite_nonpast")return base+"です";
  if(form==="polite_negative")return stem+"くないです";
  if(form==="polite_past")return stem+"かったです";
  if(form==="polite_past_negative")return stem+"くなかったです";
  if(form==="plain_negative")return stem+"くない";
  if(form==="plain_past")return stem+"かった";
  return null;
}

function conjugateNaAdjective(base:string,form:ConjugationForm):string|null{
  if(form==="polite_nonpast")return base+"です";
  if(form==="polite_negative")return base+"じゃないです";
  if(form==="polite_past")return base+"でした";
  if(form==="polite_past_negative")return base+"じゃなかったです";
  if(form==="plain_negative")return base+"じゃない";
  if(form==="plain_past")return base+"だった";
  return null;
}

function conjugateVerb(lexeme:Lexeme,kind:InflectionClass,form:ConjugationForm):string|null{
  const base=lexeme.canonicalForm;
  if(kind==="irregular-suru"){
    const prefix=base.endsWith("する")?base.slice(0,-2):"";
    const forms:Record<ConjugationForm,string>={
      polite_nonpast:prefix+"します",polite_negative:prefix+"しません",polite_past:prefix+"しました",polite_past_negative:prefix+"しませんでした",
      plain_negative:prefix+"しない",plain_past:prefix+"した",te_form:prefix+"して"
    };
    return forms[form];
  }
  if(kind==="irregular-kuru"){
    const forms:Record<ConjugationForm,string>={
      polite_nonpast:"来ます",polite_negative:"来ません",polite_past:"来ました",polite_past_negative:"来ませんでした",
      plain_negative:"来ない",plain_past:"来た",te_form:"来て"
    };
    return forms[form];
  }
  if(kind==="irregular-aru"){
    const forms:Record<ConjugationForm,string>={
      polite_nonpast:"あります",polite_negative:"ありません",polite_past:"ありました",polite_past_negative:"ありませんでした",
      plain_negative:"ない",plain_past:"あった",te_form:"あって"
    };
    return forms[form];
  }
  if(kind==="ichidan"){
    const stem=base.endsWith("る")?base.slice(0,-1):base;
    const forms:Record<ConjugationForm,string>={
      polite_nonpast:stem+"ます",polite_negative:stem+"ません",polite_past:stem+"ました",polite_past_negative:stem+"ませんでした",
      plain_negative:stem+"ない",plain_past:stem+"た",te_form:stem+"て"
    };
    return forms[form];
  }
  if(kind==="godan"){
    const ending=base.slice(-1);
    const stem=base.slice(0,-1);
    const i=GODAN_I[ending];
    const a=GODAN_A[ending];
    const past=lexeme.id==="lex-iku"?"った":GODAN_PAST[ending];
    const te=lexeme.id==="lex-iku"?"って":GODAN_TE[ending];
    if(!i||!a||!past||!te)return null;
    const forms:Record<ConjugationForm,string>={
      polite_nonpast:stem+i+"ます",polite_negative:stem+i+"ません",polite_past:stem+i+"ました",polite_past_negative:stem+i+"ませんでした",
      plain_negative:stem+a+"ない",plain_past:stem+past,te_form:stem+te
    };
    return forms[form];
  }
  return null;
}
