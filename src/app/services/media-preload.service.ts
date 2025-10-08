import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MediaPreloadService {

  preload() {
    const images = [
      './assets/images/add.png',
      './assets/images/arrow_order.png',
      './assets/images/binaural beats.png',
      './assets/images/cancel.png',
      './assets/images/edit.png',
      './assets/images/guided session.png',
      './assets/images/heart beat.png',
      './assets/images/load.png',
      './assets/images/mantra.png',
      './assets/images/metronome.png',
      './assets/images/ok.png',
      './assets/images/pause.png',
      './assets/images/play.png',
      './assets/images/remove.png',
      './assets/images/save.png',
      './assets/images/separator.png',
      './assets/images/silence.png',
      './assets/images/stop.png'
    ];
    const sounds = [
      './assets/sounds/heart-beat.mp3',
      './assets/sounds/china-bell-ring.mp3',
      './assets/sounds/metronome.mp3'
    ];

    this.processImages(images);
    this.processSounds(sounds);
  }

  private processImages(list: string[]) {
    list.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  private processSounds(list: string[]) {
    list.forEach(src => {
      const audio = new Audio();
      audio.src = src;
      audio.load();
    });
  }
}
