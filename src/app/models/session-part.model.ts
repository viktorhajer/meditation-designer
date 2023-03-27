export const DEFAULT_SILENCE = 3 * 60; // 3 mins
export const DEFAULT_METRONOME = 5 * 60; // 5 mins
export const DEFAULT_MANTRA_TIME = 10 * 60; // 10 mins
export const DEFAULT_MANTRA_COUNT = 108;

export const TYPE_SEPARATOR = 'separator';
export const TYPE_SILENCE = 'silence';
export const TYPE_MANTRA = 'mantra';
export const TYPE_METRONOME = 'metronome';
export const TYPES = [TYPE_SEPARATOR, TYPE_SILENCE, TYPE_MANTRA, TYPE_METRONOME];
export const SEPARATORS = [
  {name: 'China Bell Ring', fileName: 'china-bell-ring', time: 4}
];

export class SessionPart {
  id = Date.now() + '-' + Math.floor(Math.random() * 1000);
  partType = '';
  time = 0;
  timeBased = true;
  count = 0;
  sliceLength = 1; // secs
  sliceSpace = 0; // secs
  fileName = '';

  // Mantra
  mantraTitle = '';
  mantraName = '';
  mantraGroup = 1;
  mantraGroupSpace = 1;

  // Separator
  separatorName = '';

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
      return this.mantraTitle + ' ' + (this.timeBased ? '' : this.count + '');
    } else if (this.partType === TYPE_SEPARATOR) {
      return this.separatorName;
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
