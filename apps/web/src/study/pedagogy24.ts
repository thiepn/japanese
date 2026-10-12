import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {pedagogyScenarios} from "./pedagogy23";

/**
 * P24: original teaching tasks, inspired by principles of contextual instruction.
 * No textbook lesson sequence, assets, audio, dialogues or exercises are reproduced.
 *
 * Closed responses -> StudyPlayer/FSRS; open production -> ungraded StudyEvents.
 */
export type PracticeTrack="dialogue"|"sentence"|"transfer";
export type PracticeMode="full"|"repair";
export interface GuidedChoice {
  japanese:string;
  german:string;
  next:string|null;
  appropriate:boolean;
  explanation:string;
}
export interface GuidedTurn {
  id:string;
  speaker:string;
  japanese:string;
  german:string;
  situation:string;
  choices:readonly GuidedChoice[];
}
export interface GuidedConversation {
  id:string;title:string;intro:string;start:string;turns:readonly GuidedTurn[];
}
type ConversationBlueprint={
  id:string;title:string;intro:string;
  opening:[string,string];
  good:[string,string];
  alternate:[string,string];
  wrong:[string,string];
  why:string;
  followup:[string,string];
  alternateFollowup:[string,string];
  response:[string,string];
  secondWrong:[string,string];
  secondWhy:string;
  closing:[string,string];
  final:[string,string];
  finalWrong:[string,string];
  finalWhy:string;
};
const conversationBlueprints:readonly ConversationBlueprint[]=[
  {
    id:"greetings",title:"Begrüßung auf dem Campus",intro:"Du kommst morgens zum Sprachkurs und triffst die Lehrkraft.",
    opening:["おはようございます。","Guten Morgen."],
    good:["おはようございます。","Guten Morgen (höflich)."],
    alternate:["おはようございます、先生。","Guten Morgen, Lehrkraft."],
    wrong:["こんばんは。","Guten Abend."],why:"Es ist morgens; eine höfliche Morgenbegrüßung passt.",
    followup:["お名前は何ですか。","Wie heißen Sie?"],
    alternateFollowup:["はじめまして。お名前は何ですか。","Freut mich. Wie heißen Sie?"],
    response:["田中です。よろしくお願いします。","Ich bin Tanaka. Freut mich."],
    secondWrong:["さようなら。","Auf Wiedersehen."],secondWhy:"Auf eine Namensfrage stellst du dich vor, nicht verabschiedest du dich.",
    closing:["では、また授業で。","Dann bis zum Unterricht."],
    final:["また授業で。","Bis zum Unterricht."],finalWrong:["いただきます。","Guten Appetit."],finalWhy:"Zum Abschied passt eine Verabschiedung."
  },
  {
    id:"introduction",title:"Neue Kurspartnerin kennenlernen",intro:"Die erste Partnerübung beginnt: Ihr tauscht Namen aus.",
    opening:["お名前は何ですか。","Wie heißen Sie?"],
    good:["山田です。","Ich bin Yamada."],alternate:["私は山田です。よろしくお願いします。","Ich bin Yamada. Freut mich."],
    wrong:["九時です。","Es ist neun Uhr."],why:"Die Frage betrifft den Namen, nicht die Uhrzeit.",
    followup:["学生ですか。","Sind Sie Studentin/Student?"],
    alternateFollowup:["こちらこそ。学生ですか。","Ganz meinerseits. Studieren Sie?"],
    response:["はい、学生です。","Ja, ich studiere."],
    secondWrong:["ここです。","Hier."],secondWhy:"Auf eine Personenfrage antwortest du mit einer Aussage über die Person.",
    closing:["これからよろしくお願いします。","Auf gute Zusammenarbeit."],
    final:["よろしくお願いします。","Freut mich ebenfalls."],finalWrong:["いくらですか。","Wie viel kostet es?"],finalWhy:"Die höfliche Erwiderung ist eine Grußformel."
  },
  {
    id:"ownership",title:"Ein verlegtes Buch zurückgeben",intro:"Im Klassenraum hält jemand ein unbekanntes Buch hoch.",
    opening:["これはだれの本ですか。","Wessen Buch ist das?"],
    good:["私の本です。","Das ist mein Buch."],alternate:["それは私の本です。","Das ist mein Buch dort."],
    wrong:["図書館で勉強します。","Ich lerne in der Bibliothek."],why:"Die Frage bezieht sich auf Besitz.",
    followup:["これでいいですか。","Ist das hier so richtig?"],
    alternateFollowup:["あ、そうですか。これでいいですか。","Ach so. Ist es so richtig?"],
    response:["はい、ありがとうございます。","Ja, vielen Dank."],
    secondWrong:["五時です。","Es ist fünf Uhr."],secondWhy:"Die Nachfrage ist eine Bestätigung, keine Zeitfrage.",
    closing:["では、どうぞ。","Hier, bitte."],
    final:["ありがとうございます。","Vielen Dank."],finalWrong:["おやすみなさい。","Gute Nacht."],finalWhy:"Auf die Übergabe reagiert man dankend."
  },
  {
    id:"places",title:"Im Universitätsgebäude",intro:"Du suchst deine Lehrerin und fragst am Empfang.",
    opening:["先生はどこにいますか。","Wo ist die Lehrerin?"],
    good:["教室にいます。","Sie ist im Unterrichtsraum."],alternate:["二階の教室にいます。","Sie ist im Unterrichtsraum im zweiten Stock."],
    wrong:["教室でいます。","Unpassende Partikel im Standardsatz."],why:"Bei der Existenz mit います bezeichnet に den Aufenthaltsort.",
    followup:["どこで勉強しますか。","Wo lernt ihr?"],
    alternateFollowup:["ありがとうございます。どこで勉強しますか。","Vielen Dank. Wo lernt ihr?"],
    response:["図書館で勉強します。","Wir lernen in der Bibliothek."],
    secondWrong:["図書館に勉強します。","Unpassende Partikel im Standardsatz."],secondWhy:"Bei einer Handlung wie 勉強します markiert で den Ort.",
    closing:["わかりました。ありがとうございます。","Verstanden. Vielen Dank."],
    final:["どういたしまして。","Gern geschehen."],finalWrong:["昨日でした。","Das war gestern."],finalWhy:"Hier passt eine höfliche Reaktion auf den Dank."
  },
  {
    id:"routine",title:"Über Gewohnheiten sprechen",intro:"Dein Tandempartner fragt, wie du normalerweise lernst.",
    opening:["毎日、日本語を勉強しますか。","Lernst du täglich Japanisch?"],
    good:["はい、毎日勉強します。","Ja, ich lerne jeden Tag."],alternate:["いいえ、毎日は勉強しません。","Nein, nicht jeden Tag."],
    wrong:["昨日、学生です。","Gestern bin ich Studierender."],why:"Eine Frage zur täglichen Routine verlangt eine Aussage zu einer Gewohnheit.",
    followup:["どこで勉強しますか。","Wo lernst du?"],
    alternateFollowup:["そうですか。どこで勉強しますか。","Verstehe. Wo lernst du?"],
    response:["家で勉強します。","Ich lerne zu Hause."],
    secondWrong:["家に勉強します。","Unpassende Partikel im Standardsatz."],secondWhy:"Ein Handlungsort wird hier mit で ausgedrückt.",
    closing:["そうですか。がんばってください。","Verstehe. Viel Erfolg."],
    final:["ありがとうございます。","Vielen Dank."],finalWrong:["いくらですか。","Wie viel kostet es?"],finalWhy:"Ein Wunsch nach Erfolg wird mit Dank beantwortet."
  },
  {
    id:"cafe",title:"Eine Bestellung mit Rückfrage",intro:"Du bestellst im Café. Das Personal fragt nach.",
    opening:["ご注文は何ですか。","Was möchten Sie bestellen?"],
    good:["お茶をください。","Einen Tee bitte."],alternate:["お茶を一つください。","Einen Tee bitte (mit Menge)."],
    wrong:["お茶でいます。","Unpassende Konstruktion."],why:"Mit をください bittest du höflich um ein Getränk.",
    followup:["ほかには？","Noch etwas?"],
    alternateFollowup:["お茶ですね。ほかには？","Also einen Tee. Noch etwas?"],
    response:["ケーキを一つください。","Ein Stück Kuchen bitte."],
    secondWrong:["九時にいます。","Ich bin um neun dort."],secondWhy:"ほかには? bezieht sich auf die Bestellung.",
    closing:["全部で七百円です。","Zusammen sind es 700 Yen."],
    final:["ありがとうございます。","Vielen Dank."],finalWrong:["おはようございます。","Guten Morgen."],finalWhy:"Bei der Bezahlung ist ein Dank angebracht."
  },
  {
    id:"plans",title:"Für Samstag etwas verabreden",intro:"Du möchtest mit jemandem am Wochenende etwas unternehmen.",
    opening:["土曜日は時間がありますか。","Hast du am Samstag Zeit?"],
    good:["はい、あります。","Ja, ich habe Zeit."],alternate:["すみません、土曜日はちょっと。","Entschuldigung, Samstag ist etwas schwierig."],
    wrong:["昨日、雨でした。","Gestern regnete es."],why:"Die Frage betrifft deine Verfügbarkeit am Samstag.",
    followup:["公園に行きませんか。","Wollen wir in den Park gehen?"],
    alternateFollowup:["では、日曜日はどうですか。","Wie wäre es dann mit Sonntag?"],
    response:["いいですね。行きましょう。","Gute Idee. Gehen wir!"],
    secondWrong:["行きました。","Ich ging."],secondWhy:"Hier wird eine zukünftige Verabredung vorgeschlagen.",
    closing:["では、また。","Dann bis später."],
    final:["また。","Bis dann."],finalWrong:["いただきます。","Guten Appetit."],finalWhy:"Eine kurze Verabschiedung ist passend."
  },
  {
    id:"past",title:"Vom Wochenende berichten",intro:"Nach dem Wochenende unterhaltet ihr euch über eure Aktivitäten.",
    opening:["週末は何をしましたか。","Was hast du am Wochenende gemacht?"],
    good:["映画を見ました。","Ich habe einen Film gesehen."],alternate:["家で本を読みました。","Ich habe zu Hause gelesen."],
    wrong:["明日、映画を見ます。","Morgen werde ich einen Film ansehen."],why:"Die Frage betrifft vergangene Ereignisse; ました ist die passende höfliche Zeitform.",
    followup:["楽しかったですか。","Hat es Spaß gemacht?"],
    alternateFollowup:["いいですね。楽しかったですか。","Schön! Hat es Spaß gemacht?"],
    response:["はい、楽しかったです。","Ja, es war schön."],
    secondWrong:["はい、楽しいました。","Falsch gebildete Adjektiv-Vergangenheit."],secondWhy:"Das い-Adjektiv 楽しい bildet die Vergangenheit mit かった.",
    closing:["また話しましょう。","Lass uns wieder sprechen."],
    final:["はい、また。","Ja, bis dann."],finalWrong:["お茶をください。","Einen Tee bitte."],finalWhy:"Das Gespräch wird verabschiedet."
  }
];

