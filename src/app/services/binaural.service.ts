import {Injectable} from '@angular/core';
import {DEFAULT_DIFF_FREQ_BETA} from '../models/session-part.model';

const VOLUME = 0.8;

@Injectable({
  providedIn: 'root'
})
export class BinauralService {

  difference = DEFAULT_DIFF_FREQ_BETA;
  private oscillatorLeft: OscillatorNode | undefined;
  private oscillatorRight: OscillatorNode | undefined;

  start(base: number, difference: number) {
    this.difference = difference;
    this.stop();
    this.startSound(base + difference, false);
    this.startSound(base, true);
  }

  stop() {
    if (this.oscillatorLeft) {
      (this.oscillatorLeft as OscillatorNode).stop();
    }
    if (this.oscillatorRight) {
      (this.oscillatorRight as OscillatorNode).stop();
    }
  }

  changeRight(base: number, difference: number) {
    if (this.oscillatorRight?.frequency) {
      this.oscillatorRight.frequency.value = base + difference;
    }
  }

  private startSound(frequency: number, left = true) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const stereoNode = new StereoPannerNode(context, {pan: 0});
    const gainNode = context.createGain();
    gainNode.gain.value = VOLUME;
    stereoNode.pan.value = left ? -1 : 1;
    oscillator.connect(stereoNode).connect(gainNode).connect(context.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    if (left) {
      this.oscillatorLeft = oscillator;
    } else {
      this.oscillatorRight = oscillator;
    }
  }
}