import {Injectable} from '@angular/core';
import {SessionPart, TYPE_MANTRA, TYPE_METRONOME, TYPE_SEPARATOR} from '../models/session-part.model';
import {STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from './session-repository.service';
import {LogService} from './log.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  separatorPlayer: HTMLAudioElement = null as any;
  metronomePlayer: HTMLAudioElement = null as any;
  mantraPlayer: HTMLAudioElement = null as any;
  private part: SessionPart = null as any;
  private state = STATE_STOPPED;

  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;

  private metronomeCount = 0;
  private metronomeActualMs = 0;
  private metronomePartMs = 0;

  finish = new BehaviorSubject<boolean>(false);

  constructor(private readonly logger: LogService) {
  }

  init(separatorPlayer: HTMLAudioElement, metronomePlayer: HTMLAudioElement, mantraPlayer: HTMLAudioElement) {
    this.separatorPlayer = separatorPlayer;
    this.metronomePlayer = metronomePlayer;
    this.mantraPlayer = mantraPlayer;
    this.separatorPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Separator sound loaded');
    });
    this.metronomePlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Metronome sound loaded');
    });
  }

  setPart(part: SessionPart, state = STATE_STOPPED) {
    this.stop();
    this.part = part;
    this.logger.info(this.part ? 'Set part: ' + this.part.partType : 'Remove part');
    // if (this.part?.partType === TYPE_MANTRA) {
    //   this.logger.info('Load mantra');
    // }
    this.reset();
    if (state === STATE_RUNNING) {
      this.state = STATE_RUNNING;
      this.play();
    }
  }

  play() {
    this.state = STATE_RUNNING;
    this.logger.info('Play: ' + this.part?.partType);
    if (this.part.partType !== TYPE_METRONOME) {
      this.playSound();
    }
    this.clock();
  }

  pause() {
    this.state = STATE_PAUSED;
    this.logger.info('Pause: ' + this.part?.partType);
    // this.getPlayer()?.pause();
  }

  stop() {
    this.state = STATE_STOPPED;
    const player = this.getPlayer();
    if (player) {
      this.logger.info('Stop: ' + this.part?.partType);
      player.pause();
      player.currentTime = 0;
    }
    this.reset();
  }

  getTime(): number {
    return this.part && this.state !== STATE_STOPPED ? Math.floor((this.totalMs - this.actualMs) / 1000) : -1;
  }

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.clockMetronome();
      this.actualMs += 10;
      if (this.totalMs - this.actualMs <= 0) {
        this.actualMs = 0;
        this.state = 0;
        this.finish.next(true);
      } else {
        this.timeout = setTimeout(() => this.clock(), 10);
      }
    }
  }

  private clockMetronome() {
    if (this.part.partType === TYPE_METRONOME) {
      if (this.metronomeActualMs === 0) {
        if (!this.part.timeBased && this.part.count === this.metronomeCount) {
          return;
        }
        this.playSound();
        this.metronomeCount++;
      }
      this.metronomeActualMs += 10;
      if (this.metronomePartMs - this.metronomeActualMs <= 0) {
        this.metronomeActualMs = 0;
      }
    }
  }

  private playSound() {
    this.getPlayer()?.play()
      .then(() => this.logger.info('Playing: ' + this.part?.partType))
      .catch(error => this.logger.error('Failed to play: ' + this.part?.partType + '-' + error));
  }

  private getPlayer(): HTMLAudioElement | null {
    if (this.part) {
      if (this.part.partType === TYPE_SEPARATOR) {
        return this.separatorPlayer;
      } else if (this.part.partType === TYPE_METRONOME) {
        return this.metronomePlayer;
      } else if (this.part.partType === TYPE_MANTRA) {
        return this.mantraPlayer;
      }
    }
    return null;
  }

  private reset() {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.totalMs = this.part ? this.part.getTime() * 1000 : 0;
    this.actualMs = 0;
    this.metronomePartMs = this.part ? this.part.tickLength * 1000 : 0;
    this.metronomeActualMs = 0;
    this.metronomeCount = 0;
  }
}