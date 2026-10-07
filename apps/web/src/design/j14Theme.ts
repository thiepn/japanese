import type {JTheme} from "./primitives";

export function readJTheme():JTheme{
  try{
    const saved=window.localStorage.getItem("japanese:j-theme");
    if(saved==="light"||saved==="dark")return saved;
  }catch{/* storage is optional */}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light";
}

export function persistJTheme(theme:JTheme):void{
  try{window.localStorage.setItem("japanese:j-theme",theme);}catch{/* storage is optional */}
}

export function applyJTheme(theme:JTheme):void{
  document.documentElement.dataset.jTheme=theme;
  document.documentElement.style.colorScheme=theme;
}

let darkStylesPromise:Promise<void>|null=null;

export function ensureJ14DarkStyles():Promise<void>{
  darkStylesPromise??=import("./J14DarkRuntime").then(()=>undefined);
  return darkStylesPromise;
}
