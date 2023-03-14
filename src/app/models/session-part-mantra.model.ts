import {SessionPart} from './session-part.model';

export class SessionPartMantra extends SessionPart {
  soundTitle = '';
  soundFile = '';
  soundTime = 0;
  group = '1';

  constructor() {
    super();
    this.partType = 'mantra';
    this.title = 'Mantra';
    this.timeBased = false;
    this.count = 108;
  }

  override getInfo(): string {
    return this.soundTitle + ' ' + super.getInfo();
  }
}
