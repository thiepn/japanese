import {expect,test} from "@playwright/test";

test("leaving speaking practice aborts recognition and disconnects late callbacks",async({page})=>{
  await page.addInitScript(()=>{
    const state={aborted:0,instance:null as any};
    (window as any).__speechTest=state;
    (window as any).SpeechRecognition=class {
      lang="";interimResults=false;continuous=false;
      onresult:any=null;onerror:any=null;onend:any=null;
      start(){state.instance=this;}
      abort(){state.aborted+=1;}
    };
  });
  await page.goto("./");
  await page.getByRole("button",{name:"Learn",exact:true}).click();
  await page.locator(".j4-practice__quick button").filter({hasText:"Speaking"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.locator(".j5-speak-button").click();
  await expect(page.getByText("Listening…",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Exit",exact:true}).click();
  const cleanup=await page.evaluate(()=>{
    const state=(window as any).__speechTest;
    return {aborted:state.aborted,result:state.instance?.onresult,error:state.instance?.onerror,end:state.instance?.onend};
  });
  expect(cleanup).toEqual({aborted:1,result:null,error:null,end:null});
  await expect(page.getByRole("navigation",{name:"Primary"})).toBeVisible();
});
