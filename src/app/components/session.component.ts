import {Component} from '@angular/core';
import {SessionRepository} from '../services/session-repository.service';
import {SessionService, STATE_STOPPED} from '../services/session.service';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss'],
    standalone: false
})
export class SessionComponent {

  constructor(public readonly repository: SessionRepository,
              public readonly sessionService: SessionService) {
  }

  isSelected(index: number): boolean {
    return this.repository.index === index;
  }

  getState(index: number): number {
    return this.isSelected(index) ? this.sessionService.state : STATE_STOPPED;
  }
}
