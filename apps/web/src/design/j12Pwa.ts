import type {JTheme} from "./index";

export function syncJ12ThemeColor(theme:JTheme):void{
  const meta=document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if(!meta)return;
  meta.content=theme==="dark"?"#0D0D0C":"#FBF8F1";
}
