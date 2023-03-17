import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {STATE_STOPPED} from "../services/session-repository.service";

export const REST = 0;
export const RUNNING = 1;
export const WAITING = 2;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnChanges {
  @Input() time = 0;
  @Input() state = STATE_STOPPED;
  @Input() selected = false;
  @Output() finish = new EventEmitter();
  @Output() clock = new EventEmitter();

  actual = 0;
  timeout = 0;

  ngOnChanges() {
    if (this.state === 1) {
      setTimeout(() => this.start(), 100);
    } else if (this.state === 0) {
      this.actual = 0;
      clearTimeout(this.timeout);
    }
  }

  private start() {
    if (this.state === 1) {
      this.actual++;
      this.clock.emit(this.time - this.actual);
      if (this.time - this.actual <= 0) {
        this.actual = 0;
        this.state = 0;
        this.finish.emit();
      } else {
        this.timeout = setTimeout(() => this.start(), 1000);
      }
    }
  }

}
