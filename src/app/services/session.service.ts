import {Injectable} from '@angular/core';
import {
  FREQUENCY,
  STATE_PAUSED,
  STATE_RUNNING,
  STATE_STOPPED,
  TYPE_BINAURAL_BEATS,
  TYPE_GUIDED_SESSION,
  TYPE_HEARTBEAT,
  TYPE_ISOCHRONIC_TONES,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_POLYPHONIC_BB,
  TYPE_SEPARATOR
} from '../models/session.constant';
import {LogService} from './log.service';
import {BehaviorSubject} from 'rxjs';
import {BinauralService} from './binaural.service';
import {PolyphonicBinauralService} from './polyphonic-binaural.service';
import {SessionComponent} from '../models/session-component.model';
import {IsochronicTonesService} from './isochronic-tones.service';
import {SessionUtil} from './session.util';
import {PeriodicalAudioService} from './periodical-audio.service';

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
  private part: SessionComponent = null as any;
  state = STATE_STOPPED;

  private totalMs = 0;
  private actualMs = 0;
  private timeout = null as any;

  private componentLoaded = false;
  componentFinished = new BehaviorSubject<boolean>(false);

  constructor(private readonly logger: LogService,
              private readonly periodicalAudioService: PeriodicalAudioService,
              private readonly binaural: BinauralService,
              private readonly polyphonicBinaural: PolyphonicBinauralService,
              private readonly isochronicTones: IsochronicTonesService) {
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
      if (this.part?.type === TYPE_SEPARATOR) {
        this.componentLoaded = true;
      }
    });
    this.guidedSessionPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Guided session sound loaded');
      if (this.part?.type === TYPE_GUIDED_SESSION) {
        this.componentLoaded = true;
      }
    });
    this.metronomePlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Metronome sound loaded');
    });
    this.mantraPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Mantra sound loaded');
      if (this.part?.type === TYPE_MANTRA) {
        this.componentLoaded = true;
      }
    });
    this.heartBeatPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Heart beat sound loaded');
    });
  }

  setPart(component: SessionComponent, next = false) {
    this.stop(component && next ? this.state : STATE_STOPPED);
    this.part = component;
    this.componentLoaded = false;
    this.logger.info(this.part ? 'Set component: ' + this.part.type : 'Remove component');

    if (this.part?.type === TYPE_SEPARATOR) {
      this.logger.info('Load separator: ' + this.part.fileName);
      this.separatorPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else if (this.part?.type === TYPE_MANTRA) {
      this.logger.info('Load mantra: ' + this.part.fileName);
      this.mantraPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else if (this.part?.type === TYPE_GUIDED_SESSION) {
      this.logger.info('Load guided session: ' + this.part.fileName);
      this.guidedSessionPlayer.src = SOUND_DIRECTORY + this.part.fileName;
    } else {
      this.componentLoaded = true;
    }

    this.reset();
    if (this.part && this.state === STATE_RUNNING && next) {
      this.play();
    }
  }

  play() {
    if (this.componentLoaded) {
      this.logger.info((this.state === STATE_PAUSED ? 'Resume: ' : 'Play: ') + this.part?.type);
      if (this.state === STATE_PAUSED ||
        (this.part.type !== TYPE_METRONOME && this.part.type !== TYPE_MANTRA && this.part.type !== TYPE_HEARTBEAT)) {
        this.playSound();
      }
      if (this.part.type === TYPE_BINAURAL_BEATS) {
        this.state === STATE_PAUSED ? this.binaural.resume() : this.binaural.start(this.part);
      } else if (this.part.type === TYPE_POLYPHONIC_BB) {
        this.state === STATE_PAUSED ? this.polyphonicBinaural.resume() : this.polyphonicBinaural.start(this.part);
      } else if (this.part.type === TYPE_ISOCHRONIC_TONES) {
        this.state === STATE_PAUSED ? this.isochronicTones.resume() : this.isochronicTones.start(this.part);
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
    this.logger.info('Pause: ' + this.part?.type);
    this.getPlayer()?.pause();
    if (this.part.type === TYPE_BINAURAL_BEATS) {
      this.binaural.pause();
    } else if (this.part.type === TYPE_POLYPHONIC_BB) {
      this.polyphonicBinaural.pause();
    } else if (this.part.type === TYPE_ISOCHRONIC_TONES) {
      this.isochronicTones.pause();
    }
  }

  stop(state = STATE_STOPPED) {
    this.state = state;
    const player = this.getPlayer();
    if (player) {
      this.logger.info('Stop: ' + this.part?.type);
      player.pause();
      player.currentTime = 0;
    }
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
      if (this.periodicalAudioService.process(this.part)) {
        this.playSound(true);
      }
      this.actualMs += FREQUENCY;
      if (this.totalMs - this.actualMs <= 0) {
        this.actualMs = 0;
        this.componentFinished.next(true);
      } else {
        this.timeout = setTimeout(() => this.clock(), FREQUENCY);
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
        .then(() => this.logger.info('Playing: ' + this.part?.type))
        .catch(error => this.logger.error('Failed to play: ' + this.part?.type + '-' + error));
    }
  }

  private getPlayer(): HTMLAudioElement | null {
    if (this.part) {
      switch (this.part.type) {
        case TYPE_SEPARATOR:
          return this.separatorPlayer;
        case TYPE_METRONOME:
          return this.metronomePlayer;
        case TYPE_MANTRA:
          return this.mantraPlayer;
        case TYPE_GUIDED_SESSION:
          return this.guidedSessionPlayer;
        case TYPE_HEARTBEAT:
          return this.heartBeatPlayer;
      }
    }
    return null;
  }

  private reset() {
    this.periodicalAudioService.reset(this.part);
    this.binaural.reset();
    this.polyphonicBinaural.reset();
    this.isochronicTones.reset();
    clearTimeout(this.timeout);
    this.timeout = null;
    this.totalMs = this.part ? SessionUtil.getSessionComponentTime(this.part) * 1000 : 0;
    this.actualMs = 0;
  }
}
