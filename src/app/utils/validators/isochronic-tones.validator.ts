import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {HeartBeatValidator} from './heart-beat.validator';
import {SessionPart} from '../../models/session-part.model';

export class IsochronicTonesValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_POLYPHONIC_BB;
    this.nextValidator = new HeartBeatValidator();
  }

  override normalizeFields(part: SessionPart) {
    part.value1 = this.setValue(part.value1, 50, 1000);  // base
    part.value2 = this.setValue(part.value1, 1, 10);     // pulse
  }
}
