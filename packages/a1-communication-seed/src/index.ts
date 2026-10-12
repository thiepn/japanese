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
