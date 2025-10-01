import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {
  DEFAULT_MANTRA_TIME, GUIDED_SESSIONS,
  MANTRAS,
  SEPARATORS,
  SessionPart, TYPE_GUIDED_SESSION,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_SEPARATOR, TYPE_SILENCE
} from '../models/session-part.model';
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
    this.sessionService.setPart(this.session.parts[this.index], true);
    if (this.index === 0) {
      this.logger.info('Queue finished');
      this.sessionService.stop();
    }
  }

  remove() {
    if (this.index >= 0 && this.index < this.session.parts.length) {
      if (!this.sessionService.isStopped()) {
        this.sessionService.stop();
      }
      this.session.parts.splice(this.index, 1);
      this.index = -1;
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
    part1.time = 120;
    part1.partType = TYPE_SILENCE;
    part1.timeBased = true;
    session.parts.push(part1);

    const sepa = new SessionPart();
    sepa.partType = TYPE_SEPARATOR;
    sepa.time = SEPARATORS[0].time;
    sepa.fileName = SEPARATORS[0].fileName;
    sepa.name = SEPARATORS[0].name;
    sepa.timeBased = true;
    session.parts.push(sepa);

    const part2 = new SessionPart();
    part2.time = 150;
    part2.partType = TYPE_SILENCE;
    part2.timeBased = true;
    session.parts.push(part2);

    session.parts.push(sepa);

    const part3 = new SessionPart();
    part3.time = 1200;
    part3.partType = TYPE_SILENCE;
    part3.timeBased = true;
    session.parts.push(part3);

    session.parts.push(sepa);

    return session;
  }
}