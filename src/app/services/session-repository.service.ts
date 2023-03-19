import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {DEFAULT_SEPARATOR, SessionPart} from '../models/session-part.model';
import {SoundService} from './sound.service';

export const STATE_STOPPED = 0;
export const STATE_RUNNING = 1;
export const STATE_PAUSED = 2;

@Injectable({
  providedIn: 'root'
})
export class SessionRepository {
  timeRemains = 0;
  index = -1;
  state = 0;
  session: Session;

  constructor(private readonly soundService: SoundService) {
    this.session = this.buildDemo();
  }

  isSelected() {
    return this.index !== -1;
  }

  isRunning(): boolean {
    return this.state === STATE_RUNNING;
  }

  isPaused(): boolean {
    return this.state === 2;
  }

  isStopped(): boolean {
    return this.state === STATE_STOPPED;
  }

  select(index: number) {
    if (this.index === index) {
      this.index = -1;
      this.soundService.setPart(null as any);
    } else {
      this.index = index;
      this.soundService.setPart(this.session.parts[this.index]);
    }
    this.stop();
  }

  getSelectedPart(): SessionPart {
    return this.session.parts[this.index];
  }

  pause() {
    this.state = 2;
    this.soundService.pause();
  }

  play() {
    if (this.isSelected()) {
      this.state = STATE_RUNNING;
      this.soundService.play();
    }
  }

  stop() {
    this.state = STATE_STOPPED;
    this.soundService.stop();
  }

  next() {
    this.index = this.index < (this.session.parts.length - 1) ? (this.index + 1) : 0
    if (this.index === 0) {
      this.stop();
    }
  }

  remove() {
    if (this.state !== 0 && this.index >= 0 && this.index < this.session.parts.length) {
      this.session.parts.splice(this.index, 1);
      this.index = -1;
      this.stop();
    }
  }

  move(index: number, direction = 0) {
    const part1 = this.session.parts[index];
    this.state = this.state === STATE_RUNNING ? STATE_PAUSED : this.state;
    if (direction === 1 && (index + 1) < this.session.parts.length) {
      const part2 = this.session.parts[index + 1];
      this.session.parts[index] = part2;
      this.session.parts[index + 1] = part1;
      this.index = index + 1;
    } else if (direction === 0 && (index - 1) >= 0) {
      const part2 = this.session.parts[index - 1];
      this.session.parts[index] = part2;
      this.session.parts[index - 1] = part1;
      this.index = index - 1;
    }
  }

  private buildDemo(): Session {
    const session = new Session();
    session.title = 'Demo Session';
    session.description = 'This is a demo meditation session.';
    session.space = 2;
    session.parts = [];

    const part1 = new SessionPart();
    part1.time = 3;
    part1.partType = 'silence';
    part1.timeBased = true;
    session.parts.push(part1);

    const part2 = new SessionPart();
    part2.partType = 'metronome';
    part2.timeBased = false;
    part2.count = 5;
    part2.tickLength = 2;
    part2.tickSample = '110';
    session.parts.push(part2);

    const part3 = new SessionPart();
    part3.partType = 'separator';
    part3.time = DEFAULT_SEPARATOR;
    part3.timeBased = true;
    session.parts.push(part3);

    const part4 = new SessionPart();
    part4.partType = 'mantra';
    part4.timeBased = false;
    part4.count = 10;
    part4.mantraTitle = 'Gayatri'
    part4.mantraLength = 2;
    part4.mantraSpace = 2;
    session.parts.push(part4);

    const part5 = new SessionPart();
    part5.partType = 'separator';
    part5.time = DEFAULT_SEPARATOR;
    part5.timeBased = true;
    session.parts.push(part5);

    const part6 = new SessionPart();
    part6.partType = 'metronome';
    part6.timeBased = true;
    part6.time = 10;
    part6.tickLength = 3;
    part6.tickSample = '1';
    session.parts.push(part6);

    return session;
  }
}