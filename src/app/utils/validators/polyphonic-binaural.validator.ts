import {AbstractSessionValidator} from './abstract-session.validator';
import {TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {SessionComponent} from '../../models/session-component.model';

export class PolyphonicBinauralValidator extends AbstractSessionValidator {

  constructor() {
    super();
    this.type = TYPE_POLYPHONIC_BB;
  }

  override normalizeFields(component: SessionComponent) {
    component.valueStr = component.valueStr.replace(/\s+/g, ''); // description
  }
}
