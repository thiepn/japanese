import type {StudyPrompt} from "@thiepn/study-player";
export interface P38CrossUnitContrast{
 id:string;focus:string;units:readonly string[];question:string;
 preferred:string;contrast:string;explanation:string;title:string;
}
/** Twenty original, context-specific A1/A2 transfer decisions.
 * The other sentence is contrasted for the stated communicative intention;
 * it is not necessarily universally ungrammatical. */
export const p38CrossUnitContrasts:readonly P38CrossUnitContrast[]=[
  {
    "id": "p38-cross-01",
    "focus": "は / が",
    "units": [
      "p23:introduction",
      "p23:ownership"
    ],
    "question": "Du stellst dich vor. Welcher Satz führt dich höflich als neues Gesprächsthema ein?",
    "preferred": "私は学生です。",
    "contrast": "私が学生です。",
    "explanation": "は etabliert die sprechende Person als Thema einer allgemeinen Vorstellung; が ist in dieser Gegenüberstellung stärker fokussierend und kann z. B. eine Identitätsfrage beantworten.",
    "title": "Einführung eines Themas versus Antwortfokus"
  },
  {
    "id": "p38-cross-02",
    "focus": "が / は",
    "units": [
      "p23:ownership",
      "p25:lostfound"
    ],
    "question": "Im Fundbüro fragst du, wer der Besitzer des verlorenen Schirms ist. Welche Frage ermittelt die unbekannte Person?",
    "preferred": "だれがこの傘の持ち主ですか。",
    "contrast": "だれはこの傘の持ち主ですか。",
    "explanation": "Das Fragewort だれ erhält in dieser gewöhnlichen Identifikationsfrage が, nicht das thematisierende は.",
    "title": "Unbekanntes Subjekt mit が"
  },
  {
    "id": "p38-cross-03",
    "focus": "で / に",
    "units": [
      "p23:places",
      "p25:library"
    ],
    "question": "Du möchtest sagen, dass du in der Bibliothek lernst, nicht dass du dorthin gehst.",
    "preferred": "図書館で勉強します。",
    "contrast": "図書館に勉強します。",
    "explanation": "で kennzeichnet den Ort einer Tätigkeit. に wird mit 行きます zum Ziel, nicht zum bloßen Tätigkeitsort.",
    "title": "Handlungsort で"
  },
  {
    "id": "p38-cross-04",
    "focus": "に / で",
    "units": [
      "p23:places",
      "p25:transport"
    ],
    "question": "Du sagst, dass du zum Bahnhof gehst. Welche Partikel benennt das Bewegungsziel?",
    "preferred": "駅に行きます。",
    "contrast": "駅で行きます。",
    "explanation": "に markiert das Bewegungsziel. Mit で müsste ein sinnvoller anderer Bezug wie ein Verkehrsmittel vorliegen.",
    "title": "Zielmarkierung に"
  },
  {
    "id": "p38-cross-05",
    "focus": "を / が",
    "units": [
      "p23:cafe",
      "p25:shopping"
    ],
    "question": "Du möchtest im Café ausdrücklich einen Kaffee bestellen.",
    "preferred": "コーヒーを一つお願いします。",
    "contrast": "コーヒーが一つお願いします。",
    "explanation": "を kennzeichnet das Bestellobjekt bei お願いします. が wäre in dieser festen Bestellkonstruktion unpassend.",
    "title": "Objekt を bei Bestellung"
  },
  {
    "id": "p38-cross-06",
    "focus": "で / に",
    "units": [
      "p25:transport",
      "p26:station-to-campus"
    ],
    "question": "Du nennst den Bus als Verkehrsmittel zur Universität.",
    "preferred": "バスで大学に行きます。",
    "contrast": "バスに大学で行きます。",
    "explanation": "で kennzeichnet das Verkehrsmittel; に kennzeichnet das Ziel der Bewegung.",
    "title": "Mittel で und Ziel に"
  },
  {
    "id": "p38-cross-07",
    "focus": "に / で",
    "units": [
      "p23:routine",
      "p25:appointment"
    ],
    "question": "Du vereinbarst ein Treffen am Freitag statt nur einen Ort zu beschreiben.",
    "preferred": "金曜日に会いましょう。",
    "contrast": "金曜日で会いましょう。",
    "explanation": "に markiert in dieser Aussage einen konkreten Trefftag. で bezeichnet hier keinen Handlungsort.",
    "title": "Konkreter Termin に"
  },
  {
    "id": "p38-cross-08",
    "focus": "には / で",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "question": "Du sagst, dass du in der Bibliothek gemeinsam mit anderen lernst.",
    "preferred": "図書館で一緒に勉強します。",
    "contrast": "図書館に一緒に勉強します。",
    "explanation": "Bei 勉強する erhält der Handlungsort で, auch wenn eine Person oder Zeit ergänzt wird.",
    "title": "Gemeinsames Lernen am Ort"
  },
  {
    "id": "p38-cross-09",
    "focus": "たい / てもいい",
    "units": [
      "p25:library",
      "p26:library-project"
    ],
    "question": "Du benötigst ausdrücklich die Erlaubnis, ein Buch auszuleihen.",
    "preferred": "この本を借りてもいいですか。",
    "contrast": "この本を借りたいです。",
    "explanation": "てもいいですか erbittet Erlaubnis; たいです äußert nur einen Wunsch. Beide Formen können für unterschiedliche Absichten richtig sein.",
    "title": "Erlaubnis statt Wunsch"
  },
  {
    "id": "p38-cross-10",
    "focus": "ませんか / ましょう",
    "units": [
      "p23:plans",
      "p26:weekend-switch"
    ],
    "question": "Eine neue Bekanntschaft soll frei entscheiden, ob sie am Sonntag mitkommen möchte.",
    "preferred": "日曜日に一緒に行きませんか。",
    "contrast": "日曜日に一緒に行きましょう。",
    "explanation": "ませんか lädt vorsichtig ein. ましょう formuliert einen direkten gemeinsamen Vorschlag und setzt das gemeinsame Handeln stärker voraus.",
    "title": "Einladung versus Vorschlag"
  },
  {
    "id": "p38-cross-11",
    "focus": "ました / ます",
    "units": [
      "p23:past",
      "p25:lostfound"
    ],
    "question": "Du erzählst im Fundbüro von einem bereits geschehenen Verlust.",
    "preferred": "昨日、駅で傘をなくしました。",
    "contrast": "昨日、駅で傘をなくします。",
    "explanation": "昨日 und das bereits abgeschlossene Verlieren erfordern hier die Vergangenheitsform ました.",
    "title": "Vergangener Verlust"
  },
  {
    "id": "p38-cross-12",
    "focus": "でした / です",
    "units": [
      "p23:past",
      "p25:appointment"
    ],
    "question": "Du berichtest über die Stimmung einer abgeschlossenen Veranstaltung gestern.",
    "preferred": "昨日の会議は静かでした。",
    "contrast": "昨日の会議は静かです。",
    "explanation": "でした beschreibt den vergangenen Zustand. です würde ihn in der Gegenwart feststellen.",
    "title": "Nominale Vergangenheit"
  },
  {
    "id": "p38-cross-13",
    "focus": "この / これ",
    "units": [
      "p23:ownership",
      "p25:shopping"
    ],
    "question": "Du möchtest direkt vor dem Nomen かばん auf diese Tasche in deiner Nähe verweisen.",
    "preferred": "このかばんはいくらですか。",
    "contrast": "これかばんはいくらですか。",
    "explanation": "この steht vor einem Nomen; これ kann als eigenständiges Demonstrativpronomen verwendet werden.",
    "title": "Demonstrativ + Nomen"
  },
  {
    "id": "p38-cross-14",
    "focus": "から / まで",
    "units": [
      "p25:directions",
      "p26:station-to-campus"
    ],
    "question": "Du nennst den Bahnhof als Ausgangspunkt deines Weges zur Universität.",
    "preferred": "駅から大学まで歩きます。",
    "contrast": "駅まで大学から歩きます。",
    "explanation": "から kennzeichnet den Start, まで den Endpunkt. Ein Austausch kehrt die beschriebene Wegstrecke um.",
    "title": "Ausgangspunkt und Endpunkt"
  },
  {
    "id": "p38-cross-15",
    "focus": "です / だ",
    "units": [
      "p23:introduction",
      "p23:greetings"
    ],
    "question": "Bei der ersten Vorstellung gegenüber einer Lehrkraft willst du höflich klingen.",
    "preferred": "私は一年生です。",
    "contrast": "私は一年生だ。",
    "explanation": "です ist bei einer höflichen Vorstellung passend. だ kann in vertrauten oder informellen Kontexten natürlich sein.",
    "title": "Höflicher Erstkontakt"
  },
  {
    "id": "p38-cross-16",
    "focus": "すみません / Imperativ",
    "units": [
      "p25:lostfound",
      "p26:cafe-conversation"
    ],
    "question": "Du bittest fremdes Personal höflich um Wiederholung.",
    "preferred": "すみません、もう一度お願いします。",
    "contrast": "もう一度言え。",
    "explanation": "Eine entschuldigende Bitte passt zum fremden Personal. Der Imperativ 言え wirkt hier grob.",
    "title": "Serviceorientierte Bitte"
  },
  {
    "id": "p38-cross-17",
    "focus": "なら / はどうですか",
    "units": [
      "p25:appointment",
      "p26:weekend-switch"
    ],
    "question": "Samstag geht nicht. Du möchtest aktiv Sonntag als neuen Termin vorschlagen.",
    "preferred": "では、日曜日はどうですか。",
    "contrast": "日曜日なら大丈夫です。",
    "explanation": "はどうですか eröffnet eine neue Option; なら大丈夫です bestätigt eine vorhandene Option.",
    "title": "Gegenangebot statt Zustimmung"
  },
  {
    "id": "p38-cross-18",
    "focus": "も / だけ",
    "units": [
      "p23:cafe",
      "p26:cafe-conversation"
    ],
    "question": "Die Bestellung wurde als zwei Kuchen verstanden; du willst ausdrücklich nur einen.",
    "preferred": "ケーキは一つだけです。",
    "contrast": "ケーキは一つもです。",
    "explanation": "だけ grenzt die Menge auf genau eins ein. も braucht eine andere Konstruktion und ersetzt だけ hier nicht.",
    "title": "Mengenbegrenzung"
  },
  {
    "id": "p38-cross-19",
    "focus": "が / を",
    "units": [
      "p23:routine",
      "p25:shopping"
    ],
    "question": "Du drückst einen persönlichen Wunsch aus, diese rote Tasche zu kaufen.",
    "preferred": "この赤いかばんが買いたいです。",
    "contrast": "この赤いかばんを買いました。",
    "explanation": "が kann in der Wunschkonstruktion 買いたい das Gewünschte hervorheben; 買いました berichtet hingegen über einen abgeschlossenen Kauf.",
    "title": "Wunsch oder vergangener Kauf"
  },
  {
    "id": "p38-cross-20",
    "focus": "てください / たい",
    "units": [
      "p25:directions",
      "p26:library-project"
    ],
    "question": "Du bittest jemanden höflich, dir den Weg zu zeigen.",
    "preferred": "道を教えてください。",
    "contrast": "道を教えたいです。",
    "explanation": "てください richtet eine Bitte an die andere Person; たいです bezeichnet den eigenen Wunsch zu handeln.",
    "title": "Handlungsbitte versus Wunsch"
  }
];
export const p38CrossUnitPrompts:StudyPrompt[]=p38CrossUnitContrasts.map((c,i)=>({
 id:c.id,primaryTarget:{kind:"can_do",id:"p38:cross:"+c.id},
 skill:"form_selection",cueFamily:"p38-cross-contrast-"+c.id,promptType:"choice",
 instruction:"Wähle für die ausdrücklich beschriebene Absicht die passendere Form",
 prompt:c.question,
 choices:i%2?[c.contrast,c.preferred]:[c.preferred,c.contrast],
 acceptedAnswers:[c.preferred],displayAnswer:c.preferred,
 explanation:c.explanation,answerNormalization:"japanese",
 contextId:"p38:cross:"+c.id,sourceId:"thiepn-original",contentVersion:"p38-1",
 eventMetadata:{p38:true,kind:"cross-context-transfer",unitIds:[...c.units],
   contrastId:c.id,focus:c.focus,title:c.title}
}));
export function p38CrossUnitForUnit(unitId:string):P38CrossUnitContrast[]{
 return p38CrossUnitContrasts.filter(c=>c.units.includes(unitId));
}
