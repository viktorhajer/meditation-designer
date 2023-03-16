import {Component} from '@angular/core';
import {SessionRepository} from '../services/session-repository.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent {

  state = 0;

  constructor(public readonly repository: SessionRepository) {
  }

  handle(index: number) {
    if (this.repository.index === index) {
      this.state = this.state === 1 ? 2 : 1;
    } else {
      this.repository.index = index;
      this.state = 2;
    }
  }

  reset() {
    this.repository.index = 0;
    this.state = 0;
  }

  next() {
    this.repository.index = this.repository.index < (this.repository.session.parts.length - 1) ? (this.repository.index + 1) : 0
    if (this.repository.index === 0) {
      this.state = 0;
    }
  }

  getState(index: number): number {
    return index === this.repository.index ? this.state : 0;
  }

  move(index: number, direction = 0) {
    const part1 = this.repository.session.parts[index];
    this.state = this.state === 1 ? 2 : this.state;
    if (direction === 1 && (index + 1) < this.repository.session.parts.length) {
      const part2 = this.repository.session.parts[index + 1];
      this.repository.session.parts[index] = part2;
      this.repository.session.parts[index + 1] = part1;
      this.repository.index = index + 1;
    } else if (direction === 0 && (index - 1) >= 0) {
      const part2 = this.repository.session.parts[index - 1];
      this.repository.session.parts[index] = part2;
      this.repository.session.parts[index - 1] = part1;
      this.repository.index = index - 1;
    }
  }
}
