/**
 * A1 original-course contract v1. This is a proposed 24-lesson instructional
 * sequence, NOT a claim that all lessons are authored or passed.
 * Legacy refs are provenance pointers only: they NEVER grant completion.
 */
export const A1_CONTRACT_VERSION="a1-original-contract-v1" as const;
export type A1Module={id:string;order:number;title:string;description:string};
export type A1Lesson={id:string;moduleId:string;order:number;title:string;canDo:string;legacyUnitIds:readonly string[];communicationLessonIds:readonly string[];roleplayIds:readonly string[];foundationIds?:readonly string[];readingTextIds?:readonly string[];assessmentIds?:readonly string[]};
export const A1_MODULES:readonly A1Module[]=[
  {
    "id": "a1:module:01",
    "order": 1,
    "title": "Schrift und erste Gespräche",
    "description": "Schrift, Lautsystem und höfliche Standardformeln"
  },
  {
    "id": "a1:module:02",
    "order": 2,
    "title": "Menschen kennenlernen",
    "description": "Identität, Herkunft, Alltag und Familie"
  },
  {
    "id": "a1:module:03",
    "order": 3,
    "title": "Dinge und Orte",
    "description": "Gegenstände, Besitz und Orientierung"
  },
  {
    "id": "a1:module:04",
    "order": 4,
    "title": "Zeit und Routinen",
    "description": "Zahlen, Zeiten, Handlungen und Bewegung"
  },
  {
    "id": "a1:module:05",
    "order": 5,
    "title": "Alltagssituationen",
    "description": "Vorlieben, Bestellungen, Einkäufe und Einladungen"
  },
  {
    "id": "a1:module:06",
    "order": 6,
    "title": "Selbstständige A1-Kommunikation",
    "description": "Unterwegs, um Hilfe bitten und kurze Gespräche"
  }
];
export const A1_LESSONS:readonly A1Lesson[]=[
  {
    "id": "a1:lesson:01",
    "moduleId": "a1:module:01",
    "order": 1,
    "title": "Laute und Aussprache",
    "canDo": "Ich kann japanische Grundlaute, Vokallänge und Moren unterscheiden.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": [],
    "foundationIds": [
      "hiragana-vowels"
    ]
  },
  {
    "id": "a1:lesson:02",
    "moduleId": "a1:module:01",
    "order": 2,
    "title": "Hiragana",
    "canDo": "Ich kann einfache Wörter in Hiragana erkennen und lesen.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": [],
    "foundationIds": [
      "hiragana-basic",
      "hiragana-advanced"
    ]
  },
  {
    "id": "a1:lesson:03",
    "moduleId": "a1:module:01",
    "order": 3,
    "title": "Katakana",
    "canDo": "Ich kann häufige Lehnwörter in Katakana erkennen und lesen.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": [],
    "foundationIds": [
      "katakana-basic",
      "katakana-advanced"
    ]
  },
  {
    "id": "a1:lesson:04",
    "moduleId": "a1:module:01",
    "order": 4,
    "title": "Begrüßungen und Höflichkeit",
    "canDo": "Ich kann begrüßen, danken, mich entschuldigen und verabschieden.",
    "legacyUnitIds": [],
    "communicationLessonIds": [
      "a1-greetings",
      "a1-thanks"
    ],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:05",
    "moduleId": "a1:module:02",
    "order": 5,
    "title": "Sich vorstellen",
    "canDo": "Ich kann Namen erfragen und mich höflich vorstellen.",
    "legacyUnitIds": [
      "a1-unit-01",
      "a1-unit-02"
    ],
    "communicationLessonIds": [
      "a1-introductions",
      "a1-asking-names"
    ],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:06",
    "moduleId": "a1:module:02",
    "order": 6,
    "title": "Herkunft und Sprache",
    "canDo": "Ich kann meine Herkunft und Sprachen nennen und nach ihnen fragen.",
    "legacyUnitIds": [
      "a1-unit-05"
    ],
    "communicationLessonIds": [
      "a1-origin"
    ],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:07",
    "moduleId": "a1:module:02",
    "order": 7,
    "title": "Beruf und Studium",
    "canDo": "Ich kann einfache Angaben zu Beruf und Studium machen.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:08",
    "moduleId": "a1:module:02",
    "order": 8,
    "title": "Familie",
    "canDo": "Ich kann nahe Familienmitglieder einfach beschreiben.",
    "legacyUnitIds": [
      "a1-unit-15"
    ],
    "communicationLessonIds": [
      "a1-family"
    ],
    "roleplayIds": [],
    "readingTextIds": [
      "text-a1-family"
    ]
  },
  {
    "id": "a1:lesson:09",
    "moduleId": "a1:module:03",
    "order": 9,
    "title": "Gegenstände und Zeigwörter",
    "canDo": "Ich kann Dinge mit これ, それ und あれ identifizieren.",
    "legacyUnitIds": [
      "a1-unit-09"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:10",
    "moduleId": "a1:module:03",
    "order": 10,
    "title": "Besitz und Zuordnung",
    "canDo": "Ich kann Zugehörigkeit mit の und この/その/あの ausdrücken.",
    "legacyUnitIds": [
      "a1-unit-11"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:11",
    "moduleId": "a1:module:03",
    "order": 11,
    "title": "Personen und Dinge lokalisieren",
    "canDo": "Ich kann sagen, wo sich Menschen und Gegenstände befinden.",
    "legacyUnitIds": [
      "a1-unit-06"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:12",
    "moduleId": "a1:module:03",
    "order": 12,
    "title": "Orte und Positionen",
    "canDo": "Ich kann einfache Ortsfragen stellen und Positionen angeben.",
    "legacyUnitIds": [
      "a1-unit-10"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:13",
    "moduleId": "a1:module:04",
    "order": 13,
    "title": "Zahlen und Mengen",
    "canDo": "Ich kann Zahlen und einfache Zählwörter im Alltag anwenden.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:14",
    "moduleId": "a1:module:04",
    "order": 14,
    "title": "Uhrzeit und Termine",
    "canDo": "Ich kann Uhrzeit, Wochentag und einfache Termine angeben.",
    "legacyUnitIds": [
      "a1-unit-12"
    ],
    "communicationLessonIds": [
      "a1-time"
    ],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:15",
    "moduleId": "a1:module:04",
    "order": 15,
    "title": "Alltag und Gewohnheiten",
    "canDo": "Ich kann alltägliche Handlungen höflich bejahen und verneinen.",
    "legacyUnitIds": [
      "a1-unit-03",
      "a1-unit-08",
      "a1-unit-13"
    ],
    "communicationLessonIds": [],
    "roleplayIds": [],
    "readingTextIds": [
      "text-a1-morning"
    ]
  },
  {
    "id": "a1:lesson:16",
    "moduleId": "a1:module:04",
    "order": 16,
    "title": "Wege und Vergangenes",
    "canDo": "Ich kann Bewegungsziele und einfache vergangene Handlungen beschreiben.",
    "legacyUnitIds": [
      "a1-unit-04"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:17",
    "moduleId": "a1:module:05",
    "order": 17,
    "title": "Vorlieben und Beschreibungen",
    "canDo": "Ich kann Vorlieben und einfache Eigenschaften ausdrücken.",
    "legacyUnitIds": [
      "a1-unit-07",
      "a1-unit-14"
    ],
    "communicationLessonIds": [
      "a1-hobbies"
    ],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:18",
    "moduleId": "a1:module:05",
    "order": 18,
    "title": "Essen und Bestellen",
    "canDo": "Ich kann im Café oder Restaurant höflich etwas bestellen.",
    "legacyUnitIds": [
      "a1-unit-16"
    ],
    "communicationLessonIds": [
      "a1-cafe",
      "a1-restaurant"
    ],
    "roleplayIds": [
      "cafe"
    ]
  },
  {
    "id": "a1:lesson:19",
    "moduleId": "a1:module:05",
    "order": 19,
    "title": "Einkaufen und Preise",
    "canDo": "Ich kann Preise erfragen und einfache Einkäufe tätigen.",
    "legacyUnitIds": [
      "a1-unit-17"
    ],
    "communicationLessonIds": [
      "a1-shopping"
    ],
    "roleplayIds": [],
    "readingTextIds": [
      "text-a1-shopping"
    ]
  },
  {
    "id": "a1:lesson:20",
    "moduleId": "a1:module:05",
    "order": 20,
    "title": "Einladen und Vorschlagen",
    "canDo": "Ich kann einfache Einladungen verstehen und beantworten.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:21",
    "moduleId": "a1:module:06",
    "order": 21,
    "title": "Unterwegs und Verkehr",
    "canDo": "Ich kann nach Bahnhof, Verkehrsmitteln und Richtungen fragen.",
    "legacyUnitIds": [
      "a1-unit-18"
    ],
    "communicationLessonIds": [
      "a1-directions",
      "a1-transport"
    ],
    "roleplayIds": [
      "station"
    ],
    "readingTextIds": [
      "text-a1-transport"
    ]
  },
  {
    "id": "a1:lesson:22",
    "moduleId": "a1:module:06",
    "order": 22,
    "title": "Um Hilfe bitten",
    "canDo": "Ich kann um Wiederholung, langsameres Sprechen und Hilfe bitten.",
    "legacyUnitIds": [
      "a1-unit-19"
    ],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:23",
    "moduleId": "a1:module:06",
    "order": 23,
    "title": "Wetter und Wochenendpläne",
    "canDo": "Ich kann einfach über Wetter und Erlebnisse sprechen.",
    "legacyUnitIds": [],
    "communicationLessonIds": [],
    "roleplayIds": []
  },
  {
    "id": "a1:lesson:24",
    "moduleId": "a1:module:06",
    "order": 24,
    "title": "Kurze Gespräche verbinden",
    "canDo": "Ich kann mehrere einfache Gesprächsschritte höflich verbinden.",
    "legacyUnitIds": [
      "a1-unit-20"
    ],
    "communicationLessonIds": [
      "a1-hotel"
    ],
    "roleplayIds": [
      "meeting"
    ],
    "assessmentIds": [
      "assessment-a1-milestone"
    ]
  }
];
export const A1_LEGACY_UNIT_IDS=Array.from({length:20},(_,i)=>"a1-unit-"+String(i+1).padStart(2,"0"));
export const A1_COMMUNICATION_IDS=["a1-greetings","a1-introductions","a1-origin","a1-asking-names","a1-thanks","a1-shopping","a1-cafe","a1-directions","a1-time","a1-family","a1-hobbies","a1-transport","a1-hotel","a1-restaurant"] as const;
export const A1_ROLEPLAY_IDS=["cafe","station","meeting"] as const;
export const A1_FOUNDATION_IDS=["hiragana-vowels","hiragana-basic","hiragana-advanced","katakana-basic","katakana-advanced"] as const;
export const A1_READING_IDS=["text-a1-family","text-a1-morning","text-a1-shopping","text-a1-transport"] as const;
export const A1_ASSESSMENT_IDS=["assessment-a1-milestone"] as const;
export function a1Lesson(id:string):A1Lesson|undefined{return A1_LESSONS.find(x=>x.id===id);}
export function a1ManifestErrors():string[]{
 const errors:string[]=[];
 const ids=new Set<string>();
 for(const lesson of A1_LESSONS){
  if(ids.has(lesson.id))errors.push("duplicate lesson "+lesson.id);
  ids.add(lesson.id);
  if(!A1_MODULES.some(x=>x.id===lesson.moduleId))errors.push("unknown module "+lesson.id);
  if(!lesson.canDo.trim())errors.push("missing can-do "+lesson.id);
 }
 if(A1_LESSONS.length!==24)errors.push("expected 24 lessons");
 if(A1_MODULES.length!==6)errors.push("expected 6 modules");
 for(const [type,expected,key] of [
  ["unit",A1_LEGACY_UNIT_IDS,"legacyUnitIds"],
  ["communication",A1_COMMUNICATION_IDS,"communicationLessonIds"],
  ["roleplay",A1_ROLEPLAY_IDS,"roleplayIds"]
 ] as const){
  const occurrences=A1_LESSONS.flatMap(lesson=>lesson[key]);
  for(const id of expected){
   const count=occurrences.filter(x=>x===id).length;
   if(count!==1)errors.push(type+" "+id+" has "+count+" mappings");
  }
  for(const id of occurrences)if(!(expected as readonly string[]).includes(id))errors.push("unknown "+type+" "+id);
 }
 for(const [kind,expected,key] of [
  ["foundation",A1_FOUNDATION_IDS,"foundationIds"],
  ["reading",A1_READING_IDS,"readingTextIds"],
  ["assessment",A1_ASSESSMENT_IDS,"assessmentIds"]
 ] as const){
  const refs=A1_LESSONS.flatMap(lesson=>lesson[key]??[]);
  for(const id of expected)if(refs.filter(ref=>ref===id).length!==1)errors.push(kind+" "+id+" should map exactly once");
  for(const id of refs)if(!(expected as readonly string[]).includes(id))errors.push("unknown "+kind+" "+id);
 }
 return errors;
}
export type A1EvidenceOrigin={id:string;userId:string;sourceId?:string|null;contextId?:string|null;metadata?:Record<string,unknown>|null;primaryTarget?:{kind:string;id:string}|null};
export type A1CrosswalkRow={eventId:string;status:"aligned"|"ambiguous"|"unmapped";legacyRefs:readonly string[];candidateLessonIds:readonly string[];reason:string};
export type A1CrosswalkReport={rows:readonly A1CrosswalkRow[];outOfScope:number;aligned:number;ambiguous:number;unmapped:number};
/**
 * Read-only, loss-reporting crosswalk. Only exact, inspectable legacy IDs match.
 * No synthetic StudyEvent, no mastery claim, no mutation of original records.
 */
export function reconcileA1Evidence(
 events:readonly A1EvidenceOrigin[],owner:string,exerciseToCommunicationLesson:Readonly<Record<string,string>>={},targetToLegacyUnits:Readonly<Record<string,readonly string[]>>={}
):A1CrosswalkReport{
 const rows:A1CrosswalkRow[]=[];let outOfScope=0;
 const core=new Set(A1_LEGACY_UNIT_IDS),communication=new Set<string>(A1_COMMUNICATION_IDS),roleplays=new Set<string>(A1_ROLEPLAY_IDS);
 for(const event of events){
  if(event.userId!==owner){outOfScope++;continue;}
  // An explicitly higher-level context is never silently imported into A1.
  if(typeof event.contextId==="string"&&/^(?:a2|b1|b2|c1)(?:-|:)/.test(event.contextId)){outOfScope++;continue;}
  const refs=new Set<string>();
  const ctx=event.contextId;
  const unit=event.metadata?.unitId;
  const target=event.primaryTarget;
  if(target){
   for(const legacyId of targetToLegacyUnits[target.kind+":"+target.id]??[])if(core.has(legacyId))refs.add(legacyId);
  }
  if(typeof ctx==="string"&&core.has(ctx))refs.add(ctx);
  if(typeof unit==="string"&&core.has(unit))refs.add(unit);
  if(event.sourceId==="original-a1-communication-v1"){
   if(typeof ctx==="string"&&communication.has(ctx))refs.add(ctx);
   const ex=event.metadata?.exerciseId;
   if(typeof ex==="string"&&exerciseToCommunicationLesson[ex])refs.add(exerciseToCommunicationLesson[ex]);
  }
  if(event.sourceId==="original-a1-roleplay-v1"){
   const id=event.metadata?.scenarioId;
   if(typeof id==="string"&&roleplays.has(id))refs.add(id);
  }
  if(event.sourceId==="original-a1-recall-v1"){
   const id=event.metadata?.recallId;
   if(typeof id==="string"){
    const parts=id.split(":");
    if(["vocab","reverse","context"].includes(parts[0]??"")&&communication.has(parts[1]??""))refs.add(parts[1]!);
   }
  }
  const isA1=refs.size>0||event.sourceId?.startsWith("original-a1-")||
    (typeof ctx==="string"&&(ctx.startsWith("a1-")||ctx==="assessment-a1-milestone"));
  if(!isA1){outOfScope++;continue;}
  const candidates=A1_LESSONS.filter(l=>[...refs].some(ref=>[...l.legacyUnitIds,...l.communicationLessonIds,...l.roleplayIds].includes(ref))).map(l=>l.id);
  const status=candidates.length===1?"aligned":candidates.length>1?"ambiguous":"unmapped";
  rows.push({eventId:event.id,status,legacyRefs:[...refs],candidateLessonIds:candidates,reason:status==="aligned"?"Provenance only; not completion":status==="ambiguous"?"Conflicting legacy targets require review":"No exact lesson crosswalk; original event remains authoritative"});
 }
 return {rows,outOfScope,aligned:rows.filter(r=>r.status==="aligned").length,ambiguous:rows.filter(r=>r.status==="ambiguous").length,unmapped:rows.filter(r=>r.status==="unmapped").length};
}
