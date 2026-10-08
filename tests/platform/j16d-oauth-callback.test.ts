import {afterEach,describe,expect,it,vi} from "vitest";
import {createThiepnAccountAuthProvider,JAPANESE_LOGIN_STORAGE_KEY,JAPANESE_CONNECT_INTENT_KEY} from "../../packages/auth/src/index";

afterEach(()=>vi.unstubAllGlobals());

function setupCallback(withMarker:boolean){
  const local=new Map<string,string>(),session=new Map<string,string>();
  function storage(entries:Map<string,string>){
    return {
      getItem:vi.fn((key:string)=>entries.get(key)??null),
      setItem:vi.fn((key:string,value:string)=>{entries.set(key,value);}),
      removeItem:vi.fn((key:string)=>{entries.delete(key);}),
    };
  }
  if(withMarker){
    local.set(JAPANESE_LOGIN_STORAGE_KEY,JSON.stringify({
      started:Date.now(),returnTo:"/japanese/",
    }));
    local.set(JAPANESE_CONNECT_INTENT_KEY,"1");
  }
  vi.stubGlobal("localStorage",storage(local));
  vi.stubGlobal("sessionStorage",storage(session));
  const location={pathname:"/japanese/auth/callback/",search:"?code=verified-oauth-code",hash:""};
  const replaceState=vi.fn((_state:unknown,_unused:string,url:string)=>{
    location.pathname=url;
    location.search="";
  });
  vi.stubGlobal("window",{location,history:{replaceState}});
  let finishExchange:((value:{data:{session:{user:{id:string}}};error:null})=>void)|undefined;
  const exchangeCodeForSession=vi.fn(()=>new Promise<{data:{session:{user:{id:string}}};error:null}>(
    resolve=>{finishExchange=resolve;},
  ));
  const getUser=vi.fn().mockResolvedValue({data:{user:{id:"user-from-google"}},error:null});
  const client={auth:{
    exchangeCodeForSession,getUser,
    onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{unsubscribe:vi.fn()}}}),
  }};
  const auth=createThiepnAccountAuthProvider({client:client as never});
  return {
    auth,local,session,location,replaceState,getUser,exchangeCodeForSession,
    finish:()=>finishExchange?.({data:{session:{user:{id:"user-from-google"}}},error:null}),
  };
}

describe("J16D actual Google -> Japanese callback behavior",()=>{
  it("exchanges a callback only once across simultaneous session refreshes",async()=>{
    const flow=setupCallback(true);
    const first=flow.auth.refresh();
    // History has already replaced /auth/callback/ by the first refresh.
    expect(flow.location.pathname).toBe("/japanese/");
    const second=flow.auth.refresh();
    expect(flow.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    flow.finish();
    const [one,two]=await Promise.all([first,second]);
    expect(one).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(two).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(flow.getUser).toHaveBeenCalledTimes(1);
    expect(flow.local.has(JAPANESE_LOGIN_STORAGE_KEY)).toBe(false);
    expect(flow.replaceState).toHaveBeenCalledWith(null,"","/japanese/");
    // Reloading the home page can recover the verified session.
    expect(await flow.auth.refresh()).toMatchObject({status:"authenticated",accountId:"user-from-google"});
  });

  it("uses Supabase's PKCE verifier when PWA tab-login marker was lost",async()=>{
    const flow=setupCallback(false);
    const login=flow.auth.refresh();
    flow.finish();
    expect(await login).toMatchObject({status:"authenticated",accountId:"user-from-google"});
    expect(flow.exchangeCodeForSession).toHaveBeenCalledOnce();
  });

  it("rejects an unrecognized callback without attempting an exchange",async()=>{
    const flow=setupCallback(false);
    flow.location.search="?error=access_denied";
    const result=await flow.auth.refresh();
    expect(result).toMatchObject({status:"expired",accountId:null});
    expect(flow.exchangeCodeForSession).not.toHaveBeenCalled();
  });
});
