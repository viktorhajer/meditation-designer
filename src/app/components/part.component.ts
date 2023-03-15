import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';
import {Session} from '../models/session.model';
import {SessionRepository} from '../services/session-repository.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent {
  @Input() session: Session = new Session();
  @Input() part: SessionPart = new SessionPart();
  @Input() index = 0;
  @Input() state = 0;
  @Output() select = new EventEmitter();
  @Output() finish = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  
  constructor(private readonly repository: SessionRepository) {
  }
  
  clock(timeRemains: number) {
    this.repository.timeRemains = timeRemains;
  }
}
