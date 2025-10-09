import {SessionComponent} from '../models/session-component.model';
import {TYPE_MANTRA, TYPE_METRONOME} from '../models/session.constant';

export class SessionUtil {

  static getSessionPartTime(part: SessionComponent): number {
    if (part.timeBased) {
      return part.time;
    }
    if (part.partType === TYPE_METRONOME || (part.partType === TYPE_MANTRA && part.value1 <= 1)) {
      return part.count * (part.sliceLength + part.sliceSpace);
    } else if (part.partType === TYPE_MANTRA && part.value1 > 1) {
      const groupNumber = Math.floor(part.count / part.value1);
      return part.count * (part.sliceLength + part.sliceSpace) + groupNumber * part.value2;
    }
    return part.count;
  }
}