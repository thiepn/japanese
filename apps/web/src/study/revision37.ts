import {normalizeP26} from "./pedagogy26";
export interface P37DraftComparison{
 changed:boolean;beforeLength:number;afterLength:number;
 addedMarkers:string[];removedMarkers:string[];
 suggestedChecks:string[];
}
const markers=[
 ["に","Zeit/Ziel に"],["で","Ort/Verkehrsmittel で"],["を","Objekt を"],
 ["は","Thema は"],["が","Subjekt/Fokus が"],["へ","Richtung へ"],
 ["です","höfliches です"],["ます","höfliches ます"],["ました","Vergangenheit ました"],
 ["ませんか","Einladung ませんか"],["ください","Bitte ください"],
 ["お願いします","Bitte お願いします"]
] as const;
/** Reflect on edited text without assigning correctness, fluency or mastery. */
export function compareP37Drafts(before:string,after:string):P37DraftComparison{
 const original=normalizeP26(before),revised=normalizeP26(after);
 const addedMarkers=markers.filter(([mark])=>!original.includes(mark)&&revised.includes(mark))
   .map(([,label])=>label);
 const removedMarkers=markers.filter(([mark])=>original.includes(mark)&&!revised.includes(mark))
   .map(([,label])=>label);
 const checks:string[]=[];
 if(addedMarkers.length||removedMarkers.length)
   checks.push("Prüfe, ob die Partikeln und Satzendungen nun zur beschriebenen Absicht passen.");
 if(original.length!==revised.length)
   checks.push("Ein längerer Satz ist nicht automatisch besser; prüfe, ob neue Wörter Information ergänzen.");
 if(!checks.length)
   checks.push("Vergleiche Satzfunktion, Höflichkeitsform und Bedeutung, auch wenn keine hervorgehobenen Muster wechselten.");
 checks.push("Textmuster sind keine automatische Grammatikdiagnose. Auch nicht aufgeführte Varianten können richtig sein.");
 return {changed:original!==revised,beforeLength:[...original].length,afterLength:[...revised].length,
   addedMarkers,removedMarkers,suggestedChecks:checks};
}
