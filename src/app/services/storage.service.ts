import {Injectable} from '@angular/core';

const STORAGE_PREFIX = 'md_';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  hasItem(key: string): boolean {
    return !!this.getItem(key);
  }

  getItem(key: string): string | null {
    return this.storage.getItem(STORAGE_PREFIX + key);
  }

  setItem(key: string, value: string) {
    this.storage.setItem(STORAGE_PREFIX + key, value);
  }
}
