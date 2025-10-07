import {Injectable} from '@angular/core';
import {
  ADVANCED_BB_BINEURAL, ADVANCED_BB_HORIZONTAL, ADVANCED_BB_MONAURAL, ADVANCED_BB_VERTICAL, ADVANCED_BB_VH,
  DEFAULT_DIFF_FREQ_BETA,
  DEFAULT_LEFT_FREQ, FREQUENCY,
  INTERPOLATION_EASE_IN,
  INTERPOLATION_EASE_IN_OUT,
  INTERPOLATION_EASE_OUT,
  INTERPOLATION_LINEAR, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED
} from '../models/session.constant';
import {LogService} from './log.service';
import {SessionPart} from '../models/session-part.model';

@Injectable({
  providedIn: 'root'
})
export class IsochronicTonesService {

  private audioContext = new AudioContext();
  base = DEFAULT_LEFT_FREQ;
  pulsation = DEFAULT_DIFF_FREQ_BETA;
  state = STATE_STOPPED;
  private oscillators: { oscillator: OscillatorNode, gainNode: GainNode }[] = [];
  private timeout = null as any;
  private muted = false;

  constructor(private readonly logger: LogService) {
  }

  start(part: SessionPart) {
    this.logger.info('[BB] Start');
    this.base = part.value1;
    this.pulsation = Math.round(1000 / part.value2) / 2;
    this.reset();
    this.state = STATE_RUNNING;
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
    this.muted = false;
  }

  private setOscillators() {
    this.oscillators.push(this.createThread(this.base, this.getVolume()));
  }

  private createThread(frequency: number, volume: number, left = true) {
    const oscillator = this.audioContext.createOscillator();
    const stereoNode = new StereoPannerNode(this.audioContext, {pan: 0});
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    stereoNode.pan.value = 0;
    oscillator.connect(stereoNode).connect(gainNode).connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    return {oscillator, gainNode};
  }

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.setVolume();
      this.timeout = setTimeout(() => this.clock(), this.pulsation);
    }
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
