import {Injectable} from '@angular/core';
import {
  SessionPart,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_SEPARATOR
} from '../models/session-part.model';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  separatorPlayer: HTMLAudioElement = null as any;
  metronomePlayer: HTMLAudioElement = null as any;
  mantraPlayer: HTMLAudioElement = null as any;
  
  part: SessionPart = null as any;

  init(separatorPlayer: HTMLAudioElement, metronomePlayer: HTMLAudioElement, mantraPlayer: HTMLAudioElement) {
    this.separatorPlayer = separatorPlayer;
    this.metronomePlayer = metronomePlayer;
    this.mantraPlayer = mantraPlayer;
    this.separatorPlayer.addEventListener('loadedmetadata', () => {
      console.log('done');
    });
  }
  
  setPart(part: SessionPart) {
    this.part = part;
    if (this.part.partType === TYPE_MANTRA) {
      console.log('mantra');
    }
  }
  
  play() {
  }
  
  pause() {
  }
  
  stop() {
  }
  
  private getPlayer(): HTMLAudioElement | null {
    if (this.part.partType === TYPE_SEPARATOR) {
      return this.separatorPlayer; 
    } else if (this.part.partType === TYPE_METRONOME) {
      return this.metronomePlayer; 
    } else if (this.part.partType === TYPE_MANTRA) {
      return this.mantraPlayer; 
    }
    return null;
  }
}