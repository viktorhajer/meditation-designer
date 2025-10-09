import {Injectable} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL,
  ADVANCED_BB_PANORAMA,
  ADVANCED_BB_MONAURAL,
  ADVANCED_BB_SPECTRUM,
  ADVANCED_BB_SP,
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_LEFT_FREQ,
  FREQUENCY,
  INTERPOLATION_EASE_IN,
  INTERPOLATION_EASE_IN_OUT,
  INTERPOLATION_EASE_OUT,
  INTERPOLATION_LINEAR,
  STATE_RUNNING
} from '../models/session.constant';
import {LogService} from './log.service';
import {SessionComponent} from '../models/session-component.model';
import {AbstractOscillatorService} from './abstract-oscillator.service';

const VOLUME = 0.7;

@Injectable({
  providedIn: 'root'
})
export class BinauralService extends AbstractOscillatorService {

  base = DEFAULT_LEFT_FREQ;
  differenceStart = DEFAULT_DIFF_FREQ_BETA;
  differenceEnd = DEFAULT_DIFF_FREQ_BETA;
  mode = INTERPOLATION_EASE_OUT;
  advanced = ADVANCED_BB_BINEURAL;
  private totalMs = 0;
  private actualMs = 0;
  private advancedTime = 0;
  private verticalValue = 0;

  constructor(logger: LogService) {
    super(logger);
  }

  override reset() {
    this.logger.info('[BB] Reset');
    this.resetBasic();
    this.advancedTime = 0;
    this.actualMs = 0;
  }

  protected init(component: SessionComponent) {
    this.logger.info('[BB] Start');
    this.base = Number(component.value1);
    this.differenceStart = Number(component.value2);
    this.differenceEnd = Number(component.value3);
    this.mode = component.valueStr;
    this.advanced = component.valueStr2;
    this.totalMs = Number(component.time) * 1000;
  }

  protected update() {
    this.setOscillators();
    this.timeout = setTimeout(() => this.clock(), FREQUENCY);
  }

  protected setOscillators() {
    const currentValue = this.oscillators.length ? this.oscillators[0].oscillator.frequency.value : 0;
    if (this.differenceStart === this.differenceEnd && this.oscillators.length && currentValue === (this.base + this.verticalValue)) {
      return;
    }
    const diff = this.calculateDifference();
    const base = this.base + this.verticalValue;
    if (this.oscillators.length) {
      this.oscillators[0].oscillator.frequency.value = base;
      this.oscillators[1].oscillator.frequency.value = base + diff;
    } else {
      this.oscillators.push(this.createThread(base, this.getVolume()));
      this.oscillators.push(this.createThread(base + diff, this.getVolume(), false));
    }
  }

  protected clock() {
    if (this.state === STATE_RUNNING) {
      this.actualMs += FREQUENCY;
      if (this.isInFreq()) {
        this.setOscillators();
      }
      if (this.isInFreq(20)) {
        this.setVHModulation(20);
      }
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  override getPan(left = true): number {
    if (this.advanced === ADVANCED_BB_MONAURAL) {
      return 0;
    }
    return left ? -1 : 1;
  }

  private calculateDifference(): number {
    if (this.differenceEnd === this.differenceStart) {
      return this.differenceStart;
    }
    let value;
    switch (this.mode) {
      case INTERPOLATION_LINEAR:
        value = this.differenceStart + (this.differenceEnd - this.differenceStart) * (this.actualMs / this.totalMs);
        break;
      case INTERPOLATION_EASE_OUT:
        value = this.differenceStart + (this.differenceEnd - this.differenceStart) * (1 - Math.pow((this.totalMs - this.actualMs) / this.totalMs, 3));
        break;
      case INTERPOLATION_EASE_IN:
        value = this.differenceStart + (this.differenceEnd - this.differenceStart) * Math.pow(this.actualMs / this.totalMs, 3);
        break;
      case INTERPOLATION_EASE_IN_OUT:
        value = this.differenceStart + (this.differenceEnd - this.differenceStart) * ((1 - Math.cos(Math.PI * (this.actualMs / this.totalMs))) / 2);
        break;
      default:
        value = this.actualMs / this.totalMs < 0.5 ? this.differenceStart : this.differenceEnd;
        break;
    }
    return value;
  }

  private isInFreq(freqMs = 500): boolean {
    return this.actualMs % freqMs === 0;
  }

  private setVHModulation(freq: number) {
    if (this.advanced === ADVANCED_BB_PANORAMA || this.advanced === ADVANCED_BB_SP) {
      const size = 0.6;
      const value = (size / 2) * Math.sin(Math.PI * 0.5 * this.advancedTime) + (size / 2) + 0.1;
      const roundedValue = Math.floor(value * 100) / 100;
      this.oscillators[0].gainNode.gain.value = roundedValue;
      this.oscillators[1].gainNode.gain.value = VOLUME - roundedValue;
    }
    if (this.advanced === ADVANCED_BB_SPECTRUM || this.advanced === ADVANCED_BB_SP) {
      const size = 50;
      this.verticalValue = Math.floor((size / 2) * Math.sin(Math.PI * 1 * this.advancedTime) + (size / 2));
      this.setOscillators();
    }
    if (this.advanced === ADVANCED_BB_PANORAMA || this.advanced === ADVANCED_BB_SPECTRUM || this.advanced === ADVANCED_BB_SP) {
      this.advancedTime += 1 / (1000 / freq - 1);
    }
  }

  private getVolume(): number {
    if (this.advanced === ADVANCED_BB_MONAURAL) {
      return VOLUME / 2;
    }
    return VOLUME;
  }
}
