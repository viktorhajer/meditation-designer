import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL,
  ADVANCED_BB_TYPES, BRAINWAVE_FREQUENCY_BANDS,
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
  SEPARATORS, SOLFEGGIO_SCALE,
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
import {SessionComponent} from '../models/session-component.model';
import {FileInfo} from '../models/file-info';
import {SessionValidator} from '../utils/validators/session.validator';

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

  types = TYPES;
  separatorTypes = SEPARATORS;
  mantraTypes = MANTRAS;
  guidedSessions = GUIDED_SESSIONS;
  interpolations = INTERPOLATIONS;
  advancedBBTypes = ADVANCED_BB_TYPES;
  solfeggioScale = SOLFEGGIO_SCALE;
  brainwaveFrequency  = BRAINWAVE_FREQUENCY_BANDS;

  component: SessionComponent = new SessionComponent();
  showBaseSelector = false;
  showDiff1Selector = false;
  showDiff2Selector = false;

  constructor(private readonly logger: LogService,
              private readonly repository: SessionRepository) {
  }

  ngOnChanges() {
    if (this.active) {
      if (this.createNew) {
        this.component = new SessionComponent();
        this.component.type = TYPE_SEPARATOR;
        this.component.timeBased = true;
        this.component.time = SEPARATORS[0].length;
        this.component.fileName = SEPARATORS[0].fileName;
        this.component.fileTitle = SEPARATORS[0].title;
      } else {
        this.component = Object.assign(new SessionComponent(), this.repository.getSelectedComponent());
      }
    }
  }

  typeChanged() {
    this.component.sliceSpace = 0;
    if (this.isType(TYPE_SEPARATOR)) {
      this.component.timeBased = true;
      this.component.time = SEPARATORS[0].length;
      this.component.fileName = SEPARATORS[0].fileName;
      this.component.fileTitle = SEPARATORS[0].title;
    } else if (this.isType(TYPE_SILENCE)) {
      this.component.timeBased = true;
      this.component.time = DEFAULT_SILENCE;
    } else if (this.isType(TYPE_MANTRA)) {
      this.component.timeBased = false;
      this.component.time = DEFAULT_MANTRA_TIME;
      this.component.count = DEFAULT_MANTRA_COUNT;
      this.component.sliceLength = MANTRAS[0].length;
      this.component.sliceSpace = 2;
      this.component.value1 = 1;
      this.component.value2 = 0;
      this.component.fileName = MANTRAS[0].fileName;
      this.component.fileTitle = MANTRAS[0].title;
    } else if (this.isType(TYPE_METRONOME)) {
      this.component.timeBased = true;
      this.component.time = DEFAULT_METRONOME;
      this.component.valueStr = '40x1';
    } else if (this.isType(TYPE_GUIDED_SESSION)) {
      this.component.timeBased = true;
      this.component.time = GUIDED_SESSIONS[0].length;
      this.component.fileName = GUIDED_SESSIONS[0].fileName;
      this.component.fileTitle = GUIDED_SESSIONS[0].title;
    } else if (this.isType(TYPE_BINAURAL_BEATS)) {
      this.component.timeBased = true;
      this.component.time = DEFAULT_SILENCE;
      this.component.value1 = DEFAULT_LEFT_FREQ;
      this.component.value2 = DEFAULT_DIFF_FREQ_BETA;
      this.component.value3 = DEFAULT_DIFF_FREQ_THETA;
      this.component.valueStr = INTERPOLATION_EASE_OUT;
      this.component.valueStr2 = ADVANCED_BB_BINEURAL;
    } else if (this.isType(TYPE_POLYPHONIC_BB)) {
      this.component.timeBased = true;
      this.component.valueStr = DEFAULT_POLYPHONIC_BB_DESCRIPTION;
      this.component.time = this.calculateTimeForPBB(this.component.valueStr);
    } else if (this.isType(TYPE_HEARTBEAT)) {
      this.component.timeBased = true;
      this.component.time = DEFAULT_SILENCE;
      this.component.value1 = DEFAULT_HEAT_BEAT;
      this.component.sliceLength = 60 / DEFAULT_HEAT_BEAT;
    } else if (this.isType(TYPE_ISOCHRONIC_TONES)) {
      this.component.timeBased = true;
      this.component.time = DEFAULT_SILENCE;
      this.component.value1 = DEFAULT_FREQ_LOW;
      this.component.value2 = DEFAULT_DIFF_FREQ_ISO;
    }
  }

  separatorTypeChanged() {
    this.setFileInfo(SEPARATORS.find(s => s.title === this.component.fileTitle));
  }

  mantraTypeChanged() {
    this.setFileInfo(MANTRAS.find(s => s.title === this.component.fileTitle));
  }

  guidedSessionTypeChanged() {
    this.setFileInfo(GUIDED_SESSIONS.find(s => s.title === this.component.fileTitle));
  }

  isType(type = 'separator'): boolean {
    return this.component.type === type;
  }

  save() {
    const valid = new SessionValidator().validate(this.component);
    this.postProcess();
    if (!valid) {
      // TODO error message
      return;
    } else if (this.createNew && this.repository.getSelectedComponent() === null) {
      this.repository.session.components.push(this.component);
    } else if (this.createNew && this.repository.getSelectedComponent() !== null) {
      this.repository.session.components.splice(this.repository.index + 1, 0, this.component);
    } else {
      const originalComponent = this.repository.getSelectedComponent();
      originalComponent.timeBased = this.component.timeBased;
      originalComponent.time = this.component.time;
      originalComponent.count = this.component.count;
      originalComponent.sliceLength = this.component.sliceLength;
      originalComponent.sliceSpace = this.component.sliceSpace;
      originalComponent.fileTitle = this.component.fileTitle;
      originalComponent.fileName = this.component.fileName;
      originalComponent.value1 = this.component.value1;
      if (this.isType(TYPE_MANTRA)) {
        originalComponent.value2 = this.component.value1 <= 1 ? 0 : this.component.value2;
      }
      originalComponent.value2 = this.component.value2;
      originalComponent.value3 = this.component.value3;
      originalComponent.valueStr = this.component.valueStr;
      originalComponent.valueStr2 = this.component.valueStr2;
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
    return this.component.type.charAt(0).toUpperCase() + this.component.type.slice(1);
  }

  private setFileInfo(fileInfo: FileInfo | undefined) {
    if (fileInfo) {
      this.component.fileTitle = fileInfo.title;
      this.component.time = fileInfo.length;
      this.component.fileName = fileInfo.fileName;
    }
  }

  private postProcess() {
    if (this.isType(TYPE_HEARTBEAT)) {
      this.component.sliceLength = 60 / this.component.value1;
      this.component.sliceSpace = 0;
    } else if (this.isType(TYPE_POLYPHONIC_BB)) {
      this.component.time = this.calculateTimeForPBB(this.component.valueStr);
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
