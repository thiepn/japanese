const DEVICE_ID_KEY="thiepn:japanese-device-id:v1";

let runtimeDeviceId:string|null=null;

export function getJapaneseDeviceId():string{
  if(runtimeDeviceId)return runtimeDeviceId;

  try{
    const existing=globalThis.localStorage?.getItem(DEVICE_ID_KEY)?.trim();
    if(existing&&validDeviceId(existing)){
      runtimeDeviceId=existing;
      return existing;
    }
  }catch{/* storage may be unavailable */}

  const generated="jp-browser-"+randomId();
  runtimeDeviceId=generated;
  try{globalThis.localStorage?.setItem(DEVICE_ID_KEY,generated);}catch{/* runtime fallback remains stable for this page */}
  return generated;
}

function randomId():string{
  if(typeof globalThis.crypto?.randomUUID==="function")return globalThis.crypto.randomUUID();
  const bytes=new Uint8Array(16);
  if(typeof globalThis.crypto?.getRandomValues==="function"){
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes,(byte)=>byte.toString(16).padStart(2,"0")).join("");
  }
  return Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
}

function validDeviceId(value:string):boolean{
  return /^jp-browser-[A-Za-z0-9-]{12,80}$/.test(value);
}
