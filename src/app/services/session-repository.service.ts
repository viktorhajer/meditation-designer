import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {DEFAULT_SEPARATOR, SessionPart} from '../models/session-part.model';

@Injectable({
  providedIn: 'root'
})
export class SessionRepository {
  timeRemains = 0;
  index = 0;
  session: Session;

  constructor() {
    this.session = this.buildDemo();
  }

  getSelectedPart(): SessionPart {
    return this.session.parts[this.index];
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
    part4.mantraTime = 2;
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