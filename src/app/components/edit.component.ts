import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  DEFAULT_MANTRA_COUNT,
  DEFAULT_MANTRA_TIME,
  DEFAULT_METRONOME,
  DEFAULT_SILENCE, MANTRAS, SEPARATORS,
  SessionPart,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_SEPARATOR,
  TYPE_SILENCE, TYPES
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

  partTypes = TYPES;
  separatorTypes = SEPARATORS;
  mantraTypes = MANTRAS;

  part: SessionPart = new SessionPart();

  constructor(private readonly repository: SessionRepository) {
  }

  ngOnChanges() {
    if (this.active) {
      if (this.createNew) {
        this.part = new SessionPart();
        this.part.partType = TYPE_SEPARATOR;
        this.part.timeBased = true;
        this.part.time = SEPARATORS[0].time;
        this.part.fileName = SEPARATORS[0].fileName;
        this.part.separatorName = SEPARATORS[0].name;
      } else {
        this.part = Object.assign(new SessionPart(), this.repository.getSelectedPart());
      }
    }
  }

  typeChanged() {
    this.part.sliceSpace = 0;
    if (this.part.partType === TYPE_SEPARATOR) {
      this.part.timeBased = true;
      this.part.time = SEPARATORS[0].time;
      this.part.fileName = SEPARATORS[0].fileName;
      this.part.separatorName = SEPARATORS[0].name;
    } else if (this.part.partType === TYPE_SILENCE) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
    } else if (this.part.partType === TYPE_MANTRA) {
      this.part.timeBased = false;
      this.part.time = DEFAULT_MANTRA_TIME;
      this.part.count = DEFAULT_MANTRA_COUNT;
      this.part.sliceLength = MANTRAS[0].time;
      this.part.sliceSpace = 2;
      this.part.mantraGroup = 1;
      this.part.fileName = MANTRAS[0].fileName;
      this.part.mantraName = MANTRAS[0].name;
    } else if (this.part.partType === TYPE_METRONOME) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_METRONOME;
      this.part.sliceLength = 1;
    }
  }

  separatorTypeChanged() {
    const separator = SEPARATORS.find(s => s.name === this.part.separatorName);
    if (separator) {
      this.part.separatorName = separator.name;
      this.part.time = separator.time;
      this.part.fileName = separator.fileName;
    }
  }

  mantraTypeChanged() {
    const mantra = MANTRAS.find(s => s.name === this.part.mantraName);
    if (mantra) {
      this.part.mantraName = mantra.name;
      this.part.sliceLength = mantra.time;
      this.part.fileName = mantra.fileName;
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
      originalPart.sliceLength = this.part.sliceLength;
      originalPart.sliceSpace = this.part.sliceSpace;
      originalPart.mantraName = this.part.mantraName;
      originalPart.mantraGroup = this.part.mantraGroup;
      originalPart.mantraGroupSpace = this.part.mantraGroup <= 1 ? 0 : this.part.mantraGroupSpace;
      originalPart.separatorName = this.part.separatorName;
      originalPart.fileName = this.part.fileName;
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
