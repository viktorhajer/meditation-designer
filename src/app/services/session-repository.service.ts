import {Injectable} from '@angular/core';
import {Session} from '../models/session.model';
import {SessionPartSilence} from '../models/session-part-silence.model';
import {SessionPartMetronome} from '../models/session-part-metronome.model';
import {SessionPartSeparator} from '../models/session-part-separator.model';
import {SessionPartMantra} from '../models/session-part-mantra.model';

@Injectable({
  providedIn: 'root'
})
export class SessionRepository {

  getSession(): Session {
    const session = new Session();
    session.id = 1;
    session.title = 'Demo Session';
    session.description = 'This is a demo meditation session.';
    session.space = 2;
    session.parts = [];

    const part1 = new SessionPartSilence();
    part1.time = 3;
    part1.order = 1;
    session.parts.push(part1);

    const part2 = new SessionPartMetronome();
    part2.timeBased = false;
    part2.count = 5;
    part2.order = 2;
    part2.tickLength = 2;
    part2.tickSample = '110';
    session.parts.push(part2);

    const part3 = new SessionPartSeparator();
    part3.order = 3;
    session.parts.push(part3);

    const part4 = new SessionPartMantra();
    part4.order = 4;
    part4.count = 10;
    session.parts.push(part4);

    const part5 = new SessionPartSeparator();
    part3.order = 5;
    session.parts.push(part5);

    const part6 = new SessionPartSilence();
    part1.time = 5;
    part1.order = 6;
    session.parts.push(part6);
    session.parts.push(part6);
    session.parts.push(part6);

    return session;
  }
}