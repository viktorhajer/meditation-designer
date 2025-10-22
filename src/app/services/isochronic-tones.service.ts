import {Injectable} from '@angular/core';
import {DEFAULT_DIFF_FREQ_BETA, DEFAULT_LEFT_FREQ, STATE_RUNNING} from '../models/session.constant';
import {LogService} from './log.service';
import {SessionComponent} from '../models/session-component.model';
import {AbstractOscillatorService} from './abstract-oscillator.service';

@Injectable({
  providedIn: 'root'
})
export class IsochronicTonesService extends AbstractOscillatorService {

  base = DEFAULT_LEFT_FREQ;
  pulsation = DEFAULT_DIFF_FREQ_BETA;

  constructor(logger: LogService) {
    super(logger);
  }

  override reset() {
    this.logger.info('[ISO] Reset');
    this.resetBasic();
  }

  protected init(component: SessionComponent) {
    this.logger.info('[ISO] Start');
    this.base = Number(component.value1);
    this.pulsation = Math.round(1000 / Number(component.value2)) / 2;
  }

  protected update() {
    this.setOscillators();
    this.timeout = setTimeout(() => this.clock(), this.pulsation);
  }

  protected setOscillators() {
    this.oscillators.push(this.createThread(this.base, this.getVolume()));
  }

  protected clock() {
    if (this.state === STATE_RUNNING) {
      this.setVolume();
      this.timeout = setTimeout(() => this.clock(), this.pulsation);
    }
  }

  override getPan(left = true): number {
    return 0;
  }

  private setVolume() {
    if (this.oscillators[0].gainNode.gain.value === 0) {
      this.oscillators[0].gainNode.gain.value = this.getVolume();
    } else {
      this.oscillators[0].gainNode.gain.value = 0;
    }
  }

  private getVolume(): number {
    return 0.2;
  }
}
