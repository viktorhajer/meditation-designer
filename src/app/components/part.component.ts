import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent {
  @Input() part: SessionPart = new SessionPart();
  @Input() index: number = 0;
  @Input() state: number = 0;
  @Output() select = new EventEmitter();
  @Output() finish = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();
}
