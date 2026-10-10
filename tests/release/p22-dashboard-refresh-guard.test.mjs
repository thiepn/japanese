import {describe,it,expect} from "vitest";
import {DashboardRefreshGuard} from "../../apps/web/src/study/dashboardRefreshGuard";

function deferred(){
  let resolve;
  let reject;
  const promise=new Promise((ok,fail)=>{resolve=ok;reject=fail;});
  return {promise,resolve,reject};
}

describe("account-scoped Japanese dashboard refresh safety",()=>{
  it("rejects old guest data after guest -> connected account -> guest",async()=>{
    const guard=new DashboardRefreshGuard();
    let owner="guest";
    let rendered="empty";
    const first=deferred();
    const pending=guard.run(owner,()=>owner,()=>first.promise,(value)=>{rendered=value;});
    owner="account-A";guard.invalidate();
    owner="guest";guard.invalidate();
    first.resolve("stale guest summary");
    expect(await pending).toBe(false);
    expect(rendered).toBe("empty");
    expect(await guard.run(owner,()=>owner,async()=>"new guest summary",(v)=>{rendered=v;})).toBe(true);
    expect(rendered).toBe("new guest summary");
  });

  it("keeps newest completed dashboard after an earlier same-account response arrives",async()=>{
    const guard=new DashboardRefreshGuard();
    const owner="account-A";
    let rendered="initial";
    const older=deferred();
    const pending=guard.run(owner,()=>owner,()=>older.promise,(v)=>{rendered=v;});
    expect(await guard.run(owner,()=>owner,async()=>"updated",(v)=>{rendered=v;})).toBe(true);
    older.resolve("old count");
    expect(await pending).toBe(false);
    expect(rendered).toBe("updated");
  });

  it("rejects stale account data even if no explicit invalidation occurred",async()=>{
    const guard=new DashboardRefreshGuard();
    let owner="account-A";
    let applied=false;
    const query=deferred();
    const pending=guard.run(owner,()=>owner,()=>query.promise,()=>{applied=true;});
    owner="account-B";
    query.resolve("A data");
    expect(await pending).toBe(false);
    expect(applied).toBe(false);
  });

  it("fails closed on unavailable storage but permits the next valid refresh",async()=>{
    const guard=new DashboardRefreshGuard();
    let count=0;
    expect(await guard.run("guest",()=>"guest",async()=>{throw Error("IDB unavailable");},()=>{count++;})).toBe(false);
    expect(count).toBe(0);
    expect(await guard.run("guest",()=>"guest",async()=>1,()=>{count++;})).toBe(true);
    expect(count).toBe(1);
  });
});
