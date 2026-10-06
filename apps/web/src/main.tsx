import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { J1VisualSandbox } from "./design/J1VisualSandbox";
import "./styles.css";
import "./design/j1.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL}));
}

const visualQa=new URLSearchParams(window.location.search).get("visual-qa")==="j1";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{visualQa?<J1VisualSandbox/>:<App />}</StrictMode>,
);
