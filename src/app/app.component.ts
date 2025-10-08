import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {SessionComponent} from './components/session.component';
import {SessionRepository} from './services/session-repository.service';
import {SessionService} from './services/session.service';
import {MediaPreloadService} from './services/media-preload.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements AfterViewInit {
  @ViewChild('separatorAudioElement') separatorAudioElementRef: ElementRef = null as any;
  @ViewChild('guidedSessionAudioElement') guidedSessionAudioElementRef: ElementRef = null as any;
  @ViewChild('metronomeAudioElement') metronomeAudioElementRef: ElementRef = null as any;
  @ViewChild('heartAudioElement') heartAudioElementRef: ElementRef = null as any;
  @ViewChild('mantraAudioElement') mantraAudioElementRef: ElementRef = null as any;
  @ViewChild('sessionRef') sessionComponent: SessionComponent = null as any;

  editActive = false;
  createNew = true;

  constructor(private readonly preloadService: MediaPreloadService,
              public readonly repository: SessionRepository,
              public readonly sessionService: SessionService) {
  }

  ngAfterViewInit() {
    this.preloadService.preload();
    this.sessionService.init(this.separatorAudioElementRef.nativeElement as HTMLAudioElement,
      this.metronomeAudioElementRef.nativeElement as HTMLAudioElement,
      this.mantraAudioElementRef.nativeElement as HTMLAudioElement,
      this.guidedSessionAudioElementRef.nativeElement as HTMLAudioElement,
      this.heartAudioElementRef.nativeElement as HTMLAudioElement);
  }

  play() {
    if (!this.repository.isSelected()) {
      this.repository.select(0);
    }
    this.sessionService.play();
  }

  newPart() {
    this.createNew = true;
    this.editActive = true;
  }

  editPart() {
    if (this.repository.isSelected()) {
      this.sessionService.stop();
      this.createNew = false;
      this.editActive = true;
    }
  }

  updatePart() {
    this.editActive = false;
    this.sessionService.setPart(this.repository.getSelectedPart());
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === '+') {
      this.newPart();
    } else if (event.key === 'Delete') {
      this.repository.remove();
    }
  }
}
