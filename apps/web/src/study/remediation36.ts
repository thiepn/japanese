import type {StudyPrompt} from "@thiepn/study-player";
import type {JourneyStage} from "./journey27";
export interface P36RemediationHint{
  title:string;promptSpecificGoal:string;lessonStage:JourneyStage;action:string;
}
const focusHints:Record<string,string>={
 topic:"Unterscheide bekanntes Thema は vom fokussierten Subjekt が. Die Antwort hängt von der Gesprächsfrage ab.",
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
  // P40 mistakes link back to the actual conversational function without
  // disclosing the exact answer or treating a non-due error as FSRS-due.
  if(prompt?.eventMetadata?.p42===true){
    const role=typeof prompt.eventMetadata.relationship==="string"?
      prompt.eventMetadata.relationship:"die angegebene Beziehung";
    const register=prompt.eventMetadata.register==="casual"?
      "Verwende natürliche vertraute Formen, keine unpassend steife Servicerede.":
      "Achte auf passende höfliche Fragen, Absagen, Bitten und Bestätigungen.";
    if(focus==="delayed-independent-return")return {
      title:"Neue Person, neue Situation – selbstständig übertragen",
      promptSpecificGoal:"Der vertraute Ausdruck allein reicht nicht. Bestimme zuerst, was jetzt anders ist, und prüfe die soziale Beziehung zu "+role+". "+register,
      lessonStage:"practice",action:"Unabhängigen Sprecherwechsel ansehen"
    };
    return {
      title:kind==="cross-context-reformulation"?
        "Veränderte Aussageabsicht und Sprecherrolle korrigieren":
        "Antwort an den tatsächlichen Gesprächspartner anpassen",
      promptSpecificGoal:"Prüfe zuerst die zuletzt mitgeteilte Änderung, dann den Gesprächspartner ("+role+"). "+register+
        " Behalte die übrigen vereinbarten Fakten bei, ohne eine Musterantwort abzulesen.",
      lessonStage:kind==="cross-context-reformulation"?"write":"conversation",
      action:kind==="cross-context-reformulation"?
        "Betroffenen Gesprächszug schriftlich überarbeiten":
        "Sprecherrolle und Gesprächsverlauf ansehen"
    };
  }
  if(prompt?.eventMetadata?.p40===true||prompt?.eventMetadata?.p41===true){
    if(focus==="delayed-independent-return")return {
      title:"Gelerntes in einer neuen Situation abrufen",
      promptSpecificGoal:"Erinnere dich an die kommunikative Absicht des ursprünglichen Gesprächs. Der neue Ort, Zeitpunkt oder Gegenstand erfordert eine selbstständig angepasste Formulierung.",
      lessonStage:"practice",action:"Fälligkeit und freien Transfer ansehen"
    };
    const repair=kind==="cross-context-reformulation";
    return {
      title:repair?"Missverständlichen Dialogzug gezielt verbessern":"Gesprächsabsicht über mehrere Züge halten",
      promptSpecificGoal:"Prüfe zuerst die letzte Frage des Gegenübers, dann deine Aufgabe ("+
        (typeof focus==="string"?focus:"Antwort")+
        "). Behalte den bestehenden Plan und die passende Höflichkeit bei. Die Lösung bleibt verborgen.",
      lessonStage:repair?"write":"conversation",
      action:repair?"Schreibkorrektur im Gespräch öffnen":"Zusammenhängenden Dialog ansehen"
    };
  }
  if(kind==="cross-context-reformulation")
    return {title:"Gelerntes in einem anderen Thema selbst formulieren",
      promptSpecificGoal:generic??"Prüfe, welche neue Situation angesprochen wird und wie die Partikeln, Höflichkeit und Zeitform diese Absicht ausdrücken.",
      lessonStage:"write",action:"Schreibaufgabe im neuen Kontext ansehen"};
  if(kind==="cross-context-transfer")
    return {title:"Form und Bedeutung zwischen Themen vergleichen",
      promptSpecificGoal:generic??"Bestimme die Gesprächsabsicht. Thema は, Subjekt が, Bewegungsziel に, Handlungsort で und Objekt を sind nicht beliebig austauschbar.",
      lessonStage:"learn",action:"Kontrast im Unterricht ansehen"};
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
