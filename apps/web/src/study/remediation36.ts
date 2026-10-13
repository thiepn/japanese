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
  if(prompt?.eventMetadata?.p60===true){
    const pKind=prompt.eventMetadata?.kind;
    const questionKind=prompt.eventMetadata?.questionKind;
    const delayed=prompt.eventMetadata?.focus==="delayed-independent-return";
    if(delayed)return {
      title:"Neue unbekannte A2-Situation nach echtem Lernabstand",
      promptSpecificGoal:"Bearbeite den neuen Fall ohne die alte japanische "
       +"Antwort zu kopieren. Prüfe erneut, welche Quelle verbindlich ist, "
       +"wer die Handlung bestätigt hat und welche Fragen offen bleiben. "
       +"Nur der vorhandene echte FSRS-Termin oder ein mindestens einen Tag "
       +"alter bewerteter Originalversuch gibt den Rückweg frei.",
      lessonStage:"practice",action:"Ungesehene neue Originalpraxis im StudyPlayer bearbeiten"
    };
    if(pKind==="a2-cumulative-misconception-repair")return {
      title:"Mehrere Fehler mit unterschiedlichen Originalbelegen reparieren",
      promptSpecificGoal:"Korrigiere nicht nur ein Zeitwort. Finde Ort, Uhrzeit, "
       +"Genehmigung, Kapazität und tatsächlichen Handlungsstand, soweit die "
       +"Originalquellen ihn belegen. Eine bloße Planung ist noch kein Abschluss.",
      lessonStage:"write",action:"Quellenbewusste mehrsätzige Korrektur verfassen"
    };
    if(pKind==="a2-updated-response")return {
      title:"Neueste Sprecherinformation in eine angemessene Antwort übertragen",
      promptSpecificGoal:"Vergleiche die frühere schriftliche Information mit "
       +"dem neuen Sprecher. Prüfe, ob sich eine Bedingung, Frist oder "
       +"Einwilligung wirklich geändert hat. Antworte höflich oder vertraut "
       +"entsprechend der Zielperson statt ein veraltetes Modell zu übernehmen.",
      lessonStage:"conversation",action:"Nach unerwartetem neuen Fakt angemessen reagieren"
    };
    if(pKind==="a2-cumulative-independent-writing")return {
      title:"Eigene zusammenhängende A2-Nachricht mit mehreren Quellen",
      promptSpecificGoal:"Nenne gesicherte Fakten und noch offene Dinge getrennt. "
       +"Verknüpfe mehrere japanische Sätze, benutze angemessenes Register "
       +"und respektiere 予定, まだ, てから, までに und die Sprecherabsicht. "
       +"Ein freier anderer Satz wird im Originalmustervergleich nicht "
       +"vollständig semantisch benotet.",
      lessonStage:"write",action:"Unbenotete ursprüngliche Learn-Revision öffnen"
    };
    if(pKind==="a2-cumulative-pragmatics")return {
      title:"Belegbare Lösung unter mehreren vernünftigen Reaktionen wählen",
      promptSpecificGoal:"Originalquellen können zwei passende nächste "
       +"Handlungen zulassen, aber keine erfundene Zustimmung oder bereits "
       +"abgeschlossene Zahlung. Unterscheide Tatsachen von Vorschlägen.",
      lessonStage:"learn",action:"Zwei verantwortliche Strategien vergleichen"
    };
    if(questionKind==="chronology")return {
      title:"Chronologie und aktuell gültige Ausnahme selbst rekonstruieren",
      promptSpecificGoal:"Unterscheide das ältere Schreiben, später verfasste "
       +"Nachrichten und die letzte belegte mündliche Anweisung. Achte auf "
       +"〜てから, までに, 予定です und schon ausgeführte Verben.",
      lessonStage:"learn",action:"Quellen nach zeitlichem Geltungsbereich sortieren"
    };
    if(questionKind==="speaker"||questionKind==="intention")return {
      title:"Sprecherabsicht und tatsächliche Autorität unterscheiden",
      promptSpecificGoal:"Eine höfliche Anfrage, eine Vermutung und eine "
       +"verbindliche Zusage stammen aus unterschiedlichen Sprecherrollen. "
       +"Begründe, warum die tatsächlich aktuelle Quelle die Antwort trägt.",
      lessonStage:"conversation",action:"Rolle und Absicht an Originalaussagen prüfen"
    };
    return {
      title:"Echten A2-Quellenbeleg finden statt einzelne Stichwörter raten",
      promptSpecificGoal:"Belege eine eigene japanische Antwort sowohl "
       +"mit dem Schrifttext als auch der neueren Sprecherinformation. "
       +"Ein lesbares Geräteskript und synthetisches TTS sind Text- und "
       +"Aussprachehilfen, keine objektiv gemessene Hörleistung.",
      lessonStage:"learn",action:"Originale Schrift- und Gesprächsquellen erneut vergleichen"
    };
  }
  if(prompt?.eventMetadata?.p59===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const questionKind=prompt.eventMetadata?.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Unbekannten Quellenkontext ohne alte Antwort wiederfinden",
      promptSpecificGoal:"Neuer P59-Fall nach tatsächlichem Lernabstand: Eigenständig "
       +"Person, neuere Quelle, Ausnahme und bestätigten Sachstand klären. "
       +"Die Original-FSRS-Karte wird nur nach einer tatsächlich bewerteten "
       +"StudyPlayer-Handlung geplant, nicht nach unbewertetem Entwurf.",
      lessonStage:"practice",action:"Eine andere A2-Situation ohne vorgezeigtes Modell lösen"
    };
    if(kind==="independent-message-correction")return {
      title:"Kumulative Fehler in einer praktischen Nachricht eigenständig korrigieren",
      promptSpecificGoal:"Identifiziere mindestens zwei unabhängig falsche Angaben "
       +"im Entwurf. Berücksichtige ältere schriftliche Quellen, "
       +"neuere Originalaussagen, belegte Kapazitäten und nur tatsächlich "
       +"erteilte Genehmigungen. Ein richtiger Einzelwert reicht nicht aus.",
      lessonStage:"write",action:"Mehrteilige Quellenkorrektur selbstständig formulieren"
    };
    if(kind==="independent-new-turn-repair")return {
      title:"Eine neue Nachricht verlangt eine echte Planrevision",
      promptSpecificGoal:"Das neue Gegenüber kann Zeit, Ort, Anzahl, Voraussetzung "
       +"oder bestätigten Abschluss ausdrücklich ändern. Passe die Reaktion "
       +"situationsgerecht an, ohne dass alte Annahmen automatisch gültig bleiben. "
       +"Nicht semantisch erkannte freie Varianten sind nicht automatisch falsch.",
      lessonStage:"conversation",action:"Auf den spezifischen neuen Sprecher angemessen reagieren"
    };
    if(kind==="independent-connected-writing")return {
      title:"Eigenständig mehrere Aussagen in natürliches Japanisch überführen",
      promptSpecificGoal:"Plane Zweck, Empfänger und passendes です／ます oder "
       +"lockeres Register. Verknüpfe mindestens zwei Quellen und ihre "
       +"Einschränkungen. Der unbenotete Learn-Editor ist für mehrstufige "
       +"Revision; der native Musterabgleich erkennt nicht alle natürlichen Texte.",
      lessonStage:"write",action:"Eigenen längeren Entwurf schreiben und unabhängig revidieren"
    };
    if(kind==="independent-multi-source-strategy")return {
      title:"Erst belegte Handlung, dann Kommunikation",
      promptSpecificGoal:"Prüfe, wer zuständig ist und welcher Schritt tatsächlich "
       +"bestätigt wurde. Zwei unterschiedliche vernünftige Strategien "
       +"sind im Original vorgesehen, die dritte schließt unberechtigt "
       +"von Verfügbarkeit, Wunsch oder altem Stand auf eine Zusage.",
      lessonStage:"learn",action:"Die verantwortliche Handlungsreihenfolge ableiten"
    };
    if(questionKind==="chronology")return {
      title:"Neue Quellenlage zeitlich statt schematisch einordnen",
      promptSpecificGoal:"Ordne ました, まだ, 予定, てから, までに, "
       +"ursprüngliche schriftliche Angaben und spätere mündliche "
       +"Ausnahmen. Prüfe, ob eine frühere Aussage ersetzt oder nur ergänzt wird.",
      lessonStage:"learn",action:"Originalen Ablauf mit Quelle und Zeitpunkt wiederherstellen"
    };
    if(questionKind==="speaker"||questionKind==="intent")return {
      title:"Sprecher, Zielperson und beabsichtigte Aussage unterscheiden",
      promptSpecificGoal:"Unterscheide berichtete Vermutung, verbindliche "
       +"Institutionenauskunft, höfliche Nachfrage, Zusage und "
       +"kommunikative Absicht. Mehrere natürliche Antworten können passen.",
      lessonStage:"learn",action:"Sprecherbeleg und Registerniveau gezielt vergleichen"
    };
    return {
      title:"Längere A2-Quellen unabhängig vergleichen statt ein Wort zu erraten",
      promptSpecificGoal:"Bestimme den relevanten japanischen Beleg in längeren "
       +"schriftlichen und gesprochenen Quellen, ohne eigene Sachverhalte "
       +"hinzuzuerfinden. Geräte-TTS und lesbares Skript sind Lernhilfen, "
       +"keine gemessene Hörprüfung oder offizieller Sprachnachweis.",
      lessonStage:"learn",action:"Mehrere relevante Originalbelege selbst auswählen"
    };
  }
  if(prompt?.eventMetadata?.p58===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const questionKind=prompt.eventMetadata?.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Neue Mehrquellenaufgabe nach echtem Lernabstand lösen",
      promptSpecificGoal:"Dies ist eine wirklich andere A2-Lebenssituation. "
       +"Verwende nicht den alten Antworttext, sondern ermittle Absicht, "
       +"aktuellen Beleg und noch offene Handlungen. Ein geöffnetes Transkript "
       +"oder eine unbenotete Antwort löst keine neue FSRS-Fälligkeit aus.",
      lessonStage:"practice",action:"Unbekannte Originalmission im nativen StudyPlayer bearbeiten"
    };
    if(kind==="cross-source-misconception-repair")return {
      title:"Konkrete falsche Aussage anhand mehrerer Quellen reparieren",
      promptSpecificGoal:"Berichtige nicht nur ein Schlagwort. Prüfe Zeitpunkt, "
       +"Sprecherrolle, die zunächst schriftliche Angabe und später mündlich "
       +"bestätigte oder geänderte Bedingung. Ein geplanter Termin ist nicht "
       +"automatisch eine abgeschlossene Handlung.",
      lessonStage:"write",action:"Eigene Korrektur mit Beleg schreiben"
    };
    if(kind==="multi-source-followup-response")return {
      title:"Unerwartete Zusatzinformation verändert die nächste Reaktion",
      promptSpecificGoal:"Fasse die ursprüngliche Lage zusammen, prüfe die "
       +"neue Aussage des Gegenübers und antworte nur mit gesichertem Status. "
       +"Achte auf Kapazität, Ausnahme, Genehmigung, Zeit oder neue Kosten.",
      lessonStage:"conversation",action:"Die neue eigenständige japanische Antwort formulieren"
    };
    if(kind==="independent-integrated-writing")return {
      title:"Schriftliche Reaktion mit mindestens zwei Quellen gestalten",
      promptSpecificGoal:"Verbinde konkrete Angaben aus Aushang, Nachricht und "
       +"mündlicher Information zu einer zweckmäßigen originalen japanischen "
       +"Mitteilung. Passe das Register der Zielperson an, ohne eine "
       +"unbestätigte Buchung oder bereits abgeschlossene Handlung zu erfinden. "
       +"Der endliche Antwortabgleich prüft keine offenen Texte umfassend.",
      lessonStage:"write",action:"Den ursprünglichen mehrstufigen Learn-Schreibeditor nutzen"
    };
    if(kind==="cross-modal-pragmatic-choice")return {
      title:"Zwei passende Antworten, eine konkrete Überinterpretation",
      promptSpecificGoal:"Die zwei originalen korrekten Möglichkeiten verfolgen "
       +"denselben belegten Sachstand. Die andere Alternative verwechselt "
       +"typischerweise Antrag, Planung, Bestätigung oder Ausnahme mit Abschluss.",
      lessonStage:"learn",action:"Originalen Sachstand vor der Entscheidung rekonstruieren"
    };
    if(questionKind==="chronology")return {
      title:"Erst schriftliche Information, dann spätere gesprochenen Korrekturen",
      promptSpecificGoal:"Überlege, was beim ersten Aushang galt, was die Nachricht "
       +"nur vermutet und was die letzten Sprecher tatsächlich bestätigen. "
       +"Ordne 予定です, までに, てから und bereits abgeschlossene Aktionen.",
      lessonStage:"learn",action:"Mehrere Originalbelege zeitlich vergleichen"
    };
    return {
      title:"Zwei unabhängige Originalquellen mit Sprecher und Beleg verbinden",
      promptSpecificGoal:"Verwechsele die ursprüngliche Nachricht nicht mit der "
       +"späteren Bestätigung. Das normale StudyPlayer-Transkript ist bewusst "
       +"lesbar und beweist keine real gemessene Audioverständnisleistung. "
       +"Belege und Ausnahmen kontrollieren.",
      lessonStage:"learn",action:"Aushang, Nachricht und gesprochene Originalzeilen vergleichen"
    };
  }
  if(prompt?.eventMetadata?.p57===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const questionKind=prompt.eventMetadata?.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Neue schriftliche Situation nach echtem Lernabstand",
      promptSpecificGoal:"Der neue P57-Kontext hat andere Personen, Zeiten oder "
       +"Bedingungen. Verwende keine alte Modellmail. Eine FSRS-Karte wird nur "
       +"durch eine bestehende unabhängig bewertete StudyPlayer-Antwort fällig; "
       +"ungespeicherte Entwürfe erzeugen keine Benotung.",
      lessonStage:"practice",action:"Neue Originalnachricht unabhängig schreiben"
    };
    if(kind==="message-error-revision")return {
      title:"Konkrete falsche Information im Entwurf berichtigen",
      promptSpecificGoal:"Vergleiche alle Nachrichten, besonders spätere Korrekturen. "
       +"Überarbeite nur nach belegten Daten, lasse bestätigte Bedingungen bestehen "
       +"und passe die Höflichkeit an die Rolle des Empfängers an.",
      lessonStage:"write",action:"Originalen fehlerhaften Entwurf selbstständig korrigieren"
    };
    if(kind==="multi-message-written-followup")return {
      title:"Neue Rückmeldung ändert deine bisherige Nachricht",
      promptSpecificGoal:"Lies die neueste Antwort nicht als bloße Wiederholung. "
       +"Eine Bitte, Absage, Kapazitätsgrenze oder Prüfung kann den Entwurf verändern. "
       +"Antworte unter Beibehaltung der noch gültigen alten Bedingungen.",
      lessonStage:"write",action:"Unerwartete Originalnachricht angemessen beantworten"
    };
    if(kind==="functional-original-writing")return {
      title:"Eigene zweckmäßige Nachricht mit Empfänger, Absicht und Status",
      promptSpecificGoal:"Verfasse selbst zwei passende japanische Sätze, die Anlass, "
       +"Wunsch, Rückfrage oder Bestätigung deutlich machen. Bezeichne die nicht "
       +"bewilligte Anfrage niemals als schon abgeschlossen. "
       +"Ein exakter Musterabgleich deckt nicht alle guten Antworten ab.",
      lessonStage:"write",action:"Im bestehenden Learn-Editor entwerfen und eigenständig revidieren"
    };
    if(questionKind==="chronology")return {
      title:"Mehrere Nachrichten zeitlich und kausal verknüpfen",
      promptSpecificGoal:"Beachte alte und neuere Angaben sowie までに, てから, 予定です "
       +"und bereits abgeschlossene versus angekündigte Handlungen. "
       +"Die letzte Nachricht kann einen Termin ausdrücklich ersetzen.",
      lessonStage:"learn",action:"Die konkrete zeitliche Textfolge erneut rekonstruieren"
    };
    if(questionKind==="status")return {
      title:"Angefragt, angenommen, bestätigt und erledigt unterscheiden",
      promptSpecificGoal:"Formularsendung ist keine Teilnahmezusage, freie Räume "
       +"sind keine abgeschlossene Buchung, gespeicherte Entwürfe keine "
       +"Versandbestätigung und angekündigte Termine keine vollzogene Handlung.",
      lessonStage:"learn",action:"Schriftlichen Beleg für den tatsächlichen Status finden"
    };
    return {
      title:"Schriftliche Quelle, Sprecher und belegte Ursache beachten",
      promptSpecificGoal:"Wer schrieb welche Aussage und auf welcher Grundlage? "
       +"Behaupte keine unbelegte Genehmigung. Nutze die erhaltenen Originaltexte "
       +"mit ihren Fristen, Rollen und korrigierten Informationen.",
      lessonStage:"learn",action:"Japanische Originalnachrichten mit Sprecherbelegen erneut lesen"
    };
  }
  if(prompt?.eventMetadata?.p56===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const branch=prompt.eventMetadata?.branch;
    if(focus==="delayed-independent-return")return {
      title:"Späteren ungewohnten Gesprächskontext unabhängig lösen",
      promptSpecificGoal:"Die neue A2-Situation hat andere Personen, Zeiten oder Hinweise. "+
       "Nutze nicht die vorherige Modellantwort, sondern kläre die jetzige Absicht. "+
       "Die bestehende FSRS-Karte entsteht nur aus einem wirklich bewerteten "+
       "StudyPlayer-Versuch, nicht aus einem im Studio gesehenen Text.",
      lessonStage:"practice",action:"Originalen neuen Kontext unabhängig abrufen"
    };
    if(kind==="interaction-misconception-repair"||branch==="repair")return {
      title:"Missverständnis ausdrücklich reparieren, ohne es zu verdecken",
      promptSpecificGoal:"Deine erste Antwort war nicht mit der Partneraussage vereinbar. "+
       "Markiere den Irrtum kurz, entschuldige dich wenn passend, "+
       "und formuliere die korrigierte japanische Aussage mit richtigem "+
       "Objekt, Zeitpunkt, Register und Sicherheit.",
      lessonStage:"conversation",action:"Den echten Reparaturzweig selbstständig fortsetzen"
    };
    if(kind==="interaction-independent-followup")return {
      title:"Unerwartete Folgeäußerung im gewählten Zweig verarbeiten",
      promptSpecificGoal:"Lies zuerst nur die konkrete neue Antwort des Gegenübers. "+
       "Eine neue Bedingung kann deinen ersten Vorschlag verändern. "+
       "Der direkte und alternative Zweig haben verschiedene Ziele "+
       "und werden nicht zu einer allgemeinen Musterantwort vermischt.",
      lessonStage:"conversation",action:"Den gewählten Originalgesprächszweig fortsetzen"
    };
    if(kind==="interaction-route-choice")return {
      title:"Zwei passende Einstiege mit unterschiedlichen Gesprächsfolgen",
      promptSpecificGoal:"Wähle nach Beziehung, Absicht und nachweisbarer Information. "+
       "Zwei ausdrücklich verfasste Wege sind gültig; die dritte Antwort "+
       "enthält eine konkret erklärte Bedeutungsverwechslung.",
      lessonStage:"learn",action:"Direkten und alternativen Originalweg vergleichen"
    };
    return {
      title:"Spontane A2-Reaktion eigenständig und situationsgerecht formulieren",
      promptSpecificGoal:"Trenne Bitte von Zusage, Vorschlag von Entscheidung, "+
       "Gerücht von bestätigter Information und höflichen Ausdruck von bloßem Versprechen. "+
       "Alternative korrekte japanische Formulierungen werden nicht generell bewertet.",
      lessonStage:"write",action:"Eigene Antwort ohne vorgegebene Formulierung schreiben"
    };
  }
  if(prompt?.eventMetadata?.p55===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const questionKind=prompt.eventMetadata?.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Neuen Gesprächskontext ohne bekanntes Modell eigenständig lösen",
      promptSpecificGoal:"Die spätere P55-Aufgabe hat andere Personen, Zahlen oder Gründe. "+
       "Wähle die tatsächlich passende Sprecherabsicht und formulierte Aussage, "+
       "ohne die alte Szene als neues Hörmaterial auszugeben. Keine FSRS-Fälligkeit "+
       "aus ungesehener Übung erfinden.",
      lessonStage:"practice",action:"Neuen A2-Kontext im originalen StudyPlayer bearbeiten"
    };
    if(kind==="connected-listening-response")return {
      title:"Eigenständige japanische Reaktion mit klarer Sprecherrolle",
      promptSpecificGoal:"Was muss der Adressat wissen oder entscheiden? "+
       "Antworte situativ mit angemessenem Register und Zeitbezug. "+
       "Unbewertetes Nachsprechen und getippte Texte sind kein "+
       "gemessenes Hör- oder Sprechzertifikat.",
      lessonStage:"write",action:"Im ursprünglichen Learn-Editor selbst formulieren und überarbeiten"
    };
    if(kind==="spoken-context-lexicon")return {
      title:"Wortgebrauch aus tatsächlichem Originalsprechzug erschließen",
      promptSpecificGoal:"Achte auf die gesprochene Wortverbindung und den Satzbezug. "+
       "Eine wörtlich belegte P53-Vokabel trägt keine automatische "+
       "Beherrschungswertung aus bloßem TTS-Anhören.",
      lessonStage:"learn",action:"Sprechzug bei Bedarf mit Geräte-TTS erneut hören"
    };
    if(questionKind==="speaker")return {
      title:"Sprecherzuordnung statt bloßer Schlagwörter",
      promptSpecificGoal:"Unterscheide denjenigen, der fragt, denjenigen, "+
       "der etwas behauptet, und die Person, deren Termin geändert wird. "+
       "Bei einer synthetischen Stimme ist die Rollenbeschriftung im "+
       "Originalskript die zuverlässige Zuordnung.",
      lessonStage:"learn",action:"Rollen und Aussagen am originalen Dialog nachlesen"
    };
    if(questionKind==="chronology")return {
      title:"Erst Vorschlag, dann Prüfung, erst danach Bestätigung",
      promptSpecificGoal:"Ordne zeitliche Ausdrücke, ursprüngliche Planung, "+
       "Änderung und tatsächlich erteilte Zusagen. "+
       "Ein vorgeschlagener neuer Termin wurde damit noch nicht bestätigt.",
      lessonStage:"learn",action:"Die relevanten Sprechzüge in Reihenfolge zuordnen"
    };
    if(questionKind==="cause")return {
      title:"Hintergrund und tatsächliche Ursache unterscheiden",
      promptSpecificGoal:"Suche in der Aussage den explizit genannten Grund "+
       "statt eine nur mögliche Erklärung auszufüllen. "+
       "Hörensagen mit そうです oder かもしれない bleibt als solches markiert.",
      lessonStage:"learn",action:"Kausale Wörter im originalen Dialog prüfen"
    };
    return {
      title:"Sprecherabsicht, Unsicherheit und belegt richtige Folgerung",
      promptSpecificGoal:"Eine höfliche Bitte ist keine Zusage, "+
       "ein im Gespräch vorgeschlagener Plan noch keine Entscheidung. "+
       "Nutze die originalen Sätze als Beleg. "+
       "Textgestützte StudyPlayer-Fragen messen keine tatsächliche Audiowahrnehmung.",
      lessonStage:"learn",action:"Den entscheidenden Sprechzug erneut abspielen oder lesen"
    };
  }
  if(prompt?.eventMetadata?.p54===true){
    const kind=prompt.eventMetadata?.kind;
    const focus=prompt.eventMetadata?.focus;
    const questionKind=prompt.eventMetadata?.questionKind;
    if(focus==="delayed-independent-return")return {
      title:"Neue Lesesituation unabhängig vom vorigen Text übertragen",
      promptSpecificGoal:"Dieser spätere P54-Fall enthält andere Personen, Daten oder Ursachen. "+
       "Rekonstruiere erst die neue Aussage, dann formuliere auf Japanisch. "+
       "Der alte Text steht hier nicht als Vorlage. Ein echter FSRS-Termin "+
       "wird nur durch die vorhandene MemoryTrace belegt.",
      lessonStage:"practice",action:"Unbekannte Originalaufgabe im vorhandenen StudyPlayer bearbeiten"
    };
    if(kind==="connected-reading-writing")return {
      title:"Textverstehen von eigener Japanischproduktion unterscheiden",
      promptSpecificGoal:"Entnimm Ursache, Reihenfolge und gesicherten Informationsstatus "+
       "dem Originaltext, bevor du eine neue Situation formulierst. "+
       "Neue freie Paraphrasen können richtig sein, auch wenn sie nicht "+
       "zu den wenigen verfassten Antwortmustern passen.",
      lessonStage:"write",action:"Originale Quelle erneut lesen und eigene Formulierung überarbeiten"
    };
    if(kind==="linked-lexicon")return {
      title:"P53-Wortfamilie im tatsächlichen P54-Text wiederfinden",
      promptSpecificGoal:"Nutze die ganze Satzumgebung statt nur die isolierte Übersetzung. "+
       "Prüfe die passende Partikel, die Wortverbindung und die konkrete "+
       "Aussage im Originalabsatz.",
      lessonStage:"learn",action:"Textstelle und P53-Kollokation miteinander vergleichen"
    };
    if(questionKind==="chronology")return {
      title:"Zeitliche Reihenfolge aus mehreren Absätzen rekonstruieren",
      promptSpecificGoal:"Markiere vorher, nachher, Frist und die verschiedenen Daten. "+
       "Eine angekündigte Absicht ist keine vollzogene Handlung. "+
       "Achte auf 〜てから, 〜前に, 〜までに und spätere Planänderungen.",
      lessonStage:"learn",action:"Absätze in eine belegbare Ereignisfolge bringen"
    };
    if(questionKind==="cause")return {
      title:"Tatsächlichen Grund statt bloßer Begleitumstände erklären",
      promptSpecificGoal:"Suche den ausdrücklich genannten Grund im Text, "+
       "nicht eine plausible Vermutung. Prüfe insbesondere ので, ため, "+
       "から und kausale Informationen aus verschiedenen Absätzen.",
      lessonStage:"learn",action:"Japanische Ursache am Originalbeleg wiederfinden"
    };
    if(questionKind==="speaker"||questionKind==="inference")return {
      title:"Sprecherquelle, bestätigte Information und Schlussfolgerung trennen",
      promptSpecificGoal:"Wer sagt was? Ist etwas nur geplant, gehört oder "+
       "belegt? Stelle keine bestätigte Genehmigung oder Erledigung aus "+
       "einer bloßen Vermutung her. Vergleiche dazu mehrere Textstellen.",
      lessonStage:"learn",action:"Sprecherrollen und Status der Originalinformationen markieren"
    };
    return {
      title:"Nachprüfbare Antwort am Originaltext belegen",
      promptSpecificGoal:"Lies die konkrete japanische Textstelle und "+
       "behalte Details wie Ort, Zahl, Tag und Einschränkung bei. "+
       "Der native Antwortvergleich besitzt nur authored Muster "+
       "und ist keine freie semantische Sprachbewertung.",
      lessonStage:"learn",action:"Japanischen Beleg ohne freie Ergänzungen erneut lesen"
    };
  }
  if(prompt?.eventMetadata?.p53===true){
    const domain=prompt.eventMetadata.domain;
    const focus=prompt.eventMetadata.focus;
    if(focus==="delayed-independent-return")return {
      title:"Wortgebrauch im neuen Kontext statt altes Satzmuster",
      promptSpecificGoal:"Der spätere Fall ändert bewusst Gegenstand oder Sprecherrolle. "+
        "Prüfe die Kollokation und die kommunikative Funktion des neuen Satzes, "+
        "nicht nur die deutsche Ein-Wort-Übersetzung. Nur ursprüngliche FSRS-Daten "+
        "machen eine Karte wirklich fällig.",
      lessonStage:"practice",action:"Originalen neuen Satz im bestehenden StudyPlayer produzieren"
    };
    if(focus==="situated-active-vocabulary")return {
      title:"Kollokation und passende Sprecherabsicht selbst produzieren",
      promptSpecificGoal:"Wähle eine der originalen typischen Wortverbindungen, "+
        "beachte die Partikel und beschreibe die neue Alltagssituation in "+
        "einem vollständigen japanischen Satz. Finite Muster sind keine "+
        "allgemeine Bewertung korrekter freier Paraphrasen.",
      lessonStage:"write",action:"Eigene Formulierung im ursprünglichen Schreiben-Editor revidieren"
    };
    if(domain==="travel"||domain==="services")return {
      title:"Praktische japanische Begriffe im Verkehr und Kundenkontakt unterscheiden",
      promptSpecificGoal:"Trenne beispielsweise Abfahrt von Ankunft, "+
        "Reservierung von Bestellung, Rückgabe von Austausch "+
        "und Bitte von bloßer Verfügbarkeit. Auch Zahlen, Register "+
        "und Zeitpunkt müssen mit dem konkreten Auftrag zusammenpassen.",
      lessonStage:"learn",action:"Die zwei originalen Kollokationen mit dem Kontext vergleichen"
    };
    if(domain==="study"||domain==="work"||domain==="digital")return {
      title:"Wortfamilie und konkreten Arbeitsvorgang unterscheiden",
      promptSpecificGoal:"Wurde der Text nur gespeichert oder tatsächlich gesendet? "+
        "Hat jemand um Rat gebeten, etwas berichtet oder Ergebnisse veröffentlicht? "+
        "Das Verb und seine Partikel zeigen unterschiedliche Arbeitsschritte.",
      lessonStage:"learn",action:"Bedeutungsnuance und neue Handlung in der Aufgabe markieren"
    };
    if(domain==="home"||domain==="health")return {
      title:"Japanisches Alltagswort aus dem passenden Bedeutungsfeld verwenden",
      promptSpecificGoal:"Prüfe Gegenstand, Zustand und typische Wortverbindung: "+
        "Wetterkälte versus kaltes Getränk, schmutzig werden versus reinigen "+
        "oder Untersuchung versus Behandlung. Kein medizinisches Ergebnis erfinden.",
      lessonStage:"learn",action:"Gebrauchssatz und konkrete Verwechslungswarnung wieder ansehen"
    };
    return {
      title:"Interpersonelle japanische Wortwahl und Register prüfen",
      promptSpecificGoal:"Wer bittet, dankt, lädt ein, lehnt ab oder berichtet eine Vermutung? "+
        "Ähnliche Wörter haben verschiedene soziale Zwecke. "+
        "Schreibe die gesamte situationsgerechte Äußerung, nicht nur die Vokabel.",
      lessonStage:"learn",action:"Sprecherrolle, Nuance und Originalbeispiel erneut betrachten"
    };
  }
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
