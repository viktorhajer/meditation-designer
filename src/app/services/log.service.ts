import {Injectable} from '@angular/core';

const LEVEL_INFO = 0;
const LEVEL_WARNING = 1;
const LEVEL_ERROR = 2;

@Injectable({
  providedIn: 'root'
})
export class LogService {

  info(message: string) {
    this.writeLog(message, LEVEL_INFO);
  }

  warn(message: string) {
    this.writeLog(message, LEVEL_WARNING);
  }

  error(message: string) {
    this.writeLog(message, LEVEL_ERROR);
  }

  private writeLog(message: string, level: number) {
    const marker = level === LEVEL_INFO ? 'I' : level === LEVEL_ERROR ? 'E' : 'W';
    console.log(`[${marker}] ${message}`);
  }
}