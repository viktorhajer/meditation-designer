import {SessionPart} from './session-part.model';

export class SessionPartSilence extends SessionPart {

  constructor() {
    super();
    this.partType = 'silence';
    this.title = 'Silence';
  }
  
  override getTitle(): string {
    return `${this.title} (${this.time})` ;
  }
}
