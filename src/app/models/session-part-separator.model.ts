import {SessionPart} from './session-part.model';

export class SessionPartSeparator extends SessionPart {
  constructor() {
    super();
    this.partType = 'separator';
    this.title = 'Separator';
    this.time = 2;
  }
}
