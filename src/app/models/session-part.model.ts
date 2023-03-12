export class SessionPart {
  id: number = 0;
  title: string = '';
  order: number = 0;
  partType: number = '';
  time: number = 0;
  timeBased: boolean = true;
  count: number = 0;
  
  getTime(): number {
    return this.timeBased ? this.time : this.calculateTimeByCount();
  }

  protected calculateTimeByCount(): number {
    return this.count;
  }
}
