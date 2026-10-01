import type { SyncOperation, SyncPushRequest, SyncPullResponse } from "@thiepn/sync-protocol";

export interface SyncChange { cursor: number; deviceId: string; operation: SyncOperation; }

export class InMemorySyncStore {
  private cursor=0;
  private readonly applied=new Set<string>();
  private readonly changes:SyncChange[]=[];

  push(request:SyncPushRequest):{accepted:number;duplicates:number} {
    let accepted=0; let duplicates=0;
    for (const operation of request.operations) {
      if (this.applied.has(operation.operationId)) { duplicates+=1; continue; }
      this.applied.add(operation.operationId);
      this.cursor+=1;
      this.changes.push({cursor:this.cursor,deviceId:request.deviceId,operation});
      accepted+=1;
    }
    return {accepted,duplicates};
  }

  pull(cursor:string|null):SyncPullResponse<SyncChange> {
    const after=cursor ? Number(cursor) : 0;
    if (!Number.isFinite(after) || after<0) throw new Error("INVALID_CURSOR");
    const changes=this.changes.filter((change)=>change.cursor>after);
    return {changes,nextCursor:String(this.cursor)};
  }
}
