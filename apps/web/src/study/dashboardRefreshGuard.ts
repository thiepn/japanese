/**
 * Learner dashboard queries are asynchronous and account-scoped. A query must
 * not repaint the UI after a newer refresh or any intermediate workspace
 * switch, including A -> B -> A when the original account ID matches again.
 */
export class DashboardRefreshGuard {
  private generation=0;

  invalidate():void {this.generation++;}

  async run<T>(
    workspaceId:string,
    currentWorkspaceId:()=>string,
    read:()=>Promise<T>,
    apply:(result:T)=>void,
  ):Promise<boolean> {
    const generation=++this.generation;
    try {
      const result=await read();
      if(generation!==this.generation||currentWorkspaceId()!==workspaceId)return false;
      apply(result);
      return true;
    }catch{
      // Dashboard failure is non-blocking. Never resurrect a stale response.
      return false;
    }
  }
}
