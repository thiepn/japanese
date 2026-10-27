import {useEffect,useRef,useState,type ComponentType} from "react";
import type {KanaView,KanaToolRequest} from "../../../kana-studio/src/App";
import {bindEmbeddedKanaWorkspace,unbindEmbeddedKanaWorkspace}
  from "../../../kana-studio/src/services/japaneseBridge";
import {publishKanaOwnerLease,readKanaOwnerLease,KANA_OWNER_KEY} from "../kanaHandoff";
import "./nativeKana.css";

type Props={
  owner:string;initialView:KanaView;onExit:()=>void;
  onViewChange:(view:KanaView)=>void;
  requestedTool:KanaToolRequest|null;
  onProgressChange:()=>void;
};
type Embedded=ComponentType<{
  embedded?:boolean;initialView?:KanaView;onExit?:()=>void;
  onViewChange?:(view:KanaView)=>void;
  requestedTool?:KanaToolRequest|null;
  onProgressChange?:()=>void;
}>;

export function NativeKanaWorkspace({owner,initialView,onExit,onViewChange,requestedTool,onProgressChange}:Props){
  const [Screen,setScreen]=useState<Embedded|null>(null);
  const progressRef=useRef(onProgressChange);
  useEffect(()=>{progressRef.current=onProgressChange;},[onProgressChange]);
  const [error,setError]=useState<string|null>(null);
  const [dark,setDark]=useState(false);

  useEffect(()=>{
    const shell=document.querySelector(".j2-shell");
    const sync=()=>setDark(shell?.getAttribute("data-j-theme")==="dark");
    sync();
    if(!shell)return;
    const observer=new MutationObserver(sync);
    observer.observe(shell,{attributes:true,attributeFilter:["data-j-theme"]});
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const lease=readKanaOwnerLease();
    const check=()=>{
      const current=readKanaOwnerLease();
      if(!lease||current?.owner!==owner||current.epoch!==lease.epoch){
        setScreen(null);
        setError("Japanese Account changed in another tab. Return to Japanese to reopen your current workspace.");
      }
    };
    const onStorage=(event:StorageEvent)=>{
      if(event.key===KANA_OWNER_KEY||event.key===null)check();
    };
    window.addEventListener("storage",onStorage);
    window.addEventListener("pageshow",check);
    window.addEventListener("focus",check);
    return()=>{
      window.removeEventListener("storage",onStorage);
      window.removeEventListener("pageshow",check);
      window.removeEventListener("focus",check);
    };
  },[owner]);
  useEffect(()=>{
    let active=true;
    setScreen(null);
    setError(null);
    try {
      publishKanaOwnerLease(owner);
      bindEmbeddedKanaWorkspace(owner);
      void import("../../../kana-studio/src/App").then(module=>{
        if(active)setScreen(()=>module.KanaExperience);
      }).catch(error=>{
        if(active)setError(error instanceof Error?error.message:"Could not open Kana.");
      });
    } catch(error){
      setError(error instanceof Error?error.message:"Kana workspace unavailable.");
    }
    return()=>{
      active=false;
      unbindEmbeddedKanaWorkspace(owner);
      progressRef.current();
    };
  },[owner]);

  return <section className={"j2-native-kana"+(dark?" dark":"")} aria-label="Kana learning">
    {error?<div role="alert"><p>{error}</p><button type="button" onClick={onExit}>Return to Japanese</button></div>:null}
    {!error&&!Screen?<p role="status">Opening Kana lessons and reviews…</p>:null}
    {Screen&&!error?<Screen embedded initialView={initialView} onExit={onExit} onViewChange={onViewChange}
      requestedTool={requestedTool} onProgressChange={()=>progressRef.current()}/>:null}
  </section>;
}
