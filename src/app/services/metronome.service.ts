import {FREQUENCY, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from '../models/session.constant';
import {LogService} from './log.service';
import {SessionComponent} from '../models/session-component.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class MetronomeService {

  private audioPlayer: HTMLAudioElement = null as any;
  private state = STATE_STOPPED;
  private bpms: number[] = [];
  private index = 0;

  public constructor(private readonly logger: LogService) {
  }

  start(component: SessionComponent, audioPlayer: HTMLAudioElement) {
    this.logger.info('[Metronome] Start');
    this.audioPlayer = audioPlayer;
    this.bpms = [];
    component.valueStr.split(',').map(v => v.trim()).forEach(bpm => {
      const [bpmValue, countValue] = bpm.split('x').map(v => Number(v.trim()));
      for (let i = 0; i < countValue; i++) {
        this.bpms.push(bpmValue);
      }
    });
    this.reset();
    this.state = STATE_RUNNING;
    this.next();
  }

  pause() {
    if (this.state === STATE_RUNNING) {
      this.state = STATE_PAUSED;
      this.audioPlayer.pause();
    }
  }

  resume() {
    if (this.state === STATE_PAUSED) {
      this.state = STATE_RUNNING;
      setTimeout(() => this.next(), FREQUENCY);
    }
  }

  reset() {
    this.logger.info('[Metronome] Reset');
    this.state = STATE_STOPPED;
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }
    this.index = 0;
  }

  private next() {
    if (this.state === STATE_RUNNING) {
      this.playSound();
      setTimeout(() => this.next(), Math.round(60 / this.bpms[this.index] * 1000));
      this.index++;
      if (this.index >= this.bpms.length) {
        this.index = 0;
      }
    }
  }

  private playSound() {
    this.audioPlayer.currentTime = 0;
    this.audioPlayer.play().catch(() => this.logger.error('[Metronome] Play sound error'));
  }
}
