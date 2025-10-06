import {Injectable} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL, ADVANCED_BB_HORIZONTAL, ADVANCED_BB_MONAURAL, ADVANCED_BB_VERTICAL,
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_LEFT_FREQ,
  INTERPOLATION_EASE_IN,
  INTERPOLATION_EASE_IN_OUT,
  INTERPOLATION_EASE_OUT,
  INTERPOLATION_LINEAR, SessionPart
} from '../models/session-part.model';
import {LogService} from './log.service';
import {FREQUENCY, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from './session.service';

const VOLUME = 0.7;

@Injectable({
  providedIn: 'root'
})
export class BinauralService {

  private audioContext = new AudioContext();
  base = DEFAULT_LEFT_FREQ;
  differenceStart = DEFAULT_DIFF_FREQ_BETA;
  differenceEnd = DEFAULT_DIFF_FREQ_BETA;
  mode = INTERPOLATION_EASE_OUT;
  advanced = ADVANCED_BB_BINEURAL;
  state = STATE_STOPPED;
  private oscillators: { oscillator: OscillatorNode, gainNode: GainNode }[] = [];
  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;
  private advancedTime = 0;
  private verticalValue = 0;

  constructor(private readonly logger: LogService) {
  }

  start(part: SessionPart) {
    this.logger.info('[BB] Start');
    this.base = part.value1;
    this.differenceStart = part.value2;
    this.differenceEnd = part.value3;
    this.mode = part.name;
    this.advanced = part.valueStr2;
    this.totalMs = part.time * 1000;
    this.reset();
    this.state = STATE_RUNNING;
    this.actualMs = 0;
    this.setOscillators();
    this.timeout = setTimeout(() => this.clock(), FREQUENCY);
  }

  pause() {
    this.logger.info('[BB] Pause');
    if (this.state === STATE_RUNNING) {
      this.state = STATE_PAUSED;
      this.oscillators.forEach(osc => osc.oscillator.stop());
      this.oscillators = [];
    }
  }

  resume() {
    this.logger.info('[BB] Resume');
    if (this.state === STATE_PAUSED) {
      this.state = STATE_RUNNING;
      this.setOscillators();
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  reset() {
    this.logger.info('[BB] Reset');
    clearTimeout(this.timeout);
    this.timeout = null;
    this.state = STATE_STOPPED;
    this.oscillators.forEach(osc => osc.oscillator.stop());
    this.oscillators = [];
    this.advancedTime = 0;
  }

  private setOscillators() {
    if (this.differenceStart === this.differenceEnd && this.oscillators.length) {
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

  private createThread(frequency: number, volume: number, left = true) {
    const oscillator = this.audioContext.createOscillator();
    const stereoNode = new StereoPannerNode(this.audioContext, {pan: 0});
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    stereoNode.pan.value = this.getPan(left);
    oscillator.connect(stereoNode).connect(gainNode).connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    return {oscillator, gainNode};
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
    // this.logger.info('[BB] Freq diff: ' + value + ' Hz (' + this.mode + ')');
    return value;
  }

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.actualMs += FREQUENCY;
      if (this.isInFreq()) {
        this.setOscillators();
      }
      if (this.isInFreq(20)) {
        this.setVolume(20);
      }
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  private isInFreq(freqMs = 500): boolean {
    return this.actualMs % freqMs === 0;
  }

  private setVolume(freq: number) {
    if (this.advanced === ADVANCED_BB_HORIZONTAL) {
      const size = 0.6;
      const value = (size/2) * Math.sin(Math.PI * 0.5 * this.advancedTime) + (size/2) + 0.1;
      const roundedValue = Math.floor(value * 100) / 100;
      this.oscillators[0].gainNode.gain.value = roundedValue;
      this.oscillators[1].gainNode.gain.value = VOLUME - roundedValue;
    } else if (this.advanced === ADVANCED_BB_VERTICAL) {
      const size = 50;
      this.verticalValue = Math.floor((size/2) * Math.sin(Math.PI * 1 * this.advancedTime) + (size/2));
      this.setOscillators();
    }
    if(this.advanced === ADVANCED_BB_HORIZONTAL || this.advanced === ADVANCED_BB_VERTICAL) {
      this.advancedTime += 1 / (1000 / freq - 1);
    }
  }

  private getPan(left = true): number {
    if (this.advanced === ADVANCED_BB_MONAURAL) {
      return 0;
    }
    return left ? -1 : 1;
  }

  private getVolume(): number {
    if (this.advanced === ADVANCED_BB_MONAURAL) {
      return VOLUME / 2;
    }
    return VOLUME;
  }
}
