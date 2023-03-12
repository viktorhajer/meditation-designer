import {SessionPart} from './session-part.model';

export class Session {
  id: number = 0;
  title: string = '';
  description: string = '';
  parts: SessionPart[] = [];
  space: number = 0;
  
  getTime(): number {
    let sum = 0;
    this.parts.forEach(p => sum += p.getTime());
    return sum;
  }
}
