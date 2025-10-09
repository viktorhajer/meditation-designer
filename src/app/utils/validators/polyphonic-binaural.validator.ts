import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {TYPE_POLYPHONIC_BB} from '../../models/session.constant';
import {SessionComponent} from '../../models/session-component.model';

export class PolyphonicBinauralValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = TYPE_POLYPHONIC_BB;
  }

  override normalizeFields(part: SessionComponent) {
    part.valueStr = part.valueStr.replace(/\s+/g, ''); // description
  }
}
