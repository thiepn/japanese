import type {JourneyUnit} from "./journey27";
import {normalizeP26} from "./pedagogy26";

/** Finite, explainable advisory heuristics — NOT Japanese grammar parsing or scoring. */
export interface GrammarObservation{
  id:string;topic:"particle"|"form"|"register"|"time"|"meaning";
  title:string;detail:string;example:string;
}
interface PatternHint extends GrammarObservation{
  contexts?:readonly string[];pattern:RegExp;
}
const patterns:readonly PatternHint[]=[
  {id:"movement-de",topic:"particle",title:"Ziel oder Handlungsort?",
    detail:"Beim Bewegungsverb 行きます ist das erreichte Ziel meist mit に oder へ markiert. で kann dagegen ein Mittel oder einen Handlungsort markieren.",
    example:"大学に行きます。／大学で勉強します。",pattern:/(大学|学校|駅|公園|図書館)で行(き|く)/u},
  {id:"action-ni",topic:"particle",title:"Wo geschieht die Handlung?",
    detail:"Bei 勉強します, 読みます oder 話します wird der Ort der Tätigkeit normalerweise mit で markiert.",
    example:"図書館で勉強します。",pattern:/(大学|学校|図書館|教室|家)に(日本語を)?(勉強|読|話|働)/u},
  {id:"exist-de",topic:"particle",title:"Existenzort prüfen",
    detail:"Bei います／あります ist der Ort des Vorhandenseins gewöhnlich mit に markiert.",
    example:"教室に先生がいます。",pattern:/(教室|家|学校|図書館)で(先生|本|学生)?(が)?(います|あります)/u},
  {id:"nominal-masu",topic:"form",title:"Nominalprädikat oder Verb?",
    detail:"Ein Nomen wird höflich normalerweise mit です abgeschlossen, nicht mit der Verbhöflichkeitsendung ます.",
    example:"私は学生です。",pattern:/(学生|先生|田中|日本人)ます/u},
  {id:"demonstrative-kono",topic:"form",title:"この und これ unterscheiden",
    detail:"この steht direkt vor einem Nomen; これ steht selbstständig. Die beiden Formen sind nicht austauschbar.",
    example:"この本は私のです。／これは本です。",pattern:/(このは|そのは|これ(本|傘|かばん)|それ(本|傘|かばん))/u},
  {id:"direct-object-ni",topic:"particle",title:"Direktes Objekt prüfen",
    detail:"Bei 読む, 飲む oder 食べる steht für die betroffene Sache gewöhnlich を.",
    example:"本を読みます。／お茶を飲みます。",pattern:/(本|水|お茶|ケーキ)に(読|飲|食)/u},
  {id:"item-request-ni",topic:"particle",title:"Gegenstand erbitten",
    detail:"Bei einer höflichen Bitte um eine Sache steht gewöhnlich das Muster Nomen + をください.",
    example:"水をください。",pattern:/(水|お茶|ケーキ|本)にください/u},
  {id:"hodo-order",topic:"form",title:"Bitte oder Aussage?",
    detail:"Eine höfliche Aufforderung zu einer Handlung bildet man mit der て-Form + ください; ますください ist keine übliche Verbverbindung.",
    example:"もう一度言ってください。",pattern:/ますください/u},
  {id:"past-i-adj",topic:"time",title:"Vergangenheit bei い-Adjektiven",
    detail:"Ein い-Adjektiv wie 楽しい bildet die höfliche Vergangenheit mit かったです, nicht mit いでした.",
    example:"楽しかったです。",pattern:/(楽しい|暑い|寒い|安い)でした/u},
  {id:"past-polite",topic:"time",title:"Zeitwort und Verbform vergleichen",
    detail:"Bei einem Bericht über ein abgeschlossenes gestriges Ereignis passt in der Regel 〜ました oder 〜ませんでした. Der Satzkontext kann Ausnahmen ergeben.",
    example:"昨日、映画を見ました。",pattern:/昨日.{0,24}(見ます|読みます|行きます|飲みます)/u},
  {id:"allow-taik",topic:"form",title:"Erlaubnis versus Wunsch",
    detail:"〜たいです bedeutet 'ich möchte'. Um höflich Erlaubnis zu erfragen, wird häufig て-Form + もいいですか verwendet.",
    example:"本を借りたいです。／借りてもいいですか。",pattern:/借りたいですか/u,contexts:["p25:library","p26:library-project"]},
  {id:"greeting-formality",topic:"register",title:"Anrede der Lehrkraft",
    detail:"Wenn du eine neue oder unbekannte Lehrkraft am Morgen begrüßt, ist おはようございます meist die passendere höfliche Wahl. Das lockere おはよう ist nicht grundsätzlich falsch, aber beziehungsabhängig.",
    example:"先生、おはようございます。",pattern:/^おはよう$/u,contexts:["p23:greetings"]},
  {id:"invite-command",topic:"register",title:"Einladung statt Befehl",
    detail:"Gegenüber einer neuen Bekanntschaft ist 〜ませんか als Einladung meist angemessener als ein direkter Imperativ. Gegenüber Freunden kann der Ton anders sein.",
    example:"一緒に行きませんか。",pattern:/(行け|来い|座れ|読め)$/u,contexts:["p23:plans","p25:appointment","p26:weekend-switch"]},
  {id:"context-polite-ending",topic:"register",title:"Höflichkeit bewusst wählen",
    detail:"Im formelleren Service- oder Erstkontakt lohnt sich ein Blick auf です/ます oder eine passende höfliche Bitte. Die bloße Präsenz dieser Endung beweist keine korrekte Höflichkeit.",
    example:"すみません、お願いします。",pattern:/(だよ|だぜ|だぞ)$/u,contexts:["p26:cafe-conversation","p25:library","p23:introduction"]}
];
export function observeGrammar(text:string,unit:JourneyUnit):GrammarObservation[]{
  const normalized=normalizeP26(text);
  if(!normalized)return [];
  const seen=new Set<string>();
  const matched=patterns.filter(rule=>
    (!rule.contexts||rule.contexts.includes(unit.id))&&rule.pattern.test(normalized))
    .filter(rule=>{
      if(seen.has(rule.id))return false;
      seen.add(rule.id);return true;
    });
  return matched.slice(0,4).map(({id,topic,title,detail,example})=>({id,topic,title,detail,example}));
}
export function grammarReflection(unit:JourneyUnit,text:string):string[]{
  const issues=observeGrammar(text,unit);
  return issues.length?issues.map(h=>h.title+": "+h.detail+" Beispiel: "+h.example):
    [unit.contrast,unit.register,
      "Keine der begrenzten Suchregeln hat eine Auffälligkeit gefunden. Das ist keine Bestätigung grammatischer Richtigkeit."];
}
