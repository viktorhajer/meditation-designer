import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  DEFAULT_MANTRA_COUNT,
  DEFAULT_MANTRA_TIME,
  DEFAULT_METRONOME,
  DEFAULT_SEPARATOR,
  DEFAULT_SILENCE,
  SessionPart,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_SEPARATOR,
  TYPE_SILENCE
} from '../models/session-part.model';
import {SessionRepository} from '../services/session-repository.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnChanges {
  @Input() active = false;
  @Input() createNew = true;
  @Output() close = new EventEmitter();

  partTypes = [
    TYPE_SEPARATOR, TYPE_SILENCE, TYPE_MANTRA, TYPE_METRONOME
  ];

  part: SessionPart = new SessionPart();

  constructor(private readonly repository: SessionRepository) {
  }

  ngOnChanges() {
    if (this.active) {
      if (this.createNew) {
        this.part = new SessionPart();
        this.part.partType = TYPE_SEPARATOR;
      } else {
        this.part = Object.assign(new SessionPart(), this.repository.getSelectedPart());
      }
    }
  }

  typeChanged() {
    if (this.part.partType === TYPE_SEPARATOR) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SEPARATOR;
    } else if (this.part.partType === TYPE_SILENCE) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
    } else if (this.part.partType === TYPE_MANTRA) {
      this.part.timeBased = false;
      this.part.count = DEFAULT_MANTRA_COUNT;
      this.part.time = DEFAULT_MANTRA_TIME;
      this.part.mantraGroup = 1;
    } else if (this.part.partType === TYPE_METRONOME) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_METRONOME;
      this.part.tickLength = 1;
      this.part.tickSample = '1';
    }
  }

  isType(partType = 'separator'): boolean {
    return this.part.partType === partType;
  }

  save() {
    if (this.isInvalid()) {
      // TODO error message
      return;
    } else if (this.createNew && this.repository.getSelectedPart() === null) {
      this.repository.session.parts.push(this.part);
    } else if (this.createNew && this.repository.getSelectedPart() !== null) {
      this.repository.session.parts.splice(this.repository.index + 1, 0, this.part);
    } else {
      const originalPart = this.repository.getSelectedPart();
      originalPart.timeBased = this.part.timeBased;
      originalPart.time = this.part.time;
      originalPart.count = this.part.count;
      originalPart.tickLength = this.part.tickLength;
      originalPart.tickSample = this.part.tickSample;
      originalPart.mantraGroup = this.part.mantraGroup;
      originalPart.mantraTitle = this.part.mantraTitle;
      originalPart.mantraFileName = this.part.mantraFileName;
      originalPart.mantraLength = this.part.mantraLength;
      originalPart.mantraSpace = this.part.mantraSpace;
    }
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private isInvalid(): boolean {
    // TODO validation
    return false;
  }
}
