import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { J1VisualSandbox } from "./design/J1VisualSandbox";
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

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL}));
}

const mobileQuery=window.matchMedia("(max-width: 760px)");
const loadMobile=()=>{void import("./design/J12MobileRuntime");};
if(mobileQuery.matches)loadMobile();
else mobileQuery.addEventListener("change",(event)=>{if(event.matches)loadMobile();},{once:true});

const exhibitionQuery=window.matchMedia("(min-width: 761px)");
const loadExhibition=()=>{void import("./design/J13ExhibitionRuntime");};
if(exhibitionQuery.matches)loadExhibition();
else exhibitionQuery.addEventListener("change",(event)=>{if(event.matches)loadExhibition();},{once:true});

const visualQa=new URLSearchParams(window.location.search).get("visual-qa")==="j1";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{visualQa?<J1VisualSandbox/>:<App />}</StrictMode>,
);
