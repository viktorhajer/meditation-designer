import {LogService} from './log.service';
import {SessionPart} from '../models/session-part.model';
import {FREQUENCY, STATE_PAUSED, STATE_RUNNING, STATE_STOPPED} from '../models/session.constant';


export abstract class AbstractOscillatorService {

  protected audioContext = new AudioContext();
  protected oscillators: { oscillator: OscillatorNode, gainNode: GainNode }[] = [];
  protected timeout = null as any;
  state = STATE_STOPPED;

  protected constructor(protected readonly logger: LogService) {
  }

  start(part: SessionPart) {
    this.init(part);
    this.reset();
    this.state = STATE_RUNNING;
    this.update();
  }

  pause() {
    if (this.state === STATE_RUNNING) {
      this.state = STATE_PAUSED;
      this.oscillators.forEach(osc => osc.oscillator.stop());
      this.oscillators = [];
    }
  }

  resume() {
    if (this.state === STATE_PAUSED) {
      this.state = STATE_RUNNING;
      this.setOscillators();
      this.timeout = setTimeout(() => this.clock(), FREQUENCY);
    }
  }

  protected abstract init(part: SessionPart): void;

  protected abstract update(): void;

  protected abstract reset(): void;

  protected abstract setOscillators(): void;

  protected abstract clock(): void;

  protected resetBasic(): void {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.state = STATE_STOPPED;
    this.oscillators.forEach(osc => osc.oscillator.stop());
    this.oscillators = [];
  }

  protected getPan(left = true): number {
    return left ? -1 : 1;
  }

  protected createThread(frequency: number, volume: number, left = true): {
    oscillator: OscillatorNode,
    gainNode: GainNode
  } {
    const oscillator = this.audioContext.createOscillator();
    const stereoNode = new StereoPannerNode(this.audioContext, {pan: 0});
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    stereoNode.pan.value = this.getPan(left);
    oscillator.connect(stereoNode).connect(gainNode).connect(this.audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    return {oscillator, gainNode};
  }
}