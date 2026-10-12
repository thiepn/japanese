import type {JourneyUnit} from "./journey27";
import {normalizeP26} from "./pedagogy26";
import {observeGrammar} from "./feedback27";

export interface P29RegisterExample{
  unitId:string;polite:string;casual:string;explanation:string;
}
export const p29RegisterExamples:readonly P29RegisterExample[]=[
  {
    "unitId": "p23:greetings",
    "polite": "先生、おはようございます。",
    "casual": "おはよう。",
    "explanation": "Gegenüber Lehrkräften oder unbekannten Personen ist die längere Grußform üblicher. Unter Freunden ist おはよう üblich."
  },
  {
    "unitId": "p23:introduction",
    "polite": "初めまして。よろしくお願いします。",
    "casual": "よろしく。",
    "explanation": "よろしくお願いします ist beim ersten Kennenlernen höflich. よろしく allein ist wesentlich lockerer."
  },
  {
    "unitId": "p23:ownership",
    "polite": "これは私の本です。",
    "casual": "これ、私の本。",
    "explanation": "Das vollständige Nominalprädikat です eignet sich für neutrale höfliche Erklärung, die verkürzte Form eher für Vertraute."
  },
  {
    "unitId": "p23:places",
    "polite": "図書館はどこですか。",
    "casual": "図書館、どこ？",
    "explanation": "Die Frage mit ですか ist höflicher als die elliptische Alltagsfrage."
  },
  {
    "unitId": "p23:routine",
    "polite": "毎日日本語を勉強します。",
    "casual": "毎日日本語を勉強するよ。",
    "explanation": "ます ist eine höfliche Standardform, するよ eine lockere Ausdrucksweise."
  },
  {
    "unitId": "p23:cafe",
    "polite": "すみません、お茶を一つお願いします。",
    "casual": "お茶、一つ。",
    "explanation": "Im Servicekontakt ist die Bitte mit すみません／お願いします klar höflicher als eine knappe Bestellphrase."
  },
  {
    "unitId": "p23:plans",
    "polite": "一緒に行きませんか。",
    "casual": "一緒に行かない？",
    "explanation": "Beides kann einladen. ませんか ist höflicher, ない？ passt eher zu Freunden."
  },
  {
    "unitId": "p23:past",
    "polite": "昨日、映画を見ました。",
    "casual": "昨日、映画見た。",
    "explanation": "Höfliche Vergangenheitsform ました versus lockere Kurzform た."
  },
  {
    "unitId": "p25:directions",
    "polite": "すみません、駅はどこですか。",
    "casual": "駅ってどこ？",
    "explanation": "Die erste Frage eignet sich für Fremde; die verkürzte ist eher informell."
  },
  {
    "unitId": "p25:transport",
    "polite": "電車は何時に出ますか。",
    "casual": "電車、何時に出る？",
    "explanation": "Eine höfliche Auskunftsfrage gegenüber Unbekannten und eine lockere Frage an Freunde."
  },
  {
    "unitId": "p25:library",
    "polite": "この本を借りてもいいですか。",
    "casual": "この本、借りてもいい？",
    "explanation": "Die Erlaubnisfrage kann höflich oder informell gestellt werden. Die Umgebung entscheidet."
  },
  {
    "unitId": "p25:shopping",
    "polite": "これをお願いします。",
    "casual": "これちょうだい。",
    "explanation": "お願いします eignet sich im Geschäft; ちょうだい ist eher vertraut und kann an Personal zu direkt wirken."
  },
  {
    "unitId": "p25:appointment",
    "polite": "金曜日はどうですか。",
    "casual": "金曜どう？",
    "explanation": "Gleiche Terminanfrage in unterschiedlichem sozialen Register."
  },
  {
    "unitId": "p25:lostfound",
    "polite": "すみません、傘をなくしました。",
    "casual": "傘なくしちゃった。",
    "explanation": "Die erste Form beschreibt einem Fundbüro das Problem höflich; die zweite ist gesprochene lockere Alltagssprache."
  },
  {
    "unitId": "p26:station-to-campus",
    "polite": "バスは何時に出ますか。",
    "casual": "バス何時に出る？",
    "explanation": "Höfliche Fahrplanauskunft gegenüber Unbekannten versus Frage an Freunde."
  },
  {
    "unitId": "p26:library-project",
    "polite": "一緒に勉強しませんか。",
    "casual": "一緒に勉強しない？",
    "explanation": "Die Einladung mit ませんか ist höflich, die andere unter Mitschülern locker."
  },
  {
    "unitId": "p26:cafe-conversation",
    "polite": "コーヒーを一つください。",
    "casual": "コーヒー、一つ。",
    "explanation": "Das erste Muster ist eine höfliche Bestellung. Das zweite ist eine verkürzte, nicht gleichwertig höfliche Form."
  },
  {
    "unitId": "p26:weekend-switch",
    "polite": "日曜日はどうですか。",
    "casual": "日曜どう？",
    "explanation": "Eine höfliche Terminfrage und eine vertraute Kurzform."
  }
];
export function p29RegisterExampleForUnit(unitId:string):P29RegisterExample|undefined{
  return p29RegisterExamples.find(e=>e.unitId===unitId);
}
export interface P29RevisionObservation{
  changed:boolean;beforeLength:number;afterLength:number;
  addedParticles:string[];removedParticles:string[];
  formChanges:string[];suggestions:string[];
}
/** Heuristics are transparent, not a grammar/parser grade. */
export function describeP29Revision(
  initial:string,revised:string,unit:JourneyUnit
):P29RevisionObservation{
  const before=normalizeP26(initial),after=normalizeP26(revised);
  const particles=["は","が","を","に","で","の","から","まで","も"];
  const formMarkers=["です","ます","ました","ません","てください","てもいい","たい","でしょう"];
  const addedParticles=particles.filter(p=>!before.includes(p)&&after.includes(p));
  const removedParticles=particles.filter(p=>before.includes(p)&&!after.includes(p));
  const formChanges=formMarkers.filter(marker=>before.includes(marker)!==after.includes(marker))
    .map(marker=>(after.includes(marker)?"Hinzugefügt: ":"Entfernt: ")+marker);
  const register=p29RegisterExampleForUnit(unit.id);
  const flags=observeGrammar(revised,unit);
  const suggestions=[
    ...flags.map(f=>f.title+": "+f.detail),
    ...(formChanges.length?[unit.contrast]:[]),
    ...(register?[register.explanation]:[unit.register]),
    "Ein fehlender Hinweis bedeutet nicht, dass Grammatik, Bedeutung oder Aussprache korrekt sind."
  ];
  return {
    changed:before!==after,
    beforeLength:[...before].length,afterLength:[...after].length,
    addedParticles,removedParticles,formChanges,suggestions
  };
}
