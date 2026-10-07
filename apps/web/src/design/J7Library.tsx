import {useEffect,useMemo,useRef,useState,type KeyboardEvent} from "react";
import type {EntityKind} from "@thiepn/domain";
import type {SearchResult} from "@thiepn/search";
import {coreContent,senseForLexeme} from "../coreContent";
import {JCartouche,JPattern,JSeal} from "./index";

type FilterKind="all"|Extract<EntityKind,"lexeme"|"kanji"|"grammar"|"sentence"|"lexical_chunk"|"text"|"production_task">;

const FILTERS:readonly {kind:FilterKind;label:string;japanese:string}[]=[
  {kind:"all",label:"All",japanese:"全"},
  {kind:"lexeme",label:"Words",japanese:"語"},
  {kind:"kanji",label:"Kanji",japanese:"字"},
  {kind:"grammar",label:"Grammar",japanese:"文"},
  {kind:"sentence",label:"Sentences",japanese:"例"},
  {kind:"lexical_chunk",label:"Chunks",japanese:"連"},
  {kind:"text",label:"Texts",japanese:"読"},
  {kind:"production_task",label:"Tasks",japanese:"作"},
];

export function J7Library({
  query,setQuery,results,status,
}:{
  query:string;
  setQuery:(value:string)=>void;
  results:SearchResult[];
  status:string;
}){
  const [filter,setFilter]=useState<FilterKind>("all");
  const [selectedIndex,setSelectedIndex]=useState(0);
  const detailRef=useRef<HTMLElement|null>(null);

  const filtered=useMemo(
    ()=>filter==="all"?results:results.filter((item)=>item.entity.kind===filter),
    [results,filter],
  );

  useEffect(()=>setSelectedIndex((index)=>Math.min(index,Math.max(0,filtered.length-1))),[filtered.length]);
  useEffect(()=>setSelectedIndex(0),[query,filter]);

  const selected=filtered[selectedIndex]??null;
  const counts=useMemo(()=>{
    const map=new Map<string,number>();
    for(const item of results)map.set(item.entity.kind,(map.get(item.entity.kind)??0)+1);
    return map;
  },[results]);

  function searchKeyDown(event:KeyboardEvent<HTMLInputElement>){
    if(!filtered.length)return;
    if(event.key==="ArrowDown"){
      event.preventDefault();
      setSelectedIndex((index)=>Math.min(filtered.length-1,index+1));
    }else if(event.key==="ArrowUp"){
      event.preventDefault();
      setSelectedIndex((index)=>Math.max(0,index-1));
    }else if(event.key==="Enter"){
      event.preventDefault();
      detailRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }

  return <section className="library j7-library" aria-labelledby="j7-library-title">
    <span className="j13-marginal" aria-hidden="true">蔵</span>
    <header className="j7-library__masthead">
      <JPattern name="sayagata" className="j7-library__pattern"/>
      <div className="j7-library__spine" aria-hidden="true">
        <span>蔵</span>
        <small>ARCHIVE</small>
      </div>
      <div className="j7-library__intro">
        <JCartouche japanese="蔵" subtitle="Library"/>
        <p className="j7-kicker">REFERENCE · SEARCH · CONNECT</p>
        <h1 id="j7-library-title">Japanese knowledge</h1>
        <p>Search canonical words, collocations, kanji, grammar, sentences and graded texts by Japanese form, reading or English meaning/function.</p>
      </div>
      <JSeal label="Japanese archive">蔵</JSeal>
    </header>

    <section className="j7-search" aria-label="Japanese knowledge search">
      <div className="j7-search__mark" aria-hidden="true">索</div>
      <label className="j7-search__field">
        <span>Search Japanese</span>
        <input
          aria-label="Search Japanese"
          autoComplete="off"
          value={query}
          onChange={(event)=>setQuery(event.target.value)}
          onKeyDown={searchKeyDown}
          placeholder="食べる · たべる · eat · topic…"
        />
        <kbd aria-hidden="true">↑ ↓</kbd>
      </label>
      <div className="j7-search__status" aria-live="polite">
        {status==="loading"
          ?"Searching local Japanese content…"
          :status==="error"
            ?"Local Japanese search is temporarily unavailable in this browser."
            :query.trim()
              ?filtered.length+" matches"
              :"Starter reference shelf"}
      </div>
    </section>

    <div className="j7-filter-strip" aria-label="Reference type filters">
      {FILTERS.map((item)=>{
        const count=item.kind==="all"?results.length:(counts.get(item.kind)??0);
        return <button
          className={filter===item.kind?"active":""}
          key={item.kind}
          onClick={()=>setFilter(item.kind)}
          type="button"
        >
          <span aria-hidden="true">{item.japanese}</span>
          <strong>{item.label}</strong>
          <small>{count}</small>
        </button>;
      })}
    </div>

    <div className="j7-catalog">
      <section className="j7-index" aria-labelledby="j7-index-title">
        <header className="j7-index__head">
          <div>
            <p className="j7-kicker">CATALOG · 目録</p>
            <h2 id="j7-index-title">{query.trim()?"Search results":"Starter shelf"}</h2>
          </div>
          <span>{filtered.length}</span>
        </header>

        {status==="error"?<p className="j7-empty" role="status">Local Japanese search is temporarily unavailable in this browser.</p>:null}
        {status!=="error"&&!filtered.length?<div className="j7-empty">
          <span aria-hidden="true">無</span>
          <strong>No matching reference entries</strong>
          <p>Try another Japanese form, reading, English meaning, or switch the type filter.</p>
        </div>:null}

        <div className="results j7-results" role="listbox" aria-label="Japanese reference results">
          {filtered.map((item,index)=><article
            className={"result-card result-"+item.entity.kind+" j7-result"+(index===selectedIndex?" is-selected":"")}
            key={item.entity.kind+":"+item.entity.id}
          >
            <button
              aria-selected={index===selectedIndex}
              id={"j7-result-"+index}
              onClick={()=>setSelectedIndex(index)}
              role="option"
              type="button"
            >
              <span className="j7-result__glyph" aria-hidden="true">{kindMeta(item.entity.kind).glyph}</span>
              <span className="j7-result__body">
                <small>{kindMeta(item.entity.kind).japanese} · {kindMeta(item.entity.kind).label}</small>
                <strong lang="ja">{item.title}</strong>
                {item.subtitle?<span>{item.subtitle}</span>:null}
              </span>
              <span className="j7-result__match">{matchLabel(item.matchedBy)}</span>
              <i aria-hidden="true">→</i>
            </button>
          </article>)}
        </div>
      </section>

      <aside className="j7-reference" ref={detailRef} aria-live="polite">
        {selected?<ReferenceDetail item={selected}/>:<EmptyReference/>}
      </aside>
    </div>

    <footer className="j7-library__footer">
      <span>LOCAL-FIRST REFERENCE</span>
      <i/>
      <p>Search runs against the canonical content bundled with Japanese. Results are reference views, not a second copy of learning content.</p>
    </footer>
  </section>;
}

function ReferenceDetail({item}:{item:SearchResult}){
  const meta=kindMeta(item.entity.kind);
  const detail=resolveDetail(item);

  return <article className={"j7-reference__sheet j7-reference__sheet--"+item.entity.kind}>
    <header className="j7-reference__head">
      <div className="j7-reference__type">
        <span aria-hidden="true">{meta.glyph}</span>
        <div><small>{meta.japanese}</small><strong>{meta.label}</strong></div>
      </div>
      <span className="j7-reference__score">{item.score}</span>
    </header>

    <div className="j7-reference__title">
      <h2 lang="ja">{item.title}</h2>
      {detail.reading?<p lang="ja">{detail.reading}</p>:null}
      {detail.primary?<strong>{detail.primary}</strong>:item.subtitle?<strong>{item.subtitle}</strong>:null}
    </div>

    {detail.badges.length?<div className="j7-reference__badges">{detail.badges.map((badge)=><span key={badge}>{badge}</span>)}</div>:null}

    {detail.sections.map((section)=><section className="j7-reference__section" key={section.label}>
      <span>{section.label}</span>
      {section.items.length===1?<p>{section.items[0]}</p>:<ul>{section.items.map((value)=><li key={value}>{value}</li>)}</ul>}
    </section>)}

    <footer className="j7-reference__provenance">
      <span>MATCHED BY</span><strong>{matchLabel(item.matchedBy)}</strong>
      <i/>
      <span>ID</span><code>{item.entity.id}</code>
    </footer>
  </article>;
}

function EmptyReference(){
  return <div className="j7-reference__empty">
    <span aria-hidden="true">蔵</span>
    <strong>Select a reference entry</strong>
    <p>Words, kanji, grammar and sentences each open in a different reference treatment.</p>
  </div>;
}

function resolveDetail(item:SearchResult):{reading?:string;primary?:string;badges:string[];sections:{label:string;items:string[]}[]}{
  const {kind,id}=item.entity;

  if(kind==="lexeme"){
    const lexeme=coreContent.lexemes.find((entry)=>entry.id===id);
    if(!lexeme)return fallbackDetail(item);
    const sense=senseForLexeme(lexeme);
    return {
      ...(lexeme.readings[0]?.text?{reading:lexeme.readings[0].text}:{}),
      primary:sense.glosses.join(" / "),
      badges:[...(sense.partOfSpeech??[]),...(lexeme.inflectionClass?[lexeme.inflectionClass]:[])].slice(0,4),
      sections:[
        ...(lexeme.forms.length? [{label:"Forms",items:lexeme.forms.map((form)=>form.text)}]:[]),
        ...(lexeme.readings.length>1? [{label:"Readings",items:lexeme.readings.map((reading)=>reading.text)}]:[]),
        ...(lexeme.tags?.length? [{label:"Tags",items:lexeme.tags}]:[]),
      ],
    };
  }

  if(kind==="kanji"){
    const kanji=coreContent.kanji.find((entry)=>entry.id===id);
    if(!kanji)return fallbackDetail(item);
    const words=coreContent.lexemes.filter((lexeme)=>lexeme.kanjiLinks.some((link)=>link.kanjiId===id)).slice(0,8);
    return {
      primary:kanji.meanings.join(" / "),
      badges:["kanji"],
      sections:words.length?[{label:"Words in this archive",items:words.map((lexeme)=>{
        const reading=lexeme.readings[0]?.text;
        return reading?lexeme.canonicalForm+" · "+reading:lexeme.canonicalForm;
      })}]:[],
    };
  }

  if(kind==="grammar"){
    const grammar=coreContent.grammar.find((entry)=>entry.id===id);
    if(!grammar)return fallbackDetail(item);
    return {
      primary:grammar.summary,
      badges:[grammar.level,grammar.register],
      sections:[
        {label:"Mental model",items:[grammar.mentalModel]},
        ...(grammar.formation.length?[{label:"Formation",items:grammar.formation}]:[]),
        ...(grammar.uses.length?[{label:"Uses",items:grammar.uses}]:[]),
      ],
    };
  }

  if(kind==="sentence"){
    const sentence=coreContent.sentences.find((entry)=>entry.id===id);
    if(!sentence)return fallbackDetail(item);
    return {
      ...(sentence.reading?{reading:sentence.reading}:{}),
      primary:sentence.translation,
      badges:[sentence.level,sentence.register],
      sections:[
        ...(sentence.grammarIds.length?[{label:"Grammar links",items:sentence.grammarIds}]:[]),
        ...(sentence.tags?.length?[{label:"Tags",items:sentence.tags}]:[]),
      ],
    };
  }

  if(kind==="lexical_chunk"){
    const chunk=coreContent.lexicalChunks.find((entry)=>entry.id===id);
    if(!chunk)return fallbackDetail(item);
    return {
      ...(chunk.reading?{reading:chunk.reading}:{}),
      primary:chunk.meaning,
      badges:[chunk.level,chunk.register],
      sections:[
        ...(chunk.variants?.length?[{label:"Variants",items:chunk.variants}]:[]),
        ...(chunk.tags?.length?[{label:"Tags",items:chunk.tags}]:[]),
      ],
    };
  }

  if(kind==="text"){
    const text=coreContent.readingTexts.find((entry)=>entry.id===id);
    if(!text)return fallbackDetail(item);
    return {
      primary:text.description,
      badges:[text.level,text.kind,"~"+text.estimatedMinutes+" min"],
      sections:[
        ...(text.tags.length?[{label:"Topics",items:text.tags}]:[]),
        {label:"Reference",items:[text.sentenceIds.length+" connected sentences · "+text.comprehensionQuestions.length+" comprehension checks"]},
      ],
    };
  }

  if(kind==="production_task"){
    const task=coreContent.productiveTasks.find((entry)=>entry.id===id);
    if(!task)return fallbackDetail(item);
    return {
      primary:task.prompt,
      badges:[task.level,task.mode],
      sections:[
        {label:"Situation",items:[task.situation]},
        ...(task.requiredTerms.length?[{label:"Targets",items:task.requiredTerms}]:[]),
      ],
    };
  }

  return fallbackDetail(item);
}

function fallbackDetail(item:SearchResult){
  return {
    ...(item.subtitle?{primary:item.subtitle}:{}),
    badges:[],
    sections:[],
  };
}

function kindMeta(kind:EntityKind):{glyph:string;japanese:string;label:string}{
  switch(kind){
    case "lexeme":return {glyph:"語",japanese:"語彙",label:"Word"};
    case "kanji":return {glyph:"字",japanese:"漢字",label:"Kanji"};
    case "grammar":return {glyph:"文",japanese:"文法",label:"Grammar"};
    case "sentence":return {glyph:"例",japanese:"例文",label:"Sentence"};
    case "lexical_chunk":return {glyph:"連",japanese:"連語",label:"Chunk"};
    case "text":return {glyph:"読",japanese:"読み物",label:"Text"};
    case "production_task":return {glyph:"作",japanese:"作文",label:"Task"};
    case "sense":return {glyph:"意",japanese:"意味",label:"Sense"};
    case "kana":return {glyph:"仮",japanese:"かな",label:"Kana"};
    case "document":return {glyph:"書",japanese:"文書",label:"Document"};
    case "can_do":return {glyph:"能",japanese:"能力",label:"Can-do"};
  }
}

function matchLabel(value:string):string{
  if(value==="title")return "form";
  if(value==="reading")return "reading";
  if(value==="gloss")return "meaning";
  if(value==="alias")return "alias";
  if(value==="starter-content")return "starter";
  return value;
}
