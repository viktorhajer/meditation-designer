import {Injectable} from '@angular/core';
import {FREQUENCY, TYPE_HEARTBEAT, TYPE_MANTRA, TYPE_METRONOME} from '../models/session.constant';
import {SessionPart} from '../models/session-part.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodicalAudioService {

  private sliceCount = 0;
  private sliceActualMs = 0;
  private sliceTotalMs = 0;
  private lock = false;

  process(part: SessionPart) {
    let playSound = false;
    if (!this.lock &&
      (part.partType === TYPE_HEARTBEAT || part.partType === TYPE_METRONOME || part.partType === TYPE_MANTRA)) {
      if (this.sliceActualMs === 0) {
        if (!part.timeBased && part.count === this.sliceCount) {
          return;
        }
        playSound = true;
        this.sliceCount++;

        if (part.partType === TYPE_MANTRA && this.sliceCount % part.value1 === 0) {
          this.lock = true;
          setTimeout(() => this.lock = false, part.value2 * 1000);
        }
      }
      this.sliceActualMs += FREQUENCY;
      if (this.sliceTotalMs - this.sliceActualMs <= 0) {
        this.sliceActualMs = 0;
      }
    }
    return playSound;
  }

  reset(part?: SessionPart) {
    this.sliceTotalMs = part ? (part.sliceLength + part.sliceSpace) * 1000 : 0;
    this.sliceCount = 0;
    this.sliceActualMs = 0;
    this.lock = false;
  }
}
