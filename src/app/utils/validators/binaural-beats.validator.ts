import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {TYPE_BINAURAL_BEATS} from '../../models/session.constant';
import {IsochronicTonesValidator} from './isochronic-tones.validator';
import {SessionPart} from '../../models/session-part.model';

export class BinauralBeatsValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_BINAURAL_BEATS;
    this.nextValidator = new IsochronicTonesValidator();
  }

  override normalizeFields(part: SessionPart) {
    part.value1 = this.setValue(part.value1, 50, 1000);  // base
    part.value2 = this.setValue(part.value1, 1, 30);     // diff1
    part.value3 = this.setValue(part.value1, 1, 30);     // diff2
  }
}
