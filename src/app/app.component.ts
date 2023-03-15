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
  createNew = true;

  constructor(public readonly repository: SessionRepository) {
  }

  newPart() {
    this.createNew = true;
    this.editActive = true;
  }
  
  editPart() {
    if(this.sessionComponent.state !== 0) {
      this.createNew = false;
      this.editActive = true;
    }
  }
  
  removePart() {
    if (this.sessionComponent.state !== 0 && this.repository.index >= 0 && this.repository.index < this.repository.session.parts.length) {
      this.repository.session.parts.splice(this.repository.index, 1);
      this.repository.index = 0;
      this.sessionComponent.state = 0;
    }
  }
  
  updatePart() {
    this.editActive = false;
  }

  reset() {
    this.sessionComponent.reset();
  }
}
