export class SessionComponent {
  partType = '';
  timeBased = true;
  time = 0;
  count = 0;
  sliceLength = 1; // secs
  sliceSpace = 0; // secs
  fileTitle = '';
  fileName = '';
  value1 = 0; // mantra: mantraGroup, oscillator: base
  value2 = 0; // mantra: mantraGroupSpace, oscillator: diff1, pulse
  value3 = 0; // oscillator: diff2
  valueStr = ''; // oscillator: description, interpolation mode
  valueStr2 = ''; // oscillator: advanced
}
