import {AbstractSessionValidator} from './abstract-session.validator';
import {MAX_BASE_FREQUENCY, MIN_BASE_FREQUENCY, TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {HeartBeatValidator} from './heart-beat.validator';
import {SessionComponent} from '../../models/session-component.model';

export class IsochronicTonesValidator extends AbstractSessionValidator {

  constructor() {
    super();
    this.type = TYPE_POLYPHONIC_BB;
    this.nextValidator = new HeartBeatValidator();
  }

  override normalizeFields(component: SessionComponent) {
    component.value1 = this.setValue(component.value1, MIN_BASE_FREQUENCY, MAX_BASE_FREQUENCY);  // base
    component.value2 = this.setValue(component.value2, 1, 10);     // pulse
  }
}
