import { useEffect,useMemo,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import type { AudioAssetRecord } from "@thiepn/content-schema";
import {
  analyzeAuthenticText,createPrivateDocument,importTatoebaSentence,listPrivateDocumentViews,mineKnownLexeme,minePrivateSentence,
  recordPrivateComprehension,recordPrivateListening,recordPrivateReading,saveUnknownAsPrivateVocabulary,splitJapaneseSentences,
  type AuthenticToken,type PrivateDocumentView
} from "./authentic";
import { deletePrivateDocument } from "@thiepn/local-db";
import { AUTHENTIC_ACCOUNT_ID } from "./authentic";
import { importJapaneseSourcePack,parseJapaneseSourcePack,validateJapaneseSourcePack } from "./sourcePacks";

interface SelectedToken { token:AuthenticToken; }

export function AuthenticLibrary(){
  const [documents,setDocuments]=useState<PrivateDocumentView[]>([]);
  const [active,setActive]=useState<PrivateDocumentView|null>(null);
  const [showImport,setShowImport]=useState(false);
  const [title,setTitle]=useState("");
  const [text,setText]=useState("");
  const [tatoebaId,setTatoebaId]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  async function refresh(){setDocuments(await listPrivateDocumentViews());}
  useEffect(()=>{void refresh();},[]);

  async function importText(){
    if(!text.trim())return;
    setBusy(true);setMessage("");
    try{
      const doc=await createPrivateDocument({title:title||"Pasted Japanese",text,sourceKind:"paste"});
      setText("");setTitle("");setShowImport(false);await refresh();
      const view=(await listPrivateDocumentViews()).find((item)=>item.document.id===doc.id);if(view)setActive(view);
    }catch(error){setMessage(error instanceof Error?error.message:"Import failed.");}finally{setBusy(false);}
  }
  async function importFile(file:File){
    setBusy(true);setMessage("");
    try{
      const lower=file.name.toLowerCase();const sourceKind=lower.endsWith(".srt")||lower.endsWith(".vtt")?"subtitle":"text_file";
      const doc=await createPrivateDocument({title:file.name.replace(/\.(txt|srt|vtt|md)$/i,""),text:await file.text(),sourceKind,sourceLabel:"Private local file"});
      await refresh();const view=(await listPrivateDocumentViews()).find((item)=>item.document.id===doc.id);if(view)setActive(view);
    }catch(error){setMessage(error instanceof Error?error.message:"File import failed.");}finally{setBusy(false);}
  }
  async function importTatoeba(){
    if(!tatoebaId.trim())return;
    setBusy(true);setMessage("");
    try{
      const result=await importTatoebaSentence(tatoebaId);
      setTatoebaId("");await refresh();
      setMessage(result.audioAccepted?"Imported with reusable native audio.":`Imported text. Native audio not admitted: ${result.audioRejectionReason??"unavailable"}`);
      const view=(await listPrivateDocumentViews()).find((item)=>item.document.id===result.document.id);if(view)setActive(view);
    }catch(error){setMessage(error instanceof Error?error.message:"Tatoeba import failed.");}finally{setBusy(false);}
  }

  async function importSourcePack(file:File){
    setBusy(true);setMessage("");
    try{
      const pack=parseJapaneseSourcePack(await file.text());
      const validation=validateJapaneseSourcePack(pack);
      if(!validation.valid)throw new Error(validation.errors.join(" "));
      const imported=await importJapaneseSourcePack(pack);
      await refresh();
      setMessage(`Imported ${imported.length} source-pack item${imported.length===1?"":"s"}. ${validation.warnings.length?validation.warnings.length+" item(s) have no reusable native recording.":""}`);
    }catch(error){setMessage(error instanceof Error?error.message:"Source-pack import failed.");}finally{setBusy(false);}
  }

  if(active)return <AuthenticReader view={active} onBack={()=>{setActive(null);void refresh();}} onDeleted={()=>{setActive(null);void refresh();}}/>;

  return <section className="authentic-section">
    <div className="section-heading"><div><span className="course-kicker">AUTHENTIC INPUT</span><h2>Your Japanese</h2></div><button className="unit-action" type="button" onClick={()=>setShowImport((value)=>!value)}>{showImport?"Close import":"Import text"}</button></div>
    <p className="course-note">Private pasted text and local TXT/SRT/VTT files stay in the account-scoped local database. The browser analyzes them against your canonical lexicon; unknown density is an estimate, not a CEFR score.</p>
    {showImport?<div className="authentic-import">
      <label>Title<input value={title} onChange={(event)=>setTitle(event.target.value)} placeholder="My article or dialogue"/></label>
      <label>Japanese text<textarea value={text} onChange={(event)=>setText(event.target.value)} rows={7} placeholder="Paste Japanese here…"/></label>
      <div className="authentic-import-actions"><button className="primary" disabled={busy||!text.trim()} type="button" onClick={()=>void importText()}>{busy?"Working…":"Analyze + import"}</button>
        <label className="file-button">TXT / SRT / VTT<input type="file" accept=".txt,.md,.srt,.vtt,text/plain,text/vtt" disabled={busy} onChange={(event)=>{const file=event.currentTarget.files?.[0];if(file)void importFile(file);event.currentTarget.value="";}}/></label>
        <label className="file-button">Licensed source pack<input type="file" accept=".json,application/json" disabled={busy} onChange={(event)=>{const file=event.currentTarget.files?.[0];if(file)void importSourcePack(file);event.currentTarget.value="";}}/></label></div>
      <p className="source-pack-note">Source-pack JSON must declare a redistributable license and attribution. Native audio is admitted only with its own reusable license, credit and explicit native-speaker declaration.</p>
      <div className="tatoeba-import"><div><strong>Licensed native-audio route</strong><span>Import a Japanese Tatoeba sentence by ID. Reusable audio is attached only when its recording declares an admitted license.</span></div><input aria-label="Tatoeba sentence ID" value={tatoebaId} onChange={(event)=>setTatoebaId(event.target.value)} placeholder="e.g. 432825"/><button className="unit-action" disabled={busy||!tatoebaId.trim()} type="button" onClick={()=>void importTatoeba()}>Import Tatoeba</button></div>
    </div>:null}
    {message?<p className="import-message" role="status">{message}</p>:null}
    <div className="private-doc-list">
      {documents.map((view)=><article className="private-doc-card" key={view.document.id}>
        <div><div className="immersion-meta"><span>{view.document.sourceKind.replace("_"," ")}</span><span>{view.analysis.difficulty}</span>{view.document.nativeAudio?<span>native audio</span>:null}</div>
          <h3>{view.document.title}</h3><p>{preview(view.document.text)}</p>
          <div className="readiness"><div><span>Known lexical tokens</span><strong>{Math.round(view.analysis.knownRatio*100)}%</strong></div><div className="meter"><span style={{width:Math.round(view.analysis.knownRatio*100)+"%"}}/></div>
            <small>{view.analysis.unknownTypes.length} unique unresolved forms · reading {Math.round(view.readingMastery*100)}% · listening {Math.round(view.listeningMastery*100)}%</small></div>
        </div>
        <button className="unit-action" type="button" onClick={()=>{setActive(view);void recordPrivateReading(view.document.id);}}>Open</button>
      </article>)}
      {!documents.length?<p className="muted">No private input yet. Import a short dialogue, article excerpt, subtitle file, or a licensed Tatoeba sentence.</p>:null}
    </div>
  </section>;
}

function AuthenticReader({view,onBack,onDeleted}:{view:PrivateDocumentView;onBack:()=>void;onDeleted:()=>void}){
  const [selected,setSelected]=useState<SelectedToken|null>(null);
  const [meaning,setMeaning]=useState("");
  const [reading,setReading]=useState("");
  const [speaking,setSpeaking]=useState(false);
  const [audioState,setAudioState]=useState<"idle"|"playing"|"error">("idle");
  const [sentenceCandidate,setSentenceCandidate]=useState<string|null>(null);
  const [sentenceTranslation,setSentenceTranslation]=useState("");
  const [mineMessage,setMineMessage]=useState("");
  const analysis=useMemo(()=>analyzeAuthenticText(view.document.text),[view.document.text]);
  const sourceSentences=useMemo(()=>splitJapaneseSentences(view.document.text),[view.document.text]);
  const audioProvider=useRef(getDefaultAudioProvider());

  useEffect(()=>()=>{audioProvider.current.stop();if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();},[]);

  async function playNative(rate=1){
    const native=view.document.nativeAudio;if(!native)return;
    setAudioState("playing");
    const asset:AudioAssetRecord={id:"private-"+view.document.id,kind:"sentence",text:view.document.text,language:"ja",format:native.url.toLowerCase().includes(".ogg")?"ogg":"mp3",url:native.url,credit:native.credit,licenseName:native.licenseName,...(native.attributionUrl?{attributionUrl:native.attributionUrl}:{}),...(native.externalId?{externalId:native.externalId}:{}),nativeSpeaker:true,sourceIds:["tatoeba"]};
    try{await audioProvider.current.play(asset,{rate,repeats:1});setAudioState("idle");await recordPrivateListening(view.document.id,"recorded");}catch{setAudioState("error");}
  }
  async function speak(rate=.92){
    if(typeof speechSynthesis==="undefined")return;
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(view.document.text);u.lang="ja-JP";u.rate=rate;
    const voice=speechSynthesis.getVoices().find((item)=>item.lang.toLowerCase().startsWith("ja"));if(voice)u.voice=voice;
    setSpeaking(true);u.onend=()=>{setSpeaking(false);void recordPrivateListening(view.document.id,"speech_synthesis");};u.onerror=()=>setSpeaking(false);speechSynthesis.speak(u);
  }
  async function mine(){
    if(!selected)return;
    if(selected.token.kind==="known"&&selected.token.lexemeId){await mineKnownLexeme(view.document.id,selected.token.lexemeId);setSelected(null);return;}
    if(selected.token.kind==="unknown"&&meaning.trim()){
      await saveUnknownAsPrivateVocabulary({surface:selected.token.surface,meaning,...(reading.trim()?{reading:reading.trim()}:{}),documentId:view.document.id});
      setMeaning("");setReading("");setSelected(null);
    }
  }
  async function remove(){await deletePrivateDocument(AUTHENTIC_ACCOUNT_ID,view.document.id);onDeleted();}
  async function saveSentence(){
    if(!sentenceCandidate||!sentenceTranslation.trim())return;
    const record=await minePrivateSentence({documentId:view.document.id,text:sentenceCandidate,translation:sentenceTranslation});
    setMineMessage("Saved "+record.text+" to the unified sentence review path.");
    setSentenceCandidate(null);setSentenceTranslation("");
  }

  return <section className="reader-page authentic-reader">
    <header className="reader-head"><button className="quiet-button reader-back" type="button" onClick={onBack}>← Your Japanese</button><div><span>{view.document.sourceKind.replace("_"," ")}</span><h1>{view.document.title}</h1></div></header>
    <div className="authentic-summary"><div><strong>{Math.round(analysis.knownRatio*100)}%</strong><span>known lexical tokens</span></div><div><strong>{analysis.unknownTypes.length}</strong><span>unique unresolved forms</span></div><div><strong>{analysis.difficulty}</strong><span>estimated stretch</span></div></div>
    <div className="authentic-audio">
      {view.document.nativeAudio?<><button className="primary" disabled={audioState==="playing"} type="button" onClick={()=>void playNative(1)}>{audioState==="playing"?"Playing…":"Play native recording"}</button><button className="unit-action" disabled={audioState==="playing"} type="button" onClick={()=>void playNative(.82)}>Native slower</button></>:null}
      <button className="unit-action" disabled={speaking||typeof speechSynthesis==="undefined"} type="button" onClick={()=>void speak(.92)}>{speaking?"Playing…":"Device voice fallback"}</button>
      {view.document.nativeAudio?<small>{view.document.nativeAudio.credit} · {view.document.nativeAudio.licenseName}</small>:<small>No reusable native recording is attached. Device speech synthesis is labeled as fallback, not native audio.</small>}
      {audioState==="error"?<span className="error-text">Native recording could not be played from its source.</span>:null}
    </div>
    <article className="authentic-text" lang="ja">{analysis.tokens.map((token,index)=>{
      if(token.kind==="known"||token.kind==="unknown")return <button className={"auth-token "+token.kind} type="button" key={index} onClick={()=>{setSelected({token});setMeaning("");setReading("");}}>{token.surface}</button>;
      return <span className={"auth-token "+token.kind} key={index}>{token.surface}</span>;
    })}</article>
    <div className="authentic-legend"><span><i className="known"/>linked to your lexicon</span><span><i className="unknown"/>unresolved</span></div>
    {sourceSentences.length?<section className="sentence-mining"><div className="section-heading"><div><span className="course-kicker">SENTENCE MINING</span><h2>Keep useful context</h2></div></div>
      <p className="course-note">Save a sentence only after supplying the meaning you want to review. Duplicate Japanese sentences merge their source-document references instead of creating duplicate cards.</p>
      <div className="sentence-mine-list">{sourceSentences.slice(0,12).map((sentence)=><article key={sentence}><span lang="ja">{sentence}</span><button className="quiet-button" type="button" onClick={()=>{setSentenceCandidate(sentence);setSentenceTranslation("");setMineMessage("");}}>Mine sentence</button></article>)}</div>
      {sentenceCandidate?<div className="sentence-mine-editor"><strong lang="ja">{sentenceCandidate}</strong><input value={sentenceTranslation} onChange={(event)=>setSentenceTranslation(event.target.value)} placeholder="Meaning / translation for your review"/><div><button className="primary" disabled={!sentenceTranslation.trim()} type="button" onClick={()=>void saveSentence()}>Save sentence</button><button className="quiet-button" type="button" onClick={()=>setSentenceCandidate(null)}>Cancel</button></div></div>:null}
      {mineMessage?<p className="import-message" role="status">{mineMessage}</p>:null}
    </section>:null}
    {selected?<aside className="reader-lookup authentic-lookup"><button className="reader-lookup-close" type="button" aria-label="Close word lookup" onClick={()=>setSelected(null)}>×</button>
      <span lang="ja">{selected.token.surface}</span>
      {selected.token.kind==="known"?<><small lang="ja">{selected.token.reading}</small><strong>{selected.token.meaning}</strong><button className="unit-action" type="button" onClick={()=>void mine()}>Mine for review</button></>
      :<><small>Unknown to the current canonical lexicon. Add a private definition to review it without changing public Japanese content.</small><input value={reading} onChange={(event)=>setReading(event.target.value)} placeholder="Reading (optional)"/><input value={meaning} onChange={(event)=>setMeaning(event.target.value)} placeholder="Meaning"/><button className="unit-action" disabled={!meaning.trim()} type="button" onClick={()=>void mine()}>Save + mine</button></>}
    </aside>:null}
    <div className="reader-finish"><button className="primary" type="button" onClick={()=>void recordPrivateComprehension(view.document.id,"correct")}>Understood without major help</button><button className="unit-action" type="button" onClick={()=>void recordPrivateComprehension(view.document.id,"incorrect")}>Needed substantial support</button></div>
    <div className="authentic-danger"><button className="quiet-button" type="button" onClick={()=>void remove()}>Delete private document</button></div>
    <p className="course-note">Analysis resolves canonical forms, generated inflections and additional B1/B2 deinflection patterns before using the browser Japanese word segmenter. Canonical sense identities and ambiguity are exposed explicitly. A dictionary-grade morphology provider can replace the bounded local resolver later; the current browser path does not claim dictionary-grade parsing.</p>
  </section>;
}

function preview(value:string):string{return value.replace(/\s+/g," ").slice(0,150)+(value.length>150?"…":"");}
