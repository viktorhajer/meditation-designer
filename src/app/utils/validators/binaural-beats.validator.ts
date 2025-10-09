import {AbstractSessionValidator} from './abstract-session.validator';
import {
  MAX_BASE_FREQUENCY,
  MAX_BRAINWAVE_FREQUENCY, MIN_BASE_FREQUENCY,
  MIN_BRAINWAVE_FREQUENCY,
  TYPE_BINAURAL_BEATS
} from '../../models/session.constant';
import {IsochronicTonesValidator} from './isochronic-tones.validator';
import {SessionComponent} from '../../models/session-component.model';

export class BinauralBeatsValidator extends AbstractSessionValidator {

  constructor() {
    super();
    this.type = TYPE_BINAURAL_BEATS;
    this.nextValidator = new IsochronicTonesValidator();
  }

  override normalizeFields(component: SessionComponent) {
    component.value1 = this.setValue(component.value1, MIN_BASE_FREQUENCY, MAX_BASE_FREQUENCY);  // base
    component.value2 = this.setValue(component.value2, MIN_BRAINWAVE_FREQUENCY, MAX_BRAINWAVE_FREQUENCY);     // diff1
    component.value3 = this.setValue(component.value3, MIN_BRAINWAVE_FREQUENCY, MAX_BRAINWAVE_FREQUENCY);     // diff2
  }
}