function conversationFrom(spec:ConversationBlueprint):GuidedConversation{
  const option=(value:[string,string],next:string|null,appropriate:boolean,explanation:string):GuidedChoice=>({
    japanese:value[0],german:value[1],next,appropriate,explanation
  });
  const turns:GuidedTurn[]=[
    {id:"start",speaker:"Gesprächspartner",japanese:spec.opening[0],german:spec.opening[1],
      situation:"Reagiere auf die aktuelle Situation.",
      choices:[
        option(spec.good,"followup",true,"Das ist eine passende Antwort."),
        option(spec.alternate,"alternative",true,"Diese alternative Formulierung ist im Kontext ebenfalls sinnvoll."),
        option(spec.wrong,"repair",false,spec.why)
      ]},
    {id:"followup",speaker:"Gesprächspartner",japanese:spec.followup[0],german:spec.followup[1],
      situation:"Das Gespräch wird fortgesetzt. Antworte passend auf die Rückfrage.",
      choices:[
        option(spec.response,"closing",true,"Die Antwort reagiert auf die Nachfrage."),
        option(spec.secondWrong,"repair-second",false,spec.secondWhy)
      ]},
    {id:"alternative",speaker:"Gesprächspartner",japanese:spec.alternateFollowup[0],german:spec.alternateFollowup[1],
      situation:"Deine alternative Antwort hat den Gesprächsverlauf verändert.",
      choices:[
        option(spec.response,"closing",true,"Du gehst auf die veränderte Gesprächssituation ein."),
        option(spec.secondWrong,"repair-second",false,spec.secondWhy)
      ]},
    {id:"repair",speaker:"Gesprächspartner",japanese:"すみません、もう一度お願いします。",german:"Entschuldigung, noch einmal bitte.",
      situation:"Dein Gegenüber hat nicht verstanden. Formuliere die passende Antwort erneut.",
      choices:[
        option(spec.good,"followup",true,"Du reparierst das Missverständnis."),
        option(spec.wrong,"repair",false,spec.why)
      ]},
    {id:"repair-second",speaker:"Gesprächspartner",japanese:"すみません、よくわかりません。",german:"Entschuldigung, ich verstehe nicht ganz.",
      situation:"Antworte noch einmal zur eigentlichen Frage.",
      choices:[
        option(spec.response,"closing",true,"Jetzt reagierst du auf die Frage."),
        option(spec.secondWrong,"repair-second",false,spec.secondWhy)
      ]},
    {id:"closing",speaker:"Gesprächspartner",japanese:spec.closing[0],german:spec.closing[1],
      situation:"Beende das Gespräch höflich.",
      choices:[
        option(spec.final,null,true,"Du hast das Gespräch beendet."),
        option(spec.finalWrong,"closing",false,spec.finalWhy)
      ]}
  ];
  return {id:spec.id,title:spec.title,intro:spec.intro,start:"start",turns};
}
export const guidedConversations:readonly GuidedConversation[]=conversationBlueprints.map(conversationFrom);
export function conversationForScenario(id:string):GuidedConversation|undefined{
  return guidedConversations.find(item=>item.id===id);
}
export function dialoguePrompt(scenarioId:string,turn:GuidedTurn):StudyPrompt{
  return {
    id:"p24-dialogue-"+scenarioId+"-"+turn.id,
    primaryTarget:{kind:"can_do",id:"p24:dialogue:"+scenarioId},
    skill:"comprehension",cueFamily:"p24-dialogue-"+scenarioId+"-"+turn.id,
    promptType:"choice",instruction:"Antworte im Gespräch",prompt:turn.japanese,
    promptLanguage:"ja",choices:turn.choices.map(option=>option.japanese),
    acceptedAnswers:turn.choices.filter(option=>option.appropriate).map(option=>option.japanese),
    displayAnswer:turn.choices.filter(option=>option.appropriate).map(option=>option.japanese).join(" / "),
    explanation:turn.situation,
    contextId:"p24:dialogue:"+scenarioId,answerNormalization:"japanese",
    sourceId:"thiepn-original",contentVersion:"p24-1",
    eventMetadata:{p24:true,kind:"dialogue",scenarioId,turnId:turn.id}
  };
}
export interface SentencePuzzle {
  id:string;scenarioId:string;level:"A1"|"A2";
  situation:string;meaning:string;tokens:readonly string[];
  answer:string;explanation:string;
}
const sentenceBlueprints:readonly Omit<SentencePuzzle,"level"|"answer">[]=[
  {id:"greetings-a",scenarioId:"greetings",situation:"Eine Lehrerin am Morgen begrüßen",meaning:"Guten Morgen, Frau/Herr Lehrer(in).",tokens:["先生","おはようございます"],explanation:"Die Anrede kann vor der Grußformel stehen."},
  {id:"greetings-b",scenarioId:"greetings",situation:"Begrüßung beim ersten Treffen",meaning:"Freut mich, Sie kennenzulernen.",tokens:["よろしく","お願いします"],explanation:"Diese feste höfliche Formel verwendet お願いします."},
  {id:"introduction-a",scenarioId:"introduction",situation:"Eine Aussage über dich selbst",meaning:"Ich bin Student/in.",tokens:["私","は","学生","です"],explanation:"は führt das Thema ein; です schließt die höfliche Nominalaussage."},
  {id:"introduction-b",scenarioId:"introduction",situation:"Frage nach einem Namen",meaning:"Wie heißen Sie?",tokens:["お名前","は","何","ですか"],explanation:"Nach dem Thema お名前 folgt der Frageausdruck."},
  {id:"ownership-a",scenarioId:"ownership",situation:"Dein Eigentum benennen",meaning:"Das ist mein Buch.",tokens:["これ","は","私","の","本","です"],explanation:"これ steht allein; の beschreibt den Besitz."},
  {id:"ownership-b",scenarioId:"ownership",situation:"Ein bestimmtes Buch",meaning:"Dieses Buch gehört mir.",tokens:["この","本","は","私","の","です"],explanation:"この steht unmittelbar vor dem Nomen 本."},
  {id:"places-a",scenarioId:"places",situation:"Jemand ist im Raum",meaning:"Die Lehrerin ist im Unterrichtsraum.",tokens:["教室","に","先生","が","います"],explanation:"に für den Existenzort; います für Personen."},
  {id:"places-b",scenarioId:"places",situation:"Ort einer Tätigkeit",meaning:"Ich lerne in der Bibliothek.",tokens:["図書館","で","勉強","します"],explanation:"で markiert den Ort der Handlung."},
  {id:"routine-a",scenarioId:"routine",situation:"Tägliche Lernroutine",meaning:"Ich lerne jeden Tag Japanisch.",tokens:["毎日","日本語","を","勉強","します"],explanation:"を markiert das Objekt; das Verb steht am Schluss."},
  {id:"routine-b",scenarioId:"routine",situation:"Heute anders als sonst",meaning:"Heute lese ich kein Buch.",tokens:["今日","は","本","を","読みません"],explanation:"ません ist die höfliche Negation."},
  {id:"cafe-a",scenarioId:"cafe",situation:"Getränk bestellen",meaning:"Einen Tee bitte.",tokens:["お茶","を","一つ","ください"],explanation:"をください bittet höflich um den Gegenstand."},
  {id:"cafe-b",scenarioId:"cafe",situation:"Preis erfragen",meaning:"Wie viel kostet das?",tokens:["これ","は","いくら","ですか"],explanation:"いくら fragt nach dem Preis."},
  {id:"plans-a",scenarioId:"plans",situation:"Eine Freundin einladen",meaning:"Wollen wir am Samstag in den Park gehen?",tokens:["土曜日","公園","に","行きませんか"],explanation:"ませんか als Einladung; に für das Ziel."},
  {id:"plans-b",scenarioId:"plans",situation:"Gemeinsam losgehen",meaning:"Gehen wir zusammen!",tokens:["一緒に","行きましょう"],explanation:"ましょう schlägt gemeinsames Handeln vor."},
  {id:"past-a",scenarioId:"past",situation:"Erlebnis berichten",meaning:"Gestern habe ich einen Film gesehen.",tokens:["昨日","映画","を","見ました"],explanation:"ました ist die höfliche Vergangenheitsform."},
  {id:"past-b",scenarioId:"past",situation:"Verneinung in der Vergangenheit",meaning:"Gestern bin ich nicht zur Schule gegangen.",tokens:["昨日","は","学校","に","行きませんでした"],explanation:"ませんでした verneint vergangene Handlungen höflich."}
];
export const sentencePuzzles:readonly SentencePuzzle[]=sentenceBlueprints.map(item=>({
  ...item,
  level:item.scenarioId==="plans"||item.scenarioId==="past"?"A2":"A1",
  answer:item.tokens.join("")
}));
export function sentencePuzzlePrompt(puzzle:SentencePuzzle):StudyPrompt{
  return {
    id:"p24-build-"+puzzle.id,
    primaryTarget:{kind:"can_do",id:"p24:sentence:"+puzzle.scenarioId},
    skill:"production",cueFamily:"p24-build-"+puzzle.id,promptType:"typed",
    instruction:"Baue einen japanischen Satz",prompt:puzzle.situation+" — "+puzzle.meaning,
    promptLanguage:"en",
    acceptedAnswers:[puzzle.answer],displayAnswer:puzzle.answer,
    explanation:puzzle.explanation,
    contextId:"p24:sentence:"+puzzle.scenarioId,
    answerNormalization:"japanese",sourceId:"thiepn-original",contentVersion:"p24-1",
    eventMetadata:{p24:true,kind:"sentence",scenarioId:puzzle.scenarioId,puzzleId:puzzle.id}
  };
}
export const sentencePuzzlePrompts:StudyPrompt[]=sentencePuzzles.map(sentencePuzzlePrompt);
type TransferItem={scenarioId:string;prompt:string;answer:string;choices:string[];explanation:string};
const transferItems:readonly TransferItem[]=[
  {scenarioId:"greetings",prompt:"Du begegnest um 8 Uhr einem Lehrer. Welche Form ist passend?",answer:"おはようございます",choices:["こんばんは","おはようございます","おやすみなさい"],explanation:"Höfliche Morgenbegrüßung."},
  {scenarioId:"greetings",prompt:"Beim ersten Kennenlernen: Welche Antwort passt zu はじめまして?",answer:"はじめまして",choices:["いただきます","はじめまして","おやすみ"],explanation:"Diese Formel wird bei einer neuen Begegnung verwendet."},
  {scenarioId:"introduction",prompt:"私は学生 ___。",answer:"です",choices:["を","です","ます"],explanation:"Nominales Prädikat mit höflichem です."},
  {scenarioId:"introduction",prompt:"お名前 ___ 何ですか。",answer:"は",choices:["は","を","に"],explanation:"は markiert das Thema der Frage."},
  {scenarioId:"ownership",prompt:"___ 本は私のです。",answer:"この",choices:["これ","この","ここ"],explanation:"この muss vor einem Nomen stehen."},
  {scenarioId:"ownership",prompt:"これは私 ___ 本です。",answer:"の",choices:["に","の","を"],explanation:"の verbindet den Besitzenden mit dem Nomen."},
  {scenarioId:"places",prompt:"教室 ___ 先生がいます。",answer:"に",choices:["に","で","を"],explanation:"Existenzort bei います."},
  {scenarioId:"places",prompt:"図書館 ___ 勉強します。",answer:"で",choices:["に","が","で"],explanation:"Handlungsort mit で."},
  {scenarioId:"routine",prompt:"本 ___ 読みます。",answer:"を",choices:["を","で","の"],explanation:"Das gelesene Buch ist direktes Objekt."},
  {scenarioId:"routine",prompt:"Heute gehe ich nicht: 今日、行き ___。",answer:"ません",choices:["ました","ません","ます"],explanation:"Nichtvergangene höfliche Verneinung."},
  {scenarioId:"cafe",prompt:"ケーキ ___ ください。",answer:"を",choices:["で","を","が"],explanation:"Nomen + をください als höfliche Bitte."},
  {scenarioId:"cafe",prompt:"Wie fragt man nach einem Preis?",answer:"いくらですか",choices:["いくらですか","どこですか","いつですか"],explanation:"いくら bedeutet wie viel (Preis)."},
  {scenarioId:"plans",prompt:"公園に行き ___。 (höfliche Einladung)",answer:"ませんか",choices:["ました","ませんか","ます"],explanation:"ませんか kann als Einladung verwendet werden."},
  {scenarioId:"plans",prompt:"一緒に行き ___。 (gemeinsamer Vorschlag)",answer:"ましょう",choices:["ません","ましょう","ました"],explanation:"ましょう drückt gemeinsames Vorhaben aus."},
  {scenarioId:"past",prompt:"昨日、映画を見 ___。",answer:"ました",choices:["ます","ません","ました"],explanation:"Vergangenheit im höflichen Stil."},
  {scenarioId:"past",prompt:"昨日は学校に行き ___。 (Vergangenheit, verneint)",answer:"ませんでした",choices:["ません","ませんでした","ました"],explanation:"ませんでした ist höfliche Vergangenheitsverneinung."}
];
export const grammarTransferPrompts:StudyPrompt[]=transferItems.map((item,index)=>({
  id:"p24-transfer-"+item.scenarioId+"-"+(index%2+1),
  primaryTarget:{kind:"can_do",id:"p24:transfer:"+item.scenarioId},
  skill:"form_selection",cueFamily:"p24-transfer-"+item.scenarioId+"-"+(index%2+1),
  promptType:"choice",instruction:"Grammatik auf neuen Kontext übertragen",prompt:item.prompt,
  choices:item.choices,acceptedAnswers:[item.answer],displayAnswer:item.answer,
  explanation:item.explanation,
  contextId:"p24:transfer:"+item.scenarioId,answerNormalization:"japanese",
  sourceId:"thiepn-original",contentVersion:"p24-1",
  eventMetadata:{p24:true,kind:"transfer",scenarioId:item.scenarioId}
}));
export const p24ReviewPrompts:StudyPrompt[]=[
  ...sentencePuzzlePrompts,...grammarTransferPrompts,
  ...guidedConversations.flatMap(conversation=>conversation.turns.map(turn=>dialoguePrompt(conversation.id,turn)))
];
export const p24Lessons:Record<string,StudyLesson>=Object.fromEntries(
  pedagogyScenarios.flatMap(scenario=>{
    const base={kind:"lesson" as const,sourceLabel:"THIEPN Japanese · original guided practice",
      id:"p24-"+scenario.id,
      title:scenario.title+" — aktives Anwenden",
      body:scenario.situation+"\n"+scenario.model+"\nVergleiche: "+scenario.contrast,
      facts:[{label:"Kommunikatives Ziel",value:scenario.canDo},{label:"Achte auf",value:scenario.trap}],
      examples:scenario.words.map(w=>({expression:w.example,note:w.meaning}))
    };
    return [
      ["p24:sentence:"+scenario.id,{...base,id:base.id+"-sentence",contextId:"p24:sentence:"+scenario.id}],
      ["p24:transfer:"+scenario.id,{...base,id:base.id+"-transfer",contextId:"p24:transfer:"+scenario.id}],
      ["p24:dialogue:"+scenario.id,{...base,id:base.id+"-dialogue",contextId:"p24:dialogue:"+scenario.id}]
    ];
  })
);
export interface ProductionTask {
  scenarioId:string;writingPrompt:string;speakingPrompt:string;
  reference:string;minimumCharacters:number;features:readonly string[];
  guidance:string;
}
const productionByScenario:Readonly<Record<string,Omit<ProductionTask,"scenarioId">>>={
  greetings:{writingPrompt:"Schreibe einen kurzen höflichen Gruß und eine passende Verabschiedung an eine Lehrerin.",
    speakingPrompt:"Begrüße eine Lehrerin und verabschiede dich. Sprich in ganzen japanischen Ausdrücken.",
    reference:"おはようございます。先生、またあした。",minimumCharacters:12,features:["おはよう","また"],guidance:"Passt der Gruß zur Tageszeit und zur angesprochenen Person?"},
  introduction:{writingPrompt:"Stell dich mit zwei Sätzen vor und stelle eine Namensfrage.",
    speakingPrompt:"Sage deinen Namen und frage höflich nach dem Namen deines Gegenübers.",
    reference:"私は山田です。お名前は何ですか。",minimumCharacters:14,features:["です","名前"],guidance:"Ist は als Themenpartikel und です für die höfliche Aussage sinnvoll?"},
  ownership:{writingPrompt:"Erkläre, welches Buch dir gehört, und frage nach einem anderen Buch.",
    speakingPrompt:"Zeige auf zwei Bücher, beschreibe den Besitz und frage nach dem Besitzer.",
    reference:"これは私の本です。その本はだれのですか。",minimumCharacters:16,features:["の","本"],guidance:"Verwendest du これ ohne direktes Nomen und この vor einem Nomen?"},
  places:{writingPrompt:"Erkläre, wo eine Person ist und wo eine Handlung stattfindet.",
    speakingPrompt:"Sage, wo eine Lehrerin ist und wo du normalerweise lernst.",
    reference:"先生は教室にいます。私は図書館で勉強します。",minimumCharacters:18,features:["に","で"],guidance:"Unterscheidest du den Existenzort mit に vom Handlungsort mit で?"},
  routine:{writingPrompt:"Schreibe über deine täglichen Gewohnheiten und eine Verneinung.",
    speakingPrompt:"Beschreibe deine Lernroutine und sage, was du heute nicht tust.",
    reference:"毎日日本語を勉強します。今日は本を読みません。",minimumCharacters:17,features:["ます","ません"],guidance:"Ist die höfliche Verneinung korrekt?"},
  cafe:{writingPrompt:"Bestelle zwei Dinge höflich und frage nach dem Preis.",
    speakingPrompt:"Bestelle ein Getränk und eine Speise, dann frage nach dem Preis.",
    reference:"お茶を一つください。ケーキもください。いくらですか。",minimumCharacters:19,features:["ください","いくら"],guidance:"Verwendest du をください für Dinge statt falsche Verbbildungen?"},
  plans:{writingPrompt:"Schlage ein gemeinsames Vorhaben vor und beantworte eine Einladung.",
    speakingPrompt:"Lade jemanden ein, dann reagiere höflich auf eine Einladung.",
    reference:"土曜日、公園に行きませんか。いいですね。行きましょう。",minimumCharacters:20,features:["ませんか","ましょう"],guidance:"Unterscheidest du Einladung von gemeinsamem Vorschlag?"},
  past:{writingPrompt:"Erzähle zwei Dinge vom letzten Wochenende, eines davon verneint.",
    speakingPrompt:"Berichte vom Wochenende mit einer vergangenen und einer verneinten Handlung.",
    reference:"週末、映画を見ました。でも、学校には行きませんでした。",minimumCharacters:18,features:["ました","ませんでした"],guidance:"Passen beide Verben zum vergangenen Zeitraum?"}
};
export const productionTasks:readonly ProductionTask[]=pedagogyScenarios.map(s=>({
  scenarioId:s.id,...productionByScenario[s.id]!
}));
export interface ProductionChecklist {
  length:number;minimumCharacters:number;features:{text:string;present:boolean}[];
  guidance:string;reference:string;
}
/** String-form observations only. Never infer semantics, pronunciation, fluency or correctness. */
export function inspectProduction(text:string,task:ProductionTask):ProductionChecklist{
  const normalized=text.normalize("NFKC").replace(/\s+/gu,"");
  const meaningful=normalized.replace(/[。、！？!?「」『』（）・,.]/gu,"");
  return {
    length:[...meaningful].length,
    minimumCharacters:task.minimumCharacters,
    features:task.features.map(feature=>({text:feature,present:normalized.includes(feature)})),
    guidance:task.guidance,reference:task.reference
  };
}
function traceKey(prompt:StudyPrompt):string{
  return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
}
function recentResult(events:readonly StudyEvent[],promptId:string):"correct"|"incorrect"|undefined{
  const observed=events.filter(e=>e.metadata?.promptId===promptId&&(e.result==="correct"||e.result==="incorrect"))
    .sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
  return observed[0]?.result as "correct"|"incorrect"|undefined;
}
export interface PracticeRecommendation {
  track:PracticeTrack;due:number;incorrect:number;unseen:number;reason:string;
}
export function recommendPractice(
  scenarioId:string,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):PracticeRecommendation{
  const byTrace=new Map(traces.map(t=>[t.id,t]));
  const promptsByTrack:Record<PracticeTrack,StudyPrompt[]>={
    dialogue:guidedConversations.find(c=>c.id===scenarioId)?.turns.map(t=>dialoguePrompt(scenarioId,t))??[],
    sentence:sentencePuzzlePrompts.filter(p=>p.eventMetadata?.scenarioId===scenarioId),
    transfer:grammarTransferPrompts.filter(p=>p.eventMetadata?.scenarioId===scenarioId)
  };
  const assessed=(Object.entries(promptsByTrack) as [PracticeTrack,StudyPrompt[]][]).map(([track,prompts])=>{
    const due=prompts.filter(p=>{
      const trace=byTrace.get(traceKey(p));return trace&&Date.parse(trace.card.due)<=now;
    }).length;
    const incorrect=prompts.filter(p=>recentResult(events,p.id)==="incorrect").length;
    const unseen=prompts.filter(p=>!byTrace.has(traceKey(p))).length;
    return {track,due,incorrect,unseen};
  });
  assessed.sort((a,b)=>b.due-a.due||b.incorrect-a.incorrect||b.unseen-a.unseen);
  const best=assessed[0]??{track:"sentence" as const,due:0,incorrect:0,unseen:0};
  return {...best,reason:best.due?"Fälliger FSRS-Abruf":best.incorrect?"Letzter Fehler":best.unseen?"Noch nicht geübt":"Frei wiederholen"};
}
export function p24PracticeSession(
  scenarioId:string,mode:PracticeMode,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now()
):StudyStep[]{
  if(!pedagogyScenarios.some(s=>s.id===scenarioId))throw new Error("UNKNOWN_P24_SCENARIO:"+scenarioId);
  const prompts=[...sentencePuzzlePrompts,...grammarTransferPrompts].filter(p=>p.eventMetadata?.scenarioId===scenarioId);
  const byTrace=new Map(traces.map(t=>[t.id,t]));
  const priority=(prompt:StudyPrompt):number=>{
    const trace=byTrace.get(traceKey(prompt));
    if(trace&&Date.parse(trace.card.due)<=now)return 3;
    if(recentResult(events,prompt.id)==="incorrect")return 2;
    if(!trace)return 1;
    return 0;
  };
  const ordered=[...prompts].sort((a,b)=>priority(b)-priority(a));
  const selection=mode==="repair"?ordered.filter(p=>priority(p)>=2):ordered;
  const chosen=selection.length?selection:ordered;
  const introduction=p24Lessons["p24:sentence:"+scenarioId]!;
  return [introduction,...chosen];
}
