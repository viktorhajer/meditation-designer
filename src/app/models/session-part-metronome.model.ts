import {SessionPart} from './session-part.model';

export class SessionPartMetronome extends SessionPart {
  tickLength = 1; //mp
  tickSample = '1'; // e.g. 1101
  
  constructor() {
    super();
    this.partType = 'metronome';
    this.title = 'Metronome';
  }
  
  override getTitle(): string {
    return `${this.title} (${this.tickSample}/${this.tickLength})` ;
  }
}
