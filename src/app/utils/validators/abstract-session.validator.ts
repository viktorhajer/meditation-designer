import {SessionComponent} from '../../models/session-component.model';

export class AbstractSessionValidator {

  type: string = '';
  nextValidator: AbstractSessionValidator | undefined = undefined;

  constructor() {
  }

  validate(component: SessionComponent): boolean {
    if (this.type === component.partType) {
      this.normalizeFields(component);
      return this.validateFields(component);
    } else {
      if (this.nextValidator) {
        return this.nextValidator.validate(component);
      }
      return true;
    }
  }

  protected normalizeFields(component: SessionComponent) {
  }

  protected validateFields(component: SessionComponent): boolean {
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
