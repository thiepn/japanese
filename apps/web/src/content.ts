import { searchDocuments, type SearchDocument, type SearchResult } from "@thiepn/search";
import { coreContent, senseForLexeme, starterLexemes } from "./coreContent";

const searchIndex:SearchDocument[]=[
  ...coreContent.lexemes.map((lexeme)=>{
    const sense=coreContent.senses.find((item)=>item.lexemeId===lexeme.id);
    const reading=lexeme.readings[0]?.text;
    return {
      entity:{kind:"lexeme" as const,id:lexeme.id},
      title:lexeme.canonicalForm,
      ...(reading?{reading}:{}),
      glosses:sense?.glosses??[],
      aliases:lexeme.forms.map((form)=>form.text)
    };
  }),
  ...coreContent.lexicalChunks.map((item)=>({
    entity:{kind:"lexical_chunk" as const,id:item.id},
    title:item.expression,
    ...(item.reading?{reading:item.reading}:{}),
    glosses:[item.meaning,item.level,item.register],
    aliases:[...(item.variants??[]),...(item.tags??[])]
  })),
  ...coreContent.kanji.map((item)=>({
    entity:{kind:"kanji" as const,id:item.id},
    title:item.literal,
    glosses:item.meanings
  })),
  ...coreContent.grammar.map((item)=>({
    entity:{kind:"grammar" as const,id:item.id},
    title:item.label,
    glosses:[item.summary,...item.uses],
    aliases:item.formation
  })),
  ...coreContent.sentences.map((item)=>({
    entity:{kind:"sentence" as const,id:item.id},
    title:item.text,
    ...(item.reading?{reading:item.reading}:{}),
    glosses:[item.translation],
    aliases:[item.normalizedText]
  })),
  ...coreContent.readingTexts.map((item)=>({
    entity:{kind:"text" as const,id:item.id},
    title:item.title,
    glosses:[item.description,item.level],
    aliases:item.tags
  })),
  ...coreContent.productiveTasks.map((item)=>({
    entity:{kind:"production_task" as const,id:item.id},
    title:item.title,
    glosses:[item.prompt,item.situation,item.level],
    aliases:[...item.tags,...item.requiredTerms]
  }))
];

const lexemeById=new Map(coreContent.lexemes.map((item)=>[item.id,item] as const));
const sensesByLexeme=new Map<string,typeof coreContent.senses>();
for(const sense of coreContent.senses){
  const rows=sensesByLexeme.get(sense.lexemeId)??[];
  rows.push(sense);
  sensesByLexeme.set(sense.lexemeId,rows);
}
const kanjiById=new Map(coreContent.kanji.map((item)=>[item.id,item] as const));
const audioById=new Map(coreContent.audioAssets.map((item)=>[item.id,item] as const));

export async function searchLocalJapanese(query:string):Promise<SearchResult[]>{
  if(query.trim())return searchDocuments(query,searchIndex).slice(0,80);
  return starterLexemes.slice(0,24).map((lexeme)=>{
    const sense=senseForLexeme(lexeme);
    const reading=lexeme.readings[0]?.text;
    return {
      entity:{kind:"lexeme" as const,id:lexeme.id},
      title:lexeme.canonicalForm,
      ...(reading?{subtitle:`${reading} · ${sense.glosses.join(" / ")}`}:{subtitle:sense.glosses.join(" / ")}),
      matchedBy:"starter-content",
      score:100-(lexeme.priority??99)
    };
  });
}

export async function getLocalLexeme(id:string){
  const lexeme=lexemeById.get(id);
  if(!lexeme)return null;
  return {
    lexeme,
    senses:[...(sensesByLexeme.get(id)??[])],
    kanji:lexeme.kanjiLinks.map((link)=>kanjiById.get(link.kanjiId)).filter((item)=>item!==undefined),
    audioAssets:lexeme.audioIds.map((audioId)=>audioById.get(audioId)).filter((item)=>item!==undefined)
  };
}
