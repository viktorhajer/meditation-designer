import {SessionComponent} from '../../models/session-component.model';

export class AbstractSessionPartValidator {

  type: string = '';
  nextValidator: AbstractSessionPartValidator | undefined = undefined;

  constructor() {
  }

  validate(part: SessionComponent): boolean {
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

  protected normalizeFields(part: SessionComponent) {
  }

  protected validateFields(part: SessionComponent): boolean {
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
