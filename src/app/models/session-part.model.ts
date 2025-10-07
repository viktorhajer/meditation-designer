import {
  TYPE_BINAURAL_BEATS,
  TYPE_GUIDED_SESSION, TYPE_HEARTBEAT, TYPE_ISOCHRONIC_TONES,
  TYPE_MANTRA,
  TYPE_METRONOME,
  TYPE_SEPARATOR
} from './session.constant';

export class SessionPart {
  id = Date.now() + '-' + Math.floor(Math.random() * 1000);
  partType = '';
  time = 0;
  timeBased = true;
  count = 0;
  sliceLength = 1; // secs
  sliceSpace = 0; // secs
  name = '';
  fileName = '';
  value1 = 0;
  value2 = 0;
  value3 = 0;
  valueStr = '';
  valueStr2 = '';

  // Mantra
  mantraGroup = 1;
  mantraGroupSpace = 1;

  get title(): string {
    return this.partType.charAt(0).toUpperCase() + this.partType.slice(1);
  }

  getTime(): number {
    return this.timeBased ? this.time : this.calculateTimeByCount();
  }

  getInfo(): string {
    if (this.partType === TYPE_METRONOME) {
      return this.sliceLength + ' secs';
    } else if (this.partType === TYPE_MANTRA) {
      return this.name + ' ' + (this.timeBased ? '' : this.count + '');
    } else if (this.partType === TYPE_SEPARATOR || this.partType === TYPE_GUIDED_SESSION) {
      return this.name;
    } else if (this.partType === TYPE_BINAURAL_BEATS) {
      return this.value1 + ' Hz (' + this.value2 + '-' + this.value3 + ' Hz)';
    } else if (this.partType === TYPE_ISOCHRONIC_TONES) {
      return this.value1 + ' Hz / ' + this.value2 + ' Hz';
    } else if (this.partType === TYPE_HEARTBEAT) {
      return this.value1 + ' BPM';
    }
    return this.timeBased ? '' : this.count + '';
  }

  private calculateTimeByCount(): number {
    if (this.partType === TYPE_METRONOME || (this.partType === TYPE_MANTRA && this.mantraGroup <= 1)) {
      return this.count * (this.sliceLength + this.sliceSpace);
    } else if (this.partType === TYPE_MANTRA && this.mantraGroup > 1) {
      const groupNumber = Math.floor(this.count / this.mantraGroup);
      return this.count * (this.sliceLength + this.sliceSpace) + groupNumber * this.mantraGroupSpace;
    }
    return this.count;
  }
}
