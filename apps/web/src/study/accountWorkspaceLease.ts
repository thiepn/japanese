import type { GuestWorkspaceClaimResult } from "@thiepn/local-db";

export type WorkspaceAuth = Readonly<{status:string;accountId:string|null}>;
export type WorkspaceLease = Readonly<{epoch:number;status:string;accountId:string|null}>;

/**
 * The auth subscription and explicit Connect button share this lease.
 * Epochs reject stale responses even for A -> B -> A, and a canonical auth
 * check prevents an old React closure from authorizing a new local claim.
 */
export class AccountWorkspaceLease {
  private epoch=0;
  private observed:WorkspaceAuth={status:"anonymous",accountId:null};

  observe(auth:WorkspaceAuth):WorkspaceLease {
    this.observed={status:auth.status,accountId:auth.accountId};
    return {epoch:++this.epoch,...this.observed};
  }

  invalidate():void {this.epoch++;}

  capture(auth:WorkspaceAuth):WorkspaceLease|null {
    if(auth.status!=="authenticated"||!auth.accountId||!this.matchesAuth(auth))return null;
    return {epoch:this.epoch,...this.observed};
  }

  matchesAuth(auth:WorkspaceAuth):boolean {
    return this.observed.status===auth.status&&this.observed.accountId===auth.accountId;
  }

  isCurrent(ticket:WorkspaceLease):boolean {
    return this.epoch===ticket.epoch&&this.matchesAuth(ticket);
  }

  isAnonymous():boolean {return this.observed.status!=="authenticated";}

  async verify(ticket:WorkspaceLease,readAuth:()=>Promise<WorkspaceAuth>):Promise<boolean> {
    if(!this.isCurrent(ticket))return false;
    const live=await readAuth();
    return this.isCurrent(ticket)&&live.status===ticket.status&&live.accountId===ticket.accountId;
  }
}

export type ConnectedClaim =
  | Readonly<{connected:false}>
  | Readonly<{connected:true;claimResult:GuestWorkspaceClaimResult}>;

/**
 * No local claim starts after a revoked lease. The storage layer also checks
 * this lease while reading/copying, so queued claims cannot attach a prior
 * owner after sign-out. A failed/stale response is never published to React.
 */
export async function attachWorkspaceWithLease(
  lease:AccountWorkspaceLease,
  ticket:WorkspaceLease,
  actions:{
    connect:()=>Promise<boolean>;
    readAuth:()=>Promise<WorkspaceAuth>;
    claim:(allowed:()=>boolean)=>Promise<GuestWorkspaceClaimResult>;
  },
):Promise<ConnectedClaim|null> {
  if(!lease.isCurrent(ticket)||ticket.status!=="authenticated"||!ticket.accountId)return null;
  const connected=await actions.connect();
  if(!(await lease.verify(ticket,actions.readAuth)))return null;
  if(!connected)return {connected:false};
  const claimResult=await actions.claim(()=>lease.isCurrent(ticket));
  return (await lease.verify(ticket,actions.readAuth))?{connected:true,claimResult}:null;
}
