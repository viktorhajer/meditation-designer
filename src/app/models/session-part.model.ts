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
}
