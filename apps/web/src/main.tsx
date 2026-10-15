import { StrictMode,Suspense,lazy } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import {resolveJ10Season} from "./design/j10Season";
import {syncJ12ThemeColor} from "./design/j12Pwa";
import {applyJTheme,readJTheme} from "./design/j14Theme";
import "./styles.css";
import "./design/j1.css";
import "./design/j2.css";
import "./design/j3.css";
import "./design/j4.css";
import "./design/j5.css";
import "./design/j6.css";
import "./design/j7.css";
import "./design/j8.css";
import "./design/j9.css";
import "./design/j10.css";
import "./design/j15b.css";

const initialTheme=readJTheme();
applyJTheme(initialTheme);
document.documentElement.dataset.jSeason=resolveJ10Season();
syncJ12ThemeColor(initialTheme);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL})
      .catch(()=>{/* Study remains usable when the browser blocks PWA registration. */});
  });
}

const mobileQuery=window.matchMedia("(max-width: 760px)");
const loadMobile=()=>{void import("./design/J12MobileRuntime");};
if(mobileQuery.matches)loadMobile();
else mobileQuery.addEventListener("change",(event)=>{if(event.matches)loadMobile();},{once:true});

const exhibitionQuery=window.matchMedia("(min-width: 761px)");
const loadExhibition=()=>{void import("./design/J13ExhibitionRuntime");};
if(exhibitionQuery.matches)loadExhibition();
else exhibitionQuery.addEventListener("change",(event)=>{if(event.matches)loadExhibition();},{once:true});

// Visual QA tools are never fetched by the normal learner entry.
const J1VisualSandbox=lazy(()=>import("./design/J1VisualSandbox").then(m=>({default:m.J1VisualSandbox})));
const visualQa=new URLSearchParams(window.location.search).get("visual-qa")==="j1";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{visualQa?<Suspense fallback={<main role="main"><p role="status">Opening visual QA…</p></main>}><J1VisualSandbox/></Suspense>:<App />}</StrictMode>,
);
