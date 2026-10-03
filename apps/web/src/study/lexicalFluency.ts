import type { StudyLesson,StudyPrompt } from "@thiepn/study-player";
import { coreContent,lexicalChunks,sentenceRecord,sourceTitle } from "../coreContent";

export const lexicalChunkMeaningPrompts:StudyPrompt[]=lexicalChunks.map((chunk,index,all)=>{
  const distractors=[5,13,29].map((offset)=>all[(index+offset)%all.length]?.meaning).filter((value):value is string=>Boolean(value)&&value!==chunk.meaning);
  return {
    id:"chunk-meaning-"+chunk.id,
    primaryTarget:{kind:"lexical_chunk",id:chunk.id},
    skill:"meaning_recognition",
    cueFamily:"chunk-to-meaning",
    promptType:"choice",
    instruction:"Choose the meaning of this Japanese chunk.",
    prompt:chunk.expression,
    promptLanguage:"ja",
    choices:[...new Set([chunk.meaning,...distractors])].slice(0,4),
    acceptedAnswers:[chunk.meaning],
    displayAnswer:chunk.meaning,
    explanation:chunk.expression+" — "+chunk.meaning,
    contextId:"chunk-"+chunk.id,
    answerNormalization:"default",
    sourceId:chunk.sourceIds[0]??"thiepn-original",
    contentVersion:coreContent.version,
    eventMetadata:{register:chunk.register,level:chunk.level,lexemeIds:chunk.lexemeIds,grammarIds:chunk.grammarIds}
  };
});

export const lexicalChunkActivePrompts:StudyPrompt[]=lexicalChunks.map((chunk)=>({
  id:"chunk-active-"+chunk.id,
  primaryTarget:{kind:"lexical_chunk",id:chunk.id},
  skill:"active_use",
  cueFamily:"meaning-to-chunk",
  promptType:"typed",
  instruction:"Produce the Japanese collocation or lexical chunk.",
  prompt:chunk.meaning,
  promptLanguage:"en",
  placeholder:"日本語…",
  acceptedAnswers:[chunk.expression,...(chunk.variants??[])],
  displayAnswer:chunk.expression+(chunk.reading?"（"+chunk.reading+"）":""),
  explanation:"Prefer the whole reusable phrase rather than translating word by word.",
  contextId:"chunk-"+chunk.id,
  answerNormalization:"japanese",
  sourceId:chunk.sourceIds[0]??"thiepn-original",
  contentVersion:coreContent.version,
  eventMetadata:{register:chunk.register,level:chunk.level,lexemeIds:chunk.lexemeIds,grammarIds:chunk.grammarIds}
}));

interface PhraseFamilyItem {
  id:string;
  title:string;
  prompt:string;
  answer:string;
  choices:string[];
  note:string;
}

