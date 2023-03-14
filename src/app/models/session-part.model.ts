export class SessionPart {
  id = 0;
  title = '';
  order = 0;
  partType = '';
  time = 0;
  timeBased = true;
  count = 0;

  getTime(): number {
    return this.timeBased ? this.time : this.calculateTimeByCount();
  }

  getInfo(): string {
    return this.timeBased ? '' : this.count + '';
  }

  protected calculateTimeByCount(): number {
    return this.count;
  }
}
