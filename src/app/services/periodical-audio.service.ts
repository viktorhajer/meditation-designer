import {Injectable} from '@angular/core';
import {FREQUENCY, TYPE_HEARTBEAT, TYPE_MANTRA} from '../models/session.constant';
import {SessionComponent} from '../models/session-component.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodicalAudioService {

  private sliceCount = 0;
  private sliceActualMs = 0;
  private sliceTotalMs = 0;
  private lock = false;

  process(component: SessionComponent) {
    let playSound = false;
    if (!this.lock &&
      (component.type === TYPE_HEARTBEAT || component.type === TYPE_MANTRA)) {
      if (this.sliceActualMs === 0) {
        if (!component.timeBased && component.count === this.sliceCount) {
          return;
        }
        playSound = true;
        this.sliceCount++;

        if (component.type === TYPE_MANTRA && this.sliceCount % component.value1 === 0) {
          this.lock = true;
          setTimeout(() => this.lock = false, component.value2 * 1000);
        }
      }
      this.sliceActualMs += FREQUENCY;
      if (this.sliceTotalMs - this.sliceActualMs <= 0) {
        this.sliceActualMs = 0;
      }
    }
    return playSound;
  }

  reset(component?: SessionComponent) {
    this.sliceTotalMs = component ? (component.sliceLength + component.sliceSpace) * 1000 : 0;
    this.sliceCount = 0;
    this.sliceActualMs = 0;
    this.lock = false;
  }
}
