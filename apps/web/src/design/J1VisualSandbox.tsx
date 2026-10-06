import {useState} from "react";
import {
  JBrushButton,
  JCartouche,
  JDivider,
  JInkProgress,
  JPattern,
  JSeal,
  JSectionMark,
  type JPatternName,
  type JSeason,
  type JTheme,
} from "./primitives";

const PATTERNS:JPatternName[]=[
  "seigaiha",
  "asanoha",
  "shippo",
  "ichimatsu",
  "kikko",
  "yagasuri",
  "sayagata",
  "karakusa",
];

const SEASONS:{value:JSeason;label:string}[]=[
  {value:"spring",label:"Spring · 春"},
  {value:"tsuyu",label:"Tsuyu · 梅雨"},
  {value:"summer",label:"Summer · 夏"},
  {value:"autumn",label:"Autumn · 秋"},
  {value:"winter",label:"Winter · 冬"},
  {value:"new-year",label:"New Year · 正月"},
];

export function J1VisualSandbox(){
  const [theme,setTheme]=useState<JTheme>("light");
  const [season,setSeason]=useState<JSeason>("autumn");

  return <main
    className="j1-root j1-sandbox j-material-washi"
    data-j1=""
    data-j-theme={theme}
    data-j-season={season}
  >
    <div className="j1-sandbox__frame">
      <header className="j1-sandbox__head">
        <div className="j1-sandbox__title">
          <JSeal shape="square" size="large" label="J1 design engine">日</JSeal>
          <div>
            <p className="j1-display" lang="ja">日本語・意匠体系</p>
            <h1>Japanese Design Engine</h1>
            <p>Visual QA sandbox for the J-series primitives. This surface is intentionally separate from the learner product until J2+ migration.</p>
          </div>
        </div>
        <div className="j1-sandbox__controls">
          <button type="button" onClick={()=>setTheme((value)=>value==="light"?"dark":"light")}>
            {theme==="light"?"Dark · 墨":"Light · 紙"}
          </button>
          <label>
            <span className="j1-visually-hidden">Season</span>
            <select value={season} onChange={(event)=>setSeason(event.target.value as JSeason)}>
              {SEASONS.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>
      </header>

      <JDivider kind="ink"/>

      <section className="j1-sandbox__section" aria-labelledby="j1-materials">
        <JSectionMark glyph="紙" title="Materials" eyebrow="washi · sumi · lacquer · gold"/>
        <h2 className="j1-visually-hidden" id="j1-materials">Material system</h2>
        <div className="j1-sandbox__grid">
          <div className="j1-sandbox__swatch j-material-washi"><strong>Washi</strong><span>Primary light substrate</span></div>
          <div className="j1-sandbox__swatch j-material-sumi"><strong>Sumi</strong><span>Focus and dark material</span></div>
          <div className="j1-sandbox__swatch j-material-lacquer"><strong>Urushi</strong><span>Ceremonial/high-value surface</span></div>
          <div className="j1-sandbox__swatch j-material-gold"><strong>Kin</strong><span>Milestone-only gold field</span></div>
        </div>
      </section>

      <JDivider kind="wave"/>

      <section className="j1-sandbox__section" aria-labelledby="j1-patterns">
        <JSectionMark glyph="文" title="Pattern Library" eyebrow="traditional geometry · original procedural redraw"/>
        <h2 className="j1-visually-hidden" id="j1-patterns">Pattern system</h2>
        <div className="j1-sandbox__grid">
          {PATTERNS.map((pattern)=><div className="j1-sandbox__pattern" key={pattern}>
            <JPattern name={pattern}/>
            <label>{pattern}</label>
          </div>)}
        </div>
      </section>

      <JDivider kind="cloud"/>

      <section className="j1-sandbox__section" aria-labelledby="j1-type">
        <JSectionMark glyph="字" title="Japanese Type" eyebrow="gothic · mincho · display"/>
        <h2 className="j1-visually-hidden" id="j1-type">Typography roles</h2>
        <div className="j1-sandbox__type">
          <p className="jp-large" lang="ja">学ぶほど、景色がひらく。</p>
          <p className="jp-reader" lang="ja"><ruby>日本語<rt>にほんご</rt></ruby>を学ぶ道は、ことばを覚えるだけではない。読むこと、聞くこと、話すことが少しずつ一つの景色になる。</p>
          <p>UI Gothic remains utilitarian. Long Japanese reading uses the editorial Mincho role with generous line height and legible ruby.</p>
        </div>
      </section>

      <section className="j1-sandbox__section" aria-labelledby="j1-primitives">
        <JSectionMark glyph="印" title="Signature Primitives" eyebrow="cartouche · hanko · ink"/>
        <h2 className="j1-visually-hidden" id="j1-primitives">Signature primitives</h2>
        <div className="j1-sandbox__primitives">
          <JCartouche japanese="今日" subtitle="Today"/>
          <JCartouche japanese="学" subtitle="Learn"/>
          <JSeal label="Mastered">習得</JSeal>
          <JSeal shape="circle" label="Reviewed">復</JSeal>
          <JBrushButton>Continue study</JBrushButton>
        </div>
        <div className="j1-sandbox__type">
          <strong>Ink progress · 68%</strong>
          <JInkProgress value={.68} label="Visual QA mastery progress"/>
        </div>
      </section>

      <section className="j1-sandbox__section" aria-labelledby="j1-motion">
        <JSectionMark glyph="動" title="Motion Language" eyebrow="hanko · ink · fusuma · noren"/>
        <h2 className="j1-visually-hidden" id="j1-motion">Motion primitives</h2>
        <div className="j1-sandbox__motion">
          <div className="j-motion-fusuma">
            <JCartouche japanese="襖" subtitle="Fusuma reveal"/>
            <p>Major context changes use lateral panel motion rather than generic fades.</p>
          </div>
          <div className="j-motion-noren">
            <JCartouche japanese="暖簾" subtitle="Noren threshold"/>
            <p>Focused spaces can enter vertically while reduced-motion users receive an immediate state change.</p>
          </div>
          <div>
            <JSeal className="j-motion-hanko" size="large" label="Animated completion seal">完</JSeal>
            <p>Completion lands once. It is not a continuous decorative animation.</p>
          </div>
          <div>
            <strong>Ink draw</strong>
            <div className="j1-sandbox__progress">
              <JInkProgress className="j-motion-ink" value={.82} label="Animated ink progress"/>
            </div>
            <p>Progress uses a directional ink gesture while retaining semantic progressbar output.</p>
          </div>
        </div>
      </section>
    </div>
  </main>;
}
