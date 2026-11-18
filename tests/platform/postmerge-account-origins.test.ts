import {afterEach,describe,expect,it,vi} from "vitest";
import {
  createThiepnAccountAuthProvider, JAPANESE_CALLBACK_URL,
  JAPANESE_CONNECT_INTENT_KEY, JAPANESE_LOGIN_STORAGE_KEY,
  THIEPN_ACCOUNT_SUPABASE_URL,
} from "../../packages/auth/src/index";

function fakeStore(){
  const data=new Map<string,string>();
  return {
    data,
    getItem:(key:string)=>data.get(key)??null,
    setItem:(key:string,val:string)=>{data.set(key,val);},
    removeItem:(key:string)=>{data.delete(key);},
  };
}

function fixture(origin:string,pathname:string,search=""){
  const local=fakeStore(),session=fakeStore();
  const assign=vi.fn();
  const replaceState=vi.fn();
  const location={origin,pathname,search,hash:"",assign};
  vi.stubGlobal("localStorage",local);
  vi.stubGlobal("sessionStorage",session);
  vi.stubGlobal("window",{location,history:{replaceState}});

  const authorization=new URL("/auth/v1/authorize",THIEPN_ACCOUNT_SUPABASE_URL);
  authorization.searchParams.set("provider","google");
  authorization.searchParams.set("redirect_to",JAPANESE_CALLBACK_URL);
  authorization.searchParams.set("code_challenge","a".repeat(43));
  authorization.searchParams.set("code_challenge_method","s256");
  authorization.searchParams.set("prompt","select_account");
  const signInWithOAuth=vi.fn().mockResolvedValue({data:{url:authorization.href},error:null});
  const exchangeCodeForSession=vi.fn();
  const getUser=vi.fn().mockResolvedValue({data:{user:null},error:null});
  const client={auth:{
    signInWithOAuth,exchangeCodeForSession,getUser,
    onAuthStateChange:vi.fn().mockReturnValue({data:{subscription:{unsubscribe:vi.fn()}}}),
  }};
  const provider=createThiepnAccountAuthProvider({client:client as never});
  return {provider,local,session,assign,replaceState,signInWithOAuth,exchangeCodeForSession,getUser};
}

afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

describe("post-merge OAuth callback origin guard (two public origins)",()=>{
  it.each([
    ["https://japanese.thiepn.dev","/"],
    ["https://fix-kana-embedded-shortcuts.japanese-c36.pages.dev","/"],
  ])("refuses to start wrong-origin PKCE without touching guest data: %s",async(origin,path)=>{
    const f=fixture(origin,path);
    f.local.data.set("guest-study-data","preserve");
    await expect(f.provider.signIn()).rejects.toThrow("JAPANESE_OAUTH_CALLBACK_ORIGIN_MISMATCH");
    expect(f.signInWithOAuth).not.toHaveBeenCalled();
    expect(f.assign).not.toHaveBeenCalled();
    expect(f.local.data.get(JAPANESE_CONNECT_INTENT_KEY)).toBeUndefined();
    expect(f.local.data.get(JAPANESE_LOGIN_STORAGE_KEY)).toBeUndefined();
    expect(f.session.data.get(JAPANESE_CONNECT_INTENT_KEY)).toBeUndefined();
    expect(f.local.data.get("guest-study-data")).toBe("preserve");
  });

  it("preserves the existing canonical /japanese/ Account sign-in flow",async()=>{
    const f=fixture("https://thiepn.dev","/japanese/");
    await expect(f.provider.signIn()).resolves.toBeUndefined();
    expect(f.signInWithOAuth).toHaveBeenCalledOnce();
    expect(f.assign).toHaveBeenCalledOnce();
    expect(new URL(f.assign.mock.calls[0][0]).origin).toBe("https://account.thiepn.dev");
    expect(f.local.data.get(JAPANESE_CONNECT_INTENT_KEY)).toBe("1");
    expect(f.local.data.has(JAPANESE_LOGIN_STORAGE_KEY)).toBe(true);
  });

  it.each([
    ["/","?code=untrusted-callback"],
    ["/auth/callback/","?code=untrusted-callback"],
  ])("scrubs stray OAuth credentials on root deployment: %s",async(path,query)=>{
    const f=fixture("https://japanese.thiepn.dev",path,query);
    f.local.data.set("guest-study-data","preserve");
    await expect(f.provider.refresh()).resolves.toMatchObject({status:"expired",accountId:null});
    expect(f.replaceState).toHaveBeenCalledWith(null,"",path);
    expect(f.exchangeCodeForSession).not.toHaveBeenCalled();
    expect(f.getUser).not.toHaveBeenCalled();
    expect(f.local.data.get("guest-study-data")).toBe("preserve");
  });
});
