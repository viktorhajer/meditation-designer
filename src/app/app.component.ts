import {Component, ViewChild} from '@angular/core';
import {SessionComponent} from './components/session.component';
import {SessionRepository} from './services/session-repository.service';
import {TYPE_SEPARATOR} from "./models/session-part.model";

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

  isEditDisabled(): boolean {
    return this.repository.getSelectedPart().partType === TYPE_SEPARATOR;
  }

  newPart() {
    this.createNew = true;
    this.editActive = true;
  }

  editPart() {
    this.repository.stop();
    this.createNew = false;
    this.editActive = true;
  }

  updatePart() {
    this.editActive = false;
  }
}
