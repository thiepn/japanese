/**
 * A reader may close or change while an audio provider is resolving a request.
 * A resolved Promise from stop() does not mean listening was completed.
 */
export class ReaderPlaybackFence {
  private epoch=0;
  begin():number { return ++this.epoch; }
  invalidate():void { this.epoch++; }
  accepts(epoch:number):boolean { return this.epoch===epoch; }
}
