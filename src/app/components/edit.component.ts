import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';
import {SessionRepository} from '../services/session-repository.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  @Input() part: SessionPart = new SessionPart();
  @Input() active = false;
  @Output() update = new EventEmitter();
  
  constructor(private readonly repository: SessionRepository) {
  }
  
  close() {
    this.update.emit();
  }
}
