import {AbstractSessionValidator} from './abstract-session.validator';
import {BinauralBeatsValidator} from './binaural-beats.validator';

export class SessionValidator extends AbstractSessionValidator {

  constructor() {
    super();
    this.type = '';
    this.nextValidator = new BinauralBeatsValidator();
  }
}
