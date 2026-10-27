import {useState} from "react";
import type {KanaView} from "../../../kana-studio/src/App";

export type KanaTool="similar"|"schedule"|"shortcuts"|"settings"|"filter";
const SECTIONS:ReadonlyArray<{id:KanaView;title:string;japanese:string}>=[
  {id:"home",title:"Overview",japanese:"概要"},
  {id:"learn",title:"Lessons",japanese:"学ぶ"},
  {id:"review",title:"Flashcards",japanese:"復習"},
  {id:"words",title:"Words",japanese:"単語"},
  {id:"chart",title:"Kana chart",japanese:"仮名表"},
];

/** One navigation region owned by Japanese, not a second Google app shell. */
export function J2KanaNavigation({selected,onSelect,onTool}:{
  selected:KanaView;
  onSelect:(view:KanaView)=>void;
  onTool:(tool:KanaTool)=>void;
}){
  const [toolsOpen,setToolsOpen]=useState(false);
  return <section className="j2-kana-route" aria-label="Japanese Kana study">
    <header className="j2-kana-route__intro">
      <div>
        <p className="j2-kana-route__eyebrow">日本語 · LEARN</p>
        <h1>Kana <span lang="ja">仮名</span></h1>
      </div>
      <button type="button" className="j2-kana-route__tools-toggle" aria-expanded={toolsOpen}
        aria-controls="japanese-kana-tools" onClick={()=>setToolsOpen(value=>!value)}>
        {toolsOpen?"Close tools":"Study tools"}
      </button>
    </header>
    <nav aria-label="Kana sections" className="j2-kana-route__sections">
      {SECTIONS.map(section=><button type="button" key={section.id}
        aria-current={section.id===selected?"page":undefined}
        onClick={()=>onSelect(section.id)}>
        <span>{section.title}</span><small lang="ja">{section.japanese}</small>
      </button>)}
    </nav>
    {toolsOpen?<div className="j2-kana-route__tools" id="japanese-kana-tools" aria-label="Kana study tools">
      {([
        ["similar","Similar kana"],["filter","Custom drills"],
        ["schedule","Review schedule"],["shortcuts","Keyboard shortcuts"],
        ["settings","Settings & backup"]
      ] as const).map(([tool,label])=><button type="button" key={tool}
        onClick={()=>{onTool(tool);setToolsOpen(false);}}>{label}</button>)}
    </div>:null}
  </section>;
}
