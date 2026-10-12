import {a1CommunicationLessons} from "../../../../packages/a1-communication-seed/src/index";
export type A1Destination="lesson"|"roleplay"|"recall";
export type A1Navigation={destination:A1Destination;lessonId?:string;scenarioId?:string;mode?:"kana"|"katakana"|"vocabulary"|"reverse"|"context"};
export const A1_NAV_EVENT="japanese:a1:navigate";
export function navigateA1(detail:A1Navigation):void{
 if(typeof window==="undefined")return;
 window.dispatchEvent(new CustomEvent<A1Navigation>(A1_NAV_EVENT,{detail}));
 const target={lesson:"a1-communication-title",roleplay:"a1-roleplay-title",recall:"a1-recall-title"}[detail.destination];
 document.getElementById(target)?.scrollIntoView({behavior:"smooth",block:"start"});
}
export function scenarioForLesson(id:string):string{
 const lesson=a1CommunicationLessons.find(l=>l.id===id);
 const text=(lesson?.title??"")+" "+(lesson?.canDo??"");
 if(/bahnhof|weg|reise|richtung|verkehr|zug|bus/i.test(text))return "station";
 if(/café|cafe|restaurant|bestell|essen|trinken|einkauf/i.test(text))return "cafe";
 return "meeting";
}
