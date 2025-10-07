import {Injectable} from '@angular/core';
import {LogService} from './log.service';
import {SessionPart} from '../models/session-part.model';
import {FREQUENCY, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from '../models/session.constant';

// description format: T1[A1-A2-V1|B1-B2-V2|...],T2[C1-C2-V3|...],...
// T1, T2 ... duration in seconds
// A1, B1 ... frequency for left ear in Hz
// A2, B2 ... frequency for right ear in Hz
// V1, V2 ... volume level: L (low), M (medium), H (high)

@Injectable({
  providedIn: 'root'
})
export class PolyphonicBinauralService {

  private audioContext = new AudioContext();
  private oscillators: { oscillator: OscillatorNode, gainNode: GainNode }[] = [];
  private sessions: string[] = [];
  state = STATE_STOPPED;
  private actualSessionIndex = 0;
  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;

  constructor(private readonly logger: LogService) {
  }

  start(part: SessionPart) {
    this.logger.info('[PBB] Start');
    this.sessions = part.valueStr.split(',');
    this.reset();
    this.state = STATE_RUNNING;
    this.next();
  }

  pause() {
    this.logger.info('[PBB] Pause');
    if (this.state === STATE_RUNNING) {
      this.state = STATE_PAUSED;
      this.oscillators.forEach(osc => osc.oscillator.stop());
      this.oscillators = [];
    }
  }

  resume() {
    this.logger.info('[PBB] Resume');
    if (this.state === STATE_PAUSED) {
      this.state = STATE_RUNNING;
      this.setOscillators();
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  reset() {
    this.logger.info('[PBB] Reset');
    clearTimeout(this.timeout);
    this.timeout = null;
    this.state = STATE_STOPPED;
    this.oscillators.forEach(osc => osc.oscillator.stop());
    this.oscillators = [];
    this.actualSessionIndex = -1;
  }

  private next() {
    this.actualSessionIndex++;
    if (this.actualSessionIndex < this.sessions.length) {
      this.logger.info('[PBB] Next');
      this.setTimes();
      this.setOscillators();
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    } else {
      this.logger.info('[PBB] End');
      this.reset();
    }
  }

  private setTimes() {
    const description = this.sessions[this.actualSessionIndex];
    this.totalMs = Number(description.split('[')[0]) * 1000;
    this.actualMs = 0;
  }

  private setOscillators() {
    const description = this.sessions[this.actualSessionIndex];
    const parts = description.split('[');
    if (parts.length > 1) {
      const freqParts = parts[1].split(']')[0].split('|');
      const requiredOscCount = freqParts.length * 2;
      this.logger.info('[PBB] Required oscillator count: ' + requiredOscCount + ', current count: ' + this.oscillators.length);
      if (this.oscillators.length > requiredOscCount) {
        this.logger.info('[PBB] Remove oscillator(s)');
        const removedOscillators = this.oscillators.splice(requiredOscCount);
        removedOscillators.forEach(osc => osc.oscillator.stop());
      }
      freqParts.forEach((fp, index) => {
        const freqs = fp.split('-');
        if (this.oscillators.length > index * 2 + 1) {
          this.logger.info('[PBB] Update oscillator');
          this.oscillators[index * 2].oscillator.frequency.value = Number(freqs[0]);
          this.oscillators[index * 2].gainNode.gain.value = this.getVolume(freqs[2]);
          this.oscillators[index * 2 + 1].oscillator.frequency.value = Number(freqs[1]);
          this.oscillators[index * 2 + 1].gainNode.gain.value = this.getVolume(freqs[2]);
        } else {
          this.logger.info('[PBB] New oscillator');
          this.oscillators.push(this.createThread(Number(freqs[0]), this.getVolume(freqs[2])));
          this.oscillators.push(this.createThread(Number(freqs[1]), this.getVolume(freqs[2]), false));
        }
      });

      this.logger.info('[PBB] Oscillators: ');
      this.oscillators.forEach(osc => {
        this.logger.info('  Freq: ' + osc.oscillator.frequency.value + ', Vol: ' + osc.gainNode.gain.value);
      });
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

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.actualMs += FREQUENCY;
      if (this.totalMs - this.actualMs <= 0) {
        this.next();
      } else {
        this.timeout = setTimeout(() => this.clock(), FREQUENCY);
      }
    }
  }

  private getVolume(level: string): number {
    switch (level.toUpperCase()) {
      case 'L':
        return 0.05;
      case 'M':
        return 0.1;
      case 'H':
      default:
        return 0.2;
    }
  }
}