import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';
import {SessionRepository} from '../services/session-repository.service';
import {SessionService} from '../services/session.service';
import {STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from '../models/session.constant';

@Component({
    selector: 'app-part',
    templateUrl: './part.component.html',
    styleUrls: ['./part.component.scss'],
    standalone: false
})
export class PartComponent {
  @Input() part: SessionPart = new SessionPart();
  @Input() selected = false;
  @Input() index = 0;
  @Input() state = STATE_STOPPED;
  @Output() select = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();

  constructor(public readonly repository: SessionRepository,
              public readonly service: SessionService) {
  }

  getTime(): number {
    const total = this.selected ? this.service.getTime() : -1;
    return total === -1 ? this.part.getTime() : total;
  }

  isRunning(): boolean {
    return this.state === STATE_RUNNING;
  }

  isPaused(): boolean {
    return this.state === STATE_PAUSED;
  }
}
