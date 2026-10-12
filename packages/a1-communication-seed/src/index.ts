/**
 * Original A1 communication curriculum seed. No Marugoto text, recordings or worksheets copied.
 * Standalone and framework-independent until the existing Learn integration is reviewed.
 */
export type A1Exercise =
  | { id: string; kind: "choice"; prompt: string; options: readonly string[]; answer: string; explanation: string }
  | { id: string; kind: "order"; prompt: string; tokens: readonly string[]; answer: readonly string[]; explanation: string }
  | { id: string; kind: "fill"; prompt: string; answer: string; accepted?: readonly string[]; explanation: string };

export interface A1CommunicationLesson {
  id: string;
  level: "A1";
  title: string;
  canDo: string;
  grammar: readonly string[];
  vocabulary: readonly { japanese: string; romaji: string; german: string }[];
  dialogue: readonly { speaker: string; japanese: string; romaji: string; german: string }[];
  exercises: readonly A1Exercise[];
}

export const a1CommunicationLessons: readonly A1CommunicationLesson[] = [
  {
    id: "a1-greetings", level: "A1", title: "Begrüßen und verabschieden",
    canDo: "Ich kann jemanden begrüßen und mich höflich verabschieden.",
    grammar: ["Höfliche Standardformeln werden je nach Tageszeit und Situation verwendet."],
    vocabulary: [
      { japanese: "おはようございます", romaji: "ohayou gozaimasu", german: "Guten Morgen (höflich)" },
      { japanese: "こんにちは", romaji: "konnichiwa", german: "Guten Tag" },
      { japanese: "こんばんは", romaji: "konbanwa", german: "Guten Abend" },
      { japanese: "さようなら", romaji: "sayounara", german: "Auf Wiedersehen" }
    ],
    dialogue: [
      { speaker: "A", japanese: "こんにちは。", romaji: "Konnichiwa.", german: "Guten Tag." },
      { speaker: "B", japanese: "こんにちは。", romaji: "Konnichiwa.", german: "Guten Tag." }
    ],
    exercises: [
      { id: "greeting-evening", kind: "choice", prompt: "Was sagst du abends zur Begrüßung?", options: ["こんばんは", "おはようございます", "さようなら"], answer: "こんばんは", explanation: "こんばんは ist die Begrüßung am Abend." },
      { id: "greeting-morning", kind: "fill", prompt: "Ergänze: ___ (Guten Morgen, höflich)", answer: "おはようございます", explanation: "Die höfliche morgendliche Begrüßung lautet おはようございます." }
    ]
  },
  {
    id: "a1-introductions", level: "A1", title: "Sich vorstellen",
    canDo: "Ich kann meinen Namen nennen und eine einfache höfliche Vorstellung führen.",
    grammar: ["A は B です: A ist B (は als Thema-Partikel wird wa gesprochen).", "～です ist eine höfliche Satzaussage.", "～か markiert eine Frage."],
    vocabulary: [
      { japanese: "はじめまして", romaji: "hajimemashite", german: "Schön, Sie kennenzulernen (erste Begegnung)" },
      { japanese: "わたし", romaji: "watashi", german: "ich" },
      { japanese: "なまえ", romaji: "namae", german: "Name" },
      { japanese: "がくせい", romaji: "gakusei", german: "Student/in" },
      { japanese: "よろしくおねがいします", romaji: "yoroshiku onegai shimasu", german: "Höfliche Schlussformel bei einer Vorstellung" }
    ],
    dialogue: [
      { speaker: "A", japanese: "はじめまして。わたしはアンナです。", romaji: "Hajimemashite. Watashi wa Anna desu.", german: "Schön, Sie kennenzulernen. Ich bin Anna." },
      { speaker: "B", japanese: "はじめまして。わたしはケンです。", romaji: "Hajimemashite. Watashi wa Ken desu.", german: "Schön, Sie kennenzulernen. Ich bin Ken." },
      { speaker: "A", japanese: "よろしくおねがいします。", romaji: "Yoroshiku onegai shimasu.", german: "Ich freue mich auf den Kontakt mit Ihnen." }
    ],
    exercises: [
      { id: "intro-topic", kind: "choice", prompt: "Wie spricht man die Partikel は in わたしは aus?", options: ["wa", "ha", "ga"], answer: "wa", explanation: "Als Thema-Partikel wird は wa gesprochen." },
      { id: "intro-order", kind: "order", prompt: "Ordne: Ich bin Anna.", tokens: ["です", "アンナ", "わたしは"], answer: ["わたしは", "アンナ", "です"], explanation: "Thema + Name + です." },
      { id: "intro-fill", kind: "fill", prompt: "Ergänze: わたしはケン___。", answer: "です", explanation: "です schließt die höfliche Aussage ab." },
      { id: "intro-comprehension", kind: "choice", prompt: "Wie heißt Person B im Dialog?", options: ["ケン", "アンナ", "たなか"], answer: "ケン", explanation: "Person B sagt わたしはケンです." }
    ]
  },
  {
    id: "a1-origin", level: "A1", title: "Nach Herkunft fragen",
    canDo: "Ich kann einfach nach dem Herkunftsland fragen und antworten.",
    grammar: ["～からきました bedeutet: ich komme aus …", "どこ bedeutet: wo / woher im entsprechenden Fragesatz."],
    vocabulary: [
      { japanese: "どこ", romaji: "doko", german: "wo" },
      { japanese: "にほん", romaji: "nihon", german: "Japan" },
      { japanese: "ドイツ", romaji: "doitsu", german: "Deutschland" },
      { japanese: "から", romaji: "kara", german: "aus / von" },
      { japanese: "きました", romaji: "kimashita", german: "kam / bin gekommen (höflich)" }
    ],
    dialogue: [
      { speaker: "A", japanese: "どこからきましたか。", romaji: "Doko kara kimashita ka.", german: "Woher kommen Sie?" },
      { speaker: "B", japanese: "ドイツからきました。", romaji: "Doitsu kara kimashita.", german: "Ich komme aus Deutschland." }
    ],
    exercises: [
      { id: "origin-choice", kind: "choice", prompt: "Was bedeutet ドイツからきました。?", options: ["Ich komme aus Deutschland.", "Ich komme aus Japan.", "Ich bin Student."], answer: "Ich komme aus Deutschland.", explanation: "ドイツ ist Deutschland; から markiert die Herkunft." },
      { id: "origin-order", kind: "order", prompt: "Ordne: Ich komme aus Japan.", tokens: ["きました", "にほん", "から"], answer: ["にほん", "から", "きました"], explanation: "Herkunftsland + から + きました." }
    ]
  }
  ,
  {
    id:"a1-asking-names",level:"A1",title:"Nach Namen fragen",canDo:"Ich kann höflich nach dem Namen fragen und antworten.",
    grammar:["おなまえは？ ist eine verkürzte höfliche Frage nach dem Namen.","～です antwortet höflich mit einem Namen."],
    vocabulary:[{japanese:"おなまえ",romaji:"onamae",german:"Name (höflich)"},{japanese:"なん",romaji:"nan",german:"was"},{japanese:"ですか",romaji:"desu ka",german:"höfliche Frageendung"},{japanese:"たなか",romaji:"Tanaka",german:"Familienname Tanaka"}],
    dialogue:[{speaker:"A",japanese:"おなまえは？",romaji:"Onamae wa?",german:"Wie heißen Sie?"},{speaker:"B",japanese:"たなかです。",romaji:"Tanaka desu.",german:"Ich heiße Tanaka."}],
    exercises:[{id:"name-choice",kind:"choice",prompt:"Was fragt おなまえは？",options:["Wie heißen Sie?","Woher kommen Sie?","Wie spät ist es?"],answer:"Wie heißen Sie?",explanation:"おなまえ bedeutet Name."},{id:"name-fill",kind:"fill",prompt:"Ergänze: たなか___。",answer:"です",explanation:"です bildet die höfliche Antwort."},{id:"name-order",kind:"order",prompt:"Ordne: Ich heiße Tanaka.",tokens:["です","たなか"],answer:["たなか","です"],explanation:"Name + です ist eine höfliche Antwort."}]
  },
  {
    id:"a1-thanks",level:"A1",title:"Danken und sich entschuldigen",canDo:"Ich kann danken und mich höflich entschuldigen.",
    grammar:["ありがとうございます ist eine höfliche Dankesformel.","すみません kann Entschuldigung oder eine höfliche Anrede sein."],
    vocabulary:[{japanese:"ありがとうございます",romaji:"arigatou gozaimasu",german:"Vielen Dank"},{japanese:"どういたしまして",romaji:"dou itashimashite",german:"Gern geschehen"},{japanese:"すみません",romaji:"sumimasen",german:"Entschuldigung"},{japanese:"はい",romaji:"hai",german:"ja"}],
    dialogue:[{speaker:"A",japanese:"すみません。",romaji:"Sumimasen.",german:"Entschuldigung."},{speaker:"B",japanese:"はい。",romaji:"Hai.",german:"Ja?"},{speaker:"A",japanese:"ありがとうございます。",romaji:"Arigatou gozaimasu.",german:"Vielen Dank."}],
    exercises:[{id:"thanks-choice",kind:"choice",prompt:"Wie bedankt man sich höflich?",options:["ありがとうございます","こんばんは","どこ"],answer:"ありがとうございます",explanation:"ありがとうございます ist höflicher Dank."},{id:"thanks-fill",kind:"fill",prompt:"Ergänze: ___ (Entschuldigung)",answer:"すみません",explanation:"すみません ist eine höfliche Entschuldigung."}]
  },
  {
    id:"a1-shopping",level:"A1",title:"Im Geschäft einkaufen",canDo:"Ich kann nach einem Preis fragen und einen Gegenstand auswählen.",
    grammar:["これは bedeutet dieses hier.","いくらですか fragt nach dem Preis.","～をください ist eine höfliche Bitte um einen Gegenstand."],
    vocabulary:[{japanese:"これ",romaji:"kore",german:"dieses hier"},{japanese:"いくら",romaji:"ikura",german:"wie viel"},{japanese:"えん",romaji:"en",german:"Yen"},{japanese:"ください",romaji:"kudasai",german:"bitte geben Sie mir"}],
    dialogue:[{speaker:"A",japanese:"これはいくらですか。",romaji:"Kore wa ikura desu ka.",german:"Wie viel kostet das hier?"},{speaker:"B",japanese:"ごひゃくえんです。",romaji:"Gohyaku en desu.",german:"Das kostet 500 Yen."},{speaker:"A",japanese:"これをください。",romaji:"Kore o kudasai.",german:"Das hier bitte."}],
    exercises:[{id:"shop-price",kind:"choice",prompt:"Was bedeutet いくらですか？",options:["Wie viel kostet es?","Wo ist es?","Wer ist das?"],answer:"Wie viel kostet es?",explanation:"いくら fragt nach einem Preis."},{id:"shop-order",kind:"order",prompt:"Ordne: Das hier bitte.",tokens:["ください","これを"],answer:["これを","ください"],explanation:"これをください ist eine höfliche Bitte."},{id:"shop-fill",kind:"fill",prompt:"Ergänze: これは___ですか。 (Wie viel kostet das?)",answer:"いくら",explanation:"いくら bedeutet wie viel."}]
  },
  {
    id:"a1-cafe",level:"A1",title:"Im Café bestellen",canDo:"Ich kann ein einfaches Getränk bestellen.",
    grammar:["～をください bedeutet: bitte geben Sie mir …","お願いします ist eine weitere höfliche Bitte."],
    vocabulary:[{japanese:"みず",romaji:"mizu",german:"Wasser"},{japanese:"おちゃ",romaji:"ocha",german:"Tee"},{japanese:"コーヒー",romaji:"koohii",german:"Kaffee"},{japanese:"おねがいします",romaji:"onegai shimasu",german:"bitte (höflich)"}],
    dialogue:[{speaker:"A",japanese:"おちゃをください。",romaji:"Ocha o kudasai.",german:"Einen Tee bitte."},{speaker:"B",japanese:"はい。",romaji:"Hai.",german:"Ja."},{speaker:"A",japanese:"ありがとうございます。",romaji:"Arigatou gozaimasu.",german:"Vielen Dank."}],
    exercises:[{id:"cafe-choice",kind:"choice",prompt:"Was bestellt A?",options:["Tee","Wasser","Kaffee"],answer:"Tee",explanation:"おちゃ bedeutet Tee."},{id:"cafe-order",kind:"order",prompt:"Ordne: Wasser bitte.",tokens:["ください","みずを"],answer:["みずを","ください"],explanation:"みずをください bedeutet Wasser bitte."},{id:"cafe-fill",kind:"fill",prompt:"Ergänze: おちゃを___。",answer:"ください",explanation:"ください drückt die höfliche Bitte aus."}]
  }

];

export function evaluateA1Exercise(exercise: A1Exercise, response: string | readonly string[]): boolean {
  if (exercise.kind === "order") {
    return Array.isArray(response) && response.length === exercise.answer.length
      && response.every((token, index) => token === exercise.answer[index]);
  }
  if (typeof response !== "string") return false;
  const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
  return [exercise.answer, ...(exercise.kind === "fill" ? exercise.accepted ?? [] : [])]
    .some(answer => normalize(answer) === normalize(response));
}
