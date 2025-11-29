import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrusel-inicio',
  templateUrl: './carrusel-inicio.component.html',
  styleUrl: './carrusel-inicio.component.css'
})
export class CarruselInicioComponent implements OnInit, OnDestroy{
  currentIndex = 0;

  images = [
    'assets/carousel/carousel-1.svg',
    'assets/carousel/carousel-2.svg',
    'assets/carousel/carousel-3.svg'
  ];

  intervalId: any;
  intervalTime = 4000; // 4 segundos

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, this.intervalTime);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.restartTimer();
  }

  prev() {
    this.currentIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
      this.restartTimer();
  }

  restartTimer() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
