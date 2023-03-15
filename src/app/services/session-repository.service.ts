import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {SessionPart} from '../models/session-part.model';
import {SessionPartSilence} from '../models/session-part-silence.model';
import {SessionPartMetronome} from '../models/session-part-metronome.model';
import {SessionPartSeparator} from '../models/session-part-separator.model';
import {SessionPartMantra} from '../models/session-part-mantra.model';

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

    const part1 = new SessionPartSilence();
    part1.time = 3;
    session.parts.push(part1);

    const part2 = new SessionPartMetronome();
    part2.timeBased = false;
    part2.count = 5;
    part2.tickLength = 2;
    part2.tickSample = '110';
    session.parts.push(part2);

    session.parts.push(new SessionPartSeparator());

    const part4 = new SessionPartMantra();
    part4.count = 10;
    part4.soundTitle = 'Gayatri'
    session.parts.push(part4);

    session.parts.push(new SessionPartSeparator());
    
    const part5 = new SessionPartMetronome();
    part5.timeBased = true;
    part5.time = 10;
    part5.tickLength = 3;
    part5.tickSample = '1';
    session.parts.push(part5);

    return session;
  }
}