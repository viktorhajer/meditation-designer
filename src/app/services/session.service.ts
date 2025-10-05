import {Injectable} from '@angular/core';
import {
  SessionPart,
  TYPE_BINAURAL_BEATS,
  TYPE_GUIDED_SESSION,
  TYPE_HEARTBEAT,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_POLYPHONIC_BB,
  TYPE_SEPARATOR
} from '../models/session-part.model';
import {LogService} from './log.service';
import {BehaviorSubject} from 'rxjs';
import {BinauralService} from './binaural.service';
import {PolyphonicBinauralService} from './polyphonic-binaural.service';

export const STATE_STOPPED = 0;
export const STATE_RUNNING = 1;
export const STATE_PAUSED = 2;

export const FREQUENCY = 10; //ms
const SOUND_DIRECTORY = './assets/sounds/';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  separatorPlayer: HTMLAudioElement = null as any;
  metronomePlayer: HTMLAudioElement = null as any;
  mantraPlayer: HTMLAudioElement = null as any;
  guidedSessionPlayer: HTMLAudioElement = null as any;
  heartBeatPlayer: HTMLAudioElement = null as any;
  private part: SessionPart = null as any;
  state = STATE_STOPPED;

  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;

  private sliceCount = 0;
  private sliceActualMs = 0;
  private sliceTotalMs = 0;

  private lock = false;

  private partLoaded = false;

  partFinished = new BehaviorSubject<boolean>(false);

  constructor(private readonly logger: LogService,
              private readonly binaural: BinauralService,
              private readonly polyphonicBinaural: PolyphonicBinauralService) {
  }

  init(separatorPlayer: HTMLAudioElement, metronomePlayer: HTMLAudioElement,
       mantraPlayer: HTMLAudioElement, guidedSessionPlayer: HTMLAudioElement, heartBeatPlayer: HTMLAudioElement) {
    this.separatorPlayer = separatorPlayer;
    this.metronomePlayer = metronomePlayer;
    this.mantraPlayer = mantraPlayer;
    this.guidedSessionPlayer = guidedSessionPlayer;
    this.heartBeatPlayer = heartBeatPlayer;
    this.separatorPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Separator sound loaded');
      if (this.part?.partType === TYPE_SEPARATOR) {
        this.partLoaded = true;
      }
    });
    this.guidedSessionPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Guided session sound loaded');
      if (this.part?.partType === TYPE_GUIDED_SESSION) {
        this.partLoaded = true;
      }
    });
    this.metronomePlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Metronome sound loaded');
    });
    this.mantraPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Mantra sound loaded');
      if (this.part?.partType === TYPE_MANTRA) {
        this.partLoaded = true;
      }
    });
    this.heartBeatPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Heart beat sound loaded');
    });
  }

  setPart(part: SessionPart, next = false) {
    this.stop(part && next ? this.state : STATE_STOPPED);
    this.part = part;
    this.partLoaded = false;
    this.logger.info(this.part ? 'Set part: ' + this.part.partType : 'Remove part');
    if (this.part?.partType === TYPE_SEPARATOR) {
      this.logger.info('Load separator: ' + this.part.fileName);
      this.separatorPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else if (this.part?.partType === TYPE_MANTRA) {
      this.logger.info('Load mantra: ' + this.part.fileName);
      this.mantraPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else if (this.part?.partType === TYPE_GUIDED_SESSION) {
      this.logger.info('Load guided session: ' + this.part.fileName);
      this.guidedSessionPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else {
      this.partLoaded = true;
    }

    this.reset();
    if (this.part && this.state === STATE_RUNNING && next) {
      this.play();
    }
  }

  play() {
    if (this.partLoaded) {
      this.logger.info((this.state === STATE_PAUSED ? 'Resume: ' : 'Play: ') + this.part?.partType);
      if (this.state === STATE_PAUSED ||
        (this.part.partType !== TYPE_METRONOME && this.part.partType !== TYPE_MANTRA && this.part.partType !== TYPE_HEARTBEAT)) {
        this.playSound();
      }
      if (this.part.partType === TYPE_BINAURAL_BEATS) {
        this.state === STATE_PAUSED ? this.binaural.resume() :
          this.binaural.start(this.part.time, this.part.value1, this.part.value2, this.part.value3, this.part.name);
      } else if (this.part.partType === TYPE_POLYPHONIC_BB) {
        this.state === STATE_PAUSED ? this.polyphonicBinaural.resume() : this.polyphonicBinaural.start(this.part.valueStr);
      }
      this.state = STATE_RUNNING;
      this.clock();
    } else {
      this.logger.info('Play recheck');
      setTimeout(() => this.play(), 1000);
    }
  }

  pause() {
    this.state = STATE_PAUSED;
    this.logger.info('Pause: ' + this.part?.partType);
    this.getPlayer()?.pause();
    if (this.part.partType === TYPE_BINAURAL_BEATS) {
      this.binaural.pause();
    } else if (this.part.partType === TYPE_POLYPHONIC_BB) {
      this.polyphonicBinaural.pause();
    }
  }

  stop(state = STATE_STOPPED) {
    this.state = state;
    const player = this.getPlayer();
    if (player) {
      this.logger.info('Stop: ' + this.part?.partType);
      player.pause();
      player.currentTime = 0;
    }
    this.binaural.reset();
    this.polyphonicBinaural.reset();
    this.reset();
  }

  getTime(): number {
    return this.part && this.state !== STATE_STOPPED ? Math.floor((this.totalMs - this.actualMs) / 1000) : -1;
  }

  isRunning(): boolean {
    return this.state === STATE_RUNNING;
  }

  isStopped(): boolean {
    return this.state === STATE_STOPPED;
  }

  private clock() {
    if (this.state === STATE_RUNNING) {
      this.processMetronomeOrMantra();
      this.actualMs += FREQUENCY;
      if (this.totalMs - this.actualMs <= 0) {
        this.actualMs = 0;
        this.partFinished.next(true);
      } else {
        this.timeout = setTimeout(() => this.clock(), FREQUENCY);
      }
    }
  }

  private processMetronomeOrMantra() {
    if (!this.lock &&
      (this.part.partType === TYPE_HEARTBEAT || this.part.partType === TYPE_METRONOME || this.part.partType === TYPE_MANTRA)) {
      if (this.sliceActualMs === 0) {
        if (!this.part.timeBased && this.part.count === this.sliceCount) {
          return;
        }
        this.playSound(true);
        this.sliceCount++;

        if (this.part.partType === TYPE_MANTRA && this.sliceCount % this.part.mantraGroup === 0) {
          this.lock = true;
          setTimeout(() => this.lock = false, this.part.mantraGroupSpace * 1000);
        }
      }
      this.sliceActualMs += FREQUENCY;
      if (this.sliceTotalMs - this.sliceActualMs <= 0) {
        this.sliceActualMs = 0;
      }
    }
  }

  private playSound(fromStart = false) {
    const player = this.getPlayer();
    if (player) {
      if (fromStart) {
        player.currentTime = 0;
      }
      player.play()
        .then(() => this.logger.info('Playing: ' + this.part?.partType))
        .catch(error => this.logger.error('Failed to play: ' + this.part?.partType + '-' + error));
    }
  }

  private getPlayer(): HTMLAudioElement | null {
    if (this.part) {
      if (this.part.partType === TYPE_SEPARATOR) {
        return this.separatorPlayer;
      } else if (this.part.partType === TYPE_METRONOME) {
        return this.metronomePlayer;
      } else if (this.part.partType === TYPE_MANTRA) {
        return this.mantraPlayer;
      } else if (this.part.partType === TYPE_GUIDED_SESSION) {
        return this.guidedSessionPlayer;
      } else if (this.part.partType === TYPE_HEARTBEAT) {
        return this.heartBeatPlayer;
      }
    }
    return null;
  }

  private reset() {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.totalMs = this.part ? this.part.getTime() * 1000 : 0;
    this.actualMs = 0;
    this.sliceTotalMs = this.part ? (this.part.sliceLength + this.part.sliceSpace) * 1000 : 0;
    this.sliceActualMs = 0;
    this.sliceCount = 0;
  }
}
