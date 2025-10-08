import {FileInfo} from './file-info';

export const DEFAULT_SILENCE = 3 * 60; // 3 mins
export const DEFAULT_METRONOME = 5 * 60; // 5 mins
export const DEFAULT_MANTRA_TIME = 10 * 60; // 10 mins
export const DEFAULT_MANTRA_COUNT = 108;
export const DEFAULT_LEFT_FREQ = 200; // Hz
export const DEFAULT_FREQ_LOW = 130; // Hz
export const DEFAULT_DIFF_FREQ_ISO = 4.5; // Hz
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

export const MAX_BASE_FREQUENCY = 1000; // Hz
export const MIN_BASE_FREQUENCY = 50; // Hz
export const MAX_BRAINWAVE_FREQUENCY = 40; // Hz
export const MIN_BRAINWAVE_FREQUENCY = 1; // Hz

export const TYPE_SEPARATOR = 'separator';
export const TYPE_SILENCE = 'silence';
export const TYPE_MANTRA = 'mantra';
export const TYPE_METRONOME = 'metronome';
export const TYPE_GUIDED_SESSION = 'guided session';
export const TYPE_BINAURAL_BEATS = 'binaural beats';
export const TYPE_HEARTBEAT = 'heart beat';
export const TYPE_POLYPHONIC_BB = 'polyphonic binaural beats';
export const TYPE_ISOCHRONIC_TONES = 'isochronic tones';
export const TYPES = [TYPE_SEPARATOR, TYPE_SILENCE, TYPE_METRONOME,
  TYPE_BINAURAL_BEATS, TYPE_POLYPHONIC_BB, TYPE_HEARTBEAT, TYPE_ISOCHRONIC_TONES, TYPE_MANTRA/*, TYPE_GUIDED_SESSION*/];

export const SEPARATORS: FileInfo[] = [
  {title: 'China Bell Ring', fileName: 'china-bell-ring.mp3', length: 4},
  {title: 'Singing Bowl 458g', fileName: 'Singing Bowl 458g.mp3', length: 8},
  {title: 'Singing Bowl 1029g', fileName: 'Singing Bowl 1029g.mp3', length: 15},
  {title: 'Singing Bowl 1466g', fileName: 'Singing Bowl 1466g.mp3', length: 17},
  {title: 'Singing Bowl 8003g', fileName: 'Singing Bowl 8003g.mp3', length: 25},
  {title: 'Singing Bowl Jhumka 2564g', fileName: 'Singing Bowl Jhumka 2564g.mp3', length: 21}
];

export const INTERPOLATION_LINEAR = 'Linear';
export const INTERPOLATION_EASE_IN = 'Ease In';
export const INTERPOLATION_EASE_OUT = 'Ease Out';
export const INTERPOLATION_EASE_IN_OUT = 'Ease In-Out';
export const INTERPOLATION_INTERMITTENT = 'Intermittent';

export const INTERPOLATIONS = [
  INTERPOLATION_LINEAR, INTERPOLATION_EASE_IN, INTERPOLATION_EASE_OUT, INTERPOLATION_EASE_IN_OUT, INTERPOLATION_INTERMITTENT
];

export const ADVANCED_BB_BINEURAL = 'Binaural Beat';
export const ADVANCED_BB_MONAURAL = 'Monaural Beat';
export const ADVANCED_BB_HORIZONTAL = 'Horizontal Modulation';
export const ADVANCED_BB_VERTICAL = 'Vertical Modulation';
export const ADVANCED_BB_VH = 'Vertical+Horizontal Modulation';
export const ADVANCED_BB_TYPES = [ADVANCED_BB_BINEURAL, ADVANCED_BB_MONAURAL,
  ADVANCED_BB_HORIZONTAL, ADVANCED_BB_VERTICAL, ADVANCED_BB_VH];

export const MANTRAS: FileInfo[] = [
  {title: 'China Bell Ring', fileName: 'china-bell-ring.mp3', length: 4}
];

export const GUIDED_SESSIONS: FileInfo[] = [
  {title: 'JME Meditation course 01-hu', fileName: 'JME Meditation course 01-hu.mp3', length: 2148}
];

export const SOLFEGGIO_SCALE = [
  {value: 174, name: 'Reduces pain, promotes physical safety (174)'},
  {value: 285, name: 'Heals tissues, restores energy balance (285)'},
  {value: 396, name: 'Liberates from fear and guilt (396)'},
  {value: 417, name: 'Facilitates change, cleanses negative energy (417)'},
  {value: 528, name: 'DNA repair, transformation, love frequency (528)'},
  {value: 639, name: 'Harmonizes relationships and communication (639)'},
  {value: 741, name: 'Awakens intuition, purifies mind and body (741)'},
  {value: 852, name: 'Raises awareness, returns to spiritual order (852)'},
  {value: 963, name: 'Connects with the divine consciousness, unity (963)'}
]; // Hz

export const BRAINWAVE_FREQUENCY_BANDS = [
  {value: 2, name: 'Delta: deep sleep, healing, unconscious mind (0.5 – 4 Hz)'},
  {value: 6, name: 'Theta: meditation, creativity, intuition, dream state (4 – 8 Hz)'},
  {value: 10, name: 'Alpha: relaxation, calm focus, light meditation (8 – 12 Hz)'},
  {value: 20, name: 'Beta: alertness, active thinking, problem-solving (12 – 30 Hz)'},
  {value: 40, name: 'Gamma: high-level cognition, peak awareness, integration (30 – 100 Hz)'}
];

export const FREQUENCY = 10; //ms
export const STATE_STOPPED = 0;
export const STATE_RUNNING = 1;
export const STATE_PAUSED = 2;
