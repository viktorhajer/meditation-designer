import {SessionPart} from './session-part.model';

export class SessionPartMantra extends SessionPart {
  sound = '';
  soundTime = 0;
  group = '1';

  constructor() {
    super();
    this.partType = 'mantra';
    this.title = 'Mantra';
    this.timeBased = false;
    this.count = 108;
  }

  override getTitle(): string {
    if (this.timeBased) {
      return super.getTitle();
    }
    return `${this.title} (${this.count})`;
  }
}
