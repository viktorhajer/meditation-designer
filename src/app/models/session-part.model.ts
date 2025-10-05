export const DEFAULT_SILENCE = 3 * 60; // 3 mins
export const DEFAULT_METRONOME = 5 * 60; // 5 mins
export const DEFAULT_MANTRA_TIME = 10 * 60; // 10 mins
export const DEFAULT_MANTRA_COUNT = 108;
export const DEFAULT_LEFT_FREQ = 200; // Hz
export const DEFAULT_DIFF_FREQ_BETA = 14; // Hz
export const DEFAULT_DIFF_FREQ_THETA = 6; // Hz
export const DEFAULT_HEAT_BEAT = 40; // BPM
export const DEFAULT_POLYPHONIC_BB_DESCRIPTION =
  '240[450-458-L],' +                       // Ráhangolódás
  '300[450-458-L|300-305-M],' +             // Lemerülés: Alfa (8Hz), Theta (5Hz)
  '480[450-458-L|300-305-M|230-232-M],' +   // Mély meditáció: Alfa (8Hz), Theta (5Hz), Delta (1Hz)
  '480[450-457-L|300-304-M|230-231-M],' +   // Mély meditáció: Alfa (8Hz), Theta (4Hz), Delta (1Hz)
  '300[450-458-L|300-304-M],' +             // Lemerülés: Alfa (8Hz), Theta (5Hz)
  '180[450-458-L]';                         // Visszatérés

export const TYPE_SEPARATOR = 'separator';
export const TYPE_SILENCE = 'silence';
export const TYPE_MANTRA = 'mantra';
export const TYPE_METRONOME = 'metronome';
export const TYPE_GUIDED_SESSION = 'guided session';
export const TYPE_BINAURAL_BEATS = 'binaural beats';
export const TYPE_HEARTBEAT = 'heart beat';
export const TYPE_POLYPHONIC_BB = 'polyphonic binaural beats';
export const TYPES = [TYPE_SEPARATOR, TYPE_SILENCE, TYPE_METRONOME,
  TYPE_BINAURAL_BEATS, TYPE_POLYPHONIC_BB, TYPE_HEARTBEAT/*, TYPE_MANTRA, TYPE_GUIDED_SESSION */];

export const SEPARATORS = [
  {name: 'China Bell Ring', fileName: 'china-bell-ring.mp3', time: 4},
  {name: 'Singing Bowl 458g', fileName: 'Singing Bowl 458g.mp3', time: 8},
  {name: 'Singing Bowl 1029g', fileName: 'Singing Bowl 1029g.mp3', time: 15},
  {name: 'Singing Bowl 1466g', fileName: 'Singing Bowl 1466g.mp3', time: 17},
  {name: 'Singing Bowl 8003g', fileName: 'Singing Bowl 8003g.mp3', time: 25},
  {name: 'Singing Bowl Jhumka 2564g', fileName: 'Singing Bowl Jhumka 2564g.mp3', time: 21}
];

export const INTERPOLATION_LINEAR = 'Linear';
export const INTERPOLATION_EASE_IN = 'Ease In';
export const INTERPOLATION_EASE_OUT = 'Ease Out';
export const INTERPOLATION_EASE_IN_OUT = 'Ease In-Out';
export const INTERPOLATION_INTERMITTENT = 'Intermittent';

export const INTERPOLATIONS = [
  INTERPOLATION_LINEAR, INTERPOLATION_EASE_IN, INTERPOLATION_EASE_OUT, INTERPOLATION_EASE_IN_OUT, INTERPOLATION_INTERMITTENT
];

export const MANTRAS = [
  {name: 'China Bell Ring', fileName: 'china-bell-ring.mp3', time: 4}
];

export const GUIDED_SESSIONS = [
  {name: 'JME Meditation course 01-hu', fileName: 'JME Meditation course 01-hu.mp3', time: 2148}
];

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
