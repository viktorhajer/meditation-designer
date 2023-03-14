import {SessionPart} from './session-part.model';

export class SessionPartMetronome extends SessionPart {
  tickLength = 1; //mp
  tickSample = '1'; // e.g. 1101

  constructor() {
    super();
    this.partType = 'metronome';
    this.title = 'Metronome';
  }

  override calculateTimeByCount(): number {
    return this.count * this.tickLength;
  }

  override getInfo(): string {
    return this.tickLength + 'mp' + (this.tickSample !== '1' ? ': ' + this.tickSample : '');
  }
}
