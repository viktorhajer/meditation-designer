import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL,
  ADVANCED_BB_TYPES,
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_DIFF_FREQ_ISO,
  DEFAULT_DIFF_FREQ_THETA,
  DEFAULT_FREQ_LOW,
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
  TYPE_ISOCHRONIC_TONES,
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
import {FileInfo} from '../models/file-info';

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
        this.part.time = SEPARATORS[0].length;
        this.part.fileName = SEPARATORS[0].fileName;
        this.part.fileTitle = SEPARATORS[0].title;
      } else {
        this.part = Object.assign(new SessionPart(), this.repository.getSelectedPart());
      }
    }
  }

  typeChanged() {
    this.part.sliceSpace = 0;
    if (this.part.partType === TYPE_SEPARATOR) {
      this.part.timeBased = true;
      this.part.time = SEPARATORS[0].length;
      this.part.fileName = SEPARATORS[0].fileName;
      this.part.fileTitle = SEPARATORS[0].title;
    } else if (this.part.partType === TYPE_SILENCE) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
    } else if (this.part.partType === TYPE_MANTRA) {
      this.part.timeBased = false;
      this.part.time = DEFAULT_MANTRA_TIME;
      this.part.count = DEFAULT_MANTRA_COUNT;
      this.part.sliceLength = MANTRAS[0].length;
      this.part.sliceSpace = 2;
      this.part.value1 = 1;
      this.part.fileName = MANTRAS[0].fileName;
      this.part.fileTitle = MANTRAS[0].title;
    } else if (this.part.partType === TYPE_METRONOME) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_METRONOME;
      this.part.sliceLength = 1;
    } else if (this.part.partType === TYPE_GUIDED_SESSION) {
      this.part.timeBased = true;
      this.part.time = GUIDED_SESSIONS[0].length;
      this.part.fileName = GUIDED_SESSIONS[0].fileName;
      this.part.fileTitle = GUIDED_SESSIONS[0].title;
    } else if (this.part.partType === TYPE_BINAURAL_BEATS) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
      this.part.value1 = DEFAULT_LEFT_FREQ;
      this.part.value2 = DEFAULT_DIFF_FREQ_BETA;
      this.part.value3 = DEFAULT_DIFF_FREQ_THETA;
      this.part.valueStr = INTERPOLATION_EASE_OUT;
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
    } else if (this.part.partType === TYPE_ISOCHRONIC_TONES) {
      this.part.timeBased = true;
      this.part.time = DEFAULT_SILENCE;
      this.part.value1 = DEFAULT_FREQ_LOW;
      this.part.value2 = DEFAULT_DIFF_FREQ_ISO;
    }
  }

  separatorTypeChanged() {
    this.setFileInfo(SEPARATORS.find(s => s.title === this.part.fileTitle));
  }

  mantraTypeChanged() {
    this.setFileInfo(MANTRAS.find(s => s.title === this.part.fileTitle));
  }

  guidedSessionTypeChanged() {
    this.setFileInfo(GUIDED_SESSIONS.find(s => s.title === this.part.fileTitle));
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
      originalPart.fileTitle = this.part.fileTitle;
      originalPart.fileName = this.part.fileName;
      originalPart.value1 = this.part.value1;
      if (this.part.partType === TYPE_MANTRA) {
        originalPart.value2 = this.part.value1 <= 1 ? 0 : this.part.value2;
      }
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

  getTitle(): string {
    return this.part.partType.charAt(0).toUpperCase() + this.part.partType.slice(1);
  }

  private setFileInfo(fileInfo: FileInfo | undefined) {
    if (fileInfo) {
      this.part.fileTitle = fileInfo.title;
      this.part.time = fileInfo.length;
      this.part.fileName = fileInfo.fileName;
    }
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
    if (this.part.partType === TYPE_ISOCHRONIC_TONES) {
      if (this.part.value1 > 1000) {
        this.part.value1 = 1000;
      }
      if (this.part.value1 < 50) {
        this.part.value1 = 50;
      }
      if (this.part.value2 > 10) {
        this.part.value2 = 10;
      }
      if (this.part.value2 < 1) {
        this.part.value2 = 1;
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
