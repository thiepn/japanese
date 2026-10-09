import {useEffect,useRef,useState,type ReactNode} from "react";
import {JPattern,JSeal,type JTheme} from "./index";
import {j9SensoryFeedback,readJ9SensoryEnabled,setJ9SensoryEnabled} from "./j9Sensory";
import {J10SeasonalWorld} from "./J10SeasonalWorld";
import {j10SeasonLabel,j10SeasonPattern,resolveJ10Season} from "./j10Season";
import {syncJ12ThemeColor} from "./j12Pwa";
import {applyJTheme,persistJTheme,readJTheme} from "./j14Theme";

export type J2Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";

const SURFACES:readonly {
  id:J2Surface;
  japanese:string;
  english:string;
  glyph:string;
  hint:string;
}[]=[
  {id:"Today",japanese:"今日",english:"Today",glyph:"今",hint:"Daily study"},
  {id:"Learn",japanese:"学ぶ",english:"Learn",glyph:"学",hint:"Course path"},
  {id:"Immerse",japanese:"浸る",english:"Immerse",glyph:"浸",hint:"Read and listen"},
  {id:"Library",japanese:"蔵",english:"Library",glyph:"蔵",hint:"Knowledge archive"},
  {id:"Progress",japanese:"道",english:"Progress",glyph:"道",hint:"Your path"},
];

