import {Injectable} from '@angular/core';
import {
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_LEFT_FREQ,
  INTERPOLATION_EASE_IN,
  INTERPOLATION_EASE_IN_OUT,
  INTERPOLATION_EASE_OUT,
  INTERPOLATION_LINEAR
} from '../models/session-part.model';
import {LogService} from './log.service';
import {FREQUENCY, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from './session.service';

const VOLUME = 0.8;

@Injectable({
  providedIn: 'root'
})
export class BinauralService {

  private audioContext = new AudioContext();
  base = DEFAULT_LEFT_FREQ;
  differenceStart = DEFAULT_DIFF_FREQ_BETA;
  differenceEnd = DEFAULT_DIFF_FREQ_BETA;
  mode = INTERPOLATION_EASE_OUT;
  state = STATE_STOPPED;
  private oscillators: { oscillator: OscillatorNode, gainNode: GainNode }[] = [];
  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;

  constructor(private readonly logger: LogService) {
  }

  start(time: number, base: number, differenceStart: number, differenceEnd: number, mode: string) {
    this.logger.info('[BB] Start');
    this.base = base;
    this.mode = mode;
    this.differenceStart = differenceStart;
    this.differenceEnd = differenceEnd;
    this.totalMs = time * 1000;
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
  }

  private setOscillators() {
    const diff = this.calculateDifference();
    if (this.oscillators.length) {
      this.oscillators[0].oscillator.frequency.value = this.base;
      this.oscillators[1].oscillator.frequency.value = this.base + diff;
    } else {
      this.oscillators.push(this.createThread(this.base, VOLUME));
      this.oscillators.push(this.createThread(this.base + diff, VOLUME, false));
    }
  }

  private createThread(frequency: number, volume: number, left = true) {
    const oscillator = this.audioContext.createOscillator();
    const stereoNode = new StereoPannerNode(this.audioContext, {pan: 0});
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    stereoNode.pan.value = left ? -1 : 1;
    oscillator.connect(stereoNode).connect(gainNode).connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    return {oscillator, gainNode};
  }

  private calculateDifference(): number {
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
    this.logger.info('[BB] Freq diff: ' + value + ' Hz (' + this.mode + ')');
    return value;
  }

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.actualMs += FREQUENCY;
      if (this.isInFreq()) {
        this.setOscillators();
      }
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  private isInFreq(freqMs = 500): boolean {
    return this.actualMs % freqMs === 0;
  }
}
