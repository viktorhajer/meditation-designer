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
    part1.partType = TYPE_SILENCE;
    part1.timeBased = true;
    session.parts.push(part1);

    const part2 = new SessionPart();
    part2.partType = TYPE_METRONOME;
    part2.timeBased = false;
    part2.count = 5;
    part2.sliceLength = 2;
    session.parts.push(part2);

    const part3 = new SessionPart();
    part3.partType = TYPE_SEPARATOR;
    part3.time = SEPARATORS[0].time;
    part3.fileName = SEPARATORS[0].fileName;
    part3.name = SEPARATORS[0].name;
    part3.timeBased = true;
    session.parts.push(part3);

    const part4 = new SessionPart();
    part4.partType = TYPE_MANTRA;
    part4.timeBased = false;
    part4.count = 4;
    part4.sliceLength = MANTRAS[0].time;
    part4.sliceSpace = 0;
    part4.time = DEFAULT_MANTRA_TIME;
    part4.fileName = MANTRAS[0].fileName;
    part4.name = MANTRAS[0].name;
    part4.mantraGroup = 2;
    part4.mantraGroupSpace = 3;
    session.parts.push(part4);

    const part5 = new SessionPart();
    part5.partType = TYPE_GUIDED_SESSION;
    part5.time = GUIDED_SESSIONS[0].time;
    part5.fileName = GUIDED_SESSIONS[0].fileName;
    part5.name = GUIDED_SESSIONS[0].name;
    part5.timeBased = true;
    session.parts.push(part5);

    const part6 = new SessionPart();
    part6.partType = TYPE_METRONOME;
    part6.timeBased = false;
    part6.time = 10;
    part6.count = 3;
    part6.sliceLength = 3;
    session.parts.push(part6);

    return session;
  }
}