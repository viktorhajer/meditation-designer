import {AbstractSessionValidator} from './abstract-session.validator';
import {TYPE_HEARTBEAT} from '../../models/session.constant';
import {PolyphonicBinauralValidator} from './polyphonic-binaural.validator';
import {SessionComponent} from '../../models/session-component.model';

export class HeartBeatValidator extends AbstractSessionValidator {

  constructor() {
    super();
    this.type = TYPE_HEARTBEAT;
    this.nextValidator = new PolyphonicBinauralValidator();
  }

  override normalizeFields(component: SessionComponent) {
    component.value1 = this.setValue(component.value1, 30, 150);  // heart beat
  }
}
