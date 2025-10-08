import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {MAX_BASE_FREQUENCY, MIN_BASE_FREQUENCY, TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {HeartBeatValidator} from './heart-beat.validator';
import {SessionPart} from '../../models/session-part.model';

export class IsochronicTonesValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_POLYPHONIC_BB;
    this.nextValidator = new HeartBeatValidator();
  }

  override normalizeFields(part: SessionPart) {
    part.value1 = this.setValue(part.value1, MIN_BASE_FREQUENCY, MAX_BASE_FREQUENCY);  // base
    part.value2 = this.setValue(part.value2, 1, 10);     // pulse
  }
}
