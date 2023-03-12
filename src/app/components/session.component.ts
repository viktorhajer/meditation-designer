import {Component} from '@angular/core';
import {SessionRepository} from '../services/session-repository.service';
import {Session} from '../models/session.model';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent {

  session: Session;

  constructor(private readonly repository: SessionRepository) {
    this.session = this.repository.getSession();
  }
}
