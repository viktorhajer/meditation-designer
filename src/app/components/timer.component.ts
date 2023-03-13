import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

export const REST = 0;
export const RUNNING = 1;
export const WAITING = 2;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnChanges {
  @Input() time: number = 0;
  @Input() state: number = 0;
  @Output() finish = new EventEmitter();

  actual = 0;

  ngOnChanges() {
    if (this.state === 1) {
      this.start();
    } else if (this.state === 0) {
      this.actual = 0;
    }
  }

  private start() {
    if (this.state === 1) {
      this.actual++;
      if (this.time - this.actual <= 0) {
        this.actual = 0;
        this.state = 0;
        this.finish.emit();
      } else {
        setTimeout(() => this.start(), 1000);
      }
    }
  }

}
