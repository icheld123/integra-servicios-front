import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer element', () => {
    const footerElement = fixture.nativeElement.querySelector('footer');
    expect(footerElement).toBeTruthy();
  });

  it('should display social media icons', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(4);
  });

  it('should display social media labels', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Twitter');
    expect(compiled.textContent).toContain('Instagram');
    expect(compiled.textContent).toContain('LinkedIn');
    expect(compiled.textContent).toContain('YouTube');
  });

  it('should display developer credits', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Desarrollado por');
    expect(compiled.textContent).toContain('CodePark©');
    expect(compiled.textContent).toContain('Universidad Distrital Francisco José de Caldas');
  });

  it('should have correct CSS classes', () => {
    const footerElement = fixture.nativeElement.querySelector('footer');
    expect(footerElement.classList).toContain('bg-white');
    expect(footerElement.classList).toContain('border-t');
  });

  it('should have images with alt attributes', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    const expectedAlts = ['Twitter', 'Instagram', 'LinkedIn', 'YouTube'];
    
    images.forEach((img: HTMLImageElement, index: number) => {
      expect(img.alt).toBe(expectedAlts[index]);
    });
  });

  it('should have proper image sources', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    const expectedSources = [
      '/assets/x.svg',
      '/assets/instagram.svg', 
      '/assets/facebook.svg',
      '/assets/youtube.svg'
    ];
    
    images.forEach((img: HTMLImageElement, index: number) => {
      expect(img.src).toContain(expectedSources[index]);
    });
  });

  it('should be properly structured', () => {
    expect(component.constructor.name).toBe('FooterComponent');
    expect(fixture.componentInstance).toBeInstanceOf(FooterComponent);
  });
});
