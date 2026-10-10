/**
 * Prevent an asynchronous study queue from opening after the learner switches
 * workspaces, or after a newer queue request supersedes an older one.
 * This is a per-mounted-app fence, not a persistence or auth system.
 */
export type StudySessionTicket=Readonly<{ownerId:string;request:number}>;

export class StudySessionFence {
  private request=0;

  begin(ownerId:string):StudySessionTicket {
    return {ownerId,request:++this.request};
  }

  invalidate():void {
    this.request+=1;
  }

  accepts(ticket:StudySessionTicket,ownerId:string):boolean {
    return ticket.ownerId===ownerId&&ticket.request===this.request;
  }
}
