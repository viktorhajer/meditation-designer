import {Injectable} from '@angular/core';
import {SessionPart, TYPE_MANTRA, TYPE_METRONOME, TYPE_SEPARATOR} from '../models/session-part.model';
import {STATE_RUNNING, STATE_STOPPED} from "./session-repository.service";
import {LogService} from "./log.service";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  separatorPlayer: HTMLAudioElement = null as any;
  metronomePlayer: HTMLAudioElement = null as any;
  mantraPlayer: HTMLAudioElement = null as any;
  part: SessionPart = null as any;

  constructor(private readonly logger: LogService) {
  }

  init(separatorPlayer: HTMLAudioElement, metronomePlayer: HTMLAudioElement, mantraPlayer: HTMLAudioElement) {
    this.separatorPlayer = separatorPlayer;
    this.metronomePlayer = metronomePlayer;
    this.mantraPlayer = mantraPlayer;
    this.separatorPlayer.addEventListener('loadedmetadata', () => {
      this.logger.info('Separator sound loaded');
    });
  }

  setPart(part: SessionPart, state = STATE_STOPPED) {
    this.stop();
    this.part = part;
    this.logger.info(this.part ? 'Set part: ' + this.part.partType : 'Remove part');
    if (this.part?.partType === TYPE_MANTRA) {
      // TODO load mp3
      this.logger.info('Load mantra');
    }
    if (state === STATE_RUNNING) {
      this.play();
    }
  }

  play() {
    this.logger.info('Play: ' + this.part?.partType);
    this.getPlayer()?.play()
      .then(() => this.logger.info('Playing: ' + this.part?.partType))
      .catch(error => this.logger.error('Failed to play: ' + this.part?.partType + '-' + error));
  }

  pause() {
    this.logger.info('Pause: ' + this.part?.partType);
    this.getPlayer()?.pause();
  }

  stop() {
    const player = this.getPlayer();
    if (player) {
      this.logger.info('Stop: ' + this.part?.partType);
      player.pause();
      player.currentTime = 0;
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
      }
    }
    return null;
  }
}