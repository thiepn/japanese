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
  if(prompt?.eventMetadata?.p52===true){
    const kind=prompt.eventMetadata.kind;
    const domain=prompt.eventMetadata.domain;
    if(prompt.eventMetadata.focus==="delayed-independent-return")return {
      title:"Unbekannten japanischen Satz erst vom Kontext her planen",
      promptSpecificGoal:"Diese Aufgabe verändert tatsächlich Sprecher, Gegenstand oder Ziel. "+
        "Lies den neuen Ausgangssatz und entscheide vor dem Schreiben, "+
        "welche Aussage erhalten bleiben oder bewusst geändert werden soll. "+
        "Ein FSRS-Termin stammt ausschließlich aus der vorhandenen MemoryTrace.",
      lessonStage:"practice",action:"Neuen Originalfall im bestehenden StudyPlayer bearbeiten"
    };
    if(kind==="independent-transformation")return {
      title:"Grammatik auf neue Sachverhalte übertragen",
      promptSpecificGoal:"Übertrage die Regel nicht nur Wort für Wort. "+
        "Prüfe die Rollen, die neu eingeführte Zeit und die geforderte Satzfunktion. "+
        "Unbekannte freie Paraphrasen sind nicht automatisch sprachlich falsch.",
      lessonStage:"write",action:"Eigenen japanischen vollständigen Satz überarbeiten"
    };
    if(domain==="evidence")return {
      title:"Bericht, persönliche Einschätzung und sichtbare Vermutung",
      promptSpecificGoal:"Frage, wer die Information behauptet, ob sie beobachtet "+
        "oder nur gehört wurde und wie sicher sie ist. "+
        "〜そうです nach Grundform ist nicht dasselbe wie 〜そうです aus dem sichtbaren Eindruck.",
      lessonStage:"learn",action:"Japanischen Ausgangssatz und Evidenzquelle vergleichen"
    };
    if(domain==="register"||domain==="perspective"||domain==="voice")return {
      title:"Sprecherrolle, Höflichkeit und Handelndenbezug",
      promptSpecificGoal:"Bestimme, wer spricht, wer die Handlung ausführt "+
        "und wer betroffen ist. Eine Bitte, ein Befehl, ein empfangener "+
        "Gefallen und ein passiver Bericht haben unterschiedliche Blickwinkel.",
      lessonStage:"learn",action:"Rollen im Original und in der gewünschten Umformung markieren"
    };
    if(domain==="chronology"||domain==="aspect"||domain==="condition")return {
      title:"Reihenfolge, Zustand und Bedingung nicht verwechseln",
      promptSpecificGoal:"Prüfe, ob eine Handlung vorher, nachher oder gleichzeitig "+
        "stattfindet und ob die Folge sicher, hypothetisch oder unerwartet ist. "+
        "Achte besonders auf 〜てから, 〜前に, 〜ている, 〜たら und 〜ても.",
      lessonStage:"learn",action:"Zeitachse und Bedeutungsänderung rekonstruieren"
    };
    return {
      title:"Sinn der vollständigen Satztransformation überprüfen",
      promptSpecificGoal:"Vergleiche Ausgangssatz und Kommunikationsziel: "+
        "Nur ausdrücklich verlangte Fakten oder Bewertungen ändern. "+
        "Der native StudyPlayer vergleicht verfasste Antworten, keine beliebigen freien Paraphrasen.",
      lessonStage:"learn",action:"Drei originale Modelle erst nach eigenem Versuch vergleichen"
    };
  }
  if(prompt?.eventMetadata?.p51===true){
    const kind=prompt.eventMetadata.kind;
    const domain=prompt.eventMetadata.domain;
    const focus=prompt.eventMetadata.focus;
    if(focus==="delayed-independent-return")return {
      title:"A2 Grammatik in neuen Sprecher- und Alltagssituationen übertragen",
      promptSpecificGoal:"Die neue Situation enthält eine neue Rolle, Zeit, Absicht oder "+
        "Evidenzquelle. Wähle die grammatische Form nach Bedeutung und "+
        "Kontext statt einen alten Beispielsatz auszutauschen. "+
        "Nur echte bestehende FSRS-Trace-Daten machen eine Karte fällig.",
      lessonStage:"practice",action:"Unbekannten Kontext im vorhandenen StudyPlayer beantworten"
    };
    if(focus==="contextual-grammar-writing")return {
      title:"A2 Bedeutungsunterschied in eigenem Satz sichtbar machen",
      promptSpecificGoal:"Lies zuerst die genannte Kommunikationsabsicht und "+
        "den Adressaten. Bestimme, ob du bittest, anbietest, eine Absicht "+
        "aussprichst, etwas nur vermutest oder eine notwendige Bedingung benennst. "+
        "Erst dann wähle die Form.",
      lessonStage:"write",action:"Begründeten Originalkontrast im Schreibeditor reflektieren"
    };
    if(kind==="contextual-meaning")return {
      title:"Form, Sprecherperspektive und Aussagefunktion auseinanderhalten",
      promptSpecificGoal:"Die beiden Formen sind nicht allein durch ein "+
        "deutsches Stichwort austauschbar. Vergleiche die Originalaussage "+
        "mit der Sprecherrolle, dem Zeitpunkt und der beabsichtigten Folge. "+
        "Das Textmuster ist keine allgemeine Bedeutungsbewertung.",
      lessonStage:"learn",action:"Kontext, drei Beispielsätze und Erklärungen erneut öffnen"
    };
    if(domain==="evidence")return {
      title:"Vermutung, eigene Meinung und fremden Bericht sauber markieren",
      promptSpecificGoal:"Prüfe, ob eine Aussage aus eigener Beobachtung, "+
        "persönlicher Erwartung oder berichteter Fremdquelle stammt. "+
        "Möglichkeit ist weder Gewissheit noch eine offiziell bestätigte Tatsache.",
      lessonStage:"learn",action:"Originalbeleg für den Informationsstatus wiederfinden"
    };
    if(domain==="condition")return {
      title:"Bedingung, natürliche Folge und Zugeständnis unterscheiden",
      promptSpecificGoal:"Frage, ob eine Handlung bei einem Ereignis folgt, "+
        "trotz des Ereignisses stattfindet oder als Vorschlag nach Eintritt "+
        "der Bedingung geäußert wird. Nicht alle wenn-Formen sind identisch.",
      lessonStage:"learn",action:"Situationsbedingung und Konsequenz rekonstruieren"
    };
    if(domain==="permission"||domain==="social")return {
      title:"Erlaubnis, Pflicht, Bitte und Hilfe-Richtung prüfen",
      promptSpecificGoal:"Wer darf, muss oder soll etwas tun? "+
        "Welcher Sprecher ist Helfer oder Empfänger? "+
        "Prüfe bei Bitten, ob das soziale Verhältnis eine direkte Form erlaubt.",
      lessonStage:"learn",action:"Sprecher- und Empfängerrollen in den Originalbeispielen vergleichen"
    };
    return {
      title:"Zeit, Aspekt oder grammatische Satzrolle im Kontext erklären",
      promptSpecificGoal:"Prüfe konkrete Verben, Argumente, Zeitadverbien "+
        "und die Perspektive. Eine Lernform ersetzt nicht automatisch "+
        "eine andere, selbst wenn die deutsche Kurzübersetzung ähnlich ist.",
      lessonStage:"learn",action:"Originalkontrast erklären, dann neuen Satz schreiben"
    };
  }
  if(prompt?.eventMetadata?.p50===true){
    const reason=prompt.eventMetadata.questionKind;
    const focus=prompt.eventMetadata.focus;
    if(focus==="delayed-independent-return")return {
      title:"Gelerntes ohne alte Originalfakten übertragen",
      promptSpecificGoal:"Die spätere Aufgabe besitzt andere Daten und keine Originalquelle. "+
        "Identifiziere eine neue gültige Zeit, Ortsangabe, Einschränkung oder "+
        "Unsicherheit, bevor du selbst schreibst. Nur eine reale FSRS-Fälligkeit ist fällig.",
      lessonStage:"practice",action:"Neuen Kontext eigenständig im ursprünglichen StudyPlayer lösen"
    };
    if(focus==="integrated-source-writing")return {
      title:"Schriftlichen Plan und gesprochene Aktualisierung verbinden",
      promptSpecificGoal:"Schreibe nicht die erste alte Angabe ab. "+
        "Vergleiche Zweck und Gültigkeit der schriftlichen Mitteilung "+
        "mit der gesprochenen Korrektur oder bestätigten Bedingung. "+
        "Freies Japanisch hat keine allgemeine semantische Automatikbewertung.",
      lessonStage:"write",action:"Eigene Reaktion mit Quellenbezug überarbeiten"
    };
    if(prompt.eventMetadata.kind==="cross-modal-context-word")return {
      title:"Ein japanisches Wort in seiner Originalquelle abrufen",
      promptSpecificGoal:"Bestimme anhand der kurzen schriftlichen oder gesprochenen "+
        "Belegstelle, ob es um einen Ausfall, eine Korrektur, eine Frist oder "+
        "eine noch offene Entscheidung geht.",
      lessonStage:"learn",action:"Die zugehörige Originalquelle erneut lesen bzw. anhören"
    };
    if(reason==="correction")return {
      title:"Gedruckte Angabe und gesprochenen neuen Stand abgleichen",
      promptSpecificGoal:"Lies die ursprüngliche Zahl, den Ort oder Gegenstand. "+
        "Höre anschließend でも, 変更, では oder そのまま. "+
        "Ersetze ausschließlich ausdrücklich geänderte Elemente.",
      lessonStage:"learn",action:"Originalbelege für frühere und gültige Information gegenüberstellen"
    };
    if(reason==="inference")return {
      title:"Gewissheit, Voraussetzung und mögliche Folgen unterscheiden",
      promptSpecificGoal:"Achte auf まだ, 予定, かもしれません, "+
        "場合, だけ und höfliche Vorschläge. "+
        "Ein angebotener Termin, eine vermutete Sperrung oder eine mögliche "+
        "Abfahrt ist nicht automatisch eine verbindliche Zusage.",
      lessonStage:"learn",action:"Gelesenen und gesprochenen Beleg für den Schluss auswählen"
    };
    return {
      title:"Einen genauen Fakt aus beiden Modalitäten identifizieren",
      promptSpecificGoal:"Prüfe, welche Quelle Uhrzeit, Menge, Person oder "+
        "Bedingung ausdrücklich nennt. Trenne vergleichbare, aber "+
        "unterschiedliche Zahlen wie Treffzeit und Veranstaltungsbeginn.",
      lessonStage:"learn",action:"Gezielten Satz wiederholen und schriftlichen Wert prüfen"
    };
  }
  if(prompt?.eventMetadata?.p49===true){
    const kind=prompt.eventMetadata.questionKind;
    const focus=prompt.eventMetadata.focus;
    if(focus==="delayed-independent-return")return {
      title:"Andere Angaben in einem neuen Alltagsdokument selbst anwenden",
      promptSpecificGoal:"Die neue Situation verändert Gültigkeit, Datum, Gebühr, "+
        "Ausnahme oder Gegenstand. Übernimm keine alte Zahl oder Bedingung. "+
        "Eine Wiederholung ist nur bei echtem FSRS-Termin fällig.",
      lessonStage:"practice",action:"Freiwilligen oder tatsächlich fälligen Transfer bearbeiten"
    };
    if(focus==="document-supported-writing")return {
      title:"Dokumentzweck in einen eigenen japanischen Satz übertragen",
      promptSpecificGoal:"Wähle eine kommunikative Reaktion, die zur Dokumentart passt: "+
        "um Erlaubnis bitten, einen Termin bestätigen, sich anmelden oder um Hilfe fragen. "+
        "Trenne belegte Bedingungen von eigenen Vermutungen.",
      lessonStage:"write",action:"Originalbeispiel erst nach eigener Entwurfsrevision vergleichen"
    };
    if(prompt.eventMetadata.kind==="linked-lexicon")return {
      title:"Wort aus dem tatsächlichen Dokumentgebrauch abrufen",
      promptSpecificGoal:"Lies die konkrete Formulierung und beachte, ob das Wort "+
        "eine Frist, einen Preisaufschlag, eine Berechtigung oder eine Ausnahme markiert. "+
        "Die Schriftform ist nur ein Teil der funktionalen Bedeutung.",
      lessonStage:"learn",action:"Dokument und Wortbeleg wieder ansehen"
    };
    if(kind==="condition")return {
      title:"Bedingung und Geltungsbereich prüfen",
      promptSpecificGoal:"Achte auf だけ, まで, 以降, 場合, 必要 und Verneinungen. "+
        "Eine Ausnahme kann nur eine Uhrzeit, Wochentagsgruppe, Ware oder Person betreffen.",
      lessonStage:"learn",action:"Exakte Stelle für die Bedingung finden"
    };
    if(kind==="inference")return {
      title:"Aus dem Originaldokument nur belegbare Folgen schließen",
      promptSpecificGoal:"Verwechsle Offen- und Einlasszeit, Ticketpreis und Gebühr, "+
        "Anmeldung und Zusage, Gültigkeit und bloße Möglichkeit nicht. "+
        "Wenn das Dokument eine Garantie nicht nennt, erfinde keine.",
      lessonStage:"learn",action:"Textbeleg und Reichweite der Schlussfolgerung prüfen"
    };
    return {
      title:"Konkretes Datum, Zeitfenster oder Merkmal lokalisieren",
      promptSpecificGoal:"Suche den Wert genau neben seinem Etikett. "+
        "Mehrere Zahlen in Menüs, Tickets und Fahrplänen gehören zu verschiedenen Funktionen.",
      lessonStage:"learn",action:"Dokumentstelle und Etikett noch einmal lesen"
    };
  }
  if(prompt?.eventMetadata?.p48===true){
    const q=prompt.eventMetadata.questionKind;
    const focus=prompt.eventMetadata.focus;
    if(focus==="delayed-independent-return")return {
      title:"In einer unbekannten Situation unabhängig handeln",
      promptSpecificGoal:"Diese neue Übung hat andere Zeiten, Orte, Rollen oder Voraussetzungen. "+
        "Übernimm keine alten Fakten nur deshalb, weil die Kommunikationsabsicht ähnlich ist. "+
        "Fälligkeit stammt allein aus bestehenden FSRS-MemoryTraces.",
      lessonStage:"practice",action:"Nur reale fällige oder klar freiwillige Wiederholung öffnen"
    };
    if(focus==="source-supported-writing")return {
      title:"Verbindlichen Endstand aus drei Originalquellen formulieren",
      promptSpecificGoal:"Trenne erste Angabe, spätere Korrektur und unabhängig geltende Regel. "+
        "Notiere die Schlussfolgerung, ohne eine hypothetische Möglichkeit als sichere Tatsache auszugeben.",
      lessonStage:"write",action:"Quellengebundenen Text im bisherigen Schreibeditor überarbeiten"
    };
    if(q==="reconcile")return {
      title:"Welche Aussage gilt zuletzt – und für welchen Teil?",
      promptSpecificGoal:"Vergleiche die drei Quellen chronologisch. Eine Korrektur kann nur "+
        "Raum, Uhrzeit, Gegenstand oder Teilprogramm betreffen. Behalte die anderen bestätigten Angaben.",
      lessonStage:"learn",action:"Quelle, Zeitpunkt und Geltungsbereich erneut gegenüberstellen"
    };
    if(q==="inference")return {
      title:"Eine Folgerung aus mehreren Aussagen erklären",
      promptSpecificGoal:"Prüfe die Bedingungen und zeitlichen Grenzen. Unterscheide "+
        "was direkt gesagt ist, was daraus folgt und was trotz widersprüchlich klingender Angaben offenbleibt.",
      lessonStage:"learn",action:"Originalbelege für die eigene Schlussfolgerung vergleichen"
    };
    return {
      title:"Die stützenden Originalquellen und ihre Rolle identifizieren",
      promptSpecificGoal:"Entscheide, ob eine Quelle eine verbindliche Änderung, "+
        "einen älteren Plan, eine allgemeine Regel, persönliche Meinung oder noch unsichere Prognose enthält. "+
        "Die Schlussfolgerung braucht passende Quellen und darf keine erfundene Sicherheit behaupten.",
      lessonStage:"learn",action:"Quellenbelege und konkrete Formulierungen erneut lesen"
    };
  }
  if(prompt?.eventMetadata?.p47===true){
    const focus=prompt.eventMetadata.focus;
    const kind=prompt.eventMetadata.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Gehörte Funktion ohne alten Wortlaut übertragen",
      promptSpecificGoal:"Die neue Situation verändert Zeit, Ort, Gegenstand oder Voraussetzung. "+
        "Wiederhole keinen alten Mustersatz ohne diese Fakten selbst zu prüfen. "+
        "Ein FSRS-Abruf erfordert eine wirkliche, fällige Lernkarte.",
      lessonStage:"practice",action:"Unabhängigen Kontexttransfer im vorhandenen StudyPlayer öffnen"
    };
    if(prompt.eventMetadata.kind==="listening-followup-writing")return {
      title:"Auf eine gehörte Situation eigenständig reagieren",
      promptSpecificGoal:"Nimm die letzte gültige Information aus dem Gespräch. "+
        "Beschreibe eine passende eigene Handlung, statt den früheren verworfenen Plan zu bestätigen. "+
        "Textbezogene Übung ersetzt keine geprüfte Audioleistung.",
      lessonStage:"write",action:"Situationsgerechte Antwort im bestehenden Editor überarbeiten"
    };
    if(kind==="inference")return {
      title:"Gehörte Einschränkung und Schlussfolgerung verbinden",
      promptSpecificGoal:"Achte auf でも, しかし, では oder だけ. "+
        "Eine korrigierte Aussage kann eine frühere ersetzen; unterscheide Schluss "+
        "aus dem Gehörten von einem wörtlichen Detail.",
      lessonStage:"learn",action:"Original-TTS noch einmal hören, dann Beleg vergleichen"
    };
    if(kind==="intent")return {
      title:"Absicht der Sprecher aus dem Zusammenhang hören",
      promptSpecificGoal:"Prüfe, ob der Sprecher informiert, absagt, korrigiert, um Erlaubnis "+
        "bittet oder eine Reaktion erwartet. Versuche es erst ohne Transkript.",
      lessonStage:"learn",action:"Hörziel und neue Sprecherhandlung erläutern"
    };
    return {
      title:"Die letzte gültige Hörinformation erfassen",
      promptSpecificGoal:"Notiere nach dem ersten Hören Zeit, Ort, Anzahl oder Gegenstand. "+
        "Nach しかし oder einer ausdrücklichen Korrektur gilt möglicherweise eine neue Angabe.",
      lessonStage:"learn",action:"Ohne Transkript erneut hören und Details vergleichen"
    };
  }
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
