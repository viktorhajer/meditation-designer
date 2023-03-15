import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {SessionPart} from '../models/session-part.model';
import {SessionRepository} from '../services/session-repository.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnChanges {
  @Input() active = false;
  @Input() createNew = true;
  @Output() update = new EventEmitter();
  
  part = new SessionPart();
  
  constructor(private readonly repository: SessionRepository) {
  }
  
  ngOnChanges() {
    if (this.active) {
      if (this.createNew) {
        this.part = new SessionPart();
      } else {
        this.part = this.repository.getSelectedPart();
      }
    }
  }
  
  close() {
    this.update.emit();
  }
}
