import {SessionComponent} from '../models/session-component.model';
import {TYPE_MANTRA, TYPE_METRONOME} from '../models/session.constant';

export class SessionUtil {

  static getSessionComponentTime(component: SessionComponent): number {
    if (component.timeBased) {
      return component.time;
    }
    if (component.type === TYPE_METRONOME || (component.type === TYPE_MANTRA && component.value1 <= 1)) {
      return component.count * (component.sliceLength + component.sliceSpace);
    } else if (component.type === TYPE_MANTRA && component.value1 > 1) {
      const groupNumber = Math.floor(component.count / component.value1);
      return component.count * (component.sliceLength + component.sliceSpace) + groupNumber * component.value2;
    }
    return component.count;
  }
}
