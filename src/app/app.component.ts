import {Component, ViewChild} from '@angular/core';
import {SessionComponent} from "./components/session.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sessionRef') sessionComponent: SessionComponent = null as any;

  reset() {
    this.sessionComponent.reset();
  }

}
