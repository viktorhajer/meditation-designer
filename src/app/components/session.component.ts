import {Component} from '@angular/core';
import {SessionRepository} from '../services/session-repository.service';
import {Session} from '../models/session.model';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent {

  session: Session;
  state =  0;
  index = 0;

  constructor(private readonly repository: SessionRepository) {
    this.session = this.repository.getSession();
  }

  handle(index: number) {
    if (this.index === index) {
      this.state = this.state === 1 ? 2 : 1;
    } else {
      this.index = index;
    }
  }

  reset() {
    this.index = 0;
    this.state = 0;
  }

  next() {
    this.index = this.index < (this.session.parts.length - 1) ? (this.index + 1) : 0
    if (this.index === 0) {
      this.state = 0;
    }
  }

  remove(index: number) {
    if (index >= 0 && index < this.session.parts.length) {
      this.session.parts.splice(index, 1);
    }
  }

  getState(index: number): number {
    return index === this.index ? this.state : 0;
  }
}
