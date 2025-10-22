import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionComponent} from '../models/session-component.model';
import {SessionRepository} from '../services/session-repository.service';
import {SessionService} from '../services/session.service';
import {
  STATE_PAUSED,
  STATE_RUNNING,
  STATE_STOPPED,
  TYPE_BINAURAL_BEATS, TYPE_GUIDED_SESSION, TYPE_HEARTBEAT,
  TYPE_ISOCHRONIC_TONES, TYPE_MANTRA, TYPE_METRONOME, TYPE_POLYPHONIC_BB, TYPE_SEPARATOR
} from '../models/session.constant';
import {SessionUtil} from '../services/session.util';

@Component({
    selector: 'app-part',
    templateUrl: './part.component.html',
    styleUrls: ['./part.component.scss'],
    standalone: false
})
export class PartComponent {
  @Input() part: SessionComponent = new SessionComponent();
  @Input() selected = false;
  @Input() index = 0;
  @Input() state = STATE_STOPPED;
  @Output() select = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();

  constructor(public readonly repository: SessionRepository,
              public readonly service: SessionService) {
  }

  getTime(): number {
    const total = this.selected ? this.service.getTime() : -1;
    return total === -1 ? SessionUtil.getSessionComponentTime(this.part) : total;
  }

  isRunning(): boolean {
    return this.state === STATE_RUNNING;
  }

  isPaused(): boolean {
    return this.state === STATE_PAUSED;
  }

  getImage(): string {
    if (this.part.type === TYPE_ISOCHRONIC_TONES || this.part.type === TYPE_POLYPHONIC_BB) {
      return `./assets/images/${TYPE_BINAURAL_BEATS}.png`;
    }
    return `./assets/images/${this.part.type}.png`;
  }

  getTitleLine(): string {
    return this.part.type.charAt(0).toUpperCase() + this.part.type.slice(1);
  }

  getInfoLine(): string {
    if (this.part.type === TYPE_MANTRA) {
      return this.part.fileTitle + ' ' + (this.part.timeBased ? '' : this.part.count + '');
    } else if (this.part.type === TYPE_SEPARATOR || this.part.type === TYPE_GUIDED_SESSION) {
      return this.part.fileTitle;
    } else if (this.part.type === TYPE_BINAURAL_BEATS) {
      return this.part.value1 + ' Hz (' + this.part.value2 + '-' + this.part.value3 + ' Hz)';
    } else if (this.part.type === TYPE_ISOCHRONIC_TONES) {
      return this.part.value1 + ' Hz / ' + this.part.value2 + ' Hz';
    } else if (this.part.type === TYPE_HEARTBEAT) {
      return this.part.value1 + ' BPM';
    }
    return this.part.timeBased ? '' : this.part.count + '';
  }
}