export function J2AppShell({
  surface,
  onSurfaceChange,
  accountState,
  accountConnected,
  accountBusy,
  onAccountAction,
  accountStatus,
  diagnosticsMode=false,
  children,
}:{
  surface:J2Surface;
  onSurfaceChange:(surface:J2Surface)=>void;
  accountState:"authenticated"|"anonymous"|"expired"|"loading";
  accountConnected:boolean;
  accountBusy:boolean;
  onAccountAction:(action:"signIn"|"connect"|"signOut")=>void;
  accountStatus?:string|null;
  diagnosticsMode?:boolean;
  children:ReactNode;
}){
  const [theme,setTheme]=useState<JTheme>(readJTheme);
  const [sensory,setSensory]=useState(readJ9SensoryEnabled);
  const [accountOpen,setAccountOpen]=useState(false);
  const accountAreaRef=useRef<HTMLDivElement>(null);
  const season=resolveJ10Season();

  useEffect(()=>{
    if(!accountOpen)return;
    const dismiss=(event:PointerEvent)=>{
      if(event.target instanceof Node&&!accountAreaRef.current?.contains(event.target))setAccountOpen(false);
    };
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){setAccountOpen(false);accountAreaRef.current?.querySelector<HTMLButtonElement>(".j2-account")?.focus();}
    };
    document.addEventListener("pointerdown",dismiss);
    document.addEventListener("keydown",onKey);
    return()=>{document.removeEventListener("pointerdown",dismiss);document.removeEventListener("keydown",onKey);};
  },[accountOpen]);

  useEffect(()=>{
    persistJTheme(theme);
    applyJTheme(theme);
    document.documentElement.dataset.jSeason=season;
    syncJ12ThemeColor(theme);
  },[theme,season]);

  useEffect(()=>{
    document.documentElement.dataset.jSensory=sensory?"on":"off";
    setJ9SensoryEnabled(sensory);
    return()=>{delete document.documentElement.dataset.jSensory;};
  },[sensory]);

  function chooseSurface(next:J2Surface){
    if(next===surface&&!diagnosticsMode)return;
    j9SensoryFeedback("navigate");
    onSurfaceChange(next);
  }

  function toggleSensory(){
    const next=!sensory;
    setSensory(next);
    setJ9SensoryEnabled(next);
    if(next)j9SensoryFeedback("enable",true);
  }

  function toggleTheme(){
    setTheme(theme==="light"?"dark":"light");
  }

  return <div
    className={"j1-root j2-shell j-material-washi"+(diagnosticsMode?" j2-shell--diagnostics":"")}
    data-j1=""
    data-j-theme={theme}
    data-j-season={season}
    data-j-sensory={sensory?"on":"off"}
  >
    <div className="j2-ambient" aria-hidden="true">
      <JPattern name={j10SeasonPattern(season)} className="j2-ambient__pattern"/>
      <J10SeasonalWorld season={season}/>
      <span className="j2-ambient__sun"/>
      <span className="j2-ambient__brush"/>
    </div>

    <header className="j2-topbar">
      <div className="j2-brand" aria-label="Japanese">
        <JSeal className="j2-brand__seal" size="small" label="Japanese">日</JSeal>
        <span className="j2-brand__copy">
          <strong lang="ja">日本語</strong>
          <small>Japanese</small>
        </span>
      </div>

      <div className="j2-topbar__season" aria-hidden="true">
        <span lang="ja">{j10SeasonLabel(season)}</span>
        <i/>
        <span>{diagnosticsMode?"診断":"学びの景色"}</span>
      </div>

      <div className="j2-topbar__actions">
        <button
          aria-label={theme==="light"?"Use dark theme":"Use light theme"}
          className="j2-theme-toggle"
          onClick={toggleTheme}
          title={theme==="light"?"墨色の夜":"和紙の昼"}
          type="button"
        >
          <span aria-hidden="true">{theme==="light"?"墨":"紙"}</span>
        </button>
        <button
          aria-pressed={sensory}
          aria-label={sensory?"Disable subtle sound and haptics":"Enable subtle sound and haptics"}
          className="j9-sensory-toggle"
          onClick={toggleSensory}
          title={sensory?"Sensory feedback on":"Sensory feedback off"}
          type="button"
        >
          <span aria-hidden="true">{sensory?"響":"静"}</span>
        </button>
        <div className="j2-account-area" ref={accountAreaRef}>
          <button
            aria-controls="japanese-account-panel"
            aria-expanded={accountOpen}
            aria-haspopup="dialog"
            aria-label="Open THIEPN Account"
            className="j2-account"
            onClick={()=>setAccountOpen(open=>!open)}
            type="button"
          >
            <span className="j2-account__mon" aria-hidden="true">人</span>
            <span>Account</span>
            <span className="j2-account__chevron" aria-hidden="true">{accountOpen?"−":"⌄"}</span>
          </button>
          {accountOpen?<section
            aria-label="THIEPN Account"
            className="j2-account-panel"
            id="japanese-account-panel"
            role="dialog"
          >
            <header className="j2-account-panel__header">
              <div>
                <p className="j2-account-panel__eyebrow">THIEPN · IDENTITY</p>
                <h2>Account</h2>
              </div>
              <button aria-label="Close Account panel" className="j2-account-panel__close" onClick={()=>setAccountOpen(false)} type="button">×</button>
            </header>
            <div className="j2-account-panel__session" role="status">
              <span className={"j2-account-panel__indicator"+(accountState==="authenticated"?" is-connected":"")} aria-hidden="true"/>
              <div>
                <strong>{accountState==="loading"?"Checking your session":accountState==="authenticated"?"Signed in to THIEPN Account":"Not signed in"}</strong>
                <p>{accountState==="authenticated"
                  ?accountConnected?"Japanese is connected on this device.":"Your identity is verified. Japanese is not yet connected."
                  :accountState==="loading"?"Reading your saved THIEPN Account session.":"You can continue studying locally without signing in."}</p>
              </div>
            </div>
            <div className="j2-account-panel__actions">
              {accountState==="anonymous"||accountState==="expired"
                ?<button className="j2-account-panel__primary" disabled={accountBusy} onClick={()=>{setAccountOpen(false);onAccountAction("signIn");}} type="button">Sign in with THIEPN Account</button>
                :null}
              {accountState==="authenticated"&&!accountConnected
                ?<button className="j2-account-panel__primary" disabled={accountBusy} onClick={()=>{setAccountOpen(false);onAccountAction("connect");}} type="button">Connect Japanese to Account</button>
                :null}
              {accountState==="authenticated"
                ?<button className="j2-account-panel__secondary" disabled={accountBusy} onClick={()=>{setAccountOpen(false);onAccountAction("signOut");}} type="button">Sign out of Japanese</button>
                :null}
              <a className="j2-account-panel__diagnostics" href={`${import.meta.env.BASE_URL}?diagnostics=1&panel=account`}>View sign-in diagnostics <span aria-hidden="true">↗</span></a>
            </div>
            <p className="j2-account-panel__footnote">Your study progress remains stored locally on this device. Signing in does not erase it.</p>
          </section>:null}
        </div>
      </div>
    </header>

    <div className="j2-workspace">
      {!diagnosticsMode?<nav className="j2-nav" aria-label="Primary">
        <div className="j2-nav__caption" aria-hidden="true">
          <span lang="ja">学習</span>
          <i/>
        </div>
        {SURFACES.map((item)=><button
          aria-current={!diagnosticsMode&&surface===item.id?"page":undefined}
          aria-label={item.english}
          className={!diagnosticsMode&&surface===item.id?"active":""}
          key={item.id}
          onClick={()=>chooseSurface(item.id)}
          type="button"
        >
          <span className="j2-nav__mon" aria-hidden="true">{item.glyph}</span>
          <span className="j2-nav__label">
            <strong lang="ja">{item.japanese}</strong>
            <small>{item.english}</small>
          </span>
          <span className="j2-nav__hint" aria-hidden="true">{item.hint}</span>
        </button>)}
        <div className="j2-nav__footer" aria-hidden="true">
          <span>日本語</span>
          <small>study · immerse · grow</small>
        </div>
      </nav>:null}      <main className={"j2-content"+(diagnosticsMode?" j2-content--diagnostics":"")} id="main-content" tabIndex={-1}>
        <div className={"j9-fusuma j9-fusuma--"+surface.toLowerCase()} key={(diagnosticsMode?"diagnostics":surface)+"-transition"} aria-hidden="true"/>
        {accountStatus?<p className="j2-account-status" role="status">{accountStatus}</p>:null}
        {children}
      </main>
    </div>
  </div>;
}
