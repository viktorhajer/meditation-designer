import {Component, ViewChild} from '@angular/core';
import {SessionComponent} from './components/session.component';
import {SessionRepository} from './services/session-repository.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sessionRef') sessionComponent: SessionComponent = null as any;
  timeRemains = 0;
  editActive = false;

  constructor(public readonly repository: SessionRepository) {
  }

  newPart() {
    this.editActive = !this.editActive;
  }

  reset() {
    this.sessionComponent.reset();
  }
}
