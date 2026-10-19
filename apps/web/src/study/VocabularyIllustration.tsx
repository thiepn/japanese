import {useState} from "react";
import {vocabularyVisualForLexeme} from "./vocabVisuals";
import "./vocabularyIllustration.css";

/** Only introductory vocabulary lessons and local word references show this cue. */
export function VocabularyIllustration({lexemeId,className=""}:{lexemeId:string;className?:string}){
  const [failed,setFailed]=useState(false);
  const visual=vocabularyVisualForLexeme(lexemeId);
  if(!visual||failed)return null;
  return <figure className={["vocabulary-visual",className].filter(Boolean).join(" ")}>
    <img src={`${import.meta.env.BASE_URL}vocab/${visual.file}`} alt={visual.alt}
      width={320} height={240} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>
    <figcaption>Visual cue · original illustration</figcaption>
  </figure>;
}
