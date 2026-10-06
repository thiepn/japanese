import type {ButtonHTMLAttributes,CSSProperties,HTMLAttributes,ReactNode} from "react";

export type JTheme="light"|"dark";
export type JSeason="spring"|"tsuyu"|"summer"|"autumn"|"winter"|"new-year";
export type JMaterial="washi"|"sumi"|"lacquer"|"gold";
export type JPatternName="ichimatsu"|"asanoha"|"seigaiha"|"shippo"|"kikko"|"yagasuri"|"sayagata"|"karakusa";

type SurfaceProps=HTMLAttributes<HTMLElement>&{
  as?:"section"|"article"|"div";
  theme?:JTheme;
  season?:JSeason;
  material?:JMaterial;
  children:ReactNode;
};

export function JSurface({
  as="section",
  theme="light",
  season="autumn",
  material="washi",
  className="",
  children,
  ...props
}:SurfaceProps){
  const Tag=as;
  return <Tag
    {...props}
    data-j1=""
    data-j-theme={theme}
    data-j-season={season}
    className={["j-surface","j-material-"+material,className].filter(Boolean).join(" ")}
  >{children}</Tag>;
}

export function JPattern({
  name,
  className="",
  label,
}:{
  name:JPatternName;
  className?:string;
  label?:string;
}){
  return <div
    aria-hidden={label?undefined:true}
    aria-label={label}
    className={["j-pattern","j-pattern--"+name,className].filter(Boolean).join(" ")}
  />;
}

export function JCartouche({
  japanese,
  subtitle,
  className="",
}:{
  japanese:string;
  subtitle?:string;
  className?:string;
}){
  return <div className={["j-cartouche",className].filter(Boolean).join(" ")}>
    <span className="j-cartouche__jp" lang="ja">{japanese}</span>
    {subtitle?<span className="j-cartouche__sub">{subtitle}</span>:null}
  </div>;
}

export function JSeal({
  children,
  shape="square",
  size="medium",
  className="",
  label,
}:{
  children:ReactNode;
  shape?:"square"|"circle";
  size?:"small"|"medium"|"large";
  className?:string;
  label?:string;
}){
  return <span
    className={[
      "j-seal",
      "j-seal--"+shape,
      size!=="medium"?"j-seal--"+size:"",
      className,
    ].filter(Boolean).join(" ")}
    aria-label={label}
  >{children}</span>;
}

export function JSectionMark({
  glyph,
  title,
  eyebrow,
  className="",
}:{
  glyph:string;
  title:string;
  eyebrow:string;
  className?:string;
}){
  return <div className={["j-section-mark",className].filter(Boolean).join(" ")}>
    <span aria-hidden="true" className="j-section-mark__glyph" lang="ja">{glyph}</span>
    <span className="j-section-mark__copy">
      <strong>{title}</strong>
      <span>{eyebrow}</span>
    </span>
  </div>;
}

export function JDivider({
  kind="wave",
  className="",
}:{
  kind?:"wave"|"cloud"|"ink";
  className?:string;
}){
  const path=kind==="wave"
    ?"M0 18 C18 6 36 6 54 18 S90 30 108 18 S144 6 162 18 S198 30 216 18 S252 6 270 18 S306 30 324 18"
    :kind==="cloud"
      ?"M0 21 H52 C60 21 61 12 69 12 C76 12 79 17 84 17 C90 17 93 7 104 7 C116 7 120 17 129 17 H181 C190 17 194 11 202 11 C212 11 216 18 225 18 H324"
      :"M4 18 C42 14 74 21 112 17 C148 13 188 20 224 16 C255 13 286 19 320 15";
  return <svg
    aria-hidden="true"
    className={["j-divider","j-divider--"+kind,className].filter(Boolean).join(" ")}
    preserveAspectRatio="none"
    viewBox="0 0 324 30"
  ><path d={path}/></svg>;
}

export function JInkProgress({
  value,
  label,
  className="",
}:{
  value:number;
  label:string;
  className?:string;
}){
  const normalized=Math.max(0,Math.min(1,value));
  const pct=Math.round(normalized*100);
  const style={"--j-progress":pct+"%"} as CSSProperties;
  return <div
    className={["j-ink-progress",className].filter(Boolean).join(" ")}
    role="progressbar"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={pct}
  ><span className="j-ink-progress__fill" style={style}/></div>;
}

export function JBrushButton({
  children,
  className="",
  ...props
}:ButtonHTMLAttributes<HTMLButtonElement>){
  return <button
    {...props}
    className={["j-brush-button",className].filter(Boolean).join(" ")}
    type={props.type??"button"}
  >{children}</button>;
}
