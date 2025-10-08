import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {
  MAX_BASE_FREQUENCY,
  MAX_BRAINWAVE_FREQUENCY, MIN_BASE_FREQUENCY,
  MIN_BRAINWAVE_FREQUENCY,
  TYPE_BINAURAL_BEATS
} from '../../models/session.constant';
import {IsochronicTonesValidator} from './isochronic-tones.validator';
import {SessionPart} from '../../models/session-part.model';

export class BinauralBeatsValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_BINAURAL_BEATS;
    this.nextValidator = new IsochronicTonesValidator();
  }

  override normalizeFields(part: SessionPart) {
    part.value1 = this.setValue(part.value1, MIN_BASE_FREQUENCY, MAX_BASE_FREQUENCY);  // base
    part.value2 = this.setValue(part.value2, MIN_BRAINWAVE_FREQUENCY, MAX_BRAINWAVE_FREQUENCY);     // diff1
    part.value3 = this.setValue(part.value3, MIN_BRAINWAVE_FREQUENCY, MAX_BRAINWAVE_FREQUENCY);     // diff2
  }
}
