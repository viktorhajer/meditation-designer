import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {TYPE_HEARTBEAT, TYPE_ISOCHRONIC_TONES, TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {PolyphonicBinauralValidator} from './polyphonic-binaural.validator';
import {SessionComponent} from '../../models/session-component.model';

export class HeartBeatValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_HEARTBEAT;
    this.nextValidator = new PolyphonicBinauralValidator();
  }

  override normalizeFields(part: SessionComponent) {
    part.value1 = this.setValue(part.value1, 30, 150);  // heart beat
  }
}
