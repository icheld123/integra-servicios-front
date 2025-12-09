import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CarruselInicioComponent } from './carrusel-inicio.component';

describe('CarruselInicioComponent', () => {
  let component: CarruselInicioComponent;
  let fixture: ComponentFixture<CarruselInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarruselInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any intervals to prevent test pollution
    component.stopAutoSlide();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentIndex).toBe(0);
    expect(component.images.length).toBe(3);
    expect(component.intervalTime).toBe(4000);
  });

  it('should have correct images array', () => {
    const expectedImages = [
      'assets/carousel/carousel-1.svg',
      'assets/carousel/carousel-2.svg',
      'assets/carousel/carousel-3.svg'
    ];
    expect(component.images).toEqual(expectedImages);
  });

  it('should start auto slide on init', () => {
    spyOn(component, 'startAutoSlide');
    component.ngOnInit();
    expect(component.startAutoSlide).toHaveBeenCalled();
  });

  it('should stop auto slide on destroy', () => {
    spyOn(component, 'stopAutoSlide');
    component.ngOnDestroy();
    expect(component.stopAutoSlide).toHaveBeenCalled();
  });

  it('should move to next image', () => {
    component.currentIndex = 0;
    component.next();
    expect(component.currentIndex).toBe(1);
    
    component.currentIndex = 1;
    component.next();
    expect(component.currentIndex).toBe(2);
  });

  it('should wrap to first image when at last image', () => {
    component.currentIndex = 2; // Last image
    component.next();
    expect(component.currentIndex).toBe(0);
  });

  it('should move to previous image', () => {
    component.currentIndex = 2;
    component.prev();
    expect(component.currentIndex).toBe(1);
    
    component.currentIndex = 1;
    component.prev();
    expect(component.currentIndex).toBe(0);
  });

  it('should wrap to last image when at first image', () => {
    component.currentIndex = 0; // First image
    component.prev();
    expect(component.currentIndex).toBe(2);
  });

  it('should restart timer on next', () => {
    spyOn(component, 'restartTimer');
    component.next();
    expect(component.restartTimer).toHaveBeenCalled();
  });

  it('should restart timer on prev', () => {
    spyOn(component, 'restartTimer');
    component.prev();
    expect(component.restartTimer).toHaveBeenCalled();
  });

  it('should stop and start auto slide on restart timer', () => {
    spyOn(component, 'stopAutoSlide');
    spyOn(component, 'startAutoSlide');
    
    component.restartTimer();
    
    expect(component.stopAutoSlide).toHaveBeenCalled();
    expect(component.startAutoSlide).toHaveBeenCalled();
  });

  it('should clear interval on stop auto slide', () => {
    spyOn(window, 'clearInterval');
    component.intervalId = 123;
    
    component.stopAutoSlide();
    
    expect(clearInterval).toHaveBeenCalledWith(123);
  });

  it('should not clear interval if no intervalId', () => {
    spyOn(window, 'clearInterval');
    component.intervalId = null;
    
    component.stopAutoSlide();
    
    expect(clearInterval).not.toHaveBeenCalled();
  });

  it('should auto advance after interval time', fakeAsync(() => {
    component.stopAutoSlide(); // Ensure clean start
    component.currentIndex = 0;
    component.startAutoSlide();
    
    tick(4000); // Wait for interval
    expect(component.currentIndex).toBe(1);
    
    tick(4000);
    expect(component.currentIndex).toBe(2);
    
    tick(4000);
    expect(component.currentIndex).toBe(0); // Should wrap around
    
    component.stopAutoSlide(); // Clean up
  }));

  it('should display correct transform style', () => {
    component.currentIndex = 1;
    fixture.detectChanges();
    
    const carouselContainer = fixture.nativeElement.querySelector('.flex.transition-transform');
    const expectedTransform = 'translateX(-100%)';
    expect(carouselContainer.style.transform).toBe(expectedTransform);
  });

  it('should render all images', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(3);
  });

  it('should have correct image sources', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    const expectedSources = [
      'https://ofistim.com.tr/wp-content/uploads/2024/01/pupitres-escolares.jpeg',
      'https://www.unillanos.edu.co/images/rotativo2024/COMPUTADORES%20NUEVOS%20IN.png',
      'https://www.unach.edu.ec/wp-content/uploads/2021/12/Mesa-de-trabajo-1.jpeg'
    ];
    
    images.forEach((img: HTMLImageElement, index: number) => {
      expect(img.src).toBe(expectedSources[index]);
    });
  });

  it('should render navigation buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should call prev() when left button is clicked', () => {
    spyOn(component, 'prev');
    const leftButton = fixture.nativeElement.querySelector('button');
    leftButton.click();
    expect(component.prev).toHaveBeenCalled();
  });

  it('should call next() when right button is clicked', () => {
    spyOn(component, 'next');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const rightButton = buttons[1];
    rightButton.click();
    expect(component.next).toHaveBeenCalled();
  });

  it('should have proper CSS classes for carousel container', () => {
    const container = fixture.nativeElement.querySelector('.relative.w-full.overflow-hidden');
    expect(container).toBeTruthy();
  });

  it('should have proper CSS classes for images', () => {
    const images = fixture.nativeElement.querySelectorAll('.w-full.h-64.object-cover.md\\:h-96');
    expect(images.length).toBe(3);
  });

  it('should handle rapid button clicks', () => {
    component.currentIndex = 0;
    
    // Simulate rapid clicks
    component.next();
    component.next();
    component.prev();
    
    expect(component.currentIndex).toBe(1);
  });

  it('should maintain state after multiple cycles', () => {
    component.currentIndex = 0;
    
    // Go through multiple complete cycles
    for (let i = 0; i < 9; i++) { // 3 complete cycles
      component.next();
    }
    
    expect(component.currentIndex).toBe(0); // Should be back to start
  });

  it('should have interval set after starting auto slide', () => {
    component.stopAutoSlide(); // Clear any existing interval
    component.intervalId = null; // Explicitly set to null
    
    component.startAutoSlide();
    expect(component.intervalId).toBeTruthy();
    
    component.stopAutoSlide(); // Clean up
  });

  it('should handle edge cases in navigation', () => {
    // Test with invalid index (shouldn't happen but good to test)
    component.currentIndex = -1;
    component.next();
    expect(component.currentIndex).toBe(0);
    
    component.currentIndex = 5; // Beyond array length
    component.next();
    expect(component.currentIndex).toBe(0); // Should wrap to 0
  });
});
