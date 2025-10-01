import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'timeformat',
    standalone: false
})
export class DatePipe implements PipeTransform {
  static formatTime(time: number): string {
    if (!time) {
      return '00:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return this.formatTimePart(minutes) + ':' + this.formatTimePart(seconds);
  }

  private static formatTimePart(value: number): string {
    return (value >= 10 ? '' : '0') + value;
  }

  transform(value: number): string {
    return DatePipe.formatTime(value);
  }
}