const phraseFamilyItems:PhraseFamilyItem[]=[
  {id:"evidence-source",title:"Evidence chain",prompt:"Before sharing an online claim, which phrase best fits the first verification step?",answer:"情報源を確認する",choices:["情報源を確認する","見解を示す","合意に達する","優先順位をつける"],note:"Use 情報源を確認する for checking where information comes from before evaluating the claim itself."},
  {id:"evidence-reliability",title:"Evidence chain",prompt:"In a formal report, which phrase best expresses evaluating whether a source can be trusted?",answer:"信頼性を評価する",choices:["信頼性を評価する","方針を決める","条件を満たす","反論を述べる"],note:"信頼性を評価する is a formal analytical collocation; it differs from simply locating the source."},
  {id:"evidence-support",title:"Evidence chain",prompt:"Which phrase means supporting a claim with evidence rather than merely stating grounds?",answer:"主張を裏付ける",choices:["主張を裏付ける","根拠を示す","見解を示す","分析を行う"],note:"主張を裏付ける focuses on evidence that backs the claim; 根拠を示す focuses on presenting grounds."},
  {id:"evidence-grounds",title:"Evidence chain",prompt:"Which formal phrase is most direct for 'show the grounds/evidence for this conclusion'?",answer:"根拠を示す",choices:["根拠を示す","主張を裏付ける","情報源を確認する","比較を行う"],note:"根拠を示す presents the grounds explicitly; 主張を裏付ける describes evidence supporting a claim."},
  {id:"stance-opinion",title:"Position and counterargument",prompt:"You are giving your own opinion in a structured discussion. Which phrase is the most direct?",answer:"意見を述べる",choices:["意見を述べる","見解を示す","反論を述べる","方針を示す"],note:"意見を述べる is the direct collocation for stating an opinion."},
  {id:"stance-view",title:"Position and counterargument",prompt:"A formal report presents the organization's considered view. Which phrase fits best?",answer:"見解を示す",choices:["見解を示す","意見を述べる","反論を述べる","方針を決める"],note:"見解を示す is especially useful for a formal or institutional view."},
  {id:"stance-counter",title:"Position and counterargument",prompt:"You explicitly state a counterargument before responding to it. Which phrase fits?",answer:"反論を述べる",choices:["反論を述べる","意見を述べる","合意を得る","根拠を示す"],note:"反論を述べる marks a counterargument, not merely a personal opinion."},
  {id:"policy-decide",title:"Policy and implementation",prompt:"The team internally chooses its direction. Which phrase fits this neutral decision step?",answer:"方針を決める",choices:["方針を決める","方針を示す","政策を実施する","合意に達する"],note:"方針を決める is choosing the direction; 方針を示す is communicating that direction."},
  {id:"policy-state",title:"Policy and implementation",prompt:"Management formally states the direction to others. Which phrase fits best?",answer:"方針を示す",choices:["方針を示す","方針を決める","政策を実施する","条件を満たす"],note:"方針を示す focuses on presenting the policy/direction, often in formal communication."},
  {id:"policy-implement",title:"Policy and implementation",prompt:"A government moves from deciding a policy to carrying it out. Which collocation is correct?",answer:"政策を実施する",choices:["政策を実施する","方針を示す","比較を行う","合意を得る"],note:"政策を実施する is the implementation step, distinct from deciding or announcing a direction."},
  {id:"analysis-survey",title:"Research workflow",prompt:"Which phrase specifically means conducting a survey?",answer:"調査を実施する",choices:["調査を実施する","分析を行う","データを分析する","比較を行う"],note:"調査を実施する is the data-collection/research action; analysis follows afterward."},
  {id:"analysis-data",title:"Research workflow",prompt:"You already have the dataset and now examine it. Which phrase is most direct?",answer:"データを分析する",choices:["データを分析する","調査を実施する","比較を行う","見解を示す"],note:"データを分析する directly names analysis of the collected data."},
  {id:"analysis-compare",title:"Research workflow",prompt:"The report systematically compares two options. Which formal collocation fits?",answer:"比較を行う",choices:["比較を行う","分析を行う","条件を満たす","方針を決める"],note:"比較を行う is a formal nominal-style collocation for conducting a comparison."},
  {id:"agreement-reach",title:"Negotiation outcomes",prompt:"After negotiation, both sides finally reach agreement. Which phrase fits the outcome?",answer:"合意に達する",choices:["合意に達する","合意を得る","条件を満たす","優先順位をつける"],note:"合意に達する describes the parties reaching agreement; 合意を得る focuses on obtaining agreement from others."},
  {id:"agreement-obtain",title:"Negotiation outcomes",prompt:"A project leader needs to obtain stakeholders' agreement. Which phrase fits?",answer:"合意を得る",choices:["合意を得る","合意に達する","方針を示す","反論を述べる"],note:"合意を得る has an obtaining/receiving perspective."},
  {id:"context-consider",title:"Context and constraints",prompt:"Which phrase means explicitly taking a factor into consideration in a formal decision?",answer:"考慮に入れる",choices:["考慮に入れる","念頭に置く","文脈を踏まえる","観点から考える"],note:"考慮に入れる emphasizes including a factor in the decision process."},
  {id:"context-background",title:"Context and constraints",prompt:"Which phrase best means taking the surrounding context into account?",answer:"文脈を踏まえる",choices:["文脈を踏まえる","念頭に置く","考慮に入れる","観点から考える"],note:"文脈を踏まえる anchors the interpretation or decision in context."},
  {id:"context-viewpoint",title:"Context and constraints",prompt:"Which phrase means considering an issue from a particular viewpoint?",answer:"観点から考える",choices:["観点から考える","文脈を踏まえる","念頭に置く","根拠を示す"],note:"観点から考える changes the analytical viewpoint rather than merely remembering a constraint."}
];

