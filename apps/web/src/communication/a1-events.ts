export const A1_PROGRESS_EVENT="japanese:a1:progress";
export function notifyA1Progress():void{
 if(typeof window!=="undefined")window.dispatchEvent(new Event(A1_PROGRESS_EVENT));
}
export function subscribeA1Progress(listener:()=>void):()=>void{
 if(typeof window==="undefined")return()=>{};
 window.addEventListener(A1_PROGRESS_EVENT,listener);
 return()=>window.removeEventListener(A1_PROGRESS_EVENT,listener);
}
