export class SessionPart {
  id = 0;
  title = '';
  order = 0;
  partType = '';
  time = 0;
  timeBased = true;
  count = 0;

  getTitle(): string {
    return this.title;
  }

  getTime(): number {
    return this.timeBased ? this.time : this.calculateTimeByCount();
  }

  protected calculateTimeByCount(): number {
    return this.count;
  }
}
