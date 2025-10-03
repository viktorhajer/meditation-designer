import {Injectable} from '@angular/core';

const VOLUME = 0.8;

@Injectable({
  providedIn: 'root'
})
export class BinauralService {

  private oscillatorLeft: OscillatorNode | undefined;
  private oscillatorRight: OscillatorNode | undefined;

  start(freqLeft: number, freqRight: number) {
    this.startSound(freqRight, false);
    this.startSound(freqLeft, true);
  }

  stop() {
    if (this.oscillatorLeft) {
      (this.oscillatorLeft as OscillatorNode).stop();
    }
    if (this.oscillatorRight) {
      (this.oscillatorRight as OscillatorNode).stop();
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