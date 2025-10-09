import {Injectable} from '@angular/core';
import {LogService} from './log.service';
import {SessionComponent} from '../models/session-component.model';
import {FREQUENCY, STATE_RUNNING} from '../models/session.constant';
import {AbstractOscillatorService} from './abstract-oscillator.service';

// description format: T1[A1-A2-V1|B1-B2-V2|...],T2[C1-C2-V3|...],...
// T1, T2 ... duration in seconds
// A1, B1 ... frequency for left ear in Hz
// A2, B2 ... frequency for right ear in Hz
// V1, V2 ... volume level: L (low), M (medium), H (high)

@Injectable({
  providedIn: 'root'
})
export class PolyphonicBinauralService extends AbstractOscillatorService {

  private sessions: string[] = [];
  private actualSessionIndex = 0;
  private totalMs = 0;
  private actualMs = 0;

  constructor(logger: LogService) {
    super(logger);
  }

  override reset() {
    this.logger.info('[PBB] Reset');
    this.resetBasic();
    this.actualSessionIndex = -1;
  }

  protected init(component: SessionComponent) {
    this.logger.info('[PBB] Start');
    this.sessions = component.valueStr.split(',');
  }

  protected update() {
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

  protected setOscillators() {
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

  protected clock() {
    if (this.state === STATE_RUNNING) {
      this.actualMs += FREQUENCY;
      if (this.totalMs - this.actualMs <= 0) {
        this.update();
      } else {
        this.timeout = setTimeout(() => this.clock(), FREQUENCY);
      }
    }
  }

  private setTimes() {
    const description = this.sessions[this.actualSessionIndex];
    this.totalMs = Number(description.split('[')[0]) * 1000;
    this.actualMs = 0;
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