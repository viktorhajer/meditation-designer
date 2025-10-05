import {SessionPart} from './session-part.model';

export class Session {
  id = 0;
  parts: SessionPart[] = [];

  getTime(): number {
    let sum = 0;
    this.parts.forEach(p => sum += p.getTime());
    return sum;
  }
}
