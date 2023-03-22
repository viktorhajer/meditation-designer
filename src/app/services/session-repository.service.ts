import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {DEFAULT_SEPARATOR, SessionPart} from '../models/session-part.model';
import {SessionService} from './session.service';
import {LogService} from './log.service';

@Injectable({
  providedIn: 'root'
})
export class SessionRepository {
  index = -1;
  session: Session;

  constructor(private readonly logger: LogService, private readonly sessionService: SessionService) {
    this.session = this.buildDemo();
    this.sessionService.partFinished.subscribe(r => r ? this.next() : {});
  }

  isSelected() {
    return this.index !== -1;
  }

  select(index: number) {
    if (this.index === index) {
      this.logger.info('Deselect part');
      this.index = -1;
      this.sessionService.setPart(null as any);
    } else {
      this.logger.info('Select part: ' + this.session.parts[index]?.partType);
      this.index = index;
      this.sessionService.setPart(this.session.parts[this.index]);
    }
  }

  getSelectedPart(): SessionPart {
    return this.session.parts[this.index];
  }

  next() {
    this.index = this.index < (this.session.parts.length - 1) ? (this.index + 1) : 0;
    this.logger.info('Next part: ' + this.session.parts[this.index]?.partType);
    this.sessionService.setPart(this.session.parts[this.index]);
    if (this.index === 0) {
      this.logger.info('Queue finished');
      this.sessionService.stop();
    }
  }

  remove() {
    if (!this.sessionService.isStopped() && this.index >= 0 && this.index < this.session.parts.length) {
      this.session.parts.splice(this.index, 1);
      this.index = -1;
      this.sessionService.stop();
    }
  }

  move(index: number, direction = 0) {
    const part1 = this.session.parts[index];
    if (this.sessionService.isRunning()) {
      this.sessionService.pause();
    }
    let part2 = this.session.parts[index + 1];
    if (direction === 1 && (index + 1) < this.session.parts.length) {
      this.session.parts[index] = part2;
      this.session.parts[index + 1] = part1;
      this.index = index + 1;
    } else if (direction === 0 && (index - 1) >= 0) {
      part2 = this.session.parts[index - 1];
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
    part2.tickSample = '1';
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
    part4.mantraTitle = 'Gayatri';
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
    part6.timeBased = false;
    part6.time = 10;
    part6.count = 3;
    part6.tickLength = 3;
    part6.tickSample = '1';
    session.parts.push(part6);

    return session;
  }
}