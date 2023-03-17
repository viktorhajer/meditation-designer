import {Component} from '@angular/core';
import {SessionRepository, STATE_STOPPED} from '../services/session-repository.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent {

  constructor(public readonly repository: SessionRepository) {
  }

  isSelected(index: number): boolean {
    return this.repository.index === index;
  }

  getState(index: number): number {
    return this.isSelected(index) ? this.repository.state : STATE_STOPPED;
  }
}
