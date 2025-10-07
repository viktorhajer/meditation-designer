import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL,
  ADVANCED_BB_TYPES,
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_DIFF_FREQ_THETA,
  DEFAULT_HEAT_BEAT,
  DEFAULT_LEFT_FREQ,
  DEFAULT_MANTRA_COUNT,
  DEFAULT_MANTRA_TIME,
  DEFAULT_METRONOME,
  DEFAULT_POLYPHONIC_BB_DESCRIPTION,
  DEFAULT_SILENCE,
  GUIDED_SESSIONS,
  INTERPOLATION_EASE_OUT,
  INTERPOLATIONS,
  MANTRAS,
  SEPARATORS,
  TYPE_BINAURAL_BEATS,
  TYPE_GUIDED_SESSION,
  TYPE_HEARTBEAT,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_POLYPHONIC_BB,
  TYPE_SEPARATOR,
  TYPE_SILENCE,
  TYPES
} from '../models/session.constant';
import {SessionRepository} from '../services/session-repository.service';
import {LogService} from '../services/log.service';
import {SessionPart} from '../models/session-part.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false
})
export class EditComponent implements OnChanges {
  @Input() active = false;
  @Input() createNew = true;
  @Output() close = new EventEmitter();

  partTypes = TYPES;
  separatorTypes = SEPARATORS;
  mantraTypes = MANTRAS;
  guidedSessions = GUIDED_SESSIONS;
  interpolations = INTERPOLATIONS;
  advancedBBTypes = ADVANCED_BB_TYPES;

  part: SessionPart = new SessionPart();

  constructor(private readonly logger: LogService,
              private readonly repository: SessionRepository) {
  }

  ngOnChanges() {
    if (this.active) {
      if (this.createNew) {
        this.part = new SessionPart();
        this.part.partType = TYPE_SEPARATOR;
        this.part.timeBased = true;
        this.part.time = SEPARATORS[0].time;
        this.part.fileName = SEPARATORS[0].fileName;
        this.part.name = SEPARATORS[0].name;
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
      this.part.name = SEPARATORS[0].name;
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
      this.part.name = MANTRAS[0].name;
    } else if (this.part.partType === TYPE_METRONOME) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_METRONOME;
      this.part.sliceLength = 1;
    } else if (this.part.partType === TYPE_GUIDED_SESSION) {
      this.part.timeBased = true;
      this.part.time = GUIDED_SESSIONS[0].time;
      this.part.fileName = GUIDED_SESSIONS[0].fileName;
      this.part.name = GUIDED_SESSIONS[0].name;
    } else if (this.part.partType === TYPE_BINAURAL_BEATS) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
      this.part.value1 = DEFAULT_LEFT_FREQ;
      this.part.value2 = DEFAULT_DIFF_FREQ_BETA;
      this.part.value3 = DEFAULT_DIFF_FREQ_THETA;
      this.part.name = INTERPOLATION_EASE_OUT;
      this.part.valueStr2 = ADVANCED_BB_BINEURAL;
    } else if (this.part.partType === TYPE_POLYPHONIC_BB) {
      this.part.timeBased = true;
      this.part.valueStr = DEFAULT_POLYPHONIC_BB_DESCRIPTION;
      this.part.time = this.calculateTimeForPBB(this.part.valueStr);
    } else if (this.part.partType === TYPE_HEARTBEAT) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
      this.part.value1 = DEFAULT_HEAT_BEAT;
      this.part.sliceLength = 60 / DEFAULT_HEAT_BEAT;
    }
  }

  separatorTypeChanged() {
    const separator = SEPARATORS.find(s => s.name === this.part.name);
    if (separator) {
      this.part.name = separator.name;
      this.part.time = separator.time;
      this.part.fileName = separator.fileName;
    }
  }

  mantraTypeChanged() {
    const mantra = MANTRAS.find(s => s.name === this.part.name);
    if (mantra) {
      this.part.name = mantra.name;
      this.part.sliceLength = mantra.time;
      this.part.fileName = mantra.fileName;
    }
  }

  guidedSessionTypeChanged() {
    const session = GUIDED_SESSIONS.find(s => s.name === this.part.name);
    if (session) {
      this.part.name = session.name;
      this.part.time = session.time;
      this.part.fileName = session.fileName;
    }
  }

  isType(partType = 'separator'): boolean {
    return this.part.partType === partType;
  }

  save() {
    this.normalize();
    this.postProcess();
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
      originalPart.name = this.part.name;
      originalPart.mantraGroup = this.part.mantraGroup;
      originalPart.mantraGroupSpace = this.part.mantraGroup <= 1 ? 0 : this.part.mantraGroupSpace;
      originalPart.name = this.part.name;
      originalPart.fileName = this.part.fileName;
      originalPart.value1 = this.part.value1;
      originalPart.value2 = this.part.value2;
      originalPart.value3 = this.part.value3;
      originalPart.valueStr = this.part.valueStr;
      originalPart.valueStr2 = this.part.valueStr2;
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

  private postProcess() {
    if (this.part.partType === TYPE_HEARTBEAT) {
      this.part.sliceLength = 60 / this.part.value1;
      this.part.sliceSpace = 0;
    } else if (this.part.partType === TYPE_POLYPHONIC_BB) {
      this.part.time = this.calculateTimeForPBB(this.part.valueStr);
    }
  }

  private normalize() {
    // TODO
    if (this.part.partType === TYPE_POLYPHONIC_BB) {
      this.part.valueStr = this.part.valueStr.replace(/\s+/g, '');
    }
    if (this.part.partType === TYPE_HEARTBEAT) {
      if (this.part.value1 > 150) {
        this.part.value1 = 150;
      }
      if (this.part.value1 < 30) {
        this.part.value1 = 30;
      }
    }
    if (this.part.partType === TYPE_BINAURAL_BEATS) {
      if (this.part.value1 > 1000) {
        this.part.value1 = 1000;
      }
      if (this.part.value1 < 50) {
        this.part.value1 = 50;
      }
      if (this.part.value2 > 30) {
        this.part.value2 = 30;
      }
      if (this.part.value2 < 1) {
        this.part.value2 = 1;
      }
      if (this.part.value3 > 30) {
        this.part.value3 = 30;
      }
      if (this.part.value3 < 1) {
        this.part.value3 = 1;
      }
    }
  }

  calculateTimeForPBB(description: string): number {
    let totalTime = 0;
    const sessions = description.split(',');
    sessions.forEach(session => {
      const timeInSeconds = Number(session.split('[')[0]);
      totalTime += timeInSeconds;
    });
    this.logger.info('Calculated time for PBB: ' + totalTime + ' secs');
    return totalTime;
  }
}
