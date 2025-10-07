import {SessionPart} from '../../models/session-part.model';

export class AbstractSessionPartValidator {

  type: string = '';
  nextValidator: AbstractSessionPartValidator | undefined = undefined;

  constructor() {
  }

  validate(part: SessionPart): boolean {
    if (this.type === part.partType) {
      this.normalizeFields(part);
      return this.validateFields(part);
    } else {
      if (this.nextValidator) {
        return this.nextValidator.validate(part);
      }
      return true;
    }
  }

  protected normalizeFields(part: SessionPart) {
  }

  protected validateFields(part: SessionPart): boolean {
    return true;
  }

  protected setValue(value: number, min: number, max: number): number {
    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    }
    return value;
  }
}
