export const DEFAULT_SEPARATOR = 2;
export const DEFAULT_SILENCE = 3 * 60; // 3 mins
export const DEFAULT_METRONOME = 5 * 60; // 5 mins
export const DEFAULT_MANTRA_TIME = 10 * 60; // 10 mins
export const DEFAULT_MANTRA_COUNT = 108;

export const TYPE_SEPARATOR = 'separator';
export const TYPE_SILENCE= 'silence';
export const TYPE_MANTRA = 'mantra';
export const TYPE_METRONOME = 'metronome';

export class SessionPart {
  id = Date.now() + '-' + Math.floor(Math.random() * 1000);
  partType = '';
  time = 0;
  timeBased = true;
  count = 0;

  // Mantra
  mantraTitle = '';
  mantraFileName = '';
  mantraTime = 0;
  mantraGroup = 1;

  // Metronome
  tickLength = 1; //mp
  tickSample = '1'; // e.g. 1101

  get title(): string {
    return this.partType.charAt(0).toUpperCase() + this.partType.slice(1);
  }

  getTime(): number {
    return this.timeBased ? this.time : this.calculateTimeByCount();
  }

  getInfo(): string {
    if (this.partType === TYPE_METRONOME) {
      return this.tickLength + 'mp' + (this.tickSample !== '1' ? ': ' + this.tickSample : '');
    } else if (this.partType === TYPE_MANTRA) {
      return this.mantraTitle + ' ' + (this.timeBased ? '' : this.count + '');
    }
    return this.timeBased ? '' : this.count + '';
  }

  private calculateTimeByCount(): number {
    if (this.partType === TYPE_METRONOME) {
      return this.count * this.tickLength * this.tickSample.length;
    } else if (this.partType === TYPE_MANTRA) {
      return this.count * this.mantraTime; // TODO length - space...
    }
    return this.count;
  }
}
