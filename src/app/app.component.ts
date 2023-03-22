import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {SessionComponent} from './components/session.component';
import {SessionRepository} from './services/session-repository.service';
import {SessionService} from './services/session.service';
import {TYPE_SEPARATOR} from "./models/session-part.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('separatorAudioElement') separatorAudioElementRef: ElementRef = null as any;
  @ViewChild('metronomeAudioElement') metronomeAudioElementRef: ElementRef = null as any;
  @ViewChild('mantraAudioElement') mantraAudioElementRef: ElementRef = null as any;
  @ViewChild('sessionRef') sessionComponent: SessionComponent = null as any;
  

  editActive = false;
  createNew = true;

  constructor(public readonly repository: SessionRepository,
              public readonly sessionService: SessionService) {
  }
  
  ngAfterViewInit() {
    this.sessionService.init(this.separatorAudioElementRef.nativeElement as HTMLAudioElement,
        this.metronomeAudioElementRef.nativeElement as HTMLAudioElement,
        this.mantraAudioElementRef.nativeElement as HTMLAudioElement);
  }

  isEditDisabled(): boolean {
    return this.repository.getSelectedPart().partType === TYPE_SEPARATOR;
  }

  newPart() {
    this.createNew = true;
    this.editActive = true;
  }

  editPart() {
    this.sessionService.stop();
    this.createNew = false;
    this.editActive = true;
  }

  updatePart() {
    this.editActive = false;
  }
}
