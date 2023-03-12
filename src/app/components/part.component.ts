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
  @Output() selected = new EventEmitter();
}