const chunkByExpression=new Map(lexicalChunks.map((chunk)=>[chunk.expression,chunk] as const));

export const lexicalChunkTransferPrompts:StudyPrompt[]=phraseFamilyItems.map((item)=>{
  const chunk=chunkByExpression.get(item.answer);
  if(!chunk)throw new Error("MISSING_PHRASE_FAMILY_CHUNK:"+item.answer);
  return {
    id:"chunk-transfer-"+item.id,
    primaryTarget:{kind:"lexical_chunk",id:chunk.id},
    skill:"form_selection",
    cueFamily:"chunk-register-transfer",
    promptType:"choice",
    instruction:item.title+" — choose the best phrase for this context.",
    prompt:item.prompt,
    promptLanguage:"en",
    choices:item.choices,
    acceptedAnswers:[item.answer],
    displayAnswer:item.answer,
    explanation:item.note+" Register: "+chunk.register+".",
    contextId:"chunk-"+chunk.id,
    answerNormalization:"japanese",
    sourceId:chunk.sourceIds[0]??"thiepn-original",
    contentVersion:coreContent.version,
    eventMetadata:{register:chunk.register,level:chunk.level,phraseFamily:item.title,transfer:true}
  };
});

export const lexicalChunkPrompts:StudyPrompt[]=[...lexicalChunkMeaningPrompts,...lexicalChunkActivePrompts,...lexicalChunkTransferPrompts];

export const lexicalChunkLessons:Record<string,StudyLesson>=Object.fromEntries(lexicalChunks.map((chunk)=>{
  const examples=chunk.exampleSentenceIds.slice(0,3).map((id)=>{
    const sentence=sentenceRecord(id);
    return {expression:sentence.text,note:sentence.translation};
  });
  return ["chunk-"+chunk.id,{
    kind:"lesson" as const,
    id:"lesson-chunk-"+chunk.id,
    title:chunk.expression,
    body:"Learn this as one reusable phrase. P8 keeps chunk mastery separate from single-word knowledge and adds context/register transfer so recognition alone is not treated as fluent use.",
    contextId:"chunk-"+chunk.id,
    facts:[
      {label:"Meaning",value:chunk.meaning,language:"en" as const},
      {label:"Register",value:chunk.register,language:"en" as const},
      {label:"Level",value:chunk.level,language:"en" as const},
      ...(chunk.reading?[{label:"Reading",value:chunk.reading,language:"ja" as const}]:[])
    ],
    ...(examples.length?{examples}:{}),
    sourceLabel:sourceTitle(chunk.sourceIds[0]??"thiepn-original")
  }];
}));

export function lexicalFluencySession(limit=12):StudyPrompt[]{
  const selected=lexicalChunks.slice(0,Math.max(1,limit));
  const ids=new Set(selected.map((chunk)=>chunk.id));
  const base=lexicalChunkPrompts.filter((prompt)=>ids.has(prompt.primaryTarget.id));
  const transfer=lexicalChunkTransferPrompts.filter((prompt)=>ids.has(prompt.primaryTarget.id));
  return [...base.filter((prompt)=>prompt.skill!=="form_selection"),...transfer];
}
