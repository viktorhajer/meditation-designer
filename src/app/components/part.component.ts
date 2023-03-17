import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';
import {SessionRepository, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from '../services/session-repository.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent {
  @Input() part: SessionPart = new SessionPart();
  @Input() selected = false;
  @Input() index = 0;
  @Input() state = STATE_STOPPED;
  @Output() select = new EventEmitter();
  @Output() finish = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();

  constructor(public readonly repository: SessionRepository) {
  }

  isRunning(): boolean {
    return this.state === STATE_RUNNING;
  }

  isPaused(): boolean {
    return this.state === STATE_PAUSED;
  }

  clock(timeRemains: number) {
    this.repository.timeRemains = timeRemains;
  }
}
