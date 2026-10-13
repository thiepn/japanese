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
  if(prompt?.eventMetadata?.p46===true){
    const focus=prompt.eventMetadata.focus;
    const questionKind=prompt.eventMetadata.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"In einem ungesehenen Zusammenhang selbst formulieren",
      promptSpecificGoal:"Bestimme erneut, was in der neuen Situation gilt, statt Zahlen, "+
        "Orte oder Gründe aus dem alten Text zu übernehmen. Der Text ist nicht die Lösung "+
        "einer unabhängigen neuen Transferaufgabe.",
      lessonStage:"practice",action:"Tatsächlich fälligen oder freiwilligen Transfer öffnen"
    };
    if(prompt.eventMetadata.kind==="linked-lexicon")return {
      title:"Ein Lesewort aus dem Satz wiederfinden",
      promptSpecificGoal:"Erinnere dich an die Bedeutung und den konkreten Satzbeleg, "+
        "nicht nur an die isolierte Schreibweise. Der Beispieltext erklärt die Verwendung.",
      lessonStage:"learn",action:"Beleg im Lesetext ansehen"
    };
    if(focus==="reading-independent-writing")return {
      title:"Textinformation in einen eigenen japanischen Satz übertragen",
      promptSpecificGoal:"Beschreibe nur, was die Passage wirklich sagt. "+
        "Trenne gegebenen Fakt, Ursache und eigene Schlussfolgerung. "+
        "Andere korrekte Formulierungen können neben den verfassten Mustern bestehen.",
      lessonStage:"write",action:"Lesebeleg im Schreibeditor überarbeiten"
    };
    if(questionKind==="inference")return {
      title:"Schlussfolgerung aus mindestens zwei Textinformationen ableiten",
      promptSpecificGoal:"Suche Ursache und Folge oder alte und neue Angabe im selben Text. "+
        "Stelle die Schlussfolgerung nicht als direkt zitierten Fakt dar, wenn sie erschlossen werden muss.",
      lessonStage:"learn",action:"Text und Beleg für eine Inferenz erneut lesen"
    };
    if(questionKind==="purpose")return {
      title:"Absicht des Hinweises aus dem Text erklären",
      promptSpecificGoal:"Prüfe, warum die Nachricht geschrieben wurde und welche Handlung "+
        "von Lesenden erwartet wird. Unterscheide Hintergrundinformation von Anweisung.",
      lessonStage:"learn",action:"Textabsicht mit belegbarer Passage vergleichen"
    };
    return {
      title:"Das exakte Textdetail finden, statt eine alte Information zu raten",
      promptSpecificGoal:"Lies den Abschnitt mit Zeit, Ort, Menge oder Bedingung. "+
        "Eine spätere Korrektur im Text kann eine frühere Angabe ersetzen.",
      lessonStage:"learn",action:"Originalstelle vor erneuter Antwort lesen"
    };
  }
  if(prompt?.eventMetadata?.p45===true){
    const number=Number(prompt.eventMetadata.turnNumber);
    const isReturn=prompt.eventMetadata.focus==="delayed-independent-return";
    if(isReturn)return {
      title:"Eigenständige neue Situation lösen, ohne alten Antwortsatz zu übernehmen",
      promptSpecificGoal:"Behalte die kommunikative Funktion bei, aber prüfe neu den Gegenstand, "+
        "Zeitpunkt, Ort und Adressaten. Ein zuvor gesehenes Muster beantwortet die neue Situation nicht automatisch.",
      lessonStage:"practice",action:"FSRS-Fälligkeit und freiwilligen Transfer ansehen"
    };
    if(number===3)return {
      title:"Unerwarteten Wechsel erkennen und eigene Antwort überarbeiten",
      promptSpecificGoal:"Ein Teil des bisherigen Plans wurde verändert. Bestimme, welche "+
        "Information nicht mehr gilt, und welche Zusagen erhalten bleiben. "+
        "Formuliere ohne Multiple-Choice-Antworten neu.",
      lessonStage:"write",action:"Den dritten Gesprächszug im bisherigen Editor überarbeiten"
    };
    if(number===4)return {
      title:"Gespräch ohne Muster zum stimmigen Abschluss bringen",
      promptSpecificGoal:"Prüfe, ob deine letzte Aussage mit der geänderten Zeit, dem "+
        "Treffpunkt, der Menge oder der Reihenfolge übereinstimmt; "+
        "vermeide die versehentliche Rückkehr zum alten Plan.",
      lessonStage:"conversation",action:"Eigenständigen Abschluss erneut versuchen"
    };
    return {
      title:"Eigene japanische Antwort im Zusammenhang formulieren",
      promptSpecificGoal:"Achte auf die Antwortfunktion des Gegenübers und die "+
        "früheren eigenen Zusagen. Ersetze eine auswendig gelernte Phrase durch "+
        "eine passende, unabhängig formulierte Aussage.",
      lessonStage:"conversation",action:"Verlauf zunächst mit wenigen Hinweisen ansehen"
    };
  }
  if(prompt?.eventMetadata?.p44===true){
    const step=prompt.eventMetadata.stage;
    const focus=typeof prompt.eventMetadata.focus==="string"?
      prompt.eventMetadata.focus:"die soziale Absicht";
    const register=prompt.eventMetadata.register==="casual"?
      "Wähle einen vertrauten Ton, ohne die Beziehung übertrieben förmlich zu behandeln.":
      "Berücksichtige einen respektvollen Ton; eine höfliche Bitte ist nicht automatisch eine Zusage.";
    if(step==="return")return {
      title:"Soziale Absicht mit neuem Gegenüber erneut abrufen",
      promptSpecificGoal:"Prüfe im neuen Fall erneut Beziehung, Absicht und mögliche Ablehnung. "+
        "Die Antwort des früheren Dialogs passt nicht zwangsläufig unverändert.",
      lessonStage:"practice",action:"Unabhängigen Transfer wiederholen"
    };
    if(step==="reply")return {
      title:"Partnerreaktion in ihrem Kontext beantworten",
      promptSpecificGoal:"Höre auf die konkrete zweite Äußerung statt nur die Ausgangssituation zu wiederholen. "+
        register+" Das Lernziel betrifft "+focus+".",
      lessonStage:"conversation",action:"Zweite Gesprächsantwort erneut ansehen"
    };
    return {
      title:step==="contrast"?"Passende soziale Nuance unterscheiden":
        "Antwort nach Absicht und Beziehung umformulieren",
      promptSpecificGoal:"Unterscheide zuerst die Funktion der Aussage und die Beziehung der Personen. "+
        register+" Vergleiche nicht nur Grammatik, sondern auch mögliche Fehlinterpretationen.",
      lessonStage:step==="production"?"write":"learn",
      action:step==="production"?"Eigene Antwort schriftlich überarbeiten":
        "Beziehungs- und Antwortkontrast untersuchen"
    };
  }
  if(prompt?.eventMetadata?.p43===true){
    const route=prompt.eventMetadata.route;
    if(route==="return")return {
      title:"Neue Situation unabhängig weiterdenken",
      promptSpecificGoal:"Erinnere dich an die ursprüngliche Absicht, aber übertrage sie in den neuen Kontext. Der Ausgang einer geführten Entscheidung ist kein FSRS-Ergebnis. Lies die Lösung erst nach dem eigenständigen Versuch.",
      lessonStage:"practice",action:"Tatsächlich fälligen oder freiwilligen Abruf öffnen"
    };
    if(route==="opening")return {
      title:"Entscheidung und tatsächliche Folge unterscheiden",
      promptSpecificGoal:"Beachte zwei mögliche passende Wege und die nicht umsetzbare dritte Reaktion. Prüfe Angebot, Einschränkung und eigenes Ziel; ein alternativer brauchbarer Weg ist nicht automatisch falsch.",
      lessonStage:"conversation",action:"Beide Gesprächszweige vergleichen"
    };
    return {
      title:route==="repair"?"Nach einem Missverständnis klar reparieren":
        "Genau den selbst gewählten Gesprächszweig fortsetzen",
      promptSpecificGoal:"Der Gesprächspartner reagiert auf eine konkret getroffene Wahl. Behalte seine neue Information und das ursprüngliche Ziel im Blick; korrigiere nicht vorschnell zu einer Antwort aus dem anderen Zweig.",
      lessonStage:route==="repair"?"write":"conversation",
      action:route==="repair"?"Missverständnis in Schreibaufgabe korrigieren":
        "Partnerantwort und Konsequenz im Kontext ansehen"
    };
  }
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
