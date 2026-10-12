import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneyStage} from "./journey27";
export interface P36RemediationHint{
  title:string;promptSpecificGoal:string;lessonStage:JourneyStage;action:string;
}
const focusHints:Record<string,string>={
 particle:"Bestimme die Funktion der jeweiligen Phrase: Ziel に／へ, Tätigkeitsort oder Mittel で, Objekt を, Thema は.",
 register:"Prüfe Gesprächspartner und Situation: höfliche Formen wie です／ます／お願いします oder bewusst lockerer Stil.",
 time:"Stimmen Zeitangabe und Vergangenheitsform ました zur beschriebenen Handlung?",
 meaning:"Unterscheide Wunsch, Erlaubnis, Einladung, Menge und die Absicht deiner Aussage.",
 function:"Beachte die kommunikative Funktion: fragen, vorschlagen, bestätigen, entschuldigen oder ablehnen.",
 form:"Vergleiche Satzende, Partikel und Fragestruktur, ohne eine einzige Wortstellung vorauszusetzen."
};
/** The hint is derived from authored prompt metadata, never from stored free text.
 * Avoid displaying the correct target before the learner elects to open it. */
export function p36RemediationHint(id:string,prompts:readonly StudyPrompt[]):P36RemediationHint{
  const prompt=prompts.find(p=>p.id===id);
  const kind=prompt?.eventMetadata?.kind;
  const focus=prompt?.eventMetadata?.focus;
  const generic=typeof focus==="string"?focusHints[focus]:undefined;
  if(kind==="role-response"||typeof kind==="string"&&kind.startsWith("continuity"))
    return {title:"Gesprächsabsicht im Kontext",
      promptSpecificGoal:generic??"Lies zuerst die Frage des Partners. Antworte auf deren Absicht, nicht bloß mit einem passenden Satz aus einem anderen Kontext.",
      lessonStage:"conversation",action:"Dialog und Sprecherrolle ansehen"};
  if(kind==="sentence-order-variation"||kind==="sentence-order"||kind==="sentence-build")
    return {title:"Satzteile und Funktionen",
      promptSpecificGoal:generic??"Ordne Zeit, Ort, Objekt und Verb. Die Partikeln bestimmen die Beziehung, nicht allein die Wortposition.",
      lessonStage:"build",action:"Satzbau im Kontext öffnen"};
  if(kind==="reformulation"||kind==="contextual-contrast"||kind==="register-contrast"||
      prompt?.skill==="form_selection")
    return {title:"Grammatische Funktion und Register",
      promptSpecificGoal:generic??"Vergleiche im angegebenen Kontext Satzart, Partikel und Höflichkeitsniveau. Zwei Formen können korrekt, aber unterschiedlich gemeint sein.",
      lessonStage:"learn",action:"Kontext und Grammatik ansehen"};
  return {title:"Kontext erneut erschließen",
    promptSpecificGoal:generic??"Nutze den bekannten Zusammenhang und die Bedeutung der Wörter. Das Ergebnis ist keine globale Sprachstandnote.",
    lessonStage:"learn",action:"Lernkontext öffnen"};
}
