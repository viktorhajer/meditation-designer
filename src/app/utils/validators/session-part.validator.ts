import {AbstractSessionPartValidator} from './abstract-session-part.validator';
import {BinauralBeatsValidator} from './binaural-beats.validator';

export class SessionPartValidator extends AbstractSessionPartValidator {

  constructor() {
    super();
    this.type = '';
    this.nextValidator = new BinauralBeatsValidator();
  }
}
